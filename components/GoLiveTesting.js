
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
//         : [{ urls: "stun:stun.l.google.com:19302" }];
//       console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
//     } catch (err) {
//       console.error("[Xirsys] Failed to fetch ICE servers:", err);
//       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
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
//           streamId,
//           viewer_channel: isBroadcaster ? targetId : undefined
//         });
//         console.log(`[WebRTC] Sent ICE candidate for ${targetId}`);
//       }
//     };

//     // pc.ontrack = (evt) => {
//     //   console.log(`[WebRTC] Track received for ${targetId}: ${evt.track.kind}, enabled: ${evt.track.enabled}`);
//     //   if (!isBroadcaster && evt.streams && evt.streams[0]) {
//     //     remoteStream.current = evt.streams[0];
//     //     try {
//     //       const url = remoteStream.current.toURL();
//     //       setRemoteURL(url);
//     //       console.log(`[WebRTC] Set remoteURL for ${targetId}: ${url}`);
//     //     } catch (e) {
//     //       console.error(`[WebRTC] Error setting remoteURL for ${targetId}:`, e);
//     //     }
//     //   }
//     // };

//     pc.ontrack = (evt) => {
//   if (!isBroadcaster) {
//     if (evt.streams && evt.streams.length > 0) {
//       remoteStream.current = evt.streams[0];
//       setRemoteURL(remoteStream.current.toURL());
//     } else if (evt.track) {
//       // fallback: create MediaStream from track
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

//     // if (isBroadcaster && localStream.current) {
//     //   localStream.current.getTracks().forEach((track) => {
//     //     pc.addTrack(track, localStream.current);
//     //     console.log(`[WebRTC] Added ${track.kind} track to ${targetId}, enabled: ${track.enabled}`);
//     //   });
//     // }

//     if (isBroadcaster && localStream.current) {
//   localStream.current.getTracks().forEach((track) => {
//     pc.addTrack(track, localStream.current);
//   });
// }


//     peerConnections.current[targetId] = pc;
//     queuedRemoteCandidates.current[targetId] = [];
//     return pc;
//   };

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
//       ws.current.send(JSON.stringify(msg));
//       console.log("[WS] Sent:", msg.type, "Payload:", msg);
//     } else {
//       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
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
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//         console.log("[WS] Received:", data);
//       } catch {
//         console.error("[WS] Failed to parse message:", evt.data);
//         return;
//       }

//       switch (data.type) {
//         case "list-streams": {
//           const streams = Array.isArray(data.streams) ? data.streams : [];
//           setAvailableStreams(streams);
//           console.log("[WS] Updated available streams:", streams);
//           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
//             setTimeout(() => {
//               sendMessage({ type: "list-streams" });
//               setListStreamRetries(prev => prev + 1);
//               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
//             }, 1000);
//           }
//           break;
//         }
//         case "stream-started": {
//           if (data.stream && data.stream.id) {
//             setAvailableStreams(prev => {
//               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
//               console.log("[WS] Stream started, updated streams:", newStreams);
//               return newStreams;
//             });
//           }
//           break;
//         }
//         case "stream-ended": {
//           if (data.streamId) {
//             setAvailableStreams(prev => {
//               const newStreams = prev.filter(s => s.id !== data.streamId);
//               console.log("[WS] Stream ended, updated streams:", newStreams);
//               return newStreams;
//             });
//             if (viewerMode && streamId === data.streamId) {
//               Alert.alert("Stream Ended", "The live stream has ended");
//               endStream();
//             }
//           }
//           break;
//         }
//         case "join-stream": {
//           if (!isBroadcaster) {
//             console.warn("[WS] Ignoring join-stream: Not broadcaster");
//             return;
//           }
//           if (Object.keys(peerConnections.current).length >= MAX_VIEWERS) {
//             console.warn("[WS] Max viewers reached, rejecting join-stream");
//             sendMessage({
//               type: "error",
//               message: "Maximum viewers reached",
//               streamId: data.streamId,
//               viewer_channel: data.viewer_channel
//             });
//             return;
//           }
//           if (data.streamId !== streamId) {
//             console.warn(`[WS] Ignoring join-stream: Stream ID mismatch (received: ${data.streamId}, expected: ${streamId})`);
//             return;
//           }
//           const viewerId = data.viewer_channel;
//           console.log(`[WS] Processing join-stream for viewer ${viewerId}, stream ${data.streamId}`);
//           try {
//             if (!localStream.current) {
//               console.error("[WebRTC] No local stream available for broadcaster");
//               sendMessage({
//                 type: "error",
//                 message: "Broadcaster stream not available",
//                 streamId: data.streamId,
//                 viewer_channel: viewerId
//               });
//               return;
//             }
//             // const pc = await createPeerConnection(viewerId);
//             // const offer = await pc.createOffer();
//             // await pc.setLocalDescription(offer);
//             // sendMessage({
//             //   type: "offer",
//             //   offer,
//             //   streamId: data.streamId,
//             //   viewer_channel: viewerId
//             // });

//             const pc = await createPeerConnection(viewerId);
// const offer = await pc.createOffer();
// await pc.setLocalDescription(offer);

// sendMessage({
//   type: "offer",
//   offer,
//   streamId: data.streamId,
//   viewer_channel: viewerId
// });

//             console.log(`[WS] Sent offer to viewer ${viewerId} for stream ${data.streamId}`);
//           } catch (error) {
//             console.error(`[WebRTC] Failed to create offer for viewer ${viewerId}:`, error);
//             cleanupPeerConnection(viewerId);
//             sendMessage({
//               type: "error",
//               message: `Failed to start stream connection: ${error.message}`,
//               streamId: data.streamId,
//               viewer_channel: viewerId
//             });
//           }
//           break;
//         }
//         case "offer": {
//           if (isBroadcaster) {
//             console.warn("[WS] Ignoring offer: Broadcaster should not receive offers");
//             return;
//           }
//           try {
//             const pc = await createPeerConnection(data.streamId);
//             console.log(`[WebRTC] Setting remote offer for ${data.streamId}`);
//             await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
//             await drainQueuedCandidates(data.streamId);

//             const answer = await pc.createAnswer();
//             await pc.setLocalDescription(answer);

//             sendMessage({
//               type: "answer",
//               answer,
//               streamId: data.streamId
//             });
//             console.log(`[WS] Sent answer for stream ${data.streamId}`);

//             setStreamId(data.streamId);
//             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
//             if (streamInfo) {
//               setCurrentStream(streamInfo);
//               console.log("[WS] Joined stream:", streamInfo);
//             }
//             setViewerMode(true);
//             setLoading(false); // Ensure loading is cleared after joining
//           } catch (error) {
//             console.error("[WebRTC] Error handling stream offer:", error);
//             Alert.alert("Error", "Failed to join stream: " + error.message);
//             setViewerMode(false);
//             setCurrentStream(null);
//             setLoading(false);
//             cleanupPeerConnection(data.streamId);
//           }
//           break;
//         }
//         case "answer": {
//           if (!isBroadcaster) {
//             console.warn("[WS] Ignoring answer: Not broadcaster");
//             return;
//           }
//           const viewerId = data.streamId;
//           const pc = peerConnections.current[viewerId];
//           if (!pc) {
//             console.warn(`[WebRTC] No peer connection for viewer ${viewerId}`);
//             return;
//           }
//           try {
//             await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
//             await drainQueuedCandidates(viewerId);
//             console.log(`[WebRTC] Set answer for viewer ${viewerId}`);
//           } catch (e) {
//             console.error(`[WebRTC] setRemoteDescription(answer) failed for viewer ${viewerId}:`, e);
//             cleanupPeerConnection(viewerId);
//           }
//           break;
//         }
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
//         userId: userData.id || ""
//       };
//       setCurrentStream(streamInfo);

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

//     try {
//       await createPeerConnection(streamIdToJoin);
//       sendMessage({
//         type: "join-stream",
//         streamId: streamIdToJoin
//       });
//       console.log(`[WS] Sent join-stream for ${streamIdToJoin}`);
//     } catch (error) {
//       console.error("[WebRTC] Error joining stream:", error);
//       Alert.alert("Error", "Failed to join stream: " + error.message);
//       setViewerMode(false);
//       setCurrentStream(null);
//       setLoading(false);
//       cleanupPeerConnection(streamIdToJoin);
//     }
//   };

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
//             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
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

// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   Image,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Modal,
// //   TextInput,
// //   ActivityIndicator,
// //   Linking,
// //   ScrollView,
// //   Animated,
// //   StatusBar,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import Snackbar from 'react-native-snackbar';
// // import { API_ROUTE } from '../api_routing/api';
// // import AsyncStorage from '@react-native-async-storage/async-storage';


// // const BANNER_IMAGE = require('../assets/images/2aa50969261209.5b7d16b296b51.jpg');

// // const GoLivePage = () => {
// //   const [channelId, setChannelId] = useState('');
// //   const [channelIdInput, setChannelIdInput] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [userId, setUserId] = useState('');
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const fadeAnim = useState(new Animated.Value(0))[0];
// //   const pulseAnim = useState(new Animated.Value(1))[0];

// //   // Brand color
// //   const brandColor = '#0d64dd';

// //   useEffect(() => {
// //     // Fade in animation
// //     Animated.timing(fadeAnim, {
// //       toValue: 1,
// //       duration: 800,
// //       useNativeDriver: true,
// //     }).start();

// //     // Pulse animation for live badge
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.2,
// //           duration: 1000,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 1000,
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     const fetchChannelId = async () => {
// //       try {
// //         const userDataString = await AsyncStorage.getItem('userData');
// //         if (userDataString) {
// //           const userData = JSON.parse(userDataString);
// //           const userId = userData.id || userData.user_id;
// //           setUserId(userId);
          
// //           const response = await fetch(`${API_ROUTE}/user_channel/${userId}/`);
// //           const data = await response.json();
// //           if (data.channel_id) {
// //             setChannelId(data.channel_id);
// //           }
// //         }
// //       } catch (error) {
// //        // console.error('Error:', error);
// //         showError('Failed to fetch user data');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchChannelId();
// //   }, []);

// //   const showError = (message) => {
// //     Snackbar.show({
// //       text: message,
// //       duration: Snackbar.LENGTH_LONG,
// //       backgroundColor: '#FF3B30',
// //       textColor: '#FFFFFF',
// //     });
// //   };

// //   const showSuccess = (message) => {
// //     Snackbar.show({
// //       text: message,
// //       duration: Snackbar.LENGTH_LONG,
// //       backgroundColor: '#4BB543',
// //       textColor: '#FFFFFF',
// //     });
// //   };

// //   const handleSaveChannelId = async () => {
// //     if (!channelIdInput) {
// //       showError('Please enter your Channel ID');
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`${API_ROUTE}/user_channel/${userId}/`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ channel_id: channelIdInput }),
// //       });

// //       if (response.ok) {
// //         setChannelId(channelIdInput);
// //         showSuccess('Channel ID saved successfully!');
// //       } else {
// //         showError('Error saving Channel ID. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('Error saving channel ID:', error);
// //       showError('Failed to save Channel ID');
// //     }
// //   };

// //   const handleGoLive = () => {
// //     if (channelId) {
// //       Linking.openURL(
// //         `https://www.youtube.com/live_dashboard?nv=1&channel=${channelId}`
// //       );
// //     }
// //   };

// //   const FeatureCard = ({ icon, title, description }) => (
// //     <View style={styles.featureCard}>
// //       <Icon name={icon} size={28} color={brandColor} style={styles.featureIcon} />
// //       <Text style={styles.featureTitle}>{title}</Text>
// //       <Text style={styles.featureDescription}>{description}</Text>
// //     </View>
// //   );

// //   return (
// //     <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
// //         <StatusBar backgroundColor='#fff' barStyle='dark-content' />
// //       <ScrollView>
// //         {/* Hero Section with Banner ====================================================*/}
// //         <View style={styles.heroContainer}>
// //           <Image
// //             source={BANNER_IMAGE}
// //             style={styles.heroImage}
// //             resizeMode="cover"
// //           />
// //           <View style={styles.heroOverlay} />
          
// //           <View style={styles.heroContent}>
// //             <Text style={styles.heroTitle}>Connect With Your Friends Live!</Text>
// //             <Text style={styles.heroSubtitle}>
// //               Share moments in real-time with your followers on Showa
// //             </Text>
            
// //             <TouchableOpacity
// //               style={[styles.goLiveButton, { backgroundColor: brandColor }]}
// //               onPress={() => setModalVisible(true)}
// //             >
           
// //               <Text style={styles.goLiveButtonText}>Start Live Stream</Text>
// //             </TouchableOpacity>
// //           </View>
          
// //           {/* Animated Live Badge ====================================*/}
// //           <Animated.View style={[styles.liveBadge, { transform: [{ scale: pulseAnim }] }]}>
// //             <Icon name="fiber-manual-record" size={16} color="white" />
// //             <Text style={styles.liveBadgeText}>LIVE</Text>
// //           </Animated.View>
// //         </View>
        
// //         {/* Feature Cards */}
// //         <View style={styles.featuresContainer}>
// //           <FeatureCard
// //             icon="facebook"
// //             title="Facebook Live"
// //             description="Go live to all your Facebook friends and followers instantly with showa-app"
// //           />
// //           <FeatureCard
// //             icon="tiktok"
// //             title="TikTok Live"
// //             description="Engage with your TikTok audience in real-time with showa-app"
// //           />
          
// //           <FeatureCard
// //             icon="camera-alt"
// //             title="Instagram Live"
// //             description="Connect with your Instagram followers live with showa-app"
// //             />
// //           <FeatureCard
// //             icon="share"
// //             title="Multi-Platform"
// //             description="Stream to multiple platforms simultaneously"
// //           />
// //         </View>


// //         <View style={styles.benefitsContainer}>
// //           <Text style={styles.sectionTitle}>Why Go Live?</Text>
// //           <View style={styles.benefitItem}>
// //             <Icon name="check-circle" size={20} color={brandColor} />
// //             <Text style={styles.benefitText}>Real-time interaction with comments</Text>
// //           </View>
// //           <View style={styles.benefitItem}>
// //             <Icon name="check-circle" size={20} color={brandColor} />
// //             <Text style={styles.benefitText}>Higher visibility in followers' feeds</Text>
// //           </View>
// //           <View style={styles.benefitItem}>
// //             <Icon name="check-circle" size={20} color={brandColor} />
// //             <Text style={styles.benefitText}>Authentic, unedited moments</Text>
// //           </View>
// //           <View style={styles.benefitItem}>
// //             <Icon name="check-circle" size={20} color={brandColor} />
// //             <Text style={styles.benefitText}>Notifications sent to all followers</Text>
// //           </View>
// //         </View>
// //       </ScrollView>

// //       {/* Channel ID Modal ===========================================*/}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <Icon 
// //               name="sensors" 
// //               size={40} 
// //               color={brandColor} 
// //               style={styles.modalIcon}
// //             />
// //             <Text style={styles.modalTitle}>Start Your Live Stream</Text>
// //             <View style={[styles.divider, { backgroundColor: brandColor }]} />
// //             <Text style={styles.modalText}>
// //               Connect your streaming account to go live with your friends
// //             </Text>
            
// //             <TouchableOpacity
// //               onPress={() => Linking.openURL('https://www.youtube.com/account_advanced')}
// //             >
// //               <Text style={[styles.linkText, { color: brandColor }]}>Find Your Channel ID</Text>
// //             </TouchableOpacity>
            
