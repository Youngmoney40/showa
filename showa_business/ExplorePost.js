

// import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   FlatList,
//   RefreshControl,
//   Image,
//   Alert,
//   StatusBar,
//   Dimensions,
//   ActivityIndicator,
//   Share,
//   ScrollView,
//   Modal,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTheme } from '../src/context/ThemeContext';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import { useFocusEffect } from '@react-navigation/native';

// dayjs.extend(relativeTime);

// const { width, height } = Dimensions.get('window');
// const COLUMN_COUNT = 2;
// const GAP = 8;
// const IMAGE_SIZE = (width - 32 - GAP) / COLUMN_COUNT;

// // Cache keys
// const EXPLORE_CACHE_KEY = 'explore_cache_v2';
// const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

// const HeroItem = memo(({ item, onPress, colors }) => {
//   const imageUrl = item.all_images?.[0]?.url || item.image_url;
  
//   // If no image, don't render
//   if (!imageUrl) {
//     return null;
//   }
  
//   return (
//     <TouchableOpacity
//       style={styles.heroContainer}
//       onPress={() => onPress(item)}
//       activeOpacity={0.9}
//     >
//       <Image
//         source={{ uri: imageUrl }}
//         style={styles.heroImage}
//         resizeMode="cover"
//       />
//       <View style={styles.heroOverlay}>
//         <View style={styles.heroContent}>
//           <View style={styles.heroStats}>
//             <View style={styles.heroStat}>
//               <Ionicons name="heart" size={14} color="#FFFFFF" />
//               <Text style={styles.heroStatText}>{item.like_count || 0}</Text>
//             </View>
//             <View style={styles.heroStat}>
//               <Ionicons name="chatbubble" size={14} color="#FFFFFF" />
//               <Text style={styles.heroStatText}>{item.comment_count || 0}</Text>
//             </View>
//             <View style={styles.heroStat}>
//               <Ionicons name="eye" size={14} color="#FFFFFF" />
//               <Text style={styles.heroStatText}>{item.views || 0}</Text>
//             </View>
//           </View>
//           {item.content && (
//             <Text style={styles.heroCaption} numberOfLines={2}>
//               {item.content}
//             </Text>
//           )}
//           <View style={styles.heroUserInfo}>
//             <Image
//               source={
//                 item.user_profile_picture
//                   ? { uri: item.user_profile_picture }
//                   : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//               }
//               style={styles.heroAvatar}
//             />
//             <Text style={styles.heroUsername}>
//               {item.username || 'Anonymous'}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// });

// const GridItem = memo(({ item, index, onPress, colors }) => {
//   const imageUrl = item.all_images?.[0]?.url || item.image_url;
  
//   // If no image, don't render anything
//   if (!imageUrl) {
//     return null;
//   }
  
//   const isEven = index % 2 === 0;
  
//   return (
//     <TouchableOpacity
//       style={[
//         styles.gridItem,
//         { 
//           marginLeft: isEven ? 0 : GAP / 2,
//           marginRight: isEven ? GAP / 2 : 0,
//         }
//       ]}
//       onPress={() => onPress(item)}
//       activeOpacity={0.9}
//     >
//       <Image
//         source={{ uri: imageUrl }}
//         style={styles.gridImage}
//         resizeMode="cover"
//       />
//       <View style={styles.gridOverlay}>
//         <View style={styles.gridStats}>
//           <View style={styles.gridStat}>
//             <Ionicons name="heart" size={11} color="#FFFFFF" />
//             <Text style={styles.gridStatText}>{item.like_count || 0}</Text>
//           </View>
//           <View style={styles.gridStat}>
//             <Ionicons name="chatbubble" size={11} color="#FFFFFF" />
//             <Text style={styles.gridStatText}>{item.comment_count || 0}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// });

// // Memoized Row Component
// const RowItem = memo(({ items, onPress, colors }) => {
//   return (
//     <View style={styles.rowContainer}>
//       {items.map((item, index) => (
//         <GridItem 
//           key={item.id?.toString() || `item-${index}`}
//           item={item} 
//           index={index} 
//           onPress={onPress}
//           colors={colors}
//         />
//       ))}
//       {items.length === 1 && (
//         <View style={[styles.gridItem, { opacity: 0 }]} />
//       )}
//     </View>
//   );
// });

