


// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Platform,
//   Alert,
//   ActivityIndicator,
//   Animated,
//   KeyboardAvoidingView,
//   ScrollView
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { launchImageLibrary } from 'react-native-image-picker';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const RegistrationScreen = ({ navigation, route }) => {
//   const { phoneNumberID, emailID } = route.params;
//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     profilePic: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [termsError, setTermsError] = useState(false);
//   const nameInputRef = useRef(null);
//   const usernameInputRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = 'Full name is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
//   };

//   const handleConfirmDetails = () => {
//     if (!validateForm()) return;
//     setShowConfirmation(true);
//     setTermsError(false);
//   };

//   const handleEditDetails = () => {
//     setShowConfirmation(false);
//     setTermsAccepted(false);
//     setTermsError(false);
//   };

//   const handleRegister = async () => {
//     // Check if terms are accepted
//     if (!termsAccepted) {
//       setTermsError(true);
//       Alert.alert(
//         'Terms Required',
//         'Please accept the terms of service to continue.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     setLoading(true);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();

//     const payload = new FormData();
//     payload.append('phone', phoneNumberID);
//     payload.append('name', formData.name.trim());
//     payload.append('email', emailID);
//     payload.append('username', formData.username.trim());
    
//     if (formData.profilePic) {
//       payload.append('profile_picture', {
//         uri: formData.profilePic.uri,
//         name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
//         type: formData.profilePic.type || 'image/jpeg',
//       });
//     }

//     try {
//       console.log('Sending registration request...');
//       const response = await axios.post(`${API_ROUTE}/register/`, payload, {
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json'
//         },
//         timeout: 15000
//       });

//       console.log('Registration response:', {
//         status: response.status,
//         data: response.data
//       });

//       if (response.status === 200 || response.status === 201) {
//         const { token, refresh, user } = response.data;

//         if (!token) {
//           throw new Error('No token received from server');
//         }
        
//         await Promise.all([
//           AsyncStorage.setItem('userToken', token),
//           AsyncStorage.setItem('refreshToken', refresh || ''),
//           AsyncStorage.setItem('userData', JSON.stringify(user)),
//           AsyncStorage.setItem('username', formData.username.trim()) 
//         ]);

//         navigation.navigate('SynMessage');
//       } else {
//         throw new Error(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Registration error details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         code: error.code
//       });

//       let errorMessage = 'Unable to complete registration. Please try again.';
      
//       if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Request timeout. Please check your connection and try again.';
//       } else if (error.response?.data) {
//         const backendError = error.response.data;
//         if (backendError.message) {
//           errorMessage = backendError.message;
//         } else if (backendError.email) {
//           errorMessage = `Email: ${backendError.email[0]}`;
//         } else if (backendError.phone) {
//           errorMessage = `Phone: ${backendError.phone[0]}`;
//         } else if (backendError.name) {
//           errorMessage = `Name: ${backendError.name[0]}`;
//         }
//       } else if (!error.response) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }

//       Alert.alert(
//         'Registration Error',
//         errorMessage,
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setLoading(false);
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   const handleChoosePhoto = () => {
//     launchImageLibrary({
//       mediaType: 'photo',
//       maxWidth: 1024,
//       maxHeight: 1024,
//       quality: 0.8,
//       includeBase64: false,
//       selectionLimit: 1
//     }, ({ didCancel, errorCode, assets }) => {
//       if (didCancel) return;
//       if (errorCode) {
//         Alert.alert('Error', 'Failed to select image');
//         return;
//       }
//       if (assets?.[0]) {
//         handleInputChange('profilePic', assets[0]);
//       }
//     });
//   };

//   const navigateToTerms = () => {
//     navigation.navigate('TermsCondition');
//   };

//   // Render confirmation view
//   if (showConfirmation) {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//         >
//           <LinearGradient
//             colors={['#0A56C4', '#0D64DD']}
//             style={styles.header}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Text style={styles.headerTitle}>Confirm Details</Text>
//             <Text style={styles.headerSubtitle}>Please verify your information before proceeding</Text>
//           </LinearGradient>

//           <View style={styles.formContainer}>
//             <View style={styles.avatarSection}>
//               <View style={styles.avatarContainer}>
//                 {formData.profilePic ? (
//                   <Image 
//                     source={{ uri: formData.profilePic.uri }} 
//                     style={styles.avatarImage} 
//                   />
//                 ) : (
//                   <Icon name="person" size={36} color="#C7D2E8" />
//                 )}
//               </View>
//             </View>

//             <View style={styles.confirmationCard}>
//               <View style={styles.confirmationRow}>
//                 <Text style={styles.confirmationLabel}>Full Name</Text>
//                 <Text style={styles.confirmationValue}>{formData.name}</Text>
//               </View>
              
//               <View style={styles.confirmationDivider} />
              
//               <View style={styles.confirmationRow}>
//                 <Text style={styles.confirmationLabel}>Username</Text>
//                 <Text style={styles.confirmationValue}>
//                   {formData.username || 'Not provided'}
//                 </Text>
//               </View>
//             </View>

//             {/* Terms of Service Agreement with Clickable Link */}
//             <View style={[
//               styles.termsContainer,
//               termsError && styles.termsErrorBorder
//             ]}>
//               <TouchableOpacity
//                 style={styles.checkboxContainer}
//                 onPress={() => {
//                   setTermsAccepted(!termsAccepted);
//                   if (termsError) setTermsError(false);
//                 }}
//                 activeOpacity={0.7}
//               >
//                 <View style={[
//                   styles.checkbox,
//                   termsAccepted && styles.checkboxChecked
//                 ]}>
//                   {termsAccepted && (
//                     <Icon name="checkmark" size={16} color="#FFF" />
//                   )}
//                 </View>
//                 <View style={styles.termsTextContainer}>
//                   <Text style={styles.termsText}>
//                     By using Showa, you agree to our{' '}
//                     <Text 
//                       style={styles.termsLink}
//                       onPress={navigateToTerms}
//                     >
//                       Terms & Conditions
//                     </Text>
//                     . Showa has zero tolerance for objectionable content and abusive users. Violations will result in account suspension or permanent ban.
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//               {termsError && (
//                 <Text style={styles.termsErrorText}>
//                   You must accept the terms to continue
//                 </Text>
//               )}
//             </View>

//             <Animated.View style={{ opacity: fadeAnim }}>
//               <ActivityIndicator 
//                 size="small" 
//                 color="#0D64DD" 
//                 style={styles.loadingIndicator} 
//               />
//             </Animated.View>

//             <View style={styles.buttonGroup}>
//               <TouchableOpacity
//                 onPress={handleEditDetails}
//                 style={styles.editButton}
//                 disabled={loading}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.editButtonText}>EDIT</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handleRegister}
//                 style={[
//                   styles.confirmButton,
//                   loading && styles.submitButtonDisabled
//                 ]}
//                 disabled={loading}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.confirmButtonText}>
//                   {loading ? 'REGISTERING...' : 'PROCEED'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     );
//   }

//   // Render input form
//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <LinearGradient
//           colors={['#0A56C4', '#0D64DD']}
//           style={styles.header}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <Text style={styles.headerTitle}>Account Setup</Text>
//           <Text style={styles.headerSubtitle}>Complete your profile information</Text>
//         </LinearGradient>

//         <View style={styles.formContainer}>
//           <View style={styles.avatarSection}>
//             <TouchableOpacity 
//               onPress={handleChoosePhoto}
//               style={[
//                 styles.avatarContainer,
//                 errors.profilePic && styles.errorBorder
//               ]}
//               activeOpacity={0.7}
//             >
//               {formData.profilePic ? (
//                 <Image 
//                   source={{ uri: formData.profilePic.uri }} 
//                   style={styles.avatarImage} 
//                 />
//               ) : (
//                 <Icon name="person" size={36} color="#C7D2E8" />
//               )}
//               <View style={styles.cameraBadge}>
//                 <Icon name="camera" size={16} color="#FFF" />
//               </View>
//             </TouchableOpacity>
//             {errors.profilePic && (
//               <Text style={styles.errorText}>{errors.profilePic}</Text>
//             )}
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>FULL NAME</Text>
//             <View style={[
//               styles.inputContainer,
//               errors.name && styles.errorBorder
//             ]}>
//               <TextInput
//                 ref={nameInputRef}
//                 placeholder="Enter your full name"
//                 placeholderTextColor="#9FA5B4"
//                 value={formData.name}
//                 onChangeText={(text) => handleInputChange('name', text)}
//                 style={styles.inputField}
//                 autoCapitalize="words"
//                 autoCorrect={false}
//                 returnKeyType="next"
//                 onSubmitEditing={() => usernameInputRef.current?.focus()}
//                 blurOnSubmit={false}
//               />
//               <Icon 
//                 name="person-outline" 
//                 size={20} 
//                 color="#9FA5B4" 
//                 style={styles.inputIcon} 
//               />
//             </View>
//             {errors.name && (
//               <Text style={styles.errorText}>{errors.name}</Text>
//             )}
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>USERNAME (Optional)</Text>
//             <View style={[
//               styles.inputContainer,
//               errors.username && styles.errorBorder
//             ]}>
//               <TextInput
//                 ref={usernameInputRef}
//                 placeholder="Enter your username"
//                 placeholderTextColor="#9FA5B4"
//                 value={formData.username}
//                 onChangeText={(text) => handleInputChange('username', text)}
//                 style={styles.inputField}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 returnKeyType="done"
//                 onSubmitEditing={handleConfirmDetails}
//               />
//               <Icon 
//                 name="at-outline" 
//                 size={20} 
//                 color="#9FA5B4" 
//                 style={styles.inputIcon} 
//               />
//             </View>
//             {errors.username && (
//               <Text style={styles.errorText}>{errors.username}</Text>
//             )}
//           </View>

//           <TouchableOpacity
//             onPress={handleConfirmDetails}
//             style={styles.submitButton}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.submitButtonText}>CONTINUE</Text>
//             <Icon 
//               name="arrow-forward" 
//               size={20} 
//               color="#FFF" 
//               style={styles.buttonIcon} 
//             />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC'
//   },
//   scrollContainer: {
//     flexGrow: 1
//   },
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 0 : 20,
//     paddingBottom: 30,
//     paddingHorizontal: 0,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//     padding: 39,
//   },
//   headerTitle: {
//     paddingHorizontal: 20,
//     paddingTop: 80,
//     color: '#FFF',
//     fontSize: 28,
//     fontWeight: '600',
//     fontFamily: 'System',
//     marginBottom: 4
//   },
//   headerSubtitle: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 15,
//     fontWeight: '400',
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   formContainer: {
//     paddingHorizontal: 24,
//     paddingTop: 32,
//     paddingBottom: 40
//   },
//   avatarSection: {
//     alignItems: 'center',
//     marginBottom: 32
//   },
//   avatarContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#F0F4FE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#E2E8F0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 60
//   },
//   cameraBadge: {
//     position: 'absolute',
//     bottom: 6,
//     right: 6,
//     backgroundColor: '#0D64DD',
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#FFF'
//   },
//   inputGroup: {
//     marginBottom: 24
//   },
//   inputLabel: {
//     color: '#64748B',
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 8,
//     letterSpacing: 0.5
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2
//   },
//   inputField: {
//     flex: 1,
//     height: 52,
//     fontSize: 16,
//     color: '#1E293B',
//     paddingVertical: 14,
//     paddingRight: 16
//   },
//   inputIcon: {
//     marginLeft: 12
//   },
//   errorBorder: {
//     borderColor: '#EF4444'
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     marginTop: 6,
//     paddingLeft: 16
//   },
//   loadingIndicator: {
//     marginVertical: 16
//   },
//   submitButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0D64DD',
//     borderRadius: 12,
//     paddingVertical: 16,
//     marginTop: 16,
//     shadowColor: '#0D64DD',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#9CA3AF',
//     shadowColor: '#9CA3AF',
//   },
//   submitButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//     letterSpacing: 0.5
//   },
//   buttonIcon: {
//     marginLeft: 10
//   },
//   // Confirmation screen styles
//   confirmationCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4
//   },
//   confirmationRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12
//   },
//   confirmationLabel: {
//     color: '#64748B',
//     fontSize: 14,
//     fontWeight: '500'
//   },
//   confirmationValue: {
//     color: '#1E293B',
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   confirmationDivider: {
//     height: 1,
//     backgroundColor: '#E2E8F0'
//   },
//   buttonGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16
//   },
//   editButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     paddingVertical: 16,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: '#0D64DD'
//   },
//   editButtonText: {
//     color: '#0D64DD',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8
//   },
//   confirmButton: {
//     flex: 2,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0D64DD',
//     borderRadius: 12,
//     paddingVertical: 16,
//     shadowColor: '#0D64DD',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6
//   },
//   confirmButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//     letterSpacing: 0.5
//   },

//   termsContainer: {
//     marginBottom: 24,
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   termsErrorBorder: {
//     borderColor: '#EF4444',
//     backgroundColor: '#FEF2F2',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#CBD5E1',
//     backgroundColor: '#FFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     marginTop: 2,
//   },
//   checkboxChecked: {
//     backgroundColor: '#0D64DD',
//     borderColor: '#0D64DD',
//   },
//   termsTextContainer: {
//     flex: 1,
//   },
//   termsText: {
//     color: '#334155',
//     fontSize: 13,
//     lineHeight: 18,
//     fontWeight: '400',
//   },
//   termsLink: {
//     color: '#0D64DD',
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//   },
//   termsErrorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     marginTop: 8,
//     marginLeft: 34,
//   }
// });

// export default RegistrationScreen;

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  PermissionsAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = ({ navigation, route }) => {
  // Safely get params with defaults
  const phoneNumberID = route?.params?.phoneNumberID || '';
  const emailID = route?.params?.emailID || '';
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    profilePic: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const nameInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);
  const navigationTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Request storage permission for Android
  const requestStoragePermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your gallery to select profile picture',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }, []);

  // Validate form in real-time to prevent unnecessary updates
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Full name is required';
    // Username is optional, no validation needed
    setErrors(prev => {
      // Only update if errors actually changed
      const hasChanges = JSON.stringify(prev) !== JSON.stringify(newErrors);
      return hasChanges ? newErrors : prev;
    });
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  }, [formData.name]);

  // Debounced validation to prevent excessive updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        validateForm();
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [formData.name, formData.username, validateForm]);

  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field immediately
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleConfirmDetails = useCallback(() => {
    Keyboard.dismiss(); // Dismiss keyboard before showing confirmation
    if (validateForm()) {
      // Small delay to ensure keyboard is dismissed
      setTimeout(() => {
        if (isMounted.current) {
          setShowConfirmation(true);
          setTermsError(false);
        }
      }, 50);
    }
  }, [validateForm]);

  const handleEditDetails = useCallback(() => {
    setShowConfirmation(false);
    setTermsAccepted(false);
    setTermsError(false);
  }, []);

  const handleRegister = useCallback(async () => {
    // Check if terms are accepted
    if (!termsAccepted) {
      setTermsError(true);
      Alert.alert(
        'Terms Required',
        'Please accept the terms of service to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (loading) return; // Prevent multiple submissions

    setLoading(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const payload = new FormData();
    payload.append('phone', phoneNumberID);
    payload.append('name', formData.name.trim());
    payload.append('email', emailID);
    payload.append('username', formData.username?.trim() || '');
    
    if (formData.profilePic) {
      // Fix for image picker - ensure correct format
      const imageData = {
        uri: formData.profilePic.uri,
        type: formData.profilePic.type || 'image/jpeg',
        name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
      };
      payload.append('profile_picture', imageData);
    }

    try {
      console.log('Sending registration request...');
      const response = await axios.post(`${API_ROUTE}/register/`, payload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000 // Increased timeout for image upload
      });

      console.log('Registration response:', {
        status: response.status,
        data: response.data
      });

      if (response.status === 200 || response.status === 201) {
        const { token, refresh, user } = response.data;

        if (!token) {
          throw new Error('No token received from server');
        }
        
        if (isMounted.current) {
          await Promise.all([
            AsyncStorage.setItem('userToken', token),
            AsyncStorage.setItem('refreshToken', refresh || ''),
            AsyncStorage.setItem('userData', JSON.stringify(user)),
            AsyncStorage.setItem('username', formData.username?.trim() || formData.name.trim())
          ]);

          // Use replace instead of navigate to prevent back navigation
          navigationTimeoutRef.current = setTimeout(() => {
            if (isMounted.current) {
              navigation.replace('SynMessage');
            }
          }, 100);
        }
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      });

      let errorMessage = 'Unable to complete registration. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (error.response?.data) {
        const backendError = error.response.data;
        if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.email) {
          errorMessage = `Email: ${backendError.email[0]}`;
        } else if (backendError.phone) {
          errorMessage = `Phone: ${backendError.phone[0]}`;
        } else if (backendError.name) {
          errorMessage = `Name: ${backendError.name[0]}`;
        } else if (backendError.username) {
          errorMessage = `Username: ${backendError.username[0]}`;
        } else if (backendError.profile_picture) {
          errorMessage = `Profile Picture: ${backendError.profile_picture[0]}`;
        }
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      if (isMounted.current) {
        Alert.alert(
          'Registration Error',
          errorMessage,
          [{ text: 'OK' }]
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [termsAccepted, loading, fadeAnim, phoneNumberID, formData.name, formData.username, formData.profilePic, emailID, navigation]);

  const handleChoosePhoto = useCallback(async () => {
    // Request permission first for Android
    const hasPermission = await requestStoragePermission();
    if (!hasPermission && Platform.OS === 'android') {
      Alert.alert(
        'Permission Required',
        'Please grant storage permission to select a profile picture.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Show options for camera or gallery
    Alert.alert(
      'Add Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: () => openCamera()
        },
        { 
          text: 'Choose from Gallery', 
          onPress: () => openGallery()
        }
      ],
      { cancelable: true }
    );
  }, []);

  const openCamera = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: true
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }
      if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open camera: ' + response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        // Ensure we have a valid URI
        if (asset.uri) {
          handleInputChange('profilePic', asset);
        } else {
          Alert.alert('Error', 'Failed to capture image');
        }
      }
    });
  }, [handleInputChange]);

  const openGallery = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false,
      selectionLimit: 1
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
        return;
      }
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image: ' + response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        // Ensure we have a valid URI
        if (asset.uri) {
          // For Android, ensure the URI is in the correct format
          const fixedAsset = {
            ...asset,
            uri: Platform.OS === 'android' && asset.uri.startsWith('content://') 
              ? asset.uri 
              : asset.uri
          };
          handleInputChange('profilePic', fixedAsset);
        } else {
          Alert.alert('Error', 'Failed to select image');
        }
      }
    });
  }, [handleInputChange]);

  const navigateToTerms = useCallback(() => {
    navigation.navigate('TermsCondition');
  }, [navigation]);

  // Memoize the confirmation view to prevent re-renders
  const renderConfirmationView = useCallback(() => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#0A56C4', '#0D64DD']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.headerTitle}>Confirm Details</Text>
            <Text style={styles.headerSubtitle}>Please verify your information before proceeding</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={styles.avatarSection}>
              <TouchableOpacity 
                onPress={handleChoosePhoto}
                style={styles.avatarContainer}
                activeOpacity={0.7}
              >
                {formData.profilePic ? (
                  <Image 
                    source={{ uri: formData.profilePic.uri }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <Icon name="person" size={36} color="#C7D2E8" />
                )}
                <View style={styles.cameraBadge}>
                  <Icon name="camera" size={16} color="#FFF" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.confirmationCard}>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Full Name</Text>
                <Text style={styles.confirmationValue}>{formData.name}</Text>
              </View>
              
              <View style={styles.confirmationDivider} />
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Username</Text>
                <Text style={styles.confirmationValue}>
                  {formData.username || 'Not provided'}
                </Text>
              </View>
            </View>

            {/* Terms of Service Agreement with Clickable Link */}
            <View style={[
              styles.termsContainer,
              termsError && styles.termsErrorBorder
            ]}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  setTermsAccepted(prev => !prev);
                  if (termsError) setTermsError(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  termsAccepted && styles.checkboxChecked
                ]}>
                  {termsAccepted && (
                    <Icon name="checkmark" size={16} color="#FFF" />
                  )}
                </View>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    By using Showa, you agree to our{' '}
                    <Text 
                      style={styles.termsLink}
                      onPress={navigateToTerms}
                    >
                      Terms & Conditions
                    </Text>
                    . Showa has zero tolerance for objectionable content and abusive users. Violations will result in account suspension or permanent ban.
                  </Text>
                </View>
              </TouchableOpacity>
              {termsError && (
                <Text style={styles.termsErrorText}>
                  You must accept the terms to continuffe
                </Text>
              )}
            </View>

            {loading && (
              <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', marginVertical: 16 }}>
                <ActivityIndicator size="small" color="#0D64DD" />
              </Animated.View>
            )}

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleEditDetails}
                style={styles.editButton}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.editButtonText}>EDIT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRegister}
                style={[
                  styles.confirmButton,
                  loading && styles.submitButtonDisabled
                ]}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'REGISTERING...' : 'PROCEED'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }, [formData, termsAccepted, termsError, loading, fadeAnim, handleEditDetails, handleRegister, navigateToTerms, handleChoosePhoto]);

  // Memoize the input form view
  const renderInputForm = useCallback(() => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#0A56C4', '#0D64DD']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.headerTitle}>Account Setup</Text>
            <Text style={styles.headerSubtitle}>Complete your profile information</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={styles.avatarSection}>
              <TouchableOpacity 
                onPress={handleChoosePhoto}
                style={[
                  styles.avatarContainer,
                  errors.profilePic && styles.errorBorder
                ]}
                activeOpacity={0.7}
              >
                {formData.profilePic ? (
                  <Image 
                    source={{ uri: formData.profilePic.uri }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <Icon name="person" size={36} color="#C7D2E8" />
                )}
                <View style={styles.cameraBadge}>
                  <Icon name="camera" size={16} color="#FFF" />
                </View>
              </TouchableOpacity>
              {errors.profilePic && (
                <Text style={styles.errorText}>{errors.profilePic}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={[
                styles.inputContainer,
                errors.name && styles.errorBorder
              ]}>
                <TextInput
                  ref={nameInputRef}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9FA5B4"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  style={styles.inputField}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => usernameInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <Icon 
                  name="person-outline" 
                  size={20} 
                  color="#9FA5B4" 
                  style={styles.inputIcon} 
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>USERNAME (Optional)</Text>
              <View style={[
                styles.inputContainer,
                errors.username && styles.errorBorder
              ]}>
                <TextInput
                  ref={usernameInputRef}
                  placeholder="Enter your username"
                  placeholderTextColor="#9FA5B4"
                  value={formData.username}
                  onChangeText={(text) => handleInputChange('username', text)}
                  style={styles.inputField}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleConfirmDetails}
                />
                <Icon 
                  name="at-outline" 
                  size={20} 
                  color="#9FA5B4" 
                  style={styles.inputIcon} 
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleConfirmDetails}
              style={[
                styles.submitButton,
                !isFormValid && styles.submitButtonDisabled
              ]}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>CONTINUE</Text>
              <Icon 
                name="arrow-forward" 
                size={20} 
                color="#FFF" 
                style={styles.buttonIcon} 
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }, [formData, errors, isFormValid, handleInputChange, handleChoosePhoto, handleConfirmDetails]);

  // Return the appropriate view based on state
  return showConfirmation ? renderConfirmationView() : renderInputForm();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContainer: {
    flexGrow: 1
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 30,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    paddingHorizontal: 20,
    paddingTop: 80,
    color: '#FFF',
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 4
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontWeight: '400',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#0D64DD',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF'
  },
  inputGroup: {
    marginBottom: 24
  },
  inputLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  inputField: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 14,
    paddingRight: 16
  },
  inputIcon: {
    marginLeft: 12
  },
  errorBorder: {
    borderColor: '#EF4444'
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    paddingLeft: 16
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D64DD',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    shadowColor: '#0D64DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
    opacity: 0.6
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  buttonIcon: {
    marginLeft: 10
  },
  // Confirmation screen styles
  confirmationCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  confirmationLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500'
  },
  confirmationValue: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600'
  },
  confirmationDivider: {
    height: 1,
    backgroundColor: '#E2E8F0'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#0D64DD'
  },
  editButtonText: {
    color: '#0D64DD',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D64DD',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#0D64DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  termsContainer: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  termsErrorBorder: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#0D64DD',
    borderColor: '#0D64DD',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  termsLink: {
    color: '#0D64DD',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 34,
  }
});

