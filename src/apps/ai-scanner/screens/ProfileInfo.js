// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const ProfileInformationScreen = ({ navigation, route }) => {
//   const userData = route.params?.userData || {
//     name: 'John Doe',
//     email: 'john.doe@email.com',
//     phone: '+234 812 345 6789',
//     membership: 'Premium User',
//     joinDate: 'Jan 15, 2024',
//     totalScans: 47,
//     scansThisMonth: 12,
//   };

//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: userData.name,
//     email: userData.email,
//     phone: userData.phone,
//   });

//   const handleSave = () => {
//     // Validate form data
//     if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       Alert.alert('Error', 'Please enter a valid email address');
//       return;
//     }

//     // In a real app, you would make an API call here
//     Alert.alert('Success', 'Profile updated successfully!');
//     setIsEditing(false);
    
//     // Update user data (in real app, this would come from API response)
//     userData.name = formData.name;
//     userData.email = formData.email;
//     userData.phone = formData.phone;
//   };

//   const handleCancel = () => {
//     setFormData({
//       name: userData.name,
//       email: userData.email,
//       phone: userData.phone,
//     });
//     setIsEditing(false);
//   };

//   const handleChangePassword = () => {
//     Alert.alert('Change Password', 'Password change feature coming soon!');
//   };

//   const handleDeleteAccount = () => {
//     Alert.alert(
//       'Delete Account',
//       'Are you sure you want to delete your account? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.');
//           }
//         },
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//         >
//           <Icon name="arrow-back" size={28} color="#FFFFFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile Info</Text>
//         <TouchableOpacity 
//           onPress={() => isEditing ? handleSave() : setIsEditing(true)}
//           style={styles.editButton}
//         >
//           <Text style={styles.editButtonText}>
//             {isEditing ? 'Save' : 'Edit'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Profile Header */}
//         <View style={styles.profileHeader}>
//           <View style={styles.avatarContainer}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>
//                 {userData.name.split(' ').map(n => n[0]).join('')}
//               </Text>
//             </View>
//             <View style={styles.statusBadge}>
//               <Icon name="shield-checkmark" size={12} color="#FFFFFF" />
//             </View>
//           </View>
//           <Text style={styles.userName}>{userData.name}</Text>
//           <Text style={styles.userEmail}>{userData.email}</Text>
//           <View style={styles.membershipBadge}>
//             <Icon name="diamond" size={14} color="#24ad0c" />
//             <Text style={styles.membershipText}>{userData.membership}</Text>
//           </View>
//         </View>

//         {/* Personal Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Personal Information</Text>
          
//           <View style={styles.form}>
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Full Name</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.textInput}
//                   value={formData.name}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
//                   placeholder="Enter your full name"
//                   placeholderTextColor="#666666"
//                 />
//               ) : (
//                 <Text style={styles.infoText}>{userData.name}</Text>
//               )}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Email Address</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.textInput}
//                   value={formData.email}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
//                   placeholder="Enter your email"
//                   placeholderTextColor="#666666"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               ) : (
//                 <Text style={styles.infoText}>{userData.email}</Text>
//               )}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Phone Number</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.textInput}
//                   value={formData.phone}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
//                   placeholder="Enter your phone number"
//                   placeholderTextColor="#666666"
//                   keyboardType="phone-pad"
//                 />
//               ) : (
//                 <Text style={styles.infoText}>{userData.phone}</Text>
//               )}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Member Since</Text>
//               <Text style={styles.infoText}>{userData.joinDate}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Account Statistics */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Account Statistics</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statCard}>
//               <Icon name="scan" size={24} color="#24ad0c" />
//               <Text style={styles.statNumber}>{userData.totalScans}</Text>
//               <Text style={styles.statLabel}>Total Scans</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Icon name="calendar" size={24} color="#24ad0c" />
//               <Text style={styles.statNumber}>{userData.scansThisMonth}</Text>
//               <Text style={styles.statLabel}>This Month</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Icon name="trending-up" size={24} color="#24ad0c" />
//               <Text style={styles.statNumber}>87%</Text>
//               <Text style={styles.statLabel}>Accuracy</Text>
//             </View>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         {isEditing ? (
//           <View style={styles.editActions}>
//             <TouchableOpacity 
//               style={styles.cancelButton}
//               onPress={handleCancel}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.saveButton}
//               onPress={handleSave}
//             >
//               <Text style={styles.saveButtonText}>Save Changes</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={styles.actionSection}>
//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={handleChangePassword}
//             >
//               <Icon name="key" size={20} color="#24ad0c" />
//               <Text style={styles.actionButtonText}>Change Password</Text>
//               <Icon name="chevron-forward" size={20} color="#666666" />
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={[styles.actionButton, styles.dangerAction]}
//               onPress={handleDeleteAccount}
//             >
//               <Icon name="trash" size={20} color="#FF4444" />
//               <Text style={[styles.actionButtonText, styles.dangerText]}>Delete Account</Text>
//               <Icon name="chevron-forward" size={20} color="#666666" />
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Security Notice */}
//         <View style={styles.securityNotice}>
//           <Icon name="shield-checkmark" size={20} color="#24ad0c" />
//           <Text style={styles.securityText}>
//             Your personal information is securely encrypted and protected.
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 20,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   editButton: {
//     padding: 8,
//   },
//   editButtonText: {
//     color: '#24ad0c',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   scrollView: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     paddingVertical: 30,
//     marginBottom: 20,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#24ad0c',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   statusBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#24ad0c',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#000000',
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   userEmail: {
//     fontSize: 16,
//     color: '#666666',
//     marginBottom: 12,
//   },
//   membershipBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(36, 173, 12, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     gap: 6,
//   },
//   membershipText: {
//     color: '#24ad0c',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   section: {
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 16,
//   },
//   form: {
//     backgroundColor: '#111111',
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666666',
//     marginBottom: 8,
//   },
//   textInput: {
//     backgroundColor: '#1A1A1A',
//     borderWidth: 1,
//     borderColor: '#333333',
//     borderRadius: 8,
//     padding: 12,
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '500',
//     paddingVertical: 4,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#111111',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#24ad0c',
//     marginVertical: 8,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666666',
//     textAlign: 'center',
//   },
//   editActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 30,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#666666',
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#666666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: '#24ad0c',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   actionSection: {
//     marginBottom: 30,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#111111',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#222222',
//     marginBottom: 12,
//   },
//   dangerAction: {
//     borderColor: '#FF4444',
//   },
//   actionButtonText: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 12,
//   },
//   dangerText: {
//     color: '#FF4444',
//   },
//   securityNotice: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(36, 173, 12, 0.05)',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#24ad0c',
//     marginBottom: 40,
//   },
//   securityText: {
//     flex: 1,
//     color: '#CCCCCC',
//     fontSize: 12,
//     marginLeft: 12,
//     lineHeight: 16,
//   },
// });

// export default ProfileInformationScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { userAPI } from '../services/api';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileInformationScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    profile_image: null,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  // const loadUserProfile = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await userAPI.getProfile();
  //     const user = response.data;
      
  //     setUserData(user);
  //     setFormData({
  //       first_name: user.first_name || '',
  //       last_name: user.last_name || '',
  //       email: user.email || '',
  //       phone: user.phone || '',
  //       profile_image: null,
  //     });
  //   } catch (error) {
  //     console.error('Error loading profile:', error);
  //     Alert.alert('Error', 'Failed to load profile data');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSave = async () => {
  //   if (!formData.first_name.trim() || !formData.last_name.trim()) {
  //     Alert.alert('Error', 'Please fill in all required fields');
  //     return;
  //   }

  //   try {
  //     setIsUpdating(true);
      
  //     const updateData = {
  //       first_name: formData.first_name.trim(),
  //       last_name: formData.last_name.trim(),
  //       phone: formData.phone.trim(),
  //     };

  //     if (formData.profile_image) {
  //       updateData.profile_image = formData.profile_image;
  //     }

  //     const response = await userAPI.updateProfile(updateData);
      
  //     Alert.alert('Success', 'Profile updated successfully!');
  //     setUserData(response.data.user);
  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     const errorMessage = error.response?.data?.message || 'Failed to update profile';
  //     Alert.alert('Error', errorMessage);
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  // const handleCancel = () => {
  //   setFormData({
  //     first_name: userData.first_name || '',
  //     last_name: userData.last_name || '',
  //     email: userData.email || '',
  //     phone: userData.phone || '',
  //     profile_image: null,
  //   });
  //   setIsEditing(false);
  // };

  // const handleChangePassword = () => {
  //   navigation.navigate('ChangePassword');
  // };


  // All API Functions - No imports needed
const handleSave = async () => {
  if (!formData.first_name.trim() || !formData.last_name.trim()) {
    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }

  try {
    setIsUpdating(true);
    
    const updateData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
    };

    if (formData.profile_image) {
      updateData.profile_image = formData.profile_image;
    }

    const response = await fetch('http://192.168.43.73:8000/api/profile/', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('access_token')}`,
        'Content-Type': 'multipart/form-data',
      },
      body: createFormData(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    Alert.alert('Success', 'Profile updated successfully!');
    setUserData(result.user);
    setIsEditing(false);
  } catch (error) {
    console.error('Error updating profile:', error);
    Alert.alert('Error', 'Failed to update profile');
  } finally {
    setIsUpdating(false);
  }
};

const loadUserProfile = async () => {
  try {
    setIsLoading(true);
    
    // Direct API call - no import needed
    const response = await fetch('http://192.168.43.73:8000/api/profile/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    
    setUserData(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      profile_image: null,
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    Alert.alert('Error', 'Failed to load profile data');
  } finally {
    setIsLoading(false);
  }
};

const handleChangePasswordSubmit = async () => {
  if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  if (formData.new_password !== formData.confirm_password) {
    Alert.alert('Error', 'New passwords do not match');
    return;
  }

  if (formData.new_password.length < 8) {
    Alert.alert('Error', 'Password must be at least 8 characters long');
    return;
  }

  try {
    setIsLoading(true);
    
    // Direct API call - no import needed
    const response = await fetch('http://192.168.43.73:8000/api/profile/change-password/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        old_password: formData.old_password,
        new_password: formData.new_password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    Alert.alert('Success', 'Password changed successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  } catch (error) {
    console.error('Error changing password:', error);
    Alert.alert('Error', error.message);
  } finally {
    setIsLoading(false);
  }
};

// Helper function to create FormData
const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === 'profile_image' && data[key]) {
        formData.append(key, {
          uri: data[key],
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  return formData;
};

// Other non-API functions
const handleCancel = () => {
  setFormData({
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    profile_image: null,
  });
  setIsEditing(false);
};

const handleChangePassword = () => {
  navigation.navigate('ChangePassword');
};

const handleDeleteAccount = () => {
  Alert.alert(
    'Delete Account',
    'Are you sure you want to delete your account? This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.');
        }
      },
    ]
  );
};

const handleImagePick = () => {
  ImagePicker.launchImageLibrary(
    {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      quality: 0.8,
    },
    (response) => {
      if (response.didCancel) {
        return;
      }
      
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setFormData(prev => ({ ...prev, profile_image: imageUri }));
      }
    }
  );
};

const getDisplayName = () => {
  if (!userData) return '';
  return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email;
};

const getInitials = () => {
  const name = getDisplayName();
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const getJoinDate = () => {
  if (!userData?.created_at) return 'N/A';
  return new Date(userData.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const toggleShowPassword = (field) => {
  setShowPasswords(prev => ({
    ...prev,
    [field]: !prev[field],
  }));
};
  // const handleImagePick = () => {
  //   ImagePicker.launchImageLibrary(
  //     {
  //       mediaType: 'photo',
  //       includeBase64: false,
  //       maxHeight: 200,
  //       maxWidth: 200,
  //       quality: 0.8,
  //     },
  //     (response) => {
  //       if (response.didCancel) {
  //         return;
  //       }
        
  //       if (response.errorCode) {
  //         Alert.alert('Error', 'Failed to pick image');
  //         return;
  //       }

  //       if (response.assets && response.assets[0]) {
  //         const imageUri = response.assets[0].uri;
  //         setFormData(prev => ({ ...prev, profile_image: imageUri }));
  //       }
  //     }
  //   );
  // };

  // const getDisplayName = () => {
  //   if (!userData) return '';
  //   return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email;
  // };

  // const getInitials = () => {
  //   const name = getDisplayName();
  //   return name
  //     .split(' ')
  //     .map(n => n[0])
  //     .join('')
  //     .toUpperCase();
  // };

  // const getJoinDate = () => {
  //   if (!userData?.created_at) return 'N/A';
  //   return new Date(userData.created_at).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#24ad0c" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Info</Text>
        <TouchableOpacity 
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          style={styles.editButton}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#24ad0c" />
          ) : (
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={isEditing ? handleImagePick : null}
            disabled={!isEditing}
          >
            {(formData.profile_image || userData.profile_image_url) ? (
              <Image
                source={{ uri: formData.profile_image || userData.profile_image_url }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.editImageBadge}>
                <Icon name="camera" size={16} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.statusBadge}>
              <Icon name="shield-checkmark" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{getDisplayName()}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <View style={styles.membershipBadge}>
            <Icon name="diamond" size={14} color="#24ad0c" />
            <Text style={styles.membershipText}>
              {userData.balance > 0 ? 'Premium User' : 'Basic User'}
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username *</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={formData.first_name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, first_name: text }))}
                  placeholder="Enter your first name"
                  placeholderTextColor="#666666"
                />
              ) : (
                <Text style={styles.infoText}>{userData.first_name || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={formData.last_name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, last_name: text }))}
                  placeholder="Enter your last name"
                  placeholderTextColor="#666666"
                />
              ) : (
                <Text style={styles.infoText}>{userData.last_name || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <Text style={[styles.infoText, styles.readOnlyText]}>{userData.email}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="+234 812 345 6789"
                  placeholderTextColor="#666666"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{userData.phone || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Member Since</Text>
              <Text style={styles.infoText}>{getJoinDate()}</Text>
            </View>
          </View>
        </View>

        {/* Account Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="scan" size={24} color="#24ad0c" />
              <Text style={styles.statNumber}>{userData.total_scans || 0}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="calendar" size={24} color="#24ad0c" />
              <Text style={styles.statNumber}>{userData.scans_this_month || 0}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            {/* <View style={styles.statCard}>
              <Icon name="bookmark" size={24} color="#24ad0c" />
              <Text style={styles.statNumber}>{userData.saved_matches_count || 0}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View> */}
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isUpdating}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChangePassword}
            >
              <Icon name="key" size={20} color="#24ad0c" />
              <Text style={styles.actionButtonText}>Change Password</Text>
              <Icon name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Icon name="shield-checkmark" size={20} color="#24ad0c" />
          <Text style={styles.securityText}>
            Your personal information is securely encrypted and protected.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Add these new styles to your existing StyleSheet
const styles = StyleSheet.create({
  // ... keep all existing styles and add these:
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#24ad0c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#24ad0c',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  readOnlyText: {
    color: '#666666',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
    container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#24ad0c',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#24ad0c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#24ad0c',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  membershipText: {
    color: '#24ad0c',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  form: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    paddingVertical: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#24ad0c',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#666666',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#24ad0c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionSection: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
    marginBottom: 12,
  },
  dangerAction: {
    borderColor: '#FF4444',
  },
  actionButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  dangerText: {
    color: '#FF4444',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24ad0c',
    marginBottom: 40,
  },
  securityText: {
    flex: 1,
    color: '#CCCCCC',
    fontSize: 12,
    marginLeft: 12,
    lineHeight: 16,
  },

});

export default ProfileInformationScreen;