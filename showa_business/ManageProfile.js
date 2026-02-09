
// import React, { useState, useEffect, useCallback } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import {
//   View, Text, TextInput, Image, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Modal,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export default function BusinessProfileScreen({ navigation }) {
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [currentField, setCurrentField] = useState('');
//   const [fieldValue, setFieldValue] = useState('');
//   const [profileData, setProfileData] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [logo, setLogo] = useState(null);
//   const [catalogData, setCatalogData] = useState([]);
//   const [businessHours, setBusinessHours] = useState([]);
//   const [selectedDay, setSelectedDay] = useState("Monday");
//   const [openTime, setOpenTime] = useState(new Date());
//   const [closeTime, setCloseTime] = useState(new Date());
//   const [showOpenPicker, setShowOpenPicker] = useState(false);
//   const [showClosePicker, setShowClosePicker] = useState(false);
//   const [showBHModal, setShowBHModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null); 
//   const [imageModalVisible, setImageModalVisible] = useState(false);

//   const fetchBusinessHours = async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     const res = await fetch(`${API_ROUTE}/business-hours/${profileData.id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setBusinessHours(data);
//   };

//    const openImageModal = (item) => {
//     setSelectedItem(item);
//     setImageModalVisible(true);
//   };

//   const closeImageModal = () => {
//     setSelectedItem(null);
//     setImageModalVisible(false);
//   };

//   const handleAddHour = async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     const body = {
//       profile: profileData.id,
//       day: selectedDay,
//       open_time: openTime.toTimeString().slice(0, 5),
//       close_time: closeTime.toTimeString().slice(0, 5),
//     };

//     const res = await fetch(`${API_ROUTE}/business-hours/`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       setBusinessHours([...businessHours, data]);
//     } else {
//       console.error('Error:', data);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (profileData.id) {
//       fetchBusinessHours();
//     }
//   }, [profileData]);

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         const profile = Array.isArray(response.data) ? response.data[0] : response.data;
//         console.log('profile data', response.data);
//         setProfileData(profile);
//         if (profile.logo) {
//           setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
//         }
//       }
//     } catch (err) {
//       console.error('Failed to load profile', err);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await fetch(`${API_ROUTE}/categories/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//     }
//   };

//   const handleOpenModal = (fieldKey) => {
//   setCurrentField(fieldKey);
//   if (fieldKey === 'categories') {
//     const firstCategoryId = profileData.categories?.[0]?.id || null;
//     setSelectedCategoryId(firstCategoryId);
//   } else if (fieldKey === 'website') {
   
//     const currentValue = profileData[fieldKey] || '';
//     setFieldValue(currentValue.startsWith('http') ? currentValue : `https://${currentValue}`);
//   } else {
//     setFieldValue(profileData[fieldKey] || '');
//   }
//   setEditModalVisible(true);
// };


// const handleSave = async () => {
//   try {
//     // Validate website URL if editing website field
//     if (currentField === 'website') {
//       const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
//       if (!urlPattern.test(fieldValue)) {
//         alert('Please enter a valid website URL (e.g., https://example.com)');
//         return;
//       }
//     }

//     const token = await AsyncStorage.getItem('userToken');
//     const formData = new FormData();

//     if (currentField === 'categories') {
//       formData.append('category_ids', selectedCategoryId);
//     } else {
//       formData.append(currentField, fieldValue);
//     }

//         const response = await fetch(`${API_ROUTE}/profiles/`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const data = await response.json();

//     if (response.ok) {
//       setProfileData((prev) => ({
//         ...prev,
//         ...(currentField === 'categories'
//           ? { categories: categories.filter(c => c.id === selectedCategoryId) }
//           : { [currentField]: data[currentField] }),
//       }));
//       setEditModalVisible(false);
//     } else {
//       console.error('Error updating profile:', data);
//     }

   
//   } catch (err) {
//     console.error('Network error updating profile:', err);
//   }
// };




//   const pickImage = () => {
//     launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
//       if (response.assets) {
//         const image = response.assets[0];
//         const pickedLogo = {
//           uri: image.uri,
//           type: image.type,
//           name: image.fileName || 'logo.jpg',
//         };
//         setLogo(pickedLogo);
//         uploadLogo(pickedLogo);
//       }
//     });
//   };

//   const uploadLogo = async (image) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
//       formData.append('image', {
//         uri: image.uri,
//         type: image.type,
//         name: image.name,
//       });

//       const response = await fetch(`${API_ROUTE}/profiles/`, {
//         method: 'PATCH',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: formData,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         console.error('Error uploading logo:', error);
//       } else {
//         fetchProfile();
//       }
//     } catch (err) {
//       console.error('Error uploading logo', err);
//     }
//   };

//   const fetchCatalogData = async () => {
   
//       try {
//         const token = await AsyncStorage.getItem('userToken');
    
//         if (!token) {
//           console.log('No token found');
//           return;
//         }
//         const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.status === 200) {
//           console.log('Catalog data fetched successfully:', response.data);
//           setCatalogData(response.data);
          
//         }
//       } catch (error) {
//         console.error('Error fetching catalog:', error);
//       }
//     };
// useFocusEffect(
//     useCallback(() => {
     
//       fetchCatalogData();
//     }, [])
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <StatusBar backgroundColor="#0750b5" barStyle="light-content" />
//       <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
//         <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
//           {profileData ? (
//             <Image source={{ uri: `${API_ROUTE_IMAGE}${profileData.image}` }} style={styles.avatar} />
//           ) : (
//             <View style={styles.imagePicker}>
//               <Icon name="add-a-photo" size={40} color="#777" />
//               <Text style={styles.imageText}>Add Logo</Text>
//             </View>
//           )}
//           <View style={styles.editAvatarIcon}>
//             <Icon name="edit" size={16} color="#fff" />
//           </View>
//         </TouchableOpacity>
//       </LinearGradient>

//       <View style={styles.infoContainer}>
//         <EditableField label="Name" icon="person" value={profileData.name} onPress={() => handleOpenModal('name')} />
//         <EditableField
//           label="Category"
//           icon="palette"
//           value={profileData.categories?.map(cat => cat.name).join(', ') || '—'}
//           onPress={() => handleOpenModal('categories')}
//         />
//         <EditableField label="Description" icon="short-text" value={profileData.description} onPress={() => handleOpenModal('description')} />

