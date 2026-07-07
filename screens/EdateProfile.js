// src/screens/AllProfilesScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
  TextInput,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const GRID_GAP = 12;
const NUM_COLUMNS = 3;
const CARD_SIZE = (width - (GRID_GAP * (NUM_COLUMNS + 1))) / NUM_COLUMNS;
const CARD_IMAGE_HEIGHT = CARD_SIZE * 1.15;

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL = 'https://api.edate.ng/api';

const fetchAllProfiles = async (params = {}) => {
  try {
    const {
      category = 'all',
      limit = 50,
      offset = 0,
      gender = 'all',
      minAge = 18,
      maxAge = 99,
    } = params;

    const queryParams = new URLSearchParams({
      category,
      limit: limit.toString(),
      offset: offset.toString(),
      gender,
      min_age: minAge.toString(),
      max_age: maxAge.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/discover/global/?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching profiles:', error.message);
    throw error;
  }
};

// ============================================
// CATEGORY CONFIGURATION
// ============================================

const CATEGORY_CONFIG = {
  sugar: {
    label: 'Sugar',
    icon: '🍯',
    color: '#FFD700',
    bgColor: '#FFF8E1',
  },
  edate: {
    label: 'E-Date',
    icon: '💕',
    color: '#FF6B6B',
    bgColor: '#FFEBEE',
  },
  marriage: {
    label: 'Marriage',
    icon: '💍',
    color: '#FF69B4',
    bgColor: '#FCE4EC',
  },
  night_stand: {
    label: 'Night Stand',
    icon: '🌙',
    color: '#6C5CE7',
    bgColor: '#F3E5F5',
  },
  companion: {
    label: 'Companion',
    icon: '🤝',
    color: '#00B894',
    bgColor: '#E8F5E9',
  },
  cohabitation: {
    label: 'Cohabitation',
    icon: '🏠',
    color: '#0984E3',
    bgColor: '#E3F2FD',
  },
};

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'sugar', label: 'Sugar', icon: '🍯' },
  { id: 'edate', label: 'E-Date', icon: '💕' },
  { id: 'marriage', label: 'Marriage', icon: '💍' },
  { id: 'night_stand', label: 'Night', icon: '🌙' },
  { id: 'companion', label: 'Companion', icon: '🤝' },
  { id: 'cohabitation', label: 'Cohab', icon: '🏠' },
];

// ============================================
// ALL PROFILES SCREEN
// ============================================

