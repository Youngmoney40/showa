// import React, { useState, useEffect, Profiler, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   Modal,
//   Animated,
//   RefreshControl,
//   StatusBar,
//   Alert,
//   ActivityIndicator,
//   PermissionsAndroid,
//   Platform,
//   Linking,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import BottomNav from '../components/BottomNav';
// import { Divider } from 'react-native-paper';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import { syncContacts } from '../components/SyncContact';
// import LottieView from 'lottie-react-native';
// import colors from '../theme/colors';
// import SwitchAccountSheet from '../components/SwitchAccountSheet';
// import IncomingCallModal from '../components/IncomingCallModal';
// import PushNotification from 'react-native-push-notification';
// import NotificationService  from '../src/services/PushNotifications';



// const HomeScreen = ({ navigation }) => {
//   const [tab, setTab] = useState('Chats');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [userData, setUserData] = useState([]);
//   const [chatList, setChatList] = useState([]);
//   const [showStartChatModal, setShowStartChatModal] = useState(false);
//   const [hasDismissedModal, setHasDismissedModal] = useState(false);
//   const [showAccountModal, setShowAccountModal] = useState(false);
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [accountMode, setAccountMode] = useState('personal'); 
//   const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
//   const [pendingSwitchTo, setPendingSwitchTo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//    const [filteredChatList, setFilteredChatList] = useState([]); 
//   const [searchQuery, setSearchQuery] = useState(''); 
//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [media, setMedia] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [showMediaModal, setShowMediaModal] = useState(false);
//   const [hasCompletedSync, setHasCompletedSync] = useState(false);

//   const [isSyncing, setIsSyncing] = useState(false);
//   const [syncComplete, setSyncComplete] = useState(false);
//   const [readChats, setReadChats] = useState(new Set());


//   const [notificationSettings, setNotificationSettings] = useState({
//     showNotifications: true,
//     doNotDisturb: false,
//   });
  
//   useEffect(() => {
//     loadNotificationSettings();
//   }, []);
  
//   const loadNotificationSettings = async () => {
//     try {
//       const settings = await AsyncStorage.getItem('notificationSettings');
//       if (settings) {
//         setNotificationSettings(JSON.parse(settings));
//       }
//     } catch (error) {
//       console.log('Error loading notification settings:', error);
//     }
//   };
  

// /// =========== HANDLE INCOMING CALL ============================================
// const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
//   const [callerInfo, setCallerInfo] = useState({ 
//     profileImage: '', 
//     name: 'Caller', // no caller name  display caller
//     offer: null // Store the WebRTC offer
//   });

//    const ws = useRef(null); 


// useEffect(() => {
//   const connectCallWebSocket = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const retrieveUserId = await AsyncStorage.getItem('userData');
//       const userData = JSON.parse(retrieveUserId);
//       const currentUserId = userData.id;
//       const ROOM_ID = `user-${currentUserId}`;
//       const SIGNALING_SERVER = 'ws://showa.essential.com.ng';
      
//       const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;
//       ws.current = new WebSocket(url);

//       ws.current.onopen = () => {
//         //console.log('[HomeScreen WebSocket] Connected for incoming calls');
//       };

//       ws.current.onmessage = async (evt) => {
//         let data;
//         try {
//           data = JSON.parse(evt.data);
//           console.log('caller__data__2',data)
//         } catch (e) {
//          // console.error('[WebSocket] Invalid message format:', e);
//           return;
//         }

//         if (data.type === 'offer') {
//          // console.log('[Signaling] Incoming call offer received');
          
//           // Check if this offer is intended for the current user
//           if (data.offer.targetUserId && data.offer.targetUserId !== currentUserId) {
//            // console.log('[Signaling] Call not intended for this user, ignoring');
//             return;
//           }
          
//           const callerData = data.offer.callerInfo || {
//             profileImage: data.offer.profileImage || '',
//             name: data.offer.callerName || ' Caller'
//           };

//           console.log('caller__data',callerData)
          
//           setCallerInfo({
//             profileImage: callerData.profileImage,
//             name: callerData.name,
//             offer: data.offer // Make sure to store the entire offer
//           });
//           setShowIncomingCallModal(true); // This should trigger the modal
//         }
//       };

//       ws.current.onclose = () => {
//         //console.log('[WebSocket] Disconnected');
//       };

//       ws.current.onerror = (err) => {
//         //console.error('[WebSocket] Error:', err);
//       };
//     } catch (error) {
//       //console.error('Failed to connect to WebSocket:', error);
//     }
//   };

//   connectCallWebSocket();

//   return () => {
//     if (ws.current) {
//       ws.current.close();
//     }
//   };
// }, []);

//   // Send message via WebSocket
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       //console.log('[Signaling] Sending message:', msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

  
//   const handleAcceptCall = () => {
//   // Send acceptance message if needed
//   // sendMessage({ type: 'answer', answer: 'accepted' });
  
//   // Navigate to VoiceCallScreen with the offer data
//   navigation.navigate('VoiceCalls', {
//     profile_image: callerInfo.profileImage,
//     name: callerInfo.name,
//     incomingOffer: callerInfo.offer, // Pass the complete offer object
//     isIncomingCall: true,
//     isInitiator: false // Important: mark as not initiator
//   });
  
//   setShowIncomingCallModal(false);
// };

//   const handleRejectCall = () => {
//   sendMessage({ type: 'call-ended' });
//   setShowIncomingCallModal(false);
//   setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
// };


//   const handleSyncContacts = async () => {
//   setIsSyncing(true);
//   const authToken = await AsyncStorage.getItem('userToken');
  
//   if (!authToken) {
//     Alert.alert('Error', 'Please login first.');
//     setIsSyncing(false);
//     return;
//   }

//   try {
//     const result = await syncContacts(authToken);
//    // console.log('Contact sync successful:', result.data);

//     if (result.success) {
//       const message =
//         result.syncedContacts > 0
//           ? `${result.syncedContacts} of your contacts are now connected and ready to chat.`
//           : 'No matching contacts were found. Invite your friends to join the app!';

//       setSyncComplete(true);
//       setHasCompletedSync(true);
//       await AsyncStorage.setItem('hasCompletedSync', 'true'); 
      
//       setTimeout(() => {
//         setModalVisible(false);
//         navigation.navigate('UserContactListPersonalAccount');
//       }, 2000);
//     } else {
//       Alert.alert('Error', result.error || 'Failed to sync contacts.');
//     }
//   } catch (error) {
//     //console.log('Sync error:', error.message);
//     Alert.alert('Error', 'An error occurred while syncing your contacts.');
//   } finally {
//     setIsSyncing(false);
//   }
// };

// useEffect(() => {
//   const checkSyncStatus = async () => {
//     const syncStatus = await AsyncStorage.getItem('hasCompletedSync');
//     setHasCompletedSync(syncStatus === 'true');
//   };
//   checkSyncStatus();
// }, []);


// const handleCameraLaunch = async () => {
//   try {
//     // Check and request camera permission for Android
//     if (Platform.OS === 'android') {
//       const cameraPermission = await PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.CAMERA
//       );
      
