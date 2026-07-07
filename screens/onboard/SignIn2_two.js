

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View,
//   Image,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   ScrollView,
//   KeyboardAvoidingView,
//   StatusBar,
//   Dimensions,
//   Keyboard,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import NetInfo from '@react-native-community/netinfo';
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
//   success: '#28a745',
//   error: '#dc3545',
//   warning: '#ffc107',
// };

// const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // ─── Country Codes ──────────────────────────────────────────────────────────
// const COUNTRY_CODES = [
//   { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
//   { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
//   { code: '+44', country: 'UK', flag: '🇬🇧' },
//   { code: '+91', country: 'India', flag: '🇮🇳' },
//   { code: '+233', country: 'Ghana', flag: '🇬🇭' },
//   { code: '+254', country: 'Kenya', flag: '🇰🇪' },
//   { code: '+27', country: 'South Africa', flag: '🇿🇦' },
//   { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
// ];

// // ─── Network Status Modal ──────────────────────────────────────────────────
// const NetworkStatusModal = ({ visible, message, onRetry, onCancel, loading }) => (
//   <Modal
//     transparent={true}
//     visible={visible}
//     animationType="fade"
//     statusBarTranslucent={true}
//   >
//     <View style={styles.modalOverlay}>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalIconContainer}>
//           <Icon name="wifi-outline" size={50} color={COLORS.warning} />
//         </View>
//         <Text style={styles.modalTitle}>Connection Issue</Text>
//         <Text style={styles.modalMessage}>{message}</Text>
//         <View style={styles.modalButtonContainer}>
//           <TouchableOpacity 
//             style={[styles.modalButton, styles.modalCancelButton]} 
//             onPress={onCancel}
//             disabled={loading}
//           >
//             <Text style={styles.modalCancelText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.modalButton, styles.modalRetryButton, loading && styles.modalButtonDisabled]} 
//             onPress={onRetry}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color={COLORS.white} />
//             ) : (
//               <Text style={styles.modalRetryText}>Retry</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </Modal>
// );

// // ─── Main Component ─────────────────────────────────────────────────────────
// export default function SignupMethodScreen({ navigation }) {
//   // ── State ──────────────────────────────────────────────────────────────────
//   const [selectedMethod, setSelectedMethod] = useState(null); // 'phone' or 'email'
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [countryCode, setCountryCode] = useState('+234');
//   const [showCountryPicker, setShowCountryPicker] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [networkModalVisible, setNetworkModalVisible] = useState(false);
//   const [networkMessage, setNetworkMessage] = useState('');
//   const [networkLoading, setNetworkLoading] = useState(false);
  
//   // ── Refs ──────────────────────────────────────────────────────────────────
//   const phoneInputRef = useRef(null);
//   const emailInputRef = useRef(null);
//   const isMounted = useRef(true);

//   // ─── Network Listener ──────────────────────────────────────────────────────
//   useEffect(() => {
//     isMounted.current = true;
//     const unsubscribe = NetInfo.addEventListener(state => {
//       console.log('📶 Network state:', state.isConnected);
//       if (state.isConnected && networkModalVisible) {
//         setNetworkModalVisible(false);
//       }
//     });

//     return () => {
//       isMounted.current = false;
//       unsubscribe();
//     };
//   }, [networkModalVisible]);

//   // ─── Network Error Helpers ────────────────────────────────────────────────
//   const showNetworkError = useCallback((message, retryFn) => {
//     setNetworkMessage(message);
//     setNetworkModalVisible(true);
//   }, []);

//   const hideNetworkModal = useCallback(() => {
//     setNetworkModalVisible(false);
//     setNetworkLoading(false);
//   }, []);

//   const retryAction = useCallback(() => {
//     setNetworkLoading(true);
//     handleContinue();
//   }, []);

//   // ─── Validation ───────────────────────────────────────────────────────────
//   const validatePhone = useCallback((number) => {
//     const cleanNumber = number.replace(/\s/g, '');
//     if (!cleanNumber) return 'Phone number is required';
//     if (!/^[0-9]{7,15}$/.test(cleanNumber)) {
//       return 'Please enter a valid phone number';
//     }
//     return null;
//   }, []);

