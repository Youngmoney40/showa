

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
//   ScrollView,
//   Modal,
//   Image,
//   Platform,
//   Animated,
//   StatusBar,
//   RefreshControl,
//   ImageBackground,
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

// // Get safe area insets for different devices
// const getBottomSafeArea = () => {
//   // Adjust based on your device safe areas
//   if (Platform.OS === 'ios') {
//     return 34; // iPhone home indicator area
//   }
//   return 16; // Android default padding
// };

// const BOTTOM_SAFE_AREA = getBottomSafeArea();

// // Calculate responsive bottom content height based on screen size
// const getBottomContentHeight = () => {
//   if (height < 700) return 80; // Small phones
//   if (height < 800) return 100; // Medium phones
//   return 120; // Large phones
// };

// const BOTTOM_CONTENT_HEIGHT = getBottomContentHeight(); 

// // Memoized Comment Item
// const MemoizedCommentItem = memo(({ cmt, onLongPress, onLike, likedComments, expandedReplies, onToggleReplies }) => {
//   const commentUser = getCommentUser(cmt);
  
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
//                 uri: commentUser.profile_picture
//                   ? `${commentUser.profile_picture}`
//                   : undefined,
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
//         return (
//           <View key={reply.id} style={styles.replyContainer}>
//             <View style={styles.replyHeader}>
//               <View style={styles.replyUserContainer}>
//                 <Image
//                   source={{
//                     uri: replyUser.profile_picture
//                       ? `${API_ROUTE_IMAGE}${replyUser.profile_picture}`
//                       : undefined,
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


//   const fullText = activeTab === 'following'
//       ? 'Follow some creators to see their videos!'
//       : 'Discover amazing shorts! Loading short...';


//       useEffect(() => {
//       setTypedText('');
//       let i = 0;
//       const interval = setInterval(() => {
//         if (i < fullText.length) {
//           setTypedText((prev) => prev + fullText[i]);
//           i++;
//         } else {
//           clearInterval(interval);
//           // Optionally, restart typing after a delay
//           setTimeout(() => {
//             setTypedText('');
//             i = 0;
//           }, 2000); // Restart after 2 seconds
//         }
//       }, 100); 
//       return () => clearInterval(interval);
//     }, [fullText, activeTab]);

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
//     //console.log('User Data JSONnnnnnnnn:', json);
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
//         let processedShorts = response.data;
//         if (activeTab === 'forYou') {
//           processedShorts = response.data
//             .filter(short => !short.is_following)
//             .sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//         } else {
//           processedShorts = response.data.filter(short => short.is_following);
//         }

//         setShorts(processedShorts);
//         setFilteredShorts(processedShorts);
//         initializeVideoStates(processedShorts);
//         await setCachedShorts(response.data);
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

// const followUser = async (userId) => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       Alert.alert('Error', 'Please login to follow users');
//       return;
//     }

//     // Find the current follow state for this user
//     const currentShort = shorts.find(short => short.user.id === userId);
//     const isCurrentlyFollowing = currentShort?.is_following || false;

//     // console.log('Current follow state:', isCurrentlyFollowing);
//     // console.log('User ID:', userId);

//     // Optimistic update - toggle the follow state
//     setShorts(prevShorts => 
//       prevShorts.map(short => 
//         short.user.id === userId 
//           ? { 
//               ...short, 
//               is_following: !isCurrentlyFollowing 
//             } 
//           : short
//       )
//     );
//     setFilteredShorts(prevShorts => 
//       prevShorts.map(short => 
//         short.user.id === userId 
//           ? { 
//               ...short, 
//               is_following: !isCurrentlyFollowing 
//             } 
//           : short
//       )
//     );

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };

//     if (isCurrentlyFollowing) {
//       // Unfollow user - using DELETE method
//      // console.log('Unfollowing user...');
//       await axios.delete(
//         `${API_ROUTE}/unfollow-user/${userId}/`,
//         { headers }
//       );
//     } else {
//       // Follow user - using POST method with empty body
//       //console.log('Following user...');
//       await axios.post(
//         `${API_ROUTE}/follow-user/${userId}/`,
//         {},
//         { headers }
//       );
      
//     }

//     setSnackbarMessage(isCurrentlyFollowing ? 'Unfollowed successfully!' : 'Followed successfully!');
//     setSnackbarVisible(true);
    
//     // Refresh the feed to reflect changes
//     fetchShorts(true);
    
//   } catch (error) {
//     console.error('Error following/unfollowing user:', error);
//     console.error('Error response:', error.response?.data);
    
//     // Revert optimistic update on error
//     const currentShortState = shorts.find(short => short.user.id === userId);
//     const originalFollowState = currentShortState?.is_following || false;
    
//     setShorts(prevShorts => 
//       prevShorts.map(short => 
//         short.user.id === userId 
//           ? { 
//               ...short, 
//               is_following: originalFollowState 
//             } 
//           : short
//       )
//     );
//     setFilteredShorts(prevShorts => 
//       prevShorts.map(short => 
//         short.user.id === userId 
//           ? { 
//               ...short, 
//               is_following: originalFollowState 
//             } 
//           : short
//       )
//     );
    
//     // Show appropriate error message
//     if (error.response?.status === 404) {
//       Alert.alert('Error', 'Follow feature is currently unavailable. Please try again later.');
//     } else if (error.response?.status === 401) {
//       Alert.alert('Error', 'Please login again to continue.');
//     } else {
//       Alert.alert('Error', `Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`);
//     }
//   }
// };

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

//   // Optimized fetchCommentsForShort with instant cache
//   const fetchCommentsForShort = useCallback(async (shortId, page = 1, showLoading = true, isLoadMore = false) => {
//   try {
//     // Load cached comments first for instant display
//     if (page === 1) {
//       const cachedComments = await getCachedComments(shortId);
//       if (cachedComments) {
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
    
//     // Try different endpoint variations
//     let response;
//     let endpoint;

//     // Option 1: Try the original endpoint first
//     try {
//       endpoint = `${API_URL}/shorts/${shortId}/comments/?page=${page}&page_size=20`;
//       //console.log('Trying endpoint:', endpoint);
//       response = await axios.get(endpoint, { headers, timeout: 10000 });
//     } catch (firstError) {
//       // Option 2: Try without trailing slash
//       try {
//         endpoint = `${API_URL}/shorts/${shortId}/comments?page=${page}&page_size=20`;
//         //console.log('Trying endpoint without trailing slash:', endpoint);
//         response = await axios.get(endpoint, { headers, timeout: 10000 });
//       } catch (secondError) {
//         // Option 3: Try different endpoint structure
//         endpoint = `${API_URL}/shorts/comments/${shortId}/?page=${page}&page_size=20`;
//        // console.log('Trying alternative endpoint:', endpoint);
//         response = await axios.get(endpoint, { headers, timeout: 10000 });
//       }
//     }
    
//     if (response.status === 200) {
//       const newComments = response.data.results || response.data;
//       const totalCount = response.data.count || newComments.length;
      
//       setSelectedShort(prev => {
//         if (!prev || prev.id !== shortId) return prev;
//         return {
//           ...prev,
//           comments: page === 1 ? newComments : [...(prev.comments || []), ...newComments],
//           comment_count: totalCount
//         };
//       });
      
//       setHasMoreComments(!!response.data.next);
//       setCommentPage(page + 1);
      
//       // Cache the first page
//       if (page === 1) {
//         await setCachedComments(shortId, newComments);
//       }
//     }
//   } catch (error) {
//     console.error('Fetch Comments Error:', error.message);
//     console.error('Error details:', error.response?.data);
//     console.error('Status:', error.response?.status);
    
//     if (page === 1 && showLoading) {
//       Alert.alert('Error', 'Failed to load comments. The comments feature might be unavailable.');
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
//     // Clipboard.setString(url);
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

//   // Memoized data
//   const combinedShorts = React.useMemo(() => {
//     if (activeTab === 'forYou') {
//       return shorts.filter(short => !short.is_following).sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//     } else {
//       return shorts.filter(short => short.is_following);
//     }
//   }, [shorts, activeTab]);

//   // UI Components
//   // const renderNavBar = () => (
//   //   <View style={styles.navBar}>
//   //     <View style={styles.tabsContainer}>
//   //       <TouchableOpacity 
//   //         style={[styles.navItem, activeTab === 'forYou' && styles.activeNavItem]}
//   //         onPress={() => setActiveTab('forYou')}
//   //       >
//   //         <Text style={[styles.navText, activeTab === 'forYou' && styles.activeNavText]}>For You</Text>
//   //       </TouchableOpacity>
        
//   //       <TouchableOpacity 
//   //         style={[styles.navItem, activeTab === 'following' && styles.activeNavItem]}
//   //         onPress={() => setActiveTab('following')}
//   //       >
//   //         <Text style={[styles.navText, activeTab === 'following' && styles.activeNavText]}>Following</Text>
//   //       </TouchableOpacity>
//   //     </View>
      
//   //     <TouchableOpacity 
//   //       style={styles.searchIconContainer}
//   //       onPress={() => {
//   //         pauseCurrentVideo();
//   //         setSearchModalVisible(true);
//   //       }}
//   //     >
//   //       <Icon name="search" size={24} color="#fff" />
//   //     </TouchableOpacity>
//   //     <TouchableOpacity 
//   //       style={[styles.searchIconContainer,]}
//   //       onPress={() => navigation.navigate('UploadshortVideo')}
//   //     >
//   //        <Icon name="plus" size={28} color="#fff" />
//   //     </TouchableOpacity>
//   //   </View>
//   // );


//   const renderNavBar = () => (
//   <View style={[
//     styles.navBar,
//     Platform.OS === 'ios' && styles.navBarIOS
//   ]}>
//     <View style={styles.tabsContainer}>
//       <TouchableOpacity 
//         style={[styles.navItem, activeTab === 'forYou' && styles.activeNavItem]}
//         onPress={() => setActiveTab('forYou')}
//       >
//         <Text style={[styles.navText, activeTab === 'forYou' && styles.activeNavText]}>For You</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity 
//         style={[styles.navItem, activeTab === 'following' && styles.activeNavItem]}
//         onPress={() => setActiveTab('following')}
//       >
//         <Text style={[styles.navText, activeTab === 'following' && styles.activeNavText]}>Following</Text>
//       </TouchableOpacity>
//     </View>
    
//     <TouchableOpacity 
//       style={styles.searchIconContainer}
//       onPress={() => {
//         pauseCurrentVideo();
//         setSearchModalVisible(true);
//       }}
//     >
//       <Icon name="search" size={24} color="#fff" />
//     </TouchableOpacity>
//     <TouchableOpacity 
//       style={styles.searchIconContainer}
//       onPress={() => navigation.navigate('UploadshortVideo')}
//     >
//       <Icon name="plus" size={28} color="#fff" />
//     </TouchableOpacity>
//   </View>
// );

//   // Optimized renderItem
//   const renderItem = useCallback(({ item, index }) => {
//     const isCurrent = index === currentIndex;
//     const isPaused = pausedVideos[index] || false;
//     const shouldShowPlayIcon = showPlayIcon[index] || false;

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
//           source={{ uri: item.video }}
//           style={styles.video}
//           resizeMode="cover"
//           repeat
//           paused={!isCurrent || isPaused}
//          // onError={(e) => console.log('Video error:', e.nativeEvent)}
//           bufferConfig={{
//             minBufferMs: 15000,
//             maxBufferMs: 30000,
//             bufferForPlaybackMs: 2500,
//             bufferForPlaybackAfterRebufferMs: 5000,
//           }}
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="obey"
//           poster={item.video_thumbnail}
//           posterResizeMode="cover"
//         />

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
//                 <Text style={styles.username}>@{item.user.name.slice(0,6)+'.'}</Text>

//                 </View>
                
//               </TouchableOpacity>

//             {/* <View style={[styles.bottomContent, { height: BOTTOM_CONTENT_HEIGHT }]}>
              
//             <View style={styles.userInfoRow}>
            
//             </View>

            
//           </View> */}
//           </Animated.View>

//           <View style={styles.captionContainer}>
//               <Text style={styles.caption} numberOfLines={2}>
//                 {item.caption.slice(0,100)+'...'}
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
//   }, [currentIndex, pausedVideos, showPlayIcon, activeTab, fadeAnim]);

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
//         removeClippedSubviews={true}
//         contentContainerStyle={styles.flatListContent}
//         decelerationRate={0.8}
//         snapToAlignment="start"
//         snapToInterval={height}
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
//               {/* <Animated.Text
//             style={[
//               styles.emptyTitle,
//               {
//                 opacity: fadeAnimEmpty,
//                 transform: [{ scale: scaleAnimEmpty }],
//               },
//             ]}
//           >
//             {typedText}
//           </Animated.Text> */}
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
//                 <renderItem
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
//   backgroundColor: '#fff', 
// },
// followingButtonText: {
//   color: '#000', 
// },
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
//         paddingTop: StatusBar.currentHeight || 44, // iPhone safe area
//       },
//       android: {
//         paddingTop: StatusBar.currentHeight || 0,
//       },
//     }),
//   },
//   navBarIOS: {
//     paddingTop: 44, 
//   },
//   shortvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 8,
//     borderWidth: 2,
//     borderColor: '#fff',
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
//   padding: 20,
//   alignItems: 'center',
//   justifyContent: 'center',
// },
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
 
// });

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
import { Snackbar } from 'react-native-paper';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Iconn from 'react-native-vector-icons/Ionicons';
import BottomNav from '../components/BottomSocialNav';
import Share from 'react-native-share';

