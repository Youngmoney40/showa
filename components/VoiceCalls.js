
/// =================================== voice call ========================


// import React, { useEffect, useRef, useState,useCallback  } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   TouchableOpacity,
//   Modal,
//   Vibration,
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
// import { SafeAreaView } from "react-native-safe-area-context";
// import { encode as btoa } from "base-64";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { Image } from "react-native-animatable";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_ROUTE_IMAGE } from "../api_routing/api";
// import InCallManager from "react-native-incall-manager";
// import CallKeepService from '../src/services/CallKeepService';


// // ================== CONFIG ==================
// const SIGNALING_SERVER = "wss://api.showapp.ng";
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
//   const currentCallIdRef = useRef(null);
//   const callTimerRef = useRef(null);
//   const hasInitialOfferRef = useRef(false);
//   const isCleaningUpRef = useRef(false);
//   const isCallActiveRef = useRef(true);
//   const [currentCallId, setCurrentCallId] = useState(null);
  
// const updateCallId = (id) => {
//   currentCallIdRef.current = id;
//   setCurrentCallId(id);
// };

// // ============ DEFINE THESE FUNCTIONS FIRST (BEFORE THE useEffect) ============
  
//   const acceptCallWithCallKeep = useCallback(async () => {
//     console.log('[CallKeep] Accepting call...');
//     stopRinging();
//     isCallerRef.current = false;
    
//     const offer = incomingSDP || incomingOffer;
//     if (!offer) {
//       console.error('[CallKeep] No offer to accept');
//       return;
//     }
    
//     await handleIncomingCall(offer);
    
//     if (currentCallIdRef.current) {
//       await CallKeepService.setCallConnected(currentCallIdRef.current);
//     }
//   }, [incomingSDP, incomingOffer]);

//   const startCallWithCallKeep = useCallback(async (phoneNumber, callUUID) => {
//     console.log('[CallKeep] Starting call with:', phoneNumber, callUUID);
//     setIsVideoCall(false);
//     isCallerRef.current = true;
//     startAudioSession();
//     await createAndSendInitialOffer();
    
//     if (callUUID) {
//       await CallKeepService.setCallConnected(callUUID);
//     }
//   }, []);

//   useEffect(() => {
//   let mounted = true;

//   const setupCallKeepListeners = async () => {
//     const initialized = await CallKeepService.initialize();


    

//     if (!mounted) {
//       console.log('[CallKeep] Unmounted before init completed, skipping');
//       return;
//     }

//     if (!initialized) {
//       console.error('[CallKeep] Init failed');
//       return;
//     }

//     console.log('[CallKeep] Registering listeners...');

//     CallKeepService.addEventListener('answerCall', (payload) => {
//       console.log('[CallKeep] answerCall received:', payload);
//       if (!mounted) return;
//       acceptCallWithCallKeep();
//     });

//     console.log('[DEBUG] RNCallKeep methods:', {
//     addListener: typeof RNCallKeep.addListener,
//     addEventListener: typeof RNCallKeep.addEventListener,
//     on: typeof RNCallKeep.on,
//   });

//     CallKeepService.addEventListener('endCall', (payload) => {
//       console.log('[CallKeep] endCall received:', payload);
//       if (!mounted) return;
//       endCall(true);
//     });

//     CallKeepService.addEventListener('startCall', (payload) => {
//       console.log('[CallKeep] startCall received:', payload);
//       if (!mounted) return;
//       const { handle, callUUID } = payload || {};
//       if (!handle) return;
//       startCallWithCallKeep(handle, callUUID);
//     });

//     CallKeepService.addEventListener('didActivateAudioSession', () => {
//       console.log('[CallKeep] didActivateAudioSession');
//       if (!mounted) return;
//       InCallManager.start({ media: 'audio' });
//     });

//     CallKeepService.addEventListener('didDeactivateAudioSession', () => {
//       console.log('[CallKeep] didDeactivateAudioSession');
//       if (!mounted) return;
//       InCallManager.stop();
//     });

//     console.log('[CallKeep] All listeners registered');
//   };

//   setupCallKeepListeners();

//   return () => {
//     mounted = false;
//     CallKeepService.removeAllListeners();
//   };
// }, []); // empty deps — no re-registration loop

//   // ============ CALLKEEP SETUP USEFFECT ============
// //  useEffect(() => {
// //   let mounted = true;
  
// //  const setupCallKeepListeners = async () => {
// //   try {
// //     console.log('[CallKeep] Setting up listeners...');
    
// //     // First, ensure CallKeep is initialized and wait for it to complete
// //     const initialized = await CallKeepService.initialize();
    
// //     if (!mounted) {
// //       console.log('[CallKeep] Component unmounted, skipping listener setup');
// //       return;
// //     }
    
// //     if (!initialized) {
// //       console.error('[CallKeep] CallKeep initialization failed, retrying in 1 second...');
// //       // Retry after 1 second
// //       setTimeout(() => {
// //         if (mounted) {
// //           setupCallKeepListeners();
// //         }
// //       }, 1000);
// //       return;
// //     }
    
// //     // Small delay to ensure CallKeep is fully ready after initialization
// //     await new Promise(resolve => setTimeout(resolve, 500));
    
// //     console.log('[CallKeep] CallKeep is ready, setting up listeners...');
    
// //     // Define handlers
// //     const handleAnswerCall = (payload) => {
// //       console.log('[CallKeep] answerCall event received:', payload);
// //       if (!mounted) return;
// //       const callUUID = payload.callUUID || payload.callId;
// //       if (callUUID) {
// //         acceptCallWithCallKeep();
// //       }
// //     };
    
// //     const handleEndCall = (payload) => {
// //       console.log('[CallKeep] endCall event received:', payload);
// //       if (!mounted) return;
// //       endCall(true);
// //     };
    
// //     const handleStartCall = (payload) => {
// //       console.log('[CallKeep] startCall event received:', payload);
// //       if (!mounted) return;
// //       const { handle, callUUID } = payload;
// //       if (handle) {
// //         startCallWithCallKeep(handle, callUUID);
// //       }
// //     };
    
// //     const handleDidDisplayIncomingCall = (payload) => {
// //       console.log('[CallKeep] didDisplayIncomingCall event received:', payload);
// //     };
    
// //     const handleDidActivateAudioSession = () => {
// //       console.log('[CallKeep] didActivateAudioSession event received');
// //       if (!mounted) return;
// //       InCallManager.start({ media: 'audio' });
// //     };
    
// //     const handleDidDeactivateAudioSession = () => {
// //       console.log('[CallKeep] didDeactivateAudioSession event received');
// //       if (!mounted) return;
// //       InCallManager.stop();
// //     };
    
// //     // Register listeners
// //     CallKeepService.addEventListener('answerCall', handleAnswerCall);
// //     CallKeepService.addEventListener('endCall', handleEndCall);
// //     CallKeepService.addEventListener('startCall', handleStartCall);
// //     CallKeepService.addEventListener('didDisplayIncomingCall', handleDidDisplayIncomingCall);
// //     CallKeepService.addEventListener('didActivateAudioSession', handleDidActivateAudioSession);
// //     CallKeepService.addEventListener('didDeactivateAudioSession', handleDidDeactivateAudioSession);
    
// //     console.log('[CallKeep] Listeners setup complete');
    
// //   } catch (error) {
// //     console.error('[CallKeep] Error setting up listeners:', error);
// //     // Retry on error
// //     setTimeout(() => {
// //       if (mounted) {
// //         console.log('[CallKeep] Retrying listener setup...');
// //         setupCallKeepListeners();
// //       }
// //     }, 2000);
// //   }
// // };
  
// //   setupCallKeepListeners();
// //   const timeoutId = setTimeout(() => {
// //     if (mounted) {
// //       setupCallKeepListeners();
// //     }
// //   }, 1000);
  
// //   return () => {
// //     mounted = false;
// //     clearTimeout(timeoutId);
// //     // Clean up listeners
// //     try {
// //       CallKeepService.removeAllListeners();
// //     } catch (error) {
// //       console.error('[CallKeep] Error removing listeners:', error);
// //     }
// //   };
// // }, [acceptCallWithCallKeep, startCallWithCallKeep]);

//   //=============== RINGING TOO LONG ===============
//   const [isRinging, setIsRinging] = useState(false);





// useEffect(() => {
//   // Mark that we're on call screen
//   global.__onCallScreen = true;
  
//   return () => {
//     // Clear call screen flag on unmount
//     global.__onCallScreen = false;
//     InCallManager.stopRingtone();
//     InCallManager.stop({ busytone: '_BUNDLE_' });
//   };
// }, []);

// useEffect(() => {
//   // Stop any existing ringtone when entering call screen
//   InCallManager.stopRingtone();
//   Vibration.cancel();
  
//   // Start audio session for call
//   InCallManager.start({ media: 'audio' });
  
//   return () => {
//     // Cleanup when leaving call screen
//     InCallManager.stop();
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//   };
// }, []);

//   // Start ringing when incoming call modal is shown
//   useEffect(() => {
//     if (showIncomingModal) {
//       startRinging();
//     } else {
//       stopRinging();
//     }
    
//     // Cleanup when component unmounts
//     return () => {
//       stopRinging();
//     };
//   }, [showIncomingModal]);

//   // Ringtone functions
//   const startRinging = () => {
//     setIsRinging(true);
//     InCallManager.startRingtone();
//     console.log("[Ringing] Started ringtone");
//   };

//   const stopRinging = () => {
//     if (isRinging) {
//       setIsRinging(false);
//       InCallManager.stopRingtone();
//       console.log("[Ringing] Stopped ringtone");
//     }
//   };

  
// // Auto-switch to video when it's a video call and webrtc is ready
// useEffect(() => {
//   const autoSwitchToVideo = async () => {
//     // Check if this is a video call AND webrtc is ready
//     // Also make sure we're not already in video mode
//     if (webrtcReady && isVideoCall && !localStream.current?.getVideoTracks().length) {
//       console.log("[AutoSwitch] Video call detected, automatically switching to video...");
      
//       // Small delay to ensure connection is stable
//       setTimeout(async () => {
//         try {
//           // Check if we have video permissions
//           const hasPermission = await requestPermissions();
//           if (!hasPermission) {
//             console.warn("[AutoSwitch] No camera permission");
//             return;
//           }

//           // Get new stream with video
//           const newStream = await mediaDevices.getUserMedia({
//             audio: true,
//             video: { facingMode: isCameraFront ? "user" : "environment" }
//           });

//           // Replace tracks in peer connection
//           if (pc.current) {
//             const senders = pc.current.getSenders();
            
//             // Replace audio track
//             const audioTrack = newStream.getAudioTracks()[0];
//             const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
//             if (audioSender && audioTrack) {
//               await audioSender.replaceTrack(audioTrack);
//             }

//             // Add video track
//             const videoTrack = newStream.getVideoTracks()[0];
//             const videoSender = senders.find(s => s.track && s.track.kind === 'video');
            
//             if (videoTrack) {
//               if (videoSender) {
//                 await videoSender.replaceTrack(videoTrack);
//               } else {
//                 pc.current.addTrack(videoTrack, newStream);
//               }
//             }

//             // Stop old stream and set new one
//             if (localStream.current) {
//               localStream.current.getTracks().forEach(track => track.stop());
//             }
//             localStream.current = newStream;
//             setLocalURL(newStream.toURL());

//             // Create and send renegotiation offer
//             const offer = await pc.current.createOffer();
//             await pc.current.setLocalDescription(offer);
            
//             sendMessage({
//               type: "offer",
//               offer,
//               isVideoCall: true,
//               isRenegotiation: true
//             });

//             console.log("[AutoSwitch] Video auto-switch completed");
//           }
//         } catch (error) {
//           console.error("[AutoSwitch] Failed to auto-switch to video:", error);
//         }
//       }, 1000); // 1 second delay to ensure everything is ready
//     }
//   };

//   autoSwitchToVideo();
// }, [webrtcReady, isVideoCall]); 
  

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


// const getIceServers = async () => {
//   try {
//     console.log("[Xirsys] Fetching ICE servers...");

//     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
//       method: "PUT",
//       headers: {
//         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ format: "urls" }),
//     });

//     const data = await res.json();
//     console.log("[Xirsys RAW]:", data);

//     let iceServers = [];

//     if (data?.v?.iceServers) {
//       const server = data.v.iceServers;
      
//       // SEE WHAT'S ACTUALLY COMING BACK
//       console.log("[Xirsys] Raw URLs:", JSON.stringify(server.urls, null, 2));
//       console.log("[Xirsys] Is array?", Array.isArray(server.urls));

//       const urls = Array.isArray(server.urls) ? server.urls : [server.urls];

//       console.log("[ICE] TCP URLs:", urls.filter(u => u.includes("transport=tcp") || u.startsWith("turns:")));
//       console.log("[ICE] UDP URLs:", urls.filter(u => u.includes("transport=udp")));

//       // Pass ALL urls in one object — WebRTC picks the best available
//       iceServers = [
//         {
//           urls: urls,
//           username: server.username,
//           credential: server.credential,
//         }
//       ];
//     }

//     if (!iceServers.length) {
//       throw new Error("No ICE servers from Xirsys");
//     }

//     // Fallback STUN
//     iceServers.push({ urls: "stun:stun.l.google.com:19302" });

//     rtcConfig.iceServers = iceServers;
//     console.log("✅ [ICE CONFIG READY]:", JSON.stringify(iceServers, null, 2));

//   } catch (err) {
//     console.error("❌ [Xirsys Failed]:", err);
//     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//   }

//   rtcConfig.iceTransportPolicy = "all"; // NOT "relay" — allow all candidate types
// };

// const ensurePeerConnection = async () => {
//   if (pc.current) return;

//   if (!rtcConfig.iceServers.length) {
//     await getIceServers();
//   }

//   // rtcConfig.iceTransportPolicy = "relay";

//   pc.current = new RTCPeerConnection(rtcConfig);
//   console.log("[WebRTC] RTCPeerConnection created");

//   pc.current.onnegotiationneeded = () => {
//     console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
//   };

//   // pc.current.onicecandidate = (evt) => {
//   //   if (evt.candidate) {
//   //     sendMessage({ type: "candidate", candidate: evt.candidate });
//   //   }
//   // };

//   pc.current.onicecandidate = (evt) => {
//     if (evt.candidate) {
//       const cand = evt.candidate.candidate;

//       if (cand.includes("typ relay")) {
//         console.log("🟢 [TURN WORKING - Xirsys]", cand);
//       } else if (cand.includes("typ srflx")) {
//         console.log("🟡 [STUN WORKING - Google]", cand);
//       } else if (cand.includes("typ host")) {
//         console.log("⚪ [LOCAL ONLY - NO STUN/TURN]", cand);
//       }

//       sendMessage({ type: "candidate", candidate: evt.candidate });
//     } else {
//       console.log("[ICE] Gathering finished");
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


//   pc.current.onconnectionstatechange = async () => {
//   if (!pc.current) {
//     console.warn("[WebRTC] onconnectionstatechange called with no pc");
//     return;
//   }

//   const state = pc.current.connectionState;
//   console.log("[WebRTC] connectionState =>", state);

//   // ✅ SUCCESS
//   if (state === "connected") {
//     console.log("✅ CALL CONNECTED");

//     try {
//       const stats = await pc.current.getStats();

//       stats.forEach((report) => {
//         if (report.type === "candidate-pair" && report.state === "succeeded") {
//           console.log("🎯 SELECTED CANDIDATE PAIR:", report);

//           // 🔥 IMPORTANT: detect TURN vs STUN properly
//           const local = stats.get(report.localCandidateId);
//           const remote = stats.get(report.remoteCandidateId);

//           if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
//             console.log("🟢 USING TURN (Xirsys)");
//           } else if (local?.candidateType === "srflx") {
//             console.log("🟡 USING STUN (Google)");
//           } else {
//             console.log("⚪ USING LOCAL (same network)");
//           }
//         }
//       });
//     } catch (err) {
//       console.warn("[WebRTC] getStats failed:", err);
//     }
//   }

//   // ❌ FAILURE
//   if (state === "failed") {
//     console.warn("❌ CONNECTION FAILED → TURN NOT WORKING");

//     saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: isInitiator ? 'outgoing' : 'incoming',
//       isVideoCall: isVideoCall,
//       status: 'failed',
//       duration: callDuration
//     });
//   }
// };

//   // pc.current.onconnectionstatechange = () => {
//   //   if (!pc.current) {
//   //     console.warn("[WebRTC] onconnectionstatechange called with no pc");
//   //     return;
//   //   }
//   //   console.log("[WebRTC] connectionState =>", pc.current.connectionState);
//   //   // if (pc.current.connectionState === "failed") {
//   //   //   console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
//   //   // }

     
//   //   if (pc.current.connectionState === "failed") {
//   //     console.warn("[WebRTC] Connection failed");
//   //     // Save as failed call
//   //     saveCallToHistory({
//   //       contact: { name, profileImage: profile_image, userId: targetUserId },
//   //       direction: isInitiator ? 'outgoing' : 'incoming',
//   //       isVideoCall: isVideoCall,
//   //       status: 'failed',
//   //       duration: callDuration
//   //     });
//   //   }

//   // };

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
//     stopRinging();
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

// const switchToVideoCall = async () => {
//   console.log("[Action] Switch to video call initiated. webrtcReady:", webrtcReady, "pc exists:", !!pc.current);
//   if (!webrtcReady || !pc.current) return;
  
//   console.log("[WebRTC] Switching to video call");
  
//   try {
//     // video permissions
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
//   isCallActiveRef.current = false; 

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
//   // const sendMessage = (msg) => {
//   //   if (ws.current?.readyState === WebSocket.OPEN) {
//   //     ws.current.send(JSON.stringify(msg));
//   //   }
//   // };

//   const sendMessage = (msg) => {
//   if (ws.current?.readyState === WebSocket.OPEN) {
//     console.log("[WebSocket] Sending message:", JSON.stringify(msg, null, 2));
//     ws.current.send(JSON.stringify(msg));
//   } else {
//     console.log("[WebSocket] Cannot send, state:", ws.current?.readyState);
//   }
// };

//   const connectSignaling = async () => {
    
//   let roomId = "unknown";
//   const token = await AsyncStorage.getItem("userToken");
//   const userDataRaw = await AsyncStorage.getItem("userData");
//   const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
//   const currentUserId = userData?.id;

//     // if (isInitiator && targetUserId) {
//     //   roomId = `user-${targetUserId}`;
//     // } else if (currentUserId) {
//     //   roomId = `user-${currentUserId}`;
//     // } else {
//     //   roomId = "unique-room-id";
//     // }

//     if (isInitiator && targetUserId) {
//       console.log("target UserId:", targetUserId);
//       roomId = `user-${targetUserId}`;  // e.g., "user-26"
//     } else if (currentUserId) {
//       console.log("current UserId:", currentUserId);
//       roomId = `user-${currentUserId}`;  // e.g., "user-24"
//     } else {
//       roomId = "unknown";
//     }

//     console.log("[WebSocket] Connecting to room:", roomId);

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

//       console.log("[WS] FULL MESSAGE RECEIVED:", JSON.stringify(data, null, 2));

//       if (data.type === 'offer' || (data.offer && data.offer.sdp)) {
//     console.log("[WS] OFFER RECEIVED with SDP!");
//   }
  
//   if (data.type === 'new_call') {
//     console.log("[WS] NEW_CALL message received!");
//   }
  

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

//  case "offer": {
//   console.log("[WS] Received offer, isRenegotiation:", data.isRenegotiation);
  
//   if (data.isRenegotiation) {
//     console.log("[WebRTC] Renegotiation offer received");
//     try {
//       await ensurePeerConnection();
//       await ensureLocalStreamAndAttach(isVideoCall);
//     } catch (err) {
//       console.error("[WebRTC] Failed to prepare pc/local for renegotiation:", err);
//       return;
//     }
//     await handleRenegotiationOffer(data.offer, data.isVideoCall);
//   } else {
//     if (isCallerRef.current) return;
    
//     // CRITICAL: Check where the offer data is
//     let offerData = data.offer;
    
//     // If the offer is directly in data (not nested), use that
//     if (!offerData && data.type === 'offer') {
//       offerData = data;
//     }
    
//     console.log("[WS] Offer data structure:", JSON.stringify(offerData, null, 2));
    
//     // Check if this offer has SDP or if it's just metadata
//     if (offerData && offerData.sdp) {
//       // Full WebRTC offer with SDP
//       console.log("[WS] Full WebRTC offer received, SDP length:", offerData.sdp.length);
//       setIncomingSDP(offerData);
//       setIsVideoCall(offerData.isVideoCall || false);
//       setShowIncomingModal(true);
//     } else if (offerData && (offerData.targetUserId || offerData.callerName)) {
//       // This is just call metadata - the actual WebRTC offer will come separately
//       console.log("[WS] Call metadata received, waiting for WebRTC offer...");
//       // Store the caller info
//       setCallerInfo({
//         profileImage: '',
//         name: offerData.callerName || name || 'Unknown',
//         offer: offerData,
//       });
//       setIsVideoCall(offerData.isVideoCall || false);
//       setShowIncomingModal(true);
//     } else {
//       console.error("[WS] Unknown offer format:", data);
//     }
//   }
//   break;
// }
//   // case "offer": {
//   //     // If it's a renegotiation offer, make sure we have pc + local stream set up first
//   //     if (data.isRenegotiation) {
//   //       console.log("[WebRTC] Renegotiation offer received");
//   //       // ensure pc & local stream exist before handling renegotiation
//   //       try {
//   //         await ensurePeerConnection();
//   //         // ensure local audio present (don't force video)
//   //         await ensureLocalStreamAndAttach(isVideoCall);
//   //       } catch (err) {
//   //         console.error("[WebRTC] Failed to prepare pc/local for renegotiation:", err);
//   //         return;
//   //       }
//   //       await handleRenegotiationOffer(data.offer, data.isVideoCall);
//   //     } else {
//   //       if (isCallerRef.current) return;
//   //       // Regular initial offer -> show incoming modal
//   //       setIncomingSDP(data.offer);
//   //       setIsVideoCall(data.isVideoCall || false);

//   //       const incomingCallId = `call_${Date.now()}`;
//   //       updateCallId(incomingCallId);


//   //       // ← THIS is what triggers the native Android incoming call UI
//   //       await CallKeepService.displayIncomingCall({
//   //         callId: incomingCallId,
//   //         callerName: data.offer?.callerInfo?.name || name || 'Unknown',
//   //         callerId: data.offer?.callerId || targetUserId || '',
//   //         isVideo: data.offer?.isVideoCall || false,
//   //         roomId: data.roomId || '',
//   //       });

//   //       // Also show your in-app modal as fallback
//   //       // (when app is in foreground the native UI may not appear)
//   //       setShowIncomingModal(true);
        
//   //     }
//   //     break;
//   //   }

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
       
// case "call-rejected":
//   Alert.alert("Call Rejected", "The recipient declined your call");
//   await saveCallToHistory({
//     contact: { name, profileImage: profile_image, userId: targetUserId },
//     direction: 'outgoing',
//     isVideoCall: isVideoCall,
//     status: 'rejected',
//     duration: 0
//   });
//   endCall(false);
//   break;

// case "call-missed":
//   if (!isInitiator) {
//     await saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: 'incoming',
//       isVideoCall: isVideoCall,
//       status: 'missed',
//       duration: 0
//     });
//   }
//   break;

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
  
// const handleRenegotiationOffer = async (offer, isVideo) => {
//   try {
    
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

// const saveCallToHistory = async (callDetails) => {
//   try {
//     console.log('[CallHistory] Saving call:', callDetails);
    
//     const existingHistory = await AsyncStorage.getItem('callHistory');
//     console.log('[CallHistory] Existing history:', existingHistory);
    
//     const history = existingHistory ? JSON.parse(existingHistory) : [];
    
//     const newCall = {
//       id: Date.now().toString(),
//       timestamp: Date.now(),
//       contact: {
//         name: callDetails.contact.name,
//         profileImage: callDetails.contact.profileImage,
//         userId: callDetails.contact.userId
//       },
//       direction: callDetails.direction,
//       isVideoCall: callDetails.isVideoCall,
//       status: callDetails.status,
//       duration: callDetails.duration || 0
//     };
    
//     history.unshift(newCall);
//     const limitedHistory = history.slice(0, 100);
    
//     await AsyncStorage.setItem('callHistory', JSON.stringify(limitedHistory));
//     console.log('[CallHistory] Call saved successfully');
    
//     // Verify it was saved
//     const verify = await AsyncStorage.getItem('callHistory');
//     console.log('[CallHistory] Verification:', verify);
    
//   } catch (error) {
//     console.error('[CallHistory] Error saving call:', error);
//   }
// };

//   // ============ OFFER/ANSWER FLOW ===========
// // const createAndSendInitialOffer = async () => {
// //   if (hasInitialOfferRef.current) return;
// //   await ensurePeerConnection();
// //   const ok = await ensureLocalStreamAndAttach(isVideoCall);
// //   if (!ok || !pc.current) return;

// //   try {
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const currentUserId = userData?.id;  // <-- GET CURRENT USER ID HERE

// //     console.log("[UserData]", userData);
// //     console.log("[CurrentUserId]", currentUserId);
    
// //     const callerInfo = {
// //       profileImage: userData.profile_picture || userData.profile_image || "", 
// //       name: userData.name || "Caller",
// //     };

// //     console.log("[Caller Info] Sending caller info:", callerInfo); 

// //     const offer = await pc.current.createOffer();
// //     await pc.current.setLocalDescription(offer);

// //     sendMessage({
// //       type: "new_call",
// //       receiver_id: targetUserId,
// //       caller_name: callerInfo.name,
// //       call_type: isVideoCall ? "video" : "audio",
// //       room_id: `call_${currentUserId}_${targetUserId}`,  // NOW currentUserId exists
// //       offer: {
// //         ...offer,
// //         targetUserId: targetUserId,
// //         callerInfo: callerInfo,
// //         isVideoCall: isVideoCall,
// //       }
// //     });
    
// //     hasInitialOfferRef.current = true;
// //     console.log("[WebRTC] Initial offer created & sent with new_call type to", targetUserId);
// //   } catch (e) {
// //     console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// //   }
// // };

// // const createAndSendInitialOffer = async () => {
// //   if (hasInitialOfferRef.current) return;
// //   await ensurePeerConnection();
// //   const ok = await ensureLocalStreamAndAttach(isVideoCall);
// //   if (!ok || !pc.current) return;

// //   try {
// //     //const userDataRaw = await AsyncStorage.getItem("userData");
// //     //const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

// //     const userDataRaw = await AsyncStorage.getItem("userData");
// // const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// // const currentUserId = userData?.id;  // <-- GET CURRENT USER ID HERE

    
// //     const callerInfo = {
// //       profileImage: userData.profile_picture || userData.profile_image || "", 
// //       name: userData.name || "Caller",
// //     };

// //     const offer = await pc.current.createOffer();
// //     await pc.current.setLocalDescription(offer);
    
// //     console.log("[Outgoing Call] Created offer:", offer.type);

// //     sendMessage({
// //       type: "new_call",
// //       receiver_id: targetUserId,
// //       caller_name: callerInfo.name,
// //       call_type: isVideoCall ? "video" : "audio",
// //       room_id: `call_${currentUserId}_${targetUserId}`,
// //       offer: {
// //         type: offer.type,  // CRITICAL: Include the type
// //         sdp: offer.sdp,    // CRITICAL: Include the SDP
// //         targetUserId: targetUserId,
// //         callerInfo: callerInfo,
// //         isVideoCall: isVideoCall,
// //       }
// //     });
    
// //     hasInitialOfferRef.current = true;
// //     console.log("[Outgoing Call] Initial offer sent");
// //   } catch (e) {
// //     console.error("[Outgoing Call] Failed:", e?.message || e);
// //   }
// // };
// // const createAndSendInitialOffer = async () => {
// //   if (hasInitialOfferRef.current) return;
// //   await ensurePeerConnection();
// //   const ok = await ensureLocalStreamAndAttach(isVideoCall);
// //   if (!ok || !pc.current) return;

// //   try {
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     const currentUserId = userData?.id;
    
// //     const callerInfo = {
// //       profileImage: userData.profile_picture || userData.profile_image || "", 
// //       name: userData.name || "Caller",
// //     };

// //     const offer = await pc.current.createOffer();
// //     await pc.current.setLocalDescription(offer);
    
// //     console.log("[Outgoing Call] Created offer with SDP length:", offer.sdp?.length);
// //     console.log("[Outgoing Call] Offer type:", offer.type);

// //     // Send as 'new_call' message type
// //     sendMessage({
// //       type: "new_call",
// //       receiver_id: targetUserId,
// //       caller_name: callerInfo.name,
// //       call_type: isVideoCall ? "video" : "audio",
// //       room_id: `call_${currentUserId}_${targetUserId}`,
// //       offer: {
// //         type: offer.type,
// //         sdp: offer.sdp,
// //         targetUserId: targetUserId,
// //         callerInfo: callerInfo,
// //         isVideoCall: isVideoCall,
// //       }
// //     });
    
// //     hasInitialOfferRef.current = true;
// //     console.log("[Outgoing Call] Initial offer sent with SDP");
// //   } catch (e) {
// //     console.error("[Outgoing Call] Failed:", e?.message || e);
// //   }
// // };

// const createAndSendInitialOffer = async () => {
//   if (hasInitialOfferRef.current) return;
  
//   console.log("[Outgoing Call] Creating offer...");
  
//   await ensurePeerConnection();
//   const ok = await ensureLocalStreamAndAttach(isVideoCall);
//   if (!ok || !pc.current) {
//     console.error("[Outgoing Call] Failed to setup peer connection or stream");
//     return;
//   }

//   try {
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//     const currentUserId = userData?.id;
    
//     if (!currentUserId) {
//       console.error("[Outgoing Call] No current user ID");
//       return;
//     }
    
//     const callerInfo = {
//       profileImage: userData.profile_picture || userData.profile_image || "", 
//       name: userData.name || "Caller",
//     };

//     console.log("[Outgoing Call] Creating WebRTC offer...");
//     const offer = await pc.current.createOffer();
//     console.log("[Outgoing Call] Offer created, setting local description...");
//     await pc.current.setLocalDescription(offer);
    
//     console.log("[Outgoing Call] Offer SDP length:", offer.sdp?.length);
//     console.log("[Outgoing Call] Offer type:", offer.type);

//     const messageToSend = {
//       type: "new_call",
//       receiver_id: targetUserId,
//       caller_name: callerInfo.name,
//       call_type: isVideoCall ? "video" : "audio",
//       room_id: `call_${currentUserId}_${targetUserId}`,
//       offer: {
//         type: offer.type,
//         sdp: offer.sdp,
//         targetUserId: targetUserId,
//         callerInfo: callerInfo,
//         isVideoCall: isVideoCall,
//       }
//     };
    
//     console.log("[Outgoing Call] Sending message:", JSON.stringify(messageToSend, null, 2));
//     sendMessage(messageToSend);
    
//     hasInitialOfferRef.current = true;
//     console.log("[Outgoing Call] Initial offer sent successfully");
//   } catch (e) {
//     console.error("[Outgoing Call] Failed:", e?.message || e);
//   }
// };

// // const handleIncomingCall = async (offer) => {
// //   try {
// //     await ensurePeerConnection();
    
// //     // Use the video state from the offer
// //     const isVideo = offer.isVideoCall || false;
// //     setIsVideoCall(isVideo);
    
// //     // For video calls, we need to request video permissions and get video stream
// //     if (isVideo) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access camera.");
// //         // Fall back to audio only
// //         const ok = await ensureLocalStreamAndAttach(false);
// //         if (!ok || !pc.current) return;
// //       } else {
// //         // Get stream with video
// //         try {
// //           const s = await mediaDevices.getUserMedia({
// //             audio: true,
// //             video: { facingMode: "user" }
// //           });
// //           localStream.current = s;
// //           setLocalURL(s.toURL());
// //         } catch (e) {
// //           console.error("[Video] Failed to get video stream:", e);
// //           // Fall back to audio only
// //           const ok = await ensureLocalStreamAndAttach(false);
// //           if (!ok || !pc.current) return;
// //         }
// //       }
// //     } else {
// //       // Audio only call
// //       const ok = await ensureLocalStreamAndAttach(false);
// //       if (!ok || !pc.current) return;
// //     }

// //     // Attach tracks to peer connection if not already attached
// //     if (pc.current && localStream.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }

// //     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //     await drainQueuedCandidates();

// //     const answer = await pc.current.createAnswer();
// //     await pc.current.setLocalDescription(answer);
    
// //     sendMessage({ 
// //       type: "answer", 
// //       answer,
// //       isVideoCall: isVideo,
// //     });

// //     setWebrtcReady(true);
// //     setShowIncomingModal(false);
// //     setIncomingSDP(null);
    
// //   } catch (error) {
// //     console.error("Error handling incoming call:", error?.message || error);
// //     Alert.alert("Error", "Failed to accept call");
// //   }
// // };

// const handleIncomingCall = async (offer) => {
//   try {
//   const newCallId = `call_${Date.now()}_${offer.callerId || 'unknown'}`;
//     setCurrentCallId(newCallId);
//     console.log("[Incoming Call] Raw offer:", JSON.stringify(offer, null, 2));
    
//     // VALIDATE the offer has required fields
//     if (!offer || !offer.sdp) {
//       console.error("[Incoming Call] Invalid offer - missing SDP");
//       Alert.alert("Error", "Invalid call offer. Please try again.");
//       rejectCall();
//       return;
//     }
    
//     await ensurePeerConnection();
    
//     const isVideo = offer.isVideoCall || false;
//     setIsVideoCall(isVideo);
    
//     // For video calls, request permissions
//     if (isVideo) {
//       const hasPermission = await requestPermissions();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access camera. Switching to audio only.");
//         // Fall back to audio only
//         const ok = await ensureLocalStreamAndAttach(false);
//         if (!ok || !pc.current) {
//           rejectCall();
//           return;
//         }
//       } else {
//         try {
//           const s = await mediaDevices.getUserMedia({
//             audio: true,
//             video: { facingMode: "user" }
//           });
//           localStream.current = s;
//           setLocalURL(s.toURL());
//         } catch (e) {
//           console.error("[Video] Failed to get video stream:", e);
//           // Fall back to audio only
//           const ok = await ensureLocalStreamAndAttach(false);
//           if (!ok || !pc.current) {
//             rejectCall();
//             return;
//           }
//         }
//       }
//     } else {
//       // Audio only call
//       const ok = await ensureLocalStreamAndAttach(false);
//       if (!ok || !pc.current) {
//         rejectCall();
//         return;
//       }
//     }

//     // Attach tracks to peer connection
//     if (pc.current && localStream.current) {
//       const existingTracks = pc.current.getSenders().map((s) => s.track);
//       localStream.current.getTracks().forEach((track) => {
//         if (!existingTracks.includes(track)) {
//           pc.current.addTrack(track, localStream.current);
//         }
//       });
//     }

//     // FIX: Ensure offer has proper type
//     const remoteDesc = new RTCSessionDescription({
//       type: 'offer',
//       sdp: offer.sdp
//     });
    
//     console.log("[Incoming Call] Setting remote description:", remoteDesc.type);
//     await pc.current.setRemoteDescription(remoteDesc);
//     await drainQueuedCandidates();

