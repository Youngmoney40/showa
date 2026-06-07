
// // // import React, { useState, useRef, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Platform,
// // //   ActivityIndicator,
// // //   Alert,
// // //   KeyboardAvoidingView,
// // //   ScrollView,
// // //   StatusBar,
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import axios from 'axios';
// // // import { API_ROUTE } from '../../api_routing/api';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // const COLORS = {
// // //   primary: '#0d64dd',
// // //   white: '#ffffff',
// // //   textPrimary: '#1a1a1a',
// // //   textSecondary: '#6c757d',
// // //   border: '#e1e5eb',
// // //   error: '#dc3545',
// // //   success: '#28a745',
// // // };

// // // export default function EmailRegisterScreen({ navigation }) {
// // //   const [formData, setFormData] = useState({
// // //     email: '',
// // //     password: '',
// // //     confirmPassword: '',
// // //     name: '',
// // //   });
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [errors, setErrors] = useState({});
// // //   const [termsAccepted, setTermsAccepted] = useState(false);

// // //   const inputs = {
// // //     name: useRef(null),
// // //     email: useRef(null),
// // //     password: useRef(null),
// // //     confirmPassword: useRef(null),
// // //   };

// // //   useEffect(() => {
// // //     setTimeout(() => inputs.name.current?.focus(), 300);
// // //   }, []);

// // //   const validateForm = () => {
// // //     const newErrors = {};
// // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
// // //     if (!formData.name.trim()) {
// // //       newErrors.name = 'Full name is required';
// // //     }
    
// // //     if (!formData.email.trim()) {
// // //       newErrors.email = 'Email is required';
// // //     } else if (!emailRegex.test(formData.email)) {
// // //       newErrors.email = 'Please enter a valid email address';
// // //     }
    
// // //     if (!formData.password) {
// // //       newErrors.password = 'Password is required';
// // //     } else if (formData.password.length < 6) {
// // //       newErrors.password = 'Password must be at least 6 characters';
// // //     }
    
// // //     if (!formData.confirmPassword) {
// // //       newErrors.confirmPassword = 'Please confirm your password';
// // //     } else if (formData.password !== formData.confirmPassword) {
// // //       newErrors.confirmPassword = 'Passwords do not match';
// // //     }
    
// // //     if (!termsAccepted) {
// // //       newErrors.terms = 'You must accept the terms to continue';
// // //     }
    
// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   const handleRegister = async () => {
// // //     if (!validateForm()) return;
    
// // //     setLoading(true);
    
// // //     try {
// // //       const response = await axios.post(`${API_ROUTE}/email-register/`, {
// // //         email: formData.email.trim().toLowerCase(),
// // //         password: formData.password,
// // //         name: formData.name.trim(),
// // //       });
      
// // //       if (response.status === 201 && response.data.success) {
// // //         const { token, refresh, user, reward } = response.data;
        
// // //         await AsyncStorage.multiSet([
// // //           ['userToken', token],
// // //           ['refreshToken', refresh],
// // //           ['userData', JSON.stringify(user)],
// // //           ['isVerified', 'true'],
// // //           ['userEmail', user.email],
// // //           ['userId', user.id.toString()],
// // //           ['loginMethod', 'email'],
// // //         ]);
        
// // //         // Show welcome bonus alert
// // //         if (reward) {
// // //           Alert.alert(
// // //             'Welcome! 🎉',
// // //             `You've received ${reward.coins} bonus coins!`,
// // //             [{ text: 'Continue', onPress: () => navigation.replace('SynMessage') }]
// // //           );
// // //         } else {
// // //           navigation.replace('SynMessage');
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error('Registration error:', error);
      
// // //       let errorMessage = 'Unable to register. Please try again.';
// // //       if (error.response?.data?.error) {
// // //         errorMessage = error.response.data.error;
// // //       } else if (error.response?.data?.email) {
// // //         errorMessage = error.response.data.email[0];
// // //       }
      
// // //       Alert.alert('Registration Failed', errorMessage);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const navigateToTerms = () => {
// // //     navigation.navigate('TermsCondition');
// // //   };

// // //   const navigateToLogin = () => {
// // //     navigation.navigate('EmailLogin');
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      
// // //       <KeyboardAvoidingView
// // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //         style={styles.keyboardView}
// // //       >
// // //         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
// // //           {/* Back Button */}
// // //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //             <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
// // //           </TouchableOpacity>

// // //           {/* Header */}
// // //           <View style={styles.header}>
// // //             <LinearGradient
// // //               colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
// // //               style={styles.iconContainer}
// // //             >
// // //               <Icon name="person-add" size={42} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <Text style={styles.title}>Create Account</Text>
// // //             <Text style={styles.subtitle}>Sign up with email and password</Text>
// // //           </View>

// // //           {/* Form */}
// // //           <View style={styles.formContainer}>
// // //             {/* Full Name */}
// // //             <View style={styles.inputGroup}>
// // //               <Text style={styles.inputLabel}>Full Name</Text>
// // //               <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
// // //                 <Icon name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// // //                 <TextInput
// // //                   ref={inputs.name}
// // //                   placeholder="Enter your full name"
// // //                   style={styles.input}
// // //                   value={formData.name}
// // //                   onChangeText={(text) => {
// // //                     setFormData({ ...formData, name: text });
// // //                     if (errors.name) setErrors({ ...errors, name: null });
// // //                   }}
// // //                   returnKeyType="next"
// // //                   onSubmitEditing={() => inputs.email.current?.focus()}
// // //                   editable={!loading}
// // //                 />
// // //               </View>
// // //               {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
// // //             </View>

// // //             {/* Email */}
// // //             <View style={styles.inputGroup}>
// // //               <Text style={styles.inputLabel}>Email Address</Text>
// // //               <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
// // //                 <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// // //                 <TextInput
// // //                   ref={inputs.email}
// // //                   placeholder="Enter your email"
// // //                   style={styles.input}
// // //                   keyboardType="email-address"
// // //                   autoCapitalize="none"
// // //                   autoCorrect={false}
// // //                   value={formData.email}
// // //                   onChangeText={(text) => {
// // //                     setFormData({ ...formData, email: text });
// // //                     if (errors.email) setErrors({ ...errors, email: null });
// // //                   }}
// // //                   returnKeyType="next"
// // //                   onSubmitEditing={() => inputs.password.current?.focus()}
// // //                   editable={!loading}
// // //                 />
// // //               </View>
// // //               {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
// // //             </View>

// // //             {/* Password */}
// // //             <View style={styles.inputGroup}>
// // //               <Text style={styles.inputLabel}>Password</Text>
// // //               <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
// // //                 <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// // //                 <TextInput
// // //                   ref={inputs.password}
// // //                   placeholder="Create a password"
// // //                   style={styles.input}
// // //                   secureTextEntry={!showPassword}
// // //                   value={formData.password}
// // //                   onChangeText={(text) => {
// // //                     setFormData({ ...formData, password: text });
// // //                     if (errors.password) setErrors({ ...errors, password: null });
// // //                   }}
// // //                   returnKeyType="next"
// // //                   onSubmitEditing={() => inputs.confirmPassword.current?.focus()}
// // //                   editable={!loading}
// // //                 />
// // //                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
// // //                   <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
// // //                 </TouchableOpacity>
// // //               </View>
// // //               {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
// // //             </View>

// // //             {/* Confirm Password */}
// // //             <View style={styles.inputGroup}>
// // //               <Text style={styles.inputLabel}>Confirm Password</Text>
// // //               <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
// // //                 <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// // //                 <TextInput
// // //                   ref={inputs.confirmPassword}
// // //                   placeholder="Confirm your password"
// // //                   style={styles.input}
// // //                   secureTextEntry={!showConfirmPassword}
// // //                   value={formData.confirmPassword}
// // //                   onChangeText={(text) => {
// // //                     setFormData({ ...formData, confirmPassword: text });
// // //                     if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
// // //                   }}
// // //                   returnKeyType="done"
// // //                   onSubmitEditing={handleRegister}
// // //                   editable={!loading}
// // //                 />
// // //                 <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
// // //                   <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
// // //                 </TouchableOpacity>
// // //               </View>
// // //               {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
// // //             </View>

// // //             {/* Terms Checkbox */}
// // //             <View style={styles.termsContainer}>
// // //               <TouchableOpacity
// // //                 style={styles.checkboxContainer}
// // //                 onPress={() => {
// // //                   setTermsAccepted(!termsAccepted);
// // //                   if (errors.terms) setErrors({ ...errors, terms: null });
// // //                 }}
// // //               >
// // //                 <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
// // //                   {termsAccepted && <Icon name="checkmark" size={14} color="#fff" />}
// // //                 </View>
// // //                 <Text style={styles.termsText}>
// // //                   I agree to the{' '}
// // //                   <Text style={styles.termsLink} onPress={navigateToTerms}>
// // //                     Terms & Conditions
// // //                   </Text>
// // //                 </Text>
// // //               </TouchableOpacity>
// // //               {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
// // //             </View>

