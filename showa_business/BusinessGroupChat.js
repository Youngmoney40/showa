
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
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// // import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import { pick, isCancel } from '@react-native-documents/picker';
// import EmojiSelector from 'react-native-emoji-selector';
// import { Swipeable } from 'react-native-gesture-handler';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // const audioRecorderPlayer = new AudioRecorderPlayer();

// const axiosInstance = axios.create({
//   baseURL: `${API_ROUTE}`,
//   timeout: 10000, // Timeout set to 10 seconds
// });

// const options = [
//   { id: '1', icon: 'camera-alt', label: 'Camera', color: '#0d64dd', lightColor: '#E8F5E9' },
//   { id: '2', icon: 'photo', label: 'Gallery', color: '#0d64dd', lightColor: '#E8F5E9' },
//   { id: '3', icon: 'videocam', label: 'Video', color: '#0d64dd', lightColor: '#E8F5E9' },
//   { id: '4', icon: 'insert-drive-file', label: 'Document', color: '#0d64dd', lightColor: '#E8F5E9' },
//  // { id: '5', icon: 'emoji-emotions', label: 'Emoji', color: '#0d64dd', lightColor: '#E8F5E9' },
// ];


// export default function BusinessChatScreen({ route, navigation }) {
//   const { chatType, receiverId, groupSlug, name, profile_image, members_count } = route.params;
//   const [messages, setMessages] = useState([]);
//   const [pendingMessages, setPendingMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [imagePreviewModalVisible, setImagePreviewModalVisible] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   // const [recording, setRecording] = useState(false);
//   // const [recordSecs, setRecordSecs] = useState(0);
//   const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
//   const [username, setUsername] = useState('');
//   const [userId, setUserId] = useState(null);
//   const [userProfileImage, setUserProfileImage] = useState(null);
//   const [userPopup, setUserPopup] = useState(null);
//   const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedEmoji, setSelectedEmoji] = useState(null);
//   const [replyToMessage, setReplyToMessage] = useState(null);
//   const [reconnectAttempts, setReconnectAttempts] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [accountMode, setAccountMode] = useState('business');
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [filePreviewModalVisible, setFilePreviewModalVisible] = useState(false);
// const [fileCaption, setFileCaption] = useState('');




// const [chatBackground, setChatBackground] = useState(null);
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
//     navigation.navigate('BusinessHome');
//     return true; 
//   };

//   const backHandler = BackHandler.addEventListener(
//     'hardwareBackPress',
//     backAction
//   );

//   return () => backHandler.remove(); 
// }, [navigation]);


// const useChatMessages = (chatType, receiverId, groupSlug, accountMode, userId) => {
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   useEffect(() => {
//     let isMounted = true;
    
//     const loadMessages = async () => {
//       // Load from cache immediately
//       const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
//       const cached = await AsyncStorage.getItem(storageKey);
      
//       if (cached && isMounted) {
//         setMessages(JSON.parse(cached));
//         setIsLoading(false);
//       }
      
//       // Fetch fresh data
//       setIsRefreshing(true);
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         let url = `/api/chat/?chat_type=${chatType}&account_mode=business`;
//         if (chatType === 'single' && receiverId) url += `&receiver=${receiverId}`;
//         else if (chatType === 'group' && groupSlug) url += `&group_slug=${groupSlug}`;
        
//         const response = await axiosInstance.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 8000
//         });
        
//         const history = response.data.results?.map((msg) => ({
//           id: msg.id.toString(),
//           user: msg.user_name || msg.name || 'Unknown',
//           user_id: msg.user_id || msg.user,
//           content: msg.content || '',
//           image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
//           file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
//           emoji: msg.emoji || null,
//           reply_to: msg.reply_to ? msg.reply_to.toString() : null,
//           is_deleted: msg.is_deleted || false,
//           timestamp: msg.timestamp,
//           time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           avatar: msg.user_profile_picture || null,
//         })) || [];
        
//         const uniqueMessages = [...new Map(history.map((msg) => [msg.id, msg])).values()].reverse();
        
//         if (isMounted) {
//           setMessages(uniqueMessages);
//           await AsyncStorage.setItem(storageKey, JSON.stringify(uniqueMessages.slice(0, 100)));
//         }
//       } catch (error) {
//         console.error('Background fetch error:', error.message);
//       } finally {
//         if (isMounted) setIsRefreshing(false);
//       }
//     };
    
//     if (userId) {
//       loadMessages();
//     }
    
//     return () => { isMounted = false; };
//   }, [chatType, receiverId, groupSlug, accountMode, userId]);
  
//   return { messages, setMessages, isLoading, isRefreshing };
// };

//   const flatListRef = useRef();
//   const ws = useRef(null);
//   const maxReconnectAttempts = 5;

//   const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

//   const saveMessagesToStorage = async (messagesToSave) => {
//     try {
//       const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
//       await AsyncStorage.setItem(storageKey, JSON.stringify(messagesToSave.slice(0, 100)));
//       console.log('Messages saved to AsyncStorage:', storageKey);
//     } catch (error) {
//       console.error('Error saving messages to AsyncStorage:', error.message);
//     }
//   };

//   const pickVideo = async (useCamera = false) => {
//   setModalVisible(false);
//   try {
//     const hasPermission = useCamera ? await checkCameraPermission() : await checkPhotoPermission();
//     if (!hasPermission) {
//       alert('Permission denied');
//       return;
//     }
//     setIsImageLoading(true);
//     const result = await (useCamera ? launchCamera : launchImageLibrary)({ 
//       mediaType: 'video', 
//       quality: 0.7 
//     });
//     setIsImageLoading(false);
//     if (!result.didCancel && result.assets) {
//       setSelectedVideo(result.assets[0]);
//       setImagePreviewModalVisible(true);
//     }
//   } catch (error) {
//     setIsImageLoading(false);
//     console.error('Error picking video:', error.message);
//     alert('Failed to pick video');
//   }
// };

//   const loadMessagesFromStorage = async () => {
//     try {
//       const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
//       const storedMessages = await AsyncStorage.getItem(storageKey);
//       return storedMessages ? JSON.parse(storedMessages) : [];
//     } catch (error) {
//       console.error('Error loading messages from AsyncStorage:', error.message);
//       return [];
//     }
//   };

//   const fetchUserData = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;

//       if (!token || !parsed?.id) {
//         return null;
//       }

//       setUserId(parsed.id);
//       const response = await axiosInstance.get(`/user/${parsed.id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUsername(response.data.name || 'Unknown');
//       setUserProfileImage(response.data.profile_picture ? `${API_ROUTE_IMAGE}${response.data.profile_picture}` : null);
//       console.log('User data fetched:', response.data.name);
//       return parsed.id;
//     } catch (error) {
//       console.error('Error fetching user data:', error.response?.data || error.message);
//       return null;
//     }
//   }, []);


// const fetchChatHistory = useCallback(async (userId) => {
//   if (!userId) {
//     return [];
//   }

//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       console.error('No access token found');
//       return [];
//     }

//     let url = `/api/chat/?chat_type=${chatType}&account_mode=business`;
//     if (chatType === 'single' && receiverId) url += `&receiver=${receiverId}`;
//     else if (chatType === 'group' && groupSlug) url += `&group_slug=${groupSlug}`;
//     else {
//       console.error('Invalid chat parameters:', { chatType, receiverId, groupSlug });
//       return [];
//     }

//     const response = await Promise.race([
//       axiosInstance.get(url, { headers: { Authorization: `Bearer ${token}` } }),
//       new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout')), 8000)),
//     ]);

//     console.log('API Response:', JSON.stringify(response.data, null, 2));

//     const history = response.data.results?.map((msg) => {
//       // Debug each message
//       console.log('Processing message:', {
//         id: msg.id,
//         user_id: msg.user_id,
//         user_name: msg.user_name,
//         user_profile_picture: msg.user_profile_picture
//       });

//       return {
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
//         avatar: msg.user_profile_picture || null,  // Use the user_profile_picture field
//       };
//     }) || [];

//     const uniqueMessages = [...new Map(history.map((msg) => [msg.id, msg])).values()].reverse();

//     console.log('Processed messages:', uniqueMessages.length);
//     console.log('First message user:', uniqueMessages[0]?.user);
//     console.log('First message user_id:', uniqueMessages[0]?.user_id);
    
//     saveMessagesToStorage(uniqueMessages);
//     return uniqueMessages;
//   } catch (error) {
//     console.error('Error fetching chat history:', error.response?.data || error.message);
//     return await loadMessagesFromStorage();
//   }
// }, [chatType, receiverId, groupSlug, accountMode]);


//   useEffect(() => {
//     let isMounted = true;

//     const initialize = async () => {
//       setIsLoading(true);
//       try {
//         const userId = await fetchUserData();
//         if (!userId) {
//           console.error('Failed to fetch userId, redirecting to login');
//           navigation.navigate('Signin');
//           return;
//         }
//         const history = await fetchChatHistory(userId);
//         if (isMounted) setMessages(history);
//       } catch (error) {
//         console.error('Initialization error:', error.message);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     initialize();
//     return () => { isMounted = false; if (ws.current) ws.current.close(); };
//   }, [fetchUserData, fetchChatHistory, navigation]);

//   useEffect(() => {
//     if (!userId || !accountMode) return;

//     const connectWebSocket = async () => {
//       if (reconnectAttempts >= maxReconnectAttempts) {
//         console.error('Max WebSocket reconnect attempts reached');
//         return;
//       }

//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.error('No token found');
//         navigation.navigate('Login');
//         return;
//       }

//       const wsUrl = chatType === 'single'
//         ? `wss://api.showapp.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`
//         : `wss://api.showapp.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;

//       console.log('Connecting WebSocket:', wsUrl);
//       ws.current = new WebSocket(wsUrl);

//       ws.current.onopen = () => {
//         console.log('WebSocket opened');
//         setIsWebSocketOpen(true);
//         setReconnectAttempts(0);
//       };

//         ws.current.onmessage = (event) => {
//          // console.log("Raw WebSocket data:", event.data);
//           try {
//             const data = JSON.parse(event.data);
//            /// console.log('WebSocket message received:', data);
            
//             if (data.message) {
//               const newMessage = {
//                 id: data.message.id.toString(),
//                 user: data.message.user || username,
//                 user_id: data.message.user_id || userId,
//                 content: data.message.content || '',
//                 image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
//                 file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
//                 audio: data.message.audio ? `${API_ROUTE_IMAGE}${data.message.audio}` : null,
//                 emoji: data.message.emoji || null,
//                 reply_to: data.message.reply_to ? data.message.reply_to.toString() : null,
//                 is_deleted: data.message.is_deleted || false,
//                 is_greeting: data.message.is_greeting || false,
//                 is_away: data.message.is_away || false,
//                 timestamp: data.message.timestamp,
//                 time: new Date(data.message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
//               };
              
//               // console.log('Processed message:', {
//               //   id: newMessage.id,
//               //   content: newMessage.content,
//               //   is_greeting: newMessage.is_greeting,
//               //   is_away: newMessage.is_away,
//               //   user: newMessage.user,
//               //   user_id: newMessage.user_id,
//               //   timestamp: newMessage.timestamp
//               // });
              
//               setMessages((prev) => {
//                 if (!prev.some((msg) => msg.id === newMessage.id)) {
//                   const updated = [newMessage, ...prev];
//                   saveMessagesToStorage(updated);
//                   flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//                   return updated;
//                 }
//                 return prev;
//               });
//             } else {
//               console.warn('Received WebSocket message without message field:', data);
//             }
//           } catch (error) {
//             console.error('WebSocket message error:', error.message, event.data);
//           }
//         };

//       ws.current.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         setIsWebSocketOpen(false);
//       };

//       ws.current.onclose = () => {
//         console.log('WebSocket closed');
//         setIsWebSocketOpen(false);
//         setTimeout(() => setReconnectAttempts((prev) => prev + 1), 3000);
//       };
//     };

//     connectWebSocket();
//     return () => { if (ws.current) ws.current.close(); };
//   }, [userId, accountMode, chatType, receiverId, groupSlug, reconnectAttempts]);

//   const checkCameraPermission = async () => {
//     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
//     const result = await check(permission);
//     return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
//   };

//   const checkPhotoPermission = async () => {
//     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
//     const result = await check(permission);
//     return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
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
//       const result = await (useCamera ? launchCamera : launchImageLibrary)({ mediaType: 'photo', quality: 0.7 });
//       setIsImageLoading(false);
//       if (!result.didCancel && result.assets) {
//         setSelectedImage(result.assets[0]);
//         setImagePreviewModalVisible(true);
//       }
//     } catch (error) {
//       setIsImageLoading(false);
//       console.error('Error picking image:', error.message);
//       alert('Failed to pick image');
//     }
//   };

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
//     setFileCaption('');
//     setFilePreviewModalVisible(true);
//   } catch (error) {
//     if (!isCancel(error)) {
//       console.error('Error picking file:', error.message);
//       alert('Failed to pick file');
//     }
//   }
// };

//   const selectEmoji = (emoji) => {
//     setSelectedEmoji(emoji);
//     setEmojiPickerVisible(false);
//     sendMessage('');
//   };

//   const getBubbleStyle = (message, index, messages) => {
//   const isMyMessage = message.user_id === userId;
//   const prevMessage = messages[index - 1];
//   const isPrevSameSender = prevMessage && prevMessage.user_id === message.user_id;

//   return {
//     maxWidth: '75%',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     marginVertical: isPrevSameSender ? 1 : 4,
//     backgroundColor: isMyMessage ? '#0653bf' : '#FFFFFF',
//     marginLeft: isMyMessage ? 'auto' : 8,
//     marginRight: isMyMessage ? 8 : 'auto',
//     borderBottomRightRadius: isMyMessage ? 2 : 10,
//     borderBottomLeftRadius: isMyMessage ? 10 : 2,
//     ...(message.reply_to && { paddingTop: 16 }),
//   };
// };

//   const handleMessageSelect = (message) => {
//     if (!message.is_deleted) setReplyToMessage(message);
//   };

//   const renderRightActions = (message) => (
//     <TouchableOpacity
//       style={styles.swipeReply}
//       onPress={() => handleMessageSelect(message)}
//     >
//       <Icon name="reply" size={24} color="#0d64dd" />
//     </TouchableOpacity>
//   );

//   // const VisualizedAudioPlayer = ({ audioUrl }) => {
//   //   const [isPlaying, setIsPlaying] = useState(false);
//   //   const [duration, setDuration] = useState(0);
//   //   const [currentPosition, setCurrentPosition] = useState(0);

//   //   const startPlayback = async () => {
//   //     try {
//   //       await audioRecorderPlayer.startPlayer(audioUrl);
//   //       setIsPlaying(true);
//   //       audioRecorderPlayer.addPlayBackListener((e) => {
//   //         setCurrentPosition(e.currentPosition);
//   //         setDuration(e.duration);
//   //         if (e.currentPosition >= e.duration) {
//   //           setIsPlaying(false);
//   //           audioRecorderPlayer.stopPlayer();
//   //           setCurrentPosition(0);
//   //         }
//   //       });
//   //     } catch (error) {
//   //       console.error('Error playing audio:', error.message);
//   //       alert('Failed to play audio');
//   //     }
//   //   };

//   //   const stopPlayback = async () => {
//   //     try {
//   //       await audioRecorderPlayer.stopPlayer();
//   //       setIsPlaying(false);
//   //     } catch (error) {
//   //       console.error('Error stopping audio:', error.message);
//   //     }
//   //   };

//   //   const formatTime = (ms) => {
//   //     const seconds = Math.floor(ms / 1000);
//   //     const minutes = Math.floor(seconds / 60);
//   //     return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
//   //   };

//   //   return (
//   //     <View style={styles.audioContainer}>
//   //       <TouchableOpacity
//   //         onPress={isPlaying ? stopPlayback : startPlayback}
//   //         style={styles.audioPlayButton}
//   //       >
//   //         <Icon name={isPlaying ? 'pause' : 'play-arrow'} size=


// //{20} color="#FFFFFF" />
//   //       </TouchableOpacity>
//   //       <View style={styles.audioProgress}>
//   //         <View style={styles.waveformStatic}>
//   //           {Array(40).fill().map((_, index) => (
//   //             <View
//   //               key={index}
//   //               style={[
//   //                 styles.waveformBar,
//   //                 {
//   //                   height: isPlaying ? Math.random() * 12 + 4 : 8,
//   //                   backgroundColor: isPlaying ? '#0d64dd' : '#B0BEC5',
//   //                 },
//   //               ]}
//   //             />
//   //           ))}
//   //         </View>
//   //         <Text style={styles.audioTime}>
//   //           {formatTime(currentPosition)} / {formatTime(duration)}
//   //         </Text>
//   //       </View>
//   //     </View>
//   //   );
//   // };

//   const renderMessage = ({ item, index }) => {
//     console.log('fetch chatsssssssss', item)
//   if (!userId) return null;

//   const isMyMessage = item.user_id === userId;
//   const avatarSource = item.avatar ? { uri: item.avatar } : FALLBACK_AVATAR;

//   if (item.is_deleted) {
//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
//         ]}
//       >
//         <Text style={styles.deletedMessage}>This message was deleted</Text>
//       </View>
//     );
//   }

//   const repliedToMessage = item.reply_to ? messages.find((msg) => msg.id === item.reply_to) : null;

//   return (
//     <Swipeable renderRightActions={() => renderRightActions(item)} overshootRight={false}>
//       <TouchableOpacity
//         onPress={() => handleMessageSelect(item)}
//         onLongPress={() => handleMessageSelect(item)}
//         activeOpacity={0.9}
//       >
//         <View
//           style={[
//             styles.messageContainer,
//             isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
//           ]}
//         >
//           {!isMyMessage && (
//             <TouchableOpacity
//               onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user_id })}
//             >
//              <Image
//                 source={{ uri: `${API_ROUTE_IMAGE}${item.avatar}` }}
//                 style={styles.avatar}
//               />
//             </TouchableOpacity>
//           )}
//           <View
//             style={[
//               getBubbleStyle(item, index, messages),
//               item.is_greeting && { backgroundColor: '#0d64dd', opacity: 0.8 }, 
//               item.is_away && { backgroundColor: '#ff9800', opacity: 0.8 }, 
//             ]}
//           >
//             {(item.is_greeting || item.is_away) && (
//               <Text style={styles.autoMessageLabel}>
//                 {item.is_greeting ? 'Greeting' : 'Away'} Message
//               </Text>
//             )}
//             {repliedToMessage && (
//               <View style={styles.replyContainer}>
//                 <Text style={styles.replyUsername}>{repliedToMessage.user}</Text>
//                 <Text style={styles.replyContent} numberOfLines={1}>
//                   {repliedToMessage.content || (repliedToMessage.emoji ? repliedToMessage.emoji : 'Media')}
//                 </Text>
//               </View>
//             )}
//             {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
//             {item.file && (
//               <TouchableOpacity
//                 style={styles.fileContainer}
//                 onPress={() => Linking.openURL(item.file).catch(() => alert('Cannot open file'))}
//               >
//                 <Icon name="insert-drive-file" size={20} color="#128C7E" />
//                 <Text style={styles.fileName} numberOfLines={1}>
//                   {item.file.split('/').pop()}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             {/* {item.audio && <VisualizedAudioPlayer audioUrl={item.audio} />} */}
//             {item.emoji && <Text style={styles.emojiMessage}>{item.emoji}</Text>}
//             {item.content && (
//               <Text style={[styles.messageText, isMyMessage && { color: '#FFF' }]}>{item.content}</Text>
//             )}
//             {item.video && (
//                 <TouchableOpacity onPress={() => Linking.openURL(item.video)}>
//                   <View style={styles.videoContainer}>
//                     <Icon name="play-circle-filled" size={50} color="#FFF" style={styles.videoPlayIcon} />
//                     <Text style={styles.videoLabel}>Video Message</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             {/* <View style={styles.messageFooter}>
//               <Text style={styles.timeText}>{item.time}</Text>
//               {isMyMessage && (
//                 <Icon
//                   name={item.id.startsWith('m') ? 'access-time' : 'done-all'}
//                   size={12}
//                   color={item.id.startsWith('m') ? '#999' : '#0d64dd'}
//                   style={{ marginLeft: 4 }}
//                 />
//               )}
//             </View> */}
//             <View style={styles.messageFooter}>
//               <Text style={[styles.timeText, isMyMessage && styles.myMessageTime]}>{item.time}</Text>
//                 {isMyMessage && (
//                   <Icon
//                     name={item.id.startsWith('m') ? 'access-time' : 'done-all'}
//                     size={12}
//                     color={item.id.startsWith('m') ? '#999' : '#FFF'}
//                     style={{ marginLeft: 4 }}
//                   />
//                 )}
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Swipeable>
//   );
// };

//   const sendMessage = async (caption = '') => {
//     // if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji && !recording) return;
//     if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji) return;

//     const formData = new FormData();
//     if (caption.trim()) formData.append('content', caption.trim());
//     if (selectedEmoji) formData.append('emoji', selectedEmoji);
//     if (replyToMessage) formData.append('reply_to', replyToMessage.id);
//     if (selectedImage) {
//       formData.append('image', {
//         uri: selectedImage.uri,
//         type: selectedImage.type,
//         name: selectedImage.fileName || 'image.jpg',
//       });
//     }
//     if (selectedFile) {
//         formData.append('content', fileCaption || '');
//       formData.append('file', {
//         uri: selectedFile.uri,
//         type: selectedFile.type,
//         name: selectedFile.name,
//       });
//     }
//     if (selectedVideo) {
//     formData.append('video', {
//       uri: selectedVideo.uri,
//       type: selectedVideo.type,
//       name: selectedVideo.fileName || 'video.mp4',
//     });
//   }
//     setFileCaption('');
//     formData.append('chat_type', chatType);
//     formData.append('account_mode', accountMode);
//     if (chatType === 'single') formData.append('receiver', receiverId);
//     else formData.append('group_slug', groupSlug);

//     const tempId = 'm' + Date.now();
//       if (caption.trim() || selectedImage || selectedFile || selectedEmoji) {
//         setPendingMessages((prev) => [
//           {
//             id: tempId,
//             user: username,
//             user_id: userId,
//             content: caption.trim() || null,
//             image: selectedImage ? selectedImage.uri : null,
//             file: selectedFile ? selectedFile.uri : null,
//             // audio: null,
//             emoji: selectedEmoji || null,
//             reply_to: replyToMessage ? replyToMessage.id : null,
//             is_deleted: false,
//             timestamp: new Date().toISOString(),
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             avatar: userProfileImage || null,
//           },
//           ...prev,
//         ]);
//       }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) throw new Error('No access token');

//       if (selectedImage || selectedFile || (!caption.trim() && !selectedEmoji)) {
//         const response = await axiosInstance.post(`/api/chat/`, formData, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//         });
//         console.log('Message sent via API:', response.data);
//       } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify({
//           action: 'send',
//           content: caption.trim() || null,
//           emoji: selectedEmoji || null,
//           reply_to: replyToMessage ? replyToMessage.id : null,
//           chat_type: chatType,
//           receiver_id: chatType === 'single' ? receiverId : null,
//           group_slug: chatType === 'group' ? groupSlug : null,
//           user_id: userId,
//           account_mode: accountMode,
//         }));
//       } else {
//         const response = await axiosInstance.post(`/api/chat/`, formData, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//         });
//         console.log('Message sent via API:', response.data);
//       }

//       setText('');
//       setSelectedImage(null);
//       setSelectedFile(null);
//       setSelectedEmoji(null);
//       setReplyToMessage(null);
//       setImagePreviewModalVisible(false);
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//     } catch (error) {
//       console.error('Error sending message:', error.response?.data || error.message);
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       alert(`Failed to send message: ${error.message}`);
//     }ggg
//   };

//   // const onStartRecord = async () => {
//   //   try {
//   //     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
//   //     const result = await check(permission);
//   //     if (result !== RESULTS.GRANTED && (await request(permission)) !== RESULTS.GRANTED) {
//   //       alert('Microphone permission denied');
//   //       return;
//   //     }
//   //     await audioRecorderPlayer.startRecorder();
//   //     audioRecorderPlayer.addRecordBackListener((e) => setRecordSecs(e.currentPosition));
//   //     setRecording(true);
//   //   } catch (error) {
//   //     console.error('Error starting recording:', error.message);
//   //     alert('Failed to start recording');
//   //   }
//   // };

//   // const onStopRecord = async () => {
//   //   try {
//   //     const result = await audioRecorderPlayer.stopRecorder();
//   //     audioRecorderPlayer.removeRecordBackListener();
//   //     setRecordSecs(0);
//   //     setRecording(false);

//   //     const formData = new FormData();
//   //     formData.append('audio', { uri: result, type: 'audio/m4a', name: result.split('/').pop() || 'audio.m4a' });
//   //     if (replyToMessage) formData.append('reply_to', replyToMessage.id);
//   //     formData.append('chat_type', chatType);
//   //     formData.append('account_mode', accountMode);
//   //     if (chatType === 'single') formData.append('receiver', receiverId);
//   //     else formData.append('group_slug', groupSlug);

//   //     const tempId = 'm' + Date.now();
//   //     setPendingMessages((prev) => [
//   //       {
//   //         id: tempId,
//   //         user: username,
//   //         user_id: userId,
//   //         content: null,
//   //         image: null,
//   //         file: null,
//   //         audio: result,
//   //         emoji: null,
//   //         reply_to: replyToMessage ? replyToMessage.id : null,
//   //         is_deleted: false,
//   //         timestamp: new Date().toISOString(),
//   //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//   //         avatar: userProfileImage || null,
//   //       },
//   //       ...prev,
//   //     ]);

//   //     const token = await AsyncStorage.getItem('userToken');
//   //     if (!token) throw new Error('No access token');

//   //     await axiosInstance.post(`/api/chat/`, formData, {
//   //       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//   //     });

//   //     setReplyToMessage(null);
//   //     setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//   //     flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//   //   } catch (error) {
//   //     console.error('Error sending audio:', error.response?.data || error.message);
//   //     setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//   //     alert(`Failed to send audio: ${error.message}`);
//   //   }
//   // };

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
//     <SafeAreaView style={{flex:1}}>
//       <StatusBar
//                           barStyle={Platform.OS === 'android'? 'light-content':'dark-content'}
//                           translucent={Platform.OS === 'android'}
//                           backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
//                         />
//        <ImageBackground
//       source={chatBackground ? { uri: chatBackground.value } : require('../assets/images/showtheme.jpg')}
//       style={[styles.container, {}]}
//       resizeMode="cover"
//     >
//       {/* <KeyboardAwareScrollView
//        style={styles.container}
//   contentContainerStyle={{ flex: 1 }} // Ensures full height
//   enableOnAndroid={true} // Better Android support
//   extraScrollHeight={20} // Extra space above keyboard
//   keyboardShouldPersistTaps="handled"
        
//       > */}
//         <View style={styles.contentContainer}>
//           <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.headerButton, { marginTop: -20 }]}>
//               <Icon name="arrow-back" size={24} color="#FFF" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.headerProfile, { marginTop: -20 }]}
//                 onPress={() => navigation.navigate('GroupMembers', {
//                   groupSlug: groupSlug,
//                   groupName: name
//                 })}
              
//             >
//               <Image
//                 source={chatType === 'group' && profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
//                 style={styles.headerAvatar}
//               />
//               <View>
//                   <Text style={[styles.headerName,{marginTop:10}]}>{name}</Text>
//                   <Text style={[styles.headerName, {fontSize:12, color:'#f7f7f7ff', fontWeight:'400', marginBottom:10}]}>{members_count || '1+'} Members</Text>
                
//               </View>
            
//             </TouchableOpacity>
//             <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -20, marginRight:20 }}>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('GroupMembers', {
//                   groupSlug: groupSlug,
//                   groupName: name
//                 })}
//               >
//                  <Icon name="people" size={24} color="#FFF" />
//               </TouchableOpacity>
              
//             </View>
//           </View>
//         </LinearGradient>

//          <View style={styles.chatContainer}>

//           <KeyboardAwareScrollView
//            nestedScrollEnabled={true}
//         style={styles.chatScrollContainer}
//         contentContainerStyle={styles.chatScrollContent}
//         extraScrollHeight={20}
//         enableOnAndroid={true}
//         keyboardShouldPersistTaps="handled"
//       >
//   {messages.length === 0 && pendingMessages.length === 0 ? (
//   isLoading ? (
//     <View style={styles.emptyChatPlaceholder}>
//       <ActivityIndicator size="large" color="#0d64dd" />
//       <Text style={{ marginTop: 16, color: '#666' }}>Loading messages...</Text>
//     </View>
//   ) : (
//     <View style={styles.emptyChatPlaceholder}>
//       <View style={styles.groupInfoContainer}>
//         <View style={styles.groupAvatar}>
//           <Icon name="group" size={48} color="#367BF5" />
//         </View>
//         <Text style={styles.groupName}>{name || "New Group"}</Text>
//         <Text style={styles.groupMembers}>
//           {members_count} {members_count === 1 ? "member" : "members"}
//         </Text>
//       </View>
//       <Text style={styles.welcomeText}>
//         This is the very beginning of the {name || "group"} conversation.
//       </Text>
//       <Text style={styles.encryptionText}>
//         Messages are <Text style={{ fontWeight: "bold" }}>end-to-end encrypted 🔒</Text>.{"\n"}
//         No one outside of this chat, not even us, can read or listen to them.
//       </Text>
//       <Text style={styles.startChatPrompt}>
//         Send a message to start the conversation.
//       </Text>
//     </View>
//   )
// ) : (
//   <FlatList
//     ref={flatListRef}
//     data={[...pendingMessages, ...messages]}
//     renderItem={renderMessage}
//     keyExtractor={(item) => item.id.toString()}
//     inverted
//     contentContainerStyle={styles.chatContent}
//     keyboardShouldPersistTaps="handled"
//     scrollEnabled={true}
//   />
// )}
//         </KeyboardAwareScrollView>
//         </View>

//         {replyToMessage && (
//           <View style={styles.replyPreview}>
//             <View style={styles.replyPreviewContent}>
//               <Text style={styles.replyPreviewUsername}>{replyToMessage.user}</Text>
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
//           <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.attachButton}>
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
//   <TouchableOpacity onPress={() => sendMessage(text)} style={styles.sendButton}>
//     <Icon name="send" size={24} color="#0d64dd" />
//   </TouchableOpacity>
// ) : (
//   // <View style={styles.voiceButtonContainer}>
//   //   <TouchableOpacity
//   //     onPress={async () => {
//   //       if (recording) {
//   //         await onStopRecord();
//   //       } else {
//   //         await onStartRecord();
//   //       }
//   //     }}
//   //     style={[styles.micButton, recording && styles.recordingMic]}
//   //   >
//   //     <Icon name={recording ? "stop" : "mic"} size={24} color={recording ? '#FFF' : '#0d64dd'} />
//   //   </TouchableOpacity>
//   //   {recording && (
//   //     <View style={styles.recordingContainer}>
//   //       <View style={styles.recordingWave}>
//   //         {Array(5).fill().map((_, i) => (
//   //           <View 
//   //             key={i}
//   //             style={[
//   //               styles.waveBar,
//   //               { 
//   //                 height: Math.random() * 20 + 5,
//   //                 backgroundColor: '#0d64dd'
//   //               }
//   //             ]}
//   //           />
//   //         ))}
//   //       </View>
//   //       <Text style={styles.recordTime}>
//   //         {Math.floor(recordSecs / 1000)}s
//   //       </Text>
//   //     </View>
//   //   )}
//   // </View>
//   <TouchableOpacity disabled style={styles.sendButton}>
//     <Icon name="mic" size={24} color="#ccc" />
//   </TouchableOpacity>
// )}
//         </View>

//         <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
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
//   if (item.label === 'Camera') pickImage(true);
//   else if (item.label === 'Gallery') pickImage(false);
//   else if (item.label === 'Video') pickVideo(false);
//   else if (item.label === 'Document') pickFile();
//   else if (item.label === 'Emoji') {
//     setEmojiPickerVisible(true);
//     setModalVisible(false);
//   }
// }}
//                 >
//                   <View style={[styles.optionIconContainer, { backgroundColor: item.lightColor }]}>
//                     <Icon name={item.icon} size={24} color={item.color} />
//                   </View>
//                   <Text style={styles.optionLabel}>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </Modal>

//         <Modal transparent visible={isImageLoading} onRequestClose={() => {}}>
//           <View style={styles.loadingModalOverlay}>
//             <View style={styles.loadingModalContent}>
//               <ActivityIndicator size="large" color="#0d64dd" />
//             </View>
//           </View>
//         </Modal>

//         <Modal transparent visible={imagePreviewModalVisible} onRequestClose={() => setImagePreviewModalVisible(false)}>
//           <View style={styles.imagePreviewModalOverlay}>
//             <View style={styles.imagePreviewModalContent}>
//               <View style={[styles.imagePreviewHeader,{marginTop:25}]}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setImagePreviewModalVisible(false);
//                     setSelectedImage(null);
//                     setText('');
//                   }}
//                 >
//                   <Icon name="close" size={24} color="#FFF" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => sendMessage(text)} style={styles.imagePreviewSendButton}>
//                   <Icon name="send" size={24} color="#0d64dd" />
//                 </TouchableOpacity>
//               </View>
//               {selectedImage && <Image source={{ uri: selectedImage.uri }} style={styles.imagePreviewImage} resizeMode="contain" />}
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

//         <Modal transparent visible={emojiPickerVisible} onRequestClose={() => setEmojiPickerVisible(false)}>
//           <TouchableWithoutFeedback onPress={() => setEmojiPickerVisible(false)}>
//             <View style={styles.modalOverlay}>
//               <View style={styles.emojiPickerContainer}>
//                 <EmojiSelector onEmojiSelected={selectEmoji} />
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>

//         <Modal transparent visible={!!userPopup} onRequestClose={() => setUserPopup(null)}>
//           <TouchableWithoutFeedback onPress={() => setUserPopup(null)}>
//             <View style={styles.userModalOverlay}>
//               <View style={styles.userModalContent}>
//                 <Image source={userPopup?.avatar ? { uri: userPopup.avatar } : FALLBACK_AVATAR} style={styles.userModalAvatar} />
//                 <Text style={styles.userModalUsername}>{userPopup?.username || 'Unknown'}</Text>
//                 <View style={styles.userModalButtons}>
//                   <TouchableOpacity style={styles.userModalButton} onPress={() => setUserPopup(null)}>
//                     <Text style={styles.userModalButtonText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.userModalButton, styles.userModalChatButton]} onPress={() => handleChatPrivate(userPopup?.username)}>
//                     <Text style={styles.userModalButtonText}>Chat</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
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

//         </View>
        
//       {/* </KeyboardAwareScrollView> */}
//     </ImageBackground>
//     </SafeAreaView>
    
   
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//    // backgroundColor: '#e6ddd3',
    
//   },
//   // header: {
//   //   paddingTop: Platform.OS === 'ios' ? 44 : 24,
//   //   paddingHorizontal: 16,
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   justifyContent: 'space-between',
//   //   padding:10
//   // },
//   header: {
//   paddingBottom: Platform.OS === 'android' ? 16 : 0,
//   paddingTop: Platform.OS === 'android' ? 5 : 10,
//   borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
//   borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
//   backgroundColor: '#0d64dd',
//   elevation: 6,
//   margin:0,
  
//   zIndex: 1000,
// },
//   chatScrollContainer: {
//     flex: 1,
//   },
//   chatScrollContent: {
//     flexGrow: 1,
//   },
//   headerButton: {
//     padding: 8,
//   },
//   headerProfile: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 8,
//     padding:10
//   },
//   headerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   contentContainer: {
//     flex: 1,
//   },
//   chatArea: {
//     flex: 1,
//     marginBottom: 70, 
//   },
//   headerName: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 12,
//     paddingHorizontal:20,
    
//     textTransform: 'capitalize',
//   },
//   chatContent: {
//     flexGrow: 1,
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
//     color: '#128C7E',
//   },
//   replyPreviewText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   //// remove to place chat on top
//    chatContainer: {
//     flex: 1,
//     paddingBottom: 70, 
//   },
//   chatContent: {
//     flexGrow: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//   },
//  footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     backgroundColor: '#F0F0F0',
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
//   // micButton: {
//   //   padding: 8,
//   //   alignSelf: 'center',
//   //   borderRadius: 20,
//   //   backgroundColor: '#FFF',
//   // },
//   // recordingMic: {
//   //   backgroundColor: '#0d64dd',
//   // },
//   // recordTime: {
//   //   position: 'absolute',
//   //   top: -20,
//   //   fontSize: 12,
//   //   color: '#0d64dd',
//   //   fontWeight: 'bold',
//   // },
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
//   timeText: {
//   fontSize: 12,
//   color: '#000',
//   marginTop: 2,
// },
// myMessageTime: {
//   color: '#cecccaff',
// },
// messageFooter: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'flex-end',
// },
// emptyChatPlaceholder: {
//   flex: 1,
//   justifyContent: "center",
//   alignItems: "center",
//   paddingHorizontal: 30,
//   paddingVertical: 40,
//   backgroundColor: "#fafafa",
//   margin: 20,
//   borderRadius: 14,
//   borderWidth: 1,
//   borderColor: "#ddd",
// },

// groupInfoContainer: {
//   alignItems: "center",
//   marginBottom: 24,
// },

// groupAvatar: {
//   backgroundColor: "#e6f0ff",
//   borderRadius: 40,
//   width: 80,
//   height: 80,
//   justifyContent: "center",
//   alignItems: "center",
//   marginBottom: 12,
// },

// groupName: {
//   fontSize: 20,
//   fontWeight: "700",
//   color: "#222",
//   marginBottom: 4,
// },

// groupMembers: {
//   fontSize: 14,
//   color: "#555",
// },

// welcomeText: {
//   fontSize: 15,
//   color: "#444",
//   textAlign: "center",
//   marginBottom: 20,
// },

// encryptionText: {
//   fontSize: 13,
//   color: "#666",
//   textAlign: "center",
//   lineHeight: 20,
//   marginBottom: 20,
// },

// startChatPrompt: {
//   fontSize: 14,
//   color: "#1976D2",
//   fontWeight: "600",
//   textAlign: "center",
// },
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
//   // audioContainer: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   backgroundColor: '#F5F5F5',
//   //   borderRadius: 12,
//   //   padding: 8,
//   //   marginBottom: 4,
//   //   width: 220,
//   // },
//   autoMessageLabel: {
//     fontSize: 12,
//     fontStyle: 'italic',
//     color: '#FFF',
//     marginBottom: 4,
//   },
//   // audioPlayButton: {
//   //   width: 32,
//   //   height: 32,
//   //   borderRadius: 16,
//   //   backgroundColor: '#0d64dd',
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   marginRight: 8,
//   // },
//   // audioProgress: {
//   //   flex: 1,
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   // },
//   // waveformStatic: {
//   //   flex: 1,
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   marginRight: 8,
//   // },
//   // waveformBar: {
//   //   width: 2,
//   //   marginHorizontal: 1,
//   //   borderRadius: 1,
//   // },
//   // audioTime: {
//   //   fontSize: 12,
//   //   color: '#666',
//   //   fontWeight: '500',
//   // },
//   // voiceButtonContainer: {
//   // flexDirection: 'row',
//   // alignItems: 'center',
//   // },
//   // recordingContainer: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   backgroundColor: 'rgba(13, 100, 221, 0.1)',
//   //   borderRadius: 20,
//   //   paddingHorizontal: 12,
//   //   marginLeft: 8,
//   // },
//   // recordingWave: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   height: 30,
//   //   marginRight: 8,
//   // },
//   // waveBar: {
//   //   width: 2,
//   //   marginHorizontal: 2,
//   //   borderRadius: 1,
//   // },
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
// videoContainer: {
//   width: 200,
//   height: 150,
//   backgroundColor: '#000',
//   borderRadius: 8,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginBottom: 4,
// },
// videoPlayIcon: {
//   opacity: 0.8,
// },
// videoLabel: {
//   color: '#FFF',
//   marginTop: 8,
// },
// });


//////// ================================

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
  PermissionsAndroid,
  AppState
} from 'react-native';
import Icoon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';
import EmojiSelector from 'react-native-emoji-selector';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { useBackHandler } from '../src/hooks/useBackHandler';
//import IncomingCallHandler from '../components/Incomingcallhandler';

const CACHE_KEY_PREFIX = 'chat_cache_';

// Keeps the message list always sorted newest-first so merges from
// WebSocket / polling / history never cause a visual "jump"
const sortByTimestampDesc = (msgs) =>
  [...msgs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

const axiosInstance = axios.create({
  baseURL: 'https://api.showapp.ng/api/showa',
  timeout: 30000,
});

/////
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const options = [
  { id: '1', icon: 'camera-alt', label: 'Camera', color: '#0d64dd' },
  { id: '2', icon: 'photo', label: 'Gallery', color: '#0d64dd' },
  { id: '3', icon: 'insert-drive-file', label: 'Document', color: '#0d64dd' },
  { id: '4', icon: 'emoji-emotions', label: 'Emoji', color: '#0d64dd' },
];

export default function PersonalPrivateChatScreen({ route, navigation }) {
  useBackHandler(navigation, 'BroadcastHome');

  const { chatType, receiverId, groupSlug, name, profile_image, userIdd, userStatus, members_count } = route.params;
  

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
  const [accountMode, setAccountMode] = useState('business');
  const [filePreviewModalVisible, setFilePreviewModalVisible] = useState(false);
  const [fileCaption, setFileCaption] = useState('');
  const [chatBackground, setChatBackground] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [isAndroid15, setIsAndroid15] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeenDisplay, setLastSeenDisplay] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);

  // Download / preview tracking (package-free)
  const [downloadedFiles, setDownloadedFiles] = useState({}); // { [messageId]: localPath }
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerUri, setImageViewerUri] = useState(null);

  const flatListRef = useRef();
  const ws = useRef(null);
  const timeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');
  const isPickingRef = useRef(false);
  const appStateListener = useRef(null);
  const pollInterval = useRef(null);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);


  // Add a function to fetch user profile picture
