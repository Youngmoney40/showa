

// import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   StatusBar,
//   Modal,
//   Animated,
//   Dimensions,
//   Pressable,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   ScrollView,
//   Share,
//   PanResponder
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import Video from 'react-native-video';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { height, width } = Dimensions.get('window');

// // Video Player Component for thumbnails
// const VideoThumbnailPlayer = ({ uri, isPlaying, onPress, style, caption }) => {
//   const videoRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);

//   useEffect(() => {
//     setIsLoading(true);
//     setHasError(false);
//   }, [uri]);

//   const handleProgress = (data) => {
//     setCurrentTime(data.currentTime);
//   };

//   const handleLoad = (data) => {
//     setDuration(data.duration);
//     setIsLoading(false);
//   };

//   const formatTime = (seconds) => {
//     if (!seconds) return '0:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

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
//         repeat={false}
//         muted={true}
//         paused={!isPlaying}
//         onLoad={handleLoad}
//         onProgress={handleProgress}
//         onError={() => {
//           setIsLoading(false);
//           setHasError(true);
//         }}
//       />
      
//       {isLoading && (
//         <View style={styles.videoLoading}>
//           <ActivityIndicator size="small" color="#fff" />
//         </View>
//       )}
      
//       {hasError && (
//         <View style={styles.videoError}>
//           <FeatherIcon name="alert-circle" size={24} color="#fff" />
//           <Text style={styles.errorText}>Failed to load</Text>
//         </View>
//       )}
      
//       {/* Play Overlay */}
//       {!isPlaying && !isLoading && !hasError && (
//         <View style={styles.playOverlay}>
//           <View style={styles.playIconContainer}>
//             <MaterialIcon name="play-arrow" size={28} color="#fff" />
//           </View>
//         </View>
//       )}
      
//       {/* Progress Bar - Only show when playing */}
//       {isPlaying && !isLoading && !hasError && duration > 0 && (
//         <View style={styles.videoProgressOverlay}>
//           <View style={styles.videoProgressBar}>
//             <View 
//               style={[
//                 styles.videoProgressFill, 
//                 { width: `${(currentTime / duration) * 100}%` }
//               ]} 
//             />
//           </View>
//           <Text style={styles.videoTimeText}>
//             {formatTime(currentTime)} / {formatTime(duration)}
//           </Text>
//         </View>
//       )}
      
//       {/* Video Badge */}
//       <View style={styles.videoBadge}>
//         <MaterialIcon name="videocam" size={10} color="white" />
//         <Text style={styles.badgeText}>VIDEO</Text>
//       </View>
      
//       {/* Duration Badge (when not playing) */}
//       {!isPlaying && duration > 0 && (
//         <View style={styles.durationBadgeVideo}>
//           <MaterialIcon name="access-time" size={10} color="white" />
//           <Text style={styles.badgeText}>{formatTime(duration)}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// // Video Card Component
// const VideoCard = memo(({ item, onPress, onOptionsPress, isPlaying, onPlayPress, colors }) => {
//   const [isPressed, setIsPressed] = useState(false);
//   const videoUrl = item.video;
  
//   const formatNumber = (num) => {
//     if (!num) return '0';
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Recently';
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <Pressable 
//       onPressIn={() => setIsPressed(true)}
//       onPressOut={() => setIsPressed(false)}
//       onPress={() => onPress(item)}
//       style={[
//         styles.videoCard,
//         { 
//           backgroundColor: colors.card,
//           borderColor: colors.border,
//         },
//         isPressed && styles.cardPressed
//       ]}
//     >
//       {/* Video Thumbnail with Player */}
//       <View style={styles.videoThumbnailWrapper}>
//         <VideoThumbnailPlayer
//           uri={videoUrl}
//           isPlaying={isPlaying}
//           onPress={() => onPlayPress(item)}
//           style={styles.videoThumbnail}
//           caption={item.caption}
//         />
        
//         {/* Views Count Overlay */}
//         <View style={styles.viewsOverlay}>
//           <Ionicons name="eye" size={12} color="#fff" />
//           <Text style={styles.viewsText}>{formatNumber(item.view_count || 0)} views</Text>
//         </View>
//       </View>

//       {/* Video Info */}
//       <View style={styles.videoInfo}>
//         <View style={styles.videoHeader}>
//           <View style={styles.videoTitleContainer}>
//             <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={1}>
//               {item.caption || item.title || 'Untitled Video'}
//             </Text>
//           </View>
//           <TouchableOpacity 
//             onPress={() => onOptionsPress(item)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
//           </TouchableOpacity>
//         </View>

//         {/* Video Description */}
//         {item.description && (
//           <Text style={[styles.videoDescription, { color: colors.textSecondary }]} numberOfLines={2}>
//             {item.description}
//           </Text>
//         )}

//         {/* Engagement Stats */}
//         <View style={styles.engagementStats}>
//           <View style={styles.statGroup}>
//             <View style={styles.statItem}>
//               <Ionicons name="heart" size={14} color="#ff6b6b" />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {formatNumber(item.like_count || item.likes || 0)}
//               </Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Ionicons name="chatbubble" size={14} color={colors.primary} />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {formatNumber(item.comment_count || 0)}
//               </Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Ionicons name="share-social" size={14} color="#4ecdc4" />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {formatNumber(item.share_count || 0)}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.dateContainer}>
//             <MaterialIcon name="access-time" size={12} color={colors.textSecondary} />
//             <Text style={[styles.dateText, { color: colors.textSecondary }]}>
//               {formatDate(item.created_at)}
//             </Text>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={[styles.videoActions, { borderTopColor: colors.border }]}>
//           <TouchableOpacity 
//             style={[styles.actionButton, { backgroundColor: colors.primary + '10' }]}
//             onPress={() => onPlayPress(item)}
//           >
//             <MaterialIcon name="play-arrow" size={18} color={colors.primary} />
//             <Text style={[styles.actionText, { color: colors.primary }]}>Play</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
//             onPress={() => shareVideo(item)}
//           >
//             <FeatherIcon name="share-2" size={16} color={colors.textSecondary} />
//             <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Pressable>
//   );
// });

// // Share function
// const shareVideo = async (video) => {
//   try {
//     await Share.share({
//       message: `Check out this video: ${video.caption || video.title || 'My video'}`,
//       title: 'Share Video'
//     });
//   } catch (error) {
//     console.error('Error sharing video:', error);
//   }
// };

// const ManagePostsScreen = () => {
//   const { colors, isDark } = useTheme(); 
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState('tweets');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [playingVideoId, setPlayingVideoId] = useState(null);
  
//   // Image viewer states
//   const [imageViewerVisible, setImageViewerVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageViewerItem, setImageViewerItem] = useState(null);
//   const [showImageDetails, setShowImageDetails] = useState(true);
  
//   // Video player states
//   const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [videoLoading, setVideoLoading] = useState(false);
//   const [videoError, setVideoError] = useState(false);
//   const [showVideoControls, setShowVideoControls] = useState(true);
//   const [videoProgress, setVideoProgress] = useState(0);
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [isMuted, setIsMuted] = useState(false);
  
//   const slideAnim = useRef(new Animated.Value(height)).current;
//   const videoRef = useRef(null);
//   const controlsTimeout = useRef(null);
//   const abortControllerRef = useRef(null);
//   const isMounted = useRef(true);
//   const imageScale = useRef(new Animated.Value(1)).current;
//   const imagePan = useRef(new Animated.ValueXY()).current;

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//       if (controlsTimeout.current) {
//         clearTimeout(controlsTimeout.current);
//       }
//     };
//   }, []);

//   // Auto-hide video controls
//   useEffect(() => {
//     if (showVideoControls && !videoLoading && !videoError) {
//       if (controlsTimeout.current) {
//         clearTimeout(controlsTimeout.current);
//       }
//       controlsTimeout.current = setTimeout(() => {
//         setShowVideoControls(false);
//       }, 3000);
//     }
//     return () => {
//       if (controlsTimeout.current) {
//         clearTimeout(controlsTimeout.current);
//       }
//     };
//   }, [showVideoControls, videoLoading, videoError]);

//   const getSecureUrl = (url) => {
//     if (!url) return null;
//     if (url.startsWith('http://')) {
//       url = url.replace('http://', 'https://');
//     }
//     return url;
//   };

//   // Open image viewer
//   const openImageViewer = (item, imageUrl) => {
//     setSelectedImage(imageUrl);
//     setImageViewerItem(item);
//     setImageViewerVisible(true);
//     setShowImageDetails(true);
//     imageScale.setValue(1);
//     imagePan.setValue({ x: 0, y: 0 });
//   };

//   // Close image viewer
//   const closeImageViewer = () => {
//     setImageViewerVisible(false);
//     setSelectedImage(null);
//     setImageViewerItem(null);
//   };

//   // Toggle image details
//   const toggleImageDetails = () => {
//     setShowImageDetails(!showImageDetails);
//   };

//   // Handle video play in grid
//   const handleVideoPlay = (video) => {
//     if (playingVideoId === video.id) {
//       setPlayingVideoId(null);
//     } else {
//       setPlayingVideoId(video.id);
//     }
//   };

//   // Open fullscreen video player
//   const openFullscreenVideo = (video) => {
//     setCurrentVideo(video);
//     setVideoPlayerVisible(true);
//     setIsPlaying(true);
//     setVideoLoading(true);
//     setVideoError(false);
//     setShowVideoControls(true);
//     setVideoProgress(0);
//     setPlayingVideoId(null); // Stop grid playback
//   };

//   // Close video player modal
//   const closeVideoPlayer = () => {
//     setVideoPlayerVisible(false);
//     setIsPlaying(false);
//     setCurrentVideo(null);
//     setVideoError(false);
//     setVideoLoading(false);
    
//     if (videoRef.current) {
//       videoRef.current.seek(0);
//     }
//   };

//   // Format time for video progress
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const fetchMarketplace = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-listings/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         setMarketplacePosts(res.data || []);
//       }
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Error fetching marketplace posts:', error);
//         if (isMounted.current) {
//           setMarketplacePosts([]);
//         }
//       }
//     }
//   }, []);

//   const fetchTweets = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-posts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         setTweets(res.data || []);
//       }
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Error fetching tweets:', error);
//         if (isMounted.current) {
//           setTweets([]);
//         }
//       }
//     }
//   }, []);

//   const fetchVideos = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         console.log('Fetched videos:', res.data);
//         setUserVideos(res.data || []);
//       }
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Error fetching videos:', error);
//         if (isMounted.current) {
//           setUserVideos([]);
//         }
//       }
//     }
//   }, []);

//   // Fetch all data
//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         await Promise.all([
//           fetchMarketplace(),
//           fetchTweets(),
//           fetchVideos()
//         ]);
//       } catch (error) {
//         console.error('Error fetching all data:', error);
//       } finally {
//         if (isMounted.current) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchAllData();
//   }, [fetchMarketplace, fetchTweets, fetchVideos]);

//   // Refresh data when screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       const refreshData = async () => {
//         try {
//           await fetchMarketplace();
//           await fetchTweets();
//           await fetchVideos();
//         } catch (error) {
//           console.error('Error refreshing data:', error);
//         }
//       };
      
//       refreshData();
      
//       return () => {
//         if (abortControllerRef.current) {
//           abortControllerRef.current.abort();
//         }
//       };
//     }, [fetchMarketplace, fetchTweets, fetchVideos])
//   );

//   const confirmDelete = (type, id) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this item?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => handleDelete(type, id),
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const handleDelete = async (type, id) => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       let endpoint = '';
//       if (type === 'marketplace') {
//         endpoint = `${API_ROUTE}/my-listings/${id}/`;
//       } else if (type === 'tweets') {
//         endpoint = `${API_ROUTE}/my-posts/${id}/`;
//       } else {
//         endpoint = `${API_ROUTE}/my-shorts/${id}/`;
//       }

//       await axios.delete(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Refresh the appropriate list
//       if (type === 'marketplace') {
//         await fetchMarketplace();
//       } else if (type === 'tweets') {
//         await fetchTweets();
//       } else {
//         await fetchVideos();
//       }
      
//       Alert.alert("Success", "Item deleted successfully");
//     } catch (error) {
//       Alert.alert("Error", "Failed to delete item");
//       console.error('Delete error:', error);
//     }
//     toggleModal();
//   };

//   const toggleModal = (item = null) => {
//     setSelectedItem(item);
//     if (item) {
//       setModalVisible(true);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: height,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setModalVisible(false));
//     }
//   };

//   const renderEmptyState = () => (
//     <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
//       <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
//       <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//         You haven't posted anything yet. Create your first post and start sharing!
//       </Text>
//     </View>
//   );

//   const currentData = () => {
//     switch(selectedTab) {
//       case 'marketplace': return marketplacePosts;
//       case 'tweets': return tweets;
//       case 'videos': return userVideos;
//       default: return [];
//     }
//   };

