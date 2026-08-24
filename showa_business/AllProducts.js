

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
  LayoutAnimation,
  RefreshControl,
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

// Auto-refresh interval: 5 minutes (300,000 ms)
const AUTO_REFRESH_INTERVAL = 300000; // 5 minutes

const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Laptops & Computers': 'laptop',
    'Home & Furniture': 'home',
    'Beauty & Health': 'heartbeat',
    'Fashion': 'shopping-bag',
    'Vehicles': 'car',
    'Electronics': 'tv',
    'Other': 'ellipsis-h',
  };
  return iconMap[categoryName] || 'tag';
};

const getCategoryColor = (categoryName) => {
  const colorMap = {
    'Laptops & Computers': '#4A90E2',
    'Home & Furniture': '#9C64A6',
    'Beauty & Health': '#FF6B6B',
    'Fashion': '#FFA502',
    'Vehicles': '#45B7D1',
    'Electronics': '#7ED321',
    'Other': '#95A5A6',
  };
  return colorMap[categoryName] || '#4A90E2';
};

const promoBanners = [
  require('../assets/images/8555e2167169969.Y3JvcCwxMTAzLDg2MiwwLDM2OA.png'),
  require('../assets/images/infinixhot605g2-1752219518.png'), 
];

export default function HomeScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchContainerWidth, setSearchContainerWidth] = useState('85%');
  const [categories, setCategories] = useState([]);
  const isMounted = useRef(true);
  const isRefreshingRef = useRef(false);
  
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  // Auto-refresh in background every 5 minutes
  const autoRefreshInterval = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    fetchListings();
    
    // Banner rotation
    const bannerInterval = setInterval(rotateBanner, 5000);
    
    // Auto-refresh in background every 5 minutes
    autoRefreshInterval.current = setInterval(() => {
      if (isMounted.current && !isRefreshingRef.current) {
        console.log('🔄 Auto-refreshing listings in background...');
        fetchListings(true); // Silent refresh
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      isMounted.current = false;
      clearInterval(bannerInterval);
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchQuery, selectedCategory, listings]);

  // Extract unique categories from listings
  useEffect(() => {
    if (listings.length > 0) {
      const uniqueCategories = ['All', ...new Set(listings.map(item => item.category_name))];
      setCategories(uniqueCategories);
    }
  }, [listings]);

  const fetchListings = async (silent = false) => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshingRef.current) return;
    
    try {
      isRefreshingRef.current = true;
      if (!silent) {
        setLoading(true);
      }
      const res = await axios.get(`${API_ROUTE}/listings/`);
      if (isMounted.current) {
        setListings(res.data);
        setFilteredListings(res.data);
        console.log(`📦 Fetched ${res.data.length} listings ${silent ? '(background)' : ''}`);
      }
    } catch (err) {
      console.log('❌ Error fetching listings:', err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
        isRefreshingRef.current = false;
      }
    }
  };

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    if (isRefreshingRef.current) return; // Prevent double refresh
    setRefreshing(true);
    fetchListings(false);
  }, []);

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

    // Filter by category using category_name from DB
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(listing => 
        listing.category_name === selectedCategory
      );
    }

    // Filter by search query
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
      activeOpacity={0.7}
    >
      <View style={styles.cardImageContainer}>
        {item.images && item.images.length > 0 && (
          <Image 
            source={{ uri: `${API_ROUTE_IMAGE}${item.images[0].image}` }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardPrice, { color: colors.text }]}>₦{parseFloat(item.price).toLocaleString()}</Text>
        <Text style={[styles.cardTitle, { color: colors.textSecondary }]} numberOfLines={1}>{item.title}</Text>
        {/* Show category name */}
        <View style={styles.categoryTag}>
          <Text style={[styles.categoryTagText, { color: colors.primary }]}>{item.category_name}</Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={14} color={colors.textSecondary} />
            <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>{item.location || 'Available on request'}</Text>
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
      activeOpacity={0.7}
    >
      <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.discountText}>-20%</Text>
      </View>
      <Image 
        source={{ uri: `${API_ROUTE_IMAGE}${item.images?.[0]?.image}` }} 
        style={styles.horizontalImage}
      />
      <View style={styles.horizontalContent}>
        <Text style={[styles.horizontalPrice, { color: colors.text }]}>₦{(parseFloat(item.price) * 0.8).toLocaleString()}</Text>
        <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>₦{parseFloat(item.price).toLocaleString()}</Text>
        <Text style={[styles.horizontalTitle, { color: colors.textSecondary }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.categoryTagText, { color: colors.primary, fontSize: 12, marginTop: 4 }]}>{item.category_name}</Text>
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
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
      >
     
        <View style={{display:'flex',flexDirection:'row', alignContent:'center',alignItems:'center', justifyContent:'flex-start'}}>
           <TouchableOpacity onPress={()=>navigation.goBack()} activeOpacity={0.7}>
             <Icon style={{marginTop:20}} name="arrow-back" size={28} color={colors.primary} />
           </TouchableOpacity>
           
         <Text style={[styles.sectionHeader,{
           fontSize:30,
           fontWeight:'bold',
           marginTop:20,
           marginLeft:10,
           color: colors.text
         }]}>Listing</Text>
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
            
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('CreateListing')}
          >
            <Icon name="add" size={24} color={colors.primary} />
            
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

        

        

        {/* Featured Products */}
        

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
        ) : featuredProducts.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Icon name="search-off" size={50} color={colors.textSecondary} />
            <Text style={[styles.noResultsText, { color: colors.text }]}>
              No products found {searchQuery ? `for "${searchQuery}"` : ''}
            </Text>
           
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

       
        
      </ScrollView>
    </SafeAreaView>
  );
}

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
    textShadowRadius: 12,
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
    marginBottom: 4,
    fontWeight: '500',
  },
  categoryTag: {
    marginBottom: 8,
  },
  categoryTagText: {
    fontSize: 12,
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