// import {React, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Divider } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { useTheme } from '../src/context/ThemeContext';

// const ContactProfile = ({ navigation }) => {
  
//   const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
//   const [userData, setUserData] = useState([]);
//   const [userProfileImage, setUserProfileImage] = useState('');
//   const [profileData, setProfileData] = useState({});
//   const [logo, setLogo] = useState(null);

  
//   useEffect(() => {
//     console.log('Theme state in ContactProfile:', { theme, isDark, isAuto });
//   }, [theme, isDark, isAuto]);

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         const profile = Array.isArray(response.data) ? response.data[0] : response.data;
//         console.log('user_pixxxxxxxx',profile)
//         setProfileData(profile);
//         console.log('user business data', response.data);
//         if (profile.image) {
//           setLogo({ uri: `${API_ROUTE_IMAGE}${profile.image}` });
//         }
//       }
//     } catch (err) {
//       console.error('Failed to load profile', err);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleLogout = () => {
//     Alert.alert(
//       'Confirm Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: () => {
//             navigation.navigate('Signin_two'); 
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   const menuItems = [
//     { label: 'Account', icon: 'person-outline' },
//     { label: 'Chats', icon: 'chatbox-ellipses-outline' },
//     { label: 'Notifications', icon: 'notifications-outline' },
//     { label: 'Security / Privacy', icon: 'shield-checkmark-outline' },
//     { label: 'Wallpaper', icon: 'images-outline' },
//     { label: 'Theme', icon: 'contrast-outline', isTheme: true }, 
//     { label: 'Logout', icon: 'log-out-outline', isLogout: true },
//   ];

//   // Theme helper functions
//   const getThemeLabel = () => {
//     if (isAuto) return 'Auto';
//     return isDark ? 'Dark' : 'Light';
//   };

//   const getThemeIcon = () => {
//     if (isAuto) return 'contrast';
//     return isDark ? 'sunny-outline' : 'moon-outline';
//   };

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;

//       if (!token || !parsed?.id) {
//         console.error('Missing token or userID');
//         return null;
//       }

//       const response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {

//         setUserData(response.data);
//         const baseURL = `${API_ROUTE_IMAGE}`;
//         const profilePicture = response.data.profile_picture
//           ? `${baseURL}${response.data.profile_picture}`
//           : null;
//         setUserProfileImage(profilePicture);
//         console.log('user_profile_image', profilePicture);
//         console.log('res', response.data);
//         return parsed.id;
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         navigation.navigate('Login');
//       }
//       setUserProfileImage(null);
//       return null;
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const dynamicStyles = {
//     container: { flex: 1, backgroundColor: colors.background },
//     header: { 
//       flexDirection: 'row',
//       alignItems: 'center',
//       height: 150,
//       paddingHorizontal: 15,
//       backgroundColor: colors.primary 
//     },
//     profileImage: {
//       width: 120,
//       height: 120,
//       borderRadius: 60,
//       borderWidth: 3,
//       borderColor: '#fff',
//       backgroundColor: colors.surface || '#eee',
//     },
//     iconWrapper: {
//       padding: 10,
//       borderRadius: 10,
//       marginRight: 15,
//       backgroundColor: colors.surface || '#e0f0ff',
//     },
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary || colors.background }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'dark-content'}
//         translucent={Platform.OS === 'android'}
//         backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
//       />
//       <ScrollView style={{backgroundColor: colors.background}}>
//         <View style={dynamicStyles.container}>
//           <View style={dynamicStyles.header}>
//             <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
//               <Icon name="arrow-back" size={24} color="#fff" />
//               <Text style={[styles.headerTitle, {fontWeight:'700'}]}>Settings</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Profile */}
//           {profileData && profileData.id && (
//             <View style={styles.profileContainer}>
//               <Image
//                 source={logo || require('../assets/images/dad.jpg')}
//                 style={dynamicStyles.profileImage}
//               />
//               <View>
//                 <Text style={[styles.contactName, { color: colors.text }]}>{profileData.name}</Text>
//                 <Text style={[styles.contactPhone, { color: colors.textSecondary || colors.text }]}>{profileData.phone}</Text>
//               </View>
//             </View>
//           )}

//           {/* Divider */}
//           <View style={styles.actions}>
//             <Divider style={{backgroundColor: colors.border || '#f0f0f0'}} />
//           </View>

