
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';
import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
import colors from "../theme/colors";
import { useTheme } from '../src/context/ThemeContext'; 

const { width } = Dimensions.get('window');

export default function ListingDetails({ navigation, route }) {
  const { colors: themeColors, isDark } = useTheme(); 
  const { item } = route.params;
  const [listData, setListing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchUserData = async (sellerid) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/user/${sellerid}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigation.navigate('LoginScreen');
      }
    }
  };

  const fetchListing = async () => {
    if (!item) {
      Alert.alert('Error', 'No item found');
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/listing/${item}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.status === 200) {
        setListing(res.data);
        fetchUserData(res.data.seller);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch listing details');
      console.error('Error fetching listing:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [item]);

  const handleChatWithSeller = () => {
    if (!userData) {
      Alert.alert('Error', 'Seller information not available');
      return;
    }
    
    navigation.navigate('BPrivateChat', {
      receiverId: userData.id,
      name: userData.name,
      profile_image: userData.profile_picture,
      chatType: 'single',
    });
  };

  const handleCallSeller = () => {
    if (!userData?.phone) {
      Alert.alert('Contact Unavailable', 'Seller has not provided a contact number');
      return;
    }
    
    Linking.openURL(`tel:${userData.phone}`);
  };

  const openMaps = () => {
    if (!listData?.location) {
      Alert.alert('Location not available', 'Seller has not provided location details');
      return;
    }
    
    const locationQuery = encodeURIComponent(listData.location);
    const url = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open maps app');
      }
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement API call to add/remove from favorites
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (!listData) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
        <Icon name="sad-outline" size={60} color={themeColors.primary} />
        <Text style={[styles.errorTitle, { color: themeColors.text }]}>Oops!</Text>
        <Text style={[styles.errorText, { color: themeColors.textSecondary }]}>We couldn't load the listing details.</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getImageUrl = (imagePath) => {
    return imagePath ? `${API_ROUTE_IMAGE}${imagePath}` : null;
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageSlide}>
      <Image 
        source={{ uri: getImageUrl(item.image) }}
        style={styles.mainImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={themeColors.card} />
      
      
      <View style={[styles.header, { backgroundColor: themeColors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={28} color={themeColors.text} />
        </TouchableOpacity>
        
        
      </View>

      <ScrollView 
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
       
        <View style={styles.imageGallery}>
          <Image 
            source={{ uri: getImageUrl(listData.images[activeImageIndex]?.image) }}
            style={[styles.mainImage, { backgroundColor: themeColors.card }]}
            resizeMode="cover"
          />
          
         
          <View style={styles.imageIndicators}>
            {listData.images.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
                  index === activeImageIndex && [styles.activeIndicator, { backgroundColor: '#fff' }]
                ]}
              />
            ))}
          </View>
        </View>

        {listData.images.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={[styles.thumbnailScroll, { backgroundColor: themeColors.background }]}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {listData.images.map((img, index) => (
              <TouchableOpacity 
                key={img.id}
                onPress={() => setActiveImageIndex(index)}
                style={[
                  styles.thumbnail,
                  { borderColor: 'transparent' },
                  index === activeImageIndex && [styles.activeThumbnail, { borderColor: themeColors.primary }]
                ]}
              >
                <Image 
                  source={{ uri: getImageUrl(img.image) }}
                  style={[styles.thumbnailImage, { backgroundColor: themeColors.card }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

       
        <View style={[styles.productCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: themeColors.text }]}>₦{parseFloat(listData.price).toLocaleString()}</Text>
            <View style={[styles.categoryTag, { backgroundColor: isDark ? themeColors.backgroundSecondary : '#E8F4FD' }]}>
              <Text style={[styles.categoryText, { color: themeColors.primary }]}>For Sale</Text>
            </View>
          </View>
          
          <Text style={[styles.title, { color: themeColors.text }]}>{listData.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="time-outline" size={18} color={themeColors.textSecondary} />
                <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                  {new Date(listData.created).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
              
              {listData.location && (
                <View style={styles.metaItem}>
                  <Icon name="location-outline" size={18} color={themeColors.textSecondary} />
                  <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>{listData.location}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

      
        <View style={[styles.sectionCard, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Description</Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>{listData.description}</Text>
          
          {listData.description.includes('\n') && (
            <>
              <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Key Features</Text>
              {listData.description.split('\n').filter(f => f.trim()).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={18} color={themeColors.success || '#4CAF50'} />
                  <Text style={[styles.featureText, { color: themeColors.textSecondary }]}>{feature.trim()}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Seller Info Card =====================*/}
        {userData && (
          <View style={[styles.sellerCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Seller Information</Text>
            
            <View style={styles.sellerProfile}>
              <Image
                source={
                  userData.profile_picture 
                    ? { uri: getImageUrl(userData.profile_picture) }
                    : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                }
                style={[styles.profileImage, { backgroundColor: themeColors.backgroundSecondary }]}
              />
              
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={[styles.sellerName, { color: themeColors.text }]}>{userData.name || 'Seller'}</Text>
                  {userData.is_verified && (
                    <Icon name="checkmark-circle" size={20} color={themeColors.success || '#4CAF50'} />
                  )}
                </View>

                {/* <View style={styles.verificationBadge}>
                  <Icon 
                    name={userData.is_verified ? "shield-checkmark" : "shield-outline"} 
                    size={16} 
                    color={userData.is_verified ? (themeColors.success || '#4CAF50') : themeColors.textSecondary} 
                  />
                  <Text style={[styles.verificationText, { color: themeColors.textSecondary }]}>
                    {userData.is_verified ? 'Verified Seller' : 'Not Verified'}
                  </Text>
                </View> */}
                 {userData.bio && (
                    <Text style={[styles.sellerRating, { color: themeColors.textSecondary }]}>
                    <Text>{userData.bio ? userData.bio.slice(0, 150) + '...' : ''}</Text></Text>
                  )}

              </View>
            </View>

           
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={[styles.contactButton, { backgroundColor: themeColors.primary }]}
                onPress={handleCallSeller}
              >
                <Icon name="call-outline" size={20} color="#fff" />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.contactButton, styles.messageButton, { backgroundColor: themeColors.success || '#4CAF50' }]}
                onPress={handleChatWithSeller}
              >
                <Icon name="chatbubble-outline" size={20} color="#fff" />
                <Text style={styles.contactButtonText}>Message</Text>
              </TouchableOpacity>
            </View>

           
            {listData.location && (
              <View style={[styles.locationSection, { backgroundColor: themeColors.backgroundSecondary }]}>
                <View style={styles.locationHeader}>
                  <Icon name="location" size={22} color={themeColors.primary} />
                  <Text style={[styles.locationTitle, { color: themeColors.text }]}>Item Location</Text>
                </View>
                <Text style={[styles.locationText, { color: themeColors.textSecondary }]}>{listData.location}</Text>
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={openMaps}
                >
                  <Icon name="map-outline" size={18} color={themeColors.primary} />
                  <Text style={[styles.mapButtonText, { color: themeColors.primary }]}>View on Map</Text>
                </TouchableOpacity>
              </View>


            )}
             <TouchableOpacity 
                style={[styles.actionButton, { 
                  backgroundColor: themeColors.primary,
                  shadowColor: isDark ? themeColors.primary : '#000',
                  shadowOpacity: isDark ? 0.3 : 0.2, marginTop:20
                }]}
                onPress={handleChatWithSeller}
              >
                <Icon name="chatbubble-ellipses" size={22} color="#fff" />
                <Text style={styles.actionButtonText}>I'm Interested</Text>
              </TouchableOpacity>
            
          </View>

        )}
      </ScrollView>

      {/* <View style={[styles.actionBar, { 
        backgroundColor: themeColors.card,
        borderTopColor: themeColors.border 
      }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: themeColors.primary,
            shadowColor: isDark ? themeColors.primary : '#000',
            shadowOpacity: isDark ? 0.3 : 0.2,
          }]}
          onPress={handleChatWithSeller}
        >
          <Icon name="chatbubble-ellipses" size={22} color="#fff" />
          <Text style={styles.actionButtonText}>I'm Interested</Text>
        </TouchableOpacity>
      </View> */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
   
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
   
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
   
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
   
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
   
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
   
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  favoriteHeaderButton: {
    padding: 8,
  },
  imageGallery: {
    position: 'relative',
    height: width * 0.8,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    
    marginHorizontal: 4,
  },
  activeIndicator: {
   
    width: 24,
  },
  thumbnailScroll: {
    marginTop: 12,
   
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    overflow: 'hidden',
  },
  activeThumbnail: {
  
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
   
  },
  productCard: {
    padding: 20,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
   
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    marginBottom: 16,
  },
  metaContainer: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 15,
   
  },
  sectionCard: {
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 22,

    flex: 1,
  },
  sellerCard: {
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  sellerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  sellerRating: {
    fontSize: 14,
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verificationText: {
    fontSize: 14,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactButton: {
    flex: 1,
   
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  messageButton: {
    
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationSection: {
    
    padding: 16,
    borderRadius: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
  
  },
  locationText: {
    fontSize: 15,
   
    marginBottom: 12,
    lineHeight: 22,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: '600',
    
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
   
    padding: 16,
    borderTopWidth: 1,
   
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  actionButton: {
   
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});