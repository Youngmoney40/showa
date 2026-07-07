

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   ScrollView,
//   StatusBar,
//   Image,
//   PermissionsAndroid,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const COLORS = {
//   primary: '#0d64dd',
//   white: '#ffffff',
//   textPrimary: '#1a1a1a',
//   textSecondary: '#6c757d',
//   border: '#e1e5eb',
//   error: '#dc3545',
//   success: '#28a745',
//   verifiedBg: '#e8f5e9',
//   verifiedBorder: '#4caf50',
// };

// export default function EmailRegisterScreen({ route, navigation }) {
//   // Get verified contact info from route params
//   const verifiedEmail = route.params?.verifiedEmail || '';
//   const verifiedPhone = route.params?.verifiedPhone || '';
//   const contactType = route.params?.contactType || 'email';
//   const isVerified = route.params?.isVerified || false;

//   const [formData, setFormData] = useState({
//     email: verifiedEmail,
//     password: '',
//     confirmPassword: '',
//     name: '',
//     phone: verifiedPhone,
//     username: '',
//     profilePic: null,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [termsError, setTermsError] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);

//   const inputs = {
//     name: useRef(null),
//     email: useRef(null),
//     phone: useRef(null),
//     username: useRef(null),
//     password: useRef(null),
//     confirmPassword: useRef(null),
//   };

//   useEffect(() => {
//     setTimeout(() => inputs.name.current?.focus(), 300);
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

//   // Generate random username from name + random numbers
//   const generateUsername = (name) => {
//     if (!name.trim()) return '';
//     const base = name.trim().toLowerCase().replace(/\s+/g, '');
//     const randomNum = Math.floor(Math.random() * 10000);
//     return `${base}${randomNum}`;
//   };

//   // Auto-generate username when name changes
//   useEffect(() => {
//     if (formData.name && !formData.username) {
//       const suggestedUsername = generateUsername(formData.name);
//       setFormData(prev => ({ ...prev, username: suggestedUsername }));
//     }
//   }, [formData.name]);

//   // Validate form in real-time
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[0-9]{10,15}$/;
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'First name and Surname is required';
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
//       newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
//     }
    
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
//       newErrors.username = 'Username can only contain letters, numbers, underscores and dots';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     setErrors(newErrors);
//     const isValid = Object.keys(newErrors).length === 0;
//     setIsFormValid(isValid);
//     return isValid;
//   }, [formData]);

//   // Debounced validation
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       validateForm();
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [formData.name, formData.email, formData.phone, formData.username, formData.password, formData.confirmPassword, validateForm]);

//   const handleInputChange = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   }, [errors]);

