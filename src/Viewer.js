

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
//   Image,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { RTCPeerConnection, RTCView, MediaStream } from "react-native-webrtc";
// import Signaling from "./signaling";
// import InCallManager from "react-native-incall-manager";
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
//   const [username, setUsername] = useState('Anonymous');
//   const [profilePicture, setProfilePicture] = useState('');
  
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(1)).current;

  

//   const handleSignaling = async (msg) => {
//   if (!msg) return;

//   console.log('📥 Received message:', msg.type);

 
//   if (msg.type === "broadcaster-answer") {

//     console.log("Viewer ID:", viewerId);
//     console.log("Message viewer ID:", msg.viewer_id);

//     try {
//         await pcRef.current.setRemoteDescription(msg.answer);
//         console.log("✅ Remote description set");
//     } catch(e){
//         console.log("❌ setRemoteDescription failed", e);
//     }

// }

// else if (msg.type === "end-stream") {
//   console.log("📴 Stream ended by broadcaster");

//   // Close WebRTC
//   pcRef.current?.close();
//   signaling.current?.close();

//   setRemoteStream(null);

//   Alert.alert(
//     "Live Stream Ended",
//     "The broadcaster has ended the live stream.",
//     [
//       {
//         text: "OK",
//         onPress: () => navigation.goBack(),
//       },
//     ]
//   );
// }
  
//   else if (msg.type === "candidate" && msg.viewer_id === viewerId) {
//     if (msg.candidate) {
//       await pcRef.current.addIceCandidate(msg.candidate);
//       console.log('❄️ ICE candidate added');
//     }
//   } else if (msg.type === "comment") {  // ✅ Backend sends "comment"
//     console.log('💬 New comment:', msg);
//     setMessages((prev) => [
//       ...prev,
//       { 
//         id: Date.now().toString(), 
//         text: msg.text, 
//         username: msg.username || 'Anonymous',
//         profilePicture: msg.profilePicture || '',
//         timestamp: new Date() 
//       },
//     ]);
//   } else if (msg.type === "like") {  // ✅ Backend sends "like"
//     console.log('❤️ New like:', msg);
//     // You can add like animation here if desired
//   } else if (msg.type === "viewer-joined") {
//     console.log('👋 Viewer joined:', msg.username);
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         text: `👋 ${msg.username || 'A viewer'} joined the stream`,
//         username: 'System',
//         isSystemMessage: true,
//         timestamp: new Date()
//       },
//     ]);
//   } else if (msg.type === "viewer-left") {
//     console.log('👋 Viewer left:', msg.username);
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         text: `👋 ${msg.username || 'A viewer'} left the stream`,
//         username: 'System',
//         isSystemMessage: true,
//         timestamp: new Date()
//       },
//     ]);
//   }
// };

//   // Initialize viewer
//   useEffect(() => {
//     let mounted = true;
//     let leftNotificationSent = false;



// const initializeViewer = async () => {
//   try {
//     // Load user data
//     const userData = await AsyncStorage.getItem("userData");
    
//     let currentUsername = 'Anonymous';
//     let currentProfilePicture = '';
//     let currentUserId = null;

//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       currentUsername = parsedData.name || parsedData.username || 'Anonymous';
//       currentProfilePicture = parsedData.profile_picture || '';
//       currentUserId = parsedData.id;
      
//       setUsername(currentUsername);
//       setProfilePicture(currentProfilePicture);
      
//       console.log('👤 Viewer loaded:', {
//         username: currentUsername,
//         profilePicture: currentProfilePicture,
//         userId: currentUserId
//       });
//     }

//     // ✅ Initialize WebRTC with better configuration
//     await getIceServers();
    
//     // ✅ Create peer connection with better settings
//     pcRef.current = new RTCPeerConnection({
//       ...rtcConfig,
//       iceTransportPolicy: 'all',
//       iceCandidatePoolSize: 10,
//       bundlePolicy: 'max-bundle',
//       rtcpMuxPolicy: 'require',
//     });

//     pcRef.current.ontrack = (event) => {
//   console.log("🎥 ontrack fired");
//   console.log("Track kind:", event.track.kind);

//   if (event.track.kind === "audio") {
//     console.log("🎤 AUDIO RECEIVED");
//   }

