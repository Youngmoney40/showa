

import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { API_ROUTE } from '../../api_routing/api';
import CallKeepService from '../services/CallKeepService';

class NotificationService {
  constructor() {
    this.configurePushNotification();
  }

  configurePushNotification() {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('TOKEN:', token);
      },
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
      },
      onAction: function(notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  }

  async getFCMToken() {
    try {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      
      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
          console.log('FCM Token:', fcmToken);
          return fcmToken;
        }
      } else {
        console.log('Existing FCM Token:', fcmToken);
        return fcmToken;
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
      return null;
    }
  }

  async registerTokenWithBackend(token, userToken) {
    try {
      const response = await fetch(`${API_ROUTE}/notifications/register-device/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          registration_id: token,
          platform: Platform.OS,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log('Device registered successfully:', data);
        return true;
      } else {
        console.error('Failed to register device:', data);
        return false;
      }
    } catch (error) {
      console.error('Error registering token:', error);
      return false;
    }
  }

  async unregisterTokenWithBackend(token, userToken) {
    try {
      const response = await fetch(`${API_ROUTE}/notifications/unregister-device/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          registration_id: token,
        }),
      });
      
      if (response.ok) {
        console.log('Device unregistered successfully');
        await AsyncStorage.removeItem('fcmToken');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unregistering token:', error);
      return false;
    }
  }

  extractNotificationData(remoteMessage) {
    let title = '';
    let body = '';
    let imageUrl = null;
    
    if (remoteMessage.notification) {
      title = remoteMessage.notification.title || '';
      body = remoteMessage.notification.body || '';
      imageUrl = remoteMessage.notification.android?.imageUrl || 
                 remoteMessage.notification.imageUrl || 
                 null;
    }
    
    if (remoteMessage.data) {
      title = remoteMessage.data.title || title;
      body = remoteMessage.data.body || body;
      imageUrl = remoteMessage.data.image || remoteMessage.data.imageUrl || imageUrl;
    }
    
    if (!title && !body) {
      title = 'Showa Notification';
      body = 'You have a new notification';
    }
    
    return { title, body, imageUrl };
  }

  handleCallNotification(notificationData) {
  console.log('📞 Handling call notification:', notificationData);

  const {
    type,
    caller_name,
    room_id,
    call_type,
    caller_id,  // may be undefined if backend doesn't send it
  } = notificationData;

  if (type === 'incoming_call') {
    const callId = `call_${Date.now()}_${caller_id || room_id || 'unknown'}`;
 console.log("========== INCOMING CALL RECEIVED from notificationServices_page ==========");
  // console.log("Full data:", data);
  // console.log("data.offer:", data.offer);
  // console.log("data.offer?.sdp exists:", !!data.offer?.sdp); 
  console.log("===========================================");
    this.storePendingCall({
      callerName: caller_name,
      roomId: room_id,
      callType: call_type || 'audio',
      callerId: caller_id,
      callId: callId,      // store callId so accept/reject can reference it
      timestamp: Date.now(),
    });

    // Show native CallKeep UI
    CallKeepService.displayIncomingCall({
      callId: callId,
      callerName: caller_name || 'Unknown Caller',
      // fallback chain: caller_id → room_id → callerName
      callerId: caller_id || room_id || caller_name || 'unknown',
      isVideo: call_type === 'video',
      roomId: room_id,
    });

    // Notify active screendd
    if (global.__callNotificationHandler) {
      global.__callNotificationHandler({
        callerName: caller_name,
        roomId: room_id,
        callType: call_type || 'audio',
        callerId: caller_id,
        callId: callId,
      });
    }
  }
}

  

  async storePendingCall(callData) {
    try {
      await AsyncStorage.setItem('pending_call', JSON.stringify(callData));
    } catch (error) {
      console.error('Error storing pending call:', error);
    }
  }

  async checkPendingCall() {
    try {
      const pendingCall = await AsyncStorage.getItem('pending_call');
      if (pendingCall) {
        const callData = JSON.parse(pendingCall);
        const callAge = Date.now() - callData.timestamp;
        
        if (callAge >= 30000) {
          await AsyncStorage.removeItem('pending_call');
          
          PushNotification.localNotification({
            channelId: "showa-calls",
            title: "Missed Call",
            message: `Missed call from ${callData.callerName}`,
            userInfo: { type: 'missed_call', ...callData },
          });
        } else {
          await AsyncStorage.removeItem('pending_call');
        }
      }
    } catch (error) {
      console.error('Error checking pending call:', error);
    }
    return null;
  }

  async handleCallAcceptFromNotification(notificationData) {
    console.log('📞 Call accepted from notification:', notificationData);
    
    const callData = {
      callerName: notificationData.caller_name,
      roomId: notificationData.room_id,
      callType: notificationData.call_type || 'audio',
      callerId: notificationData.caller_id
    };
    
    await AsyncStorage.setItem('accept_pending_call', JSON.stringify(callData));
    
    if (global.__callAcceptHandler) {
      global.__callAcceptHandler(callData);
    }
  }


