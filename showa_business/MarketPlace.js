

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   Animated,
//   Easing,
//   StatusBar,
//   TextInput,
//   LayoutAnimation 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import Colors from '../theme/colors';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = (width - 48) / 2; 

// const categories = [
//   { name: 'Gadgets', icon: 'mobile', color: '#4A90E2' },
//   { name: 'Fashion', icon: 'shopping-bag', color: '#FF6B6B' },
//   { name: 'Electronics', icon: 'tv', color: '#45B7D1' },
//   { name: 'Vehicles', icon: 'car', color: '#FFA502' },
//   { name: 'Home', icon: 'home', color: '#9C64A6' },
//   { name: 'More', icon: 'ellipsis-h', color: '#7ED321' },
// ];

// const promoBanners = [
//   require('../assets/images/8555e2167169969.Y3JvcCwxMTAzLDg2MiwwLDM2OA.png'),
//   require('../assets/images/infinixhot605g2-1752219518.png'), 
//   // require('../assets/images/car-rental-automotive-instagram-facebook-story-template_84443-7423.png'), 
// ];

// export default function HomeScreen({ navigation }) {
//   const { colors, isDark } = useTheme(); // Get theme colors and dark mode status
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
//   const fadeAnim = useState(new Animated.Value(1))[0];
//   const [searchFocused, setSearchFocused] = useState(false);
//   const searchAnim = useState(new Animated.Value(0))[0];
//   const [searchContainerWidth, setSearchContainerWidth] = useState('85%');
//   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

//   useEffect(() => {
//     axios.get(`${API_ROUTE}/listings/`)
//       .then(res => setListings(res.data))
//       .catch(err => console.log(err))
//       .finally(() => setLoading(false));
    
//     const bannerInterval = setInterval(rotateBanner, 5000);
//     return () => clearInterval(bannerInterval);
//   }, []);

//   const rotateBanner = () => {
//     Animated.sequence([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//         delay: 100,
//       })
//     ]).start(() => {
//       setCurrentBannerIndex((prevIndex) => 
//         (prevIndex + 1) % promoBanners.length
//       );
//     });
//   };

//  const handleSearchFocus = () => {
//   setSearchFocused(true);
//   setSearchContainerWidth('100%');
// };

// const handleSearchBlur = () => {
//   setSearchFocused(false);
//   setSearchContainerWidth('85%');
// };

//   const searchWidth = searchAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['85%', '100%']
//   });

//   const renderCard = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.card, { 
//         backgroundColor: colors.card,
//         shadowColor: isDark ? '#000' : '#000',
//         shadowOpacity: isDark ? 0.1 : 0.05,
//       }]}
//       onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
//     >
//       <View style={styles.cardImageContainer}>
//         {item.images && item.images.length > 0 && (
//           <Image 
//             source={{ uri: `${API_ROUTE_IMAGE}${item.images[0].image}` }} 
//             style={styles.cardImage} 
//             resizeMode="cover"
//           />
//         )}
//         <View style={[styles.favoriteButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
//           <Icon name="favorite-border" size={20} color="#fff" />
//         </View>
//       </View>
//       <View style={styles.cardContent}>
//         <Text style={[styles.cardPrice, { color: colors.text }]}>₦{item.price.toLocaleString()}</Text>
//         <Text style={[styles.cardTitle, { color: colors.textSecondary }]} numberOfLines={1}>{item.title}</Text>
//         <View style={styles.cardFooter}>
//           <View style={styles.locationContainer}>
//             <Icon name="location-on" size={14} color={colors.textSecondary} />
//             <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>{item.location || 'Lagos'}</Text>
//           </View>
//           <View style={[styles.ratingContainer, { backgroundColor: colors.backgroundSecondary }]}>
//             <Icon name="star" size={14} color="#FFD700" />
//             <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating || '4.5'}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
//       <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={{display:'flex',flexDirection:'row', alignContent:'center',alignItems:'center', justifyContent:'flex-start'}}>
//            <TouchableOpacity onPress={()=>navigation.goBack()}>
//              <Icon name="arrow-back" size={28} color={colors.primary} />
//            </TouchableOpacity>
           
//          <Text style={[styles.sectionHeader,{
//            fontSize:40,
//            fontWeight:'bold',
//            marginTop:15,
//            marginLeft:10,
//            color: colors.text
//          }]}>MarketPlace.</Text>
//         </View>
         
//         <View style={styles.headerContainer}>
          
//           <Animated.View style={[styles.searchContainer, { 
//             width: searchWidth,
//             backgroundColor: colors.backgroundSecondary 
//           }]}>
//             <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
//             <TextInput
//               placeholder="Search products..."
//               placeholderTextColor={colors.textSecondary}
//               style={[styles.searchInput, { color: colors.text }]}
//               onFocus={handleSearchFocus}
//               onBlur={handleSearchBlur}
//             />
//             {!searchFocused && (
//               <TouchableOpacity 
//                 style={styles.cameraButton}
//                 onPress={() => navigation.navigate('CreateListing')}
//               >
//                 <Icon name="photo-camera" size={20} color={colors.primary} />
//               </TouchableOpacity>
//             )}
//           </Animated.View>
          
//           <TouchableOpacity 
//             style={styles.notificationButton}
//             onPress={() => navigation.navigate('CreateListing')}
//           >
//             <Icon name="add" size={24} color={colors.primary} />
//             <View style={[styles.notificationBadge, { backgroundColor: '#FF3B30' }]} />
//           </TouchableOpacity>
//         </View>

//         {/* Categories */}
//         <Text style={[styles.sectionHeader, {
//           marginBottom: 20,
//           color: colors.text
//         }]}>Categories</Text>
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoriesContainer}
//         >
//           {categories.map((category, index) => (
//             <TouchableOpacity 
//               key={index} 
//               style={styles.categoryItem}
//               //onPress={() => navigation.navigate('Category', { category: category.name })}
//             >
//               <LinearGradient
//                 colors={[category.color, lightenColor(category.color, 20)]}
//                 style={styles.categoryIcon}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//               >
//                 <FontAwesome name={category.icon} size={20} color="#fff" />
//               </LinearGradient>
//               <Text style={[styles.categoryText, { color: colors.text }]}>{category.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Promo Banner */}
//         <View style={styles.promoContainer}>
//           <Animated.Image
//             source={promoBanners[currentBannerIndex]} 
//             style={[styles.promoBanner, { opacity: fadeAnim }]}
//             resizeMode="cover"
//           />
//           <View style={styles.promoContent}>
//             <Text style={styles.promoTitle}>Summer Sale</Text>
//             <Text style={styles.promoSubtitle}>Up to 50% off</Text>
//             <TouchableOpacity style={[styles.promoButton, { backgroundColor: colors.card }]}>
//               <Text style={[styles.promoButtonText, { color: colors.primary }]}>Shop Now</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.bannerIndicators}>
//             {promoBanners.map((_, index) => (
//               <View 
//                 key={index}
//                 style={[
//                   styles.indicator,
//                   index === currentBannerIndex ? styles.activeIndicator : { backgroundColor: 'rgba(255,255,255,0.5)' }
//                 ]}
//               />
//             ))}
//           </View>
//         </View>

//         {/* Featured Products */}
//         <View style={styles.sectionHeaderContainer}>
//           <Text style={[styles.sectionHeader, { color: colors.text }]}>Featured Products</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
//             <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
//           </TouchableOpacity>
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
//         ) : (
//           <FlatList
//             data={listings.slice(0, 6)}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderCard}
//             numColumns={2}
//             columnWrapperStyle={styles.row}
//             contentContainerStyle={styles.listContent}
//             scrollEnabled={false}
//           />
//         )}

//         {/* Daily Deals */}
//         <View style={styles.sectionHeaderContainer}>
//           <Text style={[styles.sectionHeader, { color: colors.text }]}>Daily Deals</Text>
//           <View style={[styles.timerContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#FFF5E6' }]}>
//             <Icon name="access-time" size={16} color={colors.primary} />
//             <Text style={[styles.timerText, { color: colors.primary }]}>05:32:14</Text>
//           </View>
//         </View>

//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           style={[styles.horizontalScroll, { marginHorizontal: -16, paddingLeft: 16 }]}
//         >
//           {listings.slice(0, 4).map(item => (
//             <TouchableOpacity 
//               key={item.id} 
//               style={[styles.horizontalCard, { 
//                 backgroundColor: colors.card,
//                 shadowColor: isDark ? '#000' : '#000',
//                 shadowOpacity: isDark ? 0.1 : 0.05,
//               }]}
//               onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
//             >
//               <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
//                 <Text style={styles.discountText}>-20%</Text>
//               </View>
//               <Image 
//                 source={{ uri: `${API_ROUTE_IMAGE}${item.images?.[0]?.image}` }} 
//                 style={styles.horizontalImage}
//               />
//               <View style={styles.horizontalContent}>
//                 <Text style={[styles.horizontalPrice, { color: colors.text }]}>₦{(item.price * 0.8).toLocaleString()}</Text>
//                 <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>₦{item.price.toLocaleString()}</Text>
//                 <Text style={[styles.horizontalTitle, { color: colors.textSecondary }]} numberOfLines={2}>{item.title}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Helper function to lighten colors
// function lightenColor(color, percent) {
//   const num = parseInt(color.replace("#", ""), 16);
//   const amt = Math.round(2.55 * percent);
//   const R = (num >> 16) + amt;
//   const G = (num >> 8 & 0x00FF) + amt;
//   const B = (num & 0x0000FF) + amt;
//   return `#${(
//     0x1000000 +
//     (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
//     (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
//     (B < 255 ? (B < 1 ? 0 : B) : 255)
//   ).toString(16).slice(1)}`;
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     // backgroundColor handled inline
//   },
//   container: {
//     flex: 1,
//     // backgroundColor handled inline
//     paddingHorizontal: 16,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // backgroundColor handled inline
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     height: 48,
//     marginRight: 12,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     // color handled inline
//   },
//   cameraButton: {
//     padding: 8,
//   },
//   notificationButton: {
//     padding: 8,
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     // backgroundColor handled inline
//   },
//   sectionHeaderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     marginTop: 24,
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: '700',
//     // color handled inline
//   },
//   seeAll: {
//     fontSize: 14,
//     // color handled inline
//     fontWeight: '500',
//   },
//   categoriesContainer: {
//     paddingBottom: 8,
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   categoryIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   categoryText: {
//     fontSize: 14,
//     fontWeight: '500',
//     // color handled inline
//   },
//   promoContainer: {
//     height: 160,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: 8,
//     position: 'relative',
//   },
//   promoBanner: {
//     width: '100%',
//     height: '100%',
//   },
//   promoContent: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   promoTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//     textShadowColor: 'rgba(0,0,0,0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   promoSubtitle: {
//     fontSize: 16,
//     color: '#fff',
//     marginBottom: 12,
//     textShadowColor: 'rgba(0,0,0,0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   promoButton: {
//     // backgroundColor handled inline
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     alignSelf: 'flex-start',
//   },
//   promoButtonText: {
//     // color handled inline
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   bannerIndicators: {
//     position: 'absolute',
//     bottom: 16,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   activeIndicator: {
//     backgroundColor: '#fff',
//     width: 16,
//   },
//   listContent: {
//     paddingBottom: 16,
//   },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   card: {
//     // backgroundColor handled inline
//     borderRadius: 12,
//     width: CARD_WIDTH,
//     shadowOffset: { width: 0, height: 2 },
//     // shadowColor handled inline
//     // shadowOpacity handled inline
//     shadowRadius: 4,
//     elevation: 2,
//     overflow: 'hidden',
//     marginBottom: 8,
//   },
//   cardImageContainer: {
//     width: '100%',
//     height: CARD_WIDTH,
//     position: 'relative',
//   },
//   cardImage: {
//     width: '100%',
//     height: '100%',
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
   
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardContent: {
//     padding: 12,
//   },
//   cardPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     // color handled inline
//     marginBottom: 4,
//   },
//   cardTitle: {
//     fontSize: 14,
//     // color handled inline
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardLocation: {
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   ratingText: {
//     fontSize: 12,
//     marginLeft: 2,
//     fontWeight: '500',
//   },
//   loading: {
//     marginVertical: 40,
//   },
//   timerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   timerText: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   horizontalScroll: {
   
//   },
//   horizontalCard: {
//     width: width * 0.6,
//     borderRadius: 12,
//     marginRight: 16,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     zIndex: 1,
//   },
//   discountText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   horizontalImage: {
//     width: '100%',
//     height: width * 0.5,
//   },
//   horizontalContent: {
//     padding: 12,
//   },
//   horizontalPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   originalPrice: {
//     fontSize: 12,
//     textDecorationLine: 'line-through',
//     marginBottom: 4,
//   },
//   horizontalTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  StatusBar,
  TextInput,
  LayoutAnimation 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext'; 

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; 

const categories = [
  { name: 'All', icon: 'grid', color: '#4A90E2' },
  { name: 'Gadgets', icon: 'mobile', color: '#4A90E2' },
  { name: 'Fashion', icon: 'shopping-bag', color: '#FF6B6B' },
  { name: 'Electronics', icon: 'tv', color: '#45B7D1' },
  { name: 'Vehicles', icon: 'car', color: '#FFA502' },
  { name: 'Home', icon: 'home', color: '#9C64A6' },
  { name: 'Other', icon: 'ellipsis-h', color: '#7ED321' },
];

const promoBanners = [
  require('../assets/images/8555e2167169969.Y3JvcCwxMTAzLDg2MiwwLDM2OA.png'),
  require('../assets/images/infinixhot605g2-1752219518.png'), 
];

export default function HomeScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchContainerWidth, setSearchContainerWidth] = useState('85%');
  
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  useEffect(() => {
    fetchListings();
    
    const bannerInterval = setInterval(rotateBanner, 5000);
    return () => clearInterval(bannerInterval);
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchQuery, selectedCategory, listings]);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_ROUTE}/listings/`);
      setListings(res.data);
      setFilteredListings(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const rotateBanner = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 100,
      })
    ]).start(() => {
      setCurrentBannerIndex((prevIndex) => 
        (prevIndex + 1) % promoBanners.length
      );
    });
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Apply category filter
    if (selectedCategory !== 'All') {
      // You'll need to adjust this based on how categories are stored in your listing data
      // This assumes listings have a 'category' field
      filtered = filtered.filter(listing => 
        listing.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(listing =>
        listing.title?.toLowerCase().includes(query) ||
        listing.description?.toLowerCase().includes(query) ||
        listing.location?.toLowerCase().includes(query)
      );
    }

    setFilteredListings(filtered);
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setSearchContainerWidth('100%');
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    setSearchContainerWidth('85%');
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? '#000' : '#000',
        shadowOpacity: isDark ? 0.1 : 0.05,
      }]}
      onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
    >
      <View style={styles.cardImageContainer}>
        {item.images && item.images.length > 0 && (
          <Image 
            source={{ uri: `${API_ROUTE_IMAGE}${item.images[0].image}` }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
        )}
        <View style={[styles.favoriteButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <Icon name="favorite-border" size={20} color="#fff" />
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardPrice, { color: colors.text }]}>₦{item.price.toLocaleString()}</Text>
        <Text style={[styles.cardTitle, { color: colors.textSecondary }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={14} color={colors.textSecondary} />
            <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>{item.location || 'Lagos'}</Text>
          </View>
          <View style={[styles.ratingContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.horizontalCard, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? '#000' : '#000',
        shadowOpacity: isDark ? 0.1 : 0.05,
      }]}
      onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
    >
      <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.discountText}>-20%</Text>
      </View>
      <Image 
        source={{ uri: `${API_ROUTE_IMAGE}${item.images?.[0]?.image}` }} 
        style={styles.horizontalImage}
      />
      <View style={styles.horizontalContent}>
        <Text style={[styles.horizontalPrice, { color: colors.text }]}>₦{(item.price * 0.8).toLocaleString()}</Text>
        <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>₦{item.price.toLocaleString()}</Text>
        <Text style={[styles.horizontalTitle, { color: colors.textSecondary }]} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // Calculate display listings
  const featuredProducts = useMemo(() => 
    filteredListings.slice(0, 6), [filteredListings]
  );

  const dailyDeals = useMemo(() => 
    filteredListings.slice(0, 4), [filteredListings]
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{display:'flex',flexDirection:'row', alignContent:'center',alignItems:'center', justifyContent:'flex-start'}}>
           <TouchableOpacity onPress={()=>navigation.goBack()}>
             <Icon name="arrow-back" size={28} color={colors.primary} />
           </TouchableOpacity>
           
         <Text style={[styles.sectionHeader,{
           fontSize:40,
           fontWeight:'bold',
           marginTop:15,
           marginLeft:10,
           color: colors.text
         }]}>MarketPlace.</Text>
        </View>
         
        <View style={styles.headerContainer}>
          <Animated.View style={[styles.searchContainer, { 
            width: searchContainerWidth,
            backgroundColor: colors.backgroundSecondary 
          }]}>
            <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchQuery !== '' && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Icon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
            {!searchFocused && (
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={() => navigation.navigate('CreateListing')}
              >
                <Icon name="photo-camera" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('CreateListing')}
          >
            <Icon name="add" size={24} color={colors.primary} />
            <View style={[styles.notificationBadge, { backgroundColor: '#FF3B30' }]} />
          </TouchableOpacity>
        </View>

        {/* Filter Status */}
        {(searchQuery !== '' || selectedCategory !== 'All') && (
          <View style={[styles.filterStatusContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.filterStatusText, { color: colors.text }]}>
              Showing {filteredListings.length} results
              {searchQuery !== '' && ` for "${searchQuery}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
                Clear filters
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories */}
        <Text style={[styles.sectionHeader, {
          marginBottom: 20,
          color: colors.text
        }]}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.categoryItem}
              onPress={() => handleCategorySelect(category.name)}
            >
              <LinearGradient
                colors={selectedCategory === category.name ? 
                  [colors.primary, colors.primary] : 
                  [category.color, lightenColor(category.color, 20)]}
                style={[
                  styles.categoryIcon,
                  selectedCategory === category.name && styles.selectedCategoryIcon
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome 
                  name={category.icon} 
                  size={20} 
                  color="#fff" 
                />
              </LinearGradient>
              <Text style={[
                styles.categoryText, 
                { 
                  color: selectedCategory === category.name ? 
                    colors.primary : colors.text 
                }
              ]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Banner */}
        <View style={styles.promoContainer}>
          <Animated.Image
            source={promoBanners[currentBannerIndex]} 
            style={[styles.promoBanner, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Summer Sale</Text>
            <Text style={styles.promoSubtitle}>Up to 50% off</Text>
            <TouchableOpacity style={[styles.promoButton, { backgroundColor: colors.card }]}>
              <Text style={[styles.promoButtonText, { color: colors.primary }]}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerIndicators}>
            {promoBanners.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.indicator,
                  index === currentBannerIndex ? styles.activeIndicator : { backgroundColor: 'rgba(255,255,255,0.5)' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>
            Featured Products {filteredListings.length !== listings.length && `(${featuredProducts.length})`}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllProducts', { 
            filteredListings,
            searchQuery,
            selectedCategory 
          })}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
        ) : featuredProducts.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Icon name="search-off" size={50} color={colors.textSecondary} />
            <Text style={[styles.noResultsText, { color: colors.text }]}>
              No products found {searchQuery ? `for "${searchQuery}"` : ''}
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={clearFilters}
            >
              <Text style={styles.retryButtonText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={featuredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}

        {/* Daily Deals */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>
            Daily Deals {filteredListings.length !== listings.length && `(${dailyDeals.length})`}
          </Text>
          <View style={[styles.timerContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#FFF5E6' }]}>
            <Icon name="access-time" size={16} color={colors.primary} />
            <Text style={[styles.timerText, { color: colors.primary }]}>05:32:14</Text>
          </View>
        </View>

        {dailyDeals.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={[styles.horizontalScroll, { marginHorizontal: -16, paddingLeft: 16 }]}
          >
            {dailyDeals.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.horizontalCard, { 
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#000',
                  shadowOpacity: isDark ? 0.1 : 0.05,
                }]}
                onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
              >
                <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.discountText}>-20%</Text>
                </View>
                <Image 
                  source={{ uri: `${API_ROUTE_IMAGE}${item.images?.[0]?.image}` }} 
                  style={styles.horizontalImage}
                />
                <View style={styles.horizontalContent}>
                  <Text style={[styles.horizontalPrice, { color: colors.text }]}>₦{(item.price * 0.8).toLocaleString()}</Text>
                  <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>₦{item.price.toLocaleString()}</Text>
                  <Text style={[styles.horizontalTitle, { color: colors.textSecondary }]} numberOfLines={2}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to lighten colors
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  cameraButton: {
    padding: 8,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterStatusText: {
    fontSize: 14,
    flex: 1,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCategoryIcon: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  promoContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    position: 'relative',
  },
  promoBanner: {
    width: '100%',
    height: '100%',
  },
  promoContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  promoButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    width: CARD_WIDTH,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardImageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLocation: {
    fontSize: 12,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 2,
    fontWeight: '500',
  },
  loading: {
    marginVertical: 40,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  horizontalScroll: {},
  horizontalCard: {
    width: width * 0.6,
    borderRadius: 12,
    marginRight: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  horizontalImage: {
    width: '100%',
    height: width * 0.5,
  },
  horizontalContent: {
    padding: 12,
  },
  horizontalPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  horizontalTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});