//     const answer = await pc.current.createAnswer();
//     console.log("[Incoming Call] Created answer:", answer.type);
//     await pc.current.setLocalDescription(answer);
    
//     sendMessage({ 
//       type: "answer", 
//       answer: {
//         type: answer.type,
//         sdp: answer.sdp
//       },
//       isVideoCall: isVideo,
//     });

//     setWebrtcReady(true);
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
    
//     console.log("[Incoming Call] Call accepted successfully");
    
//   } catch (error) {
//     console.error("[Incoming Call] Error:", error?.message || error);
//     Alert.alert("Error", "Failed to accept call: " + (error?.message || "Unknown error"));
//     rejectCall();
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

// // const acceptCall = async () => {
// //   console.log("[Action] Accept call initiated. incomingSDP:", !!incomingSDP, "incomingOffer:", !!incomingOffer);
// //   stopRinging();
// //   isCallerRef.current = false;
// //   const offer = incomingSDP || incomingOffer;
// //   if (!offer) {
// //     Alert.alert("No offer", "No incoming offer to accept.");
// //     return;
// //   }
  
// //   // Start audio session before handling the call
// //   startAudioSession();
  
// //   // Store whether this is a video call
// //   const isVideo = offer.isVideoCall || false;
  
// //   await handleIncomingCall(offer);
// // };

// const acceptCall = async () => {
//   console.log("[Action] Accept call initiated. incomingSDP:", !!incomingSDP, "incomingOffer:", !!incomingOffer);
//   stopRinging();
//   isCallerRef.current = false;
  
//   // Use the stored SDP
//   const offer = incomingSDP;
//   if (!offer) {
//     Alert.alert("No offer", "No incoming offer to accept.");
//     return;
//   }
  
//   // Make sure the offer has SDP
//   if (!offer.sdp) {
//     console.error("[Accept Call] Offer has no SDP!");
//     Alert.alert("Error", "Invalid call offer. Please try again.");
//     rejectCall();
//     return;
//   }
  
//   console.log("[Accept Call] Offer has SDP length:", offer.sdp.length);
  
//   // Start audio session before rrrhandling the call
//   startAudioSession();
  
//   await handleIncomingCall(offer);
// };

// // const startCall = async (video = false) => {
// //   setIsVideoCall(video);
// //   isCallerRef.current = true;
// //   setCallStatus("outgoing");
  
// //   // Start audio session and show local preview immediately
// //   startAudioSession();
  
// //   if (video) {
// //     await ensureLocalStreamAndAttach(true);
// //   }
  
// //   await createAndSendInitialOffer();
// // };

// // const startCall = async (video = false) => {
// //   console.log("[Call] Starting call, video:", video);
// //   setIsVideoCall(video);
// //   isCallerRef.current = true;

// //   // Generate call ID for outgoing call
// //   const newCallId = `call_${Date.now()}_${targetUserId}`;
// //   setCurrentCallId(newCallId);
  
// //   // Get user data first to ensure we have currentUserId
// //   const userDataRaw = await AsyncStorage.getItem("userData");
// //   const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //   const currentUserId = userData?.id;
  
// //   if (!currentUserId) {
// //     console.error("[Call] No current user ID found!");
// //     Alert.alert("Error", "Unable to start call. Please restart the app.");
// //     return;
// //   }
  
// //   // Start audio session
// //   startAudioSession();
  
// //   // Ensure WebSocket is connected before proceeding
// //   if (!wsConnected) {
// //     console.log("[Call] Waiting for WebSocket connection...");
// //     // Wait for WebSocket to connect
// //     const waitForWs = setInterval(() => {
// //       if (wsConnected) {
// //         clearInterval(waitForWs);
// //         console.log("[Call] WebSocket connected, creating offer");
// //         createAndSendInitialOffer();
// //       }
// //     }, 100);
// //     return;
// //   }
  
// //   if (video) {
// //     await ensureLocalStreamAndAttach(true);
// //   }
  
// //   await createAndSendInitialOffer();
// // };

// const startCall = async (video = false) => {
//   console.log("[Call] Starting call, video:", video);
//   setIsVideoCall(video);
//   isCallerRef.current = true;

//   // Generate call ID for outgoing call
//   const newCallId = `call_${Date.now()}_${targetUserId}`;
//   updateCallId(newCallId);
  
//   // Get user data first to ensure we have currentUserId
//   const userDataRaw = await AsyncStorage.getItem("userData");
//   const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//   const currentUserId = userData?.id;
  
//   if (!currentUserId) {
//     console.error("[Call] No current user ID found!");
//     Alert.alert("Error", "Unable to start call. Please restart the app.");
//     return;
//   }
  
//   // Start audio session
//   startAudioSession();
  
//   // Ensure WebSocket is connected before proceeding
//   if (!wsConnected) {
//     console.log("[Call] Waiting for WebSocket connection...");
//     // Wait for WebSocket to connect
//     const waitForWs = setInterval(() => {
//       if (wsConnected) {
//         clearInterval(waitForWs);
//         console.log("[Call] WebSocket connectdded, creating offer");
//         createAndSendInitialOffer();
//       }
//     }, 100);
//     return;
//   }
  
//   if (video) {
//     await ensureLocalStreamAndAttach(true);
//   }
  
//   // CRITICAL: Actually call the function to send thfffdde offer
//   await createAndSendInitialOffer();
// };


// // const endCall = (notify = true) => {
// //   isCallActiveRef.current = false;
// //   try { if (notify) sendMessage({ type: "call-ended" }); } catch(e){}
// //   try {
// //     if (ws.current) {
// //       ws.current.onopen = null;
// //       ws.current.onmessage = null;
// //       ws.current.onclose = null;
// //       ws.current.onerror = null;
// //       ws.current.close();
// //       console.log('user_data_ending_call',ws.current);
// //     }
// //   } catch (e) { console.warn("[endCall] error closing ws", e); }
// //   ws.current = null;

// //   stopAudioSession();
// //   cleanupPeerConnection();
// //   navigation.navigate("PHome");
// // };

// // const endCall = async (notify = true) => {
// //   isCallActiveRef.current = false;
  
// //   // Prepare call details for history
// //   const callDetails = {
// //     contact: {
// //       name: name,
// //       profileImage: profile_image,
// //       userId: targetUserId
// //     },
// //     direction: isInitiator ? 'outgoing' : 'incoming',
// //     isVideoCall: isVideoCall,
// //     status: webrtcReady ? 'ended' : 'missed',
// //     duration: callDuration
// //   };
  
// //   // Save to call history
// //   await saveCallToHistory(callDetails);
  
// //   try { 
// //     if (notify) sendMessage({ type: "call-ended" }); 
// //   } catch(e){}
  
// //   try {
// //     if (ws.current) {
// //       ws.current.onopen = null;
// //       ws.current.onmessage = null;
// //       ws.current.onclose = null;
// //       ws.current.onerror = null;
// //       ws.current.close();
// //       console.log('user_data_ending_call',ws.current);
// //     }
// //   } catch (e) { console.warn("[endCall] error closing ws", e); }
// //   ws.current = null;

// //   stopAudioSession();
// //   cleanupPeerConnection();
// //   navigation.navigate("PHome");
// // };

// // const endCall = async (notify = true) => {
// //     stopRinging();
// //   isCallActiveRef.current = false;


// //   const callDetails = {
// //     contact: {
// //       name: name || 'Unknown',
// //       profileImage: profile_image || '',
// //       userId: targetUserId || 'unknown'
// //     },
// //     direction: isInitiator ? 'outgoing' : 'incoming',
// //     isVideoCall: isVideoCall || false,
// //     status: webrtcReady ? 'ended' : 'missed',
// //     duration: callDuration || 0
// //   };
  
// //   try { 
  
// //     if (notify) sendMessage({ type: "call-ended" }); 
// //   } catch(e){}
  
// //   try {
// //     if (ws.current) {
// //       ws.current.onopen = null;
// //       ws.current.onmessage = null;
// //       ws.current.onclose = null;
// //       ws.current.onerror = null;
// //       ws.current.close();
// //     }
// //   } catch (e) { console.warn("[endCall] error closing ws", e); }
// //   ws.current = null;

// //   stopAudioSession();
// //   cleanupPeerConnection();
  
// //   // Save to call history AFTER cleanup but BEFORE navigation
// //   await saveCallToHistory(callDetails);
  
// //   navigation.navigate("PHome");
// // };

// const endCall = async (notify = true) => {
//   console.log("[Call] Ending call...");
  
//   stopRinging();
//   isCallActiveRef.current = false;

//   const callDetails = {
//     contact: {
//       name: name || 'Unknown',
//       profileImage: profile_image || '',
//       userId: targetUserId || 'unknown'
//     },
//     direction: isInitiator ? 'outgoing' : 'incoming',
//     isVideoCall: isVideoCall || false,
//     status: webrtcReady ? 'ended' : 'missed',
//     duration: callDuration || 0
//   };
//   if (currentCallIdRef.current) {
//     try {
//       CallKeepService.endCall(currentCallIdRef.current);
//     } catch (e) {
//       console.warn("[CallKeep] Error ending call:", e);
//     }
//   }
  
//   // End call in CallKeepf
//   if (currentCallId) {
//     try {
//       CallKeepService.endCall(currentCallId);
//     } catch (e) {
//       console.warn("[CallKeep] Error ending call:", e);
//     }
//   }
  
//   // Notify other participant
//   if (notify) {
//     try {
//       sendMessage({ type: "call-ended" });
//     } catch(e) {
//       console.warn("[Call] Error sending end message:", e);
//     }
//   }
  
//   // Close WebSocket
//   try {
//     if (ws.current) {
//       ws.current.onopen = null;
//       ws.current.onmessage = null;
//       ws.current.onclose = null;
//       ws.current.onerror = null;
//       ws.current.close();
//     }
//   } catch (e) { 
//     console.warn("[Call] error closing ws", e); 
//   }
//   ws.current = null;

//   // Stop audio
//   try {
//     InCallManager.stop();
//     InCallManager.stopRingtone();
//   } catch (e) {
//     console.warn("[Call] error stopping audio:", e);
//   }
  
//   // Cleanup peer connection
//   cleanupPeerConnection();
  
//   // Reset call ID
//   setCurrentCallId(null);
  
//   // Save call history
//   await saveCallToHistory(callDetails);
  
//   // Navigate back
//   if (navigation.canGoBack()) {
//     navigation.goBack();
//   } else {
//     navigation.navigate("PHome");
//   }
// };


//   // const rejectCall = () => {
//   //   sendMdessage({ type: "call-ended" });
//   //   setShowIncomingModal(false);
//   //   setIncomingSDP(null);
//   // };

//   const rejectCall = async () => {
//     stopRinging();
//   sendMessage({ type: "call-rejected" });
  
//   // Save as missed call for the recipient
//   await saveCallToHistory({
//     contact: { name, profileImage: profile_image, userId: targetUserId },
//     direction: 'incoming',
//     isVideoCall: isVideoCall,
//     status: 'rejected',
//     duration: 0
//   });
  
//   setShowIncomingModal(false);
//   setIncomingSDP(null);
//   navigation.navigate("PHome");
// };

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

//   // ================ UI ================
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle={Platform.OS === 'android'? 'light-content': 'dark-content'}/>

//       {webrtcReady ? (
       
       
//         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
//           {isVideoCall && remoteURL ? (
//             <View style={styles.videoContainer}>
//               <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
              
//               {/* Call info overlay */}
//               <View style={styles.callInfoOverlay}>
//                 <Text style={styles.callerName}>{name}</Text> 
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

//             {isVideoCall && (

//               <TouchableOpacity 
//               style={styles.controlButton} 
//               // onPress={isVideoCall ? () => switchToVideoCall()  : () => setIsVideoCall(false)}
//               onPress={switchToVideoCall}
//             >
//               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//                 <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>{isVideoCall ? "Video off" : "Video"}</Text>
//             </TouchableOpacity>

//             )}
            
//             {/* <TouchableOpacity 
//   style={styles.controlButton} 
//   onPress={() => {
//     // Add detailed console logging here
//     console.log("========== VIDEO TOGGLE PRESSED ==========");
//     console.log("Current isVideoCall state:", isVideoCall);
//     console.log("Current call duration:", callDuration);
//     console.log("WebRTC ready state:", webrtcReady);
//     console.log("Local stream exists:", !!localStream.current);
//     console.log("Remote stream exists:", !!remoteStream.current);
//     console.log("PC exists:", !!pc.current);
//     console.log("Is initiator:", isInitiator);
//     console.log("Target user ID:", targetUserId);
    
//     if (localStream.current) {
//       console.log("Local audio tracks:", localStream.current.getAudioTracks().length);
//       console.log("Local video tracks:", localStream.current.getVideoTracks().length);
//     }
    
//     if (remoteStream.current) {
//       console.log("Remote audio tracks:", remoteStream.current.getAudioTracks().length);
//       console.log("Remote video tracks:", remoteStream.current.getVideoTracks().length);
//     }
    
//     console.log("Action to perform:", isVideoCall ? "Turning video OFF" : "Turning video ON");
    
//     // Now call your existing function
//     if (isVideoCall) {
//       console.log("Switching to audio-only call");
//       setIsVideoCall(false);
//       // Note: You might want to also update the UI to show audio-only mode
//       // and possibly renegotiate the connection to remove video
//     } else {
//       console.log("Switching to video call");
//       switchToVideoCall();
//     }
//     console.log("==========================================");
//   }}
// >
//   <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//     <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
//   </View>
//   <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video"}</Text>
// </TouchableOpacity> */}
//           </View>
//         </LinearGradient>
//       ) : (
        
//         <ImageBackground 
//             source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` || require("../assets/images/avatar/blank-profile-picture-973460_1280.png")}} 
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
//                     onPress={() => endCall(true)}
//                     disabled={wsConnected ? false : true}
//                   >
//                     <View style={{
//                       width: 70,
//                       height: 70,
//                       borderRadius: 35,
//                       backgroundColor: wsConnected ? "#ef0505ff" : "#718096",
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginBottom: 10
//                     }}>
//                       <Icon name="call" size={30} color="white" />
//                     </View>
//                     <Text style={{
//                       color: 'white',
//                       fontSize: 14
//                     }}>End Call</Text>
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


import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PanResponder,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Modal,
  Vibration,
  StatusBar,
  ImageBackground,
  NativeModules,
  Dimensions,
  BackHandler
} from "react-native";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  RTCView,
} from "react-native-webrtc";
import { SafeAreaView } from "react-native-safe-area-context";
import { encode as btoa } from "base-64";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Image } from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTE_IMAGE } from "../api_routing/api";
import InCallManager from "react-native-incall-manager";
import CallKeepService from '../src/services/CallKeepService';
import { useBackHandler } from '../src/hooks/useBackHandler';

const SIGNALING_SERVER = "wss://api.showapp.ng";

export default function VoiceVideoCallScreen({ navigation, route }) {
    useBackHandler(navigation, 'BroadcastHome');
  const {
    profile_image,
    name,
    incomingOffer,
    isIncomingCall,
    targetUserId,
    isInitiator,
    autoAnswerOnOffer, // ← NEW: from notification accept
  } = route.params || {};

  // --- refs
  const ws = useRef(null);
  const pc = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const queuedRemoteCandidates = useRef([]);
  const rtcConfig = useRef({ iceServers: [] }).current;
  const isCallerRef = useRef(false);
  const currentCallIdRef = useRef(null);
  const callTimerRef = useRef(null);
  const hasInitialOfferRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  const isCallActiveRef = useRef(true);
  const autoAnswerOnOfferRef = useRef(autoAnswerOnOffer || false); 
  const hasSwitchedToVideoRef = useRef(false);
  // --- state
  const [wsConnected, setWsConnected] = useState(false);
  const [webrtcReady, setWebrtcReady] = useState(false);
  const [localURL, setLocalURL] = useState(null);
  const [remoteURL, setRemoteURL] = useState(null);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [incomingSDP, setIncomingSDP] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isCameraFront, setIsCameraFront] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
  getIceServers(); // fire-and-forget, so accept never blocks on this network call
}, []);


  useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (webrtcReady) {
      // Show confirmation dialog
      Alert.alert(
        'End Call?',
        'Are you sure you want to end this call?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'End Call', 
            style: 'destructive', 
            onPress: () => endCall(true) 
          }
        ]
      );
      return true; // Prevent default back behavior
    } else if (showIncomingModal) {
      rejectCall();
      return true;
    }
    return false; // Allow default back behavior
  });

  return () => backHandler.remove();
}, [webrtcReady, showIncomingModal, endCall, rejectCall]);


  useEffect(() => {
    console.log("Profile image path:", profile_image);
    console.log("Full URL:", `${API_ROUTE_IMAGE}${profile_image}`);
  }, [profile_image]);

  const pipPosition = useRef({ x: 16, y: Platform.OS === 'ios' ? 100 : 70 });
const pipSize = useRef({ width: 100, height: 140 });
const isDragging = useRef(false);
const [pipVisible, setPipVisible] = useState(true);
const [pipPositionState, setPipPositionState] = useState({ 
  x: 16, 
  y: Platform.OS === 'ios' ? 100 : 70 
});

// Add this function to handle PiP drag
const handlePipDrag = (event) => {
  const { pageX, pageY } = event.nativeEvent;
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Keep PiP within screen bounds
  const newX = Math.max(0, Math.min(pageX - pipSize.current.width / 2, screenWidth - pipSize.current.width));
  const newY = Math.max(50, Math.min(pageY - pipSize.current.height / 2, screenHeight - 200));
  
  pipPosition.current = { x: newX, y: newY };
  setPipPositionState({ x: newX, y: newY });
};

// Toggle PiP visibility
const togglePipVisibility = () => {
  setPipVisible(!pipVisible);
};



