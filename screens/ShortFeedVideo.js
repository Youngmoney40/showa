

// import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   Image, 
//   Modal, 
//   TextInput, 
//   Alert, 
//   StyleSheet, 
//   Dimensions, 
//   Platform,
//   Pressable,
//   ActivityIndicator
// } from 'react-native';
// import Video from 'react-native-video';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Clipboard from '@react-native-clipboard/clipboard';
// import Icon from 'react-native-vector-icons/Feather';
// import IonicIcon from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../src/context/ThemeContext';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// const API_URL = API_ROUTE;
// const PLAYBACK_RATE = 1;

// // Cache keys
// const SHORTS_CACHE_KEY = 'shorts_row_cache_v2';
// const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// // Video Player Component - Optimized
// const VideoPlayer = memo(({ uri, isPlaying, onPress, style, navigation }) => {
//   const videoRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);
//     setHasError(false);
//   }, [uri]);

//   return (
//     <TouchableOpacity 
//       activeOpacity={0.9}
//       onPress={onPress}
//       style={[style, styles.videoPlayerContainer]}
//     >
//       <Video
//         ref={videoRef}
//         source={{ uri }}
//         style={StyleSheet.absoluteFillObject}
//         resizeMode="cover"
//         repeat={true}
//         muted={true}
//         paused={!isPlaying}
//         rate={PLAYBACK_RATE}
//         onLoadStart={() => setIsLoading(true)}
//         onLoad={() => setIsLoading(false)}
//         onError={() => {
//           setIsLoading(false);
//           setHasError(true);
//         }}
//         onReadyForDisplay={() => setIsLoading(false)}
//       />
      
//       {/* {isLoading && (
//         <View style={styles.videoLoading}>
//           <ActivityIndicator size="small" color="#fff" />
//         </View>
//       )} */}
      
//       {hasError && (
//         <View style={styles.videoError}>
//           <Icon name="alert-circle" size={24} color="#fff" />
//           <Text style={styles.errorText}>Video failed to load</Text>
//         </View>
//       )}
      
//       {!isPlaying && !isLoading && !hasError && (
//         <View style={styles.playOverlay}>
//           <View style={styles.playIconContainer}>
//             <MaterialIcon name="play-arrow" size={32} color="#fff" />
//           </View>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// });

// // Video Card Component - Memoized
// const VideoCard = memo(({ item, index, isPlaying, onPress, colors }) => {
//   const [isPressed, setIsPressed] = useState(false);
  
//   return (
//     <Pressable 
//       onPressIn={() => setIsPressed(true)}
//       onPressOut={() => setIsPressed(false)}
//       onPress={() => onPress(item)}
//       style={[
//         styles.videoCardContainer,
//         { 
//           backgroundColor: colors.card,
//           borderColor: colors.border,
//         },
//         isPressed && styles.cardPressed
//       ]}
//     >
//       <VideoPlayer
//         uri={item.video}
//         isPlaying={isPlaying}
//         onPress={() => onPress(item)}
//         style={styles.videoPlayer}
//       />
      
//       <View style={styles.minimalOverlay}>
//         <View style={styles.minimalInfo}>
//           <View style={styles.minimalStats}>
//             {isPlaying && (
//               <View style={[styles.playingIndicator, { backgroundColor: colors.primary }]}>
//                 <Text style={styles.playingText}>LIVE</Text>
//               </View>
//             )}
//           </View>
//         </View>
        
//         <View style={styles.tapToWatchOverlay}>
//           <Text style={styles.tapToWatchText}>Tap to watch</Text>
//         </View>
//       </View>
      
//       <TouchableOpacity 
//         style={[styles.expandButton, { backgroundColor: colors.card + 'CC' }]}
//         onPress={() => onPress(item)}
//       >
//         <Icon name="maximize-2" size={16} color={colors.text} />
//       </TouchableOpacity>
//     </Pressable>
//   );
// });

// // Main Component
// const HomePageShortsRow = () => {
//   const navigation = useNavigation();
//   const { colors, isDark } = useTheme();
//   const [shorts, setShorts] = useState([]);
//   const [selectedShort, setSelectedShort] = useState(null);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [isReplyModalVisible, setReplyModalVisible] = useState(false);
//   const [commentText, setCommentText] = useState('');
//   const [likedComments, setLikedComments] = useState({});
//   const [likedShorts, setLikedShorts] = useState({});
//   const [savedShorts, setSavedShorts] = useState({});
//   const [isMuted, setIsMuted] = useState(false);
//   const [playingVideoId, setPlayingVideoId] = useState(null);
//   const [viewableItems, setViewableItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
//   const scrollViewRef = useRef(null);
//   const modalVideoRef = useRef(null);
//   const isMountedRef = useRef(true);
//   const isFirstLoadRef = useRef(true);

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 50,
//     minimumViewTime: 500,
//   });

//   // ============================================================
//   // FIX IMAGE URL - MATCHES OTHER SCREENS
//   // ============================================================
//   const fixImageUrl = useCallback((url) => {
//     if (!url) return null;
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return url;
//     }
//     if (url.startsWith('/media/')) {
//       return `${API_ROUTE_IMAGE}${url}`;
//     }
//     return `${API_ROUTE_IMAGE}${url}`;
//   }, []);

//   // ============================================================
//   // LOAD FROM CACHE - INSTANT DISPLAY
//   // ============================================================
//   const loadFromCache = useCallback(async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(SHORTS_CACHE_KEY);
//       if (cachedData) {
//         const parsed = JSON.parse(cachedData);
//         const { data, timestamp } = parsed;
        
