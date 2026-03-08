


// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   Image,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Linking,
//   StatusBar,
//   ImageBackground,
//   ActivityIndicator,
//   BackHandler,
//   Dimensions,
//   LogBox,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icoon from "react-native-vector-icons/MaterialCommunityIcons";
// import { useFocusEffect } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import EmojiSelector from 'react-native-emoji-selector';
// import { ScrollView, Swipeable } from 'react-native-gesture-handler';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const axiosInstance = axios.create({
//   baseURL: `${API_ROUTE}`,
//   timeout: 10000,
// });

// const options = [
//   { id: '1', icon: 'camera-alt', label: 'Camera', color: '#0d64dd', lightColor: '#E8F5E9' },
//   { id: '2', icon: 'photo', label: 'Gallery', color: '#0d64dd', lightColor: '#E8F5E9' },
//   { id: '3', icon: 'insert-drive-file', label: 'Document', color: '#0d64dd', lightColor: '#E8F5E9' },
//   { id: '4', icon: 'emoji-emotions', label: 'Emoji', color: '#0d64dd', lightColor: '#E8F5E9' },
// ];

// export default function PersonalPrivateChatScreen({ route, navigation }) {
//   const { chatType, receiverId, groupSlug, name, profile_image } = route.params;

//   const [messages, setMessages] = useState([]);
//   const [pendingMessages, setPendingMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [imagePreviewModalVisible, setImagePreviewModalVisible] = useState(false);
//   const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
//   const [username, setUsername] = useState('');
//   const [userId, setUserId] = useState(null);
//   const [userProfileImage, setUserProfileImage] = useState(null);
//   const [userPopup, setUserPopup] = useState(null);
//   const [moreMenuVisible, setMoreMenuVisible] = useState(false);
//   const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedEmoji, setSelectedEmoji] = useState(null);
//   const [replyToMessage, setReplyToMessage] = useState(null);
//   const [reconnectAttempts, setReconnectAttempts] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [accountMode, setAccountMode] = useState('personal');
//   const [filePreviewModalVisible, setFilePreviewModalVisible] = useState(false);
//   const [fileCaption, setFileCaption] = useState('');

//   LogBox.ignoreLogs([
//     'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
//   ]);

//   const [chatBackground, setChatBackground] = useState(null);
//   const getWallpaperSource = (chatBackground) => {
//       if (!chatBackground) {
//         return require('../assets/images/backroundsplash.png');
//       }
      
//       if (chatBackground.source === 'gallery' && chatBackground.value) {
//         return { uri: chatBackground.value };
//       } 
//       else if (chatBackground.source === 'default' && chatBackground.uri) {
//         return { uri: chatBackground.uri };
//       } 
//       else if (chatBackground.source === 'default' && chatBackground.index !== undefined) {
//         const defaultWallpapers = [
//           require('../assets/images/backroundsplash.png'),
//           require('../assets/wallpaper/spring-5016266_1280.jpg'),
//           require('../assets/wallpaper/8a91c94c-a725-41fc-b65a-69237c6b12f2.png'),
//           require('../assets/wallpaper/whitebkpattern.jpg'),
//           require('../assets/wallpaper/ggg.jpg'),
//           require('../assets/wallpaper/3013e3495a1ce2ddc938f75fb3c50c86.jpg'),
//           require('../assets/wallpaper/8379d5e75849275387025f8745f7701a.png'),
//           require('../assets/wallpaper/76406.jpg'),
//           require('../assets/wallpaper/b91dc2113881469c07ac99ad9a024a01.jpg'),
//           require('../assets/wallpaper/fon-dlya-vatsap-3.jpg'),
//           require('../assets/wallpaper/whatsapp_bg_chat_img.jpeg'),
//         ];
      
//         const index = chatBackground.index;
//         if (index >= 0 && index < defaultWallpapers.length) {
//           return defaultWallpapers[index];
//         }
//       }
      
//       // Fallback to default wallpaper image =========
//       return require('../assets/images/backroundsplash.png');
//     };
    
//     useEffect(() => {
//       const loadBackground = async () => {
//         try {
//           const background = await AsyncStorage.getItem('chatBackground');
//           console.log('Loaded wallpaper data:', background);
          
//           if (background) {
//             const parsed = JSON.parse(background);
//             console.log('Parsed wallpaper data:', parsed);
//             setChatBackground(parsed);
//           } else {
//             console.log('No wallpaper saved, using default');
//           }
//         } catch (error) {
//           console.error('Error loading chat background:', error);
//         }
//       };
      
//       loadBackground();
//     }, []);

//   useEffect(() => {
//     const backAction = () => {
//       navigation.navigate('PHome');
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction
//     );

//     return () => backHandler.remove();
//   }, [navigation]);

//   const flatListRef = useRef();
//   const ws = useRef(null);
//   const timeoutRef = useRef(null);
//   const maxReconnectAttempts = 5;

//   useEffect(() => {
//     const loadMode = async () => {
//       try {
//         const mode = 'personal';
//         setAccountMode(mode);
//       } catch (error) {
//         setAccountMode('personal');
//       }
//     };

//     loadMode();
//   }, []);

//   const [contextMenu, setContextMenu] = useState({
//     visible: false,
//     message: null,
//     position: { x: 0, y: 0 },
//   });

//   const deleteMessage = async (messageId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         alert('Please log in to perform this action');
//         navigation.navigate('Login');
//         return;
//       }

//       const response = await axiosInstance.post(
//         `/delete-chat/${messageId}/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       setMessages(prev => prev.map(msg => 
//         msg.id === messageId.toString() ? { ...msg, is_deleted: true } : msg
//       ));
//       setPendingMessages(prev => prev.map(msg => 
//         msg.id === messageId.toString() ? { ...msg, is_deleted: true } : msg
//       ));

//     } catch (error) {
//       if (error.response?.status === 401) {
//         alert('Session expired. Please log in again.');
//         navigation.navigate('Login');
//       } else {
//         alert(error.response?.data?.error || 'Failed to delete message');
//       }
//     }
//   };

//   const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

//   const saveMessagesToStorage = async (messagesToSave) => {
//     try {
//       const limitedMessages = messagesToSave.slice(0, 100);
//       const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
//       await AsyncStorage.setItem(storageKey, JSON.stringify(limitedMessages));
//       await AsyncStorage.setItem(`${storageKey}_timestamp`, Date.now().toString());
//     } catch (error) {
//       console.error('Error saving messages to AsyncStorage:', error);
//     }
//   };

//   const loadMessagesFromStorage = async () => {
//     try {
//       const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
//       const storedTimestamp = await AsyncStorage.getItem(`${storageKey}_timestamp`);
//       if (storedTimestamp) {
//         const age = Date.now() - parseInt(storedTimestamp);
//         if (age > 24 * 60 * 60 * 1000) { // 1 day expiration
//           await AsyncStorage.removeItem(storageKey);
//           await AsyncStorage.removeItem(`${storageKey}_timestamp`);
//           return;
//         }
//       }
//       const storedMessages = await AsyncStorage.getItem(storageKey);
//       if (storedMessages) {
//         const parsedMessages = JSON.parse(storedMessages);
//         setMessages(parsedMessages);
//       }
//     } catch (error) {
//       console.error('Error loading messages from AsyncStorage:', error);
//     }
//   };

//   const redirectBack = () => {
//     navigation.navigate('PHome');
//   };

//   const fetchUserData = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;

//       if (!token || !parsed?.id) {
//         alert('Please log in again.');
//         navigation.navigate('Login');
//         return null;
//       }

//       setUserId(parsed.id);
//       const response = await axiosInstance.get(`/user/${parsed.id}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setUsername(response.data.name);
//         const baseURL = `${API_ROUTE_IMAGE}`;
//         const profilePicture = response.data.profile_picture
//           ? `${baseURL}${response.data.profile_picture}`
//           : null;
//         setUserProfileImage(profilePicture);
//         return parsed.id;
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         navigation.navigate('Login');
//       }
//       setUserProfileImage(null);
//       return null;
//     }
//   }, [navigation]);

//   const API = axios.create({
//     baseURL: `${API_ROUTE}`,
//   });

//   API.interceptors.request.use(async (config) => {
//     const accessToken = await AsyncStorage.getItem('userToken');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   });

//   API.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;

//       if (error.response?.data?.code === 'token_not_valid' && !originalRequest._retry) {
//         originalRequest._retry = true;

//         const refreshToken = await AsyncStorage.getItem('refreshToken');

//         if (!refreshToken) {
//           await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
//           navigation.navigate('Login');
//           return Promise.reject(error);
//         }

//         try {
//           const { data } = await axios.post(`${API_ROUTE}auth/token/refresh/`, {
//             refresh: refreshToken,
//           });

//           const newAccessToken = data.access;
//           await AsyncStorage.setItem('userToken', newAccessToken);
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//           return API(originalRequest);
//         } catch (refreshError) {
//           await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
//           navigation.navigate('Login');
//           return Promise.reject(refreshError);
//         }
//       }

//       return Promise.reject(error);
//     }
//   );

//   const fetchChatHistory = useCallback(async (chatType, receiverId, groupSlug, userId) => {
//     if (!userId) {
//       return;
//     }

//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       navigation.navigate('Login');
//       return;
//     }

//     try {
//       let url = `/api/chat/?chat_type=${chatType}&account_mode=${accountMode}`;
//       if (chatType === 'single' && receiverId) {
//         url += `&receiver=${receiverId}`;
//       } else if (chatType === 'group' && groupSlug) {
//         url += `&group_slug=${groupSlug}`;
//       } else {
//         navigation.navigate('PHome');
//         return;
//       }

//       const response = await axiosInstance.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const history = response.data.results.map((msg) => ({
//         id: msg.id.toString(),
//         user: msg.user_name || msg.name || 'Unknown',
//         user_id: msg.user_id || msg.user,
//         content: msg.content || '',
//         image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
//         file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
//         audio: msg.audio ? `${API_ROUTE_IMAGE}${msg.audio}` : null,
//         emoji: msg.emoji || null,
//         reply_to: msg.reply_to ? msg.reply_to.toString() : null,
//         is_deleted: msg.is_deleted || false,
//         timestamp: msg.timestamp,
//         time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
//       }));

//       const uniqueMessages = [];
//       const messageIds = new Set();
//       history.forEach((msg) => {
//         if (!messageIds.has(msg.id)) {
//           messageIds.add(msg.id);
//           uniqueMessages.push(msg);
//         }
//       });

//       setMessages(uniqueMessages);
//       saveMessagesToStorage(uniqueMessages);

//     } catch (error) {
//       console.error('Error fetching chat history:', error.response?.data || error.message);
//     }
//   }, [navigation, accountMode]);

//   useFocusEffect(
//     useCallback(() => {
//       let isMounted = true;
//       setIsLoading(true);

//       const loadData = async () => {
//         try {
//           const id = await fetchUserData();
//           if (id && isMounted) {
//             await loadMessagesFromStorage();
//             await fetchChatHistory(chatType, receiverId, groupSlug, id);
//           }
//         } catch (error) {
//           console.error('Error in focus effect:', error);
//         } finally {
//           if (isMounted) setIsLoading(false);
//         }
//       };

//       loadData();

//       return () => {
//         isMounted = false;
//         clearTimeout(timeoutRef.current);
//       };
//     }, [fetchUserData, fetchChatHistory, chatType, receiverId, groupSlug, accountMode])
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (userId) {
//         fetchChatHistory(chatType, receiverId, groupSlug, userId);
//       }
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [userId, chatType, receiverId, groupSlug, fetchChatHistory]);

//   useEffect(() => {
//     const connectWebSocket = async () => {
//       if (!accountMode) {
//         return;
//       }

//       if (reconnectAttempts >= maxReconnectAttempts) {
//         return;
//       }

//       const token = await AsyncStorage.getItem('userToken');
//       if (!token || !userId) {
//         navigation.navigate('LoginScreen');
//         return;
//       }

//       const encodedToken = encodeURIComponent(token);
//       let wsUrl;
//       if (chatType === 'single') {
//         wsUrl = `wss://showa.essential.com.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`;
//       } else {
//         wsUrl = `wss://showa.essential.com.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;
//       }

//       ws.current = new WebSocket(wsUrl);
//       ws.current.onopen = () => {
//         setIsWebSocketOpen(true);
//         setReconnectAttempts(0);
//       };

//       ws.current.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           if (data.message) {
//             const newMessage = {
//               id: data.message.id.toString(),
//               user: data.message.user_name || username,
//               user_id: data.message.user_id || userId,
//               content: data.message.content || '',
//               image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
//               file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
//               audio: data.message.audio ? `${API_ROUTE_IMAGE}${data.message.audio}` : null,
//               emoji: data.message.emoji || null,
//               reply_to: data.message.reply_to ? data.message.reply_to.toString() : null,
//               is_deleted: data.message.is_deleted || false,
//               timestamp: data.message.timestamp,
//               time: new Date(data.message.timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               }),
//               avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
//             };

//             setMessages((prev) => {
//               if (prev.some((msg) => msg.id === newMessage.id)) {
//                 return prev;
//               }

//               setPendingMessages((pending) => {
//                 const filtered = pending.filter((msg) => {
//                   const isSameContent = msg.content && msg.content === newMessage.content;
//                   const isSameImage = msg.image && newMessage.image && msg.image.includes(newMessage.image?.split('/').pop());
//                   const isSameFile = msg.file && newMessage.file && msg.file.includes(newMessage.file?.split('/').pop());
//                   const isSameAudio = msg.audio && newMessage.audio && msg.audio.includes(newMessage.audio?.split('/').pop());
//                   const isSameEmoji = msg.emoji && msg.emoji === newMessage.emoji;
//                   return !(isSameContent || isSameImage || isSameFile || isSameAudio || isSameEmoji);
//                 });
//                 return filtered;
//               });

//               const updatedMessages = [newMessage, ...prev];
//               saveMessagesToStorage(updatedMessages);
//               setTimeout(() => {
//                 flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//               }, 50);
//               return updatedMessages;
//             });
//           }
//         } catch (e) {
//           console.error('Error parsing WebSocket message:', e);
//         }
//       };

//       ws.current.onerror = (error) => {
//         setIsWebSocketOpen(false);
//       };

//       ws.current.onclose = () => {
//         setIsWebSocketOpen(false);
//         setReconnectAttempts((prev) => prev + 1);
//         setTimeout(connectWebSocket, 3000 * (reconnectAttempts + 1));
//       };
//     };

//     if (userId && accountMode) {
//       connectWebSocket();
//     }

//     return () => {
//       if (ws.current) {
//         ws.current.close();
//         ws.current = null;
//       }
//       clearTimeout(timeoutRef.current);
//     };
//   }, [userId, chatType, receiverId, groupSlug, reconnectAttempts, username, userProfileImage, navigation, accountMode]);

//   const checkCameraPermission = async () => {
//     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
//     const result = await check(permission);
//     if (result === RESULTS.GRANTED) return true;
//     const requestResult = await request(permission);
//     return requestResult === RESULTS.GRANTED;
//   };

//   const checkPhotoPermission = async () => {
//     if (Platform.OS === 'ios') {
//       const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
//       const result = await check(permission);
//       if (result === RESULTS.GRANTED) return true;
//       const requestResult = await request(permission);
//       return requestResult === RESULTS.GRANTED;
//     }
//     return true; // Android doesn't need permission for basic image picker
//   };

//   // Optimized image picker - faster and lighter
//   const pickImage = async (useCamera = false) => {
//   setModalVisible(false);
  
//   const options = {
//     mediaType: 'photo',
//     quality: 0.7,
//     includeBase64: false,
//     saveToPhotos: false,
//   };

//   try {
//     const result = useCamera 
//       ? await launchCamera(options)
//       : await launchImageLibrary(options);
    
//     if (result.didCancel) {
//       console.log('User cancelled');
//       return;
//     }
    
//     if (result.error) {
//       console.log('ImagePicker Error: ', result.error);
//       Alert.alert('Error', 'Failed to pick image');
//       return;
//     }
    
//     if (result.assets && result.assets[0]) {
//       setSelectedImage(result.assets[0]);
//       setImagePreviewModalVisible(true);
//     }
//   } catch (error) {
//     console.error('Error picking image:', error);
//     Alert.alert('Error', 'Failed to pick image');
//   }
// };

//   // Optimized document picker - using react-native-document-picker for both platforms
//   // const pickFile = async () => {
//   //   setModalVisible(false);
    
//   //   try {
//   //     const result = await DocumentPicker.pick({
//   //       type: [
//   //         DocumentPicker.types.pdf,
//   //         DocumentPicker.types.doc,
//   //         DocumentPicker.types.docx,
//   //         DocumentPicker.types.txt,
//   //         DocumentPicker.types.images,
//   //       ],
//   //       copyTo: 'cachesDirectory',
//   //     });

//   //     if (result && result[0]) {
//   //       setSelectedFile({
//   //         uri: result[0].uri,
//   //         type: result[0].type || 'application/octet-stream',
//   //         name: result[0].name,
//   //       });
//   //       setFileCaption('');
//   //       setFilePreviewModalVisible(true);
//   //     }
//   //   } catch (err) {
//   //     if (DocumentPicker.isCancel(err)) {
//   //       // User cancelled - no need to show error
//   //       console.log('Document picking cancelled');
//   //     } else {
//   //       console.log('Document picker error:', err);
//   //     }
//   //   }
//   // };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       const loadBackground = async () => {
//         try {
//           const background = await AsyncStorage.getItem('chatBackground');
//           if (background) {
//             setChatBackground(JSON.parse(background));
//           }
//         } catch (error) {
//           console.error('Error loading chat background:', error);
//         }
//       };
//       loadBackground();
//     });
//     return unsubscribe;
//   }, [navigation]);

//   const selectEmoji = (emoji) => {
//     setSelectedEmoji(emoji);
//     setEmojiPickerVisible(false);
//     sendMessage('');
//   };

//   const getBubbleStyle = (message, index, messages) => {
//     const isMyMessage = message.user_id === userId;
//     const prevMessage = messages[index - 1];
//     const isPrevSameSender = prevMessage && prevMessage.user_id === message.user_id;

//     let style = {
//       maxWidth: '75%',
//       paddingHorizontal: 12,
//       paddingVertical: 8,
//       borderRadius: 10,
//       marginVertical: isPrevSameSender ? 1 : 4,
//     };

//     if (isMyMessage) {
//       style.backgroundColor = '#0653bf';
//       style.marginLeft = 'auto';
//       style.marginRight= 8;
//       style.color = '#FFFFFF';
//       style.borderBottomRightRadius = 2;
//     } else {
//       style.backgroundColor = '#FFFFFF';
//       style.marginLeft = 8;
//       style.marginRight = 'auto';
//       style.borderBottomLeftRadius = 2;
//     }

//     if (message.reply_to) {
//       style.paddingTop = 16;
//     }

//     return style;
//   };

//   const handleMessageSelect = (message) => {
//     if (!message.is_deleted) {
//       setReplyToMessage(message);
//     }
//   };

//   const renderRightActions = (message) => (
//     <TouchableOpacity
//       style={styles.swipeReply}
//       onPress={() => handleMessageSelect(message)}
//     >
//       <Icon name="reply" size={24} color="#0d64dd" />
//     </TouchableOpacity>
//   );

//   const renderMessage = ({ item, index }) => {
//     if (!userId) {
//       return null;
//     }

//     const isMyMessage = item.user_id === userId;
//     const avatarSource = item.avatar ? { uri: item.avatar } : FALLBACK_AVATAR;

//     if (item.is_deleted) {
//       return (
//         <View
//           style={[
//             styles.messageContainer,
//             isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
//           ]}
//         >
//           <Text style={styles.deletedMessage}>This message was deleted</Text>
//         </View>
//       );
//     }

//     const repliedToMessage = item.reply_to
//       ? messages.find((msg) => msg.id === item.reply_to)
//       : null;

//     return (
//       <Swipeable 
//         renderLeftActions={() => renderRightActions(item)} 
//         overshootLeft={false}
//         rightThreshold={40}
//       >
//         <TouchableOpacity
//           onLongPress={(e) => {
//             if (item.user_id === userId && !item.is_deleted) {
//               setContextMenu({
//                 visible: true,
//                 message: item,
//                 position: { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY },
//               });
//             }
//           }}
//           activeOpacity={0.9}
//         >
//           <View
//             style={[
//               styles.messageContainer,
//               isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
//             ]}
//           >
//             {!isMyMessage && (
//               <TouchableOpacity
//                 onPress={() => setUserPopup({ username: item.user, avatar: item.avatar })}
//               >
//                 <Image
//                   source={
//                     chatType === 'single' && profile_image
//                       ? { uri: `${profile_image}` }
//                       : FALLBACK_AVATAR
//                   }
//                   style={styles.avatar}
//                 />
//               </TouchableOpacity>
//             )}
//             <View style={getBubbleStyle(item, index, messages)}>
//               {repliedToMessage && (
//                 <View style={styles.replyContainer}>
//                   <Text style={styles.replyUsername}>{name}</Text>
//                   <Text style={styles.replyContent} numberOfLines={1}>
//                     {repliedToMessage.content || (repliedToMessage.emoji ? repliedToMessage.emoji : 'Media')}
//                   </Text>
//                 </View>
//               )}
//               {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
//               {item.file && (
//                 <TouchableOpacity
//                   style={styles.fileContainer}
//                   onPress={() => Linking.openURL(item.file).catch(() => alert('Cannot open file'))}
//                 >
//                   <Icon name="insert-drive-file" size={20} color="#128C7E" />
//                   <Text style={styles.fileName} numberOfLines={1}>
//                     {item.file.split('/').pop()}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               {item.emoji && <Text style={styles.emojiMessage}>{item.emoji}</Text>}
//               {item.content && (
//                 <Text style={[styles.messageText, isMyMessage && { color: '#FFF' }]}>{item.content}</Text>
//               )}
//               <View style={styles.messageFooter}>
//                 <Text style={styles.timeText}>{item.time}</Text>
//                 {isMyMessage && (
//                   <Icon
//                     name={item.id.startsWith('m') ? 'access-time' : 'done-all'}
//                     size={12}
//                     color={item.id.startsWith('m') ? '#999' : '#0d64dd'}
//                     style={{ marginLeft: 4 }}
//                   />
//                 )}
//               </View>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Swipeable>
//     );
//   };

//   const logFormData = (formData) => {
//     const data = {};
//     formData._parts.forEach(([key, value]) => {
//       if (typeof value === 'object' && value.uri) {
//         data[key] = { uri: value.uri, type: value.type, name: value.name };
//       } else {
//         data[key] = value;
//       }
//     });
//     console.log('Sending FormData:', JSON.stringify(data, null, 2));
//   };

//   const sendMessage = async (caption = '') => {
//     if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji) {
//       return;
//     }

//     if (!accountMode) {
//       alert('Account mode not set. Please try again.');
//       return;
//     }

//     const formData = new FormData();
//     if (caption.trim()) formData.append('content', caption.trim());
//     if (selectedEmoji) formData.append('emoji', selectedEmoji);
//     if (replyToMessage) formData.append('reply_to', replyToMessage.id);
//     if (selectedImage) {
//       if (!selectedImage.uri || !selectedImage.type) {
//         alert('Invalid image selected');
//         return;
//       }
//       formData.append('image', {
//         uri: selectedImage.uri,
//         type: selectedImage.type,
//         name: selectedImage.fileName || 'image.jpg',
//       });
//     }
//     if (selectedFile) {
//       formData.append('content', fileCaption || '');
//       if (!selectedFile.uri || !selectedFile.type) {
//         alert('Invalid file selected');
//         return;
//       }
//       formData.append('file', {
//         uri: selectedFile.uri,
//         type: selectedFile.type,
//         name: selectedFile.name,
//       });
//     }
//     formData.append('chat_type', chatType);
//     formData.append('account_mode', accountMode);
//     if (chatType === 'single') {
//       formData.append('receiver', receiverId);
//     } else {
//       formData.append('group_slug', groupSlug);
//     }

//     const tempId = 'm' + Date.now();
//     if (selectedImage || selectedFile || selectedEmoji || caption.trim()) {
//       setPendingMessages((prev) => [
//         {
//           id: tempId,
//           user: username,
//           user_id: userId,
//           content: caption.trim() || null,
//           image: selectedImage ? selectedImage.uri : null,
//           file: selectedFile ? selectedFile.uri : null,
//           emoji: selectedEmoji || null,
//           reply_to: replyToMessage ? replyToMessage.id : null,
//           is_deleted: false,
//           timestamp: new Date().toISOString(),
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           avatar: userProfileImage || null,
//         },
//         ...prev,
//       ]);
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         throw new Error('No access token found. Please log in again.');
//       }

//       let success = false;
//       if (selectedImage || selectedFile || (!caption.trim() && !selectedEmoji)) {
//         logFormData(formData);
//         const response = await axiosInstance.post(`/api/chat/`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         success = true;
//       } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         const msg = {
//           action: 'send',
//           content: caption.trim() || null,
//           emoji: selectedEmoji || null,
//           reply_to: replyToMessage ? replyToMessage.id : null,
//           chat_type: chatType,
//           receiver_id: chatType === 'single' ? receiverId : null,
//           group_slug: chatType === 'group' ? groupSlug : null,
//           user_id: userId,
//           account_mode: accountMode,
//         };
//         ws.current.send(JSON.stringify(msg));
//         success = true;
//       } else {
//         logFormData(formData);
//         const response = await axiosInstance.post(`/api/chat/`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         success = true;
//       }

//       if (success) {
//         setText('');
//         setFileCaption('');
//         setSelectedImage(null);
//         setSelectedFile(null);
//         setSelectedEmoji(null);
//         setReplyToMessage(null);
//         setImagePreviewModalVisible(false);
//         flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//       }
//     } catch (error) {
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       let errorMessage = 'Failed to send message';
//       if (error.response) {
//         errorMessage += `: ${error.response.data?.detail || JSON.stringify(error.response.data)}`;
//         if (error.response.status === 401) {
//           navigation.navigate('Login');
//         }
//       } else if (error.message.includes('Network Error')) {
//         errorMessage += ': Check your network.';
//       }
//       alert(errorMessage);
//     }
//   };

