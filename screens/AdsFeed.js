import React, { useState, useEffect, useRef, useCallback,memo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Linking, 
  StyleSheet, 
  ActivityIndicator,
  Dimensions,
  Pressable
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext'; 
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

const { width } = Dimensions.get('window');

// Video Player Component
const AdVideoPlayer = ({ uri, isPlaying, onPress, style }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [uri]);

  const handleProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const handleLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
        repeat={false}
        muted={true}
        paused={!isPlaying}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onEnd={() => setIsPlaying(false)}
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
      
      {/* Play Overlay */}
      {!isPlaying && !isLoading && !hasError && (
        <View style={styles.playOverlay}>
          <View style={styles.playIconContainer}>
            <MaterialIcon name="play-arrow" size={28} color="#fff" />
          </View>
        </View>
      )}
      
      {/* Progress Bar */}
      {isPlaying && !isLoading && !hasError && duration > 0 && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentTime / duration) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      )}
      
      {/* Video Badge */}
      <View style={styles.videoBadge}>
        <MaterialIcon name="videocam" size={10} color="white" />
        <Text style={styles.badgeText}>VIDEO</Text>
      </View>
      
      {/* Sponsored Badge */}
      <View style={styles.sponsoredBadge}>
        <Icon name="dollar-sign" size={10} color="white" />
        <Text style={styles.badgeText}>SPONSORED</Text>
      </View>
    </TouchableOpacity>
  );
};

const AdRow = ({ limit = 3, showHeader = true }) => {
  const { colors, isDark } = useTheme();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [viewableItems, setViewableItems] = useState([]);
  
  const scrollViewRef = useRef(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 300,
  });

  // Handle viewable items change
  const onViewableItemsChanged = useCallback(({ viewableItems: items }) => {
    if (items.length > 0) {
      // Find the first video ad in viewable items
      const videoAd = items.find(item => item.item.media_type === 'VIDEO');
      if (videoAd) {
        setPlayingVideoId(videoAd.item.id);
      } else {
        setPlayingVideoId(null);
      }
      setViewableItems(items.map(item => item.item.id));
    } else {
      setPlayingVideoId(null);
      setViewableItems([]);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged }
  ]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/ads/active/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const activeAds = response.data
        .filter(ad => ad.status === 'ACTIVE' || ad.status === 'APPROVED')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);
      
      setAds(activeAds);
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load ads');
      setAds([]); 
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (amount) => {
    return `₦${parseInt(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCTAText = (cta) => {
    switch (cta) {
      case 'SIGN_UP': return 'Sign Up';
      case 'SHOP_NOW': return 'Shop Now';
      case 'LEARN_MORE': return 'Learn More';
      case 'CONTACT_US': return 'Contact Us';
      case 'DOWNLOAD': return 'Download';
      case 'SUBSCRIBE': return 'Subscribe';
      case 'VISIT': return 'Visit Website';
      case 'FOLLOW': return 'Follow';
      default: return 'Learn More';
    }
  };

  const getObjectiveColor = (objective) => {
    switch (objective) {
      case 'AWARENESS': return { 
        backgroundColor: isDark ? '#1E40AF20' : '#EFF6FF', 
        color: isDark ? '#93C5FD' : '#1D4ED8' 
      };
      case 'CONVERSION': return { 
        backgroundColor: isDark ? '#16653420' : '#F0FDF4', 
        color: isDark ? '#86EFAC' : '#15803D' 
      };
      case 'ENGAGEMENT': return { 
        backgroundColor: isDark ? '#6D28D920' : '#F5F3FF', 
        color: isDark ? '#C4B5FD' : '#6D28D9' 
      };
      default: return { 
        backgroundColor: isDark ? '#37415120' : '#F3F4F6', 
        color: isDark ? '#9CA3AF' : '#374151' 
      };
    }
  };

  const handlePlayVideo = (adId) => {
    if (playingVideoId === adId) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(adId);
    }
  };

  // Ad Card Component
  const AdCard = memo(({ ad, index }) => {
    const [isPressed, setIsPressed] = useState(false);
    const isPlaying = playingVideoId === ad.id;
    const objectiveStyle = getObjectiveColor(ad.objective);
    const profilePic = ad.advertiser_profile_picture 
      ? `${API_ROUTE_IMAGE}/media/${ad.advertiser_profile_picture}` 
      : null;

    const handleCardPress = () => {
      if (ad.link) {
        Linking.openURL(ad.link);
      }
    };

    const handleVideoPress = () => {
      if (ad.media_type === 'VIDEO') {
        handlePlayVideo(ad.id);
      } else if (ad.link) {
        Linking.openURL(ad.link);
      }
    };

    const getMediaTypeIcon = () => {
      if (ad.media_type === 'VIDEO') {
        return <MaterialIcon name="videocam" size={12} color={isDark ? '#C4B5FD' : '#7E22CE'} />;
      }
      return <Icon name="image" size={12} color={isDark ? '#93C5FD' : '#1D4ED8'} />;
    };

    return (
      <Pressable 
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={handleCardPress}
        style={[
          styles.adCard,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          isPressed && styles.cardPressed
        ]}
      >
        {/* Ad Header */}
        <View style={[styles.adHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.advertiserInfo}>
            <View style={styles.avatarContainer}>
              {profilePic ? (
                <Image 
                  source={{ uri: profilePic }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>
                    {ad.advertiser_name?.charAt(0)?.toUpperCase() || 'A'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.advertiserDetails}>
              <Text style={[styles.advertiserName, { color: colors.text }]}>
                {ad.advertiser_name}
              </Text>
              <View style={styles.locationContainer}>
                <MaterialIcon name="my-location" size={12} color={colors.textSecondary} />
                <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                  {ad.targeting?.location || 'Multiple locations'}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.objectiveTag, { 
            backgroundColor: objectiveStyle.backgroundColor,
            borderColor: objectiveStyle.color + '40'
          }]}>
            <Text style={[styles.objectiveText, { color: objectiveStyle.color }]}>
              {ad.objective?.replace('_', ' ')}
            </Text>
          </View>
        </View>

        {/* Media Section */}
        <View style={styles.mediaContainer}>
          {ad.media_type === 'VIDEO' && ad.media_url ? (
            <AdVideoPlayer
              uri={ad.media_url}
              isPlaying={isPlaying}
              onPress={handleVideoPress}
              style={styles.media}
            />
          ) : ad.media_type === 'IMAGE' && ad.media_url ? (
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={handleCardPress}
              style={styles.imageWrapper}
            >
              <Image 
                source={{ uri: ad.media_url }}
                style={styles.image}
              />
              
              {/* Image Overlay */}
              <View style={styles.imageOverlay}>
                <View style={styles.overlayContent}>
                  <Icon name="image" size={20} color="white" />
                  <Text style={styles.overlayText}>Click to view</Text>
                </View>
              </View>
              
              {/* Sponsored Badge */}
              <View style={styles.sponsoredBadge}>
                
                <Text style={styles.badgeText}>SPONSORED</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.placeholderMedia, { backgroundColor: colors.backgroundSecondary }]}>
              {ad.media_type === 'VIDEO' ? (
                <MaterialIcon name="videocam" size={48} color={colors.textSecondary} />
              ) : (
                <Icon name="image" size={48} color={colors.textSecondary} />
              )}
              <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                {ad.media_type === 'VIDEO' ? 'Video' : 'Image'} Ad
              </Text>
              <View style={[styles.sponsoredBadgePlaceholder, { backgroundColor: colors.primary + 'CC' }]}>
                <Text style={styles.badgeText}>SPONSORED</Text>
              </View>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.textSection}>
            <Text style={[styles.headline, { color: colors.text }]} numberOfLines={1}>
              {ad.headline}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
              {ad.description}
            </Text>
          </View>

          {/* Media Type & Stats */}
          <View style={styles.indicators}>
            <View style={[
              styles.mediaTypeTag, 
              ad.media_type === 'VIDEO' 
                ? { 
                    backgroundColor: isDark ? '#6D28D920' : '#F3E8FF',
                    borderColor: isDark ? '#C4B5FD40' : '#7E22CE40'
                  }
                : { 
                    backgroundColor: isDark ? '#1E40AF20' : '#EFF6FF',
                    borderColor: isDark ? '#93C5FD40' : '#1D4ED840'
                  }
            ]}>
              {getMediaTypeIcon()}
              <Text style={[
                styles.tagText, 
                { 
                  color: ad.media_type === 'VIDEO' 
                    ? (isDark ? '#C4B5FD' : '#7E22CE')
                    : (isDark ? '#93C5FD' : '#1D4ED8')
                }
              ]}>
                {ad.media_type === 'VIDEO' ? 'Video' : 'Image'} Ad
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          

          {/* CTA Button */}
          <View style={[styles.actionSection, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              onPress={() => ad.link && Linking.openURL(ad.link)}
              style={[
                styles.ctaButton, 
                { backgroundColor: colors.primary },
                !ad.link && styles.ctaDisabled
              ]}
              disabled={!ad.link}
            >
              <Text style={styles.ctaText}>{getCTAText(ad.cta)}</Text>
              <Icon name="external-link" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <View style={styles.titleSection}>
          {showHeader && (
            <>
              <Text style={[styles.mainTitle, { color: colors.text }]}>Sponsored Content</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Premium advertisements
              </Text>
            </>
          )}
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.loadingScroll}
        >
          {[...Array(limit)].map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.loadingItem, 
                { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border 
                }
              ]} 
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleSection}>
        <View>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Sponsored Content
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Premium advertisements
          </Text>
        </View>

        
      </View>

      {/* Ads Carousel */}
      <ScrollView 
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={width * 0.85 + 16}
        decelerationRate="fast"
        snapToAlignment="start"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      >
        {ads.map((ad, index) => (
          <AdCard key={ad.id} ad={ad} index={index} />
        ))}
      </ScrollView>

      {/* Scroll Indicators */}
      {ads.length > 1 && (
        <View style={styles.scrollIndicators}>
          {ads.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.indicatorDot, 
                { backgroundColor: colors.textSecondary + '40' }
              ]} 
            />
          ))}
        </View>
      )}
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
  
  // Ad card
  adCard: {
    width: width * 0.85,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  
  // Ad header
  adHeader: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  advertiserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  advertiserDetails: {
    flex: 1,
  },
  advertiserName: {
    fontWeight: '600',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
  },
  objectiveTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  objectiveText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Media container
  mediaContainer: {
    height: 200,
    overflow: 'hidden',
  },
  media: {
    flex: 1,
  },
  
  // Video player
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
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
    width: 52,
    height: 52,
    borderRadius: 26,
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
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  timeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    textAlign: 'center',
  },
  
  // Image styles
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  overlayContent: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overlayText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Badges
  videoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sponsoredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  
  // Placeholder media
  placeholderMedia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    marginTop: 8,
  },
  sponsoredBadgePlaceholder: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  // Content section
  content: {
    padding: 16,
  },
  textSection: {
    marginBottom: 12,
  },
  headline: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  
  // Indicators
  indicators: {
    marginBottom: 16,
  },
  mediaTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  
  // Action section
  actionSection: {
    paddingTop: 12,
    borderTopWidth: 1,
  },
  ctaButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Scroll content
  scrollContent: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  
  // Scroll indicators
  scrollIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  // Loading states
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  loadingScroll: {
    paddingBottom: 8,
  },
  loadingItem: {
    width: width * 0.85,
    height: 380,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});

export default AdRow;