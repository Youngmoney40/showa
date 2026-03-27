
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity,
//   StyleSheet, ScrollView, StatusBar, Image,
//   Alert, ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function BusinessSetupScreen({ navigation }) {
//   const [loading, setLoading] = useState(false); 
//   const [profileId, setProfileId] = useState(null);
  
//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await fetch(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) {
//         //console.log('No existing profile found.');
//         return;
//       }
//       const data = await res.json();
//       //console.log('Fetched profile:', data);

//       setForm({
//         name: data.name || '',
//         phone: data.phone || '',
//         address: data.address || '',
//         about: data.about || '',
//       });
//       if (data.category) {
//         setSelectedCategoryId(data.category.id);
//       }
//       if (data.image) {
//         setLogo({ uri: data.image });
//       }
//       setProfileId(data.id);
//     } catch (err) {
//       //console.error('Error fetching profile:', err);
//     }
//   };

//   const [form, setForm] = useState({
//     name: '',
//     phone: '',
//     address: '',
//     about: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [logo, setLogo] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//     fetchProfile();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await fetch(`${API_ROUTE}/categories/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       //console.error('Error fetching categories:', err);
//     }
//   };

//   const pickImage = () => {
//     launchImageLibrary(
//       { mediaType: 'photo', quality: 0.5 },
//       (response) => {
//         if (response.assets) {
//           const image = response.assets[0];
//           setLogo({
//             uri: image.uri,
//             type: image.type,
//             name: image.fileName || 'logo.jpg',
//           });
//         }
//       }
//     );
//   };

//   const handleChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//     setErrors({ ...errors, [key]: false });
//   };

//   const handleSubmit = async () => {
//     // Prevent multiple submissions
//     if (loading) return;
    
//     let newErrors = {};
//     if (!form.name) newErrors.name = true;
//     if (!selectedCategoryId) newErrors.category = true;
//     if (!form.phone) newErrors.phone = true;
//     if (!form.address) newErrors.address = true;
//     if (!form.about) newErrors.about = true;

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) return;

//     setLoading(true); 

//     const token = await AsyncStorage.getItem('userToken');
//     const formData = new FormData();
//     formData.append('name', form.name);
//     formData.append('phone', form.phone);
//     formData.append('address', form.address);
//     formData.append('about', form.about);
//     formData.append('category_ids', selectedCategoryId); 

//     if (logo && logo.uri && !logo.uri.startsWith('http')) {
//       formData.append('image', logo);
//     }

//     try {
//       const url = profileId
//         ? `${API_ROUTE}/profiles/`
//         : `${API_ROUTE}/profiles/`;
//       const method = profileId ? 'PATCH' : 'POST';

//       console.log('Submitting to:', url, 'Method:', method);

//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         //console.error('Error saving profile:', error);
//         Alert.alert('Error', 'Something went wrong while saving your profile.');
//         setLoading(false); 
//         return;
//       }

//       const data = await response.json();
//       navigation.replace('BusinessHome');
//       Alert.alert('Success', profileId ? 'Profile updated!' : 'Profile created!');
//     } catch (error) {
//       //console.error('Submit failed:', error);
//       Alert.alert('Error', 'Failed to save your profile.');
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView>
//       <ScrollView contentContainerStyle={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//         <Text style={styles.title}>Business Setup</Text>

//         <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//           {logo ? (
//             <Image source={{ uri: logo.uri }} style={styles.logo} />
//           ) : (
//             <>
//               <Icon name="add-a-photo" size={40} color="#777" />
//               <Text style={styles.imageText}>Add Business Logo</Text>
//             </>
//           )}
//         </TouchableOpacity>

//         {/* Business Name */}
//         <Text style={styles.label}>Business Name</Text>
//         <TextInput
//           style={[styles.input, errors.name && styles.inputError]}
//           placeholder="Business Name"
//           placeholderTextColor='#555'
//           value={form.name}
//           onChangeText={(text) => handleChange('name', text)}
//         />

//         {/* Category Dropdown */}
//         <Text style={styles.label}>Select Category</Text>
//         <View style={[styles.dropdownWrapper, errors.category && styles.inputError]}>
//           <Picker
//             style={{color:'#555'}}
//             selectedValue={selectedCategoryId}
//             onValueChange={(value) => {
//               setSelectedCategoryId(value);
//               setErrors({ ...errors, category: false });
//             }}
//           >
//             <Picker.Item label="Select a category..." value={null} />
//             {categories.map((cat) => (
//               <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
//             ))}
//           </Picker>
//         </View>

//         {/* Phone Number */}
//         <Text style={styles.label}>Phone Number</Text>
//         <TextInput
//           style={[styles.input, errors.phone && styles.inputError]}
//           placeholder="Phone Number"
//           keyboardType="phone-pad"
//           placeholderTextColor='#555'
//           value={form.phone}
//           onChangeText={(text) => handleChange('phone', text)}
//         />

//         {/* Address */}
//         <Text style={styles.label}>Address</Text>
//         <TextInput
//           style={[styles.input, errors.address && styles.inputError]}
//           placeholder="Address"
//           value={form.address}
//           placeholderTextColor='#555'
//           onChangeText={(text) => handleChange('address', text)}
//         />

//         {/* About */}
//         <Text style={styles.label}>About</Text>
//         <TextInput
//           style={[styles.input, { minHeight: 80 }, errors.about && styles.inputError]}
//           placeholder="Tell us about your business..."
//           multiline
//           placeholderTextColor='#555'
//           value={form.about}
//           onChangeText={(text) => handleChange('about', text)}
//         />
        
//         {/* Updated Button with Loading */}
//         <TouchableOpacity 
//           style={[styles.button, loading && styles.buttonDisabled]} 
//           onPress={handleSubmit}
//           disabled={loading} // Disable button when loading
//         >
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator color="#fff" size="small" />
//               <Text style={styles.buttonText}>Processing...</Text>
//             </View>
//           ) : (
//             <Text style={styles.buttonText}>Finish Setup</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color:'#333' },
//   label: { fontWeight: '600', marginBottom: 6, fontSize: 14, color: '#333' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 15,
//     color:'#555',
//     backgroundColor: '#fafafa',
//   },
//   inputError: {
//     borderColor: 'red',
//   },
//   dropdownWrapper: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   imagePicker: {
//     height: 120,
//     width: 120,
//     borderRadius: 60,
//     backgroundColor: '#f0f0f0',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
//   logo: { height: 130, width: 130, borderRadius: 60 },
//   imageText: { color: '#777', textAlign: 'center', paddingHorizontal: 10, fontSize: 12 },
//   button: {
//     backgroundColor: '#0d64dd',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: '#6ca0e8', 
//     opacity: 0.8,
//   },
//   buttonText: { 
//     color: '#fff', 
//     fontWeight: 'bold', 
//     fontSize: 16 
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { API_ROUTE } from '../api_routing/api';

const BusinessProfileScreen = ({ navigation }) => {
 
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    about: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [logo, setLogo] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_ROUTE}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        
        return;
      }
      
      const data = await res.json();
      
      setForm({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        about: data.about || '',
      });
      
      if (data.category) {
        setSelectedCategoryId(data.category.id);
      }
      
      if (data.image) {
        setLogo({ uri: data.image });
      }
      
      setProfileId(data.id);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchProfile();
    };
    loadData();
  }, []);

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.5, includeBase64: false },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.error('ImagePicker Error: ', response.error);
          Alert.alert('Error', 'Failed to pick image');
        } else if (response.assets && response.assets[0]) {
          const image = response.assets[0];
          setLogo({
            uri: image.uri,
            type: image.type,
            name: image.fileName || 'logo.jpg',
          });
        }
      }
    );
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: false });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Business name is required';
    if (!selectedCategoryId) newErrors.category = 'Please select a category';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.about.trim()) newErrors.about = 'About description is required';
    
    // Phone number validation ===================
    if (form.phone.trim() && !/^[\d\s+()-]{10,}$/.test(form.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading) return;
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      
      formData.append('name', form.name.trim());
      formData.append('phone', form.phone.trim());
      formData.append('address', form.address.trim());
      formData.append('about', form.about.trim());
      formData.append('category_ids', selectedCategoryId);
      

      if (logo && logo.uri && !logo.uri.startsWith('http')) {
        formData.append('image', {
          uri: logo.uri,
          type: logo.type || 'image/jpeg',
          name: logo.name || 'profile_image.jpg',
        });
      }
      
      const url = `${API_ROUTE}/profiles/`;
      const method = profileId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Error saving profile:', error);
        
        if (error.message) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Error', 'Something went wrong while saving your profile.');
        }
        return;
      }
      
      const data = await response.json();
      Alert.alert(
        'Success',
        profileId ? 'Profile updated successfully!' : 'Profile created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('BusinessHome'),
          },
        ]
      );
    } catch (error) {
      console.error('Submit failed:', error);
      Alert.alert('Error', 'Failed to save your profile. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, placeholder, multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} <Text style={styles.requiredStar}>*</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
          multiline && styles.textArea,
        ]}
        placeholder={placeholder}
        value={form[field]}
        onChangeText={(text) => handleChange(field, text)}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        editable={!loading}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} >

        <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.logoSection}>
            <TouchableOpacity onPress={pickImage} disabled={loading}>
              <View style={styles.logoContainer}>
                {logo ? (
                  <Image source={{ uri: logo.uri }} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>Add Logo</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.logoHint}>Tap to add business logo</Text>
          </View>

          {renderInput('Business Name', 'name', 'Enter business name')}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Category <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={[
              styles.pickerContainer,
              errors.category && styles.inputError
            ]}>
              <Picker
                selectedValue={selectedCategoryId}
                onValueChange={(itemValue) => {
                  setSelectedCategoryId(itemValue);
                  setErrors({ ...errors, category: false });
                }}
                enabled={!loading}
              >
                <Picker.Item label="Select a category" value={null} />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

        
          {renderInput('Phone Number', 'phone', 'Enter phone number')}

          
          {renderInput('Address', 'address', 'Enter business address')}

          {/* About */}
          {renderInput('About', 'about', 'Describe your business', true)}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {profileId ? 'Update Profile' : 'Create Profile'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  logoPlaceholderText: {
    fontSize: 14,
    color: '#666',
  },
  logoHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  requiredStar: {
    color: '#FF3B30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BusinessProfileScreen;