//   const handleChatPrivate = (username) => {
//     setUserPopup(null);
//     alert(`Private chat with ${username} (not implemented)`);
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0d64dd" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{flex:1}}>
//       <StatusBar
//         barStyle={Platform.OS === 'android'? 'light-content':'dark-content'}
//         translucent={Platform.OS === 'android'}
//         backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
//       />
//       <ImageBackground
//         source={getWallpaperSource(chatBackground)}
//         style={styles.container}
//         resizeMode="cover"
//       >
//         <KeyboardAvoidingView
//           style={styles.container}
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//         >
//           <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
//             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding:15 }}>
//               <TouchableOpacity
//                 onPress={redirectBack}
//                 style={styles.headerButton}
//               >
//                 <Icon name="arrow-back" size={24} color="#FFF" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.headerProfile}
//                 onPress={() => navigation.navigate('OtherUserProfile', { userId: receiverId })}
//               >
//                 <Image
//                   source={
//                     chatType === 'single' && profile_image
//                       ? { uri: `${profile_image}` }
//                       : FALLBACK_AVATAR
//                   }
//                   style={styles.headerAvatar}
//                 />
//                 <Text style={styles.headerName}>{name.slice(0,16)+'...'}</Text>
//               </TouchableOpacity>
//               <View
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   alignContent: 'center',
//                   alignItems: 'center',
//                 }}
//               >
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate('VoiceCalls', {
//                       targetUserId: receiverId,
//                       name: name,
//                       profile_image: profile_image,
//                       roomId: 'unique-room-id',
//                       isInitiator: true
//                     })
//                   }
//                   style={styles.headerButton}
//                 >
//                   <Icon name="call" size={24} color="#FFF" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </LinearGradient>

//           <FlatList
//             ref={flatListRef}
//             data={[...pendingMessages, ...messages]}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id.toString()}
//             inverted
//             contentContainerStyle={styles.chatContent}
//             keyboardShouldPersistTaps="handled"
//             scrollEnabled={true}
//           />

//           {replyToMessage && (
//             <View style={styles.replyPreview}>
//               <View style={styles.replyPreviewContent}>
//                 <Text style={styles.replyPreviewUsername}>~ replying {name}</Text>
//                 <Text style={styles.replyPreviewText} numberOfLines={1}>
//                   {replyToMessage.content || (replyToMessage.emoji ? replyToMessage.emoji : 'Media')}
//                 </Text>
//               </View>
//               <TouchableOpacity onPress={() => setReplyToMessage(null)}>
//                 <Icon name="close" size={20} color="#999" />
//               </TouchableOpacity>
//             </View>
//           )}

//           <View style={styles.footer}>
//             <TouchableOpacity
//               onPress={() => setModalVisible(true)}
//               style={styles.attachButton}
//             >
//               <Icon name="attach-file" size={27} color="#0d64dd" />
//             </TouchableOpacity>
//             <TextInput
//               style={styles.input}
//               placeholder="Type a message..."
//               placeholderTextColor="#999"
//               value={text}
//               onChangeText={setText}
//               multiline
//               blurOnSubmit={false}
//               onFocus={() => {
//                 setTimeout(() => {
//                   flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
//                 }, 100);
//               }}
//             />
//             {text.trim().length > 0 ? (
//               <TouchableOpacity
//                 onPress={() => sendMessage(text)}
//                 style={styles.sendButton}
//               >
//                 <Icon name="send" size={24} color="#0d64dd" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity disabled style={styles.sendButton}>
//                 <Icon name="send" size={24} color="#ccc" />
//               </TouchableOpacity>
//             )}
//           </View>

//           <Modal
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}
//             animationType="fade"
//           >
//             <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//               <View style={styles.modalOverlay} />
//             </TouchableWithoutFeedback>
//             <View style={styles.modalContent}>
//               <FlatList
//                 data={options}
//                 keyExtractor={(item) => item.id}
//                 numColumns={2}
//                 contentContainerStyle={styles.modalOptions}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.optionButton}
//                     onPress={() => {
//                       if (item.label === 'Camera') pickImage(true);
//                       else if (item.label === 'Gallery') pickImage(false);
//                       else if (item.label === 'Document') pickFile();
//                       else if (item.label === 'Emoji') {
//                         setEmojiPickerVisible(true);
//                         setModalVisible(false);
//                       }
//                     }}
//                   >
//                     <View
//                       style={[styles.optionIconContainer, { backgroundColor: item.lightColor }]}
//                     >
//                       <Icon name={item.icon} size={24} color={item.color} />
//                     </View>
//                     <Text style={styles.optionLabel}>{item.label}</Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           </Modal>

//           {contextMenu.visible && (
//             <View style={[
//               styles.contextMenuContainer, 
//               {
//                 top: contextMenu.position.y - 50,
//                 left: Math.max(10, Math.min(contextMenu.position.x - 100, Dimensions.get('window').width - 220)),
//               }
//             ]}>
//               {contextMenu.message?.user_id === userId && !contextMenu.message?.is_deleted && (
//                 <>
//                   <TouchableOpacity 
//                     style={styles.contextMenuItem}
//                     onPress={() => {
//                       deleteMessage(contextMenu.message.id);
//                       setContextMenu({ visible: false, message: null });
//                     }}
//                     activeOpacity={0.6}
//                   >
//                     <View style={styles.contextMenuIcon}>
//                       <Icon name="delete" size={20} color="#ff4444" />
//                     </View>
//                     <Text style={[styles.contextMenuText, { color: '#ff4444' }]}>Delete</Text>
//                   </TouchableOpacity>
                  
//                   <View style={styles.contextMenuDivider} />
                  
//                   <TouchableOpacity 
//                     style={styles.contextMenuItem}
//                     onPress={() => setContextMenu({ visible: false, message: null })}
//                     activeOpacity={0.6}
//                   >
//                     <View style={styles.contextMenuIcon}>
//                       <Icon name="close" size={20} color="#666" />
//                     </View>
//                     <Text style={styles.contextMenuText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           )}

//           <Modal
//             transparent={true}
//             visible={imagePreviewModalVisible}
//             onRequestClose={() => setImagePreviewModalVisible(false)}
//             animationType="slide"
//           >
//             <KeyboardAvoidingView
//               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//               style={styles.imagePreviewModalOverlay}
//               keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <SafeAreaView style={{flex: 1}}>
//                   <View style={styles.imagePreviewModalContent}>
//                     <View style={styles.imagePreviewHeader}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           setImagePreviewModalVisible(false);
//                           setSelectedImage(null);
//                           setText('');
//                         }}
//                       >
//                         <Icon name="close" size={24} color="#FFF" />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         onPress={() => sendMessage(text)}
//                         style={styles.imagePreviewSendButton}
//                       >
//                         <Icon name="send" size={24} color="#0d64dd" />
//                       </TouchableOpacity>
//                     </View>
                    
//                     <ScrollView 
//                       contentContainerStyle={styles.imagePreviewScrollContent}
//                       keyboardShouldPersistTaps="handled"
//                     >
//                       {selectedImage && (
//                         <Image
//                           source={{ uri: selectedImage.uri }}
//                           style={styles.imagePreviewImage}
//                           resizeMode="contain"
//                         />
//                       )}
//                     </ScrollView>
                    
//                     <View style={styles.imagePreviewInputContainer}>
//                       <TextInput
//                         style={styles.imagePreviewInput}
//                         placeholder="Add a caption..."
//                         placeholderTextColor="#999"
//                         value={text}
//                         onChangeText={setText}
//                         multiline
//                         blurOnSubmit={false}
//                       />
//                     </View>
//                   </View>
//                 </SafeAreaView>
//               </TouchableWithoutFeedback>
//             </KeyboardAvoidingView>
//           </Modal>

//           <Modal
//             transparent={true}
//             visible={emojiPickerVisible}
//             onRequestClose={() => setEmojiPickerVisible(false)}
//             animationType="slide"
//           >
//             <TouchableWithoutFeedback onPress={() => setEmojiPickerVisible(false)}>
//               <View style={styles.modalOverlay}>
//                 <View style={styles.emojiPickerContainer}>
//                   <EmojiSelector onEmojiSelected={selectEmoji} />
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           </Modal>

//           <Modal
//             transparent={true}
//             visible={!!userPopup}
//             onRequestClose={() => setUserPopup(null)}
//             animationType="fade"
//           >
//             <TouchableWithoutFeedback onPress={() => setUserPopup(null)}>
//               <View
//                 style={{
//                   flex: 1,
//                   backgroundColor: "rgba(0,0,0,0.6)",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   padding: 20,
//                 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: "#fff",
//                     borderRadius: 20,
//                     padding: 20,
//                     width: "90%",
//                     alignItems: "center",
//                     elevation: 5,
//                   }}
//                 >
//                   <Image
//                     source={
//                       userPopup?.avatar
//                         ? { uri: userPopup.avatar }
//                         : FALLBACK_AVATAR
//                     }
//                     style={{
//                       width: 100,
//                       height: 100,
//                       borderRadius: 50,
//                       marginBottom: 15,
//                     }}
//                   />

//                   <Text
//                     style={{
//                       fontSize: 20,
//                       fontWeight: "600",
//                       color: "#111",
//                     }}
//                   >
//                     {userPopup?.username || "Unknown"}
//                   </Text>

//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-around",
//                       width: "100%",
//                       marginVertical: 15,
//                     }}
//                   >
//                     <TouchableOpacity
//                       onPress={() => setUserPopup(null)}
//                       style={{ alignItems: "center", borderColor: 'grey', borderWidth: 1, padding: 10, borderRadius: 10, width: 80, height: 80 }}
//                     >
//                       <Icon name="chat" size={28} color="#25D366" />
//                       <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
//                         Chat
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('VoiceCalls', {
//                           targetUserId: receiverId,
//                           name: name,
//                           profile_image: profile_image,
//                           roomId: 'unique-room-id',
//                           isInitiator: true
//                         })
//                       }
//                       style={{ alignItems: "center", borderColor: 'grey', borderWidth: 1, padding: 10, borderRadius: 10, width: 80, height: 80 }}
//                     >
//                       <Icon name="phone" size={28} color="#34B7F1" />
//                       <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
//                         Call
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('VideoCalls', {
//                           targetUserId: receiverId,
//                           name: name,
//                           profile_image: profile_image,
//                           roomId: 'unique-room-id',
//                           isInitiator: true
//                         })
//                       }
//                       style={{ alignItems: "center", borderColor: 'grey', borderWidth: 1, padding: 10, borderRadius: 10, width: 80, height: 80 }}
//                     >
//                       <Icoon name="video" size={28} color="#FF6D00" />
//                       <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
//                         Video
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   <TouchableOpacity
//                     style={{
//                       marginTop: 10,
//                       paddingVertical: 10,
//                       paddingHorizontal: 20,
//                       borderRadius: 8,
//                       backgroundColor: "#eee",
//                     }}
//                     onPress={() => setUserPopup(null)}
//                   >
//                     <Text style={{ color: "#333", fontSize: 16 }}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           </Modal>

//           <Modal
//             transparent={true}
//             visible={filePreviewModalVisible}
//             onRequestClose={() => setFilePreviewModalVisible(false)}
//             animationType="slide"
//           >
//             <View style={styles.filePreviewModalOverlay}>
//               <View style={styles.filePreviewModalContent}>
//                 <View style={styles.filePreviewHeader}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setFilePreviewModalVisible(false);
//                       setSelectedFile(null);
//                     }}
//                   >
//                     <Icon name="close" size={24} color="#FFF" />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       sendMessage(fileCaption);
//                       setFilePreviewModalVisible(false);
//                     }}
//                     style={styles.filePreviewSendButton}
//                   >
//                     <Icon name="send" size={24} color="#0d64dd" />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={styles.filePreview}>
//                   <Icon name="insert-drive-file" size={60} color="#0d64dd" />
//                   <Text style={styles.fileName} numberOfLines={1}>
//                     {selectedFile?.name}
//                   </Text>
//                 </View>
//                 <TextInput
//                   style={styles.filePreviewInput}
//                   placeholder="Add a caption..."
//                   placeholderTextColor="#999"
//                   value={fileCaption}
//                   onChangeText={setFileCaption}
//                   multiline
//                 />
//               </View>
//             </View>
//           </Modal>
//         </KeyboardAvoidingView>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     paddingBottom: Platform.OS === 'android' ? 16 : 0,
//     paddingTop: Platform.OS === 'android' ? 5 : 0,
//     borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
//     backgroundColor: '#0d64dd',
//     elevation: 6,
//     zIndex: 1000,
//   },
//   headerButton: {
//     padding: 8,
//   },
//   headerProfile: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   headerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   headerName: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 12,
//     textTransform: 'capitalize',
//   },
//   chatContent: {
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     marginVertical: 2,
//     marginHorizontal: 8,
//     alignItems: 'flex-end',
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 4,
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 2,
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
//   deletedMessage: {
//     fontSize: 14,
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   messageImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 4,
//   },
//   filePreviewModalOverlay: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   filePreviewModalContent: {
//     flex: 1,
//     padding: 16,
//   },
//   filePreviewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   filePreviewSendButton: {
//     padding: 8,
//   },
//   filePreview: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 20,
//   },
//   filePreviewInput: {
//     backgroundColor: '#333',
//     borderRadius: 12,
//     padding: 12,
//     color: '#FFF',
//     fontSize: 16,
//   },
//   fileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 4,
//   },
//   fileName: {
//     fontSize: 14,
//     color: '#128C7E',
//     marginLeft: 8,
//     flex: 1,
//   },
//   emojiMessage: {
//     fontSize: 28,
//     marginBottom: 4,
//   },
//   replyContainer: {
//     borderLeftWidth: 3,
//     borderLeftColor: '#0d64dd',
//     paddingLeft: 8,
//     marginBottom: 8,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 4,
//     padding:5
//   },
//   replyUsername: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#128C7E',
//   },
//   replyContent: {
//     fontSize: 12,
//     color: '#666',
//   },
//   swipeReply: {
//     backgroundColor: '#E8ECEF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 60,
//     marginRight: 8,
//   },
//   replyPreview: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     padding: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#DDD',
//     alignItems: 'center',
//   },
//   replyPreviewContent: {
//     flex: 1,
//   },
//   replyPreviewUsername: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#091ec0ff',
//   },
//   replyPreviewText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   footer: {
//     flexDirection: 'row',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     backgroundColor: '#F0F0F0',
//     alignItems: 'flex-end',
//     borderTopWidth: 1,
//     borderTopColor: '#DDD',
//   },
//   attachButton: {
//     padding: 8,
//     alignSelf: 'center',
//   },
//   input: {
//     flex: 1,
//     maxHeight: 120,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === 'android' ? 16 : 16,
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     fontSize: 16,
//     color: '#000',
//     marginHorizontal: 4,
//   },
//   sendButton: {
//     padding: 8,
//     alignSelf: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   modalOptions: {
//     paddingBottom: 16,
//   },
//   optionButton: {
//     flex: 1,
//     margin: 8,
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   loadingContainer:{
//     flex:1,
//     justifyContent:'center',
//     alignSelf:'center',
//     alignItems:'center'
//   },
//   optionIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   optionLabel: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#128C7E',
//     fontWeight: '500',
//   },
//   imagePreviewModalOverlay: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   imagePreviewModalContent: {
//     flex: 1,
//   },
//   imagePreviewScrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   imagePreviewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#000',
//   },
//   imagePreviewImage: {
//     width: '100%',
//     height: 400,
//     marginVertical: 20,
//   },
//   imagePreviewInputContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#000',
//     borderTopWidth: 1,
//     borderTopColor: '#333',
//   },
//   imagePreviewInput: {
//     backgroundColor: '#333',
//     borderRadius: 12,
//     padding: 12,
//     color: '#FFF',
//     fontSize: 16,
//     minHeight: 50,
//     textAlignVertical: 'top',
//   },
//   imagePreviewSendButton: {
//     padding: 8,
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   contextMenuContainer: {
//     position: 'absolute',
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     paddingVertical: 8,
//     width: 200,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 5,
//     zIndex: 1000,
//   },
//   contextMenuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//   },
//   contextMenuIcon: {
//     width: 24,
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   contextMenuText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   contextMenuDivider: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 4,
//   },
//   emojiPickerContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     padding: 16,
//     maxHeight: '50%',
//   },
// });


import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  ImageBackground,
  ActivityIndicator,
  BackHandler,
  StatusBar,
  Dimensions,
  LogBox,
  Alert,
  PermissionsAndroid
} from 'react-native';
import Icoon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick, keepLocalCopy } from '@react-native-documents/picker';
import EmojiSelector from 'react-native-emoji-selector';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';

const axiosInstance = axios.create({
  baseURL: 'https://showa.essential.com.ng/api/showa',
  timeout: 30000,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const options = [
  { id: '1', icon: 'camera-alt', label: 'Camera', color: '#0d64dd' },
  { id: '2', icon: 'photo', label: 'Gallery', color: '#0d64dd' },
  { id: '3', icon: 'insert-drive-file', label: 'Document', color: '#0d64dd' },
  { id: '4', icon: 'emoji-emotions', label: 'Emoji', color: '#0d64dd' },
];

export default function PersonalPrivateChatScreen({ route, navigation }) {
  const { chatType, receiverId, groupSlug, name, profile_image } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreviewModalVisible, setImagePreviewModalVisible] = useState(false);
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [userPopup, setUserPopup] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [accountMode, setAccountMode] = useState('personal');
  const [filePreviewModalVisible, setFilePreviewModalVisible] = useState(false);
  const [fileCaption, setFileCaption] = useState('');
  const [chatBackground, setChatBackground] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const isPickingRef = useRef(false);

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  ]);

  const flatListRef = useRef();
  const ws = useRef(null);
  const timeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  const getWallpaperSource = (chatBackground) => {
    if (!chatBackground) {
      return require('../assets/images/backroundsplash.png');
    }
    
    if (chatBackground.source === 'gallery' && chatBackground.value) {
      return { uri: chatBackground.value };
    } 
    else if (chatBackground.source === 'default' && chatBackground.uri) {
      return { uri: chatBackground.uri };
    } 
    else if (chatBackground.source === 'default' && chatBackground.index !== undefined) {
      const defaultWallpapers = [
        require('../assets/images/backroundsplash.png'),
        require('../assets/wallpaper/spring-5016266_1280.jpg'),
        require('../assets/wallpaper/8a91c94c-a725-41fc-b65a-69237c6b12f2.png'),
        require('../assets/wallpaper/whitebkpattern.jpg'),
        require('../assets/wallpaper/ggg.jpg'),
        require('../assets/wallpaper/3013e3495a1ce2ddc938f75fb3c50c86.jpg'),
        require('../assets/wallpaper/8379d5e75849275387025f8745f7701a.png'),
        require('../assets/wallpaper/76406.jpg'),
        require('../assets/wallpaper/b91dc2113881469c07ac99ad9a024a01.jpg'),
        require('../assets/wallpaper/fon-dlya-vatsap-3.jpg'),
        require('../assets/wallpaper/whatsapp_bg_chat_img.jpeg'),
      ];
      
      const index = chatBackground.index;
      if (index >= 0 && index < defaultWallpapers.length) {
        return defaultWallpapers[index];
      }
    }
    
    return require('../assets/images/backroundsplash.png');
  };

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const background = await AsyncStorage.getItem('chatBackground');
        if (background) {
          const parsed = JSON.parse(background);
          setChatBackground(parsed);
        }
      } catch (error) {
        console.error('Error loading chat background:', error);
      }
    };
    loadBackground();
  }, []);

  // Alternative approach - check what the package exports
useEffect(() => {
  // Log what the package exports
  import('@react-native-documents/picker').then(module => {
    console.log('📦 Package exports:', Object.keys(module));
  }).catch(err => {
    console.log('📦 Error loading package:', err);
  });
}, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const loadMode = async () => {
      try {
        setAccountMode('personal');
      } catch (error) {
        setAccountMode('personal');
      }
    };
    loadMode();
  }, []);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    message: null,
    position: { x: 0, y: 0 },
  });

  const deleteMessage = async (messageId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Please log in to perform this action');
        return;
      }
      
      const response = await axiosInstance.post(
        `/delete-chat/${messageId}/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      setMessages(prev => prev.map(msg =>
        msg.id === messageId.toString() ? {...msg, is_deleted: true} : msg
      ));
      setPendingMessages(prev => prev.map(msg =>
        msg.id === messageId.toString() ? {...msg, is_deleted: true} : msg
      ));
    } catch (error) {
      //Alert.alert('Failed to delete message');
    }
  };

  const saveMessagesToStorage = async (messagesToSave) => {
    try {
      const limitedMessages = messagesToSave.slice(0, 100);
      const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(limitedMessages));
    } catch (error) {
      // Silent fail
    }
  };

  const loadMessagesFromStorage = async () => {
    try {
      const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
      const storedMessages = await AsyncStorage.getItem(storageKey);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const redirectBack = () => {
    navigation.navigate('PHome');
  };

  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;
      
      if (!token || !parsed?.id) {
        Alert.alert('Please log in again.');
        return null;
      }
      
      setUserId(parsed.id);
      const response = await axiosInstance.get(`/user/${parsed.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        setUsername(response.data.name);
        const baseURL = `${API_ROUTE_IMAGE}`;
        const profilePicture = response.data.profile_picture
          ? `${baseURL}${response.data.profile_picture}`
          : null;
        setUserProfileImage(profilePicture);
        return parsed.id;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // navigation.navigate('Login');
      }
      setUserProfileImage(null);
      return null;
    }
  }, []);

  const API = axios.create({
    baseURL: `${API_ROUTE}`,
  });

  API.interceptors.request.use(async (config) => {
    const accessToken = await AsyncStorage.getItem('userToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  const fetchChatHistory = useCallback(async (chatType, receiverId, groupSlug, userId) => {
    if (!userId) return;
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    
    try {
      let url = `/api/chat/?chat_type=${chatType}&account_mode=${accountMode}`;
      if (chatType === 'single' && receiverId) {
        url += `&receiver=${receiverId}`;
      } else if (chatType === 'group' && groupSlug) {
        url += `&group_slug=${groupSlug}`;
      } else {
        navigation.navigate('PHome');
        return;
      }
      
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const history = response.data.results.map((msg) => ({
        id: msg.id.toString(),
        user: msg.user_name || msg.name || 'Unknown',
        user_id: msg.user_id || msg.user,
        content: msg.content || '',
        image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
        file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
        file_name: msg.file_name || (msg.file ? msg.file.split('/').pop() : null),
        file_size: msg.file_size || null,
        emoji: msg.emoji || null,
        reply_to: msg.reply_to ? msg.reply_to.toString() : null,
        is_deleted: msg.is_deleted || false,
        timestamp: msg.timestamp,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
      }));
      
      const uniqueMessages = [];
      const messageIds = new Set();
      history.forEach((msg) => {
        if (!messageIds.has(msg.id)) {
          messageIds.add(msg.id);
          uniqueMessages.push(msg);
        }
      });
      
      setMessages(uniqueMessages);
      saveMessagesToStorage(uniqueMessages);
    } catch (error) {
      // Silent fail
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setIsLoading(true);
      const loadData = async () => {
        try {
          const id = await fetchUserData();
          if (id && isMounted) {
            await loadMessagesFromStorage();
            await fetchChatHistory(chatType, receiverId, groupSlug, id);
          }
        } catch (error) {
          // Silent fail
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };
      loadData();
      return () => {
        isMounted = false;
        clearTimeout(timeoutRef.current);
      };
    }, [fetchUserData, fetchChatHistory, chatType, receiverId, groupSlug, accountMode])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        fetchChatHistory(chatType, receiverId, groupSlug, userId);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [userId, chatType, receiverId, groupSlug, fetchChatHistory]);

  useEffect(() => {
    const connectWebSocket = async () => {
      if (!accountMode) return;
      if (reconnectAttempts >= maxReconnectAttempts) return;
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !userId) return;
      
      const encodedToken = encodeURIComponent(token);
      let wsUrl;
      if (chatType === 'single') {
        wsUrl = `ws://showa.essential.com.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`;
      } else {
        wsUrl = `ws://showa.essential.com.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;
      }
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        setIsWebSocketOpen(true);
        setReconnectAttempts(0);
      };
      
     ws.current.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.message) {
      const newMessage = {
        id: data.message.id.toString(),
        user: data.message.user_name || username,
        user_id: data.message.user_id || userId,
        content: data.message.content || '',
        image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
        file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
        file_name: data.message.file_name || (data.message.file ? data.message.file.split('/').pop() : null),
        file_size: data.message.file_size || null,
        emoji: data.message.emoji || null,
        reply_to: data.message.reply_to ? data.message.reply_to.toString() : null,
        is_deleted: data.message.is_deleted || false,
        is_sending: false,
        timestamp: data.message.timestamp,
        time: new Date(data.message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
      };
      
      setMessages((prev) => {
        // Check if this message already exists (by ID)
        if (prev.some((msg) => msg.id === newMessage.id)) return prev;
        
        // Check if this is a temp message from the same user with similar content
        const tempMessageIndex = prev.findIndex(msg => 
          msg.id.startsWith('temp_') && 
          msg.user_id === newMessage.user_id &&
          (
            (msg.content && msg.content === newMessage.content) ||
            (msg.image && newMessage.image && msg.image.includes(newMessage.image?.split('/').pop())) ||
            (msg.file && newMessage.file && msg.file.includes(newMessage.file?.split('/').pop())) ||
            (msg.emoji && msg.emoji === newMessage.emoji)
          )
        );
        
        if (tempMessageIndex !== -1) {
          // Replace temp message with real one
          const updatedMessages = [...prev];
          updatedMessages[tempMessageIndex] = {
            ...newMessage,
            // Keep any fields that might not be in the new message
            reply_to: newMessage.reply_to || updatedMessages[tempMessageIndex].reply_to,
          };
          saveMessagesToStorage(updatedMessages);
          setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: false }), 50);
          return updatedMessages;
        }
        
        // If it's a new message from someone else, add it
        if (newMessage.user_id !== userId) {
          const updatedMessages = [newMessage, ...prev];
          saveMessagesToStorage(updatedMessages);
          setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: false }), 50);
          return updatedMessages;
        }
        
        return prev;
      });
    }
  } catch (e) {
    // Silent fail
  }
};
      
      ws.current.onerror = () => setIsWebSocketOpen(false);
      ws.current.onclose = () => {
        setIsWebSocketOpen(false);
        setReconnectAttempts((prev) => prev + 1);
        setTimeout(connectWebSocket, 3000 * (reconnectAttempts + 1));
      };
    };
    
    if (userId && accountMode) {
      connectWebSocket();
    }
    
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      clearTimeout(timeoutRef.current);
    };
  }, [userId, chatType, receiverId, groupSlug, reconnectAttempts, username, userProfileImage, accountMode]);

  const checkCameraPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const result = await check(permission);
    if (result === RESULTS.GRANTED) return true;
    const requestResult = await request(permission);
    return requestResult === RESULTS.GRANTED;
  };

  const checkPhotoPermission = async () => {
    if (Platform.OS === 'ios') {
      const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      const result = await check(permission);
      if (result === RESULTS.GRANTED) return true;
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    } else {
      if (Platform.Version >= 33) {
        const permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        const result = await check(permission);
        if (result === RESULTS.GRANTED) return true;
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      } else {
        const permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        const result = await check(permission);
        if (result === RESULTS.GRANTED) return true;
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }
    }
  };

  const checkStoragePermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        const result = await check(permission);
        if (result === RESULTS.GRANTED) return true;
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      } else {
        const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        const result = await check(permission);
        if (result === RESULTS.GRANTED) return true;
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }
    }
    return true;
  };

  const getFileSize = async (uri) => {
    try {
      const stat = await RNFS.stat(uri);
      return stat.size;
    } catch (error) {
      console.log('Error getting file size:', error);
      return 0;
    }
  };

 // Format file size for display
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const hasPermission = await checkStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot download file without storage permission');
        return;
      }

      const downloadDest = Platform.select({
        ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
        android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
      });

      Alert.alert(
        'Download File',
        `Download "${fileName}" to your device?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              try {
                const options = {
                  fromUrl: fileUrl,
                  toFile: downloadDest,
                  progress: (res) => {
                    const progress = (res.bytesWritten / res.contentLength) * 100;
                    console.log(`Download progress: ${progress.toFixed(2)}%`);
                  },
                };

                const result = await RNFS.downloadFile(options).promise;
                if (result.statusCode === 200) {
                  Alert.alert('Success', `File downloaded to ${downloadDest}`);
                } else {
                  throw new Error('Download failed');
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to download file');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to download file');
    }
  };

  const pickImage = async (useCamera = false) => {
    setModalVisible(false);
    try {
      const hasPermission = useCamera ? await checkCameraPermission() : await checkPhotoPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot access camera or gallery');
        return;
      }
      
      const options = {
        mediaType: 'photo',
        quality: 0.6,
        includeBase64: false,
        saveToPhotos: false,
        maxWidth: 1024,
        maxHeight: 1024,
        selectionLimit: 1,
      };
      
      const pickerFunction = useCamera ? launchCamera : launchImageLibrary;
      const result = await pickerFunction(options);
      
      if (!result.didCancel && result.assets && result.assets[0]) {
        const imageSize = await getFileSize(result.assets[0].uri);
        
        if (imageSize > MAX_IMAGE_SIZE) {
          Alert.alert(
            'File Too Large',
            `Image size (${formatFileSize(imageSize)}) exceeds maximum allowed size (${formatFileSize(MAX_IMAGE_SIZE)}). Please choose a smaller image.`
          );
          return;
        }
        
        setSelectedImage(result.assets[0]);
        setImagePreviewModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadBackground = async () => {
        try {
          const background = await AsyncStorage.getItem('chatBackground');
          if (background) {
            setChatBackground(JSON.parse(background));
          }
        } catch (error) {
          // Silent fail
        }
      };
      loadBackground();
    });
    return unsubscribe;
  }, [navigation]);

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false);
    sendMessage('', emoji);
  };

  const getBubbleStyle = (message, index, messages) => {
    const isMyMessage = message.user_id === userId;
    const prevMessage = messages[index - 1];
    const isPrevSameSender = prevMessage && prevMessage.user_id === message.user_id;
    
    let style = {
      maxWidth: '75%',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      marginVertical: isPrevSameSender ? 1 : 4,
    };
    
    if (isMyMessage) {
      style.backgroundColor = '#0653bf';
      style.marginLeft = 'auto';
      style.marginRight = 8;
      style.borderBottomRightRadius = 2;
    } else {
      style.backgroundColor = '#FFFFFF';
      style.marginLeft = 8;
      style.marginRight = 'auto';
      style.borderBottomLeftRadius = 2;
    }
    
    if (message.reply_to) {
      style.paddingTop = 16;
    }
    
    return style;
  };

  const handleMessageSelect = (message) => {
    if (!message.is_deleted) {
      setReplyToMessage(message);
    }
  };

  const renderRightActions = (message) => (
    <TouchableOpacity
      style={styles.swipeReply}
      onPress={() => handleMessageSelect(message)}
    >
      <Icon name="reply" size={24} color="#0d64dd" />
    </TouchableOpacity>
  );

  const renderMessage = ({ item, index }) => {
  if (!userId) return null;
  
  const isMyMessage = item.user_id === userId;
  
  if (item.is_deleted) {
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
        ]}
      >
        <Text style={styles.deletedMessage}>This message was deleted</Text>
      </View>
    );
  }
  
  const repliedToMessage = item.reply_to
    ? messages.find((msg) => msg.id === item.reply_to)
    : null;
  
  return (
    <Swipeable
      renderLeftActions={() => renderRightActions(item)}
      overshootLeft={false}
      rightThreshold={40}
    >
      <TouchableOpacity
        onPress={() => handleMessageSelect(item)}
        onLongPress={(e) => {
          if (item.user_id === userId && !item.is_deleted && !item.is_sending) {
            setContextMenu({
              visible: true,
              message: item,
              position: { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY },
            });
          }
        }}
        activeOpacity={0.9}
        disabled={item.is_sending}
      >
        <View
          style={[
            styles.messageContainer,
            isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
          ]}
        >
          {!isMyMessage && (
            <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user_id })}>
              <Image
                source={chatType === 'single' && profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR}
                style={styles.avatar}
              />
            </TouchableOpacity>
          )}
          <View style={[getBubbleStyle(item, index, messages), item.is_sending && styles.sendingMessage]}>
            {repliedToMessage && (
              <View style={styles.replyContainer}>
                <Text style={styles.replyUsername}>{name}</Text>
                <Text style={styles.replyContent} numberOfLines={1}>
                  {repliedToMessage.content || (repliedToMessage.emoji ? repliedToMessage.emoji : 'Media')}
                </Text>
              </View>
            )}
            {item.image && (
              <TouchableOpacity onPress={() => downloadFile(item.image, 'image.jpg')}>
                <Image source={{ uri: item.image }} style={styles.messageImage} />
                {item.uploadProgress && item.uploadProgress < 100 && (
                  <View style={styles.imageUploadProgress}>
                    <View style={[styles.imageUploadProgressBar, { width: `${item.uploadProgress}%` }]} />
                    <Text style={styles.imageUploadProgressText}>{item.uploadProgress}%</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {item.file && (
              <TouchableOpacity
                style={[styles.fileContainer, item.is_sending && styles.sendingFile]}
                onPress={() => !item.is_sending && downloadFile(item.file, item.file_name || 'document')}
                disabled={item.is_sending}
              >
                <Icon name="insert-drive-file" size={24} color="#128C7E" />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.file_name || item.file.split('/').pop()}
                  </Text>
                  {item.file_size && (
                    <Text style={styles.fileSize}>{formatFileSize(item.file_size)}</Text>
                  )}
                </View>
                {item.is_sending ? (
                  <ActivityIndicator size="small" color="#128C7E" />
                ) : (
                  <Icon name="file-download" size={20} color="#128C7E" />
                )}
              </TouchableOpacity>
            )}
            {item.emoji && <Text style={styles.emojiMessage}>{item.emoji}</Text>}
            {item.content && (
              <Text style={[styles.messageText, isMyMessage && { color: '#FFF' }]}>{item.content}</Text>
            )}
            
            {/* Error state */}
            {item.is_error && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ff4444" />
                <Text style={styles.errorText}>Failed to send</Text>
                <TouchableOpacity onPress={() => retrySendMessage(item)}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.messageFooter}>
              <Text style={styles.timeText}>{item.time}</Text>
              {isMyMessage && (
                <>
                  {item.is_sending ? (
                    <ActivityIndicator size={12} color="#999" style={{ marginLeft: 4 }} />
                  ) : item.is_error ? (
                    <Icon name="error" size={12} color="#ff4444" style={{ marginLeft: 4 }} />
                  ) : (
                    <Icon
                      name="done-all"
                      size={12}
                      color="#B9F5D8"
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const retrySendMessage = async (failedMessage) => {
  // Remove the failed message
  setMessages((prev) => prev.filter(msg => msg.id !== failedMessage.id));
  
  // Set up the state to resend
  if (failedMessage.image) {
    // It was an image message
    setSelectedImage({ uri: failedMessage.image });
    setText(failedMessage.content || '');
    setImagePreviewModalVisible(true);
  } else if (failedMessage.file) {
    // It was a file message
    setSelectedFile({
      uri: failedMessage.file,
      name: failedMessage.file_name,
      size: failedMessage.file_size,
    });
    setFileCaption(failedMessage.content || '');
    setFilePreviewModalVisible(true);
  } else {
    // It was a text/emoji message
    setText(failedMessage.content || '');
    setSelectedEmoji(failedMessage.emoji);
    sendMessage(failedMessage.content || '', failedMessage.emoji);
  }
};

  const logFormData = (formData) => {
    const data = {};
    formData._parts.forEach(([key, value]) => {
      if (typeof value === 'object' && value.uri) {
        data[key] = { uri: value.uri, type: value.type, name: value.name, size: value.size };
      } else {
        data[key] = value;
      }
    });
    console.log('Sending FormData:', JSON.stringify(data, null, 2));
  };

const sendMessage = async (caption = '', emoji = null) => {
  if (isSending) return;
  
  const emojiToSend = emoji || selectedEmoji;
  
  if (!caption.trim() && !selectedImage && !selectedFile && !emojiToSend) return;
  if (!accountMode) return;

  setIsSending(true);
  Keyboard.dismiss();

  const formData = new FormData();
  if (caption.trim()) formData.append('content', caption.trim());
  if (emojiToSend) formData.append('emoji', emojiToSend);
  if (replyToMessage) formData.append('reply_to', replyToMessage.id);
  
  if (selectedImage) {
    if (!selectedImage.uri || !selectedImage.type) {
      Alert.alert('Invalid image selected');
      setIsSending(false);
      return;
    }
    formData.append('image', {
      uri: selectedImage.uri,
      type: selectedImage.type,
      name: selectedImage.fileName || 'image.jpg',
    });
  }
  
  if (selectedFile) {
    formData.append('file', {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.type,
    });
    if (selectedFile.size) formData.append('file_size', selectedFile.size.toString());
  }
  
  formData.append('chat_type', chatType);
  formData.append('account_mode', accountMode);
  
  if (chatType === 'single') {
    formData.append('receiver', receiverId);
  } else {
    formData.append('group_slug', groupSlug);
  }
  
  const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // Create message object
  const newMessage = {
    id: tempId,
    user: username,
    user_id: userId,
    content: caption.trim() || null,
    image: selectedImage ? selectedImage.uri : null,
    file: selectedFile ? selectedFile.uri : null,
    file_name: selectedFile ? selectedFile.name : null,
    file_size: selectedFile ? selectedFile.size : null,
    emoji: emojiToSend || null,
    reply_to: replyToMessage ? replyToMessage.id : null,
    is_deleted: false,
    is_sending: true, // Add flag to show sending status
    timestamp: new Date().toISOString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    avatar: userProfileImage || null,
  };

  // Add message to main messages array immediately
  setMessages((prev) => {
    const updatedMessages = [newMessage, ...prev];
    saveMessagesToStorage(updatedMessages);
    return updatedMessages;
  });

  // Scroll to bottom
  setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }), 100);

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    
    // Send message
    if (selectedImage || selectedFile || (!caption.trim() && emojiToSend)) {
      // For media messages
      logFormData(formData);
      const response = await axiosInstance.post(`/api/chat/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            
            // Update message with upload progress
            setMessages((prev) => 
              prev.map(msg => 
                msg.id === tempId 
                  ? { ...msg, uploadProgress: percentCompleted } 
                  : msg
              )
            );
          }
        },
      });
      
      // Update temp message with real data from server
      if (response.data && response.data.id) {
        setMessages((prev) => {
          const updatedMessages = prev.map(msg => 
            msg.id === tempId 
              ? {
                  ...msg,
                  id: response.data.id.toString(),
                  is_sending: false,
                  uploadProgress: undefined,
                  image: response.data.image ? `${API_ROUTE_IMAGE}${response.data.image}` : msg.image,
                  file: response.data.file ? `${API_ROUTE_IMAGE}${response.data.file}` : msg.file,
                }
              : msg
          );
          saveMessagesToStorage(updatedMessages);
          return updatedMessages;
        });
      }
      
    } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // For text messages via WebSocket
      const msg = {
        action: 'send',
        content: caption.trim() || null,
        emoji: emojiToSend || null,
        reply_to: replyToMessage ? replyToMessage.id : null,
        chat_type: chatType,
        receiver_id: chatType === 'single' ? receiverId : null,
        group_slug: chatType === 'group' ? groupSlug : null,
        user_id: userId,
        account_mode: accountMode,
        temp_id: tempId, // Send temp ID to server for reference
      };
      ws.current.send(JSON.stringify(msg));
      
      // Message will be updated when WebSocket receives confirmation
      
    } else {
      // Fallback to HTTP for text
      const response = await axiosInstance.post(`/api/chat/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update temp message with real data
      if (response.data && response.data.id) {
        setMessages((prev) => {
          const updatedMessages = prev.map(msg => 
            msg.id === tempId 
              ? {
                  ...msg,
                  id: response.data.id.toString(),
                  is_sending: false,
                  content: response.data.content || msg.content,
                }
              : msg
          );
          saveMessagesToStorage(updatedMessages);
          return updatedMessages;
        });
      }
    }
    
    // Clear input and selections (but keep the message in chat)
    setText('');
    setFileCaption('');
    setSelectedImage(null);
    setSelectedFile(null);
    setSelectedEmoji(null);
    setReplyToMessage(null);
    setImagePreviewModalVisible(false);
    setFilePreviewModalVisible(false);
    setUploadProgress(null);
    
  } catch (error) {
    // Mark message as failed on error
    setMessages((prev) => {
      const updatedMessages = prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, is_sending: false, is_error: true } 
          : msg
      );
      saveMessagesToStorage(updatedMessages);
      return updatedMessages;
    });
    
    let errorMessage = 'Failed to send message';
    if (error.response?.status === 413) {
      errorMessage = 'File too large for server';
    } else if (error.message.includes('Network')) {
      errorMessage = 'Network error. Please check your connection.';
    }
    Alert.alert('Error', errorMessage);
  } finally {
    setIsSending(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
      />
      <ImageBackground
        source={getWallpaperSource(chatBackground)}
        style={styles.container}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 15 }}>
              <TouchableOpacity onPress={redirectBack} style={styles.headerButton}>
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerProfile}
                onPress={() => navigation.navigate('OtherUserProfile', { userId: receiverId })}
              >
                <Image
                  source={chatType === 'single' && profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR}
                  style={styles.headerAvatar}
                />
                <Text style={styles.headerName}>{name.slice(0, 16) + '...'}</Text>
              </TouchableOpacity>
              <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  
                   onPress={() => navigation.navigate('VoiceCalls', {
                      targetUserId: receiverId,
                      name: name,
                      profile_image: profile_image,
                      roomId: 'unique-room-id',
                      isInitiator: true
                    })}
                  style={styles.headerButton}
                >
                  <Icon name="call" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {uploadProgress !== null && uploadProgress < 100 && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
              <Text style={styles.progressText}>Uploading... {uploadProgress}%</Text>
            </View>
          )}

          <FlatList
  ref={flatListRef}
  data={messages}
  renderItem={renderMessage}
  keyExtractor={(item) => item.id.toString()}
  inverted
  contentContainerStyle={styles.chatContent}
  keyboardShouldPersistTaps="handled"
  scrollEnabled={true}
  initialNumToRender={15}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>

          {replyToMessage && (
            <View style={styles.replyPreview}>
              <View style={styles.replyPreviewContent}>
                <Text style={styles.replyPreviewUsername}>~ replying {name}</Text>
                <Text style={styles.replyPreviewText} numberOfLines={1}>
                  {replyToMessage.content || (replyToMessage.emoji ? replyToMessage.emoji : 'Media')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setReplyToMessage(null)}>
                <Icon name="close" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)} 
              style={styles.attachButton}
              disabled={isSending}
            >
              <Icon name="attach-file" size={27} color={isSending ? "#ccc" : "#0d64dd"} />
            </TouchableOpacity>


            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
              editable={!isSending}
            />
            {text.trim().length > 0 ? (
              <TouchableOpacity 
                onPress={() => sendMessage(text)} 
                style={styles.sendButton}
                disabled={isSending}
              >
                <Icon name="send" size={24} color={isSending ? "#ccc" : "#0d64dd"} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled style={styles.sendButton}>
                <Icon name="send" size={24} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>

          {/* Options Modal */}
          {/* Options Modal */}
<Modal
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.modalContent}>
    <FlatList
      data={options}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.modalOptions}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            if (item.label === 'Document') {
              setModalVisible(false);
              setTimeout(async () => {
                try {
                  const result = await pick({ 
                    type: ['*/*'],
                    allowMultiSelection: false 
                  });
                  
                  // Check if user canceled or picked a file
                  if (result && result.length > 0) {
                    const file = result[0];
                    // Optional: Check file size if needed
                    // const fileSize = await getFileSize(file.uri);
                    // if (fileSize > MAX_FILE_SIZE) {
                    //   Alert.alert('File Too Large', `File size exceeds maximum allowed size (${formatFileSize(MAX_FILE_SIZE)}).`);
                    //   return;
                    // }
                    
                    setSelectedFile(file);
                    setFilePreviewModalVisible(true);
                  }
                  // If result is empty or undefined, user canceled - no alert needed
                } catch (e) {
                  // Only show alert for actual errors, not cancellations
                  if (e.code !== 'DOCUMENT_PICKER_CANCELED' && 
                      e.message !== 'User cancelled' && 
                      !e.message?.includes('cancel')) {
                    Alert.alert('Error', 'Failed to pick document. Please try again.');
                  }
                }
              }, 250);
            } else if (item.label === 'Camera') {
              pickImage(true);
              setModalVisible(false);
            } else if (item.label === 'Gallery') {
              pickImage(false);
              setModalVisible(false);
            } else if (item.label === 'Emoji') {
              setEmojiPickerVisible(true);
              setModalVisible(false);
            }
          }}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Icon name={item.icon} size={24} color={item.color} />
          </View>
          <Text style={styles.optionLabel}>{item.label}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
