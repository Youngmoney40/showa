/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import CallKeepService from './src/services/CallKeepService';

// Register background handler FIRST before AppRegistry
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[index.js] Background message:', remoteMessage);

  const data = remoteMessage.data || {};

  if (data.type === 'incoming_call') {
    const callId = `call_${Date.now()}_${data.caller_id || 'unknown'}`;

    console.log("========== INCOMING CALL RECEIVED from index.js ==========");
  console.log("Full data:", data);
  console.log("data.offer:", data.offer);
  console.log("data.offer?.sdp exists:", !!data.offer?.sdp);
  console.log("===========================================");

    try {
      const initialized = await CallKeepService.initialize();
      if (initialized) {
        await CallKeepService.displayIncomingCall({
          callId,
          callerName: data.caller_name || 'Unknown',
          callerId: data.caller_id || data.room_id || 'unknown',
          isVideo: data.call_type === 'video',
          roomId: data.room_id,
        });
      }
    } catch (e) {
      console.error('[index.js] CallKeep background error:', e);
    }
  }

  onsole.log('Message handled in the background!', remoteMessage);
  PushNotification.localNotification({
    channelId: "showa-notifications",
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  });
});


AppRegistry.registerComponent('showa', () => App);

// Handle background messages
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
//   PushNotification.localNotification({
//     channelId: "showa-notifications",
//     title: remoteMessage.notification.title,
//     message: remoteMessage.notification.body,
//   });
// });

//AppRegistry.registerComponent(appName, () => App);