//   const handleChoosePhoto = useCallback(async () => {
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission && Platform.OS === 'android') {
//       Alert.alert(
//         'Permission Required',
//         'Please grant storage permission to select a profile picture.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     Alert.alert(
//       'Add Profile Picture',
//       'Choose an option',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Take Photo', onPress: () => openCamera() },
//         { text: 'Choose from Gallery', onPress: () => openGallery() }
//       ],
//       { cancelable: true }
//     );
//   }, []);

//   const openCamera = useCallback(() => {
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 1024,
//       maxHeight: 1024,
//       quality: 0.8,
//       includeBase64: false,
//       saveToPhotos: true
//     };

//     launchCamera(options, (response) => {
//       if (response.didCancel) return;
//       if (response.errorCode) {
//         Alert.alert('Error', 'Failed to open camera: ' + response.errorMessage);
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         const asset = response.assets[0];
//         if (asset.uri) {
//           handleInputChange('profilePic', asset);
//         }
//       }
//     });
//   }, [handleInputChange]);

//   const openGallery = useCallback(() => {
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 1024,
//       maxHeight: 1024,
//       quality: 0.8,
//       includeBase64: false,
//       selectionLimit: 1
//     };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) return;
//       if (response.errorCode) {
//         Alert.alert('Error', 'Failed to select image: ' + response.errorMessage);
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         const asset = response.assets[0];
//         if (asset.uri) {
//           handleInputChange('profilePic', asset);
//         }
//       }
//     });
//   }, [handleInputChange]);

//   const handleConfirmDetails = useCallback(() => {
//     if (validateForm()) {
//       setShowConfirmation(true);
//       setTermsError(false);
//     }
//   }, [validateForm]);

//   const handleEditDetails = useCallback(() => {
//     setShowConfirmation(false);
//     setTermsAccepted(false);
//     setTermsError(false);
//   }, []);

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

//     if (loading) return;

//     setLoading(true);

//     const payload = new FormData();
//     payload.append('email', formData.email.trim().toLowerCase());
//     payload.append('password', formData.password);
//     payload.append('name', formData.name.trim());
//     payload.append('phone', formData.phone.replace(/[^0-9]/g, ''));
//     payload.append('username', formData.username.trim().toLowerCase());

//     if (formData.profilePic) {
//       const imageData = {
//         uri: formData.profilePic.uri,
//         type: formData.profilePic.type || 'image/jpeg',
//         name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
//       };
//       payload.append('profile_picture', imageData);
//     }

//     try {
//       const response = await axios.post(`${API_ROUTE}/email-register/`, payload, {
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json'
//         },
//         timeout: 30000
//       });

//       if (response.status === 201 && response.data.success) {
//         const { token, refresh, user, reward } = response.data;

//         await AsyncStorage.multiSet([
//           ['userToken', token],
//           ['refreshToken', refresh],
//           ['userData', JSON.stringify(user)],
//           ['isVerified', 'true'],
//           ['userEmail', user.email],
//           ['userId', user.id.toString()],
//           ['loginMethod', 'email'],
//         ]);

//         if (reward) {
//           Alert.alert(
//             'Welcome Your account has been successfull Register and ',
//             `You've received ${reward.coins} bonus coins!`,
//             [{ text: 'Continue', onPress: () => navigation.replace('SynMessage') }]
//           );
//         } else {
//           navigation.replace('SynMessage');
//         }
//       }
//     } catch (error) {
//       console.error('Registration error:', error);

//       let errorMessage = 'Unable to register. Please try again.';

//       if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.response?.data?.errors) {
//         const errorsList = error.response.data.errors;
//         const firstError = Object.values(errorsList)[0];
//         errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
//       } else if (error.response?.data?.email) {
//         errorMessage = error.response.data.email[0];
//       } else if (error.response?.data?.phone) {
//         errorMessage = error.response.data.phone[0];
//       } else if (error.response?.data?.username) {
//         errorMessage = error.response.data.username[0];
//       }

//       Alert.alert('Registration Failed', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToTerms = () => {
//     navigation.navigate('TermsCondition');
//   };

//   const isFieldReadonly = (fieldName) => {
//     if (!isVerified) return false;
//     if (fieldName === 'email' && verifiedEmail && contactType === 'email') return true;
//     if (fieldName === 'phone' && verifiedPhone && contactType === 'phone') return true;
//     return false;
//   };

//   // Input Form View
//   if (!showConfirmation) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
        
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.keyboardView}
//         >
//           <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//               <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
//             </TouchableOpacity>

//             <View style={styles.header}>
//               {/* <LinearGradient
//                 colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
//                 style={styles.iconContainer}
//               >
//                 <Icon name="person-add" size={42} color={COLORS.primary} />
//               </LinearGradient> */}
//                <View style={styles.logoWrapper}>
//                                       <LinearGradient
//                                         colors={['#0066FF', '#0052CC']}
//                                         style={styles.logoGradient}
//                                       >
//                                         <Image
//                                           source={require('../../assets/images/showaAppLogo.png')} 
//                                           style={styles.logoImage}
//                                           resizeMode="contain"
//                                         />
//                                       </LinearGradient>
//                                     </View>
//               <Text style={styles.title}>Get Started on Showa</Text>
//               <Text style={styles.subtitle}>Create an account to connect with friends and communities of people who share your interests.</Text>
//             </View>

