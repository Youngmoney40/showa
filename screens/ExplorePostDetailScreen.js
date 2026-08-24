


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
  PanResponder,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useBackHandler } from '../src/hooks/useBackHandler';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');

const PostDetailScreen = ({ route, navigation }) => {
  useBackHandler(navigation, 'BroadcastHome');
  const { postId, postData } = route.params;
  const { colors, isDark } = useTheme();
  
  // State
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(!postData);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  
  // Image zoom state
  const [imageScale, setImageScale] = useState(1);
  const panResponder = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);




const [showDeleteModal, setShowDeleteModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);


const handleDeletePost = useCallback(async () => {
  if (!post?.id) return;
  
  Alert.alert(
    'Delete Post',
    'Are you sure you want to delete this post? This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            const token = await AsyncStorage.getItem('userToken');
            
            if (!token) {
              Alert.alert('Error', 'Please login to delete posts');
              return;
            }

            const response = await axios.delete(
              `${API_ROUTE}/posts/${post.id}/delete/`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            if (response.status === 200 || response.status === 204) {
              Alert.alert('Success', 'Post deleted successfully');
              
              navigation.goBack();
            } else {
              throw new Error('Failed to delete post');
            }
          } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete post. Please try again.');
          } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
          }
        }
      }
    ]
  );
}, [post, navigation]);

