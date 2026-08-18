
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
// // import BottomNav from '../components/BottomNavBusiness';
// import BottomNav from '../components/BottomNavSocialMedia';
// //import BottomNav from '../components/BottomNavSocila_2';
// import { Divider } from 'react-native-paper';
// import SwitchAccountSheet from '../components/SwitchAccountSheet';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import LottieView from 'lottie-react-native';
// import IncomingCallModal from '../components/IncomingCallModal';
// import NotificationService from '../src/services/PushNotifications';
// import Video from 'react-native-video';
// import { useTheme } from '../src/context/ThemeContext';
// import EarningsSlideInManager from '../components/EarningsSlideInManager';
// import OnlineStatusBadge from '../components/OnlineStatusBadge';

// const windowWidth = Dimensions.get('window').width;

// const BusinessHomeScreen = ({ navigation }) => {
//   const { colors, theme, toggleTheme, isDark  } = useTheme(); 
 
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
  
  
//   const styles = createStyles(colors, isDark, insets); 

//   const [notificationSettings, setNotificationSettings] = useState({
//     showNotifications: true,
//     doNotDisturb: false,
//   });

// const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);


// const fetchUnreadNotificationCount = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.get(`${API_ROUTE}/notifications/unread-count/`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
    
//     if (response.data.success) {
//       setUnreadNotificationCount(response.data.unread_count);
//     }
//   } catch (error) {
//     console.error('Error fetching unread count:', error);
//   }
// };


//   useEffect(() => {
//     loadNotificationSettings();
//     fetchUnreadNotificationCount();
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

//   // Handle incoming call
//   const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
//   const [callerInfo, setCallerInfo] = useState({
//     profileImage: '',
//     name: 'Unknown',
//     offer: null
//   });

//   const ws = useRef(null);

//   useEffect(() => {
//     const connectCallWebSocket = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const retrieveUserId = await AsyncStorage.getItem('userData');
  
//         if (!token || !retrieveUserId) {
//           console.warn('Missing auth data, websocket not started');
//           return;
//         }
  
//         const userData = JSON.parse(retrieveUserId);
//         const currentUserId = userData.id;
//         const ROOM_ID = `user-${currentUserId}`;
//         const SIGNALING_SERVER = 'wss://api.showapp.ng';
  
//         const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;
  
//         ws.current = new WebSocket(url);
//         ws.current.binaryType = 'arraybuffer';
  
//         ws.current.onopen = () => {
//           console.log('[Call WS] Connected');
//         };
  
//         ws.current.onmessage = (evt) => {
//           let data;
//           try {
//             data = JSON.parse(evt.data);
//           } catch (e) {
//             console.error('[WS] Invalid JSON', e);
//             return;
//           }
  
//           if (data.type === 'offer') {
//             if (
//               data.offer?.targetUserId &&
//               data.offer.targetUserId !== currentUserId
//             ) {
//               return;
//             }
  
//             // Extract caller information from the offer
//             const callerData = data.offer?.callerInfo || {};
            
//             // Get profile image - could be in different places
//             const profileImage = callerData.profileImage || 
//                                  data.offer?.profileImage || 
//                                  '';
            
//             const callerName = callerData.name || 
//                                data.offer?.callerName || 
//                                'Unknown Caller';
  
//             // Extract video call information
//             const isVideo = data.offer?.isVideoCall || false;
  
//             console.log('[Incoming Call] Caller info:', {
//               name: callerName,
//               hasProfileImage: !!profileImage,
//               profileImage: profileImage.substring(0, 50) + '...'
//             });
  
//             // Set the states
//            // setIsVideoCall(isVideo);
            
//             setCallerInfo({
//               profileImage: profileImage,
//               name: callerName,
//               offer: data.offer,
//             });
  
//             // Show the modal
//             setShowIncomingCallModal(true);
//           }
//         };
  
//         ws.current.onerror = (e) => {
//           //console.error('[Call WS] Error', e);
//         };
  
//         ws.current.onclose = (e) => {
//           //console.log('[Call WS] Closed', e.code, e.reason);
//         };
//       } catch (err) {
//        // console.error('[Call WS] Failed to connect', err);
//       }
//     };
  
//     connectCallWebSocket();
  
//     return () => {
//       ws.current?.close();
//     };
//   }, []);

//   // useEffect(() => {
//   //   const connectCallWebSocket = async () => {
//   //     try {
//   //       const token = await AsyncStorage.getItem('userToken');
//   //       const retrieveUserId = await AsyncStorage.getItem('userData');

//   //       if (!token || !retrieveUserId) {
//   //         console.warn('Missing auth data, websocket not started');
//   //         return;
//   //       }

//   //       const userData = JSON.parse(retrieveUserId);
//   //       const currentUserId = userData.id;
//   //       const ROOM_ID = `user-${currentUserId}`;
//   //       const SIGNALING_SERVER = 'wss://api.showapp.ng';

//   //       const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

//   //       ws.current = new WebSocket(url);
//   //       ws.current.binaryType = 'arraybuffer';

//   //       ws.current.onopen = () => {
//   //         console.log('[Call WS] Connected');
//   //       };

//   //       ws.current.onmessage = (evt) => {
//   //         let data;
//   //         try {
//   //           data = JSON.parse(evt.data);
//   //         } catch (e) {
//   //           console.error('[WS] Invalid JSON', e);
//   //           return;
//   //         }

//   //         if (data.type === 'offer') {
//   //           if (
//   //             data.offer?.targetUserId &&
//   //             data.offer.targetUserId !== currentUserId
//   //           ) {
//   //             return;
//   //           }

//   //           const callerData = data.offer.callerInfo || {
//   //             profileImage: data.offer.profileImage || '',
//   //             name: data.offer.callerName || 'Unknown Caller',
//   //           };

//   //           setCallerInfo({
//   //             profileImage: callerData.profileImage,
//   //             name: callerData.name,
//   //             offer: data.offer,
//   //           });

//   //           setShowIncomingCallModal(true);
//   //         }
//   //       };

//   //       ws.current.onerror = (e) => {
//   //         console.error('[Call WS] Error', e);
//   //       };

//   //       ws.current.onclose = (e) => {
//   //         console.log('[Call WS] Closed', e.code, e.reason);
//   //       };
//   //     } catch (err) {
//   //       console.error('[Call WS] Failed to connect', err);
//   //     }
//   //   };

//   //   connectCallWebSocket();

//   //   return () => {
//   //     ws.current?.close();
//   //   };
//   // }, []);


//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   const handleAcceptCall = () => {
//     navigation.navigate('VoiceCalls', {
//       profile_image: callerInfo.profileImage,
//       name: callerInfo.name,
//       incomingOffer: callerInfo.offer,
//       isIncomingCall: true,
//       isInitiator: false
//     });
//     setShowIncomingCallModal(false);
//   };

//   const handleRejectCall = () => {
//     sendMessage({ type: 'call-ended' });
//     setShowIncomingCallModal(false);
//     setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
//   };

//   useEffect(() => {
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
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/get-users/`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
     
//       if (response.status === 200 || response.status === 201) {
//         const uniqueUsers = response.data.filter(
//           (user, index, self) => index === self.findIndex((u) => u.id === user.id)
//         );
//         setUserData(uniqueUsers);
//       } else {
//         console.error('Failed to fetch users:', response.status);
//       }
//     } catch (error) {
//       console.log('Error fetching users:', error.message);
//     }
//   };

//   const CHAT_CACHE_KEY = 'cached_chat_list_business';
//   const READ_CHATS_KEY = 'read_chats_business';

//  const loadReadChats = async () => {
//   try {
//     const stored = await AsyncStorage.getItem(READ_CHATS_KEY);
//     console.log('Loading read chats from storage:', stored);
//     if (stored) {
//       const parsedSet = new Set(JSON.parse(stored));
//       setReadChats(parsedSet);
//       return parsedSet;
//     }
//     return new Set();
//   } catch (e) {
//     console.error('Load read chats error:', e);
//     return new Set();
//   }
// };

//   const saveReadChats = async (readChatsSet) => {
//   try {
//     const toStore = JSON.stringify(Array.from(readChatsSet));
//     await AsyncStorage.setItem(READ_CHATS_KEY, toStore);
//     console.log('Saved read chats:', toStore);
//   } catch (e) {
//     console.error('Save read chats error:', e);
//   }
// };


//   useEffect(() => {
//   if (readChats && readChats.size > 0) {
//     saveReadChats(readChats);
//   }
// }, [readChats]);

//   const loadCachedChats = async () => {
//   try {
//     const cached = await AsyncStorage.getItem(CHAT_CACHE_KEY);
//     if (cached) {
//       const parsed = JSON.parse(cached);
//       console.log('Loaded cached chats:', parsed.length);
//       setChatList(parsed);
//       setFilteredChatList(parsed);
//       return true;
//     }
//   } catch (e) {
//     console.error('Load cache error:', e);
//   }
//   return false;
// };


//  const cacheChats = async (chats) => {
//   try {
//     await AsyncStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(chats));
//     console.log('Cached chats:', chats.length);
//   } catch (e) {
//     console.error('Cache chats error:', e);
//   }
// };


//   useEffect(() => {
//   async function loadInitialData() {
//     setIsInitialLoading(true);
    
//     // Load read chats first
//     const loadedReadChats = await loadReadChats();
//     console.log('Loaded read chats on startup:', Array.from(loadedReadChats));
    
//     // Then load cached chats
//     const hasCache = await loadCachedChats();
    
//     if (hasCache) {
//       // Apply read state to cached chats
//       setChatList(prev =>
//         prev.map(chat => {
//           const chatKey = `${chat.id}-${chat.type}`;
//           const isRead = loadedReadChats.has(chatKey);
//           return isRead ? { ...chat, unread_count: 0 } : chat;
//         })
//       );
//       setFilteredChatList(prev =>
//         prev.map(chat => {
//           const chatKey = `${chat.id}-${chat.type}`;
//           const isRead = loadedReadChats.has(chatKey);
//           return isRead ? { ...chat, unread_count: 0 } : chat;
//         })
//       );
//     }
    
//     setIsInitialLoading(false);
//   }
  
//   loadInitialData();
// }, []);

//   // useEffect(() => {
//   //   async function loadCache() {
//   //     setIsInitialLoading(true);
//   //     await loadReadChats();
//   //     const hasCache = await loadCachedChats();
//   //     if (hasCache) {
//   //       setChatList(prev =>
//   //         prev.map(chat =>
//   //           readChats.has(`${chat.id}-${chat.type}`) ? { ...chat, unread_count: 0 } : chat
//   //         )
//   //       );
//   //       setFilteredChatList(prev =>
//   //         prev.map(chat =>
//   //           readChats.has(`${chat.id}-${chat.type}`) ? { ...chat, unread_count: 0 } : chat
//   //         )
//   //       );
//   //     }
//   //     setIsInitialLoading(false);
//   //   }
//   //   loadCache();
//   //}, []);

//   const fetchChatList = async () => {
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
//           id: chatIdentifier
//         });
//       }
//     });

//     const chats = uniqueChats.map((chat) => {
//       const chatKey = `${chat.id}-${chat.type}`;
//       const isRead = readChats.has(chatKey);
//       return {
//         id: chat.id,
//         unread_count: isRead ? 0 : (chat.unread_count || 0),
//         name: chat.name || 'Unknown',
//         content: chat.content || '[media]',
//         time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         avatar: chat.avatar || null,
//         type: chat.type,
//         members_count: chat.members_count,
//         receiverId: chat.type === 'single' ? chat.id : null,
//         group_slug: chat.group_slug || null
//       };
//     });

//     setChatList(chats);
//     setFilteredChatList(chats);
//     cacheChats(chats);
//   } catch (err) {
//     console.error('Failed to load chat list:', err.response?.data || err.message);
//     setError('Failed to load chats. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const markMessagesAsRead = async (chatId, chatType) => {
//   const chatKey = `${chatId}-${chatType}`;
//   console.log('Marking as read - chatId:', chatId, 'chatType:', chatType, 'key:', chatKey);
  
//   // Check if already marked as read
//   if (readChats.has(chatKey)) {
//     console.log('Already marked as read, skipping');
//     return;
//   }
  
//   // Update local state
//   setReadChats(prev => {
//     const newSet = new Set(prev);
//     newSet.add(chatKey);
//     saveReadChats(newSet); // Save immediately
//     return newSet;
//   });
  
//   // Update chat lists
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
//     console.log('Successfully marked as read on server');
//   } catch (error) {
//     console.error('Error marking messages as read:', error);
//     // Revert on failure
//     setReadChats(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(chatKey);
//       saveReadChats(newSet);
//       return newSet;
//     });
//   }
// };

//   useFocusEffect(
//     useCallback(() => {
//       fetchChatList();
//       fetchUserData();
//     }, [])
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchChatListSilently();
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);


//   const fetchChatListSilently = async () => {
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
//         const chatKey = `${chatIdentifier}-${chat.type}`;
//         const isRead = readChats.has(chatKey);
//         uniqueChats.push({
//           ...chat,
//           id: chatIdentifier,
//           unread_count: isRead ? 0 : (chat.unread_count || 0),
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
    
//     checkForNewMessages(uniqueChats);
    
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

  

//   const checkForNewMessages = (newChats) => {
//     if (!notificationSettings.showNotifications || notificationSettings.doNotDisturb) {
//       return;
//     }
//     newChats.forEach(chat => {
//       if (chat.unread_count > 0) {
//         const notificationKey = `notified_${chat.id}_${chat.unread_count}`;
       
//         AsyncStorage.getItem(notificationKey).then(alreadyNotified => {
//           if (!alreadyNotified) {
//             NotificationService.localNotification(
//               chat.name,
//               chat.content || 'New message',
//               {
//                 chatId: chat.id,
//                 chatType: chat.type,
//                 name: chat.name,
//               }
//             );
           
//             AsyncStorage.setItem(notificationKey, 'true');
//           }
//         });
//       }
//     });
//   };

//   const handleNotificationTap = (data) => {
//     if (data.chatId && data.chatType) {
//       if (data.chatType === 'group') {
//         navigation.navigate('BusinessGroupChat', {
//           groupId: data.chatId,
//           groupSlug: data.group_slug,
//           name: data.name,
//           chatType: 'group',
//           profile_image: data.avatar,
//           members_count: data.members_count,
//         });
//       } else {
//         navigation.navigate('BPrivateChat', {
//           receiverId: data.chatId,
//           name: data.name,
//           chatType: 'single',
//           profile_image: data.avatar,
//         });
//       }
//     }
//   };

//   // useEffect(() => {
//   //   if (!isInitialLoading && chatList.length === 0 && !hasDismissedModal) {
//   //     fetchUserData();
//   //     setShowStartChatModal(true);
//   //   }
//   // }, [chatList, isInitialLoading, hasDismissedModal]);

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
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 200 || response.status === 201) {
//         const profile = response.data;
//         return profile;
//       } else {
//         console.warn('Failed to fetch profile');
//         return null;
//       }
//     } catch (err) {
//       console.error('fetchProfile error:', err);
//       return null;
//     }
//   };

//   const switchAccount = async (account) => {
//     setIsLoading(true);
//     try {
//       await AsyncStorage.setItem('accountMode', account);
//       setAccountMode(account);
//       if (account === 'personal') {
//         fetchChatList();
//       } else {
//         const profile = await fetchProfile();
       
//         if (profile && profile.name && profile.name.trim() !== '') {
//           navigation.navigate('BusinessHome');
//         } else {
//           navigation.navigate('BusinessSetup');
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const highlightSearchText = (text = '', query) => {
//     if (!query || !text || typeof text !== 'string') return text;
   
//     const index = text.toLowerCase().indexOf(query.toLowerCase());
//     if (index === -1) return text;
//     return (
//       <Text>
//         {text.substring(0, index)}
//         <Text style={{ backgroundColor: isDark ? '#fbbf24' : '#FFEB3B', color: '#000' }}>
//           {text.substring(index, index + query.length)}
//         </Text>
//         {text.substring(index + query.length)}
//       </Text>
//     );
//   };

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

//   const handlePostStatus = async (media, caption) => {
//     if (!media) {
//       Alert.alert('Error', 'No media selected');
//       return;
//     }
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
     
//       let fileExt = media.uri.split('.').pop().toLowerCase();
//       let type = media.type;
     
//       if (!type) {
//         if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
//           type = 'image/jpeg';
//         } else if (['mp4', 'mov'].includes(fileExt)) {
//           type = 'video/mp4';
//         }
//       }
//       formData.append('media', {
//         uri: media.uri,
//         type: type,
//         name: `status_${Date.now()}.${fileExt}`,
//       });
//       if (caption) {
//         formData.append('text', caption);
//       }
//       const response = await axios.post(`${API_ROUTE}/status/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       Alert.alert('Success', 'Status posted successfully!');
     
//       return response.data;
//     } catch (error) {
//       Alert.alert('Error', 'Failed to post status');
//       throw error;
//     }
//   };

//   const handleOohmail = () => {
//     Linking.openURL('https://ooshmail.com');
//   }

//   const ellipsisRef = useRef(null);
//   const toggleDropdown = () => {
//     if (showDropdown) {
//       setShowDropdown(false);
//     } else {
//       ellipsisRef.current?.measure((fx, fy, width, height, px, py) => {
//         setButtonLayout({ x: px, y: py, width, height });
//         setShowDropdown(true);
//       });
//     }
//   };

//   return (
//     <View style={[styles.container,{ backgroundColor: colors.backgroundSecondary }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'light-content'}
//         backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
//       />
      
//       <LinearGradient
//         colors={[colors.primary, colors.primary, colors.primary]}
//         style={styles.header}
//       >
//         <View style={[styles.headerTop,{ paddingTop: insets.top }]}>
//           <Text style={styles.headerTitle}>Chat</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity
//                           style={styles.exploreIconContainer}
//                           onPress={toggleTheme}
//                         >
//                           <Icon 
//                             style={{ marginRight: 10 }}
//                             name={isDark ? 'moon' : 'sunny'}
//                             size={25} 
//                             color="#FFFFFF" 
//                           />
//                         </TouchableOpacity>
            
//             <TouchableOpacity onPress={handleOohmail} style={styles.exploreIconContainer}>
//               <Icon name="compass-outline" size={27} color="#fff" style={{marginRight: 20}} />
//               <View style={styles.exploreBadge}>
//                 <Text style={styles.exploreBadgeText}>e-Mail</Text>
//               </View>
//             </TouchableOpacity>
           
//             {/* <TouchableOpacity style={{ marginRight: 20 }} onPress={()=>navigation.navigate('SupplierNotificationScreen')}>
//               <Icon name="chatbubble-ellipses-outline" size={24} color="#fff" />
//             </TouchableOpacity> */}

//             {/* <TouchableOpacity 
//                           onPress={() => navigation.navigate('NotificationsScreen')}
//                           style={styles.notificationIconContainer}
//                         >
//                           <Icon name="notifications-outline" size={25} color="#fff" style={{ marginRight: 20 }} />
//                           {unreadNotificationCount > 0 && (
//                             <View style={styles.notificationBadge}>
//                               <Text style={styles.notificationBadgeText}>
//                                 {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
//                               </Text>
//                             </View>
//                           )}
//                         </TouchableOpacity> */}
            
//             <TouchableOpacity ref={ellipsisRef} onPress={toggleDropdown}>
//               <Icon name="ellipsis-vertical" size={25} color="#fff" />
//             </TouchableOpacity>
//           </View>
             
//         </View>
//         <View style={styles.tabRow}>
//           {['Chats', 'Status', 'Calls'].map((item) => (
//             <TouchableOpacity
//               key={item}
//               onPress={() => {
//                 if (item === 'Status') {
//                   navigation.navigate('BStatusBar');
//                 } else if (item === 'Calls') {
//                   navigation.navigate('BCalls');
//                 } else {
//                   setTab(item);
//                 }
//               }}
//             >
//               <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
//               {tab === item && <View style={styles.tabUnderline} />}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </LinearGradient>
     
//       <View style={styles.searchBox}>
//         <Icon name="search" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
//         <TextInput
//           placeholder="Search or start new chat"
//           style={styles.searchInput}
//           placeholderTextColor={colors.placeholder}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           clearButtonMode="while-editing"
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Icon name="close-circle" size={20} color={colors.textSecondary} />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       <View style={styles.sectionTabs}>
//         <Text style={[styles.sectionTab, { fontWeight: '600', color: colors.primary }]}>
//           {searchQuery ? 'SEARCH RESULTS' : 'ALL BUSINESS CHATS'}
//         </Text>
//         {!searchQuery && <Text style={styles.sectionTab}></Text>}
//       </View>

//       <FlatList
//   data={filteredChatList}
//   keyExtractor={(item) => item.id}
//   renderItem={({ item }) => (
//     <TouchableOpacity
//       onPress={() => {
//         markMessagesAsRead(item.id, item.type);
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
//             userIdd: item.receiverId || item.id
//           });
//         }
//       }}
//       style={styles.chatItem}
//     >
//       {/* Avatar Container with Status Badge */}
//       <View style={styles.avatarContainer}>
//         <Image
//           source={
//             item.avatar
//               ? { uri: `${API_ROUTE_IMAGE}${item.avatar}` || item.avatar }
//               : item.type === 'group'
//               ? { uri: 'https://via.placeholder.com/50/cccccc/808080?text=G' }
//               : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//           }
//           style={styles.avatar}
//         />
//         {item.type === 'single' && (
//           <OnlineStatusBadge 
//             userId={item.receiverId || item.id}
//             dotSize={14}
//             position="bottom-right"
//             borderWidth={2}
//             borderColor={colors.card}
//           />
//         )}
//         {item.type === 'group' && (
//           <View style={styles.groupBadge}>
//             <Icon name="people" size={12} color="#fff" />
//           </View>
//         )}
//       </View>
      
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
//                 color={colors.textSecondary}
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
//     isLoading ? (
//       <Text style={[styles.emptyText,{marginTop:80, textAlign:'center'}]}>Loading chats...</Text>
//     ) : error ? (
//       <View style={styles.emptyList}>
//         <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
//         <TouchableOpacity onPress={fetchChatList}>
//           <Text style={[styles.emptyText, {color: colors.primary}]}>Retry</Text>
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
//             <Text style={[styles.emptyText, {color: colors.primary,marginTop:10, fontFamily: 'SourceSansPro-Medium'}]}>Start a new chat</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     )
//   )}
//   contentContainerStyle={{ 
//     paddingBottom: insets.bottom + 120,
//   }}
// />
//       <BottomNav 
//             navigation={navigation} 
//             setShowAccountModal={setShowAccountModal}
//             activeRoute="Home" 
//               style={{ zIndex: 9999 }}
//           />
      
//       {/* <BottomNav navigation={navigation} setShowAccountModal={setShowAccountModal} /> */}
      
//       {/* <IncomingCallModal
//         visible={showIncomingCallModal}
//         onAccept={handleAcceptCall}
//         onReject={handleRejectCall}
//         profileImage={callerInfo.profileImage}
//         callerName={callerInfo.name}
//       /> */}
     
//       <Modal
//         visible={showMediaModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowMediaModal(false)}>
//         <View style={styles.mediaModalContainer}>
//           <View style={styles.mediaPreviewContainer}>
//             {media?.type?.includes('video') ? (
//               <Video
//                 source={{uri: media.uri}}
//                 style={styles.mediaPreview}
//                 resizeMode="cover"
//                 repeat
//                 muted
//               />
//             ) : (
//               <Image source={{uri: media?.uri}} style={styles.mediaPreview} />
//             )}
//             <TextInput
//               style={[styles.captionInput, {color: colors.text}]}
//               placeholder="Add caption to your status (optional)"
//               value={caption}
//               placeholderTextColor={colors.placeholder}
//               onChangeText={setCaption}
//               multiline
//             />
//             <View style={styles.mediaActionButtons}>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.cancelButton]}
//                 onPress={() => {
//                   setMedia(null);
//                   setCaption('');
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={[styles.buttonText,{color: colors.text}]}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.postButton]}
//                 onPress={() => {
//                   handlePostStatus(media, caption);
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={styles.buttonText}>Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
      
//       {/* <Modal
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
//             <LottieView
//               source={require("../assets/animations/Chat.json")}
//               autoPlay
//               loop={true}
//               style={styles.lottie}
//             />
//             <Text style={styles.modalTitle}>No Chats Yet</Text>
//             <Text style={styles.modalSubtitle}>
//               You haven't started any conversations yet. Chat with friends to stay connected, or reach out to
//               customers to grow your business. Tap to get started.
//             </Text>
           
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 navigation.navigate('UserContactList');
//               }}
//             >
//               <Text style={styles.modalButtonText}>Get Started</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.modalButton, { backgroundColor: colors.buttonSecondary }]}
//               onPress={() => {
//                 setShowStartChatModal(false);
//                 setHasDismissedModal(true);
//               }}
//             >
//               <Text style={[styles.modalButtonText,{color: colors.text}]}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//        */}
//       <Modal
//         visible={showAccountModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAccountModal(false)}
//       >
//         <Animated.View
//           style={{
//             flex: 1,
//             backgroundColor: colors.overlay,
//             justifyContent: 'center',
//             alignItems: 'center',
//             opacity: fadeAnim,
//           }}
//         >
//           <View
//             style={{
//               width: '88%',
//               backgroundColor: colors.background,
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
//             <TouchableOpacity
//               onPress={() => setShowAccountModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 backgroundColor: colors.buttonSecondary,
//                 borderRadius: 50,
//                 padding: 8,
//               }}
//             >
//               <Icon name="close" size={22} color={colors.text} />
//             </TouchableOpacity>
     
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: '700',
//                 color: colors.text,
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
//                 color: colors.textSecondary,
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
//                 backgroundColor: colors.buttonSecondary,
//               }}
//               onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('PHome')
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
//                 Switch Account
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>
      
//       {/* <TouchableOpacity
//         style={styles.fab}
//         onPress={() => {
//           navigation.navigate('ChatAi');
//         }}
//       >
//         <Text style={{color:'#fff', fontFamily:'PTSerif-Bold', fontSize:20}}>Ai</Text>
//       </TouchableOpacity> */}
     
