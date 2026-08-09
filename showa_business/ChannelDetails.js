

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   Image,
//   TextInput,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   ImageBackground,
//   ActivityIndicator,
//   Alert,
//   Linking,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import { pick, isCancel } from '@react-native-documents/picker';
// import EmojiSelector from 'react-native-emoji-selector';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { useTheme } from '../src/context/ThemeContext';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const axiosInstance = axios.create({
//   baseURL: `${API_ROUTE}`,
//   timeout: 30000,
// });

// const options = [
//   { 
//     id: '1', 
//     icon: 'camera-alt', 
//     label: 'Camera', 
//     color: '#FFFFFF', 
//     backgroundColor: '#0d64dd' 
//   },
//   { 
//     id: '2', 
//     icon: 'image', 
//     label: 'Gallery', 
//     color: '#FFFFFF', 
//     backgroundColor: '#4CAF50' 
//   },
//   { 
//     id: '3', 
//     icon: 'insert-drive-file', 
//     label: 'Document', 
//     color: '#FFFFFF', 
//     backgroundColor: '#FF9800' 
//   },
// ];

// export default function ChannelAdminScreen({ route, navigation }) {
//   const { channelSlug, followers, name, InviteLink, profile_image } = route.params || {};
//   const { colors, isDark } = useTheme();

//   const [messages, setMessages] = useState([]);
//   const [pendingMessages, setPendingMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [imagePreviewModalVisible, setImagePreviewModalVisible] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
//   const [username, setUsername] = useState('');
//   const [userId, setUserId] = useState(null);
//   const [userProfileImage, setUserProfileImage] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedEmoji, setSelectedEmoji] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [accountMode] = useState('business');
//   const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
//   const [reactionPickerForMessage, setReactionPickerForMessage] = useState(null);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [fullscreenImage, setFullscreenImage] = useState(null);
//   const [error, setError] = useState(null);

//   const POST_WIDTH = Math.min(SCREEN_WIDTH - 32, 600);
//   const CONTENT_MAX_WIDTH = POST_WIDTH - 24;

//   const openMenu = () => setMenuVisible(true);
//   const closeMenu = () => setMenuVisible(false);

//   const flatListRef = useRef();
//   const ws = useRef(null);

//   const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;

//       if (!token || !parsed?.id) {
//         navigation.navigate('Login');
//         return null;
//       }

//       setUserId(parsed.id);
//       const response = await axiosInstance.get(`/user/${parsed.id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 15000,
//       });

//       setUsername(response.data.name || 'Admin');
//       setUserProfileImage(response.data.profile_picture ? `${API_ROUTE_IMAGE}${response.data.profile_picture}` : null);
//       return parsed.id;
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       setError('Failed to load user data');
//       return null;
//     }
//   };

//   const fetchChannelMessages = async (userId) => {
//     if (!userId) return [];

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return [];

//       const response = await axiosInstance.get(
//         `/api/chat/?chat_type=channel&account_mode=${accountMode}&channel_slug=${channelSlug}`,
//         { 
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           timeout: 15000,
//         }
//       );

//       if (!response.data?.results) {
//         return [];
//       }

//       const messagesWithReactions = await Promise.all(
//         response.data.results.map(async (msg) => {
//           try {
//             const reactionsResponse = await axiosInstance.get(
//               `/get-messages-reactions/${msg.id}/`,
//               { 
//                 headers: { Authorization: `Bearer ${token}` },
//                 timeout: 10000,
//               }
//             );
            
//             return {
//               id: msg.id?.toString() || `msg_${Date.now()}`,
//               user: msg.user_name || msg.name || 'Admin',
//               user_id: msg.user_id || msg.user,
//               content: msg.content || '',
//               image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
//               file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
//               emoji: msg.emoji || null,
//               is_deleted: msg.is_deleted || false,
//               timestamp: msg.timestamp || new Date().toISOString(),
//               avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
//               is_channel_post: true,
//               reactions: reactionsResponse.data || [],
//               reaction_count: reactionsResponse.data?.length || 0,
//             };
//           } catch (error) {
//             console.error('Error fetching reactions:', error);
//             return {
//               id: msg.id?.toString() || `msg_${Date.now()}`,
//               user: msg.user_name || msg.name || 'Admin',
//               user_id: msg.user_id || msg.user,
//               content: msg.content || '',
//               image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
//               file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
//               emoji: msg.emoji || null,
//               is_deleted: msg.is_deleted || false,
//               timestamp: msg.timestamp || new Date().toISOString(),
//               avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
//               is_channel_post: true,
//               reactions: [],
//               reaction_count: 0,
//             };
//           }
//         })
//       );

//       return messagesWithReactions.reverse();
//     } catch (error) {
//       console.error('Error fetching channel messages:', error);
//       setError('Failed to load messages');
//       return [];
//     }
//   };

//   useEffect(() => {
//     let isMounted = true;
//     let timeoutId;

//     const initialize = async () => {
//       if (!isMounted) return;
      
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         const userId = await fetchUserData();
//         if (!userId) {
//           if (isMounted) setIsLoading(false);
//           return;
//         }
        
//         const messages = await fetchChannelMessages(userId);
//         if (isMounted) {
//           setMessages(messages);
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error('Initialization error:', error);
//         if (isMounted) {
//           setError('Failed to initialize channel');
//           setIsLoading(false);
//         }
//       }
//     };

//     timeoutId = setTimeout(() => {
//       if (isMounted && isLoading) {
//         setError('Loading is taking longer than expected');
//         setIsLoading(false);
//       }
//     }, 30000);

//     initialize();

//     return () => {
//       isMounted = false;
//       clearTimeout(timeoutId);
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, [navigation]);

//   useEffect(() => {
//     if (!userId || !accountMode || !channelSlug) return;

//     const connectWebSocket = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         if (!token) {
//           return;
//         }

//         const wsUrl = `ws://api.showapp.ng/ws/chat/channel/${channelSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;
        
//         ws.current = new WebSocket(wsUrl);

//         ws.current.onopen = () => {
//           setIsWebSocketOpen(true);
//         };

//         ws.current.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data);
//             if (data.message) {
//               const newMessage = {
//                 id: data.message.id?.toString() || `ws_${Date.now()}`,
//                 user: data.message.user || username,
//                 user_id: data.message.user_id || userId,
//                 content: data.message.content || '',
//                 image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
//                 file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
//                 emoji: data.message.emoji || null,
//                 is_deleted: data.message.is_deleted || false,
//                 timestamp: data.message.timestamp || new Date().toISOString(),
//                 avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
//                 is_channel_post: true,
//                 reactions: data.message.reactions || [],
//                 reaction_count: data.message.reaction_count || 0,
//               };

//               setMessages((prev) => {
//                 if (!prev.some((msg) => msg.id === newMessage.id)) {
//                   return [newMessage, ...prev];
//                 }
//                 return prev;
//               });
//             }
//           } catch (error) {
//             console.error('WebSocket message error:', error);
//           }
//         };

//         ws.current.onerror = (error) => {
//           setIsWebSocketOpen(false);
//         };

//         ws.current.onclose = () => {
//           setIsWebSocketOpen(false);
//         };
//       } catch (error) {
//         console.error('WebSocket connection error:', error);
//       }
//     };

//     connectWebSocket();

//     return () => {
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, [userId, accountMode, channelSlug, username, userProfileImage]);

//   const checkCameraPermission = async () => {
//     try {
//       const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
//       const result = await check(permission);
//       return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
//     } catch (error) {
//       console.error('Camera permission error:', error);
//       return false;
//     }
//   };

//   const checkPhotoPermission = async () => {
//     try {
//       const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
//       const result = await check(permission);
//       return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
//     } catch (error) {
//       console.error('Photo permission error:', error);
//       return false;
//     }
//   };

//   const pickImage = async (useCamera = false) => {
//     setModalVisible(false);
//     try {
//       const hasPermission = useCamera ? await checkCameraPermission() : await checkPhotoPermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Required', 'Camera/Gallery permission is required to continue');
//         return;
//       }
//       setIsImageLoading(true);
      
//       const options = {
//         mediaType: 'photo',
//         quality: 0.8,
//         includeBase64: false,
//         maxWidth: 1024,
//         maxHeight: 1024,
//       };

//       const result = useCamera 
//         ? await launchCamera(options)
//         : await launchImageLibrary(options);
        
//       setIsImageLoading(false);
      
//       if (!result.didCancel && result.assets && result.assets.length > 0) {
//         setSelectedImage(result.assets[0]);
//         setImagePreviewModalVisible(true);
//       }
//     } catch (error) {
//       setIsImageLoading(false);
//       Alert.alert('Error', 'Failed to select image: ' + error.message);
//     }
//   };

//   const pickFile = async () => {
//     setModalVisible(false);
//     try {
//       const result = await pick({
//         allowMultiSelection: false,
//         presentationStyle: 'fullScreen',
//         copyTo: 'cachesDirectory',
//       });
      
//       if (result && result.length > 0) {
//         const file = result[0];
//         setSelectedFile({
//           uri: file.uri,
//           name: file.name || 'document',
//           type: file.type || 'application/octet-stream',
//           size: file.size,
//         });
//         sendMessage('');
//       }
//     } catch (error) {
//       if (!isCancel(error)) {
//         Alert.alert('File Selection Error', 'Failed to select file');
//       }
//     }
//   };

//   const selectEmoji = (emoji) => {
//     setSelectedEmoji(emoji);
//     setEmojiPickerVisible(false);
//     sendMessage('');
//   };

//   const sendMessage = async (caption = '') => {
//     if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji) return;

//     const formData = new FormData();
//     if (caption.trim()) formData.append('content', caption.trim());
//     if (selectedEmoji) formData.append('emoji', selectedEmoji);
//     if (selectedImage) {
//       formData.append('image', {
//         uri: selectedImage.uri,
//         type: selectedImage.type || 'image/jpeg',
//         name: selectedImage.fileName || `image_${Date.now()}.jpg`,
//       });
//     }
//     if (selectedFile) {
//       formData.append('file', {
//         uri: selectedFile.uri,
//         type: selectedFile.type || 'application/octet-stream',
//         name: selectedFile.name || `file_${Date.now()}`,
//       });
//     }
    
//     formData.append('chat_type', 'channel');
//     formData.append('account_mode', 'business');
//     formData.append('channel_slug', channelSlug);
//     formData.append('is_channel_post', 'true');

//     const tempId = 'm' + Date.now();
//     if (caption.trim() || selectedImage || selectedFile || selectedEmoji) {
//       setPendingMessages((prev) => [
//         {
//           id: tempId,
//           user: username,
//           user_id: userId,
//           content: caption.trim() || null,
//           image: selectedImage ? selectedImage.uri : null,
//           file: selectedFile ? selectedFile.uri : null,
//           emoji: selectedEmoji || null,
//           is_deleted: false,
//           timestamp: new Date().toISOString(),
//           avatar: userProfileImage || null,
//           is_channel_post: true,
//           channel: channelSlug,
//           reactions: [],
//           reaction_count: 0,
//         },
//         ...prev,
//       ]);
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) throw new Error('No access token');

//       const response = await axiosInstance.post(`/api/chat/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//           Accept: 'application/json',
//         },
//         timeout: 30000,
//       });

//       setText('');
//       setSelectedImage(null);
//       setSelectedFile(null);
//       setSelectedEmoji(null);
//       setImagePreviewModalVisible(false);
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//     } catch (error) {
//       setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       Alert.alert('Send Error', `Failed to send message: ${error.message}`);
//     }
//   };

//   const handleReaction = async (messageId, emoji) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) throw new Error('No access token');

//       await axiosInstance.post(
//         `/messages/${messageId}/reactions/`,
//         { emoji },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const response = await axiosInstance.get(
//         `/get-messages-reactions/${messageId}/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMessages(prev => prev.map(msg => 
//         msg.id === messageId.toString() ? {
//           ...msg,
//           reactions: response.data || [],
//           reaction_count: response.data?.length || 0
//         } : msg
//       ));

//     } catch (error) {
//       Alert.alert('Reaction Error', 'Failed to add reaction');
//     }
//   };

//   const deleteMessage = async (messageId) => {
//     Alert.alert(
//       'Delete Message',
//       'Are you sure you want to delete this message? This action cannot be undone.',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem('userToken');
//               if (!token) throw new Error('No access token');

//               const response = await axiosInstance.delete(`/delete-channel-message/${messageId}/`, {
//                 headers: { Authorization: `Bearer ${token}` },
//                 timeout: 15000,
//               });

//               if (response.data.message) {
//                 setMessages(prev => prev.map(msg => 
//                   msg.id === messageId.toString() ? { ...msg, is_deleted: true } : msg
//                 ));
//               } else {
//                 throw new Error('Unexpected server response');
//               }
//             } catch (error) {
//               let errorMessage = 'Failed to delete message';
//               if (error.response?.data?.error) {
//                 errorMessage = error.response.data.error;
//               }
//               Alert.alert('Error', errorMessage);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const showReactionPicker = (messageId) => {
//     if (reactionPickerForMessage === messageId) {
//       setReactionPickerForMessage(null);
//       return;
//     }
//     setReactionPickerForMessage(messageId);
//   };

//   const renderReactionPicker = (messageId) => {
//     if (!reactionPickerForMessage || reactionPickerForMessage !== messageId) return null;

//     return (
//       <Modal
//         transparent={true}
//         visible={true}
//         animationType="slide"
//         onRequestClose={() => setReactionPickerForMessage(null)}
//       >
//         <TouchableWithoutFeedback onPress={() => setReactionPickerForMessage(null)}>
//           <View style={[styles.reactionModalOverlay, { backgroundColor: colors.overlay || 'rgba(0,0,0,0.5)' }]}>
//             <View style={[styles.reactionModalContainer, { backgroundColor: colors.card || '#FFFFFF' }]}>
//               <View style={styles.reactionPicker}>
//                 <EmojiSelector
//                   onEmojiSelected={(emoji) => {
//                     handleReaction(reactionPickerForMessage, emoji);
//                     setReactionPickerForMessage(null);
//                   }}
//                   showSearchBar={false}
//                   showHistory={false}
//                   showSectionTitles={false}
//                   columns={8}
//                 />
//               </View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     );
//   };

//   const renderMessage = ({ item }) => {
//     const timeString = new Date(item.timestamp).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//     const isMyMessage = item.user_id === userId;

//     if (item.is_deleted) {
//       return (
//         <View style={[styles.messageContainer, { width: POST_WIDTH, backgroundColor: colors.card || '#FFFFFF' }]}>
//           <Text style={[styles.deletedMessage, { color: colors.textSecondary || '#999' }]}>
//             This message was deleted
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.messageWrapper}>
//         <View 
//           style={[
//             styles.messageContainer,
//             { 
//               width: POST_WIDTH,
//               backgroundColor: colors.card || '#FFFFFF',
//               shadowColor: colors.shadow || '#000',
//             },
//             styles.channelPost
//           ]}
//         >
//           {isMyMessage && (
//             <TouchableOpacity 
//               style={styles.messageMenuButton}
//               onPress={() => deleteMessage(item.id)}
//             >
//               <Icon name="more-vert" size={20} color={colors.textSecondary || '#666'} />
//             </TouchableOpacity>
//           )}
          
