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
  ActivityIndicator,
  Animated
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Feather';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const API_URL = API_ROUTE;
const PLAYBACK_RATE = 1;
const AUTO_PLAY_DURATION = 7000; // 7 seconds auto-play

// Initialize MMKV storage
const storage = createMMKV({
  id: 'shorts-row-storage',
});

// Cache keys
const SHORTS_CACHE_KEY = 'shorts_row_cache_v2';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// Video Player Component - Auto-Play with Tap to Pause
const VideoPlayer = memo(({ 
  uri, 
  isPlaying, 
  onPress, 
  style, 
  onVideoEnd,
  onTogglePlay,
  colors 
}) => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTapToWatch, setShowTapToWatch] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setShowTapToWatch(false);
      setIsPaused(false);
    }
  }, [isPlaying]);

  const handleProgress = (data) => {
    if (data.seekableDuration) {
      const currentProgress = data.currentTime / data.seekableDuration;
      setProgress(currentProgress);
    }
    
    // Auto-pause after 7 seconds
    if (data.currentTime >= AUTO_PLAY_DURATION / 1000 && isPlaying && !isPaused) {
      setShowTapToWatch(true);
      setIsPaused(true);
      if (onVideoEnd) onVideoEnd();
    }
  };

  const handleError = () => {
    setHasError(true);
  };

  const handleTogglePlay = () => {
    setIsPaused(!isPaused);
    setShowTapToWatch(false);
    if (onTogglePlay) onTogglePlay();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={handleTogglePlay}
      style={[style, styles.videoPlayerContainer, { backgroundColor: colors.backgroundSecondary }]}
    >
      {!hasError ? (
        <>
          <Video
            ref={videoRef}
            source={{ uri }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            repeat={false}
            muted={true}
            paused={!isPlaying || isPaused}
            rate={PLAYBACK_RATE}
            onError={handleError}
            onProgress={handleProgress}
            onEnd={() => {
              setShowTapToWatch(true);
              setIsPaused(true);
              if (onVideoEnd) onVideoEnd();
            }}
            bufferConfig={{
              minBufferMs: 1500,
              maxBufferMs: 5000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
          />
          
          {/* Progress Bar */}
          {isPlaying && !isPaused && !hasError && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarTrack, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${progress * 100}%`,
                      backgroundColor: colors.primary 
                    }
                  ]} 
                />
              </View>
            </View>
          )}
          
          {/* Tap to Watch Overlay - Shows after auto-play ends */}
          {(showTapToWatch || (isPaused && !isPlaying)) && !hasError && (
            <View style={styles.tapToWatchOverlay}>
              <Animated.View style={styles.tapToWatchContainer}>
                <View style={[styles.tapToWatchButton, { backgroundColor: 'rgba(0,0,0,0.75)' }]}>
                  <Icon name="play-circle" size={40} color="#fff" />
                  <Text style={styles.tapToWatchText}>
                    {showTapToWatch ? 'Tap to play again' : 'Tap to play'}
                  </Text>
                </View>
              </Animated.View>
            </View>
          )}
          
          {/* Play Overlay - Shows when video is paused */}
          {!isPlaying && !hasError && !showTapToWatch && !isPaused && (
            <View style={styles.playOverlay}>
              <View style={styles.playIconContainer}>
                <Icon name="play" size={32} color="#fff" />
              </View>
            </View>
          )}
          
        </>
      ) : (
        <View style={styles.videoError}>
          <Icon name="alert-circle" size={24} color="#fff" />
          <Text style={styles.errorText}>Video unavailable</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

// Video Card Component - Full Width
const VideoCard = memo(({ item, index, isPlaying, onPress, colors, onVideoEnd }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <Pressable 
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => onPress(item)}
      style={[
        styles.videoCardContainer,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: isPlaying ? colors.primary : '#000',
          shadowOpacity: isPlaying ? 0.3 : 0.15,
        },
        isPressed && styles.cardPressed
      ]}
    >
      <VideoPlayer
        uri={item.video}
        isPlaying={isPlaying}
        onPress={() => onPress(item)}
        onVideoEnd={() => {
          if (onVideoEnd) onVideoEnd(item.id);
        }}
        style={styles.videoPlayer}
        colors={colors}
      />
      
      {/* Overlay Content */}
      <View style={styles.minimalOverlay}>
        <View style={styles.minimalInfo}>
          <View style={styles.minimalStats}>
            {isPlaying && (
              <View style={[styles.playingIndicator, { backgroundColor: colors.primary }]}>
                <Text style={styles.playingText}>▶ PLAYING</Text>
              </View>
            )}
            {!isPlaying && (
              <View style={[styles.pausedIndicator, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
                <Text style={[styles.pausedText, { color: colors.text }]}>⏸ PAUSED</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.bottomOverlay}>
          <View style={styles.userInfo}>
            {item.user?.profile_picture ? (
              <Image
                source={{ uri: item.user.profile_picture }}
                style={styles.userAvatar}
              />
            ) : (
              <View style={[styles.userAvatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.userAvatarText}>
                  {item.user?.username?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <Text style={styles.userName} numberOfLines={1}>
              @{item.user?.username || 'user'}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="eye" size={14} color="#fff" />
              <Text style={styles.statText}>{item.views || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="heart" size={14} color="#fff" />
              <Text style={styles.statText}>{item.like_count || 0}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.expandButton, { backgroundColor: colors.card + 'CC' }]}
        onPress={() => onPress(item)}
      >
        <Icon name="maximize-2" size={16} color={colors.text} />
      </TouchableOpacity>
    </Pressable>
  );
});

// ============================================================
// MMKV CACHE FUNCTIONS
// ============================================================

const saveToMMKV = (key, data) => {
  try {
    storage.set(key, JSON.stringify({
      data: data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error(`❌ Error saving ${key} to MMKV:`, error);
  }
};

const getFromMMKV = (key) => {
  try {
    const cached = storage.getString(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      const { data, timestamp } = parsed;
      const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
      
      if (isCacheValid && data && data.length > 0) {
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error(`❌ Error getting ${key} from MMKV:`, error);
    return null;
  }
};

// Main Component
const HomePageShortsRow = () => {
  const navigation = useNavigation();
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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [videoEnded, setVideoEnded] = useState({});
  const [hasVideo, setHasVideo] = useState(false);
  
  const scrollViewRef = useRef(null);
  const modalVideoRef = useRef(null);
  const isMountedRef = useRef(true);
  const autoPlayTimer = useRef(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  });

  // ============================================================
  // FIX IMAGE URL
  // ============================================================
  const fixImageUrl = useCallback((url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/media/')) {
      return `${API_ROUTE_IMAGE}${url}`;
    }
    return `${API_ROUTE_IMAGE}${url}`;
  }, []);

  // ============================================================
  // LOAD FROM CACHE - MMKV
  // ============================================================
  const loadFromCache = useCallback(() => {
    try {
      const data = getFromMMKV(SHORTS_CACHE_KEY);
      if (data && data.length > 0) {
        setShorts(data);
        setHasLoadedOnce(true);
        setHasVideo(true);
        return true;
      }
    } catch (error) {
      console.error('❌ Error loading shorts from MMKV cache:', error);
    }
    return false;
  }, []);

  // ============================================================
  // GET AUTH HEADER
  // ============================================================
  const getAuthHeader = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, []);

  // ============================================================
  // FETCH SHORTS - ONLY ONE
  // ============================================================
  const fetchShorts = useCallback(async (forceRefresh = false) => {
    try {
      if (hasLoadedOnce && !forceRefresh) {
        return true;
      }

      const headers = await getAuthHeader();
      const response = await axios.get(`${API_URL}/shorts/?limit=1`, { 
        headers,
        timeout: 5000,
      });

      if (response.status === 200 && response.data.length > 0) {
        let processedShorts = response.data.slice(0, 1);
        
        processedShorts = processedShorts.map(short => ({
          ...short,
          user: {
            ...short.user,
            profile_picture: short.user?.profile_picture 
              ? fixImageUrl(short.user.profile_picture) 
              : null
          }
        }));

        setShorts(processedShorts);
        setHasLoadedOnce(true);
        setHasVideo(true);
        
        const likedState = {};
        const savedState = {};
        
        processedShorts.forEach((short) => {
          likedState[short.id] = short.is_liked || false;
          savedState[short.id] = short.is_saved || false;
        });
        
        setLikedShorts(likedState);
        setSavedShorts(savedState);

        saveToMMKV(SHORTS_CACHE_KEY, processedShorts);
        return true;
      }
    } catch (apiError) {
      console.error('❌ API Error:', apiError);
    }
    return false;
  }, [getAuthHeader, fixImageUrl, hasLoadedOnce]);

  // ============================================================
  // LOAD DATA
  // ============================================================
  const loadData = useCallback(async (forceRefresh = false) => {
    if (hasLoadedOnce && !forceRefresh) {
      return;
    }

    const hasCache = loadFromCache();
    
    if (!hasCache) {
      await fetchShorts(forceRefresh);
    } else {
      // Silently refresh in background
      fetchShorts(forceRefresh).catch(err => console.error('Background fetch error:', err));
    }
  }, [loadFromCache, fetchShorts, hasLoadedOnce]);

  // ============================================================
  // VIEWABILITY TRACKING - Auto-play when visible
  // ============================================================
  const onViewableItemsChanged = useCallback(({ viewableItems: items }) => {
    if (items.length > 0 && items[0]?.item) {
      const firstItem = items[0].item;
      // Auto-play when in view, regardless of videoEnded state
      setPlayingVideoId(firstItem.id);
      setViewableItems(items.map(item => item.item.id));
      // Reset video ended state when new video comes into view
      setVideoEnded(prev => ({ ...prev, [firstItem.id]: false }));
    } else {
      setPlayingVideoId(null);
      setViewableItems([]);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged }
  ]);

  // ============================================================
  // HANDLE VIDEO END
  // ============================================================
  const handleVideoEnd = useCallback((videoId) => {
    setVideoEnded(prev => ({ ...prev, [videoId]: true }));
    // Don't set playingVideoId to null - keep it showing the video
    // but in paused state with "Tap to play again" overlay
  }, []);

  // ============================================================
  // OPEN MODAL
  // ============================================================
  const openModal = useCallback((short) => {
    setSelectedShort({...short});
    setModalVisible(true);
    setIsMuted(false);
  }, []);

  // ============================================================
  // CLOSE MODAL
  // ============================================================
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedShort(null);
  }, []);

  // ============================================================
  // TOGGLE MUTE
  // ============================================================
  const toggleModalMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  // ============================================================
  // LIKE SHORT
  // ============================================================
  const likeShort = useCallback(async (shortId) => {
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
      
      if (selectedShort && selectedShort.id === shortId) {
        setSelectedShort(prev => ({
          ...prev,
          like_count: isCurrentlyLiked 
            ? (prev.like_count || 1) - 1 
            : (prev.like_count || 0) + 1
        }));
      }
    } catch (error) {
      console.error('❌ Like error:', error);
      setLikedShorts(prev => ({
        ...prev,
        [shortId]: likedShorts[shortId],
      }));
    }
  }, [getAuthHeader, likedShorts, selectedShort]);

  // ============================================================
  // SAVE SHORT
  // ============================================================
  const saveShort = useCallback(async (shortId) => {
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
      console.error('❌ Save error:', error);
      setSavedShorts(prev => ({
        ...prev,
        [shortId]: savedShorts[shortId],
      }));
    }
  }, [getAuthHeader, savedShorts]);

  // ============================================================
  // SHARE SHORT
  // ============================================================
  const shareShort = useCallback(async (short) => {
    try {
      const shareUrl = `https://example.com/short/${short.id}`;
      await Clipboard.setString(shareUrl);
      Alert.alert('Success', 'Link copied to clipboard!');
    } catch (error) {
      console.error('❌ Share error:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
  }, []);

  // ============================================================
  // POST COMMENT
  // ============================================================
  const postComment = useCallback(async () => {
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
        setSelectedShort(prev => ({
          ...prev,
          comments: [...(prev.comments || []), response.data],
          comment_count: (prev.comment_count || 0) + 1
        }));
      }
    } catch (error) {
      console.error('❌ Post comment error:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  }, [commentText, selectedShort, getAuthHeader]);

  // ============================================================
  // INITIAL LOAD
  // ============================================================
  useEffect(() => {
    loadData();
    return () => {
      isMountedRef.current = false;
      if (autoPlayTimer.current) {
        clearTimeout(autoPlayTimer.current);
      }
    };
  }, []);

  // ============================================================
  // FOCUS EFFECT
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      const checkCacheAndRefresh = () => {
        try {
          const cached = storage.getString(SHORTS_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
            if (!isCacheValid) {
              fetchShorts(true);
            }
          }
        } catch (error) {
          console.error('Error checking cache on focus:', error);
        }
      };
      
      checkCacheAndRefresh();
      
      return () => {};
    }, [fetchShorts])
  );

  // ============================================================
  // RENDER MODAL
  // ============================================================
  const renderModal = useCallback(() => {
    if (!selectedShort) return null;
    
    const isLiked = likedShorts[selectedShort.id] || false;
    const isSaved = savedShorts[selectedShort.id] || false;
    const profilePic = selectedShort.user?.profile_picture || null;
    const username = selectedShort.user?.username || 'user';

    return (
      <Modal
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeModal}
              style={[styles.modalHeaderButton, { backgroundColor: colors.card + 'CC' }]}
            >
              <Icon name="x" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Shorts
            </Text>
            
            <TouchableOpacity
              style={[styles.watchMoreButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                closeModal();
                navigation.navigate('SocialHome');
              }}
            >
              <Text style={styles.watchMoreText}>Explore</Text>
              <Icon name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
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
            </View>
          </View>
        </View>
      </Modal>
    );
  }, [selectedShort, isModalVisible, isMuted, likedShorts, savedShorts, colors, closeModal, navigation]);

  // ============================================================
  // RENDER COMMENTS MODAL
  // ============================================================
  const renderCommentsModal = useCallback(() => {
    if (!selectedShort) return null;

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
                const isLiked = likedComments[cmt.id] || false;
                const profilePic = cmt.user?.profile_picture || null;
                const username = cmt.user?.username || 'Unknown';
                
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
                              {username?.[0]?.toUpperCase() || 'U'}
                            </Text>
                          </View>
                        )}
                        <View>
                          <Text style={[styles.commentUsername, { color: colors.text }]}>
                            @{username}
                          </Text>
                          <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
                            {new Date(cmt.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                      </View>
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
  }, [selectedShort, isReplyModalVisible, commentText, likedComments, colors, postComment]);

  // ============================================================
  // RENDER
  // ============================================================
  const currentShort = shorts[0];

  // Don't render if no video
  if (!hasVideo && !shorts.length) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleSection}>
        <View>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Shorts
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Trending short videos
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('SocialHome')}
          style={[styles.viewAllButton, { backgroundColor: colors.primary + '20' }]}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            Explore
          </Text>
          <Icon name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        snapToInterval={width}
        decelerationRate="fast"
        snapToAlignment="start"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onScrollToIndexFailed={() => {}}
      >
        {currentShort ? (
          <VideoCard 
            key={currentShort.id} 
            item={currentShort} 
            index={0}
            isPlaying={playingVideoId === currentShort.id}
            onPress={openModal}
            onVideoEnd={handleVideoEnd}
            colors={colors}
          />
        ) : null}
      </ScrollView>
      
      {renderModal()}
      {renderCommentsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontWeight: '600',
    fontSize: 14,
  },
  
  videoCardContainer: {
    width: width,
    height: 320,
    borderRadius: 0,
    borderWidth: 0,
    overflow: 'hidden',
    marginHorizontal: 0,
    marginBottom: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },

  videoPlayerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  videoPlayer: {
    flex: 1,
  },
  videoLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
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
  
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
  },
  progressBarTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  
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
  playingIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  playingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  pausedIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pausedText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  bottomOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  userName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 100,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
  
  tapToWatchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapToWatchContainer: {
    alignItems: 'center',
  },
  tapToWatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tapToWatchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
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
  
  row: {
    paddingBottom: 8,
  },
  
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
    backgroundColor: '#000',
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
  
  // Comments modal styles
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
});

export default HomePageShortsRow;