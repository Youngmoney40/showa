// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   StatusBar,
//   Platform,
//   TextInput,
//   Alert,
//   Modal,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinearGradient from 'react-native-linear-gradient';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { useTheme } from '../src/context/ThemeContext';

// const GroupMembersScreen = ({ navigation, route }) => {
//   const { colors, isDark } = useTheme();
//   const { groupSlug, groupName } = route.params;
//   const [members, setMembers] = useState([]);
//   const [groupInfo, setGroupInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);
  
//   const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
//   const [userSearchQuery, setUserSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchingUsers, setSearchingUsers] = useState(false);
//   const [addingUser, setAddingUser] = useState(null);
//   const [removingUser, setRemovingUser] = useState(null);

//   const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

//   // ===== OPTIMIZED: Get current user ID first =====
//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('userData');
//         if (userData) {
//           const parsed = JSON.parse(userData);
//           setCurrentUserId(parsed.id);
//         }
//         // Start fetching members immediately
//         await fetchGroupMembers();
//       } catch (error) {
//         console.error('Error initializing:', error);
//         setLoading(false);
//       }
//     };
    
//     initialize();
//   }, []);

//   // ===== OPTIMIZED: Fetch members with admin check =====
//   const fetchGroupMembers = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       if (!token) {
//         Alert.alert('Error', 'Please login again');
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(
//         `${API_ROUTE}/groups/${groupSlug}/members/`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         setGroupInfo(response.data.group);
//         setMembers(response.data.members);
        
//         // Check admin status immediately
//         const currentUser = response.data.members.find(m => m.id === currentUserId);
//         const adminStatus = currentUser?.is_creator || false;
//         setIsAdmin(adminStatus);
        
//         // Store admin status in AsyncStorage for faster next load
//         if (adminStatus) {
//           await AsyncStorage.setItem(`admin_${groupSlug}`, 'true');
//         } else {
//           await AsyncStorage.removeItem(`admin_${groupSlug}`);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching group members:', error.response?.data || error.message);
//       Alert.alert('Error', 'Failed to load group members');
//     } finally {
//       setLoading(false);
//       setInitialLoad(false);
//     }
//   };

//   // ===== OPTIMIZED: Check cached admin status on mount =====
//   const checkCachedAdminStatus = useCallback(async () => {
//     try {
//       const cached = await AsyncStorage.getItem(`admin_${groupSlug}`);
//       if (cached === 'true') {
//         setIsAdmin(true);
//       }
//     } catch (error) {
//       console.error('Error checking cached admin:', error);
//     }
//   }, [groupSlug]);

//   // Check cache on mount
//   useEffect(() => {
//     checkCachedAdminStatus();
//   }, []);

//   const getFullImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${API_ROUTE_IMAGE}${imagePath}`;
//   };

//   const handleMessageMember = (member) => {
//     if (member.id === currentUserId) {
//       Alert.alert('Info', 'You cannot message yourself');
//       return;
//     }

//     navigation.navigate('BPrivateChat', {
//       receiverId: member.id,
//       name: member.name,
//       profile_image: member.profile_picture,
//       chatType: 'single',
//     });
//   };

//   // ===== ADD MEMBER FUNCTIONS =====
//   const openAddMemberModal = () => {
//     setUserSearchQuery('');
//     setSearchResults([]);
//     setAddMemberModalVisible(true);
//   };

//   const searchUsers = async (query) => {
//     setUserSearchQuery(query);
    
//     if (query.length < 2) {
//       setSearchResults([]);
//       return;
//     }

//     setSearchingUsers(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(
//         `${API_ROUTE}/groups/${groupSlug}/members/search/?q=${encodeURIComponent(query)}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         setSearchResults(response.data.users);
//       }
//     } catch (error) {
//       console.error('Error searching users:', error);
//       Alert.alert('Error', 'Failed to search users');
//     } finally {
//       setSearchingUsers(false);
//     }
//   };

//   const addMemberToGroup = async (user) => {
//     setAddingUser(user.id);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(
//         `${API_ROUTE}/groups/${groupSlug}/members/add/`,
//         { user_id: user.id },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         Alert.alert('Success', `${user.name} has been added to the group!`);
//         await fetchGroupMembers();
//         setAddMemberModalVisible(false);
//         setSearchResults([]);
//         setUserSearchQuery('');
//       }
//     } catch (error) {
//       console.error('Error adding member:', error);
//       Alert.alert(
//         'Error', 
//         error.response?.data?.error || 'Failed to add member to group'
//       );
//     } finally {
//       setAddingUser(null);
//     }
//   };

//   // ===== REMOVE MEMBER FUNCTIONS =====
//   const confirmRemoveMember = (member) => {
//     if (member.id === currentUserId) {
//       Alert.alert('Error', 'You cannot remove yourself from the group');
//       return;
//     }

//     Alert.alert(
//       'Remove Member',
//       `Are you sure you want to remove ${member.name} from the group?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Remove', 
//           style: 'destructive',
//           onPress: () => removeMemberFromGroup(member)
//         }
//       ]
//     );
//   };

//   const removeMemberFromGroup = async (member) => {
//     setRemovingUser(member.id);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.delete(
//         `${API_ROUTE}/groups/${groupSlug}/members/${member.id}/remove/`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         Alert.alert('Success', `${member.name} has been removed from the group`);
//         await fetchGroupMembers();
//       }
//     } catch (error) {
//       console.error('Error removing member:', error);
//       Alert.alert(
//         'Error', 
//         error.response?.data?.error || 'Failed to remove member from group'
//       );
//     } finally {
//       setRemovingUser(null);
//     }
//   };

//   const filteredMembers = members.filter(member =>
//     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (member.username && member.username.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   // ===== RENDER MEMBER ITEM =====
//   const renderMember = ({ item }) => {
//     const isCreator = item.is_creator;
//     const isCurrentUser = item.id === currentUserId;
//     const isRemoving = removingUser === item.id;

//     // Show delete button only if:
//     // 1. User is admin
//     // 2. Not the current user
//     // 3. Not the creator (admin of group)
//     const showDeleteButton = isAdmin && !isCurrentUser && !isCreator;

//     return (
//       <View style={[styles.memberItem, { 
//         backgroundColor: colors.card,
//         shadowColor: isDark ? 'transparent' : '#000',
//       }]}>
//         <TouchableOpacity
//           style={styles.memberContent}
//           onPress={() => navigation.navigate('OtherUserProfile', { userId: item.id })}
//           activeOpacity={0.7}
//         >
//           <Image
//             source={item.profile_picture ? { uri: getFullImageUrl(item.profile_picture) } : FALLBACK_AVATAR}
//             style={[styles.memberAvatar, { backgroundColor: colors.backgroundSecondary }]}
//           />
//           <View style={styles.memberInfo}>
//             <View style={styles.memberNameContainer}>
//               <Text style={[styles.memberName, { color: colors.text }]}>
//                 {item.name}
//                 {isCurrentUser && <Text style={[styles.youTag, { color: colors.textSecondary }]}> (You)</Text>}
//               </Text>
//               {isCreator && (
//                 <View style={[styles.creatorBadge, { backgroundColor: isDark ? '#2D1B00' : '#FFF9E6' }]}>
//                   <Icon name="star" size={16} color="#FFD700" />
//                   <Text style={[styles.creatorText, { color: isDark ? '#FFD700' : '#B8860B' }]}>Admin</Text>
//                 </View>
//               )}
//             </View>
//             {item.username && (
//               <Text style={[styles.memberUsername, { color: colors.textSecondary }]}>
//                 @{item.username}
//               </Text>
//             )}
//             {item.bio && (
//               <Text style={[styles.memberBio, { color: colors.textTertiary }]} numberOfLines={2}>
//                 {item.bio}
//               </Text>
//             )}
//           </View>
//         </TouchableOpacity>

//         {/* ===== ACTION BUTTONS ===== */}
//         <View style={styles.memberActions}>
//           {/* Message Button - Show for all users (except self) */}
//           {!isCurrentUser && (
//             <TouchableOpacity
//               style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
//               onPress={() => handleMessageMember(item)}
//             >
//               <Icon name="chat" size={20} color={colors.primary} />
//             </TouchableOpacity>
//           )}

//           {/* ===== DELETE BUTTON - Only show for admin ===== */}
//           {showDeleteButton && (
//             <TouchableOpacity
//               style={[styles.actionButton, { backgroundColor: '#FF3B30' + '15' }]}
//               onPress={() => confirmRemoveMember(item)}
//               disabled={isRemoving}
//             >
//               {isRemoving ? (
//                 <ActivityIndicator size="small" color="#FF3B30" />
//               ) : (
//                 <Icon name="delete-outline" size={20} color="#FF3B30" />
//               )}
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   // ===== RENDER ADD MEMBER MODAL =====
//   const renderAddMemberModal = () => (
//     <Modal
//       visible={addMemberModalVisible}
//       transparent
//       animationType="slide"
//       onRequestClose={() => setAddMemberModalVisible(false)}
//     >
//       <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//         <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
//           <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
//             <Text style={[styles.modalTitle, { color: colors.text }]}>Add Members</Text>
//             <TouchableOpacity onPress={() => setAddMemberModalVisible(false)}>
//               <Ionicons name="close" size={24} color={colors.text} />
//             </TouchableOpacity>
//           </View>

//           <View style={[styles.searchContainer, { 
//             backgroundColor: colors.backgroundSecondary,
//             borderColor: colors.border,
//           }]}>
//             <Icon name="search" size={20} color={colors.textTertiary} />
//             <TextInput
//               style={[styles.searchInput, { color: colors.text }]}
//               placeholder="Search users by name or username..."
//               placeholderTextColor={colors.textTertiary}
//               value={userSearchQuery}
//               onChangeText={searchUsers}
//             />
//             {userSearchQuery.length > 0 && (
//               <TouchableOpacity onPress={() => searchUsers('')}>
//                 <Icon name="close" size={20} color={colors.textTertiary} />
//               </TouchableOpacity>
//             )}
//           </View>

//           {searchingUsers ? (
//             <View style={styles.searchingContainer}>
//               <ActivityIndicator size="large" color={colors.primary} />
//               <Text style={[styles.searchingText, { color: colors.textSecondary }]}>
//                 Searching...
//               </Text>
//             </View>
//           ) : (
//             <FlatList
//               data={searchResults}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <View style={[styles.searchResultItem, { borderBottomColor: colors.border }]}>
//                   <View style={styles.searchResultLeft}>
//                     <Image
//                       source={item.profile_picture ? { uri: getFullImageUrl(item.profile_picture) } : FALLBACK_AVATAR}
//                       style={[styles.searchResultAvatar, { backgroundColor: colors.backgroundSecondary }]}
//                     />
//                     <View style={styles.searchResultInfo}>
//                       <Text style={[styles.searchResultName, { color: colors.text }]}>
//                         {item.name}
//                       </Text>
//                       <Text style={[styles.searchResultUsername, { color: colors.textSecondary }]}>
//                         @{item.username}
//                       </Text>
//                     </View>
//                   </View>
                  
//                   <TouchableOpacity
//                     style={[styles.addButton, { backgroundColor: colors.primary }]}
//                     onPress={() => addMemberToGroup(item)}
//                     disabled={addingUser === item.id}
//                   >
//                     {addingUser === item.id ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <>
//                         <Icon name="add" size={20} color="#fff" />
//                         <Text style={styles.addButtonText}>Add</Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               )}
//               ListEmptyComponent={
//                 userSearchQuery.length > 0 && !searchingUsers ? (
//                   <View style={styles.emptySearchContainer}>
//                     <Icon name="people-outline" size={50} color={colors.textTertiary} />
//                     <Text style={[styles.emptySearchText, { color: colors.textSecondary }]}>
//                       No users found
//                     </Text>
//                   </View>
//                 ) : userSearchQuery.length === 0 ? (
//                   <View style={styles.emptySearchContainer}>
//                     <Icon name="search" size={50} color={colors.textTertiary} />
//                     <Text style={[styles.emptySearchText, { color: colors.textSecondary }]}>
//                       Search for users to add
//                     </Text>
//                   </View>
//                 ) : null
//               }
//               contentContainerStyle={styles.searchResultsList}
//             />
//           )}
//         </View>
//       </View>
//     </Modal>
//   );

//   const styles = createStyles(colors, isDark);

//   // ===== LOADING SCREEN =====
//   if (loading && initialLoad) {
//     return (
//       <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading members...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar
//         barStyle={Platform.OS === 'android' ? 'light-content' : 'light-content'}
//         backgroundColor={colors.primary}
//       />

//       {/* Header */}
//       <LinearGradient colors={[colors.primary, colors.primaryDark || colors.primary]} style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()} 
//             style={styles.backButton}
//             activeOpacity={0.7}
//           >
//             <Icon name="arrow-back" size={24} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerTitle}>{groupInfo?.name || groupName}</Text>
//             <Text style={styles.headerSubtitle}>
//               {members.length} {members.length === 1 ? 'member' : 'members'}
//             </Text>
//           </View>
//           {/* ===== ADD MEMBER BUTTON - Shows immediately based on isAdmin state ===== */}
//           {isAdmin && (
//             <TouchableOpacity 
//               onPress={openAddMemberModal} 
//               style={styles.addMemberHeaderButton}
//               activeOpacity={0.7}
//             >
//               <Icon name="person-add" size={28} color="#FFF" />
//             </TouchableOpacity>
//           )}
//           {!isAdmin && <View style={styles.headerRight} />}
//         </View>
//       </LinearGradient>

//       {/* Search Bar */}
//       <View style={[styles.searchContainer, { 
//         backgroundColor: colors.card,
//         borderColor: colors.border,
//       }]}>
//         <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
//         <TextInput
//           style={[styles.searchInput, { color: colors.text }]}
//           placeholder="Search members..."
//           placeholderTextColor={colors.textTertiary}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Icon name="close" size={20} color={colors.textTertiary} />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Admin Info Banner - Only show for admin */}
//       {isAdmin && (
//         <View style={[styles.adminBanner, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
//           <Icon name="admin-panel-settings" size={18} color={colors.primary} />
//           <Text style={[styles.adminBannerText, { color: colors.primary }]}>
//             Tap <Text style={styles.adminBannerHighlight}>+</Text> to add members or delete icon to remove them.
//           </Text>
//         </View>
//       )}

//       {/* Members List */}
//       <FlatList
//         data={filteredMembers}
//         renderItem={renderMember}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.membersList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="people-outline" size={60} color={colors.textTertiary} />
//             <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No members found</Text>
//           </View>
//         }
//       />

//       {/* Add Member Modal */}
//       {renderAddMemberModal()}
//     </SafeAreaView>
//   );
// };

// const createStyles = (colors, isDark) => StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//   },
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 0 : 20,
//     paddingBottom: 20,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   headerTitle: {
//     color: '#FFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   headerSubtitle: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//     marginTop: 2,
//   },
//   addMemberHeaderButton: {
//     padding: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerRight: {
//     width: 40,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 16,
//     marginVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     height: 45,
//     borderWidth: 1,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   membersList: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   memberItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 8,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   memberContent: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   memberInfo: {
//     flex: 1,
//   },
//   memberNameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginBottom: 4,
//   },
//   memberName: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 8,
//   },
//   youTag: {
//     fontSize: 14,
//     fontStyle: 'italic',
//   },
//   creatorBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 12,
//   },
//   creatorText: {
//     fontSize: 12,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   memberUsername: {
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   memberBio: {
//     fontSize: 13,
//     lineHeight: 18,
//   },
//   memberActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   actionButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // Admin Banner
//   adminBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 16,
//     marginBottom: 8,
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//   },
//   adminBannerText: {
//     fontSize: 12,
//     marginLeft: 8,
//     flex: 1,
//   },
//   adminBannerHighlight: {
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     height: '80%',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 16,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     marginBottom: 12,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   searchingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   searchingText: {
//     marginTop: 12,
//     fontSize: 16,
//   },
//   searchResultsList: {
//     paddingBottom: 20,
//   },
//   searchResultItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   searchResultLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   searchResultAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     marginRight: 12,
//   },
//   searchResultInfo: {
//     flex: 1,
//   },
//   searchResultName: {
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   searchResultUsername: {
//     fontSize: 13,
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 4,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   emptySearchContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   emptySearchText: {
//     fontSize: 16,
//     marginTop: 12,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 156,
//     marginTop: 12,
//   },
// });

// export default GroupMembersScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

const GroupMembersScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const { groupSlug, groupName } = route.params;
  const [members, setMembers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [addingUser, setAddingUser] = useState(null);
  const [removingUser, setRemovingUser] = useState(null);

  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  // ===== FETCH CURRENT USER ID =====
  const getCurrentUserId = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUserId(parsed.id);
        return parsed.id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }, []);

  // ===== FETCH GROUP MEMBERS =====
  const fetchGroupMembers = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login again');
        setLoading(false);
        return;
      }

      // Get current user ID first
      let userId = currentUserId;
      if (!userId) {
        userId = await getCurrentUserId();
        if (!userId) {
          setLoading(false);
          return;
        }
      }

      const response = await axios.get(
        `${API_ROUTE}/groups/${groupSlug}/members/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setGroupInfo(response.data.group);
        setMembers(response.data.members);
        
        // Check admin status - find the current user in members list
        const currentUser = response.data.members.find(m => m.id === userId);
        const adminStatus = currentUser?.is_creator || false;
        
        console.log('Admin status:', adminStatus, 'User ID:', userId, 'Current user:', currentUser);
        
        setIsAdmin(adminStatus);
        
        // Store admin status in AsyncStorage for faster next load
        if (adminStatus) {
          await AsyncStorage.setItem(`admin_${groupSlug}`, 'true');
        } else {
          await AsyncStorage.removeItem(`admin_${groupSlug}`);
        }
      }
    } catch (error) {
      console.error('Error fetching group members:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load group members');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [groupSlug, currentUserId, getCurrentUserId]);

  // ===== INITIAL SETUP =====
  useEffect(() => {
    const initialize = async () => {
      // Get user ID first
      const userId = await getCurrentUserId();
      if (userId) {
        // Check cached admin status
        try {
          const cached = await AsyncStorage.getItem(`admin_${groupSlug}`);
          if (cached === 'true') {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking cached admin:', error);
        }
        
        // Fetch members
        await fetchGroupMembers();
      } else {
        setLoading(false);
      }
    };
    
    initialize();
  }, []); // Empty deps - only run once

  // ===== REFRESH MEMBERS (for after add/remove) =====
  const refreshMembers = useCallback(async () => {
    await fetchGroupMembers();
  }, [fetchGroupMembers]);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ROUTE_IMAGE}${imagePath}`;
  };

  const handleMessageMember = (member) => {
    if (member.id === currentUserId) {
      Alert.alert('Info', 'You cannot message yourself');
      return;
    }

    navigation.navigate('BPrivateChat', {
      receiverId: member.id,
      name: member.name,
      profile_image: member.profile_picture,
      chatType: 'single',
    });
  };

  // ===== ADD MEMBER FUNCTIONS =====
  const openAddMemberModal = () => {
    setUserSearchQuery('');
    setSearchResults([]);
    setAddMemberModalVisible(true);
  };

  const searchUsers = async (query) => {
    setUserSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_ROUTE}/groups/${groupSlug}/members/search/?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSearchResults(response.data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setSearchingUsers(false);
    }
  };

  const addMemberToGroup = async (user) => {
    setAddingUser(user.id);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/groups/${groupSlug}/members/add/`,
        { user_id: user.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', `${user.name} has been added to the group!`);
        await refreshMembers(); // Refresh with updated admin status
        setAddMemberModalVisible(false);
        setSearchResults([]);
        setUserSearchQuery('');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.error || 'Failed to add member to group'
      );
    } finally {
      setAddingUser(null);
    }
  };

  // ===== REMOVE MEMBER FUNCTIONS =====
  const confirmRemoveMember = (member) => {
    if (member.id === currentUserId) {
      Alert.alert('Error', 'You cannot remove yourself from the group');
      return;
    }

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.name} from the group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeMemberFromGroup(member)
        }
      ]
    );
  };

  const removeMemberFromGroup = async (member) => {
    setRemovingUser(member.id);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.delete(
        `${API_ROUTE}/groups/${groupSlug}/members/${member.id}/remove/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', `${member.name} has been removed from the group`);
        await refreshMembers(); // Refresh with updated admin status
      }
    } catch (error) {
      console.error('Error removing member:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.error || 'Failed to remove member from group'
      );
    } finally {
      setRemovingUser(null);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.username && member.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ===== RENDER MEMBER ITEM =====
  const renderMember = ({ item }) => {
    const isCreator = item.is_creator;
    const isCurrentUser = item.id === currentUserId;
    const isRemoving = removingUser === item.id;

    // Show delete button only if:
    // 1. User is admin
    // 2. Not the current user
    // 3. Not the creator (admin of group) - you can remove this condition if admins can remove other admins
    const showDeleteButton = isAdmin && !isCurrentUser && !isCreator;

    return (
      <View style={[styles.memberItem, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'transparent' : '#000',
      }]}>
        <TouchableOpacity
          style={styles.memberContent}
          onPress={() => navigation.navigate('OtherUserProfile', { userId: item.id })}
          activeOpacity={0.7}
        >
          <Image
            source={item.profile_picture ? { uri: getFullImageUrl(item.profile_picture) } : FALLBACK_AVATAR}
            style={[styles.memberAvatar, { backgroundColor: colors.backgroundSecondary }]}
          />
          <View style={styles.memberInfo}>
            <View style={styles.memberNameContainer}>
              <Text style={[styles.memberName, { color: colors.text }]}>
                {item.name}
                {isCurrentUser && <Text style={[styles.youTag, { color: colors.textSecondary }]}> (You)</Text>}
              </Text>
              {isCreator && (
                <View style={[styles.creatorBadge, { backgroundColor: isDark ? '#2D1B00' : '#FFF9E6' }]}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={[styles.creatorText, { color: isDark ? '#FFD700' : '#B8860B' }]}>Admin</Text>
                </View>
              )}
            </View>
            {item.username && (
              <Text style={[styles.memberUsername, { color: colors.textSecondary }]}>
                @{item.username}
              </Text>
            )}
            {item.bio && (
              <Text style={[styles.memberBio, { color: colors.textTertiary }]} numberOfLines={2}>
                {item.bio}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* ===== ACTION BUTTONS ===== */}
        <View style={styles.memberActions}>
          {/* Message Button - Show for all users (except self) */}
          {!isCurrentUser && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => handleMessageMember(item)}
            >
              <Icon name="chat" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {/* ===== DELETE BUTTON - Only show for admin ===== */}
          {showDeleteButton && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF3B30' + '15' }]}
              onPress={() => confirmRemoveMember(item)}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color="#FF3B30" />
              ) : (
                <Icon name="delete-outline" size={20} color="#FF3B30" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // ===== RENDER ADD MEMBER MODAL =====
  const renderAddMemberModal = () => (
    <Modal
      visible={addMemberModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setAddMemberModalVisible(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Members</Text>
            <TouchableOpacity onPress={() => setAddMemberModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.searchContainer, { 
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }]}>
            <Icon name="search" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search users by name or username..."
              placeholderTextColor={colors.textTertiary}
              value={userSearchQuery}
              onChangeText={searchUsers}
            />
            {userSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => searchUsers('')}>
                <Icon name="close" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>

          {searchingUsers ? (
            <View style={styles.searchingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.searchingText, { color: colors.textSecondary }]}>
                Searching...
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.searchResultItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.searchResultLeft}>
                    <Image
                      source={item.profile_picture ? { uri: getFullImageUrl(item.profile_picture) } : FALLBACK_AVATAR}
                      style={[styles.searchResultAvatar, { backgroundColor: colors.backgroundSecondary }]}
                    />
                    <View style={styles.searchResultInfo}>
                      <Text style={[styles.searchResultName, { color: colors.text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.searchResultUsername, { color: colors.textSecondary }]}>
                        @{item.username}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={() => addMemberToGroup(item)}
                    disabled={addingUser === item.id}
                  >
                    {addingUser === item.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Icon name="add" size={20} color="#fff" />
                        <Text style={styles.addButtonText}>Add</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                userSearchQuery.length > 0 && !searchingUsers ? (
                  <View style={styles.emptySearchContainer}>
                    <Icon name="people-outline" size={50} color={colors.textTertiary} />
                    <Text style={[styles.emptySearchText, { color: colors.textSecondary }]}>
                      No users found
                    </Text>
                  </View>
                ) : userSearchQuery.length === 0 ? (
                  <View style={styles.emptySearchContainer}>
                    <Icon name="search" size={50} color={colors.textTertiary} />
                    <Text style={[styles.emptySearchText, { color: colors.textSecondary }]}>
                      Search for users to add
                    </Text>
                  </View>
                ) : null
              }
              contentContainerStyle={styles.searchResultsList}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  const styles = createStyles(colors, isDark);

  // ===== LOADING SCREEN =====
  if (loading && initialLoad) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading members...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'light-content'}
        backgroundColor={colors.primary}
      />

      {/* Header */}
      <LinearGradient colors={[colors.primary, colors.primaryDark || colors.primary]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{groupInfo?.name || groupName}</Text>
            <Text style={styles.headerSubtitle}>
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
          {/* ===== ADD MEMBER BUTTON - Shows immediately based on isAdmin state ===== */}
          {isAdmin && (
            <TouchableOpacity 
              onPress={openAddMemberModal} 
              style={styles.addMemberHeaderButton}
              activeOpacity={0.7}
            >
              <Icon name="person-add" size={28} color="#FFF" />
            </TouchableOpacity>
          )}
          {!isAdmin && <View style={styles.headerRight} />}
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { 
        backgroundColor: colors.card,
        borderColor: colors.border,
      }]}>
        <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search members..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Admin Info Banner - Only show for admin */}
      {isAdmin && (
        <View style={[styles.adminBanner, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Icon name="admin-panel-settings" size={18} color={colors.primary} />
          <Text style={[styles.adminBannerText, { color: colors.primary }]}>
            Tap <Text style={styles.adminBannerHighlight}>+</Text> to add members or delete icon to remove them.
          </Text>
        </View>
      )}

      {/* Members List */}
      <FlatList
        data={filteredMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.membersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No members found</Text>
          </View>
        }
      />

      {/* Add Member Modal */}
      {renderAddMemberModal()}
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  addMemberHeaderButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 45,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  membersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  memberContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  youTag: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  creatorText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  memberUsername: {
    fontSize: 14,
    marginBottom: 2,
  },
  memberBio: {
    fontSize: 13,
    lineHeight: 18,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Admin Banner
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  adminBannerText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  adminBannerHighlight: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingText: {
    marginTop: 12,
    fontSize: 16,
  },
  searchResultsList: {
    paddingBottom: 20,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchResultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '500',
  },
  searchResultUsername: {
    fontSize: 13,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptySearchText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});

export default GroupMembersScreen;