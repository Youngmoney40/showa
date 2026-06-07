
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
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
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
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
//   success: '#0d64dd',
//   error: '#dc3545',
//   warning: '#ffc107',
//   info: '#17a2b8',
// };

// const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// export default function EmailScreen({ navigation, route }) {
//   const phoneNumber = route.params?.phoneNumberID;
//   const navigate = useNavigation();
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loginLoading, setLoginLoading] = useState(false);
//   const emailInputRef = useRef(null);


//   useEffect(() => {
//     const focusTimer = setTimeout(() => {
//       emailInputRef.current?.focus();
//     }, 400);

//     return () => clearTimeout(focusTimer);
//   }, []);

//   const redirectBack = () => {
//     navigation.navigate('Signin');
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) {
//       return 'Please enter your email address';
//     }
//     if (!emailRegex.test(email)) {
//       return 'Please enter a valid email address';
//     }
//     return '';
//   };

//   const checkEmailExists = async () => {
//     try {
//       const response = await axios.post(`${API_ROUTE}/check-email/`, { email });
//       return response.data.exists;
//     } catch (error) {
//       console.error('Error checking email:', error);
//       return false;
//     }
//   };

//   const handleEmailSentOTP = async () => {
//     const validationError = validateEmail(email);
//     if (validationError) {
//       setEmailError(validationError);
//       return;
//     }

//     setLoading(true);
//     setEmailError('');

//     try {
//       const emailExists = await checkEmailExists();
      
//       if (emailExists) {
//         setModalVisible(true);
//         setLoading(false);
//         return;
//       }

//       await sendOTP('registration');
//     } catch (error) {
//       console.error('Error:', error.response || error);
//       if (error.response?.data?.email) {
//         setEmailError(error.response.data.email[0]);
//       } else {
//         Alert.alert(
//           'Network Error',
//           'Unable to connect. Please check your internet connection and try again.',
//           [{ text: 'OK', style: 'default' }]
//         );
//       }
//       setLoading(false);
//     }
//   };

//   const sendOTP = async (purpose) => {
//     try {
//       const response = await axios.post(`${API_ROUTE}/send-otp/`, { 
//         email, 
//         purpose,
//         phoneNumber 
//       });
      
//       if (response.status === 200 || response.status === 201) {
//         Alert.alert(
//           'Verification Sent ✓',
//           `A 6-digit OTP has been sent to:\n${email}\n\nPlease check your inbox and enter the code to ${purpose === 'login' ? 'login' : 'complete your registration'}.`,
//           [
//             { 
//               text: 'OK', 
//               style: 'default',
//               onPress: () => {
//                 if (purpose === 'login') {
//                   navigation.navigate('VerificationCode', {
//                     emailID: email,
//                     purpose: 'login'
//                   });
//                 } else {
//                   navigation.navigate('LinkingScreen', {
//                     phoneNumberID: phoneNumber,
//                     emailID: email,
//                   });
//                 }
//               }
//             }
//           ]
//         );
//       } else {
//         Alert.alert('Error', 'Failed to send OTP. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       Alert.alert(
//         'Sending Failed',
//         'Unable to send verification code. Please check your network and try again.'
//       );
//     } finally {
//       setLoading(false);
//       setLoginLoading(false);
//       setModalVisible(false);
//     }
//   };

//   const handleLoginInstead = async () => {
//     setLoginLoading(true);
//     await sendOTP('login');
//   };

//   const handleUseDifferentEmail = () => {
//     setModalVisible(false);
//     setEmail('');
//     // Re-focus on the input after clearing
//     setTimeout(() => {
//       emailInputRef.current?.focus();
//     }, 100);
//   };

//   const handleKeyPress = ({ nativeEvent }) => {
//     if (nativeEvent.key === 'Enter' || nativeEvent.key === 'done') {
//       handleEmailSentOTP();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor={COLORS.white}
//         translucent={false}
//       />
      
//       {/* Header */}
//       <LinearGradient 
//         colors={[COLORS.primary, COLORS.primary]} 
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
//             <Icon name="arrow-back" size={24} color={COLORS.white} />
//           </TouchableOpacity>
          
//           <View style={styles.headerTitleContainer}>
//             <Text style={styles.headerTitle}>Email Verification</Text>
//             <Text style={styles.headerSubtitle}>Step 2 of 3</Text>
//           </View>
          
//           <TouchableOpacity 
//             onPress={redirectBack}
//             style={styles.headerButton}
//             activeOpacity={0.7}
//           >
//             <Icon name="close" size={24} color={COLORS.white} />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {/* Main Content */}
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
//           {/* Hero Section */}
//           <View style={styles.heroContainer}>
//             <LinearGradient
//               colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
//               style={styles.heroIconContainer}
//             >
//               <Icon name="mail-outline" size={42} color={COLORS.primary} />
//             </LinearGradient>
            
//             <Text style={styles.heroTitle}>Add Your Email</Text>
//             <Text style={styles.heroSubtitle}>
//               Enter your email address to receive a verification code and secure your account
//             </Text>
//           </View>

//           {/* Form Section */}
//           <View style={styles.formContainer}>
//             {/* Email Input */}
//             <View style={styles.inputSection}>
//               <Text style={styles.inputLabel}>Email Address</Text>
//               <View style={[
//                 styles.inputWrapper,
//                 emailError && styles.inputWrapperError,
//                 email && !emailError && styles.inputWrapperSuccess,
//               ]}>
//                 <Icon 
//                   name="mail-outline" 
//                   size={20} 
//                   color={emailError ? COLORS.error : email ? COLORS.success : COLORS.textSecondary} 
//                   style={styles.inputIcon} 
//                 />
//                 <TextInput
//                   ref={emailInputRef}
//                   placeholder="Enter your email"
//                   style={styles.input}
//                   keyboardType="email-address"
//                   autoComplete="email"
//                   autoCapitalize="none"
//                   placeholderTextColor='#000000'
//                   autoCorrect={false}
//                   textContentType="emailAddress"
//                   value={email}
//                   onChangeText={(text) => {
//                     setEmail(text.trim());
//                     if (emailError) setEmailError('');
//                   }}
                 
//                   returnKeyType="send"
//                   onSubmitEditing={handleEmailSentOTP}
//                   blurOnSubmit={false}
//                   editable={!loading}
//                   onKeyPress={handleKeyPress}
//                   autoFocus={true}
//                 />
                
//                 {email.length > 0 && (
//                   <TouchableOpacity
//                     onPress={() => {
//                       setEmail('');
//                       emailInputRef.current?.focus();
//                     }}
//                     style={styles.clearButton}
//                     activeOpacity={0.6}
//                   >
//                     <Icon name="close-circle" size={20} color={COLORS.placeholder} />
//                   </TouchableOpacity>
//                 )}
//               </View>
              
//               {emailError ? (
//                 <View style={styles.errorContainer}>
//                   <Icon name="alert-circle-outline" size={16} color={COLORS.error} />
//                   <Text style={styles.errorText}>{emailError}</Text>
//                 </View>
//               ) : (
//                 <Text style={styles.helperText}>
//                   We'll send a 6-digit verification code to this email
//                 </Text>
//               )}
//             </View>

//             {/* Continue Button */}
//             <TouchableOpacity
//               onPress={handleEmailSentOTP}
//               style={[
//                 styles.continueButton,
//                 (!email || loading) && styles.buttonDisabled,
//               ]}
//               activeOpacity={0.8}
//               disabled={!email || loading}
//             >
//               <LinearGradient 
//                 colors={[COLORS.primary, COLORS.primary]} 
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.buttonGradient}
//               >
//                 {loading ? (
//                   <ActivityIndicator style={{padding:20}} size="small" color={COLORS.white} />
//                 ) : (
//                   <>
//                     <Text style={styles.buttonText}>Continue</Text>
//                   </>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>