// // //             {/* Register Button */}
// // //             <TouchableOpacity
// // //               onPress={handleRegister}
// // //               style={[styles.registerButton, loading && styles.buttonDisabled]}
// // //               disabled={loading}
// // //               activeOpacity={0.8}
// // //             >
// // //               <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
// // //                 {loading ? (
// // //                   <ActivityIndicator size="small" color={COLORS.white} />
// // //                 ) : (
// // //                   <>
// // //                     <Text style={styles.buttonText}>Sign Up</Text>
// // //                     <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
// // //                   </>
// // //                 )}
// // //               </LinearGradient>
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Login Link */}
// // //           <View style={styles.loginContainer}>
// // //             <Text style={styles.loginText}>Already have an account? </Text>
// // //             <TouchableOpacity onPress={navigateToLogin}>
// // //               <Text style={styles.loginLink}>Sign In</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </ScrollView>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.white,
// // //   },
// // //   keyboardView: {
// // //     flex: 1,
// // //   },
// // //   scrollContent: {
// // //     flexGrow: 1,
// // //     paddingHorizontal: 24,
// // //     paddingBottom: 32,
// // //   },
// // //   backButton: {
// // //     width: 40,
// // //     height: 40,
// // //     justifyContent: 'center',
// // //     marginTop: 16,
// // //   },
// // //   header: {
// // //     alignItems: 'center',
// // //     marginTop: 24,
// // //     marginBottom: 32,
// // //   },
// // //   iconContainer: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //   },
// // //   title: {
// // //     fontSize: 28,
// // //     fontWeight: '700',
// // //     color: COLORS.textPrimary,
// // //     marginBottom: 8,
// // //   },
// // //   subtitle: {
// // //     fontSize: 16,
// // //     color: COLORS.textSecondary,
// // //     textAlign: 'center',
// // //   },
// // //   formContainer: {
// // //     marginBottom: 24,
// // //   },
// // //   inputGroup: {
// // //     marginBottom: 20,
// // //   },
// // //   inputLabel: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textPrimary,
// // //     marginBottom: 8,
// // //   },
// // //   inputWrapper: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     borderWidth: 1.5,
// // //     borderColor: COLORS.border,
// // //     borderRadius: 12,
// // //     backgroundColor: COLORS.white,
// // //     paddingHorizontal: 16,
// // //     height: 56,
// // //   },
// // //   inputError: {
// // //     borderColor: COLORS.error,
// // //   },
// // //   inputIcon: {
// // //     marginRight: 12,
// // //   },
// // //   input: {
// // //     flex: 1,
// // //     fontSize: 16,
// // //     color: COLORS.textPrimary,
// // //     paddingVertical: 0,
// // //   },
// // //   eyeButton: {
// // //     padding: 8,
// // //   },
// // //   errorText: {
// // //     color: COLORS.error,
// // //     fontSize: 12,
// // //     marginTop: 6,
// // //     paddingLeft: 4,
// // //   },
// // //   termsContainer: {
// // //     marginBottom: 24,
// // //   },
// // //   checkboxContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   checkbox: {
// // //     width: 22,
// // //     height: 22,
// // //     borderRadius: 6,
// // //     borderWidth: 2,
// // //     borderColor: COLORS.border,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   checkboxChecked: {
// // //     backgroundColor: COLORS.primary,
// // //     borderColor: COLORS.primary,
// // //   },
// // //   termsText: {
// // //     flex: 1,
// // //     fontSize: 13,
// // //     color: COLORS.textSecondary,
// // //   },
// // //   termsLink: {
// // //     color: COLORS.primary,
// // //     fontWeight: '600',
// // //   },
// // //   registerButton: {
// // //     borderRadius: 12,
// // //     overflow: 'hidden',
// // //   },
// // //   buttonDisabled: {
// // //     opacity: 0.6,
// // //   },
// // //   buttonGradient: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 16,
// // //   },
// // //   buttonText: {
// // //     color: COLORS.white,
// // //     fontSize: 17,
// // //     fontWeight: '700',
// // //   },
// // //   buttonIcon: {
// // //     marginLeft: 8,
// // //   },
// // //   loginContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     paddingVertical: 16,
// // //   },
// // //   loginText: {
// // //     fontSize: 14,
// // //     color: COLORS.textSecondary,
// // //   },
// // //   loginLink: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.primary,
// // //   },
// // // });


// // import React, { useState, useRef, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Platform,
// //   ActivityIndicator,
// //   Alert,
// //   KeyboardAvoidingView,
// //   ScrollView,
// //   StatusBar,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import LinearGradient from 'react-native-linear-gradient';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import axios from 'axios';
// // import { API_ROUTE } from '../../api_routing/api';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const COLORS = {
// //   primary: '#0d64dd',
// //   white: '#ffffff',
// //   textPrimary: '#1a1a1a',
// //   textSecondary: '#6c757d',
// //   border: '#e1e5eb',
// //   error: '#dc3545',
// //   success: '#28a745',
// // };

// // export default function EmailRegisterScreen({ route, navigation }) {
// //   const [formData, setFormData] = useState({
// //     email: '',
// //     password: '',
// //     confirmPassword: '',
// //     name: '',
// //     phone: '',        
// //     username: '',     
// //   });

// //   const emailId = route.params?.emailID;
// //   const phoneNumberID = route.params?.phoneNumberID;
// //   const contactType = route.params?.contactType || 'email';

// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [errors, setErrors] = useState({});
// //   const [termsAccepted, setTermsAccepted] = useState(false);

// //   const inputs = {
// //     name: useRef(null),
// //     email: useRef(null),
// //     phone: useRef(null),      
// //     username: useRef(null),   
// //     password: useRef(null),
// //     confirmPassword: useRef(null),
// //   };

// //   useEffect(() => {
// //     setTimeout(() => inputs.name.current?.focus(), 300);
// //   }, []);

// //   // Generate random username from name + random numbers
// //   const generateUsername = (name) => {
// //     if (!name.trim()) return '';
// //     const base = name.trim().toLowerCase().replace(/\s+/g, '');
// //     const randomNum = Math.floor(Math.random() * 10000);
// //     return `${base}${randomNum}`;
// //   };

// //   // Auto-generate username when name changes
// //   useEffect(() => {
// //     if (formData.name && !formData.username) {
// //       const suggestedUsername = generateUsername(formData.name);
// //       setFormData(prev => ({ ...prev, username: suggestedUsername }));
// //     }
// //   }, [formData.name]);

// //   const validateForm = () => {
// //     const newErrors = {};
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     const phoneRegex = /^[0-9]{10,15}$/;
    
// //     if (!formData.name.trim()) {
// //       newErrors.name = 'Full name is required';
// //     }
    
// //     if (!formData.email.trim()) {
// //       newErrors.email = 'Email is required';
// //     } else if (!emailRegex.test(formData.email)) {
// //       newErrors.email = 'Please enter a valid email address';
// //     }
    
// //     // ADD PHONE VALIDATION
// //     if (!formData.phone.trim()) {
// //       newErrors.phone = 'Phone number is required';
// //     } else if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
// //       newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
// //     }
    
// //     // ADD USERNAME VALIDATION
// //     if (!formData.username.trim()) {
// //       newErrors.username = 'Username is required';
// //     } else if (formData.username.length < 3) {
// //       newErrors.username = 'Username must be at least 3 characters';
// //     } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
// //       newErrors.username = 'Username can only contain letters, numbers, underscores and dots';
// //     }
    
// //     if (!formData.password) {
// //       newErrors.password = 'Password is required';
// //     } else if (formData.password.length < 6) {
// //       newErrors.password = 'Password must be at least 6 characters';
// //     }
    
