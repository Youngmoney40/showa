import React, { useEffect, useState } from 'react';
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
  SafeAreaView,
  TextInput
} from 'react-native';
import axios from 'axios';
import Colors from '../theme/colors';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; 

export default function HomeScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchContainerWidth, setSearchContainerWidth] = useState('85%');

  useEffect(() => {
    axios.get(`${API_ROUTE}/listings/`)
      .then(res => setListings(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setSearchContainerWidth('100%');
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    setSearchContainerWidth('85%');
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
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
        <View style={styles.favoriteButton}>
          <Icon name="favorite-border" size={20} color="#fff" />
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardPrice}>₦{item.price.toLocaleString()}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={14} color="#888" />
            <Text style={styles.cardLocation}>{item.location || 'Lagos'}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={[styles.searchContainer, { width: searchContainerWidth }]}>
            <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor="#888"
              style={styles.searchInput}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {!searchFocused && (
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={() => navigation.navigate('CreateListing')}
              >
                <Icon name="photo-camera" size={20} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('CreateListing')}
          >
            <Icon name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* All Products Grid */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loading} />
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    color: '#333',
  },
  cameraButton: {
    padding: 8,
  },
  notificationButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: CARD_WIDTH,
    shadowColor: '#000',
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    color: '#333',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
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
    color: '#888',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 2,
    fontWeight: '500',
  },
  loading: {
    marginVertical: 40,
  },
});