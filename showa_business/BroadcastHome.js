import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icontt from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colorscustom';
import Icont from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import axios from 'axios';
import FriendSuggestion from '../components/FriendSuggestion';
import backgroundFetchService from '../src/services/BackgroundFetchService';
import { useTheme } from '../src/context/ThemeContext'; 
import Jobs from '../screens/Jobs';
import VideoFeeds from '../screens/ShortFeedVideo';
import Ads from '../screens/AdsFeed';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');



// Cache configuration
const POSTS_CACHE_KEY = 'posts_cache_v2'; 
const ALL_POSTS_CACHE_KEY = 'all_posts_cache_v2';
const VIEWS_CACHE_KEY = 'post_views_cache';
const SHARES_CACHE_KEY = 'post_shares_cache';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

const trackPostView = async (postId) => {
  try {
    const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
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
    
    await AsyncStorage.setItem(VIEWS_CACHE_KEY, JSON.stringify(views));
    return views[postId].count;
  } catch (error) {
    console.error('Error tracking view:', error);
    return 0;
  }
};

const getPostViews = async (postId) => {
  try {
    const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
    const views = viewsData ? JSON.parse(viewsData) : {};
    return views[postId]?.count || 0;
  } catch (error) {
    console.error('Error getting views:', error);
    return 0;
  }
};
const trackPostShare = async (postId) => {
  try {
    const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
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
    
    await AsyncStorage.setItem(SHARES_CACHE_KEY, JSON.stringify(shares));
    return shares[postId].count;
  } catch (error) {
    console.error('Error tracking share:', error);
    return 0;
  }
};