// //     if (!formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Please confirm your password';
// //     } else if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Passwords do not match';
// //     }
    
// //     if (!termsAccepted) {
// //       newErrors.terms = 'You must accept the terms to continue';
// //     }
    
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleRegister = async () => {
// //     if (!validateForm()) return;
    
// //     setLoading(true);
    
// //     // Clean phone number (remove spaces, dashes)
// //     const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    
// //     try {
// //       const response = await axios.post(`${API_ROUTE}/email-register/`, {
// //         email: formData.email.trim().toLowerCase(),
// //         password: formData.password,
// //         name: formData.name.trim(),
// //         phone: cleanPhone,                    // ADD THIS
// //         username: formData.username.trim().toLowerCase(),  // ADD THIS
// //       });
      
// //       if (response.status === 201 && response.data.success) {
// //         const { token, refresh, user, reward } = response.data;
        
// //         await AsyncStorage.multiSet([
// //           ['userToken', token],
// //           ['refreshToken', refresh],
// //           ['userData', JSON.stringify(user)],
// //           ['isVerified', 'true'],
// //           ['userEmail', user.email],
// //           ['userId', user.id.toString()],
// //           ['loginMethod', 'email'],
// //         ]);
        
// //         // Show welcome bonus alert
// //         if (reward) {
// //           Alert.alert(
// //             'Welcome! ',
// //             `You've received ${reward.coins} bonus coins!`,
// //             [{ text: 'Continue', onPress: () => navigation.replace('SynMessage') }]
// //           );
// //         } else {
// //           navigation.replace('SynMessage');
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Registration error:', error);
      
// //       let errorMessage = 'Unable to register. Please try again.';
      
// //       // Handle different error formats
// //       if (error.response?.data?.error) {
// //         errorMessage = error.response.data.error;
// //       } else if (error.response?.data?.errors) {
// //         const errorsList = error.response.data.errors;
// //         const firstError = Object.values(errorsList)[0];
// //         errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
// //       } else if (error.response?.data?.email) {
// //         errorMessage = error.response.data.email[0];
// //       } else if (error.response?.data?.phone) {
// //         errorMessage = error.response.data.phone[0];
// //       } else if (error.response?.data?.username) {
// //         errorMessage = error.response.data.username[0];
// //       }
      
// //       Alert.alert('Registration Failed', errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const navigateToTerms = () => {
// //     navigation.navigate('TermsCondition');
// //   };

// //   const navigateToLogin = () => {
// //     navigation.navigate('EmailLogin');
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         style={styles.keyboardView}
// //       >
// //         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
// //           {/* Back Button */}
// //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //             <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
// //           </TouchableOpacity>

// //           {/* Header */}
// //           <View style={styles.header}>
// //             <LinearGradient
// //               colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
// //               style={styles.iconContainer}
// //             >
// //               <Icon name="person-add" size={42} color={COLORS.primary} />
// //             </LinearGradient>
// //             <Text style={styles.title}>Create Account</Text>
// //             <Text style={styles.subtitle}>Sign up with email and password</Text>
// //           </View>

// //           {/* Form */}
// //           <View style={styles.formContainer}>
// //             {/* Full Name */}
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.inputLabel}>Full Name </Text>
// //               <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
// //                 <Icon name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// //                 <TextInput
// //                   ref={inputs.name}
// //                   placeholder="Enter your full name"
// //                   style={styles.input}
// //                   value={formData.name}
// //                   onChangeText={(text) => {
// //                     setFormData({ ...formData, name: text });
// //                     if (errors.name) setErrors({ ...errors, name: null });
// //                   }}
// //                   returnKeyType="next"
// //                   onSubmitEditing={() => inputs.email.current?.focus()}
// //                   editable={!loading}
// //                 />
// //               </View>
// //               {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
// //             </View>

// //             {/* Email */}
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.inputLabel}>Email Address {emailId}</Text>
// //               <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
// //                 <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// //                 <TextInput
// //                   ref={inputs.email}
// //                   placeholder="Enter your email"
// //                   style={styles.input}
// //                   keyboardType="email-address"
// //                   autoCapitalize="none"
// //                   autoCorrect={false}
// //                   value={formData.email}
// //                   onChangeText={(text) => {
// //                     setFormData({ ...formData, email: text });
// //                     if (errors.email) setErrors({ ...errors, email: null });
// //                   }}
// //                   returnKeyType="next"
// //                   onSubmitEditing={() => inputs.phone.current?.focus()}
// //                   editable={!loading}
// //                 />
// //               </View>
// //               {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
// //             </View>

// //             {/* Phone Number  */}
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.inputLabel}>Phone Number {phoneNumberID}</Text>
// //               <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
// //                 <Icon name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// //                 <TextInput
// //                   ref={inputs.phone}
// //                   placeholder="Enter your phone number (e.g., 08012345678)"
// //                   style={styles.input}
// //                   keyboardType="phone-pad"
// //                   value={formData.phone}
// //                   onChangeText={(text) => {
// //                     setFormData({ ...formData, phone: text });
// //                     if (errors.phone) setErrors({ ...errors, phone: null });
// //                   }}
// //                   returnKeyType="next"
// //                   onSubmitEditing={() => inputs.username.current?.focus()}
// //                   editable={!loading}
// //                 />
// //               </View>
// //               {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
// //             </View>

