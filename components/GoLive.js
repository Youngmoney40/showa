
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   TextInput,
//   KeyboardAvoidingView,
//   Image
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";
// import { encode as btoa } from "base-64";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_ROUTE_IMAGE } from "../api_routing/api";

// // ================== CONFIG ==================
// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const MAX_VIEWERS = 10;
// const MAX_RECONNECT_ATTEMPTS = 5;
// const INITIAL_RECONNECT_DELAY = 3000;
// const STREAM_POLL_INTERVAL = 10000; // Reduced polling frequency
// // ============================================

// export default function LiveStreamScreen({ navigation, route }) {
//   const { profile_image, name } = route.params || {};

//   // --- refs/state
//   const ws = useRef(null);
//   const peerConnections = useRef({});
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef({});
//   const rtcConfig = useRef({ iceServers: [] }).current;

//   const [wsConnected, setWsConnected] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);
//   const [streamDuration, setStreamDuration] = useState(0);
//   const [isCameraFront, setIsCameraFront] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isLive, setIsLive] = useState(false);
//   const [viewers, setViewers] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [likes, setLikes] = useState(0);
//   const [commentInput, setCommentInput] = useState("");
//   const [isBroadcaster, setIsBroadcaster] = useState(false);
//   const [streamId, setStreamId] = useState(null);
//   const [availableStreams, setAvailableStreams] = useState([]);
//   const [viewerMode, setViewerMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [currentStream, setCurrentStream] = useState(null);
//   const [listStreamRetries, setListStreamRetries] = useState(0);
//   const [reconnectAttempts, setReconnectAttempts] = useState(0);
  

//   const isCleaningUpRef = useRef(false);
//   const streamTimerRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);

//   // =============== PERMISSIONS ===============
//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//         ]);
//         const granted = (
//           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
//           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
//         );
//         console.log("[Permissions] Camera and audio:", granted ? "granted" : "denied");
//         return granted;
//       } catch (err) {
//         console.warn("[Permissions] Error:", err);
//         return false;
//       }
//     }
//     return true;
//   };

//   // =============== ICE SERVERS ===============
//   // const getIceServers = async () => {
//   //   try {
//   //     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
//   //       method: "PUT",
//   //       headers: {
//   //         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ format: "urls" }),
//   //     });

//   //     const data = await res.json();
//   //     let iceServers = [];
//   //     if (data.v?.iceServers) {
//   //       iceServers = data.v.iceServers;
//   //     } else if (data.v?.urls) {
//   //       iceServers = data.v.urls.map((url) => ({
//   //         urls: url,
//   //         username: data.v.username,
//   //         credential: data.v.credential,
//   //       }));
//   //     }

//   //     rtcConfig.iceServers = iceServers.length
//   //       ? iceServers
//   //       : [{ urls: "stun:stun.l.google.com:19302" }];
//   //     console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
//   //   } catch (err) {
//   //     console.error("[Xirsys] Failed to fetch ICE servers:", err);
//   //     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//   //   }
//   // };
//   const getIceServers = async () => {
//   try {
//     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
//       method: "PUT",
//       headers: {
//         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ format: "urls" }),
//     });
//     const data = await res.json();
//     let iceServers = [];
//     if (data.v?.iceServers) {
//       iceServers = data.v.iceServers;
//     } else if (data.v?.urls) {
//       iceServers = data.v.urls.map((url) => ({
//         urls: url,
//         username: data.v.username,
//         credential: data.v.credential,
//       }));
//     }
//     rtcConfig.iceServers = iceServers.length
//       ? iceServers
//       : [
//           { urls: "stun:stun.l.google.com:19302" },
//           { urls: "stun:stun1.l.google.com:19302" },
//         ];
//     console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
//   } catch (err) {
//     console.error("[Xirsys] Failed to fetch ICE servers:", err);
//     rtcConfig.iceServers = [
//       { urls: "stun:stun.l.google.com:19302" },
//       { urls: "stun:stun1.l.google.com:19302" },
//     ];
//   }
// };



//   const createPeerConnection = async (targetId) => {
//     if (!rtcConfig.iceServers.length) {
//       await getIceServers();
//     }

//     const pc = new RTCPeerConnection(rtcConfig);
//     console.log(`[WebRTC] Created RTCPeerConnection for ${targetId}`);

//     pc.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         sendMessage({
//           type: "candidate",
//           candidate: evt.candidate,
//           streamId,
//           viewer_channel: isBroadcaster ? targetId : undefined
//         });
//         console.log(`[WebRTC] Sent ICE candidate for ${targetId}`);
//       }
//     };


// //     pc.ontrack = (evt) => {
// //   if (!isBroadcaster) {
// //     if (evt.streams && evt.streams.length > 0) {
// //       remoteStream.current = evt.streams[0];
// //       setRemoteURL(remoteStream.current.toURL());
// //     } else if (evt.track) {
// //       // fallback: create MediaStream from track
// //       const stream = new MediaStream();
// //       stream.addTrack(evt.track);
// //       remoteStream.current = stream;
// //       setRemoteURL(stream.toURL());
// //     }
// //   }
// // };

// pc.ontrack = (evt) => {
//   console.log(`[WebRTC] ontrack for ${targetId}:`, evt.streams[0]?.getTracks() || [evt.track]);
//   if (!isBroadcaster) {
//     if (evt.streams && evt.streams.length > 0) {
//       remoteStream.current = evt.streams[0];
//       const url = remoteStream.current.toURL();
//       console.log("[WebRTC] Setting remoteURL:", url);
//       setRemoteURL(url);
//     } else if (evt.track) {
//       console.log("[WebRTC] Fallback: Creating stream from track:", evt.track);
//       const stream = new MediaStream();
//       stream.addTrack(evt.track);
//       remoteStream.current = stream;
//       setRemoteURL(stream.toURL());
//     }
//   }
// };


//     pc.onconnectionstatechange = () => {
//       console.log(`[WebRTC] ${targetId} connectionState: ${pc.connectionState}`);
//       if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
//         console.warn(`[WebRTC] Connection failed for ${targetId}`);
//         Alert.alert("Connection Failed", "Failed to connect to the stream. Please try again.");
//         endStream();
//       }
//     };

//     pc.oniceconnectionstatechange = () => {
//       console.log(`[WebRTC] ${targetId} iceConnectionState: ${pc.iceConnectionState}`);
//     };

//     if (isBroadcaster && localStream.current) {
//   localStream.current.getTracks().forEach((track) => {
//     pc.addTrack(track, localStream.current);
//   });
// }


//     peerConnections.current[targetId] = pc;
//     queuedRemoteCandidates.current[targetId] = [];
//     return pc;
//   };

//   useEffect(() => {
//   // Monitor peer connection states
//   const interval = setInterval(() => {
//     Object.entries(peerConnections.current).forEach(([id, pc]) => {
//       console.log(`[WebRTC-Monitor] ${id}: connectionState=${pc.connectionState}, iceConnectionState=${pc.iceConnectionState}`);
//     });
//   }, 5000);

//   return () => clearInterval(interval);
// }, []);