//       if (!cameraPermission) {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs access to your camera',
//             buttonPositive: 'OK',
//             buttonNegative: 'Cancel',
//           }
//         );
        
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert(
//             'Permission Required',
//             'Camera permission is required to take photos',
//             [
//               {
//                 text: 'Cancel',
//                 style: 'cancel',
//               },
//               {
//                 text: 'Open Settings',
//                 onPress: () => Linking.openSettings(),
//               },
//             ]
//           );
//           return;
//         }
//       }
//     }

//     // Launch camera after permission is granted
//     const response = await launchCamera({
//       mediaType: 'mixed', 
//       quality: 0.7,
//       includeBase64: false,
//       saveToPhotos: true,
//       cameraType: 'back',
//     });

//     if (response.didCancel) {
//       //console.log('User cancelled camera');
//     } else if (response.errorCode) {
//       //console.log('Camera Error:', response.errorMessage);
//       Alert.alert('Error', response.errorMessage || 'Failed to access camera');
//     } else if (response.assets?.[0]) {
//       const mediaData = {
//         uri: response.assets[0].uri,
//         type: response.assets[0].type || 'image/jpeg',
//         fileName: response.assets[0].fileName || `photo_${Date.now()}.jpg`,
//       };
//       setMedia(mediaData);
//       setShowMediaModal(true);
//     }
//   } catch (error) {
//     //console.error('Camera launch error:', error);
//     Alert.alert('Error', 'Failed to launch camera');
//   }
// };

// useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredChatList(chatList);
//     } else {
//       const filtered = chatList.filter(chat => 
//         chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredChatList(filtered);
//     }
//   }, [searchQuery, chatList]);

//   useEffect(() => {
//     const loadMode = async () => {
//       const mode = await AsyncStorage.getItem('accountMode') || 'personal';
//       setAccountMode(mode);
//     };
//     loadMode();
//   }, []);

  
// const fetchUserData = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.get(`${API_ROUTE}/get-users/`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });
    
//     if (response.status === 200 || response.status === 201) {
//       // Removing duplicate users based on ID
//       const uniqueUsers = response.data.filter(
//         (user, index, self) => index === self.findIndex((u) => u.id === user.id)
//       );
//       setUserData(uniqueUsers);
//     } else {
//       //console.error('Failed to fetch users:', response.status);
//     }
//   } catch (error) {
//     //console.log('Error fetching users:', error.message);
//   }
// };

// const fetchChatList = async () => {
//   setIsLoading(true);
//   setError(null);
//    setIsInitialLoading(true);
//   const token = await AsyncStorage.getItem('userToken');
//   try {
//     const response = await axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
      
//     });

    
//    // console.log('fetch chat message ing ',response.data);

//     // Filter out only channels, keep personal chats and group chats
//     const filteredChats = response.data.chats.filter(chat => 
//       chat.type !== 'channel' // Only exclude channels
//     );

//     // Remove duplicate chats
//     const uniqueChats = [];
//     const seenIds = new Set();
    
//     filteredChats.forEach((chat) => {
//       // For personal chats, use the other participant's ID
//       // For group chats, use the group_slug as identifier
//       const chatIdentifier = chat.type === 'single' 
//         ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//         : chat.group_slug || chat.id;
      
//       if (!seenIds.has(chatIdentifier)) {
//         seenIds.add(chatIdentifier);
//         uniqueChats.push({
//           ...chat,
//           id: chatIdentifier
//         });
//       }
//     });

//     const chats = uniqueChats.map((chat) => ({
//       id: chat.id,
//       unread_count: chat.unread_count || 0,
//       name: chat.name || 'Unknown',
//       content: chat.content || '[media]',
//       time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       avatar: chat.avatar || null,
//       type: chat.type, 
//       receiverId: chat.type === 'single' ? chat.id : null,
//       group_slug: chat.group_slug || null,
//       key: `${chat.id}-${chat.type}`,
//     }));

//     setChatList(chats);
//     setFilteredChatList(chats);

   
//     //console.log('Chats (excluding channels):', chats);
//   } catch (err) {
//     //console.error('Failed to load chat list:', err.response?.data || err.message);
//     //setError('Failed to load chats. Please try again.');
//   } finally {
//     setIsLoading(false);
//      setIsInitialLoading(false);
//   }
// };


// useEffect(() => {
//   const interval = setInterval(() => {
//     fetchChatListSilently();
//   }, 30000); // Refresh every 30 seconds

//   return () => clearInterval(interval);
// }, []);

// // const fetchChatListSilently = async () => {
// //   try {
// //     const token = await AsyncStorage.getItem('userToken');
// //     if (!token) return;

// //     const response = await axios.get(
// //       `${API_ROUTE}/api/chat/list/?account_mode=${accountMode}`,
// //       {
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //         },
// //       }
// //     );

// //     const filteredChats = response.data.chats.filter(chat => 
// //       chat.type !== 'channel'
// //     );

// //     const uniqueChats = [];
// //     const seenIds = new Set();
// //     filteredChats.forEach((chat) => {
// //       const chatIdentifier = chat.type === 'single' 
// //         ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
// //         : chat.group_slug || chat.id;
      
// //       if (!seenIds.has(chatIdentifier)) {
// //         seenIds.add(chatIdentifier);
// //         uniqueChats.push({
// //           ...chat,
// //           id: chatIdentifier,
// //           unread_count: chat.unread_count || 0,
// //           name: chat.name || 'Unknown',
// //           content: chat.content || '[media]',
// //           time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //           avatar: chat.avatar || null,
// //           type: chat.type,
// //           receiverId: chat.type === 'single' ? chatIdentifier : null,
// //           group_slug: chat.group_slug || null
// //         });

    

// //       }
// //     });

// //     // Update state silently if there are changes
// //     setChatList(prevChats => {
// //       if (JSON.stringify(prevChats) !== JSON.stringify(uniqueChats)) {
// //         return uniqueChats;
// //       }
// //       return prevChats;
// //     });

// //     setFilteredChatList(prevFiltered => {
// //       if (searchQuery.trim() === '') {
// //         return uniqueChats;
// //       }
// //       return prevFiltered;
// //     });

// //   } catch (err) {
    
// //   }
// // };

// const fetchChatListSilently = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     const response = await axios.get(
//       `${API_ROUTE}/api/chat/list/?account_mode=${accountMode}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     );

//     // Process the response
//     const filteredChats = response.data.chats.filter(chat => 
//       chat.type !== 'channel'
//     );

//     const uniqueChats = [];
//     const seenIds = new Set();
    
//     filteredChats.forEach((chat) => {
//       const chatIdentifier = chat.type === 'single' 
//         ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//         : chat.group_slug || chat.id;
      
//       if (!seenIds.has(chatIdentifier)) {
//         seenIds.add(chatIdentifier);
//         uniqueChats.push({
//           ...chat,
//           id: chatIdentifier,
//           unread_count: chat.unread_count || 0,
//           name: chat.name || 'Unknown',
//           content: chat.content || '[media]',
//           time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//           type: chat.type,
//           members_count: chat.members_count,
//           receiverId: chat.type === 'single' ? chatIdentifier : null,
//           group_slug: chat.group_slug || null
//         });
//       }
//     });

//     // Check for new messages and show notifications
//     checkForNewMessages(uniqueChats);

//     // Update state silently if there are changes
//     setChatList(prevChats => {
//       if (JSON.stringify(prevChats) !== JSON.stringify(uniqueChats)) {
//         return uniqueChats;
//       }
//       return prevChats;
//     });

//     setFilteredChatList(prevFiltered => {
//       if (searchQuery.trim() === '') {
//         return uniqueChats;
//       }
//       return prevFiltered;
//     });

//   } catch (err) {
//     console.error('Silent refresh error:', err);
//   }
// };

// const checkForNewMessages = (newChats) => {
//   if (!notificationSettings.showNotifications || notificationSettings.doNotDisturb) {
//     return;
//   }

//   newChats.forEach(chat => {
//     // Check if this chat has unread messages and we haven't notified about them yet
//     if (chat.unread_count > 0) {
//       const notificationKey = `notified_${chat.id}_${chat.unread_count}`;
      
//       // Check if we've already notified about these messages
//       AsyncStorage.getItem(notificationKey).then(alreadyNotified => {
//         if (!alreadyNotified) {
//           // Show notification
//           NotificationService.localNotification(
//             chat.name,
//             chat.content || 'New message',
//             {
//               chatId: chat.id,
//               chatType: chat.type,
//               name: chat.name,
//             }
//           );
          
//           // Mark as notified
//           AsyncStorage.setItem(notificationKey, 'true');
//         }
//       });
//     }
//   });
// };


// const markMessagesAsRead = async (chatId, chatType) => {
//   console.log('Marking as read - chatId:', chatId, 'chatType:', chatType);

//   // Add to read chats set
//   setReadChats(prev => new Set(prev).add(`${chatId}-${chatType}`));

//   // Optimistic update
//   setChatList(prevChats => 
//     prevChats.map(chat => 
//       chat.id === chatId && chat.type === chatType ? { ...chat, unread_count: 0 } : chat
//     )
//   );

//   setFilteredChatList(prevFiltered => 
//     prevFiltered.map(chat => 
//       chat.id === chatId && chat.type === chatType ? { ...chat, unread_count: 0 } : chat
//     )
//   );

//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const res = await axios.post(
//       `${API_ROUTE}/chatmessage/mark-read/`,
//       {
//         chat_id: chatId,
//         chat_type: chatType,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (res.status !== 200 && res.status !== 201) {
//       throw new Error('API call failed');
//     }
//   } catch (error) {
//     //console.error('Error marking messages as read:', error);
//     // Revert on error
//     setReadChats(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(`${chatId}-${chatType}`);
//       return newSet;
//     });
//   }
// };

// useFocusEffect(
//   useCallback(() => {
//     let isMounted = true;

//     const loadData = async () => {
//       try {
//         await fetchChatList(); // Fetch fresh data
//         await fetchUserData();
//       } catch (error) {
//         console.error('Focus effect error:', error);
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//     };
//   }, []) // Empty dependency array ensures this runs every time the screen is focused
// );


// useEffect(() => {
//   const checkAndShowModal = async () => {
//     if (!isInitialLoading && chatList.length === 0 && !hasDismissedModal && !hasCompletedSync) {
//       fetchUserData();
//       setShowStartChatModal(true);
//     }
//   };
//   checkAndShowModal();
// }, [chatList, isInitialLoading, hasDismissedModal, hasCompletedSync]);


// const handleSkip = () => {
//   setHasCompletedSync(true);
//   AsyncStorage.setItem('hasCompletedSync', 'true');
//   navigation.goBack();
// };

//   useEffect(() => {
//     if (showAccountModal) {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [showAccountModal]);



// const fetchProfile = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.get(`${API_ROUTE}/profiles/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.status === 200 || response.status === 201) {
//       const profile = response.data;
//       //console.log('Fetched profile:', profile);
//       return profile;
//     } else {
//       //console.warn('Failed to fetch profile');
//       return null;
//     }
//   } catch (err) {
//    // console.error('fetchProfile error:', err);
//     return null;
//   }
// };

// const switchAccount = async (account) => {
//   setIsLoading(true);
//   try {
//     await AsyncStorage.setItem('accountMode', account);
//     setAccountMode(account);

//     if (account === 'personal') {
//       fetchChatList();
//     } else {
//       const profile = await fetchProfile();

//       // Check if the profile has a name
//       if (profile && profile.name && profile.name.trim() !== '') {
//         navigation.navigate('BusinessHome');
//       } else {
//         navigation.navigate('BusinessSetup');
//         //console.log('user profile details set up to date', profile)
//       }
//     }
//   } finally {
//     setIsLoading(false);
//   }
// };


// const handlePostStatus = async (media, caption) => {
//   if (!media) {
//     Alert.alert('Error', 'No media selected');
//     return;
//   }

//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const formData = new FormData();
    
//     // Determine file extension
//     let fileExt = media.uri.split('.').pop().toLowerCase();
//     let type = media.type;
    
//     if (!type) {
//       if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
//         type = 'image/jpeg';
//       } else if (['mp4', 'mov'].includes(fileExt)) {
//         type = 'video/mp4';
//       }
//     }

//     formData.append('media', {
//       uri: media.uri,
//       type: type,
//       name: `status_${Date.now()}.${fileExt}`,
//     });

//     if (caption) {
//       formData.append('text', caption);
//     }

//     const response = await axios.post(`${API_ROUTE}/status/`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     Alert.alert('Success', 'Status posted successfully!');
//     return response.data; // Return the created status data
//   } catch (error) {
//     console.error('Post error:', error);
//     Alert.alert('Error', 'Failed to post status');
//     throw error;
//   }
// };
// const postStatus = async () => {
//   try {
//     const result = await handlePostStatus(image, caption);
//     if (result) {
//       // Refresh status list after successful post
//       fetchStatus();
//       setAddStatusModalVisible(false);
//       setImage(null);
//       setCaption('');
//     }
//   } catch (error) {
//     //console.log('Error posting status:', error);
//   }
// };

// const highlightSearchText = (text = '', query) => {
//   if (!query || !text || typeof text !== 'string') return text;
  
//   const index = text.toLowerCase().indexOf(query.toLowerCase());
//   if (index === -1) return text;

//   return (
//     <Text>
//       {text.substring(0, index)}
//       <Text style={{ backgroundColor: '#FFEB3B', color: '#000' }}>
//         {text.substring(index, index + query.length)}
//       </Text>
//       {text.substring(index + query.length)}
//     </Text>
//   );
// };

// // if (isInitialLoading) {
// //   return (
// //     <View style={styles.fullScreenLoading}>
// //       <ActivityIndicator size="large" color="#0d64dd" />
// //     </View>
// //   );
// // }


//   return (
//     <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="light-content" backgroundColor="#0750b5" />
     
//         {/* Header with Gradient ==============================*/}
//         <LinearGradient
//           colors={['#0d64dd', '#0d64dd', '#0d64dd']}
//           style={styles.header}
//         >
//           <View style={styles.headerTop}>
//             <Text style={styles.headerTitle}>Showa</Text>
//             <View style={styles.headerIcons}>

//               {/*======= Explore Icon with Badge */}
//             <TouchableOpacity onPress={() => navigation.navigate('EssentialPlatforms')} style={styles.exploreIconContainer}>
//               <Icon name="compass-outline" size={27} color="#fff" style={{marginRight: 25}} />
//               {/* Explore Badge =================*/}
//               <View style={styles.exploreBadge}>
//                 <Text style={styles.exploreBadgeText}>Explore</Text>
//               </View>
//             </TouchableOpacity>

//              <TouchableOpacity onPress={handleCameraLaunch}>
//                 <Icon name="camera-outline" size={25} color="#fff" style={{marginRight: 20}} />
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
//                 <Icon name="ellipsis-vertical" size={22} color="#fff" />
//               </TouchableOpacity>
//               {showDropdown && (
//                 <View style={styles.dropdownMenu}>
//                   <Text style={styles.dropdownItem}>Mode: Personal Account</Text>
//                   <Divider/>
                  
//                   <TouchableOpacity
//                     onPress={() => {
//                       setShowDropdown(false);
//                       navigation.navigate('Settings');
//                     }}
//                   >
//                     <Text style={styles.dropdownItem}>Profile</Text>
//                   </TouchableOpacity>
                 
//                    {/* <TouchableOpacity
//                     onPress={() => {
//                       setShowDropdown(false);
//                       navigation.navigate('SynMessage');
//                     }}
//                   >
//                     <Text style={styles.dropdownItem}>Link account</Text>
//                   </TouchableOpacity>  */}
//                   <TouchableOpacity
//                     onPress={() => {
//                       setShowDropdown(false);
//                       navigation.navigate('GoLive');
//                     }}
//                   >
//                     <Text style={styles.dropdownItem}>Go Live</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setShowDropdown(false);
//                       navigation.navigate('GlobalIssueReport');
//                     }}
//                   >
//                     <Text style={styles.dropdownItem}>Global Report</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setShowDropdown(false);
//                       navigation.navigate('NewsList');
//                     }}
//                   >
//                     <Text style={styles.dropdownItem}>Latest News</Text>
//                   </TouchableOpacity>
//                   {/* <TouchableOpacity
//                     onPress={() => {
//                       setShowDropdown(false);
//                       navigation.navigate('SynMessage');
//                     }}
//                   >
//                     <Text style={styles.dropdownItem}>Link account</Text>
//                   </TouchableOpacity> */}
//                   <TouchableOpacity
//                     onPress={() => {
//                       setShowDropdown(false);
//                       navigation.navigate('Settings');
//                     }}
//                   >
//                     <Text style={styles.dropdownItem}>Settings</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.modalBudtton}
//                     onPress={() => {
//                       setShowDropdown(false);
//                       setPendingSwitchTo('business');
//                       setShowConfirmSwitch(true);
//                     }}
//                   >
//                     <Text style={[styles.modalButtonText, {color:'#333', marginBottom:15,marginLeft:5, marginTop:10}]}>Switch Account</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>

          
          
//                 <SwitchAccountSheet
//                   showConfirmSwitch={showConfirmSwitch}
//                   setShowConfirmSwitch={setShowConfirmSwitch}
//                   pendingSwitchTo={pendingSwitchTo}
//                   switchAccount={switchAccount}
//                   isLoading={isLoading}
//                   setIsLoading={setIsLoading}
//                 />
              

//           <View style={styles.tabRow}>
//             {['Chats', 'Status', 'Calls'].map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 onPress={() => {
//                   if (item === 'Status') {
//                     navigation.navigate('StatusBar');
//                   } else if (item === 'Calls') {
//                     navigation.navigate('BCalls');
//                   } else {
//                     setTab(item);
//                   }
//                 }}
//               >
//                 <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
//                 {tab === item && <View style={styles.tabUnderline} />}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </LinearGradient>

//        <View style={styles.searchBox}>
//           <Icon name="search" size={20} color="#666" style={{ marginRight: 12 }} />
//           <TextInput
//             placeholder="Search or start new chat"
//             style={styles.searchInput}
//             placeholderTextColor="#888"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             clearButtonMode="while-editing"
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Icon name="close-circle" size={20} color="#666" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={styles.sectionTabs}>
//           <Text style={[styles.sectionTab, { fontWeight: '600', color: '#0d64dd' }]}>
//             {searchQuery ? 'SEARCH RESULTS' : 'ALL CHATS'}
//           </Text>
//           {!searchQuery && <Text style={styles.sectionTab}>ARCHIVE</Text>}
//         </View>


// <FlatList

//   data={filteredChatList}
//   keyExtractor={(item) => `${item.id}-${item.type}-${item.unread_count}`} 
//   extraData={chatList}
//   renderItem={({ item }) => (
//     <TouchableOpacity
//       onPress={() => {
//       console.log('Chat item pressed - ID:', item.id, 'Unread:', item.unread_count);
//         markMessagesAsRead(item.id, item.type);
        
//         if (item.type === 'group') {
//           navigation.navigate('PrivateChat', {
//             groupId: item.id,
//             groupSlug: item.group_slug,
//             name: item.name,
//             chatType: 'group',
//             profile_image: item.avatar,
//             members_count: item.members_count,
//             creator_id: item.creator_id
//           });
//         } else {
//           navigation.navigate('PrivateChat', {
//             receiverId: item.receiverId || item.id,
//             name: item.name,
//             chatType: 'single',
//             profile_image: item.avatar,
//           });
//         }
//       }}
//       style={styles.chatItem}
//     >
//       <Image
//         source={{
//           uri: item.avatar 
//             ? `${API_ROUTE_IMAGE}${item.avatar}` 
//             : item.type === 'group'
//               ? 'https://via.placeholder.com/50/cccccc/808080?text=G' 
//               : 'https://via.placeholder.com/50',
//         }}
//         style={styles.avatar}
//       />
//       <View style={styles.chatContent}>
//         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//           <Text style={styles.chatName}>
//             {highlightSearchText(item.name, searchQuery) || 
//             (item.type === 'group' ? 'Group Chat' : 'Unnamed Chat')}
//           </Text>
//           {item.type === 'group' && (
//             <>
//               <Icon 
//                 name="people-outline" 
//                 size={16} 
//                 color="#666" 
//                 style={{marginLeft: 6}}
//               />
//               <Text style={styles.memberCountText}>
//                 {item.members_count || 0}
//               </Text>
//               {item.is_creator && (
//                 <Icon 
//                   name="star" 
//                   size={14} 
//                   color="#FFD700" 
//                   style={{marginLeft: 4}}
//                 />
//               )}
//             </>
//           )}
//         </View>
//         <Text style={styles.chatMessage} numberOfLines={1}>
//           {highlightSearchText(item.content || 
//             (item.type === 'group' 
//               ? (item.is_creator ? 'You created this group' : 'No messages yet') 
//               : '[No message]'), 
//           searchQuery)}
//         </Text>
//       </View>
//       <View style={styles.timeBadgeContainer}>
//         <Text style={styles.chatTime}>{item.time || ''}</Text>
        

//         {(!readChats.has(`${item.id}-${item.type}`) && item.unread_count > 0) && (
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>
//               {item.unread_count > 9 ? '9+' : item.unread_count}
//             </Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   )}
//   ListEmptyComponent={() => (
//   isInitialLoading ? (
//     // <View style={[styles.emptyList,{padding:4}]}>
//       // <ActivityIndicator size='large' color="#0d64dd" />
//       <Text style={[styles.emptyText,{marginTop:80, textAlign:'center'}]}>Loading chats...</Text>
//     // </View>
//   ) : error ? (
//     <View style={styles.emptyList}>
//       <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
//       <TouchableOpacity onPress={fetchChatList}>
//         <Text style={[styles.emptyText, {color: '#0d64dd'}]}>Retry</Text>
//       </TouchableOpacity>
//     </View>
//   ) : (
//     <View style={styles.emptyList}>
//       <Text style={styles.emptyText}>
//         {searchQuery ? 'No matching chats found' : 'No chats available'}
//       </Text>
//       {!searchQuery && (
//         <TouchableOpacity onPress={() => setShowStartChatModal(true)}>
//           <Text style={[styles.emptyText, {color: '#0d64dd'}]}>Start a new chat</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   )
// )}
//   refreshControl={
//     <RefreshControl
//       refreshing={isLoading}
//       onRefresh={fetchChatList}
//       colors={['#0d64dd']}
//       tintColor="#0d64dd"
//     />
//   }
// />
     

//       <BottomNav navigation={navigation} setShowAccountModal={setShowAccountModal} />

//       {/* Incoming Call Modal */}
//       <IncomingCallModal
//         visible={showIncomingCallModal}
//         onAccept={handleAcceptCall}
//         onReject={handleRejectCall}
//         profileImage={callerInfo.profileImage}
//         callerName={callerInfo.name}
//       />

      
//       <Modal
//               visible={showStartChatModal}
//               transparent={true}
//               animationType="slide"
//               onRequestClose={() => !isSyncing && setShowStartChatModal(false)}
//             >
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   {isSyncing || syncComplete ? (
//                     <>
//                       <LottieView
//                         source={require("../assets/animations/DocumentProcessing.json")}
//                         autoPlay
//                         loop={!syncComplete}
//                         style={styles.lottie}
//                       />
//                       <Text style={styles.thankYouText}>
//                         {syncComplete ? 'Contacts Synced Successfully ✅' : 'Processing Contacts...'}
//                       </Text>
//                       {!syncComplete && (
//                         <Text style={styles.processingText}>Please wait while we sync your contacts—it may take a moment.</Text>
//                       )}
//                     </>
//                   ) : (
//                     <>

//                       <Text style={styles.heading2}>Connect With Friends</Text>
                      
//                             <Text style={styles.description}>
//                               To start chatting, we need access to your contacts to help you find friends who are already using the app. Don't worry, we don't store your contacts.
//                             </Text>
                      
//                       <Text style={styles.modalSubtitle}>Why We Ask for Contact Access</Text>
//                       <Text style={styles.modalDescription}>
//                         • Instantly find and chat with friends already using the app.{'\n'}
//                         • Suggest people you may know for easier connections.{'\n'}
//                         • No spam, no sharing — your contacts stay private.
//                       </Text>
//                       <Text style={styles.noteText}>
//                         We do not upload or store your contact list.dyyy Everything is matched securely on your device.
//                       </Text>
      
//                       <View style={styles.buttonRow}>
//                         <TouchableOpacity 
//                           style={styles.dismissBtn} 
//                           onPress={() => navigation.goBack()}
//                           disabled={isSyncing}
//                         >
//                           <Text style={styles.dismissText}>Not Now</Text>
//                         </TouchableOpacity>
      
//                         <TouchableOpacity 
//                           style={styles.allowBtn} 
//                           onPress={handleSyncContacts}
//                           disabled={isSyncing}
//                         >
//                           <Text style={styles.allowText}>Allow Access</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </>
//                   )}
//                 </View>
//               </View>
//             </Modal>

      

//       <Modal
//   visible={showAccountModal}
//   transparent={true}
//   animationType="fade"
//   onRequestClose={() => setShowAccountModal(false)}
// >
//   <Animated.View
//     style={{
//       flex: 1,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//       opacity: fadeAnim,
//     }}
//   >
//     <View
//       style={{
//         width: '85%',
//         backgroundColor: '#fff',
//         borderRadius: 14,
//         padding: 20,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//         elevation: 5,
//       }}
//     >
//       <Text
//         style={{
//           fontSize: 20,
//           fontFamily:'Lato-Black',
//           color: '#222',
//           marginBottom: 10,
//           textAlign: 'center',
//         }}
//       >
//         Choose Your Showa Experience
//       </Text>

//       <Text
//         style={{
//           fontSize: 14,
//           color: '#666',
//           marginBottom: 18,
//           textAlign: 'center',
//         }}
//       >
//         Switch between e-Vibbz (short videos) and e-Broadcast (posts & updates)
//       </Text>

//       {/* e-Vibbz Button */}
//       <TouchableOpacity
//         style={{
//           width: '100%',
//           paddingVertical: 12,
//           paddingHorizontal: 15,
//           borderRadius: 10,
//           alignItems: 'center',
//           marginBottom: 10,
//           backgroundColor: '#9704e0',
//         }}
//         onPress={()=>{
//               navigation.navigate('SocialHome'),
//               setShowAccountModal(false)

//             }}
        
//       >
//         <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
//            e-Vibbz
//         </Text>
       
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={{
//           width: '100%',
//           paddingVertical: 12,
//           paddingHorizontal: 15,
//           borderRadius: 10,
//           alignItems: 'center',
//           marginBottom: 10,
//           backgroundColor: '#0d6efd',
//         }}
//          onPress={()=>{
//               navigation.navigate('BroadcastHome'),
//               setShowAccountModal(false)

//             }}
//         //onPress={() => navigation.navigate('BroadcastHome')}
//       >
//         <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
//            e-Broadcast
//         </Text>
        
//       </TouchableOpacity>

      
//       <TouchableOpacity
//         style={{
//           width: '100%',
//           paddingVertical: 12,
//           paddingHorizontal: 15,
//           borderRadius: 10,
//           alignItems: 'center',
//           marginBottom: 10,
//           backgroundColor: '#eee',
//         }}
//         onPress={() => setShowAccountModal(false)}
//       >
//         <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
//           Cancel
//         </Text>
//       </TouchableOpacity>
//     </View>
//   </Animated.View>
// </Modal>

//       <Modal
//   visible={showMediaModal}
//   transparent={true}
//   animationType="slide"
//   onRequestClose={() => setShowMediaModal(false)}>
//   <View style={styles.mediaModalContainer}>
   
//     <View style={styles.mediaPreviewContainer}>
//       {media?.type?.includes('video') ? (
//         <Video
//           source={{uri: media.uri}}
//           style={styles.mediaPreview}
//           resizeMode="cover"
//           repeat
//           muted
//         />
//       ) : (
//         <Image source={{uri: media?.uri}} style={styles.mediaPreview} />
//       )}

//       <TextInput
//         style={styles.captionInput}
//         placeholder="Add caption to your status (optional)"
//         value={caption}
//         placeholderTextColor='#777'
//         onChangeText={setCaption}
//         multiline
//       />

//       <View style={styles.mediaActionButtons}>
//         <TouchableOpacity
//           style={[styles.mediaButton, styles.cancelButton]}
//           onPress={() => {
//             setMedia(null);
//             setCaption('');
//             setShowMediaModal(false);
//           }}>
//           <Text style={[styles.buttonText,{color:'#333'}]}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.mediaButton, styles.postButton]}
//           onPress={() => {
          
//             handlePostStatus(media, caption);
//             setShowMediaModal(false);
//           }}>
//           <Text style={styles.buttonText}>Post</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>
//       <TouchableOpacity
//               style={styles.fabEarn}
//               onPress={() => {
              
//                 navigation.navigate('Earnings');
//               }}
//             >
//               <Text style={{fontFamily:'PTSerif-Regular.ttf', color:'#fff', fontSize:18}}>Earn</Text>
//               {/* <Icon name="add" size={24} color="#fff" /> */}
//             </TouchableOpacity>
//       <TouchableOpacity
//               style={styles.fab}
//               onPress={() => {
              
//                 navigation.navigate('UserContactListPersonalAccount');
//               }}
//             >
//               <Icon name="add" size={24} color="#0d64dd" />
//             </TouchableOpacity>

//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f7fa',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 80,
//   },
//   fab: {
//   position: 'absolute',
//   bottom: 100, 
//   right: 20,
//   width: 60,
//   height: 60,
//   borderRadius: 8,
//   backgroundColor: '#fff',
//   alignItems: 'center',
//   elevation: 10,
//   shadowColor: '#000',
//   shadowOpacity: 0.3,
//   shadowRadius: 4,
//   justifyContent:'center',
//   alignSelf:'center',
//   zIndex: 1000,
//   borderColor:'#eee',
//   borderStyle:'solid',
  
// },
//   fabEarn: {
//   position: 'absolute',
//   bottom: 180, 
//   right: 20,
//   width: 60,
//   height: 60,
//   borderRadius: 8,
//   backgroundColor: '#0d64dd',
//   alignItems: 'center',
//   elevation: 10,
//   shadowColor: '#000',
//   shadowOpacity: 0.3,
//   shadowRadius: 4,
//   justifyContent:'center',
//   alignSelf:'center',
//   zIndex: 1000,
//   borderColor:'#eee',
//   borderStyle:'solid',
  
// },

//   header: {
//     paddingTop: 30,
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     zIndex: 1000,
//   },
//   timeBadgeContainer: {
//   alignItems: 'flex-end',
//   minWidth: 50,
// },
// badge: {
//   backgroundColor: '#0d64dd',
//   borderRadius: 50,
//   minWidth: 20,
//   height: 20,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginTop: 4,
//   paddingHorizontal: 4,
// },
// badgeText: {
//   color: 'white',
//   fontSize: 12,
//   fontWeight: 'bold',
//   textAlign: 'center',
// },
//   dropdownMenu: {
//     position: 'absolute',
//     top: 40, 
//     right: 10,
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 2000, 
//     borderWidth: 0.5,
//     borderColor: '#e0e0e0',
//     minWidth: 180,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     color: '#1a1a1a',
//     fontFamily: 'SourceSansPro-Regular',
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 28,
//     fontFamily: 'SourceSansPro-Bold',
//     letterSpacing: 0.5,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tabRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 16,
//   },
//   tabText: {
//     color: '#e6e6e6',
//     fontSize: 16,
//     fontFamily: 'SourceSansPro-Regular',
//     paddingVertical: 6,
//   },
//   tabTextActive: {
//     color: '#fff',
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontWeight: '600',
//   },
//   tabUnderline: {
//     height: 3,
//     backgroundColor: '#fff',
//     borderRadius: 2,
//     marginTop: 4,
//   },
//    searchBox: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     margin: 16,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     height: 48,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     borderWidth: 0,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     zIndex: 500,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     fontFamily: 'SourceSansPro-Regular',
//     color: '#333',
//     paddingRight: 8,
//   },
//   sectionTabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 20,
//     marginVertical: 12,
//   },
//   sectionTab: {
//     fontSize: 14,
//     fontFamily: 'SourceSansPro-SemiBold',
//     color: '#666',
//   },
//     userItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
//   userName: {
//     marginLeft: 12,
//     fontSize: 16,
//     textTransform: 'capitalize',
//     color: '#333',
//   },
//   chatList: {
//     flexGrow: 0,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//     marginHorizontal: 12,
//     marginVertical: 4,
//     borderRadius: 12,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//     backgroundColor: '#e0e0e0',
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatName: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//     color: '#1a1a1a',
//   },
//   chatMessage: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 14,
//     color: '#666',
//   },
//   chatTime: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 12,
//     color: '#888',
//   },
//   emptyList: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 16,
//     color: '#666',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     width: '85%',
//     elevation: 6,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButton: {
//     width: '100%',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#0d64dd',
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   accountModalContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   memberCountText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 2,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//     marginHorizontal: 12,
//     marginVertical: 4,
//     borderRadius: 12,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//     backgroundColor: '#e0e0e0',
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatName: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//     color: '#1a1a1a',
//   },
//   chatMessage: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   timeBadgeContainer: {
//     alignItems: 'flex-end',
//     minWidth: 50,
//   },
//   chatTime: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 12,
//     color: '#888',
//   },
//   badge: {
//     backgroundColor: '#0d64dd',
//     borderRadius: 50,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 4,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   fullScreenLoading: {
//     flex: 1,
//     backgroundColor: "white", 
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   mediaModalContainer: {
//   flex: 1,
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: 'rgba(0,0,0,0.8)',
// },
// mediaPreviewContainer: {
//   width: '90%',
//   backgroundColor: '#fff',
//   borderRadius: 10,
//   padding: 15,
// },
// mediaPreview: {
//   width: '100%',
//   height: 300,
//   borderRadius: 5,
//   marginBottom: 15,
// },
// captionInput: {
//   borderWidth: 1,
//   borderColor: '#ddd',
//   borderRadius: 5,
//   padding: 10,
//   minHeight: 50,
//   marginBottom: 15,
// },
// mediaActionButtons: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
// },
// mediaButton: {
//   padding: 12,
//   borderRadius: 5,
//   width: '48%',
//   alignItems: 'center',
// },
// cancelButton: {
//   backgroundColor: '#e0e0e0',
// },
// postButton: {
//   backgroundColor: '#0d64dd',
// },
// buttonText: {
//   color: '#fff',
//   fontWeight: 'bold',
// },
// modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 25,
//     width: '90%',
//     maxWidth: 400,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#333',
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 15,
//     marginBottom: 10,
//     color: '#333',
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//     lineHeight: 20,
//   },
//   syncButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     marginBottom: 20,
//     width: '100%',
//   },
//   syncButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   skipText: {
//     fontSize: 14,
//     color: '#999',
//     textDecorationLine: 'underline',
//   },
//   noteText: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 15,
//     fontStyle: 'italic',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   dismissBtn: {
//     padding: 10,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     flex: 1,
//     marginRight: 10,
//   },
//   dismissText: {
//     textAlign: 'center',
//     color: '#666',
//   },
//   allowBtn: {
//     padding: 10,
//     borderRadius: 20,
//     backgroundColor: colors.primary,
//     flex: 1,
//     marginLeft: 10,
//   },
//   allowText: {
//     textAlign: 'center',
//     color: 'white',
//     fontWeight: '600',
//   },
//   lottie: {
//     width: 150,
//     height: 150,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   thankYouText: {
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#333',
//   },
//   processingText: {
//     fontSize: 14,
//     textAlign: 'center',
//     color: '#666',
//   },
//   heading2: {
//     fontSize: 24,
//     fontFamily:'SourceSansPro-Bold',
//     marginBottom: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//     lineHeight: 24,
//   },

//   confirmSwitchOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)'
//   },
//   confirmSwitchContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     width: '85%',
//     elevation: 6,
//     alignItems: 'center'
//   },
//   confirmSwitchTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   confirmSwitchSubtitle: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   confirmSwitchButton: {
//     width: '100%',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     alignItems: 'center'
//   },
//   confirmSwitchButtonPrimary: {
//     backgroundColor: '#0d64dd'
//   },
//   confirmSwitchButtonSecondary: {
//     backgroundColor: '#eee'
//   },
//   confirmSwitchButtonText: {
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   confirmSwitchButtonTextPrimary: {
//     color: '#fff'
//   },
//   confirmSwitchButtonTextSecondary: {
//     color: '#333'
//   },
//   switchHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   switchIcon: {
//     marginRight: 10,
//   },
//   highlightText: {
//     fontWeight: 'bold',
//     color: '#0d64dd',
//   },
//   switchDetails: {
//     marginBottom: 20,
//     width: '100%',
//   },
//   switchBulletPoints: {
//     marginTop: 15,
//   },
//   bulletPoint: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 10,
//   },
//   bulletText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#555',
//     flex: 1,
//   },
//   switchActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   confirmSwitchButton: {
//     width: '48%', 
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   switchFooterNote: {
//     marginTop: 15,
//     fontSize: 12,
//     color: '#888',
//     textAlign: 'center',
//     fontStyle: 'italic',
//   },

//   //// eplore badge
//   exploreIconContainer: {
//   position: 'relative',
//   marginRight: 15,
// },
// exploreBadge: {
//   position: 'absolute',
//   top: -9,
//   right: -4,
//   backgroundColor: '#fff',
//   borderRadius: 8,
//   paddingHorizontal: 5,
//   paddingVertical: 2,
//   minWidth: 55,
//   alignItems: 'center',
//   justifyContent: 'center',
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 1 },
//   shadowOpacity: 0.2,
//   shadowRadius: 2,
//   elevation: 2,
//   borderWidth: 1,
//   borderColor: '#e0e0e0',
// },
// exploreBadgeText: {
//   color: '#0d64dd',
//   fontSize: 9,
//   textTransform: 'uppercase',
//   fontFamily:'Lato-Black',
//   letterSpacing: 0.3,
// },
  
// });

// export default HomeScreen;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Animated,
  RefreshControl,
  StatusBar,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Keyboard,
  Linking,
  KeyboardAvoidingView, 
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import BottomNav from '../components/BottomNav';
import { Divider } from 'react-native-paper';
import { launchCamera } from 'react-native-image-picker';
import { syncContacts } from '../components/SyncContact';
import LottieView from 'lottie-react-native';
import colors from '../theme/colors';
import SwitchAccountSheet from '../components/SwitchAccountSheet';
import IncomingCallModal from '../components/IncomingCallModal';
import EarningFloatingButton from '../components/EarningButtonForHome';
import NotificationService from '../src/services/PushNotifications';
import Video from 'react-native-video';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PinUnlockModal from '../screens/PinUnlockModal'; 

const HomeScreen = ({ navigation }) => {

  const { colors, theme, toggleTheme, isDark  } = useTheme(); 
  const [tab, setTab] = useState('Chats');
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [showStartChatModal, setShowStartChatModal] = useState(false);
  const [hasDismissedModal, setHasDismissedModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showDropdown, setShowDropdown] = useState(false);
  const [accountMode, setAccountMode] = useState('personal');
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [pendingSwitchTo, setPendingSwitchTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredChatList, setFilteredChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [hasCompletedSync, setHasCompletedSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [readChats, setReadChats] = useState(new Set());
  const [callerInfo, setCallerInfo] = useState({ profileImage: '', name: 'Incoming Call' });
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    showNotifications: true,
    doNotDisturb: false,
  });


  // Dropdown Modal Component for iOS
      const DropdownModal = ({ visible, onClose, children, dropdownPosition }) => {
  // On Android, don't render anything - we handle it separately
  if (Platform.OS === 'android') {
    return null;
  }
  
  // On iOS, render the modal
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
          <View style={[
            styles.dropdownMenuIOS, 
            { 
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              ...dropdownPosition 
            }
          ]}>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

  const calculateDropdownPosition = () => {

    return { top: 80, right: 20 };
  };

 
  const renderDropdownContent = () => (
  <>
    <Text style={[styles.dropdownItem, { fontWeight: 'bold', color: colors.text }]}>
      Personal Account
    </Text>
    <Divider style={{ backgroundColor: colors.border }} />
    <TouchableOpacity
      onPress={() => {
        setShowDropdown(false);
        navigation.navigate('Settings');
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Profile</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      onPress={async () => {
        setShowDropdown(false);
        navigation.navigate('Broadcaster', {
          roomName: `user-${userName}`,
          streamId: `stream-${userName}`,
          userName: userData?.name || 'User',
          userId: userId
        });
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Go Live</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      onPress={() => {
        setShowDropdown(false);
        navigation.navigate('LiveStreaming');
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Watch Live</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      onPress={() => {
        setShowDropdown(false);
        navigation.navigate('EarningDashbord');
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Earn Money</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      onPress={() => {
        setShowDropdown(false);
        navigation.navigate('GlobalIssueReport');
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Global Report</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      onPress={() => {
        setShowDropdown(false);
        navigation.navigate('NewsList');
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Latest News</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      onPress={() => {
        setShowDropdown(false);
        navigation.navigate('Settings');
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Settings</Text>
    </TouchableOpacity>

    <TouchableOpacity
      
        onPress={() => {
        setShowDropdown(false);
        setPendingSwitchTo('business');
        setShowConfirmSwitch(true);
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text, fontWeight:'bold' }]}>Switch Account</Text>
    </TouchableOpacity>
    
    
  </>
);




  const [dropdownPosition, setDropdownPosition] = useState({ top: 80, right: 20 });
 const insets = useSafeAreaInsets();
  // Create dynamic styles based on theme
  const styles = createStyles(colors, insets);

  const [syncProgress, setSyncProgress] = useState(0);

    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);

      const [showTooltip, setShowTooltip] = useState(false);
      const scaleAnim = useRef(new Animated.Value(1)).current;
      const opacityAnim = useRef(new Animated.Value(0)).current;
    


  const handleOutsidePress = () => {
    setShowDropdown(false);
  };

  const ws = useRef(null);

  // Load notification settings and read chats
  useEffect(() => {
    const loadInitialData = async () => {
      await loadNotificationSettings();
      await loadReadChats();
    };
    loadInitialData();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        setNotificationSettings(JSON.parse(settings));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  // Load read chats from AsyncStorage
  const loadReadChats = async () => {
    try {
      const storedReadChats = await AsyncStorage.getItem('readChats');
      if (storedReadChats) {
        setReadChats(new Set(JSON.parse(storedReadChats)));
      }
    } catch (error) {
      console.error('Error loading read chats:', error);
    }
  };

  // Save read chats to AsyncStorage
  const saveReadChats = async (readChatsSet) => {
    try {
      await AsyncStorage.setItem('readChats', JSON.stringify([...readChatsSet]));
    } catch (error) {
      console.error('Error saving read chats:', error);
    }
  };

  // Load cached chats from AsyncStorage
  const loadCachedChats = async () => {
    try {
      const cachedChats = await AsyncStorage.getItem('cachedChats');
      if (cachedChats) {
        const parsedChats = JSON.parse(cachedChats);
        // Apply read state to cached chats
        const updatedChats = parsedChats.map(chat => ({
          ...chat,
          unread_count: readChats.has(`${chat.id}-${chat.type}`) ? 0 : chat.unread_count,
        }));
        setChatList(updatedChats);
        setFilteredChatList(updatedChats);
        setIsInitialLoading(false);
      }
    } catch (error) {
      console.error('Error loading cached chats:', error);
    }
  };

  // Save chats to AsyncStorage
  const saveChatsToStorage = async (chats) => {
    try {
      await AsyncStorage.setItem('cachedChats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to AsyncStorage:', error);
    }
  };

  
  // const fetchUserData = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     const response = await axios.get(`${API_ROUTE}/get-users/`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       const uniqueUsers = response.data.filter(
  //         (user, index, self) => index === self.findIndex((u) => u.id === user.id)
  //       );
  //       setUserData(uniqueUsers);
  //       console.log('Fetched users:', response.data);
  //       console.log('Fetched users id:', response.data.id);
  //       console.log('Fetched users name:', response.data.name);
  //       setUserName(response.data.name);
  //       setUserId(response.data.id);
        

  //     }
  //   } catch (error) {
  //     console.log('Error fetching users:', error.message);
  //   }
  // };

const fetchUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_ROUTE}/get-users/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200 || response.status === 201) {
      const uniqueUsers = response.data.filter(
        (user, index, self) => index === self.findIndex((u) => u.id === user.id)
      );
      setUserData(uniqueUsers);
      
      console.log('Fetched users:', response.data);
      
      // Get current user data from storage
      const currentUserData = await AsyncStorage.getItem('userData');
      console.log('Current user data from storage:', currentUserData);
      
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        console.log('Current user ID:', currentUser.id);
        console.log('Current user name:', currentUser.name);
        
        // Find the current user in the fetched data
        const currentUserInResponse = response.data.find(user => user.id === currentUser.id);
        
        if (currentUserInResponse) {
          console.log('Current user found in response:', {
            id: currentUserInResponse.id,
            name: currentUserInResponse.name,
            email: currentUserInResponse.email
          });
          
          // Set state with current user data
          setUserName(currentUserInResponse.name);
          setUserId(currentUserInResponse.id);
        } else {
          console.log('Current user not found in fetched data');
        }
      }
      
      // Log all users for reference
      console.log('All fetched users:');
      response.data.forEach((user, index) => {
        console.log(`User ${index + 1}: ID=${user.id}, Name=${user.name}`);
      });
    }
  } catch (error) {
    console.log('Error fetching users:', error.message);
  }
};

  // Fetch chat list and cache it
  const fetchChatList = async () => {
    setIsLoading(true);
    setError(null);
    setIsInitialLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const filteredChats = response.data.chats.filter(chat => chat.type !== 'channel');
      const uniqueChats = [];
      const seenIds = new Set();

      filteredChats.forEach((chat) => {
        const chatIdentifier = chat.type === 'single'
          ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
          : chat.group_slug || chat.id;

        if (!seenIds.has(chatIdentifier)) {
          seenIds.add(chatIdentifier);
          uniqueChats.push({
            ...chat,
            id: chatIdentifier,
            unread_count: readChats.has(`${chatIdentifier}-${chat.type}`) ? 0 : (chat.unread_count || 0),
            name: chat.name || 'Unknown',
            content: chat.content || '[media]',
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
            type: chat.type,
            receiverId: chat.type === 'single' ? chatIdentifier : null,
            group_slug: chat.group_slug || null,
            members_count: chat.members_count,
            creator_id: chat.creator_id,
            key: `${chat.id}-${chat.type}`,
          });
        }
      });

      setChatList(uniqueChats);
      setFilteredChatList(uniqueChats);
      await saveChatsToStorage(uniqueChats); // Cache the chats
    } catch (err) {
      console.error('Failed to load chat list:', err.response?.data || err.message);
      setError('Failed to load chats. Please try again.');
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Silent fetch for background updates
  const fetchChatListSilently = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(
        `${API_ROUTE}/api/chat/list/?account_mode=${accountMode}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const filteredChats = response.data.chats.filter(chat => chat.type !== 'channel');
      const uniqueChats = [];
      const seenIds = new Set();

      filteredChats.forEach((chat) => {
        const chatIdentifier = chat.type === 'single'
          ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
          : chat.group_slug || chat.id;

        if (!seenIds.has(chatIdentifier)) {
          seenIds.add(chatIdentifier);
          uniqueChats.push({
            ...chat,
            id: chatIdentifier,
            unread_count: readChats.has(`${chatIdentifier}-${chat.type}`) ? 0 : (chat.unread_count || 0),
            name: chat.name || 'Unknown',
            content: chat.content || '[media]',
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
            type: chat.type,
            members_count: chat.members_count,
            receiverId: chat.type === 'single' ? chatIdentifier : null,
            group_slug: chat.group_slug || null,
            key: `${chat.id}-${chat.type}`,
          });
        }
      });

      checkForNewMessages(uniqueChats);

      setChatList(prevChats => {
        if (JSON.stringify(prevChats) !== JSON.stringify(uniqueChats)) {
          saveChatsToStorage(uniqueChats); // Update cache
          return uniqueChats;
        }
        return prevChats;
      });

      setFilteredChatList(prevFiltered => {
        if (searchQuery.trim() === '') {
          return uniqueChats;
        }
        return prevFiltered;
      });
    } catch (err) {
      console.error('Silent refresh error:', err);
    }
  };

  // Check for new messages and show notifications
  const checkForNewMessages = (newChats) => {
    if (!notificationSettings.showNotifications || notificationSettings.doNotDisturb) {
      return;
    }

    newChats.forEach(chat => {
      if (chat.unread_count > 0 && !readChats.has(`${chat.id}-${chat.type}`)) {
        const notificationKey = `notified_${chat.id}_${chat.unread_count}`;
        AsyncStorage.getItem(notificationKey).then(alreadyNotified => {
          if (!alreadyNotified) {
            NotificationService.localNotification(
              chat.name,
              chat.content || 'New message',
              {
                chatId: chat.id,
                chatType: chat.type,
                name: chat.name,
              }
            );
            AsyncStorage.setItem(notificationKey, 'true');
          }
        });
      }
    });
  };

  // Initial data load with cached data
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadData = async () => {
        try {
          await loadCachedChats(); // Load cached data immediately
          await fetchChatList(); // Fetch fresh data
          await fetchUserData();
        } catch (error) {
          console.error('Focus effect error:', error);
        }
      };

      loadData();

      return () => {
        isMounted = false;
      };
    }, [readChats])
  );

  // Periodic silent refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatListSilently();
    }, 30000);

    return () => clearInterval(interval);
  }, [accountMode, searchQuery, readChats]);

  // WebSocket for incoming calls
  // useEffect(() => {
  //   const connectCallWebSocket = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('userToken');
  //       const retrieveUserId = await AsyncStorage.getItem('userData');
  //       const userData = JSON.parse(retrieveUserId);
  //       const currentUserId = userData.id;
  //       const ROOM_ID = `user-${currentUserId}`;
  //       const SIGNALING_SERVER = 'ws://showa.essential.com.ng';
        
  //       const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;
  //       ws.current = new WebSocket(url);

  //       ws.current.onopen = () => {};

  //       ws.current.onmessage = async (evt) => {
  //         let data;
  //         try {
  //           data = JSON.parse(evt.data);
  //         } catch (e) {
  //           return;
  //         }

  //         if (data.type === 'offer') {
  //           if (data.offer.targetUserId && data.offer.targetUserId !== currentUserId) {
  //             return;
  //           }
            
  //           const callerData = data.offer.callerInfo || {
  //             profileImage: data.offer.profileImage || '',
  //             name: data.offer.callerName || 'Caller'
  //           };

  //           setCallerInfo({
  //             profileImage: callerData.profileImage,
  //             name: callerData.name,
  //             offer: data.offer
  //           });
  //           setShowIncomingCallModal(true);
  //         }
  //       };

  //       ws.current.onclose = () => {};
  //       ws.current.onerror = (err) => {};
  //     } catch (error) {};
  //   };

  //   connectCallWebSocket();

  //   return () => {
  //     if (ws.current) {
  //       ws.current.close();
  //     }
  //   };
  // }, []);
  useEffect(() => {
  const connectCallWebSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const retrieveUserId = await AsyncStorage.getItem('userData');

      if (!token || !retrieveUserId) {
        console.warn('Missing auth data, websocket not started');
        return;
      }

      const userData = JSON.parse(retrieveUserId);
      const currentUserId = userData.id;
      const ROOM_ID = `user-${currentUserId}`;
      const SIGNALING_SERVER = 'wss://showa.essential.com.ng';

      const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

      ws.current = new WebSocket(url);
      ws.current.binaryType = 'arraybuffer';

      ws.current.onopen = () => {
        console.log('[Call WS] Connected');
      };

      ws.current.onmessage = (evt) => {
        let data;
        try {
          data = JSON.parse(evt.data);
        } catch (e) {
          console.error('[WS] Invalid JSON', e);
          return;
        }

        if (data.type === 'offer') {
          if (
            data.offer?.targetUserId &&
            data.offer.targetUserId !== currentUserId
          ) {
            return;
          }

          const callerData = data.offer.callerInfo || {
            profileImage: data.offer.profileImage || '',
            name: data.offer.callerName || 'Unknown Caller',
          };

          setCallerInfo({
            profileImage: callerData.profileImage,
            name: callerData.name,
            offer: data.offer,
          });

          setShowIncomingCallModal(true);
        }
      };

      ws.current.onerror = (e) => {
        console.error('[Call WS] Error', e);
      };

      ws.current.onclose = (e) => {
        console.log('[Call WS] Closed', e.code, e.reason);
      };
    } catch (err) {
      console.error('[Call WS] Failed to connect', err);
    }
  };

  connectCallWebSocket();

  return () => {
    ws.current?.close();
  };
}, []);


  const sendMessage = (msg) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  };


  
    
    useEffect(()=>{

      const fetchUserData =async () =>{

        try {

        const userDataString = await AsyncStorage.getItem('userData');
                      const userData = userDataString ? JSON.parse(userDataString) : null;
                      console.log('User Dataaaaaa:', userData);
                      const userId = userData?.id || 'unknown';
                      const username = userData?.name || 'unknown';
                      setUserName(username)
                      console.log('usernamennnn', username)
        
      } catch (error) {
        
        
      }

      }

      fetchUserData()
      
    },[])

  const handleAcceptCall = () => {
    navigation.navigate('VoiceCalls', {
      profile_image: callerInfo.profileImage,
      name: callerInfo.name,
      incomingOffer: callerInfo.offer,
      isIncomingCall: true,
      isInitiator: false
    });
    setShowIncomingCallModal(false);
  };

  const handleRejectCall = () => {
    sendMessage({ type: 'call-ended' });
    setShowIncomingCallModal(false);
    setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
  };

  // const handleSyncContacts = async () => {
  //   setIsSyncing(true);
  //   const authToken = await AsyncStorage.getItem('userToken');
    
  //   if (!authToken) {
  //     Alert.alert('Error', 'Please login first.');
  //     setIsSyncing(false);
  //     return;
  //   }

  //   try {
  //     const result = await syncContacts(authToken);
  //     if (result.success) {
  //       const message = result.syncedContacts > 0
  //         ? `${result.syncedContacts} of your contacts are now connected and ready to chat.`
  //         : 'No matching contacts were found. Invite your friends to join the app!';

  //       setSyncComplete(true);
  //       setHasCompletedSync(true);
  //       await AsyncStorage.setItem('hasCompletedSync', 'true');
        
  //       setTimeout(() => {
  //         setModalVisible(false);
  //         navigation.navigate('UserContactListPersonalAccount');
  //       }, 2000);
  //     } else {
  //       Alert.alert('Error', result.error || 'Failed to sync contacts.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'An error occurred while syncing your contacts.');
  //   } finally {
  //     setIsSyncing(false);
  //   }
  // };
// const handleSyncContacts = async () => {
//   setIsSyncing(true);
//   setSyncProgress(0);
//   const authToken = await AsyncStorage.getItem('userToken');
  
//   if (!authToken) {
//     Alert.alert('Error', 'Please login first.');
//     setIsSyncing(false);
//     return;
//   }

//   try {
//     const result = await syncContacts(authToken, (progress) => {
//       setSyncProgress(Math.round(progress * 100)); // Update progress (0-1 to 0-100)
//     });
    
//     if (result.success) {
//       const message = result.syncedContacts > 0
//         ? `${result.syncedContacts} of your contacts are now connected and ready to chat.`
//         : 'No matching contacts were found. Invite your friends to join the app!';

//       setSyncComplete(true);
//       setHasCompletedSync(true);
//       await AsyncStorage.setItem('hasCompletedSync', 'true');
      
//       // No need for setTimeout since we have a close button now
//     } else {
//       Alert.alert('Error', result.error || 'Failed to sync contacts.');
//     }
//   } catch (error) {
//     Alert.alert('Error', 'An error occurred while syncing your contacts.');
//   } finally {
//     setIsSyncing(false);
//   }
// };

  // const handleCameraLaunch = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const cameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
  //       if (!cameraPermission) {
  //         const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
  //           title: 'Camera Permission',
  //           message: 'App needs access to your camera',
  //           buttonPositive: 'OK',
  //           buttonNegative: 'Cancel',
  //         });
          
  //         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //           Alert.alert(
  //             'Permission Required',
  //             'Camera permission is required to take photos',
  //             [
  //               { text: 'Cancel', style: 'cancel' },
  //               { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //             ]
  //           );
  //           return;
  //         }
  //       }
  //     }

  //     const response = await launchCamera({
  //       mediaType: 'mixed',
  //       quality: 0.7,
  //       includeBase64: false,
  //       saveToPhotos: true,
  //       cameraType: 'back',
  //     });

  //     if (response.didCancel) {
  //     } else if (response.errorCode) {
  //       Alert.alert('Error', response.errorMessage || 'Failed to access camera');
  //     } else if (response.assets?.[0]) {
  //       const mediaData = {
  //         uri: response.assets[0].uri,
  //         type: response.assets[0].type || 'image/jpeg',
  //         fileName: response.assets[0].fileName || `photo_${Date.now()}.jpg`,
  //       };
  //       setMedia(mediaData);
  //       setShowMediaModal(true);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to launch camera');
  //   }
  // };
  

const handleCameraLaunch = async () => {
  try {
    // Check and request camera permissions based on platform
    if (Platform.OS === 'android') {
      // Android permission handling
      const cameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (!cameraPermission) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        });
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take photos',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
      }
      
      // Android also needs storage permission for saving photos
      const storagePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (!storagePermission) {
        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to save photos',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        
        if (storageGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Storage permission is required to save photos',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
      }
    }
    // iOS doesn't require explicit permission request here because image-picker handles it
    // But we need to check Info.plist has proper permissions:
    // - NSCameraUsageDescription
    // - NSPhotoLibraryUsageDescription (if you also allow photo library access)
    // - NSMicrophoneUsageDescription (for video recording)

    const response = await launchCamera({
      mediaType: 'photo', // For iOS compatibility, use 'photo' instead of 'mixed'
      quality: 0.7,
      includeBase64: false,
      saveToPhotos: true,
      cameraType: 'back',
      // iOS specific options
      presentationStyle: 'fullScreen',
      // Android specific options
      maxWidth: 1024,
      maxHeight: 1024,
      // Common options
      durationLimit: 30, // For video if you enable it
      videoQuality: 'high',
      // Permission options for iOS
      permissionDenied: {
        title: 'Permission Denied',
        text: 'To take photos with your camera, please enable camera permissions in your device settings.',
        reTryTitle: 'Retry',
        okTitle: 'I\'m sure',
      },
    });

    if (response.didCancel) {
      // User cancelled, do nothing
    } else if (response.errorCode) {
      // Handle specific error codes
      let errorMessage = response.errorMessage || 'Failed to access camera';
      
      if (response.errorCode === 'camera_unavailable') {
        errorMessage = 'Camera is not available on this device';
      } else if (response.errorCode === 'permission') {
        errorMessage = 'Camera permission was denied';
        // Show settings prompt for iOS
        if (Platform.OS === 'ios') {
          Alert.alert(
            'Camera Permission Required',
            'Please enable camera access in Settings to take photos',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
            ]
          );
          return;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } else if (response.assets?.[0]) {
      const asset = response.assets[0];
      const mediaData = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
        // iOS specific
        timestamp: asset.timestamp,
        // Android specific
        originalPath: asset.originalPath,
      };
      setMedia(mediaData);
      setShowMediaModal(true);
    }
  } catch (error) {
    console.error('Camera launch error:', error);
    Alert.alert('Error', 'Failed to launch camera. Please try again.');
  }
};

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChatList(chatList);
    } else {
      const filtered = chatList.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredChatList(filtered);
    }
  }, [searchQuery, chatList]);

  useEffect(() => {
    const loadMode = async () => {
      const mode = await AsyncStorage.getItem('accountMode') || 'personal';
      setAccountMode(mode);
    };
    loadMode();
  }, []);

  const getSyncSummary = async () => {
  const summary = await AsyncStorage.getItem("contactSyncSummary");
  if (summary) {
    return JSON.parse(summary);
  }
  return null;
};

useEffect(()=>{
  getSyncSummary().then(summary=>{
    if(summary){
      console.log('Contact Sync Summaryrrrr:', summary);
    }
  });
})



  useEffect(() => {
    
    const checkAndShowModal = async () => {
      if (!isInitialLoading && chatList.length === 0 && !hasDismissedModal && !hasCompletedSync) {
        fetchUserData();
        setShowStartChatModal(true);
      }
    };
    checkAndShowModal();
  }, [chatList, isInitialLoading, hasDismissedModal, hasCompletedSync]);

  // const handleSkip = () => {
  //   setHasCompletedSync(true);
  //   AsyncStorage.setItem('hasCompletedSync', 'true');
  //   navigation.goBack();
  // };

  useEffect(() => {
    if (showAccountModal) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAccountModal]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const switchAccount = async (account) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('accountMode', account);
      setAccountMode(account);

      if (account === 'personal') {
        fetchChatList();
      } else {
        const profile = await fetchProfile();
        if (profile && profile.name && profile.name.trim() !== '') {
          navigation.navigate('BusinessHome');
        } else {
          navigation.navigate('BusinessSetup');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostStatus = async (media, caption) => {
    if (!media) {
      Alert.alert('Error', 'No media selected');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      let fileExt = media.uri.split('.').pop().toLowerCase();
      let type = media.type;

      if (!type) {
        if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
          type = 'image/jpeg';
        } else if (['mp4', 'mov'].includes(fileExt)) {
          type = 'video/mp4';
        }
      }

      formData.append('media', {
        uri: media.uri,
        type: type,
        name: `status_${Date.now()}.${fileExt}`,
      });

      if (caption) {
        formData.append('text', caption);
      }

      const response = await axios.post(`${API_ROUTE}/status/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Status posted successfully!');
      return response.data;
    } catch (error) {
      Alert.alert('Error', 'Failed to post status');
      throw error;
    }
  };

  const highlightSearchText = (text = '', query) => {
    if (!query || !text || typeof text !== 'string') return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <Text>
        {text.substring(0, index)}
        <Text style={{ backgroundColor: '#FFEB3B', color: '#000' }}>
          {text.substring(index, index + query.length)}
        </Text>
        {text.substring(index + query.length)}
      </Text>
    );
  };

  const markMessagesAsRead = async (chatId, chatType) => {
    const chatKey = `${chatId}-${chatType}`;
    
    // Update local state
    setReadChats(prev => {
      const newSet = new Set(prev).add(chatKey);
      saveReadChats(newSet);
      return newSet;
    });

    // Update chat lists
    setChatList(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId && chat.type === chatType ? { ...chat, unread_count: 0 } : chat
      )
    );
    setFilteredChatList(prevFiltered =>
      prevFiltered.map(chat =>
        chat.id === chatId && chat.type === chatType ? { ...chat, unread_count: 0 } : chat
      )
    );
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.post(
        `${API_ROUTE}/chatmessage/mark-read/`,
        { chat_id: chatId, chat_type: chatType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      Alert.alert('Error', 'Failed to mark messages as read. Please try again.');
      // Revert local state on failure
      setReadChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatKey);
        saveReadChats(newSet); 
        return newSet;
      });
      // Refresh chat list 
      fetchChatList();
    }
  };

  return (
    <View style={[styles.container,{ backgroundColor: colors.backgroundSecondary }]}>
     
          <StatusBar
              barStyle={Platform.OS === 'android'? 'light-content':'light-content'}
              translucent={Platform.OS === 'android'}
              backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
            />

      <LinearGradient
        colors={['#0d64dd', '#0d64dd', '#0d64dd']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Showa</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.exploreIconContainer}
              onPress={toggleTheme}
            >
              <Icon 
                style={{ marginRight: 10 }}
                name={isDark ? 'moon' : 'sunny'}
                size={25} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('EssentialPlatforms')}
              style={styles.exploreIconContainer}
            >
              <Icon name="compass-outline" size={27} color="#fff" style={{ marginRight: 25 }} />
              <View style={styles.exploreBadge}>
                <Text style={[styles.exploreBadgeText,{fontWeight:'800'}]}>Explore</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCameraLaunch}>
              <Icon name="camera-outline" size={25} color="#fff" style={{ marginRight: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
              <Icon name="ellipsis-vertical" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Dropdown for Android */}
        
          {Platform.OS === 'android' && showDropdown && (
            <View style={[styles.dropdownContainer]}>
              <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.dropdownOverlay} />
              </TouchableWithoutFeedback>
              
              <View style={[
                styles.dropdownMenu, 
                { 
                  backgroundColor: colors.backgroundSecondary, 
                  borderColor: colors.border, 
                  top: 65 + insets.top, // Adjust for safe area
                  right: 20,
                }
              ]}>
                {renderDropdownContent()}
              </View>
            </View>
          )}
        
        {/* Dropdown Modal for iOS */}
        <DropdownModal 
          visible={showDropdown && Platform.OS === 'ios'} 
          onClose={() => setShowDropdown(false)}
          dropdownPosition={dropdownPosition}
        >
          {renderDropdownContent()}
        </DropdownModal>
        
        <SwitchAccountSheet
          showConfirmSwitch={showConfirmSwitch}
          setShowConfirmSwitch={setShowConfirmSwitch}
          pendingSwitchTo={pendingSwitchTo}
          switchAccount={switchAccount}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        
        <View style={styles.tabRow}>
          {['Chats', 'Status', 'Calls'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                if (item === 'Status') {
                  navigation.navigate('PStatusBar');
                } else if (item === 'Calls') {
                  navigation.navigate('BCalls');
                } else {
                  setTab(item);
                }
              }}
            >
              <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
              {tab === item && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
      <FlatList
        data={filteredChatList}
        keyExtractor={(item) => `${item.id}-${item.type}-${item.unread_count}`}
        extraData={chatList}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        ListHeaderComponent={() => (
          <>
            <View style={[styles.searchBox]}>
              <Icon name="search" size={20} color="#666" style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Search or start new chat"
                style={styles.searchInput}
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.sectionTabs}>
              <Text style={[styles.sectionTab, { fontWeight: '600', color: '#0d64dd' }]}>
                {searchQuery ? 'SEARCH RESULTS' : 'ALL CHATS'}
              </Text>
             
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              markMessagesAsRead(item.id, item.type);
              if (item.type === 'group') {
                navigation.navigate('PrivateChat', {
                  groupId: item.id,
                  groupSlug: item.group_slug,
                  name: item.name,
                  chatType: 'group',
                  profile_image: item.avatar,
                  members_count: item.members_count,
                  creator_id: item.creator_id,
                });
              } else {
                navigation.navigate('PrivateChat', {
                  receiverId: item.receiverId || item.id,
                  name: item.name,
                  chatType: 'single',
                  profile_image: item.avatar,
                });
              }
            }}
            style={[styles.chatItem]}
          >
            <Image
              source={
                item.avatar
                  ? { uri: item.avatar }
                  : item.type === 'group'
                  ? { uri: 'https://cdn2.iconfinder.com/data/icons/facebook-51/32/FACEBOOK-11-1024.png' }
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={[styles.avatar,{ borderColor: colors.border }]}
              onError={() => console.log('Failed to load image for chat:', item.id)}
            />
            <View style={styles.chatContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.chatName,{ color: colors.text }]} numberOfLines={1}>
                  {highlightSearchText(item.name, searchQuery) ||
                    (item.type === 'group' ? 'Group Chat' : 'Unnamed Chat')}
                </Text>
                {item.type === 'group' && (
                  <>
                    <Icon name="people-outline" size={16} color="#666" style={{ marginLeft: 6 }} />
                    <Text style={[styles.memberCountText]}>{item.members_count || 0}</Text>
                    {item.is_creator && (
                      <Icon name="star" size={14} color="#FFD700" style={{ marginLeft: 4 }} />
                    )}
                  </>
                )}
              </View>
              <Text style={[styles.chatMessage,{color:colors.textSecondary}]} numberOfLines={1}>
                {highlightSearchText(
                  item.content ||
                    (item.type === 'group'
                      ? item.is_creator
                        ? 'You created this group'
                        : 'No messages yet'
                      : '[No message]'),
                  searchQuery
                )}
              </Text>
            </View>
            <View style={styles.timeBadgeContainer}>
              <Text style={styles.chatTime}>{item.time || ''}</Text>
              {(!readChats.has(`${item.id}-${item.type}`) && item.unread_count > 0) && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.unread_count > 9 ? '9+' : item.unread_count}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          isInitialLoading ? (
            <Text style={[styles.emptyText, { marginTop: 80, textAlign: 'center' }]}>
              Loading chats...
            </Text>
          ) : error ? (
            <View style={styles.emptyList}>
              <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
              <TouchableOpacity onPress={fetchChatList}>
                <Text style={[styles.emptyText, { color: '#0d64dd' }]}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
           

            <View style={styles.emptyList}>
          {searchQuery ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.emptyText}>No matching found</Text>
              <TouchableOpacity onPress={() => navigation.navigate("ChatAi")}>
                <Text style={styles.askAiText}>Ask Showa Ai </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Icon name="chatbubbles-outline" size={60} color="#D1D5DB" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyText}>You have no chats available</Text>
              <TouchableOpacity
                style={styles.startChatButton}
                onPress={()=>navigation.navigate('UserContactListPersonalAccount')}
                
              >
                
                <Icon name="add-comment" size={20} color="#fff" />
                <Text style={styles.startChatText}>Start New Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

          )
        )}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isLoading}
        //     onRefresh={fetchChatList}
        //     colors={['#0d64dd']}
        //     tintColor="#0d64dd"
        //   />
        // }
      />
      <BottomNav navigation={navigation} setShowAccountModal={setShowAccountModal} />
      <IncomingCallModal
        visible={showIncomingCallModal}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        profileImage={callerInfo.profileImage}
        callerName={callerInfo.name}
      />
    
    {/* switch modal =======================================*/}
     <Modal
        visible={showAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeAnim,
          }}
        >
          <View
            style={{
              width: '88%',
              backgroundColor: colors.backgroundSecondary,
              borderRadius: 18,
              paddingVertical: 28,
              paddingHorizontal: 22,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowAccountModal(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: isDark ? colors.background : '#f5f5f5',
                borderRadius: 50,
                padding: 8,
              }}
            >
              <Icon name="close" size={22} color={isDark ? colors.text : '#333'} />
            </TouchableOpacity>

            {/* Header */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 8,
                textAlign: 'center',
                padding: 20
              }}
            >
              Choose Your Showa Experience
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: 25,
              }}
            >
              Switch between <Text style={{ fontWeight: '600', color: '#9704e0' }}>e-Vibbz</Text> (short videos)
              and <Text style={{ fontWeight: '600', color: '#0d6efd' }}>e-Broadcast</Text> (posts & updates)
            </Text>

            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: '#9704e0',
                marginBottom: 12,
              }}
              onPress={() => {
                navigation.navigate('SocialHome');
                setShowAccountModal(false);
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Vibbz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: '#0d6efd',
                marginBottom: 12,
              }}
              onPress={() => {
                navigation.navigate('BroadcastHome');
                setShowAccountModal(false);
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Broadcast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: isDark ? colors.background : '#f1f1f1',
              }}
              onPress={() => {
                setShowDropdown(false);
                setPendingSwitchTo('business');
                setShowConfirmSwitch(true);
                setShowAccountModal(false);
              }}
            >
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: isDark ? colors.text : '#333' 
              }}>
                Switch Account
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

     <Modal
  visible={showMediaModal}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowMediaModal(false)}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mediaModalContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <View style={styles.mediaPreviewContainer}>
        {media?.type?.includes('video') ? (
          <Video
            source={{ uri: media.uri }}
            style={styles.mediaPreview}
            resizeMode="cover"
            repeat
            muted
          />
        ) : (
          <Image source={{ uri: media?.uri }} style={styles.mediaPreview} />
        )}
        
        <TextInput
          style={[styles.captionInput, {color: '#000'}]}
          placeholder="Add caption to your status (optional)"
          value={caption}
          placeholderTextColor="#777"
          onChangeText={setCaption}
          multiline
          returnKeyType="done"
          blurOnSubmit={true}
        />
        
        <View style={styles.mediaActionButtons}>
          <TouchableOpacity
            style={[styles.mediaButton, styles.cancelButton]}
            onPress={() => {
              setMedia(null);
              setCaption('');
              setShowMediaModal(false);
              Keyboard.dismiss();
            }}
          >
            <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mediaButton, styles.postButton]}
            onPress={() => {
              Keyboard.dismiss();
              handlePostStatus(media, caption);
              setShowMediaModal(false);
            }}
          >
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
</Modal>
      {/* <TouchableOpacity
              style={styles.fab}
              onPress={() => {
                navigation.navigate('ChatAi');
                
              }}
            >
               <Text style={{color:'#fff', fontFamily:'PTSerif-Bold', fontSize:20}}>Ai</Text>
              
            </TouchableOpacity> */}
      <TouchableOpacity
        style={[styles.fabAi]}
        onPress={() => navigation.navigate('ChatAi')}
        //onPress={() => navigation.navigate('Earnings')}
      >
        <Text style={{color:'#fff', fontWeight:'600', fontSize:20}}>Ai</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UserContactListPersonalAccount')}
       // onPress={() => navigation.navigate('ChatAi')}
      >
        <Icon name="add" size={24} color="#0d64dd" />
      </TouchableOpacity>
      {/* <PinUnlockModal navigation={navigation} /> */}
      {/* <EarningFloatingButton navigation={navigation} /> */}
    </View>
  );
};

