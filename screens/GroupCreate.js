// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, Image, 
//   TouchableOpacity, StyleSheet, Alert, 
//   ActivityIndicator, ScrollView, FlatList
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as ImagePicker from 'react-native-image-picker';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useTheme } from '../src/context/ThemeContext';

// const GroupCreateScreen = ({ navigation, route }) => {
//   const { colors, isDark } = useTheme();
//   const { selectedUsers = [] } = route.params;
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const pickImage = () => {
//     ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
//       if (response.assets && response.assets.length > 0) {
//         setImage(response.assets[0]);
//       }
//     });
//   };

//   const handleCreateGroup = async () => {
//     if (!name || !description || !image) {
//       Alert.alert('Required', 'Please fill all fields and select an image');
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('description', description);
    
//     selectedUsers.forEach(user => {
//       formData.append('members', user.id);
//     });

//     formData.append('image', {
//       uri: image.uri,
//       name: image.fileName || 'group.jpg',
//       type: image.type || 'image/jpeg',
//     });

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_ROUTE}/groups/create/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const groupSlug = name.toLowerCase().replace(/\s+/g, '-');
      
//       Alert.alert('Success', 'Group created successfully!');
//       navigation.navigate('BusinessGroupChat', {
//         receiverId: response.data.id,
//         name: name,
//         groupSlug: groupSlug, 
//         profile_image: image.uri,
//         chatType: 'group',
//       });
//        navigation.navigate('BusinessGroupChat', {
//                           groupId: item.id,
//                           groupSlug: item.group_slug,
//                           name: name,
//                           chatType: 'group',
//                           profile_image: item.avatar,
//                           members_count: item.members_count,
//                           creator_id: item.creator_id
//                         });
    
//     } catch (err) {
//       Alert.alert('Error', err.response?.data?.message || 'Failed to create group');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderMemberItem = ({ item }) => (
//     <View style={styles.memberItem}>
//       {item.profile_picture ? (
//         <Image source={{ uri: item.profile_picture }} style={styles.memberAvatar} />
//       ) : (
//         <View style={[styles.memberAvatar, styles.avatarPlaceholder, { backgroundColor: colors.textSecondary }]}>
//           <Icon name="person" size={20} color={isDark ? colors.text : '#fff'} />
//         </View>
//       )}
//       <Text style={[styles.memberName, { color: colors.textSecondary }]}>
//         {item.name || item.username}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//       <ScrollView 
//         contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Professional Header with Back Button */}
//         <View style={[styles.header, { borderBottomColor: colors.border }]}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()} 
//             style={styles.backButton}
//             activeOpacity={0.7}
//           >
//             <Icon name="arrow-back" size={24} color={isDark ? colors.text : '#000'} />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, { color: colors.text }]}>
//             Create New Group
//           </Text>
//           <View style={styles.headerRight} />
//         </View>
        
//         {/* Selected Members Preview */}
//         <Text style={[styles.sectionTitle, { color: colors.text }]}>
//           Group Members ({selectedUsers.length})
//         </Text>
//         <FlatList
//           horizontal
//           data={selectedUsers}
//           renderItem={renderMemberItem}
//           keyExtractor={item => item.id.toString()}
//           contentContainerStyle={styles.membersList}
//           showsHorizontalScrollIndicator={false}
//         />

//         {/* Group Info Form */}
//         <Text style={[styles.sectionTitle, { color: colors.text }]}>Group Info</Text>
//         <TextInput
//           style={[styles.input, { 
//             borderColor: colors.border,
//             color: colors.text,
//             backgroundColor: colors.card
//           }]}
//           placeholder="Group Name"
//           placeholderTextColor={colors.textSecondary}
//           value={name}
//           onChangeText={setName}
//         />

//         <TextInput
//           style={[styles.input, styles.descriptionInput, { 
//             borderColor: colors.border,
//             color: colors.text,
//             backgroundColor: colors.card
//           }]}
//           placeholder="Group Description"
//           placeholderTextColor={colors.textSecondary}
//           multiline
//           value={description}
//           onChangeText={setDescription}
//         />