</Modal>

          

         
{/* Image Preview Modal - WITH SCROLLABLE IMAGE */}
        <Modal
          transparent={false}
          visible={imagePreviewModalVisible}
          onRequestClose={() => setImagePreviewModalVisible(false)}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Header - Fixed at top */}
            <View style={styles.previewModalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setImagePreviewModalVisible(false);
                  setSelectedImage(null);
                  setText('');
                }}
                style={styles.previewCloseButton}
              >
                <Icon name="close" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.previewTitle}>Send Image</Text>
              <TouchableOpacity
                onPress={() => {
                  sendMessage(text);
                  setImagePreviewModalVisible(false);
                }}
                style={styles.previewSendButton}
                disabled={isSending}
              >
                <Icon name="send" size={28} color={isSending ? "#ccc" : "#0d64dd"} />
              </TouchableOpacity>
            </View>

            {/* Image Preview Area - Scrollable */}
            <View style={{ flex: 1 }}>
              <ScrollView 
                contentContainerStyle={styles.previewScrollContent}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                maximumZoomScale={3.0}
                minimumZoomScale={1.0}
                bouncesZoom={true}
              >
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                )}
              </ScrollView>
            </View>

            {/* Input Area - Fixed at bottom */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.previewInputContainer}>
                <TextInput
                  style={styles.previewInput}
                  placeholder="Add a caption..."
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={setText}
                  multiline
                  editable={!isSending}
                />
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
          {/* File Preview Modal */}

          {/* File Preview Modal - UPDATED WITH SCROLLABLE CONTENT */}
        <Modal
          transparent={false}
          visible={filePreviewModalVisible}
          onRequestClose={() => setFilePreviewModalVisible(false)}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header - Fixed at top */}
            <View style={[styles.previewModalHeader, { backgroundColor: '#fff' }]}>
              <TouchableOpacity
                onPress={() => {
                  setFilePreviewModalVisible(false);
                  setSelectedFile(null);
                  setFileCaption('');
                }}
                style={styles.previewCloseButton}
              >
                <Icon name="close" size={28} color="#000" />
              </TouchableOpacity>
              <Text style={[styles.previewTitle, { color: '#000' }]}>Send Document</Text>
              <TouchableOpacity
                onPress={() => {
                  sendMessage(fileCaption);
                  setFilePreviewModalVisible(false);
                }}
                style={styles.previewSendButton}
                disabled={isSending}
              >
                <Icon name="send" size={28} color={isSending ? "#ccc" : "#0d64dd"} />
              </TouchableOpacity>
            </View>

            {/* File Preview Area - Scrollable */}
            <View style={{ flex: 1 }}>
              <ScrollView 
                contentContainerStyle={styles.filePreviewScrollContent}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                {/* File Icon */}
                <View style={styles.fileIconContainer}>
                  <Icon name="insert-drive-file" size={100} color="#0d64dd" />
                </View>
                
                {/* File Name */}
                <Text style={[styles.filePreviewName, { color: '#000' }]} numberOfLines={3}>
                  {selectedFile?.name || 'Document'}
                </Text>
                
                {/* File Size */}
                {selectedFile?.size && (
                  <Text style={styles.filePreviewSize}>
                    {formatFileSize(selectedFile.size)}
                  </Text>
                )}
                
                {/* Preview for images (if file is an image) */}
                {selectedFile?.type?.startsWith('image/') && (
                  <View style={styles.fileImagePreviewContainer}>
                    <Image 
                      source={{ uri: selectedFile.uri }} 
                      style={styles.filePreviewImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
                
                {/* File Type Badge */}
                {selectedFile?.type && (
                  <View style={styles.fileTypeBadge}>
                    <Text style={styles.fileTypeText}>
                      {selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Input Area - Fixed at bottom */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.previewInputContainer}>
                <TextInput
                  style={[styles.previewInput, { color: '#000', backgroundColor: '#f5f5f5' }]}
                  placeholder="Add a caption..."
                  placeholderTextColor="#999"
                  value={fileCaption}
                  onChangeText={setFileCaption}
                  multiline
                  editable={!isSending}
                />
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
        

          {contextMenu.visible && (
            <View style={[
              styles.contextMenuContainer,
              {
                top: contextMenu.position.y - 50,
                left: Math.max(10, Math.min(contextMenu.position.x - 100, Dimensions.get('window').width - 220)),
              }
            ]}>
              {contextMenu.message?.user_id === userId && !contextMenu.message?.is_deleted && (
                <>
                  <TouchableOpacity
                    style={styles.contextMenuItem}
                    onPress={() => {
                      deleteMessage(contextMenu.message.id);
                      setContextMenu({ visible: false, message: null });
                    }}
                    activeOpacity={0.6}
                  >
                    <View style={styles.contextMenuIcon}>
                      <Icon name="delete" size={20} color="#ff4444" />
                    </View>
                    <Text style={[styles.contextMenuText, { color: '#ff4444' }]}>Delete</Text>
                  </TouchableOpacity>
                  <View style={styles.contextMenuDivider} />
                  <TouchableOpacity
                    style={styles.contextMenuItem}
                    onPress={() => setContextMenu({ visible: false, message: null })}
                    activeOpacity={0.6}
                  >
                    <View style={styles.contextMenuIcon}>
                      <Icon name="close" size={20} color="#666" />
                    </View>
                    <Text style={styles.contextMenuText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          <Modal
            transparent={true}
            visible={emojiPickerVisible}
            onRequestClose={() => setEmojiPickerVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setEmojiPickerVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.emojiPickerContainer}>
                  <EmojiSelector onEmojiSelected={selectEmoji} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            transparent={true}
            visible={!!userPopup}
            onRequestClose={() => setUserPopup(null)}
          >
            <TouchableWithoutFeedback onPress={() => setUserPopup(null)}>
              <View style={styles.userModalOverlay}>
                <View style={styles.userModalContent}>
                  <Image
                    source={userPopup?.avatar ? { uri: userPopup.avatar } : FALLBACK_AVATAR}
                    style={styles.userModalAvatar}
                  />
                  <Text style={[styles.userModalUsername, { color: '#333' }]}>
                    {userPopup?.username || 'Unknown'}
                  </Text>
                  <View style={styles.userModalButtons}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                      <TouchableOpacity onPress={() => setUserPopup(false)} style={{ alignItems: 'center', borderColor: 'grey', borderWidth: 1, padding: 10, borderRadius: 10, width: 80, height: 80 }}>
                        <Icon name="chat" size={28} color="#25D366" />
                        <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>Chat</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate('BusinessVoiceCalls', { receiverId, isCaller: true, name, roomId: 'unique-room-id' })} style={{ alignItems: 'center', borderColor: 'grey', borderWidth: 1, padding: 10, borderRadius: 10, width: 80, height: 80 }}>
                        <Icon name="phone" size={28} color="#34B7F1" />
                        <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate('CallOngoingScreen', { type: 'video', receiverId, profile_image, name })} style={{ alignItems: 'center', borderColor: 'grey', borderWidth: 1, padding: 10, borderRadius: 10, width: 80, height: 80 }}>
                        <Icoon name="video" size={28} color="#FF6D00" />
                        <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>Video</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity style={{ marginTop: 10, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: "#eee" }} onPress={() => setUserPopup(null)}>
                    <Text style={{ color: "#333", fontSize: 16 }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Add these styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    paddingTop: Platform.OS === 'android' ? 5 : 0,
    borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: '#0d64dd',
    elevation: 6,
    zIndex: 1000,
  },
  headerButton: {
    padding: 8,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  chatContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    zIndex: 10,
  },
  previewCloseButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  previewSendButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  previewImage: {
    width: Dimensions.get('window').width - 20, 
    height: undefined,
    aspectRatio: 1, 
  },
  previewInputContainer: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
  },
  previewInput: {
    backgroundColor: '#333',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
    maxHeight: 100,
    minHeight: 48,
    textAlignVertical: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    marginHorizontal: 8,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#d9d9d9ff',
    
    marginTop: 2,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  deletedMessage: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    minWidth: 200,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    color: '#128C7E',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emojiMessage: {
    fontSize: 28,
    marginBottom: 4,
  },
  replyContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#0d64dd',
    paddingLeft: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    padding: 5
  },
  replyUsername: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#128C7E',
  },
  replyContent: {
    fontSize: 12,
    color: '#666',
  },
  swipeReply: {
    backgroundColor: '#E8ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    marginRight: 8,
  },
  replyPreview: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    alignItems: 'center',
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#091ec0ff',
  },
  replyPreviewText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  attachButton: {
    padding: 8,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    fontSize: 16,
    color: '#000',
    marginHorizontal: 4,
  },
  sendButton: {
    padding: 8,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalOptions: {
    paddingBottom: 16,
  },
  optionButton: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#128C7E',
    fontWeight: '500',
  },
  // Preview Modal Styles
  previewModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  previewCloseButton: {
    padding: 8,
  },
  sendingMessage: {
    opacity: 0.7,
  },
  sendingFile: {
    opacity: 0.7,
  },
  imageUploadProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadProgressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#0d64dd',
    opacity: 0.7,
  },
  imageUploadProgressText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    padding: 4,
    backgroundColor: 'rgba(255,68,68,0.1)',
    borderRadius: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginLeft: 4,
    flex: 1,
  },
  retryText: {
    fontSize: 12,
    color: '#0d64dd',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  previewSendButton: {
    padding: 8,
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewInputContainer: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  previewInput: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
    maxHeight: 100,
  },
  filePreviewContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fileIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(13,100,221,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  filePreviewName: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  filePreviewSize: {
    fontSize: 14,
    color: '#999',
  },
  contextMenuContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  contextMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  contextMenuIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  contextMenuText: {
    fontSize: 16,
    color: '#333',
  },
  contextMenuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  progressContainer: {
    height: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#0d64dd',
    opacity: 0.3,
  },
  progressText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  emojiPickerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    maxHeight: '50%',
  },
  userModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
    elevation: 5,
  },
  userModalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userModalUsername: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    zIndex: 10,
  },
  previewCloseButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  previewSendButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInputContainer: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
  },
  previewInput: {
    backgroundColor: '#333',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
    maxHeight: 100,
    minHeight: 48,
    textAlignVertical: 'center',
  },

  // File Preview specific styles
  filePreviewScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  fileIconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(13,100,221,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filePreviewName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  filePreviewSize: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  fileImagePreviewContainer: {
    width: '100%',
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  filePreviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  fileTypeBadge: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  fileTypeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  userModalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 15,
  },
});















