


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
//   Animated,
//   Alert,
//   Platform,
//   ImageBackground,
//   ActivityIndicator,
//   RefreshControl,
//   KeyboardAvoidingView,
//   Easing,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation, useIsFocused } from '@react-navigation/native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import _ from 'lodash';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { useTheme } from '../src/context/ThemeContext';
// import { createMMKV } from 'react-native-mmkv';

// const { width, height } = Dimensions.get('window');

// // Initialize MMKV
// const mmkv = new createMMKV({
//   id: 'status-storage',
//   encryptionKey: 'status-encryption-key-2024',
// });

// const STATUS_STORAGE_KEY = '@status_data';
// const CACHE_TIMESTAMP_KEY = '@cache_timestamp';
// const CACHE_EXPIRY_HOURS = 24;
// const LIVE_STREAMS_KEY = '@live_streams';
// const VIEWED_STATUSES_KEY = '@viewed_statuses'; // New key to store viewed statuses

// // ==================== ID NORMALIZATION HELPER ====================
// const normalizeId = (value) => {
//   if (value === null || value === undefined) return null;
//   if (typeof value === 'object') {
//     const inner = value.id ?? value.user_id ?? value._id ?? value.phone ?? value;
//     if (inner === value) return null;
//     return normalizeId(inner);
//   }
//   return String(value);
// };

// const StatusSection = ({ 
//   onStatusPress, 
//   onLivePress,
//   showAddButton = true,
//   onAddStatusPress,
//   containerStyle,
//   horizontal = true,
//   showTitle = true,
//   title = 'Stories',
//   maxItems = null,
//   customStyles = {},
// }) => {
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const { colors, isDark } = useTheme();
//   const insets = useSafeAreaInsets();

//   // States
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
//   const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
//   const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
//   const [image, setImage] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [groupedStatuses, setGroupedStatuses] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUserPhone, setCurrentUserPhone] = useState(null);
//   const [viewersModalVisible, setViewersModalVisible] = useState(false);
//   const [currentViewers, setCurrentViewers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [backgroundRefreshing, setBackgroundRefreshing] = useState(false);
//   const [postingStatus, setPostingStatus] = useState(false);
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [statusToDelete, setStatusToDelete] = useState(null);
//   const [reactionModalVisible, setReactionModalVisible] = useState(false);
//   const [currentReactions, setCurrentReactions] = useState([]);
//   const [currentComments, setCurrentComments] = useState([]);
//   const [commentsModalVisible, setCommentsModalVisible] = useState(false);
//   const [liveStreams, setLiveStreams] = useState([]);
//   const [sendingReply, setSendingReply] = useState(false);
//   const [currentReplyStatus, setCurrentReplyStatus] = useState(null);
//   const [replyMessage, setReplyMessage] = useState('');
//   const [showReplyModal, setShowReplyModal] = useState(false);
//   const [loadingViewers, setLoadingViewers] = useState(false);
  
//   // Store viewed statuses locally to persist across refreshes
//   const [viewedStatusIds, setViewedStatusIds] = useState(new Set());

//   // Animation for live pulse
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Snackbar state
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarType, setSnackbarType] = useState('success');
//   const snackbarAnim = useRef(new Animated.Value(0)).current;

//   const flatListRef = useRef(null);
//   const insets_safe = useSafeAreaInsets();

//   const styles = createStyles(colors, isDark, insets_safe, customStyles);

//   // ==================== VIEWED STATUSES PERSISTENCE ====================
//   const saveViewedStatuses = (statusIds) => {
//     try {
//       const data = Array.from(statusIds);
//       mmkv.set(VIEWED_STATUSES_KEY, JSON.stringify(data));
//     } catch (error) {
//       console.error('Error saving viewed statuses:', error);
//     }
//   };

//   const loadViewedStatuses = () => {
//     try {
//       const data = mmkv.getString(VIEWED_STATUSES_KEY);
//       if (data) {
//         const parsed = JSON.parse(data);
//         return new Set(parsed);
//       }
//     } catch (error) {
//       console.error('Error loading viewed statuses:', error);
//     }
//     return new Set();
//   };

//   // Determines whether a given status/story "user" reference belongs to the logged-in user
//   const isMyStatusGroup = (user) => {
//     return (
//       normalizeId(user?.phone) === normalizeId(currentUserPhone) ||
//       normalizeId(user) === normalizeId(currentUserPhone) ||
//       normalizeId(user?.id) === normalizeId(currentUserId) ||
//       normalizeId(user) === normalizeId(currentUserId)
//     );
//   };

//   // ==================== UPDATED: Mark as viewed without auto-tracking ====================
//   const markGroupAsViewed = (statusUser) => {
//     const statusUserId = normalizeId(statusUser);
//     if (!statusUserId || !currentUserId) return;

//     // Store the viewed status in the Set
//     setViewedStatusIds(prev => {
//       const newSet = new Set(prev);
//       newSet.add(statusUserId);
//       saveViewedStatuses(newSet);
//       return newSet;
//     });

//     // Also update the grouped statuses for immediate UI update
//     setGroupedStatuses(prev =>
//       prev.map(group => {
//         const groupUserId = normalizeId(group.user);
//         if (groupUserId !== statusUserId) return group;

//         const viewers = Array.isArray(group.viewers) ? group.viewers : [];
//         const alreadyViewed = viewers.some(v => normalizeId(v) === normalizeId(currentUserId));
//         if (alreadyViewed) return group;

//         return { ...group, viewers: [...viewers, currentUserId] };
//       })
//     );
//   };

//   // ==================== UPDATED: Check if group is viewed ====================
//   const isGroupViewed = (group) => {
//     // First check the viewed statuses Set (persistent)
//     const groupUserId = normalizeId(group.user);
//     if (viewedStatusIds.has(groupUserId)) {
//       return true;
//     }

//     // Fallback to checking viewers array
//     if (!Array.isArray(group.viewers) || currentUserId == null) return false;
//     const target = normalizeId(currentUserId);
//     return group.viewers.some(v => normalizeId(v) === target);
//   };

//   // Pulse animation for live badge
//   useEffect(() => {
//     const pulse = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.3,
//           duration: 800,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease),
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease),
//         }),
//       ])
//     );
//     pulse.start();
//     return () => pulse.stop();
//   }, []);

//   // Show snackbar function
//   const showSnackbar = (message, type = 'success') => {
//     setSnackbarMessage(message);
//     setSnackbarType(type);
//     setSnackbarVisible(true);
//     Animated.timing(snackbarAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
    
//     setTimeout(() => {
//       Animated.timing(snackbarAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setSnackbarVisible(false));
//     }, 3000);
//   };

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

//   // MMKV cache functions
//   const saveDataToMMKV = (key, data) => {
//     try {
//       const jsonValue = JSON.stringify(data);
//       mmkv.set(key, jsonValue);
//       if (key === STATUS_STORAGE_KEY) {
//         mmkv.set(CACHE_TIMESTAMP_KEY, new Date().toISOString());
//       }
//     } catch (error) {
//       console.error('Error saving data to MMKV:', error);
//     }
//   };

//   const getDataFromMMKV = (key) => {
//     try {
//       const jsonValue = mmkv.getString(key);
//       return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error('Error getting data from MMKV:', error);
//       return null;
//     }
//   };

//   const clearMMKVCache = () => {
//     try {
//       mmkv.delete(STATUS_STORAGE_KEY);
//       mmkv.delete(CACHE_TIMESTAMP_KEY);
//     } catch (error) {
//       console.error('Error clearing MMKV cache:', error);
//     }
//   };

//   const checkCacheExpiryMMKV = () => {
//     try {
//       const timestamp = mmkv.getString(CACHE_TIMESTAMP_KEY);
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

//   const loadCachedDataMMKV = async () => {
//     try {
//       const isCacheExpired = checkCacheExpiryMMKV();
//       if (isCacheExpired) {
//         clearMMKVCache();
//         return false;
//       }

//       const cachedStatuses = getDataFromMMKV(STATUS_STORAGE_KEY);
//       if (cachedStatuses) {
//         setGroupedStatuses(cachedStatuses);
//         preloadAllStatusImages(cachedStatuses);
//       }
//       return cachedStatuses;
//     } catch (error) {
//       console.error('Error loading cached data from MMKV:', error);
//       return false;
//     }
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
//     } catch (error) {
//       console.error('Error preloading images:', error);
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
      
//       await axios.post(`${API_ROUTE}/status/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//         timeout: 30000,
//       });
      
//       showSnackbar('Status uploaded successfully!', 'success');
//       setImage(null);
//       setCaption('');
//       setAddStatusModalVisible(false);
//       await fetchAllData();
//     } catch (error) {
//       console.error('Upload error:', error.response?.data || error.message);
//       showSnackbar('Upload Failed. Please try again.', 'error');
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
      
//       setGroupedStatuses(prev => 
//         prev.filter(group => 
//           group.statuses.some(status => status.id !== statusId)
//         ).filter(group => group.statuses.length > 0)
//       );
      
//       setDeleteModalVisible(false);
//       setStatusToDelete(null);
      
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

//   const openReplyModal = (status) => {
//     console.log('📝 Opening reply modal for status:', status.id);
//     setCurrentReplyStatus(status);
//     setReplyMessage('');
//     setShowReplyModal(true);
//   };

//   const QUICK_REACTIONS = ['❤️', '👍', '😂', '😮', '😢'];

//   const sendChatMessage = async (content) => {
//     if (!currentReplyStatus) {
//       showSnackbar('Status not found', 'error');
//       return { ok: false };
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         showSnackbar('Please login to reply', 'error');
//         return { ok: false };
//       }

