// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   StatusBar,
//   Animated,
//   Platform,
//   RefreshControl,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Divider, Snackbar } from 'react-native-paper';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTheme } from '../src/context/ThemeContext'; 

// // Storage keys for caching
// const CHANNELS_STORAGE_KEY = '@channels_data_chatscreen';
// const FOLLOWING_CHANNELS_KEY = '@following_channels_chatscreen';
// const CACHE_TIMESTAMP_KEY = '@cache_timestamp_chatscreen';
// const CACHE_EXPIRY_HOURS = 24;

// const ChatScreen = ({ navigation }) => {
//   const { colors, theme, isDark } = useTheme(); 
  
//   const [search, setSearch] = useState('');
//   const [channels, setChannels] = useState([]);
//   const [followingChannels, setFollowingChannels] = useState([]);
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [followLock, setFollowLock] = useState({});
//   const [refreshing, setRefreshing] = useState(false);
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const abortControllerRef = useRef(null);

//   // Storage helper functions
//   const saveDataToStorage = useCallback(async (key, data) => {
//     try {
//       const jsonValue = JSON.stringify(data);
//       await AsyncStorage.setItem(key, jsonValue);
//       if (key === CHANNELS_STORAGE_KEY || key === FOLLOWING_CHANNELS_KEY) {
//         await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
//       }
//     } catch (error) {
//       console.error('Error saving data to storage:', error);
//     }
//   }, []);

//   const getDataFromStorage = useCallback(async (key) => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(key);
//       return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error('Error getting data from storage:', error);
//       return null;
//     }
//   }, []);

//   const checkCacheExpiry = useCallback(async () => {
//     try {
//       const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
//       if (!timestamp) return true;
//       const cacheTime = parseInt(timestamp);
//       const now = Date.now();
//       const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
//       return hoursDiff > CACHE_EXPIRY_HOURS;
//     } catch (error) {
//       console.error('Error checking cache expiry:', error);
//       return true;
//     }
//   }, []);

//   const clearCache = useCallback(async () => {
//     try {
//       await AsyncStorage.multiRemove([CHANNELS_STORAGE_KEY, FOLLOWING_CHANNELS_KEY, CACHE_TIMESTAMP_KEY]);
//     } catch (error) {
//       console.error('Error clearing cache:', error);
//     }
//   }, []);

//   const loadCachedData = useCallback(async () => {
//     try {
//       const isCacheExpired = await checkCacheExpiry();
//       if (isCacheExpired) {
//         await clearCache();
//         return false;
//       }

//       const [cachedChannels, cachedFollowingIds] = await Promise.all([
//         getDataFromStorage(CHANNELS_STORAGE_KEY),
//         getDataFromStorage(FOLLOWING_CHANNELS_KEY),
//       ]);

//       if (cachedChannels) {
//         setChannels(cachedChannels);
//       }
//       if (cachedFollowingIds && cachedChannels) {
//         const fullFollowedChannels = cachedChannels.filter((ch) => cachedFollowingIds.includes(ch.id));
//         setFollowingChannels(fullFollowedChannels);
//       }
//       return cachedChannels || cachedFollowingIds;
//     } catch (error) {
//       console.error('Error loading cached data:', error);
//       return false;
//     }
//   }, []);

//   // Fetch following channels from API
//   const fetchFollowingChannels = useCallback(async (signal) => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       const res = await axios.get(`${API_ROUTE}/channels/following/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal,
//       });
//       if (res.status === 200 || res.status === 201) {
//         const followedIds = res.data.map((channel) => channel.id);
//         await saveDataToStorage(FOLLOWING_CHANNELS_KEY, followedIds);
//         return followedIds;
//       }
//       return [];
//     } catch (err) {
//       if (!axios.isCancel(err)) {
//         console.error('Error fetching following channels:', err);
//       }
//       return [];
//     }
//   }, []);

//   // Fetch all channels
//   const fetchChannels = useCallback(async (followedChannelIds = [], signal) => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       const res = await axios.get(`${API_ROUTE}/channels/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal,
//       });
      
//       // Process channels with following status
//       const processedChannels = res.data.map((channel) => ({
//         ...channel,
//         isFollowing: followedChannelIds.includes(channel.id),
//       }));
      
//       // Sort: followed channels first
//       const sortedChannels = [...processedChannels].sort((a, b) => {
//         if (a.isFollowing === b.isFollowing) return 0;
//         return a.isFollowing ? -1 : 1;
//       });
      
//       await saveDataToStorage(CHANNELS_STORAGE_KEY, sortedChannels);
//       return sortedChannels;
//     } catch (err) {
//       if (!axios.isCancel(err)) {
//         console.error('Error fetching channels:', err);
//       }
//       return [];
//     }
//   }, []);

//   // Fetch all data
//   const fetchAllData = useCallback(async (isRefresh = false) => {
//     // Cancel any ongoing request
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
    
//     abortControllerRef.current = new AbortController();
//     const signal = abortControllerRef.current.signal;

//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       const followedChannelIds = await fetchFollowingChannels(signal);
//       const allChannels = await fetchChannels(followedChannelIds, signal);
//       const fullFollowedChannels = allChannels.filter((ch) => ch.isFollowing);
      
//       setChannels(allChannels);
//       setFollowingChannels(fullFollowedChannels);
      
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Error loading data:', error);
//       }
//     } finally {
//       if (!signal.aborted) {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     }
//   }, []);

//   // Handle follow/unfollow (optimistic updates)
//   const handleFollow = useCallback(async (slug) => {
//     if (followLock[slug]) return;
    
//     setFollowLock((prev) => ({ ...prev, [slug]: true }));
    
//     try {
//       // Find channel before update
//       const channelToUpdate = channels.find((ch) => ch.slug === slug);
//       if (!channelToUpdate) return;

//       // Optimistically update UI
//       setChannels((prev) => {
//         const updated = prev.map((ch) =>
//           ch.slug === slug
//             ? {
//                 ...ch,
//                 isFollowing: !ch.isFollowing,
//                 followers_count: ch.isFollowing 
//                   ? Math.max((ch.followers_count || 1) - 1, 0)
//                   : (ch.followers_count || 0) + 1,
//               }
//             : ch
//         );
//         return updated.sort((a, b) => {
//           if (a.isFollowing === b.isFollowing) return 0;
//           return a.isFollowing ? -1 : 1;
//         });
//       });

//       setFollowingChannels((prev) => {
//         if (prev.some((ch) => ch.slug === slug)) {
//           return prev.filter((ch) => ch.slug !== slug);
//         } else {
//           return [...prev, { ...channelToUpdate, isFollowing: true }];
//         }
//       });

//       // Make API call
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/channels/${slug}/follow/`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update storage
//       const updatedChannels = channels.map((ch) => 
//         ch.slug === slug ? { ...ch, isFollowing: !ch.isFollowing } : ch
//       );
//       await saveDataToStorage(CHANNELS_STORAGE_KEY, updatedChannels);
      
//       const updatedFollowingIds = updatedChannels
//         .filter((ch) => ch.isFollowing)
//         .map((ch) => ch.id);
//       await saveDataToStorage(FOLLOWING_CHANNELS_KEY, updatedFollowingIds);
      
//     } catch (err) {
//       console.error('Follow error:', err.response?.data || err.message);
      
//       // Revert on error
//       fetchAllData(true);
//     } finally {
//       setFollowLock((prev) => ({ ...prev, [slug]: false }));
//     }
//   }, [channels]);

//   // Debounced search
//   const debouncedSetSearch = useCallback(
//     (() => {
//       let timeoutId;
//       return (text) => {
//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => {
//           setSearch(text);
//         }, 300);
//       };
//     })(),
//     []
//   );

//   // Initial load
//   useEffect(() => {
//     const init = async () => {
//       const hasCache = await loadCachedData();
//       if (!hasCache) {
//         await fetchAllData(false);
//       } else {
//         // Load from cache and refresh in background
//         setLoading(false);
//         fetchAllData(false);
//       }
//     };
//     init();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, []);

//   // Memoized filtered channels
//   const filteredChannels = useMemo(() => {
//     if (!search) return channels;
    
//     const searchLower = search.toLowerCase();
//     return channels.filter((channel) =>
//       channel.name.toLowerCase().includes(searchLower)
//     ).sort((a, b) => {
//       // Following channels first
//       if (a.isFollowing && !b.isFollowing) return -1;
//       if (!a.isFollowing && b.isFollowing) return 1;
      
//       // Then by follower count
//       return (b.followers_count || 0) - (a.followers_count || 0);
//     });
//   }, [channels, search]);

//   const followingFiltered = useMemo(() => 
//     filteredChannels.filter(channel => channel.isFollowing),
//     [filteredChannels]
//   );

//   const discoverFiltered = useMemo(() => 
//     filteredChannels.filter(channel => !channel.isFollowing),
//     [filteredChannels]
//   );

//   const navigateToChannelDetails = useCallback((channel) => {
//     navigation.navigate('ChannelDetails', {
//       receiverId: channel.id,
//       name: channel.name,
//       chatType: 'channel',
//       profile_image: channel.image,
//       channelSlug: channel.slug,
//       InviteLink: channel.invite_link,
//       followers: channel.followers_count
//     });
//   }, [navigation]);

//   // Channel Card Component
//   const ChannelCard = React.memo(({ channel, onPress }) => {
//     const handleFollowPress = () => {
//       handleFollow(channel.slug);
//     };

//     return (
//       <TouchableOpacity
//         activeOpacity={0.9}
//         style={[styles.card, { backgroundColor: colors.background }]}
//         onPress={onPress}
//       >
//         <Image
//           source={
//             channel.image
//               ? { uri: `${API_ROUTE_IMAGE}${channel.image}` }
//               : require('../assets/images/channelfallbackimg.png')
//           }
//           style={[styles.avatar, { borderColor: colors.border }]}
//           defaultSource={require('../assets/images/channelfallbackimg.png')}
//         />
//         <View style={styles.channelInfo}>
//           <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
//             {channel.name}
//           </Text>
//           <Text style={[styles.followers, { color: colors.textSecondary }]}>
//             {channel.followers_count?.toLocaleString() || '0'} members
//           </Text>
//         </View>
//         <TouchableOpacity
//           style={[
//             styles.followBtn,
//             { backgroundColor: colors.buttonPrimary },
//             channel.isFollowing && [styles.followingBtn, { backgroundColor: colors.buttonSecondary }],
//             followLock[channel.slug] && styles.disabledBtn
//           ]}
//           onPress={handleFollowPress}
//           activeOpacity={0.7}
//           disabled={followLock[channel.slug]}
//         >
//           {followLock[channel.slug] ? (
//             <ActivityIndicator size="small" color={colors.buttonPrimaryText} />
//           ) : (
//             <Text style={[
//               styles.followText,
//               { color: colors.buttonPrimaryText },
//               channel.isFollowing && [styles.followingText, { color: colors.buttonSecondaryText }]
//             ]}>
//               {channel.isFollowing ? (
//                 <>
//                   <Icon name="checkmark" size={14} color={colors.buttonSecondaryText} /> Following
//                 </>
//               ) : (
//                 'Follow'
//               )}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   });

//   // Loading Skeleton
//   const LoadingSkeleton = () => (
//     <View style={styles.loadingContainer}>
//       {[1, 2, 3].map((item) => (
//         <View key={item} style={[styles.skeletonCard, { backgroundColor: colors.surface }]}>
//           <View style={[styles.skeletonAvatar, { backgroundColor: colors.surfaceSecondary }]} />
//           <View style={styles.skeletonTextContainer}>
//             <View style={[styles.skeletonText, { width: '70%', backgroundColor: colors.surfaceSecondary }]} />
//             <View style={[styles.skeletonText, { width: '50%', backgroundColor: colors.surfaceSecondary }]} />
//           </View>
//           <View style={[styles.skeletonButton, { backgroundColor: colors.surfaceSecondary }]} />
//         </View>
//       ))}
//     </View>
//   );

//   // Empty State
//   const EmptyState = () => (
//     <View style={styles.emptyState}>
//       <Icon name="compass-outline" size={50} color={colors.textTertiary} />
//       <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//         {search ? 'No channels found' : 'No channels available'}
//       </Text>
//       <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
//         {search ? 'Try a different search term' : 'Check back later for new channels'}
//       </Text>
//     </View>
//   );

//   const renderChannelItem = useCallback(({ item }) => (
//     <Animated.View style={{ opacity: fadeAnim }}>
//       <ChannelCard 
//         channel={item}
//         onPress={() => {
//           if (item.isFollowing) {
//             navigateToChannelDetails(item);
//           } else {
//             setSnackbarVisible(true);
//           }
//         }}
//       />
//     </Animated.View>
//   ), [fadeAnim, navigateToChannelDetails]);

//   const keyExtractor = useCallback((item) => item.id.toString(), []);

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
//       <StatusBar
//         barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
//         translucent={Platform.OS === 'android'}
//         backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
//       />
      
//       <LinearGradient 
//         colors={[colors.primary, colors.primaryDark || colors.primary]} 
//         start={{x: 0, y: 0}} 
//         end={{x: 1, y: 1}}
//         style={styles.header}
//       >
//         <View style={styles.headerTop}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//             activeOpacity={0.7}
//           >
//             <Icon name="arrow-back-outline" size={24} color='#fff' />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, { color: '#fff' }]}>Discover Channels</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <View style={[styles.searchBox, { backgroundColor: '#fff' }]}>
//           <Icon name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
//           <TextInput
//             placeholder="Search channels..."
//             placeholderTextColor={colors.textTertiary}
//             style={[styles.searchInput, { color: colors.text }]}
//             defaultValue={search}
//             onChangeText={debouncedSetSearch}
//             clearButtonMode="while-editing"
//           />
//         </View>
//       </LinearGradient>

//       <FlatList
//         data={filteredChannels}
//         renderItem={renderChannelItem}
//         keyExtractor={keyExtractor}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={
//           <>
//             {/* Following Section */}
//             {!loading && followingFiltered.length > 0 && (
//               <View style={styles.section}>
//                 <View style={styles.sectionHeader}>
//                   <Icon name="checkmark-circle" size={22} color={colors.primary} style={styles.sectionIcon} />
//                   <Text style={[styles.sectionTitle, { color: colors.text }]}>Following</Text>
//                   <View style={[styles.followingCountBadge, { backgroundColor: colors.surfaceTertiary }]}>
//                     <Text style={[styles.followingCountText, { color: colors.primary }]}>
//                       {followingFiltered.length}
//                     </Text>
//                   </View>
//                 </View>
//                 <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
//               </View>
//             )}
            
//             {/* All Channels Section */}
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Icon name="compass" size={22} color={colors.primary} style={styles.sectionIcon} />
//                 <Text style={[styles.sectionTitle, { color: colors.text }]}>
//                   {followingFiltered.length > 0 ? 'Discover More' : 'Trending Communities'}
//                 </Text>
//               </View>
//               <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
//             </View>
//           </>
//         }
//         ListEmptyComponent={
//           loading ? <LoadingSkeleton /> : <EmptyState />
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => fetchAllData(true)}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//         initialNumToRender={10}
//         maxToRenderPerBatch={20}
//         windowSize={21}
//         removeClippedSubviews={Platform.OS === 'android'}
//         updateCellsBatchingPeriod={50}
//       />

//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//         style={[styles.snackbar, { backgroundColor: colors.primary }]}
//         action={{
//           label: 'OK',
//           labelColor: colors.textInverse,
//           onPress: () => setSnackbarVisible(false),
//         }}
//       >
//         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//           <Icon name="lock-closed" size={16} color={colors.textInverse} style={{marginRight: 8}} />
//           <Text style={{color: colors.textInverse}}>Follow to access this channel</Text>
//         </View>
//       </Snackbar>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     paddingBottom: Platform.OS === 'android' ? 16 : 0,
//     paddingTop: Platform.OS === 'android' ? 14 : 0,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
//     backgroundColor: '#0d64dd',
//     elevation: 6,
//     zIndex: 1000,
//   },
//   headerTop: {
//     paddingHorizontal: Platform.OS === 'android'? 0: 20,
//     paddingVertical: Platform.OS === 'android'? 0 : 30,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   backButton: {
//     padding: 5,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     textAlign: 'center',
//   },
//   searchBox: {
//     marginHorizontal: Platform.OS === 'android' ? 20 : 20,
//     marginVertical: Platform.OS === 'android' ? 20 : 20,
//     flexDirection: 'row',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     alignItems: 'center',
//     height: 46,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     paddingVertical: 8,
//   },
//   listContent: {
//     paddingBottom: 30,
//   },
//   section: {
//     paddingHorizontal: 20,
//     paddingTop: 25,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionIcon: {
//     marginRight: 10,
//   },
//   sectionTitle: {
//     fontWeight: '700',
//     fontSize: 20,
//   },
//   followingCountBadge: {
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     marginLeft: 8,
//   },
//   followingCountText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   divider: {
//     marginBottom: 15,
//     height: 1.5,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 14,
//     padding: 15,
//     marginBottom: 12,
//     marginHorizontal: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   avatar: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     marginRight: 12,
//     borderWidth: 1,
//   },
//   channelInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   name: {
//     fontWeight: '600',
//     fontSize: 16,
//     marginBottom: 3,
//   },
//   followers: {
//     fontSize: 13,
//   },
//   followBtn: {
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 18,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   followingBtn: {
//     backgroundColor: '#f0f0f0',
//   },
//   disabledBtn: {
//     opacity: 0.6,
//   },
//   followText: {
//     fontWeight: '500',
//     fontSize: 14,
//   },
//   followingText: {
//     color: '#666',
//   },
//   snackbar: {
//     borderRadius: 8,
//     marginBottom: 20,
//     marginHorizontal: 20,
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 50,
//     paddingHorizontal: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 15,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     marginTop: 5,
//   },
//   loadingContainer: {
//     marginTop: 10,
//     paddingHorizontal: 20,
//   },
//   skeletonCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 14,
//     padding: 15,
//     marginBottom: 12,
//   },
//   skeletonAvatar: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     marginRight: 12,
//   },
//   skeletonTextContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   skeletonText: {
//     height: 14,
//     borderRadius: 4,
//     marginBottom: 6,
//   },
//   skeletonButton: {
//     width: 80,
//     height: 30,
//     borderRadius: 18,
//   },
// });

// export default ChatScreen;

import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
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
  InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext'; 
import NetInfo from '@react-native-community/netinfo'; 

// Storage keys for caching
const CHANNELS_STORAGE_KEY = '@channels_data_chatscreen_v2';
const FOLLOWING_CHANNELS_KEY = '@following_channels_chatscreen_v2';
const CACHE_TIMESTAMP_KEY = '@cache_timestamp_chatscreen_v2';
const CACHE_EXPIRY_HOURS = 24;

// Image cache key
const IMAGE_CACHE_KEY = '@channel_images_cache';

// Memoized Channel Card Component with optimized rendering
const ChannelCard = memo(({ channel, onPress, onFollow, isFollowLocked, colors }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleFollowPress = useCallback(() => {
    if (!isFollowLocked) {
      onFollow(channel.slug);
    }
  }, [channel.slug, isFollowLocked, onFollow]);

  const handlePress = useCallback(() => {
    onPress(channel);
  }, [channel, onPress]);

  const imageSource = useMemo(() => {
    if (imageError || !channel.image) {
      return require('../assets/images/channelfallbackimg.png');
    }
    return { uri: `${API_ROUTE_IMAGE}${channel.image}` };
  }, [channel.image, imageError]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={handlePress}
    >
      <Image
        source={imageSource}
        style={[styles.avatar, { borderColor: colors.border }]}
        defaultSource={require('../assets/images/channelfallbackimg.png')}
        onError={() => setImageError(true)}
        loadingIndicatorSource={require('../assets/images/channelfallbackimg.png')}
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
          isFollowLocked && styles.disabledBtn
        ]}
        onPress={handleFollowPress}
        activeOpacity={0.7}
        disabled={isFollowLocked}
      >
        {isFollowLocked ? (
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
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return (
    prevProps.channel.id === nextProps.channel.id &&
    prevProps.channel.isFollowing === nextProps.channel.isFollowing &&
    prevProps.channel.followers_count === nextProps.channel.followers_count &&
    prevProps.isFollowLocked === nextProps.isFollowLocked &&
    prevProps.colors === nextProps.colors
  );
});

// Optimized Loading Skeleton
const LoadingSkeleton = memo(({ colors }) => (
  <View style={styles.loadingContainer}>
    {[1, 2, 3, 4].map((item) => (
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
));

// Optimized Empty State
const EmptyState = memo(({ search, colors }) => (
  <View style={styles.emptyState}>
    <Icon name="compass-outline" size={50} color={colors.textTertiary} />
    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
      {search ? 'No channels found' : 'No channels available'}
    </Text>
    <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
      {search ? 'Try a different search term' : 'Check back later for new channels'}
    </Text>
  </View>
));

const ChatScreen = ({ navigation }) => {
  const { colors, theme, isDark } = useTheme(); 
  
  // State management
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [channels, setChannels] = useState([]);
  const [followingChannels, setFollowingChannels] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [followLock, setFollowLock] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // Refs
  const abortControllerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const flatListRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setDebouncedSearch(search);
        // Scroll to top on search
        if (flatListRef.current && search) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Network connectivity check
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    
    return () => unsubscribe();
  }, []);

  // Storage helper functions with compression
  const saveDataToStorage = useCallback(async (key, data) => {
    try {
      // Only store essential data to reduce size
      const minimalData = Array.isArray(data) ? data.map(item => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        image: item.image,
        followers_count: item.followers_count,
        isFollowing: item.isFollowing,
        invite_link: item.invite_link
      })) : data;
      
      const jsonValue = JSON.stringify(minimalData);
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
      return true;
    }
  }, []);

  // Load cached data with priority
  const loadCachedData = useCallback(async () => {
    try {
      const isCacheExpired = await checkCacheExpiry();
      if (isCacheExpired) {
        return false;
      }

      const [cachedChannels, cachedFollowingIds] = await Promise.all([
        getDataFromStorage(CHANNELS_STORAGE_KEY),
        getDataFromStorage(FOLLOWING_CHANNELS_KEY),
      ]);

      if (cachedChannels && cachedChannels.length > 0) {
        setChannels(cachedChannels);
        
        if (cachedFollowingIds) {
          const fullFollowedChannels = cachedChannels.filter((ch) => 
            cachedFollowingIds.includes(ch.id)
          );
          setFollowingChannels(fullFollowedChannels);
        }
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fadeAnim]);

  // Fetch following channels from API
  const fetchFollowingChannels = useCallback(async (signal) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return [];
    
    try {
      const res = await axios.get(`${API_ROUTE}/channels/following/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000, // 10 second timeout
      });
      
      if (res.status === 200 || res.status === 201) {
        const followedIds = res.data.map((channel) => channel.id);
        // Save in background
        setTimeout(() => {
          saveDataToStorage(FOLLOWING_CHANNELS_KEY, followedIds);
        }, 0);
        return followedIds;
      }
      return [];
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Error fetching following channels:', err);
      }
      return [];
    }
  }, [saveDataToStorage]);

  // Fetch all channels
  const fetchChannels = useCallback(async (followedChannelIds = [], signal) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return [];
    
    try {
      const res = await axios.get(`${API_ROUTE}/channels/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
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
      
      // Save in background
      setTimeout(() => {
        saveDataToStorage(CHANNELS_STORAGE_KEY, sortedChannels);
      }, 0);
      
      return sortedChannels;
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Error fetching channels:', err);
      }
      return [];
    }
  }, [saveDataToStorage]);

  // Fetch all data with priority
  const fetchAllData = useCallback(async (isRefresh = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetching && !isRefresh) return;
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsFetching(true);
      
      if (isRefresh) {
        setRefreshing(true);
      }

      // Use InteractionManager for non-blocking operations
      InteractionManager.runAfterInteractions(async () => {
        const followedChannelIds = await fetchFollowingChannels(signal);
        if (signal.aborted) return;
        
        const allChannels = await fetchChannels(followedChannelIds, signal);
        if (signal.aborted) return;
        
        const fullFollowedChannels = allChannels.filter((ch) => ch.isFollowing);
        
        if (mountedRef.current && !signal.aborted) {
          setChannels(allChannels);
          setFollowingChannels(fullFollowedChannels);
          setInitialLoading(false);
          
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      });
    } catch (error) {
      if (!axios.isCancel(error) && mountedRef.current) {
        console.error('Error loading data:', error);
      }
    } finally {
      if (mountedRef.current && !signal.aborted) {
        setLoading(false);
        setRefreshing(false);
        setIsFetching(false);
      }
    }
  }, [fetchFollowingChannels, fetchChannels, fadeAnim]);

  // Handle follow/unfollow with optimistic updates
  const handleFollow = useCallback(async (slug) => {
    if (followLock[slug] || isOffline) {
      if (isOffline) {
        // Show offline message
        setSnackbarVisible(true);
      }
      return;
    }
    
    setFollowLock((prev) => ({ ...prev, [slug]: true }));
    
    // Find channel before update
    const channelToUpdate = channels.find((ch) => ch.slug === slug);
    if (!channelToUpdate) {
      setFollowLock((prev) => ({ ...prev, [slug]: false }));
      return;
    }

    // Optimistically update UI
    const newFollowingStatus = !channelToUpdate.isFollowing;
    
    setChannels((prev) => {
      const updated = prev.map((ch) =>
        ch.slug === slug
          ? {
              ...ch,
              isFollowing: newFollowingStatus,
              followers_count: newFollowingStatus 
                ? (ch.followers_count || 0) + 1
                : Math.max((ch.followers_count || 1) - 1, 0),
            }
          : ch
      );
      // Sort: followed channels first
      return updated.sort((a, b) => {
        if (a.isFollowing === b.isFollowing) return 0;
        return a.isFollowing ? -1 : 1;
      });
    });

    setFollowingChannels((prev) => {
      if (newFollowingStatus) {
        // Add to following
        return [...prev, { ...channelToUpdate, isFollowing: true }];
      } else {
        // Remove from following
        return prev.filter((ch) => ch.slug !== slug);
      }
    });

    // Make API call in background
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/channels/${slug}/follow/`,
        {},
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      // Update storage in background
      setTimeout(async () => {
        const updatedChannels = channels.map((ch) => 
          ch.slug === slug ? { ...ch, isFollowing: newFollowingStatus } : ch
        );
        await saveDataToStorage(CHANNELS_STORAGE_KEY, updatedChannels);
        
        const updatedFollowingIds = updatedChannels
          .filter((ch) => ch.isFollowing)
          .map((ch) => ch.id);
        await saveDataToStorage(FOLLOWING_CHANNELS_KEY, updatedFollowingIds);
      }, 0);
      
    } catch (err) {
      console.error('Follow error:', err);
      
      // Revert on error only if component is still mounted
      if (mountedRef.current) {
        // Revert optimistic update
        setChannels((prev) => {
          return prev.map((ch) =>
            ch.slug === slug
              ? {
                  ...ch,
                  isFollowing: !newFollowingStatus,
                  followers_count: !newFollowingStatus 
                    ? (ch.followers_count || 0) + 1
                    : Math.max((ch.followers_count || 1) - 1, 0),
                }
              : ch
          );
        });

        setFollowingChannels((prev) => {
          if (!newFollowingStatus) {
            return [...prev, channelToUpdate];
          } else {
            return prev.filter((ch) => ch.slug !== slug);
          }
        });
      }
    } finally {
      if (mountedRef.current) {
        setFollowLock((prev) => ({ ...prev, [slug]: false }));
      }
    }
  }, [channels, followLock, isOffline, saveDataToStorage]);

  // Memoized filtered channels with optimized sorting
  const filteredChannels = useMemo(() => {
    if (!debouncedSearch) return channels;
    
    const searchLower = debouncedSearch.toLowerCase();
    const filtered = channels.filter((channel) =>
      channel.name.toLowerCase().includes(searchLower)
    );
    
    // Sort: following first, then by name
    return filtered.sort((a, b) => {
      if (a.isFollowing && !b.isFollowing) return -1;
      if (!a.isFollowing && b.isFollowing) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [channels, debouncedSearch]);

  // Split into following and discover sections
  const { followingFiltered, discoverFiltered } = useMemo(() => {
    const following = [];
    const discover = [];
    
    filteredChannels.forEach(channel => {
      if (channel.isFollowing) {
        following.push(channel);
      } else {
        discover.push(channel);
      }
    });
    
    return { followingFiltered: following, discoverFiltered: discover };
  }, [filteredChannels]);

  const navigateToChannelDetails = useCallback((channel) => {
    if (!channel.isFollowing) {
      setSnackbarVisible(true);
      return;
    }
    
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

  // Initial load with priority
  useEffect(() => {
    mountedRef.current = true;
    
    const init = async () => {
      // Try to load from cache first
      const hasCache = await loadCachedData();
      
      if (hasCache) {
        // Show cached data immediately
        setLoading(false);
        setInitialLoading(false);
        
        // Fetch fresh data in background
        setTimeout(() => {
          if (mountedRef.current && !isOffline) {
            fetchAllData(false);
          }
        }, 100);
      } else {
        // No cache, show loading and fetch
        setInitialLoading(true);
        fetchAllData(false);
      }
    };

    init();

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Render functions
  const renderChannelItem = useCallback(({ item, index }) => (
    <ChannelCard 
      channel={item}
      onPress={navigateToChannelDetails}
      onFollow={handleFollow}
      isFollowLocked={followLock[item.slug]}
      colors={colors}
    />
  ), [colors, followLock, handleFollow, navigateToChannelDetails]);

  const renderSectionHeader = useCallback(({ section }) => {
    if (section.title === 'Following' && section.data.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon 
            name={section.title === 'Following' ? 'checkmark-circle' : 'compass'} 
            size={22} 
            color={colors.primary} 
            style={styles.sectionIcon} 
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </Text>
          {section.title === 'Following' && (
            <View style={[styles.followingCountBadge, { backgroundColor: colors.surfaceTertiary }]}>
              <Text style={[styles.followingCountText, { color: colors.primary }]}>
                {section.data.length}
              </Text>
            </View>
          )}
        </View>
        <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>
    );
  }, [colors]);

  const keyExtractor = useCallback((item) => `channel-${item.id}`, []);

  const getItemLayout = useCallback((data, index) => ({
    length: 90, // Approximate height of each item
    offset: 90 * index,
    index,
  }), []);

  // Sections for section list
  const sections = useMemo(() => [
    {
      title: 'Following',
      data: followingFiltered,
      renderItem: renderChannelItem,
    },
    {
      title: 'Discover',
      data: discoverFiltered,
      renderItem: renderChannelItem,
    }
  ], [followingFiltered, discoverFiltered, renderChannelItem]);

  // Show initial loading skeleton
  if (initialLoading) {
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
            <View style={[styles.searchInput, { height: 30 }]} />
          </View>
        </LinearGradient>

        <LoadingSkeleton colors={colors} />
      </SafeAreaView>
    );
  }

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
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
      </LinearGradient>

      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.warning }]}>
          <Icon name="cloud-offline-outline" size={16} color="#fff" />
          <Text style={styles.offlineText}>You're offline. Showing cached data.</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={filteredChannels}
        renderItem={renderChannelItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {followingFiltered.length > 0 && (
              <>
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
              </>
            )}
            
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
          loading ? <LoadingSkeleton colors={colors} /> : 
          <EmptyState search={debouncedSearch} colors={colors} />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAllData(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressViewOffset={10}
          />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={7}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        updateCellsBatchingPeriod={50}
        getItemLayout={getItemLayout}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        scrollEventThrottle={16}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={[styles.snackbar, { backgroundColor: colors.primary }]}
        action={{
          label: 'OK',
          labelColor: colors.textInverse,
          onPress: () => setSnackbarVisible(false),
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon 
            name={isOffline ? "cloud-offline-outline" : "lock-closed"} 
            size={16} 
            color={colors.textInverse} 
            style={{marginRight: 8}} 
          />
          <Text style={{color: colors.textInverse}}>
            {isOffline ? 'You are offline' : 'Follow to access this channel'}
          </Text>
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
    minWidth: 80,
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
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ChatScreen;