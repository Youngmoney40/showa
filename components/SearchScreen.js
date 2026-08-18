import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  ScrollView,
  Keyboard,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE,API_ROUTE_IMAGE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingData, setTrendingData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all'); // all, users, posts, videos, listings, services, groups
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchInputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Tabs configuration
  const tabs = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'users', label: 'Users', icon: 'people-outline' },
    { id: 'posts', label: 'Posts', icon: 'document-text-outline' },
    { id: 'videos', label: 'Videos', icon: 'videocam-outline' },
    { id: 'listings', label: 'Listings', icon: 'storefront-outline' },
    { id: 'services', label: 'Services', icon: 'briefcase-outline' },
    // { id: 'groups', label: 'Groups', icon: 'people-circle-outline' },
    // { id: 'hashtags', label: 'Hashtags', icon: 'pricetag-outline' },
  ];

  // Load recent searches and trending data on focus
  useFocusEffect(
    useCallback(() => {
      loadRecentSearches();
      loadTrendingData();
      return () => {
        // Cleanup
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }, [])
  );

  // Load recent searches
  const loadRecentSearches = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/search/recent/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRecentSearches(response.data.recent_searches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // Load trending data
  const loadTrendingData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/search/trending/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTrendingData(response.data);
      }
    } catch (error) {
      console.error('Error loading trending data:', error);
    }
  };

  // Search with debounce
  const performSearch = useCallback(async (query) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults(null);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setLoading(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        // Get autocomplete suggestions
        const autoCompleteRes = await axios.get(
          `${API_ROUTE}/search/autocomplete/?q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (autoCompleteRes.data.success) {
          setSuggestions(autoCompleteRes.data.suggestions);
        }

        // Get full search results
        const searchRes = await axios.get(
          `${API_ROUTE}/search/?q=${encodeURIComponent(query)}&type=${selectedTab}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (searchRes.data.success) {
          setSearchResults(searchRes.data);
          
          // Save to recent searches
          if (searchRes.data.results && Object.values(searchRes.data.results).some(arr => arr.length > 0)) {
            await axios.post(
              `${API_ROUTE}/search/recent/`,
              { query: query },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            loadRecentSearches();
          }
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [selectedTab]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    if (searchQuery.length >= 2) {
      performSearch(searchQuery);
    }
  };

  // Handle search item press
  const handleSearchItemPress = (item) => {
    if (item.type === 'user') {
      navigation.navigate('OtherUserProfile', { userId: item.id });
    } else if (item.type === 'post') {
      navigation.navigate('ExplorePostDetails', { postId: item.id });
    } else if (item.type === 'video') {
      navigation.navigate('ShortDetail', { shortId: item.id });
    } else if (item.type === 'listing') {
      navigation.navigate('ListingDetails', { listingId: item.id });
    } else if (item.type === 'service') {
      navigation.navigate('SupplyRequestDetail', { serviceId: item.id });
    } else if (item.type === 'group') {
      navigation.navigate('GroupDetail', { groupSlug: item.slug });
    } else if (item.type === 'hashtag') {
      navigation.navigate('HashtagPosts', { hashtag: item.name });
    }
  };

  //navigation.navigate('SupplyRequestDetail', { serviceId: service.id, serviceData: service });

  // Render suggestion item
  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        setSearchQuery(item.display || item.name);
        setShowSuggestions(false);
        performSearch(item.display || item.name);
      }}
    >
      {item.type === 'user' ? (
        <Image
          source={item.profile_picture ? { uri: item.profile_picture } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
          style={styles.suggestionAvatar}
        />
      ) : (
        <View style={[styles.suggestionIcon, { backgroundColor: colors.primary + '20' }]}>
          <Icon 
            name={item.type === 'hashtag' ? 'pricetag-outline' : 'people-outline'} 
            size={20} 
            color={colors.primary} 
          />
        </View>
      )}
      <View style={styles.suggestionInfo}>
        <Text style={[styles.suggestionText, { color: colors.text }]}>
          {item.display || item.name}
        </Text>
        {item.subtitle && (
          <Text style={[styles.suggestionSubtext, { color: colors.textSecondary }]}>
            {item.subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render search result item
  const renderResultItem = ({ item }) => {
    if (item.type === 'user') {
      return (
        <TouchableOpacity
          style={[styles.resultItem, { backgroundColor: colors.card }]}
          onPress={() => handleSearchItemPress(item)}
        >
          <Image
            source={item.profile_picture ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
            style={styles.resultAvatar}
          />
          <View style={styles.resultInfo}>
            <View style={styles.resultNameContainer}>
              <Text style={[styles.resultName, { color: colors.text }]}>
                {item.name}
              </Text>
              {item.is_verified && (
                <Icon name="checkmark-circle" size={16} color="#1545f1" style={styles.verifiedIcon} />
              )}
            </View>
            <Text style={[styles.resultUsername, { color: colors.textSecondary }]}>
              @{item.username}
            </Text>
            {item.bio && (
              <Text style={[styles.resultBio, { color: colors.textTertiary }]} numberOfLines={1}>
                {item.bio}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.followButton,
              { 
                backgroundColor: item.is_following ? colors.border : colors.primary,
                borderColor: item.is_following ? colors.border : colors.primary,
              }
            ]}
          >
            <Text style={[
              styles.followButtonText,
              { color: item.is_following ? colors.text : '#fff' }
            ]}>
              {item.is_following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    if (item.type === 'post' || item.type === 'video') {
      return (
        <TouchableOpacity
          style={[styles.mediaResultItem, { backgroundColor: colors.card }]}
          onPress={() => handleSearchItemPress(item)}
        >
          {item.image || item.thumbnail ? (
            <Image
              source={{ uri: item.image || item.thumbnail }}
              style={styles.mediaResultImage}
            />
          ) : (
            <View style={[styles.mediaResultPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
              <Icon name={item.type === 'video' ? 'videocam' : 'document-text'} size={30} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.mediaResultInfo}>
            <Text style={[styles.mediaResultText, { color: colors.text }]} numberOfLines={2}>
              {item.content || item.caption}
            </Text>
            <View style={styles.mediaResultMeta}>
              <Text style={[styles.mediaResultUser, { color: colors.textSecondary }]}>
                {item.user?.name}
              </Text>
              <View style={styles.mediaResultStats}>
                <Icon name="heart-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.mediaResultStatText, { color: colors.textSecondary }]}>
                  {item.like_count || 0}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Other result types (listings, services, groups, hashtags)
    return (
      <TouchableOpacity
        style={[styles.resultItem, { backgroundColor: colors.card }]}
        onPress={() => handleSearchItemPress(item)}
      >
        <View style={[styles.resultIconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Icon 
            name={
              item.type === 'listing' ? 'storefront' :
              item.type === 'service' ? 'briefcase' :
              item.type === 'group' ? 'people' :
              'pricetag'
            } 
            size={24} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.resultInfo}>
          <Text style={[styles.resultName, { color: colors.text }]}>
            {item.title || item.name}
          </Text>
          {item.price && (
            <Text style={[styles.resultPrice, { color: colors.primary }]}>
              ${item.price}
            </Text>
          )}
          {item.location && (
            <Text style={[styles.resultLocation, { color: colors.textSecondary }]}>
              <Icon name="location-outline" size={12} color={colors.textSecondary} />
              {' '}{item.location}
            </Text>
          )}
          {item.members_count && (
            <Text style={[styles.resultLocation, { color: colors.textSecondary }]}>
              {item.members_count} members
            </Text>
          )}
          {item.post_count && (
            <Text style={[styles.resultLocation, { color: colors.textSecondary }]}>
              {item.post_count} posts
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render all results
  const renderAllResults = () => {
    if (!searchResults || !searchResults.results) return null;

    const allResults = [];
    const categories = ['users', 'posts', 'videos', 'listings', 'services', 'groups', 'hashtags'];
    
    categories.forEach(category => {
      if (searchResults.results[category] && searchResults.results[category].length > 0) {
        allResults.push({
          category: category,
          title: category.charAt(0).toUpperCase() + category.slice(1),
          data: searchResults.results[category],
        });
      }
    });

    if (allResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={60} color={colors.textTertiary} />
          <Text style={[styles.emptyStateText, { color: colors.text }]}>
            No results found for "{searchQuery}"
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
            Try different keywords or check your spelling
          </Text>
        </View>
      );
    }

    return allResults.map((section) => (
      <View key={section.category} style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {section.title}
        </Text>
        {section.data.map((item, index) => (
          <View key={item.id || index}>
            {renderResultItem({ item })}
          </View>
        ))}
      </View>
    ));
  };

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchContainer, { 
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        }]}>
          <Icon name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for people, posts, videos..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={performSearch}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && [styles.activeTab, { borderBottomColor: colors.primary }]
              ]}
              onPress={() => handleTabChange(tab.id)}
            >
              <Icon 
                name={tab.icon} 
                size={20} 
                color={selectedTab === tab.id ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.tabText,
                { color: selectedTab === tab.id ? colors.primary : colors.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Searching...
          </Text>
        </View>
      ) : showSuggestions && suggestions.length > 0 && searchQuery.length >= 2 ? (
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item, index) => `${item.id || index}`}
          contentContainerStyle={styles.suggestionsList}
          keyboardShouldPersistTaps="handled"
        />
      ) : searchResults && searchQuery.length >= 2 ? (
        <ScrollView 
          style={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderAllResults()}
        </ScrollView>
      ) : (
        <ScrollView style={styles.defaultContainer} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.recentContainer}>
              <View style={styles.recentHeader}>
                <Text style={[styles.recentTitle, { color: colors.text }]}>
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={async () => {
                  try {
                    const token = await AsyncStorage.getItem('userToken');
                    await axios.delete(`${API_ROUTE}/search/recent/`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setRecentSearches([]);
                  } catch (error) {
                    console.error('Error clearing recent searches:', error);
                  }
                }}>
                  <Text style={[styles.clearText, { color: colors.primary }]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.recentItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setSearchQuery(item.query);
                    performSearch(item.query);
                  }}
                >
                  <Icon name="time-outline" size={20} color={colors.textSecondary} />
                  <Text style={[styles.recentItemText, { color: colors.text }]}>
                    {item.query}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Trending */}
          {trendingData && (
            <View style={styles.trendingContainer}>
              <Text style={[styles.trendingTitle, { color: colors.text }]}>
                Trending Now
              </Text>
              
              {trendingData.trending_hashtags && trendingData.trending_hashtags.length > 0 && (
                <View style={styles.trendingSection}>
                  <Text style={[styles.trendingSubtitle, { color: colors.textSecondary }]}>
                    Trending Hashtags
                  </Text>
                  <View style={styles.hashtagContainer}>
                    {trendingData.trending_hashtags.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.hashtagChip, { backgroundColor: colors.backgroundSecondary }]}
                        onPress={() => {
                          setSearchQuery(tag.name);
                          performSearch(tag.name);
                        }}
                      >
                        <Text style={[styles.hashtagChipText, { color: colors.primary }]}>
                          #{tag.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {trendingData.trending_users && trendingData.trending_users.length > 0 && (
                <View style={styles.trendingSection}>
                  <Text style={[styles.trendingSubtitle, { color: colors.textSecondary }]}>
                    Popular Creators
                  </Text>
                  {trendingData.trending_users.map((user, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.trendingUserItem, { borderBottomColor: colors.border }]}
                      onPress={() => navigation.navigate('OtherUserProfile', { userId: user.id })}
                    >
                      <Image
                        source={`${API_ROUTE_IMAGE}${user.profile_picture}` ? { uri: `${API_ROUTE_IMAGE}${user.profile_picture}` } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
                        style={styles.trendingUserAvatar}
                      />
                      <View style={styles.trendingUserInfo}>
                        <Text style={[styles.trendingUserName, { color: colors.text }]}>
                          {user.name}
                        </Text>
                        <Text style={[styles.trendingUserUsername, { color: colors.textSecondary }]}>
                          @{user.username}
                        </Text>
                      </View>
                      <Text style={[styles.trendingUserFollowers, { color: colors.textSecondary }]}>
                        {user.follower_count} followers
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 8,
  },
  tabsContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  suggestionsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  suggestionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  suggestionSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  resultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  resultUsername: {
    fontSize: 14,
    marginTop: 2,
  },
  resultBio: {
    fontSize: 13,
    marginTop: 2,
  },
  resultIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultPrice: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  resultLocation: {
    fontSize: 13,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  mediaResultItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  mediaResultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  mediaResultPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaResultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mediaResultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  mediaResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  mediaResultUser: {
    fontSize: 13,
    marginRight: 12,
  },
  mediaResultStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaResultStatText: {
    fontSize: 13,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  defaultContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recentContainer: {
    marginTop: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recentItemText: {
    fontSize: 15,
    marginLeft: 12,
  },
  trendingContainer: {
    marginTop: 16,
    marginBottom: 40,
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  trendingSection: {
    marginBottom: 20,
  },
  trendingSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trendingUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  trendingUserAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  trendingUserInfo: {
    flex: 1,
  },
  trendingUserName: {
    fontSize: 15,
    fontWeight: '600',
  },
  trendingUserUsername: {
    fontSize: 13,
  },
  trendingUserFollowers: {
    fontSize: 13,
  },
});

export default SearchScreen;