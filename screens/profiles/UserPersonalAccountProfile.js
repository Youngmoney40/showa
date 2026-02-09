


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   FlatList,
//   Modal,
//   Animated,
//   Dimensions,
//   Pressable,
//   Alert,
//   ActivityIndicator,
//   StatusBar,
//   TextInput,
//   ImageBackground,
//   Platform,
//   LogBox
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Iconn from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
// import Video from 'react-native-video';
// import { useTheme } from '../../src/context/ThemeContext';

// const { height, width } = Dimensions.get('window');

// // Ignore specific warnings
// LogBox.ignoreLogs(['Warning: ...']);

// const UserProfile = ({ route }) => {
//   const { colors, theme } = useTheme(); 
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState('marketplace');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [playingVideo, setPlayingVideo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isOwnProfile, setIsOwnProfile] = useState(true);
//   const [productModalVisible, setProductModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
//   const slideAnim = useRef(new Animated.Value(height)).current;
//   const productSlideAnim = useRef(new Animated.Value(height)).current;
//   const videoRefs = useRef({});

//   const [userData, setUserData] = useState({});
//   const [userProfileImage, setUserProfileImage] = useState('');
//   const [businessProfile, setBusinessProfile] = useState(null);
//   const [businessHours, setBusinessHours] = useState([]);
//   const [catalogData, setCatalogData] = useState([]);
//   const [showBusinessInfo, setShowBusinessInfo] = useState(false);
//   const [businessLoading, setBusinessLoading] = useState(false);

//   const [followStats, setFollowStats] = useState({
//     followers_count: 0,
//     following_count: 0,
//     followers: [],
//     following: []
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({
//     name: '',
//     email: '',
//     country: '',
//     active_mode: 'personal'
//   });
//   const [profileLoading, setProfileLoading] = useState(false);

//   const styles = createStyles(colors);
//   useEffect(() => {
//     console.log('API_ROUTE_IMAGE:', API_ROUTE_IMAGE);
//     console.log('API_ROUTE:', API_ROUTE);
//   }, []);
// const getImageUrl = (imagePath) => {
//   console.log('getImageUrl input:', imagePath);
  
//   if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
//     console.log('No image path provided');
//     return null;
//   }
  
//   if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
//     let url = imagePath;
    
//     if (url.includes('showa.essential.com.ngmedia')) {
//       url = url.replace('showa.essential.com.ngmedia', 'showa.essential.com.ng/media');
//     }
    
//     if (url.startsWith('http://')) {
//       url = url.replace('http://', 'https://');
//     }
    
//     if (url.includes('showa.essential.com.ng/') && 
//         !url.includes('showa.essential.com.ng/media/') &&
//         (url.includes('profile_pics') || 
//          url.includes('catalog_images') || 
//          url.includes('marketplace_images') ||
//          url.includes('post_images'))) {
//       url = url.replace('showa.essential.com.ng/', 'showa.essential.com.ng/media/');
//     }
    
//     console.log('Processed full URL:', url);
//     return url;
//   }
  
//   // Handle object with image/url property
//   if (typeof imagePath === 'object') {
//     if (imagePath.image) {
//       return getImageUrl(imagePath.image);
//     }
//     if (imagePath.url) {
//       return getImageUrl(imagePath.url);
//     }
//     if (imagePath.media) {
//       return getImageUrl(imagePath.media);
//     }
//     console.log('Unhandled image object:', imagePath);
//     return null;
//   }
  
//   // Handle string path
//   if (typeof imagePath === 'string') {
//     let cleanPath = imagePath;
  
//     if (cleanPath.startsWith('/')) {
//       cleanPath = cleanPath.substring(1);
//     }
  
//     if (!cleanPath.startsWith('media/')) {
//       if (cleanPath.includes('post') || 
//           cleanPath.includes('Post') ||
//           cleanPath.includes('image_') ||
//           cleanPath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//         cleanPath = 'media/' + cleanPath;
//       }
//     }
  
//     let baseUrl = API_ROUTE_IMAGE;
//     if (!baseUrl.endsWith('/')) {
//       baseUrl = baseUrl + '/';
//     }
    
//     const fullUrl = `${baseUrl}${cleanPath}`;
//     console.log('Constructed URL from path:', fullUrl);
    
//     return fullUrl;
//   }
  
//   console.log('Unhandled imagePath type:', typeof imagePath, imagePath);
//   return null;
// };
//   useEffect(() => {
//     const checkProfileOwnership = async () => {
//       if (route.params?.userId) {
//         const currentUserId = await AsyncStorage.getItem('userId');
//         setIsOwnProfile(route.params.userId === currentUserId);
//       }
//     };
//     checkProfileOwnership();
//   }, [route.params]);

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;

//       if (!token || !parsed?.id) return null;

//       const response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setUserData(response.data);
//         setEditForm({
//           name: response.data.name || '',
//           email: response.data.email || '',
//           country: response.data.country || '',
//           active_mode: response.data.active_mode || 'personal'
//         });
        
//         // Handle profile image
//         if (response.data.profile_picture) {
//           const profileImageUrl = getImageUrl(response.data.profile_picture);
//           setUserProfileImage(profileImageUrl);
//         } else {
//           setUserProfileImage(null);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       if (error.response?.status === 401) {
//         navigation.navigate('Login');
//       }
//       setUserProfileImage(null);
//     }
//   };

//   // Fetch follow stats
//   const fetchFollowStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userId = isOwnProfile ? null : route.params?.userId;
      
//       let endpoint;
//       if (isOwnProfile) {
//         endpoint = `${API_ROUTE}/me/follow-stats/`;
//       } else {
//         endpoint = `${API_ROUTE}/users/${route.params?.userId}/follow-stats/`;
//       }

//       const response = await axios.get(endpoint, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setFollowStats(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching follow stats:', error);
//       setFollowStats({
//         followers_count: 0,
//         following_count: 0,
//         followers: [],
//         following: []
//       });
//     }
//   };

//   // ========== ADDED: Update user profile function ==========
//   const updateUserProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
      
//       // Append text fields
//       Object.keys(editForm).forEach(key => {
//         if (editForm[key] !== undefined && editForm[key] !== null) {
//           formData.append(key, editForm[key]);
//         }
//       });

//       const response = await axios.patch(`${API_ROUTE}/me/profile/update/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//         setUserData(response.data);
//         setIsEditing(false);
//         Alert.alert('Success', 'Profile updated successfully');
        
//         // Update AsyncStorage
//         const updatedUserData = {
//           ...JSON.parse(await AsyncStorage.getItem('userData')),
//           ...response.data
//         };
//         await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        
//         // Refresh profile image
//         if (response.data.profile_picture) {
//           const profileImageUrl = getImageUrl(response.data.profile_picture);
//           setUserProfileImage(profileImageUrl);
//         }
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error.response?.data || error.message);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   // ========== ADDED: Follow/Unfollow functions ==========
//   const handleFollow = async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_ROUTE}/follow/`, {
//         following_user: userId,
//         follow_type: 'user'
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 201) {
//         fetchFollowStats(); 
//         Alert.alert('Success', 'User followed successfully');
//       }
//     } catch (error) {
//       console.error('Error following user:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to follow user');
//     }
//   };

//   const handleUnfollow = async (followId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.delete(`${API_ROUTE}/follow/${followId}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       fetchFollowStats();
//       Alert.alert('Success', 'User unfollowed successfully');
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to unfollow user');
//     }
//   };

//   // ========== ADDED: Check if following ==========
//   const isFollowing = () => {
//     return followStats.following.some(follow => 
//       follow.following_user?.id === route.params?.userId
//     );
//   };

//   // ========== ADDED: Get follow ID ==========
//   const getFollowId = () => {
//     const follow = followStats.following.find(f => 
//       f.following_user?.id === route.params?.userId
//     );
//     return follow?.id;
//   };

//   // Fetch business profile data
//   const fetchBusinessProfile = async () => {
//     try {
//       setBusinessLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         const profile = Array.isArray(response.data) ? response.data[0] : response.data;
//         setBusinessProfile(profile);
        
//         if (profile.id) {
//           await fetchBusinessHours(profile.id);
//           await fetchBusinessCatalog();
//         }
        
//         setShowBusinessInfo(!!(profile.name || profile.description));
//       } else {
//         setBusinessProfile(null);
//         setShowBusinessInfo(false);
//       }
//     } catch (err) {
//       console.error('Failed to load business profile', err);
//       setBusinessProfile(null);
//       setShowBusinessInfo(false);
//     } finally {
//       setBusinessLoading(false);
//     }
//   };

//   const fetchBusinessHours = async (profileId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await fetch(`${API_ROUTE}/business-hours/${profileId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setBusinessHours(data || []);
//     } catch (err) {
//       console.error('Error fetching business hours:', err);
//       setBusinessHours([]);
//     }
//   };

//   const fetchBusinessCatalog = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         console.log('Catalog Data Raw:', response.data);
        
//         // Process catalog data to ensure proper image URLs
//         const processedCatalog = (response.data || []).map(item => {
//           // Create images array from image field
//           const images = [];
          
//           if (item.image) {
//             images.push({
//               id: item.id,
//               image: getImageUrl(item.image),
//               is_main: true
//             });
//           }
          
//           return {
//             ...item,
//             images: images,
//             main_image: getImageUrl(item.image)
//           };
//         });
        
//         console.log('Processed Catalog:', processedCatalog);
//         setCatalogData(processedCatalog);
//       }
//     } catch (error) {
//       console.error('Error fetching catalog:', error);
//       setCatalogData([]);
//     }
//   };

//   const fetchMarketplace = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userId = isOwnProfile ? null : route.params?.userId;
//       const endpoint = userId ? `${API_ROUTE}/user-listings/${userId}/` : `${API_ROUTE}/my-listings/`;
      
//       const res = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Process marketplace data to ensure proper image URLs
//       const processedPosts = (res.data || []).map(item => ({
//         ...item,
//         images: Array.isArray(item.images) 
//           ? item.images.map(img => ({
//               ...img,
//               image: getImageUrl(img.image)
//             }))
//           : []
//       }));
      
//       setMarketplacePosts(processedPosts);
//     } catch (error) {
//       console.error('Error fetching marketplace posts:', error);
//       setMarketplacePosts([]);
//     }
//   };

//   const fetchTweets = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const userId = isOwnProfile ? null : route.params?.userId;
//     const endpoint = userId ? `${API_ROUTE}/user-posts/${userId}/` : `${API_ROUTE}/my-posts/`;
    
//     console.log('Fetching tweets from:', endpoint);
//     const res = await axios.get(endpoint, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
    
//     console.log('Tweets API Response:', res.data);
    
//     // Process tweet data to ensure proper image URLs
//     const processedTweets = (res.data || []).map(item => {
//       console.log('Processing tweet:', item.id, 'Image data:', item.image);
      
//       let imageUrl = null;
      
//       // Handle different image field formats
//       if (item.image) {
//         if (typeof item.image === 'string') {
//           // It's already a string path
//           imageUrl = getImageUrl(item.image);
//         } else if (item.image.image) {
//           // It's an object with image property
//           imageUrl = getImageUrl(item.image.image);
//         } else if (item.image.url) {
//           // It's an object with url property
//           imageUrl = getImageUrl(item.image.url);
//         }
//       }
      
//       // Also check for media field (some APIs use this)
//       if (!imageUrl && item.media) {
//         if (Array.isArray(item.media) && item.media.length > 0) {
//           const firstMedia = item.media[0];
//           if (typeof firstMedia === 'string') {
//             imageUrl = getImageUrl(firstMedia);
//           } else if (firstMedia.image) {
//             imageUrl = getImageUrl(firstMedia.image);
//           } else if (firstMedia.url) {
//             imageUrl = getImageUrl(firstMedia.url);
//           }
//         } else if (typeof item.media === 'string') {
//           imageUrl = getImageUrl(item.media);
//         }
//       }
      
//       return {
//         ...item,
//         image: imageUrl,
//         _originalImage: item.image,
//         _originalMedia: item.media
//       };
//     });
    
//     console.log('Processed Tweets:', processedTweets);
//     setTweets(processedTweets);
//   } catch (error) {
//     console.error('Error fetching tweets:', error);
//     console.error('Error details:', error.response?.data);
//     setTweets([]);
//   }
// };

//   const fetchVideos = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userId = isOwnProfile ? null : route.params?.userId;
//       const endpoint = userId ? `${API_ROUTE}/user-shorts/${userId}/` : `${API_ROUTE}/my-shorts/`;
      
//       const res = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Process video data to ensure proper URLs
//       const processedVideos = (res.data || []).map(item => ({
//         ...item,
//         video: item.video ? getImageUrl(item.video) : null,
//         thumbnail: item.thumbnail ? getImageUrl(item.thumbnail) : null
//       }));
      
//       setUserVideos(processedVideos);
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       setUserVideos([]);
//     }
//   };

//   // Refresh data when screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       const fetchData = async () => {
//         setLoading(true);
        
//         try {
//           await fetchUserData();
//           await fetchFollowStats();
//           if (isOwnProfile) {
//             await fetchBusinessProfile();
//           }
//           await Promise.all([fetchMarketplace(), fetchTweets(), fetchVideos()]);
//         } catch (error) {
//           console.error('Error in fetchData:', error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }, [isOwnProfile, route.params?.userId])
//   );

//   // Product Catalog Modal Functions
//   const openProductModal = (product) => {
//     console.log('Opening product modal:', product);
//     setSelectedProduct(product);
//     setCurrentImageIndex(0);
//     setProductModalVisible(true);
//     Animated.spring(productSlideAnim, {
//       toValue: 0,
//       useNativeDriver: true,
//       tension: 50,
//       friction: 7,
//     }).start();
//   };

//   const closeProductModal = () => {
//     Animated.timing(productSlideAnim, {
//       toValue: height,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setProductModalVisible(false);
//       setSelectedProduct(null);
//     });
//   };

//   const nextImage = () => {
//     if (selectedProduct?.images && currentImageIndex < selectedProduct.images.length - 1) {
//       setCurrentImageIndex(currentImageIndex + 1);
//     }
//   };

//   const prevImage = () => {
//     if (currentImageIndex > 0) {
//       setCurrentImageIndex(currentImageIndex - 1);
//     }
//   };

//   // Enhanced Image Component with error handling
//   const SafeImage = ({ source, style, resizeMode = 'cover', placeholder = null, ...props }) => {
//     const [error, setError] = useState(false);
//     const [imgLoading, setImgLoading] = useState(true);

//     const handleError = () => {
//       console.log('Image failed to load:', source?.uri);
//       setError(true);
//       setImgLoading(false);
//     };

//     const handleLoad = () => {
//       setImgLoading(false);
//     };

//     if (error || !source?.uri) {
//       return (
//         <View style={[style, styles.imagePlaceholder]}>
//           {placeholder || <Icon name="image-outline" size={40} color={colors.textSecondary} />}
//         </View>
//       );
//     }

//     return (
//       <View style={style}>
//         <Image
//           source={source}
//           style={[StyleSheet.absoluteFill, { borderRadius: style.borderRadius || 0 }]}
//           resizeMode={resizeMode}
//           onError={handleError}
//           onLoad={handleLoad}
//           {...props}
//         />
//         {imgLoading && (
//           <View style={[StyleSheet.absoluteFill, styles.imageLoading]}>
//             <ActivityIndicator size="small" color={colors.primary} />
//           </View>
//         )}
//       </View>
//     );
//   };

//   // ========== FIXED: toggleModal function ==========
//   const toggleModal = (item = null) => {
//     setSelectedItem(item);
//     if (item) {
//       setModalVisible(true);
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         useNativeDriver: true,
//         tension: 50,
//         friction: 7,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: height,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setModalVisible(false));
//     }
//   };

//   const toggleVideoPlayback = (id) => {
//     if (playingVideo === id) {
//       setPlayingVideo(null);
//     } else {
//       setPlayingVideo(id);
//     }
//   };

//   const confirmDelete = (type, id) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this item?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => handleDelete(type, id),
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const handleDelete = async (type, id) => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       let endpoint = '';
//       if (type === 'marketplace') {
//         endpoint = `${API_ROUTE}/my-listings/${id}/`;
//       } else if (type === 'tweets') {
//         endpoint = `${API_ROUTE}/my-posts/${id}/`;
//       } else {
//         endpoint = `${API_ROUTE}/my-shorts/${id}/`;
//       }

//       await axios.delete(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (type === 'marketplace') {
//         fetchMarketplace();
//       } else if (type === 'tweets') {
//         fetchTweets();
//       } else {
//         fetchVideos();
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to delete item");
//     }
//     toggleModal(); // Changed from setModalVisible(false)
//   };

//   // ========== ADDED: Edit Form Component ==========
//   const renderEditForm = () => (
//     <View style={styles.editForm}>
//       <Text style={[styles.editTitle, { color: colors.text }]}>Edit Profile</Text>
      
//       <View style={styles.inputGroup}>
//         <Text style={[styles.label, { color: colors.text }]}>Name</Text>
//         <TextInput
//           style={[styles.input, { 
//             backgroundColor: colors.inputBackground || colors.surface,
//             color: colors.text,
//             borderColor: colors.border 
//           }]}
//           value={editForm.name}
//           onChangeText={(text) => setEditForm({...editForm, name: text})}
//           placeholder="Enter your name"
//           placeholderTextColor={colors.textSecondary}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={[styles.label, { color: colors.text }]}>Email</Text>
//         <TextInput
//           style={[styles.input, { 
//             backgroundColor: colors.inputBackground || colors.surface,
//             color: colors.text,
//             borderColor: colors.border 
//           }]}
//           value={editForm.email}
//           onChangeText={(text) => setEditForm({...editForm, email: text})}
//           placeholder="Enter your email"
//           placeholderTextColor={colors.textSecondary}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={[styles.label, { color: colors.text }]}>Country</Text>
//         <TextInput
//           style={[styles.input, { 
//             backgroundColor: colors.inputBackground || colors.surface,
//             color: colors.text,
//             borderColor: colors.border 
//           }]}
//           value={editForm.country}
//           onChangeText={(text) => setEditForm({...editForm, country: text})}
//           placeholder="Enter your country"
//           placeholderTextColor={colors.textSecondary}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={[styles.label, { color: colors.text }]}>Active Mode</Text>
//         <View style={styles.radioGroup}>
//           <TouchableOpacity
//             style={styles.radioOption}
//             onPress={() => setEditForm({...editForm, active_mode: 'personal'})}
//           >
//             <View style={[styles.radio, { borderColor: colors.primary }]}>
//               {editForm.active_mode === 'personal' && (
//                 <View style={[styles.radioSelected, { backgroundColor: colors.primary }]} />
//               )}
//             </View>
//             <Text style={[styles.radioText, { color: colors.text }]}>Personal</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.radioOption}
//             onPress={() => setEditForm({...editForm, active_mode: 'business'})}
//           >
//             <View style={[styles.radio, { borderColor: colors.primary }]}>
//               {editForm.active_mode === 'business' && (
//                 <View style={[styles.radioSelected, { backgroundColor: colors.primary }]} />
//               )}
//             </View>
//             <Text style={[styles.radioText, { color: colors.text }]}>Business</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.editActions}>
//         <TouchableOpacity 
//           style={[styles.cancelButton, { backgroundColor: colors.buttonSecondary || '#e0e0e0' }]}
//           onPress={() => setIsEditing(false)}
//         >
//           <Text style={[styles.cancelButtonText, { color: colors.buttonSecondaryText || '#666' }]}>
//             Cancel
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[
//             styles.saveButton, 
//             { backgroundColor: colors.primary },
//             profileLoading && styles.saveButtonDisabled
//           ]}
//           onPress={updateUserProfile}
//           disabled={profileLoading}
//         >
//           {profileLoading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.saveButtonText}>Save Changes</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // Enhanced marketplace post renderer - FIXED to use toggleModal
//   const renderMarketplacePost = ({ item }) => {
//     const firstImage = item.images?.[0]?.image;

//     return (
//       <TouchableOpacity 
//         style={[styles.card, { backgroundColor: colors.card || colors.surface }]}
//         onPress={() => openProductModal(item)}
//         activeOpacity={0.9}
//       >
//         {/* Image Slider */}
//         <View style={styles.imageSliderContainer}>
//           {firstImage ? (
//             <>
//               <SafeImage 
//                 source={{ uri: firstImage }}
//                 style={styles.postImage}
//                 resizeMode="cover"
//                 placeholder={<Icon name="image-outline" size={40} color={colors.textSecondary} />}
//               />
//               {item.images.length > 1 && (
//                 <View style={styles.imageCountBadge}>
//                   <Icon name="images" size={14} color="#fff" />
//                   <Text style={styles.imageCountText}>{item.images.length}</Text>
//                 </View>
//               )}
//             </>
//           ) : (
//             <View style={[styles.postImage, styles.noImagePlaceholder, { backgroundColor: colors.surface }]}>
//               <Icon name="image-outline" size={40} color={colors.textSecondary} />
//             </View>
//           )}
          
//           {/* Quick actions overlay */}
//           <View style={styles.imageOverlay}>
//             {item.is_new && (
//               <View style={styles.newBadge}>
//                 <Text style={styles.newBadgeText}>NEW</Text>
//               </View>
//             )}
//             {item.discount_price && (
//               <View style={styles.discountBadge}>
//                 <Text style={styles.discountBadgeText}>
//                   -{Math.round((1 - item.discount_price / item.price) * 100)}%
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>
        
//         <View style={styles.postContent}>
//           <View style={styles.postHeader}>
//             <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={2}>
//               {item.title || 'No Title'}
//             </Text>
//             {isOwnProfile && (
//               <TouchableOpacity 
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   toggleModal(item); // Changed from setSelectedItem/setModalVisible
//                 }}
//                 style={styles.moreButton}
//               >
//                 <Icon name="ellipsis-vertical" size={20} color={colors.textSecondary} />
//               </TouchableOpacity>
//             )}
//           </View>
          
//           {item.description && (
//             <Text style={[styles.postDescription, { color: colors.textSecondary }]} numberOfLines={2}>
//               {item.description}
//             </Text>
//           )}
          
//           <View style={styles.priceContainer}>
//             {item.sale_price && parseFloat(item.sale_price) < parseFloat(item.price) ? (
//               <>
//                 <Text style={[styles.discountPrice, { color: colors.success || '#27ae60' }]}>
//                   ₦{parseFloat(item.sale_price).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                 </Text>
//                 <Text style={[styles.originalPrice, { color: colors.textTertiary }]}>
//                   ₦{parseFloat(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                 </Text>
//               </>
//             ) : (
//               <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>
//                 ₦{parseFloat(item.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
//               </Text>
//             )}
//           </View>
          
//           <View style={styles.postFooter}>
//             <View style={styles.locationContainer}>
//               <Icon name="location-outline" size={14} color={colors.textTertiary} />
//               <Text style={[styles.postLocation, { color: colors.textTertiary }]} numberOfLines={1}>
//                 {item.location || 'Location not specified'}
//               </Text>
//             </View>
//             <Text style={[styles.postDate, { color: colors.textTertiary }]}>
//               {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'No date'}
//             </Text>
//           </View>
          
//           <View style={styles.interactionContainer}>
//             <TouchableOpacity style={styles.interactionButton}>
//               <Icon name="heart-outline" size={18} color={colors.textSecondary} />
//               <Text style={[styles.interactionText, { color: colors.textSecondary }]}>
//                 {item.like_count || 0}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.interactionButton}>
//               <Icon name="chatbubble-outline" size={18} color={colors.textSecondary} />
//               <Text style={[styles.interactionText, { color: colors.textSecondary }]}>
//                 {item.comment_count || 0}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Enhanced video renderer - FIXED to use toggleModal
//   const renderVideo = ({ item }) => {
//     return (
//       <View style={[styles.card, { backgroundColor: colors.card || colors.surface }]}>
//         <TouchableOpacity 
//           activeOpacity={0.9}
//           onPress={() => toggleVideoPlayback(item.id)}
//           style={styles.videoContainer}
//         >
//           {item.thumbnail ? (
//             <SafeImage 
//               source={{ uri: item.thumbnail }}
//               style={styles.postImage}
//               resizeMode="cover"
//             />
//           ) : item.video ? (
//             <Video
//               ref={(ref) => (videoRefs.current[item.id] = ref)}
//               source={{ uri: item.video }}
//               style={styles.postImage}
//               resizeMode="cover"
//               paused={playingVideo !== item.id}
//               repeat={false}
//               onError={(error) => console.log('Video error:', error)}
//             />
//           ) : (
//             <View style={[styles.postImage, styles.noImagePlaceholder]}>
//               <Icon name="videocam-outline" size={40} color={colors.textSecondary} />
//             </View>
//           )}
          
//           {playingVideo !== item.id && item.video && (
//             <View style={styles.playButton}>
//               <Icon name="play-circle" size={64} color="rgba(255,255,255,0.9)" />
//             </View>
//           )}
//           <View style={styles.videoDuration}>
//             <Text style={styles.durationText}>{item.duration || '0:30'}</Text>
//           </View>
//         </TouchableOpacity>
//         <View style={styles.postContent}>
//           <View style={styles.postHeader}>
//             <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={2}>
//               {item.caption || 'No caption'}
//             </Text>
//             {isOwnProfile && (
//               <TouchableOpacity 
//                 onPress={() => toggleModal(item)} // Changed from setSelectedItem/setModalVisible
//                 style={styles.moreButton}
//               >
//                 <Icon name="ellipsis-vertical" size={20} color={colors.textSecondary} />
//               </TouchableOpacity>
//             )}
//           </View>
//           <View style={styles.postStats}>
//             <TouchableOpacity style={styles.statItem}>
//               <Icon name="heart" size={16} color={colors.primary} />
//               <Text style={[styles.postStat, { color: colors.text }]}>{item.like_count || 0}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.statItem}>
//               <Icon name="chatbubble" size={16} color={colors.primary} />
//               <Text style={[styles.postStat, { color: colors.text }]}>{item.comment_count || 0}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.statItem}>
//               <Icon name="share-social" size={16} color={colors.primary} />
//               <Text style={[styles.postStat, { color: colors.text }]}>{item.share_count || 0}</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={[styles.postDate, { color: colors.textTertiary }]}>
//             {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'No date'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   // Enhanced tweet renderer - FIXED to use toggleModal
//   const renderTweet = ({ item }) => {
//     return (
//       <View style={[styles.card, { backgroundColor: colors.card || colors.surface }]}>
//         {item.image ? (
//           <SafeImage 
//             source={{ uri: item.image }}
//             style={styles.postImage}
//             resizeMode="cover"
//           />
//         ) : null}
//         <View style={styles.postContent}>
//           <View style={styles.postHeader}>
//             <Text style={[styles.postText, { color: colors.text }]} numberOfLines={4}>
//               {item.content || 'No content'}
//             </Text>
//             {isOwnProfile && (
//               <TouchableOpacity 
//                 onPress={() => toggleModal(item)} // Changed from setSelectedItem/setModalVisible
//                 style={styles.moreButton}
//               >
//                 <Icon name="ellipsis-vertical" size={20} color={colors.textSecondary} />
//               </TouchableOpacity>
//             )}
//           </View>
//           <View style={styles.postStats}>
//             <TouchableOpacity style={styles.statItem}>
//               <Icon name="heart-outline" size={18} color={colors.textSecondary} />
//               <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.likes || 0}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.statItem}>
//               <Icon name="chatbubble-outline" size={18} color={colors.textSecondary} />
//               <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.comments || 0}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.statItem}>
//               <Icon name="share-outline" size={18} color={colors.textSecondary} />
//               <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.shares || 0}</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={[styles.postDate, { color: colors.textTertiary }]}>
//             {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'No date'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   // Enhanced business catalog preview
//   const renderBusinessCatalogPreview = () => {
//     if (!catalogData.length) return null;

//     return (
//       <View style={styles.catalogPreview}>
//         <View style={styles.catalogHeader}>
//           <Text style={[styles.catalogTitle, { color: colors.text }]}>Product Catalog</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('BusinessCatalog')}>
//             <Text style={[styles.viewAllText, { color: colors.primary }]}></Text>
//           </TouchableOpacity>
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catalogScroll}>
//           {catalogData.slice(0, 5).map((item, index) => {
//             const firstImage = item.images?.[0]?.image || item.main_image;
            
            
//             return (
//               <TouchableOpacity 
//                 key={item.id || index} 
//                 style={styles.catalogItem}
//                 onPress={() => openProductModal(item)}
//                 activeOpacity={0.9}
//               >
//                 {firstImage ? (
//                   <ImageBackground
//                     source={{ uri: firstImage }}
//                     style={styles.catalogImage}
//                     imageStyle={styles.catalogImageStyle}
//                   >
//                     {item.sale_price && parseFloat(item.sale_price) < parseFloat(item.price) && (
//                       <View style={styles.catalogDiscountBadge}>
//                         <Text style={styles.catalogDiscountText}>
//                           -{Math.round((1 - parseFloat(item.sale_price) / parseFloat(item.price)) * 100)}%
//                         </Text>
//                       </View>
//                     )}
//                   </ImageBackground>
//                 ) : (
//                   <View style={[styles.catalogImage, styles.catalogImagePlaceholder]}>
//                     <Icon name="image-outline" size={30} color={colors.textSecondary} />
//                   </View>
//                 )}
//                 <View style={styles.catalogInfo}>
//                   <Text style={[styles.catalogItemName, { color: colors.text }]} numberOfLines={1}>
//                     {item.name || 'No Name'}
//                   </Text>
//                   <View style={styles.catalogPriceContainer}>
//                     {item.sale_price && parseFloat(item.sale_price) < parseFloat(item.price) ? (
//                       <>
//                         <Text style={[styles.catalogDiscountedPrice, { color: colors.success || '#27ae60' }]}>
//                           ₦{parseFloat(item.sale_price).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                         </Text>
//                         <Text style={[styles.catalogOriginalPrice, { color: colors.textTertiary }]}>
//                           ₦{parseFloat(item.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                         </Text>
//                       </>
//                     ) : (
//                       <Text style={[styles.catalogPrice, { color: colors.success || '#27ae60' }]}>
//                         ₦{parseFloat(item.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                       </Text>
//                     )}
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar 
//         barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background}
//       />
      
//       {/* Header */}
//       <View style={[styles.header, { backgroundColor: colors.card || colors.surface }]}>
//         <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
//         {isOwnProfile && !isEditing && (
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={() => setIsEditing(true)}
//           >
//             <Icon name="create-outline" size={22} color={colors.text} />
//           </TouchableOpacity>
//         )}
//         {isEditing && (
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={() => setIsEditing(false)}
//           >
//             <Icon name="close" size={24} color={colors.text} />
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView 
//         style={[styles.scrollContainer, { backgroundColor: colors.background }]} 
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Profile Section */}
//         <View style={[styles.profileContainer, { backgroundColor: colors.card || colors.surface }]}>
//           {isEditing ? (
//             renderEditForm()
//           ) : (
//             <>
//               <SafeImage 
//                 source={userProfileImage ? { uri: userProfileImage } : null}
//                 style={[styles.profileImage, { backgroundColor: colors.surface }]}
//                 resizeMode="cover"
//                 placeholder={
//                   <Icon name="person-circle-outline" size={60} color={colors.textSecondary} />
//                 }
//               />
//               <Text style={[styles.contactName, { color: colors.text }]}>{userData.name || 'No Name'}</Text>
//               <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{userData.phone || 'No Phone'}</Text>
              