//       <TouchableOpacity
//         style={styles.fab2}
//         onPress={() => {
//           navigation.navigate('UserContactList');
//         }}
//       >
//         <Icon name="chatbox-ellipses" size={24} color={colors.primary} />
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
//                   backgroundColor: colors.background,
//                 },
//               ]}
//             >
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
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('GroupConnect');
//                 }}
//               >
//                 <Text style={styles.dropdownItem}>New Group</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Broadcaster', {
//                     roomName: 'match-123',
//                     streamId: 'stream-1',
//                   });
//                 }}
//               >
//                 <Text style={styles.dropdownItem}>Go Live</Text>
//               </TouchableOpacity>
//                <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                  navigation.navigate('LiveStreaming');
//                 }}
//               >
             
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Watch Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('SupplierNotificationScreen');
//                 }}
//               >
//                     <Text style={[styles.dropdownItem, { color: colors.text }]}>Deals</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Explore');
//                 }}
//               >
//                     <Text style={[styles.dropdownItem, { color: colors.text }]}>Business Tools</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('EarningDashbord');
//                 }}
//               >
//                     <Text style={[styles.dropdownItem, { color: colors.text }]}>Earn Money</Text>
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
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//       <EarningsSlideInManager />
//     </View>
//   );
// };

// const createStyles = (colors, isDark, insets) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.backgroundSecondary,
//   },
//   fab2: {
//     position: 'absolute',
//     bottom: 120,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     backgroundColor: colors.buttonSecondary,
//     alignItems: 'center',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent:'center',
//     alignSelf:'center',
//     zIndex: 1000,
//     borderColor: colors.border,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 200,
//     right: 20,
//     width: 53,
//     height: 53,
//     borderRadius: 28,
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent:'center',
//     alignSelf:'center',
//     zIndex: 1000,
//   },
//   heafder: {
//     paddingBottom: 10,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
//     backgroundColor: colors.primary,
//     elevation: 2,
//     zIndex: 1000,
//   },
//   headerTop: {
//     marginTop: Platform.OS === 'android' ? 10 : 10,
//     paddingHorizontal: 20,
//     height: Platform.OS === 'android' ? 90 : 130,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   timeBadgeContainer: {
//     alignItems: 'flex-end',
//     minWidth: 50,
//   },
//   badge: {
//     backgroundColor: colors.primary,
//     borderRadius: 50,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 4,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: colors.textInverse,
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: 40,
//     right: 0,
//     backgroundColor: colors.backgroundSecondary,
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: isDark ? 0.3 : 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 2000,
//     borderWidth: 1,
//     borderColor: colors.border,
//     minWidth: 220,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     color: colors.text,
//     fontFamily: 'SourceSansPro-Regular',
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: Platform.OS === 'android' ? 28 : 35,
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
//     marginTop: 15,
//   },
//   tabText: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 16,
//     fontFamily: 'SourceSansPro-Bold',
//     paddingVertical: 6,
//   },
//   tabTextActive: {
//     color: 'white',
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontWeight: '600',
//   },
//   tabUnderline: {
//     height: 3,
//     backgroundColor: 'white',
//     borderRadius: 2,
//     marginTop: 4,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     backgroundColor: colors.card,
//     margin: 16,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     height: 48,
//     elevation: 0.5,
//     shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.0,
//     borderColor: colors.border,
//     zIndex: 500,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     fontFamily: 'SourceSansPro-Regular',
//     color: colors.text,
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
//     color: colors.textSecondary,
//   },
//   userItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomColor: colors.border,
//     borderBottomWidth: 1,
//   },
  
//   notificationIconContainer: {
//   position: 'relative',
// },
// notificationBadge: {
//   position: 'absolute',
//   top: -5,
//   right: 15,
//   backgroundColor: '#FF3B30',
//   borderRadius: 10,
//   minWidth: 18,
//   height: 18,
//   justifyContent: 'center',
//   alignItems: 'center',
//   paddingHorizontal: 4,
// },
// notificationBadgeText: {
//   color: '#fff',
//   fontSize: 10,
//   fontWeight: 'bold',
// },
//   userName: {
//     marginLeft: 12,
//     fontSize: 16,
//     textTransform: 'capitalize',
//     color: colors.text,
//   },

//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//     backgroundColor: colors.surface,
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatName: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//     color: colors.text,
//   },
//   chatMessage: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 4,
//   },
//   chatTime: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 12,
//     color: colors.textTertiary,
//   },
//   emptyList: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 16,
//     color: colors.textSecondary,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.overlay,
//   },
//   modalContainer: {
//     backgroundColor: colors.background,
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
//     color: colors.text,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButton: {
//     width: '100%',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: colors.primary,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: colors.textInverse,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   accountModalContainer: {
//     backgroundColor: colors.background,
//     borderRadius: 16,
//     padding: 20,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   memberCountText: {
//     fontSize: 12,
//     color: colors.textSecondary,
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
//     backgroundColor: colors.card,
//     marginHorizontal: 12,
//     marginVertical: 4,
//     borderRadius: 12,
//    elevation: 0.6,
//      shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.2,
//     borderColor: colors.border,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//     backgroundColor: colors.surface,
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatName: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//     color: colors.text,
//   },
//   chatMessage: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 4,
//   },
//   timeBadgeContainer: {
//     alignItems: 'flex-end',
//     minWidth: 50,
//   },
//   chatTime: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 12,
//     color: colors.textTertiary,
//   },
//   badge: {
//     backgroundColor: colors.primary,
//     borderRadius: 50,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 4,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: colors.textInverse,
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   fullScreenLoading: {
//     flex: 1,
//     backgroundColor: colors.background,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   welcomeModalOverlay: {
//     flex: 1,
//     backgroundColor: colors.overlay,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalContainer: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: colors.background,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   welcomeModalHeader: {
//     padding: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   welcomeModalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: colors.textInverse,
//     marginTop: 15,
//     textAlign: 'center',
//   },
//   welcomeModalContent: {
//     padding: 20,
//     maxHeight: '60%',
//   },
//   featureCard: {
//     backgroundColor: colors.surface,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//   },
//   featureTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//     marginTop: 10,
//   },
//   featureDescription: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 5,
//     lineHeight: 20,
//   },
//   welcomeModalFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   welcomeModalButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalButtonText: {
//     color: colors.textInverse,
//     fontSize: 18,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   mediaModalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.overlay,
//   },
//   mediaPreviewContainer: {
//     width: '90%',
//     backgroundColor: colors.background,
//     borderRadius: 10,
//     padding: 15,
//   },
//   mediaPreview: {
//     width: '100%',
//     height: 300,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   captionInput: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 5,
//     padding: 10,
//     minHeight: 50,
//     marginBottom: 15,
//     backgroundColor: colors.inputBackground,
//   },
//   mediaActionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   mediaButton: {
//     padding: 12,
//     borderRadius: 5,
//     width: '48%',
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: colors.buttonSecondary,
//   },
//   postButton: {
//     backgroundColor: colors.primary,
//   },
//   buttonText: {
//     color: colors.textInverse,
//     fontWeight: 'bold',
//   },
//   exploreIconContainer: {
//     position: 'relative',
//     marginRight: 15,
//   },
//   exploreBadge: {
//     position: 'absolute',
//     top: -6,
//     right: -5,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 5,
//     paddingVertical: 2,
//     minWidth: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: 'white',
//   },
//   exploreBadgeText: {
//     color: colors.primary,
//     fontSize: 9,
//     textTransform: 'uppercase',
//     fontWeight:'800',
//     letterSpacing: 0.3,
//   },
// });

// export default BusinessHomeScreen;


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
// import BottomNav from '../components/BottomNavSocialMedia';
// import { Divider } from 'react-native-paper';
// import SwitchAccountSheet from '../components/SwitchAccountSheet';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import LottieView from 'lottie-react-native';
// import IncomingCallModal from '../components/IncomingCallModal';
// import NotificationService from '../src/services/PushNotifications';
// import Video from 'react-native-video';
// import { useTheme } from '../src/context/ThemeContext';
// import EarningsSlideInManager from '../components/EarningsSlideInManager';
// import OnlineStatusBadge from '../components/OnlineStatusBadge';
// import { createMMKV } from 'react-native-mmkv';

// const windowWidth = Dimensions.get('window').width;

// // Initialize MMKV instances for caching
// const businessChatStorage = createMMKV({
//   id: 'business-chats-cache'
// });

// const personalChatStorage = createMMKV({
//   id: 'personal-chats-cache'
// });

// const readChatsStorage = createMMKV({
//   id: 'read-chats-cache'
// });

// const BusinessHomeScreen = ({ navigation }) => {
//   const { colors, theme, toggleTheme, isDark  } = useTheme(); 
  
//   // Mode filter state - defaults to 'business'
//   const [chatModeFilter, setChatModeFilter] = useState('business');
  
//   const [tab, setTab] = useState('Chats');
//   const [userData, setUserData] = useState([]);
//   const [chatList, setChatList] = useState([]);
//   const [businessChatList, setBusinessChatList] = useState([]);
//   const [personalChatList, setPersonalChatList] = useState([]);
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
  
//   const styles = createStyles(colors, isDark, insets); 

//   const [notificationSettings, setNotificationSettings] = useState({
//     showNotifications: true,
//     doNotDisturb: false,
//   });

//   const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

//   const fetchUnreadNotificationCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/notifications/unread-count/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       if (response.data.success) {
//         setUnreadNotificationCount(response.data.unread_count);
//       }
//     } catch (error) {
//       console.error('Error fetching unread count:', error);
//     }
//   };

//   useEffect(() => {
//     loadNotificationSettings();
//     fetchUnreadNotificationCount();
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

//   // Handle incoming call
//   const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
//   const [callerInfo, setCallerInfo] = useState({
//     profileImage: '',
//     name: 'Unknown',
//     offer: null
//   });

//   const ws = useRef(null);

//   useEffect(() => {
//     const connectCallWebSocket = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const retrieveUserId = await AsyncStorage.getItem('userData');
  
//         if (!token || !retrieveUserId) {
//           console.warn('Missing auth data, websocket not started');
//           return;
//         }
  
//         const userData = JSON.parse(retrieveUserId);
//         const currentUserId = userData.id;
//         const ROOM_ID = `user-${currentUserId}`;
//         const SIGNALING_SERVER = 'wss://api.showapp.ng';
  
//         const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;
  
//         ws.current = new WebSocket(url);
//         ws.current.binaryType = 'arraybuffer';
  
//         ws.current.onopen = () => {
//           console.log('[Call WS] Connected');
//         };
  
//         ws.current.onmessage = (evt) => {
//           let data;
//           try {
//             data = JSON.parse(evt.data);
//           } catch (e) {
//             console.error('[WS] Invalid JSON', e);
//             return;
//           }
  
//           if (data.type === 'offer') {
//             if (
//               data.offer?.targetUserId &&
//               data.offer.targetUserId !== currentUserId
//             ) {
//               return;
//             }
  
//             const callerData = data.offer?.callerInfo || {};
            
//             const profileImage = callerData.profileImage || 
//                                  data.offer?.profileImage || 
//                                  '';
            
//             const callerName = callerData.name || 
//                                data.offer?.callerName || 
//                                'Unknown Caller';
  
//             const isVideo = data.offer?.isVideoCall || false;
  
//             console.log('[Incoming Call] Caller info:', {
//               name: callerName,
//               hasProfileImage: !!profileImage,
//             });
  
//             setCallerInfo({
//               profileImage: profileImage,
//               name: callerName,
//               offer: data.offer,
//             });
  
//             setShowIncomingCallModal(true);
//           }
//         };
  
//         ws.current.onerror = (e) => {
//           //console.error('[Call WS] Error', e);
//         };
  
//         ws.current.onclose = (e) => {
//           //console.log('[Call WS] Closed', e.code, e.reason);
//         };
//       } catch (err) {
//        // console.error('[Call WS] Failed to connect', err);
//       }
//     };
  
//     connectCallWebSocket();
  
//     return () => {
//       ws.current?.close();
//     };
//   }, []);

//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   const handleAcceptCall = () => {
//     navigation.navigate('VoiceCalls', {
//       profile_image: callerInfo.profileImage,
//       name: callerInfo.name,
//       incomingOffer: callerInfo.offer,
//       isIncomingCall: true,
//       isInitiator: false
//     });
//     setShowIncomingCallModal(false);
//   };

//   const handleRejectCall = () => {
//     sendMessage({ type: 'call-ended' });
//     setShowIncomingCallModal(false);
//     setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
//   };

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       const currentList = chatModeFilter === 'business' ? businessChatList : personalChatList;
//       setFilteredChatList(currentList);
//     } else {
//       const currentList = chatModeFilter === 'business' ? businessChatList : personalChatList;
//       const filtered = currentList.filter(chat =>
//         chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredChatList(filtered);
//     }
//   }, [searchQuery, businessChatList, personalChatList, chatModeFilter]);

//   useEffect(() => {
//     const loadMode = async () => {
//       const mode = await AsyncStorage.getItem('accountMode') || 'business';
//       setAccountMode(mode);
//     };
//     loadMode();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/get-users/`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
     
//       if (response.status === 200 || response.status === 201) {
//         const uniqueUsers = response.data.filter(
//           (user, index, self) => index === self.findIndex((u) => u.id === user.id)
//         );
//         setUserData(uniqueUsers);
//       } else {
//         console.error('Failed to fetch users:', response.status);
//       }
//     } catch (error) {
//       console.log('Error fetching users:', error.message);
//     }
//   };

//   // MMKV Cache functions
//   const loadReadChats = () => {
//     try {
//       const stored = readChatsStorage.getString('readChats');
//       if (stored) {
//         const parsedSet = new Set(JSON.parse(stored));
//         setReadChats(parsedSet);
//         return parsedSet;
//       }
//       return new Set();
//     } catch (e) {
//       console.error('Load read chats error:', e);
//       return new Set();
//     }
//   };

//   const saveReadChats = (readChatsSet) => {
//     try {
//       readChatsStorage.set('readChats', JSON.stringify(Array.from(readChatsSet)));
//     } catch (e) {
//       console.error('Save read chats error:', e);
//     }
//   };

//   useEffect(() => {
//     if (readChats && readChats.size > 0) {
//       saveReadChats(readChats);
//     }
//   }, [readChats]);

//   // Load personal chats from MMKV cache
//   const loadCachedPersonalChats = () => {
//     try {
//       const cached = personalChatStorage.getString('personalChats');
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         setPersonalChatList(parsed);
//         return true;
//       }
//     } catch (e) {
//       console.error('Load cached personal chats error:', e);
//     }
//     return false;
//   };

//   // Load business chats from MMKV cache
//   const loadCachedBusinessChats = () => {
//     try {
//       const cached = businessChatStorage.getString('businessChats');
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         setBusinessChatList(parsed);
//         return true;
//       }
//     } catch (e) {
//       console.error('Load cache error:', e);
//     }
//     return false;
//   };

//   // Cache business chats to MMKV
//   const cacheBusinessChats = (chats) => {
//     try {
//       businessChatStorage.set('businessChats', JSON.stringify(chats));
//     } catch (e) {
//       console.error('Cache business chats error:', e);
//     }
//   };

//   // Cache personal chats to MMKV
//   const cachePersonalChats = (chats) => {
//     try {
//       personalChatStorage.set('personalChats', JSON.stringify(chats));
//     } catch (e) {
//       console.error('Cache personal chats error:', e);
//     }
//   };

//   // Fetch personal chats from API (same as HomeScreen)
//   const fetchPersonalChats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return [];
      
//       const response = await axios.get(
//         `${API_ROUTE}/api/chat/list/?account_mode=personal`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       const filteredChats = response.data.chats.filter(chat => chat.type !== 'channel');
//       const uniqueChats = [];
//       const seenIds = new Set();

//       filteredChats.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;

//         if (!seenIds.has(chatIdentifier)) {
//           seenIds.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           const isRead = readChats.has(chatKey);
//           uniqueChats.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: isRead ? 0 : (chat.unread_count || 0),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null,
//             key: `${chat.id}-${chat.type}`,
//           });
//         }
//       });

//       setPersonalChatList(uniqueChats);
//       cachePersonalChats(uniqueChats);
      
//       return uniqueChats;
//     } catch (err) {
//       console.error('Failed to load personal chats:', err.response?.data || err.message);
//       return [];
//     }
//   };

//   // Fetch business chats from API
//   const fetchBusinessChats = async () => {
//     setIsLoading(true);
//     setError(null);
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       const response = await axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       const filteredChats = response.data.chats.filter(chat =>
//         chat.type !== 'channel' 
//       );
      
//       const uniqueChats = [];
//       const seenIds = new Set();
//       filteredChats.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!seenIds.has(chatIdentifier)) {
//           seenIds.add(chatIdentifier);
//           uniqueChats.push({
//             ...chat,
//             id: chatIdentifier
//           });
//         }
//       });

//       const chats = uniqueChats.map((chat) => {
//         const chatKey = `${chat.id}-${chat.type}`;
//         const isRead = readChats.has(chatKey);
//         return {
//           id: chat.id,
//           unread_count: isRead ? 0 : (chat.unread_count || 0),
//           name: chat.name || 'Unknown',
//           content: chat.content || '[media]',
//           time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//           type: chat.type,
//           members_count: chat.members_count,
//           receiverId: chat.type === 'single' ? chat.id : null,
//           group_slug: chat.group_slug || null
//         };
//       });

//       setBusinessChatList(chats);
//       cacheBusinessChats(chats);
      
//       if (chatModeFilter === 'business') {
//         setFilteredChatList(chats);
//       }
      
//       return chats;
//     } catch (err) {
//       console.error('Failed to load business chat list:', err.response?.data || err.message);
//       setError('Failed to load chats. Please try again.');
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch all chats
//   const fetchAllChats = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const [businessChats, personalChats] = await Promise.all([
//         fetchBusinessChats(),
//         fetchPersonalChats()
//       ]);
      
//       return { businessChats, personalChats };
//     } catch (err) {
//       console.error('Failed to load chats:', err);
//       setError('Failed to load chats. Please try again.');
//       return { businessChats: [], personalChats: [] };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Load initial data from MMKV cache
//   useEffect(() => {
//     async function loadInitialData() {
//       setIsInitialLoading(true);
      
//       const loadedReadChats = loadReadChats();
      
//       const hasBusinessCache = loadCachedBusinessChats();
//       const hasPersonalCache = loadCachedPersonalChats();
      
//       if (hasBusinessCache) {
//         setBusinessChatList(prev =>
//           prev.map(chat => {
//             const chatKey = `${chat.id}-${chat.type}`;
//             const isRead = loadedReadChats.has(chatKey);
//             return isRead ? { ...chat, unread_count: 0 } : chat;
//           })
//         );
//       }
      
//       if (hasPersonalCache) {
//         setPersonalChatList(prev =>
//           prev.map(chat => {
//             const chatKey = `${chat.id}-${chat.type}`;
//             const isRead = loadedReadChats.has(chatKey);
//             return isRead ? { ...chat, unread_count: 0 } : chat;
//           })
//         );
//       }
      
//       const initialList = chatModeFilter === 'business' 
//         ? (hasBusinessCache ? businessChatList : [])
//         : (hasPersonalCache ? personalChatList : []);
//       setFilteredChatList(initialList);
      
//       setIsInitialLoading(false);
//     }
    
//     loadInitialData();
//   }, []);

//   const markMessagesAsRead = async (chatId, chatType) => {
//     const chatKey = `${chatId}-${chatType}`;
    
//     if (readChats.has(chatKey)) {
//       return;
//     }
    
//     setReadChats(prev => {
//       const newSet = new Set(prev);
//       newSet.add(chatKey);
//       saveReadChats(newSet);
//       return newSet;
//     });
    
//     const updateList = (list) => 
//       list.map(chat =>
//         chat.id === chatId && chat.type === chatType ? { ...chat, unread_count: 0 } : chat
//       );
    
//     setBusinessChatList(updateList);
//     setPersonalChatList(updateList);
//     setFilteredChatList(updateList);
    
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await axios.post(
//         `${API_ROUTE}/chatmessage/mark-read/`,
//         {
//           chat_id: chatId,
//           chat_type: chatType,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (res.status !== 200 && res.status !== 201) {
//         throw new Error('API call failed');
//       }
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//       setReadChats(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(chatKey);
//         saveReadChats(newSet);
//         return newSet;
//       });
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchAllChats();
//       fetchUserData();
//     }, [])
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchChatListSilently();
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchChatListSilently = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;
      
//       const [businessResponse, personalResponse] = await Promise.all([
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         }),
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         })
//       ]);
      
//       // Process business chats
//       const businessFiltered = businessResponse.data.chats.filter(chat => chat.type !== 'channel');
//       const businessUnique = [];
//       const businessSeen = new Set();
//       businessFiltered.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!businessSeen.has(chatIdentifier)) {
//           businessSeen.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           const isRead = readChats.has(chatKey);
//           businessUnique.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: isRead ? 0 : (chat.unread_count || 0),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null
//           });
//         }
//       });
      
//       // Process personal chats
//       const personalFiltered = personalResponse.data.chats.filter(chat => chat.type !== 'channel');
//       const personalUnique = [];
//       const personalSeen = new Set();
//       personalFiltered.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!personalSeen.has(chatIdentifier)) {
//           personalSeen.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           const isRead = readChats.has(chatKey);
//           personalUnique.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: isRead ? 0 : (chat.unread_count || 0),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null
//           });
//         }
//       });
      
//       checkForNewMessages(businessUnique);
//       checkForNewMessages(personalUnique);
      
//       setBusinessChatList(prev => {
//         if (JSON.stringify(prev) !== JSON.stringify(businessUnique)) {
//           cacheBusinessChats(businessUnique);
//           return businessUnique;
//         }
//         return prev;
//       });
      
//       setPersonalChatList(personalUnique);
//       cachePersonalChats(personalUnique);
      
//       const currentList = chatModeFilter === 'business' ? businessUnique : personalUnique;
//       setFilteredChatList(prevFiltered => {
//         if (searchQuery.trim() === '') {
//           return currentList;
//         }
//         const filtered = currentList.filter(chat =>
//           chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
//         );
//         return filtered;
//       });
      
//     } catch (err) {
//       console.error('Silent refresh error:', err);
//     }
//   };

//   const checkForNewMessages = (newChats) => {
//     if (!notificationSettings.showNotifications || notificationSettings.doNotDisturb) {
//       return;
//     }
//     newChats.forEach(chat => {
//       if (chat.unread_count > 0) {
//         const notificationKey = `notified_${chat.id}_${chat.unread_count}`;
       
//         AsyncStorage.getItem(notificationKey).then(alreadyNotified => {
//           if (!alreadyNotified) {
//             NotificationService.localNotification(
//               chat.name,
//               chat.content || 'New message',
//               {
//                 chatId: chat.id,
//                 chatType: chat.type,
//                 name: chat.name,
//               }
//             );
           
//             AsyncStorage.setItem(notificationKey, 'true');
//           }
//         });
//       }
//     });
//   };

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
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 200 || response.status === 201) {
//         const profile = response.data;
//         return profile;
//       } else {
//         console.warn('Failed to fetch profile');
//         return null;
//       }
//     } catch (err) {
//       console.error('fetchProfile error:', err);
//       return null;
//     }
//   };

//   const switchAccount = async (account) => {
//     setIsLoading(true);
//     try {
//       await AsyncStorage.setItem('accountMode', account);
//       setAccountMode(account);
//       if (account === 'personal') {
//         fetchChatList();
//       } else {
//         const profile = await fetchProfile();
       
//         if (profile && profile.name && profile.name.trim() !== '') {
//           navigation.navigate('BusinessHome');
//         } else {
//           navigation.navigate('BusinessSetup');
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const highlightSearchText = (text = '', query) => {
//     if (!query || !text || typeof text !== 'string') return text;
   
//     const index = text.toLowerCase().indexOf(query.toLowerCase());
//     if (index === -1) return text;
//     return (
//       <Text>
//         {text.substring(0, index)}
//         <Text style={{ backgroundColor: isDark ? '#fbbf24' : '#FFEB3B', color: '#000' }}>
//           {text.substring(index, index + query.length)}
//         </Text>
//         {text.substring(index + query.length)}
//       </Text>
//     );
//   };

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

//   const handlePostStatus = async (media, caption) => {
//     if (!media) {
//       Alert.alert('Error', 'No media selected');
//       return;
//     }
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
     
//       let fileExt = media.uri.split('.').pop().toLowerCase();
//       let type = media.type;
     
//       if (!type) {
//         if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
//           type = 'image/jpeg';
//         } else if (['mp4', 'mov'].includes(fileExt)) {
//           type = 'video/mp4';
//         }
//       }
//       formData.append('media', {
//         uri: media.uri,
//         type: type,
//         name: `status_${Date.now()}.${fileExt}`,
//       });
//       if (caption) {
//         formData.append('text', caption);
//       }
//       const response = await axios.post(`${API_ROUTE}/status/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       Alert.alert('Success', 'Status posted successfully!');
     
//       return response.data;
//     } catch (error) {
//       Alert.alert('Error', 'Failed to post status');
//       throw error;
//     }
//   };

//   const handleOohmail = () => {
//     Linking.openURL('https://ooshmail.com');
//   }

//   const ellipsisRef = useRef(null);
//   const toggleDropdown = () => {
//     if (showDropdown) {
//       setShowDropdown(false);
//     } else {
//       ellipsisRef.current?.measure((fx, fy, width, height, px, py) => {
//         setButtonLayout({ x: px, y: py, width, height });
//         setShowDropdown(true);
//       });
//     }
//   };

//   // Switch between personal and business chat views
//   const switchChatMode = (mode) => {
//     setChatModeFilter(mode);
//     setSearchQuery('');
    
//     const currentList = mode === 'business' ? businessChatList : personalChatList;
//     setFilteredChatList(currentList);
//   };

//   return (
//     <View style={[styles.container,{ backgroundColor: colors.backgroundSecondary }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'light-content'}
//         backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
//       />
      
//       <LinearGradient
//         colors={[colors.primary, colors.primary, colors.primary]}
//         style={styles.header}
//       >
//         <View style={[styles.headerTop,{ paddingTop: insets.top }]}>
//           <Text style={styles.headerTitle}>Chat</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity
//               style={styles.exploreIconContainer}
//               onPress={toggleTheme}
//             >
//               <Icon 
//                 style={{ marginRight: 10 }}
//                 name={isDark ? 'moon' : 'sunny'}
//                 size={25} 
//                 color="#FFFFFF" 
//               />
//             </TouchableOpacity>
            
//             <TouchableOpacity onPress={handleOohmail} style={styles.exploreIconContainer}>
//               <Icon name="compass-outline" size={27} color="#fff" style={{marginRight: 20}} />
//               <View style={styles.exploreBadge}>
//                 <Text style={styles.exploreBadgeText}>e-Mail</Text>
//               </View>
//             </TouchableOpacity>
            
//             <TouchableOpacity ref={ellipsisRef} onPress={toggleDropdown}>
//               <Icon name="ellipsis-vertical" size={25} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
        
//         <View style={styles.tabRow}>
//           {['Chats', 'Status', 'Calls'].map((item) => (
//             <TouchableOpacity
//               key={item}
//               onPress={() => {
//                 if (item === 'Status') {
//                   navigation.navigate('BStatusBar');
//                 } else if (item === 'Calls') {
//                   navigation.navigate('BCalls');
//                 } else {
//                   setTab(item);
//                 }
//               }}
//             >
//               <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
//               {tab === item && <View style={styles.tabUnderline} />}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </LinearGradient>
     
//       {/* Integrated Search Box with Mode Switcher */}
//       <View style={styles.searchSection}>
//         <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
//           <Icon name="search" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
//           <TextInput
//             placeholder={`Search ${chatModeFilter === 'business' ? 'business' : 'personal'} chats...`}
//             style={[styles.searchInput, { color: colors.text }]}
//             placeholderTextColor={colors.placeholder}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             clearButtonMode="while-editing"
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Icon name="close-circle" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           )}
//         </View>
        