//         // Cache is valid for 5 minutes
//         const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//         if (isCacheValid && data && data.length > 0) {
//           console.log('📦 Loading shorts from cache:', data.length);
//           setShorts(data);
//           setIsLoading(false);
//           setInitialLoadComplete(true);
//           setHasLoadedOnce(true);
//           return true;
//         } else {
//           console.log('⏰ Cache expired, will fetch fresh data');
//         }
//       }
//     } catch (error) {
//       console.error('Error loading shorts from cache:', error);
//     }
//     return false;
//   }, []);

//   // ============================================================
//   // SAVE TO CACHE
//   // ============================================================
//   const saveToCache = useCallback(async (data) => {
//     try {
//       await AsyncStorage.setItem(
//         SHORTS_CACHE_KEY,
//         JSON.stringify({
//           data: data,
//           timestamp: Date.now()
//         })
//       );
//       console.log('💾 Shorts saved to cache:', data.length);
//     } catch (error) {
//       console.error('Error saving shorts to cache:', error);
//     }
//   }, []);

//   // ============================================================
//   // GET AUTH HEADER
//   // ============================================================
//   const getAuthHeader = useCallback(async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) throw new Error('No access token found');
//     return {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//   }, []);

//   // ============================================================
//   // FETCH SHORTS - OPTIMIZED
//   // ============================================================
//   const fetchShorts = useCallback(async (forceRefresh = false) => {
//     try {
//       // If we already have data and it's not a forced refresh, skip
//       if (hasLoadedOnce && !forceRefresh) {
//         console.log('⏭️ Skipping fetch - already loaded');
//         return true;
//       }

//       console.log('🌐 Fetching shorts from API...');
//       const headers = await getAuthHeader();
//       const response = await axios.get(`${API_URL}/shorts/?limit=5`, { 
//         headers,
//         timeout: 10000,
//       });

//       if (response.status === 200) {
//         let processedShorts = response.data.slice(0, 5);
//         processedShorts = processedShorts.sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));

//         // Fix image URLs in shorts data
//         processedShorts = processedShorts.map(short => ({
//           ...short,
//           user: {
//             ...short.user,
//             profile_picture: short.user?.profile_picture 
//               ? fixImageUrl(short.user.profile_picture) 
//               : null
//           }
//         }));

//         setShorts(processedShorts);
//         setHasLoadedOnce(true);
        
//         const likedState = {};
//         const savedState = {};
        
//         processedShorts.forEach((short) => {
//           likedState[short.id] = short.is_liked || false;
//           savedState[short.id] = short.is_saved || false;
//         });
        
//         setLikedShorts(likedState);
//         setSavedShorts(savedState);

//         // Save to cache
//         await saveToCache(processedShorts);
//         setIsLoading(false);
//         setInitialLoadComplete(true);

//         return true;
//       }
//     } catch (apiError) {
//       console.error('API Error:', apiError);
//     }
//     return false;
//   }, [getAuthHeader, fixImageUrl, saveToCache, hasLoadedOnce]);

//   // ============================================================
//   // LOAD DATA - CACHE FIRST, THEN NETWORK (ONLY ON FIRST LOAD)
//   // ============================================================
//   const loadData = useCallback(async (forceRefresh = false) => {
//     // If we already have data and it's not a forced refresh, skip
//     if (hasLoadedOnce && !forceRefresh) {
//       console.log('⏭️ Skipping load - already loaded');
//       return;
//     }

//     // Try cache first for instant display
//     const hasCache = await loadFromCache();
    
//     if (hasCache) {
//       // We have cache, but still fetch in background for fresh data
//       // This only happens on first load or if cache expired
//       fetchShorts(forceRefresh).catch(err => console.error('Background fetch error:', err));
//     } else {
//       // No cache, fetch from network
//       await fetchShorts(forceRefresh);
//     }
//   }, [loadFromCache, fetchShorts, hasLoadedOnce]);

//   // ============================================================
//   // VIEWABILITY TRACKING
//   // ============================================================
//   const onViewableItemsChanged = useCallback(({ viewableItems: items }) => {
//     if (items.length > 0) {
//       const centeredItem = items[0];
//       setPlayingVideoId(centeredItem.item.id);
//       setViewableItems(items.map(item => item.item.id));
//     } else {
//       setPlayingVideoId(null);
//       setViewableItems([]);
//     }
//   }, []);

//   const viewabilityConfigCallbackPairs = useRef([
//     { viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged }
//   ]);

//   // ============================================================
//   // OPEN MODAL
//   // ============================================================
//   const openModal = useCallback((short) => {
//     setSelectedShort({...short});
//     setModalVisible(true);
//     setIsMuted(false);
//   }, []);

//   // ============================================================
//   // CLOSE MODAL
//   // ============================================================
//   const closeModal = useCallback(() => {
//     setModalVisible(false);
//     setSelectedShort(null);
//   }, []);

//   // ============================================================
//   // TOGGLE MUTE
//   // ============================================================
//   const toggleModalMute = useCallback(() => {
//     setIsMuted(!isMuted);
//   }, [isMuted]);

//   // ============================================================
//   // LIKE SHORT
//   // ============================================================
//   const likeShort = useCallback(async (shortId) => {
//     try {
//       const headers = await getAuthHeader();
//       const isCurrentlyLiked = likedShorts[shortId];
      
//       setLikedShorts(prev => ({
//         ...prev,
//         [shortId]: !isCurrentlyLiked,
//       }));
      
//       if (!isCurrentlyLiked) {
//         await axios.post(`${API_URL}/shorts/${shortId}/like/`, {}, { headers });
//       } else {
//         await axios.post(`${API_URL}/shorts/${shortId}/unlike/`, {}, { headers });
//       }
      