//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* Professional Email Already Registered Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//         statusBarTranslucent={true}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
        
//             {/* Modal Body */}
//             <View style={styles.modalBody}>
//               <View style={styles.modalIconContainer}>
//                 <View style={styles.modalIconCircle}>
//                   <Icon name="checkmark-circle" size={48} color={COLORS.primary} />
//                 </View>
//               </View>
              
              
//               <Text style={styles.modalMainText}>
//                <Text style={[styles.modalTitle,{color:'black',fontSize:24,fontWeight:'800'}]}>Account Found</Text>
//               </Text>
              
//               <Text style={styles.modalSubtext}>
//                 We found an existing account associated with:
//               </Text>

//               <View style={styles.emailContainer}>
//                 <Icon name="mail" size={18} color={COLORS.primary} style={styles.emailIcon} />
//                 <Text style={styles.emailText}>{email}</Text>
//               </View>

//               <Text style={styles.modalDescription}>
//                 Would you like to login to your existing account or use a different email address?
//               </Text>

//               {/* Modal Buttons */}
//               <View style={styles.modalButtons}>
//                 <TouchableOpacity 
//                   style={[styles.modalButton, styles.primaryModalButton]}
//                   onPress={handleLoginInstead}
//                   activeOpacity={0.8}
//                   disabled={loginLoading}
//                 >
//                   {loginLoading ? (
//                     <ActivityIndicator size="small" color={COLORS.white} />
//                   ) : (
//                     <>
//                       <Icon name="log-in-outline" size={18} color={COLORS.white} style={styles.modalButtonIcon} />
//                       <Text style={styles.primaryModalButtonText}>Login with OTP</Text>
//                     </>
//                   )}
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   style={[styles.modalButton, styles.secondaryModalButton]}
//                   onPress={handleUseDifferentEmail}
//                   activeOpacity={0.7}
//                   disabled={loginLoading}
//                 >
//                   <Icon name="create-outline" size={18} color={COLORS.textPrimary} style={styles.modalButtonIcon} />
//                   <Text style={styles.secondaryModalButtonText}>Use Different Email</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Loading Overlay */}
//               {loginLoading && (
//                 <View style={styles.modalLoadingOverlay}>
//                   <View style={styles.loadingContent}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Sending OTP...</Text>
//                     <Text style={styles.loadingSubtext}>Please wait while we send your login code</Text>
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
  
