

// import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   Modal,
//   Image,
//   Platform,
//   Animated,
//   StatusBar,
//   RefreshControl,
//   ImageBackground,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Video from 'react-native-video';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Snackbar } from 'react-native-paper';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import Iconn from 'react-native-vector-icons/Ionicons';
// import BottomNav from '../components/BottomSocialNav';
// import Share from 'react-native-share';

// const { height, width } = Dimensions.get('window');
// const API_URL = `${API_ROUTE}`;
// const CACHE_KEY = 'cachedShorts';
// const COMMENTS_CACHE_KEY = 'cachedComments_';
// const CACHE_DURATION = 5 * 60 * 1000;
// const VIDEO_CACHE_PREFIX = 'video_cache_';

// // Get safe area insets
// const getBottomSafeArea = () => {
//   if (Platform.OS === 'ios') {
//     return 34;
//   }
//   return 16;
// };

// const BOTTOM_SAFE_AREA = getBottomSafeArea();

// const getBottomContentHeight = () => {
//   if (height < 700) return 80;
//   if (height < 800) return 100;
//   return 120;
// };

// const BOTTOM_CONTENT_HEIGHT = getBottomContentHeight();

// // Video Preloader Component
// const VideoPreloader = memo(({ uri, isVisible, onLoad, onError }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (!isVisible && videoRef.current) {
//       videoRef.current.seek(0);
//     }
//   }, [isVisible]);

//   if (!uri) return null;

//   return (
//     <Video
//       ref={videoRef}
//       source={{ 
//         uri,
//         headers: {
//           'Cache-Control': 'max-age=31536000, public',
//         }
//       }}
//       style={{ width: 0, height: 0 }}
//       paused={!isVisible}
//       muted={true}
//       resizeMode="cover"
//       onLoad={onLoad}
//       onError={onError}
//       bufferConfig={{
//         minBufferMs: 5000,
//         maxBufferMs: 15000,
//         bufferForPlaybackMs: 1000,
//         bufferForPlaybackAfterRebufferMs: 2000,
//       }}
//       ignoreSilentSwitch="ignore"
//     />
//   );
// });

// // Memoized Comment Item
// const MemoizedCommentItem = memo(({ cmt, onLongPress, onLike, likedComments, expandedReplies, onToggleReplies }) => {
//   const getCommentUser = (comment) => {
//     if (typeof comment.user === 'string') {
//       const username = comment.user.split('@')[0];
//       return {
//         username: username,
//         profile_picture: null
//       };
//     }
    
//     if (comment.user && !comment.user.username) {
//       return {
//         username: comment.user.email ? comment.user.email.split('@')[0] : 'Unknown',
//         profile_picture: comment.user.profile_picture || null
//       };
//     }
    
//     return comment.user || { username: 'Unknown', profile_picture: null };
//   };

//   const commentUser = getCommentUser(cmt);
//   const profilePictureUrl = commentUser.profile_picture 
//     ? (commentUser.profile_picture.startsWith('http') 
//         ? commentUser.profile_picture 
//         : `${API_ROUTE_IMAGE}${commentUser.profile_picture}`)
//     : null;

//   return (
//     <TouchableOpacity
//       style={styles.commentContainer}
//       onPress={onLongPress}
//       delayLongPress={500}
//     >
//       <View style={styles.commentHeader}>
//         <View style={styles.commentUserContainer}>
//           <TouchableOpacity>
//             <Image
//               source={{
//                 uri: profilePictureUrl,
//                 cache: 'force-cache'
//               }}
//               defaultSource={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//               style={styles.commentAvatar}
//             />
//           </TouchableOpacity>
          
//           <View>
//             <Text style={styles.commentUser}>
//               {cmt.name ? `@${commentUser.name}` : `@${commentUser.username}`}
//             </Text>
//             <Text style={styles.commentTime}>
//               {new Date(cmt.created_at).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.commentActions}>
//           <TouchableOpacity
//             onPress={() => onLike(cmt.id)}
//             style={styles.commentLikeBtn}
//           >
//             <Ionicons
//               name={likedComments[cmt.id] ? 'heart' : 'heart-outline'}
//               size={18}
//               color={likedComments[cmt.id] ? '#DC143C' : '#666'}
//             />
//             <Text style={styles.commentLikeCount}>
//               {cmt.likes_count || 0}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <Text style={styles.commentText}>{cmt.text}</Text>

//       {cmt.replies && cmt.replies.length > 0 && (
//         <TouchableOpacity
//           onPress={() => onToggleReplies(cmt.id)}
//           style={styles.viewRepliesBtn}
//         >
//           <Text style={styles.viewRepliesText}>
//             {expandedReplies[cmt.id] 
//               ? 'Hide replies' 
//               : `View ${cmt.replies.length} ${cmt.replies.length === 1 ? 'reply' : 'replies'}`}
//           </Text>
//         </TouchableOpacity>
//       )}

//       {expandedReplies[cmt.id] && cmt.replies && cmt.replies.map((reply) => {
//         const replyUser = getCommentUser(reply);
//         const replyProfilePictureUrl = replyUser.profile_picture 
//           ? (replyUser.profile_picture.startsWith('http') 
//               ? replyUser.profile_picture 
//               : `${API_ROUTE_IMAGE}${replyUser.profile_picture}`)
//           : null;

//         return (
//           <View key={reply.id} style={styles.replyContainer}>
//             <View style={styles.replyHeader}>
//               <View style={styles.replyUserContainer}>
//                 <Image
//                   source={{
//                     uri: replyProfilePictureUrl,
//                     cache: 'force-cache'
//                   }}
//                   defaultSource={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//                   style={styles.replyAvatar}
//                 />
//                 <Text style={styles.replyUser}>@{replyUser.name}</Text>
//               </View>
//               <Text style={styles.replyTime}>
//                 {new Date(reply.created_at).toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}
//               </Text>
//             </View>
//             <Text style={styles.replyText}>{reply.text}</Text>
//           </View>
//         );
//       })}
//     </TouchableOpacity>
//   );
// });

// const ShortFeedScreen = ({ navigation, route }) => {
//   const [shorts, setShorts] = useState([]);
//   const [filteredShorts, setFilteredShorts] = useState([]);
//   const [commentText, setCommentText] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [pausedVideos, setPausedVideos] = useState({});
//   const [isReplyBottomSheetVisible, setBottomSheetVisible] = useState(false);
//   const [selectedShort, setSelectedShort] = useState(null);
//   const [selectedCommentId, setSelectedCommentId] = useState(null);
//   const [expandedReplies, setExpandedReplies] = useState({});
//   const [activeTab, setActiveTab] = useState('forYou');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearchModalVisible, setSearchModalVisible] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [newShortAdded, setNewShortAdded] = useState(false);
//   const [isMoreOptionsVisible, setMoreOptionsVisible] = useState(false);
//   const [selectedShortForOptions, setSelectedShortForOptions] = useState(null);
//   const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [commentToDelete, setCommentToDelete] = useState(null);
//   const flatListRef = useRef();
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [showPlayIcon, setShowPlayIcon] = useState({});
//   const [likedComments, setLikedComments] = useState({});
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnimEmpty = useRef(new Animated.Value(0)).current;
//   const scaleAnimEmpty = useRef(new Animated.Value(0.8)).current;

//   const [commentPage, setCommentPage] = useState(1);
//   const [hasMoreComments, setHasMoreComments] = useState(true);
//   const [typedText, setTypedText] = useState('');

//   // Video optimization states
//   const [preloadedVideos, setPreloadedVideos] = useState({});
//   const [bufferedVideos, setBufferedVideos] = useState({});
//   const [videoLoadTimes, setVideoLoadTimes] = useState({});
//   const videoRefs = useRef({});

//   const fullText = activeTab === 'following'
//     ? 'Follow some creators to see their videos!'
//     : 'Discover amazing shorts! Loading short...';

//   // Typing animation effect
//   useEffect(() => {
//     setTypedText('');
//     let i = 0;
//     const interval = setInterval(() => {
//       if (i < fullText.length) {
//         setTypedText((prev) => prev + fullText[i]);
//         i++;
//       } else {
//         clearInterval(interval);
//         setTimeout(() => {
//           setTypedText('');
//           i = 0;
//         }, 2000);
//       }
//     }, 100);
//     return () => clearInterval(interval);
//   }, [fullText, activeTab]);

//   // Animation for empty state
//   useEffect(() => {
//     if (filteredShorts.length === 0) {
//       fadeAnimEmpty.setValue(0);
//       scaleAnimEmpty.setValue(0.8);
//       Animated.parallel([
//         Animated.timing(fadeAnimEmpty, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnimEmpty, {
//           toValue: 1,
//           tension: 50,
//           friction: 5,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [filteredShorts.length]);

//   // Animation for buttons
//   const animateButtons = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Pause current video
//   const pauseCurrentVideo = () => {
//     if (currentIndex !== null && filteredShorts.length > 0) {
//       setPausedVideos(prev => ({
//         ...prev,
//         [currentIndex]: true,
//       }));
//       setShowPlayIcon(prev => ({
//         ...prev,
//         [currentIndex]: true,
//       }));
//     }
//   };

//   // Listen for new short from upload screen
//   useEffect(() => {
//     if (route.params?.newShort) {
//       setSnackbarMessage('Short uploaded successfully!');
//       setSnackbarVisible(true);
//       setNewShortAdded(true);
//       fetchShorts(true);
//     }
//   }, [route.params?.newShort]);

//   // Clear video cache on mount
//   useEffect(() => {
//     const clearVideoCache = async () => {
//       try {
//         const cacheKeys = await AsyncStorage.getAllKeys();
//         const videoCacheKeys = cacheKeys.filter(key => key.startsWith(VIDEO_CACHE_PREFIX));
//         if (videoCacheKeys.length > 0) {
//           await AsyncStorage.multiRemove(videoCacheKeys);
//         }
//       } catch (error) {
//         console.log('Error clearing video cache:', error);
//       }
//     };
    
//     clearVideoCache();
//   }, []);

//   // Helper functions
//   const getAuthHeader = async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) throw new Error('No access token found');
//     return {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//   };

//   const getCurrentUser = async () => {
//     const json = await AsyncStorage.getItem('userData');
//     const parsed = json ? JSON.parse(json) : null;
//     return parsed?.username || 'CurrentUser';
//   };

//   const getCachedShorts = async () => {
//     try {
//       const cached = await AsyncStorage.getItem(CACHE_KEY);
//       if (cached) {
//         const { data, timestamp } = JSON.parse(cached);
//         if (Date.now() - timestamp < CACHE_DURATION) {
//           return data;
//         }
//       }
//       return null;
//     } catch (error) {
//       console.error('Error reading cache:', error);
//       return null;
//     }
//   };

//   const setCachedShorts = async (data) => {
//     try {
//       await AsyncStorage.setItem(
//         CACHE_KEY,
//         JSON.stringify({ data, timestamp: Date.now() })
//       );
//     } catch (error) {
//       console.error('Error saving cache:', error);
//     }
//   };

//   const getCachedComments = async (shortId) => {
//     try {
//       const cached = await AsyncStorage.getItem(`${COMMENTS_CACHE_KEY}${shortId}`);
//       if (cached) {
//         const { data, timestamp } = JSON.parse(cached);
//         if (Date.now() - timestamp < CACHE_DURATION) {
//           return data;
//         }
//       }
//       return null;
//     } catch (error) {
//       console.error('Error reading comments cache:', error);
//       return null;
//     }
//   };

//   const setCachedComments = async (shortId, data) => {
//     try {
//       await AsyncStorage.setItem(
//         `${COMMENTS_CACHE_KEY}${shortId}`,
//         JSON.stringify({ data, timestamp: Date.now() })
//       );
//     } catch (error) {
//       console.error('Error saving comments cache:', error);
//     }
//   };

//   // Video optimization functions
//   const getVideoThumbnail = (videoUrl) => {
//     if (!videoUrl) return null;
//     // Return the video URL as thumbnail for now
//     return videoUrl;
//   };

//   const preloadVideos = useCallback((videos) => {
//     videos.forEach((video) => {
//       if (video?.video && !preloadedVideos[video.id]) {
//         setPreloadedVideos(prev => ({
//           ...prev,
//           [video.id]: true,
//         }));
//       }
//     });
//   }, [preloadedVideos]);

//   const handleVideoLoad = useCallback((videoId) => {
//     const loadTime = Date.now();
//     setVideoLoadTimes(prev => ({
//       ...prev,
//       [videoId]: loadTime,
//     }));
//     setBufferedVideos(prev => ({
//       ...prev,
//       [videoId]: true,
//     }));
//   }, []);

//   const handleVideoError = useCallback((videoId, error) => {
//     console.log(`Video ${videoId} error:`, error);
//     // You can implement retry logic here if needed
//   }, []);

//   const getBufferConfig = useCallback(() => ({
//     minBufferMs: Platform.OS === 'ios' ? 5000 : 10000,
//     maxBufferMs: Platform.OS === 'ios' ? 15000 : 20000,
//     bufferForPlaybackMs: Platform.OS === 'ios' ? 1000 : 1500,
//     bufferForPlaybackAfterRebufferMs: Platform.OS === 'ios' ? 2000 : 3000,
//   }), []);

//   // Optimized fetchShorts with instant cache load
//   const fetchShorts = useCallback(async (forceRefresh = false) => {
//     try {
//       // Always load cache first for instant display
//       const cachedShorts = await getCachedShorts();
//       if (cachedShorts) {
//         let processedShorts = cachedShorts;
//         if (activeTab === 'forYou') {
//           processedShorts = cachedShorts
//             .filter(short => !short.is_following)
//             .sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//         } else {
//           processedShorts = cachedShorts.filter(short => short.is_following);
//         }
//         setShorts(processedShorts);
//         setFilteredShorts(processedShorts);
//         initializeVideoStates(processedShorts);
//       }

//       // If force refresh, or background update, fetch from server
//       const headers = await getAuthHeader();
//       const endpoint = activeTab === 'following' ? '/shorts/following/' : '/shorts/';
//       const response = await axios.get(`${API_URL}${endpoint}`, { headers });

//       if (response.status === 200) {
//         let processedShorts = response.data.map(short => ({
//           ...short,
//           video: short.video?.replace(/\/\//g, '/').replace(':/', '://'),
//           video_thumbnail: short.video_thumbnail || getVideoThumbnail(short.video),
//         }));

//         if (activeTab === 'forYou') {
//           processedShorts = processedShorts
//             .filter(short => !short.is_following)
//             .sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//         } else {
//           processedShorts = processedShorts.filter(short => short.is_following);
//         }

//         setShorts(processedShorts);
//         setFilteredShorts(processedShorts);
//         initializeVideoStates(processedShorts);
//         await setCachedShorts(response.data);
        
//         // Preload first few videos
//         preloadVideos(processedShorts.slice(0, 3));
//       }
//     } catch (error) {
//       console.error('Fetch Shorts Error:', error);
//       if (error.response?.status === 404 && activeTab === 'following') {
//         Alert.alert('No videos', "You're not following anyone or they haven't posted any shorts yet.");
//         setShorts([]);
//         setFilteredShorts([]);
//       }
//     } finally {
//       setRefreshing(false);
//     }
//   }, [activeTab]);

