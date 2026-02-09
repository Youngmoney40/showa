// import React, { useState, useEffect, Profiler, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Modal,
//   Animated,
//   ScrollView,
//   StatusBar,
//   ActivityIndicator,
//   Button,
//   PermissionsAndroid,
//   Platform,
//   Alert,
//   Linking,
//   AppState,
//   Dimensions,
//   TouchableWithoutFeedback
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import BottomNav from '../components/BottomNavBusiness';
// import { Divider } from 'react-native-paper';
// import SwitchAccountSheet from '../components/SwitchAccountSheet';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import LottieView from 'lottie-react-native';
// import IncomingCallModal from '../components/IncomingCallModal';
// //import PushNotification from 'react-native-push-notification';
// import NotificationService from '../src/services/PushNotifications';
// import Video from 'react-native-video';
// const windowWidth = Dimensions.get('window').width;
// const HomeScreen = ({ navigation }) => {
//   const [tab, setTab] = useState('Chats');
//   const [userData, setUserData] = useState([]);
//   const [chatList, setChatList] = useState([]);
//   const [showStartChatModal, setShowStartChatModal] = useState(false);
//   const [hasDismissedModal, setHasDismissedModal] = useState(false);
//   const [showAccountModal, setShowAccountModal] = useState(false);
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [accountMode, setAccountMode] = useState('business');
//   const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
//   const [pendingSwitchTo, setPendingSwitchTo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [filteredChatList, setFilteredChatList] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [media, setMedia] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [showMediaModal, setShowMediaModal] = useState(false);
//   const [readChats, setReadChats] = useState(new Set());
//   const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const insets = useSafeAreaInsets();




     
 
 
// const [notificationSettings, setNotificationSettings] = useState({
//   showNotifications: true,
//   doNotDisturb: false,
// });
// useEffect(() => {
//   loadNotificationSettings();
// }, []);
// const loadNotificationSettings = async () => {
//   try {
//     const settings = await AsyncStorage.getItem('notificationSettings');
//     if (settings) {
//       setNotificationSettings(JSON.parse(settings));
//     }
//   } catch (error) {
//     console.log('Error loading notification settings:', error);
//   }
// };
//   /// =========== HANDLE INCOMING CALL ============================================
//   const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
//     const [callerInfo, setCallerInfo] = useState({
//       profileImage: '',
//       name: 'Unknown',
//       offer: null // Store the WebRTC offer
//     });
 
//      const ws = useRef(null);
 
    
 
//   // useEffect(() => {
//   //   const connectCallWebSocket = async () => {
//   //     try {
//   //       const token = await AsyncStorage.getItem('userToken');
//   //       const retrieveUserId = await AsyncStorage.getItem('userData');
//   //       const userData = JSON.parse(retrieveUserId);
//   //       const currentUserId = userData.id;
//   //       const ROOM_ID = `user-${currentUserId}`;
//   //       const SIGNALING_SERVER = 'wss://showa.essential.com.ng';
       
//   //       const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;
//   //       ws.current = new WebSocket(url);
 
//   //       ws.current.onopen = () => {
//   //         //console.log('[HomeScreen WebSocket] Connected for incoming calls');
//   //       };
 
//   //       ws.current.onmessage = async (evt) => {
//   //         let data;
//   //         try {
//   //           data = JSON.parse(evt.data);
//   //           console.log('caller__data__2',data)
//   //         } catch (e) {
//   //           console.error('[WebSocket] Invalid message format:', e);
//   //           return;
//   //         }
 
//   //         if (data.type === 'offer') {
//   //           console.log('[Signaling] Incoming call offer received');
           
//   //           // Check if this offer is intended for the current user
//   //           if (data.offer.targetUserId && data.offer.targetUserId !== currentUserId) {
//   //             console.log('[Signaling] Call not intended for this user, ignoring');
//   //             return;
//   //           }
           
//   //           const callerData = data.offer.callerInfo || {
//   //             profileImage: data.offer.profileImage || '',
//   //             name: data.offer.callerName || 'Unknown Caller'
//   //           };
 
//   //           console.log('caller__data',callerData)
           
//   //           setCallerInfo({
//   //             profileImage: callerData.profileImage,
//   //             name: callerData.name,
//   //             offer: data.offer 
//   //           });
//   //           setShowIncomingCallModal(true); 
//   //         }
//   //       };
 
//   //       ws.current.onclose = () => {
//   //         console.log('[WebSocket] Disconnected');
//   //       };
 
//   //       ws.current.onerror = (err) => {
//   //         console.error('[WebSocket] Error:', err);
//   //       };
//   //     } catch (error) {
//   //       console.error('Failed to connect to WebSocket:', error);
//   //     }
//   //   };
 
//   //   connectCallWebSocket();
 
//   //   return () => {
//   //     if (ws.current) {
//   //       ws.current.close();
//   //     }
//   //   };
//   // }, []);

//   useEffect(() => {
//   const connectCallWebSocket = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const retrieveUserId = await AsyncStorage.getItem('userData');

//       if (!token || !retrieveUserId) {
//         console.warn('Missing auth data, websocket not started');
//         return;
//       }

//       const userData = JSON.parse(retrieveUserId);
//       const currentUserId = userData.id;
//       const ROOM_ID = `user-${currentUserId}`;
//       const SIGNALING_SERVER = 'wss://showa.essential.com.ng';

//       const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

//       ws.current = new WebSocket(url);
//       ws.current.binaryType = 'arraybuffer';

//       ws.current.onopen = () => {
//         console.log('[Call WS] Connected');
//       };

//       ws.current.onmessage = (evt) => {
//         let data;
//         try {
//           data = JSON.parse(evt.data);
//         } catch (e) {
//           console.error('[WS] Invalid JSON', e);
//           return;
//         }

//         if (data.type === 'offer') {
//           if (
//             data.offer?.targetUserId &&
//             data.offer.targetUserId !== currentUserId
//           ) {
//             return;
//           }

//           const callerData = data.offer.callerInfo || {
//             profileImage: data.offer.profileImage || '',
//             name: data.offer.callerName || 'Unknown Caller',
//           };

//           setCallerInfo({
//             profileImage: callerData.profileImage,
//             name: callerData.name,
//             offer: data.offer,
//           });

//           setShowIncomingCallModal(true);
//         }
//       };

//       ws.current.onerror = (e) => {
//         console.error('[Call WS] Error', e);
//       };

//       ws.current.onclose = (e) => {
//         console.log('[Call WS] Closed', e.code, e.reason);
//       };
//     } catch (err) {
//       console.error('[Call WS] Failed to connect', err);
//     }
//   };

//   connectCallWebSocket();

//   return () => {
//     ws.current?.close();
//   };
// }, []);

 
//     // Send message via WebSocket
//     const sendMessage = (msg) => {
//       if (ws.current?.readyState === WebSocket.OPEN) {
//         //console.log('[Signaling] Sending message:', msg.type);
//         ws.current.send(JSON.stringify(msg));
//       }
//     };
 
//     // Handle incoming call acceptance
//     // const handleAcceptCall = () => {
//     // // Send acceptance message
//     // sendMessage({ type: 'answer', answer: 'accepted' });
     
//     // // Navigate to VoiceCallScreen with the offer data
//     // navigation.navigate('VoiceCalls', {
//     // profile_image: callerInfo.profileImage,
//     // name: callerInfo.name,
//     // incomingOffer: callerInfo.offer, 
//     // isIncomingCall: true
//     // });
     
//     // setShowIncomingCallModal(false);
//     // };
//     const handleAcceptCall = () => {
//     // Send acceptance message if needed
//     // sendMessage({ type: 'answer', answer: 'accepted' });
   
//     // Navigate to VoiceCallScreen with the offer data
//     navigation.navigate('VoiceCalls', {
//       profile_image: callerInfo.profileImage,
//       name: callerInfo.name,
//       incomingOffer: callerInfo.offer, // Pass the complete offer object
//       isIncomingCall: true,
//       isInitiator: false // Important: mark as not initiator
//     });
   
//     setShowIncomingCallModal(false);
//   };
 
//     // Handle incoming call rejection
//     // const handleRejectCall = () => {
//     // sendMessage({ type: 'call-ended' });
//     // setShowIncomingCallModal(false);
//     // setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
//     // };
//     const handleRejectCall = () => {
//     sendMessage({ type: 'call-ended' });
//     setShowIncomingCallModal(false);
//     setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
//   };
 
 
//     /// CALL END HERE ==============================
 
//   // Handle incoming call acceptance
//     // const handleAcceptCall = () => {
//     // setShowIncomingCallModal(false);
//     // navigation.navigate('VoiceCallScreen', {
//     // profile_image: callerInfo.profileImage,
//     // name: callerInfo.name,
//     // });
//     // };
 
//     // // Handle incoming call rejection
//     // const handleRejectCall = () => {
//     // setShowIncomingCallModal(false);
//     // setCallerInfo({ profileImage: '', name: 'Unknown' });
//     // };
 
//     // Simulate receiving caller info (you'll need to integrate with your WebSocket logic)
//     // useEffect(() => {
//     // // This is a placeholder. In a real implementation, the WebSocket in IncomingCallModal
//     // // will trigger this when an offer is received. For now, simulate an incoming call for testing.
//     // const simulateIncomingCall = setTimeout(() => {
//     // setCallerInfo({
//     // profileImage: '../assets/images/dad.jpg', // Replace with actual profile image path
//     // name: 'John Doe', // Replace with actual caller name
//     // });
//     // setShowIncomingCallModal(true);
//     // }, 5000); // Simulate after 5 seconds
 
//     // return () => clearTimeout(simulateIncomingCall);
//     // }, []);
 
 
 
//     // const handleSyncContacts = async () => {
//     // setIsSyncing(true);
//     // const authToken = await AsyncStorage.getItem('userToken');
     
//     // if (!authToken) {
//     // Alert.alert('Error', 'Please login first.');
//     // setIsSyncing(false);
//     // return;
//     // }
 
//     // try {
//     // const result = await syncContacts(authToken);
//     // console.log('Contact sync successful:', result.data);
 
//     // if (result.success) {
//     // const message =
//     // result.syncedContacts > 0
//     // ? `${result.syncedContacts} of your contacts are now connected and ready to chat.`
//     // : 'No matching contacts were found. Invite your friends to join the app!';
 
//     // setSyncComplete(true);
//     // setTimeout(() => {
//     // setModalVisible(false);
//     // navigation.navigate('UserContactListPersonalAccount');
//     // }, 2000);
//     // } else {
//     // Alert.alert('Error', result.error || 'Failed to sync contacts.');
//     // }
//     // } catch (error) {
//     // console.log('Sync error:', error.message);
//     // Alert.alert('Error', 'An error occurred while syncing your contacts.');
//     // } finally {
//     // setIsSyncing(false);
//     // }
//     // };
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
//       const mode = await AsyncStorage.getItem('accountMode') || 'business';
//       setAccountMode(mode);
//     };
//     loadMode();
//   }, []);
 
//   const fetchUserData = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.get(`${API_ROUTE}/get-users/`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });
   
//     if (response.status === 200 || response.status === 201) {
//       // Remove duplicate users based on ID
//       const uniqueUsers = response.data.filter(
//         (user, index, self) => index === self.findIndex((u) => u.id === user.id)
//       );
//       setUserData(uniqueUsers);
//     } else {
//       console.error('Failed to fetch users:', response.status);
//     }
//   } catch (error) {
//     console.log('Error fetching users:', error.message);
//   }
// };
// const CHAT_CACHE_KEY = 'cached_chat_list_business';
// const READ_CHATS_KEY = 'read_chats_business';
// const loadReadChats = async () => {
//   try {
//     const stored = await AsyncStorage.getItem(READ_CHATS_KEY);
//     if (stored) {
//       setReadChats(new Set(JSON.parse(stored)));
//     }
//   } catch (e) {
//     console.error('Load read chats error:', e);
//   }
// };
// const saveReadChats = async () => {
//   try {
//     await AsyncStorage.setItem(READ_CHATS_KEY, JSON.stringify(Array.from(readChats)));
//   } catch (e) {
//     console.error('Save read chats error:', e);
//   }
// };
// useEffect(() => {
//   saveReadChats();
// }, [readChats]);
// const loadCachedChats = async () => {
//   try {
//     const cached = await AsyncStorage.getItem(CHAT_CACHE_KEY);
//     if (cached) {
//       const parsed = JSON.parse(cached);
//       setChatList(parsed);
//       setFilteredChatList(parsed);
//       return true;
//     }
//   } catch (e) {
//     console.error('Load cache error:', e);
//   }
//   return false;
// };
// const cacheChats = async (chats) => {
//   try {
//     await AsyncStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(chats));
//   } catch (e) {
//     console.error('Cache chats error:', e);
//   }
// };
// useEffect(() => {
//   async function loadCache() {
//     setIsInitialLoading(true);
//     await loadReadChats();
//     const hasCache = await loadCachedChats();
//     if (hasCache) {
//       setChatList(prev =>
//         prev.map(chat =>
//           readChats.has(`${chat.id}-${chat.type}`) ? { ...chat, unread_count: 0 } : chat
//         )
//       );
//       setFilteredChatList(prev =>
//         prev.map(chat =>
//           readChats.has(`${chat.id}-${chat.type}`) ? { ...chat, unread_count: 0 } : chat
//         )
//       );
//     }
//     setIsInitialLoading(false);
//   }
//   loadCache();
// }, []);
// const fetchChatList = async () => {
//   setIsLoading(true);
//   setError(null);
//   const token = await AsyncStorage.getItem('userToken');
//   try {
//     const response = await axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     //console.log('fetch chat messageing ',response.data);
//     // Filter out only channels, keep personal chats and group chats
//     const filteredChats = response.data.chats.filter(chat =>
//       chat.type !== 'channel' 
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
//       members_count: chat.members_count,
//       receiverId: chat.type === 'single' ? chat.id : null,
//       group_slug: chat.group_slug || null
//     }));
//     setChatList(chats);
//     setFilteredChatList(chats);
//     cacheChats(chats);
//     console.log('Chats (excluding channels):', chats);
//   } catch (err) {
//     console.error('Failed to load chat list:', err.response?.data || err.message);
//     setError('Failed to load chats. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };
// // const markMessagesAsRead = async (chatId, chatType) => {
// // try {
// // const token = await AsyncStorage.getItem('userToken');
// // await axios.post(`${API_ROUTE}/chatmessage/mark-read/`, {
// // chat_id: chatId,
// // chat_type: chatType
// // }, {
// // headers: {
// // 'Authorization': `Bearer ${token}`,
// // }
// // });
// // // Update local state to reflect read status
// // setChatList(prevChats =>
// // prevChats.map(chat =>
// // chat.id === chatId ? {...chat, unread_count: 0} : chat
// // )
// // );
// // } catch (error) {
// // console.error('Error marking messages as read:', error);
// // }
// // };
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
//   // useEffect(() => {
//   // let isMounted = true;
//   // fetchChatList().then(() => {
//   // if (isMounted) {
//   // }
//   // });
//   // return () => {
//   // isMounted = false;
//   // };
//   // }, []);
//   // useFocusEffect(
//   // useCallback(() => {
//   // let isMounted = true;
     
//   // const loadData = async () => {
//   // try {
//   // await fetchChatList();
//   // await fetchUserData();
//   // } catch (error) {
//   // console.error('Focus effect error:', error);
//   // }
//   // };
 
//   // loadData();
 
//   // return () => {
//   // isMounted = false;
//   // };
//   // }, [])
//   // );
//   useFocusEffect(
//     useCallback(() => {
//       fetchChatList();
//       fetchUserData();
//     }, [])
//   );
//   useEffect(() => {
//   const interval = setInterval(() => {
//     fetchChatListSilently();
//   }, 30000); // Refresh every 30 seconds
//   return () => clearInterval(interval);
// }, []);
// // const fetchChatListSilently = async () => {
// // try {
// // const token = await AsyncStorage.getItem('userToken');
// // if (!token) return;
// // const response = await axios.get(
// // `${API_ROUTE}/api/chat/list/?account_mode=${accountMode}`,
// // {
// // headers: {
// // 'Authorization': `Bearer ${token}`,
// // },
// // }
// // );
// // // Process the response without triggering loading states
// // const filteredChats = response.data.chats.filter(chat =>
// // chat.type !== 'channel'
// // );
// // const uniqueChats = [];
// // const seenIds = new Set();
   
// // filteredChats.forEach((chat) => {
// // const chatIdentifier = chat.type === 'single'
// // ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
// // : chat.group_slug || chat.id;
     
// // if (!seenIds.has(chatIdentifier)) {
// // seenIds.add(chatIdentifier);
// // uniqueChats.push({
// // ...chat,
// // id: chatIdentifier,
// // unread_count: chat.unread_count || 0,
// // name: chat.name || 'Unknown',
// // content: chat.content || '[media]',
// // time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// // avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
// // type: chat.type,
// // members_count: chat.members_count,
// // receiverId: chat.type === 'single' ? chatIdentifier : null,
// // group_slug: chat.group_slug || null
// // });
// // }
// // });
// // // Update state silently if there are changes
// // setChatList(prevChats => {
// // if (JSON.stringify(prevChats) !== JSON.stringify(uniqueChats)) {
// // return uniqueChats;
// // }
// // return prevChats;
// // });
// // setFilteredChatList(prevFiltered => {
// // if (searchQuery.trim() === '') {
// // return uniqueChats;
// // }
// // return prevFiltered;
// // });
// // } catch (err) {
// // // console.error('Silent refresh error:', err);
// // }
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
//         cacheChats(uniqueChats);
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
// // useEffect(() => {
// // // Handle notification opens
// // PushNotification.popInitialNotification((notification) => {
// // if (notification && notification.data) {
// // handleNotificationTap(notification.data);
// // }
// // });
// // // Listen for notification opens
// // const notificationListener = PushNotification.onNotificationOpened((notification) => {
// // if (notification && notification.data) {
// // handleNotificationTap(notification.data);
// // }
// // });
// // return () => {
// // notificationListener.remove();
// // };
// // }, []);
// // useEffect(() => {
// //   PushNotification.configure({
// //     onNotification: function (notification) {
// //       console.log("NOTIFICATION:", notification);
// //       // Check if user tapped the notification
// //       if (notification.userInteraction && notification.data) {
// //         handleNotificationTap(notification.data);
// //       }
// //       // iOS only
// //       if (typeof notification.finish === "function") {
// //         notification.finish();
// //       }
// //     },
// //     permissions: {
// //       alert: true,
// //       badge: true,
// //       sound: true,
// //     },
// //     popInitialNotification: true,
// //     requestPermissions: Platform.OS === "ios",
// //   });
// // }, []);
// // useEffect(() => {
// // // Handle initial notification
// // PushNotification.popInitialNotification((notification) => {
// // if (notification && notification.data) {
// // handleNotificationTap(notification.data);
// // }
// // });
// // // Listen for notification events
// // const notificationListener = PushNotification.addEventListener('notification', (notification) => {
// // if (notification && notification.data) {
// // handleNotificationTap(notification.data);
// // }
// // });
// // const registerListener = PushNotification.addEventListener('register', (token) => {
// // console.log('TOKEN:', token);
// // });
// // return () => {
// // notificationListener.remove();
// // registerListener.remove();
// // };
// // }, []);
// const handleNotificationTap = (data) => {
//   if (data.chatId && data.chatType) {
//     if (data.chatType === 'group') {
//       navigation.navigate('BusinessGroupChat', {
//         groupId: data.chatId,
//         groupSlug: data.group_slug,
//         name: data.name,
//         chatType: 'group',
//         profile_image: data.avatar,
//         members_count: data.members_count,
//       });
//     } else {
//       navigation.navigate('BPrivateChat', {
//         receiverId: data.chatId,
//         name: data.name,
//         chatType: 'single',
//         profile_image: data.avatar,
//       });
//     }
//   }
// };
// // Add this to your component
// // useEffect(() => {
// //   const handleAppStateChange = (nextAppState) => {
// //     if (nextAppState === 'active') {
// //       // Clear notifications when app comes to foreground
// //       PushNotification.removeAllDeliveredNotifications();
// //     }
// //   };
// //   AppState.addEventListener('change', handleAppStateChange);
// //   return () => {
// //     AppState.removeEventListener('change', handleAppStateChange);
// //   };
// // }, []);
//    useEffect(() => {
   
//     if (!isInitialLoading && chatList.length === 0 && !hasDismissedModal) {
//       fetchUserData();
//       setShowStartChatModal(true);
//     }
//   }, [chatList, isInitialLoading, hasDismissedModal]);
 
 
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
//   const fetchProfile = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.get(`${API_ROUTE}/profiles/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (response.status === 200 || response.status === 201) {
//       const profile = response.data;
//       console.log('Fetched profile:', profile);
//       return profile;
//     } else {
//       console.warn('Failed to fetch profile');
//       return null;
//     }
//   } catch (err) {
//     console.error('fetchProfile error:', err);
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
     
//       if (profile && profile.name && profile.name.trim() !== '') {
//         navigation.navigate('BusinessHome');
//       } else {
//         navigation.navigate('BusinessSetup');
//         console.log('user profile details set up to date', profile)
//       }
//     }
//   } finally {
//     setIsLoading(false);
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
// // return (
// // <View style={styles.fullScreenLoading}>
// // <ActivityIndicator size="large" color="#0d64dd" />
// // </View>
// // );
// // }
//   const handleCameraLaunch = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const cameraPermission = await PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
       
//         if (!cameraPermission) {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Camera Permission',
//               message: 'App needs access to your camera',
//               buttonPositive: 'OK',
//               buttonNegative: 'Cancel',
//             }
//           );
         
//           if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             Alert.alert(
//               'Permission Required',
//               'Camera permission is required to take photos',
//               [
//                 {
//                   text: 'Cancel',
//                   style: 'cancel',
//                 },
//                 {
//                   text: 'Open Settings',
//                   onPress: () => Linking.openSettings(),
//                 },
//               ]
//             );
//             return;
//           }
//         }
//       }
 
//       // Launch camera after permission is granted=====================
//       const response = await launchCamera({
//         mediaType: 'mixed',
//         quality: 0.7,
//         includeBase64: false,
//         saveToPhotos: true,
//         cameraType: 'back',
//       });
 
//       if (response.didCancel) {
//         console.log('User cancelled camera');
//       } else if (response.errorCode) {
//         console.log('Camera Error:', response.errorMessage);
//         Alert.alert('Error', response.errorMessage || 'Failed to access camera');
//       } else if (response.assets?.[0]) {
//         const mediaData = {
//           uri: response.assets[0].uri,
//           type: response.assets[0].type || 'image/jpeg',
//           fileName: response.assets[0].fileName || `photo_${Date.now()}.jpg`,
//         };
//         setMedia(mediaData);
//         setShowMediaModal(true);
//       }
//     } catch (error) {
//       console.error('Camera launch error:', error);
//       Alert.alert('Error', 'Failed to launch camera');
//     }
//   };
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
   
//     return response.data;
//   } catch (error) {
//     //console.error('Post error:', error);
//     Alert.alert('Error', 'Failed to post status');
//     throw error;
//   }
// };
// const handleOohmail = () =>{
//   Linking.openURL('https://ooshmail.com');
// }
// const ellipsisRef = useRef(null);
// const toggleDropdown = () => {
//   if (showDropdown) {
//     setShowDropdown(false);
//   } else {
//     ellipsisRef.current?.measure((fx, fy, width, height, px, py) => {
//       setButtonLayout({ x: px, y: py, width, height });
//       setShowDropdown(true);
//     });
//   }
// };
//   return (
//     <View style={[styles.container, { backgroundColor: '#f5f7fa' }]}>
//         <StatusBar
//           barStyle={Platform.OS === 'android'? 'light-content':'light-content'}
//           translucent={Platform.OS === 'android'}
//           backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
//         />
        
//       {/* <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       > */}
//         {/* Header with Gradient start===============================================================*/}
//         <LinearGradient
//           colors={['#0d64dd', '#0d64dd', '#0d64dd']}
//           style={[styles.header,]}
//         >
//           <View style={[styles.headerTop,{ paddingTop: insets.top }]}>
//             <Text style={styles.headerTitle}>Showa</Text>
//             <View style={styles.headerIcons}>
//               <TouchableOpacity
//                             style={styles.exploreIconContainer}
//                           >
//                              <Icon
//                              style={{marginRight:0}}
//                               name={'sunny'}
//                               size={26}
//                               color="#FFFFFF"
//                             />
                          
                           
//                           </TouchableOpacity>
//               {/*======= ooshMail Icon with Badge */}
//                           <TouchableOpacity onPress={handleOohmail} style={styles.exploreIconContainer}>
//                             <Icon name="compass-outline" size={27} color="#fff" style={{marginRight: 20}} />
//                             {/* ooshMail Badge =================*/}
//                             <View style={styles.exploreBadge}>
//                               <Text style={styles.exploreBadgeText}>e-Mail</Text>
//                             </View>
//                           </TouchableOpacity>
             
//                   <TouchableOpacity style={{ marginRight: 20 }} onPress={()=>navigation.navigate('SupplierNotificationScreen')}>
//                  <Icon name="chatbubble-ellipses-outline" size={24} color="#fff" />
//               </TouchableOpacity>
//                  {/* <TouchableOpacity onPress={handleCameraLaunch}>
//                    <Icon name="camera-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
//                  </TouchableOpacity> */}
            
//               <TouchableOpacity ref={ellipsisRef} onPress={toggleDropdown}>
//                 <Icon name="ellipsis-vertical" size={25} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <View style={styles.tabRow}>
//             {['Chats', 'Status', 'Calls'].map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 onPress={() => {
//                   if (item === 'Status') {
//                     navigation.navigate('BStatusBar');
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
//           {!searchQuery && <Text style={styles.sectionTab}></Text>}
//         </View>
// {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button
//         title="Switch to Business Account"
//         onPress={() => setShowConfirmSwitch(true)}
//       />
//       <SwitchAccountSheet
//         showConfirmSwitch={showConfirmSwitch}
//         setShowConfirmSwitch={setShowConfirmSwitch}
//         pendingSwitchTo={pendingSwitchTo}
//         switchAccount={switchAccount}
//         isLoading={isLoading}
//         setIsLoading={setIsLoading}
//       />
//     </View> */}
// <FlatList
//   data={filteredChatList}
//   keyExtractor={(item) => item.id}
//   renderItem={({ item }) => (
//     <TouchableOpacity
//       onPress={() => {
//         markMessagesAsRead(item.id, item.type);
//         console.log('groupd details', item)
       
//         if (item.type === 'group') {
//           navigation.navigate('BusinessGroupChat', {
//             groupId: item.id,
//             groupSlug: item.group_slug,
//             name: item.name,
//             chatType: 'group',
//             profile_image: item.avatar,
//             members_count: item.members_count,
//             creator_id: item.creator_id
//           });
//         } else {
//           navigation.navigate('BPrivateChat', {
//             receiverId: item.receiverId || item.id,
//             name: item.name,
//             chatType: 'single',
//             profile_image: item.avatar,
//           });
//         }
//       }}
//       style={styles.chatItem}
//     >
//       {/* <Image
//         source={{
//           uri: item.avatar
//             ? `${API_ROUTE_IMAGE}${item.avatar}`
//             : item.type === 'group'
//               ? 'https://via.placeholder.com/50/cccccc/808080?text=G'
//               : 'https://via.placeholder.com/50',
//         }}
//         style={styles.avatar}
//       /> */}
//       <Image
//                     source={
//                       item.avatar
//                         ? { uri: `${API_ROUTE_IMAGE}${item.avatar}` || item.avatar }
//                         : item.type === 'group'
//                         ? { uri: 'https://via.placeholder.com/50/cccccc/808080?text=G' }
//                         : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                     }
//                     style={styles.avatar}
//                     //onError={() => console.log('Failed to load image for chat:', item.id)}
//                   />
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
//         {/* {item.unread_count > 0 && (
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>
//               {item.unread_count > 9 ? '9+' : item.unread_count}
//             </Text>
//           </View>
//         )} */}
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
//     isLoading ? (
//       // <View style={styles.emptyList}>
//       // <ActivityIndicator size="small" color="#0d64dd" />
//       // <Text style={styles.emptyText}>
//       // {searchQuery ? 'Searching...' : 'Loading chats...'}
//       // </Text>
//       // </View>
//       <Text style={[styles.emptyText,{marginTop:80, textAlign:'center'}]}>Loading chats...</Text>
//     ) : error ? (
//       <View style={styles.emptyList}>
//         <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
//         <TouchableOpacity onPress={fetchChatList}>
//           <Text style={[styles.emptyText, {color: '#0d64dd'}]}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     ) : (
//       <View style={styles.emptyList}>
//         <Text style={styles.emptyText}>
//           {searchQuery ? 'No matching chats found' : 'No chats available'}
//         </Text>
//         {!searchQuery && (
//           <TouchableOpacity onPress={()=>{
//             setShowStartChatModal(true)
//             navigation.navigate('UserContactList');
//           }}>
//             <Text style={[styles.emptyText, {color: '#0d64dd'}]}>Start a new chat</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     )
//   )}
 
// />
//       {/* </ScrollView> */}
//       <BottomNav navigation={navigation} setShowAccountModal={setShowAccountModal} />
//        {/* Incoming Call Modal */}
//             <IncomingCallModal
//               visible={showIncomingCallModal}
//               onAccept={handleAcceptCall}
//               onReject={handleRejectCall}
//               profileImage={callerInfo.profileImage}
//               callerName={callerInfo.name}
//             />
     
// <Modal
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
//         style={[styles.captionInput, {color: '#000'}]}
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
//       <Modal
//         visible={showStartChatModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => {
//           setShowStartChatModal(false);
//           setHasDismissedModal(true);
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {/* <View>
//               <TouchableOpacity
//                 style={{justifyContent:'flex-end', alignItems:'flex-end', alignSelf:'flex-end', marginEnd:10}}
//                 onPress={() => {
//                   setShowStartChatModal(false);
//                   setHasDismissedModal(true);
//                 }}
//               >
//                 <Icon name="close" size={30} color="#333" />
//               </TouchableOpacity>
//             </View> */}
//              <LottieView
//                                     source={require("../assets/animations/Chat.json")}
//                                     autoPlay
//                                     loop={true}
//                                     style={styles.lottie}
//                                   />
//            <Text style={styles.modalTitle}>No Chats Yet</Text>
//             <Text style={styles.modalSubtitle}>
//               You haven’t started any conversations yet. Chat with friends to stay connected, or reach out to
//               customers to grow your business. Tap to get started.
//             </Text>
          
           
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 // setShowStartChatModal(false);
//                 // setHasDismissedModal(true);
//                 navigation.navigate('UserContactList');
//               }}
//             >
//               <Text style={styles.modalButtonText}>Get Started</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.modalButton, { backgroundColor: '#fff' }]}
//               onPress={() => {
//                 setShowStartChatModal(false);
//                 setHasDismissedModal(true);
              
//               }}
//             >
//               <Text style={[styles.modalButtonText,{color:'#333'}]}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//       {/* <Modal
//         visible={showConfirmSwitch}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowConfirmSwitch(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Switch Account</Text>
//             <Text style={styles.modalSubtitle}>
//               You are about to switch from your Personal account to {pendingSwitchTo} account.
//             </Text>
//             <TouchableOpacity
//               style={[styles.modalButton, { backgroundColor: '#0d64dd' }]}
//               onPress={async () => {
//                 setIsLoading(true);
//                 await switchAccount(pendingSwitchTo);
//                 setShowConfirmSwitch(false);
//               }}
//               disabled={isLoading}
//             >
//                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                               {isLoading && <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />}
//                               <Text style={styles.modalButtonText}>
//                                 {isLoading ? 'Switching...' : 'Yes, Switch'}
//                               </Text>
//                             </View>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.modalButton, { backgroundColor: '#eee' }]}
//               onPress={() => setShowConfirmSwitch(false)}
//               disabled={isLoading}
//             >
//               <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal> */}
//       <Modal
//         visible={showAccountModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAccountModal(false)}
//       >
//         <Animated.View
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0,0,0,0.6)',
//             justifyContent: 'center',
//             alignItems: 'center',
//             opacity: fadeAnim,
//           }}
//         >
//           <View
//             style={{
//               width: '88%',
//               backgroundColor: '#fff',
//               borderRadius: 18,
//               paddingVertical: 28,
//               paddingHorizontal: 22,
//               alignItems: 'center',
//               shadowColor: '#000',
//               shadowOpacity: 0.25,
//               shadowRadius: 10,
//               elevation: 8,
//             }}
//           >
//             {/* Close Button */}
//             <TouchableOpacity
//               onPress={() => setShowAccountModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 backgroundColor: '#f5f5f5',
//                 borderRadius: 50,
//                 padding: 8,
//               }}
//             >
//               <Icon name="close" size={22} color="#333" />
//             </TouchableOpacity>
     
//             {/* Header */}
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: '700',
//                 color: '#111',
//                 marginBottom: 8,
//                 textAlign: 'center',
//                 padding:20
//               }}
//             >
//               Choose Your Showa Experience
//             </Text>
     
//             <Text
//               style={{
//                 fontSize: 14,
//                 color: '#666',
//                 textAlign: 'center',
//                 lineHeight: 20,
//                 marginBottom: 25,
//               }}
//             >
//               Switch between <Text style={{ fontWeight: '600', color: '#9704e0' }}>e-Vibbz</Text> (short videos)
//               and <Text style={{ fontWeight: '600', color: '#0d6efd' }}>e-Broadcast</Text> (posts & updates)
//             </Text>
     
          
//             <TouchableOpacity
//               style={{
//                 width: '100%',
//                 paddingVertical: 14,
//                 borderRadius: 12,
//                 alignItems: 'center',
//                 backgroundColor: '#9704e0',
//                 marginBottom: 12,
//               }}
//               onPress={() => {
//                 navigation.navigate('SocialHome');
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Vibbz</Text>
//             </TouchableOpacity>
     
//             <TouchableOpacity
//               style={{
//                 width: '100%',
//                 paddingVertical: 14,
//                 borderRadius: 12,
//                 alignItems: 'center',
//                 backgroundColor: '#0d6efd',
//                 marginBottom: 12,
//               }}
//               onPress={() => {
//                 navigation.navigate('BroadcastHome');
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>e-Broadcast</Text>
//             </TouchableOpacity>
     
//             <TouchableOpacity
//               style={{
//                 width: '100%',
//                 paddingVertical: 14,
//                 borderRadius: 12,
//                 alignItems: 'center',
//                 backgroundColor: '#f1f1f1',
//               }}
     
//                onPress={() => {
//                           setShowDropdown(false);
//                           navigation.navigate('PHome')
//                           // setPendingSwitchTo('business');
//                           // setShowConfirmSwitch(true);
//                           setShowAccountModal(false);
//                         }}
     
     
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', }}>
//                 Switch Account
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>
//       {/*========================== chat Ai ========================================= */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => {
//           navigation.navigate('ChatAi');
         
//         }}
//       >
//          <Text style={{color:'#fff', fontFamily:'PTSerif-Bold', fontSize:20}}>Ai</Text>
       
//       </TouchableOpacity>
     
//       <TouchableOpacity
//         style={styles.fab2}
//         onPress={() => {
//           navigation.navigate('UserContactList');
//         }}
//       >
//         <Icon name="chatbox-ellipses" size={24} color="#0d64dd" />
//       </TouchableOpacity>
//       <Modal
//         visible={showDropdown}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowDropdown(false)}
//       >
//         <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
//           <View style={{ flex: 1, backgroundColor: 'transparent' }}>
//             <TouchableOpacity
//               activeOpacity={1}
//               onPress={() => {}}
//               style={[
//                 styles.dropdownMenu,
//                 {
//                   position: 'absolute',
//                   top: buttonLayout.y + buttonLayout.height,
//                   right: windowWidth - (buttonLayout.x + buttonLayout.width),
//                 },
//               ]}
//             >
//               {/* <Text style={[styles.dropdownItem,{fontWeight:'bold',color:'#000'}]}> Business Account</Text>
//               <Divider /> */}
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Advertise');
//                 }}
//               >
//                 <Text style={styles.dropdownItem}>Advertise</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('CreateChannel');
//               }}>
//                 <Text style={styles.dropdownItem}>Create Channel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('Broadcast');
//               }}>
//                 <Text style={styles.dropdownItem}>Official Broadcast</Text>
//               </TouchableOpacity>
//               {/* <TouchableOpacity
//                 // onPress={() => {
//                 // setShowDropdown(false);
//                 // navigation.navigate('Settings');
//                 // }}
//               >
//                 <Text style={styles.dropdownItem}>Link account</Text>
//               </TouchableOpacity> */}
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
                
//                  navigation.navigate('GroupConnect');
//                 }}
//               >
//                 <Text style={styles.dropdownItem}>New Group</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                     setShowDropdown(false);
//                     navigation.navigate('Broadcaster', {
//                       roomName: 'match-123',
//                       streamId: 'stream-1',
//                     });
//                   }}
//               >
//                 <Text style={styles.dropdownItem}>Go Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('CreateCatalog');
//                 }}
//               >
//                 <Text style={styles.dropdownItem}>Catalog</Text>
//               </TouchableOpacity>
             
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('MarketPlace');
//                 }}
//               >
//                 <Text style={styles.dropdownItem}>Market Place</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('BSettings');
//                 }}
//               >
//                 <Text style={styles.dropdownItem}>Settings</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('PHome');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem,{fontWeight:'bold'}]}>Switch Account</Text>
//               </TouchableOpacity>
//               {/* <TouchableOpacity
//               style={{borderTopWidth:0.5, marginTop:8, paddingTop:8, backgroundColor:'#fff',}}
              
//                   onPress={() => {
//                   setShowDropdown(false);
//                   // setPendingSwitchTo('per');
//                   // setShowConfirmSwitch(true);
//                   navigation.navigate('PHome');
//                 }}
               
