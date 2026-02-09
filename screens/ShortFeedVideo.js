import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Dimensions, 
  Platform,
  Pressable,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Feather';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

const { width, height } = Dimensions.get('window');

const API_URL = API_ROUTE;
const PLAYBACK_RATE = 1;

// Video Player Component
const VideoPlayer = ({ uri, isPlaying, onPress, style }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when URI changes
    setIsLoading(true);
    setHasError(false);
  }, [uri]);

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
        repeat={true}
        muted={true}
        paused={!isPlaying}
        rate={PLAYBACK_RATE}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onReadyForDisplay={() => setIsLoading(false)}
      />
      
      {isLoading && (
        <View style={styles.videoLoading}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
      
      {hasError && (
        <View style={styles.videoError}>
          <Icon name="alert-circle" size={24} color="#fff" />
          <Text style={styles.errorText}>Video failed to load</Text>
        </View>
      )}
      
      {!isPlaying && !isLoading && !hasError && (
        <View style={styles.playOverlay}>
          <View style={styles.playIconContainer}>
            <MaterialIcon name="play-arrow" size={32} color="#fff" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Main HomePage Component
const HomePageShortsRow = ({navigation}) => {
  const { colors, isDark } = useTheme();
  const [shorts, setShorts] = useState([]);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReplyModalVisible, setReplyModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState({});
  const [likedShorts, setLikedShorts] = useState({});
  const [savedShorts, setSavedShorts] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [viewableItems, setViewableItems] = useState([]);
  
  const scrollViewRef = useRef(null);
  const modalVideoRef = useRef(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 500,
  });

  // Handle viewable items change
  const onViewableItemsChanged = useCallback(({ viewableItems: items }) => {
    if (items.length > 0) {
      // Get the most centered item
      const centeredItem = items[0];
      setPlayingVideoId(centeredItem.item.id);
      
      // Store all viewable items for reference
      setViewableItems(items.map(item => item.item.id));
    } else {
      setPlayingVideoId(null);
      setViewableItems([]);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged }
  ]);

  // Get auth header
  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Fetch shorts for the row
  const fetchShorts = useCallback(async () => {
    try {
      setShorts([]);
      
      try {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API_URL}/shorts/?limit=3`, { headers });

        if (response.status === 200) {
          let processedShorts = response.data.slice(0, 3);
          processedShorts = processedShorts.sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));

          setShorts(processedShorts);
          
          const likedState = {};
          const savedState = {};
          
          processedShorts.forEach((short) => {
            likedState[short.id] = short.is_liked || false;
            savedState[short.id] = short.is_saved || false;
          });
          
          setLikedShorts(likedState);
          setSavedShorts(savedState);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
      }
    } catch (error) {
      console.error('Fetch Shorts Error:', error);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);

  // Format views
  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  // Get time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return 'Over a month ago';
  };

  // Open modal with selected short
  const openModal = (short) => {
    setSelectedShort({...short});
    setModalVisible(true);
    setIsMuted(false);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedShort(null);
  };

  // Toggle mute in modal
  const toggleModalMute = () => {
    setIsMuted(!isMuted);
  };

  // Like short in modal
  const likeShort = async (shortId) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyLiked = likedShorts[shortId];
      
      setLikedShorts(prev => ({
        ...prev,
        [shortId]: !isCurrentlyLiked,
      }));
      
      if (!isCurrentlyLiked) {
        await axios.post(`${API_URL}/shorts/${shortId}/like/`, {}, { headers });
      } else {
        await axios.post(`${API_URL}/shorts/${shortId}/unlike/`, {}, { headers });
      }
      
      // Update like count in local state
      setShorts(prev => prev.map(short => {
        if (short.id === shortId) {
          return {
            ...short,
            like_count: isCurrentlyLiked 
              ? (short.like_count || 1) - 1 
              : (short.like_count || 0) + 1
          };
        }
        return short;
      }));
      
      // Update selected short if in modal
      if (selectedShort && selectedShort.id === shortId) {
        setSelectedShort(prev => ({
          ...prev,
          like_count: isCurrentlyLiked 
            ? (prev.like_count || 1) - 1 
            : (prev.like_count || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Like error:', error);
      setLikedShorts(prev => ({
        ...prev,
        [shortId]: likedShorts[shortId],
      }));
    }
  };

  // Save short in modal
  const saveShort = async (shortId) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlySaved = savedShorts[shortId];
      
      setSavedShorts(prev => ({
        ...prev,
        [shortId]: !isCurrentlySaved,
      }));
      
      if (!isCurrentlySaved) {
        await axios.post(`${API_URL}/shorts/${shortId}/save/`, {}, { headers });
      } else {
        await axios.post(`${API_URL}/shorts/${shortId}/unsave/`, {}, { headers });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSavedShorts(prev => ({
        ...prev,
        [shortId]: savedShorts[shortId],
      }));
    }
  };

  // Share short
  const shareShort = async (short) => {
    try {
      const shareUrl = `https://example.com/short/${short.id}`;
      await Clipboard.setString(shareUrl);
      Alert.alert('Success', 'Link copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  // Fetch comments for modal
  const fetchCommentsForShort = async (shortId) => {
    try {
      const headers = await getAuthHeader();
      const response = await axios.get(
        `${API_URL}/shorts/${shortId}/comments/`,
        { headers }
      );
      
      if (response.status === 200) {
        const comments = response.data.results || response.data;
        setSelectedShort(prev => ({
          ...prev,
          comments: comments,
        }));
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
    }
  };

  // Post comment in modal
  const postComment = async () => {
    if (!commentText.trim() || !selectedShort) return;
    
    try {
      const headers = await getAuthHeader();
      const response = await axios.post(
        `${API_URL}/shorts/${selectedShort.id}/comments/`,
        { text: commentText },
        { headers }
      );
      
      if (response.status === 201) {
        setCommentText('');
        fetchCommentsForShort(selectedShort.id);
      }
    } catch (error) {
      console.error('Post comment error:', error);
    }
  };

  // Like comment in modal
  const likeComment = async (commentId) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyLiked = likedComments[commentId];
      
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !isCurrentlyLiked,
      }));
      
      if (!isCurrentlyLiked) {
        await axios.post(`${API_URL}/comments/${commentId}/like/`, {}, { headers });
      } else {
        await axios.post(`${API_URL}/comments/${commentId}/unlike/`, {}, { headers });
      }
    } catch (error) {
      console.error('Like comment error:', error);
      setLikedComments(prev => ({
        ...prev,
        [commentId]: likedComments[commentId],
      }));
    }
  };

  // Video Card Component
  const VideoCard = memo(({ item, index }) => {
    const [isPressed, setIsPressed] = useState(false);
    const isPlaying = playingVideoId === item.id;
    
    const handleCardPress = () => {
      openModal(item);
    };

    const handleVideoPress = () => {
      openModal(item);
    };

    return (
      <Pressable 
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={handleCardPress}
        style={[
          styles.videoCardContainer,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          isPressed && styles.cardPressed
        ]}
      >
        {/* Video Player */}
        <VideoPlayer
          uri={item.video}
          isPlaying={isPlaying}
          onPress={handleVideoPress}
          style={styles.videoPlayer}
        />
        
        {/* Minimal Overlay - Only show on hover/tap */}
        <View style={styles.minimalOverlay}>
          {/* Only show minimal info */}
          <View style={styles.minimalInfo}>
            <View style={styles.minimalStats}>
              <View style={styles.statItem}>
                <Icon name="eye" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.miniStatText}>{formatViews(item.views || 0)}</Text>
              </View>
              {isPlaying && (
                <View style={[styles.playingIndicator, { backgroundColor: colors.primary }]}>
                  <Text style={styles.playingText}>LIVE</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Tap to watch overlay */}
          <View style={styles.tapToWatchOverlay}>
            <Text style={styles.tapToWatchText}>Tap to watch</Text>
          </View>
        </View>
        
        {/* Expand Button */}
        <TouchableOpacity 
          style={[styles.expandButton, { backgroundColor: colors.card + 'CC' }]}
          onPress={handleCardPress}
        >
          <Icon name="maximize-2" size={16} color={colors.text} />
        </TouchableOpacity>
      </Pressable>
    );
  });

  // Render modal with full content
  const renderModal = () => {
    if (!selectedShort) return null;
    
    const isLiked = likedShorts[selectedShort.id] || false;
    const isSaved = savedShorts[selectedShort.id] || false;
    const profilePic = selectedShort.user?.profile_picture 
      ? `${API_ROUTE_IMAGE}${selectedShort.user.profile_picture}` 
      : null;
    const username = selectedShort.user?.username || 'user';
    const createdDate = selectedShort.created_at 
      ? new Date(selectedShort.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
      : '';

    return (
      <Modal
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header with close and watch more */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeModal}
              style={[styles.modalHeaderButton, { backgroundColor: colors.card + 'CC' }]}
            >
              <Icon name="x" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              E-Vibes Short
            </Text>
            
            <TouchableOpacity
              style={[styles.watchMoreButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                closeModal();
               
                navigation.navigate('SocialHome');
              }}
            >
              <Text style={styles.watchMoreText}>Watch More</Text>
              <Icon name="play" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Modal content */}
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Left side - Video */}
            <View style={styles.videoContainer}>
              <Video
                ref={modalVideoRef}
                source={{ uri: selectedShort.video }}
                style={styles.video}
                resizeMode="contain"
                repeat={true}
                muted={isMuted}
                rate={PLAYBACK_RATE}
                paused={false}
              />
              
              {/* Video controls */}
              <View style={styles.videoControls}>
                {/* Progress bar */}
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressFill, { backgroundColor: colors.primary }]} />
                </View>
                
                {/* Volume control */}
                <TouchableOpacity 
                  onPress={toggleModalMute}
                  style={[styles.volumeButton, { backgroundColor: colors.card + 'CC' }]}
                >
                  <Icon name={isMuted ? "volume-x" : "volume-2"} size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Right side - Content and reactions */}
            <View style={[styles.rightPanel, { backgroundColor: colors.card }]}>
              {/* User info */}
              <View style={[styles.userInfo, { borderBottomColor: colors.border }]}>
                <View style={styles.userHeader}>
                  <View style={styles.userDetails}>
                    {profilePic ? (
                      <Image
                        source={{ uri: profilePic }}
                        style={styles.profilePic}
                      />
                    ) : (
                      <View style={[styles.profilePicPlaceholder, { backgroundColor: colors.primary }]}>
                        <Text style={styles.profilePicText}>
                          {username[0]?.toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.userInfoText}>
                      <Text style={[styles.username, { color: colors.text }]}>@{username}</Text>
                      <View style={styles.stats}>
                        <View style={styles.statItem}>
                          <Icon name="eye" size={14} color={colors.textSecondary} />
                          <Text style={[styles.statText, { color: colors.textSecondary }]}>
                            {formatViews(selectedShort.views || 0)} views
                          </Text>
                        </View>
                        {selectedShort.created_at && (
                          <View style={styles.statItem}>
                            <Icon name="clock" size={14} color={colors.textSecondary} />
                            <Text style={[styles.statText, { color: colors.textSecondary }]}>
                              {createdDate}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.followButton, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.followText, { color: '#fff' }]}>Follow</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Caption */}
                {selectedShort.caption && (
                  <Text style={[styles.caption, { color: colors.text }]}>
                    {selectedShort.caption}
                  </Text>
                )}
              </View>
              
              {/* Reactions section */}
              <View style={[styles.reactions, { borderBottomColor: colors.border }]}>
                <View style={styles.reactionsGrid}>
                  {/* Like */}
                  <View style={styles.reactionItem}>
                    <TouchableOpacity
                      onPress={() => likeShort(selectedShort.id)}
                      style={[styles.reactionButton, { backgroundColor: colors.backgroundSecondary }]}
                    >
                      <IonicIcon 
                        name={isLiked ? "heart" : "heart-outline"}
                        size={24} 
                        color={isLiked ? "#ff0050" : colors.textSecondary}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.reactionCount, { color: colors.text }]}>
                      {selectedShort.like_count || 0}
                    </Text>
                    <Text style={[styles.reactionLabel, { color: colors.textSecondary }]}>
                      Likes
                    </Text>
                  </View>

                  {/* Comment */}
                  <View style={styles.reactionItem}>
                    <TouchableOpacity
                      onPress={() => {
                        setReplyModalVisible(true);
                        fetchCommentsForShort(selectedShort.id);
                      }}
                      style={[styles.reactionButton, { backgroundColor: colors.backgroundSecondary }]}
                    >
                      <Icon name="message-circle" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={[styles.reactionCount, { color: colors.text }]}>
                      {selectedShort.comment_count || 0}
                    </Text>
                    <Text style={[styles.reactionLabel, { color: colors.textSecondary }]}>
                      Comments
                    </Text>
                  </View>

                 

                  {/* Share */}
                  <View style={styles.reactionItem}>
                    <TouchableOpacity
                      onPress={() => shareShort(selectedShort)}
                      style={[styles.reactionButton, { backgroundColor: colors.backgroundSecondary }]}
                    >
                      <Icon name="share-2" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={[styles.reactionCount, { color: colors.text }]}>
                      Share
                    </Text>
                    <Text style={[styles.reactionLabel, { color: colors.textSecondary }]}>
                      &nbsp;
                    </Text>
                  </View>
                </View>
              </View>
              
              
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Render comments modal
  const renderCommentsModal = () => {
    if (!selectedShort) return null;

    const getCommentUser = (comment) => {
      if (typeof comment.user === 'string') {
        const username = comment.user.split('@')[0];
        return {
          username: username,
          profile_picture: null
        };
      }
      
      if (comment.user && !comment.user.username) {
        return {
          username: comment.user.email ? comment.user.email.split('@')[0] : 'Unknown',
          profile_picture: comment.user.profile_picture || null
        };
      }
      
      return comment.user || { username: 'Unknown', profile_picture: null };
    };

    return (
      <Modal
        visible={isReplyModalVisible}
        animationType="slide"
        onRequestClose={() => setReplyModalVisible(false)}
      >
        <View style={[styles.commentsContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.commentsHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.commentsTitle, { color: colors.text }]}>
              {selectedShort.comment_count || 0} Comments
            </Text>
            <TouchableOpacity
              onPress={() => {
                setReplyModalVisible(false);
                setCommentText('');
              }}
              style={[styles.commentsClose, { backgroundColor: colors.backgroundSecondary }]}
            >
              <Icon name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.commentsList}>
            {selectedShort.comments?.length > 0 ? (
              selectedShort.comments.map(cmt => {
                const commentUser = getCommentUser(cmt);
                const isLiked = likedComments[cmt.id] || false;
                const profilePic = commentUser.profile_picture 
                  ? `${API_ROUTE_IMAGE}${commentUser.profile_picture}` 
                  : null;
                const time = new Date(cmt.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                
                return (
                  <View 
                    key={cmt.id} 
                    style={[styles.commentItem, { 
                      backgroundColor: colors.card,
                      borderColor: colors.border 
                    }]}
                  >
                    <View style={styles.commentHeader}>
                      <View style={styles.commentUser}>
                        {profilePic ? (
                          <Image
                            source={{ uri: profilePic }}
                            style={styles.commentProfile}
                          />
                        ) : (
                          <View style={[styles.commentProfilePlaceholder, { backgroundColor: colors.primary }]}>
                            <Text style={styles.commentProfileText}>
                              {commentUser.username?.[0]?.toUpperCase() || 'U'}
                            </Text>
                          </View>
                        )}
                        <View>
                          <Text style={[styles.commentUsername, { color: colors.text }]}>
                            @{commentUser.username}
                          </Text>
                          <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
                            {time}
                          </Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        onPress={() => likeComment(cmt.id)}
                        style={styles.commentLike}
                      >
                        <IonicIcon 
                          name={isLiked ? "heart" : "heart-outline"}
                          size={18} 
                          color={isLiked ? "#ff0050" : colors.textSecondary}
                        />
                        <Text style={[styles.commentLikeCount, { color: colors.textSecondary }]}>
                          {cmt.likes_count || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.commentText, { color: colors.text }]}>
                      {cmt.text}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.noComments}>
                <Icon name="message-circle" size={64} color={colors.border} />
                <Text style={[styles.noCommentsTitle, { color: colors.text }]}>
                  No comments yet
                </Text>
                <Text style={[styles.noCommentsText, { color: colors.textSecondary }]}>
                  Be the first to comment!
                </Text>
              </View>
            )}
          </ScrollView>
          
          {/* Comment input */}
          <View style={[styles.commentInput, { borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text 
              }]}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={() => commentText.trim() && postComment()}
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              onPress={postComment}
              disabled={!commentText.trim()}
              style={[
                styles.sendButton, 
                { backgroundColor: colors.primary },
                !commentText.trim() && { backgroundColor: colors.border }
              ]}
            >
              <Icon name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleSection}>
        <View>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            E-Vibes for You
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Trending short videos
          </Text>
        </View>

        <TouchableOpacity onPress={()=>navigation.navigate('SocialHome')}
          style={[styles.viewAllButton, { backgroundColor: colors.primary + '20' }]}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All
          </Text>
          <Icon name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Horizontal scroll row with viewability tracking */}
      <ScrollView 
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        snapToInterval={width * 0.7 + 16}
        decelerationRate="fast"
        snapToAlignment="start"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onScrollToIndexFailed={() => {}}
      >
        {shorts.map((item, index) => (
          <VideoCard key={item.id} item={item} index={index} />
        ))}
        
        {/* Loading state */}
        {shorts.length === 0 && (
          <View style={styles.loadingRow}>
            {[1, 2, 3].map(i => (
              <View 
                key={i} 
                style={[
                  styles.loadingItem, 
                  { backgroundColor: colors.backgroundSecondary }
                ]} 
              />
            ))}
          </View>
        )}
      </ScrollView>
      
      {/* Modal for full view */}
      {renderModal()}
      
      {/* Comments Modal */}
      {renderCommentsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  
  // Title section
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 8,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Video card container
  videoCardContainer: {
    width: width * 0.7,
    height: 400,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  
  // Video player
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  videoPlayer: {
    flex: 1,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Minimal overlay
  minimalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 12,
  },
  minimalInfo: {
    alignItems: 'flex-start',
  },
  minimalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniStatText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  playingIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  playingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Tap to watch
  tapToWatchOverlay: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  tapToWatchText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Expand button
  expandButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Row layout
  row: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  
  // Loading state
  loadingRow: {
    flexDirection: 'row',
    gap: 16,
  },
  loadingItem: {
    width: width * 0.7,
    height: 400,
    borderRadius: 16,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalHeaderButton: {
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  watchMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  watchMoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  modalContent: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControls: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '33%',
  },
  volumeButton: {
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Right panel
  rightPanel: {
    width: Platform.OS === 'web' ? 400 : '100%',
    height: Platform.OS === 'web' ? '100%' : '50%',
  },
  userInfo: {
    padding: 24,
    borderBottomWidth: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    resizeMode: 'cover',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profilePicPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userInfoText: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statText: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    fontWeight: '600',
    fontSize: 12,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Reactions
  reactions: {
    padding: 24,
    borderBottomWidth: 1,
  },
  reactionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reactionItem: {
    alignItems: 'center',
  },
  reactionButton: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  reactionLabel: {
    fontSize: 11,
  },
  
  // More actions
  moreActions: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Comments modal
  commentsContainer: {
    flex: 1,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  commentsClose: {
    padding: 8,
    borderRadius: 20,
  },
  commentsList: {
    flex: 1,
    padding: 20,
  },
  commentItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentProfile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    resizeMode: 'cover',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  commentProfilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentProfileText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentUsername: {
    fontWeight: '600',
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeCount: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  noCommentsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  noCommentsText: {
    fontSize: 14,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
  },
  sendButton: {
    borderRadius: 25,
    padding: 14,
  },
  sendDisabled: {
    opacity: 0.5,
  },
});

export default HomePageShortsRow;