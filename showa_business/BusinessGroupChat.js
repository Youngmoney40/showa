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
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import { pick, isCancel } from '@react-native-documents/picker';
// import EmojiSelector from 'react-native-emoji-selector';
// import { Swipeable } from 'react-native-gesture-handler';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// const audioRecorderPlayer = new AudioRecorderPlayer();

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
//   const [recording, setRecording] = useState(false);
//   const [recordSecs, setRecordSecs] = useState(0);
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

//   const fetchChatHistory = useCallback(async (userId) => {
//     if (!userId) {
//       //console.error('No userId for fetchChatHistory');
//       return [];
//     }

//     try {
//       //console.log('Fetching chat history...');
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.error('No access token found');
//         return [];
//       }

//       let url = `/api/chat/?chat_type=${chatType}&account_mode=business`;
//       if (chatType === 'single' && receiverId) url += `&receiver=${receiverId}`;
//       else if (chatType === 'group' && groupSlug) url += `&group_slug=${groupSlug}`;
//       else {
//         console.error('Invalid chat parameters:', { chatType, receiverId, groupSlug });
//         return [];
//       }

//       const response = await Promise.race([
//         axiosInstance.get(url, { headers: { Authorization: `Bearer ${token}` } }),
//         new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout')), 8000)),
//       ]);

//       const history = response.data.results?.map((msg) => ({
//   id: msg.id.toString(),
//   user: msg.user_name || msg.name || 'Unknown',
//   user_id: msg.user_id || msg.user,
//   content: msg.content || '',
//   image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
//   file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
//   audio: msg.audio ? `${API_ROUTE_IMAGE}${msg.audio}` : null,
//   emoji: msg.emoji || null,
//   reply_to: msg.reply_to ? msg.reply_to.toString() : null,
//   is_deleted: msg.is_deleted || false,
//   timestamp: msg.timestamp,
//   time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//   avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
// })) || [];

// const uniqueMessages = [...new Map(history.map((msg) => [msg.id, msg])).values()].reverse();

//       console.log('Fetched messages:', uniqueMessages.length);
//       // console.log('Fetched messages:', response.data);
//       saveMessagesToStorage(uniqueMessages);
//       return uniqueMessages;
//     } catch (error) {
//       console.error('Error fetching chat history:', error.response?.data || error.message);
//       return await loadMessagesFromStorage();
//     }
//   }, [chatType, receiverId, groupSlug, accountMode]);

//   useEffect(() => {
//     let isMounted = true;

//     const initialize = async () => {
//       setIsLoading(true);
//       try {
//         const userId = await fetchUserData();
//         if (!userId) {
//           console.error('Failed to fetch userId, redirecting to login');
//           navigation.navigate('Login');
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
//         ? `wss://showa.essential.com.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`
//         : `wss://showa.essential.com.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;

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
//       } catch (error) {
//         console.error('Error playing audio:', error.message);
//         alert('Failed to play audio');
//       }
//     };

//     const stopPlayback = async () => {
//       try {
//         await audioRecorderPlayer.stopPlayer();
//         setIsPlaying(false);
//       } catch (error) {
//         console.error('Error stopping audio:', error.message);
//       }
//     };

//     const formatTime = (ms) => {
//       const seconds = Math.floor(ms / 1000);
//       const minutes = Math.floor(seconds / 60);
//       return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
//     };

//     return (
//       <View style={styles.audioContainer}>
//         <TouchableOpacity
//           onPress={isPlaying ? stopPlayback : startPlayback}
//           style={styles.audioPlayButton}
//         >
//           <Icon name={isPlaying ? 'pause' : 'play-arrow'} size=


// {20} color="#FFFFFF" />
//         </TouchableOpacity>
//         <View style={styles.audioProgress}>
//           <View style={styles.waveformStatic}>
//             {Array(40).fill().map((_, index) => (
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
//           </View>
//           <Text style={styles.audioTime}>
//             {formatTime(currentPosition)} / {formatTime(duration)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderMessage = ({ item, index }) => {
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
//               onPress={() => setUserPopup({ username: item.user, avatar: item.avatar })}
//             >
//               <Image
//                 source={chatType === 'single' && profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : avatarSource}
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
//             {item.audio && <VisualizedAudioPlayer audioUrl={item.audio} />}
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
//     if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji && !recording) return;

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
//             audio: null,
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
//     }
//   };

//   const onStartRecord = async () => {
//     try {
//       const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
//       const result = await check(permission);
//       if (result !== RESULTS.GRANTED && (await request(permission)) !== RESULTS.GRANTED) {
//         alert('Microphone permission denied');
//         return;
//       }
//       await audioRecorderPlayer.startRecorder();
//       audioRecorderPlayer.addRecordBackListener((e) => setRecordSecs(e.currentPosition));
//       setRecording(true);
//     } catch (error) {
//       console.error('Error starting recording:', error.message);
//       alert('Failed to start recording');
//     }
//   };

//   const onStopRecord = async () => {
//     try {
//       const result = await audioRecorderPlayer.stopRecorder();
//       audioRecorderPlayer.removeRecordBackListener();
//       setRecordSecs(0);
//       setRecording(false);

//       const formData = new FormData();
//       formData.append('audio', { uri: result, type: 'audio/m4a', name: result.split('/').pop() || 'audio.m4a' });
//       if (replyToMessage) formData.append('reply_to', replyToMessage.id);
//       formData.append('chat_type', chatType);
//       formData.append('account_mode', accountMode);
//       if (chatType === 'single') formData.append('receiver', receiverId);
//       else formData.append('group_slug', groupSlug);

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
//       if (!token) throw new Error('No access token');

//       await axiosInstance.post(`/api/chat/`, formData, {
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//       });

//       setReplyToMessage(null);
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
//     } catch (error) {
//       console.error('Error sending audio:', error.response?.data || error.message);
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       alert(`Failed to send audio: ${error.message}`);
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
//             <TouchableOpacity onPress={() => navigation.navigate('BusinessHome')} style={[styles.headerButton, { marginTop: -20 }]}>
//               <Icon name="arrow-back" size={24} color="#FFF" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.headerProfile, { marginTop: -20 }]}
//               onPress={() => setUserPopup({ username: name, avatar: profile_image ? `${API_ROUTE_IMAGE}${profile_image}` : null })}
//             >
//               <Image
//                 source={chatType === 'group' && profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
//                 style={styles.headerAvatar}
//               />
//               <View>
//                   <Text style={styles.headerName}>{name}</Text>
//                   <Text style={[styles.headerName, {fontSize:12, color:'#f7f7f7ff', fontWeight:'400'}]}>{members_count || '1+'} Members</Text>
                
//               </View>
            
//             </TouchableOpacity>
//             <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -20 }}>
              
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
//     <View style={styles.emptyChatPlaceholder}>
//       {/* Group Info Section */}
//       <View style={styles.groupInfoContainer}>
//         <View style={styles.groupAvatar}>
//           {/* Placeholder for group avatar */}
//           <Icon name="group" size={48} color="#367BF5" />
//         </View>
//         <Text style={styles.groupName}>
//           {name || "New Group"}
//         </Text>
//         <Text style={styles.groupMembers}>
//           {members_count} {members_count === 1 ? "member" : "members"}
//         </Text>
//       </View>

//       {/* Welcome message */}
//       <Text style={styles.welcomeText}>
//         This is the very beginning of the {name || "group"} conversation.
//       </Text>

//       {/* Encryption info */}
//       <Text style={styles.encryptionText}>
//         Messages are <Text style={{ fontWeight: "bold" }}>end-to-end encrypted 🔒</Text>.{"\n"}
//         No one outside of this chat, not even us, can read or listen to them.
//       </Text>

//       {/* Prompt */}
//       <Text style={styles.startChatPrompt}>
//         Send a message to start the conversation.
//       </Text>
//     </View>
 



//         ) : (
         

//               <FlatList
//             ref={flatListRef}
//             data={[...pendingMessages, ...messages]}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id.toString()}
//             inverted
//             contentContainerStyle={styles.chatContent}
//             keyboardShouldPersistTaps="handled"
//             scrollEnabled={true}
//           />
          
//         )}
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
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//    // backgroundColor: '#e6ddd3',
    
