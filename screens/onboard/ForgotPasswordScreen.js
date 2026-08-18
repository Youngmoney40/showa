import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext';

const ForgetPasswordScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  // Step management
  const [step, setStep] = useState(1); // 1: Request, 2: Verify OTP, 3: Reset Password
  
  // Form states
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  // Refs
  const otpInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  
  // Timer for OTP resend
  React.useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ===== STEP 1: Request Password Reset =====
  const handleRequestReset = async () => {
    if (!identifier || identifier.trim().length < 3) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_ROUTE}/password-reset/request/`, {
        identifier: identifier.trim()
      });

      if (response.data.success) {
        Alert.alert(
          'Reset Code Sent',
          'If your account exists, you will receive a reset code via email or SMS.',
          [{ text: 'OK' }]
        );
        // Move to OTP verification step
        setStep(2);
        setTimer(60); // Start 60 second timer for resend
        setCanResend(false);
        
        // Store user_id if provided (for debugging)
        if (response.data.user_id) {
          setUserId(response.data.user_id);
        }
      }
    } catch (error) {
      console.error('Reset request error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to send reset code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 2: Verify OTP =====
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit reset code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_ROUTE}/password-reset/verify-otp/`, {
        identifier: identifier.trim(),
        otp: otp
      });

      if (response.data.success) {
        setResetToken(response.data.reset_token);
        setUserId(response.data.user_id);
        setStep(3);
        Alert.alert('Success', 'Code verified! Please set your new password.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Invalid reset code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 3: Reset Password =====
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_ROUTE}/password-reset/reset/`, {
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully! You can now login.',
          [
            { 
              text: 'Go to Login',
              onPress: () => navigation.navigate('EmailLogin')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== Resend OTP =====
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_ROUTE}/password-reset/request/`, {
        identifier: identifier.trim()
      });

      if (response.data.success) {
        Alert.alert('Success', 'A new reset code has been sent.');
        setTimer(60);
        setCanResend(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Render Step 1: Request Reset =====
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="lock-reset" size={60} color={colors.primary} />
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>
        Forgot Password?
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter your email or phone number and we'll send you a reset code.
      </Text>

      <View style={[styles.inputContainer, { 
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }]}>
        <Icon name="mail-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Email or Phone Number"
          placeholderTextColor={colors.textTertiary}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          keyboardType={identifier.includes('@') ? 'email-address' : 'phone-pad'}
          returnKeyType="done"
          onSubmitEditing={handleRequestReset}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleRequestReset}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backToLogin}
        onPress={() => navigation.navigate('EmailLogin')}
      >
        <Icon name="arrow-back" size={18} color={colors.primary} />
        <Text style={[styles.backToLoginText, { color: colors.primary }]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ===== Render Step 2: Verify OTP =====
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="verified" size={60} color={colors.primary} />
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>
        Verify Reset Code
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter the 6-digit code sent to your {identifier.includes('@') ? 'email' : 'phone'}.
      </Text>

      <View style={[styles.inputContainer, { 
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }]}>
        <Icon name="key-outline" size={20} color={colors.textSecondary} />
        <TextInput
          ref={otpInputRef}
          style={[styles.input, styles.otpInput, { color: colors.text }]}
          placeholder="Enter 6-digit code"
          placeholderTextColor={colors.textTertiary}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          returnKeyType="done"
          onSubmitEditing={handleVerifyOTP}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleVerifyOTP}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={[styles.resendText, { color: colors.textSecondary }]}>
          Didn't receive the code?
        </Text>
        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={!canResend || loading}
        >
          <Text style={[
            styles.resendButton,
            { 
              color: canResend ? colors.primary : colors.textTertiary,
              opacity: canResend ? 1 : 0.5
            }
          ]}>
            {canResend ? 'Resend Code' : `Resend in ${timer}s`}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backToLogin}
        onPress={() => setStep(1)}
      >
        <Icon name="arrow-back" size={18} color={colors.textSecondary} />
        <Text style={[styles.backToLoginText, { color: colors.textSecondary }]}>
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ===== Render Step 3: Reset Password =====
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="password" size={60} color={colors.primary} />
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>
        Reset Password
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter your new password below.
      </Text>

      <View style={[styles.inputContainer, { 
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }]}>
        <Icon name="lock-closed-outline" size={20} color={colors.textSecondary} />
        <TextInput
          ref={passwordInputRef}
          style={[styles.input, { color: colors.text }]}
          placeholder="New Password"
          placeholderTextColor={colors.textTertiary}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
        />
      </View>

      <View style={[styles.inputContainer, { 
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }]}>
        <Icon name="lock-closed-outline" size={20} color={colors.textSecondary} />
        <TextInput
          ref={confirmPasswordInputRef}
          style={[styles.input, { color: colors.text }]}
          placeholder="Confirm Password"
          placeholderTextColor={colors.textTertiary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleResetPassword}
        />
      </View>

      {newPassword.length > 0 && newPassword.length < 6 && (
        <Text style={[styles.passwordHint, { color: '#FF3B30' }]}>
          Password must be at least 6 characters
        </Text>
      )}

      {newPassword.length >= 6 && confirmPassword.length > 0 && newPassword !== confirmPassword && (
        <Text style={[styles.passwordHint, { color: '#FF3B30' }]}>
          Passwords do not match
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.button, 
          { 
            backgroundColor: newPassword.length >= 6 && newPassword === confirmPassword 
              ? colors.primary 
              : colors.textTertiary 
          }
        ]}
        onPress={handleResetPassword}
        disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backToLogin}
        onPress={() => navigation.navigate('EmailLogin')}
      >
        <Icon name="arrow-back" size={18} color={colors.primary} />
        <Text style={[styles.backToLoginText, { color: colors.primary }]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step Progress Indicator */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={styles.progressItem}>
                <View style={[
                  styles.progressDot,
                  { 
                    backgroundColor: s === step ? colors.primary : 
                                   s < step ? '#4CAF50' : colors.border,
                    borderColor: s === step ? colors.primary : colors.border,
                  }
                ]}>
                  {s < step ? (
                    <Icon name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={[
                      styles.progressDotText,
                      { color: s === step ? '#fff' : colors.textSecondary }
                    ]}>
                      {s}
                    </Text>
                  )}
                </View>
                {s < 3 && (
                  <View style={[
                    styles.progressLine,
                    { 
                      backgroundColor: s < step ? '#4CAF50' : colors.border 
                    }
                  ]} />
                )}
              </View>
            ))}
          </View>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 30,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  progressDotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    marginLeft: 12,
  },
  otpInput: {
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
  },
  resendButton: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  passwordHint: {
    fontSize: 13,
    alignSelf: 'flex-start',
    marginTop: -8,
    marginBottom: 12,
  },
});

export default ForgetPasswordScreen;