// //             {/* Username - NEW FIELD */}
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.inputLabel}>Username</Text>
// //               <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
// //                 <Icon name="at-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// //                 <TextInput
// //                   ref={inputs.username}
// //                   placeholder="Choose a username"
// //                   style={styles.input}
// //                   autoCapitalize="none"
// //                   autoCorrect={false}
// //                   value={formData.username}
// //                   onChangeText={(text) => {
// //                     setFormData({ ...formData, username: text });
// //                     if (errors.username) setErrors({ ...errors, username: null });
// //                   }}
// //                   returnKeyType="next"
// //                   onSubmitEditing={() => inputs.password.current?.focus()}
// //                   editable={!loading}
// //                 />
// //               </View>
// //               {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
// //               {!formData.username && formData.name && (
// //                 <Text style={styles.suggestionText}>
// //                   Suggested: {generateUsername(formData.name)}
// //                 </Text>
// //               )}
// //             </View>

// //             {/* Password */}
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.inputLabel}>Password</Text>
// //               <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
// //                 <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// //                 <TextInput
// //                   ref={inputs.password}
// //                   placeholder="Create a password (min 6 characters)"
// //                   style={styles.input}
// //                   secureTextEntry={!showPassword}
// //                   value={formData.password}
// //                   onChangeText={(text) => {
// //                     setFormData({ ...formData, password: text });
// //                     if (errors.password) setErrors({ ...errors, password: null });
// //                   }}
// //                   returnKeyType="next"
// //                   onSubmitEditing={() => inputs.confirmPassword.current?.focus()}
// //                   editable={!loading}
// //                 />
// //                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
// //                   <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
// //                 </TouchableOpacity>
// //               </View>
// //               {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
// //             </View>

// //             {/* Confirm Password */}
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.inputLabel}>Confirm Password</Text>
// //               <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
// //                 <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
// //                 <TextInput
// //                   ref={inputs.confirmPassword}
// //                   placeholder="Confirm your password"
// //                   style={styles.input}
// //                   secureTextEntry={!showConfirmPassword}
// //                   value={formData.confirmPassword}
// //                   onChangeText={(text) => {
// //                     setFormData({ ...formData, confirmPassword: text });
// //                     if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
// //                   }}
// //                   returnKeyType="done"
// //                   onSubmitEditing={handleRegister}
// //                   editable={!loading}
// //                 />
// //                 <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
// //                   <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
// //                 </TouchableOpacity>
// //               </View>
// //               {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
// //             </View>

// //             {/* Terms Checkbox */}
// //             <View style={styles.termsContainer}>
// //               <TouchableOpacity
// //                 style={styles.checkboxContainer}
// //                 onPress={() => {
// //                   setTermsAccepted(!termsAccepted);
// //                   if (errors.terms) setErrors({ ...errors, terms: null });
// //                 }}
// //               >
// //                 <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
// //                   {termsAccepted && <Icon name="checkmark" size={14} color="#fff" />}
// //                 </View>
// //                 <Text style={styles.termsText}>
// //                   I agree to the{' '}
// //                   <Text style={styles.termsLink} onPress={navigateToTerms}>
// //                     Terms & Conditions
// //                   </Text>
// //                 </Text>
// //               </TouchableOpacity>
// //               {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
// //             </View>

// //             {/* Register Button */}
// //             <TouchableOpacity
// //               onPress={handleRegister}
// //               style={[styles.registerButton, loading && styles.buttonDisabled]}
// //               disabled={loading}
// //               activeOpacity={0.8}
// //             >
// //               <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
// //                 {loading ? (
// //                   <ActivityIndicator size="small" color={COLORS.white} />
// //                 ) : (
// //                   <>
// //                     <Text style={styles.buttonText}>Sign Up</Text>
// //                     <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
// //                   </>
// //                 )}
// //               </LinearGradient>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Login Link */}
// //           <View style={styles.loginContainer}>
// //             <Text style={styles.loginText}>Already have an account? </Text>
// //             <TouchableOpacity onPress={navigateToLogin}>
// //               <Text style={styles.loginLink}>Sign In</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.white,
// //   },
// //   keyboardView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //     paddingHorizontal: 24,
// //     paddingBottom: 32,
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     justifyContent: 'center',
// //     marginTop: 16,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     marginTop: 24,
// //     marginBottom: 32,
// //   },
// //   iconContainer: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: '700',
// //     color: COLORS.textPrimary,
// //     marginBottom: 8,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: COLORS.textSecondary,
// //     textAlign: 'center',
// //   },
// //   formContainer: {
// //     marginBottom: 24,
// //   },
// //   inputGroup: {
// //     marginBottom: 20,
// //   },
// //   inputLabel: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textPrimary,
// //     marginBottom: 8,
// //   },
// //   inputWrapper: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     borderWidth: 1.5,
// //     borderColor: COLORS.border,
// //     borderRadius: 12,
// //     backgroundColor: COLORS.white,
// //     paddingHorizontal: 16,
// //     height: 56,
// //   },
// //   inputError: {
// //     borderColor: COLORS.error,
// //   },
// //   inputIcon: {
// //     marginRight: 12,
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: 16,
// //     color: COLORS.textPrimary,
// //     paddingVertical: 0,
// //   },
// //   eyeButton: {
// //     padding: 8,
// //   },
// //   errorText: {
// //     color: COLORS.error,
// //     fontSize: 12,
// //     marginTop: 6,
// //     paddingLeft: 4,
// //   },
// //   suggestionText: {
// //     color: COLORS.textSecondary,
// //     fontSize: 12,
// //     marginTop: 6,
// //     paddingLeft: 4,
// //     fontStyle: 'italic',
// //   },
// //   termsContainer: {
// //     marginBottom: 24,
// //   },
// //   checkboxContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   checkbox: {
// //     width: 22,
// //     height: 22,
// //     borderRadius: 6,
// //     borderWidth: 2,
// //     borderColor: COLORS.border,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   checkboxChecked: {
// //     backgroundColor: COLORS.primary,
// //     borderColor: COLORS.primary,
// //   },
// //   termsText: {
// //     flex: 1,
// //     fontSize: 13,
// //     color: COLORS.textSecondary,
// //   },
// //   termsLink: {
// //     color: COLORS.primary,
// //     fontWeight: '600',
// //   },
// //   registerButton: {
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //   },
// //   buttonDisabled: {
// //     opacity: 0.6,
// //   },
// //   buttonGradient: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 16,
// //   },
// //   buttonText: {
// //     color: COLORS.white,
// //     fontSize: 17,
// //     fontWeight: '700',
// //   },
// //   buttonIcon: {
// //     marginLeft: 8,
// //   },
// //   loginContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     paddingVertical: 16,
// //   },
// //   loginText: {
// //     fontSize: 14,
// //     color: COLORS.textSecondary,
// //   },
// //   loginLink: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.primary,
// //   },
// // });

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
//   KeyboardAvoidingView,
//   ScrollView,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
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
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [termsAccepted, setTermsAccepted] = useState(false);

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