const fetchUserProfilePicture = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_ROUTE}/user/${userId}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.profile_picture || null;
  } catch (error) {
    return null;
  }
};

// In your useEffect when messages load, fetch missing avatars
useEffect(() => {
  const fetchMissingAvatars = async () => {
    const updatedMessages = [...messages];
    let hasChanges = false;
    
    for (let i = 0; i < updatedMessages.length; i++) {
      const msg = updatedMessages[i];
      if (!msg.user_profile_picture && msg.user_id) {
        const avatar = await fetchUserProfilePicture(msg.user_id);
        if (avatar) {
          updatedMessages[i] = { 
            ...msg, 
            user_profile_picture: avatar,
            avatar: avatar 
          };
          hasChanges = true;
        }
      }
    }
    
    if (hasChanges) {
      setMessages(updatedMessages);
      saveMessagesToCache(updatedMessages);
    }
  };
  
  if (messages.length > 0) {
    fetchMissingAvatars();
  }
}, [messages]);

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  ]);

  // ==================== CACHE FUNCTIONS (Using AsyncStorage) ====================
  
  const getCacheKey = useCallback(() => {
    const identifier = chatType === 'single' ? receiverId : groupSlug;
    return `${CACHE_KEY_PREFIX}${chatType}_${identifier}`;
  }, [chatType, receiverId, groupSlug]);

  const getMetadataKey = useCallback(() => {
    const identifier = chatType === 'single' ? receiverId : groupSlug;
    return `${CACHE_KEY_PREFIX}${chatType}_${identifier}_meta`;
  }, [chatType, receiverId, groupSlug]);

  const getDownloadedFilesKey = useCallback(() => {
    const identifier = chatType === 'single' ? receiverId : groupSlug;
    return `downloaded_files_${chatType}_${identifier}`;
  }, [chatType, receiverId, groupSlug]);

  // ==================== CLEANUP ORPHANED TEMP MESSAGES ====================
