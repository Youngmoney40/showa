// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   StatusBar,
//   Image,
//   TextInput,
//   Linking,
//   Alert,
//   Platform
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useTheme } from '../src/context/ThemeContext';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ContactsScreen = ({ navigation }) => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [nonAppUsers, setNonAppUsers] = useState([]);
//   const [pendingSent, setPendingSent] = useState(0);
//   const [pendingReceived, setPendingReceived] = useState(0);
//   const [activeTab, setActiveTab] = useState('allUsers');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contacts, setContacts] = useState([]);
//   const [usingCachedData, setUsingCachedData] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const {colors, inDark, theme } = useTheme()
  
//   // App store links
//   const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.showa';
//   const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID'; // Replace with actual iOS App Store URL

//   useEffect(() => {
//     loadContactsInstantly();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredUsers(allUsers);
//     } else {
//       const filtered = allUsers.filter(user => 
//         (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()))
//       ));
//       setFilteredUsers(filtered);
//     }
//   }, [searchQuery, allUsers]);

//   // Function to force HTTPS for image URLs
//   const getSecureImageUrl = (url) => {
//     if (!url) return null;
    
//     // If it's already a full URL
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return url.replace('http://', 'https://');
//     }
    
//     // If it's a relative path, it will be handled by API_ROUTE_IMAGE in the parent component
//     return url;
//   };

//   // Function to send WhatsApp invitation
//   const sendWhatsAppInvitation = async (contact) => {
//     try {
//       // Get user's name from AsyncStorage
//       const userData = await AsyncStorage.getItem('userData');
//       const userName = userData ? JSON.parse(userData).name : 'Your friend';
      
//       // Create invitation message
//       const message = `👋 Hey ${contact.contact_name || contact.name || 'there'}!\n\n${userName} has invited you to join Showa - a great social networking app!\n\nDownload Showa now:\n${PLAY_STORE_URL}\n\nLooking forward to connecting with you on Showa! 🎉`;
      
//       // Encode the message for URL
//       const encodedMessage = encodeURIComponent(message);
      
//       // WhatsApp URL
//       let whatsappUrl = '';
      
//       if (Platform.OS === 'ios') {
//         // iOS WhatsApp
//         whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
//       } else {
//         // Android WhatsApp
//         whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
//       }
      
//       // Check if WhatsApp is installed
//       const supported = await Linking.canOpenURL(whatsappUrl);
      
//       if (supported) {
//         await Linking.openURL(whatsappUrl);
//       } else {
//         // If WhatsApp is not installed, show alternative
//         Alert.alert(
//           'WhatsApp Not Installed',
//           'Would you like to share via other apps?',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { 
//               text: 'Share Anyway', 
//               onPress: () => {
//                 // Use generic sharing
//                 const shareUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
//                 Linking.openURL(shareUrl).catch(() => {
//                   Alert.alert('Error', 'Unable to open sharing options.');
//                 });
//               }
//             }
//           ]
//         );
//       }
      
//     } catch (error) {
//       console.error('Error sending WhatsApp invitation:', error);
//       Alert.alert('Error', 'Failed to open WhatsApp. Please try again.');
//     }
//   };

//   const loadContactsInstantly = async () => {
//     const cachedContacts = await getCachedContactsData();
//     if (cachedContacts) {
//       applyCachedData(cachedContacts);
//       setUsingCachedData(true);
//     }
    
//     // Then fetch fresh data in background
//     fetchFreshContacts();
//   };

//   const applyCachedData = (cachedData) => {
//     setAllUsers(cachedData.all_users || []);
//     setFilteredUsers(cachedData.all_users || []);
    
//     const syncedContacts = cachedData.synced_contacts || [];
//     const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
//     const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
//     const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);
    
//     setContacts(syncedContacts);
//     setFriends(friendsList);
//     setAppUsers(appUsersList);
//     setNonAppUsers(nonAppUsersList);
//     setPendingSent(cachedData.pending_sent || 0);
//     setPendingReceived(cachedData.pending_received || 0);
//   };

