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
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NotificationService from '../../src/services/NotificationService';


// const VerificationCodeScreen = ({ route }) => {
 
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

//   const navigation = useNavigation();
//   const inputsRef = useRef([]);
//   const shakeAnimation = useRef(new Animated.Value(0)).current;

//   const registerDevice = async () => {
//     const userToken = await AsyncStorage.getItem('userToken'); 
//     await NotificationService.initialize(userToken);
//   };

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

//   const startShake = () => {
//     Animated.sequence([
//       Animated.timing(shakeAnimation, { toValue: 10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: -10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: 10, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true }),
//     ]).start();
//   };

//   const handleCodeChange = (text, index) => {
//     if (/^\d*$/.test(text)) {
//       const newCode = [...code];
//       newCode[index] = text;
//       setCode(newCode);
//       setError('');
//       if (text && index < 5) inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyPress = ({ nativeEvent }, index) => {
//     if (nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   const isCodeComplete = code.every(digit => digit !== '');

//   const redirectBack = () => navigation.goBack();

//   const resendOTP = async () => {
//     // if (!emailId) return;
//     // try {
//     //   setResending(true);
//     //   const response = await axios.post(`${API_ROUTE}/send-otp/`, { email: emailId, purpose });

//       try {
//       setResending(true);
//       const payload = contactType === 'email' 
//         ? { email: contactID, purpose }
//         : { phone: contactID, purpose };
      
//       const response = await axios.post(`${API_ROUTE}/send-otp/`, payload);

//       if (response.status === 200 || response.status === 201) {
//         setTimer(300);
//         setError('');
//       }
//     } catch (err) {} finally { setResending(false); }
//   };

//   const verifyOTP = async () => {
   
//     const otpResult = Number(code.join(''));
//     setLoading(true);
//     try {
//       const payload = contactType === 'email' 
//         ? { email: contactID, otp: otpResult }
//         : { phone: contactID, otp: otpResult };
      
//       const response = await axios.post(`${API_ROUTE}/verify-otp/`, payload);
//       if (response.status === 200 || response.status === 201) {
//         const { token, refresh, user } = response.data;
//         await AsyncStorage.multiSet([
//           ['userToken', token],
//           ['refreshToken', refresh],
//           ['userData', JSON.stringify(user)],
//           ['isVerified', 'true'],
//           ['userEmail', user.email],
//           ['userId', user.id.toString()],
//         ]);
//         navigation.replace('ProceedOptions');
//         registerDevice();
//       } else {
//         setError('Incorrect code. Try again.');
//         startShake();
//       }
//     } catch (err) {
//       setError('Verification failed. Try again.');
//       startShake();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getButtonText = () => purpose === 'login' ? 'PROCEED' : 'PROCEED';

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
//         <Text style={styles.subtitle}>We've sent a 6-digit code to your email:</Text>
//         <Text style={styles.emailText}>{emailId}</Text>

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
//               editable={!loading}
//             />
//           ))}
//         </View>

//         {/* Verify Button - Keep enabled during loading */}
//         <TouchableOpacity
//           style={styles.submitButton}
//           disabled={!isCodeComplete} 
//           onPress={verifyOTP}
//           activeOpacity={loading ? 0.8 : 0.6}
//         >
//           <LinearGradient
//             colors={isCodeComplete ? ['#0d64dd', '#0d64dd'] : ['#8fb1ff', '#a8c4ff']}
//             style={styles.buttonGradient}
//             start={{x: 0, y: 0}} end={{x: 1, y: 0}}
//           >
//             <View style={styles.buttonContent}>
//               {loading ? (
//                 <>
//                   <ActivityIndicator size="small" color="#fff" />
//                   <Text style={[styles.submitButtonText, styles.buttonTextWithLoader]}>
//                     VERIFYING...
//                   </Text>
//                 </>
//               ) : (
//                 <Text style={styles.submitButtonText}>{getButtonText()}</Text>
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
//   container: { flex:1, backgroundColor:'#fff' },
//   scrollContainer: { flexGrow:1, alignItems:'center', padding:25 },

//   verificationIcon: {
//     width: 80, height: 80, borderRadius: 40,marginTop:80,
//     justifyContent:'center', alignItems:'center',
//     elevation:5, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.2, shadowRadius:4,
//     marginBottom:20,
//   },

//   title: { fontSize:28, fontWeight:'bold', color:'#000', textAlign:'center', marginBottom:10 },
//   subtitle: { fontSize:16, color:'#666', textAlign:'center', marginBottom:5 },
//   emailText: { fontSize:16, color:'#0d64dd', fontWeight:'600', marginBottom:20, textAlign:'center' },

//   timerContainer:{ flexDirection:'row', alignItems:'center', marginBottom:25 },
//   timerText:{ fontSize:16, color:'#d00', fontWeight:'500', marginLeft:5 },

//   errorContainer:{ flexDirection:'row', alignItems:'center', backgroundColor:'#ffebee', padding:12, borderRadius:8, marginBottom:20, alignSelf:'stretch' },
//   errorText:{ color:'#ff3b30', marginLeft:8, fontSize:14, fontWeight:'500' },

//   codeContainer:{ flexDirection:'row', justifyContent:'space-between', marginBottom:30, width:'100%' },
//   codeInput:{ width:50, height:60, borderWidth:2, borderColor:'#e0e0e0', borderRadius:12, textAlign:'center', fontSize:24, fontWeight:'bold', color:'#333', backgroundColor:'#f9f9f9', elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2 },
//   codeInputFilled:{ borderColor:'#0d64dd', backgroundColor:'#fff' },
//   codeInputError:{ borderColor:'#ff3b30' },

//   submitButton:{ 
//     borderRadius: 12, 
//     overflow: 'hidden', 
//     marginBottom: 20, 
//     width: '100%', 
//     elevation: 3, 
//     shadowColor: '#000', 
//     shadowOffset: {width: 0, height: 2}, 
//     shadowOpacity: 0.2, 
//     shadowRadius: 4,
//   },
//   buttonGradsient: {
//     borderRadius: 12, 
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     alignItems: 'center', 
//     justifyContent: 'center',
//     minHeight: 52,
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
//     padding:15
//   },
//   buttonTextWithLoader: {
//     marginLeft: 8,
//   },

//   resendContainer:{ marginTop:10 },
//   resendContent:{ flexDirection:'row', alignItems:'center' },
//   resendText:{ fontSize:14, fontWeight:'500', marginLeft:5 },
// });

// export default VerificationCodeScreen;

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
  const contactID = route.params?.contactID; // Can be email or phone
  const contactType = route.params?.contactType || 'email'; // 'email' or 'phone'
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
      // Navigate to registration with verified contact info
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
  container: { flex: 1, backgroundColor: '#fff' },
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