//               {/* Stats Section */}
//               <View style={styles.statsContainer}>
//                 <TouchableOpacity style={styles.statItem}>
//                   <Text style={[styles.statNumber, { color: colors.text }]}>{followStats.following_count}</Text>
//                   <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
//                 </TouchableOpacity>
//                 <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
//                 <TouchableOpacity style={styles.statItem}>
//                   <Text style={[styles.statNumber, { color: colors.text }]}>{followStats.followers_count}</Text>
//                   <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
//                 </TouchableOpacity>
//                 <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
//                 <TouchableOpacity style={styles.statItem}>
//                   <Text style={[styles.statNumber, { color: colors.text }]}>
//                     {marketplacePosts.length + tweets.length + userVideos.length}
//                   </Text>
//                   <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Business Badge */}
//               {showBusinessInfo && (
//                 <View style={[styles.businessBadge, { backgroundColor: colors.primary }]}>
//                   <Icon name="business" size={16} color="#fff" />
//                   <Text style={styles.businessBadgeText}>Business Account</Text>
//                 </View>
//               )}

//               {/* Follow Button */}
//               {!isOwnProfile && (
//                 <TouchableOpacity 
//                   style={[
//                     styles.followButton,
//                     { backgroundColor: isFollowing() ? colors.buttonSecondary : colors.primary }
//                   ]}
//                   onPress={() => {
//                     if (isFollowing()) {
//                       handleUnfollow(getFollowId());
//                     } else {
//                       handleFollow(route.params?.userId);
//                     }
//                   }}
//                 >
//                   <Text style={[
//                     styles.followButtonText, 
//                     { color: isFollowing() ? colors.buttonSecondaryText : '#fff' }
//                   ]}>
//                     {isFollowing() ? 'Unfollow' : 'Follow'}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </>
//           )}
//         </View>

