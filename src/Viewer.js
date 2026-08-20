

// // import React, { useEffect, useRef, useState } from "react";
// // import { 
// //   View, 
// //   TextInput, 
// //   FlatList, 
// //   Text, 
// //   TouchableOpacity, 
// //   StyleSheet,
// //   Animated,
// //   Dimensions,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Image,
// //   Alert,
// //   ActivityIndicator,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { RTCPeerConnection, RTCView, MediaStream } from "react-native-webrtc";
// // import Signaling from "./signaling";
// // import InCallManager from "react-native-incall-manager";
// // import { rtcConfig, getIceServers } from "./rtcConfig";
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// // import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// // const { width, height } = Dimensions.get('window');

// // export default function Viewer({ route, navigation }) {
// //   const { roomName, streamId, viewerId } = route.params;
// //   const pcRef = useRef(null);
// //   const signaling = useRef(null);
// //   const [remoteStream, setRemoteStream] = useState(null);
// //   const [messages, setMessages] = useState([]);
// //   const [text, setText] = useState("");
// //   const [showChat, setShowChat] = useState(true);
// //   const [liked, setLiked] = useState(false);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [username, setUsername] = useState('Anonymous');
// //   const [profilePicture, setProfilePicture] = useState('');
// //   const [connectionState, setConnectionState] = useState('connecting');
// //   const [streamEnded, setStreamEnded] = useState(false);
// //   const [isConnecting, setIsConnecting] = useState(true);
// //   const [showEndedOverlay, setShowEndedOverlay] = useState(false);
  
// //   const slideAnim = useRef(new Animated.Value(0)).current;
// //   const fadeAnim = useRef(new Animated.Value(1)).current;
// //   const spinnerAnim = useRef(new Animated.Value(0)).current;
// //   const myViewerId = useRef(viewerId);
  
// //   // Reorders the codec list in an SDP's m=video line so the given codec
// // // (e.g. "VP8") is tried first during negotiation. VP8 is a software codec
// // // supported identically on every device, avoiding Android hardware H264
// // // decoder incompatibilities that show up as "audio works, video is black".
// // function preferCodec(sdp, mimeType, kind = 'video') {
// //   const lines = sdp.split('\r\n');
// //   const mLineIndex = lines.findIndex((line) => line.startsWith(`m=${kind}`));
// //   if (mLineIndex === -1) return sdp;

// //   const codecRegex = new RegExp(`a=rtpmap:(\\d+) ${mimeType}/\\d+`, 'i');
// //   const matchingPayloads = [];
// //   for (const line of lines) {
// //     const match = line.match(codecRegex);
// //     if (match) matchingPayloads.push(match[1]);
// //   }
// //   if (matchingPayloads.length === 0) return sdp; // codec not offered, leave as-is

// //   const mLineParts = lines[mLineIndex].split(' ');
// //   const header = mLineParts.slice(0, 3); // "m=video PORT PROTO"
// //   const payloads = mLineParts.slice(3);

// //   const reordered = [
// //     ...matchingPayloads,
// //     ...payloads.filter((p) => !matchingPayloads.includes(p)),
// //   ];

// //   lines[mLineIndex] = [...header, ...reordered].join(' ');
// //   return lines.join('\r\n');
// // }

// //   // Spinner rotation animation
// //   useEffect(() => {
// //     if (isConnecting) {
// //       Animated.loop(
// //         Animated.timing(spinnerAnim, {
// //           toValue: 1,
// //           duration: 1500,
// //           useNativeDriver: true,
// //         })
// //       ).start();
// //     } else {
// //       spinnerAnim.setValue(0);
// //     }
// //   }, [isConnecting]);

// //   const spin = spinnerAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: ['0deg', '360deg'],
// //   });

// //   const handleSignaling = async (msg) => {
// //     if (!msg) return;

// //     console.log('📥 Received message:', msg.type);

// //     if (msg.type === "broadcaster-answer") {
// //       console.log("Viewer ID:", viewerId);
// //       console.log("Message viewer ID:", msg.viewer_id);

// //       try {
// //         await pcRef.current.setRemoteDescription(msg.answer);
// //         console.log("✅ Remote description set");
// //         setConnectionState('connected');
// //         setIsConnecting(false);
// //       } catch(e){
// //         console.log("❌ setRemoteDescription failed", e);
// //       }
// //     } else if (msg.type === "end-stream") {
// //       console.log("📴 Stream ended by broadcaster");
// //       setStreamEnded(true);
// //       setShowEndedOverlay(true);
// //       setIsConnecting(false);
      
// //       // Close WebRTC
// //       pcRef.current?.close();
// //       signaling.current?.close();
// //       setRemoteStream(null);
// //       setConnectionState('ended');

// //       // Show nice alert after a delay
// //       setTimeout(() => {
// //         Alert.alert(
// //           "📺 Stream Ended",
// //           "The broadcaster has ended the live stream. Thank you for watching! 🙏",
// //           [
// //             {
// //               text: "OK",
// //               onPress: () => {
// //                 setShowEndedOverlay(false);
// //                 navigation.goBack();
// //               },
// //             },
// //           ]
// //         );
// //       }, 1500);
// //     // } else if (msg.type === "candidate" && msg.viewer_id === viewerId) {
// //     //   if (msg.candidate) {
// //     } else if (msg.type === "candidate" && msg.viewer_id === myViewerId.current) {
// //   if (msg.candidate) {
// //         try {
// //           await pcRef.current.addIceCandidate(msg.candidate);
// //           console.log('❄️ ICE candidate added');
// //         } catch (e) {
// //           console.log('❌ Failed to add ICE candidate', e);
// //         }
// //       }
// //     } else if (msg.type === "comment") {
// //       console.log('💬 New comment:', msg);
// //       setMessages((prev) => [
// //         ...prev,
// //         { 
// //           id: Date.now().toString(), 
// //           text: msg.text, 
// //           username: msg.username || 'Anonymous',
// //           profilePicture: msg.profilePicture || '',
// //           timestamp: new Date() 
// //         },
// //       ]);
// //     } else if (msg.type === "like") {
// //       console.log('❤️ New like:', msg);
// //     } else if (msg.type === "viewer-joined") {
// //       console.log('👋 Viewer joined:', msg.username);
// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           id: Date.now().toString(),
// //           text: `👋 ${msg.username || 'A viewer'} joined the stream`,
// //           username: 'System',
// //           isSystemMessage: true,
// //           timestamp: new Date()
// //         },
// //       ]);
// //     } else if (msg.type === "viewer-left") {
// //       console.log('👋 Viewer left:', msg.username);
// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           id: Date.now().toString(),
// //           text: `👋 ${msg.username || 'A viewer'} left the stream`,
// //           username: 'System',
// //           isSystemMessage: true,
// //           timestamp: new Date()
// //         },
// //       ]);
// //     }
// //   };

// //   // Initialize viewer
// //   useEffect(() => {
// //     let mounted = true;
// //     let leftNotificationSent = false;

// //     const initializeViewer = async () => {
// //       try {
// //         // Load user data
// //         const userData = await AsyncStorage.getItem("userData");
        
// //         let currentUsername = 'Anonymous';
// //         let currentProfilePicture = '';
// //         let currentUserId = null;

// //         if (userData) {
// //           const parsedData = JSON.parse(userData);
// //           currentUsername = parsedData.name || parsedData.username || 'Anonymous';
// //           currentProfilePicture = parsedData.profile_picture || '';
// //           currentUserId = parsedData.id;
          
// //           setUsername(currentUsername);
// //           setProfilePicture(currentProfilePicture);
          
// //           console.log('👤 Viewer loaded:', {
// //             username: currentUsername,
// //             profilePicture: currentProfilePicture,
// //             userId: currentUserId
// //           });
// //         }
// //          // Resolve the one canonical id used for every signaling message from here on
// //         myViewerId.current = currentUserId || viewerId;

// //         // ✅ Initialize WebRTC
// //         await getIceServers();
        
// //         pcRef.current = new RTCPeerConnection({
// //           ...rtcConfig,
// //           iceTransportPolicy: 'all',
// //           iceCandidatePoolSize: 10,
// //           bundlePolicy: 'max-bundle',
// //           rtcpMuxPolicy: 'require',
// //         });

// //         // Connection state monitoring
// //         pcRef.current.onconnectionstatechange = () => {
// //           const state = pcRef.current.connectionState;
// //           console.log("🔄 Connection State:", state);
// //           setConnectionState(state);

// //           if (state === 'connected') {
// //             setIsConnecting(false);
// //           }

// //           if (
// //             state === "disconnected" ||
// //             state === "failed" ||
// //             state === "closed"
// //           ) {
// //             if (!streamEnded && !leftNotificationSent) {
// //               setStreamEnded(true);
// //               setShowEndedOverlay(true);
// //               setIsConnecting(false);
              
// //               setTimeout(() => {
// //                 Alert.alert(
// //                   "📡 Connection Lost",
// //                   "The connection to the stream has been lost. Please try again.",
// //                   [
// //                     {
// //                       text: "OK",
// //                       onPress: () => {
// //                         setShowEndedOverlay(false);
// //                         navigation.goBack();
// //                       },
// //                     },
// //                   ]
// //                 );
// //               }, 1500);
// //             }
// //           }
// //         };

// //         pcRef.current.ontrack = (event) => {
// //           console.log("🎥 ontrack fired");
// //           console.log("Track kind:", event.track.kind);

// //           if (event.track.kind === "audio") {
// //             console.log("🎤 AUDIO RECEIVED");
// //           }

// //           if (event.track.kind === "video") {
// //             console.log("🎥 VIDEO RECEIVED");
// //           }

// //           if (event.streams && event.streams.length > 0) {
// //             setRemoteStream(event.streams[0]);
// //             setConnectionState('connected');
// //             setIsConnecting(false);
// //           }
// //         };

// //         setTimeout(async () => {
// //   if (pcRef.current) {
// //     const stats = await pcRef.current.getStats();
// //     stats.forEach((report) => {
// //       if (report.type === 'inbound-rtp' && report.kind === 'video') {
// //         console.log('📊 Negotiated video codec info:', {
// //           codecId: report.codecId,
// //           framesDecoded: report.framesDecoded,
// //           framesReceived: report.framesReceived,
// //         });
// //       }
// //       if (report.type === 'codec' && report.mimeType?.includes('video')) {
// //         console.log('📊 Video codec in use:', report.mimeType);
// //       }
// //     });
// //   }
// // }, 5000);

// //         pcRef.current.oniceconnectionstatechange = () => {
// //           console.log('🔄 ICE connection state:', pcRef.current.iceConnectionState);
// //           setConnectionState(pcRef.current.iceConnectionState);
// //         };

// //         pcRef.current.onicecandidate = (e) => {
// //           if (e.candidate && signaling.current) {
// //             console.log('❄️ Local ICE candidate:', e.candidate);
// //             signaling.current.send({
// //               type: "candidate",
// //               candidate: e.candidate,
// //               streamId,
// //               viewer_id: myViewerId.current,
// //             });
// //           }
// //         };