const createStyles = (colors, insets, isDark)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 8,
     backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 1000,
    borderColor: colors.border,
    borderStyle: 'solid',
  },
  fabAi: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#0d64dd',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 1000,
    borderColor: colors.border,
    borderStyle: 'solid',
  },

//   header: {
//   paddingHorizontal: 0,
//   paddingBottom: 16,

//   // iOS — no paddingTop (SafeAreaView handles it)
//   // Android — add small padding
//   paddingTop: Platform.OS === 'android' ? 14 : 0,

//   borderBottomLeftRadius: 20,
//   borderBottomRightRadius: 20,

//   backgroundColor: '#0d64dd',

//   // iOS shadow
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 6 },
//   shadowOpacity: 0.03,
//   shadowRadius: 4,

//   // Android shadow
//   elevation: 6,

//   zIndex: 1000,
// },

header: {
  paddingBottom: Platform.OS === 'android' ? 16 : 0,
  paddingTop: Platform.OS === 'android' ? 14 : 0,
  borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
  borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
  backgroundColor: '#0d64dd',
  elevation: 2,
  zIndex: 1000,
},

  headerTop: {
    paddingTop: insets.top,
    //height:Platform.OS === 'android' ? 56 : 70,
    height: insets.top + 60, 
    paddingHorizontal: Platform.OS === 'android'? 20: 20,
    paddingVertical:Platform.OS === 'android'? 0 : 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  timeBadgeContainer: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  badge: {
    backgroundColor: '#0d64dd',
    borderRadius: 50,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    borderWidth: 0.5,
    borderColor: colors.border,
    minWidth: 180,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'SourceSansPro-Regular',
  },
  
  headerTitle: {
    color: '#fff',
    fontSize:Platform.OS === 'android' ? 28 : 35,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  tabText: {
    color: '#e6e6e6',
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    paddingVertical: 6,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 48,
    elevation: 0.5,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 6,
      
    zIndex: 500,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    color: '#333',
    paddingRight: 8,
  },
  sectionTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionTab: {
    fontSize: 14,
    fontFamily: 'SourceSansPro-SemiBold',
    color: '#666',
  },
   chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 0.5,
     shadowColor: '#000',
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 6,
    borderWidth: 0.2,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: '#1a1a1a',
  },
  chatMessage: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: '#666',
  },
  chatTime: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: '#888',
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: '#666',
  },
  // Dropdown styles
  dropdownContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 10000,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 200,
    maxWidth: 250,
  },
  
  dropdownMenuIOS: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 200,
    maxWidth: 300,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 80 : 80, 
    paddingRight: 20,
  },
  
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'SourceSansPro-Regular',
  },
  
  dropdownTouchable: {
    paddingVertical: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0d64dd',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  memberCountText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  mediaModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
   
  },
  mediaPreviewContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  mediaPreview: {
    width: '100%',
    height: 300,
    borderRadius: 5,
    marginBottom: 15,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    minHeight: 50,
    marginBottom: 15,
  },
  mediaActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  postButton: {
    backgroundColor: '#0d64dd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 24,
    fontFamily: 'SourceSansPro-Bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  noteText: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dismissBtn: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginRight: 10,
  },
  dismissText: {
    textAlign: 'center',
    color: '#666',
  },
  allowBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#0d64dd',
    flex: 1,
    marginLeft: 10,
  },
  allowText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0d64dd',
    marginVertical: 10,
  },
  closeBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#0d64dd',
    marginTop: 20,
    alignSelf: 'center',
    minWidth: 100,
  },
  closeText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  processingText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  exploreIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  exploreBadge: {
    position: 'absolute',
    top: -9,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exploreBadgeText: {
    color: '#0d64dd',
    fontSize: 9,
    textTransform: 'uppercase',
    fontFamily: 'Lato-Black',
    letterSpacing: 0.3,
  },
});

export default HomeScreen;