//         {/* Mode Switcher Buttons - Small, integrated with search */}
//         <View style={styles.modeSwitcherContainer}>
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'business' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('business')}
//           >
//             <Icon 
//               name="briefcase-outline" 
//               size={14} 
//               color={chatModeFilter === 'business' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'business' && styles.modeChipTextActive
//             ]}>
//               Business
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'personal' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('personal')}
//           >
//             <Icon 
//               name="person-outline" 
//               size={14} 
//               color={chatModeFilter === 'personal' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'personal' && styles.modeChipTextActive
//             ]}>
//               Personal
//             </Text>
//           </TouchableOpacity>
          
          
//         </View>
//       </View>
      
//       {/* <View style={styles.sectionTabs}>
//         <Text style={[styles.sectionTab, { fontWeight: '600', color: colors.primary }]}>
//           {searchQuery ? 'SEARCH RESULTS' : `ALL ${chatModeFilter.toUpperCase()} CHATS`}
//         </Text>
//         {!searchQuery && <Text style={styles.sectionTab}></Text>}
//       </View> */}

//       <FlatList
//         data={filteredChatList}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => {
//               markMessagesAsRead(item.id, item.type);
//               if (item.type === 'group') {
//                 navigation.navigate('BusinessGroupChat', {
//                   groupId: item.id,
//                   groupSlug: item.group_slug,
//                   name: item.name,
//                   chatType: 'group',
//                   profile_image: item.avatar,
//                   members_count: item.members_count,
//                   creator_id: item.creator_id
//                 });
//               } else {
//                 navigation.navigate('BPrivateChat', {
//                   receiverId: item.receiverId || item.id,
//                   name: item.name,
//                   chatType: 'single',
//                   profile_image: item.avatar,
//                   userIdd: item.receiverId || item.id
//                 });
//               }
//             }}
//             style={[styles.chatItem, { backgroundColor: colors.card }]}
//           >
//             <View style={styles.avatarContainer}>
//               <Image
//                 source={
//                   item.avatar
//                     ? { uri: item.avatar }
//                     : item.type === 'group'
//                     ? { uri: 'https://via.placeholder.com/50/cccccc/808080?text=G' }
//                     : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                 }
//                 style={[styles.avatar, { backgroundColor: colors.surface }]}
//               />
//               {item.type === 'single' && (
//                 <OnlineStatusBadge 
//                   userId={item.receiverId || item.id}
//                   dotSize={14}
//                   position="bottom-right"
//                   borderWidth={2}
//                   borderColor={colors.card}
//                 />
//               )}
//               {item.type === 'group' && (
//                 <View style={[styles.groupBadge, { backgroundColor: colors.primary }]}>
//                   <Icon name="people" size={12} color="#fff" />
//                 </View>
//               )}
//             </View>
            
//             <View style={styles.chatContent}>
//               <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                 <Text style={[styles.chatName, { color: colors.text }]}>
//                   {highlightSearchText(item.name, searchQuery) ||
//                   (item.type === 'group' ? 'Group Chat' : 'Unnamed Chat')}
//                 </Text>
//                 {item.type === 'group' && (
//                   <>
//                     <Icon
//                       name="people-outline"
//                       size={16}
//                       color={colors.textSecondary}
//                       style={{marginLeft: 6}}
//                     />
//                     <Text style={[styles.memberCountText, { color: colors.textSecondary }]}>
//                       {item.members_count || 0}
//                     </Text>
//                     {item.is_creator && (
//                       <Icon
//                         name="star"
//                         size={14}
//                         color="#FFD700"
//                         style={{marginLeft: 4}}
//                       />
//                     )}
//                   </>
//                 )}
//               </View>
//               <Text style={[styles.chatMessage, { color: colors.textSecondary }]} numberOfLines={1}>
//                 {highlightSearchText(item.content ||
//                   (item.type === 'group'
//                     ? (item.is_creator ? 'You created this group' : 'No messages yet')
//                     : '[No message]'),
//                 searchQuery)}
//               </Text>
//             </View>
//             <View style={styles.timeBadgeContainer}>
//               <Text style={[styles.chatTime, { color: colors.textTertiary }]}>{item.time || ''}</Text>
//               {(!readChats.has(`${item.id}-${item.type}`) && item.unread_count > 0) && (
//                 <View style={[styles.badge, { backgroundColor: colors.primary }]}>
//                   <Text style={styles.badgeText}>
//                     {item.unread_count > 9 ? '9+' : item.unread_count}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={() => (
//           isLoading ? (
//             <Text style={[styles.emptyText, { marginTop: 80, textAlign: 'center', color: colors.textSecondary }]}>
//               Loading chats...
//             </Text>
//           ) : error ? (
//             <View style={styles.emptyList}>
//               <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
//               <TouchableOpacity onPress={fetchAllChats}>
//                 <Text style={[styles.emptyText, { color: colors.primary }]}>Retry</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.emptyList}>
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {searchQuery ? 'No matching chats found' : `No ${chatModeFilter} chats available`}
//               </Text>
//               {!searchQuery && (
//                 <TouchableOpacity 
//                   onPress={() => {
//                     navigation.navigate(
//                       chatModeFilter === 'business' ? 'UserContactList' : 'UserContactListPersonalAccount'
//                     );
//                   }}
//                 >
//                   <Text style={[styles.emptyText, { color: colors.primary, marginTop: 10, fontFamily: 'SourceSansPro-Medium' }]}>
//                     Start a new {chatModeFilter} chat
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )
//         )}
//         contentContainerStyle={{ 
//           paddingBottom: insets.bottom + 120,
//         }}
//       />
      
//       <BottomNav 
//         navigation={navigation} 
//         setShowAccountModal={setShowAccountModal}
//         activeRoute="Home" 
//         style={{ zIndex: 9999 }}
//       />
      
//       <Modal
//         visible={showMediaModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowMediaModal(false)}>
//         <View style={[styles.mediaModalContainer, { backgroundColor: colors.overlay }]}>
//           <View style={[styles.mediaPreviewContainer, { backgroundColor: colors.background }]}>
//             {media?.type?.includes('video') ? (
//               <Video
//                 source={{uri: media.uri}}
//                 style={styles.mediaPreview}
//                 resizeMode="cover"
//                 repeat
//                 muted
//               />
//             ) : (
//               <Image source={{uri: media?.uri}} style={styles.mediaPreview} />
//             )}
//             <TextInput
//               style={[styles.captionInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBackground }]}
//               placeholder="Add caption to your status (optional)"
//               value={caption}
//               placeholderTextColor={colors.placeholder}
//               onChangeText={setCaption}
//               multiline
//             />
//             <View style={styles.mediaActionButtons}>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.cancelButton, { backgroundColor: colors.buttonSecondary }]}
//                 onPress={() => {
//                   setMedia(null);
//                   setCaption('');
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.postButton, { backgroundColor: colors.primary }]}
//                 onPress={() => {
//                   handlePostStatus(media, caption);
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={[styles.buttonText, { color: colors.textInverse }]}>Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
      
//       <Modal
//         visible={showAccountModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAccountModal(false)}
//       >
//         <Animated.View
//           style={{
//             flex: 1,
//             backgroundColor: colors.overlay,
//             justifyContent: 'center',
//             alignItems: 'center',
//             opacity: fadeAnim,
//           }}
//         >
//           <View
//             style={{
//               width: '88%',
//               backgroundColor: colors.background,
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
//             <TouchableOpacity
//               onPress={() => setShowAccountModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 backgroundColor: colors.buttonSecondary,
//                 borderRadius: 50,
//                 padding: 8,
//               }}
//             >
//               <Icon name="close" size={22} color={colors.text} />
//             </TouchableOpacity>
     
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: '700',
//                 color: colors.text,
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
//                 color: colors.textSecondary,
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
//                 backgroundColor: colors.buttonSecondary,
//               }}
//               onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('PHome')
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
//                 Switch Account
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>
     
//       <TouchableOpacity
//         style={[styles.fab2, { backgroundColor: colors.buttonSecondary, borderColor: colors.border }]}
//         onPress={() => {
//           navigation.navigate(chatModeFilter === 'business' ? 'UserContactList' : 'UserContactListPersonalAccount');
//         }}
//       >
//         <Icon name="chatbox-ellipses" size={24} color={colors.primary} />
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
//                   backgroundColor: colors.background,
//                 },
//               ]}
//             >
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Advertise');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Advertise</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('CreateChannel');
//               }}>
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Create Channel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('Broadcast');
//               }}>
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Official Broadcast</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('GroupConnect');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>New Group</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Broadcaster', {
//                     roomName: 'match-123',
//                     streamId: 'stream-1',
//                   });
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Go Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('LiveStreaming');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Watch Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('SupplierNotificationScreen');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Deals</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Explore');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Business Tools</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('EarningDashbord');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Earn Money</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('CreateCatalog');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Catalog</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('MarketPlace');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Market Place</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('BSettings');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Settings</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('PHome');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text, fontWeight: 'bold' }]}>Switch Account</Text>
//               </TouchableOpacity>
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//       <EarningsSlideInManager />
//     </View>
//   );
// };

