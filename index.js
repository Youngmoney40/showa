/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';


// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  PushNotification.localNotification({
    channelId: "showa-notifications",
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  });
});

//AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('showa', () => App);

