// import React, { useEffect, useRef, useState } from "react";
// import { 
//   View, 
//   TextInput, 
//   FlatList, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet,
//   Animated,
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { RTCPeerConnection, RTCView, MediaStream } from "react-native-webrtc";
// import Signaling from "./signaling";
// import { rtcConfig, getIceServers } from "./rtcConfig";
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// const { width, height } = Dimensions.get('window');

// export default function Viewer({ route, navigation }) {
//   const { roomName, streamId, viewerId } = route.params;
//   const pcRef = useRef(null);
//   const signaling = useRef(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [showChat, setShowChat] = useState(true);
//   const [liked, setLiked] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
  
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(1)).current;

//   // In your viewer component's useEffect after connection is established
// useEffect(() => {
//   let mounted = true;

//   const initializeViewer = async () => {
//     try {
//       // Load username from AsyncStorage
//       const userData = await AsyncStorage.getItem("userData");
//       let username = 'Anonymous';
//       let profilePicture = '';
      
//       if (userData) {
//         const parsedData = JSON.parse(userData);
//         username = parsedData.name || parsedData.username || 'Anonymous';
//         profilePicture = parsedData.profile_picture || '';
//         console.log('👤 Viewer loaded:', { username, profilePicture });
//       }

//       // Initialize WebRTC
//       await getIceServers();
//       pcRef.current = new RTCPeerConnection(rtcConfig);

//       const inboundStream = new MediaStream();
//       pcRef.current.ontrack = (event) => {
//         if (event.streams && event.streams[0]) {
//           setRemoteStream(event.streams[0]);
//         } else {
//           inboundStream.addTrack(event.track);
//           setRemoteStream(inboundStream);
//         }
//       };

//       pcRef.current.onicecandidate = (e) => {
//         if (e.candidate && signaling.current) {
//           signaling.current.send({
//             type: "candidate",
//             candidate: e.candidate,
//             streamId,
//             viewer_id: viewerId,
//           });
//         }
//       };

//       // Initialize signaling
//       signaling.current = new Signaling(roomName, (msg) => handleSignaling(msg));
//       await signaling.current.connect();

//       // Send viewer joined notification
//       signaling.current.send({
//         type: "viewer-joined",
//         viewer_id: viewerId,
//         username: username,
//         profilePicture: profilePicture,
//         streamId: streamId,
//         timestamp: Date.now()
//       });
//       console.log('👋 Sent viewer joined notification:', username);

//       // Add transceivers for receiving
//       pcRef.current.addTransceiver("video", { direction: "recvonly" });
//       pcRef.current.addTransceiver("audio", { direction: "recvonly" });

//       // Create and send offer
//       const offer = await pcRef.current.createOffer();
//       await pcRef.current.setLocalDescription(offer);

//       signaling.current.send({
//         type: "viewer-offer",
//         offer,
//         streamId,
//         viewer_id: viewerId,
//       });

//     } catch (error) {
//       console.error('Error initializing viewer:', error);
//     }
//   };

//   initializeViewer();

//   // Cleanup function
//   return () => {
//     mounted = false;
    
//     // Send viewer left notification before disconnecting
//     if (signaling.current) {
//       // Get username from state or storage
//       const sendLeftNotification = async () => {
//         try {
//           const userData = await AsyncStorage.getItem("userData");
//           let username = 'Anonymous';
          
//           if (userData) {
//             const parsedData = JSON.parse(userData);
//             username = parsedData.name || parsedData.username || 'Anonymous';
//           }
          
//           signaling.current.send({
//             type: "viewer-left",
//             viewer_id: viewerId,
//             username: username,
//             streamId: streamId,
//             timestamp: Date.now()
//           });
//           console.log('👋 Sent viewer left notification:', username);
          
//           // Small delay to ensure message is sent
//           setTimeout(() => {
//             signaling.current?.close();
//           }, 100);
//         } catch (error) {
//           console.error('Error sending viewer left:', error);
//           signaling.current?.close();
//         }
//       };
      
//       sendLeftNotification();
//     }
    
//     pcRef.current?.close();
//   };
// }, []);

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       await getIceServers();
//       pcRef.current = new RTCPeerConnection(rtcConfig);

//       const inboundStream = new MediaStream();
//       pcRef.current.ontrack = (event) => {
//         if (event.streams && event.streams[0]) {
//           setRemoteStream(event.streams[0]);
//         } else {
//           inboundStream.addTrack(event.track);
//           setRemoteStream(inboundStream);
//         }
//       };

//       pcRef.current.onicecandidate = (e) => {
//         if (e.candidate && signaling.current) {
//           signaling.current.send({
//             type: "candidate",
//             candidate: e.candidate,
//             streamId,
//             viewer_id: viewerId,
//           });
//         }
//       };

//       signaling.current = new Signaling(roomName, (msg) => handleSignaling(msg));
//       await signaling.current.connect();

//       pcRef.current.addTransceiver("video", { direction: "recvonly" });
//       pcRef.current.addTransceiver("audio", { direction: "recvonly" });

//       const offer = await pcRef.current.createOffer();
//       await pcRef.current.setLocalDescription(offer);

//       signaling.current.send({
//         type: "viewer-offer",
//         offer,
//         streamId,
//         viewer_id: viewerId,
//       });
//     })();

//     const handleSignaling = async (msg) => {
//       if (!msg) return;

//       if (msg.type === "broadcaster-answer" && msg.viewer_id === viewerId) {
//         if (!pcRef.current.remoteDescription) {
//           await pcRef.current.setRemoteDescription(msg.answer);
//         }
//       } else if (msg.type === "candidate" && msg.viewer_id === viewerId) {
//         if (msg.candidate) await pcRef.current.addIceCandidate(msg.candidate);
//       } else if (msg.type === "comment") {
//         setMessages((prev) => [
//           ...prev,
//           { id: Date.now().toString(), text: msg.text, timestamp: new Date() },
//         ]);
//       }
//     };

//     return () => {
//       mounted = false;
//       signaling.current?.close();
//       pcRef.current?.close();
//     };
//   }, []);

//   const toggleChat = () => {
//     setShowChat(!showChat);
//     Animated.timing(slideAnim, {
//       toValue: showChat ? 1 : 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const hideUI = () => {
//     Animated.timing(fadeAnim, {
//       toValue: fadeAnim._value === 1 ? 0 : 1,
//       duration: 200,
//       useNativeDriver: true,
//     }).start();
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
    
//   };

//   // const sendComment = () => {
//   //   if (text.trim() && signaling.current) {
//   //     signaling.current.send({
//   //       type: "comment",
//   //       text,
//   //       streamId,
//   //       viewer_id: viewerId,
//   //     });
//   //     setText("");
//   //   }
//   // };

//  const sendComment = async () => {
//   if (text.trim() && signaling.current) {
//     try {
//       const userData = await AsyncStorage.getItem("userData");
//       let username = 'Anonymous';
//       let profilePicture = '';
      
//       if (userData) {
//         const parsedData = JSON.parse(userData);
//         username = parsedData.name || parsedData.username || 'Anonymous';
//         profilePicture = parsedData.profile_picture || '';
//         console.log('Extracted username:', username);
//         console.log('Profile picture:', profilePicture);
//       }
      
//       console.log('📤 Sending comment from viewer:', {
//         username: username,
//         viewerId: viewerId,
//         streamId: streamId,
//         message: text,
//         profilePicture: profilePicture
//       });
      
//       signaling.current.send({
//         type: "comment",
//         text: text,
//         streamId: streamId,
//         viewer_id: viewerId,
//         username: username,
//         profilePicture: profilePicture, // Add this if you want to show profile pics
//         timestamp: Date.now()
//       });
      
//       setText("");
      
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           text: text,
//           username: username,
//           profilePicture: profilePicture,
//           timestamp: new Date(),
//           isOwnMessage: true
//         },
//       ]);
      
//     } catch (error) {
//       console.error('Error in sendComment:', error);
//     }
//   }
// };

