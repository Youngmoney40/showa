
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  RefreshControl,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ROUTE } from '../api_routing/api';
import Signaling from './signaling';


const { width, height } = Dimensions.get('window');
const BRAND_COLORS = {
  primary: '#0066FF',
  primaryLight: '#0066FF',
  primaryDark: '#0047CC',
  secondary: '#0066FF',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const LivePage = ({ navigation }) => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  
  const signaling = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'gaming', label: 'Gaming', icon: 'game-controller' },
    { id: 'music', label: 'Music', icon: 'musical-notes' },
    { id: 'talk', label: 'Talk', icon: 'chatbubbles' },
    { id: 'creative', label: 'Creative', icon: 'color-palette' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = userDataString ? JSON.parse(userDataString) : null;
        setUserName(userData?.name || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch live streams =========================
  const fetchLiveStreams = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_ROUTE}/live-streams/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setLiveStreams(data);
      setFilteredStreams(data);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching live streams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fadeAnim]);

  // Filter streams based on search and category
  useEffect(() => {
    let results = liveStreams;
    
    if (searchQuery.trim()) {
      results = results.filter(stream =>
        stream.broadcaster_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(stream => 
        stream.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredStreams(results);
  }, [searchQuery, selectedCategory, liveStreams]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLiveStreams();
  }, [fetchLiveStreams]);

  // Initialize component
  useEffect(() => {
    fetchLiveStreams();
    signaling.current = new Signaling('live-page', onSignalingMessage);
    signaling.current.connect();

    return () => signaling.current?.close();
  }, [fetchLiveStreams]);

  const onSignalingMessage = useCallback((msg) => {
    if (msg?.type === 'live-stream-update') {
      setLiveStreams(prev => prev.map(stream =>
        stream.stream_id === msg.streamId
          ? { ...stream, viewer_count: msg.viewer_count, updated: true }
          : stream
      ));
    }
  }, []);

  const handleGoLive = useCallback(() => {
    if (!userName) {
      alert('Please set up your profile first');
      return;
    }
    navigation.navigate('Broadcaster', {
      roomName: `user-${userName}`,
      streamId: `stream-${userName}`,
    });
  }, [navigation, userName]);

  const navigateToViewer = useCallback((broadcasterName) => {
    navigation.navigate('Viewer', {
      roomName: `user-${broadcasterName}`,
      streamId: `stream-${broadcasterName}`,
      viewerId: 'viewer-1',
    });
  }, [navigation]);

  const toggleSearch = useCallback(() => {
    Animated.spring(searchAnim, {
      toValue: showSearch ? 0 : 1,
      useNativeDriver: false,
    }).start();
    setShowSearch(!showSearch);
    if (showSearch) setSearchQuery('');
  }, [showSearch]);


  const headerHeight = 200;
  const StreamCard = React.memo(({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    const startGlow = useCallback(() => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [glowAnim]);

    useEffect(() => {
      if (item.updated) {
        startGlow();
        setTimeout(() => {
          setLiveStreams(prev => prev.map(stream =>
            stream.stream_id === item.stream_id ? { ...stream, updated: false } : stream
          ));
        }, 800);
      }
    }, [item.updated, item.stream_id]);

    const broadcasterInitial = item.broadcaster_name?.charAt(0).toUpperCase() || 'U';

    return (
      <Animated.View
        style={[
          styles.streamCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            marginLeft: index % 2 === 0 ? 0 : 8,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigateToViewer(item.broadcaster_name)}>
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim,
              },
            ]}
          />

          <View style={styles.cardContainer}>
            {/* Stream Preview */}
            <View style={styles.previewContainer}>
              <LinearGradient
                colors={[BRAND_COLORS.primary, BRAND_COLORS.primaryLight]}
                style={styles.previewGradient}>
                <Icon name="videocam" size={32} color="rgba(255,255,255,0.9)" />
              </LinearGradient>
              
              {/* Live Badge */}
              <LinearGradient
                colors={[BRAND_COLORS.danger, '#f62a2aff']}
                style={styles.liveBadge}>
                <View style={styles.livePulse} />
                <Text style={styles.liveText}>LIVE</Text>
              </LinearGradient>

              {/* Viewer Count */}
              <View style={styles.viewerBadge}>
                <Icon name="people" size={12} color="#FFFFFF" />
                <Text style={styles.viewerCount}>
                  {item.viewer_count ? formatNumber(item.viewer_count) : '0'}
                </Text>
              </View>
            </View>

            {/* Stream Info */}
            <View style={styles.streamInfo}>
              <View style={styles.broadcasterRow}>
                {item.broadcaster_image ? (
                  <Image
                    source={{ uri: item.broadcaster_image }}
                    style={styles.broadcasterAvatar}
                  />
                ) : (
                  <LinearGradient
                    colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
                    style={styles.broadcasterAvatar}>
                    <Text style={styles.avatarText}>{broadcasterInitial}</Text>
                  </LinearGradient>
                )}
                <View style={styles.broadcasterInfo}>
                  <Text style={styles.broadcasterName} numberOfLines={1}>
                    {item.broadcaster_name}
                  </Text>
                  <Text style={styles.streamTitle} numberOfLines={1}>
                    {item.title || 'Just Chatting'}
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Icon name="heart" size={14} color={BRAND_COLORS.danger} />
                  <Text style={styles.statText}>
                    {item.likes ? formatNumber(item.likes) : '0'}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="chatbubble" size={14} color={BRAND_COLORS.secondary} />
                  <Text style={styles.statText}>
                    {item.comments ? formatNumber(item.comments) : '0'}
                  </Text>
                </View>
                <View style={[styles.statItem, styles.categoryBadge]}>
                  <Text style={styles.categoryText}>
                    {item.category || 'General'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonHeaderTop}>
          <View style={styles.skeletonBackButton} />
          <View style={styles.skeletonTitleContainer}>
            <View style={styles.skeletonTitle} />
            <View style={[styles.skeletonTitle, { width: '60%', height: 14 }]} />
          </View>
          <View style={styles.skeletonSearchButton} />
        </View>
      </View>
      <View style={styles.skeletonCategories} />
      <View style={styles.skeletonGrid}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.skeletonCard}>
            <View style={styles.skeletonPreview} />
            <View style={styles.skeletonInfo}>
              <View style={styles.skeletonAvatar} />
              <View style={styles.skeletonText}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '70%' }]} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[BRAND_COLORS.surface, BRAND_COLORS.background]}
        style={styles.emptyCard}>
        <View style={styles.emptyIconContainer}>
        </View>
        <Text style={styles.emptyTitle}>No Live Streams</Text>
        <Text style={styles.emptyText}>
          Be the first to go live and start streamingto your audience!
        </Text>
        
        <TouchableOpacity
          style={styles.goLiveButton}
          onPress={handleGoLive}>
          
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const searchBarHeight = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });

  const searchBarOpacity = searchAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  const searchBarMarginTop = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLORS.background} />
      <View style={styles.header}>
        <LinearGradient
          colors={[BRAND_COLORS.background, BRAND_COLORS.background]}
          style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" size={28} color={BRAND_COLORS.textPrimary} />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Live Streams</Text>
                <Text style={styles.headerSubtitle}>
                  Watch and connect in real-time
                </Text>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={toggleSearch}>
                <Icon name={showSearch ? 'close' : 'search'} size={24} color={BRAND_COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Animated.View style={[
              styles.searchContainer,
              {
                height: searchBarHeight,
                opacity: searchBarOpacity,
                marginTop: searchBarMarginTop,
              },
            ]}>
              <View style={styles.searchBar}>
                <Icon name="search" size={20} color={BRAND_COLORS.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search streams..."
                  placeholderTextColor={BRAND_COLORS.textTertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="close-circle" size={20} color={BRAND_COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      

      <FlatList
        data={filteredStreams}
        keyExtractor={(item) => item.stream_id}
        renderItem={({ item, index }) => <StreamCard item={item} index={index} />}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          filteredStreams.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
            tintColor={BRAND_COLORS.primary}
            progressBackgroundColor={BRAND_COLORS.surface}
          />
        }
        ListEmptyComponent={
          loading ? <LoadingSkeleton /> : <EmptyState />
        }
        ListHeaderComponent={
          filteredStreams.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.streamCount}>
                {filteredStreams.length} {filteredStreams.length === 1 ? 'Stream' : 'Streams'} Live
              </Text>
            </View>
          ) : null
        }
      />

      {/*============= Go Live FAB ===================*/}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={handleGoLive}
        activeOpacity={0.9}>
        <LinearGradient
          colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
        
          <Text style={styles.fabText}>Go Live</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  headerBackground: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android'? 0 : 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    marginTop:15,
    fontSize: 30,
    fontWeight: '800',
    color: BRAND_COLORS.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
    marginTop: 2,
    marginBottom:20
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: BRAND_COLORS.surfaceLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: BRAND_COLORS.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  categoriesContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.surfaceLight,
  },
  categoryButtonActive: {
    backgroundColor: BRAND_COLORS.primary + '20',
    borderColor: BRAND_COLORS.primary,
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.textSecondary,
  },
  categoryLabelActive: {
    color: BRAND_COLORS.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  streamCount: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  streamCard: {
    flex: 1,
    marginBottom: 16,
    marginRight: 8,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 20,
    zIndex: -1,
  },
  cardContainer: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BRAND_COLORS.surfaceLight,
  },
  previewContainer: {
    height: 160,
    backgroundColor: BRAND_COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 0,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: BRAND_COLORS.danger,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 3,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    padding:10
  },
  viewerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewerCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  streamInfo: {
    padding: 16,
  },
  broadcasterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  broadcasterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  broadcasterInfo: {
    flex: 1,
  },
  broadcasterName: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 2,
  },
  streamTitle: {
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 13,
    color: BRAND_COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: BRAND_COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: BRAND_COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    ...Platform.select({
      ios: {
        shadowColor: BRAND_COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:Platform.OS === 'android'? 0 : 0,
    paddingVertical:Platform.OS === 'android' ? 0 : 0,
    borderRadius: 28,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    padding:20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  skeletonContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  skeletonHeader: {
    marginBottom: 20,
  },
  skeletonHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
  },
  skeletonTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 8,
    marginBottom: 6,
    width: '40%',
  },
  skeletonSearchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
  },
  skeletonCategories: {
    height: 44,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 22,
    marginBottom: 20,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '48%',
    marginBottom: 16,
  },
  skeletonPreview: {
    height: 160,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 20,
    marginBottom: 12,
  },
  skeletonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surface,
    marginRight: 12,
  },
  skeletonText: {
    flex: 1,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 6,
    marginBottom: 8,
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 400,
    padding: 2,
    paddingHorizontal:20,
    borderRadius: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal:30
  },
  goLiveButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  goLiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  goLiveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
});

export default LivePage;
