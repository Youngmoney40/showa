
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Share,
  TextInput,
  FlatList,
  Alert,
  Modal,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Video from 'react-native-video';
import { createMMKV } from 'react-native-mmkv';
import BottomNav from '../components/BottomSocialNav';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');

// MMKV storage instance
const storage = createMMKV({ id: 'video-detail-cache' });

// Cache keys
const VIDEO_DETAIL_CACHE_KEY = 'cached_video_detail_';
const COMMENTS_CACHE_KEY_PREFIX = 'cached_video_comments_';
const CACHE_DURATION = 5 * 60 * 1000;

// Helper functions
const getSecureUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_ROUTE_IMAGE}${url}`;
  return `${API_ROUTE_IMAGE}${url}`;
};

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
    console.log('Thumbnail generation failed');
    return null;
  }
};

const VideoDetailScreen = ({ route, navigation }) => {
  const { videoId, videoData } = route.params;
  const { colors, isDark } = useTheme();
  
  // State
  const [video, setVideo] = useState(videoData || null);
  const [loading, setLoading] = useState(!videoData);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVideoControls, setShowVideoControls] = useState(true);
  
  // Reply states
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyToUsername, setReplyToUsername] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isReplyMode, setIsReplyMode] = useState(false);
  
  // Comment likes state
  const [commentLikes, setCommentLikes] = useState({});
  
  // Refs
  const commentInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  
  // Load data
  useEffect(() => {
    if (videoData) {
      setVideo({
        ...videoData,
        video_url: getSecureUrl(videoData.video_url || videoData.video),
        thumbnail: getVideoThumbnail(videoData.video_url || videoData.video),
      });
      setLikeCount(videoData.like_count || 0);
      setIsLiked(videoData.is_liked || false);
      setCommentCount(videoData.comment_count || 0);
      setShareCount(videoData.share_count || 0);
      setViewsCount(videoData.views || 0);
      setIsBookmarked(videoData.is_bookmarked || false);
      
      AsyncStorage.getItem('userData').then(userDataStr => {
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setCurrentUserId(userData?.id);
          setCurrentUsername(userData?.name || userData?.username || '');
          setCurrentUserProfilePic(userData?.profile_picture || null);
          setIsOwnPost(videoData.user_id === userData?.id);
        }
      });
      
      fetchComments(videoData.id);
    } else if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId, videoData]);

  // Auto-hide controls
  useEffect(() => {
    if (showVideoControls) {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        setShowVideoControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showVideoControls]);

  const fetchVideoDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to view this video');
        navigation.goBack();
        return;
      }

      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      setCurrentUserId(userData?.id);
      setCurrentUsername(userData?.name || userData?.username || '');
      setCurrentUserProfilePic(userData?.profile_picture || null);

      // Check cache first
      const cacheKey = `${VIDEO_DETAIL_CACHE_KEY}${videoId}`;
      const cached = storage.getString(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setVideo({
            ...data,
            video_url: getSecureUrl(data.video_url || data.video),
            thumbnail: getVideoThumbnail(data.video_url || data.video),
          });
          setLikeCount(data.like_count || 0);
          setIsLiked(data.is_liked || false);
          setCommentCount(data.comment_count || 0);
          setShareCount(data.share_count || 0);
          setViewsCount(data.views || 0);
          setIsBookmarked(data.is_bookmarked || false);
          setIsOwnPost(data.user_id === userData?.id);
          setLoading(false);
        }
      }

      const response = await axios.get(`${API_ROUTE}/shorts/${videoId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const videoData = response.data;
        const videoWithMedia = {
          ...videoData,
          video_url: getSecureUrl(videoData.video_url || videoData.video),
          thumbnail: getVideoThumbnail(videoData.video_url || videoData.video),
        };
        
        setVideo(videoWithMedia);
        setLikeCount(videoData.like_count || 0);
        setIsLiked(videoData.is_liked || false);
        setCommentCount(videoData.comment_count || 0);
        setShareCount(videoData.share_count || 0);
        setViewsCount(videoData.views || 0);
        setIsBookmarked(videoData.is_bookmarked || false);
        setIsOwnPost(videoData.user_id === userData?.id);
        
        // Cache the data
        storage.set(
          `${VIDEO_DETAIL_CACHE_KEY}${videoId}`,
          JSON.stringify({ data: videoData, timestamp: Date.now() })
        );
        
        await fetchComments(videoId);
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
      Alert.alert('Error', 'Failed to load video details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [videoId, navigation]);

  const fetchComments = useCallback(async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      // Check cache
      const cacheKey = `${COMMENTS_CACHE_KEY_PREFIX}${id}`;
      const cached = storage.getString(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setComments(data);
          setCommentCount(data.length);
          
          const likesMap = {};
          data.forEach(comment => {
            likesMap[comment.id] = comment.is_liked || false;
            if (comment.replies) {
              comment.replies.forEach(reply => {
                likesMap[reply.id] = reply.is_liked || false;
              });
            }
          });
          setCommentLikes(likesMap);
        }
      }

      const response = await axios.get(`${API_ROUTE}/shorts/${id}/comments/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 50 }
      });

      if (response.status === 200) {
        let commentsData = [];
        if (response.data.results) {
          commentsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          commentsData = response.data;
        }
        
        setComments(commentsData);
        setCommentCount(commentsData.length);
        
        // Cache comments
        storage.set(
          `${COMMENTS_CACHE_KEY_PREFIX}${id}`,
          JSON.stringify({ data: commentsData, timestamp: Date.now() })
        );
        
        const likesMap = {};
        commentsData.forEach(comment => {
          likesMap[comment.id] = comment.is_liked || false;
          if (comment.replies) {
            comment.replies.forEach(reply => {
              likesMap[reply.id] = reply.is_liked || false;
            });
          }
        });
        setCommentLikes(likesMap);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, []);

  const handleFollowToggle = useCallback(async () => {
    if (isOwnPost) {
      Alert.alert('Info', 'You cannot follow yourself');
      return;
    }

    if (!video?.user_id) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    try {
      setIsFollowingLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to follow users');
        return;
      }

      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      setFollowerCount(prev => newFollowState ? prev + 1 : Math.max(0, prev - 1));

      const response = await axios.post(
        `${API_ROUTE}/follow-user/${video.user_id}/`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (response.data) {
          setIsFollowing(response.data.is_following || newFollowState);
          setFollowerCount(response.data.follower_count || followerCount);
        }
        
        Alert.alert(
          'Success', 
          newFollowState ? 'You are now following this user!' : 'You have unfollowed this user.'
        );
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setIsFollowing(!isFollowing);
      setFollowerCount(prev => isFollowing ? prev + 1 : Math.max(0, prev - 1));
      Alert.alert('Error', 'Failed to update follow status. Please try again.');
    } finally {
      setIsFollowingLoading(false);
    }
  }, [video, isFollowing, followerCount, isOwnPost]);

  const handleLike = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

      const response = await axios.post(
        `${API_ROUTE}/shorts/${video.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setLikeCount(response.data.like_count || 0);
        setIsLiked(response.data.is_liked || false);
      }
    } catch (error) {
      console.error('Error liking video:', error);
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      Alert.alert('Error', 'Failed to like video');
    }
  }, [video, isLiked, likeCount]);

  const handleCommentLike = useCallback(async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const isCurrentlyLiked = commentLikes[commentId] || false;
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: !isCurrentlyLiked
      }));

      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: !isCurrentlyLiked,
              like_count: (comment.like_count || 0) + (isCurrentlyLiked ? -1 : 1)
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    is_liked: !isCurrentlyLiked,
                    like_count: (reply.like_count || 0) + (isCurrentlyLiked ? -1 : 1)
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        })
      );

      const response = await axios.post(
        `${API_ROUTE}/shorts/comments/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                is_liked: response.data.liked,
                like_count: response.data.like_count
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === commentId) {
                    return {
                      ...reply,
                      is_liked: response.data.liked,
                      like_count: response.data.like_count
                    };
                  }
                  return reply;
                })
              };
            }
            return comment;
          })
        );
        
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: response.data.liked
        }));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      const isCurrentlyLiked = commentLikes[commentId] || false;
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: isCurrentlyLiked
      }));
      Alert.alert('Error', 'Failed to like comment');
    }
  }, [commentLikes]);

  const handleReplyToComment = useCallback((username, commentId) => {
    setReplyToCommentId(commentId);
    setReplyToUsername(username);
    setIsReplyMode(true);
    setReplyText(`@${username} `);
    commentInputRef.current?.focus();
  }, []);

  const cancelReply = useCallback(() => {
    setReplyToCommentId(null);
    setReplyToUsername('');
    setIsReplyMode(false);
    setReplyText('');
  }, []);

  const handleCommentSubmit = useCallback(async () => {
    const textToSubmit = isReplyMode ? replyText : commentText;
    if (!textToSubmit.trim() || !video) return;

    try {
      setCommentLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to comment');
        return;
      }

      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const loginUserId = userData?.id;

      if (!loginUserId) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const isReply = isReplyMode && replyToCommentId;
      const tempId = `temp_${Date.now()}`;
      
      const optimisticData = {
        id: tempId,
        text: textToSubmit.trim(),
        created_at: new Date().toISOString(),
        user: {
          id: loginUserId,
          username: currentUsername || 'You',
          profile_picture: currentUserProfilePic,
        },
        username: currentUsername || 'You',
        user_profile_picture: currentUserProfilePic,
        like_count: 0,
        is_liked: false,
        replies: [],
        ...(isReply && { parent: replyToCommentId, parent_comment_id: replyToCommentId })
      };

      if (isReply) {
        setComments(prev => prev.map(comment => {
          if (comment.id === replyToCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), optimisticData],
              reply_count: (comment.reply_count || 0) + 1
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => [optimisticData, ...prev]);
        setCommentCount(prev => prev + 1);
      }

      if (isReply) {
        setReplyText('');
        setReplyToCommentId(null);
        setReplyToUsername('');
        setIsReplyMode(false);
      } else {
        setCommentText('');
      }

      const endpoint = isReply 
        ? `${API_ROUTE}/shorts/comments/${replyToCommentId}/replies/`
        : `${API_ROUTE}/shorts/${video.id}/comment/`;

      const payload = isReply 
        ? { text: textToSubmit.trim() }
        : {
            text: textToSubmit.trim(),
            post: video.id,
            user: loginUserId,
            image: currentUserProfilePic || '',
          };

      const response = await axios.post(
        endpoint,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (isReply) {
          setComments(prev => prev.map(comment => {
            if (comment.id === replyToCommentId) {
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
          setComments(prev => prev.map(comment => 
            comment.id === tempId ? response.data : comment
          ));
          
          if (response.data.comment_count !== undefined) {
            setCommentCount(response.data.comment_count);
          }
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      if (isReplyMode && replyToCommentId) {
        setComments(prev => prev.map(comment => {
          if (comment.id === replyToCommentId) {
            return {
              ...comment,
              replies: comment.replies?.filter(r => !r.id.toString().startsWith('temp_')),
              reply_count: Math.max(0, (comment.reply_count || 0) - 1)
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => prev.filter(c => !c.id.toString().startsWith('temp_')));
        setCommentCount(prev => Math.max(0, prev - 1));
      }
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  }, [commentText, replyText, isReplyMode, replyToCommentId, video, currentUsername, currentUserProfilePic]);

  const handleShare = useCallback(async () => {
    try {
      const shareUrl = `https://showapp.ng/video/${video?.id}`;
      const shareMessage = `${video?.username || 'Someone'} shared a video on ShowApp\n\n"${(video?.caption || video?.content || '').substring(0, 100)}${(video?.caption || video?.content || '').length > 100 ? '…' : ''}"\n\n${shareUrl}`;

      const shareResult = await Share.share({
        message: shareMessage,
        title: `ShowApp - Video by ${video?.username || 'User'}`,
        url: shareUrl,
      });
      
      if (shareResult.action === Share.sharedAction) {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          await axios.post(
            `${API_ROUTE}/shorts/${video.id}/share/`,
            { shared_to: 'external' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setShareCount(prev => prev + 1);
        Alert.alert('Success', 'Video shared successfully!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [video]);

  const handleBookmark = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const newState = !isBookmarked;
      setIsBookmarked(newState);

      await axios.post(
        `${API_ROUTE}/bookmark-short/`,
        { short: video.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Success', newState ? 'Video bookmarked!' : 'Bookmark removed');
    } catch (error) {
      console.error('Error bookmarking video:', error);
      setIsBookmarked(isBookmarked);
      Alert.alert('Error', 'Failed to bookmark video');
    }
  }, [video, isBookmarked]);

  const toggleVideoPlay = () => {
    setIsVideoPaused(!isVideoPaused);
  };

  const toggleMute = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  const handleVideoProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const handleVideoLoad = (data) => {
    setVideoDuration(data.duration);
  };

  const extractUserData = useCallback((comment) => {
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
  }, []);

  const renderCommentItem = useCallback(({ item }) => {
    const { 
      userId: commentUserId, 
      username: commentUsername, 
      userProfilePic: commentUserProfilePic, 
      isVerified: commentIsVerified 
    } = extractUserData(item);

    const isOwnComment = commentUserId === currentUserId;
    const isLiked = commentLikes[item.id] || item.is_liked || false;
    const likeCount = item.like_count || 0;
    const replyCount = item.reply_count || item.replies?.length || 0;

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentRow}>
          <TouchableOpacity 
            onPress={() => commentUserId && navigation.navigate('OtherUserProfile', { user_ID: commentUserId })}
            disabled={!commentUserId}
          >
            <Image
              source={
                commentUserProfilePic
                  ? { uri: getSecureUrl(commentUserProfilePic) }
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.commentAvatar}
            />
          </TouchableOpacity>
          
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <View style={styles.commentUserInfo}>
                <TouchableOpacity 
                  onPress={() => commentUserId && navigation.navigate('OtherUserProfile', { user_ID: commentUserId })}
                  disabled={!commentUserId}
                >
                  <Text style={[styles.commentUsername, { color: colors.text }]}>
                    {commentUsername}
                  </Text>
                </TouchableOpacity>
                {commentIsVerified && (
                  <View style={styles.commentVerifiedBadge}>
                    <MaterialCommunityIcons name="check-bold" size={10} color="#fff" />
                  </View>
                )}
                <Text style={[styles.commentTimestamp, { color: colors.textSecondary }]}>
                  {dayjs(item.created_at).fromNow()}
                </Text>
              </View>
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
                onPress={() => handleReplyToComment(commentUsername, item.id)}
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
                  
                  const isReplyLiked = commentLikes[reply.id] || reply.is_liked || false;
                  const replyLikeCount = reply.like_count || 0;
                  
                  return (
                    <View key={reply.id || `reply-${index}`} style={styles.replyContainer}>
                      <TouchableOpacity 
                        onPress={() => replyUserId && navigation.navigate('OtherUserProfile', { user_ID: replyUserId })}
                        disabled={!replyUserId}
                      >
                        <Image
                          source={
                            replyUserProfilePic
                              ? { uri: getSecureUrl(replyUserProfilePic) }
                              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                          }
                          style={styles.replyAvatar}
                        />
                      </TouchableOpacity>
                      
                      <View style={[styles.replyContent, { backgroundColor: colors.backgroundSecondary }]}>
                        <View style={styles.replyHeader}>
                          <View style={styles.replyUserInfo}>
                            <TouchableOpacity 
                              onPress={() => replyUserId && navigation.navigate('OtherUserProfile', { user_ID: replyUserId })}
                              disabled={!replyUserId}
                            >
                              <Text style={[styles.replyUsername, { color: colors.text }]}>
                                {replyUsername}
                              </Text>
                            </TouchableOpacity>
                            {replyIsVerified && (
                              <View style={styles.replyVerifiedBadge}>
                                <MaterialCommunityIcons name="check-bold" size={8} color="#fff" />
                              </View>
                            )}
                            <Text style={[styles.replyTimestamp, { color: colors.textSecondary }]}>
                              {dayjs(reply.created_at).fromNow()}
                            </Text>
                          </View>
                        </View>
                        
                        <Text style={[styles.replyText, { color: colors.text }]}>{reply.text}</Text>
                        
                        <View style={styles.replyActions}>
                          <TouchableOpacity 
                            style={styles.replyActionButton}
                            onPress={() => handleCommentLike(reply.id)}
                          >
                            <Ionicons 
                              name={isReplyLiked ? "heart" : "heart-outline"} 
                              size={12} 
                              color={isReplyLiked ? colors.primary : colors.textSecondary} 
                            />
                            {replyLikeCount > 0 && (
                              <Text style={[styles.replyActionText, { color: colors.textSecondary }]}>
                                {replyLikeCount}
                              </Text>
                            )}
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={styles.replyActionButton}
                            onPress={() => handleReplyToComment(replyUsername, item.id)}
                          >
                            <Ionicons name="chatbubble-outline" size={12} color={colors.textSecondary} />
                            <Text style={[styles.replyActionText, { color: colors.textSecondary }]}>
                              Reply
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }, [colors, currentUserId, commentLikes, handleCommentLike, handleReplyToComment, navigation, extractUserData]);

  const renderVideoPlayer = () => {
    const videoUrl = video?.video_url || video?.video;
    const thumbnail = video?.thumbnail;

    return (
      <TouchableOpacity 
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={toggleVideoPlay}
      >
        <Video
          ref={videoRef}
          source={{ uri: getOptimizedVideoUrl(videoUrl) }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={isVideoPaused}
          muted={isVideoMuted}
          volume={isVideoMuted ? 0 : 1.0}
          onLoad={handleVideoLoad}
          onProgress={handleVideoProgress}
          ignoreSilentSwitch="ignore"
          playInBackground={false}
          playWhenInactive={false}
          poster={thumbnail}
          posterResizeMode="cover"
        />

        {/* Video Controls Overlay */}
        {showVideoControls && (
          <View style={styles.videoControlsOverlay}>
            <View style={styles.videoControlsTop}>
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.videoBackButton}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={toggleMute}
                style={styles.videoMuteButton}
              >
                <Ionicons 
                  name={isVideoMuted ? "volume-mute" : "volume-high"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.videoControlsCenter}>
              {isVideoPaused && (
                <View style={styles.videoPauseIconContainer}>
                  <Ionicons name="play" size={60} color="#fff" />
                </View>
              )}
            </View>

            <View style={styles.videoControlsBottom}>
              <View style={styles.videoProgressContainer}>
                <View style={styles.videoProgressBar}>
                  <View 
                    style={[
                      styles.videoProgressFill,
                      { width: `${(currentTime / videoDuration) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading video...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Video not found
  if (!video) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="video-off-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>Video not found</Text>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.goBackText, { color: colors.primary }]}>Back to Feed</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {renderVideoPlayer()}

      <KeyboardAvoidingView 
        style={styles.detailContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* User Info with Follow Button */}
            <View style={[styles.userInfo, { borderBottomColor: colors.border }]}>
              <TouchableOpacity 
                style={styles.userInfoContent}
                onPress={() => navigation.navigate('OtherUserProfile', { user_ID: video.user_id })}
              >
                <Image
                  source={
                    video.user_profile_picture
                      ? { uri: getSecureUrl(video.user_profile_picture) }
                      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={styles.userAvatar}
                />
                <View style={styles.userInfoDetails}>
                  <View style={styles.userNameRow}>
                    <Text style={[styles.userName, { color: colors.text }]}>
                      {video.username || 'Anonymous'}
                    </Text>
                    {video.is_verified && (
                      <View style={styles.verifiedBadge}>
                        <MaterialCommunityIcons name="check-bold" size={11} color="#fff" />
                      </View>
                    )}
                  </View>
                  <View style={styles.userMetaRow}>
                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                      {dayjs(video.created_at).fromNow()}
                    </Text>
                    {followerCount > 0 && !isOwnPost && (
                      <Text style={[styles.followerCount, { color: colors.textSecondary }]}>
                        • {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              
              {!isOwnPost && (
                <TouchableOpacity 
                  style={[
                    styles.followButton, 
                    isFollowing && styles.followingButton,
                    isFollowingLoading && styles.followButtonDisabled
                  ]}
                  onPress={handleFollowToggle}
                  disabled={isFollowingLoading}
                >
                  {isFollowingLoading ? (
                    <ActivityIndicator size="small" color={isFollowing ? '#2C3E50' : '#FFFFFF'} />
                  ) : (
                    <Text style={[
                      styles.followButtonText, 
                      isFollowing && styles.followingButtonText
                    ]}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Video Caption */}
            <View style={styles.postContentSection}>
              <Text style={[styles.postContent, { color: colors.text }]}>
                {video.caption || video.content || 'No caption'}
              </Text>
            </View>

            {/* Video Stats */}
            <View style={[styles.postStats, { borderBottomColor: colors.border }]}>
              <View style={styles.statsLeft}>
                <TouchableOpacity style={styles.statButton} onPress={handleLike}>
                  <Ionicons 
                    name={isLiked ? 'heart' : 'heart-outline'} 
                    size={24} 
                    color={isLiked ? '#0213ff' : colors.textSecondary} 
                  />
                  <Text style={[styles.statCount, { color: colors.textSecondary }]}>
                    {likeCount} Likes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton}>
                  <Ionicons name="chatbubble-outline" size={24} color={colors.textSecondary} />
                  <Text style={[styles.statCount, { color: colors.textSecondary }]}>
                    {commentCount} Comments
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton} onPress={handleShare}>
                  <Ionicons name="share-social-outline" size={24} color={colors.textSecondary} />
                  <Text style={[styles.statCount, { color: colors.textSecondary }]}>
                    {shareCount} Share
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleBookmark}>
                <Ionicons 
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                  size={24} 
                  color={isBookmarked ? colors.primary : colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={[styles.commentsTitle, { color: colors.text }]}>
                Comments ({commentCount})
              </Text>

              {/* Reply indicator */}
              {isReplyMode && (
                <View style={[styles.replyingBar, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.replyingText, { color: colors.textSecondary }]}>
                    Replying to @{replyToUsername}
                  </Text>
                  <TouchableOpacity onPress={cancelReply}>
                    <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Comment Input */}
              <View style={[styles.commentInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Image
                  source={
                    currentUserProfilePic
                      ? { uri: getSecureUrl(currentUserProfilePic) }
                      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={styles.commentInputAvatar}
                />
                <TextInput
                  ref={commentInputRef}
                  style={[styles.commentInputField, { color: colors.text }]}
                  placeholder={isReplyMode ? `Reply to @${replyToUsername}...` : "Add a comment..."}
                  placeholderTextColor={colors.textSecondary}
                  value={isReplyMode ? replyText : commentText}
                  onChangeText={isReplyMode ? setReplyText : setCommentText}
                  multiline
                  maxLength={500}
                />
                {(isReplyMode ? replyText : commentText).trim().length > 0 && (
                  <TouchableOpacity 
                    onPress={handleCommentSubmit}
                    disabled={commentLoading}
                  >
                    <Text style={[styles.postCommentButton, { color: colors.primary }]}>
                      {commentLoading ? '...' : 'Post'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Comments List */}
              {comments.length > 0 ? (
                <FlatList
                  data={comments}
                  renderItem={renderCommentItem}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.commentsList}
                />
              ) : (
                <View style={styles.noComments}>
                  <Text style={[styles.noCommentsText, { color: colors.textSecondary }]}>
                    No comments yet. Be the first to comment!
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      <BottomNav navigation={navigation} activeRoute="ShortFeed" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 142,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  goBackButton: {
    marginTop: 12,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    width: width,
    height: height * 0.6,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  videoControlsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  videoBackButton: {
    padding: 8,
  },
  videoMuteButton: {
    padding: 8,
  },
  videoControlsCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPauseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  videoControlsBottom: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  videoProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoProgressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  videoProgressFill: {
    height: '100%',
    backgroundColor: '#DC143C',
    borderRadius: 2,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingBottom: 40,
    backgroundColor: '#000',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfoDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  verifiedBadge: {
    backgroundColor: '#1877F2',
    borderRadius: 50,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  followerCount: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0D64DD',
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonDisabled: {
    opacity: 0.7,
  },
  followingButton: {
    backgroundColor: '#E8ECF1',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#2C3E50',
  },
  postContentSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#fff',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statCount: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
    color: '#888',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  replyingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyingText: {
    fontSize: 12,
    color: '#888',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentInputField: {
    flex: 1,
    fontSize: 14,
    maxHeight: 80,
    paddingVertical: 0,
    color: '#fff',
  },
  postCommentButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentsList: {
    paddingBottom: 16,
  },
  commentContainer: {
    marginBottom: 16,
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
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: '100%',
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 6,
  },
  commentUsername: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  commentVerifiedBadge: {
    backgroundColor: '#1877F2',
    borderRadius: 50,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  commentTimestamp: {
    fontSize: 12,
    marginLeft: 6,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
    color: '#e0e0e0',
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
    marginLeft: 4,
    color: '#888',
  },
  repliesWrapper: {
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#333',
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
    backgroundColor: '#1a1a1a',
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
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
    color: '#fff',
  },
  replyVerifiedBadge: {
    backgroundColor: '#1877F2',
    borderRadius: 50,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  replyTimestamp: {
    fontSize: 10,
    marginLeft: 4,
    color: '#888',
  },
  replyText: {
    fontSize: 12,
    marginTop: 2,
    color: '#e0e0e0',
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
    marginLeft: 2,
    color: '#888',
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#888',
  },
});

export default VideoDetailScreen;