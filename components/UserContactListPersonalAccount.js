
// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator, 
//   StatusBar,
//   Image,
//   SafeAreaView,
//   TextInput,
//   Platform,
//   Alert,
//   Linking
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../src/context/ThemeContext';
// import Contacts from 'react-native-contacts';

// const ContactsScreen = ({ navigation }) => {
//   const { colors, theme, isDark } = useTheme();
//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredAllUsers, setFilteredAllUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [filteredFriends, setFilteredFriends] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [filteredAppUsers, setFilteredAppUsers] = useState([]);
//   const [nonAppUsers, setNonAppUsers] = useState([]);
//   const [filteredNonAppUsers, setFilteredNonAppUsers] = useState([]);
//   const [phoneContacts, setPhoneContacts] = useState([]);
//   const [filteredPhoneContacts, setFilteredPhoneContacts] = useState([]);
//   const [pendingSent, setPendingSent] = useState(0);
//   const [pendingReceived, setPendingReceived] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [contactsLoading, setContactsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('allUsers');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contacts, setContacts] = useState([]);
//   const [hasContactPermission, setHasContactPermission] = useState(false);

//   useEffect(() => {
//     fetchContacts();
//     checkContactPermission();
//   }, []);

//   // Search effect for all tabs
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       // Reset all filtered lists when search is empty
//       setFilteredAllUsers(allUsers);
//       setFilteredFriends(friends);
//       setFilteredAppUsers(appUsers);
//       setFilteredNonAppUsers(nonAppUsers);
//       setFilteredPhoneContacts(phoneContacts);
//     } else {
//       const query = searchQuery.toLowerCase().trim();

//       // Filter allUsers
//       const filteredAll = allUsers.filter(user => 
//         (user.name?.toLowerCase().includes(query)) ||
//         (user.phone_number?.toLowerCase().includes(query)) ||
//         (user.contact_name?.toLowerCase().includes(query)) ||
//         (user.email?.toLowerCase().includes(query)) ||
//         (user.username?.toLowerCase().includes(query))
//       );
//       setFilteredAllUsers(filteredAll);

//       // Filter friends
//       const filteredF = friends.filter(friend => 
//         (friend.name?.toLowerCase().includes(query)) ||
//         (friend.phone_number?.toLowerCase().includes(query)) ||
//         (friend.contact_name?.toLowerCase().includes(query)) ||
//         (friend.email?.toLowerCase().includes(query)) ||
//         (friend.username?.toLowerCase().includes(query)) ||
//         (friend.user_details?.name?.toLowerCase().includes(query)) ||
//         (friend.user_details?.phone?.toLowerCase().includes(query))
//       );
//       setFilteredFriends(filteredF);

//       // Filter appUsers (suggestions)
//       const filteredApp = appUsers.filter(user => {
//         const userName = user.name?.toLowerCase() || 
//                         user.user_details?.name?.toLowerCase() || 
//                         user.contact_name?.toLowerCase() || '';
//         const userPhone = user.phone_number?.toLowerCase() || 
//                          user.user_details?.phone?.toLowerCase() || '';
//         const userEmail = user.email?.toLowerCase() || 
//                          user.user_details?.email?.toLowerCase() || '';
        
//         return userName.includes(query) || 
//                userPhone.includes(query) || 
//                userEmail.includes(query);
//       });
//       setFilteredAppUsers(filteredApp);

//       // Filter nonAppUsers
//       const filteredNonApp = nonAppUsers.filter(user => {
//         const userName = user.name?.toLowerCase() || 
//                         user.contact_name?.toLowerCase() || '';
//         const userPhone = user.phone_number?.toLowerCase() || '';
        
//         return userName.includes(query) || userPhone.includes(query);
//       });
//       setFilteredNonAppUsers(filteredNonApp);

//       // Filter phoneContacts
//       const filteredPhone = phoneContacts.filter(contact => {
//         const contactName = contact.displayName?.toLowerCase() || '';
//         const contactNumber = contact.phoneNumbers[0]?.number?.toLowerCase() || '';
//         return contactName.includes(query) || contactNumber.includes(query);
//       });
//       setFilteredPhoneContacts(filteredPhone);
//     }
//   }, [searchQuery, allUsers, friends, appUsers, nonAppUsers, phoneContacts]);

//   const checkContactPermission = async () => {
//     try {
//       const permission = await Contacts.checkPermission();
//       if (permission === 'authorized') {
//         setHasContactPermission(true);
//         loadPhoneContacts();
//       } else if (permission === 'denied') {
//         setHasContactPermission(false);
//       } else {
//         // Request permission
//         const newPermission = await Contacts.requestPermission();
//         setHasContactPermission(newPermission === 'authorized');
//         if (newPermission === 'authorized') {
//           loadPhoneContacts();
//         }
//       }
//     } catch (error) {
//       console.log('Error checking contact permission:', error);
//     }
//   };

//   const loadPhoneContacts = async () => {
//     try {
//       setContactsLoading(true);
//       const contacts = await Contacts.getAll();
      
//       // Process contacts to get unique phone numbers
//       const processedContacts = contacts
//         .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
//         .map(contact => ({
//           id: contact.recordID,
//           displayName: contact.displayName,
//           phoneNumbers: contact.phoneNumbers.map(p => p.number),
//           thumbnailPath: contact.thumbnailPath,
//           hasThumbnail: contact.hasThumbnail,
//         }))
//         .filter(contact => contact.phoneNumbers.length > 0); // Only contacts with phone numbers

//       setPhoneContacts(processedContacts);
//       setFilteredPhoneContacts(processedContacts);
//     } catch (error) {
//       console.log('Error loading phone contacts:', error);
//       Alert.alert('Error', 'Failed to load contacts from your phone');
//     } finally {
//       setContactsLoading(false);
//     }
//   };

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Process users to convert HTTP to HTTPS in profile pictures
//       const processedAllUsers = (response.data.all_users || []).map(user => ({
//         ...user,
//         profile_picture: convertHttpToHttps(user.profile_picture)
//       }));

//       // Process synced contacts
//       const processedSyncedContacts = (response.data.synced_contacts || []).map(contact => ({
//         ...contact,
//         user_details: contact.user_details ? {
//           ...contact.user_details,
//           profile_picture: convertHttpToHttps(contact.user_details.profile_picture)
//         } : null
//       }));

//       // Set all users data with contact info
//       setAllUsers(processedAllUsers);
//       setFilteredAllUsers(processedAllUsers);
      
//       // Handle synced contacts
//       const friendsList = processedSyncedContacts.filter(c => c.user_details?.is_friend);
//       const appUsersList = processedSyncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
//       const nonAppUsersList = processedSyncedContacts.filter(c => !c.is_app_user);

//       setContacts(processedSyncedContacts);
//       setFriends(friendsList);
//       setFilteredFriends(friendsList);
//       setAppUsers(appUsersList);
//       setFilteredAppUsers(appUsersList);
//       setNonAppUsers(nonAppUsersList);
//       setFilteredNonAppUsers(nonAppUsersList);
      
//       // Update counts
//       setPendingSent(response.data.pending_sent || 0);
//       setPendingReceived(response.data.pending_received || 0);
//     } catch (error) {
//       //console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to convert HTTP to HTTPS in image URLs
//   const convertHttpToHttps = (url) => {
//     if (!url || typeof url !== 'string') return url;
//     if (url.startsWith('http://')) {
//       return url.replace('http://', 'https://');
//     }
//     return url;
//   };

//   // Helper function to validate profile picture URL
//   const isValidProfilePicture = (profilePic) => {
//     if (!profilePic) return false;
//     if (typeof profilePic !== 'string') return false;
//     if (profilePic.trim() === '') return false;
//     if (profilePic === 'null' || profilePic === 'undefined') return false;
//     return true;
//   };

//   // const sendInvite = (contact) => {
//   //   const phoneNumber = contact.phoneNumbers[0]?.replace(/[^0-9]/g, '');
//   //   const message = `Hey! I'm using this amazing new social app call SHOWA and I think you’ll love it too.
//   //  Join me and let’s connect!. Download it here: https://play.google.com/store/apps/details?id=com.showa&hl=en`;
    
//   //   // Try to open SMS app
//   //   const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    
//   //   Linking.canOpenURL(smsUrl)
//   //     .then(supported => {
//   //       if (supported) {
//   //         return Linking.openURL(smsUrl);
//   //       } else {
//   //         // Fallback to copy to clipboard
//   //         Alert.alert(
//   //           'Invite',
//   //           `Send this message to ${contact.displayName}: \n\n${message}`,
//   //           [
//   //             { text: 'Copy Message', onPress: () => copyToClipboard(message) },
//   //             { text: 'OK' }
//   //           ]
//   //         );
//   //       }
//   //     })
//   //     .catch(err => {
//   //       console.log('Error opening SMS app:', err);
//   //       Alert.alert('Error', 'Could not open messaging app');
//   //     });
//   // };


//   const sendInvite = (contact) => {
//   const phoneNumber = contact.phoneNumbers[0]?.replace(/[^0-9]/g, '');
  
//   // Platform-specific app store links
//   const appStoreLink = Platform.OS === 'ios' 
//     ? 'https://apps.apple.com/us/app/showa-chat-meet-connect/id6759247435'
//     : 'https://play.google.com/store/apps/details?id=com.showa&hl=en';
  
//   const message = `Hey! I'm using this amazing new social app called SHOWA and I think you'll love it too.
// Join me and let's connect! Download it here: ${appStoreLink}`;
  
//   // Platform-specific SMS URL schemes
//   const smsUrl = Platform.OS === 'ios'
//     ? `sms:${phoneNumber}&body=${encodeURIComponent(message)}`  
//     : `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  
//   Linking.canOpenURL(smsUrl)
//     .then(supported => {
//       if (supported) {
//         return Linking.openURL(smsUrl);
//       } else {
      
//         Alert.alert(
//           'Invite',
//           `Send this message to ${contact.displayName}: \n\n${message}`,
//           [
//             { text: 'Copy Message', onPress: () => copyToClipboard(message) },
//             { text: 'OK', style: 'cancel' }
//           ]
//         );
//       }
//     })
//     .catch(err => {
//       console.log('Error opening SMS app:', err);
//       Alert.alert('Error', 'Could not open messaging app');
//     });
// };

//   const copyToClipboard = (text) => {
//     // Implement clipboard copy functionality
//     Alert.alert('Copied!', 'Message copied to clipboard');
//   };

//   const renderUserAvatar = (item) => {
//     let profilePic = item.profile_picture || item.user_details?.profile_picture;
    
//     // Convert HTTP to HTTPS if it's a string URL
//     if (typeof profilePic === 'string') {
//       profilePic = convertHttpToHttps(profilePic);
//     }
    
//     // Check if profilePic is valid
//     if (isValidProfilePicture(profilePic)) {
//       return (
//         <Image 
//           source={{ uri: profilePic }} 
//           style={styles.avatar}
//           onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
//         />
//       );
//     }
//     // If no valid profile picture, show placeholder or default image
//     return (
//       <Image 
//         source={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//         style={styles.avatar}
//       />
//     );
//   };