const handleDeleteComment = useCallback(async (commentId, isReply = false, parentCommentId = null) => {
  Alert.alert(
    'Delete Comment',
    'Are you sure you want to delete this comment? This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
              Alert.alert('Error', 'Please login to delete comments');
              return;
            }

            const endpoint = isReply 
              ? `${API_ROUTE}/delete-reply/${commentId}/`
              : `${API_ROUTE}/delete-comment/${commentId}/`;

            const response = await axios.delete(endpoint, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 204) {
              if (isReply && parentCommentId) {
                // Remove reply from parent comment's replies array
                setComments(prevComments => 
                  prevComments.map(comment => {
                    if (comment.id === parentCommentId) {
                      return {
                        ...comment,
                        replies: comment.replies?.filter(reply => reply.id !== commentId) || [],
                        reply_count: Math.max(0, (comment.reply_count || 0) - 1)
                      };
                    }
                    return comment;
                  })
                );
              } else {
                // Remove top-level comment
                setComments(prevComments => 
                  prevComments.filter(comment => comment.id !== commentId)
                );
              }
              
              setCommentCount(prev => Math.max(0, prev - 1));
              
              // Show success message
              Alert.alert('Success', 'Comment deleted successfully');
            } else {
              throw new Error('Failed to delete comment');
            }
          } catch (error) {
            console.error('Error deleting comment:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete comment. Please try again.');
          }
        }
      }
    ]
  );
}, []);


  useFocusEffect(
  useCallback(() => {
    const syncLikeStatus = async () => {
      if (!post?.id) {
        console.log('🔄 syncLikeStatus: No post ID');
        return;
      }
      
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('🔄 syncLikeStatus: No token');
          return;
        }

        console.log('🔄 FETCHING POST FOR SYNC:', post.id);
        const response = await axios.get(`${API_ROUTE}/posts/${post.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          console.log('🔄 SYNC RESPONSE:', JSON.stringify(response.data, null, 2));
          console.log('🔄 is_liked:', response.data.is_liked);
          console.log('🔄 like_count:', response.data.like_count);
          
          // Only update if values are different
          if (response.data.is_liked !== undefined) {
            if (response.data.is_liked !== isLiked) {
              console.log('🔄 Updating isLiked from', isLiked, 'to', response.data.is_liked);
              setIsLiked(response.data.is_liked);
            } else {
              console.log('🔄 isLiked already in sync:', isLiked);
            }
          }
          
          if (response.data.like_count !== undefined) {
            if (response.data.like_count !== likeCount) {
              console.log('🔄 Updating likeCount from', likeCount, 'to', response.data.like_count);
              setLikeCount(response.data.like_count);
            } else {
              console.log('🔄 likeCount already in sync:', likeCount);
            }
          }
        }
      } catch (error) {
        console.error('🔴 Error syncing like status on focus:', error);
      }
    };

    syncLikeStatus();
  }, [post?.id, isLiked, likeCount])
);

  // Fix image URLs
  const fixImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/media/')) {
      return `${API_ROUTE_IMAGE}${url}`;
    }
    return `${API_ROUTE_IMAGE}${url}`;
  };

  // Get images from post
  const getPostImages = useCallback(() => {
    if (!post) return [];
    
    if (post.all_images && Array.isArray(post.all_images) && post.all_images.length > 0) {
      return post.all_images.map(img => ({
        ...img,
        url: fixImageUrl(img.url)
      }));
    }
    
    if (post.image_url) {
      return [{ url: fixImageUrl(post.image_url), is_main: true }];
    }
    
    if (post.images && Array.isArray(post.images) && post.images.length > 0) {
      return post.images.map(img => ({
        ...img,
        url: fixImageUrl(img.url || img.image)
      }));
    }
    
    return [];
  }, [post]);

  // Extract user data from comment
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

  const handleFollowToggle = useCallback(async () => {
    if (isOwnPost) {
      Alert.alert('Info', 'You cannot follow yourself');
      return;
    }

    if (!post?.user_id) {
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
        `${API_ROUTE}/follow-user/${post.user_id}/`,
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
  }, [post, isFollowing, followerCount, isOwnPost]);

  const fetchPostDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to view this post');
        navigation.goBack();
        return;
      }

      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      setCurrentUserId(userData?.id);
      setCurrentUsername(userData?.name || userData?.username || '');
      setCurrentUserProfilePic(userData?.profile_picture || null);

      const response = await axios.get(`${API_ROUTE}/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const postData = response.data;
        
        // CRITICAL: Set isLiked from the response data
        console.log('🔵 API Raw res:', response.data);
        console.log('🔵 API Response - is_liked:', postData.is_liked);
        console.log('🔵 API Response - like_count:', postData.like_count);
        
        setIsLiked(postData.is_liked || false);
        setLikeCount(postData.like_count || 0);
        
        setPost({
          ...postData,
          all_images: postData.all_images ? postData.all_images.map(img => ({
            ...img,
            url: fixImageUrl(img.url)
          })) : [],
          image_url: postData.image_url ? fixImageUrl(postData.image_url) : null,
        });
        
        setCommentCount(postData.comment_count || 0);
        setShareCount(postData.share_count || 0);
        setViewsCount(postData.views || 0);
        setIsBookmarked(postData.is_bookmarked || false);
        setIsOwnPost(postData.user_id === userData?.id);
        
        await fetchComments(postId);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
      Alert.alert('Error', 'Failed to load post details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [postId, navigation]);

  // Fetch comments with replies
  const fetchComments = useCallback(async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(`${API_ROUTE}/post/${id}/comments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const commentsData = response.data.comments || response.data || [];
        setComments(commentsData);
        setCommentCount(commentsData.length);
        
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

  const handleLike = useCallback(async () => {
    if (!post) return;
    
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to like posts');
        return;
      }

      // Optimistic update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

      const response = await axios.post(
        `${API_ROUTE}/post-react/`,
        { 
          post_id: post.id, 
          reaction_type: 'like'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('🟢 Like response:', JSON.stringify(response.data));

      if (response.data) {
        // Update count from server
        if (response.data.like_count !== undefined) {
          setLikeCount(response.data.like_count);
        }

        // Determine liked state from response
        const serverLiked =
          response.data.is_liked ??
          response.data.liked ??
          (response.data.reaction
            ? response.data.reaction.reaction_type === 'like'
            : undefined);

        if (serverLiked !== undefined) {
          setIsLiked(serverLiked);
        }
        // if serverLiked is undefined, keep the optimistic value
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  }, [post, isLiked, likeCount]);

  // Handle comment like
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
        `${API_ROUTE}/comment/${commentId}/like/`,
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

  // Handle reply to comment
  const handleReplyToComment = useCallback((username, commentId) => {
    setReplyToCommentId(commentId);
    setReplyToUsername(username);
    setIsReplyMode(true);
    setReplyText(`@${username} `);
    commentInputRef.current?.focus();
  }, []);

  // Cancel reply
  const cancelReply = useCallback(() => {
    setReplyToCommentId(null);
    setReplyToUsername('');
    setIsReplyMode(false);
    setReplyText('');
  }, []);

  // Handle comment submission (with reply support)
  const handleCommentSubmit = useCallback(async () => {
    const textToSubmit = isReplyMode ? replyText : commentText;
    if (!textToSubmit.trim() || !post) return;

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
        ? `${API_ROUTE}/comment/${replyToCommentId}/reply/`
        : `${API_ROUTE}/posts-comment/${post.id}/comments/`;

      const payload = isReply 
        ? { text: textToSubmit.trim() }
        : {
            text: textToSubmit.trim(),
            post: post.id,
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
        // Force the newly posted comment/reply to start unliked
        const newCommentData = {
          ...response.data,
          is_liked: false,
          like_count: 0,
        };

        if (isReply) {
          setComments(prev => prev.map(comment => {
            if (comment.id === replyToCommentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => 
                  reply.id === tempId ? newCommentData : reply
                )
              };
            }
            return comment;
          }));
        } else {
          setComments(prev => prev.map(comment => 
            comment.id === tempId ? newCommentData : comment
          ));
          
          if (response.data.comment_count !== undefined) {
            setCommentCount(response.data.comment_count);
          }
        }

        // Make sure the like map has no stale "liked" flag for this real id
        if (newCommentData.id) {
          setCommentLikes(prev => ({
            ...prev,
            [newCommentData.id]: false,
          }));
        }

        if (response.data.reward) {
          Alert.alert(
            '💬 Reward!',
            `You earned ${response.data.reward.coins} coins!`,
            [{ text: 'OK' }]
          );
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
  }, [commentText, replyText, isReplyMode, replyToCommentId, post, currentUsername, currentUserProfilePic]);

  const handleShare = useCallback(async () => {
    if (!post) return;
    
    try {
      const shareUrl = `https://showapp.ng/post/${post?.id}`;
      const shareMessage = `${post?.username || 'Someone'} shared a post on ShowApp\n\n"${(post?.content || '').substring(0, 100)}${(post?.content || '').length > 100 ? '…' : ''}"\n\n${shareUrl}`;

      const shareResult = await Share.share({
        message: shareMessage,
        title: `ShowApp - Post by ${post?.username || 'User'}`,
        url: shareUrl,
      });
      
      if (shareResult.action === Share.sharedAction) {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          await axios.post(
            `${API_ROUTE}/post-react/`,
            { post_id: post.id, reaction_type: 'share' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setShareCount(prev => prev + 1);
        Alert.alert('Success', 'Post shared successfully!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [post]);

  // Handle bookmark
  const handleBookmark = useCallback(async () => {
    if (!post) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const newState = !isBookmarked;
      setIsBookmarked(newState);

      await axios.post(
        `${API_ROUTE}/bookmark-post/`,
        { post: post.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Success', newState ? 'Post bookmarked!' : 'Bookmark removed');
    } catch (error) {
      console.error('Error bookmarking post:', error);
      setIsBookmarked(isBookmarked);
      Alert.alert('Error', 'Failed to bookmark post');
    }
  }, [post, isBookmarked]);

  // Setup PanResponder for image zoom
  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberOfTouches === 2) {
          const { dx, dy } = gestureState;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const scale = Math.min(Math.max(1 + distance / 100, 1), 3);
          scaleAnim.setValue(scale);
          setImageScale(scale);
        } else if (gestureState.numberOfTouches === 1 && imageScale > 1) {
          translateX.setValue(lastTranslateX.current + gestureState.dx);
          translateY.setValue(lastTranslateY.current + gestureState.dy);
        }
      },
      onPanResponderRelease: () => {
        if (imageScale < 1.2) {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
          setImageScale(1);
          translateX.setValue(0);
          translateY.setValue(0);
          lastTranslateX.current = 0;
          lastTranslateY.current = 0;
        }
      },
    });
  }, [imageScale]);

 
  useFocusEffect(
    useCallback(() => {
      const syncLikeStatus = async () => {
        if (!post?.id) return;
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) return;

          const response = await axios.get(`${API_ROUTE}/posts/${post.id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            console.log('🔄 Focus sync - is_liked:', response.data.is_liked);
            console.log('🔄 Focus sync - like_count:', response.data.like_count);
            
            setIsLiked(response.data.is_liked || false);
            setLikeCount(response.data.like_count || 0);
          }
        } catch (error) {
          console.error('Error syncing like status on focus:', error);
        }
      };

      syncLikeStatus();
    }, [post?.id])
  );

  // Load data - SINGLE useEffect to handle both cases
  useEffect(() => {
    const loadData = async () => {
      if (postData) {
        // We have data from navigation params
        console.log('🔵 postData received - is_liked:', postData.is_liked);
        console.log('🔵 postData received - like_count:', postData.like_count);
        
        setIsLiked(postData.is_liked || false);
        setLikeCount(postData.like_count || 0);
        
        setPost({
          ...postData,
          all_images: postData.all_images ? postData.all_images.map(img => ({
            ...img,
            url: fixImageUrl(img.url)
          })) : [],
          image_url: postData.image_url ? fixImageUrl(postData.image_url) : null,
        });
        
        setCommentCount(postData.comment_count || 0);
        setShareCount(postData.share_count || 0);
        setViewsCount(postData.views || 0);
        setIsBookmarked(postData.is_bookmarked || false);
        
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setCurrentUserId(userData?.id);
          setCurrentUsername(userData?.name || userData?.username || '');
          setCurrentUserProfilePic(userData?.profile_picture || null);
          setIsOwnPost(postData.user_id === userData?.id);
        }
        
        await fetchComments(postData.id);
        setLoading(false);
      } else if (postId) {
        // Fetch from API
        await fetchPostDetails();
      }
    };
    
    loadData();
  }, [postId, postData]);

  // Open image viewer
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
    scaleAnim.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
    setImageScale(1);
  };

  // Close image viewer
  const closeImageViewer = () => {
    setImageViewerVisible(false);
    scaleAnim.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
    lastScale.current = 1;
    setImageScale(1);
  };

  // Render comment with replies and delete option
const renderCommentItem = useCallback(({ item }) => {
  const { 
    userId: commentUserId, 
    username: commentUsername, 
    userProfilePic: commentUserProfilePic, 
    isVerified: commentIsVerified 
  } = extractUserData(item);

  const isOwnComment = commentUserId === currentUserId;
  const isCommentLiked = commentLikes[item.id] || item.is_liked || false;
  const commentLikeCount = item.like_count || 0;
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
                ? { uri: fixImageUrl(commentUserProfilePic) }
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
            
            {/* Delete button for own comments */}
            {isOwnComment && (
  <TouchableOpacity 
    style={styles.commentDeleteButton}
    onPress={() => handleDeleteComment(item.id, false, null)}
  >
    <Ionicons name="trash-outline" size={16} color="#FF4444" />
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
                name={isCommentLiked ? "heart" : "heart-outline"} 
                size={20} 
                color={isCommentLiked ? '#1877F2' : colors.textSecondary} 
              />
              {commentLikeCount > 0 && (
                <Text style={[styles.commentActionText, { color: isCommentLiked ? '#1877F2' : colors.textSecondary }]}>
                  {commentLikeCount}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.commentActionButton}
              onPress={() => handleReplyToComment(commentUsername, item.id)}
            >
              <Ionicons name="chatbubble-outline" size={17} color={colors.textSecondary} />
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
                            ? { uri: fixImageUrl(replyUserProfilePic) }
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
                        
                        {/* Delete button for own replies */}
                        {isOwnReply && (
  <TouchableOpacity 
    style={styles.commentDeleteButton}
    onPress={() => handleDeleteComment(reply.id, true, item.id)}
  >
    <Ionicons name="trash-outline" size={14} color="#FF4444" />
  </TouchableOpacity>
)}
                      </View>
                      
                      <Text style={[styles.replyText, { color: colors.text }]}>{reply.text}</Text>
                      
                      <View style={styles.replyActions}>
                        <TouchableOpacity 
                          style={styles.replyActionButton}
                          onPress={() => handleCommentLike(reply.id)}
                        >
                          <Ionicons 
                            name={isReplyLiked ? "heart" : "heart-outline"} 
                            size={17} 
                            color={isReplyLiked ? '#1877F2' : colors.textSecondary} 
                          />
                          {replyLikeCount > 0 && (
                            <Text style={[styles.replyActionText, { color: isReplyLiked ? '#1877F2' : colors.textSecondary }]}>
                              {replyLikeCount}
                            </Text>
                          )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.replyActionButton}
                          onPress={() => handleReplyToComment(replyUsername, item.id)}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
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
}, [colors, currentUserId, commentLikes, handleCommentLike, handleReplyToComment, navigation, extractUserData, fixImageUrl, handleDeleteComment]);
 
  // Render image carousel
  const renderImageCarousel = useCallback(() => {
    const images = getPostImages();
    if (images.length === 0) return null;

    return (
      <View style={styles.imageCarousel}>
        <TouchableOpacity 
          style={styles.mainImageContainer}
          onPress={() => openImageViewer(0)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: images[0].url }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {images.length > 1 && (
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCountText}>+{images.length - 1}</Text>
            </View>
          )}
        </TouchableOpacity>

        {images.length > 1 && (
          <FlatList
            data={images.slice(1, 5)}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailList}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.thumbnailItem}
                onPress={() => openImageViewer(index + 1)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => `thumb-${index}`}
          />
        )}
      </View>
    );
  }, [post]);

  // Custom Image Viewer Modal
  const renderImageViewer = useCallback(() => {
    const images = getPostImages();
    if (images.length === 0) return null;

    return (
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity 
            style={styles.imageViewerClose}
            onPress={closeImageViewer}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.imageViewerContent}>
            <Animated.Image
              source={{ uri: images[currentImageIndex]?.url }}
              style={[
                styles.imageViewerImage,
                {
                  transform: [
                    { scale: scaleAnim },
                    { translateX: translateX },
                    { translateY: translateY },
                  ],
                },
              ]}
              resizeMode="contain"
              {...panResponder.current?.panHandlers}
            />
          </View>

          {images.length > 1 && (
            <>
              <View style={styles.imageViewerCounter}>
                <Text style={styles.imageViewerCounterText}>
                  {currentImageIndex + 1} / {images.length}
                </Text>
              </View>

              <View style={styles.imageViewerNav}>
                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonLeft]}
                  onPress={() => {
                    setCurrentImageIndex(prev => 
                      prev > 0 ? prev - 1 : images.length - 1
                    );
                    scaleAnim.setValue(1);
                    translateX.setValue(0);
                    translateY.setValue(0);
                    setImageScale(1);
                  }}
                >
                  <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonRight]}
                  onPress={() => {
                    setCurrentImageIndex(prev => 
                      prev < images.length - 1 ? prev + 1 : 0
                    );
                    scaleAnim.setValue(1);
                    translateX.setValue(0);
                    translateY.setValue(0);
                    setImageScale(1);
                  }}
                >
                  <Ionicons name="chevron-forward" size={30} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.imageViewerThumbnails}>
                <FlatList
                  data={images}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.viewerThumbnailItem,
                        currentImageIndex === index && styles.viewerThumbnailActive,
                      ]}
                      onPress={() => {
                        setCurrentImageIndex(index);
                        scaleAnim.setValue(1);
                        translateX.setValue(0);
                        translateY.setValue(0);
                        setImageScale(1);
                      }}
                    >
                      <Image
                        source={{ uri: item.url }}
                        style={styles.viewerThumbnailImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(_, index) => `viewer-thumb-${index}`}
                  contentContainerStyle={styles.viewerThumbnailsContainer}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    );
  }, [imageViewerVisible, currentImageIndex, images]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading post...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Post not found
  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>Post not found</Text>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.goBackText, { color: colors.primary }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = getPostImages();

  console.log('🔵 RENDER - isLiked:', isLiked, 'likeCount:', likeCount);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <TouchableOpacity style={styles.shareButton}>
          {/* <Ionicons name="share-social-outline" size={24} color={colors.text} /> */}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
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
          
<View style={[styles.userInfo, { borderBottomColor: colors.border }]}>
  <TouchableOpacity 
    style={styles.userInfoContent}
    onPress={() => navigation.navigate('OtherUserProfile', { user_ID: post.user_id })}
  >
    <Image
      source={
        post.user_profile_picture
          ? { uri: fixImageUrl(post.user_profile_picture) }
          : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
      }
      style={styles.userAvatar}
    />
    <View style={styles.userInfoDetails}>
      <View style={styles.userNameRow}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {post.username || 'Anonymous'}
        </Text>
        {post.is_verified && (
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="check-bold" size={11} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.userMetaRow}>
        <Text style={[styles.postTime, { color: colors.textSecondary }]}>
          {dayjs(post.created_at).fromNow()}
        </Text>
        {followerCount > 0 && !isOwnPost && (
          <Text style={[styles.followerCount, { color: colors.textSecondary }]}>
            • {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
  
  {/* Follow/Delete Button Section */}
  <View style={styles.userActions}>
    {!isOwnPost ? (
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
    ) : (
      <TouchableOpacity 
        style={[styles.deleteButton, { borderColor: '#FF4444' }]}
        onPress={handleDeletePost}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#FF4444" />
        ) : (
          <>
            <Ionicons name="trash-outline" size={18} color="#FF4444" />
            <Text style={[styles.deleteButtonText, { color: '#FF4444' }]}>Delete</Text>
          </>
        )}
      </TouchableOpacity>
    )}
  </View>
</View>

            {/* Post Content */}
            <View style={styles.postContentSection}>
              <Text style={[styles.postContent, { color: colors.text }]}>
                {post.content || 'No caption'}
              </Text>
            </View>

            {/* Image Carousel */}
            {renderImageCarousel()}

            {/* Post Stats - FIXED HEART ICON */}
            <View style={[styles.postStats, { borderBottomColor: colors.border }]}>
              <View style={styles.statsLeft}>
                <TouchableOpacity style={styles.statButton} onPress={handleLike}>
                  <Ionicons 
                    name={isLiked ? 'heart' : 'heart-outline'} 
                    size={24} 
                    color={isLiked ? '#1877F2' : colors.textSecondary} 
                  />
                  <Text style={[styles.statCount, { color: isLiked ? '#1877F2' : colors.textSecondary }]}>
                    {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton}>
                  <Ionicons name="chatbubble-outline" size={24} color={colors.textSecondary} />
                  <Text style={[styles.statCount, { color: colors.textSecondary }]}>
                    {commentCount} Comments
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton} onPress={handleShare}>
                  <Feather name="send" size={23} color={colors.textSecondary} />
                  <Text style={[styles.statCount, { color: colors.textSecondary }]}>
                    {shareCount} Share
                  </Text>
                </TouchableOpacity>
              </View>
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
                      ? { uri: fixImageUrl(currentUserProfilePic) }
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

      {/* Image Viewer Modal */}
      {renderImageViewer()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  shareButton: {
    padding: 4,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
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
  },
  followerCount: {
    fontSize: 12,
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
  ownPostBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8ECF1',
  },
  ownPostBadgeText: {
    color: '#2C3E50',
    fontSize: 12,
    fontWeight: '600',
  },
  postContentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageCarousel: {
    marginBottom: 12,
  },
  mainImageContainer: {
    width: width,
    height: width,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  thumbnailItem: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
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
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
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
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
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
  },
  commentText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
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
  },
  replyText: {
    fontSize: 12,
    marginTop: 2,
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
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noCommentsText: {
    fontSize: 14,
  },
  // Image Viewer Styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  imageViewerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  userActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
deleteButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1.5,
  gap: 6,
  minWidth: 90,
},
deleteButtonText: {
  fontSize: 13,
  fontWeight: '600',
},
  imageViewerImage: {
    width: width,
    height: height * 0.8,
  },
  imageViewerCounter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageViewerCounterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  imageViewerNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    pointerEvents: 'box-none',
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  navButtonLeft: {
    alignSelf: 'center',
  },
  navButtonRight: {
    alignSelf: 'center',
  },
  imageViewerThumbnails: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 60,
  },
  viewerThumbnailsContainer: {
    paddingHorizontal: 10,
  },
  viewerThumbnailItem: {
    width: 50,
    height: 50,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  viewerThumbnailActive: {
    borderColor: '#0D64DD',
  },
  commentDeleteButton: {
  padding: 4,
  marginLeft: 4,
},
  viewerThumbnailImage: {
    width: '100%',
    height: '100%',
  },
});

export default PostDetailScreen;