export default RegistrationScreen;


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Linking,
//   StatusBar
// } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import { API_ROUTE } from '../../api_routing/api';

// const RegistrationScreen = ({ navigation, route }) => {
//   // Extract params from navigation
//   const { phoneNumberID, emailID } = route.params || {};

//   // State declarations
//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     profilePic: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [termsError, setTermsError] = useState(false);
  
//   // Refs
//   const nameInputRef = useRef(null);
//   const usernameInputRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   // Function 1: validateForm
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = 'Full name is required';
//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (formData.username.trim() && formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Function 2: handleInputChange
//   const handleInputChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
//   };

//   // Function 3: handleConfirmDetails
//   const handleConfirmDetails = () => {
//     Keyboard.dismiss();
//     if (!validateForm()) return;
//     setShowConfirmation(true);
//     setTermsError(false);
//   };

//   // Function 4: handleEditDetails
//   const handleEditDetails = () => {
//     setShowConfirmation(false);
//     setTermsAccepted(false);
//     setTermsError(false);
//   };

//   // Function 5: handleRegister
//   const handleRegister = async () => {
//     if (!termsAccepted) {
//       setTermsError(true);
//       Alert.alert(
//         'Terms Required',
//         'Please accept the terms of service to continue.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     setLoading(true);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();

//     const payload = new FormData();
//     payload.append('phone', phoneNumberID);
//     payload.append('name', formData.name.trim());
//     payload.append('email', emailID);
//     payload.append('username', formData.username.trim());
    
//     if (formData.profilePic) {
//       payload.append('profile_picture', {
//         uri: formData.profilePic.uri,
//         name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
//         type: formData.profilePic.type || 'image/jpeg',
//       });
//     }

//     try {
//       console.log('Sending registration request...');
//       const response = await axios.post(`${API_ROUTE}/register/`, payload, {
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json'
//         },
//         timeout: 15000
//       });

//       console.log('Registration response:', {
//         status: response.status,
//         data: response.data
//       });

//       if (response.status === 200 || response.status === 201) {
//         const { token, refresh, user } = response.data;

//         if (!token) {
//           throw new Error('No token received from server');
//         }
        
//         await Promise.all([
//           AsyncStorage.setItem('userToken', token),
//           AsyncStorage.setItem('refreshToken', refresh || ''),
//           AsyncStorage.setItem('userData', JSON.stringify(user)),
//           AsyncStorage.setItem('username', formData.username.trim()),
//           AsyncStorage.setItem('phoneNumber', phoneNumberID),
//           AsyncStorage.setItem('userEmail', emailID)
//         ]);

//         navigation.replace('SynMessage');
//       } else {
//         throw new Error(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Registration error details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         code: error.code
//       });

//       let errorMessage = 'Unable to complete registration. Please try again.';
      
//       if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Request timeout. Please check your connection and try again.';
//       } else if (error.response?.data) {
//         const backendError = error.response.data;
//         if (backendError.message) {
//           errorMessage = backendError.message;
//         } else if (backendError.email) {
//           errorMessage = `Email: ${backendError.email[0]}`;
//         } else if (backendError.phone) {
//           errorMessage = `Phone: ${backendError.phone[0]}`;
//         } else if (backendError.name) {
//           errorMessage = `Name: ${backendError.name[0]}`;
//         } else if (backendError.username) {
//           errorMessage = `Username: ${backendError.username[0]}`;
//         }
//       } else if (!error.response) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }

//       Alert.alert(
//         'Registration Error',
//         errorMessage,
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setLoading(false);
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   // Function 6: handleChoosePhoto
//   const handleChoosePhoto = () => {
//     launchImageLibrary({
//       mediaType: 'photo',
//       maxWidth: 1024,
//       maxHeight: 1024,
//       quality: 0.8,
//       includeBase64: false,
//       selectionLimit: 1
//     }, (response) => {
//       if (response.didCancel) return;
//       if (response.errorCode) {
//         Alert.alert('Error', 'Failed to select image');
//         return;
//       }
//       if (response.assets?.[0]) {
//         handleInputChange('profilePic', response.assets[0]);
//       }
//     });
//   };