useEffect(() => {
  if (isVideoCall && webrtcReady && pc.current && !hasSwitchedToVideoRef.current) {
    hasSwitchedToVideoRef.current = true;
    switchToVideoCall();
  }
  
  // Reset the flag when call ends
  if (!webrtcReady) {
    hasSwitchedToVideoRef.current = false;
  }
  
  return () => {
    hasSwitchedToVideoRef.current = false;
  };
}, [isVideoCall, webrtcReady]);

  const updateCallId = (id) => {
    currentCallIdRef.current = id;
    setCurrentCallId(id);
  };

  // ─── CallKeep callbacks ──────────────────────────────────────

// const acceptCallWithCallKeep = useCallback(async () => {
  
//   InCallManager.stopRingtone(); 
//   Vibration.cancel();
//   setIsRinging(false);
//   setShowIncomingModal(false);
//   stopRinging();
//   isCallerRef.current = false
//   const offer = incomingSDP || incomingOffer;
//   if (!offer) {
//     console.error('[CallKeep] No offer to accept');
//     return;
//   }
//   await handleIncomingCall(offer);
//   if (currentCallIdRef.current) {
//     await CallKeepService.setCallConnected(currentCallIdRef.current);
//   }
// }, [incomingSDP, incomingOffer]);

const acceptCallWithCallKeep = useCallback(async () => {

  stopRinging();

  setShowIncomingModal(false);

  isCallerRef.current = false;

  const offer = incomingSDP || incomingOffer;

  if (!offer) {
    console.error("No offer");
    return;
  }

  await handleIncomingCall(offer);

  if (currentCallIdRef.current) {
    await CallKeepService.setCallConnected(currentCallIdRef.current);
  }

}, [incomingSDP, incomingOffer]);

 const startCallWithCallKeep = useCallback(async (phoneNumber, callUUID) => {
  console.log('[CallKeep] Starting call with:', phoneNumber, callUUID);
  setIsVideoCall(false);
  isCallerRef.current = true;
  startAudioSession();
  await createAndSendInitialOffer();
  if (callUUID) {
    await CallKeepService.setCallConnected(callUUID);
  }
}, []);

  // ─── CallKeep listeners ──────────────────────────────────────

  // ─── CallKeep listeners ──────────────────────────────────────
// Uses refs to avoid stale closures — all functions stored in refs
const endCallRef = useRef(null);
const acceptCallWithCallKeepRef = useRef(null);
const startCallWithCallKeepRef = useRef(null);

// Keep refs updated whenever functions change
useEffect(() => {
  endCallRef.current = endCall;
}, [endCall]);

useEffect(() => {
  acceptCallWithCallKeepRef.current = acceptCallWithCallKeep;
}, [acceptCallWithCallKeep]);

useEffect(() => {
  startCallWithCallKeepRef.current = startCallWithCallKeep;
}, [startCallWithCallKeep]);


 useEffect(() => {
  let mounted = true;

  const setupCallKeepListeners = async () => {
    const initialized = await CallKeepService.initialize();
    if (!mounted || !initialized) {
      console.log('[CallKeep] Init failed or unmounted');
      return;
    }

    console.log('[CallKeep] Registering listeners...');

    // Use stable wrapper functions that call the ref
    // This prevents "undefined" errors from stale closures
    const onAnswerCall = (payload) => {
      console.log('[CallKeep] answerCall:', payload);
      if (!mounted) return;
      if (typeof acceptCallWithCallKeepRef.current === 'function') {
        acceptCallWithCallKeepRef.current();
      } else {
        console.warn('[CallKeep] acceptCallWithCallKeep not ready');
      }
    };

    const onEndCall = (payload) => {
      console.log('[CallKeep] endCall:', payload);
      if (!mounted) return;
      if (typeof endCallRef.current === 'function') {
        endCallRef.current(true);
      } else {
        console.warn('[CallKeep] endCall not ready');
      }
    };

    const onStartCall = (payload) => {
      console.log('[CallKeep] startCall:', payload);
      if (!mounted) return;
      const { handle, callUUID } = payload || {};
      if (!handle) return;
      if (typeof startCallWithCallKeepRef.current === 'function') {
        startCallWithCallKeepRef.current(handle, callUUID);
      }
    };

    const onDidActivateAudio = () => {
      if (!mounted) return;
      InCallManager.start({ media: 'audio' });
    };

    const onDidDeactivateAudio = () => {
      if (!mounted) return;
      InCallManager.stop();
    };

    // Verify all handlers are functions before registering
    const handlers = { onAnswerCall, onEndCall, onStartCall, onDidActivateAudio, onDidDeactivateAudio };
    const allValid = Object.entries(handlers).every(([key, fn]) => {
      if (typeof fn !== 'function') {
        console.error(`[CallKeep] Handler ${key} is not a function:`, typeof fn);
        return false;
      }
      return true;
    });

    if (!allValid) {
      console.error('[CallKeep] Some handlers invalid, skipping registration');
      return;
    }

    CallKeepService.addEventListener('answerCall', onAnswerCall);
    CallKeepService.addEventListener('endCall', onEndCall);
    CallKeepService.addEventListener('startCall', onStartCall);
    CallKeepService.addEventListener('didActivateAudioSession', onDidActivateAudio);
    CallKeepService.addEventListener('didDeactivateAudioSession', onDidDeactivateAudio);

    // In VodddiceVideoCallScreen setupCallKeepListeners — change 'startCall' to 'didReceiveStartCallAction'
//CallKeepService.addEventListener('didReceiveStartCallAction', onStartCall);

    console.log('[CallKeep] All listeners registered ✅');
  };

  // Small delay to ensure all functions are defined and mounted
  const timer = setTimeout(() => {
    setupCallKeepListeners();
  }, 100);

  return () => {
    mounted = false;
    clearTimeout(timer);
    CallKeepService.removeAllListeners();
  };
}, []); // empty deps — stable via refs
  // ─── Audio / screen lifecycle ────────────────────────────────

  // useEffect(() => {
  //   global.__onCallScreen = true;
  //   return () => {
  //     global.__onCallScreen = false;
  //     InCallManager.stopRingtone();
  //     InCallManager.stop({ busytone: '_BUNDLE_' });
  //   };
  // }, []);

  // useEffect(() => {
  //   InCallManager.stopRingtone();
  //   Vibration.cancel();
  //   InCallManager.start({ media: 'audio' });
  //   return () => {
  //     InCallManager.stop();
  //     InCallManager.stopRingtone();
  //     Vibration.cancel();
  //   };
  // }, []);

  // useEffect(() => {
  //   InCallManager.setKeepScreenOn(true);
  //   InCallManager.setForceSpeakerphoneOn(false);
  //   return () => {
  //     InCallManager.stop();
  //     InCallManager.setKeepScreenOn(false);
  //     stopRinging();
  //   };
  // }, []);

  useEffect(() => {
  global.__onCallScreen = true;
  InCallManager.stopRingtone();
  Vibration.cancel();
  InCallManager.setKeepScreenOn(true);
  InCallManager.setForceSpeakerphoneOn(false);

  return () => {
    global.__onCallScreen = false;
    InCallManager.stopRingtone();
    Vibration.cancel();
    InCallManager.stop({ busytone: '_BUNDLE_' });
    InCallManager.setKeepScreenOn(false);
  };
}, []);

  // useEffect(() => {
  //   if (showIncomingModal) {
  //     startRinging();
  //   } else {
  //     stopRinging();
  //   }
  //   return () => stopRinging();
  // }, [showIncomingModal]);

  useEffect(() => {
  if (showIncomingModal && !webrtcReady) {
    startRinging();
  } else {
    stopRinging();
  }
  return () => stopRinging();
}, [showIncomingModal, webrtcReady]);

  const startRinging = () => {
    setIsRinging(true);
    InCallManager.startRingtone();
  };

  // const stopRinging = () => {
  //   setIsRinging(false);
  //   InCallManager.stopRingtone();
  // };

// const stopRinging = useCallback(() => {
//   setIsRinging(false);
//   Vibration.cancel();
//   InCallManager.stopRingtone();
//   // Force-stop the entire audio session on Android 14/15 then restart in call mode
//   if (Platform.OS === 'android') {
//     InCallManager.stop();
//     setTimeout(() => {
//       if (isCallActiveRef.current) {
//         InCallManager.start({ media: 'audio' });
//         InCallManager.setSpeakerphoneOn(isSpeakerOn);
//       }
//     }, 300);
//   }
// }, [isSpeakerOn]);

const stopRinging = useCallback(() => {
  setIsRinging(false);
  Vibration.cancel();

  InCallManager.stopRingtone();

  if (Platform.OS === 'android') {
    InCallManager.stop();
  }
}, []);

  // ─── Permissions ─────────────────────────────────────────────

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
        return (
          grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  // ─── ICE servers ─────────────────────────────────────────────

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
      if (data?.v?.iceServers) {
        const server = data.v.iceServers;
        const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
        iceServers = [{ urls, username: server.username, credential: server.credential }];
      }
      if (!iceServers.length) throw new Error("No ICE servers");
      iceServers.push({ urls: "stun:stun.l.google.com:19302" });
      rtcConfig.iceServers = iceServers;
    } catch (err) {
      rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
    }
    rtcConfig.iceTransportPolicy = "all";
  };

  // ─── Peer connection ─────────────────────────────────────────

  const ensurePeerConnection = async () => {
    if (pc.current) return;
    if (!rtcConfig.iceServers.length) await getIceServers();

    pc.current = new RTCPeerConnection(rtcConfig);

    pc.current.onicecandidate = (evt) => {
      if (evt.candidate) {
        sendMessage({ type: "candidate", candidate: evt.candidate });
      }
    };

    // pc.current.ontrack = (evt) => {
    //   if (evt.streams && evt.streams[0]) {
    //     remoteStream.current = evt.streams[0];
    //     try { setRemoteURL(remoteStream.current.toURL()); } catch {}
    //     setWebrtcReady(true);
    //     InCallManager.start({ media: 'audio' });
    //     InCallManager.setSpeakerphoneOn(isSpeakerOn);
    //     const videoTracks = remoteStream.current.getVideoTracks();
    //     if (videoTracks.length > 0) setIsVideoCall(true);
    //   }
    // };

//     pc.current.ontrack = (evt) => {
//   if (evt.streams && evt.streams[0]) {
//     // STOP RINGING FIRST — critical for Android 14/15
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//     setIsRinging(false);

//     remoteStream.current = evt.streams[0];
//     try { setRemoteURL(remoteStream.current.toURL()); } catch {}
//     setWebrtcReady(true);

//     // Small delay on Android ensures ringtone session fully closes first
//     setTimeout(() => {
//       InCallManager.start({ media: 'audio' });
//       InCallManager.setSpeakerphoneOn(isSpeakerOn);
//     }, Platform.OS === 'android' ? 400 : 0);

//     const videoTracks = remoteStream.current.getVideoTracks();
//     if (videoTracks.length > 0) {
//     setIsVideoCall(true);

//     // Automatically enable our camera if it isn't already
//     if (
//         !localStream.current ||
//         localStream.current.getVideoTracks().length === 0
//     ) {
//         switchToVideoCall();
//     }
// }
//   }
// };

pc.current.ontrack = (evt) => {
  if (evt.streams && evt.streams[0]) {
    InCallManager.stopRingtone();
    Vibration.cancel();
    setIsRinging(false);

    remoteStream.current = evt.streams[0];
    try { setRemoteURL(remoteStream.current.toURL()); } catch {}
    setWebrtcReady(true);

    // Only Android needs a beat for the ringtone session to release;
    // skip the delay entirely if we were never ringing.
    const delay = Platform.OS === 'android' && isRinging ? 150 : 0;
    setTimeout(() => {
      InCallManager.start({ media: 'audio' });
      InCallManager.setSpeakerphoneOn(isSpeakerOn);
    }, delay);

    const videoTracks = remoteStream.current.getVideoTracks();
    if (videoTracks.length > 0) {
      setIsVideoCall(true);
      if (!localStream.current || localStream.current.getVideoTracks().length === 0) {
        switchToVideoCall();
      }
    }
  }
};

    pc.current.onconnectionstatechange = async () => {
      if (!pc.current) return;
      const state = pc.current.connectionState;
      console.log("[WebRTC] connectionState =>", state);
      if (state === "failed") {
        saveCallToHistory({
          contact: { name, profileImage: profile_image, userId: targetUserId },
          direction: isInitiator ? 'outgoing' : 'incoming',
          isVideoCall,
          status: 'failed',
          duration: callDuration,
        });
      }
    };

    pc.current.oniceconnectionstatechange = () => {
      if (!pc.current) return;
      console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
    };
  };

  const ensureLocalStreamAndAttach = async (videoEnabled = false) => {
    if (!localStream.current) {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert("Permission denied", "Cannot access microphone or camera.");
        return false;
      }
      try {
        const s = await mediaDevices.getUserMedia({
          audio: true,
          video: videoEnabled ? { facingMode: isCameraFront ? "user" : "environment" } : false,
        });
        localStream.current = s;
        try { setLocalURL(s.toURL()); } catch {}
      } catch (e) {
        Alert.alert("Error", "Failed to get local stream: " + e.message);
        return false;
      }
    }
    if (pc.current) {
      const existingTracks = pc.current.getSenders().map((s) => s.track);
      localStream.current.getTracks().forEach((track) => {
        if (!existingTracks.includes(track)) {
          pc.current.addTrack(track, localStream.current);
        }
      });
    }
    return true;
  };

  const drainQueuedCandidates = async () => {
    if (!pc.current) return;
    while (queuedRemoteCandidates.current.length > 0) {
      const c = queuedRemoteCandidates.current.shift();
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(c));
      } catch (err) {
        console.warn("[WebRTC] addIceCandidate error:", err?.message);
      }
    }
  };

  const cleanupPeerConnection = () => {
    isCleaningUpRef.current = true;
    isCallActiveRef.current = false;
    try {
      if (pc.current) {
        pc.current.onicecandidate = null;
        pc.current.ontrack = null;
        pc.current.onnegotiationneeded = null;
        pc.current.onconnectionstatechange = null;
        pc.current.oniceconnectionstatechange = null;
        pc.current.close();
      }
    } catch (e) {}
    pc.current = null;
    try {
      if (localStream.current) {
        localStream.current.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {}
    localStream.current = null;
    remoteStream.current = null;
    queuedRemoteCandidates.current = [];
    hasInitialOfferRef.current = false;
    try { InCallManager.stop(); } catch {}
    setLocalURL(null);
    setRemoteURL(null);
    setWebrtcReady(false);
    setIsVideoCall(false);
    setIsMuted(false);
    setIsSpeakerOn(false);
    isCleaningUpRef.current = false;
  };

  // ─── Signaling ───────────────────────────────────────────────

  // const sendMessage = (msg) => {
  //   if (ws.current?.readyState === WebSocket.OPEN) {
  //     ws.current.send(JSON.stringify(msg));
  //   }
  // };

  const sendMessage = (msg) => {
    console.log("\n========== SEND MESSAGE ==========");
    console.log("WebSocket readyState:", ws.current?.readyState);
    console.log("WebSocket OPEN:", ws.current?.readyState === WebSocket.OPEN);
    
    if (ws.current?.readyState === WebSocket.OPEN) {
        const messageStr = JSON.stringify(msg);
        console.log("Message type:", msg.type);
        console.log("Message size:", messageStr.length, "bytes");
        
        // Check if this is a call message with offer
        if (msg.type === 'new_call' && msg.offer) {
            console.log("📞 CALL MESSAGE with OFFER");
            console.log("  - Offer SDP exists:", !!msg.offer.sdp);
            console.log("  - Offer SDP length:", msg.offer.sdp?.length || 0);
            console.log("  - Offer type:", msg.offer.type);
        }
        
        ws.current.send(messageStr);
        console.log("✅ Message sent successfully");
    } else {
        console.error("❌ Cannot send, WebSocket state:", ws.current?.readyState);
        console.error("Expected OPEN state:", WebSocket.OPEN);
    }
    console.log("===============================\n");
};

  const connectSignaling = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const userDataRaw = await AsyncStorage.getItem("userData");
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    const currentUserId = userData?.id;

    let roomId;

    if (isInitiator && targetUserId) {
      // Outgoing call — connect to target's room
      roomId = `user-${targetUserId}`;
    } else if (autoAnswerOnOffer && targetUserId) {
      // ← NEW: accepted from notification — connect to OUR room to receive offer
      roomId = `user-${currentUserId}`;
      console.log('[AutoAnswer] Connecting to our room:', roomId);
    } else if (currentUserId) {
      // Normal incoming — our room
      roomId = `user-${currentUserId}`;
    } else {
      roomId = "unknown";
    }

    console.log("[WebSocket] Connecting to room:", roomId);

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

    const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
    ws.current = new WebSocket(url);

    ws.current.onopen = async () => {
      console.log("[WebSocket] Connected to", roomId);
      setWsConnected(true);

      await ensurePeerConnection();
      await ensureLocalStreamAndAttach(isVideoCall);

      if (isInitiator && targetUserId) {
        isCallerRef.current = true;
        await createAndSendInitialOffer();
      }

      // Normal incoming call (not from notification)
      if (!isInitiator && isIncomingCall && incomingOffer && !autoAnswerOnOffer) {
        setIsVideoCall(incomingOffer.isVideoCall || false);
        await handleIncomingCall(incomingOffer);
      }

      // autoAnswerOnOffer: wait for offer to arrive via WebSocket
      // handled in onmessage case "offer"
    };

    ws.current.onmessage = async (evt) => {
      const wsdata = JSON.parse(evt.data);
      console.log("RAW WS MESSAGE:", wsdata);
      
      let data;
      try { data = JSON.parse(evt.data); } catch { return; }

      console.log(
  "RAW WS MESSAGEs:",
  JSON.stringify(JSON.parse(evt.data), null, 2)
);

      console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation);

      if (!isCallActiveRef.current && data?.type !== "call-ended") {
        console.warn("[WS] Ignoring message after call ended:", data?.type);
        return;
      }

      switch (data.type) {

        case "offer": {
          if (data.isRenegotiation) {
            try {
              await ensurePeerConnection();
              await ensureLocalStreamAndAttach(isVideoCall);
            } catch (err) {
              console.error("[WebRTC] Renegotiation prep failed:", err);
              return;
            }
            await handleRenegotiationOffer(data.offer, data.isVideoCall);
            break;
          }

          // ── Regular initial offer ──
          if (isCallerRef.current) break;

          const offerData = data.offer;

          if (!offerData || !offerData.sdp) {
            console.error("[WS] Offer missing SDP:", offerData);
            break;
          }

          console.log("[WS] Valid offer received, SDP length:", offerData.sdp.length);

          if (autoAnswerOnOfferRef.current) {
            // ← NEW: User already accepted from notification — answer immediately
            console.log('[AutoAnswer] Auto-answering offer from notification accept');
            autoAnswerOnOfferRef.current = false;
            isCallerRef.current = false;
            setIsVideoCall(offerData.isVideoCall || false);
            startAudioSession();

            await handleIncomingCall(offerData);

            if (currentCallIdRef.current) {
              await CallKeepService.setCallConnected(currentCallIdRef.current);
            }
          } else {
            // Normal flow — show modal
            const incomingCallId = `call_${Date.now()}`;
            updateCallId(incomingCallId);
            setIncomingSDP(offerData);
            setIsVideoCall(offerData.isVideoCall || false);

            // Show CallKeep native UI + in-app modal
            await CallKeepService.displayIncomingCall({
              callId: incomingCallId,
              callerName: offerData.callerInfo?.name || name || 'Unknown',
              callerId: offerData.callerId || targetUserId || '',
              isVideo: offerData.isVideoCall || false,
              roomId: offerData.roomId || '',
            });

            setShowIncomingModal(true);
          }
          break;
        }

        case "answer": {
          if (!isCallerRef.current || !pc.current) break;
          if (pc.current.signalingState === "have-local-offer") {
            try {
              await pc.current.setRemoteDescription(
                new RTCSessionDescription(data.answer)
              );
              await drainQueuedCandidates();
            } catch (e) {
              console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message);
            }
          }
          break;
        }

        case "candidate": {
          if (!pc.current) break;
          if (!pc.current.remoteDescription) {
            queuedRemoteCandidates.current.push(data.candidate);
          } else {
            try {
              await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
              console.warn("[WebRTC] addIceCandidate error:", e?.message);
            }
          }
          break;
        }

        case "call-ended": {
          Alert.alert("Call Ended", "Your call partner has disconnected");
          endCall(false);
          break;
        }

        case "call-rejected": {
          Alert.alert("Call Rejected", "The recipient declined your call");
          await saveCallToHistory({
            contact: { name, profileImage: profile_image, userId: targetUserId },
            direction: 'outgoing',
            isVideoCall,
            status: 'rejected',
            duration: 0,
          });
          endCall(false);
          break;
        }

        case "call-missed": {
          if (!isInitiator) {
            await saveCallToHistory({
              contact: { name, profileImage: profile_image, userId: targetUserId },
              direction: 'incoming',
              isVideoCall,
              status: 'missed',
              duration: 0,
            });
          }
          break;
        }

        default:
          break;
      }
    };

    ws.current.onclose = () => {
      setWsConnected(false);
      if (!isCleaningUpRef.current) cleanupPeerConnection();
    };

    ws.current.onerror = (err) => {
      console.error("[WebSocket] Error:", err?.message);
    };
  };

  // ─── Renegotiation ───────────────────────────────────────────

  const handleRenegotiationOffer = async (offer, isVideo) => {
    try {
      if (!pc.current) {
        await ensurePeerConnection();
        await ensureLocalStreamAndAttach(false);
      }
      if (!pc.current || pc.current.signalingState === "closed") return;

      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      await drainQueuedCandidates();
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      sendMessage({ type: "answer", answer, isVideoCall: isVideo, isRenegotiation: true });
      setIsVideoCall(isVideo);
    } catch (error) {
      console.error("[WebRTC] Renegotiation failed:", error);
    }
  };

  // ─── Call history ─────────────────────────────────────────────

  const saveCallToHistory = async (callDetails) => {
    try {
      const existingHistory = await AsyncStorage.getItem('callHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      const newCall = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        contact: {
          name: callDetails.contact.name,
          profileImage: callDetails.contact.profileImage,
          userId: callDetails.contact.userId,
        },
        direction: callDetails.direction,
        isVideoCall: callDetails.isVideoCall,
        status: callDetails.status,
        duration: callDetails.duration || 0,
      };
      history.unshift(newCall);
      await AsyncStorage.setItem('callHistory', JSON.stringify(history.slice(0, 100)));
    } catch (error) {
      console.error('[CallHistory] Error saving call:', error);
    }
  };

  // ─── Offer / answer ───────────────────────────────────────────

  // const createAndSendInitialOffer = async () => {
  //   if (hasInitialOfferRef.current) return;
  //   await ensurePeerConnection();
  //   const ok = await ensureLocalStreamAndAttach(isVideoCall);
  //   if (!ok || !pc.current) return;

  //   try {
  //     const userDataRaw = await AsyncStorage.getItem("userData");
  //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
  //     const currentUserId = userData?.id;
  //     const callerInfo = {
  //       profileImage: userData.profile_picture || userData.profile_image || "",
  //       name: userData.name || "Caller",
  //     };

  //     const offer = await pc.current.createOffer();
  //     await pc.current.setLocalDescription(offer);

  //     sendMessage({
  //       type: "new_call",
  //       receiver_id: targetUserId,
  //       caller_name: callerInfo.name,
  //       call_type: isVideoCall ? "video" : "audio",
  //       room_id: `call_${currentUserId}_${targetUserId}`,
  //       offer: {
  //         type: offer.type,
  //         sdp: offer.sdp,
  //         targetUserId,
  //         callerInfo,
  //         isVideoCall,
  //       },
  //     });

  //     hasInitialOfferRef.current = true;
  //     console.log("[Outgoing Call] Offer sent");
  //   } catch (e) {
  //     console.error("[Outgoing Call] Failed:", e?.message);
  //   }
  // };

  const createAndSendInitialOffer = async () => {
    console.log("\n========== CREATE AND SEND INITIAL OFFER ==========");
    
    if (hasInitialOfferRef.current) {
        console.log("[Outgoing Call] Already sent offer, skipping");
        return;
    }
    
    console.log("[Outgoing Call] Step 1: Ensuring peer connection...");
    await ensurePeerConnection();
    
    console.log("[Outgoing Call] Step 2: Ensuring local stream and attach...");
    const ok = await ensureLocalStreamAndAttach(isVideoCall);
    if (!ok || !pc.current) {
        console.error("[Outgoing Call] Failed to setup peer connection or stream");
        return;
    }

    try {
        console.log("[Outgoing Call] Step 3: Getting user data...");
        const userDataRaw = await AsyncStorage.getItem("userData");
        const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
        const currentUserId = userData?.id;

        console.log("[Outgoing Call] Current User-data-raw:", userDataRaw ? userData.id : "No user data");
        
        console.log("[Outgoing Call] Current User ID:", currentUserId);
        console.log("[Outgoing Call] Target User ID:", targetUserId);
        
        // const callerInfo = {
        //     profileImage: userData.profile_picture || userData.profile_image || "",
        //     name: userData.name || "Caller",
        // };

        const profileImagePath = userData.profile_picture || userData.profile_image || "";
    
    const callerInfo = {
      profileImage: profileImagePath,  // This should be the path, not full URL
      name: userData.name || "Caller",
      userId: currentUserId,
    };
    
    console.log("[Outgoing Call] Caller Info with Image:", callerInfo);
    console.log("[Outgoing Call] Full Image URL would be:", `${API_ROUTE_IMAGE}${profileImagePath}`);
        
        console.log("[Outgoing Call] Caller Info:", callerInfo);

        console.log("[Outgoing Call] Step 4: Creating WebRTC offer...");
        const offer = await pc.current.createOffer();
        
        // LOG OFFER DETAILS
        console.log("\n========== OFFER CREATED ==========");
        console.log("Offer type:", offer.type);
        console.log("Offer SDP exists:", !!offer.sdp);
        console.log("Offer SDP length:", offer.sdp?.length || 0);
        if (offer.sdp) {
            console.log("Offer SDP preview (first 300 chars):");
            console.log(offer.sdp.substring(0, 300));
            console.log("Offer SDP last 100 chars:");
            console.log(offer.sdp.substring(offer.sdp.length - 100));
        }
        console.log("==================================\n");

        console.log("[Outgoing Call] Step 5: Setting local description...");
        await pc.current.setLocalDescription(offer);
        console.log("[Outgoing Call] Local description set successfully");

        const messageToSend = {
      type: "new_call",
      receiver_id: targetUserId,
      caller_name: callerInfo.name,
      call_type: isVideoCall ? "video" : "audio",
      room_id: `call_${currentUserId}_${targetUserId}`,
      offer: {
        type: offer.type,
        sdp: offer.sdp,
        targetUserId,
        callerInfo: {  // ✅ Make sure callerInfo is properly nested
          profileImage: profileImagePath,
          name: callerInfo.name,
          userId: currentUserId,
        },
        isVideoCall,
      },
    };

    console.log("[Outgoing Call] Sending offer with callerInfo:", messageToSend.offer.callerInfo);
    

        // const messageToSend = {
        //     type: "new_call",
        //     receiver_id: targetUserId,
        //     caller_name: callerInfo.name,
        //     call_type: isVideoCall ? "video" : "audio",
        //     room_id: `call_${currentUserId}_${targetUserId}`,
        //     offer: {
        //         type: offer.type,
        //         sdp: offer.sdp,
        //         targetUserId,
        //         callerInfo,
        //         isVideoCall,
        //     },
        // };

        console.log("\n========== MESSAGE TO SEND ==========");
        console.log("Message type:", messageToSend.type);
        console.log("Receiver ID:", messageToSend.receiver_id);
        console.log("Call type:", messageToSend.call_type);
        console.log("Room ID:", messageToSend.room_id);
        console.log("Offer in message:", !!messageToSend.offer);
        console.log("Offer SDP in message:", !!messageToSend.offer?.sdp);
        console.log("Offer SDP length in message:", messageToSend.offer?.sdp?.length || 0);
        console.log("Full message (truncated):", JSON.stringify(messageToSend, null, 2).substring(0, 1000));
        console.log("=====================================\n");

        console.log("[Outgoing Call] Step 6: Sending message via WebSocket...");
        sendMessage(messageToSend);
        
        // Verify WebSocket state
        console.log("[Outgoing Call] WebSocket readyState:", ws.current?.readyState);
        console.log("[Outgoing Call] WebSocket OPEN:", ws.current?.readyState === WebSocket.OPEN);

        hasInitialOfferRef.current = true;
        console.log("[Outgoing Call] ✅ Offer sent successfully!");
        
        
    } catch (e) {
        console.error("[Outgoing Call] ❌ Failed:", e?.message);
        console.error("[Outgoing Call] Error stack:", e?.stack);
    }
    
    console.log("================================================\n");
};

  // const handleIncomingCall = async (offer) => {
  //   try {
  //     const newCallId = `call_${Date.now()}_${offer.callerId || 'unknown'}`;
  //     updateCallId(newCallId);

  //     if (!offer?.sdp) {
  //       console.error("[Incoming Call] Missing SDP");
  //       Alert.alert("Error", "Invalid call offer.");
  //       rejectCall();
  //       return;
  //     }

  //     await ensurePeerConnection();
  //     const isVideo = offer.isVideoCall || false;
  //     setIsVideoCall(isVideo);

  //     if (isVideo) {
  //       const hasPermission = await requestPermissions();
  //       if (hasPermission) {
  //         try {
  //           const s = await mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user" } });
  //           localStream.current = s;
  //           setLocalURL(s.toURL());
  //         } catch (e) {
  //           const ok = await ensureLocalStreamAndAttach(false);
  //           if (!ok) { rejectCall(); return; }
  //         }
  //       } else {
  //         const ok = await ensureLocalStreamAndAttach(false);
  //         if (!ok) { rejectCall(); return; }
  //       }
  //     } else {
  //       const ok = await ensureLocalStreamAndAttach(false);
  //       if (!ok) { rejectCall(); return; }
  //     }

  //     if (pc.current && localStream.current) {
  //       const existingTracks = pc.current.getSenders().map((s) => s.track);
  //       localStream.current.getTracks().forEach((track) => {
  //         if (!existingTracks.includes(track)) pc.current.addTrack(track, localStream.current);
  //       });
  //     }

  //     await pc.current.setRemoteDescription(
  //       new RTCSessionDescription({ type: 'offer', sdp: offer.sdp })
  //     );
  //     await drainQueuedCandidates();

  //     const answer = await pc.current.createAnswer();
  //     await pc.current.setLocalDescription(answer);

  //     sendMessage({
  //       type: "answer",
  //       answer: { type: answer.type, sdp: answer.sdp },
  //       isVideoCall: isVideo,
  //     });

  //     setWebrtcReady(true);
  //     setShowIncomingModal(false);
  //     setIncomingSDP(null);

  //     // Stop foreground service notification now that call is active
  //     try { NativeModules.CallModule?.stopCallService(); } catch {}

  //     console.log("[Incoming Call] Accepted successfully");
  //   } catch (error) {
  //     console.error("[Incoming Call] Error:", error?.message);
  //     Alert.alert("Error", "Failed to accept call: " + (error?.message || "Unknown"));
  //     rejectCall();
  //   }
  // };

//   const handleIncomingCall = async (offer) => {
//   console.log("====================================");
//   console.log("[Incoming Call] FUNCTION TRIGGERED");
//   console.log("[Incoming Call] RAW PARAM:", offer);
//   console.log("[Incoming Call] TYPE:", typeof offer);
//   console.log("====================================");

//   try {

//     if (!currentCallIdRef.current) {                       // ✅ only create if not already set
//       const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
//       updateCallId(newCallId);
//     }

//     // if (!currentCallIdRef.current) {
//     //   const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
//     //   updateCallId(newCallId);
//     // }


//     const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
//     console.log("[Incoming Call] Generated Call ID:", newCallId);
//     updateCallId(newCallId);

//     // OFFER CHECK
//     console.log("[Incoming Call] Checking offer validity...");
//     console.log("[Incoming Call] offer exists:", !!offer);
//     console.log("[Incoming Call] offer.sdp exists:", !!offer?.sdp);

//     if (!offer || typeof offer !== "object") {
//       console.error("[Incoming Call] OFFER IS NOT OBJECT:", offer);
//       Alert.alert("Error", "Offer is not valid object");
//       return;
//     }

//     if (!offer.sdp) {
//       console.error("[Incoming Call] MISSING SDP:", offer);
//       Alert.alert("Error", "Missing SDP in offer");
//       return;
//     }

//     console.log("[Incoming Call] ✔ Offer validation passed");

//     // 🔌 PEER CONNECTION
//     console.log("[Incoming Call] Ensuring peer connection...");
//     await ensurePeerConnection();
//     console.log("[Incoming Call] Peer connection ready");

//     const isVideo = offer.isVideoCall || false;
//     setIsVideoCall(isVideo);

//     console.log("[Incoming Call] Call type:", isVideo ? "VIDEO" : "AUDIO");

//     // 🎥 MEDIA
//     console.log("[Incoming Call] Setting up media...");

//     if (isVideo) {
//       const hasPermission = await requestPermissions();
//       console.log("[Incoming Call] Camera permission:", hasPermission);

//       if (hasPermission) {
//         try {
//           console.log("[Incoming Call] Getting user media (video)...");
//           const stream = await mediaDevices.getUserMedia({
//             audio: true,
//             video: { facingMode: "user" },
//           });

//           console.log("[Incoming Call] Media stream acquired");
//           localStream.current = stream;
//           setLocalURL(stream.toURL());
//         } catch (e) {
//           console.error("[Incoming Call] getUserMedia failed:", e);

//           const ok = await ensureLocalStreamAndAttach(false);
//           console.log("[Incoming Call] fallback stream result:", ok);

//           if (!ok) return;
//         }
//       } else {
//         const ok = await ensureLocalStreamAndAttach(false);
//         console.log("[Incoming Call] permission fallback stream:", ok);
//         if (!ok) return;
//       }
//     } else {
//       console.log("[Incoming Call] Audio call - attaching audio only");
//       const ok = await ensureLocalStreamAndAttach(false);
//       console.log("[Incoming Call] audio stream result:", ok);
//       if (!ok) return;
//     }

//     // 🔗 TRACK DEBUG
//     console.log("[Incoming Call] Attaching tracks...");
//     console.log("[Incoming Call] PC exists:", !!pc.current);
//     console.log("[Incoming Call] Local stream exists:", !!localStream.current);

//     if (pc.current && localStream.current) {
//       const existingTracks = pc.current.getSenders().map((s) => s.track);
//       console.log("[Incoming Call] Existing tracks:", existingTracks.length);

//       localStream.current.getTracks().forEach((track, i) => {
//         console.log(`[Incoming Call] Adding track ${i}:`, track.kind);

//         if (!existingTracks.includes(track)) {
//           pc.current.addTrack(track, localStream.current);
//         }
//       });
//     }

//     // 📡 SDP STEP
//     console.log("====================================");
//     console.log("[Incoming Call] SETTING REMOTE DESCRIPTION");
//     console.log("[Incoming Call] SDP length:", offer.sdp?.length);
//     console.log("====================================");