//   const renderContactAvatar = (contact) => {
//     if (contact.hasThumbnail && contact.thumbnailPath) {
//       return (
//         <Image 
//           source={{ uri: contact.thumbnailPath }} 
//           style={styles.avatar}
//         />
//       );
//     }
//     return (
//       <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
//         <Icon name="person" size={24} color={colors.primary} />
//       </View>
//     );
//   };

//   const renderUserItem = ({ item }) => (
//     <TouchableOpacity 
//       style={[styles.contactItem, { backgroundColor: colors.surface }]}
//       activeOpacity={0.7}
//       onPress={() => {
//         let profilePic = item.profile_picture || item.user_details?.profile_picture;
        
//         // Convert HTTP to HTTPS if it's a string URL
//         if (typeof profilePic === 'string') {
//           profilePic = convertHttpToHttps(profilePic);
//         }
        
//         navigation.navigate('PrivateChat', {
//           receiverId: item.id || item.user_details?.id,
//           name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//           profile_image: isValidProfilePicture(profilePic) 
//             ? profilePic 
//             : require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//           chatType: 'single',
//         });
//       }}
//     >
//       <View style={styles.contactInfo}>
//         {renderUserAvatar(item)}
//         <View style={styles.contactTextContainer}>
//           <Text style={[styles.contactName, { color: colors.text }]}>
//             {item.name || item.user_details?.name || item.phone_number || 'Unknown User'}
//           </Text>
//           {/* {item.phone_number && (
//             <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>
//               {item.phone_number}
//             </Text>
//           )} */}
//           {item.is_in_contacts && (
//             <View style={[styles.contactBadge, { backgroundColor: colors.surfaceVariant }]}>
//               <Text style={[styles.contactBadgeText, { color: colors.primary }]}>In your contacts</Text>
//               {item.contact_name && item.contact_name !== item.name && (
//                 <Text style={[styles.contactSavedAs, { color: colors.textTertiary }]}>
//                   Saved as: {item.contact_name}
//                 </Text>
//               )}
//             </View>
//           )}
//         </View>
//       </View>
//       <TouchableOpacity 
//         style={[styles.actionButton, { backgroundColor: colors.primary }]}
//         onPress={() => {
//           let profilePic = item.profile_picture || item.user_details?.profile_picture;
          
//           // Convert HTTP to HTTPS if it's a string URL
//           if (typeof profilePic === 'string') {
//             profilePic = convertHttpToHttps(profilePic);
//           }
          
//           navigation.navigate('PrivateChat', {
//             receiverId: item.id || item.user_details?.id,
//             name: item.contact_name || item.name || item.user_details?.name || item.phone_number || 'Unknown User',
//             profile_image: isValidProfilePicture(profilePic) 
//               ? profilePic 
//               : require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//             chatType: 'single',
//           });
//         }}
//       >
//         <Text style={[styles.buttonText, { color: colors.textInverse }]}>Message</Text>
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   const renderPhoneContactItem = ({ item }) => (
//     <View style={[styles.contactItem, { backgroundColor: colors.surface }]}>
//       <View style={styles.contactInfo}>
//         {renderContactAvatar(item)}
//         <View style={styles.contactTextContainer}>
//           <Text style={[styles.contactName, { color: colors.text }]}>
//             {item.displayName}
//           </Text>
//           {item.phoneNumbers && item.phoneNumbers.length > 0 && (
//             <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>
//               {item.phoneNumbers[0]}
//             </Text>
//           )}
//           {item.phoneNumbers && item.phoneNumbers.length > 1 && (
//             <Text style={[styles.contactBadgeText, { color: colors.textTertiary }]}>
//               +{item.phoneNumbers.length - 1} more numbers
//             </Text>
//           )}
//         </View>
//       </View>
//       <TouchableOpacity 
//         style={[styles.actionButton, { backgroundColor: colors.success || '#4CAF50' }]}
//         onPress={() => sendInvite(item)}
//       >
//         <Icon name="share" size={16} color="#fff" style={styles.buttonIcon} />
//         <Text style={[styles.buttonText, { color: '#fff' }]}>Invite</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderTabButton = (tabName, title, count, icon) => (
//     <TouchableOpacity
//       style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
//       onPress={() => setActiveTab(tabName)}
//     >
//       {icon && <Icon name={icon} size={18} color="#fff" style={styles.tabIcon} />}
//       <Text style={[
//         styles.tabText, 
//         { color: '#fff' },
//         activeTab === tabName && [styles.activeTabText, { color: '#fff' }]
//       ]}>
//         {title}
//       </Text>
//       {count > 0 && (
//         <View style={[styles.badge, { backgroundColor: colors.error }]}>
//           <Text style={[styles.badgeText, { color: colors.textInverse }]}>{count}</Text>
//         </View>
//       )}
//       {activeTab === tabName && (
//         <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />
//       )}
//     </TouchableOpacity>
//   );

//   const requestContactPermission = () => {
//     Alert.alert(
//       'Contacts Permission',
//       'We need access to your contacts to show them here. You can invite them to join the app.',
//       [
//         { text: 'Not Now', style: 'cancel' },
//         { 
//           text: 'Allow', 
//           onPress: async () => {
//             const permission = await Contacts.requestPermission();
//             if (permission === 'authorized') {
//               setHasContactPermission(true);
//               loadPhoneContacts();
//             }
//           }
//         }
//       ]
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case 'allUsers':
//         return filteredAllUsers;
//       case 'friends':
//         return filteredFriends;
//       case 'appUsers':
//         return filteredAppUsers;
//       case 'nonAppUsers':
//         return filteredNonAppUsers;
//       case 'phoneContacts':
//         return filteredPhoneContacts;
//       default:
//         return filteredAllUsers;
//     }
//   };

//   const getCurrentCount = () => {
//     switch (activeTab) {
//       case 'allUsers':
//         return filteredAllUsers.length;
//       case 'friends':
//         return filteredFriends.length;
//       case 'appUsers':
//         return filteredAppUsers.length;
//       case 'nonAppUsers':
//         return filteredNonAppUsers.length;
//       case 'phoneContacts':
//         return filteredPhoneContacts.length;
//       default:
//         return 0;
//     }
//   };

//   const renderEmptyComponent = () => {
//     if (loading || contactsLoading) return null;

//     if (activeTab === 'phoneContacts') {
//       if (!hasContactPermission) {
//         return (
//           <View style={styles.emptyContainer}>
//             <Icon name="contacts" size={60} color={colors.textTertiary} />
//             <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//               No access to contacts
//             </Text>
//             <TouchableOpacity 
//               style={[styles.permissionButton, { backgroundColor: colors.primary }]}
//               onPress={requestContactPermission}
//             >
//               <Text style={[styles.permissionButtonText, { color: '#fff' }]}>
//                 Allow Contacts Access
//               </Text>
//             </TouchableOpacity>
//           </View>
//         );
//       }
      
//       if (phoneContacts.length === 0) {
//         return (
//           <View style={styles.emptyContainer}>
//             <Icon name="contacts" size={60} color={colors.textTertiary} />
//             <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//               No contacts found on your phone
//             </Text>
//           </View>
//         );
//       }
//     }

//     // Show empty state based on search
//     if (searchQuery.trim() !== '' && getCurrentCount() === 0) {
//       return (
//         <View style={styles.emptyContainer}>
//           <Icon name="search-off" size={60} color={colors.textTertiary} />
//           <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//             No results found for "{searchQuery}"
//           </Text>
//           <Text style={[styles.emptySubText, { color: colors.textTertiary }]}>
//             Try searching with a different name or phone number
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.emptyContainer}>
//         <Icon name="people-outline" size={60} color={colors.textTertiary} />
//         <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//           {activeTab === 'friends' ? 'No friends yet' :
//            activeTab === 'appUsers' ? 'No suggestions available' :
//            activeTab === 'nonAppUsers' ? 'No contacts to invite' :
//            activeTab === 'allUsers' ? 'No users found' :
//            'No items found'}
//         </Text>
//       </View>
//     );
//   };