//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestPermissions();
//       if (!hasPermission) {
//         Alert.alert("Permission Denied", "Cannot access microphone or camera.");
//         return false;
//       }
//       try {
//         const s = await mediaDevices.getUserMedia({
//           audio: true,
//           video: { facingMode: isCameraFront ? "user" : "environment" }
//         });
//         localStream.current = s;
//         console.log("[WebRTC] Local stream acquired:", s.getTracks().map(t => `${t.kind}: ${t.enabled}`));
//         try {
//           setLocalURL(s.toURL());
//         } catch {
//           console.warn("[WebRTC] toURL not available for local stream");
//         }
//       } catch (e) {
//         console.error("[WebRTC] Failed to get local stream:", e);
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     if (isBroadcaster) {
//       Object.values(peerConnections.current).forEach((pc) => {
//         const existingTracks = pc.getSenders().map((s) => s.track);
//         localStream.current.getTracks().forEach((track) => {
//           if (!existingTracks.includes(track)) {
//             pc.addTrack(track, localStream.current);
//             console.log(`[WebRTC] Attached ${track.kind} track to peer connection`);
//           }
//         });
//       });
//     }

//     if (isMuted) {
//       localStream.current.getAudioTracks().forEach((track) => {
//         track.enabled = false;
//       });
//     }
//     return true;
//   };

//   const toggleMute = () => {
//     if (localStream.current) {
//       const audioTrack = localStream.current.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsMuted(!audioTrack.enabled);
//         console.log(`[WebRTC] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
//       }
//     }
//   };

//   const debugServerCommunication = () => {
//   console.log("=== SERVER COMMUNICATION DEBUG ===");
//   console.log("WebSocket state:", ws.current?.readyState);
//   console.log("isBroadcaster:", isBroadcaster);
//   console.log("streamId:", streamId);
//   console.log("Available streams:", availableStreams);
//   console.log("Current user ID:", AsyncStorage.getItem("userData").then(data => {
//     const userData = data ? JSON.parse(data) : {};
//     console.log("User ID:", userData.id);
//   }));
//   console.log("Peer connections:", Object.keys(peerConnections.current));
//   console.log("Local stream:", localStream.current ? "Available" : "Not available");
//   console.log("Remote stream:", remoteStream.current ? "Available" : "Not available");
//   console.log("Remote URL:", remoteURL);
//   console.log("===================================");
// };


// const detectServerRoutingIssue = () => {
//   console.log("=== SERVER ROUTING DIAGNOSTICS ===");
//   console.log("Current User ID:", AsyncStorage.getItem("userData").then(data => {
//     const userData = data ? JSON.parse(data) : {};
//     console.log("User ID:", userData.id);
//   }));
//   console.log("isBroadcaster:", isBroadcaster);
//   console.log("viewerMode:", viewerMode);
//   console.log("streamId:", streamId);
//   console.log("WebSocket readyState:", ws.current?.readyState);
//   console.log("===================================");
// };

// // Call this when you suspect routing issues
// detectServerRoutingIssue();

//   const switchCamera = async () => {
//     if (!localStream.current) return;

//     const videoTrack = localStream.current.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack._switchCamera();
//       setIsCameraFront(!isCameraFront);
//       console.log(`[WebRTC] Switched camera to ${isCameraFront ? 'back' : 'front'}`);
//     }
//   };

//   const drainQueuedCandidates = async (targetId) => {
//     const pc = peerConnections.current[targetId];
//     if (!pc) {
//       console.warn(`[WebRTC] No peer connection for ${targetId} to drain candidates`);
//       return;
//     }

//     while (queuedRemoteCandidates.current[targetId]?.length > 0) {
//       const c = queuedRemoteCandidates.current[targetId].shift();
//       try {
//         await pc.addIceCandidate(new RTCIceCandidate(c));
//         console.log(`[WebRTC] Added queued ICE candidate for ${targetId}`);
//       } catch (err) {
//         console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, err?.message || err);
//       }
//     }
//   };

//   const cleanupPeerConnection = (targetId) => {
//     if (targetId && peerConnections.current[targetId]) {
//       console.log(`[Cleanup] Closing peer connection for ${targetId}`);
//       try {
//         const pc = peerConnections.current[targetId];
//         pc.onicecandidate = null;
//         pc.ontrack = null;
//         pc.onconnectionstatechange = null;
//         pc.oniceconnectionstatechange = null;
//         pc.close();
//         delete peerConnections.current[targetId];
//         delete queuedRemoteCandidates.current[targetId];
//       } catch (e) {
//         console.warn(`[Cleanup] Error closing pc for ${targetId}:`, e);
//       }
//     } else if (!targetId) {
//       console.log("[Cleanup] Closing all peer connections and streams");
//       isCleaningUpRef.current = true;

//       Object.keys(peerConnections.current).forEach((key) => {
//         const pc = peerConnections.current[key];
//         pc.onicecandidate = null;
//         pc.ontrack = null;
//         pc.onconnectionstatechange = null;
//         pc.oniceconnectionstatechange = null;
//         pc.close();
//       });
//       peerConnections.current = {};
//       queuedRemoteCandidates.current = {};

//       try {
//         if (localStream.current) {
//           localStream.current.getTracks().forEach((t) => t.stop());
//         }
//       } catch (e) {
//         console.warn("[Cleanup] localStream stop error:", e);
//       }
//       localStream.current = null;
//       remoteStream.current = null;

//       setLocalURL(null);
//       setRemoteURL(null);
//       setIsMuted(false);
//       setIsLive(false);
//       setViewers(0);
//       setComments([]);
//       setLikes(0);
//       setCurrentStream(null);
//       setListStreamRetries(0);
//       setReconnectAttempts(0);
//       isCleaningUpRef.current = false;
//     }
//   };

//   // =============== SIGNALING ================
//   // const sendMessage = (msg) => {
//   //   if (ws.current?.readyState === WebSocket.OPEN) {
//   //     ws.current.send(JSON.stringify(msg));
//   //     console.log("[WS] Sent:", msg.type, "Payload:", msg);
//   //   } else {
//   //     console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
//   //   }
//   // };

//   const sendMessage = (msg) => {
//   if (ws.current?.readyState === WebSocket.OPEN) {
//     console.log("[WS] Sending message:", JSON.stringify(msg, null, 2));
//     ws.current.send(JSON.stringify(msg));
//   } else {
//     console.warn("[WS] Cannot send message, WebSocket not open. Message:", JSON.stringify(msg, null, 2));
//   }
// };

//   const connectSignaling = async () => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[WS] WebSocket already connected");
//       return;
//     }

//     const token = await AsyncStorage.getItem("userToken");
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
//     const currentUserId = userData?.id;

//     const roomId = "live-streams";

//     if (ws.current) {
//       try {
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//       } catch {}
//       ws.current = null;
//     }

//     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
//     console.log("[WS] Connecting to:", url);
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected to live streams room");
//       setWsConnected(true);
//       setListStreamRetries(0);
//       setReconnectAttempts(0);

//       sendMessage({ type: "list-streams" });

//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//         reconnectTimeoutRef.current = null;
//       }
//     };

//     ws.current.onmessage = async (evt) => {
//       // let data;
//       // try {
//       //   data = JSON.parse(evt.data);
//       //   console.log("[WS] Received:", data);
//       // } catch {
//       //   console.error("[WS] Failed to parse message:", evt.data);
//       //   return;
//       // }
//       let data;
//   try {
//     data = JSON.parse(evt.data);
//     console.log("[WS] Received:", JSON.stringify(data, null, 2));
//   } catch {
//     console.error("[WS] Failed to parse message:", evt.data);
//     return;
//   }

//   const userDataRaw = await AsyncStorage.getItem("userData");
//   const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//   const currentUserId = userData?.id?.toString();

//   console.log(`[WS] Processing ${data.type} for user ${currentUserId}, isBroadcaster: ${isBroadcaster}`);

//       switch (data.type) {
//     case "list-streams": {
//       const streams = Array.isArray(data.streams) ? data.streams : [];
//       console.log("[WS] Received list-streams:", streams.length, "streams");
//       setAvailableStreams(streams.map(stream => ({
//         ...stream,
//         userId: stream.userId?.toString()
//       })));
      
//       // Check if our stream is still active
//       if (isBroadcaster && streamId && !streams.some(s => s.id === streamId)) {
//         console.log("[WS] Our stream not in list, ending stream");
//         endStream();
//       }
//       break;
//     }

//     case "stream-started": {
//       if (data.stream && data.stream.id) {
//         setAvailableStreams(prev => {
//           const exists = prev.some(s => s.id === data.stream.id);
//           if (exists) {
//             console.log("[WS] Stream already in list, updating:", data.stream.id);
//             return prev.map(s => s.id === data.stream.id ? { ...data.stream, userId: data.stream.userId?.toString() } : s);
//           } else {
//             console.log("[WS] Adding new stream to list:", data.stream.id);
//             return [...prev, { ...data.stream, userId: data.stream.userId?.toString() }];
//           }
//         });
//       }
//       break;
//     }

//     case "join-stream": {
//       console.log(`[WS] join-stream received: streamId=${data.streamId}, viewer_channel=${data.viewer_channel}`);
      
//       // Only broadcasters should process join-stream messages
//       // if (!isBroadcaster) {
//       //   console.warn("[WS] Ignoring join-stream: Not broadcaster");
//       //   return;
//       // }
//        if (!isBroadcaster) {
//     console.warn("[WS] Ignoring join-stream: Not broadcaster (this message was sent to wrong client)");
    
//     // If we're a viewer and receive this, it might be for our own stream attempt
//     if (viewerMode && data.streamId === streamId) {
//       console.log("[WS] Viewer received join-stream for own connection attempt - server routing issue");
//     }
//     return;
//   }

//       // Verify this is our stream
//       if (data.streamId !== streamId) {
//         console.warn(`[WS] Ignoring join-stream: Stream ID mismatch (expected: ${streamId}, received: ${data.streamId})`);
//         return;
//       }

//       // Check if we're trying to connect to ourselves
//       if (data.viewer_id === currentUserId) {
//         console.warn("[WS] Ignoring join-stream: Attempt to connect to own stream");
//         return;
//       }

//       // Check viewer limits
//       const currentViewers = Object.keys(peerConnections.current).length;
//       if (currentViewers >= MAX_VIEWERS) {
//         console.warn(`[WS] Max viewers reached (${currentViewers}/${MAX_VIEWERS})`);
//         sendMessage({
//           type: "error",
//           message: "Maximum viewers reached",
//           streamId: data.streamId,
//           viewer_channel: data.viewer_channel
//         });
//         return;
//       }

//       const viewerId = data.viewer_channel;
//       console.log(`[WS] Processing join-stream from viewer: ${viewerId}`);

//       try {
//         // Ensure we have local stream
//         if (!localStream.current) {
//           console.warn("[WS] No local stream available, acquiring...");
//           const success = await ensureLocalStreamAndAttach();
//           if (!success) {
//             throw new Error("Failed to acquire local stream");
//           }
//         }

//         // Create peer connection for this viewer
//         const pc = await createPeerConnection(viewerId);
        
//         // Create and send offer
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
        
//         console.log(`[WS] Sending offer to viewer ${viewerId}`);
//         sendMessage({
//           type: "offer",
//           offer: offer,
//           streamId: data.streamId,
//           viewer_channel: viewerId,
//           target_viewer_id: data.viewer_id // Help server route correctly
//         });

//       } catch (error) {
//         console.error("[WS] Error handling join-stream:", error);
//         sendMessage({
//           type: "error",
//           message: `Failed to handle join request: ${error.message}`,
//           streamId: data.streamId,
//           viewer_channel: data.viewer_channel
//         });
//         cleanupPeerConnection(viewerId);
//       }
//       break;
//     }

//     case "offer": {
//       console.log("[WS] offer received for stream:", data.streamId);
      
//       // Only viewers should process offers
//       if (isBroadcaster) {
//         console.warn("[WS] Ignoring offer: We are broadcaster");
//         return;
//       }

//       // Verify this is the stream we're trying to join
//       if (data.streamId !== streamId) {
//         console.warn(`[WS] Ignoring offer: Stream ID mismatch (expected: ${streamId}, received: ${data.streamId})`);
//         return;
//       }

//       try {
//         console.log("[WS] Creating peer connection for offer");
//         const pc = await createPeerConnection(data.streamId);
        
//         console.log("[WS] Setting remote description");
//         await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        
//         // Drain any queued ICE candidates
//         await drainQueuedCandidates(data.streamId);

//         console.log("[WS] Creating answer");
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
        
//         console.log("[WS] Sending answer");
//         sendMessage({
//           type: "answer",
//           answer: answer,
//           streamId: data.streamId,
//           viewer_channel: data.viewer_channel
//         });

//         setViewerMode(true);
//         setLoading(false);
//         console.log("[WS] Successfully processed offer and sent answer");

//       } catch (error) {
//         console.error("[WS] Error handling offer:", error);
//         Alert.alert("Connection Error", "Failed to join stream: " + error.message);
//         setLoading(false);
//         setViewerMode(false);
//         cleanupPeerConnection(data.streamId);
//       }
//       break;
//     }

// case "answer": {
//   if (!isBroadcaster) {
//     console.warn("[WS] Ignoring answer: Not broadcaster");
//     return;
//   }
//   const viewerId = data.streamId; // Should be viewer_channel
//   const pc = peerConnections.current[viewerId];
//   if (!pc) {
//     console.warn(`[WebRTC] No peer connection for viewer ${viewerId}`);
//     return;
//   }
//   try {
//     console.log("[WebRTC] Received answer SDP:", data.answer.sdp);
//     await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
//     await drainQueuedCandidates(viewerId);
//     console.log(`[WebRTC] Set answer for viewer ${viewerId}`);
//   } catch (e) {
//     console.error(`[WebRTC] setRemoteDescription(answer) failed for viewer ${viewerId}:`, e);
//     cleanupPeerConnection(viewerId);
//   }
//   break;
// }
//         case "candidate": {
//           const targetId = isBroadcaster ? data.streamId : data.streamId;
//           if (!peerConnections.current[targetId]) {
//             queuedRemoteCandidates.current[targetId] = queuedRemoteCandidates.current[targetId] || [];
//             queuedRemoteCandidates.current[targetId].push(data.candidate);
//             console.log(`[WebRTC] Queued ICE candidate for ${targetId}`);
//             return;
//           }
//           if (!peerConnections.current[targetId].remoteDescription) {
//             queuedRemoteCandidates.current[targetId].push(data.candidate);
//             console.log(`[WebRTC] Queued ICE candidate for ${targetId} (no remote description)`);
//           } else {
//             try {
//               await peerConnections.current[targetId].addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log(`[WebRTC] Added ICE candidate for ${isBroadcaster ? 'viewer' : 'broadcaster'} ${targetId}`);
//             } catch (e) {
//               console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, e?.message || e);
//             }
//           }
//           break;
//         }
//         case "viewer-count": {
//           if (data.streamId === streamId) {
//             setViewers(data.count || 0);
//             console.log(`[WS] Updated viewer count for stream ${data.streamId}: ${data.count}`);
//           }
//           setAvailableStreams(prev =>
//             prev.map(s => s.id === data.streamId ? { ...s, viewers: data.count || 0 } : s)
//           );
//           break;
//         }
//         // Add to your WebSocket message handler switch statement
// case "viewer-offer": {
//   console.log("[WS] viewer-offer received for stream:", data.streamId);
  
//   // Only broadcasters should process viewer offers
//   if (!isBroadcaster) {
//     console.warn("[WS] Ignoring viewer-offer: Not broadcaster");
//     return;
//   }

//   // Verify this is our stream
//   if (data.streamId !== streamId) {
//     console.warn(`[WS] Ignoring viewer-offer: Stream ID mismatch (expected: ${streamId}, received: ${data.streamId})`);
//     return;
//   }

//   const viewerId = data.viewer_id || `viewer-${Date.now()}`;
//   console.log(`[WS] Processing viewer-offer from: ${viewerId}`);

//   try {
//     // Ensure we have local stream
//     if (!localStream.current) {
//       console.warn("[WS] No local stream available, acquiring...");
//       const success = await ensureLocalStreamAndAttach();
//       if (!success) {
//         throw new Error("Failed to acquire local stream");
//       }
//     }

//     // Create peer connection for this viewer
//     const pc = await createPeerConnection(viewerId);
    
//     // Set remote description (viewer's offer)
//     console.log("[WS] Setting remote description from viewer offer");
//     await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    
//     // Create and send answer
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
    
//     console.log(`[WS] Sending answer to viewer ${viewerId}`);
//     sendMessage({
//       type: "broadcaster-answer",
//       answer: answer,
//       streamId: data.streamId,
//       viewer_id: data.viewer_id
//     });

//   } catch (error) {
//     console.error("[WS] Error handling viewer-offer:", error);
//     sendMessage({
//       type: "error",
//       message: `Failed to handle viewer connection: ${error.message}`,
//       streamId: data.streamId,
//       viewer_id: data.viewer_id
//     });
//     cleanupPeerConnection(viewerId);
//   }
//   break;
// }

// case "broadcaster-answer": {
//   console.log("[WS] broadcaster-answer received for stream:", data.streamId);
  
//   // Only viewers should process broadcaster answers
//   if (isBroadcaster) {
//     console.warn("[WS] Ignoring broadcaster-answer: We are broadcaster");
//     return;
//   }

//   // Verify this is the stream we're trying to join
//   if (data.streamId !== streamId) {
//     console.warn(`[WS] Ignoring broadcaster-answer: Stream ID mismatch`);
//     return;
//   }

//   try {
//     const pc = peerConnections.current[streamId];
//     if (!pc) {
//       throw new Error("No peer connection found");
//     }
    
//     console.log("[WS] Setting remote description from broadcaster answer");
//     await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    
//     // Drain any queued ICE candidates
//     await drainQueuedCandidates(streamId);
    
//     setViewerMode(true);
//     setLoading(false);
//     console.log("[WS] Successfully processed broadcaster answer");

//   } catch (error) {
//     console.error("[WS] Error handling broadcaster-answer:", error);
//     Alert.alert("Connection Error", "Failed to complete stream connection: " + error.message);
//     setLoading(false);
//     setViewerMode(false);
//     cleanupPeerConnection(streamId);
//   }
//   break;
// }
//         case "new-comment": {
//           if (data.streamId === streamId && data.comment) {
//             setComments(prev => [...prev, data.comment]);
//             console.log(`[WS] New comment for stream ${data.streamId}:`, data.comment);
//           }
//           break;
//         }
//         case "new-like": {
//           if (data.streamId === streamId) {
//             setLikes(prev => prev + 1);
//             console.log(`[WS] New like for stream ${data.streamId}`);
//           }
//           break;
//         }
//         case "error": {
//           Alert.alert("Error", data.message || "An error occurred");
//           console.error("[WS] Server error:", data.message);
//           if (viewerMode) {
//             endStream();
//           }
//           break;
//         }
//         default:
//           console.warn("[WS] Unhandled message type:", data.type);
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WS] Connection closed");
//       setWsConnected(false);
//       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
//         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
//         reconnectTimeoutRef.current = setTimeout(() => {
//           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
//           setReconnectAttempts(prev => prev + 1);
//           connectSignaling();
//         }, delay);
//       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
//         Alert.alert(
//           "Connection Error",
//           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
//         );
//       }
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err?.message || err);
//       setWsConnected(false);
//     };
//   };