//     await pc.current.setRemoteDescription(
//       new RTCSessionDescription({
//         type: "offer",
//         sdp: offer.sdp,
//       })
//     );

//     console.log("[Incoming Call] Remote description set SUCCESS");

//     // ICE QUEUE
//     console.log("[Incoming Call] Draining ICE candidates...");
//     await drainQueuedCandidates();
//     console.log("[Incoming Call] ICE drained");

//     // ANSWER
//     console.log("[Incoming Call] Creating answer...");
//     const answer = await pc.current.createAnswer();

//     console.log("[Incoming Call] Answer created:", {
//       type: answer.type,
//       sdpLength: answer.sdp?.length,
//     });

//     await pc.current.setLocalDescription(answer);

//     InCallManager.start({ media: 'audio', });
//     InCallManager.setSpeakerphoneOn(isSpeakerOn);
    
//     InCallManager.setForceSpeakerphoneOn(false);




//     console.log("[Incoming Call] Local description set");

//     // SEND ANSWER
//     console.log("[Incoming Call] Sending answer to backend...");

//     sendMessage({
//       type: "answer",
//       answer: {
//         type: answer.type,
//         sdp: answer.sdp,
//       },
//       isVideoCall: isVideo,
//     });

//     console.log("[Incoming Call] Answer sent");

//     // UI
//     setWebrtcReady(true);
//     setShowIncomingModal(false);
//     setIncomingSDP(null);

    

//     try {
//       NativeModules.CallModule?.stopCallService();
//       console.log("[Incoming Call] Call service stopped");
//     } catch (e) {
//       console.warn("[Incoming Call] stopCallService failed:", e);
//     }

//     console.log("====================================");
//     console.log("[Incoming Call] CALL ACCEPTED SUCCESSFULLY");
//     console.log("====================================");

//   } catch (error) {
//     console.log("====================================");
//     console.error("[Incoming Call] ❌ FULL ERROR:", error);
//     console.log("====================================");

//     Alert.alert(
//       "Call Failed",
//       error?.message || "Unknown error occurred"
//     );

//     rejectCall();
//   }
// };

const handleIncomingCall = async (offer) => {
  try {
    if (!currentCallIdRef.current) {
      updateCallId(`call_${Date.now()}_${offer?.callerId || 'unknown'}`);
    }

    if (!offer || typeof offer !== "object" || !offer.sdp) {
      Alert.alert("Error", "Invalid call offer.");
      rejectCall();
      return;
    }

    const isVideo = offer.isVideoCall || false;
    setIsVideoCall(isVideo);

    const mediaPromise = (async () => {
      if (isVideo) {
        // Reuse an existing stream if it already has video — avoids re-opening the camera
        if (localStream.current && localStream.current.getVideoTracks().length > 0) {
          return true;
        }
        const hasPermission = await requestPermissions();
        if (!hasPermission) return ensureLocalStreamAndAttach(false);
        try {
          const stream = await mediaDevices.getUserMedia({
            audio: true,
            video: { facingMode: "user" },
          });
          if (localStream.current) {
            localStream.current.getTracks().forEach((t) => t.stop());
          }
          localStream.current = stream;
          setLocalURL(stream.toURL());
          return true;
        } catch (e) {
          return ensureLocalStreamAndAttach(false);
        }
      }
      return ensureLocalStreamAndAttach(false);
    })();

    const [, mediaOk] = await Promise.all([ensurePeerConnection(), mediaPromise]);
    if (!mediaOk || !pc.current) { rejectCall(); return; }

    if (localStream.current) {
      const existingTracks = pc.current.getSenders().map((s) => s.track);
      localStream.current.getTracks().forEach((track) => {
        if (!existingTracks.includes(track)) pc.current.addTrack(track, localStream.current);
      });
    }

    await pc.current.setRemoteDescription(
      new RTCSessionDescription({ type: "offer", sdp: offer.sdp })
    );
    drainQueuedCandidates(); // don't await — ICE candidates can trickle in without blocking answer

    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    InCallManager.start({ media: 'audio' });
    InCallManager.setSpeakerphoneOn(isSpeakerOn);
    InCallManager.setForceSpeakerphoneOn(false);

    sendMessage({
      type: "answer",
      answer: { type: answer.type, sdp: answer.sdp },
      isVideoCall: isVideo,
    });

    setWebrtcReady(true);
    setShowIncomingModal(false);
    setIncomingSDP(null);

    try { NativeModules.CallModule?.stopCallService(); } catch (e) {}
  } catch (error) {
    Alert.alert("Call Failed", error?.message || "Unknown error occurred");
    rejectCall();
  }
};


  // ─── Lifecycle ────────────────────────────────────────────────

  useEffect(() => {
    connectSignaling();
    return () => { endCall(false); };
  }, []);

  useEffect(() => {
    if (webrtcReady) {
      const startTime = Date.now();
      callTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
        setCallDuration(0);
      }
    }
    return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
  }, [webrtcReady]);

  // ─── Call actions ─────────────────────────────────────────────

  const acceptCall = async () => {
    stopRinging();
    isCallerRef.current = false;
    const offer = incomingSDP;
    if (!offer?.sdp) {
      Alert.alert("Error", "Invalid call offer.");
      return;
    }
    startAudioSession();
    await handleIncomingCall(offer);
  };

  const startCall = async (video = false) => {
    setIsVideoCall(video);
    isCallerRef.current = true;
    const newCallId = `call_${Date.now()}_${targetUserId}`;
    updateCallId(newCallId);
    startAudioSession();
    if (video) await ensureLocalStreamAndAttach(true);
    await createAndSendInitialOffer();
  };

  const endCall = useCallback(async (notify = true) => {
  console.log("[VideoCall] Ending call...");

  // 1. Navigate immediately
  try {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("PHome");
    }
  } catch (e) {
    navigation.navigate("PHome");
  }

  // 2. Cleanup in background
  setTimeout(() => {
    const callId = currentCallIdRef.current;
    
    // Stop media
    if (localStream.current) {
      localStream.current.getTracks().forEach(t => t.stop());
      localStream.current = null;
    }
    
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach(t => t.stop());
      remoteStream.current = null;
    }

    // Close peer connection
    if (pc.current) {
      try { pc.current.close(); } catch (e) {}
      pc.current = null;
    }

    // Notify other party
    if (notify && ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify({ type: "call-ended" }));
      } catch (e) {}
    }

    // Cleanup CallKeep - safe version
    try {
      if (callId) {
        CallKeepService.endCall(callId).catch(() => {});
      } else {
        // No callId, just cleanup
        if (Platform.OS === 'android') {
          try { NativeModules.CallModule?.stopCallService(); } catch (e) {}
        }
        CallKeepService.removeAllListeners();
      }
    } catch (e) {
      console.warn('[CallKeep] Cleanup error:', e);
    }

    // Cleanup audio
    try {
      InCallManager.stop();
      InCallManager.stopRingtone();
      InCallManager.setKeepScreenOn(false);
    } catch (e) {}

    // Clear timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    // Reset refs
    isCallActiveRef.current = false;
    hasInitialOfferRef.current = false;
    queuedRemoteCandidates.current = [];
    isCallerRef.current = false;
    isCleaningUpRef.current = false;
    hasSwitchedToVideoRef.current = false;

    // Reset state
    setWebrtcReady(false);
    setLocalURL(null);
    setRemoteURL(null);
    setCallDuration(0);
    setCurrentCallId(null);
    setShowIncomingModal(false);
    setIncomingSDP(null);
    
    // Save history
    saveCallToHistory({
      contact: { name, profileImage: profile_image, userId: targetUserId },
      direction: isInitiator ? 'outgoing' : 'incoming',
      isVideoCall: isVideoCall || false,
      status: webrtcReady ? 'ended' : 'missed',
      duration: callDuration || 0,
    }).catch(() => {});

    console.log("[VideoCall] Cleanup complete");
  }, 0);

}, [isVideoCall, webrtcReady, callDuration, name, profile_image, targetUserId, isInitiator, navigation]);


//   const endCall = useCallback(async (notify = true) => {
//   console.log("[VideoCall] Ending call...");

//   // 1. Navigate immediately
//   try {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     } else {
//       navigation.navigate("PHome");
//     }
//   } catch (e) {
//     navigation.navigate("PHome");
//   }

//   // 2. Cleanup in background
//   setTimeout(() => {
//     // Get the current call ID
//     const callId = currentCallIdRef.current;
    
//     // Stop all media
//     if (localStream.current) {
//       localStream.current.getTracks().forEach(t => t.stop());
//       localStream.current = null;
//     }
    
//     if (remoteStream.current) {
//       remoteStream.current.getTracks().forEach(t => t.stop());
//       remoteStream.current = null;
//     }

//     // Close peer connection
//     if (pc.current) {
//       try { 
//         pc.current.close(); 
//       } catch (e) {}
//       pc.current = null;
//     }

//     // Notify other party (only if not already ended by CallKeep)
//     if (notify && ws.current?.readyState === WebSocket.OPEN) {
//       try {
//         ws.current.send(JSON.stringify({ type: "call-ended" }));
//       } catch (e) {}
//     }

//     // Cleanup CallKeep
//     if (callId) {
//       CallKeepService.endCall(callId).catch(() => {});
//     } else {
//       // Force cleanup if no callId
//       CallKeepService.forceEndCall();
//     }

//     // Cleanup audio
//     try {
//       InCallManager.stop();
//       InCallManager.stopRingtone();
//       InCallManager.setKeepScreenOn(false);
//     } catch (e) {}

//     // Clear timer
//     if (callTimerRef.current) {
//       clearInterval(callTimerRef.current);
//       callTimerRef.current = null;
//     }

//     // Reset refs
//     isCallActiveRef.current = false;
//     hasInitialOfferRef.current = false;
//     queuedRemoteCandidates.current = [];
//     isCallerRef.current = false;
//     isCleaningUpRef.current = false;
//     hasSwitchedToVideoRef.current = false;

//     // Reset state
//     setWebrtcReady(false);
//     setLocalURL(null);
//     setRemoteURL(null);
//     setCallDuration(0);
//     setCurrentCallId(null);
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
    
//     // Save history
//     saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: isInitiator ? 'outgoing' : 'incoming',
//       isVideoCall: isVideoCall || false,
//       status: webrtcReady ? 'ended' : 'missed',
//       duration: callDuration || 0,
//     }).catch(() => {});

//     console.log("[VideoCall] ✅ Cleanup complete");
//   }, 0);

// }, [isVideoCall, webrtcReady, callDuration, name, profile_image, targetUserId, isInitiator, navigation]);

// const endCall = useCallback(async (notify = true) => {
//   console.log("[VideoCall] Ending call...");

//   // 1. Navigate immediately (user sees instant response)
//   try {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     } else {
//       navigation.navigate("PHome");
//     }
//   } catch (e) {
//     // Fallback navigation
//     navigation.navigate("PHome");
//   }

//   // 2. Cleanup in background (runs after navigation)
//   setTimeout(() => {
//     // Save history
//     saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: isInitiator ? 'outgoing' : 'incoming',
//       isVideoCall: isVideoCall || false,
//       status: webrtcReady ? 'ended' : 'missed',
//       duration: callDuration || 0,
//     }).catch(() => {});

//     // Stop media
//     if (localStream.current) {
//       localStream.current.getTracks().forEach(t => t.stop());
//       localStream.current = null;
//     }
    
//     if (remoteStream.current) {
//       remoteStream.current.getTracks().forEach(t => t.stop());
//       remoteStream.current = null;
//     }

//     // Close peer connection
//     if (pc.current) {
//       try { 
//         pc.current.close(); 
//       } catch (e) {}
//       pc.current = null;
//     }

//     // Notify other party
//     if (notify && ws.current?.readyState === WebSocket.OPEN) {
//       try {
//         ws.current.send(JSON.stringify({ type: "call-ended" }));
//       } catch (e) {}
//     }

//     // Cleanup audio
//     try {
//       InCallManager.stop();
//       InCallManager.stopRingtone();
//       InCallManager.setKeepScreenOn(false);
//     } catch (e) {}

//     // Clear timer
//     if (callTimerRef.current) {
//       clearInterval(callTimerRef.current);
//       callTimerRef.current = null;
//     }

//     // Reset refs
//     isCallActiveRef.current = false;
//     hasInitialOfferRef.current = false;
//     queuedRemoteCandidates.current = [];
//     isCallerRef.current = false;
//     isCleaningUpRef.current = false;
//     hasSwitchedToVideoRef.current = false;

//     // Reset state
//     setWebrtcReady(false);
//     setLocalURL(null);
//     setRemoteURL(null);
//     setCallDuration(0);
//     setCurrentCallId(null);
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
    
//     // Also reset these if needed
//     // setIsVideoCall(false); // Keep this if you want to reset
//     // setIsMuted(false);
//     // setIsSpeakerOn(false);
//   }, 0);

// }, [isVideoCall, webrtcReady, callDuration, name, profile_image, targetUserId, isInitiator, navigation]);

// const endCall = useCallback(async (notify = true) => {
//   console.log("[VideoCall] Ending call...");

//   // 1. Save history (async, don't await - let it run in background)
//   saveCallToHistory({
//     contact: { name, profileImage: profile_image, userId: targetUserId },
//     direction: isInitiator ? 'outgoing' : 'incoming',
//     isVideoCall: isVideoCall || false,
//     status: webrtcReady ? 'ended' : 'missed',
//     duration: callDuration || 0,
//   }).catch(() => {});

//   // 2. Stop media (CRITICAL - do this first)
//   if (localStream.current) {
//     localStream.current.getTracks().forEach(t => t.stop());
//     localStream.current = null;
//   }
  
//   if (remoteStream.current) {
//     remoteStream.current.getTracks().forEach(t => t.stop());
//     remoteStream.current = null;
//   }

//   // 3. Close peer connection
//   if (pc.current) {
//     try { 
//       pc.current.close(); 
//     } catch (e) {
//       console.warn("[Cleanup] PC close error:", e);
//     }
//     pc.current = null;
//   }

//   // 4. Notify other party
//   if (notify && ws.current?.readyState === WebSocket.OPEN) {
//     try {
//       ws.current.send(JSON.stringify({ type: "call-ended" }));
//     } catch (e) {
//       console.warn("[Cleanup] Send ended error:", e);
//     }
//   }

//   // 5. Cleanup audio manager
//   try {
//     InCallManager.stop();
//     InCallManager.stopRingtone();
//     InCallManager.setKeepScreenOn(false);
//   } catch (e) {
//     console.warn("[Cleanup] InCallManager error:", e);
//   }

//   // 6. Clear timer
//   if (callTimerRef.current) {
//     clearInterval(callTimerRef.current);
//     callTimerRef.current = null;
//   }

//   // 7. Reset refs
//   isCallActiveRef.current = false;
//   hasInitialOfferRef.current = false;
//   queuedRemoteCandidates.current = [];
//   isCallerRef.current = false;
//   isCleaningUpRef.current = false;
//   hasSwitchedToVideoRef.current = false;

//   // 8. Reset state (minimal)
//   setWebrtcReady(false);
//   setLocalURL(null);
//   setRemoteURL(null);
//   setCallDuration(0);
//   setCurrentCallId(null);
//   setCallAccepted(false);
//   setCallStarted(false);
//   setShowIncomingModal(false);
//   setIncomingSDP(null);

//   // ✅ KEEP user preferences (don't reset these)
//   // - isSpeakerOn 
//   // - isMuted 
//   // - isCameraFront 
//   // - isVideoCall (will be set by next call)

//   console.log("[VideoCall] ✅ Call ended - ready for next call");

//   // Navigate back
//   setTimeout(() => {
//     // try {
//     //   if (navigation.canGoBack()) {
//     //     navigation.goBack();
//     //   } else {
//     //     navigation.navigate("PHome");
//     //   }
//     // } catch (e) {
//     //   console.warn("[Navigation] Error:", e);
//     //   navigation.navigate("PHome");
//     // }
//     navigation.navigate("PHome");
//   }, 200);
// }, [isVideoCall, webrtcReady, callDuration, name, profile_image, targetUserId, isInitiator, navigation]);


  // const rejectCall = async () => {
  //   stopRinging();
  //   sendMessage({ type: "call-rejected" });
  //   await saveCallToHistory({
  //     contact: { name, profileImage: profile_image, userId: targetUserId },
  //     direction: 'incoming',
  //     isVideoCall,
  //     status: 'rejected',
  //     duration: 0,
  //   });
  //   setShowIncomingModal(false);
  //   setIncomingSDP(null);
  //   navigation.navigate("PHome");
  // };

