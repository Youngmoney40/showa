

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTE } from "../api_routing/api";
import { useTheme } from "../src/context/ThemeContext";

const { width } = Dimensions.get("window");

const CreateServicePostScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    priceRange: "",
    description: "",
    category: "",
    contactInfo: "",
    email: "",
    experienceLevel: "",
    availability: "Immediately",
    images: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const descriptionRef = useRef();
  const contactRef = useRef();
  const emailRef = useRef();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = await AsyncStorage.getItem('userToken');
      try {
        const res = await axios.get(`${API_ROUTE}/service-posts-categories/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.status === 200 || res.status === 201) {
          setCategories(res.data);
        }
      } catch (error) {
        //console.log('fetch category data', error.message);
      }
    }
    fetchCategories();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 5,
        includeBase64: false
      });

      if (!result.didCancel && !result.errorCode) {
        const newImages = result.assets.map(asset => asset.uri);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 5)
        }));
      }
    } catch (error) {
      //console.log("Image picker error:", error);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };


const handleSubmit = async () => {
  if (!formData.title || !formData.location) {
    Alert.alert("Required Fields", "Please fill in all required fields");
    return;
  }

  setIsLoading(true);
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    const parse = JSON.parse(userData);
    
    if (!token) {
      Alert.alert("Authentication error", "Please log in again.");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append('user', parse.id);
    data.append('title', formData.title);
    data.append('company', formData.company);
    data.append('location', formData.location);
    data.append('price_range', formData.priceRange);
    data.append('description', formData.description);
    
    // ===== FIX: Send category as a single ID =====
    if (formData.category) {
      data.append('categories', formData.category.toString());
    }
    
    data.append('contactinfo', formData.contactInfo);
    data.append('email', formData.email);
    data.append('experience_level', formData.experienceLevel);
    data.append('availability', formData.availability);

    // ===== FIX: Handle image uploads correctly =====
    formData.images.forEach((uri, index) => {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      // For React Native, create a proper file object
      data.append('uploaded_images', {
        uri: uri,
        name: filename,
        type: type,
      });
    });

    // Log what we're sending for debugging
    console.log('Sending data:', {
      title: formData.title,
      category: formData.category,
      imagesCount: formData.images.length
    });

    const response = await axios.post(`${API_ROUTE}/service-posts/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200 || response.status === 201) {
      setIsLoading(false);
      Alert.alert(
        "Success",
        "Your service post has been created successfully!",
        [{ text: "OK", onPress: () => navigation.navigate('MyServicePostsScreen') }]
      );
    }
  } catch (error) {
    setIsLoading(false);
    console.log('Error creating service post:', error.response?.data || error.message || error);
    
    // Show more specific error messages
    let errorMessage = "Failed to create service post. Please try again.";
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (errors.categories) {
        errorMessage = "Please select a valid category.";
      } else if (errors.uploaded_images) {
        errorMessage = "Please upload valid images.";
      } else {
        errorMessage = Object.values(errors).flat()[0] || errorMessage;
      }
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    Alert.alert("Error", errorMessage);
  }
};

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />

      {/* Navbar */}
      <View style={[styles.header, { 
        backgroundColor: colors.primary,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Service</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formContainer, { 
            backgroundColor: colors.surface,
            shadowColor: isDark ? 'transparent' : '#000',
          }]}>
            {/* Service Title */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Service Title *</Text>
              <TextInput
                placeholder="e.g. Electrical Contractor"
                placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                style={[styles.input, { 
                  backgroundColor: isDark ? colors.background : '#f8f9fa',
                  borderColor: isDark ? colors.border : '#e9ecef',
                  color: colors.text
                }]}
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                returnKeyType="next"
              />
            </View>

            {/* Company Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Company/Individual Name</Text>
              <TextInput
                placeholder="e.g. PowerSolutions Inc"
                placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                style={[styles.input, { 
                  backgroundColor: isDark ? colors.background : '#f8f9fa',
                  borderColor: isDark ? colors.border : '#e9ecef',
                  color: colors.text
                }]}
                value={formData.company}
                onChangeText={(text) => handleInputChange('company', text)}
                returnKeyType="next"
              />
            </View>

            {/* Category */}
<View style={styles.inputGroup}>
  <Text style={[styles.label, { color: colors.text }]}>Service Category *</Text>
  <View style={styles.categoryContainer}>
    {categories.map((cat) => {
      const isSelected = formData.category === cat.id;
      
      // Calculate styles based on selection and theme
      let buttonStyle = {
        backgroundColor: isDark ? colors.background : '#f8f9fa',
        borderColor: isDark ? colors.border : '#e9ecef',
        borderWidth: 1,
      };
      
      let textStyle = {
        color: isSelected ? '#fff' : colors.text,
      };
      
      if (isSelected) {
        // Selected state - use primary color
        buttonStyle = {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        };
        textStyle = {
          color: '#fff',
          fontWeight: '600',
        };
      }
      
      return (
        <TouchableOpacity
          key={cat.id}
          style={[styles.categoryButton, buttonStyle]}
          onPress={() => handleInputChange('category', cat.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.categoryText, textStyle]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Location *</Text>
              <View style={styles.locationContainer}>
                <MaterialIcons 
                  name="location-on" 
                  size={20} 
                  color={colors.primary} 
                  style={styles.locationIcon} 
                />
                <TextInput
                  placeholder="e.g. Port Harcourt"
                  placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                  style={[styles.input, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text,
                    paddingLeft: 32 
                  }]}
                  value={formData.location}
                  onChangeText={(text) => handleInputChange('location', text)}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Price Range</Text>
              <TextInput
                placeholder="e.g. ₦90,000 - ₦120,000/mo"
                placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                style={[styles.input, { 
                  backgroundColor: isDark ? colors.background : '#f8f9fa',
                  borderColor: isDark ? colors.border : '#e9ecef',
                  color: colors.text
                }]}
                value={formData.priceRange}
                onChangeText={(text) => handleInputChange('priceRange', text)}
                returnKeyType="next"
                keyboardType="numbers-and-punctuation"
              />
            </View>

          {/* Experience Level */}
<View style={styles.inputGroup}>
  <Text style={[styles.label, { color: colors.text }]}>Experience Level</Text>
  <View style={styles.experienceContainer}>
    {['Beginner', 'Intermediate', 'Expert'].map(level => {
      const isSelected = formData.experienceLevel === level;
      
      let buttonStyle = {
        backgroundColor: isDark ? colors.background : '#f8f9fa',
        borderColor: isDark ? colors.border : '#e9ecef',
        borderWidth: 1,
      };
      
      let textStyle = {
        color: isSelected ? '#fff' : colors.text,
      };
      
      if (isSelected) {
        buttonStyle = {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        };
        textStyle = {
          color: '#fff',
          fontWeight: '600',
        };
      }
      
      return (
        <TouchableOpacity
          key={level}
          style={[styles.experienceButton, buttonStyle]}
          onPress={() => handleInputChange('experienceLevel', level)}
          activeOpacity={0.7}
        >
          <Text style={[styles.experienceText, textStyle]}>
            {level}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>

            {/* Availability */}
<View style={styles.inputGroup}>
  <Text style={[styles.label, { color: colors.text }]}>Availability</Text>
  <View style={styles.availabilityContainer}>
    {['Immediately', 'Within 1 week', 'Flexible'].map(option => {
      const isSelected = formData.availability === option;
      
      let buttonStyle = {
        backgroundColor: isDark ? colors.background : '#f8f9fa',
        borderColor: isDark ? colors.border : '#e9ecef',
        borderWidth: 1,
      };
      
      let textStyle = {
        color: isSelected ? '#fff' : colors.text,
      };
      
      if (isSelected) {
        buttonStyle = {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        };
        textStyle = {
          color: '#fff',
          fontWeight: '600',
        };
      }
      
      return (
        <TouchableOpacity
          key={option}
          style={[styles.availabilityButton, buttonStyle]}
          onPress={() => handleInputChange('availability', option)}
          activeOpacity={0.7}
        >
          <Text style={[styles.availabilityText, textStyle]}>
            {option}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Service Description *</Text>
              <TextInput
                ref={descriptionRef}
                placeholder="Describe your service in detail..."
                placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                style={[styles.input, styles.descriptionInput, { 
                  backgroundColor: isDark ? colors.background : '#f8f9fa',
                  borderColor: isDark ? colors.border : '#e9ecef',
                  color: colors.text
                }]}
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                returnKeyType="done"
              />
            </View>

            {/* Images */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Add Photos ({formData.images.length}/5)</Text>
              <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Show what your service looks like</Text>
              
              <View style={styles.imageContainer}>
                {formData.images.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={[styles.image, { backgroundColor: isDark ? colors.surfaceSecondary : '#f8f9fa' }]} />
                    <TouchableOpacity 
                      style={[styles.removeImageButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                      onPress={() => removeImage(index)}
                    >
                      <MaterialIcons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {formData.images.length < 5 && (
                  <TouchableOpacity 
                    style={[styles.addImageButton, { 
                      borderColor: colors.primary,
                      backgroundColor: isDark ? colors.surfaceSecondary : '#f8f9fa',
                    }]} 
                    onPress={selectImages}
                  >
                    <MaterialIcons name="add" size={24} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                ref={emailRef}
                placeholder="Enter your email"
                placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                style={[styles.input, { 
                  backgroundColor: isDark ? colors.background : '#f8f9fa',
                  borderColor: isDark ? colors.border : '#e9ecef',
                  color: colors.text
                }]}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                returnKeyType="next"
                keyboardType="email-address"
              />
            </View>

            {/* Contact Information - Fixed keyboard issue */}
            <View style={[styles.inputGroup, styles.lastInputGroup]}>
              <Text style={[styles.label, { color: colors.text }]}>Contact Information</Text>
              <TextInput
                ref={contactRef}
                placeholder="Phone number"
                placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                style={[styles.input, { 
                  backgroundColor: isDark ? colors.background : '#f8f9fa',
                  borderColor: isDark ? colors.border : '#e9ecef',
                  color: colors.text
                }]}
                value={formData.contactInfo}
                onChangeText={(text) => handleInputChange('contactInfo', text)}
                returnKeyType="done"
                keyboardType="phone-pad"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark || colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Posting..." : "Post Service"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Bottom spacer for keyboard */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  lastInputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 13,
    marginBottom: 12,
  },
  input: {
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedCategory: {
    backgroundColor: '#0d64dd',
    borderColor: '#0d64dd',
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  locationContainer: {
    position: 'relative',
  },
  locationIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  experienceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  experienceButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedExperience: {
    backgroundColor: '#0d64dd',
    borderColor: '#0d64dd',
  },
  experienceText: {
    fontSize: 14,
  },
  selectedExperienceText: {
    color: '#fff',
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  availabilityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedAvailability: {
    backgroundColor: '#0d64dd',
    borderColor: '#0d64dd',
  },
  experienceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  experienceButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  experienceText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Availability styles
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  availabilityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '500',
  },

  availabilityText: {
    fontSize: 14,
  },
  selectedAvailabilityText: {
    color: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  imageWrapper: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: Platform.OS === 'android' ? 16 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 4,
},
categoryButton: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  marginRight: 8,
  marginBottom: 8,
  minWidth: 60,
  alignItems: 'center',
  justifyContent: 'center',
},
categoryText: {
  fontSize: 14,
  fontWeight: '500',
},
  submitButtonText: {
    color: '#fff',
    padding: Platform.OS === 'ios' ? 16 : 0,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 20 : 10,
  },
});

export default CreateServicePostScreen;