

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   Pressable,
//   StatusBar,
//   ActivityIndicator,
//   Platform,
//   RefreshControl,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { Share } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// export default function CatalogScreen({ navigation }) {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [userData, setUserData] = useState([]);
//   const [catalogData, setCatalogData] = useState([]);
//   const [profileData, setProfileData] = useState({});
//   const [logo, setLogo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         const profile = Array.isArray(response.data) ? response.data[0] : response.data;
//         setProfileData(profile);
//         if (profile.logo) {
//           setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
//         }
//       }
//     } catch (err) {
//       console.error('Failed to load profile', err);
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
//         timeout: 10000,
//       });

//       if (response.status === 200) {
//         setCatalogData(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching catalog:', error);
//     }
//   };

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchProfile(), fetchCatalogData()]);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadData();
//     }, [])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   const handleShare = async () => {
//     try {
//       const result = await Share.share({
//         title: 'Check out my catalog',
//         message: `Check out my products and services in the Showa app!`,
//         url: `https://showa.app/catalog`,
//       });
      
//       if (result.action === Share.sharedAction) {
//         console.log('Catalog shared successfully');
//       }
//       setModalVisible(false);
//     } catch (error) {
//       console.error('Error sharing catalog:', error);
//     }
//   };

//   const handleAddNewItem = () => {
//     setModalVisible(false);
//     navigation.navigate('AddItemToCatalog');
//   };

//   const renderHeader = () => (
//     <LinearGradient 
//       colors={['#4A6FFF', '#367BF5']} 
//       style={styles.header}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 0 }}
//     >
//       <View style={styles.headerContent}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButcton}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Icon name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
        
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>My Catalog</Text>
//           <Text style={styles.headerSubtitle}>
//             {catalogData.length} {catalogData.length === 1 ? 'item' : 'items'}
//           </Text>
//         </View>
        
//         <TouchableOpacity 
//           onPress={() => setModalVisible(true)}
//           style={styles.menuBdutton}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Icon name="more-vert" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );

//   const renderProfileBanner = () => {
//     if (!profileData?.id) return null;
    
//     return (
//       <View style={styles.profileBanner}>
//         <Image
//           source={
//             profileData?.image 
//               ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
//               : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//           }
//           style={styles.bannerImage}
//         />
//         <LinearGradient 
//           colors={['transparent', 'rgba(0,0,0,0.7)']} 
//           style={styles.bannerOverlay}
//         />
//         <View style={styles.bannerContent}>
//           <Text style={styles.businessName}>{profileData.name || 'Your Business'}</Text>
//           <Text style={styles.businessDescription}>
//             {profileData.description || 'Manage your products and services'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <View style={styles.emptyIconContainer}>
//         <Icon name="inventory" size={64} color="#C5C7D0" />
//       </View>
//       <Text style={styles.emptyTitle}>Your catalog is empty</Text>
//       <Text style={styles.emptySubtitle}>
//         Add your first product or service to start selling
//       </Text>
//       <TouchableOpacity 
//         style={styles.emptyActionButton}
//         onPress={handleAddNewItem}
//       >
//         <Icon name="add" size={20} color="#FFFFFF" style={styles.buttonIcon} />
//         <Text style={styles.emptyActionText}>Add First Item</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderCatalogItem = (item, index) => (
  
//     <TouchableOpacity 
//       key={index}
//       style={styles.catalogItem}
//       activeOpacity={0.7}
//       onPress={() => navigation.navigate('ProductDetails', { 
//       product: item,
//       businessProfile: profileData 
//     })}
//     >
//       <Image
//         source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
//         style={styles.itemImage}
//         defaultSource={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//       />
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName} numberOfLines={2}>
//           {item.name}
//         </Text>
//         {item.description ? (
//           <Text style={styles.itemDescription} numberOfLines={2}>
//             {item.description}
//           </Text>
//         ) : null}
//         <View style={styles.priceContainer}>
//           <Text style={styles.itemPrice}>₦{parseFloat(item.price).toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//           })}</Text>
//           {item.sale_price && parseFloat(item.sale_price) > 0 ? (
//             <Text style={styles.itemSalePrice}>
//               ₦{parseFloat(item.sale_price).toLocaleString('en-US', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//               })}
//             </Text>
//           ) : null}
//         </View>
//       </View>
//       <Icon name="chevron-right" size={24} color="#CCCCCC" />
//     </TouchableOpacity>
//   );

//   const renderContent = () => {
//     if (loading && catalogData.length === 0) {
//       return (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#4A6FFF" />
//           <Text style={styles.loadingText}>Loading your catalog...</Text>
//         </View>
//       );
//     }

//     return (
//       <>
//         {renderProfileBanner()}
        
//         <View style={styles.introSection}>
//           <Text style={styles.sectionTitle}>Your Product Catalog</Text>
//           <Text style={styles.sectionDescription}>
//             Showcase your products and services. Customers can browse and purchase directly.
//           </Text>
//         </View>

//         <TouchableOpacity 
//           style={styles.addItemCard}
//           onPress={handleAddNewItem}
//           activeOpacity={0.8}
//         >
//           <View style={styles.addItemIconContainer}>
//             <Icon name="add-circle-outline" size={28} color="#4A6FFF" />
//           </View>
//           <View style={styles.addItemContent}>
//             <Text style={styles.addItemTitle}>Add New Item</Text>
//             <Text style={styles.addItemSubtitle}>Products, services, or digital goods</Text>
//           </View>
//           <Icon name="chevron-right" size={24} color="#CCCCCC" />
//         </TouchableOpacity>

//         {catalogData.length === 0 ? (
//           renderEmptyState()
//         ) : (
//           <>
//             <View style={styles.itemsHeader}>
//               <Text style={styles.itemsTitle}>Your Items ({catalogData.length})</Text>
//               <TouchableOpacity onPress={() => setModalVisible(true)}>
//                 <Text style={styles.manageText}>Manage</Text>
//               </TouchableOpacity>
//             </View>
            
//             {catalogData.map(renderCatalogItem)}
//           </>
//         )}

        
//       </>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//          barStyle={Platform.OS === 'android'? 'light-content':'dark-content'}
//           translucent={Platform.OS === 'android'}
//           backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
//       />
      
//       {renderHeader()}

//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#4A6FFF']}
//             tintColor="#4A6FFF"
//             progressViewOffset={Platform.OS === 'ios' ? 0 : 40}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {renderContent()}
//       </ScrollView>

//       {/* Action Modal */}
//       <Modal
//         transparent
//         visible={modalVisible}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Catalog Actions</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Icon name="close" size={24} color="#666666" />
//               </TouchableOpacity>
//             </View>
            
//             <TouchableOpacity 
//               style={styles.modalItem}
//               onPress={handleAddNewItem}
//             >
//               <Icon name="add-circle-outline" size={22} color="#4A6FFF" style={styles.modalIcon} />
//               <Text style={styles.modalItemText}>Add New Item</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.modalItem}
//               onPress={handleShare}
//             >
//               <Icon name="share" size={22} color="#4A6FFF" style={styles.modalIcon} />
//               <Text style={styles.modalItemText}>Share Catalog</Text>
//             </TouchableOpacity>
            
//             {/* <TouchableOpacity 
//               style={styles.modalItem}
//               onPress={() => {
//                 setModalVisible(false);
//                 navigation.navigate('CatalogSettings');
//               }}
//             >
//               <Icon name="settings" size={22} color="#4A6FFF" style={styles.modalIcon} />
//               <Text style={styles.modalItemText}>Catalog Settings</Text>
//             </TouchableOpacity> */}
            
//             <TouchableOpacity 
//               style={[styles.modalItem, styles.modalItemLast]}
//               onPress={() => {
//                 setModalVisible(false);
//                 navigation.navigate('Advertise');
//               }}
//             >
//               <Icon name="rocket-launch" size={22} color="#4A6FFF" style={styles.modalIcon} />
//               <Text style={styles.modalItemText}>Boost Catalog</Text>
//             </TouchableOpacity>
//           </View>
//         </Pressable>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },

//   header: {
//     paddingTop: Platform.OS === 'ios' ? 0 : 20,
//     paddingBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     zIndex: 10,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginTop: Platform.OS === 'ios' ? 0 : 0,
//     marginBottom:Platform.OS === 'ios' ? 0 : 0,
//     padding:15
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   headerTitleContainer: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     letterSpacing: 0.3,
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginTop: 2,
//   },
//   menuButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   // Profile Banner
//   profileBanner: {
//     margin: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     height: 180,
//     position: 'relative',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//   },
//   bannerOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '60%',
//   },
//   bannerContent: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 20,
//   },
//   businessName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   businessDescription: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     lineHeight: 20,
//   },
//   // Intro Section
//   introSection: {
//     paddingHorizontal: 16,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 8,
//   },
//   sectionDescription: {
//     fontSize: 15,
//     color: '#666666',
//     lineHeight: 22,
//   },
//   // Add Item Card
//   addItemCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginHorizontal: 16,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   addItemIconContainer: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#F0F4FF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 16,
//   },
//   addItemContent: {
//     flex: 1,
//   },
//   addItemTitle: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 4,
//   },
//   addItemSubtitle: {
//     fontSize: 14,
//     color: '#666666',
//   },
//   // Items Header
//   itemsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   itemsTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333333',
//   },
//   manageText: {
//     fontSize: 15,
//     color: '#4A6FFF',
//     fontWeight: '500',
//   },
//   // Catalog Items
//   catalogItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#F0F0F0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   itemImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 10,
//     backgroundColor: '#F5F5F5',
//   },
//   itemInfo: {
//     flex: 1,
//     marginHorizontal: 16,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 4,
//   },
//   itemDescription: {
//     fontSize: 14,
//     color: '#666666',
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4CAF50',
//   },
//   itemSalePrice: {
//     fontSize: 14,
//     color: '#999999',
//     textDecorationLine: 'line-through',
//     marginLeft: 8,
//   },
//   // Empty State
//   emptyContainer: {
//     alignItems: 'center',
//     padding: 40,
//     marginTop: 20,
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#F5F5F5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptySubtitle: {
//     fontSize: 15,
//     color: '#666666',
//     textAlign: 'center',
//     marginBottom: 24,
//     lineHeight: 22,
//     maxWidth: 300,
//   },
//   emptyActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4A6FFF',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 12,
//     shadowColor: '#4A6FFF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   emptyActionText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   // Loading State
//   loadingContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 300,
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 15,
//     color: '#666666',
//   },
//   // Terms
//   termsContainer: {
//     marginTop: 32,
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     backgroundColor: '#FFF8E1',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     borderWidth: 1,
//     borderColor: '#FFECB3',
//   },
//   termsText: {
//     fontSize: 13,
//     color: '#666666',
//     lineHeight: 18,
//     textAlign: 'center',
//   },
//   termsLink: {
//     color: '#4A6FFF',
//     fontWeight: '500',
//   },
//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingBottom: Platform.OS === 'ios' ? 40 : 20,
//     maxHeight: '60%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333333',
//   },
//   modalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 18,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   modalItemLast: {
//     borderBottomWidth: 0,
//   },
//   modalIcon: {
//     marginRight: 16,
//   },
//   modalItemText: {
//     fontSize: 16,
//     color: '#333333',
//     flex: 1,
//   },
//   buttonIcon: {
//     marginRight: 8,
//   },
// });

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { Share } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CatalogScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        setProfileData(profile);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
        }
      }
    } catch (err) {
      console.error('Failed to load profile', err);
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
        timeout: 10000,
      });

      if (response.status === 200) {
        setCatalogData(response.data);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchCatalogData()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: 'Check out my catalog',
        message: `Check out my products and services in the Showa app!`,
        url: `https://showa.app/catalog`,
      });
      
      if (result.action === Share.sharedAction) {
        console.log('Catalog shared successfully');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error sharing catalog:', error);
    }
  };

  const handleAddNewItem = () => {
    setModalVisible(false);
    navigation.navigate('AddItemToCatalog');
  };

  const renderHeader = () => (
    <LinearGradient 
      colors={isDark ? [colors.primaryDark || colors.primary, colors.primary] : ['#4A6FFF', '#367BF5']} 
      style={[styles.header, {
        shadowColor: isDark ? '#000' : '#000',
        shadowOpacity: isDark ? 0.4 : 0.1,
      }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)' }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Catalog</Text>
          <Text style={styles.headerSubtitle}>
            {catalogData.length} {catalogData.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          style={[styles.menuButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)' }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderProfileBanner = () => {
    if (!profileData?.id) return null;
    
    return (
      <View style={[styles.profileBanner, {
        shadowColor: isDark ? '#000' : '#000',
        shadowOpacity: isDark ? 0.3 : 0.1,
      }]}>
        <Image
          source={
            profileData?.image 
              ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.bannerImage}
        />
        <LinearGradient 
          colors={['transparent', isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.7)']} 
          style={styles.bannerOverlay}
        />
        <View style={styles.bannerContent}>
          <Text style={styles.businessName}>{profileData.name || 'Your Business'}</Text>
          <Text style={styles.businessDescription}>
            {profileData.description || 'Manage your products and services'}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Icon name="inventory" size={64} color={colors.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Your catalog is empty</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Add your first product or service to start selling
      </Text>
      <TouchableOpacity 
        style={[styles.emptyActionButton, { backgroundColor: colors.primary }]}
        onPress={handleAddNewItem}
      >
        <Icon name="add" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.emptyActionText}>Add First Item</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCatalogItem = (item, index) => (
    <TouchableOpacity 
      key={index}
      style={[styles.catalogItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: isDark ? '#000' : '#000',
        shadowOpacity: isDark ? 0.1 : 0.05,
      }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetails', { 
        product: item,
        businessProfile: profileData 
      })}
    >
      <Image
        source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
        style={styles.itemImage}
        defaultSource={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
      />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        {item.description ? (
          <Text style={[styles.itemDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.priceContainer}>
          <Text style={[styles.itemPrice, { color: '#4CAF50' }]}>
            ₦{parseFloat(item.price).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
          {item.sale_price && parseFloat(item.sale_price) > 0 ? (
            <Text style={[styles.itemSalePrice, { color: colors.textSecondary }]}>
              ₦{parseFloat(item.sale_price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Text>
          ) : null}
        </View>
      </View>
      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading && catalogData.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your catalog...
          </Text>
        </View>
      );
    }

    return (
      <>
        {renderProfileBanner()}
        
        <View style={styles.introSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Product Catalog</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Showcase your products and services. Customers can browse and purchase directly.
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.addItemCard, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: isDark ? '#000' : '#000',
            shadowOpacity: isDark ? 0.1 : 0.05,
          }]}
          onPress={handleAddNewItem}
          activeOpacity={0.8}
        >
          <View style={[styles.addItemIconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF' }]}>
            <Icon name="add-circle-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.addItemContent}>
            <Text style={[styles.addItemTitle, { color: colors.text }]}>Add New Item</Text>
            <Text style={[styles.addItemSubtitle, { color: colors.textSecondary }]}>
              Products, services, or digital goods
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {catalogData.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <View style={styles.itemsHeader}>
              <Text style={[styles.itemsTitle, { color: colors.text }]}>
                Your Items ({catalogData.length})
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={[styles.manageText, { color: colors.primary }]}>Manage</Text>
              </TouchableOpacity>
            </View>
            
            {catalogData.map(renderCatalogItem)}
          </>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />
      
      {renderHeader()}

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressViewOffset={Platform.OS === 'ios' ? 0 : 40}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      {/* Action Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Catalog Actions</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.modalItem, { borderBottomColor: colors.border }]}
              onPress={handleAddNewItem}
            >
              <Icon name="add-circle-outline" size={22} color={colors.primary} style={styles.modalIcon} />
              <Text style={[styles.modalItemText, { color: colors.text }]}>Add New Item</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalItem, { borderBottomColor: colors.border }]}
              onPress={handleShare}
            >
              <Icon name="share" size={22} color={colors.primary} style={styles.modalIcon} />
              <Text style={[styles.modalItemText, { color: colors.text }]}>Share Catalog</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalItem, styles.modalItemLast, { borderBottomColor: colors.border }]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Advertise');
              }}
            >
              <Icon name="rocket-launch" size={22} color={colors.primary} style={styles.modalIcon} />
              <Text style={[styles.modalItemText, { color: colors.text }]}>Boost Catalog</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
    marginBottom: Platform.OS === 'ios' ? 0 : 0,
    padding: 15
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBanner: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  businessName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  businessDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  introSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  addItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  addItemIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addItemContent: {
    flex: 1,
  },
  addItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  addItemSubtitle: {
    fontSize: 14,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  manageText: {
    fontSize: 15,
    fontWeight: '500',
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemSalePrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    maxWidth: 300,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#4A6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  modalItemLast: {
    borderBottomWidth: 0,
  },
  modalIcon: {
    marginRight: 16,
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
});