//   },
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 44 : 24,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding:10
//   },
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
//   audioContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     padding: 8,
//     marginBottom: 4,
//     width: 220,
//   },
//   autoMessageLabel: {
//     fontSize: 12,
//     fontStyle: 'italic',
//     color: '#FFF',
//     marginBottom: 4,
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
// filePreviewModalOverlay: {
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick, isCancel } from '@react-native-documents/picker';
import EmojiSelector from 'react-native-emoji-selector';
import { Swipeable } from 'react-native-gesture-handler';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// const audioRecorderPlayer = new AudioRecorderPlayer();

const axiosInstance = axios.create({
  baseURL: `${API_ROUTE}`,
  timeout: 10000, // Timeout set to 10 seconds
});

const options = [
  { id: '1', icon: 'camera-alt', label: 'Camera', color: '#0d64dd', lightColor: '#E8F5E9' },
  { id: '2', icon: 'photo', label: 'Gallery', color: '#0d64dd', lightColor: '#E8F5E9' },
  { id: '3', icon: 'videocam', label: 'Video', color: '#0d64dd', lightColor: '#E8F5E9' },
  { id: '4', icon: 'insert-drive-file', label: 'Document', color: '#0d64dd', lightColor: '#E8F5E9' },
 // { id: '5', icon: 'emoji-emotions', label: 'Emoji', color: '#0d64dd', lightColor: '#E8F5E9' },
];


export default function BusinessChatScreen({ route, navigation }) {
  const { chatType, receiverId, groupSlug, name, profile_image, members_count } = route.params;
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
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [accountMode, setAccountMode] = useState('business');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filePreviewModalVisible, setFilePreviewModalVisible] = useState(false);
const [fileCaption, setFileCaption] = useState('');



const [chatBackground, setChatBackground] = useState(null);
useEffect(() => {
  const loadBackground = async () => {
    const background = await AsyncStorage.getItem('chatBackground');
    if (background) {
      setChatBackground(JSON.parse(background));
    }
  };
  loadBackground();
}, []);


