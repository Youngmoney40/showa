
// import messaging from '@react-native-firebase/messaging';
// import { AppState, Platform, Vibration } from 'react-native';
// import CallKeep from 'react-native-callkeep';
// import InAppCallScreen from '../screens/InAppCallScreen';

// class CallService {
//   constructor() {
//     this.setupCallKeep();
//     this.setupNotificationListeners();
//   }

//   setupCallKeep() {
//     const options = {
//       ios: {
//         appName: 'Showa',
//         maximumCallGroups: 1,
//         maximumCallsPerCallGroup: 1,
//         supportsVideo: true,
//       },
//       android: {
//         alertTitle: 'Permissions required',
//         alertDescription: 'This application needs to access your phone accounts',
//         cancelButton: 'Cancel',
//         okButton: 'ok',
//         imageName: 'phone_account_icon',
//         additionalPermissions: [],
//         selfManaged: true, // For Android 10+
//       },
//     };

//     CallKeep.setup(options);
    
//     CallKeep.addEventListener('answerCall', this.onAnswerCall);
//     CallKeep.addEventListener('endCall', this.onEndCall);
//     CallKeep.addEventListener('didDisplayIncomingCall', this.onDidDisplayIncomingCall);
//     CallKeep.addEventListener('didActivateAudioSession', this.onDidActivateAudioSession);
//   }

//   setupNotificationListeners() {
//     // Handle foreground notifications
//     messaging().onMessage(async (remoteMessage) => {
//       if (remoteMessage.data?.type === 'incoming_call') {
//         this.handleIncomingCall(remoteMessage.data);
//       }
//     });

//     // Handle background/quit state notifications
//     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//       if (remoteMessage.data?.type === 'incoming_call') {
//         // Don't show CallKeep in background, just show normal notification
//         return Promise.resolve();
//       }
//     });

//     // Handle when app is opened from notification
//     messaging().getInitialNotification().then(remoteMessage => {
//       if (remoteMessage?.data?.type === 'incoming_call') {
//         this.navigateToCallScreen(remoteMessage.data);
//       }
//     });
//   }

//   handleIncomingCall(callData) {
//     const { caller_name, room_id, call_type, caller_id } = callData;
    
//     // Show CallKit/CallKeep UI
//     CallKeep.displayIncomingCall(
//       room_id,
//       caller_name,
//       caller_name,
//       call_type === 'video' ? 'video' : 'audio',
//       null
//     );
    
//     // Vibrate for incoming call
//     if (Platform.OS === 'android') {
//       Vibration.vibrate([1000, 1000, 1000], true);
//     }
    
//     // Store call info
//     this.currentCall = {
//       roomId: room_id,
//       callerId: caller_id,
//       callerName: caller_name,
//       callType: call_type,
//     };
//   }

//   onAnswerCall = ({ callUUID }) => {
//     // Stop vibration
//     Vibration.cancel();
    
//     // Navigate to call screen
//     this.navigateToCallScreen(this.currentCall);
//   };

//   onEndCall = ({ callUUID }) => {
//     Vibration.cancel();
//     this.endCall(callUUID);
//   };

//   onDidDisplayIncomingCall = ({ callUUID, error }) => {
//     if (error) {
//       console.log('Error displaying incoming call:', error);
//     }
//   };

//   onDidActivateAudioSession = () => {
//     // Audio session activated, start media stream
//   };

//   navigateToCallScreen(callData) {
//     // Navigate to your call screen
//     // Using your navigation method
//     NavigationService.navigate('CallScreen', {
//       roomId: callData.roomId,
//       callerId: callData.callerId,
//       callerName: callData.callerName,
//       callType: callData.callType,
//     });
//   }

//   async startCall(receiverId, callType = 'audio') {
//     const roomId = `${Date.now()}_${Math.random().toString(36)}`;
    
//     // Send signaling to backend via WebSocket
//     const ws = new WebSocket(`wss://api.showapp.ng/ws/call/${roomId}/`);
    
//     ws.onopen = () => {
//       ws.send(JSON.stringify({
//         type: 'new_call',
//         receiver_id: receiverId,
//         caller_name: this.userName,
//         call_type: callType,
//         room_id: roomId
//       }));
//     };
    
//     return { ws, roomId };
//   }

//   async acceptCall(roomId) {
//     const ws = new WebSocket(`wss://api.showapp.ng/ws/call/${roomId}/`);
//     // ... WebRTC setup
//     return ws;
//   }

//   async rejectCall(roomId) {
//     const ws = new WebSocket(`wss://api.showapp.ng/ws/call/${roomId}/`);
//     ws.onopen = () => {
//       ws.send(JSON.stringify({
//         type: 'reject_call',
//         caller_id: this.currentCall?.callerId,
//         reason: 'rejected'
//       }));
//     };
//   }

//   async endCall(roomId) {
//     const ws = new WebSocket(`wss://api.showapp.ng/ws/call/${roomId}/`);
//     ws.onopen = () => {
//       ws.send(JSON.stringify({
//         type: 'end_call',
//         other_participant_id: this.currentCall?.callerId
//       }));
//     };
//     CallKeep.endCall(roomId);
//   }
// }

// export default new CallService();