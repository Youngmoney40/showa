


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
  AppState,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import { API_ROUTE } from '../../api_routing/api';

// ─── Constants ──────────────────────────────────────────────────────────────
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
  background: '#f5f6fa',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

// ─── Network Status Modal ───────────────────────────────────────────────────
const NetworkStatusModal = ({ visible, message, onRetry, onCancel }) => (
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
        <Text style={styles.modalTitle}>Network Issue</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalCancelButton]} 
            onPress={onCancel}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalRetryButton]} 
            onPress={onRetry}
          >
            <Text style={styles.modalRetryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// ─── Network Error Types ────────────────────────────────────────────────────
class NetworkError extends Error {
  constructor(message, code, retryable = true) {
    super(message);
    this.code = code;
    this.retryable = retryable;
    this.name = 'NetworkError';
  }
}


// ─── FCM Service ────────────────────────────────────────────────────────────
// class FCMService {
//   static async getToken() {
//     try {
//       const token = await messaging().getToken();
//       console.log('📱 FCM Token:', token);
//       return token;
//     } catch (error) {
//       console.error('Failed to get FCM token:', error);
//       return null;
//     }
//   }

//   static async registerDevice(userId, userToken, retryCount = 0) {
//     const maxRetries = 3;
//     const baseDelay = 2000;

//     try {
//       const netState = await NetInfo.fetch();
//       if (!netState.isConnected) {
//         throw new NetworkError(
//           'No internet connection. Please check your network.',
//           'NO_NETWORK',
//           true
//         );
//       }

//       const registration_id = await this.getToken();
//       if (!registration_id) {
//         console.warn('No FCM token available - device registration skipped');
//         return { success: false, error: 'No FCM token' };
//       }

//       console.log(`📱 Registering device (attempt ${retryCount + 1}/${maxRetries + 1})`);

//       const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      
//       // Get device name
//       let deviceName = 'Unknown Device';
//       try {
//         const deviceInfo = await import('react-native-device-info');
//         const brand = deviceInfo.getBrand ? deviceInfo.getBrand() : '';
//         const model = deviceInfo.getModel ? deviceInfo.getModel() : '';
//         deviceName = brand && model ? `${brand} ${model}` : (brand || model || 'Unknown Device');
//       } catch {
//         deviceName = Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
//       }

//       const response = await axios.post(
//         `${API_ROUTE}/notifications/register-device/`,
//         {
//           registration_id: registration_id,
//           platform: platform,
//           device_name: deviceName,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//             'Content-Type': 'application/json',
//           },
//           timeout: 15000,
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         console.log('✅ Device registered successfully for FCM');
//         return { success: true, data: response.data };
//       }

//       return { success: false, error: `Server error: ${response.status}` };
      
//     } catch (error) {
//       console.error('Device registration failed (attempt', retryCount + 1, '):', error);

//       const isRetryable = this.isRetryableError(error);
      
//       if (isRetryable && retryCount < maxRetries) {
//         const delay = baseDelay * Math.pow(2, retryCount);
//         console.log(`Retrying in ${delay}ms...`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         return this.registerDevice(userId, userToken, retryCount + 1);
//       }

//       return {
//         success: false,
//         error: error.message || 'Device registration failed',
//         retryable: isRetryable,
//         permanent: !isRetryable,
//       };
//     }
//   }

//   static async checkDeviceRegistration(userToken) {
//     try {
//       const registration_id = await this.getToken();
//       if (!registration_id) {
//         return { isRegistered: false, error: 'No FCM token' };
//       }

//       const response = await axios.post(
//         `${API_ROUTE}/notifications/check-device/`,
//         {
//           registration_id: registration_id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       return {
//         isRegistered: response.data.is_registered,
//         isActive: response.data.is_active,
//         deviceId: response.data.device_id,
//       };
//     } catch (error) {
//       console.error('Failed to check device registration:', error);
//       return { isRegistered: false, error: error.message };
//     }
//   }

//   static isRetryableError(error) {
//     if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
//       return true;
//     }
//     if (error.response) {
//       if (error.response.status >= 500 && error.response.status < 600) {
//         return true;
//       }
//       if (error.response.status === 429) {
//         return true;
//       }
//     }
//     if (error.message?.includes('network')) {
//       return true;
//     }
//     return false;
//   }

//   static async requestPermissions() {
//     // Android 13+ (API 33) needs POST_NOTIFICATIONS permission
//     if (Platform.OS === 'android' && Platform.Version >= 33) {
//       try {
//         const { PermissionsAndroid } = require('react-native');
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (error) {
//         console.error('Failed to request notification permission:', error);
//         return false;
//       }
//     }
    
//     // iOS permission request
//     if (Platform.OS === 'ios') {
//       try {
//         const authStatus = await messaging().requestPermission();
//         const enabled = 
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//         console.log('iOS permission status:', authStatus);
//         return enabled;
//       } catch (error) {
//         console.error('iOS permission request failed:', error);
//         return false;
//       }
//     }
    
//     return true;
//   }

//   static async registerTokenRefreshListener() {
//     return messaging().onTokenRefresh(async (token) => {
//       console.log('🔄 FCM Token refreshed:', token);
//       try {
//         const userToken = await AsyncStorage.getItem('userToken');
//         const userId = await AsyncStorage.getItem('userId');
        
//         if (userToken && userId) {
//           console.log('User logged in, refreshing device registration');
//           await this.registerDevice(parseInt(userId), userToken);
//         } else {
//           console.log('User not logged in, skipping token refresh');
//         }
//       } catch (error) {
//         console.error('Failed to refresh FCM token registration:', error);
//       }
//     });
//   }
// }


// ─── FCM Service ────────────────────────────────────────────────────────────
class FCMService {
  static async getToken(retryCount = 0) {
    const maxRetries = 3;
    const delay = 2000 * Math.pow(2, retryCount);
    
    try {
      // Check if Google Play Services are available
      const isGooglePlayServicesAvailable = await this.checkGooglePlayServices();
      if (!isGooglePlayServicesAvailable) {
        console.warn('Google Play Services not available');
        return null;
      }

      const token = await messaging().getToken();
      console.log('📱 FCM Token:', token);
      return token;
      
    } catch (error) {
      console.error(`Failed to get FCM token (attempt ${retryCount + 1}):`, error);
      
      // Retry on certain errors
      if (
        retryCount < maxRetries &&
        (error.code === 'messaging/unknown' || 
         error.message?.includes('SERVICE_NOT_AVAILABLE') ||
         error.message?.includes('PLAY_SERVICES'))
      ) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getToken(retryCount + 1);
      }
      
      return null;
    }
  }

  static async checkGooglePlayServices() {
    try {
      const { checkPlayServices } = require('react-native-google-play-services');
      const isAvailable = await checkPlayServices();
      return isAvailable;
    } catch (error) {
      console.warn('Google Play Services check failed:', error);
      // Assume available if check fails (for emulators with Play Store)
      return true;
    }
  }

  static async requestPermissions() {
    // Android 13+ (API 33) needs POST_NOTIFICATIONS permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const { PermissionsAndroid } = require('react-native');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('Notification permission status:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        return false;
      }
    }
    
    if (Platform.OS === 'ios') {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        console.log('iOS permission status:', authStatus);
        return enabled;
      } catch (error) {
        console.error('iOS permission request failed:', error);
        return false;
      }
    }
    
    return true;
  }

  static async registerDevice(userId, userToken, retryCount = 0) {
    const maxRetries = 3;
    const baseDelay = 2000;

    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        throw new NetworkError(
          'No internet connection. Please check your network.',
          'NO_NETWORK',
          true
        );
      }

      const registration_id = await this.getToken();
      if (!registration_id) {
        console.warn('No FCM token available - device registration skipped');
        return { success: false, error: 'No FCM token', retryable: true };
      }

      console.log(`📱 Registering device (attempt ${retryCount + 1}/${maxRetries + 1})`);

      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      
      // Get device name
      let deviceName = 'Unknown Device';
      try {
        const deviceInfo = await import('react-native-device-info');
        const brand = deviceInfo.getBrand ? deviceInfo.getBrand() : '';
        const model = deviceInfo.getModel ? deviceInfo.getModel() : '';
        deviceName = brand && model ? `${brand} ${model}` : (brand || model || 'Unknown Device');
      } catch {
        deviceName = Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
      }

      const response = await axios.post(
        `${API_ROUTE}/notifications/register-device/`,
        {
          registration_id: registration_id,
          platform: platform,
          device_name: deviceName,
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
        console.log('✅ Device registered successfully for FCM');
        return { success: true, data: response.data };
      }

      return { success: false, error: `Server error: ${response.status}` };
      
    } catch (error) {
      console.error('Device registration failed (attempt', retryCount + 1, '):', error);

      const isRetryable = this.isRetryableError(error);
      
      if (isRetryable && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.registerDevice(userId, userToken, retryCount + 1);
      }

      return {
        success: false,
        error: error.message || 'Device registration failed',
        retryable: isRetryable,
        permanent: !isRetryable,
      };
    }
  }

  static isRetryableError(error) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return true;
    }
    if (error.response) {
      if (error.response.status >= 500 && error.response.status < 600) {
        return true;
      }
      if (error.response.status === 429) {
        return true;
      }
    }
    if (error.message?.includes('network')) {
      return true;
    }
    if (error.message?.includes('SERVICE_NOT_AVAILABLE')) {
      return true;
    }
    if (error.message?.includes('PLAY_SERVICES')) {
      return true;
    }
    return false;
  }

  static async registerTokenRefreshListener() {
    return messaging().onTokenRefresh(async (token) => {
      console.log('🔄 FCM Token refreshed:', token);
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        if (userToken && userId) {
          console.log('User logged in, refreshing device registration');
          await this.registerDevice(parseInt(userId), userToken);
        } else {
          console.log('User not logged in, skipping token refresh');
        }
      } catch (error) {
        console.error('Failed to refresh FCM token registration:', error);
      }
    });
  }
}