//   keyboardView: {
//     flex: 1,
//   },

//   /* Header Styles */
//   header: {
//     paddingTop: SPACING.sm,
//     paddingBottom: SPACING.md,
//     backgroundColor: COLORS.primary,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.lg,
//     height: 60,
//   },
//   headerButton: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 22,
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//   },
//   headerTitleContainer: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: COLORS.white,
//     fontSize: 25,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   headerSubtitle: {
//     color: 'rgba(255, 255, 255, 0.85)',
//     fontSize: 13,
//     marginTop: SPACING.xs,
//   },

//   /* Scroll Content */
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: SPACING.xxl,
//   },

//   /* Hero Section */
//   heroContainer: {
//     alignItems: 'center',
//     marginTop: SPACING.xl,
//     marginBottom: SPACING.xxl,
//     paddingHorizontal: SPACING.lg,
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
//         elevation: 0,
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
//     lineHeight: 22,
//     paddingHorizontal: SPACING.md,
//   },

//   /* Form Section */
//   formContainer: {
//     paddingHorizontal: SPACING.lg,
//     marginBottom: SPACING.xl,
//   },
//   inputSection: {
//     marginBottom: SPACING.xl,
//   },
//   inputLabel: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginBottom: SPACING.sm,
//   },
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
//   inputWrapperError: {
//     borderColor: COLORS.error,
//     backgroundColor: 'rgba(220, 53, 69, 0.02)',
//   },
//   inputWrapperSuccess: {
//     borderColor: COLORS.success,
//   },
//   inputIcon: {
//     marginRight: SPACING.sm,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.textPrimary,
//     paddingVertical: 0,
//     fontWeight: '500',
//   },
//   clearButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
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