//           <TouchableOpacity 
//             onLongPress={() => showReactionPicker(item.id)}
//             onPress={() => {
//               if (item.image) {
//                 setFullscreenImage(item.image);
//               } else {
//                 setReactionPickerForMessage(null);
//               }
//             }}
//             activeOpacity={0.8}
//             delayLongPress={300}
//             style={styles.messageContent}
//           >
//             {item.image && (
//               <Image 
//                 source={{ uri: item.image }} 
//                 style={[
//                   styles.messageImage,
//                   { width: CONTENT_MAX_WIDTH, height: CONTENT_MAX_WIDTH * 0.75 }
//                 ]} 
//                 resizeMode="cover"
//               />
//             )}
//             {item.file && (
//               <TouchableOpacity
//                 style={[styles.fileContainer, { 
//                   width: CONTENT_MAX_WIDTH,
//                   backgroundColor: colors.backgroundSecondary || '#F5F7FA'
//                 }]}
//                 onPress={() => Linking.openURL(item.file).catch(() => Alert.alert('Error', 'Cannot open file'))}
//               >
//                 <View style={styles.fileContent}>
//                   <Icon name="insert-drive-file" size={20} color="#2196F3" />
//                   <Text style={[styles.fileName, { color: colors.text || '#333' }]} numberOfLines={1}>
//                     {item.file.split('/').pop()}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//             {item.emoji && (
//               <View style={[styles.emojiContainer, { width: CONTENT_MAX_WIDTH }]}>
//                 <Text style={styles.emojiMessage}>{item.emoji}</Text>
//               </View>
//             )}
//             {item.content && (
//               <View style={[styles.textContainer, { width: CONTENT_MAX_WIDTH }]}>
//                 <Text style={[styles.messageText, { color: colors.text || '#333' }]}>
//                   {item.content}
//                 </Text>
//                 <Text style={[styles.timestamp, { color: colors.textSecondary || '#777' }]}>
//                   {timeString}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           {item.reactions?.length > 0 && (
//             <View style={styles.reactionsContainer}>
//               <View style={[styles.reactionsBubble, { backgroundColor: colors.backgroundSecondary || 'rgba(0,0,0,0.06)' }]}>
//                 {item.reactions.slice(0, 3).map((reaction, index) => (
//                   <Text key={index} style={styles.reactionEmoji}>
//                     {reaction.emoji}
//                   </Text>
//                 ))}
//                 {item.reactions.length > 3 && (
//                   <Text style={[styles.reactionCount, { color: colors.textSecondary || '#666' }]}>
//                     +{item.reactions.length - 3}
//                   </Text>
//                 )}
//               </View>
//             </View>
//           )}
//         </View>
//         {renderReactionPicker(item.id)}
//       </View>
//     );
//   };

//   const handleRetry = () => {
//     setError(null);
//     setIsLoading(true);
    
//     fetchUserData().then(userId => {
//       if (userId) {
//         fetchChannelMessages(userId).then(messages => {
//           setMessages(messages);
//           setIsLoading(false);
//         });
//       } else {
//         setIsLoading(false);
//       }
//     });
//   };

//   if (isLoading) {
//     return (
//       <View style={[styles.loadingContainer, { backgroundColor: colors.background || '#F5F7FA' }]}>
//         <ActivityIndicator size="large" color={colors.primary || '#0d64dd'} />
//         <Text style={[styles.loadingText, { color: colors.text || '#333' }]}>Loading channel...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.errorContainer, { backgroundColor: colors.background || '#F5F7FA' }]}>
//         <View style={styles.errorIconContainer}>
//           <Icon name="lock-closed" size={64} color={colors.error || '#FF6B6B'} />
//           <View style={[styles.errorBadge, { 
//             backgroundColor: colors.errorBackground || '#FFE5E5',
//             borderColor: colors.error || '#FF6B6B'
//           }]}>
//             <Text style={[styles.errorBadgeText, { color: colors.text || '#333' }]}>🔒</Text>
//           </View>
//         </View>
        
//         <Text style={[styles.errorTitle, { color: colors.text || '#1A1A1A' }]}>
//           Oops! Channel Locked
//         </Text>
        
//         <View style={[styles.errorMessageContainer, { 
//           backgroundColor: colors.card || '#FFFFFF',
//           borderColor: colors.border || '#E5E7EB'
//         }]}>
//           <Text style={[styles.errorMessage, { color: colors.text || '#333' }]}>
//             To view content in this channel, you need to follow it first.
//           </Text>
//           <Text style={[styles.errorSubMessage, { color: colors.textSecondary || '#6B7280' }]}>
//             Following channels helps you stay updated with their latest posts and activities.
//           </Text>
//         </View>
        
//         <View style={styles.errorActions}>
//           <TouchableOpacity 
//             style={[styles.primaryActionButton, { 
//               backgroundColor: colors.primary || '#0d64dd',
//               shadowColor: colors.primary || '#0d64dd'
//             }]} 
//             onPress={() => navigation.goBack()}
//           >
           
//             <Text style={[styles.primaryActionText, { color: colors.buttonText || '#FFFFFF' }]}>
//               Go Back and Follow Channel
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.secondaryActionButton, { 
//               borderColor: colors.border || '#E5E7EB',
//               backgroundColor: colors.card || '#FFFFFF'
//             }]} 
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={[styles.secondaryActionText, { color: colors.textSecondary || '#6B7280' }]}>
//               Cancel
//             </Text>
//           </TouchableOpacity>
//         </View>
        
//         <TouchableOpacity 
//           style={styles.learnMoreLink}
//           onPress={() => {
//             Alert.alert(
//               'Why Follow Channels?',
//               'Following channels allows you to:\n\n' +
//               '✓ View exclusive content\n' +
//               '✓ Get notified about new posts\n' +
//               '✓ Engage with the community\n' +
//               '✓ Support your favorite creators\n\n' +
//               'Tap "Follow Channel" to get started!'
//             );
//           }}
//         >
//           <Text style={[styles.learnMoreText, { color: colors.primary || '#0d64dd' }]}>
//             Learn more about channels →
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background || '#edeff1ff' }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'dark-content'}
//         translucent={Platform.OS === 'android'}
//         backgroundColor={Platform.OS === 'android' ? (isDark ? '#1a1a2e' : '#0750b5') : undefined}
//       />
//       <View style={[styles.container, { backgroundColor: colors.background || '#FFFFFF' }]}>
//         <KeyboardAvoidingView
//           style={styles.container}
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//         >
//           <LinearGradient 
//             colors={isDark ? ['#1a1a2e', '#16213e'] : ['#0d64dd', '#0d64dd']} 
//             style={styles.header}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <View style={styles.headerContent}>
//               <TouchableOpacity 
//                 onPress={() => navigation.goBack()} 
//                 style={styles.headerButton}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <Icon name="arrow-back" size={24} color="#FFF" />
//               </TouchableOpacity>
//               <View style={styles.headerProfile}>
//                 <Image
//                   source={profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
//                   style={styles.headerAvatar}
//                   defaultSource={FALLBACK_AVATAR}
//                 />
//                 <View style={styles.headerTextContainer}>
//                   <Text style={styles.headerName}>{name || 'Channel'}</Text>
//                   <Text style={styles.followersText}>{followers || 0} followers</Text>
//                 </View>
//               </View>
//               <TouchableOpacity 
//                 onPress={openMenu} 
//                 style={styles.menuButton}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <Icon name="more-vert" size={24} color="#FFF" />
//               </TouchableOpacity>
//             </View>
//           </LinearGradient>

