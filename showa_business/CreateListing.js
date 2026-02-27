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
  SafeAreaView,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Colors from '../theme/colors';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateListingScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

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
      
      // Handle the response structure
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

    if (parseFloat(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('price', parseFloat(price).toFixed(2));
    formData.append('description', description.trim());
    formData.append('location', location.trim());
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

            {/* Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.locationContainer}>
                <Icon name="map-pin" size={20} color="#999" style={styles.locationIcon} />
                <TextInput
                  style={[styles.input, styles.locationInput]}
                  placeholder="City, State or Address"
                  placeholderTextColor="#999"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
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
                (!title || !price || !description || images.length === 0 || !selectedCategory) && 
                styles.createButtonDisabled
              ]}
              onPress={uploadListing}
              disabled={loading || !title || !price || !description || images.length === 0 || !selectedCategory}
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
});