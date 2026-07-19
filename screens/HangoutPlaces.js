
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl,
//   Platform,
//   Dimensions,
//   StatusBar,
//   Animated,
//   Linking,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';

// const { width, height } = Dimensions.get('window');
// const API_BASE_URL = 'https://backend.ehangouts.com';

// const HangoutPlacesHome = ({ navigation }) => {
//   const [places, setPlaces] = useState([]);
//   const [filteredPlaces, setFilteredPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [categories, setCategories] = useState([]);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
  
//   const searchInputRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   // Get unique categories
//   useEffect(() => {
//     if (places.length > 0) {
//       const uniqueCategories = ['All', ...new Set(places.map(item => item.category?.name).filter(Boolean))];
//       setCategories(uniqueCategories);
//     }
//   }, [places]);

//   // Fetch hangout places
//   const fetchHangoutPlaces = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/hangout-places/`);
//       if (response.status === 200 || response.status === 201) {
//         let data = response.data;
//         // Filter out duplicate slugs with numbers
//         data = data.filter(place => !place.slug?.match(/-\d+$/));
//         setPlaces(data);
//         setFilteredPlaces(data);
//         // Animate in
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       }
//     } catch (error) {
//       console.error('Error fetching hangout places:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchHangoutPlaces();
//   }, []);

//   // Filter places based on search and category
//   useEffect(() => {
//     let filtered = places;
    
//     // Filter by category
//     if (selectedCategory !== 'All') {
//       filtered = filtered.filter(place => place.category?.name === selectedCategory);
//     }
    
//     // Filter by search query
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim();
//       filtered = filtered.filter(place => 
//         place.name?.toLowerCase().includes(query) ||
//         place.location?.toLowerCase().includes(query) ||
//         place.category?.name?.toLowerCase().includes(query) ||
//         place.description?.toLowerCase().includes(query)
//       );
//     }
    
//     setFilteredPlaces(filtered);
//   }, [searchQuery, selectedCategory, places]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchHangoutPlaces();
//   };

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

//   const getCategoryIcon = (categoryName) => {
//     const icons = {
//       'Beaches': 'umbrella-outline',
//       'Restaurants': 'restaurant-outline',
//       'Bars & Clubs': 'wine-outline',
//       'Art Gallary': 'color-palette-outline',
//       'Movie Theaters': 'film-outline',
//       'Museums': 'business-outline',
//       'Zoo': 'paw-outline',
//       'Theme Parks': 'happy-outline',
//       'Concert Halls': 'musical-notes-outline',
//       'Libraries': 'library-outline',
//       'Lakes & Rivers': 'water-outline',
//       'Ski Resorts': 'snow-outline',
//       'Spas': 'spa-outline',
//       'Arcades': 'game-controller-outline',
//       'Bar': 'beer-outline',
//       'Sports Arenas': 'basketball-outline',
//       'Golf Courses': 'golf-outline',
//       'Gyms': 'fitness-outline',
//       'Camping Sites': 'bonfire-outline',
//       'Wine Tours': 'wine-outline',
//       'Car Shows': 'car-outline',
//       'Skydiving': 'airplane-outline',
//       'Fishing Trips': 'fish-outline',
//       'Water Parks': 'water-outline',
//       'Paintball Arenas': 'brush-outline',
//       'Go-Kart Racing': 'car-sport-outline',
//       'Skating Rinks': 'skateboard-outline',
//       'Shopping Malls': 'storefront-outline',
//       'Jet Skiting': 'boat-outline',
//       'Media Houses': 'tv-outline',
//       'Night Clubs': 'moon-outline',
//       'Comedy Shows': 'happy-outline',
//       'Launches': 'rocket-outline',
//       'Boxing': 'fist-outline',
//       'Wrestling': 'people-outline',
//       'Cinema': 'film-outline',
//     };
//     return icons[categoryName] || 'location-outline';
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

//   const renderCategoryItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.categoryChip,
//         {
//           backgroundColor: selectedCategory === item ? '#0d64dd' : '#f0f0f0',
//         }
//       ]}
//       onPress={() => setSelectedCategory(item)}
//     >
//       <Text style={[
//         styles.categoryChipText,
//         { color: selectedCategory === item ? '#fff' : '#333' }
//       ]}>
//         {item}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderPlaceItem = ({ item, index }) => {
//     const imageUrl = getFirstImage(item);
//     const categoryColor = getCategoryColor(item.category?.name);
//     const categoryIcon = getCategoryIcon(item.category?.name);

//     return (
//       <TouchableOpacity
//         style={styles.placeCard}
//         onPress={() => navigation.navigate('HangoutPlaceDetail', { place: item })}
//         activeOpacity={0.8}
//       >
//         <View style={styles.placeCardImageContainer}>
//           {imageUrl ? (
//             <Image
//               source={{ uri: imageUrl }}
//               style={styles.placeCardImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={styles.placeCardImagePlaceholder}>
//               <Ionicons name="image-outline" size={40} color="#999" />
//             </View>
//           )}
//           <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
//             <Ionicons name={categoryIcon} size={12} color="#fff" />
//             <Text style={styles.categoryBadgeText} numberOfLines={1}>
//               {item.category?.name || 'General'}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.placeCardContent}>
//           <Text style={styles.placeCardName} numberOfLines={1}>
//             {item.name}
//           </Text>
          
//           {item.location && (
//             <View style={styles.locationContainer}>
//               <Ionicons name="location-outline" size={14} color="#666" />
//               <Text style={styles.locationText} numberOfLines={1}>
//                 {item.location}
//               </Text>
//             </View>
//           )}
          
//           {item.description && (
//             <Text style={styles.placeCardDescription} numberOfLines={2}>
//               {item.description.replace(/<[^>]*>/g, '').substring(0, 100)}
//             </Text>
//           )}
          
//           <View style={styles.placeCardFooter}>
//             <View style={styles.viewCountContainer}>
//               <Ionicons name="eye-outline" size={14} color="#666" />
//               <Text style={styles.viewCountText}>
//                 {item.view_count || 0} views
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#0d64dd" />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Ionicons name="location-outline" size={64} color="#ccc" />
//       <Text style={styles.emptyTitle}>No Hangout Places Found</Text>
//       <Text style={styles.emptySubtitle}>
//         {searchQuery ? 'Try adjusting your search or filters' : 'Check back later for new places'}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor="#0d64dd"
//       />
      
//       {/* Header */}
//       <LinearGradient
//         colors={['#0d64dd', '#0d64dd']}
//         style={styles.header}
//       >
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Hangout Places</Text>
//           <TouchableOpacity onPress={fetchHangoutPlaces}>
//             <Ionicons name="refresh-outline" size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <Ionicons name="search" size={20} color="#666" />
//           <TextInput
//             ref={searchInputRef}
//             placeholder="Search hangout places..."
//             placeholderTextColor="#999"
//             style={styles.searchInput}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             onFocus={() => setIsSearchFocused(true)}
//             onBlur={() => setIsSearchFocused(false)}
//             returnKeyType="search"
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Ionicons name="close-circle" size={20} color="#666" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Categories */}
//       <View style={styles.categoriesContainer}>
//         <FlatList
//           data={categories}
//           renderItem={renderCategoryItem}
//           keyExtractor={(item) => item}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoriesList}
//         />
//       </View>

//       {/* Places List */}
//       <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
//         <FlatList
//           data={filteredPlaces}
//           renderItem={renderPlaceItem}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#0d64dd']}
//               tintColor="#0d64dd"
//             />
//           }
//           ListEmptyComponent={renderEmptyState}
//           initialNumToRender={10}
//           maxToRenderPerBatch={10}
//           windowSize={10}
//         />
//       </Animated.View>

//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0d64dd" />
//           <Text style={styles.loadingText}>Loading hangout places...</Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'android' ? 8 : 0,
//     paddingBottom: 12,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   searchContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 44,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     color: '#333',
//   },
//   categoriesContainer: {
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   categoriesList: {
//     paddingHorizontal: 16,
//   },
//   categoryChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   categoryChipText: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingBottom: 20,
//   },
//   placeCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   placeCardImageContainer: {
//     position: 'relative',
//     height: 180,
//     backgroundColor: '#f0f0f0',
//   },
//   placeCardImage: {
//     width: '100%',
//     height: '100%',
//   },
//   placeCardImagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   categoryBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   categoryBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   placeCardContent: {
//     padding: 12,
//   },
//   placeCardName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   locationText: {
//     fontSize: 13,
//     color: '#666',
//     marginLeft: 4,
//   },
//   placeCardDescription: {
//     fontSize: 13,
//     color: '#666',
//     lineHeight: 18,
//     marginBottom: 8,
//   },
//   placeCardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   viewCountContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   viewCountText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 4,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 20,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 16,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.8)',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#666',
//   },
// });

// export default HangoutPlacesHome;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
  StatusBar,
  Animated,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useTheme } from '../src/context/ThemeContext'; // Import useTheme

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://backend.ehangouts.com';

const HangoutPlacesHome = ({ navigation }) => {
  // ============ THEME ============
  const { colors, theme, isDark } = useTheme();

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get unique categories
  useEffect(() => {
    if (places.length > 0) {
      const uniqueCategories = ['All', ...new Set(places.map(item => item.category?.name).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [places]);

  // Fetch hangout places
  const fetchHangoutPlaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/hangout-places/`);
      if (response.status === 200 || response.status === 201) {
        let data = response.data;
        // Filter out duplicate slugs with numbers
        data = data.filter(place => !place.slug?.match(/-\d+$/));
        setPlaces(data);
        setFilteredPlaces(data);
        // Animate in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error('Error fetching hangout places:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHangoutPlaces();
  }, []);

  // Filter places based on search and category
  useEffect(() => {
    let filtered = places;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(place => place.category?.name === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(place => 
        place.name?.toLowerCase().includes(query) ||
        place.location?.toLowerCase().includes(query) ||
        place.category?.name?.toLowerCase().includes(query) ||
        place.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredPlaces(filtered);
  }, [searchQuery, selectedCategory, places]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHangoutPlaces();
  };

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

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Beaches': 'umbrella-outline',
      'Restaurants': 'restaurant-outline',
      'Bars & Clubs': 'wine-outline',
      'Art Gallary': 'color-palette-outline',
      'Movie Theaters': 'film-outline',
      'Museums': 'business-outline',
      'Zoo': 'paw-outline',
      'Theme Parks': 'happy-outline',
      'Concert Halls': 'musical-notes-outline',
      'Libraries': 'library-outline',
      'Lakes & Rivers': 'water-outline',
      'Ski Resorts': 'snow-outline',
      'Spas': 'spa-outline',
      'Arcades': 'game-controller-outline',
      'Bar': 'beer-outline',
      'Sports Arenas': 'basketball-outline',
      'Golf Courses': 'golf-outline',
      'Gyms': 'fitness-outline',
      'Camping Sites': 'bonfire-outline',
      'Wine Tours': 'wine-outline',
      'Car Shows': 'car-outline',
      'Skydiving': 'airplane-outline',
      'Fishing Trips': 'fish-outline',
      'Water Parks': 'water-outline',
      'Paintball Arenas': 'brush-outline',
      'Go-Kart Racing': 'car-sport-outline',
      'Skating Rinks': 'skateboard-outline',
      'Shopping Malls': 'storefront-outline',
      'Jet Skiting': 'boat-outline',
      'Media Houses': 'tv-outline',
      'Night Clubs': 'moon-outline',
      'Comedy Shows': 'happy-outline',
      'Launches': 'rocket-outline',
      'Boxing': 'fist-outline',
      'Wrestling': 'people-outline',
      'Cinema': 'film-outline',
    };
    return icons[categoryName] || 'location-outline';
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

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        {
          backgroundColor: selectedCategory === item ? '#0d64dd' : (isDark ? '#2a2a2a' : '#f0f0f0'),
        }
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryChipText,
        { color: selectedCategory === item ? '#fff' : (isDark ? '#e0e0e0' : '#333') }
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderPlaceItem = ({ item, index }) => {
    const imageUrl = getFirstImage(item);
    const categoryColor = getCategoryColor(item.category?.name);
    const categoryIcon = getCategoryIcon(item.category?.name);

    return (
      <TouchableOpacity
        style={[styles.placeCard, { backgroundColor: colors.surface || '#fff' }]}
        onPress={() => navigation.navigate('HangoutPlaceDetail', { place: item })}
        activeOpacity={0.8}
      >
        <View style={styles.placeCardImageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.placeCardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeCardImagePlaceholder, { backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0' }]}>
              <Ionicons name="image-outline" size={40} color={isDark ? '#666' : '#999'} />
            </View>
          )}
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Ionicons name={categoryIcon} size={12} color="#fff" />
            <Text style={styles.categoryBadgeText} numberOfLines={1}>
              {item.category?.name || 'General'}
            </Text>
          </View>
        </View>

        <View style={styles.placeCardContent}>
          <Text style={[styles.placeCardName, { color: colors.text || '#1a1a1a' }]} numberOfLines={1}>
            {item.name}
          </Text>
          
          {item.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color={isDark ? '#888' : '#666'} />
              <Text style={[styles.locationText, { color: isDark ? '#888' : '#666' }]} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}
          
          {item.description && (
            <Text style={[styles.placeCardDescription, { color: isDark ? '#999' : '#666' }]} numberOfLines={2}>
              {item.description.replace(/<[^>]*>/g, '').substring(0, 100)}
            </Text>
          )}
          
          <View style={styles.placeCardFooter}>
            <View style={styles.viewCountContainer}>
              <Ionicons name="eye-outline" size={14} color={isDark ? '#888' : '#666'} />
              <Text style={[styles.viewCountText, { color: isDark ? '#888' : '#666' }]}>
                {item.view_count || 0} views
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0d64dd" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="location-outline" size={64} color={isDark ? '#444' : '#ccc'} />
      <Text style={[styles.emptyTitle, { color: colors.text || '#333' }]}>No Hangout Places Found</Text>
      <Text style={[styles.emptySubtitle, { color: isDark ? '#888' : '#666' }]}>
        {searchQuery ? 'Try adjusting your search or filters' : 'Check back later for new places'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background || '#f5f5f5' }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0d64dd"
      />
      
      {/* Header */}
      <LinearGradient
        colors={['#0d64dd', '#0d64dd']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hangout Places</Text>
          <TouchableOpacity onPress={fetchHangoutPlaces}>
            <Ionicons name="refresh-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { 
        backgroundColor: colors.surface || '#fff',
        borderBottomColor: colors.border || '#eee'
      }]}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} />
          <TextInput
            ref={searchInputRef}
            placeholder="Search hangout places..."
            placeholderTextColor={isDark ? '#888' : '#999'}
            style={[styles.searchInput, { 
              color: colors.text || '#333',
            }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={isDark ? '#888' : '#666'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.categoriesContainer, {
        backgroundColor: colors.surface || '#fff',
        borderBottomColor: colors.border || '#eee'
      }]}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Places List */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={filteredPlaces}
          renderItem={renderPlaceItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0d64dd']}
              tintColor="#0d64dd"
            />
          }
          ListEmptyComponent={renderEmptyState}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </Animated.View>

      {loading && (
        <View style={[styles.loadingContainer, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <ActivityIndicator size="large" color="#0d64dd" />
          <Text style={[styles.loadingText, { color: '#fff' }]}>Loading hangout places...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  categoriesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  placeCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  placeCardImageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  placeCardImage: {
    width: '100%',
    height: '100%',
  },
  placeCardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  placeCardContent: {
    padding: 12,
  },
  placeCardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    marginLeft: 4,
  },
  placeCardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  placeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCountText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default HangoutPlacesHome;
