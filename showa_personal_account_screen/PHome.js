

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
  Vibration,
  KeyboardAvoidingView, 
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
//import BottomNav from '../components/BottomNavSocila_2';
import BottomNav from '../components/BottomNavSocialMedia';
import { Divider } from 'react-native-paper';
import { launchCamera } from 'react-native-image-picker';
import SwitchAccountSheet from '../components/SwitchAccountSheet';
import IncomingCallModal from '../components/IncomingCallModal';
import InCallManager from 'react-native-incall-manager';
import EarningFloatingButton from '../components/EarningButtonForHome';
import NotificationService from '../src/services/PushNotifications';
import Video from 'react-native-video';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PinUnlockModal from '../screens/PinUnlockModal'; 
import EarningsSlideInManager from '../components/EarningsSlideInManager';
import OnlineStatusBadge from '../components/OnlineStatusBadge';





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
  const [isVideoCall, setIsVideoCall] = useState(false);

  const isCallBeingHandledRef = useRef(false);
  

     const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);
  
  const [notificationSettings, setNotificationSettings] = useState({
    showNotifications: true,
    doNotDisturb: false,
  });


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== searchQuery) {
        setSearchQuery(searchText);
      }
    }, 300); 
    
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);


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


 
// const DropdownModal = ({ visible, onClose, children, dropdownPosition }) => {
 
//   if (Platform.OS === 'android') {
//     return null;
//   }
  
