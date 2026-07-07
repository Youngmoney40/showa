


// import React, { useState, useRef, useCallback, useEffect } from 'react';
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
//   ScrollView,
//   Keyboard,
//   PermissionsAndroid
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const RegistrationScreen = ({ navigation, route }) => {
//   // Safely get params with defaults
//   const phoneNumberID = route?.params?.phoneNumberID || '';
//   const emailID = route?.params?.emailID || '';
  
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
//   const [isFormValid, setIsFormValid] = useState(false);
  
//   const nameInputRef = useRef(null);
//   const usernameInputRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const isMounted = useRef(true);
//   const navigationTimeoutRef = useRef(null);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (navigationTimeoutRef.current) {
//         clearTimeout(navigationTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Request storage permission for Android
//   const requestStoragePermission = useCallback(async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to your gallery to select profile picture',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   }, []);

//   // Validate form in real-time to prevent unnecessary updates
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     if (!formData.name?.trim()) newErrors.name = 'Full name is required';
//     // Username is optional, no validation needed
//     setErrors(prev => {
//       // Only update if errors actually changed
//       const hasChanges = JSON.stringify(prev) !== JSON.stringify(newErrors);
//       return hasChanges ? newErrors : prev;
//     });
//     const isValid = Object.keys(newErrors).length === 0;
//     setIsFormValid(isValid);
//     return isValid;
//   }, [formData.name]);

//   // Debounced validation to prevent excessive updates
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (isMounted.current) {
//         validateForm();
//       }
//     }, 300);
    
//     return () => clearTimeout(timeoutId);
//   }, [formData.name, formData.username, validateForm]);

//   const handleInputChange = useCallback((name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error for this field immediately
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: null }));
//     }
//   }, [errors]);

//   const handleConfirmDetails = useCallback(() => {
//     Keyboard.dismiss(); // Dismiss keyboard before showing confirmation
//     if (validateForm()) {
//       // Small delay to ensure keyboard is dismissed
//       setTimeout(() => {
//         if (isMounted.current) {
//           setShowConfirmation(true);
//           setTermsError(false);
//         }
//       }, 50);
//     }
//   }, [validateForm]);

//   const handleEditDetails = useCallback(() => {
//     setShowConfirmation(false);
//     setTermsAccepted(false);
//     setTermsError(false);
//   }, []);

//   const handleRegister = useCallback(async () => {
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

//     if (loading) return; // Prevent multiple submissions

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
//     payload.append('username', formData.username?.trim() || '');
    
//     if (formData.profilePic) {
//       // Fix for image picker - ensure correct format
//       const imageData = {
//         uri: formData.profilePic.uri,
//         type: formData.profilePic.type || 'image/jpeg',
//         name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
//       };
//       payload.append('profile_picture', imageData);
//     }

//     try {
//       console.log('Sending registration request...');
//       const response = await axios.post(`${API_ROUTE}/register/`, payload, {
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json'
//         },
//         timeout: 30000 // Increased timeout for image upload
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
        
//         if (isMounted.current) {
//           await Promise.all([
//             AsyncStorage.setItem('userToken', token),
//             AsyncStorage.setItem('refreshToken', refresh || ''),
//             AsyncStorage.setItem('userData', JSON.stringify(user)),
//             AsyncStorage.setItem('username', formData.username?.trim() || formData.name.trim())
//           ]);

//           // Use replace instead of navigate to prevent back navigation
//           navigationTimeoutRef.current = setTimeout(() => {
//             if (isMounted.current) {
//               navigation.replace('SynMessage');
//             }
//           }, 100);
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
//         } else if (backendError.profile_picture) {
//           errorMessage = `Profile Picture: ${backendError.profile_picture[0]}`;
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
//   }, [termsAccepted, loading, fadeAnim, phoneNumberID, formData.name, formData.username, formData.profilePic, emailID, navigation]);