//           <Modal
//             transparent={true}
//             visible={menuVisible}
//             onRequestClose={closeMenu}
//             animationType="fade"
//           >
//             <TouchableWithoutFeedback onPress={closeMenu}>
//               <View style={[styles.menuOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//                 <View style={[styles.menuContainer, { backgroundColor: colors.card || '#FFFFFF' }]}>
//                   <TouchableOpacity 
//                     style={styles.menuItem}
//                     onPress={() => {
//                       navigation.navigate('InviteChannelLink', { 
//                         inviteLink: InviteLink, 
//                         profile_image, 
//                         name 
//                       });
//                       closeMenu();
//                     }}
//                   >
//                     <Text style={[styles.menuItemText, { color: colors.text || '#333' }]}>Share Channel</Text>
//                   </TouchableOpacity>
//                   <View style={[styles.menuDivider, { backgroundColor: colors.border || '#EEE' }]} />
//                   <TouchableOpacity 
//                     style={styles.menuItem}
//                     onPress={() => {
//                       closeMenu();
//                       Alert.alert('Leave Channel', 'Are you sure you want to leave this channel?', [
//                         { text: 'Cancel', style: 'cancel' },
//                         { text: 'Leave', onPress: () => navigation.goBack() }
//                       ]);
//                     }}
//                   >
//                     <Text style={[styles.menuItemText, styles.leaveText]}>Leave Channel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           </Modal>

//           {messages.length === 0 && pendingMessages.length === 0 ? (
//             <View style={styles.emptyChannelContainer}>
//               <Text style={[styles.emptyChannelText, { 
//                 color: colors.textSecondary || '#666',
//                 backgroundColor: colors.card || '#FFFFFF',
//                 borderColor: colors.border || '#E0E0E0'
//               }]}>
//                 No posts yet. Be the first to post!
//               </Text>
//             </View>
//           ) : (
//             <FlatList
//               ref={flatListRef}
//               data={[...pendingMessages, ...messages]}
//               renderItem={renderMessage}
//               keyExtractor={(item) => item.id.toString()}
//               contentContainerStyle={[styles.messagesContent, { backgroundColor: colors.background || '#FFFFFF' }]}
//               showsVerticalScrollIndicator={false}
//               initialNumToRender={10}
//               maxToRenderPerBatch={10}
//               windowSize={5}
//             />
//           )}

//           <View style={[styles.adminNoteContainer, { 
//             backgroundColor: colors.card || '#FFFFFF',
//             borderTopColor: colors.border || '#EEE'
//           }]}>
//             <Text style={[styles.adminNoteText, { color: colors.textSecondary || '#666' }]}>
//               Only the admin can publish posts.
//             </Text>
//           </View>

//           {/* Image/File Selection Modal */}
//           <Modal 
//             transparent 
//             visible={modalVisible} 
//             onRequestClose={() => setModalVisible(false)}
//             animationType="slide"
//           >
//             <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//               <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
//             </TouchableWithoutFeedback>
//             <View style={[styles.modalContent, { backgroundColor: colors.card || '#FFFFFF' }]}>
//               <Text style={[styles.modalTitle, { color: colors.text || '#333' }]}>Choose an option</Text>
//               <View style={styles.modalOptionsRow}>
//                 {options.map((item) => (
//                   <TouchableOpacity
//                     key={item.id}
//                     style={styles.optionButton}
//                     onPress={() => {
//                       if (item.label === 'Camera') pickImage(true);
//                       else if (item.label === 'Gallery') pickImage(false);
//                       else if (item.label === 'Document') pickFile();
//                     }}
//                     activeOpacity={0.7}
//                   >
//                     <View style={[styles.optionIconContainer, { backgroundColor: item.backgroundColor }]}>
//                       <Icon name={item.icon} size={28} color={item.color} />
//                     </View>
//                     <Text style={[styles.optionLabel, { color: colors.text || '#333' }]}>
//                       {item.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </Modal>

//           {/* Loading Modal */}
//           <Modal transparent visible={isImageLoading} onRequestClose={() => {}}>
//             <View style={[styles.loadingModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
//               <View style={[styles.loadingModalContent, { backgroundColor: colors.card || '#FFF' }]}>
//                 <ActivityIndicator size="large" color={colors.primary || '#2196F3'} />
//                 <Text style={[styles.loadingModalText, { color: colors.textSecondary || '#666' }]}>
//                   Processing...
//                 </Text>
//               </View>
//             </View>
//           </Modal>

//           {/* Fullscreen Image Modal */}
//           <Modal
//             transparent={true}
//             visible={!!fullscreenImage}
//             onRequestClose={() => setFullscreenImage(null)}
//             statusBarTranslucent={true}
//           >
//             <View style={[styles.fullscreenImageOverlay, { backgroundColor: 'rgba(0,0,0,0.95)' }]}>
//               <TouchableOpacity 
//                 style={styles.closeImageButton}
//                 onPress={() => setFullscreenImage(null)}
//                 activeOpacity={0.8}
//               >
//                 <Icon name="close" size={28} color="#FFF" />
//               </TouchableOpacity>
//               <Image 
//                 source={{ uri: fullscreenImage }} 
//                 style={styles.fullscreenImage} 
//                 resizeMode="contain"
//               />
//             </View>
//           </Modal>

//           {/* Image Preview Modal */}
//           <Modal 
//             transparent 
//             visible={imagePreviewModalVisible} 
//             onRequestClose={() => setImagePreviewModalVisible(false)}
//             animationType="slide"
//             statusBarTranslucent={true}
//           >
//             <View style={[styles.imagePreviewModalOverlay, { backgroundColor: '#000' }]}>
//               <View style={styles.imagePreviewModalContent}>
//                 <View style={[styles.imagePreviewHeader, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setImagePreviewModalVisible(false);
//                       setSelectedImage(null);
//                       setText('');
//                     }}
//                     style={styles.imagePreviewCloseButton}
//                   >
//                     <Icon name="close" size={24} color="#FFF" />
//                   </TouchableOpacity>
//                   <TouchableOpacity 
//                     onPress={() => sendMessage(text)} 
//                     style={styles.imagePreviewSendButton}
//                   >
//                     <Icon name="send" size={24} color={colors.primary || '#2196F3'} />
//                   </TouchableOpacity>
//                 </View>
//                 {selectedImage && (
//                   <Image 
//                     source={{ uri: selectedImage.uri }} 
//                     style={[styles.imagePreviewImage, { width: SCREEN_WIDTH - 32 }]} 
//                     resizeMode="contain" 
//                   />
//                 )}
//                 <TextInput
//                   style={[styles.imagePreviewInput, { 
//                     backgroundColor: 'rgba(255,255,255,0.1)',
//                     color: '#FFF'
//                   }]}
//                   placeholder="Add a caption..."
//                   placeholderTextColor="#999"
//                   value={text}
//                   onChangeText={setText}
//                   multiline
//                   maxLength={500}
//                 />
//               </View>
//             </View>
//           </Modal>