// class FCMService {
//   static async getToken() {
//     try {
//       const token = await messaging().getToken();
//       //console.log('FCM Token:', token);
//       return token;
//     } catch (error) {
//      // console.error(' Failed to get FCM token:', error);
//       return null;
//     }
//   }

//   static async registerDevice(userId, userToken, retryCount = 0) {
//     const maxRetries = 3;
//     const baseDelay = 2000;

//     try {
//       const netState = await NetInfo.fetch();
//       if (!netState.isConnected) {
//         throw new NetworkError(
//           'No internet connection. Please check your network.',
//           'NO_NETWORK',
//           true
//         );
//       }

//       const registration_id = await this.getToken();
//       if (!registration_id) {
//         //console.warn('No FCM token available - device registration skipped');
//         return { success: false, error: 'No FCM token' };
//       }

//       //console.log(` Registering device (attempt ${retryCount + 1}/${maxRetries + 1})`);

      
//       const platform = Platform.OS === 'ios' ? 'ios' : 'android';

//       const response = await axios.post(
//         `${API_ROUTE}/notifications/register-device/`,
//         {
//           registration_id: registration_id,  
//           platform: platform,               
         
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//             'Content-Type': 'application/json',
//           },
//           timeout: 15000,
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         //console.log('Device registered successfully for FCM');
//         return { success: true, data: response.data };
//       }

