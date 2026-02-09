import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../src/context/ThemeContext'; 
import { API_ESSENTIAL_NEWS } from '../api_routing/api';

const NewsListScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme(); 
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(
        `https://backend.essentialnews.ng/api/posts/breaking?page=${pageNum}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        let newsData = data.data.posts;
        if (newsData.length > 20) {
          newsData = newsData.slice(0, 20);
          setHasMore(false);
        }
        
        if (isRefresh || pageNum === 1) {
          setNews(newsData);
        } else {
          setNews(prevNews => [...prevNews, ...newsData]);
        }
        
        setHasMore(data.data.pagination.current_page < data.data.pagination.last_page);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    setPage(1);
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

  const styles = createStyles(colors, isDark); 

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={handleExplorePress}
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

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Professional Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navbarContent}>
          <Text style={styles.navbarTitle}>Essential News</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleExplorePress}
          >
            <Icon name="explore" size={20} color="#fff" />
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading indicator at the top when initial loading */}
      {loading && news.length === 0 && (
        <View style={styles.topLoadingContainer}>
          <ActivityIndicator size="small" color={isDark ? '#60a5fa' : '#0750b5'} />
          <Text style={styles.topLoadingText}>Loading latest news...</Text>
        </View>
      )}
    </View>
  );

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
        data={news}
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
    marginBottom: 16,
  },
  // Navbar styles
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
    fontSize: 20,
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