setupForegroundHandler() {
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification received:', JSON.stringify(remoteMessage, null, 2));

    const data = remoteMessage.data || {};

    if (data.type === 'incoming_call') {
      // 🔴 NEW: if the app is already showing/handling an incoming call
      // right now (most likely because the WebSocket delivered it first —
      // WS is instant, FCM has a small delivery delay), don't let FCM's
      // foreground handler fire a second, duplicate call flow with a
      // different generated callId.
      if (global.__isCallBeingHandled?.()) {
        console.log('[FCM Foreground] Call already being handled via WS, ignoring duplicate FCM push');
        return;
      }

      // Prefer a real callId from the payload if your backend sends one,
      // so this matches whatever the WS path used for the same call.
      const callId = data.call_id || `call_${Date.now()}_${data.caller_id || data.room_id || 'unknown'}`;
      console.log("========== INCOMING CALL RECEIVED from notificationServices_page ==========");
  console.log("Full data:", data);
  console.log("data.offer:", data.offer);
  console.log("data.offer?.sdp exists:", !!data.offer?.sdp);
  console.log("===========================================");
      await this.storePendingCall({
        callerName: data.caller_name,
        roomId: data.room_id,
        callType: data.call_type || 'audio',
        callerId: data.caller_id,
        callId: callId,
        timestamp: Date.now(),
      });

      // Show native CallKeep UI
      try {
        const initialized = await CallKeepService.initialize();
        if (initialized) {
          await CallKeepService.displayIncomingCall({
            callId: callId,
            callerName: data.caller_name || 'Unknown Caller',
            callerId: data.caller_id || data.room_id || 'unknown',
            isVideo: data.call_type === 'video',
            roomId: data.room_id,
          });
        }
      } catch (error) {
        console.error('[Foreground] CallKeep error:', error);
      }

      // Notify active screen handler (shows  in-app modal)
      if (global.__callNotificationHandler) {
        global.__callNotificationHandler({
          callerName: data.caller_name,
          roomId: data.room_id,
          callType: data.call_type || 'audio',
          callerId: data.caller_id,
          callId: callId,
        });
      }

      return;
    }

    // Regular notification
    const { title, body, imageUrl } = this.extractNotificationData(remoteMessage);
    PushNotification.localNotification({
      channelId: 'showa-notifications',
      title,
      message: body,
      largeIconUrl: imageUrl,
      bigPictureUrl: imageUrl,
      smallIcon: 'ic_notification',
      playSound: true,
      soundName: 'default',
      vibrate: true,
      userInfo: data,
    });
  });
}


setupBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification received:', JSON.stringify(remoteMessage, null, 2));

    const data = remoteMessage.data || {};

    if (data.type === 'incoming_call') {
      const callId = `call_${Date.now()}_${data.caller_id || data.room_id || 'unknown'}`;

      await this.storePendingCall({
        callerName: data.caller_name,
        roomId: data.room_id,
        callType: data.call_type || 'audio',
        callerId: data.caller_id,
        callId: callId,
        timestamp: Date.now(),
      });

      try {
        const { NativeModules } = require('react-native');
        console.log('[Background] NativeModules.CallModule:', NativeModules.CallModule);
        console.log('[Background] All NativeModules:', Object.keys(NativeModules));

        if (NativeModules.CallModule) {
          console.log('[Background] Starting foreground service...');
          NativeModules.CallModule.startCallService(
            data.caller_name || 'Unknown',
            callId,
            data.room_id || '',
            data.call_type || 'audio',
            data.caller_id || '',
          );
          console.log('[Background] Foreground service started ');
        } else {
          console.error('[Background] CallModule is NULL ');
        }
      } catch (e) {
        console.error('[Background] Error:', e);
      }

      return; 
    }

    // Regular notification
    const { title, body, imageUrl } = this.extractNotificationData(remoteMessage);
    PushNotification.localNotification({
      channelId: 'showa-notifications',
      title,
      message: body,
      largeIconUrl: imageUrl,
      bigPictureUrl: imageUrl,
      smallIcon: 'ic_notification',
      playSound: true,
      soundName: 'default',
      vibrate: true,
      userInfo: data,
    });
  });
}