//   if (event.track.kind === "video") {
//     console.log("🎥 VIDEO RECEIVED");
//   }

//   if (event.streams && event.streams.length > 0) {
//     setRemoteStream(event.streams[0]);
//   }
// };

//     // ✅ IMPROVED: Handle connection state changes
//     pcRef.current.onconnectionstatechange = () => {
//       console.log('🔄 Connection state:', pcRef.current.connectionState);
//       if (pcRef.current.connectionState === 'connected') {
//         console.log('✅ Peer connection connected!');
//       } else if (pcRef.current.connectionState === 'failed') {
//         console.log('❌ Peer connection failed!');
//       }
//     };

//     // ✅ IMPROVED: Handle ICE connection state
//     pcRef.current.oniceconnectionstatechange = () => {
//       console.log('🔄 ICE connection state:', pcRef.current.iceConnectionState);
//     };

//     // ✅ IMPROVED: Handle ICE candidates
//     pcRef.current.onicecandidate = (e) => {
//       if (e.candidate && signaling.current) {
//         console.log('❄️ Local ICE candidate:', e.candidate);
//         signaling.current.send({
//           type: "candidate",
//           candidate: e.candidate,
//           streamId,
//           viewer_id: currentUserId || viewerId,
//         });
//       }
//     };

//     // Initialize signaling
//     signaling.current = new Signaling(roomName, handleSignaling);
//     await signaling.current.connect();

//     InCallManager.start({
//       media: "video",
//     });

//     InCallManager.setSpeakerphoneOn(true);

//     // Send viewer joined
//     signaling.current.send({
//       type: "viewer-joined",
//       viewer_id: currentUserId || viewerId,
//       username: currentUsername,
//       profilePicture: currentProfilePicture,
//       streamId: streamId,
//       timestamp: Date.now()
//     });
//     console.log('👋 Sent viewer joined notification:', currentUsername);

//     // ✅ IMPROVED: Add transceivers with sendrecv direction
//     // This ensures we can receive video and audio
//     const videoTransceiver = pcRef.current.addTransceiver('video', {
//       direction: 'recvonly',
//     });
//     const audioTransceiver = pcRef.current.addTransceiver('audio', {
//       direction: 'recvonly',
//     });
    
//     console.log('✅ Added transceivers:', {
//       video: videoTransceiver ? 'yes' : 'no',
//       audio: audioTransceiver ? 'yes' : 'no'
//     });

//     // Create and send offer
//     const offer = await pcRef.current.createOffer({
//       offerToReceiveVideo: true,
//       offerToReceiveAudio: true,
//     });
//     await pcRef.current.setLocalDescription(offer);

//     signaling.current.send({
//       type: "viewer-offer",
//       offer,
//       streamId,
//       viewer_id: currentUserId || viewerId,
//       username: currentUsername,
//       profilePicture: currentProfilePicture,
//     });
    
//     console.log('📤 Sent viewer-offer with ID:', currentUserId || viewerId);

//   } catch (error) {
//     console.error('Error initializing viewer:', error);
//   }
// };

//     initializeViewer();

//     // Cleanup function
//     return () => {
//       mounted = false;
      
//       // Send viewer left notification before disconnecting (only once)
//       if (signaling.current && !leftNotificationSent) {
//         leftNotificationSent = true;
        
//         signaling.current.send({
//           type: "viewer-left",
//           viewer_id: viewerId,
//           username: username,
//           streamId: streamId,
//           timestamp: Date.now()
//         });
//         console.log('👋 Sent viewer left notification:', username);
        
//         // Small delay to ensure message is sent
//         setTimeout(() => {
//           signaling.current?.close();
//         }, 100);
//       }
      
//       pcRef.current?.close();
//     };
//   }, []); // Empty dependency array - runs once

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

//   const sendComment = async () => {
//   if (text.trim() && signaling.current) {
//     try {
//       console.log('📤 Sending comment:', {
//         username: username,
//         viewerId: viewerId,
//         message: text,
//       });
      
//       // ✅ Use the correct field name: "text" not "comment"
//       signaling.current.send({
//         type: "comment",  // ← Backend expects "comment"
//         text: text,       // ← Backend expects "text"
//         streamId: streamId,
//         viewer_id: viewerId,
//         username: username,
//         profilePicture: profilePicture,
//         timestamp: Date.now()
//       });
      