const rejectCall = async () => {
  stopRinging();
  sendMessage({ type: "call-rejected" });

  const cid = currentCallIdRef.current;
  if (cid) {
    try { await CallKeepService.endCall(cid); } catch {}
  }
  try { NativeModules.CallModule?.stopCallService(); } catch {}

  await saveCallToHistory({
    contact: { name, profileImage: profile_image, userId: targetUserId },
    direction: 'incoming',
    isVideoCall,
    status: 'rejected',
    duration: 0,
  });
  setShowIncomingModal(false);
  setIncomingSDP(null);
  //navigation.navigate("PHome");
  navigation.goBack();
};

  const startAudioSession = () => {
    InCallManager.start({ media: 'audio' });
    InCallManager.setSpeakerphoneOn(isSpeakerOn);
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleSpeaker = () => {
    const newState = !isSpeakerOn;
    InCallManager.setSpeakerphoneOn(newState);
    setIsSpeakerOn(newState);
  };

  const switchCamera = async () => {
    if (!isVideoCall || !localStream.current) return;
    const videoTrack = localStream.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack._switchCamera();
      setIsCameraFront(!isCameraFront);
    }
  };

  const switchToVideoCall = async () => {
    console.log('[SWITCHING TO VIDEO INITIALIZE]')
    if (!webrtcReady || !pc.current) return;
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) { Alert.alert("Permission denied", "Cannot access camera."); return; }

      const newStream = await mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: isCameraFront ? "user" : "environment" },
      });

      const senders = pc.current.getSenders();
      const audioTrack = newStream.getAudioTracks()[0];
      const audioSender = senders.find(s => s.track?.kind === 'audio');
      if (audioSender && audioTrack) await audioSender.replaceTrack(audioTrack);

      const videoTrack = newStream.getVideoTracks()[0];
      const videoSender = senders.find(s => s.track?.kind === 'video');
      if (videoTrack) {
        if (videoSender) await videoSender.replaceTrack(videoTrack);
        else pc.current.addTrack(videoTrack, newStream);
      }

      if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
      localStream.current = newStream;
      setLocalURL(newStream.toURL());
      setIsVideoCall(true);

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      sendMessage({ type: "offer", offer, isVideoCall: true, isRenegotiation: true });
    } catch (e) {
      Alert.alert("Error", "Failed to switch to video call");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ─── UI ───────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />

      {webrtcReady ? (
  <View style={styles.callScreen}>
    {/* Video Call Interface */}
    {isVideoCall && remoteURL ? (
      <View style={styles.videoContainer}>
        {/* Remote Video - Full Screen Background */}
        <RTCView 
          streamURL={remoteURL} 
          style={styles.remoteVideo} 
          objectFit="cover" 
        />

       
        {/* Draggable Local Video PiP */}
{localURL && pipVisible && (
  <View
    style={[
      styles.localVideoWrapper,
      {
        left: pipPositionState.x,
        top: pipPositionState.y,
      }
    ]}
    {...PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDragging.current = true;
      },
      onPanResponderMove: (event) => {
        handlePipDrag(event);
      },
      onPanResponderRelease: () => {
        isDragging.current = false;
      },
    }).panHandlers}
  >
    <View style={styles.pipContainer}>
      <RTCView 
        streamURL={localURL} 
        style={styles.localVideoStream} 
        objectFit="cover" 
        mirror={isCameraFront}
      />
      
      {/* Close button */}
      <TouchableOpacity 
        style={styles.pipCloseButton}
        onPress={togglePipVisibility}
        activeOpacity={0.7}
      >
        <Icon name="close" size={16} color="white" />
      </TouchableOpacity>

      {/* Switch camera button on PiP */}
      <TouchableOpacity 
        style={styles.pipSwitchButton}
        onPress={switchCamera}
        activeOpacity={0.7}
      >
        <Icon name="flip-camera-ios" size={16} color="white" />
      </TouchableOpacity>
    </View>
  </View>
)}

        {/* Show PiP again button when hidden */}
        {!pipVisible && localURL && (
          <TouchableOpacity 
            style={styles.showPipButton}
            onPress={togglePipVisibility}
            activeOpacity={0.7}
          >
            <Icon name="videocam" size={20} color="white" />
          </TouchableOpacity>
        )}

        {/* Top Bar with Call Info */}
        <View style={styles.topBar}>
          <View style={styles.topBarContent}>
            <View style={styles.callerInfoRow}>
              <Text style={styles.callerNameText} numberOfLines={1}>
                {name || 'Unknown'}
              </Text>
            </View>
            <Text style={styles.callDurationText}>
              {formatTime(callDuration)}
            </Text>
          </View>
        </View>

        {/* Bottom Controls ============ */}
        <View style={styles.bottomControls}>
          <View style={styles.controlsRow}>
            {/* Speaker */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={toggleSpeaker}
              activeOpacity={0.6}
            >
              <Icon 
                name={isSpeakerOn ? "volume-up" : "volume-off"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>

            {/* Mute */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={toggleMute}
              activeOpacity={0.6}
            >
              <Icon 
                name={isMuted ? "mic-off" : "mic"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>

            {/* Video Toggle */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={togglePipVisibility}
              activeOpacity={0.6}
            >
              <Icon 
                name={pipVisible ? "videocam" : "videocam-off"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>

            {/* Switch Camera */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={switchCamera}
              activeOpacity={0.6}
            >
              <Icon name="flip-camera-ios" size={22} color="white" />
            </TouchableOpacity>

            {/* End Call */}
            {/* <TouchableOpacity 
              style={styles.endCallBtn} 
              onPress={() => endCall(true)}
              activeOpacity={0.6}
            >
              <Icon name="call-end" size={26} color="white" />
            </TouchableOpacity> */}
            <TouchableOpacity 
              style={styles.endCallBtn} 
              onPress={() => endCall(true)}
              activeOpacity={0.6}
            >
              <Icon name="call-end" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : (
      /* Audio Call Interface */
      <View style={styles.audioCallContainer}>
        {/* Background with blur effect */}
        <ImageBackground
          source={{ uri: `${profile_image}` || `${API_ROUTE_IMAGE}${profile_image}` }}
          style={styles.audioBackground}
          blurRadius={50}
        >
          <View style={styles.audioOverlay} />
        </ImageBackground>

        <View style={styles.audioContent}>
          {/* caler Avatar =============================*/}
          <View style={styles.audioAvatarContainer}>
            <Image
              source={{ uri: `${profile_image}` }}
              style={styles.audioAvatar}
              resizeMode="cover"
            />
          </View>

          {/* Caller Info */}
          <View style={styles.audioInfoContainer}>
            <Text style={styles.audioCallerName} numberOfLines={1}>
              {name || 'Unknown Caller'}
            </Text>
            <Text style={styles.audioTimerText}>
              {formatTime(callDuration)}
            </Text>
          </View>

          {/* Audio Controls */}
          <View style={styles.audioControls}>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={toggleSpeaker}
              activeOpacity={0.6}
            >
              <Icon 
                name={isSpeakerOn ? "volume-up" : "volume-off"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={toggleMute}
              activeOpacity={0.6}
            >
              <Icon 
                name={isMuted ? "mic-off" : "mic"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={switchToVideoCall}
              activeOpacity={0.6}
            >
              <Icon 
                name="videocam-off" 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.endCallBtn} 
              onPress={() => endCall(true)}
              activeOpacity={0.6}
            >
              <Icon name="call-end" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
  </View>
) : (
  /* Connecting Screen */
  <View style={styles.connectingScreen}>
    <View style={styles.connectingContent}>
      {/* Avatar */}
      <View style={styles.connectingAvatarContainer}>
        <Image
          source={{ uri: `${profile_image}` }}
          style={styles.connectingAvatar}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.connectingName}>{name || 'Unknown'}</Text>

      {/* Status */}
      <View style={styles.connectingStatusRow}>
        <Text style={styles.connectingStatusText}>
          {wsConnected
            ? (isInitiator ? "Calling..." : "please wait while call is processing...")
            : "Connecting..."}
        </Text>
      </View>

      {/* Cancel Button */}
      {isInitiator && (
        <TouchableOpacity 
          style={styles.connectingEndBtn} 
          onPress={() => endCall(true)}
          activeOpacity={0.6}
        >
          <View style={styles.connectingEndIcon}>
            <Icon name="call-end" size={26} color="white" />
          </View>
          <Text style={styles.connectingEndText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
)}

      {/* Incoming Call Modal */}
      <Modal visible={showIncomingModal} transparent animationType="fade" onRequestClose={rejectCall}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.incomingCallText}>Incoming Call</Text>
              <View style={styles.callerInfo}>
                <View style={styles.modalAvatar}>
                  <Image
                    source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` || `${profile_image}` }}
                    style={styles.modalAvatarImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.modalCallerName}>{name}</Text>
                <Text style={styles.modalCallType}>{isVideoCall ? "Video Call" : "Voice Call"}</Text>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
                  <View style={styles.rejectButtonInner}>
                    <Icon name="call-end" size={30} color="white" />
                  </View>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
                  <View style={styles.acceptButtonInner}>
                    <Icon name="call" size={30} color="white" />
                  </View>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  callScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Video Container
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  
  // Draggable Local Video PiP
  localVideoWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  pipContainer: {
    width: 100,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  localVideoStream: {
    width: '100%',
    height: '100%',
  },
  
  // PiP Close Button
  pipCloseButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // PiP Switch Camera Button
  pipSwitchButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Show PiP Button (when hidden)
  showPipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 80,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  // Top Bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 16,
    zIndex: 5,
  },
  topBarContent: {
    alignItems: 'center',
  },
  callerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  callerNameText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  callDurationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  
  // Bottom Controls
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 35 : 25,
    paddingTop: 15,
    paddingHorizontal: 16,
    zIndex: 5,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  
  // Normal sized control buttons
  controlBtn: {
    width: 50,
    height: 50,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // End Call Button (slightly larger but normal)
  endCallBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
    elevation: 3,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  // Audio Call Screen
  audioCallContainer: {
    flex: 1,
    backgroundColor: '#161616',
  },
  audioBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  audioOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  audioContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: Platform.OS === 'ios' ? 35 : 25,
    paddingHorizontal: 20,
  },
  
  // Audio Call Avatar
  audioAvatarContainer: {
    alignItems: 'center',
    marginTop: '20%',
  },
  audioAvatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  
  // Audio Call Info
  audioInfoContainer: {
    alignItems: 'center',
    marginTop: 25,
  },
  audioCallerName: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  audioTimerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Audio Controls
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 'auto',
    paddingHorizontal: 20,
    backgroundColor:'#252525',
    borderRadius:10,
    padding:10,
  },
  
  // Connecting Screen
  connectingScreen: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  connectingAvatarContainer: {
    marginBottom: 35,
  },
  connectingAvatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  connectingName: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  connectingStatusRow: {
    alignItems: 'center',
    marginBottom: 45,
  },
  connectingStatusText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  connectingEndBtn: {
    alignItems: 'center',
  },
  connectingEndIcon: {
    marginTop:40,
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    transform: [{ rotate: '135deg' }],
  },
  connectingEndText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
  callScreen: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 0, 
  },
  preCallScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    width: '100%',
   
    opacity: 0.9,
    backgroundColor: '#000',
    position: 'relative',

  },
  preCallContent: {
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  callHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  callDuration: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  callerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  callStatus: {
    fontSize: 16,
    color: '#a0aec0',
    marginTop: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 30,
    flex: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4a5568',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  largeAvatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  largeAvatarImage: {
    width: '80%',
    height: '80%',
    borderRadius: 100,
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  localVideo: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#000',
  },
  contactName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  contactStatus: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  preCallControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 50,
  },
  controlButton: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
  },
  controlIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlText: {
    color: 'white',
    fontSize: 14,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 30,
    alignItems: 'center',
  },
  incomingCallText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  callerInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4a5568',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  modalCallerName: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalCallType: {
    fontSize: 16,
    color: '#a0aec0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  rejectButton: {
    alignItems: 'center',
  },
  acceptButton: {
    alignziehItems: 'center',
  },
  rejectButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e53e3e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  acceptButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#38a169',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
   videoContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  
  callInfoOverlay: {
    position: 'absolute',
    top: 5, // Increased top margin for better visibility
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better contrast
    padding: 10,
    zIndex: 100, // Higher z-index to ensure it's above video
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  
  voiceCallInfo: {
    alignItems: 'center',
    marginTop: 1, // More space above the info
    padding: 20,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  
  callerName: {
    fontSize: 26, // Slightly larger font
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  callTypeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)', // Brighter text
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  localVideo: {
    position: 'absolute',
    bottom: 120, // Adjusted to not overlap with controls
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#000',
    zIndex: 50, // Lower than overlay but higher than remote video
  },
  
  remoteVideo: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    zIndex: 1, // Lowest z-index
  },
  
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    zIndex: 100, // High z-index to stay above everything
  },
});






// /// ===================================Working voice call ========================


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
//   Vibration,
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
// import { SafeAreaView } from "react-native-safe-area-context";
// import { encode as btoa } from "base-64";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { Image } from "react-native-animatable";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_ROUTE_IMAGE } from "../api_routing/api";
// import InCallManager from "react-native-incall-manager";


// // ================== CONFIG ==================
// const SIGNALING_SERVER = "wss://api.showapp.ng";
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
  


//   //=============== RINGING TOO LONG ===============
//   const [isRinging, setIsRinging] = useState(false);


// useEffect(() => {
//   // Mark that we're on call screen
//   global.__onCallScreen = true;
  
//   return () => {
//     // Clear call screen flag on unmount
//     global.__onCallScreen = false;
//     InCallManager.stopRingtone();
//     InCallManager.stop({ busytone: '_BUNDLE_' });
//   };
// }, []);

// useEffect(() => {
//   // Stop any existing ringtone when entering call screen
//   InCallManager.stopRingtone();
//   Vibration.cancel();
  
//   // Start audio session for call
//   InCallManager.start({ media: 'audio' });
  
//   return () => {
//     // Cleanup when leaving call screen
//     InCallManager.stop();
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//   };
// }, []);

//   // Start ringing when incoming call modal is shown
//   useEffect(() => {
//     if (showIncomingModal) {
//       startRinging();
//     } else {
//       stopRinging();
//     }
    
//     // Cleanup when component unmounts
//     return () => {
//       stopRinging();
//     };
//   }, [showIncomingModal]);

//   // Ringtone functions
//   const startRinging = () => {
//     setIsRinging(true);
//     InCallManager.startRingtone();
//     console.log("[Ringing] Started ringtone");
//   };

//   const stopRinging = () => {
//     if (isRinging) {
//       setIsRinging(false);
//       InCallManager.stopRingtone();
//       console.log("[Ringing] Stopped ringtone");
//     }
//   };

  
// // Auto-switch to video when it's a video call and webrtc is ready
// useEffect(() => {
//   const autoSwitchToVideo = async () => {
//     // Check if this is a video call AND webrtc is ready
//     // Also make sure we're not already in video mode
//     if (webrtcReady && isVideoCall && !localStream.current?.getVideoTracks().length) {
//       console.log("[AutoSwitch] Video call detected, automatically switching to video...");
      
//       // Small delay to ensure connection is stable
//       setTimeout(async () => {
//         try {
//           // Check if we have video permissions
//           const hasPermission = await requestPermissions();
//           if (!hasPermission) {
//             console.warn("[AutoSwitch] No camera permission");
//             return;
//           }

//           // Get new stream with video
//           const newStream = await mediaDevices.getUserMedia({
//             audio: true,
//             video: { facingMode: isCameraFront ? "user" : "environment" }
//           });

//           // Replace tracks in peer connection
//           if (pc.current) {
//             const senders = pc.current.getSenders();
            
//             // Replace audio track
//             const audioTrack = newStream.getAudioTracks()[0];
//             const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
//             if (audioSender && audioTrack) {
//               await audioSender.replaceTrack(audioTrack);
//             }

//             // Add video track
//             const videoTrack = newStream.getVideoTracks()[0];
//             const videoSender = senders.find(s => s.track && s.track.kind === 'video');
            
//             if (videoTrack) {
//               if (videoSender) {
//                 await videoSender.replaceTrack(videoTrack);
//               } else {
//                 pc.current.addTrack(videoTrack, newStream);
//               }
//             }

//             // Stop old stream and set new one
//             if (localStream.current) {
//               localStream.current.getTracks().forEach(track => track.stop());
//             }
//             localStream.current = newStream;
//             setLocalURL(newStream.toURL());

//             // Create and send renegotiation offer
//             const offer = await pc.current.createOffer();
//             await pc.current.setLocalDescription(offer);
            
//             sendMessage({
//               type: "offer",
//               offer,
//               isVideoCall: true,
//               isRenegotiation: true
//             });

//             console.log("[AutoSwitch] Video auto-switch completed");
//           }
//         } catch (error) {
//           console.error("[AutoSwitch] Failed to auto-switch to video:", error);
//         }
//       }, 1000); // 1 second delay to ensure everything is ready
//     }
//   };

//   autoSwitchToVideo();
// }, [webrtcReady, isVideoCall]); 
  

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


// //  const getIceServers = async () => {
// //   try {
// //     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //       method: "PUT",
// //       headers: {
// //         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ format: "urls" }),
// //     });

// //     const data = await res.json();
// //     console.log("[Xirsys RAW]:", JSON.stringify(data));

// //     let iceServers = [];

// //     if (data?.v?.iceServers) {
// //       const server = data.v.iceServers;
// //       const urls = Array.isArray(server.urls) ? server.urls : [server.urls];

// //       // Split into STUN (no creds) and TURN (needs creds)
// //       const turnUrls = urls.filter(u => u.startsWith("turn:") || u.startsWith("turns:"));
// //       const stunUrls = urls.filter(u => u.startsWith("stun:"));

// //       const tcpUrls = turnUrls.filter(u => u.includes("transport=tcp") || u.startsWith("turns:"));
// //       const udpUrls = turnUrls.filter(u => u.includes("transport=udp"));
// //       console.log("[ICE] All URLs from Xirsys:", urls);
// //       console.log("[ICE] UDP TURN URLs:", udpUrls.length, udpUrls);
// //       console.log("[ICE] TCP TURN URLss:", tcpUrls.length, tcpUrls); 


// //       if (turnUrls.length > 0) {
// //         iceServers.push({
// //           urls: turnUrls,
// //           username: server.username,
// //           credential: server.credential,
// //         });
// //       }

// //       stunUrls.forEach(u => iceServers.push({ urls: u }));
// //     }

// //     if (!iceServers.length) throw new Error("No ICE servers from Xirsys");

// //     // Fallback STUN
// //     iceServers.push({ urls: "stun:stun.l.google.com:19302" });

// //     rtcConfig.iceServers = iceServers;
// //     console.log("✅ [ICE SERVERS]:", JSON.stringify(iceServers, null, 2));

// //   } catch (err) {
// //     console.error("❌ [Xirsys Failed]:", err);
// //     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //   }

// //   // Allow all transport types — do NOT lock to relay only
// //   rtcConfig.iceTransportPolicy = "all";
// // };


// const getIceServers = async () => {
//   try {
//     console.log("[Xirsys] Fetching ICE servers...");

//     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
//       method: "PUT",
//       headers: {
//         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ format: "urls" }),
//     });

//     const data = await res.json();
//     console.log("[Xirsys RAW]:", data);

//     let iceServers = [];

//     if (data?.v?.iceServers) {
//       const server = data.v.iceServers;
      
//       // SEE WHAT'S ACTUALLY COMING BACK
//       console.log("[Xirsys] Raw URLs:", JSON.stringify(server.urls, null, 2));
//       console.log("[Xirsys] Is array?", Array.isArray(server.urls));

//       const urls = Array.isArray(server.urls) ? server.urls : [server.urls];

//       console.log("[ICE] TCP URLs:", urls.filter(u => u.includes("transport=tcp") || u.startsWith("turns:")));
//       console.log("[ICE] UDP URLs:", urls.filter(u => u.includes("transport=udp")));

//       // Pass ALL urls in one object — WebRTC picks the best available
//       iceServers = [
//         {
//           urls: urls,
//           username: server.username,
//           credential: server.credential,
//         }
//       ];
//     }

//     if (!iceServers.length) {
//       throw new Error("No ICE servers from Xirsys");
//     }

//     // Fallback STUN
//     iceServers.push({ urls: "stun:stun.l.google.com:19302" });

//     rtcConfig.iceServers = iceServers;
//     console.log("✅ [ICE CONFIG READY]:", JSON.stringify(iceServers, null, 2));

//   } catch (err) {
//     console.error("❌ [Xirsys Failed]:", err);
//     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//   }

//   rtcConfig.iceTransportPolicy = "all"; // NOT "relay" — allow all candidate types
// };

// const ensurePeerConnection = async () => {
//   if (pc.current) return;

//   if (!rtcConfig.iceServers.length) {
//     await getIceServers();
//   }

//   // rtcConfig.iceTransportPolicy = "relay";

//   pc.current = new RTCPeerConnection(rtcConfig);
//   console.log("[WebRTC] RTCPeerConnection created");

//   pc.current.onnegotiationneeded = () => {
//     console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
//   };

//   // pc.current.onicecandidate = (evt) => {
//   //   if (evt.candidate) {
//   //     sendMessage({ type: "candidate", candidate: evt.candidate });
//   //   }
//   // };

//   pc.current.onicecandidate = (evt) => {
//     if (evt.candidate) {
//       const cand = evt.candidate.candidate;

//       if (cand.includes("typ relay")) {
//         console.log("🟢 [TURN WORKING - Xirsys]", cand);
//       } else if (cand.includes("typ srflx")) {
//         console.log("🟡 [STUN WORKING - Google]", cand);
//       } else if (cand.includes("typ host")) {
//         console.log("⚪ [LOCAL ONLY - NO STUN/TURN]", cand);
//       }

//       sendMessage({ type: "candidate", candidate: evt.candidate });
//     } else {
//       console.log("[ICE] Gathering finished");
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


//   pc.current.onconnectionstatechange = async () => {
//   if (!pc.current) {
//     console.warn("[WebRTC] onconnectionstatechange called with no pc");
//     return;
//   }

//   const state = pc.current.connectionState;
//   console.log("[WebRTC] connectionState =>", state);

//   // ✅ SUCCESS
//   if (state === "connected") {
//     console.log("✅ CALL CONNECTED");

//     try {
//       const stats = await pc.current.getStats();

//       stats.forEach((report) => {
//         if (report.type === "candidate-pair" && report.state === "succeeded") {
//           console.log("🎯 SELECTED CANDIDATE PAIR:", report);

//           // 🔥 IMPORTANT: detect TURN vs STUN properly
//           const local = stats.get(report.localCandidateId);
//           const remote = stats.get(report.remoteCandidateId);

//           if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
//             console.log("🟢 USING TURN (Xirsys)");
//           } else if (local?.candidateType === "srflx") {
//             console.log("🟡 USING STUN (Google)");
//           } else {
//             console.log("⚪ USING LOCAL (same network)");
//           }
//         }
//       });
//     } catch (err) {
//       console.warn("[WebRTC] getStats failed:", err);
//     }
//   }

//   // ❌ FAILURE
//   if (state === "failed") {
//     console.warn("❌ CONNECTION FAILED → TURN NOT WORKING");

//     saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: isInitiator ? 'outgoing' : 'incoming',
//       isVideoCall: isVideoCall,
//       status: 'failed',
//       duration: callDuration
//     });
//   }
// };

//   // pc.current.onconnectionstatechange = () => {
//   //   if (!pc.current) {
//   //     console.warn("[WebRTC] onconnectionstatechange called with no pc");
//   //     return;
//   //   }
//   //   console.log("[WebRTC] connectionState =>", pc.current.connectionState);
//   //   // if (pc.current.connectionState === "failed") {
//   //   //   console.warn("[WebRTC] connection failed, consider recreating pc or ending call");
//   //   // }

     
//   //   if (pc.current.connectionState === "failed") {
//   //     console.warn("[WebRTC] Connection failed");
//   //     // Save as failed call
//   //     saveCallToHistory({
//   //       contact: { name, profileImage: profile_image, userId: targetUserId },
//   //       direction: isInitiator ? 'outgoing' : 'incoming',
//   //       isVideoCall: isVideoCall,
//   //       status: 'failed',
//   //       duration: callDuration
//   //     });
//   //   }

//   // };

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
//     stopRinging();
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

// const switchToVideoCall = async () => {
//   console.log("[Action] Switch to video call initiated. webrtcReady:", webrtcReady, "pc exists:", !!pc.current);
//   if (!webrtcReady || !pc.current) return;
  
//   console.log("[WebRTC] Switching to video call");
  
//   try {
//     // video permissions
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
//   isCallActiveRef.current = false; 

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
       
// case "call-rejected":
//   Alert.alert("Call Rejected", "The recipient declined your call");
//   await saveCallToHistory({
//     contact: { name, profileImage: profile_image, userId: targetUserId },
//     direction: 'outgoing',
//     isVideoCall: isVideoCall,
//     status: 'rejected',
//     duration: 0
//   });
//   endCall(false);
//   break;

// case "call-missed":
//   if (!isInitiator) {
//     await saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: 'incoming',
//       isVideoCall: isVideoCall,
//       status: 'missed',
//       duration: 0
//     });
//   }
//   break;

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
  
// const handleRenegotiationOffer = async (offer, isVideo) => {
//   try {
    
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

// const saveCallToHistory = async (callDetails) => {
//   try {
//     console.log('[CallHistory] Saving call:', callDetails);
    
//     const existingHistory = await AsyncStorage.getItem('callHistory');
//     console.log('[CallHistory] Existing history:', existingHistory);
    
//     const history = existingHistory ? JSON.parse(existingHistory) : [];
    
//     const newCall = {
//       id: Date.now().toString(),
//       timestamp: Date.now(),
//       contact: {
//         name: callDetails.contact.name,
//         profileImage: callDetails.contact.profileImage,
//         userId: callDetails.contact.userId
//       },
//       direction: callDetails.direction,
//       isVideoCall: callDetails.isVideoCall,
//       status: callDetails.status,
//       duration: callDetails.duration || 0
//     };
    
//     history.unshift(newCall);
//     const limitedHistory = history.slice(0, 100);
    
//     await AsyncStorage.setItem('callHistory', JSON.stringify(limitedHistory));
//     console.log('[CallHistory] Call saved successfully');
    
//     // Verify it was saved
//     const verify = await AsyncStorage.getItem('callHistory');
//     console.log('[CallHistory] Verification:', verify);
    
//   } catch (error) {
//     console.error('[CallHistory] Error saving call:', error);
//   }
// };

//   // ============ OFFER/ANSWER FLOW ===========
//   const createAndSendInitialOffer = async () => {
  
//   if (hasInitialOfferRef.current) return;
//   await ensurePeerConnection();
//   const ok = await ensureLocalStreamAndAttach(isVideoCall);
//   if (!ok || !pc.current) return;

//   try {
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

//       console.log("[UserDataaaaaaaaa Raw]", userDataRaw);
    
    
//     const callerInfo = {
//       profileImage: userData.profile_picture || userData.profile_image || "", 
//       name: userData.name || "Caller",
//     };

//     console.log("[Caller Info] Sending caller info:", callerInfo); 

//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);

//     sendMessage({
//       type: "offer",
//       offer: {
//         ...offer,
//         targetUserId: targetUserId,
//         callerInfo, // This contains your profile image
//         isVideoCall,
//       },
//     });
//     hasInitialOfferRef.current = true;
//     console.log("[WebRTC] Initial offer created & sent");
//   } catch (e) {
//     console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
//   }
// };

//  const handleIncomingCall = async (offer) => {
//   try {
//     await ensurePeerConnection();
    
//     // Use the video state from the offer
//     const isVideo = offer.isVideoCall || false;
//     setIsVideoCall(isVideo);
    
//     // For video calls, we need to request video permissions and get video stream
//     if (isVideo) {
//       const hasPermission = await requestPermissions();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access camera.");
//         // Fall back to audio only
//         const ok = await ensureLocalStreamAndAttach(false);
//         if (!ok || !pc.current) return;
//       } else {
//         // Get stream with video
//         try {
//           const s = await mediaDevices.getUserMedia({
//             audio: true,
//             video: { facingMode: "user" }
//           });
//           localStream.current = s;
//           setLocalURL(s.toURL());
//         } catch (e) {
//           console.error("[Video] Failed to get video stream:", e);
//           // Fall back to audio only
//           const ok = await ensureLocalStreamAndAttach(false);
//           if (!ok || !pc.current) return;
//         }
//       }
//     } else {
//       // Audio only call
//       const ok = await ensureLocalStreamAndAttach(false);
//       if (!ok || !pc.current) return;
//     }

//     // Attach tracks to peer connection if not already attached
//     if (pc.current && localStream.current) {
//       const existingTracks = pc.current.getSenders().map((s) => s.track);
//       localStream.current.getTracks().forEach((track) => {
//         if (!existingTracks.includes(track)) {
//           pc.current.addTrack(track, localStream.current);
//         }
//       });
//     }

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

// const acceptCall = async () => {
//   console.log("[Action] Accept call initiated. incomingSDP:", !!incomingSDP, "incomingOffer:", !!incomingOffer);
//   stopRinging();
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
  
//   await handleIncomingCall(offer);
// };

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


// // const endCall = (notify = true) => {
// //   isCallActiveRef.current = false;
// //   try { if (notify) sendMessage({ type: "call-ended" }); } catch(e){}
// //   try {
// //     if (ws.current) {
// //       ws.current.onopen = null;
// //       ws.current.onmessage = null;
// //       ws.current.onclose = null;
// //       ws.current.onerror = null;
// //       ws.current.close();
// //       console.log('user_data_ending_call',ws.current);
// //     }
// //   } catch (e) { console.warn("[endCall] error closing ws", e); }
// //   ws.current = null;

// //   stopAudioSession();
// //   cleanupPeerConnection();
// //   navigation.navigate("PHome");
// // };

// // const endCall = async (notify = true) => {
// //   isCallActiveRef.current = false;
  
// //   // Prepare call details for history
// //   const callDetails = {
// //     contact: {
// //       name: name,
// //       profileImage: profile_image,
// //       userId: targetUserId
// //     },
// //     direction: isInitiator ? 'outgoing' : 'incoming',
// //     isVideoCall: isVideoCall,
// //     status: webrtcReady ? 'ended' : 'missed',
// //     duration: callDuration
// //   };
  
// //   // Save to call history
// //   await saveCallToHistory(callDetails);
  
// //   try { 
// //     if (notify) sendMessage({ type: "call-ended" }); 
// //   } catch(e){}
  
// //   try {
// //     if (ws.current) {
// //       ws.current.onopen = null;
// //       ws.current.onmessage = null;
// //       ws.current.onclose = null;
// //       ws.current.onerror = null;
// //       ws.current.close();
// //       console.log('user_data_ending_call',ws.current);
// //     }
// //   } catch (e) { console.warn("[endCall] error closing ws", e); }
// //   ws.current = null;

// //   stopAudioSession();
// //   cleanupPeerConnection();
// //   navigation.navigate("PHome");
// // };

// const endCall = async (notify = true) => {
//     stopRinging();
//   isCallActiveRef.current = false;
  
//   // Prepare call details for history
//   // const callDetails = {
//   //   contact: {
//   //     name: name,
//   //     profileImage: profile_image,
//   //     userId: targetUserId
//   //   },
//   //   direction: isInitiator ? 'outgoing' : 'incoming',
//   //   isVideoCall: isVideoCall,
//   //   status: webrtcReady ? 'ended' : 'missed',
//   //   duration: callDuration
//   // };

//   const callDetails = {
//     contact: {
//       name: name || 'Unknown',
//       profileImage: profile_image || '',
//       userId: targetUserId || 'unknown'
//     },
//     direction: isInitiator ? 'outgoing' : 'incoming',
//     isVideoCall: isVideoCall || false,
//     status: webrtcReady ? 'ended' : 'missed',
//     duration: callDuration || 0
//   };
  
//   try { 
//     if (notify) sendMessage({ type: "call-ended" }); 
//   } catch(e){}
  
//   try {
//     if (ws.current) {
//       ws.current.onopen = null;
//       ws.current.onmessage = null;
//       ws.current.onclose = null;
//       ws.current.onerror = null;
//       ws.current.close();
//     }
//   } catch (e) { console.warn("[endCall] error closing ws", e); }
//   ws.current = null;

//   stopAudioSession();
//   cleanupPeerConnection();
  
//   // Save to call history AFTER cleanup but BEFORE navigation
//   await saveCallToHistory(callDetails);
  
//   navigation.navigate("PHome");
// };


//   // const rejectCall = () => {
//   //   sendMessage({ type: "call-ended" });
//   //   setShowIncomingModal(false);
//   //   setIncomingSDP(null);
//   // };

//   const rejectCall = async () => {
//     stopRinging();
//   sendMessage({ type: "call-rejected" });
  
//   // Save as missed call for the recipient
//   await saveCallToHistory({
//     contact: { name, profileImage: profile_image, userId: targetUserId },
//     direction: 'incoming',
//     isVideoCall: isVideoCall,
//     status: 'rejected',
//     duration: 0
//   });
  
//   setShowIncomingModal(false);
//   setIncomingSDP(null);
//   navigation.navigate("PHome");
// };

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

//   // ================ UI ================
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle={Platform.OS === 'android'? 'light-content': 'dark-content'}/>

//       {webrtcReady ? (
       
       
//         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
//           {isVideoCall && remoteURL ? (
//             <View style={styles.videoContainer}>
//               <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
              
//               {/* Call info overlay */}
//               <View style={styles.callInfoOverlay}>
//                 <Text style={styles.callerName}>{name}</Text> 
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

//             {isVideoCall && (

//               <TouchableOpacity 
//               style={styles.controlButton} 
//               // onPress={isVideoCall ? () => switchToVideoCall()  : () => setIsVideoCall(false)}
//               onPress={switchToVideoCall}
//             >
//               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//                 <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>{isVideoCall ? "Video off" : "Video"}</Text>
//             </TouchableOpacity>

//             )}
            
//             {/* <TouchableOpacity 
//   style={styles.controlButton} 
//   onPress={() => {
//     // Add detailed console logging here
//     console.log("========== VIDEO TOGGLE PRESSED ==========");
//     console.log("Current isVideoCall state:", isVideoCall);
//     console.log("Current call duration:", callDuration);
//     console.log("WebRTC ready state:", webrtcReady);
//     console.log("Local stream exists:", !!localStream.current);
//     console.log("Remote stream exists:", !!remoteStream.current);
//     console.log("PC exists:", !!pc.current);
//     console.log("Is initiator:", isInitiator);
//     console.log("Target user ID:", targetUserId);
    
//     if (localStream.current) {
//       console.log("Local audio tracks:", localStream.current.getAudioTracks().length);
//       console.log("Local video tracks:", localStream.current.getVideoTracks().length);
//     }
    
//     if (remoteStream.current) {
//       console.log("Remote audio tracks:", remoteStream.current.getAudioTracks().length);
//       console.log("Remote video tracks:", remoteStream.current.getVideoTracks().length);
//     }
    
//     console.log("Action to perform:", isVideoCall ? "Turning video OFF" : "Turning video ON");
    
//     // Now call your existing function
//     if (isVideoCall) {
//       console.log("Switching to audio-only call");
//       setIsVideoCall(false);
//       // Note: You might want to also update the UI to show audio-only mode
//       // and possibly renegotiate the connection to remove video
//     } else {
//       console.log("Switching to video call");
//       switchToVideoCall();
//     }
//     console.log("==========================================");
//   }}
// >
//   <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//     <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
//   </View>
//   <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video"}</Text>
// </TouchableOpacity> */}
//           </View>
//         </LinearGradient>
//       ) : (
        
//         <ImageBackground 
//             source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` || require("../assets/images/avatar/blank-profile-picture-973460_1280.png")}} 
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
//                     onPress={() => endCall(true)}
//                     disabled={wsConnected ? false : true}
//                   >
//                     <View style={{
//                       width: 70,
//                       height: 70,
//                       borderRadius: 35,
//                       backgroundColor: wsConnected ? "#ef0505ff" : "#718096",
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginBottom: 10
//                     }}>
//                       <Icon name="call" size={30} color="white" />
//                     </View>
//                     <Text style={{
//                       color: 'white',
//                       fontSize: 14
//                     }}>End Call</Text>
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
//     padding: 0, 
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



