


import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
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
  RefreshControl,
  Pressable,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext';
import CatalogComponent from '../../showa_business/OthersUserCatalog';
import Video from 'react-native-video';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PLAYBACK_RATE = 1;

// ==================== CACHE KEYS ====================
const PROFILE_CACHE_KEY = '@user_profile_cache_v2';
const POSTS_CACHE_KEY = '@user_posts_cache_v2';
const FOLLOW_STATS_CACHE_KEY = '@user_follow_stats_cache_v2';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// ==================== HELPER FUNCTIONS ====================
const convertToHttps = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
  
  let convertedUrl = url.replace('http://', 'https://');
  
  if (convertedUrl.includes('api.showapp.ngmedia')) {
    convertedUrl = convertedUrl.replace('api.showapp.ngmedia', 'api.showapp.ng/media');
  }
  
  if (convertedUrl.includes('api.showapp.ng/') && 
      !convertedUrl.includes('api.showapp.ng/media/') &&
      (convertedUrl.includes('profile_pics') || convertedUrl.includes('cover_photos') ||
       convertedUrl.includes('catalog_images') || convertedUrl.includes('marketplace_images') ||
       convertedUrl.includes('post_images'))) {
    convertedUrl = convertedUrl.replace('api.showapp.ng/', 'api.showapp.ng/media/');
  }
  
  return convertedUrl;
};

const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
    return null;
  }
  
  if (typeof imagePath === 'object') {
    if (imagePath.image) return getImageUrl(imagePath.image);
    if (imagePath.url) return getImageUrl(imagePath.url);
    return null;
  }
  
  if (typeof imagePath === 'string') {
    if (imagePath.startsWith('http')) {
      return convertToHttps(imagePath);
    }
    
    let cleanPath = imagePath;
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    let baseUrl = API_ROUTE_IMAGE;
    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/';
    }
    
    const fullUrl = `${baseUrl}${cleanPath}`;
    return convertToHttps(fullUrl);
  }
  
  return null;
};

// ==================== VIDEO PLAYER COMPONENT ====================
const VideoPlayer = memo(({ uri, isPlaying, onPress, style }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const secureUri = uri ? convertToHttps(uri) : null;

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [secureUri]);

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={[style, styles.videoPlayerContainer]}
    >
      {secureUri ? (
        <Video
          ref={videoRef}
          source={{ uri: secureUri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          repeat={false}
          muted={true}
          paused={!isPlaying}
          rate={PLAYBACK_RATE}
          onLoadStart={() => setIsLoading(true)}
          onLoad={(data) => {
            setIsLoading(false);
            setDuration(data.duration);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      ) : null}
      
      {isLoading && (
        <View style={styles.videoLoading}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
      
      {hasError && (
        <View style={styles.videoError}>
          <MaterialIcon name="alert-circle" size={24} color="#fff" />
          <Text style={styles.errorText}>Failed to load</Text>
        </View>
      )}
      
      {!isPlaying && !isLoading && !hasError && secureUri && (
        <View style={styles.playOverlay}>
          <View style={styles.playIconContainer}>
            <MaterialIcon name="play-arrow" size={28} color="#fff" />
          </View>
        </View>
      )}
      
      {duration > 0 && !isPlaying && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatTime(duration)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

// ==================== VIDEO GRID ITEM ====================
const VideoGridItem = memo(({ item, onPress, colors, isPlaying }) => {
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Pressable 
      onPress={() => onPress(item)}
      style={[
        styles.videoGridItem,
        { backgroundColor: colors.card }
      ]}
    >
      <VideoPlayer
        uri={item.video || item.video_url}
        isPlaying={isPlaying}
        onPress={() => onPress(item)}
        style={styles.videoGridPlayer}
      />
      
      <View style={styles.videoViewsOverlay}>
        <Icon name="eye-outline" size={12} color="#fff" />
        <Text style={styles.videoViewsText}>{formatNumber(item.view_count || 0)}</Text>
      </View>
      
      {item.like_count > 0 && (
        <View style={styles.videoLikeOverlay}>
          <Icon name="heart-outline" size={12} color="#fff" />
          <Text style={styles.videoLikeText}>{formatNumber(item.like_count)}</Text>
        </View>
      )}
      
      {item.comment_count > 0 && (
        <View style={styles.videoCommentOverlay}>
          <Icon name="chatbubble-outline" size={10} color="#fff" />
          <Text style={styles.videoCommentText}>{formatNumber(item.comment_count)}</Text>
        </View>
      )}
    </Pressable>
  );
});

// ==================== POST GRID ITEM ====================
// ==================== POST GRID ITEM ====================
const PostGridItem = memo(({ item, onPress, colors }) => {
  const imageUrl = item.image_url ? getImageUrl(item.image_url) : null;

  return (
    <TouchableOpacity 
      onPress={() => onPress(item)}  
      style={[styles.gridItem, { backgroundColor: colors.card }]}
    >
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.gridImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.gridPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="document-text-outline" size={30} color={colors.textSecondary} />
        </View>
      )}
      
      {item.like_count > 0 && (
        <View style={styles.reactionBadge}>
          <Icon name="heart" size={12} color="#fff" />
          <Text style={styles.reactionBadgeText}>
            {item.like_count > 999 ? `${(item.like_count / 1000).toFixed(1)}K` : item.like_count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

// ==================== MARKETPLACE GRID ITEM ====================
const MarketplaceGridItem = memo(({ item, onPress, colors }) => {
  const imageUrl = item.images && item.images.length > 0 ? getImageUrl(item.images[0].image) : null;
  
  return (
    <Pressable 
      onPress={() => onPress(item)}
      style={[styles.marketplaceGridItem, { backgroundColor: colors.card }]}
    >
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.gridImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.gridPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="cart-outline" size={30} color={colors.textSecondary} />
        </View>
      )}
      
      <View style={styles.marketplacePriceBadge}>
        <Text style={styles.marketplacePriceText}>
          ₦{parseFloat(item.price || 0).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
});

// ==================== FOLLOW ITEM COMPONENT ====================
const FollowItem = ({ item, type, colors, handleFollow, handleUnfollow, fetchFollowStats }) => {
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
      
      if (fetchFollowStats) {
        fetchFollowStats();
      }
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
          // Navigation handled by parent
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
              @{item.username}
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

// ==================== MAIN USER PROFILE COMPONENT ====================
const UserProfile = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const userIdFromParams = route.params?.userId;
  
  // ============ STATE ============
  const [selectedTab, setSelectedTab] = useState('posts');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [followStats, setFollowStats] = useState({
    followers_count: 0,
    following_count: 0
  });

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);

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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [catalogsCount, setCatalogsCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const scrollViewRef = useRef(null);
  const catalogRef = useRef(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 500,
  });
  

const checkBlockStatus = useCallback(async () => {
  if (!userIdFromParams) return;
  
  try {
    const token = await AsyncStorage.getItem('userToken');
    // Use the same endpoint pattern as BlockedUsersList
    const response = await axios.get(`${API_ROUTE}/block-status/${userIdFromParams}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 200) {
      setIsBlocked(response.data.is_blocked || false);
    }
  } catch (error) {
    console.error('Error checking block status:', error);
    // If API call fails, check if user is in blocked list
    try {
      const blockedListResponse = await axios.get(`${API_ROUTE}/blocked-users/`, {
        headers: { Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}` }
      });
      if (blockedListResponse.data.success) {
        const blockedUsers = blockedListResponse.data.blocked_users || [];
        const isBlocked = blockedUsers.some(user => user.id === parseInt(userIdFromParams));
        setIsBlocked(isBlocked);
      }
    } catch (fallbackError) {
      console.error('Fallback check failed:', fallbackError);
    }
  }
}, [userIdFromParams]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && selectedTab === 'videos') {
      const visibleItem = viewableItems[0];
      setPlayingVideoId(visibleItem.item.id);
    } else {
      setPlayingVideoId(null);
    }
  }, [selectedTab]);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged }
  ]);

  // ============ CACHE HELPERS ============
  const saveToCache = useCallback(async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Cache save error:', error);
    }
  }, []);

  const getFromCache = useCallback(async (key) => {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }, []);

  // ============ DATA FETCHING WITH CACHE ============
  const fetchUserData = useCallback(async () => {
    try {
      const cachedData = await getFromCache(PROFILE_CACHE_KEY);
      if (cachedData && mountedRef.current) {
        setProfileData(cachedData);
        if (cachedData.user?.profile_picture) {
          setUserProfileImage(getImageUrl(cachedData.user.profile_picture));
        }
        if (cachedData.user?.cover_photo) {
          setUserCoverImage(getImageUrl(cachedData.user.cover_photo));
        }
        if (cachedData.stats) {
          setFollowStats({
            followers_count: cachedData.stats.followers_count || 0,
            following_count: cachedData.stats.following_count || 0
          });
          setFollowers(cachedData.stats.followers_count || 0);
          setFollowing(cachedData.stats.following_count || 0);
          setIsFollowing(cachedData.stats.is_following || false);
        }
        setHasLoadedOnce(true);
        setLoading(false);
      }

      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

      if (!token) {
        navigation.navigate('Login');
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      let response;
      try {
        response = await axios.get(`${API_ROUTE}/users/${targetUserId}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: abortControllerRef.current.signal,
        });
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (!userIdFromParams) {
          response = await axios.get(`${API_ROUTE}/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: abortControllerRef.current.signal,
          });
        }
      }

      if (response?.status === 200 && mountedRef.current) {
        const data = response.data;
        setProfileData(data);
        saveToCache(PROFILE_CACHE_KEY, data);
        
        if (data.user?.profile_picture) {
          setUserProfileImage(getImageUrl(data.user.profile_picture));
        }
        if (data.user?.cover_photo) {
          setUserCoverImage(getImageUrl(data.user.cover_photo));
        }
        if (data.stats) {
          setFollowStats({
            followers_count: data.stats.followers_count || 0,
            following_count: data.stats.following_count || 0
          });
          setFollowers(data.stats.followers_count || 0);
          setFollowing(data.stats.following_count || 0);
          setIsFollowing(data.stats.is_following || false);
        }
        setHasLoadedOnce(true);
        setLoading(false);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching user:', error);
      if (!hasLoadedOnce) {
        setLoading(false);
      }
    }
  }, [getFromCache, saveToCache, navigation, userIdFromParams, hasLoadedOnce]);

  const fetchFollowStats = useCallback(async () => {
    try {
      const cachedStats = await getFromCache(FOLLOW_STATS_CACHE_KEY);
      if (cachedStats && mountedRef.current) {
        setFollowStats(cachedStats);
        setFollowers(cachedStats.followers_count || 0);
        setFollowing(cachedStats.following_count || 0);
      }

      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-stats/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortControllerRef.current?.signal,
        timeout: 5000,
      });

      if (response.status === 200 && mountedRef.current) {
        const newStats = {
          followers_count: response.data.followers_count || 0,
          following_count: response.data.following_count || 0
        };
        setFollowStats(newStats);
        setFollowers(newStats.followers_count);
        setFollowing(newStats.following_count);
        saveToCache(FOLLOW_STATS_CACHE_KEY, newStats);
        
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers_count: response.data.followers_count || 0,
            following_count: response.data.following_count || 0
          }
        }));
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching follow stats:', error);
      if (profileData.stats) {
        setFollowStats({
          followers_count: profileData.stats.followers_count || 0,
          following_count: profileData.stats.following_count || 0
        });
        setFollowers(profileData.stats.followers_count || 0);
        setFollowing(profileData.stats.following_count || 0);
      }
    }
  }, [getFromCache, saveToCache, userIdFromParams, profileData.stats]);

  const fetchUserPosts = useCallback(async () => {
    try {
      const cachedPosts = await getFromCache(POSTS_CACHE_KEY);
      if (cachedPosts && mountedRef.current) {
        setMarketplacePosts(cachedPosts.marketplace || []);
        setTweets(cachedPosts.tweets || []);
        setUserVideos(cachedPosts.videos || []);
      }

      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

      if (!token) return;

      const results = { marketplace: [], tweets: [], videos: [] };

      // Fetch tweets/posts
      try {
        const endpoint = userIdFromParams 
          ? `${API_ROUTE}/user-posts/${targetUserId}/`
          : `${API_ROUTE}/my-posts/`;
        const tweetsRes = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortControllerRef.current?.signal,
          timeout: 5000,
        });
        let postsData = tweetsRes.data?.data || 
                       (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
                       tweetsRes.data?.results || tweetsRes.data || []);
        results.tweets = postsData.map(item => ({
          ...item,
          image_url: getImageUrl(item.image_url || item.image)
        }));
      } catch (error) {
        if (error.name === 'AbortError') return;
        results.tweets = [];
      }

      // Fetch videos
      try {
        const endpoint = userIdFromParams 
          ? `${API_ROUTE}/user-shorts/${targetUserId}/`
          : `${API_ROUTE}/my-shorts/`;
        const videosRes = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortControllerRef.current?.signal,
          timeout: 5000,
        });
        let videosData = [];
        if (videosRes.data.data) {
          videosData = videosRes.data.data;
        } else if (Array.isArray(videosRes.data)) {
          videosData = videosRes.data;
        } else if (videosRes.data.results) {
          videosData = videosRes.data.results;
        }
        results.videos = videosData.map(item => ({
          ...item,
          id: item.id,
          video_url: getImageUrl(item.video),
          video: getImageUrl(item.video),
          thumbnail_url: item.thumbnail_url ? getImageUrl(item.thumbnail_url) : null,
          user: item.user,
          caption: item.caption,
          like_count: item.like_count || 0,
          comment_count: item.comment_count || 0,
          view_count: item.view_count || 0,
          created_at: item.created_at,
          is_liked: item.is_liked || false,
          comments: item.comments || []
        }));
      } catch (error) {
        if (error.name === 'AbortError') return;
        results.videos = [];
      }

      // Fetch marketplace posts
      try {
        const endpoint = userIdFromParams 
          ? `${API_ROUTE}/user-listings/${targetUserId}/`
          : `${API_ROUTE}/my-listings/`;
        const marketplaceRes = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortControllerRef.current?.signal,
          timeout: 5000,
        });
        let listingsData = marketplaceRes.data?.data || 
                          (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
                          marketplaceRes.data?.results || marketplaceRes.data || []);
        results.marketplace = listingsData.map(item => ({
          ...item,
          images: Array.isArray(item.images)
            ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
            : []
        }));
      } catch (error) {
        if (error.name === 'AbortError') return;
        results.marketplace = [];
      }

      if (mountedRef.current) {
        setMarketplacePosts(results.marketplace);
        setTweets(results.tweets);
        setUserVideos(results.videos);
        saveToCache(POSTS_CACHE_KEY, results);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error in fetchUserPosts:', error);
    }
  }, [getFromCache, getImageUrl, saveToCache, userIdFromParams]);

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

  // ============ FOLLOW FUNCTIONS ============
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
        setFollowers(prev => prev + 1);
        await fetchFollowStats();
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
        setFollowers(prev => Math.max(0, prev - 1));
        await fetchFollowStats();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to unfollow user');
    }
  };

  
  const handleReportUser = async () => {
    if (!reportReason) {
      Alert.alert('Reason Required', 'Please select a reason for reporting this user.');
      return;
    }

    setReportLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/report/${userIdFromParams}/`,
        { reason: reportReason.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Report Submitted',
          'Thank you for reporting. We will review this user and take appropriate action.'
        );
        setReportModalVisible(false);
        setReportReason('');
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

// const handleBlockUser = async () => {
//   setBlockLoading(true);
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.post(
//       `${API_ROUTE}/block/${userIdFromParams}/`,
//       { blocked_user_id: userIdFromParams },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     if (response.status === 200 || response.status === 201) {
//       setIsBlocked(true);
//       Alert.alert(
//         'User Blocked',
//         `You have successfully blocked ${profileData.user?.name || 'this user'}. They will no longer be able to interact with you.`,
//         [{ text: 'OK', onPress: () => navigation.goBack() }]
//       );
//       setBlockModalVisible(false);
//       setOptionsModalVisible(false);
//     }
//   } catch (error) {
//     console.error('Error blocking user:', error);
//     Alert.alert('Error', error.response?.data?.error || 'Failed to block user. Please try again.');
//   } finally {
//     setBlockLoading(false);
//   }
// };

const handleBlockUser = async () => {
  setBlockLoading(true);
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(
      `${API_ROUTE}/block/${userIdFromParams}/`,
      { blocked_user_id: userIdFromParams },
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (response.status === 200 || response.status === 201) {
      setIsBlocked(true);
      Alert.alert(
        'User Blocked',
        `You have successfully blocked ${profileData.user?.name || 'this user'}. They will no longer be able to interact with you.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setBlockModalVisible(false);
      setOptionsModalVisible(false);
    } else {
      Alert.alert('Error', response.data?.error || 'Failed to block user');
    }
  } catch (error) {
    console.error('Error blocking user:', error);
    Alert.alert('Error', error.response?.data?.error || 'Failed to block user. Please try again.');
  } finally {
    setBlockLoading(false);
  }
};


const handleUnblockUser = async () => {
  setBlockLoading(true);
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(
      `${API_ROUTE}/unblock-user/${userIdFromParams}/`,
      {},
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    if (response.status === 200) {
      setIsBlocked(false);
      Alert.alert(
        'Success',
        `${profileData.user?.name || 'User'} has been unblocked`,
        [{ text: 'OK' }]
      );
      setOptionsModalVisible(false);
      setBlockModalVisible(false);
    } else {
      Alert.alert('Error', response.data?.error || 'Failed to unblock user');
    }
  } catch (error) {
    console.error('Error unblocking user:', error);
    Alert.alert('Error', error.response?.data?.error || 'Failed to unblock user. Please try again.');
  } finally {
    setBlockLoading(false);
  }
};

const checkBlockStatusOnModalOpen = useCallback(async () => {
  if (!userIdFromParams) return;
  
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_ROUTE}/blocked-users/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const blockedUsers = response.data.blocked_users || [];
      const isBlocked = blockedUsers.some(user => user.id === parseInt(userIdFromParams));
      setIsBlocked(isBlocked);
    }
  } catch (error) {
    console.error('Error checking block status on modal open:', error);
  }
}, [userIdFromParams]);


useEffect(() => {
  mountedRef.current = true;
  const controller = new AbortController();
  abortControllerRef.current = controller;

  const init = async () => {
    setLoading(true);
    await Promise.all([
      fetchUserData(),
      fetchFollowStats(),
      fetchUserPosts(),
      checkBlockStatus() 
    ]);
    setLoading(false);
  };

  init();

  return () => {
    mountedRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, [userIdFromParams]); 


  // ============ INITIALIZATION ============
  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        fetchFollowStats(),
        fetchUserPosts()
      ]);
      setLoading(false);
    };

    init();

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userIdFromParams]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // ============ RENDER FUNCTIONS ============
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // ============ RENDER PROFILE HEADER ============
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
              onPress={() => Alert.alert('Coming Soon', 'Cover photo upload will be added soon.')}
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
                onPress={() => Alert.alert('Coming Soon', 'Profile photo upload will be added soon.')}
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
              @{profileData.user?.username || profileData.user?.name?.toLowerCase().replace(/\s/g, '')}
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
              {formatNumber(following || 0)}
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
              {followers || 0}
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
              <TouchableOpacity
                style={[styles.messageButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('PrivateChat', {
                  receiverId: userIdFromParams,
                  name: profileData.user?.name,
                  chatType: 'single',
                  profile_image: userProfileImage
                })}
              >
                <Icon name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              
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

  // ============ RENDER CATALOG SECTION ============
  const renderCatalogSection = () => (
    <View style={[styles.catalogSection, { backgroundColor: colors.card }]}>
      {profileData.user?.active_mode === 'business' && (
        <View style={styles.catalogHeader}>
          <View style={styles.catalogTitleContainer}>
            <Icon name="folder-outline" size={20} color={colors.primary} />
            <Text style={[styles.catalogTitle, { color: colors.text }]}>Catalogs</Text>
          </View>
          {catalogsCount > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('AllCatalogs', { userId: userIdFromParams })} style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>See All Below</Text>
              <Icon name="chevron-down" size={16} color={colors.primary} />
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
          onDataLoaded={(data) => setCatalogsCount(data.catalogs.length)}
        />
      )}
    </View>
  );

  // ============ RENDER CONTENT ============
  const renderContent = () => {
    const currentData = () => {
      switch(selectedTab) {
        case 'posts': return tweets;
        case 'videos': return userVideos;
        case 'marketplace': return marketplacePosts;
        default: return [];
      }
    };

    const data = currentData();

    if (data.length === 0) {
      const getEmptyMessage = () => {
        if (selectedTab === 'posts') {
          return userIdFromParams ? "This user hasn't posted anything yet." : "You haven't posted anything yet.";
        }
        if (selectedTab === 'videos') {
          return userIdFromParams ? "This user hasn't uploaded any videos yet." : "You haven't uploaded any videos yet.";
        }
        return userIdFromParams ? "This user hasn't listed any items yet." : "You haven't listed any items yet.";
      };

      const getEmptyIcon = () => {
        if (selectedTab === 'posts') return 'chatbubble-outline';
        if (selectedTab === 'videos') return 'videocam-outline';
        return 'cart-outline';
      };

      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
          <Icon name={getEmptyIcon()} size={60} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {getEmptyMessage()}
          </Text>
        </View>
      );
    }

    const getNumColumns = () => {
      if (selectedTab === 'videos') return 2;
      if (selectedTab === 'marketplace') return 2;
      return 3;
    };

   const renderGridItem = ({ item }) => {
  if (selectedTab === 'videos') {
    return (
      <VideoGridItem
        item={item}
        onPress={() => {
          setSelectedPost(item);
          setSelectedPostType(selectedTab);
          setBottomSheetVisible(true);
        }}
        colors={colors}
        isPlaying={playingVideoId === item.id}
      />
    );
  } else if (selectedTab === 'marketplace') {
    return (
      <MarketplaceGridItem
        item={item}
        onPress={() => {
          setSelectedPost(item);
          setSelectedPostType(selectedTab);
          setBottomSheetVisible(true);
        }}
        colors={colors}
      />
    );
  } else {
    return (
      <PostGridItem
        item={item}
        onPress={() => {
          navigation.navigate('ExplorePostDetails', { 
            postId: item.id,
            postData: item 
          });
        }}
        colors={colors}
      />
    );
  }
};

    return (
      <FlatList
        key={`${selectedTab}-${getNumColumns()}`}
        data={data}
        renderItem={renderGridItem}
        keyExtractor={(item) => `${selectedTab}-${item.id}`}
        numColumns={getNumColumns()}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={9}
        windowSize={5}
        columnWrapperStyle={selectedTab === 'videos' || selectedTab === 'marketplace' ? styles.twoColumnRow : styles.threeColumnRow}
        removeClippedSubviews={Platform.OS === 'android'}
        viewabilityConfigCallbackPairs={
          selectedTab === 'videos' ? viewabilityConfigCallbackPairs.current : undefined
        }
      />
    );
  };

  // ============ RETURN ============
  if (loading && !hasLoadedOnce) {
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
        {userIdFromParams && (
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setOptionsModalVisible(true)}
          >
            <Icon name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        {!userIdFromParams && (
          <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
            <View style={{ width: 24 }} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        ref={scrollViewRef} 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              Promise.all([fetchUserData(), fetchFollowStats(), fetchUserPosts()])
                .finally(() => setRefreshing(false));
            }}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderProfileHeader()}
        {renderCatalogSection()}
        
        <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'posts' && styles.tabActive, selectedTab === 'posts' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('posts')}
          >
            <Icon name="grid-outline" size={20} color={selectedTab === 'posts' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: selectedTab === 'posts' ? colors.primary : colors.textSecondary }]}>
              Posts ({tweets.length || profileData.stats?.posts_count || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'videos' && styles.tabActive, selectedTab === 'videos' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('videos')}
          >
            <Icon name="play-circle-outline" size={20} color={selectedTab === 'videos' ? colors.primary : colors.textSecondary} />
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

      {/* ============ OPTIONS MODAL ============ */}
      {/* ============ OPTIONS MODAL ============ */}
<Modal
  visible={optionsModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setOptionsModalVisible(false)}
  onShow={() => {
    // Check block status when modal opens
    checkBlockStatusOnModalOpen();
  }}
>
  <TouchableOpacity
    style={styles.optionsOverlay}
    activeOpacity={1}
    onPress={() => setOptionsModalVisible(false)}
  >
    <TouchableOpacity activeOpacity={1}>
      <View style={[styles.optionsSheet, { backgroundColor: colors.card }]}>
        <View style={styles.optionsDragHandle} />
        <View style={styles.optionsSheetHeader}>
          <View style={styles.optionsUserInfo}>
            <Image
              source={
                userProfileImage
                  ? { uri: userProfileImage }
                  : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.optionsUserAvatar}
            />
            <View>
              <Text style={[styles.optionsUserName, { color: colors.text }]}>
                {profileData.user?.name || 'User'}
              </Text>
              <Text style={[styles.optionsUserHandle, { color: colors.textSecondary }]}>
                @{profileData.user?.username || ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.optionsHeaderDivider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          style={styles.optionsActionRow}
          onPress={() => {
            setOptionsModalVisible(false);
            setReportModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.optionsActionIcon, { backgroundColor: '#ff980015' }]}>
            <Icon name="flag-outline" size={20} color="#ff9800" />
          </View>
          <View style={styles.optionsActionTextGroup}>
            <Text style={[styles.optionsActionTitle, { color: colors.text }]}>
              Report User
            </Text>
            <Text style={[styles.optionsActionSubtitle, { color: colors.textSecondary }]}>
              Report inappropriate content or behavior
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.optionsRowDivider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          style={styles.optionsActionRow}
          onPress={() => {
            setOptionsModalVisible(false);
            if (isBlocked) {
              Alert.alert(
                'Unblock User',
                `Are you sure you want to unblock ${profileData.user?.name || 'this user'}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Unblock', style: 'destructive', onPress: handleUnblockUser }
                ]
              );
            } else {
              setBlockModalVisible(true);
            }
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.optionsActionIcon, { backgroundColor: isBlocked ? '#4CAF5015' : '#ff5c5c15' }]}>
            <Icon
              name={isBlocked ? 'lock-open-outline' : 'ban-outline'}
              size={20}
              color={isBlocked ? '#4CAF50' : '#ff5c5c'}
            />
          </View>
          <View style={styles.optionsActionTextGroup}>
            <View style={styles.optionsActionTitleRow}>
              <Text style={[styles.optionsActionTitle, { color: isBlocked ? '#4CAF50' : '#ff5c5c' }]}>
                {isBlocked ? 'Unblock User' : 'Block User'}
              </Text>
              {isBlocked && (
                <View style={[styles.optionsBlockedPill, { backgroundColor: '#4CAF5020', borderColor: '#4CAF5040' }]}>
                  <Text style={[styles.optionsBlockedPillText, { color: '#4CAF50' }]}>Blocked</Text>
                </View>
              )}
            </View>
            <Text style={[styles.optionsActionSubtitle, { color: colors.textSecondary }]}>
              {isBlocked
                ? 'Allow this user to interact with you again'
                : 'Prevent this user from messaging or viewing you'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionsCancelBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}
          onPress={() => setOptionsModalVisible(false)}
          activeOpacity={0.7}
        >
          <Text style={[styles.optionsCancelText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>

      {/* ============ REPORT MODAL ============ */}
      <Modal
        visible={reportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }]}>
          <View style={[styles.reportModalContent, { backgroundColor: colors.card }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.reportModalHeader}>
              <Text style={[styles.reportModalTitle, { color: colors.text }]}>Report User</Text>
              <TouchableOpacity onPress={() => { setReportModalVisible(false); setReportReason(''); }}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.reportModalDescription, { color: colors.textSecondary }]}>
              Why are you reporting {profileData.user?.name}? Your report is anonymous.
            </Text>

            <Text style={[styles.reportSectionLabel, { color: colors.text }]}>Select a reason</Text>
            <View style={styles.reportReasonList}>
              {[
                { key: 'spam', label: 'Spam', icon: 'mail-unread-outline' },
                { key: 'abuse', label: 'Abuse', icon: 'alert-circle-outline' },
                { key: 'hate_speech', label: 'Hate Speech', icon: 'megaphone-outline' },
                { key: 'fake_account', label: 'Fake Account', icon: 'person-remove-outline' },
              ].map((reason) => (
                <TouchableOpacity
                  key={reason.key}
                  style={[
                    styles.reportReasonOption,
                    { borderColor: reportReason === reason.key ? '#ff9800' : colors.border },
                    reportReason === reason.key && styles.reportReasonOptionSelected,
                  ]}
                  onPress={() => setReportReason(reason.key)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.reportReasonIconWrap,
                    { backgroundColor: reportReason === reason.key ? '#ff980020' : colors.backgroundSecondary }
                  ]}>
                    <Icon
                      name={reason.icon}
                      size={20}
                      color={reportReason === reason.key ? '#ff9800' : colors.textSecondary}
                    />
                  </View>
                  <Text style={[
                    styles.reportReasonLabel,
                    { color: reportReason === reason.key ? '#ff9800' : colors.text }
                  ]}>
                    {reason.label}
                  </Text>
                  {reportReason === reason.key && (
                    <Icon name="checkmark-circle" size={20} color="#ff9800" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.reportModalButtons}>
              <TouchableOpacity
                style={[styles.reportButton, styles.cancelReportButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => { setReportModalVisible(false); setReportReason(''); }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  styles.submitReportButton,
                  { backgroundColor: reportReason ? '#ff9800' : '#ffcc80', opacity: reportReason ? 1 : 0.6 }
                ]}
                onPress={handleReportUser}
                disabled={reportLoading || !reportReason}
              >
                {reportLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============ BLOCK MODAL ============ */}

      {/* ============ BLOCK/UNBLOCK MODAL ============ */}
<Modal
  visible={blockModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setBlockModalVisible(false)}
>
  <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }]}>
    <View style={[styles.blockModalContent, { backgroundColor: colors.card }]}>
      <View style={styles.sheetHandle} />

      <View style={[styles.blockIconBadge, { backgroundColor: isBlocked ? '#4CAF5020' : '#ff5c5c18' }]}>
        <Icon name={isBlocked ? "lock-open-outline" : "ban-outline"} size={32} color={isBlocked ? '#4CAF50' : '#ff5c5c'} />
      </View>

      <Text style={[styles.blockModalTitle, { color: colors.text }]}>
        {isBlocked ? `Unblock ${profileData.user?.name || 'this user'}?` : `Block ${profileData.user?.name || 'this user'}?`}
      </Text>
      <Text style={[styles.blockModalDescription, { color: colors.textSecondary }]}>
        {isBlocked
          ? `${profileData.user?.name || 'This user'} will be able to interact with you again.`
          : 'They won\'t be notified. You can unblock them anytime from their profile.'}
      </Text>

      {!isBlocked && (
        <View style={[styles.blockConsequencesList, { backgroundColor: colors.backgroundSecondary || (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), borderRadius: 14 }]}>
          {[
            { icon: 'chatbubble-ellipses-outline', text: "They won't be able to message you" },
            { icon: 'eye-off-outline', text: "They won't see your posts or profile" },
            { icon: 'person-outline', text: "You won't see their content either" },
          ].map((item, index, arr) => (
            <View
              key={index}
              style={[
                styles.blockConsequenceItem,
                index < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }
              ]}
            >
              <View style={styles.blockConsequenceIconWrap}>
                <Icon name={item.icon} size={18} color="#ff5c5c" />
              </View>
              <Text style={[styles.blockConsequenceText, { color: colors.textSecondary }]}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.blockConfirmBtn, { backgroundColor: isBlocked ? '#4CAF50' : '#ff5c5c' }]}
        onPress={isBlocked ? handleUnblockUser : handleBlockUser}
        disabled={blockLoading}
        activeOpacity={0.85}
      >
        {blockLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.blockConfirmBtnText}>
            {isBlocked ? 'Unblock User' : 'Block User'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.blockCancelBtn, { borderColor: colors.border }]}
        onPress={() => setBlockModalVisible(false)}
        activeOpacity={0.7}
      >
        <Text style={[styles.blockCancelBtnText, { color: colors.text }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      



      {/* ============ FULL SCREEN IMAGE MODAL ============ */}
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

      {/* ============ FOLLOWERS MODAL ============ */}
      <Modal visible={followersModalVisible} transparent animationType="slide" onRequestClose={() => {
        setFollowersModalVisible(false);
        fetchFollowStats();
      }}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.followModal, { backgroundColor: colors.card }]}>
            <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.followModalTitle, { color: colors.text }]}>Followers</Text>
              <TouchableOpacity onPress={() => {
                setFollowersModalVisible(false);
                fetchFollowStats();
              }}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {loadingFollowers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
            ) : (
              <FlatList
                data={followersList}
                renderItem={({ item }) => (
                  <FollowItem 
                    item={item} 
                    type="followers" 
                    colors={colors}
                    handleFollow={handleFollow}
                    handleUnfollow={handleUnfollow}
                    fetchFollowStats={fetchFollowStats}
                  />
                )}
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

      {/* ============ FOLLOWING MODAL ============ */}
      <Modal visible={followingModalVisible} transparent animationType="slide" onRequestClose={() => {
        setFollowingModalVisible(false);
        fetchFollowStats();
      }}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.followModal, { backgroundColor: colors.card }]}>
            <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.followModalTitle, { color: colors.text }]}>Following</Text>
              <TouchableOpacity onPress={() => {
                setFollowingModalVisible(false);
                fetchFollowStats();
              }}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {loadingFollowers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
            ) : (
              <FlatList
                data={followingList}
                renderItem={({ item }) => (
                  <FollowItem 
                    item={item} 
                    type="following" 
                    colors={colors}
                    handleFollow={handleFollow}
                    handleUnfollow={handleUnfollow}
                    fetchFollowStats={fetchFollowStats}
                  />
                )}
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

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '500' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  profileHeader: { marginBottom: 8 },
  coverImage: { width: '100%', height: 180, justifyContent: 'flex-end', alignItems: 'center' },
  addCoverButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  addCoverText: { color: '#fff', marginLeft: 8, fontSize: 14, fontWeight: '500' },
  profileInfoContainer: { padding: 20, marginTop: -40 },
  profileImageSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileImageWrapper: { position: 'relative', marginRight: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, backgroundColor: '#f0f0f0' },
  changePhotoButton: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 3 },
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
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 8, elevation: 2 },
  editButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  settingsButton: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  messageButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 8 },
  messageButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  followButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, borderWidth: 1.5, gap: 8 },
  followButtonn: { backgroundColor: '#0653f8ff', borderWidth: 0 },
  followingButton: { backgroundColor: '#E1E1E1', borderWidth: 0 },
  followButtonText: { fontSize: 15, fontWeight: '600' },
  additionalInfo: { gap: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 14, flex: 1 },
  
  catalogSection: { paddingHorizontal: 16, paddingVertical: 8 },
  catalogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  catalogTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catalogTitle: { fontSize: 16, fontWeight: '600' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { fontSize: 14, fontWeight: '500' },
  catalogContainer: { minHeight: 180 },
  
  tabContainer: { flexDirection: 'row', marginTop: 8, paddingHorizontal: 8 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomWidth: 2 },
  tabText: { fontSize: 13, fontWeight: '500' },
  
  gridContainer: { padding: 2 },
  threeColumnRow: { justifyContent: 'space-between' },
  twoColumnRow: { justifyContent: 'space-between', paddingHorizontal: 2 },
  gridItem: { width: (screenWidth - 12) / 3, height: (screenWidth - 12) / 3, margin: 2, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  gridPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  reactionBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 4 },
  reactionBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  
  videoGridItem: { width: (screenWidth - 12) / 2, height: 250, margin: 2, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  videoGridPlayer: { flex: 1 },
  videoViewsOverlay: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  videoViewsText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  videoLikeOverlay: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  videoLikeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  videoCommentOverlay: { position: 'absolute', bottom: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10 },
  videoCommentText: { color: '#fff', fontSize: 10, fontWeight: '500' },
  
  marketplaceGridItem: { width: (screenWidth - 12) / 2, height: 200, margin: 2, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  marketplacePriceBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  marketplacePriceText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  videoPlayerContainer: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  videoLoading: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  videoError: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#fff', fontSize: 12, marginTop: 8 },
  playOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  playIconContainer: { backgroundColor: 'rgba(0,0,0,0.6)', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  durationText: { color: '#fff', fontSize: 10, fontWeight: '500' },
  
  emptyContainer: { padding: 40, alignItems: 'center', borderRadius: 12, margin: 16 },
  emptyText: { marginTop: 16, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  fullScreenModal: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullScreenClose: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, zIndex: 1, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: screenWidth, height: screenHeight * 0.7 },
  fullScreenLabel: { position: 'absolute', bottom: 40, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  fullScreenLabelText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  
  optionsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  optionsSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 44 : 32 },
  optionsDragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 20 },
  optionsSheetHeader: { marginBottom: 16 },
  optionsUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionsUserAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#f0f0f0' },
  optionsUserName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  optionsUserHandle: { fontSize: 13 },
  optionsHeaderDivider: { height: 1, marginBottom: 8 },
  optionsActionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
  optionsActionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  optionsActionTextGroup: { flex: 1, gap: 3 },
  optionsActionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionsActionTitle: { fontSize: 15, fontWeight: '600' },
  optionsActionSubtitle: { fontSize: 12, lineHeight: 17 },
  optionsBlockedPill: { backgroundColor: '#ff5c5c20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1, borderColor: '#ff5c5c40' },
  optionsBlockedPillText: { fontSize: 10, fontWeight: '700', color: '#ff5c5c' },
  optionsRowDivider: { height: 1, marginLeft: 58 },
  optionsCancelBtn: { marginTop: 12, paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  optionsCancelText: { fontSize: 16, fontWeight: '600' },
  
  reportModalContent: { width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 28 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 16 },
  reportModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reportModalTitle: { fontSize: 20, fontWeight: 'bold' },
  reportModalDescription: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  reportSectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10, marginTop: 4 },
  reportReasonList: { gap: 10, marginBottom: 24 },
  reportReasonOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, gap: 12 },
  reportReasonOptionSelected: { backgroundColor: '#fff8f0' },
  reportReasonIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reportReasonLabel: { fontSize: 15, fontWeight: '500' },
  reportModalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  reportButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelReportButton: { borderWidth: 1, borderColor: '#ddd' },
  submitReportButton: { backgroundColor: '#ff9800' },
  cancelButtonText: { fontSize: 16, fontWeight: '500' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  blockModalContent: { width: '100%', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 32, alignItems: 'center' },
  blockIconBadge: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#ff5c5c18', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  blockModalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  blockModalDescription: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20, paddingHorizontal: 12 },
  blockConsequencesList: { width: '100%', marginBottom: 24, overflow: 'hidden' },
  blockConsequenceItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16, gap: 12 },
  blockConsequenceIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#ff5c5c15', justifyContent: 'center', alignItems: 'center' },
  blockConsequenceText: { fontSize: 14, flex: 1, lineHeight: 19 },
  blockConfirmBtn: { width: '100%', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginBottom: 10 },
  blockConfirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  blockCancelBtn: { width: '100%', paddingVertical: 15, borderRadius: 14, alignItems: 'center', borderWidth: 1.5 },
  blockCancelBtnText: { fontSize: 16, fontWeight: '600' },
  
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
  followActionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, minWidth: 100, alignItems: 'center' },
  followActionText: { fontSize: 14, fontWeight: '600' },
  followLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyFollow: { padding: 40, alignItems: 'center' },
  emptyFollowText: { fontSize: 16 },
  optionsBlockedPill: {
  backgroundColor: '#4CAF5020',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#4CAF5040',
},
optionsBlockedPillText: {
  fontSize: 10,
  fontWeight: '700',
  color: '#4CAF50',
},
});

export default UserProfile;