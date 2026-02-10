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
//     profilePic: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const nameInputRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = 'Full name is required';
//     if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
//   };

//   const handleRegister = async () => {
//     if (!validateForm()) return;

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
    
//     if (formData.profilePic) {
//       payload.append('profile_picture', {
//         uri: formData.profilePic.uri,
//         name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
//         type: formData.profilePic.type || 'image/jpeg',
//       });
//     }

//     try {
//       const { data, status } = await axios.post(`${API_ROUTE}/register/`, payload, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         timeout: 10000
//       });

//       if (status === 200 || status === 201) {
//         await Promise.all([
//           AsyncStorage.setItem('userToken', data.token),
//           AsyncStorage.setItem('refreshToken', data.refresh),
//           AsyncStorage.setItem('userData', JSON.stringify(data.user))
//         ]);

//         saveDataToStorage(STORAGE_KEYS.USER_DATA, userData);
//         saveDataToStorage(STORAGE_KEYS.USER_TOKEN, token);
//         navigation.replace('ProceedOptions');
//       }
//     } catch (error) {
//       //console.error('Registration error:', error);
//       Alert.alert(
//         'Registration Error',
//         error.response?.data?.message || 'Unable to complete registration. Please try again, network error, or off the app and reopen',
//         [{ text: 'OK' }
         
//         ]
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
//                 returnKeyType="done"
//                 onSubmitEditing={handleRegister}
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

//           <Animated.View style={{ opacity: fadeAnim }}>
//             <ActivityIndicator 
//               size="small" 
//               color="#0D64DD" 
//               style={styles.loadingIndicator} 
//             />
//           </Animated.View>

//           <TouchableOpacity
//             onPress={handleRegister}
//             style={styles.submitButton}
//             disabled={loading}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.submitButtonText}>
//               {loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
//             </Text>
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
//     paddingTop: Platform.OS === 'ios' ? 60 : 30,
//     paddingBottom: 30,
//     paddingHorizontal: 24,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8
//   },
//   headerTitle: {
//     color: '#FFF',
//     fontSize: 24,
//     fontWeight: '600',
//     fontFamily: 'System',
//     marginBottom: 4
//   },
//   headerSubtitle: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 14,
//     fontWeight: '400'
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
//   submitButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//     letterSpacing: 0.5
//   },
//   buttonIcon: {
//     marginLeft: 10
//   }
// });

// export default RegistrationScreen;