//   const fetchFreshContacts = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Update with fresh data
//       setAllUsers(response.data.all_users || []);
//       setFilteredUsers(response.data.all_users || []);
      
//       const syncedContacts = response.data.synced_contacts || [];
//       const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
//       const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
//       const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);

//       setContacts(syncedContacts);
//       setFriends(friendsList);
//       setAppUsers(appUsersList);
//       setNonAppUsers(nonAppUsersList);
//       setPendingSent(response.data.pending_sent || 0);
//       setPendingReceived(response.data.pending_received || 0);

//       // Cache the fresh data
//       await cacheContactsData(response.data);
//       setUsingCachedData(false);

//     } catch (error) {
//       console.log('❌ Error fetching fresh contacts');
//       // Keep using cached data if fresh fetch fails
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchFreshContacts();
//     setRefreshing(false);
//   };

//   // Cache contacts data for offline use
//   const cacheContactsData = async (data) => {
//     try {
//       await AsyncStorage.setItem('cachedContactsData', JSON.stringify({
//         ...data,
//         cachedAt: Date.now()
//       }));
//     } catch (error) {
//       console.log('❌ Error caching contacts data');
//     }
//   };

//   // Get cached contacts data
//   const getCachedContactsData = async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem('cachedContactsData');
//       if (cachedData) {
//         const parsedData = JSON.parse(cachedData);
//         // Check if cache is less than 24 hours old
//         const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
//         if (parsedData.cachedAt && parsedData.cachedAt > oneDayAgo) {
//           return parsedData;
//         } else {
//           await AsyncStorage.removeItem('cachedContactsData');
//         }
//       }
//     } catch (error) {
//       console.log('Error getting cached contacts data');
//     }
//     return null;
//   };

//   const renderUserAvatar = (item) => {
//     const profilePic = item.profile_picture || item.user_details?.profile_picture;
//     const secureProfilePic = getSecureImageUrl(profilePic);
    
//     if (secureProfilePic) {
//       return (
//         <Image 
//           source={{ uri: secureProfilePic }} 
//           style={styles.avatar}
//         />
//       );
//     }
//     return (
//       <View style={styles.avatarPlaceholder}>
//         <Icon name="person" size={24} color="#fff" />
//       </View>
//     );
//   };

//   const renderUserItem = ({ item }) => {
//     const isAppUser = item.is_app_user;
    
//     return (
//       <View style={styles.contactItem}>
//         <View style={styles.contactInfo}>
//           {renderUserAvatar(item)}
//           <View style={styles.contactTextContainer}>
//             <Text style={styles.contactName}>
//               {item.contact_name || item.name || item.user_details?.name || item.phone_number || 'Unknown'}
//             </Text>
//             <Text style={styles.contactPhone}>{item.phone_number || 'No phone number'}</Text>
//             {item.is_in_contacts && (
//               <View style={styles.contactBadge}>
//                 <Text style={styles.contactBadgeText}>In your contacts</Text>
//                 {item.contact_name && item.contact_name !== item.name && (
//                   <Text style={styles.contactSavedAs}>
//                     Saved as: {item.contact_name}
//                   </Text>
//                 )}
//               </View>
//             )}
//           </View>
//         </View>
        
//         {isAppUser ? (
//           <TouchableOpacity 
//             style={styles.messageButton}
//             onPress={() => {
//               const profilePic = item.profile_picture || item.user_details?.profile_picture;
//               const secureProfilePic = getSecureImageUrl(profilePic);
//               const relativePath = secureProfilePic ? secureProfilePic.replace(/^https?:\/\/[^\/]+/, '') : null;