//       return { success: false, error: `Server error: ${response.status}` };
      
//     } catch (error) {
//       //console.error('Device registration failed (attempt', retryCount + 1, '):', error);

//       const isRetryable = this.isRetryableError(error);
      
//       if (isRetryable && retryCount < maxRetries) {
//         const delay = baseDelay * Math.pow(2, retryCount);
//        // console.log(`Retrying in ${delay}ms...`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         return this.registerDevice(userId, userToken, retryCount + 1);
//       }

//       return {
//         success: false,
//         error: error.message || 'Device registration failed',
//         retryable: isRetryable,
//         permanent: !isRetryable,
//       };
//     }
//   }

//   static isRetryableError(error) {
//     if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
//       return true;
//     }
//     if (error.response) {
//       if (error.response.status >= 500 && error.response.status < 600) {
//         return true;
//       }
//       if (error.response.status === 429) {
//         return true;
//       }
//     }
//     if (error.message?.includes('network')) {
//       return true;
//     }
//     return false;
//   }

//   static async getDeviceName() {
//     try {
//       const deviceInfo = await import('react-native-device-info');
//       return `${deviceInfo.getBrand()} ${deviceInfo.getModel()}`;
//     } catch {
//       return Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
//     }
//   }

//   static async registerTokenRefreshListener() {
//     return messaging().onTokenRefresh(async (token) => {
//       //console.log('FCM Token refreshed:', token);
//       try {
//         const userToken = await AsyncStorage.getItem('userToken');
//         const userId = await AsyncStorage.getItem('userId');
//         if (userToken && userId) {
//           await this.registerDevice(parseInt(userId), userToken);
//         }
//       } catch (error) {
//         //console.error('Failed to refresh FCM token registration:', error);
//       }
//     });
//   }

//   static async requestPermissions() {
//     if (Platform.OS === 'android' && Platform.Version >= 33) {
//       try {
//         const { PermissionsAndroid } = require('react-native');
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (error) {
//         //console.error(' Failed to request notification permission:', error);
//         return false;
//       }
//     }
//     return true;
//   }
// }

// ─── Main Component ─────────────────────────────────────────────────────────
export default function EmailLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [networkModalVisible, setNetworkModalVisible] = useState(false);
  const [networkMessage, setNetworkMessage] = useState('');
  const [lastLoginAttempt, setLastLoginAttempt] = useState(null);
  
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const tokenRefreshListenerRef = useRef(null);
  const isMountedRef = useRef(true);

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    const timer = setTimeout(() => emailInputRef.current?.focus(), 300);
    
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('📶 Network state changed:', state.isConnected);
      if (state.isConnected && networkModalVisible) {
        setNetworkModalVisible(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, [networkModalVisible]);

  // ─── FCM Setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    const setupFCM = async () => {
      try {
        await FCMService.requestPermissions();
        tokenRefreshListenerRef.current = await FCMService.registerTokenRefreshListener();
        console.log('✅ FCM service initialized');
      } catch (error) {
        console.error('❌ FCM setup failed:', error);
      }
    };

    setupFCM();

    return () => {
      if (tokenRefreshListenerRef.current) {
        tokenRefreshListenerRef.current();
      }
    };
  }, []);

  // ─── Network Helpers ──────────────────────────────────────────────────────
  const showNetworkError = (message, retryFn) => {
    setNetworkMessage(message);
    setNetworkModalVisible(true);
  };

  const hideNetworkModal = () => {
    setNetworkModalVisible(false);
  };

  const retryLogin = () => {
    hideNetworkModal();
    handleLogin();
  };

  // ─── Form Validation ──────────────────────────────────────────────────────
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

  // ─── Login Handler ──────────────────────────────────────────────────────
  // const handleLogin = async () => {
  //   if (!validateForm()) return;
    
  //   const netState = await NetInfo.fetch();
  //   if (!netState.isConnected) {
  //     showNetworkError(
  //       'No internet connection. Please check your network and try again.',
  //       handleLogin
  //     );
  //     return;
  //   }

  //   const now = Date.now();
  //   if (lastLoginAttempt && (now - lastLoginAttempt) < 3000) {
  //     Alert.alert('Please wait', 'Please wait a moment before trying again.');
  //     return;
  //   }
  //   setLastLoginAttempt(now);

  //   setLoading(true);
  //   let loginSuccess = false;
    
  //   try {
  //     console.log('🔐 Attempting login...');
      
  //     const response = await axios.post(
  //       `${API_ROUTE}/email-login/`,
  //       {
  //         email: email.trim().toLowerCase(),
  //         password: password,
  //       },
  //       {
  //         timeout: 20000,
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
      
  //     if (response.status === 200 && response.data.success) {
  //       const { token, refresh, user, wallet } = response.data;
        
  //       try {
  //         await EncryptedStorage.setItem('userToken', token);
  //         await EncryptedStorage.setItem('refreshToken', refresh);
  //         await EncryptedStorage.setItem('userData', JSON.stringify(user));
          
  //         await AsyncStorage.multiSet([
  //           ['userToken', token],
  //           ['refreshToken', refresh],
  //           ['userData', JSON.stringify(user)],
  //           ['isVerified', 'true'],
  //           ['userEmail', user.email],
  //           ['userId', user.id.toString()],
  //           ['loginMethod', 'email'],
  //         ]);
  //       } catch (storageError) {
  //         console.error('❌ Storage error:', storageError);
  //       }

  //       loginSuccess = true;

  //       const registerDevice = async () => {
  //         try {
  //           console.log('📱 Starting device registration...');
  //           const result = await FCMService.registerDevice(user.id, token);
            
  //           if (result.success) {
  //             console.log('✅ Device registered for push notifications');
  //           } else if (result.permanent) {
  //             console.warn('⚠️ Permanent device registration failure:', result.error);
  //           } else if (result.retryable) {
  //             console.warn('⚠️ Retryable device registration failure:', result.error);
  //             setTimeout(() => {
  //               FCMService.registerDevice(user.id, token);
  //             }, 30000);
  //           }
  //         } catch (fcmError) {
  //           console.error('❌ FCM registration error (non-blocking):', fcmError);
  //         }
  //       };

  //       registerDevice();
  //       navigation.replace('BroadcastHome');
        
  //     } else {
  //       Alert.alert('Login Failed', response.data.error || 'Invalid credentials');
  //     }
      
  //   } catch (error) {
  //     console.error('❌ Login error:', error);
      
  //     if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
  //       showNetworkError(
  //         'Connection timeout. Please check your network and try again.',
  //         handleLogin
  //       );
  //       return;
  //     }
      
  //     if (!error.response) {
  //       showNetworkError(
  //         'Cannot connect to server. Please check your internet connection.',
  //         handleLogin
  //       );
  //       return;
  //     }
      
  //     if (error.response.status >= 500 && error.response.status < 600) {
  //       showNetworkError(
  //         'Server is currently experiencing issues. Please try again later.',
  //         handleLogin
  //       );
  //       return;
  //     }
      
  //     if (error.response.status === 400 && error.response?.data?.login_method === 'phone') {
  //       Alert.alert(
  //         'Phone Account Detected',
  //         'This account uses phone number login. Please use "Continue with Phone" option.',
  //         [
  //           { text: 'Cancel', style: 'cancel' },
  //           { 
  //             text: 'Use Phone Login', 
  //             onPress: () => navigation.navigate('PhoneNumber') 
  //           }
  //         ]
  //       );
  //       return;
  //     }
      
  //     if (error.response.status === 401) {
  //       Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
  //       return;
  //     }
      
  //     if (error.response.status === 403) {
  //       Alert.alert('Account Locked', 'Your account has been locked. Please contact support.');
  //       return;
  //     }
      
  //     if (error.response.status === 429) {
  //       Alert.alert('Too Many Attempts', 'Please wait a few minutes before trying again.');
  //       return;
  //     }
      
  //     Alert.alert(
  //       'Login Error',
  //       error.response?.data?.error || 'Unable to login. Please check your credentials.'
  //     );
      
  //   } finally {
  //     if (isMountedRef.current) {
  //       setLoading(false);
  //       setTimeout(() => {
  //         if (isMountedRef.current) {
  //           setLastLoginAttempt(null);
  //         }
  //       }, 5000);
  //     }
  //   }
  // };


  const handleLogin = async () => {
  if (!validateForm()) return;
  
  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    showNetworkError(
      'No internet connection. Please check your network and try again.',
      handleLogin
    );
    return;
  }

  const now = Date.now();
  if (lastLoginAttempt && (now - lastLoginAttempt) < 3000) {
    Alert.alert('Please wait', 'Please wait a moment before trying again.');
    return;
  }
  setLastLoginAttempt(now);

  setLoading(true);
  
  try {
    console.log('🔐 Attempting login...');
    
    const response = await axios.post(
      `${API_ROUTE}/email-login/`,
      {
        email: email.trim().toLowerCase(),
        password: password,
      },
      {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.status === 200 && response.data.success) {
      const { token, refresh, user, wallet, fcm } = response.data;
      
      // Store tokens
      await EncryptedStorage.setItem('userToken', token);
      await EncryptedStorage.setItem('refreshToken', refresh);
      await EncryptedStorage.setItem('userData', JSON.stringify(user));
      
      await AsyncStorage.multiSet([
        ['userToken', token],
        ['refreshToken', refresh],
        ['userData', JSON.stringify(user)],
        ['isVerified', 'true'],
        ['userEmail', user.email],
        ['userId', user.id.toString()],
        ['loginMethod', 'email'],
      ]);

      // ===== FIX: Check if device needs registration =====
      const fcmToken = await FCMService.getToken();
      
      if (fcmToken) {
        // Check if device is already registered
        const isRegistered = await checkDeviceRegistration(fcmToken, token);
        
        if (!isRegistered) {
          console.log('📱 Device not registered. Registering...');
          await registerDeviceWithRetry(user.id, token);
        } else {
          console.log('✅ Device already registered');
          // Still update to ensure it's active
          await FCMService.registerDevice(user.id, token);
        }
      } else {
        console.warn('⚠️ No FCM token available');
      }

      navigation.replace('BroadcastHome');
      
    } else {
      Alert.alert('Login Failed', response.data.error || 'Invalid credentials');
    }
    
  } catch (error) {
    console.error('❌ Login error:', error);
   
    
  } finally {
    setLoading(false);
  }
};