//   const initializeVideoStates = (data) => {
//     const initialPausedState = {};
//     const initialPlayIconState = {};
//     data.forEach((_, index) => {
//       initialPausedState[index] = index !== 0;
//       initialPlayIconState[index] = false;
//     });
//     setPausedVideos(initialPausedState);
//     setShowPlayIcon(initialPlayIconState);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchShorts(true);
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === '') {
//       setFilteredShorts(shorts);
//     } else {
//       const filtered = shorts.filter(short => 
//         short.caption.toLowerCase().includes(query.toLowerCase()) ||
//         short.user.username.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredShorts(filtered);
//     }
//   };

//   const handleSearchItemPress = (item) => {
//     setSearchModalVisible(false);
//     setSearchQuery('');
//     const index = shorts.findIndex(short => short.id === item.id);
//     if (index !== -1 && flatListRef.current) {
//       flatListRef.current.scrollToIndex({
//         index,
//         animated: true,
//       });
//     }
//   };

//   const likeComment = async (commentId) => {
//     try {
//       const headers = await getAuthHeader();
      
//       // Optimistic update
//       setLikedComments(prev => ({
//         ...prev,
//         [commentId]: !prev[commentId]
//       }));
      
//       setSelectedShort(prev => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           comments: prev.comments.map(comment => {
//             if (comment.id === commentId) {
//               return {
//                 ...comment,
//                 is_liked: !comment.is_liked,
//                 likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
//               };
//             }
//             return comment;
//           })
//         };
//       });

//       setShorts(prev => prev.map(short => ({
//         ...short,
//         comments: (short.comments || []).map(comment => {
//           if (comment.id === commentId) {
//             return {
//               ...comment,
//               is_liked: !comment.is_liked,
//               likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
//             };
//           }
//           return comment;
//         })
//       })));

//       setFilteredShorts(prev => prev.map(short => ({
//         ...short,
//         comments: (short.comments || []).map(comment => {
//           if (comment.id === commentId) {
//             return {
//               ...comment,
//               is_liked: !comment.is_liked,
//               likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
//             };
//           }
//           return comment;
//         })
//       })));

//       await axios.post(`${API_URL}/shorts/comments/${commentId}/like/`, {}, { headers });
//       await setCachedComments(selectedShort.id, selectedShort.comments);
//     } catch (error) {
//       console.error('Comment Like Error:', error.response?.data || error.message);
      
//       // Revert optimistic update
//       setLikedComments(prev => ({
//         ...prev,
//         [commentId]: !prev[commentId]
//       }));
      
//       setSelectedShort(prev => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           comments: prev.comments.map(comment => {
//             if (comment.id === commentId) {
//               return {
//                 ...comment,
//                 is_liked: !comment.is_liked,
//                 likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
//               };
//             }
//             return comment;
//           })
//         };
//       });

//       Alert.alert('Error', 'Failed to like/unlike comment');
//     }
//   };

//   const deleteComment = async (commentId) => {
//     try {
//       const headers = await getAuthHeader();
      
//       // Optimistic update
//       setSelectedShort(prev => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           comments: prev.comments.filter(comment => comment.id !== commentId),
//           comment_count: (prev.comment_count || 0) - 1
//         };
//       });

//       setShorts(prev => prev.map(short => ({
//         ...short,
//         comments: (short.comments || []).filter(comment => comment.id !== commentId),
//         comment_count: (short.comment_count || 0) - 1
//       })));

//       setFilteredShorts(prev => prev.map(short => ({
//         ...short,
//         comments: (short.comments || []).filter(comment => comment.id !== commentId),
//         comment_count: (short.comment_count || 0) - 1
//       })));

//       await axios.delete(`${API_URL}/shorts/comments/${commentId}/delete/`, { headers });
      
//       setSnackbarMessage('Comment deleted successfully!');
//       setSnackbarVisible(true);
//       setDeleteModalVisible(false);
//       setCommentToDelete(null);
//       await setCachedComments(selectedShort.id, selectedShort.comments);
//     } catch (error) {
//       console.error('Delete Comment Error:', error.response?.data || error.message);
      
//       // Revert optimistic update by refetching comments
//       if (selectedShort?.id) {
//         await fetchCommentsForShort(selectedShort.id, false);
//       }
      
//       Alert.alert('Error', 'Failed to delete comment');
//       setDeleteModalVisible(false);
//       setCommentToDelete(null);
//     }
//   };

//   const followUser = async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         Alert.alert('Error', 'Please login to follow users');
//         return;
//       }

//       // Find the current follow state for this user
//       const currentShort = shorts.find(short => short.user.id === userId);
//       const isCurrentlyFollowing = currentShort?.is_following || false;

//       // Optimistic update - toggle the follow state
//       setShorts(prevShorts => 
//         prevShorts.map(short => 
//           short.user.id === userId 
//             ? { 
//                 ...short, 
//                 is_following: !isCurrentlyFollowing 
//               } 
//             : short
//         )
//       );
//       setFilteredShorts(prevShorts => 
//         prevShorts.map(short => 
//           short.user.id === userId 
//             ? { 
//                 ...short, 
//                 is_following: !isCurrentlyFollowing 
//               } 
//             : short
//         )
//       );

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       if (isCurrentlyFollowing) {
//         await axios.delete(
//           `${API_ROUTE}/unfollow-user/${userId}/`,
//           { headers }
//         );
//       } else {
//         await axios.post(
//           `${API_ROUTE}/follow-user/${userId}/`,
//           {},
//           { headers }
//         );
//       }

//       setSnackbarMessage(isCurrentlyFollowing ? 'Unfollowed successfully!' : 'Followed successfully!');
//       setSnackbarVisible(true);
      
//       // Refresh the feed to reflect changes
//       fetchShorts(true);
      
//     } catch (error) {
//       console.error('Error following/unfollowing user:', error);
//       console.error('Error response:', error.response?.data);
      
//       // Revert optimistic update on error
//       const currentShortState = shorts.find(short => short.user.id === userId);
//       const originalFollowState = currentShortState?.is_following || false;
      
//       setShorts(prevShorts => 
//         prevShorts.map(short => 
//           short.user.id === userId 
//             ? { 
//                 ...short, 
//                 is_following: originalFollowState 
//               } 
//             : short
//         )
//       );
//       setFilteredShorts(prevShorts => 
//         prevShorts.map(short => 
//           short.user.id === userId 
//             ? { 
//                 ...short, 
//                 is_following: originalFollowState 
//               } 
//             : short
//         )
//       );
      
//       // Show appropriate error message
//       if (error.response?.status === 404) {
//         Alert.alert('Error', 'Follow feature is currently unavailable. Please try again later.');
//       } else if (error.response?.status === 401) {
//         Alert.alert('Error', 'Please login again to continue.');
//       } else {
//         Alert.alert('Error', `Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`);
//       }
//     }
//   };

//   const likeShort = async (id) => {
//     try {
//       setShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 is_liked: !short.is_liked,
//                 like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
//               }
//             : short
//         )
//       );
//       setFilteredShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 is_liked: !short.is_liked,
//                 like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
//               }
//             : short
//         )
//       );

//       const headers = await getAuthHeader();
//       await axios.post(`${API_URL}/shorts/${id}/like/`, {}, { headers });
//       fetchShorts(true);
//     } catch (error) {
//       setShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 is_liked: !short.is_liked,
//                 like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
//               }
//             : short
//         )
//       );
//       setFilteredShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 is_liked: !short.is_liked,
//                 like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
//               }
//             : short
//         )
//       );
//       console.error('Like Error:', error.response?.data || error.message);
//       Alert.alert('Error', 'Failed to like/unlike video');
//     }
//   };

//   const getCommentUser = (comment) => {
//     if (typeof comment.user === 'string') {
//       const username = comment.user.split('@')[0];
//       return {
//         username: username,
//         profile_picture: null
//       };
//     }
    
//     if (comment.user && !comment.user.username) {
//       return {
//         username: comment.user.email ? comment.user.email.split('@')[0] : 'Unknown',
//         profile_picture: comment.user.profile_picture || null
//       };
//     }
    
//     return comment.user || { username: 'Unknown', profile_picture: null };
//   };

//  // Optimized fetchCommentsForShort with instant cache and correct endpoint
// const fetchCommentsForShort = useCallback(async (shortId, page = 1, showLoading = true, isLoadMore = false) => {
//   try {
//     // Load cached comments first for instant display
//     if (page === 1) {
//       const cachedComments = await getCachedComments(shortId);
//       if (cachedComments && Array.isArray(cachedComments)) {
//         const newLikedComments = {};
//         cachedComments.forEach(comment => {
//           newLikedComments[comment.id] = comment.is_liked || false;
//         });
//         setLikedComments(newLikedComments);
        
//         setSelectedShort(prev => {
//           if (!prev || prev.id !== shortId) return prev;
//           return {
//             ...prev,
//             comments: cachedComments,
//             comment_count: cachedComments.length
//           };
//         });
//       }
//     }

//     const headers = await getAuthHeader();
    
//     // CORRECT ENDPOINT: Based on your URL patterns, it should be /shorts/<id>/comments/
//     const response = await axios.get(
//       `${API_URL}/shorts/${shortId}/comments/?page=${page}&page_size=20`,
//       { headers, timeout: 10000 }
//     );
    
//     if (response.status === 200) {
//       // Handle both paginated and non-paginated responses
//       let newComments = [];
//       let totalCount = 0;
      
//       if (response.data.results && Array.isArray(response.data.results)) {
//         newComments = response.data.results;
//         totalCount = response.data.count || newComments.length;
//         setHasMoreComments(!!response.data.next);
//         setCommentPage(page + 1);
//       } else if (Array.isArray(response.data)) {
//         newComments = response.data;
//         totalCount = newComments.length;
//         setHasMoreComments(false);
//       } else {
//         console.warn('Unexpected comments response format:', response.data);
//         newComments = [];
//         totalCount = 0;
//         setHasMoreComments(false);
//       }
      
//       setSelectedShort(prev => {
//         if (!prev || prev.id !== shortId) return prev;
//         return {
//           ...prev,
//           comments: page === 1 ? newComments : [...(prev.comments || []), ...newComments],
//           comment_count: totalCount
//         };
//       });
      
//       // Cache the first page
//       if (page === 1 && newComments.length > 0) {
//         await setCachedComments(shortId, newComments);
//       }
//     }
//   } catch (error) {
//     console.error('Fetch Comments Error:', error.message);
    
//     // If the endpoint fails, try alternative endpoint structure
//     try {
//       console.log('Trying alternative endpoint...');
//       const altResponse = await axios.get(
//         `${API_URL}/shorts/comments/?short=${shortId}&page=${page}&page_size=20`,
//         { headers, timeout: 10000 }
//       );
      
//       if (altResponse.status === 200) {
//         let newComments = [];
//         if (altResponse.data.results && Array.isArray(altResponse.data.results)) {
//           newComments = altResponse.data.results;
//         } else if (Array.isArray(altResponse.data)) {
//           newComments = altResponse.data;
//         }
        
//         setSelectedShort(prev => {
//           if (!prev || prev.id !== shortId) return prev;
//           return {
//             ...prev,
//             comments: page === 1 ? newComments : [...(prev.comments || []), ...newComments],
//             comment_count: newComments.length
//           };
//         });
        
//         setHasMoreComments(!!altResponse.data.next);
//         setCommentPage(page + 1);
//       }
//     } catch (altError) {
//       console.error('Alternative endpoint also failed:', altError.message);
//       if (page === 1 && showLoading) {
//         Alert.alert('Info', 'Comments feature is being set up. Please try again later.');
//       }
//     }
//   }
// }, []);

//   const commentShort = async (id, text) => {
//     try {
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;
//       const username = parsed?.name || 'User';
      
//       const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
//       const tempComment = {
//         id: tempId,
//         user: username,
//         text: text,
//         created_at: new Date().toISOString(),
//         replies: [],
//         is_liked: false,
//         likes_count: 0,
//       };

//       setShorts(prev => prev?.map(short =>
//         short.id === id
//           ? {
//               ...short,
//               comments: [...(short.comments || []), tempComment],
//               comment_count: (short.comment_count || 0) + 1,
//             }
//           : short
//       ) || []);

//       setFilteredShorts(prev => prev?.map(short =>
//         short.id === id
//           ? {
//               ...short,
//               comments: [...(short.comments || []), tempComment],
//               comment_count: (short.comment_count || 0) + 1,
//             }
//           : short
//       ) || []);

//       if (selectedShort?.id === id) {
//         setSelectedShort(prev => ({
//           ...prev,
//           comments: [...(prev?.comments || []), tempComment],
//           comment_count: (prev?.comment_count || 0) + 1,
//         }));
//       }

//       setCommentText('');

//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_URL}/shorts/${id}/comment/`, {text}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.data && response.data.id) {
//         setShorts(prev => prev?.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 comments: short.comments?.map(comment => 
//                   comment.id === tempId ? response.data : comment
//                 ) || [],
//               }
//             : short
//         ) || []);

//         setFilteredShorts(prev => prev?.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 comments: short.comments?.map(comment => 
//                   comment.id === tempId ? response.data : comment
//                 ) || [],
//               }
//             : short
//         ) || []);

//         if (selectedShort?.id === id) {
//           setSelectedShort(prev => ({
//             ...prev,
//             comments: prev.comments?.map(comment => 
//               comment.id === tempId ? response.data : comment
//             ) || [],
//           }));
//         }
//         await setCachedComments(id, selectedShort?.id === id ? selectedShort.comments : [...(shorts.find(s => s.id === id)?.comments || []), response.data]);
//       }
//     } catch (error) {
//       console.error('Comment Error:', error.response?.data || error.message);
//       // Revert optimistic update
//       setShorts(prev => prev?.map(short =>
//         short.id === id
//           ? {
//               ...short,
//               comments: (short.comments || []).filter(comment => comment.id !== tempId),
//               comment_count: (short.comment_count || 0) - 1,
//             }
//           : short
//       ) || []);

//       setFilteredShorts(prev => prev?.map(short =>
//         short.id === id
//           ? {
//               ...short,
//               comments: (short.comments || []).filter(comment => comment.id !== tempId),
//               comment_count: (short.comment_count || 0) - 1,
//             }
//           : short
//       ) || []);

//       if (selectedShort?.id === id) {
//         setSelectedShort(prev => ({
//           ...prev,
//           comments: (prev.comments || []).filter(comment => comment.id !== tempId),
//           comment_count: (prev.comment_count || 0) - 1,
//         }));
//       }
      
//       Alert.alert('Error', 'Failed to post comment');
//     }
//   };

//   const replyComment = async (commentId, text) => {
//     try {
//       const headers = await getAuthHeader();
//       const username = await getCurrentUser();
//       const tempReply = {
//         id: `temp-${Date.now()}`,
//         user: username,
//         text,
//         created_at: new Date().toISOString(),
//         is_liked: false,
//         likes_count: 0,
//       };

//       setShorts((prevShorts) =>
//         prevShorts.map((short) =>
//           short.id === selectedShort.id
//             ? {
//                 ...short,
//                 comments: (short.comments || []).map((cmt) =>
//                   cmt.id === commentId
//                     ? { 
//                         ...cmt, 
//                         replies: [...(cmt.replies || []), tempReply] 
//                       }
//                     : cmt
//                 ),
//               }
//             : short
//         )
//       );

//       setFilteredShorts((prevShorts) =>
//         prevShorts.map((short) =>
//           short.id === selectedShort.id
//             ? {
//                 ...short,
//                 comments: (short.comments || []).map((cmt) =>
//                   cmt.id === commentId
//                     ? { 
//                         ...cmt, 
//                         replies: [...(cmt.replies || []), tempReply] 
//                       }
//                     : cmt
//                 ),
//               }
//             : short
//         )
//       );

//       if (selectedShort) {
//         setSelectedShort((prev) => ({
//           ...prev,
//           comments: (prev.comments || []).map((cmt) =>
//             cmt.id === commentId
//               ? { 
//                   ...cmt, 
//                   replies: [...(cmt.replies || []), tempReply] 
//                 }
//               : cmt
//           ),
//         }));
//       }

//       setCommentText('');
//       setSelectedCommentId(null);

//       const response = await axios.post(
//         `${API_URL}shorts/${selectedShort.id}/comment/`,
//         {
//           text,
//           parent: commentId,
//         },
//         { headers }
//       );

//       if (response.data && response.data.id) {
//         setShorts((prevShorts) =>
//           prevShorts.map((short) =>
//             short.id === selectedShort.id
//               ? {
//                   ...short,
//                   comments: (short.comments || []).map((cmt) =>
//                     cmt.id === commentId
//                       ? {
//                           ...cmt,
//                           replies: (cmt.replies || []).map((reply) =>
//                             reply.id === tempReply.id ? response.data : reply
//                           ),
//                         }
//                       : cmt
//                   ),
//                 }
//               : short
//           )
//         );

//         setFilteredShorts((prevShorts) =>
//           prevShorts.map((short) =>
//             short.id === selectedShort.id
//               ? {
//                   ...short,
//                   comments: (short.comments || []).map((cmt) =>
//                     cmt.id === commentId
//                       ? {
//                           ...cmt,
//                           replies: (cmt.replies || []).map((reply) =>
//                             reply.id === tempReply.id ? response.data : reply
//                           ),
//                         }
//                       : cmt
//                   ),
//                 }
//               : short
//           )
//         );

//         if (selectedShort) {
//           setSelectedShort((prev) => ({
//             ...prev,
//             comments: (prev.comments || []).map((cmt) =>
//               cmt.id === commentId
//                 ? {
//                     ...cmt,
//                     replies: (cmt.replies || []).map((reply) =>
//                       reply.id === tempReply.id ? response.data : reply
//                     ),
//                   }
//                 : cmt
//             ),
//           }));
//         }
//         await setCachedComments(selectedShort.id, selectedShort.comments);
//       }
//     } catch (error) {
//       console.error('Reply Error:', error.response?.data || error.message);
      
//       // Revert optimistic update
//       setShorts((prevShorts) =>
//         prevShorts.map((short) =>
//           short.id === selectedShort.id
//             ? {
//                 ...short,
//                 comments: (short.comments || []).map((cmt) =>
//                   cmt.id === commentId
//                     ? {
//                         ...cmt,
//                         replies: (cmt.replies || []).filter(
//                           (reply) => reply.id !== tempReply.id
//                         ),
//                       }
//                     : cmt
//                 ),
//               }
//             : short
//         )
//       );

//       setFilteredShorts((prevShorts) =>
//         prevShorts.map((short) =>
//           short.id === selectedShort.id
//             ? {
//                 ...short,
//                 comments: (short.comments || []).map((cmt) =>
//                   cmt.id === commentId
//                     ? {
//                         ...cmt,
//                         replies: (cmt.replies || []).filter(
//                           (reply) => reply.id !== tempReply.id
//                         ),
//                       }
//                     : cmt
//                 ),
//               }
//             : short
//         )
//       );

//       if (selectedShort) {
//         setSelectedShort((prev) => ({
//           ...prev,
//           comments: (prev.comments || []).map((cmt) =>
//             cmt.id === commentId
//               ? {
//                   ...cmt,
//                   replies: (cmt.replies || []).filter(
//                     (reply) => reply.id !== tempReply.id
//                   ),
//                 }
//               : cmt
//           ),
//         }));
//       }
      
//       Alert.alert('Error', 'Failed to post reply');
//     }
//   };

//   const reportShort = async (id) => {
//     try {
//       const headers = await getAuthHeader();
//       await axios.post(`${API_URL}shorts/${id}/report/`, {}, { headers });
//       setSnackbarMessage('Post reported successfully!');
//       setSnackbarVisible(true);
//       setMoreOptionsVisible(false);
//     } catch (error) {
//       console.error('Report Error:', error.response?.data || error.message);
//       Alert.alert('Error', 'Failed to report post');
//     }
//   };

//   const copyLink = (url) => {
//     setSnackbarMessage('Link copied to clipboard!');
//     setSnackbarVisible(true);
//     setMoreOptionsVisible(false);
//   };

//   const shareShort = async (id, url, caption) => {
//     try {
//       const shareOptions = {
//         title: 'Check out this video!',
//         message: `${caption}\nWatch it here: ${url}`,
//         url: url,
//       };

//       await Share.open(shareOptions);
      
//       const headers = await getAuthHeader();
//       await axios.post(`${API_URL}shorts/${id}/share/`, { shared_to: 'WhatsApp' }, { headers });
      
//       setSnackbarMessage('Shared successfully!');
//       setSnackbarVisible(true);
//     } catch (error) {
//       if (error.message !== 'User did not share') {
//         console.error('Share Error:', error.message);
//         Alert.alert('Error', 'Failed to share video');
//       }
//     }
//   };

//   // Twitter-like initialization: Load cache immediately, fetch in background
//   useEffect(() => {
//     // Load cache for instant display
//     fetchShorts(false);
    
//     // Fetch fresh data in background
//     fetchShorts(true);
    
//     animateButtons();
//   }, [activeTab]);

//   // Preload videos when data changes
//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       // Preload current and next 2 videos
//       const videosToPreload = filteredShorts.slice(
//         Math.max(0, currentIndex - 1),
//         Math.min(filteredShorts.length, currentIndex + 3)
//       );
//       preloadVideos(videosToPreload);
//     }
//   }, [filteredShorts, currentIndex]);

//   // Clean up video refs on unmount
//   useEffect(() => {
//     return () => {
//       Object.values(videoRefs.current).forEach(ref => {
//         if (ref) {
//           ref.seek(0);
//         }
//       });
//     };
//   }, []);

//   // Memoized data
//   const combinedShorts = React.useMemo(() => {
//     if (activeTab === 'forYou') {
//       return shorts.filter(short => !short.is_following).sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//     } else {
//       return shorts.filter(short => short.is_following);
//     }
//   }, [shorts, activeTab]);

//   // UI Components
//   const renderNavBar = () => (
//     <View style={[
//       styles.navBar,
//       Platform.OS === 'ios' && styles.navBarIOS
//     ]}>
//       <View style={styles.tabsContainer}>
//         <TouchableOpacity 
//           style={[styles.navItem, activeTab === 'forYou' && styles.activeNavItem]}
//           onPress={() => setActiveTab('forYou')}
//         >
//           <Text style={[styles.navText, activeTab === 'forYou' && styles.activeNavText]}>For You</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.navItem, activeTab === 'following' && styles.activeNavItem]}
//           onPress={() => setActiveTab('following')}
//         >
//           <Text style={[styles.navText, activeTab === 'following' && styles.activeNavText]}>Following</Text>
//         </TouchableOpacity>
//       </View>
      
//       <TouchableOpacity 
//         style={styles.searchIconContainer}
//         onPress={() => {
//           pauseCurrentVideo();
//           setSearchModalVisible(true);
//         }}
//       >
//         <Icon name="search" size={24} color="#fff" />
//       </TouchableOpacity>
//       <TouchableOpacity 
//         style={styles.searchIconContainer}
//         onPress={() => navigation.navigate('UploadshortVideo')}
//       >
//         <Icon name="plus" size={28} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );

//   // Optimized renderItem
//   const renderItem = useCallback(({ item, index }) => {
//     const isCurrent = index === currentIndex;
//     const isPaused = pausedVideos[index] || false;
//     const shouldShowPlayIcon = showPlayIcon[index] || false;
//     const isBuffered = bufferedVideos[item.id] || false;

//     const toggleVideoPause = () => {
//       if (isCurrent) {
//         setPausedVideos(prev => ({
//           ...prev,
//           [index]: !prev[index],
//         }));

//         setShowPlayIcon(prev => ({
//           ...prev,
//           [index]: !prev[index],
//         }));
//       }
//     };
  
//     return (
//       <View
//         style={styles.card}
//         onStartShouldSetResponder={(e) => {
//           const touched = e.nativeEvent.target;
//           if (
//             ['HEART', 'SHARE', 'COMMENT', 'MORE'].includes(
//               touched._internalFiberInstanceHandleDEV?.elementType
//             )
//           ) {
//             return false;
//           }
//           return true;
//         }}
//         onResponderRelease={toggleVideoPause}
//       >
//         <Video
//           ref={ref => videoRefs.current[index] = ref}
//           source={{ 
//             uri: item.video,
//             headers: {
//               'Cache-Control': 'max-age=31536000, public',
//             }
//           }}
//           style={styles.video}
//           resizeMode="cover"
//           repeat
//           paused={!isCurrent || isPaused}
//           onLoad={() => handleVideoLoad(item.id)}
//           onError={(error) => handleVideoError(item.id, error)}
//           bufferConfig={getBufferConfig()}
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="obey"
//           poster={item.video_thumbnail}
//           posterResizeMode="cover"
//           preferredForwardBufferDuration={2}
//           preventsDisplaySleepDuringVideoPlayback={false}
//           hardwareAccelerationAndroid={true}
//           progressUpdateInterval={250}
//           onBuffer={(data) => {
            
//           }}
//         />

//         {/* Show loading indicator if video is not buffered yet */}
//         {isCurrent && !isBuffered && (
//           <View style={styles.bufferingOverlay}>
//             <ActivityIndicator size="large" color="#DC143C" />
//             <Text style={styles.bufferingText}>Buffering...</Text>
//           </View>
//         )}

//         {/* Preload next video */}
//         {filteredShorts[index + 1] && preloadedVideos[filteredShorts[index + 1].id] && (
//           <VideoPreloader
//             uri={filteredShorts[index + 1].video}
//             isVisible={false}
//             onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
//             onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
//           />
//         )}

//         <View style={styles.overlay}>
//           {/* Right Actions */}
//           <Animated.View style={[styles.rightActions, { opacity: fadeAnim }]}>
           
//             {activeTab === 'forYou' && (
//               <TouchableOpacity
//                 onPress={() => followUser(item.user.id)}
//                 style={[
//                   styles.followButton,
//                   item.is_following && styles.followingButton 
//                 ]}
//               >
//                 <Text style={[
//                   styles.followButtonText,
//                   item.is_following && styles.followingButtonText
//                 ]}>
//                   {item.is_following ? 'Following' : 'Follow'}
//                 </Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => likeShort(item.id)}
//               style={styles.iconBtn}
//             >
//               <Iconn
//                 name="heart"
//                 size={40}
//                 color={item.is_liked ? '#DC143C' : '#fff'}
//               />
//               <Text style={[styles.countText,{marginVertical:5}]}>{item.like_count}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 pauseCurrentVideo();
//                 setSelectedShort(item);
//                 setBottomSheetVisible(true);
//                 setCommentPage(1);
//                 setHasMoreComments(true);
//                 fetchCommentsForShort(item.id);
//               }}
//               style={styles.iconBtn}
//             >
//               <Iconn name="chatbubble-ellipses" size={36} color="#fff" />
//               <Text style={[styles.countText,{marginVertical:10}]}>{item.comment_count}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => shareShort(item.id, item.video, item.caption)}
//               style={styles.iconBtn}
//             >
//               <Iconn name="arrow-redo" size={36} color="#fff" />
//               <Text style={[styles.countText,{marginVertical:10}]}>Share</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//                 onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user.id })}
//                 style={styles.userInfo}
//               >
//                 <View style={{ flexDirection:'column',alignSelf:'center', justifyContent:'center', alignItems:'center',textAlign:'center' }}>
//                   <Image
//                   source={
//                     item.user.profile_picture
//                       ? { uri: item.user.profile_picture }
//                       : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                   }
//                   style={styles.shortvatar}
//                 />
//                 <Text style={styles.username}>@{item.user.name?.slice(0,6) || 'user'}</Text>

//                 </View>
                
//               </TouchableOpacity>
//           </Animated.View>

//           <View style={styles.captionContainer}>
//               <Text style={styles.caption} numberOfLines={2}>
//                 {item.caption?.slice(0,100) + '...' || 'No caption'}
//               </Text>
//             </View>
          
//         </View>

//         {shouldShowPlayIcon && (
//           <View style={styles.playOverlay}>
//             <Icon name="play" size={64} color="#fff" />
//           </View>
//         )}
//       </View>
//     );
//   }, [currentIndex, pausedVideos, showPlayIcon, activeTab, fadeAnim, bufferedVideos, preloadedVideos, filteredShorts]);

//   const toggleReplies = (commentId) => {
//     setExpandedReplies(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId],
//     }));
//   };

//   const handleCommentLongPress = useCallback(async (commentId) => {
//     const username = await getCurrentUser();
//     const comment = selectedShort?.comments?.find(c => c.id === commentId);
//     const commentUser = getCommentUser(comment);
//     if (commentUser.username === username.split('@')[0]) {
//       setCommentToDelete(commentId);
//       setDeleteModalVisible(true);
//     }
//   }, [selectedShort]);

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
//       setCurrentIndex(newIndex);
      
//       setPausedVideos(prev => {
//         const newPausedState = {};
//         filteredShorts.forEach((_, index) => {
//           newPausedState[index] = index !== newIndex;
//         });
//         return newPausedState;
//       });
      
//       setShowPlayIcon(prev => {
//         const newPlayIconState = {};
//         filteredShorts.forEach((_, index) => {
//           newPlayIconState[index] = index !== newIndex && prev[index];
//         });
//         return newPlayIconState;
//       });
//     }
//   }).current;

//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       setCurrentIndex(0);
//       const newPausedState = {};
//       filteredShorts.forEach((_, index) => {
//         newPausedState[index] = index !== 0;
//       });
//       setPausedVideos(newPausedState);
      
//       const newPlayIconState = {};
//       filteredShorts.forEach((_, index) => {
//         newPlayIconState[index] = false;
//       });
//       setShowPlayIcon(newPlayIconState);
//     }
//   }, [filteredShorts]);

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 90,
//     waitForInteraction: false,
//   }).current;

//   useEffect(() => {
//     if (shorts.length > 0 && currentIndex >= shorts.length) {
//       setCurrentIndex(0);
//     }
//   }, [shorts]);

//   return (
//     <SafeAreaView style={styles.container} edges={['right', 'left']}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
      
//       {renderNavBar()}
      
//       <FlatList
//         ref={flatListRef}
//         data={filteredShorts}
//         keyExtractor={(item) => `short-${item.id}`}
//         key={`short-feed-${filteredShorts.length}`}
//         renderItem={renderItem}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         removeClippedSubviews={Platform.OS === 'android'}
//         maxToRenderPerBatch={2}
//         updateCellsBatchingPeriod={100}
//         windowSize={3}
//         initialNumToRender={1}
//         contentContainerStyle={styles.flatListContent}
//         decelerationRate="fast"
//         snapToAlignment="start"
//         snapToInterval={height}
//         disableIntervalMomentum={true}
//         maintainVisibleContentPosition={{
//           minIndexForVisible: 0,
//         }}
//         scrollEventThrottle={16}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#DC143C', '#fff']}
//             tintColor="#fff"
//           />
//         }
//         ListEmptyComponent={
//           <ImageBackground
//           source={require('../assets/images/original.jpg')}
//             style={styles.emptyContainer}
//             imageStyle={{ resizeMode: 'cover' }}
//           >
//             <View style={styles.emptyOverlay}>
//               <Animated.Text
//                 style={[
//                   styles.emptyTitle,
//                   {
//                     opacity: fadeAnimEmpty,
//                     transform: [{ scale: scaleAnimEmpty }],
//                   },
//                 ]}
//               >
//                 {activeTab === 'following'
//                   ? 'Follow some creators to see their videos!'
//                   : 'Discover amazing shorts! Loading short...'}
//               </Animated.Text>
//             </View>
//           </ImageBackground>
//         }
//       />

//       <Modal
//         visible={isSearchModalVisible}
//         animationType="slide"
//         transparent={false}
//         onRequestClose={() => {
//           setSearchModalVisible(false);
//           setSearchQuery('');
//           setFilteredShorts(shorts);
//         }}
//       >
//         <View style={styles.searchModalContainer}>
//           <View style={styles.searchModalHeader}>
//             <View style={styles.searchInputContainer}>
//               <Icon name="search" size={22} color="#6b7280" style={styles.searchIcon} />
//               <TextInput
//                 placeholder="Search"
//                 placeholderTextColor="#6b7280"
//                 value={searchQuery}
//                 onChangeText={handleSearch}
//                 style={styles.searchModalInput}
//                 autoFocus={true}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity 
//                   onPress={() => setSearchQuery('')}
//                   style={styles.clearSearchButton}
//                 >
//                   <Ionicons name="close-circle" size={22} color="#6b7280" />
//                 </TouchableOpacity>
//               )}
//             </View>
//             <TouchableOpacity 
//               onPress={() => {
//                 setSearchModalVisible(false);
//                 setSearchQuery('');
//                 setFilteredShorts(shorts);
//               }}
//               style={styles.searchModalClose}
//             >
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         visible={isReplyBottomSheetVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => {
//           setBottomSheetVisible(false);
//           setSelectedCommentId(null);
//           setCommentText('');
//           setExpandedReplies({});
//           setCommentPage(1);
//           setHasMoreComments(true);
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.bottomSheet}>
//             <View style={styles.bottomSheetHeader}>
//               <Text style={styles.bottomSheetTitle}>
//                 {selectedShort?.comment_count || 0} Comments
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setBottomSheetVisible(false);
//                   setSelectedCommentId(null);
//                   setCommentText('');
//                   setExpandedReplies({});
//                 }}
//                 style={styles.closeBtn}
//               >
//                 <Ionicons name="close" size={28} color="#000" />
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={selectedShort?.comments || []}
//               keyExtractor={(item) => `comment-${item.id}`}
//               renderItem={({ item: cmt }) => (
//                 <MemoizedCommentItem
//                   cmt={cmt}
//                   onLongPress={() => handleCommentLongPress(cmt.id)}
//                   onLike={likeComment}
//                   likedComments={likedComments}
//                   expandedReplies={expandedReplies}
//                   onToggleReplies={toggleReplies}
//                 />
//               )}
//               onEndReached={() => {
//                 if (hasMoreComments && selectedShort?.id) {
//                   fetchCommentsForShort(selectedShort.id, commentPage, false, true);
//                 }
//               }}
//               onEndReachedThreshold={0.5}
//               ListEmptyComponent={
//                 <View style={styles.noCommentsContainer}>
//                   <Text style={styles.noCommentsText}>
//                     No comments yet
//                   </Text>
//                 </View>
//               }
//               contentContainerStyle={styles.commentList}
//               showsVerticalScrollIndicator={false}
//               style={styles.commentScroll}
//               initialNumToRender={10}
//               maxToRenderPerBatch={5}
//               windowSize={5}
//               removeClippedSubviews={true}
//             />

//             <View style={styles.commentInputContainer}>
//               <TextInput
//                 placeholder={
//                   selectedCommentId 
//                     ? `Replying to @${getCommentUser(selectedShort?.comments?.find(cmt => cmt.id === selectedCommentId))?.username || ''}`
//                     : "Add a comment..."
//                 }
//                 placeholderTextColor="#6b7280"
//                 value={commentText}
//                 onChangeText={setCommentText}
//                 style={styles.commentInput}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 autoFocus={true}
//               />
              
//               <TouchableOpacity
//                 onPress={() => {
//                   if (commentText.trim()) {
//                     if (selectedCommentId) {
//                       replyComment(selectedCommentId, commentText);
//                     } else if (selectedShort?.id) {
//                       commentShort(selectedShort.id, commentText);
//                     }
//                   }
//                 }}
//                 style={[
//                   styles.commentButton,
//                   !commentText.trim() && styles.commentButtonDisabled,
//                 ]}
//                 disabled={!commentText.trim()}
//               >
//                 <Ionicons name="send" size={22} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         visible={isDeleteModalVisible}
//         animationType="fade"
//         transparent
//         onRequestClose={() => {
//           setDeleteModalVisible(false);
//           setCommentToDelete(null);
//         }}
//       >
//         <View style={styles.deleteModalOverlay}>
//           <View style={styles.deleteModal}>
//             <TouchableOpacity
//               style={styles.deleteOption}
//               onPress={() => {
//                 if (commentToDelete) {
//                   deleteComment(commentToDelete);
//                 }
//               }}
//             >
//               <Text style={styles.deleteOptionText}>Delete</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelOption}
//               onPress={() => {
//                 setDeleteModalVisible(false);
//                 setCommentToDelete(null);
//               }}
//             >
//               <Text style={styles.cancelOptionText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         visible={isMoreOptionsVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setMoreOptionsVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.bottomSheet}>
//             <View style={styles.bottomSheetHeader}>
//               <Text style={styles.bottomSheetTitle}>More Options</Text>
//               <TouchableOpacity
//                 onPress={() => setMoreOptionsVisible(false)}
//                 style={styles.closeBtn}
//               >
//                 <Ionicons name="close" size={28} color="#000" />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.optionsList}>
//               <TouchableOpacity 
//                 style={styles.optionItem}
//                 onPress={() => {
//                   if (selectedShortForOptions) {
//                     copyLink(selectedShortForOptions.video);
//                   }
//                 }}
//               >
//                 <Ionicons name="link" size={24} color="#000" />
//                 <Text style={styles.optionText}>Copy Link</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.optionItem}
//                 onPress={() => {
//                   if (selectedShortForOptions) {
//                     reportShort(selectedShortForOptions.id);
//                   }
//                 }}
//               >
//                 <Ionicons name="flag" size={24} color="#000" />
//                 <Text style={styles.optionText}>Report Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <BottomNav navigation={navigation} activeRoute="ShortFeed" />

//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//         style={styles.snackbar}
//       >
//         <Text style={styles.snackbarText}>{snackbarMessage}</Text>
//       </Snackbar>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   card: {
//     width: width,
//     height: height,
//     backgroundColor: '#000',
//   },
//   video: {
//     width: width,
//     height: height,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     ...Platform.select({
//       android: {
//         elevation: 1,
//       },
//     }),
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'flex-end',
//     alignItems: 'flex-start',
//     padding: 16,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   // Responsive Bottom Content
//   bottomContent: {
//     width: '100%',
//     paddingLeft: 12,
//     justifyContent: 'flex-end',
//   },
//   userInfoRow: {
//     marginBottom: 8,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   shortvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 8,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   username: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   captionContainer: {
//     width: '80%',
//     marginBottom: BOTTOM_SAFE_AREA, 
//   },
//   caption: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//     lineHeight: 18,
//   },
//   // Right Actions
//   rightActions: {
//     position: 'absolute',
//     right: 12,
//     bottom: BOTTOM_CONTENT_HEIGHT + BOTTOM_SAFE_AREA + 20,
//     alignItems: 'center',
//     gap: 16,
//   },
//   followButton: {
//     borderColor: '#fff',
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 5,
//     marginBottom: 20,
//     alignItems: 'center',
//     minWidth: 60,
//   },
//   followingButton: {
//     backgroundColor: '#fff', 
//   },
//   followingButtonText: {
//     color: '#000', 
//   },
//   followButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   iconBtn: {
//     alignItems: 'center',
//   },
//   countText: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '600',
//     marginTop: 4,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   emptyContainer: {
//     flex: 1,
//     width: width,
//     height: height,
//   },
//   emptyOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   emptyTitle: {
//     color: '#fff',
//     fontSize: 24,
//     textAlign: 'center',
//     paddingHorizontal: 32,
//     fontWeight: 'bold',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//     textShadowColor: 'rgba(0,0,0,0.75)',
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   navBar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     zIndex: 1000,
//     ...Platform.select({
//       ios: {
//         paddingTop: StatusBar.currentHeight || 44,
//       },
//       android: {
//         paddingTop: StatusBar.currentHeight || 0,
//       },
//     }),
//   },
//   navBarIOS: {
//     paddingTop: 44, 
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   navItem: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//   },
//   activeNavItem: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#143cdcff',
//   },
//   navText: {
//     color: 'rgba(255,255,255,0.7)',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   activeNavText: {
//     color: '#fff',
//     fontWeight: '800',
//   },
//   searchIconContainer: {
//     padding: 8,
//   },
//   searchModalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   searchModalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     paddingTop: StatusBar.currentHeight + 8,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   searchInputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchModalInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//     paddingVertical: 10,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   clearSearchButton: {
//     padding: 4,
//   },
//   cancelText: {
//     color: '#111827',
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//     paddingHorizontal: 12,
//   },
//   searchGridContainer: {
//     padding: 8,
//   },
//   searchGridItem: {
//     flex: 1,
//     margin: 4,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#f0f0f0',
//   },
//   searchGridItemSpacing: {
//     marginRight: 4,
//   },
//   loadingMoreContainer: {
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   searchGridImage: {
//     width: '100%',
//     height: 160,
//     backgroundColor: '#333',
//   },
//   searchGridOverlay: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 6,
//     borderRadius: 8,
//   },
//   searchGridContent: {
//     padding: 8,
//   },
//   searchGridUsername: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 4,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   searchGridCaption: {
//     fontSize: 12,
//     color: '#6b7280',
//     lineHeight: 16,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   searchSuggestionsContainer: {
//     padding: 16,
//   },
//   suggestionsTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 12,
//     marginTop: 16,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   trendingItem: {
//     backgroundColor: '#f3f4f6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   trendingText: {
//     color: '#111827',
//     fontWeight: '600',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   searchEmptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   searchEmptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 16,
//     textAlign: 'center',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   searchEmptySubtext: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginTop: 8,
//     textAlign: 'center',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   bottomSheet: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     width: '100%',
//     height: '80%',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   bottomSheetHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   bottomSheetTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   closeBtn: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 24,
//     padding: 8,
//   },
//   commentList: {
//     padding: 16,
//     paddingBottom: 20,
//     flexGrow: 1,
//   },
//   commentScroll: {
//     flex: 1,
//   },
//   commentContainer: {
//     marginBottom: 16,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 0,
//   },
//   commentHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   commentUserContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   commentAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   commentUser: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111827',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   commentTime: {
//     fontSize: 12,
//     color: '#6b7280',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   commentText: {
//     fontSize: 14,
//     color: '#374151',
//     lineHeight: 20,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   commentActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   commentLikeBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 6,
//   },
//   commentLikeCount: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginLeft: 4,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   replyBtn: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 16,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   replyBtnActive: {
//     backgroundColor: '#1432dcff',
//   },
//   replyBtnText: {
//     fontSize: 12,
//     color: '#111827',
//     fontWeight: '600',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   replyBtnTextActive: {
//     color: '#fff',
//   },
//   viewRepliesBtn: {
//     marginTop: 8,
//     paddingVertical: 4,
//   },
//   viewRepliesText: {
//     fontSize: 13,
//     color: '#1435dcff',
//     fontWeight: '600',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   replyContainer: {
//     marginLeft: 16,
//     marginTop: 12,
//     backgroundColor: '#ffffffff',
//     borderRadius: 8,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#e8e9ebff',
//   },
//   replyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   replyUserContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   replyAvatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   replyUser: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#111827',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   replyTime: {
//     fontSize: 11,
//     color: '#6b7280',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   replyText: {
//     fontSize: 13,
//     color: '#374151',
//     lineHeight: 18,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   commentInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   commentInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#111827',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: '#f3f4f6',
//     borderRadius: 20,
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   commentButton: {
//     backgroundColor: '#DC143C',
//     borderRadius: 20,
//     padding: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   commentButtonDisabled: {
//     backgroundColor: '#9ca3af',
//   },
//   noCommentsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   noCommentsText: {
//     fontSize: 16,
//     color: '#6b7280',
//     fontWeight: '500',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   flatListContent: {
//     paddingTop: 0,
//   },
//   trendingScroll: {
//     paddingVertical: 8,
//   },
//   snackbar: {
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     borderRadius: 8,
//     margin: 16,
//   },
//   snackbarText: {
//     color: '#111827',
//     fontSize: 14,
//     fontWeight: '500',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   optionsList: {
//     padding: 16,
//   },
//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#111827',
//     marginLeft: 16,
//     fontWeight: '500',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   playOverlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -32 }, { translateY: -32 }],
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     borderRadius: 64,
//     padding: 10,
//     zIndex: 10,
//   },
//   deleteModal: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     width: '80%',
//     paddingVertical: 8,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   deleteOption: {
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   deleteOptionText: {
//     fontSize: 16,
//     color: '#1450dcff',
//     fontWeight: '600',
//     textAlign: 'center',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   cancelOption: {
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//   },
//   cancelOptionText: {
//     fontSize: 16,
//     color: '#111827',
//     fontWeight: '500',
//     textAlign: 'center',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   bufferingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     zIndex: 5,
//   },
//   bufferingText: {
//     color: '#fff',
//     marginTop: 10,
//     fontSize: 14,
//   },
// });

// export default ShortFeedScreen;

// import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,  
//   Dimensions,
//   Alert,
//   Modal,
//   Image,
//   Platform,
//   Animated,
//   StatusBar,
//   RefreshControl,
//   ImageBackground,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Video from 'react-native-video';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { Snackbar } from 'react-native-paper';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import Iconn from 'react-native-vector-icons/Ionicons';
// import BottomNav from '../components/BottomSocialNav';
// import Share from 'react-native-share';

// const { height, width } = Dimensions.get('window');
// const API_URL = `${API_ROUTE}`;

// // Cache keys
// const SHORTS_CACHE_KEY = 'cached_shorts_v2';
// const COMMENTS_CACHE_KEY_PREFIX = 'cached_comments_';
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// // Get safe area insets
// const getBottomSafeArea = () => {
//   if (Platform.OS === 'ios') {
//     return 34;
//   }
//   return 16;
// };

// const BOTTOM_SAFE_AREA = getBottomSafeArea();

// const getBottomContentHeight = () => {
//   if (height < 700) return 80;
//   if (height < 800) return 100;
//   return 120;
// };

// const BOTTOM_CONTENT_HEIGHT = getBottomContentHeight();

// // ==================== STYLES ====================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   card: {
//     width: width,
//     height: height,
//     backgroundColor: '#000',
//   },
//   video: {
//     width: width,
//     height: height,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'flex-end',
//     padding: 16,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   rightActions: {
//     position: 'absolute',
//     right: 12,
//     bottom: BOTTOM_CONTENT_HEIGHT + BOTTOM_SAFE_AREA + 20,
//     alignItems: 'center',
//     gap: 16,
//   },
//   followButton: {
//     borderColor: '#fff',
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 5,
//     marginBottom: 20,
//     minWidth: 60,
//     alignItems: 'center',
//   },
//   followingButton: {
//     backgroundColor: '#fff',
//   },
//   followButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   followingButtonText: {
//     color: '#000',
//   },
//   iconBtn: {
//     alignItems: 'center',
//   },
//   countText: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   userInfo: {
//     marginTop: 10,
//   },
//   userInfoContent: {
//     alignItems: 'center',
//   },
//   shortAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   username: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   captionContainer: {
//     width: '80%',
//     marginBottom: BOTTOM_SAFE_AREA,
//   },
//   caption: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//     lineHeight: 18,
//   },
//   videoThumbnailContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   videoLoadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoErrorOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playIconOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playIconCircle: {
//     backgroundColor: 'rgba(8, 43, 242, 0.8)',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
  
//   searchResultItem: {
//     flex: 1,
//     margin: 4,
//     aspectRatio: 9/16,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#1a1a1a',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   searchResultOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     paddingTop: 16,
//   },
//   searchResultUser: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   searchResultCaption: {
//     color: '#fff',
//     fontSize: 11,
//     opacity: 0.9,
//     marginTop: 2,
//   },
//   errorText: {
//     color: '#fff',
//     fontSize: 11,
//     marginTop: 4,
//   },
//   navBar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     zIndex: 1000,
//     ...Platform.select({
//       ios: {
//         paddingTop: StatusBar.currentHeight || 44,
//       },
//       android: {
//         paddingTop: StatusBar.currentHeight || 0,
//       },
//     }),
//   },
//   navBarIOS: {
//     paddingTop: 44,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     flex: 1,
//   },
//   searchModalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   searchModalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     backgroundColor: '#fff',
//     zIndex: 1000,
//   },
//   searchInputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     marginRight: 12,
//     height: 40,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchModalInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//     paddingVertical: 8,
//   },
//   clearSearchButton: {
//     padding: 4,
//   },
//   cancelText: {
//     color: '#111827',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   searchResultItem: {
//     flex: 1,
//     margin: 4,
//     aspectRatio: 9/16, // Typical video aspect ratio
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#1a1a1a',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   searchResultImage: {
//     width: '100%',
//     height: '100%',
//   },
//   searchResultOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//   },
//   searchResultUser: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   searchResultCaption: {
//     color: '#fff',
//     fontSize: 11,
//     opacity: 0.8,
//     marginTop: 2,
//   },
//   searchEmptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 100,
//   },
//   searchEmptyText: {
//     fontSize: 16,
//     color: '#6b7280',
//     marginTop: 12,
//   },
//   searchResultsList: {
//     padding: 8,
//   },
//   navItem: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//   },
//   activeNavItem: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#DC143C',
//   },
//   navText: {
//     color: 'rgba(255,255,255,0.7)',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   activeNavText: {
//     color: '#fff',
//     fontWeight: '800',
//   },
//   headerRight: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   headerIcon: {
//     padding: 4,
//   },
//   emptyContainer: {
//     flex: 1,
//     width: width,
//     height: height,
//   },
//   emptyOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   emptyTitle: {
//     color: '#fff',
//     fontSize: 24,
//     textAlign: 'center',
//     paddingHorizontal: 32,
//     fontWeight: 'bold',
//     textShadowColor: 'rgba(0,0,0,0.75)',
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   refreshButton: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#DC143C',
//     borderRadius: 25,
//   },
//   refreshButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   bufferingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     zIndex: 5,
//   },
//   bufferingText: {
//     color: '#fff',
//     marginTop: 10,
//     fontSize: 14,
//   },
//   footerLoader: {
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.9)',
//   },
//   footerText: {
//     color: '#fff',
//     marginTop: 8,
//     fontSize: 12,
//   },
//   flatListContent: {
//     paddingTop: 0,
//   },
  
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   commentModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   modalCloseBtn: {
//     padding: 8,
//   },
//   commentsList: {
//     padding: 16,
//     paddingBottom: 20,
//   },
//   commentContainer: {
//     marginBottom: 16,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 12,
//   },
//   replyContainer: {
//     marginLeft: 20,
//     marginTop: 8,
//     backgroundColor: '#f0f2f5',
//   },
//   commentHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   commentUserContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   commentAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 12,
//   },
//   commentUser: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   commentTime: {
//     fontSize: 11,
//     color: '#6b7280',
//     marginTop: 2,
//   },
//   commentActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   commentActionBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 4,
//   },
//   commentLikeCount: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginLeft: 4,
//   },
//   commentText: {
//     fontSize: 14,
//     color: '#374151',
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   thumbnail: {
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: '#000',
// },
// // Android-specific optimizations
// android: {
//   useTextureView: true, // Better performance
//   bufferConfig: {
//     minBufferMs: 500,      // Start after 0.5 seconds
//     maxBufferMs: 2000,     // Max 2 seconds buffer
//     bufferForPlaybackMs: 200,
//     bufferForPlaybackAfterRebufferMs: 500,
//   },
// },
//   commentFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   replyBtn: {
//     padding: 4,
//   },
//   replyBtnText: {
//     fontSize: 12,
//     color: '#DC143C',
//     fontWeight: '600',
//   },
//   viewRepliesBtn: {
//     padding: 4,
//   },
//   viewRepliesText: {
//     fontSize: 12,
//     color: '#DC143C',
//     fontWeight: '600',
//   },
//   repliesList: {
//     marginTop: 12,
//   },
//   repliesLoader: {
//     marginVertical: 8,
//   },
//   replyInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     gap: 8,
//   },
//   replyInput: {
//     flex: 1,
//     fontSize: 13,
//     color: '#111827',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   replySendBtn: {
//     backgroundColor: '#DC143C',
//     borderRadius: 20,
//     padding: 10,
//   },
//   replySendBtnDisabled: {
//     backgroundColor: '#ccc',
//   },
//   commentInputWrapper: {
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   replyingToBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#f8f9fa',
//   },
//   replyingToText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   commentInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     gap: 8,
//   },
//   commentInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#111827',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 24,
//     maxHeight: 100,
//   },
//   commentSendBtn: {
//     backgroundColor: '#DC143C',
//     borderRadius: 24,
//     padding: 12,
//   },
//   commentSendBtnDisabled: {
//     backgroundColor: '#ccc',
//   },
//   noCommentsContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   noCommentsText: {
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   commentsLoader: {
//     padding: 20,
//     alignItems: 'center',
//   },
  
//   // Search Modal Styles
//   searchModalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   searchModalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   searchInputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchModalInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//     paddingVertical: 10,
//   },
//   clearSearchButton: {
//     padding: 4,
//   },
//   cancelText: {
//     color: '#111827',
//     fontSize: 16,
//     fontWeight: '500',
//     paddingHorizontal: 12,
//   },
//   searchResultItem: {
//     flex: 1,
//     margin: 4,
//     aspectRatio: 1,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#000',
//   },
//   searchResultImage: {
//     width: '100%',
//     height: '100%',
//   },
//   searchResultOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 8,
//   },
//   searchResultUser: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   searchEmptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 100,
//   },
//   searchEmptyText: {
//     fontSize: 18,
//     color: '#666',
//   },
//   videoThumbnailContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   videoLoadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoErrorOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoPlayOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoPlayIconContainer: {
//     backgroundColor: 'rgba(24, 31, 236, 0.8)',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   videoDurationBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   searchResultItem: {
//     flex: 1,
//     margin: 4,
//     aspectRatio: 9/16,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#1a1a1a',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   searchResultOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     paddingTop: 16,
//   },
//   searchResultUser: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   searchResultCaption: {
//     color: '#fff',
//     fontSize: 11,
//     opacity: 0.9,
//     marginTop: 2,
//   },
//   errorText: {
//     color: '#fff',
//     fontSize: 11,
//     marginTop: 4,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
  
//   snackbar: {
//     backgroundColor: '#080808ff',
//     borderRadius: 8,
//     margin: 16,
//   },
//   snackbarText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

// // ==================== MAIN COMPONENT ====================
// const ShortFeedScreen = ({ navigation, route }) => {
//   // ==================== STATE ====================
//   const [shorts, setShorts] = useState([]);
//   const [filteredShorts, setFilteredShorts] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [pausedVideos, setPausedVideos] = useState({});
//   const [activeTab, setActiveTab] = useState('forYou');
//   const [refreshing, setRefreshing] = useState(false);
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
  
//   // Pagination states
//   const [shortsPage, setShortsPage] = useState(1);
//   const [shortsHasMore, setShortsHasMore] = useState(true);
//   const [loadingShorts, setLoadingShorts] = useState(false);
  
//   // Comment modal states
//   const [isCommentModalVisible, setCommentModalVisible] = useState(false);
//   const [selectedShort, setSelectedShort] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState('');
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [commentsPage, setCommentsPage] = useState(1);
//   const [commentsHasMore, setCommentsHasMore] = useState(true);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [expandedComments, setExpandedComments] = useState({});
//   const [followedUserIds, setFollowedUserIds] = useState([]);
//   const [videoReady, setVideoReady] = useState({});

// const [replyToComment, setReplyToComment] = useState(null);
// const [isSubmittingComment, setIsSubmittingComment] = useState(false);
// const [localComments, setLocalComments] = useState([]);
// const [isFlatListReady, setIsFlatListReady] = useState(false);


//   // Search modal
//   const [isSearchModalVisible, setSearchModalVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Video optimization
//   const [preloadedVideos, setPreloadedVideos] = useState({});
//   const [bufferedVideos, setBufferedVideos] = useState({});
//   const [videoLoadTimes, setVideoLoadTimes] = useState({});
//   const videoRefs = useRef({});
//   const flatListRef = useRef();
  
//   // Animations
//   const fadeAnimEmpty = useRef(new Animated.Value(0)).current;
//   const scaleAnimEmpty = useRef(new Animated.Value(0.8)).current;

//   // Add this at the top with your other constants
// const VIDEO_CACHE_PREFIX = 'video_cache_';
// const THUMBNAIL_CACHE_PREFIX = 'thumbnail_cache_';

// // Function to cache video URLs
// const cacheVideoUrl = async (videoId, url) => {
//   try {
//     await AsyncStorage.setItem(`${VIDEO_CACHE_PREFIX}${videoId}`, url);
//   } catch (error) {
//     console.error('Error caching video:', error);
//   }
// };
// ///====11
// const SearchVideoThumbnail = memo(({ videoUrl, username, caption, onPress }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const videoRef = useRef(null);

//   return (
//     <TouchableOpacity 
//       activeOpacity={0.7}
//       onPress={onPress}
//       style={styles.searchResultItem}
//     >
//       <View style={styles.videoThumbnailContainer}>
//         <Video
//           ref={videoRef}
//           source={{ uri: getOptimizedVideoUrl(videoUrl) }}
//           style={StyleSheet.absoluteFillObject}
//           resizeMode="cover"
//           paused={true}  // Always paused
//           muted={true}   // Muted
//           repeat={false} // Don't repeat
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           onLoad={() => {
//             console.log('Video thumbnail loaded:', videoUrl);
//             setIsLoading(false);
//           }}
//           onError={(error) => {
//             console.log('Video thumbnail error:', error);
//             setHasError(true);
//             setIsLoading(false);
//           }}
//           bufferConfig={{
//             minBufferMs: 0, // Don't buffer more than necessary
//             maxBufferMs: 1000,
//           }}
//         />
        
//         {isLoading && (
//           <View style={styles.videoLoadingOverlay}>
//             <ActivityIndicator size="small" color="#DC143C" />
//           </View>
//         )}
        
//         {hasError && (
//           <View style={styles.videoErrorOverlay}>
//             <Icon name="alert-circle" size={24} color="#fff" />
//             <Text style={styles.errorText}>Failed to load</Text>
//           </View>
//         )}
        
//         {/* Simple Play Icon Overlay (just for visual) */}
//         <View style={styles.playIconOverlay} pointerEvents="none">
//           <View style={styles.playIconCircle}>
//             <MaterialIcons name="play-arrow" size={24} color="#fff" />
//           </View>
//         </View>
        
//         {/* Video Info Overlay */}
//         <View style={styles.searchResultOverlay} pointerEvents="none">
//           <Text style={styles.searchResultUser} numberOfLines={1}>
//             @{username || 'user'}
//           </Text>
//           {caption && (
//             <Text style={styles.searchResultCaption} numberOfLines={1}>
//               {caption}
//             </Text>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// });



// const getItemLayout = (data, index) => ({
//   length: height, // height of each item
//   offset: height * index,
//   index,
// });

// // Function to get cached video URL
// const getCachedVideoUrl = async (videoId) => {
//   try {
//     return await AsyncStorage.getItem(`${VIDEO_CACHE_PREFIX}${videoId}`);
//   } catch (error) {
//     return null;
//   }
// };


// const getSecureUrl = (url) => {
//   if (!url) return null;
//   // If it's already HTTPS, return as is
//   if (url.startsWith('https://')) return url;
//   // If it's HTTP, convert to HTTPS
//   if (url.startsWith('http://')) {
//     return url.replace('http://', 'https://');
//   }
//   // If it's a relative path, prepend with your API route
//   if (url.startsWith('/')) {
//     return `${API_ROUTE_IMAGE.replace('http://', 'https://')}${url}`;
//   }
//   return url;
// };



//   useEffect(() => {
//   const fetchFollowedUsers = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_URL}/followed-users/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.status === 200) {
//         const ids = response.data.map(user => user.id);
//         setFollowedUserIds(ids);
//         console.log('Followed user IDs:', ids);
//       }
//     } catch (error) {
//       console.error('Error fetching followed users:', error);
//     }
//   };
  
//   fetchFollowedUsers();
// }, []);

// // useEffect(() => {
// //   if (isCurrent) {
// //     console.log('Current video being played:');
// //     console.log('Original URL:', item.video);
// //     console.log('Optimized URL:', getOptimizedVideoUrl(item.video));
// //     console.log('Format:', item.video?.split('.').pop());
// //     console.log('Platform:', Platform.OS);
// //   }
// // }, [isCurrent, item.id]);


// const isFormatSupported = (videoUrl) => {
//   if (!videoUrl) return false;
  
//   const extension = videoUrl.split('.').pop()?.toLowerCase() || '';
//   const supportedFormats = ['mp4', 'm4v', 'mov', 'avi']; // MP4 is most compatible
  
//   console.log(`Video format check: ${extension} - ${supportedFormats.includes(extension) ? 'SUPPORTED' : 'NOT SUPPORTED'}`);
  
//   return supportedFormats.includes(extension);
// };

// const getOptimizedVideoUrl = (videoUrl) => {
//   if (!videoUrl || !videoUrl.includes('cloudinary')) return videoUrl;
  
//   // Extract the current format
//   const urlParts = videoUrl.split('.');
//   const currentFormat = urlParts.pop()?.toLowerCase();
  
//   console.log('Current format:', currentFormat);
//   console.log('Platform:', Platform.OS);
  
//   let optimizedUrl = videoUrl;
  
//   // Determine target format based on platform
//   if (Platform.OS === 'ios') {
//     // iOS needs MP4
//     if (currentFormat !== 'mp4') {
//       // Insert f_mp4 transformation
//       optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
//       console.log('iOS: Converting to MP4');
//     }
//   } else if (Platform.OS === 'android') {
//     // Android works well with MP4
//     if (currentFormat !== 'mp4') {
//       optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
//       console.log('Android: Converting to MP4');
//     }
//   } else {
//     // Web - use auto format for best browser compatibility
//     optimizedUrl = videoUrl.replace('/upload/', '/upload/f_auto/');
//     console.log('Web: Using auto format');
//   }
  
//   // Add quality optimization for all platforms
//   optimizedUrl = optimizedUrl.replace('/upload/', '/upload/q_auto/');
  
//   console.log('Final optimized URL:', optimizedUrl);
//   return optimizedUrl;
// };


// // Add this useEffect to filter shorts when tab changes
// useEffect(() => {
//   if (!shorts || shorts.length === 0) return;
  
//   console.log('Filtering shorts for tab:', activeTab);
//   console.log('Total shorts:', shorts.length);
//   console.log('Followed user IDs:', followedUserIds);
  
//   let filtered = [];
  
//   if (activeTab === 'forYou') {
//     // For You tab - show all shorts (or implement your recommendation algorithm)
//     filtered = [...shorts].sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//     console.log('For You tab showing all shorts:', filtered.length);
//   } else {
//     // Following tab - show only shorts from followed users
//     filtered = shorts.filter(short => followedUserIds.includes(short.user?.id));
//     console.log('Following tab showing followed users shorts:', filtered.length);
//   }
  
//   setFilteredShorts(filtered);
  
//   // Reset video states for new filtered list
//   if (filtered.length > 0) {
//     const initialPausedState = {};
//     filtered.forEach((_, index) => {
//       initialPausedState[index] = index !== 0;
//     });
//     setPausedVideos(initialPausedState);
//     setCurrentIndex(0);
//   }
// }, [activeTab, shorts, followedUserIds]);

//   // ==================== VIDEO PRELOADER COMPONENT ====================
//   const VideoPreloader = memo(({ uri, isVisible, onLoad, onError }) => {
//     const videoRef = useRef(null);

//     useEffect(() => {
//       if (!isVisible && videoRef.current) {
//         videoRef.current.seek(0);
//       }
//     }, [isVisible]);

//     if (!uri) return null;

//     return (
//       <Video
//         ref={videoRef}
//         source={{ uri }}
//         style={{ width: 0, height: 0 }}
//         paused={true}
//         muted={true}
//         resizeMode="cover"
//         onLoad={onLoad}
//         onError={onError}
//         bufferConfig={{
//           minBufferMs: 5000,
//           maxBufferMs: 15000,
//           bufferForPlaybackMs: 1000,
//           bufferForPlaybackAfterRebufferMs: 2000,
//         }}
//         ignoreSilentSwitch="ignore"
//       />
//     );
//   });

//   // ==================== HELPER FUNCTIONS ====================
//   const getAuthHeader = async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) throw new Error('No access token found');
//     return {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//   };

//   const getCurrentUser = async () => {
//     const json = await AsyncStorage.getItem('userData');
//     const parsed = json ? JSON.parse(json) : null;
//     return {
//       id: parsed?.id,
//       name: parsed?.name || 'User',
//       username: parsed?.username || parsed?.name || 'User',
//       profile_picture: parsed?.profile_picture || null
//     };
//   };

//   // Cache functions
//   const getCachedShorts = async () => {
//     try {
//       const cached = await AsyncStorage.getItem(SHORTS_CACHE_KEY);
//       if (cached) {
//         const { data, timestamp } = JSON.parse(cached);
//         if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(data)) {
//           return data;
//         }
//       }
//       return null;
//     } catch (error) {
//       console.error('Error reading shorts cache:', error);
//       return null;
//     }
//   };

//   const setCachedShorts = async (data) => {
//     try {
//       await AsyncStorage.setItem(
//         SHORTS_CACHE_KEY,
//         JSON.stringify({ data, timestamp: Date.now() })
//       );
//     } catch (error) {
//       console.error('Error saving shorts cache:', error);
//     }
//   };

//   const getCachedComments = async (shortId) => {
//     try {
//       const cached = await AsyncStorage.getItem(`${COMMENTS_CACHE_KEY_PREFIX}${shortId}`);
//       if (cached) {
//         const { data, timestamp } = JSON.parse(cached);
//         if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(data)) {
//           return data;
//         }
//       }
//       return null;
//     } catch (error) {
//       console.error('Error reading comments cache:', error);
//       return null;
//     }
//   };

//   const setCachedComments = async (shortId, data) => {
//     try {
//       await AsyncStorage.setItem(
//         `${COMMENTS_CACHE_KEY_PREFIX}${shortId}`,
//         JSON.stringify({ data, timestamp: Date.now() })
//       );
//     } catch (error) {
//       console.error('Error saving comments cache:', error);
//     }
//   };

//  const getVideoThumbnail = (videoUrl) => {
//   if (!videoUrl) return null;
  
//   // If it's a Cloudinary URL
//   if (videoUrl.includes('cloudinary')) {
//     // Generate thumbnail at lower quality for faster loading
//     return videoUrl.replace('/video/upload/', '/video/upload/w_300,h_500,c_thumb,f_auto,q_auto/');
//   }
  
//   // If it's a direct video URL, we might not have a thumbnail
//   // Return null to use placeholder
//   return null;
// };

//   // ==================== VIDEO FUNCTIONS ====================
//   const playVideo = useCallback((index) => {
//     if (videoRefs.current[index]) {
//       videoRefs.current[index].seek(0);
//       setPausedVideos(prev => ({
//         ...prev,
//         [index]: false,
//       }));
//     }
//   }, []);

//   const pauseVideo = useCallback((index) => {
//     if (videoRefs.current[index]) {
//       setPausedVideos(prev => ({
//         ...prev,
//         [index]: true,
//       }));
//     }
//   }, []);

//   const preloadVideos = useCallback((videos) => {
//     videos.forEach((video) => {
//       if (video?.video && !preloadedVideos[video.id]) {
//         setPreloadedVideos(prev => ({
//           ...prev,
//           [video.id]: true,
//         }));
//       }
//     });
//   }, [preloadedVideos]);

//   const handleVideoLoad = useCallback((videoId) => {
//     const loadTime = Date.now();
//     setVideoLoadTimes(prev => ({
//       ...prev,
//       [videoId]: loadTime,
//     }));
//     setBufferedVideos(prev => ({
//       ...prev,
//       [videoId]: true,
//     }));
//   }, []);

//   const handleVideoError = useCallback((videoId, error) => {
//     console.log(`Video ${videoId} error:`, error);
//   }, []);

// const getBufferConfig = (platform) => {
//   if (platform === 'ios') {
//     return {
//       minBufferMs: 500,          // Start after just 0.5 seconds
//       maxBufferMs: 3000,         // Max 3 seconds buffer
//       bufferForPlaybackMs: 200,  // Start after 0.2 seconds
//       bufferForPlaybackAfterRebufferMs: 500,
//     };
//   } else {
//     return {
//       minBufferMs: 1000,
//       maxBufferMs: 4000,
//       bufferForPlaybackMs: 500,
//       bufferForPlaybackAfterRebufferMs: 1000,
//     };
//   }
// };

// // In Video component


//   const initializeVideoStates = (data) => {
//     const initialPausedState = {};
//     data.forEach((_, index) => {
//       initialPausedState[index] = index !== 0;
//     });
//     setPausedVideos(initialPausedState);
//   };

//   const retryVideo = useCallback((index) => {
//     if (videoRefs.current[index]) {
//       console.log(`Retrying video at index ${index}`);
//       setPausedVideos(prev => ({
//         ...prev,
//         [index]: true,
//       }));
      
//       setTimeout(() => {
//         setPausedVideos(prev => ({
//           ...prev,
//           [index]: false,
//         }));
//       }, 500);
//     }
//   }, []);

//   // ==================== DEBUG VIDEO LOADING ====================
//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       console.log('First video URL:', filteredShorts[0]?.video);
//       // Test if URL is accessible
//       fetch(filteredShorts[0]?.video, { method: 'HEAD' })
//         .then(response => {
//           console.log('Video URL status:', response.status);
//         })
//         .catch(error => {
//           console.log('Video URL error:', error);
//         });
//     }
//   }, [filteredShorts]);

//   // ==================== INITIALIZATION ====================
//   useEffect(() => {
//     // Animation for empty state
//     if (filteredShorts.length === 0) {
//       fadeAnimEmpty.setValue(0);
//       scaleAnimEmpty.setValue(0.8);
//       Animated.parallel([
//         Animated.timing(fadeAnimEmpty, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnimEmpty, {
//           toValue: 1,
//           tension: 50,
//           friction: 5,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [filteredShorts.length]);

//   // Listen for new short from upload screen
//   useEffect(() => {
//     if (route.params?.newShort) {
//       setSnackbarMessage('Short uploaded successfully!');
//       setSnackbarVisible(true);
//       fetchShorts(1, true);
//     }
//   }, [route.params?.newShort]);

//   // Twitter-like initialization: Load cache immediately, fetch in background
//   useEffect(() => {
//     fetchShorts(1);
    
//     // Reset pagination on tab change
//     setShortsPage(1);
//     setShortsHasMore(true);
//   }, [activeTab]);

//   // Preload videos when data changes
//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       const videosToPreload = filteredShorts.slice(
//         Math.max(0, currentIndex - 1),
//         Math.min(filteredShorts.length, currentIndex + 3)
//       );
//       preloadVideos(videosToPreload);
//     }
//   }, [filteredShorts, currentIndex]);

//  // ==================== SHORTS FETCHING ====================
// const fetchShorts = useCallback(async (pageNum = 1, isRefreshing = false) => {
//   console.log('========== FETCH SHORTS START ==========');
//   console.log('Page:', pageNum);
//   console.log('Is Refreshing:', isRefreshing);
//   console.log('Active Tab:', activeTab);
//   console.log('Loading State:', loadingShorts);
//   console.log('Has More:', shortsHasMore);
  
//   if (loadingShorts || (!shortsHasMore && !isRefreshing)) {
//     console.log('Skipping fetch - already loading or no more data');
//     return;
//   }
  
//   setLoadingShorts(true);
//   try {
//     // Load cache first for instant display
//     if (pageNum === 1) {
//       console.log('Checking cache for shorts...');
//       const cachedShorts = await getCachedShorts();
//       console.log('Cached shorts found:', cachedShorts ? 'YES' : 'NO');
      
//       if (cachedShorts && Array.isArray(cachedShorts)) {
//         console.log('Cached shorts count:', cachedShorts.length);
//         setShorts(cachedShorts);
//         setFilteredShorts(cachedShorts);
//         initializeVideoStates(cachedShorts);
//       }
//     }

//     // Fetch from server
//     console.log('Fetching from server...');
//     const headers = await getAuthHeader();
//     const endpoint = `${API_URL}/shorts/`; // Always fetch all shorts
    
//     console.log('API Endpoint:', endpoint);
//     console.log('Request params:', { page: pageNum, page_size: 5 });
    
//     const response = await axios.get(endpoint, { 
//       headers,
//       params: {
//         page: pageNum,
//         page_size: 5
//       }
//     });

//     console.log('Response Status:', response.status);
//     console.log('Response Data Type:', typeof response.data);
//     console.log('Is Array:', Array.isArray(response.data));

//     if (response.status === 200) {
//       let newShorts = [];
      
//       if (Array.isArray(response.data)) {
//         newShorts = response.data;
//         setShortsHasMore(false);
//         console.log('Response is direct array, length:', newShorts.length);
//       } else if (response.data.results && Array.isArray(response.data.results)) {
//         newShorts = response.data.results;
//         setShortsHasMore(!!response.data.next);
//         console.log('Response is paginated, results length:', newShorts.length);
//       }
      
//       console.log('New shorts count:', newShorts.length);
      
//       // Process shorts - DON'T filter here!
//      // Process shorts with format info
//       let processedShorts = newShorts.map(short => {
//         const videoUrl = short.video?.replace(/\/\//g, '/').replace(':/', '://');
//         const extension = videoUrl?.split('.').pop()?.toLowerCase() || '';
        
//         return {
//           ...short,
//           video: videoUrl,
//           video_mp4: videoUrl?.replace(/\.webm$/, '.mp4'), // Add MP4 version
//           video_format: extension,
//           is_supported: ['mp4', 'mov', 'm4v'].includes(extension),
//           video_thumbnail: getVideoThumbnail(videoUrl),
//         };
//       });

//       console.log('Processed shorts count:', processedShorts.length);

//       // Update state with all shorts
//       if (isRefreshing || pageNum === 1) {
//         console.log('Setting all shorts (first page)');
//         setShorts(processedShorts);
//         setFilteredShorts(processedShorts); // Show all shorts initially
//         initializeVideoStates(processedShorts);
//       } else {
//         console.log('Appending to existing shorts');
//         setShorts(prev => {
//           const newState = [...(prev || []), ...processedShorts];
//           console.log('Total shorts after append:', newState.length);
//           return newState;
//         });
//         setFilteredShorts(prev => {
//           const newState = [...(prev || []), ...processedShorts];
//           return newState;
//         });
//       }
      
//       if (!isRefreshing) {
//         setShortsPage(pageNum + 1);
//         console.log('Next page set to:', pageNum + 1);
//       }
      
//       // Cache first page
//       if (pageNum === 1 && processedShorts.length > 0) {
//         console.log('Caching first page...');
//         await setCachedShorts(processedShorts);
//       }
      
//       // Preload videos
//       if (processedShorts.length > 0) {
//         console.log('Preloading first 3 videos...');
//         preloadVideos(processedShorts.slice(0, 3));
//       }
//     }
//   } catch (error) {
//     console.error('========== FETCH SHORTS ERROR ==========');
//     console.error('Error:', error.message);
//   } finally {
//     console.log('Fetch completed. Loading state set to false');
//     setLoadingShorts(false);
//     setRefreshing(false);
//     console.log('========== FETCH SHORTS END ==========');
//   }
// }, [activeTab, shortsPage, shortsHasMore, loadingShorts]);
//   // ==================== COMMENTS FUNCTIONS ====================


//   const fetchComments = useCallback(async (shortId, page = 1, isLoadMore = false) => {
//   if (loadingComments || (!commentsHasMore && isLoadMore)) return;
  
//   setLoadingComments(true);
//   try {
//     // Load cache first for instant display
//     if (page === 1) {
//       const cachedComments = await getCachedComments(shortId);
//       if (cachedComments && Array.isArray(cachedComments)) {
//         // Convert profile picture URLs to HTTPS
//         const cachedWithHttps = cachedComments.map(comment => ({
//           ...comment,
//           user: {
//             ...comment.user,
//             profile_picture: getSecureUrl(comment.user?.profile_picture)
//           },
//           replies: comment.replies?.map(reply => ({
//             ...reply,
//             user: {
//               ...reply.user,
//               profile_picture: getSecureUrl(reply.user?.profile_picture)
//             }
//           })) || []
//         }));
//         setLocalComments(cachedWithHttps);
//       }
//     }

//     const headers = await getAuthHeader();
//     const response = await axios.get(
//       `${API_URL}/shorts/${shortId}/comments/`,
//       { 
//         headers,
//         params: {
//           page: page,
//           page_size: 20
//         }
//       }
//     );
    
//     if (response.status === 200) {
//       let newComments = [];
//       if (response.data.results && Array.isArray(response.data.results)) {
//         newComments = response.data.results;
//         setCommentsHasMore(!!response.data.next);
//         setCommentsPage(page + 1);
//       } else if (Array.isArray(response.data)) {
//         newComments = response.data;
//         setCommentsHasMore(false);
//       }
      
//       // Mark own comments and convert to HTTPS
//       const currentUser = await getCurrentUser();
//       const commentsWithOwn = newComments.map(comment => ({
//         ...comment,
//         is_own: comment.user?.id === currentUser.id,
//         like_count: comment.like_count || 0,
//         is_liked: comment.is_liked || false,
//         user: {
//           ...comment.user,
//           profile_picture: getSecureUrl(comment.user?.profile_picture)
//         },
//         replies: comment.replies?.map(reply => ({
//           ...reply,
//           is_own: reply.user?.id === currentUser.id,
//           like_count: reply.like_count || 0,
//           is_liked: reply.is_liked || false,
//           user: {
//             ...reply.user,
//             profile_picture: getSecureUrl(reply.user?.profile_picture)
//           }
//         })) || []
//       }));
      
//       setLocalComments(prev => {
//         if (page === 1) return commentsWithOwn;
        
//         // Merge with existing, avoiding duplicates
//         const existingIds = new Set(prev.map(c => c.id));
//         const newUnique = commentsWithOwn.filter(c => !existingIds.has(c.id));
//         return [...prev, ...newUnique];
//       });
      
//       // Cache first page with HTTPS URLs
//       if (page === 1) {
//         await setCachedComments(shortId, commentsWithOwn);
//       }
//     }
//   } catch (error) {
//     console.error('Fetch Comments Error:', error);
//     if (page === 1) {
//       setLocalComments([]);
//     }
//   } finally {
//     setLoadingComments(false);
//   }
// }, [loadingComments, commentsHasMore]);

// const handleReplyPress = (comment) => {
//   setReplyToComment(comment);
//   setCommentText(`@${comment.user?.name || 'user'} `);
// };
  

// const fetchCommentReplies = useCallback(async (commentId) => {
//   try {
//     const headers = await getAuthHeader();
//     const response = await axios.get(
//       `${API_URL}/shorts/comments/${commentId}/replies/`,
//       { headers }
//     );
    
//     if (response.status === 200) {
//       const currentUser = await getCurrentUser();
//       return response.data.replies.map(reply => ({
//         ...reply,
//         is_own: reply.user?.id === currentUser.id,
//         like_count: reply.like_count || 0,
//         is_liked: reply.is_liked || false,
//         user: {
//           ...reply.user,
//           profile_picture: getSecureUrl(reply.user?.profile_picture)
//         }
//       }));
//     }
//     return [];
//   } catch (error) {
//     console.error('Fetch Replies Error:', error);
//     return [];
//   }
// }, []);


// const postComment = useCallback(async (shortId, text, parentId = null) => {
//   if (!text.trim() || isSubmittingComment) return null;

//   console.log('Posting comment to:', `${API_URL}/shorts/${shortId}/comment/`);

//   setIsSubmittingComment(true);
//   try {
//     const currentUser = await getCurrentUser();
//     const headers = await getAuthHeader();
    
//     const requestData = { 
//       text: text.trim(),
//       ...(parentId && { parent: parentId })
//     };
    
//     // Optimistically add comment to UI
//     const tempId = Date.now();
//     const optimisticComment = {
//       id: tempId,
//       text: text.trim(),
//       user: {
//         ...currentUser,
//         profile_picture: getSecureUrl(currentUser.profile_picture)
//       },
//       created_at: new Date().toISOString(),
//       like_count: 0,
//       reply_count: 0,
//       is_liked: false,
//       is_own: true,
//       replies: [],
//       parent: parentId
//     };

//     // Add to local comments immediately
//     if (parentId) {
//       // It's a reply - add to parent's replies
//       setLocalComments(prev => 
//         prev.map(comment => 
//           comment.id === parentId 
//             ? { 
//                 ...comment, 
//                 replies: [...(comment.replies || []), optimisticComment],
//                 reply_count: (comment.reply_count || 0) + 1
//               }
//             : comment
//         )
//       );
//     } else {
//       // It's a top-level comment
//       setLocalComments(prev => [optimisticComment, ...prev]);
//     }

//     // Update comment count in the selected short
//     if (selectedShort) {
//       setSelectedShort(prev => ({
//         ...prev,
//         comment_count: (prev.comment_count || 0) + 1
//       }));
//     }

//     // Clear input
//     setCommentText('');
//     setReplyToComment(null);

//     // API call
//     const response = await axios.post(
//       `${API_URL}/shorts/${shortId}/comment/`,
//       requestData,
//       { headers }
//     );

//     console.log('Comment posted successfully:', response.data);

//     // Replace optimistic comment with real one
//     if (response.data) {
//       const realComment = {
//         ...response.data,
//         is_own: true,
//         like_count: 0,
//         is_liked: false,
//         user: {
//           ...currentUser,
//           profile_picture: getSecureUrl(currentUser.profile_picture)
//         }
//       };

//       setLocalComments(prev => {
//         if (parentId) {
//           // Update reply
//           return prev.map(comment => 
//             comment.id === parentId 
//               ? { 
//                   ...comment, 
//                   replies: comment.replies.map(r => 
//                     r.id === tempId ? realComment : r
//                   )
//                 }
//               : comment
//           );
//         } else {
//           // Update top-level comment
//           return prev.map(c => c.id === tempId ? realComment : c);
//         }
//       });
//     }

//     return response.data;
    
//   } catch (error) {
//     console.error('Error posting comment:', error.response?.data || error.message);
    
//     // Remove optimistic comment on error
//     setLocalComments(prev => 
//       prev.filter(c => c.id !== Date.now())
//     );
    
//     Alert.alert('Error', 'Failed to post comment. Please try again.');
//     throw error;
//   } finally {
//     setIsSubmittingComment(false);
//   }
// }, [selectedShort, isSubmittingComment]);

//   const likeComment = useCallback(async (commentId, isLiked) => {
//   // Optimistic update
//   setLocalComments(prev => 
//     prev.map(comment => {
//       // Update the comment itself
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           is_liked: !isLiked,
//           like_count: isLiked ? comment.like_count - 1 : comment.like_count + 1
//         };
//       }
//       // Check if it's in replies
//       if (comment.replies && comment.replies.length > 0) {
//         return {
//           ...comment,
//           replies: comment.replies.map(reply => 
//             reply.id === commentId 
//               ? {
//                   ...reply,
//                   is_liked: !isLiked,
//                   like_count: isLiked ? reply.like_count - 1 : reply.like_count + 1
//                 }
//               : reply
//           )
//         };
//       }
//       return comment;
//     })
//   );

//   try {
//     const headers = await getAuthHeader();
//     await axios.post(
//       `${API_URL}/shorts/comments/${commentId}/like/`,
//       {},
//       { headers }
//     );
//   } catch (error) {
//     console.error('Like Comment Error:', error);
//     // Revert on error
//     setLocalComments(prev => 
//       prev.map(comment => {
//         if (comment.id === commentId) {
//           return {
//             ...comment,
//             is_liked: isLiked,
//             like_count: isLiked ? comment.like_count + 1 : comment.like_count - 1
//           };
//         }
//         if (comment.replies && comment.replies.length > 0) {
//           return {
//             ...comment,
//             replies: comment.replies.map(reply => 
//               reply.id === commentId 
//                 ? {
//                     ...reply,
//                     is_liked: isLiked,
//                     like_count: isLiked ? reply.like_count + 1 : reply.like_count - 1
//                   }
//                 : reply
//             )
//           };
//         }
//         return comment;
//       })
//     );
//   }
// }, []);

// const deleteComment = useCallback(async (commentId) => {
//   Alert.alert(
//     'Delete Comment',
//     'Are you sure you want to delete this comment?',
//     [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           // Optimistic update
//           setLocalComments(prev => prev.filter(c => c.id !== commentId));
          
//           // Also check replies
//           setLocalComments(prev => 
//             prev.map(comment => ({
//               ...comment,
//               replies: comment.replies?.filter(r => r.id !== commentId) || []
//             }))
//           );

//           try {
//             const headers = await getAuthHeader();
//             await axios.delete(
//               `${API_URL}/shorts/comments/${commentId}/delete/`,
//               { headers }
//             );
            
//             setSnackbarMessage('Comment deleted');
//             setSnackbarVisible(true);
            
//           } catch (error) {
//             console.error('Delete Comment Error:', error);
//             Alert.alert('Error', 'Failed to delete comment');
//             // Refresh comments
//             if (selectedShort) {
//               fetchComments(selectedShort.id, 1);
//             }
//           }
//         }
//       }
//     ]
//   );
// }, [selectedShort]);

//   // ==================== SHORT INTERACTIONS ====================
//   const likeShort = async (id) => {
//     try {
//       // Optimistic update
//       setShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 is_liked: !short.is_liked,
//                 like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
//               }
//             : short
//         )
//       );
//       setFilteredShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === id
//             ? {
//                 ...short,
//                 is_liked: !short.is_liked,
//                 like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
//               }
//             : short
//         )
//       );

//       const headers = await getAuthHeader();
//       await axios.post(`${API_URL}/shorts/${id}/like/`, {}, { headers });
//     } catch (error) {
//       console.error('Like Error:', error);
//       // Revert on error
//       fetchShorts(1, true);
//     }
//   };

//   const followUser = async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         Alert.alert('Error', 'Please login to follow users');
//         return;
//       }

//       const currentShort = shorts.find(short => short.user?.id === userId);
//       const isCurrentlyFollowing = currentShort?.is_following || false;

//       // Optimistic update
//       setShorts(prevShorts => 
//         prevShorts.map(short => 
//           short.user?.id === userId 
//             ? { ...short, is_following: !isCurrentlyFollowing } 
//             : short
//         )
//       );
//       setFilteredShorts(prevShorts => 
//         prevShorts.map(short => 
//           short.user?.id === userId 
//             ? { ...short, is_following: !isCurrentlyFollowing } 
//             : short
//         )
//       );

//       const headers = { Authorization: `Bearer ${token}` };

//       if (isCurrentlyFollowing) {
//         await axios.delete(`${API_URL}/unfollow-user/${userId}/`, { headers });
//       } else {
//         await axios.post(`${API_URL}/follow-user/${userId}/`, {}, { headers });
//       }

//       setSnackbarMessage(isCurrentlyFollowing ? 'Unfollowed' : 'Followed');
//       setSnackbarVisible(true);
      
//     } catch (error) {
//       console.error('Follow Error:', error);
//       // Revert on error
//       fetchShorts(1, true);
//     }
//   };

//   const shareShort = async (id, url, caption) => {
//     try {
//       const shareOptions = {
//         title: 'Check out this video!',
//         message: `${caption}\nWatch it here: ${url}`,
//         url: url,
//       };

//       await Share.open(shareOptions);
      
//       const headers = await getAuthHeader();
//       await axios.post(`${API_URL}/shorts/${id}/share/`, { shared_to: 'external' }, { headers });
      
//       setSnackbarMessage('Shared successfully!');
//       setSnackbarVisible(true);
//     } catch (error) {
//       if (error.message !== 'User did not share') {
//         console.error('Share Error:', error.message);
//       }
//     }
//   };

//   // ==================== UI HANDLERS ====================
//   const onRefresh = async () => {
//     setRefreshing(true);
//     setShortsPage(1);
//     setShortsHasMore(true);
//     await fetchShorts(1, true);
//   };

//   const handleLoadMore = () => {
//     if (!loadingShorts && shortsHasMore) {
//       fetchShorts(shortsPage);
//     }
//   };

//   const handleCommentPress = (short) => {
//   setSelectedShort(short);
//   setLocalComments([]);
//   setCommentsPage(1);
//   setCommentsHasMore(true);
//   setReplyToComment(null);
//   setCommentText('');
//   setCommentModalVisible(true);
//   fetchComments(short.id, 1);
// };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === '') {
//       setFilteredShorts(shorts);
//     } else {
//       const filtered = shorts.filter(short => 
//         short.caption?.toLowerCase().includes(query.toLowerCase()) ||
//         short.user?.name?.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredShorts(filtered);
//     }
//   };

//   const handleSearchResultPress = (item) => {
//   setSearchModalVisible(false);
//   setSearchQuery('');
  
//   const index = shorts.findIndex(s => s.id === item.id);
//   if (index !== -1 && flatListRef.current) {
//     if (isFlatListReady) {
//       try {
//         flatListRef.current.scrollToIndex({ 
//           index, 
//           animated: true,
//           viewPosition: 0.5
//         });
//       } catch (error) {
//         console.log('Scroll error, using fallback:', error);
//         // Fallback: manually calculate position
//         flatListRef.current.scrollToOffset({
//           offset: index * height,
//           animated: true
//         });
//       }
//     } else {
//       // If flatlist isn't ready, wait a bit
//       setTimeout(() => {
//         if (flatListRef.current) {
//           try {
//             flatListRef.current.scrollToIndex({ 
//               index, 
//               animated: true,
//               viewPosition: 0.5
//             });
//           } catch (error) {
//             flatListRef.current.scrollToOffset({
//               offset: index * height,
//               animated: true
//             });
//           }
//         }
//       }, 300);
//     }
//   }
// };

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
//       const previousIndex = currentIndex;
      
//       setCurrentIndex(newIndex);
      
//       // Pause previous video, play new one
//       setPausedVideos(prev => {
//         const newState = {};
//         filteredShorts.forEach((_, index) => {
//           newState[index] = index !== newIndex;
//         });
//         return newState;
//       });
      
//       // Force play the new video
//       if (videoRefs.current[newIndex]) {
//         setTimeout(() => {
//           videoRefs.current[newIndex]?.seek(0);
//         }, 100);
//       }
      
//       console.log(`Switched from video ${previousIndex} to ${newIndex}`);
//     }
//   }).current;

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 90,
//   }).current;

//   // ==================== RENDER FUNCTIONS ====================
//   const renderNavBar = () => (
//     <View style={[
//       styles.navBar,
//       Platform.OS === 'ios' && styles.navBarIOS
//     ]}>
//       <View style={styles.tabsContainer}>
//         <TouchableOpacity 
//           style={[styles.navItem, activeTab === 'forYou' && styles.activeNavItem]}
//           onPress={() => setActiveTab('forYou')}
//         >
//           <Text style={[styles.navText, activeTab === 'forYou' && styles.activeNavText]}>For You</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.navItem, activeTab === 'following' && styles.activeNavItem]}
//           onPress={() => setActiveTab('following')}
//         >
//           <Text style={[styles.navText, activeTab === 'following' && styles.activeNavText]}>Following</Text>
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.headerRight}>
//         <TouchableOpacity 
//           style={styles.headerIcon}
//           onPress={() => {
//             setPausedVideos(prev => ({ ...prev, [currentIndex]: true }));
//             setSearchModalVisible(true);
//           }}
//         >
//           <Icon name="search" size={24} color="#fff" />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.headerIcon}
//           onPress={() => navigation.navigate('UploadshortVideo')}
//         >
//           <Icon name="plus" size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderItem = useCallback(({ item, index }) => {
//     const isCurrent = index === currentIndex;
//     const isPaused = pausedVideos[index] || false;
//     const isBuffered = bufferedVideos[item.id] || false;

    

//     const toggleVideoPause = () => {
//       if (isCurrent) {
//         setPausedVideos(prev => ({
//           ...prev,
//           [index]: !prev[index],
//         }));
//       }
//     };

//     return (
//       <TouchableOpacity
//         activeOpacity={1}
//         style={styles.card}
//         onPress={toggleVideoPause}
//       >
        
//        <Video
//   ref={ref => videoRefs.current[index] = ref}
//   source={{ 
//     uri: getOptimizedVideoUrl(item.video),
//     headers: {
//       'Cache-Control': 'max-age=31536000, public',
//     }
//   }}
//   style={styles.video}
//   resizeMode="cover"
//   repeat={true}
//   paused={!isCurrent || isPaused}
//   onLoad={() => {
//     setVideoReady(prev => ({ ...prev, [item.id]: true }));
//     handleVideoLoad(item.id);
//   }}
//   onError={(error) => {
//     console.log(`Video ${item.id} error:`, error);
//     handleVideoError(item.id, error);
//   }}
//   bufferConfig={getBufferConfig(Platform.OS)}
//   poster={item.video_thumbnail}
//   posterResizeMode="cover"
//   playInBackground={false}
//   playWhenInactive={false}
//   ignoreSilentSwitch="ignore"
//   preventsDisplaySleepDuringVideoPlayback={false}
//   progressUpdateInterval={250}
//   // Platform specific
//   useTextureView={Platform.OS === 'android'} // Better Android performance
//   preferredForwardBufferDuration={Platform.OS === 'ios' ? 1 : 2}
// />

// {!videoReady[item.id] && isCurrent && (
//   <Image 
//     source={{ uri: item.video_thumbnail }}
//     style={[styles.video, styles.thumbnail]}
//     resizeMode="cover"
//   />
// )}

//         {isCurrent && !isBuffered && (
//           <View style={styles.bufferingOverlay}>
//             <ActivityIndicator size="large" color="#DC143C" />
//             <Text style={styles.bufferingText}>Buffering...</Text>
//           </View>
//         )}

//         {/* Preload next video */}
//         {filteredShorts && filteredShorts[index + 1] && (
//           <VideoPreloader
//             uri={filteredShorts[index + 1]?.video}
//             isVisible={false}
//             onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
//             onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
//           />
//         )}

//         {/* Debug button to test video URL */}
// <TouchableOpacity
//   onPress={() => {
//     console.log('========== VIDEO DEBUG ==========');
//     console.log('Video ID:', item.id);
//     console.log('Video URL:', item.video);
//     console.log('Is Current:', isCurrent);
//     console.log('Is Paused:', isPaused);
//     console.log('Is Buffered:', isBuffered);
//     console.log('Video Ref exists:', !!videoRefs.current[index]);
    
//     // Test URL in browser
//     fetch(item.video, { method: 'HEAD' })
//       .then(res => {
//         console.log('URL Status:', res.status);
//         console.log('URL Headers:', res.headers);
//       })
//       .catch(err => console.log('URL Error:', err.message));
//   }}
//   style={styles.iconBtn}
// >
//   <Ionicons name="bug" size={30} color="#fff" />
//   <Text style={styles.countText}>Debug</Text>
// </TouchableOpacity>

//         <View style={styles.overlay}>
//           {/* Right Actions */}
//           <View style={styles.rightActions}>
//             {activeTab === 'forYou' && (
//               <TouchableOpacity
//                 onPress={() => followUser(item.user?.id)}
//                 style={[
//                   styles.followButton,
//                   item.is_following && styles.followingButton 
//                 ]}
//               >
//                 <Text style={[
//                   styles.followButtonText,
//                   item.is_following && styles.followingButtonText
//                 ]}>
//                   {item.is_following ? 'Following' : 'Follow'}
//                 </Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => likeShort(item.id)}
//               style={styles.iconBtn}
//             >
//               <Ionicons
//                 name="heart"
//                 size={40}
//                 color={item.is_liked ? '#DC143C' : '#fff'}
//               />
//               <Text style={styles.countText}>{item.like_count || 0}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => handleCommentPress(item)}
//               style={styles.iconBtn}
//             >
//               <Ionicons name="chatbubble-ellipses" size={36} color="#fff" />
//               <Text style={styles.countText}>{item.comment_count || 0}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => shareShort(item.id, item.video, item.caption)}
//               style={styles.iconBtn}
//             >
//               <Ionicons name="arrow-redo" size={36} color="#fff" />
//               <Text style={styles.countText}>Share</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user?.id })}
//               style={styles.userInfo}
//             >
//               <View style={styles.userInfoContent}>
//                   <Image
//                     source={
//                       item.user?.profile_picture
//                         ? { uri: getSecureUrl(item.user.profile_picture) }
//                         : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                     }
//                     style={styles.shortAvatar}
//                   />
//                 <Text style={styles.username}>
//                   @{item.user?.name?.slice(0,8) || 'user'}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             {/* Debug Retry Button */}
//             <TouchableOpacity
//               onPress={() => retryVideo(index)}
//               style={styles.iconBtn}
//             >
//               <Ionicons name="refresh" size={30} color="#fff" />
//               <Text style={styles.countText}>Retry</Text>
//             </TouchableOpacity>
//           </View>

//           {item.caption && (
//             <View style={styles.captionContainer}>
//               <Text style={styles.caption} numberOfLines={2}>
//                 {item.caption}
//               </Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   }, [currentIndex, pausedVideos, activeTab, bufferedVideos, filteredShorts]);

//   // ==================== COMMENT ITEM COMPONENT ====================
//  const CommentItem = memo(({ 
//   comment, 
//   onLike, 
//   onReply, 
//   onDelete,
//   onLoadReplies,
//   expanded,
//   onToggleExpand,
//   level = 0,
//   onReplyPress
// }) => {
//   const [localLiked, setLocalLiked] = useState(comment.is_liked || false);
//   const [localLikeCount, setLocalLikeCount] = useState(comment.like_count || 0);
//   const [replies, setReplies] = useState(comment.replies || []);
//   const [loadingReplies, setLoadingReplies] = useState(false);

//   // Update local state when comment prop changes
//   useEffect(() => {
//     setLocalLiked(comment.is_liked || false);
//     setLocalLikeCount(comment.like_count || 0);
//     setReplies(comment.replies || []);
//   }, [comment]);

//   const handleLike = async () => {
//     const newLiked = !localLiked;
//     const newCount = newLiked ? localLikeCount + 1 : localLikeCount - 1;
    
//     // Optimistic update
//     setLocalLiked(newLiked);
//     setLocalLikeCount(newCount);
    
//     // Call parent's like function
//     await onLike(comment.id, comment.is_liked);
//   };

//   const handleLoadReplies = async () => {
//     setLoadingReplies(true);
//     const loadedReplies = await onLoadReplies(comment.id);
//     setReplies(loadedReplies);
//     setLoadingReplies(false);
//   };

//   const getUserDisplay = () => {
//     if (typeof comment.user === 'string') {
//       return {
//         name: comment.user.split('@')[0],
//         profile_picture: null
//       };
//     }
//     return {
//       name: comment.user?.name || comment.user?.username || 'User',
//       profile_picture: getSecureUrl(comment.user?.profile_picture)
//     };
//   };

//   const user = getUserDisplay();
//   const isOwnComment = comment.is_own || false;

//   return (
//     <View style={[
//       styles.commentContainer,
//       level > 0 && styles.replyContainer
//     ]}>
//       <View style={styles.commentHeader}>
//         <View style={styles.commentUserContainer}>
//           <Image
//             source={
//               user.profile_picture
//                 ? { uri: user.profile_picture }
//                 : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//             }
//             style={styles.commentAvatar}
//           />
//           <View>
//             <Text style={styles.commentUser}>{user.name}</Text>
//             <Text style={styles.commentTime}>
//               {new Date(comment.created_at).toLocaleDateString()}
//             </Text>
//           </View>
//         </View>
        
//         <View style={styles.commentActions}>
//           {isOwnComment && (
//             <TouchableOpacity
//               onPress={() => onDelete(comment.id)}
//               style={styles.commentActionBtn}
//             >
//               <Ionicons name="trash-outline" size={18} color="#FF4444" />
//             </TouchableOpacity>
//           )}
          
//           <TouchableOpacity
//             onPress={handleLike}
//             style={styles.commentActionBtn}
//           >
//             <Ionicons
//               name={localLiked ? 'heart' : 'heart-outline'}
//               size={18}
//               color={localLiked ? '#DC143C' : '#666'}
//             />
//             <Text style={styles.commentLikeCount}>{localLikeCount}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <Text style={styles.commentText}>{comment.text}</Text>

//       <View style={styles.commentFooter}>
//         <TouchableOpacity
//           onPress={() => onReplyPress(comment)}
//           style={styles.replyBtn}
//         >
//           <Text style={styles.replyBtnText}>Reply</Text>
//         </TouchableOpacity>

//         {comment.reply_count > 0 && !expanded && (
//           <TouchableOpacity
//             onPress={() => {
//               onToggleExpand(comment.id);
//               handleLoadReplies();
//             }}
//             style={styles.viewRepliesBtn}
//           >
//             <Text style={styles.viewRepliesText}>
//               View {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {expanded && replies.length > 0 && (
//         <View style={styles.repliesList}>
//           {replies.map(reply => (
//             <CommentItem
//               key={reply.id}
//               comment={reply}
//               onLike={onLike}
//               onReply={onReply}
//               onDelete={onDelete}
//               onLoadReplies={onLoadReplies}
//               expanded={false}
//               onToggleExpand={() => {}}
//               level={level + 1}
//               onReplyPress={onReplyPress}
//             />
//           ))}
//           {loadingReplies && (
//             <ActivityIndicator size="small" color="#DC143C" style={styles.repliesLoader} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// });


//   // ==================== MAIN RENDER ====================
//   return (
//     <SafeAreaView style={styles.container} edges={['right', 'left']}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
      
//       {renderNavBar()}
      
//       <FlatList
//   ref={flatListRef}
//   data={filteredShorts}
//   keyExtractor={(item) => `short-${item.id}`}
//   renderItem={renderItem}
//   pagingEnabled
//   showsVerticalScrollIndicator={false}
//   onViewableItemsChanged={onViewableItemsChanged}
//   viewabilityConfig={viewabilityConfig}
//   removeClippedSubviews={Platform.OS === 'android'}
//   maxToRenderPerBatch={2}
//   updateCellsBatchingPeriod={100}
//   windowSize={3}
//   initialNumToRender={1}
//   contentContainerStyle={styles.flatListContent}
//   decelerationRate="fast"
//   snapToAlignment="start"
//   snapToInterval={height}
//   disableIntervalMomentum={true}
//   scrollEventThrottle={16}
//   onEndReached={handleLoadMore}
//   onEndReachedThreshold={0.5}
//   // Add these props to fix scrollToIndex
//   getItemLayout={getItemLayout}
//   onScrollToIndexFailed={(info) => {
//     console.log('Scroll to index failed, using fallback:', info);
//     const wait = new Promise(resolve => setTimeout(resolve, 500));
//     wait.then(() => {
//       if (flatListRef.current) {
//         flatListRef.current.scrollToIndex({ 
//           index: info.index, 
//           animated: true,
//           viewPosition: 0.5
//         });
//       }
//     });
//   }}
//   onLayout={() => setIsFlatListReady(true)}
//   ListFooterComponent={
//     loadingShorts && filteredShorts.length > 0 ? (
//       <View style={styles.footerLoader}>
//         <ActivityIndicator size="large" color="#DC143C" />
//         <Text style={styles.footerText}>Loading more videos...</Text>
//       </View>
//     ) : null
//   }
//   refreshControl={
//     <RefreshControl
//       refreshing={refreshing}
//       onRefresh={onRefresh}
//       colors={['#DC143C']}
//       tintColor="#fff"
//     />
//   }
//   ListEmptyComponent={
//     <ImageBackground
//       source={require('../assets/images/original.jpg')}
//       style={styles.emptyContainer}
//       imageStyle={{ resizeMode: 'cover' }}
//     >
//       <View style={styles.emptyOverlay}>
//         <Animated.Text
//           style={[
//             styles.emptyTitle,
//             {
//               opacity: fadeAnimEmpty,
//               transform: [{ scale: scaleAnimEmpty }],
//             },
//           ]}
//         >
//           {activeTab === 'following'
//             ? 'Follow creators to see their videos!'
//             : loadingShorts ? 'Loading videos...' : 'No videos available'}
//         </Animated.Text>
//         {!loadingShorts && activeTab === 'forYou' && (
//           <TouchableOpacity 
//             style={styles.refreshButton}
//             onPress={() => fetchShorts(1, true)}
//           >
//             <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ImageBackground>
//   }
// />

//       {/* Comments Modal ============1*/}
    
// <Modal
//         visible={isCommentModalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => {
//           setCommentModalVisible(false);
//           setReplyToComment(null);
//           setCommentText('');
//           setLocalComments([]);
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.commentModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>
//                 Comments ({selectedShort?.comment_count || 0})
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setCommentModalVisible(false);
//                   setReplyToComment(null);
//                   setCommentText('');
//                   setLocalComments([]);
//                 }}
//                 style={styles.modalCloseBtn}
//               >
//                 <Ionicons name="close" size={28} color="#000" />
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={localComments}
//               keyExtractor={(item) => `comment-${item.id}`}
//               renderItem={({ item }) => (
//                 <CommentItem
//                   comment={item}
//                   onLike={likeComment}
//                   onReply={(parentId, text) => 
//                     postComment(selectedShort.id, text, parentId)
//                   }
//                   onDelete={deleteComment}
//                   onLoadReplies={fetchCommentReplies}
//                   expanded={expandedComments[item.id]}
//                   onToggleExpand={(id) => 
//                     setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }))
//                   }
//                   onReplyPress={handleReplyPress}
//                 />
//               )}
//               onEndReached={() => {
//                 if (commentsHasMore && selectedShort && !loadingComments) {
//                   fetchComments(selectedShort.id, commentsPage, true);
//                 }
//               }}
//               onEndReachedThreshold={0.5}
//               ListFooterComponent={
//                 loadingComments && localComments.length > 0 ? (
//                   <View style={styles.commentsLoader}>
//                     <ActivityIndicator size="small" color="#1e14dcff" />
//                   </View>
//                 ) : null
//               }
//               ListEmptyComponent={
//                 <View style={styles.noCommentsContainer}>
//                   <Text style={styles.noCommentsText}>
//                     {loadingComments ? 'Loading comments...' : 'No comments yet'}
//                   </Text>
//                 </View>
//               }
//               contentContainerStyle={styles.commentsList}
//             />

//             {/* Unified Comment Input */}
//             <View style={styles.commentInputWrapper}>
//               {replyToComment && (
//                 <View style={styles.replyingToBar}>
//                   <Text style={styles.replyingToText}>
//                     Replying to @{replyToComment.user?.name || 'user'}
//                   </Text>
//                   <TouchableOpacity 
//                     onPress={() => {
//                       setReplyToComment(null);
//                       setCommentText('');
//                     }}
//                   >
//                     <Ionicons name="close" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               )}
              
//               <View style={styles.commentInputContainer}>
//                 <TextInput
//                   placeholder={replyToComment ? "Write a reply..." : "Add a comment..."}
//                   placeholderTextColor="#999"
//                   value={commentText}
//                   onChangeText={setCommentText}
//                   style={styles.commentInput}
//                   multiline
//                   editable={!isSubmittingComment}
//                 />
//                 <TouchableOpacity
//                   onPress={() => {
//                     if (commentText.trim() && selectedShort && !isSubmittingComment) {
//                       postComment(
//                         selectedShort.id, 
//                         commentText, 
//                         replyToComment?.id || null
//                       );
//                     }
//                   }}
//                   disabled={!commentText.trim() || isSubmittingComment}
//                   style={[
//                     styles.commentSendBtn,
//                     (!commentText.trim() || isSubmittingComment) && styles.commentSendBtnDisabled
//                   ]}
//                 >
//                   {isSubmittingComment ? (
//                     <ActivityIndicator size="small" color="#fff" />
//                   ) : (
//                     <Ionicons name="send" size={24} color="#fff" />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* search modal */}
//       <Modal
//         visible={isSearchModalVisible}
//         animationType="slide"
//         transparent={false}
//         onRequestClose={() => {
//           setSearchModalVisible(false);
//           setSearchQuery('');
//           setFilteredShorts(shorts);
//         }}
//       >
//         <SafeAreaView style={styles.searchModalContainer}>
//           <View style={styles.searchModalHeader}>
//             <View style={styles.searchInputContainer}>
//               <Icon name="search" size={22} color="#6b7280" style={styles.searchIcon} />
//               <TextInput
//                 placeholder="Search videos or creators..."
//                 placeholderTextColor="#6b7280"
//                 value={searchQuery}
//                 onChangeText={handleSearch}
//                 style={styles.searchModalInput}
//                 autoFocus
//                 autoCapitalize="none"
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity 
//                   onPress={() => setSearchQuery('')}
//                   style={styles.clearSearchButton}
//                 >
//                   <Ionicons name="close-circle" size={22} color="#6b7280" />
//                 </TouchableOpacity>
//               )}
//             </View>
//             <TouchableOpacity 
//               onPress={() => {
//                 setSearchModalVisible(false);
//                 setSearchQuery('');
//                 setFilteredShorts(shorts);
//               }}
//             >
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//   data={filteredShorts}
//   keyExtractor={(item) => item.id.toString()}
//   numColumns={2}
//   renderItem={({ item }) => (
//     <SearchVideoThumbnail
//       videoUrl={item.video}
//       username={item.user?.name}
//       caption={item.caption}
//       onPress={() => handleSearchResultPress(item)}
//     />
//   )}
//   ListEmptyComponent={
//     <View style={styles.searchEmptyContainer}>
//       <Icon name="search" size={50} color="#ccc" />
//       <Text style={styles.searchEmptyText}>
//         {searchQuery ? 'No videos found' : 'Search for videos or creators'}
//       </Text>
//     </View>
//   }
//   contentContainerStyle={styles.searchResultsList}
//   showsVerticalScrollIndicator={false}
// />
//         </SafeAreaView>
//       </Modal>
     

//       <BottomNav navigation={navigation} activeRoute="ShortFeed" />

//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//         style={styles.snackbar}
//       >
//         <Text style={styles.snackbarText}>{snackbarMessage}</Text>
//       </Snackbar>
//     </SafeAreaView>
//   );
// };

// export default ShortFeedScreen;
import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,  
  Dimensions,
  Alert,
  Modal,
  Image,
  Platform,
  Animated,
  StatusBar,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import BottomNav from '../components/BottomSocialNav';
import Share from 'react-native-share';

const { height, width } = Dimensions.get('window');
const API_URL = `${API_ROUTE}`;

// Cache keys
const SHORTS_CACHE_KEY = 'cached_shorts_v2';
const COMMENTS_CACHE_KEY_PREFIX = 'cached_comments_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get safe area insets
const getBottomSafeArea = () => {
  if (Platform.OS === 'ios') {
    return 34;
  }
  return 16;
};

const BOTTOM_SAFE_AREA = getBottomSafeArea();

const getBottomContentHeight = () => {
  if (height < 700) return 80;
  if (height < 800) return 100;
  return 120;
};

const BOTTOM_CONTENT_HEIGHT = getBottomContentHeight();

// Helper functions
const getSecureUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('https://')) return url;
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  if (url.startsWith('/')) {
    return `${API_ROUTE_IMAGE.replace('http://', 'https://')}${url}`;
  }
  return url;
};

const getOptimizedVideoUrl = (videoUrl) => {
  if (!videoUrl || !videoUrl.includes('cloudinary')) return videoUrl;
  
  const urlParts = videoUrl.split('.');
  const currentFormat = urlParts.pop()?.toLowerCase();
  
  let optimizedUrl = videoUrl;
  
  if (Platform.OS === 'ios') {
    if (currentFormat !== 'mp4') {
      optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
    }
  } else if (Platform.OS === 'android') {
    if (currentFormat !== 'mp4') {
      optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
    }
  } else {
    optimizedUrl = videoUrl.replace('/upload/', '/upload/f_auto/');
  }
  
  optimizedUrl = optimizedUrl.replace('/upload/', '/upload/q_auto/');
  return optimizedUrl;
};

const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return null;
  if (videoUrl.includes('cloudinary')) {
    return videoUrl.replace('/video/upload/', '/video/upload/w_300,h_500,c_thumb,f_auto,q_auto/');
  }
  return null;
};

// Search Video Thumbnail Component
const SearchVideoThumbnail = memo(({ videoUrl, username, caption, onPress }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.searchResultItem}
    >
      <View style={styles.videoThumbnailContainer}>
        <Video
          ref={videoRef}
          source={{ uri: getOptimizedVideoUrl(videoUrl) }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          paused={true}
          muted={true}
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={(error) => {
            console.log('Video thumbnail error:', error);
            setHasError(true);
            setIsLoading(false);
          }}
        />
        
        {isLoading && (
          <View style={styles.videoLoadingOverlay}>
            <ActivityIndicator size="small" color="#DC143C" />
          </View>
        )}
        
        {hasError && (
          <View style={styles.videoErrorOverlay}>
            <Icon name="alert-circle" size={24} color="#fff" />
            <Text style={styles.errorText}>Failed to load</Text>
          </View>
        )}
        
        <View style={styles.playIconOverlay} pointerEvents="none">
          <View style={styles.playIconCircle}>
            <MaterialIcons name="play-arrow" size={24} color="#fff" />
          </View>
        </View>
        
        <View style={styles.searchInfoOverlay} pointerEvents="none">
          <Text style={styles.searchUserText} numberOfLines={1}>
            @{username || 'user'}
          </Text>
          {caption && (
            <Text style={styles.searchCaptionText} numberOfLines={1}>
              {caption}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Video Preloader Component
const VideoPreloader = memo(({ uri, isVisible, onLoad, onError }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isVisible && videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [isVisible]);

  if (!uri) return null;

  return (
    <Video
      ref={videoRef}
      source={{ uri }}
      style={{ width: 0, height: 0 }}
      paused={true}
      muted={true}
      resizeMode="cover"
      onLoad={onLoad}
      onError={onError}
      ignoreSilentSwitch="ignore"
    />
  );
});

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  card: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: BOTTOM_CONTENT_HEIGHT + BOTTOM_SAFE_AREA + 20,
    alignItems: 'center',
    gap: 16,
  },
  followButton: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#fff',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#000',
  },
  iconBtn: {
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
  userInfo: {
    marginTop: 10,
  },
  userInfoContent: {
    alignItems: 'center',
  },
  shortAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  captionContainer: {
    width: '80%',
    marginBottom: BOTTOM_SAFE_AREA,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  
  // NavBar Styles
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        paddingTop: StatusBar.currentHeight || 44,
      },
      android: {
        paddingTop: StatusBar.currentHeight || 0,
      },
    }),
  },
  navBarIOS: {
    paddingTop: 44,
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  navItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#DC143C',
  },
  navText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  activeNavText: {
    color: '#fff',
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  emptyOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  refreshButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#DC143C',
    borderRadius: 25,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Video Player Styles
  bufferingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 5,
  },
  bufferingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  footerLoader: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  footerText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  flatListContent: {
    paddingTop: 0,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  
  // Search Modal Styles
  searchModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchModalInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  clearSearchButton: {
    padding: 4,
  },
  cancelText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultsList: {
    padding: 8,
  },
  
  // Search Item Styles
  searchResultItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 9/16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  // Video Thumbnail Styles
  videoThumbnailContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  videoErrorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  playIconCircle: {
    backgroundColor: 'rgba(8, 43, 242, 0.8)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    paddingTop: 16,
    zIndex: 1,
  },
  searchUserText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  searchCaptionText: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.9,
    marginTop: 2,
  },
  errorText: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
  },
  
  // Comment Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  commentModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalCloseBtn: {
    padding: 8,
  },
  commentsList: {
    padding: 16,
    paddingBottom: 20,
  },
  commentContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  replyContainer: {
    marginLeft: 20,
    marginTop: 8,
    backgroundColor: '#f0f2f5',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  commentTime: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  commentLikeCount: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  replyBtn: {
    padding: 4,
  },
  replyBtnText: {
    fontSize: 12,
    color: '#DC143C',
    fontWeight: '600',
  },
  viewRepliesBtn: {
    padding: 4,
  },
  viewRepliesText: {
    fontSize: 12,
    color: '#DC143C',
    fontWeight: '600',
  },
  repliesList: {
    marginTop: 12,
  },
  repliesLoader: {
    marginVertical: 8,
  },
  
  // Comment Input Styles
  commentInputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  replyingToBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
  },
  replyingToText: {
    fontSize: 12,
    color: '#666',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    maxHeight: 100,
  },
  commentSendBtn: {
    backgroundColor: '#DC143C',
    borderRadius: 24,
    padding: 12,
  },
  commentSendBtnDisabled: {
    backgroundColor: '#ccc',
  },
  noCommentsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#6b7280',
  },
  commentsLoader: {
    padding: 20,
    alignItems: 'center',
  },
  
  // Search Empty Styles
  searchEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  searchEmptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  
  // Snackbar
  snackbar: {
    backgroundColor: '#080808ff',
    borderRadius: 8,
    margin: 16,
  },
  snackbarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

// ==================== MAIN COMPONENT ====================
const ShortFeedScreen = ({ navigation, route }) => {
  // ==================== STATE ====================
  const [shorts, setShorts] = useState([]);
  const [filteredShorts, setFilteredShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pausedVideos, setPausedVideos] = useState({});
  const [activeTab, setActiveTab] = useState('forYou');
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Pagination states
  const [shortsPage, setShortsPage] = useState(1);
  const [shortsHasMore, setShortsHasMore] = useState(true);
  const [loadingShorts, setLoadingShorts] = useState(false);
  
  // Comment modal states
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedShort, setSelectedShort] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsHasMore, setCommentsHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [followedUserIds, setFollowedUserIds] = useState([]);
  const [videoReady, setVideoReady] = useState({});
  const [replyToComment, setReplyToComment] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [localComments, setLocalComments] = useState([]);
  const [isFlatListReady, setIsFlatListReady] = useState(false);
  
  // Search modal
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Video optimization
  const [preloadedVideos, setPreloadedVideos] = useState({});
  const [bufferedVideos, setBufferedVideos] = useState({});
  const [videoLoadTimes, setVideoLoadTimes] = useState({});
  const videoRefs = useRef({});
  const flatListRef = useRef();
  
  // Animations
  const fadeAnimEmpty = useRef(new Animated.Value(0)).current;
  const scaleAnimEmpty = useRef(new Animated.Value(0.8)).current;

  const VIDEO_CACHE_PREFIX = 'video_cache_';

  const cacheVideoUrl = async (videoId, url) => {
    try {
      await AsyncStorage.setItem(`${VIDEO_CACHE_PREFIX}${videoId}`, url);
    } catch (error) {
      console.error('Error caching video:', error);
    }
  };

  const getItemLayout = (data, index) => ({
    length: height,
    offset: height * index,
    index,
  });

  const getCachedVideoUrl = async (videoId) => {
    try {
      return await AsyncStorage.getItem(`${VIDEO_CACHE_PREFIX}${videoId}`);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/followed-users/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          const ids = response.data.map(user => user.id);
          setFollowedUserIds(ids);
        }
      } catch (error) {
        console.error('Error fetching followed users:', error);
      }
    };
    
    fetchFollowedUsers();
  }, []);

  const isFormatSupported = (videoUrl) => {
    if (!videoUrl) return false;
    const extension = videoUrl.split('.').pop()?.toLowerCase() || '';
    const supportedFormats = ['mp4', 'm4v', 'mov', 'avi'];
    return supportedFormats.includes(extension);
  };

  useEffect(() => {
    if (!shorts || shorts.length === 0) return;
    
    let filtered = [];
    
    if (activeTab === 'forYou') {
      filtered = [...shorts].sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
    } else {
      filtered = shorts.filter(short => followedUserIds.includes(short.user?.id));
    }
    
    setFilteredShorts(filtered);
    
    if (filtered.length > 0) {
      const initialPausedState = {};
      filtered.forEach((_, index) => {
        initialPausedState[index] = index !== 0;
      });
      setPausedVideos(initialPausedState);
      setCurrentIndex(0);
    }
  }, [activeTab, shorts, followedUserIds]);

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const getCurrentUser = async () => {
    const json = await AsyncStorage.getItem('userData');
    const parsed = json ? JSON.parse(json) : null;
    return {
      id: parsed?.id,
      name: parsed?.name || 'User',
      username: parsed?.username || parsed?.name || 'User',
      profile_picture: parsed?.profile_picture || null
    };
  };

  const getCachedShorts = async () => {
    try {
      const cached = await AsyncStorage.getItem(SHORTS_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(data)) {
          return data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const setCachedShorts = async (data) => {
    try {
      await AsyncStorage.setItem(
        SHORTS_CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error saving shorts cache:', error);
    }
  };

  const getCachedComments = async (shortId) => {
    try {
      const cached = await AsyncStorage.getItem(`${COMMENTS_CACHE_KEY_PREFIX}${shortId}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(data)) {
          return data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const setCachedComments = async (shortId, data) => {
    try {
      await AsyncStorage.setItem(
        `${COMMENTS_CACHE_KEY_PREFIX}${shortId}`,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error saving comments cache:', error);
    }
  };

  const playVideo = useCallback((index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].seek(0);
      setPausedVideos(prev => ({
        ...prev,
        [index]: false,
      }));
    }
  }, []);

  const pauseVideo = useCallback((index) => {
    if (videoRefs.current[index]) {
      setPausedVideos(prev => ({
        ...prev,
        [index]: true,
      }));
    }
  }, []);

  const preloadVideos = useCallback((videos) => {
    videos.forEach((video) => {
      if (video?.video && !preloadedVideos[video.id]) {
        setPreloadedVideos(prev => ({
          ...prev,
          [video.id]: true,
        }));
      }
    });
  }, [preloadedVideos]);

  const handleVideoLoad = useCallback((videoId) => {
    setVideoLoadTimes(prev => ({
      ...prev,
      [videoId]: Date.now(),
    }));
    setBufferedVideos(prev => ({
      ...prev,
      [videoId]: true,
    }));
  }, []);

  const handleVideoError = useCallback((videoId, error) => {
    console.log(`Video ${videoId} error:`, error);
  }, []);

  const getBufferConfig = (platform) => {
    if (platform === 'ios') {
      return {
        minBufferMs: 500,
        maxBufferMs: 3000,
        bufferForPlaybackMs: 200,
        bufferForPlaybackAfterRebufferMs: 500,
      };
    } else {
      return {
        minBufferMs: 1000,
        maxBufferMs: 4000,
        bufferForPlaybackMs: 500,
        bufferForPlaybackAfterRebufferMs: 1000,
      };
    }
  };

  const initializeVideoStates = (data) => {
    const initialPausedState = {};
    data.forEach((_, index) => {
      initialPausedState[index] = index !== 0;
    });
    setPausedVideos(initialPausedState);
  };

  const retryVideo = useCallback((index) => {
    if (videoRefs.current[index]) {
      setPausedVideos(prev => ({
        ...prev,
        [index]: true,
      }));
      
      setTimeout(() => {
        setPausedVideos(prev => ({
          ...prev,
          [index]: false,
        }));
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (filteredShorts.length > 0) {
      fetch(filteredShorts[0]?.video, { method: 'HEAD' })
        .then(response => {
          console.log('Video URL status:', response.status);
        })
        .catch(error => {
          console.log('Video URL error:', error);
        });
    }
  }, [filteredShorts]);

  useEffect(() => {
    if (filteredShorts.length === 0) {
      fadeAnimEmpty.setValue(0);
      scaleAnimEmpty.setValue(0.8);
      Animated.parallel([
        Animated.timing(fadeAnimEmpty, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimEmpty, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [filteredShorts.length]);

  useEffect(() => {
    if (route.params?.newShort) {
      setSnackbarMessage('Short uploaded successfully!');
      setSnackbarVisible(true);
      fetchShorts(1, true);
    }
  }, [route.params?.newShort]);

  useEffect(() => {
    fetchShorts(1);
    setShortsPage(1);
    setShortsHasMore(true);
  }, [activeTab]);

  useEffect(() => {
    if (filteredShorts.length > 0) {
      const videosToPreload = filteredShorts.slice(
        Math.max(0, currentIndex - 1),
        Math.min(filteredShorts.length, currentIndex + 3)
      );
      preloadVideos(videosToPreload);
    }
  }, [filteredShorts, currentIndex]);

  const fetchShorts = useCallback(async (pageNum = 1, isRefreshing = false) => {
    if (loadingShorts || (!shortsHasMore && !isRefreshing)) {
      return;
    }
    
    setLoadingShorts(true);
    try {
      if (pageNum === 1) {
        const cachedShorts = await getCachedShorts();
        if (cachedShorts && Array.isArray(cachedShorts)) {
          setShorts(cachedShorts);
          setFilteredShorts(cachedShorts);
          initializeVideoStates(cachedShorts);
        }
      }

      const headers = await getAuthHeader();
      const endpoint = `${API_URL}/shorts/`;
      
      const response = await axios.get(endpoint, { 
        headers,
        params: {
          page: pageNum,
          page_size: 5
        }
      });

      if (response.status === 200) {
        let newShorts = [];
        
        if (Array.isArray(response.data)) {
          newShorts = response.data;
          setShortsHasMore(false);
        } else if (response.data.results && Array.isArray(response.data.results)) {
          newShorts = response.data.results;
          setShortsHasMore(!!response.data.next);
        }
        
        let processedShorts = newShorts.map(short => {
          const videoUrl = short.video?.replace(/\/\//g, '/').replace(':/', '://');
          const extension = videoUrl?.split('.').pop()?.toLowerCase() || '';
          
          return {
            ...short,
            video: videoUrl,
            video_mp4: videoUrl?.replace(/\.webm$/, '.mp4'),
            video_format: extension,
            is_supported: ['mp4', 'mov', 'm4v'].includes(extension),
            video_thumbnail: getVideoThumbnail(videoUrl),
          };
        });

        if (isRefreshing || pageNum === 1) {
          setShorts(processedShorts);
          setFilteredShorts(processedShorts);
          initializeVideoStates(processedShorts);
        } else {
          setShorts(prev => [...(prev || []), ...processedShorts]);
          setFilteredShorts(prev => [...(prev || []), ...processedShorts]);
        }
        
        if (!isRefreshing) {
          setShortsPage(pageNum + 1);
        }
        
        if (pageNum === 1 && processedShorts.length > 0) {
          await setCachedShorts(processedShorts);
        }
        
        if (processedShorts.length > 0) {
          preloadVideos(processedShorts.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Fetch Shorts Error:', error.message);
    } finally {
      setLoadingShorts(false);
      setRefreshing(false);
    }
  }, [activeTab, shortsPage, shortsHasMore, loadingShorts]);

  const fetchComments = useCallback(async (shortId, page = 1, isLoadMore = false) => {
    if (loadingComments || (!commentsHasMore && isLoadMore)) return;
    
    setLoadingComments(true);
    try {
      if (page === 1) {
        const cachedComments = await getCachedComments(shortId);
        if (cachedComments && Array.isArray(cachedComments)) {
          const cachedWithHttps = cachedComments.map(comment => ({
            ...comment,
            user: {
              ...comment.user,
              profile_picture: getSecureUrl(comment.user?.profile_picture)
            },
            replies: comment.replies?.map(reply => ({
              ...reply,
              user: {
                ...reply.user,
                profile_picture: getSecureUrl(reply.user?.profile_picture)
              }
            })) || []
          }));
          setLocalComments(cachedWithHttps);
        }
      }

      const headers = await getAuthHeader();
      const response = await axios.get(
        `${API_URL}/shorts/${shortId}/comments/`,
        { 
          headers,
          params: {
            page: page,
            page_size: 20
          }
        }
      );
      
      if (response.status === 200) {
        let newComments = [];
        if (response.data.results && Array.isArray(response.data.results)) {
          newComments = response.data.results;
          setCommentsHasMore(!!response.data.next);
          setCommentsPage(page + 1);
        } else if (Array.isArray(response.data)) {
          newComments = response.data;
          setCommentsHasMore(false);
        }
        
        const currentUser = await getCurrentUser();
        const commentsWithOwn = newComments.map(comment => ({
          ...comment,
          is_own: comment.user?.id === currentUser.id,
          like_count: comment.like_count || 0,
          is_liked: comment.is_liked || false,
          user: {
            ...comment.user,
            profile_picture: getSecureUrl(comment.user?.profile_picture)
          },
          replies: comment.replies?.map(reply => ({
            ...reply,
            is_own: reply.user?.id === currentUser.id,
            like_count: reply.like_count || 0,
            is_liked: reply.is_liked || false,
            user: {
              ...reply.user,
              profile_picture: getSecureUrl(reply.user?.profile_picture)
            }
          })) || []
        }));
        
        setLocalComments(prev => {
          if (page === 1) return commentsWithOwn;
          const existingIds = new Set(prev.map(c => c.id));
          const newUnique = commentsWithOwn.filter(c => !existingIds.has(c.id));
          return [...prev, ...newUnique];
        });
        
        if (page === 1) {
          await setCachedComments(shortId, commentsWithOwn);
        }
      }
    } catch (error) {
      console.error('Fetch Comments Error:', error);
      if (page === 1) {
        setLocalComments([]);
      }
    } finally {
      setLoadingComments(false);
    }
  }, [loadingComments, commentsHasMore]);

  const handleReplyPress = (comment) => {
    setReplyToComment(comment);
    setCommentText(`@${comment.user?.name || 'user'} `);
  };

  const fetchCommentReplies = useCallback(async (commentId) => {
    try {
      const headers = await getAuthHeader();
      const response = await axios.get(
        `${API_URL}/shorts/comments/${commentId}/replies/`,
        { headers }
      );
      
      if (response.status === 200) {
        const currentUser = await getCurrentUser();
        return response.data.replies.map(reply => ({
          ...reply,
          is_own: reply.user?.id === currentUser.id,
          like_count: reply.like_count || 0,
          is_liked: reply.is_liked || false,
          user: {
            ...reply.user,
            profile_picture: getSecureUrl(reply.user?.profile_picture)
          }
        }));
      }
      return [];
    } catch (error) {
      console.error('Fetch Replies Error:', error);
      return [];
    }
  }, []);

  const postComment = useCallback(async (shortId, text, parentId = null) => {
    if (!text.trim() || isSubmittingComment) return null;

    setIsSubmittingComment(true);
    try {
      const currentUser = await getCurrentUser();
      const headers = await getAuthHeader();
      
      const requestData = { 
        text: text.trim(),
        ...(parentId && { parent: parentId })
      };
      
      const tempId = Date.now();
      const optimisticComment = {
        id: tempId,
        text: text.trim(),
        user: {
          ...currentUser,
          profile_picture: getSecureUrl(currentUser.profile_picture)
        },
        created_at: new Date().toISOString(),
        like_count: 0,
        reply_count: 0,
        is_liked: false,
        is_own: true,
        replies: [],
        parent: parentId
      };

      if (parentId) {
        setLocalComments(prev => 
          prev.map(comment => 
            comment.id === parentId 
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), optimisticComment],
                  reply_count: (comment.reply_count || 0) + 1
                }
              : comment
          )
        );
      } else {
        setLocalComments(prev => [optimisticComment, ...prev]);
      }

      if (selectedShort) {
        setSelectedShort(prev => ({
          ...prev,
          comment_count: (prev.comment_count || 0) + 1
        }));
      }

      setCommentText('');
      setReplyToComment(null);

      const response = await axios.post(
        `${API_URL}/shorts/${shortId}/comment/`,
        requestData,
        { headers }
      );

      if (response.data) {
        const realComment = {
          ...response.data,
          is_own: true,
          like_count: 0,
          is_liked: false,
          user: {
            ...currentUser,
            profile_picture: getSecureUrl(currentUser.profile_picture)
          }
        };

        setLocalComments(prev => {
          if (parentId) {
            return prev.map(comment => 
              comment.id === parentId 
                ? { 
                    ...comment, 
                    replies: comment.replies.map(r => 
                      r.id === tempId ? realComment : r
                    )
                  }
                : comment
            );
          } else {
            return prev.map(c => c.id === tempId ? realComment : c);
          }
        });
      }

      return response.data;
      
    } catch (error) {
      console.error('Error posting comment:', error.response?.data || error.message);
      
      setLocalComments(prev => 
        prev.filter(c => c.id !== Date.now())
      );
      
      Alert.alert('Error', 'Failed to post comment. Please try again.');
      throw error;
    } finally {
      setIsSubmittingComment(false);
    }
  }, [selectedShort, isSubmittingComment]);

  const likeComment = useCallback(async (commentId, isLiked) => {
    setLocalComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            is_liked: !isLiked,
            like_count: isLiked ? comment.like_count - 1 : comment.like_count + 1
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? {
                    ...reply,
                    is_liked: !isLiked,
                    like_count: isLiked ? reply.like_count - 1 : reply.like_count + 1
                  }
                : reply
            )
          };
        }
        return comment;
      })
    );

    try {
      const headers = await getAuthHeader();
      await axios.post(
        `${API_URL}/shorts/comments/${commentId}/like/`,
        {},
        { headers }
      );
    } catch (error) {
      console.error('Like Comment Error:', error);
      setLocalComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: isLiked,
              like_count: isLiked ? comment.like_count + 1 : comment.like_count - 1
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? {
                      ...reply,
                      is_liked: isLiked,
                      like_count: isLiked ? reply.like_count + 1 : reply.like_count - 1
                    }
                  : reply
              )
            };
          }
          return comment;
        })
      );
    }
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLocalComments(prev => prev.filter(c => c.id !== commentId));
            setLocalComments(prev => 
              prev.map(comment => ({
                ...comment,
                replies: comment.replies?.filter(r => r.id !== commentId) || []
              }))
            );

            try {
              const headers = await getAuthHeader();
              await axios.delete(
                `${API_URL}/shorts/comments/${commentId}/delete/`,
                { headers }
              );
              
              setSnackbarMessage('Comment deleted');
              setSnackbarVisible(true);
              
            } catch (error) {
              console.error('Delete Comment Error:', error);
              Alert.alert('Error', 'Failed to delete comment');
              if (selectedShort) {
                fetchComments(selectedShort.id, 1);
              }
            }
          }
        }
      ]
    );
  }, [selectedShort]);

  const likeShort = async (id) => {
    try {
      setShorts(prevShorts =>
        prevShorts.map(short =>
          short.id === id
            ? {
                ...short,
                is_liked: !short.is_liked,
                like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
              }
            : short
        )
      );
      setFilteredShorts(prevShorts =>
        prevShorts.map(short =>
          short.id === id
            ? {
                ...short,
                is_liked: !short.is_liked,
                like_count: short.is_liked ? short.like_count - 1 : short.like_count + 1,
              }
            : short
        )
      );

      const headers = await getAuthHeader();
      await axios.post(`${API_URL}/shorts/${id}/like/`, {}, { headers });
    } catch (error) {
      console.error('Like Error:', error);
      fetchShorts(1, true);
    }
  };

  const followUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to follow users');
        return;
      }

      const currentShort = shorts.find(short => short.user?.id === userId);
      const isCurrentlyFollowing = currentShort?.is_following || false;

      setShorts(prevShorts => 
        prevShorts.map(short => 
          short.user?.id === userId 
            ? { ...short, is_following: !isCurrentlyFollowing } 
            : short
        )
      );
      setFilteredShorts(prevShorts => 
        prevShorts.map(short => 
          short.user?.id === userId 
            ? { ...short, is_following: !isCurrentlyFollowing } 
            : short
        )
      );

      const headers = { Authorization: `Bearer ${token}` };

      if (isCurrentlyFollowing) {
        await axios.delete(`${API_URL}/unfollow-user/${userId}/`, { headers });
      } else {
        await axios.post(`${API_URL}/follow-user/${userId}/`, {}, { headers });
      }

      setSnackbarMessage(isCurrentlyFollowing ? 'Unfollowed' : 'Followed');
      setSnackbarVisible(true);
      
    } catch (error) {
      console.error('Follow Error:', error);
      fetchShorts(1, true);
    }
  };

  const shareShort = async (id, url, caption) => {
    try {
      const shareOptions = {
        title: 'Check out this video!',
        message: `${caption}\nWatch it here: ${url}`,
        url: url,
      };

      await Share.open(shareOptions);
      
      const headers = await getAuthHeader();
      await axios.post(`${API_URL}/shorts/${id}/share/`, { shared_to: 'external' }, { headers });
      
      setSnackbarMessage('Shared successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share Error:', error.message);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setShortsPage(1);
    setShortsHasMore(true);
    await fetchShorts(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingShorts && shortsHasMore) {
      fetchShorts(shortsPage);
    }
  };

  const handleCommentPress = (short) => {
    setSelectedShort(short);
    setLocalComments([]);
    setCommentsPage(1);
    setCommentsHasMore(true);
    setReplyToComment(null);
    setCommentText('');
    setCommentModalVisible(true);
    fetchComments(short.id, 1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredShorts(shorts);
    } else {
      const filtered = shorts.filter(short => 
        short.caption?.toLowerCase().includes(query.toLowerCase()) ||
        short.user?.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredShorts(filtered);
    }
  };

  const handleSearchResultPress = (item) => {
    setSearchModalVisible(false);
    setSearchQuery('');
    
    const index = shorts.findIndex(s => s.id === item.id);
    if (index !== -1 && flatListRef.current) {
      if (isFlatListReady) {
        try {
          flatListRef.current.scrollToIndex({ 
            index, 
            animated: true,
            viewPosition: 0.5
          });
        } catch (error) {
          flatListRef.current.scrollToOffset({
            offset: index * height,
            animated: true
          });
        }
      } else {
        setTimeout(() => {
          if (flatListRef.current) {
            try {
              flatListRef.current.scrollToIndex({ 
                index, 
                animated: true,
                viewPosition: 0.5
              });
            } catch (error) {
              flatListRef.current.scrollToOffset({
                offset: index * height,
                animated: true
              });
            }
          }
        }, 300);
      }
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      
      setCurrentIndex(newIndex);
      
      setPausedVideos(prev => {
        const newState = {};
        filteredShorts.forEach((_, index) => {
          newState[index] = index !== newIndex;
        });
        return newState;
      });
      
      if (videoRefs.current[newIndex]) {
        setTimeout(() => {
          videoRefs.current[newIndex]?.seek(0);
        }, 100);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 90,
  }).current;

  const renderNavBar = () => (
    <View style={[
      styles.navBar,
      Platform.OS === 'ios' && styles.navBarIOS
    ]}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'forYou' && styles.activeNavItem]}
          onPress={() => setActiveTab('forYou')}
        >
          <Text style={[styles.navText, activeTab === 'forYou' && styles.activeNavText]}>For You</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'following' && styles.activeNavItem]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.navText, activeTab === 'following' && styles.activeNavText]}>Following</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={() => {
            setPausedVideos(prev => ({ ...prev, [currentIndex]: true }));
            setSearchModalVisible(true);
          }}
        >
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={() => navigation.navigate('UploadshortVideo')}
        >
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = useCallback(({ item, index }) => {
    const isCurrent = index === currentIndex;
    const isPaused = pausedVideos[index] || false;
    const isBuffered = bufferedVideos[item.id] || false;

    const toggleVideoPause = () => {
      if (isCurrent) {
        setPausedVideos(prev => ({
          ...prev,
          [index]: !prev[index],
        }));
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.card}
        onPress={toggleVideoPause}
      >
        <Video
          ref={ref => videoRefs.current[index] = ref}
          source={{ 
            uri: getOptimizedVideoUrl(item.video),
            headers: {
              'Cache-Control': 'max-age=31536000, public',
            }
          }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={!isCurrent || isPaused}
          onLoad={() => {
            setVideoReady(prev => ({ ...prev, [item.id]: true }));
            handleVideoLoad(item.id);
          }}
          onError={(error) => {
            console.log(`Video ${item.id} error:`, error);
            handleVideoError(item.id, error);
          }}
          bufferConfig={getBufferConfig(Platform.OS)}
          poster={item.video_thumbnail}
          posterResizeMode="cover"
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          preventsDisplaySleepDuringVideoPlayback={false}
          progressUpdateInterval={250}
          useTextureView={Platform.OS === 'android'}
          preferredForwardBufferDuration={Platform.OS === 'ios' ? 1 : 2}
        />

        {!videoReady[item.id] && isCurrent && (
          <Image 
            source={{ uri: item.video_thumbnail }}
            style={[styles.video, styles.thumbnail]}
            resizeMode="cover"
          />
        )}

        {isCurrent && !isBuffered && (
          <View style={styles.bufferingOverlay}>
            <ActivityIndicator size="large" color="#DC143C" />
            <Text style={styles.bufferingText}>Buffering...</Text>
          </View>
        )}

        {filteredShorts && filteredShorts[index + 1] && (
          <VideoPreloader
            uri={filteredShorts[index + 1]?.video}
            isVisible={false}
            onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
            onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
          />
        )}

        <View style={styles.overlay}>
          <View style={styles.rightActions}>
            {activeTab === 'forYou' && (
              <TouchableOpacity
                onPress={() => followUser(item.user?.id)}
                style={[
                  styles.followButton,
                  item.is_following && styles.followingButton 
                ]}
              >
                <Text style={[
                  styles.followButtonText,
                  item.is_following && styles.followingButtonText
                ]}>
                  {item.is_following ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => likeShort(item.id)}
              style={styles.iconBtn}
            >
              <Ionicons
                name="heart"
                size={40}
                color={item.is_liked ? '#DC143C' : '#fff'}
              />
              <Text style={styles.countText}>{item.like_count || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCommentPress(item)}
              style={styles.iconBtn}
            >
              <Ionicons name="chatbubble-ellipses" size={36} color="#fff" />
              <Text style={styles.countText}>{item.comment_count || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareShort(item.id, item.video, item.caption)}
              style={styles.iconBtn}
            >
              <Ionicons name="arrow-redo" size={36} color="#fff" />
              <Text style={styles.countText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user?.id })}
              style={styles.userInfo}
            >
              <View style={styles.userInfoContent}>
                <Image
                  source={
                    item.user?.profile_picture
                      ? { uri: getSecureUrl(item.user.profile_picture) }
                      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={styles.shortAvatar}
                />
                <Text style={styles.username}>
                  @{item.user?.name?.slice(0,8) || 'user'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => retryVideo(index)}
              style={styles.iconBtn}
            >
              <Ionicons name="refresh" size={30} color="#fff" />
              <Text style={styles.countText}>Retry</Text>
            </TouchableOpacity> */}
          </View>

          {item.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.caption} numberOfLines={2}>
                {item.caption}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [currentIndex, pausedVideos, activeTab, bufferedVideos, filteredShorts]);

  const CommentItem = memo(({ 
    comment, 
    onLike, 
    onReply, 
    onDelete,
    onLoadReplies,
    expanded,
    onToggleExpand,
    level = 0,
    onReplyPress
  }) => {
    const [localLiked, setLocalLiked] = useState(comment.is_liked || false);
    const [localLikeCount, setLocalLikeCount] = useState(comment.like_count || 0);
    const [replies, setReplies] = useState(comment.replies || []);
    const [loadingReplies, setLoadingReplies] = useState(false);

    useEffect(() => {
      setLocalLiked(comment.is_liked || false);
      setLocalLikeCount(comment.like_count || 0);
      setReplies(comment.replies || []);
    }, [comment]);

    const handleLike = async () => {
      const newLiked = !localLiked;
      const newCount = newLiked ? localLikeCount + 1 : localLikeCount - 1;
      
      setLocalLiked(newLiked);
      setLocalLikeCount(newCount);
      
      await onLike(comment.id, comment.is_liked);
    };

    const handleLoadReplies = async () => {
      setLoadingReplies(true);
      const loadedReplies = await onLoadReplies(comment.id);
      setReplies(loadedReplies);
      setLoadingReplies(false);
    };

    const getUserDisplay = () => {
      if (typeof comment.user === 'string') {
        return {
          name: comment.user.split('@')[0],
          profile_picture: null
        };
      }
      return {
        name: comment.user?.name || comment.user?.username || 'User',
        profile_picture: getSecureUrl(comment.user?.profile_picture)
      };
    };

    const user = getUserDisplay();
    const isOwnComment = comment.is_own || false;

    return (
      <View style={[
        styles.commentContainer,
        level > 0 && styles.replyContainer
      ]}>
        <View style={styles.commentHeader}>
          <View style={styles.commentUserContainer}>
            <Image
              source={
                user.profile_picture
                  ? { uri: user.profile_picture }
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.commentAvatar}
            />
            <View>
              <Text style={styles.commentUser}>{user.name}</Text>
              <Text style={styles.commentTime}>
                {new Date(comment.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.commentActions}>
            {isOwnComment && (
              <TouchableOpacity
                onPress={() => onDelete(comment.id)}
                style={styles.commentActionBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#FF4444" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={handleLike}
              style={styles.commentActionBtn}
            >
              <Ionicons
                name={localLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={localLiked ? '#DC143C' : '#666'}
              />
              <Text style={styles.commentLikeCount}>{localLikeCount}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.commentText}>{comment.text}</Text>

        <View style={styles.commentFooter}>
          <TouchableOpacity
            onPress={() => onReplyPress(comment)}
            style={styles.replyBtn}
          >
            <Text style={styles.replyBtnText}>Reply</Text>
          </TouchableOpacity>

          {comment.reply_count > 0 && !expanded && (
            <TouchableOpacity
              onPress={() => {
                onToggleExpand(comment.id);
                handleLoadReplies();
              }}
              style={styles.viewRepliesBtn}
            >
              <Text style={styles.viewRepliesText}>
                View {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {expanded && replies.length > 0 && (
          <View style={styles.repliesList}>
            {replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onLike={onLike}
                onReply={onReply}
                onDelete={onDelete}
                onLoadReplies={onLoadReplies}
                expanded={false}
                onToggleExpand={() => {}}
                level={level + 1}
                onReplyPress={onReplyPress}
              />
            ))}
            {loadingReplies && (
              <ActivityIndicator size="small" color="#DC143C" style={styles.repliesLoader} />
            )}
          </View>
        )}
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {renderNavBar()}
      
      <FlatList
        ref={flatListRef}
        data={filteredShorts}
        keyExtractor={(item) => `short-${item.id}`}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        initialNumToRender={1}
        contentContainerStyle={styles.flatListContent}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={height}
        disableIntervalMomentum={true}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ 
                index: info.index, 
                animated: true,
                viewPosition: 0.5
              });
            }
          });
        }}
        onLayout={() => setIsFlatListReady(true)}
        ListFooterComponent={
          loadingShorts && filteredShorts.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color="#DC143C" />
              <Text style={styles.footerText}>Loading more videos...</Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#DC143C']}
            tintColor="#fff"
          />
        }
        ListEmptyComponent={
          <ImageBackground
            source={require('../assets/images/original.jpg')}
            style={styles.emptyContainer}
            imageStyle={{ resizeMode: 'cover' }}
          >
            <View style={styles.emptyOverlay}>
              <Animated.Text
                style={[
                  styles.emptyTitle,
                  {
                    opacity: fadeAnimEmpty,
                    transform: [{ scale: scaleAnimEmpty }],
                  },
                ]}
              >
                {activeTab === 'following'
                  ? 'Follow creators to see their videos!'
                  : loadingShorts ? 'Loading videos...' : 'No videos available'}
              </Animated.Text>
              {!loadingShorts && activeTab === 'forYou' && (
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={() => fetchShorts(1, true)}
                >
                  <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
        }
      />

      {/* Comments Modal */}
      <Modal
        visible={isCommentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setCommentModalVisible(false);
          setReplyToComment(null);
          setCommentText('');
          setLocalComments([]);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Comments ({selectedShort?.comment_count || 0})
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCommentModalVisible(false);
                  setReplyToComment(null);
                  setCommentText('');
                  setLocalComments([]);
                }}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={localComments}
              keyExtractor={(item) => `comment-${item.id}`}
              renderItem={({ item }) => (
                <CommentItem
                  comment={item}
                  onLike={likeComment}
                  onReply={(parentId, text) => 
                    postComment(selectedShort.id, text, parentId)
                  }
                  onDelete={deleteComment}
                  onLoadReplies={fetchCommentReplies}
                  expanded={expandedComments[item.id]}
                  onToggleExpand={(id) => 
                    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }))
                  }
                  onReplyPress={handleReplyPress}
                />
              )}
              onEndReached={() => {
                if (commentsHasMore && selectedShort && !loadingComments) {
                  fetchComments(selectedShort.id, commentsPage, true);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingComments && localComments.length > 0 ? (
                  <View style={styles.commentsLoader}>
                    <ActivityIndicator size="small" color="#DC143C" />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.noCommentsContainer}>
                  <Text style={styles.noCommentsText}>
                    {loadingComments ? 'Loading comments...' : 'No comments yet'}
                  </Text>
                </View>
              }
              contentContainerStyle={styles.commentsList}
            />

            <View style={styles.commentInputWrapper}>
              {replyToComment && (
                <View style={styles.replyingToBar}>
                  <Text style={styles.replyingToText}>
                    Replying to @{replyToComment.user?.name || 'user'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setReplyToComment(null);
                      setCommentText('');
                    }}
                  >
                    <Ionicons name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.commentInputContainer}>
                <TextInput
                  placeholder={replyToComment ? "Write a reply..." : "Add a comment..."}
                  placeholderTextColor="#999"
                  value={commentText}
                  onChangeText={setCommentText}
                  style={styles.commentInput}
                  multiline
                  editable={!isSubmittingComment}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (commentText.trim() && selectedShort && !isSubmittingComment) {
                      postComment(
                        selectedShort.id, 
                        commentText, 
                        replyToComment?.id || null
                      );
                    }
                  }}
                  disabled={!commentText.trim() || isSubmittingComment}
                  style={[
                    styles.commentSendBtn,
                    (!commentText.trim() || isSubmittingComment) && styles.commentSendBtnDisabled
                  ]}
                >
                  {isSubmittingComment ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="send" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Modal */}
      <Modal
        visible={isSearchModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setSearchModalVisible(false);
          setSearchQuery('');
          setFilteredShorts(shorts);
        }}
      >
        <SafeAreaView style={styles.searchModalContainer}>
          <View style={styles.searchModalHeader}>
            <View style={[styles.searchInputContainer,{marginTop:30}]}>
              <Icon name="search" size={22} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                placeholder="Search videos or creators..."
                placeholderTextColor="#6b7280"
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchModalInput}
                autoFocus
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchButton}
                >
                  <Ionicons name="close-circle" size={22} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              onPress={() => {
                setSearchModalVisible(false);
                setSearchQuery('');
                setFilteredShorts(shorts);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredShorts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <SearchVideoThumbnail
                videoUrl={item.video}
                username={item.user?.name}
                caption={item.caption}
                onPress={() => handleSearchResultPress(item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.searchEmptyContainer}>
                <Icon name="search" size={50} color="#ccc" />
                <Text style={styles.searchEmptyText}>
                  {searchQuery ? 'No videos found' : 'Search for videos or creators'}
                </Text>
              </View>
            }
            contentContainerStyle={styles.searchResultsList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>

      <BottomNav navigation={navigation} activeRoute="ShortFeed" />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </SafeAreaView>
  );
};

export default ShortFeedScreen;




  