// //             {isLoading ? (
// //               <ActivityIndicator size="large" color={brandColor} style={styles.loader} />
// //             ) : channelId ? (
// //               <>
// //                 <Text style={styles.successText}>Your account is connected!</Text>
// //                 <TouchableOpacity
// //                   style={[styles.actionButton, { backgroundColor: brandColor }]}
// //                   onPress={handleGoLive}
// //                 >
// //                   <Text style={styles.actionButtonText}>🚀 Start Streaming Now</Text>
// //                 </TouchableOpacity>
// //               </>
// //             ) : (
// //               <>
// //                 <TextInput
// //                   style={[styles.input, {color:'#333'}]}
// //                   placeholder="Enter Your Channel ID"
// //                   value={channelIdInput}
// //                   onChangeText={setChannelIdInput}
// //                   placeholderTextColor="#999"
// //                 />
// //                 <TouchableOpacity
// //                   style={[styles.actionButton, { backgroundColor: brandColor }]}
// //                   onPress={handleSaveChannelId}
// //                 >
// //                   <Text style={styles.actionButtonText}>🔗 Connect Account</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   onPress={() => setModalVisible(false)}
// //                 >
// //                   <Text style={[styles.actionButtonText, {marginTop: 20, color: '#777'}]}>
// //                     Maybe Later
// //                   </Text>
// //                 </TouchableOpacity>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </Modal>
// //     </Animated.View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //   },
// //   heroContainer: {
// //     height: 400,
// //     width: '100%',
// //     position: 'relative',
// //     marginBottom: 20,
// //   },
// //   heroImage: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   heroOverlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'rgba(0,0,0,0.4)',
// //   },
// //   heroContent: {
// //     position: 'absolute',
// //     bottom: 40,
// //     left: 0,
// //     right: 0,
// //     paddingHorizontal: 24,
// //     alignItems: 'center',
// //     marginTop:20
// //   },
// //   heroTitle: {
// //     fontSize: 30,
    
// //     color: 'white',
// //     textAlign: 'center',
// //     marginBottom: 8,
// //     marginTop:20,
// //     fontFamily:'Lato-Bold'
// //   },
// //   heroSubtitle: {
// //      fontFamily:'Lato-Regular',
// //     fontSize: 14,
// //     color: 'white',
// //     textAlign: 'center',
// //     marginBottom: 24,
// //     maxWidth: '80%',
// //   },
// //   goLiveButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 14,
// //     paddingHorizontal: 24,
// //     borderRadius: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //     elevation: 5,
// //   },
// //   goLiveButtonText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginLeft: 8,
// //   },
// //   liveBadge: {
// //     position: 'absolute',
// //     top: 16,
// //     left: 16,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'red',
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 20,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginLeft: 4,
// //   },
// //   featuresContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     marginBottom: 30,
// //     marginTop:0
// //   },
// //   featureCard: {
// //     width: '48%',
// //     backgroundColor: 'white',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   featureIcon: {
// //     marginBottom: 12,
// //   },
// //   featureTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 8,
// //   },
// //   featureDescription: {
// //     fontSize: 14,
// //     color: '#666',
// //     lineHeight: 20,
// //   },
// //   benefitsContainer: {
// //     paddingHorizontal: 20,
// //     marginBottom: 30,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 16,
// //     textAlign: 'center',
// //   },
// //   benefitItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //     paddingHorizontal: 10,
// //   },
// //   benefitText: {
// //     fontSize: 15,
// //     color: '#444',
// //     marginLeft: 10,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContent: {
// //     width: '85%',
// //     backgroundColor: 'white',
// //     borderRadius: 16,
// //     padding: 24,
// //     alignItems: 'center',
// //   },
// //   modalIcon: {
// //     marginBottom: 12,
// //   },
// //   modalTitle: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 8,
// //   },
// //   divider: {
// //     height: 1,
// //     width: '100%',
// //     marginVertical: 12,
// //   },
// //   modalText: {
// //     fontSize: 16,
// //     color: '#666',
// //     textAlign: 'center',
// //     marginBottom: 16,
// //   },
// //   linkText: {
// //     fontSize: 14,
// //     marginBottom: 24,
// //     textDecorationLine: 'underline',
// //   },
// //   input: {
// //     width: '100%',
// //     height: 50,
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     borderRadius: 8,
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //     fontSize: 16,
// //   },
// //   actionButton: {
// //     width: '100%',
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   actionButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   successText: {
// //     fontSize: 16,
// //     color: '#666',
// //     marginBottom: 24,
// //   },
// //   loader: {
// //     marginVertical: 24,
// //   },
// // });

// // export default GoLivePage;


// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   Modal,
// //   SafeAreaView,
// //   StatusBar,
// //   ImageBackground,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   MediaStream,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import { Image } from "react-native-animatable";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";
// // import InCallManager from "react-native-incall-manager";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [webrtcReady, setWebrtcReady] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
  
// //   // New states for live streaming
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = () => {
// //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// //     };

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       console.log("[WebRTC] Track received:", evt.track?.kind);
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try { setRemoteURL(remoteStream.current.toURL()); } catch {}
// //         setWebrtcReady(true);
// //       }
// //     };

// //     pc.current.onconnectionstatechange = () => {
// //       if (!pc.current) {
// //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// //         return;
// //       }
// //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// //       if (pc.current.connectionState === "failed") {
// //         console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
// //       }
// //     };

// //     pc.current.oniceconnectionstatechange = () => {
// //       if (!pc.current) return;
// //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }
    
// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;
    
// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     isCleaningUpRef.current = true;

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] pc close error", e);
// //     }
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] localStream stop error", e);
// //     }
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setWebrtcReady(false);
// //     setIsMuted(false);
// //     setIsLive(false);
// //     setViewers(0);
// //     setComments([]);
// //     setLikes(0);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     // For live streams, use a dedicated room
// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);

// //       // Request list of available streams
// //       sendMessage({ type: "list-streams" });
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //       } catch {
// //         return;
// //       }

// //       console.log("[WS] Received:", data?.type);

// //       switch (data.type) {
// //         case "streams-list": {
// //           setAvailableStreams(data.streams || []);
// //           break;
// //         }
// //         case "stream-started": {
// //           // New stream available
// //           setAvailableStreams(prev => [...prev, data.stream]);
// //           break;
// //         }
// //         case "stream-ended": {
// //           // Remove ended stream
// //           setAvailableStreams(prev => prev.filter(s => s.id !== data.streamId));
// //           if (viewerMode && streamId === data.streamId) {
// //             Alert.alert("Stream Ended", "The live stream has ended");
// //             endStream();
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           // As a viewer, receive offer from broadcaster
// //           if (isBroadcaster) return;
          
// //           try {
// //             await ensurePeerConnection();
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates();

// //             const answer = await pc.current.createAnswer();
// //             await pc.current.setLocalDescription(answer);
            
// //             sendMessage({ 
// //               type: "answer", 
// //               answer,
// //               streamId: data.streamId
// //             });

// //             setWebrtcReady(true);
// //             setStreamId(data.streamId);
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("Error handling stream offer:", error?.message || error);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           // As a broadcaster, receive answer from viewer
// //           if (!isBroadcaster) return;
// //           if (!pc.current) return;
          
// //           try {
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates();
// //           } catch (e) {
// //             console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           if (!pc.current) return;
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           setViewers(data.count);
// //           break;
// //         }
// //         case "new-comment": {
// //           setComments(prev => [...prev, data.comment]);
// //           break;
// //         }
// //         case "new-like": {
// //           setLikes(prev => prev + 1);
// //           break;
// //         }
// //         default:
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current) {
// //         cleanupPeerConnection();
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setIsBroadcaster(true);
    
// //     await ensurePeerConnection();
// //     const ok = await ensureLocalStreamAndAttach();
// //     if (!ok || !pc.current) return;

// //     try {
// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      
// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}`;
// //       setStreamId(newStreamId);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo: {
// //           broadcaster: userData.name || "User",
// //           title: `${userData.name}'s Live Stream`,
// //           thumbnail: userData.profile_picture || ""
// //         }
// //       });
      
// //       setIsLive(true);
// //       console.log("[Live] Stream started");
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);
    
// //     sendMessage({
// //       type: "join-stream",
// //       streamId: streamIdToJoin
// //     });
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster) {
// //       sendMessage({ 
// //         type: "end-stream", 
// //         streamId 
// //       });
// //     }
    
// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) { 
// //       console.warn("[endStream] error closing ws", e); 
// //     }
// //     ws.current = null;

// //     cleanupPeerConnection();
// //     navigation.navigate("PHome");
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;
    
// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";
    
// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };
    
// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });
    
// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Stream</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <TouchableOpacity style={styles.startStreamButton} onPress={startStream}>
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>Go Live</Text>
// //           </TouchableOpacity>
          
// //           <Text style={styles.availableStreamsTitle}>Available Streams</Text>
          
// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity 
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                 >
// //                   <Image 
// //                     source={{ uri: `${API_ROUTE_IMAGE}${item.thumbnail}` }}
// //                     style={styles.streamThumbnail}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <Text style={styles.streamTitle}>{item.title}</Text>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} viewers</Text>
// //                   </View>
// //                   <Icon name="play-arrow" size={24} color="white" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No live streams available</Text>
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //               />
// //             </View>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} viewers</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>
          
// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //               style={styles.broadcasterAvatar}
// //             />
// //             <Text style={styles.broadcasterName}>{name}</Text>
// //           </View>
// //         </View>

// //         {/* Comments section */}
// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {/* Stream controls for broadcaster */}
// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Comment input for viewers */}
// //         {viewerMode && (
// //           <KeyboardAvoidingView 
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: 'red',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //   },
// //   duration: {
// //     color: 'white',
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12,
// //     marginTop: 2,
// //   },
// // });


// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
  
// //   // New states for live streaming
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = () => {
// //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// //     };

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate, streamId });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       console.log("[WebRTC] Track received:", evt.track?.kind);
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try { 
// //           setRemoteURL(remoteStream.current.toURL()); 
// //         } catch (e) {
// //           console.error("Error setting remote URL:", e);
// //         }
// //       }
// //     };

// //     pc.current.onconnectionstatechange = () => {
// //       if (!pc.current) {
// //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// //         return;
// //       }
// //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// //       if (pc.current.connectionState === "failed") {
// //         console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
// //       }
// //     };

// //     pc.current.oniceconnectionstatechange = () => {
// //       if (!pc.current) return;
// //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }
    
// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;
    
// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     isCleaningUpRef.current = true;

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] pc close error", e);
// //     }
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] localStream stop error", e);
// //     }
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setIsMuted(false);
// //     setIsLive(false);
// //     setViewers(0);
// //     setComments([]);
// //     setLikes(0);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open");
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     // For live streams, use a dedicated room
// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);

// //       // Request list of available streams
// //       sendMessage({ type: "list-streams" });
      
// //       // Clear any reconnect timeout
// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "streams-list": {
// //           setAvailableStreams(data.streams || []);
// //           break;
// //         }
// //         case "stream-started": {
// //           // New stream available
// //           setAvailableStreams(prev => [...prev.filter(s => s.id !== data.stream.id), data.stream]);
// //           break;
// //         }
// //         case "stream-ended": {
// //           // Remove ended stream
// //           setAvailableStreams(prev => prev.filter(s => s.id !== data.streamId));
// //           if (viewerMode && streamId === data.streamId) {
// //             Alert.alert("Stream Ended", "The live stream has ended");
// //             endStream();
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           // As a viewer, receive offer from broadcaster
// //           if (isBroadcaster) return;
          
// //           try {
// //             await ensurePeerConnection();
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates();

// //             const answer = await pc.current.createAnswer();
// //             await pc.current.setLocalDescription(answer);
            
// //             sendMessage({ 
// //               type: "answer", 
// //               answer,
// //               streamId: data.streamId
// //             });

// //             setStreamId(data.streamId);
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("Error handling stream offer:", error?.message || error);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           // As a broadcaster, receive answer from viewer
// //           if (!isBroadcaster) return;
// //           if (!pc.current) return;
          
// //           try {
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates();
// //           } catch (e) {
// //             console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           if (!pc.current) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //             return;
// //           }
          
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           setViewers(data.count);
// //           break;
// //         }
// //         case "new-comment": {
// //           setComments(prev => [...prev, data.comment]);
// //           break;
// //         }
// //         case "new-like": {
// //           setLikes(prev => prev + 1);
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message);
// //           break;
// //         }
// //         default:
// //           console.log("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && !reconnectTimeoutRef.current) {
// //         // Attempt to reconnect after 3 seconds
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect...");
// //           connectSignaling();
// //         }, 3000);
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);
    
// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach();
// //       if (!ok || !pc.current) {
// //         setLoading(false);
// //         return;
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      
// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo: {
// //           id: newStreamId,
// //           broadcaster: userData.name || "User",
// //           title: `${userData.name}'s Live Stream`,
// //           thumbnail: userData.profile_picture || profile_image || "",
// //           viewers: 0
// //         }
// //       });
      
// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId);
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);
    
// //     try {
// //       await ensurePeerConnection();
      
// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //     } catch (error) {
// //       console.error("Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream");
// //       setViewerMode(false);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({ 
// //         type: "end-stream", 
// //         streamId 
// //       });
// //     }
    
// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) { 
// //       console.warn("[endStream] error closing ws", e); 
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;
    
// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";
    
// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };
    
// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });
    
// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
    
// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   // Refresh available streams periodically
// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, 5000);
      
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Stream</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <TouchableOpacity 
// //             style={[styles.startStreamButton, loading && styles.disabledButton]} 
// //             onPress={startStream}
// //             disabled={loading}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>
          
// //           <Text style={styles.availableStreamsTitle}>Available Streams</Text>
          
// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity 
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading}
// //                 >
// //                   {/* <Image 
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : require('../assets/default-avatar.png') }}
// //                     style={styles.streamThumbnail}
// //                   /> */}
// //                   <View style={styles.streamInfo}>
// //                     <Text style={styles.streamTitle}>{item.title}</Text>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} viewers</Text>
// //                   </View>
// //                   <Icon name="play-arrow" size={24} color="white" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No live streams available</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>Connecting to server...</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               {/* <Image
// //                 source={{ uri: profile_image ? `${API_ROUTE_IMAGE}${profile_image}` : require('../assets/images/dad.jpg') }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //               /> */}
// //              <Image
// //   source={{ uri: profile_image ? `${API_ROUTE_IMAGE}${String(profile_image)}` : require('../assets/images/dad.jpg') }}
// //   style={styles.avatarImage}
// //   resizeMode="cover"
// // />
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} viewers</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>
          
// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: profile_image ? `${API_ROUTE_IMAGE}${profile_image}` : require('../assets/images/dad.jpg') }}
// //               style={styles.broadcasterAvatar}
// //             />
// //             <Text style={styles.broadcasterName}>{name}</Text>
// //           </View>
// //         </View>