//   const handleChoosePhoto = useCallback(async () => {
//     // Request permission first for Android
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission && Platform.OS === 'android') {
//       Alert.alert(
//         'Permission Required',
//         'Please grant storage permission to select a profile picture.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     // Show options for camera or gallery
//     Alert.alert(
//       'Add Profile Picture',
//       'Choose an option',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Take Photo', 
//           onPress: () => openCamera()
//         },
//         { 
//           text: 'Choose from Gallery', 
//           onPress: () => openGallery()
//         }
//       ],
//       { cancelable: true }
//     );
//   }, []);

//   const openCamera = useCallback(async () => {
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 1024,
//       maxHeight: 1024,
//       quality: 0.8,
//       includeBase64: false,
//       saveToPhotos: true
//     };

//     launchCamera(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled camera');
//         return;
//       }
//       if (response.errorCode) {
//         console.log('Camera Error: ', response.errorMessage);
//         Alert.alert('Error', 'Failed to open camera: ' + response.errorMessage);
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         const asset = response.assets[0];
//         // Ensure we have a valid URI
//         if (asset.uri) {
//           handleInputChange('profilePic', asset);
//         } else {
//           Alert.alert('Error', 'Failed to capture image');
//         }
//       }
//     });
//   }, [handleInputChange]);

//   const openGallery = useCallback(async () => {
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 1024,
//       maxHeight: 1024,
//       quality: 0.8,
//       includeBase64: false,
//       selectionLimit: 1
//     };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled gallery');
//         return;
//       }
//       if (response.errorCode) {
//         console.log('ImagePicker Error: ', response.errorMessage);
//         Alert.alert('Error', 'Failed to select image: ' + response.errorMessage);
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         const asset = response.assets[0];
//         // Ensure we have a valid URI
//         if (asset.uri) {
//           // For Android, ensure the URI is in the correct format
//           const fixedAsset = {
//             ...asset,
//             uri: Platform.OS === 'android' && asset.uri.startsWith('content://') 
//               ? asset.uri 
//               : asset.uri
//           };
//           handleInputChange('profilePic', fixedAsset);
//         } else {
//           Alert.alert('Error', 'Failed to select image');
//         }
//       }
//     });
//   }, [handleInputChange]);

//   const navigateToTerms = useCallback(() => {
//     navigation.navigate('TermsCondition');
//   }, [navigation]);

//   // Memoize the confirmation view to prevent re-renders
//   const renderConfirmationView = useCallback(() => {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
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
//               <TouchableOpacity 
//                 onPress={handleChoosePhoto}
//                 style={styles.avatarContainer}
//                 activeOpacity={0.7}
//               >
//                 {formData.profilePic ? (
//                   <Image 
//                     source={{ uri: formData.profilePic.uri }} 
//                     style={styles.avatarImage} 
//                   />
//                 ) : (
//                   <Icon name="person" size={36} color="#C7D2E8" />
//                 )}
//                 <View style={styles.cameraBadge}>
//                   <Icon name="camera" size={16} color="#FFF" />
//                 </View>
//               </TouchableOpacity>
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
//                   setTermsAccepted(prev => !prev);
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
//                   You must accept the terms to continuffe
//                 </Text>
//               )}
//             </View>

//             {loading && (
//               <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', marginVertical: 16 }}>
//                 <ActivityIndicator size="small" color="#0D64DD" />
//               </Animated.View>
//             )}

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
//   }, [formData, termsAccepted, termsError, loading, fadeAnim, handleEditDetails, handleRegister, navigateToTerms, handleChoosePhoto]);

//   // Memoize the input form view
//   const renderInputForm = useCallback(() => {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <LinearGradient
//             colors={['#0A56C4', '#0D64DD']}
//             style={styles.header}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Text style={styles.headerTitle}>Account Setup</Text>
//             <Text style={styles.headerSubtitle}>Complete your profile information</Text>
//           </LinearGradient>

//           <View style={styles.formContainer}>
//             <View style={styles.avatarSection}>
//               <TouchableOpacity 
//                 onPress={handleChoosePhoto}
//                 style={[
//                   styles.avatarContainer,
//                   errors.profilePic && styles.errorBorder
//                 ]}
//                 activeOpacity={0.7}
//               >
//                 {formData.profilePic ? (
//                   <Image 
//                     source={{ uri: formData.profilePic.uri }} 
//                     style={styles.avatarImage} 
//                   />
//                 ) : (
//                   <Icon name="person" size={36} color="#C7D2E8" />
//                 )}
//                 <View style={styles.cameraBadge}>
//                   <Icon name="camera" size={16} color="#FFF" />
//                 </View>
//               </TouchableOpacity>
//               {errors.profilePic && (
//                 <Text style={styles.errorText}>{errors.profilePic}</Text>
//               )}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>FULL NAME</Text>
//               <View style={[
//                 styles.inputContainer,
//                 errors.name && styles.errorBorder
//               ]}>
//                 <TextInput
//                   ref={nameInputRef}
//                   placeholder="Enter your full name"
//                   placeholderTextColor="#9FA5B4"
//                   value={formData.name}
//                   onChangeText={(text) => handleInputChange('name', text)}
//                   style={styles.inputField}
//                   autoCapitalize="words"
//                   autoCorrect={false}
//                   returnKeyType="next"
//                   onSubmitEditing={() => usernameInputRef.current?.focus()}
//                   blurOnSubmit={false}
//                 />
//                 <Icon 
//                   name="person-outline" 
//                   size={20} 
//                   color="#9FA5B4" 
//                   style={styles.inputIcon} 
//                 />
//               </View>
//               {errors.name && (
//                 <Text style={styles.errorText}>{errors.name}</Text>
//               )}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>USERNAME (Optional)</Text>
//               <View style={[
//                 styles.inputContainer,
//                 errors.username && styles.errorBorder
//               ]}>
//                 <TextInput
//                   ref={usernameInputRef}
//                   placeholder="Enter your username"
//                   placeholderTextColor="#9FA5B4"
//                   value={formData.username}
//                   onChangeText={(text) => handleInputChange('username', text)}
//                   style={styles.inputField}
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   returnKeyType="done"
//                   onSubmitEditing={handleConfirmDetails}
//                 />
//                 <Icon 
//                   name="at-outline" 
//                   size={20} 
//                   color="#9FA5B4" 
//                   style={styles.inputIcon} 
//                 />
//               </View>
//               {errors.username && (
//                 <Text style={styles.errorText}>{errors.username}</Text>
//               )}
//             </View>

//             <TouchableOpacity
//               onPress={handleConfirmDetails}
//               style={[
//                 styles.submitButton,
//                 !isFormValid && styles.submitButtonDisabled
//               ]}
//               disabled={!isFormValid}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.submitButtonText}>CONTINUE</Text>
//               <Icon 
//                 name="arrow-forward" 
//                 size={20} 
//                 color="#FFF" 
//                 style={styles.buttonIcon} 
//               />
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     );
//   }, [formData, errors, isFormValid, handleInputChange, handleChoosePhoto, handleConfirmDetails]);