// const createStyles = (colors, isDark, insets) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.backgroundSecondary,
//   },
//   fab2: {
//     position: 'absolute',
//     bottom: 120,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     alignItems: 'center',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     zIndex: 1000,
//     borderWidth: 1,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 200,
//     right: 20,
//     width: 53,
//     height: 53,
//     borderRadius: 28,
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     zIndex: 1000,
//   },
//   header: {
//     paddingBottom: 10,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
//     backgroundColor: colors.primary,
//     elevation: 2,
//     zIndex: 1000,
//   },
//   headerTop: {
//     marginTop: Platform.OS === 'android' ? 10 : 10,
//     paddingHorizontal: 20,
//     height: Platform.OS === 'android' ? 90 : 130,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   timeBadgeContainer: {
//     alignItems: 'flex-end',
//     minWidth: 50,
//   },
//   badge: {
//     borderRadius: 50,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 4,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: 40,
//     right: 0,
//     backgroundColor: colors.backgroundSecondary,
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: isDark ? 0.3 : 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 2000,
//     borderWidth: 1,
//     borderColor: colors.border,
//     minWidth: 220,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     color: colors.text,
//     fontFamily: 'SourceSansPro-Regular',
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: Platform.OS === 'android' ? 28 : 35,
//     fontWeight: 'bold',
//     letterSpacing: 0.7,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tabRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   tabText: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 16,
//     fontFamily: 'SourceSansPro-Bold',
//     paddingVertical: 6,
//   },
//   tabTextActive: {
//     color: 'white',
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontWeight: '600',
//   },
//   tabUnderline: {
//     height: 3,
//     backgroundColor: 'white',
//     borderRadius: 2,
//     marginTop: 4,
//   },
//   // Search Section with integrated mode switcher
//   searchSection: {
//     marginHorizontal: 16,
//     marginTop: 12,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     height: 44,
//     elevation: 0.5,
//     shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.0,
//     borderColor: colors.border,
//     zIndex: 500,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: 'SourceSansPro-Regular',
//     paddingRight: 8,
//     height: 44,
//   },
//   modeSwitcherContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginTop: 8,
//     gap: 8,
//   },
//   modeChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 5,
//     backgroundColor: colors.buttonSecondary,
//     borderWidth: 1,
//     borderColor: colors.border,
//     gap: 4,
//   },
//   modeChipActive: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   modeChipText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: colors.textSecondary,
//   },
//   modeChipTextActive: {
//     color: '#fff',
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
//     color: colors.textSecondary,
//   },
//   userItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomColor: colors.border,
//     borderBottomWidth: 1,
//   },
//   notificationIconContainer: {
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -5,
//     right: 15,
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   notificationBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   userName: {
//     marginLeft: 12,
//     fontSize: 16,
//     textTransform: 'capitalize',
//     color: colors.text,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: 12,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },
//   groupBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: colors.card,
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatName: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//   },
//   chatMessage: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   chatTime: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 12,
//   },
//   emptyList: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.overlay,
//   },
//   modalContainer: {
//     backgroundColor: colors.background,
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
//     color: colors.text,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButton: {
//     width: '100%',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: colors.primary,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: colors.textInverse,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   accountModalContainer: {
//     backgroundColor: colors.background,
//     borderRadius: 16,
//     padding: 20,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   memberCountText: {
//     fontSize: 12,
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
//     marginHorizontal: 12,
//     marginVertical: 4,
//     borderRadius: 12,
//     elevation: 0.6,
//     shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.2,
//     borderColor: colors.border,
//   },
//   fullScreenLoading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalOverlay: {
//     flex: 1,
//     backgroundColor: colors.overlay,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalContainer: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: colors.background,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   welcomeModalHeader: {
//     padding: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   welcomeModalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: colors.textInverse,
//     marginTop: 15,
//     textAlign: 'center',
//   },
//   welcomeModalContent: {
//     padding: 20,
//     maxHeight: '60%',
//   },
//   featureCard: {
//     backgroundColor: colors.surface,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//   },
//   featureTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//     marginTop: 10,
//   },
//   featureDescription: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 5,
//     lineHeight: 20,
//   },
//   welcomeModalFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   welcomeModalButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalButtonText: {
//     color: colors.textInverse,
//     fontSize: 18,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   mediaModalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mediaPreviewContainer: {
//     width: '90%',
//     borderRadius: 10,
//     padding: 15,
//   },
//   mediaPreview: {
//     width: '100%',
//     height: 300,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   captionInput: {
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     minHeight: 50,
//     marginBottom: 15,
//   },
//   mediaActionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   mediaButton: {
//     padding: 12,
//     borderRadius: 5,
//     width: '48%',
//     alignItems: 'center',
//   },
//   cancelButton: {},
//   postButton: {},
//   buttonText: {
//     fontWeight: 'bold',
//   },
//   exploreIconContainer: {
//     position: 'relative',
//     marginRight: 15,
//   },
//   exploreBadge: {
//     position: 'absolute',
//     top: -6,
//     right: -5,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 5,
//     paddingVertical: 2,
//     minWidth: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: 'white',
//   },
//   exploreBadgeText: {
//     color: colors.primary,
//     fontSize: 9,
//     textTransform: 'uppercase',
//     fontWeight: '800',
//     letterSpacing: 0.3,
//   },
// });

// export default BusinessHomeScreen;


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
// import BottomNav from '../components/BottomNavSocialMedia';
// import { Divider } from 'react-native-paper';
// import SwitchAccountSheet from '../components/SwitchAccountSheet';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import LottieView from 'lottie-react-native';
// import IncomingCallModal from '../components/IncomingCallModal';
// import NotificationService from '../src/services/PushNotifications';
// import Video from 'react-native-video';
// import { useTheme } from '../src/context/ThemeContext';
// import EarningsSlideInManager from '../components/EarningsSlideInManager';
// import OnlineStatusBadge from '../components/OnlineStatusBadge';
// import { createMMKV } from 'react-native-mmkv';

// const windowWidth = Dimensions.get('window').width;

// // Initialize MMKV instances for caching
// const businessChatStorage = createMMKV({
//   id: 'business-chats-cache'
// });

// const personalChatStorage = createMMKV({
//   id: 'personal-chats-cache'
// });

// const readChatsStorage = createMMKV({
//   id: 'read-chats-cache'
// });

// const BusinessHomeScreen = ({ navigation }) => {
//   const { colors, theme, toggleTheme, isDark  } = useTheme(); 
  
//   // Mode filter state - 'all', 'business', or 'personal'
//   const [chatModeFilter, setChatModeFilter] = useState('business');
  
//   const [tab, setTab] = useState('Chats');
//   const [userData, setUserData] = useState([]);
//   const [chatList, setChatList] = useState([]);
//   const [businessChatList, setBusinessChatList] = useState([]);
//   const [personalChatList, setPersonalChatList] = useState([]);
//   const [combinedChatList, setCombinedChatList] = useState([]);
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
  
//   const styles = createStyles(colors, isDark, insets); 

//   const [notificationSettings, setNotificationSettings] = useState({
//     showNotifications: true,
//     doNotDisturb: false,
//   });

//   const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

//   const fetchUnreadNotificationCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/notifications/unread-count/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       if (response.data.success) {
//         setUnreadNotificationCount(response.data.unread_count);
//       }
//     } catch (error) {
//       console.error('Error fetching unread count:', error);
//     }
//   };

//   useEffect(() => {
//     loadNotificationSettings();
//     fetchUnreadNotificationCount();
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

//   // Handle incoming call
//   const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
//   const [callerInfo, setCallerInfo] = useState({
//     profileImage: '',
//     name: 'Unknown',
//     offer: null
//   });

//   const ws = useRef(null);

//   useEffect(() => {
//     const connectCallWebSocket = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const retrieveUserId = await AsyncStorage.getItem('userData');
  
//         if (!token || !retrieveUserId) {
//           console.warn('Missing auth data, websocket not started');
//           return;
//         }
  
//         const userData = JSON.parse(retrieveUserId);
//         const currentUserId = userData.id;
//         const ROOM_ID = `user-${currentUserId}`;
//         const SIGNALING_SERVER = 'wss://api.showapp.ng';
  
//         const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;
  
//         ws.current = new WebSocket(url);
//         ws.current.binaryType = 'arraybuffer';
  
//         ws.current.onopen = () => {
//           console.log('[Call WS] Connected');
//         };
  
//         ws.current.onmessage = (evt) => {
//           let data;
//           try {
//             data = JSON.parse(evt.data);
//           } catch (e) {
//             console.error('[WS] Invalid JSON', e);
//             return;
//           }
  
//           if (data.type === 'offer') {
//             if (
//               data.offer?.targetUserId &&
//               data.offer.targetUserId !== currentUserId
//             ) {
//               return;
//             }
  
//             const callerData = data.offer?.callerInfo || {};
            
//             const profileImage = callerData.profileImage || 
//                                  data.offer?.profileImage || 
//                                  '';
            
//             const callerName = callerData.name || 
//                                data.offer?.callerName || 
//                                'Unknown Caller';
  
//             const isVideo = data.offer?.isVideoCall || false;
  
//             console.log('[Incoming Call] Caller info:', {
//               name: callerName,
//               hasProfileImage: !!profileImage,
//             });
  
//             setCallerInfo({
//               profileImage: profileImage,
//               name: callerName,
//               offer: data.offer,
//             });
  
//             setShowIncomingCallModal(true);
//           }
//         };
  
//         ws.current.onerror = (e) => {
//           //console.error('[Call WS] Error', e);
//         };
  
//         ws.current.onclose = (e) => {
//           //console.log('[Call WS] Closed', e.code, e.reason);
//         };
//       } catch (err) {
//        // console.error('[Call WS] Failed to connect', err);
//       }
//     };
  
//     connectCallWebSocket();
  
//     return () => {
//       ws.current?.close();
//     };
//   }, []);



// // Add these state variables
// const [wsConnected, setWsConnected] = useState(false);
// const chatWs = useRef(null);

// const connectChatWebSocket = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const retrieveUserId = await AsyncStorage.getItem('userData');
    
//     if (!token || !retrieveUserId) {
//       console.log('[Chat WS] Missing auth data');
//       return;
//     }
    
//     const userData = JSON.parse(retrieveUserId);
//     const currentUserId = userData.id;
    
//     // Use wss for secure connection
//     const CHAT_SERVER = 'wss://api.showapp.ng';
//     // Or use ws for non-secure (if SSL is not configured)
//     // const CHAT_SERVER = 'ws://api.showapp.ng';
    
//     // Build the WebSocket URL with token in query string
//     const url = `${CHAT_SERVER}/ws/chat/${currentUserId}/?token=${token}`;
    
//     console.log('[Chat WS] Connecting to:', url.replace(token, '***'));
    
//     // Close existing connection if any
//     if (chatWs.current) {
//       chatWs.current.close();
//       chatWs.current = null;
//     }
    
//     chatWs.current = new WebSocket(url);
    
//     // Connection timeout
//     const connectionTimeout = setTimeout(() => {
//       if (chatWs.current && chatWs.current.readyState !== WebSocket.OPEN) {
//         console.log('[Chat WS] Connection timeout');
//         chatWs.current.close();
//         setWsConnected(false);
//       }
//     }, 10000);
    
//     chatWs.current.onopen = () => {
//       clearTimeout(connectionTimeout);
//       console.log('[Chat WS] Connected successfully');
//       setWsConnected(true);
//       setWsError(null);
//     };
    
//     chatWs.current.onmessage = (evt) => {
//       try {
//         const data = JSON.parse(evt.data);
//         console.log('[Chat WS] Message received:', data.type);
        
//         if (data.type === 'new_message') {
//           // Handle new message
//           handleNewMessage(data);
//         } else if (data.type === 'message_read') {
//           // Handle message read confirmation
//           console.log('[Chat WS] Message read confirmation:', data);
//         } else if (data.type === 'typing') {
//           // Handle typing indicator (optional)
//           console.log('[Chat WS] Typing indicator:', data);
//         }
//       } catch (error) {
//         console.error('[Chat WS] Error parsing message:', error);
//       }
//     };
    
//     chatWs.current.onerror = (error) => {
//       clearTimeout(connectionTimeout);
//       console.error('[Chat WS] Error:', error);
//       setWsConnected(false);
//       setWsError('WebSocket connection error');
//     };
    
//     chatWs.current.onclose = (event) => {
//       clearTimeout(connectionTimeout);
//       console.log(`[Chat WS] Disconnected - Code: ${event.code}, Reason: ${event.reason}`);
//       setWsConnected(false);
      
//       // Don't auto-reconnect if it was a normal closure
//       if (event.code !== 1000) {
//         // Attempt to reconnect after 5 seconds
//         setTimeout(() => {
//           console.log('[Chat WS] Attempting to reconnect...');
//           connectChatWebSocket();
//         }, 5000);
//       }
//     };
    
//   } catch (error) {
//     console.error('[Chat WS] Failed to connect:', error);
//     setWsConnected(false);
//     setWsError(error.message);
//   }
// };

// // Add this polling function as a fallback
// const startPolling = () => {
//   // Clear any existing interval
//   if (pollingInterval.current) {
//     clearInterval(pollingInterval.current);
//   }
  
//   // Poll every 5 seconds when app is in foreground
//   pollingInterval.current = setInterval(async () => {
//     try {
//       // Check if app is in foreground
//       const appState = AppState.currentState;
//       if (appState !== 'active') return;
      
//       // Only poll if not already loading
//       if (isLoading) return;
      
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;
      
//       // Fetch updated chat list
//       const [businessResponse, personalResponse] = await Promise.all([
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//           timeout: 5000,
//         }),
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//           timeout: 5000,
//         })
//       ]);
      
//       // Process and update chats
//       processNewChats(businessResponse.data.chats, 'business');
//       processNewChats(personalResponse.data.chats, 'personal');
      
//     } catch (error) {
//       // Silent fail for polling
//     }
//   }, 5000); // Poll every 5 seconds
// };

// // Process new chats and update unread counts
// const processNewChats = (newChats, mode) => {
//   const filteredChats = newChats.filter(chat => chat.type !== 'channel');
  
//   filteredChats.forEach(newChat => {
//     const chatIdentifier = newChat.type === 'single'
//       ? newChat.participants?.find(id => id !== newChat.current_user_id) || newChat.id
//       : newChat.group_slug || newChat.id;
    
//     const chatKey = `${chatIdentifier}-${newChat.type}`;
//     const isRead = readChats.has(chatKey);
    
//     // Get current list
//     const currentList = mode === 'business' ? businessChatList : personalChatList;
//     const existingChat = currentList.find(chat => 
//       chat.id === chatIdentifier && chat.type === newChat.type
//     );
    
//     // If there's a new message and it's not read, update the list
//     if (existingChat) {
//       const newUnreadCount = isRead ? 0 : (newChat.unread_count || 0);
      
//       if (newUnreadCount > existingChat.unread_count || 
//           newChat.content !== existingChat.content) {
        
//         // Update the chat in the list
//         const updateList = (list) => {
//           const updatedList = list.map(chat => {
//             if (chat.id === chatIdentifier && chat.type === newChat.type) {
//               return {
//                 ...chat,
//                 unread_count: newUnreadCount,
//                 content: newChat.content || chat.content,
//                 time: new Date(newChat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 timestamp: newChat.timestamp
//               };
//             }
//             return chat;
//           });
          
//           // Sort by timestamp (newest first)
//           updatedList.sort((a, b) => {
//             const timeA = new Date(a.timestamp || a.time).getTime();
//             const timeB = new Date(b.timestamp || b.time).getTime();
//             return timeB - timeA;
//           });
          
//           return updatedList;
//         };
        
//         // Update the appropriate list
//         if (mode === 'business') {
//           setBusinessChatList(prev => updateList(prev));
//         } else {
//           setPersonalChatList(prev => updateList(prev));
//         }
        
//         // Also update combined list
//         setCombinedChatList(prev => {
//           const updatedList = prev.map(chat => {
//             if (chat.id === chatIdentifier && chat.type === newChat.type) {
//               return {
//                 ...chat,
//                 unread_count: newUnreadCount,
//                 content: newChat.content || chat.content,
//                 time: new Date(newChat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 timestamp: newChat.timestamp
//               };
//             }
//             return chat;
//           });
          
//           updatedList.sort((a, b) => {
//             const timeA = new Date(a.timestamp || a.time).getTime();
//             const timeB = new Date(b.timestamp || b.time).getTime();
//             return timeB - timeA;
//           });
          
//           return updatedList;
//         });
        
//         // Show notification if enabled
//         if (newUnreadCount > 0 && 
//             notificationSettings.showNotifications && 
//             !notificationSettings.doNotDisturb) {
//           NotificationService.localNotification(
//             newChat.name || 'New Message',
//             newChat.content || 'New message received',
//             {
//               chatId: chatIdentifier,
//               chatType: newChat.type,
//             }
//           );
//         }
//       }
//     }
//   });
// };

// // Add polling interval ref
// const pollingInterval = useRef(null);

// // Start polling when component mounts
// useEffect(() => {
//   // Try WebSocket first
//   connectChatWebSocket();
  
//   // Start polling as fallback
//   startPolling();
  
//   // AppState listener
//   const subscription = AppState.addEventListener('change', (nextAppState) => {
//     if (nextAppState === 'active') {
//       // Refresh chats when app comes to foreground
//       fetchAllChats();
      
//       // Restart polling if needed
//       if (!pollingInterval.current) {
//         startPolling();
//       }
//     } else {
//       // Pause polling when app goes background
//       if (pollingInterval.current) {
//         clearInterval(pollingInterval.current);
//         pollingInterval.current = null;
//       }
//     }
//   });
  
//   return () => {
//     if (pollingInterval.current) {
//       clearInterval(pollingInterval.current);
//     }
//     if (chatWs.current) {
//       chatWs.current.close();
//     }
//     subscription.remove();
//   };
// }, []);



// // Update chat on new message
// const updateChatOnNewMessage = (data) => {
//   const { chat_id, chat_type, content, timestamp, sender_name, account_mode } = data;
//   const chatKey = `${chat_id}-${chat_type}`;
//   const isRead = readChats.has(chatKey);
  
//   const updateListFunction = (list) => {
//     const existingIndex = list.findIndex(chat => 
//       chat.id === chat_id && chat.type === chat_type
//     );
    
//     if (existingIndex !== -1) {
//       const updatedList = [...list];
//       updatedList[existingIndex] = {
//         ...updatedList[existingIndex],
//         content: content || '[media]',
//         time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         unread_count: isRead ? 0 : (updatedList[existingIndex].unread_count || 0) + 1,
//         timestamp: timestamp,
//         name: sender_name || updatedList[existingIndex].name
//       };
      
//       // Move to top
//       const [item] = updatedList.splice(existingIndex, 1);
//       updatedList.unshift(item);
//       return updatedList;
//     } else {
//       // New chat - fetch full list
//       fetchAllChats();
//       return list;
//     }
//   };
  
//   // Update appropriate list
//   if (account_mode === 'business' || !account_mode) {
//     setBusinessChatList(prev => updateListFunction(prev));
//   } else {
//     setPersonalChatList(prev => updateListFunction(prev));
//   }
  
//   // Update combined list
//   setCombinedChatList(prev => {
//     const existingIndex = prev.findIndex(chat => 
//       chat.id === chat_id && chat.type === chat_type
//     );
    
//     if (existingIndex !== -1) {
//       const updatedList = [...prev];
//       updatedList[existingIndex] = {
//         ...updatedList[existingIndex],
//         content: content || '[media]',
//         time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         unread_count: isRead ? 0 : (updatedList[existingIndex].unread_count || 0) + 1,
//         timestamp: timestamp,
//         name: sender_name || updatedList[existingIndex].name
//       };
      
//       const [item] = updatedList.splice(existingIndex, 1);
//       updatedList.unshift(item);
//       return updatedList;
//     }
//     return prev;
//   });
// };

// // Add the WebSocket useEffect
// useEffect(() => {
//   connectChatWebSocket();
  
//   return () => {
//     if (chatWs.current) {
//       chatWs.current.close();
//     }
//   };
// }, []);

// // Add foreground polling as fallback
// useEffect(() => {
//   const pollInterval = setInterval(() => {
//     if (AppState.currentState === 'active') {
//       fetchAllChats();
//     }
//   }, 10000); // Check every 10 seconds as fallback
  
//   return () => clearInterval(pollInterval);
// }, []);

// // Add AppState listener
// useEffect(() => {
//   const subscription = AppState.addEventListener('change', (nextAppState) => {
//     if (nextAppState === 'active') {
//       console.log('App foregrounded - refreshing chats');
//       fetchAllChats();
//       if (!wsConnected) {
//         connectChatWebSocket();
//       }

//     }
//   });
  
//   return () => {
//     subscription.remove();
//   };
// }, [wsConnected]);
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   const handleAcceptCall = () => {
//     navigation.navigate('VoiceCalls', {
//       profile_image: callerInfo.profileImage,
//       name: callerInfo.name,
//       incomingOffer: callerInfo.offer,
//       isIncomingCall: true,
//       isInitiator: false
//     });
//     setShowIncomingCallModal(false);
//   };

//   const handleRejectCall = () => {
//     sendMessage({ type: 'call-ended' });
//     setShowIncomingCallModal(false);
//     setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
//   };

//   useEffect(() => {
//     // Determine which list to show based on filter and search
//     let currentList = [];
//     if (chatModeFilter === 'all') {
//       currentList = combinedChatList;
//     } else if (chatModeFilter === 'business') {
//       currentList = businessChatList;
//     } else {
//       currentList = personalChatList;
//     }

//     if (searchQuery.trim() === '') {
//       setFilteredChatList(currentList);
//     } else {
//       const filtered = currentList.filter(chat =>
//         chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredChatList(filtered);
//     }
//   }, [searchQuery, businessChatList, personalChatList, combinedChatList, chatModeFilter]);

//   useEffect(() => {
//     const loadMode = async () => {
//       const mode = await AsyncStorage.getItem('accountMode') || 'business';
//       setAccountMode(mode);
//     };
//     loadMode();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/get-users/`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
     
//       if (response.status === 200 || response.status === 201) {
//         const uniqueUsers = response.data.filter(
//           (user, index, self) => index === self.findIndex((u) => u.id === user.id)
//         );
//         setUserData(uniqueUsers);
//       } else {
//         console.error('Failed to fetch users:', response.status);
//       }
//     } catch (error) {
//       console.log('Error fetching users:', error.message);
//     }
//   };

//   // MMKV Cache functions
//   const loadReadChats = () => {
//     try {
//       const stored = readChatsStorage.getString('readChats');
//       if (stored) {
//         const parsedSet = new Set(JSON.parse(stored));
//         setReadChats(parsedSet);
//         return parsedSet;
//       }
//       return new Set();
//     } catch (e) {
//       console.error('Load read chats error:', e);
//       return new Set();
//     }
//   };

//   const saveReadChats = (readChatsSet) => {
//     try {
//       readChatsStorage.set('readChats', JSON.stringify(Array.from(readChatsSet)));
//     } catch (e) {
//       console.error('Save read chats error:', e);
//     }
//   };

//   useEffect(() => {
//     if (readChats && readChats.size > 0) {
//       saveReadChats(readChats);
//     }
//   }, [readChats]);

//   // Load personal chats from MMKV cache
//   const loadCachedPersonalChats = () => {
//     try {
//       const cached = personalChatStorage.getString('personalChats');
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         setPersonalChatList(parsed);
//         return true;
//       }
//     } catch (e) {
//       console.error('Load cached personal chats error:', e);
//     }
//     return false;
//   };

//   // Load business chats from MMKV cache
//   const loadCachedBusinessChats = () => {
//     try {
//       const cached = businessChatStorage.getString('businessChats');
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         setBusinessChatList(parsed);
//         return true;
//       }
//     } catch (e) {
//       console.error('Load cache error:', e);
//     }
//     return false;
//   };

//   // Cache business chats to MMKV
//   const cacheBusinessChats = (chats) => {
//     try {
//       businessChatStorage.set('businessChats', JSON.stringify(chats));
//     } catch (e) {
//       console.error('Cache business chats error:', e);
//     }
//   };

//   // Cache personal chats to MMKV
//   const cachePersonalChats = (chats) => {
//     try {
//       personalChatStorage.set('personalChats', JSON.stringify(chats));
//     } catch (e) {
//       console.error('Cache personal chats error:', e);
//     }
//   };

//   // Combine business and personal chats with source tracking
//   const combineChatLists = (business, personal) => {
//     const combined = [];
//     const seenIds = new Set();

//     // Add business chats first with source tag
//     business.forEach(chat => {
//       const key = `${chat.id}-${chat.type}`;
//       if (!seenIds.has(key)) {
//         seenIds.add(key);
//         combined.push({
//           ...chat,
//           source: 'business',
//           displayName: `${chat.name} (Business)`
//         });
//       }
//     });

//     // Add personal chats
//     personal.forEach(chat => {
//       const key = `${chat.id}-${chat.type}`;
//       if (!seenIds.has(key)) {
//         seenIds.add(key);
//         combined.push({
//           ...chat,
//           source: 'personal',
//           displayName: `${chat.name} (Personal)`
//         });
//       }
//     });

//     // Sort by timestamp (newest first)
//     combined.sort((a, b) => {
//       const timeA = new Date(a.timestamp || a.time).getTime();
//       const timeB = new Date(b.timestamp || b.time).getTime();
//       return timeB - timeA;
//     });

//     setCombinedChatList(combined);
//     return combined;
//   };

//   // Fetch personal chats from API (same as HomeScreen)
//   const fetchPersonalChats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return [];
      
//       const response = await axios.get(
//         `${API_ROUTE}/api/chat/list/?account_mode=personal`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       const filteredChats = response.data.chats.filter(chat => chat.type !== 'channel');
//       const uniqueChats = [];
//       const seenIds = new Set();

//       filteredChats.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;

//         if (!seenIds.has(chatIdentifier)) {
//           seenIds.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           const isRead = readChats.has(chatKey);
//           uniqueChats.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: isRead ? 0 : (chat.unread_count || 0),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null,
//             key: `${chat.id}-${chat.type}`,
//           });
//         }
//       });

//       setPersonalChatList(uniqueChats);
//       cachePersonalChats(uniqueChats);
      
//       return uniqueChats;
//     } catch (err) {
//       console.error('Failed to load personal chats:', err.response?.data || err.message);
//       return [];
//     }
//   };

//   // Fetch business chats from API
//   const fetchBusinessChats = async () => {
//     setIsLoading(true);
//     setError(null);
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       const response = await axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       const filteredChats = response.data.chats.filter(chat =>
//         chat.type !== 'channel' 
//       );
      
//       const uniqueChats = [];
//       const seenIds = new Set();
//       filteredChats.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!seenIds.has(chatIdentifier)) {
//           seenIds.add(chatIdentifier);
//           uniqueChats.push({
//             ...chat,
//             id: chatIdentifier
//           });
//         }
//       });

//       const chats = uniqueChats.map((chat) => {
//         const chatKey = `${chat.id}-${chat.type}`;
//         const isRead = readChats.has(chatKey);
//         return {
//           id: chat.id,
//           unread_count: isRead ? 0 : (chat.unread_count || 0),
//           name: chat.name || 'Unknown',
//           content: chat.content || '[media]',
//           time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//           type: chat.type,
//           members_count: chat.members_count,
//           receiverId: chat.type === 'single' ? chat.id : null,
//           group_slug: chat.group_slug || null
//         };
//       });

//       setBusinessChatList(chats);
//       cacheBusinessChats(chats);
      
//       return chats;
//     } catch (err) {
//       console.error('Failed to load business chat list:', err.response?.data || err.message);
//       setError('Failed to load chats. Please try again.');
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch all chats and combine them
//   const fetchAllChats = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const [businessChats, personalChats] = await Promise.all([
//         fetchBusinessChats(),
//         fetchPersonalChats()
//       ]);
      
//       // Combine the lists
//       combineChatLists(businessChats, personalChats);
      
//       // Set initial filtered list based on current mode
//       const initialList = chatModeFilter === 'all' 
//         ? combinedChatList 
//         : chatModeFilter === 'business' 
//           ? businessChats 
//           : personalChats;
//       setFilteredChatList(initialList);
      
//       return { businessChats, personalChats };
//     } catch (err) {
//       console.error('Failed to load chats:', err);
//       setError('Failed to load chats. Please try again.');
//       return { businessChats: [], personalChats: [] };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Load initial data from MMKV cache
//   useEffect(() => {
//     async function loadInitialData() {
//       setIsInitialLoading(true);
      
//       const loadedReadChats = loadReadChats();
      
//       const hasBusinessCache = loadCachedBusinessChats();
//       const hasPersonalCache = loadCachedPersonalChats();
      
//       let business = [];
//       let personal = [];
      
//       if (hasBusinessCache) {
//         business = businessChatList.map(chat => {
//           const chatKey = `${chat.id}-${chat.type}`;
//           const isRead = loadedReadChats.has(chatKey);
//           return isRead ? { ...chat, unread_count: 0 } : chat;
//         });
//         setBusinessChatList(business);
//       }
      
//       if (hasPersonalCache) {
//         personal = personalChatList.map(chat => {
//           const chatKey = `${chat.id}-${chat.type}`;
//           const isRead = loadedReadChats.has(chatKey);
//           return isRead ? { ...chat, unread_count: 0 } : chat;
//         });
//         setPersonalChatList(personal);
//       }
      
//       // Combine cached lists
//       if (business.length > 0 || personal.length > 0) {
//         combineChatLists(business, personal);
//       }
      
//       const initialList = chatModeFilter === 'all' 
//         ? combinedChatList 
//         : chatModeFilter === 'business' 
//           ? business 
//           : personal;
//       setFilteredChatList(initialList);
      
//       setIsInitialLoading(false);
//     }
    
//     loadInitialData();
//   }, []);

//  const markMessagesAsRead = async (chatId, chatType) => {
//   const chatKey = `${chatId}-${chatType}`;
  
//   // If already read, return
//   if (readChats.has(chatKey)) {
//     return;
//   }
  
//   // Add to read set
//   setReadChats(prev => {
//     const newSet = new Set(prev);
//     newSet.add(chatKey);
//     saveReadChats(newSet);
//     return newSet;
//   });
  
//   // Update all lists to remove badge
//   const updateList = (list) => 
//     list.map(chat => {
//       if (chat.id === chatId && chat.type === chatType) {
//         return { ...chat, unread_count: 0 };
//       }
//       return chat;
//     });
  
//   setBusinessChatList(prev => updateList(prev));
//   setPersonalChatList(prev => updateList(prev));
//   setCombinedChatList(prev => updateList(prev));
//   setFilteredChatList(prev => updateList(prev));
  
//   // Send read receipt to server
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
    
//     // After marking as read on server, also update via WebSocket
//     if (wsConnected && chatWs.current) {
//       chatWs.current.send(JSON.stringify({
//         type: 'mark_read',
//         chat_id: chatId,
//         chat_type: chatType
//       }));
//     }
    
//   } catch (error) {
//     console.error('Error marking messages as read:', error);
//     // Revert if failed
//     setReadChats(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(chatKey);
//       saveReadChats(newSet);
//       return newSet;
//     });
//   }
// };

//   useFocusEffect(
//     useCallback(() => {
//       fetchAllChats();
//       fetchUserData();
//     }, [])
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchChatListSilently();
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchChatListSilently = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;
      
//       const [businessResponse, personalResponse] = await Promise.all([
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         }),
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         })
//       ]);
      
//       // Process business chats
//       const businessFiltered = businessResponse.data.chats.filter(chat => chat.type !== 'channel');
//       const businessUnique = [];
//       const businessSeen = new Set();
//       businessFiltered.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!businessSeen.has(chatIdentifier)) {
//           businessSeen.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           const isRead = readChats.has(chatKey);
//           businessUnique.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: isRead ? 0 : (chat.unread_count || 0),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null
//           });
//         }
//       });
      
//       // Process personal chats
//       const personalFiltered = personalResponse.data.chats.filter(chat => chat.type !== 'channel');
//       const personalUnique = [];
//       const personalSeen = new Set();
//       personalFiltered.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!personalSeen.has(chatIdentifier)) {
//           personalSeen.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           const isRead = readChats.has(chatKey);
//           personalUnique.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: isRead ? 0 : (chat.unread_count || 0),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null
//           });
//         }
//       });
      
//       checkForNewMessages(businessUnique);
//       checkForNewMessages(personalUnique);
      
//       setBusinessChatList(prev => {
//         if (JSON.stringify(prev) !== JSON.stringify(businessUnique)) {
//           cacheBusinessChats(businessUnique);
//           return businessUnique;
//         }
//         return prev;
//       });
      
//       setPersonalChatList(personalUnique);
//       cachePersonalChats(personalUnique);
      
//       // Update combined list
//       combineChatLists(businessUnique, personalUnique);
      
//       // Update filtered list based on current mode
//       let currentList = [];
//       if (chatModeFilter === 'all') {
//         currentList = combinedChatList;
//       } else if (chatModeFilter === 'business') {
//         currentList = businessUnique;
//       } else {
//         currentList = personalUnique;
//       }
      
//       setFilteredChatList(prevFiltered => {
//         if (searchQuery.trim() === '') {
//           return currentList;
//         }
//         const filtered = currentList.filter(chat =>
//           chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
//         );
//         return filtered;
//       });
      
//     } catch (err) {
//       console.error('Silent refresh error:', err);
//     }
//   };

//   const checkForNewMessages = (newChats) => {
//     if (!notificationSettings.showNotifications || notificationSettings.doNotDisturb) {
//       return;
//     }
//     newChats.forEach(chat => {
//       if (chat.unread_count > 0) {
//         const notificationKey = `notified_${chat.id}_${chat.unread_count}`;
       
//         AsyncStorage.getItem(notificationKey).then(alreadyNotified => {
//           if (!alreadyNotified) {
//             NotificationService.localNotification(
//               chat.name,
//               chat.content || 'New message',
//               {
//                 chatId: chat.id,
//                 chatType: chat.type,
//                 name: chat.name,
//               }
//             );
           
//             AsyncStorage.setItem(notificationKey, 'true');
//           }
//         });
//       }
//     });
//   };

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
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 200 || response.status === 201) {
//         const profile = response.data;
//         return profile;
//       } else {
//         console.warn('Failed to fetch profile');
//         return null;
//       }
//     } catch (err) {
//       console.error('fetchProfile error:', err);
//       return null;
//     }
//   };

//   const switchAccount = async (account) => {
//     setIsLoading(true);
//     try {
//       await AsyncStorage.setItem('accountMode', account);
//       setAccountMode(account);
//       if (account === 'personal') {
//         fetchChatList();
//       } else {
//         const profile = await fetchProfile();
       
//         if (profile && profile.name && profile.name.trim() !== '') {
//           navigation.navigate('BusinessHome');
//         } else {
//           navigation.navigate('BusinessSetup');
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const highlightSearchText = (text = '', query) => {
//     if (!query || !text || typeof text !== 'string') return text;
   
//     const index = text.toLowerCase().indexOf(query.toLowerCase());
//     if (index === -1) return text;
//     return (
//       <Text>
//         {text.substring(0, index)}
//         <Text style={{ backgroundColor: isDark ? '#fbbf24' : '#FFEB3B', color: '#000' }}>
//           {text.substring(index, index + query.length)}
//         </Text>
//         {text.substring(index + query.length)}
//       </Text>
//     );
//   };

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

//   const handlePostStatus = async (media, caption) => {
//     if (!media) {
//       Alert.alert('Error', 'No media selected');
//       return;
//     }
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
     
//       let fileExt = media.uri.split('.').pop().toLowerCase();
//       let type = media.type;
     
//       if (!type) {
//         if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
//           type = 'image/jpeg';
//         } else if (['mp4', 'mov'].includes(fileExt)) {
//           type = 'video/mp4';
//         }
//       }
//       formData.append('media', {
//         uri: media.uri,
//         type: type,
//         name: `status_${Date.now()}.${fileExt}`,
//       });
//       if (caption) {
//         formData.append('text', caption);
//       }
//       const response = await axios.post(`${API_ROUTE}/status/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       Alert.alert('Success', 'Status posted successfully!');
     
//       return response.data;
//     } catch (error) {
//       Alert.alert('Error', 'Failed to post status');
//       throw error;
//     }
//   };

//   const handleOohmail = () => {
//     Linking.openURL('https://ooshmail.com');
//   }

//   const ellipsisRef = useRef(null);
//   const toggleDropdown = () => {
//     if (showDropdown) {
//       setShowDropdown(false);
//     } else {
//       ellipsisRef.current?.measure((fx, fy, width, height, px, py) => {
//         setButtonLayout({ x: px, y: py, width, height });
//         setShowDropdown(true);
//       });
//     }
//   };

//   // Switch between chat modes
//   const switchChatMode = (mode) => {
//     setChatModeFilter(mode);
//     setSearchQuery('');
    
//     let currentList = [];
//     if (mode === 'all') {
//       currentList = combinedChatList;
//     } else if (mode === 'business') {
//       currentList = businessChatList;
//     } else {
//       currentList = personalChatList;
//     }
//     setFilteredChatList(currentList);
//   };

//   // Get display name for chat item with source indicator
//   const getDisplayName = (item) => {
//     if (chatModeFilter === 'all' && item.source) {
//       return `${item.name} (${item.source === 'business' ? 'Business' : 'Personal'})`;
//     }
//     return item.name;
//   };

//   return (
//     <View style={[styles.container,{ backgroundColor: colors.backgroundSecondary }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'light-content'}
//         backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
//       />
      
//       <LinearGradient
//         colors={[colors.primary, colors.primary, colors.primary]}
//         style={styles.header}
//       >
//         <View style={[styles.headerTop,{ paddingTop: insets.top }]}>
//           <Text style={styles.headerTitle}>Chat</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity
//               style={styles.exploreIconContainer}
//               onPress={toggleTheme}
//             >
//               <Icon 
//                 style={{ marginRight: 10 }}
//                 name={isDark ? 'moon' : 'sunny'}
//                 size={25} 
//                 color="#FFFFFF" 
//               />
//             </TouchableOpacity>
            
//             <TouchableOpacity onPress={handleOohmail} style={styles.exploreIconContainer}>
//               <Icon name="compass-outline" size={27} color="#fff" style={{marginRight: 20}} />
//               <View style={styles.exploreBadge}>
//                 <Text style={styles.exploreBadgeText}>e-Mail</Text>
//               </View>
//             </TouchableOpacity>
            
//             <TouchableOpacity ref={ellipsisRef} onPress={toggleDropdown}>
//               <Icon name="ellipsis-vertical" size={25} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
        
//         <View style={styles.tabRow}>
//           {['Chats', 'Status', 'Calls'].map((item) => (
//             <TouchableOpacity
//               key={item}
//               onPress={() => {
//                 if (item === 'Status') {
//                   navigation.navigate('BStatusBar');
//                 } else if (item === 'Calls') {
//                   navigation.navigate('BCalls');
//                 } else {
//                   setTab(item);
//                 }
//               }}
//             >
//               <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
//               {tab === item && <View style={styles.tabUnderline} />}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </LinearGradient>
     
//       {/* Integrated Search Box with Mode Switcher - 3 tabs */}
//       <View style={styles.searchSection}>
//         <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
//           <Icon name="search" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
//           <TextInput
//             placeholder={`Search chats...`}
//             style={[styles.searchInput, { color: colors.text }]}
//             placeholderTextColor={colors.placeholder}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             clearButtonMode="while-editing"
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Icon name="close-circle" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           )}
//         </View>
        
//         {/* Mode Switcher - 3 tabs: All, Business, Personal */}
//         <View style={styles.modeSwitcherContainer}>
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'all' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('all')}
//           >
//             <Icon 
//               name="grid-outline" 
//               size={14} 
//               color={chatModeFilter === 'all' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'all' && styles.modeChipTextActive
//             ]}>
//               All
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'business' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('business')}
//           >
//             <Icon 
//               name="briefcase-outline" 
//               size={14} 
//               color={chatModeFilter === 'business' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'business' && styles.modeChipTextActive
//             ]}>
//               Business
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'personal' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('personal')}
//           >
//             <Icon 
//               name="person-outline" 
//               size={14} 
//               color={chatModeFilter === 'personal' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'personal' && styles.modeChipTextActive
//             ]}>
//               Personal
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
      
//       {/* Optional: Show count of chats in current view */}
//       {/* <View style={styles.sectionTabs}>
//         <Text style={[styles.sectionTab, { fontWeight: '600', color: colors.primary }]}>
//           {searchQuery ? 'SEARCH RESULTS' : `${filteredChatList.length} ${chatModeFilter === 'all' ? 'TOTAL' : chatModeFilter.toUpperCase()} CHATS`}
//         </Text>
//         {!searchQuery && <Text style={styles.sectionTab}></Text>}
//       </View> */}

//       <FlatList
//         data={filteredChatList}
//         keyExtractor={(item) => `${item.id}-${item.type}-${item.source || 'business'}`}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => {
//               markMessagesAsRead(item.id, item.type);
//               if (item.type === 'group') {
//                 navigation.navigate('BusinessGroupChat', {
//                   groupId: item.id,
//                   groupSlug: item.group_slug,
//                   name: item.name,
//                   chatType: 'group',
//                   profile_image: item.avatar,
//                   members_count: item.members_count,
//                   creator_id: item.creator_id
//                 });
//               } else {
//                 navigation.navigate('BPrivateChat', {
//                   receiverId: item.receiverId || item.id,
//                   name: item.name,
//                   chatType: 'single',
//                   profile_image: item.avatar,
//                   userIdd: item.receiverId || item.id
//                 });
//               }
//             }}
//             style={[styles.chatItem, { backgroundColor: colors.card,marginTop:10 }]}
//           >
//             <View style={styles.avatarContainer}>
//               <Image
//                 source={
//                   item.avatar
//                     ? { uri: item.avatar }
//                     : item.type === 'group'
//                     ? { uri: 'https://via.placeholder.com/50/cccccc/808080?text=G' }
//                     : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                 }
//                 style={[styles.avatar, { backgroundColor: colors.surface }]}
//               />
//               {item.type === 'single' && (
//                 <OnlineStatusBadge 
//                   userId={item.receiverId || item.id}
//                   dotSize={14}
//                   position="bottom-right"
//                   borderWidth={2}
//                   borderColor={colors.card}
//                 />
//               )}
//               {item.type === 'group' && (
//                 <View style={[styles.groupBadge, { backgroundColor: colors.primary }]}>
//                   <Icon name="people" size={12} color="#fff" />
//                 </View>
//               )}
//               {/* Source indicator for All view */}
             
//             </View>
            
//             <View style={styles.chatContent}>
//               <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                 <Text style={[styles.chatName, { color: colors.text }]}>
//                   {highlightSearchText(getDisplayName(item), searchQuery) ||
//                   (item.type === 'group' ? 'Group Chat' : 'Unnamed Chat')}
//                 </Text>
//                 {item.type === 'group' && (
//                   <>
//                     <Icon
//                       name="people-outline"
//                       size={16}
//                       color={colors.textSecondary}
//                       style={{marginLeft: 6}}
//                     />
//                     <Text style={[styles.memberCountText, { color: colors.textSecondary }]}>
//                       {item.members_count || 0}
//                     </Text>
//                     {item.is_creator && (
//                       <Icon
//                         name="star"
//                         size={14}
//                         color="#FFD700"
//                         style={{marginLeft: 4}}
//                       />
//                     )}
//                   </>
//                 )}
//               </View>
//               <Text style={[styles.chatMessage, { color: colors.textSecondary }]} numberOfLines={1}>
//                 {highlightSearchText(item.content ||
//                   (item.type === 'group'
//                     ? (item.is_creator ? 'You created this group' : 'No messages yet')
//                     : '[No message]'),
//                 searchQuery)}
//               </Text>
//             </View>
//             <View style={styles.timeBadgeContainer}>
//               <Text style={[styles.chatTime, { color: colors.textTertiary }]}>{item.time || ''}</Text>
//               {(!readChats.has(`${item.id}-${item.type}`) && item.unread_count > 0) && (
//                 <View style={[styles.badge, { backgroundColor: colors.primary }]}>
//                   <Text style={styles.badgeText}>
//                     {item.unread_count > 9 ? '9+' : item.unread_count}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={() => (
//           isLoading ? (
//             <Text style={[styles.emptyText, { marginTop: 80, textAlign: 'center', color: colors.textSecondary }]}>
//               Loading chats...
//             </Text>
//           ) : error ? (
//             <View style={styles.emptyList}>
//               <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
//               <TouchableOpacity onPress={fetchAllChats}>
//                 <Text style={[styles.emptyText, { color: colors.primary }]}>Retry</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.emptyList}>
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {searchQuery ? 'No matching chats found' : `No ${chatModeFilter === 'all' ? '' : chatModeFilter} chats available`}
//               </Text>
//               {!searchQuery && (
//                 <TouchableOpacity 
//                   onPress={() => {
//                     navigation.navigate(
//                       chatModeFilter === 'business' || chatModeFilter === 'all' 
//                         ? 'UserContactList' 
//                         : 'UserContactListPersonalAccount'
//                     );
//                   }}
//                 >
//                   <Text style={[styles.emptyText, { color: colors.primary, marginTop: 10, fontFamily: 'SourceSansPro-Medium' }]}>
//                     Start a new {chatModeFilter === 'all' ? '' : chatModeFilter} chat
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )
//         )}
//         contentContainerStyle={{ 
//           paddingBottom: insets.bottom + 120,
//         }}
//       />
      
//       <BottomNav 
//         navigation={navigation} 
//         setShowAccountModal={setShowAccountModal}
//         activeRoute="Home" 
//         style={{ zIndex: 9999 }}
//       />
      
//       <Modal
//         visible={showMediaModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowMediaModal(false)}>
//         <View style={[styles.mediaModalContainer, { backgroundColor: colors.overlay }]}>
//           <View style={[styles.mediaPreviewContainer, { backgroundColor: colors.background }]}>
//             {media?.type?.includes('video') ? (
//               <Video
//                 source={{uri: media.uri}}
//                 style={styles.mediaPreview}
//                 resizeMode="cover"
//                 repeat
//                 muted
//               />
//             ) : (
//               <Image source={{uri: media?.uri}} style={styles.mediaPreview} />
//             )}
//             <TextInput
//               style={[styles.captionInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBackground }]}
//               placeholder="Add caption to your status (optional)"
//               value={caption}
//               placeholderTextColor={colors.placeholder}
//               onChangeText={setCaption}
//               multiline
//             />
//             <View style={styles.mediaActionButtons}>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.cancelButton, { backgroundColor: colors.buttonSecondary }]}
//                 onPress={() => {
//                   setMedia(null);
//                   setCaption('');
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.postButton, { backgroundColor: colors.primary }]}
//                 onPress={() => {
//                   handlePostStatus(media, caption);
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={[styles.buttonText, { color: colors.textInverse }]}>Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
      
//       <Modal
//         visible={showAccountModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAccountModal(false)}
//       >
//         <Animated.View
//           style={{
//             flex: 1,
//             backgroundColor: colors.overlay,
//             justifyContent: 'center',
//             alignItems: 'center',
//             opacity: fadeAnim,
//           }}
//         >
//           <View
//             style={{
//               width: '88%',
//               backgroundColor: colors.background,
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
//             <TouchableOpacity
//               onPress={() => setShowAccountModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 backgroundColor: colors.buttonSecondary,
//                 borderRadius: 50,
//                 padding: 8,
//               }}
//             >
//               <Icon name="close" size={22} color={colors.text} />
//             </TouchableOpacity>
     
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: '700',
//                 color: colors.text,
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
//                 color: colors.textSecondary,
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
//                 backgroundColor: colors.buttonSecondary,
//               }}
//               onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('PHome')
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
//                 Switch Account
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>
     
//       <TouchableOpacity
//         style={[styles.fab2, { backgroundColor: colors.buttonSecondary, borderColor: colors.border }]}
//         onPress={() => {
//           navigation.navigate(
//             chatModeFilter === 'business' || chatModeFilter === 'all' 
//               ? 'UserContactList' 
//               : 'UserContactListPersonalAccount'
//           );
//         }}
//       >
//         <Icon name="chatbox-ellipses" size={24} color={colors.primary} />
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
//                   backgroundColor: colors.background,
//                 },
//               ]}
//             >
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Advertise');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Advertise</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('CreateChannel');
//               }}>
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Create Channel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('Broadcast');
//               }}>
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Official Broadcast</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('GroupConnect');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>New Group</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Broadcaster', {
//                     roomName: 'match-123',
//                     streamId: 'stream-1',
//                   });
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Go Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('LiveStreaming');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Watch Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('SupplierNotificationScreen');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Deals</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Explore');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Business Tools</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('EarningDashbord');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Earn Money</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('CreateCatalog');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Catalog</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('MarketPlace');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Market Place</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('BSettings');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Settings</Text>
//               </TouchableOpacity>
//               {/* <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('PHome');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text, fontWeight: 'bold' }]}>Switch Account</Text>
//               </TouchableOpacity> */}
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//       <EarningsSlideInManager />
//     </View>
//   );
// };

