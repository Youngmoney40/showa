
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../../src/services/NotificationService';

const VerificationCodeScreen = ({ route }) => {
  // Get all possible params
  const emailId = route.params?.emailID;
  const phoneNumberID = route.params?.phoneNumberID;
  const contactID = route.params?.contactID; 
  const contactType = route.params?.contactType || 'email'; 
  const purpose = route.params?.purpose || 'login';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const navigation = useNavigation();
  const inputsRef = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Determine what to display as the contact info
  const getDisplayContact = () => {
    if (contactID) {
      return contactID;
    }
    if (emailId) {
      return emailId;
    }
    if (phoneNumberID) {
      return phoneNumberID;
    }
    return 'your contact';
  };

  const getDisplayType = () => {
    if (contactType === 'phone') return 'phone number';
    return 'email';
  };

  const registerDevice = async () => {
    const userToken = await AsyncStorage.getItem('userToken'); 
    await NotificationService.initialize(userToken);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  };

  const handleCodeChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      setError('');
      if (text && index < 5) inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  const redirectBack = () => navigation.goBack();

  const resendOTP = async () => {
    try {
      setResending(true);
      let payload;
      
      if (contactID) {
        payload = contactType === 'email' 
          ? { email: contactID, purpose }
          : { phone: contactID, purpose };
      } else if (emailId) {
        payload = { email: emailId, purpose };
      } else if (phoneNumberID) {
        payload = { phone: phoneNumberID, purpose };
      } else {
        throw new Error('No contact info available');
      }
      
      const response = await axios.post(`${API_ROUTE}/send-otp/`, payload);

      if (response.status === 200 || response.status === 201) {
        setTimer(300);
        setError('');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
    } finally { 
      setResending(false); 
    }
  };


  const verifyOTP = async () => {
  const otpResult = code.join(''); 
  setLoading(true);
  
  try {
    let payload;
    
    if (contactID) {
      payload = contactType === 'email' 
        ? { email: contactID, otp: otpResult }
        : { phone: contactID, otp: otpResult };
    } else if (emailId) {
      payload = { email: emailId, otp: otpResult };
    } else if (phoneNumberID) {
      payload = { phone: phoneNumberID, otp: otpResult };
    } else {
      throw new Error('No contact info available');
    }
    
    console.log('Verifying with payload:', payload);
    
    const response = await axios.post(`${API_ROUTE}/verify-otp/`, payload);
    
    console.log('Verify response:', response.status, response.data);
    
    if (response.status === 200) {
      
      navigation.replace('EmailRegister', {
        verifiedEmail: contactType === 'email' ? contactID : emailId,
        verifiedPhone: contactType === 'phone' ? contactID : phoneNumberID,
        contactType: contactType,
        isVerified: true
      });
    } else {
      setError(response.data?.error || 'Incorrect code. Try again.');
      startShake();
    }
  } catch (err) {
    console.error('Verification error:', err.response?.data || err.message);
    
    if (err.response?.data?.error) {
      setError(err.response.data.error);
    } else {
      setError('Verification failed. Please try again.');
    }
    startShake();
  } finally {
    setLoading(false);
  }
};

  // const verifyOTP = async () => {
  //   const otpResult = code.join(''); 
  //   setLoading(true);
    
  //   try {
  //     let payload;
      
  //     // Build payload based on available params
  //     if (contactID) {
  //       payload = contactType === 'email' 
  //         ? { email: contactID, otp: otpResult }
  //         : { phone: contactID, otp: otpResult };
  //     } else if (emailId) {
  //       payload = { email: emailId, otp: otpResult };
  //     } else if (phoneNumberID) {
  //       payload = { phone: phoneNumberID, otp: otpResult };
  //     } else {
  //       throw new Error('No contact info available');
  //     }
      
  //     console.log('Verifying with payload:', payload);
      
  //     const response = await axios.post(`${API_ROUTE}/verify-otp/`, payload);
      
  //     console.log('Verify response:', response.status, response.data);
      
  //     if (response.status === 200) {
  //       const { token, refresh, user } = response.data;
        
  //       // Store user data
  //       // await AsyncStorage.multiSet([
  //       //   ['userToken', token],
  //       //   ['refreshToken', refresh],
  //       //   ['userData', JSON.stringify(user)],
  //       //   ['isVerified', 'true'],
  //       //   ['userEmail', user.email || ''],
  //       //   ['userId', user.id.toString()],
  //       // ]);
        
  //       // Register device for push notifications
  //       await registerDevice();
        
  //       // Navigate to next screen
  //       navigation.replace('EmailRegister');

  //       navigation.navigate('EmailRegister', {
  //         contactID: phoneNumberID,  // The email or phone number
  //         contactType: contactType,  // 'email' or 'phone'
  //         email: emailId,
  //         //phoneNumberID: phoneNumber
  //       });
  //     } else {
  //       setError(response.data?.error || 'Incorrect code. Try again.');
  //       startShake();
  //     }
  //   } catch (err) {
  //     console.error('Verification error:', err.response?.data || err.message);
      
  //     // Handle specific error messages from backend
  //     if (err.response?.data?.error) {
  //       setError(err.response.data.error);
  //     } else {
  //       setError('Verification failed. Please try again.');
  //     }
  //     startShake();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getButtonText = () => 'PROCEED';

  const displayContact = getDisplayContact();
  const displayType = getDisplayType();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Icon */}
        <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.verificationIcon}>
          <Icon name="lock-closed" size={40} color="#fff" />
        </LinearGradient>
        
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your {displayType}:
        </Text>
        <Text style={styles.emailText}>{displayContact}</Text>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Icon name="time-outline" size={16} color="#d00" />
          <Text style={styles.timerText}>
            Expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </Text>
        </View>

        {/* Error */}
        {error && (
          <Animated.View style={[styles.errorContainer, { transform: [{ translateX: shakeAnimation }] }]}>
            <Icon name="warning-outline" size={16} color="#ff3b30" />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        {/* Code Inputs */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => (inputsRef.current[index] = el)}
              value={digit}
              onChangeText={text => handleCodeChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              maxLength={1}
              placeholder="•"
              placeholderTextColor='#ccc'
              keyboardType="numeric"
              style={[styles.codeInput, error && styles.codeInputError, digit && styles.codeInputFilled]}
              autoFocus={index === 0}
              textContentType="oneTimeCode"
              editable={!loading}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.submitButton}
          disabled={!isCodeComplete || loading}
          onPress={verifyOTP}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isCodeComplete && !loading ? ['#0d64dd', '#0d64dd'] : ['#8fb1ff', '#a8c4ff']}
            style={styles.buttonGradient}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.submitButtonText, styles.buttonTextWithLoader]}>
                    VERIFYING...
                  </Text>
                </>
              ) : (
                <Text style={styles.submitButtonText}>{getButtonText()}</Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity
          onPress={resendOTP}
          style={styles.resendContainer}
          disabled={timer > 0 || resending}
        >
          <View style={styles.resendContent}>
            <Icon name="refresh" size={16} color={timer > 0 ? '#999' : '#0d64dd'} />
            <Text style={[styles.resendText, { color: timer > 0 ? '#999' : '#0d64dd' }]}>
              {resending ? 'Sending code...' : (timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2,'0')}` : "Didn't receive the code? Resend")}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9ebf1' },
  scrollContainer: { flexGrow: 1, alignItems: 'center', padding: 25 },

  verificationIcon: {
    width: 80, height: 80, borderRadius: 40, marginTop: 80,
    justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
    marginBottom: 20,
  },

  title: { fontSize: 28, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 5 },
  emailText: { fontSize: 16, color: '#0d64dd', fontWeight: '600', marginBottom: 20, textAlign: 'center' },

  timerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  timerText: { fontSize: 16, color: '#d00', fontWeight: '500', marginLeft: 5 },

  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffebee', padding: 12, borderRadius: 8, marginBottom: 20, alignSelf: 'stretch' },
  errorText: { color: '#ff3b30', marginLeft: 8, fontSize: 14, fontWeight: '500' },

  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, width: '100%' },
  codeInput: { width: 50, height: 60, borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 12, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#333', backgroundColor: '#f9f9f9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  codeInputFilled: { borderColor: '#0d64dd', backgroundColor: '#fff' },
  codeInputError: { borderColor: '#ff3b30' },

  submitButton: { 
    borderRadius: 12, 
    overflow: 'hidden', 
    marginBottom: 20, 
    width: '100%', 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4,
  },
  buttonGrafdient: {
    borderRadius: 12, 
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: 22,
  },
  buttonContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 10,
  },
  submitButtonText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16, 
    letterSpacing: 0.5,
    padding: 15
  },
  buttonTextWithLoader: {
    marginLeft: 8,
  },

  resendContainer: { marginTop: 10 },
  resendContent: { flexDirection: 'row', alignItems: 'center' },
  resendText: { fontSize: 14, fontWeight: '500', marginLeft: 5 },
});

export default VerificationCodeScreen;

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
//   Easing,
//   StatusBar,
//   ActivityIndicator,
//   ScrollView,
//   AppState,
//   PermissionsAndroid,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NotificationService from '../../src/services/NotificationService';
// // Import SmsRetriever properly
// import SmsRetriever from 'react-native-sms-retriever';

// const VerificationCodeScreen = ({ route }) => {
//   // Get all possible params
//   const emailId = route.params?.emailID;
//   const phoneNumberID = route.params?.phoneNumberID;
//   const contactID = route.params?.contactID; // Can be email or phone
//   const contactType = route.params?.contactType || 'email'; // 'email' or 'phone'
//   const purpose = route.params?.purpose || 'login';

//   const [code, setCode] = useState(['', '', '', '', '', '']);
//   const [timer, setTimer] = useState(300);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [autoProceedPending, setAutoProceedPending] = useState(false);
//   const [smsAutoFillSupported, setSmsAutoFillSupported] = useState(false);

//   const navigation = useNavigation();
//   const inputsRef = useRef([]);
//   const shakeAnimation = useRef(new Animated.Value(0)).current;
//   const autoProceedTimeoutRef = useRef(null);
//   const smsListenerRef = useRef(null);

//   // Determine what to display as the contact info
//   const getDisplayContact = () => {
//     if (contactID) {
//       return contactID;
//     }
//     if (emailId) {
//       return emailId;
//     }
//     if (phoneNumberID) {
//       return phoneNumberID;
//     }
//     return 'your contact';
//   };

//   const getDisplayType = () => {
//     if (contactType === 'phone') return 'phone number';
//     return 'email';
//   };

//   const registerDevice = async () => {
//     const userToken = await AsyncStorage.getItem('userToken'); 
//     await NotificationService.initialize(userToken);
//   };

//   // ─── SMS Auto-fill Setup ──────────────────────────────────────────────────
//   useEffect(() => {
//     // Only auto-fill for phone number verification on Android
//     if (contactType === 'phone' && Platform.OS === 'android') {
//       setupSmsRetriever();
//     }

//     return () => {
//       // Cleanup
//       if (autoProceedTimeoutRef.current) {
//         clearTimeout(autoProceedTimeoutRef.current);
//       }
//       if (smsListenerRef.current) {
//         SmsRetriever.stopSmsReceiver().catch(console.error);
//         smsListenerRef.current = null;
//       }
//     };
//   }, []);

//   const setupSmsRetriever = async () => {
//     try {
//       // Check if SmsRetriever is available
//       if (!SmsRetriever) {
//         console.warn('⚠️ SmsRetriever not available');
//         return;
//       }

//       // Request SMS permission for Android 6+
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_SMS,
//           {
//             title: 'SMS Permission',
//             message: 'This app needs access to your SMS to automatically verify your phone number.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
        
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.warn('⚠️ SMS permission denied');
//           return;
//         }
//       }

//       // Get app signature (hash)
//       let hash;
//       try {
//         hash = await SmsRetriever.getAppSignature();
//         console.log('📱 SMS Retriever hash:', hash);
//         setSmsAutoFillSupported(true);
//       } catch (hashError) {
//         console.warn('⚠️ Could not get app signature:', hashError);
//         // Continue without hash - some devices might still work
//       }
      
//       // Start listening for SMS
//       const registered = await SmsRetriever.startSmsReceiver();
      
//       if (registered) {
//         console.log('✅ SMS Receiver started');
        
//         // Add listener for SMS
//         const smsListener = SmsRetriever.addSmsListener((event) => {
//           console.log('📨 SMS received:', event);
//           if (event && event.message) {
//             handleSmsReceived(event.message);
//           }
//         });
        
//         smsListenerRef.current = smsListener;

//         // Listen for app state changes to handle SMS properly
//         const subscription = AppState.addEventListener('change', (nextAppState) => {
//           if (nextAppState === 'active') {
//             // Try to get SMS when app becomes active
//             SmsRetriever.startSmsReceiver().catch(console.error);
//           }
//         });

//         return () => {
//           smsListener?.remove();
//           subscription?.remove();
//           SmsRetriever.stopSmsReceiver().catch(console.error);
//         };
//       } else {
//         console.warn('⚠️ Could not start SMS receiver');
//       }
//     } catch (error) {
//       console.error('❌ SMS Retriever setup failed:', error);
//       // Fallback - try to use manual SMS reading
//       setupManualSmsRetriever();
//     }
//   };

//   // ─── Manual SMS Retriever Fallback ──────────────────────────────────────
//   const setupManualSmsRetriever = async () => {
//     try {
//       // For some devices, we need to use a different approach
//       const { SmsRetriever: ManualSmsRetriever } = require('react-native-sms-retriever');
      
//       // Try alternative method
//       const hash = await ManualSmsRetriever.getAppSignature().catch(() => null);
//       console.log('📱 Manual SMS hash:', hash);
      
//       // Start receiver using alternative method
//       const started = await ManualSmsRetriever.startSmsReceiver();
//       if (started) {
//         console.log('✅ Manual SMS receiver started');
//         setSmsAutoFillSupported(true);
        
//         const listener = ManualSmsRetriever.addSmsListener((event) => {
//           if (event && event.message) {
//             handleSmsReceived(event.message);
//           }
//         });
        
//         smsListenerRef.current = listener;
//       }
//     } catch (error) {
//       console.warn('⚠️ Manual SMS retriever failed:', error);
//     }
//   };

//   // ─── Handle Received SMS ──────────────────────────────────────────────────
//   const handleSmsReceived = (message) => {
//     try {
//       console.log('📨 Processing SMS message:', message);
      
//       // Look for 6-digit OTP code in the message
//       const otpMatch = message.match(/\b\d{6}\b/);
      
//       if (otpMatch) {
//         const otpCode = otpMatch[0];
//         console.log('🔐 OTP extracted from SMS:', otpCode);
        
//         // Fill the OTP inputs
//         const otpDigits = otpCode.split('');
//         const newCode = [...code];
        
//         otpDigits.forEach((digit, index) => {
//           if (index < 6) {
//             newCode[index] = digit;
//           }
//         });
        
//         setCode(newCode);
//         setError('');
        
//         // Auto-proceed after filling the code
//         if (autoProceedTimeoutRef.current) {
//           clearTimeout(autoProceedTimeoutRef.current);
//         }
        
//         autoProceedTimeoutRef.current = setTimeout(() => {
//           if (newCode.every(digit => digit !== '')) {
//             console.log('🚀 Auto-proceeding after SMS fill');
//             setAutoProceedPending(true);
//             verifyOTP();
//           }
//         }, 500); // Small delay to ensure state is updated
//       } else {
//         console.log('ℹ️ No OTP found in SMS');
//       }
//     } catch (error) {
//       console.error('❌ Error processing SMS:', error);
//     }
//   };

//   // ─── Manual OTP Input ─────────────────────────────────────────────────────
//   const handleCodeChange = (text, index) => {
//     if (/^\d*$/.test(text)) {
//       const newCode = [...code];
//       newCode[index] = text;
//       setCode(newCode);
//       setError('');
      
//       if (text && index < 5) {
//         inputsRef.current[index + 1]?.focus();
//       }
      
//       // Check if code is complete and auto-proceed
//       const isComplete = newCode.every(digit => digit !== '');
//       if (isComplete && !loading && !autoProceedPending) {
//         // Small delay to allow user to see the last digit being entered
//         if (autoProceedTimeoutRef.current) {
//           clearTimeout(autoProceedTimeoutRef.current);
//         }
//         autoProceedTimeoutRef.current = setTimeout(() => {
//           console.log('🚀 Auto-proceeding after manual entry');
//           setAutoProceedPending(true);
//           verifyOTP();
//         }, 400);
//       }
//     }
//   };

//   const handleKeyPress = ({ nativeEvent }, index) => {
//     if (nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   // ─── Timer ─────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // ─── Animations ────────────────────────────────────────────────────────────
//   const startShake = () => {
//     Animated.sequence([
//       Animated.timing(shakeAnimation, { toValue: 10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: -10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: 10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//     ]).start();
//   };

//   // ─── Verification ──────────────────────────────────────────────────────────
//   const verifyOTP = async () => {
//     // Prevent multiple calls
//     if (loading || autoProceedPending) return;
    
//     const otpResult = code.join(''); 
//     setLoading(true);
//     setAutoProceedPending(false);
    
//     try {
//       let payload;
      
//       if (contactID) {
//         payload = contactType === 'email' 
//           ? { email: contactID, otp: otpResult }
//           : { phone: contactID, otp: otpResult };
//       } else if (emailId) {
//         payload = { email: emailId, otp: otpResult };
//       } else if (phoneNumberID) {
//         payload = { phone: phoneNumberID, otp: otpResult };
//       } else {
//         throw new Error('No contact info available');
//       }
      
//       console.log('Verifying with payload:', payload);
      
//       const response = await axios.post(`${API_ROUTE}/verify-otp/`, payload);
      
//       console.log('Verify response:', response.status, response.data);
      
//       if (response.status === 200) {
//         // Navigate to registration with verified contact info
//         navigation.replace('EmailRegister', {
//           verifiedEmail: contactType === 'email' ? contactID : emailId,
//           verifiedPhone: contactType === 'phone' ? contactID : phoneNumberID,
//           contactType: contactType,
//           isVerified: true
//         });
//       } else {
//         setError(response.data?.error || 'Incorrect code. Try again.');
//         startShake();
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error('Verification error:', err.response?.data || err.message);
      
//       if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Verification failed. Please try again.');
//       }
//       startShake();
//       setLoading(false);
//     }
//   };

//   // ─── Resend OTP ──────────────────────────────────────────────────────────
//   const resendOTP = async () => {
//     if (resending) return;
    
//     try {
//       setResending(true);
//       let payload;
      
//       if (contactID) {
//         payload = contactType === 'email' 
//           ? { email: contactID, purpose }
//           : { phone: contactID, purpose };
//       } else if (emailId) {
//         payload = { email: emailId, purpose };
//       } else if (phoneNumberID) {
//         payload = { phone: phoneNumberID, purpose };
//       } else {
//         throw new Error('No contact info available');
//       }
      
//       const response = await axios.post(`${API_ROUTE}/send-otp/`, payload);

//       if (response.status === 200 || response.status === 201) {
//         setTimer(300);
//         setError('');
//         // Clear code inputs for new OTP
//         setCode(['', '', '', '', '', '']);
//         // Focus first input
//         inputsRef.current[0]?.focus();
//       }
//     } catch (err) {
//       console.error('Resend error:', err);
//       setError('Failed to resend code. Please try again.');
//     } finally { 
//       setResending(false); 
//     }
//   };

//   // ─── Cleanup on unmount ───────────────────────────────────────────────────
//   useEffect(() => {
//     return () => {
//       if (autoProceedTimeoutRef.current) {
//         clearTimeout(autoProceedTimeoutRef.current);
//       }
//       // Stop SMS receiver
//       if (Platform.OS === 'android' && contactType === 'phone' && smsListenerRef.current) {
//         try {
//           SmsRetriever.stopSmsReceiver().catch(console.error);
//         } catch (e) {
//           console.warn('⚠️ Error stopping SMS receiver:', e);
//         }
//       }
//     };
//   }, []);

//   const isCodeComplete = code.every(digit => digit !== '');
//   const displayContact = getDisplayContact();
//   const displayType = getDisplayType();

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />

//       <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
//         {/* Icon */}
//         <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.verificationIcon}>
//           <Icon name="lock-closed" size={40} color="#fff" />
//         </LinearGradient>
        
//         <Text style={styles.title}>Enter Verification Code</Text>
//         <Text style={styles.subtitle}>
//           We've sent a 6-digit code to your {displayType}:
//         </Text>
//         <Text style={styles.emailText}>{displayContact}</Text>

//         {/* Auto-fill indicator for phone */}
//         {contactType === 'phone' && Platform.OS === 'android' && (
//           <View style={styles.autoFillIndicator}>
//             <Icon name="phone-portrait-outline" size={16} color="#0d64dd" />
//             <Text style={styles.autoFillText}>
//               {smsAutoFillSupported ? 'Auto-detecting code from SMS...' : 'Enter code manually from SMS'}
//             </Text>
//           </View>
//         )}

//         {/* Timer */}
//         <View style={styles.timerContainer}>
//           <Icon name="time-outline" size={16} color="#d00" />
//           <Text style={styles.timerText}>
//             Expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
//           </Text>
//         </View>

//         {/* Error */}
//         {error && (
//           <Animated.View style={[styles.errorContainer, { transform: [{ translateX: shakeAnimation }] }]}>
//             <Icon name="warning-outline" size={16} color="#ff3b30" />
//             <Text style={styles.errorText}>{error}</Text>
//           </Animated.View>
//         )}

//         {/* Code Inputs */}
//         <View style={styles.codeContainer}>
//           {code.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={el => (inputsRef.current[index] = el)}
//               value={digit}
//               onChangeText={text => handleCodeChange(text, index)}
//               onKeyPress={e => handleKeyPress(e, index)}
//               maxLength={1}
//               placeholder="•"
//               placeholderTextColor='#ccc'
//               keyboardType="numeric"
//               style={[styles.codeInput, error && styles.codeInputError, digit && styles.codeInputFilled]}
//               autoFocus={index === 0}
//               textContentType="oneTimeCode"
//               editable={!loading && !autoProceedPending}
//             />
//           ))}
//         </View>

//         {/* Status indicator when auto-proceeding */}
//         {autoProceedPending && (
//           <View style={styles.autoProceedIndicator}>
//             <ActivityIndicator size="small" color="#0d64dd" />
//             <Text style={styles.autoProceedText}>Verifying code...</Text>
//           </View>
//         )}

//         {/* Verify Button - Shown as fallback, but auto-proceed handles it */}
//         <TouchableOpacity
//           style={styles.submitButton}
//           disabled={!isCodeComplete || loading || autoProceedPending}
//           onPress={verifyOTP}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={isCodeComplete && !loading && !autoProceedPending ? ['#0d64dd', '#0d64dd'] : ['#8fb1ff', '#a8c4ff']}
//             style={styles.buttonGradient}
//             start={{x: 0, y: 0}} end={{x: 1, y: 0}}
//           >
//             <View style={styles.buttonContent}>
//               {loading || autoProceedPending ? (
//                 <>
//                   <ActivityIndicator size="small" color="#fff" />
//                   <Text style={[styles.submitButtonText, styles.buttonTextWithLoader]}>
//                     {autoProceedPending ? 'AUTO-VERIFYING...' : 'VERIFYING...'}
//                   </Text>
//                 </>
//               ) : (
//                 <Text style={styles.submitButtonText}>PROCEED</Text>
//               )}
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Resend */}
//         <TouchableOpacity
//           onPress={resendOTP}
//           style={styles.resendContainer}
//           disabled={timer > 0 || resending}
//         >
//           <View style={styles.resendContent}>
//             <Icon name="refresh" size={16} color={timer > 0 ? '#999' : '#0d64dd'} />
//             <Text style={[styles.resendText, { color: timer > 0 ? '#999' : '#0d64dd' }]}>
//               {resending ? 'Sending code...' : (timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2,'0')}` : "Didn't receive the code? Resend")}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   scrollContainer: { flexGrow: 1, alignItems: 'center', padding: 25 },