//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[0-9]{10,15}$/;
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Full name is required';
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
    
//     if (!termsAccepted) {
//       newErrors.terms = 'You must accept the terms to continue';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleRegister = async () => {
//     if (!validateForm()) return;
    
//     setLoading(true);
    
//     const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    
//     try {
//       const response = await axios.post(`${API_ROUTE}/email-register/`, {
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//         name: formData.name.trim(),
//         phone: cleanPhone,
//         username: formData.username.trim().toLowerCase(),
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
//             'Welcome! 🎉',
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

//   const navigateToLogin = () => {
//     navigation.navigate('EmailLogin');
//   };

//   // Helper to check if a field should be readonly
//   const isFieldReadonly = (fieldName) => {
//     if (!isVerified) return false;
//     if (fieldName === 'email' && verifiedEmail && contactType === 'email') return true;
//     if (fieldName === 'phone' && verifiedPhone && contactType === 'phone') return true;
//     return false;
//   };

//   // Get verified badge icon
//   const getVerifiedIcon = (fieldName) => {
//     if (isFieldReadonly(fieldName)) {
//       return <Icon name="checkmark-circle" size={16} color={COLORS.success} style={styles.verifiedIcon} />;
//     }
//     return null;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
//           {/* Back Button */}
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
//           </TouchableOpacity>

//           {/* Header */}
//           <View style={styles.header}>
//             <LinearGradient
//               colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
//               style={styles.iconContainer}
//             >
//               <Icon name="person-add" size={42} color={COLORS.primary} />
//             </LinearGradient>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>Complete your registration</Text>
//           </View>

//           {/* Form */}
//           <View style={styles.formContainer}>
//             {/* Full Name */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Full Name *</Text>
//               <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
//                 <Icon name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                 <TextInput
//                   ref={inputs.name}
//                   placeholder="Enter your full name"
//                   style={styles.input}
//                   value={formData.name}
//                   onChangeText={(text) => {
//                     setFormData({ ...formData, name: text });
//                     if (errors.name) setErrors({ ...errors, name: null });
//                   }}
//                   returnKeyType="next"
//                   onSubmitEditing={() => inputs.username.current?.focus()}
//                   editable={!loading}
//                 />
//               </View>
//               {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//             </View>

//             {/* Username */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Username *</Text>
//               <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
//                 <Icon name="at-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                 <TextInput
//                   ref={inputs.username}
//                   placeholder="Choose a username"
//                   style={styles.input}
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   value={formData.username}
//                   onChangeText={(text) => {
//                     setFormData({ ...formData, username: text });
//                     if (errors.username) setErrors({ ...errors, username: null });
//                   }}
//                   returnKeyType="next"
//                   onSubmitEditing={() => inputs.password.current?.focus()}
//                   editable={!loading}
//                 />
//               </View>
//               {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
//               {!formData.username && formData.name && (
//                 <Text style={styles.suggestionText}>
//                   Suggested: {generateUsername(formData.name)}
//                 </Text>
//               )}
//             </View>

//             {/* Email - READONLY if verified */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>
//                 Email Address *
//                 {getVerifiedIcon('email')}
//               </Text>
//               <View style={[
//                 styles.inputWrapper, 
//                 errors.email && styles.inputError,
//                 isFieldReadonly('email') && styles.verifiedInput
//               ]}>
//                 <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                 <TextInput
//                   ref={inputs.email}
//                   placeholder="Enter your email"
//                   style={styles.input}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   value={formData.email}
//                   onChangeText={(text) => {
//                     setFormData({ ...formData, email: text });
//                     if (errors.email) setErrors({ ...errors, email: null });
//                   }}
//                   returnKeyType="next"
//                   onSubmitEditing={() => inputs.phone.current?.focus()}
//                   editable={!loading && !isFieldReadonly('email')}
//                   pointerEvents={isFieldReadonly('email') ? 'none' : 'auto'}
//                 />
//               </View>
//               {isFieldReadonly('email') && (
//                 <Text style={styles.verifiedText}>
//                   ✓ Email verified. Click the pencil icon to change if needed.
//                 </Text>
//               )}
//               {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//             </View>