//         {/* Business Catalog Preview */}
//         {isOwnProfile && catalogData.length > 0 && renderBusinessCatalogPreview()}

//         {/* Posts Section Header */}
//         {!isEditing && (
//           <View style={styles.sectionHeader}>
//             <Text style={[styles.sectionTitle, { color: colors.text }]}>
//               {isOwnProfile ? 'My Posts' : `${userData.name || 'User'}'s Posts`}
//             </Text>
//           </View>
//         )}

//         {/* Tab Bar */}
//         {!isEditing && (
//           <View style={[styles.tabContainer, { backgroundColor: colors.card || colors.surface }]}>
//             {['marketplace', 'tweets', 'videos'].map((tab) => (
//               <TouchableOpacity 
//                 key={tab}
//                 onPress={() => {
//                   setSelectedTab(tab);
//                   setPlayingVideo(null);
//                 }} 
//                 style={[
//                   styles.tab, 
//                   selectedTab === tab && [styles.activeTab, { backgroundColor: colors.primary }]
//                 ]}
//               >
//                 <Icon 
//                   name={
//                     tab === 'marketplace' ? 'cart-outline' :
//                     tab === 'tweets' ? 'chatbubble-outline' :
//                     'videocam-outline'
//                   } 
//                   size={20} 
//                   color={selectedTab === tab ? '#fff' : colors.primary} 
//                 />
//                 <Text style={[
//                   styles.tabText, 
//                   { color: selectedTab === tab ? '#fff' : colors.primary },
//                   selectedTab === tab && styles.activeTabText
//                 ]}>
//                   {tab === 'marketplace' ? 'Marketplace' : 
//                    tab === 'tweets' ? 'Posts' : 'Videos'}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Posts Content */}
//         {!isEditing && (loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={colors.primary} />
//             <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
//               Loading posts...
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={
//               selectedTab === 'marketplace' ? marketplacePosts :
//               selectedTab === 'tweets' ? tweets : userVideos
//             }
//             renderItem={
//               selectedTab === 'marketplace' ? renderMarketplacePost :
//               selectedTab === 'tweets' ? renderTweet : renderVideo
//             }
//             keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//             contentContainerStyle={styles.listContent}
//             scrollEnabled={false}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={() => (
//               <View style={styles.emptyContainer}>
//                 <Icon 
//                   name={selectedTab === 'marketplace' ? 'cart-outline' : 
//                         selectedTab === 'tweets' ? 'document-text-outline' : 
//                         'videocam-outline'} 
//                   size={60} 
//                   color={colors.textSecondary} 
//                 />
//                 <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                   {isOwnProfile 
//                     ? `You haven't posted any ${selectedTab === 'marketplace' ? 'marketplace items' : 
//                        selectedTab === 'tweets' ? 'posts' : 'videos'} yet.` 
//                     : `This user hasn't posted any ${selectedTab === 'marketplace' ? 'marketplace items' : 
//                        selectedTab === 'tweets' ? 'posts' : 'videos'} yet.`}
//                 </Text>
//               </View>
//             )}
//           />
//         ))}
//       </ScrollView>
      

//       {/* FIXED: Options Modal - Now uses toggleModal */}
//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => toggleModal()}
//         animationType="none"
//       >
//         <View style={styles.modalOverlay}>
//           <Pressable style={styles.modalBackdrop} onPress={() => toggleModal()} />
//           <Animated.View 
//             style={[
//               styles.modalContainer,
//               { transform: [{ translateY: slideAnim }], backgroundColor: colors.card || colors.surface }
//             ]}
//           >
//             <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
//             <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
//             <TouchableOpacity 
//               style={styles.modalOption}
//               onPress={() => selectedItem && confirmDelete(selectedTab, selectedItem.id)}
//             >
//               <Icon name="trash-outline" size={24} color="#e74c3c" />
//               <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.modalOption}
//               onPress={() => toggleModal()}
//             >
//               <Icon name="close-circle-outline" size={24} color={colors.primary} />
//               <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </Modal>

//       {/* Product Catalog Modal */}
//       {productModalVisible && selectedProduct && (
//         <Modal
//           transparent={true}
//           visible={productModalVisible}
//           onRequestClose={closeProductModal}
//           animationType="none"
//           statusBarTranslucent={true}
//         >
//           <View style={styles.productModalOverlay}>
//             <Pressable style={styles.modalBackdrop} onPress={closeProductModal} />
            
//             <Animated.View 
//               style={[
//                 styles.productModalContainer,
//                 { 
//                   transform: [{ translateY: productSlideAnim }],
//                   backgroundColor: colors.card || colors.surface 
//                 }
//               ]}
//             >
//               {/* Close Button */}
//               <TouchableOpacity 
//                 style={styles.productCloseButton}
//                 onPress={closeProductModal}
//               >
//                 <Icon name="close" size={28} color={colors.text} />
//               </TouchableOpacity>

//               {/* Product Image Gallery */}
//               <View style={styles.productImageContainer}>
//                 {selectedProduct.images?.[currentImageIndex]?.image ? (
//                   <SafeImage 
//                     source={{ uri: selectedProduct.images[currentImageIndex].image }}
//                     style={styles.productModalImage}
//                     resizeMode="contain"
//                   />
//                 ) : (
//                   <View style={[styles.productPlaceholder, { backgroundColor: colors.surface }]}>
//                     <Icon name="image-outline" size={60} color={colors.textSecondary} />
//                   </View>
//                 )}

//                 {/* Image Navigation Dots */}
//                 {selectedProduct.images?.length > 1 && (
//                   <View style={styles.imageDotsContainer}>
//                     {selectedProduct.images.map((_, index) => (
//                       <View 
//                         key={index}
//                         style={[
//                           styles.imageDot,
//                           { 
//                             backgroundColor: index === currentImageIndex 
//                               ? colors.primary 
//                               : 'rgba(255,255,255,0.5)' 
//                           }
//                         ]}
//                       />
//                     ))}
//                   </View>
//                 )}

//                 {/* Navigation Arrows */}
//                 {selectedProduct.images?.length > 1 && currentImageIndex > 0 && (
//                   <TouchableOpacity 
//                     style={[styles.navArrow, styles.prevArrow]}
//                     onPress={prevImage}
//                   >
//                     <Icon name="chevron-back" size={24} color="#fff" />
//                   </TouchableOpacity>
//                 )}
                
//                 {selectedProduct.images?.length > 1 && currentImageIndex < selectedProduct.images.length - 1 && (
//                   <TouchableOpacity 
//                     style={[styles.navArrow, styles.nextArrow]}
//                     onPress={nextImage}
//                   >
//                     <Icon name="chevron-forward" size={24} color="#fff" />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {/* Product Details */}
//               <ScrollView style={styles.productDetailsContainer} showsVerticalScrollIndicator={false}>
//                 <View style={styles.productHeader}>
//                   <Text style={[styles.productModalTitle, { color: colors.text }]}>
//                     {selectedProduct.name || 'No Name'}
//                   </Text>
//                   <View style={styles.productPriceContainer}>
//                     {selectedProduct.sale_price && parseFloat(selectedProduct.sale_price) < parseFloat(selectedProduct.price) ? (
//                       <>
//                         <Text style={[styles.productModalPrice, { color: colors.success || '#27ae60' }]}>
//                           ₦{parseFloat(selectedProduct.sale_price).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                         </Text>
//                         <Text style={[styles.productOriginalPrice, { color: colors.textTertiary }]}>
//                           ₦{parseFloat(selectedProduct.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                         </Text>
//                       </>
//                     ) : (
//                       <Text style={[styles.productModalPrice, { color: colors.success || '#27ae60' }]}>
//                         ₦{parseFloat(selectedProduct.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
//                       </Text>
//                     )}
//                   </View>
//                 </View>

//                 {selectedProduct.description && (
//                   <View style={styles.productDescriptionContainer}>
//                     <Text style={[styles.productDescriptionLabel, { color: colors.text }]}>
//                       Description
//                     </Text>
//                     <Text style={[styles.productDescription, { color: colors.text }]}>
//                       {selectedProduct.description}
//                     </Text>
//                   </View>
//                 )}

//                 <View style={styles.productActions}>
//                   <TouchableOpacity 
//                     style={[styles.productActionButton, { backgroundColor: colors.primary }]}
//                     onPress={() => {
//                       Alert.alert('Contact Seller', `Would you like to contact the seller about "${selectedProduct.name}"?`, [
//                         { text: 'Cancel', style: 'cancel' },
//                         { text: 'Contact', onPress: () => console.log('Contacting seller for:', selectedProduct.id) }
//                       ]);
//                     }}
//                   >
//                     <Icon name="chatbubble-ellipses-outline" size={20} color="#fff" />
//                     <Text style={[styles.productActionText, { color: '#fff' }]}>Contact Seller</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity 
//                     style={[styles.productActionButton, styles.wishlistButton, { 
//                       borderColor: colors.primary,
//                       backgroundColor: 'transparent'
//                     }]}
//                     onPress={() => {
//                       Alert.alert('Added to Wishlist', `${selectedProduct.name} has been added to your wishlist!`);
//                     }}
//                   >
//                     <Icon name="heart-outline" size={20} color={colors.primary} />
//                     <Text style={[styles.productActionText, { color: colors.primary }]}>Save</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Additional Images Thumbnails */}
//                 {selectedProduct.images?.length > 1 && (
//                   <View style={styles.thumbnailContainer}>
//                     <Text style={[styles.thumbnailTitle, { color: colors.text }]}>More Images</Text>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                       {selectedProduct.images.map((img, index) => (
//                         <TouchableOpacity 
//                           key={index}
//                           onPress={() => setCurrentImageIndex(index)}
//                           style={[
//                             styles.thumbnail,
//                             index === currentImageIndex && styles.activeThumbnail
//                           ]}
//                         >
//                           <SafeImage 
//                             source={{ uri: img.image }}
//                             style={styles.thumbnailImage}
//                           />
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
//                 )}
//               </ScrollView>
//             </Animated.View>
//           </View>
//         </Modal>
//       )}
//     </SafeAreaView>
//   );
// };

// const createStyles = (colors) => StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     paddingTop: Platform.OS === 'ios' ? 10 : 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   iconButton: {
//     padding: 4,
//   },
//   editButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   profileContainer: {
//     alignItems: 'center',
//     padding: 20,
//     marginHorizontal: 16,
//     marginTop: 20,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     minHeight: 300, 
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 4,
//     borderColor: colors.background,
//     marginTop: -50,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 6,
//     overflow: 'hidden',
//   },
//   imagePlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.surface,
//   },
//   imageLoading: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.surface,
//   },
//   contactName: {
//     marginTop: 16,
//     fontSize: 24,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   contactPhone: {
//     fontSize: 16,
//     marginBottom: 8,
//     fontFamily: 'Lato-Regular',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     width: '100%',
//     marginVertical: 20,
//     paddingHorizontal: 20,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     fontFamily: 'Lato-Bold',
//   },
//   statLabel: {
//     fontSize: 14,
//     marginTop: 4,
//     fontFamily: 'Lato-Regular',
//   },
//   statDivider: {
//     width: 1,
//     height: 30,
//   },
//   businessBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginTop: 8,
//   },
//   businessBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   followButton: {
//     paddingHorizontal: 32,
//     paddingVertical: 10,
//     borderRadius: 25,
//     marginTop: 16,
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   followButtonText: {
//     fontWeight: '600',
//     fontSize: 16,
//     fontFamily: 'Lato-SemiBold',
//   },
//   catalogPreview: {
//     marginHorizontal: 16,
//     marginTop: 20,
//     borderRadius: 16,
//     padding: 16,
//     backgroundColor: colors.card || colors.surface,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   catalogHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   catalogTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   viewAllText: {
//     fontSize: 14,
//     fontWeight: '600',
//     fontFamily: 'Lato-SemiBold',
//   },
//   catalogScroll: {
//     paddingVertical: 8,
//   },
//   catalogItem: {
//     width: 140,
//     marginRight: 12,
//     borderRadius: 12,
//     overflow: 'hidden',
//     backgroundColor: colors.surface,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   catalogImage: {
//     width: 140,
//     height: 120,
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end',
//   },
//   catalogImagePlaceholder: {
//     backgroundColor: colors.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   catalogImageStyle: {
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   catalogDiscountBadge: {
//     backgroundColor: '#e74c3c',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderBottomLeftRadius: 6,
//     marginTop: 8,
//   },
//   catalogDiscountText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   catalogInfo: {
//     padding: 10,
//   },
//   catalogItemName: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 4,
//     fontFamily: 'Lato-SemiBold',
//   },
//   catalogPriceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   catalogPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   catalogDiscountedPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     marginRight: 6,
//     fontFamily: 'Lato-Bold',
//   },
//   catalogOriginalPrice: {
//     fontSize: 12,
//     textDecorationLine: 'line-through',
//     fontFamily: 'Lato-Regular',
//   },
//   sectionHeader: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 12,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   tab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     backgroundColor: 'transparent',
//   },
//   activeTab: {
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   tabText: {
//     marginLeft: 6,
//     fontWeight: '600',
//     fontSize: 14,
//     fontFamily: 'Lato-SemiBold',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 100,
//   },
//   card: {
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   imageSliderContainer: {
//     position: 'relative',
//   },
//   postImage: {
//     width: '100%',
//     height: 240,
//   },
//   noImagePlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageCountBadge: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   imageCountText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   imageOverlay: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//   },
//   newBadge: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   newBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   discountBadge: {
//     backgroundColor: '#e74c3c',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   discountBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   postContent: {
//     padding: 16,
//   },
//   postHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   postTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     flex: 1,
//     marginRight: 8,
//     fontFamily: 'Lato-SemiBold',
//   },
//   postDescription: {
//     fontSize: 14,
//     lineHeight: 20,
//     marginBottom: 12,
//     fontFamily: 'Lato-Regular',
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   postPrice: {
//     fontSize: 20,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   discountPrice: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginRight: 8,
//     fontFamily: 'Lato-Bold',
//   },
//   originalPrice: {
//     fontSize: 14,
//     textDecorationLine: 'line-through',
//     fontFamily: 'Lato-Regular',
//   },
//   postFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginRight: 8,
//   },
//   postLocation: {
//     fontSize: 12,
//     marginLeft: 4,
//     fontFamily: 'Lato-Regular',
//   },
//   postDate: {
//     fontSize: 12,
//     fontFamily: 'Lato-Regular',
//   },
//   interactionContainer: {
//     flexDirection: 'row',
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   interactionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   interactionText: {
//     fontSize: 14,
//     marginLeft: 4,
//     fontFamily: 'Lato-Regular',
//   },
//   videoContainer: {
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   videoDuration: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   durationText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   postText: {
//     fontSize: 15,
//     flex: 1,
//     marginRight: 8,
//     lineHeight: 22,
//     fontFamily: 'Lato-Regular',
//   },
//   postStats: {
//     flexDirection: 'row',
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   postStat: {
//     fontSize: 14,
//     marginLeft: 4,
//     fontFamily: 'Lato-Regular',
//   },
//   moreButton: {
//     padding: 4,
//   },
//   loadingContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     fontFamily: 'Lato-Regular',
//   },
//   emptyContainer: {
//     padding: 40,
//     alignItems: 'center',
//     marginHorizontal: 16,
//     borderRadius: 16,
//   },
//   emptyText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 16,
//     lineHeight: 22,
//     fontFamily: 'Lato-Regular',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   modalContainer: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 24,
//     paddingBottom: 40,
//   },

 
//   modalHandle: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 24,
//     textAlign: 'center',
//     fontFamily: 'Lato-SemiBold',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   modalOptionText: {
//     fontSize: 16,
//     marginLeft: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   // Product Modal Styles
//   productModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'flex-end',
//   },
//   productModalContainer: {
//     height: '90%',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     overflow: 'hidden',
//   },
//   productCloseButton: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     zIndex: 10,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   productImageContainer: {
//     height: 300,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   productModalImage: {
//     width: '100%',
//     height: '100%',
//   },
//   productPlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageDotsContainer: {
//     position: 'absolute',
//     bottom: 20,
//     flexDirection: 'row',
//   },
//   imageDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   navArrow: {
//     position: 'absolute',
//     top: '50%',
//     transform: [{ translateY: -12 }],
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   prevArrow: {
//     left: 16,
//   },
//   nextArrow: {
//     right: 16,
//   },
//   productDetailsContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   productHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   productModalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     flex: 1,
//     marginRight: 12,
//     fontFamily: 'Lato-Bold',
//   },
//   productPriceContainer: {
//     alignItems: 'flex-end',
//   },
//   productModalPrice: {
//     fontSize: 24,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   productOriginalPrice: {
//     fontSize: 16,
//     textDecorationLine: 'line-through',
//     fontFamily: 'Lato-Regular',
//   },
//   productDescriptionContainer: {
//     marginBottom: 20,
//   },
//   productDescriptionLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     fontFamily: 'Lato-SemiBold',
//   },
//   productDescription: {
//     fontSize: 15,
//     lineHeight: 22,
//     fontFamily: 'Lato-Regular',
//   },
//   productActions: {
//     flexDirection: 'row',
//     marginTop: 20,
//     marginBottom: 24,
//   },
//   productActionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     marginHorizontal: 6,
//   },
//   wishlistButton: {
//     borderWidth: 1,
//   },
//   productActionText: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//     fontFamily: 'Lato-SemiBold',
//   },
//   thumbnailContainer: {
//     marginTop: 20,
//   },
//   thumbnailTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     fontFamily: 'Lato-SemiBold',
//   },
//   thumbnail: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 8,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   activeThumbnail: {
//     borderColor: colors.primary,
//   },
//   thumbnailImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 6,
//   },
//   debugButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#e74c3c',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
    
//   editForm: {
//     width: '100%',
//     marginTop: 20,
//   },
//   editTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 24,
//     fontFamily: 'Lato-Bold',
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 8,
//     fontFamily: 'Lato-SemiBold',
//   },
//   input: {
//     borderWidth: 1.5,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: Platform.OS === 'ios' ? 14 : 12,
//     fontSize: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     marginTop: 8,
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 24,
//   },
//   radio: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     marginRight: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   radioSelected: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
//   radioText: {
//     fontSize: 15,
//     fontFamily: 'Lato-Regular',
//   },
//   editActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 24,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   saveButton: {
//     flex: 1,
//     marginLeft: 12,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   saveButtonDisabled: {
//     opacity: 0.7,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Lato-SemiBold',
//   },
//   cancelButton: {
//     flex: 1,
//     marginRight: 12,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Lato-SemiBold',
//   },
// });

// export default UserProfile;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UserProfile = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const userIdFromParams = route.params?.userId;
  
  // States
  const [selectedTab, setSelectedTab] = useState('marketplace');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState({
    visible: false,
    src: '',
    type: 'profile',
  });

  // User data states
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    country: '',
    gender: '',
    date_of_birth: '',
    active_mode: 'personal',
    profile_picture: '',
    cover_photo: '',
    is_verified: false
  });

  const [userProfileImage, setUserProfileImage] = useState('');
  const [userCoverImage, setUserCoverImage] = useState('');
  const [businessProfile, setBusinessProfile] = useState(null);
  const [catalogData, setCatalogData] = useState([]);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [followStats, setFollowStats] = useState({
    followers_count: 0,
    following_count: 0
  });

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    country: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    active_mode: 'personal'
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const scrollViewRef = useRef(null);

  // Animation effects
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check profile ownership
  useEffect(() => {
    const checkProfileOwnership = async () => {
      if (userIdFromParams) {
        const currentUserId = await AsyncStorage.getItem('userId');
        setIsOwnProfile(userIdFromParams === currentUserId);
      } else {
        const userDataStr = await AsyncStorage.getItem('userData');
        const userData = userDataStr ? JSON.parse(userDataStr) : null;
        if (userData?.id) {
          setIsOwnProfile(true);
        }
      }
    };
    checkProfileOwnership();
  }, [userIdFromParams]);

  // Get image URL utility function
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      return null;
    }

    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
      let url = imagePath;
      
      // Fix common URL issues
      if (url.includes('showa.essential.com.ngmedia')) {
        url = url.replace('showa.essential.com.ngmedia', 'showa.essential.com.ng/media');
      }
      
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      
      return url;
    }

    if (typeof imagePath === 'string') {
      let cleanPath = imagePath;
      if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
      }
      
      if (!cleanPath.startsWith('media/')) {
        if (cleanPath.includes('post') || 
            cleanPath.includes('Post') ||
            cleanPath.includes('image_') ||
            cleanPath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          cleanPath = 'media/' + cleanPath;
        }
      }
      
      return `${API_ROUTE_IMAGE}${cleanPath}`;
    }

    return null;
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;

      if (!token) {
        navigation.navigate('Login');
        return;
      }

      let response;
      try {
        response = await axios.get(`${API_ROUTE}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        if (parsed?.id) {
          response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      }

      if (response?.status === 200) {
        const data = response.data;
        setUserData(data);
        setEditForm({
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          country: data.country || '',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          phone: data.phone || '',
          active_mode: data.active_mode || 'personal'
        });

        if (data.profile_picture) {
          const profileImageUrl = getImageUrl(data.profile_picture);
          setUserProfileImage(profileImageUrl);
        }

        if (data.cover_photo) {
          const coverImageUrl = getImageUrl(data.cover_photo);
          setUserCoverImage(coverImageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data');
    }
  };

  // Fetch follow stats
  const fetchFollowStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userDataStr = await AsyncStorage.getItem('userData');
      const currentUser = userDataStr ? JSON.parse(userDataStr) : null;
      
      let endpoint;
      if (isOwnProfile || !userIdFromParams) {
        endpoint = `${API_ROUTE}/me/follow-stats/`;
      } else {
        endpoint = `${API_ROUTE}/users/${userIdFromParams}/follow-stats/`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setFollowStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  // Handle image selection with react-native-image-picker
  const handleImageSelection = async (type) => {
    try {
      Alert.alert(
        'Choose Image Source',
        'Select where to pick the image from',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Camera',
            onPress: () => handleImagePicker(type, 'camera')
          },
          {
            text: 'Gallery',
            onPress: () => handleImagePicker(type, 'gallery')
          }
        ]
      );
    } catch (error) {
      console.error('Image selection error:', error);
    }
  };

  const handleImagePicker = async (type, source) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
      saveToPhotos: false,
    };

    try {
      let response;
      if (source === 'camera') {
        response = await launchCamera(options);
      } else {
        response = await launchImageLibrary(options);
      }

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        
        const imageData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `${type}_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
          width: asset.width,
          height: asset.height,
        };

        if (type === 'profile') {
          setProfileImageFile(imageData);
          setUserProfileImage(asset.uri);
        } else {
          setCoverPhotoFile(imageData);
          setUserCoverImage(asset.uri);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    if (!editForm.name.trim()) {
      setError('Name is required');
      return;
    }

    setProfileLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();

      // Append text fields
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          formData.append(key, editForm[key].toString());
        }
      });

      // Append profile image if selected
      if (profileImageFile) {
        formData.append('profile_picture', {
          uri: profileImageFile.uri,
          type: profileImageFile.type || 'image/jpeg',
          name: profileImageFile.fileName || `profile_${Date.now()}.jpg`,
        });
      }

      // Append cover photo if selected
      if (coverPhotoFile) {
        formData.append('cover_photo', {
          uri: coverPhotoFile.uri,
          type: coverPhotoFile.type || 'image/jpeg',
          name: coverPhotoFile.fileName || `cover_${Date.now()}.jpg`,
        });
      }

      console.log('Updating profile with form data...');

      // Try multiple endpoints
      const attempts = [
        { method: 'PATCH', url: `${API_ROUTE}/profile/` },
        { method: 'PUT', url: `${API_ROUTE}/profile/` },
        { method: 'PATCH', url: `${API_ROUTE}/profile/update/` },
        { method: 'POST', url: `${API_ROUTE}/profile/update/` },
      ];

      let response;
      let lastError;

      for (const attempt of attempts) {
        try {
          console.log(`Trying ${attempt.method} ${attempt.url}`);
          
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          };

          if (attempt.method === 'POST') {
            response = await axios.post(attempt.url, formData, config);
          } else if (attempt.method === 'PUT') {
            response = await axios.put(attempt.url, formData, config);
          } else {
            response = await axios.patch(attempt.url, formData, config);
          }

          if (response.status === 200 || response.status === 201) {
            console.log('Profile update successful with endpoint:', attempt.url);
            break;
          }
        } catch (error) {
          lastError = error;
          console.log(`Failed with ${attempt.url}:`, error.response?.data || error.message);
          continue;
        }
      }

      if (!response) {
        throw lastError || new Error('Update failed - no endpoint worked');
      }

      // Update local state
      const updatedData = response.data;
      console.log('Updated data:', updatedData);
      setUserData(updatedData);
      
      // Update images if they were changed
      if (updatedData.profile_picture) {
        const newProfileImage = getImageUrl(updatedData.profile_picture);
        console.log('New profile image URL:', newProfileImage);
        setUserProfileImage(newProfileImage);
        setProfileImageFile(null);
      }
      
      if (updatedData.cover_photo) {
        const newCoverImage = getImageUrl(updatedData.cover_photo);
        console.log('New cover image URL:', newCoverImage);
        setUserCoverImage(newCoverImage);
        setCoverPhotoFile(null);
      }

      // Update AsyncStorage
      const existingData = await AsyncStorage.getItem('userData');
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        const mergedData = {
          ...parsedData,
          ...updatedData
        };
        await AsyncStorage.setItem('userData', JSON.stringify(mergedData));
        console.log('Updated AsyncStorage data');
      }

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Update error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      let errorMsg = 'Failed to update profile. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          // Extract first error message
          const errors = Object.values(errorData).flat();
          if (errors.length > 0) {
            errorMsg = errors[0];
          } else if (errorData.detail) {
            errorMsg = errorData.detail;
          } else if (errorData.message) {
            errorMsg = errorData.message;
          }
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        }
      }
      
      setError(errorMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userDataStr = await AsyncStorage.getItem('userData');
      const currentUser = userDataStr ? JSON.parse(userDataStr) : null;
      const userId = isOwnProfile ? currentUser?.id : userIdFromParams;

      // Fetch marketplace posts
      const marketplaceEndpoint = userId ? 
        `${API_ROUTE}/user-listings/${userId}/` : 
        `${API_ROUTE}/my-listings/`;
      
      const marketplaceRes = await axios.get(marketplaceEndpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const processedPosts = (marketplaceRes.data || []).map(item => ({
        ...item,
        images: Array.isArray(item.images)
          ? item.images.map(img => ({
              ...img,
              image: getImageUrl(img.image)
            }))
          : []
      }));
      setMarketplacePosts(processedPosts);

      // Fetch tweets/posts
      const tweetsEndpoint = userId ? 
        `${API_ROUTE}/user-posts/${userId}/` : 
        `${API_ROUTE}/my-posts/`;
      
      const tweetsRes = await axios.get(tweetsEndpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const processedTweets = (tweetsRes.data || []).map(item => ({
        ...item,
        image: getImageUrl(item.image || item.media)
      }));
      setTweets(processedTweets);

      // Fetch videos
      const videosEndpoint = userId ? 
        `${API_ROUTE}/user-shorts/${userId}/` : 
        `${API_ROUTE}/my-shorts/`;
      
      const videosRes = await axios.get(videosEndpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const processedVideos = (videosRes.data || []).map(item => ({
        ...item,
        video: getImageUrl(item.video),
        thumbnail: getImageUrl(item.thumbnail)
      }));
      setUserVideos(processedVideos);

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUserData(),
          fetchFollowStats(),
          fetchUserPosts(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isOwnProfile, userIdFromParams]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate age
  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format number
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Gender options for selection
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  // Render marketplace post
  const renderMarketplacePost = ({ item }) => (
    <TouchableOpacity
      style={[styles.marketplaceCard, { backgroundColor: colors.card }]}
      onPress={() => {
        setSelectedProduct(item);
        setProductModalVisible(true);
      }}
      activeOpacity={0.9}
    >
      <View style={styles.marketplaceImageContainer}>
        {item.images?.[0]?.image ? (
          <Image
            source={{ uri: item.images[0].image }}
            style={styles.marketplaceImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.marketplaceImagePlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="cube-outline" size={40} color={colors.textSecondary} />
          </View>
        )}
      </View>
      
      <View style={styles.marketplaceContent}>
        <Text style={[styles.marketplaceTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title || 'No Title'}
        </Text>
        <Text style={[styles.marketplacePrice, { color: colors.primary }]}>
          ₦{parseFloat(item.price || 0).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render tweet
  const renderTweet = ({ item }) => (
    <View style={[styles.tweetCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.tweetContent, { color: colors.text }]}>
        {item.content || 'No content'}
      </Text>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.tweetImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  // Render profile header
  const renderProfileHeader = () => (
    <Animated.View style={[styles.profileHeader, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      {/* Cover Image */}
      <TouchableOpacity
        onPress={() => userCoverImage && setFullScreenImage({
          visible: true,
          src: userCoverImage,
          type: 'cover'
        })}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={userCoverImage ? { uri: userCoverImage } : {uri:'https://www.gov.kz/uploads/2024/3/5/241efce82619d6785221985f79b3edf3_original.53958.jpg'}}
          style={styles.coverImage}
          resizeMode="cover"
        >
          {isOwnProfile && !userCoverImage && (
            <TouchableOpacity
              style={[styles.addCoverButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)' }]}
              onPress={() => handleImageSelection('cover')}
            >
              <Icon name="camera-outline" size={24} color="#fff" />
              <Text style={styles.addCoverText}>Add Cover</Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      </TouchableOpacity>

      {/* Profile Image and Info */}
      <View style={styles.profileInfoContainer}>
        <View style={styles.profileImageSection}>
          <TouchableOpacity
            onPress={() => userProfileImage && setFullScreenImage({
              visible: true,
              src: userProfileImage,
              type: 'profile'
            })}
            style={styles.profileImageWrapper}
          >
            <Image
              source={userProfileImage ? 
                { uri: userProfileImage } : 
                require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={[styles.profileImage, { borderColor: colors.card }]}
            />
            {isOwnProfile && (
              <TouchableOpacity
                style={[styles.changePhotoButton, { backgroundColor: colors.primary }]}
                onPress={() => handleImageSelection('profile')}
              >
                <Icon name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          
          <View style={styles.profileTextInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {userData.name || 'No Name'}
              </Text>
              {userData.is_verified && (
                <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.verifiedBadge} />
              )}
            </View>
            <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
              @{userData.username || 'username'}
            </Text>
          </View>
        </View>

        {/* Bio */}
        {userData.bio && (
          <Text style={[styles.profileBio, { color: colors.text }]}>
            {userData.bio}
          </Text>
        )}

        {/* Stats */}
        <View style={[styles.statsContainer, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
          <TouchableOpacity style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatNumber(followStats.following_count)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Following
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatNumber(followStats.followers_count)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Followers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatNumber(marketplacePosts.length + tweets.length + userVideos.length)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Posts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isOwnProfile ? (
            <>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => setIsEditing(true)}
              >
                <Icon name="create-outline" size={18} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.settingsButton, { borderColor: colors.border }]}
                onPress={() => navigation.navigate('Settings')}
              >
                <Icon name="settings-outline" size={18} color={colors.text} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.messageButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('PrivateChat', {
                  receiverId: userIdFromParams,
                  name: userData.name,
                  profile_image: userProfileImage
                })}
              >
                <Icon name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.followButton, { borderColor: colors.primary }]}
              >
                <Icon name="person-add-outline" size={18} color={colors.primary} />
                <Text style={[styles.followButtonText, { color: colors.primary }]}>
                  Follow
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          {userData.country && (
            <View style={styles.infoItem}>
              <Icon name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {userData.country}
              </Text>
            </View>
          )}
          {userData.gender && (
            <View style={styles.infoItem}>
              <Icon name="person-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {genderOptions.find(g => g.value === userData.gender)?.label || userData.gender}
              </Text>
            </View>
          )}
          {userData.date_of_birth && (
            <View style={styles.infoItem}>
              <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Born {formatDate(userData.date_of_birth)}
                {calculateAge(userData.date_of_birth) && (
                  <Text style={[styles.ageText, { color: colors.textSecondary }]}> • {calculateAge(userData.date_of_birth)} years</Text>
                )}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );

  // Render edit form
  const renderEditForm = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.editFormContainer, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.editFormContent}
      >
        <View style={[styles.editForm, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={[styles.editFormHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                setError('');
                setSuccessMessage('');
                // Reset form
                setEditForm({
                  name: userData.name || '',
                  username: userData.username || '',
                  email: userData.email || '',
                  bio: userData.bio || '',
                  country: userData.country || '',
                  gender: userData.gender || '',
                  date_of_birth: userData.date_of_birth ? userData.date_of_birth.split('T')[0] : '',
                  phone: userData.phone || '',
                  active_mode: userData.active_mode || 'personal'
                });
                setProfileImageFile(null);
                setCoverPhotoFile(null);
              }}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.editFormTitle, { color: colors.text }]}>
              Edit Profile
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Messages */}
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: isDark ? '#2C1810' : '#FEF2F2' }]}>
              <Icon name="alert-circle" size={20} color="#DC2626" />
              <Text style={[styles.errorText, { color: isDark ? '#FCA5A5' : '#DC2626' }]}>{error}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={[styles.successContainer, { backgroundColor: isDark ? '#052E16' : '#D1FAE5' }]}>
              <Icon name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.successText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Image Upload Section */}
          <View style={styles.imageUploadSection}>
            {/* Cover Photo */}
            <TouchableOpacity
              onPress={() => handleImageSelection('cover')}
              style={styles.coverUploadSection}
            >
              <ImageBackground
                source={userCoverImage ? { uri: userCoverImage } : {uri: 'https://avatars.mds.yandex.net/i?id=f515c332923071f3ba20460a8c44246daf166f3c-12822362-images-thumbs&n=13'}}
                style={styles.coverPreview}
                resizeMode="cover"
              >
                <View style={[styles.coverOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
                  <Icon name="camera-outline" size={28} color="#fff" />
                  <Text style={styles.uploadLabel}>Change Cover Photo</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* Profile Photo */}
            <View style={styles.profileUploadSection}>
              <TouchableOpacity
                onPress={() => handleImageSelection('profile')}
                style={styles.profileImageUpload}
              >
                <Image
                  source={userProfileImage ? 
                    { uri: userProfileImage } : 
                    require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={[styles.profilePreview, { borderColor: colors.card }]}
                />
                <View style={[styles.profileUploadOverlay, { backgroundColor: colors.primary }]}>
                  <Icon name="camera" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.profileUploadHint, { color: colors.textSecondary }]}>
                Tap to change profile photo
              </Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formFields}>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Full Name *</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={editForm.name}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Username */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Username *</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={editForm.username}
                onChangeText={(text) => setEditForm({...editForm, username: text})}
                placeholder="Choose a username"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
              />
            </View>

            {/* Bio */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Bio</Text>
              <TextInput
                style={[styles.formInput, styles.textArea, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm({...editForm, bio: text})}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                maxLength={160}
              />
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {editForm.bio?.length || 0}/160
              </Text>
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={editForm.email}
                onChangeText={(text) => setEditForm({...editForm, email: text})}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={editForm.phone}
                onChangeText={(text) => setEditForm({...editForm, phone: text})}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            {/* Country */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Country</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={editForm.country}
                onChangeText={(text) => setEditForm({...editForm, country: text})}
                placeholder="Enter your country"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Gender */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Gender</Text>
              <View style={styles.genderOptions}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender.value}
                    style={[
                      styles.genderOption,
                      editForm.gender === gender.value && styles.genderOptionSelected,
                      { 
                        borderColor: colors.border,
                        backgroundColor: editForm.gender === gender.value ? colors.primary : colors.backgroundSecondary
                      }
                    ]}
                    onPress={() => setEditForm({...editForm, gender: gender.value})}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      { color: editForm.gender === gender.value ? '#fff' : colors.text }
                    ]}>
                      {gender.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Date of Birth</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={editForm.date_of_birth}
                onChangeText={(text) => setEditForm({...editForm, date_of_birth: text})}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
              {editForm.date_of_birth && (
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                  Age: {calculateAge(editForm.date_of_birth) || 'N/A'} years
                </Text>
              )}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { 
              backgroundColor: colors.primary,
              opacity: profileLoading ? 0.7 : 1
            }]}
            onPress={updateUserProfile}
            disabled={profileLoading}
          >
            {profileLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="save-outline" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => setIsEditing(false)}
            disabled={profileLoading}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // Render content based on tab
  const renderContent = () => {
    const data = selectedTab === 'marketplace' ? marketplacePosts :
                 selectedTab === 'tweets' ? tweets :
                 userVideos;
    
    const emptyMessage = isOwnProfile ?
      `You haven't posted any ${selectedTab} yet.` :
      `This user hasn't posted any ${selectedTab} yet.`;

    if (data.length === 0) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
          <Icon 
            name={
              selectedTab === 'marketplace' ? 'cart-outline' :
              selectedTab === 'tweets' ? 'chatbubble-outline' :
              'videocam-outline'
            } 
            size={60} 
            color={colors.textSecondary} 
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {emptyMessage}
          </Text>
          {isOwnProfile && selectedTab === 'marketplace' && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CreateListing')}
            >
              <Text style={styles.createButtonText}>Create Listing</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={selectedTab === 'marketplace' ? renderMarketplacePost : renderTweet}
        keyExtractor={(item) => item.id.toString()}
        numColumns={selectedTab === 'marketplace' ? 2 : 1}
        contentContainerStyle={styles.contentList}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />

      {isEditing ? (
        renderEditForm()
      ) : (
        <>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            >
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {userData.name || 'Profile'}
            </Text>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setModalVisible(true)}
            >
              <Icon name="ellipsis-vertical" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Profile Content */}
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {renderProfileHeader()}
            
            {/* Tabs */}
            <View style={[styles.tabContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              {['marketplace', 'tweets', 'videos'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    selectedTab === tab && styles.tabActive,
                    selectedTab === tab && { borderBottomColor: colors.primary }
                  ]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Icon
                    name={
                      tab === 'marketplace' ? 'cart-outline' :
                      tab === 'tweets' ? 'chatbubble-outline' :
                      'videocam-outline'
                    }
                    size={22}
                    color={selectedTab === tab ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[
                    styles.tabText,
                    { color: selectedTab === tab ? colors.primary : colors.textSecondary }
                  ]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                  <View style={[
                    styles.tabBadge,
                    { backgroundColor: selectedTab === tab ? colors.primary : colors.textSecondary }
                  ]}>
                    <Text style={styles.tabBadgeText}>
                      {tab === 'marketplace' ? marketplacePosts.length :
                       tab === 'tweets' ? tweets.length :
                       userVideos.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Content */}
            {renderContent()}
          </ScrollView>
        </>
      )}

      {/* Full Screen Image Modal */}
      <Modal
        visible={fullScreenImage.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setFullScreenImage({ visible: false, src: '', type: '' })}
      >
        <View style={[styles.fullScreenModal, { backgroundColor: '#000' }]}>
          <TouchableOpacity
            style={[styles.fullScreenClose, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => setFullScreenImage({ visible: false, src: '', type: '' })}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: fullScreenImage.src }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <View style={[styles.fullScreenLabel, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Text style={styles.fullScreenLabelText}>
              {fullScreenImage.type === 'profile' ? 'Profile Picture' : 'Cover Photo'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {isOwnProfile && (
              <>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    setIsEditing(true);
                  }}
                >
                  <Icon name="create-outline" size={22} color={colors.text} />
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    Edit Profile
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => navigation.navigate('Settings')}
                >
                  <Icon name="settings-outline" size={22} color={colors.text} />
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    Settings
                  </Text>
                </TouchableOpacity>
                
                <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />
              </>
            )}
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={22} color={colors.text} />
              <Text style={[styles.modalOptionText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileHeader: {
    marginBottom: 8,
  },
  coverImage: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addCoverButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addCoverText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  profileInfoContainer: {
    padding: 20,
  },
  profileImageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    backgroundColor: '#f0f0f0',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileTextInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  profileUsername: {
    fontSize: 16,
    marginTop: 4,
  },
  profileBio: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  settingsButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1.5,
    gap: 8,
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  additionalInfo: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  ageText: {
    fontSize: 13,
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  contentList: {
    padding: 8,
  },
  marketplaceCard: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  marketplaceImageContainer: {
    height: 140,
  },
  marketplaceImage: {
    width: '100%',
    height: '100%',
  },
  marketplaceImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketplaceContent: {
    padding: 12,
  },
  marketplaceTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  marketplacePrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  tweetCard: {
    padding: 16,
    borderRadius: 12,
    margin: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tweetContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  tweetImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  createButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  editFormContainer: {
    flex: 1,
  },
  editFormContent: {
    flexGrow: 1,
  },
  editForm: {
    flex: 1,
    paddingBottom: 40,
  },
  editFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  editFormTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  successText: {
    fontSize: 14,
    flex: 1,
  },
  imageUploadSection: {
    marginTop: 16,
  },
  coverUploadSection: {
    height: 120,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverPreview: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadLabel: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  profileUploadSection: {
    alignItems: 'center',
    marginTop: -30,
    marginBottom: 24,
  },
  profileImageUpload: {
    position: 'relative',
  },
  profilePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    backgroundColor: '#f0f0f0',
  },
  profileUploadOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileUploadHint: {
    marginTop: 10,
    fontSize: 13,
  },
  formFields: {
    paddingHorizontal: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  genderOptionSelected: {
    borderColor: 'transparent',
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  fullScreenLabel: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  fullScreenLabelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  modalDivider: {
    height: 1,
    marginHorizontal: 16,
  },
});

export default UserProfile;

