

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   Image,
//   AppState,
//   BackHandler,
//   Alert,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { RTCPeerConnection, mediaDevices, RTCView } from "react-native-webrtc";
// import Icon from "react-native-vector-icons/Ionicons";
// import IconMaterial from "react-native-vector-icons/MaterialIcons";
// import InCallManager from "react-native-incall-manager";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Signaling from "./signaling";
// import { rtcConfig, getIceServers } from "./rtcConfig";
// import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";

// const { width, height } = Dimensions.get("window");

// export default function Broadcaster({ route, navigation }) {
//   const { roomName, streamId } = route.params;

//   const signaling = useRef(null);
//   const localStream = useRef(null);
//   const peerConnections = useRef({});
//   const likeAnimation = useRef(new Animated.Value(0)).current;
//   const [localStreamState, setLocalStreamState] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFrontCamera, setIsFrontCamera] = useState(true);
//   const [speakerOn, setSpeakerOn] = useState(true);
//   const [viewerCount, setViewerCount] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [likes, setLikes] = useState(0);
//   const [showControls, setShowControls] = useState(true);
//   const [hearts, setHearts] = useState([]);
//   const [broadcasterData, setBroadcasterData] = useState({ name: "", profileImage: "" });
//   const [isStreamEnding, setIsStreamEnding] = useState(false);
//   const [streamError, setStreamError] = useState(null);
  
//   // Track app state for background/foreground
//   const appState = useRef(AppState.currentState);
//   const streamEndedRef = useRef(false);
//   const endStreamTimeoutRef = useRef(null);

 
//   const endStream = async (reason = "manual") => {
//     // Prevent multiple end stream calls
//     if (streamEndedRef.current || isStreamEnding) return;
    
//     streamEndedRef.current = true;
//     setIsStreamEnding(true);
    
//     console.log(`[Broadcaster] Ending stream - Reason: ${reason}`);

//     try {
//       // Clear any pending timeout
//       if (endStreamTimeoutRef.current) {
//         clearTimeout(endStreamTimeoutRef.current);
//       }

//       // Notify signaling server
//       if (signaling.current) {
//         try {
//           signaling.current.send({ 
//             type: "end-stream", 
//             streamId,
//             reason 
//           });
//           signaling.current.close();
//         } catch (e) {
//           console.warn("Error closing signaling:", e);
//         }
//       }

//       // Stop all local media tracks
//       if (localStream.current) {
//         try {
//           localStream.current.getTracks().forEach(track => {
//             track.stop();
//             track.enabled = false;
//           });
//           localStream.current = null;
//           setLocalStreamState(null);
//         } catch (e) {
//           console.warn("Error stopping tracks:", e);
//         }
//       }

//       // Close all peer connections
//       Object.values(peerConnections.current).forEach(pc => {
//         try {
//           pc.close();
//         } catch (e) {
//           console.warn("Error closing peer connection:", e);
//         }
//       });
//       peerConnections.current = {};

//       // Stop InCallManager
//       try {
//         InCallManager.stop();
//         InCallManager.setKeepScreenOn(false);
//         InCallManager.setSpeakerphoneOn(false);
//         if (Platform.OS === 'ios') {
//           InCallManager.setForceSpeakerphoneOn(false);
//         }
//       } catch (e) {
//         console.warn("Error stopping InCallManager:", e);
//       }

//       // Notify backend that stream ended
//       try {
//         const token = await AsyncStorage.getItem("userToken");
//         if (token) {
//           const response = await fetch(`${API_ROUTE}/live-streams/end/`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               stream_id: streamId,
//               ended_by: reason,
//             }),
//           });

//           if (!response.ok) {
//             console.warn("[Broadcaster] Backend end stream warning:", await response.json());
//           } else {
//             console.log("[Broadcaster] Stream ended successfully in backend");
//           }
//         }
//       } catch (err) {
//         console.warn("[Broadcaster] Failed to notify backend of stream end:", err);
//       }

//       // Small delay to ensure cleanup completes
//       setTimeout(() => {
//         navigation.goBack();
//       }, 300);
      
//     } catch (err) {
//       console.warn("[Broadcaster] Error during stream cleanup:", err);
//       navigation.goBack();
//     }
//   };

//   // Send broadcaster live data to backend
//   const sendBroadcasterLiveData = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       if (!token) {
//         console.warn("[Broadcaster] No token available");
//         return;
//       }
      
//       await fetch(`${API_ROUTE}/live-streams/start/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, 
//         },
//         body: JSON.stringify({
//           stream_id: streamId,
//           title: "My Live Stream",
//         }),
//       });
//       console.log("[Broadcaster] Live data sent to backend",);
//     } catch (err) {
//       console.warn("[Broadcaster] Failed to send live data", err);
//     }
//   };

//   // Handle back button press
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       Alert.alert(
//         "End Live Stream",
//         "Are you sure you want to end your live stream?",
//         [
//           { text: "Cancel", style: "cancel", onPress: () => {} },
//           { text: "End Stream", style: "destructive", onPress: () => endStream("back_button") }
//         ]
//       );
//       return true; // Prevent default back behavior
//     });

//     return () => backHandler.remove();
//   }, []);

  
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('beforeRemove', (e) => {
//       if (streamEndedRef.current) {
       
//         return;
//       }

//       // Prevent default navigation
//       e.preventDefault();

//       Alert.alert(
//         "End Live Stream",
//         "Are you sure you want to end your live stream?",
//         [
//           { text: "Cancel", style: "cancel", onPress: () => {} },
//           { text: "End Stream", style: "destructive", onPress: () => endStream("navigation") }
//         ]
//       );
//     });

//     return unsubscribe;
//   }, [navigation]);

//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextAppState) => {
//       if (
//         appState.current.match(/inactive|background/) && 
//         nextAppState === 'active'
//       ) {
        
//         console.log('[Broadcaster] App has come to foreground');
//         // Clear any pending timeout
//         if (endStreamTimeoutRef.current) {
//           clearTimeout(endStreamTimeoutRef.current);
//         }
//       } else if (
//         appState.current === 'active' && 
//         nextAppState.match(/inactive|background/)
//       ) {
//         // App went to background
//         console.log('[Broadcaster] App went to background');
        
//         // Set a timeout to end stream if app stays in background too long (e.g., 30 seconds)
//         endStreamTimeoutRef.current = setTimeout(() => {
//           if (!streamEndedRef.current) {
//             console.log('[Broadcaster] Auto-ending stream due to extended background time');
//             endStream("background_timeout");
//           }
//         }, 30000); // 30 seconds
//       }
      
//       appState.current = nextAppState;
//     });

//     return () => {
//       subscription.remove();
//       if (endStreamTimeoutRef.current) {
//         clearTimeout(endStreamTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Handle cleanup on component unmount (phone shutdown, app close)
//   useEffect(() => {
//     return () => {
//       // This runs when component unmounts (app closes, phone shuts down)
//       if (!streamEndedRef.current) {
//         console.log('[Broadcaster] Component unmounting, ending stream');
//         // Use a synchronous approach for unmount
//         try {
//           if (signaling.current) {
//             try {
//               signaling.current.send({ type: "end-stream", streamId });
//             } catch (e) {}
//           }
          
//           // Stop all tracks
//           if (localStream.current) {
//             localStream.current.getTracks().forEach(track => {
//               try {
//                 track.stop();
//               } catch (e) {}
//             });
//           }
          
//           // Close all peer connections
//           Object.values(peerConnections.current).forEach(pc => {
//             try {
//               pc.close();
//             } catch (e) {}
//           });
          
//           // Notify backend (fire and forget)
//           AsyncStorage.getItem("userToken").then(token => {
//             if (token) {
//               fetch(`${API_ROUTE}/live-streams/end/`, {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   "Authorization": `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                   stream_id: streamId,
//                   ended_by: "app_close",
//                 }),
//               }).catch(() => {});
//             }
//           }).catch(() => {});
          
//         } catch (e) {
//           console.warn("[Broadcaster] Error during unmount cleanup:", e);
//         }
//       }
//     };
//   }, []);

//   // Fetch broadcaster data from AsyncStorage
//   useEffect(() => {
//     const fetchBroadcasterData = async () => {
//       console.log("Fetching broadcaster data...");
//       try {
//         const userData = await AsyncStorage.getItem("userData");
//         if (userData) {
//           const parsedData = JSON.parse(userData);
//           const broadcaster = {
//             name: parsedData.name || "Broadcaster",
//             profileImage: parsedData.profile_picture || "",
//           };
//           console.log('broadcaster_details', broadcaster);
//           setBroadcasterData(broadcaster);

//           // Send broadcaster info to signaling for viewers
//           if (signaling.current) {
//             signaling.current.send({
//               type: "broadcaster-info",
//               streamId,
//               broadcaster,
//             });
//           }

//           // Send broadcaster live info to backend
//           await sendBroadcasterLiveData(broadcaster);
//         }
//       } catch (err) {
//         console.warn("Error fetching broadcaster data:", err);
//       }
//     };

//     fetchBroadcasterData();
//   }, []);

//   // Heart animation function
//   const createHeartAnimation = () => {
//     const heartId = Date.now().toString();
//     const heartPositions = [
//       { x: width * 0.3, y: height },
//       { x: width * 0.5, y: height },
//       { x: width * 0.7, y: height },
//       { x: width * 0.4, y: height },
//       { x: width * 0.6, y: height },
//     ];

//     const newHearts = heartPositions.map((position, index) => ({
//       id: `${heartId}-${index}`,
//       position,
//       scale: new Animated.Value(0),
//       opacity: new Animated.Value(1),
//       translateY: new Animated.Value(0),
//       translateX: new Animated.Value(0),
//     }));

//     setHearts((prev) => [...prev, ...newHearts]);

//     newHearts.forEach((heart, index) => {
//       const randomX = (Math.random() - 0.5) * 100;
//       const randomDelay = index * 100;

//       setTimeout(() => {
//         Animated.sequence([
//           Animated.timing(heart.scale, {
//             toValue: 1.2,
//             duration: 200,
//             useNativeDriver: true,
//           }),
//           Animated.timing(heart.scale, {
//             toValue: 1,
//             duration: 100,
//             useNativeDriver: true,
//           }),
//           Animated.parallel([
//             Animated.timing(heart.translateY, {
//               toValue: -height * 0.7,
//               duration: 3000,
//               useNativeDriver: true,
//             }),
//             Animated.timing(heart.translateX, {
//               toValue: randomX,
//               duration: 3000,
//               useNativeDriver: true,
//             }),
//             Animated.timing(heart.opacity, {
//               toValue: 0,
//               duration: 3000,
//               useNativeDriver: true,
//             }),
//           ]),
//         ]).start(() => {
//           setHearts((prev) => prev.filter((h) => h.id !== heart.id));
//         });
//       }, randomDelay);
//     });
//   };

//   // Like counter animation
//   const animateLikeCounter = () => {
//     Animated.sequence([
//       Animated.timing(likeAnimation, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(likeAnimation, {
//         toValue: 0,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   // Callback for signaling messages
//   // const onSignalingMessage = async (msg) => {
//   //   if (!msg || !msg.type) return;

//   //   if (msg.type === "viewer-count") {
//   //     setViewerCount(msg.count);
//   //   } else if (msg.type === "comment") {
//   //     setComments((prev) => [
//   //       ...prev,
//   //       {
//   //         id: Date.now().toString(),
//   //         text: msg.text,
//   //         viewerId: msg.viewer_id,
//   //         viewerName: msg.viewerusername || "Anonymous",
//   //         viewerProfileImage: msg.viewerProfileImage || "",
//   //         timestamp: new Date(),
//   //       },
//   //     ]);
//   //   } else if (msg.type === "like") {
//   //     setLikes((prev) => prev + 1);
//   //     animateLikeCounter();
//   //     createHeartAnimation();
//   //   }

//   //   if (msg.type === "viewer-offer") {
//   //     const viewerId = msg.viewer_id;
//   //     let pc = peerConnections.current[viewerId];
//   //     if (!pc) {
//   //       pc = new RTCPeerConnection(rtcConfig);
//   //       peerConnections.current[viewerId] = pc;

//   //       pc.onicecandidate = (e) => {
//   //         if (e.candidate) {
//   //           signaling.current.send({
//   //             type: "candidate",
//   //             candidate: e.candidate,
//   //             streamId,
//   //             viewer_id: viewerId,
//   //           });
//   //         }
//   //       };

//   //       if (localStream.current) {
//   //         localStream.current.getTracks().forEach((t) => pc.addTrack(t, localStream.current));
//   //       }
//   //     }

//   //     if (!pc.remoteDescription) {
//   //       await pc.setRemoteDescription(msg.offer);
//   //       const answer = await pc.createAnswer();
//   //       await pc.setLocalDescription(answer);

//   //       signaling.current.send({
//   //         type: "broadcaster-answer",
//   //         streamId,
//   //         viewer_id: viewerId,
//   //         answer,
//   //       });
//   //     }
//   //   } else if (msg.type === "candidate" && msg.viewer_id) {
//   //     const pc = peerConnections.current[msg.viewer_id];
//   //     if (pc && msg.candidate) {
//   //       try {
//   //         await pc.addIceCandidate(msg.candidate);
//   //       } catch (err) {
//   //         console.warn("[Broadcaster] addIceCandidate error", err);
//   //       }
//   //     }
//   //   }
//   // };

//   // Callback for signaling messages
// // Callback for signaling messages
// const onSignalingMessage = async (msg) => {
//   if (!msg || !msg.type) return;

//   console.log('📥 Received message:', msg.type, msg);

//   // Handle viewer count updates
//   if (msg.type === "viewer-count") {
//     setViewerCount(msg.count);
//   } 
//   // Handle comments
//   else if (msg.type === "comment") {
//     console.log('💬 New comment:', {
//       from: msg.username,
//       text: msg.text,
//       viewerId: msg.viewer_id
//     });
    
//     setComments((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         text: msg.text,
//         viewerId: msg.viewer_id,
//         viewerName: msg.username || "Anonymous",
//         viewerProfileImage: msg.profilePicture || "",
//         timestamp: new Date(),
//       },
//     ]);
//   } 
//   // Handle likes
//   else if (msg.type === "like") {
//     setLikes((prev) => prev + 1);
//     animateLikeCounter();
//     createHeartAnimation();
//   } 
//   // Handle viewer joined
//   else if (msg.type === "viewer-joined") {
//     console.log('👋 Viewer joined:', {
//       username: msg.username,
//       viewerId: msg.viewer_id
//     });
    
//     // Increment viewer count
//     setViewerCount(prev => prev + 1);
    
//     // Add system message to comments
//     setComments((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         text: `👋 ${msg.username || 'A viewer'} joined the stream`,
//         viewerId: msg.viewer_id,
//         viewerName: 'System',
//         isSystemMessage: true,
//         timestamp: new Date(),
//       },
//     ]);
//   } 
//   // Handle viewer left
//   else if (msg.type === "viewer-left") {
//     console.log('👋 Viewer left:', {
//       username: msg.username,
//       viewerId: msg.viewer_id
//     });
    
//     // Decrement viewer count (ensure it doesn't go below 0)
//     setViewerCount(prev => Math.max(0, prev - 1));
    
//     // Add system message to comments
//     setComments((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         text: `👋 ${msg.username || 'A viewer'} left the stream`,
//         viewerId: msg.viewer_id,
//         viewerName: 'System',
//         isSystemMessage: true,
//         timestamp: new Date(),
//       },
//     ]);
//   }

//   // WebRTC signaling handlers (offers and candidates)
//   if (msg.type === "viewer-offer") {
//     const viewerId = msg.viewer_id;
//     let pc = peerConnections.current[viewerId];
//     if (!pc) {
//       console.log('🎥 Creating new peer connection for viewer:', viewerId);
//       pc = new RTCPeerConnection(rtcConfig);
//       peerConnections.current[viewerId] = pc;

//       pc.onicecandidate = (e) => {
//         if (e.candidate) {
//           signaling.current.send({
//             type: "candidate",
//             candidate: e.candidate,
//             streamId,
//             viewer_id: viewerId,
//           });
//         }
//       };

//       // Add local stream tracks to peer connection
//       if (localStream.current) {
//         localStream.current.getTracks().forEach((t) => {
//           pc.addTrack(t, localStream.current);
//         });
//       }
//     }

//     if (!pc.remoteDescription) {
//       console.log('📞 Setting remote description and creating answer for viewer:', viewerId);
//       await pc.setRemoteDescription(msg.offer);
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);

//       signaling.current.send({
//         type: "broadcaster-answer",
//         streamId,
//         viewer_id: viewerId,
//         answer,
//       });
//     }
//   } 
//   // Handle ICE candidates
//   else if (msg.type === "candidate" && msg.viewer_id) {
//     const pc = peerConnections.current[msg.viewer_id];
//     if (pc && msg.candidate) {
//       try {
//         console.log('❄️ Adding ICE candidate for viewer:', msg.viewer_id);
//         await pc.addIceCandidate(msg.candidate);
//       } catch (err) {
//         console.warn("[Broadcaster] addIceCandidate error:", err);
//       }
//     }
//   }
// };

//   // Initialize media and signaling
//   // useEffect(() => {
//   //   let mounted = true;

//   //   const initializeStream = async () => {
//   //     try {
//   //       // First, get ICE servers
//   //       await getIceServers();

//   //       // Configure audio mode based on platform
//   //       try {
//   //         InCallManager.start({ media: 'video' });
          
//   //         if (Platform.OS === 'android') {
//   //           InCallManager.setSpeakerphoneOn(true);
//   //         } else {
//   //           // iOS specific
//   //           InCallManager.setForceSpeakerphoneOn(true);
//   //         }
//   //         InCallManager.setKeepScreenOn(true);
//   //       } catch (err) {
//   //         console.warn("[Broadcaster] InCallManager setup error:", err);
//   //       }

//   //       // Get user media
//   //       const stream = await mediaDevices.getUserMedia({
//   //         audio: true,
//   //         video: {
//   //           facingMode: isFrontCamera ? "user" : "environment",
//   //           width: 1280,
//   //           height: 720,
//   //           frameRate: 30,
//   //         },
//   //       });

//   //       if (!mounted) {
//   //         stream.getTracks().forEach((t) => t.stop());
//   //         return;
//   //       }

//   //       localStream.current = stream;
//   //       setLocalStreamState(stream);
//   //       setStreamError(null);

//   //       // Initialize signaling
//   //       signaling.current = new Signaling(roomName, onSignalingMessage);
//   //       await signaling.current.connect();

//   //       signaling.current.send({
//   //         type: "start-stream",
//   //         streamId,
//   //         streamInfo: { id: streamId },
//   //       });

//   //     } catch (err) {
//   //       console.warn("[Broadcaster] getUserMedia failed", err);
//   //       setStreamError(err.message || "Failed to access camera/microphone");
        
//   //       Alert.alert(
//   //         "Stream Error",
//   //         "Could not access camera or microphone. Please check permissions and try again.",
//   //         [
//   //           { text: "OK", onPress: () => navigation.goBack() }
//   //         ]
//   //       );
//   //     }
//   //   };

//   //   initializeStream();

//   //   return () => {
//   //     mounted = false;
//   //     // Already handled in the unmount effect above
//   //   };
//   // }, []);

//   useEffect(() => {
//   let mounted = true;
//   let connectionTimeout = null;

//   const initializeStream = async () => {
//     try {
//       // First, get ICE servers
//       await getIceServers();

//       // Configure audio mode based on platform
//       try {
//         InCallManager.start({ media: 'video' });
        
//         if (Platform.OS === 'android') {
//           InCallManager.setSpeakerphoneOn(true);
//         } else {
//           // iOS specific
//           InCallManager.setForceSpeakerphoneOn(true);
//         }
//         InCallManager.setKeepScreenOn(true);
//       } catch (err) {
//         console.warn("[Broadcaster] InCallManager setup error:", err);
//       }

//       // Get user media
//       const stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: {
//           facingMode: isFrontCamera ? "user" : "environment",
//           width: 1280,
//           height: 720,
//           frameRate: 30,
//         },
//       });

//       if (!mounted) {
//         stream.getTracks().forEach((t) => t.stop());
//         return;
//       }

//       localStream.current = stream;
//       setLocalStreamState(stream);
//       setStreamError(null);

//       // Initialize signaling with retry logic
//       signaling.current = new Signaling(roomName, onSignalingMessage);
      
//       // Add connection timeout
//       connectionTimeout = setTimeout(() => {
//         if (!signaling.current?.isOpen && mounted) {
//           console.warn("[Broadcaster] Signaling connection timeout");
//           setStreamError("Connection timeout. Please check your internet and try again.");
          
//           Alert.alert(
//             "Connection Error",
//             "Failed to connect to streaming server. Please check your internet connection.",
//             [
//               { text: "OK", onPress: () => navigation.goBack() }
//             ]
//           );
//         }
//       }, 10000); // 10 second timeout

//       // Connect to signaling server
//       await signaling.current.connect();

//       // Wait a moment for connection to fully establish
//       setTimeout(() => {
//         if (mounted && signaling.current?.isOpen) {
//           console.log("[Broadcaster] Sending start-stream message");
          
//           signaling.current.send({
//             type: "start-stream",
//             streamId,
//             streamInfo: { 
//               id: streamId,
//               broadcasterId: viewerId, // Make sure to pass viewerId if needed
//             },
//           });

//           // Clear timeout since connection succeeded
//           if (connectionTimeout) {
//             clearTimeout(connectionTimeout);
//             connectionTimeout = null;
//           }
//         } else if (mounted) {
//           console.warn("[Broadcaster] Connection not open when trying to send start-stream");
//         }
//       }, 1000);

//     } catch (err) {
//       console.warn("[Broadcaster] Initialization failed:", err);
      
//       if (mounted) {
//         setStreamError(err.message || "Failed to initialize stream");
        
//         Alert.alert(
//           "Stream Error",
//           err.message || "Could not access camera or microphone. Please check permissions and try again.",
//           [
//             { text: "OK", onPress: () => navigation.goBack() }
//           ]
//         );
//       }
//     }
//   };

//   initializeStream();

//   return () => {
//     mounted = false;
    
//     // Clear any pending timeouts
//     if (connectionTimeout) {
//       clearTimeout(connectionTimeout);
//     }
    
//     // Cleanup is already handled in the main unmount effect
//     console.log("[Broadcaster] Cleanup in initialization effect");
//   };
// }, []); // Keep empty dependency array as this should only run once

//   // Control functions
//   const toggleMute = () => {
//     if (localStream.current) {
//       const newMuted = !isMuted;
//       localStream.current.getAudioTracks().forEach((t) => (t.enabled = !newMuted));
//       setIsMuted(newMuted);
//     }
//   };

//   const switchCamera = () => {
//     if (localStream.current) {
//       localStream.current.getVideoTracks().forEach((t) => {
//         if (t._switchCamera) {
//           t._switchCamera();
//         }
//       });
//       setIsFrontCamera(!isFrontCamera);
//     }
//   };

//   const toggleSpeaker = () => {
//     const newSpeakerState = !speakerOn;
//     try {
//       InCallManager.setSpeakerphoneOn(newSpeakerState);
//       if (Platform.OS === 'ios') {
//         InCallManager.setForceSpeakerphoneOn(newSpeakerState);
//       }
//     } catch (err) {
//       console.warn("Error toggling speaker:", err);
//     }
//     setSpeakerOn(newSpeakerState);
//   };

//   // Helper function to generate consistent colors based on username
// const getRandomColor = (name) => {
//   if (!name) return '#555';
  
//   // Generate a hash from the name
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
  
//   // Convert to hex color
//   const colors = [
//     '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
//     '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
//   ];
  
//   return colors[Math.abs(hash) % colors.length];
// };

//   const toggleControls = () => {
//     setShowControls(!showControls);
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   // Show confirmation alert when trying to end stream
//   const confirmEndStream = () => {
//     Alert.alert(
//       "End Live Stream",
//       "Are you sure you want to end your live stream?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "End Stream", style: "destructive", onPress: () => endStream("manual") }
//       ]
//     );
//   };

//   // If there's a stream error, show error screen
//   if (streamError) {
//     return (
//       <View style={[styles.container, styles.placeholder]}>
//         <IconMaterial name="error-outline" size={60} color="#ff375f" />
//         <Text style={[styles.placeholderText, { fontSize: 18, marginTop: 20 }]}>
//           Stream Error
//         </Text>
//         <Text style={[styles.placeholderText, { fontSize: 14, marginTop: 10, textAlign: 'center' }]}>
//           {streamError}
//         </Text>
//         <TouchableOpacity 
//           style={[styles.controlButton, { marginTop: 30, paddingHorizontal: 30 }]}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={{ color: '#fff', fontSize: 16 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Video Stream */}
//       {localStreamState ? (
//         <RTCView
//           streamURL={localStreamState.toURL()}
//           style={styles.videoStream}
//           objectFit="cover"
//           mirror={isFrontCamera}
//         />
//       ) : (
//         <View style={[styles.videoStream, styles.placeholder]}>
//           <IconMaterial name="live-tv" size={60} color="#666" />
//           <Text style={styles.placeholderText}>Starting stream...</Text>
//         </View>
//       )}

//       {/* Floating Hearts Animation */}
//       {hearts.map((heart) => (
//         <Animated.View
//           key={heart.id}
//           style={[
//             styles.heartContainer,
//             {
//               left: heart.position.x - 25,
//               top: heart.position.y - 25,
//               transform: [
//                 { scale: heart.scale },
//                 { translateY: heart.translateY },
//                 { translateX: heart.translateX },
//               ],
//               opacity: heart.opacity,
//             },
//           ]}
//         >
//           <Icon name="heart" size={50} color="#ff375f" />
//         </Animated.View>
//       ))}

//       {/* Tap to show/hide controls */}
//       <TouchableOpacity style={styles.tapArea} onPress={toggleControls} activeOpacity={1} />

//       {/* Header Section */}
//       {showControls && (
//         <SafeAreaView style={styles.header}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity style={styles.backButton} onPress={confirmEndStream}>
//               <Icon name="chevron-back" size={24} color="#fff" />
//             </TouchableOpacity>

//             <View style={styles.streamInfo}>
//               <View style={styles.liveBadge}>
//                 <View style={styles.liveDot} />
//                 <Text style={styles.liveText}>You are LIVE</Text>
//               </View>
//               <Text style={styles.streamStats}>
//                 {viewerCount} viewers • {likes} likes
//               </Text>
//             </View>

//             <View style={styles.space} />
//           </View>
//         </SafeAreaView>
//       )}

//       {/* Live Stats Floating Card */}
//       {showControls && (
//         <View style={styles.statsCard}>
//           <View style={styles.statItem}>
//             <Icon name="people" size={16} color="#fff" />
//             <Text style={styles.statText}>{viewerCount}</Text>
//           </View>
//           <Animated.View
//             style={[
//               styles.statItem,
//               {
//                 transform: [
//                   {
//                     scale: likeAnimation.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [1, 1.3],
//                     }),
//                   },
//                 ],
//               },
//             ]}
//           >
//             <Icon name="heart" size={16} color="#ff375f" />
//             <Text style={[styles.statText, styles.likeCount]}>{likes}</Text>
//           </Animated.View>
//           <View style={styles.statItem}>
//             <Icon name="chatbubble" size={16} color="#fff" />
//             <Text style={styles.statText}>{comments.length}</Text>
//           </View>
//         </View>
//       )}

//       {/* Comments Sidebar */}
//       {/* Comments Sidebar */}
// {showControls && (
//   <View style={styles.commentsContainer}>
//     <FlatList
//       data={comments.slice(-10)}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => (
//         <View style={styles.commentBubble}>
//           <View style={styles.commentHeader}>
//             {item.viewerProfileImage ? (
//               <Image
//                 source={{ uri: item.viewerProfileImage.startsWith('http') 
//                   ? item.viewerProfileImage 
//                   : `${API_ROUTE_IMAGE}${item.viewerProfileImage}`}}
//                 style={styles.viewerImage}
//               />
//             ) : (
//               <View style={[styles.viewerImagePlaceholder, { backgroundColor: getRandomColor(item.viewerName) }]}>
//                 <Text style={styles.viewerInitial}>
//                   {item.viewerName ? item.viewerName.charAt(0).toUpperCase() : 'A'}
//                 </Text>
//               </View>
//             )}
//             <Text style={styles.viewerName}>{item.viewerName}</Text>
//           </View>
//           <Text style={styles.commentText}>{item.text}</Text>
//           <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
//         </View>
//       )}
//       style={styles.commentsList}
//       contentContainerStyle={styles.commentsContent}
//       showsVerticalScrollIndicator={false}
//       inverted
//     />
//   </View>
// )}

//       {/* Controls Bar =====*/}
//       {showControls && (
//         <View style={styles.controlsBar}>
//           <TouchableOpacity
//             style={[styles.controlButton, isMuted && styles.controlButtonActive]}
//             onPress={toggleMute}
//           >
//             <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.controlButton, styles.endButton]}
//             onPress={confirmEndStream}
//           >
//             <Icon name="close" size={24} color="#fff" />
//             <Text style={styles.endButtonText}>End Stream</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={[styles.controlButton]} onPress={switchCamera}>
//             <Icon name="camera-reverse" size={24} color="#fff" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.controlButton, speakerOn && styles.controlButtonActive]}
//             onPress={toggleSpeaker}
//           >
//             <Icon
//               name={speakerOn ? "volume-high" : "volume-mute"}
//               size={24}
//               color="#fff"
//             />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   videoStream: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },

// commentBubble: {
//   backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   borderRadius: 12,
//   padding: 10,
//   marginBottom: 8,
//   borderLeftWidth: 3,
//   borderLeftColor: '#4A9EFF', // You can make this dynamic based on user
// },
// commentHeader: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   marginBottom: 4,
// },
// viewerImage: {
//   width: 30,
//   height: 30,
//   borderRadius: 15,
//   marginRight: 8,
//   borderWidth: 1,
//   borderColor: 'rgba(255,255,255,0.3)',
// },
// viewerImagePlaceholder: {
//   width: 30,
//   height: 30,
//   borderRadius: 15,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginRight: 8,
//   borderWidth: 1,
//   borderColor: 'rgba(255,255,255,0.3)',
// },
// viewerInitial: {
//   color: '#fff',
//   fontSize: 16,
//   fontWeight: 'bold',
// },
// viewerName: {
//   color: '#4A9EFF', // Bright blue for usernames
//   fontSize: 14,
//   fontWeight: 'bold',
//   flex: 1,
// },
// commentText: {
//   color: '#fff',
//   fontSize: 14,
//   lineHeight: 18,
//   marginLeft: 38, // Align with the text after the profile image
//   marginTop: 2,
// },
// commentTime: {
//   color: 'rgba(255,255,255,0.5)',
//   fontSize: 10,
//   marginTop: 4,
//   marginLeft: 38, // Align with the text
// },
//   placeholder: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//   },
//   placeholderText: {
//     color: "#666",
//     marginTop: 10,
//     fontSize: 16,
//   },
//   heartContainer: {
//     position: "absolute",
//     width: 50,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     elevation: 1000,
//     shadowColor: "#ff375f",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//   },
//   tapArea: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1,
//   },
//   header: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//   },
//   headerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   backButton: {
//     padding: 8,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 20,
//   },
//   streamInfo: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   broadcasterInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   broadcasterImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   broadcasterImagePlaceholder: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#555",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   broadcasterInitial: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   broadcasterName: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   liveBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,0,0,0.8)",
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: "flex-start",
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#fff",
//     marginRight: 6,
//   },
//   liveText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "bold",
//   },
//   streamStats: {
//     color: "#fff",
//     fontSize: 12,
//     marginTop: 4,
//     opacity: 0.8,
//   },
//   space: {
//     width: 40,
//   },
//   statsCard: {
//     position: "absolute",
//     top: 100,
//     right: 20,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     borderRadius: 30,
//     padding: 12,
//     zIndex: 10,
//   },
//   statItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 4,
//   },
//   statText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   likeCount: {
//     color: "#ff375f",
//   },
//   commentsContainer: {
//     position: "absolute",
//     left: 20,
//     top: 100,
//     bottom: 120,
//     width: 280,
//     borderRadius: 15,
//     padding: 15,
//     zIndex: 10,
//   },
//   commentsList: {
//     flex: 1,
//   },
//   commentsContent: {
//     paddingBottom: 10,
//   },
//   commentBubble: {
//     padding: 10,
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   commentHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   viewerImage: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     marginRight: 8,
//   },
//   viewerImagePlaceholder: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#555",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   viewerInitial: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   viewerName: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   commentText: {
//     color: "#fff",
//     fontSize: 14,
//     lineHeight: 18,
//   },
//   commentTime: {
//     color: "rgba(255,255,255,0.6)",
//     fontSize: 10,
//     marginTop: 4,
//   },
//   controlsBar: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.7)",
//     borderRadius: 50,
//     padding: 15,
//     zIndex: 10,
//   },
//   controlButton: {
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.1)",
//   },
//   controlButtonActive: {
//     backgroundColor: "rgba(255,55,95,0.3)",
//   },
//   endButton: {
//     backgroundColor: "#ff375f",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   endButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 6,
//   },
// });

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  AppState,
  BackHandler,
  Alert,
  Platform,
  Modal,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RTCPeerConnection, mediaDevices, RTCView } from "react-native-webrtc";
import Icon from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import InCallManager from "react-native-incall-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Signaling from "./signaling";
import { rtcConfig, getIceServers } from "./rtcConfig";
import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";

const { width, height } = Dimensions.get("window");
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.7;
const BOTTOM_SHEET_MIN_HEIGHT = 0;

export default function Broadcaster({ route, navigation }) {
  const { roomName, streamId } = route.params;

  const signaling = useRef(null);
  const localStream = useRef(null);
  const peerConnections = useRef({});
  const likeAnimation = useRef(new Animated.Value(0)).current;
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
  const [localStreamState, setLocalStreamState] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hearts, setHearts] = useState([]);
  const [broadcasterData, setBroadcasterData] = useState({ name: "", profileImage: "" });
  const [isStreamEnding, setIsStreamEnding] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const [showCommentsSheet, setShowCommentsSheet] = useState(false);
  const [unreadComments, setUnreadComments] = useState(0);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showCommentActions, setShowCommentActions] = useState(false);
  
  // Track app state for background/foreground
  const appState = useRef(AppState.currentState);
  const streamEndedRef = useRef(false);
  const endStreamTimeoutRef = useRef(null);

  // Pan responder for bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // Dragging down
          const newValue = Math.max(0, 1 - gestureState.dy / 300);
          bottomSheetAnimation.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Close the sheet
          closeCommentsSheet();
        } else {
          // Reopen the sheet
          openCommentsSheet();
        }
      },
    })
  ).current;

  const openCommentsSheet = () => {
    setShowCommentsSheet(true);
    setUnreadComments(0);
    Animated.timing(bottomSheetAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeCommentsSheet = () => {
    Animated.timing(bottomSheetAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCommentsSheet(false);
    });
  };


  // Initialize media and signaling with audio focus
// useEffect(() => {
//     let mounted = true;
//     let connectionTimeout = null;

//     const initializeStream = async () => {
//       try {
//         await getIceServers();

//         // Configure audio for streaming with proper focus
//         try {
//           // Remove the problematic ringback setting
//           InCallManager.start({ 
//             media: 'video',  // Just use 'video' instead of 'audio' for streaming
//             auto: true,
//             // Remove ringback: '_stream_' - this was causing the ringing
//           });
          
//           // Configure speaker for broadcast (not call)
//           if (Platform.OS === 'android') {
//             InCallManager.setSpeakerphoneOn(true);
//             InCallManager.setMicrophoneMute(false);
//           } else {
//             InCallManager.setSpeakerphoneOn(false); // Set to false first
//             InCallManager.setForceSpeakerphoneOn(false); // Don't force speakerphone for broadcaster
//           }
//           InCallManager.setKeepScreenOn(true);
//         } catch (err) {
//           console.warn("[Broadcaster] InCallManager setup error:", err);
//         }

//         // Get user media with high-quality audio - prevent feedback
//         const stream = await mediaDevices.getUserMedia({
//           audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             autoGainControl: true,
//             channelCount: 1, // Changed to mono to prevent feedback
//             sampleRate: 44100, // Standard sample rate
//             sampleSize: 16,
//             // Remove volume setting as it can cause issues
//           },
//           video: {
//             facingMode: isFrontCamera ? "user" : "environment",
//             width: 1280,
//             height: 720,
//             frameRate: 30,
//           },
//         });

//         if (!mounted) {
//           stream.getTracks().forEach((t) => t.stop());
//           return;
//         }

//         localStream.current = stream;
//         setLocalStreamState(stream);
//         setStreamError(null);

//         signaling.current = new Signaling(roomName, onSignalingMessage);
        
//         connectionTimeout = setTimeout(() => {
//           if (!signaling.current?.isOpen && mounted) {
//             console.warn("[Broadcaster] Signaling connection timeout");
//             setStreamError("Connection timeout. Please check your internet and try again.");
            
//             Alert.alert(
//               "Connection Error",
//               "Failed to connect to streaming server. Please check your internet connection.",
//               [{ text: "OK", onPress: () => navigation.goBack() }]
//             );
//           }
//         }, 10000);

//         await signaling.current.connect();

//         setTimeout(() => {
//           if (mounted && signaling.current?.isOpen) {
//             console.log("[Broadcaster] Sending start-stream message");
            
//             signaling.current.send({
//               type: "start-stream",
//               streamId,
//               streamInfo: { 
//                 id: streamId,
//                 broadcasterId: viewerId,
//               },
//             });

//             if (connectionTimeout) {
//               clearTimeout(connectionTimeout);
//               connectionTimeout = null;
//             }
//           }
//         }, 1000);

//       } catch (err) {
//         console.warn("[Broadcaster] Initialization failed:", err);
        
//         if (mounted) {
//           setStreamError(err.message || "Failed to initialize stream");
          
//           Alert.alert(
//             "Stream Error",
//             err.message || "Could not access camera or microphone. Please check permissions and try again.",
//             [{ text: "OK", onPress: () => navigation.goBack() }]
//           );
//         }
//       }
//     };

//     initializeStream();

//     return () => {
//       mounted = false;
      
//       if (connectionTimeout) {
//         clearTimeout(connectionTimeout);
//       }
      
//       console.log("[Broadcaster] Cleanup in initialization effect");
//     };
//   }, []);

  // const endStream = async (reason = "manual") => {
  //   if (streamEndedRef.current || isStreamEnding) return;
    
  //   streamEndedRef.current = true;
  //   setIsStreamEnding(true);
    
  //   console.log(`[Broadcaster] Ending stream - Reason: ${reason}`);

  //   try {
  //     if (endStreamTimeoutRef.current) {
  //       clearTimeout(endStreamTimeoutRef.current);
  //     }

  //     if (signaling.current) {
  //       try {
  //         signaling.current.send({ 
  //           type: "end-stream", 
  //           streamId,
  //           reason 
  //         });
  //         signaling.current.close();
  //       } catch (e) {
  //         console.warn("Error closing signaling:", e);
  //       }
  //     }

  //     if (localStream.current) {
  //       try {
  //         localStream.current.getTracks().forEach(track => {
  //           track.stop();
  //           track.enabled = false;
  //         });
  //         localStream.current = null;
  //         setLocalStreamState(null);
  //       } catch (e) {
  //         console.warn("Error stopping tracks:", e);
  //       }
  //     }

  //     Object.values(peerConnections.current).forEach(pc => {
  //       try {
  //         pc.close();
  //       } catch (e) {
  //         console.warn("Error closing peer connection:", e);
  //       }
  //     });
  //     peerConnections.current = {};

  //     try {
  //       InCallManager.stop();
  //       InCallManager.setKeepScreenOn(false);
  //       InCallManager.setSpeakerphoneOn(false);
  //       if (Platform.OS === 'ios') {
  //         InCallManager.setForceSpeakerphoneOn(false);
  //       }
  //     } catch (e) {
  //       console.warn("Error stopping InCallManager:", e);
  //     }

  //     try {
  //       const token = await AsyncStorage.getItem("userToken");
  //       if (token) {
  //         await fetch(`${API_ROUTE}/live-streams/end/`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "Authorization": `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             stream_id: streamId,
  //             ended_by: reason,
  //           }),
  //         });
  //       }
  //     } catch (err) {
  //       console.warn("[Broadcaster] Failed to notify backend of stream end:", err);
  //     }

  //     setTimeout(() => {
  //       navigation.goBack();
  //     }, 300);
      
  //   } catch (err) {
  //     console.warn("[Broadcaster] Error during stream cleanup:", err);
  //     navigation.goBack();
  //   }
  // };


  const endStream = async (reason = "manual") => {
    if (streamEndedRef.current || isStreamEnding) return;
    
    streamEndedRef.current = true;
    setIsStreamEnding(true);
    
    console.log(`[Broadcaster] Ending stream - Reason: ${reason}`);

    try {
      if (endStreamTimeoutRef.current) {
        clearTimeout(endStreamTimeoutRef.current);
      }

      // ADD THIS: Stop any ongoing ringing/audio immediately
      try {
        InCallManager.stopRingtone();
        InCallManager.stop();
      } catch (e) {
        console.warn("Error stopping ringtone:", e);
      }

      if (signaling.current) {
        try {
          signaling.current.send({ 
            type: "end-stream", 
            streamId,
            reason 
          });
          signaling.current.close();
        } catch (e) {
          console.warn("Error closing signaling:", e);
        }
      }

      if (localStream.current) {
        try {
          // ADD THIS: Mute audio tracks before stopping to prevent feedback loop
          localStream.current.getAudioTracks().forEach(track => {
            track.enabled = false;
          });
          
          // Then stop all tracks
          localStream.current.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
          localStream.current = null;
          setLocalStreamState(null);
        } catch (e) {
          console.warn("Error stopping tracks:", e);
        }
      }

      Object.values(peerConnections.current).forEach(pc => {
        try {
          pc.close();
        } catch (e) {
          console.warn("Error closing peer connection:", e);
        }
      });
      peerConnections.current = {};

      try {
        InCallManager.stop();
        InCallManager.setKeepScreenOn(false);
        InCallManager.setSpeakerphoneOn(false);
        if (Platform.OS === 'ios') {
          InCallManager.setForceSpeakerphoneOn(false);
        }
      } catch (e) {
        console.warn("Error stopping InCallManager:", e);
      }

      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          await fetch(`${API_ROUTE}/live-streams/end/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              stream_id: streamId,
              ended_by: reason,
            }),
          });
        }
      } catch (err) {
        console.warn("[Broadcaster] Failed to notify backend of stream end:", err);
      }

      setTimeout(() => {
        navigation.goBack();
      }, 300);
      
    } catch (err) {
      console.warn("[Broadcaster] Error during stream cleanup:", err);
      navigation.goBack();
    }
  };

  // Send broadcaster live data to backend
  const sendBroadcasterLiveData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("[Broadcaster] No token available");
        return;
      }
      
      await fetch(`${API_ROUTE}/live-streams/start/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          stream_id: streamId,
          title: "My Live Stream",
        }),
      });
      console.log("[Broadcaster] Live data sent to backend");
    } catch (err) {
      console.warn("[Broadcaster] Failed to send live data", err);
    }
  };

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showCommentsSheet) {
        closeCommentsSheet();
        return true;
      }
      
      Alert.alert(
        "End Live Stream",
        "Are you sure you want to end your live stream?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "End Stream", style: "destructive", onPress: () => endStream("back_button") }
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, [showCommentsSheet]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (streamEndedRef.current) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        "End Live Stream",
        "Are you sure you want to end your live stream?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "End Stream", style: "destructive", onPress: () => endStream("navigation") }
        ]
      );
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        console.log('[Broadcaster] App has come to foreground');
        if (endStreamTimeoutRef.current) {
          clearTimeout(endStreamTimeoutRef.current);
        }
      } else if (
        appState.current === 'active' && 
        nextAppState.match(/inactive|background/)
      ) {
        console.log('[Broadcaster] App went to background');
        
        endStreamTimeoutRef.current = setTimeout(() => {
          if (!streamEndedRef.current) {
            console.log('[Broadcaster] Auto-ending stream due to extended background time');
            endStream("background_timeout");
          }
        }, 30000);
      }
      
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (endStreamTimeoutRef.current) {
        clearTimeout(endStreamTimeoutRef.current);
      }
    };
  }, []);

  // Handle cleanup on component unmount
  useEffect(() => {
    return () => {
      if (!streamEndedRef.current) {
        console.log('[Broadcaster] Component unmounting, ending stream');
        try {
          if (signaling.current) {
            try {
              signaling.current.send({ type: "end-stream", streamId });
            } catch (e) {}
          }
          
          if (localStream.current) {
            localStream.current.getTracks().forEach(track => {
              try {
                track.stop();
              } catch (e) {}
            });
          }
          
          Object.values(peerConnections.current).forEach(pc => {
            try {
              pc.close();
            } catch (e) {}
          });
          
          AsyncStorage.getItem("userToken").then(token => {
            if (token) {
              fetch(`${API_ROUTE}/live-streams/end/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                  stream_id: streamId,
                  ended_by: "app_close",
                }),
              }).catch(() => {});
            }
          }).catch(() => {});
          
        } catch (e) {
          console.warn("[Broadcaster] Error during unmount cleanup:", e);
        }
      }
    };
  }, []);

  // Fetch broadcaster data from AsyncStorage
  useEffect(() => {
    const fetchBroadcasterData = async () => {
      console.log("Fetching broadcaster data...");
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          const broadcaster = {
            name: parsedData.name || "Broadcaster",
            profileImage: parsedData.profile_picture || "",
          };
          console.log('broadcaster_details', broadcaster);
          setBroadcasterData(broadcaster);

          if (signaling.current) {
            signaling.current.send({
              type: "broadcaster-info",
              streamId,
              broadcaster,
            });
          }

          await sendBroadcasterLiveData(broadcaster);
        }
      } catch (err) {
        console.warn("Error fetching broadcaster data:", err);
      }
    };

    fetchBroadcasterData();
  }, []);

  // Heart animation function
  const createHeartAnimation = () => {
    const heartId = Date.now().toString();
    const heartPositions = [
      { x: width * 0.3, y: height },
      { x: width * 0.5, y: height },
      { x: width * 0.7, y: height },
      { x: width * 0.4, y: height },
      { x: width * 0.6, y: height },
    ];

    const newHearts = heartPositions.map((position, index) => ({
      id: `${heartId}-${index}`,
      position,
      scale: new Animated.Value(0),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    newHearts.forEach((heart, index) => {
      const randomX = (Math.random() - 0.5) * 100;
      const randomDelay = index * 100;

      setTimeout(() => {
        Animated.sequence([
          Animated.timing(heart.scale, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(heart.scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(heart.translateY, {
              toValue: -height * 0.7,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(heart.translateX, {
              toValue: randomX,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(heart.opacity, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          setHearts((prev) => prev.filter((h) => h.id !== heart.id));
        });
      }, randomDelay);
    });
  };

  // Like counter animation
  const animateLikeCounter = () => {
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onSignalingMessage = async (msg) => {
    if (!msg || !msg.type) return;

    console.log('📥 Received message:', msg.type, msg);

    if (msg.type === "viewer-count") {
      setViewerCount(msg.count);
    } 
    else if (msg.type === "comment") {
      console.log('💬 New comment:', {
        from: msg.username,
        text: msg.text,
        viewerId: msg.viewer_id
      });
      
      setComments((prev) => [...prev, {
        id: Date.now().toString(),
        text: msg.text,
        viewerId: msg.viewer_id,
        viewerName: msg.username || "Anonymous",
        viewerProfileImage: msg.profilePicture || "",
        timestamp: new Date(),
      }]);
      
      // Increment unread count if comments sheet is closed
      if (!showCommentsSheet) {
        setUnreadComments(prev => prev + 1);
      }
    } 
    else if (msg.type === "like") {
      setLikes((prev) => prev + 1);
      animateLikeCounter();
      createHeartAnimation();
    } 
    else if (msg.type === "viewer-joined") {
      console.log('👋 Viewer joined:', {
        username: msg.username,
        viewerId: msg.viewer_id
      });
      
      setViewerCount(prev => prev + 1);
      
      setComments((prev) => [...prev, {
        id: Date.now().toString(),
        text: `👋 ${msg.username || 'A viewer'} joined the stream`,
        viewerId: msg.viewer_id,
        viewerName: 'System',
        isSystemMessage: true,
        timestamp: new Date(),
      }]);
    } 
    else if (msg.type === "viewer-left") {
      console.log('👋 Viewer left:', {
        username: msg.username,
        viewerId: msg.viewer_id
      });
      
      setViewerCount(prev => Math.max(0, prev - 1));
      
      setComments((prev) => [...prev, {
        id: Date.now().toString(),
        text: `👋 ${msg.username || 'A viewer'} left the stream`,
        viewerId: msg.viewer_id,
        viewerName: 'System',
        isSystemMessage: true,
        timestamp: new Date(),
      }]);
    }

    // WebRTC signaling handlers
    if (msg.type === "viewer-offer") {
      const viewerId = msg.viewer_id;
      let pc = peerConnections.current[viewerId];
      if (!pc) {
        console.log('🎥 Creating new peer connection for viewer:', viewerId);
        pc = new RTCPeerConnection(rtcConfig);
        peerConnections.current[viewerId] = pc;

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            signaling.current.send({
              type: "candidate",
              candidate: e.candidate,
              streamId,
              viewer_id: viewerId,
            });
          }
        };

        if (localStream.current) {
          localStream.current.getTracks().forEach((t) => {
            pc.addTrack(t, localStream.current);
          });
        }
      }

      if (!pc.remoteDescription) {
        console.log('📞 Setting remote description and creating answer for viewer:', viewerId);
        await pc.setRemoteDescription(msg.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        signaling.current.send({
          type: "broadcaster-answer",
          streamId,
          viewer_id: viewerId,
          answer,
        });
      }
    } 
    else if (msg.type === "candidate" && msg.viewer_id) {
      const pc = peerConnections.current[msg.viewer_id];
      if (pc && msg.candidate) {
        try {
          console.log('❄️ Adding ICE candidate for viewer:', msg.viewer_id);
          await pc.addIceCandidate(msg.candidate);
        } catch (err) {
          console.warn("[Broadcaster] addIceCandidate error:", err);
        }
      }
    }
  };

  // Initialize media and signaling with audio focus
  useEffect(() => {
    let mounted = true;
    let connectionTimeout = null;

    const initializeStream = async () => {
      try {
        await getIceServers();

        // Configure audio for streaming with proper focus
        try {
          InCallManager.start({ 
            media: 'video',
            auto: true,
            // ringback: '_stream_'
          });
          
          // if (Platform.OS === 'android') {
          //   InCallManager.setSpeakerphoneOn(true);
          //   InCallManager.setForceSpeakerphoneOn(true);
          //   InCallManager.setMicrophoneMute(false);
          // } else {
          //   InCallManager.setForceSpeakerphoneOn(true);
          // }

          if (Platform.OS === 'android') {
            InCallManager.setSpeakerphoneOn(true);
            InCallManager.setMicrophoneMute(false);
          } else {
            InCallManager.setForceSpeakerphoneOn(false);
          }
          InCallManager.setKeepScreenOn(true);
        } catch (err) {
          console.warn("[Broadcaster] InCallManager setup error:", err);
        }

        // Get user media with high-quality audio
        const stream = await mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 2,
            sampleRate: 48000,
            sampleSize: 16,
            volume: 1.0
          },
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
            width: 1280,
            height: 720,
            frameRate: 30,
          },
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStream.current = stream;
        setLocalStreamState(stream);
        setStreamError(null);

        signaling.current = new Signaling(roomName, onSignalingMessage);
        
        connectionTimeout = setTimeout(() => {
          if (!signaling.current?.isOpen && mounted) {
            console.warn("[Broadcaster] Signaling connection timeout");
            setStreamError("Connection timeout. Please check your internet and try again.");
            
            Alert.alert(
              "Connection Error",
              "Failed to connect to streaming server. Please check your internet connection.",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          }
        }, 10000);

        await signaling.current.connect();

        setTimeout(() => {
          if (mounted && signaling.current?.isOpen) {
            console.log("[Broadcaster] Sending start-stream message");
            
            signaling.current.send({
              type: "start-stream",
              streamId,
              streamInfo: { 
                id: streamId,
                broadcasterId: viewerId,
              },
            });

            if (connectionTimeout) {
              clearTimeout(connectionTimeout);
              connectionTimeout = null;
            }
          }
        }, 1000);

      } catch (err) {
        console.warn("[Broadcaster] Initialization failed:", err);
        
        if (mounted) {
          setStreamError(err.message || "Failed to initialize stream");
          
          Alert.alert(
            "Stream Error",
            err.message || "Could not access camera or microphone. Please check permissions and try again.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        }
      }
    };

    initializeStream();

    return () => {
      mounted = false;
      
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      
      console.log("[Broadcaster] Cleanup in initialization effect");
    };
  }, []);

  // Control functions
  const toggleMute = () => {
    if (localStream.current) {
      const newMuted = !isMuted;
      localStream.current.getAudioTracks().forEach((t) => {
        t.enabled = !newMuted;
      });
      setIsMuted(newMuted);
      
      // Update InCallManager
      try {
        InCallManager.setMicrophoneMute(newMuted);
      } catch (err) {
        console.warn("Error toggling microphone mute:", err);
      }
    }
  };

  const switchCamera = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((t) => {
        if (t._switchCamera) {
          t._switchCamera();
        }
      });
      setIsFrontCamera(!isFrontCamera);
    }
  };

  // const toggleSpeaker = () => {
  //   const newSpeakerState = !speakerOn;
  //   try {
  //     InCallManager.setSpeakerphoneOn(newSpeakerState);
  //     if (Platform.OS === 'ios') {
  //       InCallManager.setForceSpeakerphoneOn(newSpeakerState);
  //     }
  //   } catch (err) {
  //     console.warn("Error toggling speaker:", err);
  //   }
  //   setSpeakerOn(newSpeakerState);
  // };


  const toggleSpeaker = () => {
    const newSpeakerState = !speakerOn;
    try {
      // For broadcaster, we typically don't want speakerphone
      // as it can cause audio feedback
      InCallManager.setSpeakerphoneOn(newSpeakerState);
      if (Platform.OS === 'ios') {
        // Don't force speakerphone - let the system handle audio routing
        InCallManager.setForceSpeakerphoneOn(false);  
      }
    } catch (err) {
      console.warn("Error toggling speaker:", err);
    }
    setSpeakerOn(newSpeakerState);
  };

  const getRandomColor = (name) => {
    if (!name) return '#555';
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const confirmEndStream = () => {
    Alert.alert(
      "End Live Stream",
      "Are you sure you want to end your live stream?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "End Stream", style: "destructive", onPress: () => endStream("manual") }
      ]
    );
  };

  const handleCommentLongPress = (comment) => {
    setSelectedComment(comment);
    setShowCommentActions(true);
  };

  const renderComment = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleCommentLongPress(item)}
      activeOpacity={0.7}
      style={[
        styles.commentItem,
        item.isSystemMessage && styles.systemMessageItem
      ]}
    >
      <View style={styles.commentHeader}>
        {item.viewerProfileImage ? (
          <Image
            source={{ uri: item.viewerProfileImage.startsWith('http') 
              ? item.viewerProfileImage 
              : `${API_ROUTE_IMAGE}${item.viewerProfileImage}`}}
            style={styles.commentAvatar}
          />
        ) : (
          <View style={[styles.commentAvatarPlaceholder, { backgroundColor: getRandomColor(item.viewerName) }]}>
            <Text style={styles.commentAvatarInitial}>
              {item.viewerName ? item.viewerName.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
        )}
        <View style={styles.commentContent}>
          <View style={styles.commentNameRow}>
            <Text style={[
              styles.commentViewerName,
              item.isSystemMessage && styles.systemMessageName
            ]}>
              {item.viewerName}
            </Text>
            <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
          </View>
          <Text style={[
            styles.commentText,
            item.isSystemMessage && styles.systemMessageText
          ]}>
            {item.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const bottomSheetTranslateY = bottomSheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, height - BOTTOM_SHEET_MAX_HEIGHT],
  });

  const bottomSheetOpacity = bottomSheetAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 1],
  });

  if (streamError) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <IconMaterial name="error-outline" size={60} color="#ff375f" />
        <Text style={[styles.placeholderText, { fontSize: 18, marginTop: 20 }]}>
          Stream Error
        </Text>
        <Text style={[styles.placeholderText, { fontSize: 14, marginTop: 10, textAlign: 'center' }]}>
          {streamError}
        </Text>
        <TouchableOpacity 
          style={[styles.controlButton, { marginTop: 30, paddingHorizontal: 30 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Video Stream */}
      {localStreamState ? (
        <RTCView
          streamURL={localStreamState.toURL()}
          style={styles.videoStream}
          objectFit="cover"
          mirror={isFrontCamera}
        />
      ) : (
        <View style={[styles.videoStream, styles.placeholder]}>
          <IconMaterial name="live-tv" size={60} color="#666" />
          <Text style={styles.placeholderText}>Starting stream...</Text>
        </View>
      )}

      {/* Floating Hearts Animation */}
      {hearts.map((heart) => (
        <Animated.View
          key={heart.id}
          style={[
            styles.heartContainer,
            {
              left: heart.position.x - 25,
              top: heart.position.y - 25,
              transform: [
                { scale: heart.scale },
                { translateY: heart.translateY },
                { translateX: heart.translateX },
              ],
              opacity: heart.opacity,
            },
          ]}
        >
          <Icon name="heart" size={50} color="#ff375f" />
        </Animated.View>
      ))}

      {/* Tap to show/hide controls */}
      <TouchableOpacity style={styles.tapArea} onPress={toggleControls} activeOpacity={1} />

      {/* Header Section */}
      {showControls && (
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={confirmEndStream}>
              <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.streamInfo}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.streamStats}>
                {viewerCount} watching • {likes} likes
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.commentsHeaderButton}
              onPress={openCommentsSheet}
            >
              <Icon name="chatbubbles" size={22} color="#fff" />
              {unreadComments > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>
                    {unreadComments > 99 ? '99+' : unreadComments}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* Live Stats Floating Card */}
      {showControls && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="people" size={16} color="#fff" />
            <Text style={styles.statText}>{viewerCount}</Text>
          </View>
          <Animated.View
            style={[
              styles.statItem,
              {
                transform: [
                  {
                    scale: likeAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name="heart" size={16} color="#ff375f" />
            <Text style={[styles.statText, styles.likeCount]}>{likes}</Text>
          </Animated.View>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={openCommentsSheet}
          >
            <Icon name="chatbubble" size={16} color="#fff" />
            <Text style={styles.statText}>{comments.length}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recent Comments Preview */}
      {showControls && comments.length > 0 && !showCommentsSheet && (
        <View style={styles.commentsPreview}>
          <FlatList
            data={comments.slice(-3)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.previewComment}>
                <Text style={styles.previewCommentName}>
                  {item.viewerName}:
                </Text>
                <Text style={styles.previewCommentText} numberOfLines={1}>
                  {item.text}
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Bottom Sheet for Comments */}
      <Modal
        visible={showCommentsSheet}
        transparent={true}
        animationType="none"
        onRequestClose={closeCommentsSheet}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity 
            style={styles.bottomSheetBackdrop}
            onPress={closeCommentsSheet}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              {
                transform: [{ translateY: bottomSheetTranslateY }],
                opacity: bottomSheetOpacity,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetDragIndicator} />
              <View style={styles.bottomSheetTitleRow}>
                <Text style={styles.bottomSheetTitle}>
                  Live Chat • {comments.length} messages
                </Text>
                <TouchableOpacity onPress={closeCommentsSheet}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderComment}
              style={styles.bottomSheetList}
              contentContainerStyle={styles.bottomSheetListContent}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Comment Actions Modal */}
      <Modal
        visible={showCommentActions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCommentActions(false)}
      >
        <TouchableOpacity 
          style={styles.actionsOverlay}
          onPress={() => setShowCommentActions(false)}
          activeOpacity={1}
        >
          <View style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Comment Actions</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Add your action here (e.g., block user, report, etc.)
                setShowCommentActions(false);
              }}
            >
              <Icon name="ban-outline" size={20} color="#ff375f" />
              <Text style={[styles.actionButtonText, { color: '#ff375f' }]}>
                Block User
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Add your action here
                setShowCommentActions(false);
              }}
            >
              <Icon name="flag-outline" size={20} color="#ffaa00" />
              <Text style={[styles.actionButtonText, { color: '#ffaa00' }]}>
                Report Comment
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelActionButton]}
              onPress={() => setShowCommentActions(false)}
            >
              <Text style={styles.cancelActionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Controls Bar */}
      {showControls && (
        <View style={styles.controlsBar}>
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endButton]}
            onPress={confirmEndStream}
          >
            <Icon name="close" size={24} color="#fff" />
            <Text style={styles.endButtonText}>End</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
            <Icon name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, speakerOn && styles.controlButtonActive]}
            onPress={toggleSpeaker}
          >
            <Icon
              name={speakerOn ? "volume-high" : "volume-mute"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoStream: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  placeholderText: {
    color: "#666",
    marginTop: 10,
    fontSize: 16,
  },
  heartContainer: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 1000,
    shadowColor: "#ff375f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  tapArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  streamInfo: {
    flex: 1,
    alignItems: "center",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff375f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 6,
  },
  liveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  streamStats: {
    color: "#fff",
    fontSize: 11,
    marginTop: 4,
    opacity: 0.9,
  },
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
  unreadBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  statsCard: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 30,
    padding: 12,
    zIndex: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  statText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  likeCount: {
    color: "#ff375f",
  },
  commentsPreview: {
    position: "absolute",
    left: 20,
    bottom: 100,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 12,
    zIndex: 5,
  },
  previewComment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  previewCommentName: {
    color: "#4A9EFF",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6,
  },
  previewCommentText: {
    color: "#fff",
    fontSize: 12,
    flex: 1,
  },
  controlsBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 50,
    padding: 15,
    zIndex: 10,
  },
  controlButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  controlButtonActive: {
    backgroundColor: "rgba(255,55,95,0.3)",
  },
  endButton: {
    backgroundColor: "#ff375f",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  endButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_MAX_HEIGHT,
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  bottomSheetDragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  bottomSheetTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomSheetTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSheetList: {
    flex: 1,
  },
  bottomSheetListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  commentItem: {
    marginBottom: 15,
  },
  systemMessageItem: {
    opacity: 0.7,
  },
  commentHeader: {
    flexDirection: "row",
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  commentAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  commentAvatarInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  commentContent: {
    flex: 1,
  },
  commentNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentViewerName: {
    color: "#4A9EFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  systemMessageName: {
    color: "#FFA500",
  },
  commentTime: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
  },
  commentText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 18,
  },
  systemMessageText: {
    fontStyle: "italic",
  },
  actionsOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  actionsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#2a2a2a",
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  cancelActionButton: {
    backgroundColor: "#333",
    justifyContent: "center",
    marginTop: 5,
  },
  cancelActionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
});







