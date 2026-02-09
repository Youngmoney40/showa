import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Alert
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTE } from "../api_routing/api";


const { width } = Dimensions.get("window");

const CreateServicePostScreen = ({ navigation }) => {
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
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    const fetchCategories =async () =>{
      const token = await AsyncStorage.getItem('userToken');
      try {

        const res = await axios.get(`${API_ROUTE}/service-posts-categories/`,{
          headers:{
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.status === 200 || res.status === 201) {
          //console.log('fetch category data', res.data);
          setCategories(res.data);
          
        }else{
          console.log('data error',)
        }
        
      } catch (error) {
         //console.log('fetch category data', error.message);
        
      }
    }
    fetchCategories();

  },[])

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
          images: [...prev.images, ...newImages].slice(0, 5) // Limit to 5 images
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
  if (!formData.title ||  !formData.location ) {
    Alert.alert("Required Fields", "Please fill in all required fields");
    return;
  }

  Alert.alert("On Review", "Your service has been received and currently on review we will notify you shortly when is publish.");
navigation.goBack();
  //setIsLoading(true);
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const userid = await AsyncStorage.getItem('userData');
//     const parse = JSON.parse(userid);
    
//     if (!token) {
//       Alert.alert("Authentication error", "Please log in again.");
//       setIsLoading(false);
//       return;
//     }
// console.log('categories', formData.category)
//     const data = new FormData();
//     data.append('user', parse.id);
//     data.append('title', formData.title);
//     data.append('company', formData.company);
//     data.append('location', formData.location);
//     data.append('price_range', formData.priceRange);
//     data.append('description', formData.description);
//     data.append('categories', formData.category);
//     data.append('contactinfo', formData.contactInfo);
//     data.append('email', formData.email);
//     data.append('experience_level', formData.experienceLevel);
//     data.append('availability', formData.availability);

//     // Append images
//     formData.images.forEach((uri, index) => {
//       const filename = uri.split('/').pop();
//       const match = /\.(\w+)$/.exec(filename);
//       const type = match ? `image/${match[1]}` : `image`;

//       data.append('uploaded_images', {
//         uri,
//         name: filename,
//         type,
//       });
//     });

//     const response = await axios.post(`${API_ROUTE}/service-posts/`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     if (response.status === 200 || response.status === 201) {
//       setIsLoading(false);
//       Alert.alert(
//         "Success",
//         "Your service post has been created successfully!",
//         [{ text: "OK", onPress: () => navigation.goBack() }]
//       );
//     }
//   } catch (error) {
//     setIsLoading(false);
//     console.log('Error creating service post:', error.response?.data || error.message || error);
//     Alert.alert(
//       "Error", 
//       error.response?.data?.message || "Failed to create service post. Please try again."
//     );
//   }
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Service Post</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form Container ===================*/}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Title *</Text>
            <TextInput
              placeholder="e.g. Electrical Contractor"
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              returnKeyType="next"
            />
          </View>

          {/* Company Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company/Individual Name</Text>
            <TextInput
              placeholder="e.g. PowerSolutions Inc"
              style={styles.input}
              value={formData.company}
              onChangeText={(text) => handleInputChange('company', text)}
              returnKeyType="next"
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Category *</Text>
           <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    formData.category === cat.id && styles.selectedCategory
                  ]}
                  onPress={() => handleInputChange('category', cat.id)}
                >
                  <Text style={[
                    styles.categoryText,
                    formData.category === cat.id && styles.selectedCategoryText
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.locationContainer}>
              <MaterialIcons 
                name="location-on" 
                size={20} 
                color="#0d64dd" 
                style={styles.locationIcon} 
              />
              <TextInput
                placeholder="e.g. Port Harcourt"
                style={[styles.input, { paddingLeft: 32 }]}
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price Range</Text>
            <TextInput
              placeholder="e.g. ₦90,000 - ₦120,000/mo"
              style={styles.input}
              value={formData.priceRange}
              onChangeText={(text) => handleInputChange('priceRange', text)}
              returnKeyType="next"
              keyboardType="numbers-and-punctuation"
            />
          </View>

          {/* Experience Level */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.experienceContainer}>
              {['Beginner', 'Intermediate', 'Expert'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.experienceButton,
                    formData.experienceLevel === level && styles.selectedExperience
                  ]}
                  onPress={() => handleInputChange('experienceLevel', level)}
                >
                  <Text style={[
                    styles.experienceText,
                    formData.experienceLevel === level && styles.selectedExperienceText
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Availability */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Availability</Text>
            <View style={styles.availabilityContainer}>
              {['Immediately', 'Within 1 week', 'Flexible'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.availabilityButton,
                    formData.availability === option && styles.selectedAvailability
                  ]}
                  onPress={() => handleInputChange('availability', option)}
                >
                  <Text style={[
                    styles.availabilityText,
                    formData.availability === option && styles.selectedAvailabilityText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Description *</Text>
            <TextInput
              ref={descriptionRef}
              placeholder="Describe your service in detail..."
              style={[styles.input, styles.descriptionInput]}
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
            <Text style={styles.label}>Add Photos ({formData.images.length}/5)</Text>
            <Text style={styles.subLabel}>Show what your service looks like</Text>
            
            <View style={styles.imageContainer}>
              {formData.images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <MaterialIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {formData.images.length < 5 && (
                <TouchableOpacity style={styles.addImageButton} onPress={selectImages}>
                  <MaterialIcons name="add" size={24} color="#0d64dd" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              returnKeyType="done"
              
            />
          </View>
          {/* Contact Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Information</Text>
            <TextInput
              placeholder="Phone number"
              style={styles.input}
              value={formData.contactInfo}
              onChangeText={(text) => handleInputChange('contactInfo', text)}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#0d64dd", "#4A43EC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Posting..." : "Post Service"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333'
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategory: {
    backgroundColor: '#0d64dd',
    borderColor: '#0d64dd',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
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
    marginTop: 8,
  },
  experienceButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedExperience: {
    backgroundColor: '#0d64dd',
    borderColor: '#0d64dd',
  },
  experienceText: {
    fontSize: 14,
    color: '#333',
  },
  selectedExperienceText: {
    color: '#fff',
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  availabilityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedAvailability: {
    backgroundColor: '#0d64dd',
    borderColor: '#0d64dd',
  },
  availabilityText: {
    fontSize: 14,
    color: '#333',
  },
  selectedAvailabilityText: {
    color: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0d64dd',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  submitButton: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical:Platform.OS === 'android' ? 16 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    padding:20,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateServicePostScreen;