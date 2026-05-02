// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Share,
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useTheme } from '../src/context/ThemeContext';

// dayjs.extend(relativeTime);

// const PostDetailScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { colors, isDark } = useTheme();
//   const { postId } = route.params;
  
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);


//   useEffect(() => {
//     console.log('PostDetailScreen route params:', route.params);
//     console.log('PostId from params:', postId);
//   }, [route.params, postId]);
  

//   useEffect(() => {
//     fetchPostDetails();
//   }, [postId]);

//   const fetchPostDetails = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/posts/${postId}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (response.status === 200) {
//         setPost(response.data);
//         setIsLiked(response.data.reactions?.user_reaction === 'like');
//         setLikeCount(response.data.like_count || 0);
//       }
//     } catch (err) {
//       console.error('Error fetching post:', err);
//       setError('Failed to load post. It may have been deleted or you don\'t have access.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLike = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       // Optimistic update
//       setIsLiked(!isLiked);
//       setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      
//       const response = await axios.post(
//         `${API_ROUTE}/post-react/`,
//         { post_id: postId, reaction_type: 'like' },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (response.data) {
//         setLikeCount(response.data.like_count || 0);
//         setIsLiked(response.data.reaction?.reaction_type === 'like');
        
//         if (response.data.reward) {
//           Alert.alert('🎉 Reward!', `You earned ${response.data.reward.coins} coins!`);
//         }
//       }
//     } catch (error) {
//       console.error('Error liking post:', error);
//       // Revert on error
//       setIsLiked(!isLiked);
//       setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
//       Alert.alert('Error', 'Failed to like post');
//     }
//   };

//   const handleShare = async () => {
//     try {
//       const shareUrl = `showa://post/${post.id}`;
//       const shareMessage = `Check out this post on ShowApp!\n\n"${post.content}"\n\n${shareUrl}`;
      
//       const result = await Share.share({
//         message: shareMessage,
//         title: `Post by ${post.username}`,
//       });
      
//       if (result.action === Share.sharedAction) {
//         const token = await AsyncStorage.getItem('userToken');
//         await axios.post(
//           `${API_ROUTE}/post-react/`,
//           { post_id: postId, reaction_type: 'share', share_platform: 'external' },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }
//     } catch (error) {
//       console.error('Error sharing:', error);
//     }
//   };

//   const handleComment = () => {
//     // You can implement comment modal or navigate to comments screen
//     Alert.alert('Comments', 'Comment functionality coming soon');
//   };

//   if (loading) {
//     return (
//       <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={[styles.loadingText, { color: colors.text }]}>Loading post...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
//         <Ionicons name="sad-outline" size={64} color={colors.textSecondary} />
//         <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
//         <TouchableOpacity 
//           style={[styles.retryButton, { backgroundColor: colors.primary }]}
//           onPress={fetchPostDetails}
//         >
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!post) {
//     return (
//       <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
//         <Text style={[styles.errorText, { color: colors.text }]}>Post not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView 
//       style={[styles.container, { backgroundColor: colors.background }]}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Header */}
//       <View style={[styles.header, { borderBottomColor: colors.border }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
//         <View style={styles.headerRight} />
//       </View>

//       {/* User Info */}
//       <TouchableOpacity 
//         onPress={() => navigation.navigate('OtherUserProfile', { userId: post.user_id })}
//         style={styles.userInfo}
//       >
//         <Image
//           source={
//             post.user_profile_picture
//               ? { uri: post.user_profile_picture }
//               : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//           }
//           style={styles.avatar}
//         />
//         <View style={styles.userTextInfo}>
//           <Text style={[styles.username, { color: colors.text }]}>{post.username}</Text>
//           <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
//             {dayjs(post.created_at).fromNow()}
//           </Text>
//         </View>
//       </TouchableOpacity>

//       {/* Post Content */}
//       <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

//       {/* Images */}
//       {post.all_images && post.all_images.length > 0 && (
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
//           {post.all_images.map((img, index) => (
//             <Image
//               key={index}
//               source={{ uri: img.url }}
//               style={styles.postImage}
//               resizeMode="cover"
//             />
//           ))}
//         </ScrollView>
//       )}

//       {/* Stats */}
//       <View style={[styles.statsContainer, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
//         <View style={styles.stat}>
//           <Ionicons name="eye-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.statText, { color: colors.textSecondary }]}>
//             {post.views || 0} views
//           </Text>
//         </View>
//         <View style={styles.stat}>
//           <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.statText, { color: colors.textSecondary }]}>
//             {post.comment_count || 0} comments
//           </Text>
//         </View>
//       </View>

//       {/* Actions */}
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
//           <MaterialIcons
//             name={isLiked ? 'thumb-up' : 'thumb-up-off-alt'}
//             size={28}
//             color={isLiked ? colors.primary : colors.textSecondary}
//           />
//           <Text style={[styles.actionText, { color: isLiked ? colors.primary : colors.textSecondary }]}>
//             {likeCount > 0 ? likeCount : 'Like'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
//           <Ionicons name="chatbubble-outline" size={26} color={colors.textSecondary} />
//           <Text style={[styles.actionText, { color: colors.textSecondary }]}>Comment</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
//           <Ionicons name="share-social-outline" size={26} color={colors.textSecondary} />
//           <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   headerRight: {
//     width: 32,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   userTextInfo: {
//     flex: 1,
//   },
//   username: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   timestamp: {
//     fontSize: 12,
//   },
//   content: {
//     fontSize: 16,
//     lineHeight: 24,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   imagesContainer: {
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   postImage: {
//     width: 300,
//     height: 300,
//     borderRadius: 12,
//     marginRight: 8,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     marginVertical: 16,
//   },
//   stat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 24,
//   },
//   statText: {
//     marginLeft: 6,
//     fontSize: 14,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//   },
//   actionButton: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   actionText: {
//     marginTop: 4,
//     fontSize: 12,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//   },
//   errorText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   retryButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 24,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default PostDetailScreen;

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
  Linking,
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
  
  // Get postId from route params - supports multiple param names
  const { postId, id, post_id } = route.params || {};
  const finalPostId = postId || id || post_id;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isShared, setIsShared] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('🔗 PostDetailScreen mounted');
    console.log('📦 Route params:', route.params);
    console.log('🆔 Final Post ID:', finalPostId);
    
    // Log how we got here (deep link or navigation)
    const checkHowOpened = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && initialUrl.includes(`post/${finalPostId}`)) {
        console.log('✅ Opened via deep link:', initialUrl);
      } else {
        console.log('✅ Opened via normal navigation');
      }
    };
    checkHowOpened();
  }, [route.params, finalPostId]);

  useEffect(() => {
    if (finalPostId) {
      fetchPostDetails();
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

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Login Required', 'Please login to like posts');
        return;
      }
      
      // Optimistic update
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
            `You earned ${response.data.reward.coins} coins for liking this post!`,
            [{ text: 'Awesome!' }]
          );
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    try {
      // Create deep link URL
      const deepLinkUrl = `showa://post/${post.id}`;
      const webUrl = `https://showapp.com/post/${post.id}`;
      
      // Get image for better preview
      let imageUrl = post.image_url;
      if (!imageUrl && post.all_images && post.all_images.length > 0) {
        imageUrl = post.all_images[0].url;
      }
      
      const shareMessage = 
        `📱 Check out this post on ShowApp!\n\n` +
        `"${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `👤 Author: ${post.username}\n` +
        `❤️ Likes: ${post.like_count || 0}\n` +
        `💬 Comments: ${post.comment_count || 0}\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        `🔗 Open in app: ${deepLinkUrl}\n` +
        `🌐 Or view online: ${webUrl}`;
      
      const shareOptions = {
        message: shareMessage,
        title: `ShowApp - Post by ${post.username}`,
      };
      
      if (Platform.OS === 'ios') {
        shareOptions.url = webUrl;
      }
      
      const shareResult = await Share.share(shareOptions);
      
      if (shareResult.action === Share.sharedAction) {
        console.log('Post shared successfully');
        
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.post(
            `${API_ROUTE}/post-react/`,
            { 
              post_id: post.id, 
              reaction_type: 'share',
              share_platform: 'external'
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data) {
            setShareCount(response.data.share_count || shareCount + 1);
            setIsShared(true);
            
            if (response.data.reward) {
              Alert.alert(
                '🎉 Share Reward!',
                `You earned ${response.data.reward.coins} coins for sharing!`,
                [{ text: 'Awesome!' }]
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'Failed to share post');
    }
  };

  // const handleComment = () => {
  //   if (!post) return;
  //   // Navigate to comments or open modal
  //   navigation.navigate('CommentsScreen', { postId: post.id, post: post });
  // };


  const handleComment = () => {
  if (!post) return;
  // Instead of navigating to non-existent screen, show alert or modal
  Alert.alert('Comments', 'Comment feature coming soon');
  // Or you can navigate to a modal or bottom sheet
};

  const handleViewProfile = () => {
    if (post?.user_id) {
      navigation.navigate('OtherUserProfile', { userId: post.user_id });
    }
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
        <TouchableOpacity 
          style={[styles.backButton, { marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Post not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Go Back</Text>
        </TouchableOpacity>
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
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <TouchableOpacity onPress={handleViewProfile} style={styles.userInfo}>
        <Image
          source={
            post.user_profile_picture
              ? { uri: post.user_profile_picture }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userTextInfo}>
          <View style={styles.userNameRow}>
            <Text style={[styles.username, { color: colors.text }]}>{post.username}</Text>
            {post.is_verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              </View>
            )}
          </View>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {dayjs(post.created_at).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Post Content */}
      <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

      {/* Images */}
      {post.all_images && post.all_images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.imagesContainer}
          pagingEnabled
        >
          {post.all_images.map((img, index) => (
            <TouchableOpacity key={index} activeOpacity={0.9}>
              <Image
                source={{ uri: img.url }}
                style={styles.postImage}
                resizeMode="cover"
              />
              {post.all_images.length > 1 && (
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {index + 1} / {post.all_images.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Stats */}
      <View style={[styles.statsContainer, { 
        borderTopColor: colors.border, 
        borderBottomColor: colors.border 
      }]}>
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
        <View style={styles.stat}>
          <Ionicons name="share-social-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {shareCount} shares
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
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {post.comment_count > 0 ? post.comment_count : 'Comment'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={26} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {shareCount > 0 ? shareCount : 'Share'}
          </Text>
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
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userTextInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  imagesContainer: {
    marginVertical: 8,
  },
  postImage: {
    width: 350,
    height: 350,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 8,
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
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PostDetailScreen;