

import React, { useState, useEffect, useCallback, useRef, memo, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  RefreshControl,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Share,
  StatusBar,
  ImageBackground,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icontt from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { createMMKV } from 'react-native-mmkv';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import dayjs from 'dayjs';
import LinearGradient from "react-native-linear-gradient";
import relativeTime from 'dayjs/plugin/relativeTime';
import Icon from 'react-native-vector-icons/Ionicons';
import Icont from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import axios from 'axios';
import BottomNav from '../components/BottomNavSocialMedia';
import FriendSuggestion from '../components/FriendSuggestion';
import { useTheme } from '../src/context/ThemeContext'; 
import Jobs from '../screens/Jobs';
import VideoFeeds from '../screens/ShortFeedVideo';
import AutoShort from '../showa_business/AutoShort';
import HangoutPlacesExplore from '../screens/HangoutPlacesExplore';
import Ads from '../screens/AdsFeed';
import EdateDiscoverScreen from '../screens/EdateDiscoverScreen';
import AccountSwitchBottomSheet from '../components/AccountSwitchBottomSheet';
import MusicListComponent from '../components/Emusic';
import EarningsSlideInManager from '../components/EarningsSlideInManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatusSection from '../components/StatusSection';
import Feather from 'react-native-vector-icons/Feather';
import IncomingCallHandler from '../components/Incomingcallhandler';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');

// Initialize MMKV storage
const storage = createMMKV({
  id: 'home-storage',
});

// Cache configuration
const POSTS_CACHE_KEY = 'posts_cache_v2'; 
const ALL_POSTS_CACHE_KEY = 'all_posts_cache_v2';
const VIEWS_CACHE_KEY = 'post_views_cache';
const SHARES_CACHE_KEY = 'post_shares_cache';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; 

// MMKV helper functions for views and shares
const trackPostView = async (postId) => {
  try {
    const viewsData = storage.getString(VIEWS_CACHE_KEY);
    const views = viewsData ? JSON.parse(viewsData) : {};
    
    if (!views[postId]) {
      views[postId] = {
        count: 1,
        timestamp: Date.now()
      };
    } else {
      const lastViewTime = views[postId].timestamp;
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - lastViewTime > oneDay) {
        views[postId].count += 1;
        views[postId].timestamp = Date.now();
      }
    }
    
    storage.set(VIEWS_CACHE_KEY, JSON.stringify(views));
    return views[postId].count;
  } catch (error) {
    console.error('Error tracking view:', error);
    return 0;
  }
};

const getPostViews = async (postId) => {
  try {
    const viewsData = storage.getString(VIEWS_CACHE_KEY);
    const views = viewsData ? JSON.parse(viewsData) : {};
    return views[postId]?.count || 0;
  } catch (error) {
    console.error('Error getting views:', error);
    return 0;
  }
};

const trackPostShare = async (postId) => {
  try {
    const sharesData = storage.getString(SHARES_CACHE_KEY);
    const shares = sharesData ? JSON.parse(sharesData) : {};
    
    if (!shares[postId]) {
      shares[postId] = {
        count: 1,
        timestamp: Date.now()
      };
    } else {
      shares[postId].count += 1;
      shares[postId].timestamp = Date.now();
    }
    
    storage.set(SHARES_CACHE_KEY, JSON.stringify(shares));
    return shares[postId].count;
  } catch (error) {
    console.error('Error tracking share:', error);
    return 0;
  }
};

const getPostShares = async (postId) => {
  try {
    const sharesData = storage.getString(SHARES_CACHE_KEY);
    const shares = sharesData ? JSON.parse(sharesData) : {};
    return shares[postId]?.count || 0;
  } catch (error) {
    return 0;
  }
};

 const getUserProfileImage = (profilePicture) => {
  if (!profilePicture) {
    return require('../assets/images/avatar/blank-profile-picture-973460_1280.png');
  }
  
  // Check if it's a valid URL
  if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
    // Check if it's not a null string
    if (profilePicture.includes('null') || profilePicture.endsWith('null')) {
      return require('../assets/images/avatar/blank-profile-picture-973460_1280.png');
    }
    return { uri: profilePicture };
  }
  
  // If it's a relative path, prepend API_ROUTE_IMAGE
  return { uri: `${API_ROUTE_IMAGE}${profilePicture}` };
};

const getViewsAndSharesMap = async () => {
  try {
    const viewsData = storage.getString(VIEWS_CACHE_KEY);
    const sharesData = storage.getString(SHARES_CACHE_KEY);
    return {
      views: viewsData ? JSON.parse(viewsData) : {},
      shares: sharesData ? JSON.parse(sharesData) : {},
    };
  } catch (error) {
    console.error('Error loading views/shares map:', error);
    return { views: {}, shares: {} };
  }
};

// Synchronous enhancer with batched map
const enhancePostsWithMap = (postsData, map, verifiedThreshold = 0.7) => {
  const { views, shares } = map;
  return postsData.map((post) => ({
    ...post,
    views: views[post.id]?.count || 0,
    shares: shares[post.id]?.count || 0,
    is_verified: Math.random() > verifiedThreshold,
  }));
};

const ImageModal = memo(({ visible, post, onClose, onView, colors, isDark }) => {
  const [viewsCount, setViewsCount] = useState(post?.views || 0);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(post?.selectedIndex || 0);
  
  const images = post?.images || (post?.image_url ? [{ url: post.image_url }] : []);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (visible && post?.id) {
      setImageLoading(true);
      const trackView = async () => {
        const newCount = await trackPostView(post.id);
        setViewsCount(newCount);
        if (onView) onView(post.id, newCount);
      };
      trackView();
    }
  }, [visible, post?.id]);

  useEffect(() => {
    if (visible && flatListRef.current && post?.selectedIndex !== undefined) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: post.selectedIndex,
          animated: false
        });
      }, 100);
    }
  }, [visible, post?.selectedIndex]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const onScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.modalImagePage}>
      {imageLoading && index === currentIndex && (
        <View style={styles.modalLoadingOverlay}>
          <View style={styles.modalCameraIconContainer}>
            <Ionicons name="camera" size={48} color="#fff" />
            <ActivityIndicator size="large" color="#fff" style={styles.modalLoadingIndicator} />
            <Text style={styles.modalLoadingText}>Loading image...</Text>
          </View>
        </View>
      )}
      
      <Image
        source={{ uri: item.url }}
        style={styles.fullSizeImage}
        resizeMode="contain"
        onLoad={handleImageLoad}
        onError={handleImageError}
        fadeDuration={500}
      />
      
      {images.length > 1 && (
        <View style={styles.imageCounterModal}>
          <Text style={styles.imageCounterModalText}>
            {index + 1} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );

  if (!post) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={[styles.imageModalOverlay, { backgroundColor: 'rgba(0,0,0,0.95)' }]}>
        <TouchableOpacity 
          style={styles.imageModalCloseButton}
          onPress={onClose}
        >
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.imageModalImageSection}>
          {images.length > 1 ? (
            <FlatList
              ref={flatListRef}
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                setCurrentIndex(index);
              }}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onScrollToIndexFailed={onScrollToIndexFailed}
              initialScrollIndex={post.selectedIndex}
            />
          ) : (
            <View style={styles.imageModalContent}>
              {imageLoading && (
                <View style={styles.modalLoadingOverlay}>
                  <View style={styles.modalCameraIconContainer}>
                    <Ionicons name="camera" size={48} color="#fff" />
                    <ActivityIndicator size="large" color="#fff" style={styles.modalLoadingIndicator} />
                    <Text style={styles.modalLoadingText}>Loading image...</Text>
                  </View>
                </View>
              )}
              
              <Image
                source={{ uri: images[0]?.url }}
                style={styles.fullSizeImage}
                resizeMode="contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
                fadeDuration={500}
              />
            </View>
          )}
        </View>
        
        <View style={[styles.imageModalInfoContainer, { backgroundColor: colors.card }]}>
          <ScrollView 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.imageModalInfoScrollContent}
            bounces={false}
          >
            <View style={styles.imageModalUserInfo}>
              {/* <Image
                source={
                  post.user_profile_picture
                    ? { uri: post.user_profile_picture }
                    : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                }
                style={styles.imageModalAvatar}
              /> */}

              <Image
  source={
    post.user_profile_picture
      ? getUserProfileImage(post.user_profile_picture)
      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
  }
  style={styles.imageModalAvatar}
/>
              
              <View style={styles.imageModalUserText}>
                <Text style={[styles.imageModalUsername, { color: colors.text }]}>
                  {post.username}
                </Text>
                <Text style={[styles.imageModalTime, { color: colors.textSecondary }]}>
                  {dayjs(post.created_at).fromNow()}
                </Text>
              </View>
            </View>
            
            {post.content ? (
              <Text style={[styles.imageModalCaption, { color: colors.text }]}>
                {post.content}
              </Text>
            ) : null}
            
            <View style={styles.imageModalStats}>
              <View style={styles.imageModalStat}>
                <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.imageModalStatText, { color: colors.textSecondary }]}>
                  {viewsCount} {viewsCount === 1 ? 'view' : 'views'}
                </Text>
              </View>
              {images.length > 1 && (
                <View style={styles.imageModalStat}>
                  <Ionicons name="images-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.imageModalStatText, { color: colors.textSecondary }]}>
                    {images.length} {images.length === 1 ? 'photo' : 'photos'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.imageModalStats}>
              {post.like_count > 0 && (
                <View style={styles.imageModalStat}>
                  <Ionicons name="heart-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.imageModalStatText, { color: colors.textSecondary }]}>
                    {post.like_count}
                  </Text>
                </View>
              )}
              {post.comment_count > 0 && (
                <View style={styles.imageModalStat}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.imageModalStatText, { color: colors.textSecondary }]}>
                    {post.comment_count}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});


