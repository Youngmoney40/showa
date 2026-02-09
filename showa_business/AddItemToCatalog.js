// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Switch,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   KeyboardAvoidingView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {launchImageLibrary} from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api'; 

// export default function AddItemScreen({navigation}) {
//   const [hideItem, setHideItem] = useState(false);
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     name: '',
//     price: '',
//     sale_price: '',
//     description: '',
//     images: [],
//   });

//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handleImageUpload = () => {
//     launchImageLibrary(
//       { 
//         mediaType: 'photo', 
//         quality: 0.7,
//         maxWidth: 1200,
//         maxHeight: 1200,
//         selectionLimit: 1,
//         includeBase64: false,
//       },
//       (response) => {
//         if (response.assets && response.assets.length > 0) {
//           const selectedImage = response.assets[0];
//           const imageData = {
//             uri: selectedImage.uri,
//             type: selectedImage.type || 'image/jpeg',
//             name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
//           };
//           setForm({ ...form, images: [imageData] });
//           setImages([imageData]);
//         }
//       }
//     );
//   };

//   const handleCreateCatalog = async () => {
//     // Validation
//     if (!form.name.trim()) {
//       Alert.alert('Missing Field', 'Please enter item name');
//       return;
//     }
    
//     if (!form.price.trim() || isNaN(parseFloat(form.price))) {
//       Alert.alert('Invalid Price', 'Please enter a valid price');
//       return;
//     }

//     if (form.sale_price && (isNaN(parseFloat(form.sale_price)) || parseFloat(form.sale_price) <= 0)) {
//       Alert.alert('Invalid Sale Price', 'Please enter a valid sale price');
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append('name', form.name.trim());
//     formData.append('price', parseFloat(form.price));
    
//     if (form.sale_price) {
//       formData.append('sale_price', parseFloat(form.sale_price));
//     }
    
//     if (form.description.trim()) {
//       formData.append('description', form.description.trim());
//     }

//     if (form.images.length > 0) {
//       const image = form.images[0];
//       const uri = image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`;
//       formData.append('image', {
//         uri: uri,
//         name: image.name,
//         type: image.type,
//       });
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_ROUTE}/catalog/create/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//         timeout: 30000, // 30 second timeout
//       });

//       if (response.status === 201) {
//         Alert.alert(
//           'Success!',
//           'Item has been added to your catalog',
//           [
//             {
//               text: 'OK',
//               onPress: () => navigation.goBack()
//             }
//           ],
//           { cancelable: false }
//         );
//       }
//     } catch (error) {
//       console.error('Catalog creation error:', error?.response?.data || error?.message);
      