//   const renderItem = ({ item }) => {
//     if (activeTab === 'phoneContacts') {
//       return renderPhoneContactItem({ item });
//     }
//     return renderUserItem({ item });
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
//       <LinearGradient colors={[colors.primary, colors.primary]} style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.headerLeft}>
//             <Icon 
//               name="arrow-back" 
//               size={24} 
//               color='#fff' 
//               onPress={() => navigation.goBack()}
//             />
//             <Text style={[styles.headerTitle, { color: '#fff' }]}>Contacts</Text>
//           </View>
//           <TouchableOpacity onPress={()=>navigation.navigate('SyncContactForBusiness')}>
//             <Icon 
//               name="refresh" 
//               size={24} 
//               color='#fff' 
              
//             />
//           </TouchableOpacity>
//         </View>
        
//         <View style={[styles.searchContainer, { backgroundColor: '#fff' }]}>
//           <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
//           <TextInput
//             style={[styles.searchInput, { color: '#000' }]}
//             placeholder="Search by name or phone..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor={colors.textTertiary}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Icon name="close" size={20} color={colors.textTertiary} />
//             </TouchableOpacity>
//           )}
//           {(loading || contactsLoading) && (
//             <ActivityIndicator size="small" color={colors.primary} style={styles.searchLoading} />
//           )}
//         </View>

//         <View style={[styles.tabContainer, { backgroundColor: colors.primary }]}>
//           {renderTabButton('allUsers', 'People', allUsers.length, 'people')}
//           {/* {renderTabButton('friends', 'Friends', friends.length, 'people-alt')} */}
//           {renderTabButton('appUsers', 'Suggestions', appUsers.length, 'person-add')}
//           {renderTabButton('phoneContacts', 'Phone', phoneContacts.length, 'contact-phone')}
//         </View>
//       </LinearGradient>

//       {(loading || (activeTab === 'phoneContacts' && contactsLoading)) && (
//         <View style={styles.smallLoadingContainer}>
//           <ActivityIndicator size="small" color={colors.primary} />
//         </View>
//       )}

