


// import React, { useEffect, useRef, useState, useCallback, memo, useFocus, useMemo} from 'react';
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
//   BackHandler ,
//   StatusBar,
//   RefreshControl,
//   ImageBackground,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Video from 'react-native-video';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createMMKV } from 'react-native-mmkv';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { Snackbar } from 'react-native-paper';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import BottomNav from '../components/BottomSocialNav';
// import Share from 'react-native-share';
// import videoBackgroundfetch from '../src/services/VideoBackgroundFetch';
// import { AppState } from 'react-native';
// import { useTheme } from '../src/context/ThemeContext'; 

// const videoPlaceholder = require('../assets/images/dad.jpg');

// const { height, width } = Dimensions.get('window');
// const API_URL = `${API_ROUTE}`;

// //============ MMKV storage instance ================================

// const storage = createMMKV({ id: 'short-feed-cache' });

// //============ Cache keys ===========================================
// const SHORTS_CACHE_KEY = 'cached_shorts_v2';
// const COMMENTS_CACHE_KEY_PREFIX = 'cached_comments_';
// const CACHE_DURATION = 10 * 60 * 1000; 

// const getBottomSafeArea = () => {
//   if (Platform.OS === 'ios') {
//     return 34;
//   }
//   return 46;
// };

// const BOTTOM_SAFE_AREA = getBottomSafeArea();

// const getBottomContentHeight = () => {
//   if (height < 700) return 80;
//   if (height < 800) return 100;
//   return 120;
// };

// const BOTTOM_CONTENT_HEIGHT = getBottomContentHeight();

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

// // OPTIMIZATION 1: Ultra-fast video URL optimization with Cloudinary
// const getOptimizedVideoUrl = (videoUrl) => {
//   if (!videoUrl || !videoUrl.includes('cloudinary')) return videoUrl;
  
//   return videoUrl
//     .replace('/upload/', '/upload/f_mp4,q_auto:low,fl_animated,fl_progressive/')
//     .replace(/\.[^/.]+$/, '.mp4');
// };

// const getVideoThumbnail = (videoUrl, width = 300, height = 500) => {
//   if (!videoUrl || !videoUrl.includes('cloudinary')) {
//     return null;
//   }
  
//   try {
//     const [base, path] = videoUrl.split('/upload/');
//     if (!path) return null;
    
//     const versionMatch = path.match(/^(v\d+)/);
//     if (!versionMatch) return null;
    
//     const version = versionMatch[1];
//     const afterVersion = path.substring(version.length + 1);
//     const lastSlashIndex = afterVersion.lastIndexOf('/');
    
//     let folder = '';
//     let filename = afterVersion;
    
//     if (lastSlashIndex !== -1) {
//       folder = afterVersion.substring(0, lastSlashIndex);
//       filename = afterVersion.substring(lastSlashIndex + 1);
//     }
    
//     const publicId = filename.replace('.mp4', '');
    
//     return `${base}/image/upload/${version}/w_${width},h_${height},c_fill,f_jpg,q_auto${folder ? '/' + folder : ''}/${publicId}.jpg`;
//   } catch (error) {
//     console.log('Thumbnail generation failed, using placeholder');
//     return null;
//   }
// };

// // VideoPreloader component
// const VideoPreloader = memo(({ uri, onLoad, onError }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (!uri) return;
    
//     if (videoRef.current) {
//       videoRef.current.seek(0);
//     }
//   }, [uri]);

//   return (
//     <Video
//       ref={videoRef}
//       source={{ uri }}
//       style={{ width: 0, height: 0, opacity: 0 }}
//       paused={true}
//       muted={true}
//       resizeMode="cover"
//       onLoad={onLoad}
//       onError={onError}
//       ignoreSilentSwitch="ignore"
//       playInBackground={false}
//       playWhenInactive={false}
//       bufferConfig={{
//         minBufferMs: 0,
//         maxBufferMs: 2000,
//         bufferForPlaybackMs: 0,
//         bufferForPlaybackAfterRebufferMs: 0,
//       }}
//     />
//   );
// });

// // ProgressiveVideo component
// const ProgressiveVideo = memo(({ uri, videoId, isActive, onLoad, onError, isMuted = false }) => {
//   const [videoSource, setVideoSource] = useState(uri);
//   const [usePoster, setUsePoster] = useState(true);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [thumbnailError, setThumbnailError] = useState(false);
//   const videoRef = useRef(null);
//   const mountedRef = useRef(true);

//   useEffect(() => {
//     mountedRef.current = true;
    
//     const checkCache = async () => {
//       const cachedPath = await videoPrefetchService.getOptimizedVideoUrl(videoId, uri);
//       if (mountedRef.current) {
//         setVideoSource(cachedPath);
//       }
//     };
    
//     if (videoId) {
//       checkCache();
//     }
    
//     return () => {
//       mountedRef.current = false;
//       if (videoRef.current) {
//         videoRef.current.seek(0);
//         videoRef.current = null;
//       }
//     };
//   }, [videoId, uri]);

//   const thumbnail = useMemo(() => {
//     return getVideoThumbnail(uri);
//   }, [uri]);

//   return (
//     <View style={StyleSheet.absoluteFill}>
//       {usePoster && (
//         <Image
//           source={thumbnailError || !thumbnail ? videoPlaceholder : { uri: thumbnail }}
//           style={[StyleSheet.absoluteFill, { backgroundColor: '#1a1a1a' }]}
//           resizeMode="cover"
//           onError={() => setThumbnailError(true)}
//         />
//       )}
      
//       <Video
//         ref={videoRef}
//         source={{ uri: videoSource }}
//         style={StyleSheet.absoluteFill}
//         resizeMode="cover"
//         repeat={true}
//         paused={!isActive}
//         muted={isMuted}
//         volume={isMuted ? 0 : 1.0}
//         playInBackground={false}
//         playWhenInactive={false}
//         ignoreSilentSwitch="ignore"
//         onLoad={() => {
//           if (mountedRef.current) {
//             setUsePoster(false);
//             setIsBuffering(false);
//             onLoad?.();
//           }
//         }}
//         onError={onError}
//         onBuffer={({ isBuffering: buffering }) => {
//           if (mountedRef.current) {
//             setIsBuffering(buffering);
//           }
//         }}
//       />
      
//       {isBuffering && isActive && (
//         <View style={styles.miniBufferingOverlay}>
//           <ActivityIndicator size="small" color="#fff" />
//         </View>
//       )}
//     </View>
//   );
// });

// // SearchVideoThumbnail component
// const SearchVideoThumbnail = memo(({ videoUrl, username, caption, onPress, colors }) => {
//   const [isLoading, setIsLoading] = useState(true);

//   return (
//     <TouchableOpacity 
//       activeOpacity={0.7}
//       onPress={onPress}
//       style={[styles.searchResultItem, { backgroundColor: colors.surface || '#1a1a1a' }]}
//     >
//       <View style={styles.videoThumbnailContainer}>
//         <Image
//           source={{ uri: getVideoThumbnail(videoUrl) }}
//           style={StyleSheet.absoluteFill}
//           resizeMode="cover"
//           onLoad={() => setIsLoading(false)}
//         />
        
//         {isLoading && (
//           <View style={styles.videoLoadingOverlay}>
//             <ActivityIndicator size="small" color="#DC143C" />
//           </View>
//         )}
        
//         <View style={styles.playIconOverlay} pointerEvents="none">
//           <View style={styles.playIconCircle}>
//             <MaterialIcons name="play-arrow" size={24} color="#fff" />
//           </View>
//         </View>
        
//         <View style={[styles.searchInfoOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]} pointerEvents="none">
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
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   justifyContent: 'flex-end',
//   paddingHorizontal: 16,
//   paddingBottom: 140, // Extra padding to clear bottom nav
//   backgroundColor: 'rgba(0,0,0,0.2)',
// },
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
//   width: '80%',
//   marginBottom: BOTTOM_SAFE_AREA + 70, // Increased margin to avoid bottom nav
//   marginTop: 0, // Remove negative margin
//   position: 'absolute',
//   bottom: 120, // Position it above the bottom nav
//   left: 16,
//   zIndex: 5,
// },
// caption: {
//   color: '#fff',
//   fontSize: 14,
//   fontWeight: '500',
//   lineHeight: 18,
//   textShadowColor: 'rgba(0,0,0,0.5)',
//   textShadowOffset: { width: 0, height: 1 },
//   textShadowRadius: 4,
// },
// bottomContentContainer: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'flex-end',
//   width: '100%',
// },
// leftContent: {
//   flex: 1,
//   marginRight: 12,
// },
// captionContainer: {
//   width: '100%',
//   marginBottom: 8,
// },
// caption: {
//   color: '#fff',
//   fontSize: 14,
//   fontWeight: '500',
//   lineHeight: 18,
//   textShadowColor: 'rgba(0,0,0,0.5)',
//   textShadowOffset: { width: 0, height: 1 },
//   textShadowRadius: 4,
// },
// rightActions: {
//   alignItems: 'center',
//   gap: 16,
//   marginBottom: 4,
//   paddingRight: 4,
// },
  
//   navBarWrapper: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 1000,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   navBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingTop: Platform.OS === 'ios' ? 50 : 0,
//   },
//   navBarAndroid: {
//     paddingTop: 10,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     flex: 1,
//     justifyContent: 'center',
//   },
//   navItem: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     marginHorizontal: 4,
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
//     alignItems: 'center',
//   },
//   headerIcon: {
//     padding: 4,
//     marginLeft: 4,
//   },
  
//   placeholderImage: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: '#1a1a1a',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderIcon: {
//     width: 50,
//     height: 50,
//     tintColor: '#666',
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
//     backgroundColor: '#1b14dc',
//     borderRadius: 25,
//   },
//   refreshButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
  
//   miniBufferingOverlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -15 }, { translateY: -15 }],
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 30,
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 5,
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
  
//   videoThumbnailContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   videoLoadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0)',
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
//   emptyMuteButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//     zIndex: 10,
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
  
//   // Comment Modal Styles - Dark Theme
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'flex-end',
//   },
//   commentModal: {
//     backgroundColor: '#1a1a1a',
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
//     borderBottomColor: '#333',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   modalCloseBtn: {
//     padding: 8,
//   },
//   sortDropdown: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 90 : 70,
//     right: 16,
//     backgroundColor: '#1f2937',
//     borderRadius: 12,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 1000,
//     minWidth: 160,
//   },
//   sortOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   sortOptionActive: {
//     backgroundColor: 'rgba(220, 20, 60, 0.2)',
//   },
//   // Add after the 'caption' style
// pauseOverlay: {
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   zIndex: 10,
// },
// pauseIconContainer: {
//   width: 80,
//   height: 80,
//   borderRadius: 40,
//   backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   justifyContent: 'center',
//   alignItems: 'center',
//   borderWidth: 2,
//   borderColor: 'rgba(255, 255, 255, 0.3)',
// },
//   sortOptionText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   sortOptionTextActive: {
//     color: '#DC143C',
//     fontWeight: '600',
//   },
//   commentsList: {
//     padding: 16,
//     paddingBottom: 20,
//   },
//   commentContainer: {
//     marginBottom: 16,
//     backgroundColor: '#2a2a2a',
//     borderRadius: 12,
//     padding: 12,
//   },
//   replyContainer: {
//     marginLeft: 20,
//     marginTop: 8,
//     backgroundColor: '#222',
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
//     color: '#fff',
//   },
//   commentTime: {
//     fontSize: 11,
//     color: '#888',
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
//     color: '#888',
//     marginLeft: 4,
//   },
//   commentText: {
//     fontSize: 14,
//     color: '#e0e0e0',
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
//     borderTopColor: '#333',
//     backgroundColor: '#1a1a1a',
//     paddingBottom: Platform.OS === 'ios' ? 20 : 10,
//   },
//   replyingToBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#222',
//   },
//   replyingToText: {
//     fontSize: 12,
//     color: '#888',
//   },
//   commentInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   commentInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#fff',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: '#2a2a2a',
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
//     backgroundColor: '#555',
//   },
//   volumeButton: {
//     marginBottom: 16,
//   },
//   noCommentsContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   noCommentsText: {
//     fontSize: 16,
//     color: '#888',
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
//   // ==================== THEME ====================
//   const { colors, theme, isDark } = useTheme(); // Add theme context
  
//   // ==================== STATE ====================
//   const [shorts, setShorts] = useState([]);
//   const [filteredShorts, setFilteredShorts] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   // const [pausedVideos, setPausedVideos] = useState({});
//   const [isCurrentPaused, setIsCurrentPaused] = useState(false);
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
//   const [mutedVideos, setMutedVideos] = useState({});
  
//   // Search modal
//   const [isSearchModalVisible, setSearchModalVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [emptyVideoMuted, setEmptyVideoMuted] = useState(true);
  
//   // Video optimization
//   const [preloadedVideos, setPreloadedVideos] = useState({});
//   const [bufferedVideos, setBufferedVideos] = useState({});
//   const videoRefs = useRef({});
//   const flatListRef = useRef();
//   const preloaderRef = useRef({});
//   const prevOrderSignatureRef = useRef('');
  
//   const [sortBy, setSortBy] = useState('trending');
//   const [showSortOptions, setShowSortOptions] = useState(false);
  
//   // Animations
//   const fadeAnimEmpty = useRef(new Animated.Value(0)).current;
//   const scaleAnimEmpty = useRef(new Animated.Value(0.8)).current;


//   const [currentUserId, setCurrentUserId] = useState(null);

// useEffect(() => {
//   const loadCurrentUser = async () => {
//     const json = await AsyncStorage.getItem('userData');
//     const parsed = json ? JSON.parse(json) : null;
//     setCurrentUserId(parsed?.id ?? null);
//   };
//   loadCurrentUser();
// }, []);

//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       // if (nextAppState === 'background' || nextAppState === 'inactive') {
//       //   if (filteredShorts.length > 0) {
//       //     const pausedState = {};
//       //     filteredShorts.forEach((_, index) => {
//       //       pausedState[index] = true;
//       //     });
//       //     setPausedVideos(pausedState);
//       //   }
        
//       //   Object.values(videoRefs.current).forEach(videoRef => {
//       //     if (videoRef && videoRef.seek) {
//       //       videoRef.seek(0);
//       //     }
//       //   });
//       // }
//       if (nextAppState === 'background' || nextAppState === 'inactive') {
//   setIsCurrentPaused(true);
//   Object.values(videoRefs.current).forEach(videoRef => {
//     if (videoRef && videoRef.seek) videoRef.seek(0);
//   });
// }
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, [filteredShorts]);

//   useEffect(() => {
//     const stopAllVideos = () => {
//   Object.keys(videoRefs.current).forEach(key => {
//     if (videoRefs.current[key]) {
//       videoRefs.current[key].seek(0);
//       videoRefs.current[key] = null;
//     }
//   });
//   setIsCurrentPaused(true);
// };


//     const appStateListener = AppState.addEventListener('change', (nextAppState) => {
//       if (nextAppState.match(/inactive|background/)) {
//         stopAllVideos();
//       }
//     });

//     return () => {
//       stopAllVideos();
//       appStateListener.remove();
      
//       Object.keys(videoRefs.current).forEach(key => {
//         if (videoRefs.current[key]) {
//           videoRefs.current[key] = null;
//         }
//       });
//     };
//   }, [filteredShorts]);

//   const toggleMute = useCallback((videoId) => {
//     setMutedVideos(prev => ({
//       ...prev,
//       [videoId]: !prev[videoId]
//     }));
//   }, []);

//   const preloadNextVideos = useCallback((startIndex) => {
//     const videosToPreload = filteredShorts.slice(
//       startIndex + 1,
//       startIndex + 4
//     );
    
//     videosToPreload.forEach(video => {
//       if (video?.video && !preloadedVideos[video.id]) {
//         if (video.video_thumbnail) {
//           Image.prefetch(video.video_thumbnail);
//         }
        
//         setPreloadedVideos(prev => ({
//           ...prev,
//           [video.id]: true,
//         }));
//       }
//     });
//   }, [filteredShorts, preloadedVideos]);

//   // Handle navigation events
//   useEffect(() => {
//     const pauseAllVideos = () => setIsCurrentPaused(true);

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       pauseAllVideos();
//       navigation.goBack();
//       return true;
//     });

//     const unsubscribeBlur = navigation.addListener('blur', () => {
//       pauseAllVideos();
//     });

//     const unsubscribeFocus = navigation.addListener('focus', () => {
//   setIsCurrentPaused(false);
// });

//     return () => {
//       backHandler.remove();
//       unsubscribeBlur();
//       unsubscribeFocus();
      
//       Object.keys(videoRefs.current).forEach(key => {
//         if (videoRefs.current[key]) {
//           videoRefs.current[key] = null;
//         }
//       });
//     };
//   }, [navigation, filteredShorts, currentIndex]);

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

//   // useEffect(() => {
//   //   if (!shorts || shorts.length === 0) {
//   //     setFilteredShorts([]);
//   //     return;
//   //   }
    
//   //   let filtered = [];
    
//   //   if (activeTab === 'forYou') {
//   //     filtered = applySort([...shorts], sortBy);
//   //   } else {
//   //     filtered = shorts.filter(short => followedUserIds.includes(short.user?.id));
//   //     filtered = applySort(filtered, sortBy);
//   //   }
    
//   //   setFilteredShorts(filtered);
    
//   //   if (filtered.length > 0) {
//   //     const initialPausedState = {};
//   //     filtered.forEach((_, index) => {
//   //       initialPausedState[index] = index !== 0;
//   //     });
//   //     setPausedVideos(initialPausedState);
      
//   //     preloadNextVideos(0);
      
//   //     const currentVideoStillExists = filtered.some(short => short.id === shorts[currentIndex]?.id);
//   //     if (!currentVideoStillExists) {
//   //       setCurrentIndex(0);
//   //     }
//   //   }
//   // }, [activeTab, shorts, followedUserIds, sortBy]);

//  useEffect(() => {
//   if (!shorts || shorts.length === 0) {
//     setFilteredShorts([]);
//     return;
//   }

//   let filtered = activeTab === 'forYou'
//     ? applySort([...shorts], sortBy)
//     : applySort(shorts.filter(s => followedUserIds.includes(s.user?.id)), sortBy);

//   setFilteredShorts(filtered);

//   if (filtered.length > 0) {
//     preloadNextVideos(currentIndex);
//     const currentVideoStillExists = filtered.some(short => short.id === shorts[currentIndex]?.id);
//     if (!currentVideoStillExists) {
//       setCurrentIndex(0);
//       setIsCurrentPaused(false);
//     }
//   }
// }, [activeTab, shorts, followedUserIds, sortBy]);


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

//   // ============ MMKV cache helpers (replaces AsyncStorage cache) ============
//   // MMKV is fully synchronous, so these no longer need to await anything.
//   // They stay as regular functions (not async) since there's no I/O to wait on,
//   // but existing call sites that `await` them keep working fine.
//   const getCachedShorts = () => {
//     try {
//       const cached = storage.getString(SHORTS_CACHE_KEY);
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

//   const setCachedShorts = (data) => {
//     try {
//       storage.set(
//         SHORTS_CACHE_KEY,
//         JSON.stringify({ data, timestamp: Date.now() })
//       );
//     } catch (error) {
//       console.error('Error saving shorts cache:', error);
//     }
//   };

//   const getCachedComments = (shortId) => {
//     try {
//       const cached = storage.getString(`${COMMENTS_CACHE_KEY_PREFIX}${shortId}`);
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

//   const setCachedComments = (shortId, data) => {
//     try {
//       storage.set(
//         `${COMMENTS_CACHE_KEY_PREFIX}${shortId}`,
//         JSON.stringify({ data, timestamp: Date.now() })
//       );
//     } catch (error) {
//       console.error('Error saving comments cache:', error);
//     }
//   };

//   const handleVideoLoad = useCallback((videoId) => {
//     setBufferedVideos(prev => ({
//       ...prev,
//       [videoId]: true,
//     }));
//   }, []);

//   const handleVideoError = useCallback((videoId, error) => {
//     console.log(`Video ${videoId} error:`, error);
//   }, []);

//   const getBufferConfig = (platform) => {
//     return {
//       minBufferMs: 0,
//       maxBufferMs: 1000,
//       bufferForPlaybackMs: 0,
//       bufferForPlaybackAfterRebufferMs: 0,
//     };
//   };

//   const initializeVideoStates = (data) => {
//     const initialPausedState = {};
//     data.forEach((_, index) => {
//       initialPausedState[index] = index !== 0;
//     });
//    // setPausedVideos(initialPausedState);
//   };

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
//       preloadNextVideos(currentIndex);
//     }
//   }, [filteredShorts, currentIndex]);

//   const fetchComments = useCallback(async (shortId, page = 1, isLoadMore = false) => {
//     if (loadingComments || (!commentsHasMore && isLoadMore)) return;
    
//     setLoadingComments(true);
//     try {
//       if (page === 1) {
//         const cachedComments = getCachedComments(shortId);
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
//           setCachedComments(shortId, commentsWithOwn);
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
        
//         setShorts(prevShorts =>
//           prevShorts.map(short =>
//             short.id === shortId
//               ? {
//                   ...short,
//                   comment_count: (short.comment_count || 0) + 1
//                 }
//               : short
//           )
//         );
        
//         setFilteredShorts(prevShorts =>
//           prevShorts.map(short =>
//             short.id === shortId
//               ? {
//                   ...short,
//                   comment_count: (short.comment_count || 0) + 1
//                 }
//               : short
//           )
//         );
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
      
//       setShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === shortId
//             ? {
//                 ...short,
//                 comment_count: Math.max(0, (short.comment_count || 0) - 1)
//               }
//             : short
//         )
//       );
      
//       setFilteredShorts(prevShorts =>
//         prevShorts.map(short =>
//           short.id === shortId
//             ? {
//                 ...short,
//                 comment_count: Math.max(0, (short.comment_count || 0) - 1)
//               }
//             : short
//         )
//       );
      