//           {/* Menu Items */}
//           <View style={styles.menu}>
//             {menuItems.map(({ label, icon, isLogout, isTheme }) => (
//               <TouchableOpacity
//                 key={label}
//                 style={[styles.menuItem, { borderBottomColor: colors.border || '#f0f0f0' }]}
//                 onPress={isLogout ? handleLogout : isTheme ? toggleTheme : () => {
//                   if (label === 'Notifications') {
//                     navigation.navigate('NotificationSetting');
//                   } else if (label === 'Wallpaper') {
//                     navigation.navigate('WallpaperSetting');
//                   } else if (label === 'Account') {
//                     navigation.navigate('ManageProfile');
//                   } else if (label === 'Chats') {
//                     navigation.navigate('BusinessHome');
//                   } else if (label === 'Security / Privacy') {
//                     navigation.navigate('FaceSecuritySetting');
//                   }
//                 }}
//               >
//                 <View style={styles.menuItemLeft}>
//                   <View style={[
//                     dynamicStyles.iconWrapper, 
//                     isLogout && styles.logoutIconBackground,
//                     isTheme && { backgroundColor: colors.primary + '20' }
//                   ]}>
//                     <Icon
//                       name={isTheme ? getThemeIcon() : icon}
//                       size={20}
//                       color={isLogout ? '#fff' : isTheme ? colors.primary : colors.primary}
//                     />
//                   </View>
//                   <View>
//                     <Text style={[styles.menuText, isLogout && styles.logoutText, { color: colors.text }]}>
//                       {label}
//                     </Text>
//                     {isTheme && (
//                       <Text style={[styles.themeSubtext, { color: colors.textSecondary || colors.text }]}>
//                         {getThemeLabel()} Mode
//                       </Text>
//                     )}
//                   </View>
//                 </View>
                
//                 {isTheme ? (
//                   <View style={styles.themeRightContent}>
//                     <Text style={[styles.themeLabel, { color: colors.textSecondary || colors.text }]}>
//                       {getThemeLabel()}
//                     </Text>
//                     <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary || colors.text} />
//                   </View>
//                 ) : (
//                   <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary || colors.text} />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   iconButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: -20,
//   },
//   headerTitle: {
//     fontSize: 25,
//     color: '#fff',
//     marginLeft: 10,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: -40,
//     zIndex: 10,
//     marginLeft: 30,
//   },
//   contactName: {
//     marginTop: 50,
//     fontSize: 22,
//     fontWeight: '700',
//     marginLeft: 20,
//   },
//   contactPhone: {
//     fontSize: 16,
//     marginBottom: 20,
//     marginLeft: 20,
//   },
//   actions: {
//     paddingVertical: 10,
//   },
//   menu: {
//     marginTop: 10,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   logoutIconBackground: {
//     backgroundColor: '#ff5c5c',
//   },
//   menuText: {
//     fontSize: 16,
//   },
//   logoutText: {
//     color: '#ff5c5c',
//     fontWeight: '600',
//   },
//   themeSubtext: {
//     fontSize: 12,
//     marginTop: 2,
//   },
//   themeRightContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   themeLabel: {
//     fontSize: 14,
//     marginRight: 8,
//   },
// });

// export default ContactProfile;

