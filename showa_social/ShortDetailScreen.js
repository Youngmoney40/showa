import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Linking,
  Platform,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../src/context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');

const ShortDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  // Get shortId from route params - supports multiple param names
  const { shortId, id, short_id } = route.params || {};
  const finalShortId = shortId || id || short_id;
  
  const [short, setShort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsHasMore, setCommentsHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    console.log('🔗 ShortDetailScreen mounted');
    console.log('📦 Route params:', route.params);
    console.log('🆔 Final Short ID:', finalShortId);
    
    if (finalShortId) {
      fetchShortDetails();
      fetchComments(1);
    } else {
      setError('No short ID provided');
      setLoading(false);
    }
  }, [finalShortId]);

  const fetchShortDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        setError('Please login to view this short');
        setLoading(false);
        return;
      }
      
      console.log('📡 Fetching short:', finalShortId);
      
      const response = await axios.get(`${API_ROUTE}/shorts/${finalShortId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        console.log('✅ Short fetched successfully');
        setShort(response.data);
        setIsLiked(response.data.is_liked || false);
        setLikeCount(response.data.like_count || 0);
        setCommentCount(response.data.comment_count || 0);
        setShareCount(response.data.share_count || 0);
        setIsFollowing(response.data.is_following || false);
      }
    } catch (err) {
      console.error('❌ Error fetching short:', err);
      if (err.response?.status === 404) {
        setError('Short not found. It may have been deleted.');
      } else if (err.response?.status === 401) {
        setError('Please login to view this short');
      } else {
        setError('Failed to load short. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (page = 1, isLoadMore = false) => {
    if (loadingComments || (!commentsHasMore && isLoadMore)) return;
    
    setLoadingComments(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_ROUTE}/shorts/${finalShortId}/comments/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, page_size: 20 }
        }
      );
      
      if (response.status === 200) {
        let newComments = [];
        if (response.data.results) {
          newComments = response.data.results;
          setCommentsHasMore(!!response.data.next);
          setCommentsPage(page + 1);
        } else if (Array.isArray(response.data)) {
          newComments = response.data;
          setCommentsHasMore(false);
        }
        
        if (isLoadMore) {
          setComments(prev => [...prev, ...newComments]);
        } else {
          setComments(newComments);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!short) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Login Required', 'Please login to like shorts');
        return;
      }
      
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);
      
      const response = await axios.post(
        `${API_ROUTE}/shorts/${short.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setLikeCount(response.data.like_count || 0);
        setIsLiked(response.data.is_liked || false);
      }
    } catch (error) {
      console.error('Error liking short:', error);
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      Alert.alert('Error', 'Failed to like. Please try again.');
    }
  };

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Login Required', 'Please login to follow users');
        return;
      }
      
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      
      if (newFollowingState) {
        await axios.post(
          `${API_ROUTE}/follow-user/${short.user?.id}/`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `${API_ROUTE}/unfollow-user/${short.user?.id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      Alert.alert('Success', newFollowingState ? 'User followed!' : 'User unfollowed');
    } catch (error) {
      console.error('Error following user:', error);
      setIsFollowing(isFollowing);
      Alert.alert('Error', 'Failed to follow user');
    }
  };

  const handleShare = async () => {
    if (!short) return;
    
    try {
      const deepLinkUrl = `showa://short/${short.id}`;
      const webUrl = `https://showapp.com/short/${short.id}`;
      
      const shareMessage = `${short.user?.name || 'User'} shared a short video on ShowApp\n\n"${short.caption?.substring(0, 100) || ''}"\n\n${webUrl}`;
      
      const shareResult = await Share.share({
        message: shareMessage,
        title: `ShowApp - ${short.user?.name}'s short`,
        url: webUrl,
      });
      
      if (shareResult.action === Share.sharedAction) {
        console.log('Short shared successfully');
        
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          await axios.post(
            `${API_ROUTE}/shorts/${short.id}/share/`,
            { shared_to: 'external' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setShareCount(prev => prev + 1);
          Alert.alert('🎉 Share Success!', 'Thanks for sharing!');
        }
      }
    } catch (error) {
      console.error('Error sharing short:', error);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || submittingComment) return;
    
    setSubmittingComment(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      
      const requestData = {
        text: newComment.trim(),
        ...(replyToComment && { parent: replyToComment.id })
      };
      
      const response = await axios.post(
        `${API_ROUTE}/shorts/${short.id}/comment/`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200 || response.status === 201) {
        setNewComment('');
        setReplyToComment(null);
        setCommentCount(prev => prev + 1);
        
        // Add new comment to list
        const newCommentObj = {
          ...response.data,
          user: {
            id: parsedUser?.id,
            name: parsedUser?.name || 'User',
            profile_picture: parsedUser?.profile_picture
          },
          is_own: true,
          like_count: 0,
          is_liked: false,
          replies: []
        };
        
        if (replyToComment) {
          // Add as reply to existing comment
          setComments(prev => prev.map(comment =>
            comment.id === replyToComment.id
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), newCommentObj],
                  reply_count: (comment.reply_count || 0) + 1
                }
              : comment
          ));
        } else {
          setComments(prev => [newCommentObj, ...prev]);
        }
        
        if (response.data.reward) {
          Alert.alert('💬 Reward!', `You earned ${response.data.reward.coins} coins!`);
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReply = (comment) => {
    setReplyToComment(comment);
    setNewComment(`@${comment.user?.name} `);
  };

  const loadMoreComments = () => {
    if (!loadingComments && commentsHasMore) {
      fetchComments(commentsPage, true);
    }
  };

  const toggleVideoPause = () => {
    setVideoPaused(!videoPaused);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const CommentItem = ({ comment, onLike, onReply, level = 0 }) => {
    const [localLiked, setLocalLiked] = useState(comment.is_liked || false);
    const [localLikeCount, setLocalLikeCount] = useState(comment.like_count || 0);
    const [expanded, setExpanded] = useState(false);
    
    const handleLike = async () => {
      const newLiked = !localLiked;
      const newCount = newLiked ? localLikeCount + 1 : localLikeCount - 1;
      setLocalLiked(newLiked);
      setLocalLikeCount(newCount);
      
      try {
        const token = await AsyncStorage.getItem('userToken');
        await axios.post(
          `${API_ROUTE}/shorts/comments/${comment.id}/like/`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        setLocalLiked(localLiked);
        setLocalLikeCount(localLikeCount);
      }
    };
    
    return (
      <View style={[styles.commentItem, level > 0 && styles.replyItem]}>
        <Image
          source={
            comment.user?.profile_picture
              ? { uri: comment.user.profile_picture }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.commentAvatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={[styles.commentUsername, { color: colors.text }]}>
              {comment.user?.name || 'Anonymous'}
            </Text>
            <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
              {dayjs(comment.created_at).fromNow()}
            </Text>
          </View>
          <Text style={[styles.commentText, { color: colors.text }]}>{comment.text}</Text>
          <View style={styles.commentFooter}>
            <TouchableOpacity onPress={handleLike} style={styles.commentAction}>
              <Ionicons
                name={localLiked ? 'heart' : 'heart-outline'}
                size={16}
                color={localLiked ? '#DC143C' : colors.textSecondary}
              />
              <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                {localLikeCount > 0 ? localLikeCount : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onReply(comment)} style={styles.commentAction}>
              <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>Reply</Text>
            </TouchableOpacity>
          </View>
          {comment.replies && comment.replies.length > 0 && !expanded && (
            <TouchableOpacity onPress={() => setExpanded(true)}>
              <Text style={[styles.viewRepliesText, { color: colors.primary }]}>
                View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
          {expanded && comment.replies && comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary || '#DC143C'} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading short...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="sad-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary || '#DC143C' }]}
          onPress={fetchShortDetails}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!short) return null;

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Short Video</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-social-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Video Player */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={toggleVideoPause}
      >
        <Video
          ref={videoRef}
          source={{ uri: short.video }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={videoPaused}
          muted={isMuted}
          volume={isMuted ? 0 : 1.0}
          onError={(e) => console.log('Video error:', e)}
        />
        
        {/* Play/Pause Indicator */}
        {videoPaused && (
          <View style={styles.playIndicator}>
            <Ionicons name="play" size={50} color="#fff" />
          </View>
        )}
        
        {/* Mute Button */}
        <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
          <Ionicons
            name={isMuted ? 'volume-mute' : 'volume-high'}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Content Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.contentOverlay}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Info Card */}
          <View style={styles.userCard}>
            <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfile', { userId: short.user?.id })}>
              <Image
                source={
                  short.user?.profile_picture
                    ? { uri: short.user.profile_picture }
                    : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfile', { userId: short.user?.id })}>
                <Text style={styles.username}>{short.user?.name || 'User'}</Text>
              </TouchableOpacity>
              <Text style={styles.timestamp}>
                {dayjs(short.created_at).fromNow()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleFollow}
              style={[styles.followButton, isFollowing && styles.followingButton]}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Caption */}
          {short.caption && (
            <Text style={styles.caption}>{short.caption}</Text>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={18} color="#DC143C" />
              <Text style={styles.statText}>{likeCount} likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
              <Text style={styles.statText}>{commentCount} comments</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="arrow-redo" size={18} color="#fff" />
              <Text style={styles.statText}>{shareCount} shares</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionBar}>
            <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
              <LinearGradient
                colors={isLiked ? ['#DC143C', '#FF4444'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                style={styles.actionBtnGradient}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color={isLiked ? '#fff' : '#fff'}
                />
                <Text style={[styles.actionBtnText, isLiked && styles.actionBtnTextActive]}>
                  {likeCount > 0 ? likeCount : 'Like'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowCommentModal(true)} style={styles.actionBtn}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                style={styles.actionBtnGradient}
              >
                <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>
                  {commentCount > 0 ? commentCount : 'Comment'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                style={styles.actionBtnGradient}
              >
                <Ionicons name="arrow-redo" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>
                  {shareCount > 0 ? shareCount : 'Share'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Comments Section Preview */}
          {comments.length > 0 && (
            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>
                  Comments ({commentCount})
                </Text>
                <TouchableOpacity onPress={() => setShowCommentModal(true)}>
                  <Text style={[styles.viewAllText, { color: '#DC143C' }]}>View all</Text>
                </TouchableOpacity>
              </View>
              {comments.slice(0, 2).map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onLike={() => {}}
                  onReply={handleReply}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowCommentModal(false);
          setReplyToComment(null);
          setNewComment('');
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Comments ({commentCount})
                </Text>
                <TouchableOpacity onPress={() => {
                  setShowCommentModal(false);
                  setReplyToComment(null);
                  setNewComment('');
                }}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <CommentItem
                    comment={item}
                    onLike={() => {}}
                    onReply={handleReply}
                  />
                )}
                onEndReached={loadMoreComments}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  loadingComments && (
                    <ActivityIndicator size="small" color="#DC143C" style={styles.commentsLoader} />
                  )
                }
                ListEmptyComponent={
                  <View style={styles.emptyComments}>
                    <Text style={[styles.emptyCommentsText, { color: colors.textSecondary }]}>
                      No comments yet. Be the first to comment!
                    </Text>
                  </View>
                }
                contentContainerStyle={styles.commentsList}
              />
              
              {replyToComment && (
                <View style={[styles.replyingBar, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.replyingText, { color: colors.textSecondary }]}>
                    Replying to @{replyToComment.user?.name}
                  </Text>
                  <TouchableOpacity onPress={() => setReplyToComment(null)}>
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
                  placeholder={replyToComment ? "Write a reply..." : "Add a comment..."}
                  placeholderTextColor={colors.textSecondary}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  editable={!submittingComment}
                />
                <TouchableOpacity
                  onPress={submitComment}
                  disabled={!newComment.trim() || submittingComment}
                  style={[styles.sendButton, { backgroundColor: '#DC143C' }, (!newComment.trim() || submittingComment) && styles.sendButtonDisabled]}
                >
                  {submittingComment ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="send" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  videoContainer: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  video: {
    width: width,
    height: height,
  },
  playIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.6,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#DC143C',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  followingButton: {
    backgroundColor: '#DC143C',
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC143C',
  },
  followingButtonText: {
    color: '#fff',
  },
  caption: {
    fontSize: 15,
    lineHeight: 22,
    color: '#fff',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#fff',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 12,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  actionBtnTextActive: {
    color: '#fff',
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  replyItem: {
    marginLeft: 40,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  commentTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#fff',
    marginBottom: 6,
  },
  commentFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  viewRepliesText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  commentsList: {
    paddingBottom: 20,
  },
  commentsLoader: {
    paddingVertical: 20,
  },
  emptyComments: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCommentsText: {
    fontSize: 14,
    textAlign: 'center',
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
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    padding: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});

export default ShortDetailScreen;