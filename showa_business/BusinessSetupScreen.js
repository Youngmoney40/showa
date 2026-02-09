// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity,
//   StyleSheet, ScrollView, StatusBar, Image,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function BusinessSetupScreen({ navigation }) {
// const [profileId, setProfileId] = useState(null);
// const fetchProfile = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const res = await fetch(`${API_ROUTE}/profiles/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) {
//       //console.log('No existing profile found.');
//       return;
//     }
//     const data = await res.json();
//     //console.log('Fetched profile:', data);

//     setForm({
//       name: data.name || '',
//       phone: data.phone || '',
//       address: data.address || '',
//       about: data.about || '',
//     });
//     if (data.category) {
//       setSelectedCategoryId(data.category.id);
//     }
//     if (data.image) {
//       setLogo({ uri: data.image });
//     }
//     setProfileId(data.id);
//   } catch (err) {
//     //console.error('Error fetching profile:', err);
//   }
// };

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
//      fetchProfile();
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

// const handleSubmit = async () => {
//   let newErrors = {};
//   if (!form.name) newErrors.name = true;
//   if (!selectedCategoryId) newErrors.category = true;
//   if (!form.phone) newErrors.phone = true;
//   if (!form.address) newErrors.address = true;
//   if (!form.about) newErrors.about = true;

//   setErrors(newErrors);

//   if (Object.keys(newErrors).length > 0) return;

//   const token = await AsyncStorage.getItem('userToken');
//   const formData = new FormData();
//   formData.append('name', form.name);
//   formData.append('phone', form.phone);
//   formData.append('address', form.address);
//   formData.append('about', form.about);
//   formData.append('category_ids', selectedCategoryId); 

//   if (logo && logo.uri && !logo.uri.startsWith('http')) {
//     formData.append('image', logo);
//   }

//   try {
  
//     const url = profileId
//       ? `${API_ROUTE}/profiles/`
//       : `${API_ROUTE}/profiles/`;
//     const method = profileId ? 'PATCH' : 'POST';

//     console.log('Submitting to:', url, 'Method:', method);

//     const response = await fetch(url, {
//       method,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       //console.error('Error saving profile:', error);
//       Alert.alert('Error', 'Something went wrong while saving your profile.');
//       return;
//     }

//     const data = await response.json();
//     navigation.replace('BusinessHome');
//     Alert.alert('Success', profileId ? 'Profile updated!' : 'Profile created!');
//   } catch (error) {
//     //console.error('Submit failed:', error);
//     Alert.alert('Error', 'Failed to save your profile.');
//   }
// };


//   return (
//     <SafeAreaView>
//        <ScrollView contentContainerStyle={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//       <Text style={styles.title}>Business Setup</Text>

//       <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//         {logo ? (
//           <Image source={{ uri: logo.uri }} style={styles.logo} />
//         ) : (
//           <>
//             <Icon name="add-a-photo" size={40} color="#777" />
//             <Text style={styles.imageText}>Add Business Logo</Text>
//           </>
//         )}
//       </TouchableOpacity>

//       {/* Business Name */}
//       <Text style={styles.label}>Business Name</Text>
//       <TextInput
//         style={[styles.input, errors.name && styles.inputError]}
//         placeholder="Business Name"
//         placeholderTextColor='#555'
//         value={form.name}
//         onChangeText={(text) => handleChange('name', text)}
//       />

//       {/* Category Dropdown */}
//       <Text style={styles.label}>Select Category</Text>
//       <View style={[styles.dropdownWrapper, errors.category && styles.inputError]}>
//         <Picker
//         style={{color:'#555'}}
//           selectedValue={selectedCategoryId}
//           onValueChange={(value) => {
//             setSelectedCategoryId(value);
//             setErrors({ ...errors, category: false });
//           }}
//         >
//           <Picker.Item label="Select a category..." value={null} />
//           {categories.map((cat) => (
//             <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
//           ))}
//         </Picker>
//       </View>

//       {/* Phone Number */}
//       <Text style={styles.label}>Phone Number</Text>
//       <TextInput
//         style={[styles.input, errors.phone && styles.inputError]}
//         placeholder="Phone Number"
//         keyboardType="phone-pad"
//          placeholderTextColor='#555'
//         value={form.phone}
//         onChangeText={(text) => handleChange('phone', text)}
//       />

//       {/* Address */}
//       <Text style={styles.label}>Address</Text>
//       <TextInput
//         style={[styles.input, errors.address && styles.inputError]}
//         placeholder="Address"
//         value={form.address}
//          placeholderTextColor='#555'
//         onChangeText={(text) => handleChange('address', text)}
//       />

//       {/* About */}
//       <Text style={styles.label}>About</Text>
//       <TextInput
//         style={[styles.input, { minHeight: 80 }, errors.about && styles.inputError]}
//         placeholder="Tell us about your business..."
//         multiline
//         placeholderTextColor='#555'
//         value={form.about}
//         onChangeText={(text) => handleChange('about', text)}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Finish Setup</Text>
//       </TouchableOpacity>
//     </ScrollView>
//     </SafeAreaView>
   
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20,color:'#333' },
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
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar, Image,
  Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusinessSetupScreen({ navigation }) {
  const [loading, setLoading] = useState(false); 
  const [profileId, setProfileId] = useState(null);
  
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        //console.log('No existing profile found.');
        return;
      }
      const data = await res.json();
      //console.log('Fetched profile:', data);

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
      //console.error('Error fetching profile:', err);
    }
  };

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    about: '',
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProfile();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_ROUTE}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      //console.error('Error fetching categories:', err);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.5 },
      (response) => {
        if (response.assets) {
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

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (loading) return;
    
    let newErrors = {};
    if (!form.name) newErrors.name = true;
    if (!selectedCategoryId) newErrors.category = true;
    if (!form.phone) newErrors.phone = true;
    if (!form.address) newErrors.address = true;
    if (!form.about) newErrors.about = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true); 

    const token = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    formData.append('address', form.address);
    formData.append('about', form.about);
    formData.append('category_ids', selectedCategoryId); 

    if (logo && logo.uri && !logo.uri.startsWith('http')) {
      formData.append('image', logo);
    }

    try {
      const url = profileId
        ? `${API_ROUTE}/profiles/`
        : `${API_ROUTE}/profiles/`;
      const method = profileId ? 'PATCH' : 'POST';

      console.log('Submitting to:', url, 'Method:', method);

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
        //console.error('Error saving profile:', error);
        Alert.alert('Error', 'Something went wrong while saving your profile.');
        setLoading(false); 
        return;
      }

      const data = await response.json();
      navigation.replace('BusinessHome');
      Alert.alert('Success', profileId ? 'Profile updated!' : 'Profile created!');
    } catch (error) {
      //console.error('Submit failed:', error);
      Alert.alert('Error', 'Failed to save your profile.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.title}>Business Setup</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {logo ? (
            <Image source={{ uri: logo.uri }} style={styles.logo} />
          ) : (
            <>
              <Icon name="add-a-photo" size={40} color="#777" />
              <Text style={styles.imageText}>Add Business Logo</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Business Name */}
        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Business Name"
          placeholderTextColor='#555'
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        {/* Category Dropdown */}
        <Text style={styles.label}>Select Category</Text>
        <View style={[styles.dropdownWrapper, errors.category && styles.inputError]}>
          <Picker
            style={{color:'#555'}}
            selectedValue={selectedCategoryId}
            onValueChange={(value) => {
              setSelectedCategoryId(value);
              setErrors({ ...errors, category: false });
            }}
          >
            <Picker.Item label="Select a category..." value={null} />
            {categories.map((cat) => (
              <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
            ))}
          </Picker>
        </View>

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          placeholderTextColor='#555'
          value={form.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          placeholder="Address"
          value={form.address}
          placeholderTextColor='#555'
          onChangeText={(text) => handleChange('address', text)}
        />

        {/* About */}
        <Text style={styles.label}>About</Text>
        <TextInput
          style={[styles.input, { minHeight: 80 }, errors.about && styles.inputError]}
          placeholder="Tell us about your business..."
          multiline
          placeholderTextColor='#555'
          value={form.about}
          onChangeText={(text) => handleChange('about', text)}
        />
        
        {/* Updated Button with Loading */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Finish Setup</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color:'#333' },
  label: { fontWeight: '600', marginBottom: 6, fontSize: 14, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 15,
    color:'#555',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: 'red',
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagePicker: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  logo: { height: 130, width: 130, borderRadius: 60 },
  imageText: { color: '#777', textAlign: 'center', paddingHorizontal: 10, fontSize: 12 },
  button: {
    backgroundColor: '#0d64dd',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#6ca0e8', 
    opacity: 0.8,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
