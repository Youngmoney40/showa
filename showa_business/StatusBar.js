
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
  Alert,
  StatusBar,
  Platform,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import _ from 'lodash';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomNav from '../components/BottomNavSocialMedia';
import SwitchAccountSheet from '../components/SwitchAccountSheet';
import { useTheme } from '../src/context/ThemeContext';
import { createMMKV } from 'react-native-mmkv';
import StatusSection from '../components/StatusSection';

const { width, height } = Dimensions.get('window');

// Initialize MMKV
const mmkv = new createMMKV({
  id: 'status-storage',
  encryptionKey: 'status-encryption-key-2024',
});

const STATUS_STORAGE_KEY = '@status_data';
const CHANNELS_STORAGE_KEY = '@channels_data';
const FOLLOWING_CHANNELS_KEY = '@following_channels';
const CACHE_TIMESTAMP_KEY = '@cache_timestamp';
const CACHE_EXPIRY_HOURS = 24;
const LIVE_STREAMS_KEY = '@live_streams';

const StatusScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors, isDark } = useTheme();
  
  const [tab, setTab] = useState('Status');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [groupedStatuses, setGroupedStatuses] = useState([]);
  const [channels, setChannels] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserPhone, setCurrentUserPhone] = useState(null);
  const [viewersModalVisible, setViewersModalVisible] = useState(false);
  const [currentViewers, setCurrentViewers] = useState([]);
  const [followLock, setFollowLock] = useState({});
  const [followingChannels, setFollowingChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false);
  const [postingStatus, setPostingStatus] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [currentReactions, setCurrentReactions] = useState([]);
  const [currentComments, setCurrentComments] = useState([]);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [liveStreams, setLiveStreams] = useState([]);
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [pendingSwitchTo, setPendingSwitchTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [currentReplyStatus, setCurrentReplyStatus] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [loadingViewers, setLoadingViewers] = useState(false);
  
  // Animation for live pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const snackbarAnim = useRef(new Animated.Value(0)).current;
  
  const flatListRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  const styles = createStyles(colors, isDark, insets);

  // Pulse animation for live badge
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Show snackbar function
  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
    Animated.timing(snackbarAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setTimeout(() => {
      Animated.timing(snackbarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSnackbarVisible(false));
    }, 3000);
  };

  const getSecureUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  };
  
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://')) {
      const httpsUrl = url.replace('http://', 'https://');
      return httpsUrl;
    }
    if (url.startsWith('https://')) {
      return url;
    }
    return `${API_ROUTE_IMAGE}${url}`;
  };

  // MMKV cache functions
  const saveDataToMMKV = (key, data) => {
    try {
      const jsonValue = JSON.stringify(data);
      mmkv.set(key, jsonValue);
      if (key === STATUS_STORAGE_KEY || key === CHANNELS_STORAGE_KEY || key === FOLLOWING_CHANNELS_KEY) {
        mmkv.set(CACHE_TIMESTAMP_KEY, new Date().toISOString());
      }
    } catch (error) {
      console.error('Error saving data to MMKV:', error);
    }
  };

  const getDataFromMMKV = (key) => {
    try {
      const jsonValue = mmkv.getString(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting data from MMKV:', error);
      return null;
    }
  };

  const clearMMKVCache = () => {
    try {
      mmkv.delete(STATUS_STORAGE_KEY);
      mmkv.delete(CHANNELS_STORAGE_KEY);
      mmkv.delete(FOLLOWING_CHANNELS_KEY);
      mmkv.delete(CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing MMKV cache:', error);
    }
  };

  const checkCacheExpiryMMKV = () => {
    try {
      const timestamp = mmkv.getString(CACHE_TIMESTAMP_KEY);
      if (!timestamp) return true;
      const cacheDate = new Date(timestamp);
      const now = new Date();
      const hoursDiff = (now - cacheDate) / (1000 * 60 * 60);
      return hoursDiff > CACHE_EXPIRY_HOURS;
    } catch (error) {
      console.error('Error checking cache expiry:', error);
      return true;
    }
  };

  const loadCachedDataMMKV = async () => {
    try {
      const isCacheExpired = checkCacheExpiryMMKV();
      if (isCacheExpired) {
        clearMMKVCache();
        return false;
      }

      const cachedStatuses = getDataFromMMKV(STATUS_STORAGE_KEY);
      const cachedChannels = getDataFromMMKV(CHANNELS_STORAGE_KEY);
      const cachedFollowingIds = getDataFromMMKV(FOLLOWING_CHANNELS_KEY);

      if (cachedStatuses) {
        setGroupedStatuses(cachedStatuses);
        preloadAllStatusImages(cachedStatuses);
      }
      if (cachedChannels) {
        setChannels(cachedChannels);
      }
      if (cachedFollowingIds && cachedChannels) {
        const fullFollowedChannels = cachedChannels.filter((ch) => cachedFollowingIds.includes(ch.id));
        setFollowingChannels(fullFollowedChannels);
      }
      return cachedStatuses || cachedChannels || cachedFollowingIds;
    } catch (error) {
      console.error('Error loading cached data from MMKV:', error);
      return false;
    }
  };

  const preloadAllStatusImages = async (statuses) => {
    try {
      const preloadPromises = [];
      statuses.forEach(userStatus => {
        userStatus.statuses.forEach(status => {
          const imageUrl = getImageUrl(status.media);
          if (imageUrl) {
            preloadPromises.push(Image.prefetch(imageUrl));
          }
        });
      });
      await Promise.all(preloadPromises);
    } catch (error) {
      console.error('Error preloading images:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const switchAccount = async (account) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('accountMode', account);
      if (account === 'personal') {
        navigation.navigate('BusinessHome');
      } else {
        const profile = await fetchProfile();
        if (profile && profile.name && profile.name.trim() !== '') {
          navigation.navigate('BusinessHome');
        } else {
          navigation.navigate('BusinessSetup');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const groupStatusesByUser = (statuses) => {
    const grouped = {};
    statuses.forEach((status) => {
      const userKey = status.user?.id || status.user;
      if (!grouped[userKey]) {
        grouped[userKey] = {
          user: status.user || { id: status.user, phone: status.user, name: `User ${status.user}` },
          statuses: [],
          latestTime: new Date(status.created_at),
          viewers_count: status.viewers_count,
          viewers: Array.isArray(status.viewers) ? status.viewers : [],
          status_type: status.status_type,
          reactions: status.reactions || [],
        };
      }
      grouped[userKey].statuses.push(status);
      const currentTime = new Date(status.created_at);
      if (currentTime > grouped[userKey].latestTime) {
        grouped[userKey].latestTime = currentTime;
        grouped[userKey].viewers_count = status.viewers_count;
        grouped[userKey].viewers = Array.isArray(status.viewers) ? status.viewers : [];
        grouped[userKey].status_type = status.status_type;
        grouped[userKey].reactions = status.reactions || [];
      }
    });
    return Object.values(grouped).sort((a, b) => b.latestTime - a.latestTime);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInHours = (now - new Date(date)) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setCurrentUserId(parsedUserData.id);
        setCurrentUserPhone(parsedUserData.phone);
        return parsedUserData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  const handleSelectMedia = () => {
    Alert.alert('Choose Option', '', [
      { text: 'Gallery', onPress: () => openGallery({ mediaType: 'photo', includeExtra: true }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openGallery = (options) => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handlePostStatus = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select media.');
      return;
    }

    setPostingStatus(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated. Please log in.');
        return;
      }
      const formData = new FormData();
      formData.append('media', {
        uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'status.jpg',
      });
      formData.append('text', caption);
      formData.append('status_type', 'image');
      
      const res = await axios.post(`${API_ROUTE}/status/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      
      showSnackbar('Status uploaded successfully!', 'success');
      setImage(null);
      setCaption('');
      setAddStatusModalVisible(false);
      await fetchAllData();
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      showSnackbar('Upload Failed. Please try again.', 'error');
    } finally {
      setPostingStatus(false);
    }
  };

  const trackStatusView = async (statusId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/status/${statusId}/track-view/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error tracking status view:', error);
    }
  };

  const deleteStatus = async (statusId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(
        `${API_ROUTE}/status/${statusId}/delete/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGroupedStatuses(prev => 
        prev.filter(group => 
          group.statuses.some(status => status.id !== statusId)
        ).filter(group => group.statuses.length > 0)
      );
      
      setDeleteModalVisible(false);
      setStatusToDelete(null);
      
      if (modalVisible) {
        setModalVisible(false);
        setCurrentStatusIndex(0);
      }
      
      Alert.alert('Success', 'Status deleted successfully');
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting status:', error);
      Alert.alert('Error', 'Failed to delete status');
    }
  };

  // Open reply modal
  const openReplyModal = (status) => {
    console.log('📝 Opening reply modal for status:', status.id);
    setCurrentReplyStatus(status);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const QUICK_REACTIONS = ['❤️', '👍', '😂', '😮', '😢'];

  const sendChatMessage = async (content) => {
    if (!currentReplyStatus) {
      showSnackbar('Status not found', 'error');
      return { ok: false };
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        showSnackbar('Please login to reply', 'error');
        return { ok: false };
      }

      let receiverId = null;
      if (currentReplyStatus.user) {
        if (typeof currentReplyStatus.user === 'object') {
          receiverId = currentReplyStatus.user.id || currentReplyStatus.user.user_id;
        } else {
          receiverId = currentReplyStatus.user;
        }
      }
      if (!receiverId) {
        receiverId = currentReplyStatus.user_id || currentReplyStatus.userId;
      }
      if (!receiverId) {
        showSnackbar('User not found', 'error');
        return { ok: false };
      }

      const statusOwner = currentReplyStatus.user?.name ||
                          currentReplyStatus.user?.username ||
                          currentReplyStatus.username ||
                          'User';

      const statusImageUrl = getImageUrl(currentReplyStatus.media || currentReplyStatus.image);

      const formData = new FormData();

      let messageContent = content;
      messageContent += `\n\n📸 Status Reply to ${statusOwner}`;
      if (currentReplyStatus.text) {
        messageContent += `\n📝 Status: "${currentReplyStatus.text.substring(0, 100)}"`;
      }
      formData.append('content', messageContent);

      if (statusImageUrl) {
        try {
          const fileName = statusImageUrl.split('/').pop() || 'status_image.jpg';
          formData.append('image', {
            uri: statusImageUrl,
            type: 'image/jpeg',
            name: fileName,
          });
        } catch (imageError) {
          console.error('Error attaching image:', imageError);
        }
      }

      formData.append('chat_type', 'single');
      formData.append('account_mode', 'business');
      formData.append('receiver', receiverId.toString());

      const response = await axios.post(
        `${API_ROUTE}/api/chat/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      const ok = response.status === 200 || response.status === 201;
      return { ok, receiverId, statusOwner };
    } catch (error) {
      console.error('❌ Error sending chat message:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      let errorMessage = 'Failed to send message';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error || 'Invalid request';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      showSnackbar(errorMessage, 'error');
      return { ok: false };
    }
  };

  const sendStatusReply = async () => {
    if (!replyMessage.trim()) {
      showSnackbar('Please enter a message', 'error');
      return;
    }
    if (!currentReplyStatus) {
      showSnackbar('Status not found', 'error');
      return;
    }

    setSendingReply(true);
    const result = await sendChatMessage(replyMessage.trim());
    setSendingReply(false);

    if (result.ok) {
      showSnackbar('Reply sent successfully!', 'success');

      const ownerForNav = result.statusOwner;
      const receiverForNav = result.receiverId;
      const profileImageForNav = currentReplyStatus?.user?.profile_picture || '';

      setReplyMessage('');
      setShowReplyModal(false);
      setCurrentReplyStatus(null);

      Alert.alert(
        'Message Sent!',
        `Your reply has been sent to ${ownerForNav}.`,
        [
          { text: 'Continue', style: 'cancel' },
          {
            text: 'View Chat',
            onPress: () => {
              setModalVisible(false);
              navigation.navigate('BPrivateChat', {
                chatType: 'single',
                receiverId: receiverForNav,
                name: ownerForNav,
                profile_image: profileImageForNav,
              });
            }
          }
        ]
      );

      await fetchStatus();
    }
  };

  const sendQuickReaction = async (emoji) => {
    if (!currentReplyStatus || sendingReply) return;

    setSendingReply(true);
    const result = await sendChatMessage(emoji);
    setSendingReply(false);

    if (result.ok) {
      showSnackbar(`${emoji} sent`, 'success');
      setReplyMessage('');
      setShowReplyModal(false);
      setCurrentReplyStatus(null);
      await fetchStatus();
    }
  };

  const addReaction = async (statusId, reactionType) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.post(
        `${API_ROUTE}/status/${statusId}/react/`,
        { reaction_type: reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGroupedStatuses(prev => 
        prev.map(group => ({
          ...group,
          statuses: group.statuses.map(status => 
            status.id === statusId 
              ? {
                  ...status,
                  user_reaction: reactionType,
                  reactions: [
                    ...(status.reactions || []).filter(r => r.user.id !== currentUserId),
                    { user: { id: currentUserId }, reaction_type: reactionType }
                  ]
                }
              : status
          )
        }))
      );
      
      showSnackbar(`❤️ You reacted with ${reactionType}`, 'success');
      setReactionModalVisible(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
      showSnackbar('Failed to add reaction', 'error');
    }
  };

  const showReactions = (reactions) => {
    setCurrentReactions(reactions);
    setReactionModalVisible(true);
  };

  const getReactionEmoji = (reaction) => {
    const emojis = {
      like: '👍',
      love: '❤️',
      laugh: '😂',
      wow: '😮',
      sad: '😢',
      angry: '😠'
    };
    return emojis[reaction] || '👍';
  };

  const goToPreviousStatus = () => {
    if (currentStatusIndex > 0) {
      const newIndex = currentStatusIndex - 1;
      setCurrentStatusIndex(newIndex);
      flatListRef.current?.scrollToIndex({ 
        index: newIndex, 
        animated: true 
      });
    }
  };

  const goToNextStatus = () => {
    if (currentStatusIndex < selectedUserStatuses.length - 1) {
      const newIndex = currentStatusIndex + 1;
      setCurrentStatusIndex(newIndex);
      flatListRef.current?.scrollToIndex({ 
        index: newIndex, 
        animated: true 
      });
    } else {
      setModalVisible(false);
      setCurrentStatusIndex(0);
    }
  };

  const fetchComments = async (statusId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(
        `${API_ROUTE}/status/${statusId}/comments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentComments(res.data);
      setCommentsModalVisible(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const openImageModal = (userStatuses) => {
    setSelectedUserStatuses(userStatuses.statuses);
    setCurrentStatusIndex(0);
    setModalVisible(true);
  };

  const fetchLiveStreams = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/live-streams/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const liveStreamsWithTime = response.data.map(stream => ({
        ...stream,
        started_at: stream.created_at || new Date().toISOString(),
        isLive: true
      }));
      
      setLiveStreams(liveStreamsWithTime);
      mmkv.set(LIVE_STREAMS_KEY, JSON.stringify(liveStreamsWithTime));
    } catch (error) {
      console.error('Error fetching live streams:', error.message);
      const cached = getDataFromMMKV(LIVE_STREAMS_KEY);
      if (cached) setLiveStreams(cached);
    }
  };

  const fetchChannels = async (followedChannelIds = []) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await axios.get(`${API_ROUTE}/channels/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const processedChannels = res.data.map((channel) => ({
        ...channel,
        isFollowing: followedChannelIds.includes(channel.id),
      }));
      const sortedChannels = [...processedChannels].sort((a, b) => {
        if (a.isFollowing === b.isFollowing) return 0;
        return a.isFollowing ? -1 : 1;
      });
      saveDataToMMKV(CHANNELS_STORAGE_KEY, sortedChannels);
      return sortedChannels;
    } catch (err) {
      console.error('Error fetching channels:', err);
      return [];
    }
  };

  const handleFollow = async (slug) => {
    if (followLock[slug]) return;
    setFollowLock((prev) => ({ ...prev, [slug]: true }));
    try {
      setChannels((prev) => {
        const updated = prev.map((ch) =>
          ch.slug === slug
            ? {
                ...ch,
                isFollowing: !ch.isFollowing,
                followers_count: ch.isFollowing ? ch.followers_count - 1 : ch.followers_count + 1,
              }
            : ch
        );
        return updated.sort((a, b) => b.isFollowing - a.isFollowing);
      });
      setFollowingChannels((prev) => {
        if (prev.some((ch) => ch.slug === slug)) {
          return prev.filter((ch) => ch.slug !== slug);
        } else {
          const channelToAdd = channels.find((ch) => ch.slug === slug);
          return channelToAdd ? [...prev, { ...channelToAdd, isFollowing: true }] : prev;
        }
      });
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/channels/${slug}/follow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showSnackbar(`Channel ${channels.find(ch => ch.slug === slug)?.isFollowing ? 'unfollowed' : 'followed'} successfully`, 'success');
      
      saveDataToMMKV(CHANNELS_STORAGE_KEY, channels);
      saveDataToMMKV(FOLLOWING_CHANNELS_KEY, followingChannels.map((ch) => ch.id));
    } catch (err) {
      console.error('Follow error:', err);
      showSnackbar('Failed to follow channel', 'error');
    } finally {
      setFollowLock((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const fetchStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in.');
        return [];
      }
      const res = await axios.get(`${API_ROUTE}/status/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      if (res.status === 200 || res.status === 201) {
        const grouped = groupStatusesByUser(res.data);
        saveDataToMMKV(STATUS_STORAGE_KEY, grouped);
        return grouped;
      } else {
        Alert.alert('Error', 'Failed to fetch statuses.');
        return [];
      }
    } catch (error) {
      console.error('Fetch status error:', error);
      return [];
    }
  };

  const fetchFollowingChannels = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await axios.get(`${API_ROUTE}/channels/following/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 || res.status === 201) {
        const followedIds = res.data.map((channel) => channel.id);
        saveDataToMMKV(FOLLOWING_CHANNELS_KEY, followedIds);
        return followedIds;
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  const fetchAllData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setBackgroundRefreshing(true);
      } else {
        setLoading(true);
      }
      const user = await fetchCurrentUser();
      if (!user) {
        Alert.alert('Not User Found', 'Please log in again.');
        return;
      }
      const [followedChannelIds, statuses] = await Promise.all([
        fetchFollowingChannels(), 
        fetchStatus()
      ]);
      const allChannels = await fetchChannels(followedChannelIds);
      const fullFollowedChannels = allChannels.filter((ch) => ch.isFollowing);
      
      setGroupedStatuses(statuses);
      setChannels(allChannels);
      setFollowingChannels(fullFollowedChannels);
      
      if (statuses && statuses.length > 0) {
        preloadAllStatusImages(statuses);
      }
      
      await fetchLiveStreams();
    } catch (error) {
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setBackgroundRefreshing(false);
    }
  };

  const fetchAllDataSilently = _.debounce(async () => {
    try {
      const user = await fetchCurrentUser();
      if (!user) return;
      const isCacheExpired = checkCacheExpiryMMKV();
      if (isCacheExpired) {
        clearMMKVCache();
      }
      const [followedChannelIds, statuses] = await Promise.all([fetchFollowingChannels(), fetchStatus()]);
      const allChannels = await fetchChannels(followedChannelIds);
      const fullFollowedChannels = allChannels.filter((ch) => ch.isFollowing);
      
      setGroupedStatuses((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(statuses)) {
          return statuses;
        }
        return prev;
      });
      setChannels((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(allChannels)) {
          return allChannels;
        }
        return prev;
      });
      setFollowingChannels((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(fullFollowedChannels)) {
          return fullFollowedChannels;
        }
        return prev;
      });
      
      await fetchLiveStreams();
    } catch (error) {
      console.error('Silent refresh error:', error);
    }
  }, 1000);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData(true);
  };

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const hasCache = await loadCachedDataMMKV();
        if (!hasCache) {
          await fetchAllData(false);
        } else {
          fetchAllDataSilently();
        }
      })();
    }
  }, [isFocused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFocused) {
        fetchAllDataSilently();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isFocused]);

  const fetchUserDetails = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(`🔍 Fetching user details for ID: ${userId}`);
      
      const response = await axios.get(`${API_ROUTE}/users/${userId}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`✅ User ${userId} details:`, response.data);
      return response.data.user || response.data;
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      return {
        id: userId,
        name: `User ${userId}`,
        phone: userId,
        profile_picture: null,
      };
    }
  };

  const handleViewersPress = async (item) => {
    if (loadingViewers) return;
    
    try {
      setLoadingViewers(true);
      console.log('👁️ Viewers data:', item.viewers);
      console.log('👁️ Viewers count:', item.viewers_count);
      
      if (!item.viewers || item.viewers.length === 0) {
        Alert.alert('No Viewers', 'No one has viewed this status yet.');
        setLoadingViewers(false);
        return;
      }
      
      const viewerPromises = item.viewers.map(async (viewerId) => {
        const userData = await fetchUserDetails(viewerId);
        return {
          ...userData,
          viewed_at: item.viewed_at || new Date().toISOString()
        };
      });
      
      const viewerDetails = await Promise.all(viewerPromises);
      console.log('📊 All viewer details:', viewerDetails);
      
      setCurrentViewers(viewerDetails);
      setViewersModalVisible(true);
      setLoadingViewers(false);
    } catch (error) {
      console.error('Error loading viewers:', error);
      Alert.alert('Error', 'Failed to load viewer details');
      setLoadingViewers(false);
    }
  };

  const renderViewerItem = ({ item }) => {
    const userData = item.user || item;
    return (
      <View style={styles.viewerItem}>
        <Image
          source={{
            uri: userData.profile_picture
              ? getImageUrl(userData.profile_picture)
              : 'https://via.placeholder.com/40',
          }}
          style={styles.viewerAvatar}
        />
        <View style={styles.viewerInfo}>
          <Text style={[styles.viewerName, { color: '#000' }]}>
            {userData.name || userData.username || userData.phone || 'Unknown User'}
          </Text>
          {item.viewed_at && (
            <Text style={[styles.viewerTime, { color: '#000' }]}>
              Seen {formatTime(item.viewed_at)}
            </Text>
          )}
        </View>
      </View>
    );
  };

const renderStoryCircle = (userStatus, isLive = false) => {
  const isMyStatus = userStatus.user?.phone === currentUserPhone || userStatus.user === currentUserPhone;
  const imageUrl = getImageUrl(userStatus.statuses?.[0]?.media || userStatus.image || userStatus.broadcaster_image);
  const name = isMyStatus ? 'My Story' : (userStatus.user?.name || userStatus.broadcaster_name || userStatus.user || 'User');
  const hasUnseen = !isMyStatus && !isLive;
  
  return (
    <TouchableOpacity 
      style={styles.storyWrapper} 
      onPress={() => {
        if (isMyStatus) {
          setAddStatusModalVisible(true);
        } else if (isLive) {
          handleLivePress(userStatus);
        } else {
          openImageModal(userStatus);
        }
      }}
      activeOpacity={0.8}
    >
      <View style={styles.storyContainer}>
        {/* Story Ring - 98x98 */}
        <View style={[
          styles.storyRing,
          isLive ? styles.storyRingLive : styles.storyRingStatus,
          hasUnseen && styles.storyRingUnseen,
        ]}>
          {/* Profile Image - 90x90 */}
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.storyImage}
          />
          
          {/* Live Badge */}
          {isLive && (
            <View style={styles.liveBadgeContainer}>
              <Animated.View 
                style={[
                  styles.liveBadgePulse,
                  {
                    transform: [{ scale: pulseAnim }],
                  }
                ]} 
              />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
          
          {/* Live glow ring - 106x106 */}
          {isLive && (
            <Animated.View 
              style={[
                styles.liveGlowRing,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.3],
                    outputRange: [0.3, 0.8],
                  }),
                  transform: [{ scale: pulseAnim }],
                }
              ]} 
            />
          )}
        </View>
        
        {/* Name below story */}
        <Text style={styles.storyName} numberOfLines={1}>
          {name}
        </Text>
        
        {/* Live label below name */}
        {isLive && (
          <View style={styles.liveLabelContainer}>
            <Text style={styles.liveLabelText}>● LIVE</Text>
          </View>
        )}
      </View>
      
      {/* Add Badge - Positioned at bottom-right of the story */}
      {isMyStatus && (
        <View style={[styles.addBadgeContainer, { bottom: 10, right: 2 }]}>
          <Icon name="add" size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

  // Handle live press
  const handleLivePress = (stream) => {
    navigation.navigate('Viewer', {
      roomName: stream.room_name || `live-${stream.id}`,
      streamId: stream.id,
      viewerId: 'viewer-1',
      broadcaster_name: stream.broadcaster_name,
      broadcaster_image: stream.broadcaster_image,
    });
  };

  const renderStatusPreview = (userStatus) => {
    return renderStoryCircle(userStatus, false);
  };

  const renderLiveStreamPreview = (stream) => {
    const liveData = {
      ...stream,
      user: {
        name: stream.broadcaster_name || 'User',
        phone: stream.broadcaster_phone || stream.user_id,
      },
      statuses: [{
        media: stream.broadcaster_image || stream.thumbnail,
      }],
      broadcaster_name: stream.broadcaster_name,
      broadcaster_image: stream.broadcaster_image,
    };
    return renderStoryCircle(liveData, true);
  };

  const ChannelItem = ({ channel, currentUserId, navigation, followLock, handleFollow }) => {
    const isCreator = currentUserId && channel.creator === currentUserId;
    
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (!channel.isFollowing && !isCreator) {
            showSnackbar('Please follow this channel to view content', 'info');
            return;
          }
          if (currentUserId && channel.creator === currentUserId) {
            navigation.navigate('ChannelAdminManagement', {
              receiverId: channel.id,
              name: channel.name,
              chatType: 'channel',
              channelSlug: channel.slug,
              profile_image: channel.image,
              InviteLink: channel.invite_link,
              followers: channel.followers_count,
            });
          } else {
            navigation.navigate('ChannelDetails', {
              receiverId: channel.id,
              name: channel.name,
              chatType: 'channel',
              profile_image: channel.image,
              channelSlug: channel.slug,
              InviteLink: channel.invite_link,
              followers: channel.followers_count,
            });
          }
        }}
      >
        <View style={styles.communityItem}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                channel.image
                  ? { uri: `${API_ROUTE_IMAGE}${channel.image}` }
                  : require('../assets/images/channelfallbackimg.png')
              }
              style={styles.communityAvatar}
            />
            {isCreator && (
              <View style={styles.yourChannelBadge}>
                <Text style={styles.yourChannelText}>Yours</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.communityName}>{channel.name}</Text>
            {channel.isFollowing && !isCreator ? (
              <Text style={[styles.followerCount, { color: colors.textSecondary, fontSize: 13 }]}>
                {channel.description?.slice(0, 24) + '...' || 'No description'}
              </Text>
            ) : null}
            <Text style={styles.communityMsg}>
              <Text style={styles.followerCount}>{channel.followers_count?.toLocaleString() || '0'}</Text> followers
            </Text>
          </View>
          
          {!isCreator && (
            <TouchableOpacity
              disabled={followLock[channel.slug]}
              onPress={(e) => {
                e.stopPropagation();
                handleFollow(channel.slug);
              }}
              style={[styles.followBtn, channel.isFollowing && styles.followingBtn, followLock[channel.slug] && styles.disabledBtn]}
            >
              {followLock[channel.slug] ? (
                <ActivityIndicator size="small" color={colors.icon} />
              ) : (
                <Text style={{ color: channel.isFollowing ? colors.text : colors.text }}>
                  {channel.isFollowing ? 'Following' : 'Follow'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatusItem = ({ item, index }) => {
    const isMyStatus = item.user?.phone === currentUserPhone || item.user === currentUserPhone;
    
    const handleDeletePress = () => {
      Alert.alert(
        'Delete Status',
        'Are you sure you want to delete this status? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => deleteStatus(item.id), style: 'destructive' },
        ]
      );
    };
    
    return (
      <View style={styles.statusViewerContainer}>
        <TouchableOpacity 
          style={[styles.tapArea, styles.leftTapArea]}
          onPress={goToPreviousStatus}
          activeOpacity={0.1}
        />
        <TouchableOpacity 
          style={[styles.tapArea, styles.rightTapArea]}
          onPress={goToNextStatus}
          activeOpacity={0.1}
        />

        <Image
          source={{ uri: getImageUrl(item.media) }}
          style={styles.fullImage}
          resizeMode="contain"
          onError={(e) => console.log('Image load error:', e.nativeEvent)}
        />

        <View style={styles.statusViewerOverlay}>
          <View style={styles.statusViewerHeader}>
            <Image
              source={{
                uri: item.user?.profile_picture
                  ? getSecureUrl(`${API_ROUTE_IMAGE}${item.user.profile_picture}`)
                  : 'https://via.placeholder.com/40',
              }}
              style={styles.statusViewerAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.statusViewerUsername}>
                {isMyStatus ? 'My Status' : item.user?.name || item.user}
              </Text>
              <Text style={styles.statusViewerTime}>{formatTime(item.created_at)}</Text>
            </View>
          
            <View style={styles.headerButton}>
              <TouchableOpacity 
                onPress={() => {
                  console.log('Close button pressed');
                  setModalVisible(false);
                  setCurrentStatusIndex(0);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomInputContainer}>
            {item.text && (
              <View style={styles.captionContainer}>
                <Text style={styles.statusViewerCaption}>{item.text}</Text>
              </View>
            )}

            {!isMyStatus && (
              <View style={styles.replyButtondContainer}>
                <TouchableOpacity 
                  style={styles.replyButton}
                  onPress={() => openReplyModal(item)}
                >
                  <MaterialIcon name="reply" size={20} color="#fff" />
                  <Text style={styles.replyButtonText}>like or reply</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {currentStatusIndex > 0 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.leftArrow]}
              onPress={goToPreviousStatus}
            >
              <Icon name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
          )}
          
          {currentStatusIndex < selectedUserStatuses.length - 1 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.rightArrow]}
              onPress={goToNextStatus}
            >
              <Icon name="chevron-forward" size={30} color="#fff" />
            </TouchableOpacity>
          )}

          <View style={styles.bottomActionsContainer}>
            {isMyStatus && (
              <>
                {item.viewers_count > 0 ? (
                  <TouchableOpacity
                    style={[styles.viewersButton, loadingViewers && styles.viewersButtonLoading]}
                    onPress={() => handleViewersPress(item)}
                    disabled={loadingViewers}
                  >
                    {loadingViewers ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Icon name="eye" size={16} color="#fff" style={styles.eyeIcon} />
                        <Text style={styles.viewersButtonText}>
                          {item.viewers_count} view{item.viewers_count !== 1 ? 's' : ''}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View style={styles.viewersButtonDisabled}>
                    <Icon name="eye-off" size={16} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.viewersButtonTextDisabled}>No views</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.deleteButtonBottom}
                  onPress={handleDeletePress}
                >
                  <Icon name="trash-outline" size={18} color="#fff" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderReplyModal = () => {
    if (!currentReplyStatus) return null;
    
    const statusOwner = currentReplyStatus.user?.name || 
                        currentReplyStatus.user?.username || 
                        currentReplyStatus.username || 
                        'User';
    const statusImage = getImageUrl(currentReplyStatus.media || currentReplyStatus.image);
    
    return (
      <Modal
        visible={showReplyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowReplyModal(false);
          setCurrentReplyStatus(null);
          setReplyMessage('');
        }}
      >
        <KeyboardAvoidingView 
          style={styles.replyModalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.replyModalContainer}>
            <View style={styles.replyModalHeader}>
              <TouchableOpacity 
                onPress={() => {
                  setShowReplyModal(false);
                  setCurrentReplyStatus(null);
                  setReplyMessage('');
                }}
              >
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.replyModalTitle}>Reply to Status</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.replyStatusPreview}>
              <Image
                source={statusImage ? { uri: statusImage } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
                style={styles.replyStatusImage}
                resizeMode="cover"
              />
              <View style={styles.replyStatusInfo}>
                <Text style={styles.replyStatusOwner}>
                  {statusOwner}
                </Text>
                {currentReplyStatus.text && (
                  <Text style={styles.replyStatusCaption} numberOfLines={2}>
                    {currentReplyStatus.text}
                  </Text>
                )}
                <Text style={styles.replyStatusTime}>
                  {formatTime(currentReplyStatus.created_at)}
                </Text>
              </View>
            </View>

            <View style={styles.quickReactionsRow}>
              {QUICK_REACTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.quickReactionButton}
                  onPress={() => sendQuickReaction(emoji)}
                  disabled={sendingReply}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickReactionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.replyInputContainer}>
              <Text style={styles.replyInputLabel}>
                Your Message
              </Text>
              <TextInput
                style={styles.replyInput}
                placeholder="Type your reply..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={replyMessage}
                onChangeText={setReplyMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.replySendButton,
                { backgroundColor: replyMessage.trim() ? colors.primary : 'rgba(255,255,255,0.15)' },
                sendingReply && styles.replySendButtonDisabled
              ]}
              onPress={sendStatusReply}
              disabled={!replyMessage.trim() || sendingReply}
            >
              {sendingReply ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name="send" size={20} color="#fff" />
                  <Text style={styles.replySendButtonText}>Send Reply</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const renderCommentsModal = () => (
    <Modal
      visible={commentsModalVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setCommentsModalVisible(false)}
    >
      <SafeAreaView style={styles.commentsModalContainer}>
        <View style={styles.commentsModalHeader}>
          <TouchableOpacity onPress={() => setCommentsModalVisible(false)}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.commentsModalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList
          data={currentComments}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Image
                source={{
                  uri: item.user?.profile_picture
                    ? `${API_ROUTE_IMAGE}${item.user.profile_picture}`
                    : 'https://via.placeholder.com/40',
                }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUserName}>
                  {item.user?.name || item.user?.phone}
                </Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentTime}>{formatTime(item.created_at)}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.commentsList}
        />
      </SafeAreaView>
    </Modal>
  );

  const renderSnackbar = () => {
    if (!snackbarVisible) return null;
    return (
      <Animated.View
        style={[
          styles.snackbarContainer,
          {
            opacity: snackbarAnim,
            backgroundColor: snackbarType === 'success' ? '#4CAF50' : 
                            snackbarType === 'error' ? '#f44336' : 
                            snackbarType === 'info' ? '#2196F3' : '#4CAF50',
          }
        ]}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Animated.View>
    );
  };

  const myStatus = groupedStatuses.find(
    (status) => status.user?.phone === currentUserPhone || status.user === currentUserPhone
  );
  const otherStatuses = groupedStatuses.filter(
    (status) => status.user?.phone !== currentUserPhone && status.user !== currentUserPhone
  );

  const combinedUpdates = [
    ...liveStreams.map(stream => ({ ...stream, type: 'live' })),
    ...otherStatuses.map(status => ({ ...status, type: 'status' }))
  ].sort((a, b) => {
    const timeA = new Date(a.created_at || a.started_at);
    const timeB = new Date(b.created_at || b.started_at);
    return timeB - timeA;
  });

  const handleScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentStatusIndex) {
      setCurrentStatusIndex(newIndex);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete Status?</Text>
            <Text style={styles.deleteModalText}>
              Are you sure you want to delete this status? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={() => {
                  if (statusToDelete && statusToDelete.id) {
                    deleteStatus(statusToDelete.id);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar 
        barStyle={isDark ? 'light-content' : 'light-content'} 
        backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <LinearGradient colors={[colors.primary, colors.primary, colors.primary]} style={styles.header}>
          <View style={[styles.headerTop, { paddingTop: insets.top }]}>
            <Text style={styles.headerTitle}>Updates</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIconButton} onPress={() => setAddStatusModalVisible(true)}>
                <Icon name="add" style={{ fontWeight: 'bold' }} size={22} color='black' />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tabRow}>
            {['Chats', 'Status', 'Calls'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  if (item === 'Chats') navigation.navigate('BusinessHome');
                  else if (item === 'Calls') navigation.navigate('BCalls');
                  else setTab(item);
                }}
              >
                <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
                {tab === item && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <StatusSection
                  showTitle={true}
                  title="Stories"
                  horizontal={true}
                  showAddButton={true}
                  maxItems={15}
                  onLivePress={(stream) => {
                    // navigation.navigate('LiveViewer', {
                    //   streamId: stream.id,
                    //   broadcasterName: stream.broadcaster_name,
                    // });
                    navigation.navigate('Viewer', {
                      roomName: 'match-123',
                      streamId: 'stream-1',
                      viewerId: 'viewer-1',
                    });
                  }}
                  containerStyle={{ marginTop: 0 }}
                />

        <View style={{ marginHorizontal: 16, marginTop: 20, marginBottom: 80 }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.sectionTitleChannel}>Channels</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BJoinChannel')}>
              <Text style={[styles.sectionTitle, styles.exploreButton]}>Explore</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <>
              {followingChannels.length > 0 && (
                <>
                  {followingChannels.map((channel) => (
                    <ChannelItem
                      key={channel.id}
                      channel={channel}
                      currentUserId={currentUserId}
                      navigation={navigation}
                      followLock={followLock}
                      handleFollow={handleFollow}
                    />
                  ))}
                </>
              )}
              <Text style={styles.subSectionTitle}>
                {followingChannels.length > 0 ? 'Suggested Channels' : 'All Channels'}
              </Text>

              {channels
                .filter((channel) => !channel.isFollowing)
                .map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    channel={channel}
                    currentUserId={currentUserId}
                    navigation={navigation}
                    followLock={followLock}
                    handleFollow={handleFollow}
                  />
                ))}
            </>
          )}
        </View>
      </ScrollView>
      
      {backgroundRefreshing && (
        <View style={styles.backgroundRefreshIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.backgroundRefreshText}>Updating...</Text>
        </View>
      )}
      
      {renderSnackbar()}
      
      <Modal
        visible={showAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeAnim,
          }}
        >
          <View
            style={{
              width: '88%',
              backgroundColor: colors.background,
              borderRadius: 18,
              paddingVertical: 28,
              paddingHorizontal: 22,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAccountModal(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: colors.buttonSecondary,
                borderRadius: 50,
                padding: 8,
              }}
            >
              <Icon name="close" size={22} color={colors.text} />
            </TouchableOpacity>
      
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              Choose Your Showa Experience
            </Text>
      
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: 25,
              }}
            >
              Switch between <Text style={{ fontWeight: '600', color: '#9704e0' }}>e-Vibbz</Text> (short videos)
              and <Text style={{ fontWeight: '600', color: '#0d6efd' }}>e-Broadcast</Text> (posts & updates)
            </Text>
      
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: '#9704e0',
                marginBottom: 12,
              }}
              onPress={() => {
                navigation.navigate('SocialHome');
                setShowAccountModal(false);
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Vibbz</Text>
            </TouchableOpacity>
      
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: '#0d6efd',
                marginBottom: 12,
              }}
              onPress={() => {
                navigation.navigate('BroadcastHome');
                setShowAccountModal(false);
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Broadcast</Text>
            </TouchableOpacity>
      
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: colors.buttonSecondary,
              }}
              onPress={() => {
                navigation.navigate('PHome')
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                Switch Account
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      <Modal
        visible={reactionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReactionModalVisible(false)}
      >
        <View style={styles.reactionsModalOverlay}>
          <View style={styles.reactionsModalContent}>
            <View style={styles.reactionsModalHeader}>
              <Text style={styles.reactionsModalTitle}>Reactions</Text>
              <TouchableOpacity onPress={() => setReactionModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentReactions}
              renderItem={({ item }) => (
                <View style={styles.reactionItem}>
                  <Image
                    source={{
                      uri: item.user?.profile_picture
                        ? `${API_ROUTE_IMAGE}${item.user.profile_picture}`
                        : 'https://via.placeholder.com/40',
                    }}
                    style={styles.reactionAvatar}
                  />
                  <View style={styles.reactionInfo}>
                    <Text style={styles.reactionUserName}>
                      {item.user?.name || item.user?.phone}
                    </Text>
                    <Text style={styles.reactionType}>
                      {getReactionEmoji(item.reaction_type)} {item.reaction_type}
                    </Text>
                  </View>
                  <Text style={styles.reactionTime}>
                    {formatTime(item.created_at)}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewersModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setViewersModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setViewersModalVisible(false)}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Viewers</Text>
            <View style={{ width: 24 }} />
          </View>
          <FlatList
            data={currentViewers}
            renderItem={renderViewerItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            contentContainerStyle={styles.viewersList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No viewers yet</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>

      <Modal 
        visible={modalVisible} 
        transparent={true} 
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.imageModal}>
          <FlatList
            ref={flatListRef}
            data={selectedUserStatuses}
            renderItem={renderStatusItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            initialScrollIndex={currentStatusIndex}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={handleScrollEnd}
            style={styles.flatList}
          />
        </View>
      </Modal>
        
      <SwitchAccountSheet
        showConfirmSwitch={showConfirmSwitch}
        setShowConfirmSwitch={setShowConfirmSwitch}
        pendingSwitchTo={pendingSwitchTo}
        switchAccount={switchAccount}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {renderCommentsModal()}
      
      {renderReplyModal()}

      <Modal
        visible={addStatusModalVisible}
        animationType="slide"
        onRequestClose={() => setAddStatusModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1, backgroundColor: colors.background }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
            <View style={styles.addStatusHeader}>
              <TouchableOpacity onPress={() => setAddStatusModalVisible(false)}>
                <Icon name="close" size={28} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.addStatusHeaderText, { color: colors.text }]}>Add Status</Text>
              <View style={{ width: 28 }} />
            </View>
            
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            ) : (
              <TouchableOpacity style={styles.imagePlaceholder} onPress={handleSelectMedia}>
                <Icon name="image-outline" size={50} color={colors.textSecondary} />
                <Text style={styles.imagePlaceholderText}>Select Media</Text>
              </TouchableOpacity>
            )}
            
            <View style={{ flex: 1, padding: 16 }}>
              <TextInput
                style={styles.captionInput}
                placeholder="Add a caption..."
                placeholderTextColor={colors.placeholder}
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                onPress={handlePostStatus}
                disabled={!image || postingStatus}
                style={[styles.postButtonContainer, (!image || postingStatus) ? styles.postButtonDisabled : {}]}
              >
                {postingStatus ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.postButtonText, !image ? styles.postButtonTextDisabled : {}]}>
                    Post Status
                  </Text>
                )}
              </TouchableOpacity>
              {image && !postingStatus && (
                <TouchableOpacity onPress={handleSelectMedia} style={{ marginTop: 15, alignItems: 'center' }}>
                  <Text style={{ color: colors.primary }}>Change Media</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
      
      <BottomNav 
        navigation={navigation} 
        setShowAccountModal={setShowAccountModal}
        activeRoute="Home" 
        style={{ zIndex: 9999 }}
      />
    </View>
  );
};

const createStyles = (colors, isDark, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    paddingBottom: 0,
    paddingTop: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: colors.primary,
    elevation: 3,
    zIndex: 1000,
  },
  headerTop: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 30,
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 6,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    paddingVertical: 6,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginLeft: 16,
    marginBottom: 10,
  },
  sectionTitleChannel: {
    fontFamily: 'Lato-Bold',
    fontSize: 24,
    color: colors.text,
    marginLeft: 16,
    marginBottom: 10,
  },
  // Instagram-style stories
  storiesScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  // Story wrapper
  storyWrapper: {
    alignItems: 'center',
    marginRight: 10,
     position: 'relative',
  },
  storyContainer: {
    alignItems: 'center',
    width: 100,
  },
  // Story Ring - 98x98
  storyRing: {
    width: 98,
    height: 98,
    borderRadius: 49,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyRingStatus: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  storyRingLive: {
    borderWidth: 3,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  storyRingUnseen: {
    borderWidth: 3,
    borderColor: '#405DE6',
    shadowColor: '#405DE6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Story Image - 90x90
  storyImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2.5,
    borderColor: '#fff',
    backgroundColor: '#e0e0e0',
  },
  // Empty story image
  emptyStoryImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Live Badge
  liveBadgeContainer: {
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  liveBadgePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 5,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  // Live glow ring
  liveGlowRing: {
    position: 'absolute',
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 3,
    borderColor: '#FF3B30',
    opacity: 0.4,
  },
  // Story name
  storyName: {
    fontSize: 12,
    color: colors.text,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'SourceSansPro-Regular',
    maxWidth: 90,
  },
  // Live label below name
  liveLabelContainer: {
    marginTop: 2,
    alignItems: 'center',
  },
  liveLabelText: {
    color: '#FF3B30',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Add Story - 98x98
  addStoryWrapper: {
    alignItems: 'center',
    marginRight: 10,
  },
  addStoryContainer: {
    alignItems: 'center',
    width: 100,
  },
  addStoryCircle: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: isDark ? colors.backgroundSecondary : '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addStoryLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'SourceSansPro-Regular',
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.1 : 0.05,
    shadowRadius: 4,
  },
  communityAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 5,
  },
  communityName: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  communityMsg: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  followerCount: {
    fontFamily: 'SourceSansPro-SemiBold',
    color: colors.text,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.buttonSecondary,
  },
  followingBtn: {
    backgroundColor: colors.border,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  imageModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  flatList: {
    flex: 1,
  },
  fullImage: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  statusViewerContainer: {
    width: width,
    height: height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusViewerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statusViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingBottom: 10,
  },
  statusViewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },

addBadgeContainer: {
  position: 'absolute',
  bottom: 10,
  right: 2,
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: colors.primary || '#405DE6',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2.5,
  borderColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 999,
},


  userInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  statusViewerUsername: {
    color: '#fff',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  statusViewerTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: 'SourceSansPro-Regular',
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionContainer: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    backgroundColor: 'rgba(21, 21, 21, 0.6)',
    padding: 10,
    borderRadius: 0,
    justifyContent: 'center',
    transform: [{ translateY: -50 }],
  },
  statusViewerCaption: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomInputContainer: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  replyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 132, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -25 }],
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  bottomActionsContainer: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  viewersButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    justifyContent: 'center',
  },
  viewersButtonLoading: {
    minWidth: 100,
    justifyContent: 'center',
  },
  viewersButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    justifyContent: 'center',
  },
  viewersButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SourceSansPro-SemiBold',
    marginLeft: 6,
  },
  viewersButtonTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: 'SourceSansPro-SemiBold',
    marginLeft: 6,
  },
  deleteButtonBottom: {
    backgroundColor: 'rgba(255, 59, 48, 0.85)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 90,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  eyeIcon: {
    marginRight: 2,
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.3,
    zIndex: 100,
  },
  leftTapArea: {
    left: 0,
  },
  rightTapArea: {
    right: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'SourceSansPro-SemiBold',
    color: colors.text,
  },
  viewersList: {
    padding: 16,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  viewerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  viewerInfo: {
    flex: 1,
  },
  viewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  viewerTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  addStatusHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  previewImage: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
    marginBottom: 10,
  },
  imagePlaceholder: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  imagePlaceholderText: {
    color: colors.textSecondary,
    marginTop: 10,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    color: colors.text,
    backgroundColor: colors.backgroundSecondary,
  },
  postButtonContainer: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: colors.surface,
  },
  postButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  postButtonTextDisabled: {
    color: colors.textTertiary,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  yourChannelBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  yourChannelText: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: 'bold',
  },
  addStatusLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
    fontFamily: 'SourceSansPro-Regular',
  },
  exploreButton: {
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.buttonSecondary,
    borderRadius: 20,
    width: 100,
    height: 29,
    textAlign: 'center',
    lineHeight: 25,
  },
  subSectionTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        zIndex: 10000,
      },
      android: {
        elevation: 10000,
      },
    }),
  },
  deleteModalContent: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 24,
    width: '85%',
    maxWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignSelf: 'center',
        marginHorizontal: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  deleteModalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        minHeight: 44,
      },
    }),
  },
  cancelButton: {
    backgroundColor: colors.buttonSecondary || '#E8E8E8',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: colors.error || '#FF3B30',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.text || '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reactionsModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  reactionsModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  reactionsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reactionsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reactionInfo: {
    flex: 1,
  },
  reactionUserName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  reactionType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reactionTime: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  commentsModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  commentsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentsModalTitle: {
    fontSize: 18,
    fontFamily: 'SourceSansPro-SemiBold',
    color: colors.text,
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  commentTime: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  backgroundRefreshIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 10,
    zIndex: 1000,
  },
  backgroundRefreshText: {
    marginLeft: 5,
    fontSize: 12,
    color: colors.primary,
  },
  snackbarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  snackbarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  replyModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  replyModalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
    backgroundColor: '#0f0f0f',
  },
  replyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  replyModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  replyStatusPreview: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  replyStatusImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  replyStatusInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  replyStatusOwner: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff',
  },
  replyStatusCaption: {
    fontSize: 13,
    marginBottom: 4,
    color: 'rgba(255,255,255,0.7)',
  },
  replyStatusTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  quickReactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickReactionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  quickReactionEmoji: {
    fontSize: 24,
  },
  replyInputContainer: {
    marginBottom: 16,
  },
  replyInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#fff',
  },
  replyInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  replySendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  replySendButtonDisabled: {
    opacity: 0.6,
  },
  replySendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatusScreen;
