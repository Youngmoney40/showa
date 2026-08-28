
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

    // 🔴 FIX: without this return, execution fell through to the generic
    // notification-display code below — which crashed for calls
    // specifically, since call pushes are now data-only (no `notification`
    // block), so `remoteMessage.notification.title` threw
    // "Cannot read property 'title' of undefined" every time.
    return;
  }

  // 🔴 FIX: was `onsole.log` — a typo (missing "c") that threw
  // ReferenceError on EVERY background message of EVERY type, silently
  // breaking this handler before it ever reached the notification display
  // code below it.
  console.log('Message handled in the background!', remoteMessage);

  // 🔴 FIX: guard against a missing notification block in general, not
  // just for calls — any future data-only message type would otherwise
  // crash this the same way.
  if (remoteMessage.notification) {
    PushNotification.localNotification({
      channelId: "showa-notifications",
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
    });
  }
});

// 🔴 NOTE: this hardcodes 'showa' rather than using the imported `appName`.
// Whatever string is used here MUST exactly match (case-sensitive)
// MainActivity.kt's getMainComponentName() return value — currently set
// to "showa" to match this.
AppRegistry.registerComponent('showa', () => App);


// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';
// import CallKeepService from './src/services/CallKeepService';

// // Register background handler FIRST before AppRegistry
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('[index.js] Background message:', remoteMessage);

//   const data = remoteMessage.data || {};

//   if (data.type === 'incoming_call') {
//     const callId = `call_${Date.now()}_${data.caller_id || 'unknown'}`;

//     console.log("========== INCOMING CALL RECEIVED from index.js ==========");
//   console.log("Full data:", data);
//   console.log("data.offer:", data.offer);
//   console.log("data.offer?.sdp exists:", !!data.offer?.sdp);
//   console.log("===========================================");

//     try {
//       const initialized = await CallKeepService.initialize();
//       if (initialized) {
//         await CallKeepService.displayIncomingCall({
//           callId,
//           callerName: data.caller_name || 'Unknown',
//           callerId: data.caller_id || data.room_id || 'unknown',
//           isVideo: data.call_type === 'video',
//           roomId: data.room_id,
//         });
//       }
//     } catch (e) {
//       console.error('[index.js] CallKeep background error:', e);
//     }
//   }

//   console.log('Message handled in the background!', remoteMessage);
//   PushNotification.localNotification({
//     channelId: "showa-notifications",
//     title: remoteMessage.notification.title,
//     message: remoteMessage.notification.body,
//   });
// });


// AppRegistry.registerComponent('showa', () => App);

// // Handle background messages
// // messaging().setBackgroundMessageHandler(async remoteMessage => {
// //   console.log('Message handled in the background!', remoteMessage);
// //   PushNotification.localNotification({
// //     channelId: "showa-notifications",
// //     title: remoteMessage.notification.title,
// //     message: remoteMessage.notification.body,
// //   });
// // });

// //AppRegistry.registerComponent(appName, () => App);