//   const sendLike = () => {
//     if (!liked) {
//       setLiked(true);
//       signaling.current?.send({
//         type: "like",
//         streamId,
//         viewer_id: viewerId,
//       });
//       setTimeout(() => setLiked(false), 1000);
//     }
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const chatTranslateX = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [300, 0],
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView 
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         {/* Video Stream */}
//         {remoteStream ? (
//           <RTCView
//             streamURL={remoteStream.toURL()}
//             style={styles.videoStream}
//             objectFit="cover"
//           />
//         ) : (
//           <View style={[styles.videoStream, styles.placeholder]}>
//             <Icon name="videocam-off" size={48} color="#666" />
//             <Text style={[styles.placeholderText,{marginTop:30}]}></Text>
//           </View>
//         )}

//         {/* Header Controls */}
//         <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="chevron-back" size={24} color="white" />
            
//           </TouchableOpacity>
          
//           <View style={styles.streamInfo}>
//             <Text style={styles.streamTitle} numberOfLines={1}>
//               Live Stream 
//             </Text>
//             <Text style={styles.viewerCount}>
//               <Icon name="people" size={12} color="#FF3B30" /> 0 watching
//             </Text>
//           </View>

//           {/* <TouchableOpacity style={styles.iconButton} onPress={hideUI}>
//             <Icon name="ellipsis-vertical" size={20} color="white" />
//           </TouchableOpacity> */}
//         </Animated.View>

//         {/* Chat Sidebar */}
//         <Animated.View 
//           style={[
//             styles.chatContainer,
//             { 
//               transform: [{ translateX: chatTranslateX }],
//               opacity: slideAnim
//             }
//           ]}
//         >
//           <View style={styles.chatHeader}>
//             <Text style={styles.chatTitle}>Live Chat</Text>
//             <TouchableOpacity onPress={toggleChat}>
//               <Icon name="chevron-forward" size={24} color="white" />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={messages}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.messageBubble}>
//                 <Text style={styles.messageText}>{item.text}</Text>
//                 <Text style={styles.messageTime}>
//                   {formatTime(item.timestamp)}
//                 </Text>
//               </View>
//             )}
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//             showsVerticalScrollIndicator={false}
//             inverted={false}
//           />
//         </Animated.View>

//         <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
//           <View style={styles.inputContainer}>
//             <TextInput
//               value={text}
//               onChangeText={setText}
//               placeholder="Send a message..."
//               placeholderTextColor="#A0A0A0"
//               style={styles.textInput}
//               multiline
//               maxLength={200}
//             />
            
//             <View style={styles.actionButtons}>
//               <TouchableOpacity 
//                 style={[styles.likeButton, liked && styles.likedButton]}
//                 onPress={sendLike}
//               >
//                 <Icon 
//                   name={liked ? "heart" : "heart-outline"} 
//                   size={24} 
//                   color={liked ? "#FF3B30" : "white"} 
//                 />
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.sendButton} 
//                 onPress={sendComment}
//                 disabled={!text.trim()}
//               >
//                 <Icon 
//                   name="send" 
//                   size={20} 
//                   color={text.trim() ? "#007AFF" : "#666"} 
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* <View style={styles.bottomIcons}>
//             <TouchableOpacity 
//               style={styles.iconButton} 
//               onPress={toggleChat}
//             >
//               <Icon name="chatbubbles" size={24} color="white" />
//               {messages.length > 0 && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>
//                     {messages.length > 99 ? '99+' : messages.length}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.iconButton}>
//               <FontAwesomeIcon name="share" size={20} color="white" />
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.iconButton} 
//               onPress={toggleMute}
//             >
//               <Icon 
//                 name={isMuted ? "volume-mute" : "volume-high"} 
//                 size={24} 
//                 color="white" 
//               />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.iconButton}>
//               <MaterialIcon name="more-vert" size={24} color="white" />
//             </TouchableOpacity>
//           </View> */}
//         </Animated.View>

//         {/* Chat Toggle Button when hidden */}
//         {!showChat && (
//           <TouchableOpacity style={styles.chatToggleButton} onPress={toggleChat}>
//             <Icon name="chatbubbles" size={20} color="white" />
//             {messages.length > 0 && (
//               <View style={styles.smallBadge}>
//                 <Text style={styles.smallBadgeText}>
//                   {messages.length > 9 ? '9+' : messages.length}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         )}