//       // Add to local messages
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
      
//       setText("");
      
//     } catch (error) {
//       console.error('Error in sendComment:', error);
//     }
//   }
// };

//   const sendLike = () => {
//   if (!liked) {
//     setLiked(true);
//     // ✅ Backend expects "like" type
//     signaling.current?.send({
//       type: "like",  // ← Backend expects "like"
//       streamId,
//       viewer_id: viewerId,
//       username: username,
//       timestamp: Date.now()
//     });
//     setTimeout(() => setLiked(false), 1000);
//   }
// };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const chatTranslateX = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [300, 0],
//   });

//   // Render message with username and profile picture
//   const renderMessage = ({ item }) => (
//     <View style={[
//       styles.messageBubble,
//       item.isOwnMessage && styles.ownMessageBubble
//     ]}>
//       <View style={styles.messageHeader}>
//         {item.profilePicture ? (
//           <TouchableOpacity 
//           onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user_id })}
//           >
//             <Image 
//             source={{ uri: item.profilePicture }} 
//             style={styles.messageProfileImage}
//           />
//           </TouchableOpacity>
//         ) : (
//           <View style={[styles.messageProfilePlaceholder, { backgroundColor: getRandomColor(item.username) }]}>
//             <Text style={styles.messageProfileInitial}>
//               {item.username ? item.username.charAt(0).toUpperCase() : 'A'}
//             </Text>
//           </View>
//         )}
//         <Text style={styles.messageUsername}>{item.username || 'Anonymous'}</Text>
//         {item.isOwnMessage && <Text style={styles.youTag}>(You)</Text>}
//       </View>
//       <Text style={styles.messageText}>{item.text}</Text>
//       <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
//     </View>
//   );

//   // Helper function for random colors
//   const getRandomColor = (name) => {
//     if (!name) return '#555';
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
//     return colors[Math.abs(hash) % colors.length];
//   };

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
//             {/* <Text style={styles.placeholderText}>Connecting to stream...</Text> */}
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
//             {/* <Text style={styles.viewerCount}>
//               <Icon name="people" size={12} color="#FF3B30" /> Watching
//             </Text> */}
//           </View>
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
//             renderItem={renderMessage}
//             style={styles.chatList}
//             contentContainerStyle={styles.chatContent}
//             showsVerticalScrollIndicator={false}
//             inverted={false}
//           />
//         </Animated.View>

//         {/* Controls */}
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

//         <View style={styles.videoContainer}>
//   {remoteStream ? (
//     <RTCView
//       streamURL={remoteStream.toURL()}
//       style={styles.videoStream}
//       objectFit="cover"
//       zOrder={0}
//     />
//   ) : (
//     <View style={[styles.videoStream, styles.placeholder]}>
//       <Icon name="videocam-off" size={48} color="#666" />
//       <Text style={styles.placeholderText}>Connecting to stream...</Text>
//     </View>
//   )}
// </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//     container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   videoStream: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   placeholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#111',
//   },
//   placeholderText: {
//     color: '#666',
//     marginTop: 10,
//     fontSize: 16,
//     fontFamily: 'System',
//   },
//   header: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 10 : 30,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     zIndex: 10,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     minWidth: 0,
//   },
//   backText: {
//     color: 'white',
//     marginLeft: 4,
//     fontWeight: '600',
//     fontFamily: 'System',
//     fontSize: 14,
//   },
//   streamInfo: {
//     flex: 1,
//     alignItems: 'center',
//     marginHorizontal: 15,
//   },
//   streamTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: 'System',
//     textAlign: 'center',
//   },
//   viewerCount: {
//     color: '#FF3B30',
//     fontSize: 12,
//     fontWeight: '600',
//     fontFamily: 'System',
//     marginTop: 2,
//   },
//   iconButton: {
//     padding: 8,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 40,
//     minHeight: 40,
//   },
//   chatContainer: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 80 : 100,
//     right: 0,
//     bottom: 120,
//     width: width * 0.8,
//     maxWidth: 320,
//     backgroundColor: 'rgba(20,20,20,0.95)',
//     borderLeftWidth: 1,
//     borderLeftColor: 'rgba(255,255,255,0.15)',
//     zIndex: 5,
//   },
//   chatHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.1)',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   chatTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     fontFamily: 'System',
//   },
//   chatList: {
//     flex: 1,
//   },
//   chatContent: {
//     padding: 10,
//     paddingBottom: 20,
//   },
//   messageBubble: {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 8,
//     maxWidth: '90%',
//     alignSelf: 'flex-start',
//   },
//   messageText: {
//     color: 'white',
//     fontSize: 14,
//     lineHeight: 18,
//     fontFamily: 'System',
//   },
//   messageTime: {
//     color: '#A0A0A0',
//     fontSize: 10,
//     marginTop: 4,
//     alignSelf: 'flex-end',
//     fontFamily: 'System',
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     paddingBottom: Platform.OS === 'ios' ? 35 : 15,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255,255,255,0.1)',
//     zIndex: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginBottom: 15,
//   },
//   textInput: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.12)',
//     borderColor: 'rgba(255,255,255,0.2)',
//     borderWidth: 1,
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     color: 'white',
//     fontSize: 16,
//     maxHeight: 100,
//     fontFamily: 'System',
//     textAlignVertical: 'center',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   likeButton: {
//     padding: 10,
//     marginRight: 5,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   likedButton: {
//     backgroundColor: 'rgba(255,59,48,0.2)',
//     transform: [{ scale: 1.1 }],
//   },
//   sendButton: {
//     padding: 10,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   bottomIcons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   badge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.3)',
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//     fontFamily: 'System',
//   },
//   chatToggleButton: {
//     position: 'absolute',
//     right: 20,
//     bottom: 100,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 12,
//     borderRadius: 25,
//     zIndex: 5,
//   },
//   smallBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: '#FF3B30',
//     borderRadius: 8,
//     minWidth: 16,
//     height: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.3)',
//   },
//   smallBadgeText: {
//     color: 'white',
//     fontSize: 8,
//     fontWeight: 'bold',
//     fontFamily: 'System',
//   },
//   connectionStatus: {
//     position: 'absolute',
//     top: '50%',
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 20,
//     zIndex: 5,
//     marginTop: 24,
//   },
//   connectionText: {
//     color: '#FFA500',
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '600',
//     fontFamily: 'System',
//   },
//   messageHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   messageProfileImage: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   messageProfilePlaceholder: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   messageProfileInitial: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   messageUsername: {
//     color: '#4A9EFF',
//     fontSize: 13,
//     fontWeight: '600',
//     marginRight: 5,
//   },
//   youTag: {
//     color: '#666',
//     fontSize: 10,
//     fontStyle: 'italic',
//   },
//   ownMessageBubble: {
//     backgroundColor: 'rgba(74, 158, 255, 0.15)',
//     alignSelf: 'flex-end',
//   },
 
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
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { RTCPeerConnection, RTCView, MediaStream } from "react-native-webrtc";
import Signaling from "./signaling";
import InCallManager from "react-native-incall-manager";
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
  const [connectionState, setConnectionState] = useState('connecting');
  const [streamEnded, setStreamEnded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showEndedOverlay, setShowEndedOverlay] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const spinnerAnim = useRef(new Animated.Value(0)).current;

  // Spinner rotation animation
  useEffect(() => {
    if (isConnecting) {
      Animated.loop(
        Animated.timing(spinnerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinnerAnim.setValue(0);
    }
  }, [isConnecting]);

  const spin = spinnerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSignaling = async (msg) => {
    if (!msg) return;

    console.log('📥 Received message:', msg.type);

    if (msg.type === "broadcaster-answer") {
      console.log("Viewer ID:", viewerId);
      console.log("Message viewer ID:", msg.viewer_id);

      try {
        await pcRef.current.setRemoteDescription(msg.answer);
        console.log("✅ Remote description set");
        setConnectionState('connected');
        setIsConnecting(false);
      } catch(e){
        console.log("❌ setRemoteDescription failed", e);
      }
    } else if (msg.type === "end-stream") {
      console.log("📴 Stream ended by broadcaster");
      setStreamEnded(true);
      setShowEndedOverlay(true);
      setIsConnecting(false);
      
      // Close WebRTC
      pcRef.current?.close();
      signaling.current?.close();
      setRemoteStream(null);
      setConnectionState('ended');

      // Show nice alert after a delay
      setTimeout(() => {
        Alert.alert(
          "📺 Stream Ended",
          "The broadcaster has ended the live stream. Thank you for watching! 🙏",
          [
            {
              text: "OK",
              onPress: () => {
                setShowEndedOverlay(false);
                navigation.goBack();
              },
            },
          ]
        );
      }, 1500);
    } else if (msg.type === "candidate" && msg.viewer_id === viewerId) {
      if (msg.candidate) {
        try {
          await pcRef.current.addIceCandidate(msg.candidate);
          console.log('❄️ ICE candidate added');
        } catch (e) {
          console.log('❌ Failed to add ICE candidate', e);
        }
      }
    } else if (msg.type === "comment") {
      console.log('💬 New comment:', msg);
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
    } else if (msg.type === "like") {
      console.log('❤️ New like:', msg);
    } else if (msg.type === "viewer-joined") {
      console.log('👋 Viewer joined:', msg.username);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `👋 ${msg.username || 'A viewer'} joined the stream`,
          username: 'System',
          isSystemMessage: true,
          timestamp: new Date()
        },
      ]);
    } else if (msg.type === "viewer-left") {
      console.log('👋 Viewer left:', msg.username);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `👋 ${msg.username || 'A viewer'} left the stream`,
          username: 'System',
          isSystemMessage: true,
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
        // Load user data
        const userData = await AsyncStorage.getItem("userData");
        
        let currentUsername = 'Anonymous';
        let currentProfilePicture = '';
        let currentUserId = null;

        if (userData) {
          const parsedData = JSON.parse(userData);
          currentUsername = parsedData.name || parsedData.username || 'Anonymous';
          currentProfilePicture = parsedData.profile_picture || '';
          currentUserId = parsedData.id;
          
          setUsername(currentUsername);
          setProfilePicture(currentProfilePicture);
          
          console.log('👤 Viewer loaded:', {
            username: currentUsername,
            profilePicture: currentProfilePicture,
            userId: currentUserId
          });
        }

        // ✅ Initialize WebRTC
        await getIceServers();
        
        pcRef.current = new RTCPeerConnection({
          ...rtcConfig,
          iceTransportPolicy: 'all',
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require',
        });

        // Connection state monitoring
        pcRef.current.onconnectionstatechange = () => {
          const state = pcRef.current.connectionState;
          console.log("🔄 Connection State:", state);
          setConnectionState(state);

          if (state === 'connected') {
            setIsConnecting(false);
          }

          if (
            state === "disconnected" ||
            state === "failed" ||
            state === "closed"
          ) {
            if (!streamEnded && !leftNotificationSent) {
              setStreamEnded(true);
              setShowEndedOverlay(true);
              setIsConnecting(false);
              
              setTimeout(() => {
                Alert.alert(
                  "📡 Connection Lost",
                  "The connection to the stream has been lost. Please try again.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        setShowEndedOverlay(false);
                        navigation.goBack();
                      },
                    },
                  ]
                );
              }, 1500);
            }
          }
        };

        pcRef.current.ontrack = (event) => {
          console.log("🎥 ontrack fired");
          console.log("Track kind:", event.track.kind);

          if (event.track.kind === "audio") {
            console.log("🎤 AUDIO RECEIVED");
          }

          if (event.track.kind === "video") {
            console.log("🎥 VIDEO RECEIVED");
          }

          if (event.streams && event.streams.length > 0) {
            setRemoteStream(event.streams[0]);
            setConnectionState('connected');
            setIsConnecting(false);
          }
        };

        pcRef.current.oniceconnectionstatechange = () => {
          console.log('🔄 ICE connection state:', pcRef.current.iceConnectionState);
          setConnectionState(pcRef.current.iceConnectionState);
        };

        pcRef.current.onicecandidate = (e) => {
          if (e.candidate && signaling.current) {
            console.log('❄️ Local ICE candidate:', e.candidate);
            signaling.current.send({
              type: "candidate",
              candidate: e.candidate,
              streamId,
              viewer_id: currentUserId || viewerId,
            });
          }
        };

        // Initialize signaling
        signaling.current = new Signaling(roomName, handleSignaling);
        await signaling.current.connect();

        InCallManager.start({
          media: "video",
        });

        InCallManager.setSpeakerphoneOn(true);

        // Send viewer joined
        signaling.current.send({
          type: "viewer-joined",
          viewer_id: currentUserId || viewerId,
          username: currentUsername,
          profilePicture: currentProfilePicture,
          streamId: streamId,
          timestamp: Date.now()
        });
        console.log('👋 Sent viewer joined notification:', currentUsername);

        // Add transceivers
        pcRef.current.addTransceiver('video', {
          direction: 'recvonly',
        });
        pcRef.current.addTransceiver('audio', {
          direction: 'recvonly',
        });
        
        console.log('✅ Added transceivers');

        // Create and send offer
        const offer = await pcRef.current.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pcRef.current.setLocalDescription(offer);

        signaling.current.send({
          type: "viewer-offer",
          offer,
          streamId,
          viewer_id: currentUserId || viewerId,
          username: currentUsername,
          profilePicture: currentProfilePicture,
        });
        
        console.log('📤 Sent viewer-offer with ID:', currentUserId || viewerId);

        // Set a timeout to stop connecting state if it takes too long
        setTimeout(() => {
          if (isConnecting && !remoteStream) {
            setIsConnecting(false);
          }
        }, 15000);

      } catch (error) {
        console.error('Error initializing viewer:', error);
        setIsConnecting(false);
        Alert.alert(
          "Connection Error",
          "Failed to connect to the stream. Please try again.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    };

    initializeViewer();

    // Cleanup function
    return () => {
      mounted = false;
      
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
        
        setTimeout(() => {
          signaling.current?.close();
        }, 100);
      }
      
      pcRef.current?.close();
    };
  }, []);

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

  const sendComment = async () => {
    if (text.trim() && signaling.current) {
      try {
        signaling.current.send({
          type: "comment",
          text: text,
          streamId: streamId,
          viewer_id: viewerId,
          username: username,
          profilePicture: profilePicture,
          timestamp: Date.now()
        });
        
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
        timestamp: Date.now()
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

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.isOwnMessage && styles.ownMessageBubble
    ]}>
      <View style={styles.messageHeader}>
        {item.profilePicture ? (
          <TouchableOpacity 
            onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user_id })}
          >
            <Image 
              source={{ uri: item.profilePicture }} 
              style={styles.messageProfileImage}
            />
          </TouchableOpacity>
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
        <View style={styles.videoContainer}>
          {remoteStream ? (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={styles.videoStream}
              objectFit="cover"
              zOrder={0}
            />
          ) : (
            <View style={[styles.videoStream, styles.placeholder]}>
              {/* Animated Spinner */}
              {isConnecting && (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <ActivityIndicator size="large" color="#FF3B30" />
                </Animated.View>
              )}
              
              {/* Stream Ended Overlay */}
              {showEndedOverlay && (
                <View style={styles.endedContainer}>
                  <MaterialIcon name="videocam-off" size={60} color="#FF3B30" />
                  <Text style={styles.endedTitle}>Stream Ended</Text>
                  <Text style={styles.endedSubtitle}>
                    The broadcaster has ended this live stream
                  </Text>
                  <TouchableOpacity 
                    style={styles.endedButton}
                    onPress={() => {
                      setShowEndedOverlay(false);
                      navigation.goBack();
                    }}
                  >
                    <Text style={styles.endedButtonText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Connecting Text */}
              {isConnecting && !showEndedOverlay && (
                <Text style={styles.placeholderText}>
                  Connecting to stream...
                </Text>
              )}

              {/* Connection Failed Text */}
              {!isConnecting && !remoteStream && !showEndedOverlay && (
                <Text style={styles.placeholderText}>
                  {connectionState === 'failed' ? 'Connection failed' : 
                   connectionState === 'ended' ? 'Stream ended' :
                   'Waiting for stream...'}
                </Text>
              )}
            </View>
          )}
        </View>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoStream: {
    flex: 1,
    backgroundColor: 'black',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  placeholderText: {
    color: '#666',
    marginTop: 20,
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
  endedContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  endedTitle: {
    color: '#FF3B30',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'System',
  },
  endedSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'System',
  },
  endedButton: {
    marginTop: 30,
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 25,
  },
  endedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

