
// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TextInput,
// //   TouchableOpacity,
// //   ScrollView,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Alert,
// //   StatusBar,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import Iconn from 'react-native-vector-icons/Ionicons';

// // const SignupScreen = ({ navigation }) => {
// //   const [formData, setFormData] = useState({
// //     fullName: '',
// //     email: '',
// //     phone: '',
// //     password: '',
// //     confirmPassword: '',
// //   });
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);

// //   const handleSignup = async () => {
// //     const { fullName, email, phone, password, confirmPassword } = formData;
    
// //     if (!fullName || !email || !phone || !password || !confirmPassword) {
// //       Alert.alert('Error', 'Please fill in all fields');
// //       return;
// //     }

// //     if (!/\S+@\S+\.\S+/.test(email)) {
// //       Alert.alert('Error', 'Please enter a valid email address');
// //       return;
// //     }

// //     if (password !== confirmPassword) {
// //       Alert.alert('Error', 'Passwords do not match');
// //       return;
// //     }

// //     if (password.length < 6) {
// //       Alert.alert('Error', 'Password must be at least 6 characters');
// //       return;
// //     }

// //     setIsLoading(true);
    
// //     // Simulate API call
// //     setTimeout(() => {
// //       setIsLoading(false);
// //       navigation.replace('Main');
// //     }, 1500);
// //   };

// //   const handleSocialSignup = (provider) => {
// //     Alert.alert('Coming Soon', `${provider} sign up will be available soon`);
// //   };

// //   const updateFormData = (field, value) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: value
// //     }));
// //   };

// //   return (
// //     <KeyboardAvoidingView 
// //       style={styles.container}
// //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //     >
// //       <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
// //       <ScrollView 
// //         contentContainerStyle={styles.scrollContent}
// //         showsVerticalScrollIndicator={false}
// //         keyboardShouldPersistTaps="handled"
// //       >
// //         {/* Header */}
// //         <View style={styles.header}>
// //           <TouchableOpacity 
// //             style={styles.backButton}
// //             onPress={() => navigation.goBack()}
// //             disabled={isLoading}
// //           >
// //             <Icon name="arrow-back" size={24} color="#24ad0cff" />
// //           </TouchableOpacity>
// //           <View style={styles.logoContainer}>
// //             <Icon name="security" size={48} color="#39FF14" />
// //           </View>
// //           <Text style={styles.title}>Create Account</Text>
// //           <Text style={styles.subtitle}>Join our community today</Text>
// //         </View>

// //         {/* Social Signup Options */}
// //         <View style={styles.socialContainer}>
// //           <TouchableOpacity 
// //             style={styles.socialButton}
// //             onPress={() => handleSocialSignup('Google')}
// //             disabled={isLoading}
// //           >
            
// //             <View style={styles.socialIconContainer}>
// //               <Iconn name="logo-google" size={20} color="#FFFFFF" />
// //             </View>
// //             <Text style={styles.socialButtonText}>Continue with Google</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Divider */}
// //         <View style={styles.divider}>
// //           <View style={styles.dividerLine} />
// //           <Text style={styles.dividerText}>OR SIGN UP WITH EMAIL</Text>
// //           <View style={styles.dividerLine} />
// //         </View>

