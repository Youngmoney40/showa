
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
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  error: '#dc3545',
  success: '#28a745',
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export default function EmailLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => emailInputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_ROUTE}/email-login/`, {
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      if (response.status === 200 && response.data.success) {
        const { token, refresh, user, wallet } = response.data;
        
        await AsyncStorage.multiSet([
          ['userToken', token],
          ['refreshToken', refresh],
          ['userData', JSON.stringify(user)],
          ['isVerified', 'true'],
          ['userEmail', user.email],
          ['userId', user.id.toString()],
          ['loginMethod', 'email'],
        ]);
        
        
        navigation.replace('ProceedOptions');
      } else {
        Alert.alert('Login Failed', response.data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.status === 400 && error.response?.data?.login_method === 'phone') {
        Alert.alert(
          'Phone Account Detected',
          'This account uses phone number login. Please use "Continue with Phone" option.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Use Phone Login', 
              onPress: () => navigation.navigate('PhoneNumber') 
            }
          ]
        );
      } else {
        Alert.alert(
          'Login Error',
          error.response?.data?.error || 'Unable to login. Please check your credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Signin_two');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* <Icon name="arrow-back" size={24} color={COLORS.textPrimary} /> */}
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            {/* <LinearGradient
              colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
              style={styles.iconContainer}
            >
              <Icon name="mail" size={42} color={COLORS.primary} />
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
            <Text style={styles.title}>Log in to Showa</Text>
            <Text style={styles.subtitle}>Log in with your email and password</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={[styles.inputGroup,{marginTop:25}]}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  ref={emailInputRef}
                  placeholder="Enter your email"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  editable={!loading}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  ref={passwordInputRef}
                  placeholder="Enter your password"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={navigateToForgotPassword} style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <Icon name="log-in-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: SPACING.xxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  
  logoImage: {
    width: 60,
    height: 60,
    tintColor: '#fff',
  },
  
    
    logoWrapper: {
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
  inputLabel: {
    fontSize: 14,
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
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
    paddingLeft: SPACING.xs,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
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
    marginLeft: SPACING.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  phoneButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});