const { height, width } = Dimensions.get('window');
const API_URL = `${API_ROUTE}`;
const CACHE_KEY = 'cachedShorts';
const COMMENTS_CACHE_KEY = 'cachedComments_';
const CACHE_DURATION = 5 * 60 * 1000;
const VIDEO_CACHE_PREFIX = 'video_cache_';

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
      source={{ 
        uri,
        headers: {
          'Cache-Control': 'max-age=31536000, public',
        }
      }}
      style={{ width: 0, height: 0 }}
      paused={!isVisible}
      muted={true}
      resizeMode="cover"
      onLoad={onLoad}
      onError={onError}
      bufferConfig={{
        minBufferMs: 5000,
        maxBufferMs: 15000,
        bufferForPlaybackMs: 1000,
        bufferForPlaybackAfterRebufferMs: 2000,
      }}
      ignoreSilentSwitch="ignore"
    />
  );
});

// Memoized Comment Item
const MemoizedCommentItem = memo(({ cmt, onLongPress, onLike, likedComments, expandedReplies, onToggleReplies }) => {
  const getCommentUser = (comment) => {
    if (typeof comment.user === 'string') {
      const username = comment.user.split('@')[0];
      return {
        username: username,
        profile_picture: null
      };
    }
    
    if (comment.user && !comment.user.username) {
      return {
        username: comment.user.email ? comment.user.email.split('@')[0] : 'Unknown',
        profile_picture: comment.user.profile_picture || null
      };
    }
    
    return comment.user || { username: 'Unknown', profile_picture: null };
  };

  const commentUser = getCommentUser(cmt);
  const profilePictureUrl = commentUser.profile_picture 
    ? (commentUser.profile_picture.startsWith('http') 
        ? commentUser.profile_picture 
        : `${API_ROUTE_IMAGE}${commentUser.profile_picture}`)
    : null;

  return (
    <TouchableOpacity
      style={styles.commentContainer}
      onPress={onLongPress}
      delayLongPress={500}
    >
      <View style={styles.commentHeader}>
        <View style={styles.commentUserContainer}>
          <TouchableOpacity>
            <Image
              source={{
                uri: profilePictureUrl,
                cache: 'force-cache'
              }}
              defaultSource={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
              style={styles.commentAvatar}
            />
          </TouchableOpacity>
          
          <View>
            <Text style={styles.commentUser}>
              {cmt.name ? `@${commentUser.name}` : `@${commentUser.username}`}
            </Text>
            <Text style={styles.commentTime}>
              {new Date(cmt.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
        <View style={styles.commentActions}>
          <TouchableOpacity
            onPress={() => onLike(cmt.id)}
            style={styles.commentLikeBtn}
          >
            <Ionicons
              name={likedComments[cmt.id] ? 'heart' : 'heart-outline'}
              size={18}
              color={likedComments[cmt.id] ? '#DC143C' : '#666'}
            />
            <Text style={styles.commentLikeCount}>
              {cmt.likes_count || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.commentText}>{cmt.text}</Text>

      {cmt.replies && cmt.replies.length > 0 && (
        <TouchableOpacity
          onPress={() => onToggleReplies(cmt.id)}
          style={styles.viewRepliesBtn}
        >
          <Text style={styles.viewRepliesText}>
            {expandedReplies[cmt.id] 
              ? 'Hide replies' 
              : `View ${cmt.replies.length} ${cmt.replies.length === 1 ? 'reply' : 'replies'}`}
          </Text>
        </TouchableOpacity>
      )}

      {expandedReplies[cmt.id] && cmt.replies && cmt.replies.map((reply) => {
        const replyUser = getCommentUser(reply);
        const replyProfilePictureUrl = replyUser.profile_picture 
          ? (replyUser.profile_picture.startsWith('http') 
              ? replyUser.profile_picture 
              : `${API_ROUTE_IMAGE}${replyUser.profile_picture}`)
          : null;

        return (
          <View key={reply.id} style={styles.replyContainer}>
            <View style={styles.replyHeader}>
              <View style={styles.replyUserContainer}>
                <Image
                  source={{
                    uri: replyProfilePictureUrl,
                    cache: 'force-cache'
                  }}
                  defaultSource={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
                  style={styles.replyAvatar}
                />
                <Text style={styles.replyUser}>@{replyUser.name}</Text>
              </View>
              <Text style={styles.replyTime}>
                {new Date(reply.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Text style={styles.replyText}>{reply.text}</Text>
          </View>
        );
      })}
    </TouchableOpacity>
  );
});

const ShortFeedScreen = ({ navigation, route }) => {
  const [shorts, setShorts] = useState([]);
  const [filteredShorts, setFilteredShorts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pausedVideos, setPausedVideos] = useState({});
  const [isReplyBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedShort, setSelectedShort] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [activeTab, setActiveTab] = useState('forYou');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newShortAdded, setNewShortAdded] = useState(false);
  const [isMoreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const [selectedShortForOptions, setSelectedShortForOptions] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const flatListRef = useRef();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPlayIcon, setShowPlayIcon] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimEmpty = useRef(new Animated.Value(0)).current;
  const scaleAnimEmpty = useRef(new Animated.Value(0.8)).current;

  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [typedText, setTypedText] = useState('');

  // Video optimization states
  const [preloadedVideos, setPreloadedVideos] = useState({});
  const [bufferedVideos, setBufferedVideos] = useState({});
  const [videoLoadTimes, setVideoLoadTimes] = useState({});
  const videoRefs = useRef({});

  const fullText = activeTab === 'following'
    ? 'Follow some creators to see their videos!'
    : 'Discover amazing shorts! Loading short...';

  // Typing animation effect
  useEffect(() => {
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText((prev) => prev + fullText[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setTypedText('');
          i = 0;
        }, 2000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [fullText, activeTab]);

  // Animation for empty state
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

  // Animation for buttons
  const animateButtons = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Pause current video
  const pauseCurrentVideo = () => {
    if (currentIndex !== null && filteredShorts.length > 0) {
      setPausedVideos(prev => ({
        ...prev,
        [currentIndex]: true,
      }));
      setShowPlayIcon(prev => ({
        ...prev,
        [currentIndex]: true,
      }));
    }
  };

  // Listen for new short from upload screen
  useEffect(() => {
    if (route.params?.newShort) {
      setSnackbarMessage('Short uploaded successfully!');
      setSnackbarVisible(true);
      setNewShortAdded(true);
      fetchShorts(true);
    }
  }, [route.params?.newShort]);

  // Clear video cache on mount
  useEffect(() => {
    const clearVideoCache = async () => {
      try {
        const cacheKeys = await AsyncStorage.getAllKeys();
        const videoCacheKeys = cacheKeys.filter(key => key.startsWith(VIDEO_CACHE_PREFIX));
        if (videoCacheKeys.length > 0) {
          await AsyncStorage.multiRemove(videoCacheKeys);
        }
      } catch (error) {
        console.log('Error clearing video cache:', error);
      }
    };
    
    clearVideoCache();
  }, []);

  // Helper functions
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
    return parsed?.username || 'CurrentUser';
  };

  const getCachedShorts = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const setCachedShorts = async (data) => {
    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  };

  const getCachedComments = async (shortId) => {
    try {
      const cached = await AsyncStorage.getItem(`${COMMENTS_CACHE_KEY}${shortId}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error reading comments cache:', error);
      return null;
    }
  };

  const setCachedComments = async (shortId, data) => {
    try {
      await AsyncStorage.setItem(
        `${COMMENTS_CACHE_KEY}${shortId}`,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error saving comments cache:', error);
    }
  };

  // Video optimization functions
  const getVideoThumbnail = (videoUrl) => {
    if (!videoUrl) return null;
    // Return the video URL as thumbnail for now
    return videoUrl;
  };

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
    const loadTime = Date.now();
    setVideoLoadTimes(prev => ({
      ...prev,
      [videoId]: loadTime,
    }));
    setBufferedVideos(prev => ({
      ...prev,
      [videoId]: true,
    }));
  }, []);

  const handleVideoError = useCallback((videoId, error) => {
    console.log(`Video ${videoId} error:`, error);
    // You can implement retry logic here if needed
  }, []);

  const getBufferConfig = useCallback(() => ({
    minBufferMs: Platform.OS === 'ios' ? 5000 : 10000,
    maxBufferMs: Platform.OS === 'ios' ? 15000 : 20000,
    bufferForPlaybackMs: Platform.OS === 'ios' ? 1000 : 1500,
    bufferForPlaybackAfterRebufferMs: Platform.OS === 'ios' ? 2000 : 3000,
  }), []);

  // Optimized fetchShorts with instant cache load
  const fetchShorts = useCallback(async (forceRefresh = false) => {
    try {
      // Always load cache first for instant display
      const cachedShorts = await getCachedShorts();
      if (cachedShorts) {
        let processedShorts = cachedShorts;
        if (activeTab === 'forYou') {
          processedShorts = cachedShorts
            .filter(short => !short.is_following)
            .sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
        } else {
          processedShorts = cachedShorts.filter(short => short.is_following);
        }
        setShorts(processedShorts);
        setFilteredShorts(processedShorts);
        initializeVideoStates(processedShorts);
      }

      // If force refresh, or background update, fetch from server
      const headers = await getAuthHeader();
      const endpoint = activeTab === 'following' ? '/shorts/following/' : '/shorts/';
      const response = await axios.get(`${API_URL}${endpoint}`, { headers });

      if (response.status === 200) {
        let processedShorts = response.data.map(short => ({
          ...short,
          video: short.video?.replace(/\/\//g, '/').replace(':/', '://'),
          video_thumbnail: short.video_thumbnail || getVideoThumbnail(short.video),
        }));

        if (activeTab === 'forYou') {
          processedShorts = processedShorts
            .filter(short => !short.is_following)
            .sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
        } else {
          processedShorts = processedShorts.filter(short => short.is_following);
        }

        setShorts(processedShorts);
        setFilteredShorts(processedShorts);
        initializeVideoStates(processedShorts);
        await setCachedShorts(response.data);
        
        // Preload first few videos
        preloadVideos(processedShorts.slice(0, 3));
      }
    } catch (error) {
      console.error('Fetch Shorts Error:', error);
      if (error.response?.status === 404 && activeTab === 'following') {
        Alert.alert('No videos', "You're not following anyone or they haven't posted any shorts yet.");
        setShorts([]);
        setFilteredShorts([]);
      }
    } finally {
      setRefreshing(false);
    }
  }, [activeTab]);

  const initializeVideoStates = (data) => {
    const initialPausedState = {};
    const initialPlayIconState = {};
    data.forEach((_, index) => {
      initialPausedState[index] = index !== 0;
      initialPlayIconState[index] = false;
    });
    setPausedVideos(initialPausedState);
    setShowPlayIcon(initialPlayIconState);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchShorts(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredShorts(shorts);
    } else {
      const filtered = shorts.filter(short => 
        short.caption.toLowerCase().includes(query.toLowerCase()) ||
        short.user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredShorts(filtered);
    }
  };

  const handleSearchItemPress = (item) => {
    setSearchModalVisible(false);
    setSearchQuery('');
    const index = shorts.findIndex(short => short.id === item.id);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const likeComment = async (commentId) => {
    try {
      const headers = await getAuthHeader();
      
      // Optimistic update
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !prev[commentId]
      }));
      
      setSelectedShort(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                is_liked: !comment.is_liked,
                likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
              };
            }
            return comment;
          })
        };
      });

      setShorts(prev => prev.map(short => ({
        ...short,
        comments: (short.comments || []).map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: !comment.is_liked,
              likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
            };
          }
          return comment;
        })
      })));

      setFilteredShorts(prev => prev.map(short => ({
        ...short,
        comments: (short.comments || []).map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: !comment.is_liked,
              likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
            };
          }
          return comment;
        })
      })));

      await axios.post(`${API_URL}/shorts/comments/${commentId}/like/`, {}, { headers });
      await setCachedComments(selectedShort.id, selectedShort.comments);
    } catch (error) {
      console.error('Comment Like Error:', error.response?.data || error.message);
      
      // Revert optimistic update
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !prev[commentId]
      }));
      
      setSelectedShort(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                is_liked: !comment.is_liked,
                likes_count: comment.is_liked ? (comment.likes_count || 0) - 1 : (comment.likes_count || 0) + 1
              };
            }
            return comment;
          })
        };
      });

      Alert.alert('Error', 'Failed to like/unlike comment');
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const headers = await getAuthHeader();
      
      // Optimistic update
      setSelectedShort(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.filter(comment => comment.id !== commentId),
          comment_count: (prev.comment_count || 0) - 1
        };
      });

      setShorts(prev => prev.map(short => ({
        ...short,
        comments: (short.comments || []).filter(comment => comment.id !== commentId),
        comment_count: (short.comment_count || 0) - 1
      })));

      setFilteredShorts(prev => prev.map(short => ({
        ...short,
        comments: (short.comments || []).filter(comment => comment.id !== commentId),
        comment_count: (short.comment_count || 0) - 1
      })));

      await axios.delete(`${API_URL}/shorts/comments/${commentId}/delete/`, { headers });
      
      setSnackbarMessage('Comment deleted successfully!');
      setSnackbarVisible(true);
      setDeleteModalVisible(false);
      setCommentToDelete(null);
      await setCachedComments(selectedShort.id, selectedShort.comments);
    } catch (error) {
      console.error('Delete Comment Error:', error.response?.data || error.message);
      
      // Revert optimistic update by refetching comments
      if (selectedShort?.id) {
        await fetchCommentsForShort(selectedShort.id, false);
      }
      
      Alert.alert('Error', 'Failed to delete comment');
      setDeleteModalVisible(false);
      setCommentToDelete(null);
    }
  };

  const followUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to follow users');
        return;
      }

      // Find the current follow state for this user
      const currentShort = shorts.find(short => short.user.id === userId);
      const isCurrentlyFollowing = currentShort?.is_following || false;

      // Optimistic update - toggle the follow state
      setShorts(prevShorts => 
        prevShorts.map(short => 
          short.user.id === userId 
            ? { 
                ...short, 
                is_following: !isCurrentlyFollowing 
              } 
            : short
        )
      );
      setFilteredShorts(prevShorts => 
        prevShorts.map(short => 
          short.user.id === userId 
            ? { 
                ...short, 
                is_following: !isCurrentlyFollowing 
              } 
            : short
        )
      );

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      if (isCurrentlyFollowing) {
        await axios.delete(
          `${API_ROUTE}/unfollow-user/${userId}/`,
          { headers }
        );
      } else {
        await axios.post(
          `${API_ROUTE}/follow-user/${userId}/`,
          {},
          { headers }
        );
      }

      setSnackbarMessage(isCurrentlyFollowing ? 'Unfollowed successfully!' : 'Followed successfully!');
      setSnackbarVisible(true);
      
      // Refresh the feed to reflect changes
      fetchShorts(true);
      
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      console.error('Error response:', error.response?.data);
      
      // Revert optimistic update on error
      const currentShortState = shorts.find(short => short.user.id === userId);
      const originalFollowState = currentShortState?.is_following || false;
      
      setShorts(prevShorts => 
        prevShorts.map(short => 
          short.user.id === userId 
            ? { 
                ...short, 
                is_following: originalFollowState 
              } 
            : short
        )
      );
      setFilteredShorts(prevShorts => 
        prevShorts.map(short => 
          short.user.id === userId 
            ? { 
                ...short, 
                is_following: originalFollowState 
              } 
            : short
        )
      );
      
      // Show appropriate error message
      if (error.response?.status === 404) {
        Alert.alert('Error', 'Follow feature is currently unavailable. Please try again later.');
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Please login again to continue.');
      } else {
        Alert.alert('Error', `Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`);
      }
    }
  };

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
      fetchShorts(true);
    } catch (error) {
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
      console.error('Like Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to like/unlike video');
    }
  };

  const getCommentUser = (comment) => {
    if (typeof comment.user === 'string') {
      const username = comment.user.split('@')[0];
      return {
        username: username,
        profile_picture: null
      };
    }
    
    if (comment.user && !comment.user.username) {
      return {
        username: comment.user.email ? comment.user.email.split('@')[0] : 'Unknown',
        profile_picture: comment.user.profile_picture || null
      };
    }
    
    return comment.user || { username: 'Unknown', profile_picture: null };
  };

  // Optimized fetchCommentsForShort with instant cache
  const fetchCommentsForShort = useCallback(async (shortId, page = 1, showLoading = true, isLoadMore = false) => {
    try {
      // Load cached comments first for instant display
      if (page === 1) {
        const cachedComments = await getCachedComments(shortId);
        if (cachedComments) {
          const newLikedComments = {};
          cachedComments.forEach(comment => {
            newLikedComments[comment.id] = comment.is_liked || false;
          });
          setLikedComments(newLikedComments);
          
          setSelectedShort(prev => {
            if (!prev || prev.id !== shortId) return prev;
            return {
              ...prev,
              comments: cachedComments,
              comment_count: cachedComments.length
            };
          });
        }
      }

      const headers = await getAuthHeader();
      
      // Try different endpoint variations
      let response;
      let endpoint;

      // Option 1: Try the original endpoint first
      try {
        endpoint = `${API_URL}/shorts/${shortId}/comments/?page=${page}&page_size=20`;
        response = await axios.get(endpoint, { headers, timeout: 10000 });
      } catch (firstError) {
        // Option 2: Try without trailing slash
        try {
          endpoint = `${API_URL}/shorts/${shortId}/comments?page=${page}&page_size=20`;
          response = await axios.get(endpoint, { headers, timeout: 10000 });
        } catch (secondError) {
          // Option 3: Try different endpoint structure
          endpoint = `${API_URL}/shorts/comments/${shortId}/?page=${page}&page_size=20`;
          response = await axios.get(endpoint, { headers, timeout: 10000 });
        }
      }
      
      if (response.status === 200) {
        const newComments = response.data.results || response.data;
        const totalCount = response.data.count || newComments.length;
        
        setSelectedShort(prev => {
          if (!prev || prev.id !== shortId) return prev;
          return {
            ...prev,
            comments: page === 1 ? newComments : [...(prev.comments || []), ...newComments],
            comment_count: totalCount
          };
        });
        
        setHasMoreComments(!!response.data.next);
        setCommentPage(page + 1);
        
        // Cache the first page
        if (page === 1) {
          await setCachedComments(shortId, newComments);
        }
      }
    } catch (error) {
      console.error('Fetch Comments Error:', error.message);
      console.error('Error details:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      if (page === 1 && showLoading) {
        Alert.alert('Error', 'Failed to load comments. The comments feature might be unavailable.');
      }
    }
  }, []);

  const commentShort = async (id, text) => {
    try {
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;
      const username = parsed?.name || 'User';
      
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const tempComment = {
        id: tempId,
        user: username,
        text: text,
        created_at: new Date().toISOString(),
        replies: [],
        is_liked: false,
        likes_count: 0,
      };

      setShorts(prev => prev?.map(short =>
        short.id === id
          ? {
              ...short,
              comments: [...(short.comments || []), tempComment],
              comment_count: (short.comment_count || 0) + 1,
            }
          : short
      ) || []);

      setFilteredShorts(prev => prev?.map(short =>
        short.id === id
          ? {
              ...short,
              comments: [...(short.comments || []), tempComment],
              comment_count: (short.comment_count || 0) + 1,
            }
          : short
      ) || []);

      if (selectedShort?.id === id) {
        setSelectedShort(prev => ({
          ...prev,
          comments: [...(prev?.comments || []), tempComment],
          comment_count: (prev?.comment_count || 0) + 1,
        }));
      }

      setCommentText('');

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_URL}/shorts/${id}/comment/`, {text}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.id) {
        setShorts(prev => prev?.map(short =>
          short.id === id
            ? {
                ...short,
                comments: short.comments?.map(comment => 
                  comment.id === tempId ? response.data : comment
                ) || [],
              }
            : short
        ) || []);

        setFilteredShorts(prev => prev?.map(short =>
          short.id === id
            ? {
                ...short,
                comments: short.comments?.map(comment => 
                  comment.id === tempId ? response.data : comment
                ) || [],
              }
            : short
        ) || []);

        if (selectedShort?.id === id) {
          setSelectedShort(prev => ({
            ...prev,
            comments: prev.comments?.map(comment => 
              comment.id === tempId ? response.data : comment
            ) || [],
          }));
        }
        await setCachedComments(id, selectedShort?.id === id ? selectedShort.comments : [...(shorts.find(s => s.id === id)?.comments || []), response.data]);
      }
    } catch (error) {
      console.error('Comment Error:', error.response?.data || error.message);
      // Revert optimistic update
      setShorts(prev => prev?.map(short =>
        short.id === id
          ? {
              ...short,
              comments: (short.comments || []).filter(comment => comment.id !== tempId),
              comment_count: (short.comment_count || 0) - 1,
            }
          : short
      ) || []);

      setFilteredShorts(prev => prev?.map(short =>
        short.id === id
          ? {
              ...short,
              comments: (short.comments || []).filter(comment => comment.id !== tempId),
              comment_count: (short.comment_count || 0) - 1,
            }
          : short
      ) || []);

      if (selectedShort?.id === id) {
        setSelectedShort(prev => ({
          ...prev,
          comments: (prev.comments || []).filter(comment => comment.id !== tempId),
          comment_count: (prev.comment_count || 0) - 1,
        }));
      }
      
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const replyComment = async (commentId, text) => {
    try {
      const headers = await getAuthHeader();
      const username = await getCurrentUser();
      const tempReply = {
        id: `temp-${Date.now()}`,
        user: username,
        text,
        created_at: new Date().toISOString(),
        is_liked: false,
        likes_count: 0,
      };

      setShorts((prevShorts) =>
        prevShorts.map((short) =>
          short.id === selectedShort.id
            ? {
                ...short,
                comments: (short.comments || []).map((cmt) =>
                  cmt.id === commentId
                    ? { 
                        ...cmt, 
                        replies: [...(cmt.replies || []), tempReply] 
                      }
                    : cmt
                ),
              }
            : short
        )
      );

      setFilteredShorts((prevShorts) =>
        prevShorts.map((short) =>
          short.id === selectedShort.id
            ? {
                ...short,
                comments: (short.comments || []).map((cmt) =>
                  cmt.id === commentId
                    ? { 
                        ...cmt, 
                        replies: [...(cmt.replies || []), tempReply] 
                      }
                    : cmt
                ),
              }
            : short
        )
      );

      if (selectedShort) {
        setSelectedShort((prev) => ({
          ...prev,
          comments: (prev.comments || []).map((cmt) =>
            cmt.id === commentId
              ? { 
                  ...cmt, 
                  replies: [...(cmt.replies || []), tempReply] 
                }
              : cmt
          ),
        }));
      }

      setCommentText('');
      setSelectedCommentId(null);

      const response = await axios.post(
        `${API_URL}shorts/${selectedShort.id}/comment/`,
        {
          text,
          parent: commentId,
        },
        { headers }
      );

      if (response.data && response.data.id) {
        setShorts((prevShorts) =>
          prevShorts.map((short) =>
            short.id === selectedShort.id
              ? {
                  ...short,
                  comments: (short.comments || []).map((cmt) =>
                    cmt.id === commentId
                      ? {
                          ...cmt,
                          replies: (cmt.replies || []).map((reply) =>
                            reply.id === tempReply.id ? response.data : reply
                          ),
                        }
                      : cmt
                  ),
                }
              : short
          )
        );

        setFilteredShorts((prevShorts) =>
          prevShorts.map((short) =>
            short.id === selectedShort.id
              ? {
                  ...short,
                  comments: (short.comments || []).map((cmt) =>
                    cmt.id === commentId
                      ? {
                          ...cmt,
                          replies: (cmt.replies || []).map((reply) =>
                            reply.id === tempReply.id ? response.data : reply
                          ),
                        }
                      : cmt
                  ),
                }
              : short
          )
        );

        if (selectedShort) {
          setSelectedShort((prev) => ({
            ...prev,
            comments: (prev.comments || []).map((cmt) =>
              cmt.id === commentId
                ? {
                    ...cmt,
                    replies: (cmt.replies || []).map((reply) =>
                      reply.id === tempReply.id ? response.data : reply
                    ),
                  }
                : cmt
            ),
          }));
        }
        await setCachedComments(selectedShort.id, selectedShort.comments);
      }
    } catch (error) {
      console.error('Reply Error:', error.response?.data || error.message);
      
      // Revert optimistic update
      setShorts((prevShorts) =>
        prevShorts.map((short) =>
          short.id === selectedShort.id
            ? {
                ...short,
                comments: (short.comments || []).map((cmt) =>
                  cmt.id === commentId
                    ? {
                        ...cmt,
                        replies: (cmt.replies || []).filter(
                          (reply) => reply.id !== tempReply.id
                        ),
                      }
                    : cmt
                ),
              }
            : short
        )
      );

      setFilteredShorts((prevShorts) =>
        prevShorts.map((short) =>
          short.id === selectedShort.id
            ? {
                ...short,
                comments: (short.comments || []).map((cmt) =>
                  cmt.id === commentId
                    ? {
                        ...cmt,
                        replies: (cmt.replies || []).filter(
                          (reply) => reply.id !== tempReply.id
                        ),
                      }
                    : cmt
                ),
              }
            : short
        )
      );

      if (selectedShort) {
        setSelectedShort((prev) => ({
          ...prev,
          comments: (prev.comments || []).map((cmt) =>
            cmt.id === commentId
              ? {
                  ...cmt,
                  replies: (cmt.replies || []).filter(
                    (reply) => reply.id !== tempReply.id
                  ),
                }
              : cmt
          ),
        }));
      }
      
      Alert.alert('Error', 'Failed to post reply');
    }
  };

  const reportShort = async (id) => {
    try {
      const headers = await getAuthHeader();
      await axios.post(`${API_URL}shorts/${id}/report/`, {}, { headers });
      setSnackbarMessage('Post reported successfully!');
      setSnackbarVisible(true);
      setMoreOptionsVisible(false);
    } catch (error) {
      console.error('Report Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to report post');
    }
  };

  const copyLink = (url) => {
    setSnackbarMessage('Link copied to clipboard!');
    setSnackbarVisible(true);
    setMoreOptionsVisible(false);
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
      await axios.post(`${API_URL}shorts/${id}/share/`, { shared_to: 'WhatsApp' }, { headers });
      
      setSnackbarMessage('Shared successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share Error:', error.message);
        Alert.alert('Error', 'Failed to share video');
      }
    }
  };

  // Twitter-like initialization: Load cache immediately, fetch in background
  useEffect(() => {
    // Load cache for instant display
    fetchShorts(false);
    
    // Fetch fresh data in background
    fetchShorts(true);
    
    animateButtons();
  }, [activeTab]);

  // Preload videos when data changes
  useEffect(() => {
    if (filteredShorts.length > 0) {
      // Preload current and next 2 videos
      const videosToPreload = filteredShorts.slice(
        Math.max(0, currentIndex - 1),
        Math.min(filteredShorts.length, currentIndex + 3)
      );
      preloadVideos(videosToPreload);
    }
  }, [filteredShorts, currentIndex]);

  // Clean up video refs on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach(ref => {
        if (ref) {
          ref.seek(0);
        }
      });
    };
  }, []);

  // Memoized data
  const combinedShorts = React.useMemo(() => {
    if (activeTab === 'forYou') {
      return shorts.filter(short => !short.is_following).sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
    } else {
      return shorts.filter(short => short.is_following);
    }
  }, [shorts, activeTab]);

  // UI Components
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
      
      <TouchableOpacity 
        style={styles.searchIconContainer}
        onPress={() => {
          pauseCurrentVideo();
          setSearchModalVisible(true);
        }}
      >
        <Icon name="search" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.searchIconContainer}
        onPress={() => navigation.navigate('UploadshortVideo')}
      >
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // Optimized renderItem
  const renderItem = useCallback(({ item, index }) => {
    const isCurrent = index === currentIndex;
    const isPaused = pausedVideos[index] || false;
    const shouldShowPlayIcon = showPlayIcon[index] || false;
    const isBuffered = bufferedVideos[item.id] || false;

    const toggleVideoPause = () => {
      if (isCurrent) {
        setPausedVideos(prev => ({
          ...prev,
          [index]: !prev[index],
        }));

        setShowPlayIcon(prev => ({
          ...prev,
          [index]: !prev[index],
        }));
      }
    };
  
    return (
      <View
        style={styles.card}
        onStartShouldSetResponder={(e) => {
          const touched = e.nativeEvent.target;
          if (
            ['HEART', 'SHARE', 'COMMENT', 'MORE'].includes(
              touched._internalFiberInstanceHandleDEV?.elementType
            )
          ) {
            return false;
          }
          return true;
        }}
        onResponderRelease={toggleVideoPause}
      >
        <Video
          ref={ref => videoRefs.current[index] = ref}
          source={{ 
            uri: item.video,
            headers: {
              'Cache-Control': 'max-age=31536000, public',
            }
          }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={!isCurrent || isPaused}
          onLoad={() => handleVideoLoad(item.id)}
          onError={(error) => handleVideoError(item.id, error)}
          bufferConfig={getBufferConfig()}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="obey"
          poster={item.video_thumbnail}
          posterResizeMode="cover"
          preferredForwardBufferDuration={2}
          preventsDisplaySleepDuringVideoPlayback={false}
          hardwareAccelerationAndroid={true}
          progressUpdateInterval={250}
          onBuffer={(data) => {
            // You can add buffering state handling here if needed
          }}
        />

        {/* Show loading indicator if video is not buffered yet */}
        {isCurrent && !isBuffered && (
          <View style={styles.bufferingOverlay}>
            <ActivityIndicator size="large" color="#DC143C" />
            <Text style={styles.bufferingText}>Buffering...</Text>
          </View>
        )}

        {/* Preload next video */}
        {filteredShorts[index + 1] && preloadedVideos[filteredShorts[index + 1].id] && (
          <VideoPreloader
            uri={filteredShorts[index + 1].video}
            isVisible={false}
            onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
            onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
          />
        )}

        <View style={styles.overlay}>
          {/* Right Actions */}
          <Animated.View style={[styles.rightActions, { opacity: fadeAnim }]}>
           
            {activeTab === 'forYou' && (
              <TouchableOpacity
                onPress={() => followUser(item.user.id)}
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
              <Iconn
                name="heart"
                size={40}
                color={item.is_liked ? '#DC143C' : '#fff'}
              />
              <Text style={[styles.countText,{marginVertical:5}]}>{item.like_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                pauseCurrentVideo();
                setSelectedShort(item);
                setBottomSheetVisible(true);
                setCommentPage(1);
                setHasMoreComments(true);
                fetchCommentsForShort(item.id);
              }}
              style={styles.iconBtn}
            >
              <Iconn name="chatbubble-ellipses" size={36} color="#fff" />
              <Text style={[styles.countText,{marginVertical:10}]}>{item.comment_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareShort(item.id, item.video, item.caption)}
              style={styles.iconBtn}
            >
              <Iconn name="arrow-redo" size={36} color="#fff" />
              <Text style={[styles.countText,{marginVertical:10}]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user.id })}
                style={styles.userInfo}
              >
                <View style={{ flexDirection:'column',alignSelf:'center', justifyContent:'center', alignItems:'center',textAlign:'center' }}>
                  <Image
                  source={
                    item.user.profile_picture
                      ? { uri: item.user.profile_picture }
                      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={styles.shortvatar}
                />
                <Text style={styles.username}>@{item.user.name?.slice(0,6) || 'user'}</Text>

                </View>
                
              </TouchableOpacity>
          </Animated.View>

          <View style={styles.captionContainer}>
              <Text style={styles.caption} numberOfLines={2}>
                {item.caption?.slice(0,100) + '...' || 'No caption'}
              </Text>
            </View>
          
        </View>

        {shouldShowPlayIcon && (
          <View style={styles.playOverlay}>
            <Icon name="play" size={64} color="#fff" />
          </View>
        )}
      </View>
    );
  }, [currentIndex, pausedVideos, showPlayIcon, activeTab, fadeAnim, bufferedVideos, preloadedVideos, filteredShorts]);

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleCommentLongPress = useCallback(async (commentId) => {
    const username = await getCurrentUser();
    const comment = selectedShort?.comments?.find(c => c.id === commentId);
    const commentUser = getCommentUser(comment);
    if (commentUser.username === username.split('@')[0]) {
      setCommentToDelete(commentId);
      setDeleteModalVisible(true);
    }
  }, [selectedShort]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
      
      setPausedVideos(prev => {
        const newPausedState = {};
        filteredShorts.forEach((_, index) => {
          newPausedState[index] = index !== newIndex;
        });
        return newPausedState;
      });
      
      setShowPlayIcon(prev => {
        const newPlayIconState = {};
        filteredShorts.forEach((_, index) => {
          newPlayIconState[index] = index !== newIndex && prev[index];
        });
        return newPlayIconState;
      });
    }
  }).current;

  useEffect(() => {
    if (filteredShorts.length > 0) {
      setCurrentIndex(0);
      const newPausedState = {};
      filteredShorts.forEach((_, index) => {
        newPausedState[index] = index !== 0;
      });
      setPausedVideos(newPausedState);
      
      const newPlayIconState = {};
      filteredShorts.forEach((_, index) => {
        newPlayIconState[index] = false;
      });
      setShowPlayIcon(newPlayIconState);
    }
  }, [filteredShorts]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 90,
    waitForInteraction: false,
  }).current;

  useEffect(() => {
    if (shorts.length > 0 && currentIndex >= shorts.length) {
      setCurrentIndex(0);
    }
  }, [shorts]);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {renderNavBar()}
      
      <FlatList
        ref={flatListRef}
        data={filteredShorts}
        keyExtractor={(item) => `short-${item.id}`}
        key={`short-feed-${filteredShorts.length}`}
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
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#DC143C', '#fff']}
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
                  ? 'Follow some creators to see their videos!'
                  : 'Discover amazing shorts! Loading short...'}
              </Animated.Text>
            </View>
          </ImageBackground>
        }
      />

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
        <View style={styles.searchModalContainer}>
          <View style={styles.searchModalHeader}>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={22} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#6b7280"
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchModalInput}
                autoFocus={true}
                autoCapitalize="none"
                autoCorrect={false}
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
              style={styles.searchModalClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isReplyBottomSheetVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setBottomSheetVisible(false);
          setSelectedCommentId(null);
          setCommentText('');
          setExpandedReplies({});
          setCommentPage(1);
          setHasMoreComments(true);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>
                {selectedShort?.comment_count || 0} Comments
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setBottomSheetVisible(false);
                  setSelectedCommentId(null);
                  setCommentText('');
                  setExpandedReplies({});
                }}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedShort?.comments || []}
              keyExtractor={(item) => `comment-${item.id}`}
              renderItem={({ item: cmt }) => (
                <MemoizedCommentItem
                  cmt={cmt}
                  onLongPress={() => handleCommentLongPress(cmt.id)}
                  onLike={likeComment}
                  likedComments={likedComments}
                  expandedReplies={expandedReplies}
                  onToggleReplies={toggleReplies}
                />
              )}
              onEndReached={() => {
                if (hasMoreComments && selectedShort?.id) {
                  fetchCommentsForShort(selectedShort.id, commentPage, false, true);
                }
              }}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={
                <View style={styles.noCommentsContainer}>
                  <Text style={styles.noCommentsText}>
                    No comments yet
                  </Text>
                </View>
              }
              contentContainerStyle={styles.commentList}
              showsVerticalScrollIndicator={false}
              style={styles.commentScroll}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={5}
              removeClippedSubviews={true}
            />

            <View style={styles.commentInputContainer}>
              <TextInput
                placeholder={
                  selectedCommentId 
                    ? `Replying to @${getCommentUser(selectedShort?.comments?.find(cmt => cmt.id === selectedCommentId))?.username || ''}`
                    : "Add a comment..."
                }
                placeholderTextColor="#6b7280"
                value={commentText}
                onChangeText={setCommentText}
                style={styles.commentInput}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
              
              <TouchableOpacity
                onPress={() => {
                  if (commentText.trim()) {
                    if (selectedCommentId) {
                      replyComment(selectedCommentId, commentText);
                    } else if (selectedShort?.id) {
                      commentShort(selectedShort.id, commentText);
                    }
                  }
                }}
                style={[
                  styles.commentButton,
                  !commentText.trim() && styles.commentButtonDisabled,
                ]}
                disabled={!commentText.trim()}
              >
                <Ionicons name="send" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setDeleteModalVisible(false);
          setCommentToDelete(null);
        }}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModal}>
            <TouchableOpacity
              style={styles.deleteOption}
              onPress={() => {
                if (commentToDelete) {
                  deleteComment(commentToDelete);
                }
              }}
            >
              <Text style={styles.deleteOptionText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelOption}
              onPress={() => {
                setDeleteModalVisible(false);
                setCommentToDelete(null);
              }}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isMoreOptionsVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMoreOptionsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>More Options</Text>
              <TouchableOpacity
                onPress={() => setMoreOptionsVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsList}>
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => {
                  if (selectedShortForOptions) {
                    copyLink(selectedShortForOptions.video);
                  }
                }}
              >
                <Ionicons name="link" size={24} color="#000" />
                <Text style={styles.optionText}>Copy Link</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => {
                  if (selectedShortForOptions) {
                    reportShort(selectedShortForOptions.id);
                  }
                }}
              >
                <Ionicons name="flag" size={24} color="#000" />
                <Text style={styles.optionText}>Report Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    right: 0,
    bottom: 0,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  // Responsive Bottom Content
  bottomContent: {
    width: '100%',
    paddingLeft: 12,
    justifyContent: 'flex-end',
  },
  userInfoRow: {
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shortvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  captionContainer: {
    width: '80%',
    marginBottom: BOTTOM_SAFE_AREA, 
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    lineHeight: 18,
  },
  // Right Actions
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
    alignItems: 'center',
    minWidth: 60,
  },
  followingButton: {
    backgroundColor: '#fff', 
  },
  followingButtonText: {
    color: '#000', 
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconBtn: {
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  emptyContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  emptyOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 32,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    justifyContent: 'center',
    flex: 1,
  },
  navItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#143cdcff',
  },
  navText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  activeNavText: {
    color: '#fff',
    fontWeight: '800',
  },
  searchIconContainer: {
    padding: 8,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: StatusBar.currentHeight + 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchModalInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  clearSearchButton: {
    padding: 4,
  },
  cancelText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    paddingHorizontal: 12,
  },
  searchGridContainer: {
    padding: 8,
  },
  searchGridItem: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  searchGridItemSpacing: {
    marginRight: 4,
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchGridImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#333',
  },
  searchGridOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 8,
  },
  searchGridContent: {
    padding: 8,
  },
  searchGridUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  searchGridCaption: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  searchSuggestionsContainer: {
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  trendingItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  trendingText: {
    color: '#111827',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  searchEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  searchEmptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  searchEmptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    height: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  closeBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    padding: 8,
  },
  commentList: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  commentScroll: {
    flex: 1,
  },
  commentContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  commentUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  commentTime: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  commentLikeCount: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  replyBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  replyBtnActive: {
    backgroundColor: '#1432dcff',
  },
  replyBtnText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  replyBtnTextActive: {
    color: '#fff',
  },
  viewRepliesBtn: {
    marginTop: 8,
    paddingVertical: 4,
  },
  viewRepliesText: {
    fontSize: 13,
    color: '#1435dcff',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  replyContainer: {
    marginLeft: 16,
    marginTop: 12,
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8e9ebff',
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  replyUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  replyTime: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  replyText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  commentButton: {
    backgroundColor: '#DC143C',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  commentButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  flatListContent: {
    paddingTop: 0,
  },
  trendingScroll: {
    paddingVertical: 8,
  },
  snackbar: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    margin: 16,
  },
  snackbarText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  optionsList: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 64,
    padding: 10,
    zIndex: 10,
  },
  deleteModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  deleteOptionText: {
    fontSize: 16,
    color: '#1450dcff',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  cancelOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cancelOptionText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
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
});

export default ShortFeedScreen;


  