useEffect(() => {
  const cleanupOrphanedTempMessages = () => {
    setMessages((prev) => {
      const now = Date.now();
      const filtered = prev.filter((msg) => {
        // Check if it's a temp message
        if (msg.id && msg.id.toString().startsWith('temp_')) {
          // Keep temp messages that are still sending and less than 30 seconds old
          if (msg.is_sending) {
            const msgTime = new Date(msg.timestamp).getTime();
            return (now - msgTime) < 30000; // Keep if less than 30 seconds
          }
          // Remove temp messages that are not sending (error or stuck)
          return false;
        }
        // Keep all real messages
        return true;
      });
      
      // Only update if messages were actually removed
      if (filtered.length !== prev.length) {
        saveMessagesToCache(filtered);
        return filtered;
      }
      return prev;
    });
  };
  
  // Run cleanup every 10 seconds
  const cleanupInterval = setInterval(cleanupOrphanedTempMessages, 10000);
  
  // Also run cleanup when component unmounts
  return () => {
    clearInterval(cleanupInterval);
    // Final cleanup
    cleanupOrphanedTempMessages();
  };
}, []);

  // Save messages to AsyncStorage cache (persistent)
  const saveMessagesToCache = useCallback(async (messagesToSave) => {
    try {
      const key = getCacheKey();
      // Limit cache to 200 messages
      const limitedMessages = messagesToSave.slice(0, 200);
      await AsyncStorage.setItem(key, JSON.stringify(limitedMessages));
      
      // Save metadata
      const metadataKey = getMetadataKey();
      const metadata = {
        lastUpdated: Date.now(),
        count: limitedMessages.length,
        lastMessageId: limitedMessages[0]?.id || null,
        lastMessageTimestamp: limitedMessages[0]?.timestamp || null,
      };
      await AsyncStorage.setItem(metadataKey, JSON.stringify(metadata));
    } catch (error) {
      // Silent fail - cache is optional
    }
  }, [getCacheKey, getMetadataKey]);

  // Load messages from AsyncStorage cache (instant)
  const loadMessagesFromCache = useCallback(async () => {
    try {
      const key = getCacheKey();
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          setMessages(parsed);
          setLastMessageTimestamp(parsed[0]?.timestamp || null);
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [getCacheKey]);

  // ==================== USER DATA ====================

  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;
      
      if (!token || !parsed?.id) {
        return null;
      }
      
      setUserId(parsed.id);
      
      // Try cache first for user data
      const cachedUser = await AsyncStorage.getItem('user_data_cache');
      if (cachedUser) {
        const userData = JSON.parse(cachedUser);
        if (userData.id === parsed.id) {
          setUsername(userData.name);
          setUserProfileImage(userData.profile_picture);
          return parsed.id;
        }
      }
      
      // Fetch fresh user data
      const response = await axiosInstance.get(`/user/${parsed.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        setUsername(response.data.name);
        const profilePicture = response.data.profile_picture
          ? `${API_ROUTE_IMAGE}${response.data.profile_picture}`
          : null;
        setUserProfileImage(profilePicture);
        
        // Cache user data
        await AsyncStorage.setItem('user_data_cache', JSON.stringify({
          id: parsed.id,
          name: response.data.name,
          profile_picture: profilePicture,
        }));
        return parsed.id;
      }
    } catch (error) {
      return null;
    }
  }, []);

  // ==================== FETCH CHAT HISTORY (Background) ====================

  const fetchChatHistory = useCallback(async (userIdParam) => {
  const id = userIdParam || userId;
  if (!id) return;
  
  const token = await AsyncStorage.getItem('userToken');
  if (!token) return;
  
  try {
    let url = `/api/chat/?chat_type=${chatType}&account_mode=${accountMode}`;
    if (chatType === 'single' && receiverId) {
      url += `&receiver=${receiverId}`;
    } else if (chatType === 'group' && groupSlug) {
      url += `&group_slug=${groupSlug}`;
    } else {
      return;
    }
    
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    console.log('RAW API RESPONSE:', JSON.stringify(response.data.results[0], null, 2));
console.log('Available fields in first message:', Object.keys(response.data.results[0] || {}));

  
    
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
  is_sending: false,
  is_error: false,
  timestamp: msg.timestamp,
  time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  avatar: msg.avatar || msg.user_profile_picture || null,
  // ✅ IMPORTANT: Map from both possible field names
  user_profile_picture: msg.user_profile_picture || msg.avatar || null,
  uploadProgress: undefined,
}));
    
    // Debug: log the mapped messages
    console.log('Mapped messages:', history.map(m => ({
      id: m.id,
      user: m.user,
      user_profile_picture: m.user_profile_picture
    })));
    
    setMessages((prev) => {
      const sending = prev.filter((m) => m.is_sending || m.is_error);
      const freshIds = new Set(history.map((m) => m.id));
      
      const merged = [
        ...sending.filter((s) => !freshIds.has(s.id)),
        ...history,
      ];
      
      const seen = new Set();
      const unique = merged.filter((msg) => {
        if (seen.has(msg.id)) return false;
        seen.add(msg.id);
        return true;
      });
      
      const sorted = sortByTimestampDesc(unique);
      saveMessagesToCache(sorted);
      return sorted;
    });
  } catch (error) {
    console.error('Fetch chat history error:', error);
  }
}, [chatType, receiverId, groupSlug, accountMode, userId, saveMessagesToCache]);
  // ==================== POLLING FOR NEW MESSAGES ====================

  // const pollNewMessages = useCallback(async () => {
  //   if (!userId || !lastMessageTimestamp) return;
    
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     if (!token) return;
      
  //     let url = `/api/chat/?chat_type=${chatType}&account_mode=${accountMode}`;
  //     if (chatType === 'single' && receiverId) {
  //       url += `&receiver=${receiverId}`;
  //     } else if (chatType === 'group' && groupSlug) {
  //       url += `&group_slug=${groupSlug}`;
  //     } else {
  //       return;
  //     }
      
  //     // Only fetch messages newer than the last one we have
  //     if (lastMessageTimestamp) {
  //       url += `&after=${encodeURIComponent(lastMessageTimestamp)}`;
  //     }
      
  //     const response = await axiosInstance.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       timeout: 10000,
  //     });
      
  //     const newMessages = response.data.results.map((msg) => ({
  //       id: msg.id.toString(),
  //       user: msg.user_name || msg.name || 'Unknown',
  //       user_id: msg.user_id || msg.user,
  //       content: msg.content || '',
  //       image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
  //       file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
  //       file_name: msg.file_name || (msg.file ? msg.file.split('/').pop() : null),
  //       file_size: msg.file_size || null,
  //       emoji: msg.emoji || null,
  //       reply_to: msg.reply_to ? msg.reply_to.toString() : null,
  //       is_deleted: msg.is_deleted || false,
  //       is_sending: false,
  //       is_error: false,
  //       timestamp: msg.timestamp,
  //       time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //       avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
  //       uploadProgress: undefined,
  //     }));
      
  //     if (newMessages.length > 0) {
  //       setMessages((prev) => {
  //         const all = [...newMessages, ...prev];
  //         const seen = new Set();
  //         const unique = all.filter((msg) => {
  //           if (seen.has(msg.id)) return false;
  //           seen.add(msg.id);
  //           return true;
  //         });
  //         const sorted = sortByTimestampDesc(unique);
  //         saveMessagesToCache(sorted);
  //         return sorted;
  //       });
        
  //       const latest = newMessages[0]?.timestamp;
  //       if (latest) {
  //         setLastMessageTimestamp(latest);
  //       }
  //     }
  //   } catch (error) {
  //     // Silent fail
  //   }
  // }, [userId, chatType, receiverId, groupSlug, accountMode, lastMessageTimestamp, saveMessagesToCache]);

 const pollNewMessages = useCallback(async () => {
  if (!userId || !lastMessageTimestamp) return;
  
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    
    let url = `/api/chat/?chat_type=${chatType}&account_mode=${accountMode}`;
    if (chatType === 'single' && receiverId) {
      url += `&receiver=${receiverId}`;
    } else if (chatType === 'group' && groupSlug) {
      url += `&group_slug=${groupSlug}`;
    } else {
      return;
    }
    
    if (lastMessageTimestamp) {
      url += `&after=${encodeURIComponent(lastMessageTimestamp)}`;
    }
    
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    const newMessages = response.data.results.map((msg) => ({
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
      is_sending: false,
      is_error: false,
      timestamp: msg.timestamp,
      time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
      // ✅ CRITICAL FIX: Add user_profile_picture
      user_profile_picture: msg.user_profile_picture || null,
      uploadProgress: undefined,
    }));
    
    if (newMessages.length > 0) {
      setMessages((prev) => {
        const existingIds = new Set(prev.map(msg => msg.id));
        const filteredNew = newMessages.filter(msg => !existingIds.has(msg.id));
        
        if (filteredNew.length === 0) {
          return prev;
        }
        
        const all = [...filteredNew, ...prev];
        const sorted = sortByTimestampDesc(all);
        saveMessagesToCache(sorted);
        return sorted;
      });
      
      const latest = newMessages[0]?.timestamp;
      if (latest) {
        setLastMessageTimestamp(latest);
      }
    }
  } catch (error) {
    // Silent fail
  }
}, [userId, chatType, receiverId, groupSlug, accountMode, lastMessageTimestamp, saveMessagesToCache]);

  useEffect(() => {
    const instantLoad = async () => {
      try {
        // 1. Load from cache instantly
        const hasCache = await loadMessagesFromCache();
        
        // 2. Load user data from cache
        const json = await AsyncStorage.getItem('userData');
        const parsed = json ? JSON.parse(json) : null;
        if (parsed?.id) {
          setUserId(parsed.id);
          const cachedUser = await AsyncStorage.getItem('user_data_cache');
          if (cachedUser) {
            const userData = JSON.parse(cachedUser);
            setUsername(userData.name);
            setUserProfileImage(userData.profile_picture);
          }
        }
        
        setIsLoading(false);
        setIsInitialLoad(false);
        
        // 3. If no cache, fetch fresh data in background
        if (!hasCache) {
          const id = await fetchUserData();
          if (id) {
            await fetchChatHistory(id);
          }
        } else {
          // 4. Background refresh even if cache exists
          const id = parsed?.id || userId;
          if (id) {
            // Small delay to let UI render first
            setTimeout(() => {
              fetchUserData();
              fetchChatHistory(id);
            }, 500);
          }
        }
      } catch (e) {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    
    instantLoad();
  }, []);

  // ==================== POLLING & APP STATE ====================

  useEffect(() => {
    // Start polling when userId is available
    if (userId) {
      // Poll every 5 seconds for new messages (fast updates)
      pollInterval.current = setInterval(() => {
        pollNewMessages();
      }, 5000);
      
      // Also fetch full history periodically (every 30 seconds)
      const fullPollInterval = setInterval(() => {
        fetchChatHistory(userId);
      }, 30000);
      
      return () => {
        clearInterval(pollInterval.current);
        clearInterval(fullPollInterval);
      };
    }
  }, [userId, pollNewMessages, fetchChatHistory]);

  // App state listener - refresh when app comes to foreground
  useEffect(() => {
    appStateListener.current = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && userId) {
        // Refresh messages when app comes to foreground
        fetchChatHistory(userId);
        pollNewMessages();
      }
    });
    
    return () => {
      if (appStateListener.current) {
        appStateListener.current.remove();
      }
    };
  }, [userId, fetchChatHistory, pollNewMessages]);

  // ==================== WEBSOCKET (Real-time updates) ====================

  useEffect(() => {
    const connectWebSocket = async () => {
      if (!accountMode) return;
      if (reconnectAttempts >= maxReconnectAttempts) return;
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !userId) return;
      
      const encodedToken = encodeURIComponent(token);
      let wsUrl;
      if (chatType === 'single') {
        wsUrl = `ws://api.showapp.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`;
      } else {
        wsUrl = `ws://api.showapp.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;
      }
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        setIsWebSocketOpen(true);
        setReconnectAttempts(0);
      };

// ==================== WEBSOCKET MESSAGE HANDLER ====================
ws.current.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.message) {
      // Debug: log incoming WebSocket message
      console.log('WebSocket message received:', {
        id: data.message.id,
        user_profile_picture: data.message.user_profile_picture,
        user_name: data.message.user_name
      });
      
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
        is_error: false,
        timestamp: data.message.timestamp,
        time: new Date(data.message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : null,
        // ✅ CRITICAL FIX: Add user_profile_picture
        user_profile_picture: data.message.user_profile_picture || null,
        uploadProgress: undefined,
        _isFromWebSocket: true,
      };
      
      // Skip messages from current user
      if (newMessage.user_id === userId) {
        if (newMessage.timestamp) {
          setLastMessageTimestamp(newMessage.timestamp);
        }
        return;
      }
      
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) {
          if (newMessage.timestamp) {
            setLastMessageTimestamp(newMessage.timestamp);
          }
          return prev;
        }
        
        const updated = sortByTimestampDesc([newMessage, ...prev]);
        if (newMessage.timestamp) {
          setLastMessageTimestamp(newMessage.timestamp);
        }
        saveMessagesToCache(updated);
        setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: false }), 50);
        return updated;
      });
    }
  } catch (e) {
    console.error('WebSocket message error:', e);
  }
};
      
      ws.current.onerror = () => setIsWebSocketOpen(false);
      ws.current.onclose = () => {
        setIsWebSocketOpen(false);
        setReconnectAttempts((prev) => prev + 1);
        setTimeout(connectWebSocket, 3000 * Math.min(reconnectAttempts + 1, 5));
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

  // ==================== USER STATUS ====================

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(
          `${API_ROUTE}/user-status/${receiverId}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setCurrentStatus(response.data);
        setIsOnline(response.data.is_online);
        setLastSeenDisplay(response.data.last_seen_display);
      } catch (error) {
        // Silent fail
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [receiverId]);

  // ==================== KEYBOARD ====================

  useEffect(() => {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.constants?.Version || 0;
      setIsAndroid15(androidVersion >= 35);
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardVisible(true);
        if (isAndroid15) {
          setKeyboardHeight(event.endCoordinates.height);
        }
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isAndroid15]);

  // ==================== OTHER HOOKS ====================

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
        setAccountMode('business');
      } catch (error) {
        setAccountMode('business');
      }
    };
    loadMode();
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const loadDownloadedFiles = async () => {
      try {
        const saved = await AsyncStorage.getItem(getDownloadedFilesKey());
        if (saved) setDownloadedFiles(JSON.parse(saved));
      } catch (e) {
        // Silent fail
      }
    };
    loadDownloadedFiles();
  }, [getDownloadedFilesKey]);

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

  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  // ==================== HELPERS ====================

  const getWallpaperSource = (chatBackground) => {
    if (!chatBackground) {
      return require('../assets/images/showtheme.jpg');
    }
    
    if (chatBackground.source === 'gallery' && chatBackground.value) {
      return { uri: chatBackground.value };
    } 
    else if (chatBackground.source === 'default' && chatBackground.uri) {
      return { uri: chatBackground.uri };
    } 
    else if (chatBackground.source === 'default' && chatBackground.index !== undefined) {
      const defaultWallpapers = [
        require('../assets/images/showtheme.jpg'),
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
    
    return require('../assets/images/showtheme.jpg');
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFileWithProgress = async (fileUrl, fileName, messageId, autoPreview = false) => {
  try {
    const hasPermission = await checkStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot download file without storage permission');
      return false;
    }

    const downloadDest = Platform.select({
      ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
      android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
    });

    setDownloadingFileId(messageId);
    setDownloadProgress((prev) => ({ ...prev, [messageId]: 0 }));

    const result = await RNFS.downloadFile({
      fromUrl: fileUrl,
      toFile: downloadDest,
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        setDownloadProgress((prev) => ({ ...prev, [messageId]: Math.round(progress) }));
      },
      progressDivider: 1,
    }).promise;

    if (result.statusCode === 200) {
      setDownloadProgress((prev) => ({ ...prev, [messageId]: 100 }));

      setDownloadedFiles((prevFiles) => {
        const updated = { ...prevFiles, [messageId]: downloadDest };
        AsyncStorage.setItem(getDownloadedFilesKey(), JSON.stringify(updated));
        return updated;
      });

      setTimeout(() => {
        setDownloadProgress((prev) => ({ ...prev, [messageId]: undefined }));
        setDownloadingFileId(null);
      }, 1000);

      if (autoPreview) {
        await previewFile(fileUrl, downloadDest);
      } else {
        
        Alert.alert('Success', 'File downloaded successfully');
      }
      return true;
    } else {
      throw new Error('Download failed');
    }
  } catch (error) {
    setDownloadProgress((prev) => ({ ...prev, [messageId]: undefined }));
    setDownloadingFileId(null);
    Alert.alert('Error', 'Failed to download file');
    return false;
  }
};
  const previewFile = async (remoteUrl, localPath) => {
    const localUri = Platform.OS === 'ios' ? `file://${localPath}` : localPath;
    try {
      if (Platform.OS === 'ios') {
        const supported = await Linking.canOpenURL(localUri);
        if (supported) {
          await Linking.openURL(localUri);
          return;
        }
      }
      await Linking.openURL(remoteUrl);
    } catch (e) {
      Alert.alert('Cannot Preview', 'No app on this device can open this file type.');
    }
  };

  // Opens the file if we already have it downloaded; otherwise downloads
  // it once, then opens it. Prevents re-downloading on every tap.
  const openOrDownloadFile = async (fileUrl, fileName, messageId) => {
    const existingPath = downloadedFiles[messageId];
    if (existingPath) {
      const exists = await RNFS.exists(existingPath);
      if (exists) {
        await previewFile(fileUrl, existingPath);
        return;
      }
    }
    await downloadFileWithProgress(fileUrl, fileName, messageId, true);
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
      return 0;
    }
  };

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
  
  // formData.append('group_name', name);
  formData.append('chat_type', 'group');
  formData.append('account_mode', 'business');
  
  if (chatType === 'single') {
    formData.append('receiver', receiverId);
  } else {
    formData.append('group_slug', groupSlug);
  }
  
  // Generate unique temp IDhh
  const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // Create message with temp ID
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
  is_sending: true,
  is_error: false,
  timestamp: new Date().toISOString(),
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  avatar: userProfileImage || null,
  user_profile_picture: userProfileImage || null,
  uploadProgress: undefined,
  _tempId: tempId,
};

  // Add message to UI immediately
  setMessages((prev) => {
    // Check if this temp message already exists
    if (prev.some(msg => msg.id === tempId)) return prev;
    
    const updatedMessages = [newMessage, ...prev];
    saveMessagesToCache(updatedMessages);
    return updatedMessages;
  });

  // Scroll to bottomdd
  setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }), 100);

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    
   
    let lastProgress = 0;
    
    const response = await axiosInstance.post(`/api/chat/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percentCompleted !== lastProgress) {
            lastProgress = percentCompleted;
            setUploadProgress(percentCompleted);
            setMessages((currentMessages) => 
              currentMessages.map(msg => 
                msg.id === tempId 
                  ? { ...msg, uploadProgress: percentCompleted } 
                  : msg
              )
            );
          }
        }
      },
    });
    
    
    if (response.data && response.data.id) {
      setMessages((prev) => {
        const tempIndex = prev.findIndex(msg => msg.id === tempId);
        
        if (tempIndex !== -1) {
          const updatedMessages = [...prev];
          updatedMessages[tempIndex] = {
            ...updatedMessages[tempIndex],
            id: response.data.id.toString(),
            is_sending: false,
            uploadProgress: undefined,
            image: response.data.image ? `${API_ROUTE_IMAGE}${response.data.image}` : updatedMessages[tempIndex].image,
            file: response.data.file ? `${API_ROUTE_IMAGE}${response.data.file}` : updatedMessages[tempIndex].file,
            timestamp: response.data.timestamp || updatedMessages[tempIndex].timestamp,
            _tempId: undefined,
          };
          saveMessagesToCache(updatedMessages);
          return updatedMessages;
        }
        return prev;
      });
      
      // Update lastMessageTimestamp to prevent polling from re-fetching
      if (response.data.timestamp) {
        setLastMessageTimestamp(response.data.timestamp);
      }
    }
    
    // Reset inputs
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
    console.error('Send message error:', error);
    
    // Mark message as failed
    setMessages((prev) => {
      const updatedMessages = prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, is_sending: false, is_error: true } 
          : msg
      );
      saveMessagesToCache(updatedMessages);
      return updatedMessages;
    });
    
    if (error.response?.status === 403) {
      Alert.alert('Sorry', 'You cannot send a message to this user because you are blocked');
    } else if (error.response?.status === 413) {
      Alert.alert('File Too Large', 'The file you\'re trying to send is too large.');
    }
    
  } finally {
    setIsSending(false);
    setUploadProgress(null);
  }
};


  const retrySendMessage = async (failedMessage) => {
    setMessages((prev) => prev.filter(msg => msg.id !== failedMessage.id));
    
    if (failedMessage.image) {
      setSelectedImage({ uri: failedMessage.image });
      setText(failedMessage.content || '');
      setImagePreviewModalVisible(true);
    } else if (failedMessage.file) {
      setSelectedFile({
        uri: failedMessage.file,
        name: failedMessage.file_name,
        size: failedMessage.file_size,
      });
      setFileCaption(failedMessage.content || '');
      setFilePreviewModalVisible(true);
    } else {
      setText(failedMessage.content || '');
      setSelectedEmoji(failedMessage.emoji);
      sendMessage(failedMessage.content || '', failedMessage.emoji);
    }
  };

  // ==================== PICK IMAGE ====================

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

  // ==================== MESSAGE RENDER ====================

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
      
      setMessages(prev => {
        const updated = prev.map(msg =>
          msg.id === messageId.toString() ? {...msg, is_deleted: true} : msg
        );
        saveMessagesToCache(updated);
        return updated;
      });
    } catch (error) {
      // Silent fail
    }
  };

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false);
    sendMessage('', emoji);
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

  const renderMessage = ({ item, index }) => {
    console.log("messages",item)

    console.log('Rendering message:', {
  id: item.id,
  user: item.user,
  user_profile_picture: item.user_profile_picture,
  hasAvatar: !!item.user_profile_picture
});
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
            {/* {!isMyMessage && (
  <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user_id })}>
    <Image
      source={
        chatType === 'single'
          ? (profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR)
          : (item.avatar ? { uri: item.avatar } : FALLBACK_AVATAR)
      }
      style={styles.avatar}
    />
    <Text style={styles.replyUsername}>1,{profile_image}</Text>
    <Text style={styles.replyUsername}>,{item.avatar}</Text>
  
  </TouchableOpacity>
)} */}

{!isMyMessage && (
  <TouchableOpacity 
    onPress={() => {
      // Debug: log what's available
      console.log('Avatar debug:', {
        chatType,
        profile_image,
        item_user_profile_picture: item.user_profile_picture,
        full_url: item.user_profile_picture ? `${API_ROUTE_IMAGE}${item.user_profile_picture}` : null
      });
      
      navigation.navigate('OtherUserProfile', { userId: item.user_id });
    }}
  >
    <Image
      source={
        chatType === 'single'
          ? (profile_image ? { uri: profile_image } : FALLBACK_AVATAR)
          : (item.user_profile_picture 
              ? { uri: `${API_ROUTE_IMAGE}${item.user_profile_picture}` } 
              : FALLBACK_AVATAR)
      }
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
                <TouchableOpacity onPress={() => { setImageViewerUri(item.image); setImageViewerVisible(true); }}>
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
                  style={[
                    styles.fileContainer, 
                    item.is_sending && styles.sendingFile,
                    downloadProgress[item.id] !== undefined && styles.downloadingFile
                  ]}
                  onPress={() => !item.is_sending && openOrDownloadFile(item.file, item.file_name || 'document', item.id)}
                  disabled={item.is_sending || downloadProgress[item.id] !== undefined}
                >
                  <Icon name="insert-drive-file" size={24} color="#128C7E" />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {item.file_name || item.file.split('/').pop()}
                    </Text>
                    {downloadedFiles[item.id] && !downloadProgress[item.id] && (
                      <Text style={styles.fileSize}>Tap to open</Text>
                    )}
                    {!downloadedFiles[item.id] && item.file_size && !downloadProgress[item.id] && (
                      <Text style={styles.fileSize}>{formatFileSize(item.file_size)}</Text>
                    )}
                    {downloadProgress[item.id] !== undefined && (
                      <View style={styles.downloadProgressContainer}>
                        <View style={[styles.downloadProgressBar, { width: `${downloadProgress[item.id]}%` }]} />
                        <Text style={styles.downloadProgressText}>
                          {downloadProgress[item.id] === 100 ? '✓ Downloaded' : `${downloadProgress[item.id]}%`}
                        </Text>
                      </View>
                    )}
                  </View>
                  {item.is_sending ? (
                    <ActivityIndicator size="small" color="#128C7E" />
                  ) : (
                    <View style={styles.fileActionContainer}>
                      {downloadProgress[item.id] === undefined && (
                        <Icon
                          name={downloadedFiles[item.id] ? 'open-in-new' : 'file-download'}
                          size={20}
                          color="#128C7E"
                        />
                      )}
                      {downloadProgress[item.id] === 100 && (
                        <Icon name="check-circle" size={20} color="#4CAF50" />
                      )}
                      {downloadProgress[item.id] !== undefined && downloadProgress[item.id] < 100 && (
                        <ActivityIndicator size="small" color="#128C7E" />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              )}
              {item.emoji && <Text style={styles.emojiMessage}>{item.emoji}</Text>}
              {item.content && (
                <Text style={[styles.messageText, isMyMessage && { color: '#FFF' }]}>{item.content}</Text>
              )}
              
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
                <Text style={styles.timeText}>
                  {new Date(item.timestamp).toLocaleString([], { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
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

  // ==================== CONTEXT MENU ====================

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    message: null,
    position: { x: 0, y: 0 },
  });

  // ==================== RENDER ====================

  const redirectBack = () => {
    navigation.goBack();
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

        
          
    


        {isAndroid15 ? (
          <View style={styles.container}>
            <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <TouchableOpacity onPress={redirectBack} style={styles.headerButton}>
                  <Icon name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.headerProfile}
                  onPress={() => navigation.navigate('OtherUserProfile', { userId: receiverId })}
                >
                  <Image
                    source={chatType === 'single' && profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR}
                    style={styles.headerAvatar}
                  />
                  <View style={{display:'flex',flexDirection:'column'}}>
                    <Text style={styles.headerName}>{name.slice(0, 13) + '...'}</Text>
                    <Text style={styles.userStatus}>
                      {isOnline ? 'Online' : `${lastSeenDisplay}`}
                    </Text>
                  </View>
                </TouchableOpacity> */}
                <TouchableOpacity
              style={[styles.headerProfile, { marginTop: -10 }]}
                onPress={() => navigation.navigate('GroupMembers', {
                  groupSlug: groupSlug,
                  groupName: name
                })}
              
            >
              {/* <Image
                source={chatType === 'group' && profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
                style={styles.headerAvatar}
              /> */}
              <Image
                  source={
                    chatType === 'single' 
                      ? (profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR)
                      : (chatType === 'group' && profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR)
                  }
                  style={styles.headerAvatar}
                />

              
            

              <View>
                  <Text style={[styles.headerName,{marginTop:10}]}>{name}</Text>
                  <Text style={[styles.headerName, {fontSize:12, color:'#f7f7f7ff', fontWeight:'400', marginBottom:10}]}>{members_count || '1+'} Members</Text>
                
              </View>
            
            </TouchableOpacity>
                <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                  {/* <TouchableOpacity
                    onPress={() => navigation.navigate('VoiceCalls', {
                      targetUserId: receiverId,
                      name: name,
                      profile_image: profile_image,
                      roomId: 'unique-room-id',
                      isInitiator: true
                    })}
                    style={[styles.headerButton,{marginLeft:10}]}
                  >
                    <Icon name="call" size={24} color="#FFF" />
                  </TouchableOpacity> */}

                  {/* <TouchableOpacity
                                      onPress={() => navigation.navigate('VideoCalls', {
                                        targetUserId: receiverId,
                                        name: name,
                                        profile_image: profile_image,
                                        roomId: 'unique-room-id',
                                        isInitiator: true
                                      })}
                                      style={styles.headerButton}
                                    >
                                      <Icon name="videocam" size={24} color="#FFF" />
                                    </TouchableOpacity> */}
                                     <TouchableOpacity
                onPress={() => navigation.navigate('GroupMembers', {
                  groupSlug: groupSlug,
                  groupName: name
                })}
              >
                 <Icon name="people" size={24} color="#FFF" />
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
            
            {isLoading && isInitialLoad && (
              <View style={{ padding: 6, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#0d64dd" />
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
              initialNumToRender={20}
              maxToRenderPerBatch={15}
              windowSize={10}
              removeClippedSubviews={true}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
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

            <View style={[
              styles.footer,
              {
                marginBottom: keyboardVisible ? keyboardHeight : 0,
              }
            ]}>
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
                onFocus={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                  }, 200);
                }}
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
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.container}>
              {/* <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
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
                    <View style={{display:'flex',flexDirection:'column'}}>
                      <Text style={styles.headerName}>{name.slice(0, 13) + '...'}</Text>
                      <Text style={styles.userStatus}>
                        {isOnline ? 'Online' : `${lastSeenDisplay}`}
                      </Text>
                    </View>
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
                      style={[styles.headerButton,{marginLeft:10}]}
                    >
                      <Icon name="call" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                                        onPress={() => navigation.navigate('VideoCalls', {
                                          targetUserId: receiverId,
                                          name: name,
                                          profile_image: profile_image,
                                          roomId: 'unique-room-id',
                                          isInitiator: true
                                        })}
                                        style={styles.headerButton}
                                      >
                                        <Icon name="videocam" size={24} color="#FFF" />
                                      </TouchableOpacity>

                    


                  </View>
                </View>
              </LinearGradient> */}

                <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <TouchableOpacity onPress={redirectBack} style={styles.headerButton}>
                  <Icon name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.headerProfile}
                  onPress={() => navigation.navigate('OtherUserProfile', { userId: receiverId })}
                >
                  <Image
                    source={chatType === 'single' && profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR}
                    style={styles.headerAvatar}
                  />
                  <View style={{display:'flex',flexDirection:'column'}}>
                    <Text style={styles.headerName}>{name.slice(0, 13) + '...'}</Text>
                    <Text style={styles.userStatus}>
                      {isOnline ? 'Online' : `${lastSeenDisplay}`}
                    </Text>
                  </View>
                </TouchableOpacity> */}
                <TouchableOpacity
              style={[styles.headerProfile, { marginTop: -10 }]}
                onPress={() => navigation.navigate('GroupMembers', {
                  groupSlug: groupSlug,
                  groupName: name
                })}
              
            >
                <Image
                  source={
                    chatType === 'single' 
                      ? (profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR)
                      : (chatType === 'group' && profile_image ? { uri: `${profile_image}` } : FALLBACK_AVATAR)
                  }
                  style={styles.headerAvatar}
                />
            
              <View>
                  <Text style={[styles.headerName,{marginTop:10}]}>{name}</Text>
                  <Text style={[styles.headerName, {fontSize:12, color:'#f7f7f7ff', fontWeight:'400', marginBottom:10}]}>{members_count || '1+'} Members</Text>
                
              </View>
            
            </TouchableOpacity>
                <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                  {/* <TouchableOpacity
                    onPress={() => navigation.navigate('VoiceCalls', {
                      targetUserId: receiverId,
                      name: name,
                      profile_image: profile_image,
                      roomId: 'unique-room-id',
                      isInitiator: true
                    })}
                    style={[styles.headerButton,{marginLeft:10}]}
                  >
                    <Icon name="call" size={24} color="#FFF" />
                  </TouchableOpacity> */}

                  {/* <TouchableOpacity
                                      onPress={() => navigation.navigate('VideoCalls', {
                                        targetUserId: receiverId,
                                        name: name,
                                        profile_image: profile_image,
                                        roomId: 'unique-room-id',
                                        isInitiator: true
                                      })}
                                      style={styles.headerButton}
                                    >
                                      <Icon name="videocam" size={24} color="#FFF" />
                                    </TouchableOpacity> */}
                                     <TouchableOpacity
                onPress={() => navigation.navigate('GroupMembers', {
                  groupSlug: groupSlug,
                  groupName: name
                })}
              >
                 <Icon name="people" size={24} color="#FFF" />
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

              {isLoading && isInitialLoad && (
                <View style={{ padding: 6, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#0d64dd" />
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
                initialNumToRender={20}
                maxToRenderPerBatch={15}
                windowSize={10}
                removeClippedSubviews={true}
                onContentSizeChange={() => {
                  flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                }}
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
                  onFocus={() => {
                    setTimeout(() => {
                      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                    }, 200);
                  }}
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
            </View>
          </KeyboardAvoidingView>
        )}
        {/* Modals - keep your existing modals */}
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
                          
                          if (result && result.length > 0) {
                            const file = result[0];
                            setSelectedFile(file);
                            setFilePreviewModalVisible(true);
                          }
                        } catch (e) {
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

        <Modal
          transparent={false}
          visible={imagePreviewModalVisible}
          onRequestClose={() => setImagePreviewModalVisible(false)}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
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

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={[styles.previewInputContainer,{marginTop:-30}]}>
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

        <Modal
          transparent={false}
          visible={filePreviewModalVisible}
          onRequestClose={() => setFilePreviewModalVisible(false)}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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

            <View style={{ flex: 1 }}>
              <ScrollView 
                contentContainerStyle={styles.filePreviewScrollContent}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                <View style={styles.fileIconContainer}>
                  <Icon name="insert-drive-file" size={100} color="#0d64dd" />
                </View>
                
                <Text style={[styles.filePreviewName, { color: '#000' }]} numberOfLines={3}>
                  {selectedFile?.name || 'Document'}
                </Text>
                
                {selectedFile?.size && (
                  <Text style={styles.filePreviewSize}>
                    {formatFileSize(selectedFile.size)}
                  </Text>
                )}
                
                {selectedFile?.type?.startsWith('image/') && (
                  <View style={styles.fileImagePreviewContainer}>
                    <Image 
                      source={{ uri: selectedFile.uri }} 
                      style={styles.filePreviewImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
                
                {selectedFile?.type && (
                  <View style={styles.fileTypeBadge}>
                    <Text style={styles.fileTypeText}>
                      {selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

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

        {/* Full-screen image viewer */}
        {/* Full-screen image viewer */}
<Modal
  transparent={false}
  visible={imageViewerVisible}
  onRequestClose={() => {
    setImageViewerVisible(false);
    setIsDownloadingImage(false); // Reset download state
  }}
  animationType="fade"
  presentationStyle="fullScreen"
>
  <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    <View style={styles.previewModalHeader}>
      <TouchableOpacity 
        onPress={() => {
          setImageViewerVisible(false);
          setIsDownloadingImage(false);
        }} 
        style={styles.previewCloseButton}
      >
        <Icon name="close" size={28} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.previewTitle}>Photo</Text>
      <TouchableOpacity
        onPress={async () => {
          if (isDownloadingImage) return; // Prevent multiple downloads
          
          setIsDownloadingImage(true);
          try {
            await downloadFileWithProgress(
              imageViewerUri, 
              `image_${Date.now()}.jpg`, 
              'image_view_' + Date.now()
            );
          } catch (error) {
            Alert.alert('Error', 'Failed to download image');
          } finally {
            setIsDownloadingImage(false);
          }
        }}
        style={styles.previewSendButton}
        disabled={isDownloadingImage}
      >
        {isDownloadingImage ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Icon name="file-download" size={26} color="#FFF" />
        )}
      </TouchableOpacity>
    </View>
    <ScrollView
      contentContainerStyle={styles.previewScrollContent}
      maximumZoomScale={4}
      minimumZoomScale={1}
      bouncesZoom
    >
      {imageViewerUri && (
        <Image source={{ uri: imageViewerUri }} style={styles.previewImage} resizeMode="contain" />
      )}
    </ScrollView>
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
      </ImageBackground>
      {/* <IncomingCallHandler navigation={navigation} route={route} /> */}
    </SafeAreaView>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Platform.OS === 'android' ? 0 : 0,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
    borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
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
  userStatus: {
    fontSize: 12,
    color: '#ffffffff',
    marginTop: 2,
    marginLeft:15
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
    paddingVertical: 10,
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
  sendingMessage: {
    opacity: 0.7,
  },
  sendingFile: {
    opacity: 0.7,
  },
  downloadingFile: {
    opacity: 0.9,
    borderWidth: 1,
    borderColor: '#128C7E',
  },
  downloadProgressContainer: {
    marginTop: 4,
    height: 20,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  downloadProgressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#128C7E',
    borderRadius: 10,
  },
  downloadProgressText: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  fileActionContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  userModalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 15,
  },
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
});