//   // On iOS, render the modal
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//       statusBarTranslucent
//     >
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
//           <View style={[
//             styles.dropdownMenuIOS, 
//             { 
//               backgroundColor: colors.backgroundSecondary,
//               borderColor: colors.border,
//               ...dropdownPosition 
//             }
//           ]}>
//             {children}
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

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

        const safeUserName = (userName || "user")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-_]/g, "")
          .toLowerCase();

        // navigation.navigate('Broadcaster', {
        //   roomName: `user-${safeUserName}`,
        //   streamId: `stream-${safeUserName}`,
        //   userName: userData?.name || 'User',
        //   userId: userId
        // });

        navigation.navigate('Broadcaster', {
          roomName: 'match-123',  // ← Changed from user-{username}
          streamId: 'stream-1',   // ← Fixed stream ID
          userName: userData?.name || 'User',
          userId: userId
        });


        
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>
        Go Live
      </Text>
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
        navigation.navigate('ManagePost');
      }}
      style={styles.dropdownTouchable}
    >
      <Text style={[styles.dropdownItem, { color: colors.text }]}>Manage Posts</Text>
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
      
      console.log('Fetched userssssss:', response.data);
      
      // Get current user data from storage
      const currentUserData = await AsyncStorage.getItem('userData');
      console.log('Current user data from storage:', currentUserData);
      
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        
        const currentUserInResponse = response.data.find(user => user.id === currentUser.id);
        
        if (currentUserInResponse) {
          console.log('Current user found in response:', {
            id: currentUserInResponse.id,
            name: currentUserInResponse.name,
            email: currentUserInResponse.email
          });
          
         
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


const fetchChatList = async () => {
  setIsLoading(true);
  setError(null);
  setIsInitialLoading(true);
  const token = await AsyncStorage.getItem('userToken');
  try {
    // FORCE personal account mode only
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
    await saveChatsToStorage(uniqueChats);
  } catch (err) {
    console.error('Failed to load chat list:', err.response?.data || err.message);
    setError('Failed to load chats. Please try again.');
  } finally {
    setIsLoading(false);
    setIsInitialLoading(false);
  }
};

const fetchChatListSilently = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    // FORCE personal account mode only
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
        saveChatsToStorage(uniqueChats);
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
      fetchUnreadNotificationCount();
      let isMounted = true;

      const loadData = async () => {
        try {
          await loadCachedChats(); 
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

  


  useEffect(() => {
  const interval = setInterval(() => {
    fetchChatListSilently(); 
  }, 30000);

  return () => clearInterval(interval);
}, [searchQuery, readChats]);


 // ─── Global call notification handler (from FCM foreground) ──────────────────
useEffect(() => {

global.__callNotificationHandler = (callData) => {
  console.log('📞 Call notification received in HomeScreen:', callData);
  console.log('🔍 CallData structure:', JSON.stringify(callData, null, 2));
  console.log('Profile Image in notification:', callData.profileImage);
  console.log('Caller Name in notification:', callData.callerName);
  
  // ✅ Check if profile image is nested
  const profileImagePath = 
    callData.profileImage || 
    callData.callerInfo?.profileImage || 
    '';
  
  console.log('📸 Extracted profile image path:', profileImagePath);
  console.log('🔗 Full URL would be:', profileImagePath ? `${API_ROUTE_IMAGE}${profileImagePath}` : 'No image');

  if (global.__onCallScreen) {
    console.log('Already on call screen, ignoring');
    return;
  }

  InCallManager.stopRingtone();
  Vibration.cancel();

  setCallerInfo(prev => {
    console.log('[Notification Handler] Previous SDP exists:', !!prev?.offer?.sdp);

    if (prev?.offer?.sdp) {
      console.log('[Notification Handler] Keeping existing SDP');
      return {
        ...prev,
        profileImage: profileImagePath || prev.profileImage,
        name: callData.callerName || callData.callerInfo?.name || prev.name,
      };
    }

    return {
      profileImage: profileImagePath,
      name: callData.callerName || callData.callerInfo?.name || 'Unknown Caller',
      offer: null,
    };
  });

  setIsVideoCall(callData.callType === 'video' || callData.isVideoCall || false);
};

  return () => {
    global.__callNotificationHandler = null;
  };
}, [navigation]);

// ─── Global call accept handler (from notification accept button) ────────────
useEffect(() => {
  global.__callAcceptHandler = async (callData) => {
    console.log('📞 Call acceptance from notification:', callData);

    setShowIncomingCallModal(false);
    InCallManager.stopRingtone();
    Vibration.cancel();

    // Navigate with autoAnswerOnOffer: true
    // VoiceVideoCallScreen will wait for the WebSocket offer (with SDP) then auto-answer
    setTimeout(() => {
      navigation.navigate('VoiceCalls', {
        profile_image: '',
        name: callData.callerName,
        targetUserId: callData.callerId,
        incomingOffer: null,       // no SDP yet — comes via WebSocket
        isIncomingCall: true,
        isInitiator: false,
        autoAnswerOnOffer: true,   // ← KEY: auto-answer when offer arrives
      });
    }, 100);
  };

  const checkForPendingCallAccept = async () => {
    try {
      const acceptPending = await AsyncStorage.getItem('accept_pending_call');
      if (acceptPending) {
        const callData = JSON.parse(acceptPending);
        await AsyncStorage.removeItem('accept_pending_call');
        if (callData?.roomId) {
          global.__callAcceptHandler(callData);
        }
      }
    } catch (error) {
      console.error('Error checking pending call accept:', error);
    }
  };

  checkForPendingCallAccept();

  return () => {
    global.__callAcceptHandler = null;
  };
}, [navigation]);


// ─── Home screen WebSocket — listens for incoming offers ─────────────────────
useEffect(() => {
  const connectCallWebSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const retrieveUserId = await AsyncStorage.getItem('userData');

      if (!token || !retrieveUserId) {
        console.warn('Missing auth data, websocket not started');
        return;
      }

      const userDataObj = JSON.parse(retrieveUserId);
      const currentUserId = userDataObj.id;
      const ROOM_ID = `user-${currentUserId}`;
      const SIGNALING_SERVER = 'wss://api.showapp.ng';
      const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

      if (ws.current?.readyState === WebSocket.OPEN) {
        console.log('[Call WS] Already connected');
        return;
      }

      ws.current = new WebSocket(url);
      ws.current.binaryType = 'arraybuffer';

      ws.current.onopen = () => {
        console.log('[Call WS] Connected');
      };

      

// ws.current.onmessage = (evt) => {
//   let data;
//   try {
//     data = JSON.parse(evt.data);
//   } catch {
//     return;
//   }

//   console.log("========== HOME WS RECEIVED ==========");
//   console.log("Full data:", JSON.stringify(data, null, 2));
//   console.log("TYPE:", data?.type);
//   console.log("HAS OFFER:", !!data?.offer);
//   console.log("HAS SDP:", !!data?.offer?.sdp);
  
//   console.log("🔍 CHECKING IMAGE LOCATION:");
//   console.log("  - data.offer.callerInfo:", data?.offer?.callerInfo);
//   console.log("  - data.offer.callerInfo.profileImage:", data?.offer?.callerInfo?.profileImage);
//   console.log("  - data.callerInfo:", data?.callerInfo);
//   console.log("  - data.profile_image:", data?.profile_image);
//   console.log("======================================");

//   // SERVER SENDS incoming_call
//   if (data.type === 'incoming_call' && data.offer?.sdp) {
//     // 🔴 CRITICAL FIX: Prevent multiple modals
//     if (isCallBeingHandledRef.current) {
//       console.log('[Call WS] Already handling a call, ignoring duplicate');
//       return;
//     }
    
//     console.log('[Call WS Home] Valid offer received, SDP length:', data.offer.sdp.length);
    
//     // ✅ FIX: Extract profile image from the correct location
//     const profileImagePath = 
//       data.offer?.callerInfo?.profileImage || 
//       data.callerInfo?.profileImage ||
//       data.profile_image ||
//       '';
    
//     const callerName = 
//       data.offer?.callerInfo?.name ||
//       data.caller_name ||
//       data.offer?.callerName ||
//       'Unknown Caller';
    
//     console.log('[Call WS Home] ✅ Extracted Profile Image Path:', profileImagePath);
//     console.log('[Call WS Home] ✅ Extracted Caller Name:', callerName);
    
//     // Set the lock
//     isCallBeingHandledRef.current = true;
    
//     setCallerInfo({
//       profileImage: profileImagePath,
//       name: callerName,
//       offer: data.offer,
//     });
    
//     setIsVideoCall(data.offer.isVideoCall || false);
//     setShowIncomingCallModal(true);
//     return;
//   }
// };

ws.current.onmessage = (evt) => {
  let data;
  try {
    data = JSON.parse(evt.data);
  } catch {
    return;
  }

  console.log("========== HOME WS RECEIVED ==========");
  console.log("Full data:", JSON.stringify(data, null, 2));
  
  if (data.type === 'incoming_call' && data.offer?.sdp) {
    if (isCallBeingHandledRef.current) {
      console.log('[Call WS] Already handling a call, ignoring duplicate');
      return;
    }
    
    // ✅ Extract profile image from ALL possible locations
    const profileImagePath = 
      data.offer?.callerInfo?.profileImage || 
      data.callerInfo?.profileImage ||
      data.profileImage ||
      data.profile_image ||
      '';
    
    const callerName = 
      data.offer?.callerInfo?.name ||
      data.callerInfo?.name ||
      data.caller_name ||
      'Unknown Caller';
    
    console.log('[Call WS Home] ✅ Extracted Profile Image Path:', profileImagePath);
    console.log('[Call WS Home] ✅ Extracted Caller Name:', callerName);
    console.log('[Call WS Home] Full data.offer:', JSON.stringify(data.offer, null, 2));
    
    isCallBeingHandledRef.current = true;
    
    setCallerInfo({
      profileImage: profileImagePath,
      name: callerName,
      offer: data.offer,
    });
    
    setIsVideoCall(data.offer.isVideoCall || false);
    setShowIncomingCallModal(true);
    return;
  }
};
      ws.current.onerror = (e) => {
        // console.error('[Call WS] Error', e);
      };

      ws.current.onclose = (e) => {
        //console.log('[Call WS] Closed', e.code, e.reason);
        setTimeout(() => {
          if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            connectCallWebSocket();
          }
        }, 5000);
      };

    } catch (err) {
     // console.error('[Call WS] Failed to connect', err);
    }
  };

  connectCallWebSocket();

  return () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };
}, [navigation]);

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

// const handleAcceptCall = () => {
//   console.log('accept call pressed with offer:', callerInfo.offer);
//   navigation.navigate('VoiceCalls', {
//     profile_image: callerInfo.profileImage,
//     name: callerInfo.name,
//     incomingOffer: callerInfo.offer,
//     isIncomingCall: true,
//     isInitiator: false,
//     isVideoCall: isVideoCall // Pass the video call state
//   });
//   setShowIncomingCallModal(false);
// };

// const handleAcceptCall = () => {

//   console.log("========== ACCEPT ==========");
// console.log("callerInfo:", callerInfo);
// console.log("offer exists:", !!callerInfo?.offer);
// console.log("sdp exists:", !!callerInfo?.offer?.sdp);
// console.log("============================");
//   setShowIncomingCallModal(false);
//   InCallManager.stopRingtone();
//   Vibration.cancel();

//   if (!callerInfo?.offer?.sdp) {
//     console.error('[Accept] Offer has no SDP!');
//     Alert.alert('Error', 'Call offer expired. Please ask them to call again.');
//     return;
//   }

//   console.log('[Accept] Navigating with full offer, SDP length:', callerInfo.offer.sdp.length);

//   navigation.navigate('VoiceCalls', {
//     profile_image: callerInfo.profileImage || '',
//     name: callerInfo.name || 'Unknown',
//     targetUserId: callerInfo.offer?.targetUserId || callerInfo.offer?.callerId || '',
//     incomingOffer: callerInfo.offer,  // ← FULL offer WITH SDP
//     isIncomingCall: true,
//     isInitiator: false,
//     autoAnswerOnOffer: false,         // ← false: offer already has SDP, handle directly
//   });
// };

const handleAcceptCall = () => {
  console.log("========== ACCEPT ==========");
  console.log("caller-Info:", callerInfo);
  console.log("offer exists:", !!callerInfo?.offer);
  console.log("sdp exists:", !!callerInfo?.offer?.sdp);
  console.log("============================");
  
  // Release the lock
  isCallBeingHandledRef.current = false;
  
  setShowIncomingCallModal(false);
  InCallManager.stopRingtone();
  Vibration.cancel();

  if (!callerInfo?.offer?.sdp) {
    console.error('[Accept] Offer has no SDP!');
    Alert.alert('Error', 'Call offer expired. Please ask them to call again.');
    return;
  }

  console.log('[Accept] Navigating with full offer, SDP length:', callerInfo.offer.sdp.length);

  navigation.navigate('VoiceCalls', {
    profile_image: callerInfo.profileImage || '',
    name: callerInfo.name || 'Unknown',
    targetUserId: callerInfo.offer?.targetUserId || callerInfo.offer?.callerId || '',
    incomingOffer: callerInfo.offer,
    isIncomingCall: true,
    isInitiator: false,
    autoAnswerOnOffer: false,
  });
};

// Update handleRejectCall to release the lock
const handleRejectCall = () => {
  // Release the lock
  isCallBeingHandledRef.current = false;
  
  InCallManager.stopRingtone();
  Vibration.cancel();
  
  if (ws.current?.readyState === WebSocket.OPEN) {
    ws.current.send(JSON.stringify({ 
      type: 'reject_call',
      caller_id: callerInfo.offer?.targetUserId,
      room_id: callerInfo.offer?.roomId
    }));
  }
  
  setShowIncomingCallModal(false);
  setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
};

// const handleRejectCall = () => {
//   InCallManager.stopRingtone();
//   Vibration.cancel();
  
//   if (ws.current?.readyState === WebSocket.OPEN) {
//     ws.current.send(JSON.stringify({ 
//       type: 'reject_call',
//       caller_id: callerInfo.offer?.targetUserId,
//       room_id: callerInfo.offer?.roomId
//     }));
//   }
  
