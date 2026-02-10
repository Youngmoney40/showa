

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
//   ImageBackground,
//   ActivityIndicator,
//   BackHandler,
//   Dimensions,
//    LogBox,
// } from 'react-native';
// import Icoon from "react-native-vector-icons/MaterialCommunityIcons";
// import { useFocusEffect } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import { pick, isCancel } from '@react-native-documents/picker';
// import EmojiSelector from 'react-native-emoji-selector';
// import { ScrollView, Swipeable } from 'react-native-gesture-handler';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';



// const audioRecorderPlayer = new AudioRecorderPlayer();

// const axiosInstance = axios.create({
//   baseURL: 'https://showa.essential.com.ng/api/showa',
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
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [recordSecs, setRecordSecs] = useState(0);
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
//   const [accountMode, setAccountMode] = useState('business')
//   const [filePreviewModalVisible, setFilePreviewModalVisible] = useState(false);
//   const [fileCaption, setFileCaption] = useState('');

//   LogBox.ignoreLogs([
//     'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
//   ]);

//   const [chatBackground, setChatBackground] = useState(null);
// useEffect(() => {
//   const loadBackground = async () => {
//     const background = await AsyncStorage.getItem('chatBackground');
//     if (background) {
//       setChatBackground(JSON.parse(background));
//     }
//   };
//   loadBackground();
// }, []);


// useEffect(() => {
//   const backAction = () => {
//   navigation.goBack();
//     return true; 
//   };

//   const backHandler = BackHandler.addEventListener(
//     'hardwareBackPress',
//     backAction
//   );

//   return () => backHandler.remove(); 
// }, [navigation]);

//   const flatListRef = useRef();
//   const ws = useRef(null);
//   const timeoutRef = useRef(null);
//   const maxReconnectAttempts = 5;

//  useEffect(() => {
//   const loadMode = async () => {
//     try {
//       const mode = 'business';
//       //console.log('account_mode', mode);
//       setAccountMode(mode);
//     } catch (error) {
//       //console.error('Error loading account mode:', error);
//       setAccountMode('business'); 
//     }
//   };

//   loadMode();
// }, []);

// const [contextMenu, setContextMenu] = useState({
//   visible: false,
//   message: null,
//   position: { x: 0, y: 0 },
// });
// const deleteMessage = async (messageId) => {
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       alert('Please log in to perform this action');
//       //navigation.navigate('Login');
//       return;
//     }

//     //console.log('Sending delete request with token:', token); 

//     const response = await axiosInstance.post(
//       `/delete-chat/${messageId}/`,
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       }
//     );

//     // Update state
//     setMessages(prev => prev.map(msg => 
//       msg.id === messageId.toString() ? {...msg, is_deleted: true} : msg
//     ));
//     setPendingMessages(prev => prev.map(msg => 
//       msg.id === messageId.toString() ? {...msg, is_deleted: true} : msg
//     ));

//   } catch (error) {
//     //console.error('Delete error:', error.response?.data || error.message);
//     if (error.response?.status === 401) {
//       alert('Session expired. Please log in again.');
//       //navigation.navigate('Login');
//     } else {
//       alert(error.response?.data?.error || 'Failed to delete message');
//     }
//   }
// };

//   const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

//   const saveMessagesToStorage = async (messagesToSave) => {
//     try {
//       const limitedMessages = messagesToSave.slice(0, 100);
//       const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
//       await AsyncStorage.setItem(storageKey, JSON.stringify(limitedMessages));
//     } catch (error) {
//       //console.error('Error saving messages to AsyncStorage:', error);
//     }
//   };

//   const loadMessagesFromStorage = async () => {
//     try {
//       const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
//       const storedMessages = await AsyncStorage.getItem(storageKey);
//       if (storedMessages) {
//         const parsedMessages = JSON.parse(storedMessages);
//         setMessages(parsedMessages);
//       }
//     } catch (error) {
//       //console.error('Error loading messages from AsyncStorage:', error);
//     }
//   };

//   const redirectBack = () => {
//     navigation.navigate('BusinessHome');
//   };

//   const fetchUserData = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;

//       if (!token || !parsed?.id) {
//         //console.error('Missing token or userID');
//         alert('Please log in again.');
//         //navigation.navigate('Login');
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
//      // console.error('Error fetching user:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         //navigation.navigate('Login');
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
//          // navigation.navigate('Login');
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
//         //  console.error('Refresh error:', refreshError.response?.data || refreshError);
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
//       //console.error('No userId available for fetching chat history');
//       return;
//     }

//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//      // console.error('No access token found');
//       //navigation.navigate('Login');
//       return;
//     }

//     try {
//       let url = `/api/chat/?chat_type=${chatType}&account_mode=${accountMode}`;
//       if (chatType === 'single' && receiverId) {
//         url += `&receiver=${receiverId}`;
//       } else if (chatType === 'group' && groupSlug) {
//         url += `&group_slug=${groupSlug}`;
//       } else {
//         //console.error('Invalid chat type or missing parameters');
//         navigation.navigate('BusinessHome');
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

//       // Deduplicate messages by ID
//       const uniqueMessages = [];
//       const messageIds = new Set();
//       history.forEach((msg) => {
//         if (!messageIds.has(msg.id)) {
//           messageIds.add(msg.id);
//           uniqueMessages.push(msg);
//         }
//       });

//       // Reverse the order so latest is at the bottom
// //const reversedMessages = uniqueMessages.reverse();

// // setMessages(reversedMessages);
// // saveMessagesToStorage(reversedMessages);

//  setMessages(uniqueMessages);
//   saveMessagesToStorage(uniqueMessages);

      
//     } catch (error) {
//      // console.error('Error fetching chat history:', error.response?.data || error.message);
//     }
//   }, [navigation]);

//   // Replace your current useFocus with this:
// useFocusEffect(
//   useCallback(() => {
//     let isMounted = true;
//     setIsLoading(true);

//     const loadData = async () => {
//       try {
//         const id = await fetchUserData();
//         if (id && isMounted) {
//           await loadMessagesFromStorage();
//           await fetchChatHistory(chatType, receiverId, groupSlug, id);
//         }
//       } catch (error) {
//         //console.error('Error in focus effect:', error);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//       // Don't close WebSocket here - we want it to stay connected
//       clearTimeout(timeoutRef.current);
//     };
//   }, [fetchUserData, fetchChatHistory, chatType, receiverId, groupSlug, accountMode])
// );

// // Add this to handle updates when app is in background
// useEffect(() => {
//   const interval = setInterval(() => {
//     if (userId) {
//       fetchChatHistory(chatType, receiverId, groupSlug, userId);
//     }
//   }, 30000); // Check for new messages every 30 seconds

//   return () => clearInterval(interval);
// }, [userId, chatType, receiverId, groupSlug, fetchChatHistory]);

//   // useEffect(() => {
//   //   let isMounted = true;
//   //   setIsLoading(true);

//   //   fetchUserData().then((id) => {
//   //     if (id && isMounted) {
//   //       loadMessagesFromStorage();
//   //       fetchChatHistory(chatType, receiverId, groupSlug, id);
//   //     }
//   //     if (isMounted) setIsLoading(false);
//   //   });

//   //   return () => {
//   //     isMounted = false;
//   //     if (ws.current) {
//   //       ws.current.close();
//   //       ws.current = null;
//   //     }
//   //     clearTimeout(timeoutRef.current);
//   //   };
//   // }, [fetchUserData, fetchChatHistory, chatType, receiverId, groupSlug, accountMode]);

//   useEffect(() => {
//   const connectWebSocket = async () => {
//     if (!accountMode) {
//      // console.warn('accountMode not set, delaying WebSocket connection');
//       return;
//     }

//     if (reconnectAttempts >= maxReconnectAttempts) {
//       //console.error('Max WebSocket reconnect attempts reached');
//       return;
//     }

//     const token = await AsyncStorage.getItem('userToken');
//     if (!token || !userId) {
//      // console.error('No token or user ID found');
//       //navigation.navigate('Login');
//       return;
//     }

//     const encodedToken = encodeURIComponent(token);
//     let wsUrl;
//     if (chatType === 'single') {
//       wsUrl = `ws://showa.essential.com.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`;
//     } else {
//       wsUrl = `ws://showa.essential.com.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;
//     }

//     ws.current = new WebSocket(wsUrl);
//     ws.current.onopen = () => {
//      // console.log('WebSocket connected successfully');
//       setIsWebSocketOpen(true);
//       setReconnectAttempts(0);
//     };

//     ws.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.message) {
//           const newMessage = {
//             id: data.message.id.toString(),
//             user: data.message.user_name || username,
//             user_id: data.message.user_id || userId,
//             content: data.message.content || '',
//             image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
//             file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
//             audio: data.message.audio ? `${API_ROUTE_IMAGE}${data.message.audio}` : null,
//             emoji: data.message.emoji || null,
//             reply_to: data.message.reply_to ? data.message.reply_to.toString() : null,
//             is_deleted: data.message.is_deleted || false,
            
//             timestamp: data.message.timestamp,
//             time: new Date(data.message.timestamp).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             }),
//             avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
//           };

//           setMessages((prev) => {
//             if (prev.some((msg) => msg.id === newMessage.id)) {
//               return prev;
//             }

//             setPendingMessages((pending) => {
//               const filtered = pending.filter((msg) => {
//                 const isSameContent = msg.content && msg.content === newMessage.content;
//                 const isSameImage = msg.image && newMessage.image && msg.image.includes(newMessage.image?.split('/').pop());
//                 const isSameFile = msg.file && newMessage.file && msg.file.includes(newMessage.file?.split('/').pop());
//                 const isSameAudio = msg.audio && newMessage.audio && msg.audio.includes(newMessage.audio?.split('/').pop());
//                 const isSameEmoji = msg.emoji && msg.emoji === newMessage.emoji;
//                 return !(isSameContent || isSameImage || isSameFile || isSameAudio || isSameEmoji);
//               });
//               return filtered;
//             });

//             const updatedMessages = [newMessage, ...prev];
//             saveMessagesToStorage(updatedMessages);
//             setTimeout(() => {
//               flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//             }, 50);
//             return updatedMessages;
//           });
//         }
//       } catch (e) {
//        // console.error('Error parsing WebSocket message:', e);
//       }
//     };

//     ws.current.onerror = (error) => {
//       //console.error('WebSocket error:', error);
//       setIsWebSocketOpen(false);
//     };

//     ws.current.onclose = () => {
//       //console.log('WebSocket closed');
//       setIsWebSocketOpen(false);
//       setReconnectAttempts((prev) => prev + 1);
//       setTimeout(connectWebSocket, 3000 * (reconnectAttempts + 1));
//     };
//   };

//   if (userId && accountMode) {
//     connectWebSocket();
//   }

//   return () => {
//     if (ws.current) {
//       ws.current.close();
//       ws.current = null;
//     }
//     clearTimeout(timeoutRef.current);
//   };
// }, [userId, chatType, receiverId, groupSlug, reconnectAttempts, username, userProfileImage, navigation, accountMode]);

//   const checkCameraPermission = async () => {
//     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
//     const result = await check(permission);
//     if (result === RESULTS.GRANTED) return true;
//     const requestResult = await request(permission);
//     return requestResult === RESULTS.GRANTED;
//   };

//   const checkPhotoPermission = async () => {
//     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
//     const result = await check(permission);
//     if (result === RESULTS.GRANTED) return true;
//     const requestResult = await request(permission);
//     return requestResult === RESULTS.GRANTED;
//   };

//   const pickImage = async (useCamera = false) => {
//     setModalVisible(false);
//     try {
//       const hasPermission = useCamera ? await checkCameraPermission() : await checkPhotoPermission();
//       if (!hasPermission) {
//         alert('Permission denied');
//         return;
//       }

//       setIsImageLoading(true);
//       const pickerFunction = useCamera ? launchCamera : launchImageLibrary;
//       const result = await pickerFunction({ mediaType: 'photo', quality: 0.7 });
//       setIsImageLoading(false);

//       if (!result.didCancel && result.assets) {
//         setSelectedImage(result.assets[0]);
//         setImagePreviewModalVisible(true);
//       }
//     } catch (error) {
//       setIsImageLoading(false);
//       //console.error('Error picking image:', error);
//       alert('Failed to pick image');
//     }
//   };

//   // const pickFile = async () => {
//   //   setModalVisible(false);
//   //   try {
//   //     const result = await DocumentPicker.pick({
//   //       type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
//   //     });
//   //     setSelectedFile(result[0]);
//   //     sendMessage('');
//   //   } catch (error) {
//   //     if (DocumentPicker.isCancel(error)) {
//   //       console.log('File picking cancelled');
//   //     } else {
//   //       console.error('Error picking file:', error);
//   //       alert('Failed to pick file');
//   //     }
//   //   }
//   // };
//   const pickFile = async () => {
//   setModalVisible(false);
//   try {
//     const result = await pick({
//   allowMultiSelection: false,
//   presentationStyle: 'fullScreen',
//   copyTo: 'cachesDirectory',
//   type: [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'text/plain',
//     'image/*',
//   ],
// });
//     setSelectedFile(result[0]);
//     setFileCaption(''); // Reset caption
//     setFilePreviewModalVisible(true); // Show caption modal
//   } catch (error) {
//     if (!isCancel(error)) {
//      // console.log('File picking cancelled');
//     } else {
//       //console.error('Error picking file:', error);
//       alert('Failed to pick file');
//     }
//   }
// };

// useEffect(() => {
//   const unsubscribe = navigation.addListener('focus', () => {
//     const loadBackground = async () => {
//       try {
//         const background = await AsyncStorage.getItem('chatBackground');
//         if (background) {
//           setChatBackground(JSON.parse(background));
//         }
//       } catch (error) {
//        // console.error('Error loading chat background:', error);
//       }
//     };
//     loadBackground();
//   });
//   return unsubscribe;
// }, [navigation]);
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
//       style.borderBottomRightRadius = 2;
//     } else {
//       style.backgroundColor = '#FFFFFF';
//       style.marginLeft= 8;
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
//   <TouchableOpacity
//     style={styles.swipeReply}
//     onPress={() => handleMessageSelect(message)}
//   >
//     <Icon name="reply" size={24} color="#0d64dd" />
//   </TouchableOpacity>
// );

//   const VisualizedAudioPlayer = ({ audioUrl }) => {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [duration, setDuration] = useState(0);
//     const [currentPosition, setCurrentPosition] = useState(0);

//     const startPlayback = async () => {
//       try {
//         await audioRecorderPlayer.startPlayer(audioUrl);
//         setIsPlaying(true);
//         audioRecorderPlayer.addPlayBackListener((e) => {
//           setCurrentPosition(e.currentPosition);
//           setDuration(e.duration);
//           if (e.currentPosition >= e.duration) {
//             setIsPlaying(false);
//             audioRecorderPlayer.stopPlayer();
//             setCurrentPosition(0);
//           }
//         });
//       } catch (err) {
//         //console.error('Error playing audio:', err);
//         alert('Failed to play audio');
//       }
//     };

//     const stopPlayback = async () => {
//       try {
//         await audioRecorderPlayer.stopPlayer();
//         setIsPlaying(false);
//       } catch (err) {
//        // console.error('Error stopping audio:', err);
//       }
//     };

//     const formatTime = (ms) => {
//       const seconds = Math.floor(ms / 1000);
//       const minutes = Math.floor(seconds / 60);
//       const remainingSeconds = seconds % 60;
//       return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     return (
//       <View style={styles.audioContainer}>
//         <TouchableOpacity
//           onPress={isPlaying ? stopPlayback : startPlayback}
//           style={styles.audioPlayButton}
//         >
//           <Icon
//             name={isPlaying ? 'pause' : 'play-arrow'}
//             size={20}
//             color="#FFFFFF"
//           />
//         </TouchableOpacity>
//         <View style={styles.audioProgress}>
//           <View style={styles.waveformStatic}>
//             {Array(40)
//               .fill()
//               .map((_, index) => (
//                 <View
//                   key={index}
//                   style={[
//                     styles.waveformBar,
//                     {
//                       height: isPlaying ? Math.random() * 12 + 4 : 8,
//                       backgroundColor: isPlaying ? '#0d64dd' : '#B0BEC5',
//                     },
//                   ]}
//                 />
//               ))}
//           </View>
//           <Text style={styles.audioTime}>
//             {formatTime(currentPosition)} / {formatTime(duration)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

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
//        renderLeftActions={() => renderRightActions(item)} 
//   overshootLeft={false}
//   rightThreshold={40}>
//         <TouchableOpacity
//           onPress={() => handleMessageSelect(item)}
//           //onLongPress={() => handleMessageSelect(item)}
//           onLongPress={(e) => {
//           if (item.user_id === userId && !item.is_deleted) {
//             setContextMenu({
//               visible: true,
//               message: item,
//               position: { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY },
//             });
//           }
//         }}
//           activeOpacity={0.9}
//           //delayLongPress={300}
//         >
//           <View
//             style={[
//               styles.messageContainer,
//               isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
//             ]}
//           >
//             {!isMyMessage && (
//               <TouchableOpacity
//                 onPress={() => setUserPopup({ username: item.user, avatar: item.avatar,email: item.email, verify:item.verify, detail:item })}
//               >
//                 <Image
//                   source={
//                     chatType === 'single' && profile_image
//                       ? { uri: `${API_ROUTE_IMAGE}${profile_image}` }
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
//               {item.audio && <VisualizedAudioPlayer audioUrl={item.audio} />}
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
//   if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji && !recording) {
//     return;
//   }

//   if (!accountMode) {
//     //console.error('accountMode is not set');
//     alert('Account mode not set. Please try again.');
//     return;
//   }

//   const formData = new FormData();
//   if (caption.trim()) formData.append('content', caption.trim());
//   if (selectedEmoji) formData.append('emoji', selectedEmoji);
//   if (replyToMessage) formData.append('reply_to', replyToMessage.id);
//   if (selectedImage) {
//     if (!selectedImage.uri || !selectedImage.type) {
//       alert('Invalid image selected');
//       return;
//     }
//     formData.append('image', {
//       uri: selectedImage.uri,
//       type: selectedImage.type,
//       name: selectedImage.fileName || 'image.jpg',
//     });
//   }
//   if (selectedFile) {
//     formData.append('content', fileCaption || '');
//     if (!selectedFile.uri || !selectedFile.type) {
//       alert('Invalid file selected');
//       return;
//     }
//     formData.append('file', {
//       uri: selectedFile.uri,
//       type: selectedFile.type,
//       name: selectedFile.name,
//     });
//   }
//   formData.append('chat_type', chatType);
//   formData.append('account_mode', accountMode);
//   if (chatType === 'single') {
//     formData.append('receiver', receiverId);
//   } else {
//     formData.append('group_slug', groupSlug);
//   }

//   const tempId = 'm' + Date.now();
//   if (selectedImage || selectedFile || selectedEmoji || caption.trim()) {
//     setPendingMessages((prev) => [
//       {
//         id: tempId,
//         user: username,
//         user_id: userId,
//         content: caption.trim() || null,
//         image: selectedImage ? selectedImage.uri : null,
//         file: selectedFile ? selectedFile.uri : null,
//         audio: null,
//         emoji: selectedEmoji || null,
//         reply_to: replyToMessage ? replyToMessage.id : null,
//         is_deleted: false,
//         timestamp: new Date().toISOString(),
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         avatar: userProfileImage || null,
//       },
//       ...prev,
//     ]);
//   }

//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       throw new Error('No access token found. Please log in again.');
//     }

//     let success = false;
//     if (selectedImage || selectedFile || (!caption.trim() && !selectedEmoji)) {
//       logFormData(formData);
//       const response = await axiosInstance.post(`/api/chat/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       success = true;
//     } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//       const msg = {
//         action: 'send',
//         content: caption.trim() || null,
//         emoji: selectedEmoji || null,
//         reply_to: replyToMessage ? replyToMessage.id : null,
//         chat_type: chatType,
//         receiver_id: chatType === 'single' ? receiverId : null,
//         group_slug: chatType === 'group' ? groupSlug : null,
//         user_id: userId,
//         account_mode: accountMode,
//       };
//       //console.log('Sending WebSocket message:', msg); // Debugging
//       ws.current.send(JSON.stringify(msg));
//       success = true;
//     } else {
//       logFormData(formData);
//       const response = await axiosInstance.post(`/api/chat/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       success = true;
//     }

