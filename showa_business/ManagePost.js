

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
//   StatusBar,
//   Modal,
//   Animated,
//   Dimensions,
//   Pressable,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';

// const { height } = Dimensions.get('window');

// const ManagePostsScreen = () => {
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState('marketplace');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [playingVideo, setPlayingVideo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const slideAnim = useRef(new Animated.Value(height)).current;
//   const videoRefs = useRef({});


//   const getSecureImageUrl = (url) => {
//   if (!url) return null;
  
//   // Convert http:// to https://
//   if (url.startsWith('http://')) {
//     return url.replace('http://', 'https://');
//   }
  
//   return url;
// };
  
//   // Use useRef for cleanup
//   const isMounted = useRef(true);
//   const abortControllerRef = useRef(null);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, []);

//   const fetchMarketplace = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-listings/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         setMarketplacePosts(res.data || []);
//         console.log('fetch-marketplace', res.data.length, 'items');
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log('Marketplace fetch cancelled');
//       } else {
//         console.error('Error fetching marketplace posts:', error);
//         if (isMounted.current) {
//           setMarketplacePosts([]);
//         }
//       }
//     }
//   }, []);

//   const fetchTweets = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-posts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         setTweets(res.data || []);
//         console.log('fetch-broadcast-post', res.data.length, 'items');
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log('Tweets fetch cancelled');
//       } else {
//         console.error('Error fetching tweets:', error);
//         if (isMounted.current) {
//           setTweets([]);
//         }
//       }
//     }
//   }, []);

//   const fetchVideos = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const controller = new AbortController();
//       abortControllerRef.current = controller;
      
//       const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
      
//       if (isMounted.current) {
//         setUserVideos(res.data || []);
//         console.log('fetch-video', res.data.length, 'items');
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log('Videos fetch cancelled');
//       } else {
//         console.error('Error fetching videos:', error);
//         if (isMounted.current) {
//           setUserVideos([]);
//         }
//       }
//     }
//   }, []);

//   // Single useEffect to fetch all data
//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         await Promise.all([
//           fetchMarketplace(),
//           fetchTweets(),
//           fetchVideos()
//         ]);
//       } catch (error) {
//         console.error('Error fetching all data:', error);
//       } finally {
//         if (isMounted.current) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchAllData();
//   }, [fetchMarketplace, fetchTweets, fetchVideos]);

//   // Refresh data when screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       const refreshData = async () => {
//         try {
//           await fetchMarketplace();
//           await fetchTweets();
//           await fetchVideos();
//         } catch (error) {
//           console.error('Error refreshing data:', error);
//         }
//       };
      
//       refreshData();
      
//       return () => {
//         // Cleanup when screen loses focus
//         if (abortControllerRef.current) {
//           abortControllerRef.current.abort();
//         }
//       };
//     }, [fetchMarketplace, fetchTweets, fetchVideos])
//   );

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

//       // Refresh the appropriate list
//       if (type === 'marketplace') {
//         await fetchMarketplace();
//       } else if (type === 'tweets') {
//         await fetchTweets();
//       } else {
//         await fetchVideos();
//       }
      
//       Alert.alert("Success", "Item deleted successfully");
//     } catch (error) {
//       Alert.alert("Error", "Failed to delete item");
//       console.error('Delete error:', error);
//     }
//     toggleModal();
//   };

//   const toggleModal = (item = null) => {
//     setSelectedItem(item);
//     if (item) {
//       setModalVisible(true);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
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

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Ionicons name="document-text-outline" size={60} color="#d1d5db" />
//       <Text style={styles.emptyText}>
//         You haven't posted anything yet. Create your first post and start sharing!
//       </Text>
//     </View>
//   );

//   const currentData = () => {
//     switch(selectedTab) {
//       case 'marketplace': return marketplacePosts;
//       case 'tweets': return tweets;
//       case 'videos': return userVideos;
//       default: return [];
//     }
//   };

//  const renderMarketplacePost = ({ item }) => {
//   const imageUrl = getSecureImageUrl(item.images?.[0]?.image);
  
//   return (
//     <View style={styles.card}>
//       {imageUrl ? (
//         <Image 
//           source={{ uri: imageUrl }} 
//           style={styles.postImage}
//           resizeMode="cover"
//           onError={(e) => {
//             console.log('Image error details:', e.nativeEvent);
//             console.log('Failed URL:', imageUrl);
//           }}
//         />
//       ) : (
//         <View style={[styles.postImage, styles.placeholderContainer]}>
//           <Ionicons name="image-outline" size={50} color="#ccc" />
//         </View>
//       )}
//       <View style={styles.postContent}>
//         <View style={styles.postHeader}>
//           <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
//           <TouchableOpacity 
//             onPress={() => toggleModal(item)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="ellipsis-vertical" size={20} color="#7f8c8d" />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.postPrice}>${item.price}</Text>
//         <Text style={styles.postDate}>
//           {new Date(item.created).toLocaleDateString()}
//         </Text>
//       </View>
//     </View>
//   );
// };


//  const renderTweet = ({ item }) => {
//   const imageUrl = getSecureImageUrl(item.image);
  
//   return (
//     <View style={styles.card}>
//       {imageUrl ? (
//         <Image 
//           source={{ uri: imageUrl }} 
//           style={styles.postImage}
//           resizeMode="cover"
//           onError={(e) => {
//             console.log('Tweet image error:', e.nativeEvent);
//             console.log('Failed URL:', imageUrl);
//           }}
//         />
//       ) : (
//         <View style={[styles.postImage, styles.placeholderContainer]}>
//           <Ionicons name="chatbubble-outline" size={50} color="#ccc" />
//         </View>
//       )}
//       <View style={styles.postContent}>
//         <View style={styles.postHeader}>
//           <Text style={styles.postText} numberOfLines={3}>{item.content}</Text>
//           <TouchableOpacity 
//             onPress={() => toggleModal(item)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="ellipsis-vertical" size={20} color="#7f8c8d" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.postStats}>
//           <Text style={styles.postStat}>{item.reactions?.length || 0} reactions</Text>
//           <Text style={styles.postDate}>
//             {new Date(item.created_at).toLocaleDateString()}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

//   const renderVideo = ({ item }) => (
//     <View style={styles.card}>
//       <TouchableOpacity 
//         activeOpacity={0.9}
//         onPress={() => toggleVideoPlayback(item.id)}
//         style={styles.videoContainer}
//       >
//         {/* Video component removed for now to simplify */}
//         <View style={[styles.postImage, styles.placeholderContainer]}>
//           <Ionicons name="videocam-outline" size={50} color="#ccc" />
//           <Text style={styles.videoPlaceholderText}>Video</Text>
//         </View>
//       </TouchableOpacity>
//       <View style={styles.postContent}>
//         <View style={styles.postHeader}>
//           <Text style={styles.postTitle} numberOfLines={1}>{item.title || 'Untitled Video'}</Text>
//           <TouchableOpacity 
//             onPress={() => toggleModal(item)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="ellipsis-vertical" size={20} color="#7f8c8d" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.postStats}>
//           <Text style={styles.postStat}>{item.likes || 0} likes</Text>
//           <Text style={styles.postDate}>
//             {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Ionicons name="arrow-back" size={24} color="#2c3e50" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Manage Posts</Text>
//         <View style={styles.headerRight} />
//       </View>

//       {/* Tab Bar */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity 
//           onPress={() => {
//             setSelectedTab('marketplace');
//             setPlayingVideo(null);
//           }} 
//           style={[styles.tab, selectedTab === 'marketplace' && styles.activeTab]}
//           activeOpacity={0.7}
//         >
//           <Ionicons 
//             name="cart-outline" 
//             size={20} 
//             color={selectedTab === 'marketplace' ? '#fff' : '#0d64dd'} 
//           />
//           <Text style={[styles.tabText, selectedTab === 'marketplace' && styles.activeTabText]}>
//             Marketplace
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={() => {
//             setSelectedTab('tweets');
//             setPlayingVideo(null);
//           }} 
//           style={[styles.tab, selectedTab === 'tweets' && styles.activeTab]}
//           activeOpacity={0.7}
//         >
//           <Ionicons 
//             name="chatbubble-outline" 
//             size={20} 
//             color={selectedTab === 'tweets' ? '#fff' : '#0d64dd'} 
//           />
//           <Text style={[styles.tabText, selectedTab === 'tweets' && styles.activeTabText]}>
//             Broadcast
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={() => setSelectedTab('videos')} 
//           style={[styles.tab, selectedTab === 'videos' && styles.activeTab]}
//           activeOpacity={0.7}
//         >
//           <Ionicons 
//             name="videocam-outline" 
//             size={20} 
//             color={selectedTab === 'videos' ? '#fff' : '#0d64dd'} 
//           />
//           <Text style={[styles.tabText, selectedTab === 'videos' && styles.activeTabText]}>
//             Videos
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0d64dd" />
//           <Text style={styles.loadingText}>Loading your posts...</Text>
//         </View>
//       ) : currentData().length === 0 ? (
//         renderEmptyState()
//       ) : (
//         <FlatList
//           data={currentData()}
//           renderItem={
//             selectedTab === 'marketplace'
//               ? renderMarketplacePost
//               : selectedTab === 'tweets'
//               ? renderTweet
//               : renderVideo
//           }
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           initialNumToRender={5}
//           maxToRenderPerBatch={10}
//           windowSize={10}
//         />
//       )}

//       {/* Bottom Sheet Modal */}
//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => toggleModal()}
//         animationType="none"
//       >
//         <View style={styles.modalOverlay}>
//           <Pressable 
//             style={styles.modalBackdrop} 
//             onPress={() => toggleModal()}
//           />
          
//           <Animated.View 
//             style={[
//               styles.modalContainer,
//               { transform: [{ translateY: slideAnim }] }
//             ]}
//           >
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>Post Options</Text>
            
//             <TouchableOpacity 
//               style={styles.modalOption}
//               onPress={() => {
//                 if (selectedItem) {
//                   confirmDelete(selectedTab, selectedItem.id);
//                 }
//               }}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="trash-outline" size={24} color="#e74c3c" />
//               <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.modalOption}
//               onPress={() => toggleModal()}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="close-circle-outline" size={24} color="#3498db" />
//               <Text style={styles.modalOptionText}>Cancel</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     elevation: 2,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2c3e50',
//     fontFamily: 'Lato-Bold',
//   },
//   headerRight: {
//     width: 24,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     elevation: 2,
//   },
//   tab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     backgroundColor: 'transparent',
//   },
//   activeTab: {
//     backgroundColor: '#0d64dd',
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   tabText: {
//     marginLeft: 8,
//     color: '#0d64dd',
//     fontWeight: '600',
//     fontSize: 14,
//     fontFamily: 'Lato-SemiBold',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//     backgroundColor: '#f0f0f0',
//   },
//   placeholderContainer: {
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoContainer: {
//     position: 'relative',
//   },
//   videoPlaceholderText: {
//     marginTop: 8,
//     color: '#666',
//     fontSize: 14,
//   },
//   postContent: {
//     padding: 16,
//   },
//   postHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   postTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2c3e50',
//     flex: 1,
//     marginRight: 12,
//     fontFamily: 'Lato-SemiBold',
//   },
//   postText: {
//     fontSize: 15,
//     color: '#495057',
//     flex: 1,
//     marginRight: 12,
//     lineHeight: 22,
//     fontFamily: 'Lato-Regular',
//   },
//   postPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#27ae60',
//     marginBottom: 4,
//     fontFamily: 'Lato-Bold',
//   },
//   postStats: {
//     flexDirection: 'row',
//     marginTop: 8,
//     flexWrap: 'wrap',
//   },
//   postStat: {
//     fontSize: 13,
//     color: '#6c757d',
//     marginRight: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   postDate: {
//     fontSize: 12,
//     color: '#adb5bd',
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
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 24,
//     paddingBottom: 32,
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 24,
//     textAlign: 'center',
//     fontFamily: 'Lato-SemiBold',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   modalOptionText: {
//     fontSize: 16,
//     color: '#2c3e50',
//     marginLeft: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//     lineHeight: 26,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
// });

// export default ManagePostsScreen;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext'; 

const { height } = Dimensions.get('window');

const ManagePostsScreen = () => {
  const { colors, isDark } = useTheme(); 
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('marketplace');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const videoRefs = useRef({});

  const getSecureImageUrl = (url) => {
    if (!url) return null;
    
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    
    return url;
  };
  
  // Use useRef for cleanup
  const isMounted = useRef(true);
  const abortControllerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchMarketplace = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const res = await axios.get(`${API_ROUTE}/my-listings/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      if (isMounted.current) {
        setMarketplacePosts(res.data || []);
        console.log('fetch-marketplace', res.data.length, 'items');
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Marketplace fetch cancelled');
      } else {
        console.error('Error fetching marketplace posts:', error);
        if (isMounted.current) {
          setMarketplacePosts([]);
        }
      }
    }
  }, []);

  const fetchTweets = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const res = await axios.get(`${API_ROUTE}/my-posts/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      if (isMounted.current) {
        setTweets(res.data || []);
        console.log('fetch-broadcast-post', res.data.length, 'items');
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Tweets fetch cancelled');
      } else {
        console.error('Error fetching tweets:', error);
        if (isMounted.current) {
          setTweets([]);
        }
      }
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      if (isMounted.current) {
        setUserVideos(res.data || []);
        console.log('fetch-video', res.data.length, 'items');
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Videos fetch cancelled');
      } else {
        console.error('Error fetching videos:', error);
        if (isMounted.current) {
          setUserVideos([]);
        }
      }
    }
  }, []);

  // Single useEffect to fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMarketplace(),
          fetchTweets(),
          fetchVideos()
        ]);
      } catch (error) {
        console.error('Error fetching all data:', error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchAllData();
  }, [fetchMarketplace, fetchTweets, fetchVideos]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          await fetchMarketplace();
          await fetchTweets();
          await fetchVideos();
        } catch (error) {
          console.error('Error refreshing data:', error);
        }
      };
      
      refreshData();
      
      return () => {
        // Cleanup when screen loses focus
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }, [fetchMarketplace, fetchTweets, fetchVideos])
  );

  const confirmDelete = (type, id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => handleDelete(type, id),
          style: "destructive"
        }
      ]
    );
  };

  const handleDelete = async (type, id) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      let endpoint = '';
      if (type === 'marketplace') {
        endpoint = `${API_ROUTE}/my-listings/${id}/`;
      } else if (type === 'tweets') {
        endpoint = `${API_ROUTE}/my-posts/${id}/`;
      } else {
        endpoint = `${API_ROUTE}/my-shorts/${id}/`;
      }

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the appropriate list
      if (type === 'marketplace') {
        await fetchMarketplace();
      } else if (type === 'tweets') {
        await fetchTweets();
      } else {
        await fetchVideos();
      }
      
      Alert.alert("Success", "Item deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
      console.error('Delete error:', error);
    }
    toggleModal();
  };

  const toggleModal = (item = null) => {
    setSelectedItem(item);
    if (item) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  };

  const toggleVideoPlayback = (id) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(id);
    }
  };

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
      <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        You haven't posted anything yet. Create your first post and start sharing!
      </Text>
    </View>
  );

  const currentData = () => {
    switch(selectedTab) {
      case 'marketplace': return marketplacePosts;
      case 'tweets': return tweets;
      case 'videos': return userVideos;
      default: return [];
    }
  };

  const renderMarketplacePost = ({ item }) => {
    const imageUrl = getSecureImageUrl(item.images?.[0]?.image);
    
    
    return (
      <View style={[styles.card, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? '#000' : '#000',
        shadowOpacity: isDark ? 0.1 : 0.05,
      }]}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.postImage}
            resizeMode="cover"
            onError={(e) => {
              console.log('Image error details:', e.nativeEvent);
              console.log('Failed URL:', imageUrl);
            }}
          />
        ) : (
          <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="image-outline" size={50} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity 
              onPress={() => toggleModal(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>${item.price}</Text>
          <Text style={[styles.postDate, { color: colors.textSecondary }]}>
            {new Date(item.created).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderTweet = ({ item }) => {
    const imageUrl = `${item.image_url}`;
    
    return (
      <View style={[styles.card, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? '#000' : '#000',
        shadowOpacity: isDark ? 0.1 : 0.05,
      }]}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.postImage}
            resizeMode="cover"
            onError={(e) => {
              console.log('Tweet image error:', e.nativeEvent);
              console.log('Failed URL:', imageUrl);
            }}
          />
        ) : (
          <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="chatbubble-outline" size={50} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Text style={[styles.postText, { color: colors.textSecondary }]} numberOfLines={3}>{item.content}</Text>
            <TouchableOpacity 
              onPress={() => toggleModal(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.postStats}>
            <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.reactions?.length || 0} reactions</Text>
            <Text style={[styles.postDate, { color: colors.textSecondary }]}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderVideo = ({ item }) => (
    <View style={[styles.card, { 
      backgroundColor: colors.card,
      shadowColor: isDark ? '#000' : '#000',
      shadowOpacity: isDark ? 0.1 : 0.05,
    }]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => toggleVideoPlayback(item.id)}
        style={styles.videoContainer}
      >
        <View style={[styles.postImage, styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Ionicons name="videocam-outline" size={50} color={colors.textSecondary} />
          <Text style={[styles.videoPlaceholderText, { color: colors.textSecondary }]}>Video</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>{item.title || 'Untitled Video'}</Text>
          <TouchableOpacity 
            onPress={() => toggleModal(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.postStats}>
          <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.likes || 0} likes</Text>
          <Text style={[styles.postDate, { color: colors.textSecondary }]}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Posts</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabContainer, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('marketplace');
            setPlayingVideo(null);
          }} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="cart-outline" 
            size={20} 
            color={selectedTab === 'marketplace' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'marketplace' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Marketplace
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('tweets');
            setPlayingVideo(null);
          }} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={20} 
            color={selectedTab === 'tweets' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'tweets' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Broadcast
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setSelectedTab('videos')} 
          style={[
            styles.tab, 
            { backgroundColor: 'transparent' },
            selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
          ]}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="videocam-outline" 
            size={20} 
            color={selectedTab === 'videos' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.tabText, 
            { color: colors.primary },
            selectedTab === 'videos' && [styles.activeTabText, { color: '#fff' }]
          ]}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your posts...</Text>
        </View>
      ) : currentData().length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={currentData()}
          renderItem={
            selectedTab === 'marketplace'
              ? renderMarketplacePost
              : selectedTab === 'tweets'
              ? renderTweet
              : renderVideo
          }
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}

      {/* Bottom Sheet Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => toggleModal()}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={() => toggleModal()}
          />
          
          <Animated.View 
            style={[
              styles.modalContainer,
              { 
                backgroundColor: colors.card,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => {
                if (selectedItem) {
                  confirmDelete(selectedTab, selectedItem.id);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={24} color="#e74c3c" />
              <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => toggleModal()}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor handled inline
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    // backgroundColor handled inline
    borderBottomWidth: 1,
    // borderBottomColor handled inline
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    // color handled inline
  },
  headerRight: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor handled inline
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor handled inline
    elevation: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    // backgroundColor handled inline
  },
  activeTab: {
    // backgroundColor handled inline
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    marginLeft: 8,
    // color handled inline
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    // color handled inline
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    // backgroundColor handled inline
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    // shadowColor handled inline
    // shadowOpacity handled inline
    shadowRadius: 6,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
    // backgroundColor handled inline
  },
  placeholderContainer: {
    // backgroundColor handled inline
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    position: 'relative',
  },
  videoPlaceholderText: {
    marginTop: 8,
    // color handled inline
    fontSize: 14,
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    // color handled inline
    flex: 1,
    marginRight: 12,
  },
  postText: {
    fontSize: 15,
    // color handled inline
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  postPrice: {
    fontSize: 16,
    fontWeight: '700',
    // color handled inline
    marginBottom: 4,
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  postStat: {
    fontSize: 13,
    // color handled inline
    marginRight: 16,
  },
  postDate: {
    fontSize: 12,
    // color handled inline
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {

    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    // backgroundColor handled inline
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
   
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
   
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 26,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default ManagePostsScreen;