// //         {/* Form */}
// //         <View style={styles.form}>
// //           <View style={styles.inputContainer}>
// //             <Icon name="person" size={22} color="#666666" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Full Name"
// //               placeholderTextColor="#666666"
// //               value={formData.fullName}
// //               onChangeText={(text) => updateFormData('fullName', text)}
// //               autoComplete="name"
// //               editable={!isLoading}
// //             />
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Icon name="email" size={22} color="#666666" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Email Address"
// //               placeholderTextColor="#666666"
// //               value={formData.email}
// //               onChangeText={(text) => updateFormData('email', text)}
// //               keyboardType="email-address"
// //               autoCapitalize="none"
// //               autoComplete="email"
// //               editable={!isLoading}
// //             />
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Icon name="phone" size={22} color="#666666" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Phone Number"
// //               placeholderTextColor="#666666"
// //               value={formData.phone}
// //               onChangeText={(text) => updateFormData('phone', text)}
// //               keyboardType="phone-pad"
// //               autoComplete="tel"
// //               editable={!isLoading}
// //             />
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Icon name="lock" size={22} color="#666666" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Password"
// //               placeholderTextColor="#666666"
// //               value={formData.password}
// //               onChangeText={(text) => updateFormData('password', text)}
// //               secureTextEntry={!showPassword}
// //               autoComplete="password-new"
// //               editable={!isLoading}
// //             />
// //             <TouchableOpacity 
// //               onPress={() => setShowPassword(!showPassword)}
// //               style={styles.eyeIcon}
// //               disabled={isLoading}
// //             >
// //               <Icon 
// //                 name={showPassword ? "visibility" : "visibility-off"} 
// //                 size={22} 
// //                 color="#666666" 
// //               />
// //             </TouchableOpacity>
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Icon name="lock-outline" size={22} color="#666666" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Confirm Password"
// //               placeholderTextColor="#666666"
// //               value={formData.confirmPassword}
// //               onChangeText={(text) => updateFormData('confirmPassword', text)}
// //               secureTextEntry={!showConfirmPassword}
// //               autoComplete="password-new"
// //               editable={!isLoading}
// //             />
// //             <TouchableOpacity 
// //               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
// //               style={styles.eyeIcon}
// //               disabled={isLoading}
// //             >
// //               <Icon 
// //                 name={showConfirmPassword ? "visibility" : "visibility-off"} 
// //                 size={22} 
// //                 color="#666666" 
// //               />
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity 
// //             style={[
// //               styles.signupButton,
// //               isLoading && styles.signupButtonDisabled
// //             ]} 
// //             onPress={handleSignup}
// //             disabled={isLoading}
// //           >
// //             {isLoading ? (
// //               <View style={styles.loadingContainer}>
// //                 <Text style={styles.signupButtonText}>Creating Account...</Text>
// //               </View>
// //             ) : (
// //               <>
// //                 <Text style={styles.signupButtonText}>Create Account</Text>
// //                 <Icon name="person-add" size={20} color="#000000" />
// //               </>
// //             )}
// //           </TouchableOpacity>
// //         </View>

// //         {/* Terms */}
// //         <View style={styles.termsContainer}>
// //           <Text style={styles.termsText}>
// //             By creating an account, you agree to our{' '}
// //             <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
// //             <Text style={styles.termsLink}>Privacy Policy</Text>
// //           </Text>
// //         </View>

// //         {/* Login Link */}
// //         <View style={styles.loginContainer}>
// //           <Text style={styles.loginText}>Already have an account? </Text>
// //           <TouchableOpacity 
// //             onPress={() => navigation.navigate('AiLogin')}
// //             disabled={isLoading}
// //           >
// //             <Text style={styles.loginLink}>Sign In</Text>
// //           </TouchableOpacity>
// //         </View>

// //       </ScrollView>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#000000',
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //     justifyContent: 'center',
// //     paddingHorizontal: 24,
// //     paddingVertical: 40,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     marginBottom: 32,
// //   },
// //   backButton: {
// //     position: 'absolute',
// //     left: 0,
// //     top: 0,
// //     padding: 8,
// //     zIndex: 1,
// //   },
// //   logoContainer: {
// //     width: 80,
// //     height: 80,
// //     backgroundColor: '#111111',
// //     borderRadius: 24,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: '#1a1a1a',
// //   },
// //   title: {
// //     fontSize: 32,
// //     fontWeight: '700',
// //     color: '#FFFFFF',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //     letterSpacing: -0.5,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#888888',
// //     textAlign: 'center',
// //     lineHeight: 22,
// //   },
// //   socialContainer: {
// //     marginBottom: 24,
// //     gap: 12,
// //   },
// //   socialButton: {
// //     flexDirection: 'row',
// //     backgroundColor: '#111111',
// //     padding: 16,
// //     borderRadius: 16,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderWidth: 1,
// //     borderColor: '#222222',
// //   },
// //   socialIconContainer: {
// //     marginRight: 12,
// //   },
// //   socialButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 15,
// //     fontWeight: '600',
// //   },
// //   divider: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 24,
// //   },
// //   dividerLine: {
// //     flex: 1,
// //     height: 1,
// //     backgroundColor: '#222222',
// //   },
// //   dividerText: {
// //     color: '#666666',
// //     paddingHorizontal: 16,
// //     fontSize: 12,
// //     fontWeight: '600',
// //     letterSpacing: 0.5,
// //   },
// //   form: {
// //     marginBottom: 24,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#111111',
// //     borderRadius: 16,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: '#222222',
// //   },
// //   inputIcon: {
// //     padding: 16,
// //   },
// //   input: {
// //     flex: 1,
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //     paddingVertical: 16,
// //     paddingRight: 16,
// //     fontWeight: '500',
// //   },
// //   eyeIcon: {
// //     padding: 16,
// //   },
// //   signupButton: {
// //     flexDirection: 'row',
// //     backgroundColor: '#24ad0cff',
// //     padding: 18,
// //     borderRadius: 16,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginTop: 8,
// //     shadowColor: '#24ad0cff',
// //     shadowOffset: { width: 0, height: 8 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 16,
// //     elevation: 8,
// //   },
// //   signupButtonDisabled: {
// //     opacity: 0.7,
// //   },
// //   signupButtonText: {
// //     color: '#000000',
// //     fontSize: 17,
// //     fontWeight: '700',
// //     marginRight: 8,
// //   },
// //   loadingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   termsContainer: {
// //     marginBottom: 24,
// //     paddingHorizontal: 16,
// //   },
// //   termsText: {
// //     color: '#888888',
// //     fontSize: 13,
// //     textAlign: 'center',
// //     lineHeight: 18,
// //   },
// //   termsLink: {
// //     color: '#24ad0cff',
// //     fontWeight: '600',
// //   },
// //   loginContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 24,
// //   },
// //   loginText: {
// //     color: '#888888',
// //     fontSize: 15,
// //   },
// //   loginLink: {
// //     color: '#24ad0cff',
// //     fontSize: 15,
// //     fontWeight: '700',
// //   },
// //   securityNotice: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 16,
// //   },
// //   securityText: {
// //     color: '#666666',
// //     fontSize: 12,
// //     marginLeft: 8,
// //     fontWeight: '500',
// //   },
// // });