//   const validateEmail = useCallback((emailAddr) => {
//     if (!emailAddr) return 'Email is required';
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(emailAddr)) {
//       return 'Please enter a valid email address';
//     }
//     return null;
//   }, []);

//   // ─── Method Selection ─────────────────────────────────────────────────────
//   const selectMethod = useCallback((method) => {
//     setSelectedMethod(method);
//     setErrors({});
//     // Focus the appropriate input
//     setTimeout(() => {
//       if (method === 'phone' && phoneInputRef.current) {
//         phoneInputRef.current.focus();
//       } else if (method === 'email' && emailInputRef.current) {
//         emailInputRef.current.focus();
//       }
//     }, 300);
//   }, []);

//   // ─── Continue Handler ─────────────────────────────────────────────────────
//   const handleContinue = useCallback(async () => {
//     Keyboard.dismiss();

//     // ── 1. Check Network ──────────────────────────────────────────────────
//     const netState = await NetInfo.fetch();
//     if (!netState.isConnected) {
//       showNetworkError(
//         'No internet connection. Please check your network and try again.',
//         handleContinue
//       );
//       return;
//     }

//     // ── 2. Validate Input ──────────────────────────────────────────────
//     const newErrors = {};
    
//     if (selectedMethod === 'phone') {
//       const phoneError = validatePhone(phoneNumber);
//       if (phoneError) newErrors.phone = phoneError;
//     } else if (selectedMethod === 'email') {
//       const emailError = validateEmail(email);
//       if (emailError) newErrors.email = emailError;
//     } else {
//       Alert.alert('Select Method', 'Please choose a signup method first.');
//       return;
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       // ── 3. Check if contact exists ──────────────────────────────────
//       const contactValue = selectedMethod === 'phone' 
//         ? `${countryCode}${phoneNumber.replace(/\s/g, '')}`
//         : email;

//       const checkPayload = selectedMethod === 'phone'
//         ? { phone: contactValue }
//         : { email: contactValue };

//       console.log('🔍 Checking contact:', contactValue);

//       const checkResponse = await axios.post(
//         `${API_ROUTE}/check-contact/`,
//         checkPayload,
//         { timeout: 10000 }
//       );

//       if (checkResponse.data.exists) {
//         // ── Account exists - navigate to login ──────────────────────
//         Alert.alert(
//           'Account Found',
//           `An account already exists with this ${selectedMethod === 'phone' ? 'phone number' : 'email'}. Would you like to login instead?`,
//           [
//             { 
//               text: 'Go Back', 
//               style: 'cancel',
//               onPress: () => {
//                 setSelectedMethod(null);
//                 if (selectedMethod === 'phone') setPhoneNumber('');
//                 else setEmail('');
//               }
//             },
//             { 
//               text: 'Login',
//               onPress: () => {
//                 navigation.navigate('EmailLogin', {
//                   contact: contactValue,
//                   contactType: selectedMethod,
//                 });
//               }
//             }
//           ]
//         );
//         setLoading(false);
//         return;
//       }

//       // ── 4. Account doesn't exist - send OTP ──────────────────────
//       const otpPayload = selectedMethod === 'phone'
//         ? { phone: contactValue, purpose: 'registration' }
//         : { email: contactValue, purpose: 'registration' };

//       console.log('📤 Sending OTP to:', contactValue);

//       const otpResponse = await axios.post(
//         `${API_ROUTE}/send-otp/`,
//         otpPayload,
//         { timeout: 15000 }
//       );

//       if (otpResponse.status === 200 || otpResponse.status === 201) {
//         const method = otpResponse.data.method || (selectedMethod === 'phone' ? 'sms' : 'email');
//         const message = otpResponse.data.message || `Verification code sent to your ${selectedMethod}`;

//         Alert.alert(
//           'Verification Sent',
//           `${message}\n\nPlease check ${method === 'sms' ? 'your phone' : 'your email'} for the 6-digit code.`,
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 navigation.navigate('VerificationCode', {
//                   contactID: contactValue,
//                   contactType: selectedMethod,
//                   purpose: 'registration',
//                   phoneNumberID: selectedMethod === 'phone' ? contactValue : '',
//                   emailID: selectedMethod === 'email' ? contactValue : '',
//                 });
//               }
//             }
//           ]
//         );
//       } else {
//         throw new Error('Failed to send verification code');
//       }

//     } catch (error) {
//       console.error('❌ Error:', error);

//       // ── 5. Handle Network Errors ──────────────────────────────────
//       if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
//         showNetworkError(
//           'Connection timeout. Please check your network and try again.',
//           handleContinue
//         );
//         return;
//       }

//       if (!error.response) {
//         showNetworkError(
//           'Cannot connect to server. Please check your internet connection.',
//           handleContinue
//         );
//         return;
//       }

//       // ── 6. Handle Server Errors ──────────────────────────────────
//       if (error.response.status >= 500 && error.response.status < 600) {
//         showNetworkError(
//           'Server is currently experiencing issues. Please try again later.',
//           handleContinue
//         );
//         return;
//       }

//       // ── 7. Handle Client Errors ──────────────────────────────────
//       let errorMessage = 'Unable to continue. Please try again.';
//       const backendError = error.response?.data;
      
//       if (backendError?.message) {
//         errorMessage = backendError.message;
//       } else if (backendError?.phone) {
//         errorMessage = `Phone: ${backendError.phone[0]}`;
//       } else if (backendError?.email) {
//         errorMessage = `Email: ${backendError.email[0]}`;
//       }

//       Alert.alert('Error', errorMessage);

//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//         setNetworkLoading(false);
//       }
//     }
//   }, [
//     selectedMethod,
//     phoneNumber,
//     email,
//     countryCode,
//     validatePhone,
//     validateEmail,
//     navigation,
//     showNetworkError
//   ]);

//   // ─── Render Method Selection ─────────────────────────────────────────────
//   const renderMethodSelection = () => (
//     <View style={styles.methodContainer}>
//       <Text style={styles.methodTitle}>How would you like to continue?</Text>
//       <Text style={styles.methodSubtitle}>Select your preferred signup method</Text>

//       <TouchableOpacity
//         style={[
//           styles.methodCard,
//           selectedMethod === 'phone' && styles.methodCardSelected,
//         ]}
//         onPress={() => selectMethod('phone')}
//         activeOpacity={0.7}
//       >
//         <LinearGradient
//           colors={selectedMethod === 'phone' ? [COLORS.primary, COLORS.primaryDark] : ['#f8f9fa', '#f1f3f5']}
//           style={styles.methodCardGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           <View style={styles.methodIconContainer}>
//             <Icon 
//               name="call-outline" 
//               size={28} 
//               color={selectedMethod === 'phone' ? COLORS.white : COLORS.primary} 
//             />
//           </View>
//           <View style={styles.methodTextContainer}>
//             <Text style={[
//               styles.methodCardTitle,
//               selectedMethod === 'phone' && styles.methodCardTitleSelected
//             ]}>
//               Phone Number
//             </Text>
//             <Text style={[
//               styles.methodCardSubtitle,
//               selectedMethod === 'phone' && styles.methodCardSubtitleSelected
//             ]}>
//               Use your mobile number
//             </Text>
//           </View>
//           {selectedMethod === 'phone' && (
//             <View style={styles.methodCheckmark}>
//               <Icon name="checkmark-circle" size={24} color={COLORS.white} />
//             </View>
//           )}
//         </LinearGradient>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.methodCard,
//           selectedMethod === 'email' && styles.methodCardSelected,
//         ]}
//         onPress={() => selectMethod('email')}
//         activeOpacity={0.7}
//       >
//         <LinearGradient
//           colors={selectedMethod === 'email' ? [COLORS.primary, COLORS.primaryDark] : ['#f8f9fa', '#f1f3f5']}
//           style={styles.methodCardGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           <View style={styles.methodIconContainer}>
//             <Icon 
//               name="mail-outline" 
//               size={28} 
//               color={selectedMethod === 'email' ? COLORS.white : COLORS.primary} 
//             />
//           </View>
//           <View style={styles.methodTextContainer}>
//             <Text style={[
//               styles.methodCardTitle,
//               selectedMethod === 'email' && styles.methodCardTitleSelected
//             ]}>
//               Email Address
//             </Text>
//             <Text style={[
//               styles.methodCardSubtitle,
//               selectedMethod === 'email' && styles.methodCardSubtitleSelected
//             ]}>
//               Use your email address
//             </Text>
//           </View>
//           {selectedMethod === 'email' && (
//             <View style={styles.methodCheckmark}>
//               <Icon name="checkmark-circle" size={24} color={COLORS.white} />
//             </View>
//           )}
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//   );

//   // ─── Render Phone Input ──────────────────────────────────────────────────
//   const renderPhoneInput = () => (
//     <View style={styles.inputSection}>
//       <Text style={styles.inputLabel}>Phone Number</Text>
//       <View style={styles.phoneInputWrapper}>
//         {/* Country Code Picker */}
//         <TouchableOpacity
//           style={styles.countryCodeButton}
//           onPress={() => setShowCountryPicker(true)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.countryCodeText}>
//             {COUNTRY_CODES.find(c => c.code === countryCode)?.flag || '🇳🇬'}
//           </Text>
//           <Text style={styles.countryCodeText}>
//             {countryCode}
//           </Text>
//           <Icon name="chevron-down" size={16} color={COLORS.textSecondary} />
//         </TouchableOpacity>

//         <View style={styles.divider} />

//         <TextInput
//           ref={phoneInputRef}
//           placeholder="8123456789"
//           style={styles.phoneInput}
//           keyboardType="phone-pad"
//           value={phoneNumber}
//           onChangeText={(text) => {
//             const cleaned = text.replace(/[^0-9]/g, '');
//             setPhoneNumber(cleaned);
//             if (errors.phone) {
//               setErrors(prev => ({ ...prev, phone: null }));
//             }
//           }}
//           returnKeyType="done"
//           onSubmitEditing={handleContinue}
//           editable={!loading}
//           maxLength={15}
//         />
//       </View>
//       {errors.phone && (
//         <View style={styles.errorContainer}>
//           <Icon name="alert-circle-outline" size={16} color={COLORS.error} />
//           <Text style={styles.errorText}>{errors.phone}</Text>
//         </View>
//       )}
//       <Text style={styles.helperText}>
//         We'll send a 6-digit verification code via SMS
//       </Text>
//     </View>
//   );

//   // ─── Render Email Input ──────────────────────────────────────────────────
//   const renderEmailInput = () => (
//     <View style={styles.inputSection}>
//       <Text style={styles.inputLabel}>Email Address</Text>
//       <View style={styles.inputWrapper}>
//         <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//         <TextInput
//           ref={emailInputRef}
//           placeholder="example@gmail.com"
//           style={styles.input}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           autoCorrect={false}
//           value={email}
//           onChangeText={(text) => {
//             setEmail(text);
//             if (errors.email) {
//               setErrors(prev => ({ ...prev, email: null }));
//             }
//           }}
//           returnKeyType="done"
//           onSubmitEditing={handleContinue}
//           editable={!loading}
//         />
//         {email.length > 0 && (
//           <TouchableOpacity
//             onPress={() => setEmail('')}
//             style={styles.clearButton}
//           >
//             <Icon name="close-circle" size={20} color={COLORS.placeholder} />
//           </TouchableOpacity>
//         )}
//       </View>
//       {errors.email && (
//         <View style={styles.errorContainer}>
//           <Icon name="alert-circle-outline" size={16} color={COLORS.error} />
//           <Text style={styles.errorText}>{errors.email}</Text>
//         </View>
//       )}
//       <Text style={styles.helperText}>
//         We'll send a 6-digit verification code to this email
//       </Text>
//     </View>
//   );

//   // ─── Render Country Picker Modal ────────────────────────────────────────
//   const renderCountryPicker = () => (
//     <Modal
//       visible={showCountryPicker}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setShowCountryPicker(false)}
//     >
//       <View style={styles.pickerOverlay}>
//         <View style={styles.pickerContainer}>
//           <View style={styles.pickerHeader}>
//             <Text style={styles.pickerTitle}>Select Country</Text>
//             <TouchableOpacity
//               onPress={() => setShowCountryPicker(false)}
//               style={styles.pickerClose}
//             >
//               <Icon name="close" size={24} color={COLORS.textPrimary} />
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView showsVerticalScrollIndicator={false}>
//             {COUNTRY_CODES.map((country, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.pickerItem,
//                   country.code === countryCode && styles.pickerItemSelected,
//                 ]}
//                 onPress={() => {
//                   setCountryCode(country.code);
//                   setShowCountryPicker(false);
//                 }}
//               >
//                 <Text style={styles.pickerFlag}>{country.flag}</Text>
//                 <Text style={styles.pickerCountry}>{country.country}</Text>
//                 <Text style={styles.pickerCode}>{country.code}</Text>
//                 {country.code === countryCode && (
//                   <Icon name="checkmark" size={20} color={COLORS.primary} />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   // ─── Main Render ──────────────────────────────────────────────────────────
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />

//       <KeyboardAvoidingView
//         style={styles.keyboardView}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Back Button */}
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
//           </TouchableOpacity>

//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.logoWrapper}>
//                           <LinearGradient
//                             colors={['#0066FF', '#0052CC']}
//                             style={styles.logoGradient}
//                           >
//                             <Image
//                               source={require('../../assets/images/showaAppLogo.png')} 
//                               style={styles.logoImage}
//                               resizeMode="contain"
//                             />
//                           </LinearGradient>
//                         </View>
//             <Text style={styles.headerTitle}>Create Account</Text>
//             <Text style={styles.headerSubtitle}>Connect with friends, communities, and opportunities.</Text>
//           </View>

//           {/* Method Selection */}
//           {renderMethodSelection()}

//           {/* Input Section */}
//           {selectedMethod === 'phone' && renderPhoneInput()}
//           {selectedMethod === 'email' && renderEmailInput()}

//           {/* Continue Button */}
//           {selectedMethod && (
//             <TouchableOpacity
//               onPress={handleContinue}
//               style={[
//                 styles.continueButton,
//                 loading && styles.buttonDisabled,
//               ]}
//               activeOpacity={0.8}
//               disabled={loading}
//             >
//               <LinearGradient
//                 colors={[COLORS.primary, COLORS.primaryDark]}
//                 style={styles.buttonGradient}
//               >
//                 {loading ? (
//                   <ActivityIndicator size="small" color={COLORS.white} />
//                 ) : (
//                   <>
//                     <Text style={styles.buttonText}>Continue</Text>
//                     <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
//                   </>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>
//           )}

//           {/* Login Link */}
//           <View style={styles.loginContainer}>
//             <Text style={styles.loginText}>Already have an account? </Text>
//             <TouchableOpacity onPress={() => navigation.navigate('EmailLogin')}>
//               <Text style={styles.loginLink}>Log In</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* Country Picker Modal */}
//       {renderCountryPicker()}

//       {/* Network Error Modal */}
//       <NetworkStatusModal
//         visible={networkModalVisible}
//         message={networkMessage}
//         onRetry={retryAction}
//         onCancel={hideNetworkModal}
//         loading={networkLoading}
//       />
//     </SafeAreaView>
//   );
// }

// // ─── Styles ──────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e9ebf1',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: SPACING.lg,
//     paddingBottom: SPACING.xl,
//   },
  
//   // ── Back Button ─────────────────────────────────────────────────────────
//   backButton: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     marginTop: SPACING.sm,
//     marginBottom: SPACING.sm,
//   },

//   // ── Header ──────────────────────────────────────────────────────────────
//   header: {
//     marginBottom: SPACING.xl,
//     justifyContent:'center',
//     alignSelf:'center'
//   },
//   headerTitle: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginBottom: SPACING.xs,
//     justifyContent:'center',
//     alignSelf:'center'
//   },
//   headerSubtitle: {
//     fontSize: 15,
//     color: COLORS.textSecondary,
//   },

//   // ── Method Selection ────────────────────────────────────────────────────
//   methodContainer: {
//     marginBottom: SPACING.xl,
//   },
//   methodTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginBottom: SPACING.xs,
//   },
//   methodSubtitle: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginBottom: SPACING.lg,
//   },
//   methodCard: {
 
//     borderRadius: 50,
//     marginBottom: SPACING.md,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: 'transparent',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 2,
        
//       },
//     }),
//   },
//   methodCardSelected: {
//     borderColor: COLORS.primary,
//     ...Platform.select({
//       ios: {
//         shadowColor: COLORS.primary,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   methodCardGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: SPACING.md,
//     minHeight: 72,
//   },
//   methodIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     marginRight: SPACING.md,
//   },
//   methodTextContainer: {
//     flex: 1,
//   },
//   methodCardTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//   },
//   methodCardTitleSelected: {
//     color: COLORS.white,
//   },
//   methodCardSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//     marginTop: 2,
//   },
//   methodCardSubtitleSelected: {
//     color: 'rgba(255,255,255,0.8)',
//   },
//   methodCheckmark: {
//     marginLeft: SPACING.sm,
//   },

//   // ── Input Section ──────────────────────────────────────────────────────
//   inputSection: {
//     marginBottom: SPACING.lg,
//   },
//   inputLabel: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginBottom: SPACING.sm,
//   },

//   // ── Phone Input ────────────────────────────────────────────────────────
//   phoneInputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     backgroundColor: COLORS.white,
//     height: 56,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   countryCodeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.md,
//     height: '100%',
//   },
//   countryCodeText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: COLORS.textPrimary,
//     marginRight: SPACING.xs,
//   },
//   divider: {
//     width: 1,
//     height: 30,
//     backgroundColor: COLORS.border,
//   },
//   phoneInput: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.textPrimary,
//     paddingHorizontal: SPACING.md,
//     paddingVertical: 0,
//   },

//   // ── Email Input ────────────────────────────────────────────────────────
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     backgroundColor: COLORS.white,
//     paddingHorizontal: SPACING.md,
//     height: 56,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   logoWrapper: {
//     justifyContent:'center',
//     alignSelf:'center',
//     marginBottom: 16,
//     shadowColor: '#0066FF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   logoGradient: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoImage: {
//     width: 45,
//     height: 45,
//     tintColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.textPrimary,
//     paddingVertical: 0,
//   },
//   inputIcon: {
//     marginRight: SPACING.sm,
//   },
//   clearButton: {
//     padding: SPACING.sm,
//   },

//   // ── Error / Helper ─────────────────────────────────────────────────────
//   errorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: SPACING.sm,
//     paddingHorizontal: SPACING.xs,
//   },
//   errorText: {
//     color: COLORS.error,
//     fontSize: 13,
//     marginLeft: SPACING.xs,
//     fontWeight: '500',
//   },
//   helperText: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//     marginTop: SPACING.sm,
//     paddingHorizontal: SPACING.xs,
//   },

//   // ── Continue Button ────────────────────────────────────────────────────
//   continueButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: SPACING.md,
//     marginBottom: SPACING.lg,
//     ...Platform.select({
//       ios: {
//         shadowColor: COLORS.primary,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   buttonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: 17,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   buttonIcon: {
//     marginLeft: SPACING.sm,
//   },

//   // ── Login Link ─────────────────────────────────────────────────────────
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: SPACING.md,
//   },
//   loginText: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//   },
//   loginLink: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.primary,
//   },

//   // ── Country Picker Modal ──────────────────────────────────────────────
//   pickerOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   pickerContainer: {
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingBottom: Platform.OS === 'ios' ? 40 : 20,
//     maxHeight: '60%',
//   },
//   pickerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: SPACING.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   pickerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//   },
//   pickerClose: {
//     padding: SPACING.xs,
//   },
//   pickerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.lg,
//     paddingVertical: SPACING.md,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.grayLight,
//   },
//   pickerItemSelected: {
//     backgroundColor: 'rgba(13, 100, 221, 0.05)',
//   },
//   pickerFlag: {
//     fontSize: 24,
//     marginRight: SPACING.md,
//   },
//   pickerCountry: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.textPrimary,
//   },
//   pickerCode: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     marginRight: SPACING.md,
//   },

//   // ── Network Modal ──────────────────────────────────────────────────────
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SPACING.lg,
//   },
//   modalContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 20,
//     padding: 24,
//     width: '85%',
//     maxWidth: 340,
//     alignItems: 'center',
//   },
//   modalIconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#FEF3C7',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginBottom: 8,
//   },
//   modalMessage: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   modalButtonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     width: '100%',
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalCancelButton: {
//     backgroundColor: '#F1F3F5',
//   },
//   modalRetryButton: {
//     backgroundColor: COLORS.primary,
//   },
//   modalButtonDisabled: {
//     opacity: 0.6,
//   },
//   modalCancelText: {
//     color: COLORS.textSecondary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalRetryText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { API_ROUTE } from '../../api_routing/api';

const COLORS = {
  primary: '#0d64dd',
  primaryLight: '#4a90e2',
  primaryDark: '#0a50b0',
  white: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#6c757d',
  placeholder: '#adb5bd',
  border: '#e1e5eb',
  grayLight: '#f8f9fa',
  grayMedium: '#e9ecef',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Country Codes ──────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
];

// ─── Network Status Modal ──────────────────────────────────────────────────
const NetworkStatusModal = ({ visible, message, onRetry, onCancel, loading }) => (
  <Modal
    transparent={true}
    visible={visible}
    animationType="fade"
    statusBarTranslucent={true}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalIconContainer}>
          <Icon name="wifi-outline" size={50} color={COLORS.warning} />
        </View>
        <Text style={styles.modalTitle}>Connection Issue</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalCancelButton]} 
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalRetryButton, loading && styles.modalButtonDisabled]} 
            onPress={onRetry}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.modalRetryText}>Retry</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// ─── Main Component ─────────────────────────────────────────────────────────