//       let receiverId = null;
//       if (currentReplyStatus.user) {
//         if (typeof currentReplyStatus.user === 'object') {
//           receiverId = currentReplyStatus.user.id || currentReplyStatus.user.user_id;
//         } else {
//           receiverId = currentReplyStatus.user;
//         }
//       }
//       if (!receiverId) {
//         receiverId = currentReplyStatus.user_id || currentReplyStatus.userId;
//       }
//       if (!receiverId) {
//         showSnackbar('User not found', 'error');
//         return { ok: false };
//       }

//       const statusOwner = currentReplyStatus.user?.name ||
//                           currentReplyStatus.user?.username ||
//                           currentReplyStatus.username ||
//                           'User';

//       const statusImageUrl = getImageUrl(currentReplyStatus.media || currentReplyStatus.image);

//       // Send to both personal and business modes
//       const modes = ['personal', 'business'];
//       let successCount = 0;
//       let failedCount = 0;
//       let lastError = null;

//       for (const mode of modes) {
//         try {
//           const formData = new FormData();

//           let messageContent = content;
//           messageContent += `\n\n📸 Status Reply to ${statusOwner}`;
//           if (currentReplyStatus.text) {
//             messageContent += `\n📝 Status: "${currentReplyStatus.text.substring(0, 100)}"`;
//           }
//           formData.append('content', messageContent);

//           if (statusImageUrl) {
//             try {
//               const fileName = statusImageUrl.split('/').pop() || 'status_image.jpg';
//               formData.append('image', {
//                 uri: statusImageUrl,
//                 type: 'image/jpeg',
//                 name: fileName,
//               });
//             } catch (imageError) {
//               console.error('Error attaching image:', imageError);
//             }
//           }

//           formData.append('chat_type', 'single');
//           formData.append('account_mode', mode);
//           formData.append('receiver', receiverId.toString());

//           console.log(`📤 Sending to ${mode} mode...`);

//           const response = await axios.post(
//             `${API_ROUTE}/api/chat/`,
//             formData,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data',
//               },
//               timeout: 30000,
//             }
//           );

//           const ok = response.status === 200 || response.status === 201;
//           if (ok) {
//             successCount++;
//             console.log(`✅ ${mode} mode sent successfully`);
//           } else {
//             failedCount++;
//             console.log(`❌ ${mode} mode failed`);
//           }
//         } catch (error) {
//           failedCount++;
//           lastError = error;
//           console.error(`❌ Error sending to ${mode} mode:`, {
//             status: error.response?.status,
//             data: error.response?.data,
//             message: error.message
//           });
//         }
//       }

//       console.log(`📊 Summary: ${successCount} successful, ${failedCount} failed`);

//       if (successCount > 0) {
//         return { ok: true, receiverId, statusOwner, successCount, failedCount };
//       } else {
//         let errorMessage = 'Failed to send message';
//         if (lastError?.response?.status === 401) {
//           errorMessage = 'Session expired. Please login again.';
//         } else if (lastError?.response?.status === 400) {
//           errorMessage = lastError?.response?.data?.error || 'Invalid request';
//         } else if (lastError?.response?.data?.detail) {
//           errorMessage = lastError.response.data.detail;
//         } else if (lastError?.message?.includes('Network Error')) {
//           errorMessage = 'Network error. Please check your connection.';
//         }

//         showSnackbar(errorMessage, 'error');
//         return { ok: false };
//       }
//     } catch (error) {
//       console.error('❌ Error sending chat message:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });

//       let errorMessage = 'Failed to send message';
//       if (error.response?.status === 401) {
//         errorMessage = 'Session expired. Please login again.';
//       } else if (error.response?.status === 400) {
//         errorMessage = error.response?.data?.error || 'Invalid request';
//       } else if (error.response?.data?.detail) {
//         errorMessage = error.response.data.detail;
//       } else if (error.message?.includes('Network Error')) {
//         errorMessage = 'Network error. Please check your connection.';
//       }

//       showSnackbar(errorMessage, 'error');
//       return { ok: false };
//     }
//   };

//   const sendStatusReply = async () => {
//     if (!replyMessage.trim()) {
//       showSnackbar('Please enter a message', 'error');
//       return;
//     }
//     if (!currentReplyStatus) {
//       showSnackbar('Status not found', 'error');
//       return;
//     }

//     setSendingReply(true);
//     const result = await sendChatMessage(replyMessage.trim());
//     setSendingReply(false);

//     if (result.ok) {
//       if (result.successCount === 2) {
//         showSnackbar('✅ Reply sent to both Personal & Business!', 'success');
//       } else if (result.successCount === 1) {
//         showSnackbar(`⚠️ Sent to ${result.successCount} of 2 modes`, 'info');
//       } else {
//         showSnackbar('✅ Reply sent successfully!', 'success');
//       }
      
//       const ownerForNav = result.statusOwner;
//       const receiverForNav = result.receiverId;
//       const profileImageForNav = currentReplyStatus?.user?.profile_picture || '';

//       setReplyMessage('');
//       setShowReplyModal(false);
//       setCurrentReplyStatus(null);

//       Alert.alert(
//         'Message Sent!',
//         `Your reply has been sent to ${ownerForNav} in ${result.successCount} of 2 modes.`,
//         [
//           { text: 'Continue', style: 'cancel' },
//           {
//             text: 'Okay',
//             onPress: () => {
//               setModalVisible(false);
//             }
//           }
//         ]
//       );

//       await fetchStatus();
//     }
//   };

//   const sendQuickReaction = async (emoji) => {
//     if (!currentReplyStatus || sendingReply) return;

//     setSendingReply(true);
//     const result = await sendChatMessage(emoji);
//     setSendingReply(false);

//     if (result.ok) {
//       setReplyMessage('');
//       setShowReplyModal(false);
//       setCurrentReplyStatus(null);
      
//       if (result.successCount === 2) {
//         Alert.alert(
//           'Reaction sent!',
//           `${emoji} sent successfully!`,
//           [{ text: 'OK' }]
//         );
//       } else if (result.successCount === 1) {
//         Alert.alert(
//           'Partial Success',
//           `${emoji} sent to ${result.successCount} of 2 modes. One mode failed.`,
//           [{ text: 'OK' }]
//         );
//       } else {
//         Alert.alert(
//           'Success!',
//           `${emoji} sent successfully!`,
//           [{ text: 'OK' }]
//         );
//       }
      
//       await fetchStatus();
//     } else {
//       Alert.alert(
//         'Error',
//         'Failed to send reaction. Please try again.',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   const addReaction = async (statusId, reactionType) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
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
      
//       Alert.alert(
//         'Reaction Added',
//         `You reacted with ${reactionType}`, 
//         [
//             { text: 'OK', onPress: () => console.log('OK Pressed') }
//         ]
//       );
//       setReactionModalVisible(false);
//     } catch (error) {
//       console.error('Error adding reaction:', error);
//       showSnackbar('Failed to add reaction', 'error');
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

//   // ==================== UPDATED: openImageModal with move to end ====================
//   const openImageModal = (userStatuses) => {
//     setSelectedUserStatuses(userStatuses.statuses);
//     setCurrentStatusIndex(0);
//     setModalVisible(true);

//     const isMyStatus = isMyStatusGroup(userStatuses.user);
    
//     // Only mark as viewed and move to end if it's not the user's own status
//     if (!isMyStatus) {
//       markGroupAsViewed(userStatuses.user);
      
//       // Move this group to the end of the list
//       setGroupedStatuses(prev => {
//         const updated = [...prev];
//         const groupIndex = updated.findIndex(g => 
//           normalizeId(g.user) === normalizeId(userStatuses.user)
//         );
//         if (groupIndex > -1) {
//           const [movedGroup] = updated.splice(groupIndex, 1);
//           updated.push(movedGroup);
//         }
//         return updated;
//       });
//     }

//     if (onStatusPress) {
//       onStatusPress(userStatuses);
//     }
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
//       mmkv.set(LIVE_STREAMS_KEY, JSON.stringify(liveStreamsWithTime));
//     } catch (error) {
//       console.error('Error fetching live streams:', error.message);
//       const cached = getDataFromMMKV(LIVE_STREAMS_KEY);
//       if (cached) setLiveStreams(cached);
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
//         saveDataToMMKV(STATUS_STORAGE_KEY, grouped);
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
      
//       const statuses = await fetchStatus();
      
//       // Apply viewed statuses from persistent storage
//       const viewedSet = loadViewedStatuses();
//       setViewedStatusIds(viewedSet);
      
//       // Update viewers array based on viewed statuses
//       const updatedStatuses = statuses.map(group => {
//         const groupUserId = normalizeId(group.user);
//         if (viewedSet.has(groupUserId)) {
//           // If marked as viewed, ensure current user is in viewers
//           const viewers = Array.isArray(group.viewers) ? group.viewers : [];
//           const alreadyViewed = viewers.some(v => normalizeId(v) === normalizeId(currentUserId));
//           if (!alreadyViewed && currentUserId) {
//             return { ...group, viewers: [...viewers, currentUserId] };
//           }
//         }
//         return group;
//       });
      
//       setGroupedStatuses(updatedStatuses);
      
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
//       const isCacheExpired = checkCacheExpiryMMKV();
//       if (isCacheExpired) {
//         clearMMKVCache();
//       }
      
//       const statuses = await fetchStatus();
      
//       // Apply viewed statuses from persistent storage
//       const viewedSet = loadViewedStatuses();
//       setViewedStatusIds(viewedSet);
      