const AllProfilesScreen = ({ navigation }) => {
  // State
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filterGender, setFilterGender] = useState('all');
  const [filterMinAge, setFilterMinAge] = useState('18');
  const [filterMaxAge, setFilterMaxAge] = useState('99');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Modal
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // ============================================
  // FETCH PROFILES
  // ============================================

  const fetchProfiles = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
        setError(null);
      }

      const currentOffset = reset ? 0 : offset;
      
      const data = await fetchAllProfiles({
        category: selectedCategory,
        offset: currentOffset,
        limit: 30,
        gender: filterGender,
        minAge: parseInt(filterMinAge) || 18,
        maxAge: parseInt(filterMaxAge) || 99,
      });

      if (data.success) {
        const newResults = data.results || [];
        
        if (reset) {
          setProfiles(newResults);
        } else {
          setProfiles(prev => [...prev, ...newResults]);
        }
        
        setTotalCount(data.total_count || 0);
        setHasMore(data.pagination?.has_more || false);
        setOffset(currentOffset + newResults.length);
        setError(null);
      } else {
        setError(data.error || 'Failed to load profiles');
        if (reset) setProfiles([]);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError(error.message || 'Network error. Please check your connection.');
      if (reset) setProfiles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfiles(true);
  }, [selectedCategory, filterGender, filterMinAge, filterMaxAge]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfiles(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !error) {
      fetchProfiles(false);
    }
  };

  const handleRetry = () => {
    fetchProfiles(true);
  };

  // ============================================
  // OPEN PLAY STORE
  // ============================================

  const openAppStore = () => {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.edate.app';
    Linking.openURL(playStoreUrl).catch(() => {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.edate.app');
    });
  };

  // ============================================
  // RENDER GRID CARD
  // ============================================

  const renderGridCard = ({ item }) => {
    const config = CATEGORY_CONFIG[item.type] || CATEGORY_CONFIG.edate;
    const displayName = item.full_name || item.nick_name || item.username || 'User';
    const imageUrl = item.profile_image;
    const isSugar = item.type === 'sugar';

    return (
      <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: config.bgColor }]}
        onPress={() => {
          setSelectedProfile(item);
          setShowDetail(true);
        }}
        activeOpacity={0.85}
      >
        <View style={styles.gridImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.gridImage} resizeMode="cover" />
          ) : (
            <View style={[styles.gridPlaceholder, { backgroundColor: config.color + '20' }]}>
              <Text style={styles.gridPlaceholderText}>{config.icon}</Text>
            </View>
          )}
          
          {/* Category Badge */}
          <View style={[styles.gridBadge, { backgroundColor: config.color }]}>
            <Text style={styles.gridBadgeText}>{config.icon}</Text>
          </View>
          
          {/* Verified Badge */}
          {item.is_verified && (
            <View style={styles.gridVerified}>
              <Icon name="checkmark-circle" size={14} color="#4CAF50" />
            </View>
          )}
        </View>

        <View style={styles.gridContent}>
          <Text style={styles.gridName} numberOfLines={1}>{displayName}</Text>
          <View style={styles.gridDetails}>
            {item.age && (
              <Text style={styles.gridAge}>{item.age}</Text>
            )}
            {item.country && (
              <Text style={styles.gridCountry} numberOfLines={1}>
                {item.country}
              </Text>
            )}
          </View>
          {isSugar && item.role_display && (
            <View style={[styles.gridRoleBadge, { backgroundColor: config.color + '20' }]}>
              <Text style={[styles.gridRoleText, { color: config.color }]}>{item.role_display}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ============================================
  // RENDER HEADER
  // ============================================

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search profiles..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        <TouchableOpacity 
          style={styles.filterIconBtn}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="options-outline" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilterContainer}
      >
        {CATEGORY_OPTIONS.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryFilterBtn,
              selectedCategory === cat.id && styles.categoryFilterBtnActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.categoryFilterIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.categoryFilterLabel,
                selectedCategory === cat.id && styles.categoryFilterLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {totalCount > 0 ? `${totalCount} profiles found` : 'Loading profiles...'}
        </Text>
      </View>
    </View>
  );

  // ============================================
  // RENDER EMPTY
  // ============================================

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        {error ? (
          <>
            <Icon name="alert-circle-outline" size={64} color="#FF6B6B" />
            <Text style={styles.emptyTitle}>Oops! Something went wrong</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Icon name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No profiles found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search</Text>
          </>
        )}
      </View>
    );
  };

  // ============================================
  // RENDER FOOTER
  // ============================================

  const renderFooter = () => {
    if (loading && profiles.length === 0) return null;
    if (!loading && !hasMore && profiles.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>You've seen all profiles</Text>
        </View>
      );
    }
    if (loading && profiles.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#FF3366" />
        </View>
      );
    }
    return null;
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  if (loading && profiles.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <ActivityIndicator size="large" color="#FF3366" />
        <Text style={styles.loadingText}>Loading profiles...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <FlatList
        data={profiles}
        renderItem={renderGridCard}
        keyExtractor={(item, index) => `${item.type}-${item.user_id || item.id}-${index}`}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF3366']}
            tintColor="#FF3366"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* ============ FILTER MODAL ============ */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Gender</Text>
                <View style={styles.filterOptions}>
                  {['all', 'male', 'female'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.filterChip,
                        filterGender === g && styles.filterChipActive,
                      ]}
                      onPress={() => setFilterGender(g)}
                    >
                      <Text style={[styles.filterChipText, filterGender === g && styles.filterChipTextActive]}>
                        {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Age Range</Text>
                <View style={styles.ageRow}>
                  <View style={styles.ageInputWrapper}>
                    <Text style={styles.ageLabel}>Min</Text>
                    <TextInput
                      style={styles.ageInput}
                      keyboardType="numeric"
                      value={filterMinAge}
                      onChangeText={setFilterMinAge}
                      maxLength={2}
                    />
                  </View>
                  <Text style={styles.ageSeparator}>to</Text>
                  <View style={styles.ageInputWrapper}>
                    <Text style={styles.ageLabel}>Max</Text>
                    <TextInput
                      style={styles.ageInput}
                      keyboardType="numeric"
                      value={filterMaxAge}
                      onChangeText={setFilterMaxAge}
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  setShowFilters(false);
                  fetchProfiles(true);
                }}
              >
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setFilterGender('all');
                  setFilterMinAge('18');
                  setFilterMaxAge('99');
                  setShowFilters(false);
                  fetchProfiles(true);
                }}
              >
                <Text style={styles.resetBtnText}>Reset All</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============ PROFILE DETAIL MODAL ============ */}
      <Modal
        visible={showDetail}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowDetail(false)}
      >
        <SafeAreaView style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setShowDetail(false)} style={styles.detailBack}>
              <Icon name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle}>Profile</Text>
            <TouchableOpacity style={styles.detailMore}>
              <Icon name="ellipsis-vertical" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {selectedProfile && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailImageContainer}>
                {selectedProfile.profile_image ? (
                  <Image source={{ uri: selectedProfile.profile_image }} style={styles.detailImage} resizeMode="cover" />
                ) : (
                  <View style={styles.detailPlaceholder}>
                    <Text style={styles.detailPlaceholderText}>👤</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailInfo}>
                <View style={styles.detailNameRow}>
                  <Text style={styles.detailName}>
                    {selectedProfile.full_name || selectedProfile.nick_name || selectedProfile.username || 'User'}
                  </Text>
                  {selectedProfile.age && <Text style={styles.detailAge}>• {selectedProfile.age}</Text>}
                </View>

                <View style={styles.detailDetails}>
                  {selectedProfile.gender && (
                    <View style={styles.detailDetail}>
                      <Icon name="person-outline" size={16} color="#999" />
                      <Text style={styles.detailDetailText}>{selectedProfile.gender}</Text>
                    </View>
                  )}
                  {selectedProfile.country && (
                    <View style={styles.detailDetail}>
                      <Icon name="location-outline" size={16} color="#999" />
                      <Text style={styles.detailDetailText}>{selectedProfile.country}</Text>
                    </View>
                  )}
                  {selectedProfile.role_display && (
                    <View style={styles.detailDetail}>
                      <Icon name="ribbon-outline" size={16} color="#999" />
                      <Text style={styles.detailDetailText}>{selectedProfile.role_display}</Text>
                    </View>
                  )}
                </View>
              </View>

              {selectedProfile.bio && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>About</Text>
                  <Text style={styles.detailSectionText}>{selectedProfile.bio}</Text>
                </View>
              )}

              {selectedProfile.expectations && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Looking For</Text>
                  <Text style={styles.detailSectionText}>{selectedProfile.expectations}</Text>
                </View>
              )}

              {selectedProfile.interests && selectedProfile.interests.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Interests</Text>
                  <View style={styles.detailInterests}>
                    {selectedProfile.interests.map((interest, idx) => (
                      <View key={idx} style={styles.detailInterestChip}>
                        <Text style={styles.detailInterestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.detailActions}>
                <TouchableOpacity style={styles.detailConnectBtn} onPress={openAppStore}>
                  <Icon name="heart-outline" size={20} color="#FFF" />
                  <Text style={styles.detailConnectText}>Connect on E-Date</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailActionRow}>
                <TouchableOpacity style={styles.detailMessageBtn}>
                  <Icon name="chatbubble-outline" size={20} color="#FFF" />
                  <Text style={styles.detailBtnText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailCallBtn}>
                  <Icon name="call-outline" size={20} color="#FFF" />
                  <Text style={styles.detailBtnText}>Call</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  // Header
  headerContainer: {
    backgroundColor: '#FFF',
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#1A1A1A',
  },
  filterIconBtn: {
    padding: 6,
  },
  categoryFilterContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  categoryFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryFilterBtnActive: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
  },
  categoryFilterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryFilterLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryFilterLabelActive: {
    color: '#FFF',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  statsText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },

  // List
  listContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: GRID_GAP,
  },

  // Grid Card
  gridCard: {
    width: CARD_SIZE,
    marginBottom: GRID_GAP,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  gridImageContainer: {
    position: 'relative',
    height: CARD_IMAGE_HEIGHT,
    backgroundColor: '#F5F7FA',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridPlaceholderText: {
    fontSize: 28,
  },
  gridBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBadgeText: {
    fontSize: 12,
  },
  gridVerified: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 2,
  },
  gridContent: {
    padding: 8,
    paddingBottom: 10,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  gridDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  gridAge: {
    fontSize: 11,
    color: '#888',
  },
  gridCountry: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  gridRoleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  gridRoleText: {
    fontSize: 8,
    fontWeight: '600',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#FF3366',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  // Footer
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  footerEnd: {
    padding: 20,
    alignItems: 'center',
  },
  footerEndText: {
    fontSize: 13,
    color: '#999',
  },

  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: '#FF3366',
  },
  filterChipText: {
    fontSize: 13,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  ageLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 6,
  },
  ageInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    padding: 0,
  },
  ageSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  applyBtn: {
    backgroundColor: '#FF3366',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  resetBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  resetBtnText: {
    fontSize: 14,
    color: '#666',
  },

  // Detail Modal
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  detailBack: {
    padding: 4,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailMore: {
    padding: 4,
  },
  detailImageContainer: {
    height: height * 0.4,
    backgroundColor: '#F5F7FA',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  detailPlaceholderText: {
    fontSize: 56,
  },
  detailInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  detailAge: {
    fontSize: 18,
    color: '#666',
    marginLeft: 6,
  },
  detailDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 4,
  },
  detailDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 3,
  },
  detailSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  detailSectionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  detailInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detailInterestChip: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  detailInterestText: {
    fontSize: 13,
    color: '#444',
  },
  detailActions: {
    padding: 16,
    paddingBottom: 8,
  },
  detailConnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3366',
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  detailConnectText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10,
  },
  detailActionRow: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  detailMessageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3366',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 6,
  },
  detailCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 6,
  },
  detailBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
});

export default AllProfilesScreen;