//       <FlatList
//         data={getCurrentData()}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => {
//           if (activeTab === 'phoneContacts') {
//             return `phone-${item.id || index}`;
//           }
//           return `${activeTab}-${item.id || item.phone_number || index}`;
//         }}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={renderEmptyComponent}
//         ListHeaderComponent={
//           searchQuery.trim() !== '' && getCurrentCount() > 0 ? (
//             <View style={styles.searchResultHeader}>
//               <Text style={[styles.searchResultText, { color: colors.textSecondary }]}>
//                 Found {getCurrentCount()} result{getCurrentCount() !== 1 ? 's' : ''} for "{searchQuery}"
//               </Text>
//             </View>
//           ) : null
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     paddingBottom: Platform.OS === 'android' ? 0 : 0,
//     paddingTop: Platform.OS === 'android' ? 20 : 0,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
//     elevation: 6,
//     zIndex: 1000,
//   },
//   headerTop: {
//     paddingTop: Platform.OS === 'android'? 30: 30,
//     paddingHorizontal: Platform.OS === 'android'? 20: 20,
//     paddingVertical: Platform.OS === 'android'? 0 : 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginLeft: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginVertical: 12,
//     paddingHorizontal: 12,
//     height: 48,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//   },
//   searchLoading: {
//     marginLeft: 8,
//   },
//   searchResultHeader: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginBottom: 8,
//   },
//   searchResultText: {
//     fontSize: 14,
//     fontStyle: 'italic',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.1)',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   tabIcon: {
//     marginRight: 4,
//   },
//   activeTab: {},
//   tabText: {
//     fontSize: 14,
//     paddingVertical: 6,
//   },
//   activeTabText: {
//     fontWeight: '600',
//   },
//   tabUnderline: {
//     height: 3,
//     borderRadius: 2,
//     marginTop: 4,
//     position: 'absolute',
//     bottom: 0,
//     left: '25%',
//     right: '25%',
//   },
//   badge: {
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 5,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 20,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     marginBottom: 12,
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
//     backgroundColor: '#f0f0f0',
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
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
//     marginBottom: 2,
//   },
//   contactPhone: {
//     fontSize: 14,
//   },
//   contactBadge: {
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//   },
//   contactBadgeText: {
//     fontSize: 12,
//   },
//   contactSavedAs: {
//     fontSize: 12,
//     marginTop: 2,
//   },
//   actionButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 80,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   buttonIcon: {
//     marginRight: 4,
//   },
//   buttonText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   emptySubText: {
//     fontSize: 14,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   smallLoadingContainer: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   permissionButton: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   permissionButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default ContactsScreen;

import React, { useState, useEffect, useMemo, useCallback} from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  StatusBar,
  Image,
  TextInput,
  Platform,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';
import Contacts from 'react-native-contacts';

// Initialize MMKV storage
const storage = createMMKV({
  id: 'contacts-storage',
});

// Cache keys
const CONTACTS_CACHE_KEY = 'contacts_cache';
const CONTACTS_CACHE_TIMESTAMP_KEY = 'contacts_cache_timestamp';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