//         {/* Business Hours Summary */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
//           <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Business Hours</Text>
//           <TouchableOpacity onPress={() => setShowBHModal(true)}>
//             <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>Manage</Text>
//           </TouchableOpacity>
//         </View>
//         {businessHours.map((hour, idx) => (
//           <View key={idx} style={{ paddingVertical: 4 }}>
//             <Text>{hour.day}: {hour.open_time} - {hour.close_time}</Text>
//           </View>
//         ))}

//         <EditableField label="Address" icon="location-on" value={profileData.address} onPress={() => handleOpenModal('address')} />
//         <EditableField label="Email" icon="email" value={profileData.email} onPress={() => handleOpenModal('email')} />
//         <EditableField label="Website" icon="language" value={profileData.website} onPress={() => handleOpenModal('website')} />
//       </View>

//        <View style={styles.productsHeader}>
//          <Text style={[styles.productsTitle,{color:'#555'}]}>Products</Text>
//          <TouchableOpacity onPress={() => navigation.navigate('CreateCatalog')}>
//            <Text style={styles.manageText}>Manage</Text>
//          </TouchableOpacity>
//        </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
//     {catalogData.length === 0 ? (
//       <View >
//         <Text style={{color:'#777'}}>You have not yet created product</Text>
//       </View>
//     ) : (
//       catalogData.map((item, index) => (
//         <TouchableOpacity key={index} onPress={() => openImageModal(item)}>
//           <View style={styles.catalogCard}>
//             <Image
//               source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
//               style={styles.productImage}
//               resizeMode="cover"
//             />
//           </View>
//         </TouchableOpacity>
//       ))
//     )}
//   </ScrollView>

//       <View style={styles.infoContainer}>
//         <EditableField label="About" icon="info" value={profileData.about} onPress={() => handleOpenModal('about')} />
//         <EditableField label="Phone" icon="phone" value={profileData.phone} onPress={() => handleOpenModal('phone')} />
          
       
//       </View>
//       <View style={styles.infoContainer}>
//         <View style={[styles.infoContainer, { paddingVertical: 12 }]}>
//   <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>
//     Custom Link
//   </Text>
  
//   <Text
//     style={{
//       fontSize: 14,
//       color: '#007AFF',
//       textDecorationLine: 'underline',
//       marginBottom: 10,
//     }}
//     numberOfLines={1}
//   >
//     {`${API_ROUTE_IMAGE}/${profileData.slug}`}
//   </Text>

//   <EditableField
//     label="Custom Link"
//     icon="link"
//     value={profileData.slug}
  
//   />
// </View>
//       </View>


      
//       <Modal visible={editModalVisible} transparent animationType="slide">
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={styles.modalTitle}>Edit {currentField}</Text>
//       {currentField === 'categories' ? (
//         <View style={styles.dropdownWrapper}>
//           <Picker style={{color:'#555'}} selectedValue={selectedCategoryId} onValueChange={(value) => setSelectedCategoryId(value)}>
//             <Picker.Item label="Select a category..." value={null} />
//             {categories.map((cat) => (
//               <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
//             ))}
//           </Picker>
//         </View>
//       ) : currentField === 'website' ? (
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <Text style={{ fontSize: 16,color:'#333' }}>https://</Text>
//           <TextInput
//             value={fieldValue.replace('https://', '')}
//             onChangeText={(text) => setFieldValue(`https://${text}`)}
//             placeholder="yourwebsite.com"
//             style={[styles.modalInput, { flex: 1 }]}
//             autoCapitalize="none"
//             placeholderTextColor='#777'
//             autoCorrect={false}
//             keyboardType="url"
//           />
//         </View>
//       ) : (
//         <TextInput
//           value={fieldValue}
//           onChangeText={setFieldValue}
//           placeholder={`Enter ${currentField}`}
//           style={styles.modalInput}
//           placeholderTextColor='#777'
//           multiline={currentField === 'description' || currentField === 'about'}
//         />
//       )}
//       <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//         <Text style={styles.saveButtonText}>Save</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => setEditModalVisible(false)}>
//         <Text style={{ color: '#f44', textAlign: 'center', marginTop: 10 }}>Cancel</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>
// <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={closeImageModal}>
//     <View style={styles.modalOverlay}>
//       <View style={styles.imageModalContent}>
//         <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
//           <Icon name="close" size={30} color="#333" />
//         </TouchableOpacity>
//         {selectedItem && (
//           <>
//             <Image
//               source={{ uri: `${API_ROUTE_IMAGE}${selectedItem.image}` }}
//               style={styles.modalImage}
//               resizeMode="contain"
//             />
//             <Text style={styles.modalTitle}>{selectedItem.name}</Text>
//             <Text style={styles.modalDescription}>{selectedItem.description}</Text>
//             <Text style={styles.modalPrice}>₦{parseFloat(selectedItem.price).toFixed(2)}</Text>
//           </>
//         )}
//       </View>
//     </View>
//     </Modal>

//       {/* Business Hours Modal */}
//       <Modal visible={showBHModal} animationType="slide">
//         <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Text style={{ fontSize: 18, fontWeight: '600' }}>Add Business Hours</Text>
//             <TouchableOpacity onPress={() => setShowBHModal(false)}>
//               <Icon name="close" size={24} />
//             </TouchableOpacity>
//           </View>

//           <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Select Day</Text>
//           <Picker style={{color:'#555'}} selectedValue={selectedDay} onValueChange={setSelectedDay}>
//             {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
//               <Picker.Item label={day} value={day} key={day} />
//             ))}
//           </Picker>

//           <TouchableOpacity onPress={() => setShowOpenPicker(true)} style={{ marginTop: 10 }}>
//             <Text>Open Time: {openTime.toTimeString().slice(0, 5)}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setShowClosePicker(true)} style={{ marginTop: 10 }}>
//             <Text>Close Time: {closeTime.toTimeString().slice(0, 5)}</Text>
//           </TouchableOpacity>

//           {showOpenPicker && (
//             <DateTimePicker
//               mode="time"
//               value={openTime}
//               onChange={(event, date) => {
//                 setShowOpenPicker(false);
//                 if (date) setOpenTime(date);
//               }}
//             />
//           )}