//   // ============ STREAM FUNCTIONS ============
//   // const startStream = async () => {
//   //   setLoading(true);
//   //   setIsBroadcaster(true);

//   //   try {
//   //     const success = await ensureLocalStreamAndAttach();
//   //     if (!success) {
//   //       throw new Error("Failed to acquire local stream");
//   //     }
//   //     if (!localStream.current.getVideoTracks().length) {
//   //       throw new Error("No video track in local stream");
//   //     }

//   //     const userDataRaw = await AsyncStorage.getItem("userData");
//   //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

//   //     const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//   //     setStreamId(newStreamId);

//   //     const streamInfo = {
//   //       id: newStreamId,
//   //       broadcaster: userData.name || name || "User",
//   //       title: `${userData.name || name || "User"} is Live!`,
//   //       thumbnail: userData.profile_picture || profile_image || "",
//   //       viewers: 0,
//   //       userId: userData.id || ""
//   //     };
//   //     setCurrentStream(streamInfo);

//   //     sendMessage({
//   //       type: "start-stream",
//   //       streamId: newStreamId,
//   //       streamInfo
//   //     });

//   //     setIsLive(true);
//   //     console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
//   //   } catch (e) {
//   //     console.error("[Live] Failed to start stream:", e);
//   //     Alert.alert("Error", "Failed to start live stream: " + e.message);
//   //     setIsBroadcaster(false);
//   //     setCurrentStream(null);
//   //     cleanupPeerConnection();
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const startStream = async () => {
//   setLoading(true);
//   setIsBroadcaster(true);
//   try {
//     const success = await ensureLocalStreamAndAttach();
//     if (!success) {
//       throw new Error("Failed to acquire local stream");
//     }
//     if (!localStream.current.getVideoTracks().length) {
//       throw new Error("No video track in local stream");
//     }
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//     const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//     setStreamId(newStreamId);
//     const streamInfo = {
//       id: newStreamId,
//       broadcaster: userData.name || name || "User",
//       title: `${userData.name || name || "User"} is Live!`,
//       thumbnail: userData.profile_picture || profile_image || "",
//       viewers: 0,
//       userId: userData.id?.toString() || "" // Ensure userId is a string
//     };
//     setCurrentStream(streamInfo);
//     console.log("[startStream] State: isBroadcaster=", true, "streamId=", newStreamId, "userId=", userData.id);
//     sendMessage({
//       type: "start-stream",
//       streamId: newStreamId,
//       streamInfo
//     });
//     setIsLive(true);
//     console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
//   } catch (e) {
//     console.error("[Live] Failed to start stream:", e);
//     Alert.alert("Error", "Failed to start live stream: " + e.message);
//     setIsBroadcaster(false);
//     setCurrentStream(null);
//     cleanupPeerConnection();
//   } finally {
//     setLoading(false);
//   }
// };

//   // const joinStream = async (streamIdToJoin) => {
//   //   setLoading(true);
//   //   setViewerMode(true);
//   //   setStreamId(streamIdToJoin);

//   //   const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
//   //   if (!streamToJoin) {
//   //     Alert.alert("Error", "Stream not found");
//   //     setLoading(false);
//   //     setViewerMode(false);
//   //     return;
//   //   }
//   //   setCurrentStream(streamToJoin);

//   //   try {
//   //     await createPeerConnection(streamIdToJoin);
//   //     sendMessage({
//   //       type: "join-stream",
//   //       streamId: streamIdToJoin
//   //     });
//   //     console.log(`[WS] Sent join-stream for ${streamIdToJoin}`);
//   //   } catch (error) {
//   //     console.error("[WebRTC] Error joining stream:", error);
//   //     Alert.alert("Error", "Failed to join stream: " + error.message);
//   //     setViewerMode(false);
//   //     setCurrentStream(null);
//   //     setLoading(false);
//   //     cleanupPeerConnection(streamIdToJoin);
//   //   }
//   // };

// // const joinStream = async (streamIdToJoin) => {
// //   setLoading(true);
// //   setViewerMode(true);
// //   setStreamId(streamIdToJoin);

// //   const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //   if (!streamToJoin) {
// //     Alert.alert("Error", "Stream not found");
// //     setLoading(false);
// //     setViewerMode(false);
// //     return;
// //   }
// //   setCurrentStream(streamToJoin);

// //   // Set a timeout for connection
// //   const connectionTimeout = setTimeout(() => {
// //     if (!remoteURL) {
// //       console.error("[joinStream] Timeout: No remote stream received");
// //       Alert.alert("Connection Timeout", "Failed to connect to the stream. The broadcaster may be offline.");
// //       endStream();
// //     }
// //   }, 15000);

// //   try {
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
    
// //     // Create a unique viewer channel ID
// //     const viewerChannel = `viewer.${userData.id}.${Date.now()}`;
    
// //     console.log(`[joinStream] Joining stream ${streamIdToJoin} as viewer ${viewerChannel}`);
    
// //     // First create the peer connection
// //     await createPeerConnection(streamIdToJoin);
    
// //     // Then send join message
// //     sendMessage({
// //       type: "join-stream",
// //       streamId: streamIdToJoin,
// //       viewer_channel: viewerChannel,
// //       viewer_id: userData.id?.toString() // Add viewer ID for server routing
// //     });
    
// //     console.log(`[joinStream] Join request sent for stream ${streamIdToJoin}`);
    
// //     return () => clearTimeout(connectionTimeout);
// //   } catch (error) {
// //     clearTimeout(connectionTimeout);
// //     console.error("[joinStream] Error:", error);
// //     Alert.alert("Error", "Failed to join stream: " + error.message);
// //     setViewerMode(false);
// //     setCurrentStream(null);
// //     setLoading(false);
// //     cleanupPeerConnection(streamIdToJoin);
// //   }
// // };

// const joinStream = async (streamIdToJoin) => {
//   setLoading(true);
//   setViewerMode(true);
//   setStreamId(streamIdToJoin);

//   const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
//   if (!streamToJoin) {
//     Alert.alert("Error", "Stream not found");
//     setLoading(false);
//     setViewerMode(false);
//     return;
//   }
//   setCurrentStream(streamToJoin);

//   // Set a timeout for connection
//   const connectionTimeout = setTimeout(() => {
//     if (!remoteURL) {
//       console.error("[joinStream] Timeout: No remote stream received");
//       Alert.alert("Connection Timeout", "Failed to connect to the stream. The broadcaster may be offline or there may be a server issue.");
//       endStream();
//     }
//   }, 15000);

//   try {
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
    
//     // Create peer connection first
//     const pc = await createPeerConnection(streamIdToJoin);
    
//     // Create and send offer directly (viewer initiates)
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
    
//     console.log("[joinStream] Sending offer directly to broadcaster");
//     sendMessage({
//       type: "viewer-offer",
//       offer: offer,
//       streamId: streamIdToJoin,
//       viewer_id: userData.id?.toString(),
//       viewer_name: userData.name || "Viewer"
//     });
    
//     console.log(`[joinStream] Offer sent for stream ${streamIdToJoin}`);
    
//     return () => clearTimeout(connectionTimeout);
//   } catch (error) {
//     clearTimeout(connectionTimeout);
//     console.error("[joinStream] Error:", error);
//     Alert.alert("Error", "Failed to join stream: " + error.message);
//     setViewerMode(false);
//     setCurrentStream(null);
//     setLoading(false);
//     cleanupPeerConnection(streamIdToJoin);
//   }
// };
//   const endStream = () => {
//     if (isBroadcaster && streamId) {
//       sendMessage({
//         type: "end-stream",
//         streamId
//       });
//     }

//     try {
//       if (ws.current) {
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//       }
//     } catch (e) {
//       console.warn("[endStream] Error closing ws:", e);
//     }
//     ws.current = null;

//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }

//     cleanupPeerConnection();
//     setViewerMode(false);
//     setIsBroadcaster(false);
//     setStreamId(null);
//     setCurrentStream(null);
//     setListStreamRetries(0);
//     setReconnectAttempts(0);
//   };

//   const sendComment = () => {
//     if (commentInput.trim() === "") return;

//     const userDataRaw = AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//     const userName = userData.name || "Viewer";

//     const comment = {
//       id: Date.now().toString(),
//       user: userName,
//       text: commentInput,
//       timestamp: Date.now()
//     };

//     sendMessage({
//       type: "comment",
//       comment,
//       streamId
//     });

//     setCommentInput("");
//   };

//   const sendLike = () => {
//     sendMessage({
//       type: "like",
//       streamId
//     });
//   };

//   // ================ LIFECYCLE ================
//   useEffect(() => {
//     connectSignaling();

//     return () => {
//       endStream();
//     };
//   }, []);

//   useEffect(() => {
//     if (isLive) {
//       const startTime = Date.now();
//       streamTimerRef.current = setInterval(() => {
//         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
//       }, 1000);
//     } else {
//       if (streamTimerRef.current) {
//         clearInterval(streamTimerRef.current);
//         streamTimerRef.current = null;
//         setStreamDuration(0);
//       }
//     }
//     return () => {
//       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
//     };
//   }, [isLive]);

//   useEffect(() => {
//     if (wsConnected && !isLive && !viewerMode) {
//       const interval = setInterval(() => {
//         sendMessage({ type: "list-streams" });
//       }, STREAM_POLL_INTERVAL);
//       return () => clearInterval(interval);
//     }
//   }, [wsConnected, isLive, viewerMode]);

//   // ================ UI ================
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
//   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
//   const defaultImage = require('../assets/images/dad.jpg');

//   const debugStreams = () => {
//     console.log("[Debug] localStream tracks:", localStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
//     console.log("[Debug] remoteStream tracks:", remoteStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
//     console.log("[Debug] peerConnections:", Object.keys(peerConnections.current));
//     console.log("[Debug] isBroadcaster:", isBroadcaster, "viewerMode:", viewerMode, "streamId:", streamId);
//   };

//   if (!isLive && !viewerMode) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Live Streams</Text>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Icon name="close" size={28} color="white" />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.startStreamButton, loading && styles.disabledButton]}
//             onPress={startStream}
//             disabled={loading || !wsConnected}
//           >
//             <View style={styles.startStreamIcon}>
//               <Icon name="videocam" size={30} color="white" />
//             </View>
//             <Text style={styles.startStreamText}>
//               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
//             <Text style={styles.debugButtonText}>Debug Streams</Text>
//           </TouchableOpacity>

//           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

//           {availableStreams.length > 0 ? (
//             <FlatList
//               data={availableStreams}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={[styles.streamItem, loading && styles.disabledButton]}
//                   onPress={() => joinStream(item.id)}
//                   disabled={loading || !wsConnected}
//                 >
//                   <Image
//                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
//                     style={styles.streamThumbnail}
//                     defaultSource={defaultImage}
//                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
//                   />
//                   <View style={styles.streamInfo}>
//                     <View style={styles.streamTitleContainer}>
//                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
//                       <View style={styles.liveBadge}>
//                         <View style={styles.liveDotSmall} />
//                         <Text style={styles.liveBadgeText}>LIVE</Text>
//                       </View>
//                     </View>
//                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
//                   </View>
//                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
//                 </TouchableOpacity>
//               )}
//             />
//           ) : (
//             <View style={styles.noStreams}>
//               <Icon name="live-tv" size={50} color="#718096" />
//               <Text style={styles.noStreamsText}>No one is live right now</Text>
//               {!wsConnected && (
//                 <Text style={styles.connectingText}>
//                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
//                     ? "Failed to connect to server"
//                     : "Connecting to server..."}
//                 </Text>
//               )}
//               {wsConnected && listStreamRetries >= 5 && (
//                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
//               )}
//               <TouchableOpacity
//                 style={styles.retryButton}
//                 onPress={() => sendMessage({ type: "list-streams" })}
//                 disabled={loading || !wsConnected}
//               >
//                 <Text style={styles.retryButtonText}>Retry</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
//         {viewerMode && remoteURL ? (
//           <View style={styles.videoContainer}>
//             {/* <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" /> */}
//             <RTCView
//   key={remoteURL}
//   streamURL={remoteURL}
//   style={styles.remoteVideo}
//   objectFit="cover"
//   onError={(e) => console.error("[RTCView] Error:", e)}
// />
//           </View>
//         ) : isBroadcaster && localURL ? (
//           <View style={styles.videoContainer}>
//             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
//           </View>
//         ) : (
//           // 🔴 Removed the profile image fallback. Use a black placeholder until the stream URL is available.
//           <View style={styles.videoPlaceholder}>
//             <Text style={styles.loadingText}>
//               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
//             </Text>
//           </View>
//         )}

//         <View style={styles.streamInfoOverlay}>
//           <View style={styles.liveIndicator}>
//             <View style={styles.liveDot} />
//             <Text style={styles.liveText}>LIVE</Text>
//             <Text style={styles.viewerCount}>{viewers} watching</Text>
//             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
//           </View>

//           <View style={styles.broadcasterInfo}>
//             <Image
//               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
//               style={styles.broadcasterAvatar}
//               defaultSource={defaultImage}
//               onError={(e) => console.log("Broadcaster avatar load error:", e.nativeEvent.error)}
//             />
//             <Text style={styles.broadcasterName}>{displayName}</Text>
//           </View>
//         </View>

//         <View style={styles.commentsContainer}>

//           <FlatList
//             data={comments}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.commentBubble}>
//                 <Text style={styles.commentUser}>{item.user}:</Text>
//                 <Text style={styles.commentText}>{item.text}</Text>
//               </View>
//             )}
//             inverted
//           />
//         </View>

//         {isBroadcaster && (
//           <View style={styles.streamControls}>
//             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
//               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
//                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
//               <View style={styles.controlIcon}>
//                 <Icon name="flip-camera-ios" size={24} color="white" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
//               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
//                 <Icon name="call-end" size={24} color="white" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={debugStreams}>
//               <View style={styles.controlIcon}>
//                 <Icon name="bug-report" size={24} color="white" />
//               </View>
//             </TouchableOpacity>
//           </View>
//         )}

//         {viewerMode && (
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.commentInputContainer}
//           >
//             <TextInput
//               style={styles.commentInput}
//               placeholder="Add a comment..."
//               value={commentInput}
//               onChangeText={setCommentInput}
//               onSubmitEditing={sendComment}
//             />
//             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
//               <Icon name="favorite" size={24} color="white" />
//               <Text style={styles.likeCount}>{likes}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
//               <Icon name="bug-report" size={20} color="white" />
//             </TouchableOpacity>
//           </KeyboardAvoidingView>
//         )}
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   TextInput,
//   KeyboardAvoidingView,
//   Image
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";
// import { encode as btoa } from "base-64";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_ROUTE_IMAGE } from "../api_routing/api";

// // ================== CONFIG ==================
// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const MAX_VIEWERS = 10;
// const MAX_RECONNECT_ATTEMPTS = 5;
// const INITIAL_RECONNECT_DELAY = 3000;
// const STREAM_POLL_INTERVAL = 10000; // Reduced polling frequency
// // ============================================

// export default function LiveStreamScreen({ navigation, route }) {
//   const { profile_image, name } = route.params || {};

//   // --- refs/state (use refs for WS handler to access current values)
//   const ws = useRef(null);
//   const peerConnections = useRef({});
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef({});
//   const rtcConfig = useRef({ iceServers: [] }).current;

//   const [wsConnected, setWsConnected] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);
//   const [streamDuration, setStreamDuration] = useState(0);
//   const [isCameraFront, setIsCameraFront] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isLive, setIsLive] = useState(false);
//   const [viewers, setViewers] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [likes, setLikes] = useState(0);
//   const [commentInput, setCommentInput] = useState("");
//   const [_isBroadcaster, _setIsBroadcaster] = useState(false);
//   const [_streamId, _setStreamId] = useState(null);
//   const [availableStreams, setAvailableStreams] = useState([]);
//   const [_viewerMode, _setViewerMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [currentStream, setCurrentStream] = useState(null);
//   const [listStreamRetries, setListStreamRetries] = useState(0);
//   const [reconnectAttempts, setReconnectAttempts] = useState(0);

//   // Refs for WS handler
//   const isBroadcasterRef = useRef(false);
//   const streamIdRef = useRef(null);
//   const viewerModeRef = useRef(false);

//   const setIsBroadcaster = (value) => {
//     _setIsBroadcaster(value);
//     isBroadcasterRef.current = value;
//   };

//   const setStreamId = (value) => {
//     _setStreamId(value);
//     streamIdRef.current = value;
//   };

//   const setViewerMode = (value) => {
//     _setViewerMode(value);
//     viewerModeRef.current = value;
//   };

//   const isCleaningUpRef = useRef(false);
//   const streamTimerRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);

//   // =============== PERMISSIONS ===============
//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//         ]);
//         const granted = (
//           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
//           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
//         );
//         console.log("[Permissions] Camera and audio:", granted ? "granted" : "denied");
//         return granted;
//       } catch (err) {
//         console.warn("[Permissions] Error:", err);
//         return false;
//       }
//     }
//     return true;
//   };

//   // =============== ICE SERVERS ===============
//   const getIceServers = async () => {
//     try {
//       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
//         method: "PUT",
//         headers: {
//           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ format: "urls" }),
//       });
//       const data = await res.json();
//       let iceServers = [];
//       if (data.v?.iceServers) {
//         iceServers = data.v.iceServers;
//       } else if (data.v?.urls) {
//         iceServers = data.v.urls.map((url) => ({
//           urls: url,
//           username: data.v.username,
//           credential: data.v.credential,
//         }));
//       }
//       rtcConfig.iceServers = iceServers.length
//         ? iceServers
//         : [
//             { urls: "stun:stun.l.google.com:19302" },
//             { urls: "stun:stun1.l.google.com:19302" },
//           ];
//       console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
//     } catch (err) {
//       console.error("[Xirsys] Failed to fetch ICE servers:", err);
//       rtcConfig.iceServers = [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun1.l.google.com:19302" },
//       ];
//     }
//   };

//   const createPeerConnection = async (targetId) => {
//     if (!rtcConfig.iceServers.length) {
//       await getIceServers();
//     }

//     const pc = new RTCPeerConnection(rtcConfig);
//     console.log(`[WebRTC] Created RTCPeerConnection for ${targetId}`);

//     pc.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         sendMessage({
//           type: "candidate",
//           candidate: evt.candidate,
//           streamId: streamIdRef.current,
//           viewer_channel: isBroadcasterRef.current ? targetId : undefined
//         });
//         console.log(`[WebRTC] Sent ICE candidate for ${targetId}`);
//       }
//     };

//     pc.ontrack = (evt) => {
//       console.log(`[WebRTC] ontrack for ${targetId}:`, evt.streams[0]?.getTracks() || [evt.track]);
//       if (!isBroadcasterRef.current) {
//         if (evt.streams && evt.streams.length > 0) {
//           remoteStream.current = evt.streams[0];
//           const url = remoteStream.current.toURL();
//           console.log("[WebRTC] Setting remoteURL:", url);
//           setRemoteURL(url);
//         } else if (evt.track) {
//           console.log("[WebRTC] Fallback: Creating stream from track:", evt.track);
//           const stream = new MediaStream();
//           stream.addTrack(evt.track);
//           remoteStream.current = stream;
//           setRemoteURL(stream.toURL());
//         }
//       }
//     };

//     pc.onconnectionstatechange = () => {
//       console.log(`[WebRTC] ${targetId} connectionState: ${pc.connectionState}`);
//       if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
//         console.warn(`[WebRTC] Connection failed for ${targetId}`);
//         Alert.alert("Connection Failed", "Failed to connect to the stream. Please try again.");
//         endStream();
//       }
//     };

//     pc.oniceconnectionstatechange = () => {
//       console.log(`[WebRTC] ${targetId} iceConnectionState: ${pc.iceConnectionState}`);
//     };

//     if (isBroadcasterRef.current && localStream.current) {
//       localStream.current.getTracks().forEach((track) => {
//         pc.addTrack(track, localStream.current);
//       });
//     }

//     peerConnections.current[targetId] = pc;
//     queuedRemoteCandidates.current[targetId] = [];
//     return pc;
//   };

//   useEffect(() => {
//     // Monitor peer connection states
//     const interval = setInterval(() => {
//       Object.entries(peerConnections.current).forEach(([id, pc]) => {
//         console.log(`[WebRTC-Monitor] ${id}: connectionState=${pc.connectionState}, iceConnectionState=${pc.iceConnectionState}`);
//       });
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestPermissions();
//       if (!hasPermission) {
//         Alert.alert("Permission Denied", "Cannot access microphone or camera.");
//         return false;
//       }
//       try {
//         const s = await mediaDevices.getUserMedia({
//           audio: true,
//           video: { facingMode: isCameraFront ? "user" : "environment" }
//         });
//         localStream.current = s;
//         console.log("[WebRTC] Local stream acquired:", s.getTracks().map(t => `${t.kind}: ${t.enabled}`));
//         try {
//           setLocalURL(s.toURL());
//         } catch {
//           console.warn("[WebRTC] toURL not available for local stream");
//         }
//       } catch (e) {
//         console.error("[WebRTC] Failed to get local stream:", e);
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     if (isBroadcasterRef.current) {
//       Object.values(peerConnections.current).forEach((pc) => {
//         const existingTracks = pc.getSenders().map((s) => s.track);
//         localStream.current.getTracks().forEach((track) => {
//           if (!existingTracks.includes(track)) {
//             pc.addTrack(track, localStream.current);
//             console.log(`[WebRTC] Attached ${track.kind} track to peer connection`);
//           }
//         });
//       });
//     }

//     if (isMuted) {
//       localStream.current.getAudioTracks().forEach((track) => {
//         track.enabled = false;
//       });
//     }
//     return true;
//   };

//   const toggleMute = () => {
//     if (localStream.current) {
//       const audioTrack = localStream.current.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsMuted(!audioTrack.enabled);
//         console.log(`[WebRTC] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
//       }
//     }
//   };

//   const switchCamera = async () => {
//     if (!localStream.current) return;

//     const videoTrack = localStream.current.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack._switchCamera();
//       setIsCameraFront(!isCameraFront);
//       console.log(`[WebRTC] Switched camera to ${isCameraFront ? 'back' : 'front'}`);
//     }
//   };

//   const drainQueuedCandidates = async (targetId) => {
//     const pc = peerConnections.current[targetId];
//     if (!pc) {
//       console.warn(`[WebRTC] No peer connection for ${targetId} to drain candidates`);
//       return;
//     }

//     while (queuedRemoteCandidates.current[targetId]?.length > 0) {
//       const c = queuedRemoteCandidates.current[targetId].shift();
//       try {
//         await pc.addIceCandidate(new RTCIceCandidate(c));
//         console.log(`[WebRTC] Added queued ICE candidate for ${targetId}`);
//       } catch (err) {
//         console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, err?.message || err);
//       }
//     }
//   };

//   const cleanupPeerConnection = (targetId) => {
//     if (targetId && peerConnections.current[targetId]) {
//       console.log(`[Cleanup] Closing peer connection for ${targetId}`);
//       try {
//         const pc = peerConnections.current[targetId];
//         pc.onicecandidate = null;
//         pc.ontrack = null;
//         pc.onconnectionstatechange = null;
//         pc.oniceconnectionstatechange = null;
//         pc.close();
//         delete peerConnections.current[targetId];
//         delete queuedRemoteCandidates.current[targetId];
//       } catch (e) {
//         console.warn(`[Cleanup] Error closing pc for ${targetId}:`, e);
//       }
//     } else if (!targetId) {
//       console.log("[Cleanup] Closing all peer connections and streams");
//       isCleaningUpRef.current = true;

//       Object.keys(peerConnections.current).forEach((key) => {
//         const pc = peerConnections.current[key];
//         pc.onicecandidate = null;
//         pc.ontrack = null;
//         pc.onconnectionstatechange = null;
//         pc.oniceconnectionstatechange = null;
//         pc.close();
//       });
//       peerConnections.current = {};
//       queuedRemoteCandidates.current = {};

//       try {
//         if (localStream.current) {
//           localStream.current.getTracks().forEach((t) => t.stop());
//         }
//       } catch (e) {
//         console.warn("[Cleanup] localStream stop error:", e);
//       }
//       localStream.current = null;
//       remoteStream.current = null;

//       setLocalURL(null);
//       setRemoteURL(null);
//       setIsMuted(false);
//       setIsLive(false);
//       setViewers(0);
//       setComments([]);
//       setLikes(0);
//       setCurrentStream(null);
//       setListStreamRetries(0);
//       setReconnectAttempts(0);
//       isCleaningUpRef.current = false;
//     }
//   };

//   // =============== SIGNALING ================
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[WS] Sending message:", JSON.stringify(msg, null, 2));
//       ws.current.send(JSON.stringify(msg));
//     } else {
//       console.warn("[WS] Cannot send message, WebSocket not open. Message:", JSON.stringify(msg, null, 2));
//     }
//   };

//   const connectSignaling = async () => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[WS] WebSocket already connected");
//       return;
//     }

//     const token = await AsyncStorage.getItem("userToken");
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
//     const currentUserId = userData?.id?.toString(); // Ensure string

//     const roomId = "live-streams";

//     if (ws.current) {
//       try {
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//       } catch {}
//       ws.current = null;
//     }

//     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
//     console.log("[WS] Connecting to:", url);
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected to live streams room");
//       setWsConnected(true);
//       setListStreamRetries(0);
//       setReconnectAttempts(0);

//       sendMessage({ type: "list-streams" });

//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//         reconnectTimeoutRef.current = null;
//       }
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//         console.log("[WS] Received:", JSON.stringify(data, null, 2));
//       } catch {
//         console.error("[WS] Failed to parse message:", evt.data);
//         return;
//       }

//       const userDataRaw = await AsyncStorage.getItem("userData");
//       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//       const currentUserId = userData?.id?.toString();

//       console.log(`[WS] Processing ${data.type} for user ${currentUserId}, isBroadcaster: ${isBroadcasterRef.current}`);

//       switch (data.type) {
//         case "list-streams": {
//           const streams = Array.isArray(data.streams) ? data.streams : [];
//           console.log("[WS] Received list-streams:", streams.length, "streams");
//           setAvailableStreams(streams.map(stream => ({
//             ...stream,
//             userId: stream.userId?.toString()
//           })));
          
//           // Check if our stream is still active
//           if (isBroadcasterRef.current && streamIdRef.current && !streams.some(s => s.id === streamIdRef.current)) {
//             console.log("[WS] Our stream not in list, ending stream");
//             endStream();
//           }
//           break;
//         }

//         case "stream-started": {
//           if (data.stream && data.stream.id) {
//             setAvailableStreams(prev => {
//               const exists = prev.some(s => s.id === data.stream.id);
//               if (exists) {
//                 console.log("[WS] Stream already in list, updating:", data.stream.id);
//                 return prev.map(s => s.id === data.stream.id ? { ...data.stream, userId: data.stream.userId?.toString() } : s);
//               } else {
//                 console.log("[WS] Adding new stream to list:", data.stream.id);
//                 return [...prev, { ...data.stream, userId: data.stream.userId?.toString() }];
//               }
//             });
//           }
//           break;
//         }

//         case "viewer-offer": {
//           console.log("[WS] viewer-offer received for stream:", data.streamId);
          
//           // Only broadcasters should process viewer offers
//           if (!isBroadcasterRef.current) {
//             console.warn("[WS] Ignoring viewer-offer: Not broadcaster");
//             return;
//           }

//           // Verify this is our stream
//           if (data.streamId !== streamIdRef.current) {
//             console.warn(`[WS] Ignoring viewer-offer: Stream ID mismatch (expected: ${streamIdRef.current}, received: ${data.streamId})`);
//             return;
//           }

//           const viewerId = data.viewer_id?.toString() || `viewer-${Date.now()}`;
//           console.log(`[WS] Processing viewer-offer from: ${viewerId}`);

//           try {
//             // Ensure we have local stream
//             if (!localStream.current) {
//               console.warn("[WS] No local stream available, acquiring...");
//               const success = await ensureLocalStreamAndAttach();
//               if (!success) {
//                 throw new Error("Failed to acquire local stream");
//               }
//             }

//             // Create peer connection for this viewer
//             const pc = await createPeerConnection(viewerId);
            
//             // Set remote description (viewer's offer)
//             console.log("[WS] Setting remote description from viewer offer");
//             try {
//               await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
//             } catch (err) {
//               throw new Error(`setRemoteDescription failed: ${err.message}`);
//             }
            
//             // Create and send answer
//             const answer = await pc.createAnswer();
//             await pc.setLocalDescription(answer);
            
//             console.log(`[WS] Sending answer to viewer ${viewerId}`);
//             sendMessage({
//               type: "broadcaster-answer",
//               answer: answer,
//               streamId: data.streamId,
//               viewer_id: viewerId
//             });

//             // Drain candidates
//             await drainQueuedCandidates(viewerId);

//           } catch (error) {
//             console.error("[WS] Error handling viewer-offer:", error);
//             sendMessage({
//               type: "error",
//               message: `Failed to handle viewer connection: ${error.message}`,
//               streamId: data.streamId,
//               viewer_id: data.viewer_id
//             });
//             cleanupPeerConnection(viewerId);
//           }
//           break;
//         }

//         case "broadcaster-answer": {
//           console.log("[WS] broadcaster-answer received for stream:", data.streamId);
          
//           // Only viewers should process broadcaster answers
//           if (isBroadcasterRef.current) {
//             console.warn("[WS] Ignoring broadcaster-answer: We are broadcaster");
//             return;
//           }

//           // Verify this is the stream we're trying to join
//           if (data.streamId !== streamIdRef.current) {
//             console.warn(`[WS] Ignoring broadcaster-answer: Stream ID mismatch`);
//             return;
//           }

//           try {
//             const pc = peerConnections.current[data.streamId];
//             if (!pc) {
//               throw new Error("No peer connection found");
//             }
            
//             console.log("[WS] Setting remote description from broadcaster answer");
//             try {
//               await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
//             } catch (err) {
//               throw new Error(`setRemoteDescription failed: ${err.message}`);
//             }
            
//             // Drain any queued ICE candidates
//             await drainQueuedCandidates(data.streamId);
            
//             setViewerMode(true);
//             setLoading(false);
//             console.log("[WS] Successfully processed broadcaster answer");

//           } catch (error) {
//             console.error("[WS] Error handling broadcaster-answer:", error);
//             Alert.alert("Connection Error", "Failed to complete stream connection: " + error.message);
//             setLoading(false);
//             setViewerMode(false);
//             cleanupPeerConnection(data.streamId);
//           }
//           break;
//         }

//         case "candidate": {
//           const targetId = isBroadcasterRef.current ? data.viewer_channel : data.streamId;
//           if (!peerConnections.current[targetId]) {
//             queuedRemoteCandidates.current[targetId] = queuedRemoteCandidates.current[targetId] || [];
//             queuedRemoteCandidates.current[targetId].push(data.candidate);
//             console.log(`[WebRTC] Queued ICE candidate for ${targetId}`);
//             return;
//           }
//           if (!peerConnections.current[targetId].remoteDescription) {
//             queuedRemoteCandidates.current[targetId].push(data.candidate);
//             console.log(`[WebRTC] Queued ICE candidate for ${targetId} (no remote description)`);
//           } else {
//             try {
//               await peerConnections.current[targetId].addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log(`[WebRTC] Added ICE candidate for ${isBroadcasterRef.current ? 'viewer' : 'broadcaster'} ${targetId}`);
//             } catch (e) {
//               console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, e?.message || e);
//             }
//           }
//           break;
//         }

//         case "viewer-count": {
//           if (data.streamId === streamIdRef.current) {
//             setViewers(data.count || 0);
//             console.log(`[WS] Updated viewer count for stream ${data.streamId}: ${data.count}`);
//           }
//           setAvailableStreams(prev =>
//             prev.map(s => s.id === data.streamId ? { ...s, viewers: data.count || 0 } : s)
//           );
//           break;
//         }

//         case "new-comment": {
//           if (data.streamId === streamIdRef.current && data.comment) {
//             setComments(prev => [...prev, data.comment]);
//             console.log(`[WS] New comment for stream ${data.streamId}:`, data.comment);
//           }
//           break;
//         }

//         case "new-like": {
//           if (data.streamId === streamIdRef.current) {
//             setLikes(prev => prev + 1);
//             console.log(`[WS] New like for stream ${data.streamId}`);
//           }
//           break;
//         }

//         case "error": {
//           Alert.alert("Error", data.message || "An error occurred");
//           console.error("[WS] Server error:", data.message);
//           if (viewerModeRef.current) {
//             endStream();
//           }
//           break;
//         }

//         default:
//           console.warn("[WS] Unhandled message type:", data.type);
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WS] Connection closed");
//       setWsConnected(false);
//       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
//         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
//         reconnectTimeoutRef.current = setTimeout(() => {
//           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
//           setReconnectAttempts(prev => prev + 1);
//           connectSignaling();
//         }, delay);
//       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
//         Alert.alert(
//           "Connection Error",
//           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
//         );
//       }
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err?.message || err);
//       setWsConnected(false);
//     };
//   };

//   // ============ STREAM FUNCTIONS ============
//   const startStream = async () => {
//     setLoading(true);
//     setIsBroadcaster(true);
//     try {
//       const success = await ensureLocalStreamAndAttach();
//       if (!success) {
//         throw new Error("Failed to acquire local stream");
//       }
//       if (!localStream.current.getVideoTracks().length) {
//         throw new Error("No video track in local stream");
//       }
//       const userDataRaw = await AsyncStorage.getItem("userData");
//       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//       setStreamId(newStreamId);
//       const streamInfo = {
//         id: newStreamId,
//         broadcaster: userData.name || name || "User",
//         title: `${userData.name || name || "User"} is Live!`,
//         thumbnail: userData.profile_picture || profile_image || "",
//         viewers: 0,
//         userId: userData.id?.toString() || ""
//       };
//       setCurrentStream(streamInfo);
//       console.log("[startStream] State: isBroadcaster=", true, "streamId=", newStreamId, "userId=", userData.id);
//       sendMessage({
//         type: "start-stream",
//         streamId: newStreamId,
//         streamInfo
//       });
//       setIsLive(true);
//       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
//     } catch (e) {
//       console.error("[Live] Failed to start stream:", e);
//       Alert.alert("Error", "Failed to start live stream: " + e.message);
//       setIsBroadcaster(false);
//       setCurrentStream(null);
//       cleanupPeerConnection();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const joinStream = async (streamIdToJoin) => {
//     setLoading(true);
//     setViewerMode(true);
//     setStreamId(streamIdToJoin);

//     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
//     if (!streamToJoin) {
//       Alert.alert("Error", "Stream not found");
//       setLoading(false);
//       setViewerMode(false);
//       return;
//     }
//     setCurrentStream(streamToJoin);

//     // Set a timeout for connection
//     const connectionTimeout = setTimeout(() => {
//       if (!remoteURL) {
//         console.error("[joinStream] Timeout: No remote stream received");
//         Alert.alert("Connection Timeout", "Failed to connect to the stream. The broadcaster may be offline or there may be a server issue.");
//         endStream();
//       }
//     }, 15000);

//     try {
//       const userDataRaw = await AsyncStorage.getItem("userData");
//       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      
//       // Create peer connection first
//       const pc = await createPeerConnection(streamIdToJoin);
      
//       // Add transceivers for receive-only (fixes missing m= lines in SDP)
//       pc.addTransceiver('video', { direction: 'recvonly' });
//       pc.addTransceiver('audio', { direction: 'recvonly' });
      
//       // Create and send offer directly (viewer initiates)
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
      
//       console.log("[joinStream] Sending offer directly to broadcaster");
//       sendMessage({
//         type: "viewer-offer",
//         offer: offer,
//         streamId: streamIdToJoin,
//         viewer_id: userData.id?.toString(),
//         viewer_name: userData.name || "Viewer"
//       });
      
//       console.log(`[joinStream] Offer sent for stream ${streamIdToJoin}`);
      
//       return () => clearTimeout(connectionTimeout);
//     } catch (error) {
//       clearTimeout(connectionTimeout);
//       console.error("[joinStream] Error:", error);
//       Alert.alert("Error", "Failed to join stream: " + error.message);
//       setViewerMode(false);
//       setCurrentStream(null);
//       setLoading(false);
//       cleanupPeerConnection(streamIdToJoin);
//     }
//   };

//   const endStream = () => {
//     if (isBroadcasterRef.current && streamIdRef.current) {
//       sendMessage({
//         type: "end-stream",
//         streamId: streamIdRef.current
//       });
//     }

//     try {
//       if (ws.current) {
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//       }
//     } catch (e) {
//       console.warn("[endStream] Error closing ws:", e);
//     }
//     ws.current = null;

//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }

//     cleanupPeerConnection();
//     setViewerMode(false);
//     setIsBroadcaster(false);
//     setStreamId(null);
//     setCurrentStream(null);
//     setListStreamRetries(0);
//     setReconnectAttempts(0);
//   };

//   const sendComment = () => {
//     if (commentInput.trim() === "") return;

//     const userDataRaw = AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//     const userName = userData.name || "Viewer";

//     const comment = {
//       id: Date.now().toString(),
//       user: userName,
//       text: commentInput,
//       timestamp: Date.now()
//     };

//     sendMessage({
//       type: "comment",
//       comment,
//       streamId: streamIdRef.current
//     });

//     setCommentInput("");
//   };

//   const sendLike = () => {
//     sendMessage({
//       type: "like",
//       streamId: streamIdRef.current
//     });
//   };

//   // ================ LIFECYCLE ================
//   useEffect(() => {
//     connectSignaling();

//     return () => {
//       endStream();
//     };
//   }, []);

//   useEffect(() => {
//     if (isLive) {
//       const startTime = Date.now();
//       streamTimerRef.current = setInterval(() => {
//         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
//       }, 1000);
//     } else {
//       if (streamTimerRef.current) {
//         clearInterval(streamTimerRef.current);
//         streamTimerRef.current = null;
//         setStreamDuration(0);
//       }
//     }
//     return () => {
//       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
//     };
//   }, [isLive]);

//   useEffect(() => {
//     if (wsConnected && !isLive && !viewerModeRef.current) {
//       const interval = setInterval(() => {
//         sendMessage({ type: "list-streams" });
//       }, STREAM_POLL_INTERVAL);
//       return () => clearInterval(interval);
//     }
//   }, [wsConnected, isLive]);

//   // ================ UI ================
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
//   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
//   const defaultImage = require('../assets/images/dad.jpg');

//   const debugStreams = () => {
//     console.log("[Debug] localStream tracks:", localStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
//     console.log("[Debug] remoteStream tracks:", remoteStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
//     console.log("[Debug] peerConnections:", Object.keys(peerConnections.current));
//     console.log("[Debug] isBroadcaster:", isBroadcasterRef.current, "viewerMode:", viewerModeRef.current, "streamId:", streamIdRef.current);
//   };

//   if (!isLive && !viewerModeRef.current) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Live Streams</Text>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Icon name="close" size={28} color="white" />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.startStreamButton, loading && styles.disabledButton]}
//             onPress={startStream}
//             disabled={loading || !wsConnected}
//           >
//             <View style={styles.startStreamIcon}>
//               <Icon name="videocam" size={30} color="white" />
//             </View>
//             <Text style={styles.startStreamText}>
//               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
//             <Text style={styles.debugButtonText}>Debug Streams</Text>
//           </TouchableOpacity>

//           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

//           {availableStreams.length > 0 ? (
//             <FlatList
//               data={availableStreams}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={[styles.streamItem, loading && styles.disabledButton]}
//                   onPress={() => joinStream(item.id)}
//                   disabled={loading || !wsConnected}
//                 >
//                   <Image
//                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
//                     style={styles.streamThumbnail}
//                     defaultSource={defaultImage}
//                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
//                   />
//                   <View style={styles.streamInfo}>
//                     <View style={styles.streamTitleContainer}>
//                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
//                       <View style={styles.liveBadge}>
//                         <View style={styles.liveDotSmall} />
//                         <Text style={styles.liveBadgeText}>LIVE</Text>
//                       </View>
//                     </View>
//                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
//                   </View>
//                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
//                 </TouchableOpacity>
//               )}
//             />
//           ) : (
//             <View style={styles.noStreams}>
//               <Icon name="live-tv" size={50} color="#718096" />
//               <Text style={styles.noStreamsText}>No one is live right now</Text>
//               {!wsConnected && (
//                 <Text style={styles.connectingText}>
//                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
//                     ? "Failed to connect to server"
//                     : "Connecting to server..."}
//                 </Text>
//               )}
//               {wsConnected && listStreamRetries >= 5 && (
//                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
//               )}
//               <TouchableOpacity
//                 style={styles.retryButton}
//                 onPress={() => sendMessage({ type: "list-streams" })}
//                 disabled={loading || !wsConnected}
//               >
//                 <Text style={styles.retryButtonText}>Retry</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
//         {viewerModeRef.current && remoteURL ? (
//           <View style={styles.videoContainer}>
//             <RTCView
//               key={remoteURL}
//               streamURL={remoteURL}
//               style={styles.remoteVideo}
//               objectFit="cover"
//               onError={(e) => console.error("[RTCView] Error:", e)}
//             />
//           </View>
//         ) : isBroadcasterRef.current && localURL ? (
//           <View style={styles.videoContainer}>
//             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
//           </View>
//         ) : (
//           <View style={styles.videoPlaceholder}>
//             <Text style={styles.loadingText}>
//               {viewerModeRef.current ? "Connecting to stream..." : "Starting your stream..."}
//             </Text>
//           </View>
//         )}

//         <View style={styles.streamInfoOverlay}>
//           <View style={styles.liveIndicator}>
//             <View style={styles.liveDot} />
//             <Text style={styles.liveText}>LIVE</Text>
//             <Text style={styles.viewerCount}>{viewers} watching</Text>
//             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
//           </View>

//           <View style={styles.broadcasterInfo}>
//             <Image
//               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
//               style={styles.broadcasterAvatar}
//               defaultSource={defaultImage}
//               onError={(e) => console.log("Broadcaster avatar load error:", e.nativeEvent.error)}
//             />
//             <Text style={styles.broadcasterName}>{displayName}</Text>
//           </View>
//         </View>

//         <View style={styles.commentsContainer}>
//           <FlatList
//             data={comments}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.commentBubble}>
//                 <Text style={styles.commentUser}>{item.user}:</Text>
//                 <Text style={styles.commentText}>{item.text}</Text>
//               </View>
//             )}
//             inverted
//           />
//         </View>

//         {isBroadcasterRef.current && (
//           <View style={styles.streamControls}>
//             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
//               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
//                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
//               <View style={styles.controlIcon}>
//                 <Icon name="flip-camera-ios" size={24} color="white" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
//               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
//                 <Icon name="call-end" size={24} color="white" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={debugStreams}>
//               <View style={styles.controlIcon}>
//                 <Icon name="bug-report" size={24} color="white" />
//               </View>
//             </TouchableOpacity>
//           </View>
//         )}

//         {viewerModeRef.current && (
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.commentInputContainer}
//           >
//             <TextInput
//               style={styles.commentInput}
//               placeholder="Add a comment..."
//               value={commentInput}
//               onChangeText={setCommentInput}
//               onSubmitEditing={sendComment}
//             />
//             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
//               <Icon name="favorite" size={24} color="white" />
//               <Text style={styles.likeCount}>{likes}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
//               <Icon name="bug-report" size={20} color="white" />
//             </TouchableOpacity>
//           </KeyboardAvoidingView>
//         )}
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   selectionScreen: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   startStreamButton: {
//     backgroundColor: '#e53e3e',
//     padding: 15,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 30,
//   },
//   disabledButton: {
//     backgroundColor: '#718096',
//     opacity: 0.7,
//   },
//   startStreamIcon: {
//     marginRight: 10,
//   },
//   startStreamText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   debugButton: {
//     padding: 10,
//     backgroundColor: '#4a5568',
//     borderRadius: 10,
//     margin: 10,
//     alignItems: 'center',
//   },
//   debugButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   availableStreamsTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 15,
//   },
//   streamItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   streamThumbnail: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 15,
//     backgroundColor: '#4a5568',
//   },
//   streamInfo: {
//     flex: 1,
//   },
//   streamTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   streamTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     flex: 1,
//   },
//   liveBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#e53e3e',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   liveDotSmall: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#fff',
//     marginRight: 4,
//   },
//   liveBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   streamViewers: {
//     color: '#a0aec0',
//     fontSize: 14,
//   },
//   noStreams: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//     flex: 1,
//   },
//   noStreamsText: {
//     color: '#718096',
//     fontSize: 16,
//     marginTop: 10,
//   },
//   connectingText: {
//     color: '#a0aec0',
//     fontSize: 14,
//     marginTop: 5,
//   },
//   retryButton: {
//     backgroundColor: '#e53e3e',
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 15,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   streamScreen: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   videoContainer: {
//     flex: 1,
//     width: '100%',
//     position: 'relative',
//   },
//   remoteVideo: {
//     flex: 1,
//     width: '100%',
//     backgroundColor: '#000',
//   },
//   videoPlaceholder: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   avatarContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   avatarImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: 20,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   streamInfoOverlay: {
//     position: 'absolute',
//     top: 10,
//     left: 0,
//     right: 0,
//     padding: 15,
//     zIndex: 100,
//   },
//   liveIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 8,
//     borderRadius: 20,
//     alignSelf: 'flex-start',
//   },
//   liveDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#e53e3e',
//     marginRight: 5,
//   },
//   liveText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   viewerCount: {
//     color: 'white',
//     marginRight: 10,
//     fontSize: 14,
//   },
//   duration: {
//     color: 'white',
//     fontSize: 14,
//   },
//   broadcasterInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 8,
//     borderRadius: 20,
//     alignSelf: 'flex-start',
//     marginTop: 10,
//   },
//   broadcasterAvatar: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     marginRight: 10,
//     backgroundColor: '#4a5568',
//   },
//   broadcasterName: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   commentsContainer: {
//     position: 'absolute',
//     top: 100,
//     left: 10,
//     right: 10,
//     height: 200,
//     zIndex: 90,
//   },
//   commentBubble: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 8,
//     borderRadius: 12,
//     marginBottom: 5,
//     alignSelf: 'flex-start',
//     maxWidth: '80%',
//   },
//   commentUser: {
//     color: '#FFD700',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   commentText: {
//     color: 'white',
//     fontSize: 14,
//   },
//   streamControls: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     zIndex: 100,
//   },
//   controlButton: {
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   controlIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#4a5568',
//   },
//   commentInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     zIndex: 100,
//   },
//   commentInput: {
//     flex: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginRight: 10,
//     color: '#000',
//   },
//   likeButton: {
//     padding: 10,
//     backgroundColor: 'rgba(255, 0, 0, 0.7)',
//     borderRadius: 20,
//     alignItems: 'center',
//   },
//   likeCount: {
//     color: 'white',
//     fontSize: 12,
//     marginTop: 2,
//   },
// });
//////////////////====== working =======
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  RTCView,
} from "react-native-webrtc";
import { encode as btoa } from "base-64";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTE_IMAGE } from "../api_routing/api";

// ================== CONFIG ==================
const SIGNALING_SERVER = "wss://showa.essential.com.ng";
const MAX_VIEWERS = 10;
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 3000;
const STREAM_POLL_INTERVAL = 10000;
const CONNECTION_TIMEOUT = 20000; 
// ============================================