//     if (success) {
//       setText('');
//       setFileCaption('');
//       setSelectedImage(null);
//       setSelectedFile(null);
//       setSelectedEmoji(null);
//       setReplyToMessage(null);
//       setImagePreviewModalVisible(false);
//       flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//     }
//   } catch (error) {
//     //console.error('Error sending message:', error.response?.data || error.message);
//     setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//     let errorMessage = 'Failed to send message';
//     if (error.response) {
//       errorMessage += `: ${error.response.data?.detail || JSON.stringify(error.response.data)}`;
//       if (error.response.status === 401) {
//         navigation.navigate('Login');
//       }
//     } else if (error.message.includes('Network Error')) {
//       errorMessage += ': Check your network.';
//     }
//     alert(errorMessage);
//   }
// };

//   const onStartRecord = async () => {
//     try {
//       const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
//       const result = await check(permission);
//       if (result !== RESULTS.GRANTED) {
//         const requestResult = await request(permission);
//         if (requestResult !== RESULTS.GRANTED) {
//           alert('Microphone permission denied');
//           return false;
//         }
//       }
//       await audioRecorderPlayer.startRecorder();
//       audioRecorderPlayer.addRecordBackListener((e) => {
//         setRecordSecs(e.currentPosition);
//       });
//       setRecording(true);
//       return true;
//     } catch (err) {
//       //console.error('Error starting recording:', err);
//       alert('Failed to start recording');
//       return false;
//     }
//   };

//   const onStopRecord = async () => {
//     try {
//       const result = await audioRecorderPlayer.stopRecorder();
//       audioRecorderPlayer.removeRecordBackListener();
//       setRecordSecs(0);
//       setRecording(false);

//       if (!result) {
//         throw new Error('No audio recorded');
//       }

//       const formData = new FormData();
//       formData.append('audio', {
//         uri: result,
//         type: 'audio/m4a',
//         name: result.split('/').pop() || 'audio.m4a',
//       });
//       if (replyToMessage) formData.append('reply_to', replyToMessage.id);
//       formData.append('chat_type', chatType);
//       if (chatType === 'single') {
//         formData.append('receiver', receiverId);
//       } else {
//         formData.append('group_slug', groupSlug);
//       }

//       const tempId = 'm' + Date.now();
//       setPendingMessages((prev) => [
//         {
//           id: tempId,
//           user: username,
//           user_id: userId,
//           content: null,
//           image: null,
//           file: null,
//           audio: result,
//           emoji: null,
//           reply_to: replyToMessage ? replyToMessage.id : null,
//           is_deleted: false,
//           timestamp: new Date().toISOString(),
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           avatar: userProfileImage || null,
//         },
//         ...prev,
//       ]);

//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         throw new Error('No access token found.');
//       }

//       logFormData(formData);
//       const response = await axiosInstance.post(`/api/chat/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setReplyToMessage(null);
//       flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//     } catch (error) {
//      // console.error('Error stopping recording:', error.response?.data || error.message);
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       let errorMessage = 'Failed to send audio';
//       if (error.response) {
//         errorMessage += `: ${error.response.data?.detail || JSON.stringify(error.response.data)}`;
//         if (error.response.status === 401) {
//           //navigation.navigate('Login');
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

 

//   // if (isLoading) {
//   //   return (
//   //     <View style={styles.loadingContainer}>
//   //       <ActivityIndicator size="large" color="#0d64dd" />
//   //     </View>
//   //   );
//   // }

//   return (
//     <ImageBackground
//       source={chatBackground ? { uri: chatBackground.value } : require('../assets/images/backroundsplash.png')}
//       style={[styles.container, {}]}
//       resizeMode="cover"
//     >
//       <KeyboardAvoidingView
//        nestedScrollEnabled={true}
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
//           <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//             <TouchableOpacity
//               onPress={redirectBack}
//               style={[styles.headerButton, { marginTop: -20 }]}
//             >
//               <Icon name="arrow-back" size={24} color="#FFF" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.headerProfile, { marginTop: -20 }]}
              
//               onPress={() => {
  

//   setUserPopup({
//     username: name,
   
//     avatar: profile_image
//       ? `${API_ROUTE_IMAGE}${profile_image}`
//       : null,
//   });
// }}

                
              
//             >
//               <Image
//                 source={
//                   chatType === 'single' && profile_image
//                     ? { uri: `${API_ROUTE_IMAGE}${profile_image}` }
//                     : FALLBACK_AVATAR
//                 }
//                 style={styles.headerAvatar}
//               />
//               <Text style={styles.headerName}>{name.slice(0,16)+'...'}</Text>
//             </TouchableOpacity>
//             <View
//               style={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignContent: 'center',
//                 alignItems: 'center',
//                 marginTop: -20,
//               }}
//             >
//               <TouchableOpacity
               
//               onPress={()=>(  

//                   // console.log('user___id', receiverId),
//                   // console.log('user___name', name)
//                   navigation.navigate('BusinessVoiceCall', {
//                     receiverId,
//                     isCaller: true,
//                     name: name,
//                     roomId: 'unique-room-id'
//                   })
//                   // navigation.navigate('Broadcast')
                  
                 
//                 )}
//                 style={[styles.headerButton, { marginTop: 0 }]}
//               >
//                 <Icon name="call" size={24} color="#FFF" />
//               </TouchableOpacity>
              
//             </View>
//           </View>
//         </LinearGradient>

//         {/* <ScrollView> */}
//           <FlatList
//           ref={flatListRef}
//           data={[...pendingMessages, ...messages]}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id.toString()}
//           inverted
//           contentContainerStyle={styles.chatContent}
//           keyboardShouldPersistTaps="handled"
//         scrollEnabled={true}
//         />
//         {/* </ScrollView> */}

//         {replyToMessage && (
//           <View style={styles.replyPreview}>
//             <View style={styles.replyPreviewContent}>
//               <Text style={styles.replyPreviewUsername}>~ replying {name}</Text>
//               <Text style={styles.replyPreviewText} numberOfLines={1}>
//                 {replyToMessage.content || (replyToMessage.emoji ? replyToMessage.emoji : 'Media')}
//               </Text>
//             </View>
//             <TouchableOpacity onPress={() => setReplyToMessage(null)}>
//               <Icon name="close" size={20} color="#999" />
//             </TouchableOpacity>
//           </View>
//         )}

//         <View style={styles.footer}>
//           <TouchableOpacity
//             onPress={() => setModalVisible(true)}
//             style={styles.attachButton}
//           >
//             <Icon name="attach-file" size={27} color="#0d64dd" />
//           </TouchableOpacity>
//           <TextInput
//             style={styles.input}
//             placeholder="Type a message..."
//             placeholderTextColor="#999"
//             value={text}
//             onChangeText={setText}
//             multiline
//           />
//           {text.trim().length > 0 ? (
//   <TouchableOpacity
//     onPress={() => sendMessage(text)}
//     style={styles.sendButton}
//   >
//     <Icon name="send" size={24} color="#0d64dd" />
//   </TouchableOpacity>
// ) : (
//   <View style={styles.voiceButtonContainer}>
//     <TouchableOpacity
//       onPress={async () => {
//         if (recording) {
//           await onStopRecord();
//         } else {
//           await onStartRecord();
//         }
//       }}
//       style={[styles.micButton, recording && styles.recordingMic]}
//     >
//       <Icon name={recording ? "stop" : "mic"} size={24} color={recording ? '#FFF' : '#0d64dd'} />
//     </TouchableOpacity>
//     {recording && (
//       <View style={styles.recordingContainer}>
//         <View style={styles.recordingWave}>
//           {Array(5).fill().map((_, i) => (
//             <View 
//               key={i}
//               style={[
//                 styles.waveBar,
//                 { 
//                   height: Math.random() * 20 + 5,
//                   backgroundColor: '#0d64dd'
//                 }
//               ]}
//             />
//           ))}
//         </View>
//         <Text style={styles.recordTime}>
//           {Math.floor(recordSecs / 1000)}s
//         </Text>
//       </View>
//     )}
//   </View>
// )}
//         </View>

//         <Modal
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//             <View style={styles.modalOverlay} />
//           </TouchableWithoutFeedback>
//           <View style={styles.modalContent}>
//             <FlatList
//               data={options}
//               keyExtractor={(item) => item.id}
//               numColumns={2}
//               contentContainerStyle={styles.modalOptions}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.optionButton}
//                   onPress={() => {
//                     if (item.label === 'Camera') pickImage(true);
//                     else if (item.label === 'Gallery') pickImage(false);
//                     else if (item.label === 'Document') pickFile();
//                     else if (item.label === 'Emoji') {
//                       setEmojiPickerVisible(true);
//                       setModalVisible(false);
//                     }
//                   }}
//                 >
//                   <View
//                     style={[styles.optionIconContainer, { backgroundColor: item.lightColor }]}
//                   >
//                     <Icon name={item.icon} size={24} color={item.color} />
//                   </View>
//                   <Text style={styles.optionLabel}>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </Modal>

//         <Modal
//           transparent={true}
//           visible={isImageLoading}
//           onRequestClose={() => {}}
//         >
//           <View style={styles.loadingModalOverlay}>
//             <View style={styles.loadingModalContent}>
//               <ActivityIndicator size="large" color="#0d64dd" />
//             </View>
//           </View>
//         </Modal>
//         {contextMenu.visible && (
//   <View style={[
//     styles.contextMenuContainer, 
//     {
//       top: contextMenu.position.y - 50,
//       left: Math.max(10, Math.min(contextMenu.position.x - 100, Dimensions.get('window').width - 220)),
//     }
//   ]}>
//     {/* Delete Option (only for user's messages) */}
//     {contextMenu.message?.user_id === userId && !contextMenu.message?.is_deleted && (
//       <>
//         <TouchableOpacity 
//           style={styles.contextMenuItem}
//           onPress={() => {
//             deleteMessage(contextMenu.message.id);
//             setContextMenu({ visible: false, message: null });
//           }}
//           activeOpacity={0.6}
//         >
//           <View style={styles.contextMenuIcon}>
//             <Icon name="delete" size={20} color="#ff4444" />
//           </View>
//           <Text style={[styles.contextMenuText, { color: '#ff4444' }]}>Delete</Text>
//         </TouchableOpacity>
        
//         {/* Divider */}
//         <View style={styles.contextMenuDivider} />
        