//   setShowIncomingCallModal(false);
//   setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
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
    // Force personal account mode always
    const mode = await AsyncStorage.getItem('accountMode') || 'personal';
    if (mode !== 'personal') {
      // If it's not personal, switch it back
      await AsyncStorage.setItem('accountMode', 'personal');
      setAccountMode('personal');
    } else {
      setAccountMode(mode);
    }
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
      //Alert.alert('Error', 'Failed to mark messages as read. Please try again.');
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
          <Text style={styles.headerTitle}>Chat</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.exploreIconContainer}
              onPress={toggleTheme}
            >
              <Icon 
                style={{ marginRight: 15 }}
                name={isDark ? 'moon' : 'sunny'}
                size={25} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('EssentialPlatforms')}
              style={styles.exploreIconContainer}
            >
              <Icon name="compass-outline" size={27} color="#fff" style={{ marginRight: 31 }} />
              <View style={styles.exploreBadge}>
                <Text style={[styles.exploreBadgeText,{fontWeight:'800'}]}>Explore</Text>
              </View>
            </TouchableOpacity>
{/* 
            <TouchableOpacity 
                onPress={() => navigation.navigate('NotificationsScreen')}
                style={styles.notificationIconContainer}
              >
                <Icon name="notifications-outline" size={25} color="#fff" style={{ marginRight: 20 }} />
                {unreadNotificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={handleCameraLaunch}>
              <Icon name="camera-outline" size={25} color="#fff" style={{ marginRight: 20 }} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
              <Icon name="ellipsis-vertical" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Dropdown for Android */}
        
          {/* {Platform.OS === 'android' && showDropdown && (
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
          )} */}
          {/* Unified Dropdown Modal - Works for both iOS and Android */}
<Modal
  visible={showDropdown}
  transparent
  animationType="fade"
  onRequestClose={() => setShowDropdown(false)}
  statusBarTranslucent
>
  <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
  </TouchableWithoutFeedback>
  
  <View style={[
    styles.dropdownMenu, 
    { 
      backgroundColor: colors.backgroundSecondary, 
      borderColor: colors.border,
      position: 'absolute',
      top: 80 + (insets.top || 0),
      right: 20,
      zIndex: 10000,
    }
  ]}>
    {renderDropdownContent()}
  </View>
</Modal>
        
        {/* Dropdown Modal for iOS */}
        {/* <DropdownModal 
          visible={showDropdown && Platform.OS === 'ios'} 
          onClose={() => setShowDropdown(false)}
          dropdownPosition={dropdownPosition}
        >
          {renderDropdownContent()}
        </DropdownModal> */}
        
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
       <View style={[styles.searchBox]}>
  <Icon name="search" size={20} color="#666" style={{ marginRight: 12 }} />
  <TextInput
    ref={searchInputRef}
    placeholder="Search or start new chat"
    style={styles.searchInput}
    placeholderTextColor="#888"
    value={searchText}
    onChangeText={(text) => setSearchText(text)}
    clearButtonMode="while-editing"
    onFocus={() => setIsSearchFocused(true)}
    onBlur={() => setIsSearchFocused(false)}

    keyboardType="default"
    returnKeyType="search"
    onSubmitEditing={() => {
      setSearchQuery(searchText);
      Keyboard.dismiss();
    }}
  />
  {searchText.length > 0 && (
    <TouchableOpacity 
      onPress={() => {
        setSearchText('');
        setSearchQuery('');
        searchInputRef.current?.focus(); // Keep focus after clearing
      }}
    >
      <Icon name="close-circle" size={20} color="#666" />
    </TouchableOpacity>
  )}
