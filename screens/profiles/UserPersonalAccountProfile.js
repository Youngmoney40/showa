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
  FlatList,
  Animated,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext';
import ManagePost from '../../showa_business/ManagePost';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UserProfile = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const userIdFromParams = route.params?.userId;
  
  const [selectedTab, setSelectedTab] = useState('marketplace');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState({
    visible: false,
    src: '',
    type: 'profile',
  });
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);

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
  const [businessProfile, setBusinessProfile] = useState(null);
  const [catalogData, setCatalogData] = useState([]);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [followStats, setFollowStats] = useState({
    followers_count: 0,
    following_count: 0
  });

  const [isEditing, setIsEditing] = useState(false);
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

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dateLockMessage, setDateLockMessage] = useState('');

  const scrollViewRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const checkProfileOwnership = async () => {
      if (userIdFromParams) {
        const currentUserId = await AsyncStorage.getItem('userId');
        setIsOwnProfile(userIdFromParams === currentUserId);
      } else {
        const userDataStr = await AsyncStorage.getItem('userData');
        const userData = userDataStr ? JSON.parse(userDataStr) : null;
        if (userData?.id) {
          setIsOwnProfile(true);
        }
      }
    };
    checkProfileOwnership();
  }, [userIdFromParams]);

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      return null;
    }
    
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
      let url = imagePath;
      if (url.includes('showa.essential.com.ngmedia')) {
        url = url.replace('showa.essential.com.ngmedia', 'showa.essential.com.ng/media');
      }
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      if (url.includes('showa.essential.com.ng/') && 
          !url.includes('showa.essential.com.ng/media/') &&
          (url.includes('profile_pics') || url.includes('cover_photos') ||
           url.includes('catalog_images') || url.includes('marketplace_images') ||
           url.includes('post_images'))) {
        url = url.replace('showa.essential.com.ng/', 'showa.essential.com.ng/media/');
      }
      return url;
    }
    
    if (typeof imagePath === 'object') {
      if (imagePath.image) return getImageUrl(imagePath.image);
      if (imagePath.url) return getImageUrl(imagePath.url);
      if (imagePath.media) return getImageUrl(imagePath.media);
      return null;
    }
    
    if (typeof imagePath === 'string') {
      let cleanPath = imagePath;
      if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
      }
      if (!cleanPath.startsWith('media/')) {
        if (cleanPath.includes('profile_pics') || cleanPath.includes('cover_photos') ||
            cleanPath.includes('catalog_images') || cleanPath.includes('marketplace_images') ||
            cleanPath.includes('post_images') || cleanPath.includes('image_') ||
            cleanPath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
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
    }
  };

  const fetchFollowStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userDataStr = await AsyncStorage.getItem('userData');
      const currentUser = userDataStr ? JSON.parse(userDataStr) : null;
      
      let endpoint;
      if (isOwnProfile || !userIdFromParams) {
        endpoint = `${API_ROUTE}/me/follow-stats/`;
      } else {
        endpoint = `${API_ROUTE}/users/${userIdFromParams}/follow-stats/`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setFollowStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  const fetchFollowersList = async () => {
    setLoadingFollowers(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/followers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setFollowersList(response.data.followers || []);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      Alert.alert('Error', 'Failed to load followers');
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowingList = async () => {
    setLoadingFollowers(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/following/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setFollowingList(response.data.following || []);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
      Alert.alert('Error', 'Failed to load following');
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/follow/`, {
        following_user: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        await fetchFollowersList();
        await fetchFollowingList();
        await fetchFollowStats();
      }
    } catch (error) {
      console.error('Error following user:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.post(`${API_ROUTE}/unfollow/`, {
        following_user: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        await fetchFollowersList();
        await fetchFollowingList();
        await fetchFollowStats();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to unfollow user');
    }
  };

  const checkFollowStatus = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/users/${userId}/follow-status/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return { is_following: false };
    }
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
        if (editForm[key] !== undefined && editForm[key] !== null && key !== 'date_of_birth') {
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

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
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

  const fetchUserPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!isOwnProfile && userIdFromParams) {
        setMarketplacePosts([]);
        setTweets([]);
        setUserVideos([]);
        return;
      }

      const marketplaceEndpoint = `${API_ROUTE}/my-listings/`;
      try {
        const marketplaceRes = await axios.get(marketplaceEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let listingsData = marketplaceRes.data?.data || 
                          (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
                          marketplaceRes.data?.results || marketplaceRes.data || []);
        const processedPosts = listingsData.map(item => ({
          ...item,
          images: Array.isArray(item.images)
            ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
            : []
        }));
        setMarketplacePosts(processedPosts);
      } catch (error) {
        setMarketplacePosts([]);
      }

      const tweetsEndpoint = `${API_ROUTE}/my-posts/`;
      try {
        const tweetsRes = await axios.get(tweetsEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let postsData = tweetsRes.data?.data || 
                       (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
                       tweetsRes.data?.results || tweetsRes.data || []);
        const processedTweets = postsData.map(item => ({
          ...item,
          image: getImageUrl(item.image || item.media)
        }));
        setTweets(processedTweets);
      } catch (error) {
        setTweets([]);
      }

      const videosEndpoint = `${API_ROUTE}/my-shorts/`;
      try {
        const videosRes = await axios.get(videosEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let videosData = videosRes.data?.data || 
                        (Array.isArray(videosRes.data) ? videosRes.data : 
                        videosRes.data?.results || videosRes.data || []);
        const processedVideos = videosData.map(item => ({
          ...item,
          video: getImageUrl(item.video),
          thumbnail: getImageUrl(item.thumbnail)
        }));
        setUserVideos(processedVideos);
      } catch (error) {
        setUserVideos([]);
      }
    } catch (error) {
      console.error('Error in fetchUserPosts:', error);
    }
  };

  const fetchBusinessCatalog = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!isOwnProfile) return;
      const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        const processedCatalog = (response.data || []).map(item => {
          const images = [];
          if (item.image) {
            images.push({ id: item.id, image: getImageUrl(item.image), is_main: true });
          }
          return { ...item, images: images, main_image: getImageUrl(item.image) };
        });
        setCatalogData(processedCatalog);
      }
    } catch (error) {
      setCatalogData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        await fetchUserData();
        await fetchFollowStats();
        if (isOwnProfile) {
          await fetchUserPosts();
          await fetchBusinessCatalog();
        } else {
          setMarketplacePosts([]);
          setTweets([]);
          setUserVideos([]);
          setCatalogData([]);
        }
      } catch (error) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOwnProfile, userIdFromParams]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const FollowItem = ({ item, type }) => {
    const [isFollowing, setIsFollowing] = useState(item.is_following || false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
      const getCurrentUser = async () => {
        const userId = await AsyncStorage.getItem('userId');
        setCurrentUserId(userId ? parseInt(userId) : null);
      };
      getCurrentUser();
    }, []);

    const handleFollowAction = async () => {
      if (isFollowing) {
        await handleUnfollow(item.id);
        setIsFollowing(false);
      } else {
        await handleFollow(item.id);
        setIsFollowing(true);
      }
    };

    const showFollowButton = () => {
      if (!isOwnProfile) return true;
      if (isOwnProfile && currentUserId && item.id !== currentUserId) return true;
      return false;
    };

    return (
      <View style={[styles.followItem, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.followItemLeft}
          onPress={() => {
            if (type === 'followers') setFollowersModalVisible(false);
            if (type === 'following') setFollowingModalVisible(false);
            navigation.push('UserProfile', { userId: item.id });
          }}
        >
          <Image
            source={item.profile_picture ? { uri: getImageUrl(item.profile_picture) } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
            style={styles.followAvatar}
          />
          <View style={styles.followInfo}>
            <Text style={[styles.followName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.followUsername, { color: colors.textSecondary }]}>@{item.username}</Text>
            {item.bio && (
              <Text style={[styles.followBio, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.bio}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        {showFollowButton() && (
          <TouchableOpacity
            style={[
              styles.followActionButton, 
              isFollowing ? styles.followingButton : styles.followButton
            ]}
            onPress={handleFollowAction}
          >
            <Text style={[styles.followActionText, { color: isFollowing ? colors.text : '#fff' }]}>
              {isFollowing ? 'Following' : type === 'followers' ? 'Follow Back' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderVideo = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.videoCard, { backgroundColor: colors.card }]}
        onPress={() => {
          if (item.video) {
            navigation.navigate('VideoPlayer', { 
              videoUrl: item.video,
              videoData: item 
            });
          }
        }}
        activeOpacity={0.9}
      >
        <View style={styles.videoThumbnailContainer}>
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.videoPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
              <Icon name="videocam-outline" size={40} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.playButtonOverlay}>
            <View style={[styles.playButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <Icon name="play" size={24} color="#fff" />
            </View>
          </View>
          {item.duration && (
            <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}
        </View>
        <View style={styles.videoInfo}>
          <Text style={[styles.videoCaption, { color: colors.text }]} numberOfLines={2}>
            {item.caption || 'Untitled Video'}
          </Text>
          <View style={styles.videoStats}>
            <View style={styles.statItem}>
              <Icon name="heart-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.like_count || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="chatbubble-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.comment_count || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="eye-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.view_count || 0}
              </Text>
            </View>
          </View>
          <Text style={[styles.videoDate, { color: colors.textSecondary }]}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMarketplacePost = ({ item }) => (
    <TouchableOpacity
      style={[styles.marketplaceCard, { backgroundColor: colors.card }]}
      onPress={() => {
        setSelectedProduct(item);
        setProductModalVisible(true);
      }}
      activeOpacity={0.9}
    >
      <View style={styles.marketplaceImageContainer}>
        {item.images?.[0]?.image ? (
          <Image
            source={{ uri: item.images[0].image }}
            style={styles.marketplaceImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.marketplaceImagePlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="cube-outline" size={40} color={colors.textSecondary} />
          </View>
        )}
      </View>
      <View style={styles.marketplaceContent}>
        <Text style={[styles.marketplaceTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title || 'No Title'}
        </Text>
        <Text style={[styles.marketplacePrice, { color: colors.primary }]}>
          ₦{parseFloat(item.price || 0).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTweet = ({ item }) => (
    <View style={[styles.tweetCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.tweetContent, { color: colors.text }]}>
        {item.content || 'No content'}
      </Text>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.tweetImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  const renderProfileHeader = () => (
    <Animated.View style={[styles.profileHeader, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      <TouchableOpacity
        onPress={() => userCoverImage && setFullScreenImage({ visible: true, src: userCoverImage, type: 'cover' })}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={userCoverImage ? { uri: userCoverImage } : require('../../assets/images/_gluster_2024_3_5_241efce82619d6785221985f79b3edf3_original.53958 (1).jpg')}
          style={styles.coverImage}
          resizeMode="cover"
        >
          {isOwnProfile && !userCoverImage && (
            <TouchableOpacity
              style={[styles.addCoverButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)' }]}
              onPress={() => handleImageSelection('cover')}
            >
              <Icon name="camera-outline" size={24} color="#fff" />
              <Text style={styles.addCoverText}>Add Cover</Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.profileInfoContainer}>
        <View style={styles.profileImageSection}>
          <TouchableOpacity
            onPress={() => userProfileImage && setFullScreenImage({ visible: true, src: userProfileImage, type: 'profile' })}
            style={styles.profileImageWrapper}
          >
            <Image
              source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
              style={[styles.profileImage, { borderColor: colors.card }]}
            />
            {isOwnProfile && (
              <TouchableOpacity
                style={[styles.changePhotoButton, { backgroundColor: colors.primary }]}
                onPress={() => handleImageSelection('profile')}
              >
                <Icon name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          
          <View style={styles.profileTextInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {userData.name || 'No Name'}
              </Text>
              {userData.is_verified && (
                <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.verifiedBadge} />
              )}
            </View>
            <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
              @{userData.username || userData.name.toLocaleLowerCase()}
            </Text>
          </View>
        </View>

        {userData.bio && (
          <Text style={[styles.profileBio, { color: colors.text }]}>
            {userData.bio}
          </Text>
        )}

        <View style={[styles.statsContainer, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => {
              fetchFollowingList();
              setFollowingModalVisible(true);
            }}
          >
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatNumber(followStats.following_count)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Following
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => {
              fetchFollowersList();
              setFollowersModalVisible(true);
            }}
          >
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatNumber(followStats.followers_count)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Followers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatNumber(marketplacePosts.length + tweets.length + userVideos.length)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Posts
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          {isOwnProfile ? (
            <>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => setIsEditing(true)}
              >
                <Icon name="create-outline" size={18} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.settingsButton, { borderColor: colors.border }]}
                onPress={() => navigation.navigate('Settings')}
              >
                <Icon name="settings-outline" size={18} color={colors.text} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.messageButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('PrivateChat', {
                  receiverId: userIdFromParams,
                  name: userData.name,
                  profile_image: userProfileImage
                })}
              >
                <Icon name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.followButton, { borderColor: colors.primary }]}
                onPress={async () => {
                  const status = await checkFollowStatus(userIdFromParams);
                  if (status.is_following) {
                    handleUnfollow(userIdFromParams);
                  } else {
                    handleFollow(userIdFromParams);
                  }
                }}
              >
                <Icon 
                  name="person-add-outline" 
                  size={18} 
                  color={colors.primary} 
                />
                <Text style={[styles.followButtonText, { color: colors.primary }]}>
                  Follow
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.additionalInfo}>
          {userData.country && (
            <View style={styles.infoItem}>
              <Icon name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {userData.country}
              </Text>
            </View>
          )}
          {userData.date_of_birth && (
            <View style={styles.infoItem}>
              <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Born {formatDate(userData.date_of_birth)}
                {calculateAge(userData.date_of_birth) && (
                  <Text style={[styles.ageText, { color: colors.textSecondary }]}> • {calculateAge(userData.date_of_birth)} years</Text>
                )}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderEditForm = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.editFormContainer, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editFormContent}>
        <View style={[styles.editForm, { backgroundColor: colors.card }]}>
          <View style={[styles.editFormHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                setError('');
                setSuccessMessage('');
                setEditForm({
                  name: userData.name || '',
                  username: userData.username || '',
                  email: userData.email || '',
                  bio: userData.bio || '',
                  country: userData.country || '',
                  gender: userData.gender || '',
                  date_of_birth: userData.date_of_birth ? userData.date_of_birth.split('T')[0] : '',
                  phone: userData.phone || '',
                  active_mode: userData.active_mode || 'personal'
                });
                setProfileImageFile(null);
                setCoverPhotoFile(null);
              }}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.editFormTitle, { color: colors.text }]}>Edit Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: isDark ? '#2C1810' : '#FEF2F2' }]}>
              <Icon name="alert-circle" size={20} color="#DC2626" />
              <Text style={[styles.errorText, { color: isDark ? '#FCA5A5' : '#DC2626' }]}>{error}</Text>
            </View>
          )}

          {successMessage && (
            <View style={[styles.successContainer, { backgroundColor: isDark ? '#052E16' : '#D1FAE5' }]}>
              <Icon name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.successText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>{successMessage}</Text>
            </View>
          )}

          <View style={styles.imageUploadSection}>
            <TouchableOpacity onPress={() => handleImageSelection('cover')} style={styles.coverUploadSection}>
              <ImageBackground
                source={userCoverImage ? { uri: userCoverImage } : require('../../assets/images/_gluster_2024_3_5_241efce82619d6785221985f79b3edf3_original.53958 (1).jpg')}
                style={styles.coverPreview}
                resizeMode="cover"
              >
                <View style={[styles.coverOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
                  <Icon name="camera-outline" size={28} color="#fff" />
                  <Text style={styles.uploadLabel}>Change Cover Photo</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <View style={styles.profileUploadSection}>
              <TouchableOpacity onPress={() => handleImageSelection('profile')} style={styles.profileImageUpload}>
                <Image
                  source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
                  style={[styles.profilePreview, { borderColor: colors.card }]}
                />
                <View style={[styles.profileUploadOverlay, { backgroundColor: colors.primary }]}>
                  <Icon name="camera" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.profileUploadHint, { color: colors.textSecondary }]}>
                Tap to change profile photo
              </Text>
            </View>
          </View>

          <View style={styles.formFields}>
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Full Name *</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={editForm.name}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Username *</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={editForm.username}
                onChangeText={(text) => setEditForm({...editForm, username: text})}
                placeholder="Choose a username"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Bio</Text>
              <TextInput
                style={[styles.formInput, styles.textArea, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm({...editForm, bio: text})}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                maxLength={160}
              />
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {editForm.bio?.length || 0}/160
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={editForm.email}
                onChangeText={(text) => setEditForm({...editForm, email: text})}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={editForm.phone}
                onChangeText={(text) => setEditForm({...editForm, phone: text})}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Country</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={editForm.country}
                onChangeText={(text) => setEditForm({...editForm, country: text})}
                placeholder="Enter your country"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Date of Birth</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, opacity: 0.7 }]}
                value={editForm.date_of_birth}
                editable={false}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
              {dateLockMessage && (
                <Text style={[styles.lockMessage, { color: '#FFA500' }]}>
                  {dateLockMessage}
                </Text>
              )}
              {editForm.date_of_birth && (
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                  Age: {calculateAge(editForm.date_of_birth) || 'N/A'} years
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary, opacity: profileLoading ? 0.7 : 1 }]}
            onPress={updateUserProfile}
            disabled={profileLoading}
          >
            {profileLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="save-outline" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => setIsEditing(false)}
            disabled={profileLoading}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderContent = () => {
    const data = selectedTab === 'marketplace' ? marketplacePosts :
                 selectedTab === 'tweets' ? tweets : userVideos;
    
    const emptyMessage = isOwnProfile ?
      `You haven't posted any ${selectedTab} yet.` :
      `This user hasn't posted any ${selectedTab} yet.`;

    if (data.length === 0) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
          <Icon 
            name={selectedTab === 'marketplace' ? 'cart-outline' : selectedTab === 'tweets' ? 'chatbubble-outline' : 'videocam-outline'} 
            size={60} 
            color={colors.textSecondary} 
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {emptyMessage}
          </Text>
          {isOwnProfile && selectedTab === 'marketplace' && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CreateListing')}
            >
              <Text style={styles.createButtonText}>Create Listing</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    const getRenderItem = () => {
      switch (selectedTab) {
        case 'marketplace': return renderMarketplacePost;
        case 'tweets': return renderTweet;
        case 'videos': return renderVideo;
        default: return renderMarketplacePost;
      }
    };

    const listKey = selectedTab === 'marketplace' ? 'marketplace-grid' :
                    selectedTab === 'tweets' ? 'tweets-list' : 'videos-list';

    return (
      <FlatList
        key={listKey}
        data={data}
        renderItem={getRenderItem()}
        keyExtractor={(item) => `${selectedTab}-${item.id}`}
        numColumns={selectedTab === 'marketplace' ? 2 : 1}
        contentContainerStyle={styles.contentList}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {isEditing ? (
        renderEditForm()
      ) : (
        <>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {userData.name || 'Profile'}
            </Text>
            <TouchableOpacity style={styles.headerButton} onPress={() => setModalVisible(true)}>
              <Icon name="ellipsis-vertical" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

        
         
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
  {renderProfileHeader()}
  
  {/* Only show Manage Catalog button if it's the user's own profile AND they're in business mode */}
  {isOwnProfile && userData.active_mode === 'business' && (
    <View style={{backgroundColor:'#2e43e7ff', borderRadius:30,padding:10, marginHorizontal:30, marginTop:10}}>
      <TouchableOpacity onPress={()=>navigation.navigate('CreateCatalog')}>
        <Text style={{color:'#fff', fontSize:18, textAlign:'center'}}>Manage Catalog</Text>
      </TouchableOpacity>
    </View>
  )}
  
  <ManagePost />
</ScrollView>
        </>
      )}

      <Modal visible={fullScreenImage.visible} transparent animationType="fade" onRequestClose={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
        <View style={[styles.fullScreenModal, { backgroundColor: '#000' }]}>
          <TouchableOpacity style={[styles.fullScreenClose, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: fullScreenImage.src }} style={styles.fullScreenImage} resizeMode="contain" />
          <View style={[styles.fullScreenLabel, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Text style={styles.fullScreenLabelText}>
              {fullScreenImage.type === 'profile' ? 'Profile Picture' : 'Cover Photo'}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {isOwnProfile && (
              <>
                <TouchableOpacity style={styles.modalOption} onPress={() => { setModalVisible(false); setIsEditing(true); }}>
                  <Icon name="create-outline" size={22} color={colors.text} />
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={() => navigation.navigate('Settings')}>
                  <Icon name="settings-outline" size={22} color={colors.text} />
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>Settings</Text>
                </TouchableOpacity>
                <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />
              </>
            )}
            <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={22} color={colors.text} />
              <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={followersModalVisible} transparent animationType="slide" onRequestClose={() => setFollowersModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.followModal, { backgroundColor: colors.card }]}>
            <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.followModalTitle, { color: colors.text }]}>Followers</Text>
              <TouchableOpacity onPress={() => setFollowersModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {loadingFollowers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
            ) : (
              <FlatList
                data={followersList}
                renderItem={({ item }) => <FollowItem item={item} type="followers" />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.followList}
                ListEmptyComponent={
                  <View style={styles.emptyFollow}>
                    <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>No followers yet</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={followingModalVisible} transparent animationType="slide" onRequestClose={() => setFollowingModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.followModal, { backgroundColor: colors.card }]}>
            <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.followModalTitle, { color: colors.text }]}>Following</Text>
              <TouchableOpacity onPress={() => setFollowingModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {loadingFollowers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
            ) : (
              <FlatList
                data={followingList}
                renderItem={({ item }) => <FollowItem item={item} type="following" />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.followList}
                ListEmptyComponent={
                  <View style={styles.emptyFollow}>
                    <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>Not following anyone yet</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const videoCard = {
  margin: 8,
  borderRadius: 12,
  overflow: 'hidden',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
};

const videoThumbnailContainer = {
  position: 'relative',
  height: 180,
  backgroundColor: '#f0f0f0',
};

const videoThumbnail = {
  width: '100%',
  height: '100%',
};

const videoPlaceholder = {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

const playButtonOverlay = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
};

const playButton = {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
};

const durationBadge = {
  position: 'absolute',
  bottom: 8,
  right: 8,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
};

const durationText = {
  color: '#fff',
  fontSize: 12,
  fontWeight: '500',
};

const videoInfo = {
  padding: 12,
};

const videoCaption = {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 8,
};

const videoStats = {
  flexDirection: 'row',
  marginBottom: 6,
};

const statItem = {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 16,
};

const statText = {
  fontSize: 12,
  marginLeft: 4,
};

const videoDate = {
  fontSize: 11,
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  videoCard,
  videoThumbnailContainer,
  videoThumbnail,
  videoPlaceholder,
  playButtonOverlay,
  playButton,
  durationBadge,
  durationText,
  videoInfo,
  videoCaption,
  videoStats,
  statItem,
  statText,
  videoDate,
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '500' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  profileHeader: { marginBottom: 8 },
  coverImage: { width: '100%', height: 180, justifyContent: 'flex-end', alignItems: 'center' },
  addCoverButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  addCoverText: { color: '#fff', marginLeft: 8, fontSize: 14, fontWeight: '500' },
  profileInfoContainer: { padding: 20, marginTop:-15 },
  profileImageSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop:-20 },
  profileImageWrapper: { position: 'relative', marginRight: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, backgroundColor: '#f0f0f0' },
  changePhotoButton: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  profileTextInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  profileName: { fontSize: 24, fontWeight: 'bold', marginRight: 8 },
  verifiedBadge: { marginLeft: 4 },
  profileUsername: { fontSize: 16, marginTop: 4 },
  profileBio: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  statLabel: { fontSize: 13 },
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  editButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  settingsButton: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  messageButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  messageButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  followButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, borderWidth: 1.5, gap: 8 },
  followButtonText: { fontSize: 15, fontWeight: '600' },
  additionalInfo: { gap: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 14, flex: 1 },
  ageText: { fontSize: 13, opacity: 0.8 },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomWidth: 2 },
  tabText: { fontSize: 14, fontWeight: '600' },
  tabBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, minWidth: 24, alignItems: 'center' },
  tabBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  contentList: { padding: 8 },
  marketplaceCard: { flex: 1, margin: 6, borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  marketplaceImageContainer: { height: 140 },
  marketplaceImage: { width: '100%', height: '100%' },
  marketplaceImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  marketplaceContent: { padding: 12 },
  marketplaceTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  marketplacePrice: { fontSize: 15, fontWeight: 'bold' },
  tweetCard: { padding: 16, borderRadius: 12, margin: 8, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  tweetContent: { fontSize: 15, lineHeight: 22, marginBottom: 12 },
  tweetImage: { width: '100%', height: 200, borderRadius: 8 },
  emptyContainer: { padding: 40, alignItems: 'center', borderRadius: 12, margin: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  emptyText: { marginTop: 16, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  createButton: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  createButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  editFormContainer: { flex: 1 },
  editFormContent: { flexGrow: 1 },
  editForm: { flex: 1, paddingBottom: 40 },
  editFormHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  editFormTitle: { fontSize: 18, fontWeight: '600' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 8, padding: 12, borderRadius: 8, gap: 10 },
  errorText: { fontSize: 14, flex: 1 },
  successContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 8, padding: 12, borderRadius: 8, gap: 10 },
  successText: { fontSize: 14, flex: 1 },
  imageUploadSection: { marginTop: 16 },
  coverUploadSection: { height: 120, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  coverPreview: { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  uploadLabel: { color: '#fff', marginTop: 8, fontSize: 14, fontWeight: '500' },
  profileUploadSection: { alignItems: 'center', marginTop: -30, marginBottom: 24 },
  profileImageUpload: { position: 'relative' },
  profilePreview: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, backgroundColor: '#f0f0f0' },
  profileUploadOverlay: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  profileUploadHint: { marginTop: 10, fontSize: 13 },
  formFields: { paddingHorizontal: 16 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  formInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', fontSize: 12, marginTop: 4 },
  lockMessage: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  hintText: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  genderOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genderOption: { flex: 1, minWidth: 80, paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  genderOptionSelected: { borderColor: 'transparent' },
  genderOptionText: { fontSize: 14, fontWeight: '500' },
  saveButton: { marginHorizontal: 16, marginTop: 24, marginBottom: 12, paddingVertical: 16, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: { marginHorizontal: 16, paddingVertical: 16, borderRadius: 25, alignItems: 'center', borderWidth: 1 },
  cancelButtonText: { fontSize: 16, fontWeight: '600' },
  fullScreenModal: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullScreenClose: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, zIndex: 1, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: screenWidth, height: screenHeight * 0.7 },
  fullScreenLabel: { position: 'absolute', bottom: 40, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  fullScreenLabelText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalOption: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 16 },
  modalOptionText: { fontSize: 16, fontWeight: '500', flex: 1 },
  modalDivider: { height: 1, marginHorizontal: 16 },
  followModal: { height: '80%', marginTop: 'auto', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  followModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  followModalTitle: { fontSize: 18, fontWeight: '600' },
  followList: { padding: 16 },
  followItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  followItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  followAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  followInfo: { flex: 1 },
  followName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  followUsername: { fontSize: 13 },
  followBio: { fontSize: 12, marginTop: 2 },
  followActionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, minWidth: 100, alignItems: 'center' },
  followButton: { backgroundColor: '#007AFF' },
  followingButton: { backgroundColor: '#E1E1E1' },
  followActionText: { fontSize: 14, fontWeight: '600' },
  followLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyFollow: { padding: 40, alignItems: 'center' },
  emptyFollowText: { fontSize: 16 },
});

export default UserProfile;