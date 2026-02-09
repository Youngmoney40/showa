import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Iconn from 'react-native-vector-icons/MaterialIcons';

const UserProfile = ({ navigation }) => {
  const redirectToHomeChat = () => {
    navigation.navigate('PHome');
  };

  const [userData, setUserData] = useState([]);
  const [userProfileImage, setUserProfileImage] = useState('');

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;

      if (!token || !parsed?.id) return null;

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
      }
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigation.navigate('Login');
      }
      setUserProfileImage(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const menuItems = [
    { label: 'View Media', icon: 'images-outline' },
    { label: 'Share Contact', icon: 'share-social-outline' },
    { label: 'Block Contact', icon: 'close-circle-outline' },
  ];

  const handleMenuPress = (label) => {
    if (['Settings', 'Notifications'].includes(label)) {
      navigation.navigate('Settings');
    } else if (['View Media'].includes(label)) {
      navigation.navigate('UserMedia');
    } else if (['Share Contact'].includes(label)) {
      navigation.navigate('Share');
    } else {
      navigation.navigate('PHome');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={redirectToHomeChat}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
      </View>

      {/* Profile */}
      {userData && userData.id && (
        <View style={styles.profileContainer}>
          <Image
            source={
              userProfileImage
                ? { uri: userProfileImage }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.profileImage}
          />
          <Text style={styles.contactName}>{userData.name}</Text>
          <Text style={styles.contactPhone}>{userData.phone}</Text>
          
          {/* Following/Followers Section */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>1.2K</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>5.8K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
          </View>
          
         
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Iconn style={{backgroundColor:'#0d64dd', padding:15, borderRadius:50}} name="message" size={24} color="#fff" />
          <Text style={styles.quickActionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon style={{backgroundColor:'#0d64dd', padding:15, borderRadius:50}}  name="call" size={24} color="#fff" />
          <Text style={styles.quickActionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon style={{backgroundColor:'#0d64dd', padding:15, borderRadius:50}}  name="notifications-off" size={24} color="#fff" />
          <Text style={styles.quickActionText}>Mute</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {menuItems.map(({ label, icon }) => (
          <TouchableOpacity
            key={label}
            style={styles.menuItem}
            onPress={() => handleMenuPress(label)}
          >
            <View style={styles.menuIconWrapper}>
              <Icon name={icon} size={22} color="#0d64dd" />
            </View>
            <Text style={styles.menuText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 130,
    paddingHorizontal: 15,
    backgroundColor: '#0d64dd',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: -20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -50,
    zIndex: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  contactName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  blogContact: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default UserProfile;