useEffect(() => {
  const backAction = () => {
    navigation.navigate('BusinessHome');
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
  const maxReconnectAttempts = 5;

  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  const saveMessagesToStorage = async (messagesToSave) => {
    try {
      const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(messagesToSave.slice(0, 100)));
      console.log('Messages saved to AsyncStorage:', storageKey);
    } catch (error) {
      console.error('Error saving messages to AsyncStorage:', error.message);
    }
  };

  const pickVideo = async (useCamera = false) => {
  setModalVisible(false);
  try {
    const hasPermission = useCamera ? await checkCameraPermission() : await checkPhotoPermission();
    if (!hasPermission) {
      alert('Permission denied');
      return;
    }
    setIsImageLoading(true);
    const result = await (useCamera ? launchCamera : launchImageLibrary)({ 
      mediaType: 'video', 
      quality: 0.7 
    });
    setIsImageLoading(false);
    if (!result.didCancel && result.assets) {
      setSelectedVideo(result.assets[0]);
      setImagePreviewModalVisible(true);
    }
  } catch (error) {
    setIsImageLoading(false);
    console.error('Error picking video:', error.message);
    alert('Failed to pick video');
  }
};

  const loadMessagesFromStorage = async () => {
    try {
      const storageKey = chatType === 'single' ? `chat_single_${receiverId}` : `chat_group_${groupSlug}`;
      const storedMessages = await AsyncStorage.getItem(storageKey);
      return storedMessages ? JSON.parse(storedMessages) : [];
    } catch (error) {
      console.error('Error loading messages from AsyncStorage:', error.message);
      return [];
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;

      if (!token || !parsed?.id) {
        return null;
      }

      setUserId(parsed.id);
      const response = await axiosInstance.get(`/user/${parsed.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsername(response.data.name || 'Unknown');
      setUserProfileImage(response.data.profile_picture ? `${API_ROUTE_IMAGE}${response.data.profile_picture}` : null);
      console.log('User data fetched:', response.data.name);
      return parsed.id;
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      return null;
    }
  }, []);

  const fetchChatHistory = useCallback(async (userId) => {
    if (!userId) {
      //console.error('No userId for fetchChatHistory');
      return [];
    }

    try {
      //console.log('Fetching chat history...');
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No access token found');
        return [];
      }

      let url = `/api/chat/?chat_type=${chatType}&account_mode=business`;
      if (chatType === 'single' && receiverId) url += `&receiver=${receiverId}`;
      else if (chatType === 'group' && groupSlug) url += `&group_slug=${groupSlug}`;
      else {
        console.error('Invalid chat parameters:', { chatType, receiverId, groupSlug });
        return [];
      }

      const response = await Promise.race([
        axiosInstance.get(url, { headers: { Authorization: `Bearer ${token}` } }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout')), 8000)),
      ]);

      const history = response.data.results?.map((msg) => ({
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
})) || [];

const uniqueMessages = [...new Map(history.map((msg) => [msg.id, msg])).values()].reverse();

      console.log('Fetched messages:', uniqueMessages.length);
      // console.log('Fetched messages:', response.data);
      saveMessagesToStorage(uniqueMessages);
      return uniqueMessages;
    } catch (error) {
      console.error('Error fetching chat history:', error.response?.data || error.message);
      return await loadMessagesFromStorage();
    }
  }, [chatType, receiverId, groupSlug, accountMode]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      setIsLoading(true);
      try {
        const userId = await fetchUserData();
        if (!userId) {
          console.error('Failed to fetch userId, redirecting to login');
          navigation.navigate('Login');
          return;
        }
        const history = await fetchChatHistory(userId);
        if (isMounted) setMessages(history);
      } catch (error) {
        console.error('Initialization error:', error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initialize();
    return () => { isMounted = false; if (ws.current) ws.current.close(); };
  }, [fetchUserData, fetchChatHistory, navigation]);

  useEffect(() => {
    if (!userId || !accountMode) return;

    const connectWebSocket = async () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max WebSocket reconnect attempts reached');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        navigation.navigate('Login');
        return;
      }

      const wsUrl = chatType === 'single'
        ? `wss://showa.essential.com.ng/ws/chat/single/${Math.min(userId, receiverId)}/${Math.max(userId, receiverId)}/${accountMode}/?token=${encodeURIComponent(token)}`
        : `wss://showa.essential.com.ng/ws/chat/group/${groupSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;

      console.log('Connecting WebSocket:', wsUrl);
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket opened');
        setIsWebSocketOpen(true);
        setReconnectAttempts(0);
      };

        ws.current.onmessage = (event) => {
         // console.log("Raw WebSocket data:", event.data);
          try {
            const data = JSON.parse(event.data);
           /// console.log('WebSocket message received:', data);
            
            if (data.message) {
              const newMessage = {
                id: data.message.id.toString(),
                user: data.message.user || username,
                user_id: data.message.user_id || userId,
                content: data.message.content || '',
                image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
                file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
                audio: data.message.audio ? `${API_ROUTE_IMAGE}${data.message.audio}` : null,
                emoji: data.message.emoji || null,
                reply_to: data.message.reply_to ? data.message.reply_to.toString() : null,
                is_deleted: data.message.is_deleted || false,
                is_greeting: data.message.is_greeting || false,
                is_away: data.message.is_away || false,
                timestamp: data.message.timestamp,
                time: new Date(data.message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
              };
              
              // console.log('Processed message:', {
              //   id: newMessage.id,
              //   content: newMessage.content,
              //   is_greeting: newMessage.is_greeting,
              //   is_away: newMessage.is_away,
              //   user: newMessage.user,
              //   user_id: newMessage.user_id,
              //   timestamp: newMessage.timestamp
              // });
              
              setMessages((prev) => {
                if (!prev.some((msg) => msg.id === newMessage.id)) {
                  const updated = [newMessage, ...prev];
                  saveMessagesToStorage(updated);
                  flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
                  return updated;
                }
                return prev;
              });
            } else {
              console.warn('Received WebSocket message without message field:', data);
            }
          } catch (error) {
            console.error('WebSocket message error:', error.message, event.data);
          }
        };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsWebSocketOpen(false);
      };

      ws.current.onclose = () => {
        console.log('WebSocket closed');
        setIsWebSocketOpen(false);
        setTimeout(() => setReconnectAttempts((prev) => prev + 1), 3000);
      };
    };

    connectWebSocket();
    return () => { if (ws.current) ws.current.close(); };
  }, [userId, accountMode, chatType, receiverId, groupSlug, reconnectAttempts]);

  const checkCameraPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const result = await check(permission);
    return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
  };

  const checkPhotoPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const result = await check(permission);
    return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
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
      const result = await (useCamera ? launchCamera : launchImageLibrary)({ mediaType: 'photo', quality: 0.7 });
      setIsImageLoading(false);
      if (!result.didCancel && result.assets) {
        setSelectedImage(result.assets[0]);
        setImagePreviewModalVisible(true);
      }
    } catch (error) {
      setIsImageLoading(false);
      console.error('Error picking image:', error.message);
      alert('Failed to pick image');
    }
  };

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
    setFileCaption('');
    setFilePreviewModalVisible(true);
  } catch (error) {
    if (!isCancel(error)) {
      console.error('Error picking file:', error.message);
      alert('Failed to pick file');
    }
  }
};

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false);
    sendMessage('');
  };

  const getBubbleStyle = (message, index, messages) => {
  const isMyMessage = message.user_id === userId;
  const prevMessage = messages[index - 1];
  const isPrevSameSender = prevMessage && prevMessage.user_id === message.user_id;

  return {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: isPrevSameSender ? 1 : 4,
    backgroundColor: isMyMessage ? '#0653bf' : '#FFFFFF',
    marginLeft: isMyMessage ? 'auto' : 8,
    marginRight: isMyMessage ? 8 : 'auto',
    borderBottomRightRadius: isMyMessage ? 2 : 10,
    borderBottomLeftRadius: isMyMessage ? 10 : 2,
    ...(message.reply_to && { paddingTop: 16 }),
  };
};

  const handleMessageSelect = (message) => {
    if (!message.is_deleted) setReplyToMessage(message);
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
  //     } catch (error) {
  //       console.error('Error playing audio:', error.message);
  //       alert('Failed to play audio');
  //     }
  //   };

  //   const stopPlayback = async () => {
  //     try {
  //       await audioRecorderPlayer.stopPlayer();
  //       setIsPlaying(false);
  //     } catch (error) {
  //       console.error('Error stopping audio:', error.message);
  //     }
  //   };

  //   const formatTime = (ms) => {
  //     const seconds = Math.floor(ms / 1000);
  //     const minutes = Math.floor(seconds / 60);
  //     return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  //   };

  //   return (
  //     <View style={styles.audioContainer}>
  //       <TouchableOpacity
  //         onPress={isPlaying ? stopPlayback : startPlayback}
  //         style={styles.audioPlayButton}
  //       >
  //         <Icon name={isPlaying ? 'pause' : 'play-arrow'} size=


//{20} color="#FFFFFF" />
  //       </TouchableOpacity>
  //       <View style={styles.audioProgress}>
  //         <View style={styles.waveformStatic}>
  //           {Array(40).fill().map((_, index) => (
  //             <View
  //               key={index}
  //               style={[
  //                 styles.waveformBar,
  //                 {
  //                   height: isPlaying ? Math.random() * 12 + 4 : 8,
  //                   backgroundColor: isPlaying ? '#0d64dd' : '#B0BEC5',
  //                 },
  //               ]}
  //             />
  //           ))}
  //         </View>
  //         <Text style={styles.audioTime}>
  //           {formatTime(currentPosition)} / {formatTime(duration)}
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

  const renderMessage = ({ item, index }) => {
  if (!userId) return null;

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

  const repliedToMessage = item.reply_to ? messages.find((msg) => msg.id === item.reply_to) : null;

  return (
    <Swipeable renderRightActions={() => renderRightActions(item)} overshootRight={false}>
      <TouchableOpacity
        onPress={() => handleMessageSelect(item)}
        onLongPress={() => handleMessageSelect(item)}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.messageContainer,
            isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
          ]}
        >
          {!isMyMessage && (
            <TouchableOpacity
              onPress={() => setUserPopup({ username: item.user, avatar: item.avatar })}
            >
              <Image
                source={chatType === 'single' && profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : avatarSource}
                style={styles.avatar}
              />
            </TouchableOpacity>
          )}
          <View
            style={[
              getBubbleStyle(item, index, messages),
              item.is_greeting && { backgroundColor: '#0d64dd', opacity: 0.8 }, 
              item.is_away && { backgroundColor: '#ff9800', opacity: 0.8 }, 
            ]}
          >
            {(item.is_greeting || item.is_away) && (
              <Text style={styles.autoMessageLabel}>
                {item.is_greeting ? 'Greeting' : 'Away'} Message
              </Text>
            )}
            {repliedToMessage && (
              <View style={styles.replyContainer}>
                <Text style={styles.replyUsername}>{repliedToMessage.user}</Text>
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
            {item.video && (
                <TouchableOpacity onPress={() => Linking.openURL(item.video)}>
                  <View style={styles.videoContainer}>
                    <Icon name="play-circle-filled" size={50} color="#FFF" style={styles.videoPlayIcon} />
                    <Text style={styles.videoLabel}>Video Message</Text>
                  </View>
                </TouchableOpacity>
              )}
            {/* <View style={styles.messageFooter}>
              <Text style={styles.timeText}>{item.time}</Text>
              {isMyMessage && (
                <Icon
                  name={item.id.startsWith('m') ? 'access-time' : 'done-all'}
                  size={12}
                  color={item.id.startsWith('m') ? '#999' : '#0d64dd'}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View> */}
            <View style={styles.messageFooter}>
              <Text style={[styles.timeText, isMyMessage && styles.myMessageTime]}>{item.time}</Text>
                {isMyMessage && (
                  <Icon
                    name={item.id.startsWith('m') ? 'access-time' : 'done-all'}
                    size={12}
                    color={item.id.startsWith('m') ? '#999' : '#FFF'}
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

  const sendMessage = async (caption = '') => {
    // if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji && !recording) return;
    if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji) return;

    const formData = new FormData();
    if (caption.trim()) formData.append('content', caption.trim());
    if (selectedEmoji) formData.append('emoji', selectedEmoji);
    if (replyToMessage) formData.append('reply_to', replyToMessage.id);
    if (selectedImage) {
      formData.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName || 'image.jpg',
      });
    }
    if (selectedFile) {
        formData.append('content', fileCaption || '');
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      });
    }
    if (selectedVideo) {
    formData.append('video', {
      uri: selectedVideo.uri,
      type: selectedVideo.type,
      name: selectedVideo.fileName || 'video.mp4',
    });
  }
    setFileCaption('');
    formData.append('chat_type', chatType);
    formData.append('account_mode', accountMode);
    if (chatType === 'single') formData.append('receiver', receiverId);
    else formData.append('group_slug', groupSlug);

    const tempId = 'm' + Date.now();
      if (caption.trim() || selectedImage || selectedFile || selectedEmoji) {
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
      if (!token) throw new Error('No access token');

      if (selectedImage || selectedFile || (!caption.trim() && !selectedEmoji)) {
        const response = await axiosInstance.post(`/api/chat/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        console.log('Message sent via API:', response.data);
      } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          action: 'send',
          content: caption.trim() || null,
          emoji: selectedEmoji || null,
          reply_to: replyToMessage ? replyToMessage.id : null,
          chat_type: chatType,
          receiver_id: chatType === 'single' ? receiverId : null,
          group_slug: chatType === 'group' ? groupSlug : null,
          user_id: userId,
          account_mode: accountMode,
        }));
      } else {
        const response = await axiosInstance.post(`/api/chat/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        console.log('Message sent via API:', response.data);
      }

      setText('');
      setSelectedImage(null);
      setSelectedFile(null);
      setSelectedEmoji(null);
      setReplyToMessage(null);
      setImagePreviewModalVisible(false);
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      alert(`Failed to send message: ${error.message}`);
    }
  };

  // const onStartRecord = async () => {
  //   try {
  //     const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
  //     const result = await check(permission);
  //     if (result !== RESULTS.GRANTED && (await request(permission)) !== RESULTS.GRANTED) {
  //       alert('Microphone permission denied');
  //       return;
  //     }
  //     await audioRecorderPlayer.startRecorder();
  //     audioRecorderPlayer.addRecordBackListener((e) => setRecordSecs(e.currentPosition));
  //     setRecording(true);
  //   } catch (error) {
  //     console.error('Error starting recording:', error.message);
  //     alert('Failed to start recording');
  //   }
  // };

  // const onStopRecord = async () => {
  //   try {
  //     const result = await audioRecorderPlayer.stopRecorder();
  //     audioRecorderPlayer.removeRecordBackListener();
  //     setRecordSecs(0);
  //     setRecording(false);

  //     const formData = new FormData();
  //     formData.append('audio', { uri: result, type: 'audio/m4a', name: result.split('/').pop() || 'audio.m4a' });
  //     if (replyToMessage) formData.append('reply_to', replyToMessage.id);
  //     formData.append('chat_type', chatType);
  //     formData.append('account_mode', accountMode);
  //     if (chatType === 'single') formData.append('receiver', receiverId);
  //     else formData.append('group_slug', groupSlug);

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
  //     if (!token) throw new Error('No access token');

  //     await axiosInstance.post(`/api/chat/`, formData, {
  //       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  //     });

  //     setReplyToMessage(null);
  //     setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
  //     flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  //   } catch (error) {
  //     console.error('Error sending audio:', error.response?.data || error.message);
  //     setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
  //     alert(`Failed to send audio: ${error.message}`);
  //   }
  // };

  const handleChatPrivate = (username) => {
    setUserPopup(null);
    alert(`Private chat with ${username} (not implemented)`);
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#0d64dd" />
  //     </View>
  //   );
  // }

  return (
    <ImageBackground
      source={chatBackground ? { uri: chatBackground.value } : require('../assets/images/backroundsplash.png')}
      style={[styles.container, {}]}
      resizeMode="cover"
    >
      {/* <KeyboardAwareScrollView
       style={styles.container}
  contentContainerStyle={{ flex: 1 }} // Ensures full height
  enableOnAndroid={true} // Better Android support
  extraScrollHeight={20} // Extra space above keyboard
  keyboardShouldPersistTaps="handled"
        
      > */}
        <View style={styles.contentContainer}>
          <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('BusinessHome')} style={[styles.headerButton, { marginTop: -20 }]}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerProfile, { marginTop: -20 }]}
              onPress={() => setUserPopup({ username: name, avatar: profile_image ? `${API_ROUTE_IMAGE}${profile_image}` : null })}
            >
              <Image
                source={chatType === 'group' && profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
                style={styles.headerAvatar}
              />
              <View>
                  <Text style={styles.headerName}>{name}</Text>
                  <Text style={[styles.headerName, {fontSize:12, color:'#f7f7f7ff', fontWeight:'400'}]}>{members_count || '1+'} Members</Text>
                
              </View>
            
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -20 }}>
              
            </View>
          </View>
        </LinearGradient>

         <View style={styles.chatContainer}>

          <KeyboardAwareScrollView
           nestedScrollEnabled={true}
        style={styles.chatScrollContainer}
        contentContainerStyle={styles.chatScrollContent}
        extraScrollHeight={20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
  {messages.length === 0 && pendingMessages.length === 0 ? (
    <View style={styles.emptyChatPlaceholder}>
      {/* Group Info Section */}
      <View style={styles.groupInfoContainer}>
        <View style={styles.groupAvatar}>
          {/* Placeholder for group avatar */}
          <Icon name="group" size={48} color="#367BF5" />
        </View>
        <Text style={styles.groupName}>
          {name || "New Group"}
        </Text>
        <Text style={styles.groupMembers}>
          {members_count} {members_count === 1 ? "member" : "members"}
        </Text>
      </View>

      {/* Welcome message */}
      <Text style={styles.welcomeText}>
        This is the very beginning of the {name || "group"} conversation.
      </Text>

      {/* Encryption info */}
      <Text style={styles.encryptionText}>
        Messages are <Text style={{ fontWeight: "bold" }}>end-to-end encrypted 🔒</Text>.{"\n"}
        No one outside of this chat, not even us, can read or listen to them.
      </Text>

      {/* Prompt */}
      <Text style={styles.startChatPrompt}>
        Send a message to start the conversation.
      </Text>
    </View>
 



        ) : (
         

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
          
        )}
        </KeyboardAwareScrollView>
        </View>

        {replyToMessage && (
          <View style={styles.replyPreview}>
            <View style={styles.replyPreviewContent}>
              <Text style={styles.replyPreviewUsername}>{replyToMessage.user}</Text>
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
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.attachButton}>
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
  <TouchableOpacity onPress={() => sendMessage(text)} style={styles.sendButton}>
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
    <Icon name="mic" size={24} color="#ccc" />
  </TouchableOpacity>
)}
        </View>

        <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
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
  else if (item.label === 'Video') pickVideo(false);
  else if (item.label === 'Document') pickFile();
  else if (item.label === 'Emoji') {
    setEmojiPickerVisible(true);
    setModalVisible(false);
  }
}}
                >
                  <View style={[styles.optionIconContainer, { backgroundColor: item.lightColor }]}>
                    <Icon name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <Modal transparent visible={isImageLoading} onRequestClose={() => {}}>
          <View style={styles.loadingModalOverlay}>
            <View style={styles.loadingModalContent}>
              <ActivityIndicator size="large" color="#0d64dd" />
            </View>
          </View>
        </Modal>

        <Modal transparent visible={imagePreviewModalVisible} onRequestClose={() => setImagePreviewModalVisible(false)}>
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
                <TouchableOpacity onPress={() => sendMessage(text)} style={styles.imagePreviewSendButton}>
                  <Icon name="send" size={24} color="#0d64dd" />
                </TouchableOpacity>
              </View>
              {selectedImage && <Image source={{ uri: selectedImage.uri }} style={styles.imagePreviewImage} resizeMode="contain" />}
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

        <Modal transparent visible={emojiPickerVisible} onRequestClose={() => setEmojiPickerVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setEmojiPickerVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.emojiPickerContainer}>
                <EmojiSelector onEmojiSelected={selectEmoji} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal transparent visible={!!userPopup} onRequestClose={() => setUserPopup(null)}>
          <TouchableWithoutFeedback onPress={() => setUserPopup(null)}>
            <View style={styles.userModalOverlay}>
              <View style={styles.userModalContent}>
                <Image source={userPopup?.avatar ? { uri: userPopup.avatar } : FALLBACK_AVATAR} style={styles.userModalAvatar} />
                <Text style={styles.userModalUsername}>{userPopup?.username || 'Unknown'}</Text>
                <View style={styles.userModalButtons}>
                  <TouchableOpacity style={styles.userModalButton} onPress={() => setUserPopup(null)}>
                    <Text style={styles.userModalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.userModalButton, styles.userModalChatButton]} onPress={() => handleChatPrivate(userPopup?.username)}>
                    <Text style={styles.userModalButtonText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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

        </View>
        
      {/* </KeyboardAwareScrollView> */}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: '#e6ddd3',
    
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:10
  },
  chatScrollContainer: {
    flex: 1,
  },
  chatScrollContent: {
    flexGrow: 1,
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
  contentContainer: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
    marginBottom: 70, 
  },
  headerName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  chatContent: {
    flexGrow: 1,
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
    color: '#128C7E',
  },
  replyPreviewText: {
    fontSize: 12,
    color: '#666',
  },
  //// remove to place chat on top
   chatContainer: {
    flex: 1,
    paddingBottom: 70, 
  },
  chatContent: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
 footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
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
    paddingVertical: 8,
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
  timeText: {
  fontSize: 12,
  color: '#000',
  marginTop: 2,
},
myMessageTime: {
  color: '#cecccaff',
},
messageFooter: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
},
emptyChatPlaceholder: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 30,
  paddingVertical: 40,
  backgroundColor: "#fafafa",
  margin: 20,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#ddd",
},

groupInfoContainer: {
  alignItems: "center",
  marginBottom: 24,
},

groupAvatar: {
  backgroundColor: "#e6f0ff",
  borderRadius: 40,
  width: 80,
  height: 80,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 12,
},

groupName: {
  fontSize: 20,
  fontWeight: "700",
  color: "#222",
  marginBottom: 4,
},

groupMembers: {
  fontSize: 14,
  color: "#555",
},

welcomeText: {
  fontSize: 15,
  color: "#444",
  textAlign: "center",
  marginBottom: 20,
},

encryptionText: {
  fontSize: 13,
  color: "#666",
  textAlign: "center",
  lineHeight: 20,
  marginBottom: 20,
},

startChatPrompt: {
  fontSize: 14,
  color: "#1976D2",
  fontWeight: "600",
  textAlign: "center",
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
  autoMessageLabel: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#FFF',
    marginBottom: 4,
  },
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
videoContainer: {
  width: 200,
  height: 150,
  backgroundColor: '#000',
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 4,
},
videoPlayIcon: {
  opacity: 0.8,
},
videoLabel: {
  color: '#FFF',
  marginTop: 8,
},
});