// const createStyles = (colors, isDark, insets) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.backgroundSecondary,
//   },
//   fab2: {
//     position: 'absolute',
//     bottom: 120,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     alignItems: 'center',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     zIndex: 1000,
//     borderWidth: 1,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 200,
//     right: 20,
//     width: 53,
//     height: 53,
//     borderRadius: 28,
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     zIndex: 1000,
//   },
//   header: {
//     paddingBottom: 10,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
//     backgroundColor: colors.primary,
//     elevation: 2,
//     zIndex: 1000,
//   },
//   headerTop: {
//     marginTop: Platform.OS === 'android' ? 10 : 10,
//     paddingHorizontal: 20,
//     height: Platform.OS === 'android' ? 90 : 130,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   timeBadgeContainer: {
//     alignItems: 'flex-end',
//     minWidth: 50,
//   },
//   badge: {
//     borderRadius: 50,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 4,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: 40,
//     right: 0,
//     backgroundColor: colors.backgroundSecondary,
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: isDark ? 0.3 : 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 2000,
//     borderWidth: 1,
//     borderColor: colors.border,
//     minWidth: 220,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     color: colors.text,
//     fontFamily: 'SourceSansPro-Regular',
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: Platform.OS === 'android' ? 28 : 35,
//     fontWeight: 'bold',
//     letterSpacing: 0.7,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tabRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   tabText: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 16,
//     fontFamily: 'SourceSansPro-Bold',
//     paddingVertical: 6,
//   },
//   tabTextActive: {
//     color: 'white',
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontWeight: '600',
//   },
//   tabUnderline: {
//     height: 3,
//     backgroundColor: 'white',
//     borderRadius: 2,
//     marginTop: 4,
//   },
//   // Search Section with integrated mode switcher
//   searchSection: {
//     marginHorizontal: 16,
//     marginTop: 12,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     height: 44,
//     elevation: 0.5,
//     shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.0,
//     borderColor: colors.border,
//     zIndex: 500,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: 'SourceSansPro-Regular',
//     paddingRight: 8,
//     height: 44,
//   },
//   modeSwitcherContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginTop: 8,
//     gap: 8,
//   },
//   modeChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 5,
//     backgroundColor: colors.buttonSecondary,
//     borderWidth: 1,
//     borderColor: colors.border,
//     gap: 4,
//   },
//   modeChipActive: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   modeChipText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: colors.textSecondary,
//   },
//   modeChipTextActive: {
//     color: '#fff',
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
//     color: colors.textSecondary,
//   },
//   userItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomColor: colors.border,
//     borderBottomWidth: 1,
//   },
//   notificationIconContainer: {
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -5,
//     right: 15,
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   notificationBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   userName: {
//     marginLeft: 12,
//     fontSize: 16,
//     textTransform: 'capitalize',
//     color: colors.text,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: 12,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },
//   groupBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: colors.card,
//   },
//   sourceBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     borderRadius: 10,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: colors.card,
//   },
//   sourceBadgeText: {
//     color: '#fff',
//     fontSize: 8,
//     fontWeight: 'bold',
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatName: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//   },
//   chatMessage: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   chatTime: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 12,
//   },
//   emptyList: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.overlay,
//   },
//   modalContainer: {
//     backgroundColor: colors.background,
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
//     color: colors.text,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButton: {
//     width: '100%',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: colors.primary,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: colors.textInverse,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   accountModalContainer: {
//     backgroundColor: colors.background,
//     borderRadius: 16,
//     padding: 20,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   memberCountText: {
//     fontSize: 12,
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
//     marginHorizontal: 12,
//     marginVertical: 4,
//     borderRadius: 12,
//     elevation: 0.6,
//     shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.2,
//     borderColor: colors.border,
//   },
//   fullScreenLoading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalOverlay: {
//     flex: 1,
//     backgroundColor: colors.overlay,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalContainer: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: colors.background,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   welcomeModalHeader: {
//     padding: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   welcomeModalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: colors.textInverse,
//     marginTop: 15,
//     textAlign: 'center',
//   },
//   welcomeModalContent: {
//     padding: 20,
//     maxHeight: '60%',
//   },
//   featureCard: {
//     backgroundColor: colors.surface,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//   },
//   featureTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//     marginTop: 10,
//   },
//   featureDescription: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 5,
//     lineHeight: 20,
//   },
//   welcomeModalFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   welcomeModalButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalButtonText: {
//     color: colors.textInverse,
//     fontSize: 18,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   mediaModalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mediaPreviewContainer: {
//     width: '90%',
//     borderRadius: 10,
//     padding: 15,
//   },
//   mediaPreview: {
//     width: '100%',
//     height: 300,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   captionInput: {
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     minHeight: 50,
//     marginBottom: 15,
//   },
//   mediaActionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   mediaButton: {
//     padding: 12,
//     borderRadius: 5,
//     width: '48%',
//     alignItems: 'center',
//   },
//   cancelButton: {},
//   postButton: {},
//   buttonText: {
//     fontWeight: 'bold',
//   },
//   exploreIconContainer: {
//     position: 'relative',
//     marginRight: 15,
//   },
//   exploreBadge: {
//     position: 'absolute',
//     top: -6,
//     right: -5,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 5,
//     paddingVertical: 2,
//     minWidth: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: 'white',
//   },
//   exploreBadgeText: {
//     color: colors.primary,
//     fontSize: 9,
//     textTransform: 'uppercase',
//     fontWeight: '800',
//     letterSpacing: 0.3,
//   },
// });

// export default BusinessHomeScreen;


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
// import BottomNav from '../components/BottomNavSocialMedia';
// import { Divider } from 'react-native-paper';
// import SwitchAccountSheet from '../components/SwitchAccountSheet';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import LottieView from 'lottie-react-native';
// import IncomingCallModal from '../components/IncomingCallModal';
// import NotificationService from '../src/services/PushNotifications';
// import Video from 'react-native-video';
// import { useTheme } from '../src/context/ThemeContext';
// import EarningsSlideInManager from '../components/EarningsSlideInManager';
// import OnlineStatusBadge from '../components/OnlineStatusBadge';
// import { createMMKV } from 'react-native-mmkv';

// const windowWidth = Dimensions.get('window').width;

// // Initialize MMKV instances for caching
// const businessChatStorage = createMMKV({
//   id: 'business-chats-cache'
// });

// const personalChatStorage = createMMKV({
//   id: 'personal-chats-cache'
// });

// const readChatsStorage = createMMKV({
//   id: 'read-chats-cache'
// });

// const BusinessHomeScreen = ({ navigation }) => {
//   const { colors, theme, toggleTheme, isDark  } = useTheme(); 
  
//   // Mode filter state - 'all', 'business', or 'personal'
//   const [chatModeFilter, setChatModeFilter] = useState('business');
  
//   const [tab, setTab] = useState('Chats');
//   const [userData, setUserData] = useState([]);
//   const [chatList, setChatList] = useState([]);
//   const [businessChatList, setBusinessChatList] = useState([]);
//   const [personalChatList, setPersonalChatList] = useState([]);
//   const [combinedChatList, setCombinedChatList] = useState([]);
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
//   const [readChats, setReadChats] = useState(new Map()); // Changed from Set to Map
//   const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const insets = useSafeAreaInsets();
  
//   const styles = createStyles(colors, isDark, insets); 

//   const [notificationSettings, setNotificationSettings] = useState({
//     showNotifications: true,
//     doNotDisturb: false,
//   });

//   const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

//   // ---- "Latest value" refs -----------------------------------------------
//   const readChatsRef = useRef(new Map());
//   const businessChatListRef = useRef([]);
//   const personalChatListRef = useRef([]);
//   const combinedChatListRef = useRef([]);
//   const chatModeFilterRef = useRef('business');
//   const searchQueryRef = useRef('');
//   const notificationSettingsRef = useRef({ showNotifications: true, doNotDisturb: false });
//   const wsConnectedRef = useRef(false);

//   useEffect(() => { readChatsRef.current = readChats; }, [readChats]);
//   useEffect(() => { businessChatListRef.current = businessChatList; }, [businessChatList]);
//   useEffect(() => { personalChatListRef.current = personalChatList; }, [personalChatList]);
//   useEffect(() => { combinedChatListRef.current = combinedChatList; }, [combinedChatList]);
//   useEffect(() => { chatModeFilterRef.current = chatModeFilter; }, [chatModeFilter]);
//   useEffect(() => { searchQueryRef.current = searchQuery; }, [searchQuery]);
//   useEffect(() => { notificationSettingsRef.current = notificationSettings; }, [notificationSettings]);
//   // --------------------------------------------------------------------------

//   // Function to check if a chat has unread messages
//   const hasUnreadMessages = (chatId, chatType, serverUnreadCount, lastMessageTimestamp) => {
//     const chatKey = `${chatId}-${chatType}`;
//     const readAt = readChatsRef.current.get(chatKey);
    
//     // If never marked as read, show badge if server says there are unread messages
//     if (readAt == null) {
//       return serverUnreadCount > 0;
//     }
    
//     // If we have a last message timestamp, compare it with read time
//     if (lastMessageTimestamp) {
//       const msgTime = new Date(lastMessageTimestamp).getTime();
//       // Show badge if the latest message is newer than when we marked it read
//       if (msgTime > readAt) {
//         return true;
//       }
//     }
    
//     // Also check server unread count as a fallback
//     if (serverUnreadCount > 0) {
//       // If the server says there are unread messages, but we think we've read everything,
//       // we need to check if there are messages newer than our read timestamp
//       // Since we don't have the exact timestamp of the last unread message, we trust the server
//       // but we'll let the badge show if serverUnreadCount > 0 and we don't have a more recent read
//       return true;
//     }
    
//     return false;
//   };

//   const unmarkChatAsRead = (chatKey) => {
//     // We don't remove from readChats anymore - we just let the badge logic
//     // determine if there are new messages based on timestamps
//     // This keeps the chat in readChats so we can compare timestamps later
//   };

//   const resolveUnreadCount = (chatKey, serverUnreadCount, chatTimestamp) => {
//     const count = serverUnreadCount || 0;
//     const readAt = readChatsRef.current.get(chatKey);
    
//     if (readAt == null) {
//       // Never marked read locally - trust the server
//       return count;
//     }
    
//     const msgTime = chatTimestamp ? new Date(chatTimestamp).getTime() : 0;
//     if (msgTime > readAt) {
//       // The chat's latest message is newer than when we marked it read
//       // Trust the server's count
//       return count;
//     }
    
//     // If we're in this situation, the server might still have unread_count > 0
//     // but all messages are older than our read time, so clear the badge
//     // However, if serverUnreadCount > 0 and msgTime is very close to readAt,
//     // we might need to show the badge to be safe
//     if (count > 0 && msgTime > 0 && (msgTime - readAt) < 1000) {
//       // If the message is within 1 second of read time, show the badge
//       // This handles race conditions
//       return count;
//     }
    
//     return 0;
//   };

//   const fetchUnreadNotificationCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/notifications/unread-count/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       if (response.data.success) {
//         setUnreadNotificationCount(response.data.unread_count);
//       }
//     } catch (error) {
//       console.error('Error fetching unread count:', error);
//     }
//   };

//   useEffect(() => {
//     loadNotificationSettings();
//     fetchUnreadNotificationCount();
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

//   // Handle incoming call
//   const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
//   const [callerInfo, setCallerInfo] = useState({
//     profileImage: '',
//     name: 'Unknown',
//     offer: null
//   });

//   const ws = useRef(null);

//   useEffect(() => {
//     const connectCallWebSocket = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const retrieveUserId = await AsyncStorage.getItem('userData');
  
//         if (!token || !retrieveUserId) {
//           console.warn('Missing auth data, websocket not started');
//           return;
//         }
  
//         const userData = JSON.parse(retrieveUserId);
//         const currentUserId = userData.id;
//         const ROOM_ID = `user-${currentUserId}`;
//         const SIGNALING_SERVER = 'wss://api.showapp.ng';
  
//         const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;
  
//         ws.current = new WebSocket(url);
//         ws.current.binaryType = 'arraybuffer';
  
//         ws.current.onopen = () => {
//           console.log('[Call WS] Connected');
//         };
  
//         ws.current.onmessage = (evt) => {
//           let data;
//           try {
//             data = JSON.parse(evt.data);
//           } catch (e) {
//             console.error('[WS] Invalid JSON', e);
//             return;
//           }
  
//           if (data.type === 'offer') {
//             if (
//               data.offer?.targetUserId &&
//               data.offer.targetUserId !== currentUserId
//             ) {
//               return;
//             }
  
//             const callerData = data.offer?.callerInfo || {};
            
//             const profileImage = callerData.profileImage || 
//                                  data.offer?.profileImage || 
//                                  '';
            
//             const callerName = callerData.name || 
//                                data.offer?.callerName || 
//                                'Unknown Caller';
  
//             const isVideo = data.offer?.isVideoCall || false;
  
//             console.log('[Incoming Call] Caller info:', {
//               name: callerName,
//               hasProfileImage: !!profileImage,
//             });
  
//             setCallerInfo({
//               profileImage: profileImage,
//               name: callerName,
//               offer: data.offer,
//             });
  
//             setShowIncomingCallModal(true);
//           }
//         };
  
//         ws.current.onerror = (e) => {
//           //console.error('[Call WS] Error', e);
//         };
  
//         ws.current.onclose = (e) => {
//           //console.log('[Call WS] Closed', e.code, e.reason);
//         };
//       } catch (err) {
//        // console.error('[Call WS] Failed to connect', err);
//       }
//     };
  
//     connectCallWebSocket();
  
//     return () => {
//       ws.current?.close();
//     };
//   }, []);



// // Chat WebSocket + polling state
// const [wsConnected, setWsConnected] = useState(false);
// const [wsError, setWsError] = useState(null);
// const chatWs = useRef(null);
// const pollingInterval = useRef(null);

// const connectChatWebSocket = async () => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const retrieveUserId = await AsyncStorage.getItem('userData');
    
//     if (!token || !retrieveUserId) {
//       console.log('[Chat WS] Missing auth data');
//       return;
//     }
    
//     const userData = JSON.parse(retrieveUserId);
//     const currentUserId = userData.id;
    
//     // Use wss for secure connection
//     const CHAT_SERVER = 'wss://api.showapp.ng';
    
//     // Build the WebSocket URL with token in query string
//     const url = `${CHAT_SERVER}/ws/chat/${currentUserId}/?token=${token}`;
    
//     console.log('[Chat WS] Connecting to:', url.replace(token, '***'));
    
//     // Close existing connection if any
//     if (chatWs.current) {
//       chatWs.current.close();
//       chatWs.current = null;
//     }
    
//     chatWs.current = new WebSocket(url);
    
//     // Connection timeout
//     const connectionTimeout = setTimeout(() => {
//       if (chatWs.current && chatWs.current.readyState !== WebSocket.OPEN) {
//         console.log('[Chat WS] Connection timeout');
//         chatWs.current.close();
//         setWsConnected(false);
//       }
//     }, 10000);
    
//     chatWs.current.onopen = () => {
//       clearTimeout(connectionTimeout);
//       console.log('[Chat WS] Connected successfully');
//       setWsConnected(true);
//       setWsError(null);
//     };
    
//     chatWs.current.onmessage = (evt) => {
//       try {
//         const data = JSON.parse(evt.data);
//         console.log('[Chat WS] Message received:', data.type);
        
//         if (data.type === 'new_message') {
//           // Update the relevant chat list + badge immediately
//           updateChatOnNewMessage(data);
//         } else if (data.type === 'message_read') {
//           console.log('[Chat WS] Message read confirmation:', data);
//         } else if (data.type === 'typing') {
//           console.log('[Chat WS] Typing indicator:', data);
//         }
//       } catch (error) {
//         console.error('[Chat WS] Error parsing message:', error);
//       }
//     };
    
//     chatWs.current.onerror = (error) => {
//       clearTimeout(connectionTimeout);
//       console.error('[Chat WS] Error:', error);
//       setWsConnected(false);
//       setWsError('WebSocket connection error');
//     };
    
//     chatWs.current.onclose = (event) => {
//       clearTimeout(connectionTimeout);
//       console.log(`[Chat WS] Disconnected - Code: ${event.code}, Reason: ${event.reason}`);
//       setWsConnected(false);
      
//       // Don't auto-reconnect if it was a normal closure
//       if (event.code !== 1000) {
//         setTimeout(() => {
//           console.log('[Chat WS] Attempting to reconnect...');
//           connectChatWebSocket();
//         }, 5000);
//       }
//     };
    
//   } catch (error) {
//     console.error('[Chat WS] Failed to connect:', error);
//     setWsConnected(false);
//     setWsError(error.message);
//   }
// };

// // Polling fallback - keeps badges accurate even if the socket drops
// const startPolling = () => {
//   if (pollingInterval.current) {
//     clearInterval(pollingInterval.current);
//   }
  
//   pollingInterval.current = setInterval(async () => {
//     try {
//       const appState = AppState.currentState;
//       if (appState !== 'active') return;
//       if (isLoading) return;
      
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;
      
//       const [businessResponse, personalResponse] = await Promise.all([
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//           timeout: 5000,
//         }),
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//           timeout: 5000,
//         })
//       ]);
      
//       processNewChats(businessResponse.data.chats, 'business');
//       processNewChats(personalResponse.data.chats, 'personal');
      
//     } catch (error) {
//       // Silent fail for polling
//     }
//   }, 5000); // Poll every 5 seconds
// };

// // Process new chats and update unread counts
// const processNewChats = (newChats, mode) => {
//   const filteredChats = newChats.filter(chat => chat.type !== 'channel');
  
//   filteredChats.forEach(newChat => {
//     const chatIdentifier = newChat.type === 'single'
//       ? newChat.participants?.find(id => id !== newChat.current_user_id) || newChat.id
//       : newChat.group_slug || newChat.id;
    
//     const chatKey = `${chatIdentifier}-${newChat.type}`;
    
//     const currentList = mode === 'business' ? businessChatListRef.current : personalChatListRef.current;
//     const existingChat = currentList.find(chat => 
//       chat.id === chatIdentifier && chat.type === newChat.type
//     );
    
//     if (existingChat) {
//       const newUnreadCount = resolveUnreadCount(chatKey, newChat.unread_count, newChat.timestamp);
      
//       if (newUnreadCount !== existingChat.unread_count || 
//           newChat.content !== existingChat.content) {
        
//         const updateList = (list) => {
//           const updatedList = list.map(chat => {
//             if (chat.id === chatIdentifier && chat.type === newChat.type) {
//               return {
//                 ...chat,
//                 unread_count: newUnreadCount,
//                 content: newChat.content || chat.content,
//                 time: new Date(newChat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 timestamp: newChat.timestamp
//               };
//             }
//             return chat;
//           });
          
//           updatedList.sort((a, b) => {
//             const timeA = new Date(a.timestamp || a.time).getTime();
//             const timeB = new Date(b.timestamp || b.time).getTime();
//             return timeB - timeA;
//           });
          
//           return updatedList;
//         };
        
//         if (mode === 'business') {
//           setBusinessChatList(prev => updateList(prev));
//         } else {
//           setPersonalChatList(prev => updateList(prev));
//         }
        
//         setCombinedChatList(prev => {
//           const updatedList = prev.map(chat => {
//             if (chat.id === chatIdentifier && chat.type === newChat.type) {
//               return {
//                 ...chat,
//                 unread_count: newUnreadCount,
//                 content: newChat.content || chat.content,
//                 time: new Date(newChat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 timestamp: newChat.timestamp
//               };
//             }
//             return chat;
//           });
          
//           updatedList.sort((a, b) => {
//             const timeA = new Date(a.timestamp || a.time).getTime();
//             const timeB = new Date(b.timestamp || b.time).getTime();
//             return timeB - timeA;
//           });
          
//           return updatedList;
//         });
        
//         if (newUnreadCount > 0 && 
//             notificationSettingsRef.current.showNotifications && 
//             !notificationSettingsRef.current.doNotDisturb) {
//           NotificationService.localNotification(
//             newChat.name || 'New Message',
//             newChat.content || 'New message received',
//             {
//               chatId: chatIdentifier,
//               chatType: newChat.type,
//             }
//           );
//         }
//       }
//     }
//   });
// };

// // Update chat list immediately when a WebSocket "new_message" event arrives
// const updateChatOnNewMessage = (data) => {
//   const { chat_id, chat_type, content, timestamp, sender_name, account_mode } = data;
//   const chatKey = `${chat_id}-${chat_type}`;

//   // IMPORTANT: When a new message arrives, we need to show the badge.
//   // We do NOT remove the chat from readChats - we just let the badge
//   // logic determine that there are new messages based on the timestamp comparison.
//   // The readAt timestamp stays in the Map, but the new message timestamp
//   // will be compared against it.
  
//   const updateListFunction = (list) => {
//     const existingIndex = list.findIndex(chat => 
//       chat.id === chat_id && chat.type === chat_type
//     );
    
//     if (existingIndex !== -1) {
//       const updatedList = [...list];
//       const currentUnreadCount = updatedList[existingIndex].unread_count || 0;
//       // Increment the unread count for this chat
//       updatedList[existingIndex] = {
//         ...updatedList[existingIndex],
//         content: content || '[media]',
//         time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         unread_count: currentUnreadCount + 1,
//         timestamp: timestamp,
//         name: sender_name || updatedList[existingIndex].name
//       };
      
//       // Move to top
//       const [item] = updatedList.splice(existingIndex, 1);
//       updatedList.unshift(item);
//       return updatedList;
//     } else {
//       // New chat we don't have locally yet - pull the full list
//       fetchAllChats();
//       return list;
//     }
//   };
  
//   if (account_mode === 'business' || !account_mode) {
//     setBusinessChatList(prev => updateListFunction(prev));
//   } else {
//     setPersonalChatList(prev => updateListFunction(prev));
//   }
  
//   setCombinedChatList(prev => {
//     const existingIndex = prev.findIndex(chat => 
//       chat.id === chat_id && chat.type === chat_type
//     );
    
//     if (existingIndex !== -1) {
//       const updatedList = [...prev];
//       const currentUnreadCount = updatedList[existingIndex].unread_count || 0;
//       updatedList[existingIndex] = {
//         ...updatedList[existingIndex],
//         content: content || '[media]',
//         time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         unread_count: currentUnreadCount + 1,
//         timestamp: timestamp,
//         name: sender_name || updatedList[existingIndex].name
//       };
      
//       const [item] = updatedList.splice(existingIndex, 1);
//       updatedList.unshift(item);
//       return updatedList;
//     }
//     return prev;
//   });

//   // Fire a local notification for the new message, if enabled
//   if (notificationSettingsRef.current.showNotifications &&
//       !notificationSettingsRef.current.doNotDisturb) {
//     NotificationService.localNotification(
//       sender_name || 'New Message',
//       content || 'New message received',
//       { chatId: chat_id, chatType: chat_type }
//     );
//   }
// };

// // ---- Single consolidated real-time setup effect ---------------------------
// useEffect(() => {
//   connectChatWebSocket();
//   startPolling();

//   const subscription = AppState.addEventListener('change', (nextAppState) => {
//     if (nextAppState === 'active') {
//       console.log('[Chat] App foregrounded - refreshing chats for badges');
//       fetchChatListSilently();

//       if (!wsConnectedRef.current) {
//         connectChatWebSocket();
//       }
//       if (!pollingInterval.current) {
//         startPolling();
//       }
//     } else {
//       if (pollingInterval.current) {
//         clearInterval(pollingInterval.current);
//         pollingInterval.current = null;
//       }
//     }
//   });

//   return () => {
//     if (pollingInterval.current) {
//       clearInterval(pollingInterval.current);
//       pollingInterval.current = null;
//     }
//     if (chatWs.current) {
//       chatWs.current.close(1000, 'component unmount');
//       chatWs.current = null;
//     }
//     subscription.remove();
//   };
// }, []);
// // ---------------------------------------------------------------------------

//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   const handleAcceptCall = () => {
//     navigation.navigate('VoiceCalls', {
//       profile_image: callerInfo.profileImage,
//       name: callerInfo.name,
//       incomingOffer: callerInfo.offer,
//       isIncomingCall: true,
//       isInitiator: false
//     });
//     setShowIncomingCallModal(false);
//   };

//   const handleRejectCall = () => {
//     sendMessage({ type: 'call-ended' });
//     setShowIncomingCallModal(false);
//     setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
//   };

//   useEffect(() => {
//     // Determine which list to show based on filter and search
//     let currentList = [];
//     if (chatModeFilter === 'all') {
//       currentList = combinedChatList;
//     } else if (chatModeFilter === 'business') {
//       currentList = businessChatList;
//     } else {
//       currentList = personalChatList;
//     }

//     if (searchQuery.trim() === '') {
//       setFilteredChatList(currentList);
//     } else {
//       const filtered = currentList.filter(chat =>
//         chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredChatList(filtered);
//     }
//   }, [searchQuery, businessChatList, personalChatList, combinedChatList, chatModeFilter]);

//   useEffect(() => {
//     const loadMode = async () => {
//       const mode = await AsyncStorage.getItem('accountMode') || 'business';
//       setAccountMode(mode);
//     };
//     loadMode();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/get-users/`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
     
//       if (response.status === 200 || response.status === 201) {
//         const uniqueUsers = response.data.filter(
//           (user, index, self) => index === self.findIndex((u) => u.id === user.id)
//         );
//         setUserData(uniqueUsers);
//       } else {
//         console.error('Failed to fetch users:', response.status);
//       }
//     } catch (error) {
//       console.log('Error fetching users:', error.message);
//     }
//   };

//   // MMKV Cache functions
//   const loadReadChats = () => {
//     try {
//       const stored = readChatsStorage.getString('readChats');
//       if (stored) {
//         const parsedObject = JSON.parse(stored);
//         // Convert the object back to a Map
//         const parsedMap = new Map(Object.entries(parsedObject));
//         setReadChats(parsedMap);
//         return parsedMap;
//       }
//       return new Map();
//     } catch (e) {
//       console.error('Load read chats error:', e);
//       return new Map();
//     }
//   };

//   const saveReadChats = (readChatsMap) => {
//     try {
//       // Convert Map to object for JSON storage
//       const obj = Object.fromEntries(readChatsMap);
//       readChatsStorage.set('readChats', JSON.stringify(obj));
//     } catch (e) {
//       console.error('Save read chats error:', e);
//     }
//   };

//   useEffect(() => {
//     if (readChats && readChats.size > 0) {
//       saveReadChats(readChats);
//     }
//   }, [readChats]);

//   // Load personal chats from MMKV cache
//   const loadCachedPersonalChats = () => {
//     try {
//       const cached = personalChatStorage.getString('personalChats');
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         setPersonalChatList(parsed);
//         return parsed;
//       }
//     } catch (e) {
//       console.error('Load cached personal chats error:', e);
//     }
//     return null;
//   };

//   // Load business chats from MMKV cache
//   const loadCachedBusinessChats = () => {
//     try {
//       const cached = businessChatStorage.getString('businessChats');
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         setBusinessChatList(parsed);
//         return parsed;
//       }
//     } catch (e) {
//       console.error('Load cache error:', e);
//     }
//     return null;
//   };

//   // Cache business chats to MMKV
//   const cacheBusinessChats = (chats) => {
//     try {
//       businessChatStorage.set('businessChats', JSON.stringify(chats));
//     } catch (e) {
//       console.error('Cache business chats error:', e);
//     }
//   };

//   // Cache personal chats to MMKV
//   const cachePersonalChats = (chats) => {
//     try {
//       personalChatStorage.set('personalChats', JSON.stringify(chats));
//     } catch (e) {
//       console.error('Cache personal chats error:', e);
//     }
//   };

//   // Combine business and personal chats with source tracking
//   const combineChatLists = (business, personal) => {
//     const combined = [];
//     const seenIds = new Set();

//     // Add business chats first with source tag
//     business.forEach(chat => {
//       const key = `${chat.id}-${chat.type}`;
//       if (!seenIds.has(key)) {
//         seenIds.add(key);
//         combined.push({
//           ...chat,
//           source: 'business',
//           displayName: `${chat.name} (Business)`
//         });
//       }
//     });

//     // Add personal chats
//     personal.forEach(chat => {
//       const key = `${chat.id}-${chat.type}`;
//       if (!seenIds.has(key)) {
//         seenIds.add(key);
//         combined.push({
//           ...chat,
//           source: 'personal',
//           displayName: `${chat.name} (Personal)`
//         });
//       }
//     });

//     // Sort by timestamp (newest first)
//     combined.sort((a, b) => {
//       const timeA = new Date(a.timestamp || a.time).getTime();
//       const timeB = new Date(b.timestamp || b.time).getTime();
//       return timeB - timeA;
//     });

//     setCombinedChatList(combined);
//     return combined;
//   };

//   // Fetch personal chats from API
//   const fetchPersonalChats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return [];
      
//       const response = await axios.get(
//         `${API_ROUTE}/api/chat/list/?account_mode=personal`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       const filteredChats = response.data.chats.filter(chat => chat.type !== 'channel');
//       const uniqueChats = [];
//       const seenIds = new Set();

//       filteredChats.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;

//         if (!seenIds.has(chatIdentifier)) {
//           seenIds.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           uniqueChats.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null,
//             key: `${chat.id}-${chat.type}`,
//             timestamp: chat.timestamp,
//           });
//         }
//       });

//       setPersonalChatList(uniqueChats);
//       cachePersonalChats(uniqueChats);
      
//       return uniqueChats;
//     } catch (err) {
//       console.error('Failed to load personal chats:', err.response?.data || err.message);
//       return [];
//     }
//   };

//   // Fetch business chats from API
//   const fetchBusinessChats = async () => {
//     setIsLoading(true);
//     setError(null);
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       const response = await axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       const filteredChats = response.data.chats.filter(chat =>
//         chat.type !== 'channel' 
//       );
      
//       const uniqueChats = [];
//       const seenIds = new Set();
//       filteredChats.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!seenIds.has(chatIdentifier)) {
//           seenIds.add(chatIdentifier);
//           uniqueChats.push({
//             ...chat,
//             id: chatIdentifier
//           });
//         }
//       });

//       const chats = uniqueChats.map((chat) => {
//         const chatKey = `${chat.id}-${chat.type}`;
//         return {
//           id: chat.id,
//           unread_count: resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp),
//           name: chat.name || 'Unknown',
//           content: chat.content || '[media]',
//           time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//           type: chat.type,
//           members_count: chat.members_count,
//           receiverId: chat.type === 'single' ? chat.id : null,
//           group_slug: chat.group_slug || null,
//           timestamp: chat.timestamp,
//         };
//       });

//       setBusinessChatList(chats);
//       cacheBusinessChats(chats);
      
//       return chats;
//     } catch (err) {
//       console.error('Failed to load business chat list:', err.response?.data || err.message);
//       setError('Failed to load chats. Please try again.');
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch all chats and combine them
//   const fetchAllChats = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const [businessChats, personalChats] = await Promise.all([
//         fetchBusinessChats(),
//         fetchPersonalChats()
//       ]);
      
//       const combined = combineChatLists(businessChats, personalChats);
      
//       const currentMode = chatModeFilterRef.current;
//       const initialList = currentMode === 'all' 
//         ? combined 
//         : currentMode === 'business' 
//           ? businessChats 
//           : personalChats;
//       setFilteredChatList(initialList);
      
//       return { businessChats, personalChats };
//     } catch (err) {
//       console.error('Failed to load chats:', err);
//       setError('Failed to load chats. Please try again.');
//       return { businessChats: [], personalChats: [] };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Load initial data from MMKV cache
//   useEffect(() => {
//     async function loadInitialData() {
//       setIsInitialLoading(true);
      
//       const loadedReadChats = loadReadChats();
      
//       const cachedBusiness = loadCachedBusinessChats();
//       const cachedPersonal = loadCachedPersonalChats();
      
//       let business = [];
//       let personal = [];
      
//       if (cachedBusiness) {
//         business = cachedBusiness.map(chat => {
//           const chatKey = `${chat.id}-${chat.type}`;
//           // Use the loaded read chats to determine unread count
//           const readAt = loadedReadChats.get(chatKey);
//           if (readAt) {
//             const msgTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
//             if (msgTime > readAt) {
//               // New messages after read time - keep server unread count
//               return chat;
//             } else {
//               // No new messages - clear the badge
//               return { ...chat, unread_count: 0 };
//             }
//           }
//           return chat;
//         });
//         setBusinessChatList(business);
//       }
      
//       if (cachedPersonal) {
//         personal = cachedPersonal.map(chat => {
//           const chatKey = `${chat.id}-${chat.type}`;
//           const readAt = loadedReadChats.get(chatKey);
//           if (readAt) {
//             const msgTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
//             if (msgTime > readAt) {
//               return chat;
//             } else {
//               return { ...chat, unread_count: 0 };
//             }
//           }
//           return chat;
//         });
//         setPersonalChatList(personal);
//       }

//       setReadChats(loadedReadChats);
//       readChatsRef.current = loadedReadChats;
//       saveReadChats(loadedReadChats);
      
//       let combined = [];
//       if (business.length > 0 || personal.length > 0) {
//         combined = combineChatLists(business, personal);
//       }
      
//       const initialList = chatModeFilter === 'all' 
//         ? combined 
//         : chatModeFilter === 'business' 
//           ? business 
//           : personal;
//       setFilteredChatList(initialList);
      
//       setIsInitialLoading(false);
//     }
    
//     loadInitialData();
//   }, []);

//   const markMessagesAsRead = async (chatId, chatType) => {
//     const chatKey = `${chatId}-${chatType}`;
//     const now = Date.now();
    
//     // Update read timestamp in Map
//     setReadChats(prev => {
//       const newMap = new Map(prev);
//       newMap.set(chatKey, now);
//       saveReadChats(newMap);
//       return newMap;
//     });
    
//     // Update all lists to remove badge immediately (optimistic update)
//     const updateList = (list) => 
//       list.map(chat => {
//         if (chat.id === chatId && chat.type === chatType) {
//           return { ...chat, unread_count: 0 };
//         }
//         return chat;
//       });
    
//     setBusinessChatList(prev => updateList(prev));
//     setPersonalChatList(prev => updateList(prev));
//     setCombinedChatList(prev => updateList(prev));
//     setFilteredChatList(prev => updateList(prev));
    
//     // Send read receipt to server
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await axios.post(
//         `${API_ROUTE}/chatmessage/mark-read/`,
//         {
//           chat_id: chatId,
//           chat_type: chatType,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
      
//       if (res.status !== 200 && res.status !== 201) {
//         throw new Error('API call failed');
//       }
      
//       // After marking as read on server, also update via WebSocket
//       if (wsConnected && chatWs.current) {
//         chatWs.current.send(JSON.stringify({
//           type: 'mark_read',
//           chat_id: chatId,
//           chat_type: chatType
//         }));
//       }
      
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//       // Revert if failed
//       setReadChats(prev => {
//         const newMap = new Map(prev);
//         newMap.delete(chatKey);
//         saveReadChats(newMap);
//         return newMap;
//       });
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchAllChats();
//       fetchUserData();
//     }, [])
//   );

//   // Silent background refresh
//   const fetchChatListSilently = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;
      
//       const [businessResponse, personalResponse] = await Promise.all([
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         }),
//         axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         })
//       ]);
      
//       // Process business chats
//       const businessFiltered = businessResponse.data.chats.filter(chat => chat.type !== 'channel');
//       const businessUnique = [];
//       const businessSeen = new Set();
//       businessFiltered.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!businessSeen.has(chatIdentifier)) {
//           businessSeen.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           businessUnique.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null,
//             timestamp: chat.timestamp,
//           });
//         }
//       });
      
//       // Process personal chats
//       const personalFiltered = personalResponse.data.chats.filter(chat => chat.type !== 'channel');
//       const personalUnique = [];
//       const personalSeen = new Set();
//       personalFiltered.forEach((chat) => {
//         const chatIdentifier = chat.type === 'single'
//           ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
//           : chat.group_slug || chat.id;
       
//         if (!personalSeen.has(chatIdentifier)) {
//           personalSeen.add(chatIdentifier);
//           const chatKey = `${chatIdentifier}-${chat.type}`;
//           personalUnique.push({
//             ...chat,
//             id: chatIdentifier,
//             unread_count: resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp),
//             name: chat.name || 'Unknown',
//             content: chat.content || '[media]',
//             time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
//             type: chat.type,
//             members_count: chat.members_count,
//             receiverId: chat.type === 'single' ? chatIdentifier : null,
//             group_slug: chat.group_slug || null,
//             timestamp: chat.timestamp,
//           });
//         }
//       });
      
//       checkForNewMessages(businessUnique);
//       checkForNewMessages(personalUnique);
      
//       setBusinessChatList(prev => {
//         if (JSON.stringify(prev) !== JSON.stringify(businessUnique)) {
//           cacheBusinessChats(businessUnique);
//           return businessUnique;
//         }
//         return prev;
//       });
      
//       setPersonalChatList(personalUnique);
//       cachePersonalChats(personalUnique);
      
//       const combined = combineChatLists(businessUnique, personalUnique);
      
//       const currentMode = chatModeFilterRef.current;
//       const currentSearch = searchQueryRef.current;
//       let currentList = [];
//       if (currentMode === 'all') {
//         currentList = combined;
//       } else if (currentMode === 'business') {
//         currentList = businessUnique;
//       } else {
//         currentList = personalUnique;
//       }
      
//       setFilteredChatList(() => {
//         if (currentSearch.trim() === '') {
//           return currentList;
//         }
//         const filtered = currentList.filter(chat =>
//           chat.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
//           (chat.content && chat.content.toLowerCase().includes(currentSearch.toLowerCase()))
//         );
//         return filtered;
//       });
      
//     } catch (err) {
//       console.error('Silent refresh error:', err);
//     }
//   };

//   const checkForNewMessages = (newChats) => {
//     if (!notificationSettingsRef.current.showNotifications || notificationSettingsRef.current.doNotDisturb) {
//       return;
//     }
//     newChats.forEach(chat => {
//       if (chat.unread_count > 0) {
//         const notificationKey = `notified_${chat.id}_${chat.unread_count}`;
       
//         AsyncStorage.getItem(notificationKey).then(alreadyNotified => {
//           if (!alreadyNotified) {
//             // Only show notification if not already read
//             const chatKey = `${chat.id}-${chat.type}`;
//             if (!readChatsRef.current.has(chatKey)) {
//               NotificationService.localNotification(
//                 chat.name,
//                 chat.content || 'New message',
//                 {
//                   chatId: chat.id,
//                   chatType: chat.type,
//                   name: chat.name,
//                 }
//               );
             
//               AsyncStorage.setItem(notificationKey, 'true');
//             }
//           }
//         });
//       }
//     });
//   };

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
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 200 || response.status === 201) {
//         const profile = response.data;
//         return profile;
//       } else {
//         console.warn('Failed to fetch profile');
//         return null;
//       }
//     } catch (err) {
//       console.error('fetchProfile error:', err);
//       return null;
//     }
//   };

//   const switchAccount = async (account) => {
//     setIsLoading(true);
//     try {
//       await AsyncStorage.setItem('accountMode', account);
//       setAccountMode(account);
//       if (account === 'personal') {
//         fetchAllChats();
//       } else {
//         const profile = await fetchProfile();
       
//         if (profile && profile.name && profile.name.trim() !== '') {
//           navigation.navigate('BusinessHome');
//         } else {
//           navigation.navigate('BusinessSetup');
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const highlightSearchText = (text = '', query) => {
//     if (!query || !text || typeof text !== 'string') return text;
   
//     const index = text.toLowerCase().indexOf(query.toLowerCase());
//     if (index === -1) return text;
//     return (
//       <Text>
//         {text.substring(0, index)}
//         <Text style={{ backgroundColor: isDark ? '#fbbf24' : '#FFEB3B', color: '#000' }}>
//           {text.substring(index, index + query.length)}
//         </Text>
//         {text.substring(index + query.length)}
//       </Text>
//     );
//   };

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

//   const handlePostStatus = async (media, caption) => {
//     if (!media) {
//       Alert.alert('Error', 'No media selected');
//       return;
//     }
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
     
//       let fileExt = media.uri.split('.').pop().toLowerCase();
//       let type = media.type;
     
//       if (!type) {
//         if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
//           type = 'image/jpeg';
//         } else if (['mp4', 'mov'].includes(fileExt)) {
//           type = 'video/mp4';
//         }
//       }
//       formData.append('media', {
//         uri: media.uri,
//         type: type,
//         name: `status_${Date.now()}.${fileExt}`,
//       });
//       if (caption) {
//         formData.append('text', caption);
//       }
//       const response = await axios.post(`${API_ROUTE}/status/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       Alert.alert('Success', 'Status posted successfully!');
     
//       return response.data;
//     } catch (error) {
//       Alert.alert('Error', 'Failed to post status');
//       throw error;
//     }
//   };

//   const handleOohmail = () => {
//     Linking.openURL('https://ooshmail.com');
//   }

//   const ellipsisRef = useRef(null);
//   const toggleDropdown = () => {
//     if (showDropdown) {
//       setShowDropdown(false);
//     } else {
//       ellipsisRef.current?.measure((fx, fy, width, height, px, py) => {
//         setButtonLayout({ x: px, y: py, width, height });
//         setShowDropdown(true);
//       });
//     }
//   };

//   // Switch between chat modes
//   const switchChatMode = (mode) => {
//     setChatModeFilter(mode);
//     setSearchQuery('');
    
//     let currentList = [];
//     if (mode === 'all') {
//       currentList = combinedChatList;
//     } else if (mode === 'business') {
//       currentList = businessChatList;
//     } else {
//       currentList = personalChatList;
//     }
//     setFilteredChatList(currentList);
//   };

//   // Get display name for chat item with source indicator
//   const getDisplayName = (item) => {
//     if (chatModeFilter === 'all' && item.source) {
//       return `${item.name} (${item.source === 'business' ? 'Business' : 'Personal'})`;
//     }
//     return item.name;
//   };

//   return (
//     <View style={[styles.container,{ backgroundColor: colors.backgroundSecondary }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'light-content'}
//         backgroundColor={isDark ? colors.backgroundSecondary : colors.primary}
//       />
      
//       <LinearGradient
//         colors={[colors.primary, colors.primary, colors.primary]}
//         style={styles.header}
//       >
//         <View style={[styles.headerTop,{ paddingTop: insets.top }]}>
//           <Text style={styles.headerTitle}>Chat</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity
//               style={styles.exploreIconContainer}
//               onPress={toggleTheme}
//             >
//               <Icon 
//                 style={{ marginRight: 10 }}
//                 name={isDark ? 'moon' : 'sunny'}
//                 size={25} 
//                 color="#FFFFFF" 
//               />
//             </TouchableOpacity>
            
//             <TouchableOpacity onPress={handleOohmail} style={styles.exploreIconContainer}>
//               <Icon name="compass-outline" size={27} color="#fff" style={{marginRight: 20}} />
//               <View style={styles.exploreBadge}>
//                 <Text style={styles.exploreBadgeText}>e-Mail</Text>
//               </View>
//             </TouchableOpacity>
            
//             <TouchableOpacity ref={ellipsisRef} onPress={toggleDropdown}>
//               <Icon name="ellipsis-vertical" size={25} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
        
//         <View style={styles.tabRow}>
//           {['Chats', 'Status', 'Calls'].map((item) => (
//             <TouchableOpacity
//               key={item}
//               onPress={() => {
//                 if (item === 'Status') {
//                   navigation.navigate('BStatusBar');
//                 } else if (item === 'Calls') {
//                   navigation.navigate('BCalls');
//                 } else {
//                   setTab(item);
//                 }
//               }}
//             >
//               <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
//               {tab === item && <View style={styles.tabUnderline} />}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </LinearGradient>
     
//       {/* Integrated Search Box with Mode Switcher - 3 tabs */}
//       <View style={styles.searchSection}>
//         <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
//           <Icon name="search" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
//           <TextInput
//             placeholder={`Search chats...`}
//             style={[styles.searchInput, { color: colors.text }]}
//             placeholderTextColor={colors.placeholder}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             clearButtonMode="while-editing"
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Icon name="close-circle" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           )}
//         </View>
        
//         {/* Mode Switcher - 3 tabs: All, Business, Personal */}
//         <View style={styles.modeSwitcherContainer}>
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'all' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('all')}
//           >
//             <Icon 
//               name="grid-outline" 
//               size={14} 
//               color={chatModeFilter === 'all' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'all' && styles.modeChipTextActive
//             ]}>
//               All
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'business' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('business')}
//           >
//             <Icon 
//               name="briefcase-outline" 
//               size={14} 
//               color={chatModeFilter === 'business' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'business' && styles.modeChipTextActive
//             ]}>
//               Business
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[
//               styles.modeChip,
//               chatModeFilter === 'personal' && styles.modeChipActive
//             ]}
//             onPress={() => switchChatMode('personal')}
//           >
//             <Icon 
//               name="person-outline" 
//               size={14} 
//               color={chatModeFilter === 'personal' ? '#fff' : colors.textSecondary} 
//             />
//             <Text style={[
//               styles.modeChipText,
//               chatModeFilter === 'personal' && styles.modeChipTextActive
//             ]}>
//               Personal
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <FlatList
//         data={filteredChatList}
//         keyExtractor={(item) => `${item.id}-${item.type}-${item.source || 'business'}`}
//         renderItem={({ item }) => {
//           // Check if this chat has unread messages
//           const chatKey = `${item.id}-${item.type}`;
//           const readAt = readChatsRef.current.get(chatKey);
//           const hasUnread = item.unread_count > 0;
          
//           // Determine if we should show the badge
//           // Show badge if:
//           // 1. Server says there are unread messages AND
//           // 2. Either we've never marked it as read, OR the latest message is newer than read time
//           let showBadge = false;
//           if (hasUnread) {
//             if (readAt == null) {
//               // Never marked as read - show badge
//               showBadge = true;
//             } else {
//               // Check if there are messages newer than read time
//               const msgTime = item.timestamp ? new Date(item.timestamp).getTime() : 0;
//               if (msgTime > readAt) {
//                 showBadge = true;
//               } else {
//                 // If server says unread but messages are older than read time,
//                 // don't show badge (this handles the case where server hasn't synced)
//                 showBadge = false;
//               }
//             }
//           }
          
//           return (
//             <TouchableOpacity
//               onPress={() => {
//                 markMessagesAsRead(item.id, item.type);
//                 if (item.type === 'group') {
//                   navigation.navigate('BusinessGroupChat', {
//                     groupId: item.id,
//                     groupSlug: item.group_slug,
//                     name: item.name,
//                     chatType: 'group',
//                     profile_image: item.avatar,
//                     members_count: item.members_count,
//                     creator_id: item.creator_id
//                   });
//                 } else {
//                   navigation.navigate('BPrivateChat', {
//                     receiverId: item.receiverId || item.id,
//                     name: item.name,
//                     chatType: 'single',
//                     profile_image: item.avatar,
//                     userIdd: item.receiverId || item.id
//                   });
//                 }
//               }}
//               style={[styles.chatItem, { backgroundColor: colors.card, marginTop: 10 }]}
//             >
//               <View style={styles.avatarContainer}>
//                 <Image
//                   source={
//                     item.avatar
//                       ? { uri: item.avatar }
//                       : item.type === 'group'
//                       ? { uri: 'https://via.placeholder.com/50/cccccc/808080?text=G' }
//                       : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                   }
//                   style={[styles.avatar, { backgroundColor: colors.surface }]}
//                 />
//                 {item.type === 'single' && (
//                   <OnlineStatusBadge 
//                     userId={item.receiverId || item.id}
//                     dotSize={14}
//                     position="bottom-right"
//                     borderWidth={2}
//                     borderColor={colors.card}
//                   />
//                 )}
//                 {item.type === 'group' && (
//                   <View style={[styles.groupBadge, { backgroundColor: colors.primary }]}>
//                     <Icon name="people" size={12} color="#fff" />
//                   </View>
//                 )}
//               </View>
              
//               <View style={styles.chatContent}>
//                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                   <Text style={[styles.chatName, { color: colors.text }]}>
//                     {highlightSearchText(getDisplayName(item), searchQuery) ||
//                     (item.type === 'group' ? 'Group Chat' : 'Unnamed Chat')}
//                   </Text>
//                   {item.type === 'group' && (
//                     <>
//                       <Icon
//                         name="people-outline"
//                         size={16}
//                         color={colors.textSecondary}
//                         style={{marginLeft: 6}}
//                       />
//                       <Text style={[styles.memberCountText, { color: colors.textSecondary }]}>
//                         {item.members_count || 0}
//                       </Text>
//                       {item.is_creator && (
//                         <Icon
//                           name="star"
//                           size={14}
//                           color="#FFD700"
//                           style={{marginLeft: 4}}
//                         />
//                       )}
//                     </>
//                   )}
//                 </View>
//                 <Text style={[styles.chatMessage, { color: colors.textSecondary }]} numberOfLines={1}>
//                   {highlightSearchText(item.content ||
//                     (item.type === 'group'
//                       ? (item.is_creator ? 'You created this group' : 'No messages yet')
//                       : '[No message]'),
//                   searchQuery)}
//                 </Text>
//               </View>
//               <View style={styles.timeBadgeContainer}>
//                 <Text style={[styles.chatTime, { color: colors.textTertiary }]}>{item.time || ''}</Text>
//                 {showBadge && (
//                   <View style={[styles.badge, { backgroundColor: colors.primary }]}>
//                     <Text style={styles.badgeText}>
//                       {item.unread_count > 9 ? '9+' : item.unread_count}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//         ListEmptyComponent={() => (
//           isLoading ? (
//             <Text style={[styles.emptyText, { marginTop: 80, textAlign: 'center', color: colors.textSecondary }]}>
//               Loading chats...
//             </Text>
//           ) : error ? (
//             <View style={styles.emptyList}>
//               <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
//               <TouchableOpacity onPress={fetchAllChats}>
//                 <Text style={[styles.emptyText, { color: colors.primary }]}>Retry</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.emptyList}>
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {searchQuery ? 'No matching chats found' : `No ${chatModeFilter === 'all' ? '' : chatModeFilter} chats available`}
//               </Text>
//               {!searchQuery && (
//                 <TouchableOpacity 
//                   onPress={() => {
//                     navigation.navigate(
//                       chatModeFilter === 'business' || chatModeFilter === 'all' 
//                         ? 'UserContactList' 
//                         : 'UserContactListPersonalAccount'
//                     );
//                   }}
//                 >
//                   <Text style={[styles.emptyText, { color: colors.primary, marginTop: 10, fontFamily: 'SourceSansPro-Medium' }]}>
//                     Start a new {chatModeFilter === 'all' ? '' : chatModeFilter} chat
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )
//         )}
//         contentContainerStyle={{ 
//           paddingBottom: insets.bottom + 120,
//         }}
//       />
      
//       <BottomNav 
//         navigation={navigation} 
//         setShowAccountModal={setShowAccountModal}
//         activeRoute="Home" 
//         style={{ zIndex: 9999 }}
//       />
      
//       <Modal
//         visible={showMediaModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowMediaModal(false)}>
//         <View style={[styles.mediaModalContainer, { backgroundColor: colors.overlay }]}>
//           <View style={[styles.mediaPreviewContainer, { backgroundColor: colors.background }]}>
//             {media?.type?.includes('video') ? (
//               <Video
//                 source={{uri: media.uri}}
//                 style={styles.mediaPreview}
//                 resizeMode="cover"
//                 repeat
//                 muted
//               />
//             ) : (
//               <Image source={{uri: media?.uri}} style={styles.mediaPreview} />
//             )}
//             <TextInput
//               style={[styles.captionInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBackground }]}
//               placeholder="Add caption to your status (optional)"
//               value={caption}
//               placeholderTextColor={colors.placeholder}
//               onChangeText={setCaption}
//               multiline
//             />
//             <View style={styles.mediaActionButtons}>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.cancelButton, { backgroundColor: colors.buttonSecondary }]}
//                 onPress={() => {
//                   setMedia(null);
//                   setCaption('');
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.mediaButton, styles.postButton, { backgroundColor: colors.primary }]}
//                 onPress={() => {
//                   handlePostStatus(media, caption);
//                   setShowMediaModal(false);
//                 }}>
//                 <Text style={[styles.buttonText, { color: colors.textInverse }]}>Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
      
//       <Modal
//         visible={showAccountModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAccountModal(false)}
//       >
//         <Animated.View
//           style={{
//             flex: 1,
//             backgroundColor: colors.overlay,
//             justifyContent: 'center',
//             alignItems: 'center',
//             opacity: fadeAnim,
//           }}
//         >
//           <View
//             style={{
//               width: '88%',
//               backgroundColor: colors.background,
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
//             <TouchableOpacity
//               onPress={() => setShowAccountModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 backgroundColor: colors.buttonSecondary,
//                 borderRadius: 50,
//                 padding: 8,
//               }}
//             >
//               <Icon name="close" size={22} color={colors.text} />
//             </TouchableOpacity>
     
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: '700',
//                 color: colors.text,
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
//                 color: colors.textSecondary,
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
//                 backgroundColor: colors.buttonSecondary,
//               }}
//               onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('PHome')
//                 setShowAccountModal(false);
//               }}
//             >
//               <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
//                 Switch Account
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>
     
//       <TouchableOpacity
//         style={[styles.fab2, { backgroundColor: colors.buttonSecondary, borderColor: colors.border }]}
//         onPress={() => {
//           navigation.navigate(
//             chatModeFilter === 'business' || chatModeFilter === 'all' 
//               ? 'UserContactList' 
//               : 'UserContactListPersonalAccount'
//           );
//         }}
//       >
//         <Icon name="chatbox-ellipses" size={24} color={colors.primary} />
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
//                   backgroundColor: colors.background,
//                 },
//               ]}
//             >
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Advertise');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Advertise</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('CreateChannel');
//               }}>
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Create Channel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setShowDropdown(false);
//                 navigation.navigate('Broadcast');
//               }}>
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Official Broadcast</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('GroupConnect');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>New Group</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Broadcaster', {
//                     roomName: 'match-123',
//                     streamId: 'stream-1',
//                   });
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Go Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('LiveStreaming');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Watch Live</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('SupplierNotificationScreen');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Deals</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('Explore');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Business Tools</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('EarningDashbord');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Earn Money</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('CreateCatalog');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Catalog</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('MarketPlace');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Market Place</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowDropdown(false);
//                   navigation.navigate('BSettings');
//                 }}
//               >
//                 <Text style={[styles.dropdownItem, { color: colors.text }]}>Settings</Text>
//               </TouchableOpacity>
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//       <EarningsSlideInManager />
//     </View>
//   );
// };

// const createStyles = (colors, isDark, insets) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.backgroundSecondary,
//   },
//   fab2: {
//     position: 'absolute',
//     bottom: 120,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     alignItems: 'center',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     zIndex: 1000,
//     borderWidth: 1,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 200,
//     right: 20,
//     width: 53,
//     height: 53,
//     borderRadius: 28,
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     zIndex: 1000,
//   },
//   header: {
//     paddingBottom: 10,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
//     backgroundColor: colors.primary,
//     elevation: 2,
//     zIndex: 1000,
//   },
//   headerTop: {
//     marginTop: Platform.OS === 'android' ? 10 : 10,
//     paddingHorizontal: 20,
//     height: Platform.OS === 'android' ? 90 : 130,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   timeBadgeContainer: {
//     alignItems: 'flex-end',
//     minWidth: 50,
//   },
//   badge: {
//     borderRadius: 50,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 4,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: 40,
//     right: 0,
//     backgroundColor: colors.backgroundSecondary,
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: isDark ? 0.3 : 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 2000,
//     borderWidth: 1,
//     borderColor: colors.border,
//     minWidth: 220,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     color: colors.text,
//     fontFamily: 'SourceSansPro-Regular',
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: Platform.OS === 'android' ? 28 : 35,
//     fontWeight: 'bold',
//     letterSpacing: 0.7,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tabRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   tabText: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 16,
//     fontFamily: 'SourceSansPro-Bold',
//     paddingVertical: 6,
//   },
//   tabTextActive: {
//     color: 'white',
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontWeight: '600',
//   },
//   tabUnderline: {
//     height: 3,
//     backgroundColor: 'white',
//     borderRadius: 2,
//     marginTop: 4,
//   },
//   searchSection: {
//     marginHorizontal: 16,
//     marginTop: 12,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     height: 44,
//     elevation: 0.5,
//     shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.0,
//     borderColor: colors.border,
//     zIndex: 500,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: 'SourceSansPro-Regular',
//     paddingRight: 8,
//     height: 44,
//   },
//   modeSwitcherContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginTop: 8,
//     gap: 8,
//   },
//   modeChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 5,
//     backgroundColor: colors.buttonSecondary,
//     borderWidth: 1,
//     borderColor: colors.border,
//     gap: 4,
//   },
//   modeChipActive: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   modeChipText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: colors.textSecondary,
//   },
//   modeChipTextActive: {
//     color: '#fff',
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
//     color: colors.textSecondary,
//   },
//   userItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomColor: colors.border,
//     borderBottomWidth: 1,
//   },
//   notificationIconContainer: {
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -5,
//     right: 15,
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   notificationBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   userName: {
//     marginLeft: 12,
//     fontSize: 16,
//     textTransform: 'capitalize',
//     color: colors.text,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: 12,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },
//   groupBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: colors.card,
//   },
//   sourceBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     borderRadius: 10,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: colors.card,
//   },
//   sourceBadgeText: {
//     color: '#fff',
//     fontSize: 8,
//     fontWeight: 'bold',
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatName: {
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//   },
//   chatMessage: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   chatTime: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 12,
//   },
//   emptyList: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.overlay,
//   },
//   modalContainer: {
//     backgroundColor: colors.background,
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
//     color: colors.text,
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButton: {
//     width: '100%',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: colors.primary,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: colors.textInverse,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   accountModalContainer: {
//     backgroundColor: colors.background,
//     borderRadius: 16,
//     padding: 20,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   memberCountText: {
//     fontSize: 12,
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
//     marginHorizontal: 12,
//     marginVertical: 4,
//     borderRadius: 12,
//     elevation: 0.6,
//     shadowColor: '#000',
//     shadowOpacity: isDark ? 0.2 : 0.1,
//     shadowRadius: 6,
//     borderWidth: 0.2,
//     borderColor: colors.border,
//   },
//   fullScreenLoading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalOverlay: {
//     flex: 1,
//     backgroundColor: colors.overlay,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalContainer: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: colors.background,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   welcomeModalHeader: {
//     padding: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   welcomeModalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: colors.textInverse,
//     marginTop: 15,
//     textAlign: 'center',
//   },
//   welcomeModalContent: {
//     padding: 20,
//     maxHeight: '60%',
//   },
//   featureCard: {
//     backgroundColor: colors.surface,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//   },
//   featureTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//     marginTop: 10,
//   },
//   featureDescription: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 5,
//     lineHeight: 20,
//   },
//   welcomeModalFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   welcomeModalButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeModalButtonText: {
//     color: colors.textInverse,
//     fontSize: 18,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   mediaModalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mediaPreviewContainer: {
//     width: '90%',
//     borderRadius: 10,
//     padding: 15,
//   },
//   mediaPreview: {
//     width: '100%',
//     height: 300,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   captionInput: {
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     minHeight: 50,
//     marginBottom: 15,
//   },
//   mediaActionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   mediaButton: {
//     padding: 12,
//     borderRadius: 5,
//     width: '48%',
//     alignItems: 'center',
//   },
//   cancelButton: {},
//   postButton: {},
//   buttonText: {
//     fontWeight: 'bold',
//   },
//   exploreIconContainer: {
//     position: 'relative',
//     marginRight: 15,
//   },
//   exploreBadge: {
//     position: 'absolute',
//     top: -6,
//     right: -5,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 5,
//     paddingVertical: 2,
//     minWidth: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: 'white',
//   },
//   exploreBadgeText: {
//     color: colors.primary,
//     fontSize: 9,
//     textTransform: 'uppercase',
//     fontWeight: '800',
//     letterSpacing: 0.3,
//   },
// });

// export default BusinessHomeScreen;


import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import BottomNav from '../components/BottomNavSocialMedia';
import { Divider } from 'react-native-paper';
import SwitchAccountSheet from '../components/SwitchAccountSheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import IncomingCallModal from '../components/IncomingCallModal';
import NotificationService from '../src/services/PushNotifications';
import Video from 'react-native-video';
import { useTheme } from '../src/context/ThemeContext';
import EarningsSlideInManager from '../components/EarningsSlideInManager';
import OnlineStatusBadge from '../components/OnlineStatusBadge';
import { createMMKV } from 'react-native-mmkv';

const windowWidth = Dimensions.get('window').width;

// Initialize MMKV instances for caching
const businessChatStorage = createMMKV({
  id: 'business-chats-cache'
});

const personalChatStorage = createMMKV({
  id: 'personal-chats-cache'
});

const readChatsStorage = createMMKV({
  id: 'read-chats-cache'
});

const BusinessHomeScreen = ({ navigation }) => {
  const { colors, theme, toggleTheme, isDark  } = useTheme(); 
  
  // Mode filter state - 'all', 'business', or 'personal'
  const [chatModeFilter, setChatModeFilter] = useState('business');
  
  const [tab, setTab] = useState('Chats');
  const [userData, setUserData] = useState([]);
  const [businessChatList, setBusinessChatList] = useState([]);
  const [personalChatList, setPersonalChatList] = useState([]);
  const [combinedChatList, setCombinedChatList] = useState([]);
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
  const [readChats, setReadChats] = useState(new Map());
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const insets = useSafeAreaInsets();
  
  const styles = createStyles(colors, isDark, insets); 

  const [notificationSettings, setNotificationSettings] = useState({
    showNotifications: true,
    doNotDisturb: false,
  });

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // ---- "Latest value" refs -----------------------------------------------
  const readChatsRef = useRef(new Map());
  const businessChatListRef = useRef([]);
  const personalChatListRef = useRef([]);
  const combinedChatListRef = useRef([]);
  const chatModeFilterRef = useRef('business');
  const searchQueryRef = useRef('');
  const notificationSettingsRef = useRef({ showNotifications: true, doNotDisturb: false });
  const wsConnectedRef = useRef(false);
  const isFocusedRef = useRef(true);
  const pendingUpdatesRef = useRef({ business: null, personal: null });
  const updateTimeoutRef = useRef(null);

  useEffect(() => { readChatsRef.current = readChats; }, [readChats]);
  useEffect(() => { businessChatListRef.current = businessChatList; }, [businessChatList]);
  useEffect(() => { personalChatListRef.current = personalChatList; }, [personalChatList]);
  useEffect(() => { combinedChatListRef.current = combinedChatList; }, [combinedChatList]);
  useEffect(() => { chatModeFilterRef.current = chatModeFilter; }, [chatModeFilter]);
  useEffect(() => { searchQueryRef.current = searchQuery; }, [searchQuery]);
  useEffect(() => { notificationSettingsRef.current = notificationSettings; }, [notificationSettings]);
  // --------------------------------------------------------------------------


const refreshChatList = useCallback(async () => {
  setIsLoading(true);
  try {
    await fetchAllChats();
  } catch (error) {
    console.error('Error refreshing chats:', error);
  } finally {
    setIsLoading(false);
  }
}, [fetchAllChats]);

// Use it when the screen comes into focus
useFocusEffect(
  useCallback(() => {
    refreshChatList();
  }, [refreshChatList])
);


  // Get the actual unread count for a chat
  const getActualUnreadCount = (chat) => {
    if (!chat) return 0;
    const chatKey = `${chat.id}-${chat.type}`;
    const readAt = readChatsRef.current.get(chatKey);
    
    // If never marked as read, return the server count
    if (readAt == null) {
      return chat.unread_count || 0;
    }
    
    // If we have a timestamp, check if messages are newer than read time
    const msgTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
    if (msgTime > readAt) {
      // There are new messages after read time - return server count
      return chat.unread_count || 0;
    }
    
    // All messages are older than read time - no unread messages
    return 0;
  };

  const resolveUnreadCount = (chatKey, serverUnreadCount, chatTimestamp) => {
    const count = serverUnreadCount || 0;
    const readAt = readChatsRef.current.get(chatKey);
    
    if (readAt == null) {
      return count;
    }
    
    const msgTime = chatTimestamp ? new Date(chatTimestamp).getTime() : 0;
    if (msgTime > readAt) {
      return count;
    }
    
    return 0;
  };

  const fetchUnreadNotificationCount = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/notifications/unread-count/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setUnreadNotificationCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    loadNotificationSettings();
    fetchUnreadNotificationCount();
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
        const SIGNALING_SERVER = 'wss://api.showapp.ng';
  
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
  
            const callerData = data.offer?.callerInfo || {};
            
            const profileImage = callerData.profileImage || 
                                 data.offer?.profileImage || 
                                 '';
            
            const callerName = callerData.name || 
                               data.offer?.callerName || 
                               'Unknown Caller';
  
            const isVideo = data.offer?.isVideoCall || false;
  
            console.log('[Incoming Call] Caller info:', {
              name: callerName,
              hasProfileImage: !!profileImage,
            });
  
            setCallerInfo({
              profileImage: profileImage,
              name: callerName,
              offer: data.offer,
            });
  
            setShowIncomingCallModal(true);
          }
        };
  
        ws.current.onerror = (e) => {
          //console.error('[Call WS] Error', e);
        };
  
        ws.current.onclose = (e) => {
          //console.log('[Call WS] Closed', e.code, e.reason);
        };
      } catch (err) {
       // console.error('[Call WS] Failed to connect', err);
      }
    };
  
    connectCallWebSocket();
  
    return () => {
      ws.current?.close();
    };
  }, []);



// Chat WebSocket + polling state
const [wsConnected, setWsConnected] = useState(false);
const [wsError, setWsError] = useState(null);
const chatWs = useRef(null);
const pollingInterval = useRef(null);

const connectChatWebSocket = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const retrieveUserId = await AsyncStorage.getItem('userData');
    
    if (!token || !retrieveUserId) {
      //console.log('[Chat WS] Missing auth data');
      return;
    }
    
    const userData = JSON.parse(retrieveUserId);
    const currentUserId = userData.id;
    
    const CHAT_SERVER = 'wss://api.showapp.ng';
    const url = `${CHAT_SERVER}/ws/chat/${currentUserId}/?token=${token}`;
    
    //console.log('[Chat WS] Connecting to:', url.replace(token, '***'));
    
    if (chatWs.current) {
      chatWs.current.close();
      chatWs.current = null;
    }
    
    chatWs.current = new WebSocket(url);
    
    const connectionTimeout = setTimeout(() => {
      if (chatWs.current && chatWs.current.readyState !== WebSocket.OPEN) {
        //console.log('[Chat WS] Connection timeout');
        chatWs.current.close();
        //setWsConnected(false);
      }
    }, 10000);
    
    // chatWs.current.onopen = () => {
    //   clearTimeout(connectionTimeout);
    //   //console.log('[Chat WS] Connected successfully');
    //   setWsConnected(true);
    //   //setWsError(null);
    // };
    
    chatWs.current.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
       // console.log('[Chat WS] Message received:', data.type);
        
        if (data.type === 'new_message') {
          handleNewMessage(data);
        } else if (data.type === 'message_read') {
          //console.log('[Chat WS] Message read confirmation:', data);
        } else if (data.type === 'typing') {
          //console.log('[Chat WS] Typing indicator:', data);
        }
      } catch (error) {
        //console.error('[Chat WS] Error parsing message:', error);
      }
    };
    
    chatWs.current.onerror = (error) => {
      clearTimeout(connectionTimeout);
      //console.error('[Chat WS] Error:', error);
      setWsConnected(false);
      //setWsError('WebSocket connection error');
    };
    
    chatWs.current.onclose = (event) => {
      clearTimeout(connectionTimeout);
     // console.log(`[Chat WS] Disconnected - Code: ${event.code}, Reason: ${event.reason}`);
      setWsConnected(false);
      
      if (event.code !== 1000) {
        setTimeout(() => {
          //console.log('[Chat WS] Attempting to reconnect...');
          connectChatWebSocket();
        }, 5000);
      }
    };
    
  } catch (error) {
    //console.error('[Chat WS] Failed to connect:', error);
    //setWsConnected(false);
    //setWsError(error.message);
  }
};

// Handle new message from WebSocket - store update for later if not focused
const handleNewMessage = (data) => {
  const { chat_id, chat_type, content, timestamp, sender_name, account_mode } = data;
  
  // Determine which list to update
  const isBusiness = account_mode === 'business' || !account_mode;
  const listRef = isBusiness ? businessChatListRef : personalChatListRef;
  const currentList = listRef.current;
  
  // Find the chat in the current list
  const existingIndex = currentList.findIndex(chat => 
    chat.id === chat_id && chat.type === chat_type
  );

  let updatedList = [...currentList];
  
  if (existingIndex !== -1) {
    // Update existing chat
    const existingChat = updatedList[existingIndex];
    const currentUnread = existingChat.unread_count || 0;
    
    updatedList[existingIndex] = {
      ...existingChat,
      content: content || '[media]',
      time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread_count: currentUnread + 1,
      timestamp: timestamp,
      name: sender_name || existingChat.name
    };
    
    // Move to top
    const [item] = updatedList.splice(existingIndex, 1);
    updatedList.unshift(item);
  } else {
    // New chat - fetch full list
    fetchAllChats();
    return;
  }

  // Store the update for later if not focused
  if (!isFocusedRef.current) {
    // Store pending update
    if (isBusiness) {
      pendingUpdatesRef.current.business = updatedList;
    } else {
      pendingUpdatesRef.current.personal = updatedList;
    }
    return;
  }

  // Apply update immediately if focused
  applyChatUpdate(updatedList, isBusiness);
};

// Apply chat update to state
const applyChatUpdate = (updatedList, isBusiness) => {
  if (isBusiness) {
    setBusinessChatList(updatedList);
    cacheBusinessChats(updatedList);
  } else {
    setPersonalChatList(updatedList);
    cachePersonalChats(updatedList);
  }
  
  // Update combined list
  const business = isBusiness ? updatedList : businessChatListRef.current;
  const personal = isBusiness ? personalChatListRef.current : updatedList;
  const combined = combineChatLists(business, personal);
  setCombinedChatList(combined);
  
  // Update filtered list
  updateFilteredList(combined, business, personal);
};