//             <View style={styles.formContainer}>

//               {/* Full Name */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Name *   ( First name and Surname )</Text>
//                 <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
//                   <Icon name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                   <TextInput
//                     ref={inputs.name}
//                     placeholder="Enter your first name and surname"
//                     style={styles.input}
//                     value={formData.name}
//                     onChangeText={(text) => handleInputChange('name', text)}
//                     returnKeyType="next"
//                     onSubmitEditing={() => inputs.username.current?.focus()}
//                     editable={!loading}
//                   />
//                 </View>
//                 {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//               </View>

//               {/* Username */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Username *</Text>
//                 <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
//                   <Icon name="at-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                   <TextInput
//                     ref={inputs.username}
//                     placeholder="Choose a username"
//                     style={styles.input}
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     value={formData.username}
//                     onChangeText={(text) => handleInputChange('username', text)}
//                     returnKeyType="next"
//                     onSubmitEditing={() => inputs.email.current?.focus()}
//                     editable={!loading}
//                   />
//                 </View>
//                 {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
//               </View>

//               {/* Email */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Email Address *</Text>
//                 <View style={[
//                   styles.inputWrapper, 
//                   errors.email && styles.inputError,
//                   isFieldReadonly('email') && styles.verifiedInput
//                 ]}>
//                   <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                   <TextInput
//                     ref={inputs.email}
//                     placeholder="Enter your email"
//                     style={styles.input}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     value={formData.email}
//                     onChangeText={(text) => handleInputChange('email', text)}
//                     returnKeyType="next"
//                     onSubmitEditing={() => inputs.phone.current?.focus()}
//                     editable={!loading && !isFieldReadonly('email')}
//                   />
//                 </View>
//                 {isFieldReadonly('email') && (
//                   <Text style={styles.verifiedText}>✓ Email verified</Text>
//                 )}
//                 {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//               </View>

//               {/* Phone */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Phone Number *</Text>
//                 <View style={[
//                   styles.inputWrapper, 
//                   errors.phone && styles.inputError,
//                   isFieldReadonly('phone') && styles.verifiedInput
//                 ]}>
//                   <Icon name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                   <TextInput
//                     ref={inputs.phone}
//                     placeholder="Enter your phone number"
//                     style={styles.input}
//                     keyboardType="phone-pad"
//                     value={formData.phone}
//                     onChangeText={(text) => handleInputChange('phone', text)}
//                     returnKeyType="next"
//                     onSubmitEditing={() => inputs.password.current?.focus()}
//                     editable={!loading && !isFieldReadonly('phone')}
//                   />
//                 </View>
//                 {isFieldReadonly('phone') && (
//                   <Text style={styles.verifiedText}> Phone number verified</Text>
//                 )}
//                 {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
//               </View>

//               {/* Password */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Password *</Text>
//                 <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
//                   <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                   <TextInput
//                     ref={inputs.password}
//                     placeholder="Create a password (min 6 characters)"
//                     style={styles.input}
//                     secureTextEntry={!showPassword}
//                     value={formData.password}
//                     onChangeText={(text) => handleInputChange('password', text)}
//                     returnKeyType="next"
//                     onSubmitEditing={() => inputs.confirmPassword.current?.focus()}
//                     editable={!loading}
//                   />
//                   <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
//                     <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
//                   </TouchableOpacity>
//                 </View>
//                 {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//               </View>

//               {/* Confirm Password */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Confirm Password *</Text>
//                 <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
//                   <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                   <TextInput
//                     ref={inputs.confirmPassword}
//                     placeholder="Confirm your password"
//                     style={styles.input}
//                     secureTextEntry={!showConfirmPassword}
//                     value={formData.confirmPassword}
//                     onChangeText={(text) => handleInputChange('confirmPassword', text)}
//                     returnKeyType="done"
//                     onSubmitEditing={handleConfirmDetails}
//                     editable={!loading}
//                   />
//                   <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
//                     <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
//                   </TouchableOpacity>
//                 </View>
//                 {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
//               </View>

//               {/* Continue Button */}
//               <TouchableOpacity
//                 onPress={handleConfirmDetails}
//                 style={[styles.registerButton, (!isFormValid || loading) && styles.buttonDisabled]}
//                 disabled={!isFormValid || loading}
//                 activeOpacity={0.8}
//               >
//                 <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
//                   {loading ? (
//                     <ActivityIndicator size="small" color={COLORS.white} />
//                   ) : (
//                     <>
//                       <Text style={styles.buttonText}>Continue</Text>
//                       <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
//                     </>
//                   )}
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     );
//   }

//   // Confirmation View
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
//           <TouchableOpacity onPress={handleEditDetails} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
//           </TouchableOpacity>

//           <View style={styles.header}>
//             <LinearGradient
//               colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
//               style={styles.iconContainer}
//             >
//               <Icon name="checkmark-circle" size={42} color={COLORS.primary} />
//             </LinearGradient>
//             <Text style={styles.title}>Confirm Details</Text>
//             <Text style={styles.subtitle}>Please verify your information</Text>
//           </View>

//           <View style={styles.formContainer}>
//             {/* Profile Picture Preview */}
            

//             <View style={styles.confirmationCard}>
//               <View style={styles.confirmationRow}>
//                 <Text style={styles.confirmationLabel}>Name</Text>
//                 <Text style={styles.confirmationValue}>{formData.name}</Text>
//               </View>
              
//               <View style={styles.confirmationDivider} />
              
//               <View style={styles.confirmationRow}>
//                 <Text style={styles.confirmationLabel}>Username</Text>
//                 <Text style={styles.confirmationValue}>@{formData.username}</Text>
//               </View>
              
//               <View style={styles.confirmationDivider} />
              
//               <View style={styles.confirmationRow}>
//                 <Text style={styles.confirmationLabel}>Email</Text>
//                 <Text style={styles.confirmationValue}>{formData.email}</Text>
//               </View>
              
//               <View style={styles.confirmationDivider} />
              
//               <View style={styles.confirmationRow}>
//                 <Text style={styles.confirmationLabel}>Phone</Text>
//                 <Text style={styles.confirmationValue}>{formData.phone}</Text>
//               </View>
//             </View>

//             {/* Terms of Service */}
//             <View style={[styles.termsContainer, termsError && styles.termsErrorBorder]}>
//               <TouchableOpacity
//                 style={styles.checkboxContainer}
//                 onPress={() => {
//                   setTermsAccepted(prev => !prev);
//                   if (termsError) setTermsError(false);
//                 }}
//                 activeOpacity={0.7}
//               >
//                 <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
//                   {termsAccepted && <Icon name="checkmark" size={14} color="#FFF" />}
//                 </View>
//                 <View style={styles.termsTextContainer}>
//                   <Text style={styles.termsText}>
//                     I agree to the{' '}
//                     <Text style={styles.termsLink} onPress={navigateToTerms}>
//                       Terms & Conditions
//                     </Text>
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//               {termsError && (
//                 <Text style={styles.termsErrorText}>You must accept the terms to continue</Text>
//               )}
//             </View>

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
//                 style={[styles.confirmButton, loading && styles.buttonDisabled]}
//                 disabled={loading}
//                 activeOpacity={0.8}
//               >
//                 <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
//                   {loading ? (
//                     <ActivityIndicator size="small" color={COLORS.white} />
//                   ) : (
//                     <Text style={styles.confirmButtonText}>SIGN UP</Text>
//                   )}
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
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
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     marginTop: 16,
//   },
//   header: {
//     alignItems: 'center',
//     marginTop: 24,
//     marginBottom: 32,
//   },
//   iconContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//   },
//   formContainer: {
//     marginBottom: 24,
//   },
//   avatarSection: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
  
