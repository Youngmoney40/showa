
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Dimensions,
//   Animated,
//   ScrollView,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';

// const { width, height } = Dimensions.get('window');
// const API_BASE_URL = 'https://backend.ehangouts.com';

// const HangoutPlacesRow = ({ navigation, maxItems = 6, title = 'Hangout Places' }) => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageErrors, setImageErrors] = useState({});
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const autoPlayTimerRef = useRef(null);
//   const scrollX = useRef(new Animated.Value(0)).current;

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     }
//     if (imagePath.startsWith('/')) {
//       return `${API_BASE_URL}${imagePath}`;
//     }
//     return `${API_BASE_URL}/media/${imagePath}`;
//   };

//   const getFirstImage = (place) => {
//     if (place.images && place.images.length > 0) {
//       return getImageUrl(place.images[0].image);
//     }
//     return null;
//   };

//   const getCategoryColor = (categoryName) => {
//     const colors_map = {
//       'Beaches': '#f39c12',
//       'Restaurants': '#e74c3c',
//       'Bars & Clubs': '#9b59b6',
//       'Art Gallary': '#3498db',
//       'Movie Theaters': '#e67e22',
//       'Museums': '#2ecc71',
//       'Zoo': '#1abc9c',
//       'Theme Parks': '#e74c3c',
//       'Concert Halls': '#8e44ad',
//       'Libraries': '#2980b9',
//       'Lakes & Rivers': '#3498db',
//       'Ski Resorts': '#95a5a6',
//       'Spas': '#f1c40f',
//       'Arcades': '#e67e22',
//       'Bar': '#f39c12',
//       'Sports Arenas': '#2ecc71',
//       'Golf Courses': '#27ae60',
//       'Gyms': '#e74c3c',
//       'Camping Sites': '#2ecc71',
//       'Wine Tours': '#8e44ad',
//       'Car Shows': '#3498db',
//       'Skydiving': '#e67e22',
//       'Fishing Trips': '#2980b9',
//       'Water Parks': '#1abc9c',
//       'Paintball Arenas': '#27ae60',
//       'Go-Kart Racing': '#e74c3c',
//       'Skating Rinks': '#9b59b6',
//       'Shopping Malls': '#f39c12',
//       'Jet Skiting': '#3498db',
//       'Media Houses': '#2c3e50',
//       'Night Clubs': '#8e44ad',
//       'Comedy Shows': '#e67e22',
//       'Launches': '#e74c3c',
//       'Boxing': '#c0392b',
//       'Wrestling': '#2980b9',
//       'Cinema': '#e74c3c',
//     };
//     return colors_map[categoryName] || '#666';
//   };

//   const fetchHangoutPlaces = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/hangout-places/`);
//       if (response.status === 200 || response.status === 201) {
//         let data = response.data;
//         data = data.filter(place => !place.slug?.match(/-\d+$/));
//         const limitedData = data.slice(0, maxItems);
//         setPlaces(limitedData);
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }).start();
//       }
//     } catch (error) {
//       console.error('Error fetching hangout places:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHangoutPlaces();
//   }, []);

//   // Auto-slide functionality
//   useEffect(() => {
//     if (places.length > 0 && !loading) {
//       startAutoPlay();
//     }
//     return () => {
//       stopAutoPlay();
//     };
//   }, [places, loading]);

//   const startAutoPlay = () => {
//     stopAutoPlay();
//     autoPlayTimerRef.current = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % places.length;
//       setCurrentIndex(nextIndex);
//       if (flatListRef.current) {
//         flatListRef.current.scrollToIndex({
//           index: nextIndex,
//           animated: true,
//         });
//       }
//     }, 3500); // Change slide every 3.5 seconds
//   };

//   const stopAutoPlay = () => {
//     if (autoPlayTimerRef.current) {
//       clearInterval(autoPlayTimerRef.current);
//       autoPlayTimerRef.current = null;
//     }
//   };

//   const handleScrollEnd = (event) => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / (width * 0.85));
//     setCurrentIndex(index);
//     // Reset timer when user manually scrolls
//     stopAutoPlay();
//     startAutoPlay();
//   };

//   const handleImageError = (placeId) => {
//     setImageErrors(prev => ({ ...prev, [placeId]: true }));
//   };

//   const renderPlaceItem = ({ item, index }) => {
//     const imageUrl = getFirstImage(item);
//     const categoryColor = getCategoryColor(item.category?.name);
//     const hasError = imageErrors[item.id];
//     const isActive = index === currentIndex;

//     return (
//       <TouchableOpacity
//         style={styles.placeItem}
//         onPress={() => navigation.navigate('HangoutPlaceDetail', { place: item })}
//         activeOpacity={0.9}
//       >
//         <View style={styles.placeImageContainer}>
//           {imageUrl && !hasError ? (
//             <Image
//               source={{ uri: imageUrl }}
//               style={styles.placeImage}
//               resizeMode="cover"
//               onError={() => handleImageError(item.id)}
//             />
//           ) : (
//             <View style={styles.placeImagePlaceholder}>
//               <Ionicons name="image-outline" size={50} color="#ccc" />
//             </View>
//           )}
          
//           {/* Gradient Overlay */}
//           <View style={styles.imageOverlay} />
          
        

//           {/* Place Info Overlay */}
//           <View style={styles.placeInfoOverlay}>
//             <Text style={styles.placeName} numberOfLines={1}>
//               {item.name}
//             </Text>
//             <View style={styles.locationContainer}>
//               <Ionicons name="location-outline" size={16} color="#fff" />
//               <Text style={styles.locationText} numberOfLines={1}>
//                 {item.location || 'Lagos, Nigeria'}
//               </Text>
//             </View>
//             <View style={styles.statsContainer}>
//               <View style={styles.statItem}>
//                 <Ionicons name="eye-outline" size={14} color="#fff" />
//                 <Text style={styles.statText}>{item.view_count || 0}</Text>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statItem}>
//                 <Ionicons name="star" size={14} color="#FFD700" />
//                 <Text style={styles.statText}>4.5</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderDot = (index) => {
//     const isActive = index === currentIndex;
//     return (
//       <View
//         key={index}
//         style={[
//           styles.dot,
//           {
//             backgroundColor: isActive ? '#0d64dd' : '#ccc',
//             width: isActive ? 20 : 8,
//           },
//         ]}
//       />
//     );
//   };

//   const renderSkeleton = () => (
//     <View style={styles.skeletonItem}>
//       <View style={styles.skeletonImage} />
//       <View style={styles.skeletonOverlay}>
//         <View style={styles.skeletonText} />
//         <View style={[styles.skeletonText, { width: '60%' }]} />
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>{title}</Text>
//           <View style={styles.skeletonExplore}>
//             <Text style={[styles.exploreText, { color: '#ccc' }]}> See All</Text>
//           </View>
//         </View>
//         <FlatList
//           data={[1, 2, 3]}
//           renderItem={renderSkeleton}
//           keyExtractor={(item) => item.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.skeletonList}
//           snapToInterval={width * 0.85 + 16}
//           decelerationRate="fast"
//         />
//       </View>
//     );
//   }

//   if (places.length === 0) {
//     return null;
//   }

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{title}</Text>
//         <TouchableOpacity
//           style={styles.exploreButton}
//           onPress={() => navigation.navigate('HangoutPlaces')}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.exploreText}>See All</Text>
//           <Ionicons name="chevron-forward" size={16} color="#0d64dd" />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         ref={flatListRef}
//         data={places}
//         renderItem={renderPlaceItem}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         snapToInterval={width * 0.85 + 16}
//         decelerationRate="fast"
//         onMomentumScrollEnd={handleScrollEnd}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false }
//         )}
//         getItemLayout={(data, index) => ({
//           length: width * 0.85 + 16,
//           offset: (width * 0.85 + 16) * index,
//           index,
//         })}
//       />

//       {/* Dots Indicator */}
//       {places.length > 1 && (
//         <View style={styles.dotsContainer}>
//           {places.map((_, index) => renderDot(index))}
//         </View>
//       )}
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   exploreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   exploreText: {
//     fontSize: 14,
//     color: '#0d64dd',
//     fontWeight: '500',
//     marginRight: 2,
//   },
//   skeletonExplore: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 12,
//   },
//   skeletonList: {
//     paddingHorizontal: 16,
//   },
//   placeItem: {
//     width: width * 0.85,
//     marginHorizontal: 8,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#f8f8f8',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },
//   placeImageContainer: {
//     position: 'relative',
//     height: height * 0.32,
//     backgroundColor: '#e0e0e0',
//   },
//   placeImage: {
//     width: '100%',
//     height: '100%',
//   },
//   placeImagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '60%',
//     backgroundColor: 'transparent',
//     backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
//   },
//   categoryBadge: {
//     position: 'absolute',
//     top: 16,
//     left: 16,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   categoryBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   placeInfoOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//   },
//   placeName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   locationText: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginLeft: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   statText: {
//     fontSize: 13,
//     color: '#fff',
//     marginLeft: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   statDivider: {
//     width: 1,
//     height: 16,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     marginHorizontal: 12,
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 14,
//     paddingHorizontal: 16,
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//     transition: 'all 0.3s ease',
//   },
//   skeletonItem: {
//     width: width * 0.85,
//     marginHorizontal: 8,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#f0f0f0',
//   },
//   skeletonImage: {
//     height: height * 0.32,
//     backgroundColor: '#e0e0e0',
//   },
//   skeletonOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//   },
//   skeletonText: {
//     height: 20,
//     backgroundColor: '#d0d0d0',
//     borderRadius: 4,
//     marginBottom: 8,
//     width: '80%',
//   },
// });

// export default HangoutPlacesRow;


// import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Dimensions,
//   Animated,
//   ScrollView,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');
// const API_BASE_URL = 'https://backend.ehangouts.com';

// // Cache keys
// const HANGOUT_CACHE_KEY = 'hangout_places_cache_v2';
// const CACHE_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes

// // Memoized Place Item Component
// const PlaceItem = memo(({ item, index, currentIndex, onPress, onImageError, imageErrors }) => {
//   const imageUrl = getFirstImage(item);
//   const categoryColor = getCategoryColor(item.category?.name);
//   const hasError = imageErrors[item.id];
//   const isActive = index === currentIndex;

//   return (
//     <TouchableOpacity
//       style={styles.placeItem}
//       onPress={() => onPress(item)}
//       activeOpacity={0.9}
//     >
//       <View style={styles.placeImageContainer}>
//         {imageUrl && !hasError ? (
//           <Image
//             source={{ uri: imageUrl }}
//             style={styles.placeImage}
//             resizeMode="cover"
//             onError={() => onImageError(item.id)}
//           />
//         ) : (
//           <View style={styles.placeImagePlaceholder}>
//             <Ionicons name="image-outline" size={50} color="#ccc" />
//           </View>
//         )}
        
//         {/* Gradient Overlay */}
//         <View style={styles.imageOverlay} />

//         {/* Place Info Overlay */}
//         <View style={styles.placeInfoOverlay}>
//           <Text style={styles.placeName} numberOfLines={1}>
//             {item.name}
//           </Text>
//           <View style={styles.locationContainer}>
//             <Ionicons name="location-outline" size={16} color="#fff" />
//             <Text style={styles.locationText} numberOfLines={1}>
//               {item.location || 'Lagos, Nigeria'}
//             </Text>
//           </View>
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Ionicons name="eye-outline" size={14} color="#fff" />
//               <Text style={styles.statText}>{item.view_count || 0}</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Ionicons name="star" size={14} color="#FFD700" />
//               <Text style={styles.statText}>4.5</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// });

// // Helper functions
// const getImageUrl = (imagePath) => {
//   if (!imagePath) return null;
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
//   if (imagePath.startsWith('/')) {
//     return `${API_BASE_URL}${imagePath}`;
//   }
//   return `${API_BASE_URL}/media/${imagePath}`;
// };

// const getFirstImage = (place) => {
//   if (place.images && place.images.length > 0) {
//     return getImageUrl(place.images[0].image);
//   }
//   return null;
// };

// const getCategoryColor = (categoryName) => {
//   const colors_map = {
//     'Beaches': '#f39c12',
//     'Restaurants': '#e74c3c',
//     'Bars & Clubs': '#9b59b6',
//     'Art Gallary': '#3498db',
//     'Movie Theaters': '#e67e22',
//     'Museums': '#2ecc71',
//     'Zoo': '#1abc9c',
//     'Theme Parks': '#e74c3c',
//     'Concert Halls': '#8e44ad',
//     'Libraries': '#2980b9',
//     'Lakes & Rivers': '#3498db',
//     'Ski Resorts': '#95a5a6',
//     'Spas': '#f1c40f',
//     'Arcades': '#e67e22',
//     'Bar': '#f39c12',
//     'Sports Arenas': '#2ecc71',
//     'Golf Courses': '#27ae60',
//     'Gyms': '#e74c3c',
//     'Camping Sites': '#2ecc71',
//     'Wine Tours': '#8e44ad',
//     'Car Shows': '#3498db',
//     'Skydiving': '#e67e22',
//     'Fishing Trips': '#2980b9',
//     'Water Parks': '#1abc9c',
//     'Paintball Arenas': '#27ae60',
//     'Go-Kart Racing': '#e74c3c',
//     'Skating Rinks': '#9b59b6',
//     'Shopping Malls': '#f39c12',
//     'Jet Skiting': '#3498db',
//     'Media Houses': '#2c3e50',
//     'Night Clubs': '#8e44ad',
//     'Comedy Shows': '#e67e22',
//     'Launches': '#e74c3c',
//     'Boxing': '#c0392b',
//     'Wrestling': '#2980b9',
//     'Cinema': '#e74c3c',
//   };
//   return colors_map[categoryName] || '#666';
// };

// const HangoutPlacesRow = ({ navigation, maxItems = 6, title = 'Hangout Places' }) => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageErrors, setImageErrors] = useState({});
//   const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const autoPlayTimerRef = useRef(null);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const isMountedRef = useRef(true);

//   // ============================================================
//   // LOAD FROM CACHE - FAST INSTANT DISPLAY
//   // ============================================================
//   const loadFromCache = useCallback(async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(HANGOUT_CACHE_KEY);
//       if (cachedData) {
//         const parsed = JSON.parse(cachedData);
//         const { data, timestamp } = parsed;
        
//         const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//         if (isCacheValid && data && data.length > 0) {
//           console.log('📦 Loading hangout places from cache:', data.length);
//           setPlaces(data);
//           setLoading(false);
//           setHasLoadedOnce(true);
          
//           Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 400,
//             useNativeDriver: true,
//           }).start();
          
//           return true;
//         } else {
//           console.log('⏰ Hangout cache expired');
//         }
//       }
//     } catch (error) {
//       console.error('Error loading hangout places from cache:', error);
//     }
//     return false;
//   }, [fadeAnim]);

//   // ============================================================
//   // SAVE TO CACHE
//   // ============================================================
//   const saveToCache = useCallback(async (data) => {
//     try {
//       await AsyncStorage.setItem(
//         HANGOUT_CACHE_KEY,
//         JSON.stringify({
//           data: data,
//           timestamp: Date.now()
//         })
//       );
//       console.log('💾 Hangout places saved to cache:', data.length);
//     } catch (error) {
//       console.error('Error saving hangout places to cache:', error);
//     }
//   }, []);

//   // ============================================================
//   // FETCH HANGOUT PLACES - OPTIMIZED
//   // ============================================================
//   const fetchHangoutPlaces = useCallback(async (forceRefresh = false) => {
//     // Skip if already loaded and not forced
//     if (hasLoadedOnce && !forceRefresh) {
//       console.log('⏭️ Skipping hangout fetch - already loaded');
//       return;
//     }

//     try {
//       console.log('🌐 Fetching hangout places from API...');
//       const response = await axios.get(`${API_BASE_URL}/hangout-places/`, {
//         timeout: 10000,
//       });
      
//       if (response.status === 200 || response.status === 201) {
//         let data = response.data;
//         data = data.filter(place => !place.slug?.match(/-\d+$/));
//         const limitedData = data.slice(0, maxItems);
        
//         setPlaces(limitedData);
//         setHasLoadedOnce(true);
        
//         // Save to cache
//         await saveToCache(limitedData);
//         setLoading(false);
        
//         // Prefetch first few images for instant display
//         limitedData.slice(0, 3).forEach(place => {
//           const imgUrl = getFirstImage(place);
//           if (imgUrl) {
//             Image.prefetch(imgUrl).catch(() => {});
//           }
//         });

//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }).start();

//         console.log('✅ Hangout places fetched successfully:', limitedData.length);
//       }
//     } catch (error) {
//       console.error('Error fetching hangout places:', error);
//     }
//   }, [fadeAnim, saveToCache, hasLoadedOnce, maxItems]);

//   // ============================================================
//   // LOAD DATA - CACHE FIRST, THEN NETWORK
//   // ============================================================
//   const loadData = useCallback(async (forceRefresh = false) => {
//     // If already loaded and not forced, skip
//     if (hasLoadedOnce && !forceRefresh) {
//       console.log('⏭️ Skipping hangout load - already loaded');
//       return;
//     }

//     // Try cache first
//     const hasCache = await loadFromCache();
    
//     if (hasCache) {
//       // Fetch in background for fresh data
//       fetchHangoutPlaces(forceRefresh).catch(err => 
//         console.error('Background fetch error:', err)
//       );
//     } else {
//       // No cache, fetch from network
//       await fetchHangoutPlaces(forceRefresh);
//     }
//   }, [loadFromCache, fetchHangoutPlaces, hasLoadedOnce]);

//   // ============================================================
//   // AUTO-SLIDE FUNCTIONALITY
//   // ============================================================
//   const startAutoPlay = useCallback(() => {
//     stopAutoPlay();
//     if (places.length > 1) {
//       autoPlayTimerRef.current = setInterval(() => {
//         const nextIndex = (currentIndex + 1) % places.length;
//         setCurrentIndex(nextIndex);
//         if (flatListRef.current) {
//           flatListRef.current.scrollToIndex({
//             index: nextIndex,
//             animated: true,
//           });
//         }
//       }, 3500);
//     }
//   }, [places.length, currentIndex]);

//   const stopAutoPlay = useCallback(() => {
//     if (autoPlayTimerRef.current) {
//       clearInterval(autoPlayTimerRef.current);
//       autoPlayTimerRef.current = null;
//     }
//   }, []);

//   // ============================================================
//   // HANDLE SCROLL END
//   // ============================================================
//   const handleScrollEnd = useCallback((event) => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / (width * 0.85 + 16));
//     setCurrentIndex(index);
//     stopAutoPlay();
//     startAutoPlay();
//   }, [startAutoPlay, stopAutoPlay]);

//   // ============================================================
//   // HANDLE IMAGE ERROR
//   // ============================================================
//   const handleImageError = useCallback((placeId) => {
//     setImageErrors(prev => ({ ...prev, [placeId]: true }));
//   }, []);

//   // ============================================================
//   // HANDLE PLACE PRESS
//   // ============================================================
//   const handlePlacePress = useCallback((place) => {
//     navigation.navigate('HangoutPlaceDetail', { place: place });
//   }, [navigation]);

//   // ============================================================
//   // RENDER DOT
//   // ============================================================
//   const renderDot = useCallback((index) => {
//     const isActive = index === currentIndex;
//     return (
//       <View
//         key={index}
//         style={[
//           styles.dot,
//           {
//             backgroundColor: isActive ? '#0d64dd' : '#ccc',
//             width: isActive ? 20 : 8,
//           },
//         ]}
//       />
//     );
//   }, [currentIndex]);

//   // ============================================================
//   // RENDER PLACE ITEM
//   // ============================================================
//   const renderPlaceItem = useCallback(({ item, index }) => (
//     <PlaceItem
//       item={item}
//       index={index}
//       currentIndex={currentIndex}
//       onPress={handlePlacePress}
//       onImageError={handleImageError}
//       imageErrors={imageErrors}
//     />
//   ), [currentIndex, imageErrors, handlePlacePress, handleImageError]);

//   // ============================================================
//   // RENDER SKELETON
//   // ============================================================
//   const renderSkeleton = useCallback(() => (
//     <View style={styles.skeletonItem}>
//       <View style={styles.skeletonImage} />
//       <View style={styles.skeletonOverlay}>
//         <View style={styles.skeletonText} />
//         <View style={[styles.skeletonText, { width: '60%' }]} />
//       </View>
//     </View>
//   ), []);

//   // ============================================================
//   // EFFECTS
//   // ============================================================
  
//   // Initial load - ONLY ONCE
//   useEffect(() => {
//     console.log('🚀 HangoutPlacesRow initial load...');
//     loadData();
    
//     return () => {
//       isMountedRef.current = false;
//       stopAutoPlay();
//     };
//   }, []); // Empty dependency array = ONLY RUNS ONCE

//   // Auto-slide when places change
//   useEffect(() => {
//     if (places.length > 1 && !loading) {
//       startAutoPlay();
//     }
//     return () => {
//       stopAutoPlay();
//     };
//   }, [places, loading, startAutoPlay, stopAutoPlay]);

//   // ============================================================
//   // FOCUS EFFECT - BACKGROUND REFRESH IF NEEDED
//   // ============================================================
//   useFocusEffect(
//     useCallback(() => {
//       // Check if cache is expired and refresh in background
//       const checkCacheAndRefresh = async () => {
//         try {
//           const cachedData = await AsyncStorage.getItem(HANGOUT_CACHE_KEY);
//           if (cachedData) {
//             const parsed = JSON.parse(cachedData);
//             const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
//             if (!isCacheValid) {
//               console.log('🔄 Hangout cache expired, refreshing in background...');
//               await fetchHangoutPlaces(true);
//             } else {
//               console.log('✅ Hangout cache still valid');
//             }
//           }
//         } catch (error) {
//           console.error('Error checking hangout cache on focus:', error);
//         }
//       };
      
//       checkCacheAndRefresh();
//     }, [fetchHangoutPlaces])
//   );

//   // ============================================================
//   // RENDER
//   // ============================================================
  
//   // Show skeleton loading (no spinner)
//   if (loading && places.length === 0) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>{title}</Text>
//           <View style={styles.skeletonExplore}>
//             <Text style={[styles.exploreText, { color: '#ccc' }]}>See All</Text>
//           </View>
//         </View>
//         <FlatList
//           data={[1, 2, 3]}
//           renderItem={renderSkeleton}
//           keyExtractor={(item) => `skeleton-${item}`}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.skeletonList}
//           snapToInterval={width * 0.85 + 16}
//           decelerationRate="fast"
//         />
//       </View>
//     );
//   }

//   // If no places, return null
//   if (places.length === 0) {
//     return null;
//   }

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{title}</Text>
//         <TouchableOpacity
//           style={styles.exploreButton}
//           onPress={() => navigation.navigate('HangoutPlaces')}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.exploreText}>See All</Text>
//           <Ionicons name="chevron-forward" size={16} color="#0d64dd" />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         ref={flatListRef}
//         data={places}
//         renderItem={renderPlaceItem}
//         keyExtractor={(item) => `hangout-${item.id}`}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         snapToInterval={width * 0.85 + 16}
//         decelerationRate="fast"
//         onMomentumScrollEnd={handleScrollEnd}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false }
//         )}
//         getItemLayout={(data, index) => ({
//           length: width * 0.85 + 16,
//           offset: (width * 0.85 + 16) * index,
//           index,
//         })}
//         maxToRenderPerBatch={3}
//         initialNumToRender={3}
//         windowSize={3}
//         removeClippedSubviews={true}
//       />

//       {/* Dots Indicator */}
//       {places.length > 1 && (
//         <View style={styles.dotsContainer}>
//           {places.map((_, index) => renderDot(index))}
//         </View>
//       )}
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   exploreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   exploreText: {
//     fontSize: 14,
//     color: '#0d64dd',
//     fontWeight: '500',
//     marginRight: 2,
//   },
//   skeletonExplore: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 12,
//   },
//   skeletonList: {
//     paddingHorizontal: 16,
//   },
//   placeItem: {
//     width: width * 0.85,
//     marginHorizontal: 8,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#f8f8f8',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },
//   placeImageContainer: {
//     position: 'relative',
//     height: height * 0.32,
//     backgroundColor: '#e0e0e0',
//   },
//   placeImage: {
//     width: '100%',
//     height: '100%',
//   },
//   placeImagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '60%',
//     backgroundColor: 'transparent',
//     backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
//   },
//   placeInfoOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//   },
//   placeName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   locationText: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginLeft: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   statText: {
//     fontSize: 13,
//     color: '#fff',
//     marginLeft: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   statDivider: {
//     width: 1,
//     height: 16,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     marginHorizontal: 12,
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 14,
//     paddingHorizontal: 16,
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   skeletonItem: {
//     width: width * 0.85,
//     marginHorizontal: 8,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#f0f0f0',
//   },
//   skeletonImage: {
//     height: height * 0.32,
//     backgroundColor: '#e0e0e0',
//   },
//   skeletonOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//   },
//   skeletonText: {
//     height: 20,
//     backgroundColor: '#d0d0d0',
//     borderRadius: 4,
//     marginBottom: 8,
//     width: '80%',
//   },
// });

// export default HangoutPlacesRow;

// import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Dimensions,
//   Animated,
//   ScrollView,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { useTheme } from '../src/context/ThemeContext'; // Import useTheme

// const { width, height } = Dimensions.get('window');
// const API_BASE_URL = 'https://backend.ehangouts.com';

// // Cache keys
// const HANGOUT_CACHE_KEY = 'hangout_places_cache_v2';
// const CACHE_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes

// // Memoized Place Item Component
// const PlaceItem = memo(({ item, index, currentIndex, onPress, onImageError, imageErrors, colors, isDark }) => {
//   const imageUrl = getFirstImage(item);
//   const categoryColor = getCategoryColor(item.category?.name);
//   const hasError = imageErrors[item.id];
//   const isActive = index === currentIndex;

//   return (
//     <TouchableOpacity
//       style={[styles.placeItem, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}
//       onPress={() => onPress(item)}
//       activeOpacity={0.9}
//     >
//       <View style={[styles.placeImageContainer, { backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0' }]}>
//         {imageUrl && !hasError ? (
//           <Image
//             source={{ uri: imageUrl }}
//             style={styles.placeImage}
//             resizeMode="cover"
//             onError={() => onImageError(item.id)}
//           />
//         ) : (
//           <View style={[styles.placeImagePlaceholder, { backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0' }]}>
//             <Ionicons name="image-outline" size={50} color={isDark ? '#666' : '#ccc'} />
//           </View>
//         )}
        
//         {/* Gradient Overlay */}
//         <View style={styles.imageOverlay} />

//         {/* Place Info Overlay */}
//         <View style={styles.placeInfoOverlay}>
//           <Text style={styles.placeName} numberOfLines={1}>
//             {item.name}
//           </Text>
//           <View style={styles.locationContainer}>
//             <Ionicons name="location-outline" size={16} color="#fff" />
//             <Text style={styles.locationText} numberOfLines={1}>
//               {item.location || 'Lagos, Nigeria'}
//             </Text>
//           </View>
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Ionicons name="eye-outline" size={14} color="#fff" />
//               <Text style={styles.statText}>{item.view_count || 0}</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Ionicons name="star" size={14} color="#FFD700" />
//               <Text style={styles.statText}>4.5</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// });

// // Helper functions
// const getImageUrl = (imagePath) => {
//   if (!imagePath) return null;
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
//   if (imagePath.startsWith('/')) {
//     return `${API_BASE_URL}${imagePath}`;
//   }
//   return `${API_BASE_URL}/media/${imagePath}`;
// };

// const getFirstImage = (place) => {
//   if (place.images && place.images.length > 0) {
//     return getImageUrl(place.images[0].image);
//   }
//   return null;
// };

// const getCategoryColor = (categoryName) => {
//   const colors_map = {
//     'Beaches': '#f39c12',
//     'Restaurants': '#e74c3c',
//     'Bars & Clubs': '#9b59b6',
//     'Art Gallary': '#3498db',
//     'Movie Theaters': '#e67e22',
//     'Museums': '#2ecc71',
//     'Zoo': '#1abc9c',
//     'Theme Parks': '#e74c3c',
//     'Concert Halls': '#8e44ad',
//     'Libraries': '#2980b9',
//     'Lakes & Rivers': '#3498db',
//     'Ski Resorts': '#95a5a6',
//     'Spas': '#f1c40f',
//     'Arcades': '#e67e22',
//     'Bar': '#f39c12',
//     'Sports Arenas': '#2ecc71',
//     'Golf Courses': '#27ae60',
//     'Gyms': '#e74c3c',
//     'Camping Sites': '#2ecc71',
//     'Wine Tours': '#8e44ad',
//     'Car Shows': '#3498db',
//     'Skydiving': '#e67e22',
//     'Fishing Trips': '#2980b9',
//     'Water Parks': '#1abc9c',
//     'Paintball Arenas': '#27ae60',
//     'Go-Kart Racing': '#e74c3c',
//     'Skating Rinks': '#9b59b6',
//     'Shopping Malls': '#f39c12',
//     'Jet Skiting': '#3498db',
//     'Media Houses': '#2c3e50',
//     'Night Clubs': '#8e44ad',
//     'Comedy Shows': '#e67e22',
//     'Launches': '#e74c3c',
//     'Boxing': '#c0392b',
//     'Wrestling': '#2980b9',
//     'Cinema': '#e74c3c',
//   };
//   return colors_map[categoryName] || '#666';
// };

// const HangoutPlacesRow = ({ navigation, maxItems = 6, title = 'Hangout Places' }) => {
//   // ============ THEME ============
//   const { colors, theme, isDark } = useTheme();

//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageErrors, setImageErrors] = useState({});
//   const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const autoPlayTimerRef = useRef(null);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const isMountedRef = useRef(true);

//   // ============================================================
//   // LOAD FROM CACHE - FAST INSTANT DISPLAY
//   // ============================================================
//   const loadFromCache = useCallback(async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(HANGOUT_CACHE_KEY);
//       if (cachedData) {
//         const parsed = JSON.parse(cachedData);
//         const { data, timestamp } = parsed;
        
//         const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//         if (isCacheValid && data && data.length > 0) {
//           console.log('📦 Loading hangout places from cache:', data.length);
//           setPlaces(data);
//           setLoading(false);
//           setHasLoadedOnce(true);
          
//           Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 400,
//             useNativeDriver: true,
//           }).start();
          
//           return true;
//         } else {
//           console.log('⏰ Hangout cache expired');
//         }
//       }
//     } catch (error) {
//       console.error('Error loading hangout places from cache:', error);
//     }
//     return false;
//   }, [fadeAnim]);

//   // ============================================================
//   // SAVE TO CACHE
//   // ============================================================
//   const saveToCache = useCallback(async (data) => {
//     try {
//       await AsyncStorage.setItem(
//         HANGOUT_CACHE_KEY,
//         JSON.stringify({
//           data: data,
//           timestamp: Date.now()
//         })
//       );
//       console.log('💾 Hangout places saved to cache:', data.length);
//     } catch (error) {
//       console.error('Error saving hangout places to cache:', error);
//     }
//   }, []);

//   // ============================================================
//   // FETCH HANGOUT PLACES - OPTIMIZED
//   // ============================================================
//   const fetchHangoutPlaces = useCallback(async (forceRefresh = false) => {
//     // Skip if already loaded and not forced
//     if (hasLoadedOnce && !forceRefresh) {
//       console.log('⏭️ Skipping hangout fetch - already loaded');
//       return;
//     }

//     try {
//       console.log('🌐 Fetching hangout places from API...');
//       const response = await axios.get(`${API_BASE_URL}/hangout-places/`, {
//         timeout: 10000,
//       });
      
//       if (response.status === 200 || response.status === 201) {
//         let data = response.data;
//         data = data.filter(place => !place.slug?.match(/-\d+$/));
//         const limitedData = data.slice(0, maxItems);
        
//         setPlaces(limitedData);
//         setHasLoadedOnce(true);
        
//         // Save to cache
//         await saveToCache(limitedData);
//         setLoading(false);
        
//         // Prefetch first few images for instant display
//         limitedData.slice(0, 3).forEach(place => {
//           const imgUrl = getFirstImage(place);
//           if (imgUrl) {
//             Image.prefetch(imgUrl).catch(() => {});
//           }
//         });

//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }).start();

//         console.log('✅ Hangout places fetched successfully:', limitedData.length);
//       }
//     } catch (error) {
//       console.error('Error fetching hangout places:', error);
//     }
//   }, [fadeAnim, saveToCache, hasLoadedOnce, maxItems]);

//   // ============================================================
//   // LOAD DATA - CACHE FIRST, THEN NETWORK
//   // ============================================================
//   const loadData = useCallback(async (forceRefresh = false) => {
//     // If already loaded and not forced, skip
//     if (hasLoadedOnce && !forceRefresh) {
//       console.log('⏭️ Skipping hangout load - already loaded');
//       return;
//     }

//     // Try cache first
//     const hasCache = await loadFromCache();
    
//     if (hasCache) {
//       // Fetch in background for fresh data
//       fetchHangoutPlaces(forceRefresh).catch(err => 
//         console.error('Background fetch error:', err)
//       );
//     } else {
//       // No cache, fetch from network
//       await fetchHangoutPlaces(forceRefresh);
//     }
//   }, [loadFromCache, fetchHangoutPlaces, hasLoadedOnce]);

//   // ============================================================
//   // AUTO-SLIDE FUNCTIONALITY
//   // ============================================================
//   const startAutoPlay = useCallback(() => {
//     stopAutoPlay();
//     if (places.length > 1) {
//       autoPlayTimerRef.current = setInterval(() => {
//         const nextIndex = (currentIndex + 1) % places.length;
//         setCurrentIndex(nextIndex);
//         if (flatListRef.current) {
//           flatListRef.current.scrollToIndex({
//             index: nextIndex,
//             animated: true,
//           });
//         }
//       }, 3500);
//     }
//   }, [places.length, currentIndex]);

//   const stopAutoPlay = useCallback(() => {
//     if (autoPlayTimerRef.current) {
//       clearInterval(autoPlayTimerRef.current);
//       autoPlayTimerRef.current = null;
//     }
//   }, []);

//   // ============================================================
//   // HANDLE SCROLL END
//   // ============================================================
//   const handleScrollEnd = useCallback((event) => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / (width * 0.85 + 16));
//     setCurrentIndex(index);
//     stopAutoPlay();
//     startAutoPlay();
//   }, [startAutoPlay, stopAutoPlay]);

//   // ============================================================
//   // HANDLE IMAGE ERROR
//   // ============================================================
//   const handleImageError = useCallback((placeId) => {
//     setImageErrors(prev => ({ ...prev, [placeId]: true }));
//   }, []);

//   // ============================================================
//   // HANDLE PLACE PRESS
//   // ============================================================
//   const handlePlacePress = useCallback((place) => {
//     navigation.navigate('HangoutPlaceDetail', { place: place });
//   }, [navigation]);

//   // ============================================================
//   // RENDER DOT
//   // ============================================================
//   const renderDot = useCallback((index) => {
//     const isActive = index === currentIndex;
//     return (
//       <View
//         key={index}
//         style={[
//           styles.dot,
//           {
//             backgroundColor: isActive ? '#0d64dd' : (isDark ? '#444' : '#ccc'),
//             width: isActive ? 20 : 8,
//           },
//         ]}
//       />
//     );
//   }, [currentIndex, isDark]);

//   // ============================================================
//   // RENDER PLACE ITEM
//   // ============================================================
//   const renderPlaceItem = useCallback(({ item, index }) => (
//     <PlaceItem
//       item={item}
//       index={index}
//       currentIndex={currentIndex}
//       onPress={handlePlacePress}
//       onImageError={handleImageError}
//       imageErrors={imageErrors}
//       colors={colors}
//       isDark={isDark}
//     />
//   ), [currentIndex, imageErrors, handlePlacePress, handleImageError, colors, isDark]);

//   // ============================================================
//   // RENDER SKELETON
//   // ============================================================
//   const renderSkeleton = useCallback(() => (
//     <View style={[styles.skeletonItem, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
//       <View style={[styles.skeletonImage, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]} />
//       <View style={styles.skeletonOverlay}>
//         <View style={[styles.skeletonText, { backgroundColor: isDark ? '#444' : '#d0d0d0' }]} />
//         <View style={[styles.skeletonText, { width: '60%', backgroundColor: isDark ? '#444' : '#d0d0d0' }]} />
//       </View>
//     </View>
//   ), [isDark]);

//   // ============================================================
//   // EFFECTS
//   // ============================================================
  
//   // Initial load - ONLY ONCE
//   useEffect(() => {
//     console.log('🚀 HangoutPlacesRow initial load...');
//     loadData();
    
//     return () => {
//       isMountedRef.current = false;
//       stopAutoPlay();
//     };
//   }, []); // Empty dependency array = ONLY RUNS ONCE

//   // Auto-slide when places change
//   useEffect(() => {
//     if (places.length > 1 && !loading) {
//       startAutoPlay();
//     }
//     return () => {
//       stopAutoPlay();
//     };
//   }, [places, loading, startAutoPlay, stopAutoPlay]);

//   // ============================================================
//   // FOCUS EFFECT - BACKGROUND REFRESH IF NEEDED
//   // ============================================================
//   useFocusEffect(
//     useCallback(() => {
//       // Check if cache is expired and refresh in background
//       const checkCacheAndRefresh = async () => {
//         try {
//           const cachedData = await AsyncStorage.getItem(HANGOUT_CACHE_KEY);
//           if (cachedData) {
//             const parsed = JSON.parse(cachedData);
//             const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
//             if (!isCacheValid) {
//               console.log('🔄 Hangout cache expired, refreshing in background...');
//               await fetchHangoutPlaces(true);
//             } else {
//               console.log('✅ Hangout cache still valid');
//             }
//           }
//         } catch (error) {
//           console.error('Error checking hangout cache on focus:', error);
//         }
//       };
      
//       checkCacheAndRefresh();
//     }, [fetchHangoutPlaces])
//   );

//   // ============================================================
//   // RENDER
//   // ============================================================
  
//   // Show skeleton loading (no spinner)
//   if (loading && places.length === 0) {
//     return (
//       <View style={[styles.container, { 
//         backgroundColor: colors.surface || '#fff',
//         borderBottomColor: colors.border || '#f0f0f0'
//       }]}>
//         <View style={styles.header}>
//           <Text style={[styles.title, { color: colors.text || '#1a1a1a' }]}>{title}</Text>
//           <View style={styles.skeletonExplore}>
//             <Text style={[styles.exploreText, { color: isDark ? '#666' : '#ccc' }]}>See All</Text>
//           </View>
//         </View>
//         <FlatList
//           data={[1, 2, 3]}
//           renderItem={renderSkeleton}
//           keyExtractor={(item) => `skeleton-${item}`}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.skeletonList}
//           snapToInterval={width * 0.85 + 16}
//           decelerationRate="fast"
//         />
//       </View>
//     );
//   }

//   // If no places, return null
//   if (places.length === 0) {
//     return null;
//   }

//   return (
//     <Animated.View style={[styles.container, { 
//       opacity: fadeAnim,
//       backgroundColor: colors.surface || '#fff',
//       borderBottomColor: colors.border || '#f0f0f0'
//     }]}>
//       <View style={styles.header}>
//         <Text style={[styles.title, { color: colors.text || '#1a1a1a' }]}>{title}</Text>
//         <TouchableOpacity
//           style={styles.exploreButton}
//           onPress={() => navigation.navigate('HangoutPlaces')}
//           activeOpacity={0.7}
//         >
//           <Text style={[styles.exploreText, { color: '#0d64dd' }]}>See All</Text>
//           <Ionicons name="chevron-forward" size={16} color="#0d64dd" />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         ref={flatListRef}
//         data={places}
//         renderItem={renderPlaceItem}
//         keyExtractor={(item) => `hangout-${item.id}`}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         snapToInterval={width * 0.85 + 16}
//         decelerationRate="fast"
//         onMomentumScrollEnd={handleScrollEnd}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false }
//         )}
//         getItemLayout={(data, index) => ({
//           length: width * 0.85 + 16,
//           offset: (width * 0.85 + 16) * index,
//           index,
//         })}
//         maxToRenderPerBatch={3}
//         initialNumToRender={3}
//         windowSize={3}
//         removeClippedSubviews={true}
//       />

//       {/* Dots Indicator */}
//       {places.length > 1 && (
//         <View style={styles.dotsContainer}>
//           {places.map((_, index) => renderDot(index))}
//         </View>
//       )}
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   exploreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   exploreText: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginRight: 2,
//   },
//   skeletonExplore: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 12,
//   },
//   skeletonList: {
//     paddingHorizontal: 16,
//   },
//   placeItem: {
//     width: width * 0.85,
//     marginHorizontal: 8,
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },
//   placeImageContainer: {
//     position: 'relative',
//     height: height * 0.32,
//   },
//   placeImage: {
//     width: '100%',
//     height: '100%',
//   },
//   placeImagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '60%',
//     backgroundColor: 'transparent',
//     backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
//   },
//   placeInfoOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//   },
//   placeName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   locationText: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginLeft: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   statText: {
//     fontSize: 13,
//     color: '#fff',
//     marginLeft: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   statDivider: {
//     width: 1,
//     height: 16,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     marginHorizontal: 12,
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 14,
//     paddingHorizontal: 16,
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   skeletonItem: {
//     width: width * 0.85,
//     marginHorizontal: 8,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   skeletonImage: {
//     height: height * 0.32,
//   },
//   skeletonOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//   },
//   skeletonText: {
//     height: 20,
//     borderRadius: 4,
//     marginBottom: 8,
//     width: '80%',
//   },
// });

// export default HangoutPlacesRow;

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://backend.ehangouts.com';

// Initialize MMKV storage
const storage = createMMKV({
  id: 'hangout-row-storage',
});

// Cache keys
const HANGOUT_CACHE_KEY = 'hangout_places_cache_v2';
const CACHE_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes

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
    console.log('🗑️ Clearing hangout row MMKV cache...');
    storage.delete(HANGOUT_CACHE_KEY);
    console.log('✅ Hangout row MMKV cache cleared');
  } catch (error) {
    console.error('❌ Error clearing MMKV cache:', error);
  }
};

// Memoized Place Item Component
const PlaceItem = memo(({ item, index, currentIndex, onPress, onImageError, imageErrors, colors, isDark }) => {
  const imageUrl = getFirstImage(item);
  const categoryColor = getCategoryColor(item.category?.name);
  const hasError = imageErrors[item.id];
  const isActive = index === currentIndex;

  return (
    <TouchableOpacity
      style={[styles.placeItem, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <View style={[styles.placeImageContainer, { backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0' }]}>
        {imageUrl && !hasError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.placeImage}
            resizeMode="cover"
            onError={() => onImageError(item.id)}
          />
        ) : (
          <View style={[styles.placeImagePlaceholder, { backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0' }]}>
            <Ionicons name="image-outline" size={50} color={isDark ? '#666' : '#ccc'} />
          </View>
        )}
        
        {/* Gradient Overlay */}
        <View style={styles.imageOverlay} />

        {/* Place Info Overlay */}
        <View style={styles.placeInfoOverlay}>
          <Text style={styles.placeName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#fff" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location || 'Lagos, Nigeria'}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#fff" />
              <Text style={styles.statText}>{item.view_count || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Helper functions
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return `${API_BASE_URL}/media/${imagePath}`;
};

const getFirstImage = (place) => {
  if (place.images && place.images.length > 0) {
    return getImageUrl(place.images[0].image);
  }
  return null;
};

const getCategoryColor = (categoryName) => {
  const colors_map = {
    'Beaches': '#f39c12',
    'Restaurants': '#e74c3c',
    'Bars & Clubs': '#9b59b6',
    'Art Gallary': '#3498db',
    'Movie Theaters': '#e67e22',
    'Museums': '#2ecc71',
    'Zoo': '#1abc9c',
    'Theme Parks': '#e74c3c',
    'Concert Halls': '#8e44ad',
    'Libraries': '#2980b9',
    'Lakes & Rivers': '#3498db',
    'Ski Resorts': '#95a5a6',
    'Spas': '#f1c40f',
    'Arcades': '#e67e22',
    'Bar': '#f39c12',
    'Sports Arenas': '#2ecc71',
    'Golf Courses': '#27ae60',
    'Gyms': '#e74c3c',
    'Camping Sites': '#2ecc71',
    'Wine Tours': '#8e44ad',
    'Car Shows': '#3498db',
    'Skydiving': '#e67e22',
    'Fishing Trips': '#2980b9',
    'Water Parks': '#1abc9c',
    'Paintball Arenas': '#27ae60',
    'Go-Kart Racing': '#e74c3c',
    'Skating Rinks': '#9b59b6',
    'Shopping Malls': '#f39c12',
    'Jet Skiting': '#3498db',
    'Media Houses': '#2c3e50',
    'Night Clubs': '#8e44ad',
    'Comedy Shows': '#e67e22',
    'Launches': '#e74c3c',
    'Boxing': '#c0392b',
    'Wrestling': '#2980b9',
    'Cinema': '#e74c3c',
  };
  return colors_map[categoryName] || '#666';
};

const HangoutPlacesRow = ({ navigation, maxItems = 6, title = 'Hangout Places' }) => {
  // ============ THEME ============
  const { colors, theme, isDark } = useTheme();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const isMountedRef = useRef(true);

  // ============================================================
  // LOAD FROM MMKV CACHE - FAST INSTANT DISPLAY
  // ============================================================
  const loadFromCache = useCallback(() => {
    try {
      const cachedData = getFromMMKV(HANGOUT_CACHE_KEY);
      if (cachedData && cachedData.length > 0) {
        console.log('📦 Loading hangout places from MMKV cache:', cachedData.length);
        setPlaces(cachedData);
        setLoading(false);
        setHasLoadedOnce(true);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
        
        return true;
      }
    } catch (error) {
      console.error('❌ Error loading hangout places from MMKV cache:', error);
    }
    return false;
  }, [fadeAnim]);

  // ============================================================
  // FETCH HANGOUT PLACES - OPTIMIZED
  // ============================================================
  const fetchHangoutPlaces = useCallback(async (forceRefresh = false) => {
    // Skip if already loaded and not forced
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping hangout fetch - already loaded');
      return;
    }

    try {
      console.log('🌐 Fetching hangout places from API...');
      const response = await axios.get(`${API_BASE_URL}/hangout-places/`, {
        timeout: 10000,
      });
      
      if (response.status === 200 || response.status === 201) {
        let data = response.data;
        data = data.filter(place => !place.slug?.match(/-\d+$/));
        const limitedData = data.slice(0, maxItems);
        
        setPlaces(limitedData);
        setHasLoadedOnce(true);
        
        // Save to MMKV cache
        saveToMMKV(HANGOUT_CACHE_KEY, limitedData);
        console.log(`✅ Saved ${limitedData.length} hangout places to MMKV cache`);
        
        setLoading(false);
        
        // Prefetch first few images for instant display
        limitedData.slice(0, 3).forEach(place => {
          const imgUrl = getFirstImage(place);
          if (imgUrl) {
            Image.prefetch(imgUrl).catch(() => {});
          }
        });

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();

        console.log('✅ Hangout places fetched successfully:', limitedData.length);
      }
    } catch (error) {
      console.error('❌ Error fetching hangout places:', error);
    }
  }, [fadeAnim, hasLoadedOnce, maxItems]);

  // ============================================================
  // LOAD DATA - CACHE FIRST, THEN NETWORK
  // ============================================================
  const loadData = useCallback(async (forceRefresh = false) => {
    // If already loaded and not forced, skip
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping hangout load - already loaded');
      return;
    }

    // Try MMKV cache first
    const hasCache = loadFromCache();
    
    if (hasCache) {
      console.log('📂 Cache loaded, fetching fresh data in background...');
      // Fetch in background for fresh data
      setTimeout(() => {
        fetchHangoutPlaces(forceRefresh).catch(err => 
          console.error('Background fetch error:', err)
        );
      }, 500);
    } else {
      // No cache, fetch from network
      console.log('📭 No cache, fetching from API...');
      await fetchHangoutPlaces(forceRefresh);
    }
  }, [loadFromCache, fetchHangoutPlaces, hasLoadedOnce]);

  // ============================================================
  // AUTO-SLIDE FUNCTIONALITY
  // ============================================================
  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    if (places.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % places.length;
        setCurrentIndex(nextIndex);
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
      }, 3500);
    }
  }, [places.length, currentIndex]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  // ============================================================
  // HANDLE SCROLL END
  // ============================================================
  const handleScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width * 0.85 + 16));
    setCurrentIndex(index);
    stopAutoPlay();
    startAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // ============================================================
  // HANDLE IMAGE ERROR
  // ============================================================
  const handleImageError = useCallback((placeId) => {
    setImageErrors(prev => ({ ...prev, [placeId]: true }));
  }, []);

  // ============================================================
  // HANDLE PLACE PRESS
  // ============================================================
  const handlePlacePress = useCallback((place) => {
    navigation.navigate('HangoutPlaceDetail', { place: place });
  }, [navigation]);

  // ============================================================
  // RENDER DOT
  // ============================================================
  const renderDot = useCallback((index) => {
    const isActive = index === currentIndex;
    return (
      <View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor: isActive ? '#0d64dd' : (isDark ? '#444' : '#ccc'),
            width: isActive ? 20 : 8,
          },
        ]}
      />
    );
  }, [currentIndex, isDark]);

  // ============================================================
  // RENDER PLACE ITEM
  // ============================================================
  const renderPlaceItem = useCallback(({ item, index }) => (
    <PlaceItem
      item={item}
      index={index}
      currentIndex={currentIndex}
      onPress={handlePlacePress}
      onImageError={handleImageError}
      imageErrors={imageErrors}
      colors={colors}
      isDark={isDark}
    />
  ), [currentIndex, imageErrors, handlePlacePress, handleImageError, colors, isDark]);

  // ============================================================
  // RENDER SKELETON
  // ============================================================
  const renderSkeleton = useCallback(() => (
    <View style={[styles.skeletonItem, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
      <View style={[styles.skeletonImage, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]} />
      <View style={styles.skeletonOverlay}>
        <View style={[styles.skeletonText, { backgroundColor: isDark ? '#444' : '#d0d0d0' }]} />
        <View style={[styles.skeletonText, { width: '60%', backgroundColor: isDark ? '#444' : '#d0d0d0' }]} />
      </View>
    </View>
  ), [isDark]);

  // ============================================================
  // EFFECTS
  // ============================================================
  
  // Initial load - ONLY ONCE
  useEffect(() => {
    console.log('🚀 HangoutPlacesRow initial load - checking MMKV cache...');
    loadData();
    
    return () => {
      isMountedRef.current = false;
      stopAutoPlay();
    };
  }, []); // Empty dependency array = ONLY RUNS ONCE

  // Auto-slide when places change
  useEffect(() => {
    if (places.length > 1 && !loading) {
      startAutoPlay();
    }
    return () => {
      stopAutoPlay();
    };
  }, [places, loading, startAutoPlay, stopAutoPlay]);

  // ============================================================
  // FOCUS EFFECT - BACKGROUND REFRESH IF NEEDED
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      // Check if cache is expired and refresh in background
      const checkCacheAndRefresh = () => {
        try {
          const cached = storage.getString(HANGOUT_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
            if (!isCacheValid) {
              console.log('🔄 Hangout cache expired, refreshing in background...');
              fetchHangoutPlaces(true);
            } else {
              console.log('✅ Hangout cache still valid');
            }
          }
        } catch (error) {
          console.error('❌ Error checking hangout cache on focus:', error);
        }
      };
      
      checkCacheAndRefresh();
    }, [fetchHangoutPlaces])
  );

  // ============================================================
  // RENDER
  // ============================================================
  
  // Show skeleton loading (no spinner)
  if (loading && places.length === 0) {
    return (
      <View style={[styles.container, { 
        backgroundColor: colors.surface || '#fff',
        borderBottomColor: colors.border || '#f0f0f0'
      }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text || '#1a1a1a' }]}>{title}</Text>
          <View style={styles.skeletonExplore}>
            <Text style={[styles.exploreText, { color: isDark ? '#666' : '#ccc' }]}>See All</Text>
          </View>
        </View>
        <FlatList
          data={[1, 2, 3]}
          renderItem={renderSkeleton}
          keyExtractor={(item) => `skeleton-${item}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skeletonList}
          snapToInterval={width * 0.85 + 16}
          decelerationRate="fast"
        />
      </View>
    );
  }

  // If no places, return null
  if (places.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { 
      opacity: fadeAnim,
      backgroundColor: colors.surface || '#fff',
      borderBottomColor: colors.border || '#f0f0f0'
    }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text || '#1a1a1a' }]}>{title}</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('HangoutPlaces')}
          activeOpacity={0.7}
        >
          <Text style={[styles.exploreText, { color: '#0d64dd' }]}>See All</Text>
          <Ionicons name="chevron-forward" size={16} color="#0d64dd" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={places}
        renderItem={renderPlaceItem}
        keyExtractor={(item) => `hangout-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={width * 0.85 + 16}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        getItemLayout={(data, index) => ({
          length: width * 0.85 + 16,
          offset: (width * 0.85 + 16) * index,
          index,
        })}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
        windowSize={3}
        removeClippedSubviews={true}
      />

      {/* Dots Indicator */}
      {places.length > 1 && (
        <View style={styles.dotsContainer}>
          {places.map((_, index) => renderDot(index))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 2,
  },
  skeletonExplore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
  },
  skeletonList: {
    paddingHorizontal: 16,
  },
  placeItem: {
    width: width * 0.85,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  placeImageContainer: {
    position: 'relative',
    height: height * 0.32,
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  placeImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  },
  placeInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  placeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  skeletonItem: {
    width: width * 0.85,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  skeletonImage: {
    height: height * 0.32,
  },
  skeletonOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  skeletonText: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
});

export default HangoutPlacesRow;