//       setShorts(prev => prev.map(short => {
//         if (short.id === shortId) {
//           return {
//             ...short,
//             like_count: isCurrentlyLiked 
//               ? (short.like_count || 1) - 1 
//               : (short.like_count || 0) + 1
//           };
//         }
//         return short;
//       }));
      
//       if (selectedShort && selectedShort.id === shortId) {
//         setSelectedShort(prev => ({
//           ...prev,
//           like_count: isCurrentlyLiked 
//             ? (prev.like_count || 1) - 1 
//             : (prev.like_count || 0) + 1
//         }));
//       }
//     } catch (error) {
//       console.error('Like error:', error);
//       setLikedShorts(prev => ({
//         ...prev,
//         [shortId]: likedShorts[shortId],
//       }));
//     }
//   }, [getAuthHeader, likedShorts, selectedShort]);

//   // ============================================================
//   // SAVE SHORT
//   // ============================================================
//   const saveShort = useCallback(async (shortId) => {
//     try {
//       const headers = await getAuthHeader();
//       const isCurrentlySaved = savedShorts[shortId];
      
//       setSavedShorts(prev => ({
//         ...prev,
//         [shortId]: !isCurrentlySaved,
//       }));
      
//       if (!isCurrentlySaved) {
//         await axios.post(`${API_URL}/shorts/${shortId}/save/`, {}, { headers });
//       } else {
//         await axios.post(`${API_URL}/shorts/${shortId}/unsave/`, {}, { headers });
//       }
//     } catch (error) {
//       console.error('Save error:', error);
//       setSavedShorts(prev => ({
//         ...prev,
//         [shortId]: savedShorts[shortId],
//       }));
//     }
//   }, [getAuthHeader, savedShorts]);

//   // ============================================================
//   // SHARE SHORT
//   // ============================================================
//   const shareShort = useCallback(async (short) => {
//     try {
//       const shareUrl = `https://example.com/short/${short.id}`;
//       await Clipboard.setString(shareUrl);
//       Alert.alert('Success', 'Link copied to clipboard!');
//     } catch (error) {
//       console.error('Share error:', error);
//       Alert.alert('Error', 'Failed to copy link');
//     }
//   }, []);

//   // ============================================================
//   // POST COMMENT
//   // ============================================================
//   const postComment = useCallback(async () => {
//     if (!commentText.trim() || !selectedShort) return;
    
//     try {
//       const headers = await getAuthHeader();
//       const response = await axios.post(
//         `${API_URL}/shorts/${selectedShort.id}/comments/`,
//         { text: commentText },
//         { headers }
//       );
      
//       if (response.status === 201) {
//         setCommentText('');
//         setSelectedShort(prev => ({
//           ...prev,
//           comments: [...(prev.comments || []), response.data],
//           comment_count: (prev.comment_count || 0) + 1
//         }));
//       }
//     } catch (error) {
//       console.error('Post comment error:', error);
//       Alert.alert('Error', 'Failed to post comment');
//     }
//   }, [commentText, selectedShort, getAuthHeader]);

//   // ============================================================
//   // FORMAT VIEWS
//   // ============================================================
//   const formatViews = useCallback((views) => {
//     if (!views) return '0';
//     if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
//     if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
//     return views.toString();
//   }, []);

//   // ============================================================
//   // INITIAL LOAD - ONLY ONCE
//   // ============================================================
//   useEffect(() => {
//     console.log('🚀 Initial load - checking cache...');
//     loadData();
    
//     // Cleanup on unmount
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []); // Empty dependency array = ONLY RUNS ONCE

//   // ============================================================
//   // FOCUS EFFECT - ONLY FOR REFRESH IF NEEDED
//   // ============================================================
//   useFocusEffect(
//     useCallback(() => {
//       // Only refresh if the user explicitly wants to refresh
//       // We don't auto-refresh on focus to preserve cache
//       console.log('👁️ Screen focused - using cached data');
      
//       // Optional: Check if cache is expired and refresh in background
//       const checkCacheAndRefresh = async () => {
//         try {
//           const cachedData = await AsyncStorage.getItem(SHORTS_CACHE_KEY);
//           if (cachedData) {
//             const parsed = JSON.parse(cachedData);
//             const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
//             // If cache is expired, refresh in background
//             if (!isCacheValid) {
//               console.log('🔄 Cache expired, refreshing in background...');
//               await fetchShorts(true);
//             }
//           }
//         } catch (error) {
//           console.error('Error checking cache on focus:', error);
//         }
//       };
      
//       // Check cache in background without blocking UI
//       checkCacheAndRefresh();
      
//       return () => {
//         // Cleanup if needed
//       };
//     }, [fetchShorts])
//   );

//   // ============================================================
//   // RENDER MODAL
//   // ============================================================
//   const renderModal = useCallback(() => {
//     if (!selectedShort) return null;
    
//     const isLiked = likedShorts[selectedShort.id] || false;
//     const isSaved = savedShorts[selectedShort.id] || false;
//     const profilePic = selectedShort.user?.profile_picture || null;
//     const username = selectedShort.user?.username || 'user';

//     return (
//       <Modal
//         visible={isModalVisible}
//         animationType="fade"
//         onRequestClose={closeModal}
//         statusBarTranslucent={true}
//       >
//         <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
//           <View style={styles.modalHeader}>
//             <TouchableOpacity
//               onPress={closeModal}
//               style={[styles.modalHeaderButton, { backgroundColor: colors.card + 'CC' }]}
//             >
//               <Icon name="x" size={20} color={colors.text} />
//             </TouchableOpacity>
            
