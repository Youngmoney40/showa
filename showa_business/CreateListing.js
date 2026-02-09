// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'react-native-image-picker';
// import axios from 'axios';
// import Colors from '../theme/colors';
// import { API_ROUTE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function CreateListingScreen() {
//   const [title, setTitle] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const pickImages = () => {
//     ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
//       if (!response.didCancel && response.assets) {
//         setImages(response.assets);
//       }
//     });
//   };

//   const uploadListing = async () => {
//     if (!title || !price || !description || images.length === 0) {
//       Alert.alert('All fields are required.');
//       return;
//     }
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('price', price);
//     formData.append('description', description);

//     images.forEach((img, index) => {
//       formData.append('images', {
//         uri: img.uri,
//         type: img.type,
//         name: img.fileName || `image_${index}.jpg`,
//       });
//     });

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(`${API_ROUTE}/listings/create/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       Alert.alert('Listing uploaded successfully!');
//       setTitle('');
//       setPrice('');
//       setDescription('');
//       setImages([]);
//     } catch (err) {
//       //console.log(err);
//       Alert.alert('Failed to upload. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: Colors.primary }}>
//         Create New Listing
//       </Text>

//       <Text style={styles.label}>Title</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Product Title"
//         value={title}
//         placeholderTextColor='#555'
//         onChangeText={setTitle}
//       />

//       <Text style={styles.label}>Price</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Price"
//         value={price}
//         onChangeText={setPrice}
//         keyboardType="decimal-pad"
//          placeholderTextColor='#555'
//       />

//       <Text style={styles.label}>Description</Text>
//       <TextInput
//         style={[styles.input, { height: 100 }]} 
//         placeholder="Product Description"
//          placeholderTextColor='#555'
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />

//       <Text style={styles.label}>Product Images</Text>
//       <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
//         <Text style={{ color: '#fff', fontWeight: 'bold' }}>Select Images</Text>
//       </TouchableOpacity>

//       <ScrollView horizontal style={{ marginVertical: 10 }}>
//         {images.map((img, index) => (
//           <Image
//             key={index}
//             source={{ uri: img.uri }}
//             style={{ width: 100, height: 100, marginRight: 8, borderRadius: 8 }}
//           />
//         ))}
//       </ScrollView>

//       <TouchableOpacity
//         style={styles.uploadButton}
//         onPress={uploadListing}
//         disabled={loading}
//       >
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadText}>Upload Listing</Text>}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = {
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#555',
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//     color:'#555',
//     backgroundColor: '#fff',
//   },
//   imagePickerButton: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   uploadButton: {
//     backgroundColor: '#27ae60',
//     paddingVertical: 14,
//     borderRadius: 14,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   uploadText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// };

import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Colors from '../theme/colors';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function CreateListingScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

    if (parseFloat(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('price', parseFloat(price).toFixed(2));
    formData.append('description', description.trim());

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
              <Icon name="arrow-left" size={24} color={Colors.text} />
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
                  <Icon name="image" size={24} color={Colors.primary} />
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
                      <Icon name="plus" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.createButton,
                (!title || !price || !description || images.length === 0) && 
                styles.createButtonDisabled
              ]}
              onPress={uploadListing}
              disabled={loading || !title || !price || !description || images.length === 0}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background || '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40, // Ensures button has space
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
    color: Colors.text || '#333',
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
    color: Colors.text || '#333',
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
    color: Colors.text || '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text || '#333',
    marginRight: 12,
  },
  priceInput: {
    flex: 1,
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
});