//               >
//                 <Text style={[[styles.dropdownItem, {color:'#000',fontWeight:'bold'}]]}>Switch To Personal Account </Text>
//               </TouchableOpacity> */}
             
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f7fa',
//   },
//   fab2: {
//   position: 'absolute',
//   bottom: 120,
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
//   fab: {
//   position: 'absolute',
//   bottom: 200,
//   right: 20,
//   width: 53,
//   height: 53,
//   borderRadius: 28,
//   backgroundColor: '#0d64dd',
//   alignItems: 'center',
//   elevation: 5,
//   shadowColor: '#000',
//   shadowOpacity: 0.3,
//   shadowRadius: 4,
//   justifyContent:'center',
//   alignSelf:'center',
//   zIndex: 1000,
// },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 80,
//   },
// //   header: {
// //   paddingBottom: Platform.OS === 'android' ? 16 : 0,
// //   paddingTop: Platform.OS === 'android' ? 14 : 0,
// //   borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
// //   borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
// //   backgroundColor: '#0d64dd',
// //   elevation: 6,
// //   zIndex: 1000,
// // },

// //   headerTop: {
// //     //  paddingTop: insets.top,
    
// //     paddingHorizontal: Platform.OS === 'android'? 0: 20,
// //     paddingVertical:Platform.OS === 'android'? 0 : 30,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// header: {
//     paddingBottom: 10,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
//     backgroundColor: '#0d64dd',
//     elevation: 6,
//     zIndex: 1000,
//   },
//   headerTop: {
//   paddingHorizontal: 20,
//   height: 130 ,  // Add insets to height
//      // And also as padding
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// },
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
//     dropdownMenu: {
//     position: 'absolute',
//     top: 40,
//     right: 0,
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
//     minWidth: 220,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     color: '#1a1a1a',
//     fontFamily: 'SourceSansPro-Regular',
//   },
  
//   headerTitle: {
//     color: '#fff',
//     fontSize:Platform.OS === 'android' ? 28 : 35,
//     fontWeight:'bold',
//     letterSpacing: 0.7,
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
//   lottie: {
//     width: 150,
//     height: 150,
//     alignSelf: 'center',
//     marginBottom: 20,
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
//   welcomeModalOverlay: {
//   flex: 1,
//   backgroundColor: 'rgba(0,0,0,0.7)',
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// welcomeModalContainer: {
//   width: '90%',
//   maxHeight: '80%',
//   backgroundColor: '#fff',
//   borderRadius: 20,
//   overflow: 'hidden',
// },
// welcomeModalHeader: {
//   padding: 25,
//   alignItems: 'center',
//   justifyContent: 'center',
// },
// welcomeModalTitle: {
//   fontSize: 22,
//   fontWeight: 'bold',
//   color: '#fff',
//   marginTop: 15,
//   textAlign: 'center',
// },
// welcomeModalContent: {
//   padding: 20,
//   maxHeight: '60%',
// },
// featureCard: {
//   backgroundColor: '#f9f9f9',
//   borderRadius: 12,
//   padding: 15,
//   marginBottom: 15,
// },
// featureTitle: {
//   fontSize: 18,
//   fontWeight: '600',
//   color: '#333',
//   marginTop: 10,
// },
// featureDescription: {
//   fontSize: 14,
//   color: '#666',
//   marginTop: 5,
//   lineHeight: 20,
// },
// welcomeModalFooter: {
//   padding: 20,
//   borderTopWidth: 1,
//   borderTopColor: '#eee',
// },
// welcomeModalButton: {
//   backgroundColor: '#0d64dd',
//   padding: 15,
//   borderRadius: 10,
//   flexDirection: 'row',
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// welcomeModalButtonText: {
//   color: '#fff',
//   fontSize: 18,
//   fontWeight: '600',
//   marginRight: 10,
// },
// mediaModalContainer: {
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
//   color:'#555'
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
// //// eplore badge
//   exploreIconContainer: {
//   position: 'relative',
//   marginRight: 15,
// },
// exploreBadge: {
//   position: 'absolute',
//   top: -6,
//   right: -5,
//   backgroundColor: '#fff',
//   borderRadius: 8,
//   paddingHorizontal: 5,
//   paddingVertical: 2,
//   minWidth: 50,
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
import React, { useState, useEffect, Profiler, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  AppState,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import BottomNav from '../components/BottomNavBusiness';
import { Divider } from 'react-native-paper';
import SwitchAccountSheet from '../components/SwitchAccountSheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import IncomingCallModal from '../components/IncomingCallModal';
import NotificationService from '../src/services/PushNotifications';
import Video from 'react-native-video';
import { useTheme } from '../src/context/ThemeContext'; 

const windowWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const { colors, theme, toggleTheme, isDark  } = useTheme(); 
 
  const [tab, setTab] = useState('Chats');
  const [userData, setUserData] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [showStartChatModal, setShowStartChatModal] = useState(false);
  const [hasDismissedModal, setHasDismissedModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showDropdown, setShowDropdown] = useState(false);
  const [accountMode, setAccountMode] = useState('business');
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
  const [readChats, setReadChats] = useState(new Set());
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const insets = useSafeAreaInsets();
  
  const styles = createStyles(colors, isDark, insets); // Create styles with theme

  const [notificationSettings, setNotificationSettings] = useState({
    showNotifications: true,
    doNotDisturb: false,
  });

  useEffect(() => {
    loadNotificationSettings();
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

  // Handle incoming call
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [callerInfo, setCallerInfo] = useState({
    profileImage: '',
    name: 'Unknown',
    offer: null
  });

  const ws = useRef(null);

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
      const mode = await AsyncStorage.getItem('accountMode') || 'business';
      setAccountMode(mode);
    };
    loadMode();
  }, []);

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
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.log('Error fetching users:', error.message);
    }
  };

  const CHAT_CACHE_KEY = 'cached_chat_list_business';
  const READ_CHATS_KEY = 'read_chats_business';

  const loadReadChats = async () => {
    try {
      const stored = await AsyncStorage.getItem(READ_CHATS_KEY);
      if (stored) {
        setReadChats(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      console.error('Load read chats error:', e);
    }
  };

  const saveReadChats = async () => {
    try {
      await AsyncStorage.setItem(READ_CHATS_KEY, JSON.stringify(Array.from(readChats)));
    } catch (e) {
      console.error('Save read chats error:', e);
    }
  };

  useEffect(() => {
    saveReadChats();
  }, [readChats]);

  const loadCachedChats = async () => {
    try {
      const cached = await AsyncStorage.getItem(CHAT_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setChatList(parsed);
        setFilteredChatList(parsed);
        return true;
      }
    } catch (e) {
      console.error('Load cache error:', e);
    }
    return false;
  };

  const cacheChats = async (chats) => {
    try {
      await AsyncStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(chats));
    } catch (e) {
      console.error('Cache chats error:', e);
    }
  };

  useEffect(() => {
    async function loadCache() {
      setIsInitialLoading(true);
      await loadReadChats();
      const hasCache = await loadCachedChats();
      if (hasCache) {
        setChatList(prev =>
          prev.map(chat =>
            readChats.has(`${chat.id}-${chat.type}`) ? { ...chat, unread_count: 0 } : chat
          )
        );
        setFilteredChatList(prev =>
          prev.map(chat =>
            readChats.has(`${chat.id}-${chat.type}`) ? { ...chat, unread_count: 0 } : chat
          )
        );
      }
      setIsInitialLoading(false);
    }
    loadCache();
  }, []);

  const fetchChatList = async () => {
    setIsLoading(true);
    setError(null);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const filteredChats = response.data.chats.filter(chat =>
        chat.type !== 'channel' 
      );
      
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
            id: chatIdentifier
          });
        }
      });

      const chats = uniqueChats.map((chat) => ({
        id: chat.id,
        unread_count: chat.unread_count || 0,
        name: chat.name || 'Unknown',
        content: chat.content || '[media]',
        time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: chat.avatar || null,
        type: chat.type,
        members_count: chat.members_count,
        receiverId: chat.type === 'single' ? chat.id : null,
        group_slug: chat.group_slug || null
      }));

      setChatList(chats);
      setFilteredChatList(chats);
      cacheChats(chats);
    } catch (err) {
      console.error('Failed to load chat list:', err.response?.data || err.message);
      setError('Failed to load chats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async (chatId, chatType) => {
    console.log('Marking as read - chatId:', chatId, 'chatType:', chatType);
    setReadChats(prev => new Set(prev).add(`${chatId}-${chatType}`));
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
        {
          chat_id: chatId,
          chat_type: chatType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('API call failed');
      }
    } catch (error) {
      setReadChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${chatId}-${chatType}`);
        return newSet;
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatList();
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatListSilently();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
      
      const filteredChats = response.data.chats.filter(chat =>
        chat.type !== 'channel'
      );
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
            unread_count: chat.unread_count || 0,
            name: chat.name || 'Unknown',
            content: chat.content || '[media]',
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
            type: chat.type,
            members_count: chat.members_count,
            receiverId: chat.type === 'single' ? chatIdentifier : null,
            group_slug: chat.group_slug || null
          });
        }
      });
      
      checkForNewMessages(uniqueChats);
      
      setChatList(prevChats => {
        if (JSON.stringify(prevChats) !== JSON.stringify(uniqueChats)) {
          cacheChats(uniqueChats);
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

  const checkForNewMessages = (newChats) => {
    if (!notificationSettings.showNotifications || notificationSettings.doNotDisturb) {
      return;
    }
    newChats.forEach(chat => {
      if (chat.unread_count > 0) {
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

  const handleNotificationTap = (data) => {
    if (data.chatId && data.chatType) {
      if (data.chatType === 'group') {
        navigation.navigate('BusinessGroupChat', {
          groupId: data.chatId,
          groupSlug: data.group_slug,
          name: data.name,
          chatType: 'group',
          profile_image: data.avatar,
          members_count: data.members_count,
        });
      } else {
        navigation.navigate('BPrivateChat', {
          receiverId: data.chatId,
          name: data.name,
          chatType: 'single',
          profile_image: data.avatar,
        });
      }
    }
  };

  useEffect(() => {
    if (!isInitialLoading && chatList.length === 0 && !hasDismissedModal) {
      fetchUserData();
      setShowStartChatModal(true);
    }
  }, [chatList, isInitialLoading, hasDismissedModal]);

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
        const profile = response.data;
        return profile;
      } else {
        console.warn('Failed to fetch profile');
        return null;
      }
    } catch (err) {
      console.error('fetchProfile error:', err);
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

  const highlightSearchText = (text = '', query) => {
    if (!query || !text || typeof text !== 'string') return text;
   
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <Text>
        {text.substring(0, index)}
        <Text style={{ backgroundColor: isDark ? '#fbbf24' : '#FFEB3B', color: '#000' }}>
          {text.substring(index, index + query.length)}
        </Text>
        {text.substring(index + query.length)}
      </Text>
    );
  };

  const handleCameraLaunch = async () => {
    try {
      if (Platform.OS === 'android') {
        const cameraPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
       
        if (!cameraPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs access to your camera',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            }
          );
         
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Required',
              'Camera permission is required to take photos',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
            return;
          }
        }
      }

      const response = await launchCamera({
        mediaType: 'mixed',
        quality: 0.7,
        includeBase64: false,
        saveToPhotos: true,
        cameraType: 'back',
      });

      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error:', response.errorMessage);
        Alert.alert('Error', response.errorMessage || 'Failed to access camera');
      } else if (response.assets?.[0]) {
        const mediaData = {
          uri: response.assets[0].uri,
          type: response.assets[0].type || 'image/jpeg',
          fileName: response.assets[0].fileName || `photo_${Date.now()}.jpg`,
        };
        setMedia(mediaData);
        setShowMediaModal(true);
      }
    } catch (error) {
      console.error('Camera launch error:', error);
      Alert.alert('Error', 'Failed to launch camera');
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

  const handleOohmail = () => {
    Linking.openURL('https://ooshmail.com');
  }

  const ellipsisRef = useRef(null);
  const toggleDropdown = () => {
    if (showDropdown) {
      setShowDropdown(false);
    } else {
      ellipsisRef.current?.measure((fx, fy, width, height, px, py) => {
        setButtonLayout({ x: px, y: py, width, height });
        setShowDropdown(true);
      });
    }
  };

  return (
    <View style={[styles.container,{ backgroundColor: colors.backgroundSecondary }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'light-content'}
        backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
      />
      
      <LinearGradient
        colors={[colors.primary, colors.primary, colors.primary]}
        style={styles.header}
      >
        <View style={[styles.headerTop,{ paddingTop: insets.top }]}>
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
            
            <TouchableOpacity onPress={handleOohmail} style={styles.exploreIconContainer}>
              <Icon name="compass-outline" size={27} color="#fff" style={{marginRight: 20}} />
              <View style={styles.exploreBadge}>
                <Text style={styles.exploreBadgeText}>e-Mail</Text>
              </View>
            </TouchableOpacity>
           
            <TouchableOpacity style={{ marginRight: 20 }} onPress={()=>navigation.navigate('SupplierNotificationScreen')}>
              <Icon name="chatbubble-ellipses-outline" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity ref={ellipsisRef} onPress={toggleDropdown}>
              <Icon name="ellipsis-vertical" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabRow}>
          {['Chats', 'Status', 'Calls'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                if (item === 'Status') {
                  navigation.navigate('BStatusBar');
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
     
      <View style={styles.searchBox}>
        <Icon name="search" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
        <TextInput
          placeholder="Search or start new chat"
          style={styles.searchInput}
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.sectionTabs}>
        <Text style={[styles.sectionTab, { fontWeight: '600', color: colors.primary }]}>
          {searchQuery ? 'SEARCH RESULTS' : 'ALL CHATS'}
        </Text>
        {!searchQuery && <Text style={styles.sectionTab}></Text>}
      </View>

      <FlatList
        data={filteredChatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              markMessagesAsRead(item.id, item.type);
              if (item.type === 'group') {
                navigation.navigate('BusinessGroupChat', {
                  groupId: item.id,
                  groupSlug: item.group_slug,
                  name: item.name,
                  chatType: 'group',
                  profile_image: item.avatar,
                  members_count: item.members_count,
                  creator_id: item.creator_id
                });
              } else {
                navigation.navigate('BPrivateChat', {
                  receiverId: item.receiverId || item.id,
                  name: item.name,
                  chatType: 'single',
                  profile_image: item.avatar,
                });
              }
            }}
            style={styles.chatItem}
          >
            <Image
              source={
                item.avatar
                  ? { uri: `${API_ROUTE_IMAGE}${item.avatar}` || item.avatar }
                  : item.type === 'group'
                  ? { uri: 'https://via.placeholder.com/50/cccccc/808080?text=G' }
                  : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
              }
              style={styles.avatar}
            />
            <View style={styles.chatContent}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.chatName}>
                  {highlightSearchText(item.name, searchQuery) ||
                  (item.type === 'group' ? 'Group Chat' : 'Unnamed Chat')}
                </Text>
                {item.type === 'group' && (
                  <>
                    <Icon
                      name="people-outline"
                      size={16}
                      color={colors.textSecondary}
                      style={{marginLeft: 6}}
                    />
                    <Text style={styles.memberCountText}>
                      {item.members_count || 0}
                    </Text>
                    {item.is_creator && (
                      <Icon
                        name="star"
                        size={14}
                        color="#FFD700"
                        style={{marginLeft: 4}}
                      />
                    )}
                  </>
                )}
              </View>
              <Text style={styles.chatMessage} numberOfLines={1}>
                {highlightSearchText(item.content ||
                  (item.type === 'group'
                    ? (item.is_creator ? 'You created this group' : 'No messages yet')
                    : '[No message]'),
                searchQuery)}
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
          isLoading ? (
            <Text style={[styles.emptyText,{marginTop:80, textAlign:'center'}]}>Loading chats...</Text>
          ) : error ? (
            <View style={styles.emptyList}>
              <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
              <TouchableOpacity onPress={fetchChatList}>
                <Text style={[styles.emptyText, {color: colors.primary}]}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No matching chats found' : 'No chats available'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity onPress={()=>{
                  setShowStartChatModal(true)
                  navigation.navigate('UserContactList');
                }}>
                  <Text style={[styles.emptyText, {color: colors.primary}]}>Start a new chat</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        )}
      />
      
      <BottomNav navigation={navigation} setShowAccountModal={setShowAccountModal} />
      
      <IncomingCallModal
        visible={showIncomingCallModal}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        profileImage={callerInfo.profileImage}
        callerName={callerInfo.name}
      />
     
      <Modal
        visible={showMediaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMediaModal(false)}>
        <View style={styles.mediaModalContainer}>
          <View style={styles.mediaPreviewContainer}>
            {media?.type?.includes('video') ? (
              <Video
                source={{uri: media.uri}}
                style={styles.mediaPreview}
                resizeMode="cover"
                repeat
                muted
              />
            ) : (
              <Image source={{uri: media?.uri}} style={styles.mediaPreview} />
            )}
            <TextInput
              style={[styles.captionInput, {color: colors.text}]}
              placeholder="Add caption to your status (optional)"
              value={caption}
              placeholderTextColor={colors.placeholder}
              onChangeText={setCaption}
              multiline
            />
            <View style={styles.mediaActionButtons}>
              <TouchableOpacity
                style={[styles.mediaButton, styles.cancelButton]}
                onPress={() => {
                  setMedia(null);
                  setCaption('');
                  setShowMediaModal(false);
                }}>
                <Text style={[styles.buttonText,{color: colors.text}]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.mediaButton, styles.postButton]}
                onPress={() => {
                  handlePostStatus(media, caption);
                  setShowMediaModal(false);
                }}>
                <Text style={styles.buttonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={showStartChatModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowStartChatModal(false);
          setHasDismissedModal(true);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LottieView
              source={require("../assets/animations/Chat.json")}
              autoPlay
              loop={true}
              style={styles.lottie}
            />
            <Text style={styles.modalTitle}>No Chats Yet</Text>
            <Text style={styles.modalSubtitle}>
              You haven't started any conversations yet. Chat with friends to stay connected, or reach out to
              customers to grow your business. Tap to get started.
            </Text>
           
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                navigation.navigate('UserContactList');
              }}
            >
              <Text style={styles.modalButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.buttonSecondary }]}
              onPress={() => {
                setShowStartChatModal(false);
                setHasDismissedModal(true);
              }}
            >
              <Text style={[styles.modalButtonText,{color: colors.text}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={showAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: colors.overlay,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeAnim,
          }}
        >
          <View
            style={{
              width: '88%',
              backgroundColor: colors.background,
              borderRadius: 18,
              paddingVertical: 28,
              paddingHorizontal: 22,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAccountModal(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: colors.buttonSecondary,
                borderRadius: 50,
                padding: 8,
              }}
            >
              <Icon name="close" size={22} color={colors.text} />
            </TouchableOpacity>
     
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 8,
                textAlign: 'center',
                padding:20
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
                backgroundColor: colors.buttonSecondary,
              }}
              onPress={() => {
                setShowDropdown(false);
                navigation.navigate('PHome')
                setShowAccountModal(false);
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                Switch Account
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate('ChatAi');
        }}
      >
        <Text style={{color:'#fff', fontFamily:'PTSerif-Bold', fontSize:20}}>Ai</Text>
      </TouchableOpacity>
     
      <TouchableOpacity
        style={styles.fab2}
        onPress={() => {
          navigation.navigate('UserContactList');
        }}
      >
        <Icon name="chatbox-ellipses" size={24} color={colors.primary} />
      </TouchableOpacity>
      
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={[
                styles.dropdownMenu,
                {
                  position: 'absolute',
                  top: buttonLayout.y + buttonLayout.height,
                  right: windowWidth - (buttonLayout.x + buttonLayout.width),
                  backgroundColor: colors.background,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('Advertise');
                }}
              >
                <Text style={styles.dropdownItem}>Advertise</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowDropdown(false);
                navigation.navigate('CreateChannel');
              }}>
                <Text style={styles.dropdownItem}>Create Channel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowDropdown(false);
                navigation.navigate('Broadcast');
              }}>
                <Text style={styles.dropdownItem}>Official Broadcast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('GroupConnect');
                }}
              >
                <Text style={styles.dropdownItem}>New Group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('Broadcaster', {
                    roomName: 'match-123',
                    streamId: 'stream-1',
                  });
                }}
              >
                <Text style={styles.dropdownItem}>Go Live</Text>
              </TouchableOpacity>
               <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                 navigation.navigate('LiveStreaming');
                }}
              >
             
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Watch Live</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('EarningDashbord');
                }}
              >
                    <Text style={[styles.dropdownItem, { color: colors.text }]}>Earn Money</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('CreateCatalog');
                }}
              >
                <Text style={styles.dropdownItem}>Catalog</Text>
              </TouchableOpacity>
             
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('MarketPlace');
                }}
              >
                <Text style={styles.dropdownItem}>Market Place</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('BSettings');
                }}
              >
                <Text style={styles.dropdownItem}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('PHome');
                }}
              >
                <Text style={[styles.dropdownItem,{fontWeight:'bold'}]}>Switch Account</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const createStyles = (colors, isDark, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  fab2: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.buttonSecondary,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent:'center',
    alignSelf:'center',
    zIndex: 1000,
    borderColor: colors.border,
  },
  fab: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 53,
    height: 53,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent:'center',
    alignSelf:'center',
    zIndex: 1000,
  },
  header: {
    paddingBottom: 10,
    borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: colors.primary,
    elevation: 2,
    zIndex: 1000,
  },
  headerTop: {
    paddingHorizontal: 20,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBadgeContainer: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2000,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 220,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'SourceSansPro-Regular',
  },
  headerTitle: {
    color: 'white',
    fontSize: Platform.OS === 'android' ? 28 : 35,
    fontWeight:'bold',
    letterSpacing: 0.7,
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
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    paddingVertical: 6,
  },
  tabTextActive: {
    color: 'white',
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: 'white',
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
    borderWidth: 0.0,
    borderColor: colors.border,
    zIndex: 500,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'SourceSansPro-Regular',
    color: colors.text,
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
    color: colors.textSecondary,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
    textTransform: 'capitalize',
    color: colors.text,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: colors.surface,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  chatMessage: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chatTime: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: '85%',
    elevation: 6,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  accountModalContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
  },
  memberCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
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
   elevation: 0.6,
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
    backgroundColor: colors.surface,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  chatMessage: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  timeBadgeContainer: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  chatTime: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fullScreenLoading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.background,
    borderRadius: 20,
    overflow: 'hidden',
  },
  welcomeModalHeader: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textInverse,
    marginTop: 15,
    textAlign: 'center',
  },
  welcomeModalContent: {
    padding: 20,
    maxHeight: '60%',
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 20,
  },
  welcomeModalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  welcomeModalButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeModalButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  mediaModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  mediaPreviewContainer: {
    width: '90%',
    backgroundColor: colors.background,
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
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    minHeight: 50,
    marginBottom: 15,
    backgroundColor: colors.inputBackground,
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
    backgroundColor: colors.buttonSecondary,
  },
  postButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.textInverse,
    fontWeight: 'bold',
  },
  exploreIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  exploreBadge: {
    position: 'absolute',
    top: -6,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'white',
  },
  exploreBadgeText: {
    color: colors.primary,
    fontSize: 9,
    textTransform: 'uppercase',
    fontWeight:'800',
    letterSpacing: 0.3,
  },
});

export default HomeScreen;