//   const renderMarketplacePost = ({ item }) => {
//     const imageUrl = getSecureUrl(item.images?.[0]?.image);
    
//     return (
//       <View style={[styles.card, { 
//         backgroundColor: colors.card,
//         borderColor: colors.border,
//       }]}>
//         <TouchableOpacity 
//           activeOpacity={0.9}
//           onPress={() => openImageViewer(item, imageUrl)}
//           disabled={!imageUrl}
//         >
//           {imageUrl ? (
//             <Image 
//               source={{ uri: imageUrl }} 
//               style={styles.postImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
//               <Ionicons name="image-outline" size={50} color={colors.textSecondary} />
//             </View>
//           )}
//         </TouchableOpacity>
//         <View style={styles.postContent}>
//           <View style={styles.postHeader}>
//             <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
//             <TouchableOpacity 
//               onPress={() => toggleModal(item)}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           </View>
//           <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>₦{item.price}</Text>
//           <Text style={[styles.postDate, { color: colors.textSecondary }]}>
//             {new Date(item.created).toLocaleDateString()}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderTweet = ({ item }) => {
//     const imageUrl = getSecureUrl(item.image_url);
    
//     return (
//       <View style={[styles.card, { 
//         backgroundColor: colors.card,
//         borderColor: colors.border,
//       }]}>
//         <TouchableOpacity 
//           activeOpacity={0.9}
//           onPress={() => openImageViewer(item, imageUrl)}
//           disabled={!imageUrl}
//         >
//           {imageUrl ? (
//             <Image 
//               source={{ uri: imageUrl }} 
//               style={styles.postImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
//               <Ionicons name="chatbubble-outline" size={50} color={colors.textSecondary} />
//             </View>
//           )}
//         </TouchableOpacity>
//         <View style={styles.postContent}>
//           <View style={styles.postHeader}>
//             <Text style={[styles.postText, { color: colors.text }]} numberOfLines={3}>{item.content}</Text>
//             <TouchableOpacity 
//               onPress={() => toggleModal(item)}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.postStats}>
//             <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.reactions?.length || 0} reactions</Text>
//             <Text style={[styles.postDate, { color: colors.textSecondary }]}>
//               {new Date(item.created_at).toLocaleDateString()}
//             </Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const renderVideo = ({ item }) => {
//     return (
//       <VideoCard
//         item={item}
//         onPress={openFullscreenVideo}
//         onOptionsPress={toggleModal}
//         onPlayPress={handleVideoPlay}
//         isPlaying={playingVideoId === item.id}
//         colors={colors}
//       />
//     );
//   };

//   // Image Viewer Modal Component
//   // const ImageViewerModal = () => (
//   //   <Modal
//   //     visible={imageViewerVisible}
//   //     transparent={true}
//   //     animationType="fade"
//   //     onRequestClose={closeImageViewer}
//   //   >
//   //     <View style={styles.imageViewerOverlay}>
//   //       <StatusBar hidden />
        
//   //       {/* Close button */}
//   //       <TouchableOpacity
//   //         style={styles.imageViewerCloseButton}
//   //         onPress={closeImageViewer}
//   //       >
//   //         <Ionicons name="close" size={30} color="#fff" />
//   //       </TouchableOpacity>
        
//   //       {/* Toggle details button */}
//   //       <TouchableOpacity
//   //         style={styles.imageViewerInfoButton}
//   //         onPress={toggleImageDetails}
//   //       >
//   //         <Ionicons name="information-circle-outline" size={30} color="#fff" />
//   //       </TouchableOpacity>
        
//   //       {/* Image with scroll view for zoom */}
//   //       <ScrollView
//   //         maximumZoomScale={3}
//   //         minimumZoomScale={1}
//   //         showsHorizontalScrollIndicator={false}
//   //         showsVerticalScrollIndicator={false}
//   //         contentContainerStyle={styles.imageViewerScrollContent}
//   //       >
//   //         <Image
//   //           source={{ uri: selectedImage }}
//   //           style={styles.imageViewerImage}
//   //           resizeMode="contain"
//   //         />
//   //       </ScrollView>
        
//   //       {/* Post details overlay */}
//   //       {showImageDetails && imageViewerItem && (
//   //         <Animated.View 
//   //           style={[
//   //             styles.imageViewerDetails,
//   //             {
//   //               backgroundColor: 'rgba(0,0,0,0.7)',
//   //             }
//   //           ]}
//   //         >
//   //           {/* <View style={styles.imageViewerDetailsHeader}>
//   //             <View style={styles.imageViewerUserInfo}>
//   //               <View style={[styles.imageViewerAvatar, { backgroundColor: colors.primary }]}>
//   //                 <Text style={styles.imageViewerAvatarText}>
//   //                   {imageViewerItem.user?.username?.[0]?.toUpperCase() || 'U'}
//   //                 </Text>
//   //               </View>
//   //               <View>
//   //                 <Text style={styles.imageViewerUsername}>
//   //                   {imageViewerItem.user?.username || 'User'}
//   //                 </Text>
//   //                 <Text style={styles.imageViewerTimestamp}>
//   //                   {new Date(imageViewerItem.created || imageViewerItem.created_at).toLocaleDateString()}
//   //                 </Text>
//   //               </View>
//   //             </View>
//   //           </View> */}
            
//   //           <View style={styles.imageViewerContent}>
//   //             {selectedTab === 'marketplace' && (
//   //               <>
//   //                 <Text style={styles.imageViewerTitle}>{imageViewerItem.title}</Text>
//   //                 <Text style={styles.imageViewerPrice}>₦{imageViewerItem.price}</Text>
//   //                 {imageViewerItem.description && (
//   //                   <Text style={styles.imageViewerDescription}>{imageViewerItem.description}</Text>
//   //                 )}
//   //               </>
//   //             )}
              
//   //             {selectedTab === 'tweets' && (
//   //               <Text style={styles.imageViewerTweetContent}>{imageViewerItem.content}</Text>
//   //             )}
//   //           </View>
            
//   //           {/* <View style={styles.imageViewerStats}>
//   //             <View style={styles.imageViewerStat}>
//   //               <Ionicons name="heart-outline" size={20} color="#fff" />
//   //               <Text style={styles.imageViewerStatText}>
//   //                 {imageViewerItem.reactions?.length || imageViewerItem.likes || 0}
//   //               </Text>
//   //             </View>
//   //             <View style={styles.imageViewerStat}>
//   //               <Ionicons name="chatbubble-outline" size={20} color="#fff" />
//   //               <Text style={styles.imageViewerStatText}>
//   //                 {imageViewerItem.comments?.length || imageViewerItem.comment_count || 0}
//   //               </Text>
//   //             </View>
//   //           </View> */}
//   //         </Animated.View>
//   //       )}
//   //     </View>
//   //   </Modal>
//   // );


//   const ImageViewerModal = () => {
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         // Only set pan responder when swiping vertically
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 0;
//       },
//       onPanResponderGrant: () => {
//         // When gesture starts
//         imagePan.y.extractOffset();
//       },
//       onPanResponderMove: (_, gestureState) => {
//         // Only allow downward swipe
//         if (gestureState.dy > 0) {
//           imagePan.y.setValue(gestureState.dy);
          
//           // Fade background based on swipe distance
//           const opacity = 1 - Math.min(gestureState.dy / 300, 0.5);
//           imageScale.setValue(opacity);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         // If swiped down more than 100px, close
//         if (gestureState.dy > 100) {
//           Animated.timing(imagePan.y, {
//             toValue: height,
//             duration: 200,
//             useNativeDriver: true,
//           }).start(() => {
//             closeImageViewer();
//             imagePan.y.setValue(0);
//             imageScale.setValue(1);
//           });
//         } else {
//           // Otherwise snap back
//           Animated.parallel([
//             Animated.spring(imagePan.y, {
//               toValue: 0,
//               useNativeDriver: true,
//             }),
//             Animated.spring(imageScale, {
//               toValue: 1,
//               useNativeDriver: true,
//             }),
//           ]).start();
//         }
//       },
//     })
//   ).current;

//   if (!selectedImage) return null;

//   return (
//     <Modal
//       visible={imageViewerVisible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={closeImageViewer}
//       statusBarTranslucent={true}
//     >
//       <StatusBar hidden />
      
//       {/* Background overlay with fade effect */}
//       <Animated.View 
//         style={[
//           styles.imageViewerBackground,
//           { opacity: imageScale }
//         ]} 
//       />
      
//       {/* Main content with swipe gesture */}
//       <Animated.View 
//         style={[
//           styles.imageViewerContainer,
//           { transform: [{ translateY: imagePan.y }] }
//         ]}
//         {...panResponder.panHandlers}
//       >
//         {/* Close button - top right */}
//         <TouchableOpacity
//           style={styles.imageViewerCloseButton}
//           onPress={closeImageViewer}
//           activeOpacity={0.7}
//           hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
//         >
//           <View style={styles.imageViewerCloseButtonInner}>
//             <Ionicons name="close" size={24} color="#fff" />
//           </View>
//         </TouchableOpacity>
        
//         {/* Share button - top left (optional) */}
        
        
//         {/* Swipe indicator - shows that you can swipe down */}
//         <View style={styles.swipeIndicator}>
//           <View style={styles.swipeIndicatorBar} />
//         </View>
        
//         {/* Image with zoom support */}
//         <ScrollView
//           maximumZoomScale={3}
//           minimumZoomScale={1}
//           showsHorizontalScrollIndicator={false}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.imageViewerScrollContent}
//           bounces={false}
//           scrollEnabled={true}
//         >
//           <Image
//             source={{ uri: selectedImage }}
//             style={styles.imageViewerImage}
//             resizeMode="contain"
//           />
//         </ScrollView>
        
//         {/* Subtle image counter at bottom */}
//         <View style={styles.imageCounterContainer}>
//           <Text style={styles.imageCounterText}>
//             {selectedTab === 'marketplace' ? '📷 Listing Image' : '📷 Post Image'}
//           </Text>
//         </View>
        
//         {/* Swipe down hint (appears briefly then fades) */}
//         <Animated.View 
//           style={[
//             styles.swipeHint,
//             { opacity: imageScale.interpolate({
//                 inputRange: [0.5, 1],
//                 outputRange: [0, 1]
//               })
//             }
//           ]}
//         >
//           <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
//           <Text style={styles.swipeHintText}>Swipe down to close</Text>
//         </Animated.View>
//       </Animated.View>
//     </Modal>
//   );
// };
//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
//       {/* Header */}
//       <View style={[styles.header, { 
//         backgroundColor: colors.card,
//         borderBottomColor: colors.border 
//       }]}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           {/* <Ionicons name="arrow-back" size={24} color={colors.text} /> */}
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Posts</Text>
//         <View style={styles.headerRight} />
//       </View>

//       {/* Tab Bar */}
//      {/* Tab Bar */}
// <View style={[styles.tabContainer, { 
//   backgroundColor: colors.card,
//   borderBottomColor: colors.border 
// }]}>
//   <TouchableOpacity 
//     onPress={() => setSelectedTab('tweets')} 
//     style={[
//       styles.tab, 
//       { backgroundColor: 'transparent' },
//       selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
//     ]}
//     activeOpacity={0.7}
//   >
//     <Text style={[
//       styles.tabText, 
//       { color: colors.primary },
//       selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
//     ]}>
//       Posts
//     </Text>
//   </TouchableOpacity>

//   <TouchableOpacity 
//     onPress={() => setSelectedTab('marketplace')} 
//     style={[
//       styles.tab, 
//       { backgroundColor: 'transparent' },
//       selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
//     ]}
//     activeOpacity={0.7}
//   >
//     <Text style={[
//       styles.tabText, 
//       { color: colors.primary },
//       selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
//     ]}>
//       Listings
//     </Text>
//   </TouchableOpacity>
  
//   <TouchableOpacity 
//     onPress={() => setSelectedTab('videos')} 
//     style={[
//       styles.tab, 
//       { backgroundColor: 'transparent' },
//       selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
//     ]}
//     activeOpacity={0.7}
//   >
//     <Text style={[
//       styles.tabText, 
//       { color: colors.primary },
//       selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
//     ]}>
//       Shorts
//     </Text>
//   </TouchableOpacity>
// </View>

//       {loading ? (
//         <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
//           <ActivityIndicator size="large" color={colors.primary} />
//           <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your posts...</Text>
//         </View>
//       ) : currentData().length === 0 ? (
//         renderEmptyState()
//       ) : (
//         <FlatList
//           data={currentData()}
//           renderItem={
//             selectedTab === 'marketplace' 
//               ? renderMarketplacePost
//               : selectedTab === 'tweets'
//               ? renderTweet
//               : renderVideo
//           }
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           initialNumToRender={5}
//           maxToRenderPerBatch={10}
//           windowSize={10}
//         />
//       )}