const ContactsScreen = ({ navigation }) => {
  const { colors, theme, isDark } = useTheme();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredAllUsers, setFilteredAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [filteredAppUsers, setFilteredAppUsers] = useState([]);
  const [nonAppUsers, setNonAppUsers] = useState([]);
  const [filteredNonAppUsers, setFilteredNonAppUsers] = useState([]);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [filteredPhoneContacts, setFilteredPhoneContacts] = useState([]);
  const [pendingSent, setPendingSent] = useState(0);
  const [pendingReceived, setPendingReceived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('allUsers');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [hasContactPermission, setHasContactPermission] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ==================== CACHE FUNCTIONS (MMKV) ====================

  // Save contacts data to MMKV cache
  const saveContactsToCache = useCallback((data) => {
    try {
      console.log('💾 Saving contacts to MMKV cache...', {
        allUsers: data.allUsers?.length || 0,
        friends: data.friends?.length || 0,
        appUsers: data.appUsers?.length || 0,
        nonAppUsers: data.nonAppUsers?.length || 0,
        timestamp: new Date().toISOString()
      });

      const cacheData = {
        allUsers: data.allUsers || [],
        friends: data.friends || [],
        appUsers: data.appUsers || [],
        nonAppUsers: data.nonAppUsers || [],
        syncedContacts: data.syncedContacts || [],
        pendingSent: data.pendingSent || 0,
        pendingReceived: data.pendingReceived || 0,
        timestamp: Date.now()
      };

      storage.set(CONTACTS_CACHE_KEY, JSON.stringify(cacheData));
      storage.set(CONTACTS_CACHE_TIMESTAMP_KEY, String(Date.now()));
      console.log('✅ Contacts saved to MMKV cache successfully');
    } catch (error) {
      console.error('❌ Error saving contacts to cache:', error);
    }
  }, []);

  // Load contacts data from MMKV cache
  const loadContactsFromCache = useCallback(() => {
    try {
      console.log('🔍 Attempting to load contacts from MMKV cache...');
      const cachedData = storage.getString(CONTACTS_CACHE_KEY);
      
      if (cachedData) {
        console.log('📦 Cache data found, parsing...');
        const parsed = JSON.parse(cachedData);
        const timestamp = parseInt(storage.getString(CONTACTS_CACHE_TIMESTAMP_KEY) || '0');
        const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
        
        console.log(`⏰ Cache age: ${Math.round((Date.now() - timestamp) / 1000)}s, Valid: ${isCacheValid}`);
        
        if (isCacheValid && parsed) {
          console.log('✅ Loading contacts from MMKV cache:', {
            allUsers: parsed.allUsers?.length || 0,
            friends: parsed.friends?.length || 0,
            appUsers: parsed.appUsers?.length || 0,
            nonAppUsers: parsed.nonAppUsers?.length || 0
          });
          
          return parsed;
        } else {
          console.log('⏰ Cache expired, will fetch fresh data');
        }
      } else {
        console.log('📭 No cache data found for contacts');
      }
    } catch (error) {
      console.error('❌ Error loading contacts from cache:', error);
    }
    return null;
  }, []);

  // Clear contacts cache
  const clearContactsCache = useCallback(() => {
    try {
      console.log('🗑️ Clearing contacts cache...');
      storage.delete(CONTACTS_CACHE_KEY);
      storage.delete(CONTACTS_CACHE_TIMESTAMP_KEY);
      console.log('✅ Contacts cache cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing contacts cache:', error);
    }
  }, []);

  // ==================== CONTACT PERMISSION ====================

  const checkContactPermission = async () => {
    try {
      const permission = await Contacts.checkPermission();
      if (permission === 'authorized') {
        setHasContactPermission(true);
        loadPhoneContacts();
      } else if (permission === 'denied') {
        setHasContactPermission(false);
      } else {
        const newPermission = await Contacts.requestPermission();
        setHasContactPermission(newPermission === 'authorized');
        if (newPermission === 'authorized') {
          loadPhoneContacts();
        }
      }
    } catch (error) {
      console.log('Error checking contact permission:', error);
    }
  };

  const loadPhoneContacts = async () => {
    try {
      setContactsLoading(true);
      console.log('📱 Loading phone contacts...');
      const contacts = await Contacts.getAll();
      
      const processedContacts = contacts
        .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map(contact => ({
          id: contact.recordID,
          displayName: contact.displayName,
          phoneNumbers: contact.phoneNumbers.map(p => p.number),
          thumbnailPath: contact.thumbnailPath,
          hasThumbnail: contact.hasThumbnail,
        }))
        .filter(contact => contact.phoneNumbers.length > 0);

      console.log(`📱 Loaded ${processedContacts.length} phone contacts`);
      setPhoneContacts(processedContacts);
      setFilteredPhoneContacts(processedContacts);
    } catch (error) {
      console.log('Error loading phone contacts:', error);
      Alert.alert('Error', 'Failed to load contacts from your phone');
    } finally {
      setContactsLoading(false);
    }
  };

  // ==================== FETCH CONTACTS ====================

  const fetchContacts = async () => {
    try {
      setLoading(true);
      console.log('🌐 Fetching contacts from API...');
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Contacts API response received');

      // Process users to convert HTTP to HTTPS in profile pictures
      const processedAllUsers = (response.data.all_users || []).map(user => ({
        ...user,
        profile_picture: convertHttpToHttps(user.profile_picture)
      }));

      const processedSyncedContacts = (response.data.synced_contacts || []).map(contact => ({
        ...contact,
        user_details: contact.user_details ? {
          ...contact.user_details,
          profile_picture: convertHttpToHttps(contact.user_details.profile_picture)
        } : null
      }));

      const friendsList = processedSyncedContacts.filter(c => c.user_details?.is_friend);
      const appUsersList = processedSyncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
      const nonAppUsersList = processedSyncedContacts.filter(c => !c.is_app_user);

      // Update state
      setAllUsers(processedAllUsers);
      setFilteredAllUsers(processedAllUsers);
      setContacts(processedSyncedContacts);
      setFriends(friendsList);
      setFilteredFriends(friendsList);
      setAppUsers(appUsersList);
      setFilteredAppUsers(appUsersList);
      setNonAppUsers(nonAppUsersList);
      setFilteredNonAppUsers(nonAppUsersList);
      setPendingSent(response.data.pending_sent || 0);
      setPendingReceived(response.data.pending_received || 0);

      // Save to MMKV cache
      saveContactsToCache({
        allUsers: processedAllUsers,
        friends: friendsList,
        appUsers: appUsersList,
        nonAppUsers: nonAppUsersList,
        syncedContacts: processedSyncedContacts,
        pendingSent: response.data.pending_sent || 0,
        pendingReceived: response.data.pending_received || 0
      });

      console.log('✅ Contacts data loaded and cached successfully');
    } catch (error) {
      console.error('❌ Error fetching contacts:', error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // ==================== INITIAL LOAD (CACHE FIRST) ====================

  useEffect(() => {
    const instantLoad = async () => {
      console.log('🚀 Starting contacts instant load...');
      
      // 1. Try to load from MMKV cache first
      const cachedData = loadContactsFromCache();
      
      if (cachedData) {
        console.log('✅ Loading contacts from cache...');
        setAllUsers(cachedData.allUsers || []);
        setFilteredAllUsers(cachedData.allUsers || []);
        setContacts(cachedData.syncedContacts || []);
        setFriends(cachedData.friends || []);
        setFilteredFriends(cachedData.friends || []);
        setAppUsers(cachedData.appUsers || []);
        setFilteredAppUsers(cachedData.appUsers || []);
        setNonAppUsers(cachedData.nonAppUsers || []);
        setFilteredNonAppUsers(cachedData.nonAppUsers || []);
        setPendingSent(cachedData.pendingSent || 0);
        setPendingReceived(cachedData.pendingReceived || 0);
        setLoading(false);
        setIsInitialLoad(false);
        
        // 2. Background refresh after a delay
        console.log('🔄 Refreshing contacts in background...');
        setTimeout(() => {
          fetchContacts();
        }, 500);
      } else {
        // 3. No cache, fetch fresh data
        console.log('📭 No cache found, fetching fresh data...');
        await fetchContacts();
      }
    };
    
    instantLoad();
    checkContactPermission();
  }, []);

  // ==================== SEARCH EFFECT ====================

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAllUsers(allUsers);
      setFilteredFriends(friends);
      setFilteredAppUsers(appUsers);
      setFilteredNonAppUsers(nonAppUsers);
      setFilteredPhoneContacts(phoneContacts);
    } else {
      const query = searchQuery.toLowerCase().trim();

      const filteredAll = allUsers.filter(user => 
        (user.name?.toLowerCase().includes(query)) ||
        (user.phone_number?.toLowerCase().includes(query)) ||
        (user.contact_name?.toLowerCase().includes(query)) ||
        (user.email?.toLowerCase().includes(query)) ||
        (user.username?.toLowerCase().includes(query))
      );
      setFilteredAllUsers(filteredAll);

      const filteredF = friends.filter(friend => 
        (friend.name?.toLowerCase().includes(query)) ||
        (friend.phone_number?.toLowerCase().includes(query)) ||
        (friend.contact_name?.toLowerCase().includes(query)) ||
        (friend.email?.toLowerCase().includes(query)) ||
        (friend.username?.toLowerCase().includes(query)) ||
        (friend.user_details?.name?.toLowerCase().includes(query)) ||
        (friend.user_details?.phone?.toLowerCase().includes(query))
      );
      setFilteredFriends(filteredF);

      const filteredApp = appUsers.filter(user => {
        const userName = user.name?.toLowerCase() || 
                        user.user_details?.name?.toLowerCase() || 
                        user.contact_name?.toLowerCase() || '';
        const userPhone = user.phone_number?.toLowerCase() || 
                         user.user_details?.phone?.toLowerCase() || '';
        const userEmail = user.email?.toLowerCase() || 
                         user.user_details?.email?.toLowerCase() || '';
        
        return userName.includes(query) || 
               userPhone.includes(query) || 
               userEmail.includes(query);
      });
      setFilteredAppUsers(filteredApp);

      const filteredNonApp = nonAppUsers.filter(user => {
        const userName = user.name?.toLowerCase() || 
                        user.contact_name?.toLowerCase() || '';
        const userPhone = user.phone_number?.toLowerCase() || '';
        
        return userName.includes(query) || userPhone.includes(query);
      });
      setFilteredNonAppUsers(filteredNonApp);

      const filteredPhone = phoneContacts.filter(contact => {
        const contactName = contact.displayName?.toLowerCase() || '';
        const contactNumber = contact.phoneNumbers[0]?.number?.toLowerCase() || '';
        return contactName.includes(query) || contactNumber.includes(query);
      });
      setFilteredPhoneContacts(filteredPhone);
    }
  }, [searchQuery, allUsers, friends, appUsers, nonAppUsers, phoneContacts]);

  // ==================== HELPER FUNCTIONS ====================

  const convertHttpToHttps = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  };

  const isValidProfilePicture = (profilePic) => {
    if (!profilePic) return false;
    if (typeof profilePic !== 'string') return false;
    if (profilePic.trim() === '') return false;
    if (profilePic === 'null' || profilePic === 'undefined') return false;
    return true;
  };

  const sendInvite = (contact) => {
    const phoneNumber = contact.phoneNumbers[0]?.replace(/[^0-9]/g, '');
    
    const appStoreLink = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/us/app/showa-chat-meet-connect/id6759247435'
      : 'https://play.google.com/store/apps/details?id=com.showa&hl=en';
    
    const message = `Hey! I'm using this amazing new social app called SHOWA and I think you'll love it too.\nJoin me and let's connect! Download it here: ${appStoreLink}`;
    
    const smsUrl = Platform.OS === 'ios'
      ? `sms:${phoneNumber}&body=${encodeURIComponent(message)}`  
      : `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(smsUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(smsUrl);
        } else {
          Alert.alert(
            'Invite',
            `Send this message to ${contact.displayName}: \n\n${message}`,
            [
              { text: 'Copy Message', onPress: () => copyToClipboard(message) },
              { text: 'OK', style: 'cancel' }
            ]
          );
        }
      })
      .catch(err => {
        console.log('Error opening SMS app:', err);
        Alert.alert('Error', 'Could not open messaging app');
      });
  };

  const copyToClipboard = (text) => {
    Alert.alert('Copied!', 'Message copied to clipboard');
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderUserAvatar = (item) => {
    let profilePic = item.profile_picture || item.user_details?.profile_picture;
    
    if (typeof profilePic === 'string') {
      profilePic = convertHttpToHttps(profilePic);
    }
    
    if (isValidProfilePicture(profilePic)) {
      return (
        <Image 
          source={{ uri: profilePic }} 
          style={styles.avatar}
          onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
        />
      );
    }
    return (
      <Image 
        source={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
        style={styles.avatar}
      />
    );
  };

  const renderContactAvatar = (contact) => {
    if (contact.hasThumbnail && contact.thumbnailPath) {
      return (
        <Image 
          source={{ uri: contact.thumbnailPath }} 
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
        <Icon name="person" size={24} color={colors.primary} />
      </View>
    );
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.contactItem, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      onPress={() => {
        let profilePic = item.profile_picture || item.user_details?.profile_picture;
        
        if (typeof profilePic === 'string') {
          profilePic = convertHttpToHttps(profilePic);
        }
        
        navigation.navigate('PrivateChat', {
          receiverId: item.id || item.user_details?.id,
          name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
          profile_image: isValidProfilePicture(profilePic) 
            ? profilePic 
            : require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
          chatType: 'single',
        });
      }}
    >
      <View style={styles.contactInfo}>
        {renderUserAvatar(item)}
        <View style={styles.contactTextContainer}>
          <Text style={[styles.contactName, { color: colors.text }]}>
            {item.name || item.user_details?.name || item.phone_number || 'Unknown User'}
          </Text>
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
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          let profilePic = item.profile_picture || item.user_details?.profile_picture;
          
          if (typeof profilePic === 'string') {
            profilePic = convertHttpToHttps(profilePic);
          }
          
          navigation.navigate('PrivateChat', {
            receiverId: item.id || item.user_details?.id,
            name: item.contact_name || item.name || item.user_details?.name || item.phone_number || 'Unknown User',
            profile_image: isValidProfilePicture(profilePic) 
              ? profilePic 
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
            chatType: 'single',
          });
        }}
      >
        <Text style={[styles.buttonText, { color: colors.textInverse }]}>Message</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPhoneContactItem = ({ item }) => (
    <View style={[styles.contactItem, { backgroundColor: colors.surface }]}>
      <View style={styles.contactInfo}>
        {renderContactAvatar(item)}
        <View style={styles.contactTextContainer}>
          <Text style={[styles.contactName, { color: colors.text }]}>
            {item.displayName}
          </Text>
          {item.phoneNumbers && item.phoneNumbers.length > 0 && (
            <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>
              {item.phoneNumbers[0]}
            </Text>
          )}
          {item.phoneNumbers && item.phoneNumbers.length > 1 && (
            <Text style={[styles.contactBadgeText, { color: colors.textTertiary }]}>
              +{item.phoneNumbers.length - 1} more numbers
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: colors.success || '#4CAF50' }]}
        onPress={() => sendInvite(item)}
      >
        <Icon name="share" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={[styles.buttonText, { color: '#fff' }]}>Invite</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabButton = (tabName, title, count, icon) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      
      <Text style={[
        styles.tabText, 
        { color: '#fff' },
        activeTab === tabName && [styles.activeTabText, { color: '#fff' }]
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.error }]}>
          <Text style={[styles.badgeText, { color: colors.textInverse }]}>{count}</Text>
        </View>
      )}
      {activeTab === tabName && (
        <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  const requestContactPermission = () => {
    Alert.alert(
      'Contacts Permission',
      'We need access to your contacts to show them here. You can invite them to join the app.',
      [
        { text: 'Not Now', style: 'cancel' },
        { 
          text: 'Allow', 
          onPress: async () => {
            const permission = await Contacts.requestPermission();
            if (permission === 'authorized') {
              setHasContactPermission(true);
              loadPhoneContacts();
            }
          }
        }
      ]
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'allUsers':
        return filteredAllUsers;
      case 'friends':
        return filteredFriends;
      case 'appUsers':
        return filteredAppUsers;
      case 'nonAppUsers':
        return filteredNonAppUsers;
      case 'phoneContacts':
        return filteredPhoneContacts;
      default:
        return filteredAllUsers;
    }
  };

  const getCurrentCount = () => {
    switch (activeTab) {
      case 'allUsers':
        return filteredAllUsers.length;
      case 'friends':
        return filteredFriends.length;
      case 'appUsers':
        return filteredAppUsers.length;
      case 'nonAppUsers':
        return filteredNonAppUsers.length;
      case 'phoneContacts':
        return filteredPhoneContacts.length;
      default:
        return 0;
    }
  };

  const renderEmptyComponent = () => {
    if (loading || contactsLoading) return null;

    if (activeTab === 'phoneContacts') {
      if (!hasContactPermission) {
        return (
          <View style={styles.emptyContainer}>
            <Icon name="contacts" size={60} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No access to contacts
            </Text>
            <TouchableOpacity 
              style={[styles.permissionButton, { backgroundColor: colors.primary }]}
              onPress={requestContactPermission}
            >
              <Text style={[styles.permissionButtonText, { color: '#fff' }]}>
                Allow Contacts Access
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      
      if (phoneContacts.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Icon name="contacts" size={60} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No contacts found on your phone
            </Text>
          </View>
        );
      }
    }

    if (searchQuery.trim() !== '' && getCurrentCount() === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="search-off" size={60} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No results found for "{searchQuery}"
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textTertiary }]}>
            Try searching with a different name or phone number
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="people-outline" size={60} color={colors.textTertiary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {activeTab === 'friends' ? 'No friends yet' :
           activeTab === 'appUsers' ? 'No suggestions available' :
           activeTab === 'nonAppUsers' ? 'No contacts to invite' :
           activeTab === 'allUsers' ? 'No users found' :
           'No items found'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (activeTab === 'phoneContacts') {
      return renderPhoneContactItem({ item });
    }
    return renderUserItem({ item });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
      <LinearGradient colors={[colors.primary, colors.primary]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Icon 
              name="arrow-back" 
              size={24} 
              color='#fff' 
              onPress={() => navigation.goBack()}
            />
            <Text style={[styles.headerTitle, { color: '#fff' }]}>Contacts</Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              clearContactsCache();
              fetchContacts();
            }}
          >
            <Icon 
              name="refresh" 
              size={24} 
              color='#fff' 
            />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: '#fff' }]}>
          <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: '#000' }]}
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
          {/* {(loading || contactsLoading) && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.searchLoading} />
          )} */}

          {(loading || (activeTab === 'phoneContacts' && contactsLoading)) && (
        <View style={styles.smallLoadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
        </View>

        <View style={[styles.tabContainer, { backgroundColor: colors.primary }]}>
          {renderTabButton('allUsers', 'People', allUsers.length, 'people')}
          {renderTabButton('appUsers', 'Suggestions', appUsers.length, 'person-add')}
          {renderTabButton('phoneContacts', 'Phone', phoneContacts.length, 'contact-phone')}
        </View>
      </LinearGradient>

      

      <FlatList
        data={getCurrentData()}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          if (activeTab === 'phoneContacts') {
            return `phone-${item.id || index}`;
          }
          return `${activeTab}-${item.id || item.phone_number || index}`;
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={
          searchQuery.trim() !== '' && getCurrentCount() > 0 ? (
            <View style={styles.searchResultHeader}>
              <Text style={[styles.searchResultText, { color: colors.textSecondary }]}>
                Found {getCurrentCount()} result{getCurrentCount() !== 1 ? 's' : ''} for "{searchQuery}"
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Platform.OS === 'android' ? 0 : 0,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
    elevation: 6,
    zIndex: 1000,
  },
  headerTop: {
    paddingTop: Platform.OS === 'android'? 10: 30,
    paddingHorizontal: Platform.OS === 'android'? 20: 20,
    paddingVertical: Platform.OS === 'android'? 0 : 10,
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
  searchLoading: {
    marginLeft: 8,
  },
  searchResultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchResultText: {
    fontSize: 14,
    fontStyle: 'italic',
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
  tabIcon: {
    marginRight: 4,
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    paddingVertical: 6,
  },
  activeTabText: {
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
    backgroundColor: '#f0f0f0',
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
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  smallLoadingContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ContactsScreen;