//               navigation.navigate('PrivateChat', {
//                 receiverId: item.id || item.user_details?.id,
//                 name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//                 profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//                 chatType: 'single',
//               });
//             }}
//           >
//             <Icon name="message" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>Message</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity 
//             style={styles.inviteButton}
//             onPress={() => sendWhatsAppInvitation(item)}
//           >
//             <Icon name="whatsapp" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>Invite</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const renderTabButton = (tabName, title, count) => (
//     <TouchableOpacity
//       style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
//       onPress={() => setActiveTab(tabName)}
//     >
//       <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
//         {title}
//       </Text>
//       {count > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{count}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case 'allUsers': 
//         // Show only app users for "Users on Showa" tab
//         return filteredUsers.filter(user => user.is_app_user);
//       case 'appUsers': 
//         // Show non-app users for "Invite Friends" tab
//         return nonAppUsers;
//       default: 
//         return [];
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon 
//             name="arrow-back" 
//             size={24} 
//             color="#000" 
//             onPress={() => navigation.goBack()}
//           />
//           <Text style={styles.headerTitle}>Contacts</Text>
//           {usingCachedData && (
//             <View style={styles.cachedBadge}>
//               <Icon name="wifi-off" size={12} color="#92400E" />
//             </View>
//           )}
//         </View>
//         <TouchableOpacity 
//           style={styles.searchButton}
//           onPress={onRefresh}
//         >
//           <Icon name="refresh" size={24} color="#4E8AF4" />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         {renderTabButton('allUsers', 'Users on Showa', allUsers.filter(user => user.is_app_user).length)}
//         {renderTabButton('appUsers', 'Invite Friends', nonAppUsers.length)}
//       </View>

//       {/* WhatsApp Invite Banner */}
//       {activeTab === 'appUsers' && nonAppUsers.length > 0 && (
//         <View style={styles.inviteBanner}>
//           <Icon name="whatsapp" size={20} color="#25D366" />
//           <Text style={styles.inviteBannerText}>
//             Invite friends via WhatsApp to join Showa!
//           </Text>
//         </View>
//       )}