//   // Return the appropriate view based on state
//   return showConfirmation ? renderConfirmationView() : renderInputForm();
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
//     opacity: 0.6
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
  PermissionsAndroid,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';

// ─── Constants ──────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#0D64DD',
  primaryDark: '#0A56C4',
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  background: '#F8FAFC',
};

// ─── Network Status Modal ───────────────────────────────────────────────────
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

// ─── FCM Service ─────────────────────────────────────────────────────────────
class FCMService {
  static async getToken() {
    try {
      const token = await messaging().getToken();
      console.log('📱 FCM Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Failed to get FCM token:', error);
      return null;
    }
  }

  static async registerDevice(userId, userToken, retryCount = 0) {
    const maxRetries = 3;
    const baseDelay = 2000;

    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        throw new Error('No internet connection');
      }

      const fcmToken = await this.getToken();
      if (!fcmToken) {
        console.warn('⚠️ No FCM token available');
        return { success: false, error: 'No FCM token' };
      }

      console.log(`📱 Registering device (attempt ${retryCount + 1})`);

      const response = await axios.post(
        `${API_ROUTE}/register-device/`,
        {
          device_token: fcmToken,
          device_type: Platform.OS,
          device_name: await this.getDeviceName(),
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log('✅ Device registered successfully');
        return { success: true };
      }

      return { success: false, error: `Server error: ${response.status}` };

    } catch (error) {
      console.error('❌ FCM registration failed:', error);

      const isRetryable = this.isRetryableError(error);
      
      if (isRetryable && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.registerDevice(userId, userToken, retryCount + 1);
      }

      return {
        success: false,
        error: error.message || 'Device registration failed',
        retryable: isRetryable,
      };
    }
  }

  static isRetryableError(error) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return true;
    if (error.response?.status >= 500 && error.response?.status < 600) return true;
    if (error.response?.status === 429) return true;
    if (error.message?.includes('network')) return true;
    return false;
  }

  static async getDeviceName() {
    try {
      const deviceInfo = await import('react-native-device-info');
      return `${deviceInfo.getBrand()} ${deviceInfo.getModel()}`;
    } catch {
      return Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
    }
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────
const RegistrationScreen = ({ navigation, route }) => {
  // ── Params ────────────────────────────────────────────────────────────────
  const phoneNumberID = route?.params?.phoneNumberID || '';
  const emailID = route?.params?.emailID || '';
  
  // ── State ──────────────────────────────────────────────────────────────────
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
  const [networkModalVisible, setNetworkModalVisible] = useState(false);
  const [networkMessage, setNetworkMessage] = useState('');
  const [networkLoading, setNetworkLoading] = useState(false);
  
  // ── Refs ──────────────────────────────────────────────────────────────────
  const nameInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);
  const navigationTimeoutRef = useRef(null);

  // ── Network Listener ──────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('📶 Network state:', state.isConnected);
      if (state.isConnected && networkModalVisible) {
        setNetworkModalVisible(false);
      }
    });

    return () => {
      unsubscribe();
      isMounted.current = false;
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [networkModalVisible]);

  // ── Network Error Helpers ────────────────────────────────────────────────
  const showNetworkError = useCallback((message, retryFn) => {
    setNetworkMessage(message);
    setNetworkModalVisible(true);
  }, []);

  const hideNetworkModal = useCallback(() => {
    setNetworkModalVisible(false);
    setNetworkLoading(false);
  }, []);

  const retryRegistration = useCallback(() => {
    setNetworkLoading(true);
    handleRegister();
  }, []);

  // ── Permission Requests ──────────────────────────────────────────────────
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
        console.warn('Storage permission error:', err);
        return false;
      }
    }
    return true;
  }, []);

  // ── Form Validation ──────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    setErrors(prev => {
      const hasChanges = JSON.stringify(prev) !== JSON.stringify(newErrors);
      return hasChanges ? newErrors : prev;
    });
    
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  }, [formData.name]);

  // ── Debounced Validation ─────────────────────────────────────────────────
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        validateForm();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.name, formData.username, validateForm]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleConfirmDetails = useCallback(() => {
    Keyboard.dismiss();
    if (validateForm()) {
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

  // ── Registration Handler with Network Error Handling ────────────────────
  const handleRegister = useCallback(async () => {
    // ── 1. Check Terms ──────────────────────────────────────────────────
    if (!termsAccepted) {
      setTermsError(true);
      Alert.alert(
        'Terms Required',
        'Please accept the terms of service to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (loading) return;
    setLoading(true);
    setNetworkLoading(true);

    // ── 2. Check Network ──────────────────────────────────────────────
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      setLoading(false);
      setNetworkLoading(false);
      showNetworkError(
        'No internet connection. Please check your network and try again.',
        handleRegister
      );
      return;
    }

    // ── 3. Prepare Payload ────────────────────────────────────────────
    const payload = new FormData();
    payload.append('phone', phoneNumberID);
    payload.append('name', formData.name.trim());
    payload.append('email', emailID);
    payload.append('username', formData.username?.trim() || '');
    
    if (formData.profilePic) {
      const imageData = {
        uri: formData.profilePic.uri,
        type: formData.profilePic.type || 'image/jpeg',
        name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
      };
      payload.append('profile_picture', imageData);
    }

    // ── 4. Animate ─────────────────────────────────────────────────────
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      console.log('📤 Sending registration request...');
      
      const response = await axios.post(`${API_ROUTE}/register/`, payload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000,
      });

      console.log('📥 Registration response:', response.status);

      if (response.status === 200 || response.status === 201) {
        const { token, refresh, user } = response.data;

        if (!token) {
          throw new Error('No token received from server');
        }

        if (isMounted.current) {
          // ── 5. Store Auth Data Securely ────────────────────────────
          await EncryptedStorage.setItem('userToken', token);
          await EncryptedStorage.setItem('refreshToken', refresh || '');
          await EncryptedStorage.setItem('userData', JSON.stringify(user));
          
          await AsyncStorage.multiSet([
            ['userToken', token],
            ['refreshToken', refresh || ''],
            ['userData', JSON.stringify(user)],
            ['username', formData.username?.trim() || formData.name.trim()],
            ['userId', user.id.toString()],
          ]);

          // ── 6. Register FCM Device (Non-blocking) ──────────────────
          const registerDevice = async () => {
            try {
              const result = await FCMService.registerDevice(user.id, token);
              if (result.success) {
                console.log('✅ Device registered for notifications');
              } else {
                console.warn('⚠️ Device registration failed:', result.error);
                // Retry in background after 30 seconds if retryable
                if (result.retryable) {
                  setTimeout(() => {
                    FCMService.registerDevice(user.id, token);
                  }, 30000);
                }
              }
            } catch (fcmError) {
              console.error('❌ FCM error (non-blocking):', fcmError);
            }
          };
          registerDevice(); // Fire and forget

          // ── 7. Navigate ─────────────────────────────────────────────
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
      console.error('❌ Registration error:', error);

      // ── 8. Handle Network Errors ──────────────────────────────────
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        setLoading(false);
        setNetworkLoading(false);
        showNetworkError(
          'Connection timeout. Please check your network and try again.',
          handleRegister
        );
        return;
      }

      if (!error.response) {
        setLoading(false);
        setNetworkLoading(false);
        showNetworkError(
          'Cannot connect to server. Please check your internet connection.',
          handleRegister
        );
        return;
      }

      // ── 9. Handle Server Errors ──────────────────────────────────
      if (error.response.status >= 500 && error.response.status < 600) {
        setLoading(false);
        setNetworkLoading(false);
        showNetworkError(
          'Server is currently experiencing issues. Please try again later.',
          handleRegister
        );
        return;
      }

      // ── 10. Handle Client Errors ──────────────────────────────────
      let errorMessage = 'Unable to complete registration. Please try again.';
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

      if (error.response.status === 409) {
        errorMessage = 'Account already exists. Please try logging in instead.';
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
        setNetworkLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [
    termsAccepted,
    loading,
    fadeAnim,
    phoneNumberID,
    formData.name,
    formData.username,
    formData.profilePic,
    emailID,
    navigation,
    showNetworkError
  ]);

  // ── Image Picker ──────────────────────────────────────────────────────────
  const handleChoosePhoto = useCallback(async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission && Platform.OS === 'android') {
      Alert.alert(
        'Permission Required',
        'Please grant storage permission to select a profile picture.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Add Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Choose from Gallery', onPress: openGallery }
      ],
      { cancelable: true }
    );
  }, [requestStoragePermission]);

  const openCamera = useCallback(() => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: true
    };

    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to open camera: ' + response.errorMessage);
        return;
      }
      if (response.assets?.[0]?.uri) {
        handleInputChange('profilePic', response.assets[0]);
      }
    });
  }, [handleInputChange]);

  const openGallery = useCallback(() => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false,
      selectionLimit: 1
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to select image: ' + response.errorMessage);
        return;
      }
      if (response.assets?.[0]?.uri) {
        handleInputChange('profilePic', response.assets[0]);
      }
    });
  }, [handleInputChange]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigateToTerms = useCallback(() => {
    navigation.navigate('TermsCondition');
  }, [navigation]);

  // ─── Render Confirmation View ────────────────────────────────────────────
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
            colors={[COLORS.primaryDark, COLORS.primary]}
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

            {/* Terms of Service */}
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
                  You must accept the terms to continue
                </Text>
              )}
            </View>

            {loading && (
              <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', marginVertical: 16 }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
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

        {/* Network Modal */}
        <NetworkStatusModal
          visible={networkModalVisible}
          message={networkMessage}
          onRetry={retryRegistration}
          onCancel={hideNetworkModal}
          loading={networkLoading}
        />
      </KeyboardAvoidingView>
    );
  }, [
    formData,
    termsAccepted,
    termsError,
    loading,
    networkModalVisible,
    networkMessage,
    networkLoading,
    fadeAnim,
    handleChoosePhoto,
    navigateToTerms,
    handleEditDetails,
    handleRegister,
    retryRegistration,
    hideNetworkModal,
  ]);

  // ─── Render Input Form ────────────────────────────────────────────────────
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
            colors={[COLORS.primaryDark, COLORS.primary]}
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

  // ─── Return ────────────────────────────────────────────────────────────────
  return showConfirmation ? renderConfirmationView() : renderInputForm();
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContainer: {
    flexGrow: 1
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 30,
    paddingHorizontal: 0,
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
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.primary,
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
    color: COLORS.textSecondary,
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
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
    paddingVertical: 14,
    paddingRight: 16
  },
  inputIcon: {
    marginLeft: 12
  },
  errorBorder: {
    borderColor: COLORS.error
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    paddingLeft: 16
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    shadowColor: COLORS.primary,
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
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500'
  },
  confirmationValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600'
  },
  confirmationDivider: {
    height: 1,
    backgroundColor: COLORS.border
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
    borderColor: COLORS.primary
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: COLORS.primary,
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
    borderColor: COLORS.border,
  },
  termsErrorBorder: {
    borderColor: COLORS.error,
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
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsErrorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 34,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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

export default RegistrationScreen;
