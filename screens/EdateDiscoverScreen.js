
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
  ScrollView,
  Dimensions,
  StatusBar,
  Modal,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.35;
const CARD_HEIGHT = CARD_WIDTH * 1.10;

// ============================================
// API CONFIGURATION - NO AUTH REQUIRED
// ============================================

const API_BASE_URL = 'https://api.edate.ng/api';

const fetchProfilesByCategory = async (category, limit = 10) => {
  try {
    const params = new URLSearchParams({
      category: category,
      offset: '0',
      limit: limit.toString(),
      gender: 'all',
      min_age: '18',
      max_age: '99',
    });

    const response = await fetch(`${API_BASE_URL}/discover/global/?${params.toString()}`, {
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
    
    return data.results || [];
  } catch (error) {
    //console.error(`❌ Error fetching ${category}:`, error.message);
    return [];
  }
};

// ============================================
// CATEGORY CONFIGURATION
// ============================================

const CATEGORY_CONFIG = {
  sugar: {
    label: 'Explore Sugar Daddy & Mummy',
    icon: '🍯',
    color: '#FFD700',
    subtitle: 'Find your perfect match',
  },
  edate: {
    label: 'Find Love & Romance',
    icon: '💕',
    color: '#FF6B6B',
    subtitle: 'Virtual dating & romance',
  },
  night_stand: {
    label: 'One Night Stand',
    icon: '🌙',
    color: '#6C5CE7',
    subtitle: 'Casual encounters',
  },
};

// ============================================
// SOCIAL FEED COMPONENT
// ============================================

const SocialFeedScreen = ({ navigation }) => {
  // State for each category
  const [sugarProfiles, setSugarProfiles] = useState([]);
  const [edateProfiles, setEdateProfiles] = useState([]);
  const [nightStandProfiles, setNightStandProfiles] = useState([]);
  const [nearbyProfiles, setNearbyProfiles] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Carousel indices
  const [sugarIndex, setSugarIndex] = useState(0);
  const [edateIndex, setEdateIndex] = useState(0);
  const [nightStandIndex, setNightStandIndex] = useState(0);
  const [nearbyIndex, setNearbyIndex] = useState(0);
  
  // FlatList refs for manual scrolling
  const sugarListRef = useRef(null);
  const edateListRef = useRef(null);
  const nightStandListRef = useRef(null);
  const nearbyListRef = useRef(null);
  
  // Detail Modal
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  // ============================================
  // FETCH ALL CATEGORIES
  // ============================================

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sugar, edate, nightStand, nearby] = await Promise.all([
        fetchProfilesByCategory('sugar', 10),
        fetchProfilesByCategory('edate', 10),
        fetchProfilesByCategory('night_stand', 10),
        fetchProfilesByCategory('all', 10),
      ]);

      setSugarProfiles(sugar);
      setEdateProfiles(edate);
      setNightStandProfiles(nightStand);
      setNearbyProfiles(nearby);

      setSugarIndex(0);
      setEdateIndex(0);
      setNightStandIndex(0);
      setNearbyIndex(0);

    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      setError('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllCategories();
  };

  // ============================================
  // OPEN PLAY STORE / APP STORE
  // ============================================

  const openAppStore = () => {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.edate';
    const appStoreUrl = 'https://apps.apple.com/app/edate/id123456789';
    
    // Check platform and open appropriate store
    Linking.canOpenURL(playStoreUrl).then(supported => {
      if (supported) {
        Linking.openURL(playStoreUrl);
      } else {
        Linking.openURL(appStoreUrl);
      }
    }).catch(() => {
      // Fallback - open play store
      Linking.openURL(playStoreUrl);
    });
  };

  // ============================================
  // AUTO-SLIDE LOGIC
  // ============================================

  useEffect(() => {
    const intervals = [];

    const setupAutoSlide = (listRef, profiles, setIndex, index) => {
      if (profiles.length > 2) {
        const interval = setInterval(() => {
          const nextIndex = (index + 1) % profiles.length;
          setIndex(nextIndex);
          if (listRef.current) {
            listRef.current.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
          }
        }, 4000);
        return interval;
      }
      return null;
    };

    const sugarInterval = setupAutoSlide(sugarListRef, sugarProfiles, setSugarIndex, sugarIndex);
    const edateInterval = setupAutoSlide(edateListRef, edateProfiles, setEdateIndex, edateIndex);
    const nightStandInterval = setupAutoSlide(nightStandListRef, nightStandProfiles, setNightStandIndex, nightStandIndex);
    const nearbyInterval = setupAutoSlide(nearbyListRef, nearbyProfiles, setNearbyIndex, nearbyIndex);

    if (sugarInterval) intervals.push(sugarInterval);
    if (edateInterval) intervals.push(edateInterval);
    if (nightStandInterval) intervals.push(nightStandInterval);
    if (nearbyInterval) intervals.push(nearbyInterval);

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [sugarProfiles, edateProfiles, nightStandProfiles, nearbyProfiles]);

  // ============================================
  // RENDER PROFILE CARD (NO OVERLAY)
  // ============================================

  const renderProfileCard = ({ item, index }) => {
    const config = CATEGORY_CONFIG[item.type] || CATEGORY_CONFIG.edate;
    const displayName = item.full_name || item.nick_name || item.username || 'User';
    const imageUrl = item.profile_image;

    return (
      <TouchableOpacity
        style={[styles.card]}
        onPress={() => {
          setSelectedProfile(item);
          setShowDetail(true);
        }}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
          ) : (
            <View style={[styles.cardPlaceholder, { backgroundColor: config.color + '20' }]}>
              <Text style={styles.cardPlaceholderText}>{config.icon}</Text>
            </View>
          )}
          
          {/* Card content directly on image - NO OVERLAY */}
          <View style={styles.cardContent}>
            
            <Text style={styles.cardName} numberOfLines={1}>{displayName}</Text>
            <View style={styles.cardDetails}>
              {item.age && (
                <View style={styles.cardDetail}>
                  <Icon name="calendar-outline" size={11} color="#FFF" />
                  <Text style={styles.cardDetailText}>{item.age}</Text>
                </View>
              )}
              {item.country && (
  <View style={styles.cardDetail}>
    <Icon name="location-outline" size={11} color="#FFF" />
    <Text style={styles.cardDetailText} numberOfLines={1} ellipsizeMode="tail">
      {item.country.length > 7 ? item.country.substring(0, 7) + '...' : item.country}
    </Text>
  </View>
)}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ============================================
  // RENDER DOT INDICATORS
  // ============================================

  const renderDots = (total, currentIndex) => {
    if (total <= 1) return null;
    
    const maxDots = Math.min(total, 6);
    
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: maxDots }).map((_, index) => {
          const isActive = index === currentIndex % maxDots;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive && styles.dotActive,
              ]}
            />
          );
        })}
      </View>
    );
  };

  // ============================================
  // HANDLE SCROLL END
  // ============================================

  const handleScrollEnd = (event, setIndex, profiles) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (CARD_WIDTH + 16));
    setIndex(Math.min(index, profiles.length - 1));
  };

  // ============================================
  // RENDER CATEGORY SECTION
  // ============================================

  const renderCategorySection = (type, profiles, currentIndex, setIndex, listRef) => {
    const config = CATEGORY_CONFIG[type];
    
    if (!profiles || profiles.length === 0) {
      return (
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{config.icon} {config.label}</Text>
            <Text style={styles.categorySubtitle}>{config.subtitle}</Text>
          </View>
          <View style={styles.emptyCategory}>
            <Text style={styles.emptyCategoryText}>No profiles available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.categorySection}>
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <View>
            <Text style={styles.categoryTitle}> {config.label}</Text>
            <Text style={styles.categorySubtitle}>{config.subtitle}</Text>
          </View>


          {/* <TouchableOpacity onPress={()=>navigation.navigate('EdateProfile')} style={styles.viewAllBtn}> */}
          {/* <TouchableOpacity 
  onPress={() => navigation.navigate('EdateProfile', { category: type })} 
  style={styles.viewAllBtn}
>
            <Text style={styles.viewAllText}>See All →</Text>
          </TouchableOpacity> */}

          
        </View>

        {/* Horizontal Carousel - 2 cards per view */}
        <FlatList
          ref={listRef}
          data={profiles}
          renderItem={renderProfileCard}
          keyExtractor={(item, index) => `${type}-${item.user_id || item.id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          snapToInterval={CARD_WIDTH + 25}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => handleScrollEnd(event, setIndex, profiles)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          getItemLayout={(data, index) => ({
            length: CARD_WIDTH + 22,
            offset: (CARD_WIDTH + 22) * index,
            index,
          })}
          initialScrollIndex={0}
        />

       
        
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF3366']}
            tintColor="#FF3366"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* E-Date Row */}
        {renderCategorySection('edate', edateProfiles, edateIndex, setEdateIndex, edateListRef)}
        {/* Sugar Dating Row */}
        {renderCategorySection('sugar', sugarProfiles, sugarIndex, setSugarIndex, sugarListRef)}

        

        {/* Night Stand Row */}
        {renderCategorySection('night_stand', nightStandProfiles, nightStandIndex, setNightStandIndex, nightStandListRef)}
      </ScrollView>

      {/* ============ PROFILE DETAIL MODAL ============ */}
      <Modal
        visible={showDetail}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowDetail(false)}
      >
        <SafeAreaView style={styles.detailContainer}>
          {/* Detail Header */}
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setShowDetail(false)} style={styles.detailBack}>
              <Icon name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle}>Profile</Text>
            <TouchableOpacity style={styles.detailMore}>
              {/* <Icon name="ellipsis-vertical" size={24} color="#1A1A1A" /> */}
            </TouchableOpacity>
          </View>

          {selectedProfile && (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.detailScroll}>
              {/* Profile Image */}
              <View style={styles.detailImageContainer}>
                {selectedProfile.profile_image ? (
                  <Image source={{ uri: selectedProfile.profile_image }} style={styles.detailImage} resizeMode="cover" />
                ) : (
                  <View style={styles.detailPlaceholder}>
                    <Text style={styles.detailPlaceholderText}>👤</Text>
                  </View>
                )}
              </View>

              {/* Profile Info */}
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

              {/* Bio */}
              {selectedProfile.bio && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>About</Text>
                  <Text style={styles.detailSectionText}>{selectedProfile.bio}</Text>
                </View>
              )}

              {/* Expectations */}
              {selectedProfile.expectations && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Looking For</Text>
                  <Text style={styles.detailSectionText}>{selectedProfile.expectations}</Text>
                </View>
              )}

              {/* Interests */}
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

              {/* ============================================ */}
              {/* CONNECT ON E-DATE BUTTON - OPENS PLAY STORE */}
              {/* ============================================ */}
              <View style={styles.connectContainer}>
                <TouchableOpacity 
                  style={styles.connectBtn}
                  onPress={openAppStore}
                  activeOpacity={0.8}
                >
                  <Icon name="heart-outline" size={22} color="#FFF" />
                  <Text style={styles.connectBtnText}>Connect on E-Date</Text>
                  <Icon name="open-outline" size={18} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.connectSubtext}>
                  Download the app to connect with {selectedProfile.full_name || selectedProfile.username || 'this user'}
                </Text>
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
    backgroundColor: '#F5F5F5',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#4b494a',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  // Scroll Content
  scrollContent: {
    paddingBottom: 40,
  },

  // Category Section
  categorySection: {
    marginTop: 12,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  viewAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 13,
    color: '#0f0e0f',
    fontWeight: '500',
  },

  // Horizontal List
  horizontalList: {
    paddingHorizontal: 12,
  },

  // Card (2 per view) - NO OVERLAY
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    height: CARD_HEIGHT,
    backgroundColor: '#E8E8E8',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPlaceholderText: {
    fontSize: 32,
  },
  // NO OVERLAY - Content directly on image with text shadow
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cardType: {
    fontSize: 10,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  cardDetailText: {
    fontSize: 11,
    color: '#FFF',
    opacity: 0.9,
    marginLeft: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Dot Indicators
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FF3366',
    width: 18,
    borderRadius: 3,
  },

  // Empty
  emptyCategory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyCategoryText: {
    fontSize: 14,
    color: '#999',
  },

  // ============================================
  // DETAIL MODAL STYLES
  // ============================================

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
  detailScroll: {
    flex: 1,
  },
  detailImageContainer: {
    height: height * 0.4,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#F5F5F5',
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

  // ============================================
  // CONNECT ON E-DATE BUTTON
  // ============================================

  connectContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3366',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  connectBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 12,
  },
  connectSubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },

  // Action Buttons (fallback)
  detailActions: {
    flexDirection: 'row',
    padding: 16,
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

export default SocialFeedScreen;