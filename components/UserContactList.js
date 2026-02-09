// import React, { useState, useEffect } from 'react';
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
//   TextInput
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ContactsScreen = ({ navigation }) => {

//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [nonAppUsers, setNonAppUsers] = useState([]);
//   const [pendingSent, setPendingSent] = useState(0);
//   const [pendingReceived, setPendingReceived] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('allUsers');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contacts, setContacts] = useState([]);

//   useEffect(() => {
//     fetchContacts();
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

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Set all users data with contact info
//       setAllUsers(response.data.all_users || []);
//       setFilteredUsers(response.data.all_users || []);
      
//       // Handle synced contacts
//       const syncedContacts = response.data.synced_contacts || [];
//       const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
//       const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
//       const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);

//       setContacts(syncedContacts);
//       setFriends(friendsList);
//       setAppUsers(appUsersList);
//       setNonAppUsers(nonAppUsersList);
      
//       // Update counts
//       setPendingSent(response.data.pending_sent || 0);
//       setPendingReceived(response.data.pending_received || 0);
//     } catch (error) {
//       //console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderUserAvatar = (item) => {
//     const profilePic = item.profile_picture || item.user_details?.profile_picture;
//     if (profilePic) {
//       return (
//         <Image 
//           source={{ uri: profilePic }} 
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

//   const renderUserItem = ({ item}) => (
//     <View style={styles.contactItem}>
//       <View style={styles.contactInfo}>
//         {renderUserAvatar(item)}
//         <View style={styles.contactTextContainer}>
//           <Text style={styles.contactName}>{item.name || item.phone_number}</Text>
//           <Text style={styles.contactPhone}>{item.phone_number}</Text>
//           {item.is_in_contacts && (
//             <View style={styles.contactBadge}>
//               <Text style={styles.contactBadgeText}>In your contacts</Text>
//               {item.contact_name && item.contact_name !== item.name && (
//                 <Text style={styles.contactSavedAs}>
//                   Saved as: {item.contact_name}
//                 </Text>
//               )}
//             </View>
//           )}
//         </View>
//       </View>
//       <TouchableOpacity 
//         style={styles.addButton}
//         onPress={() => {
//           const profilePic = item.profile_picture || item.user_details?.profile_picture;
//           const relativePath = profilePic ? profilePic.replace(/^https?:\/\/[^\/]+/, '') : null;

//           navigation.navigate('BPrivateChat', {
//             receiverId: item.id || item.user_details?.id,
//             name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//             profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//             chatType: 'single',
//           });
//         }}
//       >
//         <Text style={styles.buttonText}>Message</Text>
//       </TouchableOpacity>
//     </View>
//   );

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
//         </View>
//         <TouchableOpacity style={styles.searchButton}>
//           <Icon name="search" size={24} color="#4E8AF4" />
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
//         {/* {loading && (
//           <ActivityIndicator size="small" color="#4E8AF4" style={styles.searchLoading} />
//         )} */}
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         {renderTabButton('allUsers', 'Users on Showa', allUsers.length)}
//         {/* {renderTabButton('friends', 'Friends', friends.length)} */}
//         {renderTabButton('appUsers', 'Suggestions', appUsers.length)}
//         {/* {renderTabButton('pending', 'Requests', pendingReceived)} */}
//       </View>

//       {/* Small Loading Indicator */}
//       {loading && (
//         <View style={styles.smallLoadingContainer}>
//           <ActivityIndicator size="small" color="#4E8AF4" />
//         </View>
//       )}

//       {/* User List */}
//       <FlatList
//         data={
//           activeTab === 'allUsers' ? filteredUsers :
//           activeTab === 'friends' ? friends :
//           activeTab === 'appUsers' ? appUsers :
//           []
//         }
//         renderItem={renderUserItem}
//         keyExtractor={(item, index) => item.id || `${item.phone_number}-${index}`}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           !loading && (
//             <View style={styles.emptyContainer}>
//               <Icon name="people-outline" size={60} color="#D1D5DB" />
//               <Text style={styles.emptyText}>
//                 {activeTab === 'friends' ? 'No friends yet' :
//                  activeTab === 'appUsers' ? 'No suggestions available' :
//                  activeTab === 'pending' ? 'No pending requests' :
//                  'No users found'}
//               </Text>
//             </View>
//           )
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
//     position: 'relative',
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
//   searchLoading: {
//     position: 'absolute',
//     right: 12,
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
//   addButton: {
//     backgroundColor: '#4E8AF4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
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
//     color: '#6B7280',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   smallLoadingContainer: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
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
  ActivityIndicator, 
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
  Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';

const ContactsScreen = ({ navigation }) => {
  const { colors, theme, isDark } = useTheme();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [nonAppUsers, setNonAppUsers] = useState([]);
  const [pendingSent, setPendingSent] = useState(0);
  const [pendingReceived, setPendingReceived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('allUsers');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
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

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Set all users data with contact info
      setAllUsers(response.data.all_users || []);
      setFilteredUsers(response.data.all_users || []);
      
      // Handle synced contacts
      const syncedContacts = response.data.synced_contacts || [];
      const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
      const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
      const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);

      setContacts(syncedContacts);
      setFriends(friendsList);
      setAppUsers(appUsersList);
      setNonAppUsers(nonAppUsersList);
      
      // Update counts
      setPendingSent(response.data.pending_sent || 0);
      setPendingReceived(response.data.pending_received || 0);
    } catch (error) {
      //console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to validate profile picture URL
  const isValidProfilePicture = (profilePic) => {
    if (!profilePic) return false;
    if (typeof profilePic !== 'string') return false;
    if (profilePic.trim() === '') return false;
    if (profilePic === 'null' || profilePic === 'undefined') return false;
    return true;
  };

  const renderUserAvatar = (item) => {
    const profilePic = item.profile_picture || item.user_details?.profile_picture;
    
    // Check if profilePic is valid
    if (isValidProfilePicture(profilePic)) {
      return (
        <Image 
          source={{ uri: profilePic }} 
          style={styles.avatar}
          onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
        />
      );
    }
    // If no valid profile picture, show placeholder or default image
    return (
      <Image 
        source={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
        style={styles.avatar}
      />
    );
  };

  const renderUserItem = ({ item}) => (
    <TouchableOpacity 
      style={[styles.contactItem, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      onPress={() => {
        const profilePic = item.profile_picture || item.user_details?.profile_picture;
        
        navigation.navigate('BPrivateChat', {
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
            {item.name || item.phone_number || 'Unknown User'}
          </Text>
          {item.phone_number && (
            <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>
              {item.phone_number}
            </Text>
          )}
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
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          const profilePic = item.profile_picture || item.user_details?.profile_picture;
          console
          
          navigation.navigate('BPrivateChat', {
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

  const renderTabButton = (tabName, title, count) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[
        styles.tabText, 
        { color: colors.textSecondary },
        activeTab === tabName && [styles.activeTabText, { color: colors.text }]
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
      <LinearGradient colors={[colors.primary, colors.primary]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Icon 
              name="arrow-back" 
              size={24} 
              color={colors.text} 
              onPress={() => navigation.goBack()}
            />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Contacts</Text>
          </View>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: '#fff' }]}>
          <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: '#000' }]}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textTertiary}
          />
          {loading && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.searchLoading} />
          )}
        </View>

        <View style={[styles.tabContainer, { backgroundColor: colors.primary }]}>
          {renderTabButton('allUsers', 'People you may know', allUsers.length)}
          {renderTabButton('appUsers', 'Suggestions', appUsers.length)}
        </View>
      </LinearGradient>

      {loading && (
        <View style={styles.smallLoadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      <FlatList
        data={
          activeTab === 'allUsers' ? filteredUsers :
          activeTab === 'friends' ? friends :
          activeTab === 'appUsers' ? appUsers :
          []
        }
        renderItem={renderUserItem}
        keyExtractor={(item, index) => `${item.id || item.phone_number || 'unknown'}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={60} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {activeTab === 'friends' ? 'No friends yet' :
                 activeTab === 'appUsers' ? 'No suggestions available' :
                 activeTab === 'pending' ? 'No pending requests' :
                 'No users found'}
              </Text>
            </View>
          )
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
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    paddingTop: Platform.OS === 'android' ? 14 : 0,
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
    position: 'absolute',
    right: 12,
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
    backgroundColor: '#f0f0f0',
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
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
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
  smallLoadingContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContactsScreen;