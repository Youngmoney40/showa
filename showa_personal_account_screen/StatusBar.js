

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   ScrollView,
//   Modal,
//   Alert,
//   Keyboard,
//   StatusBar,
//   Platform,
//   Animated,
//   ImageBackground,
//   ActivityIndicator,
//   RefreshControl,
//   KeyboardAvoidingView,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useIsFocused } from '@react-navigation/native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import _ from 'lodash';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import BottomNav from '../components/BottomNavSocialMedia';
// import SwitchAccountSheet from '../components/SwitchAccountSheet';
// import EarningFloatingButton from '../components/EarningFloatingButton';
// import { useTheme } from '../src/context/ThemeContext';

// const { width, height } = Dimensions.get('window');

// const STATUS_STORAGE_KEY = '@status_data';
// const CHANNELS_STORAGE_KEY = '@channels_data';
// const FOLLOWING_CHANNELS_KEY = '@following_channels';
// const CACHE_TIMESTAMP_KEY = '@cache_timestamp';
// const CACHE_EXPIRY_HOURS = 24;
// const LIVE_STREAMS_KEY = '@live_streams';

// const StatusScreen = () => {
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const { colors, isDark } = useTheme();
  
//   const [tab, setTab] = useState('Status');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
//   const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
//   const [showAccountModal, setShowAccountModal] = useState(false);
//   const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
//   const [image, setImage] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [groupedStatuses, setGroupedStatuses] = useState([]);
//   const [channels, setChannels] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUserPhone, setCurrentUserPhone] = useState(null);
//   const [viewersModalVisible, setViewersModalVisible] = useState(false);
//   const [currentViewers, setCurrentViewers] = useState([]);
//   const [followLock, setFollowLock] = useState({});
//   const [followingChannels, setFollowingChannels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [backgroundRefreshing, setBackgroundRefreshing] = useState(false);
//   const [postingStatus, setPostingStatus] = useState(false);
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [statusToDelete, setStatusToDelete] = useState(null);
//   const [reactionModalVisible, setReactionModalVisible] = useState(false);
//   const [currentReactions, setCurrentReactions] = useState([]);
//   const [showCommentInput, setShowCommentInput] = useState(false);
//   const [commentText, setCommentText] = useState('');
//   const [currentComments, setCurrentComments] = useState([]);
//   const [commentsModalVisible, setCommentsModalVisible] = useState(false);
//   const [liveStreams, setLiveStreams] = useState([]);
//   const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
//   const [pendingSwitchTo, setPendingSwitchTo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [keyboardVisible, setKeyboardVisible] = useState(false);
  
//   const flatListRef = useRef(null);
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const insets = useSafeAreaInsets();

//   const styles = createStyles(colors, isDark, insets);
  
//   const getSecureUrl = (url) => {
//     if (!url) return null;
//     if (url.startsWith('http://')) {
//       return url.replace('http://', 'https://');
//     }
//     return url;
//   };
  
//   const getImageUrl = (url) => {
//     if (!url) return null;
//     if (url.startsWith('http://')) {
//       const httpsUrl = url.replace('http://', 'https://');
//       return httpsUrl;
//     }
//     if (url.startsWith('https://')) {
//       return url;
//     }
//     return `${API_ROUTE_IMAGE}${url}`;
//   };

//   const preloadAllStatusImages = async (statuses) => {
//     try {
//       const preloadPromises = [];
//       statuses.forEach(userStatus => {
//         userStatus.statuses.forEach(status => {
//           const imageUrl = getImageUrl(status.media);
//           if (imageUrl) {
//             preloadPromises.push(Image.prefetch(imageUrl));
//           }
//         });
//       });
//       await Promise.all(preloadPromises);
//       console.log('All status images preloaded successfully');
//     } catch (error) {
//       console.error('Error preloading images:', error);
//     }
//   };

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardVisible(true);
//     });
//     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardVisible(false);
//     });

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };

//   const saveDataToStorage = async (key, data) => {
//     try {
//       const jsonValue = JSON.stringify(data);
//       await AsyncStorage.setItem(key, jsonValue);
//       if (key === STATUS_STORAGE_KEY || key === CHANNELS_STORAGE_KEY || key === FOLLOWING_CHANNELS_KEY) {
//         await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
//       }
//     } catch (error) {
//       console.error('Error saving data to storage:', error);
//     }
//   };

//   const getDataFromStorage = async (key) => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(key);
//       return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error('Error getting data from storage:', error);
//       return null;
//     }
//   };

//   const checkCacheExpiry = async () => {
//     try {
//       const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
//       if (!timestamp) return true;
//       const cacheDate = new Date(timestamp);
//       const now = new Date();
//       const hoursDiff = (now - cacheDate) / (1000 * 60 * 60);
//       return hoursDiff > CACHE_EXPIRY_HOURS;
//     } catch (error) {
//       console.error('Error checking cache expiry:', error);
//       return true;
//     }
//   };

//   const clearCache = async () => {
//     try {
//       await AsyncStorage.multiRemove([STATUS_STORAGE_KEY, CHANNELS_STORAGE_KEY, FOLLOWING_CHANNELS_KEY, CACHE_TIMESTAMP_KEY]);
//     } catch (error) {
//       console.error('Error clearing cache:', error);
//     }
//   };

//   const loadCachedData = async () => {
//     try {
//       const isCacheExpired = await checkCacheExpiry();
//       if (isCacheExpired) {
//         await clearCache();
//         return false;
//       }

//       const [cachedStatuses, cachedChannels, cachedFollowingIds] = await Promise.all([
//         getDataFromStorage(STATUS_STORAGE_KEY),
//         getDataFromStorage(CHANNELS_STORAGE_KEY),
//         getDataFromStorage(FOLLOWING_CHANNELS_KEY),
//       ]);