//           {/* Emoji Picker Modal */}
//           <Modal 
//             transparent 
//             visible={emojiPickerVisible} 
//             onRequestClose={() => setEmojiPickerVisible(false)}
//             animationType="slide"
//           >
//             <TouchableWithoutFeedback onPress={() => setEmojiPickerVisible(false)}>
//               <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
//             </TouchableWithoutFeedback>
//             <View style={[styles.emojiPickerContainer, { backgroundColor: colors.card || '#FFF' }]}>
//               <EmojiSelector onEmojiSelected={selectEmoji} />
//             </View>
//           </Modal>
//         </KeyboardAvoidingView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     marginTop: 12,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   errorIconContainer: {
//     position: 'relative',
//     marginBottom: 20,
//   },
//   errorBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     borderRadius: 16,
//     padding: 4,
//     borderWidth: 2,
//   },
//   errorBadgeText: {
//     fontSize: 16,
//   },
//   errorTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 12,
//     textAlign: 'center',
//     letterSpacing: 0.5,
//   },
//   errorMessageContainer: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//     width: '100%',
//     borderWidth: 1,
//   },
//   errorMessage: {
//     fontSize: 16,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   errorSubMessage: {
//     fontSize: 14,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   errorActions: {
//     width: '100%',
//     gap: 10,
//   },
//   primaryActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 10,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   primaryActionText: {
//     fontSize: 16,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   secondaryActionButton: {
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//   },
//   secondaryActionText: {
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   learnMoreLink: {
//     marginTop: 16,
//     padding: 8,
//   },
//   learnMoreText: {
//     fontSize: 14,
//     fontWeight: '500',
//     textDecorationLine: 'underline',
//   },
//   header: {
//     borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
//     borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   headerButton: {
//     padding: 8,
//   },
//   headerProfile: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 12,
//   },
//   headerAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   headerTextContainer: {
//     marginLeft: 12,
//   },
//   headerName: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   followersText: {
//     fontSize: 13,
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginTop: 2,
//   },
//   menuButton: {
//     padding: 8,
//   },
//   messagesContent: {
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//   },
//   messageWrapper: {
//     marginVertical: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   messageContainer: {
//     borderRadius: 16,
//     padding: 12,
//     position: 'relative',
//     elevation: 2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   channelPost: {},
//   messageContent: {
//     width: '100%',
//   },
//   messageImage: {
//     borderRadius: 12,
//     marginBottom: 8,
//     alignSelf: 'center',
//   },
//   fileContainer: {
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 8,
//     alignSelf: 'center',
//   },
//   fileContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   fileName: {
//     fontSize: 14,
//     marginLeft: 8,
//     flex: 1,
//   },
//   emojiContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     alignSelf: 'center',
//   },
//   emojiMessage: {
//     fontSize: 32,
//   },
//   textContainer: {
//     alignSelf: 'center',
//   },
//   messageText: {
//     fontSize: 16,
//     lineHeight: 22,
//   },
//   timestamp: {
//     fontSize: 13,
//     alignSelf: 'flex-end',
//     marginTop: 8,
//   },
//   deletedMessage: {
//     fontSize: 14,
//     fontStyle: 'italic',
//     textAlign: 'center',
//     padding: 12,
//   },
//   messageMenuButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     padding: 4,
//     zIndex: 10,
//   },
//   reactionsContainer: {
//     marginTop: 8,
//     alignItems: 'center',
//   },
//   reactionsBubble: {
//     flexDirection: 'row',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     alignItems: 'center',
//   },
//   reactionEmoji: {
//     fontSize: 16,
//     marginHorizontal: 2,
//   },
//   reactionCount: {
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   emptyChannelContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyChannelText: {
//     fontSize: 16,
//     textAlign: 'center',
//     lineHeight: 24,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderStyle: 'dashed',
//   },
//   adminNoteContainer: {
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderTopWidth: 1,
//   },
//   adminNoteText: {
//     fontSize: 14,
//     textAlign: 'center',
//     fontStyle: 'italic',
//   },
//   modalOverlay: {
//     flex: 1,
//   },
//   modalContent: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalOptionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   optionButton: {
//     alignItems: 'center',
//     width: '30%',
//   },
//   optionIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   optionLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   loadingModalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingModalContent: {
//     borderRadius: 16,
//     padding: 24,
//     alignItems: 'center',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   loadingModalText: {
//     marginTop: 12,
//     fontSize: 14,
//   },
//   fullscreenImageOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeImageButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 60 : 40,
//     right: 20,
//     zIndex: 1000,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   fullscreenImage: {
//     width: SCREEN_WIDTH,
//     height: SCREEN_WIDTH,
//   },
//   imagePreviewModalOverlay: {
//     flex: 1,
//   },
//   imagePreviewModalContent: {
//     flex: 1,
//     paddingTop: Platform.OS === 'ios' ? 60 : 40,
//   },
//   imagePreviewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   imagePreviewCloseButton: {
//     padding: 8,
//   },
//   imagePreviewSendButton: {
//     padding: 8,
//   },
//   imagePreviewImage: {
//     height: SCREEN_WIDTH * 0.75,
//     alignSelf: 'center',
//     marginVertical: 20,
//     borderRadius: 12,
//   },
//   imagePreviewInput: {
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     marginHorizontal: 16,
//     marginBottom: 20,
//     minHeight: 50,
//   },
//   emojiPickerContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 20,
//     maxHeight: '50%',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   menuOverlay: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     paddingTop: Platform.OS === 'ios' ? 60 : 50,
//     alignItems: 'flex-end',
//     paddingRight: 16,
//   },
//   menuContainer: {
//     borderRadius: 16,
//     width: 200,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     overflow: 'hidden',
//   },
//   menuItem: {
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//   },
//   menuItemText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   leaveText: {
//     color: '#F44336',
//   },
//   menuDivider: {
//     height: 1,
//   },
//   reactionModalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   reactionModalContainer: {
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingVertical: 20,
//     maxHeight: '50%',
//   },
//   reactionPicker: {
//     height: 250,
//     width: '100%',
//   },
// });


import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick, isCancel } from '@react-native-documents/picker';
import EmojiSelector from 'react-native-emoji-selector';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useTheme } from '../src/context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const axiosInstance = axios.create({
  baseURL: `${API_ROUTE}`,
  timeout: 30000,
});

const options = [
  { 
    id: '1', 
    icon: 'camera-alt', 
    label: 'Camera', 
    color: '#FFFFFF', 
    backgroundColor: '#0d64dd' 
  },
  { 
    id: '2', 
    icon: 'image', 
    label: 'Gallery', 
    color: '#FFFFFF', 
    backgroundColor: '#4CAF50' 
  },
  { 
    id: '3', 
    icon: 'insert-drive-file', 
    label: 'Document', 
    color: '#FFFFFF', 
    backgroundColor: '#FF9800' 
  },
];

