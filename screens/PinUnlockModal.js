import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';

const PinUnlockModal = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [useBiometric, setUseBiometric] = useState(true);
  const [showBiometricButton, setShowBiometricButton] = useState(false);
  const pinInputRef = useRef(null);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [lockTime, setLockTime] = useState(null);

  useEffect(() => {
    checkFirstTimeAndLockStatus();
    setupBackHandler();
    
    // Check for biometric availability
    checkBiometricAvailability();
    
    // Auto-show biometric if available and enabled
    if (useBiometric && showBiometricButton) {
      const timeoutId = setTimeout(() => {
        handleBiometricAuth();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [useBiometric, showBiometricButton]);

  useEffect(() => {
    if (modalVisible) {
      // Focus input when modal becomes visible
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 300);
    }
  }, [modalVisible]);

  const setupBackHandler = () => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (modalVisible) {
          // Prevent going back when PIN modal is visible
          Alert.alert(
            'App Locked',
            'You must enter your PIN to continue using the app.',
            [{ text: 'OK' }]
          );
          return true;
        }
        return false;
      }
    );
    
    return () => backHandler.remove();
  };

  const checkBiometricAvailability = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      
      setShowBiometricButton(available && biometricEnabled === 'true');
    } catch (error) {
      console.error('Error checking biometric:', error);
      setShowBiometricButton(false);
    }
  };

  const checkFirstTimeAndLockStatus = async () => {
    try {
      const pinEnabled = await AsyncStorage.getItem('pin_enabled');
      const firstTime = await AsyncStorage.getItem('first_time_pin_check');
      const lastUnlockTime = await AsyncStorage.getItem('last_unlock_time');
      const lockedUntilTime = await AsyncStorage.getItem('locked_until');
      const storedAttempts = await AsyncStorage.getItem('pin_attempts');
      
      // Check if app is locked due to too many attempts
      if (lockedUntilTime) {
        const lockTime = new Date(lockedUntilTime);
        const now = new Date();
        
        if (now < lockTime) {
          // Still locked
          setLockedUntil(lockTime);
          setModalVisible(true);
          return;
        } else {
          // Lock expired
          await AsyncStorage.removeItem('locked_until');
          await AsyncStorage.setItem('pin_attempts', '0');
        }
      }
      
      // Check if it's first time or PIN is enabled
      if (pinEnabled === 'true') {
        if (firstTime === null) {
          // First time after enabling PIN - show immediately
          await AsyncStorage.setItem('first_time_pin_check', 'done');
          setModalVisible(true);
        } else if (lastUnlockTime) {
          // Check if 3 days have passed
          const lastUnlock = new Date(lastUnlockTime);
          const now = new Date();
          const daysDiff = (now - lastUnlock) / (1000 * 60 * 60 * 24);
          
          if (daysDiff >= 3) {
            setModalVisible(true);
          }
        } else {
          // No last unlock time recorded, show modal
          setModalVisible(true);
        }
      }
      
      // Set attempts from storage
      if (storedAttempts) {
        setAttempts(parseInt(storedAttempts, 10));
      }
    } catch (error) {
      console.error('Error checking lock status:', error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to unlock the app',
      });
      
      if (success) {
        await unlockApp();
      }
    } catch (error) {
      console.error('Biometric auth failed:', error);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/verify-pin/`, { pin }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await unlockApp();
      } else {
        handleFailedAttempt();
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      handleFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const handleFailedAttempt = async () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    await AsyncStorage.setItem('pin_attempts', newAttempts.toString());
    
    if (newAttempts >= 5) {
      // Lock for 5 minutes after 5 failed attempts
      const lockTime = new Date();
      lockTime.setMinutes(lockTime.getMinutes() + 5);
      
      setLockedUntil(lockTime);
      setLockTime(lockTime);
      await AsyncStorage.setItem('locked_until', lockTime.toISOString());
      
      Alert.alert(
        'Too Many Attempts',
        `You have entered the wrong PIN 5 times. The app is locked until ${lockTime.toLocaleTimeString()}.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Incorrect PIN',
        `Wrong PIN entered. You have ${5 - newAttempts} attempts remaining.`,
        [{ text: 'Try Again' }]
      );
    }
    
    setPin('');
    setTimeout(() => {
      pinInputRef.current?.focus();
    }, 500);
  };

  const unlockApp = async () => {
    // Record successful unlock
    await AsyncStorage.setItem('last_unlock_time', new Date().toISOString());
    await AsyncStorage.setItem('pin_attempts', '0');
    await AsyncStorage.removeItem('locked_until');
    
    setModalVisible(false);
    setPin('');
    setAttempts(0);
    setLockedUntil(null);
    
    // Navigate to home if not already there
    if (navigation) {
      navigation.navigate('Home');
    }
  };

  const renderLockTimer = () => {
    if (!lockedUntil) return null;
    
    const now = new Date();
    const diffMs = lockedUntil - now;
    
    if (diffMs <= 0) {
      // Lock expired
      setLockedUntil(null);
      AsyncStorage.removeItem('locked_until');
      AsyncStorage.setItem('pin_attempts', '0');
      return null;
    }
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    return (
      <View style={styles.lockTimerContainer}>
        <Icon name="time-outline" size={20} color="#FF3B30" />
        <Text style={styles.lockTimerText}>
          Try again in {diffMins}:{diffSecs.toString().padStart(2, '0')}
        </Text>
      </View>
    );
  };

  const renderPinInput = () => (
    <View style={styles.pinInputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={pinInputRef}
          style={styles.visiblePinInput}
          keyboardType="number-pad"
          secureTextEntry={!showPin}
          maxLength={4}
          value={pin}
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setPin(numericText);
            
            // Auto-submit when 4 digits entered
            if (numericText.length === 4) {
              handlePinSubmit();
            }
          }}
          autoFocus={true}
          caretHidden={true}
          textAlign="center"
          fontSize={1}
          selectionColor="transparent"
          editable={!lockedUntil}
        />
        
        <View style={styles.pinOverlay}>
          {[0, 1, 2, 3].map((i) => {
            const char = pin[i] || '';
            return (
              <View key={i} style={styles.pinCharacterBox}>
                {showPin ? (
                  <Text style={styles.pinCharacterText}>{char}</Text>
                ) : (
                  <View style={[styles.pinDot, char && styles.pinDotFilled]} />
                )}
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={styles.pinActions}>
        <TouchableOpacity
          style={styles.showPinButton}
          onPress={() => setShowPin(!showPin)}
        >
          <Icon 
            name={showPin ? 'eye-off-outline' : 'eye-outline'} 
            size={20} 
            color="#0d64dd" 
          />
          <Text style={styles.showPinText}>
            {showPin ? 'Hide' : 'Show'} PIN
          </Text>
        </TouchableOpacity>
        
        {attempts > 0 && (
          <Text style={styles.attemptsText}>
            {attempts} failed attempt{attempts !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        // Prevent closing with back button
        return false;
      }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name="lock-closed" size={48} color="#0d64dd" />
              <Text style={styles.modalTitle}>App Locked</Text>
              <Text style={styles.modalSubtitle}>
                {lockedUntil 
                  ? 'Too many failed attempts'
                  : 'Enter your PIN to continue'
                }
              </Text>
            </View>
            
            {lockedUntil ? (
              <View style={styles.lockedContainer}>
                <Icon name="alert-circle-outline" size={60} color="#FF3B30" />
                <Text style={styles.lockedTitle}>Temporarily Locked</Text>
                <Text style={styles.lockedText}>
                  For security reasons, the app is temporarily locked due to multiple failed attempts.
                </Text>
                {renderLockTimer()}
              </View>
            ) : (
              <>
                {renderPinInput()}
                
                {showBiometricButton && (
                  <TouchableOpacity
                    style={styles.biometricButton}
                    onPress={handleBiometricAuth}
                  >
                    <Icon name="finger-print-outline" size={24} color="#fff" />
                    <Text style={styles.biometricButtonText}>
                      Use Biometric
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.submitButton, (!pin || pin.length !== 4) && styles.submitButtonDisabled]}
                  onPress={handlePinSubmit}
                  disabled={!pin || pin.length !== 4 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Unlock</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={() => {
                    Alert.alert(
                      'Forgot PIN?',
                      'Please contact support to reset your PIN.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Contact Support', onPress: () => {
                          // Handle contact support
                        }}
                      ]
                    );
                  }}
                >
                  <Text style={styles.forgotButtonText}>Forgot PIN?</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  pinInputContainer: {
    marginBottom: 25,
    alignItems: 'center',
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    height: 60,
    marginBottom: 15,
  },
  visiblePinInput: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    color: 'transparent',
    backgroundColor: 'transparent',
  },
  pinOverlay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  pinCharacterBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0d64dd',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  pinCharacterText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0d64dd',
  },
  pinDotFilled: {
    backgroundColor: '#0d64dd',
    borderColor: '#0d64dd',
  },
  pinActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  showPinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  showPinText: {
    color: '#0d64dd',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  attemptsText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d64dd',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  biometricButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#0d64dd',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#b3d4fc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotButton: {
    alignSelf: 'center',
    padding: 10,
  },
  forgotButtonText: {
    color: '#0d64dd',
    fontSize: 14,
    fontWeight: '500',
  },
  lockedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  lockedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF3B30',
    marginTop: 15,
    marginBottom: 10,
  },
  lockedText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  lockTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  lockTimerText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default PinUnlockModal;