// //         // Initialize signaling
// //         signaling.current = new Signaling(roomName, handleSignaling);
// //         await signaling.current.connect();

// //         InCallManager.start({
// //           media: "video",
// //         });

// //         InCallManager.setSpeakerphoneOn(true);

// //         // Send viewer joined
// //         // signaling.current.send({
// //         //   type: "viewer-joined",
// //         //   viewer_id: currentUserId || viewerId,
// //         //   username: currentUsername,
// //         //   profilePicture: currentProfilePicture,
// //         //   streamId: streamId,
// //         //   timestamp: Date.now()
// //         // });

// //         signaling.current.send({
// //           type: "viewer-joined",
// //           viewer_id: myViewerId.current,
// //           username: currentUsername,
// //           profilePicture: currentProfilePicture,
// //           streamId: streamId,
// //           timestamp: Date.now()
// //         });
// //         console.log('👋 Sent viewer joined notification:', currentUsername);

// //         // Add transceivers
// //         pcRef.current.addTransceiver('video', {
// //           direction: 'recvonly',
// //         });
// //         pcRef.current.addTransceiver('audio', {
// //           direction: 'recvonly',
// //         });
        
// //         console.log('✅ Added transceivers');

// //         // Create and send offer
// //                 // Create and send offer — force VP8 first to avoid Android hardware
// //         // H264 decoder incompatibilities that cause "black video, audio fine"
// //         const rawOffer = await pcRef.current.createOffer({
// //           offerToReceiveVideo: true,
// //           offerToReceiveAudio: true,
// //         });

// //         const mungedSdp = preferCodec(rawOffer.sdp, 'VP8', 'video');
// //         const offer = { type: rawOffer.type, sdp: mungedSdp };

// //         await pcRef.current.setLocalDescription(offer);

// //         signaling.current.send({
// //           type: "viewer-offer",
// //           offer,
// //           streamId,
// //           viewer_id: myViewerId.current,
// //           username: currentUsername,
// //           profilePicture: currentProfilePicture,
// //         });
        
// //         console.log('📤 Sent viewer-offer with ID:', myViewerId.current);
        
// //         console.log('📤 Sent viewer-offer with ID:', currentUserId || viewerId);

// //         // Set a timeout to stop connecting state if it takes too long
// //         setTimeout(() => {
// //           if (isConnecting && !remoteStream) {
// //             setIsConnecting(false);
// //           }
// //         }, 15000);

// //       } catch (error) {
// //         console.error('Error initializing viewer:', error);
// //         setIsConnecting(false);
// //         Alert.alert(
// //           "Connection Error",
// //           "Failed to connect to the stream. Please try again.",
// //           [
// //             {
// //               text: "OK",
// //               onPress: () => navigation.goBack(),
// //             },
// //           ]
// //         );
// //       }
// //     };

// //     initializeViewer();

// //     // Cleanup function
// //     return () => {
// //       mounted = false;
      
// //           if (signaling.current && !leftNotificationSent) {
// //         leftNotificationSent = true;
        
// //         signaling.current.send({
// //           type: "viewer-left",
// //           viewer_id: myViewerId.current,
// //           username: username,
// //           streamId: streamId,
// //           timestamp: Date.now()
// //         });
// //         console.log('👋 Sent viewer left notification:', username);
        
// //         setTimeout(() => {
// //           signaling.current?.close();
// //         }, 100);
// //       }
      
// //       pcRef.current?.close();
// //     };
// //   }, []);

// //   const toggleChat = () => {
// //     setShowChat(!showChat);
// //     Animated.timing(slideAnim, {
// //       toValue: showChat ? 1 : 0,
// //       duration: 300,
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   const hideUI = () => {
// //     Animated.timing(fadeAnim, {
// //       toValue: fadeAnim._value === 1 ? 0 : 1,
// //       duration: 200,
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   const sendComment = async () => {
// //     if (text.trim() && signaling.current) {
// //       try {
// //         signaling.current.send({
// //           type: "comment",
// //           text: text,
// //           streamId: streamId,
// //           viewer_id: viewerId,
// //           username: username,
// //           profilePicture: profilePicture,
// //           timestamp: Date.now()
// //         });
        
// //         setMessages((prev) => [
// //           ...prev,
// //           {
// //             id: Date.now().toString(),
// //             text: text,
// //             username: username,
// //             profilePicture: profilePicture,
// //             timestamp: new Date(),
// //             isOwnMessage: true
// //           },
// //         ]);
        
// //         setText("");
        
// //       } catch (error) {
// //         console.error('Error in sendComment:', error);
// //       }
// //     }
// //   };

// //   const sendLike = () => {
// //     if (!liked) {
// //       setLiked(true);
// //       signaling.current?.send({
// //         type: "like",
// //         streamId,
// //         viewer_id: viewerId,
// //         username: username,
// //         timestamp: Date.now()
// //       });
// //       setTimeout(() => setLiked(false), 1000);
// //     }
// //   };

// //   const formatTime = (date) => {
// //     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   const chatTranslateX = slideAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [300, 0],
// //   });

// //   const renderMessage = ({ item }) => (
// //     <View style={[
// //       styles.messageBubble,
// //       item.isOwnMessage && styles.ownMessageBubble
// //     ]}>
// //       <View style={styles.messageHeader}>
// //         {item.profilePicture ? (
// //           <TouchableOpacity 
// //             onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user_id })}
// //           >
// //             <Image 
// //               source={{ uri: item.profilePicture }} 
// //               style={styles.messageProfileImage}
// //             />
// //           </TouchableOpacity>
// //         ) : (
// //           <View style={[styles.messageProfilePlaceholder, { backgroundColor: getRandomColor(item.username) }]}>
// //             <Text style={styles.messageProfileInitial}>
// //               {item.username ? item.username.charAt(0).toUpperCase() : 'A'}
// //             </Text>
// //           </View>
// //         )}
// //         <Text style={styles.messageUsername}>{item.username || 'Anonymous'}</Text>
// //         {item.isOwnMessage && <Text style={styles.youTag}>(You)</Text>}
// //       </View>
// //       <Text style={styles.messageText}>{item.text}</Text>
// //       <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
// //     </View>
// //   );

// //   const getRandomColor = (name) => {
// //     if (!name) return '#555';
// //     let hash = 0;
// //     for (let i = 0; i < name.length; i++) {
// //       hash = name.charCodeAt(i) + ((hash << 5) - hash);
// //     }
// //     const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
// //     return colors[Math.abs(hash) % colors.length];
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <KeyboardAvoidingView 
// //         style={styles.container}
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //       >
// //         {/* Video Stream */}
// //         <View style={styles.videoContainer}>
// //           {remoteStream ? (
// //             <RTCView
// //               streamURL={remoteStream.toURL()}
// //               style={styles.videoStream}
// //               objectFit="cover"
// //               zOrder={0}
// //             />
// //           ) : (
// //             <View style={[styles.videoStream, styles.placeholder]}>
// //               {/* Animated Spinner */}
// //               {isConnecting && (
// //                 <Animated.View style={{ transform: [{ rotate: spin }] }}>
// //                   <ActivityIndicator size="large" color="#FF3B30" />
// //                 </Animated.View>
// //               )}
              
// //               {/* Stream Ended Overlay */}
// //               {showEndedOverlay && (
// //                 <View style={styles.endedContainer}>
// //                   <MaterialIcon name="videocam-off" size={60} color="#FF3B30" />
// //                   <Text style={styles.endedTitle}>Stream Ended</Text>
// //                   <Text style={styles.endedSubtitle}>
// //                     The broadcaster has ended this live stream
// //                   </Text>
// //                   <TouchableOpacity 
// //                     style={styles.endedButton}
// //                     onPress={() => {
// //                       setShowEndedOverlay(false);
// //                       navigation.goBack();
// //                     }}
// //                   >
// //                     <Text style={styles.endedButtonText}>Go Back</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               )}

// //               {/* Connecting Text */}
// //               {isConnecting && !showEndedOverlay && (
// //                 <Text style={styles.placeholderText}>
// //                   Connecting to stream...
// //                 </Text>
// //               )}

// //               {/* Connection Failed Text */}
// //               {!isConnecting && !remoteStream && !showEndedOverlay && (
// //                 <Text style={styles.placeholderText}>
// //                   {connectionState === 'failed' ? 'Connection failed' : 
// //                    connectionState === 'ended' ? 'Stream ended' :
// //                    'Waiting for stream...'}
// //                 </Text>
// //               )}
// //             </View>
// //           )}
// //         </View>

// //         {/* Header Controls */}
// //         <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
// //           <TouchableOpacity 
// //             style={styles.backButton}
// //             onPress={() => navigation.goBack()}
// //           >
// //             <Icon name="chevron-back" size={24} color="white" />
// //           </TouchableOpacity>
          
// //           <View style={styles.streamInfo}>
// //             <Text style={styles.streamTitle} numberOfLines={1}>
// //               Live Stream 
// //             </Text>
// //           </View>
// //         </Animated.View>

// //         {/* Chat Sidebar */}
// //         <Animated.View 
// //           style={[
// //             styles.chatContainer,
// //             { 
// //               transform: [{ translateX: chatTranslateX }],
// //               opacity: slideAnim
// //             }
// //           ]}
// //         >
// //           <View style={styles.chatHeader}>
// //             <Text style={styles.chatTitle}>Live Chat</Text>
// //             <TouchableOpacity onPress={toggleChat}>
// //               <Icon name="chevron-forward" size={24} color="white" />
// //             </TouchableOpacity>
// //           </View>

// //           <FlatList
// //             data={messages}
// //             keyExtractor={(item) => item.id}
// //             renderItem={renderMessage}
// //             style={styles.chatList}
// //             contentContainerStyle={styles.chatContent}
// //             showsVerticalScrollIndicator={false}
// //             inverted={false}
// //           />
// //         </Animated.View>

// //         {/* Controls */}
// //         <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
// //           <View style={styles.inputContainer}>
// //             <TextInput
// //               value={text}
// //               onChangeText={setText}
// //               placeholder="Send a message..."
// //               placeholderTextColor="#A0A0A0"
// //               style={styles.textInput}
// //               multiline
// //               maxLength={200}
// //             />
            
// //             <View style={styles.actionButtons}>
// //               <TouchableOpacity 
// //                 style={[styles.likeButton, liked && styles.likedButton]}
// //                 onPress={sendLike}
// //               >
// //                 <Icon 
// //                   name={liked ? "heart" : "heart-outline"} 
// //                   size={24} 
// //                   color={liked ? "#FF3B30" : "white"} 
// //                 />
// //               </TouchableOpacity>
              
// //               <TouchableOpacity 
// //                 style={styles.sendButton} 
// //                 onPress={sendComment}
// //                 disabled={!text.trim()}
// //               >
// //                 <Icon 
// //                   name="send" 
// //                   size={20} 
// //                   color={text.trim() ? "#007AFF" : "#666"} 
// //                 />
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Animated.View>

// //         {/* Chat Toggle Button when hidden */}
// //         {!showChat && (
// //           <TouchableOpacity style={styles.chatToggleButton} onPress={toggleChat}>
// //             <Icon name="chatbubbles" size={20} color="white" />
// //             {messages.length > 0 && (
// //               <View style={styles.smallBadge}>
// //                 <Text style={styles.smallBadgeText}>
// //                   {messages.length > 9 ? '9+' : messages.length}
// //                 </Text>
// //               </View>
// //             )}
// //           </TouchableOpacity>
// //         )}
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //   },
// //   videoStream: {
// //     flex: 1,
// //     backgroundColor: 'black',
// //   },
// //   placeholder: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#111',
// //   },
// //   placeholderText: {
// //     color: '#666',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontFamily: 'System',
// //   },
// //   header: {
// //     position: 'absolute',
// //     top: Platform.OS === 'ios' ? 10 : 30,
// //     left: 0,
// //     right: 0,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 15,
// //     paddingVertical: 10,
// //     zIndex: 10,
// //   },
// //   backButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.6)',
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     borderRadius: 20,
// //     minWidth: 0,
// //   },
// //   streamInfo: {
// //     flex: 1,
// //     alignItems: 'center',
// //     marginHorizontal: 15,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     fontFamily: 'System',
// //     textAlign: 'center',
// //   },
// //   chatContainer: {
// //     position: 'absolute',
// //     top: Platform.OS === 'ios' ? 80 : 100,
// //     right: 0,
// //     bottom: 120,
// //     width: width * 0.8,
// //     maxWidth: 320,
// //     backgroundColor: 'rgba(20,20,20,0.95)',
// //     borderLeftWidth: 1,
// //     borderLeftColor: 'rgba(255,255,255,0.15)',
// //     zIndex: 5,
// //   },
// //   chatHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(255,255,255,0.1)',
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //   },
// //   chatTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     fontFamily: 'System',
// //   },
// //   chatList: {
// //     flex: 1,
// //   },
// //   chatContent: {
// //     padding: 10,
// //     paddingBottom: 20,
// //   },
// //   messageBubble: {
// //     backgroundColor: 'rgba(255,255,255,0.1)',
// //     padding: 12,
// //     borderRadius: 16,
// //     marginBottom: 8,
// //     maxWidth: '90%',
// //     alignSelf: 'flex-start',
// //   },
// //   messageText: {
// //     color: 'white',
// //     fontSize: 14,
// //     lineHeight: 18,
// //     fontFamily: 'System',
// //   },
// //   messageTime: {
// //     color: '#A0A0A0',
// //     fontSize: 10,
// //     marginTop: 4,
// //     alignSelf: 'flex-end',
// //     fontFamily: 'System',
// //   },
// //   controls: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     paddingBottom: Platform.OS === 'ios' ? 35 : 15,
// //     backgroundColor: 'rgba(0,0,0,0.8)',
// //     borderTopWidth: 1,
// //     borderTopColor: 'rgba(255,255,255,0.1)',
// //     zIndex: 10,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-end',
// //     marginBottom: 15,
// //   },
// //   textInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255,255,255,0.12)',
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     borderWidth: 1,
// //     borderRadius: 24,
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     color: 'white',
// //     fontSize: 16,
// //     maxHeight: 100,
// //     fontFamily: 'System',
// //     textAlignVertical: 'center',
// //   },
// //   actionButtons: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginLeft: 10,
// //   },
// //   likeButton: {
// //     padding: 10,
// //     marginRight: 5,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(255,255,255,0.1)',
// //   },
// //   likedButton: {
// //     backgroundColor: 'rgba(255,59,48,0.2)',
// //     transform: [{ scale: 1.1 }],
// //   },
// //   sendButton: {
// //     padding: 10,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(255,255,255,0.1)',
// //   },
// //   chatToggleButton: {
// //     position: 'absolute',
// //     right: 20,
// //     bottom: 100,
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //     padding: 12,
// //     borderRadius: 25,
// //     zIndex: 5,
// //   },
// //   smallBadge: {
// //     position: 'absolute',
// //     top: -5,
// //     right: -5,
// //     backgroundColor: '#FF3B30',
// //     borderRadius: 8,
// //     minWidth: 16,
// //     height: 16,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: 'rgba(0,0,0,0.3)',
// //   },
// //   smallBadgeText: {
// //     color: 'white',
// //     fontSize: 8,
// //     fontWeight: 'bold',
// //     fontFamily: 'System',
// //   },
// //   messageHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 6,
// //   },
// //   messageProfileImage: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     marginRight: 8,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.3)',
// //   },
// //   messageProfilePlaceholder: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 8,
// //   },
// //   messageProfileInitial: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   messageUsername: {
// //     color: '#4A9EFF',
// //     fontSize: 13,
// //     fontWeight: '600',
// //     marginRight: 5,
// //   },
// //   youTag: {
// //     color: '#666',
// //     fontSize: 10,
// //     fontStyle: 'italic',
// //   },
// //   ownMessageBubble: {
// //     backgroundColor: 'rgba(74, 158, 255, 0.15)',
// //     alignSelf: 'flex-end',
// //   },
// //   endedContainer: {
// //     alignItems: 'center',
// //     paddingHorizontal: 30,
// //   },
// //   endedTitle: {
// //     color: '#FF3B30',
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     marginTop: 20,
// //     fontFamily: 'System',
// //   },
// //   endedSubtitle: {
// //     color: '#888',
// //     fontSize: 16,
// //     textAlign: 'center',
// //     marginTop: 10,
// //     fontFamily: 'System',
// //   },
// //   endedButton: {
// //     marginTop: 30,
// //     paddingHorizontal: 40,
// //     paddingVertical: 12,
// //     backgroundColor: '#FF3B30',
// //     borderRadius: 25,
// //   },
// //   endedButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     fontFamily: 'System',
// //   },
// // });


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
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { RTCPeerConnection, RTCView } from "react-native-webrtc";
// import NetInfo from "@react-native-community/netinfo"; 
// import Signaling from "./signaling";
// import InCallManager from "react-native-incall-manager";
// import { rtcConfig, getIceServers } from "./rtcConfig";
// import Icon from "react-native-vector-icons/Ionicons";
// import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// const { width, height } = Dimensions.get("window");
// const MAX_RECONNECT_ATTEMPTS = 3;
// const DISCONNECT_GRACE_MS = 6000; // let ICE try to self-heal before forcing a reconnect
// const CONNECT_TIMEOUT_MS = 15000;
// const WEAK_CONNECTION_LOSS_RATIO = 0.08; // 8% packet loss = "weak"
// const OVERLAY_COMMENT_COUNT = 5; // how many recent comments float over the video, Facebook-style

// // Reorders the codec list in an SDP's m=video line so the given codec
// // (e.g. "VP8") is tried first during negotiation. VP8 is a software codec
// // supported identically on every device, avoiding Android hardware H264
// // decoder incompatibilities that show up as "audio works, video is black".
// function preferCodec(sdp, mimeType, kind = "video") {
//   const lines = sdp.split("\r\n");
//   const mLineIndex = lines.findIndex((line) => line.startsWith(`m=${kind}`));
//   if (mLineIndex === -1) return sdp;

//   const codecRegex = new RegExp(`a=rtpmap:(\\d+) ${mimeType}/\\d+`, "i");
//   const matchingPayloads = [];
//   for (const line of lines) {
//     const match = line.match(codecRegex);
//     if (match) matchingPayloads.push(match[1]);
//   }
//   if (matchingPayloads.length === 0) return sdp;

//   const mLineParts = lines[mLineIndex].split(" ");
//   const header = mLineParts.slice(0, 3);
//   const payloads = mLineParts.slice(3);

//   const reordered = [
//     ...matchingPayloads,
//     ...payloads.filter((p) => !matchingPayloads.includes(p)),
//   ];

//   lines[mLineIndex] = [...header, ...reordered].join(" ");
//   return lines.join("\r\n");
// }

// export default function Viewer({ route, navigation }) {
//   const { roomName, streamId, viewerId } = route.params;

//   const pcRef = useRef(null);
//   const signaling = useRef(null);
//   const myViewerId = useRef(viewerId);
//   const baseViewerIdRef = useRef(viewerId);
//   const currentUsernameRef = useRef("Anonymous");
//   const currentProfileRef = useRef("");

//   const isMountedRef = useRef(true);
//   const streamEndedRef = useRef(false);
//   const leftNotificationSentRef = useRef(false);
//   const reconnectAttemptsRef = useRef(0);
//   const connectPeerRef = useRef(null);

//   const connectTimeoutRef = useRef(null);
//   const disconnectGraceRef = useRef(null);
//   const statsIntervalRef = useRef(null);

//   const overlayListRef = useRef(null);

//   const [remoteStream, setRemoteStream] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [showChat, setShowChat] = useState(false); // full sidebar starts closed; overlay always shows recent comments
//   const [liked, setLiked] = useState(false);
//   const [username, setUsername] = useState("Anonymous");
//   const [profilePicture, setProfilePicture] = useState("");
//   const [connectionState, setConnectionState] = useState("connecting");
//   const [streamEnded, setStreamEnded] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(true);
//   const [showEndedOverlay, setShowEndedOverlay] = useState(false);

//   // ---- Facebook-style live reaction state ----
//   const [viewerCount, setViewerCount] = useState(0);
//   const [likesCount, setLikesCount] = useState(0);
//   const [hearts, setHearts] = useState([]);

//   const [networkIssues, setNetworkIssues] = useState({
//     offline: false,
//     reconnecting: false,
//     weak: false,
//   });

//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const spinnerAnim = useRef(new Animated.Value(0)).current;
//   const bannerAnim = useRef(new Animated.Value(0)).current;

//   const bannerInfo = networkIssues.offline
//     ? { message: "📡 No internet connection", color: "#D32F2F" }
//     : networkIssues.reconnecting
//     ? {
//         message: `🔄 Reconnecting${
//           reconnectAttemptsRef.current > 0
//             ? ` (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`
//             : ""
//         }...`,
//         color: "#FF9500",
//       }
//     : networkIssues.weak
//     ? { message: "⚠️ Weak connection", color: "#FF9500" }
//     : null;

//   useEffect(() => {
//     Animated.timing(bannerAnim, {
//       toValue: bannerInfo ? 1 : 0,
//       duration: 250,
//       useNativeDriver: true,
//     }).start();
//   }, [!!bannerInfo]);

//   useEffect(() => {
//     if (isConnecting) {
//       Animated.loop(
//         Animated.timing(spinnerAnim, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         })
//       ).start();
//     } else {
//       spinnerAnim.setValue(0);
//     }
//   }, [isConnecting]);

//   const spin = spinnerAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "360deg"],
//   });

//   // Auto-scroll the floating comment overlay to the newest message
//   useEffect(() => {
//     if (messages.length > 0 && overlayListRef.current) {
//       setTimeout(() => {
//         overlayListRef.current?.scrollToEnd({ animated: true });
//       }, 50);
//     }
//   }, [messages.length]);

//   // ---- Device network connectivity ----
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       if (!isMountedRef.current) return;
//       const offline = state.isConnected === false || state.isInternetReachable === false;
//       setNetworkIssues((prev) => ({ ...prev, offline }));
//     });
//     return () => unsubscribe();
//   }, []);

//   // ---- Periodic WebRTC quality check ----
//   useEffect(() => {
//     if (connectionState !== "connected" || !pcRef.current) {
//       if (statsIntervalRef.current) {
//         clearInterval(statsIntervalRef.current);
//         statsIntervalRef.current = null;
//       }
//       return;
//     }

//     statsIntervalRef.current = setInterval(async () => {
//       if (!pcRef.current || !isMountedRef.current) return;
//       try {
//         const stats = await pcRef.current.getStats();
//         let packetsLost = 0;
//         let packetsReceived = 0;
//         stats.forEach((report) => {
//           if (report.type === "inbound-rtp" && report.kind === "video") {
//             packetsLost = report.packetsLost || 0;
//             packetsReceived = report.packetsReceived || 0;
//           }
//         });
//         const total = packetsLost + packetsReceived;
//         const lossRatio = total > 0 ? packetsLost / total : 0;
//         if (isMountedRef.current) {
//           setNetworkIssues((prev) => ({ ...prev, weak: lossRatio > WEAK_CONNECTION_LOSS_RATIO }));
//         }
//       } catch (e) {}
//     }, 4000);

//     return () => {
//       if (statsIntervalRef.current) {
//         clearInterval(statsIntervalRef.current);
//         statsIntervalRef.current = null;
//       }
//     };
//   }, [connectionState]);

//   // ---- Floating heart animation, same visual language as the broadcaster's screen ----
//   const createHeartAnimation = () => {
//     const heartId = `${Date.now()}-${Math.random()}`;
//     const startX = width * 0.85; // hearts rise from near the like button, bottom-right
//     const heart = {
//       id: heartId,
//       startX: startX + (Math.random() - 0.5) * 30,
//       scale: new Animated.Value(0),
//       opacity: new Animated.Value(1),
//       translateY: new Animated.Value(0),
//       translateX: new Animated.Value(0),
//     };

//     setHearts((prev) => [...prev, heart]);

//     const randomX = (Math.random() - 0.5) * 80;

//     Animated.sequence([
//       Animated.timing(heart.scale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
//       Animated.timing(heart.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
//       Animated.parallel([
//         Animated.timing(heart.translateY, { toValue: -height * 0.55, duration: 2500, useNativeDriver: true }),
//         Animated.timing(heart.translateX, { toValue: randomX, duration: 2500, useNativeDriver: true }),
//         Animated.timing(heart.opacity, { toValue: 0, duration: 2500, useNativeDriver: true }),
//       ]),
//     ]).start(() => {
//       setHearts((prev) => prev.filter((h) => h.id !== heartId));
//     });
//   };

//   const handleSignaling = async (msg) => {
//     if (!msg) return;
//     console.log("📥 Received message:", msg.type);

//     if (msg.type === "broadcaster-answer") {
//       try {
//         await pcRef.current.setRemoteDescription(msg.answer);
//         if (isMountedRef.current) {
//           setConnectionState("connected");
//           setIsConnecting(false);
//         }
//       } catch (e) {
//         console.log("❌ setRemoteDescription failed", e);
//       }
//     } else if (msg.type === "viewer-count") {
//       // Broadcaster.js sends this on every join/leave — mirror it here so
//       // viewers see the same live count the broadcaster sees.
//       if (isMountedRef.current) setViewerCount(msg.count || 0);
//     } else if (msg.type === "end-stream") {
//       console.log("📴 Stream ended by broadcaster");
//       streamEndedRef.current = true;
//       clearTimeout(connectTimeoutRef.current);
//       clearTimeout(disconnectGraceRef.current);

//       if (!isMountedRef.current) return;
//       setStreamEnded(true);
//       setShowEndedOverlay(true);
//       setIsConnecting(false);
//       setNetworkIssues({ offline: false, reconnecting: false, weak: false });

//       try { pcRef.current?.close(); } catch (e) {}
//       try { signaling.current?.close(); } catch (e) {}
//       setRemoteStream(null);
//       setConnectionState("ended");

//       setTimeout(() => {
//         Alert.alert(
//           "📺 Stream Ended",
//           "The broadcaster has ended the live stream. Thank you for watching! 🙏",
//           [{ text: "OK", onPress: () => { setShowEndedOverlay(false); navigation.goBack(); } }]
//         );
//       }, 1500);
//     } else if (msg.type === "candidate" && msg.viewer_id === myViewerId.current) {
//       if (msg.candidate) {
//         try {
//           await pcRef.current.addIceCandidate(msg.candidate);
//         } catch (e) {
//           console.log("❌ Failed to add ICE candidate", e);
//         }
//       }
//         } else if (msg.type === "comment-relay") {
//       // Skip our own comment coming back — we already added it optimistically
//       // in sendComment() the instant the user hit send.
//       if (msg.viewer_id === myViewerId.current) return;
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `${Date.now()}-${Math.random()}`,
//           text: msg.text,
//           username: msg.username || "Anonymous",
//           profilePicture: msg.profilePicture || "",
//           timestamp: new Date(),
//         },
//       ]);
//     } else if (msg.type === "like-relay") {
//       // Reflects everyone's likes, including our own — sendLike() doesn't
//       // increment the count locally, so this is the single source of truth
//       // and won't double-count.
//       if (isMountedRef.current) {
//         setLikesCount((prev) => prev + 1);
//         createHeartAnimation();
//       }
    
//     } else if (msg.type === "viewer-joined") {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `${Date.now()}-${Math.random()}`,
//           text: `👋 ${msg.username || "A viewer"} joined the stream`,
//           username: "System",
//           isSystemMessage: true,
//           timestamp: new Date(),
//         },
//       ]);
//     } else if (msg.type === "viewer-left") {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `${Date.now()}-${Math.random()}`,
//           text: `👋 ${msg.username || "A viewer"} left the stream`,
//           username: "System",
//           isSystemMessage: true,
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };

//   useEffect(() => {
//     isMountedRef.current = true;

//     connectPeerRef.current = async (isReconnect = false) => {
//       if (!isMountedRef.current || streamEndedRef.current) return;

//       if (isReconnect) {
//         reconnectAttemptsRef.current += 1;
//         if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
//           setNetworkIssues((prev) => ({ ...prev, reconnecting: false }));
//           if (!streamEndedRef.current) {
//             streamEndedRef.current = true;
//             setStreamEnded(true);
//             setShowEndedOverlay(true);
//             setIsConnecting(false);
//             setTimeout(() => {
//               Alert.alert(
//                 "📡 Connection Lost",
//                 "We couldn't reconnect to the stream. Please check your internet connection and try again.",
//                 [
//                   { text: "Go Back", onPress: () => navigation.goBack(), style: "cancel" },
//                   {
//                     text: "Retry",
//                     onPress: () => {
//                       streamEndedRef.current = false;
//                       reconnectAttemptsRef.current = 0;
//                       setStreamEnded(false);
//                       setShowEndedOverlay(false);
//                       setIsConnecting(true);
//                       connectPeerRef.current(false);
//                     },
//                   },
//                 ]
//               );
//             }, 300);
//           }
//           return;
//         }

//         setNetworkIssues((prev) => ({ ...prev, reconnecting: true }));
//         setIsConnecting(true);
//         setRemoteStream(null);

//         try { pcRef.current?.close(); } catch (e) {}
//         pcRef.current = null;
//         try { signaling.current?.close(); } catch (e) {}

//         myViewerId.current = `${baseViewerIdRef.current}-r${reconnectAttemptsRef.current}`;
//       }

//       try {
//         await getIceServers();
//         if (!isMountedRef.current) return;

//         signaling.current = new Signaling(roomName, handleSignaling);
//         signaling.current.connect();

//         pcRef.current = new RTCPeerConnection({
//           ...rtcConfig,
//           iceTransportPolicy: "all",
//           iceCandidatePoolSize: 10,
//           bundlePolicy: "max-bundle",
//           rtcpMuxPolicy: "require",
//         });

//         pcRef.current.onconnectionstatechange = () => {
//           const state = pcRef.current?.connectionState;
//           if (!isMountedRef.current) return;
//           console.log("🔄 Connection State:", state);
//           setConnectionState(state);

//           if (state === "connected") {
//             setIsConnecting(false);
//             reconnectAttemptsRef.current = 0;
//             clearTimeout(disconnectGraceRef.current);
//             setNetworkIssues((prev) => ({ ...prev, reconnecting: false, weak: false }));
//           }

//           if (state === "disconnected" && !streamEndedRef.current) {
//             setNetworkIssues((prev) => ({ ...prev, reconnecting: true }));
//             clearTimeout(disconnectGraceRef.current);
//             disconnectGraceRef.current = setTimeout(() => {
//               if (isMountedRef.current && pcRef.current?.connectionState !== "connected" && !streamEndedRef.current) {
//                 connectPeerRef.current(true);
//               }
//             }, DISCONNECT_GRACE_MS);
//           }

//           if (state === "failed" && !streamEndedRef.current) {
//             clearTimeout(disconnectGraceRef.current);
//             connectPeerRef.current(true);
//           }
//         };

//         pcRef.current.ontrack = (event) => {
//           console.log("🎥 ontrack fired:", event.track.kind);
//           if (event.streams && event.streams.length > 0 && isMountedRef.current) {
//             setRemoteStream(event.streams[0]);
//             setConnectionState("connected");
//             setIsConnecting(false);
//           }
//         };

//         pcRef.current.oniceconnectionstatechange = () => {
//           if (!isMountedRef.current || !pcRef.current) return;
//           console.log("🔄 ICE connection state:", pcRef.current.iceConnectionState);
//         };

//         pcRef.current.onicecandidate = (e) => {
//           if (e.candidate && signaling.current) {
//             signaling.current.send({
//               type: "candidate",
//               candidate: e.candidate,
//               streamId,
//               viewer_id: myViewerId.current,
//             });
//           }
//         };

//         InCallManager.start({ media: "video" });
//         InCallManager.setSpeakerphoneOn(true);

//         signaling.current.send({
//           type: "viewer-joined",
//           viewer_id: myViewerId.current,
//           username: currentUsernameRef.current,
//           profilePicture: currentProfileRef.current,
//           streamId,
//           timestamp: Date.now(),
//         });

//         pcRef.current.addTransceiver("video", { direction: "recvonly" });
//         pcRef.current.addTransceiver("audio", { direction: "recvonly" });

//         const rawOffer = await pcRef.current.createOffer({
//           offerToReceiveVideo: true,
//           offerToReceiveAudio: true,
//         });
//         const offer = { type: rawOffer.type, sdp: preferCodec(rawOffer.sdp, "VP8", "video") };
//         await pcRef.current.setLocalDescription(offer);

//         signaling.current.send({
//           type: "viewer-offer",
//           offer,
//           streamId,
//           viewer_id: myViewerId.current,
//           username: currentUsernameRef.current,
//           profilePicture: currentProfileRef.current,
//         });

//         console.log("📤 Sent viewer-offer with ID:", myViewerId.current);

//         clearTimeout(connectTimeoutRef.current);
//         connectTimeoutRef.current = setTimeout(() => {
//           if (isMountedRef.current && pcRef.current?.connectionState !== "connected") {
//             setIsConnecting(false);
//           }
//         }, CONNECT_TIMEOUT_MS);
//       } catch (error) {
//         console.error("Error connecting to stream:", error);
//         if (isMountedRef.current) {
//           if (isReconnect) {
//             setTimeout(() => connectPeerRef.current(true), 3000);
//           } else {
//             setIsConnecting(false);
//             Alert.alert("Connection Error", "Failed to connect to the stream. Please try again.", [
//               { text: "OK", onPress: () => navigation.goBack() },
//             ]);
//           }
//         }
//       }
//     };

//     const init = async () => {
//       try {
//         const userData = await AsyncStorage.getItem("userData");
//         if (userData) {
//           const parsed = JSON.parse(userData);
//           currentUsernameRef.current = parsed.name || parsed.username || "Anonymous";
//           currentProfileRef.current = parsed.profile_picture || "";
//           baseViewerIdRef.current = parsed.id || viewerId;
//           if (isMountedRef.current) {
//             setUsername(currentUsernameRef.current);
//             setProfilePicture(currentProfileRef.current);
//           }
//         }
//         myViewerId.current = baseViewerIdRef.current;
//         await connectPeerRef.current(false);
//       } catch (error) {
//         console.error("Error initializing viewer:", error);
//         if (isMountedRef.current) {
//           setIsConnecting(false);
//           Alert.alert("Connection Error", "Failed to connect to the stream. Please try again.", [
//             { text: "OK", onPress: () => navigation.goBack() },
//           ]);
//         }
//       }
//     };

//     init();

//     return () => {
//       isMountedRef.current = false;

//       clearTimeout(connectTimeoutRef.current);
//       clearTimeout(disconnectGraceRef.current);
//       if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);

//       if (signaling.current && !leftNotificationSentRef.current) {
//         leftNotificationSentRef.current = true;
//         try {
//           signaling.current.send({
//             type: "viewer-left",
//             viewer_id: myViewerId.current,
//             username: currentUsernameRef.current,
//             streamId,
//             timestamp: Date.now(),
//           });
//         } catch (e) {}
//         setTimeout(() => { signaling.current?.close(); }, 100);
//       }

//       try { pcRef.current?.close(); } catch (e) {}
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

//   const sendComment = async () => {
//     if (text.trim() && signaling.current) {
//       try {
//         signaling.current.send({
//           type: "comment",
//           text,
//           streamId,
//           viewer_id: myViewerId.current,
//           username,
//           profilePicture,
//           timestamp: Date.now(),
//         });

//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now().toString(),
//             text,
//             username,
//             profilePicture,
//             timestamp: new Date(),
//             isOwnMessage: true,
//           },
//         ]);

//         setText("");
//       } catch (error) {
//         console.error("Error in sendComment:", error);
//       }
//     }
//   };

//   const sendLike = () => {
//     if (!liked) {
//       setLiked(true);
//       signaling.current?.send({
//         type: "like",
//         streamId,
//         viewer_id: myViewerId.current,
//         username,
//         timestamp: Date.now(),
//       });
//       setTimeout(() => setLiked(false), 1000);
//     }
//   };

//   const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const formatCount = (n) => {
//     if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
//     if (n >= 1000) return (n / 1000).toFixed(1) + "K";
//     return `${n}`;
//   };

//   const chatTranslateX = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });
//   const bannerTranslateY = bannerAnim.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] });

//   const getRandomColor = (name) => {
//     if (!name) return "#555";
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
//     return colors[Math.abs(hash) % colors.length];
//   };

//   const renderMessage = ({ item }) => (
//     <View style={[styles.messageBubble, item.isOwnMessage && styles.ownMessageBubble]}>
//       <View style={styles.messageHeader}>
//         {item.profilePicture ? (
//           <Image source={{ uri: item.profilePicture }} style={styles.messageProfileImage} />
//         ) : (
//           <View style={[styles.messageProfilePlaceholder, { backgroundColor: getRandomColor(item.username) }]}>
//             <Text style={styles.messageProfileInitial}>
//               {item.username ? item.username.charAt(0).toUpperCase() : "A"}
//             </Text>
//           </View>
//         )}
//         <Text style={styles.messageUsername}>{item.username || "Anonymous"}</Text>
//         {item.isOwnMessage && <Text style={styles.youTag}>(You)</Text>}
//       </View>
//       <Text style={styles.messageText}>{item.text}</Text>
//       <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
//     </View>
//   );

//   // Facebook-style floating comment row — compact, semi-transparent, no timestamps
//   const renderOverlayComment = ({ item }) => (
//     <View style={[styles.overlayCommentBubble, item.isSystemMessage && styles.overlaySystemBubble]}>
//       <Text style={[styles.overlayCommentUsername, item.isSystemMessage && styles.overlaySystemText]}>
//         {item.username}
//       </Text>
//       <Text style={styles.overlayCommentText} numberOfLines={2}>
//         {item.text}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//         {bannerInfo && (
//           <Animated.View
//             style={[styles.banner, { backgroundColor: bannerInfo.color, transform: [{ translateY: bannerTranslateY }] }]}
//             pointerEvents="none"
//           >
//             <Text style={styles.bannerText}>{bannerInfo.message}</Text>
//           </Animated.View>
//         )}

//         {/* Video Stream */}
//         <View style={styles.videoContainer}>
//           {remoteStream ? (
//             <RTCView streamURL={remoteStream.toURL()} style={styles.videoStream} objectFit="cover" zOrder={1} />
//           ) : (
//             <View style={[styles.videoStream, styles.placeholder]}>
//               {isConnecting && (
//                 <Animated.View style={{ transform: [{ rotate: spin }] }}>
//                   <ActivityIndicator size="large" color="#FF3B30" />
//                 </Animated.View>
//               )}

//               {showEndedOverlay && (
//                 <View style={styles.endedContainer}>
//                   <MaterialIcon name="videocam-off" size={60} color="#FF3B30" />
//                   <Text style={styles.endedTitle}>Stream Ended</Text>
//                   <Text style={styles.endedSubtitle}>The broadcaster has ended this live stream</Text>
//                   <TouchableOpacity
//                     style={styles.endedButton}
//                     onPress={() => { setShowEndedOverlay(false); navigation.goBack(); }}
//                   >
//                     <Text style={styles.endedButtonText}>Go Back</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               {isConnecting && !showEndedOverlay && (
//                 <Text style={styles.placeholderText}>Connecting to stream...</Text>
//               )}

//               {!isConnecting && !remoteStream && !showEndedOverlay && (
//                 <Text style={styles.placeholderText}>
//                   {connectionState === "failed" ? "Connection failed" : connectionState === "ended" ? "Stream ended" : "Waiting for stream..."}
//                 </Text>
//               )}
//             </View>
//           )}
//         </View>

//         {/* Floating hearts, same visual language as the broadcaster's own screen */}
//         {hearts.map((heart) => (
//           <Animated.View
//             key={heart.id}
//             style={[
//               styles.heartContainer,
//               {
//                 left: heart.startX - 25,
//                 bottom: 140,
//                 transform: [
//                   { scale: heart.scale },
//                   { translateY: heart.translateY },
//                   { translateX: heart.translateX },
//                 ],
//                 opacity: heart.opacity,
//               },
//             ]}
//             pointerEvents="none"
//           >
//             <Icon name="heart" size={40} color="#ff375f" />
//           </Animated.View>
//         ))}

//         {/* Header — mirrors the broadcaster's "watching • likes" stats */}
//         <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
//           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//             <Icon name="chevron-back" size={24} color="white" />
//           </TouchableOpacity>

//           <View style={styles.streamInfo}>
//             <View style={styles.liveBadge}>
//               <View style={styles.liveDot} />
//               <Text style={styles.liveText}>LIVE</Text>
//             </View>
//             <View style={styles.statsRow}>
//               <Icon name="eye" size={13} color="#fff" style={{ marginRight: 4 }} />
//               <Text style={styles.streamStats}>{formatCount(viewerCount)}</Text>
//               <Icon name="heart" size={13} color="#ff375f" style={{ marginLeft: 10, marginRight: 4 }} />
//               <Text style={styles.streamStats}>{formatCount(likesCount)}</Text>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.commentsHeaderButton} onPress={toggleChat}>
//             <Icon name="chatbubbles" size={22} color="#fff" />
//             {messages.length > 0 && !showChat && (
//               <View style={styles.unreadBadge}>
//                 <Text style={styles.unreadBadgeText}>{messages.length > 99 ? "99+" : messages.length}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </Animated.View>

//         {/* Facebook-style floating comment feed, always visible above the input bar */}
//         {!showChat && messages.length > 0 && (
//           <View style={styles.commentsOverlayContainer} pointerEvents="box-none">
//             <FlatList
//               ref={overlayListRef}
//               data={messages.slice(-OVERLAY_COMMENT_COUNT)}
//               keyExtractor={(item) => item.id}
//               renderItem={renderOverlayComment}
//               showsVerticalScrollIndicator={false}
//               scrollEnabled={false}
//             />
//           </View>
//         )}

//         {/* Full chat sidebar — opened from the header button for scrolling through history */}
//         <Animated.View
//           style={[styles.chatContainer, { transform: [{ translateX: chatTranslateX }], opacity: slideAnim }]}
//           pointerEvents={showChat ? "auto" : "none"}
//         >
//           <View style={styles.chatHeader}>
//             <Text style={styles.chatTitle}>Live Chat • {formatCount(viewerCount)} watching</Text>
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
//               <TouchableOpacity style={[styles.likeButton, liked && styles.likedButton]} onPress={sendLike}>
//                 <Icon name={liked ? "heart" : "heart-outline"} size={24} color={liked ? "#FF3B30" : "white"} />
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.sendButton} onPress={sendComment} disabled={!text.trim()}>
//                 <Icon name="send" size={20} color={text.trim() ? "#007AFF" : "#666"} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   banner: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     paddingTop: Platform.OS === "ios" ? 50 : 30,
//     paddingBottom: 10,
//     alignItems: "center",
//     zIndex: 999,
//     elevation: 999,
//   },
//   bannerText: { color: "#fff", fontSize: 13, fontWeight: "600" },
//   videoContainer: { flex: 1, backgroundColor: "#000" },
//   videoStream: { flex: 1, backgroundColor: "black" },
//   placeholder: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" },
//   placeholderText: { color: "#666", marginTop: 20, fontSize: 16, fontFamily: "System" },
//   heartContainer: {
//     position: "absolute",
//     width: 50,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 500,
//     elevation: 500,
//   },
//   header: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 10 : 30,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     zIndex: 10,
//   },
//   backButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   streamInfo: { flex: 1, alignItems: "center", marginHorizontal: 15 },
//   liveBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ff375f",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff", marginRight: 6 },
//   liveText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
//   statsRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
//   streamStats: { color: "#fff", fontSize: 12, fontWeight: "600" },
//   commentsHeaderButton: {
//     padding: 8,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 20,
//     position: "relative",
//   },
//   unreadBadge: {
//     position: "absolute",
//     top: -5,
//     right: -5,
//     backgroundColor: "#ff375f",
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: "#fff",
//   },
//   unreadBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
//   commentsOverlayContainer: {
//     position: "absolute",
//     left: 12,
//     right: 90,
//     bottom: 100,
//     maxHeight: 180,
//     zIndex: 6,
//   },
//   overlayCommentBubble: {
//     alignSelf: "flex-start",
//     backgroundColor: "rgba(0,0,0,0.45)",
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     marginTop: 6,
//     maxWidth: "95%",
//   },
//   overlaySystemBubble: { backgroundColor: "rgba(0,0,0,0.25)" },
//   overlayCommentUsername: { color: "#4A9EFF", fontSize: 12, fontWeight: "700" },
//   overlaySystemText: { color: "#FFA500" },
//   overlayCommentText: { color: "#fff", fontSize: 13, marginTop: 1 },
//   chatContainer: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 80 : 100,
//     right: 0,
//     bottom: 120,
//     width: width * 0.8,
//     maxWidth: 320,
//     backgroundColor: "rgba(20,20,20,0.95)",
//     borderLeftWidth: 1,
//     borderLeftColor: "rgba(255,255,255,0.15)",
//     zIndex: 5,
//   },
//   chatHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(255,255,255,0.1)",
//     backgroundColor: "rgba(0,0,0,0.7)",
//   },
//   chatTitle: { color: "white", fontSize: 16, fontWeight: "bold", fontFamily: "System" },
//   chatList: { flex: 1 },
//   chatContent: { padding: 10, paddingBottom: 20 },
//   messageBubble: {
//     backgroundColor: "rgba(255,255,255,0.1)",
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 8,
//     maxWidth: "90%",
//     alignSelf: "flex-start",
//   },
//   messageText: { color: "white", fontSize: 14, lineHeight: 18, fontFamily: "System" },
//   messageTime: { color: "#A0A0A0", fontSize: 10, marginTop: 4, alignSelf: "flex-end", fontFamily: "System" },
//   controls: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     paddingBottom: Platform.OS === "ios" ? 35 : 15,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     borderTopWidth: 1,
//     borderTopColor: "rgba(255,255,255,0.1)",
//     zIndex: 10,
//   },
//   inputContainer: { flexDirection: "row", alignItems: "flex-end", marginBottom: 15 },
//   textInput: {
//     flex: 1,
//     backgroundColor: "rgba(255,255,255,0.12)",
//     borderColor: "rgba(255,255,255,0.2)",
//     borderWidth: 1,
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     color: "white",
//     fontSize: 16,
//     maxHeight: 100,
//     fontFamily: "System",
//     textAlignVertical: "center",
//   },
//   actionButtons: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
//   likeButton: { padding: 10, marginRight: 5, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)" },
//   likedButton: { backgroundColor: "rgba(255,59,48,0.2)", transform: [{ scale: 1.1 }] },
//   sendButton: { padding: 10, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)" },
//   messageHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
//   messageProfileImage: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.3)",
//   },
//   messageProfilePlaceholder: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   messageProfileInitial: { color: "#fff", fontSize: 12, fontWeight: "bold" },
//   messageUsername: { color: "#4A9EFF", fontSize: 13, fontWeight: "600", marginRight: 5 },
//   youTag: { color: "#666", fontSize: 10, fontStyle: "italic" },
//   ownMessageBubble: { backgroundColor: "rgba(74, 158, 255, 0.15)", alignSelf: "flex-end" },
//   endedContainer: { alignItems: "center", paddingHorizontal: 30 },
//   endedTitle: { color: "#FF3B30", fontSize: 28, fontWeight: "bold", marginTop: 20, fontFamily: "System" },
//   endedSubtitle: { color: "#888", fontSize: 16, textAlign: "center", marginTop: 10, fontFamily: "System" },
//   endedButton: { marginTop: 30, paddingHorizontal: 40, paddingVertical: 12, backgroundColor: "#FF3B30", borderRadius: 25 },
//   endedButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", fontFamily: "System" },
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
import { RTCPeerConnection, RTCView } from "react-native-webrtc";
import NetInfo from "@react-native-community/netinfo"; // npm install @react-native-community/netinfo
import Signaling from "./signaling";
import InCallManager from "react-native-incall-manager";
import { rtcConfig, getIceServers } from "./rtcConfig";
import { API_ROUTE_IMAGE } from "../api_routing/api";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");
const MAX_RECONNECT_ATTEMPTS = 3;
const DISCONNECT_GRACE_MS = 6000; // let ICE try to self-heal before forcing a reconnect
const CONNECT_TIMEOUT_MS = 15000;
const WEAK_CONNECTION_LOSS_RATIO = 0.08; // 8% packet loss = "weak"
const OVERLAY_COMMENT_COUNT = 5; // how many recent comments float over the video, Facebook-style

