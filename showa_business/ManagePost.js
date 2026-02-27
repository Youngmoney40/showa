
// // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   StyleSheet,
// // //   Image,
// // //   StatusBar,
// // //   Modal,
// // //   Animated,
// // //   Dimensions,
// // //   Pressable,
// // //   Alert,
// // //   ActivityIndicator,
// // //   Platform
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // import Video from 'react-native-video';
// // // import { useNavigation, useFocusEffect } from '@react-navigation/native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import axios from 'axios';
// // // import { API_ROUTE } from '../api_routing/api';
// // // import { useTheme } from '../src/context/ThemeContext'; 

// // // const { height, width } = Dimensions.get('window');

// // // const ManagePostsScreen = () => {
// // //   const { colors, isDark } = useTheme(); 
// // //   const navigation = useNavigation();
// // //   const [selectedTab, setSelectedTab] = useState('marketplace');
// // //   const [marketplacePosts, setMarketplacePosts] = useState([]);
// // //   const [tweets, setTweets] = useState([]);
// // //   const [userVideos, setUserVideos] = useState([]);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [selectedItem, setSelectedItem] = useState(null);
// // //   const [loading, setLoading] = useState(true);
  
// // //   // Video player states
// // //   const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
// // //   const [currentVideo, setCurrentVideo] = useState(null);
// // //   const [isPlaying, setIsPlaying] = useState(true);
// // //   const [videoLoading, setVideoLoading] = useState(false);
// // //   const [videoError, setVideoError] = useState(false);
// // //   const [videoPaused, setVideoPaused] = useState(false);
  
// // //   const slideAnim = useRef(new Animated.Value(height)).current;
// // //   const videoRef = useRef(null);
// // //   const abortControllerRef = useRef(null);
// // //   const isMounted = useRef(true);

// // //   // Cleanup on unmount
// // //   useEffect(() => {
// // //     return () => {
// // //       isMounted.current = false;
// // //       if (abortControllerRef.current) {
// // //         abortControllerRef.current.abort();
// // //       }
// // //     };
// // //   }, []);

// // //   // Test video URL accessibility
// // //   const testVideoUrl = async (url) => {
// // //     try {
// // //       console.log('Testing video URL:', url);
// // //       const response = await fetch(url, { method: 'HEAD' });
// // //       console.log('Video URL status:', response.status);
// // //       console.log('Video URL headers:', response.headers);
// // //       return response.ok;
// // //     } catch (error) {
// // //       console.log('Video URL test failed:', error);
// // //       return false;
// // //     }
// // //   };

// // //   const getSecureUrl = (url) => {
// // //     if (!url) return null;
    
// // //     // Convert http to https
// // //     if (url.startsWith('http://')) {
// // //       url = url.replace('http://', 'https://');
// // //     }
    
// // //     // Ensure URL is properly encoded
// // //     try {
// // //       // Don't encode the entire URL as it may break existing encoding
// // //       const urlParts = url.split('/');
// // //       const lastPart = urlParts.pop();
// // //       if (lastPart) {
// // //         const encodedLastPart = encodeURIComponent(lastPart);
// // //         url = [...urlParts, encodedLastPart].join('/');
// // //       }
// // //     } catch (e) {
// // //       console.log('URL encoding error:', e);
// // //     }
    
// // //     return url;
// // //   };

// // //   // Generate video thumbnail from Cloudinary URL
// // //   const getVideoThumbnail = (videoUrl) => {
// // //     if (!videoUrl) return null;
    
// // //     // For Cloudinary URLs, generate thumbnail
// // //     if (videoUrl.includes('cloudinary.com')) {
// // //       // Replace /video/upload/ with /video/upload/w_400,h_400,c_thumb/
// // //       return videoUrl.replace('/video/upload/', '/video/upload/w_400,h_400,c_thumb/');
// // //     }
    
// // //     return null;
// // //   };

// // //   // Open video player modal
// // //   const openVideoPlayer = async (video) => {
// // //     const url = getSecureUrl(video.video);
// // //     console.log('Opening video URL:', url);
// // //     console.log('Video data:', JSON.stringify(video, null, 2));
    
// // //     // Test URL accessibility
// // //     const isValid = await testVideoUrl(url);
// // //     console.log('Video URL valid:', isValid);
    
// // //     setCurrentVideo(video);
// // //     setVideoPlayerVisible(true);
// // //     setIsPlaying(true);
// // //     setVideoPaused(false);
// // //     setVideoLoading(true);
// // //     setVideoError(false);
// // //   };

// // //   // Close video player modal
// // //   const closeVideoPlayer = () => {
// // //     setVideoPlayerVisible(false);
// // //     setIsPlaying(false);
// // //     setVideoPaused(true);
// // //     setCurrentVideo(null);
// // //     setVideoError(false);
// // //     setVideoLoading(false);
    
// // //     // Pause video when closing
// // //     if (videoRef.current) {
// // //       videoRef.current.seek(0);
// // //     }
// // //   };

// // //   const fetchMarketplace = useCallback(async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('userToken');
// // //       const controller = new AbortController();
// // //       abortControllerRef.current = controller;
      
// // //       const res = await axios.get(`${API_ROUTE}/my-listings/`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //         signal: controller.signal
// // //       });
      
// // //       if (isMounted.current) {
// // //         setMarketplacePosts(res.data || []);
// // //       }
// // //     } catch (error) {
// // //       if (!axios.isCancel(error)) {
// // //         console.error('Error fetching marketplace posts:', error);
// // //         if (isMounted.current) {
// // //           setMarketplacePosts([]);
// // //         }
// // //       }
// // //     }
// // //   }, []);

// // //   const fetchTweets = useCallback(async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('userToken');
// // //       const controller = new AbortController();
// // //       abortControllerRef.current = controller;
      
// // //       const res = await axios.get(`${API_ROUTE}/my-posts/`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //         signal: controller.signal
// // //       });
      
// // //       if (isMounted.current) {
// // //         setTweets(res.data || []);
// // //       }
// // //     } catch (error) {
// // //       if (!axios.isCancel(error)) {
// // //         console.error('Error fetching tweets:', error);
// // //         if (isMounted.current) {
// // //           setTweets([]);
// // //         }
// // //       }
// // //     }
// // //   }, []);

// // //   const fetchVideos = useCallback(async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('userToken');
// // //       const controller = new AbortController();
// // //       abortControllerRef.current = controller;
      
// // //       const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //         signal: controller.signal
// // //       });
      
// // //       if (isMounted.current) {
// // //         console.log('Fetched videos:', res.data);
// // //         setUserVideos(res.data || []);
// // //       }
// // //     } catch (error) {
// // //       if (!axios.isCancel(error)) {
// // //         console.error('Error fetching videos:', error);
// // //         if (isMounted.current) {
// // //           setUserVideos([]);
// // //         }
// // //       }
// // //     }
// // //   }, []);

// // //   // Fetch all data
// // //   useEffect(() => {
// // //     const fetchAllData = async () => {
// // //       setLoading(true);
// // //       try {
// // //         await Promise.all([
// // //           fetchMarketplace(),
// // //           fetchTweets(),
// // //           fetchVideos()
// // //         ]);
// // //       } catch (error) {
// // //         console.error('Error fetching all data:', error);
// // //       } finally {
// // //         if (isMounted.current) {
// // //           setLoading(false);
// // //         }
// // //       }
// // //     };

// // //     fetchAllData();
// // //   }, [fetchMarketplace, fetchTweets, fetchVideos]);

// // //   // Refresh data when screen comes into focus
// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       const refreshData = async () => {
// // //         try {
// // //           await fetchMarketplace();
// // //           await fetchTweets();
// // //           await fetchVideos();
// // //         } catch (error) {
// // //           console.error('Error refreshing data:', error);
// // //         }
// // //       };
      
// // //       refreshData();
      
// // //       return () => {
// // //         if (abortControllerRef.current) {
// // //           abortControllerRef.current.abort();
// // //         }
// // //       };
// // //     }, [fetchMarketplace, fetchTweets, fetchVideos])
// // //   );

// // //   const confirmDelete = (type, id) => {
// // //     Alert.alert(
// // //       "Confirm Delete",
// // //       "Are you sure you want to delete this item?",
// // //       [
// // //         {
// // //           text: "Cancel",
// // //           style: "cancel"
// // //         },
// // //         { 
// // //           text: "Delete", 
// // //           onPress: () => handleDelete(type, id),
// // //           style: "destructive"
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   const handleDelete = async (type, id) => {
// // //     const token = await AsyncStorage.getItem('userToken');
// // //     try {
// // //       let endpoint = '';
// // //       if (type === 'marketplace') {
// // //         endpoint = `${API_ROUTE}/my-listings/${id}/`;
// // //       } else if (type === 'tweets') {
// // //         endpoint = `${API_ROUTE}/my-posts/${id}/`;
// // //       } else {
// // //         endpoint = `${API_ROUTE}/my-shorts/${id}/`;
// // //       }

// // //       await axios.delete(endpoint, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       // Refresh the appropriate list
// // //       if (type === 'marketplace') {
// // //         await fetchMarketplace();
// // //       } else if (type === 'tweets') {
// // //         await fetchTweets();
// // //       } else {
// // //         await fetchVideos();
// // //       }
      
// // //       Alert.alert("Success", "Item deleted successfully");
// // //     } catch (error) {
// // //       Alert.alert("Error", "Failed to delete item");
// // //       console.error('Delete error:', error);
// // //     }
// // //     toggleModal();
// // //   };

// // //   const toggleModal = (item = null) => {
// // //     setSelectedItem(item);
// // //     if (item) {
// // //       setModalVisible(true);
// // //       Animated.timing(slideAnim, {
// // //         toValue: 0,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }).start();
// // //     } else {
// // //       Animated.timing(slideAnim, {
// // //         toValue: height,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }).start(() => setModalVisible(false));
// // //     }
// // //   };

// // //   const renderEmptyState = () => (
// // //     <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
// // //       <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
// // //       <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
// // //         You haven't posted anything yet. Create your first post and start sharing!
// // //       </Text>
// // //     </View>
// // //   );

// // //   const currentData = () => {
// // //     switch(selectedTab) {
// // //       case 'marketplace': return marketplacePosts;
// // //       case 'tweets': return tweets;
// // //       case 'videos': return userVideos;
// // //       default: return [];
// // //     }
// // //   };

// // //   const renderMarketplacePost = ({ item }) => {
// // //     const imageUrl = getSecureUrl(item.images?.[0]?.image);
    
// // //     return (
// // //       <View style={[styles.card, { 
// // //         backgroundColor: colors.card,
// // //         shadowColor: isDark ? '#000' : '#000',
// // //         shadowOpacity: isDark ? 0.1 : 0.05,
// // //       }]}>
// // //         {imageUrl ? (
// // //           <Image 
// // //             source={{ uri: imageUrl }} 
// // //             style={styles.postImage}
// // //             resizeMode="cover"
// // //           />
// // //         ) : (
// // //           <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
// // //             <Ionicons name="image-outline" size={50} color={colors.textSecondary} />
// // //           </View>
// // //         )}
// // //         <View style={styles.postContent}>
// // //           <View style={styles.postHeader}>
// // //             <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
// // //             <TouchableOpacity 
// // //               onPress={() => toggleModal(item)}
// // //               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// // //             >
// // //               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
// // //             </TouchableOpacity>
// // //           </View>
// // //           <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>₦{item.price}</Text>
// // //           <Text style={[styles.postDate, { color: colors.textSecondary }]}>
// // //             {new Date(item.created).toLocaleDateString()}
// // //           </Text>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   const renderTweet = ({ item }) => {
// // //     const imageUrl = getSecureUrl(item.image_url);
    
// // //     return (
// // //       <View style={[styles.card, { 
// // //         backgroundColor: colors.card,
// // //         shadowColor: isDark ? '#000' : '#000',
// // //         shadowOpacity: isDark ? 0.1 : 0.05,
// // //       }]}>
// // //         {imageUrl ? (
// // //           <Image 
// // //             source={{ uri: imageUrl }} 
// // //             style={styles.postImage}
// // //             resizeMode="cover"
// // //           />
// // //         ) : (
// // //           <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
// // //             <Ionicons name="chatbubble-outline" size={50} color={colors.textSecondary} />
// // //           </View>
// // //         )}
// // //         <View style={styles.postContent}>
// // //           <View style={styles.postHeader}>
// // //             <Text style={[styles.postText, { color: colors.text }]} numberOfLines={3}>{item.content}</Text>
// // //             <TouchableOpacity 
// // //               onPress={() => toggleModal(item)}
// // //               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// // //             >
// // //               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
// // //             </TouchableOpacity>
// // //           </View>
// // //           <View style={styles.postStats}>
// // //             <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.reactions?.length || 0} reactions</Text>
// // //             <Text style={[styles.postDate, { color: colors.textSecondary }]}>
// // //               {new Date(item.created_at).toLocaleDateString()}
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   const renderVideo = ({ item }) => {
// // //     const videoUrl = getSecureUrl(item.video);
// // //     const thumbnailUrl = getVideoThumbnail(videoUrl);
    
// // //     return (
// // //       <View style={[styles.card, { 
// // //         backgroundColor: colors.card,
// // //         shadowColor: isDark ? '#000' : '#000',
// // //         shadowOpacity: isDark ? 0.1 : 0.05,
// // //       }]}>
// // //         <TouchableOpacity 
// // //           activeOpacity={0.9}
// // //           onPress={() => openVideoPlayer(item)}
// // //           onLongPress={() => {
// // //             Alert.alert(
// // //               'Video Info',
// // //               `URL: ${videoUrl}\nCaption: ${item.caption || 'No caption'}`,
// // //               [
// // //                 { text: 'OK' },
// // //                 { text: 'Test URL', onPress: () => testVideoUrl(videoUrl) }
// // //               ]
// // //             );
// // //           }}
// // //           style={styles.videoContainer}
// // //         >
// // //           {thumbnailUrl ? (
// // //             <Image 
// // //               source={{ uri: thumbnailUrl }} 
// // //               style={styles.postImage}
// // //               resizeMode="cover"
// // //             />
// // //           ) : (
// // //             <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
// // //               <Ionicons name="videocam-outline" size={50} color={colors.textSecondary} />
// // //               <Text style={[styles.videoPlaceholderText, { color: colors.textSecondary }]}>
// // //                 {item.caption || 'Video'}
// // //               </Text>
// // //             </View>
// // //           )}
          
// // //           {/* Play button overlay */}
// // //           <View style={styles.playButtonOverlay}>
// // //             <View style={[styles.playButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
// // //               <Ionicons name="play" size={30} color="#fff" />
// // //             </View>
// // //           </View>
// // //         </TouchableOpacity>
        
// // //         <View style={styles.postContent}>
// // //           <View style={styles.postHeader}>
// // //             <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>
// // //               {item.caption || item.title || 'Untitled Video'}
// // //             </Text>
// // //             <TouchableOpacity 
// // //               onPress={() => toggleModal(item)}
// // //               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// // //             >
// // //               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
// // //             </TouchableOpacity>
// // //           </View>
          
// // //           <View style={styles.videoStats}>
// // //             <View style={styles.statItem}>
// // //               <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
// // //               <Text style={[styles.statText, { color: colors.textSecondary }]}>
// // //                 {item.like_count || item.likes || 0}
// // //               </Text>
// // //             </View>
            
// // //             <View style={styles.statItem}>
// // //               <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
// // //               <Text style={[styles.statText, { color: colors.textSecondary }]}>
// // //                 {item.comment_count || 0}
// // //               </Text>
// // //             </View>
            
// // //             <View style={styles.statItem}>
// // //               <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
// // //               <Text style={[styles.statText, { color: colors.textSecondary }]}>
// // //                 {item.view_count || 0}
// // //               </Text>
// // //             </View>
// // //           </View>
          
// // //           <Text style={[styles.postDate, { color: colors.textSecondary }]}>
// // //             {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
// // //           </Text>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
// // //       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
// // //       {/* Header */}
// // //       <View style={[styles.header, { 
// // //         backgroundColor: colors.card,
// // //         borderBottomColor: colors.border 
// // //       }]}>
// // //         <TouchableOpacity 
// // //           onPress={() => navigation.goBack()} 
// // //           style={styles.backButton}
// // //           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// // //         >
// // //           <Ionicons name="arrow-back" size={24} color={colors.text} />
// // //         </TouchableOpacity>
// // //         <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Posts</Text>
// // //         <View style={styles.headerRight} />
// // //       </View>

// // //       {/* Tab Bar */}
// // //       <View style={[styles.tabContainer, { 
// // //         backgroundColor: colors.card,
// // //         borderBottomColor: colors.border 
// // //       }]}>
// // //         <TouchableOpacity 
// // //           onPress={() => setSelectedTab('marketplace')} 
// // //           style={[
// // //             styles.tab, 
// // //             { backgroundColor: 'transparent' },
// // //             selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
// // //           ]}
// // //           activeOpacity={0.7}
// // //         >
// // //           <Ionicons 
// // //             name="cart-outline" 
// // //             size={20} 
// // //             color={selectedTab === 'marketplace' ? '#fff' : colors.primary} 
// // //           />
// // //           <Text style={[
// // //             styles.tabText, 
// // //             { color: colors.primary },
// // //             selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
// // //           ]}>
// // //             Marketplace
// // //           </Text>
// // //         </TouchableOpacity>
        
// // //         <TouchableOpacity 
// // //           onPress={() => setSelectedTab('tweets')} 
// // //           style={[
// // //             styles.tab, 
// // //             { backgroundColor: 'transparent' },
// // //             selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
// // //           ]}
// // //           activeOpacity={0.7}
// // //         >
// // //           <Ionicons 
// // //             name="chatbubble-outline" 
// // //             size={20} 
// // //             color={selectedTab === 'tweets' ? '#fff' : colors.primary} 
// // //           />
// // //           <Text style={[
// // //             styles.tabText, 
// // //             { color: colors.primary },
// // //             selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
// // //           ]}>
// // //             Broadcast
// // //           </Text>
// // //         </TouchableOpacity>
        
// // //         <TouchableOpacity 
// // //           onPress={() => setSelectedTab('videos')} 
// // //           style={[
// // //             styles.tab, 
// // //             { backgroundColor: 'transparent' },
// // //             selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
// // //           ]}
// // //           activeOpacity={0.7}
// // //         >
// // //           <Ionicons 
// // //             name="videocam-outline" 
// // //             size={20} 
// // //             color={selectedTab === 'videos' ? '#fff' : colors.primary} 
// // //           />
// // //           <Text style={[
// // //             styles.tabText, 
// // //             { color: colors.primary },
// // //             selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
// // //           ]}>
// // //             Videos
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {loading ? (
// // //         <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
// // //           <ActivityIndicator size="large" color={colors.primary} />
// // //           <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your posts...</Text>
// // //         </View>
// // //       ) : currentData().length === 0 ? (
// // //         renderEmptyState()
// // //       ) : (
// // //         <FlatList
// // //           data={currentData()}
// // //           renderItem={
// // //             selectedTab === 'marketplace'
// // //               ? renderMarketplacePost
// // //               : selectedTab === 'tweets'
// // //               ? renderTweet
// // //               : renderVideo
// // //           }
// // //           keyExtractor={(item) => item.id.toString()}
// // //           contentContainerStyle={styles.listContent}
// // //           showsVerticalScrollIndicator={false}
// // //           initialNumToRender={5}
// // //           maxToRenderPerBatch={10}
// // //           windowSize={10}
// // //         />
// // //       )}

// // //       {/* Video Player Modal */}
// // //       <Modal
// // //         visible={videoPlayerVisible}
// // //         transparent={true}
// // //         animationType="fade"
// // //         onRequestClose={closeVideoPlayer}
// // //         presentationStyle="fullScreen"
// // //       >
// // //         <View style={styles.videoModalOverlay}>
// // //           <View style={[styles.videoModalContent, { backgroundColor: '#000' }]}>
// // //             {/* Close button */}
// // //             <TouchableOpacity
// // //               style={styles.videoCloseButton}
// // //               onPress={closeVideoPlayer}
// // //             >
// // //               <Ionicons name="close" size={30} color="#fff" />
// // //             </TouchableOpacity>

// // //             {/* Video Player */}
// // //             {currentVideo && (
// // //               <View style={styles.videoWrapper}>
// // //                 {videoLoading && !videoError && (
// // //                   <View style={styles.videoLoadingOverlay}>
// // //                     <ActivityIndicator size="large" color={colors.primary} />
// // //                     <Text style={styles.videoLoadingText}>Loading video...</Text>
// // //                   </View>
// // //                 )}
                
// // //                 {videoError ? (
// // //                   <View style={styles.videoErrorOverlay}>
// // //                     <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
// // //                     <Text style={styles.videoErrorText}>Failed to load video</Text>
// // //                     <Text style={styles.videoErrorSubText}>
// // //                       {videoError === true ? 'Network error or invalid video format' : ''}
// // //                     </Text>
// // //                     <TouchableOpacity 
// // //                       style={[styles.retryButton, { backgroundColor: colors.primary }]}
// // //                       onPress={() => {
// // //                         setVideoError(false);
// // //                         setVideoLoading(true);
// // //                         // Force video reload
// // //                         if (videoRef.current) {
// // //                           videoRef.current.seek(0);
// // //                         }
// // //                       }}
// // //                     >
// // //                       <Text style={styles.retryButtonText}>Retry</Text>
// // //                     </TouchableOpacity>
// // //                   </View>
// // //                 ) : (
// // //                   <Video
// // //                     ref={videoRef}
// // //                     source={{ uri: getSecureUrl(currentVideo.video) }}
// // //                     style={styles.videoPlayer}
// // //                     resizeMode="contain"
// // //                     paused={!isPlaying}
// // //                     repeat={true}
// // //                     controls={false}
// // //                     muted={false}
// // //                     volume={1.0}
// // //                     rate={1.0}
// // //                     playInBackground={false}
// // //                     playWhenInactive={false}
// // //                     ignoreSilentSwitch="ignore"
// // //                     onLoad={(data) => {
// // //                       console.log('Video loaded successfully:', data);
// // //                       setVideoLoading(false);
// // //                       setVideoError(false);
// // //                     }}
// // //                     onLoadStart={() => {
// // //                       console.log('Video loading started');
// // //                       setVideoLoading(true);
// // //                       setVideoError(false);
// // //                     }}
// // //                     onError={(error) => {
// // //                       console.log('Video error details:', error);
// // //                       setVideoLoading(false);
// // //                       setVideoError(true);
// // //                     }}
// // //                     onBuffer={({ isBuffering }) => {
// // //                       console.log('Buffering:', isBuffering);
// // //                       setVideoLoading(isBuffering);
// // //                     }}
// // //                     onReadyForDisplay={() => {
// // //                       console.log('Video ready for display');
// // //                     }}
// // //                     bufferConfig={{
// // //                       minBufferMs: 15000,
// // //                       maxBufferMs: 50000,
// // //                       bufferForPlaybackMs: 2500,
// // //                       bufferForPlaybackAfterRebufferMs: 5000
// // //                     }}
// // //                     // Android specific props
// // //                     {...(Platform.OS === 'android' ? {
// // //                       onVideoLoad: (data) => console.log('Android video load:', data),
// // //                       onVideoError: (error) => console.log('Android video error:', error),
// // //                     } : {})}
// // //                   />
// // //                 )}
                
// // //                 {/* Video Info Overlay (only show when video is playing or paused) */}
// // //                 {!videoLoading && !videoError && (
// // //                   <View style={styles.videoInfoOverlay}>
// // //                     <Text style={styles.videoInfoTitle}>
// // //                       {currentVideo.caption || currentVideo.title || 'Video'}
// // //                     </Text>
// // //                     <View style={styles.videoInfoStats}>
// // //                       <View style={styles.videoInfoStat}>
// // //                         <Ionicons name="heart" size={16} color="#fff" />
// // //                         <Text style={styles.videoInfoStatText}>
// // //                           {currentVideo.like_count || currentVideo.likes || 0}
// // //                         </Text>
// // //                       </View>
// // //                       <View style={styles.videoInfoStat}>
// // //                         <Ionicons name="chatbubble" size={16} color="#fff" />
// // //                         <Text style={styles.videoInfoStatText}>
// // //                           {currentVideo.comment_count || 0}
// // //                         </Text>
// // //                       </View>
// // //                       <View style={styles.videoInfoStat}>
// // //                         <Ionicons name="eye" size={16} color="#fff" />
// // //                         <Text style={styles.videoInfoStatText}>
// // //                           {currentVideo.view_count || 0}
// // //                         </Text>
// // //                       </View>
// // //                     </View>
// // //                   </View>
// // //                 )}

// // //                 {/* Play/Pause button (only show when video is loaded and no error) */}
// // //                 {!videoLoading && !videoError && (
// // //                   <TouchableOpacity
// // //                     style={styles.playPauseButton}
// // //                     onPress={() => setIsPlaying(!isPlaying)}
// // //                   >
// // //                     <View style={styles.playPauseButtonInner}>
// // //                       <Ionicons 
// // //                         name={isPlaying ? 'pause' : 'play'} 
// // //                         size={50} 
// // //                         color="#fff" 
// // //                       />
// // //                     </View>
// // //                   </TouchableOpacity>
// // //                 )}
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </Modal>

// // //       {/* Bottom Sheet Modal for Delete */}
// // //       <Modal
// // //         transparent={true}
// // //         visible={modalVisible}
// // //         onRequestClose={() => toggleModal()}
// // //         animationType="none"
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <Pressable 
// // //             style={styles.modalBackdrop} 
// // //             onPress={() => toggleModal()}
// // //           />
          
// // //           <Animated.View 
// // //             style={[
// // //               styles.modalContainer,
// // //               { 
// // //                 backgroundColor: colors.card,
// // //                 transform: [{ translateY: slideAnim }] 
// // //               }
// // //             ]}
// // //           >
// // //             <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
// // //             <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
            
// // //             <TouchableOpacity 
// // //               style={[styles.modalOption, { borderBottomColor: colors.border }]}
// // //               onPress={() => {
// // //                 if (selectedItem) {
// // //                   confirmDelete(selectedTab, selectedItem.id);
// // //                 }
// // //               }}
// // //               activeOpacity={0.7}
// // //             >
// // //               <Ionicons name="trash-outline" size={24} color="#e74c3c" />
// // //               <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity 
// // //               style={[styles.modalOption, { borderBottomColor: colors.border }]}
// // //               onPress={() => toggleModal()}
// // //               activeOpacity={0.7}
// // //             >
// // //               <Ionicons name="close-circle-outline" size={24} color={colors.primary} />
// // //               <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
// // //             </TouchableOpacity>
// // //           </Animated.View>
// // //         </View>
// // //       </Modal>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     padding: 16,
// // //     borderBottomWidth: 1,
// // //     elevation: 2,
// // //   },
// // //   backButton: {
// // //     padding: 4,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //   },
// // //   headerRight: {
// // //     width: 24,
// // //   },
// // //   tabContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     elevation: 2,
// // //   },
// // //   tab: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 20,
// // //     borderRadius: 20,
// // //   },
// // //   activeTab: {
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   tabText: {
// // //     marginLeft: 8,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // //   activeTabText: {
// // //     color: '#fff',
// // //   },
// // //   listContent: {
// // //     padding: 16,
// // //     paddingBottom: 32,
// // //   },
// // //   card: {
// // //     borderRadius: 12,
// // //     marginBottom: 16,
// // //     overflow: 'hidden',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowRadius: 6,
// // //     elevation: 2,
// // //   },
// // //   postImage: {
// // //     width: '100%',
// // //     height: 200,
// // //   },
// // //   placeholderContainer: {
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   videoContainer: {
// // //     position: 'relative',
// // //   },
// // //   videoPlaceholderText: {
// // //     marginTop: 8,
// // //     fontSize: 14,
// // //   },
// // //   playButtonOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   playButton: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   videoStats: {
// // //     flexDirection: 'row',
// // //     marginBottom: 8,
// // //   },
// // //   statItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginRight: 16,
// // //   },
// // //   statText: {
// // //     fontSize: 12,
// // //     marginLeft: 4,
// // //   },
// // //   postContent: {
// // //     padding: 16,
// // //   },
// // //   postHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 8,
// // //   },
// // //   postTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     flex: 1,
// // //     marginRight: 12,
// // //   },
// // //   postText: {
// // //     fontSize: 15,
// // //     flex: 1,
// // //     marginRight: 12,
// // //     lineHeight: 22,
// // //   },
// // //   postPrice: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     marginBottom: 4,
// // //   },
// // //   postStats: {
// // //     flexDirection: 'row',
// // //     marginTop: 8,
// // //     flexWrap: 'wrap',
// // //   },
// // //   postStat: {
// // //     fontSize: 13,
// // //     marginRight: 16,
// // //   },
// // //   postDate: {
// // //     fontSize: 12,
// // //   },
  
// // //   // Video Modal Styles
// // //   videoModalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.95)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   videoModalContent: {
// // //     width: width,
// // //     height: height,
// // //     position: 'relative',
// // //   },
// // //   videoCloseButton: {
// // //     position: 'absolute',
// // //     top: Platform.OS === 'ios' ? 50 : 30,
// // //     right: 20,
// // //     zIndex: 10,
// // //     padding: 10,
// // //   },
// // //   videoWrapper: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     position: 'relative',
// // //   },
// // //   videoPlayer: {
// // //     width: width,
// // //     height: height,
// // //   },
// // //   videoLoadingOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     zIndex: 5,
// // //   },
// // //   videoLoadingText: {
// // //     color: '#fff',
// // //     marginTop: 10,
// // //     fontSize: 14,
// // //   },
// // //   videoErrorOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0,0,0,0.8)',
// // //     zIndex: 5,
// // //   },
// // //   videoErrorText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     marginTop: 10,
// // //     marginBottom: 5,
// // //   },
// // //   videoErrorSubText: {
// // //     color: '#ccc',
// // //     fontSize: 14,
// // //     marginTop: 5,
// // //     marginBottom: 20,
// // //     textAlign: 'center',
// // //     paddingHorizontal: 20,
// // //   },
// // //   retryButton: {
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 5,
// // //   },
// // //   retryButtonText: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   videoInfoOverlay: {
// // //     position: 'absolute',
// // //     bottom: 50,
// // //     left: 20,
// // //     right: 20,
// // //     backgroundColor: 'rgba(0,0,0,0.6)',
// // //     padding: 16,
// // //     borderRadius: 10,
// // //   },
// // //   videoInfoTitle: {
// // //     color: '#fff',
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     marginBottom: 8,
// // //   },
// // //   videoInfoStats: {
// // //     flexDirection: 'row',
// // //   },
// // //   videoInfoStat: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginRight: 20,
// // //   },
// // //   videoInfoStatText: {
// // //     color: '#fff',
// // //     marginLeft: 6,
// // //     fontSize: 14,
// // //   },
// // //   playPauseButton: {
// // //     position: 'absolute',
// // //     top: '50%',
// // //     left: '50%',
// // //     transform: [{ translateX: -35 }, { translateY: -35 }],
// // //     zIndex: 5,
// // //   },
// // //   playPauseButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
  
// // //   // Modal Styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     justifyContent: 'flex-end',
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //   },
// // //   modalBackdrop: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     bottom: 0,
// // //     left: 0,
// // //     right: 0,
// // //   },
// // //   modalContainer: {
// // //     borderTopLeftRadius: 16,
// // //     borderTopRightRadius: 16,
// // //     padding: 24,
// // //     paddingBottom: 32,
// // //   },
// // //   modalHandle: {
// // //     width: 40,
// // //     height: 4,
// // //     borderRadius: 2,
// // //     alignSelf: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     marginBottom: 24,
// // //     textAlign: 'center',
// // //   },
// // //   modalOption: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 16,
// // //     borderBottomWidth: 1,
// // //   },
// // //   modalOptionText: {
// // //     fontSize: 16,
// // //     marginLeft: 16,
// // //   },
// // //   emptyContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 40,
// // //   },
// // //   emptyText: {
// // //     fontSize: 18,
// // //     textAlign: 'center',
// // //     marginTop: 16,
// // //     marginBottom: 24,
// // //     lineHeight: 26,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   loadingText: {
// // //     marginTop: 12,
// // //     fontSize: 16,
// // //   },
// // // });

// // // export default ManagePostsScreen;

// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   Image,
// //   StatusBar,
// //   Modal,
// //   Animated,
// //   Dimensions,
// //   Pressable,
// //   Alert,
// //   ActivityIndicator,
// //   Platform,
// //   ScrollView,
// //   PanResponder
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import Video from 'react-native-video';
// // import { useNavigation, useFocusEffect } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import { API_ROUTE } from '../api_routing/api';
// // import { useTheme } from '../src/context/ThemeContext'; 

// // const { height, width } = Dimensions.get('window');

// // const ManagePostsScreen = () => {
// //   const { colors, isDark } = useTheme(); 
// //   const navigation = useNavigation();
// //   const [selectedTab, setSelectedTab] = useState('marketplace');
// //   const [marketplacePosts, setMarketplacePosts] = useState([]);
// //   const [tweets, setTweets] = useState([]);
// //   const [userVideos, setUserVideos] = useState([]);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [selectedItem, setSelectedItem] = useState(null);
// //   const [loading, setLoading] = useState(true);
  
// //   // Image viewer states
// //   const [imageViewerVisible, setImageViewerVisible] = useState(false);
// //   const [selectedImage, setSelectedImage] = useState(null);
// //   const [imageViewerItem, setImageViewerItem] = useState(null);
// //   const [showImageDetails, setShowImageDetails] = useState(true);
  
// //   // Video player states
// //   const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
// //   const [currentVideo, setCurrentVideo] = useState(null);
// //   const [isPlaying, setIsPlaying] = useState(true);
// //   const [videoLoading, setVideoLoading] = useState(false);
// //   const [videoError, setVideoError] = useState(false);
// //   const [videoPaused, setVideoPaused] = useState(false);
// //   const [showVideoControls, setShowVideoControls] = useState(true);
// //   const [videoProgress, setVideoProgress] = useState(0);
// //   const [videoDuration, setVideoDuration] = useState(0);
// //   const [isMuted, setIsMuted] = useState(false);
  
// //   const slideAnim = useRef(new Animated.Value(height)).current;
// //   const videoRef = useRef(null);
// //   const controlsTimeout = useRef(null);
// //   const abortControllerRef = useRef(null);
// //   const isMounted = useRef(true);
// //   const imageScale = useRef(new Animated.Value(1)).current;
// //   const imagePan = useRef(new Animated.ValueXY()).current;

// //   // Pan responder for image zoom/drag
// //   const panResponder = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => true,
// //       onPanResponderMove: (_, gesture) => {
// //         if (imageScale._value > 1) {
// //           imagePan.setValue({ x: gesture.dx, y: gesture.dy });
// //         }
// //       },
// //       onPanResponderRelease: () => {
// //         Animated.spring(imagePan, {
// //           toValue: { x: 0, y: 0 },
// //           useNativeDriver: true,
// //         }).start();
// //       },
// //     })
// //   ).current;

// //   // Cleanup on unmount
// //   useEffect(() => {
// //     return () => {
// //       isMounted.current = false;
// //       if (abortControllerRef.current) {
// //         abortControllerRef.current.abort();
// //       }
// //       if (controlsTimeout.current) {
// //         clearTimeout(controlsTimeout.current);
// //       }
// //     };
// //   }, []);

// //   // Auto-hide video controls
// //   useEffect(() => {
// //     if (showVideoControls && !videoLoading && !videoError) {
// //       if (controlsTimeout.current) {
// //         clearTimeout(controlsTimeout.current);
// //       }
// //       controlsTimeout.current = setTimeout(() => {
// //         setShowVideoControls(false);
// //       }, 3000);
// //     }
// //     return () => {
// //       if (controlsTimeout.current) {
// //         clearTimeout(controlsTimeout.current);
// //       }
// //     };
// //   }, [showVideoControls, videoLoading, videoError]);

// //   const getSecureUrl = (url) => {
// //     if (!url) return null;
// //     if (url.startsWith('http://')) {
// //       url = url.replace('http://', 'https://');
// //     }
// //     return url;
// //   };

// //   // Generate video thumbnail from Cloudinary URL
// //   const getVideoThumbnail = (videoUrl) => {
// //     if (!videoUrl) return null;
// //     if (videoUrl.includes('cloudinary.com')) {
// //       return videoUrl.replace('/video/upload/', '/video/upload/w_400,h_400,c_thumb/');
// //     }
// //     return null;
// //   };

// //   // Open image viewer
// //   const openImageViewer = (item, imageUrl) => {
// //     setSelectedImage(imageUrl);
// //     setImageViewerItem(item);
// //     setImageViewerVisible(true);
// //     setShowImageDetails(true);
// //     imageScale.setValue(1);
// //     imagePan.setValue({ x: 0, y: 0 });
// //   };

// //   // Close image viewer
// //   const closeImageViewer = () => {
// //     setImageViewerVisible(false);
// //     setSelectedImage(null);
// //     setImageViewerItem(null);
// //   };

// //   // Toggle image details
// //   const toggleImageDetails = () => {
// //     setShowImageDetails(!showImageDetails);
// //   };

// //   // Handle image zoom
// //   const handleImageZoom = (evt) => {
// //     if (evt.nativeEvent.zoom) {
// //       imageScale.setValue(evt.nativeEvent.zoom);
// //     }
// //   };

// //   // Open video player modal
// //   const openVideoPlayer = async (video) => {
// //     const url = getSecureUrl(video.video);
// //     console.log('Opening video URL:', url);
    
// //     setCurrentVideo(video);
// //     setVideoPlayerVisible(true);
// //     setIsPlaying(true);
// //     setVideoPaused(false);
// //     setVideoLoading(true);
// //     setVideoError(false);
// //     setShowVideoControls(true);
// //     setVideoProgress(0);
// //   };

// //   // Close video player modal
// //   const closeVideoPlayer = () => {
// //     setVideoPlayerVisible(false);
// //     setIsPlaying(false);
// //     setVideoPaused(true);
// //     setCurrentVideo(null);
// //     setVideoError(false);
// //     setVideoLoading(false);
    
// //     if (videoRef.current) {
// //       videoRef.current.seek(0);
// //     }
// //   };

// //   // Format time for video progress
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = Math.floor(seconds % 60);
// //     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
// //   };

// //   const fetchMarketplace = useCallback(async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('userToken');
// //       const controller = new AbortController();
// //       abortControllerRef.current = controller;
      
// //       const res = await axios.get(`${API_ROUTE}/my-listings/`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //         signal: controller.signal
// //       });
      
// //       if (isMounted.current) {
// //         setMarketplacePosts(res.data || []);
// //       }
// //     } catch (error) {
// //       if (!axios.isCancel(error)) {
// //         console.error('Error fetching marketplace posts:', error);
// //         if (isMounted.current) {
// //           setMarketplacePosts([]);
// //         }
// //       }
// //     }
// //   }, []);

// //   const fetchTweets = useCallback(async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('userToken');
// //       const controller = new AbortController();
// //       abortControllerRef.current = controller;
      
// //       const res = await axios.get(`${API_ROUTE}/my-posts/`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //         signal: controller.signal
// //       });
      
// //       if (isMounted.current) {
// //         setTweets(res.data || []);
// //       }
// //     } catch (error) {
// //       if (!axios.isCancel(error)) {
// //         console.error('Error fetching tweets:', error);
// //         if (isMounted.current) {
// //           setTweets([]);
// //         }
// //       }
// //     }
// //   }, []);

// //   const fetchVideos = useCallback(async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('userToken');
// //       const controller = new AbortController();
// //       abortControllerRef.current = controller;
      
// //       const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //         signal: controller.signal
// //       });
      
// //       if (isMounted.current) {
// //         console.log('Fetched videos:', res.data);
// //         setUserVideos(res.data || []);
// //       }
// //     } catch (error) {
// //       if (!axios.isCancel(error)) {
// //         console.error('Error fetching videos:', error);
// //         if (isMounted.current) {
// //           setUserVideos([]);
// //         }
// //       }
// //     }
// //   }, []);

// //   // Fetch all data
// //   useEffect(() => {
// //     const fetchAllData = async () => {
// //       setLoading(true);
// //       try {
// //         await Promise.all([
// //           fetchMarketplace(),
// //           fetchTweets(),
// //           fetchVideos()
// //         ]);
// //       } catch (error) {
// //         console.error('Error fetching all data:', error);
// //       } finally {
// //         if (isMounted.current) {
// //           setLoading(false);
// //         }
// //       }
// //     };

// //     fetchAllData();
// //   }, [fetchMarketplace, fetchTweets, fetchVideos]);

// //   // Refresh data when screen comes into focus
// //   useFocusEffect(
// //     useCallback(() => {
// //       const refreshData = async () => {
// //         try {
// //           await fetchMarketplace();
// //           await fetchTweets();
// //           await fetchVideos();
// //         } catch (error) {
// //           console.error('Error refreshing data:', error);
// //         }
// //       };
      
// //       refreshData();
      
// //       return () => {
// //         if (abortControllerRef.current) {
// //           abortControllerRef.current.abort();
// //         }
// //       };
// //     }, [fetchMarketplace, fetchTweets, fetchVideos])
// //   );

// //   const confirmDelete = (type, id) => {
// //     Alert.alert(
// //       "Confirm Delete",
// //       "Are you sure you want to delete this item?",
// //       [
// //         {
// //           text: "Cancel",
// //           style: "cancel"
// //         },
// //         { 
// //           text: "Delete", 
// //           onPress: () => handleDelete(type, id),
// //           style: "destructive"
// //         }
// //       ]
// //     );
// //   };

// //   const handleDelete = async (type, id) => {
// //     const token = await AsyncStorage.getItem('userToken');
// //     try {
// //       let endpoint = '';
// //       if (type === 'marketplace') {
// //         endpoint = `${API_ROUTE}/my-listings/${id}/`;
// //       } else if (type === 'tweets') {
// //         endpoint = `${API_ROUTE}/my-posts/${id}/`;
// //       } else {
// //         endpoint = `${API_ROUTE}/my-shorts/${id}/`;
// //       }

// //       await axios.delete(endpoint, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });

// //       // Refresh the appropriate list
// //       if (type === 'marketplace') {
// //         await fetchMarketplace();
// //       } else if (type === 'tweets') {
// //         await fetchTweets();
// //       } else {
// //         await fetchVideos();
// //       }
      
// //       Alert.alert("Success", "Item deleted successfully");
// //     } catch (error) {
// //       Alert.alert("Error", "Failed to delete item");
// //       console.error('Delete error:', error);
// //     }
// //     toggleModal();
// //   };

// //   const toggleModal = (item = null) => {
// //     setSelectedItem(item);
// //     if (item) {
// //       setModalVisible(true);
// //       Animated.timing(slideAnim, {
// //         toValue: 0,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }).start();
// //     } else {
// //       Animated.timing(slideAnim, {
// //         toValue: height,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }).start(() => setModalVisible(false));
// //     }
// //   };

// //   const renderEmptyState = () => (
// //     <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
// //       <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
// //       <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
// //         You haven't posted anything yet. Create your first post and start sharing!
// //       </Text>
// //     </View>
// //   );

// //   const currentData = () => {
// //     switch(selectedTab) {
// //       case 'marketplace': return marketplacePosts;
// //       case 'tweets': return tweets;
// //       case 'videos': return userVideos;
// //       default: return [];
// //     }
// //   };

// //   const renderMarketplacePost = ({ item }) => {
// //     const imageUrl = getSecureUrl(item.images?.[0]?.image);
    
// //     return (
// //       <View style={[styles.card, { 
// //         backgroundColor: colors.card,
// //         shadowColor: isDark ? '#000' : '#000',
// //         shadowOpacity: isDark ? 0.1 : 0.05,
// //       }]}>
// //         <TouchableOpacity 
// //           activeOpacity={0.9}
// //           onPress={() => openImageViewer(item, imageUrl)}
// //           disabled={!imageUrl}
// //         >
// //           {imageUrl ? (
// //             <Image 
// //               source={{ uri: imageUrl }} 
// //               style={styles.postImage}
// //               resizeMode="cover"
// //             />
// //           ) : (
// //             <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
// //               <Ionicons name="image-outline" size={50} color={colors.textSecondary} />
// //             </View>
// //           )}
// //         </TouchableOpacity>
// //         <View style={styles.postContent}>
// //           <View style={styles.postHeader}>
// //             <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
// //             <TouchableOpacity 
// //               onPress={() => toggleModal(item)}
// //               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// //             >
// //               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
// //             </TouchableOpacity>
// //           </View>
// //           <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>₦{item.price}</Text>
// //           <Text style={[styles.postDate, { color: colors.textSecondary }]}>
// //             {new Date(item.created).toLocaleDateString()}
// //           </Text>
// //         </View>
// //       </View>
// //     );
// //   };

// //   const renderTweet = ({ item }) => {
// //     const imageUrl = getSecureUrl(item.image_url);
    
// //     return (
// //       <View style={[styles.card, { 
// //         backgroundColor: colors.card,
// //         shadowColor: isDark ? '#000' : '#000',
// //         shadowOpacity: isDark ? 0.1 : 0.05,
// //       }]}>
// //         <TouchableOpacity 
// //           activeOpacity={0.9}
// //           onPress={() => openImageViewer(item, imageUrl)}
// //           disabled={!imageUrl}
// //         >
// //           {imageUrl ? (
// //             <Image 
// //               source={{ uri: imageUrl }} 
// //               style={styles.postImage}
// //               resizeMode="cover"
// //             />
// //           ) : (
// //             <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
// //               <Ionicons name="chatbubble-outline" size={50} color={colors.textSecondary} />
// //             </View>
// //           )}
// //         </TouchableOpacity>
// //         <View style={styles.postContent}>
// //           <View style={styles.postHeader}>
// //             <Text style={[styles.postText, { color: colors.text }]} numberOfLines={3}>{item.content}</Text>
// //             <TouchableOpacity 
// //               onPress={() => toggleModal(item)}
// //               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// //             >
// //               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
// //             </TouchableOpacity>
// //           </View>
// //           <View style={styles.postStats}>
// //             <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.reactions?.length || 0} reactions</Text>
// //             <Text style={[styles.postDate, { color: colors.textSecondary }]}>
// //               {new Date(item.created_at).toLocaleDateString()}
// //             </Text>
// //           </View>
// //         </View>
// //       </View>
// //     );
// //   };

// //   const renderVideo = ({ item }) => {
// //     const videoUrl = getSecureUrl(item.video);
// //     const thumbnailUrl = getVideoThumbnail(videoUrl);
    
// //     return (
// //       <View style={[styles.card, { 
// //         backgroundColor: colors.card,
// //         shadowColor: isDark ? '#000' : '#000',
// //         shadowOpacity: isDark ? 0.1 : 0.05,
// //       }]}>
// //         <TouchableOpacity 
// //           activeOpacity={0.9}
// //           onPress={() => openVideoPlayer(item)}
// //           style={styles.videoContainer}
// //         >
// //           {thumbnailUrl ? (
// //             <Image 
// //               source={{ uri: thumbnailUrl }} 
// //               style={styles.postImage}
// //               resizeMode="cover"
// //             />
// //           ) : (
// //             <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
// //               <Ionicons name="videocam-outline" size={50} color={colors.textSecondary} />
// //               <Text style={[styles.videoPlaceholderText, { color: colors.textSecondary }]}>
// //                 {item.caption || 'Video'}
// //               </Text>
// //             </View>
// //           )}
          
// //           {/* Play button overlay */}
// //           <View style={styles.playButtonOverlay}>
// //             <View style={[styles.playButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
// //               <Ionicons name="play" size={30} color="#fff" />
// //             </View>
// //           </View>
          
// //           {/* Duration badge if available */}
// //           {item.duration && (
// //             <View style={styles.durationBadge}>
// //               <Text style={styles.durationText}>{item.duration}</Text>
// //             </View>
// //           )}
// //         </TouchableOpacity>
        
// //         <View style={styles.postContent}>
// //           <View style={styles.postHeader}>
// //             <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>
// //               {item.caption || item.title || 'Untitled Video'}
// //             </Text>
// //             <TouchableOpacity 
// //               onPress={() => toggleModal(item)}
// //               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// //             >
// //               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
// //             </TouchableOpacity>
// //           </View>
          
// //           <View style={styles.videoStats}>
// //             <View style={styles.statItem}>
// //               <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
// //               <Text style={[styles.statText, { color: colors.textSecondary }]}>
// //                 {item.like_count || item.likes || 0}
// //               </Text>
// //             </View>
            
// //             <View style={styles.statItem}>
// //               <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
// //               <Text style={[styles.statText, { color: colors.textSecondary }]}>
// //                 {item.comment_count || 0}
// //               </Text>
// //             </View>
            
// //             <View style={styles.statItem}>
// //               <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
// //               <Text style={[styles.statText, { color: colors.textSecondary }]}>
// //                 {item.view_count || 0}
// //               </Text>
// //             </View>
// //           </View>
          
// //           <Text style={[styles.postDate, { color: colors.textSecondary }]}>
// //             {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
// //           </Text>
// //         </View>
// //       </View>
// //     );
// //   };

// //   // Image Viewer Modal Component
// //   const ImageViewerModal = () => (
// //     <Modal
// //       visible={imageViewerVisible}
// //       transparent={true}
// //       animationType="fade"
// //       onRequestClose={closeImageViewer}
// //     >
// //       <View style={styles.imageViewerOverlay}>
// //         <StatusBar hidden />
        
// //         {/* Close button */}
// //         <TouchableOpacity
// //           style={styles.imageViewerCloseButton}
// //           onPress={closeImageViewer}
// //         >
// //           <Ionicons name="close" size={30} color="#fff" />
// //         </TouchableOpacity>
        
// //         {/* Toggle details button */}
// //         <TouchableOpacity
// //           style={styles.imageViewerInfoButton}
// //           onPress={toggleImageDetails}
// //         >
// //           <Ionicons name="information-circle-outline" size={30} color="#fff" />
// //         </TouchableOpacity>
        
// //         {/* Image with pinch to zoom */}
// //         <ScrollView
// //           maximumZoomScale={3}
// //           minimumZoomScale={1}
// //           showsHorizontalScrollIndicator={false}
// //           showsVerticalScrollIndicator={false}
// //           onScroll={handleImageZoom}
// //           scrollEventThrottle={16}
// //           contentContainerStyle={styles.imageViewerScrollContent}
// //         >
// //           <Animated.Image
// //             source={{ uri: selectedImage }}
// //             style={[
// //               styles.imageViewerImage,
// //               {
// //                 transform: [
// //                   { scale: imageScale },
// //                   { translateX: imagePan.x },
// //                   { translateY: imagePan.y }
// //                 ]
// //               }
// //             ]}
// //             resizeMode="contain"
// //             {...panResponder.panHandlers}
// //           />
// //         </ScrollView>
        
// //         {/* Post details overlay */}
// //         {showImageDetails && imageViewerItem && (
// //           <Animated.View 
// //             style={[
// //               styles.imageViewerDetails,
// //               {
// //                 backgroundColor: 'rgba(0,0,0,0.7)',
// //               }
// //             ]}
// //           >
// //             <View style={styles.imageViewerDetailsHeader}>
// //               <View style={styles.imageViewerUserInfo}>
// //                 <View style={[styles.imageViewerAvatar, { backgroundColor: colors.primary }]}>
// //                   <Text style={styles.imageViewerAvatarText}>
// //                     {imageViewerItem.user?.username?.[0]?.toUpperCase() || 'U'}
// //                   </Text>
// //                 </View>
// //                 <View>
// //                   <Text style={styles.imageViewerUsername}>
// //                     {imageViewerItem.user?.username || 'User'}
// //                   </Text>
// //                   <Text style={styles.imageViewerTimestamp}>
// //                     {new Date(imageViewerItem.created || imageViewerItem.created_at).toLocaleDateString()}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
            
// //             <View style={styles.imageViewerContent}>
// //               {selectedTab === 'marketplace' && (
// //                 <>
// //                   <Text style={styles.imageViewerTitle}>{imageViewerItem.title}</Text>
// //                   <Text style={styles.imageViewerPrice}>₦{imageViewerItem.price}</Text>
// //                   {imageViewerItem.description && (
// //                     <Text style={styles.imageViewerDescription}>{imageViewerItem.description}</Text>
// //                   )}
// //                 </>
// //               )}
              
// //               {selectedTab === 'tweets' && (
// //                 <Text style={styles.imageViewerTweetContent}>{imageViewerItem.content}</Text>
// //               )}
// //             </View>
            
// //             <View style={styles.imageViewerStats}>
// //               <View style={styles.imageViewerStat}>
// //                 <Ionicons name="heart-outline" size={20} color="#fff" />
// //                 <Text style={styles.imageViewerStatText}>
// //                   {imageViewerItem.reactions?.length || imageViewerItem.likes || 0}
// //                 </Text>
// //               </View>
// //               <View style={styles.imageViewerStat}>
// //                 <Ionicons name="chatbubble-outline" size={20} color="#fff" />
// //                 <Text style={styles.imageViewerStatText}>
// //                   {imageViewerItem.comments?.length || imageViewerItem.comment_count || 0}
// //                 </Text>
// //               </View>
// //             </View>
// //           </Animated.View>
// //         )}
// //       </View>
// //     </Modal>
// //   );

// //   return (
// //     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
// //       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
// //       {/* Header */}
// //       <View style={[styles.header, { 
// //         backgroundColor: colors.card,
// //         borderBottomColor: colors.border 
// //       }]}>
// //         <TouchableOpacity 
// //           onPress={() => navigation.goBack()} 
// //           style={styles.backButton}
// //           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
// //         >
// //           <Ionicons name="arrow-back" size={24} color={colors.text} />
// //         </TouchableOpacity>
// //         <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Posts</Text>
// //         <View style={styles.headerRight} />
// //       </View>

// //       {/* Tab Bar */}
// //       <View style={[styles.tabContainer, { 
// //         backgroundColor: colors.card,
// //         borderBottomColor: colors.border 
// //       }]}>
// //         <TouchableOpacity 
// //           onPress={() => setSelectedTab('marketplace')} 
// //           style={[
// //             styles.tab, 
// //             { backgroundColor: 'transparent' },
// //             selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
// //           ]}
// //           activeOpacity={0.7}
// //         >
// //           <Ionicons 
// //             name="cart-outline" 
// //             size={20} 
// //             color={selectedTab === 'marketplace' ? '#fff' : colors.primary} 
// //           />
// //           <Text style={[
// //             styles.tabText, 
// //             { color: colors.primary },
// //             selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
// //           ]}>
// //             Marketplace
// //           </Text>
// //         </TouchableOpacity>
        
// //         <TouchableOpacity 
// //           onPress={() => setSelectedTab('tweets')} 
// //           style={[
// //             styles.tab, 
// //             { backgroundColor: 'transparent' },
// //             selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
// //           ]}
// //           activeOpacity={0.7}
// //         >
// //           <Ionicons 
// //             name="chatbubble-outline" 
// //             size={20} 
// //             color={selectedTab === 'tweets' ? '#fff' : colors.primary} 
// //           />
// //           <Text style={[
// //             styles.tabText, 
// //             { color: colors.primary },
// //             selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
// //           ]}>
// //             Broadcast
// //           </Text>
// //         </TouchableOpacity>
        
// //         <TouchableOpacity 
// //           onPress={() => setSelectedTab('videos')} 
// //           style={[
// //             styles.tab, 
// //             { backgroundColor: 'transparent' },
// //             selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
// //           ]}
// //           activeOpacity={0.7}
// //         >
// //           <Ionicons 
// //             name="videocam-outline" 
// //             size={20} 
// //             color={selectedTab === 'videos' ? '#fff' : colors.primary} 
// //           />
// //           <Text style={[
// //             styles.tabText, 
// //             { color: colors.primary },
// //             selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
// //           ]}>
// //             Videos
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       {loading ? (
// //         <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
// //           <ActivityIndicator size="large" color={colors.primary} />
// //           <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your posts...</Text>
// //         </View>
// //       ) : currentData().length === 0 ? (
// //         renderEmptyState()
// //       ) : (
// //         <FlatList
// //           data={currentData()}
// //           renderItem={
// //             selectedTab === 'marketplace'
// //               ? renderMarketplacePost
// //               : selectedTab === 'tweets'
// //               ? renderTweet
// //               : renderVideo
// //           }
// //           keyExtractor={(item) => item.id.toString()}
// //           contentContainerStyle={styles.listContent}
// //           showsVerticalScrollIndicator={false}
// //           initialNumToRender={5}
// //           maxToRenderPerBatch={10}
// //           windowSize={10}
// //         />
// //       )}

// //       {/* Image Viewer Modal */}
// //       <ImageViewerModal />

// //       {/* Video Player Modal */}
// //       <Modal
// //         visible={videoPlayerVisible}
// //         transparent={true}
// //         animationType="fade"
// //         onRequestClose={closeVideoPlayer}
// //         presentationStyle="fullScreen"
// //       >
// //         <View style={styles.videoModalOverlay}>
// //           <StatusBar hidden />
          
// //           <TouchableOpacity
// //             activeOpacity={1}
// //             onPress={() => setShowVideoControls(!showVideoControls)}
// //             style={styles.videoModalContent}
// //           >
// //             {/* Close button */}
// //             {showVideoControls && (
// //               <TouchableOpacity
// //                 style={styles.videoCloseButton}
// //                 onPress={closeVideoPlayer}
// //               >
// //                 <Ionicons name="close" size={30} color="#fff" />
// //               </TouchableOpacity>
// //             )}

// //             {/* Video Player */}
// //             {currentVideo && (
// //               <View style={styles.videoWrapper}>
// //                 {videoLoading && !videoError && (
// //                   <View style={styles.videoLoadingOverlay}>
// //                     <ActivityIndicator size="large" color={colors.primary} />
// //                     <Text style={styles.videoLoadingText}>Loading video...</Text>
// //                   </View>
// //                 )}
                
// //                 {videoError ? (
// //                   <View style={styles.videoErrorOverlay}>
// //                     <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
// //                     <Text style={styles.videoErrorText}>Failed to load video</Text>
// //                     <TouchableOpacity 
// //                       style={[styles.retryButton, { backgroundColor: colors.primary }]}
// //                       onPress={() => {
// //                         setVideoError(false);
// //                         setVideoLoading(true);
// //                       }}
// //                     >
// //                       <Text style={styles.retryButtonText}>Retry</Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                 ) : (
// //                   <Video
// //                     ref={videoRef}
// //                     source={{ uri: getSecureUrl(currentVideo.video) }}
// //                     style={styles.videoPlayer}
// //                     resizeMode="contain"
// //                     paused={!isPlaying}
// //                     repeat={false}
// //                     controls={false}
// //                     muted={isMuted}
// //                     volume={1.0}
// //                     onLoad={(data) => {
// //                       console.log('Video loaded:', data);
// //                       setVideoLoading(false);
// //                       setVideoError(false);
// //                       setVideoDuration(data.duration);
// //                     }}
// //                     onLoadStart={() => {
// //                       setVideoLoading(true);
// //                       setVideoError(false);
// //                     }}
// //                     onError={(error) => {
// //                       console.log('Video error:', error);
// //                       setVideoLoading(false);
// //                       setVideoError(true);
// //                     }}
// //                     onProgress={(data) => {
// //                       setVideoProgress(data.currentTime);
// //                     }}
// //                     onEnd={() => {
// //                       setIsPlaying(false);
// //                       if (videoRef.current) {
// //                         videoRef.current.seek(0);
// //                       }
// //                     }}
// //                     bufferConfig={{
// //                       minBufferMs: 15000,
// //                       maxBufferMs: 50000,
// //                       bufferForPlaybackMs: 2500,
// //                       bufferForPlaybackAfterRebufferMs: 5000
// //                     }}
// //                   />
// //                 )}
                
// //                 {/* Video Controls */}
// //                 {showVideoControls && !videoLoading && !videoError && (
// //                   <>
// //                     {/* Video Info */}
// //                     <View style={styles.videoInfoOverlay}>
// //                       <Text style={styles.videoInfoTitle}>
// //                         {currentVideo.caption || currentVideo.title || 'Video'}
// //                       </Text>
// //                       <View style={styles.videoInfoStats}>
// //                         <View style={styles.videoInfoStat}>
// //                           <Ionicons name="heart" size={16} color="#fff" />
// //                           <Text style={styles.videoInfoStatText}>
// //                             {currentVideo.like_count || currentVideo.likes || 0}
// //                           </Text>
// //                         </View>
// //                         <View style={styles.videoInfoStat}>
// //                           <Ionicons name="chatbubble" size={16} color="#fff" />
// //                           <Text style={styles.videoInfoStatText}>
// //                             {currentVideo.comment_count || 0}
// //                           </Text>
// //                         </View>
// //                       </View>
// //                     </View>

// //                     {/* Progress Bar */}
// //                     <View style={styles.videoProgressContainer}>
// //                       <View style={styles.videoProgressBar}>
// //                         <View 
// //                           style={[
// //                             styles.videoProgressFill,
// //                             { width: `${(videoProgress / videoDuration) * 100}%` }
// //                           ]} 
// //                         />
// //                       </View>
// //                       <View style={styles.videoTimeContainer}>
// //                         <Text style={styles.videoTimeText}>{formatTime(videoProgress)}</Text>
// //                         <Text style={styles.videoTimeText}>{formatTime(videoDuration)}</Text>
// //                       </View>
// //                     </View>

// //                     {/* Play/Pause and Mute buttons */}
// //                     <View style={styles.videoControlsRow}>
// //                       <TouchableOpacity
// //                         style={styles.videoControlButton}
// //                         onPress={() => setIsPlaying(!isPlaying)}
// //                       >
// //                         <Ionicons 
// //                           name={isPlaying ? 'pause' : 'play'} 
// //                           size={40} 
// //                           color="#fff" 
// //                         />
// //                       </TouchableOpacity>
                      
// //                       <TouchableOpacity
// //                         style={styles.videoControlButton}
// //                         onPress={() => setIsMuted(!isMuted)}
// //                       >
// //                         <Ionicons 
// //                           name={isMuted ? 'volume-mute' : 'volume-high'} 
// //                           size={30} 
// //                           color="#fff" 
// //                         />
// //                       </TouchableOpacity>
// //                     </View>
// //                   </>
// //                 )}
// //               </View>
// //             )}
// //           </TouchableOpacity>
// //         </View>
// //       </Modal>

// //       {/* Bottom Sheet Modal for Delete */}
// //       <Modal
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => toggleModal()}
// //         animationType="none"
// //       >
// //         <View style={styles.modalOverlay}>
// //           <Pressable 
// //             style={styles.modalBackdrop} 
// //             onPress={() => toggleModal()}
// //           />
          
// //           <Animated.View 
// //             style={[
// //               styles.modalContainer,
// //               { 
// //                 backgroundColor: colors.card,
// //                 transform: [{ translateY: slideAnim }] 
// //               }
// //             ]}
// //           >
// //             <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
// //             <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
            
// //             <TouchableOpacity 
// //               style={[styles.modalOption, { borderBottomColor: colors.border }]}
// //               onPress={() => {
// //                 if (selectedItem) {
// //                   confirmDelete(selectedTab, selectedItem.id);
// //                 }
// //               }}
// //               activeOpacity={0.7}
// //             >
// //               <Ionicons name="trash-outline" size={24} color="#e74c3c" />
// //               <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.modalOption, { borderBottomColor: colors.border }]}
// //               onPress={() => toggleModal()}
// //               activeOpacity={0.7}
// //             >
// //               <Ionicons name="close-circle-outline" size={24} color={colors.primary} />
// //               <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
// //             </TouchableOpacity>
// //           </Animated.View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     padding: 16,
// //     borderBottomWidth: 1,
// //     elevation: 2,
// //   },
// //   backButton: {
// //     padding: 4,
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //   },
// //   headerRight: {
// //     width: 24,
// //   },
// //   tabContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     elevation: 2,
// //   },
// //   tab: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 8,
// //     paddingHorizontal: 20,
// //     borderRadius: 20,
// //   },
// //   activeTab: {
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 4,
// //     elevation: 4,
// //   },
// //   tabText: {
// //     marginLeft: 8,
// //     fontWeight: '600',
// //     fontSize: 14,
// //   },
// //   activeTabText: {
// //     color: '#fff',
// //   },
// //   listContent: {
// //     padding: 16,
// //     paddingBottom: 32,
// //   },
// //   card: {
// //     borderRadius: 12,
// //     marginBottom: 16,
// //     overflow: 'hidden',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowRadius: 6,
// //     elevation: 2,
// //   },
// //   postImage: {
// //     width: '100%',
// //     height: 200,
// //   },
// //   placeholderContainer: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   videoContainer: {
// //     position: 'relative',
// //   },
// //   videoPlaceholderText: {
// //     marginTop: 8,
// //     fontSize: 14,
// //   },
// //   playButtonOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   playButton: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   durationBadge: {
// //     position: 'absolute',
// //     bottom: 10,
// //     right: 10,
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 4,
// //   },
// //   durationText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   videoStats: {
// //     flexDirection: 'row',
// //     marginBottom: 8,
// //   },
// //   statItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 16,
// //   },
// //   statText: {
// //     fontSize: 12,
// //     marginLeft: 4,
// //   },
// //   postContent: {
// //     padding: 16,
// //   },
// //   postHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     marginBottom: 8,
// //   },
// //   postTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     flex: 1,
// //     marginRight: 12,
// //   },
// //   postText: {
// //     fontSize: 15,
// //     flex: 1,
// //     marginRight: 12,
// //     lineHeight: 22,
// //   },
// //   postPrice: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     marginBottom: 4,
// //   },
// //   postStats: {
// //     flexDirection: 'row',
// //     marginTop: 8,
// //     flexWrap: 'wrap',
// //   },
// //   postStat: {
// //     fontSize: 13,
// //     marginRight: 16,
// //   },
// //   postDate: {
// //     fontSize: 12,
// //   },
  
// //   // Image Viewer Styles
// //   imageViewerOverlay: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //   },
// //   imageViewerCloseButton: {
// //     position: 'absolute',
// //     top: Platform.OS === 'ios' ? 50 : 30,
// //     right: 20,
// //     zIndex: 10,
// //     padding: 10,
// //   },
// //   imageViewerInfoButton: {
// //     position: 'absolute',
// //     top: Platform.OS === 'ios' ? 50 : 30,
// //     left: 20,
// //     zIndex: 10,
// //     padding: 10,
// //   },
// //   imageViewerScrollContent: {
// //     flexGrow: 1,
// //     justifyContent: 'center',
// //   },
// //   imageViewerImage: {
// //     width: width,
// //     height: height,
// //   },
// //   imageViewerDetails: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     padding: 20,
// //     paddingBottom: Platform.OS === 'ios' ? 40 : 30,
// //   },
// //   imageViewerDetailsHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   imageViewerUserInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   imageViewerAvatar: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   imageViewerAvatarText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: '600',
// //   },
// //   imageViewerUsername: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginBottom: 2,
// //   },
// //   imageViewerTimestamp: {
// //     color: 'rgba(255,255,255,0.7)',
// //     fontSize: 12,
// //   },
// //   imageViewerContent: {
// //     marginBottom: 15,
// //   },
// //   imageViewerTitle: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 5,
// //   },
// //   imageViewerPrice: {
// //     color: '#27ae60',
// //     fontSize: 20,
// //     fontWeight: '700',
// //     marginBottom: 8,
// //   },
// //   imageViewerDescription: {
// //     color: 'rgba(255,255,255,0.9)',
// //     fontSize: 14,
// //     lineHeight: 20,
// //   },
// //   imageViewerTweetContent: {
// //     color: '#fff',
// //     fontSize: 16,
// //     lineHeight: 24,
// //   },
// //   imageViewerStats: {
// //     flexDirection: 'row',
// //     borderTopWidth: 1,
// //     borderTopColor: 'rgba(255,255,255,0.2)',
// //     paddingTop: 15,
// //   },
// //   imageViewerStat: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 25,
// //   },
// //   imageViewerStatText: {
// //     color: '#fff',
// //     marginLeft: 6,
// //     fontSize: 14,
// //   },
  
// //   // Video Modal Styles
// //   videoModalOverlay: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //   },
// //   videoModalContent: {
// //     flex: 1,
// //   },
// //   videoCloseButton: {
// //     position: 'absolute',
// //     top: Platform.OS === 'ios' ? 50 : 30,
// //     right: 20,
// //     zIndex: 20,
// //     padding: 10,
// //   },
// //   videoWrapper: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     position: 'relative',
// //   },
// //   videoPlayer: {
// //     width: width,
// //     height: height,
// //   },
// //   videoLoadingOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     zIndex: 5,
// //   },
// //   videoLoadingText: {
// //     color: '#fff',
// //     marginTop: 10,
// //     fontSize: 14,
// //   },
// //   videoErrorOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.8)',
// //     zIndex: 5,
// //   },
// //   videoErrorText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     marginTop: 10,
// //     marginBottom: 20,
// //   },
// //   retryButton: {
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 5,
// //   },
// //   retryButtonText: {
// //     color: '#fff',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   videoInfoOverlay: {
// //     position: 'absolute',
// //     top: 50,
// //     left: 20,
// //     right: 20,
// //     backgroundColor: 'rgba(0,0,0,0.6)',
// //     padding: 16,
// //     borderRadius: 10,
// //     zIndex: 10,
// //   },
// //   videoInfoTitle: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 8,
// //   },
// //   videoInfoStats: {
// //     flexDirection: 'row',
// //   },
// //   videoInfoStat: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 20,
// //   },
// //   videoInfoStatText: {
// //     color: '#fff',
// //     marginLeft: 6,
// //     fontSize: 14,
// //   },
// //   videoProgressContainer: {
// //     position: 'absolute',
// //     bottom: 100,
// //     left: 20,
// //     right: 20,
// //     zIndex: 10,
// //   },
// //   videoProgressBar: {
// //     height: 4,
// //     backgroundColor: 'rgba(255,255,255,0.3)',
// //     borderRadius: 2,
// //     marginBottom: 8,
// //   },
// //   videoProgressFill: {
// //     height: 4,
// //     backgroundColor: '#fff',
// //     borderRadius: 2,
// //   },
// //   videoTimeContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   videoTimeText: {
// //     color: '#fff',
// //     fontSize: 12,
// //   },
// //   videoControlsRow: {
// //     position: 'absolute',
// //     bottom: 30,
// //     left: 20,
// //     right: 20,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     zIndex: 10,
// //   },
// //   videoControlButton: {
// //     padding: 10,
// //   },
  
// //   // Modal Styles
// //   modalOverlay: {
// //     flex: 1,
// //     justifyContent: 'flex-end',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalBackdrop: {
// //     position: 'absolute',
// //     top: 0,
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //   },
// //   modalContainer: {
// //     borderTopLeftRadius: 16,
// //     borderTopRightRadius: 16,
// //     padding: 24,
// //     paddingBottom: 32,
// //   },
// //   modalHandle: {
// //     width: 40,
// //     height: 4,
// //     borderRadius: 2,
// //     alignSelf: 'center',
// //     marginBottom: 16,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 24,
// //     textAlign: 'center',
// //   },
// //   modalOption: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 16,
// //     borderBottomWidth: 1,
// //   },
// //   modalOptionText: {
// //     fontSize: 16,
// //     marginLeft: 16,
// //   },
// //   emptyContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 40,
// //   },
// //   emptyText: {
// //     fontSize: 18,
// //     textAlign: 'center',
// //     marginTop: 16,
// //     marginBottom: 24,
// //     lineHeight: 26,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingText: {
// //     marginTop: 12,
// //     fontSize: 16,
// //   },
// // });

// // export default ManagePostsScreen;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
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
//   Share
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Video from 'react-native-video';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { height, width } = Dimensions.get('window');

// const ManagePostsScreen = () => {
//   const { colors, isDark } = useTheme(); 
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState('marketplace');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(true);
  
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
//   const [videoPaused, setVideoPaused] = useState(false);
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

//   // Generate video thumbnail from Cloudinary URL
//   const getVideoThumbnail = (videoUrl) => {
//     if (!videoUrl) return null;
//     if (videoUrl.includes('cloudinary.com')) {
//       return videoUrl.replace('/video/upload/', '/video/upload/w_400,h_400,c_thumb/');
//     }
//     return null;
//   };

//   // Format duration
//   const formatDuration = (seconds) => {
//     if (!seconds) return null;
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

//   // Open video player modal
//   const openVideoPlayer = async (video) => {
//     const url = getSecureUrl(video.video);
//     console.log('Opening video URL:', url);
    
//     setCurrentVideo(video);
//     setVideoPlayerVisible(true);
//     setIsPlaying(true);
//     setVideoPaused(false);
//     setVideoLoading(true);
//     setVideoError(false);
//     setShowVideoControls(true);
//     setVideoProgress(0);
//   };

//   // Close video player modal
//   const closeVideoPlayer = () => {
//     setVideoPlayerVisible(false);
//     setIsPlaying(false);
//     setVideoPaused(true);
//     setCurrentVideo(null);
//     setVideoError(false);
//     setVideoLoading(false);
    
//     if (videoRef.current) {
//       videoRef.current.seek(0);
//     }
//   };

//   // Share video
//   const shareVideo = async (video) => {
//     try {
//       const videoUrl = getSecureUrl(video.video);
//       await Share.share({
//         message: `Check out this video: ${video.caption || video.title || 'My video'}`,
//         url: videoUrl,
//         title: 'Share Video'
//       });
//     } catch (error) {
//       console.error('Error sharing video:', error);
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
//         shadowColor: isDark ? '#000' : '#000',
//         shadowOpacity: isDark ? 0.1 : 0.05,
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
//         shadowColor: isDark ? '#000' : '#000',
//         shadowOpacity: isDark ? 0.1 : 0.05,
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
//     const videoUrl = getSecureUrl(item.video);
//     const thumbnailUrl = getVideoThumbnail(videoUrl);
    
//     return (
//       <View style={[styles.card, { 
//         backgroundColor: colors.card,
//         shadowColor: isDark ? '#000' : '#000',
//         shadowOpacity: isDark ? 0.1 : 0.05,
//       }]}>
//         <TouchableOpacity 
//           activeOpacity={0.9}
//           onPress={() => openVideoPlayer(item)}
//           style={styles.videoContainer}
//         >
//           {/* Video Thumbnail with Play Button */}
//           <View style={styles.videoThumbnailContainer}>
//             {thumbnailUrl ? (
//               <Image 
//                 source={{ uri: thumbnailUrl }} 
//                 style={styles.videoThumbnail}
//                 resizeMode="cover"
//               />
//             ) : (
//               <View style={[styles.videoThumbnail, styles.videoPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
//                 <Ionicons name="videocam" size={50} color={colors.primary} />
//                 <Text style={[styles.videoPlaceholderText, { color: colors.textSecondary }]}>
//                   {item.caption || 'Video Preview'}
//                 </Text>
//               </View>
//             )}
            
//             {/* Video Type Badge */}
//             <View style={[styles.videoTypeBadge, { backgroundColor: colors.primary }]}>
//               <Ionicons name="play" size={12} color="#fff" />
//               <Text style={styles.videoTypeText}>Short</Text>
//             </View>
            
//             {/* Duration Badge */}
//             {item.duration && (
//               <View style={styles.durationBadge}>
//                 <Ionicons name="time-outline" size={12} color="#fff" />
//                 <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
//               </View>
//             )}
            
//             {/* Play Button Overlay */}
//             <View style={styles.videoPlayOverlay}>
//               <View style={[styles.videoPlayButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
//                 <Ionicons name="play" size={30} color="#fff" />
//               </View>
//             </View>
            
//             {/* Video Quality/HD Badge */}
//             <View style={styles.videoQualityBadge}>
//               <Text style={styles.videoQualityText}>HD</Text>
//             </View>
//           </View>
          
//           {/* Video Progress Preview (if partially watched) */}
//           {item.watch_progress > 0 && (
//             <View style={styles.videoProgressPreview}>
//               <View 
//                 style={[
//                   styles.videoProgressPreviewFill, 
//                   { width: `${item.watch_progress}%`, backgroundColor: colors.primary }
//                 ]} 
//               />
//             </View>
//           )}
//         </TouchableOpacity>
        
//         <View style={styles.postContent}>
//           <View style={styles.postHeader}>
//             <View style={styles.videoTitleContainer}>
//               <Ionicons name="videocam" size={16} color={colors.primary} style={styles.videoTitleIcon} />
//               <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>
//                 {item.caption || item.title || 'Untitled Video'}
//               </Text>
//             </View>
//             <TouchableOpacity 
//               onPress={() => toggleModal(item)}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           </View>
          
//           {/* Video Description Preview */}
//           {item.description && (
//             <Text style={[styles.videoDescription, { color: colors.textSecondary }]} numberOfLines={2}>
//               {item.description}
//             </Text>
//           )}
          
//           <View style={styles.videoMetaContainer}>
//             {/* Stats Row */}
//             <View style={styles.videoStats}>
//               <View style={styles.statItem}>
//                 <Ionicons name="heart" size={14} color="#ff6b6b" />
//                 <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                   {item.like_count || item.likes || 0}
//                 </Text>
//               </View>
              
//               <View style={styles.statItem}>
//                 <Ionicons name="chatbubble" size={14} color={colors.primary} />
//                 <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                   {item.comment_count || 0}
//                 </Text>
//               </View>
              
//               <View style={styles.statItem}>
//                 <Ionicons name="eye" size={14} color="#4ecdc4" />
//                 <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                   {item.view_count || 0}
//                 </Text>
//               </View>
//             </View>
            
//             {/* Date and Actions */}
//             <View style={styles.videoFooter}>
//               <View style={styles.videoDateContainer}>
//                 <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
//                 <Text style={[styles.postDate, { color: colors.textSecondary }]}>
//                   {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
//                 </Text>
//               </View>
              
//               <View style={styles.videoActions}>
//                 <TouchableOpacity 
//                   style={styles.videoActionButton}
//                   onPress={() => openVideoPlayer(item)}
//                 >
//                   <Ionicons name="play-circle-outline" size={20} color={colors.primary} />
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                   style={styles.videoActionButton}
//                   onPress={() => shareVideo(item)}
//                 >
//                   <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   // Image Viewer Modal Component
//   const ImageViewerModal = () => (
//     <Modal
//       visible={imageViewerVisible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={closeImageViewer}
//     >
//       <View style={styles.imageViewerOverlay}>
//         <StatusBar hidden />
        
//         {/* Close button */}
//         <TouchableOpacity
//           style={styles.imageViewerCloseButton}
//           onPress={closeImageViewer}
//         >
//           <Ionicons name="close" size={30} color="#fff" />
//         </TouchableOpacity>
        
//         {/* Toggle details button */}
//         <TouchableOpacity
//           style={styles.imageViewerInfoButton}
//           onPress={toggleImageDetails}
//         >
//           <Ionicons name="information-circle-outline" size={30} color="#fff" />
//         </TouchableOpacity>
        
//         {/* Image with scroll view for zoom */}
//         <ScrollView
//           maximumZoomScale={3}
//           minimumZoomScale={1}
//           showsHorizontalScrollIndicator={false}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.imageViewerScrollContent}
//         >
//           <Image
//             source={{ uri: selectedImage }}
//             style={styles.imageViewerImage}
//             resizeMode="contain"
//           />
//         </ScrollView>
        
//         {/* Post details overlay */}
//         {showImageDetails && imageViewerItem && (
//           <Animated.View 
//             style={[
//               styles.imageViewerDetails,
//               {
//                 backgroundColor: 'rgba(0,0,0,0.7)',
//               }
//             ]}
//           >
//             <View style={styles.imageViewerDetailsHeader}>
//               <View style={styles.imageViewerUserInfo}>
//                 <View style={[styles.imageViewerAvatar, { backgroundColor: colors.primary }]}>
//                   <Text style={styles.imageViewerAvatarText}>
//                     {imageViewerItem.user?.username?.[0]?.toUpperCase() || 'U'}
//                   </Text>
//                 </View>
//                 <View>
//                   <Text style={styles.imageViewerUsername}>
//                     {imageViewerItem.user?.username || 'User'}
//                   </Text>
//                   <Text style={styles.imageViewerTimestamp}>
//                     {new Date(imageViewerItem.created || imageViewerItem.created_at).toLocaleDateString()}
//                   </Text>
//                 </View>
//               </View>
//             </View>
            
//             <View style={styles.imageViewerContent}>
//               {selectedTab === 'marketplace' && (
//                 <>
//                   <Text style={styles.imageViewerTitle}>{imageViewerItem.title}</Text>
//                   <Text style={styles.imageViewerPrice}>₦{imageViewerItem.price}</Text>
//                   {imageViewerItem.description && (
//                     <Text style={styles.imageViewerDescription}>{imageViewerItem.description}</Text>
//                   )}
//                 </>
//               )}
              
//               {selectedTab === 'tweets' && (
//                 <Text style={styles.imageViewerTweetContent}>{imageViewerItem.content}</Text>
//               )}
//             </View>
            
//             <View style={styles.imageViewerStats}>
//               <View style={styles.imageViewerStat}>
//                 <Ionicons name="heart-outline" size={20} color="#fff" />
//                 <Text style={styles.imageViewerStatText}>
//                   {imageViewerItem.reactions?.length || imageViewerItem.likes || 0}
//                 </Text>
//               </View>
//               <View style={styles.imageViewerStat}>
//                 <Ionicons name="chatbubble-outline" size={20} color="#fff" />
//                 <Text style={styles.imageViewerStatText}>
//                   {imageViewerItem.comments?.length || imageViewerItem.comment_count || 0}
//                 </Text>
//               </View>
//             </View>
//           </Animated.View>
//         )}
//       </View>
//     </Modal>
//   );

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
//           onPress={() => setSelectedTab('marketplace')} 
//           style={[
//             styles.tab, 
//             { backgroundColor: 'transparent' },
//             selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
//           ]}
//           activeOpacity={0.7}
//         >
//           <Ionicons 
//             name="cart-outline" 
//             size={20} 
//             color={selectedTab === 'marketplace' ? '#fff' : colors.primary} 
//           />
//           <Text style={[
//             styles.tabText, 
//             { color: colors.primary },
//             selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
//           ]}>
//             Marketplace
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={() => setSelectedTab('tweets')} 
//           style={[
//             styles.tab, 
//             { backgroundColor: 'transparent' },
//             selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
//           ]}
//           activeOpacity={0.7}
//         >
//           <Ionicons 
//             name="chatbubble-outline" 
//             size={20} 
//             color={selectedTab === 'tweets' ? '#fff' : colors.primary} 
//           />
//           <Text style={[
//             styles.tabText, 
//             { color: colors.primary },
//             selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
//           ]}>
//             Broadcast
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
//           <Ionicons 
//             name="videocam-outline" 
//             size={20} 
//             color={selectedTab === 'videos' ? '#fff' : colors.primary} 
//           />
//           <Text style={[
//             styles.tabText, 
//             { color: colors.primary },
//             selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
//           ]}>
//             Videos
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

//       {/* Video Player Modal */}
//       <Modal
//         visible={videoPlayerVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeVideoPlayer}
//         presentationStyle="fullScreen"
//       >
//         <View style={styles.videoModalOverlay}>
//           <StatusBar hidden />
          
//           <TouchableOpacity
//             activeOpacity={1}
//             onPress={() => setShowVideoControls(!showVideoControls)}
//             style={styles.videoModalContent}
//           >
//             {/* Close button */}
//             {showVideoControls && (
//               <TouchableOpacity
//                 style={styles.videoCloseButton}
//                 onPress={closeVideoPlayer}
//               >
//                 <Ionicons name="close" size={30} color="#fff" />
//               </TouchableOpacity>
//             )}

//             {/* Video Player */}
//             {currentVideo && (
//               <View style={styles.videoWrapper}>
//                 {videoLoading && !videoError && (
//                   <View style={styles.videoLoadingOverlay}>
//                     <ActivityIndicator size="large" color={colors.primary} />
//                     <Text style={styles.videoLoadingText}>Loading video...</Text>
//                   </View>
//                 )}
                
//                 {videoError ? (
//                   <View style={styles.videoErrorOverlay}>
//                     <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
//                     <Text style={styles.videoErrorText}>Failed to load video</Text>
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
//                     source={{ uri: getSecureUrl(currentVideo.video) }}
//                     style={styles.videoPlayer}
//                     resizeMode="contain"
//                     paused={!isPlaying}
//                     repeat={false}
//                     controls={false}
//                     muted={isMuted}
//                     volume={1.0}
//                     onLoad={(data) => {
//                       console.log('Video loaded:', data);
//                       setVideoLoading(false);
//                       setVideoError(false);
//                       setVideoDuration(data.duration);
//                     }}
//                     onLoadStart={() => {
//                       setVideoLoading(true);
//                       setVideoError(false);
//                     }}
//                     onError={(error) => {
//                       console.log('Video error:', error);
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
//                     bufferConfig={{
//                       minBufferMs: 15000,
//                       maxBufferMs: 50000,
//                       bufferForPlaybackMs: 2500,
//                       bufferForPlaybackAfterRebufferMs: 5000
//                     }}
//                   />
//                 )}
                
//                 {/* Video Controls */}
//                 {showVideoControls && !videoLoading && !videoError && (
//                   <>
//                     {/* Video Info */}
//                     <View style={styles.videoInfoOverlay}>
//                       <Text style={styles.videoInfoTitle}>
//                         {currentVideo.caption || currentVideo.title || 'Video'}
//                       </Text>
//                       <View style={styles.videoInfoStats}>
//                         <View style={styles.videoInfoStat}>
//                           <Ionicons name="heart" size={16} color="#fff" />
//                           <Text style={styles.videoInfoStatText}>
//                             {currentVideo.like_count || currentVideo.likes || 0}
//                           </Text>
//                         </View>
//                         <View style={styles.videoInfoStat}>
//                           <Ionicons name="chatbubble" size={16} color="#fff" />
//                           <Text style={styles.videoInfoStatText}>
//                             {currentVideo.comment_count || 0}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>

//                     {/* Progress Bar */}
//                     <View style={styles.videoProgressContainer}>
//                       <View style={styles.videoProgressBar}>
//                         <View 
//                           style={[
//                             styles.videoProgressFill,
//                             { width: `${(videoProgress / videoDuration) * 100}%` }
//                           ]} 
//                         />
//                       </View>
//                       <View style={styles.videoTimeContainer}>
//                         <Text style={styles.videoTimeText}>{formatTime(videoProgress)}</Text>
//                         <Text style={styles.videoTimeText}>{formatTime(videoDuration)}</Text>
//                       </View>
//                     </View>

//                     {/* Play/Pause and Mute buttons */}
//                     <View style={styles.videoControlsRow}>
//                       <TouchableOpacity
//                         style={styles.videoControlButton}
//                         onPress={() => setIsPlaying(!isPlaying)}
//                       >
//                         <Ionicons 
//                           name={isPlaying ? 'pause' : 'play'} 
//                           size={40} 
//                           color="#fff" 
//                         />
//                       </TouchableOpacity>
                      
//                       <TouchableOpacity
//                         style={styles.videoControlButton}
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
//   card: {
//     borderRadius: 12,
//     marginBottom: 16,
//     overflow: 'hidden',
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
//   videoContainer: {
//     position: 'relative',
//     width: '100%',
//   },
//   videoThumbnailContainer: {
//     position: 'relative',
//     width: '100%',
//     height: 220,
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: '100%',
//   },
//   videoPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoPlaceholderText: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   videoTypeBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 16,
//     zIndex: 2,
//   },
//   videoTypeText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   videoPlayOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.2)',
//   },
//   videoPlayButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.8)',
//   },
//   durationBadge: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     zIndex: 2,
//   },
//   durationText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   videoQualityBadge: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     zIndex: 2,
//   },
//   videoQualityText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   videoProgressPreview: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   videoProgressPreviewFill: {
//     height: 4,
//   },
//   videoTitleContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   videoTitleIcon: {
//     marginRight: 6,
//   },
//   videoDescription: {
//     fontSize: 13,
//     lineHeight: 18,
//     marginBottom: 8,
//   },
//   videoMetaContainer: {
//     marginTop: 8,
//   },
//   videoStats: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   statText: {
//     fontSize: 13,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   videoFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   videoDateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   videoActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   videoActionButton: {
//     marginLeft: 16,
//     padding: 4,
//   },
//   videoPlaceholderText: {
//     marginTop: 8,
//     fontSize: 14,
//   },
//   playButtonOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoStats: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   statText: {
//     fontSize: 12,
//     marginLeft: 4,
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
  
//   // Video Modal Styles
//   videoModalOverlay: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   videoModalContent: {
//     flex: 1,
//   },
//   videoCloseButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     right: 20,
//     zIndex: 20,
//     padding: 10,
//   },
//   videoWrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   videoPlayer: {
//     width: width,
//     height: height,
//   },
//   videoLoadingOverlay: {
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
//   videoLoadingText: {
//     color: '#fff',
//     marginTop: 10,
//     fontSize: 14,
//   },
//   videoErrorOverlay: {
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
//   videoErrorText: {
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
//   videoInfoOverlay: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 16,
//     borderRadius: 10,
//     zIndex: 10,
//   },
//   videoInfoTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   videoInfoStats: {
//     flexDirection: 'row',
//   },
//   videoInfoStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   videoInfoStatText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontSize: 14,
//   },
//   videoProgressContainer: {
//     position: 'absolute',
//     bottom: 100,
//     left: 20,
//     right: 20,
//     zIndex: 10,
//   },
//   videoProgressBar: {
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 2,
//     marginBottom: 8,
//   },
//   videoProgressFill: {
//     height: 4,
//     backgroundColor: '#fff',
//     borderRadius: 2,
//   },
//   videoTimeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   videoTimeText: {
//     color: '#fff',
//     fontSize: 12,
//   },
//   videoControlsRow: {
//     position: 'absolute',
//     bottom: 30,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   videoControlButton: {
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
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext'; 

const { height, width } = Dimensions.get('window');

// Video Player Component for thumbnails
const VideoThumbnailPlayer = ({ uri, isPlaying, onPress, style, caption }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [uri]);

  const handleProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const handleLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

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
        onLoad={handleLoad}
        onProgress={handleProgress}
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
      
      {/* Play Overlay */}
      {!isPlaying && !isLoading && !hasError && (
        <View style={styles.playOverlay}>
          <View style={styles.playIconContainer}>
            <MaterialIcon name="play-arrow" size={28} color="#fff" />
          </View>
        </View>
      )}
      
      {/* Progress Bar - Only show when playing */}
      {isPlaying && !isLoading && !hasError && duration > 0 && (
        <View style={styles.videoProgressOverlay}>
          <View style={styles.videoProgressBar}>
            <View 
              style={[
                styles.videoProgressFill, 
                { width: `${(currentTime / duration) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.videoTimeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      )}
      
      {/* Video Badge */}
      <View style={styles.videoBadge}>
        <MaterialIcon name="videocam" size={10} color="white" />
        <Text style={styles.badgeText}>VIDEO</Text>
      </View>
      
      {/* Duration Badge (when not playing) */}
      {!isPlaying && duration > 0 && (
        <View style={styles.durationBadgeVideo}>
          <MaterialIcon name="access-time" size={10} color="white" />
          <Text style={styles.badgeText}>{formatTime(duration)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Video Card Component
const VideoCard = memo(({ item, onPress, onOptionsPress, isPlaying, onPlayPress, colors }) => {
  const [isPressed, setIsPressed] = useState(false);
  const videoUrl = item.video;
  
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Pressable 
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => onPress(item)}
      style={[
        styles.videoCard,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        isPressed && styles.cardPressed
      ]}
    >
      {/* Video Thumbnail with Player */}
      <View style={styles.videoThumbnailWrapper}>
        <VideoThumbnailPlayer
          uri={videoUrl}
          isPlaying={isPlaying}
          onPress={() => onPlayPress(item)}
          style={styles.videoThumbnail}
          caption={item.caption}
        />
        
        {/* Views Count Overlay */}
        <View style={styles.viewsOverlay}>
          <Ionicons name="eye" size={12} color="#fff" />
          <Text style={styles.viewsText}>{formatNumber(item.view_count || 0)} views</Text>
        </View>
      </View>

      {/* Video Info */}
      <View style={styles.videoInfo}>
        <View style={styles.videoHeader}>
          <View style={styles.videoTitleContainer}>
            <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={1}>
              {item.caption || item.title || 'Untitled Video'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => onOptionsPress(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Video Description */}
        {item.description && (
          <Text style={[styles.videoDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Engagement Stats */}
        <View style={styles.engagementStats}>
          <View style={styles.statGroup}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={14} color="#ff6b6b" />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {formatNumber(item.like_count || item.likes || 0)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={14} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {formatNumber(item.comment_count || 0)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="share-social" size={14} color="#4ecdc4" />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {formatNumber(item.share_count || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <MaterialIcon name="access-time" size={12} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={[styles.videoActions, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary + '10' }]}
            onPress={() => onPlayPress(item)}
          >
            <MaterialIcon name="play-arrow" size={18} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Play</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => shareVideo(item)}
          >
            <FeatherIcon name="share-2" size={16} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
});

// Share function
const shareVideo = async (video) => {
  try {
    await Share.share({
      message: `Check out this video: ${video.caption || video.title || 'My video'}`,
      title: 'Share Video'
    });
  } catch (error) {
    console.error('Error sharing video:', error);
  }
};

const ManagePostsScreen = () => {
  const { colors, isDark } = useTheme(); 
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('marketplace');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  
  // Image viewer states
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageViewerItem, setImageViewerItem] = useState(null);
  const [showImageDetails, setShowImageDetails] = useState(true);
  
  // Video player states
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);
  const imageScale = useRef(new Animated.Value(1)).current;
  const imagePan = useRef(new Animated.ValueXY()).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  // Auto-hide video controls
  useEffect(() => {
    if (showVideoControls && !videoLoading && !videoError) {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      controlsTimeout.current = setTimeout(() => {
        setShowVideoControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showVideoControls, videoLoading, videoError]);

  const getSecureUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    return url;
  };

  // Open image viewer
  const openImageViewer = (item, imageUrl) => {
    setSelectedImage(imageUrl);
    setImageViewerItem(item);
    setImageViewerVisible(true);
    setShowImageDetails(true);
    imageScale.setValue(1);
    imagePan.setValue({ x: 0, y: 0 });
  };

  // Close image viewer
  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImage(null);
    setImageViewerItem(null);
  };

  // Toggle image details
  const toggleImageDetails = () => {
    setShowImageDetails(!showImageDetails);
  };

  // Handle video play in grid
  const handleVideoPlay = (video) => {
    if (playingVideoId === video.id) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(video.id);
    }
  };

  // Open fullscreen video player
  const openFullscreenVideo = (video) => {
    setCurrentVideo(video);
    setVideoPlayerVisible(true);
    setIsPlaying(true);
    setVideoLoading(true);
    setVideoError(false);
    setShowVideoControls(true);
    setVideoProgress(0);
    setPlayingVideoId(null); // Stop grid playback
  };

  // Close video player modal
  const closeVideoPlayer = () => {
    setVideoPlayerVisible(false);
    setIsPlaying(false);
    setCurrentVideo(null);
    setVideoError(false);
    setVideoLoading(false);
    
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  // Format time for video progress
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      
      if (isMounted.current) {
        console.log('Fetched videos:', res.data);
        setUserVideos(res.data || []);
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

  // Fetch all data
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

  // Refresh data when screen comes into focus
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
        {
          text: "Cancel",
          style: "cancel"
        },
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

  const renderMarketplacePost = ({ item }) => {
    const imageUrl = getSecureUrl(item.images?.[0]?.image);
    
    return (
      <View style={[styles.card, { 
        backgroundColor: colors.card,
        borderColor: colors.border,
      }]}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => openImageViewer(item, imageUrl)}
          disabled={!imageUrl}
        >
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="image-outline" size={50} color={colors.textSecondary} />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity 
              onPress={() => toggleModal(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>₦{item.price}</Text>
          <Text style={[styles.postDate, { color: colors.textSecondary }]}>
            {new Date(item.created).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderTweet = ({ item }) => {
    const imageUrl = getSecureUrl(item.image_url);
    
    return (
      <View style={[styles.card, { 
        backgroundColor: colors.card,
        borderColor: colors.border,
      }]}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => openImageViewer(item, imageUrl)}
          disabled={!imageUrl}
        >
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="chatbubble-outline" size={50} color={colors.textSecondary} />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Text style={[styles.postText, { color: colors.text }]} numberOfLines={3}>{item.content}</Text>
            <TouchableOpacity 
              onPress={() => toggleModal(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.postStats}>
            <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.reactions?.length || 0} reactions</Text>
            <Text style={[styles.postDate, { color: colors.textSecondary }]}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderVideo = ({ item }) => {
    return (
      <VideoCard
        item={item}
        onPress={openFullscreenVideo}
        onOptionsPress={toggleModal}
        onPlayPress={handleVideoPlay}
        isPlaying={playingVideoId === item.id}
        colors={colors}
      />
    );
  };

  // Image Viewer Modal Component
  const ImageViewerModal = () => (
    <Modal
      visible={imageViewerVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeImageViewer}
    >
      <View style={styles.imageViewerOverlay}>
        <StatusBar hidden />
        
        {/* Close button */}
        <TouchableOpacity
          style={styles.imageViewerCloseButton}
          onPress={closeImageViewer}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        
        {/* Toggle details button */}
        <TouchableOpacity
          style={styles.imageViewerInfoButton}
          onPress={toggleImageDetails}
        >
          <Ionicons name="information-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
        
        {/* Image with scroll view for zoom */}
        <ScrollView
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.imageViewerScrollContent}
        >
          <Image
            source={{ uri: selectedImage }}
            style={styles.imageViewerImage}
            resizeMode="contain"
          />
        </ScrollView>
        
        {/* Post details overlay */}
        {showImageDetails && imageViewerItem && (
          <Animated.View 
            style={[
              styles.imageViewerDetails,
              {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            ]}
          >
            {/* <View style={styles.imageViewerDetailsHeader}>
              <View style={styles.imageViewerUserInfo}>
                <View style={[styles.imageViewerAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.imageViewerAvatarText}>
                    {imageViewerItem.user?.username?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.imageViewerUsername}>
                    {imageViewerItem.user?.username || 'User'}
                  </Text>
                  <Text style={styles.imageViewerTimestamp}>
                    {new Date(imageViewerItem.created || imageViewerItem.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View> */}
            
            <View style={styles.imageViewerContent}>
              {selectedTab === 'marketplace' && (
                <>
                  <Text style={styles.imageViewerTitle}>{imageViewerItem.title}</Text>
                  <Text style={styles.imageViewerPrice}>₦{imageViewerItem.price}</Text>
                  {imageViewerItem.description && (
                    <Text style={styles.imageViewerDescription}>{imageViewerItem.description}</Text>
                  )}
                </>
              )}
              
              {selectedTab === 'tweets' && (
                <Text style={styles.imageViewerTweetContent}>{imageViewerItem.content}</Text>
              )}
            </View>
            
            {/* <View style={styles.imageViewerStats}>
              <View style={styles.imageViewerStat}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
                <Text style={styles.imageViewerStatText}>
                  {imageViewerItem.reactions?.length || imageViewerItem.likes || 0}
                </Text>
              </View>
              <View style={styles.imageViewerStat}>
                <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                <Text style={styles.imageViewerStatText}>
                  {imageViewerItem.comments?.length || imageViewerItem.comment_count || 0}
                </Text>
              </View>
            </View> */}
          </Animated.View>
        )}
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
      {/* Header */}
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

      {/* Tab Bar */}
      <View style={[styles.tabContainer, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => setSelectedTab('marketplace')} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="cart-outline" 
            size={20} 
            color={selectedTab === 'marketplace' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Marketplace
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setSelectedTab('tweets')} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={20} 
            color={selectedTab === 'tweets' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Broadcast
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setSelectedTab('videos')} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="videocam-outline" 
            size={20} 
            color={selectedTab === 'videos' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Videos
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
          data={currentData()}
          renderItem={
            selectedTab === 'marketplace'
              ? renderMarketplacePost
              : selectedTab === 'tweets'
              ? renderTweet
              : renderVideo
          }
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}

      {/* Image Viewer Modal */}
      <ImageViewerModal />

      {/* Fullscreen Video Player Modal */}
      <Modal
        visible={videoPlayerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideoPlayer}
        presentationStyle="fullScreen"
      >
        <View style={styles.fullscreenVideoOverlay}>
          <StatusBar hidden />
          
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowVideoControls(!showVideoControls)}
            style={styles.fullscreenVideoContent}
          >
            {/* Close button */}
            {showVideoControls && (
              <TouchableOpacity
                style={styles.fullscreenCloseButton}
                onPress={closeVideoPlayer}
              >
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
            )}

            {/* Video Player */}
            {currentVideo && (
              <View style={styles.fullscreenVideoWrapper}>
                {videoLoading && !videoError && (
                  <View style={styles.fullscreenLoadingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading video...</Text>
                  </View>
                )}
                
                {videoError ? (
                  <View style={styles.fullscreenErrorOverlay}>
                    <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
                    <Text style={styles.errorTitle}>Failed to load video</Text>
                    <TouchableOpacity 
                      style={[styles.retryButton, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        setVideoError(false);
                        setVideoLoading(true);
                      }}
                    >
                      <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Video
                    ref={videoRef}
                    source={{ uri: currentVideo.video }}
                    style={styles.fullscreenVideoPlayer}
                    resizeMode="contain"
                    paused={!isPlaying}
                    repeat={false}
                    controls={false}
                    muted={isMuted}
                    volume={1.0}
                    onLoad={(data) => {
                      setVideoLoading(false);
                      setVideoError(false);
                      setVideoDuration(data.duration);
                    }}
                    onLoadStart={() => {
                      setVideoLoading(true);
                      setVideoError(false);
                    }}
                    onError={(error) => {
                      setVideoLoading(false);
                      setVideoError(true);
                    }}
                    onProgress={(data) => {
                      setVideoProgress(data.currentTime);
                    }}
                    onEnd={() => {
                      setIsPlaying(false);
                      if (videoRef.current) {
                        videoRef.current.seek(0);
                      }
                    }}
                  />
                )}
                
                {/* Video Controls */}
                {showVideoControls && !videoLoading && !videoError && (
                  <>
                    {/* Video Info */}
                    <View style={styles.fullscreenVideoInfo}>
                      <Text style={styles.fullscreenVideoTitle}>
                        {currentVideo.caption || currentVideo.title || 'Video'}
                      </Text>
                      <View style={styles.fullscreenVideoStats}>
                        <View style={styles.fullscreenStat}>
                          <Ionicons name="heart" size={16} color="#fff" />
                          <Text style={styles.fullscreenStatText}>
                            {currentVideo.like_count || currentVideo.likes || 0}
                          </Text>
                        </View>
                        <View style={styles.fullscreenStat}>
                          <Ionicons name="chatbubble" size={16} color="#fff" />
                          <Text style={styles.fullscreenStatText}>
                            {currentVideo.comment_count || 0}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.fullscreenProgressContainer}>
                      <View style={styles.fullscreenProgressBar}>
                        <View 
                          style={[
                            styles.fullscreenProgressFill,
                            { width: `${(videoProgress / videoDuration) * 100}%` }
                          ]} 
                        />
                      </View>
                      <View style={styles.fullscreenTimeContainer}>
                        <Text style={styles.fullscreenTimeText}>{formatTime(videoProgress)}</Text>
                        <Text style={styles.fullscreenTimeText}>{formatTime(videoDuration)}</Text>
                      </View>
                    </View>

                    {/* Play/Pause and Mute buttons */}
                    <View style={styles.fullscreenControlsRow}>
                      <TouchableOpacity
                        style={styles.fullscreenControlButton}
                        onPress={() => setIsPlaying(!isPlaying)}
                      >
                        <Ionicons 
                          name={isPlaying ? 'pause' : 'play'} 
                          size={50} 
                          color="#fff" 
                        />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.fullscreenControlButton}
                        onPress={() => setIsMuted(!isMuted)}
                      >
                        <Ionicons 
                          name={isMuted ? 'volume-mute' : 'volume-high'} 
                          size={30} 
                          color="#fff" 
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Modal>

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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // Video Card Styles
  videoCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  videoThumbnailWrapper: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  videoThumbnail: {
    flex: 1,
  },
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
  videoProgressOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  videoProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  videoProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  videoTimeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    textAlign: 'center',
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationBadgeVideo: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  viewsOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewsText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 16,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  videoDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  engagementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
  },
  videoActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Marketplace/Tweet Card Styles
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  postText: {
    fontSize: 15,
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  postPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  postStat: {
    fontSize: 13,
    marginRight: 16,
  },
  postDate: {
    fontSize: 12,
  },
  
  // Image Viewer Styles
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageViewerCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  imageViewerInfoButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  imageViewerScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  imageViewerImage: {
    width: width,
    height: height,
  },
  imageViewerDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  imageViewerDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageViewerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageViewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imageViewerAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  imageViewerUsername: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  imageViewerTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  imageViewerContent: {
    marginBottom: 15,
  },
  imageViewerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  imageViewerPrice: {
    color: '#27ae60',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  imageViewerDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  imageViewerTweetContent: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  imageViewerStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 15,
  },
  imageViewerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  imageViewerStatText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  
  // Fullscreen Video Modal Styles
  fullscreenVideoOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenVideoContent: {
    flex: 1,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 20,
    padding: 10,
  },
  fullscreenVideoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fullscreenVideoPlayer: {
    width: width,
    height: height,
  },
  fullscreenLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 5,
  },
  fullscreenErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 5,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fullscreenVideoInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 10,
    zIndex: 10,
  },
  fullscreenVideoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  fullscreenVideoStats: {
    flexDirection: 'row',
  },
  fullscreenStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  fullscreenStatText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  fullscreenProgressContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  fullscreenProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  fullscreenProgressFill: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  fullscreenTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullscreenTimeText: {
    color: '#fff',
    fontSize: 12,
  },
  fullscreenControlsRow: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  fullscreenControlButton: {
    padding: 10,
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