// // export default SignupScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   StatusBar,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Iconn from 'react-native-vector-icons/Ionicons';

// const API_BASE_URL = 'http://192.168.43.73:8000/api'; 

// const SignupScreen = ({ navigation }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSignup = async () => {
//     const { username, email, phone, password, confirmPassword } = formData;
    
//     if (!username || !email || !phone || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email address');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: username,
//           email: email,
//           phone: phone,
//           password: password,
//           password_confirm: confirmPassword,
//           first_name: username.split(' ')[0] || '',
//           last_name: username.split(' ')[1] || '',
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Save tokens and user data
//         // You might want to use AsyncStorage or Context for this
//         console.log('Registration successful:', data);
        
//         Alert.alert('Success', 'Account created successfully!', [
//           { text: 'OK', onPress: () => navigation.replace('AiLogin') }
//         ]);
//       } else {
//         // Handle errors from backend
//         const errorMessage = data.email?.[0] || data.username?.[0] || data.password?.[0] || 'Registration failed';
//         Alert.alert('Error', errorMessage);
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       Alert.alert('Error', 'Network error. Please check your connection.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSocialSignup = (provider) => {
//     Alert.alert('Coming Soon', `${provider} sign up will be available soon`);
//   };

//   const updateFormData = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//             disabled={isLoading}
//           >
//             <Icon name="arrow-back" size={24} color="#39FF14" />
//           </TouchableOpacity>
//           <View style={styles.logoContainer}>
//             <Icon name="analytics" size={48} color="#39FF14" />
//           </View>
//           <Text style={styles.title}>Join </Text>
//           {/* <Text style={styles.title}>Join BetScan</Text> */}
//           <Text style={styles.subtitle}>Smart betting starts here</Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           <View style={styles.inputContainer}>
//             <Icon name="person" size={22} color="#666666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Username"
//               placeholderTextColor="#666666"
//               value={formData.username}
//               onChangeText={(text) => updateFormData('username', text)}
//               autoComplete="username"
//               editable={!isLoading}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="email" size={22} color="#666666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email Address"
//               placeholderTextColor="#666666"
//               value={formData.email}
//               onChangeText={(text) => updateFormData('email', text)}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoComplete="email"
//               editable={!isLoading}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="phone" size={22} color="#666666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               placeholderTextColor="#666666"
//               value={formData.phone}
//               onChangeText={(text) => updateFormData('phone', text)}
//               keyboardType="phone-pad"
//               autoComplete="tel"
//               editable={!isLoading}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="lock" size={22} color="#666666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#666666"
//               value={formData.password}
//               onChangeText={(text) => updateFormData('password', text)}
//               secureTextEntry={!showPassword}
//               autoComplete="password-new"
//               editable={!isLoading}
//             />
//             <TouchableOpacity 
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.eyeIcon}
//               disabled={isLoading}
//             >
//               <Icon 
//                 name={showPassword ? "visibility" : "visibility-off"} 
//                 size={22} 
//                 color="#666666" 
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="lock-outline" size={22} color="#666666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Confirm Password"
//               placeholderTextColor="#666666"
//               value={formData.confirmPassword}
//               onChangeText={(text) => updateFormData('confirmPassword', text)}
//               secureTextEntry={!showConfirmPassword}
//               autoComplete="password-new"
//               editable={!isLoading}
//             />
//             <TouchableOpacity 
//               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               style={styles.eyeIcon}
//               disabled={isLoading}
//             >
//               <Icon 
//                 name={showConfirmPassword ? "visibility" : "visibility-off"} 
//                 size={22} 
//                 color="#666666" 
//               />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity 
//             style={[
//               styles.signupButton,
//               isLoading && styles.signupButtonDisabled
//             ]} 
//             onPress={handleSignup}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#000000" />
//             ) : (
//               <>
//                 <Text style={styles.signupButtonText}>Create Account</Text>
//                 <Icon name="person-add" size={20} color="#000000" />
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Terms */}
//         <View style={styles.termsContainer}>
//           <Text style={styles.termsText}>
//             By creating an account, you agree to our{' '}
//             <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
//             <Text style={styles.termsLink}>Privacy Policy</Text>
//           </Text>
//         </View>

