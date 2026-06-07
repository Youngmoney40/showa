import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

const COLORS = {
  primary: '#0d64dd',
  white: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#6c757d',
  border: '#e1e5eb',
  error: '#dc3545',
  success: '#28a745',
};

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(0);
  
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateOtp = () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit code' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePasswords = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!validateEmail()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_ROUTE}/forgot-pin/`, { email });
      if (response.status === 200) {
        Alert.alert('Success', 'OTP sent to your email');
        setStep(2);
        startTimer();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_ROUTE}/reset-pin/`, {
        email,
        otp,
        new_pin: newPassword,
      });
      
      if (response.status === 200) {
        Alert.alert(
          'Success',
          'Password reset successfully! Please login with your new password.',
          [{ text: 'OK', onPress: () => navigation.navigate('EmailLogin') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (!validatePasswords()) return;
    handleVerifyOtp();
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
            <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
              style={styles.iconContainer}
            >
              <Icon name="key-outline" size={42} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {step === 1 && "Enter your email to receive reset code"}
              {step === 2 && "Enter the verification code sent to your email"}
              {step === 3 && "Create your new password"}
            </Text>
          </View>

          {/* Step 1: Email */}
          {step === 1 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                  <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={emailInputRef}
                    placeholder="Enter your email"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({});
                    }}
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                    editable={!loading}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <TouchableOpacity
                onPress={handleSendOtp}
                style={[styles.button, loading && styles.buttonDisabled]}
                disabled={loading}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>Send Reset Code</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                <View style={[styles.inputWrapper, errors.otp && styles.inputError]}>
                  <Icon name="code-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    ref={otpInputRef}
                    placeholder="Enter 6-digit code"
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={(text) => {
                      setOtp(text);
                      if (errors.otp) setErrors({});
                    }}
                    returnKeyType="done"
                    onSubmitEditing={() => setStep(3)}
                    editable={!loading}
                  />
                </View>
                {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
              </View>

              <TouchableOpacity
                onPress={() => setStep(3)}
                style={[styles.button, loading && styles.buttonDisabled]}
                disabled={loading}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                </LinearGradient>
              </TouchableOpacity>

              {timer > 0 ? (
                <Text style={styles.timerText}>Resend code in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={[styles.inputWrapper, errors.newPassword && styles.inputError]}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter new password"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: null });
                    }}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Confirm new password"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                    }}
                    returnKeyType="done"
                    onSubmitEditing={handleResetPassword}
                    editable={!loading}
                  />
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              <TouchableOpacity
                onPress={handleResetPassword}
                style={[styles.button, loading && styles.buttonDisabled]}
                disabled={loading}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.buttonGradient}>
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
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
    marginBottom: 40,
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
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  timerText: {
    textAlign: 'center',
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  resendText: {
    textAlign: 'center',
    marginTop: 16,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});