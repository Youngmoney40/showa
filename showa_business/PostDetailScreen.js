

import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');

const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  const { postId, id, post_id } = route.params || {};
  const finalPostId = postId || id || post_id;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const checkDeepLink = async () => {
      const url = await Linking.getInitialURL();
      console.log("🔗 PostDetailScreen - Initial URL:", url);
      if (url) {
        const match = url.match(/post\/(\d+)/);
        if (match && !finalPostId) {
          console.log("Using deep link ID:", match[1]);
        }
      }
    };
    checkDeepLink();
  }, []);

  useEffect(() => {
    console.log('🔗 PostDetailScreen mounted');
    console.log('📦 Route params:', route.params);
    console.log('🆔 Final Post ID:', finalPostId);
    
    if (finalPostId) {
      fetchPostDetails();
      fetchComments();
    } else {
      setError('No post ID provided');
      setLoading(false);
    }
  }, [finalPostId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        setError('Please login to view this post');
        setLoading(false);
        return;
      }
      
      console.log('📡 Fetching post:', finalPostId);
      
      const response = await axios.get(`${API_ROUTE}/posts/${finalPostId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        console.log('✅ Post fetched successfully');
        setPost(response.data);
        setIsLiked(response.data.reactions?.user_reaction === 'like');
        setLikeCount(response.data.like_count || 0);
        setShareCount(response.data.share_count || 0);
        setIsBookmarked(response.data.is_bookmarked || false);
      }
    } catch (err) {
      console.error('❌ Error fetching post:', err);
      if (err.response?.status === 404) {
        setError('Post not found. It may have been deleted.');
      } else if (err.response?.status === 401) {
        setError('Please login to view this post');
      } else {
        setError('Failed to load post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      
      const response = await axios.get(`${API_ROUTE}/post/${finalPostId}/comments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        setComments(response.data.comments || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Login Required', 'Please login to like posts');
        return;
      }
      
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);
      
      const response = await axios.post(
        `${API_ROUTE}/post-react/`,
        { post_id: post.id, reaction_type: 'like' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setLikeCount(response.data.like_count || 0);
        setIsLiked(response.data.reaction?.reaction_type === 'like');
        
        if (response.data.reward) {
          Alert.alert(
            '🎉 Reward Earned!',
            `You earned ${response.data.reward.coins} coins!`,
            [{ text: 'Awesome!' }]
          );
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  };

  const handleBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);
      
      await axios.post(
        `${API_ROUTE}/bookmark-post/`,
        { post: post.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Success', newBookmarkState ? 'Post saved!' : 'Post removed from saved');
    } catch (error) {
      console.error('Error bookmarking post:', error);
      setIsBookmarked(isBookmarked);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    try {
      const deepLinkUrl = `showa://post/${post.id}`;
      const webUrl = `https://showapp.com/post/${post.id}`;
      
      const shareMessage = `${post.username} shared a post on ShowApp\n\n"${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"\n\n${webUrl}`;
      
      const shareResult = await Share.share({
        message: shareMessage,
        title: `ShowApp - ${post.username}'s post`,
        url: webUrl,
      });
      
      if (shareResult.action === Share.sharedAction) {
        console.log('Post shared successfully');
        
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.post(
            `${API_ROUTE}/post-react/`,
            { post_id: post.id, reaction_type: 'share', share_platform: 'external' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data) {
            setShareCount(response.data.share_count || shareCount + 1);
            if (response.data.reward) {
              Alert.alert('🎉 Share Reward!', `You earned ${response.data.reward.coins} coins!`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleComment = () => {
    if (!post) return;
    setShowCommentModal(true);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      
      const response = await axios.post(
        `${API_ROUTE}/posts-comment/${post.id}/comments/`,
        {
          text: newComment.trim(),
          post: post.id,
          user: parsedUser?.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200 || response.status === 201) {
        setNewComment('');
        setShowCommentModal(false);
        fetchComments(); // Refresh comments
        setLikeCount(prev => prev + 1); // Update comment count in post stats
        
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

  const handleViewProfile = () => {
    if (post?.user_id) {
      navigation.navigate('OtherUserProfile', { userId: post.user_id });
    }
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const renderCommentItem = ({ item }) => (
    <View style={[styles.commentItem, { borderBottomColor: colors.border }]}>
      <Image
        source={
          item.user?.profile_picture
            ? { uri: item.user.profile_picture }
            : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
        }
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.commentUsername, { color: colors.text }]}>
            {item.user?.username || 'Anonymous'}
          </Text>
          <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
            {dayjs(item.created_at).fromNow()}
          </Text>
        </View>
        <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
              {item.like_count || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading post...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="sad-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={fetchPostDetails}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!post) return null;

  return (
    <SafeAreaView style={styles.container}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={[styles.header, { borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-social-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card */}
        <TouchableOpacity onPress={handleViewProfile} activeOpacity={0.7}>
          <View style={[styles.userCard, { backgroundColor: colors.card }]}>
            <Image
              source={
                post.user_profile_picture
                  ? { uri: post.user_profile_picture }
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <View style={styles.userNameRow}>
                <Text style={[styles.username, { color: colors.text }]}>{post.username}</Text>
                {post.is_verified && (
                  <View style={styles.verifiedBadge}>
                    <Icon name="check-circle" size={16} color={colors.primary} />
                  </View>
                )}
              </View>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                {dayjs(post.created_at).fromNow()}
              </Text>
            </View>
            
          </View>
        </TouchableOpacity>

        {/* Post Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>
        </View>

        {/* Images Gallery */}
        {post.all_images && post.all_images.length > 0 && (
          <View style={styles.galleryContainer}>
            {post.all_images.length === 1 ? (
              <TouchableOpacity onPress={() => handleImagePress(0)} activeOpacity={0.9}>
                <Image
                  source={{ uri: post.all_images[0].url }}
                  style={styles.singleImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <FlatList
                ref={flatListRef}
                data={post.all_images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => handleImagePress(index)} activeOpacity={0.9}>
                    <Image
                      source={{ uri: item.url }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                    {index === 0 && post.all_images.length > 1 && (
                      <View style={styles.imageCountBadge}>
                        <Text style={styles.imageCountText}>
                          {index + 1}/{post.all_images.length}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}

        {/* Stats Row */}
        <View style={[styles.statsRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          {/* <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {post.views || 0} views
            </Text>
          </View>
          <View style={styles.statDivider} /> */}
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {likeCount} likes
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {post.comment_count || 0} comments
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="share-social-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {shareCount > 0 ? shareCount : 'Share'}
            </Text>
          </View>
        </View>
         

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
            <LinearGradient
              colors={isLiked ? [colors.primary, colors.primaryDark || colors.primary] : ['transparent', 'transparent']}
              style={[styles.actionBtnGradient, isLiked && styles.actionBtnActive]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons
                name={isLiked ? 'thumb-up' : 'thumb-up-off-alt'}
                size={24}
                color={isLiked ? '#fff' : colors.textSecondary}
              />
              <Text style={[styles.actionBtnText, { color: isLiked ? '#fff' : colors.textSecondary }]}>
                {likeCount > 0 ? likeCount : 'Like'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleComment} style={styles.actionBtn}>
            <LinearGradient
              colors={['transparent', 'transparent']}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>
                {post.comment_count > 0 ? post.comment_count : 'Comment'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
            <LinearGradient
              colors={['transparent', 'transparent']}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="share-social-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>
                {shareCount > 0 ? shareCount : 'Share'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Comments Section Preview */}
        {comments.length > 0 && (
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={[styles.commentsTitle, { color: colors.text }]}>
                Comments ({comments.length})
              </Text>
              <TouchableOpacity onPress={handleComment}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View all</Text>
              </TouchableOpacity>
            </View>
            {comments.slice(0, 2).map((comment, index) => (
              <View key={comment.id || index}>
                {renderCommentItem({ item: comment })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add Comment</Text>
                <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={[styles.modalInput, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                placeholder="Write your comment..."
                placeholderTextColor={colors.textSecondary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={submitComment}
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Post Comment</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity 
            style={styles.imageModalClose}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          <FlatList
            data={post.all_images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.imageModalPage}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.imageModalImage}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  timestamp: {
    fontSize: 12,
  },
  bookmarkButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  galleryContainer: {
    marginVertical: 8,
  },
  singleImage: {
    width: width - 32,
    height: width - 32,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  galleryImage: {
    width: width - 32,
    height: width - 32,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 16,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  actionBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 8,
    paddingHorizontal: 16,
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
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    marginBottom: 4,
    gap: 8,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    fontSize: 11,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
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
    minHeight: 200,
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
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 15,
    marginBottom: 15,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  imageModalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  imageModalPage: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalImage: {
    width: width,
    height: height * 0.8,
  },
});

export default PostDetailScreen;