//         {/* Login Link */}
//         <View style={styles.loginContainer}>
//           <Text style={styles.loginText}>Already have an account? </Text>
//           <TouchableOpacity 
//             onPress={() => navigation.navigate('AiLogin')}
//             disabled={isLoading}
//           >
//             <Text style={styles.loginLink}>Sign In</Text>
//           </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 40,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   backButton: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     padding: 8,
//     zIndex: 1,
//   },
//   logoContainer: {
//     width: 80,
//     height: 80,
//     backgroundColor: '#111111',
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#1a1a1a',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 8,
//     textAlign: 'center',
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#888888',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   socialContainer: {
//     marginBottom: 24,
//     gap: 12,
//   },
//   socialButton: {
//     flexDirection: 'row',
//     backgroundColor: '#111111',
//     padding: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   socialIconContainer: {
//     marginRight: 12,
//   },
//   socialButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#222222',
//   },
//   dividerText: {
//     color: '#666666',
//     paddingHorizontal: 16,
//     fontSize: 12,
//     fontWeight: '600',
//     letterSpacing: 0.5,
//   },
//   form: {
//     marginBottom: 24,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#111111',
//     borderRadius: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   inputIcon: {
//     padding: 16,
//   },
//   input: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 16,
//     paddingVertical: 16,
//     paddingRight: 16,
//     fontWeight: '500',
//   },
//   eyeIcon: {
//     padding: 16,
//   },
//   signupButton: {
//     flexDirection: 'row',
//     backgroundColor: '#24ad0cff',
//     padding: 18,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//     shadowColor: '#24ad0cff',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   signupButtonDisabled: {
//     opacity: 0.7,
//   },
//   signupButtonText: {
//     color: '#000000',
//     fontSize: 17,
//     fontWeight: '700',
//     marginRight: 8,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   termsContainer: {
//     marginBottom: 24,
//     paddingHorizontal: 16,
//   },
//   termsText: {
//     color: '#888888',
//     fontSize: 13,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   termsLink: {
//     color: '#24ad0cff',
//     fontWeight: '600',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   loginText: {
//     color: '#888888',
//     fontSize: 15,
//   },
//   loginLink: {
//     color: '#24ad0cff',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   securityNotice: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   securityText: {
//     color: '#666666',
//     fontSize: 12,
//     marginLeft: 8,
//     fontWeight: '500',
//   },
// });

// export default SignupScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconn from 'react-native-vector-icons/Ionicons';