//       Alert.alert('Error', 'Failed to post comment. Please try again.');
//       throw error;
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   }, [selectedShort]);

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
//       const targetInShorts = shorts.find(short => short.id === id);
//       const targetInFiltered = filteredShorts.find(short => short.id === id);
      
//       if (!targetInShorts) return;
      
//       const wasLiked = targetInShorts.is_liked || false;
//       const newLikeCount = wasLiked 
//         ? targetInShorts.like_count - 1 
//         : targetInShorts.like_count + 1;

//       const updatedShorts = shorts.map(short => 
//         short.id === id 
//           ? { 
//               ...short, 
//               is_liked: !wasLiked, 
//               like_count: newLikeCount 
//             } 
//           : short
//       );
      
//       let updatedFilteredShorts;
      
//       if (activeTab === 'forYou') {
//         updatedFilteredShorts = filteredShorts.map(short => 
//           short.id === id 
//             ? { 
//                 ...short, 
//                 is_liked: !wasLiked, 
//                 like_count: newLikeCount 
//               } 
//             : short
//         );
//       } else {
//         updatedFilteredShorts = filteredShorts.map(short => 
//           short.id === id 
//             ? { 
//                 ...short, 
//                 is_liked: !wasLiked, 
//                 like_count: newLikeCount 
//               } 
//             : short
//         );
//       }

//       setShorts(updatedShorts);
//       setFilteredShorts(updatedFilteredShorts);

//       const headers = await getAuthHeader();
//       await axios.post(`${API_URL}/shorts/${id}/like/`, {}, { headers });

//     } catch (error) {
//       console.error('Like Error:', error);
//       await fetchShorts(1, true);
//       Alert.alert('Error', 'Failed to like video. Please try again.');
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

//   const shareShort = async (id, videoUrl, caption) => {
//     try {
//       const deepLinkUrl = `showa://short/${id}`;
//       const webUrl = `https://showapp.ng/short/${id}`;
      
//       const shareOptions = {
//         title: 'Check out this short video! on Showa',
//         message: `${caption || 'Watch this amazing short video'}\n\n${webUrl}`,
//         url: webUrl,
//       };
      
//       await Share.open(shareOptions);
      
//       const headers = await getAuthHeader();
//       await axios.post(`${API_ROUTE}/shorts/${id}/share/`, { shared_to: 'external' }, { headers });
      
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

//   // const onViewableItemsChanged = useRef(({ viewableItems }) => {
//   //   if (viewableItems.length > 0) {
//   //     const newIndex = viewableItems[0].index;
      
//   //     setCurrentIndex(newIndex);
      
//   //     setPausedVideos(prev => {
//   //       const newState = {};
//   //       filteredShorts.forEach((_, index) => {
//   //         newState[index] = index !== newIndex;
//   //       });
//   //       return newState;
//   //     });
      
//   //     preloadNextVideos(newIndex);
//   //   }
//   // }).current;

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//   if (viewableItems.length > 0) {
//     const newIndex = viewableItems[0].index;
//     setCurrentIndex(newIndex);
//     setIsCurrentPaused(false); // always autoplay the newly-focused video
//     preloadNextVideos(newIndex);
//   }
// }).current;

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 10,
//   }).current;

//   // ============ Render NavBar with SafeAreaView ============
//   const renderNavBar = () => (
//     <View style={styles.navBarWrapper}>
//       <SafeAreaView 
//         style={[
//           styles.navBar,
//           Platform.OS === 'android' && styles.navBarAndroid
//         ]}
//         edges={['top']}
//       >
//         <View style={styles.tabsContainer}>
//           <TouchableOpacity 
//             style={[styles.navItem, activeTab === 'forYou' && styles.activeNavItem]}
//             onPress={() => setActiveTab('forYou')}
//             activeOpacity={0.7}
//           >
//             <Text style={[styles.navText, activeTab === 'forYou' && styles.activeNavText]}>For You</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.navItem, activeTab === 'following' && styles.activeNavItem]}
//             onPress={() => setActiveTab('following')}
//             activeOpacity={0.7}
//           >
//             <Text style={[styles.navText, activeTab === 'following' && styles.activeNavText]}>Following</Text>
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.headerRight}>
//           <TouchableOpacity 
//             style={styles.headerIcon}
//             onPress={() => setShowSortOptions(!showSortOptions)}
//             activeOpacity={0.7}
//           >
//             <Icon name="bar-chart-2" size={22} color="#fff" />
//           </TouchableOpacity>
          
//           {/* <TouchableOpacity 
//             style={styles.headerIcon}
//             onPress={() => {
//               setPausedVideos(prev => ({ ...prev, [currentIndex]: true }));
//               setSearchModalVisible(true);
//             }}
//             activeOpacity={0.7}
//           >
//             <Icon name="search" size={22} color="#fff" />
//           </TouchableOpacity> */}
          
//           <TouchableOpacity 
//             style={styles.headerIcon}
//             onPress={() => navigation.navigate('UploadshortVideo')}
//             activeOpacity={0.7}
//           >
//             <Icon name="plus" size={26} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {showSortOptions && (
//           <View style={styles.sortDropdown}>
//             <TouchableOpacity 
//               style={[styles.sortOption, sortBy === 'trending' && styles.sortOptionActive]}
//               onPress={() => {
//                 setSortBy('trending');
//                 setShowSortOptions(false);
//                 sortVideos('trending');
//               }}
//             >
//               <Icon name="trending-up" size={16} color={sortBy === 'trending' ? '#DC143C' : '#fff'} />
//               <Text style={[styles.sortOptionText, sortBy === 'trending' && styles.sortOptionTextActive]}>Trending</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.sortOption, sortBy === 'most_liked' && styles.sortOptionActive]}
//               onPress={() => {
//                 setSortBy('most_liked');
//                 setShowSortOptions(false);
//                 sortVideos('most_liked');
//               }}
//             >
//               <Icon name="heart" size={16} color={sortBy === 'most_liked' ? '#DC143C' : '#fff'} />
//               <Text style={[styles.sortOptionText, sortBy === 'most_liked' && styles.sortOptionTextActive]}>Most Liked</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.sortOption, sortBy === 'most_commented' && styles.sortOptionActive]}
//               onPress={() => {
//                 setSortBy('most_commented');
//                 setShowSortOptions(false);
//                 sortVideos('most_commented');
//               }}
//             >
//               <Icon name="message-circle" size={16} color={sortBy === 'most_commented' ? '#DC143C' : '#fff'} />
//               <Text style={[styles.sortOptionText, sortBy === 'most_commented' && styles.sortOptionTextActive]}>Most Commented</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.sortOption, sortBy === 'latest' && styles.sortOptionActive]}
//               onPress={() => {
//                 setSortBy('latest');
//                 setShowSortOptions(false);
//                 sortVideos('latest');
//               }}
//             >
//               <Icon name="clock" size={16} color={sortBy === 'latest' ? '#DC143C' : '#fff'} />
//               <Text style={[styles.sortOptionText, sortBy === 'latest' && styles.sortOptionTextActive]}>Latest</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </SafeAreaView>
//     </View>
//   );

//   const sortVideos = (sortType) => {
//     let sorted = [...shorts];
    
//     switch(sortType) {
//       case 'most_liked':
//         sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
//         break;
        
//       case 'most_commented':
//         sorted.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
//         break;
        
//       case 'latest':
//         sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//         break;
        
//       case 'trending':
//       default:
//         sorted.sort((a, b) => {
//           const scoreA = calculateTrendingScore(a);
//           const scoreB = calculateTrendingScore(b);
//           return scoreB - scoreA;
//         });
//         break;
//     }
    
//     setFilteredShorts(sorted);
    
//     const initialPausedState = {};
//     sorted.forEach((_, index) => {
//       initialPausedState[index] = index !== 0;
//     });
//     //setPausedVideos(initialPausedState);
//     setCurrentIndex(0);
    
//     if (flatListRef.current) {
//       flatListRef.current.scrollToOffset({ offset: 0, animated: true });
//     }
//   };

//   const calculateTrendingScore = (video) => {
//     const likes = video.like_count || 0;
//     const comments = video.comment_count || 0;
    
//     const createdAt = new Date(video.created_at || Date.now());
//     const ageInHours = (Date.now() - createdAt) / (1000 * 60 * 60);
//     const recencyScore = Math.max(0, 100 / (ageInHours + 1));
    
//     return (likes * 0.4) + (comments * 0.3) + (recencyScore * 0.3);
//   };

//   const fetchShorts = useCallback(async (pageNum = 1, isRefreshing = false) => {
//     if (loadingShorts || (!shortsHasMore && !isRefreshing)) {
//       return;
//     }
    
//     setLoadingShorts(true);
//     try {
//       if (pageNum === 1 && !isRefreshing) {
//         const cachedVideos = await videoBackgroundfetch.getCachedVideos();
//         if (cachedVideos && cachedVideos.length > 0) {
//           console.log('📦 Using cached videos:', cachedVideos.length);
//           setShorts(cachedVideos);
//           const sortedShorts = applySort(cachedVideos, sortBy);
//           setFilteredShorts(sortedShorts);
//           initializeVideoStates(sortedShorts);
//         }
//       }
     
//       const headers = await getAuthHeader();
//       const endpoint = `${API_URL}/shorts/`;
      
//       const params = {
//         page: pageNum,
//         page_size: 5
//       };
      
//       if (sortBy === 'most_liked') {
//         params.ordering = '-like_count';
//       } else if (sortBy === 'most_commented') {
//         params.ordering = '-comment_count';
//       } else if (sortBy === 'latest') {
//         params.ordering = '-created_at';
//       } else if (sortBy === 'trending') {
//         params.ordering = '-hot_score';
//       }
      
//       const response = await axios.get(endpoint, { 
//         headers,
//         params
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
          
//           return {
//             ...short,
//             video: videoUrl,
//             video_mp4: getOptimizedVideoUrl(videoUrl),
//             video_thumbnail: getVideoThumbnail(videoUrl),
//             like_count: short.like_count || 0,
//             comment_count: short.comment_count || 0,
//             created_at: short.created_at || new Date().toISOString(),
//           };
//         });

//         if (isRefreshing || pageNum === 1) {
//           setShorts(processedShorts);
//           const sortedShorts = applySort(processedShorts, sortBy);
//           setFilteredShorts(sortedShorts);
//           initializeVideoStates(sortedShorts);
          
//           setCachedShorts(processedShorts);
          
//           setTimeout(() => {
//             videoBackgroundfetch.prefetchVideos(true);
//           }, 1000);
          
//         } else {
//           setShorts(prev => {
//             const combined = [...(prev || []), ...processedShorts];
//             const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
//             return unique;
//           });
          
//           setFilteredShorts(prev => {
//             const combined = [...(prev || []), ...processedShorts];
//             const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
//             return applySort(unique, sortBy);
//           });
          
//           setTimeout(() => {
//             videoPrefetchService.prefetchVideos(true);
//           }, 1000);
//         }
        
