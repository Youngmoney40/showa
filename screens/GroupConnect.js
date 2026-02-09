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
//   TextInput
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import colors from '../theme/colors';


// const ContactsScreen = ({ navigation, route }) => {
//   const [contacts, setContacts] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetchContacts();
//   }, []);

  

//   const fetchContacts = async () => {
//   try {
//     setLoading(true);
//     const token = await AsyncStorage.getItem('userToken');
    
//     const response = await axios.get(`${API_ROUTE}/contacts/`, {
//       headers: { Authorization: `Bearer ${token}` },
//       timeout: 15000,
//     });

//     console.log('API Response:', response.data);

//     // Get the users from the response
//     const allUsers = response.data.all_users || [];
    
//     // Transform the users into the format your component expects
//     const formattedContacts = allUsers.map(user => ({
//       id: user.id,
//       name: user.name,
//       phone_number: user.phone_number,
//       is_app_user: true,
//       user_details: {
//         id: user.id,
//         name: user.name,
//         profile_picture: user.profile_picture,
//         is_friend: user.friendship_status === 'friends'
//       }
//     }));

//     setContacts(formattedContacts);
//     setAppUsers(formattedContacts); 
//   } catch (error) {
//     //console.error('Error fetching contacts:', error);
//   } finally {
//     setLoading(false);
//   }
// };


//   const toggleUserSelection = (user) => {
//   setSelectedUsers(prev => {
//     const isSelected = prev.some(u => u.id === user.id); 
//     if (isSelected) {
//       return prev.filter(u => u.id !== user.id);
//     } else {
//       return [...prev, {
//         id: user.id,
//         username: user.name, 
//         name: user.name,
//         profile_picture: user.user_details?.profile_picture
//       }];
//     }
//   });
// };
  

//   const renderContactAvatar = (item) => {
//     if (item.user_details?.profile_picture) {
//       return (
        
//         <Image 
//         source={{ uri:`${API_ROUTE_IMAGE}${item.user_details.profile_picture }` }}
//           //source={{ uri: item.user_details.profile_picture }} 
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

//   const filteredUsers = appUsers.filter(user => 
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.phone_number.includes(searchQuery)
//   );

//   const renderItem = ({ item }) => {
//     const isSelected = selectedUsers.some(u => u.id === item.user_details.id);
    
//     return (
//       <TouchableOpacity 
//         style={[
//           styles.contactItem,
//           isSelected && styles.selectedContactItem
//         ]}
//         onPress={() => toggleUserSelection(item)}
//       >
//         <View style={styles.contactInfo}>
//           {renderContactAvatar(item)}
//           <View style={styles.contactTextContainer}>
//             <Text style={styles.contactName}>{item.name}</Text>
//             <Text style={styles.contactPhone}>{item.phone_number}</Text>
//           </View>
//         </View>
//         {isSelected ? (
//           <Icon name="check-circle" size={24} color="#4E8AF4" />
//         ) : (
//           <View style={styles.circle} />
//         )}
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4E8AF4" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{flex:1}}>

//       <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon 
//             style={styles.backIcon} 
//             name="arrow-back" 
//             size={24} 
//             color="#111827" 
//             onPress={() => navigation.goBack()} 
//           />
//           <Text style={styles.headerTitle}>New Group</Text>
//         </View>
//         {selectedUsers.length > 0 && (
//           <TouchableOpacity
//           onPress={() => navigation.navigate('GroupCreate', { 
//           selectedUsers: selectedUsers.map(user => ({
//             id: user.id,
//             username: user.username,
//             name: user.name,
//             profile_picture: user.profile_picture
//           }))
//         })}

            
//           >
//             <Text style={styles.nextButton}>Next</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Search Bar ======================*/}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts"
//           placeholderTextColor="#9CA3AF"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

    
//       {selectedUsers.length > 0 && (
//         <View style={styles.selectedUsersContainer}>
//           <Text style={styles.selectedUsersTitle}>Selected: {selectedUsers.length}</Text>
//           <FlatList
//             horizontal
//             data={selectedUsers}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <View style={styles.selectedUser}>
               
//                 {item.profile_picture ? (
//                   <Image 
//                     source={{ uri:`${API_ROUTE_IMAGE}${item.profile_picture}` }} 
//                     style={styles.selectedUserAvatar}
//                   />
//                 ) : (
//                   <View style={[styles.selectedUserAvatar, styles.avatarPlaceholder]}>
//                     <Icon name="person" size={16} color="#000" />
//                   </View>
//                 )}
//                 <Text style={styles.selectedUserName} numberOfLines={1}>
//                   {item.name}
//                 </Text>
//               </View>
//             )}
//             contentContainerStyle={styles.selectedUsersList}
//           />
//         </View>
//       )}

     
//       <FlatList
//         data={filteredUsers}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id?.toString() || item.phone_number}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="people-outline" size={60} color="#D1D5DB" />
//             <Text style={styles.emptyText}>No contacts available</Text>
//           </View>
//         }
//       />
//     </View>

//     </SafeAreaView>
    
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backIcon: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   nextButton: {
//     color: colors.primary,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     margin: 16,
//     paddingHorizontal: 12,
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//   },
//   selectedUsersContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     backgroundColor: '#fff',
//   },
//   selectedUsersTitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   selectedUsersList: {
//     paddingBottom: 12,
//   },
//   selectedUser: {
//     alignItems: 'center',
//     marginRight: 12,
//     width: 60,
//   },
//   selectedUserAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginBottom: 4,
//   },
//   selectedUserName: {
//     fontSize: 12,
//     color: '#4B5563',
//     textAlign: 'center',
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
//     marginTop: 8,
//     borderRadius: 8,
//   },
//   selectedContactItem: {
//     backgroundColor: '#F3F4F6',
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
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
//   circle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
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
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../src/context/ThemeContext';

const ContactsScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });

      console.log('API Response:', response.data);

      // Get the users from the response
      const allUsers = response.data.all_users || [];
      
      // Transform the users into the format your component expects
      const formattedContacts = allUsers.map(user => ({
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        is_app_user: true,
        user_details: {
          id: user.id,
          name: user.name,
          profile_picture: user.profile_picture,
          is_friend: user.friendship_status === 'friends'
        }
      }));

      setContacts(formattedContacts);
      setAppUsers(formattedContacts); 
    } catch (error) {
      //console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id); 
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, {
          id: user.id,
          username: user.name, 
          name: user.name,
          profile_picture: user.user_details?.profile_picture
        }];
      }
    });
  };

  const renderContactAvatar = (item) => {
    if (item.user_details?.profile_picture) {
      return (
        <Image 
          source={{ uri: `${API_ROUTE_IMAGE}${item.user_details.profile_picture}` }}
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.textSecondary }]}>
        <Icon name="person" size={24} color={isDark ? colors.text : '#fff'} />
      </View>
    );
  };

  const filteredUsers = appUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone_number.includes(searchQuery)
  );

  const renderItem = ({ item }) => {
    const isSelected = selectedUsers.some(u => u.id === item.user_details.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.contactItem,
          { backgroundColor: colors.card },
          isSelected && [styles.selectedContactItem, { backgroundColor: colors.backgroundSecondary }]
        ]}
        onPress={() => toggleUserSelection(item)}
      >
        <View style={styles.contactInfo}>
          {renderContactAvatar(item)}
          <View style={styles.contactTextContainer}>
            <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{item.phone_number}</Text>
          </View>
        </View>
        {isSelected ? (
          <Icon name="check-circle" size={24} color={colors.primary} />
        ) : (
          <View style={[styles.circle, { borderColor: colors.border }]} />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={colors.background} 
        />
        
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colors.card,
          borderBottomColor: colors.border 
        }]}>
          <View style={styles.headerLeft}>
            <Icon 
              style={styles.backIcon} 
              name="arrow-back" 
              size={24} 
              color={colors.text} 
              onPress={() => navigation.goBack()} 
            />
            <Text style={[styles.headerTitle, { color: colors.text }]}>New Group</Text>
          </View>
          {selectedUsers.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('GroupCreate', { 
                selectedUsers: selectedUsers.map(user => ({
                  id: user.id,
                  username: user.username,
                  name: user.name,
                  profile_picture: user.profile_picture
                }))
              })}
            >
              <Text style={[styles.nextButton, { color: colors.primary }]}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }]}>
          <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search contacts"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {selectedUsers.length > 0 && (
          <View style={[styles.selectedUsersContainer, { 
            backgroundColor: colors.card,
            borderBottomColor: colors.border 
          }]}>
            <Text style={[styles.selectedUsersTitle, { color: colors.textSecondary }]}>
              Selected: {selectedUsers.length}
            </Text>
            <FlatList
              horizontal
              data={selectedUsers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.selectedUser}>
                  {item.profile_picture ? (
                    <Image 
                      source={{ uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }} 
                      style={styles.selectedUserAvatar}
                    />
                  ) : (
                    <View style={[
                      styles.selectedUserAvatar, 
                      styles.avatarPlaceholder, 
                      { backgroundColor: colors.textSecondary }
                    ]}>
                      <Icon name="person" size={16} color={isDark ? colors.text : '#000'} />
                    </View>
                  )}
                  <Text style={[styles.selectedUserName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.selectedUsersList}
            />
          </View>
        )}

        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || item.phone_number}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No contacts available
              </Text>
            </View>
          }
          style={{ backgroundColor: colors.background }}
        />
      </View>
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
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  nextButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  selectedUsersContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
  },
  selectedUsersTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectedUsersList: {
    paddingBottom: 12,
  },
  selectedUser: {
    alignItems: 'center',
    marginRight: 12,
    width: 60,
  },
  selectedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  selectedUserName: {
    fontSize: 12,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  selectedContactItem: {
    // backgroundColor is set inline
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
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
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
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
});

export default ContactsScreen;
