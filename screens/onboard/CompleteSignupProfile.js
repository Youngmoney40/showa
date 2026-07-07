

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  ImageBackground,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width: screenWidth } = Dimensions.get('window');

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 
  'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 
  'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const EditProfileScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dateLockMessage, setDateLockMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    country: '',
    gender: '',
    date_of_birth: '',
    active_mode: 'personal',
    profile_picture: '',
    cover_photo: '',
    is_verified: false,
    last_profile_update: null
  });

  const [userProfileImage, setUserProfileImage] = useState('');
  const [userCoverImage, setUserCoverImage] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [loginusername, setUserName] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    country: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    active_mode: 'personal'
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      const username = await AsyncStorage.getItem('username');
      setUserName(username);
    };
    getUsername();
  }, []);

  // Filter countries based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = countries.filter(country =>
        country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchQuery]);

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      return null;
    }
    
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
      let url = imagePath;
      if (url.includes('api.showapp.ngmedia')) {
        url = url.replace('api.showapp.ngmedia', 'api.showapp.ng/media');
      }
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      return url;
    }
    
    if (typeof imagePath === 'string') {
      let cleanPath = imagePath;
      if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
      }
      if (!cleanPath.startsWith('media/')) {
        if (cleanPath.includes('profile_pics') || cleanPath.includes('cover_photos')) {
          cleanPath = 'media/' + cleanPath;
        }
      }
      let baseUrl = API_ROUTE_IMAGE;
      if (!baseUrl.endsWith('/')) {
        baseUrl = baseUrl + '/';
      }
      return `${baseUrl}${cleanPath}`;
    }
    return null;
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;

      if (!token) {
        navigation.navigate('Login');
        return;
      }

      let response;
      try {
        response = await axios.get(`${API_ROUTE}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        if (parsed?.id) {
          response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      }

      if (response?.status === 200) {
        const data = response.data;
        setUserData(data);
        
        const lastUpdated = data.last_profile_update ? new Date(data.last_profile_update) : null;
        if (lastUpdated) {
          const nextUpdateDate = new Date(lastUpdated);
          nextUpdateDate.setDate(nextUpdateDate.getDate() + 90);
          const today = new Date();
          const daysLeft = Math.ceil((nextUpdateDate - today) / (1000 * 60 * 60 * 24));
          if (daysLeft > 0) {
            setDateLockMessage(`Birthday can be changed in ${daysLeft} days`);
          }
        }

        setEditForm({
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          country: data.country || '',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          phone: data.phone || '',
          active_mode: data.active_mode || 'personal'
        });

        if (data.profile_picture) {
          const profileImageUrl = getImageUrl(data.profile_picture);
          setUserProfileImage(profileImageUrl);
        }

        if (data.cover_photo) {
          const coverImageUrl = getImageUrl(data.cover_photo);
          setUserCoverImage(coverImageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const canEditDateOfBirth = () => {
    if (!userData.last_profile_update) return true;
    
    const lastUpdate = new Date(userData.last_profile_update);
    const now = new Date();
    const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setTempDate(formattedDate);
      
      Alert.alert(
        'Confirm Date of Birth',
        `Are you sure you want to set your date of birth to ${formattedDate}?\n\nNote: After saving, you won't be able to change it for 24 hours.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Confirm', 
            onPress: () => {
              setEditForm({...editForm, date_of_birth: formattedDate});
              setTempDate(null);
            }
          }
        ]
      );
    }
  };

  const handleCountrySelect = (country) => {
    setEditForm({...editForm, country: country});
    setShowCountryPicker(false);
    setSearchQuery('');
  };

  const handleImageSelection = async (type) => {
    try {
      Alert.alert(
        'Choose Image Source',
        'Select where to pick the image from',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Camera', onPress: () => handleImagePicker(type, 'camera') },
          { text: 'Gallery', onPress: () => handleImagePicker(type, 'gallery') }
        ]
      );
    } catch (error) {
      console.error('Image selection error:', error);
    }
  };

  const handleImagePicker = async (type, source) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
      saveToPhotos: false,
    };

    try {
      let response;
      if (source === 'camera') {
        response = await launchCamera(options);
      } else {
        response = await launchImageLibrary(options);
      }

      if (response.didCancel) return;

      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const imageData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `${type}_${Date.now()}.jpg`,
        };

        if (type === 'profile') {
          setProfileImageFile(imageData);
          setUserProfileImage(asset.uri);
        } else {
          setCoverPhotoFile(imageData);
          setUserCoverImage(asset.uri);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const updateUserProfile = async () => {
    if (!editForm.name.trim()) {
      setError('Name is required');
      return;
    }

    setProfileLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();

      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          formData.append(key, editForm[key].toString());
        }
      });

      if (profileImageFile) {
        formData.append('profile_picture', {
          uri: profileImageFile.uri,
          type: profileImageFile.type || 'image/jpeg',
          name: profileImageFile.fileName || `profile_${Date.now()}.jpg`,
        });
      }

      if (coverPhotoFile) {
        formData.append('cover_photo', {
          uri: coverPhotoFile.uri,
          type: coverPhotoFile.type || 'image/jpeg',
          name: coverPhotoFile.fileName || `cover_${Date.now()}.jpg`,
        });
      }

      const attempts = [
        { method: 'PATCH', url: `${API_ROUTE}/profile/` },
        { method: 'PUT', url: `${API_ROUTE}/profile/` },
        { method: 'PATCH', url: `${API_ROUTE}/profile/update/` },
        { method: 'POST', url: `${API_ROUTE}/profile/update/` },
      ];

      let response;
      let lastError;

      for (const attempt of attempts) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          };

          if (attempt.method === 'POST') {
            response = await axios.post(attempt.url, formData, config);
          } else if (attempt.method === 'PUT') {
            response = await axios.put(attempt.url, formData, config);
          } else {
            response = await axios.patch(attempt.url, formData, config);
          }

          if (response.status === 200 || response.status === 201) {
            break;
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      if (!response) {
        throw lastError || new Error('Update failed - no endpoint worked');
      }

      const updatedData = response.data;
      setUserData(updatedData);
      
      if (updatedData.profile_picture) {
        const newProfileImage = getImageUrl(updatedData.profile_picture);
        setUserProfileImage(newProfileImage);
        setProfileImageFile(null);
      }
      
      if (updatedData.cover_photo) {
        const newCoverImage = getImageUrl(updatedData.cover_photo);
        setUserCoverImage(newCoverImage);
        setCoverPhotoFile(null);
      }

      const existingData = await AsyncStorage.getItem('userData');
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        const mergedData = { ...parsedData, ...updatedData };
        await AsyncStorage.setItem('userData', JSON.stringify(mergedData));
      }

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        navigation.navigate('SuggestionUser');
      }, 1500);
    } catch (error) {
      let errorMsg = 'Failed to update profile. Please try again.';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errors = Object.values(errorData).flat();
          if (errors.length > 0) errorMsg = errors[0];
          else if (errorData.detail) errorMsg = errorData.detail;
          else if (errorData.message) errorMsg = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        }
      }
      setError(errorMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#f5f6fa' }]}>
        <ActivityIndicator size="large" color="#0d64dd" />
        <Text style={styles.loadingText}>Setup in Progress...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f6fa' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: '#e8ecf1',marginTop:0 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Icon name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: '#1a1a1a' }]}>Complete Your Profile</Text>
            <TouchableOpacity 
              style={[styles.saveHeaderButton, profileLoading && styles.saveHeaderDisabled]}
              onPress={updateUserProfile}
              disabled={profileLoading}
            >
              {profileLoading ? (
                <ActivityIndicator size="small" color="#0d64dd" />
              ) : (
                <Text style={[styles.saveHeaderText, { color: '#0d64dd' }]}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Cover Photo */}
            <TouchableOpacity
              onPress={() => handleImageSelection('cover')}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={userCoverImage ? { uri: userCoverImage } : require('../../assets/images/_gluster_2024_3_5_241efce82619d6785221985f79b3edf3_original.53958 (1).jpg')}
                style={styles.coverImage}
                resizeMode="cover"
              >
                <View style={[styles.coverOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
                  <Icon name="camera-outline" size={28} color="#fff" />
                  <Text style={styles.uploadLabel}>Change Cover Photo</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* Profile Picture */}
            <View style={styles.profileImageSection}>
              <TouchableOpacity
                onPress={() => handleImageSelection('profile')}
                style={styles.profileImageWrapper}
              >
                <Image
                  source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
                  style={styles.profileImage}
                />
                <View style={[styles.profileUploadOverlay, { backgroundColor: '#0d64dd' }]}>
                  <Icon name="camera" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.profileUploadHint, { color: '#6c757d' }]}>
                Tap to change profile photo
              </Text>
            </View>

            {/* Error/Success Messages */}
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: '#FEF2F2' }]}>
                <Icon name="alert-circle" size={20} color="#DC2626" />
                <Text style={[styles.errorText, { color: '#DC2626' }]}>{error}</Text>
              </View>
            )}

            {successMessage && (
              <View style={[styles.successContainer, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="checkmark-circle" size={20} color="#10B981" />
                <Text style={[styles.successText, { color: '#065F46' }]}>{successMessage}</Text>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Full Name */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: '#1a1a1a' }]}>Full Name *</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="person-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.formInput, { color: '#1a1a1a' }]}
                    value={editForm.name}
                    onChangeText={(text) => setEditForm({...editForm, name: text})}
                    placeholder="Enter your full name"
                    placeholderTextColor="#adb5bd"
                  />
                </View>
              </View>

              {/* Username */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: '#1a1a1a' }]}>Username *</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="at-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.formInput, { color: '#1a1a1a' }]}
                    value={editForm.username}
                    onChangeText={(text) => setEditForm({...editForm, username: text})}
                    placeholder="Choose a username"
                    placeholderTextColor="#adb5bd"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Bio */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: '#1a1a1a' }]}>Bio</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <TextInput
                    style={[styles.formInput, styles.textArea, { color: '#1a1a1a' }]}
                    value={editForm.bio}
                    onChangeText={(text) => setEditForm({...editForm, bio: text})}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor="#adb5bd"
                    multiline
                    numberOfLines={4}
                    maxLength={160}
                  />
                </View>
                <Text style={[styles.charCount, { color: '#6c757d' }]}>
                  {editForm.bio?.length || 0}/160
                </Text>
              </View>

              {/* Email (Readonly) */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: '#1a1a1a' }]}>Email</Text>
                <View style={[styles.inputWrapper, styles.readonlyInput]}>
                  <Icon name="mail-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.formInput, styles.readonlyText, { color: '#6c757d' }]}
                    value={editForm.email}
                    editable={false}
                  />
                </View>
              </View>

              {/* Phone (Readonly) */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: '#1a1a1a' }]}>Phone Number</Text>
                <View style={[styles.inputWrapper, styles.readonlyInput]}>
                  <Icon name="call-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.formInput, styles.readonlyText, { color: '#6c757d' }]}
                    value={editForm.phone}
                    editable={false}
                  />
                </View>
              </View>

              {/* Country */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: '#1a1a1a' }]}>Country</Text>
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  style={styles.inputWrapper}
                >
                  <Icon name="location-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                  <Text style={[
                    styles.countryText,
                    { color: editForm.country ? '#1a1a1a' : '#adb5bd' }
                  ]}>
                    {editForm.country || 'Select your country'}
                  </Text>
                  <Icon 
                    name="chevron-down-outline" 
                    size={20} 
                    color="#6c757d" 
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Date of Birth */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: '#1a1a1a' }]}>Date of Birth</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (canEditDateOfBirth() || !editForm.date_of_birth) {
                      setShowDatePicker(true);
                    } else {
                      Alert.alert(
                        'Cannot Update',
                        'You can only update your date of birth once every 24 hours. Please try again later.',
                        [{ text: 'OK' }]
                      );
                    }
                  }}
                  style={[
                    styles.inputWrapper,
                    { opacity: (!canEditDateOfBirth() && editForm.date_of_birth) ? 0.7 : 1 }
                  ]}
                >
                  <Icon name="calendar-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                  <Text style={[
                    styles.countryText,
                    { color: editForm.date_of_birth ? '#1a1a1a' : '#adb5bd' }
                  ]}>
                    {editForm.date_of_birth || 'Select your date of birth'}
                  </Text>
                  <Icon 
                    name="chevron-down-outline" 
                    size={20} 
                    color="#6c757d" 
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>
                
                {editForm.date_of_birth && (
                  <Text style={[styles.hintText, { color: '#6c757d' }]}>
                    Age: {calculateAge(editForm.date_of_birth) || 'N/A'} years
                  </Text>
                )}
                
                {editForm.date_of_birth && !canEditDateOfBirth() && (
                  <Text style={[styles.lockMessage, { color: '#FFA500' }]}>
                    <Icon name="lock-closed" size={12} color="#FFA500" /> You can update your date of birth again after 24 hours
                  </Text>
                )}
              </View>

              <TouchableOpacity 
              style={[[styles.saveHeaderButton, profileLoading && styles.saveHeaderDisabled,{backgroundColor:'#0d64dd',borderRadius:10,paddingVertical:10,marginTop:20}]]}
              onPress={updateUserProfile}
              disabled={profileLoading}
            >
              {profileLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={[styles.saveHeaderText, { color: '#ffffff', textAlign:'center' }]}>Save</Text>
              )}
            </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Picker Modal - Fixed */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCountryPicker(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.countryModal, { backgroundColor: '#ffffff' }]}>
            <View style={[styles.countryModalHeader, { borderBottomColor: '#e8ecf1' }]}>
              <Text style={[styles.countryModalTitle, { color: '#1a1a1a' }]}>Select Country</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowCountryPicker(false);
                  setSearchQuery('');
                }}
              >
                <Icon name="close" size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
            
            {/* Search Input */}
            <View style={styles.searchWrapper}>
              <Icon name="search-outline" size={20} color="#6c757d" style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: '#1a1a1a' }]}
                placeholder="Search countries..."
                placeholderTextColor="#adb5bd"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="close-circle" size={20} color="#6c757d" />
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryItem, { borderBottomColor: '#f1f3f5' }]}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={[styles.countryItemText, { color: '#1a1a1a' }]}>{item}</Text>
                  {editForm.country === item && (
                    <Icon name="checkmark" size={20} color="#0d64dd" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: '#6c757d' }]}>
                    No countries found
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={editForm.date_of_birth ? new Date(editForm.date_of_birth) : new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </SafeAreaView>
  );
};

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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveHeaderButton: {
    padding: 8,
  },
  saveHeaderDisabled: {
    opacity: 0.5,
  },
  saveHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  coverImage: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadLabel: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  profileImageSection: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 24,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileUploadOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileUploadHint: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  successText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  formFields: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e8ecf1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  formInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  readonlyInput: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  readonlyText: {
    color: '#6c757d',
  },
  textAreaWrapper: {
    height: 100,
    alignItems: 'flex-start',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  countryText: {
    flex: 1,
    fontSize: 15,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  lockMessage: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  countryModal: {
    height: '80%',
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  countryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  countryModalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    margin: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  countryItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditProfileScreen;