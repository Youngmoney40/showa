


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

// // Helper functions
// const getSecureUrl = (url) => {
//   if (!url) return null;
//   if (url.startsWith('https://')) return url;
//   if (url.startsWith('http://')) {
//     return url.replace('http://', 'https://');
//   }
//   if (url.startsWith('/')) {
//     return `${API_ROUTE_IMAGE.replace('http://', 'https://')}${url}`;
//   }
//   return url;
// };

// const getOptimizedVideoUrl = (videoUrl) => {
//   if (!videoUrl || !videoUrl.includes('cloudinary')) return videoUrl;
  
//   const urlParts = videoUrl.split('.');
//   const currentFormat = urlParts.pop()?.toLowerCase();
  
//   let optimizedUrl = videoUrl;
  
//   if (Platform.OS === 'ios') {
//     if (currentFormat !== 'mp4') {
//       optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
//     }
//   } else if (Platform.OS === 'android') {
//     if (currentFormat !== 'mp4') {
//       optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
//     }
//   } else {
//     optimizedUrl = videoUrl.replace('/upload/', '/upload/f_auto/');
//   }
  
//   optimizedUrl = optimizedUrl.replace('/upload/', '/upload/q_auto/');
//   return optimizedUrl;
// };

// const getVideoThumbnail = (videoUrl) => {
//   if (!videoUrl) return null;
//   if (videoUrl.includes('cloudinary')) {
//     return videoUrl.replace('/video/upload/', '/video/upload/w_300,h_500,c_thumb,f_auto,q_auto/');
//   }
//   return null;
// };

// // Search Video Thumbnail Component
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
//           paused={true}
//           muted={true}
//           repeat={false}
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           onLoad={() => {
//             setIsLoading(false);
//           }}
//           onError={(error) => {
//             console.log('Video thumbnail error:', error);
//             setHasError(true);
//             setIsLoading(false);
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
        
//         <View style={styles.playIconOverlay} pointerEvents="none">
//           <View style={styles.playIconCircle}>
//             <MaterialIcons name="play-arrow" size={24} color="#fff" />
//           </View>
//         </View>
        
//         <View style={styles.searchInfoOverlay} pointerEvents="none">
//           <Text style={styles.searchUserText} numberOfLines={1}>
//             @{username || 'user'}
//           </Text>
//           {caption && (
//             <Text style={styles.searchCaptionText} numberOfLines={1}>
//               {caption}
//             </Text>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// });

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
//       source={{ uri }}
//       style={{ width: 0, height: 0 }}
//       paused={true}
//       muted={true}
//       resizeMode="cover"
//       onLoad={onLoad}
//       onError={onError}
//       ignoreSilentSwitch="ignore"
//     />
//   );
// });

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
  
//   // NavBar Styles
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
  
//   // Empty State Styles
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
  
//   // Video Player Styles
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
//   thumbnail: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#000',
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
//   searchResultsList: {
//     padding: 8,
//   },
  
//   // Search Item Styles
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
  
//   // Video Thumbnail Styles
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
//     zIndex: 2,
//   },
//   videoErrorOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 2,
//   },
//   playIconOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
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
//   searchInfoOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     paddingTop: 16,
//     zIndex: 1,
//   },
//   searchUserText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   searchCaptionText: {
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
  
//   // Comment Modal Styles
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
  
//   // Comment Input Styles
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
  
//   // Search Empty Styles
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
  
//   // Snackbar
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
//   const [commentText, setCommentText] = useState('');
//   const [commentsPage, setCommentsPage] = useState(1);
//   const [commentsHasMore, setCommentsHasMore] = useState(true);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [expandedComments, setExpandedComments] = useState({});
//   const [followedUserIds, setFollowedUserIds] = useState([]);
//   const [videoReady, setVideoReady] = useState({});
//   const [replyToComment, setReplyToComment] = useState(null);
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const [localComments, setLocalComments] = useState([]);
//   const [isFlatListReady, setIsFlatListReady] = useState(false);
  
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

//   const VIDEO_CACHE_PREFIX = 'video_cache_';

//   const cacheVideoUrl = async (videoId, url) => {
//     try {
//       await AsyncStorage.setItem(`${VIDEO_CACHE_PREFIX}${videoId}`, url);
//     } catch (error) {
//       console.error('Error caching video:', error);
//     }
//   };

//   const getItemLayout = (data, index) => ({
//     length: height,
//     offset: height * index,
//     index,
//   });

//   const getCachedVideoUrl = async (videoId) => {
//     try {
//       return await AsyncStorage.getItem(`${VIDEO_CACHE_PREFIX}${videoId}`);
//     } catch (error) {
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchFollowedUsers = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await axios.get(`${API_URL}/followed-users/`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.status === 200) {
//           const ids = response.data.map(user => user.id);
//           setFollowedUserIds(ids);
//         }
//       } catch (error) {
//         console.error('Error fetching followed users:', error);
//       }
//     };
    
//     fetchFollowedUsers();
//   }, []);

//   const isFormatSupported = (videoUrl) => {
//     if (!videoUrl) return false;
//     const extension = videoUrl.split('.').pop()?.toLowerCase() || '';
//     const supportedFormats = ['mp4', 'm4v', 'mov', 'avi'];
//     return supportedFormats.includes(extension);
//   };

//   useEffect(() => {
//     if (!shorts || shorts.length === 0) return;
    
//     let filtered = [];
    
//     if (activeTab === 'forYou') {
//       filtered = [...shorts].sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//     } else {
//       filtered = shorts.filter(short => followedUserIds.includes(short.user?.id));
//     }
    
//     setFilteredShorts(filtered);
    
//     if (filtered.length > 0) {
//       const initialPausedState = {};
//       filtered.forEach((_, index) => {
//         initialPausedState[index] = index !== 0;
//       });
//       setPausedVideos(initialPausedState);
//       setCurrentIndex(0);
//     }
//   }, [activeTab, shorts, followedUserIds]);

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
//     setVideoLoadTimes(prev => ({
//       ...prev,
//       [videoId]: Date.now(),
//     }));
//     setBufferedVideos(prev => ({
//       ...prev,
//       [videoId]: true,
//     }));
//   }, []);

//   const handleVideoError = useCallback((videoId, error) => {
//     console.log(`Video ${videoId} error:`, error);
//   }, []);

//   const getBufferConfig = (platform) => {
//     if (platform === 'ios') {
//       return {
//         minBufferMs: 500,
//         maxBufferMs: 3000,
//         bufferForPlaybackMs: 200,
//         bufferForPlaybackAfterRebufferMs: 500,
//       };
//     } else {
//       return {
//         minBufferMs: 1000,
//         maxBufferMs: 4000,
//         bufferForPlaybackMs: 500,
//         bufferForPlaybackAfterRebufferMs: 1000,
//       };
//     }
//   };

//   const initializeVideoStates = (data) => {
//     const initialPausedState = {};
//     data.forEach((_, index) => {
//       initialPausedState[index] = index !== 0;
//     });
//     setPausedVideos(initialPausedState);
//   };

//   const retryVideo = useCallback((index) => {
//     if (videoRefs.current[index]) {
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

//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       fetch(filteredShorts[0]?.video, { method: 'HEAD' })
//         .then(response => {
//           console.log('Video URL status:', response.status);
//         })
//         .catch(error => {
//           console.log('Video URL error:', error);
//         });
//     }
//   }, [filteredShorts]);

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

//   useEffect(() => {
//     if (route.params?.newShort) {
//       setSnackbarMessage('Short uploaded successfully!');
//       setSnackbarVisible(true);
//       fetchShorts(1, true);
//     }
//   }, [route.params?.newShort]);

//   useEffect(() => {
//     fetchShorts(1);
//     setShortsPage(1);
//     setShortsHasMore(true);
//   }, [activeTab]);

//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       const videosToPreload = filteredShorts.slice(
//         Math.max(0, currentIndex - 1),
//         Math.min(filteredShorts.length, currentIndex + 3)
//       );
//       preloadVideos(videosToPreload);
//     }
//   }, [filteredShorts, currentIndex]);

//   const fetchShorts = useCallback(async (pageNum = 1, isRefreshing = false) => {
//     if (loadingShorts || (!shortsHasMore && !isRefreshing)) {
//       return;
//     }
    
//     setLoadingShorts(true);
//     try {
//       if (pageNum === 1) {
//         const cachedShorts = await getCachedShorts();
//         if (cachedShorts && Array.isArray(cachedShorts)) {
//           setShorts(cachedShorts);
//           setFilteredShorts(cachedShorts);
//           initializeVideoStates(cachedShorts);
//         }
//       }

//       const headers = await getAuthHeader();
//       const endpoint = `${API_URL}/shorts/`;
      
//       const response = await axios.get(endpoint, { 
//         headers,
//         params: {
//           page: pageNum,
//           page_size: 5
//         }
//       });

//       if (response.status === 200) {
//         let newShorts = [];
        
//         if (Array.isArray(response.data)) {
//           newShorts = response.data;
//           setShortsHasMore(false);
//         } else if (response.data.results && Array.isArray(response.data.results)) {
//           newShorts = response.data.results;
//           setShortsHasMore(!!response.data.next);
//         }
        
//         let processedShorts = newShorts.map(short => {
//           const videoUrl = short.video?.replace(/\/\//g, '/').replace(':/', '://');
//           const extension = videoUrl?.split('.').pop()?.toLowerCase() || '';
          
//           return {
//             ...short,
//             video: videoUrl,
//             video_mp4: videoUrl?.replace(/\.webm$/, '.mp4'),
//             video_format: extension,
//             is_supported: ['mp4', 'mov', 'm4v'].includes(extension),
//             video_thumbnail: getVideoThumbnail(videoUrl),
//           };
//         });

//         if (isRefreshing || pageNum === 1) {
//           setShorts(processedShorts);
//           setFilteredShorts(processedShorts);
//           initializeVideoStates(processedShorts);
//         } else {
//           setShorts(prev => [...(prev || []), ...processedShorts]);
//           setFilteredShorts(prev => [...(prev || []), ...processedShorts]);
//         }
        
//         if (!isRefreshing) {
//           setShortsPage(pageNum + 1);
//         }
        
//         if (pageNum === 1 && processedShorts.length > 0) {
//           await setCachedShorts(processedShorts);
//         }
        
//         if (processedShorts.length > 0) {
//           preloadVideos(processedShorts.slice(0, 3));
//         }
//       }
//     } catch (error) {
//       console.error('Fetch Shorts Error:', error.message);
//     } finally {
//       setLoadingShorts(false);
//       setRefreshing(false);
//     }
//   }, [activeTab, shortsPage, shortsHasMore, loadingShorts]);

//   const fetchComments = useCallback(async (shortId, page = 1, isLoadMore = false) => {
//     if (loadingComments || (!commentsHasMore && isLoadMore)) return;
    
//     setLoadingComments(true);
//     try {
//       if (page === 1) {
//         const cachedComments = await getCachedComments(shortId);
//         if (cachedComments && Array.isArray(cachedComments)) {
//           const cachedWithHttps = cachedComments.map(comment => ({
//             ...comment,
//             user: {
//               ...comment.user,
//               profile_picture: getSecureUrl(comment.user?.profile_picture)
//             },
//             replies: comment.replies?.map(reply => ({
//               ...reply,
//               user: {
//                 ...reply.user,
//                 profile_picture: getSecureUrl(reply.user?.profile_picture)
//               }
//             })) || []
//           }));
//           setLocalComments(cachedWithHttps);
//         }
//       }

//       const headers = await getAuthHeader();
//       const response = await axios.get(
//         `${API_URL}/shorts/${shortId}/comments/`,
//         { 
//           headers,
//           params: {
//             page: page,
//             page_size: 20
//           }
//         }
//       );
      
//       if (response.status === 200) {
//         let newComments = [];
//         if (response.data.results && Array.isArray(response.data.results)) {
//           newComments = response.data.results;
//           setCommentsHasMore(!!response.data.next);
//           setCommentsPage(page + 1);
//         } else if (Array.isArray(response.data)) {
//           newComments = response.data;
//           setCommentsHasMore(false);
//         }
        
//         const currentUser = await getCurrentUser();
//         const commentsWithOwn = newComments.map(comment => ({
//           ...comment,
//           is_own: comment.user?.id === currentUser.id,
//           like_count: comment.like_count || 0,
//           is_liked: comment.is_liked || false,
//           user: {
//             ...comment.user,
//             profile_picture: getSecureUrl(comment.user?.profile_picture)
//           },
//           replies: comment.replies?.map(reply => ({
//             ...reply,
//             is_own: reply.user?.id === currentUser.id,
//             like_count: reply.like_count || 0,
//             is_liked: reply.is_liked || false,
//             user: {
//               ...reply.user,
//               profile_picture: getSecureUrl(reply.user?.profile_picture)
//             }
//           })) || []
//         }));
        
//         setLocalComments(prev => {
//           if (page === 1) return commentsWithOwn;
//           const existingIds = new Set(prev.map(c => c.id));
//           const newUnique = commentsWithOwn.filter(c => !existingIds.has(c.id));
//           return [...prev, ...newUnique];
//         });
        
//         if (page === 1) {
//           await setCachedComments(shortId, commentsWithOwn);
//         }
//       }
//     } catch (error) {
//       console.error('Fetch Comments Error:', error);
//       if (page === 1) {
//         setLocalComments([]);
//       }
//     } finally {
//       setLoadingComments(false);
//     }
//   }, [loadingComments, commentsHasMore]);

//   const handleReplyPress = (comment) => {
//     setReplyToComment(comment);
//     setCommentText(`@${comment.user?.name || 'user'} `);
//   };

//   const fetchCommentReplies = useCallback(async (commentId) => {
//     try {
//       const headers = await getAuthHeader();
//       const response = await axios.get(
//         `${API_URL}/shorts/comments/${commentId}/replies/`,
//         { headers }
//       );
      
//       if (response.status === 200) {
//         const currentUser = await getCurrentUser();
//         return response.data.replies.map(reply => ({
//           ...reply,
//           is_own: reply.user?.id === currentUser.id,
//           like_count: reply.like_count || 0,
//           is_liked: reply.is_liked || false,
//           user: {
//             ...reply.user,
//             profile_picture: getSecureUrl(reply.user?.profile_picture)
//           }
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Fetch Replies Error:', error);
//       return [];
//     }
//   }, []);

//   const postComment = useCallback(async (shortId, text, parentId = null) => {
//     if (!text.trim() || isSubmittingComment) return null;

//     setIsSubmittingComment(true);
//     try {
//       const currentUser = await getCurrentUser();
//       const headers = await getAuthHeader();
      
//       const requestData = { 
//         text: text.trim(),
//         ...(parentId && { parent: parentId })
//       };
      
//       const tempId = Date.now();
//       const optimisticComment = {
//         id: tempId,
//         text: text.trim(),
//         user: {
//           ...currentUser,
//           profile_picture: getSecureUrl(currentUser.profile_picture)
//         },
//         created_at: new Date().toISOString(),
//         like_count: 0,
//         reply_count: 0,
//         is_liked: false,
//         is_own: true,
//         replies: [],
//         parent: parentId
//       };

//       if (parentId) {
//         setLocalComments(prev => 
//           prev.map(comment => 
//             comment.id === parentId 
//               ? { 
//                   ...comment, 
//                   replies: [...(comment.replies || []), optimisticComment],
//                   reply_count: (comment.reply_count || 0) + 1
//                 }
//               : comment
//           )
//         );
//       } else {
//         setLocalComments(prev => [optimisticComment, ...prev]);
//       }

//       if (selectedShort) {
//         setSelectedShort(prev => ({
//           ...prev,
//           comment_count: (prev.comment_count || 0) + 1
//         }));
//       }

//       setCommentText('');
//       setReplyToComment(null);

//       const response = await axios.post(
//         `${API_URL}/shorts/${shortId}/comment/`,
//         requestData,
//         { headers }
//       );

//       if (response.data) {
//         const realComment = {
//           ...response.data,
//           is_own: true,
//           like_count: 0,
//           is_liked: false,
//           user: {
//             ...currentUser,
//             profile_picture: getSecureUrl(currentUser.profile_picture)
//           }
//         };

//         setLocalComments(prev => {
//           if (parentId) {
//             return prev.map(comment => 
//               comment.id === parentId 
//                 ? { 
//                     ...comment, 
//                     replies: comment.replies.map(r => 
//                       r.id === tempId ? realComment : r
//                     )
//                   }
//                 : comment
//             );
//           } else {
//             return prev.map(c => c.id === tempId ? realComment : c);
//           }
//         });
//       }

//       return response.data;
      
//     } catch (error) {
//       console.error('Error posting comment:', error.response?.data || error.message);
      
//       setLocalComments(prev => 
//         prev.filter(c => c.id !== Date.now())
//       );
      
//       Alert.alert('Error', 'Failed to post comment. Please try again.');
//       throw error;
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   }, [selectedShort, isSubmittingComment]);

//   const likeComment = useCallback(async (commentId, isLiked) => {
//     setLocalComments(prev => 
//       prev.map(comment => {
//         if (comment.id === commentId) {
//           return {
//             ...comment,
//             is_liked: !isLiked,
//             like_count: isLiked ? comment.like_count - 1 : comment.like_count + 1
//           };
//         }
//         if (comment.replies && comment.replies.length > 0) {
//           return {
//             ...comment,
//             replies: comment.replies.map(reply => 
//               reply.id === commentId 
//                 ? {
//                     ...reply,
//                     is_liked: !isLiked,
//                     like_count: isLiked ? reply.like_count - 1 : reply.like_count + 1
//                   }
//                 : reply
//             )
//           };
//         }
//         return comment;
//       })
//     );

//     try {
//       const headers = await getAuthHeader();
//       await axios.post(
//         `${API_URL}/shorts/comments/${commentId}/like/`,
//         {},
//         { headers }
//       );
//     } catch (error) {
//       console.error('Like Comment Error:', error);
//       setLocalComments(prev => 
//         prev.map(comment => {
//           if (comment.id === commentId) {
//             return {
//               ...comment,
//               is_liked: isLiked,
//               like_count: isLiked ? comment.like_count + 1 : comment.like_count - 1
//             };
//           }
//           if (comment.replies && comment.replies.length > 0) {
//             return {
//               ...comment,
//               replies: comment.replies.map(reply => 
//                 reply.id === commentId 
//                   ? {
//                       ...reply,
//                       is_liked: isLiked,
//                       like_count: isLiked ? reply.like_count + 1 : reply.like_count - 1
//                     }
//                   : reply
//               )
//             };
//           }
//           return comment;
//         })
//       );
//     }
//   }, []);

//   const deleteComment = useCallback(async (commentId) => {
//     Alert.alert(
//       'Delete Comment',
//       'Are you sure you want to delete this comment?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             setLocalComments(prev => prev.filter(c => c.id !== commentId));
//             setLocalComments(prev => 
//               prev.map(comment => ({
//                 ...comment,
//                 replies: comment.replies?.filter(r => r.id !== commentId) || []
//               }))
//             );

//             try {
//               const headers = await getAuthHeader();
//               await axios.delete(
//                 `${API_URL}/shorts/comments/${commentId}/delete/`,
//                 { headers }
//               );
              
//               setSnackbarMessage('Comment deleted');
//               setSnackbarVisible(true);
              
//             } catch (error) {
//               console.error('Delete Comment Error:', error);
//               Alert.alert('Error', 'Failed to delete comment');
//               if (selectedShort) {
//                 fetchComments(selectedShort.id, 1);
//               }
//             }
//           }
//         }
//       ]
//     );
//   }, [selectedShort]);

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
//     } catch (error) {
//       console.error('Like Error:', error);
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
//     setSelectedShort(short);
//     setLocalComments([]);
//     setCommentsPage(1);
//     setCommentsHasMore(true);
//     setReplyToComment(null);
//     setCommentText('');
//     setCommentModalVisible(true);
//     fetchComments(short.id, 1);
//   };

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
//     setSearchModalVisible(false);
//     setSearchQuery('');
    
//     const index = shorts.findIndex(s => s.id === item.id);
//     if (index !== -1 && flatListRef.current) {
//       if (isFlatListReady) {
//         try {
//           flatListRef.current.scrollToIndex({ 
//             index, 
//             animated: true,
//             viewPosition: 0.5
//           });
//         } catch (error) {
//           flatListRef.current.scrollToOffset({
//             offset: index * height,
//             animated: true
//           });
//         }
//       } else {
//         setTimeout(() => {
//           if (flatListRef.current) {
//             try {
//               flatListRef.current.scrollToIndex({ 
//                 index, 
//                 animated: true,
//                 viewPosition: 0.5
//               });
//             } catch (error) {
//               flatListRef.current.scrollToOffset({
//                 offset: index * height,
//                 animated: true
//               });
//             }
//           }
//         }, 300);
//       }
//     }
//   };

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
      
//       setCurrentIndex(newIndex);
      
//       setPausedVideos(prev => {
//         const newState = {};
//         filteredShorts.forEach((_, index) => {
//           newState[index] = index !== newIndex;
//         });
//         return newState;
//       });
      
//       if (videoRefs.current[newIndex]) {
//         setTimeout(() => {
//           videoRefs.current[newIndex]?.seek(0);
//         }, 100);
//       }
//     }
//   }).current;

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 90,
//   }).current;

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
//         <Video
//           ref={ref => videoRefs.current[index] = ref}
//           source={{ 
//             uri: getOptimizedVideoUrl(item.video),
//             headers: {
//               'Cache-Control': 'max-age=31536000, public',
//             }
//           }}
//           style={styles.video}
//           resizeMode="cover"
//           repeat={true}
//           paused={!isCurrent || isPaused}
//           onLoad={() => {
//             setVideoReady(prev => ({ ...prev, [item.id]: true }));
//             handleVideoLoad(item.id);
//           }}
//           onError={(error) => {
//             console.log(`Video ${item.id} error:`, error);
//             handleVideoError(item.id, error);
//           }}
//           bufferConfig={getBufferConfig(Platform.OS)}
//           poster={item.video_thumbnail}
//           posterResizeMode="cover"
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           preventsDisplaySleepDuringVideoPlayback={false}
//           progressUpdateInterval={250}
//           useTextureView={Platform.OS === 'android'}
//           preferredForwardBufferDuration={Platform.OS === 'ios' ? 1 : 2}
//         />

//         {!videoReady[item.id] && isCurrent && (
//           <Image 
//             source={{ uri: item.video_thumbnail }}
//             style={[styles.video, styles.thumbnail]}
//             resizeMode="cover"
//           />
//         )}

//         {isCurrent && !isBuffered && (
//           <View style={styles.bufferingOverlay}>
//             <ActivityIndicator size="large" color="#DC143C" />
//             <Text style={styles.bufferingText}>Buffering...</Text>
//           </View>
//         )}

//         {filteredShorts && filteredShorts[index + 1] && (
//           <VideoPreloader
//             uri={filteredShorts[index + 1]?.video}
//             isVisible={false}
//             onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
//             onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
//           />
//         )}

//         <View style={styles.overlay}>
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
//                 <Image
//                   source={
//                     item.user?.profile_picture
//                       ? { uri: getSecureUrl(item.user.profile_picture) }
//                       : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                   }
//                   style={styles.shortAvatar}
//                 />
//                 <Text style={styles.username}>
//                   @{item.user?.name?.slice(0,8) || 'user'}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             {/* <TouchableOpacity
//               onPress={() => retryVideo(index)}
//               style={styles.iconBtn}
//             >
//               <Ionicons name="refresh" size={30} color="#fff" />
//               <Text style={styles.countText}>Retry</Text>
//             </TouchableOpacity> */}
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

//   const CommentItem = memo(({ 
//     comment, 
//     onLike, 
//     onReply, 
//     onDelete,
//     onLoadReplies,
//     expanded,
//     onToggleExpand,
//     level = 0,
//     onReplyPress
//   }) => {
//     const [localLiked, setLocalLiked] = useState(comment.is_liked || false);
//     const [localLikeCount, setLocalLikeCount] = useState(comment.like_count || 0);
//     const [replies, setReplies] = useState(comment.replies || []);
//     const [loadingReplies, setLoadingReplies] = useState(false);

//     useEffect(() => {
//       setLocalLiked(comment.is_liked || false);
//       setLocalLikeCount(comment.like_count || 0);
//       setReplies(comment.replies || []);
//     }, [comment]);

//     const handleLike = async () => {
//       const newLiked = !localLiked;
//       const newCount = newLiked ? localLikeCount + 1 : localLikeCount - 1;
      
//       setLocalLiked(newLiked);
//       setLocalLikeCount(newCount);
      
//       await onLike(comment.id, comment.is_liked);
//     };

//     const handleLoadReplies = async () => {
//       setLoadingReplies(true);
//       const loadedReplies = await onLoadReplies(comment.id);
//       setReplies(loadedReplies);
//       setLoadingReplies(false);
//     };

//     const getUserDisplay = () => {
//       if (typeof comment.user === 'string') {
//         return {
//           name: comment.user.split('@')[0],
//           profile_picture: null
//         };
//       }
//       return {
//         name: comment.user?.name || comment.user?.username || 'User',
//         profile_picture: getSecureUrl(comment.user?.profile_picture)
//       };
//     };

//     const user = getUserDisplay();
//     const isOwnComment = comment.is_own || false;

//     return (
//       <View style={[
//         styles.commentContainer,
//         level > 0 && styles.replyContainer
//       ]}>
//         <View style={styles.commentHeader}>
//           <View style={styles.commentUserContainer}>
//             <Image
//               source={
//                 user.profile_picture
//                   ? { uri: user.profile_picture }
//                   : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//               }
//               style={styles.commentAvatar}
//             />
//             <View>
//               <Text style={styles.commentUser}>{user.name}</Text>
//               <Text style={styles.commentTime}>
//                 {new Date(comment.created_at).toLocaleDateString()}
//               </Text>
//             </View>
//           </View>
          
//           <View style={styles.commentActions}>
//             {isOwnComment && (
//               <TouchableOpacity
//                 onPress={() => onDelete(comment.id)}
//                 style={styles.commentActionBtn}
//               >
//                 <Ionicons name="trash-outline" size={18} color="#FF4444" />
//               </TouchableOpacity>
//             )}
            
//             <TouchableOpacity
//               onPress={handleLike}
//               style={styles.commentActionBtn}
//             >
//               <Ionicons
//                 name={localLiked ? 'heart' : 'heart-outline'}
//                 size={18}
//                 color={localLiked ? '#DC143C' : '#666'}
//               />
//               <Text style={styles.commentLikeCount}>{localLikeCount}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <Text style={styles.commentText}>{comment.text}</Text>

//         <View style={styles.commentFooter}>
//           <TouchableOpacity
//             onPress={() => onReplyPress(comment)}
//             style={styles.replyBtn}
//           >
//             <Text style={styles.replyBtnText}>Reply</Text>
//           </TouchableOpacity>

//           {comment.reply_count > 0 && !expanded && (
//             <TouchableOpacity
//               onPress={() => {
//                 onToggleExpand(comment.id);
//                 handleLoadReplies();
//               }}
//               style={styles.viewRepliesBtn}
//             >
//               <Text style={styles.viewRepliesText}>
//                 View {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {expanded && replies.length > 0 && (
//           <View style={styles.repliesList}>
//             {replies.map(reply => (
//               <CommentItem
//                 key={reply.id}
//                 comment={reply}
//                 onLike={onLike}
//                 onReply={onReply}
//                 onDelete={onDelete}
//                 onLoadReplies={onLoadReplies}
//                 expanded={false}
//                 onToggleExpand={() => {}}
//                 level={level + 1}
//                 onReplyPress={onReplyPress}
//               />
//             ))}
//             {loadingReplies && (
//               <ActivityIndicator size="small" color="#DC143C" style={styles.repliesLoader} />
//             )}
//           </View>
//         )}
//       </View>
//     );
//   });

//   return (
//     <SafeAreaView style={styles.container} edges={['right', 'left']}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
      
//       {renderNavBar()}
      
//       <FlatList
//         ref={flatListRef}
//         data={filteredShorts}
//         keyExtractor={(item) => `short-${item.id}`}
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
//         scrollEventThrottle={16}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         getItemLayout={getItemLayout}
//         onScrollToIndexFailed={(info) => {
//           const wait = new Promise(resolve => setTimeout(resolve, 500));
//           wait.then(() => {
//             if (flatListRef.current) {
//               flatListRef.current.scrollToIndex({ 
//                 index: info.index, 
//                 animated: true,
//                 viewPosition: 0.5
//               });
//             }
//           });
//         }}
//         onLayout={() => setIsFlatListReady(true)}
//         ListFooterComponent={
//           loadingShorts && filteredShorts.length > 0 ? (
//             <View style={styles.footerLoader}>
//               <ActivityIndicator size="large" color="#DC143C" />
//               <Text style={styles.footerText}>Loading more videos...</Text>
//             </View>
//           ) : null
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#DC143C']}
//             tintColor="#fff"
//           />
//         }
//         ListEmptyComponent={
//           <ImageBackground
//             source={require('../assets/images/original.jpg')}
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
//                   ? 'Follow creators to see their videos!'
//                   : loadingShorts ? 'Loading videos...' : 'No videos available'}
//               </Animated.Text>
//               {!loadingShorts && activeTab === 'forYou' && (
//                 <TouchableOpacity 
//                   style={styles.refreshButton}
//                   onPress={() => fetchShorts(1, true)}
//                 >
//                   <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </ImageBackground>
//         }
//       />

//       {/* Comments Modal */}
//       <Modal
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
//                     <ActivityIndicator size="small" color="#DC143C" />
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

//       {/* Search Modal */}
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
//             <View style={[styles.searchInputContainer,{marginTop:30}]}>
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
//             data={filteredShorts}
//             keyExtractor={(item) => item.id.toString()}
//             numColumns={2}
//             renderItem={({ item }) => (
//               <SearchVideoThumbnail
//                 videoUrl={item.video}
//                 username={item.user?.name}
//                 caption={item.caption}
//                 onPress={() => handleSearchResultPress(item)}
//               />
//             )}
//             ListEmptyComponent={
//               <View style={styles.searchEmptyContainer}>
//                 <Icon name="search" size={50} color="#ccc" />
//                 <Text style={styles.searchEmptyText}>
//                   {searchQuery ? 'No videos found' : 'Search for videos or creators'}
//                 </Text>
//               </View>
//             }
//             contentContainerStyle={styles.searchResultsList}
//             showsVerticalScrollIndicator={false}
//           />
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



//// ===================================
//.           WORKING 
//=====================================

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
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   TouchableWithoutFeedback,
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

// // Helper functions
// const getSecureUrl = (url) => {
//   if (!url) return null;
//   if (url.startsWith('https://')) return url;
//   if (url.startsWith('http://')) {
//     return url.replace('http://', 'https://');
//   }
//   if (url.startsWith('/')) {
//     return `${API_ROUTE_IMAGE.replace('http://', 'https://')}${url}`;
//   }
//   return url;
// };

// const getOptimizedVideoUrl = (videoUrl) => {
//   if (!videoUrl || !videoUrl.includes('cloudinary')) return videoUrl;
  
//   const urlParts = videoUrl.split('.');
//   const currentFormat = urlParts.pop()?.toLowerCase();
  
//   let optimizedUrl = videoUrl;
  
//   if (Platform.OS === 'ios') {
//     if (currentFormat !== 'mp4') {
//       optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
//     }
//   } else if (Platform.OS === 'android') {
//     if (currentFormat !== 'mp4') {
//       optimizedUrl = videoUrl.replace('/upload/', '/upload/f_mp4/');
//     }
//   } else {
//     optimizedUrl = videoUrl.replace('/upload/', '/upload/f_auto/');
//   }
  
//   optimizedUrl = optimizedUrl.replace('/upload/', '/upload/q_auto/');
//   return optimizedUrl;
// };

// const getVideoThumbnail = (videoUrl) => {
//   if (!videoUrl) return null;
//   if (videoUrl.includes('cloudinary')) {
//     return videoUrl.replace('/video/upload/', '/video/upload/w_300,h_500,c_thumb,f_auto,q_auto/');
//   }
//   return null;
// };

// // Search Video Thumbnail Component
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
//           paused={true}
//           muted={true}
//           repeat={false}
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           onLoad={() => {
//             setIsLoading(false);
//           }}
//           onError={(error) => {
//             console.log('Video thumbnail error:', error);
//             setHasError(true);
//             setIsLoading(false);
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
        
//         <View style={styles.playIconOverlay} pointerEvents="none">
//           <View style={styles.playIconCircle}>
//             <MaterialIcons name="play-arrow" size={24} color="#fff" />
//           </View>
//         </View>
        
//         <View style={styles.searchInfoOverlay} pointerEvents="none">
//           <Text style={styles.searchUserText} numberOfLines={1}>
//             @{username || 'user'}
//           </Text>
//           {caption && (
//             <Text style={styles.searchCaptionText} numberOfLines={1}>
//               {caption}
//             </Text>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// });

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
//       source={{ uri }}
//       style={{ width: 0, height: 0 }}
//       paused={true}
//       muted={true}
//       resizeMode="cover"
//       onLoad={onLoad}
//       onError={onError}
//       ignoreSilentSwitch="ignore"
//     />
//   );
// });

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
  
//   // NavBar Styles
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
  
//   // Empty State Styles
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
  
//   // Video Player Styles
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
//   thumbnail: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#000',
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
//   searchResultsList: {
//     padding: 8,
//   },
  
//   // Search Item Styles
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
  
//   // Video Thumbnail Styles
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
//     zIndex: 2,
//   },
//   videoErrorOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 2,
//   },
//   playIconOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
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
//   searchInfoOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     paddingTop: 16,
//     zIndex: 1,
//   },
//   searchUserText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   searchCaptionText: {
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
  
//   // Comment Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//    commentModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: Platform.OS === 'ios' ? '85%' : '80%',
//     maxHeight: Platform.OS === 'ios' ? '90%' : '85%',
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
  
//   commentInputWrapper: {
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     backgroundColor: '#fff',
//     paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
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
//  commentInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end', 
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
//     minHeight: 40,
//     textAlignVertical: 'center', 
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
  
//   // Search Empty Styles
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
  
//   // Snackbar
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
//   const [commentText, setCommentText] = useState('');
//   const [commentsPage, setCommentsPage] = useState(1);
//   const [commentsHasMore, setCommentsHasMore] = useState(true);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [expandedComments, setExpandedComments] = useState({});
//   const [followedUserIds, setFollowedUserIds] = useState([]);
//   const [videoReady, setVideoReady] = useState({});
//   const [replyToComment, setReplyToComment] = useState(null);
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const [localComments, setLocalComments] = useState([]);
//   const [isFlatListReady, setIsFlatListReady] = useState(false);
  
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


//   useEffect(() => {
//     if (isCommentModalVisible) {
//       const keyboardDidShowListener = Keyboard.addListener(
//         'keyboardDidShow',
//         () => {
//           if (flatListRef.current && localComments.length > 0) {
//             flatListRef.current.scrollToEnd({ animated: true });
//           }
//         }
//       );

//       return () => {
//         keyboardDidShowListener.remove();
//       };
//     }
//   }, [isCommentModalVisible, localComments.length]);

//   const VIDEO_CACHE_PREFIX = 'video_cache_';

//   const cacheVideoUrl = async (videoId, url) => {
//     try {
//       await AsyncStorage.setItem(`${VIDEO_CACHE_PREFIX}${videoId}`, url);
//     } catch (error) {
//       console.error('Error caching video:', error);
//     }
//   };

//   const getItemLayout = (data, index) => ({
//     length: height,
//     offset: height * index,
//     index,
//   });

//   const getCachedVideoUrl = async (videoId) => {
//     try {
//       return await AsyncStorage.getItem(`${VIDEO_CACHE_PREFIX}${videoId}`);
//     } catch (error) {
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchFollowedUsers = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await axios.get(`${API_URL}/followed-users/`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.status === 200) {
//           const ids = response.data.map(user => user.id);
//           setFollowedUserIds(ids);
//         }
//       } catch (error) {
//         console.error('Error fetching followed users:', error);
//       }
//     };
    
//     fetchFollowedUsers();
//   }, []);

//   const isFormatSupported = (videoUrl) => {
//     if (!videoUrl) return false;
//     const extension = videoUrl.split('.').pop()?.toLowerCase() || '';
//     const supportedFormats = ['mp4', 'm4v', 'mov', 'avi'];
//     return supportedFormats.includes(extension);
//   };

//   useEffect(() => {
//     if (!shorts || shorts.length === 0) return;
    
//     let filtered = [];
    
//     if (activeTab === 'forYou') {
//       filtered = [...shorts].sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));
//     } else {
//       filtered = shorts.filter(short => followedUserIds.includes(short.user?.id));
//     }
    
//     setFilteredShorts(filtered);
    
//     if (filtered.length > 0) {
//       const initialPausedState = {};
//       filtered.forEach((_, index) => {
//         initialPausedState[index] = index !== 0;
//       });
//       setPausedVideos(initialPausedState);
//       setCurrentIndex(0);
//     }
//   }, [activeTab, shorts, followedUserIds]);

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
//     setVideoLoadTimes(prev => ({
//       ...prev,
//       [videoId]: Date.now(),
//     }));
//     setBufferedVideos(prev => ({
//       ...prev,
//       [videoId]: true,
//     }));
//   }, []);

//   const handleVideoError = useCallback((videoId, error) => {
//     console.log(`Video ${videoId} error:`, error);
//   }, []);

//   const getBufferConfig = (platform) => {
//     if (platform === 'ios') {
//       return {
//         minBufferMs: 500,
//         maxBufferMs: 3000,
//         bufferForPlaybackMs: 200,
//         bufferForPlaybackAfterRebufferMs: 500,
//       };
//     } else {
//       return {
//         minBufferMs: 1000,
//         maxBufferMs: 4000,
//         bufferForPlaybackMs: 500,
//         bufferForPlaybackAfterRebufferMs: 1000,
//       };
//     }
//   };

//   const initializeVideoStates = (data) => {
//     const initialPausedState = {};
//     data.forEach((_, index) => {
//       initialPausedState[index] = index !== 0;
//     });
//     setPausedVideos(initialPausedState);
//   };

//   const retryVideo = useCallback((index) => {
//     if (videoRefs.current[index]) {
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

//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       fetch(filteredShorts[0]?.video, { method: 'HEAD' })
//         .then(response => {
//           console.log('Video URL status:', response.status);
//         })
//         .catch(error => {
//           console.log('Video URL error:', error);
//         });
//     }
//   }, [filteredShorts]);

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

//   useEffect(() => {
//     if (route.params?.newShort) {
//       setSnackbarMessage('Short uploaded successfully!');
//       setSnackbarVisible(true);
//       fetchShorts(1, true);
//     }
//   }, [route.params?.newShort]);

//   useEffect(() => {
//     fetchShorts(1);
//     setShortsPage(1);
//     setShortsHasMore(true);
//   }, [activeTab]);

//   useEffect(() => {
//     if (filteredShorts.length > 0) {
//       const videosToPreload = filteredShorts.slice(
//         Math.max(0, currentIndex - 1),
//         Math.min(filteredShorts.length, currentIndex + 3)
//       );
//       preloadVideos(videosToPreload);
//     }
//   }, [filteredShorts, currentIndex]);

//   const fetchShorts = useCallback(async (pageNum = 1, isRefreshing = false) => {
//     if (loadingShorts || (!shortsHasMore && !isRefreshing)) {
//       return;
//     }
    
//     setLoadingShorts(true);
//     try {
//       if (pageNum === 1) {
//         const cachedShorts = await getCachedShorts();
//         if (cachedShorts && Array.isArray(cachedShorts)) {
//           setShorts(cachedShorts);
//           setFilteredShorts(cachedShorts);
//           initializeVideoStates(cachedShorts);
//         }
//       }

//       const headers = await getAuthHeader();
//       const endpoint = `${API_URL}/shorts/`;
      
//       const response = await axios.get(endpoint, { 
//         headers,
//         params: {
//           page: pageNum,
//           page_size: 5
//         }
//       });

//       if (response.status === 200) {
//         let newShorts = [];
        
//         if (Array.isArray(response.data)) {
//           newShorts = response.data;
//           setShortsHasMore(false);
//         } else if (response.data.results && Array.isArray(response.data.results)) {
//           newShorts = response.data.results;
//           setShortsHasMore(!!response.data.next);
//         }
        
//         let processedShorts = newShorts.map(short => {
//           const videoUrl = short.video?.replace(/\/\//g, '/').replace(':/', '://');
//           const extension = videoUrl?.split('.').pop()?.toLowerCase() || '';
          
//           return {
//             ...short,
//             video: videoUrl,
//             video_mp4: videoUrl?.replace(/\.webm$/, '.mp4'),
//             video_format: extension,
//             is_supported: ['mp4', 'mov', 'm4v'].includes(extension),
//             video_thumbnail: getVideoThumbnail(videoUrl),
//           };
//         });

//         if (isRefreshing || pageNum === 1) {
//           setShorts(processedShorts);
//           setFilteredShorts(processedShorts);
//           initializeVideoStates(processedShorts);
//         } else {
//           setShorts(prev => [...(prev || []), ...processedShorts]);
//           setFilteredShorts(prev => [...(prev || []), ...processedShorts]);
//         }
        
//         if (!isRefreshing) {
//           setShortsPage(pageNum + 1);
//         }
        
//         if (pageNum === 1 && processedShorts.length > 0) {
//           await setCachedShorts(processedShorts);
//         }
        
//         if (processedShorts.length > 0) {
//           preloadVideos(processedShorts.slice(0, 3));
//         }
//       }
//     } catch (error) {
//       console.error('Fetch Shorts Error:', error.message);
//     } finally {
//       setLoadingShorts(false);
//       setRefreshing(false);
//     }
//   }, [activeTab, shortsPage, shortsHasMore, loadingShorts]);

//   const fetchComments = useCallback(async (shortId, page = 1, isLoadMore = false) => {
//     if (loadingComments || (!commentsHasMore && isLoadMore)) return;
    
//     setLoadingComments(true);
//     try {
//       if (page === 1) {
//         const cachedComments = await getCachedComments(shortId);
//         if (cachedComments && Array.isArray(cachedComments)) {
//           const cachedWithHttps = cachedComments.map(comment => ({
//             ...comment,
//             user: {
//               ...comment.user,
//               profile_picture: getSecureUrl(comment.user?.profile_picture)
//             },
//             replies: comment.replies?.map(reply => ({
//               ...reply,
//               user: {
//                 ...reply.user,
//                 profile_picture: getSecureUrl(reply.user?.profile_picture)
//               }
//             })) || []
//           }));
//           setLocalComments(cachedWithHttps);
//         }
//       }

//       const headers = await getAuthHeader();
//       const response = await axios.get(
//         `${API_URL}/shorts/${shortId}/comments/`,
//         { 
//           headers,
//           params: {
//             page: page,
//             page_size: 20
//           }
//         }
//       );
      
//       if (response.status === 200) {
//         let newComments = [];
//         if (response.data.results && Array.isArray(response.data.results)) {
//           newComments = response.data.results;
//           setCommentsHasMore(!!response.data.next);
//           setCommentsPage(page + 1);
//         } else if (Array.isArray(response.data)) {
//           newComments = response.data;
//           setCommentsHasMore(false);
//         }
        
//         const currentUser = await getCurrentUser();
//         const commentsWithOwn = newComments.map(comment => ({
//           ...comment,
//           is_own: comment.user?.id === currentUser.id,
//           like_count: comment.like_count || 0,
//           is_liked: comment.is_liked || false,
//           user: {
//             ...comment.user,
//             profile_picture: getSecureUrl(comment.user?.profile_picture)
//           },
//           replies: comment.replies?.map(reply => ({
//             ...reply,
//             is_own: reply.user?.id === currentUser.id,
//             like_count: reply.like_count || 0,
//             is_liked: reply.is_liked || false,
//             user: {
//               ...reply.user,
//               profile_picture: getSecureUrl(reply.user?.profile_picture)
//             }
//           })) || []
//         }));
        
//         setLocalComments(prev => {
//           if (page === 1) return commentsWithOwn;
//           const existingIds = new Set(prev.map(c => c.id));
//           const newUnique = commentsWithOwn.filter(c => !existingIds.has(c.id));
//           return [...prev, ...newUnique];
//         });
        
//         if (page === 1) {
//           await setCachedComments(shortId, commentsWithOwn);
//         }
//       }
//     } catch (error) {
//       console.error('Fetch Comments Error:', error);
//       if (page === 1) {
//         setLocalComments([]);
//       }
//     } finally {
//       setLoadingComments(false);
//     }
//   }, [loadingComments, commentsHasMore]);

//   const handleReplyPress = (comment) => {
//     setReplyToComment(comment);
//     setCommentText(`@${comment.user?.name || 'user'} `);
//   };

//   const fetchCommentReplies = useCallback(async (commentId) => {
//     try {
//       const headers = await getAuthHeader();
//       const response = await axios.get(
//         `${API_URL}/shorts/comments/${commentId}/replies/`,
//         { headers }
//       );
      
//       if (response.status === 200) {
//         const currentUser = await getCurrentUser();
//         return response.data.replies.map(reply => ({
//           ...reply,
//           is_own: reply.user?.id === currentUser.id,
//           like_count: reply.like_count || 0,
//           is_liked: reply.is_liked || false,
//           user: {
//             ...reply.user,
//             profile_picture: getSecureUrl(reply.user?.profile_picture)
//           }
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Fetch Replies Error:', error);
//       return [];
//     }
//   }, []);

// const postComment = useCallback(async (shortId, text, parentId = null) => {
//   if (!text.trim() || isSubmittingComment) return null;

//   setIsSubmittingComment(true);
//   try {
//     const currentUser = await getCurrentUser();
//     const headers = await getAuthHeader();
    
//     const requestData = { 
//       text: text.trim(),
//       ...(parentId && { parent: parentId })
//     };
    
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

//     if (parentId) {
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
//       setLocalComments(prev => [optimisticComment, ...prev]);
      
//       // Update comment count in shorts and filteredShorts for new top-level comments
//       setShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === shortId
//             ? {
//                 ...short,
//                 comment_count: (short.comment_count || 0) + 1
//               }
//             : short
//         )
//       );
      
//       setFilteredShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === shortId
//             ? {
//                 ...short,
//                 comment_count: (short.comment_count || 0) + 1
//               }
//             : short
//         )
//       );
//     }

//     // Update selectedShort comment count
//     if (selectedShort) {
//       setSelectedShort(prev => ({
//         ...prev,
//         comment_count: (prev.comment_count || 0) + 1
//       }));
//     }

//     setCommentText('');
//     setReplyToComment(null);

//     const response = await axios.post(
//       `${API_URL}/shorts/${shortId}/comment/`,
//       requestData,
//       { headers }
//     );

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
//           return prev.map(c => c.id === tempId ? realComment : c);
//         }
//       });
//     }

//     return response.data;
    
//   } catch (error) {
//     console.error('Error posting comment:', error.response?.data || error.message);
    
//     // Revert optimistic updates
//     setLocalComments(prev => 
//       prev.filter(c => c.id !== Date.now())
//     );
    
//     // Revert comment count in shorts
//     setShorts(prevShorts =>
//       prevShorts.map(short =>
//         short.id === shortId
//           ? {
//               ...short,
//               comment_count: Math.max(0, (short.comment_count || 0) - 1)
//             }
//           : short
//       )
//     );
    
//     setFilteredShorts(prevShorts =>
//       prevShorts.map(short =>
//         short.id === shortId
//           ? {
//               ...short,
//               comment_count: Math.max(0, (short.comment_count || 0) - 1)
//             }
//           : short
//       )
//     );
    
//     Alert.alert('Error', 'Failed to post comment. Please try again.');
//     throw error;
//   } finally {
//     setIsSubmittingComment(false);
//   }
// }, [selectedShort]);

//   const likeComment = useCallback(async (commentId, isLiked) => {
//     setLocalComments(prev => 
//       prev.map(comment => {
//         if (comment.id === commentId) {
//           return {
//             ...comment,
//             is_liked: !isLiked,
//             like_count: isLiked ? comment.like_count - 1 : comment.like_count + 1
//           };
//         }
//         if (comment.replies && comment.replies.length > 0) {
//           return {
//             ...comment,
//             replies: comment.replies.map(reply => 
//               reply.id === commentId 
//                 ? {
//                     ...reply,
//                     is_liked: !isLiked,
//                     like_count: isLiked ? reply.like_count - 1 : reply.like_count + 1
//                   }
//                 : reply
//             )
//           };
//         }
//         return comment;
//       })
//     );

//     try {
//       const headers = await getAuthHeader();
//       await axios.post(
//         `${API_URL}/shorts/comments/${commentId}/like/`,
//         {},
//         { headers }
//       );
//     } catch (error) {
//       console.error('Like Comment Error:', error);
//       setLocalComments(prev => 
//         prev.map(comment => {
//           if (comment.id === commentId) {
//             return {
//               ...comment,
//               is_liked: isLiked,
//               like_count: isLiked ? comment.like_count + 1 : comment.like_count - 1
//             };
//           }
//           if (comment.replies && comment.replies.length > 0) {
//             return {
//               ...comment,
//               replies: comment.replies.map(reply => 
//                 reply.id === commentId 
//                   ? {
//                       ...reply,
//                       is_liked: isLiked,
//                       like_count: isLiked ? reply.like_count + 1 : reply.like_count - 1
//                     }
//                   : reply
//               )
//             };
//           }
//           return comment;
//         })
//       );
//     }
//   }, []);

//   const deleteComment = useCallback(async (commentId) => {
//     Alert.alert(
//       'Delete Comment',
//       'Are you sure you want to delete this comment?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             setLocalComments(prev => prev.filter(c => c.id !== commentId));
//             setLocalComments(prev => 
//               prev.map(comment => ({
//                 ...comment,
//                 replies: comment.replies?.filter(r => r.id !== commentId) || []
//               }))
//             );

//             try {
//               const headers = await getAuthHeader();
//               await axios.delete(
//                 `${API_URL}/shorts/comments/${commentId}/delete/`,
//                 { headers }
//               );
              
//               setSnackbarMessage('Comment deleted');
//               setSnackbarVisible(true);
              
//             } catch (error) {
//               console.error('Delete Comment Error:', error);
//               Alert.alert('Error', 'Failed to delete comment');
//               if (selectedShort) {
//                 fetchComments(selectedShort.id, 1);
//               }
//             }
//           }
//         }
//       ]
//     );
//   }, [selectedShort]);

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
//     } catch (error) {
//       console.error('Like Error:', error);
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
//     setSelectedShort(short);
//     setLocalComments([]);
//     setCommentsPage(1);
//     setCommentsHasMore(true);
//     setReplyToComment(null);
//     setCommentText('');
//     setCommentModalVisible(true);
//     fetchComments(short.id, 1);
//   };

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
//     setSearchModalVisible(false);
//     setSearchQuery('');
    
//     const index = shorts.findIndex(s => s.id === item.id);
//     if (index !== -1 && flatListRef.current) {
//       if (isFlatListReady) {
//         try {
//           flatListRef.current.scrollToIndex({ 
//             index, 
//             animated: true,
//             viewPosition: 0.5
//           });
//         } catch (error) {
//           flatListRef.current.scrollToOffset({
//             offset: index * height,
//             animated: true
//           });
//         }
//       } else {
//         setTimeout(() => {
//           if (flatListRef.current) {
//             try {
//               flatListRef.current.scrollToIndex({ 
//                 index, 
//                 animated: true,
//                 viewPosition: 0.5
//               });
//             } catch (error) {
//               flatListRef.current.scrollToOffset({
//                 offset: index * height,
//                 animated: true
//               });
//             }
//           }
//         }, 300);
//       }
//     }
//   };

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
      
//       setCurrentIndex(newIndex);
      
//       setPausedVideos(prev => {
//         const newState = {};
//         filteredShorts.forEach((_, index) => {
//           newState[index] = index !== newIndex;
//         });
//         return newState;
//       });
      
//       if (videoRefs.current[newIndex]) {
//         setTimeout(() => {
//           videoRefs.current[newIndex]?.seek(0);
//         }, 100);
//       }
//     }
//   }).current;

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 90,
//   }).current;

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
//         <Video
//           ref={ref => videoRefs.current[index] = ref}
//           source={{ 
//             uri: getOptimizedVideoUrl(item.video),
//             headers: {
//               'Cache-Control': 'max-age=31536000, public',
//             }
//           }}
//           style={styles.video}
//           resizeMode="cover"
//           repeat={true}
//           paused={!isCurrent || isPaused}
//           onLoad={() => {
//             setVideoReady(prev => ({ ...prev, [item.id]: true }));
//             handleVideoLoad(item.id);
//           }}
//           onError={(error) => {
//             console.log(`Video ${item.id} error:`, error);
//             handleVideoError(item.id, error);
//           }}
//           bufferConfig={getBufferConfig(Platform.OS)}
//           poster={item.video_thumbnail}
//           posterResizeMode="cover"
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           preventsDisplaySleepDuringVideoPlayback={false}
//           progressUpdateInterval={250}
//           useTextureView={Platform.OS === 'android'}
//           preferredForwardBufferDuration={Platform.OS === 'ios' ? 1 : 2}
//         />

//         {!videoReady[item.id] && isCurrent && (
//           <Image 
//             source={{ uri: item.video_thumbnail }}
//             style={[styles.video, styles.thumbnail]}
//             resizeMode="cover"
//           />
//         )}

//         {isCurrent && !isBuffered && (
//           <View style={styles.bufferingOverlay}>
//             <ActivityIndicator size="large" color="#DC143C" />
//             <Text style={styles.bufferingText}>Buffering...</Text>
//           </View>
//         )}

//         {filteredShorts && filteredShorts[index + 1] && (
//           <VideoPreloader
//             uri={filteredShorts[index + 1]?.video}
//             isVisible={false}
//             onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
//             onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
//           />
//         )}

//         <View style={styles.overlay}>
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
//                 <Image
//                   source={
//                     item.user?.profile_picture
//                       ? { uri: getSecureUrl(item.user.profile_picture) }
//                       : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                   }
//                   style={styles.shortAvatar}
//                 />
//                 <Text style={styles.username}>
//                   @{item.user?.name?.slice(0,8) || 'user'}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             {/* <TouchableOpacity
//               onPress={() => retryVideo(index)}
//               style={styles.iconBtn}
//             >
//               <Ionicons name="refresh" size={30} color="#fff" />
//               <Text style={styles.countText}>Retry</Text>
//             </TouchableOpacity> */}
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

//   const CommentItem = memo(({ 
//     comment, 
//     onLike, 
//     onReply, 
//     onDelete,
//     onLoadReplies,
//     expanded,
//     onToggleExpand,
//     level = 0,
//     onReplyPress
//   }) => {
//     const [localLiked, setLocalLiked] = useState(comment.is_liked || false);
//     const [localLikeCount, setLocalLikeCount] = useState(comment.like_count || 0);
//     const [replies, setReplies] = useState(comment.replies || []);
//     const [loadingReplies, setLoadingReplies] = useState(false);

//     useEffect(() => {
//       setLocalLiked(comment.is_liked || false);
//       setLocalLikeCount(comment.like_count || 0);
//       setReplies(comment.replies || []);
//     }, [comment]);

//     const handleLike = async () => {
//       const newLiked = !localLiked;
//       const newCount = newLiked ? localLikeCount + 1 : localLikeCount - 1;
      
//       setLocalLiked(newLiked);
//       setLocalLikeCount(newCount);
      
//       await onLike(comment.id, comment.is_liked);
//     };

//     const handleLoadReplies = async () => {
//       setLoadingReplies(true);
//       const loadedReplies = await onLoadReplies(comment.id);
//       setReplies(loadedReplies);
//       setLoadingReplies(false);
//     };

//     const getUserDisplay = () => {
//       if (typeof comment.user === 'string') {
//         return {
//           name: comment.user.split('@')[0],
//           profile_picture: null
//         };
//       }
//       return {
//         name: comment.user?.name || comment.user?.username || 'User',
//         profile_picture: getSecureUrl(comment.user?.profile_picture)
//       };
//     };

//     const user = getUserDisplay();
//     const isOwnComment = comment.is_own || false;

//     return (
//       <View style={[
//         styles.commentContainer,
//         level > 0 && styles.replyContainer
//       ]}>
//         <View style={styles.commentHeader}>
//           <View style={styles.commentUserContainer}>
//             <Image
//               source={
//                 user.profile_picture
//                   ? { uri: user.profile_picture }
//                   : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//               }
//               style={styles.commentAvatar}
//             />
//             <View>
//               <Text style={styles.commentUser}>{user.name}</Text>
//               <Text style={styles.commentTime}>
//                 {new Date(comment.created_at).toLocaleDateString()}
//               </Text>
//             </View>
//           </View>
          
//           <View style={styles.commentActions}>
//             {isOwnComment && (
//               <TouchableOpacity
//                 onPress={() => onDelete(comment.id)}
//                 style={styles.commentActionBtn}
//               >
//                 <Ionicons name="trash-outline" size={18} color="#FF4444" />
//               </TouchableOpacity>
//             )}
            
//             <TouchableOpacity
//               onPress={handleLike}
//               style={styles.commentActionBtn}
//             >
//               <Ionicons
//                 name={localLiked ? 'heart' : 'heart-outline'}
//                 size={18}
//                 color={localLiked ? '#DC143C' : '#666'}
//               />
//               <Text style={styles.commentLikeCount}>{localLikeCount}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <Text style={styles.commentText}>{comment.text}</Text>

//         <View style={styles.commentFooter}>
//           <TouchableOpacity
//             onPress={() => onReplyPress(comment)}
//             style={styles.replyBtn}
//           >
//             <Text style={styles.replyBtnText}>Reply</Text>
//           </TouchableOpacity>

//           {comment.reply_count > 0 && !expanded && (
//             <TouchableOpacity
//               onPress={() => {
//                 onToggleExpand(comment.id);
//                 handleLoadReplies();
//               }}
//               style={styles.viewRepliesBtn}
//             >
//               <Text style={styles.viewRepliesText}>
//                 View {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {expanded && replies.length > 0 && (
//           <View style={styles.repliesList}>
//             {replies.map(reply => (
//               <CommentItem
//                 key={reply.id}
//                 comment={reply}
//                 onLike={onLike}
//                 onReply={onReply}
//                 onDelete={onDelete}
//                 onLoadReplies={onLoadReplies}
//                 expanded={false}
//                 onToggleExpand={() => {}}
//                 level={level + 1}
//                 onReplyPress={onReplyPress}
//               />
//             ))}
//             {loadingReplies && (
//               <ActivityIndicator size="small" color="#DC143C" style={styles.repliesLoader} />
//             )}
//           </View>
//         )}
//       </View>
//     );
//   });

//   return (
//     <SafeAreaView style={styles.container} edges={['right', 'left']}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
      
//       {renderNavBar()}
      
//       <FlatList
//         ref={flatListRef}
//         data={filteredShorts}
//         keyExtractor={(item) => `short-${item.id}`}
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
//         scrollEventThrottle={16}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         getItemLayout={getItemLayout}
//         onScrollToIndexFailed={(info) => {
//           const wait = new Promise(resolve => setTimeout(resolve, 500));
//           wait.then(() => {
//             if (flatListRef.current) {
//               flatListRef.current.scrollToIndex({ 
//                 index: info.index, 
//                 animated: true,
//                 viewPosition: 0.5
//               });
//             }
//           });
//         }}
//         onLayout={() => setIsFlatListReady(true)}
//         ListFooterComponent={
//           loadingShorts && filteredShorts.length > 0 ? (
//             <View style={styles.footerLoader}>
//               <ActivityIndicator size="large" color="#DC143C" />
//               <Text style={styles.footerText}>Loading more videos...</Text>
//             </View>
//           ) : null
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#DC143C']}
//             tintColor="#fff"
//           />
//         }
//         ListEmptyComponent={
//           <ImageBackground
//             source={require('../assets/images/original.jpg')}
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
//                   ? 'Follow creators to see their videos!'
//                   : loadingShorts ? 'Loading videos...' : 'No videos available'}
//               </Animated.Text>
//               {!loadingShorts && activeTab === 'forYou' && (
//                 <TouchableOpacity 
//                   style={styles.refreshButton}
//                   onPress={() => fetchShorts(1, true)}
//                 >
//                   <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </ImageBackground>
//         }
//       />

//       {/* Comments Modal */}
//       <Modal
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
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <KeyboardAvoidingView 
//             style={styles.modalOverlay}
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//           >
//             <View style={styles.commentModal}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   Comments ({selectedShort?.comment_count || 0})
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setCommentModalVisible(false);
//                     setReplyToComment(null);
//                     setCommentText('');
//                     setLocalComments([]);
//                   }}
//                   style={styles.modalCloseBtn}
//                 >
//                   <Ionicons name="close" size={28} color="#000" />
//                 </TouchableOpacity>
//               </View>

//               <FlatList
//                 ref={flatListRef}
//                 data={localComments}
//                 keyExtractor={(item) => `comment-${item.id}`}
//                 renderItem={({ item }) => (
//                   <CommentItem
//                     comment={item}
//                     onLike={likeComment}
//                     onReply={(parentId, text) => 
//                       postComment(selectedShort.id, text, parentId)
//                     }
//                     onDelete={deleteComment}
//                     onLoadReplies={fetchCommentReplies}
//                     expanded={expandedComments[item.id]}
//                     onToggleExpand={(id) => 
//                       setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }))
//                     }
//                     onReplyPress={handleReplyPress}
//                   />
//                 )}
//                 onEndReached={() => {
//                   if (commentsHasMore && selectedShort && !loadingComments) {
//                     fetchComments(selectedShort.id, commentsPage, true);
//                   }
//                 }}
//                 onEndReachedThreshold={0.5}
//                 ListFooterComponent={
//                   loadingComments && localComments.length > 0 ? (
//                     <View style={styles.commentsLoader}>
//                       <ActivityIndicator size="small" color="#DC143C" />
//                     </View>
//                   ) : null
//                 }
//                 ListEmptyComponent={
//                   <View style={styles.noCommentsContainer}>
//                     <Text style={styles.noCommentsText}>
//                       {loadingComments ? 'Loading comments...' : 'No comments yet'}
//                     </Text>
//                   </View>
//                 }
//                 contentContainerStyle={styles.commentsList}
//                 keyboardShouldPersistTaps="handled"
//               />

//               <View style={styles.commentInputWrapper}>
//                 {replyToComment && (
//                   <View style={styles.replyingToBar}>
//                     <Text style={styles.replyingToText}>
//                       Replying to @{replyToComment.user?.name || 'user'}
//                     </Text>
//                     <TouchableOpacity 
//                       onPress={() => {
//                         setReplyToComment(null);
//                         setCommentText('');
//                       }}
//                     >
//                       <Ionicons name="close" size={20} color="#666" />
//                     </TouchableOpacity>
//                   </View>
//                 )}
                
//                 <View style={styles.commentInputContainer}>
//                   <TextInput
//                     placeholder={replyToComment ? "Write a reply..." : "Add a comment..."}
//                     placeholderTextColor="#999"
//                     value={commentText}
//                     onChangeText={setCommentText}
//                     style={styles.commentInput}
//                     multiline
//                     editable={!isSubmittingComment}
//                     returnKeyType="default"
//                     blurOnSubmit={false}
//                   />
//                   <TouchableOpacity
//                     onPress={() => {
//                       if (commentText.trim() && selectedShort && !isSubmittingComment) {
//                         postComment(
//                           selectedShort.id, 
//                           commentText, 
//                           replyToComment?.id || null
//                         );
//                       }
//                     }}
//                     disabled={!commentText.trim() || isSubmittingComment}
//                     style={[
//                       styles.commentSendBtn,
//                       (!commentText.trim() || isSubmittingComment) && styles.commentSendBtnDisabled
//                     ]}
//                   >
//                     {isSubmittingComment ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <Ionicons name="send" size={24} color="#fff" />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </KeyboardAvoidingView>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Search Modal */}
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
//             <View style={[styles.searchInputContainer,{marginTop:30}]}>
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
//             data={filteredShorts}
//             keyExtractor={(item) => item.id.toString()}
//             numColumns={2}
//             renderItem={({ item }) => (
//               <SearchVideoThumbnail
//                 videoUrl={item.video}
//                 username={item.user?.name}
//                 caption={item.caption}
//                 onPress={() => handleSearchResultPress(item)}
//               />
//             )}
//             ListEmptyComponent={
//               <View style={styles.searchEmptyContainer}>
//                 <Icon name="search" size={50} color="#ccc" />
//                 <Text style={styles.searchEmptyText}>
//                   {searchQuery ? 'No videos found' : 'Search for videos or creators'}
//                 </Text>
//               </View>
//             }
//             contentContainerStyle={styles.searchResultsList}
//             showsVerticalScrollIndicator={false}
//           />
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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
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
    height: Platform.OS === 'ios' ? '85%' : '80%',
    maxHeight: Platform.OS === 'ios' ? '90%' : '85%',
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
  
  commentInputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
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
    alignItems: 'flex-end', 
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
    minHeight: 40,
    textAlignVertical: 'center', 
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
  sortDropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    right: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 160,
  },
  
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  
  sortOptionActive: {
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
  },
  
  sortOptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  sortOptionTextActive: {
    color: '#DC143C',
    fontWeight: '600',
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
  

  const [sortBy, setSortBy] = useState('trending'); // 'trending', 'latest', 'most_liked', 'most_commented'
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Animations
  const fadeAnimEmpty = useRef(new Animated.Value(0)).current;
  const scaleAnimEmpty = useRef(new Animated.Value(0.8)).current;


  useEffect(() => {
    if (isCommentModalVisible) {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          if (flatListRef.current && localComments.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }
      );

      return () => {
        keyboardDidShowListener.remove();
      };
    }
  }, [isCommentModalVisible, localComments.length]);

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
  if (!shorts || shorts.length === 0) {
    setFilteredShorts([]);
    return;
  }
  
  let filtered = [];
  
  if (activeTab === 'forYou') {
    // Sort based on current sortBy preference
    filtered = applySort([...shorts], sortBy);
  } else {
    // Filter by followed users then sort
    filtered = shorts.filter(short => followedUserIds.includes(short.user?.id));
    filtered = applySort(filtered, sortBy);
  }
  
  // Ensure we're not losing any videos
  setFilteredShorts(filtered);
  
  // Update video states for new filtered list
  if (filtered.length > 0) {
    const initialPausedState = {};
    filtered.forEach((_, index) => {
      initialPausedState[index] = index !== 0;
    });
    setPausedVideos(initialPausedState);
    
    // Reset current index if current video is filtered out
    const currentVideoStillExists = filtered.some(short => short.id === shorts[currentIndex]?.id);
    if (!currentVideoStillExists) {
      setCurrentIndex(0);
    }
  }
}, [activeTab, shorts, followedUserIds, sortBy]);

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
      
      // Update comment count in shorts and filteredShorts for new top-level comments
      setShorts(prevShorts =>
        prevShorts.map(short =>
          short.id === shortId
            ? {
                ...short,
                comment_count: (short.comment_count || 0) + 1
              }
            : short
        )
      );
      
      setFilteredShorts(prevShorts =>
        prevShorts.map(short =>
          short.id === shortId
            ? {
                ...short,
                comment_count: (short.comment_count || 0) + 1
              }
            : short
        )
      );
    }

    // Update selectedShort comment count
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
    
    // Revert optimistic updates
    setLocalComments(prev => 
      prev.filter(c => c.id !== Date.now())
    );
    
    // Revert comment count in shorts
    setShorts(prevShorts =>
      prevShorts.map(short =>
        short.id === shortId
          ? {
              ...short,
              comment_count: Math.max(0, (short.comment_count || 0) - 1)
            }
          : short
      )
    );
    
    setFilteredShorts(prevShorts =>
      prevShorts.map(short =>
        short.id === shortId
          ? {
              ...short,
              comment_count: Math.max(0, (short.comment_count || 0) - 1)
            }
          : short
      )
    );
    
    Alert.alert('Error', 'Failed to post comment. Please try again.');
    throw error;
  } finally {
    setIsSubmittingComment(false);
  }
}, [selectedShort]);

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
    // Find the target video in both arrays
    const targetInShorts = shorts.find(short => short.id === id);
    const targetInFiltered = filteredShorts.find(short => short.id === id);
    
    if (!targetInShorts) return;
    
    // Store current like status
    const wasLiked = targetInShorts.is_liked || false;
    const newLikeCount = wasLiked 
      ? targetInShorts.like_count - 1 
      : targetInShorts.like_count + 1;

    // Update shorts with complete object preservation
    const updatedShorts = shorts.map(short => 
      short.id === id 
        ? { 
            ...short, 
            is_liked: !wasLiked, 
            like_count: newLikeCount 
          } 
        : short
    );
    
    // Update filteredShorts based on current active tab
    let updatedFilteredShorts;
    
    if (activeTab === 'forYou') {
      // For 'forYou' tab, update the video in place
      updatedFilteredShorts = filteredShorts.map(short => 
        short.id === id 
          ? { 
              ...short, 
              is_liked: !wasLiked, 
              like_count: newLikeCount 
            } 
          : short
      );
    } else {
      // For 'following' tab, preserve the filtered list but update the video
      updatedFilteredShorts = filteredShorts.map(short => 
        short.id === id 
          ? { 
              ...short, 
              is_liked: !wasLiked, 
              like_count: newLikeCount 
            } 
          : short
      );
    }

    // Apply updates
    setShorts(updatedShorts);
    setFilteredShorts(updatedFilteredShorts);

    // Make API call
    const headers = await getAuthHeader();
    await axios.post(`${API_URL}/shorts/${id}/like/`, {}, { headers });

  } catch (error) {
    console.error('Like Error:', error);
    
    // Rollback on error - fetch fresh data
    await fetchShorts(1, true);
    
    // Show error message
    Alert.alert('Error', 'Failed to like video. Please try again.');
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
        onPress={() => setShowSortOptions(!showSortOptions)}
      >
        <Icon name="bar-chart-2" size={24} color="#fff" />
      </TouchableOpacity>
      
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

    {/* Sort Options Dropdown */}
    {showSortOptions && (
      <View style={styles.sortDropdown}>
        <TouchableOpacity 
          style={[styles.sortOption, sortBy === 'trending' && styles.sortOptionActive]}
          onPress={() => {
            setSortBy('trending');
            setShowSortOptions(false);
            sortVideos('trending');
          }}
        >
          <Icon name="trending-up" size={16} color={sortBy === 'trending' ? '#DC143C' : '#fff'} />
          <Text style={[styles.sortOptionText, sortBy === 'trending' && styles.sortOptionTextActive]}>Trending</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortOption, sortBy === 'most_liked' && styles.sortOptionActive]}
          onPress={() => {
            setSortBy('most_liked');
            setShowSortOptions(false);
            sortVideos('most_liked');
          }}
        >
          <Icon name="heart" size={16} color={sortBy === 'most_liked' ? '#DC143C' : '#fff'} />
          <Text style={[styles.sortOptionText, sortBy === 'most_liked' && styles.sortOptionTextActive]}>Most Liked</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortOption, sortBy === 'most_commented' && styles.sortOptionActive]}
          onPress={() => {
            setSortBy('most_commented');
            setShowSortOptions(false);
            sortVideos('most_commented');
          }}
        >
          <Icon name="message-circle" size={16} color={sortBy === 'most_commented' ? '#DC143C' : '#fff'} />
          <Text style={[styles.sortOptionText, sortBy === 'most_commented' && styles.sortOptionTextActive]}>Most Commented</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortOption, sortBy === 'latest' && styles.sortOptionActive]}
          onPress={() => {
            setSortBy('latest');
            setShowSortOptions(false);
            sortVideos('latest');
          }}
        >
          <Icon name="clock" size={16} color={sortBy === 'latest' ? '#DC143C' : '#fff'} />
          <Text style={[styles.sortOptionText, sortBy === 'latest' && styles.sortOptionTextActive]}>Latest</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

// Add sorting function
const sortVideos = (sortType) => {
  let sorted = [...shorts];
  
  switch(sortType) {
    case 'most_liked':
      sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      break;
      
    case 'most_commented':
      sorted.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
      break;
      
    case 'latest':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
      
    case 'trending':
    default:
      // Calculate trending score based on likes, comments, and recency
      sorted.sort((a, b) => {
        const scoreA = calculateTrendingScore(a);
        const scoreB = calculateTrendingScore(b);
        return scoreB - scoreA;
      });
      break;
  }
  
  setFilteredShorts(sorted);
  
  // Reset video states for new order
  const initialPausedState = {};
  sorted.forEach((_, index) => {
    initialPausedState[index] = index !== 0;
  });
  setPausedVideos(initialPausedState);
  setCurrentIndex(0);
  
  // Scroll to top
  if (flatListRef.current) {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  }
};

// Calculate trending score (likes * 0.4 + comments * 0.3 + recency * 0.3)
const calculateTrendingScore = (video) => {
  const likes = video.like_count || 0;
  const comments = video.comment_count || 0;
  
  // Calculate recency (newer videos get higher score)
  const createdAt = new Date(video.created_at || Date.now());
  const ageInHours = (Date.now() - createdAt) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 100 / (ageInHours + 1)); // Decay factor
  
  // Weighted score
  return (likes * 0.4) + (comments * 0.3) + (recencyScore * 0.3);
};

// Update the fetchShorts function to maintain sorting after fetch
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
        // Apply current sort to cached shorts
        sortVideos(sortBy);
        initializeVideoStates(cachedShorts);
      }
    }

    const headers = await getAuthHeader();
    const endpoint = `${API_URL}/shorts/`;
    
    // Add sorting parameters to API request
    const params = {
      page: pageNum,
      page_size: 5
    };
    
    // Add sort parameter based on current sort
    if (sortBy === 'most_liked') {
      params.ordering = '-like_count';
    } else if (sortBy === 'most_commented') {
      params.ordering = '-comment_count';
    } else if (sortBy === 'latest') {
      params.ordering = '-created_at';
    } else if (sortBy === 'trending') {
      params.ordering = '-hot_score'; // If your API supports trending score
    }
    
    const response = await axios.get(endpoint, { 
      headers,
      params
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
          // Ensure these fields exist
          like_count: short.like_count || 0,
          comment_count: short.comment_count || 0,
          created_at: short.created_at || new Date().toISOString(),
        };
      });

      if (isRefreshing || pageNum === 1) {
        setShorts(processedShorts);
        // Apply current sort to new shorts
        const sortedShorts = applySort(processedShorts, sortBy);
        setFilteredShorts(sortedShorts);
        initializeVideoStates(sortedShorts);
      } else {
        setShorts(prev => {
          const combined = [...(prev || []), ...processedShorts];
          // Remove duplicates by id
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          return unique;
        });
        
        setFilteredShorts(prev => {
          const combined = [...(prev || []), ...processedShorts];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          // Re-sort after adding new items
          return applySort(unique, sortBy);
        });
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
}, [activeTab, shortsPage, shortsHasMore, loadingShorts, sortBy]);

const applySort = (videos, sortType) => {
  if (!videos || videos.length === 0) return [];
  
  // Create a deep copy to avoid mutation issues
  const videosCopy = videos.map(video => ({ ...video }));
  
  try {
    switch(sortType) {
      case 'most_liked':
        return videosCopy.sort((a, b) => {
          const likeA = a.like_count || 0;
          const likeB = b.like_count || 0;
          return likeB - likeA;
        });
        
      case 'most_commented':
        return videosCopy.sort((a, b) => {
          const commentA = a.comment_count || 0;
          const commentB = b.comment_count || 0;
          return commentB - commentA;
        });
        
      case 'latest':
        return videosCopy.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        
      case 'trending':
      default:
        return videosCopy.sort((a, b) => {
          const scoreA = calculateTrendingScore(a);
          const scoreB = calculateTrendingScore(b);
          return scoreB - scoreA;
        });
    }
  } catch (error) {
    console.error('Error sorting videos:', error);
    return videosCopy; // Return unsorted if error occurs
  }
};

// Add this useEffect to monitor video counts (remove in production)
useEffect(() => {
  console.log('Shorts count:', shorts.length);
  console.log('Filtered count:', filteredShorts.length);
  
  // Check if any videos are missing
  if (shorts.length > 0 && filteredShorts.length > 0) {
    const missingInFiltered = shorts.filter(
      short => !filteredShorts.some(f => f.id === short.id)
    );
    
    if (missingInFiltered.length > 0) {
      console.log('Videos missing in filtered:', missingInFiltered.map(v => v.id));
    }
  }
}, [shorts, filteredShorts]);
  

  const renderItem = useCallback(({ item, index }) => {
    // const isCurrent = index === currentIndex;
    // const isPaused = pausedVideos[index] || false;
    // const isBuffered = bufferedVideos[item.id] || false;


 
 
  if (!item || !item.id) {
    console.log('Invalid item in renderItem:', item);
    return null;
  }
  
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
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
                ref={flatListRef}
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
                keyboardShouldPersistTaps="handled"
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
                    returnKeyType="default"
                    blurOnSubmit={false}
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
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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





  



  