//         <Text style={[styles.sectionTitle, { color: colors.text }]}>Group Image</Text>
//         <TouchableOpacity 
//           onPress={pickImage} 
//           style={[styles.imagePicker, { 
//             borderColor: colors.border,
//             backgroundColor: colors.card
//           }]}
//           activeOpacity={0.7}
//         >
//           {image ? (
//             <Image source={{ uri: image.uri }} style={styles.image} />
//           ) : (
//             <View style={styles.imagePlaceholder}>
//               <Icon name="add-a-photo" size={40} color={colors.primary} />
//               <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
//                 Add Group Image
//               </Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={[styles.button, { backgroundColor: colors.primary }]}
//           onPress={handleCreateGroup}
//           disabled={loading}
//           activeOpacity={0.8}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" size="small" />
//           ) : (
//             <Text style={styles.buttonText}>Create Group</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     marginBottom: 10,
//     borderBottomWidth: 1,
//   },
//   backButton: {
//     padding: 4,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     flex: 1,
//     textAlign: 'center',
//   },
//   headerRight: {
//     width: 40,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     marginTop: 15,
//   },
//   membersList: {
//     paddingVertical: 10,
//   },
//   memberItem: {
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   memberAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginBottom: 5,
//   },
//   memberName: {
//     fontSize: 12,
//     maxWidth: 60,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   descriptionInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   imagePicker: {
//     height: 150,
//     borderWidth: 1,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 8,
//   },
//   imagePlaceholder: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imagePlaceholderText: {
//     marginTop: 10,
//     fontSize: 14,
//   },
//   button: {
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   avatarPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default GroupCreateScreen;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../src/context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const GroupCreateScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const { selectedUsers = [] } = route.params || {};
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(null);

  // Bottom sheet animation
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleCreateGroup = async () => {
  if (!name || !description || !image) {
    Alert.alert('Required', 'Please fill all fields and select an image');
    return;
  }

  setLoading(true);
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);

  selectedUsers.forEach(user => {
    formData.append('members', user.id);
  });

  formData.append('image', {
    uri: image.uri,
    name: image.fileName || 'group.jpg',
    type: image.type || 'image/jpeg',
  });

  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${API_ROUTE}/groups/create/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    // Get current user ID
    const userData = await AsyncStorage.getItem('userData');
    const currentUser = userData ? JSON.parse(userData) : null;
    
    const groupSlug = name.toLowerCase().replace(/\s+/g, '-');

    setCreatedGroup({
      id: response.data.id,
      name: name,
      groupSlug: groupSlug,
      description: description,
      membersCount: selectedUsers.length + 1, // +1 for the creator
      image: image.uri,
      createdAt: new Date().toLocaleString(),
      members: selectedUsers,
      inviteLink: `https://showapp.ng/group/${groupSlug}`,
      creator_id: currentUser?.id || 0, // Add creator_id
    });

    // Show bottom sheet with animation
    setShowSuccessModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();

  } catch (err) {
    Alert.alert('Error', err.response?.data?.message || 'Failed to create group');
  } finally {
    setLoading(false);
  }
};

  // const handleCreateGroup = async () => {
  //   if (!name || !description || !image) {
  //     Alert.alert('Required', 'Please fill all fields and select an image');
  //     return;
  //   }

  //   setLoading(true);
  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('description', description);

  //   selectedUsers.forEach(user => {
  //     formData.append('members', user.id);
  //   });

  //   formData.append('image', {
  //     uri: image.uri,
  //     name: image.fileName || 'group.jpg',
  //     type: image.type || 'image/jpeg',
  //   });

  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     const response = await axios.post(`${API_ROUTE}/groups/create/`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const groupSlug = name.toLowerCase().replace(/\s+/g, '-');

  //     setCreatedGroup({
  //       id: response.data.id,
  //       name: name,
  //       groupSlug: groupSlug,
  //       description: description,
  //       membersCount: selectedUsers.length,
  //       image: image.uri,
  //       createdAt: new Date().toLocaleString(),
  //       members: selectedUsers,
  //       inviteLink: `https://showapp.ng/group/${groupSlug}`,
  //     });

  //     // Show bottom sheet with animation
  //     setShowSuccessModal(true);
  //     Animated.spring(slideAnim, {
  //       toValue: 0,
  //       useNativeDriver: true,
  //       tension: 65,
  //       friction: 11,
  //     }).start();

  //   } catch (err) {
  //     Alert.alert('Error', err.response?.data?.message || 'Failed to create group');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const closeBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: BOTTOM_SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessModal(false);
    });
  };

  const handleNavigateToGroup = () => {
  closeBottomSheet();
  setTimeout(() => {
    // Navigate exactly like BusinessHomeScreen does
    navigation.navigate('BusinessGroupChat', {
      groupId: createdGroup?.id,
      groupSlug: createdGroup?.groupSlug,
      name: createdGroup?.name,
      chatType: 'group',
      profile_image: createdGroup?.image,
      members_count: createdGroup?.membersCount,
      creator_id: createdGroup?.creator_id || 0,
    });
  }, 350);
};

 
  const copyInviteLink = () => {
    if (createdGroup?.inviteLink) {
      Linking.openURL(createdGroup.inviteLink);
      Alert.alert('Success', 'Invite link copied to clipboard!');
    }
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      {item.profile_picture ? (
        <Image source={{ uri: item.profile_picture }} style={styles.memberAvatar} />
      ) : (
        <View style={[styles.memberAvatar, styles.avatarPlaceholder, { backgroundColor: colors.textSecondary }]}>
          <Icon name="person" size={20} color={isDark ? colors.text : '#fff'} />
        </View>
      )}
      <Text style={[styles.memberName, { color: colors.textSecondary }]}>
        {item.name || item.username}
      </Text>
    </View>
  );

  // Bottom Sheet Component
  const SuccessBottomSheet = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="none"
      onRequestClose={closeBottomSheet}
    >
      <TouchableWithoutFeedback onPress={closeBottomSheet}>
        <View style={styles.bottomSheetOverlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.bottomSheetContainer,
          {
            backgroundColor: colors.background,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandleContainer}>
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
        </View>

        <ScrollView
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Success Header */}
          <View style={styles.successHeader}>
            <View style={[styles.successIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="check-circle" size={60} color={colors.primary} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Group Created Successfully!
            </Text>
            <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
              Your group is ready. Connect with your members now!
            </Text>
          </View>

          

          {/* Quick Connect Section */}
          <View style={[styles.connectSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.connectTitle, { color: colors.text }]}>
              Quick Connect
            </Text>
            <Text style={[styles.connectSubtitle, { color: colors.textSecondary }]}>
              Here's how to get started with your new group:
            </Text>

            <View style={styles.connectSteps}>
              

              <View style={styles.connectStep}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.stepNumberText, { color: colors.primary }]}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>
                    Start Chatting
                  </Text>
                  <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                    Send your first message and get the conversation going
                  </Text>
                </View>
              </View>

              <View style={styles.connectStep}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.stepNumberText, { color: colors.primary }]}>2</Text>
                </View>
                <View style={styles.stepContent}>
  <Text style={[styles.stepTitle, { color: colors.text }]}>
    Group Admin Chat Guide
  </Text>
  <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
    As the group admin, you can:
    • Send messages to all members
    • Delete inappropriate messages
    • Remove Users from the group
    • Manage group members and settings
    Tap the group name to access admin controls
  </Text>
