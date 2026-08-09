import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
  Share,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://backend.ehangouts.com';

const HangoutPlaceDetail = ({ route, navigation }) => {
  // ============ THEME ============
  const { colors, isDark } = useTheme();

  const { place } = route.params;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);

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

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📍 ${place.name}\n${place.description?.replace(/<[^>]*>/g, '').substring(0, 100)}...\n🏠 ${place.location || 'Lagos, Nigeria'}\n\nCheck it out on Hangout Places!`,
        title: place.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenMaps = () => {
    const lat = parseFloat(place.latitude);
    const lng = parseFloat(place.longitude);
    let url;
    
    if (lat && lng) {
      url = Platform.select({
        ios: `maps:${lat},${lng}?q=${encodeURIComponent(place.name)}`,
        android: `geo:${lat},${lng}?q=${encodeURIComponent(place.name)}`,
      });
    } else {
      url = `https://maps.google.com/?q=${encodeURIComponent(place.location || place.name)}`;
    }
    
    Linking.openURL(url);
  };

  const renderOpeningHours = () => {
    if (!place.opening_hours || place.opening_hours.length === 0) {
      return <Text style={[styles.noDataText, { color: isDark ? '#888' : '#999' }]}>No opening hours available</Text>;
    }

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedHours = [...place.opening_hours].sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));

    return sortedHours.map((item) => (
      <View key={item.id} style={[styles.hourRow, { borderBottomColor: colors.border || '#eee' }]}>
        <Text style={[styles.hourDay, { color: colors.text || '#1a1a1a' }]}>{item.day}</Text>
        <Text style={[styles.hourTime, { color: isDark ? '#aaa' : '#666' }]}>
          {item.open_time} - {item.close_time}
        </Text>
      </View>
    ));
  };

  const renderWebsites = () => {
    const websites = [];
    if (place.website_link_1) websites.push(place.website_link_1);
    if (place.website_link_2) websites.push(place.website_link_2);
    
    if (websites.length === 0) {
      return <Text style={[styles.noDataText, { color: isDark ? '#888' : '#999' }]}>No websites available</Text>;
    }

    return websites.map((url, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.websiteButton, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}
        onPress={() => Linking.openURL(url)}
      >
        <Ionicons name="globe-outline" size={20} color="#0d64dd" />
        <Text style={styles.websiteText} numberOfLines={1}>
          {url.replace(/(^\w+:|^)\/\//, '')}
        </Text>
      </TouchableOpacity>
    ));
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

  // Get the first image or null
  const mainImage = place.images && place.images.length > 0 ? place.images[0] : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background || '#fff' }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "light-content"}
        translucent
        backgroundColor="transparent"
      />

      
      <View style={[styles.fixedHeader, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderBottomColor: isDark ? '#333' : '#eee', marginTop:25 }]}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#1a1a1a'} />
        </TouchableOpacity>
        <Text style={[styles.fixedHeaderTitle, { color: isDark ? '#fff' : '#1a1a1a' }]} numberOfLines={1}>
          {place.name}
        </Text>
        <TouchableOpacity
          style={styles.headerShareButton}
          //onPress={handleShare}
        >
          {/* <Ionicons name="share-outline" size={22} color={isDark ? '#fff' : '#1a1a1a'} /> */}
        </TouchableOpacity>
      </View>

      {/* Animated Header (transparent when scrolling) */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            backgroundColor: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', isDark ? '#1a1a1a' : '#fff'],
            }),
            borderBottomColor: isDark ? '#333' : '#eee',
            opacity: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.animatedBackButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Animated.Text
          style={[
            styles.animatedHeaderTitle,
            {
              opacity: headerOpacity,
              color: isDark ? '#fff' : '#1a1a1a',
            },
          ]}
          numberOfLines={1}
        >
          {place.name}
        </Animated.Text>
        <TouchableOpacity
          style={[styles.animatedShareButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Single Image */}
        <View style={[styles.imageContainer, { backgroundColor: isDark ? '#1a1a1a' : '#000' }]}>
          {mainImage ? (
            <Image
              source={{ uri: getImageUrl(mainImage.image) }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
              <Ionicons name="image-outline" size={60} color={isDark ? '#666' : '#ccc'} />
              <Text style={[styles.imagePlaceholderText, { color: isDark ? '#666' : '#999' }]}>
                No Image Available
              </Text>
            </View>
          )}
          
          {/* Category Badge */}
          <View style={[styles.detailCategoryBadge, { backgroundColor: getCategoryColor(place.category?.name) }]}>
            <Ionicons name={getCategoryIcon(place.category?.name)} size={16} color="#fff" />
            <Text style={styles.detailCategoryText}>{place.category?.name || 'General'}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title & Location */}
          <View style={styles.titleSection}>
            <Text style={[styles.placeName, { color: colors.text || '#1a1a1a' }]}>{place.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color="#0d64dd" />
              <Text style={[styles.locationTextDetail, { color: isDark ? '#aaa' : '#666' }]}>
                {place.location || 'Lagos, Nigeria'}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={20} color="#0d64dd" />
              <Text style={[styles.statText, { color: isDark ? '#ccc' : '#333' }]}>{place.view_count || 0} Views</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#ddd' }]} />
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={[styles.statText, { color: isDark ? '#ccc' : '#333' }]}>4.5 Rating</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#ddd' }]} />
            <TouchableOpacity style={styles.statItem} onPress={handleOpenMaps}>
              <Ionicons name="navigate-outline" size={20} color="#0d64dd" />
              <Text style={[styles.statText, { color: '#0d64dd' }]}>Directions</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          {place.description && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text || '#1a1a1a' }]}>About</Text>
              <Text style={[styles.descriptionText, { color: isDark ? '#ccc' : '#333' }]}>
                {isExpanded ? place.description.replace(/<[^>]*>/g, '') : 
                  place.description.replace(/<[^>]*>/g, '').substring(0, 150) + 
                  (place.description.length > 150 ? '...' : '')}
              </Text>
              {place.description.length > 150 && (
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                  <Text style={styles.readMoreText}>
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Highlight */}
          {place.highlight && (
            <View style={[styles.highlightSection, { backgroundColor: isDark ? '#1a1a1a' : '#f8f8f8' }]}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <View style={styles.highlightContent}>
                <Text style={[styles.highlightTitle, { color: colors.text || '#1a1a1a' }]}>Highlight</Text>
                <Text style={[styles.highlightText, { color: isDark ? '#ccc' : '#333' }]}>
                  {place.highlight}
                </Text>
              </View>
            </View>
          )}

          {/* Opening Hours */}
          {place.opening_hours && place.opening_hours.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text || '#1a1a1a' }]}>Opening Hours</Text>
              {renderOpeningHours()}
            </View>
          )}

          {/* Websites */}
          {(place.website_link_1 || place.website_link_2) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text || '#1a1a1a' }]}>Websites</Text>
              {renderWebsites()}
            </View>
          )}

          {/* Location Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text || '#1a1a1a' }]}>Location</Text>
            <TouchableOpacity style={[styles.locationCard, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]} onPress={handleOpenMaps}>
              <View style={styles.locationCardContent}>
                <Ionicons name="location-outline" size={24} color="#0d64dd" />
                <View style={styles.locationCardText}>
                  <Text style={[styles.locationCardTitle, { color: colors.text || '#1a1a1a' }]}>Get Directions</Text>
                  <Text style={[styles.locationCardAddress, { color: isDark ? '#aaa' : '#666' }]}>
                    {place.location || 'Lagos, Nigeria'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#0d64dd" />
            </TouchableOpacity>
          </View>

          {/* Best Times */}
          {place.best_times && (
            <View style={[styles.bestTimesSection, { backgroundColor: isDark ? '#1a1a1a' : '#f8f8f8' }]}>
              <Ionicons name="time-outline" size={24} color="#0d64dd" />
              <View style={styles.bestTimesContent}>
                <Text style={[styles.bestTimesTitle, { color: colors.text || '#1a1a1a' }]}>Best Time to Visit</Text>
                <Text style={[styles.bestTimesText, { color: isDark ? '#ccc' : '#333' }]}>
                  {place.best_times}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.bottomGradient}>
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={handleOpenMaps}
            >
              <Ionicons name="navigate" size={22} color="#fff" />
              <Text style={styles.directionsButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Fixed Header (always visible)
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerShareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  // Animated Header (transparent overlay)
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  animatedBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedShareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 100,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    marginTop: 12,
  },
  detailCategoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailCategoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  placeName: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextDetail: {
    fontSize: 15,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  statText: {
    fontSize: 14,
    marginLeft: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0d64dd',
    marginTop: 6,
  },
  highlightSection: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  highlightContent: {
    flex: 1,
    marginLeft: 12,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
  },
  hourDay: {
    fontSize: 14,
    fontWeight: '500',
  },
  hourTime: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  websiteText: {
    fontSize: 14,
    color: '#0d64dd',
    marginLeft: 10,
    flex: 1,
  },
  locationCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationCardText: {
    marginLeft: 12,
    flex: 1,
  },
  locationCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationCardAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  bestTimesSection: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  bestTimesContent: {
    flex: 1,
    marginLeft: 12,
  },
  bestTimesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bestTimesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomGradient: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d64dd',
    paddingVertical: 14,
    borderRadius: 12,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HangoutPlaceDetail;