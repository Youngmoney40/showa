
// import React, {useState, useEffect} from "react";
// import { 
//   View, 
//   Text, 
//   Image, 
//   ScrollView, 
//   StyleSheet, 
//   Alert, 
//   TouchableOpacity, 
//   Dimensions,
//   ActivityIndicator,
//   Linking
// } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Icon from 'react-native-vector-icons/Ionicons';
// import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
// import colors from "../theme/colors";

// const { width } = Dimensions.get('window');

// export default function ListingDetails({navigation, route}) {
//     const {item} = route.params;
//     const [listData, setListing] = useState(null);
//     const [activeImageIndex, setActiveImageIndex] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [userData, setUserData] = useState([]);
//     const [userProfileImage, setUserProfileImage] = useState('');
    

//     const fetchUserData = async (sellerid) => {
    
//         const userID = sellerid;
//         console.log('user id', userID)
//         try {
//           const token = await AsyncStorage.getItem('userToken');
    
//           const response = await axios.get(`${API_ROUTE}/user/${sellerid}/`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           });
    
//           if (response.status === 200 || response.status === 201) {
//             setUserData(response.data);
//             const baseURL = `${API_ROUTE_IMAGE}`;
//             const profilePicture = response.data.profile_picture
//               ? `${baseURL}${response.data.profile_picture}`
//               : null;
//             setUserProfileImage(profilePicture);
//           }
//         } catch (error) {
//           //console.error('Error fetching usersss:', error.response?.data || error.message);
//           if (error.response?.status === 401) {
//             navigation.navigate('LoginScreen');
//           }
//           setUserProfileImage(null);
//         }
//       };
//     // const fetchUserBusinessProfileData = async (sellerid) => {
    
//     //     const userID = sellerid;
//     //     console.log('user id', userID)
//     //     try {
//     //       const token = await AsyncStorage.getItem('userToken');
    
//     //       const response = await axios.get(`${API_ROUTE}/business-user-profile/${sellerid}/`, {
//     //         headers: {
//     //           Authorization: `Bearer ${token}`,
//     //           'Content-Type': 'application/json',
//     //         },
//     //       });
    
//     //       if (response.status === 200 || response.status === 201) {
//     //         setUserData(response.data);
//     //         const baseURL = `${API_ROUTE_IMAGE}`;
//     //         const profilePicture = response.data.profile_picture
//     //           ? `${baseURL}${response.data.profile_picture}`
//     //           : null;
//     //         setUserProfileImage(profilePicture);
//     //         console.log('business profile fectch', response.data)
//     //       }
//     //     } catch (error) {
//     //       console.error('Error fetching business profile:', error.response?.data || error.message);
//     //       if (error.response?.status === 401) {
//     //         navigation.navigate('LoginScreen');
//     //       }
//     //       setUserProfileImage(null);
//     //     }
//     //   };

//     useEffect(() => {
//       const fetchListing = async() => {
//         if (!item) {
//            Alert.alert('Error', 'No item found');
//            return;
//         }
//         try {
//           const token = await AsyncStorage.getItem('userToken');
//           const res = await axios.get(`${API_ROUTE}/listing/${item}/`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//           });
//           if (res.status === 200 || res.status === 201) {
//             setListing(res.data);
//             console.log('dataaaa',res.data.seller)
//             // setSellerId(res.data.seller)
//             fetchUserData(res.data.seller);
//             // fetchUserBusinessProfileData(res.data.seller);
//           }
//         } catch (error) {
//             Alert.alert('Error', 'Failed to fetch listing details');
//             console.error('Error fetching listing:', error.message);
//         } finally {
//           setLoading(false);
//         }
//       };
//        fetchListing();
//     }, [item]);

//     useEffect(()=>{
//         fetchUserData();
       
//     },[])

//     const handleChatWithSeller = () => {

//                    navigation.navigate('BPrivateChat', {
//                         receiverId: userData.id,
//                         name: userData.name,
//                         profile_image: userData.profile_picture,
//                         chatType: 'single',
//                     });


//        // navigation.navigate('Chat', { sellerId: listData?.seller });
//     };

//     const openMaps = () => {
//       if (!listData?.location) {
//         Alert.alert('Location not available', 'Seller has not provided location details');
//         return;
//       }
      
//       const locationQuery = encodeURIComponent(listData.location);
//       const url = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
      
//       Linking.canOpenURL(url).then(supported => {
//         if (supported) {
//           Linking.openURL(url);
//         } else {
//           Alert.alert('Error', 'Unable to open maps app');
//         }
//       }).catch(err => {
//         console.error('Error opening maps:', err);
//       });
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#0d64dd" />
//             </View>
//         );
//     }

//     if (!listData) {
//         return (
//             <View style={styles.errorContainer}>
//                 <Icon name="warning-outline" size={50} color="#FF6B6B" />
//                 <Text style={styles.errorText}>Failed to load listing details</Text>
//                 <TouchableOpacity 
//                     style={styles.retryButton}
//                     onPress={() => navigation.goBack()}
//                 >
//                     <Text style={styles.retryButtonText}>Go Back</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity 
//                     style={styles.backButton}
//                     onPress={() => navigation.goBack()}
//                 >
//                     <Icon name="arrow-back" size={24} color="#333" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Product Details</Text>
//                 <View style={{width: 24}} />
//             </View>

//             <ScrollView style={styles.scrollContainer}>
//                 {/* Main Image */}
//                 <View style={styles.mainImageContainer}>
//                     <Image 
//                         source={{ uri: API_ROUTE_IMAGE + listData.images[activeImageIndex].image }}
//                         style={styles.mainImage}
//                         resizeMode="contain"
//                     />
//                 </View>
                
//                 {/* Thumbnails */}
//                 <ScrollView 
//                     horizontal 
//                     showsHorizontalScrollIndicator={false}
//                     contentContainerStyle={styles.imageThumbnailContainer}
//                 >
//                     {listData.images.map((img, index) => (
//                         <TouchableOpacity 
//                             key={img.id} 
//                             onPress={() => setActiveImageIndex(index)}
//                             style={[
//                                 styles.thumbnail,
//                                 index === activeImageIndex && styles.activeThumbnail
//                             ]}
//                         >
//                             <Image 
//                                 source={{ uri: API_ROUTE_IMAGE + img.image }}
//                                 style={styles.thumbnailImage}
//                             />
//                         </TouchableOpacity>
//                     ))}
//                 </ScrollView>

//                 {/* Product Info */}
//                 <View style={styles.contentContainer}>
//                     <View style={styles.priceRow}>
//                         <Text style={styles.price}>₦{parseFloat(listData.price).toLocaleString()}</Text>
//                         <TouchableOpacity style={styles.favoriteButton}>
//                             <Icon name="heart-outline" size={24} color="#FF6B6B" />
//                         </TouchableOpacity>
//                     </View>
                    
//                     <Text style={styles.title}>{listData.title}</Text>
                    
//                     <View style={styles.metaContainer}>
//                         <View style={styles.metaItem}>
//                             <Icon name="time-outline" size={16} color="#666" />
//                             <Text style={styles.metaText}>Posted {new Date(listData.created).toLocaleDateString()}</Text>
//                         </View>
//                         {listData.location && (
//                             <View style={styles.metaItem}>
//                                 <Icon name="location-outline" size={16} color="#666" />
//                                 <Text style={styles.metaText}>{listData.location}</Text>
//                             </View>
//                         )}
//                     </View>
                    
//                     <View style={styles.divider} />
                    
//                     <Text style={styles.sectionTitle}>Description</Text>
//                     <Text style={styles.description}>{listData.description}</Text>
                    
//                     <View style={styles.divider} />
                    
//                     <Text style={styles.sectionTitle}>Features</Text>
//                     {listData.description.split('\n').filter(f => f.trim()).map((feature, index) => (
//                         <View key={index} style={styles.featureItem}>
//                             <Icon name="checkmark" size={16} color="#4CAF50" />
//                             <Text style={styles.featureText}>{feature}</Text>
//                         </View>
//                     ))}
                    
//                     {listData.location && (
//     <>
//         <View style={styles.divider} />
//         <Text style={styles.sectionTitle}>Seller Information</Text>
        
//         <View style={styles.sellerContainer}>
//             <View style={styles.sellerProfile}>
//                 <Image
//                     source={
//                         userProfileImage 
//                             ? { uri: userProfileImage }
//                             : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                     }
//                     style={styles.profileImage}
//                 />
//                 <View style={styles.sellerInfo}>
//                     <Text style={styles.sellerName}>{userData.name || 'Seller'}</Text>
//                     <View style={styles.verificationBadge}>
//                         <Icon 
//                             name={userData.is_verified ? "checkmark-circle" : "close-circle"} 
//                             size={16} 
//                             color={userData.is_verified ? "#4CAF50" : "#F44336"} 
//                         />
//                         <View>
//                              <Text style={styles.verificationText}>
//                             {userData.is_verified ? 'Verified Seller' : 'Not Verified'}
//                         </Text>
//                         <Text style={styles.verificationText2}>
//                         Excellent in delivery
//                         </Text>
//                         </View>
                       
//                     </View>
//                 </View>
//             </View>

            

//             <View style={styles.sellerContact}>
//                 <TouchableOpacity 
//                     style={styles.contactButton}
//                     onPress={() => Linking.openURL(`tel:${userData.phone}`)}
//                 >
//                     <Icon name="call-outline" size={18} color="#fff" />
//                     <Text style={styles.contactButtonText}>Call</Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                     style={[styles.contactButton, styles.messageButton]}
//                     onPress={handleChatWithSeller}
//                 >
//                     <Icon name="chatbubble-ellipses-outline" size={18} color="#fff" />
//                     <Text style={styles.contactButtonText}>Message</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>

//         <View style={styles.sellerLocation}>
//             <Icon name="location-outline" size={20} color="#FF6B6B" style={styles.locationIcon} />
//             <Text style={styles.locationText}>{listData.location}</Text>
//             <TouchableOpacity 
//                 style={styles.mapButton}
//                 onPress={openMaps}
//             >
//                 <Text style={styles.mapButtonText}>View on Map</Text>
//                 <Icon name="map-outline" size={16} color="#FF6B6B" />
//             </TouchableOpacity>
//         </View>
//         <Image source={require('../assets/images/nigeria-political-map.png')} style={styles.image}
//                     resizeMode="contain" />
//     </>
// )}
//                 </View>
//             </ScrollView>

//             <View style={styles.actionBar}>
//                 <TouchableOpacity 
//                     style={styles.chatButton}
//                     onPress={handleChatWithSeller}
//                 >
//                     <Icon name="chatbubble-ellipses" size={20} color="white" />
//                     <Text style={styles.chatButtonText}>I am interested</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     image: {
//     width: '100%',
//     height: 250,
//     borderRadius: 12,
//   },
//   sellerContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
// },
// sellerProfile: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
// },
// profileImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 2,
//     borderColor: '#eee',
// },
// sellerInfo: {
//     marginLeft: 16,
//     flex: 1,
// },
// sellerName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginBottom: 4,
// },
// verificationBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
// },
// verificationText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 6,
// },
// verificationText2: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 6,
// },
// sellerContact: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
// },
// contactButton: {
//     backgroundColor: colors.primary,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginHorizontal: 4,
// },
// messageButton: {
//     backgroundColor: '#4CAF50',
// },
// contactButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 8,
// },
// sellerLocation: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
// },
// locationIcon: {
//     marginRight: 8,
// },
// locationText: {
//     flex: 1,
//     fontSize: 15,
//     color: '#555',
// },
// mapButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
// },
// mapButtonText: {
//     color: colors.primary,
//     fontSize: 14,
//     fontWeight: '600',
//     marginRight: 4,
// },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     errorText: {
//         fontSize: 18,
//         color: '#333',
//         marginVertical: 20,
//         textAlign: 'center',
//     },
//     retryButton: {
//         backgroundColor: '#FF6B6B',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 5,
//     },
//     retryButtonText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//     },
//     backButton: {
//         padding: 8,
//     },
//     scrollContainer: {
//         flex: 1,
//     },
//     mainImageContainer: {
//         height: width * 0.7,
//         backgroundColor: '#f9f9f9',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     mainImage: {
//         width: '100%',
//         height: '100%',
//     },
//     imageThumbnailContainer: {
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//     },
//     thumbnail: {
//         width: 60,
//         height: 60,
//         borderRadius: 8,
//         marginRight: 10,
//         borderWidth: 1,
//         borderColor: '#eee',
//     },
//     activeThumbnail: {
//         borderColor: colors.primary,
//     },
//     thumbnailImage: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 6,
//     },
//     contentContainer: {
//         padding: 16,
//     },
//     priceRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     price: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#2C3E50',
//     },
//     favoriteButton: {
//         padding: 8,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 16,
//     },
//     metaContainer: {
//         marginBottom: 20,
//     },
//     metaItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 8,
//     },
//       profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#fff',
//     backgroundColor: '#eee',
//   },
//     metaText: {
//         fontSize: 14,
//         color: '#666',
//         marginLeft: 8,
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#eee',
//         marginVertical: 20,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#2C3E50',
//         marginBottom: 12,
//     },
//     description: {
//         fontSize: 15,
//         lineHeight: 22,
//         color: '#555',
//         marginBottom: 20,
//     },
//     featureItem: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         marginBottom: 10,
//     },
//     featureText: {
//         fontSize: 15,
//         lineHeight: 20,
//         color: '#555',
//         marginLeft: 10,
//         flex: 1,
//     },
//     locationCard: {
//         backgroundColor: '#f9f9f9',
//         borderRadius: 10,
//         padding: 16,
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     locationText: {
//         fontSize: 15,
//         color: '#555',
//         marginLeft: 10,
//         flex: 1,
//     },
//     viewOnMapButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     viewOnMapButtonText: {
//         color: colors.primary,
//         fontSize: 14,
//         fontWeight: '600',
//         marginRight: 4,
//     },
//     actionBar: {
//         padding: 16,
//         borderTopWidth: 1,
//         borderTopColor: '#eee',
//         backgroundColor: '#fff',
//     },
//     chatButton: {
//         backgroundColor: colors.primary,
//         borderRadius: 8,
//         padding: 16,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     chatButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: '600',
//         marginLeft: 10,
//     },
// });


// import React, { useState, useEffect } from "react";
// import { 
//   View, 
//   Text, 
//   Image, 
//   ScrollView, 
//   StyleSheet, 
//   Alert, 
//   TouchableOpacity, 
//   Dimensions,
//   ActivityIndicator,
//   Linking,
//   SafeAreaView,
//   Platform,
//   StatusBar
// } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Icon from 'react-native-vector-icons/Ionicons';
// import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
// import colors from "../theme/colors";

// const { width } = Dimensions.get('window');

// export default function ListingDetails({ navigation, route }) {
//   const { item } = route.params;
//   const [listData, setListing] = useState(null);
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const fetchUserData = async (sellerid) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/user/${sellerid}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setUserData(response.data);
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         navigation.navigate('LoginScreen');
//       }
//     }
//   };

//   const fetchListing = async () => {
//     if (!item) {
//       Alert.alert('Error', 'No item found');
//       return;
//     }
    
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await axios.get(`${API_ROUTE}/listing/${item}/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (res.status === 200) {
//         setListing(res.data);
//         fetchUserData(res.data.seller);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch listing details');
//       console.error('Error fetching listing:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchListing();
//   }, [item]);

//   const handleChatWithSeller = () => {
//     if (!userData) {
//       Alert.alert('Error', 'Seller information not available');
//       return;
//     }
    
//     navigation.navigate('BPrivateChat', {
//       receiverId: userData.id,
//       name: userData.name,
//       profile_image: userData.profile_picture,
//       chatType: 'single',
//     });
//   };

//   const handleCallSeller = () => {
//     if (!userData?.phone) {
//       Alert.alert('Contact Unavailable', 'Seller has not provided a contact number');
//       return;
//     }
    
//     Linking.openURL(`tel:${userData.phone}`);
//   };

//   const openMaps = () => {
//     if (!listData?.location) {
//       Alert.alert('Location not available', 'Seller has not provided location details');
//       return;
//     }
    
//     const locationQuery = encodeURIComponent(listData.location);
//     const url = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
    
//     Linking.canOpenURL(url).then(supported => {
//       if (supported) {
//         Linking.openURL(url);
//       } else {
//         Alert.alert('Error', 'Unable to open maps app');
//       }
//     });
//   };

//   const toggleFavorite = () => {
//     setIsFavorite(!isFavorite);
//     // TODO: Implement API call to add/remove from favorites
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={styles.loadingText}>Loading details...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (!listData) {
//     return (
//       <SafeAreaView style={styles.errorContainer}>
//         <Icon name="sad-outline" size={60} color={colors.primary} />
//         <Text style={styles.errorTitle}>Oops!</Text>
//         <Text style={styles.errorText}>We couldn't load the listing details.</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={20} color="#fff" />
//           <Text style={styles.retryButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   const getImageUrl = (imagePath) => {
//     return imagePath ? `${API_ROUTE_IMAGE}${imagePath}` : null;
//   };

//   const renderImageItem = ({ item, index }) => (
//     <View style={styles.imageSlide}>
//       <Image 
//         source={{ uri: getImageUrl(item.image) }}
//         style={styles.mainImage}
//         resizeMode="cover"
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="chevron-back" size={28} color="#333" />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.favoriteHeaderButton}
//           onPress={toggleFavorite}
//         >
//           <Icon 
//             name={isFavorite ? "heart" : "heart-outline"} 
//             size={26} 
//             color={isFavorite ? colors.primary : "#666"} 
//           />
//         </TouchableOpacity>
//       </View>

//       <ScrollView 
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.contentContainer}
//       >
//         {/* Image Gallery */}
//         <View style={styles.imageGallery}>
//           <Image 
//             source={{ uri: getImageUrl(listData.images[activeImageIndex]?.image) }}
//             style={styles.mainImage}
//             resizeMode="cover"
//           />
          
//           {/* Image Indicators */}
//           <View style={styles.imageIndicators}>
//             {listData.images.map((_, index) => (
//               <View 
//                 key={index}
//                 style={[
//                   styles.indicator,
//                   index === activeImageIndex && styles.activeIndicator
//                 ]}
//               />
//             ))}
//           </View>
//         </View>

//         {/* Thumbnail Scroll */}
//         {listData.images.length > 1 && (
//           <ScrollView 
//             horizontal 
//             showsHorizontalScrollIndicator={false}
//             style={styles.thumbnailScroll}
//             contentContainerStyle={styles.thumbnailContainer}
//           >
//             {listData.images.map((img, index) => (
//               <TouchableOpacity 
//                 key={img.id}
//                 onPress={() => setActiveImageIndex(index)}
//                 style={[
//                   styles.thumbnail,
//                   index === activeImageIndex && styles.activeThumbnail
//                 ]}
//               >
//                 <Image 
//                   source={{ uri: getImageUrl(img.image) }}
//                   style={styles.thumbnailImage}
//                   resizeMode="cover"
//                 />
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )}

//         {/* Product Info Card */}
//         <View style={styles.productCard}>
//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₦{parseFloat(listData.price).toLocaleString()}</Text>
//             <View style={styles.categoryTag}>
//               <Text style={styles.categoryText}>For Sale</Text>
//             </View>
//           </View>
          
//           <Text style={styles.title}>{listData.title}</Text>
          
//           <View style={styles.metaContainer}>
//             <View style={styles.metaRow}>
//               <View style={styles.metaItem}>
//                 <Icon name="time-outline" size={18} color="#666" />
//                 <Text style={styles.metaText}>
//                   {new Date(listData.created).toLocaleDateString('en-US', {
//                     month: 'short',
//                     day: 'numeric',
//                     year: 'numeric'
//                   })}
//                 </Text>
//               </View>
              
//               {listData.location && (
//                 <View style={styles.metaItem}>
//                   <Icon name="location-outline" size={18} color="#666" />
//                   <Text style={styles.metaText}>{listData.location}</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>

//         {/* Description Card */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>Description</Text>
//           <Text style={styles.description}>{listData.description}</Text>
          
//           {listData.description.includes('\n') && (
//             <>
//               <View style={styles.divider} />
//               <Text style={styles.sectionTitle}>Key Features</Text>
//               {listData.description.split('\n').filter(f => f.trim()).map((feature, index) => (
//                 <View key={index} style={styles.featureItem}>
//                   <Icon name="checkmark-circle" size={18} color={colors.success} />
//                   <Text style={styles.featureText}>{feature.trim()}</Text>
//                 </View>
//               ))}
//             </>
//           )}
//         </View>

//         {/* Seller Info Card */}
//         {userData && (
//           <View style={styles.sellerCard}>
//             <Text style={styles.sectionTitle}>Seller Information</Text>
            
//             <View style={styles.sellerProfile}>
//               <Image
//                 source={
//                   userData.profile_picture 
//                     ? { uri: getImageUrl(userData.profile_picture) }
//                     : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                 }
//                 style={styles.profileImage}
//               />
              
//               <View style={styles.sellerInfo}>
//                 <View style={styles.sellerNameRow}>
//                   <Text style={styles.sellerName}>{userData.name || 'Seller'}</Text>
//                   {userData.is_verified && (
//                     <Icon name="checkmark-circle" size={20} color={colors.success} />
//                   )}
//                 </View>
                
//                 <Text style={styles.sellerRating}>
//                   <Icon name="star" size={16} color="#FFC107" /> 
//                   {' Excellent in delivery'}
//                 </Text>
                
//                 <View style={styles.verificationBadge}>
//                   <Icon 
//                     name={userData.is_verified ? "shield-checkmark" : "shield-outline"} 
//                     size={16} 
//                     color={userData.is_verified ? colors.success : "#666"} 
//                   />
//                   <Text style={styles.verificationText}>
//                     {userData.is_verified ? 'Verified Seller' : 'Not Verified'}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Contact Buttons */}
//             <View style={styles.contactButtons}>
//               <TouchableOpacity 
//                 style={styles.contactButton}
//                 onPress={handleCallSeller}
//               >
//                 <Icon name="call-outline" size={20} color="#fff" />
//                 <Text style={styles.contactButtonText}>Call</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.contactButton, styles.messageButton]}
//                 onPress={handleChatWithSeller}
//               >
//                 <Icon name="chatbubble-outline" size={20} color="#fff" />
//                 <Text style={styles.contactButtonText}>Message</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Location Section */}
//             {listData.location && (
//               <View style={styles.locationSection}>
//                 <View style={styles.locationHeader}>
//                   <Icon name="location" size={22} color={colors.primary} />
//                   <Text style={styles.locationTitle}>Item Location</Text>
//                 </View>
//                 <Text style={styles.locationText}>{listData.location}</Text>
//                 <TouchableOpacity 
//                   style={styles.mapButton}
//                   onPress={openMaps}
//                 >
//                   <Icon name="map-outline" size={18} color={colors.primary} />
//                   <Text style={styles.mapButtonText}>View on Map</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         )}
//       </ScrollView>

//       {/* Fixed Action Button */}
//       <View style={styles.actionBar}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={handleChatWithSeller}
//         >
//           <Icon name="chatbubble-ellipses" size={22} color="#fff" />
//           <Text style={styles.actionButtonText}>I'm Interested</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#666',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   errorTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#333',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   retryButton: {
//     backgroundColor: colors.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   container: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingBottom: 100,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//   },
//   backButton: {
//     padding: 8,
//     marginLeft: -8,
//   },
//   favoriteHeaderButton: {
//     padding: 8,
//   },
//   imageGallery: {
//     position: 'relative',
//     height: width * 0.8,
//   },
//   mainImage: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#f5f5f5',
//   },
//   imageIndicators: {
//     position: 'absolute',
//     bottom: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     marginHorizontal: 4,
//   },
//   activeIndicator: {
//     backgroundColor: '#fff',
//     width: 24,
//   },
//   thumbnailScroll: {
//     marginTop: 12,
//   },
//   thumbnailContainer: {
//     paddingHorizontal: 16,
//   },
//   thumbnail: {
//     width: 70,
//     height: 70,
//     borderRadius: 8,
//     marginRight: 10,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     overflow: 'hidden',
//   },
//   activeThumbnail: {
//     borderColor: colors.primary,
//   },
//   thumbnailImage: {
//     width: '100%',
//     height: '100%',
//   },
//   productCard: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginTop: 8,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   price: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#2C3E50',
//   },
//   categoryTag: {
//     backgroundColor: colors.lightPrimary || '#E8F4FD',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   categoryText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: colors.primary,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#333',
//     lineHeight: 32,
//     marginBottom: 16,
//   },
//   metaContainer: {
//     marginTop: 4,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 20,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   metaText: {
//     fontSize: 15,
//     color: '#666',
//   },
//   sectionCard: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginTop: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 16,
//   },
//   description: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#555',
//     marginBottom: 20,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 20,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//     gap: 10,
//   },
//   featureText: {
//     fontSize: 16,
//     lineHeight: 22,
//     color: '#555',
//     flex: 1,
//   },
//   sellerCard: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginTop: 8,
//     marginBottom: 20,
//   },
//   sellerProfile: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   profileImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#f5f5f5',
//   },
//   sellerInfo: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   sellerNameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 4,
//   },
//   sellerName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2C3E50',
//   },
//   sellerRating: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   verificationBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   verificationText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   contactButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 24,
//   },
//   contactButton: {
//     flex: 1,
//     backgroundColor: colors.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//   },
//   messageButton: {
//     backgroundColor: colors.success || '#4CAF50',
//   },
//   contactButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   locationSection: {
//     backgroundColor: '#f9f9f9',
//     padding: 16,
//     borderRadius: 12,
//   },
//   locationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   locationTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2C3E50',
//   },
//   locationText: {
//     fontSize: 15,
//     color: '#555',
//     marginBottom: 12,
//     lineHeight: 22,
//   },
//   mapButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     alignSelf: 'flex-start',
//   },
//   mapButtonText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: colors.primary,
//   },
//   actionBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#0e0bceff',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     paddingBottom: Platform.OS === 'ios' ? 34 : 16,
//   },
//   actionButton: {
//     backgroundColor: colors.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 18,
//     borderRadius: 14,
//     gap: 10,
//     shadowColor: colors.primary,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },
// });

import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';
import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
import colors from "../theme/colors";
import { useTheme } from '../src/context/ThemeContext'; // Import ThemeContext

const { width } = Dimensions.get('window');

export default function ListingDetails({ navigation, route }) {
  const { colors: themeColors, isDark } = useTheme(); // Get theme colors
  const { item } = route.params;
  const [listData, setListing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchUserData = async (sellerid) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/user/${sellerid}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigation.navigate('LoginScreen');
      }
    }
  };

  const fetchListing = async () => {
    if (!item) {
      Alert.alert('Error', 'No item found');
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/listing/${item}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.status === 200) {
        setListing(res.data);
        fetchUserData(res.data.seller);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch listing details');
      console.error('Error fetching listing:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [item]);

  const handleChatWithSeller = () => {
    if (!userData) {
      Alert.alert('Error', 'Seller information not available');
      return;
    }
    
    navigation.navigate('BPrivateChat', {
      receiverId: userData.id,
      name: userData.name,
      profile_image: userData.profile_picture,
      chatType: 'single',
    });
  };

  const handleCallSeller = () => {
    if (!userData?.phone) {
      Alert.alert('Contact Unavailable', 'Seller has not provided a contact number');
      return;
    }
    
    Linking.openURL(`tel:${userData.phone}`);
  };

  const openMaps = () => {
    if (!listData?.location) {
      Alert.alert('Location not available', 'Seller has not provided location details');
      return;
    }
    
    const locationQuery = encodeURIComponent(listData.location);
    const url = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open maps app');
      }
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement API call to add/remove from favorites
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (!listData) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
        <Icon name="sad-outline" size={60} color={themeColors.primary} />
        <Text style={[styles.errorTitle, { color: themeColors.text }]}>Oops!</Text>
        <Text style={[styles.errorText, { color: themeColors.textSecondary }]}>We couldn't load the listing details.</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getImageUrl = (imagePath) => {
    return imagePath ? `${API_ROUTE_IMAGE}${imagePath}` : null;
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageSlide}>
      <Image 
        source={{ uri: getImageUrl(item.image) }}
        style={styles.mainImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={themeColors.card} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={28} color={themeColors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.favoriteHeaderButton}
          onPress={toggleFavorite}
        >
          <Icon 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={26} 
            color={isFavorite ? themeColors.primary : themeColors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <Image 
            source={{ uri: getImageUrl(listData.images[activeImageIndex]?.image) }}
            style={[styles.mainImage, { backgroundColor: themeColors.card }]}
            resizeMode="cover"
          />
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {listData.images.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
                  index === activeImageIndex && [styles.activeIndicator, { backgroundColor: '#fff' }]
                ]}
              />
            ))}
          </View>
        </View>

        {/* Thumbnail Scroll */}
        {listData.images.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={[styles.thumbnailScroll, { backgroundColor: themeColors.background }]}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {listData.images.map((img, index) => (
              <TouchableOpacity 
                key={img.id}
                onPress={() => setActiveImageIndex(index)}
                style={[
                  styles.thumbnail,
                  { borderColor: 'transparent' },
                  index === activeImageIndex && [styles.activeThumbnail, { borderColor: themeColors.primary }]
                ]}
              >
                <Image 
                  source={{ uri: getImageUrl(img.image) }}
                  style={[styles.thumbnailImage, { backgroundColor: themeColors.card }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Product Info Card */}
        <View style={[styles.productCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: themeColors.text }]}>₦{parseFloat(listData.price).toLocaleString()}</Text>
            <View style={[styles.categoryTag, { backgroundColor: isDark ? themeColors.backgroundSecondary : '#E8F4FD' }]}>
              <Text style={[styles.categoryText, { color: themeColors.primary }]}>For Sale</Text>
            </View>
          </View>
          
          <Text style={[styles.title, { color: themeColors.text }]}>{listData.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="time-outline" size={18} color={themeColors.textSecondary} />
                <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                  {new Date(listData.created).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
              
              {listData.location && (
                <View style={styles.metaItem}>
                  <Icon name="location-outline" size={18} color={themeColors.textSecondary} />
                  <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>{listData.location}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Description Card */}
        <View style={[styles.sectionCard, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Description</Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>{listData.description}</Text>
          
          {listData.description.includes('\n') && (
            <>
              <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Key Features</Text>
              {listData.description.split('\n').filter(f => f.trim()).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={18} color={themeColors.success || '#4CAF50'} />
                  <Text style={[styles.featureText, { color: themeColors.textSecondary }]}>{feature.trim()}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Seller Info Card */}
        {userData && (
          <View style={[styles.sellerCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Seller Information</Text>
            
            <View style={styles.sellerProfile}>
              <Image
                source={
                  userData.profile_picture 
                    ? { uri: getImageUrl(userData.profile_picture) }
                    : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                }
                style={[styles.profileImage, { backgroundColor: themeColors.backgroundSecondary }]}
              />
              
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={[styles.sellerName, { color: themeColors.text }]}>{userData.name || 'Seller'}</Text>
                  {userData.is_verified && (
                    <Icon name="checkmark-circle" size={20} color={themeColors.success || '#4CAF50'} />
                  )}
                </View>
                
                <Text style={[styles.sellerRating, { color: themeColors.textSecondary }]}>
                  <Icon name="star" size={16} color="#FFC107" /> 
                  {' Excellent in delivery'}
                </Text>
                
                <View style={styles.verificationBadge}>
                  <Icon 
                    name={userData.is_verified ? "shield-checkmark" : "shield-outline"} 
                    size={16} 
                    color={userData.is_verified ? (themeColors.success || '#4CAF50') : themeColors.textSecondary} 
                  />
                  <Text style={[styles.verificationText, { color: themeColors.textSecondary }]}>
                    {userData.is_verified ? 'Verified Seller' : 'Not Verified'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Buttons */}
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={[styles.contactButton, { backgroundColor: themeColors.primary }]}
                onPress={handleCallSeller}
              >
                <Icon name="call-outline" size={20} color="#fff" />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.contactButton, styles.messageButton, { backgroundColor: themeColors.success || '#4CAF50' }]}
                onPress={handleChatWithSeller}
              >
                <Icon name="chatbubble-outline" size={20} color="#fff" />
                <Text style={styles.contactButtonText}>Message</Text>
              </TouchableOpacity>
            </View>

            {/* Location Section */}
            {listData.location && (
              <View style={[styles.locationSection, { backgroundColor: themeColors.backgroundSecondary }]}>
                <View style={styles.locationHeader}>
                  <Icon name="location" size={22} color={themeColors.primary} />
                  <Text style={[styles.locationTitle, { color: themeColors.text }]}>Item Location</Text>
                </View>
                <Text style={[styles.locationText, { color: themeColors.textSecondary }]}>{listData.location}</Text>
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={openMaps}
                >
                  <Icon name="map-outline" size={18} color={themeColors.primary} />
                  <Text style={[styles.mapButtonText, { color: themeColors.primary }]}>View on Map</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Fixed Action Button */}
      <View style={[styles.actionBar, { 
        backgroundColor: themeColors.card,
        borderTopColor: themeColors.border 
      }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: themeColors.primary,
            shadowColor: isDark ? themeColors.primary : '#000',
            shadowOpacity: isDark ? 0.3 : 0.2,
          }]}
          onPress={handleChatWithSeller}
        >
          <Icon name="chatbubble-ellipses" size={22} color="#fff" />
          <Text style={styles.actionButtonText}>I'm Interested</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor handled inline
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor handled inline
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    // color handled inline
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor handled inline
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    // color handled inline
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    // color handled inline
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    // backgroundColor handled inline
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    // backgroundColor handled inline
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor handled inline
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  favoriteHeaderButton: {
    padding: 8,
  },
  imageGallery: {
    position: 'relative',
    height: width * 0.8,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    // backgroundColor handled inline
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // backgroundColor handled inline
    marginHorizontal: 4,
  },
  activeIndicator: {
    // backgroundColor handled inline
    width: 24,
  },
  thumbnailScroll: {
    marginTop: 12,
    // backgroundColor handled inline
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    // borderColor handled inline
    overflow: 'hidden',
  },
  activeThumbnail: {
    // borderColor handled inline
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    // backgroundColor handled inline
  },
  productCard: {
    // backgroundColor handled inline
    padding: 20,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    // color handled inline
  },
  categoryTag: {
    // backgroundColor handled inline
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    // color handled inline
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    // color handled inline
    lineHeight: 32,
    marginBottom: 16,
  },
  metaContainer: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 15,
    // color handled inline
  },
  sectionCard: {
    // backgroundColor handled inline
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    // color handled inline
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    // color handled inline
    marginBottom: 20,
  },
  divider: {
    height: 1,
    // backgroundColor handled inline
    marginVertical: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 22,
    // color handled inline
    flex: 1,
  },
  sellerCard: {
    // backgroundColor handled inline
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  sellerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    // backgroundColor handled inline
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '600',
    // color handled inline
  },
  sellerRating: {
    fontSize: 14,
    // color handled inline
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verificationText: {
    fontSize: 14,
    // color handled inline
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactButton: {
    flex: 1,
    // backgroundColor handled inline
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  messageButton: {
    // backgroundColor handled inline
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationSection: {
    // backgroundColor handled inline
    padding: 16,
    borderRadius: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    // color handled inline
  },
  locationText: {
    fontSize: 15,
    // color handled inline
    marginBottom: 12,
    lineHeight: 22,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: '600',
    // color handled inline
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor handled inline
    padding: 16,
    borderTopWidth: 1,
    // borderTopColor handled inline
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  actionButton: {
    // backgroundColor handled inline
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});