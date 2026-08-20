


// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   Animated,
// //   Dimensions,
// //   Image,
// //   AppState,
// //   BackHandler,
// //   Alert,
// //   Platform,
// //   Modal,
// //   PanResponder,
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { RTCPeerConnection, mediaDevices, RTCView } from "react-native-webrtc";
// // import Icon from "react-native-vector-icons/Ionicons";
// // import IconMaterial from "react-native-vector-icons/MaterialIcons";
// // import InCallManager from "react-native-incall-manager";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // import Signaling from "./signaling";
// // import { rtcConfig, getIceServers } from "./rtcConfig";
// // import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";

// // const { width, height } = Dimensions.get("window");
// // const BOTTOM_SHEET_MAX_HEIGHT = height * 0.7;

// // export default function Broadcaster({ route, navigation }) {
// //   const { roomName, streamId } = route.params;
// //   const safeRoomName = encodeURIComponent(roomName.replace(/\s+/g, "-"));

// //   const signaling = useRef(null);
// //   const localStream = useRef(null);
// //   const peerConnections = useRef({});
// //   const likeAnimation = useRef(new Animated.Value(0)).current;
// //   const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
// //   const [localStreamState, setLocalStreamState] = useState(null);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);
// //   const [speakerOn, setSpeakerOn] = useState(true);
// //   const [viewerCount, setViewerCount] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [showControls, setShowControls] = useState(true);
// //   const [hearts, setHearts] = useState([]);
// //   const [broadcasterData, setBroadcasterData] = useState({ name: "", profileImage: "" });
// //   const [isStreamEnding, setIsStreamEnding] = useState(false);
// //   const [streamError, setStreamError] = useState(null);
// //   const [showCommentsSheet, setShowCommentsSheet] = useState(false);
// //   const [unreadComments, setUnreadComments] = useState(0);
// //   const [selectedComment, setSelectedComment] = useState(null);
// //   const [showCommentActions, setShowCommentActions] = useState(false);

  

   
 

   
// //   const pendingCandidates = useRef({}); // viewer_id -> [candidate, ...] arrived before pc/remoteDescription was ready
  
// //   const appState = useRef(AppState.currentState);
// //   const streamEndedRef = useRef(false);
// //   const endStreamTimeoutRef = useRef(null);

// //   const panResponder = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => true,
// //       onPanResponderMove: (_, gestureState) => {
// //         if (gestureState.dy > 0) {
// //           const newValue = Math.max(0, 1 - gestureState.dy / 300);
// //           bottomSheetAnimation.setValue(newValue);
// //         }
// //       },
// //       onPanResponderRelease: (_, gestureState) => {
// //         if (gestureState.dy > 50) {
// //           closeCommentsSheet();
// //         } else {
// //           openCommentsSheet();
// //         }
// //       },
// //     })
// //   ).current;

// //   const openCommentsSheet = () => {
// //     setShowCommentsSheet(true);
// //     setUnreadComments(0);
// //     Animated.timing(bottomSheetAnimation, {
// //       toValue: 1,
// //       duration: 300,
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   const closeCommentsSheet = () => {
// //     Animated.timing(bottomSheetAnimation, {
// //       toValue: 0,
// //       duration: 300,
// //       useNativeDriver: true,
// //     }).start(() => {
// //       setShowCommentsSheet(false);
// //     });
// //   };

// //   const endStream = async (reason = "manual") => {
// //     if (streamEndedRef.current || isStreamEnding) return;
    
// //     streamEndedRef.current = true;
// //     setIsStreamEnding(true);
    
// //     console.log(`[Broadcaster] Ending stream - Reason: ${reason}`);

// //     try {
// //       if (endStreamTimeoutRef.current) {
// //         clearTimeout(endStreamTimeoutRef.current);
// //       }

// //       try {
// //         InCallManager.stopRingtone();
// //         InCallManager.stop();
// //       } catch (e) {
// //         console.warn("Error stopping ringtone:", e);
// //       }

// //       if (signaling.current) {
// //         try {
// //           signaling.current.send({ 
// //             type: "end-stream", 
// //             streamId,
// //             reason 
// //           });
// //           signaling.current.close();
// //         } catch (e) {
// //           console.warn("Error closing signaling:", e);
// //         }
// //       }

// //       if (localStream.current) {
// //         try {
// //           localStream.current.getAudioTracks().forEach(track => {
// //             track.enabled = false;
// //           });
          
// //           localStream.current.getTracks().forEach(track => {
// //             track.stop();
// //             track.enabled = false;
// //           });
// //           localStream.current = null;
// //           setLocalStreamState(null);
// //         } catch (e) {
// //           console.warn("Error stopping tracks:", e);
// //         }
// //       }

// //       Object.values(peerConnections.current).forEach(pc => {
// //         try {
// //           pc.close();
// //         } catch (e) {
// //           console.warn("Error closing peer connection:", e);
// //         }
// //       });
// //       peerConnections.current = {};
// //       pendingCandidates.current = {};

// //       try {
// //         InCallManager.stop();
// //         InCallManager.setKeepScreenOn(false);
// //         InCallManager.setSpeakerphoneOn(false);
// //         if (Platform.OS === 'ios') {
// //           InCallManager.setForceSpeakerphoneOn(false);
// //         }
// //       } catch (e) {
// //         console.warn("Error stopping InCallManager:", e);
// //       }

// //       try {
// //         const token = await AsyncStorage.getItem("userToken");
// //         if (token) {
// //           await fetch(`${API_ROUTE}/live-streams/end/`, {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //               "Authorization": `Bearer ${token}`,
// //             },
// //             body: JSON.stringify({
// //               stream_id: streamId,
// //               ended_by: reason,
// //             }),
// //           });
// //         }
// //       } catch (err) {
// //         console.warn("[Broadcaster] Failed to notify backend of stream end:", err);
// //       }

// //       setTimeout(() => {
// //         navigation.goBack();
// //       }, 300);
      
// //     } catch (err) {
// //       console.warn("[Broadcaster] Error during stream cleanup:", err);
// //       navigation.goBack();
// //     }
// //   };

// //   const sendBroadcasterLiveData = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("userToken");
// //       if (!token) {
// //         console.warn("[Broadcaster] No token available");
// //         return;
// //       }
      
// //       await fetch(`${API_ROUTE}/live-streams/start/`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}`, 
// //         },
// //         body: JSON.stringify({
// //           stream_id: streamId,
// //           title: "My Live Stream",
// //         }),
// //       });
// //       console.log("[Broadcaster] Live data sent to backend");
// //     } catch (err) {
// //       console.warn("[Broadcaster] Failed to send live data", err);
// //     }
// //   };

// //     const waitForLocalStream = (timeoutMs = 8000) => {
// //     return new Promise((resolve, reject) => {
// //       if (localStream.current) return resolve(localStream.current);
// //       const start = Date.now();
// //       const interval = setInterval(() => {
// //         if (localStream.current) {
// //           clearInterval(interval);
// //           resolve(localStream.current);
// //         } else if (Date.now() - start > timeoutMs) {
// //           clearInterval(interval);
// //           reject(new Error('Local stream not ready in time'));
// //         }
// //       }, 100);
// //     });
// //   };

// //   // ========== FIXED: onSignalingMessage ==========

// //   // ========== FIXED: onSignalingMessage ==========
// //   const onSignalingMessage = async (msg) => {
// //     if (!msg || !msg.type) return;

// //     console.log('📥 Received message:', msg.type, msg);

// //     // ========== DATA MESSAGES ==========
// //     if (msg.type === "viewer-count") {
// //       setViewerCount(msg.count);
// //       return;
// //     } 
// //     // else if (msg.type === "comment") {
// //     //   console.log('💬 New comment:', {
// //     //     from: msg.username,
// //     //     text: msg.text,
// //     //     viewerId: msg.viewer_id
// //     //   });
      
// //     //   setComments((prev) => [...prev, {
// //     //     id: Date.now().toString(),
// //     //     text: msg.text,
// //     //     viewerId: msg.viewer_id,
// //     //     viewerName: msg.username || "Anonymous",
// //     //     viewerProfileImage: msg.profilePicture || "",
// //     //     timestamp: new Date(),
// //     //   }]);
      
// //     //   if (!showCommentsSheet) {
// //     //     setUnreadComments(prev => prev + 1);
// //     //   }
// //     //   return;
// //     // } 

// //         else if (msg.type === "comment") {
// //       console.log('💬 New comment:', {
// //         from: msg.username,
// //         text: msg.text,
// //         viewerId: msg.viewer_id
// //       });
      
// //       setComments((prev) => [...prev, {
// //         id: Date.now().toString(),
// //         text: msg.text,
// //         viewerId: msg.viewer_id,
// //         viewerName: msg.username || "Anonymous",
// //         viewerProfileImage: msg.profilePicture || "",
// //         timestamp: new Date(),
// //       }]);
      
// //       if (!showCommentsSheet) {
// //         setUnreadComments(prev => prev + 1);
// //       }

// //       // Relay it out to every viewer in the room. We don't rely on the
// //       // backend forwarding viewer->viewer messages — we only know
// //       // broadcaster->room broadcasts work (confirmed via end-stream),
// //       // so we use that proven path to fan comments out to everyone.
// //       if (signaling.current) {
// //         signaling.current.send({
// //           type: "comment-relay",
// //           text: msg.text,
// //           username: msg.username || "Anonymous",
// //           profilePicture: msg.profilePicture || "",
// //           viewer_id: msg.viewer_id,
// //           streamId,
// //           timestamp: Date.now(),
// //         });
// //       }
// //       return;
// //     } 
// //     else if (msg.type === "like") {
// //       setLikes((prev) => prev + 1);
// //       animateLikeCounter();
// //       createHeartAnimation();

// //       // Same relay pattern for likes so every viewer's heart animation fires,
// //       // not just the broadcaster's.
// //       if (signaling.current) {
// //         signaling.current.send({
// //           type: "like-relay",
// //           viewer_id: msg.viewer_id,
// //           username: msg.username,
// //           streamId,
// //           timestamp: Date.now(),
// //         });
// //       }
// //       return;
// //     }
// //     else if (msg.type === "like") {
// //       setLikes((prev) => prev + 1);
// //       animateLikeCounter();
// //       createHeartAnimation();
// //       return;
// //     } 
// //     else if (msg.type === "viewer-joined") {
// //       console.log('👋 Viewer joined:', {
// //         username: msg.username,
// //         viewerId: msg.viewer_id
// //       });
      
// //       setViewerCount(prev => prev + 1);
      
// //       setComments((prev) => [...prev, {
// //         id: Date.now().toString(),
// //         text: `👋 ${msg.username || 'A viewer'} joined the stream`,
// //         viewerId: msg.viewer_id,
// //         viewerName: 'System',
// //         isSystemMessage: true,
// //         timestamp: new Date(),
// //       }]);
// //       return;
// //     } 
// //     else if (msg.type === "viewer-left") {
// //       console.log('👋 Viewer left:', {
// //         username: msg.username,
// //         viewerId: msg.viewer_id
// //       });
      
// //       setViewerCount(prev => Math.max(0, prev - 1));
      
// //       setComments((prev) => [...prev, {
// //         id: Date.now().toString(),
// //         text: `👋 ${msg.username || 'A viewer'} left the stream`,
// //         viewerId: msg.viewer_id,
// //         viewerName: 'System',
// //         isSystemMessage: true,
// //         timestamp: new Date(),
// //       }]);
// //       return;
// //     }

// //     // ========== WEBRTC SIGNALING HANDLERS ==========
    
// //     // ✅ FIXED: Viewer sends offer to join the stream
// //     if (msg.type === "viewer-offer") {
// //       const viewerId = msg.viewer_id;
// //       let pc = peerConnections.current[viewerId];
      
// //             if (!pc) {
// //         console.log('🎥 Creating new peer connection for viewer:', viewerId);
// //         pc = new RTCPeerConnection(rtcConfig);
// //         peerConnections.current[viewerId] = pc;

// //         // ✅ FIXED: ICE candidate handler - Now sends "candidate" not "start-stream"
// //         pc.onicecandidate = (e) => {
// //           if (e.candidate) {
// //             console.log(`❄️ Broadcaster ICE candidate for viewer ${viewerId}`);
// //             signaling.current.send({
// //               type: "candidate",
// //               candidate: {
// //                 candidate: e.candidate.candidate,
// //                 sdpMLineIndex: e.candidate.sdpMLineIndex,
// //                 sdpMid: e.candidate.sdpMid
// //               },
// //               streamId: streamId,
// //               viewer_id: viewerId,
// //             });
// //           }
// //         };

// //         // ✅ CRITICAL: Add local stream tracks — wait if getUserMedia hasn't resolved yet
// //         try {
// //           const stream = await waitForLocalStream();
// //           console.log('📹 Adding local stream tracks to peer connection');
// //           stream.getTracks().forEach((track) => {
// //             console.log('📹 Adding track:', track.kind);
// //             pc.addTrack(track, stream);
// //           });
// //         } catch (err) {
// //           console.error('❌ Local stream never became available — cannot answer viewer:', viewerId, err);
// //           try { pc.close(); } catch (e) {}
// //           delete peerConnections.current[viewerId];
// //           return;
// //         }
// //       }

// //       // Handle the offer
// //             // Handle the offer
// //       if (!pc.remoteDescription) {
// //         console.log('📞 Setting remote description and creating answer for viewer:', viewerId);
// //         try {
// //           await pc.setRemoteDescription(msg.offer);

// //           // Flush any ICE candidates that arrived before remoteDescription was set
// //           const queued = pendingCandidates.current[viewerId] || [];
// //           if (queued.length > 0) {
// //             console.log(`❄️ Flushing ${queued.length} queued candidates for viewer:`, viewerId);
// //           }
// //           for (const c of queued) {
// //             try {
// //               await pc.addIceCandidate(c);
// //             } catch (e) {
// //               console.warn('Failed to add queued ICE candidate:', e);
// //             }
// //           }
// //           pendingCandidates.current[viewerId] = [];

// //           const answer = await pc.createAnswer();
// //           await pc.setLocalDescription(answer);

// //           signaling.current.send({
// //             type: "broadcaster-answer",
// //             streamId: streamId,
// //             viewer_id: viewerId,
// //             answer: {
// //               type: answer.type,
// //               sdp: answer.sdp,
// //             },
// //           });
// //           console.log('✅ Sent broadcaster-answer to viewer:', viewerId);
// //         } catch (err) {
// //           console.error('❌ Error handling viewer-offer:', err);
// //         }
// //       }
// //       return;
// //       return;
// //     } 
    
// //     // ✅ FIXED: ICE candidate from viewer
// //         // ✅ FIXED: ICE candidate from viewer
// //     else if (msg.type === "candidate" && msg.viewer_id) {
// //       const pc = peerConnections.current[msg.viewer_id];
// //       if (pc && pc.remoteDescription && msg.candidate) {
// //         try {
// //           console.log('❄️ Adding ICE candidate for viewer:', msg.viewer_id);
// //           await pc.addIceCandidate(msg.candidate);
// //         } catch (err) {
// //           console.warn("[Broadcaster] addIceCandidate error:", err);
// //         }
// //       } else if (msg.candidate) {
// //         // pc not created yet, or remoteDescription not set yet — queue it
// //         console.log('❄️ Queuing early ICE candidate for viewer:', msg.viewer_id);
// //         if (!pendingCandidates.current[msg.viewer_id]) {
// //           pendingCandidates.current[msg.viewer_id] = [];
// //         }
// //         pendingCandidates.current[msg.viewer_id].push(msg.candidate);
// //       }
// //       return;
// //     }
    
// //     console.log('⚠️ Unhandled message type:', msg.type, msg);
// //   };

// //   const createHeartAnimation = () => {
// //     const heartId = Date.now().toString();
// //     const heartPositions = [
// //       { x: width * 0.3, y: height },
// //       { x: width * 0.5, y: height },
// //       { x: width * 0.7, y: height },
// //       { x: width * 0.4, y: height },
// //       { x: width * 0.6, y: height },
// //     ];

// //     const newHearts = heartPositions.map((position, index) => ({
// //       id: `${heartId}-${index}`,
// //       position,
// //       scale: new Animated.Value(0),
// //       opacity: new Animated.Value(1),
// //       translateY: new Animated.Value(0),
// //       translateX: new Animated.Value(0),
// //     }));

// //     setHearts((prev) => [...prev, ...newHearts]);

// //     newHearts.forEach((heart, index) => {
// //       const randomX = (Math.random() - 0.5) * 100;
// //       const randomDelay = index * 100;

// //       setTimeout(() => {
// //         Animated.sequence([
// //           Animated.timing(heart.scale, {
// //             toValue: 1.2,
// //             duration: 200,
// //             useNativeDriver: true,
// //           }),
// //           Animated.timing(heart.scale, {
// //             toValue: 1,
// //             duration: 100,
// //             useNativeDriver: true,
// //           }),
// //           Animated.parallel([
// //             Animated.timing(heart.translateY, {
// //               toValue: -height * 0.7,
// //               duration: 3000,
// //               useNativeDriver: true,
// //             }),
// //             Animated.timing(heart.translateX, {
// //               toValue: randomX,
// //               duration: 3000,
// //               useNativeDriver: true,
// //             }),
// //             Animated.timing(heart.opacity, {
// //               toValue: 0,
// //               duration: 3000,
// //               useNativeDriver: true,
// //             }),
// //           ]),
// //         ]).start(() => {
// //           setHearts((prev) => prev.filter((h) => h.id !== heart.id));
// //         });
// //       }, randomDelay);
// //     });
// //   };

// //   const animateLikeCounter = () => {
// //     Animated.sequence([
// //       Animated.timing(likeAnimation, {
// //         toValue: 1,
// //         duration: 200,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(likeAnimation, {
// //         toValue: 0,
// //         duration: 400,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   };

// //   // Initialize media and signaling
// //   useEffect(() => {
// //     let mounted = true;
// //     let connectionTimeout = null;

// //     const initializeStream = async () => {
// //       try {
// //         await getIceServers();

// //         try {
// //           InCallManager.start({ 
// //             media: 'video',
// //             auto: true,
// //           });

// //           if (Platform.OS === 'android') {
// //             InCallManager.setSpeakerphoneOn(true);
// //             InCallManager.setMicrophoneMute(false);
// //           } else {
// //             InCallManager.setForceSpeakerphoneOn(false);
// //           }
// //           InCallManager.setKeepScreenOn(true);
// //         } catch (err) {
// //           console.warn("[Broadcaster] InCallManager setup error:", err);
// //         }

// //         const stream = await mediaDevices.getUserMedia({
// //           audio: {
// //             echoCancellation: true,
// //             noiseSuppression: true,
// //             autoGainControl: true,
// //             channelCount: 2,
// //             sampleRate: 48000,
// //             sampleSize: 16,
// //             volume: 1.0
// //           },
// //           video: {
// //             facingMode: isFrontCamera ? "user" : "environment",
// //             width: 1280,
// //             height: 720,
// //             frameRate: 30,
// //           },
// //         });

// //         if (!mounted) {
// //           stream.getTracks().forEach((t) => t.stop());
// //           return;
// //         }

// //         console.log('📹 Local stream tracks:', stream.getTracks().map(t => ({
// //           kind: t.kind,
// //           enabled: t.enabled,
// //           readyState: t.readyState,
// //         })));

// //         localStream.current = stream;
// //         setLocalStreamState(stream);
// //         setStreamError(null);
// //         console.log("🎤 Audio Tracks:", stream.getAudioTracks());
// //           console.log("🎥 Video Tracks:", stream.getVideoTracks());

// //           stream.getAudioTracks().forEach(track => {
// //             console.log("🎤 Audio Track:", {
// //               enabled: track.enabled,
// //               muted: track.muted,
// //               readyState: track.readyState,
// //               label: track.label,
// //             });
// //           });

// //         signaling.current = new Signaling(safeRoomName, onSignalingMessage);
        
// //         connectionTimeout = setTimeout(() => {
// //           if (!signaling.current?.isOpen && mounted) {
// //             console.warn("[Broadcaster] Signaling connection timeout");
// //             setStreamError("Connection timeout. Please check your internet and try again.");
            
// //             Alert.alert(
// //               "Connection Error",
// //               "Failed to connect to streaming server. Please check your internet connection.",
// //               [{ text: "OK", onPress: () => navigation.goBack() }]
// //             );
// //           }
// //         }, 10000);

// //         await signaling.current.connect();

// //         setTimeout(async () => {
// //           const userData = await AsyncStorage.getItem("userData");
// //           const parsed = JSON.parse(userData);
          
// //           if (mounted && signaling.current?.isOpen) {
// //             console.log("[Broadcaster] Sending start-stream message");
            
// //             signaling.current.send({
// //               type: "start-stream",
// //               streamId,
// //               streamInfo: { 
// //                 id: streamId,
// //                 broadcasterId: parsed.id,
// //                 broadcasterName: parsed.name,
// //                 broadcasterProfile: parsed.profile_picture || '',
// //               },
// //             });

// //             if (connectionTimeout) {
// //               clearTimeout(connectionTimeout);
// //               connectionTimeout = null;
// //             }
// //           }
// //         }, 1000);

// //       } catch (err) {
// //         console.warn("[Broadcaster] Initialization failed:", err);
        
// //         if (mounted) {
// //           setStreamError(err.message || "Failed to initialize stream");
          
// //           Alert.alert(
// //             "Stream Error",
// //             err.message || "Could not access camera or microphone. Please check permissions and try again.",
// //             [{ text: "OK", onPress: () => navigation.goBack() }]
// //           );
// //         }
// //       }
// //     };

// //     initializeStream();

// //     return () => {
// //       mounted = false;
      
// //       if (connectionTimeout) {
// //         clearTimeout(connectionTimeout);
// //       }
      
// //       console.log("[Broadcaster] Cleanup in initialization effect");
// //     };
// //   }, []);

// //   // Back button handler
// //   useEffect(() => {
// //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
// //       if (showCommentsSheet) {
// //         closeCommentsSheet();
// //         return true;
// //       }
      
// //       Alert.alert(
// //         "End Live Stream",
// //         "Are you sure you want to end your live stream?",
// //         [
// //           { text: "Cancel", style: "cancel" },
// //           { text: "End Stream", style: "destructive", onPress: () => endStream("back_button") }
// //         ]
// //       );
// //       return true;
// //     });

// //     return () => backHandler.remove();
// //   }, [showCommentsSheet]);

// //   // Navigation before remove
// //   useEffect(() => {
// //     const unsubscribe = navigation.addListener('beforeRemove', (e) => {
// //       if (streamEndedRef.current) {
// //         return;
// //       }

// //       e.preventDefault();

// //       Alert.alert(
// //         "End Live Stream",
// //         "Are you sure you want to end your live stream?",
// //         [
// //           { text: "Cancel", style: "cancel" },
// //           { text: "End Stream", style: "destructive", onPress: () => endStream("navigation") }
// //         ]
// //       );
// //     });

// //     return unsubscribe;
// //   }, [navigation]);

// //   // App state handler
// //   useEffect(() => {
// //     const subscription = AppState.addEventListener('change', (nextAppState) => {
// //       if (
// //         appState.current.match(/inactive|background/) && 
// //         nextAppState === 'active'
// //       ) {
// //         console.log('[Broadcaster] App has come to foreground');
// //         if (endStreamTimeoutRef.current) {
// //           clearTimeout(endStreamTimeoutRef.current);
// //         }
// //       } else if (
// //         appState.current === 'active' && 
// //         nextAppState.match(/inactive|background/)
// //       ) {
// //         console.log('[Broadcaster] App went to background');
        
// //         endStreamTimeoutRef.current = setTimeout(() => {
// //           if (!streamEndedRef.current) {
// //             console.log('[Broadcaster] Auto-ending stream due to extended background time');
// //             endStream("background_timeout");
// //           }
// //         }, 30000);
// //       }
      
// //       appState.current = nextAppState;
// //     });

// //     return () => {
// //       subscription.remove();
// //       if (endStreamTimeoutRef.current) {
// //         clearTimeout(endStreamTimeoutRef.current);
// //       }
// //     };
// //   }, []);

// //   // Fetch broadcaster data
// //   useEffect(() => {
// //     const fetchBroadcasterData = async () => {
// //       console.log("Fetching broadcaster data...");
// //       try {
// //         const userData = await AsyncStorage.getItem("userData");
// //         if (userData) {
// //           const parsedData = JSON.parse(userData);
// //           const broadcaster = {
// //             name: parsedData.name || "Broadcaster",
// //             profileImage: parsedData.profile_picture || "",
// //           };
// //           console.log('broadcaster_details', broadcaster);
// //           setBroadcasterData(broadcaster);

// //           if (signaling.current) {
// //             signaling.current.send({
// //               type: "broadcaster-info",
// //               streamId,
// //               broadcaster,
// //             });
// //           }

// //           await sendBroadcasterLiveData(broadcaster);
// //         }
// //       } catch (err) {
// //         console.warn("Error fetching broadcaster data:", err);
// //       }
// //     };

// //     fetchBroadcasterData();
// //   }, []);

// //   // Control functions
// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const newMuted = !isMuted;
// //       localStream.current.getAudioTracks().forEach((t) => {
// //         t.enabled = !newMuted;
// //       });
// //       setIsMuted(newMuted);
      
// //       try {
// //         InCallManager.setMicrophoneMute(newMuted);
// //       } catch (err) {
// //         console.warn("Error toggling microphone mute:", err);
// //       }
// //     }
// //   };

// //   const switchCamera = () => {
// //     if (localStream.current) {
// //       localStream.current.getVideoTracks().forEach((t) => {
// //         if (t._switchCamera) {
// //           t._switchCamera();
// //         }
// //       });
// //       setIsFrontCamera(!isFrontCamera);
// //     }
// //   };

// //   const toggleSpeaker = () => {
// //     const newSpeakerState = !speakerOn;
// //     try {
// //       InCallManager.setSpeakerphoneOn(newSpeakerState);
// //       if (Platform.OS === 'ios') {
// //         InCallManager.setForceSpeakerphoneOn(false);  
// //       }
// //     } catch (err) {
// //       console.warn("Error toggling speaker:", err);
// //     }
// //     setSpeakerOn(newSpeakerState);
// //   };

// //   const getRandomColor = (name) => {
// //     if (!name) return '#555';
    
// //     let hash = 0;
// //     for (let i = 0; i < name.length; i++) {
// //       hash = name.charCodeAt(i) + ((hash << 5) - hash);
// //     }
    
// //     const colors = [
// //       '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
// //       '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
// //     ];
    
// //     return colors[Math.abs(hash) % colors.length];
// //   };

// //   const toggleControls = () => {
// //     setShowControls(!showControls);
// //   };

// //   const formatTime = (date) => {
// //     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //   };

// //   const confirmEndStream = () => {
// //     Alert.alert(
// //       "End Live Stream",
// //       "Are you sure you want to end your live stream?",
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { text: "End Stream", style: "destructive", onPress: () => endStream("manual") }
// //       ]
// //     );
// //   };

// //   const handleCommentLongPress = (comment) => {
// //     setSelectedComment(comment);
// //     setShowCommentActions(true);
// //   };

// //   const renderComment = ({ item }) => (
// //     <TouchableOpacity
// //       onLongPress={() => handleCommentLongPress(item)}
// //       activeOpacity={0.7}
// //       style={[
// //         styles.commentItem,
// //         item.isSystemMessage && styles.systemMessageItem
// //       ]}
// //     >
// //       <View style={styles.commentHeader}>
// //         {item.viewerProfileImage ? (
// //           <Image
// //             source={{ uri: item.viewerProfileImage.startsWith('http') 
// //               ? item.viewerProfileImage 
// //               : `${API_ROUTE_IMAGE}${item.viewerProfileImage}`}}
// //             style={styles.commentAvatar}
// //           />
// //         ) : (
// //           <View style={[styles.commentAvatarPlaceholder, { backgroundColor: getRandomColor(item.viewerName) }]}>
// //             <Text style={styles.commentAvatarInitial}>
// //               {item.viewerName ? item.viewerName.charAt(0).toUpperCase() : 'A'}
// //             </Text>
// //           </View>
// //         )}
// //         <View style={styles.commentContent}>
// //           <View style={styles.commentNameRow}>
// //             <Text style={[
// //               styles.commentViewerName,
// //               item.isSystemMessage && styles.systemMessageName
// //             ]}>
// //               {item.viewerName}
// //             </Text>
// //             <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
// //           </View>
// //           <Text style={[
// //             styles.commentText,
// //             item.isSystemMessage && styles.systemMessageText
// //           ]}>
// //             {item.text}
// //           </Text>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   const bottomSheetTranslateY = bottomSheetAnimation.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [height, height - BOTTOM_SHEET_MAX_HEIGHT],
// //   });

// //   const bottomSheetOpacity = bottomSheetAnimation.interpolate({
// //     inputRange: [0, 0.5, 1],
// //     outputRange: [0, 1, 1],
// //   });

// //   if (streamError) {
// //     return (
// //       <View style={[styles.container, styles.placeholder]}>
// //         <IconMaterial name="error-outline" size={60} color="#ff375f" />
// //         <Text style={[styles.placeholderText, { fontSize: 18, marginTop: 20 }]}>
// //           Stream Error
// //         </Text>
// //         <Text style={[styles.placeholderText, { fontSize: 14, marginTop: 10, textAlign: 'center' }]}>
// //           {streamError}
// //         </Text>
// //         <TouchableOpacity 
// //           style={[styles.controlButton, { marginTop: 30, paddingHorizontal: 30 }]}
// //           onPress={() => navigation.goBack()}
// //         >
// //           <Text style={{ color: '#fff', fontSize: 16 }}>Go Back</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {localStreamState ? (
// //         <RTCView
// //           streamURL={localStreamState.toURL()}
// //           style={styles.videoStream}
// //           objectFit="cover"
// //           mirror={isFrontCamera}
// //         />
// //       ) : (
// //         <View style={[styles.videoStream, styles.placeholder]}>
// //           <IconMaterial name="live-tv" size={60} color="#666" />
// //           <Text style={styles.placeholderText}>Starting stream...</Text>
// //         </View>
// //       )}

// //       {hearts.map((heart) => (
// //         <Animated.View
// //           key={heart.id}
// //           style={[
// //             styles.heartContainer,
// //             {
// //               left: heart.position.x - 25,
// //               top: heart.position.y - 25,
// //               transform: [
// //                 { scale: heart.scale },
// //                 { translateY: heart.translateY },
// //                 { translateX: heart.translateX },
// //               ],
// //               opacity: heart.opacity,
// //             },
// //           ]}
// //         >
// //           <Icon name="heart" size={50} color="#ff375f" />
// //         </Animated.View>
// //       ))}

// //       <TouchableOpacity style={styles.tapArea} onPress={toggleControls} activeOpacity={1} />

// //       {showControls && (
// //         <SafeAreaView style={styles.header}>
// //           <View style={styles.headerContent}>
// //             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
// //               <Icon name="chevron-back" size={24} color="#fff" />
// //             </TouchableOpacity>

// //             <View style={styles.streamInfo}>
// //               <View style={styles.liveBadge}>
// //                 <View style={styles.liveDot} />
// //                 <Text style={styles.liveText}>LIVE</Text>
// //               </View>
// //               <Text style={styles.streamStats}>
// //                 {viewerCount} watching • {likes} likes
// //               </Text>
// //             </View>

// //             <TouchableOpacity 
// //               style={styles.commentsHeaderButton}
// //               onPress={openCommentsSheet}
// //             >
// //               <Icon name="chatbubbles" size={22} color="#fff" />
// //               {unreadComments > 0 && (
// //                 <View style={styles.unreadBadge}>
// //                   <Text style={styles.unreadBadgeText}>
// //                     {unreadComments > 99 ? '99+' : unreadComments}
// //                   </Text>
// //                 </View>
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         </SafeAreaView>
// //       )}

// //       {showControls && (
// //         <View style={styles.statsCard}>
// //           <View style={styles.statItem}>
// //             <Icon name="people" size={16} color="#fff" />
// //             <Text style={styles.statText}>{viewerCount}</Text>
// //           </View>
// //           <Animated.View
// //             style={[
// //               styles.statItem,
// //               {
// //                 transform: [
// //                   {
// //                     scale: likeAnimation.interpolate({
// //                       inputRange: [0, 1],
// //                       outputRange: [1, 1.3],
// //                     }),
// //                   },
// //                 ],
// //               },
// //             ]}
// //           >
// //             <Icon name="heart" size={16} color="#ff375f" />
// //             <Text style={[styles.statText, styles.likeCount]}>{likes}</Text>
// //           </Animated.View>
// //           <TouchableOpacity 
// //             style={styles.statItem}
// //             onPress={openCommentsSheet}
// //           >
// //             <Icon name="chatbubble" size={16} color="#fff" />
// //             <Text style={styles.statText}>{comments.length}</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {showControls && comments.length > 0 && !showCommentsSheet && (
// //         <View style={styles.commentsPreview}>
// //           <FlatList
// //             data={comments.slice(-3)}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.previewComment}>
// //                 <Text style={styles.previewCommentName}>
// //                   {item.viewerName}:
// //                 </Text>
// //                 <Text style={styles.previewCommentText} numberOfLines={1}>
// //                   {item.text}
// //                 </Text>
// //               </View>
// //             )}
// //             scrollEnabled={false}
// //           />
// //         </View>
// //       )}

// //       <Modal
// //         visible={showCommentsSheet}
// //         transparent={true}
// //         animationType="none"
// //         onRequestClose={closeCommentsSheet}
// //       >
// //         <View style={styles.bottomSheetOverlay}>
// //           <TouchableOpacity 
// //             style={styles.bottomSheetBackdrop}
// //             onPress={closeCommentsSheet}
// //             activeOpacity={1}
// //           />
// //           <Animated.View
// //             style={[
// //               styles.bottomSheetContainer,
// //               {
// //                 transform: [{ translateY: bottomSheetTranslateY }],
// //                 opacity: bottomSheetOpacity,
// //               },
// //             ]}
// //             {...panResponder.panHandlers}
// //           >
// //             <View style={styles.bottomSheetHeader}>
// //               <View style={styles.bottomSheetDragIndicator} />
// //               <View style={styles.bottomSheetTitleRow}>
// //                 <Text style={styles.bottomSheetTitle}>
// //                   Live Chat • {comments.length} messages
// //                 </Text>
// //                 <TouchableOpacity onPress={closeCommentsSheet}>
// //                   <Icon name="close" size={24} color="#fff" />
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
            
// //             <FlatList
// //               data={comments}
// //               keyExtractor={(item) => item.id}
// //               renderItem={renderComment}
// //               style={styles.bottomSheetList}
// //               contentContainerStyle={styles.bottomSheetListContent}
// //               showsVerticalScrollIndicator={false}
// //             />
// //           </Animated.View>
// //         </View>
// //       </Modal>

// //       <Modal
// //         visible={showCommentActions}
// //         transparent={true}
// //         animationType="fade"
// //         onRequestClose={() => setShowCommentActions(false)}
// //       >
// //         <TouchableOpacity 
// //           style={styles.actionsOverlay}
// //           onPress={() => setShowCommentActions(false)}
// //           activeOpacity={1}
// //         >
// //           <View style={styles.actionsContainer}>
// //             <Text style={styles.actionsTitle}>Comment Actions</Text>
            
// //             <TouchableOpacity 
// //               style={styles.actionButton}
// //               onPress={() => {
// //                 setShowCommentActions(false);
// //               }}
// //             >
// //               <Icon name="ban-outline" size={20} color="#ff375f" />
// //               <Text style={[styles.actionButtonText, { color: '#ff375f' }]}>
// //                 Block User
// //               </Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={styles.actionButton}
// //               onPress={() => {
// //                 setShowCommentActions(false);
// //               }}
// //             >
// //               <Icon name="flag-outline" size={20} color="#ffaa00" />
// //               <Text style={[styles.actionButtonText, { color: '#ffaa00' }]}>
// //                 Report Comment
// //               </Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.actionButton, styles.cancelActionButton]}
// //               onPress={() => setShowCommentActions(false)}
// //             >
// //               <Text style={styles.cancelActionText}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </TouchableOpacity>
// //       </Modal>

// //       {showControls && (
// //         <View style={styles.controlsBar}>
// //           <TouchableOpacity
// //             style={[styles.controlButton, isMuted && styles.controlButtonActive]}
// //             onPress={toggleMute}
// //           >
// //             <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={[styles.controlButton, styles.endButton]}
// //             onPress={confirmEndStream}
// //           >
// //             <Icon name="close" size={24} color="#fff" />
// //             <Text style={styles.endButtonText}>End</Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //             <Icon name="camera-reverse" size={24} color="#fff" />
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={[styles.controlButton, speakerOn && styles.controlButtonActive]}
// //             onPress={toggleSpeaker}
// //           >
// //             <Icon
// //               name={speakerOn ? "volume-high" : "volume-mute"}
// //               size={24}
// //               color="#fff"
// //             />
// //           </TouchableOpacity>
// //         </View>
// //       )}
// //     </View>
// //   );
// // }


// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#000",
// //   },
// //   videoStream: {
// //     flex: 1,
// //     width: "100%",
// //     height: "100%",
// //   },
// //   placeholder: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#111",
// //   },
// //   placeholderText: {
// //     color: "#666",
// //     marginTop: 10,
// //     fontSize: 16,
// //   },
// //   heartContainer: {
// //     position: "absolute",
// //     width: 50,
// //     height: 50,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     zIndex: 1000,
// //     elevation: 1000,
// //   },
// //   tapArea: {
// //     position: "absolute",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: 1,
// //   },
// //   header: {
// //     position: "absolute",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     zIndex: 10,
// //   },
// //   headerContent: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 15,
// //     paddingVertical: 10,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //   },
// //   backButton: {
// //     padding: 8,
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     borderRadius: 20,
// //   },
// //   streamInfo: {
// //     flex: 1,
// //     alignItems: "center",
// //   },
// //   liveBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#ff375f",
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDot: {
// //     width: 6,
// //     height: 6,
// //     borderRadius: 3,
// //     backgroundColor: "#fff",
// //     marginRight: 6,
// //   },
// //   liveText: {
// //     color: "#fff",
// //     fontSize: 12,
// //     fontWeight: "bold",
// //   },
// //   streamStats: {
// //     color: "#fff",
// //     fontSize: 11,
// //     marginTop: 4,
// //     opacity: 0.9,
// //   },
// //   commentsHeaderButton: {
// //     padding: 8,
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     borderRadius: 20,
// //     position: "relative",
// //   },
// //   unreadBadge: {
// //     position: "absolute",
// //     top: -5,
// //     right: -5,
// //     backgroundColor: "#ff375f",
// //     borderRadius: 10,
// //     minWidth: 18,
// //     height: 18,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1.5,
// //     borderColor: "#fff",
// //   },
// //   unreadBadgeText: {
// //     color: "#fff",
// //     fontSize: 10,
// //     fontWeight: "bold",
// //   },
// //   statsCard: {
// //     position: "absolute",
// //     top: 100,
// //     right: 20,
// //     backgroundColor: "rgba(0,0,0,0.7)",
// //     borderRadius: 30,
// //     padding: 12,
// //     zIndex: 10,
// //   },
// //   statItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginVertical: 4,
// //   },
// //   statText: {
// //     color: "#fff",
// //     fontSize: 14,
// //     fontWeight: "600",
// //     marginLeft: 8,
// //   },
// //   likeCount: {
// //     color: "#ff375f",
// //   },
// //   commentsPreview: {
// //     position: "absolute",
// //     left: 20,
// //     bottom: 100,
// //     right: 20,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     borderRadius: 12,
// //     padding: 12,
// //     zIndex: 5,
// //   },
// //   previewComment: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 4,
// //   },
// //   previewCommentName: {
// //     color: "#4A9EFF",
// //     fontSize: 12,
// //     fontWeight: "bold",
// //     marginRight: 6,
// //   },
// //   previewCommentText: {
// //     color: "#fff",
// //     fontSize: 12,
// //     flex: 1,
// //   },
// //   controlsBar: {
// //     position: "absolute",
// //     bottom: 35,
// //     left: 20,
// //     right: 20,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.7)",
// //     borderRadius: 50,
// //     padding: 15,
// //     zIndex: 10,
// //   },
// //   controlButton: {
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 20,
// //     backgroundColor: "rgba(255,255,255,0.1)",
// //   },
// //   controlButtonActive: {
// //     backgroundColor: "rgba(255,55,95,0.3)",
// //   },
// //   endButton: {
// //     backgroundColor: "#ff375f",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //   },
// //   endButtonText: {
// //     color: "#fff",
// //     fontSize: 14,
// //     fontWeight: "600",
// //     marginLeft: 6,
// //   },
// //   bottomSheetOverlay: {
// //     flex: 1,
// //     backgroundColor: "transparent",
// //   },
// //   bottomSheetBackdrop: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //   },
// //   bottomSheetContainer: {
// //     position: "absolute",
// //     left: 0,
// //     right: 0,
// //     height: BOTTOM_SHEET_MAX_HEIGHT,
// //     backgroundColor: "#1a1a1a",
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     paddingTop: 10,
// //   },
// //   bottomSheetHeader: {
// //     paddingHorizontal: 20,
// //     paddingBottom: 10,
// //   },
// //   bottomSheetDragIndicator: {
// //     width: 40,
// //     height: 4,
// //     backgroundColor: "#666",
// //     borderRadius: 2,
// //     alignSelf: "center",
// //     marginBottom: 10,
// //   },
// //   bottomSheetTitleRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   bottomSheetTitle: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "bold",
// //   },
// //   bottomSheetList: {
// //     flex: 1,
// //   },
// //   bottomSheetListContent: {
// //     paddingHorizontal: 20,
// //     paddingBottom: 20,
// //   },
// //   commentItem: {
// //     marginBottom: 15,
// //   },
// //   systemMessageItem: {
// //     opacity: 0.7,
// //   },
// //   commentHeader: {
// //     flexDirection: "row",
// //   },
// //   commentAvatar: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     marginRight: 12,
// //     borderWidth: 1,
// //     borderColor: "rgba(255,255,255,0.2)",
// //   },
// //   commentAvatarPlaceholder: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginRight: 12,
// //     borderWidth: 1,
// //     borderColor: "rgba(255,255,255,0.2)",
// //   },
// //   commentAvatarInitial: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   commentContent: {
// //     flex: 1,
// //   },
// //   commentNameRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 4,
// //   },
// //   commentViewerName: {
// //     color: "#4A9EFF",
// //     fontSize: 14,
// //     fontWeight: "bold",
// //   },
// //   systemMessageName: {
// //     color: "#FFA500",
// //   },
// //   commentTime: {
// //     color: "rgba(255,255,255,0.4)",
// //     fontSize: 10,
// //   },
// //   commentText: {
// //     color: "#fff",
// //     fontSize: 14,
// //     lineHeight: 18,
// //   },
// //   systemMessageText: {
// //     fontStyle: "italic",
// //   },
// //   actionsOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   actionsContainer: {
// //     backgroundColor: "#1a1a1a",
// //     borderRadius: 20,
// //     padding: 20,
// //     width: "80%",
// //     maxWidth: 300,
// //   },
// //   actionsTitle: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     marginBottom: 20,
// //     textAlign: "center",
// //   },
// //   actionButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingVertical: 15,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     backgroundColor: "#2a2a2a",
// //   },
// //   actionButtonText: {
// //     fontSize: 16,
// //     marginLeft: 12,
// //   },
// //   cancelActionButton: {
// //     backgroundColor: "#333",
// //     justifyContent: "center",
// //     marginTop: 5,
// //   },
// //   cancelActionText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     textAlign: "center",
// //     flex: 1,
// //   },
// // });

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
//   Modal,
//   PanResponder,
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
// const BOTTOM_SHEET_MAX_HEIGHT = height * 0.7;

// export default function Broadcaster({ route, navigation }) {
//   const { roomName, streamId } = route.params;
//   const safeRoomName = encodeURIComponent(roomName.replace(/\s+/g, "-"));

//   const signaling = useRef(null);
//   const localStream = useRef(null);
//   const peerConnections = useRef({});
//   const likeAnimation = useRef(new Animated.Value(0)).current;
//   const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
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
//   const [showCommentsSheet, setShowCommentsSheet] = useState(false);
//   const [unreadComments, setUnreadComments] = useState(0);
//   const [selectedComment, setSelectedComment] = useState(null);
//   const [showCommentActions, setShowCommentActions] = useState(false);
//   const [duration, setDuration] = useState(0); // seconds since the stream actually went live

//   const streamStartTimeRef = useRef(null);
//   const durationIntervalRef = useRef(null);
//   const pendingCandidates = useRef({}); // viewer_id -> [candidate, ...] arrived before pc/remoteDescription was ready

//   const appState = useRef(AppState.currentState);
//   const streamEndedRef = useRef(false);
//   const endStreamTimeoutRef = useRef(null);

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           const newValue = Math.max(0, 1 - gestureState.dy / 300);
//           bottomSheetAnimation.setValue(newValue);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 50) {
//           closeCommentsSheet();
//         } else {
//           openCommentsSheet();
//         }
//       },
//     })
//   ).current;

//   const openCommentsSheet = () => {
//     setShowCommentsSheet(true);
//     setUnreadComments(0);
//     Animated.timing(bottomSheetAnimation, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeCommentsSheet = () => {
//     Animated.timing(bottomSheetAnimation, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowCommentsSheet(false);
//     });
//   };

//   const endStream = async (reason = "manual") => {
//     if (streamEndedRef.current || isStreamEnding) return;

//     streamEndedRef.current = true;
//     setIsStreamEnding(true);

//     console.log(`[Broadcaster] Ending stream - Reason: ${reason}`);

//     try {
//       if (endStreamTimeoutRef.current) {
//         clearTimeout(endStreamTimeoutRef.current);
//       }

//       if (durationIntervalRef.current) {
//         clearInterval(durationIntervalRef.current);
//         durationIntervalRef.current = null;
//       }

//       try {
//         InCallManager.stopRingtone();
//         InCallManager.stop();
//       } catch (e) {
//         console.warn("Error stopping ringtone:", e);
//       }

//       if (signaling.current) {
//         try {
//           signaling.current.send({
//             type: "end-stream",
//             streamId,
//             reason,
//           });
//           signaling.current.close();
//         } catch (e) {
//           console.warn("Error closing signaling:", e);
//         }
//       }

//       if (localStream.current) {
//         try {
//           localStream.current.getAudioTracks().forEach((track) => {
//             track.enabled = false;
//           });

//           localStream.current.getTracks().forEach((track) => {
//             track.stop();
//             track.enabled = false;
//           });
//           localStream.current = null;
//           setLocalStreamState(null);
//         } catch (e) {
//           console.warn("Error stopping tracks:", e);
//         }
//       }

//       Object.values(peerConnections.current).forEach((pc) => {
//         try {
//           pc.close();
//         } catch (e) {
//           console.warn("Error closing peer connection:", e);
//         }
//       });
//       peerConnections.current = {};
//       pendingCandidates.current = {};

//       try {
//         InCallManager.stop();
//         InCallManager.setKeepScreenOn(false);
//         InCallManager.setSpeakerphoneOn(false);
//         if (Platform.OS === "ios") {
//           InCallManager.setForceSpeakerphoneOn(false);
//         }
//       } catch (e) {
//         console.warn("Error stopping InCallManager:", e);
//       }

//       try {
//         const token = await AsyncStorage.getItem("userToken");
//         if (token) {
//           await fetch(`${API_ROUTE}/live-streams/end/`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               stream_id: streamId,
//               ended_by: reason,
//             }),
//           });
//         }
//       } catch (err) {
//         console.warn("[Broadcaster] Failed to notify backend of stream end:", err);
//       }

//       setTimeout(() => {
//         navigation.goBack();
//       }, 300);
//     } catch (err) {
//       console.warn("[Broadcaster] Error during stream cleanup:", err);
//       navigation.goBack();
//     }
//   };

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
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           stream_id: streamId,
//           title: "My Live Stream",
//         }),
//       });
//       console.log("[Broadcaster] Live data sent to backend");
//     } catch (err) {
//       console.warn("[Broadcaster] Failed to send live data", err);
//     }
//   };

//   const waitForLocalStream = (timeoutMs = 8000) => {
//     return new Promise((resolve, reject) => {
//       if (localStream.current) return resolve(localStream.current);
//       const start = Date.now();
//       const interval = setInterval(() => {
//         if (localStream.current) {
//           clearInterval(interval);
//           resolve(localStream.current);
//         } else if (Date.now() - start > timeoutMs) {
//           clearInterval(interval);
//           reject(new Error("Local stream not ready in time"));
//         }
//       }, 100);
//     });
//   };

//   // ========== onSignalingMessage ==========
//   const onSignalingMessage = async (msg) => {
//     if (!msg || !msg.type) return;

//     console.log("📥 Received message:", msg.type, msg);

//     // ========== DATA MESSAGES ==========
//     if (msg.type === "viewer-count") {
//       setViewerCount(msg.count);
//       return;
//     } else if (msg.type === "comment") {
//       console.log("💬 New comment:", {
//         from: msg.username,
//         text: msg.text,
//         viewerId: msg.viewer_id,
//       });

//       setComments((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           text: msg.text,
//           viewerId: msg.viewer_id,
//           viewerName: msg.username || "Anonymous",
//           viewerProfileImage: msg.profilePicture || "",
//           timestamp: new Date(),
//         },
//       ]);

//       if (!showCommentsSheet) {
//         setUnreadComments((prev) => prev + 1);
//       }

//       // Relay it out to every viewer in the room. We don't rely on the
//       // backend forwarding viewer->viewer messages — we only know
//       // broadcaster->room broadcasts work (confirmed via end-stream),
//       // so we use that proven path to fan comments out to everyone.
//       if (signaling.current) {
//         signaling.current.send({
//           type: "comment-relay",
//           text: msg.text,
//           username: msg.username || "Anonymous",
//           profilePicture: msg.profilePicture || "",
//           viewer_id: msg.viewer_id,
//           streamId,
//           timestamp: Date.now(),
//         });
//       }
//       return;
//     } else if (msg.type === "like") {
//       setLikes((prev) => prev + 1);
//       animateLikeCounter();
//       createHeartAnimation();

//       // Same relay pattern for likes so every viewer's heart animation fires,
//       // not just the broadcaster's.
//       if (signaling.current) {
//         signaling.current.send({
//           type: "like-relay",
//           viewer_id: msg.viewer_id,
//           username: msg.username,
//           streamId,
//           timestamp: Date.now(),
//         });
//       }
//       return;
//     } else if (msg.type === "viewer-joined") {
//       console.log("👋 Viewer joined:", {
//         username: msg.username,
//         viewerId: msg.viewer_id,
//       });

//       setViewerCount((prev) => prev + 1);

//       setComments((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           text: `👋 ${msg.username || "A viewer"} joined the stream`,
//           viewerId: msg.viewer_id,
//           viewerName: "System",
//           isSystemMessage: true,
//           timestamp: new Date(),
//         },
//       ]);
//       return;
//     } else if (msg.type === "viewer-left") {
//       console.log("👋 Viewer left:", {
//         username: msg.username,
//         viewerId: msg.viewer_id,
//       });

//       setViewerCount((prev) => Math.max(0, prev - 1));

//       setComments((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           text: `👋 ${msg.username || "A viewer"} left the stream`,
//           viewerId: msg.viewer_id,
//           viewerName: "System",
//           isSystemMessage: true,
//           timestamp: new Date(),
//         },
//       ]);
//       return;
//     }

//     // ========== WEBRTC SIGNALING HANDLERS ==========

//     // Viewer sends offer to join the stream
//     if (msg.type === "viewer-offer") {
//       const viewerId = msg.viewer_id;
//       let pc = peerConnections.current[viewerId];

//       if (!pc) {
//         console.log("🎥 Creating new peer connection for viewer:", viewerId);
//         pc = new RTCPeerConnection(rtcConfig);
//         peerConnections.current[viewerId] = pc;

//         pc.onicecandidate = (e) => {
//           if (e.candidate) {
//             console.log(`❄️ Broadcaster ICE candidate for viewer ${viewerId}`);
//             signaling.current.send({
//               type: "candidate",
//               candidate: {
//                 candidate: e.candidate.candidate,
//                 sdpMLineIndex: e.candidate.sdpMLineIndex,
//                 sdpMid: e.candidate.sdpMid,
//               },
//               streamId: streamId,
//               viewer_id: viewerId,
//             });
//           }
//         };

//         // Add local stream tracks — wait if getUserMedia hasn't resolved yet
//         try {
//           const stream = await waitForLocalStream();
//           console.log("📹 Adding local stream tracks to peer connection");
//           stream.getTracks().forEach((track) => {
//             console.log("📹 Adding track:", track.kind);
//             pc.addTrack(track, stream);
//           });
//         } catch (err) {
//           console.error("❌ Local stream never became available — cannot answer viewer:", viewerId, err);
//           try {
//             pc.close();
//           } catch (e) {}
//           delete peerConnections.current[viewerId];
//           return;
//         }
//       }

//       // Handle the offer
//       if (!pc.remoteDescription) {
//         console.log("📞 Setting remote description and creating answer for viewer:", viewerId);
//         try {
//           await pc.setRemoteDescription(msg.offer);

//           // Flush any ICE candidates that arrived before remoteDescription was set
//           const queued = pendingCandidates.current[viewerId] || [];
//           if (queued.length > 0) {
//             console.log(`❄️ Flushing ${queued.length} queued candidates for viewer:`, viewerId);
//           }
//           for (const c of queued) {
//             try {
//               await pc.addIceCandidate(c);
//             } catch (e) {
//               console.warn("Failed to add queued ICE candidate:", e);
//             }
//           }
//           pendingCandidates.current[viewerId] = [];

//           const answer = await pc.createAnswer();
//           await pc.setLocalDescription(answer);

//           signaling.current.send({
//             type: "broadcaster-answer",
//             streamId: streamId,
//             viewer_id: viewerId,
//             answer: {
//               type: answer.type,
//               sdp: answer.sdp,
//             },
//           });
//           console.log("✅ Sent broadcaster-answer to viewer:", viewerId);
//         } catch (err) {
//           console.error("❌ Error handling viewer-offer:", err);
//         }
//       }
//       return;
//     }

//     // ICE candidate from viewer
//     else if (msg.type === "candidate" && msg.viewer_id) {
//       const pc = peerConnections.current[msg.viewer_id];
//       if (pc && pc.remoteDescription && msg.candidate) {
//         try {
//           console.log("❄️ Adding ICE candidate for viewer:", msg.viewer_id);
//           await pc.addIceCandidate(msg.candidate);
//         } catch (err) {
//           console.warn("[Broadcaster] addIceCandidate error:", err);
//         }
//       } else if (msg.candidate) {
//         // pc not created yet, or remoteDescription not set yet — queue it
//         console.log("❄️ Queuing early ICE candidate for viewer:", msg.viewer_id);
//         if (!pendingCandidates.current[msg.viewer_id]) {
//           pendingCandidates.current[msg.viewer_id] = [];
//         }
//         pendingCandidates.current[msg.viewer_id].push(msg.candidate);
//       }
//       return;
//     }

//     console.log("⚠️ Unhandled message type:", msg.type, msg);
//   };

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

//   // Initialize media and signaling
//   useEffect(() => {
//     let mounted = true;
//     let connectionTimeout = null;

//     const initializeStream = async () => {
//       try {
//         await getIceServers();

//         try {
//           InCallManager.start({
//             media: "video",
//             auto: true,
//           });

//           if (Platform.OS === "android") {
//             InCallManager.setSpeakerphoneOn(true);
//             InCallManager.setMicrophoneMute(false);
//           } else {
//             InCallManager.setForceSpeakerphoneOn(false);
//           }
//           InCallManager.setKeepScreenOn(true);
//         } catch (err) {
//           console.warn("[Broadcaster] InCallManager setup error:", err);
//         }

//         const stream = await mediaDevices.getUserMedia({
//           audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             autoGainControl: true,
//             channelCount: 2,
//             sampleRate: 48000,
//             sampleSize: 16,
//             volume: 1.0,
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

//         console.log(
//           "📹 Local stream tracks:",
//           stream.getTracks().map((t) => ({
//             kind: t.kind,
//             enabled: t.enabled,
//             readyState: t.readyState,
//           }))
//         );

//         localStream.current = stream;
//         setLocalStreamState(stream);
//         setStreamError(null);

//         // Start the live-duration timer now that we actually have a camera/mic
//         // stream — this is the moment the broadcaster is truly "live", not just
//         // when the screen mounted.
//         streamStartTimeRef.current = Date.now();
//         if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
//         durationIntervalRef.current = setInterval(() => {
//           if (streamStartTimeRef.current) {
//             setDuration(Math.floor((Date.now() - streamStartTimeRef.current) / 1000));
//           }
//         }, 1000);

//         console.log("🎤 Audio Tracks:", stream.getAudioTracks());
//         console.log("🎥 Video Tracks:", stream.getVideoTracks());

//         stream.getAudioTracks().forEach((track) => {
//           console.log("🎤 Audio Track:", {
//             enabled: track.enabled,
//             muted: track.muted,
//             readyState: track.readyState,
//             label: track.label,
//           });
//         });

//         signaling.current = new Signaling(safeRoomName, onSignalingMessage);

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

//         setTimeout(async () => {
//           const userData = await AsyncStorage.getItem("userData");
//           const parsed = JSON.parse(userData);

//           if (mounted && signaling.current?.isOpen) {
//             console.log("[Broadcaster] Sending start-stream message");

//             signaling.current.send({
//               type: "start-stream",
//               streamId,
//               streamInfo: {
//                 id: streamId,
//                 broadcasterId: parsed.id,
//                 broadcasterName: parsed.name,
//                 broadcasterProfile: parsed.profile_picture || "",
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
//       if (durationIntervalRef.current) {
//         clearInterval(durationIntervalRef.current);
//         durationIntervalRef.current = null;
//       }

//       console.log("[Broadcaster] Cleanup in initialization effect");
//     };
//   }, []);

//   // Back button handler
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
//       if (showCommentsSheet) {
//         closeCommentsSheet();
//         return true;
//       }

//       Alert.alert("End Live Stream", "Are you sure you want to end your live stream?", [
//         { text: "Cancel", style: "cancel" },
//         { text: "End Stream", style: "destructive", onPress: () => endStream("back_button") },
//       ]);
//       return true;
//     });

//     return () => backHandler.remove();
//   }, [showCommentsSheet]);

//   // Navigation before remove
//   useEffect(() => {
//     const unsubscribe = navigation.addListener("beforeRemove", (e) => {
//       if (streamEndedRef.current) {
//         return;
//       }

//       e.preventDefault();

//       Alert.alert("End Live Stream", "Are you sure you want to end your live stream?", [
//         { text: "Cancel", style: "cancel" },
//         { text: "End Stream", style: "destructive", onPress: () => endStream("navigation") },
//       ]);
//     });

//     return unsubscribe;
//   }, [navigation]);

//   // App state handler
//   useEffect(() => {
//     const subscription = AppState.addEventListener("change", (nextAppState) => {
//       if (appState.current.match(/inactive|background/) && nextAppState === "active") {
//         console.log("[Broadcaster] App has come to foreground");
//         if (endStreamTimeoutRef.current) {
//           clearTimeout(endStreamTimeoutRef.current);
//         }
//       } else if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
//         console.log("[Broadcaster] App went to background");

//         endStreamTimeoutRef.current = setTimeout(() => {
//           if (!streamEndedRef.current) {
//             console.log("[Broadcaster] Auto-ending stream due to extended background time");
//             endStream("background_timeout");
//           }
//         }, 30000);
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

//   // Fetch broadcaster data
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
//           console.log("broadcaster_details", broadcaster);
//           setBroadcasterData(broadcaster);

//           if (signaling.current) {
//             signaling.current.send({
//               type: "broadcaster-info",
//               streamId,
//               broadcaster,
//             });
//           }

//           await sendBroadcasterLiveData(broadcaster);
//         }
//       } catch (err) {
//         console.warn("Error fetching broadcaster data:", err);
//       }
//     };

//     fetchBroadcasterData();
//   }, []);

//   // Control functions
//   const toggleMute = () => {
//     if (localStream.current) {
//       const newMuted = !isMuted;
//       localStream.current.getAudioTracks().forEach((t) => {
//         t.enabled = !newMuted;
//       });
//       setIsMuted(newMuted);

//       try {
//         InCallManager.setMicrophoneMute(newMuted);
//       } catch (err) {
//         console.warn("Error toggling microphone mute:", err);
//       }
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
//       if (Platform.OS === "ios") {
//         InCallManager.setForceSpeakerphoneOn(false);
//       }
//     } catch (err) {
//       console.warn("Error toggling speaker:", err);
//     }
//     setSpeakerOn(newSpeakerState);
//   };

//   const getRandomColor = (name) => {
//     if (!name) return "#555";

//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }

//     const colors = [
//       "#FF6B6B",
//       "#4ECDC4",
//       "#45B7D1",
//       "#96CEB4",
//       "#FFEAA7",
//       "#DDA0DD",
//       "#98D8C8",
//       "#F7DC6F",
//       "#BB8FCE",
//       "#85C1E2",
//     ];

//     return colors[Math.abs(hash) % colors.length];
//   };

//   const toggleControls = () => {
//     setShowControls(!showControls);
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   // Formats seconds as LIVE duration, e.g. "05:23" or "1:02:11" past an hour
//   const formatDuration = (totalSeconds) => {
//     const hrs = Math.floor(totalSeconds / 3600);
//     const mins = Math.floor((totalSeconds % 3600) / 60);
//     const secs = totalSeconds % 60;
//     if (hrs > 0) {
//       return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//     }
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const confirmEndStream = () => {
//     Alert.alert("End Live Stream", "Are you sure you want to end your live stream?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "End Stream", style: "destructive", onPress: () => endStream("manual") },
//     ]);
//   };

//   const handleCommentLongPress = (comment) => {
//     setSelectedComment(comment);
//     setShowCommentActions(true);
//   };

//   const renderComment = ({ item }) => (
//     <TouchableOpacity
//       onLongPress={() => handleCommentLongPress(item)}
//       activeOpacity={0.7}
//       style={[styles.commentItem, item.isSystemMessage && styles.systemMessageItem]}
//     >
//       <View style={styles.commentHeader}>
//         {item.viewerProfileImage ? (
//           <Image
//             source={{
//               uri: item.viewerProfileImage.startsWith("http")
//                 ? item.viewerProfileImage
//                 : `${API_ROUTE_IMAGE}${item.viewerProfileImage}`,
//             }}
//             style={styles.commentAvatar}
//           />
//         ) : (
//           <View style={[styles.commentAvatarPlaceholder, { backgroundColor: getRandomColor(item.viewerName) }]}>
//             <Text style={styles.commentAvatarInitial}>
//               {item.viewerName ? item.viewerName.charAt(0).toUpperCase() : "A"}
//             </Text>
//           </View>
//         )}
//         <View style={styles.commentContent}>
//           <View style={styles.commentNameRow}>
//             <Text style={[styles.commentViewerName, item.isSystemMessage && styles.systemMessageName]}>
//               {item.viewerName}
//             </Text>
//             <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
//           </View>
//           <Text style={[styles.commentText, item.isSystemMessage && styles.systemMessageText]}>{item.text}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const bottomSheetTranslateY = bottomSheetAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [height, height - BOTTOM_SHEET_MAX_HEIGHT],
//   });

//   const bottomSheetOpacity = bottomSheetAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0, 1, 1],
//   });

//   if (streamError) {
//     return (
//       <View style={[styles.container, styles.placeholder]}>
//         <IconMaterial name="error-outline" size={60} color="#ff375f" />
//         <Text style={[styles.placeholderText, { fontSize: 18, marginTop: 20 }]}>Stream Error</Text>
//         <Text style={[styles.placeholderText, { fontSize: 14, marginTop: 10, textAlign: "center" }]}>
//           {streamError}
//         </Text>
//         <TouchableOpacity
//           style={[styles.controlButton, { marginTop: 30, paddingHorizontal: 30 }]}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={{ color: "#fff", fontSize: 16 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
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

//       {hearts.map((heart) => (
//         <Animated.View
//           key={heart.id}
//           style={[
//             styles.heartContainer,
//             {
//               left: heart.position.x - 25,
//               top: heart.position.y - 25,
//               transform: [{ scale: heart.scale }, { translateY: heart.translateY }, { translateX: heart.translateX }],
//               opacity: heart.opacity,
//             },
//           ]}
//         >
//           <Icon name="heart" size={50} color="#ff375f" />
//         </Animated.View>
//       ))}

//       <TouchableOpacity style={styles.tapArea} onPress={toggleControls} activeOpacity={1} />

//       {showControls && (
//         <SafeAreaView style={styles.header}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//               <Icon name="chevron-back" size={24} color="#fff" />
//             </TouchableOpacity>

//             <View style={styles.streamInfo}>
//               <View style={styles.liveBadge}>
//                 <View style={styles.liveDot} />
//                 <Text style={styles.liveText}>LIVE</Text>
//                 <Text style={styles.liveDuration}>{formatDuration(duration)}</Text>
//               </View>
//               <Text style={styles.streamStats}>
//                 {viewerCount} watching • {likes} likes
//               </Text>
//             </View>

//             <TouchableOpacity style={styles.commentsHeaderButton} onPress={openCommentsSheet}>
//               <Icon name="chatbubbles" size={22} color="#fff" />
//               {unreadComments > 0 && (
//                 <View style={styles.unreadBadge}>
//                   <Text style={styles.unreadBadgeText}>{unreadComments > 99 ? "99+" : unreadComments}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       )}

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
//           <TouchableOpacity style={styles.statItem} onPress={openCommentsSheet}>
//             <Icon name="chatbubble" size={16} color="#fff" />
//             <Text style={styles.statText}>{comments.length}</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {showControls && comments.length > 0 && !showCommentsSheet && (
//         <View style={styles.commentsPreview}>
//           <FlatList
//             data={comments.slice(-3)}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.previewComment}>
//                 <Text style={styles.previewCommentName}>{item.viewerName}:</Text>
//                 <Text style={styles.previewCommentText} numberOfLines={1}>
//                   {item.text}
//                 </Text>
//               </View>
//             )}
//             scrollEnabled={false}
//           />
//         </View>
//       )}

//       <Modal visible={showCommentsSheet} transparent={true} animationType="none" onRequestClose={closeCommentsSheet}>
//         <View style={styles.bottomSheetOverlay}>
//           <TouchableOpacity style={styles.bottomSheetBackdrop} onPress={closeCommentsSheet} activeOpacity={1} />
//           <Animated.View
//             style={[
//               styles.bottomSheetContainer,
//               {
//                 transform: [{ translateY: bottomSheetTranslateY }],
//                 opacity: bottomSheetOpacity,
//               },
//             ]}
//             {...panResponder.panHandlers}
//           >
//             <View style={styles.bottomSheetHeader}>
//               <View style={styles.bottomSheetDragIndicator} />
//               <View style={styles.bottomSheetTitleRow}>
//                 <Text style={styles.bottomSheetTitle}>Live Chat • {comments.length} messages</Text>
//                 <TouchableOpacity onPress={closeCommentsSheet}>
//                   <Icon name="close" size={24} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <FlatList
//               data={comments}
//               keyExtractor={(item) => item.id}
//               renderItem={renderComment}
//               style={styles.bottomSheetList}
//               contentContainerStyle={styles.bottomSheetListContent}
//               showsVerticalScrollIndicator={false}
//             />
//           </Animated.View>
//         </View>
//       </Modal>

//       <Modal
//         visible={showCommentActions}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowCommentActions(false)}
//       >
//         <TouchableOpacity
//           style={styles.actionsOverlay}
//           onPress={() => setShowCommentActions(false)}
//           activeOpacity={1}
//         >
//           <View style={styles.actionsContainer}>
//             <Text style={styles.actionsTitle}>Comment Actions</Text>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => {
//                 setShowCommentActions(false);
//               }}
//             >
//               <Icon name="ban-outline" size={20} color="#ff375f" />
//               <Text style={[styles.actionButtonText, { color: "#ff375f" }]}>Block User</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => {
//                 setShowCommentActions(false);
//               }}
//             >
//               <Icon name="flag-outline" size={20} color="#ffaa00" />
//               <Text style={[styles.actionButtonText, { color: "#ffaa00" }]}>Report Comment</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.actionButton, styles.cancelActionButton]}
//               onPress={() => setShowCommentActions(false)}
//             >
//               <Text style={styles.cancelActionText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {showControls && (
//         <View style={styles.controlsBar}>
//           <TouchableOpacity style={[styles.controlButton, isMuted && styles.controlButtonActive]} onPress={toggleMute}>
//             <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
//           </TouchableOpacity>

//           <TouchableOpacity style={[styles.controlButton, styles.endButton]} onPress={confirmEndStream}>
//             <Icon name="close" size={24} color="#fff" />
//             <Text style={styles.endButtonText}>End</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
//             <Icon name="camera-reverse" size={24} color="#fff" />
//           </TouchableOpacity>

//           <TouchableOpacity style={[styles.controlButton, speakerOn && styles.controlButtonActive]} onPress={toggleSpeaker}>
//             <Icon name={speakerOn ? "volume-high" : "volume-mute"} size={24} color="#fff" />
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
//   placeholder: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#111",
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
//     justifyContent: "space-between",
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
//     alignItems: "center",
//   },
//   liveBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ff375f",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   liveDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#fff",
//     marginRight: 6,
//   },
//   liveText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   liveDuration: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "600",
//     marginLeft: 6,
//     opacity: 0.9,
//   },
//   streamStats: {
//     color: "#fff",
//     fontSize: 11,
//     marginTop: 4,
//     opacity: 0.9,
//   },
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
//   unreadBadgeText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "bold",
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
//   commentsPreview: {
//     position: "absolute",
//     left: 20,
//     bottom: 100,
//     right: 20,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 12,
//     padding: 12,
//     zIndex: 5,
//   },
//   previewComment: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   previewCommentName: {
//     color: "#4A9EFF",
//     fontSize: 12,
//     fontWeight: "bold",
//     marginRight: 6,
//   },
//   previewCommentText: {
//     color: "#fff",
//     fontSize: 12,
//     flex: 1,
//   },
//   controlsBar: {
//     position: "absolute",
//     bottom: 35,
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
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 6,
//   },
//   bottomSheetOverlay: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },
//   bottomSheetBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   bottomSheetContainer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     height: BOTTOM_SHEET_MAX_HEIGHT,
//     backgroundColor: "#1a1a1a",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingTop: 10,
//   },
//   bottomSheetHeader: {
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//   },
//   bottomSheetDragIndicator: {
//     width: 40,
//     height: 4,
//     backgroundColor: "#666",
//     borderRadius: 2,
//     alignSelf: "center",
//     marginBottom: 10,
//   },
//   bottomSheetTitleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   bottomSheetTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   bottomSheetList: {
//     flex: 1,
//   },
//   bottomSheetListContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   commentItem: {
//     marginBottom: 15,
//   },
//   systemMessageItem: {
//     opacity: 0.7,
//   },
//   commentHeader: {
//     flexDirection: "row",
//   },
//   commentAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.2)",
//   },
//   commentAvatarPlaceholder: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.2)",
//   },
//   commentAvatarInitial: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentNameRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   commentViewerName: {
//     color: "#4A9EFF",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   systemMessageName: {
//     color: "#FFA500",
//   },
//   commentTime: {
//     color: "rgba(255,255,255,0.4)",
//     fontSize: 10,
//   },
//   commentText: {
//     color: "#fff",
//     fontSize: 14,
//     lineHeight: 18,
//   },
//   systemMessageText: {
//     fontStyle: "italic",
//   },
//   actionsOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   actionsContainer: {
//     backgroundColor: "#1a1a1a",
//     borderRadius: 20,
//     padding: 20,
//     width: "80%",
//     maxWidth: 300,
//   },
//   actionsTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginBottom: 10,
//     backgroundColor: "#2a2a2a",
//   },
//   actionButtonText: {
//     fontSize: 16,
//     marginLeft: 12,
//   },
//   cancelActionButton: {
//     backgroundColor: "#333",
//     justifyContent: "center",
//     marginTop: 5,
//   },
//   cancelActionText: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//     flex: 1,
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

export default function Broadcaster({ route, navigation }) {
  const { roomName, streamId } = route.params;
  const safeRoomName = encodeURIComponent(roomName.replace(/\s+/g, "-"));

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
  const [duration, setDuration] = useState(0); // seconds since the stream actually went live

  const streamStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const pendingCandidates = useRef({}); // viewer_id -> [candidate, ...] arrived before pc/remoteDescription was ready

  // Refs mirroring state that onSignalingMessage reads — the Signaling instance
  // is created once on mount and keeps calling the SAME closure forever, so any
  // state it reads directly would be frozen at its initial (empty) value. Refs
  // stay current no matter when the message arrives.
  const broadcasterDataRef = useRef({ name: "", profileImage: "" });
  const showCommentsSheetRef = useRef(false);

  const appState = useRef(AppState.currentState);
  const streamEndedRef = useRef(false);
  const endStreamTimeoutRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          const newValue = Math.max(0, 1 - gestureState.dy / 300);
          bottomSheetAnimation.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          closeCommentsSheet();
        } else {
          openCommentsSheet();
        }
      },
    })
  ).current;

  useEffect(() => {
    showCommentsSheetRef.current = showCommentsSheet;
  }, [showCommentsSheet]);

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

  const endStream = async (reason = "manual") => {
    if (streamEndedRef.current || isStreamEnding) return;

    streamEndedRef.current = true;
    setIsStreamEnding(true);

    console.log(`[Broadcaster] Ending stream - Reason: ${reason}`);

    try {
      if (endStreamTimeoutRef.current) {
        clearTimeout(endStreamTimeoutRef.current);
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

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
            reason,
          });
          signaling.current.close();
        } catch (e) {
          console.warn("Error closing signaling:", e);
        }
      }

      if (localStream.current) {
        try {
          localStream.current.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });

          localStream.current.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
          localStream.current = null;
          setLocalStreamState(null);
        } catch (e) {
          console.warn("Error stopping tracks:", e);
        }
      }

      Object.values(peerConnections.current).forEach((pc) => {
        try {
          pc.close();
        } catch (e) {
          console.warn("Error closing peer connection:", e);
        }
      });
      peerConnections.current = {};
      pendingCandidates.current = {};

      try {
        InCallManager.stop();
        InCallManager.setKeepScreenOn(false);
        InCallManager.setSpeakerphoneOn(false);
        if (Platform.OS === "ios") {
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
              Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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

  const waitForLocalStream = (timeoutMs = 8000) => {
    return new Promise((resolve, reject) => {
      if (localStream.current) return resolve(localStream.current);
      const start = Date.now();
      const interval = setInterval(() => {
        if (localStream.current) {
          clearInterval(interval);
          resolve(localStream.current);
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          reject(new Error("Local stream not ready in time"));
        }
      }, 100);
    });
  };

  // ========== onSignalingMessage ==========
  const onSignalingMessage = async (msg) => {
    if (!msg || !msg.type) return;

    console.log("📥 Received message:", msg.type, msg);

    // ========== DATA MESSAGES ==========
    if (msg.type === "viewer-count") {
      setViewerCount(msg.count);
      return;
    } else if (msg.type === "comment") {
      console.log("💬 New comment:", {
        from: msg.username,
        text: msg.text,
        viewerId: msg.viewer_id,
      });

      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: msg.text,
          viewerId: msg.viewer_id,
          viewerName: msg.username || "Anonymous",
          viewerProfileImage: msg.profilePicture || "",
          timestamp: new Date(),
        },
      ]);

      if (!showCommentsSheetRef.current) {
        setUnreadComments((prev) => prev + 1);
      }

      // Relay it out to every viewer in the room. We don't rely on the
      // backend forwarding viewer->viewer messages — we only know
      // broadcaster->room broadcasts work (confirmed via end-stream),
      // so we use that proven path to fan comments out to everyone.
      if (signaling.current) {
        signaling.current.send({
          type: "comment-relay",
          text: msg.text,
          username: msg.username || "Anonymous",
          profilePicture: msg.profilePicture || "",
          viewer_id: msg.viewer_id,
          streamId,
          timestamp: Date.now(),
        });
      }
      return;
    } else if (msg.type === "like") {
      setLikes((prev) => prev + 1);
      animateLikeCounter();
      createHeartAnimation();

      // Same relay pattern for likes so every viewer's heart animation fires,
      // not just the broadcaster's.
      if (signaling.current) {
        signaling.current.send({
          type: "like-relay",
          viewer_id: msg.viewer_id,
          username: msg.username,
          streamId,
          timestamp: Date.now(),
        });
      }
      return;
    } else if (msg.type === "viewer-joined") {
      console.log("👋 Viewer joined:", {
        username: msg.username,
        viewerId: msg.viewer_id,
      });

      setViewerCount((prev) => prev + 1);

      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `👋 ${msg.username || "A viewer"} joined the stream`,
          viewerId: msg.viewer_id,
          viewerName: "System",
          isSystemMessage: true,
          timestamp: new Date(),
        },
      ]);

      // Re-send our identity + when we actually went live every time someone
      // joins. This is what guarantees a LATE-joining viewer still learns who
      // they're watching and gets an accurate duration — a one-time send on
      // mount would silently miss anyone who joins after that first message.
      if (signaling.current) {
        signaling.current.send({
          type: "broadcaster-info",
          streamId,
          broadcaster: {
            name: broadcasterDataRef.current.name || "Broadcaster",
            profileImage: broadcasterDataRef.current.profileImage || "",
          },
          streamStartTime: streamStartTimeRef.current || Date.now(),
        });
      }
      return;
    } else if (msg.type === "viewer-left") {
      console.log("👋 Viewer left:", {
        username: msg.username,
        viewerId: msg.viewer_id,
      });

      setViewerCount((prev) => Math.max(0, prev - 1));

      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `👋 ${msg.username || "A viewer"} left the stream`,
          viewerId: msg.viewer_id,
          viewerName: "System",
          isSystemMessage: true,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    // ========== WEBRTC SIGNALING HANDLERS ==========

    // Viewer sends offer to join the stream
    if (msg.type === "viewer-offer") {
      const viewerId = msg.viewer_id;
      let pc = peerConnections.current[viewerId];

      if (!pc) {
        console.log("🎥 Creating new peer connection for viewer:", viewerId);
        pc = new RTCPeerConnection(rtcConfig);
        peerConnections.current[viewerId] = pc;

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            console.log(`❄️ Broadcaster ICE candidate for viewer ${viewerId}`);
            signaling.current.send({
              type: "candidate",
              candidate: {
                candidate: e.candidate.candidate,
                sdpMLineIndex: e.candidate.sdpMLineIndex,
                sdpMid: e.candidate.sdpMid,
              },
              streamId: streamId,
              viewer_id: viewerId,
            });
          }
        };

        // Add local stream tracks — wait if getUserMedia hasn't resolved yet
        try {
          const stream = await waitForLocalStream();
          console.log("📹 Adding local stream tracks to peer connection");
          stream.getTracks().forEach((track) => {
            console.log("📹 Adding track:", track.kind);
            pc.addTrack(track, stream);
          });
        } catch (err) {
          console.error("❌ Local stream never became available — cannot answer viewer:", viewerId, err);
          try {
            pc.close();
          } catch (e) {}
          delete peerConnections.current[viewerId];
          return;
        }
      }

      // Handle the offer
      if (!pc.remoteDescription) {
        console.log("📞 Setting remote description and creating answer for viewer:", viewerId);
        try {
          await pc.setRemoteDescription(msg.offer);

          // Flush any ICE candidates that arrived before remoteDescription was set
          const queued = pendingCandidates.current[viewerId] || [];
          if (queued.length > 0) {
            console.log(`❄️ Flushing ${queued.length} queued candidates for viewer:`, viewerId);
          }
          for (const c of queued) {
            try {
              await pc.addIceCandidate(c);
            } catch (e) {
              console.warn("Failed to add queued ICE candidate:", e);
            }
          }
          pendingCandidates.current[viewerId] = [];

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          signaling.current.send({
            type: "broadcaster-answer",
            streamId: streamId,
            viewer_id: viewerId,
            answer: {
              type: answer.type,
              sdp: answer.sdp,
            },
          });
          console.log("✅ Sent broadcaster-answer to viewer:", viewerId);
        } catch (err) {
          console.error("❌ Error handling viewer-offer:", err);
        }
      }
      return;
    }

    // ICE candidate from viewer
    else if (msg.type === "candidate" && msg.viewer_id) {
      const pc = peerConnections.current[msg.viewer_id];
      if (pc && pc.remoteDescription && msg.candidate) {
        try {
          console.log("❄️ Adding ICE candidate for viewer:", msg.viewer_id);
          await pc.addIceCandidate(msg.candidate);
        } catch (err) {
          console.warn("[Broadcaster] addIceCandidate error:", err);
        }
      } else if (msg.candidate) {
        // pc not created yet, or remoteDescription not set yet — queue it
        console.log("❄️ Queuing early ICE candidate for viewer:", msg.viewer_id);
        if (!pendingCandidates.current[msg.viewer_id]) {
          pendingCandidates.current[msg.viewer_id] = [];
        }
        pendingCandidates.current[msg.viewer_id].push(msg.candidate);
      }
      return;
    }

    console.log("⚠️ Unhandled message type:", msg.type, msg);
  };

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

  // Initialize media and signaling
  useEffect(() => {
    let mounted = true;
    let connectionTimeout = null;

    const initializeStream = async () => {
      try {
        await getIceServers();

        try {
          InCallManager.start({
            media: "video",
            auto: true,
          });

          if (Platform.OS === "android") {
            InCallManager.setSpeakerphoneOn(true);
            InCallManager.setMicrophoneMute(false);
          } else {
            InCallManager.setForceSpeakerphoneOn(false);
          }
          InCallManager.setKeepScreenOn(true);
        } catch (err) {
          console.warn("[Broadcaster] InCallManager setup error:", err);
        }

        const stream = await mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 2,
            sampleRate: 48000,
            sampleSize: 16,
            volume: 1.0,
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

        console.log(
          "📹 Local stream tracks:",
          stream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            readyState: t.readyState,
          }))
        );

        localStream.current = stream;
        setLocalStreamState(stream);
        setStreamError(null);

        // Start the live-duration timer now that we actually have a camera/mic
        // stream — this is the moment the broadcaster is truly "live", not just
        // when the screen mounted.
        streamStartTimeRef.current = Date.now();
        if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = setInterval(() => {
          if (streamStartTimeRef.current) {
            setDuration(Math.floor((Date.now() - streamStartTimeRef.current) / 1000));
          }
        }, 1000);

        console.log("🎤 Audio Tracks:", stream.getAudioTracks());
        console.log("🎥 Video Tracks:", stream.getVideoTracks());

        stream.getAudioTracks().forEach((track) => {
          console.log("🎤 Audio Track:", {
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState,
            label: track.label,
          });
        });

        signaling.current = new Signaling(safeRoomName, onSignalingMessage);

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

        setTimeout(async () => {
          const userData = await AsyncStorage.getItem("userData");
          const parsed = JSON.parse(userData);

          if (mounted && signaling.current?.isOpen) {
            console.log("[Broadcaster] Sending start-stream message");

            signaling.current.send({
              type: "start-stream",
              streamId,
              streamInfo: {
                id: streamId,
                broadcasterId: parsed.id,
                broadcasterName: parsed.name,
                broadcasterProfile: parsed.profile_picture || "",
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
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      console.log("[Broadcaster] Cleanup in initialization effect");
    };
  }, []);

  // Back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (showCommentsSheet) {
        closeCommentsSheet();
        return true;
      }

      Alert.alert("End Live Stream", "Are you sure you want to end your live stream?", [
        { text: "Cancel", style: "cancel" },
        { text: "End Stream", style: "destructive", onPress: () => endStream("back_button") },
      ]);
      return true;
    });

    return () => backHandler.remove();
  }, [showCommentsSheet]);

  // Navigation before remove
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (streamEndedRef.current) {
        return;
      }

      e.preventDefault();

      Alert.alert("End Live Stream", "Are you sure you want to end your live stream?", [
        { text: "Cancel", style: "cancel" },
        { text: "End Stream", style: "destructive", onPress: () => endStream("navigation") },
      ]);
    });

    return unsubscribe;
  }, [navigation]);

  // App state handler
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("[Broadcaster] App has come to foreground");
        if (endStreamTimeoutRef.current) {
          clearTimeout(endStreamTimeoutRef.current);
        }
      } else if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        console.log("[Broadcaster] App went to background");

        endStreamTimeoutRef.current = setTimeout(() => {
          if (!streamEndedRef.current) {
            console.log("[Broadcaster] Auto-ending stream due to extended background time");
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

  // Fetch broadcaster data
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
          console.log("broadcaster_details", broadcaster);
          setBroadcasterData(broadcaster);
          broadcasterDataRef.current = broadcaster; // keep the ref in sync for onSignalingMessage

          if (signaling.current) {
            signaling.current.send({
              type: "broadcaster-info",
              streamId,
              broadcaster,
              streamStartTime: streamStartTimeRef.current || null,
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

  // Control functions
  const toggleMute = () => {
    if (localStream.current) {
      const newMuted = !isMuted;
      localStream.current.getAudioTracks().forEach((t) => {
        t.enabled = !newMuted;
      });
      setIsMuted(newMuted);

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

  const toggleSpeaker = () => {
    const newSpeakerState = !speakerOn;
    try {
      InCallManager.setSpeakerphoneOn(newSpeakerState);
      if (Platform.OS === "ios") {
        InCallManager.setForceSpeakerphoneOn(false);
      }
    } catch (err) {
      console.warn("Error toggling speaker:", err);
    }
    setSpeakerOn(newSpeakerState);
  };

  const getRandomColor = (name) => {
    if (!name) return "#555";

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Formats seconds as LIVE duration, e.g. "05:23" or "1:02:11" past an hour
  const formatDuration = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const confirmEndStream = () => {
    Alert.alert("End Live Stream", "Are you sure you want to end your live stream?", [
      { text: "Cancel", style: "cancel" },
      { text: "End Stream", style: "destructive", onPress: () => endStream("manual") },
    ]);
  };

  const handleCommentLongPress = (comment) => {
    setSelectedComment(comment);
    setShowCommentActions(true);
  };

  const renderComment = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleCommentLongPress(item)}
      activeOpacity={0.7}
      style={[styles.commentItem, item.isSystemMessage && styles.systemMessageItem]}
    >
      <View style={styles.commentHeader}>
        {item.viewerProfileImage ? (
          <Image
            source={{
              uri: item.viewerProfileImage.startsWith("http")
                ? item.viewerProfileImage
                : `${API_ROUTE_IMAGE}${item.viewerProfileImage}`,
            }}
            style={styles.commentAvatar}
          />
        ) : (
          <View style={[styles.commentAvatarPlaceholder, { backgroundColor: getRandomColor(item.viewerName) }]}>
            <Text style={styles.commentAvatarInitial}>
              {item.viewerName ? item.viewerName.charAt(0).toUpperCase() : "A"}
            </Text>
          </View>
        )}
        <View style={styles.commentContent}>
          <View style={styles.commentNameRow}>
            <Text style={[styles.commentViewerName, item.isSystemMessage && styles.systemMessageName]}>
              {item.viewerName}
            </Text>
            <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
          </View>
          <Text style={[styles.commentText, item.isSystemMessage && styles.systemMessageText]}>{item.text}</Text>
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
        <Text style={[styles.placeholderText, { fontSize: 18, marginTop: 20 }]}>Stream Error</Text>
        <Text style={[styles.placeholderText, { fontSize: 14, marginTop: 10, textAlign: "center" }]}>
          {streamError}
        </Text>
        <TouchableOpacity
          style={[styles.controlButton, { marginTop: 30, paddingHorizontal: 30 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      {hearts.map((heart) => (
        <Animated.View
          key={heart.id}
          style={[
            styles.heartContainer,
            {
              left: heart.position.x - 25,
              top: heart.position.y - 25,
              transform: [{ scale: heart.scale }, { translateY: heart.translateY }, { translateX: heart.translateX }],
              opacity: heart.opacity,
            },
          ]}
        >
          <Icon name="heart" size={50} color="#ff375f" />
        </Animated.View>
      ))}

      <TouchableOpacity style={styles.tapArea} onPress={toggleControls} activeOpacity={1} />

      {showControls && (
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.streamInfo}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
                <Text style={styles.liveDuration}>{formatDuration(duration)}</Text>
              </View>
              <Text style={styles.streamStats}>
                {viewerCount} watching • {likes} likes
              </Text>
            </View>

            <TouchableOpacity style={styles.commentsHeaderButton} onPress={openCommentsSheet}>
              <Icon name="chatbubbles" size={22} color="#fff" />
              {unreadComments > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadComments > 99 ? "99+" : unreadComments}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

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
          <TouchableOpacity style={styles.statItem} onPress={openCommentsSheet}>
            <Icon name="chatbubble" size={16} color="#fff" />
            <Text style={styles.statText}>{comments.length}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showControls && comments.length > 0 && !showCommentsSheet && (
        <View style={styles.commentsPreview}>
          <FlatList
            data={comments.slice(-3)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.previewComment}>
                <Text style={styles.previewCommentName}>{item.viewerName}:</Text>
                <Text style={styles.previewCommentText} numberOfLines={1}>
                  {item.text}
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      <Modal visible={showCommentsSheet} transparent={true} animationType="none" onRequestClose={closeCommentsSheet}>
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={styles.bottomSheetBackdrop} onPress={closeCommentsSheet} activeOpacity={1} />
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
                <Text style={styles.bottomSheetTitle}>Live Chat • {comments.length} messages</Text>
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
                setShowCommentActions(false);
              }}
            >
              <Icon name="ban-outline" size={20} color="#ff375f" />
              <Text style={[styles.actionButtonText, { color: "#ff375f" }]}>Block User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setShowCommentActions(false);
              }}
            >
              <Icon name="flag-outline" size={20} color="#ffaa00" />
              <Text style={[styles.actionButtonText, { color: "#ffaa00" }]}>Report Comment</Text>
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

      {showControls && (
        <View style={styles.controlsBar}>
          <TouchableOpacity style={[styles.controlButton, isMuted && styles.controlButtonActive]} onPress={toggleMute}>
            <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, styles.endButton]} onPress={confirmEndStream}>
            <Icon name="close" size={24} color="#fff" />
            <Text style={styles.endButtonText}>End</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
            <Icon name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, speakerOn && styles.controlButtonActive]} onPress={toggleSpeaker}>
            <Icon name={speakerOn ? "volume-high" : "volume-mute"} size={24} color="#fff" />
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
  liveDuration: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 6,
    opacity: 0.9,
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
    bottom: 35,
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







