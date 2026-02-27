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


const checkPinStatus = async (token) => {
  try {
    const response = await axios.get(`${API_ROUTE}/pin-status/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking PIN status:', error);
    return null;
  }
};

const PinUnlockModal = ({ navigation, visible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(visible || false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [useBiometric, setUseBiometric] = useState(true);
  const [showBiometricButton, setShowBiometricButton] = useState(false);
  const pinInputRef = useRef(null);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [hasPin, setHasPin] = useState(false);
  const [pinError, setPinError] = useState('');
  
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (modalVisible && !resetMode) {
      checkFirstTimeAndLockStatus();
      setupBackHandler();
      checkBiometricAvailability();
      
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 300);
    }
  }, [modalVisible, resetMode]);

  useEffect(() => {
    // Auto-show biometric if available and enabled
    if (useBiometric && showBiometricButton && modalVisible && !lockedUntil && !resetMode) {
      const timeoutId = setTimeout(() => {
        handleBiometricAuth();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [useBiometric, showBiometricButton, modalVisible, lockedUntil, resetMode]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clear error when user types
  useEffect(() => {
    if (pinError) {
      setPinError('');
    }
  }, [pin]);

  const setupBackHandler = () => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (modalVisible) {
          if (resetMode) {
            handleBackPress();
            return true;
          }
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

  const handleBackPress = () => {
    if (resetStep > 1) {
      setResetStep(resetStep - 1);
    } else {
      setResetMode(false);
      setResetStep(1);
      setIdentifier('');
      setOtp('');
      setNewPin('');
      setConfirmNewPin('');
      setOtpSent(false);
      setVerificationId(null);
    }
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
      const token = await AsyncStorage.getItem('userToken');
      
      if (pinEnabled === 'true' && token) {
        setHasPin(true);
        
        // Check PIN status from server
        const status = await checkPinStatus(token);
        
        if (status) {
          setAttempts(5 - status.attempts_remaining);
          
          if (status.is_locked) {
            const lockUntil = new Date(Date.now() + status.lock_remaining_seconds * 1000);
            setLockedUntil(lockUntil);
            return;
          }
        }
        
        // Check if it's first time or needs unlock
        const firstTime = await AsyncStorage.getItem('first_time_pin_check');
        const lastUnlockTime = await AsyncStorage.getItem('last_unlock_time');
        
        if (firstTime === null) {
          await AsyncStorage.setItem('first_time_pin_check', 'done');
        } else if (lastUnlockTime) {
          const lastUnlock = new Date(lastUnlockTime);
          const now = new Date();
          const daysDiff = (now - lastUnlock) / (1000 * 60 * 60 * 24);
          
          if (daysDiff >= 3) {
           
          }
        }
      } else {
        // PIN not enabled, close modal
        setModalVisible(false);
        onClose?.();
      }
    } catch (error) {
      console.error('Error checking lock status:', error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      setLoading(true);
      const rnBiometrics = new ReactNativeBiometrics();
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to unlock the app',
      });
      
      if (success) {
        await unlockApp();
      }
    } catch (error) {
      console.error('Biometric auth failed:', error);
      Alert.alert('Authentication Failed', 'Please try again or use PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    setPinError('');
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/verify-pin/`, 
        { pin }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        await unlockApp();
      }
    } catch (error) {
      //console.error('Error verifying PIN:', error.response?.data || error);
      
      if (error.response?.data?.locked) {
      
        const remaining = error.response.data.lock_remaining || 300;
        setLockedUntil(new Date(Date.now() + remaining * 1000));
        setPinError(error.response.data.message || 'PIN is locked. Try again later.');
        
        Alert.alert(
          'PIN Locked',
          error.response.data.message || 'Too many failed attempts. Try again later.'
        );
      } else {
        // Handle failed attempt
        const attemptsLeft = error.response?.data?.attempts_left || (5 - attempts - 1);
        setAttempts(prev => 5 - attemptsLeft);
        setPinError(error.response?.data?.message || `Wrong PIN. ${attemptsLeft} attempts remaining.`);
        
        Alert.alert(
          'Incorrect PIN',
          error.response?.data?.message || `Wrong PIN. ${attemptsLeft} attempts remaining.`
        );
      }
      
      setPin('');
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPin = () => {
    Alert.alert(
      'Reset PIN',
      'How would you like to reset your PIN?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Via Email', 
          onPress: () => {
            setResetMode(true);
            setResetStep(1);
          }
        },
        // { 
        //   text: 'Via Phone', 
        //   onPress: () => {
        //     setResetMode(true);
        //     setResetStep(1);
        //   }
        // }
      ]
    );
  };

  const handleSendOtp = async () => {
    if (!identifier) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }

    setResetLoading(true);
    
    try {
      const data = {};
      if (identifier.includes('@')) {
        data.email = identifier;
      } else {
        data.phone = identifier;
      }

      const response = await axios.post(`${API_ROUTE}/send-otp/`, data);

      if (response.data.message) {
        setOtpSent(true);
        setCountdown(60);
        Alert.alert('Success', response.data.message || 'OTP sent successfully');
        setResetStep(2);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setResetLoading(true);
    
    try {
      const data = {
        otp: otp
      };
      
      if (identifier.includes('@')) {
        data.email = identifier;
      } else {
        data.phone = identifier;
      }

      console.log('Verifying OTP with data:', data);

      const response = await axios.post(`${API_ROUTE}/verify-otp/`, data);

      if (response.data.message === "OTP verified successfully") {
        if (response.data.is_new_user) {
          Alert.alert('Error', 'No account found with this information');
          return;
        }
        
        Alert.alert('Success', 'OTP verified successfully');
        setResetStep(3);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data || error);
      Alert.alert('Error', error.response?.data?.error || 'Invalid OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSetNewPin = async () => {
    if (resetStep === 3) {
      if (newPin.length !== 4) {
        Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
        return;
      }
      setResetStep(4);
      return;
    }

    if (resetStep === 4) {
      if (newPin !== confirmNewPin) {
        Alert.alert('PIN Mismatch', 'The PINs do not match');
        return;
      }

      setResetLoading(true);
      
      try {
        const data = {
          otp: otp,
          new_pin: newPin
        };
        
        if (identifier.includes('@')) {
          data.email = identifier;
        } else {
          data.phone = identifier;
        }

        console.log('Sending reset PIN request:', JSON.stringify(data, null, 2));

        const response = await axios.post(`${API_ROUTE}/reset-pin/`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.data.success) {
          Alert.alert(
            'Success', 
            'PIN reset successfully. Please login with your new PIN.',
            [
              { 
                text: 'OK', 
                onPress: () => {
                  setResetMode(false);
                  setResetStep(1);
                  setIdentifier('');
                  setOtp('');
                  setNewPin('');
                  setConfirmNewPin('');
                  setOtpSent(false);
                  setPin('');
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error('Error resetting PIN:', error.response?.data || error);
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Failed to reset PIN';
        Alert.alert('Error', errorMessage);
      } finally {
        setResetLoading(false);
      }
    }
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
    setPinError('');
    setResetMode(false);
    setResetStep(1);
    setIdentifier('');
    setOtp('');
    setNewPin('');
    setConfirmNewPin('');
    setOtpSent(false);
    
    // Call onClose callback
    onClose?.();
    
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
          }}
          autoFocus={true}
          caretHidden={true}
          textAlign="center"
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
      
      {pinError ? (
        <Text style={styles.errorText}>{pinError}</Text>
      ) : null}
      
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

  const renderResetContent = () => {
    switch (resetStep) {
      case 1:
        return (
          <>
            <View style={styles.modalHeader}>
             
              <Text style={styles.modalTitle}>Reset PIN</Text>
              <Text style={styles.modalSubtitle}>
                Enter your email or phone number to receive OTP
              </Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Email or Phone"
                placeholderTextColor="#999"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType={identifier.includes('@') ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
              />
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, !identifier && styles.submitButtonDisabled]}
              onPress={handleSendOtp}
              disabled={!identifier || resetLoading}
            >
              {resetLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        );

      case 2:
        return (
          <>
            <View style={styles.modalHeader}>
              <Icon name="key" size={48} color="#0d64dd" />
              <Text style={styles.modalTitle}>Verify OTP</Text>
              <Text style={styles.modalSubtitle}>
                Enter the 6-digit code sent to your {identifier.includes('@') ? 'email' : 'phone'}
              </Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#999"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, otp.length < 6 && styles.submitButtonDisabled]}
              onPress={handleVerifyOtp}
              disabled={otp.length < 6 || resetLoading}
            >
              {resetLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleSendOtp}
              disabled={countdown > 0}
            >
              <Text style={[
                styles.resendButtonText,
                countdown > 0 && styles.resendButtonDisabled
              ]}>
                Resend OTP {countdown > 0 ? `(${countdown}s)` : ''}
              </Text>
            </TouchableOpacity>
          </>
        );

      case 3:
      case 4:
        return (
          <>
            <View style={styles.modalHeader}>
             
              <Text style={styles.modalTitle}>Create New PIN</Text>
              <Text style={styles.modalSubtitle}>
                {resetStep === 3 ? 'Enter your new 4-digit PIN' : 'Confirm your new PIN'}
              </Text>
            </View>
            
            <View style={styles.pinInputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={pinInputRef}
                  style={styles.visiblePinInput}
                  keyboardType="number-pad"
                  secureTextEntry={!showPin}
                  maxLength={4}
                  value={resetStep === 3 ? newPin : confirmNewPin}
                  onChangeText={text => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    if (resetStep === 3) setNewPin(numericText);
                    else setConfirmNewPin(numericText);
                  }}
                  autoFocus={true}
                  caretHidden={true}
                  textAlign="center"
                  selectionColor="transparent"
                />
                
                <View style={styles.pinOverlay}>
                  {[0, 1, 2, 3].map((i) => {
                    const currentValue = resetStep === 3 ? newPin : confirmNewPin;
                    const char = currentValue[i] || '';
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
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, 
                (resetStep === 3 && newPin.length !== 4) ||
                (resetStep === 4 && confirmNewPin.length !== 4) && styles.submitButtonDisabled
              ]}
              onPress={handleSetNewPin}
              disabled={
                (resetStep === 3 && newPin.length !== 4) ||
                (resetStep === 4 && confirmNewPin.length !== 4) ||
                resetLoading
              }
            >
              {resetLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {resetStep === 3 ? 'Continue' : 'Reset PIN'}
                </Text>
              )}
            </TouchableOpacity>
          </>
        );
    }
  };


  if (!modalVisible || !hasPin) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        // Prevent closing with back button
        if (resetMode) {
          handleBackPress();
        }
        return false;
      }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {resetMode && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackPress}
              >
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            )}
            
            {resetMode ? (
              renderResetContent()
            ) : (
              <>
                <View style={styles.modalHeader}>
                 
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
                        disabled={loading}
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
                      onPress={handleForgotPin}
                    >
                      <Text style={styles.forgotButtonText}>Forgot PIN?</Text>
                    </TouchableOpacity>
                  </>
                )}
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
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
    padding: 5,
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
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
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
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
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
  resendButton: {
    alignSelf: 'center',
    padding: 10,
    marginTop: 10,
  },
  resendButtonText: {
    color: '#0d64dd',
    fontSize: 14,
    fontWeight: '500',
  },
  resendButtonDisabled: {
    color: '#999',
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