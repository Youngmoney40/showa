// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.3;

// const MusicSection = ({ navigation, colors }) => {
//   const [tracks, setTracks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMusic();
//   }, []);

//   const fetchMusic = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/music-list/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         // Take only first 10 tracks for horizontal scroll
//         setTracks(response.data.slice(0, 10));
//       }
//     } catch (error) {
//       console.error('Error fetching music:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTrackPress = (track) => {
//     navigation.navigate('MusicPlayer', { 
//       track: track,
//       tracks: tracks 
//     });
//   };

//   const renderMusicItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.musicCard, { backgroundColor: colors.card }]}
//       onPress={() => handleTrackPress(item)}
//       activeOpacity={0.8}
//     >
//       <View style={styles.imageContainer}>
//         {item.cover_image ? (
//           <Image
//             source={{ uri: `${API_ROUTE_IMAGE}${item.cover_image}` }}
//             style={styles.musicImage}
//             resizeMode="cover"
//           />
//         ) : (
//           <LinearGradient
//             colors={['#667eea', '#764ba2']}
//             style={styles.musicImage}
//           >
//             <Icon name="musical-notes" size={30} color="#fff" />
//           </LinearGradient>
//         )}
//         <View style={styles.playOverlay}>
//           <Icon name="play-circle" size={30} color="#fff" />
//         </View>
//       </View>
      
//       <Text style={[styles.musicTitle, { color: colors.text }]} numberOfLines={1}>
//         {item.title}
//       </Text>
//       <Text style={[styles.musicArtist, { color: colors.textSecondary }]} numberOfLines={1}>
//         {item.artist || 'Unknown Artist'}
//       </Text>
      
      
//     </TouchableOpacity>
//   );


//   if (tracks.length === 0) {
//     return null;
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon name="musical-notes" size={20} color={colors.primary} />
//           <Text style={[styles.headerTitle, { color: colors.text }]}>
//             Trending Music
//           </Text>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate('Music')}>
//           <Text style={[styles.seeAll, { color: colors.primary }]}>
//             See All
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         horizontal
//         data={tracks}
//         renderItem={renderMusicItem}
//         keyExtractor={(item) => `music-${item.id}`}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         snapToAlignment="start"
//         decelerationRate="fast"
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 12,
//     paddingHorizontal: 4,
       
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   seeAll: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   listContent: {
//     paddingHorizontal: 12,
//     gap: 12,
//   },
//   musicCard: {

//     width: CARD_WIDTH,
//     marginHorizontal: 4,
//     borderRadius: 12,
//     padding: 8,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//     marginBottom: 8,
//   },
//   imageContainer: {
//     position: 'relative',
//     width: CARD_WIDTH - 16,
//     height: CARD_WIDTH - 16,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 8,
//   },
//   musicImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     opacity: 0,
//   },
//   // On hover effect would be handled by TouchableOpacity
//   musicTitle: {
//     fontSize: 13,
//     fontWeight: '600',
//     textAlign: 'center',
//     width: '100%',
//     marginBottom: 2,
//   },
//   musicArtist: {
//     fontSize: 11,
//     textAlign: 'center',
//     width: '100%',
//   },
//   durationBadge: {
//     marginTop: 4,
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   durationText: {
//     fontSize: 9,
//     color: '#888',
//     fontWeight: '500',
//   },
//   loadingContainer: {
//     paddingVertical: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingText: {
//     marginTop: 88,
//     fontSize: 12,
//   },
// });

// export default MusicSection;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.3;

// Initialize MMKV storage
const storage = createMMKV({
  id: 'music-section-storage',
});

// Cache keys
const MUSIC_CACHE_KEY = 'music_section_cache';
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

// ============================================================
// MMKV CACHE FUNCTIONS
// ============================================================

const saveToMMKV = (key, data) => {
  try {
    console.log(`💾 Saving ${key} to MMKV cache...`);
    storage.set(key, JSON.stringify({
      data: data,
      timestamp: Date.now()
    }));
    console.log(`✅ ${key} saved to MMKV cache (${data.length} items)`);
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
        console.log(`✅ ${key} loaded from MMKV cache (${data.length} items)`);
        return data;
      } else {
        console.log(`⏰ ${key} cache expired`);
      }
    }
    console.log(`📭 ${key} not found in MMKV cache`);
    return null;
  } catch (error) {
    console.error(`❌ Error getting ${key} from MMKV:`, error);
    return null;
  }
};

const clearMMKVCache = () => {
  try {
    console.log('🗑️ Clearing music section MMKV cache...');
    storage.delete(MUSIC_CACHE_KEY);
    console.log('✅ Music section MMKV cache cleared');
  } catch (error) {
    console.error('❌ Error clearing MMKV cache:', error);
  }
};

const MusicSection = ({ navigation, colors }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // ============================================================
  // LOAD FROM MMKV CACHE
  // ============================================================
  const loadFromCache = useCallback(() => {
    try {
      const cachedTracks = getFromMMKV(MUSIC_CACHE_KEY);
      if (cachedTracks && cachedTracks.length > 0) {
        console.log('📦 Loading music from MMKV cache:', cachedTracks.length);
        setTracks(cachedTracks);
        setLoading(false);
        setHasLoadedOnce(true);
        return true;
      }
    } catch (error) {
      console.error('❌ Error loading music from MMKV cache:', error);
    }
    return false;
  }, []);

  // ============================================================
  // FETCH MUSIC
  // ============================================================
  const fetchMusic = useCallback(async (forceRefresh = false) => {
    // Skip if already loaded and not forced
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping music fetch - already loaded');
      return;
    }

    try {
      setLoading(true);
      console.log('🌐 Fetching music from API...');
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/music-list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (response.status === 200) {
        // Take only first 10 tracks for horizontal scroll
        const limitedTracks = response.data.slice(0, 10);
        setTracks(limitedTracks);
        setHasLoadedOnce(true);
        
        // Save to MMKV cache
        saveToMMKV(MUSIC_CACHE_KEY, limitedTracks);
        console.log(`✅ Saved ${limitedTracks.length} tracks to MMKV cache`);
      }
    } catch (error) {
      console.error('❌ Error fetching music:', error);
    } finally {
      setLoading(false);
    }
  }, [hasLoadedOnce]);

  // ============================================================
  // LOAD DATA - CACHE FIRST, THEN NETWORK
  // ============================================================
  const loadData = useCallback(async (forceRefresh = false) => {
    // If already loaded and not forced, skip
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping music load - already loaded');
      return;
    }

    // Try MMKV cache first
    const hasCache = loadFromCache();
    
    if (hasCache) {
      console.log('📂 Cache loaded, fetching fresh data in background...');
      // Fetch in background after a small delay
      setTimeout(() => {
        fetchMusic(forceRefresh).catch(err => 
          console.error('Background fetch error:', err)
        );
      }, 500);
    } else {
      // No cache, fetch from network
      console.log('📭 No cache, fetching from API...');
      await fetchMusic(forceRefresh);
    }
  }, [loadFromCache, fetchMusic, hasLoadedOnce]);

  // ============================================================
  // INITIAL LOAD - ONLY ONCE
  // ============================================================
  useEffect(() => {
    console.log('🚀 MusicSection initial load - checking MMKV cache...');
    loadData();
  }, []); // Empty dependency array = ONLY RUNS ONCE

  // ============================================================
  // FOCUS EFFECT - BACKGROUND REFRESH IF NEEDED
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      // Check if cache is expired and refresh in background
      const checkCacheAndRefresh = () => {
        try {
          const cached = storage.getString(MUSIC_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
            if (!isCacheValid) {
              console.log('🔄 Music cache expired, refreshing in background...');
              fetchMusic(true);
            } else {
              console.log('✅ Music cache still valid');
            }
          }
        } catch (error) {
          console.error('❌ Error checking music cache on focus:', error);
        }
      };
      
      checkCacheAndRefresh();
    }, [fetchMusic])
  );

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleTrackPress = (track) => {
    navigation.navigate('MusicPlayer', { 
      track: track,
      tracks: tracks 
    });
  };

  // ============================================================
  // RENDER ITEM
  // ============================================================
  const renderMusicItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.musicCard, { backgroundColor: colors.card }]}
      onPress={() => handleTrackPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {item.cover_image ? (
          <Image
            source={{ uri: `${API_ROUTE_IMAGE}${item.cover_image}` }}
            style={styles.musicImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.musicImage}
          >
            <Icon name="musical-notes" size={30} color="#fff" />
          </LinearGradient>
        )}
        <View style={styles.playOverlay}>
          <Icon name="play-circle" size={30} color="#fff" />
        </View>
      </View>
      
      <Text style={[styles.musicTitle, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.musicArtist, { color: colors.textSecondary }]} numberOfLines={1}>
        {item.artist || 'Unknown Artist'}
      </Text>
    </TouchableOpacity>
  );

  // ============================================================
  // RENDER LOADING SKELETON
  // ============================================================
  const renderSkeleton = () => (
    <View style={[styles.musicCard, { backgroundColor: colors.card }]}>
      <View style={[styles.imageContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={[styles.musicImage, { backgroundColor: colors.backgroundSecondary }]} />
      </View>
      <View style={[styles.skeletonText, { backgroundColor: colors.backgroundSecondary, height: 14, width: '80%', borderRadius: 4, marginBottom: 4 }]} />
      <View style={[styles.skeletonText, { backgroundColor: colors.backgroundSecondary, height: 10, width: '60%', borderRadius: 4 }]} />
    </View>
  );

  // ============================================================
  // RENDER
  // ============================================================

  // Show loading skeletons if loading and no cache
  if (loading && !hasLoadedOnce) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="musical-notes" size={20} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Trending Music
            </Text>
          </View>
        </View>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          renderItem={renderSkeleton}
          keyExtractor={(item) => `skeleton-${item}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  // If no tracks, return null
  if (tracks.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="musical-notes" size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Trending Music
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Music')}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={tracks}
        renderItem={renderMusicItem}
        keyExtractor={(item) => `music-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToAlignment="start"
        decelerationRate="fast"
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  musicCard: {
    width: CARD_WIDTH,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    width: CARD_WIDTH - 16,
    height: CARD_WIDTH - 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  musicTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    marginBottom: 2,
  },
  musicArtist: {
    fontSize: 11,
    textAlign: 'center',
    width: '100%',
  },
  durationBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 9,
    color: '#888',
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 88,
    fontSize: 12,
  },
  skeletonText: {
    marginTop: 4,
  },
});

export default MusicSection;