//   verificationIcon: {
//     width: 80, height: 80, borderRadius: 40, marginTop: 80,
//     justifyContent: 'center', alignItems: 'center',
//     elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
//     marginBottom: 20,
//   },

//   title: { fontSize: 28, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 10 },
//   subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 5 },
//   emailText: { fontSize: 16, color: '#0d64dd', fontWeight: '600', marginBottom: 20, textAlign: 'center' },

//   autoFillIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#e8f0fe',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginBottom: 16,
//   },
//   autoFillText: {
//     fontSize: 13,
//     color: '#0d64dd',
//     fontWeight: '500',
//     marginLeft: 8,
//   },

//   timerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
//   timerText: { fontSize: 16, color: '#d00', fontWeight: '500', marginLeft: 5 },

//   errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffebee', padding: 12, borderRadius: 8, marginBottom: 20, alignSelf: 'stretch' },
//   errorText: { color: '#ff3b30', marginLeft: 8, fontSize: 14, fontWeight: '500' },

//   codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, width: '100%' },
//   codeInput: { 
//     width: 50, 
//     height: 60, 
//     borderWidth: 2, 
//     borderColor: '#e0e0e0', 
//     borderRadius: 12, 
//     textAlign: 'center', 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     color: '#333', 
//     backgroundColor: '#f9f9f9', 
//     elevation: 2, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 1 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 2 
//   },
//   codeInputFilled: { borderColor: '#0d64dd', backgroundColor: '#fff' },
//   codeInputError: { borderColor: '#ff3b30' },

//   autoProceedIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingVertical: 8,
//   },
//   autoProceedText: {
//     fontSize: 14,
//     color: '#0d64dd',
//     fontWeight: '500',
//     marginLeft: 10,
//   },

//   submitButton: { 
//     borderRadius: 12, 
//     overflow: 'hidden', 
//     marginBottom: 20, 
//     width: '100%', 
//     elevation: 3, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.2, 
//     shadowRadius: 4,
//   },
//   buttonGradient: {
//     borderRadius: 12, 
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     alignItems: 'center', 
//     justifyContent: 'center',
//     minHeight: 22,
//   },
//   buttonContent: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center',
//     gap: 10,
//   },
//   submitButtonText: { 
//     color: '#fff', 
//     fontWeight: '600',
//     fontSize: 16, 
//     letterSpacing: 0.5,
//     padding: 15
//   },
//   buttonTextWithLoader: {
//     marginLeft: 8,
//   },

//   resendContainer: { marginTop: 10 },
//   resendContent: { flexDirection: 'row', alignItems: 'center' },
//   resendText: { fontSize: 14, fontWeight: '500', marginLeft: 5 },
// });

// export default VerificationCodeScreen;