//       if (cachedStatuses) {
//         setGroupedStatuses(cachedStatuses);
//         preloadAllStatusImages(cachedStatuses);
//       }
//       if (cachedChannels) {
//         setChannels(cachedChannels);
//       }
//       if (cachedFollowingIds && cachedChannels) {
//         const fullFollowedChannels = cachedChannels.filter((ch) => cachedFollowingIds.includes(ch.id));
//         setFollowingChannels(fullFollowedChannels);
//       }
//       return cachedStatuses || cachedChannels || cachedFollowingIds;
//     } catch (error) {
//       console.error('Error loading cached data:', error);
//       return false;
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 200 || response.status === 201) {
//         return response.data;
//       }
//       return null;
//     } catch (err) {
//       return null;
//     }
//   };

//   const switchAccount = async (account) => {
//     setIsLoading(true);
//     try {
//       await AsyncStorage.setItem('accountMode', account);
//       if (account === 'personal') {
//         navigation.navigate('BusinessHome');
//       } else {
//         const profile = await fetchProfile();
//         if (profile && profile.name && profile.name.trim() !== '') {
//           navigation.navigate('BusinessHome');
//         } else {
//           navigation.navigate('BusinessSetup');
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const groupStatusesByUser = (statuses) => {
//     const grouped = {};
//     statuses.forEach((status) => {
//       const userKey = status.user?.id || status.user;
//       if (!grouped[userKey]) {
//         grouped[userKey] = {
//           user: status.user || { id: status.user, phone: status.user, name: `User ${status.user}` },
//           statuses: [],
//           latestTime: new Date(status.created_at),
//           viewers_count: status.viewers_count,
//           viewers: Array.isArray(status.viewers) ? status.viewers : [],
//           status_type: status.status_type,
//           reactions: status.reactions || [],
//         };
//       }
//       grouped[userKey].statuses.push(status);
//       const currentTime = new Date(status.created_at);
//       if (currentTime > grouped[userKey].latestTime) {
//         grouped[userKey].latestTime = currentTime;
//         grouped[userKey].viewers_count = status.viewers_count;
//         grouped[userKey].viewers = Array.isArray(status.viewers) ? status.viewers : [];
//         grouped[userKey].status_type = status.status_type;
//         grouped[userKey].reactions = status.reactions || [];
//       }
//     });
//     return Object.values(grouped).sort((a, b) => b.latestTime - a.latestTime);
//   };

//   const formatTime = (date) => {
//     const now = new Date();
//     const diffInHours = (now - new Date(date)) / (1000 * 60 * 60);
//     if (diffInHours < 24) {
//       return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (diffInHours < 48) {
//       return 'Yesterday';
//     } else {
//       return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   const fetchCurrentUser = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         const parsedUserData = JSON.parse(userData);
//         setCurrentUserId(parsedUserData.id);
//         setCurrentUserPhone(parsedUserData.phone);
//         return parsedUserData;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//       return null;
//     }
//   };

//   const handleSelectMedia = () => {
//     Alert.alert('Choose Option', '', [
//       { text: 'Gallery', onPress: () => openGallery({ mediaType: 'photo', includeExtra: true }) },
//       { text: 'Cancel', style: 'cancel' },
//     ]);
//   };

//   const openGallery = (options) => {
//     launchImageLibrary(options, (response) => {
//       if (response.didCancel || response.errorCode) {
//         console.log('Media picker cancelled or failed:', response.errorCode || 'Cancelled');
//         return;
//       }
//       if (response.assets && response.assets.length > 0) {
//         setImage(response.assets[0]);
//       }
//     });
//   };

//   const handlePostStatus = async () => {
//     if (!image) {
//       Alert.alert('Error', 'Please select media.');
//       return;
//     }

//     setPostingStatus(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         Alert.alert('Error', 'User not authenticated. Please log in.');
//         return;
//       }
//       const formData = new FormData();
//       formData.append('media', {
//         uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
//         type: image.type || 'image/jpeg',
//         name: image.fileName || 'status.jpg',
//       });
//       formData.append('text', caption);
//       formData.append('status_type', 'image');
      
//       const res = await axios.post(`${API_ROUTE}/status/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//         timeout: 30000,
//       });
      
//       Alert.alert('Success', 'Status uploaded successfully!');
//       setImage(null);
//       setCaption('');
//       setAddStatusModalVisible(false);
//       await fetchAllData();
//     } catch (error) {
//       console.error('Upload error:', error.response?.data || error.message);
//       Alert.alert('Upload Failed', 'Please try again.');
//     } finally {
//       setPostingStatus(false);
//     }
//   };

//   const trackStatusView = async (statusId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/status/${statusId}/track-view/`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (error) {
//       console.error('Error tracking status view:', error);
//     }
//   };

//   const deleteStatus = async (statusId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.delete(
//         `${API_ROUTE}/status/${statusId}/delete/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Update the local state to remove the deleted status
//       setGroupedStatuses(prev => {
//         const updated = prev.map(group => ({
//           ...group,
//           statuses: group.statuses.filter(status => status.id !== statusId)
//         })).filter(group => group.statuses.length > 0);
//         return updated;
//       });
      
//       setDeleteModalVisible(false);
//       setStatusToDelete(null);
      
//       // If the modal is open and showing the deleted status, close it
//       if (modalVisible) {
//         setModalVisible(false);
//         setCurrentStatusIndex(0);
//       }
      
//       Alert.alert('Success', 'Status deleted successfully');
//       await fetchAllData();
//     } catch (error) {
//       console.error('Error deleting status:', error);
//       Alert.alert('Error', 'Failed to delete status');
//     }
//   };

//   const addReaction = async (statusId, reactionType) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await axios.post(
//         `${API_ROUTE}/status/${statusId}/react/`,
//         { reaction_type: reactionType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setGroupedStatuses(prev => 
//         prev.map(group => ({
//           ...group,
//           statuses: group.statuses.map(status => 
//             status.id === statusId 
//               ? {
//                   ...status,
//                   user_reaction: reactionType,
//                   reactions: [
//                     ...(status.reactions || []).filter(r => r.user.id !== currentUserId),
//                     { user: { id: currentUserId }, reaction_type: reactionType }
//                   ]
//                 }
//               : status
//           )
//         }))
//       );
      
//       setReactionModalVisible(false);
//     } catch (error) {
//       console.error('Error adding reaction:', error);
//     }
//   };

//   const showReactions = (reactions) => {
//     setCurrentReactions(reactions);
//     setReactionModalVisible(true);
//   };

//   const getReactionEmoji = (reaction) => {
//     const emojis = {
//       like: '👍',
//       love: '❤️',
//       laugh: '😂',
//       wow: '😮',
//       sad: '😢',
//       angry: '😠'
//     };
//     return emojis[reaction] || '👍';
//   };

//   const goToPreviousStatus = () => {
//     if (currentStatusIndex > 0) {
//       const newIndex = currentStatusIndex - 1;
//       setCurrentStatusIndex(newIndex);
//       flatListRef.current?.scrollToIndex({ 
//         index: newIndex, 
//         animated: true 
//       });
//     }
//   };

//   const goToNextStatus = () => {
//     if (currentStatusIndex < selectedUserStatuses.length - 1) {
//       const newIndex = currentStatusIndex + 1;
//       setCurrentStatusIndex(newIndex);
//       flatListRef.current?.scrollToIndex({ 
//         index: newIndex, 
//         animated: true 
//       });
//     } else {
//       setModalVisible(false);
//       setCurrentStatusIndex(0);
//     }
//   };

//   const handleAddComment = async (statusId) => {
//     if (!commentText.trim()) return;
    
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/status/${statusId}/comment/`,
//         { text: commentText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setGroupedStatuses(prev => 
//         prev.map(group => ({
//           ...group,
//           statuses: group.statuses.map(status => 
//             status.id === statusId 
//               ? {
//                   ...status,
//                   comments: [
//                     ...(status.comments || []),
//                     {
//                       id: Date.now(),
//                       user: { id: currentUserId, name: 'You', phone: currentUserPhone },
//                       text: commentText,
//                       created_at: new Date().toISOString()
//                     }
//                   ]
//                 }
//               : status
//           )
//         }))
//       );
      
//       setCommentText('');
//       setShowCommentInput(false);
//       Alert.alert('Success', 'Comment added successfully');
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       Alert.alert('Error', 'Failed to add comment');
//     }
//   };

//   const fetchComments = async (statusId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await axios.get(
//         `${API_ROUTE}/status/${statusId}/comments/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCurrentComments(res.data);
//       setCommentsModalVisible(true);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };

//   const openImageModal = (userStatuses) => {
//     setSelectedUserStatuses(userStatuses.statuses);
//     setCurrentStatusIndex(0);
//     setModalVisible(true);
//     setShowCommentInput(false);
//     setCommentText('');
    
//     userStatuses.statuses.forEach(status => {
//       const isMyStatus = status.user?.phone === currentUserPhone || status.user === currentUserPhone;
//       if (!isMyStatus) {
//         trackStatusView(status.id);
//       }
//     });
//   };

//   const fetchLiveStreams = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/live-streams/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       const liveStreamsWithTime = response.data.map(stream => ({
//         ...stream,
//         started_at: stream.created_at || new Date().toISOString(),
//         isLive: true
//       }));
      
//       setLiveStreams(liveStreamsWithTime);
//       await AsyncStorage.setItem(LIVE_STREAMS_KEY, JSON.stringify(liveStreamsWithTime));
//     } catch (error) {
//       console.error('Error fetching live streams:', error.message);
//       const cached = await getDataFromStorage(LIVE_STREAMS_KEY);
//       if (cached) setLiveStreams(cached);
//     }
//   };

//   const fetchChannels = async (followedChannelIds = []) => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       const res = await axios.get(`${API_ROUTE}/channels/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const processedChannels = res.data.map((channel) => ({
//         ...channel,
//         isFollowing: followedChannelIds.includes(channel.id),
//       }));
//       const sortedChannels = [...processedChannels].sort((a, b) => {
//         if (a.isFollowing === b.isFollowing) return 0;
//         return a.isFollowing ? -1 : 1;
//       });
//       await saveDataToStorage(CHANNELS_STORAGE_KEY, sortedChannels);
//       return sortedChannels;
//     } catch (err) {
//       console.error('Error fetching channels:', err);
//       return [];
//     }
//   };

//   const handleFollow = async (slug) => {
//     if (followLock[slug]) return;
//     setFollowLock((prev) => ({ ...prev, [slug]: true }));
//     try {
//       setChannels((prev) => {
//         const updated = prev.map((ch) =>
//           ch.slug === slug
//             ? {
//                 ...ch,
//                 isFollowing: !ch.isFollowing,
//                 followers_count: ch.isFollowing ? ch.followers_count - 1 : ch.followers_count + 1,
//               }
//             : ch
//         );
//         return updated.sort((a, b) => b.isFollowing - a.isFollowing);
//       });
//       setFollowingChannels((prev) => {
//         if (prev.some((ch) => ch.slug === slug)) {
//           return prev.filter((ch) => ch.slug !== slug);
//         } else {
//           const channelToAdd = channels.find((ch) => ch.slug === slug);
//           return channelToAdd ? [...prev, { ...channelToAdd, isFollowing: true }] : prev;
//         }
//       });
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/channels/${slug}/follow/`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await saveDataToStorage(CHANNELS_STORAGE_KEY, channels);
//       await saveDataToStorage(FOLLOWING_CHANNELS_KEY, followingChannels.map((ch) => ch.id));
//     } catch (err) {
//       console.error('Follow error:', err);
//     } finally {
//       setFollowLock((prev) => ({ ...prev, [slug]: false }));
//     }
//   };

//   const fetchStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         Alert.alert('Error', 'No token found. Please log in.');
//         return [];
//       }
//       const res = await axios.get(`${API_ROUTE}/status/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });
//       if (res.status === 200 || res.status === 201) {
//         const grouped = groupStatusesByUser(res.data);
//         await saveDataToStorage(STATUS_STORAGE_KEY, grouped);
//         return grouped;
//       } else {
//         Alert.alert('Error', 'Failed to fetch statuses.');
//         return [];
//       }
//     } catch (error) {
//       console.error('Fetch status error:', error);
//       return [];
//     }
//   };

//   const fetchFollowingChannels = async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       const res = await axios.get(`${API_ROUTE}/channels/following/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.status === 200 || res.status === 201) {
//         const followedIds = res.data.map((channel) => channel.id);
//         await saveDataToStorage(FOLLOWING_CHANNELS_KEY, followedIds);
//         return followedIds;
//       }
//       return [];
//     } catch (err) {
//       return [];
//     }
//   };

//   const fetchAllData = async (isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setBackgroundRefreshing(true);
//       } else {
//         setLoading(true);
//       }
//       const user = await fetchCurrentUser();
//       if (!user) {
//         Alert.alert('Not User Found', 'Please log in again.');
//         return;
//       }
//       const [followedChannelIds, statuses] = await Promise.all([
//         fetchFollowingChannels(), 
//         fetchStatus()
//       ]);
//       const allChannels = await fetchChannels(followedChannelIds);
//       const fullFollowedChannels = allChannels.filter((ch) => ch.isFollowing);
      
//       setGroupedStatuses(statuses);
//       setChannels(allChannels);
//       setFollowingChannels(fullFollowedChannels);
      
//       if (statuses && statuses.length > 0) {
//         preloadAllStatusImages(statuses);
//       }
      
//       await fetchLiveStreams();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load data. Please try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//       setBackgroundRefreshing(false);
//     }
//   };

//   const fetchAllDataSilently = _.debounce(async () => {
//     try {
//       const user = await fetchCurrentUser();
//       if (!user) return;
//       const isCacheExpired = await checkCacheExpiry();
//       if (isCacheExpired) {
//         await clearCache();
//       }
//       const [followedChannelIds, statuses] = await Promise.all([fetchFollowingChannels(), fetchStatus()]);
//       const allChannels = await fetchChannels(followedChannelIds);
//       const fullFollowedChannels = allChannels.filter((ch) => ch.isFollowing);
      
//       setGroupedStatuses((prev) => {
//         if (JSON.stringify(prev) !== JSON.stringify(statuses)) {
//           return statuses;
//         }
//         return prev;
//       });
//       setChannels((prev) => {
//         if (JSON.stringify(prev) !== JSON.stringify(allChannels)) {
//           return allChannels;
//         }
//         return prev;
//       });
//       setFollowingChannels((prev) => {
//         if (JSON.stringify(prev) !== JSON.stringify(fullFollowedChannels)) {
//           return fullFollowedChannels;
//         }
//         return prev;
//       });
      
//       await fetchLiveStreams();
//     } catch (error) {
//       console.error('Silent refresh error:', error);
//     }
//   }, 1000);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAllData(true);
//   };

//   useEffect(() => {
//     if (isFocused) {
//       (async () => {
//         const hasCache = await loadCachedData();
//         if (!hasCache) {
//           await fetchAllData(false);
//         } else {
//           fetchAllDataSilently();
//         }
//       })();
//     }
//   }, [isFocused]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isFocused) {
//         fetchAllDataSilently();
//       }
//     }, 30000);
//     return () => clearInterval(interval);
//   }, [isFocused]);

//   const renderViewerItem = ({ item }) => (
//     <View style={styles.viewerItem}>
//       <Image
//         source={{
//           uri: item.profile_picture
//             ? `${API_ROUTE_IMAGE}${item.profile_picture}`
//             : 'https://via.placeholder.com/40',
//         }}
//         style={styles.viewerAvatar}
//       />
//       <View style={styles.viewerInfo}>
//         <Text style={styles.viewerName}>{item.name || item.phone}</Text>
//         {item.viewed_at && (
//           <Text style={styles.viewerTime}>Seen {formatTime(item.viewed_at)}</Text>
//         )}
//       </View>
//     </View>
//   );