// Reorders the codec list in an SDP's m=video line so the given codec
// (e.g. "VP8") is tried first during negotiation. VP8 is a software codec
// supported identically on every device, avoiding Android hardware H264
// decoder incompatibilities that show up as "audio works, video is black".
function preferCodec(sdp, mimeType, kind = "video") {
  const lines = sdp.split("\r\n");
  const mLineIndex = lines.findIndex((line) => line.startsWith(`m=${kind}`));
  if (mLineIndex === -1) return sdp;

  const codecRegex = new RegExp(`a=rtpmap:(\\d+) ${mimeType}/\\d+`, "i");
  const matchingPayloads = [];
  for (const line of lines) {
    const match = line.match(codecRegex);
    if (match) matchingPayloads.push(match[1]);
  }
  if (matchingPayloads.length === 0) return sdp;

  const mLineParts = lines[mLineIndex].split(" ");
  const header = mLineParts.slice(0, 3);
  const payloads = mLineParts.slice(3);

  const reordered = [
    ...matchingPayloads,
    ...payloads.filter((p) => !matchingPayloads.includes(p)),
  ];

  lines[mLineIndex] = [...header, ...reordered].join(" ");
  return lines.join("\r\n");
}

// Formats seconds as a live duration, e.g. "05:23" or "1:02:11" past an hour
function formatDuration(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function Viewer({ route, navigation }) {
  const { roomName, streamId, viewerId } = route.params;

  const pcRef = useRef(null);
  const signaling = useRef(null);
  const myViewerId = useRef(viewerId);
  const baseViewerIdRef = useRef(viewerId);
  const currentUsernameRef = useRef("Anonymous");
  const currentProfileRef = useRef("");

  const isMountedRef = useRef(true);
  const streamEndedRef = useRef(false);
  const leftNotificationSentRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const connectPeerRef = useRef(null);

  const connectTimeoutRef = useRef(null);
  const disconnectGraceRef = useRef(null);
  const statsIntervalRef = useRef(null);

  const overlayListRef = useRef(null);

  const [remoteStream, setRemoteStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showChat, setShowChat] = useState(false); // full sidebar starts closed; overlay always shows recent comments
  const [liked, setLiked] = useState(false);
  const [username, setUsername] = useState("Anonymous");
  const [profilePicture, setProfilePicture] = useState("");
  const [connectionState, setConnectionState] = useState("connecting");
  const [streamEnded, setStreamEnded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showEndedOverlay, setShowEndedOverlay] = useState(false);

  // ---- Facebook-style live reaction state ----
  const [viewerCount, setViewerCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [hearts, setHearts] = useState([]);

  // ---- Who you're watching, and for how long ----
  const [broadcasterName, setBroadcasterName] = useState("");
  const [broadcasterAvatar, setBroadcasterAvatar] = useState("");
  const [streamStartTime, setStreamStartTime] = useState(null); // epoch ms, from the broadcaster
  const [liveDuration, setLiveDuration] = useState(0); // seconds, ticked locally

  const [networkIssues, setNetworkIssues] = useState({
    offline: false,
    reconnecting: false,
    weak: false,
  });

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const spinnerAnim = useRef(new Animated.Value(0)).current;
  const bannerAnim = useRef(new Animated.Value(0)).current;

  const bannerInfo = networkIssues.offline
    ? { message: "📡 No internet connection", color: "#D32F2F" }
    : networkIssues.reconnecting
    ? {
        message: `🔄 Reconnecting${
          reconnectAttemptsRef.current > 0
            ? ` (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`
            : ""
        }...`,
        color: "#FF9500",
      }
    : networkIssues.weak
    ? { message: "⚠️ Weak connection", color: "#FF9500" }
    : null;

  useEffect(() => {
    Animated.timing(bannerAnim, {
      toValue: bannerInfo ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [!!bannerInfo]);

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
    outputRange: ["0deg", "360deg"],
  });

  // Auto-scroll the floating comment overlay to the newest message
  useEffect(() => {
    if (messages.length > 0 && overlayListRef.current) {
      setTimeout(() => {
        overlayListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages.length]);

  // ---- Tick the "how long has this been live" clock once we know when the
  // broadcaster actually started. This is purely local math off the broadcaster's
  // reported start time — no server round trip needed every second. ----
  useEffect(() => {
    if (!streamStartTime) return;
    const update = () => {
      setLiveDuration(Math.max(0, Math.floor((Date.now() - streamStartTime) / 1000)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [streamStartTime]);

  // ---- Device network connectivity ----
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!isMountedRef.current) return;
      const offline = state.isConnected === false || state.isInternetReachable === false;
      setNetworkIssues((prev) => ({ ...prev, offline }));
    });
    return () => unsubscribe();
  }, []);

  // ---- Periodic WebRTC quality check ----
  useEffect(() => {
    if (connectionState !== "connected" || !pcRef.current) {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
        statsIntervalRef.current = null;
      }
      return;
    }

    statsIntervalRef.current = setInterval(async () => {
      if (!pcRef.current || !isMountedRef.current) return;
      try {
        const stats = await pcRef.current.getStats();
        let packetsLost = 0;
        let packetsReceived = 0;
        stats.forEach((report) => {
          if (report.type === "inbound-rtp" && report.kind === "video") {
            packetsLost = report.packetsLost || 0;
            packetsReceived = report.packetsReceived || 0;
          }
        });
        const total = packetsLost + packetsReceived;
        const lossRatio = total > 0 ? packetsLost / total : 0;
        if (isMountedRef.current) {
          setNetworkIssues((prev) => ({ ...prev, weak: lossRatio > WEAK_CONNECTION_LOSS_RATIO }));
        }
      } catch (e) {}
    }, 4000);

    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
        statsIntervalRef.current = null;
      }
    };
  }, [connectionState]);

  // ---- Floating heart animation, same visual language as the broadcaster's screen ----
  const createHeartAnimation = () => {
    const heartId = `${Date.now()}-${Math.random()}`;
    const startX = width * 0.85; // hearts rise from near the like button, bottom-right
    const heart = {
      id: heartId,
      startX: startX + (Math.random() - 0.5) * 30,
      scale: new Animated.Value(0),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
    };

    setHearts((prev) => [...prev, heart]);

    const randomX = (Math.random() - 0.5) * 80;

    Animated.sequence([
      Animated.timing(heart.scale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(heart.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(heart.translateY, { toValue: -height * 0.55, duration: 2500, useNativeDriver: true }),
        Animated.timing(heart.translateX, { toValue: randomX, duration: 2500, useNativeDriver: true }),
        Animated.timing(heart.opacity, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setHearts((prev) => prev.filter((h) => h.id !== heartId));
    });
  };

  const handleSignaling = async (msg) => {
    if (!msg) return;
    console.log("📥 Received message:", msg.type);

    if (msg.type === "broadcaster-answer") {
      try {
        await pcRef.current.setRemoteDescription(msg.answer);
        if (isMountedRef.current) {
          setConnectionState("connected");
          setIsConnecting(false);
        }
      } catch (e) {
        console.log("❌ setRemoteDescription failed", e);
      }
    } else if (msg.type === "viewer-count") {
      // Broadcaster.js sends this on every join/leave — mirror it here so
      // viewers see the same live count the broadcaster sees.
      if (isMountedRef.current) setViewerCount(msg.count || 0);
    } else if (msg.type === "broadcaster-info") {
      // Sent once on the broadcaster's mount AND again every time a viewer
      // joins, so this reliably reaches late joiners too.
      if (isMountedRef.current) {
        setBroadcasterName(msg.broadcaster?.name || "Broadcaster");
        setBroadcasterAvatar(msg.broadcaster?.profileImage || "");
        if (msg.streamStartTime) {
          setStreamStartTime(msg.streamStartTime);
        }
      }
    } else if (msg.type === "end-stream") {
      console.log("📴 Stream ended by broadcaster");
      streamEndedRef.current = true;
      clearTimeout(connectTimeoutRef.current);
      clearTimeout(disconnectGraceRef.current);

      if (!isMountedRef.current) return;
      setStreamEnded(true);
      setShowEndedOverlay(true);
      setIsConnecting(false);
      setNetworkIssues({ offline: false, reconnecting: false, weak: false });

      try { pcRef.current?.close(); } catch (e) {}
      try { signaling.current?.close(); } catch (e) {}
      setRemoteStream(null);
      setConnectionState("ended");

      setTimeout(() => {
        Alert.alert(
          "Stream Ended",
          "The broadcaster has ended the live stream. Thank you for watching!",
          [{ text: "OK", onPress: () => { setShowEndedOverlay(false); navigation.goBack(); } }]
        );
      }, 1500);
    } else if (msg.type === "candidate" && msg.viewer_id === myViewerId.current) {
      if (msg.candidate) {
        try {
          await pcRef.current.addIceCandidate(msg.candidate);
        } catch (e) {
          console.log("❌ Failed to add ICE candidate", e);
        }
      }
    } else if (msg.type === "comment-relay") {
      // Skip our own comment coming back — we already added it optimistically
      // in sendComment() the instant the user hit send.
      if (msg.viewer_id === myViewerId.current) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: msg.text,
          username: msg.username || "Anonymous",
          profilePicture: msg.profilePicture || "",
          timestamp: new Date(),
        },
      ]);
    } else if (msg.type === "like-relay") {
      // Reflects everyone's likes, including our own — sendLike() doesn't
      // increment the count locally, so this is the single source of truth
      // and won't double-count.
      if (isMountedRef.current) {
        setLikesCount((prev) => prev + 1);
        createHeartAnimation();
      }
    } else if (msg.type === "viewer-joined") {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: `👋 ${msg.username || "A viewer"} joined the stream`,
          username: "System",
          isSystemMessage: true,
          timestamp: new Date(),
        },
      ]);
    } else if (msg.type === "viewer-left") {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: `👋 ${msg.username || "A viewer"} left the stream`,
          username: "System",
          isSystemMessage: true,
          timestamp: new Date(),
        },
      ]);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    connectPeerRef.current = async (isReconnect = false) => {
      if (!isMountedRef.current || streamEndedRef.current) return;

      if (isReconnect) {
        reconnectAttemptsRef.current += 1;
        if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
          setNetworkIssues((prev) => ({ ...prev, reconnecting: false }));
          if (!streamEndedRef.current) {
            streamEndedRef.current = true;
            setStreamEnded(true);
            setShowEndedOverlay(true);
            setIsConnecting(false);
            setTimeout(() => {
              Alert.alert(
                "📡 Connection Lost",
                "We couldn't reconnect to the stream. Please check your internet connection and try again.",
                [
                  { text: "Go Back", onPress: () => navigation.goBack(), style: "cancel" },
                  {
                    text: "Retry",
                    onPress: () => {
                      streamEndedRef.current = false;
                      reconnectAttemptsRef.current = 0;
                      setStreamEnded(false);
                      setShowEndedOverlay(false);
                      setIsConnecting(true);
                      connectPeerRef.current(false);
                    },
                  },
                ]
              );
            }, 300);
          }
          return;
        }

        setNetworkIssues((prev) => ({ ...prev, reconnecting: true }));
        setIsConnecting(true);
        setRemoteStream(null);

        try { pcRef.current?.close(); } catch (e) {}
        pcRef.current = null;
        try { signaling.current?.close(); } catch (e) {}

        myViewerId.current = `${baseViewerIdRef.current}-r${reconnectAttemptsRef.current}`;
      }

      try {
        await getIceServers();
        if (!isMountedRef.current) return;

        signaling.current = new Signaling(roomName, handleSignaling);
        signaling.current.connect();

        pcRef.current = new RTCPeerConnection({
          ...rtcConfig,
          iceTransportPolicy: "all",
          iceCandidatePoolSize: 10,
          bundlePolicy: "max-bundle",
          rtcpMuxPolicy: "require",
        });

        pcRef.current.onconnectionstatechange = () => {
          const state = pcRef.current?.connectionState;
          if (!isMountedRef.current) return;
          console.log("🔄 Connection State:", state);
          setConnectionState(state);

          if (state === "connected") {
            setIsConnecting(false);
            reconnectAttemptsRef.current = 0;
            clearTimeout(disconnectGraceRef.current);
            setNetworkIssues((prev) => ({ ...prev, reconnecting: false, weak: false }));
          }

          if (state === "disconnected" && !streamEndedRef.current) {
            setNetworkIssues((prev) => ({ ...prev, reconnecting: true }));
            clearTimeout(disconnectGraceRef.current);
            disconnectGraceRef.current = setTimeout(() => {
              if (isMountedRef.current && pcRef.current?.connectionState !== "connected" && !streamEndedRef.current) {
                connectPeerRef.current(true);
              }
            }, DISCONNECT_GRACE_MS);
          }

          if (state === "failed" && !streamEndedRef.current) {
            clearTimeout(disconnectGraceRef.current);
            connectPeerRef.current(true);
          }
        };

        pcRef.current.ontrack = (event) => {
          console.log("🎥 ontrack fired:", event.track.kind);
          if (event.streams && event.streams.length > 0 && isMountedRef.current) {
            setRemoteStream(event.streams[0]);
            setConnectionState("connected");
            setIsConnecting(false);
          }
        };

        pcRef.current.oniceconnectionstatechange = () => {
          if (!isMountedRef.current || !pcRef.current) return;
          console.log("🔄 ICE connection state:", pcRef.current.iceConnectionState);
        };

        pcRef.current.onicecandidate = (e) => {
          if (e.candidate && signaling.current) {
            signaling.current.send({
              type: "candidate",
              candidate: e.candidate,
              streamId,
              viewer_id: myViewerId.current,
            });
          }
        };

        InCallManager.start({ media: "video" });
        InCallManager.setSpeakerphoneOn(true);

        signaling.current.send({
          type: "viewer-joined",
          viewer_id: myViewerId.current,
          username: currentUsernameRef.current,
          profilePicture: currentProfileRef.current,
          streamId,
          timestamp: Date.now(),
        });

        pcRef.current.addTransceiver("video", { direction: "recvonly" });
        pcRef.current.addTransceiver("audio", { direction: "recvonly" });

        const rawOffer = await pcRef.current.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        const offer = { type: rawOffer.type, sdp: preferCodec(rawOffer.sdp, "VP8", "video") };
        await pcRef.current.setLocalDescription(offer);

        signaling.current.send({
          type: "viewer-offer",
          offer,
          streamId,
          viewer_id: myViewerId.current,
          username: currentUsernameRef.current,
          profilePicture: currentProfileRef.current,
        });

        console.log("📤 Sent viewer-offer with ID:", myViewerId.current);

        clearTimeout(connectTimeoutRef.current);
        connectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && pcRef.current?.connectionState !== "connected") {
            setIsConnecting(false);
          }
        }, CONNECT_TIMEOUT_MS);
      } catch (error) {
        console.error("Error connecting to stream:", error);
        if (isMountedRef.current) {
          if (isReconnect) {
            setTimeout(() => connectPeerRef.current(true), 3000);
          } else {
            setIsConnecting(false);
            Alert.alert("Connection Error", "Failed to connect to the stream. Please try again.", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          }
        }
      }
    };

    const init = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsed = JSON.parse(userData);
          currentUsernameRef.current = parsed.name || parsed.username || "Anonymous";
          currentProfileRef.current = parsed.profile_picture || "";
          baseViewerIdRef.current = parsed.id || viewerId;
          if (isMountedRef.current) {
            setUsername(currentUsernameRef.current);
            setProfilePicture(currentProfileRef.current);
          }
        }
        myViewerId.current = baseViewerIdRef.current;
        await connectPeerRef.current(false);
      } catch (error) {
        console.error("Error initializing viewer:", error);
        if (isMountedRef.current) {
          setIsConnecting(false);
          Alert.alert("Connection Error", "Failed to connect to the stream. Please try again.", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }
      }
    };

    init();

    return () => {
      isMountedRef.current = false;

      clearTimeout(connectTimeoutRef.current);
      clearTimeout(disconnectGraceRef.current);
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);

      if (signaling.current && !leftNotificationSentRef.current) {
        leftNotificationSentRef.current = true;
        try {
          signaling.current.send({
            type: "viewer-left",
            viewer_id: myViewerId.current,
            username: currentUsernameRef.current,
            streamId,
            timestamp: Date.now(),
          });
        } catch (e) {}
        setTimeout(() => { signaling.current?.close(); }, 100);
      }

      try { pcRef.current?.close(); } catch (e) {}
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

  const sendComment = async () => {
    if (text.trim() && signaling.current) {
      try {
        signaling.current.send({
          type: "comment",
          text,
          streamId,
          viewer_id: myViewerId.current,
          username,
          profilePicture,
          timestamp: Date.now(),
        });

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text,
            username,
            profilePicture,
            timestamp: new Date(),
            isOwnMessage: true,
          },
        ]);

        setText("");
      } catch (error) {
        console.error("Error in sendComment:", error);
      }
    }
  };

  const sendLike = () => {
    if (!liked) {
      setLiked(true);
      signaling.current?.send({
        type: "like",
        streamId,
        viewer_id: myViewerId.current,
        username,
        timestamp: Date.now(),
      });
      setTimeout(() => setLiked(false), 1000);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatCount = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return `${n}`;
  };

  const chatTranslateX = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });
  const bannerTranslateY = bannerAnim.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] });

  const getRandomColor = (name) => {
    if (!name) return "#555";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    return colors[Math.abs(hash) % colors.length];
  };

  const broadcasterAvatarUri = broadcasterAvatar
    ? broadcasterAvatar.startsWith("http")
      ? broadcasterAvatar
      : `${API_ROUTE_IMAGE}${broadcasterAvatar}`
    : null;

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.isOwnMessage && styles.ownMessageBubble]}>
      <View style={styles.messageHeader}>
        {item.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} style={styles.messageProfileImage} />
        ) : (
          <View style={[styles.messageProfilePlaceholder, { backgroundColor: getRandomColor(item.username) }]}>
            <Text style={styles.messageProfileInitial}>
              {item.username ? item.username.charAt(0).toUpperCase() : "A"}
            </Text>
          </View>
        )}
        <Text style={styles.messageUsername}>{item.username || "Anonymous"}</Text>
        {item.isOwnMessage && <Text style={styles.youTag}>(You)</Text>}
      </View>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  // Facebook-style floating comment row — compact, semi-transparent, no timestamps
  const renderOverlayComment = ({ item }) => (
    <View style={[styles.overlayCommentBubble, item.isSystemMessage && styles.overlaySystemBubble]}>
      <Text style={[styles.overlayCommentUsername, item.isSystemMessage && styles.overlaySystemText]}>
        {item.username}
      </Text>
      <Text style={styles.overlayCommentText} numberOfLines={2}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {bannerInfo && (
          <Animated.View
            style={[styles.banner, { backgroundColor: bannerInfo.color, transform: [{ translateY: bannerTranslateY }] }]}
            pointerEvents="none"
          >
            <Text style={styles.bannerText}>{bannerInfo.message}</Text>
          </Animated.View>
        )}

        {/* Video Stream */}
        <View style={styles.videoContainer}>
          {remoteStream ? (
            <RTCView streamURL={remoteStream.toURL()} style={styles.videoStream} objectFit="cover" zOrder={1} />
          ) : (
            <View style={[styles.videoStream, styles.placeholder]}>
              {isConnecting && (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <ActivityIndicator size="large" color="#FF3B30" />
                </Animated.View>
              )}

              {showEndedOverlay && (
                <View style={styles.endedContainer}>
                  <MaterialIcon name="videocam-off" size={60} color="#FF3B30" />
                  <Text style={styles.endedTitle}>Stream Ended</Text>
                  <Text style={styles.endedSubtitle}>The broadcaster has ended this live stream</Text>
                  <TouchableOpacity
                    style={styles.endedButton}
                    onPress={() => { setShowEndedOverlay(false); navigation.goBack(); }}
                  >
                    <Text style={styles.endedButtonText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isConnecting && !showEndedOverlay && (
                <Text style={styles.placeholderText}>Connecting to stream...</Text>
              )}

              {!isConnecting && !remoteStream && !showEndedOverlay && (
                <Text style={styles.placeholderText}>
                  {connectionState === "failed" ? "Connection failed" : connectionState === "ended" ? "Stream ended" : "Waiting for stream..."}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Floating hearts, same visual language as the broadcaster's own screen */}
        {hearts.map((heart) => (
          <Animated.View
            key={heart.id}
            style={[
              styles.heartContainer,
              {
                left: heart.startX - 25,
                bottom: 140,
                transform: [
                  { scale: heart.scale },
                  { translateY: heart.translateY },
                  { translateX: heart.translateX },
                ],
                opacity: heart.opacity,
              },
            ]}
            pointerEvents="none"
          >
            <Icon name="heart" size={40} color="#ff375f" />
          </Animated.View>
        ))}

        {/* Header — who's live, for how long, and how many are watching */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.streamInfo}>
            <View style={styles.broadcasterRow}>
              {broadcasterAvatarUri ? (
                <Image source={{ uri: broadcasterAvatarUri }} style={styles.broadcasterAvatar} />
              ) : (
                <View
                  style={[
                    styles.broadcasterAvatarPlaceholder,
                    { backgroundColor: getRandomColor(broadcasterName) },
                  ]}
                >
                  <Text style={styles.broadcasterAvatarInitial}>
                    {broadcasterName ? broadcasterName.charAt(0).toUpperCase() : "B"}
                  </Text>
                </View>
              )}

              <View style={styles.broadcasterTextCol}>
                <Text style={styles.broadcasterName} numberOfLines={1}>
                  {broadcasterName || "Live Stream"}
                </Text>
                <View style={styles.liveRow}>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  {streamStartTime ? (
                    <Text style={styles.liveDuration}>{formatDuration(liveDuration)}</Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <Icon name="eye" size={12} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.streamStats}>{formatCount(viewerCount)}</Text>
              <Icon name="heart" size={12} color="#ff375f" style={{ marginLeft: 10, marginRight: 4 }} />
              <Text style={styles.streamStats}>{formatCount(likesCount)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.commentsHeaderButton} onPress={toggleChat}>
            <Icon name="chatbubbles" size={22} color="#fff" />
            {messages.length > 0 && !showChat && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{messages.length > 99 ? "99+" : messages.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Facebook-style floating comment feed, always visible above the input bar */}
        {!showChat && messages.length > 0 && (
          <View style={styles.commentsOverlayContainer} pointerEvents="box-none">
            <FlatList
              ref={overlayListRef}
              data={messages.slice(-OVERLAY_COMMENT_COUNT)}
              keyExtractor={(item) => item.id}
              renderItem={renderOverlayComment}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Full chat sidebar — opened from the header button for scrolling through history */}
        <Animated.View
          style={[styles.chatContainer, { transform: [{ translateX: chatTranslateX }], opacity: slideAnim }]}
          pointerEvents={showChat ? "auto" : "none"}
        >
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Live Chat • {formatCount(viewerCount)} watching</Text>
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
              <TouchableOpacity style={[styles.likeButton, liked && styles.likedButton]} onPress={sendLike}>
                <Icon name={liked ? "heart" : "heart-outline"} size={24} color={liked ? "#FF3B30" : "white"} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.sendButton} onPress={sendComment} disabled={!text.trim()}>
                <Icon name="send" size={20} color={text.trim() ? "#007AFF" : "#666"} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 10,
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },
  bannerText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  videoContainer: { flex: 1, backgroundColor: "#000" },
  videoStream: { flex: 1, backgroundColor: "black" },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" },
  placeholderText: { color: "#666", marginTop: 20, fontSize: 16, fontFamily: "System" },
  heartContainer: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 500,
    elevation: 500,
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 10 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streamInfo: { flex: 1, alignItems: "center", marginHorizontal: 10 },
  broadcasterRow: { flexDirection: "row", alignItems: "center" },
  broadcasterAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  broadcasterAvatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  broadcasterAvatarInitial: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  broadcasterTextCol: { maxWidth: 150 },
  broadcasterName: { color: "#fff", fontSize: 13, fontWeight: "700" },
  liveRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff375f",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#fff", marginRight: 4 },
  liveText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  liveDuration: { color: "#fff", fontSize: 11, fontWeight: "600", marginLeft: 6, opacity: 0.9 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  streamStats: { color: "#fff", fontSize: 12, fontWeight: "600" },
  commentsHeaderButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    position: "relative",
  },
  unreadBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff375f",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  unreadBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  commentsOverlayContainer: {
    position: "absolute",
    left: 12,
    right: 90,
    bottom: 100,
    maxHeight: 180,
    zIndex: 6,
  },
  overlayCommentBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
    maxWidth: "95%",
  },
  overlaySystemBubble: { backgroundColor: "rgba(0,0,0,0.25)" },
  overlayCommentUsername: { color: "#4A9EFF", fontSize: 12, fontWeight: "700" },
  overlaySystemText: { color: "#FFA500" },
  overlayCommentText: { color: "#fff", fontSize: 13, marginTop: 1 },
  chatContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 80 : 100,
    right: 0,
    bottom: 120,
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: "rgba(20,20,20,0.95)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.15)",
    zIndex: 5,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  chatTitle: { color: "white", fontSize: 16, fontWeight: "bold", fontFamily: "System" },
  chatList: { flex: 1 },
  chatContent: { padding: 10, paddingBottom: 20 },
  messageBubble: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "90%",
    alignSelf: "flex-start",
  },
  messageText: { color: "white", fontSize: 14, lineHeight: 18, fontFamily: "System" },
  messageTime: { color: "#A0A0A0", fontSize: 10, marginTop: 4, alignSelf: "flex-end", fontFamily: "System" },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    paddingBottom: Platform.OS === "ios" ? 35 : 15,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    zIndex: 10,
  },
  inputContainer: { flexDirection: "row", alignItems: "flex-end", marginBottom: 15 },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
    maxHeight: 100,
    fontFamily: "System",
    textAlignVertical: "center",
  },
  actionButtons: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  likeButton: { padding: 10, marginRight: 5, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)" },
  likedButton: { backgroundColor: "rgba(255,59,48,0.2)", transform: [{ scale: 1.1 }] },
  sendButton: { padding: 10, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)" },
  messageHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  messageProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  messageProfilePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  messageProfileInitial: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  messageUsername: { color: "#4A9EFF", fontSize: 13, fontWeight: "600", marginRight: 5 },
  youTag: { color: "#666", fontSize: 10, fontStyle: "italic" },
  ownMessageBubble: { backgroundColor: "rgba(74, 158, 255, 0.15)", alignSelf: "flex-end" },
  endedContainer: { alignItems: "center", paddingHorizontal: 30 },
  endedTitle: { color: "#FF3B30", fontSize: 28, fontWeight: "bold", marginTop: 20, fontFamily: "System" },
  endedSubtitle: { color: "#888", fontSize: 16, textAlign: "center", marginTop: 10, fontFamily: "System" },
  endedButton: { marginTop: 30, paddingHorizontal: 40, paddingVertical: 12, backgroundColor: "#FF3B30", borderRadius: 25 },
  endedButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", fontFamily: "System" },
});