// //         {/* Comments section */}
// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {/* Stream controls for broadcaster */}
// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Comment input for viewers */}
// //         {viewerMode && (
// //           <KeyboardAvoidingView 
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
//   // },
//   // streamScreen: {
//   //   flex: 1,
//   //   justifyContent: 'space-between',
//   // },
//   // videoContainer: {
//   //   flex: 1,
//   //   width: '100%',
//   //   position: 'relative',
//   // },
//   // remoteVideo: {
//   //   flex: 1,
//   //   width: '100%',
//   //   backgroundColor: '#000',
//   // },
//   // avatarContainer: {
//   //   flex: 1,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   backgroundColor: '#000',
//   // },
//   // avatar: {
//   //   width: 150,
//   //   height: 150,
//   //   borderRadius: 75,
//   //   backgroundColor: '#4a5568',
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   borderWidth: 3,
//   //   borderColor: 'rgba(255,255,255,0.2)',
//   // },
//   // avatarImage: {
//   //   width: '100%',
//   //   height: '100%',
//   //   borderRadius: 75,
//   // },
//   // loadingText: {
//   //   color: 'white',
//   //   marginTop: 20,
//   //   fontSize: 16,
//   // },
//   // streamInfoOverlay: {
//   //   position: 'absolute',
//   //   top: 10,
//   //   left: 0,
//   //   right: 0,
//   //   padding: 15,
//   //   zIndex: 100,
//   // },
//   // liveIndicator: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   //   padding: 8,
//   //   borderRadius: 20,
//   //   alignSelf: 'flex-start',
//   // },
//   // liveDot: {
//   //   width: 10,
//   //   height: 10,
//   //   borderRadius: 5,
//   //   backgroundColor: 'red',
//   //   marginRight: 5,
//   // },
//   // liveText: {
//   //   color: 'white',
//   //   fontWeight: 'bold',
//   //   marginRight: 10,
//   // },
//   // viewerCount: {
//   //   color: 'white',
//   //   marginRight: 10,
//   // },
//   // duration: {
//   //   color: 'white',
//   // },
//   // broadcasterInfo: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   //   padding: 8,
//   //   borderRadius: 20,
//   //   alignSelf: 'flex-start',
//   //   marginTop: 10,
//   // },
//   // broadcasterAvatar: {
//   //   width: 30,
//   //   height: 30,
//   //   borderRadius: 15,
//   //   marginRight: 10,
//   // },
//   // broadcasterName: {
//   //   color: 'white',
//   //   fontWeight: 'bold',
//   // },
//   // commentsContainer: {
//   //   position: 'absolute',
//   //   top: 100,
//   //   left: 10,
//   //   right: 10,
//   //   height: 200,
//   //   zIndex: 90,
//   // },
//   // commentBubble: {
//   //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   //   padding: 8,
//   //   borderRadius: 12,
//   //   marginBottom: 5,
//   //   alignSelf: 'flex-start',
//   //   maxWidth: '80%',
//   // },
//   // commentUser: {
//   //   color: '#FFD700',
//   //   fontWeight: 'bold',
//   //   fontSize: 12,
//   // },
//   // commentText: {
//   //   color: 'white',
//   //   fontSize: 14,
//   // },
//   // streamControls: {
//   //   position: 'absolute',
//   //   bottom: 20,
//   //   right: 20,
//   //   zIndex: 100,
//   // },
//   // controlButton: {
//   //   alignItems: 'center',
//   //   marginBottom: 15,
//   // },
//   // controlIcon: {
//   //   width: 50,
//   //   height: 50,
//   //   borderRadius: 25,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   // },
//   // commentInputContainer: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   padding: 10,
//   //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   //   zIndex: 100,
//   // },
//   // commentInput: {
//   //   flex: 1,
//   //   backgroundColor: 'rgba(255, 255, 255, 0.9)',
//   //   borderRadius: 20,
//   //   paddingHorizontal: 15,
//   //   paddingVertical: 8,
//   //   marginRight: 10,
//   // },
//   // likeButton: {
//   //   padding: 10,
//   //   backgroundColor: 'rgba(255, 0, 0, 0.7)',
//   //   borderRadius: 20,
//   //   alignItems: 'center',
//   // },
//   // likeCount: {
//   //   color: 'white',
//   //   fontSize: 12,
//   //   marginTop: 2,
//   // },
// // });

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
  
// //   // New states for live streaming
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // Helper function to handle image sources safely
// //   const getImageSource = (imagePath) => {
// //     if (!imagePath) return require('../assets/images/dad.jpg');
    
// //     // Handle different data types
// //     const path = typeof imagePath === 'string' ? imagePath : String(imagePath);
    
// //     // Ensure the path doesn't already contain the API route
// //     if (path.startsWith('http')) {
// //       return { uri: path };
// //     }
    
// //     return { uri: `${API_ROUTE_IMAGE}${path}` };
// //   };

// //   // ... (rest of your existing functions remain the same)

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);
    
// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach();
// //       if (!ok || !pc.current) {
// //         setLoading(false);
// //         return;
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      
// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);


// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo: {
// //           id: newStreamId,
// //           broadcaster: userData.name || "User",
// //           broadcasterId: userData.id || "unknown",
// //           title: `${userData.name}'s Live Stream`,
// //           thumbnail: userData.profile_picture || profile_image || "",
// //           broadcasterAvatar: userData.profile_picture || profile_image || "",
// //           viewers: 0
// //         }
// //       });
      
// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId);
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   // Render each stream item in the list
// //   const renderStreamItem = ({ item }) => (
// //     <TouchableOpacity 
// //       style={styles.streamItem}
// //       onPress={() => joinStream(item.id)}
// //       disabled={loading}
// //     >
// //       <View style={styles.streamThumbnailContainer}>
// //         <Image 
// //           source={getImageSource(item.thumbnail)}
// //           style={styles.streamThumbnail}
// //         />
// //         <View style={styles.liveBadge}>
// //           <View style={styles.liveDotSmall} />
// //           <Text style={styles.liveTextSmall}>LIVE</Text>
// //         </View>
// //         <View style={styles.viewerCountBadge}>
// //           <Icon name="people" size={14} color="white" />
// //           <Text style={styles.viewerCountText}>{item.viewers || 0}</Text>
// //         </View>
// //       </View>
      
// //       <View style={styles.streamInfo}>
// //         <Text style={styles.streamTitle}>{item.title}</Text>
// //         <View style={styles.broadcasterContainer}>
// //           <Image
// //             source={getImageSource(item.broadcasterAvatar)}
// //             style={styles.broadcasterThumbnail}
// //           />
// //           <Text style={styles.broadcasterName}>{item.broadcaster}</Text>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Stream</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <TouchableOpacity 
// //             style={[styles.startStreamButton, loading && styles.disabledButton]} 
// //             onPress={startStream}
// //             disabled={loading}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>
          
// //           <Text style={styles.availableStreamsTitle}>Live Now</Text>
          
// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={renderStreamItem}
// //               contentContainerStyle={styles.streamsList}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No live streams available</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>Connecting to server...</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   // ... (rest of your component remains the same, but update Image components)
  
// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {/* Update all Image components to use getImageSource */}
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={getImageSource(profile_image)}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //               />
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} viewers</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>
          
// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={getImageSource(profile_image)}
// //               style={styles.broadcasterAvatar}
// //             />
// //             <Text style={styles.broadcasterName}>{name}</Text>
// //           </View>
// //         </View>

// //         {/* ... rest of your component */}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 15,
// //   },
// //   streamsList: {
// //     paddingBottom: 20,
// //   },
// //   streamItem: {
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     borderRadius: 12,
// //     marginBottom: 15,
// //     overflow: 'hidden',
// //   },
// //   streamThumbnailContainer: {
// //     position: 'relative',
// //     height: 200,
// //   },
// //   streamThumbnail: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   liveBadge: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(229, 62, 62, 0.9)',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 4,
// //   },
// //   liveDotSmall: {
// //     width: 6,
// //     height: 6,
// //     borderRadius: 3,
// //     backgroundColor: 'white',
// //     marginRight: 4,
// //   },
// //   liveTextSmall: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   viewerCountBadge: {
// //     position: 'absolute',
// //     bottom: 10,
// //     right: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 4,
// //   },
// //   viewerCountText: {
// //     color: 'white',
// //     fontSize: 12,
// //     marginLeft: 4,
// //   },
// //   streamInfo: {
// //     padding: 15,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginBottom: 8,
// //   },
// //   broadcasterContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   broadcasterThumbnail: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     marginRight: 8,
// //   },
// //   broadcasterName: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
  
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: 'red',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //   },
// //   duration: {
// //     color: 'white',
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12,
// //     marginTop: 2,
// //   },
// //   // ... (rest of your styles remain the same)
// // });


// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
  
// //   // New states for live streaming
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = () => {
// //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// //     };

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate, streamId });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       console.log("[WebRTC] Track received:", evt.track?.kind);
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try { 
// //           setRemoteURL(remoteStream.current.toURL()); 
// //         } catch (e) {
// //           console.error("Error setting remote URL:", e);
// //         }
// //       }
// //     };

// //     pc.current.onconnectionstatechange = () => {
// //       if (!pc.current) {
// //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// //         return;
// //       }
// //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// //       if (pc.current.connectionState === "failed") {
// //         console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
// //       }
// //     };

// //     pc.current.oniceconnectionstatechange = () => {
// //       if (!pc.current) return;
// //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }
    
// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;
    
// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     isCleaningUpRef.current = true;

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] pc close error", e);
// //     }
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] localStream stop error", e);
// //     }
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setIsMuted(false);
// //     setIsLive(false);
// //     setViewers(0);
// //     setComments([]);
// //     setLikes(0);
// //     setCurrentStream(null);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open");
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     // For live streams, use a dedicated room
// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);

// //       // Request list of available streams
// //       sendMessage({ type: "list-streams" });
      
// //       // Clear any reconnect timeout
// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           // Handle list-streams response, expecting a streams array
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           break;
// //         }
// //         case "stream-started": {
// //           // New stream available
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           } else {
// //             console.warn("[WS] Invalid stream-started data:", data);
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           // Remove ended stream
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           } else {
// //             console.warn("[WS] Invalid stream-ended data:", data);
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           // As a viewer, receive offer from broadcaster
// //           if (isBroadcaster) return;
          
// //           try {
// //             await ensurePeerConnection();
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates();

// //             const answer = await pc.current.createAnswer();
// //             await pc.current.setLocalDescription(answer);
            
// //             sendMessage({ 
// //               type: "answer", 
// //               answer,
// //               streamId: data.streamId
// //             });

// //             setStreamId(data.streamId);
// //             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //             if (streamInfo) {
// //               setCurrentStream(streamInfo);
// //               console.log("[WS] Joined stream:", streamInfo);
// //             }
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("Error handling stream offer:", error?.message || error);
// //             Alert.alert("Error", "Failed to join stream");
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           // As a broadcaster, receive answer from viewer
// //           if (!isBroadcaster) return;
// //           if (!pc.current) return;
          
// //           try {
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates();
// //           } catch (e) {
// //             console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           if (!pc.current) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //             return;
// //           }
          
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           setViewers(data.count || 0);
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           setLikes(prev => prev + 1);
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && !reconnectTimeoutRef.current) {
// //         // Attempt to reconnect after 3 seconds
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect...");
// //           connectSignaling();
// //         }, 3000);
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);
    
// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach();
// //       if (!ok || !pc.current) {
// //         setLoading(false);
// //         setIsBroadcaster(false);
// //         return;
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      
// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo
// //       });
      
// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);
    
// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);
    
// //     try {
// //       await ensurePeerConnection();
      
// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //     } catch (error) {
// //       console.error("Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream");
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({ 
// //         type: "end-stream", 
// //         streamId 
// //       });
// //     }
    
// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) { 
// //       console.warn("[endStream] error closing ws", e); 
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;
    
// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";
    
// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };
    
// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });
    
// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
    
// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   // Refresh available streams periodically
// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, 3000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <TouchableOpacity 
// //             style={[styles.startStreamButton, loading && styles.disabledButton]} 
// //             onPress={startStream}
// //             disabled={loading}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>
          
// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>
          
// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity 
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading}
// //                 >
// //                   <Image 
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>Connecting to server...</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //                 defaultSource={defaultImage}
// //               />
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>
          
// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //             />
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         {/* Comments section */}
// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {/* Stream controls for broadcaster */}
// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Comment input for viewers */}
// //         {viewerMode && (
// //           <KeyboardAvoidingView 
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     overflow: 'hidden',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 1,
// //     marginTop: 2,
    
// //   },
// // });

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
  
// //   // New states for live streaming
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);
// //   const [listStreamRetries, setListStreamRetries] = useState(0);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = () => {
// //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// //     };

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate, streamId });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       console.log("[WebRTC] Track received:", evt.track?.kind);
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try { 
// //           setRemoteURL(remoteStream.current.toURL()); 
// //         } catch (e) {
// //           console.error("Error setting remote URL:", e);
// //         }
// //       }
// //     };

// //     pc.current.onconnectionstatechange = () => {
// //       if (!pc.current) {
// //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// //         return;
// //       }
// //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// //       if (pc.current.connectionState === "failed") {
// //         console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
// //       }
// //     };

// //     pc.current.oniceconnectionstatechange = () => {
// //       if (!pc.current) return;
// //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }
    
// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;
    
// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     isCleaningUpRef.current = true;

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] pc close error", e);
// //     }
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] localStream stop error", e);
// //     }
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setIsMuted(false);
// //     setIsLive(false);
// //     setViewers(0);
// //     setComments([]);
// //     setLikes(0);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type, "Payload:", msg);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     // For live streams, use a dedicated room
// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
// //     console.log("[WS] Connecting to:", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);
// //       setListStreamRetries(0);

// //       // Request list of available streams
// //       sendMessage({ type: "list-streams" });
      
// //       // Clear any reconnect timeout
// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           // Handle list-streams response, expecting a streams array
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
// //             // Retry fetching streams if empty
// //             setTimeout(() => {
// //               sendMessage({ type: "list-streams" });
// //               setListStreamRetries(prev => prev + 1);
// //               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
// //             }, 1000);
// //           }
// //           break;
// //         }
// //         case "stream-started": {
// //           // New stream available
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           } else {
// //             console.warn("[WS] Invalid stream-started data:", data);
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           // Remove ended stream
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           } else {
// //             console.warn("[WS] Invalid stream-ended data:", data);
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           // As a viewer, receive offer from broadcaster
// //           if (isBroadcaster) return;
          
// //           try {
// //             await ensurePeerConnection();
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates();

// //             const answer = await pc.current.createAnswer();
// //             await pc.current.setLocalDescription(answer);
            
// //             sendMessage({ 
// //               type: "answer", 
// //               answer,
// //               streamId: data.streamId
// //             });

// //             setStreamId(data.streamId);
// //             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //             if (streamInfo) {
// //               setCurrentStream(streamInfo);
// //               console.log("[WS] Joined stream:", streamInfo);
// //             }
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("Error handling stream offer:", error?.message || error);
// //             Alert.alert("Error", "Failed to join stream");
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           // As a broadcaster, receive answer from viewer
// //           if (!isBroadcaster) return;
// //           if (!pc.current) return;
          
// //           try {
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates();
// //           } catch (e) {
// //             console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           if (!pc.current) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //             return;
// //           }
          
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           setViewers(data.count || 0);
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           setLikes(prev => prev + 1);
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && !reconnectTimeoutRef.current) {
// //         // Attempt to reconnect after 3 seconds
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect...");
// //           connectSignaling();
// //         }, 3000);
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //       setWsConnected(false);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);
    
// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach();
// //       if (!ok || !pc.current) {
// //         setLoading(false);
// //         setIsBroadcaster(false);
// //         return;
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      
// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo
// //       });
      
// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);
    
// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);
    
// //     try {
// //       await ensurePeerConnection();
      
// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //     } catch (error) {
// //       console.error("Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream");
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({ 
// //         type: "end-stream", 
// //         streamId 
// //       });
// //     }
    
// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) { 
// //       console.warn("[endStream] error closing ws", e); 
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;
    
// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";
    
// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };
    
// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });
    
// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
    
// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   // Refresh available streams periodically
// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, 3000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <TouchableOpacity 
// //             style={[styles.startStreamButton, loading && styles.disabledButton]} 
// //             onPress={startStream}
// //             disabled={loading}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>
          
// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>
          
// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity 
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading}
// //                 >
// //                   <Image 
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>Connecting to server...</Text>
// //               )}
// //               {wsConnected && listStreamRetries >= 5 && (
// //                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //                 defaultSource={defaultImage}
// //               />
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>
          
// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //             />
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         {/* Comments section */}
// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {/* Stream controls for broadcaster */}
// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Comment input for viewers */}
// //         {viewerMode && (
// //           <KeyboardAvoidingView 
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     overflow: 'hidden',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 132,
// //     marginTop: 2,
// //   },
// // });

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "wss://showa.essential.com.ng"; // Changed to wss://
// // const MAX_VIEWERS = 10;
// // const MAX_RECONNECT_ATTEMPTS = 5;
// // const INITIAL_RECONNECT_DELAY = 3000;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);
// //   const [listStreamRetries, setListStreamRetries] = useState(0);
// //   const [reconnectAttempts, setReconnectAttempts] = useState(0);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = () => {
// //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// //     };

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate, streamId });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       console.log("[WebRTC] Track received:", evt.track?.kind);
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           setRemoteURL(remoteStream.current.toURL());
// //         } catch (e) {
// //           console.error("Error setting remote URL:", e);
// //         }
// //       }
// //     };

// //     pc.current.onconnectionstatechange = () => {
// //       if (!pc.current) {
// //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// //         return;
// //       }
// //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// //       if (pc.current.connectionState === "failed") {
// //         console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
// //       }
// //     };

// //     pc.current.oniceconnectionstatechange = () => {
// //       if (!pc.current) return;
// //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }

// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;

// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     isCleaningUpRef.current = true;

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] pc close error", e);
// //     }
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] localStream stop error", e);
// //     }
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setIsMuted(false);
// //     setIsLive(false);
// //     setViewers(0);
// //     setComments([]);
// //     setLikes(0);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type, "Payload:", msg);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     // For live streams, use a dedicated room
// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
// //     console.log("[WS] Connecting to:", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);

// //       // Request list of available streams
// //       sendMessage({ type: "list-streams" });

// //       // Clear any reconnect timeout
// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           // Handle list-streams response, expecting a streams array
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
// //             // Retry fetching streams if empty
// //             setTimeout(() => {
// //               sendMessage({ type: "list-streams" });
// //               setListStreamRetries(prev => prev + 1);
// //               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
// //             }, 1000);
// //           }
// //           break;
// //         }
// //         case "stream-started": {
// //           // New stream available
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           } else {
// //             console.warn("[WS] Invalid stream-started data:", data);
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           // Remove ended stream
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           } else {
// //             console.warn("[WS] Invalid stream-ended data:", data);
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           // As a viewer, receive offer from broadcaster
// //           if (isBroadcaster) return;

// //           try {
// //             await ensurePeerConnection();
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates();

// //             const answer = await pc.current.createAnswer();
// //             await pc.current.setLocalDescription(answer);

// //             sendMessage({
// //               type: "answer",
// //               answer,
// //               streamId: data.streamId
// //             });

// //             setStreamId(data.streamId);
// //             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //             if (streamInfo) {
// //               setCurrentStream(streamInfo);
// //               console.log("[WS] Joined stream:", streamInfo);
// //             }
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("Error handling stream offer:", error?.message || error);
// //             Alert.alert("Error", "Failed to join stream");
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           // As a broadcaster, receive answer from viewer
// //           if (!isBroadcaster) return;
// //           if (!pc.current) return;

// //           try {
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates();
// //           } catch (e) {
// //             console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           if (!pc.current) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //             return;
// //           }

// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           setViewers(data.count || 0);
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           setLikes(prev => prev + 1);
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
// //         // Attempt to reconnect with exponential backoff
// //         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
// //           setReconnectAttempts(prev => prev + 1);
// //           connectSignaling();
// //         }, delay);
// //       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
// //         Alert.alert(
// //           "Connection Error",
// //           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
// //         );
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //       setWsConnected(false);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);

// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach();
// //       if (!ok || !pc.current) {
// //         setLoading(false);
// //         setIsBroadcaster(false);
// //         return;
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo
// //       });

// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);

// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);

// //     try {
// //       await ensurePeerConnection();

// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //     } catch (error) {
// //       console.error("Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream");
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({
// //         type: "end-stream",
// //         streamId
// //       });
// //     }

// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[endStream] error closing ws", e);
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;

// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";

// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };

// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });

// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();

// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   // Refresh available streams periodically
// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, 3000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.startStreamButton, loading && styles.disabledButton]}
// //             onPress={startStream}
// //             disabled={loading || !wsConnected}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>

// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading || !wsConnected}
// //                 >
// //                   <Image
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>
// //                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
// //                     ? "Failed to connect to server"
// //                     : "Connecting to server..."}
// //                 </Text>
// //               )}
// //               {wsConnected && listStreamRetries >= 5 && (
// //                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //                 defaultSource={defaultImage}
// //               />
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>

// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //             />
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         {/* Comments section */}
// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {/* Stream controls for broadcaster */}
// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Comment input for viewers */}
// //         {viewerMode && (
// //           <KeyboardAvoidingView
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     overflow: 'hidden',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#4a5568',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12, // Fixed typo (was 132)
// //     marginTop: 2,
// //   },
// // });


// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "wss://showa.essential.com.ng"; // Changed to wss://
// // const MAX_VIEWERS = 10;
// // const MAX_RECONNECT_ATTEMPTS = 5;
// // const INITIAL_RECONNECT_DELAY = 3000;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);
// //   const [listStreamRetries, setListStreamRetries] = useState(0);
// //   const [reconnectAttempts, setReconnectAttempts] = useState(0);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = () => {
// //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// //     };

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate, streamId });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       console.log("[WebRTC] Track received:", evt.track?.kind);
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           setRemoteURL(remoteStream.current.toURL());
// //         } catch (e) {
// //           console.error("Error setting remote URL:", e);
// //         }
// //       }
// //     };

// //     pc.current.onconnectionstatechange = () => {
// //       if (!pc.current) {
// //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// //         return;
// //       }
// //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// //       if (pc.current.connectionState === "failed") {
// //         console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
// //       }
// //     };

// //     pc.current.oniceconnectionstatechange = () => {
// //       if (!pc.current) return;
// //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }

// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;

// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     isCleaningUpRef.current = true;

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] pc close error", e);
// //     }
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] localStream stop error", e);
// //     }
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setIsMuted(false);
// //     setIsLive(false);
// //     setViewers(0);
// //     setComments([]);
// //     setLikes(0);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type, "Payload:", msg);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     // For live streams, use a dedicated room
// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
// //     console.log("[WS] Connecting to:", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);

// //       // Request list of available streams
// //       sendMessage({ type: "list-streams" });

// //       // Clear any reconnect timeout
// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           // Handle list-streams response, expecting a streams array
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
// //             // Retry fetching streams if empty
// //             setTimeout(() => {
// //               sendMessage({ type: "list-streams" });
// //               setListStreamRetries(prev => prev + 1);
// //               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
// //             }, 1000);
// //           }
// //           break;
// //         }
// //         case "stream-started": {
// //           // New stream available
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           } else {
// //             console.warn("[WS] Invalid stream-started data:", data);
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           // Remove ended stream
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           } else {
// //             console.warn("[WS] Invalid stream-ended data:", data);
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           // As a viewer, receive offer from broadcaster
// //           if (isBroadcaster) return;

// //           try {
// //             await ensurePeerConnection();
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates();

// //             const answer = await pc.current.createAnswer();
// //             await pc.current.setLocalDescription(answer);

// //             sendMessage({
// //               type: "answer",
// //               answer,
// //               streamId: data.streamId
// //             });

// //             setStreamId(data.streamId);
// //             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //             if (streamInfo) {
// //               setCurrentStream(streamInfo);
// //               console.log("[WS] Joined stream:", streamInfo);
// //             }
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("Error handling stream offer:", error?.message || error);
// //             Alert.alert("Error", "Failed to join stream");
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           // As a broadcaster, receive answer from viewer
// //           if (!isBroadcaster) return;
// //           if (!pc.current) return;

// //           try {
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates();
// //           } catch (e) {
// //             console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           if (!pc.current) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //             return;
// //           }

// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           setViewers(data.count || 0);
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           setLikes(prev => prev + 1);
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
// //         // Attempt to reconnect with exponential backoff
// //         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
// //           setReconnectAttempts(prev => prev + 1);
// //           connectSignaling();
// //         }, delay);
// //       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
// //         Alert.alert(
// //           "Connection Error",
// //           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
// //         );
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //       setWsConnected(false);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);

// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach();
// //       if (!ok || !pc.current) {
// //         setLoading(false);
// //         setIsBroadcaster(false);
// //         return;
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo
// //       });

// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);

// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);

// //     try {
// //       await ensurePeerConnection();

// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //     } catch (error) {
// //       console.error("Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream");
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({
// //         type: "end-stream",
// //         streamId
// //       });
// //     }

// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[endStream] error closing ws", e);
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;

// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";

// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };

// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });

// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();

// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   // Refresh available streams periodically
// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, 3000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.startStreamButton, loading && styles.disabledButton]}
// //             onPress={startStream}
// //             disabled={loading || !wsConnected}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>

// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading || !wsConnected}
// //                 >
// //                   <Image
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>
// //                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
// //                     ? "Failed to connect to server"
// //                     : "Connecting to server..."}
// //                 </Text>
// //               )}
// //               {wsConnected && listStreamRetries >= 5 && (
// //                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //                 defaultSource={defaultImage}
// //               />
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>

// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //             />
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         {/* Comments section */}
// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {/* Stream controls for broadcaster */}
// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Comment input for viewers */}
// //         {viewerMode && (
// //           <KeyboardAvoidingView
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     overflow: 'hidden',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#4a5568',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12, // Fixed typo (was 132)
// //     marginTop: 2,
// //   },
// // });

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "wss://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // const MAX_RECONNECT_ATTEMPTS = 5;
// // const INITIAL_RECONNECT_DELAY = 3000;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);
// //   const [listStreamRetries, setListStreamRetries] = useState(0);
// //   const [reconnectAttempts, setReconnectAttempts] = useState(0);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = () => {
// //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// //     };

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate, streamId });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       console.log("[WebRTC] Track received:", evt.track?.kind);
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           setRemoteURL(remoteStream.current.toURL());
// //         } catch (e) {
// //           console.error("Error setting remote URL:", e);
// //         }
// //       }
// //     };

// //     pc.current.onconnectionstatechange = () => {
// //       if (!pc.current) {
// //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// //         return;
// //       }
// //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// //       if (pc.current.connectionState === "failed") {
// //         console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
// //       }
// //     };

// //     pc.current.oniceconnectionstatechange = () => {
// //       if (!pc.current) return;
// //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }

// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;

// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     isCleaningUpRef.current = true;

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] pc close error", e);
// //     }
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {
// //       console.warn("[Cleanup] localStream stop error", e);
// //     }
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setIsMuted(false);
// //     setIsLive(false);
// //     setViewers(0);
// //     setComments([]);
// //     setLikes(0);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type, "Payload:", msg);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     // For live streams, use a dedicated room
// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
// //     console.log("[WS] Connecting to:", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);

// //       // Request list of available streams
// //       sendMessage({ type: "list-streams" });

// //       // Clear any reconnect timeout
// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           // Handle list-streams response, expecting a streams array
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
// //             // Retry fetching streams if empty
// //             setTimeout(() => {
// //               sendMessage({ type: "list-streams" });
// //               setListStreamRetries(prev => prev + 1);
// //               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
// //             }, 1000);
// //           }
// //           break;
// //         }
// //         case "stream-started": {
// //           // New stream available
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           } else {
// //             console.warn("[WS] Invalid stream-started data:", data);
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           // Remove ended stream
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           } else {
// //             console.warn("[WS] Invalid stream-ended data:", data);
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           // As a viewer, receive offer from broadcaster
// //           if (isBroadcaster) return;

// //           try {
// //             await ensurePeerConnection();
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates();

// //             const answer = await pc.current.createAnswer();
// //             await pc.current.setLocalDescription(answer);

// //             sendMessage({
// //               type: "answer",
// //               answer,
// //               streamId: data.streamId
// //             });

// //             setStreamId(data.streamId);
// //             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //             if (streamInfo) {
// //               setCurrentStream(streamInfo);
// //               console.log("[WS] Joined stream:", streamInfo);
// //             }
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("Error handling stream offer:", error?.message || error);
// //             Alert.alert("Error", "Failed to join stream");
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           // As a broadcaster, receive answer from viewer
// //           if (!isBroadcaster) return;
// //           if (!pc.current) return;

// //           try {
// //             await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates();
// //           } catch (e) {
// //             console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           if (!pc.current) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //             return;
// //           }

// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           setViewers(data.count || 0);
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           setLikes(prev => prev + 1);
// //           break;
// //         }
// //         case "stream-info": {
// //           // Store the stream info when joining
// //           if (data.stream) {
// //             setCurrentStream(data.stream);
// //             console.log("[WS] Received stream info:", data.stream);
// //           }
// //           break;
// //         }
// //         case "viewer-joined": {
// //           // As a broadcaster, handle new viewer
// //           if (isBroadcaster && data.streamId === streamId) {
// //             setViewers(prev => prev + 1);
// //           }
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
// //         // Attempt to reconnect with exponential backoff
// //         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
// //           setReconnectAttempts(prev => prev + 1);
// //           connectSignaling();
// //         }, delay);
// //       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
// //         Alert.alert(
// //           "Connection Error",
// //           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
// //         );
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //       setWsConnected(false);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);

// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach();
// //       if (!ok || !pc.current) {
// //         setLoading(false);
// //         setIsBroadcaster(false);
// //         return;
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

// //       // Generate unique stream ID
// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "start-stream",
// //         offer,
// //         streamId: newStreamId,
// //         streamInfo
// //       });

// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] createOffer/setLocalDescription failed:", e?.message || e);
// //       Alert.alert("Error", "Failed to start live stream");
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);

// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);

// //     try {
// //       await ensurePeerConnection();

// //       // First request stream info
// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
      
// //       // Wait a moment for stream info, then create offer
// //       setTimeout(() => {
// //         if (pc.current) {
// //           pc.current.createOffer().then(offer => {
// //             return pc.current.setLocalDescription(offer);
// //           }).then(() => {
// //             sendMessage({
// //               type: "offer",
// //               offer: pc.current.localDescription,
// //               streamId: streamIdToJoin
// //             });
// //           }).catch(error => {
// //             console.error("Error creating offer:", error);
// //             Alert.alert("Error", "Failed to join stream");
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //             setLoading(false);
// //           });
// //         }
// //       }, 500);
// //     } catch (error) {
// //       console.error("Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream");
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({
// //         type: "end-stream",
// //         streamId
// //       });
// //     }

// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[endStream] error closing ws", e);
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;

// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";

// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };

// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });

// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();

// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   // Refresh available streams periodically
// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, 3000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   if (!isLive && !viewerMode) {
// //     // Show stream selection/creation screen
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.startStreamButton, loading && styles.disabledButton]}
// //             onPress={startStream}
// //             disabled={loading || !wsConnected}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>

// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading || !wsConnected}
// //                 >
// //                   <Image
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>
// //                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
// //                     ? "Failed to connect to server"
// //                     : "Connecting to server..."}
// //                 </Text>
// //               )}
// //               {wsConnected && listStreamRetries >= 5 && (
// //                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //                 defaultSource={defaultImage}
// //               />
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Stream info overlay */}
// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>

// //           <View style={styles.broadcasterInfo}>
// //             {/* <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //             /> */}
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         {/* Comments section */}
// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {/* Stream controls for broadcaster */}
// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Comment input for viewers */}
// //         {viewerMode && (
// //           <KeyboardAvoidingView
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     overflow: 'hidden',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#4a5568',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12,
// //     marginTop: 2,
// //   },
// // });


// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "wss://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // const MAX_RECONNECT_ATTEMPTS = 5;
// // const INITIAL_RECONNECT_DELAY = 3000;
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   /// --- refs/state
// //   const ws = useRef(null);
// //   const peerConnections = useRef({});
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef({});
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);
// //   const [listStreamRetries, setListStreamRetries] = useState(0);
// //   const [reconnectAttempts, setReconnectAttempts] = useState(0);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         const granted = (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //         console.log("[Permissions] Camera and audio:", granted ? "granted" : "denied");
// //         return granted;
// //       } catch (err) {
// //         console.warn("[Permissions] Error:", err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const createPeerConnection = async (targetId) => {
// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     const pc = new RTCPeerConnection(rtcConfig);
// //     console.log(`[WebRTC] Created RTCPeerConnection for ${targetId}`);

// //     pc.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({
// //           type: "candidate",
// //           candidate: evt.candidate,
// //           streamId,
// //           viewer_channel: isBroadcaster ? targetId : undefined
// //         });
// //         console.log(`[WebRTC] Sent ICE candidate for ${targetId}`);
// //       }
// //     };

// //     pc.ontrack = (evt) => {
// //       console.log(`[WebRTC] Track received for ${targetId}: ${evt.track.kind}, enabled: ${evt.track.enabled}`);
// //       if (!isBroadcaster && evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           const url = remoteStream.current.toURL();
// //           setRemoteURL(url);
// //           console.log(`[WebRTC] Set remoteURL for ${targetId}: ${url}`);
// //         } catch (e) {
// //           console.error(`[WebRTC] Error setting remoteURL for ${targetId}:`, e);
// //         }
// //       }
// //     };

// //     pc.onconnectionstatechange = () => {
// //       console.log(`[WebRTC] ${targetId} connectionState: ${pc.connectionState}`);
// //       if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
// //         console.warn(`[WebRTC] Connection failed for ${targetId}`);
// //         if (!isBroadcaster) {
// //           Alert.alert("Connection Failed", "Failed to connect to the stream. Please try again.");
// //           endStream();
// //         } else {
// //           cleanupPeerConnection(targetId);
// //         }
// //       }
// //     };

// //     pc.oniceconnectionstatechange = () => {
// //       console.log(`[WebRTC] ${targetId} iceConnectionState: ${pc.iceConnectionState}`);
// //     };

// //     // Attach local stream for broadcaster
// //     if (isBroadcaster && localStream.current) {
// //       localStream.current.getTracks().forEach((track) => {
// //         pc.addTrack(track, localStream.current);
// //         console.log(`[WebRTC] Added ${track.kind} track to ${targetId}, enabled: ${track.enabled}`);
// //       });
// //     }

// //     peerConnections.current[targetId] = pc;
// //     queuedRemoteCandidates.current[targetId] = [];
// //     return pc;
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission Denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         console.log("[WebRTC] Local stream acquired:", s.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           console.warn("[WebRTC] toURL not available for local stream");
// //         }
// //       } catch (e) {
// //         console.error("[WebRTC] Failed to get local stream:", e);
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (isBroadcaster) {
// //       Object.values(peerConnections.current).forEach((pc) => {
// //         const existingTracks = pc.getSenders().map((s) => s.track);
// //         localStream.current.getTracks().forEach((track) => {
// //           if (!existingTracks.includes(track)) {
// //             pc.addTrack(track, localStream.current);
// //             console.log(`[WebRTC] Attached ${track.kind} track to peer connection`);
// //           }
// //         });
// //       });
// //     }

// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //         console.log(`[WebRTC] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;

// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //       console.log(`[WebRTC] Switched camera to ${isCameraFront ? 'back' : 'front'}`);
// //     }
// //   };

// //   const drainQueuedCandidates = async (targetId) => {
// //     const pc = peerConnections.current[targetId];
// //     if (!pc) {
// //       console.warn(`[WebRTC] No peer connection for ${targetId} to drain candidates`);
// //       return;
// //     }

// //     while (queuedRemoteCandidates.current[targetId]?.length > 0) {
// //       const c = queuedRemoteCandidates.current[targetId].shift();
// //       try {
// //         await pc.addIceCandidate(new RTCIceCandidate(c));
// //         console.log(`[WebRTC] Added queued ICE candidate for ${targetId}`);
// //       } catch (err) {
// //         console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = (targetId) => {
// //     if (targetId && peerConnections.current[targetId]) {
// //       console.log(`[Cleanup] Closing peer connection for ${targetId}`);
// //       try {
// //         const pc = peerConnections.current[targetId];
// //         pc.onicecandidate = null;
// //         pc.ontrack = null;
// //         pc.onconnectionstatechange = null;
// //         pc.oniceconnectionstatechange = null;
// //         pc.close();
// //         delete peerConnections.current[targetId];
// //         delete queuedRemoteCandidates.current[targetId];
// //       } catch (e) {
// //         console.warn(`[Cleanup] Error closing pc for ${targetId}:`, e);
// //       }
// //     } else if (!targetId) {
// //       console.log("[Cleanup] Closing all peer connections and streams");
// //       isCleaningUpRef.current = true;

// //       Object.keys(peerConnections.current).forEach((key) => {
// //         const pc = peerConnections.current[key];
// //         pc.onicecandidate = null;
// //         pc.ontrack = null;
// //         pc.onconnectionstatechange = null;
// //         pc.oniceconnectionstatechange = null;
// //         pc.close();
// //       });
// //       peerConnections.current = {};
// //       queuedRemoteCandidates.current = {};

// //       try {
// //         if (localStream.current) {
// //           localStream.current.getTracks().forEach((t) => t.stop());
// //         }
// //       } catch (e) {
// //         console.warn("[Cleanup] localStream stop error:", e);
// //       }
// //       localStream.current = null;
// //       remoteStream.current = null;

// //       setLocalURL(null);
// //       setRemoteURL(null);
// //       setIsMuted(false);
// //       setIsLive(false);
// //       setViewers(0);
// //       setComments([]);
// //       setLikes(0);
// //       setCurrentStream(null);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);
// //       isCleaningUpRef.current = false;
// //     }
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type, "Payload:", msg);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       console.log("[WS] WebSocket already connected");
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
// //     console.log("[WS] Connecting to:", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);

// //       sendMessage({ type: "list-streams" });

// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
// //             setTimeout(() => {
// //               sendMessage({ type: "list-streams" });
// //               setListStreamRetries(prev => prev + 1);
// //               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
// //             }, 1000);
// //           }
// //           break;
// //         }
// //         case "stream-started": {
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           } else {
// //             console.warn("[WS] Invalid stream-started data:", data);
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           } else {
// //             console.warn("[WS] Invalid stream-ended data:", data);
// //           }
// //           break;
// //         }
// //         case "join-stream": {
// //           if (!isBroadcaster) {
// //             console.warn("[WS] Ignoring join-stream: Not broadcaster");
// //             return;
// //           }
// //           if (Object.keys(peerConnections.current).length >= MAX_VIEWERS) {
// //             console.warn("[WS] Max viewers reached, rejecting join-stream");
// //             sendMessage({
// //               type: "error",
// //               message: "Maximum viewers reached",
// //               streamId: data.streamId,
// //               viewer_channel: data.viewer_channel
// //             });
// //             return;
// //           }
// //           if (data.streamId !== streamId) {
// //             console.warn(`[WS] Ignoring join-stream: Stream ID mismatch (received: ${data.streamId}, expected: ${streamId})`);
// //             return;
// //           }
// //           const viewerId = data.viewer_channel;
// //           console.log(`[WS] Processing join-stream for viewer ${viewerId}, stream ${data.streamId}`);
// //           try {
// //             if (!localStream.current) {
// //               console.error("[WebRTC] No local stream available for broadcaster");
// //               sendMessage({
// //                 type: "error",
// //                 message: "Broadcaster stream not available",
// //                 streamId: data.streamId,
// //                 viewer_channel: viewerId
// //               });
// //               return;
// //             }
// //             const pc = await createPeerConnection(viewerId);
// //             const offer = await pc.createOffer();
// //             await pc.setLocalDescription(offer);
// //             sendMessage({
// //               type: "offer",
// //               offer,
// //               streamId: data.streamId,
// //               viewer_channel: viewerId
// //             });
// //             console.log(`[WS] Sent offer to viewer ${viewerId} for stream ${data.streamId}`);
// //           } catch (error) {
// //             console.error(`[WebRTC] Failed to create offer for viewer ${viewerId}:`, error);
// //             cleanupPeerConnection(viewerId);
// //             sendMessage({
// //               type: "error",
// //               message: `Failed to start stream connection: ${error.message}`,
// //               streamId: data.streamId,
// //               viewer_channel: viewerId
// //             });
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           if (isBroadcaster) {
// //             console.warn("[WS] Ignoring offer: Broadcaster should not receive offers");
// //             return;
// //           }
// //           try {
// //             const pc = await createPeerConnection(data.streamId);
// //             console.log(`[WebRTC] Setting remote offer for ${data.streamId}`);
// //             await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates(data.streamId);

// //             const answer = await pc.createAnswer();
// //             await pc.setLocalDescription(answer);

// //             sendMessage({
// //               type: "answer",
// //               answer,
// //               streamId: data.streamId
// //             });
// //             console.log(`[WS] Sent answer for stream ${data.streamId}`);

// //             setStreamId(data.streamId);
// //             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //             if (streamInfo) {
// //               setCurrentStream(streamInfo);
// //               console.log("[WS] Joined stream:", streamInfo);
// //             }
// //             setViewerMode(true);
// //           } catch (error) {
// //             console.error("[WebRTC] Error handling stream offer:", error);
// //             Alert.alert("Error", "Failed to join stream: " + error.message);
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //             cleanupPeerConnection(data.streamId);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           if (!isBroadcaster) {
// //             console.warn("[WS] Ignoring answer: Not broadcaster");
// //             return;
// //           }
// //           const viewerId = data.streamId;
// //           const pc = peerConnections.current[viewerId];
// //           if (!pc) {
// //             console.warn(`[WebRTC] No peer connection for viewer ${viewerId}`);
// //             return;
// //           }
// //           try {
// //             await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates(viewerId);
// //             console.log(`[WebRTC] Set answer for viewer ${viewerId}`);
// //           } catch (e) {
// //             console.error(`[WebRTC] setRemoteDescription(answer) failed for viewer ${viewerId}:`, e);
// //             cleanupPeerConnection(viewerId);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           const targetId = isBroadcaster ? data.streamId : data.streamId;
// //           if (!peerConnections.current[targetId]) {
// //             queuedRemoteCandidates.current[targetId] = queuedRemoteCandidates.current[targetId] || [];
// //             queuedRemoteCandidates.current[targetId].push(data.candidate);
// //             console.log(`[WebRTC] Queued ICE candidate for ${targetId}`);
// //             return;
// //           }
// //           if (!peerConnections.current[targetId].remoteDescription) {
// //             queuedRemoteCandidates.current[targetId].push(data.candidate);
// //             console.log(`[WebRTC] Queued ICE candidate for ${targetId} (no remote description)`);
// //           } else {
// //             try {
// //               await peerConnections.current[targetId].addIceCandidate(new RTCIceCandidate(data.candidate));
// //               console.log(`[WebRTC] Added ICE candidate for ${isBroadcaster ? 'viewer' : 'broadcaster'} ${targetId}`);
// //             } catch (e) {
// //               console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           if (data.streamId === streamId) {
// //             setViewers(data.count || 0);
// //             console.log(`[WS] Updated viewer count for stream ${data.streamId}: ${data.count}`);
// //           }
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.streamId === streamId && data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //             console.log(`[WS] New comment for stream ${data.streamId}:`, data.comment);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           if (data.streamId === streamId) {
// //             setLikes(prev => prev + 1);
// //             console.log(`[WS] New like for stream ${data.streamId}`);
// //           }
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           console.error("[WS] Server error:", data.message);
// //           if (viewerMode) {
// //             endStream();
// //           }
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
// //         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
// //           setReconnectAttempts(prev => prev + 1);
// //           connectSignaling();
// //         }, delay);
// //       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
// //         Alert.alert(
// //           "Connection Error",
// //           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
// //         );
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //       setWsConnected(false);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);

// //     try {
// //       const success = await ensureLocalStreamAndAttach();
// //       if (!success) {
// //         throw new Error("Failed to acquire local stream");
// //       }
// //       if (!localStream.current.getVideoTracks().length) {
// //         throw new Error("No video track in local stream");
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       sendMessage({
// //         type: "start-stream",
// //         streamId: newStreamId,
// //         streamInfo
// //       });

// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] Failed to start stream:", e);
// //       Alert.alert("Error", "Failed to start live stream: " + e.message);
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //       cleanupPeerConnection();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);

// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);

// //     try {
// //       await createPeerConnection(streamIdToJoin);
// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //       console.log(`[WS] Sent join-stream for ${streamIdToJoin}`);
// //     } catch (error) {
// //       console.error("[WebRTC] Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream: " + error.message);
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //       cleanupPeerConnection(streamIdToJoin);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({
// //         type: "end-stream",
// //         streamId
// //       });
// //     }

// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[endStream] Error closing ws:", e);
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;

// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";

// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };

// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });

// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();

// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, 3000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   // Debug button to log stream details
// //   const debugStreams = () => {
// //     console.log("[Debug] localStream tracks:", localStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //     console.log("[Debug] remoteStream tracks:", remoteStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //     console.log("[Debug] peerConnections:", Object.keys(peerConnections.current));
// //     console.log("[Debug] isBroadcaster:", isBroadcaster, "viewerMode:", viewerMode, "streamId:", streamId);
// //   };

// //   if (!isLive && !viewerMode) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.startStreamButton, loading && styles.disabledButton]}
// //             onPress={startStream}
// //             disabled={loading || !wsConnected}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
// //             <Text style={styles.debugButtonText}>Debug Streams</Text>
// //           </TouchableOpacity>

// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.streamItem}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading || !wsConnected}
// //                 >
// //                   <Image
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>
// //                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
// //                     ? "Failed to connect to server"
// //                     : "Connecting to server..."}
// //                 </Text>
// //               )}
// //               {wsConnected && listStreamRetries >= 5 && (
// //                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
// //               )}
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               {/* <Image
// //                 source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //                 defaultSource={defaultImage}
// //               /> */}
// //             </View>
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>

// //           <View style={styles.broadcasterInfo}>
// //             {/* <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //             /> */}
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={debugStreams}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="bug-report" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {viewerMode && (
// //           <KeyboardAvoidingView
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
// //               <Icon name="bug-report" size={20} color="white" />
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   debugButton: {
// //     padding: 10,
// //     backgroundColor: '#4a5568',
// //     borderRadius: 10,
// //     margin: 10,
// //   },
// //   debugButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatar: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     overflow: 'hidden',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#4a5568',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12,
// //     marginTop: 2,
// //   },
// // });

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // const MAX_RECONNECT_ATTEMPTS = 5;
// // const INITIAL_RECONNECT_DELAY = 3000;
// // const STREAM_POLL_INTERVAL = 10000; // Reduced polling frequency
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   // --- refs/state
// //   const ws = useRef(null);
// //   const peerConnections = useRef({});
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef({});
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);
// //   const [listStreamRetries, setListStreamRetries] = useState(0);
// //   const [reconnectAttempts, setReconnectAttempts] = useState(0);

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         const granted = (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //         console.log("[Permissions] Camera and audio:", granted ? "granted" : "denied");
// //         return granted;
// //       } catch (err) {
// //         console.warn("[Permissions] Error:", err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   const createPeerConnection = async (targetId) => {
// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     const pc = new RTCPeerConnection(rtcConfig);
// //     console.log(`[WebRTC] Created RTCPeerConnection for ${targetId}`);

// //     pc.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({
// //           type: "candidate",
// //           candidate: evt.candidate,
// //           streamId,
// //           viewer_channel: isBroadcaster ? targetId : undefined
// //         });
// //         console.log(`[WebRTC] Sent ICE candidate for ${targetId}`);
// //       }
// //     };

// //     pc.ontrack = (evt) => {
// //       console.log(`[WebRTC] Track received for ${targetId}: ${evt.track.kind}, enabled: ${evt.track.enabled}`);
// //       if (!isBroadcaster && evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           const url = remoteStream.current.toURL();
// //           setRemoteURL(url);
// //           console.log(`[WebRTC] Set remoteURL for ${targetId}: ${url}`);
// //         } catch (e) {
// //           console.error(`[WebRTC] Error setting remoteURL for ${targetId}:`, e);
// //         }
// //       }
// //     };

// //     pc.onconnectionstatechange = () => {
// //       console.log(`[WebRTC] ${targetId} connectionState: ${pc.connectionState}`);
// //       if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
// //         console.warn(`[WebRTC] Connection failed for ${targetId}`);
// //         Alert.alert("Connection Failed", "Failed to connect to the stream. Please try again.");
// //         endStream();
// //       }
// //     };

// //     pc.oniceconnectionstatechange = () => {
// //       console.log(`[WebRTC] ${targetId} iceConnectionState: ${pc.iceConnectionState}`);
// //     };

// //     if (isBroadcaster && localStream.current) {
// //       localStream.current.getTracks().forEach((track) => {
// //         pc.addTrack(track, localStream.current);
// //         console.log(`[WebRTC] Added ${track.kind} track to ${targetId}, enabled: ${track.enabled}`);
// //       });
// //     }

// //     peerConnections.current[targetId] = pc;
// //     queuedRemoteCandidates.current[targetId] = [];
// //     return pc;
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission Denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { facingMode: isCameraFront ? "user" : "environment" }
// //         });
// //         localStream.current = s;
// //         console.log("[WebRTC] Local stream acquired:", s.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           console.warn("[WebRTC] toURL not available for local stream");
// //         }
// //       } catch (e) {
// //         console.error("[WebRTC] Failed to get local stream:", e);
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     if (isBroadcaster) {
// //       Object.values(peerConnections.current).forEach((pc) => {
// //         const existingTracks = pc.getSenders().map((s) => s.track);
// //         localStream.current.getTracks().forEach((track) => {
// //           if (!existingTracks.includes(track)) {
// //             pc.addTrack(track, localStream.current);
// //             console.log(`[WebRTC] Attached ${track.kind} track to peer connection`);
// //           }
// //         });
// //       });
// //     }

// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //         console.log(`[WebRTC] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;

// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //       console.log(`[WebRTC] Switched camera to ${isCameraFront ? 'back' : 'front'}`);
// //     }
// //   };

// //   const drainQueuedCandidates = async (targetId) => {
// //     const pc = peerConnections.current[targetId];
// //     if (!pc) {
// //       console.warn(`[WebRTC] No peer connection for ${targetId} to drain candidates`);
// //       return;
// //     }

// //     while (queuedRemoteCandidates.current[targetId]?.length > 0) {
// //       const c = queuedRemoteCandidates.current[targetId].shift();
// //       try {
// //         await pc.addIceCandidate(new RTCIceCandidate(c));
// //         console.log(`[WebRTC] Added queued ICE candidate for ${targetId}`);
// //       } catch (err) {
// //         console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = (targetId) => {
// //     if (targetId && peerConnections.current[targetId]) {
// //       console.log(`[Cleanup] Closing peer connection for ${targetId}`);
// //       try {
// //         const pc = peerConnections.current[targetId];
// //         pc.onicecandidate = null;
// //         pc.ontrack = null;
// //         pc.onconnectionstatechange = null;
// //         pc.oniceconnectionstatechange = null;
// //         pc.close();
// //         delete peerConnections.current[targetId];
// //         delete queuedRemoteCandidates.current[targetId];
// //       } catch (e) {
// //         console.warn(`[Cleanup] Error closing pc for ${targetId}:`, e);
// //       }
// //     } else if (!targetId) {
// //       console.log("[Cleanup] Closing all peer connections and streams");
// //       isCleaningUpRef.current = true;

// //       Object.keys(peerConnections.current).forEach((key) => {
// //         const pc = peerConnections.current[key];
// //         pc.onicecandidate = null;
// //         pc.ontrack = null;
// //         pc.onconnectionstatechange = null;
// //         pc.oniceconnectionstatechange = null;
// //         pc.close();
// //       });
// //       peerConnections.current = {};
// //       queuedRemoteCandidates.current = {};

// //       try {
// //         if (localStream.current) {
// //           localStream.current.getTracks().forEach((t) => t.stop());
// //         }
// //       } catch (e) {
// //         console.warn("[Cleanup] localStream stop error:", e);
// //       }
// //       localStream.current = null;
// //       remoteStream.current = null;

// //       setLocalURL(null);
// //       setRemoteURL(null);
// //       setIsMuted(false);
// //       setIsLive(false);
// //       setViewers(0);
// //       setComments([]);
// //       setLikes(0);
// //       setCurrentStream(null);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);
// //       isCleaningUpRef.current = false;
// //     }
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type, "Payload:", msg);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       console.log("[WS] WebSocket already connected");
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
// //     console.log("[WS] Connecting to:", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);

// //       sendMessage({ type: "list-streams" });

// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
// //             setTimeout(() => {
// //               sendMessage({ type: "list-streams" });
// //               setListStreamRetries(prev => prev + 1);
// //               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
// //             }, 1000);
// //           }
// //           break;
// //         }
// //         case "stream-started": {
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           }
// //           break;
// //         }
// //         case "join-stream": {
// //           if (!isBroadcaster) {
// //             console.warn("[WS] Ignoring join-stream: Not broadcaster");
// //             return;
// //           }
// //           if (Object.keys(peerConnections.current).length >= MAX_VIEWERS) {
// //             console.warn("[WS] Max viewers reached, rejecting join-stream");
// //             sendMessage({
// //               type: "error",
// //               message: "Maximum viewers reached",
// //               streamId: data.streamId,
// //               viewer_channel: data.viewer_channel
// //             });
// //             return;
// //           }
// //           if (data.streamId !== streamId) {
// //             console.warn(`[WS] Ignoring join-stream: Stream ID mismatch (received: ${data.streamId}, expected: ${streamId})`);
// //             return;
// //           }
// //           const viewerId = data.viewer_channel;
// //           console.log(`[WS] Processing join-stream for viewer ${viewerId}, stream ${data.streamId}`);
// //           try {
// //             if (!localStream.current) {
// //               console.error("[WebRTC] No local stream available for broadcaster");
// //               sendMessage({
// //                 type: "error",
// //                 message: "Broadcaster stream not available",
// //                 streamId: data.streamId,
// //                 viewer_channel: viewerId
// //               });
// //               return;
// //             }
// //             const pc = await createPeerConnection(viewerId);
// //             const offer = await pc.createOffer();
// //             await pc.setLocalDescription(offer);
// //             sendMessage({
// //               type: "offer",
// //               offer,
// //               streamId: data.streamId,
// //               viewer_channel: viewerId
// //             });
// //             console.log(`[WS] Sent offer to viewer ${viewerId} for stream ${data.streamId}`);
// //           } catch (error) {
// //             console.error(`[WebRTC] Failed to create offer for viewer ${viewerId}:`, error);
// //             cleanupPeerConnection(viewerId);
// //             sendMessage({
// //               type: "error",
// //               message: `Failed to start stream connection: ${error.message}`,
// //               streamId: data.streamId,
// //               viewer_channel: viewerId
// //             });
// //           }
// //           break;
// //         }
// //         case "offer": {
// //           if (isBroadcaster) {
// //             console.warn("[WS] Ignoring offer: Broadcaster should not receive offers");
// //             return;
// //           }
// //           try {
// //             const pc = await createPeerConnection(data.streamId);
// //             console.log(`[WebRTC] Setting remote offer for ${data.streamId}`);
// //             await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidates(data.streamId);

// //             const answer = await pc.createAnswer();
// //             await pc.setLocalDescription(answer);

// //             sendMessage({
// //               type: "answer",
// //               answer,
// //               streamId: data.streamId
// //             });
// //             console.log(`[WS] Sent answer for stream ${data.streamId}`);

// //             setStreamId(data.streamId);
// //             const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //             if (streamInfo) {
// //               setCurrentStream(streamInfo);
// //               console.log("[WS] Joined stream:", streamInfo);
// //             }
// //             setViewerMode(true);
// //             setLoading(false); // Ensure loading is cleared after joining
// //           } catch (error) {
// //             console.error("[WebRTC] Error handling stream offer:", error);
// //             Alert.alert("Error", "Failed to join stream: " + error.message);
// //             setViewerMode(false);
// //             setCurrentStream(null);
// //             setLoading(false);
// //             cleanupPeerConnection(data.streamId);
// //           }
// //           break;
// //         }
// //         case "answer": {
// //           if (!isBroadcaster) {
// //             console.warn("[WS] Ignoring answer: Not broadcaster");
// //             return;
// //           }
// //           const viewerId = data.streamId;
// //           const pc = peerConnections.current[viewerId];
// //           if (!pc) {
// //             console.warn(`[WebRTC] No peer connection for viewer ${viewerId}`);
// //             return;
// //           }
// //           try {
// //             await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates(viewerId);
// //             console.log(`[WebRTC] Set answer for viewer ${viewerId}`);
// //           } catch (e) {
// //             console.error(`[WebRTC] setRemoteDescription(answer) failed for viewer ${viewerId}:`, e);
// //             cleanupPeerConnection(viewerId);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           const targetId = isBroadcaster ? data.streamId : data.streamId;
// //           if (!peerConnections.current[targetId]) {
// //             queuedRemoteCandidates.current[targetId] = queuedRemoteCandidates.current[targetId] || [];
// //             queuedRemoteCandidates.current[targetId].push(data.candidate);
// //             console.log(`[WebRTC] Queued ICE candidate for ${targetId}`);
// //             return;
// //           }
// //           if (!peerConnections.current[targetId].remoteDescription) {
// //             queuedRemoteCandidates.current[targetId].push(data.candidate);
// //             console.log(`[WebRTC] Queued ICE candidate for ${targetId} (no remote description)`);
// //           } else {
// //             try {
// //               await peerConnections.current[targetId].addIceCandidate(new RTCIceCandidate(data.candidate));
// //               console.log(`[WebRTC] Added ICE candidate for ${isBroadcaster ? 'viewer' : 'broadcaster'} ${targetId}`);
// //             } catch (e) {
// //               console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           if (data.streamId === streamId) {
// //             setViewers(data.count || 0);
// //             console.log(`[WS] Updated viewer count for stream ${data.streamId}: ${data.count}`);
// //           }
// //           setAvailableStreams(prev =>
// //             prev.map(s => s.id === data.streamId ? { ...s, viewers: data.count || 0 } : s)
// //           );
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.streamId === streamId && data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //             console.log(`[WS] New comment for stream ${data.streamId}:`, data.comment);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           if (data.streamId === streamId) {
// //             setLikes(prev => prev + 1);
// //             console.log(`[WS] New like for stream ${data.streamId}`);
// //           }
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           console.error("[WS] Server error:", data.message);
// //           if (viewerMode) {
// //             endStream();
// //           }
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
// //         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
// //           setReconnectAttempts(prev => prev + 1);
// //           connectSignaling();
// //         }, delay);
// //       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
// //         Alert.alert(
// //           "Connection Error",
// //           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
// //         );
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //       setWsConnected(false);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);

// //     try {
// //       const success = await ensureLocalStreamAndAttach();
// //       if (!success) {
// //         throw new Error("Failed to acquire local stream");
// //       }
// //       if (!localStream.current.getVideoTracks().length) {
// //         throw new Error("No video track in local stream");
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       sendMessage({
// //         type: "start-stream",
// //         streamId: newStreamId,
// //         streamInfo
// //       });

// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] Failed to start stream:", e);
// //       Alert.alert("Error", "Failed to start live stream: " + e.message);
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //       cleanupPeerConnection();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);

// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);

// //     try {
// //       await createPeerConnection(streamIdToJoin);
// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //       console.log(`[WS] Sent join-stream for ${streamIdToJoin}`);
// //     } catch (error) {
// //       console.error("[WebRTC] Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream: " + error.message);
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //       cleanupPeerConnection(streamIdToJoin);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({
// //         type: "end-stream",
// //         streamId
// //       });
// //     }

// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[endStream] Error closing ws:", e);
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;

// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";

// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };

// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });

// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();

// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, STREAM_POLL_INTERVAL);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   const debugStreams = () => {
// //     console.log("[Debug] localStream tracks:", localStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //     console.log("[Debug] remoteStream tracks:", remoteStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //     console.log("[Debug] peerConnections:", Object.keys(peerConnections.current));
// //     console.log("[Debug] isBroadcaster:", isBroadcaster, "viewerMode:", viewerMode, "streamId:", streamId);
// //   };

// //   if (!isLive && !viewerMode) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.startStreamButton, loading && styles.disabledButton]}
// //             onPress={startStream}
// //             disabled={loading || !wsConnected}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
// //             <Text style={styles.debugButtonText}>Debug Streams</Text>
// //           </TouchableOpacity>

// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={[styles.streamItem, loading && styles.disabledButton]}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading || !wsConnected}
// //                 >
// //                   <Image
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>
// //                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
// //                     ? "Failed to connect to server"
// //                     : "Connecting to server..."}
// //                 </Text>
// //               )}
// //               {wsConnected && listStreamRetries >= 5 && (
// //                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
// //               )}
// //               <TouchableOpacity
// //                 style={styles.retryButton}
// //                 onPress={() => sendMessage({ type: "list-streams" })}
// //                 disabled={loading || !wsConnected}
// //               >
// //                 <Text style={styles.retryButtonText}>Retry</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode && remoteURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.avatarContainer}>
// //             <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.avatarImage}
// //               defaultSource={defaultImage}
// //               onError={(e) => console.log("Avatar image load error:", e.nativeEvent.error)}
// //             />
// //             <Text style={styles.loadingText}>
// //               {viewerMode ? "Connecting to stream..." : "Starting your stream..."}
// //             </Text>
// //           </View>
// //         )}

// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>

// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //               onError={(e) => console.log("Broadcaster avatar load error:", e.nativeEvent.error)}
// //             />
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={debugStreams}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="bug-report" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {viewerMode && (
// //           <KeyboardAvoidingView
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
// //               <Icon name="bug-report" size={20} color="white" />
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   debugButton: {
// //     padding: 10,
// //     backgroundColor: '#4a5568',
// //     borderRadius: 10,
// //     margin: 10,
// //     alignItems: 'center',
// //   },
// //   debugButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   retryButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 10,
// //     borderRadius: 10,
// //     marginTop: 15,
// //   },
// //   retryButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatarImage: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#4a5568',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12,
// //     marginTop: 2,
// //   },

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Image,
// //   ActivityIndicator
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const MAX_VIEWERS = 10;
// // const MAX_RECONNECT_ATTEMPTS = 5;
// // const INITIAL_RECONNECT_DELAY = 3000;
// // const STREAM_POLL_INTERVAL = 10000; // Reduced polling frequency
// // // ============================================

// // export default function LiveStreamScreen({ navigation, route }) {
// //   const { profile_image, name } = route.params || {};

// //   // --- refs/state
// //   const ws = useRef(null);
// //   const peerConnections = useRef({});
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef({});
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [streamDuration, setStreamDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isLive, setIsLive] = useState(false);
// //   const [viewers, setViewers] = useState(0);
// //   const [comments, setComments] = useState([]);
// //   const [likes, setLikes] = useState(0);
// //   const [commentInput, setCommentInput] = useState("");
// //   const [isBroadcaster, setIsBroadcaster] = useState(false);
// //   const [streamId, setStreamId] = useState(null);
// //   const [availableStreams, setAvailableStreams] = useState([]);
// //   const [viewerMode, setViewerMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStream, setCurrentStream] = useState(null);
// //   const [listStreamRetries, setListStreamRetries] = useState(0);
// //   const [reconnectAttempts, setReconnectAttempts] = useState(0);
  

// //   const isCleaningUpRef = useRef(false);
// //   const streamTimerRef = useRef(null);
// //   const reconnectTimeoutRef = useRef(null);

// //   // =============== PERMISSIONS ===============
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         const granted = (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //         console.log("[Permissions] Camera and audio:", granted ? "granted" : "denied");
// //         return granted;
// //       } catch (err) {
// //         console.warn("[Permissions] Error:", err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // =============== ICE SERVERS ===============
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }];
// //       console.log("[Xirsys] ICE servers:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };
// // const createPeerConnection = async (targetId) => {
// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     const pc = new RTCPeerConnection(rtcConfig);
// //     console.log(`[WebRTC] Created RTCPeerConnection for ${targetId}`);

// //     pc.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({
// //           type: "candidate",
// //           candidate: evt.candidate,
// //           streamId,
// //           viewer_channel: isBroadcaster ? targetId : undefined
// //         });
// //         console.log(`[WebRTC] Sent ICE candidate for ${targetId}`);
// //       }
// //     };

// //     // FIXED: Better track handling for remote streams
// //     pc.ontrack = (evt) => {
// //       console.log(`[WebRTC] Track received for ${targetId}: ${evt.track.kind}`);
      
// //       if (!isBroadcaster) {
// //         // Create a new stream if none exists
// //         if (!remoteStream.current) {
// //           remoteStream.current = new MediaStream();
// //         }
        
// //         // Add the track to our remote stream
// //         remoteStream.current.addTrack(evt.track);
        
// //         // Update the URL for RTCView
// //         try {
// //           const url = remoteStream.current.toURL();
// //           setRemoteURL(url);
// //           console.log(`[WebRTC] Set remoteURL: ${url}`);
// //         } catch (e) {
// //           console.error(`[WebRTC] Error setting remoteURL:`, e);
// //         }
// //       }
// //     };

// //     pc.onconnectionstatechange = () => {
// //       console.log(`[WebRTC] ${targetId} connectionState: ${pc.connectionState}`);
// //       if (pc.connectionState === "connected") {
// //         console.log(`[WebRTC] Successfully connected to ${targetId}`);
// //         setLoading(false);
// //       } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
// //         console.warn(`[WebRTC] Connection failed for ${targetId}`);
// //         Alert.alert("Connection Failed", "Failed to connect to the stream. Please try again.");
// //         setLoading(false);
// //         endStream();
// //       }
// //     };

// //     pc.oniceconnectionstatechange = () => {
// //       console.log(`[WebRTC] ${targetId} iceConnectionState: ${pc.iceConnectionState}`);
// //       if (pc.iceConnectionState === "connected") {
// //         console.log(`[WebRTC] ICE connected for ${targetId}`);
// //         setLoading(false);
// //       }
// //     };

// //     // Add local tracks if we're the broadcaster
// //     if (isBroadcaster && localStream.current) {
// //       localStream.current.getTracks().forEach((track) => {
// //         pc.addTrack(track, localStream.current);
// //         console.log(`[WebRTC] Added ${track.kind} track to ${targetId}`);
// //       });
// //     }

// //     peerConnections.current[targetId] = pc;
// //     queuedRemoteCandidates.current[targetId] = [];
// //     return pc;
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission Denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: { 
// //             facingMode: isCameraFront ? "user" : "environment",
// //             width: 1280,
// //             height: 720,
// //             frameRate: 30
// //           }
// //         });
// //         localStream.current = s;
// //         console.log("[WebRTC] Local stream acquired with tracks:", 
// //           s.getTracks().map(t => `${t.kind}: ${t.enabled}`));
        
// //         try {
// //           setLocalURL(s.toURL());
// //         } catch {
// //           console.warn("[WebRTC] toURL not available for local stream");
// //         }
// //       } catch (e) {
// //         console.error("[WebRTC] Failed to get local stream:", e);
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }

// //     // Reattach tracks to all peer connections
// //     if (isBroadcaster) {
// //       Object.values(peerConnections.current).forEach((pc) => {
// //         const existingTracks = pc.getSenders().map((s) => s.track);
// //         localStream.current.getTracks().forEach((track) => {
// //           if (!existingTracks.includes(track)) {
// //             const sender = pc.addTrack(track, localStream.current);
// //             console.log(`[WebRTC] Attached ${track.kind} track to peer connection`);
            
// //             // Handle track ended event
// //             track.onended = () => {
// //               console.log(`[WebRTC] ${track.kind} track ended`);
// //               if (sender) {
// //                 pc.removeTrack(sender);
// //               }
// //             };
// //           }
// //         });
// //       });
// //     }

// //     // Apply mute state
// //     if (isMuted) {
// //       localStream.current.getAudioTracks().forEach((track) => {
// //         track.enabled = false;
// //       });
// //     }
// //     return true;
// //   };

// //   const toggleMute = () => {
// //     if (localStream.current) {
// //       const audioTrack = localStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled;
// //         setIsMuted(!audioTrack.enabled);
// //         console.log(`[WebRTC] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
// //       }
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;

// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //       console.log(`[WebRTC] Switched camera to ${isCameraFront ? 'back' : 'front'}`);
// //     }
// //   };

// //   const drainQueuedCandidates = async (targetId) => {
// //     const pc = peerConnections.current[targetId];
// //     if (!pc) {
// //       console.warn(`[WebRTC] No peer connection for ${targetId} to drain candidates`);
// //       return;
// //     }

// //     while (queuedRemoteCandidates.current[targetId]?.length > 0) {
// //       const c = queuedRemoteCandidates.current[targetId].shift();
// //       try {
// //         await pc.addIceCandidate(new RTCIceCandidate(c));
// //         console.log(`[WebRTC] Added queued ICE candidate for ${targetId}`);
// //       } catch (err) {
// //         console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, err?.message || err);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = (targetId) => {
// //     if (targetId && peerConnections.current[targetId]) {
// //       console.log(`[Cleanup] Closing peer connection for ${targetId}`);
// //       try {
// //         const pc = peerConnections.current[targetId];
// //         pc.onicecandidate = null;
// //         pc.ontrack = null;
// //         pc.onconnectionstatechange = null;
// //         pc.oniceconnectionstatechange = null;
// //         pc.close();
// //         delete peerConnections.current[targetId];
// //         delete queuedRemoteCandidates.current[targetId];
// //       } catch (e) {
// //         console.warn(`[Cleanup] Error closing pc for ${targetId}:`, e);
// //       }
// //     } else if (!targetId) {
// //       console.log("[Cleanup] Closing all peer connections and streams");
// //       isCleaningUpRef.current = true;

// //       Object.keys(peerConnections.current).forEach((key) => {
// //         const pc = peerConnections.current[key];
// //         pc.onicecandidate = null;
// //         pc.ontrack = null;
// //         pc.onconnectionstatechange = null;
// //         pc.oniceconnectionstatechange = null;
// //         pc.close();
// //       });
// //       peerConnections.current = {};
// //       queuedRemoteCandidates.current = {};

// //       try {
// //         if (localStream.current) {
// //           localStream.current.getTracks().forEach((t) => t.stop());
// //         }
// //       } catch (e) {
// //         console.warn("[Cleanup] localStream stop error:", e);
// //       }
// //       localStream.current = null;
// //       remoteStream.current = null;

// //       setLocalURL(null);
// //       setRemoteURL(null);
// //       setIsMuted(false);
// //       setIsLive(false);
// //       setViewers(0);
// //       setComments([]);
// //       setLikes(0);
// //       setCurrentStream(null);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);
// //       isCleaningUpRef.current = false;
// //     }
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //       console.log("[WS] Sent:", msg.type, "Payload:", msg);
// //     } else {
// //       console.warn("[WS] Cannot send message, WebSocket not open. Message:", msg);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       console.log("[WS] WebSocket already connected");
// //       return;
// //     }

// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     const roomId = "live-streams";

// //     if (ws.current) {
// //       try {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       } catch {}
// //       ws.current = null;
// //     }

// //     const url = `${SIGNALING_SERVER}/ws/livestream/${roomId}/?token=${token || ""}`;
// //     console.log("[WS] Connecting to:", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected to live streams room");
// //       setWsConnected(true);
// //       setListStreamRetries(0);
// //       setReconnectAttempts(0);

// //       sendMessage({ type: "list-streams" });

// //       if (reconnectTimeoutRef.current) {
// //         clearTimeout(reconnectTimeoutRef.current);
// //         reconnectTimeoutRef.current = null;
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //         console.log("[WS] Received:", data);
// //       } catch {
// //         console.error("[WS] Failed to parse message:", evt.data);
// //         return;
// //       }

// //       switch (data.type) {
// //         case "list-streams": {
// //           const streams = Array.isArray(data.streams) ? data.streams : [];
// //           setAvailableStreams(streams);
// //           console.log("[WS] Updated available streams:", streams);
// //           if (streams.length === 0 && !isLive && !viewerMode && listStreamRetries < 5) {
// //             setTimeout(() => {
// //               sendMessage({ type: "list-streams" });
// //               setListStreamRetries(prev => prev + 1);
// //               console.log("[WS] Retrying list-streams, attempt:", listStreamRetries + 1);
// //             }, 1000);
// //           }
// //           break;
// //         }
// //         case "stream-started": {
// //           if (data.stream && data.stream.id) {
// //             setAvailableStreams(prev => {
// //               const newStreams = [...prev.filter(s => s.id !== data.stream.id), data.stream];
// //               console.log("[WS] Stream started, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //           }
// //           break;
// //         }
// //         case "stream-ended": {
// //           if (data.streamId) {
// //             setAvailableStreams(prev => {
// //               const newStreams = prev.filter(s => s.id !== data.streamId);
// //               console.log("[WS] Stream ended, updated streams:", newStreams);
// //               return newStreams;
// //             });
// //             if (viewerMode && streamId === data.streamId) {
// //               Alert.alert("Stream Ended", "The live stream has ended");
// //               endStream();
// //             }
// //           }
// //           break;
// //         }
// //         case "join-stream": {
// //           if (!isBroadcaster) {
// //             console.warn("[WS] Ignoring join-stream: Not broadcaster");
// //             return;
// //           }
// //           if (Object.keys(peerConnections.current).length >= MAX_VIEWERS) {
// //             console.warn("[WS] Max viewers reached, rejecting join-stream");
// //             sendMessage({
// //               type: "error",
// //               message: "Maximum viewers reached",
// //               streamId: data.streamId,
// //               viewer_channel: data.viewer_channel
// //             });
// //             return;
// //           }
// //           if (data.streamId !== streamId) {
// //             console.warn(`[WS] Ignoring join-stream: Stream ID mismatch (received: ${data.streamId}, expected: ${streamId})`);
// //             return;
// //           }
// //           const viewerId = data.viewer_channel;
// //           console.log(`[WS] Processing join-stream for viewer ${viewerId}, stream ${data.streamId}`);
// //           try {
// //             if (!localStream.current) {
// //               console.error("[WebRTC] No local stream available for broadcaster");
// //               sendMessage({
// //                 type: "error",
// //                 message: "Broadcaster stream not available",
// //                 streamId: data.streamId,
// //                 viewer_channel: viewerId
// //               });
// //               return;
// //             }
           
// //             const pc = await createPeerConnection(viewerId);
// // const offer = await pc.createOffer();
// // await pc.setLocalDescription(offer);

// // sendMessage({
// //   type: "offer",
// //   offer,
// //   streamId: data.streamId,
// //   viewer_channel: viewerId
// // });

// //             console.log(`[WS] Sent offer to viewer ${viewerId} for stream ${data.streamId}`);
// //           } catch (error) {
// //             console.error(`[WebRTC] Failed to create offer for viewer ${viewerId}:`, error);
// //             cleanupPeerConnection(viewerId);
// //             sendMessage({
// //               type: "error",
// //               message: `Failed to start stream connection: ${error.message}`,
// //               streamId: data.streamId,
// //               viewer_channel: viewerId
// //             });
// //           }
// //           break;
// //         }
        
// //         case "offer": {
// //     if (isBroadcaster) {
// //       console.warn("[WS] Ignoring offer: Broadcaster should not receive offers");
// //       return;
// //     }
    
// //     // Ensure we have a peer connection
// //     if (!peerConnections.current[data.streamId]) {
// //       console.log(`[WebRTC] Creating peer connection for offer from ${data.streamId}`);
// //       await createPeerConnection(data.streamId);
// //     }
    
// //     try {
// //       const pc = peerConnections.current[data.streamId];
// //       console.log(`[WebRTC] Setting remote offer for ${data.streamId}`);
// //       await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
// //       await drainQueuedCandidates(data.streamId);

// //       const answer = await pc.createAnswer();
// //       await pc.setLocalDescription(answer);

// //       sendMessage({
// //         type: "answer",
// //         answer,
// //         streamId: data.streamId
// //       });
// //       console.log(`[WS] Sent answer for stream ${data.streamId}`);

// //       setStreamId(data.streamId);
// //       const streamInfo = availableStreams.find(s => s.id === data.streamId) || data.stream;
// //       if (streamInfo) {
// //         setCurrentStream(streamInfo);
// //         console.log("[WS] Joined stream:", streamInfo);
// //       }
// //       setViewerMode(true);
// //     } catch (error) {
// //       console.error("[WebRTC] Error handling stream offer:", error);
// //       Alert.alert("Error", "Failed to join stream: " + error.message);
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //       cleanupPeerConnection(data.streamId);
// //     }
// //     break;
// //   }
// //         case "answer": {
// //           if (!isBroadcaster) {
// //             console.warn("[WS] Ignoring answer: Not broadcaster");
// //             return;
// //           }
// //           const viewerId = data.streamId;
// //           const pc = peerConnections.current[viewerId];
// //           if (!pc) {
// //             console.warn(`[WebRTC] No peer connection for viewer ${viewerId}`);
// //             return;
// //           }
// //           try {
// //             await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
// //             await drainQueuedCandidates(viewerId);
// //             console.log(`[WebRTC] Set answer for viewer ${viewerId}`);
// //           } catch (e) {
// //             console.error(`[WebRTC] setRemoteDescription(answer) failed for viewer ${viewerId}:`, e);
// //             cleanupPeerConnection(viewerId);
// //           }
// //           break;
// //         }
// //         case "candidate": {
// //           const targetId = isBroadcaster ? data.streamId : data.streamId;
// //           if (!peerConnections.current[targetId]) {
// //             queuedRemoteCandidates.current[targetId] = queuedRemoteCandidates.current[targetId] || [];
// //             queuedRemoteCandidates.current[targetId].push(data.candidate);
// //             console.log(`[WebRTC] Queued ICE candidate for ${targetId}`);
// //             return;
// //           }
// //           if (!peerConnections.current[targetId].remoteDescription) {
// //             queuedRemoteCandidates.current[targetId].push(data.candidate);
// //             console.log(`[WebRTC] Queued ICE candidate for ${targetId} (no remote description)`);
// //           } else {
// //             try {
// //               await peerConnections.current[targetId].addIceCandidate(new RTCIceCandidate(data.candidate));
// //               console.log(`[WebRTC] Added ICE candidate for ${isBroadcaster ? 'viewer' : 'broadcaster'} ${targetId}`);
// //             } catch (e) {
// //               console.warn(`[WebRTC] addIceCandidate error for ${targetId}:`, e?.message || e);
// //             }
// //           }
// //           break;
// //         }
// //         case "viewer-count": {
// //           if (data.streamId === streamId) {
// //             setViewers(data.count || 0);
// //             console.log(`[WS] Updated viewer count for stream ${data.streamId}: ${data.count}`);
// //           }
// //           setAvailableStreams(prev =>
// //             prev.map(s => s.id === data.streamId ? { ...s, viewers: data.count || 0 } : s)
// //           );
// //           break;
// //         }
// //         case "new-comment": {
// //           if (data.streamId === streamId && data.comment) {
// //             setComments(prev => [...prev, data.comment]);
// //             console.log(`[WS] New comment for stream ${data.streamId}:`, data.comment);
// //           }
// //           break;
// //         }
// //         case "new-like": {
// //           if (data.streamId === streamId) {
// //             setLikes(prev => prev + 1);
// //             console.log(`[WS] New like for stream ${data.streamId}`);
// //           }
// //           break;
// //         }
// //         case "error": {
// //           Alert.alert("Error", data.message || "An error occurred");
// //           console.error("[WS] Server error:", data.message);
// //           if (viewerMode) {
// //             endStream();
// //           }
// //           break;
// //         }
// //         default:
// //           console.warn("[WS] Unhandled message type:", data.type);
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WS] Connection closed");
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
// //         const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
// //         reconnectTimeoutRef.current = setTimeout(() => {
// //           console.log("[WS] Attempting to reconnect, attempt:", reconnectAttempts + 1);
// //           setReconnectAttempts(prev => prev + 1);
// //           connectSignaling();
// //         }, delay);
// //       } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
// //         Alert.alert(
// //           "Connection Error",
// //           "Failed to connect to the live stream server after multiple attempts. Please check your network or try again later."
// //         );
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //       setWsConnected(false);
// //     };
// //   };

// //   // ============ STREAM FUNCTIONS ============
// //   const startStream = async () => {
// //     setLoading(true);
// //     setIsBroadcaster(true);

// //     try {
// //       const success = await ensureLocalStreamAndAttach();
// //       if (!success) {
// //         throw new Error("Failed to acquire local stream");
// //       }
// //       if (!localStream.current.getVideoTracks().length) {
// //         throw new Error("No video track in local stream");
// //       }

// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

// //       const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //       setStreamId(newStreamId);

// //       const streamInfo = {
// //         id: newStreamId,
// //         broadcaster: userData.name || name || "User",
// //         title: `${userData.name || name || "User"} is Live!`,
// //         thumbnail: userData.profile_picture || profile_image || "",
// //         viewers: 0,
// //         userId: userData.id || ""
// //       };
// //       setCurrentStream(streamInfo);

// //       sendMessage({
// //         type: "start-stream",
// //         streamId: newStreamId,
// //         streamInfo
// //       });

// //       setIsLive(true);
// //       console.log("[Live] Stream started with ID:", newStreamId, "StreamInfo:", streamInfo);
// //     } catch (e) {
// //       console.error("[Live] Failed to start stream:", e);
// //       Alert.alert("Error", "Failed to start live stream: " + e.message);
// //       setIsBroadcaster(false);
// //       setCurrentStream(null);
// //       cleanupPeerConnection();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };


// //   const joinStream = async (streamIdToJoin) => {
// //     setLoading(true);
// //     setViewerMode(true);
// //     setStreamId(streamIdToJoin);

// //     const streamToJoin = availableStreams.find(s => s.id === streamIdToJoin);
// //     if (!streamToJoin) {
// //       Alert.alert("Error", "Stream not found");
// //       setLoading(false);
// //       setViewerMode(false);
// //       return;
// //     }
// //     setCurrentStream(streamToJoin);

// //     try {
// //       // Create peer connection first
// //       await createPeerConnection(streamIdToJoin);
      
// //       // Then send join request
// //       sendMessage({
// //         type: "join-stream",
// //         streamId: streamIdToJoin
// //       });
// //       console.log(`[WS] Sent join-stream for ${streamIdToJoin}`);
      
// //       // Set a timeout for connection
// //       setTimeout(() => {
// //         if (loading && !remoteURL) {
// //           console.warn("[WebRTC] Connection timeout - no stream received");
// //           Alert.alert("Connection Timeout", "Could not connect to the stream. Please try again.");
// //           setLoading(false);
// //           cleanupPeerConnection(streamIdToJoin);
// //         }
// //       }, 15000); // 15 second timeout
      
// //     } catch (error) {
// //       console.error("[WebRTC] Error joining stream:", error);
// //       Alert.alert("Error", "Failed to join stream: " + error.message);
// //       setViewerMode(false);
// //       setCurrentStream(null);
// //       setLoading(false);
// //       cleanupPeerConnection(streamIdToJoin);
// //     }
// //   };

// //   const endStream = () => {
// //     if (isBroadcaster && streamId) {
// //       sendMessage({
// //         type: "end-stream",
// //         streamId
// //       });
// //     }

// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch (e) {
// //       console.warn("[endStream] Error closing ws:", e);
// //     }
// //     ws.current = null;

// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current);
// //       reconnectTimeoutRef.current = null;
// //     }

// //     cleanupPeerConnection();
// //     setViewerMode(false);
// //     setIsBroadcaster(false);
// //     setStreamId(null);
// //     setCurrentStream(null);
// //     setListStreamRetries(0);
// //     setReconnectAttempts(0);
// //   };

// //   const sendComment = () => {
// //     if (commentInput.trim() === "") return;

// //     const userDataRaw = AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const userName = userData.name || "Viewer";

// //     const comment = {
// //       id: Date.now().toString(),
// //       user: userName,
// //       text: commentInput,
// //       timestamp: Date.now()
// //     };

// //     sendMessage({
// //       type: "comment",
// //       comment,
// //       streamId
// //     });

// //     setCommentInput("");
// //   };

// //   const sendLike = () => {
// //     sendMessage({
// //       type: "like",
// //       streamId
// //     });
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();

// //     return () => {
// //       endStream();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (isLive) {
// //       const startTime = Date.now();
// //       streamTimerRef.current = setInterval(() => {
// //         setStreamDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (streamTimerRef.current) {
// //         clearInterval(streamTimerRef.current);
// //         streamTimerRef.current = null;
// //         setStreamDuration(0);
// //       }
// //     }
// //     return () => {
// //       if (streamTimerRef.current) clearInterval(streamTimerRef.current);
// //     };
// //   }, [isLive]);

// //   useEffect(() => {
// //     if (wsConnected && !isLive && !viewerMode) {
// //       const interval = setInterval(() => {
// //         sendMessage({ type: "list-streams" });
// //       }, STREAM_POLL_INTERVAL);
// //       return () => clearInterval(interval);
// //     }
// //   }, [wsConnected, isLive, viewerMode]);

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const displayName = currentStream ? currentStream.broadcaster : (name || "User");
// //   const displayImage = currentStream ? currentStream.thumbnail : profile_image;
// //   const defaultImage = require('../assets/images/dad.jpg');

// //   const debugStreams = () => {
// //     console.log("[Debug] localStream tracks:", localStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //     console.log("[Debug] remoteStream tracks:", remoteStream.current?.getTracks().map(t => `${t.kind}: ${t.enabled}`));
// //     console.log("[Debug] peerConnections:", Object.keys(peerConnections.current));
// //     console.log("[Debug] isBroadcaster:", isBroadcaster, "viewerMode:", viewerMode, "streamId:", streamId);
// //   };

// //   if (!isLive && !viewerMode) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.selectionScreen}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Live Streams</Text>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="close" size={28} color="white" />
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.startStreamButton, loading && styles.disabledButton]}
// //             onPress={startStream}
// //             disabled={loading || !wsConnected}
// //           >
// //             <View style={styles.startStreamIcon}>
// //               <Icon name="videocam" size={30} color="white" />
// //             </View>
// //             <Text style={styles.startStreamText}>
// //               {loading ? "Starting..." : !wsConnected ? "Connecting..." : "Go Live"}
// //             </Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
// //             <Text style={styles.debugButtonText}>Debug Streams</Text>
// //           </TouchableOpacity>

// //           <Text style={styles.availableStreamsTitle}>Who's Live Now</Text>

// //           {availableStreams.length > 0 ? (
// //             <FlatList
// //               data={availableStreams}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={[styles.streamItem, loading && styles.disabledButton]}
// //                   onPress={() => joinStream(item.id)}
// //                   disabled={loading || !wsConnected}
// //                 >
// //                   <Image
// //                     source={{ uri: item.thumbnail ? `${API_ROUTE_IMAGE}${item.thumbnail}` : defaultImage }}
// //                     style={styles.streamThumbnail}
// //                     defaultSource={defaultImage}
// //                     onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
// //                   />
// //                   <View style={styles.streamInfo}>
// //                     <View style={styles.streamTitleContainer}>
// //                       <Text style={styles.streamTitle}>{item.broadcaster} is Live!</Text>
// //                       <View style={styles.liveBadge}>
// //                         <View style={styles.liveDotSmall} />
// //                         <Text style={styles.liveBadgeText}>LIVE</Text>
// //                       </View>
// //                     </View>
// //                     <Text style={styles.streamViewers}>{item.viewers || 0} watching</Text>
// //                   </View>
// //                   <Icon name="play-circle-outline" size={30} color="#e53e3e" />
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : (
// //             <View style={styles.noStreams}>
// //               <Icon name="live-tv" size={50} color="#718096" />
// //               <Text style={styles.noStreamsText}>No one is live right now</Text>
// //               {!wsConnected && (
// //                 <Text style={styles.connectingText}>
// //                   {reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
// //                     ? "Failed to connect to server"
// //                     : "Connecting to server..."}
// //                 </Text>
// //               )}
// //               {wsConnected && listStreamRetries >= 5 && (
// //                 <Text style={styles.connectingText}>Unable to load streams, please try again later</Text>
// //               )}
// //               <TouchableOpacity
// //                 style={styles.retryButton}
// //                 onPress={() => sendMessage({ type: "list-streams" })}
// //                 disabled={loading || !wsConnected}
// //               >
// //                 <Text style={styles.retryButtonText}>Retry</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.streamScreen}>
// //         {viewerMode ? (
// //           remoteURL ? (
// //             <View style={styles.videoContainer}>
// //               <RTCView 
// //                 streamURL={remoteURL} 
// //                 style={styles.remoteVideo} 
// //                 objectFit="cover" 
// //                 mirror={false}
// //               />
// //               {loading && (
// //                 <View style={styles.loadingOverlay}>
// //                   <Text style={styles.loadingText}>Connecting to stream...</Text>
// //                 </View>
// //               )}
// //             </View>
// //           ) : (
// //             <View style={styles.videoPlaceholder}>
// //               <ActivityIndicator size="large" color="#e53e3e" />
// //               <Text style={styles.loadingText}>
// //                 {loading ? "Connecting to stream..." : "Waiting for stream..."}
// //               </Text>
// //             </View>
// //           )
// //         ) : isBroadcaster && localURL ? (
// //           <View style={styles.videoContainer}>
// //             <RTCView streamURL={localURL} style={styles.remoteVideo} objectFit="cover" />
// //           </View>
// //         ) : (
// //           <View style={styles.videoPlaceholder}>
// //             <ActivityIndicator size="large" color="#e53e3e" />
// //             <Text style={styles.loadingText}>
// //               {isBroadcaster ? "Starting your stream..." : "Preparing..."}
// //             </Text>
// //           </View>
// //         )}

// //         <View style={styles.streamInfoOverlay}>
// //           <View style={styles.liveIndicator}>
// //             <View style={styles.liveDot} />
// //             <Text style={styles.liveText}>LIVE</Text>
// //             <Text style={styles.viewerCount}>{viewers} watching</Text>
// //             <Text style={styles.duration}>{formatTime(streamDuration)}</Text>
// //           </View>

// //           <View style={styles.broadcasterInfo}>
// //             <Image
// //               source={{ uri: displayImage ? `${API_ROUTE_IMAGE}${displayImage}` : defaultImage }}
// //               style={styles.broadcasterAvatar}
// //               defaultSource={defaultImage}
// //               onError={(e) => console.log("Broadcaster avatar load error:", e.nativeEvent.error)}
// //             />
// //             <Text style={styles.broadcasterName}>{displayName}</Text>
// //           </View>
// //         </View>

// //         <View style={styles.commentsContainer}>
// //           <FlatList
// //             data={comments}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <View style={styles.commentBubble}>
// //                 <Text style={styles.commentUser}>{item.user}:</Text>
// //                 <Text style={styles.commentText}>{item.text}</Text>
// //               </View>
// //             )}
// //             inverted
// //           />
// //         </View>

// //         {isBroadcaster && (
// //           <View style={styles.streamControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="flip-camera-ios" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={endStream}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={debugStreams}>
// //               <View style={styles.controlIcon}>
// //                 <Icon name="bug-report" size={24} color="white" />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {viewerMode && (
// //           <KeyboardAvoidingView
// //             behavior={Platform.OS === "ios" ? "padding" : "height"}
// //             style={styles.commentInputContainer}
// //           >
// //             <TextInput
// //               style={styles.commentInput}
// //               placeholder="Add a comment..."
// //               value={commentInput}
// //               onChangeText={setCommentInput}
// //               onSubmitEditing={sendComment}
// //             />
// //             <TouchableOpacity style={styles.likeButton} onPress={sendLike}>
// //               <Icon name="favorite" size={24} color="white" />
// //               <Text style={styles.likeCount}>{likes}</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.debugButton} onPress={debugStreams}>
// //               <Icon name="bug-report" size={20} color="white" />
// //             </TouchableOpacity>
// //           </KeyboardAvoidingView>
// //         )}
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   selectionScreen: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   startStreamButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 15,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 30,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#718096',
// //     opacity: 0.7,
// //   },
// //   startStreamIcon: {
// //     marginRight: 10,
// //   },
// //   startStreamText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   debugButton: {
// //     padding: 10,
// //     backgroundColor: '#4a5568',
// //     borderRadius: 10,
// //     margin: 10,
// //     alignItems: 'center',
// //   },
// //   debugButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //   },
// //   availableStreamsTitle: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 15,
// //   },
// //   streamItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   streamThumbnail: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 15,
// //     backgroundColor: '#4a5568',
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   streamTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   streamTitle: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   liveBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e53e3e',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   liveDotSmall: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#fff',
// //     marginRight: 4,
// //   },
// //   liveBadgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   streamViewers: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //   },
// //   noStreams: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //     flex: 1,
// //   },
// //   noStreamsText: {
// //     color: '#718096',
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   connectingText: {
// //     color: '#a0aec0',
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   retryButton: {
// //     backgroundColor: '#e53e3e',
// //     padding: 10,
// //     borderRadius: 10,
// //     marginTop: 15,
// //   },
// //   retryButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   streamScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   loadingOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //   },
// //   videoPlaceholder: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatarContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   avatarImage: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginTop: 20,
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   streamInfoOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 0,
// //     right: 0,
// //     padding: 15,
// //     zIndex: 100,
// //   },
// //   liveIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   liveDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#e53e3e',
// //     marginRight: 5,
// //   },
// //   liveText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   viewerCount: {
// //     color: 'white',
// //     marginRight: 10,
// //     fontSize: 14,
// //   },
// //   duration: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   broadcasterInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //     marginTop: 10,
// //   },
// //   broadcasterAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     marginRight: 10,
// //     backgroundColor: '#4a5568',
// //   },
// //   broadcasterName: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   commentsContainer: {
// //     position: 'absolute',
// //     top: 100,
// //     left: 10,
// //     right: 10,
// //     height: 200,
// //     zIndex: 90,
// //   },
// //   commentBubble: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 8,
// //     borderRadius: 12,
// //     marginBottom: 5,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   commentUser: {
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //   },
// //   commentText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   streamControls: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     zIndex: 100,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   controlIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#4a5568',
// //   },
// //   commentInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     zIndex: 100,
// //   },
// //   commentInput: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //     color: '#000',
// //   },
// //   likeButton: {
// //     padding: 10,
// //     backgroundColor: 'rgba(255, 0, 0, 0.7)',
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   likeCount: {
// //     color: 'white',
// //     fontSize: 12,
// //     marginTop: 2,
// //   },
// // });
// // (Replace the whole file contents with this updated version)
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