//   const ChannelItem = ({ channel, currentUserId, navigation, followLock, handleFollow }) => {
//     const isCreator = currentUserId && channel.creator === currentUserId;
    
//     return (
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => {
//           if (currentUserId && channel.creator === currentUserId) {
//             navigation.navigate('ChannelAdminManagement', {
//               receiverId: channel.id,
//               name: channel.name,
//               chatType: 'channel',
//               channelSlug: channel.slug,
//               profile_image: channel.image,
//               InviteLink: channel.invite_link,
//               followers: channel.followers_count,
//             });
//           } else {
//             navigation.navigate('ChannelDetails', {
//               receiverId: channel.id,
//               name: channel.name,
//               chatType: 'channel',
//               profile_image: channel.image,
//               channelSlug: channel.slug,
//               InviteLink: channel.invite_link,
//               followers: channel.followers_count,
//             });
//           }
//         }}
//       >
//         <View style={styles.communityItem}>
//           <View style={styles.avatarContainer}>
//             <Image
//               source={
//                 channel.image
//                   ? { uri: `${API_ROUTE_IMAGE}${channel.image}` }
//                   : require('../assets/images/channelfallbackimg.png')
//               }
//               style={styles.communityAvatar}
//             />
//             {isCreator && (
//               <View style={styles.yourChannelBadge}>
//                 <Text style={styles.yourChannelText}>Yours</Text>
//               </View>
//             )}
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.communityName}>{channel.name}</Text>
//             {channel.isFollowing && !isCreator ? (
//               <Text style={[styles.followerCount, { color: colors.textSecondary, fontSize: 13 }]}>
//                 {channel.description?.slice(0, 24) + '...' || 'No description'}
//               </Text>
//             ) : null}
//             <Text style={styles.communityMsg}>
//               <Text style={styles.followerCount}>{channel.followers_count?.toLocaleString() || '0'}</Text> followers
//             </Text>
//           </View>
          
//           {!isCreator && (
//             <TouchableOpacity
//               disabled={followLock[channel.slug]}
//               onPress={(e) => {
//                 e.stopPropagation();
//                 handleFollow(channel.slug);
//               }}
//               style={[styles.followBtn, channel.isFollowing && styles.followingBtn, followLock[channel.slug] && styles.disabledBtn]}
//             >
//               {followLock[channel.slug] ? (
//                 <ActivityIndicator size="small" color={colors.icon} />
//               ) : (
//                 <Text style={{ color: channel.isFollowing ? colors.text : colors.text }}>
//                   {channel.isFollowing ? 'Following' : 'Follow'}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderStatusPreview = (userStatus) => {
//     return (
//       <TouchableOpacity style={styles.statusWrapper} onPress={() => openImageModal(userStatus)}>
//         <View style={styles.statusContainer}>
//           <ImageBackground
//             source={{ uri: getImageUrl(userStatus.statuses[0].media) }}
//             style={styles.statusMedia}
//             imageStyle={styles.statusMediaStyle}
//           />
//           <View style={styles.statusNameContainer}>
//             <Text style={styles.statusNameText} numberOfLines={1}>
//               {userStatus.user?.phone === currentUserPhone || userStatus.user === currentUserPhone
//                 ? 'My Story'
//                 : userStatus.user?.name || userStatus.user}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderLiveStreamPreview = (stream) => (
//     <TouchableOpacity 
//       style={styles.statusWrapper}
//       onPress={() => 
//       navigation.navigate('Viewer', {
//         roomName: 'match-123',
//         streamId: 'stream-1',
//         viewerId: 'viewer-1',
//       })}
      
//     >
//       <View style={styles.statusContainer}>
//         <ImageBackground
//           source={
//             stream.broadcaster_image
//               ? { uri: stream.broadcaster_image.startsWith('http://') ? stream.broadcaster_image.replace('http://', 'https://') : stream.broadcaster_image }
//               : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//           }
//           style={styles.statusMedia}
//           imageStyle={styles.statusMediaStyle}
//         >
//           <View style={styles.liveBadge}>
//             <View style={styles.liveIndicator} />
//             <Text style={styles.liveText}>LIVE</Text>
//           </View>
//         </ImageBackground>
//         <View style={styles.statusNameContainer}>
//           <Text style={styles.statusNameText} numberOfLines={1}>
//             {stream.broadcaster_name || 'User'}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );


//   const renderStatusItem = ({ item, index }) => {
//   const isMyStatus = item.user?.phone === currentUserPhone || item.user === currentUserPhone;
  
//   const handleDeletePress = () => {
//     Alert.alert(
//       'Delete Status',
//       'Are you sure you want to delete this status? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', onPress: () => deleteStatus(item.id), style: 'destructive' },
//       ]
//     );
//   };
  
//   return (
//     <View style={styles.statusViewerContainer}>
//       {/* These tap areas are intercepting touches */}
//       <TouchableOpacity 
//         style={[styles.tapArea, styles.leftTapArea]}
//         onPress={goToPreviousStatus}
//         activeOpacity={0.1}
//       />
//       <TouchableOpacity 
//         style={[styles.tapArea, styles.rightTapArea]}
//         onPress={goToNextStatus}
//         activeOpacity={0.1}
//       />

//       <Image
//         source={{ uri: getImageUrl(item.media) }}
//         style={styles.fullImage}
//         resizeMode="contain"
//       />

//       <View style={styles.statusViewerOverlay}>
//         <View style={styles.statusViewerHeader}>
//           <Image
//             source={{
//               uri: item.user?.profile_picture
//                 ? getSecureUrl(`${API_ROUTE_IMAGE}${item.user.profile_picture}`)
//                 : 'https://via.placeholder.com/40',
//             }}
//             style={styles.statusViewerAvatar}
//           />
//           <View style={styles.userInfo}>
//             <Text style={styles.statusViewerUsername}>
//               {isMyStatus ? 'My Status' : item.user?.name || item.user}
//             </Text>
//             <Text style={styles.statusViewerTime}>{formatTime(item.created_at)}</Text>
//           </View>
          
//           {isMyStatus && (
//             <TouchableOpacity 
//               style={styles.headerButton}
//               onPress={handleDeletePress}
//             >
//               <Icon name="trash-outline" size={24} color="#fff" />
//             </TouchableOpacity>
//           )}
        
//           {/* <TouchableOpacity 
//             style={styles.headerButton}
//             onPress={() => {
//               if (item.reactions && item.reactions.length > 0) {
//                 showReactions(item.reactions);
//               }
//             }}
//           >
//             <Icon name="eye" size={24} color={item.user_reaction ? '#ff375f' : '#fff'} />
//             <Text style={styles.reactionCount}>{item.reactions?.length || 0}</Text>
//           </TouchableOpacity> */}
          
//           {/* FIX: Change this to a View with higher zIndex and ensure it's clickable */}
//           <View style={styles.headerButton}>
//             <TouchableOpacity 
//               onPress={() => {
//                 console.log('Close button pressed');
//                 setModalVisible(false);
//                 setCurrentStatusIndex(0);
//               }}
//               activeOpacity={0.7}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Icon name="close" size={24} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Rest of your component remains the same */}
//         <View style={styles.bottomInputContainer}>
//           {item.text && (
//             <View style={styles.captionContainer}>
//               <Text style={styles.statusViewerCaption}>{item.text}</Text>
//             </View>
//           )}

//           {!isMyStatus && (
//             <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 8,marginTop:-100, flexDirection: 'row', paddingHorizontal: 10 }}>
//               <View style={styles.inputWrapper}>
//                 <TextInput
//                   style={styles.commentInput}
//                   placeholder="Reply to status..."
//                   placeholderTextColor="#999"
//                   value={commentText}
//                   onChangeText={setCommentText}
//                   multiline
//                 />
//                 <TouchableOpacity 
//                   style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
//                   onPress={() => handleAddComment(item.id)}
//                   disabled={!commentText.trim()}
//                 >
//                   <Icon name="send" size={20} color={commentText.trim() ? "#0084ff" : "#666"} />
//                 </TouchableOpacity>
//               </View>
//               <TouchableOpacity 
//                 style={styles.quickActionButton}
//                 onPress={() => addReaction(item.id, 'like')}
//               >
//                 <Icon name="heart-outline" size={30} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {currentStatusIndex > 0 && (
//           <TouchableOpacity 
//             style={[styles.navArrow, styles.leftArrow]}
//             onPress={goToPreviousStatus}
//           >
//             <Icon name="chevron-back" size={30} color="#fff" />
//           </TouchableOpacity>
//         )}
        
//         {currentStatusIndex < selectedUserStatuses.length - 1 && (
//           <TouchableOpacity 
//             style={[styles.navArrow, styles.rightArrow]}
//             onPress={goToNextStatus}
//           >
//             <Icon name="chevron-forward" size={30} color="#fff" />
//           </TouchableOpacity>
//         )}

//         {isMyStatus && item.viewers_count > 0 && (
//           <TouchableOpacity
//             style={styles.viewersButton}
//             onPress={() => {
//               if (item.viewers && item.viewers.length > 0) {
//                 setCurrentViewers(item.viewers);
//                 setViewersModalVisible(true);
//               }
//             }}
//           >
//             <Icon name="eye" size={16} color="#fff" style={styles.eyeIcon} />
//             <Text style={styles.viewersButtonText}>
//               {item.viewers_count} view{item.viewers_count !== 1 ? 's' : ''}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };


//   const renderCommentsModal = () => (
//     <Modal
//       visible={commentsModalVisible}
//       transparent={false}
//       animationType="slide"
//       onRequestClose={() => setCommentsModalVisible(false)}
//     >
//       <SafeAreaView style={styles.commentsModalContainer}>
//         <View style={styles.commentsModalHeader}>
//           <TouchableOpacity onPress={() => setCommentsModalVisible(false)}>
//             <Icon name="arrow-back" size={24} color={colors.text} />
//           </TouchableOpacity>
//           <Text style={styles.commentsModalTitle}>Comments</Text>
//           <View style={{ width: 24 }} />
//         </View>
//         <FlatList
//           data={currentComments}
//           renderItem={({ item }) => (
//             <View style={styles.commentItem}>
//               <Image
//                 source={{
//                   uri: item.user?.profile_picture
//                     ? `${API_ROUTE_IMAGE}${item.user.profile_picture}`
//                     : 'https://via.placeholder.com/40',
//                 }}
//                 style={styles.commentAvatar}
//               />
//               <View style={styles.commentContent}>
//                 <Text style={styles.commentUserName}>
//                   {item.user?.name || item.user?.phone}
//                 </Text>
//                 <Text style={styles.commentText}>{item.text}</Text>
//                 <Text style={styles.commentTime}>{formatTime(item.created_at)}</Text>
//               </View>
//             </View>
//           )}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={styles.commentsList}
//         />
//       </SafeAreaView>
//     </Modal>
//   );

