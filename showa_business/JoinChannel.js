import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext'; 

// Storage keys for caching
const CHANNELS_STORAGE_KEY = '@channels_data_chatscreen';
const FOLLOWING_CHANNELS_KEY = '@following_channels_chatscreen';
const CACHE_TIMESTAMP_KEY = '@cache_timestamp_chatscreen';
const CACHE_EXPIRY_HOURS = 24;

const ChatScreen = ({ navigation }) => {
  const { colors, theme, isDark } = useTheme(); 
  
  const [search, setSearch] = useState('');
  const [channels, setChannels] = useState([]);
  const [followingChannels, setFollowingChannels] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLock, setFollowLock] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const abortControllerRef = useRef(null);

  // Storage helper functions
  const saveDataToStorage = useCallback(async (key, data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      if (key === CHANNELS_STORAGE_KEY || key === FOLLOWING_CHANNELS_KEY) {
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      }
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  }, []);

  const getDataFromStorage = useCallback(async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting data from storage:', error);
      return null;
    }
  }, []);

  const checkCacheExpiry = useCallback(async () => {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestamp) return true;
      const cacheTime = parseInt(timestamp);
      const now = Date.now();
      const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
      return hoursDiff > CACHE_EXPIRY_HOURS;
    } catch (error) {
      console.error('Error checking cache expiry:', error);
      return true;
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([CHANNELS_STORAGE_KEY, FOLLOWING_CHANNELS_KEY, CACHE_TIMESTAMP_KEY]);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  const loadCachedData = useCallback(async () => {
    try {
      const isCacheExpired = await checkCacheExpiry();
      if (isCacheExpired) {
        await clearCache();
        return false;
      }

      const [cachedChannels, cachedFollowingIds] = await Promise.all([
        getDataFromStorage(CHANNELS_STORAGE_KEY),
        getDataFromStorage(FOLLOWING_CHANNELS_KEY),
      ]);

      if (cachedChannels) {
        setChannels(cachedChannels);
      }
      if (cachedFollowingIds && cachedChannels) {
        const fullFollowedChannels = cachedChannels.filter((ch) => cachedFollowingIds.includes(ch.id));
        setFollowingChannels(fullFollowedChannels);
      }
      return cachedChannels || cachedFollowingIds;
    } catch (error) {
      console.error('Error loading cached data:', error);
      return false;
    }
  }, []);

  // Fetch following channels from API
  const fetchFollowingChannels = useCallback(async (signal) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await axios.get(`${API_ROUTE}/channels/following/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      if (res.status === 200 || res.status === 201) {
        const followedIds = res.data.map((channel) => channel.id);
        await saveDataToStorage(FOLLOWING_CHANNELS_KEY, followedIds);
        return followedIds;
      }
      return [];
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Error fetching following channels:', err);
      }
      return [];
    }
  }, []);

  // Fetch all channels
  const fetchChannels = useCallback(async (followedChannelIds = [], signal) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await axios.get(`${API_ROUTE}/channels/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      
      // Process channels with following status
      const processedChannels = res.data.map((channel) => ({
        ...channel,
        isFollowing: followedChannelIds.includes(channel.id),
      }));
      
      // Sort: followed channels first
      const sortedChannels = [...processedChannels].sort((a, b) => {
        if (a.isFollowing === b.isFollowing) return 0;
        return a.isFollowing ? -1 : 1;
      });
      
      await saveDataToStorage(CHANNELS_STORAGE_KEY, sortedChannels);
      return sortedChannels;
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Error fetching channels:', err);
      }
      return [];
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async (isRefresh = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const followedChannelIds = await fetchFollowingChannels(signal);
      const allChannels = await fetchChannels(followedChannelIds, signal);
      const fullFollowedChannels = allChannels.filter((ch) => ch.isFollowing);
      
      setChannels(allChannels);
      setFollowingChannels(fullFollowedChannels);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error loading data:', error);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // Handle follow/unfollow (optimistic updates)
  const handleFollow = useCallback(async (slug) => {
    if (followLock[slug]) return;
    
    setFollowLock((prev) => ({ ...prev, [slug]: true }));
    
    try {
      // Find channel before update
      const channelToUpdate = channels.find((ch) => ch.slug === slug);
      if (!channelToUpdate) return;

      // Optimistically update UI
      setChannels((prev) => {
        const updated = prev.map((ch) =>
          ch.slug === slug
            ? {
                ...ch,
                isFollowing: !ch.isFollowing,
                followers_count: ch.isFollowing 
                  ? Math.max((ch.followers_count || 1) - 1, 0)
                  : (ch.followers_count || 0) + 1,
              }
            : ch
        );
        return updated.sort((a, b) => {
          if (a.isFollowing === b.isFollowing) return 0;
          return a.isFollowing ? -1 : 1;
        });
      });

      setFollowingChannels((prev) => {
        if (prev.some((ch) => ch.slug === slug)) {
          return prev.filter((ch) => ch.slug !== slug);
        } else {
          return [...prev, { ...channelToUpdate, isFollowing: true }];
        }
      });

      // Make API call
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/channels/${slug}/follow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update storage
      const updatedChannels = channels.map((ch) => 
        ch.slug === slug ? { ...ch, isFollowing: !ch.isFollowing } : ch
      );
      await saveDataToStorage(CHANNELS_STORAGE_KEY, updatedChannels);
      
      const updatedFollowingIds = updatedChannels
        .filter((ch) => ch.isFollowing)
        .map((ch) => ch.id);
      await saveDataToStorage(FOLLOWING_CHANNELS_KEY, updatedFollowingIds);
      
    } catch (err) {
      console.error('Follow error:', err.response?.data || err.message);
      
      // Revert on error
      fetchAllData(true);
    } finally {
      setFollowLock((prev) => ({ ...prev, [slug]: false }));
    }
  }, [channels]);

  // Debounced search
  const debouncedSetSearch = useCallback(
    (() => {
      let timeoutId;
      return (text) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearch(text);
        }, 300);
      };
    })(),
    []
  );

  // Initial load
  useEffect(() => {
    const init = async () => {
      const hasCache = await loadCachedData();
      if (!hasCache) {
        await fetchAllData(false);
      } else {
        // Load from cache and refresh in background
        setLoading(false);
        fetchAllData(false);
      }
    };
    init();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized filtered channels
  const filteredChannels = useMemo(() => {
    if (!search) return channels;
    
    const searchLower = search.toLowerCase();
    return channels.filter((channel) =>
      channel.name.toLowerCase().includes(searchLower)
    ).sort((a, b) => {
      // Following channels first
      if (a.isFollowing && !b.isFollowing) return -1;
      if (!a.isFollowing && b.isFollowing) return 1;
      
      // Then by follower count
      return (b.followers_count || 0) - (a.followers_count || 0);
    });
  }, [channels, search]);

  const followingFiltered = useMemo(() => 
    filteredChannels.filter(channel => channel.isFollowing),
    [filteredChannels]
  );

  const discoverFiltered = useMemo(() => 
    filteredChannels.filter(channel => !channel.isFollowing),
    [filteredChannels]
  );

  const navigateToChannelDetails = useCallback((channel) => {
    navigation.navigate('ChannelDetails', {
      receiverId: channel.id,
      name: channel.name,
      chatType: 'channel',
      profile_image: channel.image,
      channelSlug: channel.slug,
      InviteLink: channel.invite_link,
      followers: channel.followers_count
    });
  }, [navigation]);

  // Channel Card Component
  const ChannelCard = React.memo(({ channel, onPress }) => {
    const handleFollowPress = () => {
      handleFollow(channel.slug);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.card, { backgroundColor: colors.background }]}
        onPress={onPress}
      >
        <Image
          source={
            channel.image
              ? { uri: `${API_ROUTE_IMAGE}${channel.image}` }
              : require('../assets/images/channelfallbackimg.png')
          }
          style={[styles.avatar, { borderColor: colors.border }]}
          defaultSource={require('../assets/images/channelfallbackimg.png')}
        />
        <View style={styles.channelInfo}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {channel.name}
          </Text>
          <Text style={[styles.followers, { color: colors.textSecondary }]}>
            {channel.followers_count?.toLocaleString() || '0'} members
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.followBtn,
            { backgroundColor: colors.buttonPrimary },
            channel.isFollowing && [styles.followingBtn, { backgroundColor: colors.buttonSecondary }],
            followLock[channel.slug] && styles.disabledBtn
          ]}
          onPress={handleFollowPress}
          activeOpacity={0.7}
          disabled={followLock[channel.slug]}
        >
          {followLock[channel.slug] ? (
            <ActivityIndicator size="small" color={colors.buttonPrimaryText} />
          ) : (
            <Text style={[
              styles.followText,
              { color: colors.buttonPrimaryText },
              channel.isFollowing && [styles.followingText, { color: colors.buttonSecondaryText }]
            ]}>
              {channel.isFollowing ? (
                <>
                  <Icon name="checkmark" size={14} color={colors.buttonSecondaryText} /> Following
                </>
              ) : (
                'Follow'
              )}
            </Text>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  });

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={[styles.skeletonCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.skeletonAvatar, { backgroundColor: colors.surfaceSecondary }]} />
          <View style={styles.skeletonTextContainer}>
            <View style={[styles.skeletonText, { width: '70%', backgroundColor: colors.surfaceSecondary }]} />
            <View style={[styles.skeletonText, { width: '50%', backgroundColor: colors.surfaceSecondary }]} />
          </View>
          <View style={[styles.skeletonButton, { backgroundColor: colors.surfaceSecondary }]} />
        </View>
      ))}
    </View>
  );

  // Empty State
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="compass-outline" size={50} color={colors.textTertiary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {search ? 'No channels found' : 'No channels available'}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
        {search ? 'Try a different search term' : 'Check back later for new channels'}
      </Text>
    </View>
  );

  const renderChannelItem = useCallback(({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <ChannelCard 
        channel={item}
        onPress={() => {
          if (item.isFollowing) {
            navigateToChannelDetails(item);
          } else {
            setSnackbarVisible(true);
          }
        }}
      />
    </Animated.View>
  ), [fadeAnim, navigateToChannelDetails]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
      />
      
      <LinearGradient 
        colors={[colors.primary, colors.primaryDark || colors.primary]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back-outline" size={24} color='#fff' />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#fff' }]}>Discover Channels</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.searchBox, { backgroundColor: '#fff' }]}>
          <Icon name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search channels..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.text }]}
            defaultValue={search}
            onChangeText={debouncedSetSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </LinearGradient>

      <FlatList
        data={filteredChannels}
        renderItem={renderChannelItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Following Section */}
            {!loading && followingFiltered.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="checkmark-circle" size={22} color={colors.primary} style={styles.sectionIcon} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Following</Text>
                  <View style={[styles.followingCountBadge, { backgroundColor: colors.surfaceTertiary }]}>
                    <Text style={[styles.followingCountText, { color: colors.primary }]}>
                      {followingFiltered.length}
                    </Text>
                  </View>
                </View>
                <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
              </View>
            )}
            
            {/* All Channels Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="compass" size={22} color={colors.primary} style={styles.sectionIcon} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {followingFiltered.length > 0 ? 'Discover More' : 'Trending Communities'}
                </Text>
              </View>
              <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? <LoadingSkeleton /> : <EmptyState />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAllData(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={Platform.OS === 'android'}
        updateCellsBatchingPeriod={50}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[styles.snackbar, { backgroundColor: colors.primary }]}
        action={{
          label: 'OK',
          labelColor: colors.textInverse,
          onPress: () => setSnackbarVisible(false),
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="lock-closed" size={16} color={colors.textInverse} style={{marginRight: 8}} />
          <Text style={{color: colors.textInverse}}>Follow to access this channel</Text>
        </View>
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    paddingTop: Platform.OS === 'android' ? 14 : 0,
    borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: '#0d64dd',
    elevation: 6,
    zIndex: 1000,
  },
  headerTop: {
    paddingHorizontal: Platform.OS === 'android'? 0: 20,
    paddingVertical: Platform.OS === 'android'? 0 : 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchBox: {
    marginHorizontal: Platform.OS === 'android' ? 20 : 20,
    marginVertical: Platform.OS === 'android' ? 20 : 20,
    flexDirection: 'row',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 46,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 30,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 20,
  },
  followingCountBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  followingCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    marginBottom: 15,
    height: 1.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    borderWidth: 1,
  },
  channelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 3,
  },
  followers: {
    fontSize: 13,
  },
  followBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingBtn: {
    backgroundColor: '#f0f0f0',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  followText: {
    fontWeight: '500',
    fontSize: 14,
  },
  followingText: {
    color: '#666',
  },
  snackbar: {
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 5,
  },
  loadingContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },
  skeletonAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  skeletonTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonText: {
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonButton: {
    width: 80,
    height: 30,
    borderRadius: 18,
  },
});

export default ChatScreen;