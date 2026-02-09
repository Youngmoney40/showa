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
//   StatusBar,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const API_BASE_URL = 'http://192.168.43.73:8000/api';

// const ResetPasswordScreen = ({ navigation, route }) => {
//   const [formData, setFormData] = useState({
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({
//     password: '',
//     confirmPassword: '',
//     general: ''
//   });

//   const email = route.params?.email || '';

//   const handleResetPassword = async () => {
//     // Clear previous errors
//     setErrors({ password: '', confirmPassword: '', general: '' });

//     const { password, confirmPassword } = formData;

//     // Validation
//     if (!password || !confirmPassword) {
//       setErrors({
//         general: 'Please fill in all fields'
//       });
//       return;
//     }

//     if (password.length < 6) {
//       setErrors({
//         password: 'Password must be at least 6 characters'
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       setErrors({
//         confirmPassword: 'Passwords do not match'
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Note: You'll need to implement this endpoint in your backend
//       // This is a simplified version - you'll need token/uid from the reset link
//       const response = await fetch(`${API_BASE_URL}/auth/password/reset/confirm/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//           password_confirm: confirmPassword,
//           // You'll need to add token and uid here from the reset link
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert(
//           'Password Reset',
//           'Your password has been reset successfully!',
//           [
//             { 
//               text: 'OK', 
//               onPress: () => navigation.replace('AiLogin') 
//             }
//           ]
//         );
//       } else {
//         const newErrors = { password: '', confirmPassword: '', general: '' };
        
//         if (data.password) {
//           newErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
//         } else if (data.password_confirm) {
//           newErrors.confirmPassword = Array.isArray(data.password_confirm) ? data.password_confirm[0] : data.password_confirm;
//         } else if (data.detail) {
//           newErrors.general = data.detail;
//         } else if (data.non_field_errors) {
//           newErrors.general = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
//         } else {
//           newErrors.general = 'Failed to reset password. Please try again.';
//         }
        
//         setErrors(newErrors);
//       }
//     } catch (error) {
//       console.error('Reset password error:', error);
//       setErrors({
//         general: 'Network error. Please check your connection.'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateFormData = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
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
//             <Icon name="lock-open" size={48} color="#39FF14" />
//           </View>
//           <Text style={styles.title}>New Password</Text>
//           <Text style={styles.subtitle}>
//             Create a new password for your account
//           </Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           {/* Password Input */}
//           <View style={styles.inputWrapper}>
//             <View style={[
//               styles.inputContainer,
//               errors.password && styles.inputContainerError
//             ]}>
//               <Icon name="lock" size={22} color="#666666" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="New Password"
//                 placeholderTextColor="#666666"
//                 value={formData.password}
//                 onChangeText={(text) => updateFormData('password', text)}
//                 secureTextEntry={!showPassword}
//                 autoComplete="password-new"
//                 editable={!isLoading}
//               />
//               <TouchableOpacity 
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.eyeIcon}
//                 disabled={isLoading}
//               >
//                 <Icon 
//                   name={showPassword ? "visibility" : "visibility-off"} 
//                   size={22} 
//                   color="#666666" 
//                 />
//               </TouchableOpacity>
//             </View>
//             {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
//           </View>

//           {/* Confirm Password Input */}
//           <View style={styles.inputWrapper}>
//             <View style={[
//               styles.inputContainer,
//               errors.confirmPassword && styles.inputContainerError
//             ]}>
//               <Icon name="lock-outline" size={22} color="#666666" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm New Password"
//                 placeholderTextColor="#666666"
//                 value={formData.confirmPassword}
//                 onChangeText={(text) => updateFormData('confirmPassword', text)}
//                 secureTextEntry={!showConfirmPassword}
//                 autoComplete="password-new"
//                 editable={!isLoading}
//               />
//               <TouchableOpacity 
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                 style={styles.eyeIcon}
//                 disabled={isLoading}
//               >
//                 <Icon 
//                   name={showConfirmPassword ? "visibility" : "visibility-off"} 
//                   size={22} 
//                   color="#666666" 
//                 />
//               </TouchableOpacity>
//             </View>
//             {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
//           </View>

//           {/* General Error */}
//           {errors.general ? (
//             <View style={styles.generalErrorContainer}>
//               <Icon name="error" size={18} color="#FF4444" />
//               <Text style={styles.generalErrorText}>{errors.general}</Text>
//             </View>
//           ) : null}

//           <TouchableOpacity 
//             style={[
//               styles.resetButton,
//               isLoading && styles.resetButtonDisabled
//             ]} 
//             onPress={handleResetPassword}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#000000" />
//             ) : (
//               <>
//                 <Text style={styles.resetButtonText}>Reset Password</Text>
//                 <Icon name="check-circle" size={20} color="#000000" />
//               </>
//             )}
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
//     marginBottom: 48,
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
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#1a1a1a',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 16,
//     textAlign: 'center',
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#888888',
//     textAlign: 'center',
//     lineHeight: 22,
//     paddingHorizontal: 20,
//   },
//   form: {
//     marginBottom: 32,
//   },
//   inputWrapper: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#111111',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   inputContainerError: {
//     borderColor: '#FF4444',
//     borderWidth: 1,
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
//   errorText: {
//     color: '#FF4444',
//     fontSize: 14,
//     marginTop: 8,
//     marginLeft: 16,
//     fontWeight: '500',
//   },
//   generalErrorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2A0000',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#FF4444',
//   },
//   generalErrorText: {
//     color: '#FF4444',
//     fontSize: 14,
//     marginLeft: 8,
//     fontWeight: '500',
//     flex: 1,
//   },
//   resetButton: {
//     flexDirection: 'row',
//     backgroundColor: '#24ad0cff',
//     padding: 18,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#24ad0cff',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   resetButtonDisabled: {
//     opacity: 0.7,
//   },
//   resetButtonText: {
//     color: '#000000',
//     fontSize: 17,
//     fontWeight: '700',
//     marginRight: 8,
//   },
// });

// export default ResetPasswordScreen;

// ResetPasswordScreen.js - Updated version
// ResetPasswordScreen.js - Updated for deep links
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://192.168.43.73:8000/api';

const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    general: ''
  });

  // Get parameters from deep link or navigation
  const { uid, token, email, fromDeepLink } = route.params || {};

  useEffect(() => {
    // If we have uid and token from deep link, show success message
    if (fromDeepLink && uid && token) {
      Alert.alert(
        'Reset Link Valid',
        'You can now set your new password.',
        [{ text: 'OK' }]
      );
    }
  }, [fromDeepLink, uid, token]);

  const handleResetPassword = async () => {
    // Clear previous errors
    setErrors({ password: '', confirmPassword: '', general: '' });

    const { password, confirmPassword } = formData;

    // Validation
    if (!password || !confirmPassword) {
      setErrors({
        general: 'Please fill in all fields'
      });
      return;
    }

    if (password.length < 6) {
      setErrors({
        password: 'Password must be at least 6 characters'
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: 'Passwords do not match'
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        password: password,
        password_confirm: confirmPassword,
      };

      // Priority: Use uid and token from deep link first
      if (uid && token) {
        requestData.uid = uid;
        requestData.token = token;
      }
      // Fallback: Use email from previous screen
      else if (email) {
        requestData.email = email;
      } else {
        setErrors({
          general: 'Missing reset information. Please request a new reset link.'
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/password/reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully!',
          [
            { 
              text: 'Sign In', 
              onPress: () => navigation.replace('AiLogin') 
            }
          ]
        );
      } else {
        const newErrors = { password: '', confirmPassword: '', general: '' };
        
        if (data.password) {
          newErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
        } else if (data.password_confirm) {
          newErrors.confirmPassword = Array.isArray(data.password_confirm) ? data.password_confirm[0] : data.password_confirm;
        } else if (data.detail) {
          newErrors.general = data.detail;
        } else if (data.non_field_errors) {
          newErrors.general = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        } else {
          newErrors.general = 'Failed to reset password. Please try again.';
        }
        
        setErrors(newErrors);
        
        // If token is invalid, suggest requesting new reset
        if (data.detail && data.detail.includes('expired') || data.detail.includes('invalid')) {
          Alert.alert(
            'Invalid Link',
            'This reset link is invalid or has expired. Please request a new one.',
            [
              { text: 'Request New Link', onPress: () => navigation.navigate('ForgotPassword') },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({
        general: 'Network error. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
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
            <Icon name="lock-open" size={48} color="#39FF14" />
          </View>
          <Text style={styles.title}>New Password</Text>
          <Text style={styles.subtitle}>
            {fromDeepLink ? 'Set your new password' : 'Create a new password for your account'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View style={[
              styles.inputContainer,
              errors.password && styles.inputContainerError
            ]}>
              <Icon name="lock" size={22} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
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
                placeholder="Confirm New Password"
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
              styles.resetButton,
              isLoading && styles.resetButtonDisabled
            ]} 
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Text style={styles.resetButtonText}>Reset Password</Text>
                <Icon name="check-circle" size={20} color="#000000" />
              </>
            )}
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
    marginBottom: 48,
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 20,
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
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#24ad0cff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#24ad0cff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default ResetPasswordScreen;