//   const myStatus = groupedStatuses.find(
//     (status) => status.user?.phone === currentUserPhone || status.user === currentUserPhone
//   );
//   const otherStatuses = groupedStatuses.filter(
//     (status) => status.user?.phone !== currentUserPhone && status.user !== currentUserPhone
//   );

//   const combinedUpdates = [
//     ...liveStreams.map(stream => ({ ...stream, type: 'live' })),
//     ...otherStatuses.map(status => ({ ...status, type: 'status' }))
//   ].sort((a, b) => {
//     const timeA = new Date(a.created_at || a.started_at);
//     const timeB = new Date(b.created_at || b.started_at);
//     return timeB - timeA;
//   });

//   const handleScrollEnd = (event) => {
//     const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
//     if (newIndex !== currentStatusIndex) {
//       setCurrentStatusIndex(newIndex);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar 
//         barStyle={isDark ? 'light-content' : 'light-content'} 
//         backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
//       />
      
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//       >
//         <LinearGradient colors={[colors.primary, colors.primary, colors.primary]} style={styles.header}>
//           <View style={[styles.headerTop, { paddingTop: insets.top }]}>
//             <Text style={styles.headerTitle}>Updates</Text>
//             <View style={styles.headerIcons}>
//               <TouchableOpacity style={styles.headerIconButton} onPress={() => setAddStatusModalVisible(true)}>
//                 <Icon name="add" style={{ fontWeight: 'bold' }} size={22} color='black' />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <View style={styles.tabRow}>
//             {['Chats', 'Status', 'Calls'].map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 onPress={() => {
//                   if (item === 'Chats') navigation.navigate('PHome');
//                   else if (item === 'Calls') navigation.navigate('BCalls');
//                   else setTab(item);
//                 }}
//               >
//                 <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
//                 {tab === item && <View style={styles.tabUnderline} />}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </LinearGradient>

//         <View style={{ marginTop: 10, marginBottom: 20 }}>
//           <Text style={[styles.sectionTitle, { fontWeight: '600', fontSize: 20 }]}>Live updates</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.statusScrollContainer}
//           >
//             {myStatus ? (
//               renderStatusPreview(myStatus)
//             ) : (
//               <View style={{ alignItems: 'center', marginRight: 12 }}>
//                 <TouchableOpacity
//                   style={styles.addStatusCircle}
//                   onPress={() => setAddStatusModalVisible(true)}
//                 >
//                   <View style={styles.addStatusInnerCircle}>
//                     <Icon name="add" size={24} color={colors.primary} />
//                   </View>
//                 </TouchableOpacity>
//                 <Text style={styles.addStatusLabel}>Create new </Text>
//                 <Text style={styles.addStatusLabel}>status</Text>
//               </View>
//             )}

//             {combinedUpdates.map((item, index) => {
//               if (item.type === 'live') {
//                 return renderLiveStreamPreview(item);
//               } else {
//                 return renderStatusPreview(item);
//               }
//             })}
//           </ScrollView>
//         </View>

//         <View style={{ marginHorizontal: 16, marginTop: 20, marginBottom: 80 }}>
//           <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//             <Text style={styles.sectionTitleChannel}>Channels</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('BJoinChannel')}>
//               <Text style={[styles.sectionTitle, styles.exploreButton]}>Explore</Text>
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={colors.primary} />
//             </View>
//           ) : (
//             <>
//               {followingChannels.length > 0 && (
//                 <>
//                   {followingChannels.map((channel) => (
//                     <ChannelItem
//                       key={channel.id}
//                       channel={channel}
//                       currentUserId={currentUserId}
//                       navigation={navigation}
//                       followLock={followLock}
//                       handleFollow={handleFollow}
//                     />
//                   ))}
//                 </>
//               )}
//               <Text style={styles.subSectionTitle}>
//                 {followingChannels.length > 0 ? 'Suggested Channels' : 'All Channels'}
//               </Text>

//               {channels
//                 .filter((channel) => !channel.isFollowing)
//                 .map((channel) => (
//                   <ChannelItem
//                     key={channel.id}
//                     channel={channel}
//                     currentUserId={currentUserId}
//                     navigation={navigation}
//                     followLock={followLock}
//                     handleFollow={handleFollow}
//                   />
//                 ))}
//             </>
//           )}
//         </View>
//       </ScrollView>
      
//       {backgroundRefreshing && (
//         <View style={styles.backgroundRefreshIndicator}>
//           <ActivityIndicator size="small" color={colors.primary} />
//           <Text style={styles.backgroundRefreshText}>Updating...</Text>
//         </View>
//       )}
      
//       <Modal
//         visible={showAccountModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAccountModal(false)}
//       >
//         <Animated.View
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0,0,0,0.6)',
//             justifyContent: 'center',
//             alignItems: 'center',
//             opacity: fadeAnim,
//           }}
//         >
//           <View
//             style={{
//               width: '88%',
//               backgroundColor: colors.background,
//               borderRadius: 18,
//               paddingVertical: 28,
//               paddingHorizontal: 22,
//               alignItems: 'center',
//               shadowColor: '#000',
//               shadowOpacity: 0.25,
//               shadowRadius: 10,
//               elevation: 8,
//             }}
//           >
//             <TouchableOpacity
//               onPress={() => setShowAccountModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 backgroundColor: colors.buttonSecondary,
//                 borderRadius: 50,
//                 padding: 8,
//               }}
//             >
//               <Icon name="close" size={22} color={colors.text} />
//             </TouchableOpacity>
      
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: '700',
//                 color: colors.text,
//                 marginBottom: 8,
//                 textAlign: 'center',
//               }}
//             >
//               Choose Your Showa Experience
//             </Text>
      
//             <Text
//               style={{
//                 fontSize: 14,
//                 color: colors.textSecondary,
//                 textAlign: 'center',
//                 lineHeight: 20,
//                 marginBottom: 25,
//               }}
//             >
//               Switch between <Text style={{ fontWeight: '600', color: '#9704e0' }}>e-Vibbz</Text> (short videos)
//               and <Text style={{ fontWeight: '600', color: '#0d6efd' }}>e-Broadcast</Text> (posts & updates)
//             </Text>
      
//             <TouchableOpacity
//               style={{
//                 width: '100%',
//                 paddingVertical: 14,
//                 borderRadius: 12,
//                 alignItems: 'center',
//                 backgroundColor: '#9704e0',
//                 marginBottom: 12,
//               }}
//               onPress={() => {
//                 navigation.navigate('SocialHome');
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Vibbz</Text>
//             </TouchableOpacity>
      
//             <TouchableOpacity
//               style={{
//                 width: '100%',
//                 paddingVertical: 14,
//                 borderRadius: 12,
//                 alignItems: 'center',
//                 backgroundColor: '#0d6efd',
//                 marginBottom: 12,
//               }}
//               onPress={() => {
//                 navigation.navigate('BroadcastHome');
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Broadcast</Text>
//             </TouchableOpacity>
      
//             <TouchableOpacity
//               style={{
//                 width: '100%',
//                 paddingVertical: 14,
//                 borderRadius: 12,
//                 alignItems: 'center',
//                 backgroundColor: colors.buttonSecondary,
//               }}
//               onPress={() => {
//                 navigation.navigate('PHome')
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
//                 Switch Account
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>

//       <Modal
//         visible={reactionModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setReactionModalVisible(false)}
//       >
//         <View style={styles.reactionsModalOverlay}>
//           <View style={styles.reactionsModalContent}>
//             <View style={styles.reactionsModalHeader}>
//               <Text style={styles.reactionsModalTitle}>Reactions</Text>
//               <TouchableOpacity onPress={() => setReactionModalVisible(false)}>
//                 <Icon name="close" size={24} color={colors.text} />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={currentReactions}
//               renderItem={({ item }) => (
//                 <View style={styles.reactionItem}>
//                   <Image
//                     source={{
//                       uri: item.user?.profile_picture
//                         ? `${API_ROUTE_IMAGE}${item.user.profile_picture}`
//                         : 'https://via.placeholder.com/40',
//                     }}
//                     style={styles.reactionAvatar}
//                   />
//                   <View style={styles.reactionInfo}>
//                     <Text style={styles.reactionUserName}>
//                       {item.user?.name || item.user?.phone}
//                     </Text>
//                     <Text style={styles.reactionType}>
//                       {getReactionEmoji(item.reaction_type)} {item.reaction_type}
//                     </Text>
//                   </View>
//                   <Text style={styles.reactionTime}>
//                     {formatTime(item.created_at)}
//                   </Text>
//                 </View>
//               )}
//               keyExtractor={(item, index) => index.toString()}
//             />
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         visible={viewersModalVisible}
//         transparent={false}
//         animationType="slide"
//         onRequestClose={() => setViewersModalVisible(false)}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <TouchableOpacity onPress={() => setViewersModalVisible(false)}>
//               <Icon name="arrow-back" size={24} color={colors.text} />
//             </TouchableOpacity>
//             <Text style={styles.modalTitle}>Viewers</Text>
//             <View style={{ width: 24 }} />
//           </View>
//           <FlatList
//             data={currentViewers}
//             renderItem={renderViewerItem}
//             keyExtractor={(item, index) => index.toString()}
//             contentContainerStyle={styles.viewersList}
//           />
//         </SafeAreaView>
//       </Modal>

//       <Modal 
//         visible={modalVisible} 
//         transparent={true} 
//         onRequestClose={() => setModalVisible(false)}
//         statusBarTranslucent={true}
//       >
//         <View style={styles.imageModal}>
//           <FlatList
//             ref={flatListRef}
//             data={selectedUserStatuses}
//             renderItem={renderStatusItem}
//             keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             scrollEnabled={false}
//             initialScrollIndex={currentStatusIndex}
//             getItemLayout={(data, index) => ({
//               length: width,
//               offset: width * index,
//               index,
//             })}
//             onMomentumScrollEnd={handleScrollEnd}
//             style={styles.flatList}
//           />
//         </View>
//       </Modal>
        
//       <SwitchAccountSheet
//         showConfirmSwitch={showConfirmSwitch}
//         setShowConfirmSwitch={setShowConfirmSwitch}
//         pendingSwitchTo={pendingSwitchTo}
//         switchAccount={switchAccount}
//         isLoading={isLoading}
//         setIsLoading={setIsLoading}
//       />

//       {renderCommentsModal()}

//       <Modal
//         visible={addStatusModalVisible}
//         animationType="slide"
//         onRequestClose={() => setAddStatusModalVisible(false)}
//       >
//         <KeyboardAvoidingView 
//           style={{ flex: 1, backgroundColor: colors.background }} 
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//         >
//           <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
//             <View style={styles.addStatusHeader}>
//               <TouchableOpacity onPress={() => setAddStatusModalVisible(false)}>
//                 <Icon name="close" size={28} color={colors.text} />
//               </TouchableOpacity>
//               <Text style={[styles.addStatusHeaderText, { color: colors.text }]}>Add Status</Text>
//               <View style={{ width: 28 }} />
//             </View>
            
//             {image ? (
//               <Image source={{ uri: image.uri }} style={styles.previewImage} />
//             ) : (
//               <TouchableOpacity style={styles.imagePlaceholder} onPress={handleSelectMedia}>
//                 <Icon name="image-outline" size={50} color={colors.textSecondary} />
//                 <Text style={styles.imagePlaceholderText}>Select Media</Text>
//               </TouchableOpacity>
//             )}
            
//             <View style={{ flex: 1, padding: 16 }}>
//               <View style={styles.captionInputContainer}>
//                 <TextInput
//                   style={styles.captionInput}
//                   placeholder="Add a caption..."
//                   placeholderTextColor={colors.placeholder}
//                   value={caption}
//                   onChangeText={setCaption}
//                   multiline
//                   maxLength={200}
//                 />
                
//                 {keyboardVisible && (
//                   <TouchableOpacity 
//                     style={styles.keyboardCloseButton}
//                     onPress={dismissKeyboard}
//                     activeOpacity={0.7}
//                   >
//                     <Icon name="chevron-down" size={24} color={colors.text} />
//                   </TouchableOpacity>
//                 )}
//               </View>
              
//               <TouchableOpacity
//                 onPress={handlePostStatus}
//                 disabled={!image || postingStatus}
//                 style={[styles.postButtonContainer, (!image || postingStatus) ? styles.postButtonDisabled : {}]}
//               >
//                 {postingStatus ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Text style={[styles.postButtonText, !image ? styles.postButtonTextDisabled : {}]}>
//                     Post Status
//                   </Text>
//                 )}
//               </TouchableOpacity>
//               {image && !postingStatus && (
//                 <TouchableOpacity onPress={handleSelectMedia} style={{ marginTop: 15, alignItems: 'center' }}>
//                   <Text style={{ color: colors.primary }}>Change Media</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </SafeAreaView>
//         </KeyboardAvoidingView>
//       </Modal>
      
//       {/* <BottomNav navigation={navigation} setShowAccountModal={setShowAccountModal} /> */}

//       <BottomNav 
//                   navigation={navigation} 
//                   setShowAccountModal={setShowAccountModal}
//                   activeRoute="Home" 
//                     style={{ zIndex: 9999 }}
//                 />
      
//       {/* <EarningFloatingButton navigation={navigation} /> */}
//     </View>
//   );
// };


// const createStyles = (colors, isDark, insets) => StyleSheet.create({
  //  container: {
  //   flex: 1,
  //   backgroundColor: colors.backgroundSecondary,
  // },
  // loadingContainer: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 20,
  // },
  // scrollContent: {
  //   flexGrow: 1,
  //   paddingBottom: 80,
  // },
  // header: {
  //   paddingBottom: Platform.OS === 'android' ? 0 : 0,
  //   borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
  //   borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
  //   backgroundColor: colors.primary,
  //   elevation: 3,
  //   zIndex: 1000,
  // },
  // headerTop: {
  //   paddingHorizontal: 20,
  //   paddingVertical: Platform.OS === 'android' ? 0 : 5,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // headerTitle: {
  //   marginTop: 30,
  //   color: '#fff',
  //   fontSize: 28,
  //   fontWeight: 'bold',
  //   letterSpacing: 0.5,
  // },
  // headerIcons: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // headerIconButton: {
  //   backgroundColor: 'white',
  //   borderRadius: 50,
  //   padding: 6,
  // },
  // tabRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   marginTop: 16,
  // },
  // tabText: {
  //   color: 'rgba(255, 255, 255, 0.8)',
  //   fontSize: 16,
  //   paddingVertical: 6,
  // },
  // tabTextActive: {
  //   color: '#fff',
  //   fontWeight: '600',
  // },
  // tabUnderline: {
  //   height: 3,
  //   backgroundColor: '#fff',
  //   borderRadius: 2,
  //   marginTop: 4,
  // },
  // sectionTitle: {
  //   fontSize: 20,
  //   color: colors.text,
  //   marginLeft: 16,
  //   marginBottom: 10,
  // },
  // sectionTitleChannel: {
  //   fontSize: 24,
  //   color: colors.text,
  //   marginLeft: 16,
  //   marginBottom: 10,
  // },
  // statusScrollContainer: {
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  // },
  // statusWrapper: {
  //   alignItems: 'center',
  //   marginRight: 20,
  // },
  // statusContainer: {
  //   alignItems: 'center',
  //   width: 80,
  // },
  // statusMedia: {
  //   width: 95,
  //   height: 160,
  //   borderRadius: 25,
  //   overflow: 'hidden',
  // },
  // statusMediaStyle: {
  //   borderRadius: 25,
  // },
  // statusNameContainer: {
  //   marginTop: 8,
  //   width: '100%',
  // },
  // statusNameText: {
  //   color: colors.text,
  //   fontSize: 12,
  //   textAlign: 'center',
  // },
  // liveBadge: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#FF3B30',
  //   paddingHorizontal: 6,
  //   paddingVertical: 2,
  //   borderRadius: 8,
  //   alignSelf: 'flex-start',
  //   margin: 4,
  // },
  // liveIndicator: {
  //   width: 6,
  //   height: 6,
  //   borderRadius: 3,
  //   backgroundColor: '#fff',
  //   marginRight: 4,
  // },
  // liveText: {
  //   color: '#fff',
  //   fontSize: 8,
  //   fontWeight: 'bold',
  // },
  // addStatusCircle: {
  //   width: 68,
  //   height: 68,
  //   borderRadius: 34,
  //   backgroundColor: isDark ? colors.backgroundSecondary : '#f0f0f0',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 8,
  //   borderWidth: 2,
  //   borderColor: colors.border,
  // },
  // addStatusInnerCircle: {
  //   width: 58,
  //   height: 58,
  //   borderRadius: 29,
  //   backgroundColor: colors.background,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // addStatusLabel: {
  //   fontSize: 12,
  //   color: colors.text,
  //   marginTop: 4,
  // },
  // communityItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 14,
  //   backgroundColor: colors.card,
  //   borderRadius: 12,
  //   padding: 12,
  //   elevation: 1,
  //   shadowColor: '#000',
  //   shadowOpacity: isDark ? 0.1 : 0.05,
  //   shadowRadius: 4,
  // },
  // communityAvatar: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 50,
  //   marginRight: 5,
  // },
  // communityName: {
  //   fontSize: 14,
  //   color: colors.text,
  // },
  // communityMsg: {
  //   fontSize: 12,
  //   color: colors.textSecondary,
  // },
  // followerCount: {
  //   color: colors.text,
  // },
  // followBtn: {
  //   paddingHorizontal: 12,
  //   paddingVertical: 6,
  //   borderRadius: 16,
  //   backgroundColor: colors.buttonSecondary,
  // },
  // followingBtn: {
  //   backgroundColor: colors.border,
  // },
  // disabledBtn: {
  //   opacity: 0.6,
  // },
  // imageModal: {
  //   flex: 1,
  //   backgroundColor: '#000',
  // },
  // flatList: {
  //   flex: 1,
  // },
  // fullImage: {
  //   width: width,
  //   height: height,
  //   backgroundColor: '#000',
  // },
  // statusViewerContainer: {
  //   width: width,
  //   height: height,
  //   backgroundColor: '#000',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // statusViewerOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  // },
  // statusViewerHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 16,
  //   paddingTop: Platform.OS === 'ios' ? 60 : 40,
  //   backgroundColor: 'rgba(0,0,0,0.3)',
  //   paddingBottom: 10,
  // },
  // statusViewerAvatar: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   marginRight: 12,
  //   borderWidth: 2,
  //   borderColor: '#fff',
  // },
  // userInfo: {
  //   flex: 1,
  // },
  // statusViewerUsername: {
  //   color: '#fff',
  //   fontSize: 16,
  // },
  // statusViewerTime: {
  //   color: 'rgba(255,255,255,0.8)',
  //   fontSize: 12,
  //   marginTop: 2,
  // },
  // headerButton: {
  //   padding: 8,
  //   marginLeft: 8,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // reactionCount: {
  //   color: '#fff',
  //   marginLeft: 4,
  //   fontSize: 12,
  //   fontWeight: 'bold',
  // },
  // captionContainer: {
  //   position: 'absolute',
  //   top: '20%',
  //   width: '100%',
  //   backgroundColor: 'rgba(21, 21, 21, 0.6)',
  //   padding: 10,
  //   borderRadius: 0,
  //   justifyContent: 'center',
  // },
  // statusViewerCaption: {
  //   color: '#fff',
  //   fontSize: 16,
  //   textAlign: 'center',
  // },
  // bottomInputContainer: {
  //   position: 'absolute',
  //   bottom: 10,
  //   left: 16,
  //   right: 16,
    
  // },
  // inputWrapper: {
  //   marginLeft: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(39, 38, 38, 0.9)',
  //   borderRadius: 30,
  //   paddingHorizontal: 16,
  //   paddingVertical: 5,
  //   marginBottom: 10,
  // },
  // commentInput: {
  //   flex: 1,
  //   fontSize: 16,
  //   color: '#ffffffff',
  //   maxHeight: 100,
  //   paddingVertical: 5,
  // },
  // sendButton: {
  //   padding: 8,
  //   marginLeft: 8,
  // },
  // sendButtonDisabled: {
  //   opacity: 0.5,
  // },
  // quickActionButton: {
  //   padding: 12,
  // },
  // navArrow: {
  //   position: 'absolute',
  //   top: '50%',
  //   backgroundColor: 'rgba(0,0,0,0.3)',
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   transform: [{ translateY: -25 }],
  // },
  // leftArrow: {
  //   left: 10,
  // },
  // rightArrow: {
  //   right: 10,
  // },
  // viewersButton: {
  //   position: 'absolute',
  //   bottom: 90,
  //   alignSelf: 'center',
  //   backgroundColor: 'rgba(255,255,255,0.2)',
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  //   borderRadius: 20,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // eyeIcon: {
  //   marginRight: 6,
  // },
  // viewersButtonText: {
  //   color: '#fff',
  //   fontSize: 14,
  // },
  // commentsModalContainer: {
  //   flex: 1,
  //   backgroundColor: colors.background,
  // },
  // commentsModalHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.border,
  // },
  // commentsModalTitle: {
  //   fontSize: 18,
  //   color: colors.text,
  // },
  // commentsList: {
  //   padding: 16,
  // },
  // commentItem: {
  //   flexDirection: 'row',
  //   marginBottom: 16,
  // },
  // commentAvatar: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   marginRight: 12,
  // },
  // commentContent: {
  //   flex: 1,
  //   backgroundColor: colors.surface,
  //   padding: 12,
  //   borderRadius: 12,
  // },
  // commentUserName: {
  //   fontSize: 14,
  //   fontWeight: 'bold',
  //   color: colors.text,
  //   marginBottom: 4,
  // },
  // commentText: {
  //   fontSize: 14,
  //   color: colors.textSecondary,
  // },
  // commentTime: {
  //   fontSize: 12,
  //   color: colors.textTertiary,
  //   marginTop: 4,
  // },
  // backgroundRefreshIndicator: {
  //   position: 'absolute',
  //   top: 10,
  //   right: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(255, 255, 255, 0.8)',
  //   padding: 5,
  //   borderRadius: 10,
  //   zIndex: 1000,
  // },
  // backgroundRefreshText: {
  //   marginLeft: 5,
  //   fontSize: 12,
  //   color: colors.primary,
  // },
  // viewerItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.border,
  // },
  // viewerAvatar: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   marginRight: 12,
  // },
  // viewerInfo: {
  //   flex: 1,
  // },
  // viewerName: {
  //   fontSize: 16,
  //   fontWeight: '500',
  //   color: colors.text,
  // },
  // viewerTime: {
  //   fontSize: 12,
  //   color: colors.textSecondary,
  //   marginTop: 4,
  // },
  // addStatusHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   padding: 16,
  // },
  // addStatusHeaderText: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: colors.text,
  // },
  // previewImage: {
  //   width: '100%',
  //   height: '50%',
  //   resizeMode: 'cover',
  //   marginBottom: 10,
  // },
  // imagePlaceholder: {
  //   height: '50%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: colors.backgroundSecondary,
  //   borderBottomWidth: 1,
  //   borderColor: colors.border,
  // },
  // imagePlaceholderText: {
  //   color: colors.textSecondary,
  //   marginTop: 10,
  // },
  // captionInputContainer: {
  //   position: 'relative',
  //   marginBottom: 20,
  // },
  // captionInput: {
  //   borderWidth: 1,
  //   borderColor: colors.border,
  //   borderRadius: 10,
  //   padding: 15,
  //   paddingRight: 50,
  //   fontSize: 16,
  //   textAlignVertical: 'top',
  //   minHeight: 100,
  //   color: colors.text,
  //   backgroundColor: colors.backgroundSecondary,
  // },
  // keyboardCloseButton: {
  //   position: 'absolute',
  //   right: 10,
  //   top: 10,
  //   width: 36,
  //   height: 36,
  //   borderRadius: 18,
  //   backgroundColor: colors.buttonSecondary || 'rgba(0,0,0,0.1)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // postButtonContainer: {
  //   marginTop: 20,
  //   backgroundColor: colors.primary,
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  // },
  // postButtonDisabled: {
  //   opacity: 0.6,
  // },
  // postButtonText: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  // postButtonTextDisabled: {
  //   color: 'rgba(255,255,255,0.6)',
  // },
  // avatarContainer: {
  //   position: 'relative',
  //   marginRight: 12,
  // },
  // yourChannelBadge: {
  //   position: 'absolute',
  //   top: -5,
  //   right: -5,
  //   backgroundColor: colors.primary,
  //   borderRadius: 10,
  //   paddingHorizontal: 6,
  //   paddingVertical: 2,
  //   zIndex: 1,
  // },
  // yourChannelText: {
  //   color: '#fff',
  //   fontSize: 10,
  //   fontWeight: 'bold',
  // },
  // exploreButton: {
  //   fontSize: 15,
  //   color: colors.text,
  //   backgroundColor: colors.buttonSecondary,
  //   borderRadius: 20,
  //   width: 100,
  //   height: 29,
  //   textAlign: 'center',
  //   lineHeight: 25,
  // },
  // deleteModalOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // deleteModalContent: {
  //   backgroundColor: colors.background,
  //   borderRadius: 14,
  //   padding: 24,
  //   width: '85%',
  //   maxWidth: 340,
  // },
  // deleteModalTitle: {
  //   fontSize: 20,
  //   fontWeight: '600',
  //   marginBottom: 8,
  //   color: colors.text,
  //   textAlign: 'center',
  // },
  // deleteModalText: {
  //   fontSize: 16,
  //   color: colors.textSecondary,
  //   marginBottom: 24,
  //   textAlign: 'center',
  // },
  // deleteModalButtons: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   marginTop: 8,
  // },
  // deleteModalButton: {
  //   paddingHorizontal: 24,
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   minWidth: 120,
  //   alignItems: 'center',
  // },
  // cancelButton: {
  //   backgroundColor: colors.buttonSecondary || '#E8E8E8',
  //   marginRight: 8,
  // },
  // confirmButton: {
  //   backgroundColor: '#FF3B30',
  //   marginLeft: 8,
  // },
  // cancelButtonText: {
  //   color: colors.text || '#000000',
  //   fontSize: 16,
  //   fontWeight: '500',
  // },
  // confirmButtonText: {
  //   color: '#FFFFFF',
  //   fontSize: 16,
  //   fontWeight: '600',
  // },
  // reactionsModalOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  //   justifyContent: 'flex-end',
  // },
  // reactionsModalContent: {
  //   backgroundColor: colors.background,
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   maxHeight: '80%',
  // },
  // reactionsModalHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.border,
  // },
  // reactionsModalTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: colors.text,
  // },
  // reactionItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.border,
  // },
  // reactionAvatar: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   marginRight: 12,
  // },
  // reactionInfo: {
  //   flex: 1,
  // },
  // reactionUserName: {
  //   fontSize: 16,
  //   fontWeight: '500',
  //   color: colors.text,
  // },
  // reactionType: {
  //   fontSize: 14,
  //   color: colors.textSecondary,
  //   marginTop: 2,
  // },
  // reactionTime: {
  //   fontSize: 12,
  //   color: colors.textTertiary,
  // },
  // tapArea: {
  //   position: 'absolute',
  //   top: 0,
  //   bottom: 0,
  //   width: width * 0.3,
  //   zIndex: 100,
  // },
  // leftTapArea: {
  //   left: 0,
  // },
  // rightTapArea: {
  //   right: 0,
  // },
  // modalContainer: {
  //   flex: 1,
  //   backgroundColor: colors.background,
  // },
  // modalHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.border,
  // },
  // modalTitle: {
  //   fontSize: 18,
  //   color: colors.text,
  // },
  // viewersList: {
  //   padding: 16,
  // },
  // subSectionTitle: {
  //   fontSize: 16,
  //   color: colors.textSecondary,
  //   marginLeft: 16,
  //   marginTop: 10,
  //   marginBottom: 5,
  // },