//         if (!isRefreshing) {
//           setShortsPage(pageNum + 1);
//         }
        
//         if (processedShorts.length > 0) {
//           preloadNextVideos(0);
//         }
//       }
//     } catch (error) {
//       console.error('Fetch Shorts Error:', error.message);
//     } finally {
//       setLoadingShorts(false);
//       setRefreshing(false);
//     }
//   }, [activeTab, shortsPage, shortsHasMore, loadingShorts, sortBy]);

//   const applySort = (videos, sortType) => {
//     if (!videos || videos.length === 0) return [];
    
//     const videosCopy = videos.map(video => ({ ...video }));
    
//     try {
//       switch(sortType) {
//         case 'most_liked':
//           return videosCopy.sort((a, b) => {
//             const likeA = a.like_count || 0;
//             const likeB = b.like_count || 0;
//             return likeB - likeA;
//           });
          
//         case 'most_commented':
//           return videosCopy.sort((a, b) => {
//             const commentA = a.comment_count || 0;
//             const commentB = b.comment_count || 0;
//             return commentB - commentA;
//           });
          
//         case 'latest':
//           return videosCopy.sort((a, b) => {
//             const dateA = new Date(a.created_at || 0).getTime();
//             const dateB = new Date(b.created_at || 0).getTime();
//             return dateB - dateA;
//           });
          
//         case 'trending':
//         default:
//           return videosCopy.sort((a, b) => {
//             const scoreA = calculateTrendingScore(a);
//             const scoreB = calculateTrendingScore(b);
//             return scoreB - scoreA;
//           });
//       }
//     } catch (error) {
//       console.error('Error sorting videos:', error);
//       return videosCopy;
//     }
//   };


// const renderItem = useCallback(({ item, index }) => {
//   // if (!item || !item.id) {
//   //   return null;
//   // }
  
//   // const isCurrent = index === currentIndex;
//   // const isPaused = pausedVideos[index] || false;
//   // const isBuffered = bufferedVideos[item.id] || false;
//   // const isMuted = mutedVideos[item.id] || false;

//   // const toggleVideoPause = () => {
//   //   if (isCurrent) {
//   //     setPausedVideos(prev => ({
//   //       ...prev,
//   //       [index]: !prev[index],
//   //     }));
//   //   }
//   // };

//   if (!item || !item.id) return null;

//   const isCurrent = index === currentIndex;
//   const isPaused = isCurrent && isCurrentPaused;   // only meaningful for current item
//   const isBuffered = bufferedVideos[item.id] || false;
//   const isMuted = mutedVideos[item.id] || false;

//   const toggleVideoPause = () => {
//     if (isCurrent) {
//       setIsCurrentPaused(prev => !prev);
//     }
//   };

//   return (
//     // <TouchableOpacity
//     //   activeOpacity={1}
//     //   style={styles.card}
//     //   onPress={toggleVideoPause}
//     // >
//     //   <ProgressiveVideo
//     //     uri={getOptimizedVideoUrl(item.video)}
//     //     videoId={item.id}
//     //     isActive={isCurrent && !isPaused}
//     //     onLoad={() => handleVideoLoad(item.id)}
//     //     onError={(error) => handleVideoError(item.id, error)}
//     //     isMuted={isMuted}
//     //   />

//     <TouchableOpacity activeOpacity={1} style={styles.card} onPress={toggleVideoPause}>
//       <ProgressiveVideo
//         uri={getOptimizedVideoUrl(item.video)}
//         videoId={item.id}
//         isActive={isCurrent && !isCurrentPaused}
//         onLoad={() => handleVideoLoad(item.id)}
//         onError={(error) => handleVideoError(item.id, error)}
//         isMuted={isMuted}
//       />

//       {filteredShorts[index + 1] && (
//         <VideoPreloader
//           uri={getOptimizedVideoUrl(filteredShorts[index + 1]?.video)}
//           onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
//           onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
//         />
//       )}

//       {isCurrent && isPaused && (
//         <View style={styles.pauseOverlay}>
//           <View style={styles.pauseIconContainer}>
//             <Ionicons name="play" size={60} color="#fff" />
//           </View>
//         </View>
//       )}

//       <View style={styles.overlay}>
//         {/* Bottom content container */}
//         <View style={styles.bottomContentContainer}>
//           {/* Left side: Caption */}
//           <View style={styles.leftContent}>
//             {item.caption && (
//               <View style={styles.captionContainer}>
//                 <Text style={styles.caption} numberOfLines={2}>
//                   {item.caption}
//                 </Text>
//               </View>
//             )}
//           </View>

//           {/* Right side: Action buttons */}
//           <View style={styles.rightActions}>
//             {activeTab === 'forYou' && item.user?.id !== currentUserId && (
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
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   }, [currentIndex, isCurrentPaused, activeTab, bufferedVideos, filteredShorts, mutedVideos, currentUserId]);
 


//   const CommentItem = memo(({ 
//     comment, 
//     onLike, 
//     onReply, 
//     onDelete,
//     onLoadReplies,
//     expanded,
//     onToggleExpand,
//     level = 0,
//     onReplyPress,
//     colors // Pass theme colors
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
//                 color={localLiked ? '#DC143C' : '#888'}
//               />
//               <Text style={[styles.commentLikeCount, { color: '#888' }]}>{localLikeCount}</Text>
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
//                 colors={colors}
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
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left']}>
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
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={1}
//         updateCellsBatchingPeriod={50}
//         windowSize={2}
//         initialNumToRender={1}
//         contentContainerStyle={styles.flatListContent}
//         decelerationRate="fast"
//         snapToAlignment="start"
//         snapToInterval={height}
//         disableIntervalMomentum={true}
//         scrollEventThrottle={16}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         getItemLayout={(data, index) => ({
//           length: height,
//           offset: height * index,
//           index,
//         })}
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
//           <View style={styles.emptyContainer}>
//             <Video
//               source={require('../assets/images/Download.mp4')} 
//               style={StyleSheet.absoluteFill}
//               resizeMode="cover"
//               repeat={true}
//               paused={false}
//               muted={emptyVideoMuted}
//               volume={emptyVideoMuted ? 0 : 1.0}
//               ignoreSilentSwitch="ignore"
//             />
            
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
              
//               {activeTab === 'following' && (
//                 <TouchableOpacity 
//                   style={styles.refreshButton}
//                   onPress={() => setActiveTab('forYou')}
//                 >
//                   <Text style={styles.refreshButtonText}>Explore For You</Text>
//                 </TouchableOpacity>
//               )}
              
//               {!loadingShorts && activeTab === 'forYou' && (
//                 <TouchableOpacity 
//                   style={styles.refreshButton}
//                   onPress={() => fetchShorts(1, true)}
//                 >
//                   <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         }
//       />

//       {/* Comments Modal - Dark Theme */}
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
//             <View style={[styles.commentModal, { backgroundColor: colors.surface || '#1a1a1a' }]}>
//               <View style={[styles.modalHeader, { borderBottomColor: colors.border || '#333' }]}>
//                 <Text style={[styles.modalTitle, { color: colors.text || '#fff' }]}>
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
//                   <Ionicons name="close" size={28} color={colors.text || '#fff'} />
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
//                     colors={colors}
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
//                     <Text style={[styles.noCommentsText, { color: colors.textTertiary || '#888' }]}>
//                       {loadingComments ? 'Loading comments...' : 'No comments yet'}
//                     </Text>
//                   </View>
//                 }
//                 contentContainerStyle={styles.commentsList}
//                 keyboardShouldPersistTaps="handled"
//               />

//               <View style={[styles.commentInputWrapper, { borderTopColor: colors.border || '#333', backgroundColor: colors.surface || '#1a1a1a' }]}>
//                 {replyToComment && (
//                   <View style={[styles.replyingToBar, { backgroundColor: colors.background || '#222' }]}>
//                     <Text style={[styles.replyingToText, { color: colors.textTertiary || '#888' }]}>
//                       Replying to @{replyToComment.user?.name || 'user'}
//                     </Text>
//                     <TouchableOpacity 
//                       onPress={() => {
//                         setReplyToComment(null);
//                         setCommentText('');
//                       }}
//                     >
//                       <Ionicons name="close" size={20} color={colors.textTertiary || '#888'} />
//                     </TouchableOpacity>
//                   </View>
//                 )}
                
//                 <View style={styles.commentInputContainer}>
//                   <TextInput
//                     placeholder={replyToComment ? "Write a reply..." : "Add a comment..."}
//                     placeholderTextColor={colors.textTertiary || '#888'}
//                     value={commentText}
//                     onChangeText={setCommentText}
//                     style={[styles.commentInput, { 
//                       color: colors.text || '#fff',
//                       backgroundColor: colors.background || '#2a2a2a'
//                     }]}
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

//       {/* Search Modal - Dark Theme */}
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
//         <SafeAreaView style={[styles.searchModalContainer, { backgroundColor: colors.background || '#1a1a1a' }]}>
//           <View style={[styles.searchModalHeader, { 
//             backgroundColor: colors.surface || '#1a1a1a',
//             borderBottomColor: colors.border || '#333'
//           }]}>
//             <View style={[styles.searchInputContainer, { 
//               backgroundColor: colors.background || '#2a2a2a',
//               marginTop: 30 
//             }]}>
//               <Icon name="search" size={22} color={colors.textTertiary || '#6b7280'} style={styles.searchIcon} />
//               <TextInput
//                 placeholder="Search videos or creators..."
//                 placeholderTextColor={colors.textTertiary || '#6b7280'}
//                 value={searchQuery}
//                 onChangeText={handleSearch}
//                 style={[styles.searchModalInput, { color: colors.text || '#fff' }]}
//                 autoFocus
//                 autoCapitalize="none"
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity 
//                   onPress={() => setSearchQuery('')}
//                   style={styles.clearSearchButton}
//                 >
//                   <Ionicons name="close-circle" size={22} color={colors.textTertiary || '#6b7280'} />
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
//               <Text style={[styles.cancelText, { color: colors.text || '#111827' }]}>Cancel</Text>
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
//                 colors={colors}
//               />
//             )}
//             ListEmptyComponent={
//               <View style={styles.searchEmptyContainer}>
//                 <Icon name="search" size={50} color={colors.textTertiary || '#ccc'} />
//                 <Text style={[styles.searchEmptyText, { color: colors.textTertiary || '#6b7280' }]}>
//                   {searchQuery ? 'No videos found' : 'Search for videos or creators'}
//                 </Text>
//               </View>
//             }
//             contentContainerStyle={styles.searchResultsList}
//             showsVerticalScrollIndicator={false}
//           />
//         </SafeAreaView>
//       </Modal>
// <BottomNav navigation={navigation} activeRoute="ShortFeed" /> 
//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//         style={[styles.snackbar, { backgroundColor: colors.surface || '#080808ff' }]}
//       >
//         <Text style={[styles.snackbarText, { color: colors.text || '#fff' }]}>{snackbarMessage}</Text>
//       </Snackbar>
//     </SafeAreaView>
//   );
// };

// export default ShortFeedScreen;


import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
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
  BackHandler,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import BottomNav from '../components/BottomSocialNav';
