import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Linking,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../src/context/ThemeContext'; 
import { API_ESSENTIAL_NEWS } from '../api_routing/api';
import { createMMKV } from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';

const { width: viewportWidth } = Dimensions.get('window');

// Initialize MMKV storage
const storage = createMMKV({
  id: 'news-storage',
});

const NewsListScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme(); 
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  let autoPlayTimer = useRef(null);

  // Cache keys
  const CACHE_KEYS = {
    NEWS: 'cached_news',
    PAGE: 'cached_page',
    HAS_MORE: 'cached_has_more',
    TIMESTAMP: 'cached_timestamp',
    LAST_UPDATED: 'last_updated'
  };

  // Cache expiry time (30 minutes)
  const CACHE_EXPIRY = 30 * 60 * 1000;

  // Save data to MMKV cache
  const saveToCache = (newsData, pageNum, hasMoreData) => {
    try {
      storage.set(CACHE_KEYS.NEWS, JSON.stringify(newsData));
      storage.set(CACHE_KEYS.PAGE, String(pageNum));
      storage.set(CACHE_KEYS.HAS_MORE, String(hasMoreData));
      storage.set(CACHE_KEYS.TIMESTAMP, String(Date.now()));
      storage.set(CACHE_KEYS.LAST_UPDATED, new Date().toLocaleString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Load data from MMKV cache
  const loadFromCache = () => {
    try {
      const cachedNews = storage.getString(CACHE_KEYS.NEWS);
      const cachedPage = storage.getString(CACHE_KEYS.PAGE);
      const cachedHasMore = storage.getString(CACHE_KEYS.HAS_MORE);
      const cachedTimestamp = storage.getString(CACHE_KEYS.TIMESTAMP);
      const lastUpdatedTime = storage.getString(CACHE_KEYS.LAST_UPDATED);

      if (cachedNews && cachedPage && cachedHasMore && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        
        if (now - timestamp < CACHE_EXPIRY) {
          return {
            news: JSON.parse(cachedNews),
            page: parseInt(cachedPage),
            hasMore: cachedHasMore === 'true',
            lastUpdated: lastUpdatedTime || 'Recently',
            isExpired: false
          };
        } else {
          return {
            news: JSON.parse(cachedNews),
            page: parseInt(cachedPage),
            hasMore: cachedHasMore === 'true',
            lastUpdated: lastUpdatedTime || 'Recently',
            isExpired: true
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
    }
  };

  // Clear all cache - FIXED for MMKV v4
  const clearCache = () => {
    try {
      storage.delete(CACHE_KEYS.NEWS);
      storage.delete(CACHE_KEYS.PAGE);
      storage.delete(CACHE_KEYS.HAS_MORE);
      storage.delete(CACHE_KEYS.TIMESTAMP);
      storage.delete(CACHE_KEYS.LAST_UPDATED);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      try {
        const allKeys = storage.getAllKeys();
        allKeys.forEach(key => {
          storage.delete(key);
        });
        console.log('All cache keys cleared');
      } catch (fallbackError) {
        console.error('Fallback cache clear also failed:', fallbackError);
      }
    }
  };

  const fetchNews = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      if (pageNum === 1 && !isRefresh) {
        const cachedData = loadFromCache();
        if (cachedData) {
          console.log('Loading news from cache');
          setNews(cachedData.news);
          setPage(cachedData.page);
          setHasMore(cachedData.hasMore);
          setLastUpdated(cachedData.lastUpdated);
          
          if (!cachedData.isExpired) {
            console.log('Cache is fresh');
            setLoading(false);
            return;
          } else {
            console.log('Cache expired, fetching fresh data in background');
            setLoading(false);
            setTimeout(() => {
              fetchFreshData(pageNum);
            }, 100);
            return;
          }
        }
      }

      await fetchFreshData(pageNum, isRefresh);
      
    } catch (error) {
      console.error('Error in fetchNews:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFreshData = async (pageNum = 1, isRefresh = false) => {
    try {
      console.log('Fetching news from API');
      const response = await fetch(
        `https://backend.essentialnews.ng/api/posts/breaking?page=${pageNum}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        let newsData = data.data.posts;
        let hasMoreData = true;
        
        if (newsData.length > 20) {
          newsData = newsData.slice(0, 20);
          hasMoreData = false;
        }
        
        let updatedNews;
        let updatedPage;
        let updatedHasMore;
        
        if (isRefresh || pageNum === 1) {
          updatedNews = newsData;
          updatedPage = 1;
          updatedHasMore = data.data.pagination.current_page < data.data.pagination.last_page;
        } else {
          updatedNews = [...news, ...newsData];
          updatedPage = pageNum;
          updatedHasMore = data.data.pagination.current_page < data.data.pagination.last_page;
        }
        
        setNews(updatedNews);
        setPage(updatedPage);
        setHasMore(updatedHasMore);
        setLastUpdated(new Date().toLocaleString());
        
        if (pageNum === 1) {
          saveToCache(updatedNews, updatedPage, updatedHasMore);
        }
      }
    } catch (error) {
      console.error('Error fetching fresh data:', error);
      
      if (pageNum === 1 && news.length === 0) {
        const cachedData = loadFromCache();
        if (cachedData) {
          console.log('Loading cached data as fallback');
          setNews(cachedData.news);
          setPage(cachedData.page);
          setHasMore(cachedData.hasMore);
          setLastUpdated(cachedData.lastUpdated);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (news.length > 0) {
      startAutoPlay();
    }
    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [news]);

  const startAutoPlay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    autoPlayTimer.current = setInterval(() => {
      const carouselData = news.slice(0, 5);
      if (carouselData.length > 0) {
        const nextIndex = (activeCarouselIndex + 1) % carouselData.length;
        setActiveCarouselIndex(nextIndex);
        if (carouselRef.current) {
          carouselRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
      }
    }, 4000);
  };

  const handleCarouselScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const itemWidth = viewportWidth - 48; // Width + gap
    const index = Math.round(contentOffsetX / itemWidth);
    setActiveCarouselIndex(index);
  };

  const handleRefresh = () => {
    clearCache();
    setPage(1);
    setActiveCarouselIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollToIndex({ index: 0, animated: false });
    }
    fetchNews(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading && news.length < 20) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleExplorePress = () => {
    Linking.openURL(`${API_ESSENTIAL_NEWS}`);
  };

  const handleNewsPress = (item) => {
    Linking.openURL(item.link || `${API_ESSENTIAL_NEWS}`);
  };

  const styles = createStyles(colors, isDark);

  // Carousel render item with proper spacing
  const renderCarouselItem = ({ item, index }) => {
    const itemWidth = viewportWidth - 48; 
    return (
      <TouchableOpacity
        style={[styles.carouselItem, { width: itemWidth }]}
        onPress={() => handleNewsPress(item)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.featured_image || 'https://via.placeholder.com/800x400' }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.carouselGradient}
        />
        <View style={styles.carouselContent}>
          {item.is_breaking && (
            <View style={styles.carouselBreakingBadge}>
              <Icon name="warning" size={14} color="#fff" />
              <Text style={styles.carouselBreakingText}>BREAKING</Text>
            </View>
          )}
          <Text style={styles.carouselTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.carouselMeta}>
            <View style={styles.carouselMetaItem}>
              <Icon name="category" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.carouselMetaText}>{item.category_names || 'General'}</Text>
            </View>
            <View style={styles.carouselMetaItem}>
              <Icon name="calendar-today" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.carouselMetaText}>{formatDate(item.created_at)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => handleNewsPress(item)}
    >
      <Image
        source={{ uri: item.featured_image || 'https://via.placeholder.com/300x200' }}
        style={styles.newsImage}
        resizeMode="cover"
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.newsMeta}>
          <View style={styles.metaItem}>
            <Icon name="category" size={14} color={isDark ? '#9ca3af' : '#666'} />
            <Text style={styles.metaText}>{item.category_names || 'General'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar-today" size={14} color={isDark ? '#9ca3af' : '#666'} />
            <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="visibility" size={14} color={isDark ? '#9ca3af' : '#666'} />
            <Text style={styles.metaText}>{item.views} views</Text>
          </View>
        </View>
        {item.is_breaking && (
          <View style={styles.breakingBadge}>
            <Icon name="warning" size={12} color="#fff" />
            <Text style={styles.breakingText}>BREAKING</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    const carouselData = news.slice(0, 5);
    
    return (
      <View style={styles.header}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <View style={styles.navbarContent}>
            <TouchableOpacity 
              style={styles.exploreBuftton}
              onPress={()=>navigation.goBack()}
            >
              <Icon name="arrow-back" size={25} color="#fff" />
              
            </TouchableOpacity>
            <Text style={styles.navbarTitle}>e-News</Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={handleExplorePress}
            >
              <Icon name="explore" size={20} color="#fff" />
              <Text style={styles.exploreButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last updated indicator */}
        {!loading && news.length > 0 && lastUpdated && (
          <View style={styles.lastUpdatedContainer}>
            <Icon name="update" size={12} color={isDark ? '#9ca3af' : '#999'} />
            <Text style={styles.lastUpdatedText}>
              Updated: {lastUpdated}
            </Text>
          </View>
        )}

        {/* Loading indicator */}
        {loading && news.length === 0 && (
          <View style={styles.topLoadingContainer}>
            <ActivityIndicator size="small" color={isDark ? '#60a5fa' : '#0750b5'} />
            <Text style={styles.topLoadingText}>Loading latest news...</Text>
          </View>
        )}

        {/* Custom Carousel with proper spacing */}
        {!loading && news.length > 0 && (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={carouselRef}
              data={carouselData}
              renderItem={renderCarouselItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="start"
              snapToInterval={viewportWidth - 48}
              decelerationRate="fast"
              onScroll={handleCarouselScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.carouselContentContainer}
              getItemLayout={(data, index) => ({
                length: viewportWidth - 48,
                offset: (viewportWidth - 48) * index,
                index,
              })}
            />
            
            {/* Pagination dots */}
            <View style={styles.paginationContainer}>
              {carouselData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeCarouselIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (loading && news.length > 0) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={isDark ? '#60a5fa' : '#0750b5'} />
          <Text style={styles.footerText}>Loading more news...</Text>
        </View>
      );
    }
    
    if (hasMore && news.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Pull up to load more</Text>
        </View>
      );
    }
    
    if (news.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No more news to load</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : Platform.OS === 'android' ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? '#1e40af' : '#0750b5'} 
      />
      
      <FlatList
        data={news.slice(5)}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={[isDark ? '#60a5fa' : '#0750b5']}
            tintColor={isDark ? '#60a5fa' : '#0750b5'}
            progressBackgroundColor={isDark ? '#1f2937' : '#fff'}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Icon name="newspaper" size={64} color={isDark ? '#4b5563' : '#ccc'} />
              <Text style={styles.emptyText}>No news available</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>Tap to refresh</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 8,
  },
  navbar: {
    backgroundColor: isDark ? '#1e40af' : '#0750b5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDark ? 0.4 : 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 35,
    fontWeight: 'bold',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  lastUpdatedText: {
    fontSize: 11,
    color: isDark ? '#9ca3af' : '#999',
    marginLeft: 4,
  },
  topLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: isDark ? '#1f2937' : '#f8f9fa',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  topLoadingText: {
    marginLeft: 8,
    color: colors.text,
    fontSize: 14,
  },
  carouselContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  carouselContentContainer: {
    paddingHorizontal: 24, // Creates space on left and right of carousel
  },
  carouselItem: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: isDark ? 0.4 : 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginRight: 16, // Creates gap between items
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  carouselContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  carouselBreakingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  carouselBreakingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  carouselMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  carouselMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  carouselMetaText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: isDark ? '#4b5563' : '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: isDark ? '#60a5fa' : '#0750b5',
  },
  listContent: {
    paddingBottom: 16,
  },
  newsItem: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: isDark ? 4 : 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#666',
    marginLeft: 4,
  },
  breakingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#dc2626' : '#e53e3e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  breakingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: isDark ? '#9ca3af' : '#666',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyText: {
    marginTop: 16,
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: isDark ? '#2563eb' : '#0750b5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewsListScreen;