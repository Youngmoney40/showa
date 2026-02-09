
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VerificationCodeScreen = ({ route }) => {
  const phoneNumberID = route.params?.phoneNumberID;
  const emailId = route.params?.emailID;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const inputsRef = useRef([]);

  // Countdown timer
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

  const isCodeComplete = code.every(d => d !== '');

  const redirectBack = () => navigation.goBack();

  const resendOTP = async () => {
    if (!emailId) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      const response = await axios.post(`${API_ROUTE}/send-otp/`, { email: emailId });
      if (response.status === 200 || response.status === 201) {
        alert('OTP sent');
        setTimer(300);
        setError('');
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      alert('An error occurred while sending the OTP. Please try again.');
    }
  };

  const verifyOTP = async () => {
    if (!emailId) return alert('Please enter a valid email address.');

    const otpResult = Number(code.join(''));
    setLoading(true);

    try {
      const response = await axios.post(`${API_ROUTE}/verify-otp/`, { email: emailId, otp: otpResult });
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        navigation.navigate('Register', { phoneNumberID, emailID: emailId });
        alert('OTP verified successfully');
      } else {
        setError('Incorrect code. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Incorrect code. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
    >
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'} 
        backgroundColor="transparent"
        translucent
      />

      {/* Header with professional iOS/Android styling */}
      <LinearGradient
        colors={['#0d64dd', '#0d64dd']}
        style={styles.headfer}
      >
        {/* iOS: Safe padding for notch */}
        {/* paddingTop: Platform.OS === 'ios' ? 50 : 20 */}

        <TouchableOpacity onPress={redirectBack} style={[styles.headerBtn,{padding:25}]}>
          
        </TouchableOpacity>

        <TouchableOpacity onPress={redirectBack} style={styles.headerBtn}>
          {/* <Icon name="close" size={24} color="#fff" /> */}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
         
        <View style={styles.titleWrapper}>
          <LinearGradient
                              colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
                              style={styles.heroIconContainer}
                            >
                              <Icon name="mail-outline" size={42} color='blue' />
                            </LinearGradient>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to your email ({emailId})
          </Text>
          <Text style={styles.timerText}>
            Expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </Text>
        </View>

        {/* Error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Code inputs */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => (inputsRef.current[index] = el)}
              value={digit}
              onChangeText={text => handleCodeChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              maxLength={1}
              placeholderTextColor="#777"
              keyboardType="numeric"
              style={[
                styles.codeInput,
                error ? styles.codeInputError : null,
                Platform.OS === 'ios' && styles.codeInputIOS, // iOS professional shadow
              ]}
              returnKeyType="done"
              autoFocus={index === 0}
              textContentType="oneTimeCode"
            />
          ))}
        </View>

        {/* Verify button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isCodeComplete ? '#0d64dd' : '#8fb1ff' },
            Platform.OS === 'ios' && styles.submitButtonIOS, // iOS shadow
          ]}
          disabled={!isCodeComplete || loading}
          onPress={verifyOTP}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> :
            <Text style={styles.submitText}>Verify & Continue</Text>
          }
        </TouchableOpacity>

        {/* Resend OTP */}
        <TouchableOpacity
          onPress={resendOTP}
          style={styles.resendContainer}
          disabled={timer > 0}
        >
          <Text style={[styles.resendText, { opacity: timer > 0 ? 0.5 : 1 }]}>
            {timer > 0
              ? `Resend available in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`
              : "Didn't receive the code? Resend"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, paddingBottom: 40 },

  header: {
    height: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // iOS notch
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // iOS shadow for header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerBtn: { padding: 8 },

  titleWrapper: { paddingHorizontal: 20, marginTop: 30, alignItems: 'center' },
  title: { fontSize: 25, fontWeight: '700', color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  timerText: { marginTop: 10, fontSize: 16, color: '#d00' },

  errorText: { color: '#d00', textAlign: 'center', marginTop: 10, fontSize: 16 },

  codeContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginHorizontal: 10 },
  codeInput: {
    width: 50, height: 50,
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    textAlign: 'center', fontSize: 22, color: '#555', backgroundColor: '#f9f9f9',
  },
  codeInputError: { borderColor: '#d00' },
  codeInputIOS: {
    //iOS professional shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  submitButton: { marginHorizontal: 40, marginTop: 30, paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  submitButtonIOS: {
    //iOS professional shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  resendContainer: { marginTop: 20, alignItems: 'center' },
  resendText: { color: '#0d64dd', fontSize: 14 },
});

export default VerificationCodeScreen;

// export default VerificationCodeScreen;

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   StatusBar,
//   Animated,
//   Dimensions,
//   SafeAreaView,
//   ActivityIndicator,
//   ScrollView,
//   Keyboard,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';

// const COLORS = {
//   primary: '#0d64dd',
//   primaryLight: '#4a90e2',
//   primaryDark: '#0a50b0',
//   white: '#ffffff',
//   textPrimary: '#1a1a1a',
//   textSecondary: '#6c757d',
//   placeholder: '#adb5bd',
//   border: '#e1e5eb',
//   grayLight: '#f8f9fa',
//   grayMedium: '#e9ecef',
//   error: '#dc3545',
//   warning: '#ff6b35',
//   info: '#0d64dd',
//   success: '#0d64dd',
// };

// const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// const VerificationCodeScreen = ({ route }) => {
//   const phoneNumberID = route.params?.phoneNumberID;
//   const emailId = route.params?.emailID;
//   const purpose = route.params?.purpose || 'registration';

//   const [code, setCode] = useState(['', '', '', '', '', '']);
//   const [timer, setTimer] = useState(300);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [focusedIndex, setFocusedIndex] = useState(0);
//   const [keyboardVisible, setKeyboardVisible] = useState(true);
  
//   const navigation = useNavigation();
//   const inputsRef = useRef([]);
//   const shakeAnimation = useRef(new Animated.Value(0)).current;
//   const scrollViewRef = useRef(null);

//   // Auto-focus first input and show keyboard
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (inputsRef.current[0]) {
//         inputsRef.current[0].focus();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   // Keyboard listeners
//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
//       () => {
//         setKeyboardVisible(true);
//       }
//     );

//     const keyboardDidHideListener = Keyboard.addListener(
//       Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
//       () => {
//         setKeyboardVisible(false);
//       }
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   // Countdown timer
//   useEffect(() => {
//     if (timer <= 0) return;

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
//   }, [timer]);

//   const triggerErrorAnimation = () => {
//     Animated.sequence([
//       Animated.timing(shakeAnimation, {
//         toValue: 10,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(shakeAnimation, {
//         toValue: -10,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(shakeAnimation, {
//         toValue: 10,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(shakeAnimation, {
//         toValue: 0,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const handleCodeChange = (text, index) => {
//     if (/^\d*$/.test(text) && text.length <= 1) {
//       const newCode = [...code];
//       newCode[index] = text;
//       setCode(newCode);
//       setError('');

//       // Auto-advance to next input
//       if (text && index < 5) {
//         inputsRef.current[index + 1].focus();
//         setFocusedIndex(index + 1);
//       }
      
//       // Auto-submit when last digit is entered
//       if (text && index === 5) {
//         const filledCode = [...newCode];
//         if (filledCode.every(digit => digit !== '')) {
//           // Hide keyboard before verifying
//           Keyboard.dismiss();
//           verifyOTP();
//         }
//       }
//     }
//   };

//   const handleKeyPress = ({ nativeEvent }, index) => {
//     if (nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
//       inputsRef.current[index - 1].focus();
//       setFocusedIndex(index - 1);
//     }
//   };

//   const handlePaste = (event) => {
//     const pastedText = event.nativeEvent?.text || '';
//     if (/^\d{6}$/.test(pastedText)) {
//       const digits = pastedText.split('');
//       setCode(digits);
//       setError('');
      
//       // Focus last input
//       inputsRef.current[5].focus();
//       setFocusedIndex(5);
      
//       // Auto-submit after paste
//       setTimeout(() => {
//         Keyboard.dismiss();
//         verifyOTP();
//       }, 300);
//     }
//   };

//   const isCodeComplete = code.every(digit => digit !== '');

//   const redirectBack = () => {
//     navigation.goBack();
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const resendOTP = async () => {
//     if (timer > 0 || resendLoading) return;

//     setResendLoading(true);
//     setError('');

//     try {
//       const response = await axios.post(`${API_ROUTE}/send-otp/`, { 
//         email: emailId,
//         purpose: purpose 
//       });
      
//       if (response.status === 200 || response.status === 201) {
//         setTimer(300);
//         Alert.alert(
//           'Code Resent ✓',
//           `A new 6-digit verification code has been sent to:\n${emailId}`,
//           [{ text: 'OK', style: 'default' }]
//         );
//       } else {
//         Alert.alert('Error', 'Failed to resend code. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error resending OTP:', error);
//       Alert.alert(
//         'Resend Failed',
//         'Unable to resend verification code. Please check your connection and try again.'
//       );
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const verifyOTP = async () => {
//     if (!isCodeComplete) {
//       setError('Please enter all 6 digits');
//       triggerErrorAnimation();
//       // Focus first empty input
//       const firstEmptyIndex = code.findIndex(digit => digit === '');
//       if (firstEmptyIndex !== -1) {
//         inputsRef.current[firstEmptyIndex].focus();
//       }
//       return;
//     }

//     setLoading(true);
//     setError('');

//     const otpResult = parseInt(code.join(''), 10);

//     try {
//       const response = await axios.post(`${API_ROUTE}/verify-otp/`, {
//         email: emailId,
//         otp: otpResult,
//         purpose: purpose
//       });

//       if (response.status === 200 || response.status === 201) {
//         Alert.alert(
//           'Verification Successful ✓',
//           'Your email has been successfully verified.',
//           [
//             {
//               text: 'Continue',
//               style: 'default',
//               onPress: () => {
//                 if (purpose === 'login') {
//                   navigation.navigate('Dashboard');
//                 } else {
//                   navigation.navigate('Register', {
//                     phoneNumberID: phoneNumberID,
//                     emailID: emailId,
//                   });
//                 }
//               }
//             }
//           ]
//         );
//       } else {
//         setError('Incorrect verification code');
//         triggerErrorAnimation();
//         // Focus first input on error
//         inputsRef.current[0].focus();
//       }
//     } catch (error) {
//       if (error.response?.data?.error) {
//         setError(error.response.data.error);
//       } else if (error.response?.data?.non_field_errors) {
//         setError(error.response.data.non_field_errors[0]);
//       } else {
//         setError('Verification failed. Please try again.');
//       }
//       triggerErrorAnimation();
//       // Focus first input on error
//       inputsRef.current[0].focus();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputFocus = (index) => {
//     setFocusedIndex(index);
//   };

//   const handleContainerPress = () => {
//     if (!keyboardVisible) {
//       const firstEmptyIndex = code.findIndex(digit => digit === '');
//       const indexToFocus = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
//       if (inputsRef.current[indexToFocus]) {
//         inputsRef.current[indexToFocus].focus();
//       }
//     }
//   };

//   const focusFirstEmptyInput = () => {
//     const firstEmptyIndex = code.findIndex(digit => digit === '');
//     const indexToFocus = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
//     if (inputsRef.current[indexToFocus]) {
//       inputsRef.current[indexToFocus].focus();
//     }
//   };

//   // Check if all digits are filled - hide the "Enter Code" text when complete
//   const allDigitsFilled = code.every(digit => digit !== '');

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar 
//         barStyle="light-content" 
//         backgroundColor={COLORS.primary}
//       />
      
//       {/* iOS Style Header */}
//       <LinearGradient 
//         colors={[COLORS.primary, COLORS.primaryLight]} 
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}
//       >
//         <View style={styles.headerContent}>
//           <TouchableOpacity 
//             onPress={redirectBack} 
//             style={styles.headerButton}
//             activeOpacity={0.7}
//           >
//             <Icon name="chevron-back" size={24} color={COLORS.white} />
//           </TouchableOpacity>
          
//           <View style={styles.headerTitleContainer}>
//             <Text style={styles.headerTitle}>Verification</Text>
//             <Text style={styles.headerSubtitle}>Enter verification code</Text>
//           </View>
          
//           <TouchableOpacity 
//             onPress={redirectBack} 
//             style={styles.headerButton}
//             activeOpacity={0.7}
//           >
//             <Icon name="close" size={22} color={COLORS.white} />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       <KeyboardAvoidingView
//         style={styles.keyboardView}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
//       >
//         <Animated.View 
//           style={[
//             styles.content,
//             { transform: [{ translateX: shakeAnimation }] }
//           ]}
//           onStartShouldSetResponder={() => true}
//           onResponderRelease={handleContainerPress}
//         >
//           <ScrollView 
//             ref={scrollViewRef}
//             contentContainerStyle={[
//               styles.scrollContent,
//               keyboardVisible && styles.scrollContentWithKeyboard
//             ]}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//             scrollEnabled={false}
//           >
//             {/* Hero Section */}
//             <View style={styles.heroContainer}>
//               <LinearGradient
//                 colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
//                 style={styles.heroIconContainer}
//               >
//                 <Icon name="keypad" size={42} color={COLORS.primary} />
//               </LinearGradient>
              
//               {!allDigitsFilled ? (
//                 <>
//                   <Text style={styles.heroTitle}>Enter Code</Text>
//                   <Text style={styles.heroSubtitle}>
//                     Enter the 6-digit code sent to
//                   </Text>
//                   <Text style={styles.emailText}>{emailId}</Text>
//                 </>
//               ) : (
//                 <>
//                   <Text style={styles.heroTitle}>Verifying...</Text>
//                   <Text style={styles.heroSubtitle}>
//                     Code entered for
//                   </Text>
//                   <Text style={styles.emailText}>{emailId}</Text>
//                 </>
//               )}
//             </View>

//             {/* Timer Display */}
//             <View style={styles.timerContainer}>
//               <Icon name="time-outline" size={18} color={COLORS.warning} />
//               <Text style={styles.timerText}>
//                 Expires in {formatTime(timer)}
//               </Text>
//             </View>

//             {/* Error Display */}
//             {error ? (
//               <View style={styles.errorContainer}>
//                 <Icon name="alert-circle-outline" size={18} color={COLORS.error} />
//                 <Text style={styles.errorText}>{error}</Text>
//               </View>
//             ) : null}

//             {/* OTP Inputs */}
//             <View style={styles.otpContainer}>
//               {code.map((digit, index) => (
//                 <TextInput
//                   key={index}
//                   ref={el => {
//                     inputsRef.current[index] = el;
//                   }}
//                   value={digit}
//                   onChangeText={text => handleCodeChange(text, index)}
//                   onKeyPress={e => handleKeyPress(e, index)}
//                   onFocus={() => handleInputFocus(index)}
//                   onPaste={handlePaste}
//                   maxLength={1}
//                   keyboardType="number-pad"
//                   style={[
//                     styles.otpInput,
//                     focusedIndex === index && styles.otpInputFocused,
//                     error && styles.otpInputError,
//                     digit !== '' && !error && styles.otpInputFilled,
//                   ]}
//                   returnKeyType="done"
//                   textContentType="oneTimeCode"
//                   autoComplete="one-time-code"
//                   editable={!loading}
//                   selectTextOnFocus={true}
//                   autoFocus={index === 0}
//                   blurOnSubmit={false}
//                   onSubmitEditing={() => {
//                     if (index < 5) {
//                       inputsRef.current[index + 1].focus();
//                     } else if (isCodeComplete) {
//                       Keyboard.dismiss();
//                       verifyOTP();
//                     }
//                   }}
//                 />
//               ))}
//             </View>

//             {/* Hint Text */}
//             {!allDigitsFilled && (
//               <Text style={styles.hintText}>
//                 Tap on any box to enter code or paste 6-digit number
//               </Text>
//             )}

//             {/* Verify Button */}
//             <TouchableOpacity
//               style={[
//                 styles.verifyButton,
//                 (!isCodeComplete || loading) && styles.buttonDisabled,
//               ]}
//               onPress={() => {
//                 Keyboard.dismiss();
//                 verifyOTP();
//               }}
//               activeOpacity={0.8}
//               disabled={!isCodeComplete || loading}
//             >
//               <LinearGradient
//                 colors={[COLORS.primary, COLORS.primaryLight]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.buttonGradient}
//               >
//                 {loading ? (
//                   <ActivityIndicator size="small" color={COLORS.white} />
//                 ) : (
//                   <>
//                     <Text style={styles.verifyButtonText}>
//                       {allDigitsFilled ? 'Verify Code' : 'Enter Code to Verify'}
//                     </Text>
//                     <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
//                   </>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>

//             {/* Resend Section */}
//             <View style={styles.resendContainer}>
//               <Text style={styles.resendPrompt}>
//                 Didn't receive a code?
//               </Text>
              
//               <TouchableOpacity
//                 onPress={resendOTP}
//                 style={styles.resendButton}
//                 activeOpacity={0.7}
//                 disabled={timer > 0 || resendLoading}
//               >
//                 {resendLoading ? (
//                   <ActivityIndicator size="small" color={COLORS.primary} />
//                 ) : (
//                   <View style={styles.resendButtonContent}>
//                     <Icon 
//                       name="refresh-outline" 
//                       size={18} 
//                       color={timer > 0 ? COLORS.textSecondary : COLORS.primary} 
//                     />
//                     <Text style={[
//                       styles.resendButtonText,
//                       timer > 0 && styles.resendButtonDisabled
//                     ]}>
//                       {timer > 0 ? `Resend (${formatTime(timer)})` : 'Resend Now'}
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Security Note */}
//             <View style={styles.securityNote}>
//               <Icon name="shield-checkmark" size={16} color={COLORS.primary} />
//               <Text style={styles.securityText}>
//                 Secure verification for your account protection
//               </Text>
//             </View>
//           </ScrollView>
//         </Animated.View>
//       </KeyboardAvoidingView>

//       {/* Keyboard Helper - Shows when keyboard is not visible */}
//       {!keyboardVisible && !allDigitsFilled && (
//         <TouchableOpacity
//           style={styles.keyboardHelper}
//           onPress={focusFirstEmptyInput}
//           activeOpacity={0.8}
//         >
//           <Icon name="keypad-outline" size={20} color={COLORS.white} />
//           <Text style={styles.keyboardHelperText}>Tap to enter code</Text>
//         </TouchableOpacity>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
  
//   /* iOS Style Header */
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 0 : SPACING.sm,
//     paddingBottom: SPACING.md,
//     ...Platform.select({
//       ios: {
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.15,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.lg,
//     height: Platform.OS === 'ios' ? 44 : 56,
//   },
//   headerButton: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 22,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     ...Platform.select({
//       ios: {
//         width: 40,
//         height: 40,
//       },
//     }),
//   },
//   headerTitleContainer: {
//     alignItems: 'center',
//     flex: 1,
//     paddingHorizontal: SPACING.md,
//   },
//   headerTitle: {
//     color: COLORS.white,
//     fontSize: Platform.OS === 'ios' ? 17 : 20,
//     fontWeight: Platform.OS === 'ios' ? '600' : '700',
//     letterSpacing: Platform.OS === 'ios' ? -0.4 : 0.5,
//   },
//   headerSubtitle: {
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontSize: Platform.OS === 'ios' ? 13 : 14,
//     marginTop: Platform.OS === 'ios' ? 2 : SPACING.xs,
//     fontWeight: Platform.OS === 'ios' ? '400' : '500',
//   },

//   keyboardView: {
//     flex: 1,
//   },

//   content: {
//     flex: 1,
//   },

//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: SPACING.lg,
//     paddingTop: SPACING.xxl,
//     paddingBottom: SPACING.xxl,
//   },

//   scrollContentWithKeyboard: {
//     paddingBottom: Platform.OS === 'ios' ? 100 : 120,
//   },

//   /* Hero Section */
//   heroContainer: {
//     alignItems: 'center',
//     marginBottom: SPACING.xl,
//   },
//   heroIconContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: SPACING.lg,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     textAlign: 'center',
//     marginBottom: SPACING.sm,
//     letterSpacing: 0.3,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     marginBottom: SPACING.xs,
//   },
//   emailText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.primary,
//     textAlign: 'center',
//     backgroundColor: 'rgba(13, 100, 221, 0.1)',
//     paddingHorizontal: SPACING.md,
//     paddingVertical: SPACING.xs,
//     borderRadius: 12,
//     marginTop: SPACING.xs,
//     overflow: 'hidden',
//   },

//   /* Timer */
//   timerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 107, 53, 0.05)',
//     padding: SPACING.md,
//     borderRadius: 12,
//     marginBottom: SPACING.lg,
//   },
//   timerText: {
//     fontSize: 15,
//     color: COLORS.warning,
//     marginLeft: SPACING.sm,
//     fontWeight: '600',
//   },

//   /* Error */
//   errorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(220, 53, 69, 0.05)',
//     padding: SPACING.md,
//     borderRadius: 12,
//     marginBottom: SPACING.lg,
//   },
//   errorText: {
//     color: COLORS.error,
//     fontSize: 15,
//     marginLeft: SPACING.sm,
//     fontWeight: '500',
//   },

//   /* OTP Inputs */
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: SPACING.md,
//     paddingHorizontal: Platform.OS === 'ios' ? SPACING.xs : 0,
//   },
//   otpInput: {
//     width: Platform.OS === 'ios' ? 52 : 50,
//     height: Platform.OS === 'ios' ? 62 : 60,
//     borderWidth: 2,
//     borderColor: COLORS.border,
//     borderRadius: 14,
//     backgroundColor: COLORS.white,
//     textAlign: 'center',
//     fontSize: Platform.OS === 'ios' ? 28 : 24,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   otpInputFocused: {
//     borderColor: COLORS.primary,
//     backgroundColor: 'rgba(13, 100, 221, 0.05)',
//     ...Platform.select({
//       ios: {
//         shadowColor: COLORS.primary,
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//       },
//     }),
//   },
//   otpInputError: {
//     borderColor: COLORS.error,
//     backgroundColor: 'rgba(220, 53, 69, 0.05)',
//   },
//   otpInputFilled: {
//     borderColor: COLORS.primary,
//     backgroundColor: 'rgba(13, 100, 221, 0.08)',
//   },

//   /* Hint */
//   hintText: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     marginBottom: SPACING.xl,
//     fontWeight: '500',
//   },

//   /* Verify Button */
//   verifyButton: {
//     borderRadius: 14,
//     overflow: 'hidden',
//     marginBottom: SPACING.lg,
//     ...Platform.select({
//       ios: {
//         shadowColor: COLORS.primary,
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   buttonGradient: {
//     paddingVertical: SPACING.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   verifyButtonText: {
//     color: COLORS.white,
//     fontSize: 17,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   buttonIcon: {
//     marginLeft: SPACING.sm,
//   },

//   /* Resend Section */
//   resendContainer: {
//     alignItems: 'center',
//     marginBottom: SPACING.xl,
//     backgroundColor: COLORS.grayLight,
//     padding: SPACING.lg,
//     borderRadius: 14,
//   },
//   resendPrompt: {
//     fontSize: 15,
//     color: COLORS.textSecondary,
//     marginBottom: SPACING.md,
//     fontWeight: '500',
//   },
//   resendButton: {
//     padding: SPACING.sm,
//   },
//   resendButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   resendButtonText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: COLORS.primary,
//     marginLeft: SPACING.sm,
//   },
//   resendButtonDisabled: {
//     color: COLORS.textSecondary,
//   },

//   /* Security Note */
//   securityNote: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(13, 100, 221, 0.05)',
//     padding: SPACING.md,
//     borderRadius: 12,
//     marginTop: 'auto',
//   },
//   securityText: {
//     fontSize: 13,
//     color: COLORS.primary,
//     marginLeft: SPACING.sm,
//     fontWeight: '500',
//   },

//   /* Keyboard Helper */
//   keyboardHelper: {
//     position: 'absolute',
//     bottom: SPACING.lg,
//     left: '50%',
//     transform: [{ translateX: -80 }],
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.lg,
//     paddingVertical: SPACING.md,
//     borderRadius: 25,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   keyboardHelperText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: SPACING.sm,
//   },
// });

// export default VerificationCodeScreen;