//           {showClosePicker && (
//             <DateTimePicker
//               mode="time"
//               value={closeTime}
//               onChange={(event, date) => {
//                 setShowClosePicker(false);
//                 if (date) setCloseTime(date);
//               }}
//             />
//           )}

//           <TouchableOpacity onPress={handleAddHour} style={{ backgroundColor: '#1976D2', marginTop: 20, padding: 14, borderRadius: 6 }}>
//             <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Add Business Hour</Text>
//           </TouchableOpacity>

//           <Text style={{ marginTop: 30, fontSize: 16, fontWeight: 'bold' }}>Saved Hours</Text>
//           {businessHours.map((hour, idx) => (
//             <View key={idx} style={{ marginTop: 10, padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
//               <Text style={{ fontWeight: '500' }}>{hour.day}</Text>
//               <Text>{hour.open_time} - {hour.close_time}</Text>
//             </View>
//           ))}
//         </ScrollView>
//       </Modal>
//     </ScrollView>
//   );
// }

// const EditableField = ({ label, icon, value, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.fieldRow}>
//     <Icon name={icon} size={20} color="#555" style={{ width: 30 }} />
//     <View style={{ flex: 1 }}>
//       <Text style={styles.fieldLabel}>{label}</Text>
//       <Text style={styles.fieldText}>{value}</Text>
//     </View>
//     <Icon name="edit" size={18} color="#999" />
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', marginBottom: 30 },
//   header: {
//     paddingTop: 0,
//     paddingBottom: 0,
//     alignItems: 'center',
//     position: 'relative'
//   },
//   websiteInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingLeft: 12,
//     backgroundColor: '#f9f9f9',
//   },
//   websitePrefix: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   menuIcon: {
//     position: 'absolute',
//     top: 50,
//     left: 16,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     top: 40,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   imageModalContent: {
//   backgroundColor: '#fff',
//   marginHorizontal: 20,
//   borderRadius: 12,
//   padding: 20,
//   alignItems: 'center',
//   maxHeight: '80%',
// },
// modalImage: {
//   width: '100%',
//   height: 250,
//   borderRadius: 12,
//   marginBottom: 20,
//   backgroundColor: '#eee',
// },
// modalTitle: {
//   fontSize: 20,
//   fontWeight: 'bold',
//   marginBottom: 8,
//   textAlign: 'center',
// },
// modalDescription: {
//   fontSize: 14,
//   color: '#555',
//   marginBottom: 12,
//   textAlign: 'center',
// },
// modalPrice: {
//   fontSize: 18,
//   fontWeight: '600',
//   color: '#0a8',
// },
// closeButton: {
//   position: 'absolute',
//   top: 10,
//   right: 10,
//   zIndex: 10,
// },

//   editAvatarIcon: {
//     position: 'absolute',
//     right: -20,
//     bottom: 0,
//     backgroundColor: '#367BF5',
//     padding: 6,
//     borderRadius: 20,
//   },
//   imageText: { color: '#777', fontSize: 12, paddingTop: 4 },
//   imagePicker: {
//     height: 120,
//     width: 120,
//     borderRadius: 60,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     overflow: 'hidden',
//     marginTop: 40,
//   },
//   infoContainer: {
//     marginTop: 20,
//     paddingHorizontal: 16,
//   },
//   fieldRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     paddingVertical: 12,
//   },
//   fieldLabel: {
//     fontSize: 12,
//     color: '#999',
//   },
//   fieldText: {
//     fontSize: 15,
//     color: '#333',
//   },
//   productsHeader: {
//     marginTop: 30,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   productsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   manageText: {
//     color: '#367BF5',
//     fontSize: 14,
//   },
//   productsScroll: {
//     marginTop: 10,
//     paddingHorizontal: 16,
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 15,
//     color:'#555',
//     backgroundColor: '#f9f9f9',
//     minHeight: 50,
//   },
//   saveButton: {
//     backgroundColor: '#1976D2',
//     borderRadius: 25,
//     paddingVertical: 12,
//     marginTop: 16,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   dropdownWrapper: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
// });

// import React, { useState, useEffect, useCallback } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import {
//   View, Text, TextInput, Image, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Modal,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function BusinessProfileScreen({ navigation }) {
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [currentField, setCurrentField] = useState('');
//   const [fieldValue, setFieldValue] = useState('');
//   const [profileData, setProfileData] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [logo, setLogo] = useState(null);
//   const [catalogData, setCatalogData] = useState([]);
//   const [businessHours, setBusinessHours] = useState([]); 
//   const [selectedDay, setSelectedDay] = useState("Monday");
//   const [openTime, setOpenTime] = useState(new Date());
//   const [closeTime, setCloseTime] = useState(new Date());
//   const [showOpenPicker, setShowOpenPicker] = useState(false);
//   const [showClosePicker, setShowClosePicker] = useState(false);
//   const [showBHModal, setShowBHModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null); 
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [loadingHours, setLoadingHours] = useState(false);

//   const fetchBusinessHours = async () => {
//     try {
//       setLoadingHours(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/business-hours/${profileData.id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         // Ensure businessHours is always an array
//         const hoursData = response.data;
//         if (Array.isArray(hoursData)) {
//           setBusinessHours(hoursData);
//         } else if (hoursData && typeof hoursData === 'object') {
//           // If it's an object, convert to array
//           setBusinessHours([hoursData]);
//         } else {
//           setBusinessHours([]);
//         }
//       } else {
//         setBusinessHours([]);
//       }
//     } catch (error) {
//       console.error('Error fetching business hours:', error);
//       setBusinessHours([]); // Set to empty array on error
//     } finally {
//       setLoadingHours(false);
//     }
//   };

//   const openImageModal = (item) => {
//     setSelectedItem(item);
//     setImageModalVisible(true);
//   };

//   const closeImageModal = () => {
//     setSelectedItem(null);
//     setImageModalVisible(false);
//   };

//   const handleAddHour = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const body = {
//         profile: profileData.id,
//         day: selectedDay,
//         open_time: openTime.toTimeString().slice(0, 5),
//         close_time: closeTime.toTimeString().slice(0, 5),
//       };

