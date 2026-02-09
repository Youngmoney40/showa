// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   FlatList,
//   Image,
//   TextInput,
//   Modal,
//   ActivityIndicator,
//   Animated,
//   Easing,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import LottieView from 'lottie-react-native';

// export default function BroadcastScreen({ navigation }) {
//   const [userData, setUserData] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [showMessageModal, setShowMessageModal] = useState(false);
//   const [showProcessingModal, setShowProcessingModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [message, setMessage] = useState('');
//   const [image, setImage] = useState(null);

//   // Animation for success modal
//   const [successAnim] = useState(new Animated.Value(0));

//   const broadcasts = [
//     {
//       id: '1',
//       title: 'Launch Announcement',
//       description: 'Our new feature goes live today!',
//       timestamp: 'Today',
//     },
//     {
//       id: '2',
//       title: 'Weekly Update',
//       description: 'Here’s everything you need to know this week.',
//       timestamp: 'Yesterday',
//     },
//   ];

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/get-users/`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.status === 200 || response.status === 201) {
//         setUserData(response.data);
//       } else {
//         console.error('Failed to fetch users:', response.status);
//       }
//     } catch (error) {
//       console.log('Error fetching users:', error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const toggleSelectUser = (id) => {
//     if (selectedUsers.includes(id)) {
//       setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
//     } else {
//       setSelectedUsers([...selectedUsers, id]);
//     }
//   };

//   const openImagePicker = () => {
//     launchImageLibrary({}, (response) => {
//       if (response.assets && response.assets.length > 0) {
//         setImage(response.assets[0]);
//       }
//     });
//   };
// const sendBroadcastMessages = async () => {
//   setShowProcessingModal(true);
  
//   try {
//     // Get the user token
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       throw new Error('No authentication token found');
//     }

//     // Prepare the message data
//     const messageData = {
//       content: message,
//       chat_type: 'single', // Since we're sending individual messages
//       account_mode: 'business',
//     };

//     // If there's an image, prepare it for upload
//     if (image) {
//       messageData.image = {
//         uri: image.uri,
//         type: image.type,
//         name: image.fileName || 'image.jpg',
//       };
//     }

//     // Send to each selected user one by one
//     for (const userId of selectedUsers) {
//       try {
//         const formData = new FormData();
        
//         // Add all fields to formData
//         Object.keys(messageData).forEach(key => {
//           if (key === 'image') {
//             formData.append('image', messageData.image);
//           } else {
//             formData.append(key, messageData[key]);
//           }
//         });
        
//         // Add the receiver ID for this message
//         formData.append('receiver', userId);

//         // Send the message
//         const response = await axios.post(`${API_ROUTE}/api/chat/`, formData, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });

//         console.log(`Message sent to user ${userId}:`, response.data);
//       } catch (error) {
//         console.error(`Error sending to user ${userId}:`, error.message);
//         // Continue with next user even if one fails
//       }
//     }

//     // Show success and reset form
//     setShowProcessingModal(false);
//     navigation.navigate('BroadcastSuccess');
//     setSelectedUsers([]);
//     setMessage('');
//     setImage(null);
//   } catch (error) {
//     console.error('Broadcast error:', error.message);
//     setShowProcessingModal(false);
//     alert('Failed to send broadcast: ' + error.message);
//   }
// };

// const handleBroadcastNow = () => {
//   setShowMessageModal(false);
//   sendBroadcastMessages();
// };

//   // const handleBroadcastNow = () => {
//   //   setShowMessageModal(false);
//   //   setShowProcessingModal(true);

//   //   setTimeout(() => {
//   //     setShowProcessingModal(false);
//   //     // setShowSuccessModal(true);
//   //     navigation.navigate('BroadcastSuccess')
//   //     // Reset and start animation
//   //     successAnim.setValue(0);
//   //     Animated.timing(successAnim, {
//   //       toValue: 1,
//   //       duration: 400,
//   //       easing: Easing.out(Easing.ease),
//   //       useNativeDriver: true,
//   //     }).start();

//   //     setSelectedUsers([]);
//   //     setMessage('');
//   //     setImage(null);
//   //   }, 2000);
//   // };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Navbar */}
//       <View style={styles.navbar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Broadcast</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Broadcast History */}
//       <Text style={[styles.sectionTitle,{padding:0}]}> </Text>
// <Text style={{ fontSize: 14, color: '#666',paddingHorizontal:20, marginBottom: 10 }}>
//   Broadcasts let you send a message to multiple contacts at once.  
//   Recipients will get it as a private chat and won’t see each other.  
//   Perfect for announcements, updates, or promotions.
// </Text>


//       {/* Floating Button ==============================================*/}
//       <TouchableOpacity
//         style={styles.floatingButton}
//         onPress={() => setShowUserModal(true)}
//       >
//         <Text style={{ color: '#fff', fontWeight: '600' }}>Start New Broadcast</Text>
//       </TouchableOpacity>

//       {/* Select Users Modal =============================*/}
//       <Modal visible={showUserModal} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalBoxLarge}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Contacts</Text>
//               <TouchableOpacity onPress={() => setShowUserModal(false)}>
//                 <Icon name="close" size={24} color="#333" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={userData}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => {
//                 const isSelected = selectedUsers.includes(item.id);
//                 return (
//                   <TouchableOpacity
//                     style={styles.userItem}
//                     onPress={() => toggleSelectUser(item.id)}
//                   >
//                     <Image
//                       source={
//                         item.profile_picture
//                           ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.avatar}
//                     />
//                     <Text style={styles.userName}>{item.name}</Text>
//                     {isSelected && (
//                       <Icon name="checkmark-circle" size={24} color="#0d64dd" />
//                     )}
//                   </TouchableOpacity>
//                 );
//               }}
//               contentContainerStyle={{ paddingBottom: 20 }}
//             />
//             <TouchableOpacity
//               style={[
//                 styles.broadcastButton,
//                 { opacity: selectedUsers.length === 0 ? 0.5 : 1 },
//               ]}
//               onPress={() => {
//                 if (selectedUsers.length > 0) {
//                   setShowUserModal(false);
//                   setShowMessageModal(true);
//                 }
//               }}
//             >
//               <Text style={styles.broadcastButtonText}>Next</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Message Compose Modal =======================================*/}
//       <Modal visible={showMessageModal} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalBox}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Compose Broadcast</Text>
//               <TouchableOpacity onPress={() => setShowMessageModal(false)}>
//                 <Icon name="close" size={24} color="#333" />
//               </TouchableOpacity>
//             </View>
//             <TextInput
//               placeholder="Type your message"
//               style={styles.input}
//               value={message}
//               placeholderTextColor='#333'
//               onChangeText={setMessage}
//               multiline
//             />
//             <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
//               <Icon name="image" size={20} color="#0d64dd" />
//               <Text style={styles.imagePickerText}>Pick Image</Text>
//               {image && (
//                 <Image
//                   source={{ uri: image.uri }}
//                   style={{ width: 50, height: 50, borderRadius: 6, marginLeft: 10 }}
//                 />
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.broadcastButton}
//               onPress={handleBroadcastNow}
//             >
//               <Text style={styles.broadcastButtonText}>Broadcast Now</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Loading Modal */}
//       <Modal visible={showProcessingModal} transparent animationType="fade">
//         <View style={styles.centeredModalContainer}>
//           <View style={styles.smallModalBox}>
//             <ActivityIndicator size="large" color="#0d64dd" />
//             <Text style={styles.modalMessageText}>Sending broadcast...</Text>
//           </View>
//         </View>
//       </Modal>

//       {/* Animated Success Modal */}
//       <Modal visible={showSuccessModal} transparent animationType="none">
//   <View style={styles.centeredModalContainer}>
//     <Animated.View
//       style={[
//         styles.smallModalBox,
//         {
//           opacity: successAnim,
//           transform: [
//             {
//               translateY: successAnim.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [50, 0], // slide up
//               }),
//             },
//           ],
//         },
//       ]}
//     >
//       <Icon name="checkmark-circle" size={50} color="#0d64dd" />
//       <Text style={styles.modalTitle}>Success!</Text>
//       <Text style={styles.modalMessageText}>
//         Your broadcast message has been sent successfully to all selected recipients.
//       </Text>
//       <Text style={styles.modalAdditionalText}>
//         You can view the broadcast details in your sent messages. 
//         Recipients will receive notifications shortly.
//       </Text>
//       <TouchableOpacity
//       onPress={()=>{
//         setShowSuccessModal(false)
//         navigation.navigate('BusinessHome')
//       }}
//         //onPress={() => }
//         style={[styles.broadcastButton, { marginTop: 16 }]}
//       >
//         <Text style={styles.broadcastButtonText}>Got it, thanks!</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   </View>
// </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9f9f9' },
//   navbar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0d64dd',
//     height: 60,
//     paddingHorizontal: 16,
//     justifyContent: 'space-between',
//   },
//   title: { color: '#fff', fontSize: 20, fontWeight: '600' },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 16,
//     marginBottom: 8,
//     marginLeft: 16,
//     color: '#333',
//   },
//   centeredModalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   smallModalBox: {
//     width: 260,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalMessageText: {
//     marginTop: 12,
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     textAlign: 'center',
//   },
//   broadcastItem: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   broadcastTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
//   timestamp: { fontSize: 12, color: '#777' },
//   broadcastDescription: { marginTop: 4, fontSize: 14, color: '#555' },
//   emptyText: {
//     textAlign: 'center',
//     color: '#777',
//     marginTop: 20,
//     fontSize: 15,
//   },
//   floatingButton: {
//     position: 'absolute',
//     right: 20,
//     bottom: 30,
//     backgroundColor: '#0d64dd',
//     paddingHorizontal: 16,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#00000066',
//     justifyContent: 'flex-end',
//   },
//   modalBox: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopRightRadius: 20,
//     borderTopLeftRadius: 20,
//   },
//   modalBoxLarge: {
//     maxHeight: '85%',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopRightRadius: 20,
//     borderTopLeftRadius: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   modalTitle: { fontSize: 18, fontWeight: '600' },
//   input: {
//     borderColor: '#ddd',
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     height: 100,
//     color:'#333',
//     textAlignVertical: 'top',
//     marginVertical: 12,
//   },
//   imagePicker: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   imagePickerText: {
//     marginLeft: 6,
//     color: '#0d64dd',
//     fontWeight: '500',
//   },
//   broadcastButton: {
//     backgroundColor: '#0d64dd',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   broadcastButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   userItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//     backgroundColor: '#e0e0e0',
//   },
//   userName: { flex: 1, fontSize: 16, color: '#333' },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function BroadcastScreen({ navigation }) {
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [failedRecipients, setFailedRecipients] = useState([]);

  // Animation for progress
  const progressAnim = useState(new Animated.Value(0))[0];

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/get-users/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        setUserData(response.data);
      } else {
        //console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      //console.log('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const openImagePicker = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const sendBroadcastMessages = async () => {
    setShowProcessingModal(true);
    setFailedRecipients([]);
    setProgress({ current: 0, total: selectedUsers.length });
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No authentication token found');

      const messageData = {
        content: message,
        chat_type: 'single',
        account_mode: 'business',
      };

      if (image) {
        messageData.image = {
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'image.jpg',
        };
      }

      // Reset animation
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: selectedUsers.length * 500,
        useNativeDriver: false,
      }).start();

      // Send to each user
      const failures = [];
      for (let i = 0; i < selectedUsers.length; i++) {
        const userId = selectedUsers[i];
        setProgress(p => ({ ...p, current: i + 1 }));
        
        try {
          const formData = new FormData();
          Object.keys(messageData).forEach(key => {
            if (key === 'image') {
              formData.append('image', messageData.image);
            } else {
              formData.append(key, messageData[key]);
            }
          });
          formData.append('receiver', userId);

          await axios.post(`${API_ROUTE}/api/chat/`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

        } catch (error) {
          console.error(`Error sending to user ${userId}:`, error.message);
          failures.push({
            id: userId,
            name: userData.find(u => u.id === userId)?.name || 'Unknown',
            error: error.message
          });
        }
      }

      setFailedRecipients(failures);
      if (failures.length === 0) {
        navigation.navigate('BroadcastSuccess', { 
          recipientsCount: selectedUsers.length,
          hasImage: !!image 
        });
      }
    } catch (error) {
      //console.error('Broadcast error:', error.message);
      setFailedRecipients(selectedUsers.map(id => ({
        id,
        name: userData.find(u => u.id === id)?.name || 'Unknown',
        error: error.message
      })));
    } finally {
      setShowProcessingModal(false);
    }
  };

  const handleBroadcastNow = () => {
    setShowMessageModal(false);
    sendBroadcastMessages();
  };

  const getProgressPercentage = () => {
    return progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  };

  const renderRecipientItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.recipientItem,
          isSelected && styles.selectedRecipient
        ]}
        onPress={() => toggleSelectUser(item.id)}
      >
        <Image
          source={
            item.profile_picture
              ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.recipientAvatar}
        />
        <View style={styles.recipientInfo}>
          <Text style={styles.recipientName}>{item.name}</Text>
          <Text style={styles.recipientMeta}>{item.business_name || 'Business'}</Text>
        </View>
        {isSelected ? (
          <View style={styles.selectedCheck}>
            <Icon name="checkmark-circle" size={24} color="#0d64dd" />
          </View>
        ) : (
          <View style={styles.unselectedCheck} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Broadcast</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Icon name="megaphone" size={24} color="#0d64dd" />
          </View>
          <Text style={styles.introText}>
            Broadcast messages allow you to send announcements to multiple contacts at once.
            Each recipient will receive the message as a private message.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{selectedUsers.length}</Text>
            <Text style={styles.statLabel}>Selected</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userData.length}</Text>
            <Text style={styles.statLabel}>Total Contacts</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newBroadcastButton}
          onPress={() => setShowUserModal(true)}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.newBroadcastButtonText}>New Broadcast</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Select Users Modal */}
      <Modal visible={showUserModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Recipients</Text>
              <TouchableOpacity onPress={() => setShowUserModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                placeholder="Search contacts..."
                placeholderTextColor="#999"
                style={styles.searchInput}
              />
            </View>

            <FlatList
              data={userData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRecipientItem}
              contentContainerStyle={styles.recipientList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="people" size={48} color="#ddd" />
                  <Text style={styles.emptyText}>No contacts available</Text>
                </View>
              }
            />

            <View style={styles.modalFooter}>
              <Text style={styles.selectedCount}>
                {selectedUsers.length} {selectedUsers.length === 1 ? 'recipient' : 'recipients'} selected
              </Text>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  selectedUsers.length === 0 && styles.disabledButton
                ]}
                disabled={selectedUsers.length === 0}
                onPress={() => {
                  setShowUserModal(false);
                  setShowMessageModal(true);
                }}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Message Compose Modal */}
      <Modal visible={showMessageModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Compose Message</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.recipientPreview}>
              <Text style={styles.recipientPreviewText}>
                Sending to {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'}
              </Text>
            </View>

            <TextInput
              placeholder="Type your broadcast message..."
              placeholderTextColor="#999"
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              multiline
            />

            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Icon name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.attachmentButtons}>
              <TouchableOpacity 
                style={styles.attachmentButton}
                onPress={openImagePicker}
              >
                <Icon name="image" size={20} color="#0d64dd" />
                <Text style={styles.attachmentButtonText}>Add Image</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (message.trim().length === 0 && !image) && styles.disabledButton
              ]}
              disabled={message.trim().length === 0 && !image}
              onPress={handleBroadcastNow}
            >
              <Text style={styles.sendButtonText}>Send Broadcast</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Processing Modal */}
      <Modal visible={showProcessingModal} transparent animationType="fade">
        <View style={styles.processingModalContainer}>
          <View style={styles.processingModalContent}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Sending Broadcast</Text>
              <Text style={styles.progressSubtitle}>
                {progress.current} of {progress.total} sent
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>

            <Text style={styles.progressPercentage}>
              {getProgressPercentage()}%
            </Text>

            <ActivityIndicator size="large" color="#0d64dd" style={styles.progressSpinner} />

            {failedRecipients.length > 0 && (
              <View style={styles.failedContainer}>
                <Text style={styles.failedTitle}>
                  {failedRecipients.length} {failedRecipients.length === 1 ? 'message' : 'messages'} failed to send
                </Text>
                <ScrollView style={styles.failedList}>
                  {failedRecipients.map((recipient, index) => (
                    <View key={index} style={styles.failedItem}>
                      <Text style={styles.failedName}>{recipient.name}</Text>
                      <Text style={styles.failedError}>{recipient.error}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#0d64dd',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  introCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  introIcon: {
    backgroundColor: '#e6f0ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0d64dd',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  newBroadcastButton: {
    backgroundColor: '#0d64dd',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newBroadcastButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.85,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  recipientList: {
    paddingHorizontal: 16,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  selectedRecipient: {
    backgroundColor: '#f0f7ff',
  },
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  recipientMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  selectedCheck: {
    width: 24,
    height: 24,
  },
  unselectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#0d64dd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  recipientPreview: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  recipientPreviewText: {
    fontSize: 14,
    color: '#0d64dd',
    fontWeight: '500',
  },
  messageInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 8,
  },
  attachmentButtonText: {
    fontSize: 14,
    color: '#0d64dd',
    marginLeft: 8,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#0d64dd',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  processingModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: width * 0.85,
    padding: 20,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0d64dd',
  },
  progressPercentage: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#0d64dd',
    marginBottom: 16,
  },
  progressSpinner: {
    marginVertical: 16,
  },
  failedContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  failedTitle: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '500',
    marginBottom: 8,
  },
  failedList: {
    maxHeight: 150,
  },
  failedItem: {
    marginBottom: 8,
  },
  failedName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  failedError: {
    fontSize: 12,
    color: '#ff4444',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
