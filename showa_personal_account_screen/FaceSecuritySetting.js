import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

const PrivacySettings = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [settings, setSettings] = useState({
    pinSecurity: false,
    faceRecognition: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPin, setShowPin] = useState(false);
  const pinInputRef = useRef(null);
  

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
        const pinEnabled = await AsyncStorage.getItem('pin_enabled');
        
        setSettings({
          pinSecurity: pinEnabled === 'true',
          faceRecognition: biometricEnabled === 'true',
        });
      } catch (error) {
       // console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSetPin = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return;
    }
    
    if (step === 1) {setStep(2); return;}
    
    if (pin !== confirmPin) {Alert.alert('PIN Mismatch', 'The PINs you entered do not match');
      return;}

    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    
    try {
      const response = await axios.post(`${API_ROUTE}/set-pin/`, { pin }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      
        await AsyncStorage.setItem('pin_enabled', 'true');
        setSettings(prev => ({ ...prev, pinSecurity: true }));
        setModalVisible(false);
        setPin('');
        setConfirmPin('');
        setStep(1);
        Alert.alert("Success", "PIN set successfully");
     
      
    } catch (error) {
      //console.log('Error setting PIN:', error);
      Alert.alert("Error", "Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = async (key) => {
    if (key === 'faceRecognition') {
      if (!settings.faceRecognition) {
        const rnBiometrics = new ReactNativeBiometrics();
        const { available, biometryType } = await rnBiometrics.isSensorAvailable();

        if (available) {
          const result = await rnBiometrics.simplePrompt({
            promptMessage: 'Authenticate to enable biometric login',
          });

          if (result.success) {
            await AsyncStorage.setItem('biometric_enabled', 'true');
            setSettings(prev => ({ ...prev, [key]: true }));
            Alert.alert(
              'Biometrics Enabled', 
              `${biometryType} authentication is now active. You can use it to unlock the app.`,
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert(
              'Authentication Cancelled', 
              'You need to authenticate to enable this feature.',
              [{ text: 'OK' }]
            );
          }
        } else {
          Alert.alert(
            'Device Not Supported', 
            'Your device does not support biometric authentication or it is not configured.',
            [{ text: 'OK' }]
          );
        }
      } else {
        await AsyncStorage.removeItem('biometric_enabled');
        setSettings(prev => ({ ...prev, [key]: false }));
        Alert.alert(
          'Biometrics Disabled', 
          'Biometric authentication has been turned off for this app.',
          [{ text: 'OK' }]
        );
      }
    } else if (key === 'pinSecurity') {
      if (!settings.pinSecurity) {
        setModalVisible(true);
      } else {
        await AsyncStorage.removeItem('pin_enabled');
        setSettings(prev => ({ ...prev, [key]: false }));
        Alert.alert(
          'PIN Disabled', 
          'PIN security has been turned off for this app.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const menuItems = [
    {
      key: 'pinSecurity',
      label: 'PIN Security',
      description: 'Secure your app with a 4-digit PIN code. Required for accessing private chats.',
      icon: 'lock-closed-outline',
      requiresSetup: true,
    },
    {
      key: 'faceRecognition',
      label: 'Biometric Authentication',
      description: 'Use Face ID, Touch ID, or device biometrics for faster, more secure access.',
      icon: 'finger-print-outline',
      requiresSetup: false,
    },
  ];

  const styles = createStyles(colors, isDark);

  return (
    <>
     
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#0d64dd"
        translucent={Platform.OS === 'android'}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={[
            styles.header,
            Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }
          ]}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
              <Text style={styles.headerTitle}>Privacy & Security</Text>
            </TouchableOpacity>
            <Text style={styles.headerSubtitle}>Manage your app security preferences</Text>
          </View>

          {/* Security Level Indicator */}
          <View style={styles.securityLevelContainer}>
            <Text style={styles.securityLevelText}>Security Level:</Text>
            <View style={styles.securityLevelBar}>
              <View style={[
                styles.securityLevelFill, 
                { 
                  width: `${(settings.pinSecurity || settings.faceRecognition) ? 
                    (settings.pinSecurity && settings.faceRecognition ? 100 : 50) : 0}%`,
                  backgroundColor: settings.pinSecurity && settings.faceRecognition ? 
                    (isDark ? '#10b981' : '#4CAF50') : 
                    (isDark ? '#f59e0b' : '#FFC107')
                }
              ]} />
            </View>
            <Text style={styles.securityLevelStatus}>
              {settings.pinSecurity && settings.faceRecognition ? 'Maximum Security' :
              settings.pinSecurity || settings.faceRecognition ? 'Medium Security' : 'Basic Security'}
            </Text>
          </View>

          {/* Settings List */}
          <View style={styles.menu}>
            {menuItems.map(({ key, label, icon, description }) => (
              <TouchableOpacity 
                key={key} 
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => toggleSwitch(key)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconWrapper, settings[key] && styles.activeIconWrapper]}>
                    <Icon 
                      name={icon} 
                      size={20} 
                      color={settings[key] ? 
                        (isDark ? '#60a5fa' : '#0d64dd') : 
                        (isDark ? '#9ca3af' : '#666')
                      } 
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.menuText}>{label}</Text>
                    <Text style={styles.menuDescriptionText}>{description}</Text>
                    {settings[key] && (
                      <Text style={styles.activeStatusText}>
                        <Icon name="checkmark-circle" size={14} color={isDark ? '#10b981' : '#4CAF50'} /> Active
                      </Text>
                    )}
                  </View>
                </View>
                <Switch
                  value={settings[key]}
                  onValueChange={() => toggleSwitch(key)}
                  thumbColor={settings[key] ? '#0d64dd' : isDark ? '#6b7280' : '#f4f3f4'}
                  trackColor={{ 
                    true: isDark ? '#1e3a8a' : '#b3d4fc', 
                    false: isDark ? '#4b5563' : '#e6e6e6' 
                  }}
                  ios_backgroundColor={isDark ? '#4b5563' : '#e6e6e6'}
                  style={styles.switch}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Security Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Security Tips</Text>
            <View style={styles.tipItem}>
              <Icon name="shield-checkmark-outline" size={16} color={isDark ? '#60a5fa' : '#0d64dd'} />
              <Text style={styles.tipText}>For maximum security, enable both PIN and biometric authentication</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="time-outline" size={16} color={isDark ? '#60a5fa' : '#0d64dd'} />
              <Text style={styles.tipText}>The app will automatically lock after 5 minutes of inactivity</Text>
            </View>
          </View>

          {/* PIN Setup Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setStep(1);
              setPin('');
              setConfirmPin('');
            }}
          >
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={() => {
                      setModalVisible(false);
                      setStep(1);
                      setPin('');
                      setConfirmPin('');
                    }}
                  >
                    <Icon name="close" size={24} color={isDark ? colors.text : '#666'} />
                  </TouchableOpacity>
                  
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Set Up 2FA Security</Text>
                    <Text style={styles.modalSubtitle}>
                      {step === 1 ? 'Create a 4-digit PIN' : 'Confirm your PIN'}
                    </Text>
                  </View>
                  
                  <View style={styles.pinInputContainer}>
                    <TextInput
                      ref={pinInputRef}
                      style={[styles.pinInput, { 
                        opacity: 1, 
                        color: isDark ? colors.text : '#333' 
                      }]}
                      keyboardType="number-pad"
                      secureTextEntry={!showPin}
                      maxLength={4}
                      value={step === 1 ? pin : confirmPin}
                      onChangeText={text => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        step === 1 ? setPin(numericText) : setConfirmPin(numericText);
                      }}
                      autoFocus={true}
                      caretHidden={true}
                      contextMenuHidden={true}
                      selectTextOnFocus={true}
                      placeholderTextColor={isDark ? '#9ca3af' : '#999'}
                      onFocus={() => {
                        if (step === 1 && pin.length === 0) {
                          setPin('');
                        } else if (step === 2 && confirmPin.length === 0) {
                          setConfirmPin('');
                        }
                      }}
                    />
                    
                    <TouchableOpacity
                      style={styles.pinDisplayContainer}
                      activeOpacity={1}
                      onPress={() => {
                        pinInputRef.current?.focus();
                      }}
                    >
                      {[0, 1, 2, 3].map((i) => {
                        const currentValue = step === 1 ? pin : confirmPin;
                        const char = currentValue[i] || '';
                        return (
                          <View key={i} style={[
                            styles.pinCharacterBox,
                            { borderColor: isDark ? '#60a5fa' : '#0d64dd' }
                          ]}>
                            {showPin ? (
                              <Text style={[styles.pinCharacterText, { color: isDark ? colors.text : '#333' }]}>
                                {char}
                              </Text>
                            ) : (
                              <View style={[
                                styles.pinDot, 
                                char && styles.pinDotFilled,
                                { borderColor: isDark ? '#60a5fa' : '#0d64dd' },
                                char && { backgroundColor: isDark ? '#60a5fa' : '#0d64dd' }
                              ]} />
                            )}
                          </View>
                        );
                      })}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.showPinButton}
                      onPress={() => setShowPin(!showPin)}
                    >
                      <Icon 
                        name={showPin ? 'eye-off-outline' : 'eye-outline'} 
                        size={20} 
                        color={isDark ? '#60a5fa' : '#0d64dd'} 
                      />
                      <Text style={[styles.showPinText, { color: isDark ? '#60a5fa' : '#0d64dd' }]}>
                        {showPin ? 'Hide' : 'Show'} PIN
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, (!pin || (step === 2 && !confirmPin)) && styles.modalButtonDisabled]}
                    onPress={handleSetPin}
                    disabled={!pin || (step === 2 && !confirmPin) || loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalButtonText}>
                        {step === 1 ? 'Continue' : 'Confirm PIN'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  
                  {step === 2 && (
                    <TouchableOpacity
                      style={styles.modalBackButton}
                      onPress={() => {
                        setStep(1);
                        setConfirmPin('');
                      }}
                    >
                      <Text style={[styles.modalBackButtonText, { color: isDark ? '#60a5fa' : '#0d64dd' }]}>
                        <Icon name="arrow-back" size={16} /> Back
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: '#0d64dd',
    paddingTop: Platform.OS === 'ios' ? 50 : 50 + (StatusBar.currentHeight || 0),
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    marginLeft: 15,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 39,
    marginTop: -5,
  },
  securityLevelContainer: {
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.1 : 0.05,
    shadowRadius: 3,
    elevation: isDark ? 4 : 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
  },
  securityLevelText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  securityLevelBar: {
    height: 8,
    backgroundColor: isDark ? colors.border : '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  securityLevelFill: {
    height: '100%',
    borderRadius: 4,
  },
  securityLevelStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },
  menu: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.1 : 0.05,
    shadowRadius: 3,
    elevation: isDark ? 4 : 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    backgroundColor: isDark ? '#1e3a8a' : '#f0f7ff',
    padding: 12,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e0f0ff',
  },
  activeIconWrapper: {
    backgroundColor: isDark ? '#1e40af' : '#e0f0ff',
    borderColor: isDark ? '#3b82f6' : '#b3d4fc',
  },
  textContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  menuDescriptionText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  activeStatusText: {
    fontSize: 12,
    color: isDark ? '#10b981' : '#4CAF50',
    marginTop: 5,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    marginLeft: 10,
  },
  tipsContainer: {
    margin: 20,
    marginTop: 30,
    padding: 20,
    backgroundColor: isDark ? '#1e3a8a' : '#f0f7ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#d0e3ff',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#60a5fa' : '#0d64dd',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    color: isDark ? '#d1d5db' : '#555',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  pinInputContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  pinInput: {
    position: 'absolute',
    width: '100%',
    height: 60,
    opacity: 0,
  },
  pinDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pinCharacterBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  pinCharacterText: {
    fontSize: 20,
    color: colors.text,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  pinDotFilled: {
    backgroundColor: isDark ? '#60a5fa' : '#0d64dd',
    borderColor: isDark ? '#60a5fa' : '#0d64dd',
  },
  showPinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  showPinText: {
    marginLeft: 5,
    fontSize: 14,
  },
  modalButton: {
    backgroundColor: '#0d64dd',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    backgroundColor: isDark ? '#374151' : '#b3d4fc',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalBackButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  modalBackButtonText: {
    fontSize: 14,
  },
});

export default PrivacySettings;