</View>
      <FlatList
      data={filteredChatList}
      keyExtractor={(item) => `${item.id}-${item.type}-${item.unread_count}`}
      extraData={chatList}
      initialNumToRender={10}
      keyboardShouldPersistTaps="handled"
      maxToRenderPerBatch={10}
      windowSize={21}
      ListHeaderComponent={() => (
        <>
         

          
          {/* Updated section tabs with user status */}
          <View style={styles.sectionTabs}>
            <Text style={[styles.sectionTab, { fontWeight: '600', color: '#0d64dd' }]}>
              {searchQuery ? 'SEARCH RESULTS' : 'ALL PERSONAL CHATS'}
            </Text>

            {/* Show current user's online status */}
            {userId && (
              <View style={styles.yourStatusContainer}>
                <OnlineStatusBadge 
                  userId={userId}
                  showText={true}
                  showDot={true}
                  showLastSeen={true}
                  showDetailedTime={true}
                  textStyle={styles.yourStatusText}
                  dotSize={8}
                />
              </View>
            )}
          </View>
        </>
      )}
              

          renderItem={({ item }) => (
            <TouchableOpacity
              // onPress={() => {
              //   markMessagesAsRead(item.id, item.type);
              //   if (item.type === 'group') {
              //     navigation.navigate('PrivateChat', {
              //       groupId: item.id,
              //       groupSlug: item.group_slug,
              //       name: item.name,
              //       chatType: 'group',
              //       profile_image: item.avatar,
              //       members_count: item.members_count,
              //       creator_id: item.creator_id,
              //     });
              //   } else {
              //     navigation.navigate('PrivateChat', {
              //       receiverId: item.receiverId || item.id,
              //       name: item.name,
              //       chatType: 'single',
              //       profile_image: item.avatar,
              //     });
              //   }
              // }}
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
                    userIdd: item.receiverId || item.id, 
                  });
                }
              }}
              style={[styles.chatItem]}
            >
              {/* Avatar with online status badge */}
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    item.avatar
                      ? { uri: item.avatar }
                      : item.type === 'group'
                      ? { uri: 'https://cdn2.iconfinder.com/data/icons/facebook-51/32/FACEBOOK-11-1024.png' }
                      : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={[styles.avatar, { borderColor: colors.border }]}
                  onError={() => console.log('Failed to load image for chat:', item.id)}
                />
                
                {/* Show online status badge only for single chats */}
                {item.type === 'single' && (
                  <OnlineStatusBadge 
                    userId={item.receiverId || item.id}
                    showDot={true}
                    dotSize={14}
                    position="bottom-right"
                    avatarSize={48}
                    borderWidth={2}
                    borderColor={colors.card}
                  />
                )}
                
                {/* For groups, show group icon badge */}
                {item.type === 'group' && (
                  <View style={styles.groupBadge}>
                    <Icon name="people" size={12} color="#fff" />
                  </View>
                )}
              </View>
              
              <View style={styles.chatContent}>
                <View style={styles.chatHeaderRow}>
                  <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>
                    {highlightSearchText(item.name, searchQuery) ||
                      (item.type === 'group' ? 'Group Chat' : 'Unnamed Chat')}
                  </Text>
                  
                  {item.type === 'group' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.memberCountText]}>{item.members_count || 0}</Text>
                      {item.is_creator && (
                        <Icon name="star" size={14} color="#FFD700" style={{ marginLeft: 4 }} />
                      )}
                    </View>
                  )}
                </View>
                
                <Text style={[styles.chatMessage, { color: colors.textSecondary }]} numberOfLines={1}>
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
                <Text style={[styles.emptyText,{marginTop:10}]}>Ask Showa Ai </Text>
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
                
                {/* <Icon name="add-comment" size={20} color="#fff" /> */}
              <Text style={[styles.emptyText,{marginTop:15}]}>Start New Chat</Text>
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
      {/* <BottomNav navigation={navigation} setShowAccountModal={setShowAccountModal} /> */}

      <BottomNav 
            navigation={navigation} 
            setShowAccountModal={setShowAccountModal}
            activeRoute="Home" 
              style={{ zIndex: 9999 }}
          />

       <IncomingCallModal
        visible={showIncomingCallModal}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        profileImage={callerInfo.profileImage}
        callerName={callerInfo.name}
        isVideoCall={isVideoCall}
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
      {/* <TouchableOpacity
        style={[styles.fabAi]}
        onPress={() => navigation.navigate('ChatAi')}
        //onPress={() => navigation.navigate('Earnings')}
      >
        <Text style={{color:'#fff', fontWeight:'600', fontSize:20}}>Ai</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UserContactListPersonalAccount')}
       // onPress={() => navigation.navigate('ChatAi')}
      >
        {/* <Text style={{color:"#0d64dd"}}>Contact</Text> */}
        <Icon name="add" size={24} color="#0d64dd" />
      </TouchableOpacity>

      <EarningsSlideInManager />
      <PinUnlockModal navigation={navigation} />
      {/* <EarningFloatingButton navigation={navigation} /> */}
    </View>
  );
};


const createStyles = (colors, insets, isDark)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 125,
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
    bottom: 200,
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
  paddingBottom: Platform.OS === 'android' ? 0 : 0,
  paddingTop: Platform.OS === 'android' ? 14 : 0,
  borderBottomLeftRadius: Platform.OS === 'android' ? 0 : 0,
  borderBottomRightRadius: Platform.OS === 'android' ? 0 : 0,
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
    color: colors.textSecondary,
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
  yourStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  
  yourStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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





