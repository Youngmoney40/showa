// import React, { useState, useEffect } from 'react';
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
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinearGradient from 'react-native-linear-gradient';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

// const GroupMembersScreen = ({ navigation, route }) => {
//   const { groupSlug, groupName } = route.params;
//   const [members, setMembers] = useState([]);
//   const [groupInfo, setGroupInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

//   useEffect(() => {
//     fetchGroupMembers();
//     getCurrentUser();
//   }, []);

//   const getCurrentUser = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         setCurrentUserId(parsed.id);
//       }
//     } catch (error) {
//       console.error('Error getting current user:', error);
//     }
//   };

//   const fetchGroupMembers = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(
//         `${API_ROUTE}/groups/${groupSlug}/members/`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log('Group members response:', response.data);

//       if (response.data.success) {
//         setGroupInfo(response.data.group);
//         setMembers(response.data.members);
//       }
//     } catch (error) {
//       console.error('Error fetching group members:', error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFullImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${API_ROUTE_IMAGE}${imagePath}`;
//   };

//   const filteredMembers = members.filter(member =>
//     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (member.username && member.username.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const renderMember = ({ item }) => {
//     const isCreator = item.is_creator;
//     const isCurrentUser = item.id === currentUserId;

//     return (
//       <TouchableOpacity
//         style={styles.memberItem}
//         onPress={() => navigation.navigate('OtherUserProfile', { userId: item.id })}
//         activeOpacity={0.7}
//       >
//         <Image
//           source={item.profile_picture ? { uri: getFullImageUrl(item.profile_picture) } : FALLBACK_AVATAR}
//           style={styles.memberAvatar}
//         />
//         <View style={styles.memberInfo}>
//           <View style={styles.memberNameContainer}>
//             <Text style={styles.memberName}>
//               {item.name}
//               {isCurrentUser && <Text style={styles.youTag}> (You)</Text>}
//             </Text>
//             {isCreator && (
//               <View style={styles.creatorBadge}>
//                 <Icon name="star" size={16} color="#FFD700" />
//                 <Text style={styles.creatorText}>Admin</Text>
//               </View>
//             )}
//           </View>
//           {item.username && (
//             <Text style={styles.memberUsername}>@{item.username}</Text>
//           )}
//           {item.bio && (
//             <Text style={styles.memberBio} numberOfLines={2}>
//               {item.bio}
//             </Text>
//           )}
//         </View>
//         <Icon name="chevron-right" size={24} color="#999" />
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0d64dd" />
//         <Text style={styles.loadingText}>Loading members...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar
//         barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
//         backgroundColor="#0d64dd"
//       />

//       {/* Header */}
//       <LinearGradient colors={['#0d64dd', '#0a56c4']} style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerTitle}>{groupInfo?.name || groupName}</Text>
//             <Text style={styles.headerSubtitle}>
//               {members.length} {members.length === 1 ? 'member' : 'members'}
//             </Text>
//           </View>
//           <View style={styles.headerRight} />
//         </View>
//       </LinearGradient>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search members..."
//           placeholderTextColor="#999"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Icon name="close" size={20} color="#999" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Members List ========================*/}
//       <FlatList
//         data={filteredMembers}
//         renderItem={renderMember}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.membersList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="people-outline" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>No members found</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
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
//   headerRight: {
//     width: 40,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     marginHorizontal: 16,
//     marginVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     height: 45,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   membersList: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   memberItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
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
//     color: '#333',
//     marginRight: 8,
//   },
//   youTag: {
//     fontSize: 14,
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   creatorBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF9E6',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 12,
//   },
//   creatorText: {
//     fontSize: 12,
//     color: '#B8860B',
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   memberUsername: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   memberBio: {
//     fontSize: 13,
//     color: '#888',
//     lineHeight: 18,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 12,
//   },
// });

// export default GroupMembersScreen;

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

const GroupMembersScreen = ({ navigation, route }) => {
  const { groupSlug, groupName } = route.params;
  const [members, setMembers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  useEffect(() => {
    fetchGroupMembers();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUserId(parsed.id);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(
        `${API_ROUTE}/groups/${groupSlug}/members/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Group members response:', response.data);

      if (response.data.success) {
        setGroupInfo(response.data.group);
        setMembers(response.data.members);
      }
    } catch (error) {
      console.error('Error fetching group members:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ROUTE_IMAGE}${imagePath}`;
  };

  const handleMessageMember = (member) => {
    // Don't allow messaging yourself
    if (member.id === currentUserId) {
      Alert.alert('Info', 'You cannot message yourself');
      return;
    }

    // Navigate to private chat with the member
    navigation.navigate('BPrivateChat', {
      receiverId: member.id,
      name: member.name,
      profile_image: member.profile_picture,
      chatType: 'single',
    });
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.username && member.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderMember = ({ item }) => {
    const isCreator = item.is_creator;
    const isCurrentUser = item.id === currentUserId;

    return (
      <View style={styles.memberItem}>
        <TouchableOpacity
          style={styles.memberContent}
          onPress={() => navigation.navigate('OtherUserProfile', { userId: item.id })}
          activeOpacity={0.7}
        >
          <Image
            source={item.profile_picture ? { uri: getFullImageUrl(item.profile_picture) } : FALLBACK_AVATAR}
            style={styles.memberAvatar}
          />
          <View style={styles.memberInfo}>
            <View style={styles.memberNameContainer}>
              <Text style={styles.memberName}>
                {item.name}
                {isCurrentUser && <Text style={styles.youTag}> (You)</Text>}
              </Text>
              {isCreator && (
                <View style={styles.creatorBadge}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.creatorText}>Admin</Text>
                </View>
              )}
            </View>
            {item.username && (
              <Text style={styles.memberUsername}>@{item.username}</Text>
            )}
            {item.bio && (
              <Text style={styles.memberBio} numberOfLines={2}>
                {item.bio}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Message Button - Only show for other users (not current user) */}
        {!isCurrentUser && (
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => handleMessageMember(item)}
          >
            <Icon name="chat" size={22} color="#0d64dd" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d64dd" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        backgroundColor="#0d64dd"
      />

      {/* Header */}
      <LinearGradient colors={['#0d64dd', '#0a56c4']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{groupInfo?.name || groupName}</Text>
            <Text style={styles.headerSubtitle}>
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Members List */}
      <FlatList
        data={filteredMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.membersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No members found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
  headerRight: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 45,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  membersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
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
    color: '#333',
    marginRight: 8,
  },
  youTag: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  creatorText: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 4,
    fontWeight: '500',
  },
  memberUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  memberBio: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

export default GroupMembersScreen;