const API_BASE_URL = 'http://192.168.43.73:8000/api'; 

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const handleSignup = async () => {
    // Clear previous errors
    setErrors({ username: '', email: '', phone: '', password: '', confirmPassword: '', general: '' });

    const { username, email, phone, password, confirmPassword } = formData;
    
    // Frontend validation
    if (!username || !email || !phone || !password || !confirmPassword) {
      setErrors({
        general: 'Please fill in all fields'
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({
        email: 'Please enter a valid email address'
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: 'Passwords do not match'
      });
      return;
    }

    if (password.length < 6) {
      setErrors({
        password: 'Password must be at least 6 characters'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          phone: phone,
          password: password,
          password_confirm: confirmPassword,
          first_name: username.split(' ')[0] || '',
          last_name: username.split(' ')[1] || '',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.replace('AiLogin') }
        ]);
      } else {
        // Enhanced error handling for backend errors
        const newErrors = { 
          username: '', 
          email: '', 
          phone: '', 
          password: '', 
          confirmPassword: '', 
          general: '' 
        };
        
        // Handle specific field errors from backend
        if (data.username) {
          newErrors.username = Array.isArray(data.username) ? data.username[0] : data.username;
        }
        if (data.email) {
          newErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
        }
        if (data.phone) {
          newErrors.phone = Array.isArray(data.phone) ? data.phone[0] : data.phone;
        }
        if (data.password) {
          newErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
        }
        if (data.password_confirm) {
          newErrors.confirmPassword = Array.isArray(data.password_confirm) ? data.password_confirm[0] : data.password_confirm;
        }
        if (data.non_field_errors) {
          newErrors.general = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        }
        if (data.detail) {
          newErrors.general = data.detail;
        }
        
        // If no specific field errors but general error exists
        if (!newErrors.username && !newErrors.email && !newErrors.phone && 
            !newErrors.password && !newErrors.confirmPassword && !newErrors.general) {
          // Fallback: show first error found
          const errorKeys = Object.keys(data);
          if (errorKeys.length > 0) {
            const firstError = data[errorKeys[0]];
            newErrors.general = Array.isArray(firstError) ? firstError[0] : firstError;
          } else {
            newErrors.general = 'Registration failed. Please try again.';
          }
        }
        
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: 'Network error. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    Alert.alert('Coming Soon', `${provider} sign up will be available soon`);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Icon name="arrow-back" size={24} color="#39FF14" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Icon name="analytics" size={48} color="#39FF14" />
          </View>
          <Text style={styles.title}>Create Account </Text>
          <Text style={styles.subtitle}>Smart betting starts here</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Username Input */}
          <View style={styles.inputWrapper}>
            <View style={[
              styles.inputContainer,
              errors.username && styles.inputContainerError
            ]}>
              <Icon name="person" size={22} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#666666"
                value={formData.username}
                onChangeText={(text) => updateFormData('username', text)}
                autoComplete="username"
                editable={!isLoading}
              />
            </View>
            {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <View style={[
              styles.inputContainer,
              errors.email && styles.inputContainerError
            ]}>
              <Icon name="email" size={22} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#666666"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Phone Input */}
          <View style={styles.inputWrapper}>
            <View style={[
              styles.inputContainer,
              errors.phone && styles.inputContainerError
            ]}>
              <Icon name="phone" size={22} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#666666"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType="phone-pad"
                autoComplete="tel"
                editable={!isLoading}
              />
            </View>
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View style={[
              styles.inputContainer,
              errors.password && styles.inputContainerError
            ]}>
              <Icon name="lock" size={22} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666666"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <Icon 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={22} 
                  color="#666666" 
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <View style={[
              styles.inputContainer,
              errors.confirmPassword && styles.inputContainerError
            ]}>
              <Icon name="lock-outline" size={22} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#666666"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <Icon 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={22} 
                  color="#666666" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          {/* General Error */}
          {errors.general ? (
            <View style={styles.generalErrorContainer}>
              <Icon name="error" size={18} color="#FF4444" />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={[
              styles.signupButton,
              isLoading && styles.signupButtonDisabled
            ]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Text style={styles.signupButtonText}>Create Account</Text>
                <Icon name="person-add" size={20} color="#000000" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AiLogin')}
            disabled={isLoading}
          >
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#111111',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
  },
  socialContainer: {
    marginBottom: 24,
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  socialIconContainer: {
    marginRight: 12,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#222222',
  },
  dividerText: {
    color: '#666666',
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  form: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  inputContainerError: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  inputIcon: {
    padding: 16,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 16,
    paddingRight: 16,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 16,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 16,
    fontWeight: '500',
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A0000',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  generalErrorText: {
    color: '#FF4444',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  signupButton: {
    flexDirection: 'row',
    backgroundColor: '#24ad0cff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#24ad0cff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  termsText: {
    color: '#888888',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#24ad0cff',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginText: {
    color: '#888888',
    fontSize: 15,
  },
  loginLink: {
    color: '#24ad0cff',
    fontSize: 15,
    fontWeight: '700',
  },
  securityNotice: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  securityText: {
    color: '#666666',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default SignupScreen;