//         {/* Cancel Option */}
//         <TouchableOpacity 
//           style={styles.contextMenuItem}
//           onPress={() => setContextMenu({ visible: false, message: null })}
//           activeOpacity={0.6}
//         >
//           <View style={styles.contextMenuIcon}>
//             <Icon name="close" size={20} color="#666" />
//           </View>
//           <Text style={styles.contextMenuText}>Cancel</Text>
//         </TouchableOpacity>
//       </>
//     )}
//   </View>
// )}

//         <Modal
//           transparent={true}
//           visible={imagePreviewModalVisible}
//           onRequestClose={() => setImagePreviewModalVisible(false)}
//         >
//           <View style={styles.imagePreviewModalOverlay}>
//             <View style={styles.imagePreviewModalContent}>
//               <View style={styles.imagePreviewHeader}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setImagePreviewModalVisible(false);
//                     setSelectedImage(null);
//                     setText('');
//                   }}
//                 >
//                   <Icon name="close" size={24} color="#FFF" />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => sendMessage(text)}
//                   style={styles.imagePreviewSendButton}
//                 >
//                   <Icon name="send" size={24} color="#0d64dd" />
//                 </TouchableOpacity>
//               </View>
//               {selectedImage && (
//                 <Image
//                   source={{ uri: selectedImage.uri }}
//                   style={styles.imagePreviewImage}
//                   resizeMode="contain"
//                 />
//               )}
//               <TextInput
//                 style={styles.imagePreviewInput}
//                 placeholder="Add a caption..."
//                 placeholderTextColor="#999"
//                 value={text}
//                 onChangeText={setText}
//                 multiline
//               />
//             </View>
//           </View>
//         </Modal>

//         <Modal
//           transparent={true}
//           visible={emojiPickerVisible}
//           onRequestClose={() => setEmojiPickerVisible(false)}
//         >
//           <TouchableWithoutFeedback onPress={() => setEmojiPickerVisible(false)}>
//             <View style={styles.modalOverlay}>
//               <View style={styles.emojiPickerContainer}>
//                 <EmojiSelector onEmojiSelected={selectEmoji} />
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
// <Modal
//   transparent={true}
//   visible={!!userPopup}
//   onRequestClose={() => setUserPopup(null)}
// >
//   <TouchableWithoutFeedback onPress={() => setUserPopup(null)}>
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.6)",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 20,
//       }}
//     >
//       <View
//         style={{
//           backgroundColor: "#fff",
//           borderRadius: 20,
//           padding: 20,
//           width: "90%",
//           alignItems: "center",
//           elevation: 5,
//         }}
//       >
//         {/* Avatar */}
//         <Image
//           source={
//             userPopup?.avatar
//               ? { uri: userPopup.avatar }
//               : FALLBACK_AVATAR
//           }
//           style={{
//             width: 100,
//             height: 100,
//             borderRadius: 50,
//             marginBottom: 15,
//           }}
//         />

//         {/* Username */}
//         <Text
//           style={{
//             fontSize: 20,
//             fontWeight: "600",
//             color: "#111",
//           }}
//         >
//           {userPopup?.username || "Unknown"}
//         </Text>

//         {/* Email */}
//         {userPopup?.email && (
//           <Text
//             style={{
//               fontSize: 14,
//               color: "#555",
//               marginTop: 5,
//               marginBottom: 15,
//             }}
//           >
//             {userPopup.email}
//           </Text>
//         )}

//         {/* Action Icons */}
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-around",
//             width: "100%",
//             marginVertical: 15,
//           }}
//         >
//           {/* Chat */}
//           <TouchableOpacity
//             onPress={() => setUserPopup(false)}
//             style={{ alignItems: "center", borderColor:'grey', borderWidth:1, padding:10,borderRadius:10, width:80, height:80}}
//           >
//             <Icon name="chat" size={28} color="#25D366" />
//             <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
//               Chat
//             </Text>
//           </TouchableOpacity>

//           {/* Call */}
//           <TouchableOpacity

//           onPress={() =>
//                    navigation.navigate('BusinessVoiceCalls', {
//                     receiverId,
//                     isCaller: true,
//                     name: name,
//                     roomId: 'unique-room-id'
//                   })
//                 }


            
//             style={{ alignItems: "center", borderColor:'grey', borderWidth:1, padding:10,borderRadius:10, width:80, height:80}}
//           >
//             <Icon name="phone" size={28} color="#34B7F1" />
//             <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
//               Call
//             </Text>
//           </TouchableOpacity>

//           {/* Video Call */}
//           <TouchableOpacity
//           onPress={() =>
//                   navigation.navigate('CallOngoingScreen', {
//                     type: 'video',
//                     receiverId,
//                     profile_image,
//                     name,
//                   })
//                 }
//            style={{ alignItems: "center", borderColor:'grey', borderWidth:1, padding:10,borderRadius:10, width:80, height:80}}
//           >
//             <Icoon name="video" size={28} color="#FF6D00" />
//             <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
//               Video
//             </Text>
//           </TouchableOpacity>

//           {/* Email */}
//           {userPopup?.email && (
//             <TouchableOpacity
//               onPress={() => handleEmail(userPopup?.email)}
//               style={{ alignItems: "center" }}
//             >
//               <Icon name="email" size={28} color="#9C27B0" />
//               <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
//                 Email
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Cancel */}
//         <TouchableOpacity
//           style={{
//             marginTop: 10,
//             paddingVertical: 10,
//             paddingHorizontal: 20,
//             borderRadius: 8,
//             backgroundColor: "#eee",
//           }}
//           onPress={() => setUserPopup(null)}
//         >
//           <Text style={{ color: "#333", fontSize: 16 }}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </TouchableWithoutFeedback>
// </Modal>


//         {/* <Modal
//           transparent={true}
//           visible={!!userPopup}
//           onRequestClose={() => setUserPopup(null)}
//         >
//           <TouchableWithoutFeedback onPress={() => setUserPopup(null)}>
//             <View style={styles.userModalOverlay}>
//               <View style={styles.userModalContent}>
//                 <Image
//                   source={userPopup?.avatar ? { uri: userPopup.avatar } : FALLBACK_AVATAR}
//                   style={styles.userModalAvatar}
//                 />
//                 <Text style={[styles.userModalUsername, {color:'#333'}]}>
//                   {userPopup?.username || 'Unknown'}
//                 </Text>
//                 <View style={styles.userModalButtons}>
//                   <TouchableOpacity
//                     style={styles.userModalButton}
//                     onPress={() => setUserPopup(null)}
//                   >
//                     <Text style={[styles.userModalButtonText, {color:'#333'}]}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.userModalButton, styles.userModalChatButton]}
//                     onPress={() => handleChatPrivate(userPopup?.username)}
//                   >
//                     <Text style={styles.userModalButtonText}>Chat</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.userModalButton, styles.userModalChatButton]}
//                     onPress={() => handleChatPrivate(userPopup?.username)}
//                   >
//                     <Text style={styles.userModalButtonText}>Chat</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal> */}
//         <Modal
//   transparent={true}
//   visible={filePreviewModalVisible}
//   onRequestClose={() => setFilePreviewModalVisible(false)}
// >
//   <View style={styles.filePreviewModalOverlay}>
//     <View style={styles.filePreviewModalContent}>
//       <View style={styles.filePreviewHeader}>
//         <TouchableOpacity
//           onPress={() => {
//             setFilePreviewModalVisible(false);
//             setSelectedFile(null);
//           }}
//         >
//           <Icon name="close" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             sendMessage(fileCaption);
//             setFilePreviewModalVisible(false);
//           }}
//           style={styles.filePreviewSendButton}
//         >
//           <Icon name="send" size={24} color="#0d64dd" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.filePreview}>
//         <Icon name="insert-drive-file" size={60} color="#0d64dd" />
//         <Text style={styles.fileName} numberOfLines={1}>
//           {selectedFile?.name}
//         </Text>
//       </View>
//       <TextInput
//         style={styles.filePreviewInput}
//         placeholder="Add a caption..."
//         placeholderTextColor="#999"
//         value={fileCaption}
//         onChangeText={setFileCaption}
//         multiline
//       />
//     </View>
//   </View>
// </Modal>
//       </KeyboardAvoidingView>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
    
//     //backgroundColor: '#f7f3efff',
    