// const ExploreScreen = ({ navigation }) => {
//   const { colors, isDark } = useTheme();
//   const [activeTab, setActiveTab] = useState('trending');
//   const [trendingPosts, setTrendingPosts] = useState([]);
//   const [topCommented, setTopCommented] = useState([]);
//   const [topViewed, setTopViewed] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
//   const abortControllerRef = useRef(null);
//   const isMountedRef = useRef(true);



//   const hasImages = useCallback((post) => {
//     // Check if post has all_images array with at least one item
//     if (post.all_images && Array.isArray(post.all_images) && post.all_images.length > 0) {
//       return true;
//     }
//     // Check if post has image_url
//     if (post.image_url) {
//       return true;
//     }
//     return false;
//   }, []);



//   // ============================================================
//   // FIX IMAGE URL - MATCHES POSTDETAIL
//   // ============================================================
//   const fixImageUrl = useCallback((url) => {
//     if (!url) return null;
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return url;
//     }
//     if (url.startsWith('/media/')) {
//       return `${API_ROUTE_IMAGE}${url}`;
//     }
//     return `${API_ROUTE_IMAGE}${url}`;
//   }, []);

//   // ============================================================
//   // LOAD FROM CACHE - FAST INSTANT DISPLAY
//   // ============================================================
//   const loadFromCache = useCallback(async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(EXPLORE_CACHE_KEY);
//       if (cachedData) {
//         const parsed = JSON.parse(cachedData);
//         const { data, timestamp } = parsed;
        
//         const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//         if (isCacheValid && data) {
//           // 🔥 Filter cached data to only include posts with images
//           const filterPosts = (posts) => {
//             if (!posts || !Array.isArray(posts)) return [];
//             return posts.filter(post => {
//               const hasAllImages = post.all_images && Array.isArray(post.all_images) && post.all_images.length > 0;
//               const hasImageUrl = post.image_url && post.image_url.length > 0;
//               return hasAllImages || hasImageUrl;
//             });
//           };

//           const filteredTrending = filterPosts(data.trending);
//           const filteredViewed = filterPosts(data.topViewed);
//           const filteredCommented = filterPosts(data.topCommented);

//           console.log('Loading explore from cache:', {
//           trending: filteredTrending.length,
//           viewed: filteredViewed.length,
//           commented: filteredCommented.length
//         });
        
//         setTrendingPosts(filteredTrending);
//         setTopViewed(filteredViewed);
//         setTopCommented(filteredCommented);
//         setLoading(false);
//         setInitialLoadComplete(true);
//         setHasLoadedOnce(true);
//         return true;
//       } else {
//         console.log('Cache expired or invalid');
//       }
//     }
//   } catch (error) {
//     console.error('Error loading from cache:', error);
//   }
//   return false;
// }, []);

//   // ============================================================
//   // SAVE TO CACHE
//   // ============================================================
//   const saveToCache = useCallback(async (data) => {
//     try {
//       await AsyncStorage.setItem(
//         EXPLORE_CACHE_KEY,
//         JSON.stringify({
//           data: {
//             trending: data.trending || [],
//             topViewed: data.topViewed || [],
//             topCommented: data.topCommented || [],
//           },
//           timestamp: Date.now()
//         })
//       );
//       console.log('💾 Explore data saved to cache');
//     } catch (error) {
//       console.error('Error saving to cache:', error);
//     }
//   }, []);

//   // ============================================================
//   // FETCH TRENDING POSTS - OPTIMIZED
//   // ============================================================
//     const fetchTrendingPosts = useCallback(async (forceRefresh = false) => {
//   if (hasLoadedOnce && !forceRefresh) {
//     console.log('⏭️ Skipping fetch - already loaded');
//     return true;
//   }

//   try {
//     console.log('🌐 Fetching explore data from API...');
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       console.warn('No token found');
//       return false;
//     }

//     const response = await axios.get(`${API_ROUTE}/get-all-post/`, {
//       headers: { Authorization: `Bearer ${token}` },
//       timeout: 10000,
//     });

//     if (response.status === 200) {
//       let posts = response.data;
//       if (!Array.isArray(posts)) {
//         posts = posts.results || [];
//       }

//       // 🔥 FILTER: Only keep posts that have images
//       const postsWithImages = posts.filter(post => {
//         // Check if post has images
//         const hasAllImages = post.all_images && Array.isArray(post.all_images) && post.all_images.length > 0;
//         const hasImageUrl = post.image_url && post.image_url.length > 0;
//         return hasAllImages || hasImageUrl;
//       });

//       console.log(`📸 Filtered: ${posts.length} total, ${postsWithImages.length} with images`);

//       // Process posts with engagement scores
//       const postsWithEngagement = postsWithImages.map(post => ({
//         ...post,
//         all_images: post.all_images ? post.all_images.map(img => ({
//           ...img,
//           url: fixImageUrl(img.url)
//         })) : [],
//         image_url: post.image_url ? fixImageUrl(post.image_url) : null,
//         engagementScore: (post.views || 0) * 0.5 + (post.comment_count || 0) * 1.5 + (post.like_count || 0) * 0.8
//       }));

//       // Sort and slice
//       const sorted = postsWithEngagement.sort((a, b) => b.engagementScore - a.engagementScore);
//       const top20 = sorted.slice(0, 20);
      
//       const mostViewed = [...postsWithEngagement]
//         .sort((a, b) => (b.views || 0) - (a.views || 0))
//         .slice(0, 10);
      
//       const mostCommented = [...postsWithEngagement]
//         .sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0))
//         .slice(0, 10);

//       // Update state
//       setTrendingPosts(top20);
//       setTopViewed(mostViewed);
//       setTopCommented(mostCommented);
//       setHasLoadedOnce(true);

//       // Save to cache for next time
//       await saveToCache({
//         trending: top20,
//         topViewed: mostViewed,
//         topCommented: mostCommented,
//       });

//       // Prefetch first few images for instant display
//       top20.slice(0, 5).forEach(post => {
//         const img = post.all_images?.[0]?.url || post.image_url;
//         if (img) {
//           Image.prefetch(img).catch(() => {});
//         }
//       });

//       console.log('✅ Explore data fetched successfully');
//       return true;
//     }
//   } catch (error) {
//     console.error('Error fetching trending posts:', error);
//   }
//   return false;
// }, [fixImageUrl, saveToCache, hasLoadedOnce]);
//   // ============================================================
//   // LOAD DATA - CACHE FIRST, THEN NETWORK
//   // ============================================================
//   const loadData = useCallback(async (forceRefresh = false) => {
//     // If already loaded and not forced, skip
//     if (hasLoadedOnce && !forceRefresh) {
//       console.log('⏭️ Skipping load - already loaded');
//       return;
//     }

//     // Try cache first for instant display
//     const hasCache = await loadFromCache();
    
//     if (hasCache) {
      
//       fetchTrendingPosts(forceRefresh).catch(err => 
//         console.error('Background fetch error:', err)
//       );
//     } else {
//       // No cache, fetch from network
//       setLoading(true);
//       await fetchTrendingPosts(forceRefresh);
//       setLoading(false);
//     }
//   }, [loadFromCache, fetchTrendingPosts, hasLoadedOnce]);

//   // ============================================================
//   // REFRESH
//   // ============================================================
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchTrendingPosts(true);
//     setRefreshing(false);
//   }, [fetchTrendingPosts]);

//   // ============================================================
//   // NAVIGATE TO POST DETAIL - INSTANT
//   // ============================================================
//   const handlePostPress = useCallback((post) => {
//     navigation.navigate('ExplorePostDetails', { 
//       postId: post.id,
//       postData: post 
//     });
//   }, [navigation]);

//   // ============================================================
//   // INITIAL LOAD - ONLY ONCE
//   // ============================================================
//   useEffect(() => {
//     console.log('🚀 ExploreScreen initial load...');
//     loadData();
    
//     return () => {
//       isMountedRef.current = false;
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, []); // Empty dependency array = ONLY RUNS ONCE

//   // ============================================================
//   // FOCUS EFFECT - BACKGROUND REFRESH IF NEEDED
//   // ============================================================
//   useFocusEffect(
//     useCallback(() => {
//       // Only refresh if cache is expired
//       const checkCacheAndRefresh = async () => {
//         try {
//           const cachedData = await AsyncStorage.getItem(EXPLORE_CACHE_KEY);
//           if (cachedData) {
//             const parsed = JSON.parse(cachedData);
//             const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
//             if (!isCacheValid) {
//               console.log('🔄 Cache expired, refreshing in background...');
//               await fetchTrendingPosts(true);
//             } else {
//               console.log('✅ Cache still valid, no refresh needed');
//             }
//           }
//         } catch (error) {
//           console.error('Error checking cache on focus:', error);
//         }
//       };
      
//       checkCacheAndRefresh();
      
//       return () => {
//         // Cleanup if needed
//       };
//     }, [fetchTrendingPosts])
//   );

//   // ============================================================
//   // FORMAT DATA FOR COLUMNS
//   // ============================================================
//   const formatDataForColumns = useCallback((data) => {
//     if (!data || data.length === 0) return [];
    
//     const formattedData = [];
    
//     if (data.length > 0) {
//       formattedData.push({
//         type: 'hero',
//         data: data[0],
//         index: 0
//       });
//     }
    
//     const remainingItems = data.slice(1);
//     for (let i = 0; i < remainingItems.length; i += 2) {
//       const row = {
//         type: 'row',
//         items: [remainingItems[i]]
//       };
      
//       if (i + 1 < remainingItems.length) {
//         row.items.push(remainingItems[i + 1]);
//       }
      
//       formattedData.push(row);
//     }
    
//     return formattedData;
//   }, []);

//   // ============================================================
//   // RENDER FUNCTIONS
//   // ============================================================
//   const renderMainContent = useCallback(() => {
//     let data = [];

//     switch (activeTab) {
//       case 'trending':
//         data = trendingPosts;
//         break;
//       case 'viewed':
//         data = topViewed;
//         break;
//       case 'commented':
//         data = topCommented;
//         break;
//       default:
//         data = trendingPosts;
//     }

//     // Show loading only on first load with no cache
//     if (loading && !initialLoadComplete) {
//       return (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={colors.primary} />
//           <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
//             Loading explore content...
//           </Text>
//         </View>
//       );
//     }

//     if (data.length === 0) {
//       return (
//         <View style={styles.emptyContainer}>
//           <MaterialCommunityIcons name="compass-off" size={64} color={colors.textSecondary} />
//           <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing to show</Text>
//           <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//             Check back later for trending content
//           </Text>
//           <TouchableOpacity 
//             style={[styles.retryButton, { backgroundColor: colors.primary }]}
//             onPress={onRefresh}
//           >
//             <Text style={styles.retryButtonText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     const formattedData = formatDataForColumns(data);

//     return (
//       <FlatList
//         data={formattedData}
//         renderItem={({ item }) => {
//           if (item.type === 'hero') {
//             return (
//               <HeroItem 
//                 item={item.data} 
//                 onPress={handlePostPress}
//                 colors={colors}
//               />
//             );
//           } else if (item.type === 'row') {
//             return (
//               <RowItem 
//                 items={item.items} 
//                 onPress={handlePostPress}
//                 colors={colors}
//               />
//             );
//           }
//           return null;
//         }}
//         keyExtractor={(item, index) => {
//           if (item.type === 'hero') {
//             return `hero-${item.data.id || index}`;
//           }
//           return `row-${index}`;
//         }}
//         scrollEnabled={false}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.mainContent}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={10}
//         initialNumToRender={8}
//         windowSize={5}
//       />
//     );
//   }, [
//     activeTab, 
//     trendingPosts, 
//     topViewed, 
//     topCommented, 
//     loading, 
//     initialLoadComplete, 
//     colors,
//     formatDataForColumns,
//     handlePostPress,
//     onRefresh
//   ]);

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background}
//       />

     
//       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()} 
//             style={styles.backButton}
//           >
//             <Ionicons name="arrow-back" size={24} color={colors.text} />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
//         </View>
//         <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//           <Ionicons name="refresh-outline" size={24} color={colors.text} />
//         </TouchableOpacity>
//       </View>
      

//       {/* Tabs */}
//       <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
//           onPress={() => setActiveTab('trending')}
//         >
//           <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText, { 
//             color: activeTab === 'trending' ? colors.primary : colors.textSecondary 
//           }]}>
//            Trending Now
//           </Text>
//           {activeTab === 'trending' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'viewed' && styles.activeTab]}
//           onPress={() => setActiveTab('viewed')}
//         >
//           <Text style={[styles.tabText, activeTab === 'viewed' && styles.activeTabText, { 
//             color: activeTab === 'viewed' ? colors.primary : colors.textSecondary 
//           }]}>
//             Most Viewed 
//           </Text>
//           {activeTab === 'viewed' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'commented' && styles.activeTab]}
//           onPress={() => setActiveTab('commented')}
//         >
//           <Text style={[styles.tabText, activeTab === 'commented' && styles.activeTabText, { 
//             color: activeTab === 'commented' ? colors.primary : colors.textSecondary 
//           }]}>
//             Most Discussed 
//           </Text>
//           {activeTab === 'commented' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.contentContainer}
//       >
//         {renderMainContent()}
//         <View style={styles.bottomPadding} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//   },
//   refreshButton: {
//     padding: 4,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     borderBottomWidth: 0.5,
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 10,
//     position: 'relative',
//   },
//   tabText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   activeTabText: {
//     fontWeight: '700',
//   },
//   tabIndicator: {
//     position: 'absolute',
//     bottom: -2,
//     width: 30,
//     height: 3,
//     borderRadius: 2,
//   },
//   contentContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     paddingVertical: 60,
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//   },
//   emptyContainer: {
//     paddingVertical: 80,
//     alignItems: 'center',
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginTop: 16,
//   },
//   emptyText: {
//     fontSize: 14,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 16,
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 24,
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   mainContent: {
//     paddingBottom: 8,
//   },
  
//   // Hero Item Styles
//   heroContainer: {
//     width: width - 32,
//     height: 300,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 12,
//     backgroundColor: '#F0F0F0',
//     position: 'relative',
//   },
//   heroImage: {
//     width: '100%',
//     height: '100%',
//   },
//   heroOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     flexDirection: 'column',
//   },
//   heroContent: {
//     flex: 1,
//   },
//   heroStats: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   heroStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   heroStatText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     marginLeft: 4,
//     fontWeight: '600',
//   },
//   heroCaption: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '500',
//     marginBottom: 8,
//   },
//   headerLeft: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// backButton: {
//   padding: 4,
//   marginRight: 8,
// },
//   heroUserInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   heroAvatar: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   heroUsername: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   heroPlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Row Container
//   rowContainer: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },

//   // Grid Item Styles
//   gridItem: {
//     flex: 1,
//     height: IMAGE_SIZE,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#F0F0F0',
//     position: 'relative',
//   },
//   gridImage: {
//     width: '100%',
//     height: '100%',
//   },
//   gridOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 8,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   gridStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   gridStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   gridStatText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     marginLeft: 3,
//     fontWeight: '600',
//   },
//   gridPlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bottomPadding: {
//     height: 80,
//   },
// });

// export default ExploreScreen;

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Alert,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Share,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { createMMKV } from 'react-native-mmkv';
import { useTheme } from '../src/context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useFocusEffect } from '@react-navigation/native';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const GAP = 8;
const IMAGE_SIZE = (width - 32 - GAP) / COLUMN_COUNT;

// Initialize MMKV storage
const storage = createMMKV({
  id: 'explore-storage',
});

// Cache keys
const EXPLORE_CACHE_KEY = 'explore_cache_v2';
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

const HeroItem = memo(({ item, onPress, colors }) => {
  const imageUrl = item.all_images?.[0]?.url || item.image_url;
  
  if (!imageUrl) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={styles.heroContainer}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <View style={styles.heroOverlay}>
        <View style={styles.heroContent}>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Ionicons name="heart" size={14} color="#FFFFFF" />
              <Text style={styles.heroStatText}>{item.like_count || 0}</Text>
            </View>
            <View style={styles.heroStat}>
              <Ionicons name="chatbubble" size={14} color="#FFFFFF" />
              <Text style={styles.heroStatText}>{item.comment_count || 0}</Text>
            </View>
            <View style={styles.heroStat}>
              <Ionicons name="eye" size={14} color="#FFFFFF" />
              <Text style={styles.heroStatText}>{item.views || 0}</Text>
            </View>
          </View>
          {item.content && (
            <Text style={styles.heroCaption} numberOfLines={2}>
              {item.content}
            </Text>
          )}
          <View style={styles.heroUserInfo}>
            <Image
              source={
                item.user_profile_picture
                  ? { uri: item.user_profile_picture }
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.heroAvatar}
            />
            <Text style={styles.heroUsername}>
              {item.username || 'Anonymous'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const GridItem = memo(({ item, index, onPress, colors }) => {
  const imageUrl = item.all_images?.[0]?.url || item.image_url;
  
  if (!imageUrl) {
    return null;
  }
  
  const isEven = index % 2 === 0;
  
  return (
    <TouchableOpacity
      style={[
        styles.gridItem,
        { 
          marginLeft: isEven ? 0 : GAP / 2,
          marginRight: isEven ? GAP / 2 : 0,
        }
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.gridImage}
        resizeMode="cover"
      />
      <View style={styles.gridOverlay}>
        <View style={styles.gridStats}>
          <View style={styles.gridStat}>
            <Ionicons name="heart" size={11} color="#FFFFFF" />
            <Text style={styles.gridStatText}>{item.like_count || 0}</Text>
          </View>
          <View style={styles.gridStat}>
            <Ionicons name="chatbubble" size={11} color="#FFFFFF" />
            <Text style={styles.gridStatText}>{item.comment_count || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Memoized Row Component
const RowItem = memo(({ items, onPress, colors }) => {
  return (
    <View style={styles.rowContainer}>
      {items.map((item, index) => (
        <GridItem 
          key={item.id?.toString() || `item-${index}`}
          item={item} 
          index={index} 
          onPress={onPress}
          colors={colors}
        />
      ))}
      {items.length === 1 && (
        <View style={[styles.gridItem, { opacity: 0 }]} />
      )}
    </View>
  );
});

const ExploreScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('trending');
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [topCommented, setTopCommented] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const hasImages = useCallback((post) => {
    if (post.all_images && Array.isArray(post.all_images) && post.all_images.length > 0) {
      return true;
    }
    if (post.image_url) {
      return true;
    }
    return false;
  }, []);

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
  // LOAD FROM CACHE - USING MMKV (PERSISTENT)
  // ============================================================
  const loadFromCache = useCallback(() => {
    try {
      const cachedData = storage.getString(EXPLORE_CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const { data, timestamp } = parsed;
        
        const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
        if (isCacheValid && data) {
          // Filter cached data to only include posts with images
          const filterPosts = (posts) => {
            if (!posts || !Array.isArray(posts)) return [];
            return posts.filter(post => {
              const hasAllImages = post.all_images && Array.isArray(post.all_images) && post.all_images.length > 0;
              const hasImageUrl = post.image_url && post.image_url.length > 0;
              return hasAllImages || hasImageUrl;
            });
          };

          const filteredTrending = filterPosts(data.trending);
          const filteredViewed = filterPosts(data.topViewed);
          const filteredCommented = filterPosts(data.topCommented);

          console.log('Loading explore from MMKV cache:', {
            trending: filteredTrending.length,
            viewed: filteredViewed.length,
            commented: filteredCommented.length
          });
          
          setTrendingPosts(filteredTrending);
          setTopViewed(filteredViewed);
          setTopCommented(filteredCommented);
          setLoading(false);
          setInitialLoadComplete(true);
          setHasLoadedOnce(true);
          return true;
        } else {
          console.log('Cache expired or invalid');
        }
      }
    } catch (error) {
      console.error('Error loading from MMKV cache:', error);
    }
    return false;
  }, []);

  // ============================================================
  // SAVE TO CACHE - USING MMKV (PERSISTENT)
  // ============================================================
  const saveToCache = useCallback((data) => {
    try {
      storage.set(
        EXPLORE_CACHE_KEY,
        JSON.stringify({
          data: {
            trending: data.trending || [],
            topViewed: data.topViewed || [],
            topCommented: data.topCommented || [],
          },
          timestamp: Date.now()
        })
      );
      console.log('💾 Explore data saved to MMKV cache');
    } catch (error) {
      console.error('Error saving to MMKV cache:', error);
    }
  }, []);

  // ============================================================
  // CLEAR CACHE
  // ============================================================
  const clearCache = useCallback(() => {
    try {
      storage.delete(EXPLORE_CACHE_KEY);
      console.log('🗑️ Explore cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  // ============================================================
  // FETCH TRENDING POSTS
  // ============================================================
  const fetchTrendingPosts = useCallback(async (forceRefresh = false) => {
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping fetch - already loaded');
      return true;
    }

    try {
      console.log('Fetching explore data from API...');
      
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.warn('No token found');
        return false;
      }

      const response = await axios.get(`${API_ROUTE}/get-all-post/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (response.status === 200) {
        let posts = response.data;
        if (!Array.isArray(posts)) {
          posts = posts.results || [];
        }

        // Filter: Only keep posts that have images
        const postsWithImages = posts.filter(post => {
          const hasAllImages = post.all_images && Array.isArray(post.all_images) && post.all_images.length > 0;
          const hasImageUrl = post.image_url && post.image_url.length > 0;
          return hasAllImages || hasImageUrl;
        });

        console.log(`📸 Filtered: ${posts.length} total, ${postsWithImages.length} with images`);

        // Process posts with engagement scores
        const postsWithEngagement = postsWithImages.map(post => ({
          ...post,
          all_images: post.all_images ? post.all_images.map(img => ({
            ...img,
            url: fixImageUrl(img.url)
          })) : [],
          image_url: post.image_url ? fixImageUrl(post.image_url) : null,
          engagementScore: (post.views || 0) * 0.5 + (post.comment_count || 0) * 1.5 + (post.like_count || 0) * 0.8
        }));

        // Sort and slice
        const sorted = postsWithEngagement.sort((a, b) => b.engagementScore - a.engagementScore);
        const top20 = sorted.slice(0, 20);
        
        const mostViewed = [...postsWithEngagement]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 10);
        
        const mostCommented = [...postsWithEngagement]
          .sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0))
          .slice(0, 10);

        // Update state
        setTrendingPosts(top20);
        setTopViewed(mostViewed);
        setTopCommented(mostCommented);
        setHasLoadedOnce(true);

        // Save to MMKV cache
        await saveToCache({
          trending: top20,
          topViewed: mostViewed,
          topCommented: mostCommented,
        });

        // Prefetch first few images for instant display
        top20.slice(0, 5).forEach(post => {
          const img = post.all_images?.[0]?.url || post.image_url;
          if (img) {
            Image.prefetch(img).catch(() => {});
          }
        });

        console.log('Explore data fetched successfully');
        return true;
      }
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    }
    return false;
  }, [fixImageUrl, saveToCache, hasLoadedOnce]);

  // ============================================================
  // LOAD DATA - CACHE FIRST, THEN NETWORK
  // ============================================================
  const loadData = useCallback(async (forceRefresh = false) => {
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping load - already loaded');
      return;
    }

    // Try cache first for instant display (MMKV is persistent)
    const hasCache = loadFromCache();
    
    if (hasCache) {
      // Fetch in background for fresh data
      fetchTrendingPosts(forceRefresh).catch(err => 
        console.error('Background fetch error:', err)
      );
    } else {
      // No cache, fetch from network
      setLoading(true);
      await fetchTrendingPosts(forceRefresh);
      setLoading(false);
    }
  }, [loadFromCache, fetchTrendingPosts, hasLoadedOnce]);

  // ============================================================
  // REFRESH
  // ============================================================
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    clearCache(); // Clear cache before refresh
    await fetchTrendingPosts(true);
    setRefreshing(false);
  }, [fetchTrendingPosts, clearCache]);

  // ============================================================
  // NAVIGATE TO POST DETAIL
  // ============================================================
  const handlePostPress = useCallback((post) => {
    navigation.navigate('ExplorePostDetails', { 
      postId: post.id,
      postData: post 
    });
  }, [navigation]);

  // ============================================================
  // INITIAL LOAD
  // ============================================================
  useEffect(() => {
    console.log('ExploreScreen initial load...');
    loadData();
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ============================================================
  // FOCUS EFFECT - BACKGROUND REFRESH IF CACHE EXPIRED
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      // Check cache and refresh if expired
      const checkCacheAndRefresh = async () => {
        try {
          const cachedData = storage.getString(EXPLORE_CACHE_KEY);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
            if (!isCacheValid) {
              console.log('🔄 Cache expired, refreshing in background...');
              await fetchTrendingPosts(true);
            } else {
              console.log('✅ Cache still valid, no refresh needed');
            }
          }
        } catch (error) {
          console.error('Error checking cache on focus:', error);
        }
      };
      
      checkCacheAndRefresh();
      
      return () => {
        // Cleanup if needed
      };
    }, [fetchTrendingPosts])
  );

  // ============================================================
  // FORMAT DATA FOR COLUMNS
  // ============================================================
  const formatDataForColumns = useCallback((data) => {
    if (!data || data.length === 0) return [];
    
    const formattedData = [];
    
    if (data.length > 0) {
      formattedData.push({
        type: 'hero',
        data: data[0],
        index: 0
      });
    }
    
    const remainingItems = data.slice(1);
    for (let i = 0; i < remainingItems.length; i += 2) {
      const row = {
        type: 'row',
        items: [remainingItems[i]]
      };
      
      if (i + 1 < remainingItems.length) {
        row.items.push(remainingItems[i + 1]);
      }
      
      formattedData.push(row);
    }
    
    return formattedData;
  }, []);

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================
  const renderMainContent = useCallback(() => {
    let data = [];

    switch (activeTab) {
      case 'trending':
        data = trendingPosts;
        break;
      case 'viewed':
        data = topViewed;
        break;
      case 'commented':
        data = topCommented;
        break;
      default:
        data = trendingPosts;
    }

    if (loading && !initialLoadComplete) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading explore content...
          </Text>
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="compass-off" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing to show</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Check back later for trending content
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={onRefresh}
          >
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const formattedData = formatDataForColumns(data);

    return (
      <FlatList
        data={formattedData}
        renderItem={({ item }) => {
          if (item.type === 'hero') {
            return (
              <HeroItem 
                item={item.data} 
                onPress={handlePostPress}
                colors={colors}
              />
            );
          } else if (item.type === 'row') {
            return (
              <RowItem 
                items={item.items} 
                onPress={handlePostPress}
                colors={colors}
              />
            );
          }
          return null;
        }}
        keyExtractor={(item, index) => {
          if (item.type === 'hero') {
            return `hero-${item.data.id || index}`;
          }
          return `row-${index}`;
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={8}
        windowSize={5}
      />
    );
  }, [
    activeTab, 
    trendingPosts, 
    topViewed, 
    topCommented, 
    loading, 
    initialLoadComplete, 
    colors,
    formatDataForColumns,
    handlePostPress,
    onRefresh
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, elevation:10 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}
        >
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText, { 
            color: activeTab === 'trending' ? colors.primary : colors.textSecondary 
          }]}>
            Trending Now
          </Text>
          {activeTab === 'trending' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'viewed' && styles.activeTab]}
          onPress={() => setActiveTab('viewed')}
        >
          <Text style={[styles.tabText, activeTab === 'viewed' && styles.activeTabText, { 
            color: activeTab === 'viewed' ? colors.primary : colors.textSecondary 
          }]}>
            Most Viewed
          </Text>
          {activeTab === 'viewed' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'commented' && styles.activeTab]}
          onPress={() => setActiveTab('commented')}
        >
          <Text style={[styles.tabText, activeTab === 'commented' && styles.activeTabText, { 
            color: activeTab === 'commented' ? colors.primary : colors.textSecondary 
          }]}>
            Most Discussed
          </Text>
          {activeTab === 'commented' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderMainContent()}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
  },
  refreshButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  heroContainer: {
    width: width - 32,
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'column',
  },
  heroContent: {
    flex: 1,
  },
  heroStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  heroStatText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '600',
  },
  heroCaption: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  heroUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroUsername: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  gridItem: {
    flex: 1,
    height: IMAGE_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  gridStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gridStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridStatText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 3,
    fontWeight: '600',
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPadding: {
    height: 80,
  },
});

export default ExploreScreen;