//   // Function 7: navigateToTerms
//   const navigateToTerms = () => {
//     navigation.navigate('TermsCondition');
//   };

//   // Confirmation Card Component
//   const ConfirmationCard = () => (
//     <View style={styles.confirmationContainer}>
//       <View style={styles.confirmationCard}>
//         <View style={styles.confirmationHeader}>
//           <Icon name="checkmark-circle" size={60} color="#0d64dd" />
//           <Text style={styles.confirmationTitle}>Confirm Your Details</Text>
//           <Text style={styles.confirmationSubtitle}>
//             Please review your information before proceeding
//           </Text>
//         </View>

//         <View style={styles.confirmationDetails}>
//           <View style={styles.confirmationRow}>
//             <Icon name="person-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Full Name</Text>
//               <Text style={styles.confirmationValue}>{formData.name}</Text>
//             </View>
//           </View>

//           <View style={styles.confirmationRow}>
//             <Icon name="at-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Username</Text>
//               <Text style={styles.confirmationValue}>@{formData.username}</Text>
//             </View>
//           </View>

//           <View style={styles.confirmationRow}>
//             <Icon name="mail-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Email</Text>
//               <Text style={styles.confirmationValue}>{emailID}</Text>
//             </View>
//           </View>

//           <View style={styles.confirmationRow}>
//             <Icon name="call-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Phone</Text>
//               <Text style={styles.confirmationValue}>{phoneNumberID}</Text>
//             </View>
//           </View>

//           {formData.profilePic && (
//             <View style={styles.confirmationRow}>
//               <Icon name="image-outline" size={20} color="#666" />
//               <View style={styles.confirmationTextContainer}>
//                 <Text style={styles.confirmationLabel}>Profile Picture</Text>
//                 <Image 
//                   source={{ uri: formData.profilePic.uri }} 
//                   style={styles.confirmationImage}
//                 />
//               </View>
//             </View>
//           )}
//         </View>

//         <View style={styles.termsContainer}>
//           <TouchableOpacity
//             style={styles.checkboxContainer}
//             onPress={() => setTermsAccepted(!termsAccepted)}
//           >
//             <View style={[
//               styles.checkbox,
//               termsAccepted && styles.checkboxChecked
//             ]}>
//               {termsAccepted && <Icon name="checkmark" size={16} color="#fff" />}
//             </View>
//             <Text style={styles.termsText}>
//               I accept the{' '}
//               <Text style={styles.termsLink} onPress={navigateToTerms}>
//                 Terms of Service
//               </Text>
//             </Text>
//           </TouchableOpacity>
//           {termsError && (
//             <Text style={styles.termsErrorText}>
//               Please accept the terms to continue
//             </Text>
//           )}
//         </View>

//         <View style={styles.confirmationButtons}>
//           <TouchableOpacity
//             style={[styles.button, styles.editButton]}
//             onPress={handleEditDetails}
//             disabled={loading}
//           >
//             <Text style={styles.editButtonText}>Edit Details</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.button, styles.confirmButton]}
//             onPress={handleRegister}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.confirmButtonText}>Complete Registration</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
//       >
//         <StatusBar barStyle="light-content" backgroundColor="#0d64dd" />
        
//         <LinearGradient
//           colors={['#0d64dd', '#0d64dd', '#0d64dd']}
//           style={styles.header}
//         >
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Create Account</Text>
//           <View style={styles.headerPlaceholder} />
//         </LinearGradient>

//         {!showConfirmation ? (
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             <View style={styles.formContainer}>
//               <Text style={styles.title}>Complete Your Profile</Text>
//               <Text style={styles.subtitle}>
//                 Tell us a bit about yourself to get started
//               </Text>

//               {/* Profile Picture Section */}
//               <TouchableOpacity
//                 style={styles.profilePicContainer}
//                 onPress={handleChoosePhoto}
//               >
//                 {formData.profilePic ? (
//                   <Image
//                     source={{ uri: formData.profilePic.uri }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <View style={styles.profilePicPlaceholder}>
//                     <Icon name="camera-outline" size={40} color="#0d64dd" />
//                     <Text style={styles.profilePicText}>Add Photo</Text>
//                   </View>
//                 )}
//                 <View style={styles.editIconBadge}>
//                   <Icon name="pencil" size={14} color="#fff" />
//                 </View>
//               </TouchableOpacity>

//               {/* Name Input */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>
//                   Full Name <Text style={styles.requiredStar}>*</Text>
//                 </Text>
//                 <View style={[
//                   styles.inputContainer,
//                   errors.name && styles.inputError
//                 ]}>
//                   <Icon name="person-outline" size={20} color="#999" style={styles.inputIcon} />
//                   <TextInput
//                     ref={nameInputRef}
//                     style={styles.input}
//                     placeholder="Enter your full name"
//                     placeholderTextColor="#999"
//                     value={formData.name}
//                     onChangeText={(text) => handleInputChange('name', text)}
//                     returnKeyType="next"
//                     onSubmitEditing={() => usernameInputRef.current?.focus()}
//                     blurOnSubmit={false}
//                   />
//                 </View>
//                 {errors.name && (
//                   <Text style={styles.errorText}>{errors.name}</Text>
//                 )}
//               </View>

//               {/* Username Input */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>
//                   Username <Text style={styles.requiredStar}>*</Text>
//                 </Text>
//                 <View style={[
//                   styles.inputContainer,
//                   errors.username && styles.inputError
//                 ]}>
//                   <Icon name="at-outline" size={20} color="#999" style={styles.inputIcon} />
//                   <TextInput
//                     ref={usernameInputRef}
//                     style={styles.input}
//                     placeholder="Choose a unique username"
//                     placeholderTextColor="#999"
//                     value={formData.username}
//                     onChangeText={(text) => handleInputChange('username', text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     returnKeyType="done"
//                     onSubmitEditing={handleConfirmDetails}
//                   />
//                 </View>
//                 {errors.username && (
//                   <Text style={styles.errorText}>{errors.username}</Text>
//                 )}
//                 <Text style={styles.helperText}>
//                   Username must be unique and can contain letters, numbers, and underscores
//                 </Text>
//               </View>

//               {/* Email Display */}
//               <View style={styles.infoCard}>
//                 <Icon name="mail-outline" size={20} color="#0d64dd" />
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Email Address</Text>
//                   <Text style={styles.infoValue}>{emailID}</Text>
//                 </View>
//               </View>

//               {/* Phone Display */}
//               <View style={styles.infoCard}>
//                 <Icon name="call-outline" size={20} color="#0d64dd" />
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Phone Number</Text>
//                   <Text style={styles.infoValue}>{phoneNumberID}</Text>
//                 </View>
//               </View>