export default function SignupMethodScreen({ navigation }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedMethod, setSelectedMethod] = useState(null); // 'phone' or 'email'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [networkModalVisible, setNetworkModalVisible] = useState(false);
  const [networkMessage, setNetworkMessage] = useState('');
  const [networkLoading, setNetworkLoading] = useState(false);
  
  // ── Refs ──────────────────────────────────────────────────────────────────
  const phoneInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const isMounted = useRef(true);

  // ─── Network Listener ──────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('📶 Network state:', state.isConnected);
      if (state.isConnected && networkModalVisible) {
        setNetworkModalVisible(false);
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [networkModalVisible]);

  // ─── Network Error Helpers ────────────────────────────────────────────────
  const showNetworkError = useCallback((message, retryFn) => {
    setNetworkMessage(message);
    setNetworkModalVisible(true);
  }, []);

  const hideNetworkModal = useCallback(() => {
    setNetworkModalVisible(false);
    setNetworkLoading(false);
  }, []);

  const retryAction = useCallback(() => {
    setNetworkLoading(true);
    handleContinue();
  }, []);

  // ─── Validation ───────────────────────────────────────────────────────────
  const validatePhone = useCallback((number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (!cleanNumber) return 'Phone number is required';
    if (!/^[0-9]{7,15}$/.test(cleanNumber)) {
      return 'Please enter a valid phone number';
    }
    return null;
  }, []);

  const validateEmail = useCallback((emailAddr) => {
    if (!emailAddr) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddr)) {
      return 'Please enter a valid email address';
    }
    return null;
  }, []);

  // ─── Method Selection ─────────────────────────────────────────────────────
  const selectMethod = useCallback((method) => {
    setSelectedMethod(method);
    setErrors({});
    // Focus the appropriate input
    setTimeout(() => {
      if (method === 'phone' && phoneInputRef.current) {
        phoneInputRef.current.focus();
      } else if (method === 'email' && emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 300);
  }, []);

  // ─── Continue Handler ─────────────────────────────────────────────────────
  const handleContinue = useCallback(async () => {
    Keyboard.dismiss();

    // ── 1. Check Network ──────────────────────────────────────────────────
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      showNetworkError(
        'No internet connection. Please check your network and try again.',
        handleContinue
      );
      return;
    }

    // ── 2. Validate Input ──────────────────────────────────────────────
    const newErrors = {};
    
    if (selectedMethod === 'phone') {
      const phoneError = validatePhone(phoneNumber);
      if (phoneError) newErrors.phone = phoneError;
    } else if (selectedMethod === 'email') {
      const emailError = validateEmail(email);
      if (emailError) newErrors.email = emailError;
    } else {
      Alert.alert('Select Method', 'Please choose a signup method first.');
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // ── 3. Check if contact exists ──────────────────────────────────
      const contactValue = selectedMethod === 'phone' 
        ? `${countryCode}${phoneNumber.replace(/\s/g, '')}`
        : email;

      const checkPayload = selectedMethod === 'phone'
        ? { phone: contactValue }
        : { email: contactValue };

      console.log('🔍 Checking contact:', contactValue);

      const checkResponse = await axios.post(
        `${API_ROUTE}/check-contact/`,
        checkPayload,
        { timeout: 10000 }
      );

      if (checkResponse.data.exists) {
        // ── Account exists - navigate to login ──────────────────────
        Alert.alert(
          'Account Found',
          `An account already exists with this ${selectedMethod === 'phone' ? 'phone number' : 'email'}. Would you like to login instead?`,
          [
            { 
              text: 'Go Back', 
              style: 'cancel',
              onPress: () => {
                setSelectedMethod(null);
                if (selectedMethod === 'phone') setPhoneNumber('');
                else setEmail('');
              }
            },
            { 
              text: 'Login',
              onPress: () => {
                navigation.navigate('EmailLogin', {
                  contact: contactValue,
                  contactType: selectedMethod,
                });
              }
            }
          ]
        );
        setLoading(false);
        return;
      }

      // ── 4. Account doesn't exist - send OTP ──────────────────────
      const otpPayload = selectedMethod === 'phone'
        ? { phone: contactValue, purpose: 'registration' }
        : { email: contactValue, purpose: 'registration' };

      console.log('📤 Sending OTP to:', contactValue);

      const otpResponse = await axios.post(
        `${API_ROUTE}/send-otp/`,
        otpPayload,
        { timeout: 15000 }
      );

      if (otpResponse.status === 200 || otpResponse.status === 201) {
        const method = otpResponse.data.method || (selectedMethod === 'phone' ? 'sms' : 'email');
        const message = otpResponse.data.message || `Verification code sent to your ${selectedMethod}`;

        Alert.alert(
          'Verification Sent',
          `${message}\n\nPlease check ${method === 'sms' ? 'your phone' : 'your email'} for the 6-digit code.`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('VerificationCode', {
                  contactID: contactValue,
                  contactType: selectedMethod,
                  purpose: 'registration',
                  phoneNumberID: selectedMethod === 'phone' ? contactValue : '',
                  emailID: selectedMethod === 'email' ? contactValue : '',
                });
              }
            }
          ]
        );
      } else {
        throw new Error('Failed to send verification code');
      }

    } catch (error) {
      console.error('❌ Error:', error);

      // ── 5. Handle Network Errors ──────────────────────────────────
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        showNetworkError(
          'Connection timeout. Please check your network and try again.',
          handleContinue
        );
        return;
      }

      if (!error.response) {
        showNetworkError(
          'Cannot connect to server. Please check your internet connection.',
          handleContinue
        );
        return;
      }

      // ── 6. Handle Server Errors ──────────────────────────────────
      if (error.response.status >= 500 && error.response.status < 600) {
        showNetworkError(
          'Server is currently experiencing issues. Please try again later.',
          handleContinue
        );
        return;
      }

      // ── 7. Handle Client Errors ──────────────────────────────────
      let errorMessage = 'Unable to continue. Please try again.';
      const backendError = error.response?.data;
      
      if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (backendError?.phone) {
        errorMessage = `Phone: ${backendError.phone[0]}`;
      } else if (backendError?.email) {
        errorMessage = `Email: ${backendError.email[0]}`;
      }

      Alert.alert('Error', errorMessage);

    } finally {
      if (isMounted.current) {
        setLoading(false);
        setNetworkLoading(false);
      }
    }
  }, [
    selectedMethod,
    phoneNumber,
    email,
    countryCode,
    validatePhone,
    validateEmail,
    navigation,
    showNetworkError
  ]);

  // ─── Render Method Selection ─────────────────────────────────────────────
  const renderMethodSelection = () => (
    <View style={styles.methodContainer}>
      <Text style={styles.methodTitle}>How would you like to continue?</Text>
      <Text style={styles.methodSubtitle}>Select your preferred signup method</Text>

      <TouchableOpacity
        style={[
          styles.methodCard,
          selectedMethod === 'phone' && styles.methodCardSelected,
        ]}
        onPress={() => selectMethod('phone')}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={selectedMethod === 'phone' ? [COLORS.primary, COLORS.primaryDark] : ['#f8f9fa', '#f1f3f5']}
          style={styles.methodCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.methodIconContainer}>
            <Icon 
              name="call-outline" 
              size={28} 
              color={selectedMethod === 'phone' ? COLORS.white : COLORS.primary} 
            />
          </View>
          <View style={styles.methodTextContainer}>
            <Text style={[
              styles.methodCardTitle,
              selectedMethod === 'phone' && styles.methodCardTitleSelected
            ]}>
              Phone Number
            </Text>
            <Text style={[
              styles.methodCardSubtitle,
              selectedMethod === 'phone' && styles.methodCardSubtitleSelected
            ]}>
              Use your mobile number
            </Text>
          </View>
          {selectedMethod === 'phone' && (
            <View style={styles.methodCheckmark}>
              <Icon name="checkmark-circle" size={24} color={COLORS.white} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodCard,
          selectedMethod === 'email' && styles.methodCardSelected,
        ]}
        onPress={() => selectMethod('email')}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={selectedMethod === 'email' ? [COLORS.primary, COLORS.primaryDark] : ['#f8f9fa', '#f1f3f5']}
          style={styles.methodCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.methodIconContainer}>
            <Icon 
              name="mail-outline" 
              size={28} 
              color={selectedMethod === 'email' ? COLORS.white : COLORS.primary} 
            />
          </View>
          <View style={styles.methodTextContainer}>
            <Text style={[
              styles.methodCardTitle,
              selectedMethod === 'email' && styles.methodCardTitleSelected
            ]}>
              Email Address
            </Text>
            <Text style={[
              styles.methodCardSubtitle,
              selectedMethod === 'email' && styles.methodCardSubtitleSelected
            ]}>
              Use your email address
            </Text>
          </View>
          {selectedMethod === 'email' && (
            <View style={styles.methodCheckmark}>
              <Icon name="checkmark-circle" size={24} color={COLORS.white} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // ─── Render Phone Input ──────────────────────────────────────────────────
  const renderPhoneInput = () => (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>Phone Number</Text>
      <View style={styles.phoneInputWrapper}>
        {/* Country Code Picker */}
        <TouchableOpacity
          style={styles.countryCodeButton}
          onPress={() => setShowCountryPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.countryCodeText}>
            {COUNTRY_CODES.find(c => c.code === countryCode)?.flag || '🇳🇬'}
          </Text>
          <Text style={styles.countryCodeText}>
            {countryCode}
          </Text>
          <Icon name="chevron-down" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TextInput
          ref={phoneInputRef}
          placeholder="8123456789"
          style={styles.phoneInput}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9]/g, '');
            setPhoneNumber(cleaned);
            if (errors.phone) {
              setErrors(prev => ({ ...prev, phone: null }));
            }
          }}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
          editable={!loading}
          maxLength={15}
        />
      </View>
      {errors.phone && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{errors.phone}</Text>
        </View>
      )}
      <Text style={styles.helperText}>
        We'll send a 6-digit verification code via SMS
      </Text>
    </View>
  );

  // ─── Render Email Input ──────────────────────────────────────────────────
  const renderEmailInput = () => (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>Email Address</Text>
      <View style={styles.inputWrapper}>
        <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          ref={emailInputRef}
          placeholder="example@gmail.com"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors(prev => ({ ...prev, email: null }));
            }
          }}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
          editable={!loading}
        />
        {email.length > 0 && (
          <TouchableOpacity
            onPress={() => setEmail('')}
            style={styles.clearButton}
          >
            <Icon name="close-circle" size={20} color={COLORS.placeholder} />
          </TouchableOpacity>
        )}
      </View>
      {errors.email && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{errors.email}</Text>
        </View>
      )}
      <Text style={styles.helperText}>
        We'll send a 6-digit verification code to this email
      </Text>
    </View>
  );

  // ─── Render Country Picker Modal ────────────────────────────────────────
  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Country</Text>
            <TouchableOpacity
              onPress={() => setShowCountryPicker(false)}
              style={styles.pickerClose}
            >
              <Icon name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {COUNTRY_CODES.map((country, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pickerItem,
                  country.code === countryCode && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setCountryCode(country.code);
                  setShowCountryPicker(false);
                }}
              >
                <Text style={styles.pickerFlag}>{country.flag}</Text>
                <Text style={styles.pickerCountry}>{country.country}</Text>
                <Text style={styles.pickerCode}>{country.code}</Text>
                {country.code === countryCode && (
                  <Icon name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={['#0066FF', '#0052CC']}
                style={styles.logoGradient}
              >
                <Image
                  source={require('../../assets/images/showaAppLogo.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Connect with friends, communities, and opportunities.</Text>
          </View>

          {/* Method Selection */}
          {renderMethodSelection()}

          {/* Input Section */}
          {selectedMethod === 'phone' && renderPhoneInput()}
          {selectedMethod === 'email' && renderEmailInput()}

          {/* Continue Button */}
          {selectedMethod && (
            <TouchableOpacity
              onPress={handleContinue}
              style={[
                styles.continueButton,
                loading && styles.buttonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={loading}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Continue</Text>
                    <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Login Link - Professional Container */}
          <View style={styles.loginContainerWrapper}>
            <LinearGradient
              colors={['rgba(13, 100, 221, 0.05)', 'rgba(13, 100, 221, 0.02)']}
              style={styles.loginContainerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('EmailLogin')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.loginButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.loginLink}>Log In</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Picker Modal */}
      {renderCountryPicker()}

      {/* Network Error Modal */}
      <NetworkStatusModal
        visible={networkModalVisible}
        message={networkMessage}
        onRetry={retryAction}
        onCancel={hideNetworkModal}
        loading={networkLoading}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ebf1',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  
  // ── Back Button ─────────────────────────────────────────────────────────
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    marginBottom: SPACING.xl,
    justifyContent:'center',
    alignSelf:'center'
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    justifyContent:'center',
    alignSelf:'center'
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  // ── Method Selection ────────────────────────────────────────────────────
  methodContainer: {
    marginBottom: SPACING.xl,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  methodSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  methodCard: {
    borderRadius: 50,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  methodCardSelected: {
    borderColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  methodCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    minHeight: 72,
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: SPACING.md,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  methodCardTitleSelected: {
    color: COLORS.white,
  },
  methodCardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  methodCardSubtitleSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  methodCheckmark: {
    marginLeft: SPACING.sm,
  },

  // ── Input Section ──────────────────────────────────────────────────────
  inputSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  // ── Phone Input ────────────────────────────────────────────────────────
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    height: 48, // Reduced from 56 to make it normal size
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: '100%',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  divider: {
    width: 1,
    height: 24, // Reduced from 30
    backgroundColor: COLORS.border,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 0,
  },

  // ── Email Input ────────────────────────────────────────────────────────
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    height: 48, // Reduced from 56 to make it normal size
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoWrapper: {
    justifyContent:'center',
    alignSelf:'center',
    marginBottom: 16,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 45,
    height: 45,
    tintColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  clearButton: {
    padding: SPACING.sm,
  },

  // ── Error / Helper ─────────────────────────────────────────────────────
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },

  // ── Continue Button ────────────────────────────────────────────────────
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: SPACING.sm,
  },

  // ── Login Link Container ─────────────────────────────────────────────────────────
  loginContainerWrapper: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(13, 100, 221, 0.1)',
  },
  loginContainerGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  loginButtonGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // ── Country Picker Modal ──────────────────────────────────────────────
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '60%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pickerClose: {
    padding: SPACING.xs,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  pickerItemSelected: {
    backgroundColor: 'rgba(13, 100, 221, 0.05)',
  },
  pickerFlag: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  pickerCountry: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  pickerCode: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginRight: SPACING.md,
  },

  // ── Network Modal ──────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F1F3F5',
  },
  modalRetryButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalRetryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