//       {/* Image Viewer Modal */}
//       <ImageViewerModal />

//       {/* Fullscreen Video Player Modal */}
//       <Modal
//         visible={videoPlayerVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeVideoPlayer}
//         presentationStyle="fullScreen"
//       >
//         <View style={styles.fullscreenVideoOverlay}>
//           <StatusBar hidden />
          
//           <TouchableOpacity
//             activeOpacity={1}
//             onPress={() => setShowVideoControls(!showVideoControls)}
//             style={styles.fullscreenVideoContent}
//           >
//             {/* Close button */}
//             {showVideoControls && (
//               <TouchableOpacity
//                 style={styles.fullscreenCloseButton}
//                 onPress={closeVideoPlayer}
//               >
//                 <Ionicons name="close" size={30} color="#fff" />
//               </TouchableOpacity>
//             )}

//             {/* Video Player */}
//             {currentVideo && (
//               <View style={styles.fullscreenVideoWrapper}>
//                 {videoLoading && !videoError && (
//                   <View style={styles.fullscreenLoadingOverlay}>
//                     <ActivityIndicator size="large" color={colors.primary} />
//                     <Text style={styles.loadingText}>Loading video...</Text>
//                   </View>
//                 )}
                
//                 {videoError ? (
//                   <View style={styles.fullscreenErrorOverlay}>
//                     <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
//                     <Text style={styles.errorTitle}>Failed to load video</Text>
//                     <TouchableOpacity 
//                       style={[styles.retryButton, { backgroundColor: colors.primary }]}
//                       onPress={() => {
//                         setVideoError(false);
//                         setVideoLoading(true);
//                       }}
//                     >
//                       <Text style={styles.retryButtonText}>Retry</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <Video
//                     ref={videoRef}
//                     source={{ uri: currentVideo.video }}
//                     style={styles.fullscreenVideoPlayer}
//                     resizeMode="contain"
//                     paused={!isPlaying}
//                     repeat={false}
//                     controls={false}
//                     muted={isMuted}
//                     volume={1.0}
//                     onLoad={(data) => {
//                       setVideoLoading(false);
//                       setVideoError(false);
//                       setVideoDuration(data.duration);
//                     }}
//                     onLoadStart={() => {
//                       setVideoLoading(true);
//                       setVideoError(false);
//                     }}
//                     onError={(error) => {
//                       setVideoLoading(false);
//                       setVideoError(true);
//                     }}
//                     onProgress={(data) => {
//                       setVideoProgress(data.currentTime);
//                     }}
//                     onEnd={() => {
//                       setIsPlaying(false);
//                       if (videoRef.current) {
//                         videoRef.current.seek(0);
//                       }
//                     }}
//                   />
//                 )}
                
//                 {/* Video Controls */}
//                 {showVideoControls && !videoLoading && !videoError && (
//                   <>
//                     {/* Video Info */}
//                     <View style={styles.fullscreenVideoInfo}>
//                       <Text style={styles.fullscreenVideoTitle}>
//                         {currentVideo.caption || currentVideo.title || 'Video'}
//                       </Text>
//                       <View style={styles.fullscreenVideoStats}>
//                         <View style={styles.fullscreenStat}>
//                           <Ionicons name="heart" size={16} color="#fff" />
//                           <Text style={styles.fullscreenStatText}>
//                             {currentVideo.like_count || currentVideo.likes || 0}
//                           </Text>
//                         </View>
//                         <View style={styles.fullscreenStat}>
//                           <Ionicons name="chatbubble" size={16} color="#fff" />
//                           <Text style={styles.fullscreenStatText}>
//                             {currentVideo.comment_count || 0}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>

//                     {/* Progress Bar */}
//                     <View style={styles.fullscreenProgressContainer}>
//                       <View style={styles.fullscreenProgressBar}>
//                         <View 
//                           style={[
//                             styles.fullscreenProgressFill,
//                             { width: `${(videoProgress / videoDuration) * 100}%` }
//                           ]} 
//                         />
//                       </View>
//                       <View style={styles.fullscreenTimeContainer}>
//                         <Text style={styles.fullscreenTimeText}>{formatTime(videoProgress)}</Text>
//                         <Text style={styles.fullscreenTimeText}>{formatTime(videoDuration)}</Text>
//                       </View>
//                     </View>

//                     {/* Play/Pause and Mute buttons */}
//                     <View style={styles.fullscreenControlsRow}>
//                       <TouchableOpacity
//                         style={styles.fullscreenControlButton}
//                         onPress={() => setIsPlaying(!isPlaying)}
//                       >
//                         <Ionicons 
//                           name={isPlaying ? 'pause' : 'play'} 
//                           size={50} 
//                           color="#fff" 
//                         />
//                       </TouchableOpacity>
                      
//                       <TouchableOpacity
//                         style={styles.fullscreenControlButton}
//                         onPress={() => setIsMuted(!isMuted)}
//                       >
//                         <Ionicons 
//                           name={isMuted ? 'volume-mute' : 'volume-high'} 
//                           size={30} 
//                           color="#fff" 
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 )}
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       {/* Bottom Sheet Modal for Delete */}
//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => toggleModal()}
//         animationType="none"
//       >
//         <View style={styles.modalOverlay}>
//           <Pressable 
//             style={styles.modalBackdrop} 
//             onPress={() => toggleModal()}
//           />
          
//           <Animated.View 
//             style={[
//               styles.modalContainer,
//               { 
//                 backgroundColor: colors.card,
//                 transform: [{ translateY: slideAnim }] 
//               }
//             ]}
//           >
//             <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
//             <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
            