//         {/* Connection Status */}
//         {!remoteStream && (
//           <View style={styles.connectionStatus}>
//             <Icon name="wifi" size={16} color="#FFA500" />
//             <Text style={styles.connectionText}>Connecting to stream...</Text>
//           </View>
//         )}
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#000',
  // },
  // videoStream: {
  //   flex: 1,
  //   backgroundColor: 'black',
  // },
  // placeholder: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#111',
  // },
  // placeholderText: {
  //   color: '#666',
  //   marginTop: 10,
  //   fontSize: 16,
  //   fontFamily: 'System',
  // },
  // header: {
  //   position: 'absolute',
  //   top: Platform.OS === 'ios' ? 10 : 30,
  //   left: 0,
  //   right: 0,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 15,
  //   paddingVertical: 10,
  //   zIndex: 10,
  // },
  // backButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0,0,0,0.6)',
  //   paddingHorizontal: 12,
  //   paddingVertical: 8,
  //   borderRadius: 20,
  //   minWidth: 0,
  // },
  // backText: {
  //   color: 'white',
  //   marginLeft: 4,
  //   fontWeight: '600',
  //   fontFamily: 'System',
  //   fontSize: 14,
  // },
  // streamInfo: {
  //   flex: 1,
  //   alignItems: 'center',
  //   marginHorizontal: 15,
  // },
  // streamTitle: {
  //   color: 'white',
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   fontFamily: 'System',
  //   textAlign: 'center',
  // },
  // viewerCount: {
  //   color: '#FF3B30',
  //   fontSize: 12,
  //   fontWeight: '600',
  //   fontFamily: 'System',
  //   marginTop: 2,
  // },
  // iconButton: {
  //   padding: 8,
  //   backgroundColor: 'rgba(0,0,0,0.6)',
  //   borderRadius: 20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   minWidth: 40,
  //   minHeight: 40,
  // },
  // chatContainer: {
  //   position: 'absolute',
  //   top: Platform.OS === 'ios' ? 80 : 100,
  //   right: 0,
  //   bottom: 120,
  //   width: width * 0.8,
  //   maxWidth: 320,
  //   backgroundColor: 'rgba(20,20,20,0.95)',
  //   borderLeftWidth: 1,
  //   borderLeftColor: 'rgba(255,255,255,0.15)',
  //   zIndex: 5,
  // },
  // chatHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: 'rgba(255,255,255,0.1)',
  //   backgroundColor: 'rgba(0,0,0,0.7)',
  // },
  // chatTitle: {
  //   color: 'white',
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   fontFamily: 'System',
  // },
  // chatList: {
  //   flex: 1,
  // },
  // chatContent: {
  //   padding: 10,
  //   paddingBottom: 20,
  // },
  // messageBubble: {
  //   backgroundColor: 'rgba(255,255,255,0.1)',
  //   padding: 12,
  //   borderRadius: 16,
  //   marginBottom: 8,
  //   maxWidth: '90%',
  //   alignSelf: 'flex-start',
  // },
  // messageText: {
  //   color: 'white',
  //   fontSize: 14,
  //   lineHeight: 18,
  //   fontFamily: 'System',
  // },
  // messageTime: {
  //   color: '#A0A0A0',
  //   fontSize: 10,
  //   marginTop: 4,
  //   alignSelf: 'flex-end',
  //   fontFamily: 'System',
  // },
  // controls: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   padding: 15,
  //   paddingBottom: Platform.OS === 'ios' ? 35 : 15,
  //   backgroundColor: 'rgba(0,0,0,0.8)',
  //   borderTopWidth: 1,
  //   borderTopColor: 'rgba(255,255,255,0.1)',
  //   zIndex: 10,
  // },
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-end',
  //   marginBottom: 15,
  // },
  // textInput: {
  //   flex: 1,
  //   backgroundColor: 'rgba(255,255,255,0.12)',
  //   borderColor: 'rgba(255,255,255,0.2)',
  //   borderWidth: 1,
  //   borderRadius: 24,
  //   paddingHorizontal: 16,
  //   paddingVertical: 12,
  //   color: 'white',
  //   fontSize: 16,
  //   maxHeight: 100,
  //   fontFamily: 'System',
  //   textAlignVertical: 'center',
  // },
  // actionButtons: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginLeft: 10,
  // },
  // likeButton: {
  //   padding: 10,
  //   marginRight: 5,
  //   borderRadius: 20,
  //   backgroundColor: 'rgba(255,255,255,0.1)',
  // },
  // likedButton: {
  //   backgroundColor: 'rgba(255,59,48,0.2)',
  //   transform: [{ scale: 1.1 }],
  // },
  // sendButton: {
  //   padding: 10,
  //   borderRadius: 20,
  //   backgroundColor: 'rgba(255,255,255,0.1)',
  // },
  // bottomIcons: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  // },
  // badge: {
  //   position: 'absolute',
  //   top: -5,
  //   right: -5,
  //   backgroundColor: '#FF3B30',
  //   borderRadius: 10,
  //   minWidth: 20,
  //   height: 20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: 'rgba(0,0,0,0.3)',
  // },
  // badgeText: {
  //   color: 'white',
  //   fontSize: 10,
  //   fontWeight: 'bold',
  //   fontFamily: 'System',
  // },
  // chatToggleButton: {
  //   position: 'absolute',
  //   right: 20,
  //   bottom: 100,
  //   backgroundColor: 'rgba(0,0,0,0.7)',
  //   padding: 12,
  //   borderRadius: 25,
  //   zIndex: 5,
  // },
  // smallBadge: {
  //   position: 'absolute',
  //   top: -5,
  //   right: -5,
  //   backgroundColor: '#FF3B30',
  //   borderRadius: 8,
  //   minWidth: 16,
  //   height: 16,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: 'rgba(0,0,0,0.3)',
  // },
  // smallBadgeText: {
  //   color: 'white',
  //   fontSize: 8,
  //   fontWeight: 'bold',
  //   fontFamily: 'System',
  // },
  // connectionStatus: {
  //   position: 'absolute',
  //   top: '50%',
  //   alignSelf: 'center',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0,0,0,0.7)',
  //   paddingHorizontal: 15,
  //   paddingVertical: 10,
  //   borderRadius: 20,
  //   zIndex: 5,
  // },
  // connectionText: {
  //   color: '#FFA500',
  //   marginLeft: 8,
  //   fontSize: 14,
  //   fontWeight: '600',
  //   fontFamily: 'System',
  // },