//             <Text style={[styles.modalTitle, { color: colors.text }]}>
//               E-Vibes Short
//             </Text>
            
//             <TouchableOpacity
//               style={[styles.watchMoreButton, { backgroundColor: colors.primary }]}
//               onPress={() => {
//                 closeModal();
//                 navigation.navigate('SocialHome');
//               }}
//             >
//               <Text style={styles.watchMoreText}>Watch More</Text>
//               <Icon name="play" size={16} color="#fff" />
//             </TouchableOpacity>
//           </View>
          
//           <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
//             <View style={styles.videoContainer}>
//               <Video
//                 ref={modalVideoRef}
//                 source={{ uri: selectedShort.video }}
//                 style={styles.video}
//                 resizeMode="contain"
//                 repeat={true}
//                 muted={isMuted}
//                 rate={PLAYBACK_RATE}
//                 paused={false}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   }, [selectedShort, isModalVisible, isMuted, likedShorts, savedShorts, colors, closeModal, navigation]);

//   // ============================================================
//   // RENDER COMMENTS MODAL
//   // ============================================================
//   const renderCommentsModal = useCallback(() => {
//     if (!selectedShort) return null;

//     return (
//       <Modal
//         visible={isReplyModalVisible}
//         animationType="slide"
//         onRequestClose={() => setReplyModalVisible(false)}
//       >
//         <View style={[styles.commentsContainer, { backgroundColor: colors.background }]}>
//           <View style={[styles.commentsHeader, { borderBottomColor: colors.border }]}>
//             <Text style={[styles.commentsTitle, { color: colors.text }]}>
//               {selectedShort.comment_count || 0} Comments
//             </Text>
//             <TouchableOpacity
//               onPress={() => {
//                 setReplyModalVisible(false);
//                 setCommentText('');
//               }}
//               style={[styles.commentsClose, { backgroundColor: colors.backgroundSecondary }]}
//             >
//               <Icon name="x" size={24} color={colors.text} />
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView style={styles.commentsList}>
//             {selectedShort.comments?.length > 0 ? (
//               selectedShort.comments.map(cmt => {
//                 const isLiked = likedComments[cmt.id] || false;
//                 const profilePic = cmt.user?.profile_picture || null;
//                 const username = cmt.user?.username || 'Unknown';
                
//                 return (
//                   <View 
//                     key={cmt.id} 
//                     style={[styles.commentItem, { 
//                       backgroundColor: colors.card,
//                       borderColor: colors.border 
//                     }]}
//                   >
//                     <View style={styles.commentHeader}>
//                       <View style={styles.commentUser}>
//                         {profilePic ? (
//                           <Image
//                             source={{ uri: profilePic }}
//                             style={styles.commentProfile}
//                           />
//                         ) : (
//                           <View style={[styles.commentProfilePlaceholder, { backgroundColor: colors.primary }]}>
//                             <Text style={styles.commentProfileText}>
//                               {username?.[0]?.toUpperCase() || 'U'}
//                             </Text>
//                           </View>
//                         )}
//                         <View>
//                           <Text style={[styles.commentUsername, { color: colors.text }]}>
//                             @{username}
//                           </Text>
//                           <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
//                             {new Date(cmt.created_at).toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>

//                     <Text style={[styles.commentText, { color: colors.text }]}>
//                       {cmt.text}
//                     </Text>
//                   </View>
//                 );
//               })
//             ) : (
//               <View style={styles.noComments}>
//                 <Icon name="message-circle" size={64} color={colors.border} />
//                 <Text style={[styles.noCommentsTitle, { color: colors.text }]}>
//                   No comments yet
//                 </Text>
//                 <Text style={[styles.noCommentsText, { color: colors.textSecondary }]}>
//                   Be the first to comment!
//                 </Text>
//               </View>
//             )}
//           </ScrollView>
          
//           <View style={[styles.commentInput, { borderTopColor: colors.border }]}>
//             <TextInput
//               style={[styles.input, { 
//                 backgroundColor: colors.backgroundSecondary,
//                 color: colors.text 
//               }]}
//               placeholder="Add a comment..."
//               value={commentText}
//               onChangeText={setCommentText}
//               onSubmitEditing={() => commentText.trim() && postComment()}
//               placeholderTextColor={colors.textSecondary}
//             />
//             <TouchableOpacity
//               onPress={postComment}
//               disabled={!commentText.trim()}
//               style={[
//                 styles.sendButton, 
//                 { backgroundColor: colors.primary },
//                 !commentText.trim() && { backgroundColor: colors.border }
//               ]}
//             >
//               <Icon name="send" size={20} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     );
//   }, [selectedShort, isReplyModalVisible, commentText, likedComments, colors, postComment]);

//   // ============================================================
//   // RENDER
//   // ============================================================
//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <View style={styles.titleSection}>
//         <View>
//           <Text style={[styles.mainTitle, { color: colors.text }]}>
//             E-Vibes for You
//           </Text>
//           <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
//             Trending short videos
//           </Text>
//         </View>

//         <TouchableOpacity 
//           onPress={() => navigation.navigate('SocialHome')}
//           style={[styles.viewAllButton, { backgroundColor: colors.primary + '20' }]}
//         >
//           <Text style={[styles.viewAllText, { color: colors.primary }]}>
//             View All
//           </Text>
//           <Icon name="chevron-right" size={16} color={colors.primary} />
//         </TouchableOpacity>
//       </View>
      
//       <ScrollView 
//         ref={scrollViewRef}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.row}
//         snapToInterval={width * 0.7 + 16}
//         decelerationRate="fast"
//         snapToAlignment="start"
//         viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
//         onScrollToIndexFailed={() => {}}
//       >
//         {shorts.length > 0 ? (
//           shorts.map((item, index) => (
//             <VideoCard 
//               key={item.id} 
//               item={item} 
//               index={index}
//               isPlaying={playingVideoId === item.id}
//               onPress={openModal}
//               colors={colors}
//             />
//           ))
//         ) : (
//           // Show placeholder cards while loading (no spinner)
//           [1, 2, 3].map(i => (
//             <View 
//               key={i} 
//               style={[
//                 styles.videoCardContainer, 
//                 { 
//                   backgroundColor: colors.backgroundSecondary,
//                   borderColor: colors.border,
//                 }
//               ]} 
//             />
//           ))
//         )}
//       </ScrollView>
      
//       {renderModal()}
//       {renderCommentsModal()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     paddingVertical: 24,
//   },
//   titleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     marginHorizontal: 8,
//   },
//   mainTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     opacity: 0.8,
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   viewAllText: {
//     fontWeight: '600',
//     fontSize: 14,
//   },
  
//   videoCardContainer: {
//     width: width * 0.7,
//     height: 300,
//     borderRadius: 16,
//     borderWidth: 1,
//     overflow: 'hidden',
//     marginHorizontal: 8,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   cardPressed: {
//     transform: [{ scale: 0.98 }],
//     shadowOpacity: 0.25,
//     shadowRadius: 16,
//     elevation: 12,
//   },

//   videoPlayerContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     overflow: 'hidden',
//   },
//   videoPlayer: {
//     flex: 1,
//   },
//   videoLoading: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoError: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: '#fff',
//     fontSize: 12,
//     marginTop: 8,
//   },
//   playOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playIconContainer: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
  
//   minimalOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'space-between',
//     padding: 12,
//   },
//   minimalInfo: {
//     alignItems: 'flex-start',
//   },
//   minimalStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   miniStatText: {
//     color: 'rgba(255,255,255,0.9)',
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   playingIndicator: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   playingText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
  
//   tapToWatchOverlay: {
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginBottom: 16,
//   },
//   tapToWatchText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
  
//   expandButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     borderRadius: 20,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
  
//   row: {
//     paddingBottom: 8,
//     paddingRight: 16,
//   },
  
//   modalContainer: {
//     flex: 1,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'ios' ? 60 : 40,
//     paddingBottom: 20,
//     backgroundColor: '#000',
//   },
//   modalHeaderButton: {
//     padding: 10,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   watchMoreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   watchMoreText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
  
//   modalContent: {
//     flex: 1,
//     flexDirection: Platform.OS === 'web' ? 'row' : 'column',
//   },
//   videoContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
  
//   // Comments modal styles
//   commentsContainer: {
//     flex: 1,
//   },
//   commentsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 20,
//     borderBottomWidth: 1,
//   },
//   commentsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   commentsClose: {
//     padding: 8,
//     borderRadius: 20,
//   },
//   commentsList: {
//     flex: 1,
//     padding: 20,
//   },
//   commentItem: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//   },
//   commentHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   commentUser: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   commentProfile: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 2,
//     resizeMode: 'cover',
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   commentProfilePlaceholder: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   commentProfileText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   commentUsername: {
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   commentTime: {
//     fontSize: 12,
//   },
//   commentText: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   noComments: {
//     alignItems: 'center',
//     paddingVertical: 64,
//   },
//   noCommentsTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginTop: 24,
//     marginBottom: 8,
//   },
//   noCommentsText: {
//     fontSize: 14,
//   },
//   commentInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     padding: 20,
//     borderTopWidth: 1,
//   },
//   input: {
//     flex: 1,
//     borderRadius: 25,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     fontSize: 14,
//   },
//   sendButton: {
//     borderRadius: 25,
//     padding: 14,
//   },
// });

// export default HomePageShortsRow;

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Dimensions, 
  Platform,
  Pressable,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Feather';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const API_URL = API_ROUTE;
const PLAYBACK_RATE = 1;

// Initialize MMKV storage
const storage = createMMKV({
  id: 'shorts-row-storage',
});

// Cache keys
const SHORTS_CACHE_KEY = 'shorts_row_cache_v2';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// Video Player Component - Optimized
const VideoPlayer = memo(({ uri, isPlaying, onPress, style, navigation }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [uri]);

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={[style, styles.videoPlayerContainer]}
    >
      <Video
        ref={videoRef}
        source={{ uri }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        repeat={true}
        muted={true}
        paused={!isPlaying}
        rate={PLAYBACK_RATE}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onReadyForDisplay={() => setIsLoading(false)}
      />
      
      {hasError && (
        <View style={styles.videoError}>
          <Icon name="alert-circle" size={24} color="#fff" />
          <Text style={styles.errorText}>Video failed to load</Text>
        </View>
      )}
      
      {!isPlaying && !isLoading && !hasError && (
        <View style={styles.playOverlay}>
          <View style={styles.playIconContainer}>
            <MaterialIcon name="play-arrow" size={32} color="#fff" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});

// Video Card Component - Memoized
const VideoCard = memo(({ item, index, isPlaying, onPress, colors }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <Pressable 
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => onPress(item)}
      style={[
        styles.videoCardContainer,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        isPressed && styles.cardPressed
      ]}
    >
      <VideoPlayer
        uri={item.video}
        isPlaying={isPlaying}
        onPress={() => onPress(item)}
        style={styles.videoPlayer}
      />
      
      <View style={styles.minimalOverlay}>
        <View style={styles.minimalInfo}>
          <View style={styles.minimalStats}>
            {isPlaying && (
              <View style={[styles.playingIndicator, { backgroundColor: colors.primary }]}>
                <Text style={styles.playingText}>LIVE</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.tapToWatchOverlay}>
          <Text style={styles.tapToWatchText}>Tap to watch</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.expandButton, { backgroundColor: colors.card + 'CC' }]}
        onPress={() => onPress(item)}
      >
        <Icon name="maximize-2" size={16} color={colors.text} />
      </TouchableOpacity>
    </Pressable>
  );
});

// ============================================================
// MMKV CACHE FUNCTIONS
// ============================================================

const saveToMMKV = (key, data) => {
  try {
    console.log(`💾 Saving ${key} to MMKV cache...`);
    storage.set(key, JSON.stringify({
      data: data,
      timestamp: Date.now()
    }));
    console.log(`✅ ${key} saved to MMKV cache`);
  } catch (error) {
    console.error(`❌ Error saving ${key} to MMKV:`, error);
  }
};

const getFromMMKV = (key) => {
  try {
    const cached = storage.getString(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      const { data, timestamp } = parsed;
      const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
      
      if (isCacheValid && data && data.length > 0) {
        console.log(`✅ ${key} loaded from MMKV cache (${data.length} items)`);
        return data;
      } else {
        console.log(`⏰ ${key} cache expired`);
      }
    }
    console.log(`📭 ${key} not found in MMKV cache`);
    return null;
  } catch (error) {
    console.error(`❌ Error getting ${key} from MMKV:`, error);
    return null;
  }
};

const clearMMKVCache = () => {
  try {
    console.log('🗑️ Clearing shorts row MMKV cache...');
    storage.delete(SHORTS_CACHE_KEY);
    console.log('✅ Shorts row MMKV cache cleared');
  } catch (error) {
    console.error('❌ Error clearing MMKV cache:', error);
  }
};

// Main Component
const HomePageShortsRow = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [shorts, setShorts] = useState([]);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReplyModalVisible, setReplyModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState({});
  const [likedShorts, setLikedShorts] = useState({});
  const [savedShorts, setSavedShorts] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [viewableItems, setViewableItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  const scrollViewRef = useRef(null);
  const modalVideoRef = useRef(null);
  const isMountedRef = useRef(true);
  const isFirstLoadRef = useRef(true);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 500,
  });

  // ============================================================
  // FIX IMAGE URL - MATCHES OTHER SCREENS
  // ============================================================
  const fixImageUrl = useCallback((url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/media/')) {
      return `${API_ROUTE_IMAGE}${url}`;
    }
    return `${API_ROUTE_IMAGE}${url}`;
  }, []);

  // ============================================================
  // LOAD FROM CACHE - MMKV (INSTANT)
  // ============================================================
  const loadFromCache = useCallback(() => {
    try {
      const data = getFromMMKV(SHORTS_CACHE_KEY);
      if (data && data.length > 0) {
        console.log('📦 Loading shorts from MMKV cache:', data.length);
        setShorts(data);
        setIsLoading(false);
        setInitialLoadComplete(true);
        setHasLoadedOnce(true);
        return true;
      }
    } catch (error) {
      console.error('❌ Error loading shorts from MMKV cache:', error);
    }
    return false;
  }, []);

  // ============================================================
  // GET AUTH HEADER
  // ============================================================
  const getAuthHeader = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, []);

  // ============================================================
  // FETCH SHORTS - OPTIMIZED
  // ============================================================
  const fetchShorts = useCallback(async (forceRefresh = false) => {
    try {
      // If we already have data and it's not a forced refresh, skip
      if (hasLoadedOnce && !forceRefresh) {
        console.log('⏭️ Skipping fetch - already loaded');
        return true;
      }

      console.log('🌐 Fetching shorts from API...');
      const headers = await getAuthHeader();
      const response = await axios.get(`${API_URL}/shorts/?limit=5`, { 
        headers,
        timeout: 10000,
      });

      if (response.status === 200) {
        let processedShorts = response.data.slice(0, 5);
        processedShorts = processedShorts.sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));

        // Fix image URLs in shorts data
        processedShorts = processedShorts.map(short => ({
          ...short,
          user: {
            ...short.user,
            profile_picture: short.user?.profile_picture 
              ? fixImageUrl(short.user.profile_picture) 
              : null
          }
        }));

        setShorts(processedShorts);
        setHasLoadedOnce(true);
        
        const likedState = {};
        const savedState = {};
        
        processedShorts.forEach((short) => {
          likedState[short.id] = short.is_liked || false;
          savedState[short.id] = short.is_saved || false;
        });
        
        setLikedShorts(likedState);
        setSavedShorts(savedState);

        // Save to MMKV cache
        saveToMMKV(SHORTS_CACHE_KEY, processedShorts);
        console.log(`✅ Saved ${processedShorts.length} shorts to MMKV cache`);
        
        setIsLoading(false);
        setInitialLoadComplete(true);

        return true;
      }
    } catch (apiError) {
      console.error('❌ API Error:', apiError);
    }
    return false;
  }, [getAuthHeader, fixImageUrl, hasLoadedOnce]);

  // ============================================================
  // LOAD DATA - CACHE FIRST, THEN NETWORK
  // ============================================================
  const loadData = useCallback(async (forceRefresh = false) => {
    // If we already have data and it's not a forced refresh, skip
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping load - already loaded');
      return;
    }

    // Try MMKV cache first for instant display
    const hasCache = loadFromCache();
    
    if (hasCache) {
      console.log('📂 Cache loaded, fetching fresh data in background...');
      // We have cache, but still fetch in background for fresh data
      fetchShorts(forceRefresh).catch(err => console.error('Background fetch error:', err));
    } else {
      // No cache, fetch from network
      console.log('📭 No cache, fetching from API...');
      await fetchShorts(forceRefresh);
    }
  }, [loadFromCache, fetchShorts, hasLoadedOnce]);

  // ============================================================
  // VIEWABILITY TRACKING
  // ============================================================
  const onViewableItemsChanged = useCallback(({ viewableItems: items }) => {
    if (items.length > 0) {
      const centeredItem = items[0];
      setPlayingVideoId(centeredItem.item.id);
      setViewableItems(items.map(item => item.item.id));
    } else {
      setPlayingVideoId(null);
      setViewableItems([]);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged }
  ]);

  // ============================================================
  // OPEN MODAL
  // ============================================================
  const openModal = useCallback((short) => {
    setSelectedShort({...short});
    setModalVisible(true);
    setIsMuted(false);
  }, []);

  // ============================================================
  // CLOSE MODAL
  // ============================================================
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedShort(null);
  }, []);

  // ============================================================
  // TOGGLE MUTE
  // ============================================================
  const toggleModalMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  // ============================================================
  // LIKE SHORT
  // ============================================================
  const likeShort = useCallback(async (shortId) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyLiked = likedShorts[shortId];
      
      setLikedShorts(prev => ({
        ...prev,
        [shortId]: !isCurrentlyLiked,
      }));
      
      if (!isCurrentlyLiked) {
        await axios.post(`${API_URL}/shorts/${shortId}/like/`, {}, { headers });
      } else {
        await axios.post(`${API_URL}/shorts/${shortId}/unlike/`, {}, { headers });
      }
      
      setShorts(prev => prev.map(short => {
        if (short.id === shortId) {
          return {
            ...short,
            like_count: isCurrentlyLiked 
              ? (short.like_count || 1) - 1 
              : (short.like_count || 0) + 1
          };
        }
        return short;
      }));
      
      if (selectedShort && selectedShort.id === shortId) {
        setSelectedShort(prev => ({
          ...prev,
          like_count: isCurrentlyLiked 
            ? (prev.like_count || 1) - 1 
            : (prev.like_count || 0) + 1
        }));
      }
    } catch (error) {
      console.error('❌ Like error:', error);
      setLikedShorts(prev => ({
        ...prev,
        [shortId]: likedShorts[shortId],
      }));
    }
  }, [getAuthHeader, likedShorts, selectedShort]);

  // ============================================================
  // SAVE SHORT
  // ============================================================
  const saveShort = useCallback(async (shortId) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlySaved = savedShorts[shortId];
      
      setSavedShorts(prev => ({
        ...prev,
        [shortId]: !isCurrentlySaved,
      }));
      
      if (!isCurrentlySaved) {
        await axios.post(`${API_URL}/shorts/${shortId}/save/`, {}, { headers });
      } else {
        await axios.post(`${API_URL}/shorts/${shortId}/unsave/`, {}, { headers });
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      setSavedShorts(prev => ({
        ...prev,
        [shortId]: savedShorts[shortId],
      }));
    }
  }, [getAuthHeader, savedShorts]);

  // ============================================================
  // SHARE SHORT
  // ============================================================
  const shareShort = useCallback(async (short) => {
    try {
      const shareUrl = `https://example.com/short/${short.id}`;
      await Clipboard.setString(shareUrl);
      Alert.alert('Success', 'Link copied to clipboard!');
    } catch (error) {
      console.error('❌ Share error:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
  }, []);

  // ============================================================
  // POST COMMENT
  // ============================================================
  const postComment = useCallback(async () => {
    if (!commentText.trim() || !selectedShort) return;
    
    try {
      const headers = await getAuthHeader();
      const response = await axios.post(
        `${API_URL}/shorts/${selectedShort.id}/comments/`,
        { text: commentText },
        { headers }
      );
      
      if (response.status === 201) {
        setCommentText('');
        setSelectedShort(prev => ({
          ...prev,
          comments: [...(prev.comments || []), response.data],
          comment_count: (prev.comment_count || 0) + 1
        }));
      }
    } catch (error) {
      console.error('❌ Post comment error:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  }, [commentText, selectedShort, getAuthHeader]);

  // ============================================================
  // FORMAT VIEWS
  // ============================================================
  const formatViews = useCallback((views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  }, []);

  // ============================================================
  // INITIAL LOAD - ONLY ONCE
  // ============================================================
  useEffect(() => {
    console.log('🚀 Initial load - checking MMKV cache...');
    loadData();
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array = ONLY RUNS ONCE

  // ============================================================
  // FOCUS EFFECT - ONLY FOR REFRESH IF NEEDED
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      console.log('👁️ Screen focused - using cached data');
      
      // Check cache expiry in background
      const checkCacheAndRefresh = () => {
        try {
          const cached = storage.getString(SHORTS_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
            // If cache is expired, refresh in background
            if (!isCacheValid) {
              console.log('🔄 Cache expired, refreshing in background...');
              fetchShorts(true);
            } else {
              console.log('✅ Cache still valid');
            }
          }
        } catch (error) {
          console.error('❌ Error checking cache on focus:', error);
        }
      };
      
      // Check cache in background without blocking UI
      checkCacheAndRefresh();
      
      return () => {
        // Cleanup if needed
      };
    }, [fetchShorts])
  );

  // ============================================================
  // RENDER MODAL
  // ============================================================
  const renderModal = useCallback(() => {
    if (!selectedShort) return null;
    
    const isLiked = likedShorts[selectedShort.id] || false;
    const isSaved = savedShorts[selectedShort.id] || false;
    const profilePic = selectedShort.user?.profile_picture || null;
    const username = selectedShort.user?.username || 'user';

    return (
      <Modal
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeModal}
              style={[styles.modalHeaderButton, { backgroundColor: colors.card + 'CC' }]}
            >
              <Icon name="x" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              E-Vibes Short
            </Text>
            
            <TouchableOpacity
              style={[styles.watchMoreButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                closeModal();
                navigation.navigate('SocialHome');
              }}
            >
              <Text style={styles.watchMoreText}>Watch More</Text>
              <Icon name="play" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.videoContainer}>
              <Video
                ref={modalVideoRef}
                source={{ uri: selectedShort.video }}
                style={styles.video}
                resizeMode="contain"
                repeat={true}
                muted={isMuted}
                rate={PLAYBACK_RATE}
                paused={false}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }, [selectedShort, isModalVisible, isMuted, likedShorts, savedShorts, colors, closeModal, navigation]);

  // ============================================================
  // RENDER COMMENTS MODAL
  // ============================================================
  const renderCommentsModal = useCallback(() => {
    if (!selectedShort) return null;

    return (
      <Modal
        visible={isReplyModalVisible}
        animationType="slide"
        onRequestClose={() => setReplyModalVisible(false)}
      >
        <View style={[styles.commentsContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.commentsHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.commentsTitle, { color: colors.text }]}>
              {selectedShort.comment_count || 0} Comments
            </Text>
            <TouchableOpacity
              onPress={() => {
                setReplyModalVisible(false);
                setCommentText('');
              }}
              style={[styles.commentsClose, { backgroundColor: colors.backgroundSecondary }]}
            >
              <Icon name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.commentsList}>
            {selectedShort.comments?.length > 0 ? (
              selectedShort.comments.map(cmt => {
                const isLiked = likedComments[cmt.id] || false;
                const profilePic = cmt.user?.profile_picture || null;
                const username = cmt.user?.username || 'Unknown';
                
                return (
                  <View 
                    key={cmt.id} 
                    style={[styles.commentItem, { 
                      backgroundColor: colors.card,
                      borderColor: colors.border 
                    }]}
                  >
                    <View style={styles.commentHeader}>
                      <View style={styles.commentUser}>
                        {profilePic ? (
                          <Image
                            source={{ uri: profilePic }}
                            style={styles.commentProfile}
                          />
                        ) : (
                          <View style={[styles.commentProfilePlaceholder, { backgroundColor: colors.primary }]}>
                            <Text style={styles.commentProfileText}>
                              {username?.[0]?.toUpperCase() || 'U'}
                            </Text>
                          </View>
                        )}
                        <View>
                          <Text style={[styles.commentUsername, { color: colors.text }]}>
                            @{username}
                          </Text>
                          <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
                            {new Date(cmt.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={[styles.commentText, { color: colors.text }]}>
                      {cmt.text}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.noComments}>
                <Icon name="message-circle" size={64} color={colors.border} />
                <Text style={[styles.noCommentsTitle, { color: colors.text }]}>
                  No comments yet
                </Text>
                <Text style={[styles.noCommentsText, { color: colors.textSecondary }]}>
                  Be the first to comment!
                </Text>
              </View>
            )}
          </ScrollView>
          
          <View style={[styles.commentInput, { borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text 
              }]}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={() => commentText.trim() && postComment()}
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              onPress={postComment}
              disabled={!commentText.trim()}
              style={[
                styles.sendButton, 
                { backgroundColor: colors.primary },
                !commentText.trim() && { backgroundColor: colors.border }
              ]}
            >
              <Icon name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }, [selectedShort, isReplyModalVisible, commentText, likedComments, colors, postComment]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleSection}>
        <View>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            E-Vibes for You
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Trending short videos
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('SocialHome')}
          style={[styles.viewAllButton, { backgroundColor: colors.primary + '20' }]}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All
          </Text>
          <Icon name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        snapToInterval={width * 0.7 + 16}
        decelerationRate="fast"
        snapToAlignment="start"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onScrollToIndexFailed={() => {}}
      >
        {shorts.length > 0 ? (
          shorts.map((item, index) => (
            <VideoCard 
              key={item.id} 
              item={item} 
              index={index}
              isPlaying={playingVideoId === item.id}
              onPress={openModal}
              colors={colors}
            />
          ))
        ) : (
          // Show placeholder cards while loading (no spinner)
          [1, 2, 3].map(i => (
            <View 
              key={i} 
              style={[
                styles.videoCardContainer, 
                { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                }
              ]} 
            />
          ))
        )}
      </ScrollView>
      
      {renderModal()}
      {renderCommentsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 8,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontWeight: '600',
    fontSize: 14,
  },
  
  videoCardContainer: {
    width: width * 0.7,
    height: 300,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  videoPlayer: {
    flex: 1,
  },
  videoLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoError: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  minimalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 12,
  },
  minimalInfo: {
    alignItems: 'flex-start',
  },
  minimalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniStatText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  playingIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  playingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  tapToWatchOverlay: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  tapToWatchText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  expandButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  row: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  modalHeaderButton: {
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  watchMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  watchMoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  modalContent: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  
  // Comments modal styles
  commentsContainer: {
    flex: 1,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  commentsClose: {
    padding: 8,
    borderRadius: 20,
  },
  commentsList: {
    flex: 1,
    padding: 20,
  },
  commentItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentProfile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    resizeMode: 'cover',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  commentProfilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentProfileText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentUsername: {
    fontWeight: '600',
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  noCommentsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  noCommentsText: {
    fontSize: 14,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
  },
  sendButton: {
    borderRadius: 25,
    padding: 14,
  },
});

export default HomePageShortsRow;