
// import messaging from '@react-native-firebase/messaging';
// import { Platform, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import PushNotification from 'react-native-push-notification';
// import { API_ROUTE } from '../../api_routing/api';

// class NotificationService {
//   constructor() {
//     this.configurePushNotification();
//   }

//   configurePushNotification() {
//     PushNotification.configure({
//       onRegister: function(token) {
//         console.log('TOKEN:', token);
//       },
//       onNotification: function(notification) {
//         console.log('NOTIFICATION:', notification);
//         notification.finish(PushNotification.FetchResult);
//       },
//       onAction: function(notification) {
//         console.log('ACTION:', notification.action);
//         console.log('NOTIFICATION:', notification);
//       },
//       onRegistrationError: function(err) {
//         console.error(err.message, err);
//       },
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },
//       popInitialNotification: true,
//       requestPermissions: Platform.OS === 'ios',
//     });
//   }

//   async requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Authorization status:', authStatus);
//       return true;
//     }
//     return false;
//   }

//   async getFCMToken() {
//     try {
//       let fcmToken = await AsyncStorage.getItem('fcmToken');
      
//       if (!fcmToken) {
//         fcmToken = await messaging().getToken();
//         if (fcmToken) {
//           await AsyncStorage.setItem('fcmToken', fcmToken);
//           console.log('FCM Token:', fcmToken);
//           return fcmToken;
//         }
//       } else {
//         console.log('Existing FCM Token:', fcmToken);
//         return fcmToken;
//       }
//     } catch (error) {
//       console.log('Error getting FCM token:', error);
//       return null;
//     }
//   }

//   async registerTokenWithBackend(token, userToken) {
//     try {
//       const response = await fetch(`${API_ROUTE}/notifications/register-device/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${userToken}`,
//         },
//         body: JSON.stringify({
//           registration_id: token,
//           platform: Platform.OS,
//         }),
//       });
      
//       const data = await response.json();
//       if (response.ok) {
//         console.log('Device registered successfully:', data);
//         return true;
//       } else {
//         console.error('Failed to register device:', data);
//         return false;
//       }
//     } catch (error) {
//       console.error('Error registering token:', error);
//       return false;
//     }
//   }

//   async unregisterTokenWithBackend(token, userToken) {
//     try {
//       const response = await fetch(`${API_ROUTE}/notifications/unregister-device/`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${userToken}`,
//         },
//         body: JSON.stringify({
//           registration_id: token,
//         }),
//       });
      
//       if (response.ok) {
//         console.log('Device unregistered successfully');
//         await AsyncStorage.removeItem('fcmToken');
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Error unresgistering token:', error);
//       return false;
//     }
//   }

//   setupForegroundHandler() {
//     messaging().onMessage(async remoteMessage => {
//       console.log('Foreground notification:', remoteMessage);
      
//       // Show local notification when app is in foreground
//       PushNotification.localNotification({
//         channelId: "showa-notifications",
//         title: remoteMessage.notification.title,
//         message: remoteMessage.notification.body,
//         largeIconUrl: remoteMessage.notification.android?.imageUrl,
//         bigPictureUrl: remoteMessage.notification.android?.imageUrl,
//         smallIcon: "ic_notification",
//         playSound: true,
//         soundName: "default",
//         vibrate: true,
//         userInfo: remoteMessage.data,
//       });
//     });
//   }

//   setupBackgroundHandler() {
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Background notification:', remoteMessage);
//       // Handle background message
//     });
//   }

//   async setupNotificationChannels() {
//     if (Platform.OS === 'android') {
//       PushNotification.createChannel(
//         {
//           channelId: "showa-notifications",
//           channelName: "Showa Notifications",
//           channelDescription: "Notifications for Showa app",
//           playSound: true,
//           soundName: "default",
//           importance: 4,
//           vibrate: true,
//         },
//         (created) => console.log(`CreateChannel returned '${created}'`)
//       );
      
//       PushNotification.createChannel(
//         {
//           channelId: "showa-messages",
//           channelName: "Messages",
//           channelDescription: "Message notifications",
//           playSound: true,
//           soundName: "default",
//           importance: 4,
//           vibrate: true,
//         },
//         (created) => console.log(`CreateChannel returned '${created}'`)
//       );
//     }
//   }

//   async initialize(userToken) {
//     try {
//       // Setup notification channels for Android
//       await this.setupNotificationChannels();
      
//       // Request permission for iOS
//       const granted = await this.requestUserPermission();
      
//       if (granted || Platform.OS === 'android') {
//         // Get FCM token
//         const token = await this.getFCMToken();
        
//         if (token && userToken) {
//           // Register token with backend
//           await this.registerTokenWithBackend(token, userToken);
//         }
        
//         // Setup handlers
//         this.setupForegroundHandler();
//         this.setupBackgroundHandler();
        
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Error initializing notifications:', error);
//       return false;
//     }
//   }

//   async logout(userToken) {
//     try {
//       const token = await AsyncStorage.getItem('fcmToken');
//       if (token && userToken) {
//         await this.unregisterTokenWithBackend(token, userToken);
//       }
//     } catch (error) {
//       console.error('Error during logout cleanup:', error);
//     }
//   }
// }

// export default new NotificationService();


import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { API_ROUTE } from '../../api_routing/api';

class NotificationService {
  constructor() {
    this.configurePushNotification();
  }