// });

import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { RTCPeerConnection, RTCView, MediaStream } from "react-native-webrtc";
import Signaling from "./signaling";
import { rtcConfig, getIceServers } from "./rtcConfig";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

export default function Viewer({ route, navigation }) {
  const { roomName, streamId, viewerId } = route.params;
  const pcRef = useRef(null);
  const signaling = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [username, setUsername] = useState('Anonymous');
  const [profilePicture, setProfilePicture] = useState('');
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Handle signaling messages
  const handleSignaling = async (msg) => {
    if (!msg) return;

    console.log('📥 Received message:', msg.type);

    if (msg.type === "broadcaster-answer" && msg.viewer_id === viewerId) {
      if (!pcRef.current.remoteDescription) {
        await pcRef.current.setRemoteDescription(msg.answer);
      }
    } else if (msg.type === "candidate" && msg.viewer_id === viewerId) {
      if (msg.candidate) await pcRef.current.addIceCandidate(msg.candidate);
    } else if (msg.type === "comment") {
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          text: msg.text, 
          username: msg.username || 'Anonymous',
          profilePicture: msg.profilePicture || '',
          timestamp: new Date() 
        },
      ]);
    }
  };

  // Initialize viewer
  useEffect(() => {
    let mounted = true;
    let leftNotificationSent = false;

    const initializeViewer = async () => {
      try {
        // Load username from AsyncStorage
        const userData = await AsyncStorage.getItem("userData");
        
        // if (userData) {
        //   const parsedData = JSON.parse(userData);
        //   setUsername(parsedData.name || parsedData.username || 'Anonymous');
        //   setProfilePicture(parsedData.profile_picture || '');
        //   console.log('👤 Viewer loaded:', { 
        //     username: parsedData.name, 
        //     profilePicture: parsedData.profile_picture 
        //   });
        // }

        let currentUsername = 'Anonymous';
let currentProfilePicture = '';

if (userData) {
  const parsedData = JSON.parse(userData);

  currentUsername =
    parsedData.name ||
    parsedData.username ||
    'Anonymous';

  currentProfilePicture =
    parsedData.profile_picture || '';

  setUsername(currentUsername);
  setProfilePicture(currentProfilePicture);

  console.log('👤 Viewer loaded:', {
    username: currentUsername,
    profilePicture: currentProfilePicture,
  });
}

        // Initialize WebRTC
        await getIceServers();
        pcRef.current = new RTCPeerConnection(rtcConfig);

        const inboundStream = new MediaStream();
        pcRef.current.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
          } else {
            inboundStream.addTrack(event.track);
            setRemoteStream(inboundStream);
          }
        };

        pcRef.current.onicecandidate = (e) => {
          if (e.candidate && signaling.current) {
            signaling.current.send({
              type: "candidate",
              candidate: e.candidate,
              streamId,
              viewer_id: viewerId,
            });
          }
        };

        // Initialize signaling
        signaling.current = new Signaling(roomName, handleSignaling);
        await signaling.current.connect();

        // Send viewer joined notification
        // signaling.current.send({
        //   type: "viewer-joined",
        //   viewer_id: viewerId,
        //   username: username,
        //   profilePicture: profilePicture,
        //   streamId: streamId,
        //   timestamp: Date.now()
        // });

        signaling.current.send({
          type: "viewer-joined",
          viewer_id: viewerId,
          username: currentUsername,
          profilePicture: currentProfilePicture,
          streamId: streamId,
          timestamp: Date.now()
        });
        console.log('👋 Sent viewer joined notification:', username);

        // Add transceivers for receiving
        pcRef.current.addTransceiver("video", { direction: "recvonly" });
        pcRef.current.addTransceiver("audio", { direction: "recvonly" });

        // Create and send offer
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        signaling.current.send({
          type: "viewer-offer",
          offer,
          streamId,
          viewer_id: viewerId,
        });

      } catch (error) {
        console.error('Error initializing viewer:', error);
      }
    };

    initializeViewer();

    // Cleanup function
    return () => {
      mounted = false;
      
      // Send viewer left notification before disconnecting (only once)
      if (signaling.current && !leftNotificationSent) {
        leftNotificationSent = true;
        
        signaling.current.send({
          type: "viewer-left",
          viewer_id: viewerId,
          username: username,
          streamId: streamId,
          timestamp: Date.now()
        });
        console.log('👋 Sent viewer left notification:', username);
        
        // Small delay to ensure message is sent
        setTimeout(() => {
          signaling.current?.close();
        }, 100);
      }
      
      pcRef.current?.close();
    };
  }, []); // Empty dependency array - runs once

  const toggleChat = () => {
    setShowChat(!showChat);
    Animated.timing(slideAnim, {
      toValue: showChat ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideUI = () => {
    Animated.timing(fadeAnim, {
      toValue: fadeAnim._value === 1 ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const sendComment = async () => {
    if (text.trim() && signaling.current) {
      try {
        console.log('📤 Sending comment from viewer:', {
          username: username,
          viewerId: viewerId,
          message: text,
        });
        
        signaling.current.send({
          type: "comment",
          text: text,
          streamId: streamId,
          viewer_id: viewerId,
          username: username,
          profilePicture: profilePicture,
          timestamp: Date.now()
        });
        
        // Add to local messages
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: text,
            username: username,
            profilePicture: profilePicture,
            timestamp: new Date(),
            isOwnMessage: true
          },
        ]);
        
        setText("");
        
      } catch (error) {
        console.error('Error in sendComment:', error);
      }
    }
  };

  const sendLike = () => {
    if (!liked) {
      setLiked(true);
      signaling.current?.send({
        type: "like",
        streamId,
        viewer_id: viewerId,
        username: username,
      });
      setTimeout(() => setLiked(false), 1000);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const chatTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  // Render message with username and profile picture
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.isOwnMessage && styles.ownMessageBubble
    ]}>
      <View style={styles.messageHeader}>
        {item.profilePicture ? (
          <Image 
            source={{ uri: item.profilePicture }} 
            style={styles.messageProfileImage}
          />
        ) : (
          <View style={[styles.messageProfilePlaceholder, { backgroundColor: getRandomColor(item.username) }]}>
            <Text style={styles.messageProfileInitial}>
              {item.username ? item.username.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
        )}
        <Text style={styles.messageUsername}>{item.username || 'Anonymous'}</Text>
        {item.isOwnMessage && <Text style={styles.youTag}>(You)</Text>}
      </View>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  // Helper function for random colors
  const getRandomColor = (name) => {
    if (!name) return '#555';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Video Stream */}
        {remoteStream ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.videoStream}
            objectFit="cover"
          />
        ) : (
          <View style={[styles.videoStream, styles.placeholder]}>
            <Icon name="videocam-off" size={48} color="#666" />
            {/* <Text style={styles.placeholderText}>Connecting to stream...</Text> */}
          </View>
        )}

        {/* Header Controls */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.streamInfo}>
            <Text style={styles.streamTitle} numberOfLines={1}>
              Live Stream 
            </Text>
            {/* <Text style={styles.viewerCount}>
              <Icon name="people" size={12} color="#FF3B30" /> Watching
            </Text> */}
          </View>
        </Animated.View>

        {/* Chat Sidebar */}
        <Animated.View 
          style={[
            styles.chatContainer,
            { 
              transform: [{ translateX: chatTranslateX }],
              opacity: slideAnim
            }
          ]}
        >
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Live Chat</Text>
            <TouchableOpacity onPress={toggleChat}>
              <Icon name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.chatList}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            inverted={false}
          />
        </Animated.View>

        {/* Controls */}
        <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Send a message..."
              placeholderTextColor="#A0A0A0"
              style={styles.textInput}
              multiline
              maxLength={200}
            />
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.likeButton, liked && styles.likedButton]}
                onPress={sendLike}
              >
                <Icon 
                  name={liked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={liked ? "#FF3B30" : "white"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={sendComment}
                disabled={!text.trim()}
              >
                <Icon 
                  name="send" 
                  size={20} 
                  color={text.trim() ? "#007AFF" : "#666"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Chat Toggle Button when hidden */}
        {!showChat && (
          <TouchableOpacity style={styles.chatToggleButton} onPress={toggleChat}>
            <Icon name="chatbubbles" size={20} color="white" />
            {messages.length > 0 && (
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>
                  {messages.length > 9 ? '9+' : messages.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Connection Status */}
        {!remoteStream && (
          <View style={styles.connectionStatus}>
            <Icon name="wifi" size={16} color="#FFA500" />
            <Text style={styles.connectionText}>Connecting to stream...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoStream: {
    flex: 1,
    backgroundColor: 'black',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  placeholderText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'System',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 0,
  },
  backText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
    fontFamily: 'System',
    fontSize: 14,
  },
  streamInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  streamTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
    textAlign: 'center',
  },
  viewerCount: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  chatContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 100,
    right: 0,
    bottom: 120,
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.15)',
    zIndex: 5,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  chatTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'System',
  },
  messageTime: {
    color: '#A0A0A0',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'System',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
    fontFamily: 'System',
    textAlignVertical: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  likeButton: {
    padding: 10,
    marginRight: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  likedButton: {
    backgroundColor: 'rgba(255,59,48,0.2)',
    transform: [{ scale: 1.1 }],
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bottomIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  chatToggleButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 25,
    zIndex: 5,
  },
  smallBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  smallBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  connectionStatus: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 5,
    marginTop: 24,
  },
  connectionText: {
    color: '#FFA500',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  messageProfilePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageProfileInitial: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageUsername: {
    color: '#4A9EFF',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 5,
  },
  youTag: {
    color: '#666',
    fontSize: 10,
    fontStyle: 'italic',
  },
  ownMessageBubble: {
    backgroundColor: 'rgba(74, 158, 255, 0.15)',
    alignSelf: 'flex-end',
  },
 
});