//       // Update viewers array based on viewed statuses
//       const updatedStatuses = statuses.map(group => {
//         const groupUserId = normalizeId(group.user);
//         if (viewedSet.has(groupUserId)) {
//           const viewers = Array.isArray(group.viewers) ? group.viewers : [];
//           const alreadyViewed = viewers.some(v => normalizeId(v) === normalizeId(currentUserId));
//           if (!alreadyViewed && currentUserId) {
//             return { ...group, viewers: [...viewers, currentUserId] };
//           }
//         }
//         return group;
//       });
      
//       setGroupedStatuses((prev) => {
//         if (JSON.stringify(prev) !== JSON.stringify(updatedStatuses)) {
//           return updatedStatuses;
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
//       // Load viewed statuses from persistent storage on mount
//       const viewedSet = loadViewedStatuses();
//       setViewedStatusIds(viewedSet);
      
//       (async () => {
//         const hasCache = await loadCachedDataMMKV();
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

//   const fetchUserDetails = async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       console.log(`🔍 Fetching user details for ID: ${userId}`);
      
//       const response = await axios.get(`${API_ROUTE}/users/${userId}/profile/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       console.log(`✅ User ${userId} details:`, response.data);
//       return response.data.user || response.data;
//     } catch (error) {
//       console.error(`❌ Error fetching user ${userId}:`, error);
//       return {
//         id: userId,
//         name: `User ${userId}`,
//         phone: userId,
//         profile_picture: null,
//       };
//     }
//   };

//   const handleViewersPress = async (item) => {
//     if (loadingViewers) return;
    
//     try {
//       setLoadingViewers(true);
//       console.log('👁️ Viewers data:', item.viewers);
//       console.log('👁️ Viewers count:', item.viewers_count);
      
//       if (!item.viewers || item.viewers.length === 0) {
//         Alert.alert('No Viewers', 'No one has viewed this status yet.');
//         setLoadingViewers(false);
//         return;
//       }
      
//       const viewerPromises = item.viewers.map(async (viewerId) => {
//         const userData = await fetchUserDetails(viewerId);
//         return {
//           ...userData,
//           viewed_at: item.viewed_at || new Date().toISOString()
//         };
//       });
      
//       const viewerDetails = await Promise.all(viewerPromises);
//       console.log('📊 All viewer details:', viewerDetails);
      
//       setCurrentViewers(viewerDetails);
//       setViewersModalVisible(true);
//       setLoadingViewers(false);
//     } catch (error) {
//       console.error('Error loading viewers:', error);
//       Alert.alert('Error', 'Failed to load viewer details');
//       setLoadingViewers(false);
//     }
//   };

//   const renderViewerItem = ({ item }) => {
//     const userData = item.user || item;
//     return (
//       <View style={styles.viewerItem}>
//         <Image
//           source={{
//             uri: userData.profile_picture
//               ? getImageUrl(userData.profile_picture)
//               : 'https://via.placeholder.com/40',
//           }}
//           style={styles.viewerAvatar}
//         />
//         <View style={styles.viewerInfo}>
//           <Text style={[styles.viewerName, { color: '#000' }]}>
//             {userData.name || userData.username || userData.phone || 'Unknown User'}
//           </Text>
//           {item.viewed_at && (
//             <Text style={[styles.viewerTime, { color: '#000' }]}>
//               Seen {formatTime(item.viewed_at)}
//             </Text>
//           )}
//         </View>
//       </View>
//     );
//   };

//   // ==================== UPDATED: renderStoryCircle ====================
//   const renderStoryCircle = (userStatus, isLive = false) => {
//     const isMyStatus = isMyStatusGroup(userStatus.user);

//     const imageUrl = getImageUrl(userStatus.statuses?.[0]?.media || userStatus.image || userStatus.broadcaster_image);
//     const name = isMyStatus ? 'My Story' : (userStatus.user?.name || userStatus.broadcaster_name || userStatus.user || 'User');

//     // Check if viewed using the persistent Set
//     const isViewed = !isLive && viewedStatusIds.has(normalizeId(userStatus.user));

//     // Ring color logic:
//     // - Live: Red (pulsing)
//     // - My Story: Red
//     // - Viewed by me: Gray
//     // - Unviewed (default): Blue
//     const ringColorStyle = isLive
//       ? styles.storyRingLive
//       : isMyStatus
//       ? styles.storyRingMine
//       : isViewed
//       ? styles.storyRingViewed
//       : styles.storyRingUnseen;

//     return (
//       <TouchableOpacity 
//         style={styles.storyWrapper} 
//         onPress={() => {
//           // If not my status and not live, mark as viewed and move to end
//           if (!isMyStatus && !isLive) {
//             markGroupAsViewed(userStatus.user);
            
//             // Move this group to the end of the list
//             setGroupedStatuses(prev => {
//               const updated = [...prev];
//               const groupIndex = updated.findIndex(g => 
//                 normalizeId(g.user) === normalizeId(userStatus.user)
//               );
//               if (groupIndex > -1) {
//                 const [movedGroup] = updated.splice(groupIndex, 1);
//                 updated.push(movedGroup);
//               }
//               return updated;
//             });
//           }
//           isLive ? handleLivePress(userStatus) : openImageModal(userStatus);
//         }}
//         activeOpacity={0.8}
//       >
//         <View style={styles.storyContainer}>
//           <View style={[
//             styles.storyRing,
//             ringColorStyle,
//           ]}>
//             <Image
//               source={
//                 imageUrl
//                   ? { uri: imageUrl }
//                   : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//               }
//               style={styles.storyImage}
//             />
            