//               {/* Continue Button */}
//               <TouchableOpacity
//                 style={styles.continueButton}
//                 onPress={handleConfirmDetails}
//                 activeOpacity={0.9}
//               >
//                 <LinearGradient
//                   colors={['#0d64dd', '#0d64dd']}
//                   style={styles.gradientButton}
//                 >
//                   <Text style={styles.continueButtonText}>Continue</Text>
//                   <Icon name="arrow-forward" size={20} color="#fff" />
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         ) : (
//           <ConfirmationCard />
//         )}

//         {/* Loading Overlay */}
//         <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
//           <View style={styles.loadingCard}>
//             <ActivityIndicator size="large" color="#0d64dd" />
//             <Text style={styles.loadingText}>Creating your account...</Text>
//             <Text style={styles.loadingSubtext}>Please wait while we set up your profile</Text>
//           </View>
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   headerPlaceholder: {
//     width: 40,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   formContainer: {
//     padding: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 32,
//     lineHeight: 22,
//   },
//   profilePicContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//     position: 'relative',
//   },
//   profilePic: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: '#0d64dd',
//   },
//   profilePicPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//     borderStyle: 'dashed',
//   },
//   profilePicText: {
//     fontSize: 12,
//     color: '#0d64dd',
//     marginTop: 8,
//   },
//   editIconBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: '35%',
//     backgroundColor: '#0d64dd',
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   requiredStar: {
//     color: '#ff4444',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     paddingHorizontal: 16,
//     minHeight: 52,
//   },
//   inputError: {
//     borderColor: '#ff4444',
//     borderWidth: 2,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
//   },
//   errorText: {
//     fontSize: 12,
//     color: '#ff4444',
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   helperText: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   infoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   infoContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 2,
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   continueButton: {
//     marginTop: 24,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   gradientButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     gap: 12,
//   },
//   continueButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   // Confirmation Screen Styles
//   confirmationContainer: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//   },
//   confirmationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 24,
//     marginTop: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   confirmationHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   confirmationTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   confirmationSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//   },
//   confirmationDetails: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   confirmationRow: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   confirmationTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   confirmationLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 2,
//   },
//   confirmationValue: {
//     fontSize: 15,
//     color: '#333',
//     fontWeight: '500',
//   },
//   confirmationImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginTop: 8,
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//   },
//   termsContainer: {
//     marginBottom: 24,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: '#0d64dd',
//   },
//   termsText: {
//     fontSize: 14,
//     color: '#666',
//     flex: 1,
//   },
//   termsLink: {
//     color: '#0d64dd',
//     fontWeight: '600',
//   },
//   termsErrorText: {
//     fontSize: 12,
//     color: '#ff4444',
//     marginTop: 8,
//     marginLeft: 36,
//   },
//   confirmationButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   editButton: {
//     backgroundColor: '#f0f0f0',
//   },
//   editButtonText: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '600',
//   },
//   confirmButton: {
//     backgroundColor: '#0d64dd',
//     elevation: 2,
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   confirmButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 32,
//     alignItems: 'center',
//     minWidth: 280,
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 20,
//     marginBottom: 8,
//   },
//   loadingSubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default RegistrationScreen;

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Linking,
//   StatusBar
// } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import { API_ROUTE } from '../../api_routing/api';

// const RegistrationScreen = ({ navigation, route }) => {
//   // Extract params from navigation
//   const { phoneNumberID, emailID } = route.params || {};

//   // State declarations
//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     profilePic: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [termsError, setTermsError] = useState(false);
  
//   // Refs
//   const nameInputRef = useRef(null);
//   const usernameInputRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const isMounted = useRef(true); // ✅ Track mount state

//   // ✅ Cleanup on unmount
//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       isMounted.current = false;
//       // ✅ Stop animations when component unmounts
//       fadeAnim.stopAnimation();
//     };
//   }, [fadeAnim]);

//   // Function 1: validateForm - ✅ Memoized
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = 'Full name is required';
//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (formData.username.trim() && formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData.name, formData.username]); // ✅ Dependencies

//   // Function 2: handleInputChange - ✅ Memoized
//   const handleInputChange = useCallback((name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: null }));
//   }, []); // No dependencies

//   // Function 3: handleConfirmDetails - ✅ Memoized
//   const handleConfirmDetails = useCallback(() => {
//     Keyboard.dismiss();
//     if (validateForm()) {
//       setShowConfirmation(true);
//       setTermsError(false);
//     }
//   }, [validateForm]); // ✅ Depends on validateForm

//   // Function 4: handleEditDetails - ✅ Memoized
//   const handleEditDetails = useCallback(() => {
//     setShowConfirmation(false);
//     setTermsAccepted(false);
//     setTermsError(false);
//   }, []);

//   // Function 5: handleRegister - ✅ Memoized
//   const handleRegister = useCallback(async () => {
//     if (!termsAccepted) {
//       setTermsError(true);
//       Alert.alert(
//         'Terms Required',
//         'Please accept the terms of service to continue.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     setLoading(true);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();

//     const payload = new FormData();
//     payload.append('phone', phoneNumberID);
//     payload.append('name', formData.name.trim());
//     payload.append('email', emailID);
//     payload.append('username', formData.username.trim());
    
//     if (formData.profilePic) {
//       payload.append('profile_picture', {
//         uri: formData.profilePic.uri,
//         name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
//         type: formData.profilePic.type || 'image/jpeg',
//       });
//     }

//     try {
//       console.log('Sending registration request...');
//       const response = await axios.post(`${API_ROUTE}/register/`, payload, {
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json'
//         },
//         timeout: 15000
//       });

//       console.log('Registration response:', {
//         status: response.status,
//         data: response.data
//       });

//       if (response.status === 200 || response.status === 201) {
//         const { token, refresh, user } = response.data;

//         if (!token) {
//           throw new Error('No token received from server');
//         }
        
//         await Promise.all([
//           AsyncStorage.setItem('userToken', token),
//           AsyncStorage.setItem('refreshToken', refresh || ''),
//           AsyncStorage.setItem('userData', JSON.stringify(user)),
//           AsyncStorage.setItem('username', formData.username.trim()),
//           AsyncStorage.setItem('phoneNumber', phoneNumberID),
//           AsyncStorage.setItem('userEmail', emailID)
//         ]);

//         if (isMounted.current) {
//           navigation.replace('SynMessage');
//         }
//       } else {
//         throw new Error(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Registration error details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         code: error.code
//       });

//       let errorMessage = 'Unable to complete registration. Please try again.';
      
//       if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Request timeout. Please check your connection and try again.';
//       } else if (error.response?.data) {
//         const backendError = error.response.data;
//         if (backendError.message) {
//           errorMessage = backendError.message;
//         } else if (backendError.email) {
//           errorMessage = `Email: ${backendError.email[0]}`;
//         } else if (backendError.phone) {
//           errorMessage = `Phone: ${backendError.phone[0]}`;
//         } else if (backendError.name) {
//           errorMessage = `Name: ${backendError.name[0]}`;
//         } else if (backendError.username) {
//           errorMessage = `Username: ${backendError.username[0]}`;
//         }
//       } else if (!error.response) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }

//       if (isMounted.current) {
//         Alert.alert(
//           'Registration Error',
//           errorMessage,
//           [{ text: 'OK' }]
//         );
//       }
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }).start();
//       }
//     }
//   }, [termsAccepted, fadeAnim, phoneNumberID, formData.name, formData.username, formData.profilePic, emailID, navigation]); // ✅ All dependencies

//   // Function 6: handleChoosePhoto - ✅ Memoized
//   const handleChoosePhoto = useCallback(() => {
//     launchImageLibrary({
//       mediaType: 'photo',
//       maxWidth: 1024,
//       maxHeight: 1024,
//       quality: 0.8,
//       includeBase64: false,
//       selectionLimit: 1
//     }, (response) => {
//       if (response.didCancel) return;
//       if (response.errorCode) {
//         Alert.alert('Error', 'Failed to select image');
//         return;
//       }
//       if (response.assets?.[0]) {
//         handleInputChange('profilePic', response.assets[0]);
//       }
//     });
//   }, [handleInputChange]); // ✅ Depends on handleInputChange

//   // Function 7: navigateToTerms - ✅ Memoized
//   const navigateToTerms = useCallback(() => {
//     navigation.navigate('TermsCondition');
//   }, [navigation]); // ✅ Depends on navigation

//   // ✅ Memoize ConfirmationCard to prevent unnecessary re-renders
//   const ConfirmationCard = useCallback(() => (
//     <View style={styles.confirmationContainer}>
//       <View style={styles.confirmationCard}>
//         <View style={styles.confirmationHeader}>
//           <Icon name="checkmark-circle" size={60} color="#0d64dd" />
//           <Text style={styles.confirmationTitle}>Confirm Your Details</Text>
//           <Text style={styles.confirmationSubtitle}>
//             Please review your information before proceeding
//           </Text>
//         </View>

//         <View style={styles.confirmationDetails}>
//           <View style={styles.confirmationRow}>
//             <Icon name="person-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Full Name</Text>
//               <Text style={styles.confirmationValue}>{formData.name}</Text>
//             </View>
//           </View>

//           <View style={styles.confirmationRow}>
//             <Icon name="at-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Username</Text>
//               <Text style={styles.confirmationValue}>@{formData.username}</Text>
//             </View>
//           </View>

//           <View style={styles.confirmationRow}>
//             <Icon name="mail-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Email</Text>
//               <Text style={styles.confirmationValue}>{emailID}</Text>
//             </View>
//           </View>

//           <View style={styles.confirmationRow}>
//             <Icon name="call-outline" size={20} color="#666" />
//             <View style={styles.confirmationTextContainer}>
//               <Text style={styles.confirmationLabel}>Phone</Text>
//               <Text style={styles.confirmationValue}>{phoneNumberID}</Text>
//             </View>
//           </View>

//           {formData.profilePic && (
//             <View style={styles.confirmationRow}>
//               <Icon name="image-outline" size={20} color="#666" />
//               <View style={styles.confirmationTextContainer}>
//                 <Text style={styles.confirmationLabel}>Profile Picture</Text>
//                 <Image 
//                   source={{ uri: formData.profilePic.uri }} 
//                   style={styles.confirmationImage}
//                 />
//               </View>
//             </View>
//           )}
//         </View>

//         <View style={styles.termsContainer}>
//           <TouchableOpacity
//             style={styles.checkboxContainer}
//             onPress={() => setTermsAccepted(prev => !prev)} // ✅ Functional update
//           >
//             <View style={[
//               styles.checkbox,
//               termsAccepted && styles.checkboxChecked
//             ]}>
//               {termsAccepted && <Icon name="checkmark" size={16} color="#fff" />}
//             </View>
//             <Text style={styles.termsText}>
//               I accept the{' '}
//               <Text style={styles.termsLink} onPress={navigateToTerms}>
//                 Terms of Service
//               </Text>
//             </Text>
//           </TouchableOpacity>
//           {termsError && (
//             <Text style={styles.termsErrorText}>
//               Please accept the terms to continue
//             </Text>
//           )}
//         </View>

//         <View style={styles.confirmationButtons}>
//           <TouchableOpacity
//             style={[styles.button, styles.editButton]}
//             onPress={handleEditDetails}
//             disabled={loading}
//           >
//             <Text style={styles.editButtonText}>Edit Details</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.button, styles.confirmButton]}
//             onPress={handleRegister}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.confirmButtonText}>Complete Registration</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   ), [formData.name, formData.username, formData.profilePic, emailID, phoneNumberID, termsAccepted, termsError, loading, navigateToTerms, handleEditDetails, handleRegister]);

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
//       >
//         <StatusBar barStyle="light-content" backgroundColor="#0d64dd" />
        
//         <LinearGradient
//           colors={['#0d64dd', '#0d64dd', '#0d64dd']}
//           style={styles.header}
//         >
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Create Account</Text>
//           <View style={styles.headerPlaceholder} />
//         </LinearGradient>

//         {!showConfirmation ? (
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             <View style={styles.formContainer}>
//               <Text style={styles.title}>Complete Your Profile</Text>
//               <Text style={styles.subtitle}>
//                 Tell us a bit about yourself to get started
//               </Text>

//               {/* Profile Picture Section */}
//               <TouchableOpacity
//                 style={styles.profilePicContainer}
//                 onPress={handleChoosePhoto}
//               >
//                 {formData.profilePic ? (
//                   <Image
//                     source={{ uri: formData.profilePic.uri }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <View style={styles.profilePicPlaceholder}>
//                     <Icon name="camera-outline" size={40} color="#0d64dd" />
//                     <Text style={styles.profilePicText}>Add Photo</Text>
//                   </View>
//                 )}
//                 <View style={styles.editIconBadge}>
//                   <Icon name="pencil" size={14} color="#fff" />
//                 </View>
//               </TouchableOpacity>

//               {/* Name Input */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>
//                   Full Name <Text style={styles.requiredStar}>*</Text>
//                 </Text>
//                 <View style={[
//                   styles.inputContainer,
//                   errors.name && styles.inputError
//                 ]}>
//                   <Icon name="person-outline" size={20} color="#999" style={styles.inputIcon} />
//                   <TextInput
//                     ref={nameInputRef}
//                     style={styles.input}
//                     placeholder="Enter your full name"
//                     placeholderTextColor="#999"
//                     value={formData.name}
//                     onChangeText={(text) => handleInputChange('name', text)}
//                     returnKeyType="next"
//                     onSubmitEditing={() => usernameInputRef.current?.focus()}
//                     blurOnSubmit={false}
//                   />
//                 </View>
//                 {errors.name && (
//                   <Text style={styles.errorText}>{errors.name}</Text>
//                 )}
//               </View>

//               {/* Username Input */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>
//                   Username <Text style={styles.requiredStar}>*</Text>
//                 </Text>
//                 <View style={[
//                   styles.inputContainer,
//                   errors.username && styles.inputError
//                 ]}>
//                   <Icon name="at-outline" size={20} color="#999" style={styles.inputIcon} />
//                   <TextInput
//                     ref={usernameInputRef}
//                     style={styles.input}
//                     placeholder="Choose a unique username"
//                     placeholderTextColor="#999"
//                     value={formData.username}
//                     onChangeText={(text) => handleInputChange('username', text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     returnKeyType="done"
//                     onSubmitEditing={handleConfirmDetails}
//                   />
//                 </View>
//                 {errors.username && (
//                   <Text style={styles.errorText}>{errors.username}</Text>
//                 )}
//                 <Text style={styles.helperText}>
//                   Username must be unique and can contain letters, numbers, and underscores
//                 </Text>
//               </View>

//               {/* Email Display */}
//               <View style={styles.infoCard}>
//                 <Icon name="mail-outline" size={20} color="#0d64dd" />
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Email Address</Text>
//                   <Text style={styles.infoValue}>{emailID}</Text>
//                 </View>
//               </View>

//               {/* Phone Display */}
//               <View style={styles.infoCard}>
//                 <Icon name="call-outline" size={20} color="#0d64dd" />
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Phone Number</Text>
//                   <Text style={styles.infoValue}>{phoneNumberID}</Text>
//                 </View>
//               </View>

//               {/* Continue Button */}
//               <TouchableOpacity
//                 style={styles.continueButton}
//                 onPress={handleConfirmDetails}
//                 activeOpacity={0.9}
//               >
//                 <LinearGradient
//                   colors={['#0d64dd', '#0d64dd']}
//                   style={styles.gradientButton}
//                 >
//                   <Text style={styles.continueButtonText}>Continue</Text>
//                   <Icon name="arrow-forward" size={20} color="#fff" />
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         ) : (
//           <ConfirmationCard />
//         )}

//         {/* Loading Overlay */}
//         <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
//           <View style={styles.loadingCard}>
//             <ActivityIndicator size="large" color="#0d64dd" />
//             <Text style={styles.loadingText}>Creating your account...</Text>
//             <Text style={styles.loadingSubtext}>Please wait while we set up your profile</Text>
//           </View>
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   headerPlaceholder: {
//     width: 40,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   formContainer: {
//     padding: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 32,
//     lineHeight: 22,
//   },
//   profilePicContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//     position: 'relative',
//   },
//   profilePic: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: '#0d64dd',
//   },
//   profilePicPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//     borderStyle: 'dashed',
//   },
//   profilePicText: {
//     fontSize: 12,
//     color: '#0d64dd',
//     marginTop: 8,
//   },
//   editIconBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: '35%',
//     backgroundColor: '#0d64dd',
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   requiredStar: {
//     color: '#ff4444',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     paddingHorizontal: 16,
//     minHeight: 52,
//   },
//   inputError: {
//     borderColor: '#ff4444',
//     borderWidth: 2,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
//   },
//   errorText: {
//     fontSize: 12,
//     color: '#ff4444',
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   helperText: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   infoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   infoContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 2,
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   continueButton: {
//     marginTop: 24,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   gradientButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     gap: 12,
//   },
//   continueButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   // Confirmation Screen Styles
//   confirmationContainer: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//   },
//   confirmationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 24,
//     marginTop: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   confirmationHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   confirmationTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   confirmationSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//   },
//   confirmationDetails: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   confirmationRow: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   confirmationTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   confirmationLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 2,
//   },
//   confirmationValue: {
//     fontSize: 15,
//     color: '#333',
//     fontWeight: '500',
//   },
//   confirmationImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginTop: 8,
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//   },
//   termsContainer: {
//     marginBottom: 24,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: '#0d64dd',
//   },
//   termsText: {
//     fontSize: 14,
//     color: '#666',
//     flex: 1,
//   },
//   termsLink: {
//     color: '#0d64dd',
//     fontWeight: '600',
//   },
//   termsErrorText: {
//     fontSize: 12,
//     color: '#ff4444',
//     marginTop: 8,
//     marginLeft: 36,
//   },
//   confirmationButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   editButton: {
//     backgroundColor: '#f0f0f0',
//   },
//   editButtonText: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '600',
//   },
//   confirmButton: {
//     backgroundColor: '#0d64dd',
//     elevation: 2,
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   confirmButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 32,
//     alignItems: 'center',
//     minWidth: 280,
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 20,
//     marginBottom: 8,
//   },
//   loadingSubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default RegistrationScreen;
