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

  // Log theme state for debugging
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
        setProfileData(profile);
        console.log('user business data', response.data);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
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
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Signin_two'); 
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    { label: 'Account', icon: 'person-outline' },
    { label: 'Chats', icon: 'chatbox-ellipses-outline' },
    { label: 'Notifications', icon: 'notifications-outline' },
    { label: 'Security / Privacy', icon: 'shield-checkmark-outline' },
    { label: 'Wallpaper', icon: 'images-outline' },
    { label: 'Theme', icon: 'contrast-outline', isTheme: true }, 
    { label: 'Logout', icon: 'log-out-outline', isLogout: true },
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
        navigation.navigate('Login');
      }
      setUserProfileImage(null);
      return null;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Create dynamic styles based on theme
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
            {menuItems.map(({ label, icon, isLogout, isTheme }) => (
              <TouchableOpacity
                key={label}
                style={[styles.menuItem, { borderBottomColor: colors.border || '#f0f0f0' }]}
                onPress={isLogout ? handleLogout : isTheme ? toggleTheme : () => {
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
                }}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[
                    dynamicStyles.iconWrapper, 
                    isLogout && styles.logoutIconBackground,
                    isTheme && { backgroundColor: colors.primary + '20' }
                  ]}>
                    <Icon
                      name={isTheme ? getThemeIcon() : icon}
                      size={20}
                      color={isLogout ? '#fff' : isTheme ? colors.primary : colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={[styles.menuText, isLogout && styles.logoutText, { color: colors.text }]}>
                      {label}
                    </Text>
                    {isTheme && (
                      <Text style={[styles.themeSubtext, { color: colors.textSecondary || colors.text }]}>
                        {getThemeLabel()} Mode
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
    backgroundColor: '#ff5c5c',
  },
  menuText: {
    fontSize: 16,
  },
  logoutText: {
    color: '#ff5c5c',
    fontWeight: '600',
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
});

export default ContactProfile;