//             {/* Add Status Badge */}
//             {isMyStatus && (
//               <TouchableOpacity 
//                 style={styles.addStatusBadge}
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   if (onAddStatusPress) {
//                     onAddStatusPress();
//                   } else {
//                     setAddStatusModalVisible(true);
//                   }
//                 }}
//                 activeOpacity={0.9}
//               >
//                 <View style={styles.addStatusBadgeInner}>
//                   <Icon name="add" size={20} color="#fff" />
//                 </View>
//               </TouchableOpacity>
//             )}
            
//             {isLive && (
//               <View style={styles.liveBadgeContainer}>
//                 <Animated.View 
//                   style={[
//                     styles.liveBadgePulse,
//                     {
//                       transform: [{ scale: pulseAnim }],
//                     }
//                   ]} 
//                 />
//                 <Text style={styles.liveBadgeText}>LIVE</Text>
//               </View>
//             )}
            
//             {isLive && (
//               <Animated.View 
//                 style={[
//                   styles.liveGlowRing,
//                   {
//                     opacity: pulseAnim.interpolate({
//                       inputRange: [1, 1.3],
//                       outputRange: [0.3, 0.8],
//                     }),
//                     transform: [{ scale: pulseAnim }],
//                   }
//                 ]} 
//               />
//             )}
//           </View>
          
//           <Text style={styles.storyName} numberOfLines={1}>
//             {name}
//           </Text>
          
//           {isLive && (
//             <View style={styles.liveLabelContainer}>
//               <Text style={styles.liveLabelText}>● LIVE</Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Handle live press
//   const handleLivePress = (stream) => {
//     if (onLivePress) {
//       onLivePress(stream);
//     } else {
//       navigation.navigate('Viewer', {
//         roomName: 'match-123',
//         streamId: 'stream-1',
//         viewerId: 'viewer-1',
//       });
//     }
//   };

//   const renderStatusPreview = (userStatus) => {
//     return renderStoryCircle(userStatus, false);
//   };

//   const renderLiveStreamPreview = (stream) => {
//     const liveData = {
//       ...stream,
//       user: {
//         name: stream.broadcaster_name || 'User',
//         phone: stream.broadcaster_phone || stream.user_id,
//       },
//       statuses: [{
//         media: stream.broadcaster_image || stream.thumbnail,
//       }],
//       broadcaster_name: stream.broadcaster_name,
//       broadcaster_image: stream.broadcaster_image,
//     };
//     return renderStoryCircle(liveData, true);
//   };

//   // ==================== renderStatusItem ====================
//   const renderStatusItem = ({ item, index }) => {
//     const isMyStatus = item.user?.phone === currentUserPhone || item.user === currentUserPhone;
    
//     const handleDeletePress = () => {
//       Alert.alert(
//         'Delete Status',
//         'Are you sure you want to delete this status? This action cannot be undone.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Delete', onPress: () => deleteStatus(item.id), style: 'destructive' },
//         ]
//       );
//     };
    
//     return (
//       <View style={styles.statusViewerContainer}>
//         <TouchableOpacity 
//           style={[styles.tapArea, styles.leftTapArea]}
//           onPress={goToPreviousStatus}
//           activeOpacity={0.1}
//         />
//         <TouchableOpacity 
//           style={[styles.tapArea, styles.rightTapArea]}
//           onPress={goToNextStatus}
//           activeOpacity={0.1}
//         />

//         <Image
//           source={{ uri: getImageUrl(item.media) }}
//           style={styles.fullImage}
//           resizeMode="contain"
//           onError={(e) => console.log('Image load error:', e.nativeEvent)}
//         />

//         <View style={styles.statusViewerOverlay}>
//           <View style={styles.statusViewerHeader}>
//             <Image
//               source={{
//                 uri: item.user?.profile_picture
//                   ? getSecureUrl(`${API_ROUTE_IMAGE}${item.user.profile_picture}`)
//                   : 'https://via.placeholder.com/40',
//               }}
//               style={styles.statusViewerAvatar}
//             />
//             <View style={styles.userInfo}>
//               <Text style={styles.statusViewerUsername}>
//                 {isMyStatus ? 'My Status' : item.user?.name || item.user}
//               </Text>
//               <Text style={styles.statusViewerTime}>{formatTime(item.created_at)}</Text>
//             </View>
          
//             {/* Close Button */}
//             <View style={styles.headerButton}>
//               <TouchableOpacity 
//                 onPress={() => {
//                   console.log('Close button pressed');
//                   setModalVisible(false);
//                   setCurrentStatusIndex(0);
//                 }}
//                 activeOpacity={0.7}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <Icon name="close" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.bottomInputContainer}>
//             {item.text && (
//               <View style={styles.captionContainer}>
//                 <Text style={styles.statusViewerCaption}>{item.text}</Text>
//               </View>
//             )}

//             {!isMyStatus && (
//               <View style={styles.replyButtondContainer}>
//                 <TouchableOpacity 
//                   style={styles.replyButton}
//                   onPress={() => openReplyModal(item)}
//                 >
//                   <MaterialIcon name="reply" size={20} color="#fff" />
//                   <Text style={styles.replyButtonText}>like or reply</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {currentStatusIndex > 0 && (
//             <TouchableOpacity 
//               style={[styles.navArrow, styles.leftArrow]}
//               onPress={goToPreviousStatus}
//             >
//               <Icon name="chevron-back" size={30} color="#fff" />
//             </TouchableOpacity>
//           )}
          
//           {currentStatusIndex < selectedUserStatuses.length - 1 && (
//             <TouchableOpacity 
//               style={[styles.navArrow, styles.rightArrow]}
//               onPress={goToNextStatus}
//             >
//               <Icon name="chevron-forward" size={30} color="#fff" />
//             </TouchableOpacity>
//           )}

//           <View style={styles.bottomActionsContainer}>
//             {isMyStatus && (
//               <>
//                 {item.viewers_count > 0 ? (
//                   <TouchableOpacity
//                     style={[styles.viewersButton, loadingViewers && styles.viewersButtonLoading]}
//                     onPress={() => handleViewersPress(item)}
//                     disabled={loadingViewers}
//                   >
//                     {loadingViewers ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <>
//                         <Icon name="eye" size={16} color="#fff" style={styles.eyeIcon} />
//                         <Text style={styles.viewersButtonText}>
//                           {item.viewers_count} view{item.viewers_count !== 1 ? 's' : ''}
//                         </Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 ) : (
//                   <View style={styles.viewersButtonDisabled}>
//                     <Icon name="eye-off" size={16} color="rgba(255,255,255,0.5)" />
//                     <Text style={styles.viewersButtonTextDisabled}>No views</Text>
//                   </View>
//                 )}

//                 <TouchableOpacity
//                   style={styles.deleteButtonBottom}
//                   onPress={handleDeletePress}
//                 >
//                   <Icon name="trash-outline" size={18} color="#fff" />
//                   <Text style={styles.deleteButtonText}>Delete</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const renderReplyModal = () => {
//     if (!currentReplyStatus) return null;
    
//     const statusOwner = currentReplyStatus.user?.name || 
//                         currentReplyStatus.user?.username || 
//                         currentReplyStatus.username || 
//                         'User';
//     const statusImage = getImageUrl(currentReplyStatus.media || currentReplyStatus.image);
    
//     return (
//       <Modal
//         visible={showReplyModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           setShowReplyModal(false);
//           setCurrentReplyStatus(null);
//           setReplyMessage('');
//         }}
//       >
//         <KeyboardAvoidingView 
//           style={styles.replyModalOverlay}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <View style={styles.replyModalContainer}>
//             <View style={styles.replyModalHeader}>
//               <TouchableOpacity 
//                 onPress={() => {
//                   setShowReplyModal(false);
//                   setCurrentReplyStatus(null);
//                   setReplyMessage('');
//                 }}
//               >
//                 <Icon name="close" size={24} color="#fff" />
//               </TouchableOpacity>
//               <Text style={styles.replyModalTitle}>Reply to Status</Text>
//               <View style={{ width: 24 }} />
//             </View>

//             <View style={styles.replyStatusPreview}>
//               <Image
//                 source={statusImage ? { uri: statusImage } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//                 style={styles.replyStatusImage}
//                 resizeMode="cover"
//               />
//               <View style={styles.replyStatusInfo}>
//                 <Text style={styles.replyStatusOwner}>
//                   {statusOwner}
//                 </Text>
//                 {currentReplyStatus.text && (
//                   <Text style={styles.replyStatusCaption} numberOfLines={2}>
//                     {currentReplyStatus.text}
//                   </Text>
//                 )}
//                 <Text style={styles.replyStatusTime}>
//                   {formatTime(currentReplyStatus.created_at)}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.quickReactionsRow}>
//               {QUICK_REACTIONS.map((emoji) => (
//                 <TouchableOpacity
//                   key={emoji}
//                   style={[
//                     styles.quickReactionButton,
//                     sendingReply && styles.quickReactionButtonDisabled
//                   ]}
//                   onPress={() => sendQuickReaction(emoji)}
//                   disabled={sendingReply}
//                   activeOpacity={0.7}
//                 >
//                   <Text style={styles.quickReactionEmoji}>{emoji}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.replyInputContainer}>
//               <Text style={styles.replyInputLabel}>
//                 Your Message
//               </Text>
//               <TextInput
//                 style={styles.replyInput}
//                 placeholder="Type your reply..."
//                 placeholderTextColor="rgba(255,255,255,0.5)"
//                 value={replyMessage}
//                 onChangeText={setReplyMessage}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//                 blurOnSubmit={false}
//               />
//             </View>

//             <TouchableOpacity
//               style={[
//                 styles.replySendButton,
//                 { backgroundColor: replyMessage.trim() ? colors.primary : 'rgba(255,255,255,0.15)' },
//                 sendingReply && styles.replySendButtonDisabled
//               ]}
//               onPress={sendStatusReply}
//               disabled={!replyMessage.trim() || sendingReply}
//             >
//               {sendingReply ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <>
//                   <Icon name="send" size={20} color="#fff" />
//                   <Text style={styles.replySendButtonText}>Send Reply</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     );
//   };

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

//   const renderSnackbar = () => {
//     if (!snackbarVisible) return null;
//     return (
//       <Animated.View
//         style={[
//           styles.snackbarContainer,
//           {
//             opacity: snackbarAnim,
//             backgroundColor: snackbarType === 'success' ? '#4CAF50' : 
//                             snackbarType === 'error' ? '#f44336' : 
//                             snackbarType === 'info' ? '#2196F3' : '#4CAF50',
//           }
//         ]}
//       >
//         <Text style={styles.snackbarText}>{snackbarMessage}</Text>
//       </Animated.View>
//     );
//   };

//   const myStatus = groupedStatuses.find(
//     (status) => status.user?.phone === currentUserPhone || status.user === currentUserPhone
//   );

//   const otherStatuses = groupedStatuses.filter(
//     (status) => status.user?.phone !== currentUserPhone && status.user !== currentUserPhone
//   );

//   const sortByTimeDesc = (a, b) => {
//     const timeA = new Date(a.created_at || a.started_at);
//     const timeB = new Date(b.created_at || b.started_at);
//     return timeB - timeA;
//   };

//   const liveItems = liveStreams.map(stream => ({ ...stream, type: 'live' })).sort(sortByTimeDesc);

//   // Get unviewed and viewed statuses using the persistent Set
//   const unviewedStatuses = otherStatuses
//     .filter(status => !viewedStatusIds.has(normalizeId(status.user)))
//     .map(status => ({ ...status, type: 'status' }))
//     .sort(sortByTimeDesc);

//   const viewedStatuses = otherStatuses
//     .filter(status => viewedStatusIds.has(normalizeId(status.user)))
//     .map(status => ({ ...status, type: 'status' }))
//     .sort(sortByTimeDesc);

//   // Combine: Live first, then unviewed (blue), then viewed (gray)
//   const combinedUpdates = [...liveItems, ...unviewedStatuses, ...viewedStatuses];

//   const displayUpdates = maxItems ? combinedUpdates.slice(0, maxItems) : combinedUpdates;

//   const handleScrollEnd = (event) => {
//     const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
//     if (newIndex !== currentStatusIndex) {
//       setCurrentStatusIndex(newIndex);
//     }
//   };

//   // ==================== MAIN RENDER ====================
//   return (
//     <View style={[styles.container, containerStyle]}>
//       {/* Delete Modal */}
//       <Modal
//         visible={deleteModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setDeleteModalVisible(false)}
//         statusBarTranslucent={true}
//       >
//         <View style={styles.deleteModalOverlay}>
//           <View style={styles.deleteModalContent}>
//             <Text style={styles.deleteModalTitle}>Delete Status?</Text>
//             <Text style={styles.deleteModalText}>
//               Are you sure you want to delete this status? This action cannot be undone.
//             </Text>
//             <View style={styles.deleteModalButtons}>
//               <TouchableOpacity 
//                 style={[styles.deleteModalButton, styles.cancelButton]}
//                 onPress={() => setDeleteModalVisible(false)}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={[styles.deleteModalButton, styles.confirmButton]}
//                 onPress={() => {
//                   if (statusToDelete && statusToDelete.id) {
//                     deleteStatus(statusToDelete.id);
//                   }
//                 }}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.confirmButtonText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Snackbar */}
//       {renderSnackbar()}

//       {/* Main Content */}
//       <View>
//         {showTitle && (
//           <Text style={[styles.sectionTitle, { fontWeight: '600', fontSize: 20 }]}>{title}</Text>
//         )}
        
//         {/* Horizontal Scroll with Multiple Items */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.horizontalScrollContainer}
//         >
//           {/* My Status */}
//           {myStatus && (
//             <View style={styles.horizontalItem}>
//               {renderStoryCircle(myStatus, false)}
//             </View>
//           )}
          
//           {/* Combined Stories */}
//           {displayUpdates.map((item, index) => (
//             <View key={`${item.type}-${item.id || index}`} style={styles.horizontalItem}>
//               {item.type === 'live' 
//                 ? renderLiveStreamPreview(item) 
//                 : renderStatusPreview(item)}
//             </View>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Status Viewer Modal with Close Button */}
//       <Modal 
//         visible={modalVisible} 
//         transparent={true} 
//         onRequestClose={() => {
//           setModalVisible(false);
//           setCurrentStatusIndex(0);
//         }}
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

//       {/* Viewers Modal */}
//       <Modal
//         visible={viewersModalVisible}
//         transparent={false}
//         animationType="slide"
//         onRequestClose={() => {
//           setViewersModalVisible(false);
//           setLoadingViewers(false);
//         }}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <TouchableOpacity onPress={() => {
//               setViewersModalVisible(false);
//               setLoadingViewers(false);
//             }}>
//               <Icon name="arrow-back" size={24} color={colors.text} />
//             </TouchableOpacity>
//             <Text style={styles.modalTitle}>Viewers</Text>
//             <View style={{ width: 24 }} />
//           </View>
//           <FlatList
//             data={currentViewers}
//             renderItem={renderViewerItem}
//             keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//             contentContainerStyle={styles.viewersList}
//             ListEmptyComponent={
//               <View style={styles.emptyContainer}>
//                 <Text style={styles.emptyText}>No viewers yet</Text>
//               </View>
//             }
//           />
//         </SafeAreaView>
//       </Modal>

//       {/* Reaction Modal */}
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

//       {/* Comments Modal */}
//       {renderCommentsModal()}

//       {/* Reply Modal */}
//       {renderReplyModal()}

//       {/* Add Status Modal */}
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
//           <SafeAreaView style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 0 : 20 }}>
//             {/* Header with Close Button */}
//             <View style={styles.addStatusHeaderContainer}>
//               <TouchableOpacity 
//                 onPress={() => {
//                   setAddStatusModalVisible(false);
//                   setImage(null);
//                   setCaption('');
//                 }}
//                 style={styles.addStatusCloseButton}
//                 activeOpacity={0.7}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <Icon name="close" size={28} color={colors.text} />
//               </TouchableOpacity>
//               <Text style={[styles.addStatusModalTitle, { color: colors.text }]}>
//                 Add Status
//               </Text>
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
//               <TextInput
//                 style={styles.captionInput}
//                 placeholder="Add a caption..."
//                 placeholderTextColor={colors.placeholder}
//                 value={caption}
//                 onChangeText={setCaption}
//                 multiline
//                 maxLength={200}
//               />
              
//               <View style={styles.addStatusButtonRow}>
//                 <TouchableOpacity
//                   onPress={handlePostStatus}
//                   disabled={!image || postingStatus}
//                   style={[
//                     styles.postButtonContainer, 
//                     (!image || postingStatus) ? styles.postButtonDisabled : {},
//                     { flex: 1 }
//                   ]}
//                 >
//                   {postingStatus ? (
//                     <ActivityIndicator size="small" color="#0623ff" />
//                   ) : (
//                     <Text style={[styles.postButtonText, !image ? styles.postButtonTextDisabled : {}]}>
//                       Post Status
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
              
//               {image && !postingStatus && (
//                 <TouchableOpacity onPress={handleSelectMedia} style={{ marginTop: 12, alignItems: 'center' }}>
//                   <Text style={{ color: colors.primary }}>Change Media</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </SafeAreaView>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* Background refresh indicator */}
//       {backgroundRefreshing && (
//         <View style={styles.backgroundRefreshIndicator}>
//           <ActivityIndicator size="small" color={colors.primary} />
//           <Text style={styles.backgroundRefreshText}>Updating...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const createStyles = (colors, isDark, insets, customStyles = {}) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     elevation: 10,
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   sectionTitle: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 20,
//     color: colors.text,
//     marginLeft: 16,
//     marginBottom: 10,
//   },
//   horizontalScrollContainer: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   horizontalItem: {
//     alignItems: 'center',
//     marginHorizontal: 3,
//   },
//   storyWrapper: {
//     alignItems: 'center',
//   },
//   storyContainer: {
//     alignItems: 'center',
//     width: 80,
//   },
//   storyRing: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     padding: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   storyRingViewed: {
//     borderWidth: 2.5,
//     borderColor: '#C7C7CC',
//     shadowOpacity: 0,
//     elevation: 0,
//   },
//   storyRingMine: {
//     borderWidth: 3,
//     borderColor: '#FF3B30',
//     shadowColor: '#FF3B30',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   storyRingLive: {
//     borderWidth: 2.5,
//     borderColor: '#FF3B30',
//     shadowColor: '#FF3B30',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   storyRingUnseen: {
//     borderWidth: 2.5,
//     borderColor: '#405DE6',
//     shadowColor: '#405DE6',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   storyImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 2.5,
//     borderColor: '#fff',
//     backgroundColor: '#e0e0e0',
//   },
//   addStatusBadge: {
//     position: 'absolute',
//     bottom: 2,
//     right: 2,
//     zIndex: 20,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#fff',
//     backgroundColor: '#405DE6',
//     shadowColor: '#405DE6',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.5,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   addStatusBadgeInner: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#405DE6',
//   },
//   storyName: {
//     fontSize: 12,
//     color: colors.text,
//     marginTop: 3,
//     textAlign: 'center',
//     fontFamily: 'SourceSansPro-Regular',
//     maxWidth: 80,
//   },
//   liveBadgeContainer: {
//     position: 'absolute',
//     bottom: -2,
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FF3B30',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//     borderWidth: 2.5,
//     borderColor: '#fff',
//     shadowColor: '#FF3B30',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.6,
//     shadowRadius: 6,
//     elevation: 6,
//     zIndex: 10,
//   },
//   liveBadgePulse: {
//     width: 7,
//     height: 7,
//     borderRadius: 3.5,
//     backgroundColor: '#fff',
//     marginRight: 4,
//   },
//   liveBadgeText: {
//     color: '#fff',
//     fontSize: 9,
//     fontWeight: '800',
//     letterSpacing: 0.5,
//     textTransform: 'uppercase',
//   },
//   liveGlowRing: {
//     position: 'absolute',
//     width: 96,
//     height: 96,
//     borderRadius: 41,
//     borderWidth: 2,
//     borderColor: '#FF3B30',
//     opacity: 0.4,
//   },
//   liveLabelText: {
//     color: '#FF3B30',
//     fontSize: 9,
//     fontWeight: '700',
//     letterSpacing: 0.3,
//   },
//   emptyStoriesContainer: {
//     padding: 20,
//     minWidth: 150,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyStoriesText: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   addStatusHeaderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border || 'rgba(0,0,0,0.1)',
//     backgroundColor: colors.background,
//   },
//   addStatusCloseButton: {
//     padding: 4,
//   },
//   addStatusModalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     fontFamily: 'SourceSansPro-SemiBold',
//   },
//   addStatusButtonRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 16,
//   },
//   addStatusCancelButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     borderWidth: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 80,
//   },
//   addStatusCancelButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   previewImage: {
//     width: '100%',
//     height: '50%',
//     resizeMode: 'cover',
//     marginBottom: 10,
//   },
//   imagePlaceholder: {
//     height: '50%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.backgroundSecondary,
//     borderBottomWidth: 1,
//     borderColor: colors.border,
//   },
//   imagePlaceholderText: {
//     color: colors.textSecondary,
//     marginTop: 10,
//   },
//   captionInput: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 10,
//     padding: 15,
//     fontSize: 16,
//     textAlignVertical: 'top',
//     minHeight: 100,
//     color: colors.text,
//     backgroundColor: colors.backgroundSecondary,
//   },
//   postButtonContainer: {
//     marginTop: 20,
//     backgroundColor: colors.primary,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   postButtonDisabled: {
//     backgroundColor: colors.surface,
//   },
//   postButtonText: {
//     color: colors.textInverse,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   postButtonTextDisabled: {
//     color: colors.textTertiary,
//   },
//   imageModal: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   flatList: {
//     flex: 1,
//   },
//   fullImage: {
//     width: width,
//     height: height,
//     backgroundColor: '#000',
//   },
//   statusViewerContainer: {
//     width: width,
//     height: height,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statusViewerOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   statusViewerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'ios' ? 60 : 40,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     paddingBottom: 10,
//     zIndex: 200,
//     elevation: 200,
//   },
//   statusViewerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   userInfo: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     alignSelf: 'center',
//   },
//   statusViewerUsername: {
//     color: '#fff',
//     justifyContent: 'center',
//     fontSize: 16,
//     fontFamily: 'SourceSansPro-SemiBold',
//   },
//   statusViewerTime: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 12,
//     fontFamily: 'SourceSansPro-Regular',
//     marginTop: 2,
//   },
//   headerButton: {
//     padding: 8,
//     marginLeft: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 201,
//     elevation: 201,
//   },
//   captionContainer: {
//     position: 'absolute',
//     top: '20%',
//     width: '100%',
//     backgroundColor: 'rgba(21, 21, 21, 0.6)',
//     padding: 10,
//     borderRadius: 0,
//     justifyContent: 'center',
//     transform: [{ translateY: -50 }],
//   },
//   statusViewerCaption: {
//     color: '#fff',
//     fontSize: 16,
//     fontFamily: 'SourceSansPro-Regular',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   bottomInputContainer: {
//     position: 'absolute',
//     bottom: 45,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 16,
//   },
//   replyButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     backgroundColor: 'rgba(0, 132, 255, 0.8)',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 25,
//     gap: 8,
//   },
//   replyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   navArrow: {
//     position: 'absolute',
//     top: '50%',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     transform: [{ translateY: -25 }],
//   },
//   leftArrow: {
//     left: 10,
//   },
//   rightArrow: {
//     right: 10,
//   },
//   bottomActionsContainer: {
//     position: 'absolute',
//     bottom: 90,
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//     zIndex: 200,
//     elevation: 200,
//   },
//   viewersButton: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 22,
//     flexDirection: 'row',
//     alignItems: 'center',
//     minWidth: 100,
//     justifyContent: 'center',
//   },
//   viewersButtonLoading: {
//     minWidth: 100,
//     justifyContent: 'center',
//   },
//   viewersButtonDisabled: {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 22,
//     flexDirection: 'row',
//     alignItems: 'center',
//     minWidth: 100,
//     justifyContent: 'center',
//   },
//   viewersButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontFamily: 'SourceSansPro-SemiBold',
//     marginLeft: 6,
//   },
//   viewersButtonTextDisabled: {
//     color: 'rgba(255,255,255,0.5)',
//     fontSize: 14,
//     fontFamily: 'SourceSansPro-SemiBold',
//     marginLeft: 6,
//   },
//   deleteButtonBottom: {
//     backgroundColor: 'rgba(255, 59, 48, 0.85)',
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 22,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     minWidth: 90,
//     justifyContent: 'center',
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontFamily: 'SourceSansPro-SemiBold',
//   },
//   eyeIcon: {
//     marginRight: 2,
//   },
//   tapArea: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     width: width * 0.3,
//     zIndex: 100,
//   },
//   leftTapArea: {
//     left: 0,
//   },
//   rightTapArea: {
//     right: 0,
//   },
//   deleteModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         zIndex: 10000,
//       },
//       android: {
//         elevation: 10000,
//       },
//     }),
//   },
//   deleteModalContent: {
//     backgroundColor: colors.background,
//     borderRadius: 14,
//     padding: 24,
//     width: '85%',
//     maxWidth: 340,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         alignSelf: 'center',
//         marginHorizontal: 20,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   deleteModalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: colors.text,
//     textAlign: 'center',
//   },
//   deleteModalText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginBottom: 24,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   deleteModalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 8,
//   },
//   deleteModalButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     minWidth: 120,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: colors.buttonSecondary || '#E8E8E8',
//     marginRight: 8,
//   },
//   confirmButton: {
//     backgroundColor: colors.error || '#FF3B30',
//     marginLeft: 8,
//   },
//   cancelButtonText: {
//     color: colors.text || '#000000',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   confirmButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontFamily: 'SourceSansPro-SemiBold',
//     color: colors.text,
//   },
//   viewersList: {
//     padding: 16,
//   },
//   viewerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   viewerAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   viewerInfo: {
//     flex: 1,
//   },
//   viewerName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: colors.text,
//   },
//   viewerTime: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     marginTop: 4,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: 'center',
//   },
//   reactionsModalOverlay: {
//     flex: 1,
//     backgroundColor: colors.overlay,
//     justifyContent: 'flex-end',
//   },
//   reactionsModalContent: {
//     backgroundColor: colors.background,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   reactionsModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   reactionsModalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.text,
//   },
//   reactionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   reactionAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   reactionInfo: {
//     flex: 1,
//   },
//   reactionUserName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: colors.text,
//   },
//   reactionType: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 2,
//   },
//   reactionTime: {
//     fontSize: 12,
//     color: colors.textTertiary,
//   },
//   commentsModalContainer: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   commentsModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   commentsModalTitle: {
//     fontSize: 18,
//     fontFamily: 'SourceSansPro-SemiBold',
//     color: colors.text,
//   },
//   commentsList: {
//     padding: 16,
//   },
//   commentItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   commentAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   commentContent: {
//     flex: 1,
//     backgroundColor: colors.surface,
//     padding: 12,
//     borderRadius: 12,
//   },
//   commentUserName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 4,
//   },
//   commentText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     lineHeight: 18,
//   },
//   commentTime: {
//     fontSize: 12,
//     color: colors.textTertiary,
//     marginTop: 4,
//   },
//   replyModalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   replyModalContainer: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: height * 0.8,
//     backgroundColor: '#0f0f0f',
//   },
//   replyModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.15)',
//   },
//   replyModalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   replyStatusPreview: {
//     flexDirection: 'row',
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 16,
//     marginBottom: 16,
//     backgroundColor: 'rgba(255,255,255,0.08)',
//   },
//   replyStatusImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//   },
//   replyStatusInfo: {
//     flex: 1,
//     marginLeft: 12,
//     justifyContent: 'center',
//   },
//   replyStatusOwner: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//     color: '#fff',
//   },
//   replyStatusCaption: {
//     fontSize: 13,
//     marginBottom: 4,
//     color: 'rgba(255,255,255,0.7)',
//   },
//   replyStatusTime: {
//     fontSize: 11,
//     color: 'rgba(255,255,255,0.5)',
//   },
//   quickReactionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   quickReactionButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.08)',
//   },
//   quickReactionButtonDisabled: {
//     opacity: 0.5,
//   },
//   quickReactionEmoji: {
//     fontSize: 24,
//   },
//   replyInputContainer: {
//     marginBottom: 16,
//   },
//   replyInputLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//     color: '#fff',
//   },
//   replyInput: {
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 16,
//     minHeight: 100,
//     textAlignVertical: 'top',
//     color: '#fff',
//     backgroundColor: 'rgba(255,255,255,0.06)',
//   },
//   replySendButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 10,
//   },
//   replySendButtonDisabled: {
//     opacity: 0.6,
//   },
//   replySendButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   snackbarContainer: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 60 : 40,
//     left: 20,
//     right: 20,
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 9999,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   snackbarText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   backgroundRefreshIndicator: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 5,
//     borderRadius: 10,
//     zIndex: 1000,
//   },
//   backgroundRefreshText: {
//     marginLeft: 5,
//     fontSize: 12,
//     color: colors.primary,
//   },
// });

// export default StatusSection;

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
  Platform,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import _ from 'lodash';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../src/context/ThemeContext';
import { createMMKV } from 'react-native-mmkv';

const { width, height } = Dimensions.get('window');

// Initialize MMKV
const mmkv = new createMMKV({
  id: 'status-storage',
  encryptionKey: 'status-encryption-key-2024',
});

const STATUS_STORAGE_KEY = '@status_data';
const CACHE_TIMESTAMP_KEY = '@cache_timestamp';
const CACHE_EXPIRY_HOURS = 24;
const LIVE_STREAMS_KEY = '@live_streams';
const VIEWED_STATUSES_KEY = '@viewed_statuses'; // New key to store viewed statuses

// ==================== ID NORMALIZATION HELPER ====================
const normalizeId = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') {
    const inner = value.id ?? value.user_id ?? value._id ?? value.phone ?? value;
    if (inner === value) return null;
    return normalizeId(inner);
  }
  return String(value);
};

