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
import CatalogComponent from '../../showa_business/OthersUserCatalog';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UserProfile = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const userIdFromParams = route.params?.userId;
  
  const [selectedTab, setSelectedTab] = useState('posts');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState(null);

  const [profileData, setProfileData] = useState({
    user: null,
    recent_content: {
      listings: [],
      posts: [],
      videos: []
    },
    stats: {
      followers_count: 0,
      following_count: 0,
      is_following: false,
      listings_count: 0,
      posts_count: 0,
      videos_count: 0
    }
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

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dateLockMessage, setDateLockMessage] = useState('');
  const [catalogsCount, setCatalogsCount] = useState(0);

  const scrollViewRef = useRef(null);
  const catalogRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

      if (!token) {
        navigation.navigate('Login');
        return;
      }

      let response;
      try {
        response = await axios.get(`${API_ROUTE}/users/${targetUserId}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('User profile fetch response:', response.data);
      } catch (error) {
        // Fallback to profile profile
        if (!userIdFromParams) {
          response = await axios.get(`${API_ROUTE}/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      if (response?.status === 200) {
        const data = response.data;
        setProfileData(data);
        
        // Update follow stats from the data
        if (data.stats) {
          setFollowStats({
            followers_count: data.stats.followers_count || 0,
            following_count: data.stats.following_count || 0
          });
          setIsFollowing(data.stats.is_following || false);
        }

        // Set user images
        if (data.user?.profile_picture) {
          const profileImageUrl = getImageUrl(data.user.profile_picture);
          setUserProfileImage(profileImageUrl);
        }

        if (data.user?.cover_photo) {
          const coverImageUrl = getImageUrl(data.user.cover_photo);
          setUserCoverImage(coverImageUrl);
        }

        // Process recent content
        if (data.recent_content) {
          // Process marketplace listings
          if (data.recent_content.listings) {
            const processedListings = data.recent_content.listings.map(item => ({
              ...item,
              images: Array.isArray(item.images)
                ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
                : []
            }));
            setMarketplacePosts(processedListings);
          }

          // Process posts
          if (data.recent_content.posts) {
            const processedPosts = data.recent_content.posts.map(item => ({
              ...item,
              image_url: getImageUrl(item.image_url || item.image)
            }));
            setTweets(processedPosts);
          }

          // Process videos
          if (data.recent_content.videos) {
            const processedVideos = data.recent_content.videos.map(item => ({
              ...item,
              video_url: getImageUrl(item.video_url || item.video),
              thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
            }));
            setUserVideos(processedVideos);
          }
        }

        const lastUpdated = data.last_profile_update ? new Date(data.last_profile_update) : null;
        if (lastUpdated && !userIdFromParams) {
          const nextUpdateDate = new Date(lastUpdated);
          nextUpdateDate.setDate(nextUpdateDate.getDate() + 90);
          const today = new Date();
          const daysLeft = Math.ceil((nextUpdateDate - today) / (1000 * 60 * 60 * 24));
          if (daysLeft > 0) {
            setDateLockMessage(`Birthday can be changed in ${daysLeft} days`);
          }
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
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-stats/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setFollowStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error);
      // Use stats from profile data if available
      if (profileData.stats) {
        setFollowStats({
          followers_count: profileData.stats.followers_count || 0,
          following_count: profileData.stats.following_count || 0
        });
      }
    }
  };

  const checkFollowStatus = async () => {
    if (!userIdFromParams) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams;
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-status/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setIsFollowing(response.data.is_following);
        setFollowId(response.data.follow_id);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
      // Use is_following from profile data if available
      if (profileData.stats) {
        setIsFollowing(profileData.stats.is_following || false);
      }
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
      setFollowersList([]);
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
      setFollowingList([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/follow/`, {
        following_user: userIdFromParams
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setIsFollowing(true);
        setFollowId(response.data.follow_id);
        await fetchFollowStats();
        // Update profile data stats
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers_count: (prev.stats?.followers_count || 0) + 1,
            is_following: true
          }
        }));
      }
    } catch (error) {
      console.error('Error following user:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.post(`${API_ROUTE}/unfollow/`, {
        following_user: userIdFromParams
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setIsFollowing(false);
        setFollowId(null);
        await fetchFollowStats();
        // Update profile data stats
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers_count: Math.max(0, (prev.stats?.followers_count || 0) - 1),
            is_following: false
          }
        }));
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to unfollow user');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

      // For other users' profiles, use the user-specific endpoints
      if (userIdFromParams) {
        // Fetch posts for other user
        const tweetsEndpoint = `${API_ROUTE}/user-posts/${targetUserId}/`;
        console.log('Fetching posts from:', tweetsEndpoint);
        try {
          const tweetsRes = await axios.get(tweetsEndpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let postsData = tweetsRes.data?.data || 
                         (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
                         tweetsRes.data?.results || tweetsRes.data || []);
          const processedTweets = postsData.map(item => ({
            ...item,
            image_url: getImageUrl(item.image_url || item.image)
          }));
          setTweets(processedTweets);
        } catch (error) {
          console.error('Error fetching posts:', error);
          // Use posts from profile data if available
          if (profileData.recent_content?.posts) {
            setTweets(profileData.recent_content.posts);
          }
        }

        // Fetch videos for other user
        const videosEndpoint = `${API_ROUTE}/user-shorts/${targetUserId}/`;
        console.log('Fetching videos from:', videosEndpoint);
        try {
          const videosRes = await axios.get(videosEndpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let videosData = videosRes.data?.data || 
                          (Array.isArray(videosRes.data) ? videosRes.data : 
                          videosRes.data?.results || videosRes.data || []);
          const processedVideos = videosData.map(item => ({
            ...item,
            video_url: getImageUrl(item.video_url || item.video),
            thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
          }));
          setUserVideos(processedVideos);
        } catch (error) {
          console.error('Error fetching videos:', error);
          // Use videos from profile data if available
          if (profileData.recent_content?.videos) {
            setUserVideos(profileData.recent_content.videos);
          }
        }

        // Fetch marketplace listings for other user
        const marketplaceEndpoint = `${API_ROUTE}/user-listings/${targetUserId}/`;
        console.log('Fetching listings from:', marketplaceEndpoint);
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
          console.error('Error fetching listings:', error);
          // Use listings from profile data if available
          if (profileData.recent_content?.listings) {
            setMarketplacePosts(profileData.recent_content.listings);
          }
        }
      } else {
        // Fetch own posts
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
            image_url: getImageUrl(item.image_url || item.image)
          }));
          setTweets(processedTweets);
        } catch (error) {
          console.error('Error fetching own posts:', error);
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
            video_url: getImageUrl(item.video_url || item.video),
            thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
          }));
          setUserVideos(processedVideos);
        } catch (error) {
          console.error('Error fetching own videos:', error);
          setUserVideos([]);
        }

        // Fetch own marketplace posts
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
          console.error('Error fetching own listings:', error);
          setMarketplacePosts([]);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserPosts:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        await fetchUserData();
        await fetchFollowStats();
        await fetchUserPosts();
        if (userIdFromParams) {
          await checkFollowStatus();
        }
      } catch (error) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userIdFromParams || true) {
      fetchData();
    }
  }, [userIdFromParams]);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const FollowItem = ({ item, type }) => {
    const [isFollowingUser, setIsFollowingUser] = useState(item.is_following || false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
      const getCurrentUser = async () => {
        const userId = await AsyncStorage.getItem('userId');
        setCurrentUserId(userId ? parseInt(userId) : null);
      };
      getCurrentUser();
    }, []);

    const handleFollowAction = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (isFollowingUser) {
          await axios.post(`${API_ROUTE}/unfollow/`, {
            following_user: item.id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFollowingUser(false);
        } else {
          await axios.post(`${API_ROUTE}/follow/`, {
            following_user: item.id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFollowingUser(true);
        }
        // Refresh the lists
        if (type === 'followers') await fetchFollowersList();
        if (type === 'following') await fetchFollowingList();
      } catch (error) {
        console.error('Error in follow action:', error);
      }
    };

    const showFollowButton = () => {
      if (currentUserId && item.id === currentUserId) return false;
      return true;
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
            
            {item.username && (
              <Text style={[styles.followUsername, { color: colors.textSecondary }]}>
                {`@${item.username || ''}`}
              </Text>
            )}
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
              isFollowingUser ? styles.followingButton : styles.followButtonn
            ]}
            onPress={handleFollowAction}
          >
            <Text style={[styles.followActionText, { color: isFollowingUser ? colors.text : '#fff' }]}>
              {isFollowingUser ? 'Following' : type === 'followers' ? 'Follow Back' : 'Follow'}
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
          if (item.video_url || item.video) {
            navigation.navigate('VideoPlayer', { 
              videoUrl: item.video_url || item.video,
              videoData: item 
            });
          }
        }}
        activeOpacity={0.9}
      >
        <View style={styles.videoThumbnailContainer}>
          {item.thumbnail_url || item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail_url || item.thumbnail }}
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
        {item.category_name && (
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
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
        {item.location && (
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        )}
        <Text style={[styles.sellerName, { color: colors.textSecondary }]}>
          {item.seller_name || 'Unknown Seller'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTweet = ({ item }) => (
    <View style={[styles.tweetCard, { backgroundColor: colors.card }]}>
      <View style={styles.tweetHeader}>
        <Image
          source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
          style={styles.tweetAvatar}
        />
        <View style={styles.tweetHeaderInfo}>
          <Text style={[styles.tweetUserName, { color: colors.text }]}>
            {profileData.user?.name || 'User'}
          </Text>
          <Text style={[styles.tweetTimestamp, { color: colors.textSecondary }]}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </View>
      <Text style={[styles.tweetContent, { color: colors.text }]}>
        {item.content || 'No content'}
      </Text>
      {item.image_url && (
        <TouchableOpacity onPress={() => setFullScreenImage({ visible: true, src: item.image_url, type: 'post' })}>
          <Image
            source={{ uri: item.image_url }}
            style={styles.tweetImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
      <View style={styles.tweetActions}>
        <TouchableOpacity style={styles.tweetAction}>
          <Icon name="heart-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.like_count || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tweetAction}>
          <Icon name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.comment_count || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tweetAction}>
          <Icon name="repeat-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.share_count || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCatalogDataLoaded = (data) => {
    setCatalogsCount(data.catalogs.length);
  };

  const handleViewAllCatalogs = () => {
  
    setSelectedTab('catalogs');
    navigation.navigate('AllCatalogs', { userId: userIdFromParams });
  };

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
          {!userIdFromParams && !userCoverImage && (
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
            {!userIdFromParams && (
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
                {profileData.user?.name || ''}
              </Text>
              {profileData.user?.is_verified && (
                <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.verifiedBadge} />
              )}
            </View>
            <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
              @{profileData.user?.username || profileData.user?.name.toLocaleString()}
            </Text>
          </View>
        </View>

        {profileData.user?.bio && (
          <Text style={[styles.profileBio, { color: colors.text }]}>
            {profileData.user.bio}
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
              {formatNumber(followStats.following_count || profileData.stats?.following_count || 0)}
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
              {formatNumber(followStats.followers_count || profileData.stats?.followers_count || 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Followers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatNumber(
                (profileData.stats?.posts_count || 0) + 
                (profileData.stats?.videos_count || 0) + 
                (profileData.stats?.listings_count || 0)
              )}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Posts
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          {!userIdFromParams ? (
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
              {profileData.user?.active_mode === 'business' ? (
                <TouchableOpacity
                  style={[styles.messageButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('BPrivateChat', {
                    receiverId: userIdFromParams,
                    name: profileData.user?.name,
                    profile_image: userProfileImage
                  })}
                >
                  <Icon name="chatbubble-outline" size={18} color="#fff" />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.messageButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('PrivateChat', {
                    receiverId: userIdFromParams,
                    name: profileData.user?.name,
                    profile_image: userProfileImage
                  })}
                >
                  <Icon name="chatbubble-outline" size={18} color="#fff" />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  styles.followButton, 
                  isFollowing ? styles.followingButton : { borderColor: colors.primary }
                ]}
                onPress={isFollowing ? handleUnfollow : handleFollow}
              >
                <Icon 
                  name={isFollowing ? 'person-remove-outline' : 'person-add-outline'} 
                  size={18} 
                  color={isFollowing ? colors.text : colors.primary} 
                />
                <Text style={[
                  styles.followButtonText, 
                  { color: isFollowing ? colors.text : colors.primary }
                ]}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.additionalInfo}>
          {profileData.user?.country && (
            <View style={styles.infoItem}>
              <Icon name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {profileData.user.country}
              </Text>
            </View>
          )}
          {profileData.user?.date_of_birth && (
            <View style={styles.infoItem}>
              <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Birthday: {formatDate(profileData.user.date_of_birth)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );

  //============== Catalog section display ==================

  const renderCatalogSection = () => (
    <View style={[styles.catalogSection, { backgroundColor: colors.card }]}>
      {profileData.user?.active_mode === 'business' && (
        <View style={styles.catalogHeader}>
        <View style={styles.catalogTitleContainer}>
          <Icon name="folder-outline" size={20} color={colors.primary} />
          <Text style={[styles.catalogTitle, { color: colors.text }]}>Catalogs</Text>
        </View>
        {catalogsCount > 0 && (
          <TouchableOpacity onPress={handleViewAllCatalogs} style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <Icon name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      )}
      {profileData.user?.active_mode === 'business' && (
        <CatalogComponent
            ref={catalogRef}
            userId={userIdFromParams}
            businessId={userIdFromParams}
            horizontal={true}
            showHeader={false}
            showBusinessInfo={false}
            maxItems={5}
            navigation={navigation}
            containerStyle={styles.catalogContainer}
            onDataLoaded={handleCatalogDataLoaded}
        />

      )}
       
     
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'catalogs':
        return (
          <View style={styles.fullCatalogSection}>
            <CatalogComponent
              ref={catalogRef}
              userId={userIdFromParams}
              businessId={userIdFromParams}
              horizontal={false}
              showHeader={false}
              showBusinessInfo={false}
              navigation={navigation}
              containerStyle={styles.fullCatalogContainer}
            />
          </View>
        );
      
      case 'posts':
        if (tweets.length === 0) {
          return (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
              <Icon name="chatbubble-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {userIdFromParams ? "This user hasn't posted anything yet." : "You haven't posted anything yet."}
              </Text>
            </View>
          );
        }
        return (
          <FlatList
            key="posts-list"
            data={tweets}
            renderItem={renderTweet}
            keyExtractor={(item) => `posts-${item.id}`}
            contentContainerStyle={styles.contentList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        );
      
      case 'videos':
        if (userVideos.length === 0) {
          return (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
              <Icon name="videocam-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {userIdFromParams ? "This user hasn't uploaded any videos yet." : "You haven't uploaded any videos yet."}
              </Text>
            </View>
          );
        }
        return (
          <FlatList
            key="videos-list"
            data={userVideos}
            renderItem={renderVideo}
            keyExtractor={(item) => `videos-${item.id}`}
            contentContainerStyle={styles.contentList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        );
      
      case 'marketplace':
        if (marketplacePosts.length === 0) {
          return (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
              <Icon name="cart-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {userIdFromParams ? "This user hasn't listed any items yet." : "You haven't listed any items yet."}
              </Text>
            </View>
          );
        }
        return (
          <FlatList
            key="marketplace-grid"
            data={marketplacePosts}
            renderItem={renderMarketplacePost}
            keyExtractor={(item) => `marketplace-${item.id}`}
            numColumns={2}
            contentContainerStyle={styles.contentList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        );
      
      default:
        return null;
    }
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

      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {profileData.user?.name || 'Profile'}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderProfileHeader()}
        
        {/* Catalog Section - Displayed prominently at the top */}
        {renderCatalogSection()}
        
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'posts' && styles.tabActive, selectedTab === 'posts' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('posts')}
          >
            <Icon name="chatbubble-outline" size={20} color={selectedTab === 'posts' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: selectedTab === 'posts' ? colors.primary : colors.textSecondary }]}>
              Posts ({tweets.length || profileData.stats?.posts_count || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'videos' && styles.tabActive, selectedTab === 'videos' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('videos')}
          >
            <Icon name="videocam-outline" size={20} color={selectedTab === 'videos' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: selectedTab === 'videos' ? colors.primary : colors.textSecondary }]}>
              Videos ({userVideos.length || profileData.stats?.videos_count || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'marketplace' && styles.tabActive, selectedTab === 'marketplace' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('marketplace')}
          >
            <Icon name="cart-outline" size={20} color={selectedTab === 'marketplace' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: selectedTab === 'marketplace' ? colors.primary : colors.textSecondary }]}>
              Listings ({marketplacePosts.length || profileData.stats?.listings_count || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </ScrollView>

      <Modal visible={fullScreenImage.visible} transparent animationType="fade" onRequestClose={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
        <View style={[styles.fullScreenModal, { backgroundColor: '#000' }]}>
          <TouchableOpacity style={[styles.fullScreenClose, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: fullScreenImage.src }} style={styles.fullScreenImage} resizeMode="contain" />
          <View style={[styles.fullScreenLabel, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Text style={styles.fullScreenLabelText}>
              {fullScreenImage.type === 'profile' ? 'Profile Picture' : 
               fullScreenImage.type === 'cover' ? 'Cover Photo' : 'Post Image'}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {!userIdFromParams && (
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

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 16, 
    fontWeight: '500' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  headerButton: { 
    padding: 8 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600',
    flex: 1,
    textAlign: 'center'
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1 
  },
  profileHeader: { 
    marginBottom: 8 
  },
  coverImage: { 
    width: '100%', 
    height: 180, 
    justifyContent: 'flex-end', 
    alignItems: 'center' 
  },
  addCoverButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
  },
  addCoverText: { 
    color: '#fff', 
    marginLeft: 8, 
    fontSize: 14, 
    fontWeight: '500'
  },
  profileInfoContainer: { 
    padding: 20, 
    marginTop:-40
  },
  profileImageSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  profileImageWrapper: { 
    position: 'relative', 
    marginRight: 16 
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 4, 
    backgroundColor: '#f0f0f0' 
  },
  changePhotoButton: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 3, 
    borderColor: '#fff', 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4 
  },
  profileTextInfo: { 
    flex: 1 
  },
  nameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap' 
  },
  profileName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginRight: 8, 
  },
  verifiedBadge: { 
    marginLeft: 4 
  },
  profileUsername: { 
    fontSize: 16, 
    marginTop: 4 
  },
  modeBadge: { 
    alignSelf: 'flex-start',
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4, 
    marginTop: 4 
  },
  modeText: { 
    fontSize: 11, 
    fontWeight: '500' 
  },
  profileBio: { 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 20 
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 24, 
    paddingVertical: 16, 
    borderTopWidth: 1, 
    borderBottomWidth: 1 
  },
  statItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  statNumber: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 6 
  },
  statLabel: { 
    fontSize: 13 
  },
  actionButtons: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20 
  },
  editButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 25, 
    gap: 8, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  editButtonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: '600' 
  },
  settingsButton: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  messageButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 25, 
    gap: 8, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  messageButtonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: '600' 
  },
  followButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 25, 
    borderWidth: 1.5,
    gap: 8 
  },
  followButtonn: {
    backgroundColor: '#0653f8ff', 
    borderWidth: 0 
  },
  followingButton: { 
    backgroundColor: '#E1E1E1', 
    borderWidth: 0 
  },
  followButtonText: { 
    fontSize: 15, 
    fontWeight: '600' 
  },
  additionalInfo: { 
    gap: 12 
  },
  infoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
  },
  infoText: { 
    fontSize: 14, 
    flex: 1 
  },
  ageText: { 
    fontSize: 13, 
    opacity: 0.8 
  },
  // Catalog Section Styles
  catalogSection: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  catalogTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catalogTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  catalogContainer: {
    minHeight: 180,
  },
  fullCatalogSection: {
    flex: 1,
    minHeight: 400,
    padding: 8,
  },
  fullCatalogContainer: {
    flex: 1,
  },
  tabContainer: { 
    flexDirection: 'row', 
    marginTop: 8,
    paddingHorizontal: 8
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    gap: 6, 
    borderBottomWidth: 2, 
    borderBottomColor: 'transparent' 
  },
  tabActive: { 
    borderBottomWidth: 2 
  },
  tabText: { 
    fontSize: 13, 
    fontWeight: '500' 
  },
  contentList: { 
    padding: 8 
  },
  marketplaceCard: { 
    flex: 1, 
    margin: 6, 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  marketplaceImageContainer: { 
    height: 140,
    position: 'relative'
  },
  marketplaceImage: { 
    width: '100%', 
    height: '100%' 
  },
  marketplaceImagePlaceholder: { 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  categoryBadge: { 
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4 
  },
  categoryBadgeText: { 
    color: '#fff',
    fontSize: 10,
    fontWeight: '600' 
  },
  marketplaceContent: { 
    padding: 12 
  },
  marketplaceTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 6 
  },
  marketplacePrice: { 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  locationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4 
  },
  locationText: { 
    fontSize: 11, 
    marginLeft: 4 
  },
  sellerName: { 
    fontSize: 11, 
    marginTop: 4 
  },
  tweetCard: { 
    padding: 16, 
    borderRadius: 12, 
    margin: 8, 
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2 
  },
  tweetHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  tweetAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 12 
  },
  tweetHeaderInfo: { 
    flex: 1 
  },
  tweetUserName: { 
    fontSize: 15, 
    fontWeight: '600', 
    marginBottom: 2 
  },
  tweetTimestamp: { 
    fontSize: 12 
  },
  tweetContent: { 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 12 
  },
  tweetImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8 
  },
  tweetActions: { 
    flexDirection: 'row', 
    marginTop: 12, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(0,0,0,0.05)' 
  },
  tweetAction: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 24 
  },
  tweetActionText: { 
    fontSize: 13, 
    marginLeft: 6 
  },
  videoCard: {
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoThumbnailContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  videoInfo: {
    padding: 12,
  },
  videoCaption: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  videoDate: {
    fontSize: 11,
  },
  emptyContainer: { 
    padding: 40, 
    alignItems: 'center', 
    borderRadius: 12, 
    margin: 16, 
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2 
  },
  emptyText: { 
    marginTop: 16, 
    fontSize: 16, 
    textAlign: 'center', 
    lineHeight: 24 
  },
  fullScreenModal: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fullScreenClose: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 60 : 40, 
    right: 20, 
    zIndex: 1, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fullScreenImage: { 
    width: screenWidth, 
    height: screenHeight * 0.7 
  },
  fullScreenLabel: { 
    position: 'absolute', 
    bottom: 40, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  fullScreenLabelText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 20 
  },
  modalOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    gap: 16 
  },
  modalOptionText: { 
    fontSize: 16, 
    fontWeight: '500', 
    flex: 1 
  },
  modalDivider: { 
    height: 1, 
    marginHorizontal: 16 
  },
  followModal: { 
    height: '80%', 
    marginTop: 'auto', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    overflow: 'hidden' 
  },
  followModalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1 
  },
  followModalTitle: { 
    fontSize: 18, 
    fontWeight: '600' 
  },
  followList: { 
    padding: 16 
  },
  followItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  followItemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  followAvatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12 
  },
  followInfo: { 
    flex: 1 
  },
  followName: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 2 
  },
  followUsername: { 
    fontSize: 13 
  },
  followBio: { 
    fontSize: 12, 
    marginTop: 2 
  },
  followActionButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    minWidth: 100, 
    alignItems: 'center' 
  },
  followActionText: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  followLoader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyFollow: { 
    padding: 40, 
    alignItems: 'center' 
  },
  emptyFollowText: { 
    fontSize: 16 
  }
});

export default UserProfile;