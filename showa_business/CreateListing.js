

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Colors from '../theme/colors';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
];

export default function CreateListingScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries based on search
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Fetching categories from:', `${API_ROUTE}/listing-categories/`);
      
      const response = await axios.get(`${API_ROUTE}/listing-categories/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Categories response:', response.data);
      
      
      if (response.data.success) {
        setCategories(response.data.categories);
      } else if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data.categories) {
        setCategories(response.data.categories);
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert(
        'Error',
        'Failed to load categories. Please try again.'
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const pickImages = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 5 - images.length,
      quality: 0.7,
      includeBase64: false,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets) {
        const newImages = [...images, ...response.assets].slice(0, 5);
        setImages(newImages);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadListing = async () => {
    if (!title.trim() || !price.trim() || !description.trim() || images.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all fields and add at least one image.');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category for your listing.');
      return;
    }

    if (!country) {
      Alert.alert('Missing Country', 'Please select your country.');
      return;
    }

    if (parseFloat(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('price', parseFloat(price).toFixed(2));
    formData.append('description', description.trim());
    
    // Combine city and country for full location
    const fullLocation = city.trim() ? `${city.trim()}, ${country.name}` : country.name;
    formData.append('location', fullLocation);
    formData.append('country', country.code);
    formData.append('city', city.trim());
    formData.append('category', selectedCategory.id);

    images.forEach((img, index) => {
      formData.append('images', {
        uri: Platform.OS === 'ios' ? img.uri.replace('file://', '') : img.uri,
        type: img.type || 'image/jpeg',
        name: `image_${Date.now()}_${index}.jpg`,
      });
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${API_ROUTE}/listings/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      Alert.alert(
        'Success!',
        'Your listing has been published successfully.',
        [
          {
            text: 'View Listings',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Create Another',
            onPress: () => {
              setTitle('');
              setPrice('');
              setDescription('');
              setCity('');
              setCountry(null);
              setLocation('');
              setSelectedCategory(null);
              setImages([]);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Could not publish your listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory?.id === item.id && styles.categoryItemSelected
      ]}
      onPress={() => {
        setSelectedCategory(item);
        setModalVisible(false);
      }}
    >
      <View style={styles.categoryItemContent}>
        {item.icon && (
          <Text style={styles.categoryIcon}>{item.icon}</Text>
        )}
        <Text style={[
          styles.categoryName,
          selectedCategory?.id === item.id && styles.categoryNameSelected
        ]}>
          {item.name}
        </Text>
      </View>
      {selectedCategory?.id === item.id && (
        <Icon name="check" size={20} color={Colors.primary || '#007AFF'} />
      )}
    </TouchableOpacity>
  );

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        country?.code === item.code && styles.countryItemSelected
      ]}
      onPress={() => {
        setCountry(item);
        setCountryModalVisible(false);
        setSearchQuery('');
      }}
    >
      <View style={styles.countryItemContent}>
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <Text style={[
          styles.countryName,
          country?.code === item.code && styles.countryNameSelected
        ]}>
          {item.name}
        </Text>
      </View>
      {country?.code === item.code && (
        <Icon name="check" size={20} color={Colors.primary || '#007AFF'} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color={Colors.text || '#333'} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Listing</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="What are you selling?"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Price */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[styles.input, styles.priceInput]}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setModalVisible(true)}
                disabled={loadingCategories}
              >
                {loadingCategories ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={Colors.primary || '#007AFF'} />
                    <Text style={styles.loadingText}>Loading categories...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={selectedCategory ? styles.categorySelectedText : styles.categoryPlaceholder}>
                      {selectedCategory ? selectedCategory.name : 'Select a category'}
                    </Text>
                    <Icon name="chevron-down" size={20} color="#999" />
                  </>
                )}
              </TouchableOpacity>
              
              {/* Show selected category info */}
              {selectedCategory && (
                <View style={styles.selectedCategoryInfo}>
                  {selectedCategory.icon && (
                    <Text style={styles.selectedCategoryIcon}>{selectedCategory.icon}</Text>
                  )}
                  <Text style={styles.selectedCategoryName}>
                    Selected: {selectedCategory.name}
                  </Text>
                </View>
              )}
            </View>

            {/* Country Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country</Text>
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={() => setCountryModalVisible(true)}
              >
                {country ? (
                  <View style={styles.countryDisplay}>
                    <Text style={styles.selectedCountryFlag}>{country.flag}</Text>
                    <Text style={styles.selectedCountryName}>{country.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.countryPlaceholder}>Select your country</Text>
                )}
                <Icon name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* City/Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City / Area</Text>
              <View style={styles.locationContainer}>
                <Icon2 name="location-city" size={20} color="#999" style={styles.locationIcon} />
                <TextInput
                  style={[styles.input, styles.locationInput]}
                  placeholder="Enter your city or area"
                  placeholderTextColor="#999"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>

            {/* Full Address (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Address (Optional)</Text>
              <View style={styles.locationContainer}>
                <Icon name="map-pin" size={20} color="#999" style={styles.locationIcon} />
                <TextInput
                  style={[styles.input, styles.locationInput]}
                  placeholder="Street address, building, etc."
                  placeholderTextColor="#999"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              {country && city && (
                <Text style={styles.locationPreview}>
                  📍 {location ? `${location}, ` : ''}{city}, {country.name}
                </Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your item..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Images */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Photos <Text style={styles.imageCount}>({images.length}/5)</Text>
              </Text>
              
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImages}
                disabled={images.length >= 5}
              >
                <View style={styles.imagePickerContent}>
                  <Icon name="image" size={24} color={Colors.primary || '#007AFF'} />
                  <Text style={styles.imagePickerText}>
                    {images.length === 0 ? 'Add Photos' : 'Add More Photos'}
                  </Text>
                  <Text style={styles.imagePickerSubtext}>
                    Tap to select from gallery
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Image Thumbnails */}
              {images.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScroll}
                  contentContainerStyle={styles.imageScrollContent}
                >
                  {images.map((img, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.imageThumbnail}
                      />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeImage(index)}
                      >
                        <Icon name="x" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {images.length < 5 && (
                    <TouchableOpacity
                      style={styles.addMoreButton}
                      onPress={pickImages}
                    >
                      <Icon name="plus" size={24} color={Colors.primary || '#007AFF'} />
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.createButton,
                (!title || !price || !description || images.length === 0 || !selectedCategory || !country) && 
                styles.createButtonDisabled
              ]}
              onPress={uploadListing}
              disabled={loading || !title || !price || !description || images.length === 0 || !selectedCategory || !country}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="upload" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.createButtonText}>Publish Listing</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Help Text */}
            <Text style={styles.helpText}>
              Make sure your photos are clear and your description is detailed for best results.
              Adding your location helps buyers find your items faster!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {loadingCategories ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={Colors.primary || '#007AFF'} />
                <Text style={styles.modalLoadingText}>Loading categories...</Text>
              </View>
            ) : categories.length > 0 ? (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCategoryItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="folder" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No categories available</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchCategories}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Country Selection Modal */}
      <Modal
        visible={countryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setCountryModalVisible(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => {
                setCountryModalVisible(false);
                setSearchQuery('');
              }}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="x" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={renderCountryItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.countryList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="search" size={50} color="#ccc" />
                  <Text style={styles.emptyText}>No countries found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  priceInput: {
    flex: 1,
  },
  categorySelector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginLeft: 10,
    color: '#999',
    fontSize: 14,
  },
  categoryPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  categorySelectedText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedCategoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  selectedCategoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedCategoryName: {
    color: Colors.primary || '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
  },
  locationIcon: {
    marginLeft: 16,
  },
  locationInput: {
    flex: 1,
    borderWidth: 0,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  imageCount: {
    color: Colors.primary || '#007AFF',
    fontWeight: '500',
  },
  imagePickerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerContent: {
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary || '#007AFF',
    marginTop: 8,
    marginBottom: 4,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: '#999',
  },
  imageScroll: {
    marginTop: 16,
  },
  imageScrollContent: {
    paddingRight: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff3b30',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addMoreButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  createButton: {
    backgroundColor: Colors.primary || '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary || '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalLoading: {
    padding: 40,
    alignItems: 'center',
  },
  modalLoadingText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },
  categoryList: {
    padding: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  categoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  categoryNameSelected: {
    color: Colors.primary || '#007AFF',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary || '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  countrySelector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  countryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCountryFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  selectedCountryName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  countryPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  locationPreview: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.primary || '#007AFF',
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    backgroundColor: '#f8f9fa',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  countryList: {
    padding: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  countryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  countryNameSelected: {
    color: Colors.primary || '#007AFF',
    fontWeight: '500',
  },
});