const StatusSection = ({ 
  onStatusPress, 
  onLivePress,
  showAddButton = true,
  onAddStatusPress,
  containerStyle,
  horizontal = true,
  showTitle = true,
  title = 'Stories',
  maxItems = null,
  customStyles = {},
}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [groupedStatuses, setGroupedStatuses] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserPhone, setCurrentUserPhone] = useState(null);
  const [viewersModalVisible, setViewersModalVisible] = useState(false);
  const [currentViewers, setCurrentViewers] = useState([]);
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
  const [sendingReply, setSendingReply] = useState(false);
  const [currentReplyStatus, setCurrentReplyStatus] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [loadingViewers, setLoadingViewers] = useState(false);
  
  // Store viewed statuses locally to persist across refreshes
  const [viewedStatusIds, setViewedStatusIds] = useState(new Set());

  // Animation for live pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const snackbarAnim = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef(null);
  const insets_safe = useSafeAreaInsets();

  const styles = createStyles(colors, isDark, insets_safe, customStyles);

  // ==================== VIEWED STATUSES PERSISTENCE ====================
  const saveViewedStatuses = (statusIds) => {
    try {
      const data = Array.from(statusIds);
      mmkv.set(VIEWED_STATUSES_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving viewed statuses:', error);
    }
  };

  const loadViewedStatuses = () => {
    try {
      const data = mmkv.getString(VIEWED_STATUSES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return new Set(parsed);
      }
    } catch (error) {
      console.error('Error loading viewed statuses:', error);
    }
    return new Set();
  };

  // Determines whether a given status/story "user" reference belongs to the logged-in user
  const isMyStatusGroup = (user) => {
    return (
      normalizeId(user?.phone) === normalizeId(currentUserPhone) ||
      normalizeId(user) === normalizeId(currentUserPhone) ||
      normalizeId(user?.id) === normalizeId(currentUserId) ||
      normalizeId(user) === normalizeId(currentUserId)
    );
  };

  // ==================== UPDATED: Mark specific status as viewed ====================
  const markStatusAsViewed = (statusUserId, statusId) => {
    if (!statusUserId || !currentUserId || !statusId) return;

    // Store viewed status with both user and status ID
    const viewedKey = `${statusUserId}_${statusId}`;
    setViewedStatusIds(prev => {
      const newSet = new Set(prev);
      newSet.add(viewedKey);
      saveViewedStatuses(newSet);
      return newSet;
    });

    // Update the specific status in groupedStatuses
    setGroupedStatuses(prev =>
      prev.map(group => {
        const groupUserId = normalizeId(group.user);
        if (groupUserId !== statusUserId) return group;

        // Update the specific status
        const updatedStatuses = group.statuses.map(status => {
          if (status.id !== statusId) return status;
          
          const viewers = Array.isArray(status.viewers) ? status.viewers : [];
          const alreadyViewed = viewers.some(v => normalizeId(v) === normalizeId(currentUserId));
          if (alreadyViewed) return status;

          return {
            ...status,
            viewers: [...viewers, currentUserId],
            viewers_count: (status.viewers_count || 0) + 1
          };
        });

        return { ...group, statuses: updatedStatuses };
      })
    );
  };

  // ==================== UPDATED: Mark all statuses in a group as viewed ====================
  const markGroupAsViewed = (statusUser) => {
    const statusUserId = normalizeId(statusUser);
    if (!statusUserId || !currentUserId) return;

    // Find the group
    const group = groupedStatuses.find(g => normalizeId(g.user) === statusUserId);
    if (!group || !group.statuses) return;

    // Mark each status as viewed
    group.statuses.forEach(status => {
      markStatusAsViewed(statusUserId, status.id);
    });
  };

  // ==================== UPDATED: Check if specific status is viewed ====================
  const isStatusViewed = (statusUserId, statusId) => {
    if (!statusUserId || !statusId) return false;
    const viewedKey = `${statusUserId}_${statusId}`;
    return viewedStatusIds.has(viewedKey);
  };

  // ==================== UPDATED: Check if group has any unviewed statuses ====================
  const isGroupFullyViewed = (group) => {
    if (!group || !group.statuses) return false;
    const statusUserId = normalizeId(group.user);
    return group.statuses.every(status => isStatusViewed(statusUserId, status.id));
  };

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
      if (key === STATUS_STORAGE_KEY) {
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
      if (cachedStatuses) {
        setGroupedStatuses(cachedStatuses);
        preloadAllStatusImages(cachedStatuses);
      }
      return cachedStatuses;
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

  // ==================== UPDATED: groupStatusesByUser with per-status viewers ====================
  const groupStatusesByUser = (statuses) => {
    const grouped = {};
    statuses.forEach((status) => {
      const userKey = status.user?.id || status.user;
      if (!grouped[userKey]) {
        grouped[userKey] = {
          user: status.user || { id: status.user, phone: status.user, name: `User ${status.user}` },
          statuses: [],
          latestTime: new Date(status.created_at),
          // Keep these for backward compatibility
          viewers_count: status.viewers_count,
          viewers: Array.isArray(status.viewers) ? status.viewers : [],
          status_type: status.status_type,
          reactions: status.reactions || [],
        };
      }
      // Store viewers per status
      grouped[userKey].statuses.push({
        ...status,
        viewers_count: status.viewers_count || 0,
        viewers: Array.isArray(status.viewers) ? status.viewers : [],
      });
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
      
      await axios.post(`${API_ROUTE}/status/`, formData, {
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

      // Send to both personal and business modes
      const modes = ['personal', 'business'];
      let successCount = 0;
      let failedCount = 0;
      let lastError = null;

      for (const mode of modes) {
        try {
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
          formData.append('account_mode', mode);
          formData.append('receiver', receiverId.toString());

          console.log(`📤 Sending to ${mode} mode...`);

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
          if (ok) {
            successCount++;
            console.log(`✅ ${mode} mode sent successfully`);
          } else {
            failedCount++;
            console.log(`❌ ${mode} mode failed`);
          }
        } catch (error) {
          failedCount++;
          lastError = error;
          console.error(`❌ Error sending to ${mode} mode:`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
        }
      }

      console.log(`📊 Summary: ${successCount} successful, ${failedCount} failed`);

      if (successCount > 0) {
        return { ok: true, receiverId, statusOwner, successCount, failedCount };
      } else {
        let errorMessage = 'Failed to send message';
        if (lastError?.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (lastError?.response?.status === 400) {
          errorMessage = lastError?.response?.data?.error || 'Invalid request';
        } else if (lastError?.response?.data?.detail) {
          errorMessage = lastError.response.data.detail;
        } else if (lastError?.message?.includes('Network Error')) {
          errorMessage = 'Network error. Please check your connection.';
        }

        showSnackbar(errorMessage, 'error');
        return { ok: false };
      }
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
      if (result.successCount === 2) {
        showSnackbar('✅ Reply sent to both Personal & Business!', 'success');
      } else if (result.successCount === 1) {
        showSnackbar(`⚠️ Sent to ${result.successCount} of 2 modes`, 'info');
      } else {
        showSnackbar('✅ Reply sent successfully!', 'success');
      }
      
      const ownerForNav = result.statusOwner;
      const receiverForNav = result.receiverId;
      const profileImageForNav = currentReplyStatus?.user?.profile_picture || '';

      setReplyMessage('');
      setShowReplyModal(false);
      setCurrentReplyStatus(null);

      Alert.alert(
        'Message Sent!',
        `Your reply has been sent to ${ownerForNav} in ${result.successCount} of 2 modes.`,
        [
          { text: 'Continue', style: 'cancel' },
          {
            text: 'Okay',
            onPress: () => {
              setModalVisible(false);
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
      setReplyMessage('');
      setShowReplyModal(false);
      setCurrentReplyStatus(null);
      
      if (result.successCount === 2) {
        Alert.alert(
          'Reaction sent!',
          `${emoji} sent successfully!`,
          [{ text: 'OK' }]
        );
      } else if (result.successCount === 1) {
        Alert.alert(
          'Partial Success',
          `${emoji} sent to ${result.successCount} of 2 modes. One mode failed.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Success!',
          `${emoji} sent successfully!`,
          [{ text: 'OK' }]
        );
      }
      
      await fetchStatus();
    } else {
      Alert.alert(
        'Error',
        'Failed to send reaction. Please try again.',
        [{ text: 'OK' }]
      );
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
      
      Alert.alert(
        'Reaction Added',
        `You reacted with ${reactionType}`, 
        [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
        ]
      );
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

  // ==================== UPDATED: openImageModal with per-status viewing ====================
  const openImageModal = (userStatuses) => {
    const isMyStatus = isMyStatusGroup(userStatuses.user);
    
    // Mark ALL statuses in this user's group as viewed (if not my own)
    if (!isMyStatus && userStatuses.statuses) {
      userStatuses.statuses.forEach(status => {
        markStatusAsViewed(normalizeId(userStatuses.user), status.id);
      });
    }
    
    setSelectedUserStatuses(userStatuses.statuses);
    setCurrentStatusIndex(0);
    setModalVisible(true);
    
    // Move this group to the end of the list if not my own
    if (!isMyStatus) {
      setGroupedStatuses(prev => {
        const updated = [...prev];
        const groupIndex = updated.findIndex(g => 
          normalizeId(g.user) === normalizeId(userStatuses.user)
        );
        if (groupIndex > -1) {
          const [movedGroup] = updated.splice(groupIndex, 1);
          updated.push(movedGroup);
        }
        return updated;
      });
    }

    if (onStatusPress) {
      onStatusPress(userStatuses);
    }
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
      
      const statuses = await fetchStatus();
      
      // Apply viewed statuses from persistent storage
      const viewedSet = loadViewedStatuses();
      setViewedStatusIds(viewedSet);
      
      // Update viewers array based on viewed statuses
      const updatedStatuses = statuses.map(group => {
        const groupUserId = normalizeId(group.user);
        const updatedStatuses = group.statuses.map(status => {
          const viewedKey = `${groupUserId}_${status.id}`;
          if (viewedSet.has(viewedKey)) {
            const viewers = Array.isArray(status.viewers) ? status.viewers : [];
            const alreadyViewed = viewers.some(v => normalizeId(v) === normalizeId(currentUserId));
            if (!alreadyViewed && currentUserId) {
              return { ...status, viewers: [...viewers, currentUserId], viewers_count: (status.viewers_count || 0) + 1 };
            }
          }
          return status;
        });
        return { ...group, statuses: updatedStatuses };
      });
      
      setGroupedStatuses(updatedStatuses);
      
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
      
      const statuses = await fetchStatus();
      
      // Apply viewed statuses from persistent storage
      const viewedSet = loadViewedStatuses();
      setViewedStatusIds(viewedSet);
      
      // Update viewers array based on viewed statuses
      const updatedStatuses = statuses.map(group => {
        const groupUserId = normalizeId(group.user);
        const updatedStatuses = group.statuses.map(status => {
          const viewedKey = `${groupUserId}_${status.id}`;
          if (viewedSet.has(viewedKey)) {
            const viewers = Array.isArray(status.viewers) ? status.viewers : [];
            const alreadyViewed = viewers.some(v => normalizeId(v) === normalizeId(currentUserId));
            if (!alreadyViewed && currentUserId) {
              return { ...status, viewers: [...viewers, currentUserId], viewers_count: (status.viewers_count || 0) + 1 };
            }
          }
          return status;
        });
        return { ...group, statuses: updatedStatuses };
      });
      
      setGroupedStatuses((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(updatedStatuses)) {
          return updatedStatuses;
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
      // Load viewed statuses from persistent storage on mount
      const viewedSet = loadViewedStatuses();
      setViewedStatusIds(viewedSet);
      
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

  // ==================== UPDATED: handleViewersPress for specific status ====================
  const handleViewersPress = async (item) => {
    if (loadingViewers) return;
    
    try {
      setLoadingViewers(true);
      
      // Use the current status's viewers
      const viewers = Array.isArray(item.viewers) ? item.viewers : [];
      
      console.log('👁️ Viewers for status:', item.id, viewers);
      console.log('👁️ Viewers count:', item.viewers_count);
      
      if (!viewers || viewers.length === 0) {
        Alert.alert('No Viewers', 'No one has viewed this status yet.');
        setLoadingViewers(false);
        return;
      }
      
      const viewerPromises = viewers.map(async (viewerId) => {
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
          <Text style={[styles.viewerName, {}]}>
            {userData.name || userData.username || userData.phone || 'Unknown User'}
          </Text>
          {item.viewed_at && (
            <Text style={[styles.viewerTime, {  }]}>
              Seen {formatTime(item.viewed_at)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // ==================== UPDATED: renderStoryCircle with per-status viewing ====================
  const renderStoryCircle = (userStatus, isLive = false) => {
    const isMyStatus = isMyStatusGroup(userStatus.user);

    const imageUrl = getImageUrl(userStatus.statuses?.[0]?.media || userStatus.image || userStatus.broadcaster_image);
    const name = isMyStatus ? 'My Story' : (userStatus.user?.name || userStatus.broadcaster_name || userStatus.user || 'User');

    // Check if all statuses in this group are viewed
    const isFullyViewed = !isLive && !isMyStatus && isGroupFullyViewed(userStatus);

    // Ring color logic:
    // - Live: Red (pulsing)
    // - My Story: Red
    // - Fully Viewed by me: Gray
    // - Unviewed (default): Blue
    const ringColorStyle = isLive
      ? styles.storyRingLive
      : isMyStatus
      ? styles.storyRingMine
      : isFullyViewed
      ? styles.storyRingViewed
      : styles.storyRingUnseen;

    return (
      <TouchableOpacity 
        style={styles.storyWrapper} 
        onPress={() => {
          // If not my status and not live, mark all as viewed and move to end
          if (!isMyStatus && !isLive) {
            markGroupAsViewed(userStatus.user);
            
            // Move this group to the end of the list
            setGroupedStatuses(prev => {
              const updated = [...prev];
              const groupIndex = updated.findIndex(g => 
                normalizeId(g.user) === normalizeId(userStatus.user)
              );
              if (groupIndex > -1) {
                const [movedGroup] = updated.splice(groupIndex, 1);
                updated.push(movedGroup);
              }
              return updated;
            });
          }
          isLive ? handleLivePress(userStatus) : openImageModal(userStatus);
        }}
        activeOpacity={0.8}
      >
        <View style={styles.storyContainer}>
          <View style={[
            styles.storyRing,
            ringColorStyle,
          ]}>
            <Image
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.storyImage}
            />
            
            {/* Add Status Badge */}
            {isMyStatus && (
              <TouchableOpacity 
                style={styles.addStatusBadge}
                onPress={(e) => {
                  e.stopPropagation();
                  if (onAddStatusPress) {
                    onAddStatusPress();
                  } else {
                    setAddStatusModalVisible(true);
                  }
                }}
                activeOpacity={0.9}
              >
                <View style={styles.addStatusBadgeInner}>
                  <Icon name="add" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
            
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
          
          <Text style={styles.storyName} numberOfLines={1}>
            {name}
          </Text>
          
          {isLive && (
            <View style={styles.liveLabelContainer}>
              <Text style={styles.liveLabelText}>● LIVE</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Handle live press
  const handleLivePress = (stream) => {
    if (onLivePress) {
      onLivePress(stream);
    } else {
      navigation.navigate('Viewer', {
        roomName: 'match-123',
        streamId: 'stream-1',
        viewerId: 'viewer-1',
      });
    }
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

  // ==================== UPDATED: renderStatusItem with per-status viewers ====================
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
          
            {/* Close Button */}
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
                <Icon name="close" size={28} color="#fff" />
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
                  style={[
                    styles.quickReactionButton,
                    sendingReply && styles.quickReactionButtonDisabled
                  ]}
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

  const sortByTimeDesc = (a, b) => {
    const timeA = new Date(a.created_at || a.started_at);
    const timeB = new Date(b.created_at || b.started_at);
    return timeB - timeA;
  };

  const liveItems = liveStreams.map(stream => ({ ...stream, type: 'live' })).sort(sortByTimeDesc);

  // Get unviewed and viewed statuses using the persistent Set
  const unviewedStatuses = otherStatuses
    .filter(status => !isGroupFullyViewed(status))
    .map(status => ({ ...status, type: 'status' }))
    .sort(sortByTimeDesc);

  const viewedStatuses = otherStatuses
    .filter(status => isGroupFullyViewed(status))
    .map(status => ({ ...status, type: 'status' }))
    .sort(sortByTimeDesc);

  // Combine: Live first, then unviewed (blue), then viewed (gray)
  const combinedUpdates = [...liveItems, ...unviewedStatuses, ...viewedStatuses];

  const displayUpdates = maxItems ? combinedUpdates.slice(0, maxItems) : combinedUpdates;

  const handleScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentStatusIndex) {
      setCurrentStatusIndex(newIndex);
    }
  };

  // ==================== MAIN RENDER ====================
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Delete Modal */}
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

      {/* Snackbar */}
      {renderSnackbar()}

      {/* Main Content */}
      <View>
        {showTitle && (
          <Text style={[styles.sectionTitle, { fontWeight: '600', fontSize: 20 }]}>{title}</Text>
        )}
        
        {/* Horizontal Scroll with Multiple Items */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContainer}
        >
          {/* My Status */}
          {myStatus && (
            <View style={styles.horizontalItem}>
              {renderStoryCircle(myStatus, false)}
            </View>
          )}
          
          {/* Combined Stories */}
          {displayUpdates.map((item, index) => (
            <View key={`${item.type}-${item.id || index}`} style={styles.horizontalItem}>
              {item.type === 'live' 
                ? renderLiveStreamPreview(item) 
                : renderStatusPreview(item)}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Status Viewer Modal with Close Button */}
      <Modal 
        visible={modalVisible} 
        transparent={true} 
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentStatusIndex(0);
        }}
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

      {/* Viewers Modal */}
      <Modal
        visible={viewersModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => {
          setViewersModalVisible(false);
          setLoadingViewers(false);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setViewersModalVisible(false);
              setLoadingViewers(false);
            }}>
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

      {/* Reaction Modal */}
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

      {/* Comments Modal */}
      {renderCommentsModal()}

      {/* Reply Modal */}
      {renderReplyModal()}

      {/* Add Status Modal */}
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
          <SafeAreaView style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 0 : 20 }}>
            {/* Header with Close Button */}
            <View style={styles.addStatusHeaderContainer}>
              <TouchableOpacity 
                onPress={() => {
                  setAddStatusModalVisible(false);
                  setImage(null);
                  setCaption('');
                }}
                style={styles.addStatusCloseButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={28} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.addStatusModalTitle, { color: colors.text }]}>
                Add Status
              </Text>
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
              
              <View style={styles.addStatusButtonRow}>
                <TouchableOpacity
                  onPress={handlePostStatus}
                  disabled={!image || postingStatus}
                  style={[
                    styles.postButtonContainer, 
                    (!image || postingStatus) ? styles.postButtonDisabled : {},
                    { flex: 1 }
                  ]}
                >
                  {postingStatus ? (
                    <ActivityIndicator size="small" color="#0623ff" />
                  ) : (
                    <Text style={[styles.postButtonText, !image ? styles.postButtonTextDisabled : {}]}>
                      Post Status
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              
              {image && !postingStatus && (
                <TouchableOpacity onPress={handleSelectMedia} style={{ marginTop: 12, alignItems: 'center' }}>
                  <Text style={{ color: colors.primary }}>Change Media</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Background refresh indicator */}
      {backgroundRefreshing && (
        <View style={styles.backgroundRefreshIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.backgroundRefreshText}>Updating...</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors, isDark, insets, customStyles = {}) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    elevation: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginLeft: 16,
    marginBottom: 10,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  horizontalItem: {
    alignItems: 'center',
    marginHorizontal: 3,
  },
  storyWrapper: {
    alignItems: 'center',
  },
  storyContainer: {
    alignItems: 'center',
    width: 80,
  },
  storyRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyRingViewed: {
    borderWidth: 2.5,
    borderColor: '#C7C7CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  storyRingMine: {
    borderWidth: 3,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  storyRingLive: {
    borderWidth: 2.5,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  storyRingUnseen: {
    borderWidth: 2.5,
    borderColor: '#405DE6',
    shadowColor: '#405DE6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: '#fff',
    backgroundColor: '#e0e0e0',
  },
  addStatusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    zIndex: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#405DE6',
    shadowColor: '#405DE6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  addStatusBadgeInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#405DE6',
  },
  storyName: {
    fontSize: 12,
    color: colors.text,
    marginTop: 3,
    textAlign: 'center',
    fontFamily: 'SourceSansPro-Regular',
    maxWidth: 80,
  },
  liveBadgeContainer: {
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  liveBadgePulse: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  liveGlowRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: '#FF3B30',
    opacity: 0.4,
  },
  liveLabelText: {
    color: '#FF3B30',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyStoriesContainer: {
    padding: 20,
    minWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStoriesText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addStatusHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || 'rgba(0,0,0,0.1)',
    backgroundColor: colors.background,
  },
  addStatusCloseButton: {
    padding: 4,
  },
  addStatusModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'SourceSansPro-SemiBold',
  },
  addStatusButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  addStatusCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  addStatusCancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
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
    zIndex: 200,
    elevation: 200,
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
    zIndex: 201,
    elevation: 201,
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
    zIndex: 200,
    elevation: 200,
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
    color: colors.textTertiary,
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
  quickReactionButtonDisabled: {
    opacity: 0.5,
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
});

export default StatusSection;



