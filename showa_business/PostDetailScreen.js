import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../src/context/ThemeContext';

dayjs.extend(relativeTime);

const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const { postId } = route.params;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        setPost(response.data);
        setIsLiked(response.data.reactions?.user_reaction === 'like');
        setLikeCount(response.data.like_count || 0);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post. It may have been deleted or you don\'t have access.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      
      const response = await axios.post(
        `${API_ROUTE}/post-react/`,
        { post_id: postId, reaction_type: 'like' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setLikeCount(response.data.like_count || 0);
        setIsLiked(response.data.reaction?.reaction_type === 'like');
        
        if (response.data.reward) {
          Alert.alert('🎉 Reward!', `You earned ${response.data.reward.coins} coins!`);
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `showa://post/${post.id}`;
      const shareMessage = `Check out this post on ShowApp!\n\n"${post.content}"\n\n${shareUrl}`;
      
      const result = await Share.share({
        message: shareMessage,
        title: `Post by ${post.username}`,
      });
      
      if (result.action === Share.sharedAction) {
        const token = await AsyncStorage.getItem('userToken');
        await axios.post(
          `${API_ROUTE}/post-react/`,
          { post_id: postId, reaction_type: 'share', share_platform: 'external' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComment = () => {
    // You can implement comment modal or navigate to comments screen
    Alert.alert('Comments', 'Comment functionality coming soon');
  };

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

  if (!post) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <View style={styles.headerRight} />
      </View>

      {/* User Info */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('OtherUserProfile', { userId: post.user_id })}
        style={styles.userInfo}
      >
        <Image
          source={
            post.user_profile_picture
              ? { uri: post.user_profile_picture }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userTextInfo}>
          <Text style={[styles.username, { color: colors.text }]}>{post.username}</Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {dayjs(post.created_at).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Post Content */}
      <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

      {/* Images */}
      {post.all_images && post.all_images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
          {post.all_images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.url }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Stats */}
      <View style={[styles.statsContainer, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
        <View style={styles.stat}>
          <Ionicons name="eye-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {post.views || 0} views
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {post.comment_count || 0} comments
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <MaterialIcons
            name={isLiked ? 'thumb-up' : 'thumb-up-off-alt'}
            size={28}
            color={isLiked ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: isLiked ? colors.primary : colors.textSecondary }]}>
            {likeCount > 0 ? likeCount : 'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={26} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={26} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userTextInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  imagesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  postImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PostDetailScreen;