import React, { useState, useRef } from 'react';
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
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = ({ navigation, route }) => {
  const { phoneNumberID, emailID } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    profilePic: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    //if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

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
    
    if (formData.profilePic) {
      payload.append('profile_picture', {
        uri: formData.profilePic.uri,
        name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
        type: formData.profilePic.type || 'image/jpeg',
      });
    }

    try {
      console.log('Sending registration request...');
      const response = await axios.post(`${API_ROUTE}/register/`, payload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 15000
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

        // Store all data in AsyncStorage
        await Promise.all([
          AsyncStorage.setItem('userToken', token),
          AsyncStorage.setItem('refreshToken', refresh || ''),
          AsyncStorage.setItem('userData', JSON.stringify(user))
        ]);

        //console.log('Data stored successfully, navigating to ProceedOptions...');
        
        // Use reset to prevent going back to registration
        
        navigation.navigate('SynMessage')
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
        // Handle specific backend errors
        const backendError = error.response.data;
        if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.email) {
          errorMessage = `Email: ${backendError.email[0]}`;
        } else if (backendError.phone) {
          errorMessage = `Phone: ${backendError.phone[0]}`;
        } else if (backendError.name) {
          errorMessage = `Name: ${backendError.name[0]}`;
        }
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert(
        'Registration Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false,
      selectionLimit: 1
    }, ({ didCancel, errorCode, assets }) => {
      if (didCancel) return;
      if (errorCode) {
        Alert.alert('Error', 'Failed to select image');
        return;
      }
      if (assets?.[0]) {
        handleInputChange('profilePic', assets[0]);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
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
                returnKeyType="done"
                onSubmitEditing={handleRegister}
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

          <Animated.View style={{ opacity: fadeAnim }}>
            <ActivityIndicator 
              size="small" 
              color="#0D64DD" 
              style={styles.loadingIndicator} 
            />
          </Animated.View>

          <TouchableOpacity
            onPress={handleRegister}
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled
            ]}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
            </Text>
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
    padding:39,
  },
  headerTitle: {
    paddingHorizontal:20,
    paddingTop:80,
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
    paddingBottom:20,
    paddingHorizontal:20,
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
  loadingIndicator: {
    marginVertical: 16
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
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  buttonIcon: {
    marginLeft: 10
  }
});

export default RegistrationScreen;

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
//     profilePic: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const nameInputRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   // Default profile picture
//   const defaultProfilePic = require('../../assets/images/avatar/blank-profile-picture-973460_1280.png');

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

//   const handleRegister = async () => {
//     if (!validateForm()) return;

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
    
    
//     if (formData.profilePic) {
//       payload.append('profile_picture', {
//         uri: formData.profilePic.uri,
//         name: formData.profilePic.fileName || `profile_${Date.now()}.jpg`,
//         type: formData.profilePic.type || 'image/jpeg',
//       });
//     } else {
//       const defaultPic = defaultProfilePic;
//       payload.append('profile_picture', {
//         uri: defaultPic,
//         name: `default_profile_${Date.now()}.jpg`,
//         type: 'image/jpeg',
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

//         // Store all data in AsyncStorage
//         await Promise.all([
//           AsyncStorage.setItem('userToken', token),
//           AsyncStorage.setItem('refreshToken', refresh || ''),
//           AsyncStorage.setItem('userData', JSON.stringify(user))
//         ]);

//         navigation.navigate('SynMessage')
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
//               style={styles.avatarContainer}
//               activeOpacity={0.7}
//             >
//               {formData.profilePic ? (
//                 <Image 
//                   source={{ uri: formData.profilePic.uri }} 
//                   style={styles.avatarImage} 
//                 />
//               ) : (
//                 <Image 
//                   source={defaultProfilePic} 
//                   style={styles.avatarImage} 
//                 />
//               )}
//               <View style={styles.cameraBadge}>
//                 <Icon name="camera" size={16} color="#FFF" />
//               </View>
//             </TouchableOpacity>
//             <Text style={styles.avatarHint}>Tap to change profile picture</Text>
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
//                 returnKeyType="done"
//                 onSubmitEditing={handleRegister}
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

//           <Animated.View style={{ opacity: fadeAnim }}>
//             <ActivityIndicator 
//               size="small" 
//               color="#0D64DD" 
//               style={styles.loadingIndicator} 
//             />
//           </Animated.View>

//           <TouchableOpacity
//             onPress={handleRegister}
//             style={[
//               styles.submitButton,
//               loading && styles.submitButtonDisabled
//             ]}
//             disabled={loading}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.submitButtonText}>
//               {loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
//             </Text>
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
//     paddingTop: Platform.OS === 'ios' ? 60 : 30,
//     paddingBottom: 30,
//     paddingHorizontal: 24,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8
//   },
//   headerTitle: {
//     color: '#FFF',
//     fontSize: 24,
//     fontWeight: '800',
//     fontFamily: 'System',
//     marginBottom: 4
//   },
//   headerSubtitle: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 14,
//     fontWeight: '400'
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
//     elevation: 3,
//     overflow: 'hidden'
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 60
//   },
//   cameraBadge: {
//     position: 'absolute',
//     bottom: 6,
//     right: 10,
//     backgroundColor: '#0D64DD',
//     width: 26,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#FFF',
//     zIndex:10000

//   },
//   avatarHint: {
//     color: '#64748B',
//     fontSize: 12,
//     marginTop: 8,
//     fontStyle: 'italic'
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
//   }
// });

// export default RegistrationScreen;