  configurePushNotification() {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('TOKEN:', token);
      },
      // onNotification: function(notification) {
      //   console.log('NOTIFICATION:', notification);
      //   notification.finish(PushNotification.FetchResult.NoData);
      // },
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

  // Helper function to extract notification data safely
  extractNotificationData(remoteMessage) {
    // Try to get title and body from different possible locations
    let title = '';
    let body = '';
    let imageUrl = null;
    
    // Check notification object (for messages with notification payload)
    if (remoteMessage.notification) {
      title = remoteMessage.notification.title || '';
      body = remoteMessage.notification.body || '';
      imageUrl = remoteMessage.notification.android?.imageUrl || 
                 remoteMessage.notification.imageUrl || 
                 null;
    }
    
    // Check data payload (for messages with only data payload)
    if (remoteMessage.data) {
      title = remoteMessage.data.title || title;
      body = remoteMessage.data.body || body;
      imageUrl = remoteMessage.data.image || remoteMessage.data.imageUrl || imageUrl;
    }
    
    // If still no title/body, use defaults
    if (!title && !body) {
      title = 'Showa Notification';
      body = 'You have a new notification';
    }
    
    return { title, body, imageUrl };
  }

  setupForegroundHandler() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', JSON.stringify(remoteMessage, null, 2));
      
      // Safely extract notification data
      const { title, body, imageUrl } = this.extractNotificationData(remoteMessage);
      
      console.log('Extracted - Title:', title, 'Body:', body);
      
      // Show local notification when app is in foreground
      PushNotification.localNotification({
        channelId: "showa-notifications",
        title: title,
        message: body,
        largeIconUrl: imageUrl,
        bigPictureUrl: imageUrl,
        smallIcon: "ic_notification",
        playSound: true,
        soundName: "default",
        vibrate: true,
        userInfo: remoteMessage.data || {},
        // For Android
        priority: "high",
        importance: "high",
        // For iOS
        alertAction: "View",
        category: "showa",
      });
      
      // Also show alert for debugging (optional)
      if (__DEV__) {
        Alert.alert(title, body);
      }
    });
  }

  setupBackgroundHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification received:', JSON.stringify(remoteMessage, null, 2));
      
      // Safely extract notification data
      const { title, body, imageUrl } = this.extractNotificationData(remoteMessage);
      
      // Show notification from background
      PushNotification.localNotification({
        channelId: "showa-notifications",
        title: title,
        message: body,
        largeIconUrl: imageUrl,
        bigPictureUrl: imageUrl,
        smallIcon: "ic_notification",
        playSound: true,
        soundName: "default",
        vibrate: true,
        userInfo: remoteMessage.data || {},
      });
    });
  }

  // Handle notification when app is opened from killed state
  async handleInitialNotification() {
    try {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App opened from killed state by notification:', initialNotification);
        
        const { title, body } = this.extractNotificationData(initialNotification);
        const notificationData = initialNotification.data || {};
        
        // Navigate based on notification type
        this.handleNotificationNavigation(notificationData);
        
        return initialNotification;
      }
    } catch (error) {
      console.error('Error getting initial notification:', error);
    }
    return null;
  }

  // Handle notification when app is in background and user taps it
  setupNotificationOpenedHandler() {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background by notification:', remoteMessage);
      
      const notificationData = remoteMessage.data || {};
      this.handleNotificationNavigation(notificationData);
    });
  }

  // Navigate based on notification type
  handleNotificationNavigation(data) {
    const notificationType = data.type || data.notification_type;
    
    console.log('Navigating based on notification type:', notificationType);
    console.log('Notification data:', data);
    
    // You can implement navigation based on notification type
    // This depends on your navigation setup
    switch (notificationType) {
      case 'like':
      case 'comment':
        // Navigate to post detail
        if (data.post_id) {
          // navigation.navigate('PostDetail', { postId: data.post_id });
          console.log('Navigate to post:', data.post_id);
        }
        break;
      case 'follow':
        // Navigate to user profile
        if (data.follower_id || data.sender_id) {
          const userId = data.follower_id || data.sender_id;
          console.log('Navigate to user profile:', userId);
        }
        break;
      case 'message':
        // Navigate to chat
        if (data.sender_id) {
          console.log('Navigate to chat with:', data.sender_id);
        }
        break;
      case 'reward':
        // Navigate to wallet
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
        (created) => console.log(`CreateChannel returned '${created}'`)
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
        (created) => console.log(`CreateChannel returned '${created}'`)
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
        (created) => console.log(`CreateChannel returned '${created}'`)
      );
    }
  }

  // Delete/revoke token (call on logout)
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
      console.log('Initializing notifications...');
      
      // Setup notification channels for Android
      await this.setupNotificationChannels();
      
      // Request permission for iOS
      const granted = await this.requestUserPermission();
      
      if (granted || Platform.OS === 'android') {
        // Get FCM token
        const token = await this.getFCMToken();
        
        if (token && userToken) {
          console.log('Got FCM token, registering with backend...');
          // Register token with backend
          await this.registerTokenWithBackend(token, userToken);
        } else {
          console.log('No token or userToken available');
        }
        
        // Setup handlers
        this.setupForegroundHandler();
        this.setupBackgroundHandler();
        this.setupNotificationOpenedHandler();
        
        // Handle initial notification (app opened from killed state)
        await this.handleInitialNotification();
        
        console.log('Notification service initialized successfully');
        return true;
      }
      console.log('Notification permission not granted');
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