//             {/* Phone Number - READONLY if verified */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>
//                 Phone Number *
//                 {getVerifiedIcon('phone')}
//               </Text>
//               <View style={[
//                 styles.inputWrapper, 
//                 errors.phone && styles.inputError,
//                 isFieldReadonly('phone') && styles.verifiedInput
//               ]}>
//                 <Icon name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                 <TextInput
//                   ref={inputs.phone}
//                   placeholder="Enter your phone number"
//                   style={styles.input}
//                   keyboardType="phone-pad"
//                   value={formData.phone}
//                   onChangeText={(text) => {
//                     setFormData({ ...formData, phone: text });
//                     if (errors.phone) setErrors({ ...errors, phone: null });
//                   }}
//                   returnKeyType="next"
//                   onSubmitEditing={() => inputs.password.current?.focus()}
//                   editable={!loading && !isFieldReadonly('phone')}
//                   pointerEvents={isFieldReadonly('phone') ? 'none' : 'auto'}
//                 />
//               </View>
//               {isFieldReadonly('phone') && (
//                 <Text style={styles.verifiedText}>
//                   ✓ Phone number verified. Click the pencil icon to change if needed.
//                 </Text>
//               )}
//               {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
//             </View>

//             {/* Password */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Password *</Text>
//               <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
//                 <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                 <TextInput
//                   ref={inputs.password}
//                   placeholder="Create a password (min 6 characters)"
//                   style={styles.input}
//                   secureTextEntry={!showPassword}
//                   value={formData.password}
//                   onChangeText={(text) => {
//                     setFormData({ ...formData, password: text });
//                     if (errors.password) setErrors({ ...errors, password: null });
//                   }}
//                   returnKeyType="next"
//                   onSubmitEditing={() => inputs.confirmPassword.current?.focus()}
//                   editable={!loading}
//                 />
//                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
//                   <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//             </View>

//             {/* Confirm Password */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Confirm Password *</Text>
//               <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
//                 <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                 <TextInput
//                   ref={inputs.confirmPassword}
//                   placeholder="Confirm your password"
//                   style={styles.input}
//                   secureTextEntry={!showConfirmPassword}
//                   value={formData.confirmPassword}
//                   onChangeText={(text) => {
//                     setFormData({ ...formData, confirmPassword: text });
//                     if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
//                   }}
//                   returnKeyType="done"
//                   onSubmitEditing={handleRegister}
//                   editable={!loading}
//                 />
//                 <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
//                   <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//               </View>
//               {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
//             </View>

//             {/* Terms Checkbox */}
//             <View style={styles.termsContainer}>
//               <TouchableOpacity
//                 style={styles.checkboxContainer}
//                 onPress={() => {
//                   setTermsAccepted(!termsAccepted);
//                   if (errors.terms) setErrors({ ...errors, terms: null });
//                 }}
//               >
//                 <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
//                   {termsAccepted && <Icon name="checkmark" size={14} color="#fff" />}
//                 </View>
//                 <Text style={styles.termsText}>
//                   I agree to the{' '}
//                   <Text style={styles.termsLink} onPress={navigateToTerms}>
//                     Terms & Conditions
//                   </Text>
//                 </Text>
//               </TouchableOpacity>
//               {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
//             </View>

//             {/* Register Button */}
//             <TouchableOpacity
//               onPress={handleRegister}
//               style={[styles.registerButton, loading && styles.buttonDisabled]}
//               disabled={loading}
//               activeOpacity={0.8}
//             >
//               <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
//                 {loading ? (
//                   <ActivityIndicator size="small" color={COLORS.white} />
//                 ) : (
//                   <>
//                     <Text style={styles.buttonText}>Sign Up</Text>
//                     <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
//                   </>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//           {/* Login Link */}
//           <View style={styles.loginContainer}>
//             <Text style={styles.loginText}>Already have an account? </Text>
//             <TouchableOpacity onPress={navigateToLogin}>
//               <Text style={styles.loginLink}>Sign In</Text>
//             </TouchableOpacity>
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
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginBottom: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
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
//   verifiedIcon: {
//     marginLeft: 8,
//   },
//   suggestionText: {
//     color: COLORS.textSecondary,
//     fontSize: 12,
//     marginTop: 6,
//     paddingLeft: 4,
//     fontStyle: 'italic',
//   },
//   termsContainer: {
//     marginBottom: 24,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: COLORS.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   checkboxChecked: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   termsText: {
//     flex: 1,
//     fontSize: 13,
//     color: COLORS.textSecondary,
//   },
//   termsLink: {
//     color: COLORS.primary,
//     fontWeight: '600',
//   },
//   registerButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
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
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 16,
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#0d64dd',
  white: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#6c757d',
  border: '#e1e5eb',
  error: '#dc3545',
  success: '#28a745',
  verifiedBg: '#e8f5e9',
  verifiedBorder: '#4caf50',
};