// Update filtered list based on current mode
const updateFilteredList = (combined, business, personal) => {
  const currentMode = chatModeFilterRef.current;
  const currentSearch = searchQueryRef.current;
  let currentList = [];
  
  if (currentMode === 'all') {
    currentList = combined;
  } else if (currentMode === 'business') {
    currentList = business;
  } else {
    currentList = personal;
  }
  
  if (currentSearch.trim() === '') {
    setFilteredChatList(currentList);
  } else {
    const filtered = currentList.filter(chat =>
      chat.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      (chat.content && chat.content.toLowerCase().includes(currentSearch.toLowerCase()))
    );
    setFilteredChatList(filtered);
  }
};

const startPolling = () => {
  if (pollingInterval.current) {
    clearInterval(pollingInterval.current);
  }
  
  pollingInterval.current = setInterval(async () => {
    try {
      const appState = AppState.currentState;
      if (appState !== 'active') return;
      if (isLoading) return;
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      
      const [businessResponse, personalResponse] = await Promise.all([
        axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 5000,
        }),
        axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 5000,
        })
      ]);
      
      processNewChatsSilently(businessResponse.data.chats, 'business');
      processNewChatsSilently(personalResponse.data.chats, 'personal');
      
    } catch (error) {
      // Silent fail for polling
    }
  }, 5000);
};

// Process new chats silently - only store updates, don't apply if not focused
const processNewChatsSilently = (newChats, mode) => {
  const filteredChats = newChats.filter(chat => chat.type !== 'channel');
  let hasChanges = false;
  
  const processedChats = filteredChats.map(newChat => {
    const chatIdentifier = newChat.type === 'single'
      ? newChat.participants?.find(id => id !== newChat.current_user_id) || newChat.id
      : newChat.group_slug || newChat.id;
    
    const chatKey = `${chatIdentifier}-${newChat.type}`;
    const actualUnread = resolveUnreadCount(chatKey, newChat.unread_count, newChat.timestamp);
    
    return {
      ...newChat,
      id: chatIdentifier,
      unread_count: actualUnread,
      name: newChat.name || 'Unknown',
      content: newChat.content || '[media]',
      time: new Date(newChat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: newChat.avatar ? `${API_ROUTE_IMAGE}${newChat.avatar}` : null,
      type: newChat.type,
      members_count: newChat.members_count,
      receiverId: newChat.type === 'single' ? chatIdentifier : null,
      group_slug: newChat.group_slug || null,
      timestamp: newChat.timestamp,
    };
  });

  // Check if there are actual changes
  const currentList = mode === 'business' ? businessChatListRef.current : personalChatListRef.current;
  
  if (currentList.length !== processedChats.length) {
    hasChanges = true;
  } else {
    for (let i = 0; i < currentList.length; i++) {
      const current = currentList[i];
      const processed = processedChats.find(c => c.id === current.id && c.type === current.type);
      if (!processed || 
          processed.unread_count !== current.unread_count || 
          processed.content !== current.content ||
          processed.timestamp !== current.timestamp) {
        hasChanges = true;
        break;
      }
    }
  }

  if (!hasChanges) return;

  // Store the update
  if (mode === 'business') {
    pendingUpdatesRef.current.business = processedChats;
  } else {
    pendingUpdatesRef.current.personal = processedChats;
  }

  // If focused, apply updates immediately
  if (isFocusedRef.current) {
    applyPendingUpdates();
  }
};

// Apply all pending updates at once
const applyPendingUpdates = () => {
  const businessUpdate = pendingUpdatesRef.current.business;
  const personalUpdate = pendingUpdatesRef.current.personal;
  
  let business = businessChatListRef.current;
  let personal = personalChatListRef.current;
  
  if (businessUpdate) {
    business = businessUpdate;
    setBusinessChatList(business);
    cacheBusinessChats(business);
    pendingUpdatesRef.current.business = null;
  }
  
  if (personalUpdate) {
    personal = personalUpdate;
    setPersonalChatList(personal);
    cachePersonalChats(personal);
    pendingUpdatesRef.current.personal = null;
  }
  
  if (businessUpdate || personalUpdate) {
    const combined = combineChatLists(business, personal);
    setCombinedChatList(combined);
    updateFilteredList(combined, business, personal);
  }
};

// ---- Single consolidated real-time setup effect ---------------------------
useEffect(() => {
  connectChatWebSocket();
  startPolling();

  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      console.log('[Chat] App foregrounded');
      isFocusedRef.current = true;
      
      // Apply any pending updates
      if (pendingUpdatesRef.current.business || pendingUpdatesRef.current.personal) {
        applyPendingUpdates();
      }
      
      fetchChatListSilently();

      if (!wsConnectedRef.current) {
        connectChatWebSocket();
      }
      if (!pollingInterval.current) {
        startPolling();
      }
    } else {
      isFocusedRef.current = false;
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    }
  });

  return () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    if (chatWs.current) {
      chatWs.current.close(1000, 'component unmount');
      chatWs.current = null;
    }
    subscription.remove();
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
  };
}, []);
// ---------------------------------------------------------------------------

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
    // Determine which list to show based on filter and search
    let currentList = [];
    if (chatModeFilter === 'all') {
      currentList = combinedChatList;
    } else if (chatModeFilter === 'business') {
      currentList = businessChatList;
    } else {
      currentList = personalChatList;
    }

    if (searchQuery.trim() === '') {
      setFilteredChatList(currentList);
    } else {
      const filtered = currentList.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredChatList(filtered);
    }
  }, [searchQuery, businessChatList, personalChatList, combinedChatList, chatModeFilter]);

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

  // MMKV Cache functions
  const loadReadChats = () => {
    try {
      const stored = readChatsStorage.getString('readChats');
      if (stored) {
        const parsedObject = JSON.parse(stored);
        const parsedMap = new Map(Object.entries(parsedObject));
        setReadChats(parsedMap);
        return parsedMap;
      }
      return new Map();
    } catch (e) {
      console.error('Load read chats error:', e);
      return new Map();
    }
  };

  const saveReadChats = (readChatsMap) => {
    try {
      const obj = Object.fromEntries(readChatsMap);
      readChatsStorage.set('readChats', JSON.stringify(obj));
    } catch (e) {
      console.error('Save read chats error:', e);
    }
  };

  useEffect(() => {
    if (readChats && readChats.size > 0) {
      saveReadChats(readChats);
    }
  }, [readChats]);

  const loadCachedPersonalChats = () => {
    try {
      const cached = personalChatStorage.getString('personalChats');
      if (cached) {
        const parsed = JSON.parse(cached);
        setPersonalChatList(parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Load cached personal chats error:', e);
    }
    return null;
  };

  const loadCachedBusinessChats = () => {
    try {
      const cached = businessChatStorage.getString('businessChats');
      if (cached) {
        const parsed = JSON.parse(cached);
        setBusinessChatList(parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Load cache error:', e);
    }
    return null;
  };

  const cacheBusinessChats = (chats) => {
    try {
      businessChatStorage.set('businessChats', JSON.stringify(chats));
    } catch (e) {
      console.error('Cache business chats error:', e);
    }
  };

  const cachePersonalChats = (chats) => {
    try {
      personalChatStorage.set('personalChats', JSON.stringify(chats));
    } catch (e) {
      console.error('Cache personal chats error:', e);
    }
  };

  // Combine business and personal chats with source tracking
  const combineChatLists = (business, personal) => {
    const combined = [];
    const seenIds = new Set();

    business.forEach(chat => {
      const key = `${chat.id}-${chat.type}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        combined.push({
          ...chat,
          source: 'business',
          displayName: `${chat.name} (Business)`
        });
      }
    });

    personal.forEach(chat => {
      const key = `${chat.id}-${chat.type}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        combined.push({
          ...chat,
          source: 'personal',
          displayName: `${chat.name} (Personal)`
        });
      }
    });

    combined.sort((a, b) => {
      const timeA = new Date(a.timestamp || a.time).getTime();
      const timeB = new Date(b.timestamp || b.time).getTime();
      return timeB - timeA;
    });

    return combined;
  };

  // Fetch personal chats from API
  const fetchPersonalChats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return [];
      
      const response = await axios.get(
        `${API_ROUTE}/api/chat/list/?account_mode=personal`, 
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
          const chatKey = `${chatIdentifier}-${chat.type}`;
          const actualUnread = resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp);
          uniqueChats.push({
            ...chat,
            id: chatIdentifier,
            unread_count: actualUnread,
            name: chat.name || 'Unknown',
            content: chat.content || '[media]',
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
            type: chat.type,
            members_count: chat.members_count,
            receiverId: chat.type === 'single' ? chatIdentifier : null,
            group_slug: chat.group_slug || null,
            key: `${chat.id}-${chat.type}`,
            timestamp: chat.timestamp,
          });
        }
      });

      setPersonalChatList(uniqueChats);
      cachePersonalChats(uniqueChats);
      
      return uniqueChats;
    } catch (err) {
      console.error('Failed to load personal chats:', err.response?.data || err.message);
      return [];
    }
  };

  // Fetch business chats from API
  const fetchBusinessChats = async () => {
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

      const chats = uniqueChats.map((chat) => {
        const chatKey = `${chat.id}-${chat.type}`;
        const actualUnread = resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp);
        return {
          id: chat.id,
          unread_count: actualUnread,
          name: chat.name || 'Unknown',
          content: chat.content || '[media]',
          time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
          type: chat.type,
          members_count: chat.members_count,
          receiverId: chat.type === 'single' ? chat.id : null,
          group_slug: chat.group_slug || null,
          timestamp: chat.timestamp,
        };
      });

      setBusinessChatList(chats);
      cacheBusinessChats(chats);
      
      return chats;
    } catch (err) {
      console.error('Failed to load business chat list:', err.response?.data || err.message);
      setError('Failed to load chats. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all chats and combine them
  const fetchAllChats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [businessChats, personalChats] = await Promise.all([
        fetchBusinessChats(),
        fetchPersonalChats()
      ]);
      
      const combined = combineChatLists(businessChats, personalChats);
      setCombinedChatList(combined);
      
      const currentMode = chatModeFilterRef.current;
      const initialList = currentMode === 'all' 
        ? combined 
        : currentMode === 'business' 
          ? businessChats 
          : personalChats;
      setFilteredChatList(initialList);
      
      return { businessChats, personalChats };
    } catch (err) {
      console.error('Failed to load chats:', err);
      setError('Failed to load chats. Please try again.');
      return { businessChats: [], personalChats: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data from MMKV cache
  useEffect(() => {
    async function loadInitialData() {
      setIsInitialLoading(true);
      
      const loadedReadChats = loadReadChats();
      
      const cachedBusiness = loadCachedBusinessChats();
      const cachedPersonal = loadCachedPersonalChats();
      
      let business = [];
      let personal = [];
      
      if (cachedBusiness) {
        business = cachedBusiness.map(chat => {
          const chatKey = `${chat.id}-${chat.type}`;
          const readAt = loadedReadChats.get(chatKey);
          if (readAt) {
            const msgTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
            if (msgTime > readAt) {
              return chat;
            } else {
              return { ...chat, unread_count: 0 };
            }
          }
          return chat;
        });
        setBusinessChatList(business);
      }
      
      if (cachedPersonal) {
        personal = cachedPersonal.map(chat => {
          const chatKey = `${chat.id}-${chat.type}`;
          const readAt = loadedReadChats.get(chatKey);
          if (readAt) {
            const msgTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
            if (msgTime > readAt) {
              return chat;
            } else {
              return { ...chat, unread_count: 0 };
            }
          }
          return chat;
        });
        setPersonalChatList(personal);
      }

      setReadChats(loadedReadChats);
      readChatsRef.current = loadedReadChats;
      saveReadChats(loadedReadChats);
      
      let combined = [];
      if (business.length > 0 || personal.length > 0) {
        combined = combineChatLists(business, personal);
        setCombinedChatList(combined);
      }
      
      const initialList = chatModeFilter === 'all' 
        ? combined 
        : chatModeFilter === 'business' 
          ? business 
          : personal;
      setFilteredChatList(initialList);
      
      setIsInitialLoading(false);
    }
    
    loadInitialData();
  }, []);

  const markMessagesAsRead = async (chatId, chatType) => {
    const chatKey = `${chatId}-${chatType}`;
    const now = Date.now();
    
    // Update read timestamp in Map
     setReadChats(prev => {
    const newMap = new Map(prev);
    newMap.set(chatKey, now);
    // Save to MMKV
    try {
      const obj = Object.fromEntries(newMap);
      readChatsStorage.set('readChats', JSON.stringify(obj));
    } catch (e) {
      console.error('Save read chats error:', e);
    }
    return newMap;
  });
    
    // Update all lists to remove badge immediately
    const updateList = (list) => 
      list.map(chat => {
        if (chat.id === chatId && chat.type === chatType) {
          return { ...chat, unread_count: 0 };
        }
        return chat;
      });
    
    setBusinessChatList(prev => updateList(prev));
    setPersonalChatList(prev => updateList(prev));
    setCombinedChatList(prev => updateList(prev));
    setFilteredChatList(prev => updateList(prev));
    
    // Send read receipt to server
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
      
      if (wsConnected && chatWs.current) {
        chatWs.current.send(JSON.stringify({
          type: 'mark_read',
          chat_id: chatId,
          chat_type: chatType
        }));
      }
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
      setReadChats(prev => {
        const newMap = new Map(prev);
        newMap.delete(chatKey);
        saveReadChats(newMap);
        return newMap;
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      
      // Apply any pending updates when screen comes into focus
      if (pendingUpdatesRef.current.business || pendingUpdatesRef.current.personal) {
        applyPendingUpdates();
      }
      
      fetchAllChats();
      fetchUserData();
      
      return () => {
        isFocusedRef.current = false;
      };
    }, [])
  );

  // Silent background refresh
  const fetchChatListSilently = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      
      const [businessResponse, personalResponse] = await Promise.all([
        axios.get(`${API_ROUTE}/api/chat/list/?account_mode=business`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        axios.get(`${API_ROUTE}/api/chat/list/?account_mode=personal`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);
      
      // Process business chats
      const businessFiltered = businessResponse.data.chats.filter(chat => chat.type !== 'channel');
      const businessUnique = [];
      const businessSeen = new Set();
      businessFiltered.forEach((chat) => {
        const chatIdentifier = chat.type === 'single'
          ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
          : chat.group_slug || chat.id;
       
        if (!businessSeen.has(chatIdentifier)) {
          businessSeen.add(chatIdentifier);
          const chatKey = `${chatIdentifier}-${chat.type}`;
          const actualUnread = resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp);
          businessUnique.push({
            ...chat,
            id: chatIdentifier,
            unread_count: actualUnread,
            name: chat.name || 'Unknown',
            content: chat.content || '[media]',
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
            type: chat.type,
            members_count: chat.members_count,
            receiverId: chat.type === 'single' ? chatIdentifier : null,
            group_slug: chat.group_slug || null,
            timestamp: chat.timestamp,
          });
        }
      });
      
      // Process personal chats
      const personalFiltered = personalResponse.data.chats.filter(chat => chat.type !== 'channel');
      const personalUnique = [];
      const personalSeen = new Set();
      personalFiltered.forEach((chat) => {
        const chatIdentifier = chat.type === 'single'
          ? chat.participants?.find(id => id !== chat.current_user_id) || chat.id
          : chat.group_slug || chat.id;
       
        if (!personalSeen.has(chatIdentifier)) {
          personalSeen.add(chatIdentifier);
          const chatKey = `${chatIdentifier}-${chat.type}`;
          const actualUnread = resolveUnreadCount(chatKey, chat.unread_count, chat.timestamp);
          personalUnique.push({
            ...chat,
            id: chatIdentifier,
            unread_count: actualUnread,
            name: chat.name || 'Unknown',
            content: chat.content || '[media]',
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: chat.avatar ? `${API_ROUTE_IMAGE}${chat.avatar}` : null,
            type: chat.type,
            members_count: chat.members_count,
            receiverId: chat.type === 'single' ? chatIdentifier : null,
            group_slug: chat.group_slug || null,
            timestamp: chat.timestamp,
          });
        }
      });
      
      // Store updates for later
      let hasBusinessChange = false;
      let hasPersonalChange = false;
      
      if (JSON.stringify(businessChatListRef.current) !== JSON.stringify(businessUnique)) {
        pendingUpdatesRef.current.business = businessUnique;
        hasBusinessChange = true;
      }
      
      if (JSON.stringify(personalChatListRef.current) !== JSON.stringify(personalUnique)) {
        pendingUpdatesRef.current.personal = personalUnique;
        hasPersonalChange = true;
      }
      
      // Only apply if focused
      if (isFocusedRef.current && (hasBusinessChange || hasPersonalChange)) {
        applyPendingUpdates();
      }
      
    } catch (err) {
      console.error('Silent refresh error:', err);
    }
  };

  const checkForNewMessages = (newChats) => {
    if (!notificationSettingsRef.current.showNotifications || notificationSettingsRef.current.doNotDisturb) {
      return;
    }
    newChats.forEach(chat => {
      if (chat.unread_count > 0) {
        const notificationKey = `notified_${chat.id}_${chat.unread_count}`;
       
        AsyncStorage.getItem(notificationKey).then(alreadyNotified => {
          if (!alreadyNotified) {
            const chatKey = `${chat.id}-${chat.type}`;
            if (!readChatsRef.current.has(chatKey)) {
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
          }
        });
      }
    });
  };

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
        fetchAllChats();
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

  const switchChatMode = (mode) => {
    setChatModeFilter(mode);
    setSearchQuery('');
    
    let currentList = [];
    if (mode === 'all') {
      currentList = combinedChatList;
    } else if (mode === 'business') {
      currentList = businessChatList;
    } else {
      currentList = personalChatList;
    }
    setFilteredChatList(currentList);
  };

  const getDisplayName = (item) => {
    if (chatModeFilter === 'all' && item.source) {
      return `${item.name} (${item.source === 'business' ? 'Business' : 'Personal'})`;
    }
    return item.name;
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
          <Text style={styles.headerTitle}>Chat</Text>
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
     
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <Icon name="search" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
          <TextInput
            placeholder={`Search chats...`}
            style={[styles.searchInput, { color: colors.text }]}
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
        
        <View style={styles.modeSwitcherContainer}>
          <TouchableOpacity
            style={[
              styles.modeChip,
              chatModeFilter === 'all' && styles.modeChipActive
            ]}
            onPress={() => switchChatMode('all')}
          >
            <Icon 
              name="grid-outline" 
              size={14} 
              color={chatModeFilter === 'all' ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.modeChipText,
              chatModeFilter === 'all' && styles.modeChipTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modeChip,
              chatModeFilter === 'business' && styles.modeChipActive
            ]}
            onPress={() => switchChatMode('business')}
          >
            <Icon 
              name="briefcase-outline" 
              size={14} 
              color={chatModeFilter === 'business' ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.modeChipText,
              chatModeFilter === 'business' && styles.modeChipTextActive
            ]}>
              Business
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modeChip,
              chatModeFilter === 'personal' && styles.modeChipActive
            ]}
            onPress={() => switchChatMode('personal')}
          >
            <Icon 
              name="person-outline" 
              size={14} 
              color={chatModeFilter === 'personal' ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.modeChipText,
              chatModeFilter === 'personal' && styles.modeChipTextActive
            ]}>
              Personal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredChatList}
        keyExtractor={(item) => `${item.id}-${item.type}-${item.source || 'business'}`}
        renderItem={({ item }) => {
          // Get the actual unread count for this chat
          const actualUnread = getActualUnreadCount(item);
          
          return (
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
                    userIdd: item.receiverId || item.id
                  });
                }
              }}
              style={[styles.chatItem, { backgroundColor: colors.card, marginTop: 10 }]}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    item.avatar
                      ? { uri: item.avatar }
                      : item.type === 'group'
                      ? { uri: 'https://via.placeholder.com/50/cccccc/808080?text=G' }
                      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={[styles.avatar, { backgroundColor: colors.surface }]}
                />
                {item.type === 'single' && (
                  <OnlineStatusBadge 
                    userId={item.receiverId || item.id}
                    dotSize={14}
                    position="bottom-right"
                    borderWidth={2}
                    borderColor={colors.card}
                  />
                )}
                {item.type === 'group' && (
                  <View style={[styles.groupBadge, { backgroundColor: colors.primary }]}>
                    <Icon name="people" size={12} color="#fff" />
                  </View>
                )}
              </View>
              
              <View style={styles.chatContent}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.chatName, { color: colors.text }]}>
                    {highlightSearchText(getDisplayName(item), searchQuery) ||
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
                      <Text style={[styles.memberCountText, { color: colors.textSecondary }]}>
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
                <Text style={[styles.chatMessage, { color: colors.textSecondary }]} numberOfLines={1}>
                  {highlightSearchText(item.content ||
                    (item.type === 'group'
                      ? (item.is_creator ? 'You created this group' : 'No messages yet')
                      : '[No message]'),
                  searchQuery)}
                </Text>
              </View>
              <View style={styles.timeBadgeContainer}>
                <Text style={[styles.chatTime, { color: colors.textTertiary }]}>{item.time || ''}</Text>
                {actualUnread > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>
                      {actualUnread > 9 ? '9+' : actualUnread}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          isLoading ? (
            <Text style={[styles.emptyText, { marginTop: 80, textAlign: 'center', color: colors.textSecondary }]}>
              Loading chats...
            </Text>
          ) : error ? (
            <View style={styles.emptyList}>
              <Text style={[styles.emptyText, { color: 'red' }]}>{error}</Text>
              <TouchableOpacity onPress={fetchAllChats}>
                <Text style={[styles.emptyText, { color: colors.primary }]}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyList}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? 'No matching chats found' : `No ${chatModeFilter === 'all' ? '' : chatModeFilter} chats available`}
              </Text>
              {!searchQuery && (
                <TouchableOpacity 
                  onPress={() => {
                    navigation.navigate(
                      chatModeFilter === 'business' || chatModeFilter === 'all' 
                        ? 'UserContactList' 
                        : 'UserContactListPersonalAccount'
                    );
                  }}
                >
                  <Text style={[styles.emptyText, { color: colors.primary, marginTop: 10, fontFamily: 'SourceSansPro-Medium' }]}>
                    Start a new {chatModeFilter === 'all' ? '' : chatModeFilter} chat
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )
        )}
        contentContainerStyle={{ 
          paddingBottom: insets.bottom + 120,
        }}
      />
      
      <BottomNav 
        navigation={navigation} 
        setShowAccountModal={setShowAccountModal}
        activeRoute="Home" 
        style={{ zIndex: 9999 }}
      />
      
      <Modal
        visible={showMediaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMediaModal(false)}>
        <View style={[styles.mediaModalContainer, { backgroundColor: colors.overlay }]}>
          <View style={[styles.mediaPreviewContainer, { backgroundColor: colors.background }]}>
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
              style={[styles.captionInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBackground }]}
              placeholder="Add caption to your status (optional)"
              value={caption}
              placeholderTextColor={colors.placeholder}
              onChangeText={setCaption}
              multiline
            />
            <View style={styles.mediaActionButtons}>
              <TouchableOpacity
                style={[styles.mediaButton, styles.cancelButton, { backgroundColor: colors.buttonSecondary }]}
                onPress={() => {
                  setMedia(null);
                  setCaption('');
                  setShowMediaModal(false);
                }}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.mediaButton, styles.postButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  handlePostStatus(media, caption);
                  setShowMediaModal(false);
                }}>
                <Text style={[styles.buttonText, { color: colors.textInverse }]}>Post</Text>
              </TouchableOpacity>
            </View>
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
        style={[styles.fab2, { backgroundColor: colors.buttonSecondary, borderColor: colors.border }]}
        onPress={() => {
          navigation.navigate(
            chatModeFilter === 'business' || chatModeFilter === 'all' 
              ? 'UserContactList' 
              : 'UserContactListPersonalAccount'
          );
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
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Advertise</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowDropdown(false);
                navigation.navigate('CreateChannel');
              }}>
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Create Channel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowDropdown(false);
                navigation.navigate('Broadcast');
              }}>
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Official Broadcast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('GroupConnect');
                }}
              >
                <Text style={[styles.dropdownItem, { color: colors.text }]}>New Group</Text>
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
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Go Live</Text>
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
                  navigation.navigate('SupplierNotificationScreen');
                }}
              >
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Deals</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('Explore');
                }}
              >
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Business Tools</Text>
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
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Catalog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('MarketPlace');
                }}
              >
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Market Place</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  navigation.navigate('BSettings');
                }}
              >
                <Text style={[styles.dropdownItem, { color: colors.text }]}>Settings</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <EarningsSlideInManager />
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
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 1000,
    borderWidth: 1,
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
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 1000,
  },
  header: {
    paddingBottom: 10,
    borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
    backgroundColor: colors.primary,
    elevation: 2,
    zIndex: 1000,
  },
  headerTop: {
    marginTop: Platform.OS === 'android' ? 10 : 10,
    paddingHorizontal: 20,
    height: Platform.OS === 'android' ? 90 : 130,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBadgeContainer: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  badge: {
    borderRadius: 50,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
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
    fontWeight: 'bold',
    letterSpacing: 0.7,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'SourceSansPro-Bold',
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
  searchSection: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  searchBox: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 44,
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
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular',
    paddingRight: 8,
    height: 44,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    gap: 8,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: colors.buttonSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  modeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  modeChipTextActive: {
    color: '#fff',
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
  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
    textTransform: 'capitalize',
    color: colors.text,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  groupBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  sourceBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.card,
  },
  sourceBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
  },
  chatMessage: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  chatTime: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
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
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 0.6,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 6,
    borderWidth: 0.2,
    borderColor: colors.border,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  mediaPreviewContainer: {
    width: '90%',
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
  cancelButton: {},
  postButton: {},
  buttonText: {
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
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default BusinessHomeScreen;