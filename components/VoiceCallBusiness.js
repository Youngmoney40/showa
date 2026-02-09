// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   TouchableOpacity,
//   Modal,
//   SafeAreaView,
//   StatusBar,
//   ImageBackground,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   MediaStream,
//   RTCView,

// } from "react-native-webrtc";
// import { encode as btoa } from "base-64";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { Image } from "react-native-animatable";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_ROUTE_IMAGE } from "../api_routing/api";
// import InCallManager from "react-native-incall-manager";


// // ================== CONFIG ==================
// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // ============================================

// export default function VoiceVideoCallScreen({ navigation, route }) {
//   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } = route.params || {};

//   /// --- refs/state
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const rtcConfig = useRef({ iceServers: [] }).current;

//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);
//   const [showIncomingModal, setShowIncomingModal] = useState(false);
//   const [incomingSDP, setIncomingSDP] = useState(null);
//   const [callDuration, setCallDuration] = useState(0);
//   const [isVideoCall, setIsVideoCall] = useState(false);
//   const [isCameraFront, setIsCameraFront] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSpeakerOn, setIsSpeakerOn] = useState(false);

//   const isCallerRef = useRef(false);
//   const callTimerRef = useRef(null);
//   const hasInitialOfferRef = useRef(false);
//   const isCleaningUpRef = useRef(false);
//   const isCallActiveRef = useRef(true);


  

//   // =============== PERMISSIONS ===============
//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//         ]);
//         return (
//           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
//           grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
//         );
//       } catch (err) {
//         console.warn(err);
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
//       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
//     } catch (err) {
//       console.error("[Xirsys] Failed to fetch ICE servers:", err);
//       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//     }
//   };

// const ensurePeerConnection = async () => {
//   if (pc.current) return;

//   if (!rtcConfig.iceServers.length) {
//     await getIceServers();
//   }

//   pc.current = new RTCPeerConnection(rtcConfig);
//   console.log("[WebRTC] RTCPeerConnection created");

//   pc.current.onnegotiationneeded = () => {
//     console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
//   };

//   pc.current.onicecandidate = (evt) => {
//     if (evt.candidate) {
//       sendMessage({ type: "candidate", candidate: evt.candidate });
//     }
//   };

//   pc.current.ontrack = (evt) => {
//     console.log("[WebRTC] Track received:", evt.track?.kind);
//     if (evt.streams && evt.streams[0]) {
//       remoteStream.current = evt.streams[0];
//       try { setRemoteURL(remoteStream.current.toURL()); } catch {}
//       setWebrtcReady(true);
//       playRemoteAudio(remoteStream.current);
//       const videoTracks = remoteStream.current.getVideoTracks();
//       if (videoTracks.length > 0) setIsVideoCall(true);
//     }
//   };

//   pc.current.onconnectionstatechange = () => {
//     if (!pc.current) {
//       console.warn("[WebRTC] onconnectionstatechange called with no pc");
//       return;
//     }
//     console.log("[WebRTC] connectionState =>", pc.current.connectionState);
//     if (pc.current.connectionState === "failed") {
//       console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
//     }
//   };

//   pc.current.oniceconnectionstatechange = () => {
//     if (!pc.current) return;
//     console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
//   };
// };

//   const playRemoteAudio = async (stream) => {
//   try {
//     // For React Native, we need to use InCallManager to handle audio routing
//     InCallManager.start({ media: 'audio' });
//     InCallManager.setSpeakerphoneOn(isSpeakerOn);
    
//     console.log('[Audio] Remote audio stream received and playing');
//   } catch (error) {
//     console.error('[Audio] Failed to play remote audio:', error);
//   }
// };
// useEffect(() => {
//   // Setup InCallManager when component mounts
//   InCallManager.setKeepScreenOn(true);
//   InCallManager.setForceSpeakerphoneOn(false);
  
//   return () => {
//     // Cleanup when component unmounts
//     InCallManager.stop();
//     InCallManager.setKeepScreenOn(false);
//   };
// }, []);

// // Improved toggleSpeaker function


//   const ensureLocalStreamAndAttach = async (videoEnabled = isVideoCall) => {
//     if (!localStream.current) {
//       const hasPermission = await requestPermissions();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone or camera.");
//         return false;
//       }
//       try {
//         const s = await mediaDevices.getUserMedia({
//           audio: true,
//           video: videoEnabled ? { facingMode: isCameraFront ? "user" : "environment" } : false,
//         });
//         localStream.current = s;
//         try {
//           setLocalURL(s.toURL());
//         } catch {
//           // ignore if toURL not available
//         }
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     if (pc.current) {
//       const existingTracks = pc.current.getSenders().map((s) => s.track);
//       localStream.current.getTracks().forEach((track) => {
//         if (!existingTracks.includes(track)) {
//           pc.current.addTrack(track, localStream.current);
//         }
//       });
//     }
//     // Apply initial mute state
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
//       }
//     }
//   };

//   // const toggleSpeaker = async () => {
//   //   try {
//   //     if (localStream.current) {
//   //       const audioTrack = localStream.current.getAudioTracks()[0];
//   //       if (audioTrack) {
//   //         // Note: react-native-webrtc doesn't directly support speakerphone control
//   //         // This is a placeholder for platform-specific implementation
//   //         // For Android, you might need native module integration
//   //         setIsSpeakerOn(!isSpeakerOn);
//   //         // For actual implementation, you may need to:
//   //         // 1. Use react-native-sound or similar for Android
//   //         // 2. Use AVAudioSession for iOS
//   //         // Currently setting state for UI feedback
//   //         console.log("[Audio] Speakerphone", !isSpeakerOn ? "enabled" : "disabled");
//   //       }
//   //     }
//   //   } catch (e) {
//   //     console.error("[Audio] Failed to toggle speaker:", e?.message || e);
//   //   }
//   // };
// //   const toggleSpeaker = () => {
// //   const newState = !isSpeakerOn;
// //   InCallManager.setSpeakerphoneOn(newState); // 🔊 control loudspeaker
// //   setIsSpeakerOn(newState);
// //   console.log("[Audio] Speakerphone", newState ? "enabled" : "disabled");
// // };
// const toggleSpeaker = () => {
//   const newState = !isSpeakerOn;
//   InCallManager.setSpeakerphoneOn(newState);
//   setIsSpeakerOn(newState);
//   console.log("[Audio] Speakerphone", newState ? "enabled" : "disabled");
// };

// const startAudioSession = () => {
//   InCallManager.start({ media: 'audio' });
//   InCallManager.setSpeakerphoneOn(isSpeakerOn);
// };

// const stopAudioSession = () => {
//   InCallManager.stop();
// };

// // const switchToVideoCall = async () => {
// //   if (!webrtcReady || !pc.current) return;
  
// //   console.log("[WebRTC] Switching to video call");
  
// //   try {
// //     // First, ensure we have video permissions
// //     const hasPermission = await requestPermissions();
// //     if (!hasPermission) {
// //       Alert.alert("Permission denied", "Cannot access camera.");
// //       return;
// //     }

// //     // Get new stream with video
// //     const newStream = await mediaDevices.getUserMedia({
// //       audio: true,
// //       video: { facingMode: isCameraFront ? "user" : "environment" }
// //     });

// //     // Replace audio tracks and add video tracks
// //     const senders = pc.current.getSenders();
    
// //     // Find and replace audio track
// //     const audioTrack = newStream.getAudioTracks()[0];
// //     const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
// //     if (audioSender && audioTrack) {
// //       await audioSender.replaceTrack(audioTrack);
// //     }

// //     // Add video track if not present
// //     const videoTrack = newStream.getVideoTracks()[0];
// //     const videoSender = senders.find(s => s.track && s.track.kind === 'video');
    
// //     if (videoTrack) {
// //       if (videoSender) {
// //         await videoSender.replaceTrack(videoTrack);
// //       } else {
// //         // Add new video track
// //         pc.current.addTrack(videoTrack, newStream);
// //       }
// //     }

// //     // Stop old stream and set new one
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach(track => track.stop());
// //     }
// //     localStream.current = newStream;
// //     setLocalURL(newStream.toURL());
// //     setIsVideoCall(true);

// //     // Create and send renegotiation offer
// //     const offer = await pc.current.createOffer();
// //     await pc.current.setLocalDescription(offer);
    
// //     sendMessage({
// //       type: "offer",
// //       offer,
// //       isVideoCall: true,
// //       isRenegotiation: true // Add flag for renegotiation
// //     });

// //     console.log("[WebRTC] Video switch offer sent");

// //   } catch (e) {
// //     console.error("[WebRTC] Switch to video failed:", e?.message || e);
// //     Alert.alert("Error", "Failed to switch to video call");
// //   }
// // };
// const switchToVideoCall = async () => {
//   if (!webrtcReady || !pc.current) return;
  
//   console.log("[WebRTC] Switching to video call");
  
//   try {
//     // Ensure we have video permissions
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       Alert.alert("Permission denied", "Cannot access camera.");
//       return;
//     }

//     // Get new stream with video
//     const newStream = await mediaDevices.getUserMedia({
//       audio: true,
//       video: { facingMode: isCameraFront ? "user" : "environment" }
//     });

//     // Replace audio tracks and add video tracks
//     const senders = pc.current.getSenders();
    
//     // Find and replace audio track
//     const audioTrack = newStream.getAudioTracks()[0];
//     const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
//     if (audioSender && audioTrack) {
//       await audioSender.replaceTrack(audioTrack);
//     }

//     // Add video track
//     const videoTrack = newStream.getVideoTracks()[0];
//     const videoSender = senders.find(s => s.track && s.track.kind === 'video');
    
//     if (videoTrack) {
//       if (videoSender) {
//         await videoSender.replaceTrack(videoTrack);
//       } else {
//         // Add new video track if not present
//         pc.current.addTrack(videoTrack, newStream);
//       }
//     }

//     // Stop old stream and set new one
//     if (localStream.current) {
//       localStream.current.getTracks().forEach(track => track.stop());
//     }
//     localStream.current = newStream;
//     setLocalURL(newStream.toURL());
//     setIsVideoCall(true);

//     // Create and send renegotiation offer
//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);
    
//     sendMessage({
//       type: "offer",
//       offer,
//       isVideoCall: true,
//       isRenegotiation: true
//     });

//     console.log("[WebRTC] Video switch offer sent");

//   } catch (e) {
//     console.error("[WebRTC] Switch to video failed:", e?.message || e);
//     Alert.alert("Error", "Failed to switch to video call");
//   }
// };

//   const switchCamera = async () => {
//     if (!isVideoCall || !localStream.current) return;
    
//     const videoTrack = localStream.current.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack._switchCamera();
//       setIsCameraFront(!isCameraFront);
//     }
//   };

//   const drainQueuedCandidates = async () => {
//     if (!pc.current) return;
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
//       }
//     }
//   };

  
//   const cleanupPeerConnection = () => {
//   console.log("[Cleanup] Closing peer connection and streams");
//   isCleaningUpRef.current = true;
//   isCallActiveRef.current = false; // mark call ended immediately

//   try {
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.onconnectionstatechange = null;
//       pc.current.oniceconnectionstatechange = null;
//       pc.current.close();
//     }
//   } catch (e) {
//     console.warn("[Cleanup] pc close error", e);
//   }
//   pc.current = null;

//   try {
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//     }
//   } catch (e) {
//     console.warn("[Cleanup] localStream stop error", e);
//   }
//   localStream.current = null;
//   remoteStream.current = null;
//   queuedRemoteCandidates.current = [];
//   hasInitialOfferRef.current = false;

//   // stop audio session
//   try { InCallManager.stop(); } catch {}

//   setLocalURL(null);
//   setRemoteURL(null);
//   setWebrtcReady(false);
//   setIsVideoCall(false);
//   setIsMuted(false);
//   setIsSpeakerOn(false);
//   isCleaningUpRef.current = false;
// };


//   // =============== SIGNALING ================
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   const connectSignaling = async () => {
//     let roomId = "unknown";
//     const token = await AsyncStorage.getItem("userToken");
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
//     const currentUserId = userData?.id;

//     if (isInitiator && targetUserId) {
//       roomId = `user-${targetUserId}`;
//     } else if (currentUserId) {
//       roomId = `user-${currentUserId}`;
//     } else {
//       roomId = "unique-room-id";
//     }

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

//     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected to", roomId);
//       setWsConnected(true);

//       await ensurePeerConnection();
//       await ensureLocalStreamAndAttach(isVideoCall);

//       if (isInitiator && targetUserId) {
//         isCallerRef.current = true;
//         await createAndSendInitialOffer();
//       }
//       if (!isInitiator && isIncomingCall && incomingOffer) {
//         setIsVideoCall(incomingOffer.isVideoCall || false);
//         await handleIncomingCall(incomingOffer);
//       }
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch {
//         return;
//       }

//       // Debug: always log incoming messages and key states
//   console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation,
//               "pcExists:", !!pc.current, "isCallActive:", isCallActiveRef.current);

//   // drop messages if call already ended
//   if (!isCallActiveRef.current && data?.type !== "call-ended") {
//     console.warn("[WS] Ignoring message after call ended:", data?.type);
//     return;
//   }

//       switch (data.type) {
//         // case "offer": {
//         //   if (isCallerRef.current) return;
//         //   setIncomingSDP(data.offer);
//         //   setIsVideoCall(data.isVideoCall || false);
//         //   setShowIncomingModal(true);
//         //   break;
//         // }
//   //       case "offer": {
//   //   if (data.isRenegotiation) {
//   //     // This is a renegotiation for video
//   //     console.log("[WebRTC] Received video renegotiation offer");
//   //     await handleRenegotiationOffer(data.offer, data.isVideoCall);
//   //   } else {
//   //     // Original offer handling
//   //     if (isCallerRef.current) return;
//   //     setIncomingSDP(data.offer);
//   //     setIsVideoCall(data.isVideoCall || false);
//   //     setShowIncomingModal(true);
//   //   }
//   //   break;
//   // }
//   case "offer": {
//       // If it's a renegotiation offer, make sure we have pc + local stream set up first
//       if (data.isRenegotiation) {
//         console.log("[WebRTC] Renegotiation offer received");
//         // ensure pc & local stream exist before handling renegotiation
//         try {
//           await ensurePeerConnection();
//           // ensure local audio present (don't force video)
//           await ensureLocalStreamAndAttach(isVideoCall);
//         } catch (err) {
//           console.error("[WebRTC] Failed to prepare pc/local for renegotiation:", err);
//           return;
//         }
//         await handleRenegotiationOffer(data.offer, data.isVideoCall);
//       } else {
//         if (isCallerRef.current) return;
//         // Regular initial offer -> show incoming modal
//         setIncomingSDP(data.offer);
//         setIsVideoCall(data.isVideoCall || false);
//         setShowIncomingModal(true);
//       }
//       break;
//     }

//         case "answer": {
//           if (!isCallerRef.current) return;
//           if (!pc.current) return;
//           if (pc.current.signalingState === "have-local-offer") {
//             try {
//               await pc.current.setRemoteDescription(
//                 new RTCSessionDescription(data.answer)
//               );
//               await drainQueuedCandidates();
//             } catch (e) {
//               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
//             }
//           }
//           break;
//         }
//         case "candidate": {
//           if (!pc.current) return;
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//             } catch (e) {
//               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
//             }
//           }
//           break;
//         }
//         case "call-ended": {
//          Alert.alert(
//             "Call Ended", 
//             "Your call partner has disconnected"
//           );
//           endCall(false);
//           break;
//         }
//         default:
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       setWsConnected(false);
//       if (!isCleaningUpRef.current) {
//         cleanupPeerConnection();
//       }
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err?.message || err);
//     };
//   };
// // const handleRenegotiationOffer = async (offer, isVideo) => {
// //   try {
// //     if (!pc.current) {
// //       console.error("[WebRTC] No peer connection for renegotiation");
// //       return;
// //     }

// //     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //     await drainQueuedCandidates();

// //     const answer = await pc.current.createAnswer();
// //     await pc.current.setLocalDescription(answer);
    
// //     sendMessage({ 
// //       type: "answer", 
// //       answer,
// //       isVideoCall: isVideo,
// //       isRenegotiation: true
// //     });

// //     setIsVideoCall(isVideo);
// //     console.log("[WebRTC] Renegotiation answer sent");

// //   } catch (error) {
// //     console.error("[WebRTC] Renegotiationnn failed:", error?.message || error);
// //   }
// // };

// // const handleRenegotiationOffer = async (offer, isVideo) => {
// //   try {
// //     if (!pc.current) {
// //       console.error("[WebRTC] No peer connection for renegotiation");
// //       return;
// //     }

// //     if (pc.current.signalingState === "closed") {
// //       console.warn("[WebRTC] Ignoring renegotiation, connection already closed");
// //       return;
// //     }

// //     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //     await drainQueuedCandidates();

// //     const answer = await pc.current.createAnswer();
// //     await pc.current.setLocalDescription(answer);
    
// //     sendMessage({ 
// //       type: "answer", 
// //       answer,
// //       isVideoCall: isVideo,
// //       isRenegotiation: true
// //     });

// //     setIsVideoCall(isVideo);
// //     console.log("[WebRTC] Renegotiation answer sent");

// //   } catch (error) {
// //     console.error("[WebRTC] Renegotiation failed:", error?.message || error);
// //   }
// // };
// const handleRenegotiationOffer = async (offer, isVideo) => {
//   try {
//     // If no pc — try to recreate (best effort)
//     if (!pc.current) {
//       console.warn("[WebRTC] No pc available, trying to recreate for renegotiation");
//       await ensurePeerConnection();
//       // attach local stream (do not force video)
//       await ensureLocalStreamAndAttach(isVideo || false);
//     }

//     if (!pc.current) {
//       console.error("[WebRTC] Still no pc after attempting recreate — abort renegotiation");
//       return;
//     }

//     if (pc.current.signalingState === "closed") {
//       console.warn("[WebRTC] pc already closed — ignoring renegotiation");
//       return;
//     }

//     // Important: setRemoteDescription only when signaling state allows it
//     console.log("[WebRTC] setting remote description for renegotiation. signalingState:", pc.current.signalingState);
//     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//     await drainQueuedCandidates();

//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);

//     sendMessage({
//       type: "answer",
//       answer,
//       isVideoCall: isVideo,
//       isRenegotiation: true
//     });

//     setIsVideoCall(isVideo);
//     console.log("[WebRTC] Renegotiation answer sent");
//   } catch (error) {
//     console.error("[WebRTC] Renegotiation failed:", error);
//   }
// };



//   // ============ OFFER/ANSWER FLOW ===========
//   const createAndSendInitialOffer = async () => {
//     if (hasInitialOfferRef.current) return;
//     await ensurePeerConnection();
//     const ok = await ensureLocalStreamAndAttach(isVideoCall);
//     if (!ok || !pc.current) return;

//     try {
//       const userDataRaw = await AsyncStorage.getItem("userData");
//       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//       const callerInfo = {
//         profileImage: userData.profile_picture || "",
//         name: userData.name || "Caller",
//       };

//       const offer = await pc.current.createOffer();
//       await pc.current.setLocalDescription(offer);

//       sendMessage({
//         type: "offer",
//         offer: {
//           ...offer,
//           targetUserId: targetUserId,
//           callerInfo,
//           isVideoCall,
//         },
//       });
//       hasInitialOfferRef.current = true;
//       console.log("[WebRTC] Initial offer created & sent");
//     } catch (e) {
//       console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
//     }
//   };

//   // const handleIncomingCall = async (offer) => {
//   //   try {
//   //     await ensurePeerConnection();
//   //     const ok = await ensureLocalStreamAndAttach(offer.isVideoCall || false);
//   //     if (!ok || !pc.current) return;

//   //     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//   //     await drainQueuedCandidates();

//   //     const answer = await pc.current.createAnswer();
//   //     await pc.current.setLocalDescription(answer);
      
//   //     sendMessage({ 
//   //       type: "answer", 
//   //       answer,
//   //       isVideoCall: offer.isVideoCall || false,
//   //     });

//   //     setWebrtcReady(true);
//   //     setShowIncomingModal(false);
//   //     setIncomingSDP(null);
//   //   } catch (error) {
//   //     console.error("Error handling incoming call:", error?.message || error);
//   //     Alert.alert("Error", "Failed to accept call");
//   //   }
//   // };
//   const handleIncomingCall = async (offer) => {
//   try {
//     await ensurePeerConnection();
    
//     // Use the video state from the offer
//     const isVideo = offer.isVideoCall || false;
//     const ok = await ensureLocalStreamAndAttach(isVideo);
//     if (!ok || !pc.current) return;

//     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//     await drainQueuedCandidates();

//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);
    
//     sendMessage({ 
//       type: "answer", 
//       answer,
//       isVideoCall: isVideo,
//     });

//     setWebrtcReady(true);
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
    
//     // If it's a video call, make sure video is properly enabled
//     if (isVideo) {
//       // Add a small delay to ensure the connection is established
//       setTimeout(() => {
//         if (pc.current && localStream.current) {
//           // Ensure video tracks are enabled
//           localStream.current.getVideoTracks().forEach(track => {
//             track.enabled = true;
//           });
//         }
//       }, 500);
//     }
//   } catch (error) {
//     console.error("Error handling incoming call:", error?.message || error);
//     Alert.alert("Error", "Failed to accept call");
//   }
// };

//   // ================ LIFECYCLE ================
//   useEffect(() => {
//     connectSignaling();
//     return () => {
//       endCall(false);
//     };
//   }, []);

//   useEffect(() => {
//     if (webrtcReady) {
//       const startTime = Date.now();
//       callTimerRef.current = setInterval(() => {
//         setCallDuration(Math.floor((Date.now() - startTime) / 1000));
//       }, 1000);
//     } else {
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//         callTimerRef.current = null;
//         setCallDuration(0);
//       }
//     }
//     return () => {
//       if (callTimerRef.current) clearInterval(callTimerRef.current);
//     };
//   }, [webrtcReady]);

//   // ================ CONTROLS =================
//   // const startCall = async (video = false) => {
//   //   setIsVideoCall(video);
//   //   isCallerRef.current = true;
//   //   await createAndSendInitialOffer();
//   //   InCallManager.start({ media: 'audio' });
//   //   InCallManager.setForceSpeakerphoneOn(false);
//   // };

//   // const acceptCall = async () => {
//   //   isCallerRef.current = false;
//   //   const offer = incomingSDP || incomingOffer;
//   //   if (!offer) {
//   //     Alert.alert("No offer", "No incoming offer to accept.");
//   //     return;
//   //   }
//   //   await handleIncomingCall(offer);
//   // };

// //   const acceptCall = async () => {
// //   isCallerRef.current = false;
// //   const offer = incomingSDP || incomingOffer;
// //   if (!offer) {
// //     Alert.alert("No offer", "No incoming offer to accept.");
// //     return;
// //   }
  
// //   // Start audio session before handling the call
// //   startAudioSession();
  
// //   await handleIncomingCall(offer);
// // };
// // const acceptCall = async () => {
// //   isCallerRef.current = false;
// //   setCallStatus("active");
// //   const offer = incomingSDP || incomingOffer;
// //   if (!offer) {
// //     Alert.alert("No offer", "No incoming offer to accept.");
// //     return;
// //   }
  
// //   startAudioSession();
// //   await handleIncomingCall(offer);
// // };
// const acceptCall = async () => {
//   isCallerRef.current = false;
//   const offer = incomingSDP || incomingOffer;
//   if (!offer) {
//     Alert.alert("No offer", "No incoming offer to accept.");
//     return;
//   }
  
//   // Start audio session before handling the call
//   startAudioSession();
  
//   // Store whether this is a video call
//   const isVideo = offer.isVideoCall || false;
//   setIsVideoCall(isVideo);
  
//   await handleIncomingCall(offer);
// };
// // const startCall = async (video = false) => {
// //   setIsVideoCall(video);
// //   isCallerRef.current = true;
  
// //   // Start audio session before creating offer
// //   startAudioSession();
  
// //   await createAndSendInitialOffer();
// // };

// const startCall = async (video = false) => {
//   setIsVideoCall(video);
//   isCallerRef.current = true;
//   setCallStatus("outgoing");
  
//   // Start audio session and show local preview immediately
//   startAudioSession();
  
//   if (video) {
//     await ensureLocalStreamAndAttach(true);
//   }
  
//   await createAndSendInitialOffer();
// };

// // Update endCall to properly stop audio
// // const endCall = (notify = true) => {
// //    isCallActiveRef.current = false;
// //   try {
// //     if (notify) sendMessage({ type: "call-ended" });
// //   } catch (e) {
// //     console.warn("Error notifying call end:", e);
// //   }

// //   // Stop audio session
// //   stopAudioSession();
  
// //   // Rest of your cleanup code...
// //   cleanupPeerConnection();
// //   navigation.navigate("PHome");
// // };
// const endCall = (notify = true) => {
//   isCallActiveRef.current = false;
//   try { if (notify) sendMessage({ type: "call-ended" }); } catch(e){}
//   try {
//     if (ws.current) {
//       ws.current.onopen = null;
//       ws.current.onmessage = null;
//       ws.current.onclose = null;
//       ws.current.onerror = null;
//       ws.current.close();
//       console.log('user_data_ending_call',ws.current);
//     }
//   } catch (e) { console.warn("[endCall] error closing ws", e); }
//   ws.current = null;

//   stopAudioSession();
//   cleanupPeerConnection();
//   navigation.navigate("PHome");
// };


//   const rejectCall = () => {
//     sendMessage({ type: "call-ended" });
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
//   };

//   // const endCall = (notify = true) => {
//   //   try {
//   //     if (notify) sendMessage({ type: "call-ended" });
//   //   } catch {}
//   //   try {
//   //     if (ws.current) {
//   //       ws.current.onopen = null;
//   //       ws.current.onmessage = null;
//   //       ws.current.onclose = null;
//   //       ws.current.onerror = null;
//   //       ws.current.close();
//   //     }
//   //     InCallManager.stop();
//   //   } catch {}
//   //   ws.current = null;
//   //   cleanupPeerConnection();
//   //   navigation.navigate('PHome');
//   // };
// // const endCall = (notify = true) => {
// //   try {
// //     if (notify) sendMessage({ type: "call-ended" });
// //   } catch (e) {
// //     console.warn("Error notifying call end:", e);
// //   }

// //   try {
// //     if (ws.current) {
// //       ws.current.onopen = null;
// //       ws.current.onmessage = null;
// //       ws.current.onclose = null;
// //       ws.current.onerror = null;
// //       ws.current.close();
// //     }
// //   } catch (e) {
// //     console.warn("Error closing WebSocket:", e);
// //   }

// //   // Always stop InCallManager (audio session + speaker)
// //   try {
// //     InCallManager.stop();
// //     InCallManager.stopRingtone();
// //     InCallManager.stopRingback();
// //     console.log("[Call] Audio session stopped");
// //   } catch (e) {
// //     console.warn("Error stopping InCallManager:", e);
// //   }

// //   ws.current = null;
// //   cleanupPeerConnection();

// //   navigation.navigate("PHome");
// // };

// // Add this to monitor audio state
// useEffect(() => {
//   if (webrtcReady && remoteStream.current) {
//     // Check if remote audio is actually playing
//     const audioTracks = remoteStream.current.getAudioTracks();
//     if (audioTracks.length > 0) {
//       console.log('[Audio] Remote audio track status:', {
//         enabled: audioTracks[0].enabled,
//         readyState: audioTracks[0].readyState,
//         muted: audioTracks[0].muted
//       });
//     }
//   }
// }, [webrtcReady]);

// // Add audio session error handling
// // useEffect(() => {
// //   const subscription = InCallManager.addListener('Proximity', (data) => {
// //     console.log('[Audio] Proximity evehhnt:', data);
// //   });
  
// //   return () => subscription.remove();
// // }, []);


//   // ================ UI ================
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {webrtcReady ? (
//         // <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
//         //   {isVideoCall && remoteURL ? (
//         //     <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
//         //   ) : (
//         //     <View style={styles.avatarContainer}>
//         //       <View style={styles.avatar}>
//         //         <Image
//         //           source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//         //           style={styles.avatarImage}
//         //           resizeMode="cover"
//         //         />
//         //       </View>
//         //     </View>
//         //   )}

//         //   {isVideoCall && localURL && (
//         //     <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
//         //   )}

//         //   <View style={styles.callHeader}>
//         //     <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
//         //     <Text style={styles.callerName}>{name}</Text>
//         //     <Text style={styles.callStatus}>{isVideoCall ? "Video Call" : "Audio Call"}</Text>
//         //   </View>

//         //   <View style={styles.callControls}>
//         //     <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
//         //       <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
//         //         <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
//         //       </View>
//         //       <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
//         //     </TouchableOpacity>

//         //     <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
//         //       <View style={[styles.controlIcon, { backgroundColor: isSpeakerOn ? "#38a169" : "#4a5568" }]}>
//         //         <Icon name={isSpeakerOn ? "volume-up" : "volume-off"} size={24} color="white" />
//         //       </View>
//         //       <Text style={styles.controlText}>{isSpeakerOn ? "Speaker Off" : "Speaker On"}</Text>
//         //     </TouchableOpacity>

//         //     {isVideoCall && (
//         //       <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
//         //         <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//         //           <Icon name="flip-camera-ios" size={24} color="white" />
//         //         </View>
//         //         <Text style={styles.controlText}>Switch</Text>
//         //       </TouchableOpacity>
//         //     )}

//         //     <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
//         //       <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
//         //         <Icon name="call-end" size={24} color="white" />
//         //       </View>
//         //       <Text style={styles.controlText}>End</Text>
//         //     </TouchableOpacity>

//         //     <TouchableOpacity 
//         //       style={styles.controlButton} 
//         //       onPress={isVideoCall ? () => setIsVideoCall(false) : switchToVideoCall}
//         //     >
//         //       <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//         //         <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
//         //       </View>
//         //       <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video On"}</Text>
//         //     </TouchableOpacity>
//         //   </View>
//         // </LinearGradient>
       
//         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
//           {isVideoCall && remoteURL ? (
//             <View style={styles.videoContainer}>
//               <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
              
//               {/* Call info overlay */}
//               <View style={styles.callInfoOverlay}>
//                 {/* <Text style={styles.callerName}>{name}</Text> */}
//                 <Text style={styles.callTypeText}>
//                   {isVideoCall ? "Video Call" : "Voice Call"} • {formatTime(callDuration)}
//                 </Text>
//               </View>
//             </View>
//           ) : (
//             <View style={styles.avatarContainer}>
//               <View style={styles.avatar}>
//                 <Image
//                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//                   style={styles.avatarImage}
//                   resizeMode="cover"
//                 />
//               </View>
              
//               {/* Call info for voice calls */}
//               <View style={styles.voiceCallInfo}>
//                 <Text style={styles.callerName}>{name}</Text>
//                 <Text style={styles.callTypeText}>
//                   Audio Call • {formatTime(callDuration)}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {isVideoCall && localURL && (
//             <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
//           )}

//           {/* Remove the duplicate call header since we've moved the info to overlays */}
//             <View style={styles.callControls}>
//             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
//               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
//                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
//               <View style={[styles.controlIcon, { backgroundColor: isSpeakerOn ? "#38a169" : "#4a5568" }]}>
//                 <Icon name={isSpeakerOn ? "volume-up" : "volume-off"} size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>{isSpeakerOn ? "Speaker Off" : "Speaker On"}</Text>
//             </TouchableOpacity>

//             {isVideoCall && (
//               <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
//                 <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//                   <Icon name="flip-camera-ios" size={24} color="white" />
//                 </View>
//                 <Text style={styles.controlText}>Switch</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
//               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
//                 <Icon name="call-end" size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>End</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.controlButton} 
//               onPress={isVideoCall ? () => setIsVideoCall(false) : switchToVideoCall}
//             >
//               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//                 <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video"}</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       ) : (
        
//         <ImageBackground 
//             source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} 
//             style={{
//               flex: 1,
//               backgroundColor: '#1a202c',
//               justifyContent: 'center',
//               alignItems: 'center'
//             }}
//             blurRadius={10}
//           >
//             <View style={{
//               backgroundColor: 'rgba(0, 0, 0, 0.7)',
//               width: '100%',
//               height: '100%',
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: 20
//             }}>
//               <View style={{
//                 width: 180,
//                 height: 180,
//                 borderRadius: 90,
//                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: 30,
//                 borderWidth: 4,
//                 borderColor: 'rgba(255, 255, 255, 0.2)'
//               }}>
//                 <Image
//                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//                   style={{
//                     width: 160,
//                     height: 160,
//                     borderRadius: 80,
//                   }}
//                   resizeMode="cover"
//                 />
//               </View>
              
//               <Text style={{
//                 color: 'white',
//                 fontSize: 28,
//                 fontWeight: 'bold',
//                 marginBottom: 10
//               }}>{name}</Text>
              
//               <Text style={{
//                 color: 'rgba(255, 255, 255, 0.8)',
//                 fontSize: 16,
//                 marginBottom: 40
//               }}>
//                 {wsConnected 
//                   ? (isInitiator 
//                       ? "Please wait while call is connecting..." 
//                       : "Waiting for call...") 
//                   : "Connecting..."
//                 }
//               </Text>

//               {isInitiator && (
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-around',
//                   width: '100%',
//                   maxWidth: 350
//                 }}>
//                   <TouchableOpacity 
//                     style={{
//                       alignItems: 'center'
//                     }} 
//                     onPress={() => startCall(false)}
//                     disabled={wsConnected ? false : true}
//                   >
//                     <View style={{
//                       width: 70,
//                       height: 70,
//                       borderRadius: 35,
//                       backgroundColor: wsConnected ? "#38a169" : "#718096",
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginBottom: 10
//                     }}>
//                       <Icon name="call" size={30} color="white" />
//                     </View>
//                     <Text style={{
//                       color: 'white',
//                       fontSize: 14
//                     }}>Voice Call</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity 
//                     style={{
//                       alignItems: 'center'
//                     }} 
//                     onPress={() => startCall(true)}
//                     disabled={wsConnected ? false : true}
//                   >
//                     <View style={{
//                       width: 70,
//                       height: 70,
//                       borderRadius: 35,
//                       backgroundColor: wsConnected ? "#3182ce" : "#718096",
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginBottom: 10
//                     }}>
//                       <Icon name="videocam" size={30} color="white" />
//                     </View>
//                     <Text style={{
//                       color: 'white',
//                       fontSize: 14
//                     }}>Video Call</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </ImageBackground>
//       )}

//       {/* Incoming Call Modal */}
//       <Modal
//         visible={showIncomingModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={rejectCall}
//       >
//         <View style={styles.modalOverlay}>
//           <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.incomingCallText}>Incoming Call</Text>

//               <View style={styles.callerInfo}>
//                 <View style={styles.modalAvatar}>
//                   <Image
//                     source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//                     style={styles.modalAvatarImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//                 <Text style={styles.modalCallerName}>{name}</Text>
//                 <Text style={styles.modalCallType}>{isVideoCall ? "Video Call" : "Voice Call"}</Text>
//               </View>

//               <View style={styles.modalButtons}>
//                 <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
//                   <View style={styles.rejectButtonInner}>
//                     <Icon name="call-end" size={30} color="white" />
//                   </View>
//                   <Text style={styles.buttonText}>Decline</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
//                   <View style={styles.acceptButtonInner}>
//                     <Icon name="call" size={30} color="white" />
//                   </View>
//                   <Text style={styles.buttonText}>Accept</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </LinearGradient>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   callScreen: {
//     flex: 1,
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   preCallScreen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     alignItems: 'center',
//     width: '100%',
   
//     opacity: 0.9,
//     backgroundColor: '#000',
//     position: 'relative',

//   },
//   preCallContent: {
//     alignItems: 'center',
//     width: '100%',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   callHeader: {
//     alignItems: 'center',
//     marginTop: 40,
//   },
//   callDuration: {
//     fontSize: 16,
//     color: 'white',
//     opacity: 0.8,
//   },
//   callerName: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'white',
//     marginTop: 10,
//   },
//   callStatus: {
//     fontSize: 16,
//     color: '#a0aec0',
//     marginTop: 5,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     marginVertical: 30,
//     flex: 1,
//   },
//   avatar: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     backgroundColor: '#4a5568',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   largeAvatar: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 5,
//     borderColor: 'rgba(255,255,255,0.8)',
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 75,
//   },
//   largeAvatarImage: {
//     width: '80%',
//     height: '80%',
//     borderRadius: 100,
//   },
//   remoteVideo: {
//     flex: 1,
//     width: '100%',
//     backgroundColor: '#000',
//   },
//   localVideo: {
//     position: 'absolute',
//     bottom: 100,
//     right: 20,
//     width: 120,
//     height: 160,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: 'white',
//     backgroundColor: '#000',
//   },
//   contactName: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 10,
//   },
//   contactStatus: {
//     fontSize: 16,
//     color: '#fff',
//     marginTop: 5,
//   },
//   callControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 40,
//   },
//   preCallControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 50,
//   },
//   controlButton: {
//     alignItems: 'center',
//   },
//   actionButton: {
//     alignItems: 'center',
//   },
//   controlIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   callButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   controlText: {
//     color: 'white',
//     fontSize: 14,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '90%',
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   modalContent: {
//     padding: 30,
//     alignItems: 'center',
//   },
//   incomingCallText: {
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   callerInfo: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   modalAvatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#4a5568',
//     marginBottom: 15,
//     borderWidth: 3,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   modalAvatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 50,
//   },
//   modalCallerName: {
//     fontSize: 22,
//     color: 'white',
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   modalCallType: {
//     fontSize: 16,
//     color: '#a0aec0',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   rejectButton: {
//     alignItems: 'center',
//   },
//   acceptButton: {
//     alignziehItems: 'center',
//   },
//   rejectButtonInner: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#e53e3e',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   acceptButtonInner: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#38a169',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//    videoContainer: {
//     flex: 1,
//     width: '100%',
//     position: 'relative',
//   },
  
//   callInfoOverlay: {
//     position: 'absolute',
//     top: 10, // Increased top margin for better visibility
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better contrast
//     padding: 15,
//     zIndex: 100, // Higher z-index to ensure it's above video
//     borderBottomLeftRadius: 5,
//     borderBottomRightRadius: 5,
//   },
  
//   voiceCallInfo: {
//     alignItems: 'center',
//     marginTop: 1, // More space above the info
//     padding: 20,
//     //backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 15,
//   },
  
//   callerName: {
//     fontSize: 26, // Slightly larger font
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 8,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for better readability
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
  
//   callTypeText: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.9)', // Brighter text
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
  
//   localVideo: {
//     position: 'absolute',
//     bottom: 120, // Adjusted to not overlap with controls
//     right: 20,
//     width: 120,
//     height: 160,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: 'white',
//     backgroundColor: '#000',
//     zIndex: 50, // Lower than overlay but higher than remote video
//   },
  
//   remoteVideo: {
//     flex: 1,
//     width: '100%',
//     backgroundColor: '#000',
//     zIndex: 1, // Lowest z-index
//   },
  
//   callControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 40,
//     zIndex: 100, // High z-index to stay above everything
//   },
// });

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