// Fallback when CallKeep isn't available
_showFallbackCallNotification(data) {
  PushNotification.localNotification({
    channelId: 'showa-calls',
    title: `📞 Incoming ${data.call_type === 'video' ? 'Video' : 'Audio'} Call`,
    message: `${data.caller_name || 'Someone'} is calling you...`,
    userInfo: data,
    priority: 'max',
    importance: 'max',
    playSound: true,
    soundName: 'default',
    vibrate: true,
    ongoing: true,
    autoCancel: false,
    fullScreenIntent: true,
    actions: ['ACCEPT', 'DECLINE'],
  });
}

  async handleInitialNotification() {
    try {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App opened from killed state by notification:', initialNotification);
        
        const notificationData = initialNotification.data || {};
        
        if (notificationData.type === 'incoming_call') {
          this.handleCallAcceptFromNotification(notificationData);
        } else {
          this.handleNotificationNavigation(notificationData);
        }
        
        return initialNotification;
      }
    } catch (error) {
      console.error('Error getting initial notification:', error);
    }
    return null;
  }

  setupNotificationOpenedHandler() {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background by notification:', remoteMessage);
      
      const notificationData = remoteMessage.data || {};
      
      if (notificationData.type === 'incoming_call') {
        this.handleCallAcceptFromNotification(notificationData);
      } else {
        this.handleNotificationNavigation(notificationData);
      }
    });
  }

  handleNotificationNavigation(data) {
    const notificationType = data.type || data.notification_type;
    
    console.log('Navigating based on notification type:', notificationType);
    console.log('Notification data:', data);
    
    switch (notificationType) {
      case 'like':
      case 'comment':
        if (data.post_id) {
          console.log('Navigate to post:', data.post_id);
        }
        break;
      case 'follow':
        if (data.follower_id || data.sender_id) {
          const userId = data.follower_id || data.sender_id;
          console.log('Navigate to user profile:', userId);
        }
        break;
      case 'message':
        if (data.sender_id) {
          console.log('Navigate to chat with:', data.sender_id);
        }
        break;
      case 'reward':
        console.log('Navigate to wallet');
        break;
      default:
        console.log('Unknown notification type:', notificationType);
    }
  }

  async setupNotificationChannels() {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: "showa-notifications",
          channelName: "Showa Notifications",
          channelDescription: "Notifications for Showa app",
          playSound: true,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Notifications channel created: ${created}`)
      );
      
      PushNotification.createChannel(
        {
          channelId: "showa-messages",
          channelName: "Messages",
          channelDescription: "Message notifications",
          playSound: true,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Messages channel created: ${created}`)
      );
      
      PushNotification.createChannel(
        {
          channelId: "showa-calls",
          channelName: "Calls",
          channelDescription: "Incoming call notifications",
          playSound: true,
          soundName: "default",
          importance: 5,
          vibrate: true,
          bypassDnd: true,
        },
        (created) => console.log(`Calls channel created: ${created}`)
      );
      
      PushNotification.createChannel(
        {
          channelId: "showa-rewards",
          channelName: "Rewards",
          channelDescription: "Reward notifications",
          playSound: true,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Rewards channel created: ${created}`)
      );
    }
  }

  async deleteToken() {
    try {
      await messaging().deleteToken();
      await AsyncStorage.removeItem('fcmToken');
      console.log('FCM token deleted');
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  }

  async initialize(userToken) {
    try {
      await this.setupNotificationChannels();
      
      const granted = await this.requestUserPermission();
      
      if (granted || Platform.OS === 'android') {
        const token = await this.getFCMToken();
        
        if (token && userToken) {
          await this.registerTokenWithBackend(token, userToken);
        }
        
        this.setupForegroundHandler();
        this.setupBackgroundHandler();
        this.setupNotificationOpenedHandler();
        await this.handleInitialNotification();
        
        await this.checkPendingCall();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  async logout(userToken) {
    try {
      const token = await AsyncStorage.getItem('fcmToken');
      if (token && userToken) {
        await this.unregisterTokenWithBackend(token, userToken);
      }
      await this.deleteToken();
    } catch (error) {
      console.error('Error during logout cleanup:', error);
    }
  }
}

export default new NotificationService();