export default function EmailRegisterScreen({ route, navigation }) {
  // Get verified contact info from route params
  const verifiedEmail = route.params?.verifiedEmail || '';
  const verifiedPhone = route.params?.verifiedPhone || '';
  const contactType = route.params?.contactType || 'email';
  const isVerified = route.params?.isVerified || false;

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

  const inputs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    username: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  useEffect(() => {
    setTimeout(() => inputs.name.current?.focus(), 300);
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

  // Generate random username from name + random numbers
  const generateUsername = (name) => {
    if (!name.trim()) return '';
    const base = name.trim().toLowerCase().replace(/\s+/g, '');
    const randomNum = Math.floor(Math.random() * 10000);
    return `${base}${randomNum}`;
  };

  // Auto-generate username when name changes
  useEffect(() => {
    if (formData.name && !formData.username) {
      const suggestedUsername = generateUsername(formData.name);
      setFormData(prev => ({ ...prev, username: suggestedUsername }));
    }
  }, [formData.name]);

  // Validate form in real-time
  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    
    if (!formData.name.trim()) {
      newErrors.name = 'First name and Surname is required';
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

  // Debounced validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateForm();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.name, formData.email, formData.phone, formData.username, formData.password, formData.confirmPassword, validateForm]);

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
  }, []);

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

  const handleRegister = async () => {
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
      const response = await axios.post(`${API_ROUTE}/email-register/`, payload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      if (response.status === 201 && response.data.success) {
        const { token, refresh, user, reward } = response.data;

        await AsyncStorage.multiSet([
          ['userToken', token],
          ['refreshToken', refresh],
          ['userData', JSON.stringify(user)],
          ['isVerified', 'true'],
          ['userEmail', user.email],
          ['userId', user.id.toString()],
          ['loginMethod', 'email'],
        ]);

        if (reward) {
          Alert.alert(
            'Welcome Your account has been successfull Register and ',
            `You've received ${reward.coins} bonus coins!`,
            [{ text: 'Continue', onPress: () => navigation.replace('SynMessage') }]
          );
        } else {
          navigation.replace('SynMessage');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Unable to register. Please try again.';

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        const errorsList = error.response.data.errors;
        const firstError = Object.values(errorsList)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (error.response?.data?.email) {
        errorMessage = error.response.data.email[0];
      } else if (error.response?.data?.phone) {
        errorMessage = error.response.data.phone[0];
      } else if (error.response?.data?.username) {
        errorMessage = error.response.data.username[0];
      }

      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToTerms = () => {
    navigation.navigate('TermsCondition');
  };

  const isFieldReadonly = (fieldName) => {
    if (!isVerified) return false;
    if (fieldName === 'email' && verifiedEmail && contactType === 'email') return true;
    if (fieldName === 'phone' && verifiedPhone && contactType === 'phone') return true;
    return false;
  };

  // Input Form View
  if (!showConfirmation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.header}>
              {/* <LinearGradient
                colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
                style={styles.iconContainer}
              >
                <Icon name="person-add" size={42} color={COLORS.primary} />
              </LinearGradient> */}
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
              <Text style={styles.title}>Get Started on Showa</Text>
              <Text style={styles.subtitle}>Create an account to connect with friends and communities of people who share your interests.</Text>
            </View>

            <View style={styles.formContainer}>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *   ( First name and Surname )</Text>
                <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                  <Icon name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.name}
                    placeholder="Enter your first name and surname"
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
                <Text style={styles.inputLabel}>Username *</Text>
                <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
                  <Icon name="at-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.username}
                    placeholder="Choose a username"
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
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={[
                  styles.inputWrapper, 
                  errors.email && styles.inputError,
                  isFieldReadonly('email') && styles.verifiedInput
                ]}>
                  <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.email}
                    placeholder="Enter your email"
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
                </View>
                {isFieldReadonly('email') && (
                  <Text style={styles.verifiedText}>✓ Email verified</Text>
                )}
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <View style={[
                  styles.inputWrapper, 
                  errors.phone && styles.inputError,
                  isFieldReadonly('phone') && styles.verifiedInput
                ]}>
                  <Icon name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.phone}
                    placeholder="Enter your phone number"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputs.password.current?.focus()}
                    editable={!loading && !isFieldReadonly('phone')}
                  />
                </View>
                {isFieldReadonly('phone') && (
                  <Text style={styles.verifiedText}> Phone number verified</Text>
                )}
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password *</Text>
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.password}
                    placeholder="Create a password (min 6 characters)"
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
                <Text style={styles.inputLabel}>Confirm Password *</Text>
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={inputs.confirmPassword}
                    placeholder="Confirm your password"
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
                style={[styles.registerButton, (!isFormValid || loading) && styles.buttonDisabled]}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Confirmation View
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={handleEditDetails} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <LinearGradient
              colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
              style={styles.iconContainer}
            >
              <Icon name="checkmark-circle" size={42} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.title}>Confirm Details</Text>
            <Text style={styles.subtitle}>Please verify your information</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Profile Picture Preview */}
            

            <View style={styles.confirmationCard}>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Name</Text>
                <Text style={styles.confirmationValue}>{formData.name}</Text>
              </View>
              
              <View style={styles.confirmationDivider} />
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Username</Text>
                <Text style={styles.confirmationValue}>@{formData.username}</Text>
              </View>
              
              <View style={styles.confirmationDivider} />
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Email</Text>
                <Text style={styles.confirmationValue}>{formData.email}</Text>
              </View>
              
              <View style={styles.confirmationDivider} />
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Phone</Text>
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
                <Text style={styles.editButtonText}>EDIT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRegister}
                style={[styles.confirmButton, loading && styles.buttonDisabled]}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.confirmButtonText}>SIGN UP</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  logoImage: {
    width: 60,
    height: 60,
    tintColor: '#fff',
  },
  
    
    logoWrapper: {
      marginTop:-20,
      marginBottom: 20,
      shadowColor: '#0066FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    logoGradient: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    height: 56,
  },
  verifiedInput: {
    backgroundColor: COLORS.verifiedBg,
    borderColor: COLORS.verifiedBorder,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    paddingLeft: 4,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 12,
    marginTop: 6,
    paddingLeft: 4,
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  },
  buttonIcon: {
    marginLeft: 8,
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
    elevation: 4,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  confirmationLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmationValue: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmationDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
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
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  termsErrorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 34,
  },
});