//   /* Continue Button */
//   continueButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
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
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   buttonText: {
//     padding: 20,
//     color: COLORS.white,
//     fontSize: 17,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },

//   /* Professional Modal Styles */
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
//     width: '100%',
//     maxWidth: 400,
//     overflow: 'hidden',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.15,
//         shadowRadius: 20,
//       },
//       android: {
//         elevation: 10,
//       },
//     }),
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.lg,
//     paddingVertical: SPACING.md,
//   },
//   modalCloseButton: {
//     width: 36,
//     height: 36,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 18,
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//   },
//   modalTitle: {
//     color: COLORS.white,
//     fontSize: 18,
//     fontWeight: '700',
//     textAlign: 'center',
//     flex: 1,
//   },
//   modalPlaceholder: {
//     width: 36,
//   },
//   modalBody: {
//     padding: SPACING.xl,
//     alignItems: 'center',
//   },
//   modalIconContainer: {
//     marginBottom: SPACING.lg,
//   },
//   modalIconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(13, 100, 221, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalMainText: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     textAlign: 'center',
//     marginBottom: SPACING.md,
//   },
//   modalSubtext: {
//     fontSize: 15,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     marginBottom: SPACING.sm,
//     lineHeight: 22,
//   },
//   emailContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(13, 100, 221, 0.08)',
//     paddingHorizontal: SPACING.md,
//     paddingVertical: SPACING.sm,
//     borderRadius: 10,
//     marginBottom: SPACING.lg,
//     borderWidth: 1,
//     borderColor: 'rgba(13, 100, 221, 0.2)',
//   },
//   emailIcon: {
//     marginRight: SPACING.sm,
//   },
//   emailText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.primary,
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     marginBottom: SPACING.xl,
//     lineHeight: 20,
//   },
//   modalButtons: {
//     width: '100%',
//     gap: SPACING.md,
//   },
//   modalButton: {
//     borderRadius: 12,
//     paddingVertical: SPACING.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     minHeight: 52,
//   },
//   primaryModalButton: {
//     backgroundColor: COLORS.primary,
//     ...Platform.select({
//       ios: {
//         shadowColor: COLORS.primary,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   primaryModalButtonText: {
//     color: COLORS.white,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   modalButtonIcon: {
//     marginRight: SPACING.sm,
//   },
//   secondaryModalButton: {
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.white,
//   },
//   secondaryModalButtonText: {
//     color: COLORS.textPrimary,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   modalLoadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//   },
//   loadingContent: {
//     alignItems: 'center',
//     padding: SPACING.xl,
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginTop: SPACING.lg,
//     marginBottom: SPACING.sm,
//   },
//   loadingSubtext: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     maxWidth: 250,
//     lineHeight: 20,
//   },
// });

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
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
  success: '#0d64dd',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EmailScreen({ navigation, route }) {
  const phoneNumber = route.params?.phoneNumberID;
  const navigate = useNavigation();
  const [contact, setContact] = useState(''); // Can be email OR phone
  const [contactType, setContactType] = useState('email'); // 'email' or 'phone'
  const [loading, setLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [usingEmailFallback, setUsingEmailFallback] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => clearTimeout(focusTimer);
  }, []);

  const redirectBack = () => {
    navigation.goBack();
  };

  const validateContact = (value) => {
    if (!value) {
      return 'Please enter your email or phone number';
    }
    
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setContactType('email');
      return '';
    }
    
    // Check if it's a phone number (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (phoneRegex.test(value)) {
      setContactType('phone');
      return '';
    }
    
    return 'Please enter a valid email or phone number';
  };

  const checkContactExists = async () => {
    try {
      const payload = contactType === 'email' 
        ? { email: contact }
        : { phone: contact };
      
      const response = await axios.post(`${API_ROUTE}/check-contact/`, payload);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking contact:', error);
      return false;
    }
  };

  const sendOTP = async (useEmailFallback = false) => {
    try {
      let payload;
      
      if (useEmailFallback) {
        // Force send to email even if it's a phone number
        payload = { email: contact, purpose: 'login' };
      } else if (contactType === 'email') {
        payload = { email: contact, purpose: 'registration' };
      } else {
        // Phone number - try SMS first
        payload = { phone: contact, purpose: 'registration' };
      }
      
      const response = await axios.post(`${API_ROUTE}/send-otp/`, payload);
      
      if (response.status === 200 || response.status === 201) {
        const method = response.data.method;
        const message = response.data.message;
        
        Alert.alert(
          'Verification Sent ✓',
          `${message}\n\nPlease check ${method === 'sms' ? 'your phone' : 'your email'} for the 6-digit code.`,
          [
            { 
              text: 'OK', 
              style: 'default',
              onPress: () => {
                // navigation.navigate('VerificationCode', {
                //   contactID: contact,
                //   contactType: useEmailFallback ? 'email' : contactType,
                //   purpose: 'login',
                //   phoneNumberID: phoneNeeeumbffer
                // });
                navigation.navigate('VerificationCode', {
                  contactID: contact,  
                  contactType: contactType,  
                  purpose: 'login',
                  phoneNumberID: phoneNumber
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // If phone SMS fails and we haven't tried email yet, offer email fallback
      if (contactType === 'phone' && !usingEmailFallback && error.response?.status === 500) {
        Alert.alert(
          'SMS Delivery Failed',
          "We couldn't send an SMS to this number. Would you like to receive the code via email instead?",
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Use Email', 
              onPress: () => {
                setUsingEmailFallback(true);
                sendOTP(true); // Retry with email
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Sending Failed',
          'Unable to send verification code. Please check your contact info and try again.'
        );
      }
    } finally {
      setLoading(false);
      setLoginLoading(false);
      setModalVisible(false);
      setUsingEmailFallback(false);
    }
  };

  const handleSendOTP = async () => {
    const validationError = validateContact(contact);
    if (validationError) {
      setContactError(validationError);
      return;
    }

    setLoading(true);
    setContactError('');

    try {
      const contactExists = await checkContactExists();
      
      if (contactExists) {
        setModalVisible(true);
        setLoading(false);
        return;
      }

      await sendOTP(false);
    } catch (error) {
      console.error('Error:', error.response || error);
      setContactError('Unable to verify. Please try again.');
      setLoading(false);
    }
  };

  const handleLoginInstead = async () => {
    setLoginLoading(true);
    await sendOTP(false);
  };

  const handleUseDifferentContact = () => {
    setModalVisible(false);
    setContact('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter' || nativeEvent.key === 'done') {
      handleSendOTP();
    }
  };

  const getIconName = () => {
    if (contactType === 'email') return 'mail-outline';
    if (contactType === 'phone') return 'call-outline';
    return 'person-outline';
  };

  const getPlaceholder = () => {
    return 'Enter email or phone number';
  };

  const getHelperText = () => {
    if (contactType === 'email') {
      return "We'll send a 6-digit verification code to this email";
    }
    return "We'll send a 6-digit verification code via SMS to this number";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
        translucent={false}
      />
      
      {/* Header */}
      <LinearGradient 
        colors={[COLORS.primary, COLORS.primary]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={redirectBack}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Account Setup</Text>
            <Text style={styles.headerSubtitle}>Step 2 of 4</Text>
          </View>
          
          <TouchableOpacity 
            onPress={redirectBack}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            {/* <Icon name="close" size={24} color={COLORS.white} /> */}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content */}
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
          {/* Hero Section */}
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
              style={styles.heroIconContainer}
            >
              <Icon name={getIconName()} size={42} color={COLORS.primary} />
            </LinearGradient>
            
            <Text style={styles.heroTitle}>Verify Your Contact</Text>
            <Text style={styles.heroSubtitle}>
              Enter your email address or phone number to receive a verification code
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Contact Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Email or Phone Number</Text>
              <View style={[
                styles.inputWrapper,
                contactError && styles.inputWrapperError,
                contact && !contactError && styles.inputWrapperSuccess,
              ]}>
                <Icon 
                  name={getIconName()} 
                  size={20} 
                  color={contactError ? COLORS.error : contact ? COLORS.success : COLORS.textSecondary} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  ref={inputRef}
                  placeholder={getPlaceholder()}
                  style={styles.input}
                  keyboardType="default"
                  autoComplete="off"
                  autoCapitalize="none"
                  placeholderTextColor='#000000'
                  autoCorrect={false}
                  value={contact}
                  onChangeText={(text) => {
                    setContact(text);
                    if (contactError) setContactError('');
                  }}
                  returnKeyType="send"
                  onSubmitEditing={handleSendOTP}
                  blurOnSubmit={false}
                  editable={!loading}
                  onKeyPress={handleKeyPress}
                  autoFocus={true}
                />
                
                {contact.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setContact('');
                      inputRef.current?.focus();
                    }}
                    style={styles.clearButton}
                    activeOpacity={0.6}
                  >
                    <Icon name="close-circle" size={20} color={COLORS.placeholder} />
                  </TouchableOpacity>
                )}
              </View>
              
              {contactError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle-outline" size={16} color={COLORS.error} />
                  <Text style={styles.errorText}>{contactError}</Text>
                </View>
              ) : (
                <Text style={styles.helperText}>
                  {getHelperText()}
                </Text>
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleSendOTP}
              style={[
                styles.continueButton,
                (!contact || loading) && styles.buttonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={!contact || loading}
            >
              <LinearGradient 
                colors={[COLORS.primary, COLORS.primary]} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator style={{padding:20}} size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Continue</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Account Found Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              <View style={styles.modalIconContainer}>
                <View style={styles.modalIconCircle}>
                  <Icon name="checkmark-circle" size={48} color={COLORS.primary} />
                </View>
              </View>
              
              <Text style={styles.modalMainText}>
               <Text style={[styles.modalTitle,{color:'black',fontSize:24,fontWeight:'800'}]}>Account Found</Text>
              </Text>
              
              <Text style={styles.modalSubtext}>
                We found an existing account associated with:
              </Text>

              <View style={styles.emailContainer}>
                <Icon name={contactType === 'email' ? "mail" : "call"} size={18} color={COLORS.primary} style={styles.emailIcon} />
                <Text style={styles.emailText}>{contact}</Text>
              </View>

              <Text style={styles.modalDescription}>
                Would you like to login to your existing account or use a different contact?
              </Text>

              {/* Modal Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryModalButton]}
                  onPress={handleLoginInstead}
                  activeOpacity={0.8}
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Icon name="log-in-outline" size={18} color={COLORS.white} style={styles.modalButtonIcon} />
                      <Text style={styles.primaryModalButtonText}>Verify</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* <TouchableOpacity 
                  style={[styles.modalButton, styles.secondaryModalButton]}
                  onPress={handleUseDifferentContact}
                  activeOpacity={0.7}
                  disabled={loginLoading}
                >
                  <Icon name="create-outline" size={18} color={COLORS.textPrimary} style={styles.modalButtonIcon} />
                  <Text style={styles.secondaryModalButtonText}>Use Different Contact</Text>
                </TouchableOpacity> */}
              </View>

              {/* Loading Overlay */}
              {loginLoading && (
                <View style={styles.modalLoadingOverlay}>
                  <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Sending OTP...</Text>
                    <Text style={styles.loadingSubtext}>Please wait while we send your verification code</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  keyboardView: {
    flex: 1,
  },

  /* Header Styles */
  header: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    height: 60,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    ///backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginTop: SPACING.xs,
  },

  /* Scroll Content */
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },

  /* Hero Section */
  heroContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },

  /* Form Section */
  formContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  inputSection: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    height: 56,
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
  inputWrapperError: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(220, 53, 69, 0.02)',
  },
  inputWrapperSuccess: {
    borderColor: COLORS.success,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 0,
    fontWeight: '500',
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

  /* Continue Button */
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    padding: 20,
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Modal Styles */
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
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalBody: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: SPACING.lg,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(13, 100, 221, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMainText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modalSubtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 100, 221, 0.08)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(13, 100, 221, 0.2)',
  },
  emailIcon: {
    marginRight: SPACING.sm,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  modalButtons: {
    width: '100%',
    gap: SPACING.md,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 52,
  },
  primaryModalButton: {
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryModalButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  modalButtonIcon: {
    marginRight: SPACING.sm,
  },
  secondaryModalButton: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  secondaryModalButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  modalLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingContent: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 20,
  },
});
