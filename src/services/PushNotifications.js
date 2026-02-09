// import PushNotification from 'react-native-push-notification';

// class NotificationService {
//   constructor() {
//     this.configure();
//   }

//   configure() {
//     PushNotification.configure({

//       onNotification: function (notification) {
//         console.log('LOCAL NOTIFICATION:', notification);

//         // Only for iOS
//         if (typeof notification.finish === 'function') {
//           notification.finish();
//         }
//       },

//       // Permissions to request (iOS only)
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },

//       popInitialNotification: true,
//       requestPermissions: Platform.OS === 'ios', // ✅ only iOS needs this
//     });

//     // Create Android channel
//     PushNotification.createChannel(
//       {
//         channelId: 'showa-chat',
//         channelName: 'Showa Chat Notifications',
//         channelDescription: 'Notifications for new messages',
//         soundName: 'default',
//         importance: 4,
//         vibrate: true,
//       },
//       (created) => console.log(`Channel created: ${created}`),
//     );
//   }

//   localNotification(title, message, data = {}) {
//     PushNotification.localNotification({
//       channelId: 'showa-chat',
//       title,
//       message,
//       playSound: true,
//       soundName: 'default',
//       importance: 'high',
//       vibrate: true,
//       largeIcon: '', 
//       data,
//       smallIcon: 'showa_icon',   
      
//     });
//   }



//   cancelAllNotifications() {
//     PushNotification.cancelAllLocalNotifications();
//   }
// }

// export default new NotificationService();

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelloScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello 👋</Text>
    </View>
  );
};

export default HelloScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});