//   logoImage: {
//     width: 60,
//     height: 60,
//     tintColor: '#fff',
//   },
  
    
//     logoWrapper: {
//       marginTop:-20,
//       marginBottom: 20,
//       shadowColor: '#0066FF',
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.2,
//       shadowRadius: 12,
//       elevation: 8,
//     },
//     logoGradient: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//   avatarContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#F0F4FE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#E2E8F0',
//     overflow: 'hidden',
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//   },
//   cameraBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: COLORS.primary,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.white,
//   },
//   avatarHint: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     marginTop: 8,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginBottom: 8,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 16,
//     height: 56,
//   },
//   verifiedInput: {
//     backgroundColor: COLORS.verifiedBg,
//     borderColor: COLORS.verifiedBorder,
//   },
//   inputError: {
//     borderColor: COLORS.error,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.textPrimary,
//     paddingVertical: 0,
//   },
//   eyeButton: {
//     padding: 8,
//   },
//   errorText: {
//     color: COLORS.error,
//     fontSize: 12,
//     marginTop: 6,
//     paddingLeft: 4,
//   },
//   verifiedText: {
//     color: COLORS.success,
//     fontSize: 12,
//     marginTop: 6,
//     paddingLeft: 4,
//   },
//   registerButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: 8,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
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
//   },
//   buttonIcon: {
//     marginLeft: 8,
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
//     elevation: 4,
//   },
//   confirmationRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   confirmationLabel: {
//     color: '#64748B',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   confirmationValue: {
//     color: '#1E293B',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   confirmationDivider: {
//     height: 1,
//     backgroundColor: '#E2E8F0',
//   },
//   buttonGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   editButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     paddingVertical: 16,
//     borderWidth: 1.5,
//     borderColor: COLORS.primary,
//   },
//   editButtonText: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   confirmButton: {
//     flex: 2,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   confirmButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '700',
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
//     borderColor: COLORS.error,
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
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   termsTextContainer: {
//     flex: 1,
//   },
//   termsText: {
//     color: '#334155',
//     fontSize: 13,
//     lineHeight: 18,
//   },
//   termsLink: {
//     color: COLORS.primary,
//     fontWeight: '600',
//   },
//   termsErrorText: {
//     color: COLORS.error,
//     fontSize: 12,
//     marginTop: 8,
//     marginLeft: 34,
//   },
// });

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Image,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';

const COLORS = {
  primary: '#0d64dd',
  primaryDark: '#0a50b0',
  primaryLight: '#4a90e2',
  white: '#ffffff',
  background: '#f5f6fa',
  textPrimary: '#1a1a1a',
  textSecondary: '#6c757d',
  textLight: '#8e8e93',
  border: '#e8ecf1',
  placeholder: '#adb5bd',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  verifiedBg: '#f0f9f0',
  verifiedBorder: '#4caf50',
  cardShadow: '#000',
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
export default function EmailRegisterScreen({ route, navigation }) {
  // ── Params ────────────────────────────────────────────────────────────────
  const verifiedEmail = route.params?.verifiedEmail || '';
  const verifiedPhone = route.params?.verifiedPhone || '';
  const contactType = route.params?.contactType || 'email';
  const isVerified = route.params?.isVerified || false;

  // ── State ──────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    email: verifiedEmail,
    password: '',
    confirmPassword: '',
    name: '',
    phone: verifiedPhone,
    username: '',
    profilePic: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [networkModalVisible, setNetworkModalVisible] = useState(false);
  const [networkMessage, setNetworkMessage] = useState('');
  const [networkLoading, setNetworkLoading] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const inputs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    username: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };
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

  const retryRegistration = useCallback(() => {
    setNetworkLoading(true);
    handleRegister();
  }, []);

  // ─── Initial Focus ──────────────────────────────────────────────────────
  useEffect(() => {
    setTimeout(() => inputs.name.current?.focus(), 300);
  }, []);

  // ─── Permission Request ──────────────────────────────────────────────────
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

  // ─── Username Generation ──────────────────────────────────────────────────
  const generateUsername = (name) => {
    if (!name.trim()) return '';
    const base = name.trim().toLowerCase().replace(/\s+/g, '');
    const randomNum = Math.floor(Math.random() * 10000);
    return `${base}${randomNum}`;
  };

  useEffect(() => {
    if (formData.name && !formData.username) {
      const suggestedUsername = generateUsername(formData.name);
      setFormData(prev => ({ ...prev, username: suggestedUsername }));
    }
  }, [formData.name]);

  // ─── Form Validation ──────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores and dots';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  }, [formData]);

  // ─── Debounced Validation ─────────────────────────────────────────────────
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        validateForm();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    formData.name,
    formData.email,
    formData.phone,
    formData.username,
    formData.password,
    formData.confirmPassword,
    validateForm
  ]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

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
        { text: 'Take Photo', onPress: () => openCamera() },
        { text: 'Choose from Gallery', onPress: () => openGallery() }
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
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          handleInputChange('profilePic', asset);
        }
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
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          handleInputChange('profilePic', asset);
        }
      }
    });
  }, [handleInputChange]);

  const handleConfirmDetails = useCallback(() => {
    if (validateForm()) {
      setShowConfirmation(true);
      setTermsError(false);
    }
  }, [validateForm]);

  const handleEditDetails = useCallback(() => {
    setShowConfirmation(false);
    setTermsAccepted(false);
    setTermsError(false);
  }, []);

  // ─── Registration Handler ──────────────────────────────────────────────────
  const handleRegister = useCallback(async () => {
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

    const payload = new FormData();
    payload.append('email', formData.email.trim().toLowerCase());
    payload.append('password', formData.password);
    payload.append('name', formData.name.trim());
    payload.append('phone', formData.phone.replace(/[^0-9]/g, ''));
    payload.append('username', formData.username.trim().toLowerCase());

    if (formData.profilePic) {
      const imageData = {
        uri: formData.profilePic.uri,
        type: formData.profilePic.type || 'image/jpeg',
        name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
      };
      payload.append('profile_picture', imageData);
    }

    try {
      console.log('📤 Sending registration request...');
      
      const response = await axios.post(`${API_ROUTE}/email-register/`, payload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000,
      });

      console.log('📥 Registration response:', response.status);

      if (response.status === 201 && response.data.success) {
        const { token, refresh, user, reward } = response.data;

        if (!token) {
          throw new Error('No token received from server');
        }

        if (isMounted.current) {
          await EncryptedStorage.setItem('userToken', token);
          await EncryptedStorage.setItem('refreshToken', refresh || '');
          await EncryptedStorage.setItem('userData', JSON.stringify(user));
          
          await AsyncStorage.multiSet([
            ['userToken', token],
            ['refreshToken', refresh || ''],
            ['userData', JSON.stringify(user)],
            ['isVerified', 'true'],
            ['userEmail', user.email],
            ['userId', user.id.toString()],
            ['loginMethod', 'email'],
            ['username', formData.username.trim().toLowerCase()],
          ]);

          const registerDevice = async () => {
            try {
              const result = await FCMService.registerDevice(user.id, token);
              if (result.success) {
                console.log('✅ Device registered for notifications');
              } else {
                console.warn('⚠️ Device registration failed:', result.error);
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
          registerDevice();

          if (reward) {
            Alert.alert(
              'Welcome to Showa!',
              'Your account is ready. Connect, share, and discover amazing content on Showa.\n\nBonus coins have been added to your account.',
              [
                {
                  text: 'Get Started',
                  onPress: () => navigation.replace('SynMessage'),
                },
              ]
            );
          } else {
            navigation.replace('SynMessage');
          }
        }
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

    } catch (error) {
      console.error('❌ Registration error:', error);

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

      if (error.response.status >= 500 && error.response.status < 600) {
        setLoading(false);
        setNetworkLoading(false);
        showNetworkError(
          'Server is currently experiencing issues. Please try again later.',
          handleRegister
        );
        return;
      }

      let errorMessage = 'Unable to register. Please try again.';
      const backendError = error.response.data;

      if (backendError.error) {
        errorMessage = backendError.error;
      } else if (backendError.errors) {
        const errorsList = backendError.errors;
        const firstError = Object.values(errorsList)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError || errorMessage;
      } else if (backendError.email) {
        errorMessage = backendError.email[0] || 'Email is invalid';
      } else if (backendError.phone) {
        errorMessage = backendError.phone[0] || 'Phone number is invalid';
      } else if (backendError.username) {
        errorMessage = backendError.username[0] || 'Username is invalid';
      } else if (backendError.password) {
        errorMessage = backendError.password[0] || 'Password is invalid';
      }

      if (error.response.status === 409) {
        errorMessage = 'Account already exists. Please try logging in instead.';
      }

      if (isMounted.current) {
        Alert.alert('Registration Failed', errorMessage);
      }

    } finally {
      if (isMounted.current) {
        setLoading(false);
        setNetworkLoading(false);
      }
    }
  }, [
    termsAccepted,
    loading,
    formData,
    navigation,
    showNetworkError
  ]);

  // ─── Navigation ────────────────────────────────────────────────────────────
  const navigateToTerms = useCallback(() => {
    navigation.navigate('TermsCondition');
  }, [navigation]);

  const isFieldReadonly = (fieldName) => {
    if (!isVerified) return false;
    if (fieldName === 'email' && verifiedEmail && contactType === 'email') return true;
    if (fieldName === 'phone' && verifiedPhone && contactType === 'phone') return true;
    return false;
  };

  // ─── Render Input Form ──────────────────────────────────────────────────
  if (!showConfirmation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>

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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the Showa community today</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Profile Picture */}
              {/* <View style={styles.avatarSection}>
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
                    <Icon name="person" size={40} color="#C7D2E8" />
                  )}
                  <View style={styles.cameraBadge}>
                    <Icon name="camera" size={16} color="#FFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.avatarHint}>Add profile photo</Text>
              </View> */}

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                  <Icon name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.name}
                    placeholder="Enter your full name"
                    placeholderTextColor={COLORS.placeholder}
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputs.username.current?.focus()}
                    editable={!loading}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Username */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
                  <Icon name="at-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.username}
                    placeholder="Choose a unique username"
                    placeholderTextColor={COLORS.placeholder}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={formData.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputs.email.current?.focus()}
                    editable={!loading}
                  />
                </View>
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputWrapper, 
                  errors.email && styles.inputError,
                  isFieldReadonly('email') && styles.verifiedInput
                ]}>
                  <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.email}
                    placeholder="Enter your email address"
                    placeholderTextColor={COLORS.placeholder}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputs.phone.current?.focus()}
                    editable={!loading && !isFieldReadonly('email')}
                  />
                  {isFieldReadonly('email') && (
                    <Icon name="checkmark-circle" size={20} color={COLORS.success} />
                  )}
                </View>
                {isFieldReadonly('email') && (
                  <Text style={styles.verifiedText}>✓ Email verified</Text>
                )}
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={[
                  styles.inputWrapper, 
                  errors.phone && styles.inputError,
                  isFieldReadonly('phone') && styles.verifiedInput
                ]}>
                  <Icon name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.phone}
                    placeholder="Enter your phone number"
                    placeholderTextColor={COLORS.placeholder}
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputs.password.current?.focus()}
                    editable={!loading && !isFieldReadonly('phone')}
                  />
                  {isFieldReadonly('phone') && (
                    <Icon name="checkmark-circle" size={20} color={COLORS.success} />
                  )}
                </View>
                {isFieldReadonly('phone') && (
                  <Text style={styles.verifiedText}>✓ Phone number verified</Text>
                )}
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.password}
                    placeholder="Create a password (min 6 characters)"
                    placeholderTextColor={COLORS.placeholder}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputs.confirmPassword.current?.focus()}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.confirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor={COLORS.placeholder}
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    returnKeyType="done"
                    onSubmitEditing={handleConfirmDetails}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                    <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={handleConfirmDetails}
                style={[styles.continueButton, (!isFormValid || loading) && styles.buttonDisabled]}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.buttonGradient}>
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

              {/* Sign In Link */}
              <View style={styles.signinContainer}>
                <Text style={styles.signinText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('EmailLogin')}>
                  <Text style={styles.signinLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─── Render Confirmation View ──────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={handleEditDetails} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.confirmIconContainer}>
              <LinearGradient
                colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
                style={styles.iconGradient}
              >
                <Icon name="checkmark-circle" size={42} color={COLORS.primary} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Confirm Details</Text>
            <Text style={styles.subtitle}>Please verify your information before proceeding</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Profile Picture Preview */}
            {/* <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                {formData.profilePic ? (
                  <Image 
                    source={{ uri: formData.profilePic.uri }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <Icon name="person" size={40} color="#C7D2E8" />
                )}
              </View>
            </View> */}

            <View style={styles.confirmationCard}>
              <View style={styles.confirmationRow}>
                <View style={styles.confirmationLabelContainer}>
                  <Icon name="person-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.confirmationLabel}>Name</Text>
                </View>
                <Text style={styles.confirmationValue}>{formData.name}</Text>
              </View>
              
              <View style={styles.confirmationDivider} />
              
              <View style={styles.confirmationRow}>
                <View style={styles.confirmationLabelContainer}>
                  <Icon name="at-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.confirmationLabel}>Username</Text>
                </View>
                <Text style={styles.confirmationValue}>@{formData.username}</Text>
              </View>
              
              <View style={styles.confirmationDivider} />
              
              <View style={styles.confirmationRow}>
                <View style={styles.confirmationLabelContainer}>
                  <Icon name="mail-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.confirmationLabel}>Email</Text>
                </View>
                <Text style={styles.confirmationValue}>{formData.email}</Text>
              </View>
              
              <View style={styles.confirmationDivider} />
              
              <View style={styles.confirmationRow}>
                <View style={styles.confirmationLabelContainer}>
                  <Icon name="call-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.confirmationLabel}>Phone</Text>
                </View>
                <Text style={styles.confirmationValue}>{formData.phone}</Text>
              </View>
            </View>

            {/* Terms of Service */}
            <View style={[styles.termsContainer, termsError && styles.termsErrorBorder]}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  setTermsAccepted(prev => !prev);
                  if (termsError) setTermsError(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <Icon name="checkmark" size={14} color="#FFF" />}
                </View>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink} onPress={navigateToTerms}>
                      Terms & Conditions
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
              {termsError && (
                <Text style={styles.termsErrorText}>You must accept the terms to continue</Text>
              )}
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleEditDetails}
                style={styles.editButton}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRegister}
                style={[styles.confirmButton, loading && styles.buttonDisabled]}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.buttonGradient}>
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.confirmButtonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Network Error Modal */}
      <NetworkStatusModal
        visible={networkModalVisible}
        message={networkMessage}
        onRetry={retryRegistration}
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
    backgroundColor: '#f5f6fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  logoWrapper: {
    marginBottom: 12,
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
  confirmIconContainer: {
    marginBottom: 12,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  verifiedInput: {
    backgroundColor: '#F0F9F0',
    borderColor: '#4CAF50',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 4,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 4,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 4,
  },
  signinText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signinLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Confirmation screen styles
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8ECF1',
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  confirmationLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmationLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmationValue: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmationDivider: {
    height: 1,
    backgroundColor: '#F1F3F5',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  termsContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8ECF1',
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
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
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
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  termsErrorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 30,
  },
  // Network Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 11,
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
    fontSize: 15,
    fontWeight: '600',
  },
  modalRetryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});