export default function ChannelAdminScreen({ route, navigation }) {
  const { channelSlug, followers, name, InviteLink, profile_image } = route.params || {};
  const { colors, isDark } = useTheme();

  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreviewModalVisible, setImagePreviewModalVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountMode] = useState('business');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [reactionPickerForMessage, setReactionPickerForMessage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [error, setError] = useState(null);

  const POST_WIDTH = Math.min(SCREEN_WIDTH - 32, 600);
  const CONTENT_MAX_WIDTH = POST_WIDTH - 24;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const flatListRef = useRef();
  const ws = useRef(null);

  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;

      if (!token || !parsed?.id) {
        navigation.navigate('Login');
        return null;
      }

      setUserId(parsed.id);
      const response = await axiosInstance.get(`/user/${parsed.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });

      setUsername(response.data.name || 'Admin');
      setUserProfileImage(response.data.profile_picture ? `${API_ROUTE_IMAGE}${response.data.profile_picture}` : null);
      return parsed.id;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
      return null;
    }
  };

  const fetchChannelMessages = async (userId) => {
    if (!userId) return [];

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return [];

      const response = await axiosInstance.get(
        `/api/chat/?chat_type=channel&account_mode=${accountMode}&channel_slug=${channelSlug}`,
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      if (!response.data?.results) {
        return [];
      }

      const messagesWithReactions = await Promise.all(
        response.data.results.map(async (msg) => {
          try {
            const reactionsResponse = await axiosInstance.get(
              `/get-messages-reactions/${msg.id}/`,
              { 
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
              }
            );
            
            return {
              id: msg.id?.toString() || `msg_${Date.now()}`,
              user: msg.user_name || msg.name || 'Admin',
              user_id: msg.user_id || msg.user,
              content: msg.content || '',
              image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
              file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
              emoji: msg.emoji || null,
              is_deleted: msg.is_deleted || false,
              timestamp: msg.timestamp || new Date().toISOString(),
              avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
              is_channel_post: true,
              reactions: reactionsResponse.data || [],
              reaction_count: reactionsResponse.data?.length || 0,
            };
          } catch (error) {
            console.error('Error fetching reactions:', error);
            return {
              id: msg.id?.toString() || `msg_${Date.now()}`,
              user: msg.user_name || msg.name || 'Admin',
              user_id: msg.user_id || msg.user,
              content: msg.content || '',
              image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
              file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
              emoji: msg.emoji || null,
              is_deleted: msg.is_deleted || false,
              timestamp: msg.timestamp || new Date().toISOString(),
              avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
              is_channel_post: true,
              reactions: [],
              reaction_count: 0,
            };
          }
        })
      );

      return messagesWithReactions.reverse();
    } catch (error) {
      console.error('Error fetching channel messages:', error);
      setError('Failed to load messages');
      return [];
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const initialize = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const userId = await fetchUserData();
        if (!userId) {
          if (isMounted) setIsLoading(false);
          return;
        }
        
        const messages = await fetchChannelMessages(userId);
        if (isMounted) {
          setMessages(messages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        if (isMounted) {
          setError('Failed to initialize channel');
          setIsLoading(false);
        }
      }
    };

    timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        setError('Loading is taking longer than expected');
        setIsLoading(false);
      }
    }, 30000);

    initialize();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [navigation]);

  useEffect(() => {
    if (!userId || !accountMode || !channelSlug) return;

    const connectWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          return;
        }

        const wsUrl = `ws://api.showapp.ng/ws/chat/channel/${channelSlug}/${accountMode}/?token=${encodeURIComponent(token)}`;
        
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          setIsWebSocketOpen(true);
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.message) {
              const newMessage = {
                id: data.message.id?.toString() || `ws_${Date.now()}`,
                user: data.message.user || username,
                user_id: data.message.user_id || userId,
                content: data.message.content || '',
                image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
                file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
                emoji: data.message.emoji || null,
                is_deleted: data.message.is_deleted || false,
                timestamp: data.message.timestamp || new Date().toISOString(),
                avatar: data.message.avatar ? `${API_ROUTE_IMAGE}${data.message.avatar}` : userProfileImage || null,
                is_channel_post: true,
                reactions: data.message.reactions || [],
                reaction_count: data.message.reaction_count || 0,
              };

              setMessages((prev) => {
                if (!prev.some((msg) => msg.id === newMessage.id)) {
                  return [newMessage, ...prev];
                }
                return prev;
              });
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        ws.current.onerror = (error) => {
          setIsWebSocketOpen(false);
        };

        ws.current.onclose = () => {
          setIsWebSocketOpen(false);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId, accountMode, channelSlug, username, userProfileImage]);

  const checkCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      const result = await check(permission);
      return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };

  const checkPhotoPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const result = await check(permission);
      return result === RESULTS.GRANTED ? true : (await request(permission)) === RESULTS.GRANTED;
    } catch (error) {
      console.error('Photo permission error:', error);
      return false;
    }
  };

  const pickImage = async (useCamera = false) => {
    setModalVisible(false);
    try {
      const hasPermission = useCamera ? await checkCameraPermission() : await checkPhotoPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Camera/Gallery permission is required to continue');
        return;
      }
      setIsImageLoading(true);
      
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      const result = useCamera 
        ? await launchCamera(options)
        : await launchImageLibrary(options);
        
      setIsImageLoading(false);
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        setImagePreviewModalVisible(true);
      }
    } catch (error) {
      setIsImageLoading(false);
      Alert.alert('Error', 'Failed to select image: ' + error.message);
    }
  };

  const pickFile = async () => {
    setModalVisible(false);
    try {
      const result = await pick({
        allowMultiSelection: false,
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });
      
      if (result && result.length > 0) {
        const file = result[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name || 'document',
          type: file.type || 'application/octet-stream',
          size: file.size,
        });
        sendMessage('');
      }
    } catch (error) {
      if (!isCancel(error)) {
        Alert.alert('File Selection Error', 'Failed to select file');
      }
    }
  };

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false);
    sendMessage('');
  };

  const sendMessage = async (caption = '') => {
    if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji) return;

    const formData = new FormData();
    if (caption.trim()) formData.append('content', caption.trim());
    if (selectedEmoji) formData.append('emoji', selectedEmoji);
    if (selectedImage) {
      formData.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || `image_${Date.now()}.jpg`,
      });
    }
    if (selectedFile) {
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.type || 'application/octet-stream',
        name: selectedFile.name || `file_${Date.now()}`,
      });
    }
    
    formData.append('chat_type', 'channel');
    formData.append('account_mode', 'business');
    formData.append('channel_slug', channelSlug);
    formData.append('is_channel_post', 'true');

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
          emoji: selectedEmoji || null,
          is_deleted: false,
          timestamp: new Date().toISOString(),
          avatar: userProfileImage || null,
          is_channel_post: true,
          channel: channelSlug,
          reactions: [],
          reaction_count: 0,
        },
        ...prev,
      ]);
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No access token');

      const response = await axiosInstance.post(`/api/chat/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        timeout: 30000,
      });

      setText('');
      setSelectedImage(null);
      setSelectedFile(null);
      setSelectedEmoji(null);
      setImagePreviewModalVisible(false);
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    } catch (error) {
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      Alert.alert('Send Error', `Failed to send message: ${error.message}`);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No access token');

      await axiosInstance.post(
        `/messages/${messageId}/reactions/`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axiosInstance.get(
        `/get-messages-reactions/${messageId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => prev.map(msg => 
        msg.id === messageId.toString() ? {
          ...msg,
          reactions: response.data || [],
          reaction_count: response.data?.length || 0
        } : msg
      ));

    } catch (error) {
      Alert.alert('Reaction Error', 'Failed to add reaction');
    }
  };

  const deleteMessage = async (messageId) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (!token) throw new Error('No access token');

              const response = await axiosInstance.delete(`/delete-channel-message/${messageId}/`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
              });

              if (response.data.message) {
                setMessages(prev => prev.map(msg => 
                  msg.id === messageId.toString() ? { ...msg, is_deleted: true } : msg
                ));
              } else {
                throw new Error('Unexpected server response');
              }
            } catch (error) {
              let errorMessage = 'Failed to delete message';
              if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
              }
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const showReactionPicker = (messageId) => {
    if (reactionPickerForMessage === messageId) {
      setReactionPickerForMessage(null);
      return;
    }
    setReactionPickerForMessage(messageId);
  };

  const renderReactionPicker = (messageId) => {
    if (!reactionPickerForMessage || reactionPickerForMessage !== messageId) return null;

    return (
      <Modal
        transparent={true}
        visible={true}
        animationType="slide"
        onRequestClose={() => setReactionPickerForMessage(null)}
      >
        <TouchableWithoutFeedback onPress={() => setReactionPickerForMessage(null)}>
          <View style={[styles.reactionModalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.reactionModalContainer, { backgroundColor: colors.card || '#FFFFFF' }]}>
              <View style={styles.reactionPicker}>
                <EmojiSelector
                  onEmojiSelected={(emoji) => {
                    handleReaction(reactionPickerForMessage, emoji);
                    setReactionPickerForMessage(null);
                  }}
                  showSearchBar={false}
                  showHistory={false}
                  showSectionTitles={false}
                  columns={8}
                  theme={isDark ? 'dark' : 'light'}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderMessage = ({ item }) => {
    const timeString = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const isMyMessage = item.user_id === userId;

    if (item.is_deleted) {
      return (
        <View style={[styles.messageContainer, { width: POST_WIDTH, backgroundColor: colors.card || '#FFFFFF' }]}>
          <Text style={[styles.deletedMessage, { color: colors.textSecondary || '#999' }]}>
            This message was deleted
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.messageWrapper}>
        <View 
          style={[
            styles.messageContainer,
            { 
              width: POST_WIDTH,
              backgroundColor: colors.card || '#FFFFFF',
              shadowColor: colors.shadow || '#000',
            },
            styles.channelPost
          ]}
        >
          {isMyMessage && (
            <TouchableOpacity 
              style={styles.messageMenuButton}
              onPress={() => deleteMessage(item.id)}
            >
              <Icon name="more-vert" size={20} color={colors.textSecondary || '#666'} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onLongPress={() => showReactionPicker(item.id)}
            onPress={() => {
              if (item.image) {
                setFullscreenImage(item.image);
              } else {
                setReactionPickerForMessage(null);
              }
            }}
            activeOpacity={0.8}
            delayLongPress={300}
            style={styles.messageContent}
          >
            {item.image && (
              <Image 
                source={{ uri: item.image }} 
                style={[
                  styles.messageImage,
                  { width: CONTENT_MAX_WIDTH, height: CONTENT_MAX_WIDTH * 0.75 }
                ]} 
                resizeMode="cover"
              />
            )}
            {item.file && (
              <TouchableOpacity
                style={[styles.fileContainer, { 
                  width: CONTENT_MAX_WIDTH,
                  backgroundColor: colors.backgroundSecondary || '#F5F7FA'
                }]}
                onPress={() => Linking.openURL(item.file).catch(() => Alert.alert('Error', 'Cannot open file'))}
              >
                <View style={styles.fileContent}>
                  <Icon name="insert-drive-file" size={20} color={colors.primary || '#2196F3'} />
                  <Text style={[styles.fileName, { color: colors.text || '#333' }]} numberOfLines={1}>
                    {item.file.split('/').pop()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {item.emoji && (
              <View style={[styles.emojiContainer, { width: CONTENT_MAX_WIDTH }]}>
                <Text style={styles.emojiMessage}>{item.emoji}</Text>
              </View>
            )}
            {item.content && (
              <View style={[styles.textContainer, { width: CONTENT_MAX_WIDTH }]}>
                <Text style={[styles.messageText, { color: colors.text || '#333' }]}>
                  {item.content}
                </Text>
                <Text style={[styles.timestamp, { color: colors.textSecondary || '#777' }]}>
                  {timeString}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {item.reactions?.length > 0 && (
            <View style={styles.reactionsContainer}>
              <View style={[styles.reactionsBubble, { backgroundColor: colors.backgroundSecondary || 'rgba(0,0,0,0.06)' }]}>
                {item.reactions.slice(0, 3).map((reaction, index) => (
                  <Text key={index} style={styles.reactionEmoji}>
                    {reaction.emoji}
                  </Text>
                ))}
                {item.reactions.length > 3 && (
                  <Text style={[styles.reactionCount, { color: colors.textSecondary || '#666' }]}>
                    +{item.reactions.length - 3}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
        {renderReactionPicker(item.id)}
      </View>
    );
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    fetchUserData().then(userId => {
      if (userId) {
        fetchChannelMessages(userId).then(messages => {
          setMessages(messages);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background || '#F5F7FA' }]}>
        <ActivityIndicator size="large" color={colors.primary || '#0d64dd'} />
        <Text style={[styles.loadingText, { color: colors.text || '#333' }]}>Loading channel...</Text>
      </View>
    );
  }

  // if (error) {
  //   return (
  //     <View style={[styles.errorContainer, { backgroundColor: colors.background || '#F5F7FA' }]}>
  //       <View style={styles.errorIconContainer}>
  //         <Icon name="lock-closed" size={64} color={colors.error || '#FF6B6B'} />
  //         <View style={[styles.errorBadge, { 
  //           backgroundColor: isDark ? '#3d1f1f' : '#FFE5E5',
  //           borderColor: colors.error || '#FF6B6B'
  //         }]}>
  //           <Text style={[styles.errorBadgeText, { color: colors.text || '#333' }]}>🔒</Text>
  //         </View>
  //       </View>
        
  //       <Text style={[styles.errorTitle, { color: colors.text || '#1A1A1A' }]}>
  //         Oops! Channel Locked
  //       </Text>
        
  //       <View style={[styles.errorMessageContainer, { 
  //         backgroundColor: colors.card || '#FFFFFF',
  //         borderColor: colors.border || '#E5E7EB'
  //       }]}>
  //         <Text style={[styles.errorMessage, { color: colors.text || '#333' }]}>
  //           To view content in this channel, you need to follow it first.
  //         </Text>
  //         <Text style={[styles.errorSubMessage, { color: colors.textSecondary || '#6B7280' }]}>
  //           Following channels helps you stay updated with their latest posts and activities.
  //         </Text>
  //       </View>
        
  //       <View style={styles.errorActions}>
  //         <TouchableOpacity 
  //           style={[styles.primaryActionButton, { 
  //             backgroundColor: colors.primary || '#0d64dd',
  //             shadowColor: colors.primary || '#0d64dd'
  //           }]} 
  //           onPress={() => navigation.goBack()}
  //         >
  //           <Text style={[styles.primaryActionText, { color: colors.buttonText || '#FFFFFF' }]}>
  //             Go Back and Follow Channel
  //           </Text>
  //         </TouchableOpacity>
          
  //         <TouchableOpacity 
  //           style={[styles.secondaryActionButton, { 
  //             borderColor: colors.border || '#E5E7EB',
  //             backgroundColor: colors.card || '#FFFFFF'
  //           }]} 
  //           onPress={() => navigation.goBack()}
  //         >
  //           <Text style={[styles.secondaryActionText, { color: colors.textSecondary || '#6B7280' }]}>
  //             Cancel
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
        
  //       <TouchableOpacity 
  //         style={styles.learnMoreLink}
  //         onPress={() => {
  //           Alert.alert(
  //             'Why Follow Channels?',
  //             'Following channels allows you to:\n\n' +
  //             '✓ View exclusive content\n' +
  //             '✓ Get notified about new posts\n' +
  //             '✓ Engage with the community\n' +
  //             '✓ Support your favorite creators\n\n' +
  //             'Tap "Follow Channel" to get started!'
  //           );
  //         }}
  //       >
  //         <Text style={[styles.learnMoreText, { color: colors.primary || '#0d64dd' }]}>
  //           Learn more about channels →
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background || '#edeff1ff' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? (isDark ? '#1a1a2e' : '#0750b5') : undefined}
      />
      <View style={[styles.container, { backgroundColor: colors.background || '#FFFFFF' }]}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <LinearGradient 
            colors={isDark ? ['#1a1a2e', '#16213e'] : ['#0d64dd', '#0d64dd']} 
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.headerButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.headerProfile}>
                <Image
                  source={profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
                  style={styles.headerAvatar}
                  defaultSource={FALLBACK_AVATAR}
                />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerName}>{name || 'Channel'}</Text>
                  <Text style={styles.followersText}>{followers || 0} followers</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={openMenu} 
                style={styles.menuButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="more-vert" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <Modal
            transparent={true}
            visible={menuVisible}
            onRequestClose={closeMenu}
            animationType="fade"
          >
            <TouchableWithoutFeedback onPress={closeMenu}>
              <View style={[styles.menuOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.menuContainer, { backgroundColor: colors.card || '#FFFFFF' }]}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      navigation.navigate('InviteChannelLink', { 
                        inviteLink: InviteLink, 
                        profile_image, 
                        name 
                      });
                      closeMenu();
                    }}
                  >
                    <Text style={[styles.menuItemText, { color: colors.text || '#333' }]}>Share Channel</Text>
                  </TouchableOpacity>
                  <View style={[styles.menuDivider, { backgroundColor: colors.border || '#EEE' }]} />
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      closeMenu();
                      Alert.alert('Leave Channel', 'Are you sure you want to leave this channel?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Leave', onPress: () => navigation.goBack() }
                      ]);
                    }}
                  >
                    <Text style={[styles.menuItemText, styles.leaveText]}>Leave Channel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {messages.length === 0 && pendingMessages.length === 0 ? (
            <View style={styles.emptyChannelContainer}>
              <Text style={[styles.emptyChannelText, { 
                color: colors.textSecondary || '#666',
                backgroundColor: colors.card || '#FFFFFF',
                borderColor: colors.border || '#E0E0E0'
              }]}>
                No posts yet. Be the first to post!
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={[...pendingMessages, ...messages]}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={[styles.messagesContent, { backgroundColor: colors.background || '#FFFFFF' }]}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          )}

          <View style={[styles.adminNoteContainer, { 
            backgroundColor: colors.card || '#FFFFFF',
            borderTopColor: colors.border || '#EEE'
          }]}>
            <Text style={[styles.adminNoteText, { color: colors.textSecondary || '#666' }]}>
              Only the admin can publish posts.
            </Text>
          </View>

          {/* Image/File Selection Modal */}
          <Modal 
            transparent 
            visible={modalVisible} 
            onRequestClose={() => setModalVisible(false)}
            animationType="slide"
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]} />
            </TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: colors.card || '#FFFFFF' }]}>
              <Text style={[styles.modalTitle, { color: colors.text || '#333' }]}>Choose an option</Text>
              <View style={styles.modalOptionsRow}>
                {options.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.optionButton}
                    onPress={() => {
                      if (item.label === 'Camera') pickImage(true);
                      else if (item.label === 'Gallery') pickImage(false);
                      else if (item.label === 'Document') pickFile();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.optionIconContainer, { backgroundColor: item.backgroundColor }]}>
                      <Icon name={item.icon} size={28} color={item.color} />
                    </View>
                    <Text style={[styles.optionLabel, { color: colors.text || '#333' }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          {/* Loading Modal */}
          <Modal transparent visible={isImageLoading} onRequestClose={() => {}}>
            <View style={[styles.loadingModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <View style={[styles.loadingModalContent, { backgroundColor: colors.card || '#FFF' }]}>
                <ActivityIndicator size="large" color={colors.primary || '#2196F3'} />
                <Text style={[styles.loadingModalText, { color: colors.textSecondary || '#666' }]}>
                  Processing...
                </Text>
              </View>
            </View>
          </Modal>

          {/* Fullscreen Image Modal */}
          <Modal
            transparent={true}
            visible={!!fullscreenImage}
            onRequestClose={() => setFullscreenImage(null)}
            statusBarTranslucent={true}
          >
            <View style={[styles.fullscreenImageOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.95)' }]}>
              <TouchableOpacity 
                style={styles.closeImageButton}
                onPress={() => setFullscreenImage(null)}
                activeOpacity={0.8}
              >
                <Icon name="close" size={28} color="#FFF" />
              </TouchableOpacity>
              <Image 
                source={{ uri: fullscreenImage }} 
                style={styles.fullscreenImage} 
                resizeMode="contain"
              />
            </View>
          </Modal>

          {/* Image Preview Modal */}
          <Modal 
            transparent 
            visible={imagePreviewModalVisible} 
            onRequestClose={() => setImagePreviewModalVisible(false)}
            animationType="slide"
            statusBarTranslucent={true}
          >
            <View style={[styles.imagePreviewModalOverlay, { backgroundColor: isDark ? '#1a1a1a' : '#000' }]}>
              <View style={styles.imagePreviewModalContent}>
                <View style={[styles.imagePreviewHeader, { backgroundColor: isDark ? 'rgba(26,26,26,0.95)' : 'rgba(0,0,0,0.8)' }]}>
                  <TouchableOpacity
                    onPress={() => {
                      setImagePreviewModalVisible(false);
                      setSelectedImage(null);
                      setText('');
                    }}
                    style={styles.imagePreviewCloseButton}
                  >
                    <Icon name="close" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => sendMessage(text)} 
                    style={styles.imagePreviewSendButton}
                  >
                    <Icon name="send" size={24} color={colors.primary || '#2196F3'} />
                  </TouchableOpacity>
                </View>
                {selectedImage && (
                  <Image 
                    source={{ uri: selectedImage.uri }} 
                    style={[styles.imagePreviewImage, { width: SCREEN_WIDTH - 32 }]} 
                    resizeMode="contain" 
                  />
                )}
                <TextInput
                  style={[styles.imagePreviewInput, { 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)',
                    color: '#FFF'
                  }]}
                  placeholder="Add a caption..."
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={setText}
                  multiline
                  maxLength={500}
                />
              </View>
            </View>
          </Modal>

          {/* Emoji Picker Modal */}
          <Modal 
            transparent 
            visible={emojiPickerVisible} 
            onRequestClose={() => setEmojiPickerVisible(false)}
            animationType="slide"
          >
            <TouchableWithoutFeedback onPress={() => setEmojiPickerVisible(false)}>
              <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]} />
            </TouchableWithoutFeedback>
            <View style={[styles.emojiPickerContainer, { backgroundColor: colors.card || '#FFF' }]}>
              <EmojiSelector 
                onEmojiSelected={selectEmoji} 
                theme={isDark ? 'dark' : 'light'}
              />
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  errorBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
  },
  errorBadgeText: {
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  errorMessageContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    fontWeight: '500',
  },
  errorSubMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorActions: {
    width: '100%',
    gap: 10,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryActionButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  learnMoreLink: {
    marginTop: 16,
    padding: 8,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  header: {
    borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  followersText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  messageWrapper: {
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  messageContainer: {
    borderRadius: 16,
    padding: 12,
    position: 'relative',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  channelPost: {},
  messageContent: {
    width: '100%',
  },
  messageImage: {
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'center',
  },
  fileContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignSelf: 'center',
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    alignSelf: 'center',
  },
  emojiMessage: {
    fontSize: 32,
  },
  textContainer: {
    alignSelf: 'center',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 13,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  deletedMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
  messageMenuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 10,
  },
  reactionsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  reactionsBubble: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  reactionCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyChannelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyChannelText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  adminNoteContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  adminNoteText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  optionButton: {
    alignItems: 'center',
    width: '30%',
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContent: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingModalText: {
    marginTop: 12,
    fontSize: 14,
  },
  fullscreenImageOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  imagePreviewModalOverlay: {
    flex: 1,
  },
  imagePreviewModalContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imagePreviewCloseButton: {
    padding: 8,
  },
  imagePreviewSendButton: {
    padding: 8,
  },
  imagePreviewImage: {
    height: SCREEN_WIDTH * 0.75,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 12,
  },
  imagePreviewInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    minHeight: 50,
  },
  emojiPickerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '50%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menuContainer: {
    borderRadius: 16,
    width: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  leaveText: {
    color: '#F44336',
  },
  menuDivider: {
    height: 1,
  },
  reactionModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  reactionModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 20,
    maxHeight: '50%',
  },
  reactionPicker: {
    height: 250,
    width: '100%',
  },
});