// ===== Helper function to check device registration =====
const checkDeviceRegistration = async (fcmToken, authToken) => {
  try {
    const response = await axios.post(
      `${API_ROUTE}/notifications/check-device/`,
      {
        registration_id: fcmToken,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.is_registered;
  } catch (error) {
    console.error('Failed to check device registration:', error);
    return false;
  }
};

// ===== Helper function to register device with retry =====
const registerDeviceWithRetry = async (userId, token, retryCount = 0) => {
  const maxRetries = 3;
  
  try {
    const result = await FCMService.registerDevice(userId, token);
    
    if (result.success) {
      console.log('✅ Device registered successfully');
      return true;
    } else if (retryCount < maxRetries) {
      console.log(`Retry ${retryCount + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return registerDeviceWithRetry(userId, token, retryCount + 1);
    } else {
      console.error('❌ Failed to register device after max retries');
      return false;
    }
  } catch (error) {
    console.error('Device registration error:', error);
    return false;
  }
};

  // ─── Navigation ────────────────────────────────────────────────────────────
  const navigateToRegister = () => {
    navigation.navigate('Signin_two');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // ─── Render ────────────────────────────────────────────────────────────────
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
          {/* Back Button */}
          <TouchableOpacity 
            // onPress={() => navigation.goBack()} 
            style={styles.backButton}
            // accessibilityLabel="Go back"
          >
            {/* <Icon name="ar" size={24} color={COLORS.textPrimary} /> */}
          </TouchableOpacity>

          {/* Header with Smaller Logo */}
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  ref={emailInputRef}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholder}
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
                  accessibilityLabel="Email address input"
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
                  placeholderTextColor={COLORS.placeholder}
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
                  accessibilityLabel="Password input"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)} 
                  style={styles.eyeButton}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot Password - Repositioned to the right */}
            <TouchableOpacity 
              onPress={navigateToForgotPassword} 
              style={styles.forgotButton}
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              disabled={loading}
              activeOpacity={0.8}
              accessibilityLabel="Sign in"
            >
              <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.buttonGradient}>
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

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Create New Account Button - Transparent/Outlined */}
            <TouchableOpacity
              onPress={navigateToRegister}
              style={styles.signupButton}
              activeOpacity={0.7}
              accessibilityLabel="Create new account"
            >
              <View style={styles.signupButtonContent}>
                {/* <Icon name="person-add-outline" size={20} color={COLORS.primary} style={styles.signupIcon} /> */}
                <Text style={styles.signupButtonText}>Create New Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Network Status Modal */}
      <NetworkStatusModal
        visible={networkModalVisible}
        message={networkMessage}
        onRetry={retryLogin}
        onCancel={hideNetworkModal}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ebf1',
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
    marginTop: SPACING.sm,
  },
  header: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: SPACING.xl,
  },
  logoWrapper: {
    marginBottom: 16,
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
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
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
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
    marginTop: -SPACING.xs,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 30,
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
    paddingVertical: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: SPACING.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dfdfdf',
  },
  dividerText: {
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    fontSize: 13,
    fontWeight: '500',
  },
  signupButton: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
  },
  signupButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupIcon: {
    marginRight: SPACING.sm,
  },
  signupButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
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
    backgroundColor: '#fff3cd',
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
    backgroundColor: '#f1f3f5',
  },
  modalRetryButton: {
    backgroundColor: COLORS.primary,
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