import { Share } from 'react-native';
import videoBackgroundfetch from '../src/services/VideoBackgroundFetch';
import { AppState } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import AdInterstitial from '../showa_business/ads/AdInterstitial';
import IncomingCallHandler from '../components/Incomingcallhandler';


const videoPlaceholder = require('../assets/images/dad.jpg');

const { height, width } = Dimensions.get('window');
const API_URL = `${API_ROUTE}`;

//============ MMKV storage instance ================================

const storage = createMMKV({ id: 'short-feed-cache' });

//============ Cache keys ===========================================
const SHORTS_CACHE_KEY = 'cached_shorts_v2';
const COMMENTS_CACHE_KEY_PREFIX = 'cached_comments_';
const CACHE_DURATION = 10 * 60 * 1000;

const getBottomSafeArea = () => {
  if (Platform.OS === 'ios') {
    return 34;
  }
  return 46;
};

const BOTTOM_SAFE_AREA = getBottomSafeArea();

const getBottomContentHeight = () => {
  if (height < 700) return 80;
  if (height < 800) return 100;
  return 120;
};

const BOTTOM_CONTENT_HEIGHT = getBottomContentHeight();

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

// OPTIMIZATION 1: Ultra-fast video URL optimization with Cloudinary
const getOptimizedVideoUrl = (videoUrl) => {
  if (!videoUrl || !videoUrl.includes('cloudinary')) return videoUrl;

  return videoUrl
    .replace('/upload/', '/upload/f_mp4,q_auto:low,fl_animated,fl_progressive/')
    .replace(/\.[^/.]+$/, '.mp4');
};

const getVideoThumbnail = (videoUrl, width = 300, height = 500) => {
  if (!videoUrl || !videoUrl.includes('cloudinary')) {
    return null;
  }

  try {
    const [base, path] = videoUrl.split('/upload/');
    if (!path) return null;

    const versionMatch = path.match(/^(v\d+)/);
    if (!versionMatch) return null;

    const version = versionMatch[1];
    const afterVersion = path.substring(version.length + 1);
    const lastSlashIndex = afterVersion.lastIndexOf('/');

    let folder = '';
    let filename = afterVersion;

    if (lastSlashIndex !== -1) {
      folder = afterVersion.substring(0, lastSlashIndex);
      filename = afterVersion.substring(lastSlashIndex + 1);
    }

    const publicId = filename.replace('.mp4', '');

    return `${base}/image/upload/${version}/w_${width},h_${height},c_fill,f_jpg,q_auto${folder ? '/' + folder : ''}/${publicId}.jpg`;
  } catch (error) {
    console.log('Thumbnail generation failed, using placeholder');
    return null;
  }
};

// VideoPreloader component
const VideoPreloader = memo(({ uri, onLoad, onError }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!uri) return;

    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [uri]);

  return (
    <Video
      ref={videoRef}
      source={{ uri }}
      style={{ width: 0, height: 0, opacity: 0 }}
      paused={true}
      muted={true}
      resizeMode="cover"
      onLoad={onLoad}
      onError={onError}
      ignoreSilentSwitch="ignore"
      playInBackground={false}
      playWhenInactive={false}
      bufferConfig={{
        minBufferMs: 0,
        maxBufferMs: 2000,
        bufferForPlaybackMs: 0,
        bufferForPlaybackAfterRebufferMs: 0,
      }}
    />
  );
});

// ProgressiveVideo component
const ProgressiveVideo = memo(({ uri, videoId, isActive, onLoad, onError, isMuted = false }) => {
  const [videoSource, setVideoSource] = useState(uri);
  const [usePoster, setUsePoster] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const videoRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const checkCache = async () => {
      const cachedPath = await videoBackgroundfetch.getOptimizedVideoUrl(videoId, uri);
      if (mountedRef.current) {
        setVideoSource(cachedPath);
      }
    };

    if (videoId) {
      checkCache();
    }

    return () => {
      mountedRef.current = false;
      if (videoRef.current) {
        videoRef.current.seek(0);
        videoRef.current = null;
      }
    };
  }, [videoId, uri]);

  const thumbnail = useMemo(() => {
    return getVideoThumbnail(uri);
  }, [uri]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {usePoster && (
        <Image
          source={thumbnailError || !thumbnail ? videoPlaceholder : { uri: thumbnail }}
          style={[StyleSheet.absoluteFill, { backgroundColor: '#1a1a1a' }]}
          resizeMode="cover"
          onError={() => setThumbnailError(true)}
        />
      )}

      <Video
        ref={videoRef}
        source={{ uri: videoSource }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        repeat={true}
        paused={!isActive}
        muted={isMuted}
        volume={isMuted ? 0 : 1.0}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        onLoad={() => {
          if (mountedRef.current) {
            setUsePoster(false);
            setIsBuffering(false);
            onLoad?.();
          }
        }}
        onError={onError}
        onBuffer={({ isBuffering: buffering }) => {
          if (mountedRef.current) {
            setIsBuffering(buffering);
          }
        }}
      />

      {isBuffering && isActive && (
        <View style={styles.miniBufferingOverlay}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
    </View>
  );
});

// SearchVideoThumbnail component
const SearchVideoThumbnail = memo(({ videoUrl, username, caption, onPress, colors }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.searchResultItem, { backgroundColor: colors.surface || '#1a1a1a' }]}
    >
      <View style={styles.videoThumbnailContainer}>
        <Image
          source={{ uri: getVideoThumbnail(videoUrl) }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onLoad={() => setIsLoading(false)}
        />

        {isLoading && (
          <View style={styles.videoLoadingOverlay}>
            <ActivityIndicator size="small" color="#DC143C" />
          </View>
        )}

        <View style={styles.playIconOverlay} pointerEvents="none">
          <View style={styles.playIconCircle}>
            <MaterialIcons name="play-arrow" size={24} color="#fff" />
          </View>
        </View>

        <View style={[styles.searchInfoOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]} pointerEvents="none">
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
    paddingHorizontal: 16,
    paddingBottom: 140,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
  bottomContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  captionContainer: {
    width: '100%',
    marginBottom: 8,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  rightActions: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
    paddingRight: 4,
  },

  navBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  navBarAndroid: {
    paddingTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  navItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
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
    alignItems: 'center',
  },
  headerIcon: {
    padding: 4,
    marginLeft: 4,
  },

  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 50,
    height: 50,
    tintColor: '#666',
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
    backgroundColor: '#1b14dc',
    borderRadius: 25,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  miniBufferingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
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

  searchResultItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 9 / 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  videoThumbnailContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
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
  emptyMuteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
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

  // Comment Modal Styles - Dark Theme
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  commentModal: {
    backgroundColor: '#1a1a1a',
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
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  modalCloseBtn: {
    padding: 8,
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
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  pauseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  commentsList: {
    padding: 16,
    paddingBottom: 20,
  },
  commentContainer: {
    marginBottom: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
  },
  replyContainer: {
    marginLeft: 20,
    marginTop: 8,
    backgroundColor: '#222',
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
    color: '#fff',
  },
  commentTime: {
    fontSize: 11,
    color: '#888',
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
    color: '#888',
    marginLeft: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#e0e0e0',
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
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  replyingToBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#222',
  },
  replyingToText: {
    fontSize: 12,
    color: '#888',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#2a2a2a',
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
    backgroundColor: '#555',
  },
  volumeButton: {
    marginBottom: 16,
  },
  noCommentsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#888',
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
  // ==================== THEME ====================
  const { colors, theme, isDark } = useTheme();

  // ==================== STATE ====================
  const [shorts, setShorts] = useState([]);
  const [filteredShorts, setFilteredShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Playback pause state is a SINGLE boolean tied to "the video currently in
  // view", not a per-index map. This is what makes it immune to list
  // reorders/refreshes caused by likes, comments, follows, etc.
  const [isCurrentPaused, setIsCurrentPaused] = useState(false);

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
  const [mutedVideos, setMutedVideos] = useState({});

  // Search modal
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emptyVideoMuted, setEmptyVideoMuted] = useState(true);

  // Video optimization
  const [preloadedVideos, setPreloadedVideos] = useState({});
  const [bufferedVideos, setBufferedVideos] = useState({});
  const videoRefs = useRef({});
  const flatListRef = useRef();
  const preloaderRef = useRef({});


  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const shortsWatchedSinceAdRef = useRef(0);
  const AD_FREQUENCY = 5;

  // Signature of (tab + sortBy + set-of-ids) used to decide whether the
  // feed genuinely needs to be re-sorted/rebuilt, vs. just patching fields
  // (like_count, is_liked, is_following, comment_count) on existing items.
  const prevSignatureRef = useRef('');
  // Id of whatever video is currently in view, so that if a real re-sort
  // does happen we can keep watching the same video instead of snapping
  // back to index 0.
  const currentItemIdRef = useRef(null);

  const [sortBy, setSortBy] = useState('trending');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Logged-in user id, used to hide the Follow button on your own videos
  const [currentUserId, setCurrentUserId] = useState(null);

  // Animations
  const fadeAnimEmpty = useRef(new Animated.Value(0)).current;
  const scaleAnimEmpty = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const loadCurrentUser = async () => {
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;
      setCurrentUserId(parsed?.id ?? null);
    };
    loadCurrentUser();
  }, []);

  // Keep a ref of "which video am I currently watching" in sync
  useEffect(() => {
    currentItemIdRef.current = filteredShorts[currentIndex]?.id ?? null;
  }, [filteredShorts, currentIndex]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setIsCurrentPaused(true);
        Object.values(videoRefs.current).forEach((videoRef) => {
          if (videoRef && videoRef.seek) videoRef.seek(0);
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const stopAllVideos = () => {
      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key]) {
          videoRefs.current[key].seek(0);
          videoRefs.current[key] = null;
        }
      });
      setIsCurrentPaused(true);
    };

    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        stopAllVideos();
      }
    });

    return () => {
      stopAllVideos();
      appStateListener.remove();

      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key]) {
          videoRefs.current[key] = null;
        }
      });
    };
  }, []);

  const toggleMute = useCallback((videoId) => {
    setMutedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  }, []);

  const preloadNextVideos = useCallback(
    (startIndex) => {
      const videosToPreload = filteredShorts.slice(startIndex + 1, startIndex + 4);

      videosToPreload.forEach((video) => {
        if (video?.video && !preloadedVideos[video.id]) {
          if (video.video_thumbnail) {
            Image.prefetch(video.video_thumbnail);
          }

          setPreloadedVideos((prev) => ({
            ...prev,
            [video.id]: true,
          }));
        }
      });
    },
    [filteredShorts, preloadedVideos]
  );

  // Handle navigation events
  useEffect(() => {
    const pauseAllVideos = () => setIsCurrentPaused(true);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      pauseAllVideos();
      navigation.goBack();
      return true;
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      pauseAllVideos();
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      setIsCurrentPaused(false);
    });

    return () => {
      backHandler.remove();
      unsubscribeBlur();
      unsubscribeFocus();

      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key]) {
          videoRefs.current[key] = null;
        }
      });
    };
  }, [navigation]);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/followed-users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const ids = response.data.map((user) => user.id);
          setFollowedUserIds(ids);
        }
      } catch (error) {
        console.error('Error fetching followed users:', error);
      }
    };

    fetchFollowedUsers();
  }, []);

  const calculateTrendingScore = (video) => {
    const likes = video.like_count || 0;
    const comments = video.comment_count || 0;

    const createdAt = new Date(video.created_at || Date.now());
    const ageInHours = (Date.now() - createdAt) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 100 / (ageInHours + 1));

    return likes * 0.4 + comments * 0.3 + recencyScore * 0.3;
  };

  const applySort = (videos, sortType) => {
    if (!videos || videos.length === 0) return [];

    const videosCopy = videos.map((video) => ({ ...video }));

    try {
      switch (sortType) {
        case 'most_liked':
          return videosCopy.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));

        case 'most_commented':
          return videosCopy.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));

        case 'latest':
          return videosCopy.sort(
            (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );

        case 'trending':
        default:
          return videosCopy.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
      }
    } catch (error) {
      console.error('Error sorting videos:', error);
      return videosCopy;
    }
  };

  // ============ THE CORE FIX ============
  // This effect decides, on every change to `shorts` / `activeTab` /
  // `followedUserIds` / `sortBy`, whether the feed genuinely needs to be
  // rebuilt (re-filtered + re-sorted), or whether it's just a field-level
  // update (like_count, is_liked, comment_count, is_following) on videos
  // that are already sitting in `filteredShorts`.
  //
  // The signature is built from an ORDER-INDEPENDENT set of ids, so a like
  // changing a trending score (and therefore where a video WOULD sort) does
  // NOT count as a real change. Only an actual addition/removal of videos,
  // or an explicit tab/sort change, triggers a rebuild.
  //
  // Because a plain like/comment/follow never rebuilds the list or touches
  // currentIndex/isCurrentPaused, the currently-playing video is never
  // treated as "not current" and never gets paused.
  useEffect(() => {
    if (!shorts || shorts.length === 0) {
      setFilteredShorts([]);
      return;
    }

    const candidates =
      activeTab === 'forYou'
        ? shorts
        : shorts.filter((s) => followedUserIds.includes(s.user?.id));

    const idsSetKey = candidates
      .map((s) => s.id)
      .slice()
      .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
      .join(',');
    const signature = `${activeTab}|${sortBy}|${idsSetKey}`;
    const needsRebuild = signature !== prevSignatureRef.current;
    prevSignatureRef.current = signature;

    if (needsRebuild) {
      const sorted = applySort(candidates, sortBy);
      setFilteredShorts(sorted);

      const keepId = currentItemIdRef.current;
      const newIndex = keepId != null ? sorted.findIndex((s) => s.id === keepId) : -1;

      if (newIndex !== -1) {
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
        // Same video still exists — don't touch play/pause state.
      } else {
        setCurrentIndex(0);
        setIsCurrentPaused(false);
      }

      preloadNextVideos(newIndex !== -1 ? newIndex : 0);
    } else {
      // Same set of ids, same tab, same sort -> just patch fields in place,
      // preserving the exact order the user is currently scrolled through.
      setFilteredShorts((prev) =>
        prev.map((item) => {
          const updated = candidates.find((s) => s.id === item.id);
          return updated ? { ...item, ...updated } : item;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      profile_picture: parsed?.profile_picture || null,
    };
  };

  // ============ MMKV cache helpers ============
  const getCachedShorts = () => {
    try {
      const cached = storage.getString(SHORTS_CACHE_KEY);
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

  const setCachedShorts = (data) => {
    try {
      storage.set(SHORTS_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (error) {
      console.error('Error saving shorts cache:', error);
    }
  };

  const getCachedComments = (shortId) => {
    try {
      const cached = storage.getString(`${COMMENTS_CACHE_KEY_PREFIX}${shortId}`);
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

  const setCachedComments = (shortId, data) => {
    try {
      storage.set(`${COMMENTS_CACHE_KEY_PREFIX}${shortId}`, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (error) {
      console.error('Error saving comments cache:', error);
    }
  };

  const handleVideoLoad = useCallback((videoId) => {
    setBufferedVideos((prev) => ({
      ...prev,
      [videoId]: true,
    }));
  }, []);

  const handleVideoError = useCallback((videoId, error) => {
    console.log(`Video ${videoId} error:`, error);
  }, []);

  useEffect(() => {
    if (route.params?.newShort) {
      setSnackbarMessage('Short uploaded successfully!');
      setSnackbarVisible(true);
      fetchShorts(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.newShort]);

  useEffect(() => {
    fetchShorts(1);
    setShortsPage(1);
    setShortsHasMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (filteredShorts.length > 0) {
      preloadNextVideos(currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredShorts, currentIndex]);

  const fetchComments = useCallback(
    async (shortId, page = 1, isLoadMore = false) => {
      if (loadingComments || (!commentsHasMore && isLoadMore)) return;

      setLoadingComments(true);
      try {
        if (page === 1) {
          const cachedComments = getCachedComments(shortId);
          if (cachedComments && Array.isArray(cachedComments)) {
            const cachedWithHttps = cachedComments.map((comment) => ({
              ...comment,
              user: {
                ...comment.user,
                profile_picture: getSecureUrl(comment.user?.profile_picture),
              },
              replies:
                comment.replies?.map((reply) => ({
                  ...reply,
                  user: {
                    ...reply.user,
                    profile_picture: getSecureUrl(reply.user?.profile_picture),
                  },
                })) || [],
            }));
            setLocalComments(cachedWithHttps);
          }
        }

        const headers = await getAuthHeader();
        const response = await axios.get(`${API_URL}/shorts/${shortId}/comments/`, {
          headers,
          params: {
            page: page,
            page_size: 20,
          },
        });

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
          const commentsWithOwn = newComments.map((comment) => ({
            ...comment,
            is_own: comment.user?.id === currentUser.id,
            like_count: comment.like_count || 0,
            is_liked: comment.is_liked || false,
            user: {
              ...comment.user,
              profile_picture: getSecureUrl(comment.user?.profile_picture),
            },
            replies:
              comment.replies?.map((reply) => ({
                ...reply,
                is_own: reply.user?.id === currentUser.id,
                like_count: reply.like_count || 0,
                is_liked: reply.is_liked || false,
                user: {
                  ...reply.user,
                  profile_picture: getSecureUrl(reply.user?.profile_picture),
                },
              })) || [],
          }));

          setLocalComments((prev) => {
            if (page === 1) return commentsWithOwn;
            const existingIds = new Set(prev.map((c) => c.id));
            const newUnique = commentsWithOwn.filter((c) => !existingIds.has(c.id));
            return [...prev, ...newUnique];
          });

          if (page === 1) {
            setCachedComments(shortId, commentsWithOwn);
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
    },
    [loadingComments, commentsHasMore]
  );

  const handleReplyPress = (comment) => {
    setReplyToComment(comment);
    setCommentText(`@${comment.user?.name || 'user'} `);
  };

  const fetchCommentReplies = useCallback(async (commentId) => {
    try {
      const headers = await getAuthHeader();
      const response = await axios.get(`${API_URL}/shorts/comments/${commentId}/replies/`, { headers });

      if (response.status === 200) {
        const currentUser = await getCurrentUser();
        return response.data.replies.map((reply) => ({
          ...reply,
          is_own: reply.user?.id === currentUser.id,
          like_count: reply.like_count || 0,
          is_liked: reply.is_liked || false,
          user: {
            ...reply.user,
            profile_picture: getSecureUrl(reply.user?.profile_picture),
          },
        }));
      }
      return [];
    } catch (error) {
      console.error('Fetch Replies Error:', error);
      return [];
    }
  }, []);

  const postComment = useCallback(
    async (shortId, text, parentId = null) => {
      if (!text.trim() || isSubmittingComment) return null;

      setIsSubmittingComment(true);
      try {
        const currentUser = await getCurrentUser();
        const headers = await getAuthHeader();

        const requestData = {
          text: text.trim(),
          ...(parentId && { parent: parentId }),
        };

        const tempId = Date.now();
        const optimisticComment = {
          id: tempId,
          text: text.trim(),
          user: {
            ...currentUser,
            profile_picture: getSecureUrl(currentUser.profile_picture),
          },
          created_at: new Date().toISOString(),
          like_count: 0,
          reply_count: 0,
          is_liked: false,
          is_own: true,
          replies: [],
          parent: parentId,
        };

        if (parentId) {
          setLocalComments((prev) =>
            prev.map((comment) =>
              comment.id === parentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), optimisticComment],
                    reply_count: (comment.reply_count || 0) + 1,
                  }
                : comment
            )
          );
        } else {
          setLocalComments((prev) => [optimisticComment, ...prev]);

          setShorts((prevShorts) =>
            prevShorts.map((short) =>
              short.id === shortId
                ? {
                    ...short,
                    comment_count: (short.comment_count || 0) + 1,
                  }
                : short
            )
          );
        }

        if (selectedShort) {
          setSelectedShort((prev) => ({
            ...prev,
            comment_count: (prev.comment_count || 0) + 1,
          }));
        }

        setCommentText('');
        setReplyToComment(null);

        const response = await axios.post(`${API_URL}/shorts/${shortId}/comment/`, requestData, { headers });

        if (response.data) {
          const realComment = {
            ...response.data,
            is_own: true,
            like_count: 0,
            is_liked: false,
            user: {
              ...currentUser,
              profile_picture: getSecureUrl(currentUser.profile_picture),
            },
          };

          setLocalComments((prev) => {
            if (parentId) {
              return prev.map((comment) =>
                comment.id === parentId
                  ? {
                      ...comment,
                      replies: comment.replies.map((r) => (r.id === tempId ? realComment : r)),
                    }
                  : comment
              );
            } else {
              return prev.map((c) => (c.id === tempId ? realComment : c));
            }
          });
        }

        return response.data;
      } catch (error) {
        console.error('Error posting comment:', error.response?.data || error.message);

        setLocalComments((prev) => prev.filter((c) => c.id !== Date.now()));

        setShorts((prevShorts) =>
          prevShorts.map((short) =>
            short.id === shortId
              ? {
                  ...short,
                  comment_count: Math.max(0, (short.comment_count || 0) - 1),
                }
              : short
          )
        );

        Alert.alert('Error', 'Failed to post comment. Please try again.');
        throw error;
      } finally {
        setIsSubmittingComment(false);
      }
    },
    [selectedShort, isSubmittingComment]
  );

  const likeComment = useCallback(async (commentId, isLiked) => {
    setLocalComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            is_liked: !isLiked,
            like_count: isLiked ? comment.like_count - 1 : comment.like_count + 1,
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    is_liked: !isLiked,
                    like_count: isLiked ? reply.like_count - 1 : reply.like_count + 1,
                  }
                : reply
            ),
          };
        }
        return comment;
      })
    );

    try {
      const headers = await getAuthHeader();
      await axios.post(`${API_URL}/shorts/comments/${commentId}/like/`, {}, { headers });
    } catch (error) {
      console.error('Like Comment Error:', error);
      setLocalComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: isLiked,
              like_count: isLiked ? comment.like_count + 1 : comment.like_count - 1,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      is_liked: isLiked,
                      like_count: isLiked ? reply.like_count + 1 : reply.like_count - 1,
                    }
                  : reply
              ),
            };
          }
          return comment;
        })
      );
    }
  }, []);

  const deleteComment = useCallback(
    async (commentId) => {
      Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
            setLocalComments((prev) =>
              prev.map((comment) => ({
                ...comment,
                replies: comment.replies?.filter((r) => r.id !== commentId) || [],
              }))
            );

            try {
              const headers = await getAuthHeader();
              await axios.delete(`${API_URL}/shorts/comments/${commentId}/delete/`, { headers });

              setSnackbarMessage('Comment deleted');
              setSnackbarVisible(true);
            } catch (error) {
              console.error('Delete Comment Error:', error);
              Alert.alert('Error', 'Failed to delete comment');
              if (selectedShort) {
                fetchComments(selectedShort.id, 1);
              }
            }
          },
        },
      ]);
    },
    [selectedShort, fetchComments]
  );

  // Likes now ONLY patch fields on `shorts`. The filtering/patching effect
  // above will merge these fields into `filteredShorts` in place -- it will
  // NOT reorder the list or touch currentIndex/isCurrentPaused, so the
  // currently-playing video keeps playing uninterrupted.
  const likeShort = async (id) => {
    try {
      const targetInShorts = shorts.find((short) => short.id === id);
      if (!targetInShorts) return;

      const wasLiked = targetInShorts.is_liked || false;
      const newLikeCount = wasLiked ? targetInShorts.like_count - 1 : targetInShorts.like_count + 1;

      const updatedShorts = shorts.map((short) =>
        short.id === id ? { ...short, is_liked: !wasLiked, like_count: newLikeCount } : short
      );

      setShorts(updatedShorts);

      const headers = await getAuthHeader();
      await axios.post(`${API_URL}/shorts/${id}/like/`, {}, { headers });
    } catch (error) {
      console.error('Like Error:', error);
      await fetchShorts(1, true);
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

      const currentShort = shorts.find((short) => short.user?.id === userId);
      const isCurrentlyFollowing = currentShort?.is_following || false;

      setShorts((prevShorts) =>
        prevShorts.map((short) =>
          short.user?.id === userId ? { ...short, is_following: !isCurrentlyFollowing } : short
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

  // const shareShort = async (id, videoUrl, caption) => {
  //   try {
  //     const webUrl = `https://showapp.ng/short/${id}`;

  //     const shareOptions = {
  //       title: 'Check out this short video! on Showa',
  //       message: `${caption || 'Watch this amazing short video'}\n\n${webUrl}`,
  //       url: webUrl,
  //     };

  //     await Share.open(shareOptions);

  //     const headers = await getAuthHeader();
  //     await axios.post(`${API_ROUTE}/shorts/${id}/share/`, { shared_to: 'external' }, { headers });

  //     setSnackbarMessage('Shared successfully!');
  //     setSnackbarVisible(true);
  //   } catch (error) {
  //     if (error.message !== 'User did not share') {
  //       console.error('Share Error:', error.message);
  //     }
  //   }
  // };

  const shareShort = useCallback(async (id, videoUrl, caption) => {
  try {
    const short = shorts.find(s => s.id === id);
    
    if (!short && !videoUrl) {
      console.error('Short not found for sharing:', id);
      return;
    }

    const shareUrl = `https://showapp.ng/short/${id}`;

    const cleanCaption = (caption || short?.caption || '')
      .replace(/\s+/g, ' ')
      .trim();

    const preview = cleanCaption.length > 120
      ? `${cleanCaption.substring(0, 120)}…`
      : cleanCaption;

    const username = short?.user?.name || short?.user?.username || 'Someone';

    const shareMessage = `${username} shared a short video on Showa App.

${preview ? `"${preview}"\n\n` : ''}Watch the full video and join the community:

${shareUrl}`;

    // Use react-native's Share
    const result = await Share.share({
      title: `Showa • ${username}'s Short Video`,
      message: shareMessage,
      url: shareUrl,
    });

    if (result.action === Share.sharedAction) {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          await axios.post(
            `${API_ROUTE}/shorts/${id}/share/`,
            { 
              shared_to: 'external',
              platform: result.activityType || 'unknown'
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          // Update share count
          setShorts(prevShorts => 
            prevShorts.map(s => 
              s.id === id 
                ? { ...s, share_count: (s.share_count || 0) + 1 } 
                : s
            )
          );
          
          setFilteredShorts(prevFiltered => 
            prevFiltered.map(s => 
              s.id === id 
                ? { ...s, share_count: (s.share_count || 0) + 1 } 
                : s
            )
          );
        } catch (trackError) {
          console.error('Error tracking short share:', trackError);
        }
      }

      setSnackbarMessage('📤 Shared successfully!');
      setSnackbarVisible(true);
    }
  } catch (error) {
    if (error.message !== 'User did not share') {
      console.error('Share Error:', error);
      setSnackbarMessage('Failed to share. Please try again.');
      setSnackbarVisible(true);
    }
  }
}, [shorts]);

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
      const filtered = shorts.filter(
        (short) =>
          short.caption?.toLowerCase().includes(query.toLowerCase()) ||
          short.user?.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredShorts(filtered);
    }
  };

  const handleSearchResultPress = (item) => {
    setSearchModalVisible(false);
    setSearchQuery('');

    const index = shorts.findIndex((s) => s.id === item.id);
    if (index !== -1 && flatListRef.current) {
      if (isFlatListReady) {
        try {
          flatListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (error) {
          flatListRef.current.scrollToOffset({
            offset: index * height,
            animated: true,
          });
        }
      } else {
        setTimeout(() => {
          if (flatListRef.current) {
            try {
              flatListRef.current.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
              });
            } catch (error) {
              flatListRef.current.scrollToOffset({
                offset: index * height,
                animated: true,
              });
            }
          }
        }, 300);
      }
    }
  };

  // const onViewableItemsChanged = useRef(({ viewableItems }) => {
  //   if (viewableItems.length > 0) {
  //     const newIndex = viewableItems[0].index;
  //     setCurrentIndex(newIndex);
  //     setIsCurrentPaused(false); // always autoplay the newly-focused video
  //     preloadNextVideos(newIndex);
  //   }
  // }).current;

  const handleAdFinish = useCallback(() => {
  setShowAdInterstitial(false);
  setIsCurrentPaused(false);
}, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
  if (viewableItems.length > 0) {
    const newIndex = viewableItems[0].index;

    // Only count forward progress (avoid double-counting on scroll jitter)
    if (newIndex > currentIndex) {
      shortsWatchedSinceAdRef.current += 1;

      if (shortsWatchedSinceAdRef.current >= AD_FREQUENCY) {
        shortsWatchedSinceAdRef.current = 0;
        setIsCurrentPaused(true);
        setShowAdInterstitial(true);
      }
    }

    setCurrentIndex(newIndex);
    if (!showAdInterstitial) {
      setIsCurrentPaused(false);
    }
    preloadNextVideos(newIndex);
  }
}).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 10,
  }).current;

  // ============ Render NavBar with SafeAreaView ============
  const renderNavBar = () => (
    <View style={styles.navBarWrapper}>
      <SafeAreaView
        style={[styles.navBar, Platform.OS === 'android' && styles.navBarAndroid]}
        edges={['top']}
      >
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.navItem, activeTab === 'forYou' && styles.activeNavItem]}
            onPress={() => setActiveTab('forYou')}
            activeOpacity={0.7}
          >
            <Text style={[styles.navText, activeTab === 'forYou' && styles.activeNavText]}>For You</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'following' && styles.activeNavItem]}
            onPress={() => setActiveTab('following')}
            activeOpacity={0.7}
          >
            <Text style={[styles.navText, activeTab === 'following' && styles.activeNavText]}>Following</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => setShowSortOptions(!showSortOptions)}
            activeOpacity={0.7}
          >
            <Icon name="bar-chart-2" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('UploadshortVideo')}
            activeOpacity={0.7}
          >
            <Icon name="plus" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {showSortOptions && (
          <View style={styles.sortDropdown}>
            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'trending' && styles.sortOptionActive]}
              onPress={() => {
                setShowSortOptions(false);
                changeSort('trending');
              }}
            >
              <Icon name="trending-up" size={16} color={sortBy === 'trending' ? '#DC143C' : '#fff'} />
              <Text style={[styles.sortOptionText, sortBy === 'trending' && styles.sortOptionTextActive]}>
                Trending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'most_liked' && styles.sortOptionActive]}
              onPress={() => {
                setShowSortOptions(false);
                changeSort('most_liked');
              }}
            >
              <Icon name="heart" size={16} color={sortBy === 'most_liked' ? '#DC143C' : '#fff'} />
              <Text style={[styles.sortOptionText, sortBy === 'most_liked' && styles.sortOptionTextActive]}>
                Most Liked
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'most_commented' && styles.sortOptionActive]}
              onPress={() => {
                setShowSortOptions(false);
                changeSort('most_commented');
              }}
            >
              <Icon name="message-circle" size={16} color={sortBy === 'most_commented' ? '#DC143C' : '#fff'} />
              <Text style={[styles.sortOptionText, sortBy === 'most_commented' && styles.sortOptionTextActive]}>
                Most Commented
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'latest' && styles.sortOptionActive]}
              onPress={() => {
                setShowSortOptions(false);
                changeSort('latest');
              }}
            >
              <Icon name="clock" size={16} color={sortBy === 'latest' ? '#DC143C' : '#fff'} />
              <Text style={[styles.sortOptionText, sortBy === 'latest' && styles.sortOptionTextActive]}>
                Latest
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );

  // Explicit sort change (user tapped a sort option). This is an
  // intentional "restart the feed from the top" action, so we clear
  // currentItemIdRef first -> the rebuild effect will fall back to index 0.
  const changeSort = (sortType) => {
    currentItemIdRef.current = null;
    setSortBy(sortType);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const fetchShorts = useCallback(
    async (pageNum = 1, isRefreshing = false) => {
      if (loadingShorts || (!shortsHasMore && !isRefreshing)) {
        return;
      }

      setLoadingShorts(true);
      try {
        if (pageNum === 1 && !isRefreshing) {
          const cachedVideos = await videoBackgroundfetch.getCachedVideos();
          if (cachedVideos && cachedVideos.length > 0) {
            console.log('📦 Using cached videos:', cachedVideos.length);
            setShorts(cachedVideos);
          }
        }

        const headers = await getAuthHeader();
        const endpoint = `${API_URL}/shorts/`;

        const params = {
          page: pageNum,
          page_size: 5,
        };

        if (sortBy === 'most_liked') {
          params.ordering = '-like_count';
        } else if (sortBy === 'most_commented') {
          params.ordering = '-comment_count';
        } else if (sortBy === 'latest') {
          params.ordering = '-created_at';
        } else if (sortBy === 'trending') {
          params.ordering = '-hot_score';
        }

        const response = await axios.get(endpoint, {
          headers,
          params,
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

          let processedShorts = newShorts.map((short) => {
            const videoUrl = short.video?.replace(/\/\//g, '/').replace(':/', '://');

            return {
              ...short,
              video: videoUrl,
              video_mp4: getOptimizedVideoUrl(videoUrl),
              video_thumbnail: getVideoThumbnail(videoUrl),
              like_count: short.like_count || 0,
              comment_count: short.comment_count || 0,
              created_at: short.created_at || new Date().toISOString(),
            };
          });

          if (isRefreshing || pageNum === 1) {
            setShorts(processedShorts);
            setCachedShorts(processedShorts);

            setTimeout(() => {
              videoBackgroundfetch.prefetchVideos(true);
            }, 1000);
          } else {
            setShorts((prev) => {
              const combined = [...(prev || []), ...processedShorts];
              const unique = combined.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
              return unique;
            });

            setTimeout(() => {
              videoBackgroundfetch.prefetchVideos(true);
            }, 1000);
          }

          if (!isRefreshing) {
            setShortsPage(pageNum + 1);
          }

          if (processedShorts.length > 0) {
            preloadNextVideos(0);
          }
        }
      } catch (error) {
        console.error('Fetch Shorts Error:', error.message);
      } finally {
        setLoadingShorts(false);
        setRefreshing(false);
      }
    },
    [shortsHasMore, loadingShorts, sortBy]
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      if (!item || !item.id) return null;

      const isCurrent = index === currentIndex;
      const isPaused = isCurrent && isCurrentPaused;
      const isMuted = mutedVideos[item.id] || false;

      const toggleVideoPause = () => {
        if (isCurrent) {
          setIsCurrentPaused((prev) => !prev);
        }
      };

      return (
        <TouchableOpacity activeOpacity={1} style={styles.card} onPress={toggleVideoPause}>
          <ProgressiveVideo
            uri={getOptimizedVideoUrl(item.video)}
            videoId={item.id}
            isActive={isCurrent && !isCurrentPaused}
            onLoad={() => handleVideoLoad(item.id)}
            onError={(error) => handleVideoError(item.id, error)}
            isMuted={isMuted}
          />

          {filteredShorts[index + 1] && (
            <VideoPreloader
              uri={getOptimizedVideoUrl(filteredShorts[index + 1]?.video)}
              onLoad={() => handleVideoLoad(filteredShorts[index + 1].id)}
              onError={(error) => handleVideoError(filteredShorts[index + 1].id, error)}
            />
          )}

          {isCurrent && isPaused && (
            <View style={styles.pauseOverlay}>
              <View style={styles.pauseIconContainer}>
                <Ionicons name="play" size={60} color="#fff" />
              </View>
            </View>
          )}

          <View style={styles.overlay}>
            <View style={styles.bottomContentContainer}>
              {/* Left side: Caption */}
              <View style={styles.leftContent}>
                {item.caption && (
                  <View style={styles.captionContainer}>
                    <Text style={styles.caption} numberOfLines={2}>
                      {item.caption}
                    </Text>
                  </View>
                )}
              </View>

              {/* Right side: Action buttons */}
              <View style={styles.rightActions}>
                {activeTab === 'forYou' && item.user?.id !== currentUserId && (
                  <TouchableOpacity
                    onPress={() => followUser(item.user?.id)}
                    style={[styles.followButton, item.is_following && styles.followingButton]}
                  >
                    <Text style={[styles.followButtonText, item.is_following && styles.followingButtonText]}>
                      {item.is_following ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => likeShort(item.id)} style={styles.iconBtn}>
                  <Ionicons name="heart" size={40} color={item.is_liked ? '#DC143C' : '#fff'} />
                  <Text style={styles.countText}>{item.like_count || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleCommentPress(item)} style={styles.iconBtn}>
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
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [currentIndex, isCurrentPaused, activeTab, filteredShorts, mutedVideos, currentUserId]
  );

  const CommentItem = memo(
    ({ comment, onLike, onReply, onDelete, onLoadReplies, expanded, onToggleExpand, level = 0, onReplyPress, colors }) => {
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
            profile_picture: null,
          };
        }
        return {
          name: comment.user?.name || comment.user?.username || 'User',
          profile_picture: getSecureUrl(comment.user?.profile_picture),
        };
      };

      const user = getUserDisplay();
      const isOwnComment = comment.is_own || false;

      return (
        <View style={[styles.commentContainer, level > 0 && styles.replyContainer]}>
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
                <Text style={styles.commentTime}>{new Date(comment.created_at).toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.commentActions}>
              {isOwnComment && (
                <TouchableOpacity onPress={() => onDelete(comment.id)} style={styles.commentActionBtn}>
                  <Ionicons name="trash-outline" size={18} color="#FF4444" />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleLike} style={styles.commentActionBtn}>
                <Ionicons name={localLiked ? 'heart' : 'heart-outline'} size={18} color={localLiked ? '#DC143C' : '#888'} />
                <Text style={[styles.commentLikeCount, { color: '#888' }]}>{localLikeCount}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.commentText}>{comment.text}</Text>

          <View style={styles.commentFooter}>
            <TouchableOpacity onPress={() => onReplyPress(comment)} style={styles.replyBtn}>
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
              {replies.map((reply) => (
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
                  colors={colors}
                />
              ))}
              {loadingReplies && <ActivityIndicator size="small" color="#DC143C" style={styles.repliesLoader} />}
            </View>
          )}
        </View>
      );
    }
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left']}>
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
        removeClippedSubviews={true}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={50}
        windowSize={2}
        initialNumToRender={1}
        contentContainerStyle={styles.flatListContent}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={height}
        disableIntervalMomentum={true}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5,
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC143C']} tintColor="#fff" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Video
              source={require('../assets/images/Download.mp4')}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              repeat={true}
              paused={false}
              muted={emptyVideoMuted}
              volume={emptyVideoMuted ? 0 : 1.0}
              ignoreSilentSwitch="ignore"
            />

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
                  : loadingShorts
                  ? 'Loading videos...'
                  : 'No videos available'}
              </Animated.Text>

              {activeTab === 'following' && (
                <TouchableOpacity style={styles.refreshButton} onPress={() => setActiveTab('forYou')}>
                  <Text style={styles.refreshButtonText}>Explore For You</Text>
                </TouchableOpacity>
              )}

              {!loadingShorts && activeTab === 'forYou' && (
                <TouchableOpacity style={styles.refreshButton} onPress={() => fetchShorts(1, true)}>
                  <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
      />

      {/* Comments Modal - Dark Theme */}
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
            <View style={[styles.commentModal, { backgroundColor: colors.backgroundSecondary || '#1a1a1a' }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border || '#333' }]}>
                <Text style={[styles.modalTitle, { color: colors.text || '#fff' }]}>
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
                  <Ionicons name="close" size={28} color={colors.text || '#fff'} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={localComments}
                keyExtractor={(item) => `comment-${item.id}`}
                renderItem={({ item }) => (
                  <CommentItem
                    comment={item}
                    onLike={likeComment}
                    onReply={(parentId, text) => postComment(selectedShort.id, text, parentId)}
                    onDelete={deleteComment}
                    onLoadReplies={fetchCommentReplies}
                    expanded={expandedComments[item.id]}
                    onToggleExpand={(id) => setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }))}
                    onReplyPress={handleReplyPress}
                    colors={colors}
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
                    <Text style={[styles.noCommentsText, { color: colors.textTertiary || '#888' }]}>
                      {loadingComments ? 'Loading comments...' : 'No comments yet'}
                    </Text>
                  </View>
                }
                contentContainerStyle={styles.commentsList}
                keyboardShouldPersistTaps="handled"
              />

              <View
                style={[
                  styles.commentInputWrapper,
                  { borderTopColor: colors.border || '#333', backgroundColor: colors.surface || '#1a1a1a' },
                ]}
              >
                {replyToComment && (
                  <View style={[styles.replyingToBar, { backgroundColor: colors.background || '#222' }]}>
                    <Text style={[styles.replyingToText, { color: colors.textTertiary || '#888' }]}>
                      Replying to @{replyToComment.user?.name || 'user'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setReplyToComment(null);
                        setCommentText('');
                      }}
                    >
                      <Ionicons name="close" size={20} color={colors.textTertiary || '#888'} />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.commentInputContainer}>
                  <TextInput
                    placeholder={replyToComment ? 'Write a reply...' : 'Add a comment...'}
                    placeholderTextColor={colors.textTertiary || '#888'}
                    value={commentText}
                    onChangeText={setCommentText}
                    style={[
                      styles.commentInput,
                      { color: colors.text || '#fff', backgroundColor: colors.background || '#2a2a2a' },
                    ]}
                    multiline
                    editable={!isSubmittingComment}
                    returnKeyType="default"
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (commentText.trim() && selectedShort && !isSubmittingComment) {
                        postComment(selectedShort.id, commentText, replyToComment?.id || null);
                      }
                    }}
                    disabled={!commentText.trim() || isSubmittingComment}
                    style={[
                      styles.commentSendBtn,
                      (!commentText.trim() || isSubmittingComment) && styles.commentSendBtnDisabled,
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

      {/* Search Modal - Dark Theme */}
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
        <SafeAreaView style={[styles.searchModalContainer, { backgroundColor: colors.background || '#1a1a1a' }]}>
          <View
            style={[
              styles.searchModalHeader,
              { backgroundColor: colors.surface || '#1a1a1a', borderBottomColor: colors.border || '#333' },
            ]}
          >
            <View
              style={[
                styles.searchInputContainer,
                { backgroundColor: colors.background || '#2a2a2a', marginTop: 30 },
              ]}
            >
              <Icon name="search" size={22} color={colors.textTertiary || '#6b7280'} style={styles.searchIcon} />
              <TextInput
                placeholder="Search videos or creators..."
                placeholderTextColor={colors.textTertiary || '#6b7280'}
                value={searchQuery}
                onChangeText={handleSearch}
                style={[styles.searchModalInput, { color: colors.text || '#fff' }]}
                autoFocus
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                  <Ionicons name="close-circle" size={22} color={colors.textTertiary || '#6b7280'} />
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
              <Text style={[styles.cancelText, { color: colors.text || '#111827' }]}>Cancel</Text>
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
                colors={colors}
              />
            )}
            ListEmptyComponent={
              <View style={styles.searchEmptyContainer}>
                <Icon name="search" size={50} color={colors.textTertiary || '#ccc'} />
                <Text style={[styles.searchEmptyText, { color: colors.textTertiary || '#6b7280' }]}>
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
        style={[styles.snackbar, { backgroundColor: colors.surface || '#080808ff' }]}
      >
        <Text style={[styles.snackbarText, { color: colors.text || '#fff' }]}>{snackbarMessage}</Text>
      </Snackbar>
      <AdInterstitial visible={showAdInterstitial} onFinish={handleAdFinish} />
      <IncomingCallHandler navigation={navigation} route={route} />
    </SafeAreaView>
  );
};

export default ShortFeedScreen;







  



  









  



  