const getPostShares = async (postId) => {
  try {
    const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
    const shares = sharesData ? JSON.parse(sharesData) : {};
    return shares[postId]?.count || 0;
  } catch (error) {
    return 0;
  }
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
      
      {/* Image counter */}
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
        
        {/* Image Section - Takes 60% of screen */}
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
        
        {/* Bottom Info Section - Scrollable and takes remaining space */}
        <View style={[styles.imageModalInfoContainer, { backgroundColor: colors.card }]}>
          <ScrollView 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.imageModalInfoScrollContent}
            bounces={false}
          >
            {/* User Info */}
            <View style={styles.imageModalUserInfo}>
              <Image
                source={
                  post.user_profile_picture
                    ? { uri: post.user_profile_picture }
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
            
            {/* Caption */}
            {post.content ? (
              <Text style={[styles.imageModalCaption, { color: colors.text }]}>
                {post.content}
              </Text>
            ) : null}
            
            {/* Stats */}
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
  isDark 
}) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const postIdStr = post.id?.toString();


  // Prefetch images when component mounts
  useEffect(() => {
    if (post.all_images?.length > 0) {
      // High priority for first image, low for others
      post.all_images.forEach((img, index) => {
        const priority = index === 0 ? 'high' : 'low';
        if (priority === 'high') {
          Image.prefetch(img.url);
        } else {
          // Delay low priority images
          setTimeout(() => Image.prefetch(img.url), index * 500);
        }
      });
    }
  }, [post.id]);

  const displayImages = post.all_images || 
    (post.image_url ? [{ url: post.image_url, is_main: true }] : []);

  
  // Get reactions from props or use empty object
  const reactions = post.reactions || {};
  const userReaction = reactions.user_reaction;

  // Use the persisted counts from the post object
  const likeCount = post.like_count || 0;
  const commentCount = post.comment_count || 0;
  const shareCount = post.share_count || 0;

  // Get all images - handle both old and new format
  const allImages = post.all_images || [];


  const fixImageUrl = (url) => {
    if (!url) return null;
    
    // Check if URL is malformed (no extension)
    const hasExtension = /\.(jpg|jpeg|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
    
    if (!hasExtension) {
      // If it's a Cloudinary URL without extension, add .jpg
      if (url.includes('cloudinary') && url.includes('/upload/')) {
        return url + '.jpg';
      }
    }
    return url;
  };
  
  // If no all_images array but there's a single image, create array
  // const displayImages = allImages.length > 0 
  // ? allImages.map(img => ({
  //     ...img,
  //     url: fixImageUrl(img.url)
  //   }))
  // : (post.image_url ? [{ url: fixImageUrl(post.image_url), is_main: true }] : []);


  const navigation = useNavigation();


  
  // const handleImageLoad = (index) => {
  //   setImageLoading(prev => ({ ...prev, [index]: false }));
  // };

  const handleImageError = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };
   const handleImageLoad = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleFollowPress = () => {
    setIsFollowing(true);
    onFollow(post.user_id);
  };

  const handleSharePress = async () => {
    await onShare(post.id);
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    onViewImage({ ...post, images: displayImages, selectedIndex: index });
  };

  // Render image grid based on number of images
  const renderImageGrid = () => {
    if (displayImages.length === 0) return null;

    const imageCount = displayImages.length;

    // Single image
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
            onLoad={() => handleImageLoad(0)}
            onError={() => handleImageError(0)}
          />
          {imageLoading[0] && (
            <View style={styles.imageLoadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // Two images
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
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
              {imageLoading[index] && (
                <View style={styles.imageLoadingOverlay}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // Three images
    if (imageCount === 3) {
      return (
        <View style={styles.tripleImageContainer}>
          {/* First image - larger */}
          <TouchableOpacity 
            onPress={() => handleImagePress(0)}
            style={styles.tripleMainImageWrapper}
          >
            <Image
              source={{ uri: displayImages[0].url }}
              style={styles.tripleMainImage}
              resizeMode="cover"
              onLoad={() => handleImageLoad(0)}
              onError={() => handleImageError(0)}
            />
            {imageLoading[0] && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
          
          {/* Second and third images - stacked */}
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
                  onLoad={() => handleImageLoad(idx)}
                  onError={() => handleImageError(idx)}
                />
                {imageLoading[idx] && (
                  <View style={styles.imageLoadingOverlay}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // Four or more images
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
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
            {imageLoading[index] && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
            
            {/* Show +X overlay on last image if there are more than 4 */}
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
      <TouchableOpacity 
        onPress={() => navigation.navigate('OtherUserProfile', { userId: post.user_id })}
      >
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
      
      <View style={styles.tweetContent}>
        <View style={styles.tweetHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfile', { userId: post.user_id })}>
            <Text style={[styles.name, { color: colors.text }]}>{post.username}</Text>
          </TouchableOpacity>
         
          {post.is_verified && (
            <View style={styles.verifiedBadge}>
              <Icontt name="check-bold" size={11} color="#fff" />
            </View>
          )}
          <Text style={[styles.dot, { color: colors.textSecondary }]}>·</Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {dayjs(post.created_at).fromNow()}
          </Text>
          
          {type === 'allposts' ? (
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
        
        {/* Image Grid */}
        {renderImageGrid()}
        
        <View style={styles.tweetActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReaction(post.id, 'like')}
          >
            <MaterialIcons
              name={userReaction === 'like' ? 'thumb-up' : 'thumb-up-off-alt'}
              size={20}
              color={userReaction === 'like' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
              {likeCount > 0 ? likeCount : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(post.id)}
          >
            <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
              {commentCount > 0 ? commentCount : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSharePress}
          >
            <Ionicons name="share-social-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
              {shareCount > 0 ? shareCount : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => displayImages.length > 0 && handleImagePress(0)}
          >
            <Ionicons name="eye-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
              {post.views || ''}
            </Text>
          </TouchableOpacity>
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
            <Text style={styles.statusNameText}>
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
      
      {/* {isMyStatus && (
        <TouchableOpacity 
          style={styles.deleteStatusButton}
          onPress={() => onDelete(userStatus.statuses[0]?.id)}
        >
          <Icon name="close" size={16} color="#fff" />
        </TouchableOpacity>
      )} */}
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
          <Image
            source={
              item.profile_picture
                ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.suggestedFriendImage}
          />
          {item.is_verified && (
            <View style={styles.suggestedFriendVerified}>
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

export default function HomePage({ navigation }) {
  const { colors, isDark } = useTheme(); 
  const [reactionCounts, setReactionCounts] = useState({});
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isReplyBottomSheetVisible, setIsReplyBottomSheetVisible] = useState(false);
  const [isOptionsBottomSheetVisible, setIsOptionsBottomSheetVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [postById, setPostById] = useState([]);
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

  // ===== NEW PAGINATION STATES =====
  const [loading, setLoading] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [allPostsPage, setAllPostsPage] = useState(1);
  const [postsHasMore, setPostsHasMore] = useState(true);
  const [allPostsHasMore, setAllPostsHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  
  useEffect(()=>{
        const fetUserdata = async()=>{
          try {
            const userDataString = await AsyncStorage.getItem('userData');
            const userData = userDataString ? JSON.parse(userDataString) : null;
            const userId = userData?.id || 'unknown';
            const username = userData?.name || 'unknown';
            setUserName(username)
            console.log('login_user_data', username)
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        fetUserdata()
  },[])

  // ==================== COMMENT DELETE ====================

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
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              
              if (response.data.success) {
                // Update comments state - handle both top-level comments and replies
                setPostsComment(prev => {
                  // First, check if this is a top-level comment
                  const isTopLevelComment = prev.some(c => c.id === commentId && !c.parent_comment);
                  
                  if (isTopLevelComment) {
                    // If it's a top-level comment, remove it completely
                    return prev.filter(c => c.id !== commentId);
                  } else {
                    // If it's a reply, find its parent and remove only that reply
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
                
                // Update comment count in posts
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
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete comment');
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
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              
              if (response.data.success) {
                // Update the comment's replies in state
                setPostsComment(prev => prev.map(comment => {
                  if (comment.id === parentCommentId) {
                    // Filter out the deleted reply
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
              Alert.alert('Error', 'Failed to delete reply');
            }
          }
        }
      ]
    );
  } catch (error) {
    console.error('Error:', error);
  }
}, []);


  // ==================== COMMENT LIKES ====================

const handleCommentLike = useCallback(async (commentId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    // Optimistic update
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

    console.log('Comment like response:', response.data);

    if (response.status === 200 || response.status === 201) {
      // Update with actual data from server
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
    // Revert optimistic update on error
    setCommentLikesCount(prev => ({
      ...prev,
      [commentId]: Math.max(0, (prev[commentId] || 1) - 1)
    }));
  }
}, []);


// ==================== COMMENT REPLIES ====================

const handleReplyToComment = useCallback(async (commentId, replyText) => {
  if (!replyText.trim()) return;

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const userData = await AsyncStorage.getItem('userData');
    const parsedUser = userData ? JSON.parse(userData) : null;

    // Optimistic update
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

    console.log('Reply response:', response.data);

    if (response.status === 201) {
      // Replace temp reply with actual reply
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

      // Show reward if any
      if (response.data.reward) {
        Alert.alert(
          '💬 Reply Reward!',
          `You earned ${response.data.reward.coins} coins for your reply!`,
          [{ text: 'OK' }]
        );
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


// ==================== FETCH COMMENTS WITH REPLIES ====================

const fetchCommentsWithReplies = useCallback(async (postId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(
      `${API_ROUTE}/post/${postId}/comments/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Comments with replies:', response.data);

    if (response.status === 200) {
      // Make sure we're storing the comments array correctly
      const comments = response.data.comments || response.data;
      setPostsComment(comments);
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}, []);


// ==================== UPDATE COMMENT HANDLER ====================

const handleCommentOptimized = useCallback(async (postId) => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) return;

  try {
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
      setSelectedPostId(postId);
      
      if (commentsResponse.status === 200) {
        setPostsComment(commentsResponse.data.comments);
      }
      
      setIsBottomSheetVisible(true);
    }
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}, []);

const loadPostsFromCache = useCallback(async () => {
  try {
    const cachedData = await AsyncStorage.getItem(POSTS_CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      
      // Check if parsed has the expected structure
      if (!parsed || typeof parsed !== 'object') {
        console.warn('Invalid cache format');
        return false;
      }
      
      const { data, timestamp } = parsed;
      
      // Validate that data is an array
      if (!Array.isArray(data)) {
        console.warn('Cached data is not an array');
        return false;
      }
      
      const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
      if (isCacheValid) {
        const enhancedPosts = await Promise.all(
          data.map(async (post) => ({
            ...post,
            views: await getPostViews(post.id).catch(() => 0),
            shares: await getPostShares(post.id).catch(() => 0),
            is_verified: Math.random() > 0.7
          }))
        );
        setPosts([...enhancedPosts].reverse());
        return true;
      }
    }
  } catch (error) {
    console.error('Error loading posts from cache:', error);
    // Clear invalid cache
    await AsyncStorage.removeItem(POSTS_CACHE_KEY);
  }
  return false;
}, []);

  const loadAllPostsFromCache = useCallback(async () => {
  try {
    const cachedData = await AsyncStorage.getItem(ALL_POSTS_CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      
      // Check if parsed has the expected structure
      if (!parsed || typeof parsed !== 'object') {
        console.warn('Invalid all posts cache format');
        return false;
      }
      
      const { data, timestamp } = parsed;
      
      // Validate that data is an array
      if (!Array.isArray(data)) {
        console.warn('Cached all posts data is not an array');
        return false;
      }
      
      const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
      
      if (isCacheValid) {
        // Create a copy safely
        const dataCopy = data.slice(); // Use slice() instead of spread
        
        const sortedPosts = dataCopy.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        const filteredPosts = await filterUnfollowedUsers(sortedPosts);
        const enhancedPosts = await Promise.all(
          filteredPosts.map(async (post) => ({
            ...post,
            views: await getPostViews(post.id).catch(() => 0),
            shares: await getPostShares(post.id).catch(() => 0),
            is_verified: Math.random() > 0.6
          }))
        );
        setAllPosts(enhancedPosts);
        return true;
      }
    }
  } catch (error) {
    console.error('Error loading all posts from cache:', error);
    // Clear invalid cache
    await AsyncStorage.removeItem(ALL_POSTS_CACHE_KEY);
  }
  return false;
}, []);

  const savePostsToCache = useCallback(async (postsData) => {
  try {
    // Ensure postsData is an array
    const dataToCache = Array.isArray(postsData) ? postsData : [];
    
    await AsyncStorage.setItem(
      POSTS_CACHE_KEY,
      JSON.stringify({ 
        data: dataToCache, 
        timestamp: Date.now() 
      })
    );
  } catch (error) {
    console.error('Error saving posts to cache:', error);
  }
}, []);

const saveAllPostsToCache = useCallback(async (postsData) => {
  try {
    // Ensure postsData is an array
    const dataToCache = Array.isArray(postsData) ? postsData : [];
    
    await AsyncStorage.setItem(
      ALL_POSTS_CACHE_KEY,
      JSON.stringify({ 
        data: dataToCache, 
        timestamp: Date.now() 
      })
    );
  } catch (error) {
    console.error('Error saving all posts to cache:', error);
  }
}, []);

  // Optimized data fetching
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

// Fetch followed posts with pagination
const fetchPosts = useCallback(async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) return;

  try {
    const response = await axios.get(`${API_ROUTE}/posts/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      // Ensure response.data is an array
      const postsData = Array.isArray(response.data) ? response.data : 
                       (response.data.results || []);
      
      console.log('fetchPosts response:', postsData);
      
      const enhancedPosts = await Promise.all(
        postsData.map(async (post) => ({
          ...post,
          views: await getPostViews(post.id).catch(() => 0),
          shares: await getPostShares(post.id).catch(() => 0),
          is_verified: Math.random() > 0.7
        }))
      );

      const reversedData = [...enhancedPosts].reverse();
      setPosts(reversedData);
      await savePostsToCache(postsData); // Save original data
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}, [savePostsToCache]);

 // Fetch all posts with pagination - COMPLETE VERSION
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
      // Ensure response.data is an array
      const postsData = Array.isArray(postsResponse.data) ? postsResponse.data : 
                       (postsResponse.data.results || []);
      
      console.log('fetch-AllPosts response:', postsData);
      
      // Create a copy safely
      const dataCopy = postsData.slice();
      
      const sortedPosts = dataCopy.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      const filteredPosts = await filterUnfollowedUsers(sortedPosts);
      const enhancedPosts = await Promise.all(
        filteredPosts.map(async (post) => ({
          ...post,
          views: await getPostViews(post.id).catch(() => 0),
          shares: await getPostShares(post.id).catch(() => 0),
          is_verified: Math.random() > 0.6
        }))
      );
      setAllPosts(enhancedPosts);
      setFollowedUsers(followedUsers);
      await saveAllPostsToCache(postsData); // Save original data
    }
  } catch (error) {
    console.error('Error fetching all posts:', error);
  }
}, [saveAllPostsToCache]);

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

const handleReactionOptimized = useCallback(async (postId, type) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    // Store previous state for potential rollback
    const previousPosts = [...posts];
    const previousAllPosts = [...allposts];
    const previousReactionCounts = { ...reactionCounts };

    // Optimistic update - update UI immediately
    setReactionCounts((prev) => {
      const postIdStr = postId.toString();
      const currentReactions = prev[postIdStr] || { like: 0, love: 0, support: 0 };
      const newReactions = { ...currentReactions };

      if (newReactions.user_reaction === type) {
        newReactions[type] = (newReactions[type] || 0) - 1;
        newReactions.user_reaction = null;
      } else {
        if (newReactions.user_reaction) {
          newReactions[newReactions.user_reaction] = (newReactions[newReactions.user_reaction] || 0) - 1;
        }
        newReactions[type] = (newReactions[type] || 0) + 1;
        newReactions.user_reaction = type;
      }

      return { ...prev, [postIdStr]: newReactions };
    });

    // Optimistic update for like counts on posts
    if (type === 'like') {
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
    }

    // Make API call
    const response = await axios.post(
      `${API_ROUTE}/post-react/`,
      { 
        post_id: postId, 
        reaction_type: type,
        content: type === 'comment' ? newComment : '',
        share_platform: type === 'share' ? 'external' : null
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Reaction response:', response.data);

    // Update with actual data from server
    if (response.data) {
      // Update posts with the actual counts from response
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                like_count: response.data.like_count !== undefined ? response.data.like_count : post.like_count,
                comment_count: response.data.comment_count !== undefined ? response.data.comment_count : post.comment_count,
                share_count: response.data.share_count !== undefined ? response.data.share_count : post.share_count,
                reactions: {
                  ...post.reactions,
                  user_reaction: response.data.reaction?.reaction_type || null
                }
              } 
            : post
        )
      );
      
      setAllPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                like_count: response.data.like_count !== undefined ? response.data.like_count : post.like_count,
                comment_count: response.data.comment_count !== undefined ? response.data.comment_count : post.comment_count,
                share_count: response.data.share_count !== undefined ? response.data.share_count : post.share_count,
                reactions: {
                  ...post.reactions,
                  user_reaction: response.data.reaction?.reaction_type || null
                }
              } 
            : post
        )
      );

      // Show reward if any
      if (response.data.reward) {
        Alert.alert(
          '🎉 Reward Earned!',
          `You earned ${response.data.reward.coins} coins for this ${type}!`,
          [{ text: 'OK' }]
        );
      }
    }
  } catch (error) {
    console.error('Error handling reaction:', error);
    // Revert optimistic update on error
    onRefresh();
  }
}, [posts, allposts, reactionCounts, newComment]);

  // const handleCommentOptimized = useCallback(async (postId) => {
  //   const token = await AsyncStorage.getItem('userToken');
  //   if (!token) return;

  //   try {
  //     const [postResponse, commentsResponse] = await Promise.all([
  //       axios.get(`${API_ROUTE}/posts/${postId}/`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //       axios.get(`${API_ROUTE}/get-posts-comment/${postId}/comments/all/`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //     ]);

  //     if (postResponse.status === 200) {
  //       setPostById(postResponse.data);
  //       setSelectedPostId(postId);
        
  //       if (commentsResponse.status === 200) {
  //         const parentComments = commentsResponse.data.filter(comment => !comment.parent);
  //         setPostsComment(prev => {
  //           const otherComments = prev.filter(c => c.post !== postId);
  //           return [...otherComments, ...parentComments];
  //         });
  //       }
        
  //       setIsBottomSheetVisible(true);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching post details:', error);
  //   }
  // }, []);

  const handleShareOptimized = useCallback(async (postId) => {
  try {
    const post = posts.find(p => p.id === postId) || allposts.find(p => p.id === postId);
    if (!post) return 0;

    const shareOptions = {
      message: `${post.content}\n\nShared from Showa`,
      url: post.image_url,
      title: `Post by ${post.username}`,
    };

    await Share.share(shareOptions);
    
    const token = await AsyncStorage.getItem('userToken');
    
    // Call API to record the share
    const response = await axios.post(
      `${API_ROUTE}/post-react/`,
      { 
        post_id: postId, 
        reaction_type: 'share',
        share_platform: 'external'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Share response:', response.data);
    
    // Update local state with new share count
    const newShareCount = response.data.share_count || post.share_count + 1;
    
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === postId 
          ? { ...p, share_count: newShareCount } 
          : p
      )
    );
    
    setAllPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === postId 
          ? { ...p, share_count: newShareCount } 
          : p
      )
    );
    
    await trackPostShare(postId);
    setIsOptionsBottomSheetVisible(false);
    setSnackbarVisible(true);
    
    // Show reward if any
    if (response.data.reward) {
      Alert.alert(
        '🎉 Share Reward!',
        `You earned ${response.data.reward.coins} coins for sharing!`,
        [{ text: 'OK' }]
      );
    }
    
    return newShareCount;
  } catch (error) {
    console.error('Error sharing post:', error);
    return 0;
  }
}, [posts, allposts]);

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
      setAllPosts((prev) => prev.filter((post) => post.user_id !== userId));
      setSuggestedFriends((prev) => prev.filter((friend) => friend.id !== userId));
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  }, []);

  const handleViewUser = useCallback((userId) => {
    navigation.navigate('BroadcastUserProfile', { user_ID: userId });
  }, [navigation]);

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
      setSnackbarVisible(true);
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
      setSnackbarVisible(true);
      console.log('save')
      setIsOptionsBottomSheetVisible(false);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  }, []);
  const openImageModal = useCallback((userStatuses) => {
    setSelectedUserStatuses(userStatuses.statuses);
    setCurrentStatusIndex(0);
    setModalVisible(true);
    setPaused(false);
  }, []);

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
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error deleting status:', error);
      Alert.alert('Error', 'Failed to delete status');
    }
  }, []);
  const handleViewImage = useCallback((post) => {
  // Make sure we pass all images to the modal
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

    // Determine if this is a reply
    const isReply = replyToCommentId !== null;
    const parentCommentId = replyToCommentId;

    // Optimistic update with complete user data
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
      // Add reply-specific data
      optimisticData.parent = parentCommentId;
      optimisticData.parent_comment_id = parentCommentId;
    }

    // Optimistic update
    if (isReply) {
      // For replies, add to parent comment's replies array
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
      // For top-level comments, add to main list
      setPostsComment(prev => [optimisticData, ...prev.filter(c => c.post === selectedPostId)]);
      
      // Update comment count optimistically
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

    // Clear input and reply state
    setNewComment('');
    if (isReply) {
      setReplyToCommentId(null);
    }

    // Make API call
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
      // Replace optimistic data with actual data
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

        // Update with actual comment count
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
      
      // Show reward if any
      if (response.data.reward) {
        Alert.alert(
          '💬 Reward!',
          `You earned ${response.data.reward.coins} coins!`,
          [{ text: 'OK' }]
        );
      }
    }
  } catch (error) {
    console.error('Failed to post:', error);
    // Remove optimistic data on error
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
      // Revert comment count
      setPosts(prev => prev.map(post => 
        post.id === selectedPostId 
          ? { ...post, comment_count: Math.max(0, (post.comment_count || 0) - 1) } 
          : post
      ));
    }
    Alert.alert('Error', 'Failed to post. Please try again.');
  }
}, [newComment, selectedPostId, replyToCommentId, username, userprofileimage, posts, allposts]);

  const onCommentSubmitReply = useCallback(async () => {
    if (!replyText.trim() || !selectedCommentId) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return;
      }

      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const loginUserId = parsedUser?.id;

      if (!loginUserId) {
        console.warn('User ID not found in stored data.');
        return;
      }

      const tempReplyId = `temp_reply_${Date.now()}`;
      const newReplyData = {
        id: tempReplyId,
        username: username,
        text: replyText.trim(),
        userAvatar: userprofileimage,
        created_at: new Date().toISOString(),
      };

      setPostsComment((prev) => {
        const updatedComments = prev.map((comment) =>
          comment.id === selectedCommentId
            ? {
                ...comment,
                replies: comment.replies
                  ? [...comment.replies, newReplyData]
                  : [newReplyData],
              }
            : comment
        );
        return updatedComments;
      });

      const response = await axios.post(
        `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`,
        {
          text: replyText.trim(),
          post: selectedPostId,
          user: loginUserId,
          image: userprofileimage,
          parent: selectedCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setPostsComment((prev) => {
          const updatedComments = prev.map((comment) =>
            comment.id === selectedCommentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === tempReplyId
                      ? {
                          ...reply,
                          id: response.data.id,
                        }
                      : reply
                  ),
                }
              : comment
          );
          return updatedComments;
        });

        setReplyText('');
        setReplyToCommentId(null);
        setSnackbarVisible(true);
      } else {
        setPostsComment((prev) => {
          const updatedComments = prev.map((comment) =>
            comment.id === selectedCommentId
              ? {
                  ...comment,
                  replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
                }
              : comment
          );
          return updatedComments;
        });
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
      setPostsComment((prev) => {
        const updatedComments = prev.map((comment) =>
          comment.id === selectedCommentId
            ? {
                ...comment,
                replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
              }
            : comment
        );
        return updatedComments;
      });
    }
  }, [replyText, selectedCommentId, selectedPostId, username, userprofileimage]);

  const handleReply = useCallback((username, commentId) => {
    setReplyToCommentId(commentId);
    setReplyText('');
  }, []);

  const onPostCommentLikes = useCallback(async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const loginUserId = parsedUser?.id;

      if (!loginUserId) return;

      setCommentLikesCount((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || 0) + 1,
      }));

      const response = await axios.post(
        `${API_ROUTE}/post-comments-like/${commentId}/like/`,
        {
          user: loginUserId,
          comment: commentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbarVisible(true);
      } else {
        setCommentLikesCount((prev) => ({
          ...prev,
          [commentId]: (prev[commentId] || 1) - 1,
        }));
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      setCommentLikesCount((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || 1) - 1,
      }));
    }
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPosts(),
      fetchAllPosts(),
      fetchStatus(),
      fetchSuggestedFriends(),
      fetchLiveStreams()
    ]);
    setRefreshing(false);
  }, [fetchPosts, fetchAllPosts, fetchStatus, fetchSuggestedFriends, fetchLiveStreams]);

  useEffect(() => {
  const initializeData = async () => {
    setInitialLoading(true);
    await Promise.all([
      loadPostsFromCache(),
      loadAllPostsFromCache(),
      fetchCurrentUser(),
      fetchStatus(),
    ]);
    
    // Fetch fresh data in background
    Promise.all([
      fetchPosts(1),
      fetchAllPosts(1),
      fetchReactions(),
      fetchSuggestedFriends(),
      fetchLiveStreams(),
    ]).finally(() => {
      setInitialLoading(false);
    });
  };

  initializeData();
}, []);
  // Memoized data
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

  // Optimized render functions
  const renderStatusRow = useCallback(() => {
    const hasLiveStreams = liveStreams && liveStreams.length > 0;

    return (
      <View style={{ marginTop: 10, marginBottom: 20 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {hasLiveStreams ? 'Live & Status' : ''}
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusScrollContainer}
        >
          {/* My Status */}
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

          {/* Live Streams */}
          {hasLiveStreams && liveStreams.map((liveStream) => (
            <TouchableOpacity 
              key={liveStream.id}
              style={styles.liveStreamWrapper}
              // onPress={() => {
                
              //   navigation.navigate('LiveStreamViewer', { streamId: liveStream.stream_id });
              // }}

              onPress={() => navigation.navigate('Viewer', {
                roomName: 'match-123',
                    streamId: liveStream.stream_id,
                      viewerId: 'viewer-1',
              })}
            >
              <View style={styles.liveStreamContainer}>
                <Image
                  source={{ 
                    uri: liveStream.broadcaster_image 
                      ? `${API_ROUTE_IMAGE}${liveStream.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
                      : 'https://via.placeholder.com/40' 
                  }}
                  style={styles.liveStreamImage}
                />
                <View style={styles.liveStreamOverlay}>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  <Text style={styles.liveStreamName} numberOfLines={1}>
                    {liveStream.broadcaster_name}
                  </Text>
                  {/* <Text style={styles.liveStreamStats}>
                    {liveStream.likes} likes
                  </Text> */}
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Other Statuses */}
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
        </ScrollView>
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
                  navigation.navigate('LiveStreamViewer', { streamId: item.stream_id });
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

 const renderComment = useCallback(({ item }) => {
  // Helper function to extract user data from different comment structures
  const extractUserData = (comment) => {
    let userId = null;
    let username = 'Anonymous';
    let userProfilePic = null;
    let isVerified = false;

    // Try to get user from user object
    if (comment.user && typeof comment.user === 'object') {
      userId = comment.user.id || null;
      username = comment.user.username || comment.user.name || 'Anonymous';
      userProfilePic = comment.user.profile_picture || comment.user.image || null;
      isVerified = comment.user.is_verified || false;
    } 
    // Try to get from user_details
    else if (comment.user_details) {
      userId = comment.user_details.id || null;
      username = comment.user_details.username || comment.user_details.name || 'Anonymous';
      userProfilePic = comment.user_details.profile_picture || null;
      isVerified = comment.user_details.is_verified || false;
    }
    // Try to get from root level
    else {
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
        {/* Avatar */}
        <TouchableOpacity 
          onPress={() => commentUserId && navigation.navigate('OtherUserProfile', { userId: commentUserId })}
          disabled={!commentUserId}
        >
          <Image
            source={
              commentUserProfilePic
                ? { uri: commentUserProfilePic.startsWith('http') 
                    ? commentUserProfilePic 
                    : `${API_ROUTE_IMAGE}${commentUserProfilePic}`}
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.commentAvatar}
          />
        </TouchableOpacity>
        
        <View style={styles.commentContent}>
          {/* Comment Header */}
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
            
            {/* Delete button for own comments/replies */}
            {isOwnComment && (
              <TouchableOpacity
                onPress={() => {
                  if (item.parent_comment_id || item.parent) {
                    // This is a reply
                    handleDeleteReply(item.id, item.parent_comment_id || item.parent);
                  } else {
                    // This is a top-level comment
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
          
          {/* Comment text */}
          <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
          
          {/* Comment Actions */}
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
                setReplyText(`@${commentUsername} `); // Pre-fill with mention
              }}
            >
              <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                Reply
              </Text>
            </TouchableOpacity>
          </View>

          {/* Replies */}
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
                        
                        {/* Delete button for reply */}
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
              
              {/* Show more replies button if needed */}
              {replyCount > 3 && (
                <TouchableOpacity 
                  onPress={() => {
                    // You can implement pagination here
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



const renderSuggestedFriend = useCallback(({ item }) => (
    <SuggestedFriendItem item={item} onFollow={handleFollow} colors={colors} />
  ), [handleFollow, colors]);

  // Optimized content render: Always render content instantly, show empty state if no posts
  const renderContent = useCallback(() => {
    const middleIndex = Math.floor(combinedPosts.length / 2);
    const firstHalf = combinedPosts.slice(0, middleIndex);
    const secondHalf = combinedPosts.slice(middleIndex);

    const friendSuggestionIndex = Math.min(2, firstHalf.length - 1);
    const firstPart = firstHalf.slice(0, friendSuggestionIndex);
    const secondPart = firstHalf.slice(friendSuggestionIndex);

    return (
      <>
        {/* Status Section */}
        {(groupedStatuses.length > 0 || liveStreams.length > 0) && renderStatusRow()}

        {/* Refreshing indicator - non-blocking */}
        {refreshing && combinedPosts.length > 0 && (
          <View style={styles.refreshingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.refreshingText, { color: colors.text }]}>Updating feed...</Text>
          </View>
        )}

        {/* Promo Banner */}
        <View style={styles.promoContainer}>
          <Image
            source={require('../assets/images/gdgdg.jpg')} 
            style={styles.promoBanner}
            resizeMode="cover"
          />
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Earn Massive Income</Text>
            <Text style={styles.promoSubtitle}>Up to 5m instantly</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Earnings')} style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Get Started Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* First Part of Posts (2-3 posts) */}
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
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}

        {/* Second Part of First Half Posts */}
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
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}

        {/* Friend Suggestion Section */}
        <View style={[styles.friendSuggestionWrapper, { 
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border 
        }]}>
          <FriendSuggestion />
        </View>

        {/* Suggested Friends Section */}
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

        {/* Second Half of Posts */}
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
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}

        {/* Empty state - shown instantly if no posts */}
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

        {/* Additional Friend Suggestion at the end */}
        {combinedPosts.length > 8 && (
          <View style={[styles.friendSuggestionBottom, { 
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border 
          }]}>
            <FriendSuggestion />
          </View>
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
    isDark
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.card} 
        barStyle={isDark ? "light-content" : "dark-content"} 
      />
      
    
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Broadcast</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => {
              navigation.navigate('Broadcaster', {
                roomName: `user-${userName}`,
                streamId: `stream-${userName}`,
                userName: `${userName}` || 'User',
                userId: userId
              });
            }}
            style={styles.goLiveButton}
          >
            <Ionicons name="radio" size={20} color={colors.text} />
            <Text style={[styles.goLiveText, { color: colors.text }]}>Go Live</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('CreateBroadcastPost')}>
            <Ionicons name="add-circle-outline" size={34} color={colors.text} />
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
      </ScrollView>

      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('CreateBroadcastPost')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      
      <ImageModal
        visible={imageModalVisible}
        post={selectedImagePost}
        onClose={handleImageModalClose}
        onView={handleImageViewed}
        colors={colors}
        isDark={isDark}
      />

     
      {renderLiveModal()}

      {/* Viewers Modal ===========================*/}
      {renderViewersModal()}

      {/* Comment Modal ======================*/}
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
                    {/* {postById.image && (
                      <Image
                        source={{ uri: `${API_ROUTE_IMAGE}${postById.image}` }}
                        style={styles.postImagePreview}
                        resizeMode="cover"
                      />
                    )} */}
                  </View>
                )}

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Comments List */}
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

              
                {Platform.OS === 'ios' && <View style={{ height: 20 }} />}
              </ScrollView>

            
              <View style={[styles.commentInputContainer, { borderTopColor: colors.border }]}>
                {/* {replyToCommentId && (
                  <View style={[styles.replyingBar, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.replyingText, { color: colors.textSecondary }]}>
                      Replying to comment
                    </Text>
                    <TouchableOpacity 
                      onPress={() => {
                        setReplyToCommentId(null);
                        setNewComment('');
                      }}
                    >
                      <Ionicons name="close" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )} */}
                
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

      {/* Reply Modal */}
      <Modal visible={isReplyBottomSheetVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.replyModal, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Replies</Text>
              <TouchableOpacity
                onPress={() => setIsReplyBottomSheetVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={26} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedCommentId && (
                <View style={styles.commentContainer}>
                  <View style={styles.commentRow}>
                    <Image
                      source={
                        commentsss.find(c => c.id === selectedCommentId)?.image
                          ? { uri: commentsss.find(c => c.id === selectedCommentId)?.image }
                          : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                      }
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentContent}>
                      <Text style={[styles.commentUsername, { color: colors.text }]}>
                        {commentsss.find(c => c.id === selectedCommentId)?.user?.username || 
                         commentsss.find(c => c.id === selectedCommentId)?.username}
                      </Text>
                      <Text style={[styles.commentText, { color: colors.text }]}>
                        {commentsss.find(c => c.id === selectedCommentId)?.text}
                      </Text>
                      <Text style={[styles.commentTimestamp, { color: colors.textSecondary }]}>
                        {dayjs(commentsss.find(c => c.id === selectedCommentId)?.created_at).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.repliesWrapper}>
                <FlatList
                  data={commentsss.find((comment) => comment.id === selectedCommentId)?.replies || []}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.replyContainer}>
                      <Image
                        source={
                          item.userAvatar
                            ? { uri: item.userAvatar }
                            : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                        }
                        style={styles.replyAvatar}
                      />
                      <View style={styles.replyContent}>
                        <Text style={[styles.replyUsername, { color: colors.text }]}>{item.username}</Text>
                        <Text style={[styles.replyText, { color: colors.text }]}>{item.text}</Text>
                        <Text style={[styles.replyTimestamp, { color: colors.textSecondary }]}>
                          {dayjs(item.created_at).fromNow()}
                        </Text>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyComments}>
                      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No replies yet.</Text>
                    </View>
                  }
                />
              </View>
            </ScrollView>
          </View>
        </View>
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
                onPress={()=>{
                  setIsOptionsBottomSheetVisible(false);
                  handleUnfollow();
                }}
              >
                <Ionicons name="person-remove-outline" size={24} color={colors.text} />
                <Text style={[styles.optionText, { color: colors.text }]}>Unfollow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={()=>{
                  navigation.navigate('ReportPost', {postId: selectedPostId})
                  setIsOptionsBottomSheetVisible(false)
                }}
                
              >
                <Ionicons name="flag-outline" size={24} color={colors.text} />
                <Text style={[styles.optionText, { color: colors.text }]}>Report Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: colors.primary }}
      >
        <Text style={{ color: '#fff' }}>Action completed successfully!</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
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
    marginRight: 20,
  },
  goLiveText: {
    fontSize: 12,
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
  // Add these styles to your existing StyleSheet
imageModalImageSection: {
  height: '60%', // Takes 60% of screen height
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

imageModalInfoContainer: {
  height: '40%', // Takes 40% of screen height
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

// Update existing styles or add if missing
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

  tweetContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 0.5,
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
  verifiedBadge: {
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
    marginLeft: 12,
  },
  tweetHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    flexWrap: "wrap",
    marginBottom: 8,
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
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 12,
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
  loadingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  
  tweetActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    padding: 0,
    paddingHorizontal: 12,
    minWidth: 60,
    justifyContent: 'center',
  },
  actionCount: {
    marginLeft: 6,
    fontSize: 14,
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
  commentUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  flexWrap: 'wrap',
},

commentUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  flexWrap: 'wrap',
  gap: 6,
},

commentTimestamp: {
  fontSize: 11,
  color: colors.textSecondary,
},

commentActions: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
  gap: 16,
},

commentActionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  paddingVertical: 2,
  paddingHorizontal: 4,
},

commentActionText: {
  fontSize: 12,
  color: colors.textSecondary,
},

repliesWrapper: {
  marginTop: 12,
  paddingLeft: 12,
  borderLeftWidth: 2,
  borderLeftColor: colors.border,
},

replyContainer: {
  flexDirection: 'row',
  marginBottom: 12,
},

replyAvatar: {
  width: 24,
  height: 24,
  borderRadius: 12,
  marginRight: 8,
},

replyContent: {
  flex: 1,
  padding: 10,
  borderRadius: 12,
},

replyHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
},

replyUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  flexWrap: 'wrap',
  gap: 4,
},

replyUsername: {
  fontWeight: '600',
  fontSize: 12,
},

replyTimestamp: {
  fontSize: 10,
},

replyText: {
  fontSize: 12,
  lineHeight: 16,
},

replyDeleteButton: {
  padding: 4,
  marginLeft: 4,
},

viewMoreReplies: {
  marginTop: 8,
  paddingVertical: 4,
},

viewMoreRepliesText: {
  fontSize: 12,
  fontWeight: '500',
},

commentDeleteButton: {
  padding: 4,
  marginLeft: 8,
},

commentHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
  width: '100%',
},

commentDeleteButton: {
  padding: 4,
  marginLeft: 8,
},

commentActions: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
  gap: 16,
  flexWrap: 'wrap',
},
commentContent: {
  flex: 1,
  marginLeft: 12,
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
  // Image grid styles
singleImageContainer: {
  width: '100%',
  aspectRatio: 1,
  borderRadius: 12,
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
  borderRadius: 12,
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
  borderRadius: 12,
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
  borderRadius: 12,
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
  width: '48%', // Slightly less than 50% to account for gap
  aspectRatio: 1,
  borderRadius: 12,
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

// Modal image styles
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

// Verified badge
verifiedBadge: {
  backgroundColor: "#1877F2",
  borderRadius: 50,
  width: 16,
  height: 16,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 4,
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
  commentInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 12,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sendButtonDisabled: {
    opacity: 0.5,
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
  commentDeleteButton: {
  padding: 4,
  marginLeft: 'auto',
},
commentHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
  flex: 1,
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
  promoContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
    marginTop: 8,
    position: 'relative',
  },
  promoBanner: {
    width: '100%',
    height: '100%',
  },
  promoContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#0d64dd',
    fontWeight: '600',
    fontSize: 14,
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
  marginBottom: 2,
},
replyHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
},
commentActions: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 6,
  gap: 20,
},
commentActionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
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
  
  // Image Modal Styles
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
  
  fullSizeImage: {
    width: '100%',
    height: '70%',
  },
  imageModalInfo: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
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
  },
  imageModalTime: {
    fontSize: 12,
    marginTop: 2,
  },
  imageModalCaption: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  imageModalStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageModalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  imageModalStatText: {
    fontSize: 14,
    marginLeft: 6,
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
  // commentActions: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginTop: 8,
  // },
  commentTimestamp: {
    fontSize: 12,
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    marginRight: 16,
  },
  repliesWrapper: {
    marginLeft: 0,
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
    backgroundColor: colors.background,
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
  viewMoreReplies: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
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
  divider: {
    height: 1,
    marginVertical: 16,
  },
  emptyComments: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});