//             <TouchableOpacity 
//               style={[styles.modalOption, { borderBottomColor: colors.border }]}
//               onPress={() => {
//                 if (selectedItem) {
//                   confirmDelete(selectedTab, selectedItem.id);
//                 }
//               }}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="trash-outline" size={24} color="#e74c3c" />
//               <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.modalOption, { borderBottomColor: colors.border }]}
//               onPress={() => toggleModal()}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="close-circle-outline" size={24} color={colors.primary} />
//               <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderBottomWidth: 1,
//     elevation: 2,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   headerRight: {
//     width: 24,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     elevation: 2,
//   },
//   tab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },
//   activeTab: {
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   tabText: {
//     marginLeft: 8,
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 32,
//   },
  
//   // Video Card Styles
//   videoCard: {
//     borderRadius: 16,
//     borderWidth: 1,
//     overflow: 'hidden',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   cardPressed: {
//     transform: [{ scale: 0.98 }],
//     shadowOpacity: 0.25,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   videoThumbnailWrapper: {
//     position: 'relative',
//     width: '100%',
//     height: 220,
//   },
//   videoThumbnail: {
//     flex: 1,
//   },
//   videoPlayerContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     overflow: 'hidden',
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
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   videoProgressOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 12,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   videoProgressBar: {
//     height: 3,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 1.5,
//     overflow: 'hidden',
//     marginBottom: 4,
//   },
//   videoProgressFill: {
//     height: '100%',
//     backgroundColor: '#fff',
//   },
//   videoTimeText: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 10,
//     textAlign: 'center',
//   },
//   videoBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   durationBadgeVideo: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   viewsOverlay: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   imageViewerBackground: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#000',
//   },
//   imageViewerContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   imageViewerCloseButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     right: 20,
//     zIndex: 20,
//   },
//   imageViewerCloseButtonInner: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   imageViewerShareButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     left: 20,
//     zIndex: 20,
//   },
//   imageViewerShareButtonInner: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   swipeIndicator: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 10 : 5,
//     alignSelf: 'center',
//     zIndex: 15,
//   },
//   swipeIndicatorBar: {
//     width: 40,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 2,
//   },
//   imageViewerScrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingVertical: 20,
//   },
//   imageViewerImage: {
//     width: width,
//     height: height - 100, // Leave space for controls
//   },
//   imageCounterContainer: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//     zIndex: 10,
//   },
//   imageCounterText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   swipeHint: {
//     position: 'absolute',
//     bottom: 80,
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     zIndex: 10,
//   },
//   swipeHintText: {
//     color: 'rgba(255,255,255,0.5)',
//     fontSize: 12,
//     marginLeft: 4,
//   },

//   viewsText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   videoInfo: {
//     padding: 16,
//   },
//   videoHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   videoTitleContainer: {
//     flex: 1,
//     marginRight: 12,
//   },
//   videoTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   videoDescription: {
//     fontSize: 13,
//     lineHeight: 18,
//     marginBottom: 12,
//   },
//   engagementStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   statGroup: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   statText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   dateText: {
//     fontSize: 11,
//   },
//   videoActions: {
//     flexDirection: 'row',
//     gap: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   actionText: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
  
//   card: {
//     borderRadius: 12,
//     marginBottom: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//   },
//   placeholderContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   postContent: {
//     padding: 16,
//   },
//   postHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   postTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     flex: 1,
//     marginRight: 12,
//   },
//   postText: {
//     fontSize: 15,
//     flex: 1,
//     marginRight: 12,
//     lineHeight: 22,
//   },
//   postPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   postStats: {
//     flexDirection: 'row',
//     marginTop: 8,
//     flexWrap: 'wrap',
//   },
//   postStat: {
//     fontSize: 13,
//     marginRight: 16,
//   },
//   postDate: {
//     fontSize: 12,
//   },
  
//   // Image Viewer Styles
//   imageViewerOverlay: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   imageViewerCloseButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     right: 20,
//     zIndex: 10,
//     padding: 10,
//   },
//   imageViewerInfoButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     left: 20,
//     zIndex: 10,
//     padding: 10,
//   },
//   imageViewerScrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   imageViewerImage: {
//     width: width,
//     height: height,
//   },
//   imageViewerDetails: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 20,
//     paddingBottom: Platform.OS === 'ios' ? 40 : 30,
//   },
//   imageViewerDetailsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   imageViewerUserInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   imageViewerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   imageViewerAvatarText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   imageViewerUsername: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   imageViewerTimestamp: {
//     color: 'rgba(255,255,255,0.7)',
//     fontSize: 12,
//   },
//   imageViewerContent: {
//     marginBottom: 15,
//   },
//   imageViewerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   imageViewerPrice: {
//     color: '#27ae60',
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 8,
//   },
//   imageViewerDescription: {
//     color: 'rgba(255,255,255,0.9)',
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   imageViewerTweetContent: {
//     color: '#fff',
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   imageViewerStats: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255,255,255,0.2)',
//     paddingTop: 15,
//   },
//   imageViewerStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 25,
//   },
//   imageViewerStatText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontSize: 14,
//   },
  
//   // Fullscreen Video Modal Styles
//   fullscreenVideoOverlay: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   fullscreenVideoContent: {
//     flex: 1,
//   },
//   fullscreenCloseButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     right: 20,
//     zIndex: 20,
//     padding: 10,
//   },
//   fullscreenVideoWrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   fullscreenVideoPlayer: {
//     width: width,
//     height: height,
//   },
//   fullscreenLoadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     zIndex: 5,
//   },
//   fullscreenErrorOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     zIndex: 5,
//   },
//   errorTitle: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   retryButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   fullscreenVideoInfo: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 16,
//     borderRadius: 10,
//     zIndex: 10,
//   },
//   fullscreenVideoTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   fullscreenVideoStats: {
//     flexDirection: 'row',
//   },
//   fullscreenStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   fullscreenStatText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontSize: 14,
//   },
//   fullscreenProgressContainer: {
//     position: 'absolute',
//     bottom: 100,
//     left: 20,
//     right: 20,
//     zIndex: 10,
//   },
//   fullscreenProgressBar: {
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 2,
//     marginBottom: 8,
//   },
//   fullscreenProgressFill: {
//     height: 4,
//     backgroundColor: '#fff',
//     borderRadius: 2,
//   },
//   fullscreenTimeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   fullscreenTimeText: {
//     color: '#fff',
//     fontSize: 12,
//   },
//   fullscreenControlsRow: {
//     position: 'absolute',
//     bottom: 30,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   fullscreenControlButton: {
//     padding: 10,
//   },
  
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   modalContainer: {
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 24,
//     paddingBottom: 32,
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//   },
//   modalOptionText: {
//     fontSize: 16,
//     marginLeft: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//     lineHeight: 26,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//   },
// });

// export default ManagePostsScreen;

// import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   StatusBar,
//   Modal,
//   Animated,
//   Dimensions,
//   Pressable,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   ScrollView,
//   Share,
//   PanResponder
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import Video from 'react-native-video';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { height, width } = Dimensions.get('window');

// // Track reactions cache
// const REACTIONS_CACHE_KEY = 'user_reactions_cache';

// // Reaction Button Component
// const ReactionButton = ({ type, count, isActive, onPress, colors }) => {
//   const getIconName = () => {
//     switch(type) {
//       case 'like':
//         return isActive ? 'heart' : 'heart-outline';
//       case 'love':
//         return isActive ? 'heart-circle' : 'heart-circle-outline';
//       case 'support':
//         return isActive ? 'thumbs-up' : 'thumbs-up-outline';
//       default:
//         return 'heart-outline';
//     }
//   };

//   const getIconColor = () => {
//     if (isActive) {
//       switch(type) {
//         case 'like':
//           return '#ff6b6b';
//         case 'love':
//           return '#ff9f4a';
//         case 'support':
//           return '#4ecdc4';
//         default:
//           return colors.primary;
//       }
//     }
//     return colors.textSecondary;
//   };

//   return (
//     <TouchableOpacity 
//       style={styles.reactionButton}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <Ionicons 
//         name={getIconName()} 
//         size={24} 
//         color={getIconColor()} 
//       />
//       {count > 0 && (
//         <Text style={[styles.reactionCount, { color: colors.textSecondary }]}>
//           {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );
// };

// // Post Detail Bottom Sheet Component
// const PostDetailBottomSheet = ({ 
//   visible, 
//   post, 
//   onClose, 
//   onReaction,
//   colors,
//   type 
// }) => {
//   const slideAnim = useRef(new Animated.Value(height)).current;
//   const [userReaction, setUserReaction] = useState(null);
//   const [likeCount, setLikeCount] = useState(0);
//   const [commentCount, setCommentCount] = useState(0);
//   const [shareCount, setShareCount] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [loadingComments, setLoadingComments] = useState(false);

//   useEffect(() => {
//     if (visible && post) {
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         useNativeDriver: true,
//         tension: 65,
//         friction: 11,
//       }).start();
      
//       // Set initial reaction state
//       setUserReaction(post.user_reaction || null);
//       setLikeCount(post.like_count || 0);
//       setCommentCount(post.comment_count || 0);
//       setShareCount(post.share_count || 0);
      
//       // Fetch comments
//       fetchComments();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: height,
//         duration: 250,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible, post]);

//   const fetchComments = async () => {
//     if (!post) return;
//     setLoadingComments(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/post/${post.id}/comments/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setComments(response.data.comments || []);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const handleReaction = async (reactionType) => {
//     if (!post) return;
    
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     // Optimistic update
//     const isCurrentlyActive = userReaction === reactionType;
//     const newReaction = isCurrentlyActive ? null : reactionType;
//     const delta = isCurrentlyActive ? -1 : 1;
    
//     setUserReaction(newReaction);
//     setLikeCount(prev => Math.max(0, prev + delta));

//     try {
//       const response = await axios.post(
//         `${API_ROUTE}/post-react/`,
//         { 
//           post_id: post.id, 
//           reaction_type: reactionType 
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data) {
//         setLikeCount(response.data.like_count);
//         setUserReaction(response.data.reaction?.reaction_type || null);
        
//         // Show reward if any
//         if (response.data.reward) {
//           Alert.alert(
//             '🎉 Reward!',
//             `You earned ${response.data.reward.coins} coins!`,
//             [{ text: 'OK' }]
//           );
//         }
//       }
//     } catch (error) {
//       // Revert on error
//       setUserReaction(userReaction);
//       setLikeCount(prev => isCurrentlyActive ? prev + 1 : prev - 1);
//       console.error('Error reacting:', error);
//     }
//   };

//   const handleComment = async () => {
//     if (!newComment.trim() || !post) return;
    
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     const tempComment = {
//       id: `temp_${Date.now()}`,
//       text: newComment.trim(),
//       created_at: new Date().toISOString(),
//       user: { username: 'You' }
//     };

//     setComments(prev => [tempComment, ...prev]);
//     setCommentCount(prev => prev + 1);
//     setNewComment('');

//     try {
//       const response = await axios.post(
//         `${API_ROUTE}/posts-comment/${post.id}/comments/`,
//         { text: newComment.trim(), post: post.id },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data) {
//         setComments(prev => prev.map(c => c.id === tempComment.id ? response.data : c));
//         if (response.data.reward) {
//           Alert.alert('💬 Reward!', `You earned ${response.data.reward.coins} coins!`);
//         }
//       }
//     } catch (error) {
//       setComments(prev => prev.filter(c => c.id !== tempComment.id));
//       setCommentCount(prev => prev - 1);
//       console.error('Error commenting:', error);
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `Check out this post: ${post.content || 'My post'}`,
//         title: 'Share Post'
//       });
      
//       // Track share
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(
//         `${API_ROUTE}/post-react/`,
//         { post_id: post.id, reaction_type: 'share' },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (response.data) {
//         setShareCount(response.data.share_count);
//       }
//     } catch (error) {
//       console.error('Error sharing:', error);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     return date.toLocaleDateString();
//   };

//   if (!post) return null;

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="none"
//       onRequestClose={onClose}
//     >
//       <View style={styles.bottomSheetOverlay}>
//         <Pressable style={styles.bottomSheetBackdrop} onPress={onClose} />
        
//         <Animated.View 
//           style={[
//             styles.bottomSheetContainer,
//             { 
//               backgroundColor: colors.card,
//               transform: [{ translateY: slideAnim }]
//             }
//           ]}
//         >
//           {/* Drag Handle */}
//           <View style={styles.bottomSheetHandle}>
//             <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
//           </View>

//           <ScrollView 
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.bottomSheetContent}
//           >
//             {/* Post Header */}
//             <View style={styles.bottomSheetHeader}>
//               <View style={styles.userInfo}>
//                 <Image
//                   source={
//                     post.user_profile_picture
//                       ? { uri: post.user_profile_picture }
//                       : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                   }
//                   style={styles.userAvatar}
//                 />
//                 <View>
//                   <Text style={[styles.userName, { color: colors.text }]}>
//                     {post.username || 'User'}
//                   </Text>
//                   <Text style={[styles.postTime, { color: colors.textSecondary }]}>
//                     {formatDate(post.created_at)}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Post Content */}
//             {(type === 'tweets' || type === 'marketplace') && (
//               <>
//                 {type === 'marketplace' && post.title && (
//                   <Text style={[styles.postTitle, { color: colors.text }]}>
//                     {post.title}
//                   </Text>
//                 )}
                
//                 {type === 'marketplace' && post.price && (
//                   <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>
//                     ₦{post.price}
//                   </Text>
//                 )}
                
//                 {(post.content || post.description) && (
//                   <Text style={[styles.postText, { color: colors.text }]}>
//                     {post.content || post.description}
//                   </Text>
//                 )}
//               </>
//             )}

//             {/* Media Content */}
//             {post.images && post.images.length > 0 && (
//               <ScrollView 
//                 horizontal 
//                 pagingEnabled 
//                 showsHorizontalScrollIndicator={false}
//                 style={styles.mediaScrollView}
//               >
//                 {post.images.map((img, index) => (
//                   <Image
//                     key={index}
//                     source={{ uri: img.image || img.url }}
//                     style={styles.mediaImage}
//                     resizeMode="cover"
//                   />
//                 ))}
//               </ScrollView>
//             )}

//             {post.image_url && (
//               <Image
//                 source={{ uri: post.image_url }}
//                 style={styles.mediaImage}
//                 resizeMode="cover"
//               />
//             )}

//             {post.video && (
//               <View style={styles.videoContainer}>
//                 <Video
//                   source={{ uri: post.video }}
//                   style={styles.videoPlayer}
//                   resizeMode="contain"
//                   controls={true}
//                   paused={false}
//                   repeat={false}
//                 />
//               </View>
//             )}

//             {/* Stats Row */}
//             <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
//               <Text style={[styles.statsText, { color: colors.textSecondary }]}>
//                 {likeCount} {likeCount === 1 ? 'like' : 'likes'}
//               </Text>
//               <Text style={[styles.statsText, { color: colors.textSecondary }]}>
//                 {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
//               </Text>
//               <Text style={[styles.statsText, { color: colors.textSecondary }]}>
//                 {shareCount} {shareCount === 1 ? 'share' : 'shares'}
//               </Text>
//             </View>

//             {/* Action Buttons */}
//             <View style={styles.actionButtonsRow}>
//               <ReactionButton
//                 type="like"
//                 count={likeCount}
//                 isActive={userReaction === 'like'}
//                 onPress={() => handleReaction('like')}
//                 colors={colors}
//               />
              
//               <TouchableOpacity 
//                 style={styles.actionButton}
//                 onPress={() => {
//                   // Scroll to comment input
//                 }}
//               >
//                 <Ionicons name="chatbubble-outline" size={24} color={colors.textSecondary} />
//                 <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
//                   Comment
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.actionButton}
//                 onPress={handleShare}
//               >
//                 <Ionicons name="share-social-outline" size={24} color={colors.textSecondary} />
//                 <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
//                   Share
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Comments Section */}
//             <View style={styles.commentsSection}>
//               <Text style={[styles.commentsTitle, { color: colors.text }]}>
//                 Comments ({commentCount})
//               </Text>
              
//               {loadingComments ? (
//                 <ActivityIndicator size="small" color={colors.primary} />
//               ) : comments.length === 0 ? (
//                 <Text style={[styles.noComments, { color: colors.textSecondary }]}>
//                   No comments yet. Be the first to comment!
//                 </Text>
//               ) : (
//                 comments.map(comment => (
//                   <View key={comment.id} style={styles.commentItem}>
//                     <Image
//                       source={
//                         comment.user?.profile_picture
//                           ? { uri: comment.user.profile_picture }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.commentAvatar}
//                     />
//                     <View style={styles.commentContent}>
//                       <Text style={[styles.commentUsername, { color: colors.text }]}>
//                         {comment.user?.username || 'User'}
//                       </Text>
//                       <Text style={[styles.commentText, { color: colors.text }]}>
//                         {comment.text}
//                       </Text>
//                       <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
//                         {formatDate(comment.created_at)}
//                       </Text>
//                     </View>
//                   </View>
//                 ))
//               )}
//             </View>
//           </ScrollView>

//           {/* Comment Input */}
//           <View style={[styles.commentInputWrapper, { borderTopColor: colors.border }]}>
//             <TextInput
//               style={[styles.commentInput, { 
//                 backgroundColor: colors.backgroundSecondary,
//                 color: colors.text
//               }]}
//               placeholder="Write a comment..."
//               placeholderTextColor={colors.textSecondary}
//               value={newComment}
//               onChangeText={setNewComment}
//               multiline
//             />
//             <TouchableOpacity 
//               style={[styles.postCommentButton, { backgroundColor: colors.primary }]}
//               onPress={handleComment}
//               disabled={!newComment.trim()}
//             >
//               <Ionicons name="send" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// // Grid Item Component
// const GridItem = memo(({ item, type, onPress, colors }) => {
//   const getImageUrl = () => {
//     if (type === 'marketplace') {
//       return item.images?.[0]?.image;
//     } else if (type === 'tweets') {
//       return item.image_url;
//     } else if (type === 'videos') {
//       return item.thumbnail || item.video;
//     }
//     return null;
//   };

//   const imageUrl = getImageUrl();
//   const isVideo = type === 'videos';

//   return (
//     <TouchableOpacity 
//       activeOpacity={0.9}
//       onPress={() => onPress(item)}
//       style={styles.gridItem}
//     >
//       {imageUrl ? (
//         <Image 
//           source={{ uri: imageUrl }} 
//           style={styles.gridImage}
//           resizeMode="cover"
//         />
//       ) : (
//         <View style={[styles.gridPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
//           {isVideo ? (
//             <MaterialIcon name="videocam" size={30} color={colors.textSecondary} />
//           ) : (
//             <Ionicons name="document-text" size={30} color={colors.textSecondary} />
//           )}
//         </View>
//       )}
      
//       {isVideo && (
//         <View style={styles.videoBadgeGrid}>
//           <MaterialIcon name="play-arrow" size={16} color="#fff" />
//         </View>
//       )}
      
//       {/* Reaction indicator */}
//       {item.like_count > 0 && (
//         <View style={styles.reactionBadge}>
//           <Ionicons name="heart" size={12} color="#fff" />
//           <Text style={styles.reactionBadgeText}>
//             {item.like_count > 999 ? `${(item.like_count / 1000).toFixed(1)}K` : item.like_count}
//           </Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// });

// const ManagePostsScreen = () => {
//   const { colors, isDark } = useTheme(); 
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState('tweets');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [playingVideoId, setPlayingVideoId] = useState(null);
  
//   // Bottom sheet states
//   const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [selectedPostType, setSelectedPostType] = useState(null);
  
//   const slideAnim = useRef(new Animated.Value(height)).current;
//   const abortControllerRef = useRef(null);
//   const isMounted = useRef(true);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, []);

//   const getSecureUrl = (url) => {
//     if (!url) return null;
//     if (url.startsWith('http://')) {
//       url = url.replace('http://', 'https://');
//     }
//     return url;
//   };

//   // Open bottom sheet with post details
//   const openPostDetail = (item, type) => {
//     setSelectedPost(item);
//     setSelectedPostType(type);
//     setBottomSheetVisible(true);
//   };

//   // Close bottom sheet
//   const closePostDetail = () => {
//     setBottomSheetVisible(false);
//     setSelectedPost(null);
//     setSelectedPostType(null);
//   };

//   const fetchMarketplace = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-listings/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         setMarketplacePosts(res.data || []);
//       }
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Error fetching marketplace posts:', error);
//         if (isMounted.current) {
//           setMarketplacePosts([]);
//         }
//       }
//     }
//   }, []);

//   const fetchTweets = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-posts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         setTweets(res.data || []);
//       }
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Error fetching tweets:', error);
//         if (isMounted.current) {
//           setTweets([]);
//         }
//       }
//     }
//   }, []);

//   const fetchVideos = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         console.log('Fetched videos:', res.data);
//         setUserVideos(res.data || []);
//       }
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Error fetching videos:', error);
//         if (isMounted.current) {
//           setUserVideos([]);
//         }
//       }
//     }
//   }, []);

//   // Fetch all data
//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         await Promise.all([
//           fetchMarketplace(),
//           fetchTweets(),
//           fetchVideos()
//         ]);
//       } catch (error) {
//         console.error('Error fetching all data:', error);
//       } finally {
//         if (isMounted.current) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchAllData();
//   }, [fetchMarketplace, fetchTweets, fetchVideos]);

//   // Refresh data when screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       const refreshData = async () => {
//         try {
//           await fetchMarketplace();
//           await fetchTweets();
//           await fetchVideos();
//         } catch (error) {
//           console.error('Error refreshing data:', error);
//         }
//       };
      
//       refreshData();
      
//       return () => {
//         if (abortControllerRef.current) {
//           abortControllerRef.current.abort();
//         }
//       };
//     }, [fetchMarketplace, fetchTweets, fetchVideos])
//   );

//   const confirmDelete = (type, id) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this item?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => handleDelete(type, id),
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const handleDelete = async (type, id) => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       let endpoint = '';
//       if (type === 'marketplace') {
//         endpoint = `${API_ROUTE}/my-listings/${id}/`;
//       } else if (type === 'tweets') {
//         endpoint = `${API_ROUTE}/my-posts/${id}/`;
//       } else {
//         endpoint = `${API_ROUTE}/my-shorts/${id}/`;
//       }

//       await axios.delete(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Refresh the appropriate list
//       if (type === 'marketplace') {
//         await fetchMarketplace();
//       } else if (type === 'tweets') {
//         await fetchTweets();
//       } else {
//         await fetchVideos();
//       }
      
//       Alert.alert("Success", "Item deleted successfully");
//     } catch (error) {
//       Alert.alert("Error", "Failed to delete item");
//       console.error('Delete error:', error);
//     }
//     toggleModal();
//   };

//   const toggleModal = (item = null) => {
//     setSelectedItem(item);
//     if (item) {
//       setModalVisible(true);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: height,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setModalVisible(false));
//     }
//   };

//   const renderEmptyState = () => (
//     <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
//       <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
//       <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//         You haven't posted anything yet. Create your first post and start sharing!
//       </Text>
//     </View>
//   );

//   const currentData = () => {
//     switch(selectedTab) {
//       case 'marketplace': return marketplacePosts;
//       case 'tweets': return tweets;
//       case 'videos': return userVideos;
//       default: return [];
//     }
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
//       {/* Header */}
//       <View style={[styles.header, { 
//         backgroundColor: colors.card,
//         borderBottomColor: colors.border 
//       }]}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Posts</Text>
//         <View style={styles.headerRight} />
//       </View>

//       {/* Tab Bar */}
//       <View style={[styles.tabContainer, { 
//         backgroundColor: colors.card,
//         borderBottomColor: colors.border 
//       }]}>
//         <TouchableOpacity 
//           onPress={() => setSelectedTab('tweets')} 
//           style={[
//             styles.tab, 
//             { backgroundColor: 'transparent' },
//             selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
//           ]}
//           activeOpacity={0.7}
//         >
//           <Text style={[
//             styles.tabText, 
//             { color: colors.primary },
//             selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
//           ]}>
//             Posts
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           onPress={() => setSelectedTab('marketplace')} 
//           style={[
//             styles.tab, 
//             { backgroundColor: 'transparent' },
//             selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
//           ]}
//           activeOpacity={0.7}
//         >
//           <Text style={[
//             styles.tabText, 
//             { color: colors.primary },
//             selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
//           ]}>
//             Listings
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={() => setSelectedTab('videos')} 
//           style={[
//             styles.tab, 
//             { backgroundColor: 'transparent' },
//             selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
//           ]}
//           activeOpacity={0.7}
//         >
//           <Text style={[
//             styles.tabText, 
//             { color: colors.primary },
//             selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
//           ]}>
//             Shorts
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
//           <ActivityIndicator size="large" color={colors.primary} />
//           <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your posts...</Text>
//         </View>
//       ) : currentData().length === 0 ? (
//         renderEmptyState()
//       ) : (
//         <FlatList
//           data={currentData()}
//           renderItem={({ item }) => (
//             <GridItem
//               item={item}
//               type={selectedTab}
//               onPress={() => openPostDetail(item, selectedTab)}
//               colors={colors}
//             />
//           )}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={3}
//           contentContainerStyle={styles.gridContainer}
//           showsVerticalScrollIndicator={false}
//           initialNumToRender={9}
//           maxToRenderPerBatch={12}
//           windowSize={10}
//           columnWrapperStyle={styles.gridRow}
//         />
//       )}

//       {/* Post Detail Bottom Sheet */}
//       <PostDetailBottomSheet
//         visible={bottomSheetVisible}
//         post={selectedPost}
//         onClose={closePostDetail}
//         type={selectedPostType}
//         colors={colors}
//       />

//       {/* Bottom Sheet Modal for Delete */}
//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => toggleModal()}
//         animationType="none"
//       >
//         <View style={styles.modalOverlay}>
//           <Pressable 
//             style={styles.modalBackdrop} 
//             onPress={() => toggleModal()}
//           />
          
//           <Animated.View 
//             style={[
//               styles.modalContainer,
//               { 
//                 backgroundColor: colors.card,
//                 transform: [{ translateY: slideAnim }] 
//               }
//             ]}
//           >
//             <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
//             <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
            
//             <TouchableOpacity 
//               style={[styles.modalOption, { borderBottomColor: colors.border }]}
//               onPress={() => {
//                 if (selectedItem) {
//                   confirmDelete(selectedTab, selectedItem.id);
//                 }
//               }}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="trash-outline" size={24} color="#e74c3c" />
//               <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.modalOption, { borderBottomColor: colors.border }]}
//               onPress={() => toggleModal()}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="close-circle-outline" size={24} color={colors.primary} />
//               <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderBottomWidth: 1,
//     elevation: 2,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   headerRight: {
//     width: 24,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     elevation: 2,
//   },
//   tab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },
//   activeTab: {
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   tabText: {
//     marginLeft: 8,
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   activeTabText: {
//     color: '#fff',
//   },
  
//   // Grid Styles
//   gridContainer: {
//     padding: 2,
//   },
//   gridRow: {
//     justifyContent: 'space-between',
//   },
//   gridItem: {
//     width: (width - 12) / 3,
//     height: (width - 12) / 3,
//     margin: 2,
//     borderRadius: 8,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   gridImage: {
//     width: '100%',
//     height: '100%',
//   },
//   gridPlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoBadgeGrid: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 4,
//     padding: 4,
//   },
//   reactionBadge: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 12,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   reactionBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
  
//   // Bottom Sheet Styles
//   bottomSheetOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   bottomSheetBackdrop: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   bottomSheetContainer: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.9,
//   },
//   bottomSheetHandle: {
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   handleBar: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//   },
//   bottomSheetContent: {
//     paddingBottom: 20,
//   },
//   bottomSheetHeader: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   userAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   postTime: {
//     fontSize: 12,
//     marginTop: 2,
//   },
//   postTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     paddingHorizontal: 20,
//     marginTop: 8,
//   },
//   postPrice: {
//     fontSize: 18,
//     fontWeight: '700',
//     paddingHorizontal: 20,
//     marginTop: 4,
//   },
//   postText: {
//     fontSize: 15,
//     lineHeight: 22,
//     paddingHorizontal: 20,
//     marginTop: 12,
//   },
//   mediaScrollView: {
//     marginTop: 16,
//     height: 300,
//   },
//   mediaImage: {
//     width: width,
//     height: 300,
//   },
//   videoContainer: {
//     width: width,
//     height: 300,
//     backgroundColor: '#000',
//     marginTop: 16,
//   },
//   videoPlayer: {
//     width: '100%',
//     height: '100%',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     gap: 20,
//   },
//   statsText: {
//     fontSize: 13,
//   },
//   actionButtonsRow: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     gap: 24,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   actionButtonText: {
//     fontSize: 14,
//   },
//   reactionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   reactionCount: {
//     fontSize: 14,
//   },
//   commentsSection: {
//     paddingHorizontal: 20,
//     marginTop: 16,
//   },
//   commentsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   commentItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//     gap: 12,
//   },
//   commentAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentUsername: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   commentText: {
//     fontSize: 14,
//     marginTop: 2,
//   },
//   commentTime: {
//     fontSize: 11,
//     marginTop: 4,
//   },
//   noComments: {
//     fontSize: 14,
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   commentInputWrapper: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 0.5,
//     alignItems: 'flex-end',
//     gap: 12,
//   },
//   commentInput: {
//     flex: 1,
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     maxHeight: 80,
//     fontSize: 14,
//   },
//   postCommentButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   modalContainer: {
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 24,
//     paddingBottom: 32,
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//   },
//   modalOptionText: {
//     fontSize: 16,
//     marginLeft: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//     lineHeight: 26,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//   },
// });

// export default ManagePostsScreen;

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Share,
  PanResponder,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icontt from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext'; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { height, width } = Dimensions.get('window');
const PLAYBACK_RATE = 1;

// ==================== VIDEO PLAYER COMPONENT ====================
const VideoPlayer = memo(({ uri, isPlaying, onPress, style, colors }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [uri]);

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
      <Video
        ref={videoRef}
        source={{ uri }}
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
      
      {isLoading && (
        <View style={styles.videoLoading}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
      
      {hasError && (
        <View style={styles.videoError}>
          <FeatherIcon name="alert-circle" size={24} color="#fff" />
          <Text style={styles.errorText}>Failed to load</Text>
        </View>
      )}
      
      {!isPlaying && !isLoading && !hasError && (
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

// ==================== POST DETAIL BOTTOM SHEET (FOR IMAGES) ====================
const PostDetailBottomSheet = ({ 
  visible, 
  post, 
  onClose, 
  onPostUpdate,
  colors,
  type,
  navigation 
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [userReaction, setUserReaction] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyToUsername, setReplyToUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedComments, setLikedComments] = useState({});

  useEffect(() => {
    if (visible && post) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      
      setUserReaction(post.user_reaction || null);
      setLikeCount(post.like_count || 0);
      setCommentCount(post.comment_count || 0);
      setShareCount(post.share_count || 0);
      
      fetchComments();
      fetchCurrentUser();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setReplyToCommentId(null);
      setReplyToUsername('');
      setNewComment('');
    }
  }, [visible, post]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUserId(parsed.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchComments = async () => {
    if (!post) return;
    setLoadingComments(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/post/${post.id}/comments/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('fetch commenssssst',response.data.comments)
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!post) return;
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const isCurrentlyActive = userReaction === reactionType;
    const newReaction = isCurrentlyActive ? null : reactionType;
    const delta = isCurrentlyActive ? -1 : 1;
    
    setUserReaction(newReaction);
    setLikeCount(prev => Math.max(0, prev + delta));

    try {
      const response = await axios.post(
        `${API_ROUTE}/post-react/`,
        { post_id: post.id, reaction_type: reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setLikeCount(response.data.like_count);
        setUserReaction(response.data.reaction?.reaction_type || null);
        
        if (response.data.reward) {
          Alert.alert('🎉 Reward!', `You earned ${response.data.reward.coins} coins!`);
        }
        
        if (onPostUpdate) {
          onPostUpdate(post.id, { like_count: response.data.like_count });
        }
      }
    } catch (error) {
      setUserReaction(userReaction);
      setLikeCount(prev => isCurrentlyActive ? prev + 1 : prev - 1);
      console.error('Error reacting:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const isCurrentlyLiked = likedComments[commentId];
    setLikedComments(prev => ({ ...prev, [commentId]: !isCurrentlyLiked }));

    try {
      await axios.post(
        `${API_ROUTE}/comment/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setLikedComments(prev => ({ ...prev, [commentId]: isCurrentlyLiked }));
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId, parentId = null) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const endpoint = parentId 
                ? `${API_ROUTE}/comment-reply/${commentId}/delete/`
                : `${API_ROUTE}/comment/${commentId}/delete/`;
              
              const response = await axios.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (response.data.success) {
                if (parentId) {
                  setComments(prev => prev.map(comment => {
                    if (comment.id === parentId) {
                      return {
                        ...comment,
                        replies: comment.replies?.filter(r => r.id !== commentId),
                        reply_count: (comment.reply_count || 0) - 1
                      };
                    }
                    return comment;
                  }));
                } else {
                  setComments(prev => prev.filter(c => c.id !== commentId));
                  setCommentCount(prev => prev - 1);
                  if (onPostUpdate) {
                    onPostUpdate(post.id, { comment_count: commentCount - 1 });
                  }
                }
              }
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment');
            }
          }
        }
      ]
    );
  };

  const handleReply = (commentId, username) => {
    setReplyToCommentId(commentId);
    setReplyToUsername(username);
    setNewComment(`@${username} `);
  };

const handleDeletePost = () => {
  Alert.alert(
    "Delete Post",
    "Are you sure you want to delete this post? This action cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            let endpoint = '';
            
            if (type === 'marketplace') {
              endpoint = `${API_ROUTE}/my-listings/${post.id}/`;
            } else if (type === 'tweets') {
              endpoint = `${API_ROUTE}/my-posts/${post.id}/`;
            } else {
              endpoint = `${API_ROUTE}/my-shorts/${post.id}/`;
            }
            
            await axios.delete(endpoint, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            Alert.alert("Success", "Post deleted successfully");
            if (onPostUpdate) {
              onPostUpdate(post.id, { deleted: true });
            }
            onClose();
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert("Error", "Failed to delete post");
          }
        }
      }
    ]
  );
};

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post) return;
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const isReply = replyToCommentId !== null;
    
    const userData = await AsyncStorage.getItem('userData');
    const parsedUser = userData ? JSON.parse(userData) : null;
    const userName = parsedUser?.name || parsedUser?.username || 'You';
    const userAvatar = parsedUser?.profile_picture;

    const tempId = `temp_${Date.now()}`;
    const cleanText = isReply ? newComment.replace(`@${replyToUsername} `, '').trim() : newComment.trim();
    
    const optimisticComment = {
      id: tempId,
      text: cleanText,
      created_at: new Date().toISOString(),
      user: {
        id: parsedUser?.id,
        username: userName,
        profile_picture: userAvatar,
        is_verified: false
      },
      like_count: 0,
      is_liked: false,
      replies: []
    };

    if (isReply) {
      setComments(prev => prev.map(comment => {
        if (comment.id === replyToCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), optimisticComment],
            reply_count: (comment.reply_count || 0) + 1
          };
        }
        return comment;
      }));
    } else {
      setComments(prev => [optimisticComment, ...prev]);
      setCommentCount(prev => prev + 1);
      if (onPostUpdate) {
        onPostUpdate(post.id, { comment_count: commentCount + 1 });
      }
    }

    setNewComment('');
    setReplyToCommentId(null);
    setReplyToUsername('');

    try {
      const endpoint = isReply
        ? `${API_ROUTE}/comment/${replyToCommentId}/reply/`
        : `${API_ROUTE}/posts-comment/${post.id}/comments/`;
      
      const payload = isReply
        ? { text: cleanText }
        : { text: cleanText, post: post.id };

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        if (isReply) {
          setComments(prev => prev.map(comment => {
            if (comment.id === replyToCommentId) {
              return {
                ...comment,
                replies: comment.replies.map(r => r.id === tempId ? response.data : r)
              };
            }
            return comment;
          }));
        } else {
          setComments(prev => prev.map(c => c.id === tempId ? response.data : c));
          if (response.data.comment_count !== undefined) {
            setCommentCount(response.data.comment_count);
            if (onPostUpdate) {
              onPostUpdate(post.id, { comment_count: response.data.comment_count });
            }
          }
        }

        if (response.data.reward) {
          Alert.alert('💬 Reward!', `You earned ${response.data.reward.coins} coins!`);
        }
      }
    } catch (error) {
      if (isReply) {
        setComments(prev => prev.map(comment => {
          if (comment.id === replyToCommentId) {
            return {
              ...comment,
              replies: comment.replies?.filter(r => r.id !== tempId),
              reply_count: (comment.reply_count || 0) - 1
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => prev.filter(c => c.id !== tempId));
        setCommentCount(prev => prev - 1);
        if (onPostUpdate) {
          onPostUpdate(post.id, { comment_count: commentCount - 1 });
        }
      }
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post: ${post.content || post.title || 'My post'}`,
        title: 'Share Post'
      });
      
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/post-react/`,
        { post_id: post.id, reaction_type: 'share' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setShareCount(response.data.share_count);
        if (onPostUpdate) {
          onPostUpdate(post.id, { share_count: response.data.share_count });
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dayjs(dateString).format('MMMM D, YYYY');
  };

  if (!post) return null;

  const getImageUrl = () => {
    if (type === 'marketplace') {
      return post.images?.[0]?.image;
    } else if (type === 'tweets') {
      return post.image_url;
    }
    return null;
  };

  const imageUrl = getImageUrl();

const renderCommentItem = (comment, level = 0) => {
  const isOwnComment = comment.user?.id === currentUserId || comment.user_details?.id === currentUserId;
  const isLiked = likedComments[comment.id];
  const replies = comment.replies || [];
  
  // Get user data from the correct location in the response
  const commentUsername = comment.username || comment.user?.username || comment.user_details?.username || 'User';
  const commentUserAvatar = comment.user_details?.profile_picture || comment.user?.profile_picture || comment.image;
  const commentUserId = comment.user?.id || comment.user_details?.id;
  
  return (
    <View key={comment.id} style={[styles.commentItem, { marginLeft: level * 20 }]}>
      <View style={styles.commentRow}>
        <Image
          source={
            commentUserAvatar
              ? { uri: `${API_ROUTE_IMAGE}${commentUserAvatar}` }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.commentAvatar}
        />
        
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <View style={styles.commentUserInfo}>
              <Text style={[styles.commentUsername, { color: colors.text }]}>
                {commentUsername}
              </Text>
              <Text style={[styles.commentTimestamp, { color: colors.textSecondary }]}>
                {dayjs(comment.created_at).fromNow()}
              </Text>
            </View>
            
            {isOwnComment && (
              <TouchableOpacity
                onPress={() => handleDeleteComment(comment.id, comment.parent_id)}
                style={styles.commentDeleteButton}
              >
                <Ionicons name="trash-outline" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[styles.commentText, { color: colors.text }]}>
            {comment.text}
          </Text>
          
          <View style={styles.commentActions}>
            <TouchableOpacity 
              style={styles.commentActionButton}
              onPress={() => handleCommentLike(comment.id)}
            >
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={14} 
                color={isLiked ? colors.primary : colors.textSecondary} 
              />
              {comment.like_count > 0 && (
                <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                  {comment.like_count}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.commentActionButton}
              onPress={() => handleReply(comment.id, commentUsername)}
            >
              <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                Reply
              </Text>
            </TouchableOpacity>
          </View>

          {replies.length > 0 && (
            <View style={styles.repliesSection}>
              {replies.map(reply => renderCommentItem(reply, level + 1))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.bottomSheetOverlay}>
        <Pressable style={styles.bottomSheetBackdrop} onPress={onClose} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View 
            style={[
              styles.bottomSheetContainer,
              { 
                backgroundColor: colors.card,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.bottomSheetHandle}>
              <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.bottomSheetContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.bottomSheetHeader}>
                <View style={styles.userInfo}>
                  <Image
                    source={
                      post.user_profile_picture
                        ? { uri: post.user_profile_picture }
                        : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                    }
                    style={styles.userAvatar}
                  />
                  <View>
                    <Text style={[styles.userName, { color: colors.text }]}>
                      {post.username || 'User'}
                    </Text>
                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                      {formatDate(post.created_at)}
                    </Text>
                  </View>
                </View>
              </View>

              {type === 'marketplace' && post.title && (
                <Text style={[styles.postTitle, { color: colors.text }]}>
                  {post.title}
                </Text>
              )}
              
              {type === 'marketplace' && post.price && (
                <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>
                  ₦{post.price}
                </Text>
              )}
              
              {(post.content || post.description) && (
                <Text style={[styles.postText, { color: colors.text }]}>
                  {post.content || post.description}
                </Text>
              )}

              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              )}

              <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                  {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </Text>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                  {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                </Text>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                  {shareCount} {shareCount === 1 ? 'share' : 'shares'}
                </Text>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleReaction('like')}
                >
                  <Ionicons 
                    name={userReaction === 'like' ? 'heart' : 'heart-outline'} 
                    size={24} 
                    color={userReaction === 'like' ? '#ff6b6b' : colors.textSecondary} 
                  />
                  {likeCount > 0 && (
                    <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                      {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={24} color={colors.textSecondary} />
                  <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                    Comment
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <Ionicons name="share-social-outline" size={24} color={colors.textSecondary} />
                  <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                    Share
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleDeletePost}
                >
                  <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                  <Text style={[styles.actionButtonText, { color: '#e74c3c' }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.commentsSection}>
                <Text style={[styles.commentsTitle, { color: colors.text }]}>
                  Comments ({commentCount})
                </Text>
                
                {loadingComments ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : comments.length === 0 ? (
                  <Text style={[styles.noComments, { color: colors.textSecondary }]}>
                    No comments yet. Be the first to comment!
                  </Text>
                ) : (
                  comments.map(comment => renderCommentItem(comment))
                )}
              </View>
              
              <View style={{ height: 80 }} />
            </ScrollView>

            {replyToCommentId && (
              <View style={[styles.replyingBar, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.replyingText, { color: colors.textSecondary }]}>
                  Replying to @{replyToUsername}
                </Text>
                <TouchableOpacity onPress={() => {
                  setReplyToCommentId(null);
                  setReplyToUsername('');
                  setNewComment('');
                }}>
                  <Ionicons name="close" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={[styles.commentInputWrapper, { borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.commentInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text
                }]}
                placeholder={replyToCommentId ? "Write a reply..." : "Write a comment..."}
                placeholderTextColor={colors.textSecondary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.postCommentButton, { 
                  backgroundColor: newComment.trim() ? colors.primary : colors.textSecondary + '40'
                }]}
                onPress={handleCommentSubmit}
                disabled={!newComment.trim()}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ==================== FULL VIDEO MODAL ====================
const FullVideoModal = ({ visible, video, onClose, colors, navigation }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyToUsername, setReplyToUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible && video) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      
      setLiked(video.is_liked || false);
      setSaved(video.is_saved || false);
      setLikeCount(video.like_count || 0);
      setCommentCount(video.comment_count || 0);
      fetchComments();
      fetchCurrentUser();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setIsPlaying(false);
    }
  }, [visible, video]);

  useEffect(() => {
    if (showControls) {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showControls]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUserId(parsed.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchComments = async () => {
    if (!video) return;
    try {
      const headers = await getAuthHeader();
      const response = await axios.get(
        `${API_ROUTE}/shorts/${video.id}/comments/`,
        { headers }
      );
      
      if (response.status === 200) {
        const commentsData = response.data.results || response.data;
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
    }
  };

  const handleLike = async () => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyLiked = liked;
      
      setLiked(!isCurrentlyLiked);
      setLikeCount(prev => isCurrentlyLiked ? prev - 1 : prev + 1);
      
      if (!isCurrentlyLiked) {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/like/`, {}, { headers });
      } else {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/unlike/`, {}, { headers });
      }
    } catch (error) {
      setLiked(liked);
      setLikeCount(likeCount);
      console.error('Like error:', error);
    }
  };

  const handleSave = async () => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlySaved = saved;
      
      setSaved(!isCurrentlySaved);
      
      if (!isCurrentlySaved) {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/save/`, {}, { headers });
        Alert.alert('Saved', 'Video saved to your collection');
      } else {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/unsave/`, {}, { headers });
        Alert.alert('Removed', 'Video removed from saved');
      }
    } catch (error) {
      setSaved(saved);
      console.error('Save error:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this video: ${video.caption || video.title || 'My video'}`,
        title: 'Share Video'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyLiked = likedComments[commentId];
      
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !isCurrentlyLiked,
      }));
      
      if (!isCurrentlyLiked) {
        await axios.post(`${API_ROUTE}/comments/${commentId}/like/`, {}, { headers });
      } else {
        await axios.post(`${API_ROUTE}/comments/${commentId}/unlike/`, {}, { headers });
      }
    } catch (error) {
      setLikedComments(prev => ({
        ...prev,
        [commentId]: likedComments[commentId],
      }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !video) return;
    
    try {
      const headers = await getAuthHeader();
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      
      const tempId = `temp_${Date.now()}`;
      const optimisticComment = {
        id: tempId,
        text: commentText.trim(),
        created_at: new Date().toISOString(),
        user: {
          id: parsedUser?.id,
          username: parsedUser?.name || parsedUser?.username || 'You',
          profile_picture: parsedUser?.profile_picture
        },
        likes_count: 0,
        is_liked: false
      };
      
      setComments(prev => [optimisticComment, ...prev]);
      setCommentCount(prev => prev + 1);
      setCommentText('');
      
      const response = await axios.post(
        `${API_ROUTE}/shorts/${video.id}/comments/`,
        { text: commentText.trim() },
        { headers }
      );
      
      if (response.status === 201) {
        setComments(prev => prev.map(c => c.id === tempId ? response.data : c));
        if (response.data.reward) {
          Alert.alert('💬 Reward!', `You earned ${response.data.reward.coins} coins!`);
        }
      }
    } catch (error) {
      setComments(prev => prev.filter(c => !c.id.toString().startsWith('temp_')));
      setCommentCount(prev => prev - 1);
      console.error('Post comment error:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const headers = await getAuthHeader();
              await axios.delete(`${API_ROUTE}/comments/${commentId}/`, { headers });
              setComments(prev => prev.filter(c => c.id !== commentId));
              setCommentCount(prev => prev - 1);
            } catch (error) {
              console.error('Delete comment error:', error);
              Alert.alert('Error', 'Failed to delete comment');
            }
          }
        }
      ]
    );
  };

  const handleUserPress = (userId) => {
    onClose();
    navigation.navigate('OtherUserProfile', { userId });
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!video) return null;

const profilePic = video.user?.profile_picture 
  ? (video.user.profile_picture.startsWith('http') 
      ? video.user.profile_picture 
      : `${video.user.profile_picture}`)
  : null;


const username = video.user?.username || video.user?.name || video.user?.display_name || video.username || 'User';

const userId = video.user?.id;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.fullVideoOverlay}>
        <Pressable style={styles.fullVideoBackdrop} onPress={onClose} />
        
        <Animated.View 
          style={[
            styles.fullVideoContainer,
            { 
              backgroundColor: colors.background,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.fullVideoHeader}>
              <TouchableOpacity onPress={onClose} style={styles.fullVideoCloseButton}>
                <Ionicons name="arrow-back" size={24} color="#000000ff" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => handleUserPress(userId)} style={styles.fullVideoHeaderUser}>
                <Image
                  source={
                    profilePic
                      ? { uri: profilePic }
                      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={styles.fullVideoHeaderAvatar}
                />
                <Text style={styles.fullVideoHeaderUsername} numberOfLines={1}>
                  {username}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleShare} style={styles.fullVideoShareButton}>
                <Ionicons name="share-social-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.fullVideoContent}
          >
            <View style={styles.fullVideoPlayerWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowControls(!showControls)}
                style={styles.fullVideoPlayerTouchable}
              >
                <Video
                  ref={videoRef}
                  source={{ uri: video.video }}
                  style={styles.fullVideoPlayer}
                  resizeMode="contain"
                  repeat={true}
                  muted={isMuted}
                  paused={!isPlaying}
                  rate={PLAYBACK_RATE}
                  onLoadStart={() => setIsLoading(true)}
                  onLoad={(data) => {
                    setIsLoading(false);
                    setDuration(data.duration);
                  }}
                  onProgress={(data) => setProgress(data.currentTime)}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                />
                
                {isLoading && (
                  <View style={styles.fullVideoLoading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                )}
                
                {hasError && (
                  <View style={styles.fullVideoError}>
                    <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
                    <Text style={styles.fullVideoErrorText}>Failed to load video</Text>
                  </View>
                )}
                
                {showControls && !isLoading && !hasError && (
                  <View style={styles.fullVideoControls}>
                    <TouchableOpacity 
                      onPress={() => setIsPlaying(!isPlaying)}
                      style={styles.fullVideoPlayPause}
                    >
                      <Ionicons 
                        name={isPlaying ? 'pause' : 'play'} 
                        size={50} 
                        color="#fff" 
                      />
                    </TouchableOpacity>
                    
                    <View style={styles.fullVideoProgressContainer}>
                      <View style={styles.fullVideoProgressBar}>
                        <View 
                          style={[
                            styles.fullVideoProgressFill,
                            { width: `${(progress / duration) * 100}%` }
                          ]} 
                        />
                      </View>
                      <View style={styles.fullVideoTimeContainer}>
                        <Text style={styles.fullVideoTimeText}>{formatTime(progress)}</Text>
                        <Text style={styles.fullVideoTimeText}>{formatTime(duration)}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => setIsMuted(!isMuted)}
                      style={styles.fullVideoMute}
                    >
                      <Ionicons 
                        name={isMuted ? 'volume-mute' : 'volume-high'} 
                        size={24} 
                        color="#fff" 
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.fullVideoInfoSection}>
              <View style={styles.fullVideoUserInfo}>
                <Image
        source={
          profilePic
            ? { uri: profilePic }
            : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
        }
                  style={styles.fullVideoAvatar}
                />
                
              </View>
              
              {video.caption && (
                <Text style={[styles.fullVideoCaption, { color: colors.text }]}>
                  {video.caption}
                </Text>
              )}
              
              <View style={styles.fullVideoActions}>
                <TouchableOpacity style={styles.fullVideoActionButton} onPress={handleLike}>
                  <Ionicons 
                    name={liked ? 'heart' : 'heart-outline'} 
                    size={28} 
                    color={liked ? '#ff6b6b' : colors.textSecondary} 
                  />
                  {likeCount > 0 && (
                    <Text style={[styles.fullVideoActionText, { color: colors.textSecondary }]}>
                      {formatViews(likeCount)}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.fullVideoActionButton}>
                  <Ionicons name="chatbubble-outline" size={28} color={colors.textSecondary} />
                  {commentCount > 0 && (
                    <Text style={[styles.fullVideoActionText, { color: colors.textSecondary }]}>
                      {formatViews(commentCount)}
                    </Text>
                  )}
                </TouchableOpacity>
                
                
                
                <TouchableOpacity style={styles.fullVideoActionButton} onPress={handleShare}>
                  <Ionicons name="share-social-outline" size={28} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.fullVideoCommentsSection}>
                <Text style={[styles.fullVideoCommentsTitle, { color: colors.text }]}>
                  Comments ({commentCount})
                </Text>
                
                

                  {comments.length === 0 ? (
                    <Text style={[styles.fullVideoNoComments, { color: colors.textSecondary }]}>
                      No comments yet. Be the first to comment!
                    </Text>
                  ) : (
                    comments.map(comment => {
                      // Get user data from the comment object - THIS IS THE KEY FIX
                      const commentUser = comment.user || {};
                      const commentUsername = commentUser.username || commentUser.name || commentUser.display_name || 'User';
                      const commentUserAvatar = commentUser.profile_picture;
                      const commentUserId = commentUser.id;
                      const isOwnComment = commentUserId === currentUserId;
                      const isLiked = likedComments[comment.id];
                      
                      // Function to convert http to https and handle URLs
                      const getSecureImageUrl = (url) => {
                        if (!url) return null;
                        // If it's a relative path, prepend API route
                        if (url.startsWith('/')) {
                          return `${API_ROUTE_IMAGE}${url}`;
                        }
                        // Convert http to https
                        if (url.startsWith('http://')) {
                          return url.replace('http://', 'https://');
                        }
                        return url;
                      };
                      
                      const secureAvatarUrl = getSecureImageUrl(commentUserAvatar);
                      
                      return (
                        <View key={comment.id} style={styles.fullVideoCommentItem}>
                          <TouchableOpacity onPress={() => handleUserPress(commentUserId)}>
                            <Image
                              source={
                                secureAvatarUrl
                                  ? { uri: secureAvatarUrl }
                                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                              }
                              style={styles.fullVideoCommentAvatar}
                            />
                          </TouchableOpacity>
                          
                          <View style={styles.fullVideoCommentContent}>
                            <View style={styles.fullVideoCommentHeader}>
                              <TouchableOpacity onPress={() => handleUserPress(commentUserId)}>
                                <Text style={[styles.fullVideoCommentUsername, { color: colors.text }]}>
                                  {commentUsername}
                                </Text>
                              </TouchableOpacity>
                              <Text style={[styles.fullVideoCommentTime, { color: colors.textSecondary }]}>
                                {dayjs(comment.created_at).fromNow()}
                              </Text>
                            </View>
                            
                            <Text style={[styles.fullVideoCommentText, { color: colors.text }]}>
                              {comment.text}
                            </Text>
                            
                            <View style={styles.fullVideoCommentActions}>
                              <TouchableOpacity 
                                onPress={() => handleCommentLike(comment.id)}
                                style={styles.fullVideoCommentAction}
                              >
                                <Ionicons 
                                  name={isLiked ? 'heart' : 'heart-outline'} 
                                  size={14} 
                                  color={isLiked ? '#ff6b6b' : colors.textSecondary} 
                                />
                                {comment.like_count > 0 && (
                                  <Text style={[styles.fullVideoCommentActionText, { color: colors.textSecondary }]}>
                                    {comment.like_count}
                                  </Text>
                                )}
                              </TouchableOpacity>
                              
                              <TouchableOpacity 
                                onPress={() => {
                                  setReplyToCommentId(comment.id);
                                  setReplyToUsername(commentUsername);
                                  setCommentText(`@${commentUsername} `);
                                }}
                                style={styles.fullVideoCommentAction}
                              >
                                <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
                                <Text style={[styles.fullVideoCommentActionText, { color: colors.textSecondary }]}>
                                  Reply
                                </Text>
                              </TouchableOpacity>
                              
                              {isOwnComment && (
                                <TouchableOpacity 
                                  onPress={() => handleDeleteComment(comment.id)}
                                  style={styles.fullVideoCommentAction}
                                >
                                  <Ionicons name="trash-outline" size={14} color={colors.textSecondary} />
                                </TouchableOpacity>
                              )}
                            </View>
                            
                            {/* Render replies if they exist */}
                            {comment.replies && comment.replies.length > 0 && (
                              <View style={styles.repliesContainer}>
                                {comment.replies.map(reply => {
                                  const replyUser = reply.user || {};
                                  const replyUsername = replyUser.username || replyUser.name || replyUser.display_name || 'User';
                                  const replyAvatar = replyUser.profile_picture;
                                  const secureReplyAvatar = getSecureImageUrl(replyAvatar);
                                  const isReplyOwn = replyUser.id === currentUserId;
                                  const isReplyLiked = likedComments[reply.id];
                                  
                                  return (
                                    <View key={reply.id} style={[styles.fullVideoCommentItem, { marginLeft: 40, marginTop: 8 }]}>
                                      <TouchableOpacity onPress={() => handleUserPress(replyUser.id)}>
                                        <Image
                                          source={
                                            secureReplyAvatar
                                              ? { uri: secureReplyAvatar }
                                              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                                          }
                                          style={[styles.fullVideoCommentAvatar, { width: 28, height: 28, borderRadius: 14 }]}
                                        />
                                      </TouchableOpacity>
                                      
                                      <View style={styles.fullVideoCommentContent}>
                                        <View style={styles.fullVideoCommentHeader}>
                                          <TouchableOpacity onPress={() => handleUserPress(replyUser.id)}>
                                            <Text style={[styles.fullVideoCommentUsername, { color: colors.text, fontSize: 13 }]}>
                                              {replyUsername}
                                            </Text>
                                          </TouchableOpacity>
                                          <Text style={[styles.fullVideoCommentTime, { color: colors.textSecondary, fontSize: 10 }]}>
                                            {dayjs(reply.created_at).fromNow()}
                                          </Text>
                                        </View>
                                        
                                        <Text style={[styles.fullVideoCommentText, { color: colors.text, fontSize: 13 }]}>
                                          {reply.text}
                                        </Text>
                                        
                                        <View style={styles.fullVideoCommentActions}>
                                          <TouchableOpacity 
                                            onPress={() => handleCommentLike(reply.id)}
                                            style={styles.fullVideoCommentAction}
                                          >
                                            <Ionicons 
                                              name={isReplyLiked ? 'heart' : 'heart-outline'} 
                                              size={12} 
                                              color={isReplyLiked ? '#ff6b6b' : colors.textSecondary} 
                                            />
                                            {reply.like_count > 0 && (
                                              <Text style={[styles.fullVideoCommentActionText, { color: colors.textSecondary, fontSize: 10 }]}>
                                                {reply.like_count}
                                              </Text>
                                            )}
                                          </TouchableOpacity>
                                          
                                          <TouchableOpacity 
                                            onPress={() => {
                                              setReplyToCommentId(reply.id);
                                              setReplyToUsername(replyUsername);
                                              setCommentText(`@${replyUsername} `);
                                            }}
                                            style={styles.fullVideoCommentAction}
                                          >
                                            <Ionicons name="chatbubble-outline" size={12} color={colors.textSecondary} />
                                            <Text style={[styles.fullVideoCommentActionText, { color: colors.textSecondary, fontSize: 10 }]}>
                                              Reply
                                            </Text>
                                          </TouchableOpacity>
                                          
                                          {isReplyOwn && (
                                            <TouchableOpacity 
                                              onPress={() => handleDeleteComment(reply.id)}
                                              style={styles.fullVideoCommentAction}
                                            >
                                              <Ionicons name="trash-outline" size={12} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                          )}
                                        </View>
                                      </View>
                                    </View>
                                  );
                                })}
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })
                  )}
              </View>
              
              <View style={{ height: 100 }} />
            </View>
          </ScrollView>
          
          {replyToCommentId && (
            <View style={[styles.fullVideoReplyingBar, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.fullVideoReplyingText, { color: colors.textSecondary }]}>
                Replying to @{replyToUsername}
              </Text>
              <TouchableOpacity onPress={() => {
                setReplyToCommentId(null);
                setReplyToUsername('');
                setCommentText('');
              }}>
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={[styles.fullVideoCommentInput, { borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.fullVideoInput, { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text
              }]}
              placeholder={replyToCommentId ? "Write a reply..." : "Add a comment..."}
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.fullVideoSendButton, { 
                backgroundColor: commentText.trim() ? colors.primary : colors.textSecondary + '40'
              }]}
              onPress={handleCommentSubmit}
              disabled={!commentText.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ==================== VIDEO GRID ITEM ====================
const VideoGridItem = memo(({ item, onPress, onOptionsPress, colors, isPlaying }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <Pressable 
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => onPress(item)}
      style={[
        styles.videoGridItem,
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
        style={styles.videoGridPlayer}
        colors={colors}
      />
      
      {/* ADD THREE-DOT MENU BUTTON */}
      <TouchableOpacity 
        style={styles.videoGridMenuButton}
        onPress={() => onOptionsPress && onOptionsPress(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
      </TouchableOpacity>
      
      {item.like_count > 0 && (
        <View style={styles.videoLikeOverlay}>
          <Ionicons name="heart" size={12} color="#fff" />
          <Text style={styles.videoLikeText}>{formatViews(item.like_count)}</Text>
        </View>
      )}
    </Pressable>
  );
});

// ==================== MAIN SCREEN ====================
// ==================== MAIN SCREEN ====================
const ManagePostsScreen = () => {
  const { colors, isDark } = useTheme(); 
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('tweets');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 500,
  });

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




 
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const openPostDetail = (item, type) => {
    setSelectedPost(item);
    setSelectedPostType(type);
    setBottomSheetVisible(true);
  };

  const closePostDetail = () => {
    setBottomSheetVisible(false);
    setSelectedPost(null);
    setSelectedPostType(null);
  };

  
  const handlePostUpdate = (postId, updates) => {
    const updateList = (list) => 
      list.map(post => post.id === postId ? { ...post, ...updates } : post);
    
    if (selectedTab === 'marketplace') {
      setMarketplacePosts(updateList(marketplacePosts));
    } else if (selectedTab === 'tweets') {
      setTweets(updateList(tweets));
    } else {
      setUserVideos(updateList(userVideos));
    }
  };

  const fetchMarketplace = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const res = await axios.get(`${API_ROUTE}/my-listings/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      if (isMounted.current) {
        setMarketplacePosts(res.data || []);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching marketplace posts:', error);
        if (isMounted.current) {
          setMarketplacePosts([]);
        }
      }
    }
  }, []);

  const fetchTweets = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const res = await axios.get(`${API_ROUTE}/my-posts/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      if (isMounted.current) {
        setTweets(res.data || []);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching tweets:', error);
        if (isMounted.current) {
          setTweets([]);
        }
      }
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      console.log('fetch videooooooo', res.data)
      
      if (isMounted.current) {
        const videos = res.data || [];
        const sortedVideos = videos.sort((a, b) => 
          (b.hot_score || 0) - (a.hot_score || 0)
        );
        setUserVideos(sortedVideos);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching videos:', error);
        if (isMounted.current) {
          setUserVideos([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMarketplace(),
          fetchTweets(),
          fetchVideos()
        ]);
      } catch (error) {
        console.error('Error fetching all data:', error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchAllData();
  }, [fetchMarketplace, fetchTweets, fetchVideos]);

  
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          await fetchMarketplace();
          await fetchTweets();
          await fetchVideos();
        } catch (error) {
          console.error('Error refreshing data:', error);
        }
      };
      
      refreshData();
      
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }, [fetchMarketplace, fetchTweets, fetchVideos])
  );

  const confirmDelete = (type, id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => handleDelete(type, id),
          style: "destructive"
        }
      ]
    );
  };

  const handleDelete = async (type, id) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      let endpoint = '';
      if (type === 'marketplace') {
        endpoint = `${API_ROUTE}/my-listings/${id}/`;
      } else if (type === 'tweets') {
        endpoint = `${API_ROUTE}/my-posts/${id}/`;
      } else {
        endpoint = `${API_ROUTE}/my-shorts/${id}/`;
      }

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the appropriate list
      if (type === 'marketplace') {
        await fetchMarketplace();
      } else if (type === 'tweets') {
        await fetchTweets();
      } else {
        await fetchVideos();
      }
      
      Alert.alert("Success", "Item deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
      console.error('Delete error:', error);
    }
    toggleModal();
  };

  const toggleModal = (item = null) => {
    setSelectedItem(item);
    if (item) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  };

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
      <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        You haven't posted anything yet. Create your first post and start sharing!
      </Text>
    </View>
  );

  const currentData = () => {
    switch(selectedTab) {
      case 'marketplace': return marketplacePosts;
      case 'tweets': return tweets;
      case 'videos': return userVideos;
      default: return [];
    }
  };

  // Get number of columns based on selected tab
  const getNumColumns = () => {
    return selectedTab === 'videos' ? 2 : 3;
  };

  const getFlatListKey = () => {
    return `${selectedTab}-${getNumColumns()}`;
  };

  // Render different grid items based on type
  const renderGridItem = ({ item }) => {
    if (selectedTab === 'videos') {
      return (
        <VideoGridItem
          item={item}
          onPress={() => openPostDetail(item, selectedTab)}
          colors={colors}
          isPlaying={playingVideoId === item.id}
        />
      );
    } else {
      const getImageUrl = () => {
        if (selectedTab === 'marketplace') {
          return item.images?.[0]?.image;
        } else {
          return item.image_url;
        }
      };
      
      const imageUrl = getImageUrl();
      
      return (
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => openPostDetail(item, selectedTab)}
          style={styles.gridItem}
        >
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.gridImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.gridPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="document-text" size={30} color={colors.textSecondary} />
            </View>
          )}
          
          {item.like_count > 0 && (
            <View style={styles.reactionBadge}>
              <Ionicons name="heart" size={12} color="#fff" />
              <Text style={styles.reactionBadgeText}>
                {item.like_count > 999 ? `${(item.like_count / 1000).toFixed(1)}K` : item.like_count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Posts</Text>
        <View style={styles.headerRight} />
      </View>

    
      <View style={[styles.tabContainer, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('tweets');
            setPlayingVideoId(null); 
          }} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('marketplace');
            setPlayingVideoId(null); 
          }} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Listings
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('videos');
          }} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Shorts
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your posts...</Text>
        </View>
      ) : currentData().length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          key={getFlatListKey()} 
          data={currentData()}
          renderItem={renderGridItem}
          keyExtractor={(item) => `${selectedTab}-${item.id.toString()}`}
          numColumns={getNumColumns()}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={9}
          maxToRenderPerBatch={12}
          windowSize={10}
          columnWrapperStyle={selectedTab === 'videos' ? styles.videoGridRow : styles.gridRow}
          viewabilityConfigCallbackPairs={
            selectedTab === 'videos' ? viewabilityConfigCallbackPairs.current : undefined
          }
          removeClippedSubviews={Platform.OS === 'android'}
          onEndReachedThreshold={0.5}
        />
      )}

      {/* Full Video Modal for Shorts */}
      {selectedTab === 'videos' && selectedPost && (
        <FullVideoModal
          visible={bottomSheetVisible}
          video={selectedPost}
          onClose={closePostDetail}
          colors={colors}
          navigation={navigation}
        />
      )}

      {/* Post Detail Bottom Sheet for Images */}
      {selectedTab !== 'videos' && (
        <PostDetailBottomSheet
          visible={bottomSheetVisible}
          post={selectedPost}
          onClose={closePostDetail}
          onPostUpdate={handlePostUpdate}
          type={selectedPostType}
          colors={colors}
          navigation={navigation}
        />
      )}

      {/* Bottom Sheet Modal for Delete */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => toggleModal()}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={() => toggleModal()}
          />
          
          <Animated.View 
            style={[
              styles.modalContainer,
              { 
                backgroundColor: colors.card,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => {
                if (selectedItem) {
                  confirmDelete(selectedTab, selectedItem.id);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={24} color="#e74c3c" />
              <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => toggleModal()}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  
  // Grid Styles
  gridContainer: {
    padding: 2,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 12) / 3,
    height: (width - 12) / 3,
    margin: 2,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoGridMenuButton: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 15,
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},
  reactionBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  
  // Video Grid Styles
  videoGridItem: {
    width: (width - 12) / 2,
    height: 250,
    margin: 2,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
  },
  videoGridPlayer: {
    flex: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
  },
  videoViewsOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoViewsText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  videoLikeOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoLikeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Video Player Styles
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
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
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },

  
  videoGridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  
  gridRow: {
    justifyContent: 'space-between',
  },
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheetBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  bottomSheetHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  bottomSheetContent: {
    paddingBottom: 20,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  postPrice: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  mediaImage: {
    width: width,
    height: 300,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 20,
  },
  statsText: {
    fontSize: 13,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
  },
  commentsSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentItem: {
    marginBottom: 16,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTimestamp: {
    fontSize: 11,
  },
  commentDeleteButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
  },
  repliesSection: {
    marginTop: 8,
  },
  noComments: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  replyingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  replyingText: {
    fontSize: 12,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    alignItems: 'flex-end',
    gap: 12,
    backgroundColor: 'transparent',
  },
  commentInput: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 80,
    fontSize: 14,
  },
  postCommentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Full Video Modal Styles
  fullVideoOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullVideoBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullVideoContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.95,
  },
  fullVideoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  fullVideoCloseButton: {
    padding: 8,
  },
  fullVideoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  fullVideoContent: {
    paddingBottom: 20,
  },
  fullVideoPlayerWrapper: {
    width: width,
    height: 400,
    backgroundColor: '#000',
  },
  fullVideoPlayerTouchable: {
    flex: 1,
    position: 'relative',
  },
  fullVideoPlayer: {
    width: '100%',
    height: '100%',
  },
  fullVideoHeaderUser: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  flex: 1,
  marginHorizontal: 12,
},
fullVideoHeaderUsername: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  flex: 1,
},
fullVideoShareButton: {
  padding: 8,
},
  fullVideoLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullVideoError: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullVideoErrorText: {
    color: '#fff',
    marginTop: 10,
  },
  fullVideoControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  fullVideoPlayPause: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  fullVideoProgressContainer: {
    marginBottom: 10,
  },
  fullVideoProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  fullVideoProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  fullVideoTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  fullVideoTimeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  fullVideoMute: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
  },
  fullVideoInfoSection: {
    padding: 16,
  },
  fullVideoUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  fullVideoAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  fullVideoUserText: {
    flex: 1,
  },
  fullVideoUsername: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  fullVideoStats: {
    fontSize: 12,
  },
  fullVideoCaption: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  fullVideoActions: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  fullVideoActionButton: {
    alignItems: 'center',
    gap: 4,
  },
  fullVideoActionText: {
    fontSize: 12,
  },
  fullVideoCommentsSection: {
    marginTop: 8,
  },
  fullVideoCommentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  fullVideoNoComments: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  fullVideoCommentItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fullVideoCommentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  fullVideoCommentContent: {
    flex: 1,
  },
  fullVideoCommentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  fullVideoCommentUsername: {
    fontSize: 14,
    fontWeight: '600',
  },
  fullVideoCommentTime: {
    fontSize: 11,
  },
  fullVideoCommentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  fullVideoCommentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  fullVideoCommentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fullVideoCommentActionText: {
    fontSize: 12,
  },
  fullVideoReplyingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  fullVideoReplyingText: {
    fontSize: 12,
  },
  fullVideoCommentInput: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    alignItems: 'flex-end',
    gap: 12,
  },
  fullVideoInput: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 80,
    fontSize: 14,
  },
  fullVideoSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 26,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default ManagePostsScreen;