// });

// export default StatusScreen;

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
  Alert,
  Keyboard,
  StatusBar,
  Platform,
  Animated,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import _ from 'lodash';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import BottomNav from '../components/BottomNavSocialMedia';
import SwitchAccountSheet from '../components/SwitchAccountSheet';
import { useTheme } from '../src/context/ThemeContext';
import { Snackbar } from 'react-native-paper';
import StatusSection from '../components/StatusSection';
import AccountSwitchBottomSheet from '../components/AccountSwitchBottomSheet';

const { width, height } = Dimensions.get('window');

// Initialize MMKV storage
const storage = createMMKV({
  id: 'status-storage',
});

// Cache keys
const STATUS_STORAGE_KEY = '@status_data';
const CHANNELS_STORAGE_KEY = '@channels_data';
const FOLLOWING_CHANNELS_KEY = '@following_channels';
const CACHE_TIMESTAMP_KEY = '@cache_timestamp';
const LIVE_STREAMS_KEY = '@live_streams';
const CACHE_EXPIRY_HOURS = 24;

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
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentComments, setCurrentComments] = useState([]);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [liveStreams, setLiveStreams] = useState([]);
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [pendingSwitchTo, setPendingSwitchTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const flatListRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  const styles = createStyles(colors, isDark, insets);
  
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
      console.log('✅ All status images preloaded successfully');
    } catch (error) {
      console.error('❌ Error preloading images:', error);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // ==================== MMKV CACHE FUNCTIONS ====================

  const saveDataToStorage = async (key, data) => {
    try {
      console.log(`💾 Saving ${key} to MMKV cache...`);
      storage.set(key, JSON.stringify(data));
      if (key === STATUS_STORAGE_KEY || key === CHANNELS_STORAGE_KEY || key === FOLLOWING_CHANNELS_KEY) {
        storage.set(CACHE_TIMESTAMP_KEY, new Date().toISOString());
      }
      console.log(`✅ ${key} saved to MMKV cache`);
    } catch (error) {
      console.error(`❌ Error saving ${key} to storage:`, error);
    }
  };

  const getDataFromStorage = async (key) => {
    try {
      const jsonValue = storage.getString(key);
      if (jsonValue) {
        console.log(`✅ ${key} loaded from MMKV cache`);
        return JSON.parse(jsonValue);
      }
      console.log(`📭 No data found for ${key} in MMKV cache`);
      return null;
    } catch (error) {
      console.error(`❌ Error getting ${key} from storage:`, error);
      return null;
    }
  };

  const checkCacheExpiry = async () => {
    try {
      const timestamp = storage.getString(CACHE_TIMESTAMP_KEY);
      if (!timestamp) return true;
      const cacheDate = new Date(timestamp);
      const now = new Date();
      const hoursDiff = (now - cacheDate) / (1000 * 60 * 60);
      return hoursDiff > CACHE_EXPIRY_HOURS;
    } catch (error) {
      console.error('❌ Error checking cache expiry:', error);
      return true;
    }
  };

  const clearCache = async () => {
    try {
      console.log('🗑️ Clearing MMKV cache...');
      const keys = [
        STATUS_STORAGE_KEY,
        CHANNELS_STORAGE_KEY,
        FOLLOWING_CHANNELS_KEY,
        CACHE_TIMESTAMP_KEY,
        LIVE_STREAMS_KEY
      ];
      
      for (const key of keys) {
        try {
          if (typeof storage.delete === 'function') {
            storage.delete(key);
          } else if (typeof storage.remove === 'function') {
            storage.remove(key);
          } else {
            storage.set(key, null);
          }
          console.log(`✅ Deleted ${key} from MMKV cache`);
        } catch (err) {
          console.error(`❌ Failed to delete ${key}:`, err);
        }
      }
      console.log('✅ MMKV cache cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  };

  const loadCachedData = async () => {
    try {
      const isCacheExpired = await checkCacheExpiry();
      if (isCacheExpired) {
        console.log('⏰ Cache expired, clearing...');
        await clearCache();
        return false;
      }

      console.log('📂 Loading cached data from MMKV...');
      const [cachedStatuses, cachedChannels, cachedFollowingIds] = await Promise.all([
        getDataFromStorage(STATUS_STORAGE_KEY),
        getDataFromStorage(CHANNELS_STORAGE_KEY),
        getDataFromStorage(FOLLOWING_CHANNELS_KEY),
      ]);

      if (cachedStatuses) {
        console.log(`✅ Loaded ${cachedStatuses.length} statuses from MMKV cache`);
        setGroupedStatuses(cachedStatuses);
        preloadAllStatusImages(cachedStatuses);
        setHasLoadedOnce(true);
      }
      if (cachedChannels) {
        console.log(`✅ Loaded ${cachedChannels.length} channels from MMKV cache`);
        setChannels(cachedChannels);
      }
      if (cachedFollowingIds && cachedChannels) {
        const fullFollowedChannels = cachedChannels.filter((ch) => cachedFollowingIds.includes(ch.id));
        setFollowingChannels(fullFollowedChannels);
      }
      return cachedStatuses || cachedChannels || cachedFollowingIds;
    } catch (error) {
      console.error('❌ Error loading cached data:', error);
      return false;
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
      console.error('❌ Error fetching current user:', error);
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
        console.log('Media picker cancelled or failed:', response.errorCode || 'Cancelled');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  // const handlePostStatus = async () => {
  //   if (!image) {
  //     Alert.alert('Error', 'Please select media.');
  //     return;
  //   }

  //   setPostingStatus(true);
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     if (!token) {
  //       Alert.alert('Error', 'User not authenticated. Please log in.');
  //       return;
  //     }
  //     const formData = new FormData();
  //     formData.append('media', {
  //       uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
  //       type: image.type || 'image/jpeg',
  //       name: image.fileName || 'status.jpg',
  //     });
  //     formData.append('text', caption);
  //     formData.append('status_type', 'image');
      
  //     console.log('Posting status...');
  //     const res = await axios.post(`${API_ROUTE}/status/`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       timeout: 30000,
  //     });
      
  //     console.log('Status uploaded successfully');
  //     Alert.alert('Success', 'Status uploaded successfully!');
  //     setImage(null);
  //     setCaption('');
  //     setAddStatusModalVisible(false);
  //     await fetchAllData();
  //   } catch (error) {
  //     console.error('Upload error:', error.response?.data || error.message);
  //     Alert.alert('Upload Failed', 'Please try again.');
  //   } finally {
  //     setPostingStatus(false);
  //   }
  // };

  const handlePostStatus = async () => {
  // Check if media is selected
  if (!image) {
    Alert.alert('Error', 'Please select media.');
    return;
  }

  // ===== FILE SIZE VALIDATION (5MB MAX) =====
  // Get file size from image object
  let fileSize = image.fileSize || 0;
  
  // If fileSize is not available, try to get it from the uri
  if (!fileSize && image.uri) {
    try {
      // For React Native, we can get file size from the file system
      if (Platform.OS === 'android') {
        const RNFS = require('react-native-fs');
        const stats = await RNFS.stat(image.uri);
        fileSize = stats.size;
      } else if (Platform.OS === 'ios') {
        const RNFS = require('react-native-fs');
        const stats = await RNFS.stat(image.uri.replace('file://', ''));
        fileSize = stats.size;
      }
    } catch (error) {
      console.log('Could not get file size:', error);
    }
  }

  // Check if file size is available and exceeds 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  
  if (fileSize > 0 && fileSize > MAX_FILE_SIZE) {
    const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    Alert.alert(
      'File Too Large',
      `File size is ${sizeMB}MB. Maximum allowed size is 5MB.\n\nPlease compress your image/video or choose a smaller file.`,
      [
        { text: 'OK', onPress: () => console.log('User acknowledged file size limit') }
      ]
    );
    return;
  }

  // If file size is unknown, show a warning but proceed
  if (fileSize === 0) {
    console.log('⚠️ File size unknown, proceeding with upload...');
  }

  setPostingStatus(true);
  
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'User not authenticated. Please log in.');
      setPostingStatus(false);
      return;
    }

    const formData = new FormData();
    
    // Handle media file
    const mediaUri = Platform.OS === 'ios' 
      ? image.uri.replace('file://', '') 
      : image.uri;
    
    const mediaName = image.fileName || `status_${Date.now()}.jpg`;
    const mediaType = image.type || 'image/jpeg';

    formData.append('media', {
      uri: mediaUri,
      type: mediaType,
      name: mediaName,
    });
    
    if (caption && caption.trim()) {
      formData.append('text', caption.trim());
    }
    
    formData.append('status_type', image.type?.startsWith('video') ? 'video' : 'image');

    // console.log('📤 Posting status...');
    // console.log('📁 File:', {
    //   name: mediaName,
    //   type: mediaType,
    //   size: fileSize > 0 ? `${(fileSize / (1024 * 1024)).toFixed(2)}MB` : 'Unknown'
    // });

    const res = await axios.post(`${API_ROUTE}/status/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    });
    
    //console.log('✅ Status uploaded successfully');
    
    Alert.alert(
      'Success', 
      'Status uploaded successfully!',
      [{ text: 'OK', onPress: () => console.log('Status posted') }]
    );
    
    // Reset form
    setImage(null);
    setCaption('');
    setAddStatusModalVisible(false);
    
    // Refresh data
    await fetchAllData();
    
  } catch (error) {
    console.error('❌ Upload error:', error.response?.data || error.message);
    
    // ===== HANDLE SERVER ERROR RESPONSES =====
    const errorData = error.response?.data;
    
    // Check for file size error from server
    if (errorData?.error && errorData.error.includes('exceeds 5MB')) {
      Alert.alert(
        'File Too Large',
        `${errorData.error}\n\nMaximum allowed size is ${errorData.max_size_mb || 5}MB. Please compress your file and try again.`,
        [
          { 
            text: 'OK', 
            onPress: () => console.log('User acknowledged file size error')
          }
        ]
      );
      return;
    }
    
    // Check for unsupported file type error
    if (errorData?.error && errorData.error.includes('Unsupported')) {
      Alert.alert(
        'Unsupported File Type',
        errorData.error || 'Please use JPEG, PNG, GIF, WebP for images or MP4, MOV for videos.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Generic error
    Alert.alert(
      'Upload Failed', 
      errorData?.error || 'Failed to upload status. Please try again.',
      [{ text: 'OK' }]
    );
    
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
      console.log(`🗑️ Deleting status ${statusId}...`);
      await axios.delete(
        `${API_ROUTE}/status/${statusId}/delete/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGroupedStatuses(prev => {
        const updated = prev.map(group => ({
          ...group,
          statuses: group.statuses.filter(status => status.id !== statusId)
        })).filter(group => group.statuses.length > 0);
        return updated;
      });
      
      setDeleteModalVisible(false);
      setStatusToDelete(null);
      
      Alert.alert('Success', 'Status deleted successfully');
      await fetchAllData();
    } catch (error) {
      console.error('❌ Error deleting status:', error);
      Alert.alert('Error', 'Failed to delete status');
    }
  };

  const addReaction = async (statusId, reactionType) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
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
      
      setReactionModalVisible(false);
    } catch (error) {
      console.error('❌ Error adding reaction:', error);
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

  const handleAddComment = async (statusId) => {
    if (!commentText.trim()) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/status/${statusId}/comment/`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGroupedStatuses(prev => 
        prev.map(group => ({
          ...group,
          statuses: group.statuses.map(status => 
            status.id === statusId 
              ? {
                  ...status,
                  comments: [
                    ...(status.comments || []),
                    {
                      id: Date.now(),
                      user: { id: currentUserId, name: 'You', phone: currentUserPhone },
                      text: commentText,
                      created_at: new Date().toISOString()
                    }
                  ]
                }
              : status
          )
        }))
      );
      
      setCommentText('');
      setShowCommentInput(false);
      Alert.alert('Success', 'Comment added successfully');
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
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
      console.error('❌ Error fetching comments:', error);
    }
  };

  const openImageModal = (userStatuses) => {
    setSelectedUserStatuses(userStatuses.statuses);
    setCurrentStatusIndex(0);
    setModalVisible(true);
    setShowCommentInput(false);
    setCommentText('');
    
    userStatuses.statuses.forEach(status => {
      const isMyStatus = status.user?.phone === currentUserPhone || status.user === currentUserPhone;
      if (!isMyStatus) {
        trackStatusView(status.id);
      }
    });
  };

  const fetchLiveStreams = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('🌐 Fetching live streams...');
      const response = await axios.get(`${API_ROUTE}/live-streams/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const liveStreamsWithTime = response.data.map(stream => ({
        ...stream,
        started_at: stream.created_at || new Date().toISOString(),
        isLive: true
      }));
      
      setLiveStreams(liveStreamsWithTime);
      saveDataToStorage(LIVE_STREAMS_KEY, liveStreamsWithTime);
      console.log(`✅ Loaded ${liveStreamsWithTime.length} live streams`);
    } catch (error) {
      console.error('❌ Error fetching live streams:', error.message);
      const cached = await getDataFromStorage(LIVE_STREAMS_KEY);
      if (cached) {
        console.log(`📂 Loaded ${cached.length} live streams from cache`);
        setLiveStreams(cached);
      }
    }
  };

  const fetchChannels = async (followedChannelIds = []) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      console.log('🌐 Fetching channels...');
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
      await saveDataToStorage(CHANNELS_STORAGE_KEY, sortedChannels);
      console.log(`✅ Loaded ${sortedChannels.length} channels`);
      return sortedChannels;
    } catch (err) {
      console.error('❌ Error fetching channels:', err);
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
      await saveDataToStorage(CHANNELS_STORAGE_KEY, channels);
      await saveDataToStorage(FOLLOWING_CHANNELS_KEY, followingChannels.map((ch) => ch.id));
    } catch (err) {
      console.error('❌ Follow error:', err);
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
      console.log('🌐 Fetching statuses...');
      const res = await axios.get(`${API_ROUTE}/status/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      if (res.status === 200 || res.status === 201) {
        const grouped = groupStatusesByUser(res.data);
        await saveDataToStorage(STATUS_STORAGE_KEY, grouped);
        console.log(`✅ Loaded ${grouped.length} status groups`);
        return grouped;
      } else {
        Alert.alert('Error', 'Failed to fetch statuses.');
        return [];
      }
    } catch (error) {
      console.error('❌ Fetch status error:', error);
      return [];
    }
  };

  const fetchFollowingChannels = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      console.log('🌐 Fetching following channels...');
      const res = await axios.get(`${API_ROUTE}/channels/following/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 || res.status === 201) {
        const followedIds = res.data.map((channel) => channel.id);
        await saveDataToStorage(FOLLOWING_CHANNELS_KEY, followedIds);
        console.log(`✅ Loaded ${followedIds.length} following channels`);
        return followedIds;
      }
      return [];
    } catch (err) {
      console.error('❌ Error fetching following channels:', err);
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
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setBackgroundRefreshing(false);
    }
  };

  const fetchAllDataSilently = _.debounce(async () => {
    try {
      console.log('🔄 Silent refresh...');
      const user = await fetchCurrentUser();
      if (!user) return;
      const isCacheExpired = await checkCacheExpiry();
      if (isCacheExpired) {
        console.log('⏰ Cache expired during silent refresh, clearing...');
        await clearCache();
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
      console.log('✅ Silent refresh complete');
    } catch (error) {
      console.error('❌ Silent refresh error:', error);
    }
  }, 1000);

  const onRefresh = () => {
    setRefreshing(true);
    clearCache();
    fetchAllData(true);
  };

  useEffect(() => {
    if (isFocused) {
      (async () => {
        console.log('📱 Screen focused, loading data...');
        const hasCache = await loadCachedData();
        if (!hasCache) {
          console.log('📭 No cache, fetching fresh data...');
          await fetchAllData(false);
        } else {
          console.log('📂 Cache loaded, silent refresh in background...');
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

  // ==================== CHANNEL ITEM WITH FOLLOW CHECK ====================

  const ChannelItem = ({ channel, currentUserId, navigation, followLock, handleFollow }) => {
    const isCreator = currentUserId && channel.creator === currentUserId;
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleChannelPress = () => {
      if (isCreator) {
        navigation.navigate('ChannelAdminManagement', {
          receiverId: channel.id,
          name: channel.name,
          chatType: 'channel',
          channelSlug: channel.slug,
          profile_image: channel.image,
          InviteLink: channel.invite_link,
          followers: channel.followers_count,
        });
      } else if (channel.isFollowing) {
        navigation.navigate('ChannelDetails', {
          receiverId: channel.id,
          name: channel.name,
          chatType: 'channel',
          profile_image: channel.image,
          channelSlug: channel.slug,
          InviteLink: channel.invite_link,
          followers: channel.followers_count,
        });
      } else {
        // Show snackbar if not following
        setSnackbarMessage(`Please follow "${channel.name}" to view content`);
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
      }
    };

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleChannelPress}
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

        {/* Snackbar for channel follow requirement */}
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={3000}
          style={{
            backgroundColor: '#FF3B30',
            margin: 16,
            borderRadius: 8,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="alert-circle" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 14, flex: 1 }}>{snackbarMessage}</Text>
          </View>
        </Snackbar>
      </>
    );
  };

  const renderViewerItem = ({ item }) => (
    <View style={styles.viewerItem}>
      <Image
        source={{
          uri: item.profile_picture
            ? `${API_ROUTE_IMAGE}${item.profile_picture}`
            : 'https://via.placeholder.com/40',
        }}
        style={styles.viewerAvatar}
      />
      <View style={styles.viewerInfo}>
        <Text style={styles.viewerName}>{item.name || item.phone}</Text>
        {item.viewed_at && (
          <Text style={styles.viewerTime}>Seen {formatTime(item.viewed_at)}</Text>
        )}
      </View>
    </View>
  );

  const renderStatusPreview = (userStatus) => {
    return (
      <TouchableOpacity style={styles.statusWrapper} onPress={() => openImageModal(userStatus)}>
        <View style={styles.statusContainer}>
          <ImageBackground
            source={{ uri: getImageUrl(userStatus.statuses[0].media) }}
            style={styles.statusMedia}
            imageStyle={styles.statusMediaStyle}
          />
          <View style={styles.statusNameContainer}>
            <Text style={styles.statusNameText} numberOfLines={1}>
              {userStatus.user?.phone === currentUserPhone || userStatus.user === currentUserPhone
                ? 'My Story'
                : userStatus.user?.name || userStatus.user}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLiveStreamPreview = (stream) => (
    <TouchableOpacity 
      style={styles.statusWrapper}
      onPress={() => 
      navigation.navigate('Viewer', {
        roomName: 'match-123',
        streamId: 'stream-1',
        viewerId: 'viewer-1',
      })}
    >
      <View style={styles.statusContainer}>
        <ImageBackground
          source={
            stream.broadcaster_image
              ? { uri: stream.broadcaster_image.startsWith('http://') ? stream.broadcaster_image.replace('http://', 'https://') : stream.broadcaster_image }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.statusMedia}
          imageStyle={styles.statusMediaStyle}
        >
          <View style={styles.liveBadge}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </ImageBackground>
        <View style={styles.statusNameContainer}>
          <Text style={styles.statusNameText} numberOfLines={1}>
            {stream.broadcaster_name || 'User'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ==================== FIXED: renderStatusItem with proper key and delete handling ====================

  const renderStatusItem = ({ item, index }) => {
    const isMyStatus = item.user?.phone === currentUserPhone || item.user === currentUserPhone;
    
    const handleDeletePress = () => {
      // Don't close the modal, just show the alert
      Alert.alert(
        'Delete Status',
        'Are you sure you want to delete this status? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            onPress: () => {
              deleteStatus(item.id);
              // The modal will close after deletion in deleteStatus function
            }, 
            style: 'destructive' 
          },
        ]
      );
    };
    
    return (
      <View style={styles.statusViewerContainer} key={`status-${item.id}-${index}`}>
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
            
            {isMyStatus && (
              <TouchableOpacity 
                style={[styles.headerButton,]}
                //onPress={handleDeletePress}
              >
                <Icon name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            
            {/* <View style={styles.headerButton}>
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
            </View> */}
          </View>

          <View style={styles.bottomInputContainer}>
            {item.text && (
              <View style={styles.captionContainer}>
                <Text style={styles.statusViewerCaption}>{item.text}</Text>
              </View>
            )}

            {!isMyStatus && (
              <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 8, marginTop: -100, flexDirection: 'row', paddingHorizontal: 10 }}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Reply to status..."
                    placeholderTextColor="#999"
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                  />
                  <TouchableOpacity 
                    style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                    onPress={() => handleAddComment(item.id)}
                    disabled={!commentText.trim()}
                  >
                    <Icon name="send" size={20} color={commentText.trim() ? "#0084ff" : "#666"} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => addReaction(item.id, 'like')}
                >
                  <Icon name="heart-outline" size={30} color="#fff" />
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

          {isMyStatus && item.viewers_count > 0 && (
            <TouchableOpacity
              style={styles.viewersButton}
              onPress={() => {
                if (item.viewers && item.viewers.length > 0) {
                  setCurrentViewers(item.viewers);
                  setViewersModalVisible(true);
                }
              }}
            >
              <Icon name="eye" size={16} color="#fff" style={styles.eyeIcon} />
              <Text style={styles.viewersButtonText}>
                {item.viewers_count} view{item.viewers_count !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.commentsList}
        />
      </SafeAreaView>
    </Modal>
  );

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
                  if (item === 'Chats') navigation.navigate('PHome');
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
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
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
          />
        </SafeAreaView>
      </Modal>

      {/* Status Modal - Fixed key extraction */}
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
            keyExtractor={(item, index) => {
              // Ensure unique keys
              if (item.id) {
                return `status-${item.id}-${index}`;
              }
              return `status-${index}-${Date.now()}`;
            }}
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
        
      {/* <SwitchAccountSheet
        showConfirmSwitch={showConfirmSwitch}
        setShowConfirmSwitch={setShowConfirmSwitch}
        pendingSwitchTo={pendingSwitchTo}
        switchAccount={switchAccount}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      /> */}

      {renderCommentsModal()}

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
              <View style={styles.captionInputContainer}>
                <TextInput
                  style={styles.captionInput}
                  placeholder="Add a caption..."
                  placeholderTextColor={colors.placeholder}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  maxLength={200}
                />
                
                {keyboardVisible && (
                  <TouchableOpacity 
                    style={styles.keyboardCloseButton}
                    onPress={dismissKeyboard}
                    activeOpacity={0.7}
                  >
                    <Icon name="chevron-down" size={24} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>
              
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
       <AccountSwitchBottomSheet
                visible={showAccountModal}
                onClose={() => setShowAccountModal(false)}
                navigation={navigation}
                colors={colors}
                isDark={isDark}
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
    paddingBottom: Platform.OS === 'android' ? 0 : 0,
    borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
    backgroundColor: colors.primary,
    elevation: 3,
    zIndex: 1000,
  },
  headerTop: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 0 : 5,
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
    paddingVertical: 6,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.text,
    marginLeft: 16,
    marginBottom: 10,
  },
  sectionTitleChannel: {
    fontSize: 24,
    color: colors.text,
    marginLeft: 16,
    marginBottom: 10,
  },
  statusScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusWrapper: {
    alignItems: 'center',
    marginRight: 20,
  },
  statusContainer: {
    alignItems: 'center',
    width: 80,
  },
  statusMedia: {
    width: 95,
    height: 160,
    borderRadius: 25,
    overflow: 'hidden',
  },
  statusMediaStyle: {
    borderRadius: 25,
  },
  statusNameContainer: {
    marginTop: 8,
    width: '100%',
  },
  statusNameText: {
    color: colors.text,
    fontSize: 12,
    textAlign: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    margin: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  addStatusCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: isDark ? colors.backgroundSecondary : '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  addStatusInnerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStatusLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
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
    fontSize: 14,
    color: colors.text,
  },
  communityMsg: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  followerCount: {
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
  userInfo: {
    flex: 1,
  },
  statusViewerUsername: {
    color: '#fff',
    fontSize: 16,
  },
  statusViewerTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionCount: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  captionContainer: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    backgroundColor: 'rgba(21, 21, 21, 0.6)',
    padding: 10,
    borderRadius: 0,
    justifyContent: 'center',
  },
  statusViewerCaption: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomInputContainer: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    
  },
  inputWrapper: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 38, 38, 0.9)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffffff',
    maxHeight: 100,
    paddingVertical: 5,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  quickActionButton: {
    padding: 12,
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
  viewersButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginRight: 6,
  },
  viewersButtonText: {
    color: '#fff',
    fontSize: 14,
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
  captionInputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    paddingRight: 50,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    color: colors.text,
    backgroundColor: colors.backgroundSecondary,
  },
  keyboardCloseButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.buttonSecondary || 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
    opacity: 0.6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postButtonTextDisabled: {
    color: 'rgba(255,255,255,0.6)',
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
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 24,
    width: '85%',
    maxWidth: 340,
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
  },
  cancelButton: {
    backgroundColor: colors.buttonSecondary || '#E8E8E8',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    color: colors.text,
  },
  viewersList: {
    padding: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default StatusScreen;