//       {/* User List - Shows instantly */}
//       <FlatList
//         data={getCurrentData()}
//         renderItem={renderUserItem}
//         keyExtractor={(item, index) => item.id || `${item.phone_number}-${index}`}
//         contentContainerStyle={[
//           styles.listContent,
//           getCurrentData().length === 0 && styles.emptyListContent
//         ]}
//         onRefresh={onRefresh}
//         refreshing={refreshing}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             {activeTab === 'allUsers' ? (
//               <>
//                 <Icon name="people-outline" size={60} color="#D1D5DB" />
//                 <Text style={styles.emptyText}>
//                   No friends on Showa yet
//                 </Text>
//                 <Text style={styles.emptySubtext}>
//                   {usingCachedData ? 'Connect to internet to sync contacts' : 'Invite friends to join Showa!'}
//                 </Text>
//                 <TouchableOpacity 
//                   style={styles.inviteAllButton}
//                   onPress={() => setActiveTab('appUsers')}
//                 >
//                   <Text style={styles.inviteAllButtonText}>Invite Friends</Text>
//                 </TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <Icon name="check-circle" size={60} color="#D1D5DB" />
//                 <Text style={styles.emptyText}>
//                   All contacts are on Showa! 🎉
//                 </Text>
//                 <Text style={styles.emptySubtext}>
//                   Great! All your contacts are already using Showa.
//                 </Text>
//               </>
//             )}
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 16,
//   },
//   cachedBadge: {
//     backgroundColor: '#FEF3C7',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     paddingHorizontal: 12,
//     height: 48,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#111827',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#4E8AF4',
//   },
//   activeTabText: {
//     color: '#4E8AF4',
//     fontWeight: '500',
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   badge: {
//     backgroundColor: '#EF4444',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 5,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   emptyListContent: {
//     flexGrow: 1,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 12,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   contactTextContainer: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   contactPhone: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   contactBadge: {
//     backgroundColor: '#EFF6FF',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//   },
//   contactBadgeText: {
//     color: '#3B82F6',
//     fontSize: 12,
//   },
//   contactSavedAs: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   messageButton: {
//     backgroundColor: '#4E8AF4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 90,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   inviteButton: {
//     backgroundColor: '#25D366',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 90,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   buttonIcon: {
//     marginRight: 4,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//     marginTop: 60,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 16,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   inviteBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8F5E9',
//     padding: 12,
//     marginHorizontal: 16,
//     marginTop: 12,
//     borderRadius: 8,
//   },
//   inviteBannerText: {
//     fontSize: 14,
//     color: '#1B5E20',
//     marginLeft: 8,
//     fontWeight: '500',
//   },
//   inviteAllButton: {
//     backgroundColor: '#25D366',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   inviteAllButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default ContactsScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Image,
  TextInput,
  Linking,
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../src/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const ContactsScreen = ({ navigation }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [nonAppUsers, setNonAppUsers] = useState([]);
  const [pendingSent, setPendingSent] = useState(0);
  const [pendingReceived, setPendingReceived] = useState(0);
  const [activeTab, setActiveTab] = useState('allUsers');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [usingCachedData, setUsingCachedData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark, theme } = useTheme();
  
  // App store links
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.showa';
  const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';

  useEffect(() => {
    loadContactsInstantly();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  // Function to force HTTPS for image URLs
  const getSecureImageUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.replace('http://', 'https://');
    }
    
    // If it's a relative path, it will be handled by API_ROUTE_IMAGE in the parent component
    return url;
  };

  // Function to send WhatsApp invitation
  const sendWhatsAppInvitation = async (contact) => {
    try {
      // Get user's name from AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      const userName = userData ? JSON.parse(userData).name : 'Your friend';
      
      // Create invitation message
      const message = `👋 Hey ${contact.contact_name || contact.name || 'there'}!\n\n${userName} has invited you to join Showa - a great social networking app!\n\nDownload Showa now:\n${PLAY_STORE_URL}\n\nLooking forward to connecting with you on Showa! 🎉`;
      
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // WhatsApp URL
      let whatsappUrl = '';
      
      if (Platform.OS === 'ios') {
        // iOS WhatsApp
        whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
      } else {
        // Android WhatsApp
        whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
      }
      
      // Check if WhatsApp is installed
      const supported = await Linking.canOpenURL(whatsappUrl);
      
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // If WhatsApp is not installed, show alternative
        Alert.alert(
          'WhatsApp Not Installed',
          'Would you like to share via other apps?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Share Anyway', 
              onPress: () => {
                // Use generic sharing
                const shareUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
                Linking.openURL(shareUrl).catch(() => {
                  Alert.alert('Error', 'Unable to open sharing options.');
                });
              }
            }
          ]
        );
      }
      
    } catch (error) {
      console.error('Error sending WhatsApp invitation:', error);
      Alert.alert('Error', 'Failed to open WhatsApp. Please try again.');
    }
  };

  const loadContactsInstantly = async () => {
    const cachedContacts = await getCachedContactsData();
    if (cachedContacts) {
      applyCachedData(cachedContacts);
      setUsingCachedData(true);
    }
    
    // Then fetch fresh data in background
    fetchFreshContacts();
  };

  const applyCachedData = (cachedData) => {
    setAllUsers(cachedData.all_users || []);
    setFilteredUsers(cachedData.all_users || []);
    
    const syncedContacts = cachedData.synced_contacts || [];
    const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
    const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
    const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);
    
    setContacts(syncedContacts);
    setFriends(friendsList);
    setAppUsers(appUsersList);
    setNonAppUsers(nonAppUsersList);
    setPendingSent(cachedData.pending_sent || 0);
    setPendingReceived(cachedData.pending_received || 0);
  };

  const fetchFreshContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update with fresh data
      setAllUsers(response.data.all_users || []);
      setFilteredUsers(response.data.all_users || []);
      
      const syncedContacts = response.data.synced_contacts || [];
      const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
      const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
      const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);

      setContacts(syncedContacts);
      setFriends(friendsList);
      setAppUsers(appUsersList);
      setNonAppUsers(nonAppUsersList);
      setPendingSent(response.data.pending_sent || 0);
      setPendingReceived(response.data.pending_received || 0);

      // Cache the fresh data
      await cacheContactsData(response.data);
      setUsingCachedData(false);

    } catch (error) {
      console.log('❌ Error fetching fresh contacts');
      // Keep using cached data if fresh fetch fails
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFreshContacts();
    setRefreshing(false);
  };

  // Cache contacts data for offline use
  const cacheContactsData = async (data) => {
    try {
      await AsyncStorage.setItem('cachedContactsData', JSON.stringify({
        ...data,
        cachedAt: Date.now()
      }));
    } catch (error) {
      console.log('❌ Error caching contacts data');
    }
  };

  // Get cached contacts data
  const getCachedContactsData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('cachedContactsData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // Check if cache is less than 24 hours old
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        if (parsedData.cachedAt && parsedData.cachedAt > oneDayAgo) {
          return parsedData;
        } else {
          await AsyncStorage.removeItem('cachedContactsData');
        }
      }
    } catch (error) {
      console.log('Error getting cached contacts data');
    }
    return null;
  };

  const renderUserAvatar = (item) => {
    const profilePic = item.profile_picture || item.user_details?.profile_picture;
    const secureProfilePic = getSecureImageUrl(profilePic);
    
    if (secureProfilePic) {
      return (
        <Image 
          source={{ uri: secureProfilePic }} 
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.textTertiary }]}>
        <Icon name="person" size={24} color={colors.textInverse} />
      </View>
    );
  };

  const renderUserItem = ({ item }) => {
    const isAppUser = item.is_app_user;
    
    return (
      <TouchableOpacity 
        style={[styles.contactItem, { backgroundColor: colors.surface }]}
        activeOpacity={0.7}
      >
        <View style={styles.contactInfo}>
          {renderUserAvatar(item)}
          <View style={styles.contactTextContainer}>
            <Text style={[styles.contactName, { color: colors.text }]}>
              {item.contact_name || item.name || item.user_details?.name || item.phone_number || 'Unknown'}
            </Text>
            <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{item.phone_number || 'No phone number'}</Text>
            {item.is_in_contacts && (
              <View style={[styles.contactBadge, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.contactBadgeText, { color: colors.primary }]}>In your contacts</Text>
                {item.contact_name && item.contact_name !== item.name && (
                  <Text style={[styles.contactSavedAs, { color: colors.textTertiary }]}>
                    Saved as: {item.contact_name}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
        
        {isAppUser ? (
          <TouchableOpacity 
            style={[styles.messageButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              const profilePic = item.profile_picture || item.user_details?.profile_picture;
              const secureProfilePic = getSecureImageUrl(profilePic);
              const relativePath = secureProfilePic ? secureProfilePic.replace(/^https?:\/\/[^\/]+/, '') : null;

              navigation.navigate('PrivateChat', {
                receiverId: item.id || item.user_details?.id,
                name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
                profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
                chatType: 'single',
              });
            }}
          >
            <Icon name="message" size={16} color={colors.textInverse} style={styles.buttonIcon} />
            <Text style={[styles.buttonText, { color: colors.textInverse }]}>Message</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.inviteButton, { backgroundColor: '#25D366' }]}
            onPress={() => sendWhatsAppInvitation(item)}
          >
            <Icon name="whatsapp" size={16} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, { color: colors.textInverse }]}>Invite</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderTabButton = (tabName, title, count) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[
        styles.tabText, 
        { color: colors.textSecondary },
        activeTab === tabName && [styles.activeTabText, { color: colors.textInverse }]
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.error }]}>
          <Text style={[styles.badgeText, { color: colors.textInverse }]}>{count}</Text>
        </View>
      )}
      {activeTab === tabName && (
        <View style={[styles.tabUnderline, { backgroundColor: colors.textInverse }]} />
      )}
    </TouchableOpacity>
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'allUsers': 
        // Show only app users for "Users on Showa" tab
        return filteredUsers.filter(user => user.is_app_user);
      case 'appUsers': 
        // Show non-app users for "Invite Friends" tab
        return nonAppUsers;
      default: 
        return [];
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
        
        {/* Header with gradient like CallsScreen */}
        <LinearGradient colors={[colors.primary, colors.primary]} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Icon 
                name="arrow-back" 
                size={24} 
                color={colors.textInverse} 
                onPress={() => navigation.goBack()}
              />
              <Text style={[styles.headerTitle, { color: colors.textInverse }]}>Contacts</Text>
              {usingCachedData && (
                <View style={[styles.cachedBadge, { backgroundColor: colors.warning }]}>
                  <Icon name="wifi-off" size={12} color={colors.textInverse} />
                </View>
              )}
            </View>
            <TouchableOpacity 
              onPress={onRefresh}
            >
              <Icon name="refresh" size={24} color={colors.textInverse} />
            </TouchableOpacity>
          </View>

          {/* Search Bar in header */}
          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Tabs */}
          <View style={[styles.tabContainer, { backgroundColor: colors.primary }]}>
            {renderTabButton('allUsers', 'Users on Showa', allUsers.filter(user => user.is_app_user).length)}
            {renderTabButton('appUsers', 'Invite Friends', nonAppUsers.length)}
          </View>
        </LinearGradient>

        {/* WhatsApp Invite Banner */}
        {activeTab === 'appUsers' && nonAppUsers.length > 0 && (
          <View style={[styles.inviteBanner, { backgroundColor: colors.surfaceVariant }]}>
           
            <Text style={[styles.inviteBannerText, { color: colors.text }]}>
              Invite friends via WhatsApp to join Showa!
            </Text>
          </View>
        )}

        {/* User List - Shows instantly */}
        <FlatList
          data={getCurrentData()}
          renderItem={renderUserItem}
          keyExtractor={(item, index) => item.id || `${item.phone_number}-${index}`}
          contentContainerStyle={[
            styles.listContent,
            getCurrentData().length === 0 && styles.emptyListContent
          ]}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {activeTab === 'allUsers' ? (
                <>
                  <Icon name="people-outline" size={60} color={colors.textTertiary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No friends on Showa yet
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                    {usingCachedData ? 'Connect to internet to sync contacts' : 'Invite friends to join Showa!'}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.inviteAllButton, { backgroundColor: colors.primary }]}
                    onPress={() => setActiveTab('appUsers')}
                  >
                    <Text style={[styles.inviteAllButtonText, { color: colors.textInverse }]}>Invite Friends</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Icon name="check-circle" size={60} color={colors.textTertiary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    All contacts are on Showa! 🎉
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                    Great! All your contacts are already using Showa.
                  </Text>
                </>
              )}
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    paddingTop: Platform.OS === 'android' ? 14 : 0,
    borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
    elevation: 6,
    zIndex: 1000,
  },
  headerTop: {
    paddingTop: 70,
    paddingHorizontal: Platform.OS === 'android'? 0: 20,
    paddingVertical: Platform.OS === 'android'? 0 : 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  cachedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  activeTab: {
    // Border bottom will be handled by tabUnderline
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular',
    paddingVertical: 6,
  },
  activeTabText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
  },
  tabUnderline: {
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
  },
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
  },
  contactBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  contactBadgeText: {
    fontSize: 12,
  },
  contactSavedAs: {
    fontSize: 12,
    marginTop: 2,
  },
  messageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 90,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 90,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonIcon: {
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  inviteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  inviteBannerText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  inviteAllButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  inviteAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ContactsScreen;