//       let errorMessage = 'Failed to create item. Please try again.';
//       if (error.response?.status === 400) {
//         errorMessage = 'Invalid data. Please check your inputs.';
//       } else if (error.response?.status === 401) {
//         errorMessage = 'Session expired. Please login again.';
//       } else if (error.response?.status === 413) {
//         errorMessage = 'Image is too large. Please choose a smaller image.';
//       } else if (error.message?.includes('Network Error')) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }
      
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeImage = () => {
//     setImages([]);
//     setForm({ ...form, images: [] });
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView 
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//             hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
//             disabled={loading}
//           >
//             <Icon name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Add New Item</Text>
//           <TouchableOpacity 
//             onPress={handleCreateCatalog}
//             style={[styles.saveButton, (!form.name || !form.price || loading) && styles.saveButtonDisabled]}
//             disabled={!form.name || !form.price || loading}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#FFFFFF" />
//             ) : (
//               <Text style={styles.saveButtonText}>Save</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         <ScrollView 
//           style={styles.container}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           bounces={Platform.OS === 'ios'}
//         >
//           {/* Photo Upload Section */}
//           <View style={styles.photoSection}>
//             <Text style={styles.sectionTitle}>Photos</Text>
//             <Text style={styles.sectionSubtitle}>Add clear photos of your item</Text>
            
//             <TouchableOpacity 
//               style={styles.photoBox}
//               onPress={handleImageUpload}
//               activeOpacity={0.8}
//               disabled={loading}
//             >
//               {images.length > 0 ? (
//                 <View style={styles.imageContainer}>
//                   <Image 
//                     source={{ uri: images[0].uri }} 
//                     style={styles.imagePreview} 
//                     resizeMode="cover"
//                   />
//                   <TouchableOpacity 
//                     style={styles.removeImageButton}
//                     onPress={removeImage}
//                   >
//                     <Icon name="close" size={18} color="#FFFFFF" />
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <View style={styles.photoPlaceholder}>
//                   <Icon name="add-a-photo" size={40} color="#666" />
//                   <Text style={styles.photoText}>Tap to add photo</Text>
//                   <Text style={styles.photoSubtext}>Recommended: Square, 1:1 ratio</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Form Fields */}
//           <View style={styles.formSection}>
//             <Text style={styles.sectionTitle}>Item Details</Text>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Item Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., Wireless Headphones"
//                 placeholderTextColor="#999"
//                 value={form.name}
//                 onChangeText={(text) => handleChange('name', text)}
//                 editable={!loading}
//                 maxLength={100}
//               />
//             </View>

//             <View style={styles.priceRow}>
//               <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
//                 <Text style={styles.inputLabel}>Price (NGN) *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="0.00"
//                   keyboardType="decimal-pad"
//                   placeholderTextColor="#999"
//                   value={form.price}
//                   onChangeText={(text) => handleChange('price', text)}
//                   editable={!loading}
//                 />
//               </View>
              
//               <View style={[styles.inputContainer, { flex: 1 }]}>
//                 <Text style={styles.inputLabel}>Sale Price (NGN)</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="0.00"
//                   keyboardType="decimal-pad"
//                   placeholderTextColor="#999"
//                   value={form.sale_price}
//                   onChangeText={(text) => handleChange('sale_price', text)}
//                   editable={!loading}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Description</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Describe your item..."
//                 placeholderTextColor="#999"
//                 value={form.description}
//                 onChangeText={(text) => handleChange('description', text)}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//                 editable={!loading}
//                 maxLength={500}
//               />
//               <Text style={styles.charCount}>{form.description.length}/500</Text>
//             </View>

//             {/* Hide Item Toggle */}
//             <View style={styles.toggleSection}>
//               <View style={styles.toggleContent}>
//                 <Text style={styles.toggleLabel}>Hide this item</Text>
//                 <Text style={styles.toggleDescription}>
//                   When hidden, customers won't see this item in your catalog
//                 </Text>
//               </View>
//               <Switch
//                 value={hideItem}
//                 onValueChange={setHideItem}
//                 disabled={loading}
//                 trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
//                 thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : hideItem ? '#4CAF50' : '#F5F5F5'}
//                 ios_backgroundColor="#E0E0E0"
//               />
//             </View>
//           </View>

//           {/* Bottom Save Button for better UX */}
//           <TouchableOpacity 
//             style={[
//               styles.bottomButton, 
//               (!form.name || !form.price || loading) && styles.bottomButtonDisabled
//             ]} 
//             onPress={handleCreateCatalog}
//             disabled={!form.name || !form.price || loading}
//             activeOpacity={0.8}
//           >
//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonSpinner} />
//                 <Text style={styles.bottomButtonText}>Adding Item...</Text>
//               </View>
//             ) : (
//               <>
//                 <Icon name="add-circle-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
//                 <Text style={styles.bottomButtonText}>Add to Catalog</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           {/* Info Tip */}
//           <View style={styles.infoTip}>
//             <Icon name="info-outline" size={18} color="#666" />
//             <Text style={styles.infoText}>
//               Make sure your item details are accurate. You can edit them later from your catalog.
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//     backgroundColor: '#FFFFFF',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F8F8F8',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333333',
//     flex: 1,
//     textAlign: 'center',
//   },
//   saveButton: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     minWidth: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   saveButtonDisabled: {
//     backgroundColor: '#A5D6A7',
//     opacity: 0.7,
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   photoSection: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: '#666666',
//     marginBottom: 16,
//   },
//   photoBox: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     borderStyle: 'dashed',
//   },
//   photoPlaceholder: {
//     height: 180,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   photoText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#666666',
//     marginTop: 12,
//   },
//   photoSubtext: {
//     fontSize: 12,
//     color: '#999999',
//     marginTop: 4,
//   },
//   imageContainer: {
//     position: 'relative',
//   },
//   imagePreview: {
//     width: '100%',
//     height: 180,
//   },
//   removeImageButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   formSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#555555',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: Platform.OS === 'ios' ? 14 : 12,
//     fontSize: 16,
//     color: '#333333',
//     backgroundColor: '#FFFFFF',
//   },
//   textArea: {
//     height: 100,
//     paddingTop: 14,
//     textAlignVertical: 'top',
//   },
//   charCount: {
//     textAlign: 'right',
//     fontSize: 12,
//     color: '#999999',
//     marginTop: 4,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   toggleSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//     marginTop: 8,
//   },
//   toggleContent: {
//     flex: 1,
//     marginRight: 16,
//   },
//   toggleLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333333',
//     marginBottom: 4,
//   },
//   toggleDescription: {
//     fontSize: 13,
//     color: '#666666',
//     lineHeight: 18,
//   },
//   bottomButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//     marginBottom: 20,
//     shadowColor: '#4CAF50',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   bottomButtonDisabled: {
//     backgroundColor: '#A5D6A7',
//     shadowOpacity: 0,
//     elevation: 0,
//     opacity: 0.7,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonSpinner: {
//     marginRight: 10,
//   },
//   buttonIcon: {
//     marginRight: 8,
//   },
//   bottomButtonText: {
//     color: '#FFFFFF',
//     fontSize: 17,
//     fontWeight: '600',
//     letterSpacing: 0.3,
//   },
//   infoTip: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF3E0',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF9800',
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#666666',
//     marginLeft: 10,
//     lineHeight: 18,
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

export default function AddItemScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [hideItem, setHideItem] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    sale_price: '',
    description: '',
    images: [],
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleImageUpload = () => {
    launchImageLibrary(
      { 
        mediaType: 'photo', 
        quality: 0.7,
        maxWidth: 1200,
        maxHeight: 1200,
        selectionLimit: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          const imageData = {
            uri: selectedImage.uri,
            type: selectedImage.type || 'image/jpeg',
            name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
          };
          setForm({ ...form, images: [imageData] });
          setImages([imageData]);
        }
      }
    );
  };

  const handleCreateCatalog = async () => {
    // Validation
    if (!form.name.trim()) {
      Alert.alert('Missing Field', 'Please enter item name');
      return;
    }
    
    if (!form.price.trim() || isNaN(parseFloat(form.price))) {
      Alert.alert('Invalid Price', 'Please enter a valid price');
      return;
    }

    if (form.sale_price && (isNaN(parseFloat(form.sale_price)) || parseFloat(form.sale_price) <= 0)) {
      Alert.alert('Invalid Sale Price', 'Please enter a valid sale price');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('price', parseFloat(form.price));
    
    if (form.sale_price) {
      formData.append('sale_price', parseFloat(form.sale_price));
    }
    
    if (form.description.trim()) {
      formData.append('description', form.description.trim());
    }

    if (form.images.length > 0) {
      const image = form.images[0];
      const uri = image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`;
      formData.append('image', {
        uri: uri,
        name: image.name,
        type: image.type,
      });
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/catalog/create/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      if (response.status === 201) {
        Alert.alert(
          'Success!',
          'Item has been added to your catalog',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Catalog creation error:', error?.response?.data || error?.message);
      
      let errorMessage = 'Failed to create item. Please try again.';
      if (error.response?.status === 400) {
        errorMessage = 'Invalid data. Please check your inputs.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.response?.status === 413) {
        errorMessage = 'Image is too large. Please choose a smaller image.';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImages([]);
    setForm({ ...form, images: [] });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { 
          borderBottomColor: colors.border,
          backgroundColor: colors.card 
        }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: colors.backgroundSecondary }]}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            disabled={loading}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Add New Item</Text>
          <TouchableOpacity 
            onPress={handleCreateCatalog}
            style={[
              styles.saveButton, 
              { backgroundColor: colors.primary },
              (!form.name || !form.price || loading) && [styles.saveButtonDisabled, { 
                backgroundColor: isDark ? colors.backgroundSecondary : '#A5D6A7'
              }]
            ]}
            disabled={!form.name || !form.price || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={Platform.OS === 'ios'}
        >
          {/* Photo Upload Section */}
          <View style={styles.photoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Add clear photos of your item
            </Text>
            
            <TouchableOpacity 
              style={[styles.photoBox, { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
              onPress={handleImageUpload}
              activeOpacity={0.8}
              disabled={loading}
            >
              {images.length > 0 ? (
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: images[0].uri }} 
                    style={styles.imagePreview} 
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={[styles.removeImageButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
                    onPress={removeImage}
                  >
                    <Icon name="close" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Icon name="add-a-photo" size={40} color={colors.textSecondary} />
                  <Text style={[styles.photoText, { color: colors.textSecondary }]}>Tap to add photo</Text>
                  <Text style={[styles.photoSubtext, { color: colors.textSecondary }]}>
                    Recommended: Square, 1:1 ratio
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={[styles.formSection, { 
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#000',
            shadowOpacity: isDark ? 0.1 : 0.05,
          }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Item Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Item Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.backgroundSecondary 
                }]}
                placeholder="e.g., Wireless Headphones"
                placeholderTextColor={colors.textSecondary}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                editable={!loading}
                maxLength={100}
              />
            </View>

            <View style={styles.priceRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Price (NGN) *</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.backgroundSecondary 
                  }]}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                  value={form.price}
                  onChangeText={(text) => handleChange('price', text)}
                  editable={!loading}
                />
              </View>
              
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Sale Price (NGN)</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.backgroundSecondary 
                  }]}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                  value={form.sale_price}
                  onChangeText={(text) => handleChange('sale_price', text)}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { 
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.backgroundSecondary 
                }]}
                placeholder="Describe your item..."
                placeholderTextColor={colors.textSecondary}
                value={form.description}
                onChangeText={(text) => handleChange('description', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
                maxLength={500}
              />
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {form.description.length}/500
              </Text>
            </View>

            {/* Hide Item Toggle */}
            <View style={[styles.toggleSection, { borderTopColor: colors.border }]}>
              <View style={styles.toggleContent}>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>Hide this item</Text>
                <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                  When hidden, customers won't see this item in your catalog
                </Text>
              </View>
              <Switch
                value={hideItem}
                onValueChange={setHideItem}
                disabled={loading}
                trackColor={{ false: colors.border, true: '#4CAF50' }}
                thumbColor={Platform.OS === 'ios' ? colors.text : hideItem ? '#4CAF50' : colors.textSecondary}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>

          {/* Bottom Save Button for better UX */}
          <TouchableOpacity 
            style={[
              styles.bottomButton, 
              { 
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOpacity: isDark ? 0.4 : 0.3,
              },
              (!form.name || !form.price || loading) && [styles.bottomButtonDisabled, { 
                backgroundColor: isDark ? colors.backgroundSecondary : '#A5D6A7',
                shadowOpacity: 0,
                elevation: 0
              }]
            ]} 
            onPress={handleCreateCatalog}
            disabled={!form.name || !form.price || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonSpinner} />
                <Text style={styles.bottomButtonText}>Adding Item...</Text>
              </View>
            ) : (
              <>
                <Icon name="add-circle-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.bottomButtonText}>Add to Catalog</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Tip */}
          <View style={[styles.infoTip, { 
            backgroundColor: isDark ? colors.backgroundSecondary : '#FFF3E0',
            borderLeftColor: isDark ? colors.primary : '#FF9800'
          }]}>
            <Icon name="info-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Make sure your item details are accurate. You can edit them later from your catalog.
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  photoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  photoBox: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  photoPlaceholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  photoText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  photoSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 180,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 8,
  },
  toggleContent: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomButton: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  bottomButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSpinner: {
    marginRight: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  infoTip: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    marginLeft: 10,
    lineHeight: 18,
  },
});