import {React, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

const ContactProfile = ({ navigation }) => {
  
  const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
  const [userData, setUserData] = useState([]);
  const [userProfileImage, setUserProfileImage] = useState('');
  const [profileData, setProfileData] = useState({});
  const [logo, setLogo] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    console.log('Theme state in ContactProfile:', { theme, isDark, isAuto });
  }, [theme, isDark, isAuto]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('user_pixxxxxxxx',profile)
        setProfileData(profile);
        console.log('user business data', response.data);
        if (profile.image) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.image}` });
        }
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear all user data from AsyncStorage
      await AsyncStorage.multiRemove([
        'userToken',
        'refreshToken',
        'userData',
        'isVerified',
        'userEmail',
        'userId',
        'accountMode',
        'chatBackground'
      ]);
      
      setLogoutModalVisible(false);
      navigation.navigate('Signin_two');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      Alert.alert('Reason Required', 'Please tell us why you want to delete your account.');
      return;
    }

    // if (!deletePassword.trim()) {
    //   Alert.alert('Password Required', 'Please enter your password to confirm account deletion.');
    //   return;
    // }

    setIsDeleting(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userDataStored = await AsyncStorage.getItem('userData');
      const parsedUser = userDataStored ? JSON.parse(userDataStored) : null;

      const response = await axios.post(
        `${API_ROUTE}/delete-account/`,
        {
          user_id: parsedUser?.id,
          password: deletePassword,
          reason: deleteReason,
          confirmation: true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Clear all user data
        await AsyncStorage.multiRemove([
          'userToken',
          'refreshToken',
          'userData',
          'isVerified',
          'userEmail',
          'userId',
          'accountMode',
          'chatBackground'
        ]);
        
        setDeleteModalVisible(false);
        Alert.alert(
          'Account Deleted',
          'Your account has been successfully deleted. We\'re sad to see you go!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Signin')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error deleting account:', error.response?.data || error.message);
      if (error.response?.data?.error === 'Invalid password') {
        Alert.alert('Invalid Password', 'The password you entered is incorrect. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to delete account. Please try again later.');
      }
    } finally {
      setIsDeleting(false);
      setDeletePassword('');
      setDeleteReason('');
    }
  };

  const menuItems = [
    { label: 'Account', icon: 'person-outline' },
    { label: 'Chats', icon: 'chatbox-ellipses-outline' },
    { label: 'Notifications', icon: 'notifications-outline' },
    { label: 'Security / Privacy', icon: 'shield-checkmark-outline' },
    { label: 'Wallpaper', icon: 'images-outline' },
    { label: 'Theme', icon: 'contrast-outline', isTheme: true },
    { label: 'Logout', icon: 'log-out-outline', isLogout: true, isSignOut: true },
    { label: 'Delete Account', icon: 'trash-outline', isDelete: true },
  ];

  // Theme helper functions
  const getThemeLabel = () => {
    if (isAuto) return 'Auto';
    return isDark ? 'Dark' : 'Light';
  };

  const getThemeIcon = () => {
    if (isAuto) return 'contrast';
    return isDark ? 'sunny-outline' : 'moon-outline';
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;

      if (!token || !parsed?.id) {
        console.error('Missing token or userID');
        return null;
      }

      const response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
        const baseURL = `${API_ROUTE_IMAGE}`;
        const profilePicture = response.data.profile_picture
          ? `${baseURL}${response.data.profile_picture}`
          : null;
        setUserProfileImage(profilePicture);
        console.log('user_profile_image', profilePicture);
        console.log('res', response.data);
        return parsed.id;
      }
    } catch (error) {
      console.error('Error fetching user:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigation.navigate('Signin');
      }
      setUserProfileImage(null);
      return null;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const dynamicStyles = {
    container: { flex: 1, backgroundColor: colors.background },
    header: { 
      flexDirection: 'row',
      alignItems: 'center',
      height: 150,
      paddingHorizontal: 15,
      backgroundColor: colors.primary 
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: '#fff',
      backgroundColor: colors.surface || '#eee',
    },
    iconWrapper: {
      padding: 10,
      borderRadius: 10,
      marginRight: 15,
      backgroundColor: colors.surface || '#e0f0ff',
    },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary || colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />
      <ScrollView style={{backgroundColor: colors.background}}>
        <View style={dynamicStyles.container}>
          <View style={dynamicStyles.header}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#fff" />
              <Text style={[styles.headerTitle, {fontWeight:'700'}]}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Profile */}
          {profileData && profileData.id && (
            <View style={styles.profileContainer}>
              <Image
                source={logo || require('../assets/images/dad.jpg')}
                style={dynamicStyles.profileImage}
              />
              <View>
                <Text style={[styles.contactName, { color: colors.text }]}>{profileData.name}</Text>
                <Text style={[styles.contactPhone, { color: colors.textSecondary || colors.text }]}>{profileData.phone}</Text>
              </View>
            </View>
          )}

          {/* Divider */}
          <View style={styles.actions}>
            <Divider style={{backgroundColor: colors.border || '#f0f0f0'}} />
          </View>

          {/* Menu Items */}
          <View style={styles.menu}>
            {menuItems.map(({ label, icon, isLogout, isTheme, isSignOut, isDelete }) => (
              <TouchableOpacity
                key={label}
                style={[styles.menuItem, { borderBottomColor: colors.border || '#f0f0f0' }]}
                onPress={() => {
                  if (isSignOut) {
                    handleLogout();
                  } else if (isDelete) {
                    handleDeleteAccount();
                  } else if (isTheme) {
                    toggleTheme();
                  } else {
                    if (label === 'Notifications') {
                      navigation.navigate('NotificationSetting');
                    } else if (label === 'Wallpaper') {
                      navigation.navigate('WallpaperSetting');
                    } else if (label === 'Account') {
                      navigation.navigate('ManageProfile');
                    } else if (label === 'Chats') {
                      navigation.navigate('BusinessHome');
                    } else if (label === 'Security / Privacy') {
                      navigation.navigate('FaceSecuritySetting');
                    }
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[
                    dynamicStyles.iconWrapper, 
                    isSignOut && styles.logoutIconBackground,
                    isDelete && styles.deleteIconBackground,
                    isTheme && { backgroundColor: colors.primary + '20' }
                  ]}>
                    <Icon
                      name={isTheme ? getThemeIcon() : icon}
                      size={20}
                      color={isSignOut ? '#fff' : isDelete ? '#fff' : isTheme ? colors.primary : colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={[
                      styles.menuText, 
                      isSignOut && styles.logoutText,
                      isDelete && styles.deleteText,
                      { color: colors.text }
                    ]}>
                      {label}
                    </Text>
                    {isTheme && (
                      <Text style={[styles.themeSubtext, { color: colors.textSecondary || colors.text }]}>
                        {getThemeLabel()} Mode
                      </Text>
                    )}
                    {isSignOut && (
                      <Text style={[styles.menuSubtext, { color: colors.textSecondary || colors.text }]}>
                        Temporary - can log back in
                      </Text>
                    )}
                    {isDelete && (
                      <Text style={[styles.menuSubtext, { color: '#ff5c5c' }]}>
                        Permanent - cannot recover
                      </Text>
                    )}
                  </View>
                </View>
                
                {isTheme ? (
                  <View style={styles.themeRightContent}>
                    <Text style={[styles.themeLabel, { color: colors.textSecondary || colors.text }]}>
                      {getThemeLabel()}
                    </Text>
                    <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary || colors.text} />
                  </View>
                ) : (
                  <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary || colors.text} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Icon name="log-out-outline" size={40} color="#ff9800" />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Logout</Text>
            </View>
            
            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              Logging out will temporarily log you out of your account. You can log back in anytime with your credentials.
            </Text>
            
            <View style={styles.infoBox}>
              <Icon name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Your account data, messages, and contacts will remain saved.
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton, { backgroundColor: '#ff9800' }]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.deleteModalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Icon name="warning-outline" size={50} color="#ff5c5c" />
              <Text style={[styles.modalTitle, { color: colors.text, marginTop: 10 }]}>Delete Account</Text>
            </View>
            
            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              This action is <Text style={{ fontWeight: 'bold', color: '#ff5c5c' }}>permanent and cannot be undone</Text>. All your data will be permanently erased.
            </Text>
            
            <View style={styles.warningBox}>
              <Icon name="alert-circle-outline" size={20} color="#ff5c5c" />
              <Text style={[styles.warningText, { color: '#ff5c5c' }]}>
                You will lose all messages, contacts, and account data.
              </Text>
            </View>
            
            {/* <Text style={[styles.inputLabel, { color: colors.text }]}>Why are you leaving? (Optional)</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
              placeholder="Tell us your reason..."
              placeholderTextColor={colors.textTertiary}
              value={deleteReason}
              onChangeText={setDeleteReason}
              multiline
              numberOfLines={3}
            /> */}
            
            {/* <Text style={[styles.inputLabel, { color: colors.text, marginTop: 15 }]}>Enter Password to Confirm</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
              placeholder="Your password"
              placeholderTextColor={colors.textTertiary}
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
            /> */}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeleteReason('');
                  setDeletePassword('');
                }}
                disabled={isDeleting}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton, { backgroundColor: '#ff5c5c' }]}
                onPress={confirmDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Delete Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  headerTitle: {
    fontSize: 25,
    color: '#fff',
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -40,
    zIndex: 10,
    marginLeft: 30,
  },
  contactName: {
    marginTop: 50,
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 20,
  },
  contactPhone: {
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 20,
  },
  actions: {
    paddingVertical: 10,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutIconBackground: {
    backgroundColor: '#ff9800',
  },
  deleteIconBackground: {
    backgroundColor: '#ff5c5c',
  },
  menuText: {
    fontSize: 16,
  },
  logoutText: {
    color: '#ff9800',
    fontWeight: '600',
  },
  deleteText: {
    color: '#ff5c5c',
    fontWeight: '600',
  },
  menuSubtext: {
    fontSize: 11,
    marginTop: 2,
  },
  themeSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  themeRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  deleteModalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 92, 92, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff9800',
  },
  deleteConfirmButton: {
    backgroundColor: '#ff5c5c',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactProfile;