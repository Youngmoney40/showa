import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function HomeScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchContainerWidth, setSearchContainerWidth] = useState('85%');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ROUTE}/listings/`);
      console.log('📦 Listings fetched:', response.data.length);
      setListings(response.data);
      setFilteredListings(response.data);
    } catch (err) {
      console.log('Error fetching listings:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredListings(listings);
    } else {
      const searchLower = text.toLowerCase().trim();
      const filtered = listings.filter((item) => {
        // Safely check each field
        const titleMatch = item.title?.toLowerCase().includes(searchLower) || false;
        const locationMatch = item.location?.toLowerCase().includes(searchLower) || false;
        const descriptionMatch = item.description?.toLowerCase().includes(searchLower) || false;
        // Safely check category - handle both string and object
        let categoryMatch = false;
        if (item.category) {
          if (typeof item.category === 'string') {
            categoryMatch = item.category.toLowerCase().includes(searchLower);
          } else if (typeof item.category === 'object' && item.category.name) {
            categoryMatch = item.category.name.toLowerCase().includes(searchLower);
          }
        }
        return titleMatch || locationMatch || descriptionMatch || categoryMatch;
      });
      setFilteredListings(filtered);
    }
  }, [listings]);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setSearchContainerWidth('100%');
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    setSearchContainerWidth('85%');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredListings(listings);
  };

  const renderCard = useCallback(({ item }) => {
    const imageUrl = item.images && item.images.length > 0 
      ? `${API_ROUTE_IMAGE}${item.images[0].image}` 
      : null;
    
    // Safely get category name
    let categoryName = '';
    if (item.category) {
      if (typeof item.category === 'string') {
        categoryName = item.category;
      } else if (typeof item.category === 'object' && item.category.name) {
        categoryName = item.category.name;
      }
    }

    return (
      <TouchableOpacity
        style={[styles.card, { 
          backgroundColor: colors.surface,
          shadowColor: isDark ? 'transparent' : '#000',
        }]}
        onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardImageContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.cardImage} 
              resizeMode="cover"
              onError={(e) => console.log('Image error:', e.nativeEvent.error)}
            />
          ) : (
            <View style={[styles.noImageContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#f5f5f5' }]}>
              <Icon name="image" size={40} color={isDark ? '#555' : '#ccc'} />
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardPrice, { color: colors.primary }]}>
            ₦{item.price?.toLocaleString() || '0'}
          </Text>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title || 'Untitled'}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.locationContainer}>
              <Icon name="location-on" size={14} color={colors.textTertiary} />
              <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>
                {item.location || 'Lagos'}
              </Text>
            </View>
            {categoryName ? (
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? colors.surfaceSecondary : '#f0f0f0' }]}>
                <Text style={[styles.categoryBadgeText, { color: colors.textSecondary }]}>
                  {categoryName}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [colors, isDark, navigation]);

  const keyExtractor = useCallback((item) => item.id?.toString() || Math.random().toString(), []);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={60} color={colors.textTertiary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {searchQuery ? 'No results found' : 'No listings available'}
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        {searchQuery ? 'Try adjusting your search' : 'Check back later for new listings'}
      </Text>
    </View>
  ), [colors, searchQuery]);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />

      {/* Navbar */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity 
          style={styles.addButtonHeader}
          onPress={() => navigation.navigate('CreateListing')}
          activeOpacity={0.7}
        >
          <Ionicons name="add-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchContainer, { 
            backgroundColor: isDark ? colors.surface : '#f5f5f5',
            borderColor: searchFocused ? colors.primary : 'transparent',
            borderWidth: searchFocused ? 2 : 0,
          }]}>
            <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Icon name="close" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading listings...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredListings}
            keyExtractor={keyExtractor}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={renderEmptyState}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  addButtonHeader: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchWrapper: {
    marginTop: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    padding: 0,
  },
  clearButton: {
    padding: 4,
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
    shadowOpacity: 0.05,
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
  noImageContainer: {
    width: '100%',
    height: '100%',
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
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});