</View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
             // onPress={handleNavigateToGroup}
               onPress={() => {
                closeBottomSheet();
                setTimeout(() => navigation.navigate('BusinessHome'), 350);
              }}
              activeOpacity={0.8}
            >
              <Icon name="chat" size={22} color="#fff" />
              <Text style={styles.primaryButtonText}>Connect Now</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={() => {
                closeBottomSheet();
                setTimeout(() => navigation.navigate('BusinessHome'), 350);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                Later
              </Text>
            </TouchableOpacity> */}
          </View>

          {/* Bottom Spacer */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={isDark ? colors.text : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Create New Group
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Selected Members Preview */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Group Members ({selectedUsers.length})
        </Text>
        <FlatList
          horizontal
          data={selectedUsers}
          renderItem={renderMemberItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.membersList}
          showsHorizontalScrollIndicator={false}
        />

        {/* Group Info Form */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Group Info</Text>
        <TextInput
          style={[styles.input, {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.card,
          }]}
          placeholder="Group Name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, styles.descriptionInput, {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.card,
          }]}
          placeholder="Group Description"
          placeholderTextColor={colors.textSecondary}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Group Image</Text>
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.imagePicker, {
            borderColor: colors.border,
            backgroundColor: colors.card,
          }]}
          activeOpacity={0.7}
        >
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="add-a-photo" size={40} color={colors.primary} />
              <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                Add Group Image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCreateGroup}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Create Group</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Success Bottom Sheet */}
      <SuccessBottomSheet />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  membersList: {
    paddingVertical: 10,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 12,
    maxWidth: 60,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 14,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom Sheet Styles
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailsCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  groupHeaderInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  groupSlugContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupSlug: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  connectSection: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  connectTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  connectSubtitle: {
    fontSize: 13,
    marginBottom: 14,
  },
  connectSteps: {
    gap: 14,
  },
  connectStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  inviteLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  inviteLinkText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default GroupCreateScreen;