//       const response = await axios.post(`${API_ROUTE}/business-hours/`, body, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200 || response.status === 201) {
//         setBusinessHours(prev => [...prev, response.data]);
//         // Reset time pickers
//         setOpenTime(new Date());
//         setCloseTime(new Date());
//         setSelectedDay("Monday");
//       }
//     } catch (error) {
//       console.error('Error adding business hour:', error.response?.data || error.message);
//     }
//   };

//   const handleDeleteHour = async (hourId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.delete(`${API_ROUTE}/business-hours/${hourId}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       setBusinessHours(prev => prev.filter(hour => hour.id !== hourId));
//     } catch (error) {
//       console.error('Error deleting business hour:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (profileData.id) {
//       fetchBusinessHours();
//     }
//   }, [profileData.id]); // Added dependency on profileData.id

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         const profile = Array.isArray(response.data) ? response.data[0] : response.data;
//         console.log('profile data', response.data);
//         setProfileData(profile);
//         if (profile.logo) {
//           setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
//         }
//         // Set initial category if exists
//         if (profile.categories?.[0]?.id) {
//           setSelectedCategoryId(profile.categories[0].id);
//         }
//       }
//     } catch (err) {
//       console.error('Failed to load profile', err);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/categories/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (response.status === 200) {
//         setCategories(response.data);
//       }
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//     }
//   };

//   const handleOpenModal = (fieldKey) => {
//     setCurrentField(fieldKey);
//     if (fieldKey === 'categories') {
//       const firstCategoryId = profileData.categories?.[0]?.id || null;
//       setSelectedCategoryId(firstCategoryId);
//     } else if (fieldKey === 'website') {
//       const currentValue = profileData[fieldKey] || '';
//       setFieldValue(currentValue.startsWith('http') ? currentValue : `https://${currentValue}`);
//     } else {
//       setFieldValue(profileData[fieldKey] || '');
//     }
//     setEditModalVisible(true);
//   };

//   const handleSave = async () => {
//     try {
      
//       if (currentField === 'website') {
//         const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
//         if (!urlPattern.test(fieldValue)) {
//           alert('Please enter a valid website URL (e.g., https://example.com)');
//           return;
//         }
//       }

//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();

//       if (currentField === 'categories') {
//         formData.append('category_ids', selectedCategoryId);
//       } else {
//         formData.append(currentField, fieldValue);
//       }

//       const response = await fetch(`${API_ROUTE}/profiles/`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setProfileData((prev) => ({
//           ...prev,
//           ...(currentField === 'categories'
//             ? { categories: categories.filter(c => c.id === selectedCategoryId) }
//             : { [currentField]: data[currentField] }),
//         }));
//         setEditModalVisible(false);
//       } else {
//         console.error('Error updating profile:', data);
//       }
//     } catch (err) {
//       console.error('Network error updating profile:', err);
//     }
//   };

//   const pickImage = () => {
//     launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
//       if (response.assets) {
//         const image = response.assets[0];
//         const pickedLogo = {
//           uri: image.uri,
//           type: image.type,
//           name: image.fileName || 'logo.jpg',
//         };
//         setLogo(pickedLogo);
//         uploadLogo(pickedLogo);
//       }
//     });
//   };

//   const uploadLogo = async (image) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
//       formData.append('image', {
//         uri: image.uri,
//         type: image.type,
//         name: image.name,
//       });

//       const response = await fetch(`${API_ROUTE}/profiles/`, {
//         method: 'PATCH',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: formData,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         console.error('Error uploading logo:', error);
//       } else {
//         fetchProfile();
//       }
//     } catch (err) {
//       console.error('Error uploading logo', err);
//     }
//   };

//   const fetchCatalogData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');

//       if (!token) {
//         console.log('No token found');
//         return;
//       }
//       const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         console.log('Catalog data fetched successfully:', response.data);
//         setCatalogData(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching catalog:', error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchCatalogData();
//     }, [])
//   );

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour % 12 || 12;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };

//   return (
//     <SafeAreaView style={{flex:1}}>
//     <ScrollView style={styles.container}>
          
//                     <StatusBar
//                         barStyle={Platform.OS === 'android'? 'light-content':'dark-content'}
//                         translucent={Platform.OS === 'android'}
//                         backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
//                       />
//           <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
//             <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.goBack()}>
//               <Icon name="arrow-back" size={24} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
//               {logo ? (
//                 <Image source={logo} style={styles.avatar} />
//               ) : profileData?.image ? (
//                 <Image source={{ uri: `${API_ROUTE_IMAGE}${profileData.image}` }} style={styles.avatar} />
//               ) : (
//                 <View style={styles.imagePicker}>
//                   <Icon name="add-a-photo" size={40} color="#777" />
//                   <Text style={styles.imageText}>Add Logo</Text>
//                 </View>
//               )}
//               <View style={styles.editAvatarIcon}>
//                 <Icon name="edit" size={16} color="#fff" />
//               </View>
//             </TouchableOpacity>
//           </LinearGradient>

//           <View style={styles.infoContainer}>
//             <EditableField label="Name" icon="person" value={profileData.name} onPress={() => handleOpenModal('name')} />
//             <EditableField
//               label="Category"
//               icon="palette"
//               value={profileData.categories?.map(cat => cat.name).join(', ') || '—'}
//               onPress={() => handleOpenModal('categories')}
//             />
//             <EditableField label="Description" icon="short-text" value={profileData.description} onPress={() => handleOpenModal('description')} />

//             {/* Business Hours Summary */}
//             {/* <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Business Hours</Text>
//               <TouchableOpacity onPress={() => setShowBHModal(true)}>
//                 <Text style={styles.manageText}>Manage</Text>
//               </TouchableOpacity>
//             </View> */}
            
//             {/* {loadingHours ? (
//               <Text style={styles.loadingText}>Loading hours...</Text>
//             ) : businessHours && businessHours.length > 0 ? (
//               businessHours.map((hour, idx) => (
//                 <View key={hour.id || idx} style={styles.hourItem}>
//                   <Text style={styles.hourDay}>{hour.day}</Text>
//                   <Text style={styles.hourTime}>{formatTime(hour.open_time)} - {formatTime(hour.close_time)}</Text>
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.emptyText}>No business hours set</Text>
//             )} */}

//             <EditableField label="Address" icon="location-on" value={profileData.address} onPress={() => handleOpenModal('address')} />
//             <EditableField label="Email" icon="email" value={profileData.email} onPress={() => handleOpenModal('email')} />
//             <EditableField label="Website" icon="language" value={profileData.website} onPress={() => handleOpenModal('website')} />
//           </View>

//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Products</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('CreateCatalog')}>
//               <Text style={styles.manageText}>Manage</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
//             {catalogData.length === 0 ? (
//               <View style={styles.emptyCatalog}>
//                 <Text style={styles.emptyText}>You have not created any products yet</Text>
//               </View>
//             ) : (
//               catalogData.map((item, index) => (
//                 <TouchableOpacity key={item.id || index} onPress={() => openImageModal(item)}>
//                   <View style={styles.catalogCard}>
//                     <Image
//                       source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
//                       style={styles.productImage}
//                       resizeMode="cover"
//                     />
//                   </View>
//                 </TouchableOpacity>
//               ))
//             )}
//           </ScrollView>

//           <View style={styles.infoContainer}>
//             <EditableField label="About" icon="info" value={profileData.about} onPress={() => handleOpenModal('about')} />
//             <EditableField label="Phone" icon="phone" value={profileData.phone} onPress={() => handleOpenModal('phone')} />
//           </View>
          
//           <View style={styles.infoContainer}>
//             <View style={styles.customLinkSection}>
//               <Text style={styles.sectionTitle}>Custom Link</Text>
//               <Text style={styles.customLinkText}>
//                 {profileData.slug ? `${API_ROUTE_IMAGE}/${profileData.slug}` : 'No custom link set'}
//               </Text>
//               <EditableField
//                 label="Custom Link Slug"
//                 icon="link"
//                 value={profileData.slug || ''}
//                 onPress={() => handleOpenModal('slug')}
//               />
//             </View>
//           </View>

//           <Modal visible={editModalVisible} transparent animationType="slide">
//             <View style={styles.modalOverlay}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Edit {currentField}</Text>
//                 {currentField === 'categories' ? (
//                   <View style={styles.dropdownWrapper}>
//                     <Picker style={{color:'#555'}} selectedValue={selectedCategoryId} onValueChange={(value) => setSelectedCategoryId(value)}>
//                       <Picker.Item label="Select a category..." value={null} />
//                       {categories.map((cat) => (
//                         <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
//                       ))}
//                     </Picker>
//                   </View>
//                 ) : currentField === 'website' ? (
//                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Text style={{ fontSize: 16,color:'#333' }}>https://</Text>
//                     <TextInput
//                       value={fieldValue.replace('https://', '')}
//                       onChangeText={(text) => setFieldValue(`https://${text}`)}
//                       placeholder="yourwebsite.com"
//                       style={[styles.modalInput, { flex: 1 }]}
//                       autoCapitalize="none"
//                       placeholderTextColor='#777'
//                       autoCorrect={false}
//                       keyboardType="url"
//                     />
//                   </View>
//                 ) : (
//                   <TextInput
//                     value={fieldValue}
//                     onChangeText={setFieldValue}
//                     placeholder={`Enter ${currentField}`}
//                     style={styles.modalInput}
//                     placeholderTextColor='#777'
//                     multiline={currentField === 'description' || currentField === 'about'}
//                   />
//                 )}
//                 <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//                   <Text style={styles.saveButtonText}>Save</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setEditModalVisible(false)}>
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
          
//           <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={closeImageModal}>
//             <View style={styles.modalOverlay}>
//               <View style={styles.imageModalContent}>
//                 <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
//                   <Icon name="close" size={30} color="#333" />
//                 </TouchableOpacity>
//                 {selectedItem && (
//                   <>
//                     <Image
//                       source={{ uri: `${API_ROUTE_IMAGE}${selectedItem.image}` }}
//                       style={styles.modalImage}
//                       resizeMode="contain"
//                     />
//                     <Text style={styles.modalTitle}>{selectedItem.name}</Text>
//                     <Text style={styles.modalDescription}>{selectedItem.description}</Text>
//                     <Text style={styles.modalPrice}>₦{parseFloat(selectedItem.price).toFixed(2)}</Text>
//                   </>
//                 )}
//               </View>
//             </View>
//           </Modal>

//           {/* Business Hours Modal */}
//           <Modal visible={showBHModal} animationType="slide">
//             <SafeAreaView style={{flex:1}}>
//                 <View style={styles.bhModalContainer}>
//               <View style={styles.bhModalHeader}>
//                 <Text style={styles.bhModalTitle}>Business Hours</Text>
//                 <TouchableOpacity onPress={() => setShowBHModal(false)}>
//                   <Icon name="close" size={24} color="#333" />
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.bhModalContent}>
//                 <View style={styles.bhFormSection}>
//                   <Text style={styles.bhFormTitle}>Add New Hours</Text>
                  
//                   <Text style={styles.bhLabel}>Select Day</Text>
//                   <View style={styles.pickerContainer}>
//                     <Picker selectedValue={selectedDay} onValueChange={setSelectedDay}>
//                       {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
//                         <Picker.Item label={day} value={day} key={day} />
//                       ))}
//                     </Picker>
//                   </View>

//                   <View style={styles.timePickerRow}>
//                     <View style={styles.timePickerColumn}>
//                       <Text style={styles.bhLabel}>Open Time</Text>
//                       <TouchableOpacity 
//                         style={styles.timeButton}
//                         onPress={() => setShowOpenPicker(true)}
//                       >
//                         <Icon name="access-time" size={20} color="#1976D2" />
//                         <Text style={styles.timeButtonText}>{openTime.toTimeString().slice(0, 5)}</Text>
//                       </TouchableOpacity>
//                     </View>

//                     <View style={styles.timePickerColumn}>
//                       <Text style={styles.bhLabel}>Close Time</Text>
//                       <TouchableOpacity 
//                         style={styles.timeButton}
//                         onPress={() => setShowClosePicker(true)}
//                       >
//                         <Icon name="access-time" size={20} color="#1976D2" />
//                         <Text style={styles.timeButtonText}>{closeTime.toTimeString().slice(0, 5)}</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>

//                   {showOpenPicker && (
//                     <DateTimePicker
//                       mode="time"
//                       value={openTime}
//                       onChange={(event, date) => {
//                         setShowOpenPicker(false);
//                         if (date) setOpenTime(date);
//                       }}
//                     />
//                   )}

//                   {showClosePicker && (
//                     <DateTimePicker
//                       mode="time"
//                       value={closeTime}
//                       onChange={(event, date) => {
//                         setShowClosePicker(false);
//                         if (date) setCloseTime(date);
//                       }}
//                     />
//                   )}

//                   <TouchableOpacity style={styles.addButton} onPress={handleAddHour}>
//                     <Icon name="add" size={20} color="#fff" />
//                     <Text style={styles.addButtonText}>Add Hours</Text>
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.savedHoursSection}>
//                   <Text style={styles.savedHoursTitle}>Current Hours</Text>
//                   {businessHours && businessHours.length > 0 ? (
//                     businessHours.map((hour) => (
//                       <View key={hour.id} style={styles.savedHourItem}>
//                         <View style={styles.savedHourInfo}>
//                           <Text style={styles.savedHourDay}>{hour.day}</Text>
//                           <Text style={styles.savedHourTime}>
//                             {formatTime(hour.open_time)} - {formatTime(hour.close_time)}
//                           </Text>
//                         </View>
//                         <TouchableOpacity 
//                           style={styles.deleteButton}
//                           onPress={() => handleDeleteHour(hour.id)}
//                         >
//                           <Icon name="delete" size={20} color="#f44336" />
//                         </TouchableOpacity>
//                       </View>
//                     ))
//                   ) : (
//                     <Text style={styles.emptyHoursText}>No business hours set</Text>
//                   )}
//                 </View>
//               </ScrollView>
//             </View>

//             </SafeAreaView>
            
//           </Modal>
//         </ScrollView>
//     </SafeAreaView>
   
//   );
// }

// const EditableField = ({ label, icon, value, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.fieldRow}>
//     <Icon name={icon} size={20} color="#555" style={{ width: 30 }} />
//     <View style={{ flex: 1 }}>
//       <Text style={styles.fieldLabel}>{label}</Text>
//       <Text style={styles.fieldText}>{value || '—'}</Text>
//     </View>
//     <Icon name="edit" size={18} color="#999" />
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', marginBottom: 30 },
//   header: {
//     paddingTop: 0,
//     paddingBottom: 0,
//     alignItems: 'center',
//     position: 'relative'
//   },
//   menuIcon: {
//     position: 'absolute',
//     top: 50,
//     left: 16,
//     zIndex: 10,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     marginTop: 40,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#fff',
//   },
//   editAvatarIcon: {
//     position: 'absolute',
//     right: -20,
//     bottom: 0,
//     backgroundColor: '#367BF5',
//     padding: 6,
//     borderRadius: 20,
//   },
//   imagePicker: {
//     height: 100,
//     width: 100,
//     borderRadius: 50,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   imageText: { color: '#777', fontSize: 12, paddingTop: 4 },
  
//   infoContainer: {
//     marginTop: 20,
//     paddingHorizontal: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 20,
//     paddingHorizontal: 16,
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   manageText: {
//     color: '#367BF5',
//     fontSize: 14,
//     fontWeight: '600',
//   },
  
//   fieldRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     paddingVertical: 12,
//   },
//   fieldLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 2,
//   },
//   fieldText: {
//     fontSize: 15,
//     color: '#333',
//   },
  
//   hourItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   hourDay: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
//   hourTime: {
//     fontSize: 14,
//     color: '#666',
//   },
  
//   productsScroll: {
//     marginTop: 10,
//     paddingHorizontal: 16,
//   },
//   catalogCard: {
//     marginRight: 12,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//   },
//   emptyCatalog: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#777',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   loadingText: {
//     color: '#666',
//     fontSize: 14,
//     textAlign: 'center',
//     padding: 10,
//   },
  
//   customLinkSection: {
//     paddingVertical: 12,
//   },
//   customLinkText: {
//     fontSize: 14,
//     color: '#007AFF',
//     textDecorationLine: 'underline',
//     marginBottom: 10,
//   },
  
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 15,
//     color:'#555',
//     backgroundColor: '#f9f9f9',
//     minHeight: 50,
//   },
//   saveButton: {
//     backgroundColor: '#1976D2',
//     borderRadius: 25,
//     paddingVertical: 12,
//     marginTop: 16,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButtonText: {
//     color: '#f44',
//     textAlign: 'center',
//     marginTop: 10,
//     fontSize: 14,
//   },
//   dropdownWrapper: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
  
//   imageModalContent: {
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     maxHeight: '80%',
//   },
//   modalImage: {
//     width: '100%',
//     height: 250,
//     borderRadius: 12,
//     marginBottom: 20,
//     backgroundColor: '#eee',
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   modalPrice: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#0a8',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 10,
//   },
  
//   // Business Hours Modal Styles
//   bhModalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   bhModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   bhModalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   bhModalContent: {
//     padding: 20,
//   },
//   bhFormSection: {
//     marginBottom: 30,
//   },
//   bhFormTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#333',
//   },
//   bhLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//     color: '#555',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   timePickerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   timePickerColumn: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   timeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   timeButtonText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#333',
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1976D2',
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   savedHoursSection: {
//     marginTop: 20,
//   },
//   savedHoursTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#333',
//   },
//   savedHourItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   savedHourInfo: {
//     flex: 1,
//   },
//   savedHourDay: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   savedHourTime: {
//     fontSize: 14,
//     color: '#666',
//   },
//   deleteButton: {
//     padding: 8,
//   },
//   emptyHoursText: {
//     textAlign: 'center',
//     color: '#777',
//     fontSize: 14,
//     padding: 20,
//   },
// });

import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, TextInput, Image, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Modal, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext'; 

export default function BusinessProfileScreen({ navigation }) {
  const { colors, isDark } = useTheme(); 
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [profileData, setProfileData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [logo, setLogo] = useState(null);
  const [catalogData, setCatalogData] = useState([]);
  const [businessHours, setBusinessHours] = useState([]); 
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);
  const [showBHModal, setShowBHModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loadingHours, setLoadingHours] = useState(false);

  const styles = createStyles(colors, isDark); 

  const fetchBusinessHours = async () => {
    try {
      setLoadingHours(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/business-hours/${profileData.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const hoursData = response.data;
        if (Array.isArray(hoursData)) {
          setBusinessHours(hoursData);
        } else if (hoursData && typeof hoursData === 'object') {
          setBusinessHours([hoursData]);
        } else {
          setBusinessHours([]);
        }
      } else {
        setBusinessHours([]);
      }
    } catch (error) {
      console.error('Error fetching business hours:', error);
      setBusinessHours([]);
    } finally {
      setLoadingHours(false);
    }
  };

  const openImageModal = (item) => {
    setSelectedItem(item);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedItem(null);
    setImageModalVisible(false);
  };

  const handleAddHour = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const body = {
        profile: profileData.id,
        day: selectedDay,
        open_time: openTime.toTimeString().slice(0, 5),
        close_time: closeTime.toTimeString().slice(0, 5),
      };

      const response = await axios.post(`${API_ROUTE}/business-hours/`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setBusinessHours(prev => [...prev, response.data]);
        setOpenTime(new Date());
        setCloseTime(new Date());
        setSelectedDay("Monday");
      }
    } catch (error) {
      console.error('Error adding business hour:', error.response?.data || error.message);
    }
  };

  const handleDeleteHour = async (hourId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${API_ROUTE}/business-hours/${hourId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setBusinessHours(prev => prev.filter(hour => hour.id !== hourId));
    } catch (error) {
      console.error('Error deleting business hour:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (profileData.id) {
      fetchBusinessHours();
    }
  }, [profileData.id]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('profile data', response.data);
        setProfileData(profile);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
        }
        if (profile.categories?.[0]?.id) {
          setSelectedCategoryId(profile.categories[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleOpenModal = (fieldKey) => {
    setCurrentField(fieldKey);
    if (fieldKey === 'categories') {
      const firstCategoryId = profileData.categories?.[0]?.id || null;
      setSelectedCategoryId(firstCategoryId);
    } else if (fieldKey === 'website') {
      const currentValue = profileData[fieldKey] || '';
      setFieldValue(currentValue.startsWith('http') ? currentValue : `https://${currentValue}`);
    } else {
      setFieldValue(profileData[fieldKey] || '');
    }
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (currentField === 'website') {
        const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlPattern.test(fieldValue)) {
          alert('Please enter a valid website URL (e.g., https://example.com)');
          return;
        }
      }

      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();

      if (currentField === 'categories') {
        formData.append('category_ids', selectedCategoryId);
      } else {
        formData.append(currentField, fieldValue);
      }

      const response = await fetch(`${API_ROUTE}/profiles/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData((prev) => ({
          ...prev,
          ...(currentField === 'categories'
            ? { categories: categories.filter(c => c.id === selectedCategoryId) }
            : { [currentField]: data[currentField] }),
        }));
        setEditModalVisible(false);
      } else {
        console.error('Error updating profile:', data);
      }
    } catch (err) {
      console.error('Network error updating profile:', err);
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.assets) {
        const image = response.assets[0];
        const pickedLogo = {
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'logo.jpg',
        };
        setLogo(pickedLogo);
        uploadLogo(pickedLogo);
      }
    });
  };

  const uploadLogo = async (image) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });

      const response = await fetch(`${API_ROUTE}/profiles/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error uploading logo:', error);
      } else {
        fetchProfile();
      }
    } catch (err) {
      console.error('Error uploading logo', err);
    }
  };

  const fetchCatalogData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        console.log('No token found');
        return;
      }
      const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Catalog data fetched successfully:', response.data);
        setCatalogData(response.data);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCatalogData();
    }, [])
  );

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const EditableField = ({ label, icon, value, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.fieldRow}>
      <Icon name={icon} size={20} color={isDark ? '#9ca3af' : '#555'} style={{ width: 30 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldText}>{value || '—'}</Text>
      </View>
      <Icon name="edit" size={18} color={isDark ? '#6b7280' : '#999'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.background}}>
      <ScrollView style={styles.container}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
        />
        
        <LinearGradient colors={[colors.primary, colors.primary]} style={styles.header}>
          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {logo ? (
              <Image source={logo} style={styles.avatar} />
            ) : profileData?.image ? (
              <Image source={{ uri: `${API_ROUTE_IMAGE}${profileData.image}` }} style={styles.avatar} />
            ) : (
              <View style={styles.imagePicker}>
                <Icon name="add-a-photo" size={40} color={isDark ? '#9ca3af' : '#777'} />
                <Text style={styles.imageText}>Add Logo</Text>
              </View>
            )}
            <View style={styles.editAvatarIcon}>
              <Icon name="edit" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.infoContainer}>
          <EditableField label="Name" icon="person" value={profileData.name} onPress={() => handleOpenModal('name')} />
          <EditableField
            label="Category"
            icon="palette"
            value={profileData.categories?.map(cat => cat.name).join(', ') || '—'}
            onPress={() => handleOpenModal('categories')}
          />
          <EditableField label="Description" icon="short-text" value={profileData.description} onPress={() => handleOpenModal('description')} />

          <EditableField label="Address" icon="location-on" value={profileData.address} onPress={() => handleOpenModal('address')} />
          <EditableField label="Email" icon="email" value={profileData.email} onPress={() => handleOpenModal('email')} />
          <EditableField label="Website" icon="language" value={profileData.website} onPress={() => handleOpenModal('website')} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateCatalog')}>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
          {catalogData.length === 0 ? (
            <View style={styles.emptyCatalog}>
              <Text style={styles.emptyText}>You have not created any products yet</Text>
            </View>
          ) : (
            catalogData.map((item, index) => (
              <TouchableOpacity key={item.id || index} onPress={() => openImageModal(item)}>
                <View style={styles.catalogCard}>
                  <Image
                    source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={styles.infoContainer}>
          <EditableField label="About" icon="info" value={profileData.about} onPress={() => handleOpenModal('about')} />
          <EditableField label="Phone" icon="phone" value={profileData.phone} onPress={() => handleOpenModal('phone')} />
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.customLinkSection}>
            <Text style={styles.sectionTitle}>Custom Link</Text>
            <Text style={styles.customLinkText}>
              {profileData.slug ? `${API_ROUTE_IMAGE}/${profileData.slug}` : 'No custom link set'}
            </Text>
            <EditableField
              label="Custom Link Slug"
              icon="link"
              value={profileData.slug || ''}
              onPress={() => handleOpenModal('slug')}
            />
          </View>
        </View>

        <Modal visible={editModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit {currentField}</Text>
              {currentField === 'categories' ? (
                <View style={styles.dropdownWrapper}>
                  <Picker 
                    style={{color: isDark ? colors.text : '#555'}} 
                    selectedValue={selectedCategoryId} 
                    onValueChange={(value) => setSelectedCategoryId(value)}
                  >
                    <Picker.Item label="Select a category..." value={null} />
                    {categories.map((cat) => (
                      <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
                    ))}
                  </Picker>
                </View>
              ) : currentField === 'website' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: colors.text }}>https://</Text>
                  <TextInput
                    value={fieldValue.replace('https://', '')}
                    onChangeText={(text) => setFieldValue(`https://${text}`)}
                    placeholder="yourwebsite.com"
                    style={[styles.modalInput, { flex: 1 }]}
                    autoCapitalize="none"
                    placeholderTextColor={colors.placeholder}
                    autoCorrect={false}
                    keyboardType="url"
                  />
                </View>
              ) : (
                <TextInput
                  value={fieldValue}
                  onChangeText={setFieldValue}
                  placeholder={`Enter ${currentField}`}
                  style={styles.modalInput}
                  placeholderTextColor={colors.placeholder}
                  multiline={currentField === 'description' || currentField === 'about'}
                />
              )}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={closeImageModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.imageModalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
                <Icon name="close" size={30} color={colors.text} />
              </TouchableOpacity>
              {selectedItem && (
                <>
                  <Image
                    source={{ uri: `${API_ROUTE_IMAGE}${selectedItem.image}` }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                  <Text style={styles.modalPrice}>₦{parseFloat(selectedItem.price).toFixed(2)}</Text>
                </>
              )}
            </View>
          </View>
        </Modal>

        <Modal visible={showBHModal} animationType="slide">
          <SafeAreaView style={{flex:1, backgroundColor: colors.background}}>
            <View style={styles.bhModalContainer}>
              <View style={styles.bhModalHeader}>
                <Text style={styles.bhModalTitle}>Business Hours</Text>
                <TouchableOpacity onPress={() => setShowBHModal(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.bhModalContent}>
                <View style={styles.bhFormSection}>
                  <Text style={styles.bhFormTitle}>Add New Hours</Text>
                  
                  <Text style={styles.bhLabel}>Select Day</Text>
                  <View style={styles.pickerContainer}>
                    <Picker 
                      selectedValue={selectedDay} 
                      onValueChange={setSelectedDay}
                      style={{color: colors.text}}
                    >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <Picker.Item label={day} value={day} key={day} />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.timePickerRow}>
                    <View style={styles.timePickerColumn}>
                      <Text style={styles.bhLabel}>Open Time</Text>
                      <TouchableOpacity 
                        style={styles.timeButton}
                        onPress={() => setShowOpenPicker(true)}
                      >
                        <Icon name="access-time" size={20} color={colors.primary} />
                        <Text style={styles.timeButtonText}>{openTime.toTimeString().slice(0, 5)}</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.timePickerColumn}>
                      <Text style={styles.bhLabel}>Close Time</Text>
                      <TouchableOpacity 
                        style={styles.timeButton}
                        onPress={() => setShowClosePicker(true)}
                      >
                        <Icon name="access-time" size={20} color={colors.primary} />
                        <Text style={styles.timeButtonText}>{closeTime.toTimeString().slice(0, 5)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {showOpenPicker && (
                    <DateTimePicker
                      mode="time"
                      value={openTime}
                      onChange={(event, date) => {
                        setShowOpenPicker(false);
                        if (date) setOpenTime(date);
                      }}
                    />
                  )}

                  {showClosePicker && (
                    <DateTimePicker
                      mode="time"
                      value={closeTime}
                      onChange={(event, date) => {
                        setShowClosePicker(false);
                        if (date) setCloseTime(date);
                      }}
                    />
                  )}

                  <TouchableOpacity style={styles.addButton} onPress={handleAddHour}>
                    <Icon name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Hours</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.savedHoursSection}>
                  <Text style={styles.savedHoursTitle}>Current Hours</Text>
                  {businessHours && businessHours.length > 0 ? (
                    businessHours.map((hour) => (
                      <View key={hour.id} style={styles.savedHourItem}>
                        <View style={styles.savedHourInfo}>
                          <Text style={styles.savedHourDay}>{hour.day}</Text>
                          <Text style={styles.savedHourTime}>
                            {formatTime(hour.open_time)} - {formatTime(hour.close_time)}
                          </Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => handleDeleteHour(hour.id)}
                        >
                          <Icon name="delete" size={20} color="#f44336" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyHoursText}>No business hours set</Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors, isDark) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    marginBottom: 30 
  },
  header: {
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'center',
    position: 'relative'
  },
  menuIcon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    zIndex: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editAvatarIcon: {
    position: 'absolute',
    right: -20,
    bottom: 0,
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 20,
  },
  imagePicker: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: isDark ? colors.surface : '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  imageText: { 
    color: isDark ? '#9ca3af' : '#777', 
    fontSize: 12, 
    paddingTop: 4 
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  manageText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  fieldLabel: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#999',
    marginBottom: 2,
  },
  fieldText: {
    fontSize: 15,
    color: colors.text,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  hourDay: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  hourTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  productsScroll: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  catalogCard: {
    marginRight: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  emptyCatalog: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
  },
  customLinkSection: {
    paddingVertical: 12,
  },
  customLinkText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.inputBackground,
    minHeight: 50,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageModalContent: {
    backgroundColor: colors.background,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: colors.surface,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a8',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  bhModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bhModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  bhModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  bhModalContent: {
    padding: 20,
  },
  bhFormSection: {
    marginBottom: 30,
  },
  bhFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  bhLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.textSecondary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.buttonSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  savedHoursSection: {
    marginTop: 20,
  },
  savedHoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  savedHourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  savedHourInfo: {
    flex: 1,
  },
  savedHourDay: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  savedHourTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  emptyHoursText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    padding: 20,
  },
});