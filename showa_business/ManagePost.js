

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
  PanResponder
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
  const [selectedTab, setSelectedTab] = useState('tweets');
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
  // const ImageViewerModal = () => (
  //   <Modal
  //     visible={imageViewerVisible}
  //     transparent={true}
  //     animationType="fade"
  //     onRequestClose={closeImageViewer}
  //   >
  //     <View style={styles.imageViewerOverlay}>
  //       <StatusBar hidden />
        
  //       {/* Close button */}
  //       <TouchableOpacity
  //         style={styles.imageViewerCloseButton}
  //         onPress={closeImageViewer}
  //       >
  //         <Ionicons name="close" size={30} color="#fff" />
  //       </TouchableOpacity>
        
  //       {/* Toggle details button */}
  //       <TouchableOpacity
  //         style={styles.imageViewerInfoButton}
  //         onPress={toggleImageDetails}
  //       >
  //         <Ionicons name="information-circle-outline" size={30} color="#fff" />
  //       </TouchableOpacity>
        
  //       {/* Image with scroll view for zoom */}
  //       <ScrollView
  //         maximumZoomScale={3}
  //         minimumZoomScale={1}
  //         showsHorizontalScrollIndicator={false}
  //         showsVerticalScrollIndicator={false}
  //         contentContainerStyle={styles.imageViewerScrollContent}
  //       >
  //         <Image
  //           source={{ uri: selectedImage }}
  //           style={styles.imageViewerImage}
  //           resizeMode="contain"
  //         />
  //       </ScrollView>
        
  //       {/* Post details overlay */}
  //       {showImageDetails && imageViewerItem && (
  //         <Animated.View 
  //           style={[
  //             styles.imageViewerDetails,
  //             {
  //               backgroundColor: 'rgba(0,0,0,0.7)',
  //             }
  //           ]}
  //         >
  //           {/* <View style={styles.imageViewerDetailsHeader}>
  //             <View style={styles.imageViewerUserInfo}>
  //               <View style={[styles.imageViewerAvatar, { backgroundColor: colors.primary }]}>
  //                 <Text style={styles.imageViewerAvatarText}>
  //                   {imageViewerItem.user?.username?.[0]?.toUpperCase() || 'U'}
  //                 </Text>
  //               </View>
  //               <View>
  //                 <Text style={styles.imageViewerUsername}>
  //                   {imageViewerItem.user?.username || 'User'}
  //                 </Text>
  //                 <Text style={styles.imageViewerTimestamp}>
  //                   {new Date(imageViewerItem.created || imageViewerItem.created_at).toLocaleDateString()}
  //                 </Text>
  //               </View>
  //             </View>
  //           </View> */}
            
  //           <View style={styles.imageViewerContent}>
  //             {selectedTab === 'marketplace' && (
  //               <>
  //                 <Text style={styles.imageViewerTitle}>{imageViewerItem.title}</Text>
  //                 <Text style={styles.imageViewerPrice}>₦{imageViewerItem.price}</Text>
  //                 {imageViewerItem.description && (
  //                   <Text style={styles.imageViewerDescription}>{imageViewerItem.description}</Text>
  //                 )}
  //               </>
  //             )}
              
  //             {selectedTab === 'tweets' && (
  //               <Text style={styles.imageViewerTweetContent}>{imageViewerItem.content}</Text>
  //             )}
  //           </View>
            
  //           {/* <View style={styles.imageViewerStats}>
  //             <View style={styles.imageViewerStat}>
  //               <Ionicons name="heart-outline" size={20} color="#fff" />
  //               <Text style={styles.imageViewerStatText}>
  //                 {imageViewerItem.reactions?.length || imageViewerItem.likes || 0}
  //               </Text>
  //             </View>
  //             <View style={styles.imageViewerStat}>
  //               <Ionicons name="chatbubble-outline" size={20} color="#fff" />
  //               <Text style={styles.imageViewerStatText}>
  //                 {imageViewerItem.comments?.length || imageViewerItem.comment_count || 0}
  //               </Text>
  //             </View>
  //           </View> */}
  //         </Animated.View>
  //       )}
  //     </View>
  //   </Modal>
  // );


  const ImageViewerModal = () => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only set pan responder when swiping vertically
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 0;
      },
      onPanResponderGrant: () => {
        // When gesture starts
        imagePan.y.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipe
        if (gestureState.dy > 0) {
          imagePan.y.setValue(gestureState.dy);
          
          // Fade background based on swipe distance
          const opacity = 1 - Math.min(gestureState.dy / 300, 0.5);
          imageScale.setValue(opacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped down more than 100px, close
        if (gestureState.dy > 100) {
          Animated.timing(imagePan.y, {
            toValue: height,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            closeImageViewer();
            imagePan.y.setValue(0);
            imageScale.setValue(1);
          });
        } else {
          // Otherwise snap back
          Animated.parallel([
            Animated.spring(imagePan.y, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(imageScale, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  if (!selectedImage) return null;

  return (
    <Modal
      visible={imageViewerVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeImageViewer}
      statusBarTranslucent={true}
    >
      <StatusBar hidden />
      
      {/* Background overlay with fade effect */}
      <Animated.View 
        style={[
          styles.imageViewerBackground,
          { opacity: imageScale }
        ]} 
      />
      
      {/* Main content with swipe gesture */}
      <Animated.View 
        style={[
          styles.imageViewerContainer,
          { transform: [{ translateY: imagePan.y }] }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Close button - top right */}
        <TouchableOpacity
          style={styles.imageViewerCloseButton}
          onPress={closeImageViewer}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <View style={styles.imageViewerCloseButtonInner}>
            <Ionicons name="close" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        
        {/* Share button - top left (optional) */}
        {imageViewerItem && (
          <TouchableOpacity
            style={styles.imageViewerShareButton}
            onPress={() => {
              // Add your share function here
              Alert.alert('Share', 'Share functionality');
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <View style={styles.imageViewerShareButtonInner}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
        
        {/* Swipe indicator - shows that you can swipe down */}
        <View style={styles.swipeIndicator}>
          <View style={styles.swipeIndicatorBar} />
        </View>
        
        {/* Image with zoom support */}
        <ScrollView
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.imageViewerScrollContent}
          bounces={false}
          scrollEnabled={true}
        >
          <Image
            source={{ uri: selectedImage }}
            style={styles.imageViewerImage}
            resizeMode="contain"
          />
        </ScrollView>
        
        {/* Subtle image counter at bottom */}
        <View style={styles.imageCounterContainer}>
          <Text style={styles.imageCounterText}>
            {selectedTab === 'marketplace' ? '📷 Listing Image' : '📷 Post Image'}
          </Text>
        </View>
        
        {/* Swipe down hint (appears briefly then fades) */}
        <Animated.View 
          style={[
            styles.swipeHint,
            { opacity: imageScale.interpolate({
                inputRange: [0.5, 1],
                outputRange: [0, 1]
              })
            }
          ]}
        >
          <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
          <Text style={styles.swipeHintText}>Swipe down to close</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
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
          {/* <Ionicons name="arrow-back" size={24} color={colors.text} /> */}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Posts</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Bar */}
     {/* Tab Bar */}
<View style={[styles.tabContainer, { 
  backgroundColor: colors.card,
  borderBottomColor: colors.border 
}]}>
  <TouchableOpacity 
    onPress={() => setSelectedTab('tweets')} 
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
    onPress={() => setSelectedTab('marketplace')} 
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
    onPress={() => setSelectedTab('videos')} 
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
  imageViewerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageViewerCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 20,
  },
  imageViewerCloseButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  imageViewerShareButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 20,
  },
  imageViewerShareButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  swipeIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 5,
    alignSelf: 'center',
    zIndex: 15,
  },
  swipeIndicatorBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  imageViewerScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  imageViewerImage: {
    width: width,
    height: height - 100, // Leave space for controls
  },
  imageCounterContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  swipeHint: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  swipeHintText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginLeft: 4,
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