//   },
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 44 : 24,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding:10
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
// messageContainer: {
//   flexDirection: 'row',
//   marginVertical: 2,
//   marginHorizontal: 8,
//   alignItems: 'flex-end',
// },
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
//   flex: 1,
//   backgroundColor: '#000',
// },
// filePreviewModalContent: {
//   flex: 1,
//   padding: 16,
// },
// filePreviewHeader: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   paddingVertical: 8,
// },
// filePreviewSendButton: {
//   padding: 8,
// },
// filePreview: {
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginVertical: 20,
// },
// filePreviewInput: {
//   backgroundColor: '#333',
//   borderRadius: 12,
//   padding: 12,
//   color: '#FFF',
//   fontSize: 16,
// },
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
//  swipeReply: {
//   backgroundColor: '#E8ECEF',
//   justifyContent: 'center',
//   alignItems: 'center',
//   width: 60,
//   marginRight: 8, // Change this to marginLeft if needed
// },
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
//     paddingVertical: 8,
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
//   micButton: {
//     padding: 8,
//     alignSelf: 'center',
//     borderRadius: 20,
//     backgroundColor: '#FFF',
//   },
//   recordingMic: {
//     backgroundColor: '#0d64dd',
//   },
//   recordTime: {
//     position: 'absolute',
//     top: -20,
//     fontSize: 12,
//     color: '#0d64dd',
//     fontWeight: 'bold',
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
//   loadingModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingModalContent: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 20,
//   },
//   imagePreviewModalOverlay: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   imagePreviewModalContent: {
//     flex: 1,
//     padding: 16,
//   },
//   imagePreviewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   imagePreviewSendButton: {
//     padding: 8,
//   },
//   imagePreviewImage: {
//     width: '100%',
//     height: '70%',
//     marginVertical: 8,
//   },
//   imagePreviewInput: {
//     backgroundColor: '#333',
//     borderRadius: 12,
//     padding: 12,
//     color: '#FFF',
//     fontSize: 16,
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
//   moreMenuContainer: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 80 : 60,
//     right: 16,
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     width: 200,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   moreMenuContent: {
//     paddingVertical: 8,
//   },
//   moreMenuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//   },
//   moreMenuLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#128C7E',
//   },
//   moreMenuDescription: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 4,
//   },
//   userModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   userModalContent: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 20,
//     width: '80%',
//     alignItems: 'center',
//   },
//   userModalAvatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 16,
//   },
//   userModalUsername: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#128C7E',
//     marginBottom: 16,
//   },
//   userModalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   userModalButton: {
//     flex: 1,
//     padding: 12,
//     marginHorizontal: 4,
//     borderRadius: 8,
//     alignItems: 'center',
//     backgroundColor: '#F0F0F0',
//   },
//   userModalChatButton: {
//     backgroundColor: '#0d64dd',
//   },
//   userModalButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#FFF',
//   },
//   audioContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     padding: 8,
//     marginBottom: 4,
//     width: 220,
//   },
//   audioPlayButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#0d64dd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   audioProgress: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   waveformStatic: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   waveformBar: {
//     width: 2,
//     marginHorizontal: 1,
//     borderRadius: 1,
//   },
//   audioTime: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },

//   voiceButtonContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// recordingContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   backgroundColor: 'rgba(13, 100, 221, 0.1)',
//   borderRadius: 20,
//   paddingHorizontal: 12,
//   marginLeft: 8,
// },
// recordingWave: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   height: 30,
//   marginRight: 8,
// },
// waveBar: {
//   width: 2,
//   marginHorizontal: 2,
//   borderRadius: 1,
// },
// ////// handle delete
// contextMenuContainer: {
//   position: 'absolute',
//   backgroundColor: '#FFF',
//   borderRadius: 12,
//   paddingVertical: 8,
//   width: 200,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.25,
//   shadowRadius: 8,
//   elevation: 5,
//   zIndex: 1000,
// },
// contextMenuItem: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   paddingVertical: 12,
//   paddingHorizontal: 16,
// },
// contextMenuIcon: {
//   width: 24,
//   alignItems: 'center',
//   marginRight: 12,
// },
// contextMenuText: {
//   fontSize: 16,
//   color: '#333',
// },
// contextMenuDivider: {
//   height: 1,
//   backgroundColor: '#f0f0f0',
//   marginVertical: 4,
// },
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
} from 'react-native';
import Icoon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick, isCancel } from '@react-native-documents/picker';
import EmojiSelector from 'react-native-emoji-selector';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';
// const audioRecorderPlayer = new AudioRecorderPlayer();
const axiosInstance = axios.create({
  baseURL: 'https://showa.essential.com.ng/api/showa',
  timeout: 10000,
});
const options = [
  { id: '1', icon: 'camera-alt', label: 'Camera', color: '#0d64dd', lightColor: '#E8F5E9' },
  { id: '2', icon: 'photo', label: 'Gallery', color: '#0d64dd', lightColor: '#E8F5E9' },
  { id: '3', icon: 'insert-drive-file', label: 'Document', color: '#0d64dd', lightColor: '#E8F5E9' },
  { id: '4', icon: 'emoji-emotions', label: 'Emoji', color: '#0d64dd', lightColor: '#E8F5E9' },
];
export default function PersonalPrivateChatScreen({ route, navigation }) {
  const { chatType, receiverId, groupSlug, name, profile_image } = route.params;
  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreviewModalVisible, setImagePreviewModalVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  // const [recording, setRecording] = useState(false);
  // const [recordSecs, setRecordSecs] = useState(0);
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [userPopup, setUserPopup] = useState(null);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [accountMode, setAccountMode] = useState('business')
  const [filePreviewModalVisible, setFilePreviewModalVisible] = useState(false);
  const [fileCaption, setFileCaption] = useState('');
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  ]);
  const [chatBackground, setChatBackground] = useState(null);
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
      console.log('Loaded wallpaper data:', background);
      
      if (background) {
        const parsed = JSON.parse(background);
        console.log('Parsed wallpaper data:', parsed);
        setChatBackground(parsed);
      } else {
        console.log('No wallpaper saved, using default');
      }
    } catch (error) {
      console.error('Error loading chat background:', error);
    }
  };
  
  loadBackground();
}, []);
useEffect(() => {
  const backAction = () => {
  navigation.goBack();
    return true;
  };
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction
  );
  return () => backHandler.remove();
}, [navigation]);
  const flatListRef = useRef();
  const ws = useRef(null);
  const timeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
 useEffect(() => {
  const loadMode = async () => {
    try {
      const mode = 'business';
      //console.log('account_mode', mode);
      setAccountMode(mode);
    } catch (error) {
      //console.error('Error loading account mode:', error);
      setAccountMode('business');
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
      alert('Please log in to perform this action');
      //navigation.navigate('Login');
      return;
    }
    //console.log('Sending delete request with token:', token);
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
    // Update state
    setMessages(prev => prev.map(msg =>
      msg.id === messageId.toString() ? {...msg, is_deleted: true} : msg
    ));
    setPendingMessages(prev => prev.map(msg =>
      msg.id === messageId.toString() ? {...msg, is_deleted: true} : msg
    ));
  } catch (error) {
    //console.error('Delete error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
      //navigation.navigate('Login');
    } else {
      alert(error.response?.data?.error || 'Failed to delete message');
    }
  }
};
  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');
  const saveMessagesToStorage = async (messagesToSave) => {
    try {
      const limitedMessages = messagesToSave.slice(0, 100);
      const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(limitedMessages));
    } catch (error) {
      //console.error('Error saving messages to AsyncStorage:', error);
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
      //console.error('Error loading messages from AsyncStorage:', error);
    }
  };
  const redirectBack = () => {
    navigation.navigate('BusinessHome');
  };
  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;
      if (!token || !parsed?.id) {
        //console.error('Missing token or userID');
        alert('Please log in again.');
        //navigation.navigate('Login');
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
     // console.error('Error fetching user:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        //navigation.navigate('Login');
      }
      setUserProfileImage(null);
      return null;
    }
  }, [navigation]);
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
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.data?.code === 'token_not_valid' && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
         // navigation.navigate('Login');
          return Promise.reject(error);
        }
        try {
          const { data } = await axios.post(`${API_ROUTE}auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = data.access;
          await AsyncStorage.setItem('userToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
        // console.error('Refresh error:', refreshError.response?.data || refreshError);
          await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
          navigation.navigate('Login');
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  const fetchChatHistory = useCallback(async (chatType, receiverId, groupSlug, userId) => {
    if (!userId) {
      //console.error('No userId available for fetching chat history');
      return;
    }
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
     // console.error('No access token found');
      //navigation.navigate('Login');
      return;
    }
    try {
      let url = `/api/chat/?chat_type=${chatType}&account_mode=${accountMode}`;
      if (chatType === 'single' && receiverId) {
        url += `&receiver=${receiverId}`;
      } else if (chatType === 'group' && groupSlug) {
        url += `&group_slug=${groupSlug}`;
      } else {
        //console.error('Invalid chat type or missing parameters');
        navigation.navigate('BusinessHome');
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
        audio: msg.audio ? `${API_ROUTE_IMAGE}${msg.audio}` : null,
        emoji: msg.emoji || null,
        reply_to: msg.reply_to ? msg.reply_to.toString() : null,
        is_deleted: msg.is_deleted || false,
        timestamp: msg.timestamp,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
      }));
      // Deduplicate messages by ID
      const uniqueMessages = [];
      const messageIds = new Set();
      history.forEach((msg) => {
        if (!messageIds.has(msg.id)) {
          messageIds.add(msg.id);
          uniqueMessages.push(msg);
        }
      });
      // Reverse the order so latest is at the bottom
//const reversedMessages = uniqueMessages.reverse();
// setMessages(reversedMessages);
// saveMessagesToStorage(reversedMessages);
 setMessages(uniqueMessages);
  saveMessagesToStorage(uniqueMessages);
     
    } catch (error) {
     // console.error('Error fetching chat history:', error.response?.data || error.message);
    }
  }, [navigation]);
  // Replace your current useFocus with this:
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
        //console.error('Error in focus effect:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
      // Don't close WebSocket here - we want it to stay connected
      clearTimeout(timeoutRef.current);
    };
  }, [fetchUserData, fetchChatHistory, chatType, receiverId, groupSlug, accountMode])
);
// Add this to handle updates when app is in background
useEffect(() => {
  const interval = setInterval(() => {
    if (userId) {
      fetchChatHistory(chatType, receiverId, groupSlug, userId);
    }
  }, 30000); // Check for new messages every 30 seconds
  return () => clearInterval(interval);
}, [userId, chatType, receiverId, groupSlug, fetchChatHistory]);
  // useEffect(() => {
  // let isMounted = true;
  // setIsLoading(true);
  // fetchUserData().then((id) => {
  // if (id && isMounted) {
  // loadMessagesFromStorage();
  // fetchChatHistory(chatType, receiverId, groupSlug, id);
  // }
  // if (isMounted) setIsLoading(false);
  // });
  // return () => {
  // isMounted = false;
  // if (ws.current) {
  // ws.current.close();
  // ws.current = null;
  // }
  // clearTimeout(timeoutRef.current);
  // };
  // }, [fetchUserData, fetchChatHistory, chatType, receiverId, groupSlug, accountMode]);
  useEffect(() => {
  const connectWebSocket = async () => {
    if (!accountMode) {
     // console.warn('accountMode not set, delaying WebSocket connection');
      return;
    }
    if (reconnectAttempts >= maxReconnectAttempts) {
      //console.error('Max WebSocket reconnect attempts reached');
      return;
    }
    const token = await AsyncStorage.getItem('userToken');
    if (!token || !userId) {
     // console.error('No token or user ID found');
      //navigation.navigate('Login');
      return;
    }
    const encodedToken = encodeURIComponent(token);
    let wsUrl;
    if (chatType === 'single') {
      wsUrl = `ws://showa.essential.com.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`;
    } else {
      wsUrl = `ws://showa.essential.com.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;
    }
    ws.current = new WebSocket(wsUrl);
    ws.current.onopen = () => {
     // console.log('WebSocket connected successfully');
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
            audio: data.message.audio ? `${API_ROUTE_IMAGE}${data.message.audio}` : null,
            emoji: data.message.emoji || null,
            reply_to: data.message.reply_to ? data.message.reply_to.toString() : null,
            is_deleted: data.message.is_deleted || false,
           
            timestamp: data.message.timestamp,
            time: new Date(data.message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
          };
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === newMessage.id)) {
              return prev;
            }
            setPendingMessages((pending) => {
              const filtered = pending.filter((msg) => {
                const isSameContent = msg.content && msg.content === newMessage.content;
                const isSameImage = msg.image && newMessage.image && msg.image.includes(newMessage.image?.split('/').pop());
                const isSameFile = msg.file && newMessage.file && msg.file.includes(newMessage.file?.split('/').pop());
                const isSameAudio = msg.audio && newMessage.audio && msg.audio.includes(newMessage.audio?.split('/').pop());
                const isSameEmoji = msg.emoji && msg.emoji === newMessage.emoji;
                return !(isSameContent || isSameImage || isSameFile || isSameAudio || isSameEmoji);
              });
              return filtered;
            });
            const updatedMessages = [newMessage, ...prev];
            saveMessagesToStorage(updatedMessages);
            setTimeout(() => {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
            }, 50);
            return updatedMessages;
          });
        }
      } catch (e) {
       // console.error('Error parsing WebSocket message:', e);
      }
    };
    ws.current.onerror = (error) => {
      //console.error('WebSocket error:', error);
      setIsWebSocketOpen(false);
    };
    ws.current.onclose = () => {
      //console.log('WebSocket closed');
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
}, [userId, chatType, receiverId, groupSlug, reconnectAttempts, username, userProfileImage, navigation, accountMode]);
  const checkCameraPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const result = await check(permission);
    if (result === RESULTS.GRANTED) return true;
    const requestResult = await request(permission);
    return requestResult === RESULTS.GRANTED;
  };
  const checkPhotoPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const result = await check(permission);
    if (result === RESULTS.GRANTED) return true;
    const requestResult = await request(permission);
    return requestResult === RESULTS.GRANTED;
  };
  const pickImage = async (useCamera = false) => {
    setModalVisible(false);
    try {
      const hasPermission = useCamera ? await checkCameraPermission() : await checkPhotoPermission();
      if (!hasPermission) {
        alert('Permission denied');
        return;
      }
      setIsImageLoading(true);
      const pickerFunction = useCamera ? launchCamera : launchImageLibrary;
      const result = await pickerFunction({ mediaType: 'photo', quality: 0.7 });
      setIsImageLoading(false);
      if (!result.didCancel && result.assets) {
        setSelectedImage(result.assets[0]);
        setImagePreviewModalVisible(true);
      }
    } catch (error) {
      setIsImageLoading(false);
      //console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };
  // const pickFile = async () => {
  // setModalVisible(false);
  // try {
  // const result = await DocumentPicker.pick({
  // type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
  // });
  // setSelectedFile(result[0]);
  // sendMessage('');
  // } catch (error) {
  // if (DocumentPicker.isCancel(error)) {
  // console.log('File picking cancelled');
  // } else {
  // console.error('Error picking file:', error);
  // alert('Failed to pick file');
  // }
  // }
  // };
  const pickFile = async () => {
  setModalVisible(false);
  try {
    const result = await pick({
  allowMultiSelection: false,
  presentationStyle: 'fullScreen',
  copyTo: 'cachesDirectory',
  type: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/*',
  ],
});
    setSelectedFile(result[0]);
    setFileCaption(''); // Reset caption
    setFilePreviewModalVisible(true); // Show caption modal
  } catch (error) {
    if (!isCancel(error)) {
     // console.log('File picking cancelled');
    } else {
      //console.error('Error picking file:', error);
      alert('Failed to pick file');
    }
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
       // console.error('Error loading chat background:', error);
      }
    };
    loadBackground();
  });
  return unsubscribe;
}, [navigation]);
  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false);
    sendMessage('');
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
      style.marginRight= 8;
      style.borderBottomRightRadius = 2;
    } else {
      style.backgroundColor = '#FFFFFF';
      style.marginLeft= 8;
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
  // const VisualizedAudioPlayer = ({ audioUrl }) => {
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [duration, setDuration] = useState(0);
  //   const [currentPosition, setCurrentPosition] = useState(0);
  //   const startPlayback = async () => {
  //     try {
  //       await audioRecorderPlayer.startPlayer(audioUrl);
  //       setIsPlaying(true);
  //       audioRecorderPlayer.addPlayBackListener((e) => {
  //         setCurrentPosition(e.currentPosition);
  //         setDuration(e.duration);
  //         if (e.currentPosition >= e.duration) {
  //           setIsPlaying(false);
  //           audioRecorderPlayer.stopPlayer();
  //           setCurrentPosition(0);
  //         }
  //       });
  //     } catch (err) {
  //       //console.error('Error playing audio:', err);
  //       alert('Failed to play audio');
  //     }
  //   };
  //   const stopPlayback = async () => {
  //     try {
  //       await audioRecorderPlayer.stopPlayer();
  //       setIsPlaying(false);
  //     } catch (err) {
  //      // console.error('Error stopping audio:', err);
  //     }
  //   };
  //   const formatTime = (ms) => {
  //     const seconds = Math.floor(ms / 1000);
  //     const minutes = Math.floor(seconds / 60);
  //     const remainingSeconds = seconds % 60;
  //     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  //   };
  //   return (
  //     <View style={styles.audioContainer}>
  //       <TouchableOpacity
  //         onPress={isPlaying ? stopPlayback : startPlayback}
  //         style={styles.audioPlayButton}
  //       >
  //         <Icon
  //           name={isPlaying ? 'pause' : 'play-arrow'}
  //           size={20}
  //           color="#FFFFFF"
  //         />
  //       </TouchableOpacity>
  //       <View style={styles.audioProgress}>
  //         <View style={styles.waveformStatic}>
  //           {Array(40)
  //             .fill()
  //             .map((_, index) => (
  //               <View
  //                 key={index}
  //                 style={[
  //                   styles.waveformBar,
  //                   {
  //                     height: isPlaying ? Math.random() * 12 + 4 : 8,
  //                     backgroundColor: isPlaying ? '#0d64dd' : '#B0BEC5',
  //                   },
  //                 ]}
  //               />
  //             ))}
  //         </View>
  //         <Text style={styles.audioTime}>
  //           {formatTime(currentPosition)} / {formatTime(duration)}
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };
  const renderMessage = ({ item, index }) => {
   
    if (!userId) {
      return null;
    }
    const isMyMessage = item.user_id === userId;
    const avatarSource = item.avatar ? { uri: item.avatar } : FALLBACK_AVATAR;
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
  rightThreshold={40}>
        <TouchableOpacity
          onPress={() => handleMessageSelect(item)}
          //onLongPress={() => handleMessageSelect(item)}
          onLongPress={(e) => {
          if (item.user_id === userId && !item.is_deleted) {
            setContextMenu({
              visible: true,
              message: item,
              position: { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY },
            });
          }
        }}
          activeOpacity={0.9}
          //delayLongPress={300}
        >
          <View
            style={[
              styles.messageContainer,
              isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
            ]}
          >
            {!isMyMessage && (
              <TouchableOpacity
                onPress={() => setUserPopup({ username: item.user, avatar: item.avatar,email: item.email, verify:item.verify, detail:item })}
              >
                <Image
                  source={
                    chatType === 'single' && profile_image
                      ? { uri: `${API_ROUTE_IMAGE}${profile_image}` }
                      : FALLBACK_AVATAR
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>
            )}
            <View style={getBubbleStyle(item, index, messages)}>
              {repliedToMessage && (
                <View style={styles.replyContainer}>
                  <Text style={styles.replyUsername}>{name}</Text>
                  <Text style={styles.replyContent} numberOfLines={1}>
                    {repliedToMessage.content || (repliedToMessage.emoji ? repliedToMessage.emoji : 'Media')}
                  </Text>
                </View>
              )}
              {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
              {item.file && (
                <TouchableOpacity
                  style={styles.fileContainer}
                  onPress={() => Linking.openURL(item.file).catch(() => alert('Cannot open file'))}
                >
                  <Icon name="insert-drive-file" size={20} color="#128C7E" />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.file.split('/').pop()}
                  </Text>
                </TouchableOpacity>
              )}
              {/* {item.audio && <VisualizedAudioPlayer audioUrl={item.audio} />} */}
              {item.emoji && <Text style={styles.emojiMessage}>{item.emoji}</Text>}
              {item.content && (
                <Text style={[styles.messageText, isMyMessage && { color: '#FFF' }]}>{item.content}</Text>
              )}
              <View style={styles.messageFooter}>
                <Text style={styles.timeText}>{item.time}</Text>
                {isMyMessage && (
                  <Icon
                    name={item.id.startsWith('m') ? 'access-time' : 'done-all'}
                    size={12}
                    color={item.id.startsWith('m') ? '#999' : '#0d64dd'}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  const logFormData = (formData) => {
    const data = {};
    formData._parts.forEach(([key, value]) => {
      if (typeof value === 'object' && value.uri) {
        data[key] = { uri: value.uri, type: value.type, name: value.name };
      } else {
        data[key] = value;
      }
    });
    console.log('Sending FormData:', JSON.stringify(data, null, 2));
  };
  const sendMessage = async (caption = '') => {
  // if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji && !recording) {
  if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji) {
    return;
  }
  if (!accountMode) {
    //console.error('accountMode is not set');
    alert('Account mode not set. Please try again.');
    return;
  }
  const formData = new FormData();
  if (caption.trim()) formData.append('content', caption.trim());
  if (selectedEmoji) formData.append('emoji', selectedEmoji);
  if (replyToMessage) formData.append('reply_to', replyToMessage.id);
  if (selectedImage) {
    if (!selectedImage.uri || !selectedImage.type) {
      alert('Invalid image selected');
      return;
    }
    formData.append('image', {
      uri: selectedImage.uri,
      type: selectedImage.type,
      name: selectedImage.fileName || 'image.jpg',
    });
  }
  if (selectedFile) {
    formData.append('content', fileCaption || '');
    if (!selectedFile.uri || !selectedFile.type) {
      alert('Invalid file selected');
      return;
    }
    formData.append('file', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });
  }
  formData.append('chat_type', chatType);
  formData.append('account_mode', accountMode);
  if (chatType === 'single') {
    formData.append('receiver', receiverId);
  } else {
    formData.append('group_slug', groupSlug);
  }
  const tempId = 'm' + Date.now();
  if (selectedImage || selectedFile || selectedEmoji || caption.trim()) {
    setPendingMessages((prev) => [
      {
        id: tempId,
        user: username,
        user_id: userId,
        content: caption.trim() || null,
        image: selectedImage ? selectedImage.uri : null,
        file: selectedFile ? selectedFile.uri : null,
        // audio: null,
        emoji: selectedEmoji || null,
        reply_to: replyToMessage ? replyToMessage.id : null,
        is_deleted: false,
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: userProfileImage || null,
      },
      ...prev,
    ]);
  }
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No access token found. Please log in again.');
    }
    let success = false;
    if (selectedImage || selectedFile || (!caption.trim() && !selectedEmoji)) {
      logFormData(formData);
      const response = await axiosInstance.post(`/api/chat/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      success = true;
    } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const msg = {
        action: 'send',
        content: caption.trim() || null,
        emoji: selectedEmoji || null,
        reply_to: replyToMessage ? replyToMessage.id : null,
        chat_type: chatType,
        receiver_id: chatType === 'single' ? receiverId : null,
        group_slug: chatType === 'group' ? groupSlug : null,
        user_id: userId,
        account_mode: accountMode,
      };
      //console.log('Sending WebSocket message:', msg); // Debugging
      ws.current.send(JSON.stringify(msg));
      success = true;
    } else {
      logFormData(formData);
      const response = await axiosInstance.post(`/api/chat/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      success = true;
    }
    if (success) {
      setText('');
      setFileCaption('');
      setSelectedImage(null);
      setSelectedFile(null);
      setSelectedEmoji(null);
      setReplyToMessage(null);
      setImagePreviewModalVisible(false);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  } catch (error) {
    //console.error('Error sending message:', error.response?.data || error.message);
    setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    let errorMessage = 'Failed to send message';
    if (error.response) {
      errorMessage += `: ${error.response.data?.detail || JSON.stringify(error.response.data)}`;
      if (error.response.status === 401) {
        navigation.navigate('Login');
      }
    } else if (error.message.includes('Network Error')) {
      errorMessage += ': Check your network.';
    }
    alert(errorMessage);
  }
};
  // const onStartRecord = async () => {
  //   try {
  //     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
  //     const result = await check(permission);
  //     if (result !== RESULTS.GRANTED) {
  //       const requestResult = await request(permission);
  //       if (requestResult !== RESULTS.GRANTED) {
  //         alert('Microphone permission denied');
  //         return false;
  //       }
  //     }
  //     await audioRecorderPlayer.startRecorder();
  //     audioRecorderPlayer.addRecordBackListener((e) => {
  //       setRecordSecs(e.currentPosition);
  //     });
  //     setRecording(true);
  //     return true;
  //   } catch (err) {
  //     //console.error('Error starting recording:', err);
  //     alert('Failed to start recording');
  //     return false;
  //   }
  // };
  // const onStopRecord = async () => {
  //   try {
  //     const result = await audioRecorderPlayer.stopRecorder();
  //     audioRecorderPlayer.removeRecordBackListener();
  //     setRecordSecs(0);
  //     setRecording(false);
  //     if (!result) {
  //       throw new Error('No audio recorded');
  //     }
  //     const formData = new FormData();
  //     formData.append('audio', {
  //       uri: result,
  //       type: 'audio/m4a',
  //       name: result.split('/').pop() || 'audio.m4a',
  //     });
  //     if (replyToMessage) formData.append('reply_to', replyToMessage.id);
  //     formData.append('chat_type', chatType);
  //     if (chatType === 'single') {
  //       formData.append('receiver', receiverId);
  //     } else {
  //       formData.append('group_slug', groupSlug);
  //     }
  //     const tempId = 'm' + Date.now();
  //     setPendingMessages((prev) => [
  //       {
  //         id: tempId,
  //         user: username,
  //         user_id: userId,
  //         content: null,
  //         image: null,
  //         file: null,
  //         audio: result,
  //         emoji: null,
  //         reply_to: replyToMessage ? replyToMessage.id : null,
  //         is_deleted: false,
  //         timestamp: new Date().toISOString(),
  //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //         avatar: userProfileImage || null,
  //       },
  //       ...prev,
  //     ]);
  //     const token = await AsyncStorage.getItem('userToken');
  //     if (!token) {
  //       throw new Error('No access token found.');
  //     }
  //     logFormData(formData);
  //     const response = await axiosInstance.post(`/api/chat/`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     setReplyToMessage(null);
  //     flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  //   } catch (error) {
  //    // console.error('Error stopping recording:', error.response?.data || error.message);
  //     setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
  //     let errorMessage = 'Failed to send audio';
  //     if (error.response) {
  //       errorMessage += `: ${error.response.data?.detail || JSON.stringify(error.response.data)}`;
  //       if (error.response.status === 401) {
  //         //navigation.navigate('Login');
  //       }
  //     } else if (error.message.includes('Network Error')) {
  //       errorMessage += ': Check your network.';
  //     }
  //     alert(errorMessage);
  //   }
  // };
  const handleChatPrivate = (username) => {
    setUserPopup(null);
    alert(`Private chat with ${username} (not implemented)`);
  };
  // if (isLoading) {
  // return (
  // <View style={styles.loadingContainer}>
  // <ActivityIndicator size="large" color="#0d64dd" />
  // </View>
  // );
  // }
  return (
    <SafeAreaView style={{flex:1}}>
       <StatusBar
                    barStyle={Platform.OS === 'android'? 'light-content':'dark-content'}
                    translucent={Platform.OS === 'android'}
                    backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
                  />
            <ImageBackground
            source={getWallpaperSource(chatBackground)}
            style={[styles.container, {}]}
            resizeMode="cover"
          >
            <KeyboardAvoidingView
            nestedScrollEnabled={true}
              style={styles.container}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
              {/* <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={redirectBack}
                    style={[styles.headerButton, { marginTop: -20 }]}
                  >
                    <Icon name="arrow-back" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.headerProfile, { marginTop: -20 }]}
                  
                    onPress={() => {
      
        setUserPopup({
          username: name,
        
          avatar: profile_image
            ? `${API_ROUTE_IMAGE}${profile_image}`
            : null,
        });
      }}
                    
                  
                  >
                    <Image
                      source={
                        chatType === 'single' && profile_image
                          ? { uri: `${API_ROUTE_IMAGE}${profile_image}` }
                          : FALLBACK_AVATAR
                      }
                      style={styles.headerAvatar}
                    />
                    <Text style={styles.headerName}>{name.slice(0,16)+'...'}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignContent: 'center',
                      alignItems: 'center',
                      marginTop: -20,
                    }}
                  >
                    <TouchableOpacity
                    
                    onPress={()=>(
                        // console.log('user___id', receiverId),
                        // console.log('user___name', name)
                        navigation.navigate('BusinessVoiceCall', {
                          receiverId,
                          isCaller: true,
                          name: name,
                          roomId: 'unique-room-id'
                        })
                        // navigation.navigate('Broadcast')
                      
                      
                      )}
                      style={[styles.headerButton, { marginTop: 0 }]}
                    >
                      <Icon name="call" size={24} color="#FFF" />
                    </TouchableOpacity>
                  
                  </View>
                </View>
              </LinearGradient> */}
              <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',padding:15 }}>
                              <TouchableOpacity
                                onPress={redirectBack}
                                style={styles.headerButton}
                              >
                                <Icon name="arrow-back" size={24} color="#FFF" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.headerProfile}
                                onPress={() => {
                                  setUserPopup({
                                    username: name,
                                    avatar: profile_image ? `${API_ROUTE_IMAGE}${profile_image}` : null,
                                  });
                                }}
                              >
                                <Image
                                  source={
                                    chatType === 'single' && profile_image
                                      ? { uri: `${profile_image}` }
                                      : FALLBACK_AVATAR
                                  }
                                  style={styles.headerAvatar}
                                />
                                <Text style={styles.headerName}>{name.slice(0,16)+'...'}</Text>
                              </TouchableOpacity>
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('VoiceCalls', {
                                      targetUserId: receiverId,
                                      name: name,
                                      profile_image: profile_image,
                                      roomId: 'unique-room-id',
                                      isInitiator: true
                                    })
                                  }
                                  style={styles.headerButton}
                                >
                                  {/* <ion-icon name="videocam-outline"></ion-icon> */}
                                  <Icon name="call" size={24} color="#FFF" />
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('VideoCalls', {
                                      targetUserId: receiverId,
                                      name: name,
                                      profile_image: profile_image,
                                      roomId: 'unique-room-id',
                                      isInitiator: true
                                    })
                                  }
                                  style={[styles.headerButton, { marginTop: 0 }]}
                                >
                                  
                                  <Icon name="videocam" size={24} color="#FFF" />
                                  
                                </TouchableOpacity> */}
                              </View>
                            </View>
                          </LinearGradient>
              {/* <ScrollView> */}
                <FlatList
                ref={flatListRef}
                data={[...pendingMessages, ...messages]}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                inverted
                contentContainerStyle={styles.chatContent}
                keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
              />
              {/* </ScrollView> */}
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
                >
                  <Icon name="attach-file" size={27} color="#0d64dd" />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={setText}
                  multiline
                />
                {text.trim().length > 0 ? (
        <TouchableOpacity
          onPress={() => sendMessage(text)}
          style={styles.sendButton}
        >
          <Icon name="send" size={24} color="#0d64dd" />
        </TouchableOpacity>
      ) : (
        // <View style={styles.voiceButtonContainer}>
        //   <TouchableOpacity
        //     onPress={async () => {
        //       if (recording) {
        //         await onStopRecord();
        //       } else {
        //         await onStartRecord();
        //       }
        //     }}
        //     style={[styles.micButton, recording && styles.recordingMic]}
        //   >
        //     <Icon name={recording ? "stop" : "mic"} size={24} color={recording ? '#FFF' : '#0d64dd'} />
        //   </TouchableOpacity>
        //   {recording && (
        //     <View style={styles.recordingContainer}>
        //       <View style={styles.recordingWave}>
        //         {Array(5).fill().map((_, i) => (
        //           <View
        //             key={i}
        //             style={[
        //               styles.waveBar,
        //               {
        //                 height: Math.random() * 20 + 5,
        //                 backgroundColor: '#0d64dd'
        //               }
        //             ]}
        //           />
        //         ))}
        //       </View>
        //       <Text style={styles.recordTime}>
        //         {Math.floor(recordSecs / 1000)}s
        //       </Text>
        //     </View>
        //   )}
        // </View>
        <TouchableOpacity disabled style={styles.sendButton}>
          <Icon name="send" size={24} color="#ccc" />
        </TouchableOpacity>
      )}
              </View>
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
                          if (item.label === 'Camera') pickImage(true);
                          else if (item.label === 'Gallery') pickImage(false);
                          else if (item.label === 'Document') pickFile();
                          else if (item.label === 'Emoji') {
                            setEmojiPickerVisible(true);
                            setModalVisible(false);
                          }
                        }}
                      >
                        <View
                          style={[styles.optionIconContainer, { backgroundColor: item.lightColor }]}
                        >
                          <Icon name={item.icon} size={24} color={item.color} />
                        </View>
                        <Text style={styles.optionLabel}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </Modal>
              <Modal
                transparent={true}
                visible={isImageLoading}
                onRequestClose={() => {}}
              >
                <View style={styles.loadingModalOverlay}>
                  <View style={styles.loadingModalContent}>
                    <ActivityIndicator size="large" color="#0d64dd" />
                  </View>
                </View>
              </Modal>
              {contextMenu.visible && (
        <View style={[
          styles.contextMenuContainer,
          {
            top: contextMenu.position.y - 50,
            left: Math.max(10, Math.min(contextMenu.position.x - 100, Dimensions.get('window').width - 220)),
          }
        ]}>
          {/* Delete Option (only for user's messages) */}
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
            
              {/* Divider */}
              <View style={styles.contextMenuDivider} />
            
              {/* Cancel Option */}
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
                visible={imagePreviewModalVisible}
                onRequestClose={() => setImagePreviewModalVisible(false)}
              >
                <View style={styles.imagePreviewModalOverlay}>
                  <View style={styles.imagePreviewModalContent}>
                    <View style={styles.imagePreviewHeader}>
                      <TouchableOpacity
                        onPress={() => {
                          setImagePreviewModalVisible(false);
                          setSelectedImage(null);
                          setText('');
                        }}
                      >
                        <Icon name="close" size={24} color="#FFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => sendMessage(text)}
                        style={styles.imagePreviewSendButton}
                      >
                        <Icon name="send" size={24} color="#0d64dd" />
                      </TouchableOpacity>
                    </View>
                    {selectedImage && (
                      <Image
                        source={{ uri: selectedImage.uri }}
                        style={styles.imagePreviewImage}
                        resizeMode="contain"
                      />
                    )}
                    <TextInput
                      style={styles.imagePreviewInput}
                      placeholder="Add a caption..."
                      placeholderTextColor="#999"
                      value={text}
                      onChangeText={setText}
                      multiline
                    />
                  </View>
                </View>
              </Modal>
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
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 20,
                width: "90%",
                alignItems: "center",
                elevation: 5,
              }}
            >
              {/* Avatar */}
              <Image
                source={
                  userPopup?.avatar
                    ? { uri: userPopup.avatar }
                    : FALLBACK_AVATAR
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 15,
                }}
              />
              {/* Username */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#111",
                }}
              >
                {userPopup?.username || "Unknown"}
              </Text>
              {/* Email */}
              {userPopup?.email && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#555",
                    marginTop: 5,
                    marginBottom: 15,
                  }}
                >
                  {userPopup.email}
                </Text>
              )}
              {/* Action Icons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                  marginVertical: 15,
                }}
              >
                {/* Chat */}
                <TouchableOpacity
                  onPress={() => setUserPopup(false)}
                  style={{ alignItems: "center", borderColor:'grey', borderWidth:1, padding:10,borderRadius:10, width:80, height:80}}
                >
                  <Icon name="chat" size={28} color="#25D366" />
                  <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
                    Chat
                  </Text>
                </TouchableOpacity>
                {/* Call */}
                <TouchableOpacity
                onPress={() =>
                        navigation.navigate('BusinessVoiceCalls', {
                          receiverId,
                          isCaller: true,
                          name: name,
                          roomId: 'unique-room-id'
                        })
                      }
                
                  style={{ alignItems: "center", borderColor:'grey', borderWidth:1, padding:10,borderRadius:10, width:80, height:80}}
                >
                  <Icon name="phone" size={28} color="#34B7F1" />
                  <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
                    Call
                  </Text>
                </TouchableOpacity>
                {/* Video Call */}
                <TouchableOpacity
                onPress={() =>
                        navigation.navigate('CallOngoingScreen', {
                          type: 'video',
                          receiverId,
                          profile_image,
                          name,
                        })
                      }
                style={{ alignItems: "center", borderColor:'grey', borderWidth:1, padding:10,borderRadius:10, width:80, height:80}}
                >
                  <Icoon name="video" size={28} color="#FF6D00" />
                  <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
                    Video
                  </Text>
                </TouchableOpacity>
                {/* Email */}
                {userPopup?.email && (
                  <TouchableOpacity
                    onPress={() => handleEmail(userPopup?.email)}
                    style={{ alignItems: "center" }}
                  >
                    <Icon name="email" size={28} color="#9C27B0" />
                    <Text style={{ fontSize: 12, color: "#333", marginTop: 5 }}>
                      Email
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Cancel */}
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: "#eee",
                }}
                onPress={() => setUserPopup(null)}
              >
                <Text style={{ color: "#333", fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
              {/* <Modal
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
                      <Text style={[styles.userModalUsername, {color:'#333'}]}>
                        {userPopup?.username || 'Unknown'}
                      </Text>
                      <View style={styles.userModalButtons}>
                        <TouchableOpacity
                          style={styles.userModalButton}
                          onPress={() => setUserPopup(null)}
                        >
                          <Text style={[styles.userModalButtonText, {color:'#333'}]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.userModalButton, styles.userModalChatButton]}
                          onPress={() => handleChatPrivate(userPopup?.username)}
                        >
                          <Text style={styles.userModalButtonText}>Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.userModalButton, styles.userModalChatButton]}
                          onPress={() => handleChatPrivate(userPopup?.username)}
                        >
                          <Text style={styles.userModalButtonText}>Chat</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal> */}
              <Modal
        transparent={true}
        visible={filePreviewModalVisible}
        onRequestClose={() => setFilePreviewModalVisible(false)}
      >
        <View style={styles.filePreviewModalOverlay}>
          <View style={styles.filePreviewModalContent}>
            <View style={styles.filePreviewHeader}>
              <TouchableOpacity
                onPress={() => {
                  setFilePreviewModalVisible(false);
                  setSelectedFile(null);
                }}
              >
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  sendMessage(fileCaption);
                  setFilePreviewModalVisible(false);
                }}
                style={styles.filePreviewSendButton}
              >
                <Icon name="send" size={24} color="#0d64dd" />
              </TouchableOpacity>
            </View>
            <View style={styles.filePreview}>
              <Icon name="insert-drive-file" size={60} color="#0d64dd" />
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile?.name}
              </Text>
            </View>
            <TextInput
              style={styles.filePreviewInput}
              placeholder="Add a caption..."
              placeholderTextColor="#999"
              value={fileCaption}
              onChangeText={setFileCaption}
              multiline
            />
          </View>
        </View>
      </Modal>
            </KeyboardAvoidingView>
          </ImageBackground>
    </SafeAreaView>
   
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    //backgroundColor: '#f7f3efff',
   
  },
  header: {
  paddingBottom: Platform.OS === 'android' ? 16 : 0,
  paddingTop: Platform.OS === 'android' ? 14 : 0,
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
    color: '#999',
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
  filePreviewModalOverlay: {
  flex: 1,
  backgroundColor: '#000',
},
filePreviewModalContent: {
  flex: 1,
  padding: 16,
},
filePreviewHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
},
filePreviewSendButton: {
  padding: 8,
},
filePreview: {
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 20,
},
filePreviewInput: {
  backgroundColor: '#333',
  borderRadius: 12,
  padding: 12,
  color: '#FFF',
  fontSize: 16,
},
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  fileName: {
    fontSize: 14,
    color: '#128C7E',
    marginLeft: 8,
    flex: 1,
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
    padding:5
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
  marginRight: 8, // Change this to marginLeft if needed
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
  // micButton: {
  //   padding: 8,
  //   alignSelf: 'center',
  //   borderRadius: 20,
  //   backgroundColor: '#FFF',
  // },
  // recordingMic: {
  //   backgroundColor: '#0d64dd',
  // },
  // recordTime: {
  //   position: 'absolute',
  //   top: -20,
  //   fontSize: 12,
  //   color: '#0d64dd',
  //   fontWeight: 'bold',
  // },
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
  loadingContainer:{
    flex:1,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center'
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
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  imagePreviewModalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  imagePreviewModalContent: {
    flex: 1,
    padding: 16,
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  imagePreviewSendButton: {
    padding: 8,
  },
  imagePreviewImage: {
    width: '100%',
    height: '70%',
    marginVertical: 8,
  },
  imagePreviewInput: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
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
  moreMenuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 60,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  moreMenuContent: {
    paddingVertical: 8,
  },
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  moreMenuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#128C7E',
  },
  moreMenuDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  userModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  userModalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  userModalUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#128C7E',
    marginBottom: 16,
  },
  userModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  userModalButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  userModalChatButton: {
    backgroundColor: '#0d64dd',
  },
  userModalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  // audioContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#F5F5F5',
  //   borderRadius: 12,
  //   padding: 8,
  //   marginBottom: 4,
  //   width: 220,
  // },
  // audioPlayButton: {
  //   width: 32,
  //   height: 32,
  //   borderRadius: 16,
  //   backgroundColor: '#0d64dd',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginRight: 8,
  // },
  // audioProgress: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // waveformStatic: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginRight: 8,
  // },
  // waveformBar: {
  //   width: 2,
  //   marginHorizontal: 1,
  //   borderRadius: 1,
  // },
  // audioTime: {
  //   fontSize: 12,
  //   color: '#666',
  //   fontWeight: '500',
  // },
  // voiceButtonContainer: {
  // flexDirection: 'row',
  // alignItems: 'center',
  // },
  // recordingContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(13, 100, 221, 0.1)',
  //   borderRadius: 20,
  //   paddingHorizontal: 12,
  //   marginLeft: 8,
  // },
  // recordingWave: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   height: 30,
  //   marginRight: 8,
  // },
  // waveBar: {
  //   width: 2,
  //   marginHorizontal: 2,
  //   borderRadius: 1,
  // },
////// handle delete
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
});