const MemoizedTweetItem = memo(({ 
  post, 
  type, 
  onReaction, 
  onComment, 
  onShare, 
  onFollow, 
  onOptions, 
  onViewImage,
  colors,
  currentUserId,
  isDark 
}) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(post.is_followed_by_current_user || false);
  const [imageLoading, setImageLoading] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isReacting, setIsReacting] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(post.like_count || 0);
  const [localIsLiked, setLocalIsLiked] = useState(post.reactions?.user_reaction === 'like');
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const isInitialMount = useRef(true);

  const displayImages = post.all_images || 
    (post.image_url ? [{ url: post.image_url, is_main: true }] : []);

  const navigation = useNavigation();

  const isPostTrending = useMemo(() => {
    const postAge = dayjs().diff(dayjs(post.created_at), 'hour');
    const engagement = (post.like_count + post.comment_count) / (post.views || 1);
    return postAge < 24 && post.views > 50 && engagement > 0.1;
  }, [post.created_at, post.like_count, post.comment_count, post.views]);

  const handleFollowPress = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    onFollow(post.user_id);
  };

  const handleSharePress = async () => {
    await onShare(post.id);
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    onViewImage({ ...post, images: displayImages, selectedIndex: index });
  };

  const calculateNetworkScore = useCallback(() => {
    const likeWeight = 1;
    const commentWeight = 3;
    const shareWeight = 5;
    const viewWeight = 0.1;
    
    const score = (
      (localLikeCount || 0) * likeWeight +
      (post.comment_count || 0) * commentWeight +
      (post.share_count || 0) * shareWeight +
      (post.views || 0) * viewWeight
    );
    
    return Math.round(score);
  }, [localLikeCount, post.comment_count, post.share_count, post.views]);

  const getViralStatus = useCallback((score) => {
    if (score >= 1000) return { label: '🔥 Viral', color: '#FF6B35', emoji: '🚀' };
    if (score >= 500) return { label: '⭐ Trending', color: '#FFA500', emoji: '⭐' };
    if (score >= 200) return { label: '📈 Growing', color: '#4CAF50', emoji: '📈' };
    if (score >= 50) return { label: '👀 Getting Attention', color: '#2196F3', emoji: '👀' };
    if (score >= 10) return { label: '🌱 Starting', color: '#9E9E9E', emoji: '🌱' };
    return { label: '💤 Quiet', color: '#9E9E9E', emoji: '💤' };
  }, []);

  const networkScore = calculateNetworkScore();
  const viralStatus = getViralStatus(networkScore);

  const isOwnPost = post.user_id === currentUserId;

  // ONLY sync on initial mount - NEVER sync on updates
  // This prevents the props from overriding the local state after API calls
  useEffect(() => {
    if (isInitialMount.current) {
      setLocalLikeCount(post.like_count || 0);
      setLocalIsLiked(post.reactions?.user_reaction === 'like');
      isInitialMount.current = false;
    }
    // Intentionally empty dependency array - only runs once on mount
  }, []);

  // Optimized reaction handler with INSTANT local update
  const handleReactionPress = useCallback(() => {
    if (isReacting) return;
    
    // INSTANT local update
    const newLikedState = !localIsLiked;
    setLocalIsLiked(newLikedState);
    setLocalLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    
    setIsReacting(true);
    onReaction(post.id, 'like');
    
    // Keep the reacting state true for a moment
    setTimeout(() => {
      setIsReacting(false);
    }, 300);
  }, [post.id, onReaction, isReacting, localIsLiked]);

  const renderImageGrid = () => {
    if (displayImages.length === 0) return null;

    const imageCount = displayImages.length;

    if (imageCount === 1) {
      return (
        <TouchableOpacity 
          onPress={() => handleImagePress(0)}
          style={styles.singleImageContainer}
        >
          <Image
            source={{ uri: displayImages[0].url }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    if (imageCount === 2) {
      return (
        <View style={styles.doubleImageContainer}>
          {displayImages.map((img, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => handleImagePress(index)}
              style={styles.doubleImageWrapper}
            >
              <Image
                source={{ uri: img.url }}
                style={styles.doubleImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (imageCount === 3) {
      return (
        <View style={styles.tripleImageContainer}>
          <TouchableOpacity 
            onPress={() => handleImagePress(0)}
            style={styles.tripleMainImageWrapper}
          >
            <Image
              source={{ uri: displayImages[0].url }}
              style={styles.tripleMainImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          
          <View style={styles.tripleSideContainer}>
            {[1, 2].map((idx) => (
              <TouchableOpacity 
                key={idx}
                onPress={() => handleImagePress(idx)}
                style={styles.tripleSideImageWrapper}
              >
                <Image
                  source={{ uri: displayImages[idx].url }}
                  style={styles.tripleSideImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.quadImageContainer}>
        {displayImages.slice(0, 4).map((img, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => handleImagePress(index)}
            style={styles.quadImageWrapper}
          >
            <Image
              source={{ uri: img.url }}
              style={styles.quadImage}
              resizeMode="cover"
            />
            {index === 3 && displayImages.length > 4 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{displayImages.length - 4}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.tweetContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <View style={styles.tweetContent}>
        <View style={styles.tweetHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfile', { userId: post.user_id })}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  post.user_profile_picture
                    ? { uri: post.user_profile_picture }
                    : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                }
                style={[styles.avatar, { borderColor: colors.border }]}
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.userInfoContainer}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('OtherUserProfile', { userId: post.user_id })}
              style={styles.userNameContainer}
            >
              <Text style={[styles.name, { color: colors.text }]}>{post.username}</Text>
              {post.is_verified && (
                <View style={styles.verifiedBadge}>
                  <Icontt name="check-bold" size={11} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {dayjs(post.created_at).fromNow()}
            </Text>
          </View>
          
          {type === 'allposts' && !isOwnPost ? (
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={handleFollowPress}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => onOptions(post.id, post.user_id)}
            >
              <Icon name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={[styles.tweetText, { color: colors.text }]}>
          {post.content.length > 150 ? (
            <>
              {isReadMore ? post.content.slice(0, 150) + '...' : post.content}
              <Text 
                style={[styles.readMore, { color: colors.primary }]} 
                onPress={() => setIsReadMore(!isReadMore)}
              >
                {isReadMore ? ' Read more' : ' Show less'}
              </Text>
            </>
          ) : (
            post.content
          )}
        </Text>
        
        {isPostTrending && (
          <View style={styles.trendingContainer}>
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingIcon}>🔥</Text>
              <Text style={styles.trendingText}>Trending</Text>
            </View>
          </View>
        )}
        
        {renderImageGrid()}
        
        {/* 3-Button Actions Row - Responsive */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionsRow}>
            {/* Like Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleReactionPress}
              activeOpacity={0.7}
              disabled={isReacting}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons
                  name={localIsLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={localIsLiked ? '#0d64dd' : colors.textSecondary}
                />
                <Text style={[
                  styles.actionLabel,
                  { color: localIsLiked ? '#0d64dd' : colors.textSecondary }
                ]}>
                  Like
                </Text>
                {localLikeCount > 0 && (
                  <Text style={[
                    styles.actionCount,
                    { color: localIsLiked ? '#0d64dd' : colors.textSecondary }
                  ]}>
                    {localLikeCount}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                navigation.navigate('ExplorePostDetails', {
                  postId: post.id,
                  postData: post
                });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
                <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
                  Comment
                </Text>
                {post.comment_count > 0 && (
                  <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
                    {post.comment_count}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSharePress}
              activeOpacity={0.7}
            >
              <View style={styles.actionButtonContent}>
                <Feather name="send" size={22} color={colors.textSecondary} />
                <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
                  Share
                </Text>
                {post.share_count > 0 && (
                  <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
                    {post.share_count}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const MemoizedStatusPreview = memo(({ userStatus, currentUserPhone, onPress, onViewers, onDelete, colors, isDark }) => {
  const isVideo = userStatus.status_type === 'video';
  const isMyStatus = userStatus.user?.phone === currentUserPhone || userStatus.user === currentUserPhone;
  const url = userStatus.statuses[0]?.media;
  const path_img = url?.replace(/^https?:\/\/[^/]+/, '');
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <View style={styles.statusWrapper}>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground
          source={{ 
            uri: url
              ? `${API_ROUTE_IMAGE}${path_img}`
              : 'https://via.placeholder.com/40' 
          }}
          style={styles.statusImage}
          imageStyle={styles.statusImageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
        >
          {imageLoading && (
            <View style={styles.statusLoadingOverlay}>
              <Ionicons 
                name="camera" 
                size={24} 
                color="#fff" 
                style={styles.statusCameraIcon}
              />
            </View>
          )}
          
          {isVideo && !imageLoading && (
            <View style={styles.videoPlayIcon}>
              <Icon name="play" size={24} color="#fff" />
            </View>
          )}
          
          <View style={[styles.statusNameContainer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Text
              style={styles.statusNameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {isMyStatus ? 'My Story' : userStatus.user?.name || userStatus.user}
            </Text>
            {isMyStatus && userStatus.viewers_count > 0 && (
              <TouchableOpacity onPress={() => onViewers(userStatus.viewers)}>
                <Text style={styles.viewCountText}>
                  {userStatus.viewers_count} view{userStatus.viewers_count !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
});

const SuggestedFriendItem = memo(({ item, onFollow, colors }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(true);
    onFollow(item.id);
  };

  return (
    <View style={[styles.suggestedFriendItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity onPress={() => {}}>
        <View style={[styles.suggestedFriendImageContainer, { borderColor: colors.border }]}>
          {/* <Image
            source={
              item.profile_picture
                ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.suggestedFriendImage}
          /> */}
          <Image
  source={
    item.profile_picture
      ? getUserProfileImage(item.profile_picture)
      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
  }
  style={styles.suggestedFriendImage}
/>
          {item.is_verified && (
            <View style={[styles.suggestedFriendVerified,{marginleft:10}]}>
              <Icont name="verified" size={12} color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Text style={[styles.suggestedFriendName, { color: colors.text }]} numberOfLines={1}>
        {item.username}
      </Text>
      {item.followers_count && (
        <Text style={[styles.suggestedFriendClub, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.followers_count} Followers
        </Text>
      )}
      <TouchableOpacity
        style={[styles.suggestedFriendFollowButton, isFollowing && styles.suggestedFriendFollowingButton]}
        onPress={handleFollow}
      >
        <Text style={[styles.suggestedFriendFollowButtonText, isFollowing && styles.suggestedFriendFollowingButtonText]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default function HomePage({ navigation, route}) {
  const { colors, isDark,theme, toggleTheme, } = useTheme(); 
  const [reactionCounts, setReactionCounts] = useState({});
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isReplyBottomSheetVisible, setIsReplyBottomSheetVisible] = useState(false);
  const [isOptionsBottomSheetVisible, setIsOptionsBottomSheetVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [postById, setPostById] = useState(null);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [posts, setPosts] = useState([]);
  const [allposts, setAllPosts] = useState([]);
  const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userPostWithID, setUsersSelectedPostId] = useState('');
  const [userUID, setUserUid] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userprofileimage, setUserProfileImage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [commentsss, setPostsComment] = useState([]);
  const [commentLikesCount, setCommentLikesCount] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [showSuggestedFriends, setShowSuggestedFriends] = useState(false);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [groupedStatuses, setGroupedStatuses] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [currentUserPhone, setCurrentUserPhone] = useState(null);
  const [viewersModalVisible, setViewersModalVisible] = useState(false);
  const [currentViewers, setCurrentViewers] = useState([]);
  const [paused, setPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [liveStreams, setLiveStreams] = useState([]);
  const [loadingLiveStreams, setLoadingLiveStreams] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [postViews, setPostViews] = useState({});
  const [selectedImagePost, setSelectedImagePost] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [hasShownLiveModal, setHasShownLiveModal] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [userName, setUserName] = useState('');
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [snackbarFadeAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [allPostsPage, setAllPostsPage] = useState(1);
  const [postsHasMore, setPostsHasMore] = useState(true);
  const [allPostsHasMore, setAllPostsHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [statusViewerModalVisible, setStatusViewerModalVisible] = useState(false);
  const [statusPaused, setStatusPaused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));


  
const [fabAnim] = useState(new Animated.Value(0));

const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success',
    timeoutId: null,
  });


  const showFastSnackbar = useCallback((message, type = 'success') => {
    if (snackbar.timeoutId) {
      clearTimeout(snackbar.timeoutId);
    }
    setSnackbar({
      visible: true,
      message,
      type,
      timeoutId: null,
    });
    const timeoutId = setTimeout(() => {
      setSnackbar(prev => ({ ...prev, visible: false }));
    }, 2000);
    setSnackbar(prev => ({ ...prev, timeoutId }));
  }, [snackbar.timeoutId]);


useEffect(() => {
  Animated.timing(fabAnim, {
    toValue: 1,
    duration: 800,
    useNativeDriver: true,
  }).start();
}, []);


const handleAIPress = () => {
  navigation.navigate('ChatAi');
};

useEffect(() => {
  // Pulse animation for the FAB ring
  const pulseRing1 = Animated.loop(
    Animated.sequence([
      Animated.timing(fabAnim, {
        toValue: 1.5,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(fabAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ])
  );
  pulseRing1.start();

  return () => {
    pulseRing1.stop();
  };
}, []);

const renderAIFloatingButton = () => {
  return (
    <Animated.View
      style={[
        styles.aiFabContainer,
        {
          opacity: fabAnim,
          transform: [
            {
              scale: fabAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleAIPress}
        style={styles.aiFabButton}
      >
        <LinearGradient
          colors={['#0d45dd', '#0d45dd', '#0d45dd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiFabGradient}
        >
         
        <Text style={styles.aiFabLabel}>Ai</Text>
     
          
          <View style={styles.aiFabPulse}>
            <View style={styles.aiFabPulseRing} />
            <View style={[styles.aiFabPulseRing, styles.aiFabPulseRingDelay1]} />
            <View style={[styles.aiFabPulseRing, styles.aiFabPulseRingDelay2]} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
    </Animated.View>
  );
};


  // Animate when showing snackbar
  useEffect(() => {
    if (snackbarVisible) {
      Animated.timing(snackbarFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(snackbarFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [snackbarVisible]);


 

// Also add a helper for comment user images
const getCommentUserImage = (profilePicture) => {
  if (!profilePicture) {
    return require('../assets/images/avatar/blank-profile-picture-973460_1280.png');
  }
  
  if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
    if (profilePicture.includes('null') || profilePicture.endsWith('null')) {
      return require('../assets/images/avatar/blank-profile-picture-973460_1280.png');
    }
    return { uri: profilePicture };
  }
  
  // If it starts with '/media/' or similar, use API_ROUTE_IMAGE
  if (profilePicture.startsWith('/')) {
    return { uri: `${API_ROUTE_IMAGE}${profilePicture}` };
  }
  
  return { uri: `${API_ROUTE_IMAGE}${profilePicture}` };
};

  const showSnackbar = useCallback((message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  }, []);

  const promoData = [
    {
      id: 1,
      image: require('../assets/images/gdgdg.jpg'),
      badge: '💎 NEW',
      title: 'Earn Up to ₦5 Million',
      subtitle: 'Join the Showa reward system and start earning today!',
      buttonText: 'Get Started',
      screen: 'EarningDashbord' 
    },
    {
      id: 2,
      image: require('../assets/images/show.jpg'),
      badge: '🔥 HOT',
      title: 'Make Money',
      subtitle: 'make money on Showa',
      buttonText: 'Start Now',
      screen: 'EarningDashbord'
    },
    {
      id: 3,
      image: require('../assets/images/dad.jpg'),
      badge: 'LIMITED',
      title: 'Daily Challenges',
      subtitle: 'Complete daily tasks and earn rewards every day!',
      buttonText: 'Get Started',
      screen: 'EarningDashbord'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // LOAD FROM CACHE - MMKV
  // ============================================================
  const loadPostsFromCache = useCallback(async () => {
    try {
      const cachedData = storage.getString(POSTS_CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (!parsed || typeof parsed !== 'object') {
          console.warn('Invalid cache format');
          return false;
        }
        const { data, timestamp } = parsed;
        if (!Array.isArray(data)) {
          console.warn('Cached data is not an array');
          return false;
        }
        const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
        if (isCacheValid) {
          const map = await getViewsAndSharesMap();
          const enhancedPosts = enhancePostsWithMap(data, map, 0.7);
          setPosts([...enhancedPosts].reverse());
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading posts from cache:', error);
      storage.delete(POSTS_CACHE_KEY);
    }
    return false;
  }, []);

  // ============================================================
  // LOAD ALL POSTS FROM CACHE - MMKV
  // ============================================================
  const loadAllPostsFromCache = useCallback(async () => {
    try {
      const cachedData = storage.getString(ALL_POSTS_CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (!parsed || typeof parsed !== 'object') {
          console.warn('Invalid all posts cache format');
          return false;
        }
        const { data, timestamp } = parsed;
        if (!Array.isArray(data)) {
          console.warn('Cached all posts data is not an array');
          return false;
        }
        const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
        if (isCacheValid) {
          const dataCopy = data.slice();
          const sortedPosts = dataCopy.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          const filteredPosts = await filterUnfollowedUsers(sortedPosts);
          const map = await getViewsAndSharesMap();
          const enhancedPosts = enhancePostsWithMap(filteredPosts, map, 0.6);
          setAllPosts(enhancedPosts);
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading all posts from cache:', error);
      storage.delete(ALL_POSTS_CACHE_KEY);
    }
    return false;
  }, []);

  // ============================================================
  // SAVE TO CACHE - MMKV
  // ============================================================
  const savePostsToCache = useCallback(async (postsData) => {
    try {
      const dataToCache = Array.isArray(postsData) ? postsData : [];
      console.log('Saving posts to MMKV cache...', {
      postCount: dataToCache.length,
      timestamp: new Date().toISOString()
    });
      storage.set(
        POSTS_CACHE_KEY,
        JSON.stringify({ 
          data: dataToCache, 
          timestamp: Date.now() 
        })
      );
       console.log('Posts saved to MMKV cache successfully');
    } catch (error) {
      console.error('Error saving posts to cache:', error);
    }
  }, []);

  const saveAllPostsToCache = useCallback(async (postsData) => {
    try {
      const dataToCache = Array.isArray(postsData) ? postsData : [];
       console.log('Saving ALL posts to MMKV cache...', {
      postCount: dataToCache.length,
      timestamp: new Date().toISOString()
    });
      storage.set(
        ALL_POSTS_CACHE_KEY,
        JSON.stringify({ 
          data: dataToCache, 
          timestamp: Date.now() 
        })
      );
      console.log('✅ ALL posts saved to MMKV cache successfully');
    } catch (error) {
      console.error('Error saving all posts to cache:', error);
    }
  }, []);

  // ============================================================
  // FETCH FUNCTIONS
  // ============================================================
  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setCurrentUserId(parsedUserData.id);
        setCurrentUserPhone(parsedUserData.phone);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  const groupStatusesByUser = useCallback((statuses) => {
    const grouped = {};
    statuses.forEach(status => {
      const userKey = status.user?.id || status.user;
      if (!grouped[userKey]) {
        grouped[userKey] = {
          user: status.user,
          statuses: [],
          latestTime: new Date(status.created_at),
          viewers_count: status.viewers_count,
          viewers: status.viewers || [],
          status_type: status.status_type
        };
      }
      grouped[userKey].statuses.push(status);
      const currentTime = new Date(status.created_at);
      if (currentTime > grouped[userKey].latestTime) {
        grouped[userKey].latestTime = currentTime;
        grouped[userKey].viewers_count = status.viewers_count;
        grouped[userKey].viewers = status.viewers || [];
        grouped[userKey].status_type = status.status_type;
      }
    });
    return Object.values(grouped).sort((a, b) => b.latestTime - a.latestTime);
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const res = await axios.get(`${API_ROUTE}/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 || res.status === 201) {
        const grouped = groupStatusesByUser(res.data);
        setGroupedStatuses(grouped);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }, [groupStatusesByUser]);

  const filterUnfollowedUsers = async (posts) => {
    const followedUsers = await fetchFollowedUsers();
    const seenUsers = new Set();
    const filteredPosts = [];
    for (const post of posts) {
      if (!seenUsers.has(post.user_id) && !followedUsers.includes(post.user_id)) {
        seenUsers.add(post.user_id);
        filteredPosts.push(post);
      }
      if (filteredPosts.length === 20) break;
    }
    return filteredPosts;
  };

  const fetchFollowedUsers = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return [];
      const response = await axios.get(`${API_ROUTE}/followed-users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data.map(user => user.id);
      }
      return [];
    } catch (error) {
      console.error('Error fetching followed users:', error);
      return [];
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    try {
      const response = await axios.get(`${API_ROUTE}/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        console.log('fetch post_1', response.data)
        const postsData = Array.isArray(response.data) ? response.data : 
                         (response.data.results || []);
        const map = await getViewsAndSharesMap();
        const enhancedPosts = enhancePostsWithMap(postsData, map, 0.7);
        const reversedData = [...enhancedPosts].reverse();
        setPosts(reversedData);
        await savePostsToCache(postsData);
        reversedData.slice(0, 5).forEach((post) => {
          const firstImg = post.all_images?.[0]?.url || post.image_url;
          if (firstImg) {
            Image.prefetch(firstImg).catch(() => {});
          }
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [savePostsToCache]);

  const fetchAllPosts = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const [postsResponse, followedUsers] = await Promise.all([
        axios.get(`${API_ROUTE}/get-all-post/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetchFollowedUsers(),
      ]);
      if (postsResponse.status === 200) {
        
        const postsData = Array.isArray(postsResponse.data) ? postsResponse.data : 
                         (postsResponse.data.results || []);
                         console.log('fetch all post', postsData)
        const dataCopy = postsData.slice();
        const sortedPosts = dataCopy.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        const filteredPosts = await filterUnfollowedUsers(sortedPosts);
        const map = await getViewsAndSharesMap();
        const enhancedPosts = enhancePostsWithMap(filteredPosts, map, 0.6);
        setAllPosts(enhancedPosts);
        setFollowedUsers(followedUsers);
        await saveAllPostsToCache(postsData);
        enhancedPosts.slice(0, 5).forEach((post) => {
          const firstImg = post.all_images?.[0]?.url || post.image_url;
          if (firstImg) {
            Image.prefetch(firstImg).catch(() => {});
          }
        });
      }
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  }, [saveAllPostsToCache, fetchFollowedUsers]);

  const fetchReactions = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    try {
      const response = await axios.get(`${API_ROUTE}/all-post-reaction/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReactionCounts(response.data.reactions);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  }, []);

  const fetchSuggestedFriends = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const response = await axios.get(`${API_ROUTE}/suggested-friends/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const enhancedFriends = response.data.map(friend => ({
          ...friend,
          is_verified: Math.random() > 0.8,
          followers_count: Math.floor(Math.random() * 1000) + 100
        }));
        setSuggestedFriends(enhancedFriends);
      }
    } catch (error) {
      console.error('Error fetching suggested friends:', error);
    }
  }, []);

  const fetchLiveStreams = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); 
      setLoadingLiveStreams(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const res = await fetch(`${API_ROUTE}/live-streams/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        signal: abortControllerRef.current.signal
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setLiveStreams(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn("Error fetching live streams:", err);
      }
    } finally {
      setLoadingLiveStreams(false);
    }
  }, []);

  const fetchUnreadNotificationCount = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/notifications/unread-count/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.data.success) {
        setUnreadNotificationCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchHomeChannels = useCallback(async () => {
    try {
      setLoadingChannels(true);
      const token = await AsyncStorage.getItem('userToken');
      const [channelsRes, followingRes] = await Promise.all([
        axios.get(`${API_ROUTE}/channels/`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }),
        axios.get(`${API_ROUTE}/channels/following/`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000,
        })
      ]);
      const followingIds = followingRes.data.map(ch => ch.id);
      const processedChannels = channelsRes.data.map(channel => ({
        ...channel,
        isFollowing: followingIds.includes(channel.id),
      }));
      const topChannels = processedChannels.slice(0, 5);
      setChannels(topChannels);
    } catch (error) {
      showSnackbar('Error fetching channels for home:', 'error')
    } finally {
      setLoadingChannels(false);
    }
  }, []);

  // ============================================================
  // HANDLER FUNCTIONS
  // ============================================================
  // const handleReactionOptimized = useCallback(async (postId, type) => {
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     if (!token) return;
  //     const previousPosts = [...posts];
  //     const previousAllPosts = [...allposts];
  //     const previousReactionCounts = { ...reactionCounts };

  //     setReactionCounts((prev) => {
  //       const postIdStr = postId.toString();
  //       const currentReactions = prev[postIdStr] || { like: 0, love: 0, support: 0 };
  //       const newReactions = { ...currentReactions };
  //       if (newReactions.user_reaction === type) {
  //         newReactions[type] = (newReactions[type] || 0) - 1;
  //         newReactions.user_reaction = null;
  //       } else {
  //         if (newReactions.user_reaction) {
  //           newReactions[newReactions.user_reaction] = (newReactions[newReactions.user_reaction] || 0) - 1;
  //         }
  //         newReactions[type] = (newReactions[type] || 0) + 1;
  //         newReactions.user_reaction = type;
  //       }
  //       return { ...prev, [postIdStr]: newReactions };
  //     });

  //     if (type === 'like') {
  //       setPosts(prevPosts => 
  //         prevPosts.map(post => {
  //           if (post.id === postId) {
  //             const isLiked = post.reactions?.user_reaction === 'like';
  //             return {
  //               ...post,
  //               like_count: isLiked ? Math.max(0, (post.like_count || 0) - 1) : (post.like_count || 0) + 1,
  //               reactions: {
  //                 ...post.reactions,
  //                 user_reaction: isLiked ? null : 'like'
  //               }
  //             };
  //           }
  //           return post;
  //         })
  //       );
  //       setAllPosts(prevPosts => 
  //         prevPosts.map(post => {
  //           if (post.id === postId) {
  //             const isLiked = post.reactions?.user_reaction === 'like';
  //             return {
  //               ...post,
  //               like_count: isLiked ? Math.max(0, (post.like_count || 0) - 1) : (post.like_count || 0) + 1,
  //               reactions: {
  //                 ...post.reactions,
  //                 user_reaction: isLiked ? null : 'like'
  //               }
  //             };
  //           }
  //           return post;
  //         })
  //       );
  //     }

  //     const response = await axios.post(
  //       `${API_ROUTE}/post-react/`,
  //       { 
  //         post_id: postId, 
  //         reaction_type: type,
  //         content: type === 'comment' ? newComment : '',
  //         share_platform: type === 'share' ? 'external' : null
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.data) {
  //       setPosts(prevPosts => 
  //         prevPosts.map(post => 
  //           post.id === postId 
  //             ? { 
  //                 ...post, 
  //                 like_count: response.data.like_count !== undefined ? response.data.like_count : post.like_count,
  //                 comment_count: response.data.comment_count !== undefined ? response.data.comment_count : post.comment_count,
  //                 share_count: response.data.share_count !== undefined ? response.data.share_count : post.share_count,
  //                 reactions: {
  //                   ...post.reactions,
  //                   user_reaction: response.data.reaction?.reaction_type || null
  //                 }
  //               } 
  //             : post
  //         )
  //       );
  //       setAllPosts(prevPosts => 
  //         prevPosts.map(post => 
  //           post.id === postId 
  //             ? { 
  //                 ...post, 
  //                 like_count: response.data.like_count !== undefined ? response.data.like_count : post.like_count,
  //                 comment_count: response.data.comment_count !== undefined ? response.data.comment_count : post.comment_count,
  //                 share_count: response.data.share_count !== undefined ? response.data.share_count : post.share_count,
  //                 reactions: {
  //                   ...post.reactions,
  //                   user_reaction: response.data.reaction?.reaction_type || null
  //                 }
  //               } 
  //             : post
  //         )
  //       );
  //       if (response.data.reward) {
  //         showSnackbar(`You earned ${response.data.reward.coins} coins for this ${type}!`,'success');
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error handling reaction:', error);
  //     onRefresh();
  //   }
  // }, [posts, allposts, reactionCounts, newComment]);


  // Replace your handleReactionOptimized with this

  const handleReactionOptimized = useCallback(async (postId, type) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    // OPTIMISTIC UPDATE - UI updates instantly
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.reactions?.user_reaction === 'like';
          return {
            ...post,
            like_count: isLiked ? Math.max(0, (post.like_count || 0) - 1) : (post.like_count || 0) + 1,
            reactions: {
              ...post.reactions,
              user_reaction: isLiked ? null : 'like'
            }
          };
        }
        return post;
      })
    );

    setAllPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.reactions?.user_reaction === 'like';
          return {
            ...post,
            like_count: isLiked ? Math.max(0, (post.like_count || 0) - 1) : (post.like_count || 0) + 1,
            reactions: {
              ...post.reactions,
              user_reaction: isLiked ? null : 'like'
            }
          };
        }
        return post;
      })
    );

    // API call in background
    const response = await axios.post(
      `${API_ROUTE}/post-react/`,
      { post_id: postId, reaction_type: type },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Sync with server response
    if (response.data) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                like_count: response.data.like_count !== undefined ? response.data.like_count : post.like_count,
                reactions: {
                  ...post.reactions,
                  user_reaction: response.data.reaction?.reaction_type || null
                }
              } 
            : post
        )
      );
      
      // FAST snackbar - shows immediately if reward earned
      if (response.data?.reward) {
        showFastSnackbar(`+${response.data.reward.coins} coins!`, 'success');
      }
    }
  } catch (error) {
    console.error('Error handling reaction:', error);
    // Revert on error
    onRefresh();
  }
}, [posts, allposts, showFastSnackbar, onRefresh]);

const handleShareOptimized = useCallback(async (postId) => {
  try {
    const post =
      posts.find(p => p.id === postId) ||
      allposts.find(p => p.id === postId);

    if (!post) {
      console.error('Post not found for sharing:', postId);
      return;
    }

    const shareUrl = `https://showapp.ng/post/${post.id}`;

    // Clean up the post content
    const postContent = (post.content || '')
      .replace(/\s+/g, ' ')
      .trim();

    const preview =
      postContent.length > 120
        ? `${postContent.substring(0, 120)}…`
        : postContent;

    const shareMessage = `${post.username} shared a post on Showa App.

${preview ? `"${preview}"\n\n` : ''}Join the conversation and view the full post:

${shareUrl}`;

    const result = await Share.share({
      title: `Showa • ${post.username}'s Post`,
      message: shareMessage, // Android
      url: shareUrl,         // iOS
    });

    if (result.action === Share.sharedAction) {
      const token = await AsyncStorage.getItem('userToken');

      if (token) {
        await axios.post(
          `${API_ROUTE}/post-react/`,
          {
            post_id: post.id,
            reaction_type: 'share',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log('Post shared successfully:', shareUrl);
      setSnackbarVisible(true);
    }
  } catch (error) {
    console.error('Share error:', error);
    showSnackbar('message', 'error');
  }
}, [posts, allposts]);

  const handleCommentOptimized = useCallback((postId) => {
    setSelectedPostId(postId);
    setIsBottomSheetVisible(true);
    setCommentsLoading(true);
    setPostById(null);
    (async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setCommentsLoading(false);
          return;
        }
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`${API_ROUTE}/posts/${postId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_ROUTE}/post/${postId}/comments/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        if (postResponse.status === 200) {
          setPostById(postResponse.data);
        }
        if (commentsResponse.status === 200) {
          const comments = commentsResponse.data.comments || commentsResponse.data;
          setPostsComment(comments);
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setCommentsLoading(false);
      }
    })();
  }, []);

  const handleOptionsOptimized = useCallback((postId, userId) => {
    setSelectedPostId(postId);
    setUsersSelectedPostId(userId);
    setIsOptionsBottomSheetVisible(true);
  }, []);

  const handleFollow = useCallback(async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      await axios.post(
        `${API_ROUTE}/follow-user/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowedUsers((prev) => [...prev, userId]);
      setAllPosts((prev) => prev.map(post => 
        post.user_id === userId 
          ? { ...post, is_followed_by_current_user: true }
          : post
      ));
      setSuggestedFriends((prev) => prev.filter((friend) => friend.id !== userId));
      //setSnackbarVisible(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  }, []);

  const handleUnfollow = useCallback(async () => {
    const userId = userPostWithID;
    if (!userId) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      await axios.delete(`${API_ROUTE}/unfollow-user/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowedUsers((prev) => prev.filter((follower) => follower !== userId));
      //setSnackbarVisible(true);
      setIsOptionsBottomSheetVisible(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }, [userPostWithID]);

  const handleBookmark = useCallback(async (postId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/bookmark-post/`,
        { post: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //setSnackbarVisible(true);
      setIsOptionsBottomSheetVisible(false);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  }, []);

  const handleViewImage = useCallback((post) => {
    const images = post.all_images || (post.image_url ? [{ url: post.image_url }] : []);
    setSelectedImagePost({
      ...post,
      images: images,
      selectedIndex: post.selectedIndex || 0
    });
    setImageModalVisible(true);
  }, []);

  const handleImageModalClose = useCallback(() => {
    setImageModalVisible(false);
    setSelectedImagePost(null);
  }, []);

  const handleImageViewed = useCallback((postId, newCount) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, views: newCount } : post
    ));
    setAllPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, views: newCount } : post
    ));
  }, []);

  const handleFollowChannel = useCallback(async (slug) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/channels/${slug}/follow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChannels(prev => 
        prev.map(ch => 
          ch.slug === slug 
            ? { ...ch, isFollowing: true, followers_count: (ch.followers_count || 0) + 1 }
            : ch
        )
      );
      const channel = channels.find(ch => ch.slug === slug);
      if (channel) {
        navigation.navigate('ChannelDetails', {
          receiverId: channel.id,
          name: channel.name,
          chatType: 'channel',
          profile_image: channel.image,
          channelSlug: channel.slug,
          InviteLink: channel.invite_link,
          followers: channel.followers_count
        });
      }
    } catch (error) {
      showSnackbar('Failed to follow channel. Please try again.', 'error');
    }
  }, [channels, navigation]);

  const openImageModal = useCallback((userStatus) => {
    setSelectedUserStatuses(userStatus.statuses);
    setCurrentStatusIndex(0);
    setModalVisible(true);
    setPaused(false);
    const isMyStatus = userStatus.user?.phone === currentUserPhone || 
                       userStatus.user === currentUserPhone;
    if (!isMyStatus) {
      trackStatusView(userStatus.statuses[0]?.id);
    }
  }, [currentUserPhone]);

  const showViewers = useCallback((viewers) => {
    setCurrentViewers(viewers);
    setViewersModalVisible(true);
  }, []);

  const deleteStatus = useCallback(async (statusId) => {
    if (!statusId) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${API_ROUTE}/status/${statusId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupedStatuses(prev => 
        prev.filter(status => 
          !status.statuses.some(s => s.id === statusId)
        )
      );
      //setSnackbarVisible(true);
    } catch (error) {
      console.error('Error deleting status:', error);
      showSnackbar('message', 'error');
    }
  }, []);

  const trackStatusView = useCallback(async (statusId) => {
    if (!statusId) return;
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
  }, []);

  const formatStatusTime = (date) => {
    if (!date) return '';
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

  const getStatusImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    if (url.startsWith('https://')) {
      return url;
    }
    return `${API_ROUTE_IMAGE}${url}`;
  };

  // ============================================================
  // ON REFRESH - CLEARS MMKV CACHE
  // ============================================================
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    storage.delete(POSTS_CACHE_KEY);
    storage.delete(ALL_POSTS_CACHE_KEY);
    await Promise.all([
      fetchPosts(),
      fetchAllPosts(),
      fetchStatus(),
      fetchSuggestedFriends(),
      fetchLiveStreams()
    ]);
    setRefreshing(false);
  }, [fetchPosts, fetchAllPosts, fetchStatus, fetchSuggestedFriends, fetchLiveStreams]);

  // ============================================================
  // INITIAL LOAD
  // ============================================================
  useEffect(() => {
    let isMounted = true;
    const initializeData = async () => {
      if (!isMounted) return;
      setInitialLoading(true);
      const [cachedPosts, cachedAllPosts] = await Promise.all([
        loadPostsFromCache(),
        loadAllPostsFromCache(),
      ]);
      if ((cachedPosts || cachedAllPosts) && isMounted) {
        setInitialLoading(false);
      }
      const fetchBackgroundData = async () => {
        try {
          await Promise.all([
            fetchCurrentUser(),
            fetchStatus(),
            fetchPosts(),
            fetchAllPosts(),
            fetchReactions(),
            fetchSuggestedFriends(),
            fetchLiveStreams(),
            fetchUnreadNotificationCount(),
            fetchHomeChannels(),
          ]);
        } catch (error) {
          console.error('Background fetch error:', error);
        } finally {
          if (isMounted) {
            setInitialLoading(false);
          }
        }
      };
      fetchBackgroundData();
    };
    initializeData();
    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ============================================================
  // FOCUS EFFECT
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      const checkCacheAndRefresh = async () => {
        try {
          const cachedData = storage.getString(POSTS_CACHE_KEY);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            if (!isCacheValid) {
              console.log('🔄 Cache expired, refreshing in background...');
              await fetchPosts();
              await fetchAllPosts();
            }
          }
        } catch (error) {
          console.error('Error checking cache on focus:', error);
        }
      };
      checkCacheAndRefresh();
      fetchUnreadNotificationCount();
      return () => {};
    }, [fetchPosts, fetchAllPosts])
  );

  // ============================================================
  // SCROLL HANDLER
  // ============================================================
  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const postHeight = 500;
    if (scrollY > postHeight * 4 && !showSuggestedFriends) {
      setShowSuggestedFriends(true);
    }
    if (scrollY > postHeight * 8 && !hasShownLiveModal && liveStreams.length > 0) {
      setShowLiveModal(true);
      setHasShownLiveModal(true);
    }
  }, [showSuggestedFriends, hasShownLiveModal, liveStreams.length]);

  // ============================================================
  // COMMENT HANDLERS
  // ============================================================
  const handleDeleteComment = useCallback(async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
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
                const response = await axios.delete(
                  `${API_ROUTE}/comment/${commentId}/delete/`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                  setPostsComment(prev => {
                    const isTopLevelComment = prev.some(c => c.id === commentId && !c.parent_comment);
                    if (isTopLevelComment) {
                      return prev.filter(c => c.id !== commentId);
                    } else {
                      return prev.map(comment => {
                        if (comment.replies && comment.replies.some(r => r.id === commentId)) {
                          return {
                            ...comment,
                            replies: comment.replies.filter(r => r.id !== commentId),
                            reply_count: (comment.reply_count || 0) - 1
                          };
                        }
                        return comment;
                      });
                    }
                  });
                  setPosts(prev => prev.map(post => 
                    post.id === response.data.post_id 
                      ? { ...post, comment_count: response.data.comment_count }
                      : post
                  ));
                  setAllPosts(prev => prev.map(post => 
                    post.id === response.data.post_id 
                      ? { ...post, comment_count: response.data.comment_count }
                      : post
                  ));
                  setSnackbarVisible(true);
                }
              } catch (error) {
                console.error('Error deleting comment:', error);
                showSnackbar('Error', error.response?.data?.error || 'Failed to delete comment');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  }, []);

  const handleDeleteReply = useCallback(async (replyId, parentCommentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      Alert.alert(
        'Delete Reply',
        'Delete this reply?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await axios.delete(
                  `${API_ROUTE}/comment-reply/${replyId}/delete/`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                  setPostsComment(prev => prev.map(comment => {
                    if (comment.id === parentCommentId) {
                      const updatedReplies = comment.replies 
                        ? comment.replies.filter(r => r.id !== replyId)
                        : [];
                      return {
                        ...comment,
                        replies: updatedReplies,
                        reply_count: (comment.reply_count || 0) - 1
                      };
                    }
                    return comment;
                  }));
                  setSnackbarVisible(true);
                }
              } catch (error) {
                console.error('Error deleting reply:', error);
                showSnackbar('Failed to delete reply', 'error');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  const handleCommentLike = useCallback(async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      setCommentLikesCount(prev => ({
        ...prev,
        [commentId]: (prev[commentId] || 0) + 1
      }));
      setPostsComment(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                is_liked: true,
                like_count: (comment.like_count || 0) + 1 
              } 
            : comment
        )
      );
      const response = await axios.post(
        `${API_ROUTE}/comment/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 || response.status === 201) {
        setPostsComment(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  is_liked: response.data.liked,
                  like_count: response.data.like_count 
                } 
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      setCommentLikesCount(prev => ({
        ...prev,
        [commentId]: Math.max(0, (prev[commentId] || 1) - 1)
      }));
    }
  }, []);

  const handleReplyToComment = useCallback(async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const tempReplyId = `temp_reply_${Date.now()}`;
      const newReply = {
        id: tempReplyId,
        text: replyText.trim(),
        user: {
          id: parsedUser?.id,
          username: username,
          profile_picture: userprofileimage
        },
        created_at: new Date().toISOString(),
        like_count: 0,
        is_liked: false
      };
      setPostsComment(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                replies: [...(comment.replies || []), newReply],
                reply_count: (comment.reply_count || 0) + 1
              } 
            : comment
        )
      );
      const response = await axios.post(
        `${API_ROUTE}/comment/${commentId}/reply/`,
        { text: replyText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setPostsComment(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  replies: comment.replies.map(reply => 
                    reply.id === tempReplyId ? response.data : reply
                  )
                } 
              : comment
          )
        );
        if (response.data.reward) {
          showSnackbar(`You earned ${response.data.reward.coins} coins for your reply!`,'success');
        }
        setReplyText('');
        setReplyToCommentId(null);
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      setPostsComment(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                replies: comment.replies.filter(r => !r.id.toString().startsWith('temp_'))
              } 
            : comment
        )
      );
    }
  }, [username, userprofileimage]);

  const onCommentSubmitPost = useCallback(async () => {
    if (!newComment.trim() || !selectedPostId) {
      return;
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const loginUserId = parsedUser?.id;
      const userName = parsedUser?.name || parsedUser?.username || 'User';
      if (!loginUserId) {
        console.warn('User ID not found in stored data.');
        return;
      }
      const isReply = replyToCommentId !== null;
      const parentCommentId = replyToCommentId;
      const tempId = `temp_${Date.now()}`;
      const optimisticData = {
        id: tempId,
        text: newComment.trim(),
        created_at: new Date().toISOString(),
        user: {
          id: loginUserId,
          username: userName,
          name: userName,
          profile_picture: userprofileimage,
          is_verified: false
        },
        user_details: {
          id: loginUserId,
          username: userName,
          profile_picture: userprofileimage,
          is_verified: false
        },
        username: userName,
        like_count: 0,
        is_liked: false,
        replies: []
      };
      if (isReply) {
        optimisticData.parent = parentCommentId;
        optimisticData.parent_comment_id = parentCommentId;
      }
      if (isReply) {
        setPostsComment(prev => prev.map(comment => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), optimisticData],
              reply_count: (comment.reply_count || 0) + 1
            };
          }
          return comment;
        }));
      } else {
        setPostsComment(prev => [optimisticData, ...prev.filter(c => c.post === selectedPostId)]);
        setPosts(prev => prev.map(post => 
          post.id === selectedPostId 
            ? { ...post, comment_count: (post.comment_count || 0) + 1 } 
            : post
        ));
        setAllPosts(prev => prev.map(post => 
          post.id === selectedPostId 
            ? { ...post, comment_count: (post.comment_count || 0) + 1 } 
            : post
        ));
      }
      setNewComment('');
      if (isReply) {
        setReplyToCommentId(null);
      }
      const endpoint = isReply 
        ? `${API_ROUTE}/comment/${parentCommentId}/reply/`
        : `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`;
      const response = await axios.post(
        endpoint,
        isReply 
          ? { text: newComment.trim() }
          : {
              text: newComment.trim(),
              post: selectedPostId,
              user: loginUserId,
              image: userprofileimage,
            },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        if (isReply) {
          setPostsComment(prev => prev.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => 
                  reply.id === tempId ? response.data : reply
                )
              };
            }
            return comment;
          }));
        } else {
          setPostsComment(prev => prev.map(comment => 
            comment.id === tempId ? response.data : comment
          ));
          if (response.data.comment_count !== undefined) {
            setPosts(prev => prev.map(post => 
              post.id === selectedPostId 
                ? { ...post, comment_count: response.data.comment_count } 
                : post
            ));
            setAllPosts(prev => prev.map(post => 
              post.id === selectedPostId 
                ? { ...post, comment_count: response.data.comment_count } 
                : post
            ));
          }
        }
        setSnackbarVisible(true);
        if (response.data.reward) {
          showSnackbar(`You earned ${response.data.reward.coins} coins!`,'success');
        }
      }
    } catch (error) {
      console.error('Failed to post:', error);
      if (replyToCommentId) {
        setPostsComment(prev => prev.map(comment => {
          if (comment.id === replyToCommentId) {
            return {
              ...comment,
              replies: comment.replies?.filter(r => r.id.toString().startsWith('temp_'))
            };
          }
          return comment;
        }));
      } else {
        setPostsComment(prev => prev.filter(c => !c.id.toString().startsWith('temp_')));
        setPosts(prev => prev.map(post => 
          post.id === selectedPostId 
            ? { ...post, comment_count: Math.max(0, (post.comment_count || 0) - 1) } 
            : post
        ));
      }
      showSnackbar('message', 'error');
    }
  }, [newComment, selectedPostId, replyToCommentId, username, userprofileimage, posts, allposts]);

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================
  const renderComment = useCallback(({ item }) => {
    const extractUserData = (comment) => {
      let userId = null;
      let username = 'Anonymous';
      let userProfilePic = null;
      let isVerified = false;
      if (comment.user && typeof comment.user === 'object') {
        userId = comment.user.id || null;
        username = comment.user.username || comment.user.name || 'Anonymous';
        userProfilePic = comment.user.profile_picture || comment.user.image || null;
        isVerified = comment.user.is_verified || false;
      } else if (comment.user_details) {
        userId = comment.user_details.id || null;
        username = comment.user_details.username || comment.user_details.name || 'Anonymous';
        userProfilePic = comment.user_details.profile_picture || null;
        isVerified = comment.user_details.is_verified || false;
      } else {
        userId = comment.user_id || comment.userId || null;
        username = comment.username || comment.userName || 'Anonymous';
        userProfilePic = comment.user_profile_picture || comment.userImage || null;
        isVerified = comment.is_verified || false;
      }
      return { userId, username, userProfilePic, isVerified };
    };
    const { 
      userId: commentUserId, 
      username: commentUsername, 
      userProfilePic: commentUserProfilePic, 
      isVerified: commentIsVerified 
    } = extractUserData(item);
    const isOwnComment = commentUserId === currentUserId;
    const isLiked = item.is_liked || false;
    const likeCount = item.like_count || 0;
    const replyCount = item.reply_count || item.replies?.length || 0;
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentRow}>
          <TouchableOpacity 
            onPress={() => commentUserId && navigation.navigate('OtherUserProfile', { userId: commentUserId })}
            disabled={!commentUserId}
          >
            {/* <Image
              source={
                commentUserProfilePic
                  ? { uri: commentUserProfilePic.startsWith('http') 
                      ? commentUserProfilePic 
                      : `${API_ROUTE_IMAGE}${commentUserProfilePic}`}
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.commentAvatar}
            /> */}

            <Image
  source={
    commentUserProfilePic
      ? getUserProfileImage(commentUserProfilePic)
      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
  }
  style={styles.commentAvatar}
/>
          </TouchableOpacity>
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <View style={styles.commentUserInfo}>
                <TouchableOpacity 
                  onPress={() => commentUserId && navigation.navigate('OtherUserProfile', { userId: commentUserId })}
                  disabled={!commentUserId}
                >
                  <Text style={[styles.commentUsername, { color: colors.text }]}>
                    {commentUsername}
                  </Text>
                </TouchableOpacity>
                {commentIsVerified && (
                  <View style={styles.commentVerifiedBadge}>
                    <Icontt name="check-bold" size={10} color="#fff" />
                  </View>
                )}
                <Text style={[styles.commentTimestamp, { color: colors.textSecondary }]}>
                  {dayjs(item.created_at).fromNow()}
                </Text>
              </View>
              {isOwnComment && (
                <TouchableOpacity
                  onPress={() => {
                    if (item.parent_comment_id || item.parent) {
                      handleDeleteReply(item.id, item.parent_comment_id || item.parent);
                    } else {
                      handleDeleteComment(item.id);
                    }
                  }}
                  style={styles.commentDeleteButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity 
                style={styles.commentActionButton}
                onPress={() => handleCommentLike(item.id)}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={14} 
                  color={isLiked ? colors.primary : colors.textSecondary} 
                />
                {likeCount > 0 && (
                  <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                    {likeCount}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.commentActionButton}
                onPress={() => {
                  setReplyToCommentId(item.id);
                  setReplyText(`@${commentUsername} `);
                }}
              >
                <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
            {item.replies && item.replies.length > 0 && (
              <View style={styles.repliesWrapper}>
                {item.replies.map((reply, index) => {
                  const { 
                    userId: replyUserId, 
                    username: replyUsername, 
                    userProfilePic: replyUserProfilePic, 
                    isVerified: replyIsVerified 
                  } = extractUserData(reply);
                  const isOwnReply = replyUserId === currentUserId;
                  return (
                    <View key={reply.id || `reply-${index}`} style={styles.replyContainer}>
                      <TouchableOpacity 
                        onPress={() => replyUserId && navigation.navigate('OtherUserProfile', { userId: replyUserId })}
                        disabled={!replyUserId}
                      >
                        <Image
                          source={
                            replyUserProfilePic
                              ? { uri: replyUserProfilePic.startsWith('http')
                                  ? replyUserProfilePic
                                  : `${API_ROUTE_IMAGE}${replyUserProfilePic}`}
                              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                          }
                          style={styles.replyAvatar}
                        />
                      </TouchableOpacity>
                      <View style={[styles.replyContent, { backgroundColor: colors.backgroundSecondary }]}>
                        <View style={styles.replyHeader}>
                          <View style={styles.replyUserInfo}>
                            <TouchableOpacity 
                              onPress={() => replyUserId && navigation.navigate('OtherUserProfile', { userId: replyUserId })}
                              disabled={!replyUserId}
                            >
                              <Text style={[styles.replyUsername, { color: colors.text }]}>
                                {replyUsername}
                              </Text>
                            </TouchableOpacity>
                            {replyIsVerified && (
                              <View style={styles.replyVerifiedBadge}>
                                <Icontt name="check-bold" size={8} color="#fff" />
                              </View>
                            )}
                            <Text style={[styles.replyTimestamp, { color: colors.textSecondary }]}>
                              {dayjs(reply.created_at).fromNow()}
                            </Text>
                          </View>
                          {isOwnReply && (
                            <TouchableOpacity
                              onPress={() => handleDeleteReply(reply.id, item.id)}
                              style={styles.replyDeleteButton}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Ionicons name="trash-outline" size={12} color={colors.textSecondary} />
                            </TouchableOpacity>
                          )}
                        </View>
                        <Text style={[styles.replyText, { color: colors.text }]}>{reply.text}</Text>
                      </View>
                    </View>
                  );
                })}
                {replyCount > 3 && (
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('Load more replies');
                    }}
                    style={styles.viewMoreReplies}
                  >
                    <Text style={[styles.viewMoreRepliesText, { color: colors.primary }]}>
                      View all {replyCount} replies
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }, [replyToCommentId, replyText, handleCommentLike, handleReplyToComment, handleDeleteComment, handleDeleteReply, colors, navigation, currentUserId]);

  const renderPromoBanner = () => {
    const currentPromo = promoData[currentPromoIndex];
    return (
      <View style={styles.promoContainer}>
        <Image
          source={currentPromo.image}
          style={styles.promoBanner}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.49)', 'rgba(0,0,0,0.2)']}
          style={styles.promoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>{currentPromo.title}</Text>
          <Text style={styles.promoSubtitle}>{currentPromo.subtitle}</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate(currentPromo.screen)} 
            style={styles.promoButton}
            activeOpacity={0.8}
          >
            <Text style={styles.promoButtonText}>{currentPromo.buttonText}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.promoDotsContainer}>
          {promoData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.promoDot,
                currentPromoIndex === index && styles.promoDotActive
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderSuggestedFriend = useCallback(({ item }) => (
    <SuggestedFriendItem item={item} onFollow={handleFollow} colors={colors} />
  ), [handleFollow, colors]);

  const renderStatusRow = useCallback(() => {
    const hasLiveStreams = liveStreams && liveStreams.length > 0;
    return (
      <View style={{ marginTop: 0, marginBottom: 0 }}>
        {/* <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusScrollContainer}
        >
          {myStatus && (
            <MemoizedStatusPreview 
              userStatus={myStatus}
              currentUserPhone={currentUserPhone}
              onPress={() => openImageModal(myStatus)}
              onViewers={() => showViewers(myStatus.viewers)}
              onDelete={deleteStatus}
              colors={colors}
              isDark={isDark}
            />
          )}
          
          {otherStatuses.map((userStatus) => (
            <MemoizedStatusPreview 
              key={userStatus.user?.id}
              userStatus={userStatus}
              currentUserPhone={currentUserPhone}
              onPress={() => openImageModal(userStatus)}
              onViewers={() => showViewers(userStatus.viewers)}
              onDelete={deleteStatus}
              colors={colors}
              isDark={isDark}
            />
          ))}
        </ScrollView> */}

        {hasLiveStreams && liveStreams.map((liveStream) => (
            <StatusSection
              showTitle={true}
              title="Stories"
              horizontal={true}
              showAddButton={true}
              maxItems={15}
              onLivePress={(stream) => {
                // navigation.navigate('LiveViewer', {
                //   streamId: stream.id,
                //   broadcasterName: stream.broadcaster_name,
                // });

                navigation.navigate('Viewer', {
                  roomName: 'match-123',
                  streamId: 'stream-1',
                  viewerId: 'viewer-1',
                });
              }}
              containerStyle={{ marginTop: 0 }}
            />
          ))}
        
      </View>
    );
  }, [myStatus, otherStatuses, liveStreams, currentUserPhone, openImageModal, showViewers, deleteStatus, colors, isDark]);

  const renderLiveModal = () => (
    <Modal visible={showLiveModal} animationType="slide" transparent>
      <View style={styles.liveModalOverlay}>
        <View style={[styles.liveModal, { backgroundColor: colors.card }]}>
          <View style={styles.liveModalHeader}>
            <Text style={[styles.liveModalTitle, { color: colors.text }]}>Live Now 🔴</Text>
            <TouchableOpacity onPress={() => setShowLiveModal(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={liveStreams}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.liveModalItem}
                onPress={() => {
                  setShowLiveModal(false);
                  navigation.navigate('LiveStreaming', { streamId: item.stream_id });
                }}
              >
                <Image
                  source={{ 
                    uri: item.broadcaster_image 
                      ? `${API_ROUTE_IMAGE}${item.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
                      : 'https://via.placeholder.com/40' 
                  }}
                  style={styles.liveModalAvatar}
                />
                <View style={styles.liveModalInfo}>
                  <Text style={[styles.liveModalName, { color: colors.text }]}>{item.broadcaster_name}</Text>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE NOW</Text>
                  </View>
                </View>
                <Text style={[styles.liveModalStats, { color: colors.textSecondary }]}>{item.likes} likes</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyLive}>
                <Text style={[styles.emptyLiveText, { color: colors.textSecondary }]}>No one is live right now</Text>
              </View>
            }
          />
          <TouchableOpacity 
            style={[styles.closeLiveModalButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowLiveModal(false)}
          >
            <Text style={styles.closeLiveModalText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderViewersModal = () => (
    <Modal visible={viewersModalVisible} animationType="slide" transparent>
      <View style={styles.viewersModalOverlay}>
        <View style={[styles.viewersModal, { backgroundColor: colors.card }]}>
          <View style={styles.viewersModalHeader}>
            <Text style={[styles.viewersModalTitle, { color: colors.text }]}>Viewers</Text>
            <TouchableOpacity onPress={() => setViewersModalVisible(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={currentViewers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.viewerItem}>
                <Image
                  source={{ 
                    uri: item.profile_picture 
                      ? `${API_ROUTE_IMAGE}${item.profile_picture}`
                      : 'https://via.placeholder.com/40' 
                  }}
                  style={styles.viewerAvatar}
                />
                <Text style={[styles.viewerName, { color: colors.text }]}>{item.username || 'Unknown User'}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyViewers}>
                <Text style={[styles.emptyViewersText, { color: colors.textSecondary }]}>No viewers yet</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const renderChannelsSection = () => {
    if (channels.length === 0) return null;
    return (
      <View style={styles.channelsSection}>
        <View style={styles.channelsHeader}>
          <Text style={[styles.channelsTitle, { color: colors.text }]}>
            Channels to Follow
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Channelist')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={channels}
          renderItem={({ item }) => {
            const imageSource = item.image 
              ? { uri: `${API_ROUTE_IMAGE}${item.image}` }
              : require('../assets/images/channelfallbackimg.png');
            return (
              <TouchableOpacity
                style={[styles.channelCard, { backgroundColor: colors.card }]}
                onPress={() => {
                  if (item.isFollowing) {
                    navigation.navigate('ChannelDetails', {
                      receiverId: item.id,
                      name: item.name,
                      chatType: 'channel',
                      profile_image: item.image,
                      channelSlug: item.slug,
                      InviteLink: item.invite_link,
                      followers: item.followers_count
                    });
                  } else {
                    Alert.alert('Follow Channel', `Follow ${item.name} to access?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Follow', 
                        onPress: () => handleFollowChannel(item.slug)
                      }
                    ]);
                  }
                }}
                activeOpacity={0.7}
              >
                <Image source={imageSource} style={styles.channelCardImage} />
                <Text style={[styles.channelCardName, { color: colors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.channelCardMembers, { color: colors.textSecondary }]}>
                  {item.followers_count?.toLocaleString() || 0} members
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => `home-channel-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.channelsList}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      </View>
    );
  };

  // ============================================================
  // MEMOIZED DATA
  // ============================================================
  const myStatus = React.useMemo(() => 
    groupedStatuses.find(status => 
      status.user?.phone === currentUserPhone || status.user === currentUserPhone
    ),
    [groupedStatuses, currentUserPhone]
  );

  const otherStatuses = React.useMemo(() => 
    groupedStatuses.filter(status => 
      status.user?.phone !== currentUserPhone && status.user !== currentUserPhone
    ),
    [groupedStatuses, currentUserPhone]
  );

  const combinedPosts = React.useMemo(() => [
    ...posts.map(post => ({ 
      type: 'followed', 
      post: {
        ...post,
        reactions: reactionCounts[post.id?.toString()] || {},
        commentCount: commentsss.filter(c => c.post === post.id).length
      }
    })),
    ...allposts.map(post => ({ 
      type: 'allposts', 
      post: {
        ...post,
        reactions: reactionCounts[post.id?.toString()] || {},
        commentCount: commentsss.filter(c => c.post === post.id).length
      }
    }))
  ].sort((a, b) => new Date(b.post.created_at) - new Date(a.post.created_at)), 
  [posts, allposts, reactionCounts, commentsss]);

  // ============================================================
  // RENDER CONTENT
  // ============================================================
  const renderContent = useCallback(() => {
    const middleIndex = Math.floor(combinedPosts.length / 2);
    const firstHalf = combinedPosts.slice(0, middleIndex);
    const secondHalf = combinedPosts.slice(middleIndex);
    const friendSuggestionIndex = Math.min(2, firstHalf.length - 1);
    const firstPart = firstHalf.slice(0, friendSuggestionIndex);
    const secondPart = firstHalf.slice(friendSuggestionIndex);

    return (
      <>
        {(groupedStatuses.length > 0 || liveStreams.length > 0) && 
        
        renderStatusRow()}
        {refreshing && combinedPosts.length > 0 && (
          <View style={styles.refreshingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.refreshingText, { color: colors.text }]}>Updating feed...</Text>
          </View>
        )}
        {renderPromoBanner()}

        {/* <AutoShort navigation={navigation} /> */}


        
        {firstPart.length > 0 && (
          <FlatList
            data={firstPart}
            keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
            renderItem={({ item }) => (
              <MemoizedTweetItem 
                post={item.post} 
                type={item.type}
                onReaction={handleReactionOptimized}
                onComment={handleCommentOptimized}
                onShare={handleShareOptimized}
                onFollow={handleFollow}
                onOptions={handleOptionsOptimized}
                onViewImage={handleViewImage}
                colors={colors}
                isDark={isDark}
                currentUserId={currentUserId}
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}
        <HangoutPlacesExplore 
          navigation={navigation} 
          maxItems={10}
          title="Popular Hangout Places"
        />
        {secondPart.length > 0 && (
          <FlatList
            data={secondPart}
            keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
            renderItem={({ item }) => (
              <MemoizedTweetItem 
                post={item.post} 
                type={item.type}
                onReaction={handleReactionOptimized}
                onComment={handleCommentOptimized}
                onShare={handleShareOptimized}
                onFollow={handleFollow}
                onOptions={handleOptionsOptimized}
                onViewImage={handleViewImage}
                colors={colors}
                isDark={isDark}
                currentUserId={currentUserId}
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}
        {/* <FriendSuggestion /> */}
        {showSuggestedFriends && suggestedFriends.length > 0 && (
          <View style={[styles.suggestedFriendsContainer, { 
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border 
          }]}>
            <View style={styles.suggestedFriendsHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 18 }]}>
                People to follow
              </Text>
            </View>
            <FlatList
              data={suggestedFriends}
              renderItem={renderSuggestedFriend}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestedFriendsList}
              initialNumToRender={3}
            />
          </View>
        )}
        <Jobs />
        <VideoFeeds />
        <Ads />
        {renderChannelsSection()}
        {secondHalf.length > 0 && (
          <FlatList
            data={secondHalf}
            keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
            renderItem={({ item }) => (
              <MemoizedTweetItem 
                post={item.post} 
                type={item.type}
                onReaction={handleReactionOptimized}
                onComment={handleCommentOptimized}
                onShare={handleShareOptimized}
                onFollow={handleFollow}
                onOptions={handleOptionsOptimized}
                onViewImage={handleViewImage}
                colors={colors}
                isDark={isDark}
                currentUserId={currentUserId}
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}
        {groupedStatuses.length > 0 || liveStreams.length > 0 && (
          <View style={[styles.friendSuggestionBottom, { 
            backgroundColor: colors.background,
            borderColor: colors.border 
          }]}>
           
            {(groupedStatuses.length > 0 || liveStreams.length > 0) && 
            
            <StatusSection
              showTitle={true}
              title="Stories"
              horizontal={true}
              showAddButton={true}
              maxItems={15}
              onLivePress={(stream) => {
                // navigation.navigate('LiveViewer', {
                //   streamId: stream.id,
                //   broadcasterName: stream.broadcaster_name,
                // });

                navigation.navigate('Viewer', {
                  roomName: 'match-123',
                  streamId: 'stream-1',
                  viewerId: 'viewer-1',
                });
              }}
              containerStyle={{ marginTop: 0 }}
            />
            }
          </View>
        )}
        {combinedPosts.length === 0 && !initialLoading && (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No posts yet</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Follow some users or create your first post to see content here
            </Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CreateBroadcastPost')}
            >
              <Text style={styles.emptyStateButtonText}>Create First Post</Text>
            </TouchableOpacity>
          </View>
        )}
        {combinedPosts.length > 6 && (
          <MusicListComponent navigation={navigation} colors={colors} />
        )}
        {combinedPosts.length > 8 && (
          <EdateDiscoverScreen />
        )}
        
      </>
    );
  }, [
    combinedPosts,
    groupedStatuses,
    liveStreams,
    refreshing,
    showSuggestedFriends,
    suggestedFriends,
    initialLoading,
    renderStatusRow,
    renderSuggestedFriend,
    handleReactionOptimized,
    handleCommentOptimized,
    handleShareOptimized,
    handleFollow,
    handleOptionsOptimized,
    handleViewImage,
    navigation,
    colors,
    isDark,
     currentUserId
  ]);

  // ============================================================
  // MAIN RETURN
  // ============================================================
  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar 
          backgroundColor={colors.card} 
          barStyle={isDark ? "light-content" : "dark-content"} 
        />
        
        <View style={[styles.header, { 
          backgroundColor: colors.card,
          borderBottomColor: colors.border 
        }]}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Showa</Text>
          <View style={styles.headerActions}>
            {/* <TouchableOpacity onPress={() => navigation.navigate('SocialHome')}>
              <Icontt name="video-outline" size={28} color={colors.text} style={{ marginRight: 18 }} />
            </TouchableOpacity> */}
           
            <TouchableOpacity 
              onPress={() => navigation.navigate('NotificationsScreen')}
              style={styles.notificationIconContainer}
            >
              <Icon name="notifications-outline" size={25} color={colors.text} style={{ marginRight: 22 }} />
              {unreadNotificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

             <TouchableOpacity style={{ marginRight: 12 }} onPress={() => navigation.navigate('Search')}>
              <Ionicons name="search-outline" size={30} color={colors.text} />
            </TouchableOpacity>
            

            <TouchableOpacity onPress={() => navigation.navigate('CreateBroadcastPost')}>
              <Ionicons name="add-circle-outline" size={30} color={colors.text} />
            </TouchableOpacity>

            

            <TouchableOpacity onPress={()=>navigation.navigate('ExploreFeaturePersonalAcount')}>
              <Icon name="ellipsis-vertical" style={{ marginLeft: 8 }} size={25} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.background }}
        >
          {renderContent()}
          <View style={{marginBottom:100}}></View>
        </ScrollView>

        <ImageModal
          visible={imageModalVisible}
          post={selectedImagePost}
          onClose={handleImageModalClose}
          onView={handleImageViewed}
          colors={colors}
          isDark={isDark}
        />

        {renderLiveModal()}
        {renderViewersModal()}

        {/* Comment Modal */}
        <Modal visible={isBottomSheetVisible} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              style={styles.overlay}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
              <View style={[styles.commentModal, { backgroundColor: colors.card }]}>
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Comments</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsBottomSheetVisible(false);
                      setReplyToCommentId(null);
                      setNewComment('');
                      Keyboard.dismiss();
                    }}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={26} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  contentContainerStyle={styles.modalContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {postById && (
                    <View style={styles.postPreview}>
                      <View style={styles.postHeader}>
                        <Image
                          source={
                            postById.user_profile_picture
                              ? { uri: postById.user_profile_picture }
                              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                          }
                          style={styles.postAvatar}
                        />
                        <View style={styles.postInfo}>
                          <Text style={[styles.postUsername, { color: colors.text }]}>
                            {postById.username || 'Anonymous'}
                          </Text>
                          <Text style={[styles.postTimestamp, { color: colors.textSecondary }]}>
                            {dayjs(postById.created_at).fromNow()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.postContent, { color: colors.text }]}>{postById.content}</Text>
                    </View>
                  )}

                  <View style={[styles.divider, { backgroundColor: colors.border }]} />

                  {commentsLoading ? (
                    <View style={styles.emptyComments}>
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  ) : (
                    <FlatList
                      data={commentsss.filter((c) => c.post === selectedPostId && !c.parent)}
                      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                      scrollEnabled={false}
                      renderItem={renderComment}
                      ListEmptyComponent={
                        <View style={styles.emptyComments}>
                          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No comments yet. Be the first to comment!
                          </Text>
                        </View>
                      }
                    />
                  )}

                  {Platform.OS === 'ios' && <View style={{ height: 20 }} />}
                </ScrollView>

                <View style={[styles.commentInputContainer, { borderTopColor: colors.border }]}>
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder={replyToCommentId ? "Write a reply..." : "Write a comment..."}
                      placeholderTextColor={colors.textSecondary}
                      value={newComment}
                      onChangeText={setNewComment}
                      style={[styles.commentInput, { 
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.text
                      }]}
                      multiline
                      returnKeyType="default"
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        onCommentSubmitPost();
                        Keyboard.dismiss();
                      }}
                      style={[styles.sendButton, { backgroundColor: colors.primary }]}
                      disabled={!newComment.trim()}
                    >
                      <Text style={[styles.sendButtonText, !newComment.trim() && styles.sendButtonDisabled]}>
                        Post
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Options Modal */}
        <Modal visible={isOptionsBottomSheetVisible} animationType="slide" transparent>
          <View style={styles.overlay}>
            <View style={[styles.optionsModal, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
                <TouchableOpacity
                  onPress={() => setIsOptionsBottomSheetVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={26} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleShareOptimized(selectedPostId)}
                >
                  <Ionicons name="share-social-outline" size={24} color={colors.text} />
                  <Text style={[styles.optionText, { color: colors.text }]}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleBookmark(selectedPostId)}
                >
                  <Ionicons name="bookmark-outline" size={24} color={colors.text} />
                  <Text style={[styles.optionText, { color: colors.text }]}>Bookmark</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setIsOptionsBottomSheetVisible(false);
                    handleUnfollow();
                  }}
                >
                  <Ionicons name="person-remove-outline" size={24} color={colors.text} />
                  <Text style={[styles.optionText, { color: colors.text }]}>Unfollow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    navigation.navigate('ReportPost', {postId: selectedPostId});
                    setIsOptionsBottomSheetVisible(false);
                  }}
                >
                  <Ionicons name="flag-outline" size={24} color={colors.text} />
                  <Text style={[styles.optionText, { color: colors.text }]}>Report Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Status Viewer Modal */}
        <Modal 
          visible={modalVisible} 
          transparent={true} 
          onRequestClose={() => setModalVisible(false)}
          statusBarTranslucent={true}
        >
          <View style={styles.statusViewerContainer}>
            <FlatList
              ref={useRef(null)}
              data={selectedUserStatuses}
              renderItem={({ item, index }) => (
                <View style={styles.statusViewerPage}>
                  <TouchableOpacity 
                    style={[styles.statusTapArea, styles.statusLeftTapArea]}
                    onPress={() => {
                      if (currentStatusIndex > 0) {
                        const newIndex = currentStatusIndex - 1;
                        setCurrentStatusIndex(newIndex);
                        const isMyStatus = item.user?.phone === currentUserPhone || 
                                           item.user === currentUserPhone;
                        if (!isMyStatus) {
                          trackStatusView(selectedUserStatuses[newIndex]?.id);
                        }
                      }
                    }}
                    activeOpacity={1}
                  />
                  <TouchableOpacity 
                    style={[styles.statusTapArea, styles.statusRightTapArea]}
                    onPress={() => {
                      if (currentStatusIndex < selectedUserStatuses.length - 1) {
                        const newIndex = currentStatusIndex + 1;
                        setCurrentStatusIndex(newIndex);
                        const isMyStatus = item.user?.phone === currentUserPhone || 
                                           item.user === currentUserPhone;
                        if (!isMyStatus) {
                          trackStatusView(selectedUserStatuses[newIndex]?.id);
                        }
                      } else {
                        setModalVisible(false);
                      }
                    }}
                    activeOpacity={1}
                  />
                  {item.status_type === 'video' ? (
                    <Video
                      source={{ uri: getStatusImageUrl(item.media) }}
                      style={styles.statusFullImage}
                      resizeMode="contain"
                      paused={statusPaused}
                      repeat={true}
                      onError={(e) => console.log('Video error:', e)}
                    />
                  ) : (
                    <Image
                      source={{ uri: getStatusImageUrl(item.media) }}
                      style={styles.statusFullImage}
                      resizeMode="contain"
                    />
                  )}
                  <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                    style={styles.statusViewerHeader}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <Image
                      source={
                        item.user?.profile_picture
                          ? { uri: `${API_ROUTE_IMAGE}${item.user.profile_picture}` }
                          : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                      }
                      style={styles.statusViewerAvatar}
                    />
                    <View style={styles.statusViewerUserInfo}>
                      <Text style={styles.statusViewerUsername}>
                        {item.user?.phone === currentUserPhone || item.user === currentUserPhone
                          ? 'My Status'
                          : item.user?.name || item.user?.phone || 'User'}
                      </Text>
                      <Text style={styles.statusViewerTime}>
                        {formatStatusTime(item.created_at)}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.statusViewerCloseButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Icon name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                  </LinearGradient>
                  {item.text && (
                    <View style={styles.statusCaptionContainer}>
                      <Text style={styles.statusViewerCaption}>{item.text}</Text>
                    </View>
                  )}
                  {(item.user?.phone === currentUserPhone || item.user === currentUserPhone) && item.viewers_count > 0 && (
                    <TouchableOpacity
                      style={styles.statusViewersButton}
                      onPress={() => {
                        if (item.viewers && item.viewers.length > 0) {
                          setCurrentViewers(item.viewers);
                          setViewersModalVisible(true);
                        }
                      }}
                    >
                      <Icon name="eye" size={16} color="#fff" />
                      <Text style={styles.statusViewersButtonText}>
                        {item.viewers_count} view{item.viewers_count !== 1 ? 's' : ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.statusProgressContainer}>
                    {selectedUserStatuses.map((_, idx) => (
                      <View key={idx} style={styles.statusProgressBar}>
                        <View 
                          style={[
                            styles.statusProgressFill,
                            { 
                              width: idx === currentStatusIndex ? '100%' : 
                                     idx < currentStatusIndex ? '100%' : '0%' 
                            }
                          ]} 
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={currentStatusIndex}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                if (newIndex !== currentStatusIndex) {
                  setCurrentStatusIndex(newIndex);
                }
              }}
              style={styles.statusFlatList}
            />
          </View>
        </Modal>

        <EarningsSlideInManager />

        <Animated.View style={{ 
          opacity: snackbarFadeAnim,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999, 
        }}>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            style={{
              backgroundColor: snackbarType === 'error' ? '#FF3B30' : 
                              snackbarType === 'info' ? '#007AFF' : '#2baf4cff',
              margin: 10,
              borderRadius: 10,
            }}
            wrapperStyle={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 40 : 20,
              left: 0,
              right: 0,
              zIndex: 99999,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 0 }}>
              <Ionicons 
                name={snackbarType === 'error' ? 'alert-circle' : 
                      snackbarType === 'info' ? 'information-circle' : 'checkmark-circle'} 
                size={22} 
                color="#fff" 
                
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: '#fff', fontSize: 14, flex: 1 }}>
                {snackbarMessage}
              </Text>
            </View>
          </Snackbar>
        </Animated.View>
        {renderAIFloatingButton()}

        {snackbar.visible && (
          <Animated.View 
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 50 : 30,
              left: 16,
              right: 16,
              zIndex: 99999,
              backgroundColor: snackbar.type === 'error' ? '#FF3B30' : 
                              snackbar.type === 'info' ? '#007AFF' : '#2baf4cff',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons 
              name={snackbar.type === 'error' ? 'alert-circle' : 
                    snackbar.type === 'info' ? 'information-circle' : 'checkmark-circle'} 
              size={20} 
              color="#fff" 
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: '#fff', fontSize: 13, flex: 1 }}>
              {snackbar.message}
            </Text>
            <TouchableOpacity 
              onPress={() => setSnackbar(prev => ({ ...prev, visible: false }))}
              style={{ padding: 4 }}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}


        <BottomNav 
          navigation={navigation} 
          setShowAccountModal={setShowAccountModal}
          activeRoute="Home" 
          style={{ zIndex: 9999 }}
        />
          <IncomingCallHandler navigation={navigation} route={route} />
        <AccountSwitchBottomSheet
          visible={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          navigation={navigation}
          colors={colors}
          isDark={isDark}
        />
      </SafeAreaView>
    </>
  );
}

// ============================================================
// STYLES 
// ============================================================
const styles = StyleSheet.create({
    container: { 
    flex: 1, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    backgroundColor:'#fff',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
statusViewerContainer: {
  flex: 1,
  backgroundColor: '#000',
},
statusViewerPage: {
  width: width,
  height: height,
  backgroundColor: '#000',
  justifyContent: 'center',
  alignItems: 'center',
},
statusFullImage: {
  width: width,
  height: height,
},
statusTapArea: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: width * 0.3,
  zIndex: 100,
},
statusLeftTapArea: {
  left: 0,
},
statusRightTapArea: {
  right: 0,
},
sectionContainer: {
  marginTop: 12,
  marginBottom: 8,
},
aiFabContainer: {
  position: 'absolute',
  bottom: Platform.OS === 'ios' ? 100 : 150,
  right: 20,
  alignItems: 'center',
  zIndex: 9999,
},
aiFabButton: {
  width: 40,
  height: 40,
  borderRadius: 32.5,
  shadowColor: '#0D64DD',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 8,
},
aiFabGradient: {
  width: 40,
  height: 40,
  borderRadius: 32.5,
  justifyContent: 'center',
  alignItems: 'center',
},
aiFabPulse: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
aiFabPulseRing: {
  position: 'absolute',
  top: -8,
  left: -8,
  right: -8,
  bottom: -8,
  borderRadius: 40,
  borderWidth: 3,
  borderColor: '#0D64DD',
  opacity: 0,
},
aiFabPulseRingDelay1: {
  borderColor: '#1a7be5',
  animationDelay: '1s',
},
aiFabPulseRingDelay2: {
  borderColor: '#4a9ff5',
  animationDelay: '2s',
},
aiFabLabelContainer: {
  marginTop: 4,
  backgroundColor: 'rgba(0,0,0,0.7)',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 8,
},
aiFabLabel: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '800',
},
statusViewerHeader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingTop: Platform.OS === 'ios' ? 60 : 40,
  paddingBottom: 16,
  zIndex: 10,
},
statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsDot: {
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 2,
  },

   actionsContainer: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionCount: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 8,
  },
  actionSpacer: {
    flex: 1,
  },
statusViewerAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 12,
  borderWidth: 2,
  borderColor: '#fff',
},
statusViewerUserInfo: {
  flex: 1,
},
statusViewerUsername: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
statusViewerTime: {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 12,
  marginTop: 2,
},
statusViewerCloseButton: {
  padding: 8,
},
statusCaptionContainer: {
  position: 'absolute',
  bottom: 100,
  left: 20,
  right: 20,
  backgroundColor: 'rgba(0,0,0,0.5)',
  padding: 12,
  borderRadius: 8,
},
statusViewerCaption: {
  color: '#fff',
  fontSize: 16,
  textAlign: 'center',
},
statusViewersButton: {
  position: 'absolute',
  bottom: 40,
  alignSelf: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  flexDirection: 'row',
  alignItems: 'center',
},
statusViewersButtonText: {
  color: '#fff',
  marginLeft: 6,
  fontSize: 14,
},
statusProgressContainer: {
  position: 'absolute',
  top: Platform.OS === 'ios' ? 50 : 30,
  left: 10,
  right: 10,
  flexDirection: 'row',
  zIndex: 10,
},
statusProgressBar: {
  flex: 1,
  height: 3,
  backgroundColor: 'rgba(255,255,255,0.3)',
  marginHorizontal: 2,
  borderRadius: 2,
  overflow: 'hidden',
},
statusProgressFill: {
  height: '100%',
  backgroundColor: '#fff',
},
statusFlatList: {
  flex: 1,
},
  loadingSkeleton: {
    backgroundColor: '#e0e0e0',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  goLiveButton: {
    alignItems: 'center',
    marginRight: 24,
  },
  goLiveText: {
    fontSize: 11,
    marginTop: 2,
  },
  
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
imageModalImageSection: {
  height: '60%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

imageModalInfoContainer: {
  height: '40%',
  width: '100%',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingTop: 16,
  paddingHorizontal: 20,
},

imageModalInfoScrollContent: {
  flexGrow: 1,
  paddingBottom: 16,
},

imageModalUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

imageModalAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 12,
},

imageModalUserText: {
  flex: 1,
},

imageModalUsername: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 2,
},

imageModalTime: {
  fontSize: 12,
},

imageModalCaption: {
  fontSize: 15,
  lineHeight: 22,
  marginBottom: 12,
},

imageModalStats: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
  flexWrap: 'wrap',
},

imageModalStat: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 20,
  marginBottom: 8,
},

imageModalStatText: {
  fontSize: 14,
  marginLeft: 6,
},
fullSizeImage: {
  width: '100%',
  height: '100%',
},

reactionsContainer: {
    //paddingHorizontal: 12,
    //paddingVertical: 6,
    marginTop: 2,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // flexWrap: 'nowrap',
  },

  //  reactionButton: {
  //   paddingVertical: 6,
  //   paddingHorizontal: 12,
  //   borderRadius: 20,
  //   minWidth: 60,
  //   alignItems: 'center',
  // },

  reactionButton: {
    flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 0,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    //minWidth: 0, // Allows flexible sizing
    //maxWidth: '10%', // Ensures all buttons fit
  },
  reactionButtonActive: {
    backgroundColor: 'rgba(13, 100, 221, 0.08)',
  },
  reactionButtonPulse: {
    transform: [{ scale: 0.92 }],
  },
  reactionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    flexWrap: 'nowrap',
  },
  reactionCount: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 5,
    textAlign: 'center',
    marginHorizontal: 1,
  },
  reactionLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 1,
  },

  // Make sure these are responsive
  tweetContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tweetContent: {
    flex: 1,
  },
  tweetText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  tweetActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

modalImagePage: {
  width: width,
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  refreshingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  refreshingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  
  friendSuggestionWrapper: {
    marginVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 12,
    borderWidth: 1,
  },
  friendSuggestionBottom: {
    marginVertical: 20,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 12,
    borderWidth: 1,
  },
  networkButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 100, 221, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(13, 100, 221, 0.15)',
  },
  networkButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  networkIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    //backgroundColor: 'rgba(13, 100, 221, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  networkInfo: {
    flex: 1,
  },
  networkScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  networkLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  networkStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  networkStatusText: {
    fontSize: 16,
  },
  networkArrow: {
    marginLeft: 4,
  },

  // Network Modal
  networkModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  networkModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
    paddingBottom: 10,
  },
  networkModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  networkModalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  networkModalClose: {
    padding: 4,
  },

  // Network Score Display
  networkScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  networkScoreCircle: {
    flex: 1,
    alignItems: 'center',
  },
  networkScoreNumber: {
    fontSize: 36,
    fontWeight: '800',
  },
  networkScoreLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  networkStatusBadge: {
    alignItems: 'center',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  networkStatusEmoji: {
    fontSize: 32,
  },
  networkStatusLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  // Add to your styles object
actionsContainer: {
  paddingHorizontal: 12,
  paddingVertical: 4,
  marginTop: 2,
},
actionsRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
},
actionButton: {
  paddingVertical: 6,
  paddingHorizontal: 8,
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 40,
},
actionButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  flexWrap: 'nowrap',
},
actionLabel: {
  fontSize: 14,
  fontWeight: '500',
  marginLeft: 2,
},
actionCount: {
  fontSize: 14,
  fontWeight: '600',
  minWidth: 8,
  marginLeft: 2,
},

  // Reaction Items
  networkReactionsList: {
    flex: 1,
  },
  networkReactionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  networkReactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkReactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  networkReactionInfo: {
    flex: 1,
  },
  networkReactionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  networkActionButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'rgba(13, 100, 221, 0.08)',
    //borderRadius: 20,
    //borderWidth: 1,
    //borderColor: 'rgba(13, 100, 221, 0.15)',
    minHeight: 36,
  },
  networkActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  networkIconWrapper: {
    width: 24,
    height: 24,
    //borderRadius: 12,
    //backgroundColor: 'rgba(13, 100, 221, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkActionScore: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 8,
  },
  networkActionEmoji: {
    fontSize: 14,
    marginLeft: 2,
  },
  networkReactionDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  networkReactionCount: {
    alignItems: 'flex-end',
  },
  networkReactionNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  networkReactionPercentage: {
    fontSize: 12,
    marginTop: 2,
  },
  networkProgressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  networkProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Insights
  networkInsightsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  networkInsightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  networkInsightItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  networkInsightText: {
    fontSize: 14,
  },

  // Share Button
  networkShareButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  networkShareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  tweetContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1.5,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
    borderWidth: 1,
  },
 
  verifiedBadgeSmall: {
    marginLeft: 4,
    backgroundColor: '#1DA1F2',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tweetContent: { 
    flex: 1, 
  },
  tweetHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    flexWrap: "wrap",
    marginBottom: 8,
    paddingHorizontal:20
  },
  name: { 
    fontWeight: "bold", 
    fontSize: 16,
  },
  dot: { 
    marginHorizontal: 6, 
    fontSize: 16,
  },
  time: { 
    fontSize: 14,
  },
  tweetText: { 
    fontSize: 15, 
    lineHeight: 20,
    marginBottom: 8,
    paddingHorizontal:20
  },

  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  tweetImage: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover", 
    maxHeight: 700,      
    minHeight: 300,      
  },
  cameraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    marginBottom: 8,
  },
  loadingIndicator: {
    marginBottom: 4,
  },
  
  tweetActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  actionButton: {
    marginTop:10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 0,
    paddingHorizontal: 9,
    minWidth: 50,
    justifyContent: 'center',
  },
  channelsSection: {
  paddingVertical: 12,
  paddingHorizontal: 16,
},
channelsHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
channelsTitle: {
  fontSize: 18,
  fontWeight: '700',
},
seeAllText: {
  fontSize: 14,
  fontWeight: '600',
},
channelsList: {
  paddingRight: 16,
},
channelCard: {
  width: 120,
  padding: 10,
  borderRadius: 12,
  marginRight: 12,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
  marginBottom:10
},
channelCardImage: {
  width: 90,
  height: 90,
  borderRadius: 50,
  marginBottom: 8,
},
channelCardName: {
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
},
channelCardMembers: {
  fontSize: 12,
  marginTop: 2,
},
  actionCount: {
    marginLeft: 0,
    fontSize: 15,
  },
  readMore: {
    fontWeight: '600',
  },
  followButton: {
    backgroundColor: '#0d64dd',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
  },
  followingButtonText: {
    color: '#333',
  },
  optionsButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  commentModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  optionsModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  replyModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingBottom: 20,
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  postPreview: {
    padding: 16,
    borderBottomWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTimestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
singleImageContainer: {
  width: '100%',
  aspectRatio: 1,
  borderRadius: 0,
  overflow: 'hidden',
  marginBottom: 8,
},
singleImage: {
  width: '100%',
  height: '100%',
},
doubleImageContainer: {
  flexDirection: 'row',
  width: '100%',
  aspectRatio: 2,
  gap: 4,
  marginBottom: 8,
},
doubleImageWrapper: {
  flex: 1,
  borderRadius: 0,
  overflow: 'hidden',
},
doubleImage: {
  width: '100%',
  height: '100%',
},
tripleImageContainer: {
  flexDirection: 'row',
  width: '100%',
  aspectRatio: 1.5,
  gap: 4,
  marginBottom: 8,
},
tripleMainImageWrapper: {
  flex: 1,
  borderRadius: 0,
  overflow: 'hidden',
},
tripleMainImage: {
  width: '100%',
  height: '100%',
},
tripleSideContainer: {
  flex: 1,
  gap: 4,
},
tripleSideImageWrapper: {
  flex: 1,
  borderRadius: 0,
  overflow: 'hidden',
},
tripleSideImage: {
  width: '100%',
  height: '100%',
},
quadImageContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  aspectRatio: 1,
  gap: 4,
  marginBottom: 8,
},
quadImageWrapper: {
  width: '48%', 
  aspectRatio: 1,
  borderRadius: 0,
  overflow: 'hidden',
  position: 'relative',
},
quadImage: {
  width: '100%',
  height: '100%',
},
moreImagesOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  alignItems: 'center',
},
moreImagesText: {
  color: '#fff',
  fontSize: 24,
  fontWeight: 'bold',
},
imageLoadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalImagePage: {
  width: width,
  height: '70%',
  justifyContent: 'center',
  alignItems: 'center',
},
imageCounterModal: {
  position: 'absolute',
  top: 20,
  right: 20,
  backgroundColor: 'rgba(0,0,0,0.6)',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},
imageCounterModalText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
},

verifiedBadge: {
  backgroundColor: "#1877F2",
  borderRadius: 50,
  width: 16,
  height: 16,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 17,
},
  postImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  statusScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusWrapper: {
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  notificationIconContainer: {
  position: 'relative',
},
notificationBadge: {
  position: 'absolute',
  top: -5,
  right: 15,
  backgroundColor: '#FF3B30',
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 4,
},
notificationBadgeText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
},
  statusImage: {
    width: 80,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  statusImageStyle: {
    borderRadius: 20,
  },

  statusLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  statusCameraIcon: {
    opacity: 0.8,
  },
  
  videoPlayIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  statusNameContainer: {
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  replyingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  
  replyingText: {
    fontSize: 12,
  },
  
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
  },

  // Replace the existing styles with these improved ones:

tweetHeader: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  marginBottom: 8,
  gap: 12,
},
avatarContainer: {
  position: 'relative',
},
avatar: {
  width: 44,
  height: 44,
  borderRadius: 22,
  borderWidth: 1,
},
userInfoContainer: {
  flex: 1,
  justifyContent: 'center',
},
userNameContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 4,
},
name: {
  fontWeight: "bold",
  fontSize: 16,
  color: '#000',
},
verifiedBadge: {
  backgroundColor: "#1877F2",
  borderRadius: 50,
  width: 18,
  height: 18,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 2,
},
time: {
  fontSize: 13,
  color: '#666',
  marginTop: 1,
},
followButton: {
  backgroundColor: '#0d64dd',
  paddingHorizontal: 16,
  paddingVertical: 6,
  borderRadius: 20,
  marginLeft: 'auto',
},
followButtonText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
followingButton: {
  backgroundColor: '#f0f0f0',
},
followingButtonText: {
  color: '#333',
},
optionsButton: {
  marginLeft: 'auto',
  padding: 4,
},
  
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: 'center',
  },
  
  sendButton: {
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  sendButtonDisabled: {
    opacity: 0.5,
  },
  
  emptyComments: {
    padding: 40,
    alignItems: 'center',
  },
  
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  statusNameText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  viewCountText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  deleteStatusButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  liveStreamWrapper: {
    alignItems: 'center',
    marginRight: 12,
  },
  liveStreamContainer: {
    width: 80,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  liveStreamImage: {
    width: '100%',
    height: '100%',
  },
  liveStreamOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: 4,
  },
  // reactionsRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  //   marginTop: 4,
  //   borderTopWidth: 0.5,
  //   borderTopColor: 'rgba(0,0,0,0.08)',
  // },
 
  
  // reactionButtonContent: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 4,
  // },
  // reactionCount: {
  //   fontSize: 13,
  //   fontWeight: '500',
  //   minWidth: 16,
  //   textAlign: 'center',
  // },
  reactionLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  liveText: {
    color: '#FF0000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveStreamName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  liveStreamStats: {
    color: '#ccc',
    fontSize: 10,
  },
  liveModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveModal: {
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  liveModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  liveModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  liveModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  liveModalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  liveModalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  liveModalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  liveModalStats: {
    fontSize: 14,
  },
  emptyLive: {
    padding: 20,
    alignItems: 'center',
  },
  emptyLiveText: {
    fontSize: 16,
  },
  closeLiveModalButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeLiveModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewersModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewersModal: {
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  viewersModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewersModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  viewerName: {
    fontSize: 16,
  },
  emptyViewers: {
    padding: 20,
    alignItems: 'center',
  },
  emptyViewersText: {
    fontSize: 16,
  },
  // promoContainer: {
  //   height: 160,
  //   borderRadius: 12,
  //   overflow: 'hidden',
  //   margin: 16,
  //   marginTop: 8,
  //   position: 'relative',
  // },
  // promoBanner: {
  //   width: '100%',
  //   height: '100%',
  // },
  // promoContent: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   padding: 20,
  //   justifyContent: 'center',
  //   backgroundColor: 'rgba(0,0,0,0.3)',
  // },
  // promoTitle: {
  //   fontSize: 24,
  //   fontWeight: '700',
  //   color: '#fff',
  //   marginBottom: 4,
  // },
  // promoSubtitle: {
  //   fontSize: 16,
  //   color: '#fff',
  //   marginBottom: 12,
  // },
  // promoButton: {
  //   backgroundColor: '#fff',
  //   borderRadius: 20,
  //   paddingVertical: 8,
  //   paddingHorizontal: 20,
  //   alignSelf: 'flex-start',
  // },
  // promoButtonText: {
  //   color: '#0d64dd',
  //   fontWeight: '600',
  //   fontSize: 14,
  // },
  promoContainer: {
  height: 180,
  borderRadius: 12,
  overflow: 'hidden',
  margin: 16,
  marginTop: 8,
  position: 'relative',
  backgroundColor: '#000',
},
promoBanner: {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
},
promoGradient: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
},
promoContent: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: 20,
  justifyContent: 'center',
  zIndex: 2,
},
promoBadge: {
  backgroundColor: '#FF6B35',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 20,
  alignSelf: 'flex-start',
  marginBottom: 8,
  zIndex: 3,
},
promoBadgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '700',
},
promoTitle: {
  fontSize: 24,
  fontWeight: '700',
  color: '#FFFFFF',
  marginBottom: 4,
  textShadowColor: 'rgba(0,0,0,0.5)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 4,
},
promoSubtitle: {
  fontSize: 14,
  color: '#FFFFFF',
  marginBottom: 12,
  textShadowColor: 'rgba(0,0,0,0.5)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
  opacity: 0.9,
},
promoButton: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 24,
  alignSelf: 'flex-start',
  zIndex: 3,
},
promoButtonText: {
  color: '#0d64dd',
  fontWeight: '700',
  fontSize: 14,
},
promoDotsContainer: {
  position: 'absolute',
  bottom: 10,
  alignSelf: 'center',
  flexDirection: 'row',
  zIndex: 3,
  gap: 6,
},
promoDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.5)',
},
promoDotActive: {
  backgroundColor: '#FFFFFF',
  width: 20,
},
  suggestedFriendsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  suggestedFriendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestedFriendsList: {
    paddingRight: 16,
  },
  commentVerifiedBadge: {
  backgroundColor: "#1877F2",
  borderRadius: 50,
  width: 14,
  height: 14,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 4,
},
replyVerifiedBadge: {
  backgroundColor: "#1877F2",
  borderRadius: 50,
  width: 12,
  height: 12,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 4,
},
commentHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
  width: '100%',
},
replyHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
},
commentUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  flexWrap: 'wrap',
  gap: 6,
},
replyUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  flexWrap: 'wrap',
  gap: 4,
},
commentActions: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
  gap: 16,
  flexWrap: 'wrap',
},
commentActionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  paddingVertical: 2,
  paddingHorizontal: 4,
},
commentActionText: {
  fontSize: 11,
},
replyActions: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
  gap: 12,
},
replyActionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 2,
},
replyActionText: {
  fontSize: 10,
},
replyInputActions: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: 12,
  marginTop: 8,
},
replyCancelButton: {
  paddingHorizontal: 12,
  paddingVertical: 6,
},
replyCancelText: {
  fontSize: 12,
},
replySendButtonDisabled: {
  opacity: 0.5,
},
  suggestedFriendItem: {
    width: 150,
    alignItems: 'center',
    marginRight: 12,
    borderWidth:1,
    borderStyle:'solid',
    padding:15,
    borderRadius:5,
  },
  suggestedFriendImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  suggestedFriendImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  suggestedFriendVerified: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1DA1F2',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  suggestedFriendName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    width: '100%',
  },
  suggestedFriendClub: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  suggestedFriendFollowButton: {
    backgroundColor: '#0d64dd',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  suggestedFriendFollowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestedFriendFollowingButton: {
    backgroundColor: '#f0f0f0',
  },
  suggestedFriendFollowingButtonText: {
    color: '#333',
  },
  
  imageModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageModalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },

  modalLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalCameraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCameraIcon: {
    marginBottom: 16,
  },
  modalLoadingIndicator: {
    marginBottom: 8,
  },
  modalLoadingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  imageModalInfo: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },

  commentContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentUsername: {
    fontWeight: '600',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },
  commentTimestamp: {
    fontSize: 12,
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    marginRight: 16,
  },
  repliesWrapper: {
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#f0f0f0',
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
    padding: 8,
    borderRadius: 12,
  },
  replyUsername: {
    fontWeight: '600',
    fontSize: 12,
  },
  replyText: {
    fontSize: 12,
    marginTop: 2,
  },
  replyTimestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  replyDeleteButton: {
    padding: 4,
    marginLeft: 4,
  },
  viewMoreReplies: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  viewMoreRepliesText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentDeleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 20,
    padding: 8,
  },
  replyInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  replySendButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  replySendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  notificationBadge: {
  position: 'absolute',
  top: -5,
  right: 15,
  backgroundColor: '#FF3B30',
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 4,
},
notificationBadgeText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
},
  // divider: {
  //   height: 1,
  //   marginVertical: 16,
  //   borderWidth: 2,
  // },
  divider: {
    height: 3, 
    backgroundColor: 'rgba(0,0,0,0.1)', 
    marginVertical: 16,
    width: '100%',
},

});