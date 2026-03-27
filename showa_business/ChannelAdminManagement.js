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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Linking,
  Keyboard,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick, isCancel } from '@react-native-documents/picker';
import EmojiSelector from 'react-native-emoji-selector';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const axiosInstance = axios.create({
  baseURL: `${API_ROUTE}`,
  timeout: 10000,
});

const options = [
  { 
    id: '1', 
    icon: 'image', 
    label: 'Gallery', 
    color: '#FFFFFF', 
    backgroundColor: '#4CAF50' 
  },
  { 
    id: '2', 
    icon: 'insert-drive-file', 
    label: 'Document', 
    color: '#FFFFFF', 
    backgroundColor: '#FF9800' 
  },
  { 
    id: '3', 
    icon: 'emoji-emotions', 
    label: 'Emoji', 
    color: '#FFFFFF', 
    backgroundColor: '#9C27B0' 
  },
];

export default function ChannelAdminScreen({ route, navigation }) {
  const { channelSlug, followers, name, InviteLink, profile_image } = route.params;

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
  const [accountMode, setAccountMode] = useState('business');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [reactionPickerForMessage, setReactionPickerForMessage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isAndroid15, setIsAndroid15] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const flatListRef = useRef();
  const ws = useRef(null);
  const inputRef = useRef(null);

  const FALLBACK_AVATAR = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  // Detect Android version
  useEffect(() => {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.constants?.Version || 0;
      const isAndroid15OrHigher = androidVersion >= 35;
      setIsAndroid15(isAndroid15OrHigher);
      console.log('Android Version:', androidVersion, 'Is Android 15+:', isAndroid15OrHigher);
    } else {
      setIsAndroid15(false);
    }
  }, []);

  // Keyboard listeners for Android 15
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardVisible(true);
        if (isAndroid15) {
          // For Android 15, add extra offset
          const extraOffset = 40;
          setKeyboardHeight(event.endCoordinates.height + extraOffset);
        } else if (Platform.OS === 'android') {
          // For Android below 15, also add some offset but less
          const extraOffset = 40;
          setKeyboardHeight(event.endCoordinates.height + extraOffset);
        } else {
          setKeyboardHeight(event.endCoordinates.height);
        }
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
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

  const fetchUserData = async () => {
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

      setUsername(response.data.name || 'Admin');
      setUserProfileImage(response.data.profile_picture ? `${API_ROUTE_IMAGE}${response.data.profile_picture}` : null);
      return parsed.id;
    } catch (error) {
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
        }
      );

      const messagesWithReactions = await Promise.all(
        response.data.results?.map(async (msg) => {
          try {
            const reactionsResponse = await axiosInstance.get(
              `/get-messages-reactions/${msg.id}/`,
              { 
                headers: { Authorization: `Bearer ${token}` } 
              }
            );
            
            return {
              id: msg.id.toString(),
              user: msg.user_name || msg.name || 'Admin',
              user_id: msg.user_id || msg.user,
              content: msg.content || '',
              image: msg.image ? `${API_ROUTE_IMAGE}${msg.image}` : null,
              file: msg.file ? `${API_ROUTE_IMAGE}${msg.file}` : null,
              emoji: msg.emoji || null,
              is_deleted: msg.is_deleted || false,
              timestamp: msg.timestamp,
              avatar: msg.avatar ? `${API_ROUTE_IMAGE}${msg.avatar}` : null,
              is_channel_post: true,
              reactions: reactionsResponse.data || [],
              reaction_count: reactionsResponse.data?.length || 0,
            };
          } catch (error) {
            return {
              ...msg,
              reactions: [],
              reaction_count: 0
            };
          }
        }) || []
      );

      return messagesWithReactions.reverse();
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      setIsLoading(true);
      try {
        const userId = await fetchUserData();
        if (!userId) {
          return;
        }
        const messages = await fetchChannelMessages(userId);
        if (isMounted) setMessages(messages);
      } catch (error) {
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initialize();
    return () => {
      isMounted = false;
      if (ws.current) ws.current.close();
    };
  }, [navigation]);

  useEffect(() => {
    if (!userId || !accountMode) return;

    const connectWebSocket = async () => {
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
              id: data.message.id.toString(),
              user: data.message.user || username,
              user_id: data.message.user_id || userId,
              content: data.message.content || '',
              image: data.message.image ? `${API_ROUTE_IMAGE}${data.message.image}` : null,
              file: data.message.file ? `${API_ROUTE_IMAGE}${data.message.file}` : null,
              emoji: data.message.emoji || null,
              is_deleted: data.message.is_deleted || false,
              timestamp: data.message.timestamp,
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
        }
      };

      ws.current.onerror = () => {
        setIsWebSocketOpen(false);
      };

      ws.current.onclose = () => {
        setIsWebSocketOpen(false);
      };
    };

    connectWebSocket();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [userId, accountMode, channelSlug]);

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

  const pickImage = async () => {
    setModalVisible(false);
    try {
      const hasPermission = await checkPhotoPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot access gallery');
        return;
      }
      setIsImageLoading(true);
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
      setIsImageLoading(false);
      if (!result.didCancel && result.assets) {
        setSelectedImage(result.assets[0]);
        setImagePreviewModalVisible(true);
      }
    } catch (error) {
      setIsImageLoading(false);
      Alert.alert('Failed to pick image');
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
      sendMessage('');
    } catch (error) {
      if (!isCancel(error)) {
        alert('Failed to pick file');
      }
    }
  };

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false);
    sendMessage('');
  };

  const deleteChannel = async (channelSlugParam) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.delete(
        `${API_ROUTE}/channels/${channelSlugParam}/delete/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        navigation.goBack();
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.error || 'Failed to delete channel');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  const handleDeleteChannel = () => {
    Alert.alert(
      'Delete Channel',
      'Are you sure you want to delete this channel? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteChannel(channelSlug) 
        }
      ]
    );
  };

  const sendMessage = async (caption = '') => {
    if (!caption.trim() && !selectedImage && !selectedFile && !selectedEmoji) return;

    Keyboard.dismiss();

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
      });

      setText('');
      setSelectedImage(null);
      setSelectedFile(null);
      setSelectedEmoji(null);
      setImagePreviewModalVisible(false);
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      alert(`Failed to send message: ${error.message}`);
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
      Alert.alert('Error', 'Failed to add reaction');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No access token');

      const response = await axiosInstance.delete(`/delete-channel-message/${messageId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.message) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId.toString() ? { ...msg, is_deleted: true } : msg
        ));
        Alert.alert("Success", response.data.message);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      let errorMessage = 'Failed to delete message';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const showReactionPicker = (messageId) => {
    if (reactionPickerForMessage === messageId) {
      hideReactionPicker();
      return;
    }
    setReactionPickerForMessage(messageId);
  };

  const hideReactionPicker = () => {
    setReactionPickerForMessage(null);
  };

  const renderReactionPicker = (messageId) => {
    if (!reactionPickerForMessage || reactionPickerForMessage !== messageId) return null;

    return (
      <Modal
        transparent={true}
        visible={true}
        animationType="slide"
        onRequestClose={hideReactionPicker}
      >
        <TouchableWithoutFeedback onPress={hideReactionPicker}>
          <View style={styles.reactionModalOverlay}>
            <View style={styles.reactionModalContainer}>
              <View style={styles.reactionPicker}>
                <EmojiSelector
                  onEmojiSelected={(emoji) => {
                    handleReaction(reactionPickerForMessage, emoji);
                    hideReactionPicker();
                  }}
                  showSearchBar={false}
                  showHistory={false}
                  showSectionTitles={false}
                  columns={8}
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
        <View style={styles.messageContainer}>
          <Text style={styles.deletedMessage}>This message was deleted</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageWrapper,
        isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper
      ]}>
        <View style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
          item.is_channel_post && styles.channelPost
        ]}>
          {isMyMessage && (
            <TouchableOpacity 
              style={styles.messageMenuButton}
              onPress={() => {
                Alert.alert(
                  'Delete Message',
                  'Are you sure you want to delete this message? This action cannot be undone.',
                  [
                    {
                      text: 'Delete Message',
                      style: 'destructive',
                      onPress: () => deleteMessage(item.id),
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                  ]
                );
              }}
            >
              <Icon name="more-vert" size={20} color="#666" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onLongPress={() => showReactionPicker(item.id)}
            onPress={() => {
              if (item.image) {
                setFullscreenImage(item.image);
              } else {
                hideReactionPicker();
              }
            }}
            activeOpacity={0.8}
            delayLongPress={300}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
            {item.file && (
              <TouchableOpacity
                style={styles.fileContainer}
                onPress={() => Linking.openURL(item.file).catch(() => alert('Cannot open file'))}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="insert-drive-file" size={20} color="#2196F3" />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.file.split('/').pop()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {item.emoji && <Text style={styles.emojiMessage}>{item.emoji}</Text>}
            {item.content && <Text style={styles.messageText}>{item.content}</Text>}
            {item.content && <Text style={[styles.messageText,{fontSize:13, color:'#777',alignSelf:'flex-end'}]}>{timeString}</Text>}
          </TouchableOpacity>

          {item.reactions?.length > 0 && (
            <View style={[
              styles.reactionsContainer,
              isMyMessage ? styles.myReactions : styles.otherReactions
            ]}>
              <View style={styles.reactionsBubble}>
                {item.reactions.slice(0, 3).map((reaction, index) => (
                  <Text key={index} style={styles.reactionEmoji}>
                    {reaction.emoji}
                  </Text>
                ))}
                {item.reactions.length > 3 && (
                  <Text style={styles.reactionCount}>+{item.reactions.length - 3}</Text>
                )}
              </View>
            </View>
          )}
        </View>
        {renderReactionPicker(item.id)}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d64dd" />
        <Text style={{color:'#333'}}>Loading channel please wait...</Text>
      </View>
    );
  }

  return (
    
    <SafeAreaView style={styles.container}>

        <ImageBackground
      source={require('../assets/images/backroundsplash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {isAndroid15 ? (
        // For Android 15 devices, use manual adjustment with marginBottom
        <View style={styles.container}>
          <LinearGradient 
            colors={['#0d64dd', '#0d64dd']} 
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.headerProfile}>
                <Image
                  source={profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
                  style={styles.headerAvatar}
                />
                <View>
                  <Text style={styles.headerName}>{name}</Text>
                  <Text style={styles.followersText}>{followers} followers</Text>
                </View>
              </View>
              <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
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
              <View style={styles.menuOverlay}>
                <View style={styles.menuContainer}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      navigation.navigate('InviteChannelLink',{inviteLink:InviteLink, profile_image, name})
                      closeMenu();
                    }}
                  >
                    <Text style={styles.menuItemText}>Share Channel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      handleDeleteChannel();
                    }}
                  >
                    <Text style={[styles.menuItemText, styles.leaveText]}>Delete Channel</Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {messages.length === 0 && pendingMessages.length === 0 ? (
            <View style={styles.emptyChannelContainer}>
              <Text style={styles.emptyChannelText}>No posts yet. Share something with your followers!</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={[...pendingMessages, ...messages]}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
              onLayout={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
            />
          )}

          <View style={[
            styles.footer,
            {
              marginBottom: keyboardVisible ? keyboardHeight : 0,
              paddingBottom: keyboardVisible ? 50 : 10,
            }
          ]}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.attachButton}>
              <Icon name="attach-file" size={27} color="#2196F3" />
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Post to your channel..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(text)}
            />
            <TouchableOpacity onPress={() => sendMessage(text)} style={styles.sendButton}>
              <Icon name="send" size={24} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // For Android 14 and below, iOS, use manual adjustment with marginBottom as well
        <View style={styles.container}>
          <LinearGradient 
            colors={['#0d64dd', '#0d64dd']} 
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.headerProfile}>
                <Image
                  source={profile_image ? { uri: `${API_ROUTE_IMAGE}${profile_image}` } : FALLBACK_AVATAR}
                  style={styles.headerAvatar}
                />
                <View>
                  <Text style={styles.headerName}>{name}</Text>
                  <Text style={styles.followersText}>{followers} followers</Text>
                </View>
              </View>
              <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
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
              <View style={styles.menuOverlay}>
                <View style={styles.menuContainer}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      navigation.navigate('InviteChannelLink',{inviteLink:InviteLink, profile_image, name})
                      closeMenu();
                    }}
                  >
                    <Text style={styles.menuItemText}>Share Channel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      handleDeleteChannel();
                    }}
                  >
                    <Text style={[styles.menuItemText, styles.leaveText]}>Delete Channel</Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {messages.length === 0 && pendingMessages.length === 0 ? (
            <View style={styles.emptyChannelContainer}>
              <Text style={styles.emptyChannelText}>No posts yet. Share something with your followers!</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={[...pendingMessages, ...messages]}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
              onLayout={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
            />
          )}

          <View style={[
            styles.footer,
            {
              marginBottom: keyboardVisible ? keyboardHeight : 0,
              paddingBottom: keyboardVisible ? 40 : 10,
            }
          ]}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.attachButton}>
              <Icon name="attach-file" size={27} color="#2196F3" />
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Post to your channel..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(text)}
            />
            <TouchableOpacity onPress={() => sendMessage(text)} style={styles.sendButton}>
              <Icon name="send" size={24} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Options Modal */}
      <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.modalOptionsRow}>
            {options.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.optionButton}
                onPress={() => {
                  if (item.label === 'Gallery') pickImage();
                  else if (item.label === 'Document') pickFile();
                  else if (item.label === 'Emoji') {
                    setEmojiPickerVisible(true);
                    setModalVisible(false);
                  }
                }}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: item.backgroundColor }]}>
                  <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.optionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal transparent visible={isImageLoading} onRequestClose={() => {}}>
        <View style={styles.loadingModalOverlay}>
          <View style={styles.loadingModalContent}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={!!fullscreenImage}
        onRequestClose={() => setFullscreenImage(null)}
      >
        <View style={styles.fullscreenImageOverlay}>
          <TouchableWithoutFeedback onPress={() => setFullscreenImage(null)}>
            <Image 
              source={{ uri: fullscreenImage }} 
              style={styles.fullscreenImage} 
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
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
                <Icon name="send" size={24} color="#2196F3" />
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
    </ImageBackground>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    marginTop: Platform.OS === 'ios' ? 10 : 5,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  followersText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 12,
  },
  messagesContent: {
    paddingVertical: 17,
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginVertical: 6,
    paddingHorizontal: 8,
  },
  messageContainer: {
    width: '100%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  myMessageWrapper: {
    paddingHorizontal: 20,
  },
  otherMessageWrapper: {
    alignSelf: 'center',
  },
  myMessage: {
    backgroundColor: '#0d64dd',
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  channelPost: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 6,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  fileName: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 8,
    flex: 1,
  },
  emojiMessage: {
    fontSize: 32,
    marginBottom: 6,
    textAlign: 'center',
  },
  deletedMessage: {
    fontSize: 14,
    padding: 10,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyChannelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyChannelText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  attachButton: {
    padding: 10,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'android' ? 10 : 15,
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    fontSize: 16,
    color: '#333',
    marginHorizontal: 6,
  },
  sendButton: {
    padding: 10,
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  modalOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  imagePreviewModalOverlay: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  imagePreviewModalContent: {
    flex: 1,
    padding: 16,
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  imagePreviewSendButton: {
    padding: 8,
  },
  imagePreviewImage: {
    width: '100%',
    height: '70%',
    marginVertical: 12,
    borderRadius: 12,
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
    elevation: 5,
  },
  reactionsContainer: {
    marginTop: 6,
    paddingHorizontal: 8,
  },
  myReactions: {
    justifyContent: 'flex-end',
  },
  otherReactions: {
    justifyContent: 'flex-start',
  },
  reactionsBubble: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  reactionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  reactionModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  reactionPicker: {
    height: 250,
  },
  menuButton: {
    padding: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  leaveText: {
    color: '#F44336',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEE',
  },
  fullscreenImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  messageMenuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});