export default function LiveStreamScreen({ navigation, route }) {
  const { profile_image, name } = route.params || {};

  // --- refs/state
  const ws = useRef(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const queuedRemoteCandidates = useRef({});
  const rtcConfig = useRef({ iceServers: [] }).current;

  const [wsConnected, setWsConnected] = useState(false);
  const [localURL, setLocalURL] = useState(null);
  const [remoteURL, setRemoteURL] = useState(null);
  const [streamDuration, setStreamDuration] = useState(0);
  const [isCameraFront, setIsCameraFront] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [_isBroadcaster, _setIsBroadcaster] = useState(false);
  const [_streamId, _setStreamId] = useState(null);
  const [availableStreams, setAvailableStreams] = useState([]);
  const [_viewerMode, _setViewerMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStream, setCurrentStream] = useState(null);
  const [listStreamRetries, setListStreamRetries] = useState(0);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Refs for WS handler
  const isBroadcasterRef = useRef(false);
  const streamIdRef = useRef(null);
  const viewerModeRef = useRef(false);

  const setIsBroadcaster = (value) => {
    _setIsBroadcaster(value);
    isBroadcasterRef.current = value;
  };

  const setStreamId = (value) => {
    _setStreamId(value);
    streamIdRef.current = value;
  };

  const setViewerMode = (value) => {
    _setViewerMode(value);
    viewerModeRef.current = value;
  };

  const isCleaningUpRef = useRef(false);
  const streamTimerRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // =============== PERMISSIONS ===============
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
        const granted = (
          grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
          grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
        );
        console.log("[Permissions] Camera and audio:", granted ? "granted" : "denied");
        return granted;
      } catch (err) {
        console.warn("[Permissions] Error:", err);
        return false;
      }
    }
    return true;
  };

  // =============== ICE SERVERS ===============
  const getIceServers = async () => {
    try {
      const res = await fetch("https://global.xirsys.net/_turn/Showa", {
        method: "PUT",
        headers: {
          Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format: "urls" }),
      });
      const data = await res.json();
      let iceServers = [];
      if (data.v?.iceServers) {
        iceServers = data.v.iceServers;
      } else if (data.v?.urls) {
        iceServers = data.v.urls.map((url) => ({
          urls: url,
          username: data.v.username,
          credential: data.v.credential,
        }));
      }
    
      iceServers.push({
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      });
      rtcConfig.iceServers = iceServers.length
        ? iceServers
        : [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
          ];
      console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
    } catch (err) {
      console.error("[Xirsys] Failed to fetch ICE servers:", err);
      rtcConfig.iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ];
    }
  };

  const createPeerConnection = async (targetId) => {
    if (!rtcConfig.iceServers.length) {
      await getIceServers();
    }

    const pc = new RTCPeerConnection(rtcConfig);
    console.log(`[WebRTC] Created RTCPeerConnectionnnddd for ${targetId}`);

    pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        sendMessage({
          type: "candidate",
          candidate: evt.candidate,
          streamId: streamIdRef.current,
          viewer_channel: isBroadcasterRef.current ? targetId : undefined,
        });
        console.log(`[WebRTC] Sent ICE candidate for ${targetId}`);
      }
    };

    pc.ontrack = (evt) => {
      console.log(`[WebRTC] ontrack for ${targetId}:`, evt.streams[0]?.getTracks() || [evt.track]);
      if (!isBroadcasterRef.current) {
        if (evt.streams && evt.streams.length > 0) {
          remoteStream.current = evt.streams[0];
          const url = remoteStream.current.toURL();
          console.log("[WebRTC] Setting remoteURL:", url);
          setRemoteURL(url);
        } else if (evt.track) {
          console.log("[WebRTC] Fallback: Creating stream from track:", evt.track);
          const stream = new MediaStream();
          stream.addTrack(evt.track);
          remoteStream.current = stream;
          const url = stream.toURL();
          console.log("[WebRTC] Fallback stream URL:", url);
          setRemoteURL(url);
        }
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC] ${targetId} connectionState: ${pc.connectionState}`);
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        console.warn(`[WebRTC] Connection failed for ${targetId}`);
        Alert.alert("Connection Failed", "Failed to connect to the stream. Please try again.");
        endStream();
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`[WebRTC] ${targetId} iceConnectionState: ${pc.iceConnectionState}`);
    };

    if (isBroadcasterRef.current && localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
        console.log(`[WebRTC] Added ${track.kind} track to ${targetId}`);
      });
    }

    peerConnections.current[targetId] = pc;
    queuedRemoteCandidates.current[targetId] = [];
    return pc;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(peerConnections.current).forEach(([id, pc]) => {
        console.log(`[WebRTC-Monitor] ${id}: connectionState=${pc.connectionState}, iceConnectionState=${pc.iceConnectionState}`);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const ensureLocalStreamAndAttach = async () => {
    if (!localStream.current) {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "Cannot access microphone or camera.");
        return false;
      }
      try {
        const s = await mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: isCameraFront ? "user" : "environment" },
        });
        localStream.current = s;
        console.log("[WebRTC] Local stream acquired:", s.getTracks().map(t => `${t.kind}: ${t.enabled}`));
        try {
          setLocalURL(s.toURL());
        } catch {
          console.warn("[WebRTC] toURL not available for local stream");
        }
      } catch (e) {
        console.error("[WebRTC] Failed to get local stream:", e);
        Alert.alert("Error", "Failed to get local stream: " + e.message);
        return false;
      }
    }

    if (isBroadcasterRef.current) {
      Object.values(peerConnections.current).forEach((pc) => {
        const existingTracks = pc.getSenders().map((s) => s.track);
        localStream.current.getTracks().forEach((track) => {
          if (!existingTracks.includes(track)) {
            pc.addTrack(track, localStream.current);
            console.log(`[WebRTC] Attached ${track.kind} track to peer connection`);
          }
        });
      });
    }

    if (isMuted) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
    return true;
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log(`[WebRTC] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  };

  const switchCamera = async () => {
    if (!localStream.current) return;

    const videoTrack = localStream.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack._switchCamera();
      setIsCameraFront(!isCameraFront);
      console.log(`[WebRTC] Switched camera to ${isCameraFront ? 'back' : 'front'}`);
    }
  };

  const drainQueuedCandidates = async (targetId) => {
    const pc = peerConnections.current[targetId];
    if (!pc) {
      console.warn(`[WebRTC] No peer connection for ${targetId} to drain candidates`);
      return;
    }

    while (queuedRemoteCandidates.current[targetId]?.length > 0) {
      const c = queuedRemoteCandidates.current[targetId].shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
        console.log(`[WebRTC] Added queued ICE candidate for ${targetId}`);
      } catch (err) {
        console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, err?.message || err);
      }
    }
  };

  const cleanupPeerConnection = (targetId) => {
    if (targetId && peerConnections.current[targetId]) {
      console.log(`[Cleanup] Closing peer connection for ${targetId}`);
      try {
        const pc = peerConnections.current[targetId];
        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.onconnectionstatechange = null;
        pc.oniceconnectionstatechange = null;
        pc.close();
        delete peerConnections.current[targetId];
        delete queuedRemoteCandidates.current[targetId];
      } catch (e) {
        console.warn(`[Cleanup] Error closing pc for ${targetId}:`, e);
      }
    } else if (!targetId) {
      console.log("[Cleanup] Closing all peer connections and streams");
      isCleaningUpRef.current = true;

      Object.keys(peerConnections.current).forEach((key) => {
        const pc = peerConnections.current[key];
        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.onconnectionstatechange = null;
        pc.oniceconnectionstatechange = null;
        pc.close();
      });
      peerConnections.current = {};
      queuedRemoteCandidates.current = {};

      try {
        if (localStream.current) {
          localStream.current.getTracks().forEach((t) => t.stop());
        }
      } catch (e) {
        console.warn("[Cleanup] localStream stop error:", e);
      }
      localStream.current = null;
      remoteStream.current = null;

      setLocalURL(null);
      setRemoteURL(null);
      setIsMuted(false);
      setIsLive(false);
      setViewers(0);
      setComments([]);
      setLikes(0);
      setCurrentStream(null);
      setListStreamRetries(0);
      setReconnectAttempts(0);
      isCleaningUpRef.current = false;
    }
  };

  // =============== SIGNALING ================
  const sendMessage = (msg) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("[WS] Sending message:", JSON.stringify(msg, null, 2));
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("[WS] Cannot send message, WebSocket not open. Message:", JSON.stringify(msg, null, 2));
    }
  };

  const connectSignaling = async () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("[WS] WebSocket already connected");
      return;
    }

    const token = await AsyncStorage.getItem("userToken");
    const userDataRaw = await AsyncStorage.getItem("userData");
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    const currentUserId = userData?.id?.toString();

    const roomId = "live-streams";

    if (ws.current) {
      try {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
      } catch {}
      ws.current = null;
    }

    const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
    console.log("[WS] Connecting to:", url);
    ws.current = new WebSocket(url);

    ws.current.onopen = async () => {
      console.log("[WebSocket] Connected to live streams room");
      setWsConnected(true);
      setListStreamRetries(0);
      setReconnectAttempts(0);

      sendMessage({ type: "list-streams" });

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.current.onmessage = async (evt) => {
      let data;
      try {
        data = JSON.parse(evt.data);
        console.log("[WS] Received:", JSON.stringify(data, null, 2));
      } catch {
        console.error("[WS] Failed to parse message:", evt.data);
        return;
      }

      const userDataRaw = await AsyncStorage.getItem("userData");
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      const currentUserId = userData?.id?.toString();

      console.log(`[WS] Processing ${data.type} for user ${currentUserId}, isBroadcaster: ${isBroadcasterRef.current}`);

      switch (data.type) {
        case "list-streams": {
          const streams = Array.isArray(data.streams) ? data.streams : [];
          console.log("[WS] Received list-streams:", streams.length, "streams");
          setAvailableStreams(streams.map(stream => ({
            ...stream,
            userId: stream.userId?.toString(),
          })));
          
          if (isBroadcasterRef.current && streamIdRef.current && !streams.some(s => s.id === streamIdRef.current)) {
            console.log("[WS] Our stream not in list, ending stream");
            endStream();
          }
          break;
        }

        case "stream-started": {
          if (data.stream && data.stream.id) {
            setAvailableStreams(prev => {
              const exists = prev.some(s => s.id === data.stream.id);
              if (exists) {
                console.log("[WS] Stream already in list, updating:", data.stream.id);
                return prev.map(s => s.id === data.stream.id ? { ...data.stream, userId: data.stream.userId?.toString() } : s);
              } else {
                console.log("[WS] Adding new stream to list:", data.stream.id);
                return [...prev, { ...data.stream, userId: data.stream.userId?.toString() }];
              }
            });
          }
          break;
        }

        case "viewer-offer": {
          console.log("[WS] viewer-offer received for stream:", data.streamId);
          
          if (!isBroadcasterRef.current) {
            console.warn("[WS] Ignoring viewer-offer: Not broadcaster");
            return;
          }

          if (data.streamId !== streamIdRef.current) {
            console.warn(`[WS] Ignoring viewer-offer: Stream ID mismatch (expected: ${streamIdRef.current}, received: ${data.streamId})`);
            return;
          }

          const viewerId = data.viewer_id?.toString() || `viewer-${Date.now()}`;
          console.log(`[WS] Processing viewer-offer from: ${viewerId}`);

          try {
            if (!localStream.current) {
              console.warn("[WS] No local stream available, acquiring...");
              const success = await ensureLocalStreamAndAttach();
              if (!success) {
                throw new Error("Failed to acquire local stream");
              }
            }

            const pc = await createPeerConnection(viewerId);
            
            console.log("[WS] Setting remote description from viewer offer");
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            } catch (err) {
              throw new Error(`setRemoteDescription failed: ${err.message}`);
            }
            
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            
            console.log(`[WS] Sending answer to viewer ${viewerId}`);
            sendMessage({
              type: "broadcaster-answer",
              answer: answer,
              streamId: data.streamId,
              viewer_id: viewerId,
            });

            await drainQueuedCandidates(viewerId);

          } catch (error) {
            console.error("[WS] Error handling viewer-offer:", error);
            sendMessage({
              type: "error",
              message: `Failed to handle viewer connection: ${error.message}`,
              streamId: data.streamId,
              viewer_id: data.viewer_id,
            });
            cleanupPeerConnection(viewerId);
          }
          break;
        }

        case "broadcaster-answer": {
          console.log("[WS] broadcaster-answer received for stream:", data.streamId);
          
          if (isBroadcasterRef.current) {
            console.warn("[WS] Ignoring broadcaster-answer: We are broadcaster");
            return;
          }

          if (data.streamId !== streamIdRef.current) {
            console.warn(`[WS] Ignoring broadcaster-answer: Stream ID mismatch`);
            return;
          }

          try {
            const pc = peerConnections.current[data.streamId];
            if (!pc) {
              throw new Error("No peer connection found");
            }
            
            console.log("[WS] Setting remote description from broadcaster answer");
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (err) {
              throw new Error(`setRemoteDescription failed: ${err.message}`);
            }
            
            await drainQueuedCandidates(data.streamId);
            
            setViewerMode(true);
            setLoading(false);
            console.log("[WS] Successfully processed broadcaster answer");

          } catch (error) {
            console.error("[WS] Error handling broadcaster-answer:", error);
            Alert.alert("Connection Error", "Failed to complete stream connection: " + error.message);
            setLoading(false);
            setViewerMode(false);
            cleanupPeerConnection(data.streamId);
          }
          break;
        }

        case "candidate": {
          const targetId = isBroadcasterRef.current ? data.viewer_channel : data.streamId;
          if (!targetId) {
            console.warn("[WebRTC] No targetId for candidate, queuing:", data.candidate);
            queuedRemoteCandidates.current["unknown"] = queuedRemoteCandidates.current["unknown"] || [];
            queuedRemoteCandidates.current["unknown"].push(data.candidate);
            return;
          }
          if (!peerConnections.current[targetId]) {
            queuedRemoteCandidates.current[targetId] = queuedRemoteCandidates.current[targetId] || [];
            queuedRemoteCandidates.current[targetId].push(data.candidate);
            console.log(`[WebRTC] Queued ICE candidate for ${targetId}`);
            return;
          }
          if (!peerConnections.current[targetId].remoteDescription) {
            queuedRemoteCandidates.current[targetId].push(data.candidate);
            console.log(`[WebRTC] Queued ICE candidate for ${targetId} (no remote description)`);
          } else {
            try {
              await peerConnections.current[targetId].addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log(`[WebRTC] Added ICE candidate for ${isBroadcasterRef.current ? 'viewer' : 'broadcaster'} ${targetId}`);
            } catch (e) {
              console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, e?.message || e);
            }
          }
          break;
        }

        case "viewer-count": {
          if (data.streamId === streamIdRef.current) {
            setViewers(data.count || 0);
            console.log(`[WS] Updated viewer count for stream ${data.streamId}: ${data.count}`);
          }
          setAvailableStreams(prev =>
            prev.map(s => s.id === data.streamId ? { ...s, viewers: data.count || 0 } : s)
          );
          break;
        }

        case "new-comment": {
          if (data.streamId === streamIdRef.current && data.comment) {
            setComments(prev => [...prev, data.comment]);
            console.log(`[WS] New comment for stream ${data.streamId}:`, data.comment);
          }
          break;
        }

        case "new-like": {
          if (data.streamId === streamIdRef.current) {
            setLikes(prev => prev + 1);
            console.log(`[WS] New like for stream ${data.streamId}`);
          }
          break;
        }

        case "error": {
          Alert.alert("Error", data.message || "An error occurred");
          console.error("[WS] Server error:", data.message);
          if (viewerModeRef.current) {
            endStream();
          }
          break;
        }

        default:
          console.warn("[WS] Unhandled message type:", data.type);
          break;
      }
    };

    ws.current.onclose = () => {
      console.log("[WS] Connection closed");
      setWsConnected(false);
      if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
          setReconnectAttempts(prev => prev + 1);
          connectSignaling();
        }, delay);
      } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        Alert.alert(
          "Connection Error",
          "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
        );
      }
    };

    ws.current.onerror = (err) => {
      console.error("[WebSocket] Error:", err?.message || err);
      setWsConnected(false);
    };
  };

  // ============ STREAM FUNCTIONS ============
  const startStream = async () => {
    setLoading(true);
    setIsBroadcaster(true);
    try {
      const success = await ensureLocalStreamAndAttach();
      if (!success) {
        throw new Error("Failed to acquire local stream");
      }
      if (!localStream.current.getVideoTracks().length) {
        throw new Error("No video track in local stream");
      }
      const userDataRaw = await AsyncStorage.getItem("userData");
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setStreamId(newStreamId);
      const streamInfo = {
        id: newStreamId,
        broadcaster: userData.name || name || "User",
        title: `${userData.name || name || "User"} is Live!`,
        thumbnail: userData.profile_picture || profile_image || "",
        viewers: 0,
        userId: userData.id?.toString() || "",
      };
      setCurrentStream(streamInfo);
      console.log("[startStream] State: isBroadcaster=", true, "streamId=", newStreamId, "userId=", userData.id);
      sendMessage({
        type: "start-stream",
        streamId: newStreamId,
        streamInfo,
      });
      setIsLive(true);
      console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
    } catch (e) {
      console.error("[Live] Failed to start stream:", e);
      Alert.alert("Error", "Failed to start live stream: " + e.message);
      setIsBroadcaster(false);
      setCurrentStream(null);
      cleanupPeerConnection();
    } finally {
      setLoading(false);
    }
  };

  const joinStream = async (streamIdToJoin) => {
    setLoading(true);
    setViewerMode(true);
    setStreamId(streamIdToJoin);

    const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
    if (!streamToJoin) {
      Alert.alert("Error", "Stream not found");
      setLoading(false);
      setViewerMode(false);
      return;
    }
    setCurrentStream(streamToJoin);

    const connectionTimeout = setTimeout(() => {
      if (!remoteStream.current || !remoteURL) {
        console.error("[joinStream] Timeout: No remote stream received");
        Alert.alert("Connection Timeout", "Failed to connect to the stream. The broadcaster may be offline or there may be a server issue.");
        endStream();
      }
    }, CONNECTION_TIMEOUT);

    try {
      const userDataRaw = await AsyncStorage.getItem("userData");
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      
      const pc = await createPeerConnection(streamIdToJoin);
      
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      console.log("[joinStream] Sending offer directly to broadcaster");
      sendMessage({
        type: "viewer-offer",
        offer: offer,
        streamId: streamIdToJoin,
        viewer_id: userData.id?.toString(),
        viewer_name: userData.name || "Viewer",
      });
      
      console.log(`[joinStream] Offer sent for stream ${streamIdToJoin}`);
      
      return () => clearTimeout(connectionTimeout);
    } catch (error) {
      clearTimeout(connectionTimeout);
      console.error("[joinStream] Error:", error);
      Alert.alert("Error", "Failed to join stream: " + error.message);
      setViewerMode(false);
      setCurrentStream(null);
      setLoading(false);
      cleanupPeerConnection(streamIdToJoin);
    }
  };

  const endStream = () => {
    if (isBroadcasterRef.current && streamIdRef.current) {
      sendMessage({
        type: "end-stream",
        streamId: streamIdRef.current,
      });
    }

    try {
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
      }
    } catch (e) {
      console.warn("[endStream] Error closing ws:", e);
    }
    ws.current = null;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    cleanupPeerConnection();
    setViewerMode(false);
    setIsBroadcaster(false);
    setStreamId(null);
    setCurrentStream(null);
    setListStreamRetries(0);
    setReconnectAttempts(0);
  };

  const sendComment = () => {
    if (commentInput.trim() === "") return;

    const userDataRaw = AsyncStorage.getItem("userData");
    const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
    const userName = userData.name || "Viewer";

    const comment = {
      id: Date.now().toString(),
      user: userName,
      text: commentInput,
      timestamp: Date.now(),
    };

    sendMessage({
      type: "comment",
      comment,
      streamId: streamIdRef.current,
    });

    setCommentInput("");
  };

  const sendLike = () => {
    sendMessage({
      type: "like",
      streamId: streamIdRef.current,
    });
  };

  // ================ LIFECYCLE ================
  useEffect(() => {
    connectSignaling();

    return () => {
      endStream();
    };
  }, []);

  useEffect(() => {
    if (isLive) {
      const startTime = Date.now();
      streamTimerRef.current = setInterval(() => {
        setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
        setStreamDuration(0);
      }
    }
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [isLive]);

  useEffect(() => {
    if (wsConnected && !isLive && !viewerModeRef.current) {
      const interval = setInterval(() => {
        sendMessage({ type: "list-streams" });
      }, STREAM_POLL_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [wsConnected, isLive]);

  // ================ UI ================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const displayName = currentStream ? currentStream.broadcaster : (name || "User");
  const displayImage = currentStream ? currentStream.thumbnail : profile_image;
  const defaultImage = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  const debugStreams = () => {
    console.log("[Debug] localStream tracks:", localStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
    console.log("[Debug] remoteStream tracks:", remoteStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
    console.log("[Debug] remoteURL:", remoteURL);
    console.log("[Debug] peerConnections:", Object.keys(peerConnections.current));
    console.log("[Debug] isBroadcaster:", isBroadcasterRef.current, "viewerMode:", viewerModeRef.current, "streamId:", streamIdRef.current);
  };

  if (!isLive && !viewerModeRef.current) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
          <View style={styles.header}>
            <Text style={styles.title}>Live Streams</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.startStreamButton, loading && styles.disabledButton]}
            onPress={startStream}
            disabled={loading || !wsConnected}
          >
            <View style={styles.startStreamIcon}>
              <Icon name="videocam" size={30} color="white" />
            </View>
            <Text style={styles.startStreamText}>
              {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
            <Text style={styles.debugButtonText}>Debug Streams</Text>
          </TouchableOpacity>

          <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

          {availableStreams.length > 0 ? (
            <FlatList
              data={availableStreams}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.streamItem, loading && styles.disabledButton]}
                  onPress={() => joinStream(item.id)}
                  disabled={loading || !wsConnected}
                >
                  <Image
                    source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
                    style={styles.streamThumbnail}
                    defaultSource={defaultImage}
                    onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
                  />
                  <View style={styles.streamInfo}>
                    <View style={styles.streamTitleContainer}>
                      <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
                      <View style={styles.liveBadge}>
                        <View style={styles.liveDotSmall} />
                        <Text style={styles.liveBadgeText}>LIVE</Text>
                      </View>
                    </View>
                    <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
                  </View>
                  <Icon name="play-circle-outline" size={30} color="#e53e3e" />
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noStreams}>
              <Icon name="live-tv" size={50} color="#718096" />
              <Text style={styles.noStreamsText}>No one is live right now</Text>
              {!wsConnected && (
                <Text style={styles.connectingText}>
                  {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
                    ? "Failed to connect to server"
                    : "Connecting to server..."}
                </Text>
              )}
              {wsConnected && listStreamRetries >= 5 && (
                <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
              )}
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => sendMessage({ type: "list-streams" })}
                disabled={loading || !wsConnected}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
        {viewerModeRef.current && remoteURL && typeof remoteURL === 'string' ? (
          <View style={styles.videoContainer}>
            <RTCView
              key={remoteURL}
              streamURL={remoteURL}
              style={styles.remoteVideo}
              objectFit="cover"
              onError={(e) => console.error("[RTCView] Error:", e)}
            />
          </View>
        ) : isBroadcasterRef.current && localURL ? (
          <View style={styles.videoContainer}>
            <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.loadingText}>
              {viewerModeRef.current ? "Connecting to stream..." : "Starting your stream..."}
            </Text>
          </View>
        )}

        <View style={styles.streamInfoOverlay}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
            <Text style={styles.viewerCount}>{viewers} watching</Text>
            <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
          </View>

          <View style={styles.broadcasterInfo}>
            <Image
              source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
              style={styles.broadcasterAvatar}
              defaultSource={defaultImage}
              onError={(e) => console.log("Broadcaster avatar load error:", e.nativeEvent.error)}
            />
            <Text style={styles.broadcasterName}>{displayName}</Text>
          </View>
        </View>

        <View style={styles.commentsContainer}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentBubble}>
                <Text style={styles.commentUser}>{item.user}:</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
            inverted
          />
        </View>

        {isBroadcasterRef.current && (
          <View style={styles.streamControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
              <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
                <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
              <View style={styles.controlIcon}>
                <Icon name="flip-camera-ios" size={24} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={endStream}>
              <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
                <Icon name="call-end" size={24} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={debugStreams}>
              <View style={styles.controlIcon}>
                <Icon name="bug-report" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {viewerModeRef.current && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.commentInputContainer}
          >
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentInput}
              onChangeText={setCommentInput}
              onSubmitEditing={sendComment}
            />
            <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
              <Icon name="favorite" size={24} color="white" />
              <Text style={styles.likeCount}>{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
              <Icon name="bug-report" size={20} color="white" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectionScreen: {
    flex: 1,
    padding: 20,
  },
  streamScreen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  startStreamButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e53e3e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  startStreamIcon: {
    marginRight: 10,
  },
  startStreamText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  debugButton: {
    backgroundColor: "#4a5568",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  debugButtonText: {
    color: "white",
    fontSize: 16,
  },
  availableStreamsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 15,
  },
  streamItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  streamThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  streamInfo: {
    flex: 1,
  },
  streamTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e53e3e",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },
  liveDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginRight: 5,
  },
  liveBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  streamViewers: {
    fontSize: 14,
    color: "#a0aec0",
    marginTop: 5,
  },
  noStreams: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noStreamsText: {
    fontSize: 18,
    color: "#a0aec0",
    marginTop: 10,
  },
  connectingText: {
    fontSize: 16,
    color: "#e53e3e",
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: "#4a5568",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  remoteVideo: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a202c",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
  streamInfoOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e53e3e",
    marginRight: 5,
  },
  liveText: {
    color: "white",
    fontWeight: "600",
    marginRight: 10,
  },
  viewerCount: {
    color: "white",
    fontWeight: "600",
    marginRight: 10,
  },
  duration: {
    color: "white",
    fontWeight: "600",
  },
  broadcasterInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  broadcasterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  broadcasterName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  commentsContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    maxHeight: 200,
  },
  commentBubble: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  commentUser: {
    color: "#e53e3e",
    fontWeight: "600",
    marginRight: 5,
  },
  commentText: {
    color: "white",
    flex: 1,
  },
  streamControls: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
  },
  controlButton: {
    marginLeft: 10,
  },
  controlIcon: {
    backgroundColor: "#4a5568",
    padding: 10,
    borderRadius: 25,
  },
  commentInputContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  likeCount: {
    color: "white",
    marginLeft: 5,
  },
});


