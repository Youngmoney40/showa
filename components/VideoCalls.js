

// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   Alert,
// // // //   PermissionsAndroid,
// // // //   Platform,
// // // //   TouchableOpacity,
// // // //   Modal,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // // } from "react-native";
// // // // import {
// // // //   RTCPeerConnection,
// // // //   RTCIceCandidate,
// // // //   RTCSessionDescription,
// // // //   mediaDevices,
// // // // } from "react-native-webrtc";
// // // // import { encode as btoa } from "base-64";
// // // // import LinearGradient from "react-native-linear-gradient";
// // // // import Icon from "react-native-vector-icons/MaterialIcons";
// // // // import { Image } from "react-native-animatable";
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import { API_ROUTE_IMAGE } from "../api_routing/api";
// // // // import LottieView from 'lottie-react-native';
// // // // import { RTCView } from "react-native-webrtc";


// // // // // ================== CONFIG ==================
// // // // const SIGNALING_SERVER = "ws://api.showapp.ng";
// // // // // ============================================

// // // // export default function VoiceCallScreen({ navigation, route }) {
// // // //   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } =
// // // //     route.params || {};

// // // //   // --- refs/state
// // // //   const ws = useRef(null);
// // // //   const pc = useRef(null);
// // // //   const localStream = useRef(null);
// // // //   const remoteStream = useRef(null);
// // // //   const queuedRemoteCandidates = useRef([]);
// // // //   const rtcConfig = useRef({ iceServers: [] }).current;

// // // //   const [wsConnected, setWsConnected] = useState(false);
// // // //   const [webrtcReady, setWebrtcReady] = useState(false);
// // // //   const [localURL, setLocalURL] = useState(null);
// // // //   const [remoteURL, setRemoteURL] = useState(null);
// // // //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// // // //   const [incomingSDP, setIncomingSDP] = useState(null);
// // // //   const [callDuration, setCallDuration] = useState(0);

// // // //   const isCallerRef = useRef(false);
// // // //   const callTimerRef = useRef(null);
// // // //   const hasInitialOfferRef = useRef(false);
// // // //   const isCleaningUpRef = useRef(false);

// // // //   // =============== PERMISSIONS ===============
// // // //   const requestMicPermission = async () => {
// // // //     if (Platform.OS === "android") {
// // // //       try {
// // // //         const granted = await PermissionsAndroid.request(
// // // //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// // // //           {
// // // //             title: "Microphone Permission",
// // // //             message: "App needs access to your microphone for calls",
// // // //             buttonNeutral: "Ask Me Later",
// // // //             buttonNegative: "Cancel",
// // // //             buttonPositive: "OK",
// // // //           }
// // // //         );
// // // //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// // // //       } catch (err) {
// // // //         console.warn(err);
// // // //         return false;
// // // //       }
// // // //     }
// // // //     return true;
// // // //   };

// // // //   //========VIDEO PERMISSION =============
// // // //   const requestCameraPermission = async () => {
// // // //   if (Platform.OS === "android") {
// // // //     try {
// // // //       const granted = await PermissionsAndroid.request(
// // // //         PermissionsAndroid.PERMISSIONS.CAMERA,
// // // //         {
// // // //           title: "Camera Permission",
// // // //           message: "App needs access to your camera for video calls",
// // // //           buttonNeutral: "Ask Me Later",
// // // //           buttonNegative: "Cancel",
// // // //           buttonPositive: "OK",
// // // //         }
// // // //       );
// // // //       return granted === PermissionsAndroid.RESULTS.GRANTED;
// // // //     } catch (err) {
// // // //       console.warn(err);
// // // //       return false;
// // // //     }
// // // //   }
// // // //   return true;
// // // // };

// // // //   // =============== ICE SERVERS ===============
// // // //   const getIceServers = async () => {
// // // //     try {
// // // //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// // // //         method: "PUT",
// // // //         headers: {
// // // //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //         body: JSON.stringify({ format: "urls" }),
// // // //       });

// // // //       const data = await res.json();
// // // //       let iceServers = [];
// // // //       if (data.v?.iceServers) {
// // // //         iceServers = data.v.iceServers;
// // // //       } else if (data.v?.urls) {
// // // //         iceServers = data.v.urls.map((url) => ({
// // // //           urls: url,
// // // //           username: data.v.username,
// // // //           credential: data.v.credential,
// // // //         }));
// // // //       }

// // // //       rtcConfig.iceServers = iceServers.length
// // // //         ? iceServers
// // // //         : [{ urls: "stun:stun.l.google.com:19302" }];
// // // //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// // // //     } catch (err) {
// // // //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// // // //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// // // //     }
// // // //   };

// // // //   // ============ PEER CONNECTION =============
// // // //   const ensurePeerConnection = async () => {
// // // //     if (pc.current) return;

// // // //     if (!rtcConfig.iceServers.length) {
// // // //       await getIceServers();
// // // //     }

// // // //     pc.current = new RTCPeerConnection(rtcConfig);
// // // //     console.log("[WebRTC] RTCPeerConnection created");

// // // //     // IMPORTANT: we do NOT auto-create offers here (avoid duplicate offers)
// // // //     pc.current.onnegotiationneeded = null;

// // // //     pc.current.onicecandidate = (evt) => {
// // // //       if (evt.candidate) {
// // // //         sendMessage({ type: "candidate", candidate: evt.candidate });
// // // //       }
// // // //     };

// // // //     // pc.current.ontrack = (evt) => {
// // // //     //   if (evt.streams && evt.streams[0]) {
// // // //     //     remoteStream.current = evt.streams[0];
// // // //     //     try {
// // // //     //       setRemoteURL(remoteStream.current.toURL());
// // // //     //       // setRemote2Video(remoteStream)
// // // //     //     } catch {
          
// // // //     //       // RN-webrtc newer versions: toURL may be removed; you can render tracks via RTCView with streamURL prop
// // // //     //     }
// // // //     //     setWebrtcReady(true);
// // // //     //   }
// // // //     // };
// // // // //     pc.current.ontrack = (evt) => {
// // // // //   if (evt.streams && evt.streams[0]) {
// // // // //     remoteStream.current = evt.streams[0];
// // // // //     try {
// // // // //       // Use the stream directly with RTCView
// // // // //       setRemoteURL(remoteStream.current.toURL());
// // // // //     } catch (error) {
// // // // //       console.error("Error setting remote URL:", error);
// // // // //       // Fallback: use the stream object directly
// // // // //       setRemoteURL(remoteStream.current);
// // // // //     }
// // // // //     setWebrtcReady(true);
// // // // //   }
// // // // // };
// // // //   };

// // // //   const ensureLocalStreamAndAttach = async () => {
// // // //   if (!localStream.current) {
// // // //     const hasMic = await requestMicPermission();
// // // //     const hasCam = await requestCameraPermission();
// // // //     if (!hasMic || !hasCam) {
// // // //       Alert.alert("Permission denied", "Cannot access camera or microphone.");
// // // //       return false;
// // // //     }

// // // //     try {
// // // //       const s = await mediaDevices.getUserMedia({
// // // //         audio: true,
// // // //         video: {
// // // //           facingMode: "user", // "user" = front camera, "environment" = back
// // // //         },
// // // //       });
// // // //       localStream.current = s;
// // // //       setLocalURL(s.toURL());
// // // //     } catch (e) {
// // // //       Alert.alert("Error", "Failed to get local stream: " + e.message);
// // // //       return false;
// // // //     }
// // // //   }

// // // //   if (pc.current) {
// // // //     const existingTracks = pc.current.getSenders().map((s) => s.track);
// // // //     localStream.current.getTracks().forEach((track) => {
// // // //       if (!existingTracks.includes(track)) {
// // // //         pc.current.addTrack(track, localStream.current);
// // // //       }
// // // //     });
// // // //   }
// // // //   return true;
// // // // };

// // // //   const drainQueuedCandidates = async () => {
// // // //     if (!pc.current) return;
// // // //     while (queuedRemoteCandidates.current.length > 0) {
// // // //       const c = queuedRemoteCandidates.current.shift();
// // // //       try {
// // // //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// // // //       } catch (err) {
// // // //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// // // //       }
// // // //     }
// // // //   };

// // // //   const cleanupPeerConnection = () => {
// // // //     isCleaningUpRef.current = true;
// // // //     console.log("[Cleanup] Closing peer connection and streams");
// // // //     try {
// // // //       if (pc.current) {
// // // //         pc.current.onicecandidate = null;
// // // //         pc.current.ontrack = null;
// // // //         pc.current.onnegotiationneeded = null;
// // // //         pc.current.close();
// // // //       }
// // // //     } catch {}
// // // //     pc.current = null;

// // // //     try {
// // // //       if (localStream.current) {
// // // //         localStream.current.getTracks().forEach((t) => t.stop());
// // // //       }
// // // //     } catch {}
// // // //     localStream.current = null;
// // // //     remoteStream.current = null;
// // // //     queuedRemoteCandidates.current = [];
// // // //     hasInitialOfferRef.current = false;
// // // //     setLocalURL(null);
// // // //     setRemoteURL(null);
// // // //     setWebrtcReady(false);
// // // //     isCleaningUpRef.current = false;
// // // //   };

// // // //   // =============== SIGNALING ================
// // // //   const sendMessage = (msg) => {
// // // //     if (ws.current?.readyState === WebSocket.OPEN) {
// // // //       ws.current.send(JSON.stringify(msg));
// // // //     }
// // // //   };

// // // //   const connectSignaling = async () => {
// // // //     // Decide which room to connect:
// // // //     // - Initiator connects to callee room: user-<targetUserId>
// // // //     // - Receiver connects to own room: user-<currentUserId>
// // // //     let roomId = "unknown";
// // // //     const token = await AsyncStorage.getItem("userToken");
// // // //     const userDataRaw = await AsyncStorage.getItem("userData");
// // // //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// // // //     const currentUserId = userData?.id;

// // // //     if (isInitiator && targetUserId) {
// // // //       roomId = `user-${targetUserId}`;
// // // //     } else if (currentUserId) {
// // // //       roomId = `user-${currentUserId}`;
// // // //     } else {
// // // //       // fallback (shared room) — not recommended for production
// // // //       roomId = "unique-room-id";
// // // //     }

// // // //     if (ws.current) {
// // // //       try {
// // // //         ws.current.onopen = null;
// // // //         ws.current.onmessage = null;
// // // //         ws.current.onclose = null;
// // // //         ws.current.onerror = null;
// // // //         ws.current.close();
// // // //       } catch {}
// // // //       ws.current = null;
// // // //     }

// // // //     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
// // // //     ws.current = new WebSocket(url);

// // // //     ws.current.onopen = async () => {
// // // //       console.log("[WebSocket] Connected to", roomId);
// // // //       setWsConnected(true);

// // // //       // Prepare PC & local audio immediately
// // // //       await ensurePeerConnection();
// // // //       await ensureLocalStreamAndAttach();

// // // //       // If we navigated here as the initiator, start the call once connected
// // // //       if (isInitiator && targetUserId) {
// // // //         isCallerRef.current = true;
// // // //         await createAndSendInitialOffer();
// // // //       }
// // // //       // If we came with an incoming offer via route, handle it now
// // // //       if (!isInitiator && isIncomingCall && incomingOffer) {
// // // //         await handleIncomingCall(incomingOffer);
// // // //       }
// // // //     };

// // // //     ws.current.onmessage = async (evt) => {
// // // //       let data;
// // // //       try {
// // // //         data = JSON.parse(evt.data);
// // // //       } catch {
// // // //         return;
// // // //       }

// // // //       switch (data.type) {
// // // //         case "offer": {
// // // //           // ignore offers if we are the caller of this session
// // // //           if (isCallerRef.current) return;

// // // //           setIncomingSDP(data.offer);
// // // //           setShowIncomingModal(true);
// // // //           break;
// // // //         }
// // // //         case "answer": {
// // // //           if (!isCallerRef.current) return;
// // // //           if (!pc.current) return;
// // // //           if (pc.current.signalingState === "have-local-offer") {
// // // //             try {
// // // //               await pc.current.setRemoteDescription(
// // // //                 new RTCSessionDescription(data.answer)
// // // //               );
// // // //               await drainQueuedCandidates();
// // // //             } catch (e) {
// // // //               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// // // //             }
// // // //           }
// // // //           break;
// // // //         }
// // // //         case "candidate": {
// // // //           if (!pc.current) return;
// // // //           if (!pc.current.remoteDescription) {
// // // //             queuedRemoteCandidates.current.push(data.candidate);
// // // //           } else {
// // // //             try {
// // // //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// // // //             } catch (e) {
// // // //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// // // //             }
// // // //           }
// // // //           break;
// // // //         }
// // // //         case "call-ended": {
// // // //           Alert.alert("Call ended", "Remote participant left");
// // // //           endCall(false);
// // // //           break;
// // // //         }
// // // //         default:
// // // //           break;
// // // //       }
// // // //     };

// // // //     ws.current.onclose = () => {
// // // //       setWsConnected(false);
// // // //       // Don’t auto-clean here if we are navigating away via endCall
// // // //       if (!isCleaningUpRef.current) {
// // // //         cleanupPeerConnection();
// // // //       }
// // // //     };

// // // //     ws.current.onerror = (err) => {
// // // //       console.error("[WebSocket] Error:", err?.message || err);
// // // //     };
// // // //   };

// // // //   // ============ OFFER/ANSWER FLOW ===========
// // // //   const createAndSendInitialOffer = async () => {
// // // //   if (hasInitialOfferRef.current) return;
// // // //   await ensurePeerConnection();
// // // //   const ok = await ensureLocalStreamAndAttach();
// // // //   if (!ok || !pc.current) return;

// // // //   try {
// // // //     const userDataRaw = await AsyncStorage.getItem("userData");
// // // //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// // // //     console.log('user_raw_data',userData);
// // // //     const callerInfo = {
// // // //       profileImage: userData.profile_picture || "",
// // // //       name: userData.name || "Unknown Caller",
// // // //     };

// // // //     const offer = await pc.current.createOffer();
// // // //     await pc.current.setLocalDescription(offer);

// // // //     sendMessage({
// // // //       type: "offer",
// // // //       offer: {
// // // //         ...offer,
// // // //         targetUserId: targetUserId,
// // // //         callerInfo, //passing caller info
// // // //       },
// // // //     });
// // // //     hasInitialOfferRef.current = true;
// // // //     console.log("[WebRTC] Initial offer created & sent");
// // // //   } catch (e) {
// // // //     console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// // // //   }
// // // // };


// // // //   // const handleIncomingCall = async (offer) => {
// // // //   //   try {
// // // //   //     await ensurePeerConnection();
// // // //   //     const ok = await ensureLocalStreamAndAttach();
// // // //   //     if (!ok || !pc.current) return;

// // // //   //     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// // // //   //     await drainQueuedCandidates();

// // // //   //     const answer = await pc.current.createAnswer();
// // // //   //     await pc.current.setLocalDescription(answer);
// // // //   //     sendMessage({ type: "answer", answer });

// // // //   //     setWebrtcReady(true);
// // // //   //     setShowIncomingModal(false);
// // // //   //     setIncomingSDP(null);
// // // //   //   } catch (error) {
// // // //   //     console.error("Error handling incoming call:", error?.message || error);
// // // //   //     Alert.alert("Error", "Failed to accept call");
// // // //   //   }
// // // //   // };

// // // //   const handleIncomingCall = async (offer) => {
// // // //   try {
// // // //     await ensurePeerConnection();
// // // //     const ok = await ensureLocalStreamAndAttach();
// // // //     if (!ok || !pc.current) return;

// // // //     // Make sure offer is a proper RTCSessionDescription
// // // //     const sessionDescription = new RTCSessionDescription(offer);
// // // //     await pc.current.setRemoteDescription(sessionDescription);
// // // //     await drainQueuedCandidates();

// // // //     const answer = await pc.current.createAnswer();
// // // //     await pc.current.setLocalDescription(answer);
    
// // // //     // Send the answer back through the signaling server
// // // //     sendMessage({ 
// // // //       type: "answer", 
// // // //       answer: answer 
// // // //     });

// // // //     setWebrtcReady(true);
// // // //     setShowIncomingModal(false);
// // // //     setIncomingSDP(null);
// // // //   } catch (error) {
// // // //     console.error("Error handling incoming call:", error?.message || error);
// // // //     Alert.alert("Error", "Failed to accept call");
// // // //   }
// // // // };

// // // //   // ================ LIFECYCLE ================
// // // //   useEffect(() => {
// // // //     connectSignaling();
// // // //     return () => {
// // // //       endCall(false);
// // // //     };
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, []);

// // // //   // Call timer
// // // //   useEffect(() => {
// // // //     if (webrtcReady) {
// // // //       const startTime = Date.now();
// // // //       callTimerRef.current = setInterval(() => {
// // // //         setCallDuration(Math.floor((Date.now() - startTime) / 1000));
// // // //       }, 1000);
// // // //     } else {
// // // //       if (callTimerRef.current) {
// // // //         clearInterval(callTimerRef.current);
// // // //         callTimerRef.current = null;
// // // //         setCallDuration(0);
// // // //       }
// // // //     }
// // // //     return () => {
// // // //       if (callTimerRef.current) clearInterval(callTimerRef.current);
// // // //     };
// // // //   }, [webrtcReady]);

// // // //   // ================ CONTROLS =================
// // // //   const startCall = async () => {
// // // //     isCallerRef.current = true;
// // // //     await createAndSendInitialOffer();
// // // //   };

// // // //   const acceptCall = async () => {
// // // //     isCallerRef.current = false;
// // // //     const offer = incomingSDP || incomingOffer;
// // // //     if (!offer) {
// // // //       Alert.alert("No offer", "No incoming offer to accept.");
// // // //       return;
// // // //     }
// // // //     await handleIncomingCall(offer);
// // // //   };

// // // //   const rejectCall = () => {
// // // //     sendMessage({ type: "call-ended" });
// // // //     setShowIncomingModal(false);
// // // //     setIncomingSDP(null);
// // // //     // no PC changes needed yet
// // // //   };

// // // //   const endCall = (notify = true) => {
// // // //     try {
// // // //       if (notify) sendMessage({ type: "call-ended" });
// // // //     } catch {}
// // // //     try {
// // // //       if (ws.current) {
// // // //         ws.current.onopen = null;
// // // //         ws.current.onmessage = null;
// // // //         ws.current.onclose = null;
// // // //         ws.current.onerror = null;
// // // //         ws.current.close();
// // // //       }
// // // //     } catch {}
// // // //     ws.current = null;
// // // //     cleanupPeerConnection();
// // // //      navigation.navigate('PHome');
// // // //   };

// // // //   // ================ UI ================
// // // //   const formatTime = (seconds) => {
// // // //     const mins = Math.floor(seconds / 60);
// // // //     const secs = seconds % 60;
// // // //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="light-content" />

// // // //       {webrtcReady ? (
// // // //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>

// // // //     {/* Remote Video (Main View) ========================================*/}
// // // //     {remoteURL && (
// // // //       <RTCView
// // // //         streamURL={remoteURL}
// // // //         style={StyleSheet.absoluteFill}
// // // //         objectFit="cover"
// // // //         mirror={false}
// // // //         zOrder={0}
// // // //       />
// // // //     )}
    
// // // //     {/* Local Video (Picture-in-Picture) */}
// // // //     {localURL && (
// // // //       <RTCView
// // // //         streamURL={localURL}
// // // //         style={styles.localVideo}
// // // //         objectFit="cover"
// // // //         mirror={true}
// // // //         zOrder={1}
// // // //       />
// // // //     )}
    
// // // //     {/* Overlay UI Elements */}
// // // //     <View style={styles.callHeader}>
// // // //       <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
// // // //       <Text style={styles.callerName}>{name}</Text>
// // // //       <Text style={styles.callStatus}>Connected</Text>
// // // //     </View>

// // // //     <View style={styles.avatarContainer}>
// // // //       {/* Only show avatar if video is not available */}
// // // //       {!remoteURL && (
// // // //         <View style={styles.avatar}>
// // // //           <Image
// // // //             source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // // //             style={styles.avatarImage}
// // // //             resizeMode="cover"
// // // //           />
// // // //         </View>
// // // //       )}
// // // //     </View>
// // // //           <View style={styles.callHeader}>
// // // //             <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
// // // //             <Text style={styles.callerName}>{name}</Text>
// // // //             <Text style={styles.callStatus}>Connected</Text>
// // // //           </View>

// // // //           <View style={styles.avatarContainer}>
// // // //             <View style={styles.avatar}>
// // // //               <Image
// // // //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // // //                 style={styles.avatarImage}
// // // //                 resizeMode="cover"
// // // //               />
// // // //             </View>
// // // //           </View>

// // // //           <View style={styles.callControls}>
// // // //             <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
// // // //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// // // //                 <Icon name="mic-off" size={24} color="white" />
// // // //               </View>
// // // //               <Text style={styles.controlText}>Mute</Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// // // //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// // // //                 <Icon name="call-end" size={24} color="white" />
// // // //               </View>
// // // //               <Text style={styles.controlText}>End</Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
// // // //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// // // //                 <Icon name="volume-up" size={24} color="white" />
// // // //               </View>
// // // //               <Text style={styles.controlText}>Speaker</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </LinearGradient>
// // // //       ) : (
// // // //         <LinearGradient colors={["#1e1e1fff", "#080808ff"]} style={styles.preCallScreen}>
// // // //           <View style={{
// // // //               flex: 1,
// // // //               backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// // // //               justifyContent: 'center',
// // // //               alignItems: 'center',
// // // //               padding: 20
// // // //             }}>
// // // //               <View style={{
// // // //                 alignItems: 'center',
// // // //                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // // //                 borderRadius: 20,
// // // //                 padding: 30,
// // // //                 width: '100%',
// // // //                 maxWidth: 350,
// // // //                 shadowColor: '#000',
// // // //                 shadowOffset: { width: 0, height: 10 },
// // // //                 shadowOpacity: 0.2,
// // // //                 shadowRadius: 20,
// // // //                 elevation: 10
// // // //               }}>
// // // //                 <View style={{
// // // //                   width: 150,
// // // //                   height: 150,
// // // //                   borderRadius: 75,
// // // //                   marginBottom: 25,
// // // //                   justifyContent: 'center',
// // // //                   alignItems: 'center',
// // // //                   backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // // //                   borderWidth: 3,
// // // //                   borderColor: 'rgba(255, 255, 255, 0.3)',
// // // //                   position: 'relative',
// // // //                   overflow: 'hidden'
// // // //                 }}>
                  
// // // //                   <Image
// // // //                     source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // // //                     style={{
// // // //                       width: 180,
// // // //                       height: 180,
// // // //                       borderRadius: 70,
// // // //                       position: 'absolute',
                      
// // // //                     }}
// // // //                     resizeMode="cover"
// // // //                   />
// // // //                 </View>
                
// // // //                 <Text style={{
// // // //                   fontSize: 28,
// // // //                   fontWeight: '700',
// // // //                   color: '#fff',
// // // //                   marginBottom: 8,
// // // //                   textShadowColor: 'rgba(0, 0, 0, 0.3)',
// // // //                   textShadowOffset: { width: 1, height: 1 },
// // // //                   textShadowRadius: 5
// // // //                 }}>Calling {name}</Text>
                
// // // //                 <Text style={{
// // // //                   fontSize: 16,
// // // //                   color: 'rgba(255, 255, 255, 0.9)',
// // // //                   textAlign: 'center',
// // // //                   lineHeight: 22,
// // // //                   marginTop: 5
// // // //                 }}>
// // // //                   {wsConnected 
// // // //                     ? (isInitiator 
// // // //                         ? "Please wait while call is connecting..." 
// // // //                         : "Waiting for call") 
// // // //                     : "Connecting..."
// // // //                   }
// // // //                 </Text>
                
                
// // // //               </View>
// // // //             </View>
// // // //         </LinearGradient>

        


// // // //       )}

// // // //       <View style={{ flex: 1, backgroundColor: "black" }}>
// // // //   {remoteURL && (
// // // //     <RTCView
// // // //       streamURL={remoteURL}
// // // //       style={{ flex: 1 }}
// // // //       objectFit="cover"
// // // //       mirror={true}
// // // //     />
// // // //   )}
// // // //   {localURL && (
// // // //     <RTCView
// // // //       streamURL={localURL}
// // // //       style={{
// // // //         position: "absolute",
// // // //         bottom: 20,
// // // //         right: 20,
// // // //         width: 120,
// // // //         height: 160,
// // // //         backgroundColor: "#000",
// // // //       }}
// // // //       objectFit="cover"
// // // //       mirror={true}
// // // //     />
// // // //   )}
// // // // </View>


// // // //       {/* Incoming Call Modal */}
// // // //       <Modal
// // // //         visible={showIncomingModal}
// // // //         transparent={true}
// // // //         animationType="fade"
// // // //         onRequestClose={rejectCall}
// // // //       >
// // // //         <View style={styles.modalOverlay}>
// // // //           <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.modalContainer}>
// // // //             <View style={styles.modalContent}>
// // // //               <Text style={styles.incomingCallText}>Incoming Call</Text>

// // // //               <View style={styles.callerInfo}>
// // // //                 <View style={styles.modalAvatar}>
// // // //                   <Image
// // // //                     source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // // //                     style={styles.modalAvatarImage}
// // // //                     resizeMode="cover"
// // // //                   />
// // // //                 </View>
// // // //                 <Text style={styles.modalCallerName}>{name}</Text>
// // // //                 <Text style={styles.modalCallType}>Voice Call</Text>
// // // //               </View>

// // // //               <View style={styles.modalButtons}>
// // // //                 <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
// // // //                   <View style={styles.rejectButtonInner}>
// // // //                     <Icon name="call-end" size={30} color="white" />
// // // //                   </View>
// // // //                   <Text style={styles.buttonText}>Decline</Text>
// // // //                 </TouchableOpacity>

// // // //                 <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
// // // //                   <View style={styles.acceptButtonInner}>
// // // //                     <Icon name="call" size={30} color="white" />
// // // //                   </View>
// // // //                   <Text style={styles.buttonText}>Accept</Text>
// // // //                 </TouchableOpacity>
// // // //               </View>
// // // //             </View>
// // // //           </LinearGradient>
// // // //         </View>
// // // //       </Modal>
// // // //     </SafeAreaView>
// // // //   );
// // // // }


// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //   },
// // // //   callScreen: {
// // // //     flex: 1,
// // // //     justifyContent: 'space-between',
// // // //     padding: 20,
// // // //   },
// // // //   preCallScreen: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
  
// // // //   preCallContent: {
// // // //     alignItems: 'center',
// // // //     width: '100%',
// // // //     padding: 20,
// // // //   },
// // // //   callHeader: {
// // // //     alignItems: 'center',
// // // //     marginTop: 40,
// // // //   },
// // // //   callDuration: {
// // // //     fontSize: 16,
// // // //     color: 'white',
// // // //     opacity: 0.8,
// // // //   },
// // // //   callerName: {
// // // //     fontSize: 28,
// // // //     fontWeight: 'bold',
// // // //     color: 'white',
// // // //     marginTop: 10,
// // // //   },
// // // //   callStatus: {
// // // //     fontSize: 16,
// // // //     color: '#a0aec0',
// // // //     marginTop: 5,
// // // //   },
// // // //   avatarContainer: {
// // // //     alignItems: 'center',
// // // //     marginVertical: 30,
// // // //   },
// // // //   avatar: {
// // // //     width: 150,
// // // //     height: 150,
// // // //     borderRadius: 75,
// // // //     backgroundColor: '#4a5568',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderWidth: 3,
// // // //     borderColor: 'rgba(255,255,255,0.2)',
// // // //   },
// // // //   largeAvatar: {
// // // //     width: 200,
// // // //     height: 200,
// // // //     borderRadius: 100,
// // // //     //backgroundColor: '#4a5568',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 20,
// // // //     borderWidth: 5,
// // // //     borderColor: 'rgba(255,255,255,0.8)',
// // // //   },
// // // //   avatarImage: {
// // // //     width: '100%',
// // // //     height: '100%',
// // // //     borderRadius: 75,
// // // //   },
// // // //     Callimage: {
// // // //     width: '100%',
// // // //     height: '100%',
// // // //     marginBottom: 30,
// // // //   },
// // // //   largeAvatarImage: {
// // // //     width: '80%',
// // // //     height: '80%',
// // // //     borderRadius: 100,
// // // //   },
// // // //   contactName: {
// // // //     fontSize: 32,
// // // //     fontWeight: 'bold',
// // // //     color: '#2d3748',
// // // //     marginTop: 10,
// // // //   },
// // // //   contactStatus: {
// // // //     fontSize: 16,
// // // //     color: '#718096',
// // // //     marginTop: 5,
// // // //   },
// // // //   callControls: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-around',
// // // //     marginBottom: 40,
// // // //   },
// // // //   preCallControls: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-around',
// // // //     width: '100%',
// // // //     marginTop: 50,
// // // //   },
// // // //   controlButton: {
// // // //     alignItems: 'center',
// // // //   },
// // // //   actionButton: {
// // // //     alignItems: 'center',
// // // //   },
// // // //   controlIcon: {
// // // //     width: 60,
// // // //     height: 60,
// // // //     borderRadius: 30,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },
// // // //   callButton: {
// // // //     width: 70,
// // // //     height: 70,
// // // //     borderRadius: 35,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 10,
// // // //   },
// // // //   controlText: {
// // // //     color: 'white',
// // // //     fontSize: 14,
// // // //   },
// // // //   actionButtonText: {
// // // //     color: '#2d3748',
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //   },
// // // //   disabledButton: {
// // // //     opacity: 0.5,
// // // //   },
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(0,0,0,0.8)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   modalContainer: {
// // // //     width: '90%',
// // // //     borderRadius: 20,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   modalContent: {
// // // //     padding: 30,
// // // //     alignItems: 'center',
// // // //   },
// // // //   incomingCallText: {
// // // //     fontSize: 24,
// // // //     color: 'white',
// // // //     fontWeight: 'bold',
// // // //     marginBottom: 20,
// // // //   },
// // // //   callerInfo: {
// // // //     alignItems: 'center',
// // // //     marginBottom: 40,
// // // //   },
// // // //   modalAvatar: {
// // // //     width: 100,
// // // //     height: 100,
// // // //     borderRadius: 50,
// // // //     backgroundColor: '#4a5568',
// // // //     marginBottom: 15,
// // // //     borderWidth: 3,
// // // //     borderColor: 'rgba(255,255,255,0.2)',
// // // //   },
// // // //   modalAvatarImage: {
// // // //     width: '100%',
// // // //     height: '100%',
// // // //     borderRadius: 50,
// // // //   },
// // // //   modalCallerName: {
// // // //     fontSize: 22,
// // // //     color: 'white',
// // // //     fontWeight: 'bold',
// // // //     marginBottom: 5,
// // // //   },
// // // //   modalCallType: {
// // // //     fontSize: 16,
// // // //     color: '#a0aec0',
// // // //   },
// // // //   modalButtons: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-around',
// // // //     width: '100%',
// // // //   },
// // // //   rejectButton: {
// // // //     alignItems: 'center',
// // // //   },
// // // //   acceptButton: {
// // // //     alignItems: 'center',
// // // //   },
// // // //   rejectButtonInner: {
// // // //     width: 70,
// // // //     height: 70,
// // // //     borderRadius: 35,
// // // //     backgroundColor: '#e53e3e',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },
// // // //   acceptButtonInner: {
// // // //     width: 70,
// // // //     height: 70,
// // // //     borderRadius: 35,
// // // //     backgroundColor: '#38a169',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },
// // // //   buttonText: {
// // // //     color: 'white',
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //   },
// // // //   localVideo: {
// // // //     position: "absolute",
// // // //     bottom: 20,
// // // //     right: 20,
// // // //     width: 120,
// // // //     height: 160,
// // // //     backgroundColor: "#000",
// // // //     borderRadius: 10,
// // // //     overflow: "hidden",
// // // //     borderWidth: 1,
// // // //     borderColor: "rgba(255,255,255,0.3)",
// // // //     zIndex: 10,
// // // //   },
  
// // // //   callScreen: {
// // // //     flex: 1,
// // // //     justifyContent: 'space-between',
// // // //     padding: 20,
// // // //     overflow: "hidden", // Important for RTCView positioning
// // // //   },
// // // // });


// // // import React, { useEffect, useRef, useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   Alert,
// // //   PermissionsAndroid,
// // //   Platform,
// // //   TouchableOpacity,
// // //   Modal,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   ImageBackground,
// // // } from "react-native";
// // // import {
// // //   RTCPeerConnection,
// // //   RTCIceCandidate,
// // //   RTCSessionDescription,
// // //   mediaDevices,
// // //   MediaStream,
// // //   RTCView,
// // // } from "react-native-webrtc";
// // // import { encode as btoa } from "base-64";
// // // import LinearGradient from "react-native-linear-gradient";
// // // import Icon from "react-native-vector-icons/MaterialIcons";
// // // import { Image } from "react-native-animatable";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // // ================== CONFIG ==================
// // // const SIGNALING_SERVER = "ws://api.showapp.ng";
// // // // ============================================

// // // export default function VideoCallScreen({ navigation, route }) {
// // //   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } = route.params || {};

// // //   /// --- refs/state
// // //   const ws = useRef(null);
// // //   const pc = useRef(null);
// // //   const localStream = useRef(null);
// // //   const remoteStream = useRef(null);
// // //   const queuedRemoteCandidates = useRef([]);
// // //   const rtcConfig = useRef({ iceServers: [] }).current;

// // //   const [wsConnected, setWsConnected] = useState(false);
// // //   const [webrtcReady, setWebrtcReady] = useState(false);
// // //   const [localURL, setLocalURL] = useState(null);
// // //   const [remoteURL, setRemoteURL] = useState(null);
// // //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// // //   const [incomingSDP, setIncomingSDP] = useState(null);
// // //   const [callDuration, setCallDuration] = useState(0);
// // //   const [isCameraFront, setIsCameraFront] = useState(true);

// // //   const isCallerRef = useRef(false);
// // //   const callTimerRef = useRef(null);
// // //   const hasInitialOfferRef = useRef(false);
// // //   const isCleaningUpRef = useRef(false);
// // //   const isCallActiveRef = useRef(true);

// // //   // =============== PERMISSIONS ===============
// // //   const requestPermissions = async () => {
// // //     if (Platform.OS === "android") {
// // //       try {
// // //         const grant = await PermissionsAndroid.request(
// // //           PermissionsAndroid.PERMISSIONS.CAMERA
// // //         );
// // //         return grant === PermissionsAndroid.RESULTS.GRANTED;
// // //       } catch (err) {
// // //         console.warn(err);
// // //         return false;
// // //       }
// // //     }
// // //     return true;
// // //   };

// // //   // =============== ICE SERVERS ===============
// // //   const getIceServers = async () => {
// // //     try {
// // //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// // //         method: "PUT",
// // //         headers: {
// // //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ format: "urls" }),
// // //       });

// // //       const data = await res.json();
// // //       let iceServers = [];
// // //       if (data.v?.iceServers) {
// // //         iceServers = data.v.iceServers;
// // //       } else if (data.v?.urls) {
// // //         iceServers = data.v.urls.map((url) => ({
// // //           urls: url,
// // //           username: data.v.username,
// // //           credential: data.v.credential,
// // //         }));
// // //       }

// // //       rtcConfig.iceServers = iceServers.length
// // //         ? iceServers
// // //         : [{ urls: "stun:stun.l.google.com:19302" }];
// // //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// // //     } catch (err) {
// // //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// // //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// // //     }
// // //   };

// // //   const ensurePeerConnection = async () => {
// // //     if (pc.current) return;

// // //     if (!rtcConfig.iceServers.length) {
// // //       await getIceServers();
// // //     }

// // //     pc.current = new RTCPeerConnection(rtcConfig);
// // //     console.log("[WebRTC] RTCPeerConnection created");

// // //     pc.current.onnegotiationneeded = () => {
// // //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// // //     };

// // //     pc.current.onicecandidate = (evt) => {
// // //       if (evt.candidate) {
// // //         sendMessage({ type: "candidate", candidate: evt.candidate });
// // //       }
// // //     };

// // //     pc.current.ontrack = (evt) => {
// // //       console.log("[WebRTC] Track received:", evt.track?.kind);
// // //       if (evt.streams && evt.streams[0]) {
// // //         remoteStream.current = evt.streams[0];
// // //         try { setRemoteURL(remoteStream.current.toURL()); } catch {}
// // //         setWebrtcReady(true);
// // //       }
// // //     };

// // //     pc.current.onconnectionstatechange = () => {
// // //       if (!pc.current) {
// // //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// // //         return;
// // //       }
// // //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// // //       if (pc.current.connectionState === "failed") {
// // //         console.warn("[WebRTC] Connection failed");
// // //         saveCallToHistory({
// // //           contact: { name, profileImage: profile_image, userId: targetUserId },
// // //           direction: isInitiator ? 'outgoing' : 'incoming',
// // //           isVideoCall: true,
// // //           status: 'failed',
// // //           duration: callDuration
// // //         });
// // //       }
// // //     };

// // //     pc.current.oniceconnectionstatechange = () => {
// // //       if (!pc.current) return;
// // //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// // //     };
// // //   };

// // //   const ensureLocalStreamAndAttach = async () => {
// // //     if (!localStream.current) {
// // //       const hasPermission = await requestPermissions();
// // //       if (!hasPermission) {
// // //         Alert.alert("Permission denied", "Cannot access camera.");
// // //         return false;
// // //       }
// // //       try {
// // //         const s = await mediaDevices.getUserMedia({
// // //           video: { facingMode: isCameraFront ? "user" : "environment" },
// // //         });
// // //         localStream.current = s;
// // //         try {
// // //           setLocalURL(s.toURL());
// // //         } catch {
          
// // //         }
// // //       } catch (e) {
// // //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// // //         return false;
// // //       }
// // //     }

// // //     if (pc.current) {
// // //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// // //       localStream.current.getTracks().forEach((track) => {
// // //         if (!existingTracks.includes(track)) {
// // //           pc.current.addTrack(track, localStream.current);
// // //         }
// // //       });
// // //     }
// // //     return true;
// // //   };

// // //   const switchCamera = async () => {
// // //     if (!localStream.current) return;
    
// // //     const videoTrack = localStream.current.getVideoTracks()[0];
// // //     if (videoTrack) {
// // //       videoTrack._switchCamera();
// // //       setIsCameraFront(!isCameraFront);
// // //     }
// // //   };

// // //   const drainQueuedCandidates = async () => {
// // //     if (!pc.current) return;
// // //     while (queuedRemoteCandidates.current.length > 0) {
// // //       const c = queuedRemoteCandidates.current.shift();
// // //       try {
// // //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// // //       } catch (err) {
// // //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// // //       }
// // //     }
// // //   };

// // //   const cleanupPeerConnection = () => {
// // //     console.log("[Cleanup] Closing peer connection and streams");
// // //     isCleaningUpRef.current = true;
// // //     isCallActiveRef.current = false;

// // //     try {
// // //       if (pc.current) {
// // //         pc.current.onicecandidate = null;
// // //         pc.current.ontrack = null;
// // //         pc.current.onnegotiationneeded = null;
// // //         pc.current.onconnectionstatechange = null;
// // //         pc.current.oniceconnectionstatechange = null;
// // //         pc.current.close();
// // //       }
// // //     } catch (e) {
// // //       console.warn("[Cleanup] pc close error", e);
// // //     }
// // //     pc.current = null;

// // //     try {
// // //       if (localStream.current) {
// // //         localStream.current.getTracks().forEach((t) => t.stop());
// // //       }
// // //     } catch (e) {
// // //       console.warn("[Cleanup] localStream stop error", e);
// // //     }
// // //     localStream.current = null;
// // //     remoteStream.current = null;
// // //     queuedRemoteCandidates.current = [];
// // //     hasInitialOfferRef.current = false;

// // //     setLocalURL(null);
// // //     setRemoteURL(null);
// // //     setWebrtcReady(false);
// // //     setIsCameraFront(true);
// // //     isCleaningUpRef.current = false;
// // //   };

// // //   // =============== SIGNALING ================
// // //   const sendMessage = (msg) => {
// // //     if (ws.current?.readyState === WebSocket.OPEN) {
// // //       ws.current.send(JSON.stringify(msg));
// // //     }
// // //   };

// // //   const connectSignaling = async () => {
// // //     let roomId = "unknown";
// // //     const token = await AsyncStorage.getItem("userToken");
// // //     const userDataRaw = await AsyncStorage.getItem("userData");
// // //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// // //     const currentUserId = userData?.id;

// // //     if (isInitiator && targetUserId) {
// // //       roomId = `user-${targetUserId}`;
// // //     } else if (currentUserId) {
// // //       roomId = `user-${currentUserId}`;
// // //     } else {
// // //       roomId = "unique-room-id";
// // //     }

// // //     if (ws.current) {
// // //       try {
// // //         ws.current.onopen = null;
// // //         ws.current.onmessage = null;
// // //         ws.current.onclose = null;
// // //         ws.current.onerror = null;
// // //         ws.current.close();
// // //       } catch {}
// // //       ws.current = null;
// // //     }

// // //     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
// // //     ws.current = new WebSocket(url);

// // //     ws.current.onopen = async () => {
// // //       //console.log("[WebSocket] Connected to", roomId);
// // //       setWsConnected(true);

// // //       await ensurePeerConnection();
// // //       await ensureLocalStreamAndAttach();

// // //       if (isInitiator && targetUserId) {
// // //         isCallerRef.current = true;
// // //         await createAndSendInitialOffer();
// // //       }
// // //       if (!isInitiator && isIncomingCall && incomingOffer) {
// // //         await handleIncomingCall(incomingOffer);
// // //       }
// // //     };

// // //     ws.current.onmessage = async (evt) => {
// // //       let data;
// // //       try {
// // //         data = JSON.parse(evt.data);
// // //       } catch {
// // //         return;
// // //       }

// // //       console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation,
// // //                   "pcExists:", !!pc.current, "isCallActive:", isCallActiveRef.current);

// // //       if (!isCallActiveRef.current && data?.type !== "call-ended") {
// // //         console.warn("[WS] Ignoring message after call ended:", data?.type);
// // //         return;
// // //       }

// // //       switch (data.type) {
// // //         case "offer": {
// // //           if (data.isRenegotiation) {
// // //             console.log("[WebRTC] Renegotiation offer received");
// // //             try {
// // //               await ensurePeerConnection();
// // //               await ensureLocalStreamAndAttach();
// // //             } catch (err) {
// // //               console.error("[WebRTC] Failed to prepare pc/local for renegotiation:", err);
// // //               return;
// // //             }
// // //             await handleRenegotiationOffer(data.offer);
// // //           } else {
// // //             if (isCallerRef.current) return;
// // //             setIncomingSDP(data.offer);
// // //             setShowIncomingModal(true);
// // //           }
// // //           break;
// // //         }
// // //         case "answer": {
// // //           if (!isCallerRef.current) return;
// // //           if (!pc.current) return;
// // //           if (pc.current.signalingState === "have-local-offer") {
// // //             try {
// // //               await pc.current.setRemoteDescription(
// // //                 new RTCSessionDescription(data.answer)
// // //               );
// // //               await drainQueuedCandidates();
// // //             } catch (e) {
// // //               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// // //             }
// // //           }
// // //           break;
// // //         }
// // //         case "candidate": {
// // //           if (!pc.current) return;
// // //           if (!pc.current.remoteDescription) {
// // //             queuedRemoteCandidates.current.push(data.candidate);
// // //           } else {
// // //             try {
// // //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// // //             } catch (e) {
// // //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// // //             }
// // //           }
// // //           break;
// // //         }
// // //         case "call-ended": {
// // //           Alert.alert("Call Ended", "Your call partner has disconnected");
// // //           endCall(false);
// // //           break;
// // //         }
// // //         case "call-rejected": {
// // //           Alert.alert("Call Rejected", "The recipient declined your call");
// // //           await saveCallToHistory({
// // //             contact: { name, profileImage: profile_image, userId: targetUserId },
// // //             direction: 'outgoing',
// // //             isVideoCall: true,
// // //             status: 'rejected',
// // //             duration: 0
// // //           });
// // //           endCall(false);
// // //           break;
// // //         }
// // //         case "call-missed": {
// // //           if (!isInitiator) {
// // //             await saveCallToHistory({
// // //               contact: { name, profileImage: profile_image, userId: targetUserId },
// // //               direction: 'incoming',
// // //               isVideoCall: true,
// // //               status: 'missed',
// // //               duration: 0
// // //             });
// // //           }
// // //           break;
// // //         }
// // //       }
// // //     };

// // //     ws.current.onclose = () => {
// // //       setWsConnected(false);
// // //       if (!isCleaningUpRef.current) {
// // //         cleanupPeerConnection();
// // //       }
// // //     };

// // //     ws.current.onerror = (err) => {
// // //       console.error("[WebSocket] Error:", err?.message || err);
// // //     };
// // //   };

// // //   const handleRenegotiationOffer = async (offer) => {
// // //     try {
// // //       if (!pc.current) {
// // //         console.warn("[WebRTC] No pc available, trying to recreate for renegotiation");
// // //         await ensurePeerConnection();
// // //         await ensureLocalStreamAndAttach();
// // //       }

// // //       if (!pc.current) {
// // //         console.error("[WebRTC] Still no pc after attempting recreate — abort renegotiation");
// // //         return;
// // //       }

// // //       if (pc.current.signalingState === "closed") {
// // //         console.warn("[WebRTC] pc already closed — ignoring renegotiation");
// // //         return;
// // //       }

// // //       console.log("[WebRTC] setting remote description for renegotiation. signalingState:", pc.current.signalingState);
// // //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// // //       await drainQueuedCandidates();

// // //       const answer = await pc.current.createAnswer();
// // //       await pc.current.setLocalDescription(answer);

// // //       sendMessage({
// // //         type: "answer",
// // //         answer,
// // //         isVideoCall: true
// // //       });

// // //       console.log("[WebRTC] Renegotiation answer sent");
// // //     } catch (error) {
// // //       console.error("[WebRTC] Renegotiation failed:", error);
// // //     }
// // //   };

// // //   const saveCallToHistory = async (callDetails) => {
// // //     try {
// // //       console.log('[CallHistory] Saving call:', callDetails);
// // //       const existingHistory = await AsyncStorage.getItem('callHistory');
// // //       console.log('[CallHistory] Existing history:', existingHistory);
      
// // //       const history = existingHistory ? JSON.parse(existingHistory) : [];
      
// // //       const newCall = {
// // //         id: Date.now().toString(),
// // //         timestamp: Date.now(),
// // //         contact: {
// // //           name: callDetails.contact.name,
// // //           profileImage: callDetails.contact.profileImage,
// // //           userId: callDetails.contact.userId
// // //         },
// // //         direction: callDetails.direction,
// // //         isVideoCall: true,
// // //         status: callDetails.status,
// // //         duration: callDetails.duration || 0
// // //       };
      
// // //       history.unshift(newCall);
// // //       const limitedHistory = history.slice(0, 100);
      
// // //       await AsyncStorage.setItem('callHistory', JSON.stringify(limitedHistory));
// // //       console.log('[CallHistory] Call saved successfully');
// // //     } catch (error) {
// // //       console.error('[CallHistory] Error saving call:', error);
// // //     }
// // //   };

// // //   // ============ OFFER/ANSWER FLOW ===========
// // //   const createAndSendInitialOffer = async () => {
// // //     if (hasInitialOfferRef.current) return;
// // //     await ensurePeerConnection();
// // //     const ok = await ensureLocalStreamAndAttach();
// // //     if (!ok || !pc.current) return;

// // //     try {
// // //       const userDataRaw = await AsyncStorage.getItem("userData");
// // //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// // //       const callerInfo = {
// // //         profileImage: userData.profile_picture || "",
// // //         name: userData.name || "Caller",
// // //       };

// // //       const offer = await pc.current.createOffer();
// // //       await pc.current.setLocalDescription(offer);

// // //       sendMessage({
// // //         type: "offer",
// // //         offer: {
// // //           ...offer,
// // //           targetUserId: targetUserId,
// // //           callerInfo,
// // //           isVideoCall: true,
// // //         },
// // //       });
// // //       hasInitialOfferRef.current = true;
// // //       console.log("[WebRTC] Initial offer created & sent");
// // //     } catch (e) {
// // //       console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// // //     }
// // //   };

// // //   const handleIncomingCall = async (offer) => {
// // //     try {
// // //       await ensurePeerConnection();
// // //       const ok = await ensureLocalStreamAndAttach();
// // //       if (!ok || !pc.current) return;

// // //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// // //       await drainQueuedCandidates();

// // //       const answer = await pc.current.createAnswer();
// // //       await pc.current.setLocalDescription(answer);
      
// // //       sendMessage({ 
// // //         type: "answer", 
// // //         answer,
// // //         isVideoCall: true,
// // //       });

// // //       setWebrtcReady(true);
// // //       setShowIncomingModal(false);
// // //       setIncomingSDP(null);

// // //       setTimeout(() => {
// // //         if (pc.current && localStream.current) {
// // //           localStream.current.getVideoTracks().forEach(track => {
// // //             track.enabled = true;
// // //           });
// // //         }
// // //       }, 500);
// // //     } catch (error) {
// // //       console.error("Error handling incoming call:", error?.message || error);
// // //       Alert.alert("Error", "Failed to accept call");
// // //     }
// // //   };

// // //   // ================ LIFECYCLE ================
// // //   useEffect(() => {
// // //     connectSignaling();
// // //     return () => {
// // //       endCall(false);
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (webrtcReady) {
// // //       const startTime = Date.now();
// // //       callTimerRef.current = setInterval(() => {
// // //         setCallDuration(Math.floor((Date.now() - startTime) / 1000));
// // //       }, 1000);
// // //     } else {
// // //       if (callTimerRef.current) {
// // //         clearInterval(callTimerRef.current);
// // //         callTimerRef.current = null;
// // //         setCallDuration(0);
// // //       }
// // //     }
// // //     return () => {
// // //       if (callTimerRef.current) clearInterval(callTimerRef.current);
// // //     };
// // //   }, [webrtcReady]);

// // //   const acceptCall = async () => {
// // //     isCallerRef.current = false;
// // //     const offer = incomingSDP || incomingOffer;
// // //     if (!offer) {
// // //       Alert.alert("No offer", "No incoming offer to accept.");
// // //       return;
// // //     }
    
// // //     await handleIncomingCall(offer);
// // //   };

// // //   const startCall = async () => {
// // //     isCallerRef.current = true;
// // //     await ensureLocalStreamAndAttach();
// // //     await createAndSendInitialOffer();
// // //   };

// // //   const endCall = async (notify = true) => {
// // //     isCallActiveRef.current = false;
    
// // //     const callDetails = {
// // //       contact: {
// // //         name: name || 'Unknown',
// // //         profileImage: profile_image || '',
// // //         userId: targetUserId || 'unknown'
// // //       },
// // //       direction: isInitiator ? 'outgoing' : 'incoming',
// // //       isVideoCall: true,
// // //       status: webrtcReady ? 'ended' : 'missed',
// // //       duration: callDuration || 0
// // //     };
    
// // //     try { 
// // //       if (notify) sendMessage({ type: "call-ended" }); 
// // //     } catch(e){}
    
// // //     try {
// // //       if (ws.current) {
// // //         ws.current.onopen = null;
// // //         ws.current.onmessage = null;
// // //         ws.current.onclose = null;
// // //         ws.current.onerror = null;
// // //         ws.current.close();
// // //       }
// // //     } catch (e) { console.warn("[endCall] error closing ws", e); }
// // //     ws.current = null;

// // //     cleanupPeerConnection();
    
// // //     await saveCallToHistory(callDetails);
    
// // //     navigation.navigate("PHome");
// // //   };

// // //   const rejectCall = async () => {
// // //     sendMessage({ type: "call-rejected" });
    
// // //     await saveCallToHistory({
// // //       contact: { name, profileImage: profile_image, userId: targetUserId },
// // //       direction: 'incoming',
// // //       isVideoCall: true,
// // //       status: 'rejected',
// // //       duration: 0
// // //     });
    
// // //     setShowIncomingModal(false);
// // //     setIncomingSDP(null);
// // //     navigation.navigate("PHome");
// // //   };

// // //   // ================ UI ================
// // //   const formatTime = (seconds) => {
// // //     const mins = Math.floor(seconds / 60);
// // //     const secs = seconds % 60;
// // //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="light-content" />

// // //       {webrtcReady ? (
// // //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
// // //           {remoteURL ? (
// // //             <View style={styles.videoContainer}>
// // //               <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
              
// // //               <View style={styles.callInfoOverlay}>
// // //                 <Text style={styles.callTypeText}>
// // //                   Video Call • {formatTime(callDuration)}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           ) : (
// // //             <View style={styles.avatarContainer}>
// // //               <View style={styles.avatar}>
// // //                 <Image
// // //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                   style={styles.avatarImage}
// // //                   resizeMode="cover"
// // //                 />
// // //               </View>
              
// // //               <View style={styles.voiceCallInfo}>
// // //                 <Text style={styles.callerName}>{name}</Text>
// // //                 <Text style={styles.callTypeText}>
// // //                   Video Call • {formatTime(callDuration)}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           )}

// // //           {localURL && (
// // //             <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
// // //           )}

// // //           <View style={styles.callControls}>
// // //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// // //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// // //                 <Icon name="flip-camera-ios" size={24} color="white" />
// // //               </View>
// // //               <Text style={styles.controlText}>Switch</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// // //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// // //                 <Icon name="call-end" size={24} color="white" />
// // //               </View>
// // //               <Text style={styles.controlText}>End</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </LinearGradient>
// // //       ) : (
// // //         <ImageBackground 
// // //           source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` || require("../assets/images/avatar/blank-profile-picture-973460_1280.png")}} 
// // //           style={{
// // //             flex: 1,
// // //             backgroundColor: '#1a202c',
// // //             justifyContent: 'center',
// // //             alignItems: 'center'
// // //           }}
// // //           blurRadius={10}
// // //         >
// // //           <View style={{
// // //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //             width: '100%',
// // //             height: '100%',
// // //             justifyContent: 'center',
// // //             alignItems: 'center',
// // //             padding: 20
// // //           }}>
// // //             <View style={{
// // //               width: 180,
// // //               height: 180,
// // //               borderRadius: 90,
// // //               backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // //               justifyContent: 'center',
// // //               alignItems: 'center',
// // //               marginBottom: 30,
// // //               borderWidth: 4,
// // //               borderColor: 'rgba(255, 255, 255, 0.2)'
// // //             }}>
// // //               <Image
// // //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                 style={{
// // //                   width: 160,
// // //                   height: 160,
// // //                   borderRadius: 80,
// // //                 }}
// // //                 resizeMode="cover"
// // //               />
// // //             </View>
            
// // //             <Text style={{
// // //               color: 'white',
// // //               fontSize: 28,
// // //               fontWeight: 'bold',
// // //               marginBottom: 10
// // //             }}>{name}</Text>
            
// // //             <Text style={{
// // //               color: 'rgba(255, 255, 255, 0.8)',
// // //               fontSize: 16,
// // //               marginBottom: 40
// // //             }}>
// // //               {wsConnected 
// // //                 ? (isInitiator 
// // //                     ? "Please wait while call is connecting..." 
// // //                     : "Waiting for call...") 
// // //                 : "Connecting..."
// // //               }
// // //             </Text>

// // //             {isInitiator && (
// // //               <View style={{
// // //                 flexDirection: 'row',
// // //                 justifyContent: 'space-around',
// // //                 width: '100%',
// // //                 maxWidth: 350
// // //               }}>
// // //                 <TouchableOpacity 
// // //                   style={{
// // //                     alignItems: 'center'
// // //                   }} 
// // //                   onPress={startCall}
// // //                   disabled={wsConnected ? false : true}
// // //                 >
// // //                   <View style={{
// // //                     width: 70,
// // //                     height: 70,
// // //                     borderRadius: 35,
// // //                     backgroundColor: wsConnected ? "#38a169" : "#718096",
// // //                     justifyContent: 'center',
// // //                     alignItems: 'center',
// // //                     marginBottom: 10
// // //                   }}>
// // //                     <Icon name="videocam" size={30} color="white" />
// // //                   </View>
// // //                   <Text style={{
// // //                     color: 'white',
// // //                     fontSize: 14
// // //                   }}>Video Call</Text>
// // //                 </TouchableOpacity>

// // //                 <TouchableOpacity 
// // //                   style={{
// // //                     alignItems: 'center'
// // //                   }} 
// // //                   onPress={() => endCall(true)}
// // //                   disabled={wsConnected ? false : true}
// // //                 >
// // //                   <View style={{
// // //                     width: 70,
// // //                     height: 70,
// // //                     borderRadius: 35,
// // //                     backgroundColor: wsConnected ? "#ef0505ff" : "#718096",
// // //                     justifyContent: 'center',
// // //                     alignItems: 'center',
// // //                     marginBottom: 10
// // //                   }}>
// // //                     <Icon name="call-end" size={30} color="white" />
// // //                   </View>
// // //                   <Text style={{
// // //                     color: 'white',
// // //                     fontSize: 14
// // //                   }}>End Call</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </ImageBackground>
// // //       )}

// // //       <Modal
// // //         visible={showIncomingModal}
// // //         transparent={true}
// // //         animationType="fade"
// // //         onRequestClose={rejectCall}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.modalContainer}>
// // //             <View style={styles.modalContent}>
// // //               <Text style={styles.incomingCallText}>Incoming Video Call</Text>

// // //               <View style={styles.callerInfo}>
// // //                 <View style={styles.modalAvatar}>
// // //                   <Image
// // //                     source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                     style={styles.modalAvatarImage}
// // //                     resizeMode="cover"
// // //                   />
// // //                 </View>
// // //                 <Text style={styles.modalCallerName}>{name}</Text>
// // //                 <Text style={styles.modalCallType}>Video Call</Text>
// // //               </View>

// // //               <View style={styles.modalButtons}>
// // //                 <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
// // //                   <View style={styles.rejectButtonInner}>
// // //                     <Icon name="call-end" size={30} color="white" />
// // //                   </View>
// // //                   <Text style={styles.buttonText}>Decline</Text>
// // //                 </TouchableOpacity>

// // //                 <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
// // //                   <View style={styles.acceptButtonInner}>
// // //                     <Icon name="videocam" size={30} color="white" />
// // //                   </View>
// // //                   <Text style={styles.buttonText}>Accept</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </View>
// // //           </LinearGradient>
// // //         </View>
// // //       </Modal>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   callScreen: {
// // //     flex: 1,
// // //     justifyContent: 'space-between',
// // //     padding: 20,
// // //   },
// // //   videoContainer: {
// // //     flex: 1,
// // //     width: '100%',
// // //     position: 'relative',
// // //   },
// // //   callInfoOverlay: {
// // //     position: 'absolute',
// // //     top: 10,
// // //     left: 0,
// // //     right: 0,
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //     padding: 15,
// // //     zIndex: 100,
// // //     borderBottomLeftRadius: 5,
// // //     borderBottomRightRadius: 5,
// // //   },
// // //   avatarContainer: {
// // //     alignItems: 'center',
// // //     marginVertical: 30,
// // //     flex: 1,
// // //   },
// // //   avatar: {
// // //     width: 150,
// // //     height: 150,
// // //     borderRadius: 75,
// // //     backgroundColor: '#4a5568',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   avatarImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 75,
// // //   },
// // //   remoteVideo: {
// // //     flex: 1,
// // //     width: '100%',
// // //     backgroundColor: '#000',
// // //     zIndex: 1,
// // //   },
// // //   localVideo: {
// // //     position: 'absolute',
// // //     bottom: 120,
// // //     right: 20,
// // //     width: 120,
// // //     height: 160,
// // //     borderRadius: 10,
// // //     borderWidth: 2,
// // //     borderColor: 'white',
// // //     backgroundColor: '#000',
// // //     zIndex: 50,
// // //   },
// // //   voiceCallInfo: {
// // //     alignItems: 'center',
// // //     marginTop: 1,
// // //     padding: 20,
// // //     borderRadius: 15,
// // //   },
// // //   callerName: {
// // //     fontSize: 26,
// // //     fontWeight: 'bold',
// // //     color: 'white',
// // //     marginBottom: 8,
// // //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 3,
// // //   },
// // //   callTypeText: {
// // //     fontSize: 16,
// // //     color: 'rgba(255, 255, 255, 0.9)',
// // //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // //   callControls: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     marginBottom: 40,
// // //     zIndex: 100,
// // //   },
// // //   controlButton: {
// // //     alignItems: 'center',
// // //   },
// // //   controlIcon: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   controlText: {
// // //     color: 'white',
// // //     fontSize: 14,
// // //   },
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.8)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalContainer: {
// // //     width: '90%',
// // //     borderRadius: 20,
// // //     overflow: 'hidden',
// // //   },
// // //   modalContent: {
// // //     padding: 30,
// // //     alignItems: 'center',
// // //   },
// // //   incomingCallText: {
// // //     fontSize: 24,
// // //     color: 'white',
// // //     fontWeight: 'bold',
// // //     marginBottom: 20,
// // //   },
// // //   callerInfo: {
// // //     alignItems: 'center',
// // //     marginBottom: 40,
// // //   },
// // //   modalAvatar: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: '#4a5568',
// // //     marginBottom: 15,
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   modalAvatarImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 50,
// // //   },
// // //   modalCallerName: {
// // //     fontSize: 22,
// // //     color: 'white',
// // //     fontWeight: 'bold',
// // //     marginBottom: 5,
// // //   },
// // //   modalCallType: {
// // //     fontSize: 16,
// // //     color: '#a0aec0',
// // //   },
// // //   modalButtons: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     width: '100%',
// // //   },
// // //   rejectButton: {
// // //     alignItems: 'center',
// // //   },
// // //   acceptButton: {
// // //     alignItems: 'center',
// // //   },
// // //   rejectButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#e53e3e',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   acceptButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#38a169',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   buttonText: {
// // //     color: 'white',
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // // });

// // //===============================================================================================
// // //                                  WORKING PERFECTLY VIDEO CALL WITHOUT CALL NOTIFICATION
// // //=============================================================================================


// // // import React, { useEffect, useRef, useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   Alert,
// // //   PermissionsAndroid,
// // //   Platform,
// // //   TouchableOpacity,
// // //   Modal,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   ImageBackground,
// // // } from "react-native";
// // // import {
// // //   RTCPeerConnection,
// // //   RTCIceCandidate,
// // //   RTCSessionDescription,
// // //   mediaDevices,
// // //   MediaStream,
// // //   RTCView,
// // // } from "react-native-webrtc";
// // // import { encode as btoa } from "base-64";
// // // import LinearGradient from "react-native-linear-gradient";
// // // import Icon from "react-native-vector-icons/MaterialIcons";
// // // import { Image } from "react-native-animatable";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // // ================== CONFIG ==================
// // // const SIGNALING_SERVER = "ws://api.showapp.ng";
// // // // ============================================

// // // export default function VideoCallScreen({ navigation, route }) {
// // //   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } = route.params || {};

// // //   /// --- refs/state
// // //   const ws = useRef(null);
// // //   const pc = useRef(null);
// // //   const localStream = useRef(null);
// // //   const remoteStream = useRef(null);
// // //   const queuedRemoteCandidates = useRef([]);
// // //   const rtcConfig = useRef({ iceServers: [] }).current;

// // //   const [wsConnected, setWsConnected] = useState(false);
// // //   const [webrtcReady, setWebrtcReady] = useState(false);
// // //   const [localURL, setLocalURL] = useState(null);
// // //   const [remoteURL, setRemoteURL] = useState(null);
// // //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// // //   const [incomingSDP, setIncomingSDP] = useState(null);
// // //   const [callDuration, setCallDuration] = useState(0);
// // //   const [isCameraFront, setIsCameraFront] = useState(true);
// // //   const [callAccepted, setCallAccepted] = useState(false);
// // //   const [callStarted, setCallStarted] = useState(false);

// // //   const isCallerRef = useRef(false);
// // //   const callTimerRef = useRef(null);
// // //   const hasInitialOfferRef = useRef(false);
// // //   const isCleaningUpRef = useRef(false);
// // //   const isCallActiveRef = useRef(true);

// // //   // =============== PERMISSIONS ===============
// // //   const requestPermissions = async () => {
// // //     if (Platform.OS === "android") {
// // //       try {
// // //         const grant = await PermissionsAndroid.request(
// // //           PermissionsAndroid.PERMISSIONS.CAMERA
// // //         );
// // //         return grant === PermissionsAndroid.RESULTS.GRANTED;
// // //       } catch (err) {
// // //         console.warn(err);
// // //         return false;
// // //       }
// // //     }
// // //     return true;
// // //   };

// // //   // =============== ICE SERVERS ===============
// // //   // const getIceServers = async () => {
// // //   //   try {
// // //   //     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// // //   //       method: "PUT",
// // //   //       headers: {
// // //   //         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// // //   //         "Content-Type": "application/json",
// // //   //       },
// // //   //       body: JSON.stringify({ format: "urls" }),
// // //   //     });

// // //   //     const data = await res.json();
// // //   //     let iceServers = [];
// // //   //     if (data.v?.iceServers) {
// // //   //       iceServers = data.v.iceServers;
// // //   //     } else if (data.v?.urls) {
// // //   //       iceServers = data.v.urls.map((url) => ({
// // //   //         urls: url,
// // //   //         username: data.v.username,
// // //   //         credential: data.v.credential,
// // //   //       }));
// // //   //     }

// // //   //     rtcConfig.iceServers = iceServers.length
// // //   //       ? iceServers
// // //   //       : [{ urls: "stun:stun.l.google.com:19302" }];
// // //   //     console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// // //   //   } catch (err) {
// // //   //     console.error("[Xirsys] Failed to fetch ICE servers:", err);
// // //   //     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// // //   //   }
// // //   // };


// // //   const getIceServers = async () => {
// // //   try {
// // //     console.log("[Xirsys] Fetching ICE servers...");

// // //     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// // //       method: "PUT",
// // //       headers: {
// // //         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// // //         "Content-Type": "application/json",
// // //       },
// // //       body: JSON.stringify({ format: "urls" }),
// // //     });

// // //     const data = await res.json();
// // //     console.log("[Xirsys RAW]:", data);

// // //     let iceServers = [];

// // //     if (data?.v?.iceServers) {
// // //       const server = data.v.iceServers;
      
// // //       // SEE WHAT'S ACTUALLY COMING BACK
// // //       console.log("[Xirsys] Raw URLs:", JSON.stringify(server.urls, null, 2));
// // //       console.log("[Xirsys] Is array?", Array.isArray(server.urls));

// // //       const urls = Array.isArray(server.urls) ? server.urls : [server.urls];

// // //       console.log("[ICE] TCP URLs:", urls.filter(u => u.includes("transport=tcp") || u.startsWith("turns:")));
// // //       console.log("[ICE] UDP URLs:", urls.filter(u => u.includes("transport=udp")));

// // //       // Pass ALL urls in one object — WebRTC picks the best available
// // //       iceServers = [
// // //         {
// // //           urls: urls,
// // //           username: server.username,
// // //           credential: server.credential,
// // //         }
// // //       ];
// // //     }

// // //     if (!iceServers.length) {
// // //       throw new Error("No ICE servers from Xirsys");
// // //     }

// // //     // Fallback STUN
// // //     iceServers.push({ urls: "stun:stun.l.google.com:19302" });

// // //     rtcConfig.iceServers = iceServers;
// // //     console.log("✅ [ICE CONFIG READY]:", JSON.stringify(iceServers, null, 2));

// // //   } catch (err) {
// // //     console.error("❌ [Xirsys Failed]:", err);
// // //     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// // //   }

// // //   rtcConfig.iceTransportPolicy = "all"; // NOT "relay" — allow all candidate types
// // // };

// // //   const ensurePeerConnection = async () => {
// // //     if (pc.current) return;

// // //     if (!rtcConfig.iceServers.length) {
// // //       await getIceServers();
// // //     }

// // //     pc.current = new RTCPeerConnection(rtcConfig);
// // //     console.log("[WebRTC] RTCPeerConnection created");

// // //     pc.current.onnegotiationneeded = () => {
// // //       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
// // //     };

// // //     pc.current.onicecandidate = (evt) => {
// // //       if (evt.candidate) {
// // //         sendMessage({ type: "candidate", candidate: evt.candidate });
// // //       }
// // //     };

// // //     pc.current.ontrack = (evt) => {
// // //       console.log("[WebRTC] Track received:", evt.track?.kind);
// // //       if (evt.streams && evt.streams[0]) {
// // //         remoteStream.current = evt.streams[0];
// // //         try { setRemoteURL(remoteStream.current.toURL()); } catch {}
// // //         setWebrtcReady(true);
// // //       }
// // //     };

// // //     pc.current.onconnectionstatechange = () => {
// // //       if (!pc.current) {
// // //         console.warn("[WebRTC] onconnectionstatechange called with no pc");
// // //         return;
// // //       }
// // //       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
// // //       if (pc.current.connectionState === "failed") {
// // //         console.warn("[WebRTC] Connection failed");
// // //         saveCallToHistory({
// // //           contact: { name, profileImage: profile_image, userId: targetUserId },
// // //           direction: isInitiator ? 'outgoing' : 'incoming',
// // //           isVideoCall: true,
// // //           status: 'failed',
// // //           duration: callDuration
// // //         });
// // //       }
// // //     };

// // //     pc.current.oniceconnectionstatechange = () => {
// // //       if (!pc.current) return;
// // //       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
      
// // //     };
// // //   };

// // //   const ensureLocalStreamAndAttach = async () => {
// // //     if (!localStream.current) {
// // //       const hasPermission = await requestPermissions();
// // //       if (!hasPermission) {
// // //         Alert.alert("Permission denied", "Cannot access camera.");
// // //         return false;
// // //       }
// // //       try {
// // //         const s = await mediaDevices.getUserMedia({
// // //           video: { facingMode: isCameraFront ? "user" : "environment" },
// // //           audio: true,
// // //         });
// // //         localStream.current = s;
// // //         try {
// // //           setLocalURL(s.toURL());
// // //         } catch {
          
// // //         }
// // //       } catch (e) {
// // //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// // //         return false;
// // //       }
// // //     }

// // //     if (pc.current) {
// // //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// // //       localStream.current.getTracks().forEach((track) => {
// // //         if (!existingTracks.includes(track)) {
// // //           pc.current.addTrack(track, localStream.current);
// // //         }
// // //       });
// // //     }
// // //     return true;
// // //   };

// // //   const switchCamera = async () => {
// // //     if (!localStream.current) return;
    
// // //     const videoTrack = localStream.current.getVideoTracks()[0];
// // //     if (videoTrack) {
// // //       videoTrack._switchCamera();
// // //       setIsCameraFront(!isCameraFront);
// // //     }
// // //   };

// // //   const drainQueuedCandidates = async () => {
// // //     if (!pc.current) return;
// // //     while (queuedRemoteCandidates.current.length > 0) {
// // //       const c = queuedRemoteCandidates.current.shift();
// // //       try {
// // //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// // //       } catch (err) {
// // //         console.warn("[WebRTC] addIceCandidate error:", err?.message || err);
// // //       }
// // //     }
// // //   };

// // //   const cleanupPeerConnection = () => {
// // //     console.log("[Cleanup] Closing peer connection and streams");
// // //     isCleaningUpRef.current = true;
// // //     isCallActiveRef.current = false;
// // //     setCallAccepted(false);
// // //     setCallStarted(false);

// // //     try {
// // //       if (pc.current) {
// // //         pc.current.onicecandidate = null;
// // //         pc.current.ontrack = null;
// // //         pc.current.onnegotiationneeded = null;
// // //         pc.current.onconnectionstatechange = null;
// // //         pc.current.oniceconnectionstatechange = null;
// // //         pc.current.close();
// // //       }
// // //     } catch (e) {
// // //       console.warn("[Cleanup] pc close error", e);
// // //     }
// // //     pc.current = null;

// // //     try {
// // //       if (localStream.current) {
// // //         localStream.current.getTracks().forEach((t) => t.stop());
// // //       }
// // //     } catch (e) {
// // //       console.warn("[Cleanup] localStream stop error", e);
// // //     }
// // //     localStream.current = null;
// // //     remoteStream.current = null;
// // //     queuedRemoteCandidates.current = [];
// // //     hasInitialOfferRef.current = false;

// // //     setLocalURL(null);
// // //     setRemoteURL(null);
// // //     setWebrtcReady(false);
// // //     setIsCameraFront(true);
// // //     isCleaningUpRef.current = false;
// // //   };

// // //   // =============== SIGNALING ================
// // //   const sendMessage = (msg) => {
// // //     if (ws.current?.readyState === WebSocket.OPEN) {
// // //       ws.current.send(JSON.stringify(msg));
// // //     }
// // //   };

// // //   const connectSignaling = async () => {
// // //     let roomId = "unknown";
// // //     const token = await AsyncStorage.getItem("userToken");
// // //     const userDataRaw = await AsyncStorage.getItem("userData");
// // //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// // //     const currentUserId = userData?.id;

// // //     if (isInitiator && targetUserId) {
// // //       roomId = `user-${targetUserId}`;
// // //     } else if (currentUserId) {
// // //       roomId = `user-${currentUserId}`;
// // //     } else {
// // //       roomId = "unique-room-id";
// // //     }

// // //     if (ws.current) {
// // //       try {
// // //         ws.current.onopen = null;
// // //         ws.current.onmessage = null;
// // //         ws.current.onclose = null;
// // //         ws.current.onerror = null;
// // //         ws.current.close();
// // //       } catch {}
// // //       ws.current = null;
// // //     }

// // //     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
// // //     ws.current = new WebSocket(url);

// // //     ws.current.onopen = async () => {
// // //       setWsConnected(true);

// // //       await ensurePeerConnection();
// // //       await ensureLocalStreamAndAttach();

// // //       if (isInitiator && targetUserId) {
// // //         isCallerRef.current = true;
// // //         setCallStarted(true);
// // //         await createAndSendInitialOffer();
// // //       }
// // //     };

// // //     ws.current.onmessage = async (evt) => {
// // //       let data;
// // //       try {
// // //         data = JSON.parse(evt.data);
// // //       } catch {
// // //         return;
// // //       }

// // //       console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation,
// // //                   "pcExists:", !!pc.current, "isCallActive:", isCallActiveRef.current);

// // //       if (!isCallActiveRef.current && data?.type !== "call-ended") {
// // //         console.warn("[WS] Ignoring message after call ended:", data?.type);
// // //         return;
// // //       }

// // //       switch (data.type) {
// // //         case "offer": {
// // //           if (data.isRenegotiation) {
// // //             console.log("[WebRTC] Renegotiation offer received");
// // //             try {
// // //               await ensurePeerConnection();
// // //               await ensureLocalStreamAndAttach();
// // //             } catch (err) {
// // //               console.error("[WebRTC] Failed to prepare pc/local for renegotiation:", err);
// // //               return;
// // //             }
// // //             await handleRenegotiationOffer(data.offer);
// // //           } else {
// // //             if (isCallerRef.current) return;
// // //             // Only show modal if this is not the caller
// // //             setIncomingSDP(data.offer);
// // //             setShowIncomingModal(true);
// // //           }
// // //           break;
// // //         }
// // //         case "answer": {
// // //           if (!isCallerRef.current) return;
// // //           if (!pc.current) return;
          
// // //           setCallAccepted(true);
          
// // //           if (pc.current.signalingState === "have-local-offer") {
// // //             try {
// // //               await pc.current.setRemoteDescription(
// // //                 new RTCSessionDescription(data.answer)
// // //               );
// // //               await drainQueuedCandidates();
// // //             } catch (e) {
// // //               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// // //             }
// // //           }
// // //           break;
// // //         }
// // //         case "candidate": {
// // //           if (!pc.current) return;
// // //           if (!pc.current.remoteDescription) {
// // //             queuedRemoteCandidates.current.push(data.candidate);
// // //           } else {
// // //             try {
// // //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// // //             } catch (e) {
// // //               console.warn("[WebRTC] addIceCandidate live error:", e?.message || e);
// // //             }
// // //           }
// // //           break;
// // //         }
// // //         case "call-ended": {
// // //           Alert.alert("Call Ended", "Your call partner has disconnected");
// // //           endCall(false);
// // //           break;
// // //         }
// // //         case "call-rejected": {
// // //           Alert.alert("Call Rejected", "The recipient declined your call");
// // //           await saveCallToHistory({
// // //             contact: { name, profileImage: profile_image, userId: targetUserId },
// // //             direction: 'outgoing',
// // //             isVideoCall: true,
// // //             status: 'rejected',
// // //             duration: 0
// // //           });
// // //           endCall(false);
// // //           break;
// // //         }
// // //         case "call-missed": {
// // //           if (!isInitiator) {
// // //             await saveCallToHistory({
// // //               contact: { name, profileImage: profile_image, userId: targetUserId },
// // //               direction: 'incoming',
// // //               isVideoCall: true,
// // //               status: 'missed',
// // //               duration: 0
// // //             });
// // //           }
// // //           break;
// // //         }
// // //       }
// // //     };

// // //     ws.current.onclose = () => {
// // //       setWsConnected(false);
// // //       if (!isCleaningUpRef.current) {
// // //         cleanupPeerConnection();
// // //       }
// // //     };

// // //     ws.current.onerror = (err) => {
// // //       console.error("[WebSocket] Error:", err?.message || err);
// // //     };
// // //   };

// // //   const handleRenegotiationOffer = async (offer) => {
// // //     try {
// // //       if (!pc.current) {
// // //         console.warn("[WebRTC] No pc available, trying to recreate for renegotiation");
// // //         await ensurePeerConnection();
// // //         await ensureLocalStreamAndAttach();
// // //       }

// // //       if (!pc.current) {
// // //         console.error("[WebRTC] Still no pc after attempting recreate — abort renegotiation");
// // //         return;
// // //       }

// // //       if (pc.current.signalingState === "closed") {
// // //         console.warn("[WebRTC] pc already closed — ignoring renegotiation");
// // //         return;
// // //       }

// // //       console.log("[WebRTC] setting remote description for renegotiation. signalingState:", pc.current.signalingState);
// // //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// // //       await drainQueuedCandidates();

// // //       const answer = await pc.current.createAnswer();
// // //       await pc.current.setLocalDescription(answer);

// // //       sendMessage({
// // //         type: "answer",
// // //         answer,
// // //         isVideoCall: true
// // //       });

// // //       console.log("[WebRTC] Renegotiation answer sent");
// // //     } catch (error) {
// // //       console.error("[WebRTC] Renegotiation failed:", error);
// // //     }
// // //   };

// // //   const saveCallToHistory = async (callDetails) => {
// // //     try {
// // //       console.log('[CallHistory] Saving call:', callDetails);
// // //       const existingHistory = await AsyncStorage.getItem('callHistory');
// // //       console.log('[CallHistory] Existing history:', existingHistory);
      
// // //       const history = existingHistory ? JSON.parse(existingHistory) : [];
      
// // //       const newCall = {
// // //         id: Date.now().toString(),
// // //         timestamp: Date.now(),
// // //         contact: {
// // //           name: callDetails.contact.name,
// // //           profileImage: callDetails.contact.profileImage,
// // //           userId: callDetails.contact.userId
// // //         },
// // //         direction: callDetails.direction,
// // //         isVideoCall: true,
// // //         status: callDetails.status,
// // //         duration: callDetails.duration || 0
// // //       };
      
// // //       history.unshift(newCall);
// // //       const limitedHistory = history.slice(0, 100);
      
// // //       await AsyncStorage.setItem('callHistory', JSON.stringify(limitedHistory));
// // //       console.log('[CallHistory] Call saved successfully');
// // //     } catch (error) {
// // //       console.error('[CallHistory] Error saving call:', error);
// // //     }
// // //   };

// // //   // ============ OFFER/ANSWER FLOW ===========
// // //   const createAndSendInitialOffer = async () => {
// // //     if (hasInitialOfferRef.current) return;
// // //     await ensurePeerConnection();
// // //     const ok = await ensureLocalStreamAndAttach();
// // //     if (!ok || !pc.current) return;

// // //     try {
// // //       const userDataRaw = await AsyncStorage.getItem("userData");
// // //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// // //       const callerInfo = {
// // //         profileImage: userData.profile_picture || "",
// // //         name: userData.name || "Caller",
// // //       };

// // //       const offer = await pc.current.createOffer();
// // //       await pc.current.setLocalDescription(offer);

// // //       sendMessage({
// // //         type: "offer",
// // //         offer: {
// // //           ...offer,
// // //           targetUserId: targetUserId,
// // //           callerInfo,
// // //           isVideoCall: true,
// // //         },
// // //       });
// // //       hasInitialOfferRef.current = true;
// // //       console.log("[WebRTC] Initial offer created & sent");
// // //     } catch (e) {
// // //       console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// // //     }
// // //   };
// // // ///uuuuuuuuuuuuuuuuuuuuuu
// // //   const handleIncomingCall = async (offer) => {
// // //     try {
// // //       await ensurePeerConnection();
// // //       const ok = await ensureLocalStreamAndAttach();
// // //       if (!ok || !pc.current) return;

// // //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// // //       await drainQueuedCandidates();

// // //       const answer = await pc.current.createAnswer();
// // //       await pc.current.setLocalDescription(answer);
      
// // //       sendMessage({ 
// // //         type: "answer", 
// // //         answer,
// // //         isVideoCall: true,
// // //       });

// // //       setWebrtcReady(true);
// // //       setCallAccepted(true);
// // //       setShowIncomingModal(false);
// // //       setIncomingSDP(null);

// // //       setTimeout(() => {
// // //         if (pc.current && localStream.current) {
// // //           localStream.current.getVideoTracks().forEach(track => {
// // //             track.enabled = true;
// // //           });
// // //         }
// // //       }, 500);
// // //     } catch (error) {
// // //       console.error("Error handling incoming call:", error?.message || error);
// // //       Alert.alert("Error", "Failed to accept call");
// // //     }
// // //   };

// // //   // ================ LIFECYCLE ================
// // //   useEffect(() => {
// // //     connectSignaling();
// // //     return () => {
// // //       endCall(false);
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (webrtcReady && callAccepted) {
// // //       const startTime = Date.now();
// // //       callTimerRef.current = setInterval(() => {
// // //         setCallDuration(Math.floor((Date.now() - startTime) / 1000));
// // //       }, 1000);
// // //     } else {
// // //       if (callTimerRef.current) {
// // //         clearInterval(callTimerRef.current);
// // //         callTimerRef.current = null;
// // //         setCallDuration(0);
// // //       }
// // //     }
// // //     return () => {
// // //       if (callTimerRef.current) clearInterval(callTimerRef.current);
// // //     };
// // //   }, [webrtcReady, callAccepted]);

// // //   const acceptCall = async () => {
// // //     console.log('accept_call button pressedssssssssssssssss. incomingSDP:');
// // //     isCallerRef.current = false;
// // //     const offer = incomingSDP || incomingOffer;
// // //     if (!offer) {
// // //       Alert.alert("No offer", "No incoming offer to accept.");
// // //       return;
// // //     }
    
// // //     await handleIncomingCall(offer);
// // //   };

// // //   const startCall = async () => {
// // //     isCallerRef.current = true;
// // //     setCallStarted(true);
// // //     await ensureLocalStreamAndAttach();
// // //     await createAndSendInitialOffer();
// // //   };

// // //   const endCall = async (notify = true) => {
// // //     isCallActiveRef.current = false;
    
// // //     const callDetails = {
// // //       contact: {
// // //         name: name || 'Unknown',
// // //         profileImage: profile_image || '',
// // //         userId: targetUserId || 'unknown'
// // //       },
// // //       direction: isInitiator ? 'outgoing' : 'incoming',
// // //       isVideoCall: true,
// // //       status: webrtcReady ? 'ended' : 'missed',
// // //       duration: callDuration || 0
// // //     };
    
// // //     try { 
// // //       if (notify) sendMessage({ type: "call-ended" }); 
// // //     } catch(e){}
    
// // //     try {
// // //       if (ws.current) {
// // //         ws.current.onopen = null;
// // //         ws.current.onmessage = null;
// // //         ws.current.onclose = null;
// // //         ws.current.onerror = null;
// // //         ws.current.close();
// // //       }
// // //     } catch (e) { console.warn("[endCall] error closing ws", e); }
// // //     ws.current = null;

// // //     cleanupPeerConnection();
    
// // //     await saveCallToHistory(callDetails);
    
// // //     navigation.navigate("PHome");
// // //   };

// // //   const rejectCall = async () => {
// // //     sendMessage({ type: "call-rejected" });
    
// // //     await saveCallToHistory({
// // //       contact: { name, profileImage: profile_image, userId: targetUserId },
// // //       direction: 'incoming',
// // //       isVideoCall: true,
// // //       status: 'rejected',
// // //       duration: 0
// // //     });
    
// // //     setShowIncomingModal(false);
// // //     setIncomingSDP(null);
// // //     navigation.navigate("PHome");
// // //   };

// // //   // ================ UI ================
// // //   const formatTime = (seconds) => {
// // //     const mins = Math.floor(seconds / 60);
// // //     const secs = seconds % 60;
// // //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="light-content" />

// // //       {(webrtcReady && callAccepted) ? (
// // //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
// // //           {remoteURL ? (
// // //             <View style={styles.videoContainer}>
// // //               <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
              
// // //               <View style={styles.callInfoOverlay}>
// // //                 <Text style={styles.callTypeText}>
// // //                   Video Call • {formatTime(callDuration)}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           ) : (
// // //             <View style={styles.avatarContainer}>
// // //               <View style={styles.avatar}>
// // //                 <Image
// // //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                   style={styles.avatarImage}
// // //                   resizeMode="cover"
// // //                 />
// // //               </View>
              
// // //               <View style={styles.voiceCallInfo}>
// // //                 <Text style={styles.callerName}>{name}</Text>
// // //                 <Text style={styles.callTypeText}>
// // //                   Video Call • {formatTime(callDuration)}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           )}

// // //           {localURL && (
// // //             <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
// // //           )}

// // //           <View style={styles.callControls}>
// // //             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// // //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// // //                 <Icon name="flip-camera-ios" size={24} color="white" />
// // //               </View>
// // //               <Text style={styles.controlText}>Switch</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// // //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// // //                 <Icon name="call-end" size={24} color="white" />
// // //               </View>
// // //               <Text style={styles.controlText}>End</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </LinearGradient>
// // //       ) : (
// // //         <ImageBackground 
// // //           source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} 
// // //           style={{
// // //             flex: 1,
// // //             backgroundColor: '#1a202c',
// // //             justifyContent: 'center',
// // //             alignItems: 'center'
// // //           }}
// // //           blurRadius={10}
// // //         >
// // //           <View style={{
// // //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //             width: '100%',
// // //             height: '100%',
// // //             justifyContent: 'center',
// // //             alignItems: 'center',
// // //             padding: 20
// // //           }}>
// // //             <View style={{
// // //               width: 180,
// // //               height: 180,
// // //               borderRadius: 90,
// // //               backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // //               justifyContent: 'center',
// // //               alignItems: 'center',
// // //               marginBottom: 30,
// // //               borderWidth: 4,
// // //               borderColor: 'rgba(255, 255, 255, 0.2)'
// // //             }}>
// // //               <Image
// // //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                 style={{
// // //                   width: 160,
// // //                   height: 160,
// // //                   borderRadius: 80,
// // //                 }}
// // //                 resizeMode="cover"
// // //               />
// // //             </View>
            
// // //             <Text style={{
// // //               color: 'white',
// // //               fontSize: 28,
// // //               fontWeight: 'bold',
// // //               marginBottom: 10
// // //             }}>{name}</Text>
            
// // //             <Text style={{
// // //               color: 'rgba(255, 255, 255, 0.8)',
// // //               fontSize: 16,
// // //               marginBottom: 40
// // //             }}>
// // //               {wsConnected 
// // //                 ? (isInitiator 
// // //                     ? (callAccepted
// // //                         ? "Connecting to video..." 
// // //                         : "Ringing...") 
// // //                     : "Incoming call...") 
// // //                 : "Connecting..."
// // //               }
// // //             </Text>

// // //             {isInitiator && !callAccepted && (
// // //               <View style={{
// // //                 flexDirection: 'row',
// // //                 justifyContent: 'space-around',
// // //                 width: '100%',
// // //                 maxWidth: 350
// // //               }}>
// // //                 <TouchableOpacity 
// // //                   style={{
// // //                     alignItems: 'center'
// // //                   }} 
// // //                   onPress={startCall}
// // //                   disabled={!wsConnected || callStarted}
// // //                 >
// // //                   <View style={{
// // //                     width: 70,
// // //                     height: 70,
// // //                     borderRadius: 35,
// // //                     backgroundColor: (wsConnected && !callStarted) ? "#38a169" : "#718096",
// // //                     justifyContent: 'center',
// // //                     alignItems: 'center',
// // //                     marginBottom: 10
// // //                   }}>
// // //                     <Icon name="videocam" size={30} color="white" />
// // //                   </View>
// // //                   <Text style={{
// // //                     color: 'white',
// // //                     fontSize: 14
// // //                   }}>Video Call</Text>
// // //                 </TouchableOpacity>

// // //                 <TouchableOpacity 
// // //                   style={{
// // //                     alignItems: 'center'
// // //                   }} 
// // //                   onPress={() => endCall(true)}
// // //                 >
// // //                   <View style={{
// // //                     width: 70,
// // //                     height: 70,
// // //                     borderRadius: 35,
// // //                     backgroundColor: "#ef0505ff",
// // //                     justifyContent: 'center',
// // //                     alignItems: 'center',
// // //                     marginBottom: 10
// // //                   }}>
// // //                     <Icon name="call-end" size={30} color="white" />
// // //                   </View>
// // //                   <Text style={{
// // //                     color: 'white',
// // //                     fontSize: 14
// // //                   }}>End Call</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </ImageBackground>
// // //       )}

// // //       {/* Only show incoming modal for non-initiators (callees) */}
// // //       {!isInitiator && (
// // //         <Modal
// // //           visible={showIncomingModal}
// // //           transparent={true}
// // //           animationType="fade"
// // //           onRequestClose={rejectCall}
// // //         >
// // //           <View style={styles.modalOverlay}>
// // //             <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.modalContainer}>
// // //               <View style={styles.modalContent}>
// // //                 <Text style={styles.incomingCallText}>Incoming Video Call</Text>

// // //                 <View style={styles.callerInfo}>
// // //                   <View style={styles.modalAvatar}>
// // //                     <Image
// // //                       source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                       style={styles.modalAvatarImage}
// // //                       resizeMode="cover"
// // //                     />
// // //                   </View>
// // //                   <Text style={styles.modalCallerName}>{name}</Text>
// // //                   <Text style={styles.modalCallType}>Video Call</Text>
// // //                 </View>

// // //                 <View style={styles.modalButtons}>
// // //                   <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
// // //                     <View style={styles.rejectButtonInner}>
// // //                       <Icon name="call-end" size={30} color="white" />
// // //                     </View>
// // //                     <Text style={styles.buttonText}>Decline</Text>
// // //                   </TouchableOpacity>

// // //                   <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
// // //                     <View style={styles.acceptButtonInner}>
// // //                       <Icon name="videocam" size={30} color="white" />
// // //                     </View>
// // //                     <Text style={styles.buttonText}>Accept</Text>
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </View>
// // //             </LinearGradient>
// // //           </View>
// // //         </Modal>
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   callScreen: {
// // //     flex: 1,
// // //     justifyContent: 'space-between',
// // //     padding: 20,
// // //   },
// // //   videoContainer: {
// // //     flex: 1,
// // //     width: '100%',
// // //     position: 'relative',
// // //   },
// // //   callInfoOverlay: {
// // //     position: 'absolute',
// // //     top: 10,
// // //     left: 0,
// // //     right: 0,
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //     padding: 15,
// // //     zIndex: 100,
// // //     borderBottomLeftRadius: 5,
// // //     borderBottomRightRadius: 5,
// // //   },
// // //   avatarContainer: {
// // //     alignItems: 'center',
// // //     marginVertical: 30,
// // //     flex: 1,
// // //   },
// // //   avatar: {
// // //     width: 150,
// // //     height: 150,
// // //     borderRadius: 75,
// // //     backgroundColor: '#4a5568',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   avatarImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 75,
// // //   },
// // //   remoteVideo: {
// // //     flex: 1,
// // //     width: '100%',
// // //     backgroundColor: '#000',
// // //     zIndex: 1,
// // //   },
// // //   localVideo: {
// // //     position: 'absolute',
// // //     bottom: 120,
// // //     right: 20,
// // //     width: 120,
// // //     height: 160,
// // //     borderRadius: 10,
// // //     borderWidth: 2,
// // //     borderColor: 'white',
// // //     backgroundColor: '#000',
// // //     zIndex: 50,
// // //   },
// // //   voiceCallInfo: {
// // //     alignItems: 'center',
// // //     marginTop: 1,
// // //     padding: 20,
// // //     borderRadius: 15,
// // //   },
// // //   callerName: {
// // //     fontSize: 26,
// // //     fontWeight: 'bold',
// // //     color: 'white',
// // //     marginBottom: 8,
// // //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 3,
// // //   },
// // //   callTypeText: {
// // //     fontSize: 16,
// // //     color: 'rgba(255, 255, 255, 0.9)',
// // //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // //   callControls: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     marginBottom: 40,
// // //     zIndex: 100,
// // //   },
// // //   controlButton: {
// // //     alignItems: 'center',
// // //   },
// // //   controlIcon: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   controlText: {
// // //     color: 'white',
// // //     fontSize: 14,
// // //   },
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.8)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalContainer: {
// // //     width: '90%',
// // //     borderRadius: 20,
// // //     overflow: 'hidden',
// // //   },
// // //   modalContent: {
// // //     padding: 30,
// // //     alignItems: 'center',
// // //   },
// // //   incomingCallText: {
// // //     fontSize: 24,
// // //     color: 'white',
// // //     fontWeight: 'bold',
// // //     marginBottom: 20,
// // //   },
// // //   callerInfo: {
// // //     alignItems: 'center',
// // //     marginBottom: 40,
// // //   },
// // //   modalAvatar: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: '#4a5568',
// // //     marginBottom: 15,
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   modalAvatarImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 50,
// // //   },
// // //   modalCallerName: {
// // //     fontSize: 22,
// // //     color: 'white',
// // //     fontWeight: 'bold',
// // //     marginBottom: 5,
// // //   },
// // //   modalCallType: {
// // //     fontSize: 16,
// // //     color: '#a0aec0',
// // //   },
// // //   modalButtons: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     width: '100%',
// // //   },
// // //   rejectButton: {
// // //     alignItems: 'center',
// // //   },
// // //   acceptButton: {
// // //     alignItems: 'center',
// // //   },
// // //   rejectButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#e53e3e',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   acceptButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#38a169',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   buttonText: {
// // //     color: 'white',
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // // });

// // //
// // // WORKING WEBSOCKET ==================================================
// // //


// // // import React, { useEffect, useRef, useState, useCallback } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   Alert,
// // //   PermissionsAndroid,
// // //   Platform,
// // //   TouchableOpacity,
// // //   Modal,
// // //   StatusBar,
// // //   ImageBackground,
// // //   NativeModules,
// // //   DeviceEventEmitter,
// // //   PanResponder,
// // //   Dimensions,
// // // } from "react-native";
// // // import {
// // //   RTCPeerConnection,
// // //   RTCIceCandidate,
// // //   RTCSessionDescription,
// // //   mediaDevices,
// // //   RTCView,
 
// // // } from "react-native-webrtc";
// // // import { SafeAreaView } from "react-native-safe-area-context";
// // // import { encode as btoa } from "base-64";
// // // import LinearGradient from "react-native-linear-gradient";
// // // import Icon from "react-native-vector-icons/MaterialIcons";
// // // import { Image } from "react-native-animatable";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { API_ROUTE_IMAGE } from "../api_routing/api";
// // // import InCallManager from "react-native-incall-manager";
// // // import CallKeepService from '../src/services/CallKeepService';
// // // import { useBackHandler } from '../src/hooks/useBackHandler';

// // // const SIGNALING_SERVER = "wss://api.showapp.ng";

// // // export default function VideoCallScreen({ navigation, route }) {
// // //     useBackHandler(navigation, 'BroadcastHome');
// // //   const {
// // //     profile_image,
// // //     name,
// // //     incomingOffer,
// // //     isIncomingCall,
// // //     targetUserId,
// // //     isInitiator,
// // //     autoAnswerOnOffer,
// // //   } = route.params || {};

// // //   // ─── Refs ────────────────────────────────────────────────────
// // //   const ws = useRef(null);
// // //   const pc = useRef(null);
// // //   const localStream = useRef(null);
// // //   const remoteStream = useRef(null);
// // //   const queuedRemoteCandidates = useRef([]);
// // //   const rtcConfig = useRef({ iceServers: [] }).current;
// // //   const isCallerRef = useRef(false);
// // //   const currentCallIdRef = useRef(null);
// // //   const callTimerRef = useRef(null);
// // //   const hasInitialOfferRef = useRef(false);
// // //   const isCleaningUpRef = useRef(false);
// // //   const isCallActiveRef = useRef(true);
// // //   const autoAnswerOnOfferRef = useRef(autoAnswerOnOffer || false);

// // //   // Refs for CallKeep stable callbacks
// // //   const endCallRef = useRef(null);
// // //   const acceptCallWithCallKeepRef = useRef(null);
// // //   const startCallWithCallKeepRef = useRef(null);

// // //   // ─── State ───────────────────────────────────────────────────
// // //   const [wsConnected, setWsConnected] = useState(false);
// // //   const [webrtcReady, setWebrtcReady] = useState(false);
// // //   const [localURL, setLocalURL] = useState(null);
// // //   const [remoteURL, setRemoteURL] = useState(null);
// // //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// // //   const [incomingSDP, setIncomingSDP] = useState(null);
// // //   const [callDuration, setCallDuration] = useState(0);
// // //   const [isCameraFront, setIsCameraFront] = useState(true);
// // //   const [isMuted, setIsMuted] = useState(false);
// // //   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
// // //   const [currentCallId, setCurrentCallId] = useState(null);
// // //   const [isRinging, setIsRinging] = useState(false);
// // //   const [callAccepted, setCallAccepted] = useState(false);
// // //   const [callStarted, setCallStarted] = useState(false);

// // //   const updateCallId = (id) => {
// // //     currentCallIdRef.current = id;
// // //     setCurrentCallId(id);
// // //   };

// // //   /////// this is only for ui draging the video stream 
// // //   const pipPosition = useRef({ x: Dimensions.get('window').width - 116, y: Platform.OS === 'ios' ? 100 : 70 });
// // //   const [pipVisible, setPipVisible] = useState(true);
// // //   const [pipPositionState, setPipPositionState] = useState({ 
// // //     x: Dimensions.get('window').width - 116, 
// // //     y: Platform.OS === 'ios' ? 100 : 70 
// // //   });

// // //   // Handle PiP drag
// // //   const handlePipDrag = (event, gestureState) => {
// // //     const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// // //     const pipWidth = 100;
// // //     const pipHeight = 140;
    
// // //     let newX = pipPosition.current.x + gestureState.dx;
// // //     let newY = pipPosition.current.y + gestureState.dy;
    
// // //     newX = Math.max(0, Math.min(newX, screenWidth - pipWidth));
// // //     newY = Math.max(50, Math.min(newY, screenHeight - pipHeight - 150));
    
// // //     setPipPositionState({ x: newX, y: newY });
// // //   };

// // //   const handlePipDragEnd = () => {
// // //     pipPosition.current = { x: pipPositionState.x, y: pipPositionState.y };
// // //   };

// // //   // Create PanResponder for PiP
// // //   const pipPanResponder = useRef(
// // //     PanResponder.create({
// // //       onStartShouldSetPanResponder: () => true,
// // //       onMoveShouldSetPanResponder: (_, gestureState) => {
// // //         return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
// // //       },
// // //       onPanResponderGrant: () => {},
// // //       onPanResponderMove: (event, gestureState) => {
// // //         handlePipDrag(event, gestureState);
// // //       },
// // //       onPanResponderRelease: () => {
// // //         handlePipDragEnd();
// // //       },
// // //     })
// // //   ).current;

// // //   const togglePipVisibility = () => {
// // //     setPipVisible(!pipVisible);
// // //   };

// // //   //// draging end==========================

// // //   // ─── Audio helpers ───────────────────────────────────────────
// // //   const startAudioSession = () => {
// // //     InCallManager.start({ media: 'video' });
// // //     InCallManager.setSpeakerphoneOn(true); // video calls default to speaker
// // //   };

// // //   const startRinging = () => {
// // //     setIsRinging(true);
// // //     InCallManager.startRingtone();
// // //   };

// // //   const stopRinging = () => {
// // //     setIsRinging(false);
// // //     InCallManager.stopRingtone();
// // //   };

// // //   // ─── CallKeep callbacks (useCallback for stability) ──────────
// // //   const acceptCallWithCallKeep = useCallback(async () => {
// // //     console.log('[CallKeep] Accepting video call...');
// // //     stopRinging();
// // //     isCallerRef.current = false;
// // //     const offer = incomingSDP || incomingOffer;
// // //     if (!offer?.sdp) {
// // //       console.error('[CallKeep] No valid offer to accept');
// // //       return;
// // //     }
// // //     await handleIncomingCall(offer);
// // //     if (currentCallIdRef.current) {
// // //       await CallKeepService.setCallConnected(currentCallIdRef.current);
// // //     }
// // //   }, [incomingSDP, incomingOffer]);

// // //   const startCallWithCallKeep = useCallback(async (phoneNumber, callUUID) => {
// // //     console.log('[CallKeep] Starting video call with:', phoneNumber, callUUID);
// // //     isCallerRef.current = true;
// // //     startAudioSession();
// // //     await createAndSendInitialOffer();
// // //     if (callUUID) {
// // //       await CallKeepService.setCallConnected(callUUID);
// // //     }
// // //   }, []);

// // //   // Keep refs updated
// // //   useEffect(() => { endCallRef.current = endCall; });
// // //   useEffect(() => { acceptCallWithCallKeepRef.current = acceptCallWithCallKeep; }, [acceptCallWithCallKeep]);
// // //   useEffect(() => { startCallWithCallKeepRef.current = startCallWithCallKeep; }, [startCallWithCallKeep]);

// // //   // ─── CallKeep listeners ──────────────────────────────────────
// // //   useEffect(() => {
// // //     let mounted = true;

// // //     const setupCallKeepListeners = async () => {
// // //       const initialized = await CallKeepService.initialize();
// // //       if (!mounted || !initialized) return;

// // //       console.log('[CallKeep] Registering video call listeners...');

// // //       const onAnswerCall = (payload) => {
// // //         console.log('[CallKeep] answerCall:', payload);
// // //         if (!mounted) return;
// // //         if (typeof acceptCallWithCallKeepRef.current === 'function') {
// // //           acceptCallWithCallKeepRef.current();
// // //         }
// // //       };

// // //       const onEndCall = (payload) => {
// // //         console.log('[CallKeep] endCall:', payload);
// // //         if (!mounted) return;
// // //         if (typeof endCallRef.current === 'function') {
// // //           endCallRef.current(true);
// // //         }
// // //       };

// // //       const onStartCall = (payload) => {
// // //         console.log('[CallKeep] startCall:', payload);
// // //         if (!mounted) return;
// // //         const { handle, callUUID } = payload || {};
// // //         if (!handle) return;
// // //         if (typeof startCallWithCallKeepRef.current === 'function') {
// // //           startCallWithCallKeepRef.current(handle, callUUID);
// // //         }
// // //       };

// // //       const onDidActivateAudio = () => {
// // //         if (!mounted) return;
// // //         InCallManager.start({ media: 'video' });
// // //         InCallManager.setSpeakerphoneOn(true);
// // //       };

// // //       const onDidDeactivateAudio = () => {
// // //         if (!mounted) return;
// // //         InCallManager.stop();
// // //       };

// // //       // Validate all handlers before registering
// // //       const handlers = { onAnswerCall, onEndCall, onStartCall, onDidActivateAudio, onDidDeactivateAudio };
// // //       const allValid = Object.entries(handlers).every(([key, fn]) => {
// // //         if (typeof fn !== 'function') {
// // //           console.error(`[CallKeep] Handler ${key} is not a function`);
// // //           return false;
// // //         }
// // //         return true;
// // //       });

// // //       if (!allValid) return;

// // //       CallKeepService.addEventListener('answerCall', onAnswerCall);
// // //       CallKeepService.addEventListener('endCall', onEndCall);
// // //       CallKeepService.addEventListener('startCall', onStartCall);
// // //       CallKeepService.addEventListener('didActivateAudioSession', onDidActivateAudio);
// // //       CallKeepService.addEventListener('didDeactivateAudioSession', onDidDeactivateAudio);

// // //       console.log('[CallKeep] Video call listeners registered ✅');
// // //     };

// // //     const timer = setTimeout(() => setupCallKeepListeners(), 100);

// // //     return () => {
// // //       mounted = false;
// // //       clearTimeout(timer);
// // //       CallKeepService.removeAllListeners();
// // //     };
// // //   }, []);

// // //   // ─── Notification / DeviceEventEmitter listener ──────────────
// // //   useEffect(() => {
// // //     const subscription = DeviceEventEmitter.addListener(
// // //       'incomingCallFromNotification',
// // //       (callData) => {
// // //         console.log('[VideoCall] Incoming call from notification:', callData);
// // //         // Stop foreground service
// // //         try { NativeModules.CallModule?.stopCallService(); } catch {}

// // //         if (callData.autoAccept) {
// // //           // Already on this screen — set autoAnswer flag
// // //           autoAnswerOnOfferRef.current = true;
// // //         }
// // //       }
// // //     );

// // //     return () => subscription.remove();
// // //   }, []);

// // //   // ─── Audio / screen lifecycle ────────────────────────────────
// // //   useEffect(() => {
// // //     global.__onCallScreen = true;
// // //     return () => {
// // //       global.__onCallScreen = false;
// // //       InCallManager.stopRingtone();
// // //       InCallManager.stop({ busytone: '_BUNDLE_' });
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     InCallManager.stopRingtone();
// // //     InCallManager.start({ media: 'video' });
// // //     InCallManager.setSpeakerphoneOn(true);
// // //     return () => {
// // //       InCallManager.stop();
// // //       InCallManager.stopRingtone();
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     InCallManager.setKeepScreenOn(true);
// // //     return () => {
// // //       InCallManager.stop();
// // //       InCallManager.setKeepScreenOn(false);
// // //       stopRinging();
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (showIncomingModal) {
// // //       startRinging();
// // //     } else {
// // //       stopRinging();
// // //     }
// // //     return () => stopRinging();
// // //   }, [showIncomingModal]);

// // //   // ─── Permissions ─────────────────────────────────────────────
// // //   const requestPermissions = async () => {
// // //     if (Platform.OS === "android") {
// // //       try {
// // //         const grants = await PermissionsAndroid.requestMultiple([
// // //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// // //           PermissionsAndroid.PERMISSIONS.CAMERA,
// // //         ]);
// // //         return (
// // //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
// // //             PermissionsAndroid.RESULTS.GRANTED &&
// // //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
// // //             PermissionsAndroid.RESULTS.GRANTED
// // //         );
// // //       } catch (err) {
// // //         console.warn(err);
// // //         return false;
// // //       }
// // //     }
// // //     return true;
// // //   };

// // //   // ─── ICE servers ─────────────────────────────────────────────
// // //   const getIceServers = async () => {
// // //     try {
// // //       console.log("[Xirsys] Fetching ICE servers...");
// // //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// // //         method: "PUT",
// // //         headers: {
// // //           Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ format: "urls" }),
// // //       });
// // //       const data = await res.json();
// // //       let iceServers = [];
// // //       if (data?.v?.iceServers) {
// // //         const server = data.v.iceServers;
// // //         const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
// // //         iceServers = [{ urls, username: server.username, credential: server.credential }];
// // //       }
// // //       if (!iceServers.length) throw new Error("No ICE servers");
// // //       iceServers.push({ urls: "stun:stun.l.google.com:19302" });
// // //       rtcConfig.iceServers = iceServers;
// // //       console.log("✅ [ICE CONFIG READY]");
// // //     } catch (err) {
// // //       console.error("❌ [Xirsys Failed]:", err);
// // //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// // //     }
// // //     rtcConfig.iceTransportPolicy = "all";
// // //   };

// // //   // ─── Peer connection ─────────────────────────────────────────
// // //   // const ensurePeerConnection = async () => {
// // //   //   if (pc.current) return;
// // //   //   if (!rtcConfig.iceServers.length) await getIceServers();

// // //   //   pc.current = new RTCPeerConnection(rtcConfig);
// // //   //   console.log("[WebRTC] RTCPeerConnection created");

// // //   //   pc.current.onnegotiationneeded = () => {
// // //   //     console.log("[WebRTC] onnegotiationneeded, signalingState:", pc.current?.signalingState);
// // //   //   };

// // //   //   pc.current.onicecandidate = (evt) => {
// // //   //     if (evt.candidate) {
// // //   //       const cand = evt.candidate.candidate;
// // //   //       if (cand.includes("typ relay")) console.log("🟢 [TURN WORKING]", cand);
// // //   //       else if (cand.includes("typ srflx")) console.log("🟡 [STUN WORKING]", cand);
// // //   //       sendMessage({ type: "candidate", candidate: evt.candidate });
// // //   //     } else {
// // //   //       console.log("[ICE] Gathering finished");
// // //   //     }
// // //   //   };

// // //   //   pc.current.ontrack = (evt) => {
// // //   //     console.log("========= TRACK RECEIVED =========");

// // //   //   console.log("Track Kind:", evt.track.kind);

// // //   //   console.log(
// // //   //       "Tracks in stream:",
// // //   //       evt.streams[0].getTracks().map(t => ({
// // //   //           kind: t.kind,
// // //   //           enabled: t.enabled,
// // //   //           readyState: t.readyState
// // //   //       }))
// // //   //   );
// // //   //     console.log("[WebRTC] Track received:", evt.track?.kind);
// // //   //     if (evt.streams && evt.streams[0]) {
// // //   //       remoteStream.current = evt.streams[0];
// // //   //       try { setRemoteURL(remoteStream.current.toURL()); 
// // //   //         console.log(remoteStream.current.toURL());
// // //   //         console.log("remote_stream url:", remoteStream.current.toURL());
// // //   //       } catch {}
// // //   //       setWebrtcReady(true);
// // //   //       setCallAccepted(true);
// // //   //       InCallManager.start({ media: 'video' });
// // //   //       InCallManager.setSpeakerphoneOn(true);
// // //   //     }
// // //   //   };

// // //   //   pc.current.onconnectionstatechange = async () => {
// // //   //     if (!pc.current) return;
// // //   //     const state = pc.current.connectionState;
// // //   //     console.log("[WebRTC] connectionState =>", state);

// // //   //     if (state === "connected") {
// // //   //       console.log("VIDEO CALL CONNECTED");
// // //   //       try {
// // //   //         const stats = await pc.current.getStats();
// // //   //         stats.forEach((report) => {
// // //   //           if (report.type === "candidate-pair" && report.state === "succeeded") {
// // //   //             const local = stats.get(report.localCandidateId);
// // //   //             const remote = stats.get(report.remoteCandidateId);
// // //   //             if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
// // //   //               console.log("🟢 USING TURN (Xirsys)");
// // //   //             } else if (local?.candidateType === "srflx") {
// // //   //               console.log("🟡 USING STUN");
// // //   //             } else {
// // //   //               console.log("⚪ USING LOCAL");
// // //   //             }
// // //   //           }
// // //   //         });
// // //   //       } catch (err) {
// // //   //         console.warn("[WebRTC] getStats failed:", err);
// // //   //       }
// // //   //     }

// // //   //     if (state === "failed") {
// // //   //       console.warn("VIDEO CONNECTION FAILED");
// // //   //       saveCallToHistory({
// // //   //         contact: { name, profileImage: profile_image, userId: targetUserId },
// // //   //         direction: isInitiator ? 'outgoing' : 'incoming',
// // //   //         isVideoCall: true,
// // //   //         status: 'failed',
// // //   //         duration: callDuration,
// // //   //       });
// // //   //     }
// // //   //   };

// // //   //   pc.current.oniceconnectionstatechange = () => {
// // //   //     if (!pc.current) return;
// // //   //     console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// // //   //   };
// // //   // };

// // //   const ensurePeerConnection = async () => {
// // //   if (pc.current) return;
// // //   if (!rtcConfig.iceServers.length) await getIceServers();

// // //   pc.current = new RTCPeerConnection(rtcConfig);
// // //   console.log("[WebRTC] RTCPeerConnection created");

// // //   // --- Negotiation ---
// // //   pc.current.onnegotiationneeded = () => {
// // //     console.log("[WebRTC] onnegotiationneeded, signalingState:", pc.current?.signalingState);
// // //   };

// // //   // --- ICE Candidates ---
// // //   pc.current.onicecandidate = (evt) => {
// // //     if (evt.candidate) {
// // //       const cand = evt.candidate.candidate;
// // //       if (cand.includes("typ relay")) console.log("🟢 [TURN WORKING]", cand);
// // //       else if (cand.includes("typ srflx")) console.log("🟡 [STUN WORKING]", cand);
// // //       sendMessage({ type: "candidate", candidate: evt.candidate });
// // //     } else {
// // //       console.log("[ICE] Gathering finished");
// // //     }
// // //   };

// // //   // --- TRACK RECEIVED (THIS IS THE ONE YOU NEED) ---
// // //   pc.current.ontrack = (evt) => {
// // //     console.log("========= TRACK RECEIVED =========");
// // //     console.log("Track Kind:", evt.track.kind);
// // //     console.log("Track enabled:", evt.track.enabled);
// // //     console.log("Track readyState:", evt.track.readyState);
    
// // //     if (evt.streams && evt.streams[0]) {
// // //       remoteStream.current = evt.streams[0];
      
// // //       const tracks = evt.streams[0].getTracks();
// // //       console.log(`Received stream with ${tracks.length} tracks:`, 
// // //         tracks.map(t => ({ kind: t.kind, enabled: t.enabled }))
// // //       );
      
// // //       try { 
// // //         const url = remoteStream.current.toURL();
// // //         setRemoteURL(url); 
// // //         console.log("remote_stream url:", url);
// // //       } catch (e) {
// // //         console.error("Error getting remote URL:", e);
// // //       }
      
// // //       setWebrtcReady(true);
// // //       setCallAccepted(true);
// // //       InCallManager.start({ media: 'video' });
// // //       InCallManager.setSpeakerphoneOn(true);
// // //     } else {
// // //       console.warn("[WebRTC] Track received but no stream!");
// // //     }
// // //   };

// // //   // --- Connection State ---
// // //   pc.current.onconnectionstatechange = async () => {
// // //     if (!pc.current) return;
// // //     const state = pc.current.connectionState;
// // //     console.log("[WebRTC] connectionState =>", state);

// // //     if (state === "connected") {
// // //       console.log("VIDEO CALL CONNECTED");
// // //       try {
// // //         const stats = await pc.current.getStats();
// // //         stats.forEach((report) => {
// // //           if (report.type === "candidate-pair" && report.state === "succeeded") {
// // //             const local = stats.get(report.localCandidateId);
// // //             const remote = stats.get(report.remoteCandidateId);
// // //             if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
// // //               console.log("🟢 USING TURN (Xirsys)");
// // //             } else if (local?.candidateType === "srflx") {
// // //               console.log("🟡 USING STUN");
// // //             } else {
// // //               console.log("⚪ USING LOCAL");
// // //             }
// // //           }
// // //         });
// // //       } catch (err) {
// // //         console.warn("[WebRTC] getStats failed:", err);
// // //       }
// // //     }

// // //     if (state === "failed") {
// // //       console.warn("VIDEO CONNECTION FAILED");
// // //       saveCallToHistory({
// // //         contact: { name, profileImage: profile_image, userId: targetUserId },
// // //         direction: isInitiator ? 'outgoing' : 'incoming',
// // //         isVideoCall: true,
// // //         status: 'failed',
// // //         duration: callDuration,
// // //       });
// // //     }
// // //   };

// // //   // --- ICE State ---
// // //   pc.current.oniceconnectionstatechange = () => {
// // //     if (!pc.current) return;
// // //     console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// // //   };
// // // };

// // //  const ensureLocalStreamAndAttach = async () => {
// // //   if (!localStream.current) {
// // //     const hasPermission = await requestPermissions();
// // //     if (!hasPermission) {
// // //       Alert.alert("Permission denied", "Cannot access camera or microphone.");
// // //       return false;
// // //     }
// // //     try {
// // //       const s = await mediaDevices.getUserMedia({
// // //         audio: true,
// // //         video: { 
// // //           facingMode: isCameraFront ? "user" : "environment",
// // //           frameRate: 30,
// // //         },
// // //       });
      
// // //       // ✅ Ensure video track is enabled
// // //       const videoTrack = s.getVideoTracks()[0];
// // //       if (videoTrack) {
// // //         videoTrack.enabled = true;
// // //         console.log("[Local] Video track enabled:", videoTrack.enabled);
// // //       }
      
// // //       localStream.current = s;
// // //       try { setLocalURL(s.toURL()); } catch {}
// // //     } catch (e) {
// // //       Alert.alert("Error", "Failed to get camera/mic: " + e.message);
// // //       return false;
// // //     }
// // //   }
  
// // //   // ✅ Re-enable video track if it's disabled
// // //   if (localStream.current) {
// // //     const videoTrack = localStream.current.getVideoTracks()[0];
// // //     if (videoTrack && !videoTrack.enabled) {
// // //       videoTrack.enabled = true;
// // //       console.log("[Local] Re-enabled video track");
// // //     }
// // //   }
  
// // //   // Only attach if we have a peer connection
// // //   if (pc.current && localStream.current) {
// // //     const existingTracks = pc.current.getSenders().map((s) => s.track);
// // //     localStream.current.getTracks().forEach((track) => {
// // //       if (!existingTracks.includes(track)) {
// // //         pc.current.addTrack(track, localStream.current);
// // //         console.log(`[Local] Attached ${track.kind} track to peer connection`);
// // //       }
// // //     });
// // //   }
// // //   return true;
// // // };

// // //   // const ensureLocalStreamAndAttach = async () => {
// // //   //   if (!localStream.current) {
// // //   //     const hasPermission = await requestPermissions();
// // //   //     if (!hasPermission) {
// // //   //       Alert.alert("Permission denied", "Cannot access camera or microphone.");
// // //   //       return false;
// // //   //     }
// // //   //     try {
// // //   //       const s = await mediaDevices.getUserMedia({
// // //   //         audio: true,
// // //   //         video: { facingMode: isCameraFront ? "user" : "environment" },
// // //   //       });
// // //   //       localStream.current = s;
// // //   //       try { setLocalURL(s.toURL()); } catch {}
// // //   //     } catch (e) {
// // //   //       Alert.alert("Error", "Failed to get camera/mic: " + e.message);
// // //   //       return false;
// // //   //     }
// // //   //   }
// // //   //   if (pc.current) {
// // //   //     const existingTracks = pc.current.getSenders().map((s) => s.track);
// // //   //     localStream.current.getTracks().forEach((track) => {
// // //   //       if (!existingTracks.includes(track)) {
// // //   //         pc.current.addTrack(track, localStream.current);
// // //   //       }
// // //   //     });
// // //   //   }
// // //   //   return true;
// // //   // };

// // //   const drainQueuedCandidates = async () => {
// // //     if (!pc.current) return;
// // //     while (queuedRemoteCandidates.current.length > 0) {
// // //       const c = queuedRemoteCandidates.current.shift();
// // //       try {
// // //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// // //       } catch (err) {
// // //         console.warn("[WebRTC] addIceCandidate error:", err?.message);
// // //       }
// // //     }
// // //   };

// // //   const cleanupPeerConnection = () => {
// // //     console.log("[Cleanup] Closing video peer connection");
// // //     isCleaningUpRef.current = true;
// // //     isCallActiveRef.current = false;
// // //     setCallAccepted(false);
// // //     setCallStarted(false);

// // //     try {
// // //       if (pc.current) {
// // //         pc.current.onicecandidate = null;
// // //         pc.current.ontrack = null;
// // //         pc.current.onnegotiationneeded = null;
// // //         pc.current.onconnectionstatechange = null;
// // //         pc.current.oniceconnectionstatechange = null;
// // //         pc.current.close();
// // //       }
// // //     } catch (e) {}
// // //     pc.current = null;

// // //     try {
// // //       if (localStream.current) {
// // //         localStream.current.getTracks().forEach((t) => t.stop());
// // //       }
// // //     } catch (e) {}
// // //     localStream.current = null;
// // //     remoteStream.current = null;
// // //     queuedRemoteCandidates.current = [];
// // //     hasInitialOfferRef.current = false;

// // //     try { InCallManager.stop(); } catch {}

// // //     setLocalURL(null);
// // //     setRemoteURL(null);
// // //     setWebrtcReady(false);
// // //     setIsCameraFront(true);
// // //     setIsMuted(false);
// // //     setIsSpeakerOn(false);
// // //     isCleaningUpRef.current = false;
// // //   };

// // //   // ─── Signaling ───────────────────────────────────────────────
// // //   const sendMessage = (msg) => {
// // //     if (ws.current?.readyState === WebSocket.OPEN) {
// // //       console.log("[WS] Sending:", msg.type);
// // //       ws.current.send(JSON.stringify(msg));
// // //     } else {
// // //       console.warn("[WS] Cannot send, state:", ws.current?.readyState);
// // //     }
// // //   };

// // //   const connectSignaling = async () => {
// // //     const token = await AsyncStorage.getItem("userToken");
// // //     const userDataRaw = await AsyncStorage.getItem("userData");
// // //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// // //     const currentUserId = userData?.id;

// // //     let roomId;
// // //     if (isInitiator && targetUserId) {
// // //       roomId = `user-${targetUserId}`;
// // //     } else if (autoAnswerOnOffer && targetUserId) {
// // //       // Accepted from notification — connect to OUR room to receive offer
// // //       roomId = `user-${currentUserId}`;
// // //       console.log('[AutoAnswer] Connecting to our room:', roomId);
// // //     } else if (currentUserId) {
// // //       roomId = `user-${currentUserId}`;
// // //     } else {
// // //       roomId = "unknown";
// // //     }

// // //     console.log("[WebSocket] Connecting to room:", roomId);

// // //     if (ws.current) {
// // //       try {
// // //         ws.current.onopen = null;
// // //         ws.current.onmessage = null;
// // //         ws.current.onclose = null;
// // //         ws.current.onerror = null;
// // //         ws.current.close();
// // //       } catch {}
// // //       ws.current = null;
// // //     }

// // //     const url = `${SIGNALING_SERVER}/ws/call/${roomId}/?token=${token || ""}`;
// // //     ws.current = new WebSocket(url);

// // //     ws.current.onopen = async () => {
// // //       console.log("[WebSocket] Connected to", roomId);
// // //       setWsConnected(true);

// // //       await ensurePeerConnection();
// // //       await ensureLocalStreamAndAttach();

// // //       if (isInitiator && targetUserId) {
// // //         isCallerRef.current = true;
// // //         setCallStarted(true);
// // //         startAudioSession();
// // //         await createAndSendInitialOffer();
// // //       }

// // //       // Normal incoming (not from notification)
// // //       if (!isInitiator && isIncomingCall && incomingOffer && !autoAnswerOnOffer) {
// // //         await handleIncomingCall(incomingOffer);
// // //       }
// // //       // autoAnswerOnOffer: wait for offer via WebSocket
// // //     };

// // //     ws.current.onmessage = async (evt) => {
// // //       let data;
// // //       try { data = JSON.parse(evt.data); } catch { return; }

// // //       console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation);

// // //       // Drop messages after call ended
// // //       if (!isCallActiveRef.current && data?.type !== "call-ended") {
// // //         console.warn("[WS] Ignoring after call ended:", data?.type);
// // //         return;
// // //       }

// // //       // ── Echo filtering ──────────────────────────────────────
// // //       // Ignore our own offer echoed back
// // //       if (data.type === 'offer' && !data.isRenegotiation && isCallerRef.current) {
// // //         console.warn('[WS] Ignoring own offer echo — we are the caller');
// // //         return;
// // //       }
// // //       // Ignore answer if we are the callee
// // //       if (data.type === 'answer' && !isCallerRef.current && !data.isRenegotiation) {
// // //         console.warn('[WS] Ignoring answer — we are the callee');
// // //         return;
// // //       }
// // //       // ────────────────────────────────────────────────────────

// // //       switch (data.type) {

// // //         case "offer": {
// // //           if (data.isRenegotiation) {
// // //             try {
// // //               await ensurePeerConnection();
// // //               await ensureLocalStreamAndAttach();
// // //             } catch (err) {
// // //               console.error("[WebRTC] Renegotiation prep failed:", err);
// // //               return;
// // //             }
// // //             await handleRenegotiationOffer(data.offer);
// // //             break;
// // //           }

// // //           // Regular initial offer
// // //           if (isCallerRef.current) break;

// // //           const offerData = data.offer;
// // //           if (!offerData?.sdp) {
// // //             console.error("[WS] Offer missing SDP");
// // //             break;
// // //           }

// // //           console.log("[WS] Valid video offer, SDP length:", offerData.sdp.length);

// // //           if (autoAnswerOnOfferRef.current) {
// // //             // User already accepted from notification — answer immediately
// // //             console.log('[AutoAnswer] Auto-answering video offer');
// // //             autoAnswerOnOfferRef.current = false;
// // //             isCallerRef.current = false;
// // //             startAudioSession();
// // //             await handleIncomingCall(offerData);
// // //             if (currentCallIdRef.current) {
// // //               await CallKeepService.setCallConnected(currentCallIdRef.current);
// // //             }
// // //           } else {
// // //             // Normal flow — show modal + CallKeep UI
// // //             const incomingCallId = `call_${Date.now()}`;
// // //             updateCallId(incomingCallId);
// // //             setIncomingSDP(offerData);

// // //             await CallKeepService.displayIncomingCall({
// // //               callId: incomingCallId,
// // //               callerName: offerData.callerInfo?.name || name || 'Unknown',
// // //               callerId: offerData.callerId || targetUserId || '',
// // //               isVideo: true,
// // //               roomId: offerData.roomId || '',
// // //             });

// // //             setShowIncomingModal(true);
// // //           }
// // //           break;
// // //         }

// // //         case "answer": {
// // //           if (!isCallerRef.current || !pc.current) break;
// // //           setCallAccepted(true);
// // //           if (pc.current.signalingState === "have-local-offer") {
// // //             try {
// // //               await pc.current.setRemoteDescription(
// // //                 new RTCSessionDescription(data.answer)
// // //               );
// // //               await drainQueuedCandidates();
// // //             } catch (e) {
// // //               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message);
// // //             }
// // //           }
// // //           break;
// // //         }

// // //         case "candidate": {
// // //           if (!pc.current) break;
// // //           if (!pc.current.remoteDescription) {
// // //             queuedRemoteCandidates.current.push(data.candidate);
// // //           } else {
// // //             try {
// // //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// // //             } catch (e) {
// // //               console.warn("[WebRTC] addIceCandidate error:", e?.message);
// // //             }
// // //           }
// // //           break;
// // //         }

// // //         case "call-ended": {
// // //           Alert.alert("Call Ended", "Your call partner has disconnected");
// // //           endCall(false);
// // //           break;
// // //         }

// // //         case "call-rejected": {
// // //           Alert.alert("Call Rejected", "The recipient declined your call");
// // //           await saveCallToHistory({
// // //             contact: { name, profileImage: profile_image, userId: targetUserId },
// // //             direction: 'outgoing',
// // //             isVideoCall: true,
// // //             status: 'rejected',
// // //             duration: 0,
// // //           });
// // //           endCall(false);
// // //           break;
// // //         }

// // //         case "call-missed": {
// // //           if (!isInitiator) {
// // //             await saveCallToHistory({
// // //               contact: { name, profileImage: profile_image, userId: targetUserId },
// // //               direction: 'incoming',
// // //               isVideoCall: true,
// // //               status: 'missed',
// // //               duration: 0,
// // //             });
// // //           }
// // //           break;
// // //         }

// // //         default:
// // //           break;
// // //       }
// // //     };

// // //     ws.current.onclose = () => {
// // //       setWsConnected(false);
// // //       if (!isCleaningUpRef.current) cleanupPeerConnection();
// // //     };

// // //     ws.current.onerror = (err) => {
// // //       console.error("[WebSocket] Error:", err?.message);
// // //     };
// // //   };

// // //   // ─── Renegotiation ───────────────────────────────────────────
// // //   const handleRenegotiationOffer = async (offer) => {
// // //     try {
// // //       if (!pc.current) {
// // //         await ensurePeerConnection();
// // //         await ensureLocalStreamAndAttach();
// // //       }
// // //       if (!pc.current || pc.current.signalingState === "closed") return;

// // //       console.log("[WebRTC] Renegotiation, signalingState:", pc.current.signalingState);
// // //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// // //       await drainQueuedCandidates();

// // //       const answer = await pc.current.createAnswer();
// // //       await pc.current.setLocalDescription(answer);

// // //       sendMessage({ type: "answer", answer, isVideoCall: true, isRenegotiation: true });
// // //       console.log("[WebRTC] Renegotiation answer sent");
// // //     } catch (error) {
// // //       console.error("[WebRTC] Renegotiation failed:", error);
// // //     }
// // //   };

// // //   // ─── Call history ─────────────────────────────────────────────
// // //   const saveCallToHistory = async (callDetails) => {
// // //     try {
// // //       const existingHistory = await AsyncStorage.getItem('callHistory');
// // //       const history = existingHistory ? JSON.parse(existingHistory) : [];
// // //       const newCall = {
// // //         id: Date.now().toString(),
// // //         timestamp: Date.now(),
// // //         contact: {
// // //           name: callDetails.contact.name,
// // //           profileImage: callDetails.contact.profileImage,
// // //           userId: callDetails.contact.userId,
// // //         },
// // //         direction: callDetails.direction,
// // //         isVideoCall: true,
// // //         status: callDetails.status,
// // //         duration: callDetails.duration || 0,
// // //       };
// // //       history.unshift(newCall);
// // //       await AsyncStorage.setItem('callHistory', JSON.stringify(history.slice(0, 100)));
// // //       console.log('[CallHistory] Saved:', callDetails.status);
// // //     } catch (error) {
// // //       console.error('[CallHistory] Error:', error);
// // //     }
// // //   };

// // //   // ─── Offer / answer ───────────────────────────────────────────
// // //   const createAndSendInitialOffer = async () => {
// // //     if (hasInitialOfferRef.current) return;

// // //     console.log("[VideoCall] Creating initial offer...");
// // //     await ensurePeerConnection();
// // //     const ok = await ensureLocalStreamAndAttach();
// // //     if (!ok || !pc.current) return;

// // //     try {
// // //       const userDataRaw = await AsyncStorage.getItem("userData");
// // //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// // //       const currentUserId = userData?.id;

// // //       if (!currentUserId) {
// // //         console.error("[VideoCall] No current user ID");
// // //         return;
// // //       }

// // //       const callerInfo = {
// // //         profileImage: userData.profile_picture || userData.profile_image || "",
// // //         name: userData.name || "Caller",
// // //       };

// // //       const offer = await pc.current.createOffer();
// // //       await pc.current.setLocalDescription(offer);

// // //       console.log("[VideoCall] Offer SDP length:", offer.sdp?.length);

// // //       sendMessage({
// // //         type: "new_call",
// // //         receiver_id: targetUserId,
// // //         sender_id: currentUserId,
// // //         caller_name: callerInfo.name,
// // //         call_type: "video",
// // //         room_id: `call_${currentUserId}_${targetUserId}`,
// // //         offer: {
// // //           type: offer.type,
// // //           sdp: offer.sdp,
// // //           targetUserId,
// // //           callerId: currentUserId,
// // //           callerInfo,
// // //           isVideoCall: true,
// // //         },
// // //       });

// // //       hasInitialOfferRef.current = true;
// // //       console.log("[VideoCall] Initial offer sent ✅");
// // //     } catch (e) {
// // //       console.error("[VideoCall] createOffer failed:", e?.message);
// // //     }
// // //   };

// // // //  const handleIncomingCall = async (offer) => {
// // // //   try {
// // // //     console.log("[Incoming] Starting...");

// // // //     if (!currentCallIdRef.current) {                       //  only create if not already set
// // // //       const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
// // // //       updateCallId(newCallId);
// // // //     }
    
// // // //     const newCallId = `call_${Date.now()}_${offer.callerId || 'unknown'}`;
// // // //     updateCallId(newCallId);

// // // //     if (!offer?.sdp) {
// // // //       console.error("[VideoCall] Missing SDP in offer");
// // // //       Alert.alert("Error", "Invalid video call offer.");
// // // //       rejectCall();
// // // //       return;
// // // //     }

// // // //     await ensurePeerConnection();
// // // //     const ok = await ensureLocalStreamAndAttach();
// // // //     if (!ok || !pc.current) {
// // // //       rejectCall();
// // // //       return;
// // // //     }

// // // //     // Add tracks
// // // //     if (pc.current && localStream.current) {
// // // //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// // // //       localStream.current.getTracks().forEach((track) => {
// // // //         if (!existingTracks.includes(track)) {
// // // //           pc.current.addTrack(track, localStream.current);
// // // //         }
// // // //       });
// // // //     }

// // // //     // ✅ Set remote description
// // // //     await pc.current.setRemoteDescription(
// // // //       new RTCSessionDescription({ 
// // // //         type: offer.type || 'offer', 
// // // //         sdp: offer.sdp 
// // // //       })
// // // //     );
    
// // // //     await drainQueuedCandidates();

// // // //     // Create answer
// // // //     const answer = await pc.current.createAnswer();
// // // //     await pc.current.setLocalDescription(answer);

// // // //     console.log("========= ANSWER SDP =========");
// // // // console.log(answer.sdp);

// // // //     console.log("========= BEFORE CREATE ANSWER =========");

// // // // console.log(
// // // //     "Local video tracks:",
// // // //     localStream.current.getVideoTracks().length
// // // // );

// // // // console.log(
// // // //     "Local audio tracks:",
// // // //     localStream.current.getAudioTracks().length
// // // // );

// // // // console.log(
// // // //     "Peer senders:",
// // // //     pc.current.getSenders().map(sender => ({
// // // //         kind: sender.track?.kind,
// // // //         enabled: sender.track?.enabled,
// // // //         readyState: sender.track?.readyState
// // // //     }))
// // // // );

// // // //     // Send answer
// // // //     sendMessage({
// // // //       type: "answer",
// // // //       answer: { type: answer.type, sdp: answer.sdp },
// // // //       isVideoCall: true,
// // // //     });

// // // //     // Wait for ontrack to fire
// // // //     console.log("[Incoming] Waiting for remote tracks...");
    
// // // //     const trackTimeout = setTimeout(() => {
// // // //       if (!remoteStream.current) {
// // // //         console.warn("[Incoming] No remote tracks received after 5 seconds!");
       
// // // //         const receivers = pc.current?.getReceivers();
// // // //         if (receivers && receivers.length > 0) {
// // // //           console.log("[Incoming] Found receivers:", receivers.length);
// // // //           receivers.forEach(r => {
// // // //             console.log("[Incoming] Receiver track:", r.track?.kind);
// // // //           });
// // // //         }
// // // //       }
// // // //     }, 5000);

// // // //     setWebrtcReady(true);
// // // //     setCallAccepted(true);
// // // //     setShowIncomingModal(false);
// // // //     setIncomingSDP(null);

// // // //     try { NativeModules.CallModule?.stopCallService(); } catch {}

// // // //     console.log("[VideoCall] Incoming call accepted");
    
// // // //     // Clear timeout
// // // //     return () => clearTimeout(trackTimeout);
    
// // // //   } catch (error) {
// // // //     console.error("[VideoCall] handleIncomingCall error:", error?.message);
// // // //     Alert.alert("Error", "Failed to accept video call: " + (error?.message || "Unknown"));
// // // //     rejectCall();
// // // //   }
// // // // };

// // // const handleIncomingCall = async (offer) => {
// // //   try {
// // //     console.log("[Incoming] Starting...");

// // //     if (!currentCallIdRef.current) {
// // //       const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
// // //       updateCallId(newCallId);
// // //     }

// // //     if (!offer?.sdp) {
// // //       console.error("[VideoCall] Missing SDP in offer");
// // //       Alert.alert("Error", "Invalid video call offer.");
// // //       rejectCall();
// // //       return;
// // //     }

// // //     // ✅ STEP 1: Ensure peer connection is created
// // //     await ensurePeerConnection();
    
// // //     // ✅ STEP 2: Ensure local stream is created
// // //     const ok = await ensureLocalStreamAndAttach();
// // //     if (!ok || !pc.current) {
// // //       rejectCall();
// // //       return;
// // //     }

// // //     // ✅ STEP 3: Add tracks to peer connection BEFORE setting remote description
// // //     if (pc.current && localStream.current) {
// // //       const existingSenders = pc.current.getSenders();
// // //       const existingTrackIds = new Set(existingSenders.map(s => s.track?.id).filter(Boolean));
      
// // //       // Clear existing senders to avoid duplication
// // //       existingSenders.forEach(sender => {
// // //         pc.current.removeTrack(sender);
// // //       });
      
// // //       // Add all tracks fresh
// // //       localStream.current.getTracks().forEach((track) => {
// // //         console.log(`[Incoming] Adding track: ${track.kind}`);
// // //         pc.current.addTrack(track, localStream.current);
// // //       });
// // //     }

// // //     // ✅ STEP 4: Set remote description
// // //     await pc.current.setRemoteDescription(
// // //       new RTCSessionDescription({ 
// // //         type: offer.type || 'offer', 
// // //         sdp: offer.sdp 
// // //       })
// // //     );
    
// // //     await drainQueuedCandidates();

// // //     // ✅ STEP 5: Create answer with explicit video/audio options
// // //     const answer = await pc.current.createAnswer({
// // //       offerToReceiveAudio: true,
// // //       offerToReceiveVideo: true,
// // //     });
    
// // //     await pc.current.setLocalDescription(answer);

// // //     // Debug logging
// // //     console.log("========= ANSWER SDP =========");
// // //     console.log(answer.sdp);
// // //     console.log("Local video tracks:", localStream.current.getVideoTracks().length);
// // //     console.log("Local audio tracks:", localStream.current.getAudioTracks().length);
// // //     console.log("Peer senders:", pc.current.getSenders().map(sender => ({
// // //       kind: sender.track?.kind,
// // //       enabled: sender.track?.enabled,
// // //       readyState: sender.track?.readyState
// // //     })));

// // //     // ✅ STEP 6: Send answer
// // //     sendMessage({
// // //       type: "answer",
// // //       answer: { type: answer.type, sdp: answer.sdp },
// // //       isVideoCall: true,
// // //     });

// // //     setWebrtcReady(true);
// // //     setCallAccepted(true);
// // //     setShowIncomingModal(false);
// // //     setIncomingSDP(null);

// // //     // Stop foreground service notification
// // //     try { NativeModules.CallModule?.stopCallService(); } catch {}

// // //     console.log("[VideoCall] Incoming call accepted");
    
// // //   } catch (error) {
// // //     console.error("[VideoCall] handleIncomingCall error:", error?.message);
// // //     Alert.alert("Error", "Failed to accept video call: " + (error?.message || "Unknown"));
// // //     rejectCall();
// // //   }
// // // };


// // //   // ─── Lifecycle ────────────────────────────────────────────────
// // //   useEffect(() => {
// // //     connectSignaling();
// // //     return () => { endCall(false); };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (webrtcReady && callAccepted) {
// // //       const startTime = Date.now();
// // //       callTimerRef.current = setInterval(() => {
// // //         setCallDuration(Math.floor((Date.now() - startTime) / 1000));
// // //       }, 1000);
// // //     } else {
// // //       if (callTimerRef.current) {
// // //         clearInterval(callTimerRef.current);
// // //         callTimerRef.current = null;
// // //         setCallDuration(0);
// // //       }
// // //     }
// // //     return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
// // //   }, [webrtcReady, callAccepted]);

// // //   // ─── Call actions ─────────────────────────────────────────────
// // //   const acceptCall = async () => {
// // //     stopRinging();
// // //     isCallerRef.current = false;
// // //     const offer = incomingSDP;
// // //     if (!offer?.sdp) {
// // //       Alert.alert("Error", "Invalid video call offer.");
// // //       return;
// // //     }
// // //     startAudioSession();
// // //     await handleIncomingCall(offer);
// // //   };

// // //   const startCall = async () => {
// // //     isCallerRef.current = true;
// // //     setCallStarted(true);
// // //     const newCallId = `call_${Date.now()}_${targetUserId}`;
// // //     updateCallId(newCallId);
// // //     startAudioSession();
// // //     await ensureLocalStreamAndAttach();
// // //     await createAndSendInitialOffer();
// // //   };

// // //   const endCall = useCallback(async (notify = true) => {
// // //   console.log("[VideoCall] Ending call...");
  
// // //   // ─── 1. IMMEDIATE STOP ───
// // //   // Stop ringing immediately
// // //   try { InCallManager.stopRingtone(); } catch (e) {}
  
// // //   // Mark call as inactive immediately
// // //   isCallActiveRef.current = false;

// // //   // ─── 2. IMMEDIATE STATE RESET ───
// // //   // Reset all UI state immediately
// // //   setWebrtcReady(false);
// // //   setLocalURL(null);
// // //   setRemoteURL(null);
// // //   setCallDuration(0);
// // //   setCurrentCallId(null);
// // //   setShowIncomingModal(false);
// // //   setIncomingSDP(null);

// // //   // ─── 3. NAVIGATE INSTANTLY ───
// // //   // Use setTimeout(0) for immediate navigation in next tick
// // //   setTimeout(() => {
// // //     try {
// // //       if (navigation.canGoBack()) {
// // //         navigation.goBack();
// // //       } else {
// // //         navigation.navigate("PHome");
// // //       }
// // //     } catch (e) {
// // //       navigation.navigate("PHome");
// // //     }
// // //   }, 0);

// // //   // ─── 4. BACKGROUND CLEANUP (non-blocking) ───
// // //   const cid = currentCallIdRef.current || currentCallId;
  
// // //   // Use setTimeout with 0 to defer all cleanup
// // //   setTimeout(() => {
// // //     // End CallKeep call
// // //     if (cid) {
// // //       try { 
// // //         CallKeepService.endCall(cid).catch(() => {}); 
// // //       } catch (e) {}
// // //     }

// // //     // Stop foreground service
// // //     try { 
// // //       NativeModules.CallModule?.stopCallService(); 
// // //     } catch (e) {}

// // //     // Notify other party
// // //     if (notify && ws.current?.readyState === WebSocket.OPEN) {
// // //       try { 
// // //         ws.current.send(JSON.stringify({ type: "call-ended" })); 
// // //       } catch (e) {}
// // //     }

// // //     // Close WebSocket
// // //     try {
// // //       if (ws.current) {
// // //         ws.current.onopen = null;
// // //         ws.current.onmessage = null;
// // //         ws.current.onclose = null;
// // //         ws.current.onerror = null;
// // //         ws.current.close();
// // //         ws.current = null;
// // //       }
// // //     } catch (e) {}

// // //     // Stop audio
// // //     try {
// // //       InCallManager.stop();
// // //     } catch (e) {}

// // //     // Cleanup peer connection
// // //     try {
// // //       cleanupPeerConnection();
// // //     } catch (e) {}

// // //     console.log("[VideoCall] Cleanup complete");
// // //   }, 0);

// // //   // ─── 5. SAVE HISTORY (async, no await) ───
// // //   const callDetails = {
// // //     contact: {
// // //       name: name || 'Unknown',
// // //       profileImage: profile_image || '',
// // //       userId: targetUserId || 'unknown',
// // //     },
// // //     direction: isInitiator ? 'outgoing' : 'incoming',
// // //     isVideoCall: true,
// // //     status: webrtcReady ? 'ended' : 'missed',
// // //     duration: callDuration || 0,
// // //   };

// // //   // Fire and forget save
// // //   saveCallToHistory(callDetails).catch(() => {});

// // // }, [navigation, isInitiator, name, profile_image, targetUserId, webrtcReady, callDuration, currentCallId]);



// // //   const rejectCall = async () => {
// // //     stopRinging();
// // //     sendMessage({ type: "call-rejected" });
// // //     await saveCallToHistory({
// // //       contact: { name, profileImage: profile_image, userId: targetUserId },
// // //       direction: 'incoming',
// // //       isVideoCall: true,
// // //       status: 'rejected',
// // //       duration: 0,
// // //     });
// // //     setShowIncomingModal(false);
// // //     setIncomingSDP(null);
// // //     navigation.goBack();
// // //   };

// // //   const switchCamera = async () => {
// // //     if (!localStream.current) return;
// // //     const videoTrack = localStream.current.getVideoTracks()[0];
// // //     if (videoTrack) {
// // //       videoTrack._switchCamera();
// // //       setIsCameraFront(!isCameraFront);
// // //     }
// // //   };

// // //   const toggleMute = () => {
// // //     if (localStream.current) {
// // //       const audioTrack = localStream.current.getAudioTracks()[0];
// // //       if (audioTrack) {
// // //         audioTrack.enabled = !audioTrack.enabled;
// // //         setIsMuted(!audioTrack.enabled);
// // //       }
// // //     }
// // //   };

// // //   const toggleSpeaker = () => {
// // //     const newState = !isSpeakerOn;
// // //     InCallManager.setSpeakerphoneOn(newState);
// // //     setIsSpeakerOn(newState);
// // //   };

// // //   const formatTime = (seconds) => {
// // //     const mins = Math.floor(seconds / 60);
// // //     const secs = seconds % 60;
// // //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// // //   };

// // //   // ─── UI ───────────────────────────────────────────────────────

// // //   return (
  
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="light-content" />

// // //       {(webrtcReady && callAccepted) ? (
// // //         <View style={styles.callScreen}>
// // //           {/* Video Call Interface */}
// // //           {remoteURL ? (
// // //             <View style={styles.videoContainer}>
// // //               {/* Remote Video - Full Screen */}
// // //               <>
// // //                {console.log("RTCView rendering with:", remoteURL)}
// // //               <RTCView 
// // //                 streamURL={remoteURL} 
// // //                 style={styles.remoteVideo} 
// // //                 objectFit="cover" 
// // //               />
// // //               </>

// // //               {/* Draggable Local Video PiP========= */}
// // //               {localURL && pipVisible && (
// // //                 <View
// // //                   style={[
// // //                     styles.localVideoWrapper,
// // //                     {
// // //                       left: pipPositionState.x,
// // //                       top: pipPositionState.y,
// // //                     }
// // //                   ]}
// // //                   {...pipPanResponder.panHandlers}
// // //                 >
// // //                   <View style={styles.pipContainer}>
// // //                     <RTCView 
// // //                       streamURL={localURL} 
// // //                       style={styles.localVideoStream} 
// // //                       objectFit="cover" 
// // //                       mirror={isCameraFront}
// // //                     />
                    
// // //                     {/* Close button */}
// // //                     <TouchableOpacity 
// // //                       style={styles.pipCloseButton}
// // //                       onPress={togglePipVisibility}
// // //                       activeOpacity={0.7}
// // //                     >
// // //                       <Icon name="close" size={16} color="white" />
// // //                     </TouchableOpacity>

// // //                     {/* Switch camera button on PiP */}
// // //                     <TouchableOpacity 
// // //                       style={styles.pipSwitchButton}
// // //                       onPress={switchCamera}
// // //                       activeOpacity={0.7}
// // //                     >
// // //                       <Icon name="flip-camera-ios" size={16} color="white" />
// // //                     </TouchableOpacity>
// // //                   </View>
// // //                 </View>
// // //               )}

// // //               {/* Show PiP again button when hidden */}
// // //               {!pipVisible && localURL && (
// // //                 <TouchableOpacity 
// // //                   style={styles.showPipButton}
// // //                   onPress={togglePipVisibility}
// // //                   activeOpacity={0.7}
// // //                 >
// // //                   <Icon name="videocam" size={20} color="white" />
// // //                 </TouchableOpacity>
// // //               )}

// // //               {/* Top Bar with Call Info */}
// // //               <View style={styles.topBar}>
// // //                 <View style={styles.topBarContent}>
// // //                   <Text style={styles.callerNameText} numberOfLines={1}>
// // //                     {name || 'Unknown'}
// // //                   </Text>
// // //                   <Text style={styles.callDurationText}>
// // //                     {formatTime(callDuration)}
// // //                   </Text>
// // //                 </View>
// // //               </View>

// // //               {/* Bottom Controls  */}
// // //               <View style={styles.bottomControls}>
// // //                 <View style={styles.controlsRow}>
// // //                   {/* Mute Button */}
// // //                   <TouchableOpacity 
// // //                     style={styles.controlBtn} 
// // //                     onPress={toggleMute}
// // //                     activeOpacity={0.6}
// // //                   >
// // //                     <Icon 
// // //                       name={isMuted ? "mic-off" : "mic"} 
// // //                       size={22} 
// // //                       color="white" 
// // //                     />
// // //                   </TouchableOpacity>

// // //                   {/* Speaker Button */}
// // //                   <TouchableOpacity 
// // //                     style={styles.controlBtn} 
// // //                     onPress={toggleSpeaker}
// // //                     activeOpacity={0.6}
// // //                   >
// // //                     <Icon 
// // //                       name={isSpeakerOn ? "volume-up" : "volume-off"} 
// // //                       size={22} 
// // //                       color="white" 
// // //                     />
// // //                   </TouchableOpacity>

// // //                   {/* Video Toggle */}
// // //                   <TouchableOpacity 
// // //                     style={styles.controlBtn} 
// // //                     onPress={togglePipVisibility}
// // //                     activeOpacity={0.6}
// // //                   >
// // //                     <Icon 
// // //                       name={pipVisible ? "videocam" : "videocam-off"} 
// // //                       size={22} 
// // //                       color="white" 
// // //                     />
// // //                   </TouchableOpacity>

// // //                   {/* Switch Camera */}
// // //                   <TouchableOpacity 
// // //                     style={styles.controlBtn} 
// // //                     onPress={switchCamera}
// // //                     activeOpacity={0.6}
// // //                   >
// // //                     <Icon name="flip-camera-ios" size={22} color="white" />
// // //                   </TouchableOpacity>

// // //                   {/* End Call */}
// // //                   <TouchableOpacity 
// // //                     style={styles.endCallBtn} 
// // //                     onPress={() => endCall(true)}
// // //                     activeOpacity={0.6}
// // //                   >
// // //                     <Icon name="call-end" size={26} color="white" />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           ) : (
// // //             /* Loading/Avatar view when remote video not available */
// // //             <View style={styles.loadingContainer}>
// // //               <View style={styles.avatarContainer}>
// // //                 <View style={styles.avatar}>
// // //                   <Image
// // //                     source={{ uri: `${profile_image}` }}
// // //                     // source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                     style={styles.avatarImage}
// // //                     resizeMode="cover"
// // //                   />
// // //                 </View>
// // //                 <Text style={styles.callerName}>{name}</Text>
// // //                 <Text style={styles.callTypeText}>
// // //                   Connecting Video • {formatTime(callDuration)}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           )}
// // //         </View>
// // //       ) : (
// // //         /* Connecting Screen */
// // //         <View style={styles.connectingScreen}>
// // //           <View style={styles.connectingContent}>
// // //             {/* Avatar */}
// // //             <View style={styles.connectingAvatarContainer}>
// // //               <Image
// // //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                 style={styles.connectingAvatar}
// // //                 resizeMode="cover"
// // //               />
// // //             </View>

// // //             {/* Name */}
// // //             <Text style={styles.connectingName}>{name || 'Unknown'}</Text>

// // //             {/* Status */}
// // //             <View style={styles.connectingStatusRow}>
// // //               <Text style={styles.connectingStatusText}>
// // //                 {wsConnected
// // //                   ? (isInitiator
// // //                       ? (callAccepted ? "Connecting..." : "Processing please wait...")
// // //                       : autoAnswerOnOffer
// // //                         ? "Connecting to video call..."
// // //                         : "Incoming video call...")
// // //                   : "Connecting..."}
// // //               </Text>
// // //             </View>

// // //             {/* Cancel Button */}
// // //             {isInitiator && (
// // //               <TouchableOpacity 
// // //                 style={styles.connectingEndBtn} 
// // //                 onPress={() => endCall(true)}
// // //                 activeOpacity={0.6}
// // //               >
// // //                 <View style={styles.connectingEndIcon}>
// // //                   <Icon name="call-end" size={26} color="white" />
// // //                 </View>
// // //                 <Text style={styles.connectingEndText}>Cancel</Text>
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>
// // //         </View>
// // //       )}

// // //       {/* Incoming call modal */}
// // //       {!isInitiator && (
// // //         <Modal
// // //           visible={showIncomingModal}
// // //           transparent
// // //           animationType="fade"
// // //           onRequestClose={rejectCall}
// // //         >
// // //           <View style={styles.modalOverlay}>
// // //             <View style={styles.modalContainer}>
// // //               <View style={styles.modalContent}>
// // //                 <Text style={styles.incomingCallText}>Incoming Video Call</Text>
// // //                 <View style={styles.callerInfo}>
// // //                   <View style={styles.modalAvatar}>
// // //                     <Image
// // //                       source={{ uri: `${profile_image}` }}
// // //                       // source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// // //                       style={styles.modalAvatarImage}
// // //                       resizeMode="cover"
// // //                     />
// // //                   </View>
// // //                   <Text style={styles.modalCallerName}>{name}</Text>
// // //                   <Text style={styles.modalCallType}>Video Call</Text>
// // //                 </View>
// // //                 <View style={styles.modalButtons}>
// // //                   <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
// // //                     <View style={styles.rejectButtonInner}>
// // //                       <Icon name="call-end" size={30} color="white" />
// // //                     </View>
// // //                     <Text style={styles.buttonText}>Decline</Text>
// // //                   </TouchableOpacity>
// // //                   <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
// // //                     <View style={styles.acceptButtonInner}>
// // //                       <Icon name="videocam" size={30} color="white" />
// // //                     </View>
// // //                     <Text style={styles.buttonText}>Accept</Text>
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </Modal>
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   callScreen: { flex: 1, justifyContent: 'space-between', padding: 20 },
// // //   videoContainer: { flex: 1, width: '100%', position: 'relative' },
// // //   callInfoOverlay: {
// // //     position: 'absolute',
// // //     top: 5,
// // //     left: 0,
// // //     right: 0,
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // //     padding: 10,
// // //     zIndex: 100,
// // //     borderBottomLeftRadius: 5,
// // //     borderBottomRightRadius: 5,
// // //   },
// // //   callScreen: {
// // //     flex: 1,
// // //     backgroundColor: '#000',
// // //   },
// // //   videoContainer: {
// // //     flex: 1,
// // //     backgroundColor: '#000',
// // //   },
// // //   // remoteVideo: {
// // //   //   position: 'absolute',
// // //   //   top: 0,
// // //   //   left: 0,
// // //   //   bottom: 0,
// // //   //   right: 0,
// // //   // },
  
// // //   // Draggable PiP
// // //   localVideoWrapper: {
// // //     position: 'absolute',
// // //     zIndex: 10,
// // //     elevation: 8,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 6,
// // //   },
// // //   pipContainer: {
// // //     width: 100,
// // //     height: 140,
// // //     borderRadius: 10,
// // //     overflow: 'hidden',
// // //     backgroundColor: '#2a2a2a',
// // //     borderWidth: 1.5,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //   },
// // //   localVideoStream: {
// // //     width: '100%',
// // //     height: '100%',
// // //   },
// // //   pipCloseButton: {
// // //     position: 'absolute',
// // //     top: 4,
// // //     right: 4,
// // //     width: 24,
// // //     height: 24,
// // //     borderRadius: 12,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //   },
// // //   pipSwitchButton: {
// // //     position: 'absolute',
// // //     bottom: 4,
// // //     right: 4,
// // //     width: 24,
// // //     height: 24,
// // //     borderRadius: 12,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //   },
// // //   showPipButton: {
// // //     position: 'absolute',
// // //     top: Platform.OS === 'ios' ? 110 : 80,
// // //     right: 16,
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     zIndex: 10,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //   },
  
// // //   // Top Bar
// // //   topBar: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     paddingTop: Platform.OS === 'ios' ? 50 : 30,
// // //     paddingBottom: 15,
// // //     paddingHorizontal: 16,
// // //     zIndex: 5,
// // //   },
// // //   topBarContent: {
// // //     alignItems: 'center',
// // //   },
// // //   callerNameText: {
// // //     fontSize: 17,
// // //     fontWeight: '600',
// // //     color: 'white',
// // //     textAlign: 'center',
// // //     marginBottom: 3,
// // //   },
// // //   callDurationText: {
// // //     fontSize: 13,
// // //     color: 'rgba(255, 255, 255, 0.8)',
// // //     textAlign: 'center',
// // //   },
  
// // //   // Bottom Controls
// // //   bottomControls: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     right: 0,
// // //     paddingBottom: Platform.OS === 'ios' ? 35 : 25,
// // //     paddingTop: 15,
// // //     paddingHorizontal: 16,
// // //     zIndex: 5,
// // //   },
// // //   controlsRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 10,
// // //   },
// // //   controlBtn: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 22,
// // //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   endCallBtn: {
// // //     width: 52,
// // //     height: 52,
// // //     borderRadius: 26,
// // //     backgroundColor: '#E53935',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     transform: [{ rotate: '135deg' }],
// // //     elevation: 3,
// // //     shadowColor: '#E53935',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 3,
// // //   },
  
// // //   // Loading Container
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: '#1a1a2e',
// // //   },
  
// // //   // Connecting Screen
// // //   connectingScreen: {
// // //     flex: 1,
// // //     backgroundColor: '#000',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   connectingContent: {
// // //     alignItems: 'center',
// // //     width: '100%',
// // //     paddingHorizontal: 20,
// // //   },
// // //   connectingAvatarContainer: {
// // //     marginBottom: 25,
// // //   },
// // //   connectingAvatar: {
// // //     width: 110,
// // //     height: 110,
// // //     borderRadius: 55,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.1)',
// // //   },
// // //   connectingName: {
// // //     fontSize: 22,
// // //     fontWeight: '600',
// // //     color: 'white',
// // //     marginBottom: 10,
// // //   },
// // //   connectingStatusRow: {
// // //     alignItems: 'center',
// // //     marginBottom: 45,
// // //   },
// // //   connectingStatusText: {
// // //     fontSize: 15,
// // //     color: 'rgba(255, 255, 255, 0.6)',
// // //   },
// // //   connectingEndBtn: {
// // //     alignItems: 'center',
// // //   },
// // //   connectingEndIcon: {
// // //     width: 65,
// // //     height: 65,
// // //     borderRadius: 32.5,
// // //     backgroundColor: '#E53935',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //     transform: [{ rotate: '135deg' }],
// // //   },
// // //   connectingEndText: {
// // //     color: 'rgba(255, 255, 255, 0.6)',
// // //     fontSize: 13,
// // //   },

// // //   // Modal styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.8)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalContainer: {
// // //     width: '90%',
// // //     borderRadius: 20,
// // //     overflow: 'hidden',
// // //     backgroundColor: '#1a1a2e',
// // //   },
// // //   modalContent: {
// // //     padding: 30,
// // //     alignItems: 'center',
// // //   },
// // //   incomingCallText: {
// // //     fontSize: 22,
// // //     color: 'white',
// // //     fontWeight: 'bold',
// // //     marginBottom: 20,
// // //   },
// // //   callerInfo: {
// // //     alignItems: 'center',
// // //     marginBottom: 40,
// // //   },
// // //   modalAvatar: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: '#4a5568',
// // //     marginBottom: 15,
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //     overflow: 'hidden',
// // //   },
// // //   modalAvatarImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 50,
// // //   },
// // //   modalCallerName: {
// // //     fontSize: 22,
// // //     color: 'white',
// // //     fontWeight: 'bold',
// // //     marginBottom: 5,
// // //   },
// // //   modalCallType: {
// // //     fontSize: 16,
// // //     color: '#a0aec0',
// // //   },
// // //   modalButtons: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     width: '100%',
// // //   },
// // //   rejectButton: {
// // //     alignItems: 'center',
// // //   },
// // //   acceptButton: {
// // //     alignItems: 'center',
// // //   },
// // //   rejectButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#e53e3e',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   acceptButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#38a169',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   buttonText: {
// // //     color: 'white',
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
  
// // //   // Keep existing styles
// // //   avatarContainer: {
// // //     alignItems: 'center',
// // //     marginVertical: 30,
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //   },
// // //   avatar: {
// // //     width: 150,
// // //     height: 150,
// // //     borderRadius: 75,
// // //     backgroundColor: '#4a5568',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //     overflow: 'hidden',
// // //   },
// // //   avatarImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 75,
// // //   },
// // //   callerName: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     color: 'white',
// // //     marginTop: 20,
// // //     marginBottom: 8,
// // //   },
// // //   callTypeText: {
// // //     fontSize: 16,
// // //     color: 'rgba(255,255,255,0.9)',
// // //   },
// // //   avatarContainer: { alignItems: 'center', marginVertical: 30, flex: 1 },
// // //   avatar: {
// // //     width: 150,
// // //     height: 150,
// // //     borderRadius: 75,
// // //     backgroundColor: '#4a5568',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   avatarImage: { width: '100%', height: '100%', borderRadius: 75 },
  
// // //   remoteVideo: { flex: 1, width: '100%', backgroundColor: '#000', zIndex: 1 },
// // //   localVideo: {
// // //     position: 'absolute',
// // //     bottom: 120,
// // //     right: 20,
// // //     width: 120,
// // //     height: 160,
// // //     borderRadius: 10,
// // //     borderWidth: 2,
// // //     borderColor: 'white',
// // //     backgroundColor: '#000',
// // //     zIndex: 50,
// // //   },
// // //   voiceCallInfo: { alignItems: 'center', marginTop: 1, padding: 20, borderRadius: 15 },
// // //   callerName: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: 'white',
// // //     marginBottom: 8,
// // //     textShadowColor: 'rgba(0,0,0,0.75)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 3,
// // //   },
// // //   callTypeText: {
// // //     fontSize: 16,
// // //     color: 'rgba(255,255,255,0.9)',
// // //     textShadowColor: 'rgba(0,0,0,0.75)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // //   callControls: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     marginBottom: 40,
// // //     zIndex: 100,
// // //   },
// // //   controlButton: { alignItems: 'center' },
// // //   controlIcon: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   controlText: { color: 'white', fontSize: 14 },
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.8)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalContainer: { width: '90%', borderRadius: 20, overflow: 'hidden' },
// // //   modalContent: { padding: 30, alignItems: 'center' },
// // //   incomingCallText: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
// // //   callerInfo: { alignItems: 'center', marginBottom: 40 },
// // //   modalAvatar: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: '#4a5568',
// // //     marginBottom: 15,
// // //     borderWidth: 3,
// // //     borderColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   modalAvatarImage: { width: '100%', height: '100%', borderRadius: 50 },
// // //   modalCallerName: { fontSize: 22, color: 'white', fontWeight: 'bold', marginBottom: 5 },
// // //   modalCallType: { fontSize: 16, color: '#a0aec0' },
// // //   modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
// // //   rejectButton: { alignItems: 'center' },
// // //   acceptButton: { alignItems: 'center' },
// // //   rejectButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#e53e3e',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   acceptButtonInner: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: '#38a169',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   buttonText: { color: 'white', fontSize: 14, fontWeight: '500' },
// // // });


// // import React, { useEffect, useRef, useState, useCallback } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   TouchableOpacity,
// //   Modal,
// //   StatusBar,
// //   ImageBackground,
// //   NativeModules,
// //   DeviceEventEmitter,
// //   PanResponder,
// //   Dimensions,
// //   ActivityIndicator,
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
 
// // } from "react-native-webrtc";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import { Image } from "react-native-animatable";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";
// // import InCallManager from "react-native-incall-manager";
// // import CallKeepService from '../src/services/CallKeepService';
// // import { useBackHandler } from '../src/hooks/useBackHandler';

// // const SIGNALING_SERVER = "wss://api.showapp.ng";

// // // How long we'll wait for the actual remote video track to arrive after a
// // // call is accepted / answered before nudging the user that something's wrong.
// // const REMOTE_TRACK_TIMEOUT_MS = 20000;

// // export default function VideoCallScreen({ navigation, route }) {
// //     useBackHandler(navigation, 'BroadcastHome');
// //   const {
// //     profile_image,
// //     name,
// //     incomingOffer,
// //     isIncomingCall,
// //     targetUserId,
// //     isInitiator,
// //     autoAnswerOnOffer,
// //   } = route.params || {};

// //   // ─── Refs ────────────────────────────────────────────────────
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;
// //   const isCallerRef = useRef(false);
// //   const currentCallIdRef = useRef(null);
// //   const callTimerRef = useRef(null);
// //   const hasInitialOfferRef = useRef(false);
// //   const isCleaningUpRef = useRef(false);
// //   const isCallActiveRef = useRef(true);
// //   const autoAnswerOnOfferRef = useRef(autoAnswerOnOffer || false);

// //   // Cached ICE-server fetch — kicked off as early as possible (on mount) so
// //   // that by the time the user actually taps Accept, ensurePeerConnection()
// //   // doesn't have to wait on a network round trip.
// //   const iceServersPromiseRef = useRef(null);

// //   // Guards against double-tapping Accept while the async handshake is
// //   // still setting up, and lets us show a "connecting" state instantly.
// //   const acceptInProgressRef = useRef(false);

// //   // Timeout that watches for the remote track never arriving after accept/answer.
// //   const connectTimeoutRef = useRef(null);

// //   // Refs for CallKeep stable callbacks
// //   const endCallRef = useRef(null);
// //   const acceptCallWithCallKeepRef = useRef(null);
// //   const startCallWithCallKeepRef = useRef(null);

// //   // ─── State ───────────────────────────────────────────────────
// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [webrtcReady, setWebrtcReady] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// //   const [incomingSDP, setIncomingSDP] = useState(null);
// //   const [callDuration, setCallDuration] = useState(0);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
// //   const [currentCallId, setCurrentCallId] = useState(null);
// //   const [isRinging, setIsRinging] = useState(false);
// //   const [callAccepted, setCallAccepted] = useState(false);
// //   const [callStarted, setCallStarted] = useState(false);

// //   const updateCallId = (id) => {
// //     currentCallIdRef.current = id;
// //     setCurrentCallId(id);
// //   };

// //   /////// this is only for ui draging the video stream 
// //   const pipPosition = useRef({ x: Dimensions.get('window').width - 116, y: Platform.OS === 'ios' ? 100 : 70 });
// //   const [pipVisible, setPipVisible] = useState(true);
// //   const [pipPositionState, setPipPositionState] = useState({ 
// //     x: Dimensions.get('window').width - 116, 
// //     y: Platform.OS === 'ios' ? 100 : 70 
// //   });

// //   // Handle PiP drag
// //   const handlePipDrag = (event, gestureState) => {
// //     const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// //     const pipWidth = 100;
// //     const pipHeight = 140;
    
// //     let newX = pipPosition.current.x + gestureState.dx;
// //     let newY = pipPosition.current.y + gestureState.dy;
    
// //     newX = Math.max(0, Math.min(newX, screenWidth - pipWidth));
// //     newY = Math.max(50, Math.min(newY, screenHeight - pipHeight - 150));
    
// //     setPipPositionState({ x: newX, y: newY });
// //   };

// //   const handlePipDragEnd = () => {
// //     pipPosition.current = { x: pipPositionState.x, y: pipPositionState.y };
// //   };

// //   // Create PanResponder for PiP
// //   const pipPanResponder = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => true,
// //       onMoveShouldSetPanResponder: (_, gestureState) => {
// //         return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
// //       },
// //       onPanResponderGrant: () => {},
// //       onPanResponderMove: (event, gestureState) => {
// //         handlePipDrag(event, gestureState);
// //       },
// //       onPanResponderRelease: () => {
// //         handlePipDragEnd();
// //       },
// //     })
// //   ).current;

// //   const togglePipVisibility = () => {
// //     setPipVisible(!pipVisible);
// //   };

// //   //// draging end==========================

// //   // ─── Audio helpers ───────────────────────────────────────────
// //   const startAudioSession = () => {
// //     InCallManager.start({ media: 'video' });
// //     InCallManager.setSpeakerphoneOn(true); // video calls default to speaker
// //   };

// //   const startRinging = () => {
// //     setIsRinging(true);
// //     InCallManager.startRingtone();
// //   };

// //   const stopRinging = () => {
// //     setIsRinging(false);
// //     InCallManager.stopRingtone();
// //   };

// //   // ─── CallKeep callbacks (useCallback for stability) ──────────
// //   const acceptCallWithCallKeep = useCallback(async () => {
// //     console.log('[CallKeep] Accepting video call...');
// //     if (acceptInProgressRef.current) return;
// //     stopRinging();
// //     isCallerRef.current = false;
// //     const offer = incomingSDP || incomingOffer;
// //     if (!offer?.sdp) {
// //       console.error('[CallKeep] No valid offer to accept');
// //       return;
// //     }
// //     await handleIncomingCall(offer);
// //     if (currentCallIdRef.current) {
// //       await CallKeepService.setCallConnected(currentCallIdRef.current);
// //     }
// //   }, [incomingSDP, incomingOffer]);

// //   const startCallWithCallKeep = useCallback(async (phoneNumber, callUUID) => {
// //     console.log('[CallKeep] Starting video call with:', phoneNumber, callUUID);
// //     isCallerRef.current = true;
// //     startAudioSession();
// //     await createAndSendInitialOffer();
// //     if (callUUID) {
// //       await CallKeepService.setCallConnected(callUUID);
// //     }
// //   }, []);

// //   // Keep refs updated
// //   useEffect(() => { endCallRef.current = endCall; });
// //   useEffect(() => { acceptCallWithCallKeepRef.current = acceptCallWithCallKeep; }, [acceptCallWithCallKeep]);
// //   useEffect(() => { startCallWithCallKeepRef.current = startCallWithCallKeep; }, [startCallWithCallKeep]);

// //   // ─── CallKeep listeners ──────────────────────────────────────
// //   useEffect(() => {
// //     let mounted = true;

// //     const setupCallKeepListeners = async () => {
// //       const initialized = await CallKeepService.initialize();
// //       if (!mounted || !initialized) return;

// //       console.log('[CallKeep] Registering video call listeners...');

// //       const onAnswerCall = (payload) => {
// //         console.log('[CallKeep] answerCall:', payload);
// //         if (!mounted) return;
// //         if (typeof acceptCallWithCallKeepRef.current === 'function') {
// //           acceptCallWithCallKeepRef.current();
// //         }
// //       };

// //       const onEndCall = (payload) => {
// //         console.log('[CallKeep] endCall:', payload);
// //         if (!mounted) return;
// //         if (typeof endCallRef.current === 'function') {
// //           endCallRef.current(true);
// //         }
// //       };

// //       const onStartCall = (payload) => {
// //         console.log('[CallKeep] startCall:', payload);
// //         if (!mounted) return;
// //         const { handle, callUUID } = payload || {};
// //         if (!handle) return;
// //         if (typeof startCallWithCallKeepRef.current === 'function') {
// //           startCallWithCallKeepRef.current(handle, callUUID);
// //         }
// //       };

// //       const onDidActivateAudio = () => {
// //         if (!mounted) return;
// //         InCallManager.start({ media: 'video' });
// //         InCallManager.setSpeakerphoneOn(true);
// //       };

// //       const onDidDeactivateAudio = () => {
// //         if (!mounted) return;
// //         InCallManager.stop();
// //       };

// //       // Validate all handlers before registering
// //       const handlers = { onAnswerCall, onEndCall, onStartCall, onDidActivateAudio, onDidDeactivateAudio };
// //       const allValid = Object.entries(handlers).every(([key, fn]) => {
// //         if (typeof fn !== 'function') {
// //           console.error(`[CallKeep] Handler ${key} is not a function`);
// //           return false;
// //         }
// //         return true;
// //       });

// //       if (!allValid) return;

// //       CallKeepService.addEventListener('answerCall', onAnswerCall);
// //       CallKeepService.addEventListener('endCall', onEndCall);
// //       CallKeepService.addEventListener('startCall', onStartCall);
// //       CallKeepService.addEventListener('didActivateAudioSession', onDidActivateAudio);
// //       CallKeepService.addEventListener('didDeactivateAudioSession', onDidDeactivateAudio);

// //       console.log('[CallKeep] Video call listeners registered ✅');
// //     };

// //     const timer = setTimeout(() => setupCallKeepListeners(), 100);

// //     return () => {
// //       mounted = false;
// //       clearTimeout(timer);
// //       CallKeepService.removeAllListeners();
// //     };
// //   }, []);

// //   // ─── Notification / DeviceEventEmitter listener ──────────────
// //   useEffect(() => {
// //     const subscription = DeviceEventEmitter.addListener(
// //       'incomingCallFromNotification',
// //       (callData) => {
// //         console.log('[VideoCall] Incoming call from notification:', callData);
// //         // Stop foreground service
// //         try { NativeModules.CallModule?.stopCallService(); } catch {}

// //         if (callData.autoAccept) {
// //           // Already on this screen — set autoAnswer flag
// //           autoAnswerOnOfferRef.current = true;
// //         }
// //       }
// //     );

// //     return () => subscription.remove();
// //   }, []);

// //   // ─── Audio / screen lifecycle ────────────────────────────────
// //   useEffect(() => {
// //     global.__onCallScreen = true;
// //     return () => {
// //       global.__onCallScreen = false;
// //       InCallManager.stopRingtone();
// //       InCallManager.stop({ busytone: '_BUNDLE_' });
// //     };
// //   }, []);

// //   useEffect(() => {
// //     InCallManager.stopRingtone();
// //     InCallManager.start({ media: 'video' });
// //     InCallManager.setSpeakerphoneOn(true);
// //     return () => {
// //       InCallManager.stop();
// //       InCallManager.stopRingtone();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     InCallManager.setKeepScreenOn(true);
// //     return () => {
// //       InCallManager.stop();
// //       InCallManager.setKeepScreenOn(false);
// //       stopRinging();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (showIncomingModal) {
// //       startRinging();
// //     } else {
// //       stopRinging();
// //     }
// //     return () => stopRinging();
// //   }, [showIncomingModal]);

// //   // Prefetch ICE servers the moment the screen mounts — for an incoming call
// //   // this happens while the phone is still ringing, so by the time the user
// //   // taps Accept the servers are (almost always) already cached and
// //   // ensurePeerConnection() resolves instantly instead of waiting on a
// //   // network round trip to Xirsys.
// //   useEffect(() => {
// //     prefetchIceServers();
// //     return () => clearConnectTimeout();
// //   }, []);

// //   // ─── Permissions ─────────────────────────────────────────────
// //   const requestPermissions = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const grants = await PermissionsAndroid.requestMultiple([
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //         ]);
// //         return (
// //           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
// //             PermissionsAndroid.RESULTS.GRANTED &&
// //           grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
// //             PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // ─── ICE servers ─────────────────────────────────────────────
// //   const getIceServers = async () => {
// //     try {
// //       console.log("[Xirsys] Fetching ICE servers...");
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
// //       if (data?.v?.iceServers) {
// //         const server = data.v.iceServers;
// //         const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
// //         iceServers = [{ urls, username: server.username, credential: server.credential }];
// //       }
// //       if (!iceServers.length) throw new Error("No ICE servers");
// //       iceServers.push({ urls: "stun:stun.l.google.com:19302" });
// //       rtcConfig.iceServers = iceServers;
// //       console.log("✅ [ICE CONFIG READY]");
// //     } catch (err) {
// //       console.error("❌ [Xirsys Failed]:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //     rtcConfig.iceTransportPolicy = "all";
// //   };

// //   // Wraps getIceServers() in a cached, shared promise so it only ever runs
// //   // once per screen instance, no matter how many places call it.
// //   const prefetchIceServers = () => {
// //     if (!iceServersPromiseRef.current) {
// //       iceServersPromiseRef.current = getIceServers();
// //     }
// //     return iceServersPromiseRef.current;
// //   };

// //   // ─── Connect timeout helpers ───────────────────────────────────
// //   const clearConnectTimeout = () => {
// //     if (connectTimeoutRef.current) {
// //       clearTimeout(connectTimeoutRef.current);
// //       connectTimeoutRef.current = null;
// //     }
// //   };

// //   const startConnectTimeout = () => {
// //     clearConnectTimeout();
// //     connectTimeoutRef.current = setTimeout(() => {
// //       if (!isCallActiveRef.current) return;
// //       if (remoteStream.current) return; // already connected, nothing to do

// //       Alert.alert(
// //         "Connection Problem",
// //         "We're having trouble connecting this call. Check your internet connection.",
// //         [
// //           { text: "Keep Waiting", style: "cancel", onPress: () => startConnectTimeout() },
// //           { text: "End Call", style: "destructive", onPress: () => endCall(true) },
// //         ]
// //       );
// //     }, REMOTE_TRACK_TIMEOUT_MS);
// //   };

// //   // ─── Peer connection ─────────────────────────────────────────
// //   const ensurePeerConnection = async () => {
// //   if (pc.current) return;
// //   await prefetchIceServers();

// //   pc.current = new RTCPeerConnection(rtcConfig);
// //   console.log("[WebRTC] RTCPeerConnection created");

// //   // --- Negotiation ---
// //   pc.current.onnegotiationneeded = () => {
// //     console.log("[WebRTC] onnegotiationneeded, signalingState:", pc.current?.signalingState);
// //   };

// //   // --- ICE Candidates ---
// //   pc.current.onicecandidate = (evt) => {
// //     if (evt.candidate) {
// //       const cand = evt.candidate.candidate;
// //       if (cand.includes("typ relay")) console.log("🟢 [TURN WORKING]", cand);
// //       else if (cand.includes("typ srflx")) console.log("🟡 [STUN WORKING]", cand);
// //       sendMessage({ type: "candidate", candidate: evt.candidate });
// //     } else {
// //       console.log("[ICE] Gathering finished");
// //     }
// //   };

// //   // --- TRACK RECEIVED (THIS IS THE ONE YOU NEED) ---
// //   pc.current.ontrack = (evt) => {
// //     console.log("========= TRACK RECEIVED =========");
// //     console.log("Track Kind:", evt.track.kind);
// //     console.log("Track enabled:", evt.track.enabled);
// //     console.log("Track readyState:", evt.track.readyState);
    
// //     if (evt.streams && evt.streams[0]) {
// //       remoteStream.current = evt.streams[0];
      
// //       const tracks = evt.streams[0].getTracks();
// //       console.log(`Received stream with ${tracks.length} tracks:`, 
// //         tracks.map(t => ({ kind: t.kind, enabled: t.enabled }))
// //       );
      
// //       try { 
// //         const url = remoteStream.current.toURL();
// //         setRemoteURL(url); 
// //         console.log("remote_stream url:", url);
// //       } catch (e) {
// //         console.error("Error getting remote URL:", e);
// //       }
      
// //       // The remote track has actually arrived — this is the ONLY place
// //       // that should flip webrtcReady, so the UI truly reflects "video is
// //       // showing" rather than "we sent an answer and hoped for the best".
// //       setWebrtcReady(true);
// //       setCallAccepted(true);
// //       clearConnectTimeout();
// //       InCallManager.start({ media: 'video' });
// //       InCallManager.setSpeakerphoneOn(true);
// //     } else {
// //       console.warn("[WebRTC] Track received but no stream!");
// //     }
// //   };

// //   // --- Connection State ---
// //   pc.current.onconnectionstatechange = async () => {
// //     if (!pc.current) return;
// //     const state = pc.current.connectionState;
// //     console.log("[WebRTC] connectionState =>", state);

// //     if (state === "connected") {
// //       console.log("VIDEO CALL CONNECTED");
// //       try {
// //         const stats = await pc.current.getStats();
// //         stats.forEach((report) => {
// //           if (report.type === "candidate-pair" && report.state === "succeeded") {
// //             const local = stats.get(report.localCandidateId);
// //             const remote = stats.get(report.remoteCandidateId);
// //             if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
// //               console.log("🟢 USING TURN (Xirsys)");
// //             } else if (local?.candidateType === "srflx") {
// //               console.log("🟡 USING STUN");
// //             } else {
// //               console.log("⚪ USING LOCAL");
// //             }
// //           }
// //         });
// //       } catch (err) {
// //         console.warn("[WebRTC] getStats failed:", err);
// //       }
// //     }

// //     if (state === "failed") {
// //       console.warn("VIDEO CONNECTION FAILED");
// //       saveCallToHistory({
// //         contact: { name, profileImage: profile_image, userId: targetUserId },
// //         direction: isInitiator ? 'outgoing' : 'incoming',
// //         isVideoCall: true,
// //         status: 'failed',
// //         duration: callDuration,
// //       });
// //     }
// //   };

// //   // --- ICE State ---
// //   pc.current.oniceconnectionstatechange = () => {
// //     if (!pc.current) return;
// //     console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
// //   };
// // };

// //   // Just gets camera/mic permission + the local MediaStream. Doesn't touch
// //   // the peer connection at all, so it can run in parallel with
// //   // ensurePeerConnection() instead of waiting behind it.
// //   const getLocalStream = async () => {
// //     if (localStream.current) {
// //       const videoTrack = localStream.current.getVideoTracks()[0];
// //       if (videoTrack && !videoTrack.enabled) {
// //         videoTrack.enabled = true;
// //         console.log("[Local] Re-enabled video track");
// //       }
// //       return true;
// //     }

// //     const hasPermission = await requestPermissions();
// //     if (!hasPermission) {
// //       Alert.alert("Permission denied", "Cannot access camera or microphone.");
// //       return false;
// //     }
// //     try {
// //       const s = await mediaDevices.getUserMedia({
// //         audio: true,
// //         video: {
// //           facingMode: isCameraFront ? "user" : "environment",
// //           frameRate: 30,
// //         },
// //       });

// //       const videoTrack = s.getVideoTracks()[0];
// //       if (videoTrack) {
// //         videoTrack.enabled = true;
// //         console.log("[Local] Video track enabled:", videoTrack.enabled);
// //       }

// //       localStream.current = s;
// //       try { setLocalURL(s.toURL()); } catch {}
// //       return true;
// //     } catch (e) {
// //       Alert.alert("Error", "Failed to get camera/mic: " + e.message);
// //       return false;
// //     }
// //   };

// //   // Attaches whatever is in localStream.current onto pc.current. Safe to
// //   // call multiple times — skips tracks that are already attached.
// //   const attachLocalTracksToPeer = () => {
// //     if (!pc.current || !localStream.current) return;
// //     const existingTracks = pc.current.getSenders().map((s) => s.track);
// //     localStream.current.getTracks().forEach((track) => {
// //       if (!existingTracks.includes(track)) {
// //         pc.current.addTrack(track, localStream.current);
// //         console.log(`[Local] Attached ${track.kind} track to peer connection`);
// //       }
// //     });
// //   };

// //   // Combined convenience helper kept for call sites that don't need the
// //   // parallelized version.
// //   const ensureLocalStreamAndAttach = async () => {
// //     const ok = await getLocalStream();
// //     if (ok) attachLocalTracksToPeer();
// //     return ok;
// //   };

// //   // The optimized prep step: peer connection creation (ICE servers, usually
// //   // already cached) and camera/mic acquisition happen at the same time
// //   // instead of one after another, then tracks are attached once both are
// //   // ready. This is what shaves the noticeable delay off of "tap Accept" →
// //   // "video appears".
// //   const prepareConnectionAndMedia = async () => {
// //     const [, mediaOk] = await Promise.all([
// //       ensurePeerConnection(),
// //       getLocalStream(),
// //     ]);
// //     if (mediaOk && pc.current) {
// //       attachLocalTracksToPeer();
// //     }
// //     return !!(mediaOk && pc.current);
// //   };

// //   const drainQueuedCandidates = async () => {
// //     if (!pc.current) return;
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err?.message);
// //       }
// //     }
// //   };

// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing video peer connection");
// //     isCleaningUpRef.current = true;
// //     isCallActiveRef.current = false;
// //     clearConnectTimeout();
// //     setCallAccepted(false);
// //     setCallStarted(false);

// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.onconnectionstatechange = null;
// //         pc.current.oniceconnectionstatechange = null;
// //         pc.current.close();
// //       }
// //     } catch (e) {}
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {}
// //     localStream.current = null;
// //     try {
// //       if (remoteStream.current) {
// //         remoteStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch (e) {}
  
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];
// //     hasInitialOfferRef.current = false;
// //     acceptInProgressRef.current = false;

// //     try { InCallManager.stop(); } catch {}

// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setWebrtcReady(false);
// //     setIsCameraFront(true);
// //     setIsMuted(false);
// //     setIsSpeakerOn(false);
// //     isCleaningUpRef.current = false;
// //   };

// //   // ─── Signaling ───────────────────────────────────────────────
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       console.log("[WS] Sending:", msg.type);
// //       ws.current.send(JSON.stringify(msg));
// //     } else {
// //       console.warn("[WS] Cannot send, state:", ws.current?.readyState);
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     let roomId;
// //     if (isInitiator && targetUserId) {
// //       roomId = `user-${targetUserId}`;
// //     } else if (autoAnswerOnOffer && targetUserId) {
// //       // Accepted from notification — connect to OUR room to receive offer
// //       roomId = `user-${currentUserId}`;
// //       console.log('[AutoAnswer] Connecting to our room:', roomId);
// //     } else if (currentUserId) {
// //       roomId = `user-${currentUserId}`;
// //     } else {
// //       roomId = "unknown";
// //     }

// //     console.log("[WebSocket] Connecting to room:", roomId);

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
// //       console.log("[WebSocket] Connected to", roomId);
// //       setWsConnected(true);

// //       // Prep peer connection + camera/mic in parallel ahead of time so
// //       // whichever signaling message arrives next (offer/answer) can be
// //       // handled with zero setup latency.
// //       await prepareConnectionAndMedia();

// //       if (isInitiator && targetUserId) {
// //         isCallerRef.current = true;
// //         setCallStarted(true);
// //         startAudioSession();
// //         await createAndSendInitialOffer();
// //       }

// //       // Normal incoming (not from notification)
// //       if (!isInitiator && isIncomingCall && incomingOffer && !autoAnswerOnOffer) {
// //         await handleIncomingCall(incomingOffer);
// //       }
// //       // autoAnswerOnOffer: wait for offer via WebSocket
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try { data = JSON.parse(evt.data); } catch { return; }

// //       console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation);

// //       // Drop messages after call ended
// //       if (!isCallActiveRef.current && data?.type !== "call-ended") {
// //         console.warn("[WS] Ignoring after call ended:", data?.type);
// //         return;
// //       }

// //       // ── Echo filtering ──────────────────────────────────────
// //       // Ignore our own offer echoed back
// //       if (data.type === 'offer' && !data.isRenegotiation && isCallerRef.current) {
// //         console.warn('[WS] Ignoring own offer echo — we are the caller');
// //         return;
// //       }
// //       // Ignore answer if we are the callee
// //       if (data.type === 'answer' && !isCallerRef.current && !data.isRenegotiation) {
// //         console.warn('[WS] Ignoring answer — we are the callee');
// //         return;
// //       }
// //       // ────────────────────────────────────────────────────────

// //       switch (data.type) {

// //         case "offer": {
// //           if (data.isRenegotiation) {
// //             try {
// //               await ensurePeerConnection();
// //               await ensureLocalStreamAndAttach();
// //             } catch (err) {
// //               console.error("[WebRTC] Renegotiation prep failed:", err);
// //               return;
// //             }
// //             await handleRenegotiationOffer(data.offer);
// //             break;
// //           }

// //           // Regular initial offer
// //           if (isCallerRef.current) break;

// //           const offerData = data.offer;
// //           if (!offerData?.sdp) {
// //             console.error("[WS] Offer missing SDP");
// //             break;
// //           }

// //           console.log("[WS] Valid video offer, SDP length:", offerData.sdp.length);

// //           if (autoAnswerOnOfferRef.current) {
// //             // User already accepted from notification — answer immediately
// //             console.log('[AutoAnswer] Auto-answering video offer');
// //             autoAnswerOnOfferRef.current = false;
// //             isCallerRef.current = false;
// //             startAudioSession();
// //             await handleIncomingCall(offerData);
// //             if (currentCallIdRef.current) {
// //               await CallKeepService.setCallConnected(currentCallIdRef.current);
// //             }
// //           } else {
// //             // Normal flow — show modal + CallKeep UI
// //             const incomingCallId = `call_${Date.now()}`;
// //             updateCallId(incomingCallId);
// //             setIncomingSDP(offerData);

// //             await CallKeepService.displayIncomingCall({
// //               callId: incomingCallId,
// //               callerName: offerData.callerInfo?.name || name || 'Unknown',
// //               callerId: offerData.callerId || targetUserId || '',
// //               isVideo: true,
// //               roomId: offerData.roomId || '',
// //             });

// //             setShowIncomingModal(true);
// //           }
// //           break;
// //         }

// //         case "answer": {
// //           if (!isCallerRef.current || !pc.current) break;
// //           setCallAccepted(true);
// //           if (pc.current.signalingState === "have-local-offer") {
// //             try {
// //               await pc.current.setRemoteDescription(
// //                 new RTCSessionDescription(data.answer)
// //               );
// //               await drainQueuedCandidates();
// //               // Caller now waits for the actual media track — guard against
// //               // the far side never sending it (bad network, dead peer, etc).
// //               startConnectTimeout();
// //             } catch (e) {
// //               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message);
// //             }
// //           }
// //           break;
// //         }

// //         case "candidate": {
// //           if (!pc.current) break;
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
// //             } catch (e) {
// //               console.warn("[WebRTC] addIceCandidate error:", e?.message);
// //             }
// //           }
// //           break;
// //         }

// //         case "call-ended": {
// //           Alert.alert("Call Ended", "Your call partner has disconnected");
// //           endCall(false);
// //           break;
// //         }

// //         case "call-rejected": {
// //           Alert.alert("Call Rejected", "The recipient declined your call");
// //           await saveCallToHistory({
// //             contact: { name, profileImage: profile_image, userId: targetUserId },
// //             direction: 'outgoing',
// //             isVideoCall: true,
// //             status: 'rejected',
// //             duration: 0,
// //           });
// //           endCall(false);
// //           break;
// //         }

// //         case "call-missed": {
// //           if (!isInitiator) {
// //             await saveCallToHistory({
// //               contact: { name, profileImage: profile_image, userId: targetUserId },
// //               direction: 'incoming',
// //               isVideoCall: true,
// //               status: 'missed',
// //               duration: 0,
// //             });
// //           }
// //           break;
// //         }

// //         default:
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       setWsConnected(false);
// //       if (!isCleaningUpRef.current) cleanupPeerConnection();
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message);
// //     };
// //   };

// //   // ─── Renegotiation ───────────────────────────────────────────
// //   const handleRenegotiationOffer = async (offer) => {
// //     try {
// //       if (!pc.current) {
// //         await ensurePeerConnection();
// //         await ensureLocalStreamAndAttach();
// //       }
// //       if (!pc.current || pc.current.signalingState === "closed") return;

// //       console.log("[WebRTC] Renegotiation, signalingState:", pc.current.signalingState);
// //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //       await drainQueuedCandidates();

// //       const answer = await pc.current.createAnswer();
// //       await pc.current.setLocalDescription(answer);

// //       sendMessage({ type: "answer", answer, isVideoCall: true, isRenegotiation: true });
// //       console.log("[WebRTC] Renegotiation answer sent");
// //     } catch (error) {
// //       console.error("[WebRTC] Renegotiation failed:", error);
// //     }
// //   };

// //   // ─── Call history ─────────────────────────────────────────────
// //   const saveCallToHistory = async (callDetails) => {
// //     try {
// //       const existingHistory = await AsyncStorage.getItem('callHistory');
// //       const history = existingHistory ? JSON.parse(existingHistory) : [];
// //       const newCall = {
// //         id: Date.now().toString(),
// //         timestamp: Date.now(),
// //         contact: {
// //           name: callDetails.contact.name,
// //           profileImage: callDetails.contact.profileImage,
// //           userId: callDetails.contact.userId,
// //         },
// //         direction: callDetails.direction,
// //         isVideoCall: true,
// //         status: callDetails.status,
// //         duration: callDetails.duration || 0,
// //       };
// //       history.unshift(newCall);
// //       await AsyncStorage.setItem('callHistory', JSON.stringify(history.slice(0, 100)));
// //       console.log('[CallHistory] Saved:', callDetails.status);
// //     } catch (error) {
// //       console.error('[CallHistory] Error:', error);
// //     }
// //   };

// //   // ─── Offer / answer ───────────────────────────────────────────
// //   const createAndSendInitialOffer = async () => {
// //     if (hasInitialOfferRef.current) return;

// //     console.log("[VideoCall] Creating initial offer...");
// //     const ok = await prepareConnectionAndMedia();
// //     if (!ok || !pc.current) return;

// //     try {
// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //       const currentUserId = userData?.id;

// //       if (!currentUserId) {
// //         console.error("[VideoCall] No current user ID");
// //         return;
// //       }

// //       const callerInfo = {
// //         profileImage: userData.profile_picture || userData.profile_image || "",
// //         name: userData.name || "Caller",
// //       };

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       console.log("[VideoCall] Offer SDP length:", offer.sdp?.length);

// //       sendMessage({
// //         type: "new_call",
// //         receiver_id: targetUserId,
// //         sender_id: currentUserId,
// //         caller_name: callerInfo.name,
// //         call_type: "video",
// //         room_id: `call_${currentUserId}_${targetUserId}`,
// //         offer: {
// //           type: offer.type,
// //           sdp: offer.sdp,
// //           targetUserId,
// //           callerId: currentUserId,
// //           callerInfo,
// //           isVideoCall: true,
// //         },
// //       });

// //       hasInitialOfferRef.current = true;
// //       console.log("[VideoCall] Initial offer sent ✅");
// //     } catch (e) {
// //       console.error("[VideoCall] createOffer failed:", e?.message);
// //     }
// //   };

// // const handleIncomingCall = async (offer) => {
// //   if (acceptInProgressRef.current) return;
// //   acceptInProgressRef.current = true;

// //   try {
// //     console.log("[Incoming] Starting...");

// //     if (!currentCallIdRef.current) {
// //       const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
// //       updateCallId(newCallId);
// //     }

// //     if (!offer?.sdp) {
// //       console.error("[VideoCall] Missing SDP in offer");
// //       Alert.alert("Error", "Invalid video call offer.");
// //       acceptInProgressRef.current = false;
// //       rejectCall();
// //       return;
// //     }

// //     // ✅ STEP 0: Flip the UI over to the "connecting" state immediately —
// //     // don't leave the Accept/Decline modal sitting on screen while the
// //     // WebRTC handshake runs in the background. The user sees a spinner
// //     // and "Please wait, connecting..." right away.
// //     setShowIncomingModal(false);
// //     setIncomingSDP(null);
// //     setCallAccepted(true);
// //     try { NativeModules.CallModule?.stopCallService(); } catch {}

// //     // ✅ STEP 1 + 2: Peer connection creation and camera/mic acquisition
// //     // happen in parallel instead of one after another.
// //     const ok = await prepareConnectionAndMedia();
// //     if (!ok || !pc.current) {
// //       acceptInProgressRef.current = false;
// //       rejectCall();
// //       return;
// //     }

// //     // ✅ STEP 3: Set remote description
// //     await pc.current.setRemoteDescription(
// //       new RTCSessionDescription({ 
// //         type: offer.type || 'offer', 
// //         sdp: offer.sdp 
// //       })
// //     );
    
// //     await drainQueuedCandidates();

// //     // ✅ STEP 4: Create answer with explicit video/audio options
// //     const answer = await pc.current.createAnswer({
// //       offerToReceiveAudio: true,
// //       offerToReceiveVideo: true,
// //     });
    
// //     await pc.current.setLocalDescription(answer);

// //     // Debug logging
// //     console.log("Local video tracks:", localStream.current.getVideoTracks().length);
// //     console.log("Local audio tracks:", localStream.current.getAudioTracks().length);
// //     console.log("Peer senders:", pc.current.getSenders().map(sender => ({
// //       kind: sender.track?.kind,
// //       enabled: sender.track?.enabled,
// //       readyState: sender.track?.readyState
// //     })));

// //     // ✅ STEP 5: Send answer
// //     sendMessage({
// //       type: "answer",
// //       answer: { type: answer.type, sdp: answer.sdp },
// //       isVideoCall: true,
// //     });

// //     // Note: webrtcReady is intentionally NOT set here — it's only set once
// //     // pc.current.ontrack actually fires with the remote media. Until then
// //     // the connecting screen shows a spinner + "Please wait, connecting...".
// //     startConnectTimeout();

// //     console.log("[VideoCall] Answer sent, waiting for remote track...");
    
// //   } catch (error) {
// //     console.error("[VideoCall] handleIncomingCall error:", error?.message);
// //     Alert.alert("Error", "Failed to accept video call: " + (error?.message || "Unknown"));
// //     rejectCall();
// //   } finally {
// //     acceptInProgressRef.current = false;
// //   }
// // };


// //   // ─── Lifecycle ────────────────────────────────────────────────
// //   useEffect(() => {
// //     connectSignaling();
// //     return () => { endCall(false); };
// //   }, []);

// //   useEffect(() => {
// //     if (webrtcReady && callAccepted) {
// //       const startTime = Date.now();
// //       callTimerRef.current = setInterval(() => {
// //         setCallDuration(Math.floor((Date.now() - startTime) / 1000));
// //       }, 1000);
// //     } else {
// //       if (callTimerRef.current) {
// //         clearInterval(callTimerRef.current);
// //         callTimerRef.current = null;
// //         setCallDuration(0);
// //       }
// //     }
// //     return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
// //   }, [webrtcReady, callAccepted]);

// //   // ─── Call actions ─────────────────────────────────────────────
// //   const acceptCall = async () => {
// //     if (acceptInProgressRef.current) return;
// //     stopRinging();
// //     isCallerRef.current = false;
// //     const offer = incomingSDP;
// //     if (!offer?.sdp) {
// //       Alert.alert("Error", "Invalid video call offer.");
// //       return;
// //     }
// //     startAudioSession();
// //     await handleIncomingCall(offer);
// //   };

// //   const startCall = async () => {
// //     isCallerRef.current = true;
// //     setCallStarted(true);
// //     const newCallId = `call_${Date.now()}_${targetUserId}`;
// //     updateCallId(newCallId);
// //     startAudioSession();
// //     await createAndSendInitialOffer();
// //   };

// //   const endCall = useCallback(async (notify = true) => {
// //   console.log("[VideoCall] Ending call...");
  
// //   // ─── 1. IMMEDIATE STOP ───
// //   // Stop ringing immediately
// //   try { InCallManager.stopRingtone(); } catch (e) {}
  
// //   // Mark call as inactive immediately
// //   isCallActiveRef.current = false;
// //   clearConnectTimeout();

// //   // ─── 2. IMMEDIATE STATE RESET ───
// //   // Reset all UI state immediately
// //   setWebrtcReady(false);
// //   setLocalURL(null);
// //   setRemoteURL(null);
// //   setCallDuration(0);
// //   setCurrentCallId(null);
// //   setShowIncomingModal(false);
// //   setIncomingSDP(null);

// //   // ─── 3. NAVIGATE INSTANTLY ───
// //   // Use setTimeout(0) for immediate navigation in next tick
// //   setTimeout(() => {
// //     try {
// //       if (navigation.canGoBack()) {
// //         navigation.goBack();
// //       } else {
// //         navigation.navigate("PHome");
// //       }
// //     } catch (e) {
// //       navigation.navigate("PHome");
// //     }
// //   }, 0);

// //   // ─── 4. BACKGROUND CLEANUP (non-blocking) ───
// //   const cid = currentCallIdRef.current || currentCallId;
  
// //   // Use setTimeout with 0 to defer all cleanup
// //   setTimeout(() => {
// //     // End CallKeep call
// //     if (cid) {
// //       try { 
// //         CallKeepService.endCall(cid).catch(() => {}); 
// //       } catch (e) {}
// //     }

// //     // Stop foreground service
// //     try { 
// //       NativeModules.CallModule?.stopCallService(); 
// //     } catch (e) {}

// //     // Notify other party
// //     if (notify && ws.current?.readyState === WebSocket.OPEN) {
// //       try { 
// //         ws.current.send(JSON.stringify({ type: "call-ended" })); 
// //       } catch (e) {}
// //     }

// //     // Close WebSocket
// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //         ws.current = null;
// //       }
// //     } catch (e) {}

// //     // Stop audio
// //     try {
// //       InCallManager.stop();
// //     } catch (e) {}

// //     // Cleanup peer connection
// //     try {
// //       cleanupPeerConnection();
// //     } catch (e) {}

// //     console.log("[VideoCall] Cleanup complete");
// //   }, 0);

// //   // ─── 5. SAVE HISTORY (async, no await) ───
// //   const callDetails = {
// //     contact: {
// //       name: name || 'Unknown',
// //       profileImage: profile_image || '',
// //       userId: targetUserId || 'unknown',
// //     },
// //     direction: isInitiator ? 'outgoing' : 'incoming',
// //     isVideoCall: true,
// //     status: webrtcReady ? 'ended' : 'missed',
// //     duration: callDuration || 0,
// //   };

// //   // Fire and forget save
// //   saveCallToHistory(callDetails).catch(() => {});

// // }, [navigation, isInitiator, name, profile_image, targetUserId, webrtcReady, callDuration, currentCallId]);



// //   const rejectCall = async () => {
// //     stopRinging();
// //     sendMessage({ type: "call-rejected" });
// //     await saveCallToHistory({
// //       contact: { name, profileImage: profile_image, userId: targetUserId },
// //       direction: 'incoming',
// //       isVideoCall: true,
// //       status: 'rejected',
// //       duration: 0,
// //     });
// //     setShowIncomingModal(false);
// //     setIncomingSDP(null);
// //     navigation.goBack();
// //   };

// //   const switchCamera = async () => {
// //     if (!localStream.current) return;
// //     const videoTrack = localStream.current.getVideoTracks()[0];
// //     if (videoTrack) {
// //       videoTrack._switchCamera();
// //       setIsCameraFront(!isCameraFront);
// //     }
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

// //   const toggleSpeaker = () => {
// //     const newState = !isSpeakerOn;
// //     InCallManager.setSpeakerphoneOn(newState);
// //     setIsSpeakerOn(newState);
// //   };

// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   // Text shown on the pre-video "connecting" screen.
// //   const getConnectingStatusText = () => {
// //     if (!wsConnected) return "Connecting...";
// //     if (callAccepted) return "Please wait, connecting...";
// //     if (isInitiator) return "Calling...";
// //     if (autoAnswerOnOffer) return "Connecting to video call...";
// //     return "Incoming video call...";
// //   };

// //   // Show a spinner once we're actively negotiating media (either side),
// //   // as opposed to just ringing/dialing.
// //   const showConnectingSpinner = wsConnected && callAccepted && !webrtcReady;

// //   // ─── UI ───────────────────────────────────────────────────────

// //   return (
  
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       {(webrtcReady && callAccepted) ? (
// //         <View style={styles.callScreen}>
// //           {/* Video Call Interface */}
// //           {remoteURL ? (
// //             <View style={styles.videoContainer}>
// //               {/* Remote Video - Full Screen */}
// //               <>
// //                {console.log("RTCView rendering with:", remoteURL)}
// //               <RTCView 
// //                 streamURL={remoteURL} 
// //                 style={styles.remoteVideo} 
// //                 objectFit="cover" 
// //               />
// //               </>

// //               {/* Draggable Local Video PiP========= */}
// //               {localURL && pipVisible && (
// //                 <View
// //                   style={[
// //                     styles.localVideoWrapper,
// //                     {
// //                       left: pipPositionState.x,
// //                       top: pipPositionState.y,
// //                     }
// //                   ]}
// //                   {...pipPanResponder.panHandlers}
// //                 >
// //                   <View style={styles.pipContainer}>
// //                     <RTCView 
// //                       streamURL={localURL} 
// //                       style={styles.localVideoStream} 
// //                       objectFit="cover" 
// //                       mirror={isCameraFront}
// //                     />
                    
// //                     {/* Close button */}
// //                     <TouchableOpacity 
// //                       style={styles.pipCloseButton}
// //                       onPress={togglePipVisibility}
// //                       activeOpacity={0.7}
// //                     >
// //                       <Icon name="close" size={16} color="white" />
// //                     </TouchableOpacity>

// //                     {/* Switch camera button on PiP */}
// //                     <TouchableOpacity 
// //                       style={styles.pipSwitchButton}
// //                       onPress={switchCamera}
// //                       activeOpacity={0.7}
// //                     >
// //                       <Icon name="flip-camera-ios" size={16} color="white" />
// //                     </TouchableOpacity>
// //                   </View>
// //                 </View>
// //               )}

// //               {/* Show PiP again button when hidden */}
// //               {!pipVisible && localURL && (
// //                 <TouchableOpacity 
// //                   style={styles.showPipButton}
// //                   onPress={togglePipVisibility}
// //                   activeOpacity={0.7}
// //                 >
// //                   <Icon name="videocam" size={20} color="white" />
// //                 </TouchableOpacity>
// //               )}

// //               {/* Top Bar with Call Info */}
// //               <View style={styles.topBar}>
// //                 <View style={styles.topBarContent}>
// //                   <Text style={styles.callerNameText} numberOfLines={1}>
// //                     {name || 'Unknown'}
// //                   </Text>
// //                   <Text style={styles.callDurationText}>
// //                     {formatTime(callDuration)}
// //                   </Text>
// //                 </View>
// //               </View>

// //               {/* Bottom Controls  */}
// //               <View style={styles.bottomControls}>
// //                 <View style={styles.controlsRow}>
// //                   {/* Mute Button */}
// //                   <TouchableOpacity 
// //                     style={styles.controlBtn} 
// //                     onPress={toggleMute}
// //                     activeOpacity={0.6}
// //                   >
// //                     <Icon 
// //                       name={isMuted ? "mic-off" : "mic"} 
// //                       size={22} 
// //                       color="white" 
// //                     />
// //                   </TouchableOpacity>

// //                   {/* Speaker Button */}
// //                   <TouchableOpacity 
// //                     style={styles.controlBtn} 
// //                     onPress={toggleSpeaker}
// //                     activeOpacity={0.6}
// //                   >
// //                     <Icon 
// //                       name={isSpeakerOn ? "volume-up" : "volume-off"} 
// //                       size={22} 
// //                       color="white" 
// //                     />
// //                   </TouchableOpacity>

// //                   {/* Video Toggle */}
// //                   <TouchableOpacity 
// //                     style={styles.controlBtn} 
// //                     onPress={togglePipVisibility}
// //                     activeOpacity={0.6}
// //                   >
// //                     <Icon 
// //                       name={pipVisible ? "videocam" : "videocam-off"} 
// //                       size={22} 
// //                       color="white" 
// //                     />
// //                   </TouchableOpacity>

// //                   {/* Switch Camera */}
// //                   <TouchableOpacity 
// //                     style={styles.controlBtn} 
// //                     onPress={switchCamera}
// //                     activeOpacity={0.6}
// //                   >
// //                     <Icon name="flip-camera-ios" size={22} color="white" />
// //                   </TouchableOpacity>

// //                   {/* End Call */}
// //                   <TouchableOpacity 
// //                     style={styles.endCallBtn} 
// //                     onPress={() => endCall(true)}
// //                     activeOpacity={0.6}
// //                   >
// //                     <Icon name="call-end" size={26} color="white" />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             </View>
// //           ) : (
// //             /* Loading/Avatar fallback — only hit if webrtcReady got set
// //                without remoteURL yet being available (edge case safety net) */
// //             <View style={styles.loadingContainer}>
// //               <View style={styles.avatarContainer}>
// //                 <View style={styles.avatar}>
// //                   <Image
// //                     source={{ uri: `${profile_image}` }}
// //                     style={styles.avatarImage}
// //                     resizeMode="cover"
// //                   />
// //                 </View>
// //                 <Text style={styles.callerName}>{name}</Text>
// //                 <ActivityIndicator size="small" color="#fff" style={{ marginTop: 10 }} />
// //                 <Text style={styles.callTypeText}>
// //                   Connecting Video • {formatTime(callDuration)}
// //                 </Text>
// //               </View>
// //             </View>
// //           )}
// //         </View>
// //       ) : (
// //         /* Connecting Screen — shown from mount until the remote video
// //            track has actually arrived. Once accepted/answered, this shows
// //            a spinner + "Please wait, connecting..." instead of the old
// //            ambiguous "Incoming video call..." text lingering on screen. */
// //         <View style={styles.connectingScreen}>
// //           <View style={styles.connectingContent}>
// //             {/* Avatar */}
// //             <View style={styles.connectingAvatarContainer}>
// //               <Image
// //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                 style={styles.connectingAvatar}
// //                 resizeMode="cover"
// //               />
// //             </View>

// //             {/* Name */}
// //             <Text style={styles.connectingName}>{name || 'Unknown'}</Text>

// //             {/* Status */}
// //             <View style={styles.connectingStatusRow}>
// //               {showConnectingSpinner && (
// //                 <ActivityIndicator
// //                   size="small"
// //                   color="rgba(255,255,255,0.8)"
// //                   style={{ marginBottom: 10 }}
// //                 />
// //               )}
// //               <Text style={styles.connectingStatusText}>
// //                 {getConnectingStatusText()}
// //               </Text>
// //             </View>

// //             {/* Cancel / End Button — available any time we're not showing
// //                 the Accept/Decline modal, so either side can bail out of a
// //                 stuck connection. */}
// //             {!showIncomingModal && (
// //               <TouchableOpacity 
// //                 style={styles.connectingEndBtn} 
// //                 onPress={() => endCall(true)}
// //                 activeOpacity={0.6}
// //               >
// //                 <View style={styles.connectingEndIcon}>
// //                   <Icon name="call-end" size={26} color="white" />
// //                 </View>
// //                 <Text style={styles.connectingEndText}>Cancel</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </View>
// //       )}

// //       {/* Incoming call modal */}
// //       {!isInitiator && (
// //         <Modal
// //           visible={showIncomingModal}
// //           transparent
// //           animationType="fade"
// //           onRequestClose={rejectCall}
// //         >
// //           <View style={styles.modalOverlay}>
// //             <View style={styles.modalContainer}>
// //               <View style={styles.modalContent}>
// //                 <Text style={styles.incomingCallText}>Incoming Video Call</Text>
// //                 <View style={styles.callerInfo}>
// //                   <View style={styles.modalAvatar}>
// //                     <Image
// //                       source={{ uri: `${profile_image}` }}
// //                       style={styles.modalAvatarImage}
// //                       resizeMode="cover"
// //                     />
// //                   </View>
// //                   <Text style={styles.modalCallerName}>{name}</Text>
// //                   <Text style={styles.modalCallType}>Video Call</Text>
// //                 </View>
// //                 <View style={styles.modalButtons}>
// //                   <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
// //                     <View style={styles.rejectButtonInner}>
// //                       <Icon name="call-end" size={30} color="white" />
// //                     </View>
// //                     <Text style={styles.buttonText}>Decline</Text>
// //                   </TouchableOpacity>
// //                   <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
// //                     <View style={styles.acceptButtonInner}>
// //                       <Icon name="videocam" size={30} color="white" />
// //                     </View>
// //                     <Text style={styles.buttonText}>Accept</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>
// //         </Modal>
// //       )}
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   callScreen: { flex: 1, justifyContent: 'space-between', padding: 20 },
// //   videoContainer: { flex: 1, width: '100%', position: 'relative' },
// //   callInfoOverlay: {
// //     position: 'absolute',
// //     top: 5,
// //     left: 0,
// //     right: 0,
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //     padding: 10,
// //     zIndex: 100,
// //     borderBottomLeftRadius: 5,
// //     borderBottomRightRadius: 5,
// //   },
// //   callScreen: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //   },
// //   videoContainer: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //   },
  
// //   // Draggable PiP
// //   localVideoWrapper: {
// //     position: 'absolute',
// //     zIndex: 10,
// //     elevation: 8,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //   },
// //   pipContainer: {
// //     width: 100,
// //     height: 140,
// //     borderRadius: 10,
// //     overflow: 'hidden',
// //     backgroundColor: '#2a2a2a',
// //     borderWidth: 1.5,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //   },
// //   localVideoStream: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   pipCloseButton: {
// //     position: 'absolute',
// //     top: 4,
// //     right: 4,
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //   },
// //   pipSwitchButton: {
// //     position: 'absolute',
// //     bottom: 4,
// //     right: 4,
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //   },
// //   showPipButton: {
// //     position: 'absolute',
// //     top: Platform.OS === 'ios' ? 110 : 80,
// //     right: 16,
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 10,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //   },
  
// //   // Top Bar
// //   topBar: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     paddingTop: Platform.OS === 'ios' ? 50 : 30,
// //     paddingBottom: 15,
// //     paddingHorizontal: 16,
// //     zIndex: 5,
// //   },
// //   topBarContent: {
// //     alignItems: 'center',
// //   },
// //   callerNameText: {
// //     fontSize: 17,
// //     fontWeight: '600',
// //     color: 'white',
// //     textAlign: 'center',
// //     marginBottom: 3,
// //   },
// //   callDurationText: {
// //     fontSize: 13,
// //     color: 'rgba(255, 255, 255, 0.8)',
// //     textAlign: 'center',
// //   },
  
// //   // Bottom Controls
// //   bottomControls: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     paddingBottom: Platform.OS === 'ios' ? 35 : 25,
// //     paddingTop: 15,
// //     paddingHorizontal: 16,
// //     zIndex: 5,
// //   },
// //   controlsRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //     paddingHorizontal: 10,
// //   },
// //   controlBtn: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   endCallBtn: {
// //     width: 52,
// //     height: 52,
// //     borderRadius: 26,
// //     backgroundColor: '#E53935',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     transform: [{ rotate: '135deg' }],
// //     elevation: 3,
// //     shadowColor: '#E53935',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 3,
// //   },
  
// //   // Loading Container
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#1a1a2e',
// //   },
  
// //   // Connecting Screen
// //   connectingScreen: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   connectingContent: {
// //     alignItems: 'center',
// //     width: '100%',
// //     paddingHorizontal: 20,
// //   },
// //   connectingAvatarContainer: {
// //     marginBottom: 25,
// //   },
// //   connectingAvatar: {
// //     width: 110,
// //     height: 110,
// //     borderRadius: 55,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.1)',
// //   },
// //   connectingName: {
// //     fontSize: 22,
// //     fontWeight: '600',
// //     color: 'white',
// //     marginBottom: 10,
// //   },
// //   connectingStatusRow: {
// //     alignItems: 'center',
// //     marginBottom: 45,
// //   },
// //   connectingStatusText: {
// //     fontSize: 15,
// //     color: 'rgba(255, 255, 255, 0.6)',
// //   },
// //   connectingEndBtn: {
// //     alignItems: 'center',
// //   },
// //   connectingEndIcon: {
// //     width: 65,
// //     height: 65,
// //     borderRadius: 32.5,
// //     backgroundColor: '#E53935',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //     transform: [{ rotate: '135deg' }],
// //   },
// //   connectingEndText: {
// //     color: 'rgba(255, 255, 255, 0.6)',
// //     fontSize: 13,
// //   },

// //   // Modal styles
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.8)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContainer: {
// //     width: '90%',
// //     borderRadius: 20,
// //     overflow: 'hidden',
// //     backgroundColor: '#1a1a2e',
// //   },
// //   modalContent: {
// //     padding: 30,
// //     alignItems: 'center',
// //   },
// //   incomingCallText: {
// //     fontSize: 22,
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //   },
// //   callerInfo: {
// //     alignItems: 'center',
// //     marginBottom: 40,
// //   },
// //   modalAvatar: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: '#4a5568',
// //     marginBottom: 15,
// //     borderWidth: 3,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     overflow: 'hidden',
// //   },
// //   modalAvatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 50,
// //   },
// //   modalCallerName: {
// //     fontSize: 22,
// //     color: 'white',
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //   },
// //   modalCallType: {
// //     fontSize: 16,
// //     color: '#a0aec0',
// //   },
// //   modalButtons: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     width: '100%',
// //   },
// //   rejectButton: {
// //     alignItems: 'center',
// //   },
// //   acceptButton: {
// //     alignItems: 'center',
// //   },
// //   rejectButtonInner: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     backgroundColor: '#e53e3e',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   acceptButtonInner: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     backgroundColor: '#38a169',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
  
// //   // Keep existing styles
// //   avatarContainer: {
// //     alignItems: 'center',
// //     marginVertical: 30,
// //     flex: 1,
// //     justifyContent: 'center',
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
// //   callerName: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: 'white',
// //     marginTop: 20,
// //     marginBottom: 8,
// //   },
// //   callTypeText: {
// //     fontSize: 16,
// //     color: 'rgba(255,255,255,0.9)',
// //   },
  
// //   remoteVideo: { flex: 1, width: '100%', backgroundColor: '#000', zIndex: 1 },
// //   localVideo: {
// //     position: 'absolute',
// //     bottom: 120,
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: 'white',
// //     backgroundColor: '#000',
// //     zIndex: 50,
// //   },
// //   voiceCallInfo: { alignItems: 'center', marginTop: 1, padding: 20, borderRadius: 15 },
// //   callControls: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     marginBottom: 40,
// //     zIndex: 100,
// //   },
// //   controlButton: { alignItems: 'center' },
// //   controlIcon: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   controlText: { color: 'white', fontSize: 14 },
// // });

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   TouchableOpacity,
//   Modal,
//   StatusBar,
//   ImageBackground,
//   NativeModules,
//   DeviceEventEmitter,
//   PanResponder,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   MediaStream,
//   mediaDevices,
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
// import { useBackHandler } from '../src/hooks/useBackHandler';

// const SIGNALING_SERVER = "wss://api.showapp.ng";

// // How long we'll wait for the actual remote video track to arrive after a
// // call is accepted / answered before nudging the user that something's wrong.
// const REMOTE_TRACK_TIMEOUT_MS = 20000;

// // How long a "connected then dropped" state is tolerated before we try an
// // automatic ICE restart. Recovers flaky-network calls without ending them.
// const ICE_RECOVERY_GRACE_MS = 4000;

// export default function VideoCallScreen({ navigation, route }) {
//     useBackHandler(navigation, 'BroadcastHome');
//   const {
//     profile_image,
//     name,
//     incomingOffer,
//     isIncomingCall,
//     targetUserId,
//     isInitiator,
//     autoAnswerOnOffer,
//   } = route.params || {};

//   // ─── Refs ────────────────────────────────────────────────────
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const rtcConfig = useRef({ iceServers: [] }).current;
//   const isCallerRef = useRef(false);
//   const currentCallIdRef = useRef(null);
//   const callTimerRef = useRef(null);
//   const hasInitialOfferRef = useRef(false);
//   const isCleaningUpRef = useRef(false);
//   const isCallActiveRef = useRef(true);
//   const autoAnswerOnOfferRef = useRef(autoAnswerOnOffer || false);

//   // Cached ICE-server fetch — kicked off as early as possible (on mount) so
//   // that by the time the user actually taps Accept, ensurePeerConnection()
//   // doesn't have to wait on a network round trip.
//   const iceServersPromiseRef = useRef(null);

//   // Guards against double-tapping Accept while the async handshake is
//   // still setting up, and lets us show a "connecting" state instantly.
//   const acceptInProgressRef = useRef(false);

//   // Timeout that watches for the remote track never arriving after accept/answer.
//   const connectTimeoutRef = useRef(null);

//   // Timer that watches for a "failed"/"disconnected" ICE state and, if it
//   // doesn't self-heal within ICE_RECOVERY_GRACE_MS, triggers an ICE restart
//   // instead of just letting the call die. Helps recover on flaky mobile
//   // networks / when a device's radio briefly drops, regardless of vendor.
//   const iceRecoveryTimeoutRef = useRef(null);
//   const iceRestartInFlightRef = useRef(false);

//   // Watches actual inbound video RTP stats (not just connection state).
//   // Connection state can say "connected" while one direction of media is
//   // silently dropped by an asymmetric NAT / carrier firewall — this is
//   // what produces "B sees A but A never sees B". The watchdog catches
//   // that directly by checking whether video frames/packets are actually
//   // arriving, then forces a TURN-relay-only reconnect if not.
//   const videoStatsWatchdogRef = useRef(null);
//   const forcedRelayAttemptedRef = useRef(false);

//   // Refs for CallKeep stable callbacks
//   const endCallRef = useRef(null);
//   const acceptCallWithCallKeepRef = useRef(null);
//   const startCallWithCallKeepRef = useRef(null);

//   // ─── State ───────────────────────────────────────────────────
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);
//   const [showIncomingModal, setShowIncomingModal] = useState(false);
//   const [incomingSDP, setIncomingSDP] = useState(null);
//   const [callDuration, setCallDuration] = useState(0);
//   const [isCameraFront, setIsCameraFront] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
//   const [currentCallId, setCurrentCallId] = useState(null);
//   const [isRinging, setIsRinging] = useState(false);
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callStarted, setCallStarted] = useState(false);

//   const updateCallId = (id) => {
//     currentCallIdRef.current = id;
//     setCurrentCallId(id);
//   };

//   /////// this is only for ui draging the video stream 
//   const pipPosition = useRef({ x: Dimensions.get('window').width - 116, y: Platform.OS === 'ios' ? 100 : 70 });
//   const [pipVisible, setPipVisible] = useState(true);
//   const [pipPositionState, setPipPositionState] = useState({ 
//     x: Dimensions.get('window').width - 116, 
//     y: Platform.OS === 'ios' ? 100 : 70 
//   });

//   // Handle PiP drag
//   const handlePipDrag = (event, gestureState) => {
//     const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
//     const pipWidth = 100;
//     const pipHeight = 140;
    
//     let newX = pipPosition.current.x + gestureState.dx;
//     let newY = pipPosition.current.y + gestureState.dy;
    
//     newX = Math.max(0, Math.min(newX, screenWidth - pipWidth));
//     newY = Math.max(50, Math.min(newY, screenHeight - pipHeight - 150));
    
//     setPipPositionState({ x: newX, y: newY });
//   };

//   const handlePipDragEnd = () => {
//     pipPosition.current = { x: pipPositionState.x, y: pipPositionState.y };
//   };

//   // Create PanResponder for PiP
//   const pipPanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
//       },
//       onPanResponderGrant: () => {},
//       onPanResponderMove: (event, gestureState) => {
//         handlePipDrag(event, gestureState);
//       },
//       onPanResponderRelease: () => {
//         handlePipDragEnd();
//       },
//     })
//   ).current;

//   const togglePipVisibility = () => {
//     setPipVisible(!pipVisible);
//   };

//   //// draging end==========================

//   // ─── Audio helpers ───────────────────────────────────────────
//   const startAudioSession = () => {
//     InCallManager.start({ media: 'video' });
//     InCallManager.setSpeakerphoneOn(true); // video calls default to speaker
//   };

//   const startRinging = () => {
//     setIsRinging(true);
//     InCallManager.startRingtone();
//   };

//   const stopRinging = () => {
//     setIsRinging(false);
//     InCallManager.stopRingtone();
//   };

//   // ─── CallKeep callbacks (useCallback for stability) ──────────
//   const acceptCallWithCallKeep = useCallback(async () => {
//     console.log('[CallKeep] Accepting video call...');
//     if (acceptInProgressRef.current) return;
//     stopRinging();
//     isCallerRef.current = false;
//     const offer = incomingSDP || incomingOffer;
//     if (!offer?.sdp) {
//       console.error('[CallKeep] No valid offer to accept');
//       return;
//     }
//     await handleIncomingCall(offer);
//     if (currentCallIdRef.current) {
//       await CallKeepService.setCallConnected(currentCallIdRef.current);
//     }
//   }, [incomingSDP, incomingOffer]);

//   const startCallWithCallKeep = useCallback(async (phoneNumber, callUUID) => {
//     console.log('[CallKeep] Starting video call with:', phoneNumber, callUUID);
//     isCallerRef.current = true;
//     startAudioSession();
//     await createAndSendInitialOffer();
//     if (callUUID) {
//       await CallKeepService.setCallConnected(callUUID);
//     }
//   }, []);

//   // Keep refs updated
//   useEffect(() => { endCallRef.current = endCall; });
//   useEffect(() => { acceptCallWithCallKeepRef.current = acceptCallWithCallKeep; }, [acceptCallWithCallKeep]);
//   useEffect(() => { startCallWithCallKeepRef.current = startCallWithCallKeep; }, [startCallWithCallKeep]);

//   // ─── CallKeep listeners ──────────────────────────────────────
//   useEffect(() => {
//     let mounted = true;

//     const setupCallKeepListeners = async () => {
//       const initialized = await CallKeepService.initialize();
//       if (!mounted || !initialized) return;

//       console.log('[CallKeep] Registering video call listeners...');

//       const onAnswerCall = (payload) => {
//         console.log('[CallKeep] answerCall:', payload);
//         if (!mounted) return;
//         if (typeof acceptCallWithCallKeepRef.current === 'function') {
//           acceptCallWithCallKeepRef.current();
//         }
//       };

//       const onEndCall = (payload) => {
//         console.log('[CallKeep] endCall:', payload);
//         if (!mounted) return;
//         if (typeof endCallRef.current === 'function') {
//           endCallRef.current(true);
//         }
//       };

//       const onStartCall = (payload) => {
//         console.log('[CallKeep] startCall:', payload);
//         if (!mounted) return;
//         const { handle, callUUID } = payload || {};
//         if (!handle) return;
//         if (typeof startCallWithCallKeepRef.current === 'function') {
//           startCallWithCallKeepRef.current(handle, callUUID);
//         }
//       };

//       const onDidActivateAudio = () => {
//         if (!mounted) return;
//         InCallManager.start({ media: 'video' });
//         InCallManager.setSpeakerphoneOn(true);
//       };

//       const onDidDeactivateAudio = () => {
//         if (!mounted) return;
//         InCallManager.stop();
//       };

//       // Validate all handlers before registering
//       const handlers = { onAnswerCall, onEndCall, onStartCall, onDidActivateAudio, onDidDeactivateAudio };
//       const allValid = Object.entries(handlers).every(([key, fn]) => {
//         if (typeof fn !== 'function') {
//           console.error(`[CallKeep] Handler ${key} is not a function`);
//           return false;
//         }
//         return true;
//       });

//       if (!allValid) return;

//       CallKeepService.addEventListener('answerCall', onAnswerCall);
//       CallKeepService.addEventListener('endCall', onEndCall);
//       CallKeepService.addEventListener('startCall', onStartCall);
//       CallKeepService.addEventListener('didActivateAudioSession', onDidActivateAudio);
//       CallKeepService.addEventListener('didDeactivateAudioSession', onDidDeactivateAudio);

//       console.log('[CallKeep] Video call listeners registered ✅');
//     };

//     const timer = setTimeout(() => setupCallKeepListeners(), 100);

//     return () => {
//       mounted = false;
//       clearTimeout(timer);
//       CallKeepService.removeAllListeners();
//     };
//   }, []);

//   // ─── Notification / DeviceEventEmitter listener ──────────────
//   useEffect(() => {
//     const subscription = DeviceEventEmitter.addListener(
//       'incomingCallFromNotification',
//       (callData) => {
//         console.log('[VideoCall] Incoming call from notification:', callData);
//         // Stop foreground service
//         try { NativeModules.CallModule?.stopCallService(); } catch {}

//         if (callData.autoAccept) {
//           // Already on this screen — set autoAnswer flag
//           autoAnswerOnOfferRef.current = true;
//         }
//       }
//     );

//     return () => subscription.remove();
//   }, []);

//   // ─── Audio / screen lifecycle ────────────────────────────────
//   useEffect(() => {
//     global.__onCallScreen = true;
//     return () => {
//       global.__onCallScreen = false;
//       InCallManager.stopRingtone();
//       InCallManager.stop({ busytone: '_BUNDLE_' });
//     };
//   }, []);

//   useEffect(() => {
//     InCallManager.stopRingtone();
//     InCallManager.start({ media: 'video' });
//     InCallManager.setSpeakerphoneOn(true);
//     return () => {
//       InCallManager.stop();
//       InCallManager.stopRingtone();
//     };
//   }, []);

//   useEffect(() => {
//     InCallManager.setKeepScreenOn(true);
//     return () => {
//       InCallManager.stop();
//       InCallManager.setKeepScreenOn(false);
//       stopRinging();
//     };
//   }, []);

//   useEffect(() => {
//     if (showIncomingModal) {
//       startRinging();
//     } else {
//       stopRinging();
//     }
//     return () => stopRinging();
//   }, [showIncomingModal]);

//   // Prefetch ICE servers the moment the screen mounts — for an incoming call
//   // this happens while the phone is still ringing, so by the time the user
//   // taps Accept the servers are (almost always) already cached and
//   // ensurePeerConnection() resolves instantly instead of waiting on a
//   // network round trip to Xirsys.
//   useEffect(() => {
//     prefetchIceServers();
//     return () => {
//       clearConnectTimeout();
//       clearIceRecoveryTimeout();
//       clearVideoWatchdog();
//     };
//   }, []);

//   // ─── Permissions ─────────────────────────────────────────────
//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//         ]);
//         return (
//           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
//             PermissionsAndroid.RESULTS.GRANTED
//         );
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   // ─── ICE servers ─────────────────────────────────────────────
//   const getIceServers = async () => {
//     try {
//       console.log("[Xirsys] Fetching ICE servers...");
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
//       if (data?.v?.iceServers) {
//         const server = data.v.iceServers;
//         const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
//         iceServers = [{ urls, username: server.username, credential: server.credential }];
//       }
//       if (!iceServers.length) throw new Error("No ICE servers");
//       iceServers.push({ urls: "stun:stun.l.google.com:19302" });
//       rtcConfig.iceServers = iceServers;
//       console.log("✅ [ICE CONFIG READY]");
//     } catch (err) {
//       console.error("❌ [Xirsys Failed]:", err);
//       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//     }
//     rtcConfig.iceTransportPolicy = "all";
//   };

//   // Wraps getIceServers() in a cached, shared promise so it only ever runs
//   // once per screen instance, no matter how many places call it.
//   const prefetchIceServers = () => {
//     if (!iceServersPromiseRef.current) {
//       iceServersPromiseRef.current = getIceServers();
//     }
//     return iceServersPromiseRef.current;
//   };

//   // ─── Connect timeout helpers ───────────────────────────────────
//   const clearConnectTimeout = () => {
//     if (connectTimeoutRef.current) {
//       clearTimeout(connectTimeoutRef.current);
//       connectTimeoutRef.current = null;
//     }
//   };

//   const startConnectTimeout = () => {
//     clearConnectTimeout();
//     connectTimeoutRef.current = setTimeout(() => {
//       if (!isCallActiveRef.current) return;
//       if (remoteStream.current) return; // already connected, nothing to do

//       Alert.alert(
//         "Connection Problem",
//         "We're having trouble connecting this call. Check your internet connection.",
//         [
//           { text: "Keep Waiting", style: "cancel", onPress: () => startConnectTimeout() },
//           { text: "End Call", style: "destructive", onPress: () => endCall(true) },
//         ]
//       );
//     }, REMOTE_TRACK_TIMEOUT_MS);
//   };

//   // ─── ICE recovery helpers ──────────────────────────────────────
//   // Some devices/networks bounce through "disconnected" briefly and then
//   // recover on their own — we don't want to nuke the call for that. But if
//   // it stays down for ICE_RECOVERY_GRACE_MS, we proactively restart ICE
//   // instead of waiting for the user to notice a frozen/black video.
//   const clearIceRecoveryTimeout = () => {
//     if (iceRecoveryTimeoutRef.current) {
//       clearTimeout(iceRecoveryTimeoutRef.current);
//       iceRecoveryTimeoutRef.current = null;
//     }
//   };

//   const scheduleIceRecovery = () => {
//     clearIceRecoveryTimeout();
//     iceRecoveryTimeoutRef.current = setTimeout(() => {
//       if (!isCallActiveRef.current || !pc.current) return;
//       const state = pc.current.connectionState || pc.current.iceConnectionState;
//       if (state === "connected" || state === "completed") return; // self-healed
//       attemptIceRestart();
//     }, ICE_RECOVERY_GRACE_MS);
//   };

//   // Works for either role: the caller renegotiates with iceRestart, the
//   // callee just waits (it'll receive the renegotiated offer over the
//   // existing signaling channel and answer it like any other renegotiation).
//   const attemptIceRestart = async () => {
//     if (!pc.current || iceRestartInFlightRef.current) return;
//     if (!isCallerRef.current) {
//       console.log("[ICE] Callee cannot restart ICE directly, waiting for caller's renegotiation");
//       return;
//     }
//     iceRestartInFlightRef.current = true;
//     try {
//       console.log("[ICE] Attempting ICE restart...");
//       const offer = await pc.current.createOffer({ iceRestart: true });
//       await pc.current.setLocalDescription(offer);
//       sendMessage({
//         type: "offer",
//         offer: { type: offer.type, sdp: offer.sdp },
//         isVideoCall: true,
//         isRenegotiation: true,
//       });
//       console.log("[ICE] Restart offer sent");
//     } catch (err) {
//       console.warn("[ICE] Restart failed:", err?.message);
//     } finally {
//       iceRestartInFlightRef.current = false;
//     }
//   };

//   // ─── Inbound-video watchdog + forced relay recovery ────────────
//   // ontrack firing and connectionState === "connected" only prove
//   // negotiation succeeded — they do NOT prove RTP packets are actually
//   // arriving. On an asymmetric NAT (very common on mobile carrier
//   // networks), one side's outbound media reaches the peer fine while
//   // the peer's return media gets silently filtered, and everything above
//   // still reports success. This watchdog checks the real inbound-rtp
//   // video stats every 3s; if zero packets show up after ~9s, it assumes
//   // a one-way NAT problem and forces the whole call onto TURN relay only,
//   // which is symmetric by construction and works regardless of either
//   // device's NAT type.
//   const clearVideoWatchdog = () => {
//     if (videoStatsWatchdogRef.current) {
//       clearInterval(videoStatsWatchdogRef.current);
//       videoStatsWatchdogRef.current = null;
//     }
//   };

//   const startVideoFrameWatchdog = () => {
//     clearVideoWatchdog();
//     let staleChecks = 0;
//     videoStatsWatchdogRef.current = setInterval(async () => {
//       if (!pc.current || !isCallActiveRef.current) return;
//       try {
//         const stats = await pc.current.getStats();
//         let framesDecoded = 0;
//         let packetsReceived = 0;
//         stats.forEach((report) => {
//           if (report.type === "inbound-rtp" && report.kind === "video") {
//             framesDecoded = report.framesDecoded || 0;
//             packetsReceived = report.packetsReceived || 0;
//           }
//         });
//         console.log(`[Watchdog] inbound video framesDecoded=${framesDecoded} packetsReceived=${packetsReceived}`);

//         if (framesDecoded > 0) {
//           // Real video is actually arriving and decoding — healthy, stop watching.
//           clearVideoWatchdog();
//           return;
//         }

//         if (packetsReceived === 0) {
//           staleChecks += 1;
//           console.warn(`[Watchdog] Zero inbound video packets (${staleChecks}/3) — possible one-way NAT block`);
//           if (staleChecks >= 3) {
//             clearVideoWatchdog();
//             await forceRelayRecovery();
//           }
//         } else {
//           // Packets arriving but not decoding yet (e.g. keyframe not
//           // received) — give it a bit longer before assuming a real
//           // problem, but don't reset the counter to zero abruptly.
//           staleChecks = Math.max(0, staleChecks - 1);
//         }
//       } catch (err) {
//         console.warn("[Watchdog] getStats failed:", err?.message);
//       }
//     }, 3000);
//   };

//   // Tears down the current peer connection (keeping local camera/mic
//   // running) and rebuilds it with iceTransportPolicy forced to "relay",
//   // then redoes the offer/answer handshake over the existing signaling
//   // channel. TURN relay routes both directions of media through the
//   // same relay server, so it isn't subject to either side's NAT
//   // behavior — this is the most reliable fallback across arbitrary
//   // devices/networks when direct/STUN connectivity turns out to be
//   // one-way.
//   const forceRelayRecovery = async () => {
//     if (forcedRelayAttemptedRef.current || !isCallActiveRef.current) return;
//     forcedRelayAttemptedRef.current = true;
//     console.warn("[Recovery] No inbound video detected — forcing TURN-relay-only reconnect");

//     try {
//       rtcConfig.iceTransportPolicy = "relay";

//       if (pc.current) {
//         try {
//           pc.current.onicecandidate = null;
//           pc.current.ontrack = null;
//           pc.current.onnegotiationneeded = null;
//           pc.current.onconnectionstatechange = null;
//           pc.current.oniceconnectionstatechange = null;
//           pc.current.close();
//         } catch (e) {}
//         pc.current = null;
//       }
//       remoteStream.current = null;
//       setRemoteURL(null);
//       setWebrtcReady(false);
//       queuedRemoteCandidates.current = [];

//       await ensurePeerConnection();
//       attachLocalTracksToPeer();

//       if (isCallerRef.current) {
//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);
//         sendMessage({
//           type: "offer",
//           offer: { type: offer.type, sdp: offer.sdp },
//           isVideoCall: true,
//           isRenegotiation: true,
//         });
//         console.log("[Recovery] Relay-only offer sent");
//       }
//       // Callee side needs nothing further here — it will receive the
//       // renegotiated offer above through the normal
//       // "offer" + isRenegotiation handler, which now targets the fresh
//       // relay-only pc we just created.

//       startConnectTimeout();
//     } catch (err) {
//       console.error("[Recovery] Force-relay reconnect failed:", err?.message);
//     }
//   };

//   // ─── Codec preference (cross-device compatibility) ────────────
//   // Some hardware H.264 decoders (notably certain Unisoc/Transsion chipsets)
//   // are unreliable under WebRTC's decoder-instance churn and fail with
//   // C2_NO_MEMORY / never render a frame even though the track is flowing.
//   // VP8 is a software codec available on effectively every Android/iOS
//   // device and sidesteps that class of hardware decoder bug entirely.
//   // We prefer it (not force it) — if VP8 isn't in the list for some reason
//   // this is a silent no-op and negotiation proceeds with whatever's default.
//   const preferReliableVideoCodec = () => {
//     if (!pc.current || typeof pc.current.getTransceivers !== "function") return;
//     try {
//       const transceivers = pc.current.getTransceivers();
//       transceivers.forEach((transceiver) => {
//         const kind = transceiver.receiver?.track?.kind || transceiver.sender?.track?.kind;
//         if (kind !== "video") return;
//         if (typeof transceiver.setCodecPreferences !== "function") return;
//         if (typeof RTCPeerConnection.getCapabilities !== "function") return;

//         const capabilities = RTCPeerConnection.getCapabilities("video");
//         const codecs = capabilities?.codecs || [];
//         if (!codecs.length) return;

//         const vp8 = codecs.filter((c) => /VP8/i.test(c.mimeType));
//         const others = codecs.filter((c) => !/VP8/i.test(c.mimeType));
//         if (!vp8.length) return; // nothing to prefer, leave default order

//         transceiver.setCodecPreferences([...vp8, ...others]);
//         console.log("[WebRTC] Preferred VP8 for video transceiver (hardware-decoder-safe)");
//       });
//     } catch (err) {
//       // Not all react-native-webrtc versions expose this API — safe to ignore.
//       console.log("[WebRTC] Codec preference not available on this build, skipping:", err?.message);
//     }
//   };

//   // ─── Peer connection ─────────────────────────────────────────
//   const ensurePeerConnection = async () => {
//   if (pc.current) return;
//   await prefetchIceServers();

//   pc.current = new RTCPeerConnection(rtcConfig);
//   console.log("[WebRTC] RTCPeerConnection created");

//   // --- Negotiation ---
//   pc.current.onnegotiationneeded = () => {
//     console.log("[WebRTC] onnegotiationneeded, signalingState:", pc.current?.signalingState);
//   };

//   // --- ICE Candidates ---
//   pc.current.onicecandidate = (evt) => {
//     if (evt.candidate) {
//       const cand = evt.candidate.candidate;
//       if (cand.includes("typ relay")) console.log("🟢 [TURN WORKING]", cand);
//       else if (cand.includes("typ srflx")) console.log("🟡 [STUN WORKING]", cand);
//       sendMessage({ type: "candidate", candidate: evt.candidate });
//     } else {
//       console.log("[ICE] Gathering finished");
//     }
//   };

//   // --- TRACK RECEIVED ---
//   pc.current.ontrack = (evt) => {
//     console.log("========= TRACK RECEIVED =========");
//     console.log("Track Kind:", evt.track.kind);
//     console.log("Track enabled:", evt.track.enabled);
//     console.log("Track readyState:", evt.track.readyState);

//     // Make sure the incoming track is actually enabled — a small number of
//     // device/OS combinations have been seen delivering tracks with
//     // enabled=false, which renders as a black/frozen RTCView on the
//     // receiving side even though negotiation succeeded.
//     try { evt.track.enabled = true; } catch (e) {}

//     let stream = evt.streams && evt.streams[0];

//     // Fallback: some older / vendor WebRTC implementations don't populate
//     // evt.streams reliably. Build a MediaStream manually from the track so
//     // we never silently drop a working track just because the stream
//     // wrapper was missing.
//     if (!stream) {
//       console.warn("[WebRTC] Track received with no stream — constructing one manually");
//       try {
//         stream = remoteStream.current instanceof MediaStream
//           ? remoteStream.current
//           : new MediaStream();
//         if (!stream.getTracks().some((t) => t.id === evt.track.id)) {
//           stream.addTrack(evt.track);
//         }
//       } catch (e) {
//         console.error("[WebRTC] Failed to construct fallback remote stream:", e?.message);
//       }
//     }

//     if (stream) {
//       remoteStream.current = stream;

//       const tracks = stream.getTracks();
//       console.log(`Remote stream now has ${tracks.length} tracks:`,
//         tracks.map((t) => ({ kind: t.kind, enabled: t.enabled }))
//       );

//       try {
//         const url = stream.toURL();
//         setRemoteURL(url);
//         console.log("remote_stream url:", url);
//       } catch (e) {
//         console.error("Error getting remote URL:", e);
//       }

//       // The remote track has actually arrived — this is the ONLY place
//       // that should flip webrtcReady, so the UI truly reflects "video is
//       // showing" rather than "we sent an answer and hoped for the best".
//       setWebrtcReady(true);
//       setCallAccepted(true);
//       clearConnectTimeout();
//       clearIceRecoveryTimeout();
//       InCallManager.start({ media: 'video' });
//       InCallManager.setSpeakerphoneOn(true);

//       // ontrack firing only means negotiation succeeded — it doesn't
//       // guarantee RTP packets are actually flowing (one-way NAT issue).
//       // Start checking real inbound stats now.
//       startVideoFrameWatchdog();
//     } else {
//       console.warn("[WebRTC] Track received but no stream could be established!");
//     }
//   };

//   // --- Connection State ---
//   pc.current.onconnectionstatechange = async () => {
//     if (!pc.current) return;
//     const state = pc.current.connectionState;
//     console.log("[WebRTC] connectionState =>", state);

//     if (state === "connected") {
//       clearIceRecoveryTimeout();
//       console.log("VIDEO CALL CONNECTED");
//       try {
//         const stats = await pc.current.getStats();
//         stats.forEach((report) => {
//           if (report.type === "candidate-pair" && report.state === "succeeded") {
//             const local = stats.get(report.localCandidateId);
//             const remote = stats.get(report.remoteCandidateId);
//             if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
//               console.log("🟢 USING TURN (Xirsys)");
//             } else if (local?.candidateType === "srflx") {
//               console.log("🟡 USING STUN");
//             } else {
//               console.log("⚪ USING LOCAL");
//             }
//           }
//         });
//       } catch (err) {
//         console.warn("[WebRTC] getStats failed:", err);
//       }
//     }

//     // "disconnected" often self-heals (brief radio handoff, wifi<->cell
//     // switch, etc). Give it a grace window before forcing an ICE restart —
//     // this keeps calls alive on flaky networks across any device, rather
//     // than only reacting once the state has already fully failed.
//     if (state === "disconnected") {
//       console.warn("[WebRTC] Connection disconnected — watching for self-recovery");
//       scheduleIceRecovery();
//     }

//     if (state === "failed") {
//       console.warn("VIDEO CONNECTION FAILED");
//       clearIceRecoveryTimeout();
//       // One immediate recovery attempt before giving up — cheap and often
//       // enough to survive a bad handoff that fails outright rather than
//       // lingering in "disconnected".
//       attemptIceRestart();
//       saveCallToHistory({
//         contact: { name, profileImage: profile_image, userId: targetUserId },
//         direction: isInitiator ? 'outgoing' : 'incoming',
//         isVideoCall: true,
//         status: 'failed',
//         duration: callDuration,
//       });
//     }
//   };

//   // --- ICE State ---
//   pc.current.oniceconnectionstatechange = () => {
//     if (!pc.current) return;
//     console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
//   };
// };

//   // Just gets camera/mic permission + the local MediaStream. Doesn't touch
//   // the peer connection at all, so it can run in parallel with
//   // ensurePeerConnection() instead of waiting behind it.
//   const getLocalStream = async () => {
//     if (localStream.current) {
//       const videoTrack = localStream.current.getVideoTracks()[0];
//       if (videoTrack && !videoTrack.enabled) {
//         videoTrack.enabled = true;
//         console.log("[Local] Re-enabled video track");
//       }
//       return true;
//     }

//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       Alert.alert("Permission denied", "Cannot access camera or microphone.");
//       return false;
//     }
//     try {
//       const s = await mediaDevices.getUserMedia({
//         audio: true,
//         video: {
//           facingMode: isCameraFront ? "user" : "environment",
//           frameRate: 30,
//         },
//       });

//       const videoTrack = s.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = true;
//         console.log("[Local] Video track enabled:", videoTrack.enabled);
//       }

//       localStream.current = s;
//       try { setLocalURL(s.toURL()); } catch {}
//       return true;
//     } catch (e) {
//       Alert.alert("Error", "Failed to get camera/mic: " + e.message);
//       return false;
//     }
//   };

//   // Attaches whatever is in localStream.current onto pc.current. Safe to
//   // call multiple times — skips tracks that are already attached.
//   const attachLocalTracksToPeer = () => {
//     if (!pc.current || !localStream.current) return;
//     const existingTracks = pc.current.getSenders().map((s) => s.track);
//     localStream.current.getTracks().forEach((track) => {
//       if (!existingTracks.includes(track)) {
//         pc.current.addTrack(track, localStream.current);
//         console.log(`[Local] Attached ${track.kind} track to peer connection`);
//       }
//     });
//     // Now that transceivers exist, try to steer video negotiation toward a
//     // software codec (VP8) so buggy vendor hardware decoders on either end
//     // of the call are avoided. No-op if unsupported on this build.
//     preferReliableVideoCodec();
//   };

//   // Combined convenience helper kept for call sites that don't need the
//   // parallelized version.
//   const ensureLocalStreamAndAttach = async () => {
//     const ok = await getLocalStream();
//     if (ok) attachLocalTracksToPeer();
//     return ok;
//   };

//   // The optimized prep step: peer connection creation (ICE servers, usually
//   // already cached) and camera/mic acquisition happen at the same time
//   // instead of one after another, then tracks are attached once both are
//   // ready. This is what shaves the noticeable delay off of "tap Accept" →
//   // "video appears".
//   const prepareConnectionAndMedia = async () => {
//     const [, mediaOk] = await Promise.all([
//       ensurePeerConnection(),
//       getLocalStream(),
//     ]);
//     if (mediaOk && pc.current) {
//       attachLocalTracksToPeer();
//     }
//     return !!(mediaOk && pc.current);
//   };

//   const drainQueuedCandidates = async () => {
//     if (!pc.current) return;
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err?.message);
//       }
//     }
//   };

//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing video peer connection");
//     isCleaningUpRef.current = true;
//     isCallActiveRef.current = false;
//     clearConnectTimeout();
//     clearIceRecoveryTimeout();
//     clearVideoWatchdog();
//     forcedRelayAttemptedRef.current = false;
//     setCallAccepted(false);
//     setCallStarted(false);

//     try {
//       if (pc.current) {
//         pc.current.onicecandidate = null;
//         pc.current.ontrack = null;
//         pc.current.onnegotiationneeded = null;
//         pc.current.onconnectionstatechange = null;
//         pc.current.oniceconnectionstatechange = null;
//         pc.current.close();
//       }
//     } catch (e) {}
//     pc.current = null;

//     try {
//       if (localStream.current) {
//         localStream.current.getTracks().forEach((t) => t.stop());
//       }
//     } catch (e) {}
//     localStream.current = null;

//     // Release the remote track(s) explicitly. On some vendor hardware
//     // decoders (see: Unisoc C2UnisocAvcDec) relying solely on pc.close()
//     // to tear down the decoder instance is unreliable and leaves it
//     // "leaked", eventually exhausting decoder instances (C2_NO_MEMORY)
//     // across repeated calls. Stopping the tracks ourselves guarantees the
//     // decoder is released every time, on every device.
//     try {
//       if (remoteStream.current) {
//         remoteStream.current.getTracks().forEach((t) => t.stop());
//       }
//     } catch (e) {}
//     remoteStream.current = null;

//     queuedRemoteCandidates.current = [];
//     hasInitialOfferRef.current = false;
//     acceptInProgressRef.current = false;
//     iceRestartInFlightRef.current = false;

//     try { InCallManager.stop(); } catch {}

//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCameraFront(true);
//     setIsMuted(false);
//     setIsSpeakerOn(false);
//     isCleaningUpRef.current = false;
//   };

//   // ─── Signaling ───────────────────────────────────────────────
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[WS] Sending:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     } else {
//       console.warn("[WS] Cannot send, state:", ws.current?.readyState);
//     }
//   };

//   const connectSignaling = async () => {
//     const token = await AsyncStorage.getItem("userToken");
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
//     const currentUserId = userData?.id;

//     let roomId;
//     if (isInitiator && targetUserId) {
//       roomId = `user-${targetUserId}`;
//     } else if (autoAnswerOnOffer && targetUserId) {
//       // Accepted from notification — connect to OUR room to receive offer
//       roomId = `user-${currentUserId}`;
//       console.log('[AutoAnswer] Connecting to our room:', roomId);
//     } else if (currentUserId) {
//       roomId = `user-${currentUserId}`;
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

//       // Prep peer connection + camera/mic in parallel ahead of time so
//       // whichever signaling message arrives next (offer/answer) can be
//       // handled with zero setup latency.
//       await prepareConnectionAndMedia();

//       if (isInitiator && targetUserId) {
//         isCallerRef.current = true;
//         setCallStarted(true);
//         startAudioSession();
//         await createAndSendInitialOffer();
//       }

//       // Normal incoming (not from notification)
//       if (!isInitiator && isIncomingCall && incomingOffer && !autoAnswerOnOffer) {
//         await handleIncomingCall(incomingOffer);
//       }
//       // autoAnswerOnOffer: wait for offer via WebSocket
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try { data = JSON.parse(evt.data); } catch { return; }

//       console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation);

//       // Drop messages after call ended
//       if (!isCallActiveRef.current && data?.type !== "call-ended") {
//         console.warn("[WS] Ignoring after call ended:", data?.type);
//         return;
//       }

//       // ── Echo filtering ──────────────────────────────────────
//       // Ignore our own offer echoed back (but never for a renegotiation —
//       // both sides legitimately send those mid-call, e.g. ICE restarts)
//       if (data.type === 'offer' && !data.isRenegotiation && isCallerRef.current) {
//         console.warn('[WS] Ignoring own offer echo — we are the caller');
//         return;
//       }
//       // Ignore answer if we are the callee
//       if (data.type === 'answer' && !isCallerRef.current && !data.isRenegotiation) {
//         console.warn('[WS] Ignoring answer — we are the callee');
//         return;
//       }
//       // ────────────────────────────────────────────────────────

//       switch (data.type) {

//         case "offer": {
//           if (data.isRenegotiation) {
//             try {
//               await ensurePeerConnection();
//               await ensureLocalStreamAndAttach();
//             } catch (err) {
//               console.error("[WebRTC] Renegotiation prep failed:", err);
//               return;
//             }
//             await handleRenegotiationOffer(data.offer);
//             break;
//           }

//           // Regular initial offer
//           if (isCallerRef.current) break;

//           const offerData = data.offer;
//           if (!offerData?.sdp) {
//             console.error("[WS] Offer missing SDP");
//             break;
//           }

//           console.log("[WS] Valid video offer, SDP length:", offerData.sdp.length);

//           if (autoAnswerOnOfferRef.current) {
//             // User already accepted from notification — answer immediately
//             console.log('[AutoAnswer] Auto-answering video offer');
//             autoAnswerOnOfferRef.current = false;
//             isCallerRef.current = false;
//             startAudioSession();
//             await handleIncomingCall(offerData);
//             if (currentCallIdRef.current) {
//               await CallKeepService.setCallConnected(currentCallIdRef.current);
//             }
//           } else {
//             // Normal flow — show modal + CallKeep UI
//             const incomingCallId = `call_${Date.now()}`;
//             updateCallId(incomingCallId);
//             setIncomingSDP(offerData);

//             await CallKeepService.displayIncomingCall({
//               callId: incomingCallId,
//               callerName: offerData.callerInfo?.name || name || 'Unknown',
//               callerId: offerData.callerId || targetUserId || '',
//               isVideo: true,
//               roomId: offerData.roomId || '',
//             });

//             setShowIncomingModal(true);
//           }
//           break;
//         }

//         case "answer": {
//           if (!isCallerRef.current || !pc.current) break;
//           setCallAccepted(true);
//           if (pc.current.signalingState === "have-local-offer") {
//             try {
//               await pc.current.setRemoteDescription(
//                 new RTCSessionDescription(data.answer)
//               );
//               await drainQueuedCandidates();
//               // Caller now waits for the actual media track — guard against
//               // the far side never sending it (bad network, dead peer, etc).
//               startConnectTimeout();
//             } catch (e) {
//               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message);
//             }
//           }
//           break;
//         }

//         case "candidate": {
//           if (!pc.current) break;
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//             } catch (e) {
//               console.warn("[WebRTC] addIceCandidate error:", e?.message);
//             }
//           }
//           break;
//         }

//         case "call-ended": {
//           Alert.alert("Call Ended", "Your call partner has disconnected");
//           endCall(false);
//           break;
//         }

//         case "call-rejected": {
//           Alert.alert("Call Rejected", "The recipient declined your call");
//           await saveCallToHistory({
//             contact: { name, profileImage: profile_image, userId: targetUserId },
//             direction: 'outgoing',
//             isVideoCall: true,
//             status: 'rejected',
//             duration: 0,
//           });
//           endCall(false);
//           break;
//         }

//         case "call-missed": {
//           if (!isInitiator) {
//             await saveCallToHistory({
//               contact: { name, profileImage: profile_image, userId: targetUserId },
//               direction: 'incoming',
//               isVideoCall: true,
//               status: 'missed',
//               duration: 0,
//             });
//           }
//           break;
//         }

//         default:
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       setWsConnected(false);
//       if (!isCleaningUpRef.current) cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err?.message);
//     };
//   };

//   // ─── Renegotiation ───────────────────────────────────────────
//   const handleRenegotiationOffer = async (offer) => {
//     try {
//       if (!pc.current) {
//         await ensurePeerConnection();
//         await ensureLocalStreamAndAttach();
//       }
//       if (!pc.current || pc.current.signalingState === "closed") return;

//       console.log("[WebRTC] Renegotiation, signalingState:", pc.current.signalingState);
//       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//       await drainQueuedCandidates();

//       const answer = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answer);

//       sendMessage({ type: "answer", answer, isVideoCall: true, isRenegotiation: true });
//       console.log("[WebRTC] Renegotiation answer sent");
//     } catch (error) {
//       console.error("[WebRTC] Renegotiation failed:", error);
//     }
//   };

//   // ─── Call history ─────────────────────────────────────────────
//   const saveCallToHistory = async (callDetails) => {
//     try {
//       const existingHistory = await AsyncStorage.getItem('callHistory');
//       const history = existingHistory ? JSON.parse(existingHistory) : [];
//       const newCall = {
//         id: Date.now().toString(),
//         timestamp: Date.now(),
//         contact: {
//           name: callDetails.contact.name,
//           profileImage: callDetails.contact.profileImage,
//           userId: callDetails.contact.userId,
//         },
//         direction: callDetails.direction,
//         isVideoCall: true,
//         status: callDetails.status,
//         duration: callDetails.duration || 0,
//       };
//       history.unshift(newCall);
//       await AsyncStorage.setItem('callHistory', JSON.stringify(history.slice(0, 100)));
//       console.log('[CallHistory] Saved:', callDetails.status);
//     } catch (error) {
//       console.error('[CallHistory] Error:', error);
//     }
//   };

//   // ─── Offer / answer ───────────────────────────────────────────
//   const createAndSendInitialOffer = async () => {
//     if (hasInitialOfferRef.current) return;

//     console.log("[VideoCall] Creating initial offer...");
//     const ok = await prepareConnectionAndMedia();
//     if (!ok || !pc.current) return;

//     try {
//       const userDataRaw = await AsyncStorage.getItem("userData");
//       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//       const currentUserId = userData?.id;

//       if (!currentUserId) {
//         console.error("[VideoCall] No current user ID");
//         return;
//       }

//       const callerInfo = {
//         profileImage: userData.profile_picture || userData.profile_image || "",
//         name: userData.name || "Caller",
//       };

//       const offer = await pc.current.createOffer();
//       await pc.current.setLocalDescription(offer);

//       console.log("[VideoCall] Offer SDP length:", offer.sdp?.length);

//       sendMessage({
//         type: "new_call",
//         receiver_id: targetUserId,
//         sender_id: currentUserId,
//         caller_name: callerInfo.name,
//         call_type: "video",
//         room_id: `call_${currentUserId}_${targetUserId}`,
//         offer: {
//           type: offer.type,
//           sdp: offer.sdp,
//           targetUserId,
//           callerId: currentUserId,
//           callerInfo,
//           isVideoCall: true,
//         },
//       });

//       hasInitialOfferRef.current = true;
//       console.log("[VideoCall] Initial offer sent ✅");
//     } catch (e) {
//       console.error("[VideoCall] createOffer failed:", e?.message);
//     }
//   };

// const handleIncomingCall = async (offer) => {
//   if (acceptInProgressRef.current) return;
//   acceptInProgressRef.current = true;

//   try {
//     console.log("[Incoming] Starting...");

//     if (!currentCallIdRef.current) {
//       const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
//       updateCallId(newCallId);
//     }

//     if (!offer?.sdp) {
//       console.error("[VideoCall] Missing SDP in offer");
//       Alert.alert("Error", "Invalid video call offer.");
//       acceptInProgressRef.current = false;
//       rejectCall();
//       return;
//     }

//     // ✅ STEP 0: Flip the UI over to the "connecting" state immediately —
//     // don't leave the Accept/Decline modal sitting on screen while the
//     // WebRTC handshake runs in the background. The user sees a spinner
//     // and "Please wait, connecting..." right away.
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
//     setCallAccepted(true);
//     try { NativeModules.CallModule?.stopCallService(); } catch {}

//     // ✅ STEP 1 + 2: Peer connection creation and camera/mic acquisition
//     // happen in parallel instead of one after another.
//     const ok = await prepareConnectionAndMedia();
//     if (!ok || !pc.current) {
//       acceptInProgressRef.current = false;
//       rejectCall();
//       return;
//     }

//     // ✅ STEP 3: Set remote description
//     await pc.current.setRemoteDescription(
//       new RTCSessionDescription({ 
//         type: offer.type || 'offer', 
//         sdp: offer.sdp 
//       })
//     );
    
//     await drainQueuedCandidates();

//     // ✅ STEP 4: Create answer with explicit video/audio options
//     const answer = await pc.current.createAnswer({
//       offerToReceiveAudio: true,
//       offerToReceiveVideo: true,
//     });
    
//     await pc.current.setLocalDescription(answer);

//     // Debug logging
//     console.log("Local video tracks:", localStream.current.getVideoTracks().length);
//     console.log("Local audio tracks:", localStream.current.getAudioTracks().length);
//     console.log("Peer senders:", pc.current.getSenders().map(sender => ({
//       kind: sender.track?.kind,
//       enabled: sender.track?.enabled,
//       readyState: sender.track?.readyState
//     })));

//     // ✅ STEP 5: Send answer
//     sendMessage({
//       type: "answer",
//       answer: { type: answer.type, sdp: answer.sdp },
//       isVideoCall: true,
//     });

//     // Note: webrtcReady is intentionally NOT set here — it's only set once
//     // pc.current.ontrack actually fires with the remote media. Until then
//     // the connecting screen shows a spinner + "Please wait, connecting...".
//     startConnectTimeout();

//     console.log("[VideoCall] Answer sent, waiting for remote track...");
    
//   } catch (error) {
//     console.error("[VideoCall] handleIncomingCall error:", error?.message);
//     Alert.alert("Error", "Failed to accept video call: " + (error?.message || "Unknown"));
//     rejectCall();
//   } finally {
//     acceptInProgressRef.current = false;
//   }
// };


//   // ─── Lifecycle ────────────────────────────────────────────────
//   useEffect(() => {
//     connectSignaling();
//     return () => { endCall(false); };
//   }, []);

//   useEffect(() => {
//     if (webrtcReady && callAccepted) {
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
//     return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
//   }, [webrtcReady, callAccepted]);

//   // ─── Call actions ─────────────────────────────────────────────
//   const acceptCall = async () => {
//     if (acceptInProgressRef.current) return;
//     stopRinging();
//     isCallerRef.current = false;
//     const offer = incomingSDP;
//     if (!offer?.sdp) {
//       Alert.alert("Error", "Invalid video call offer.");
//       return;
//     }
//     startAudioSession();
//     await handleIncomingCall(offer);
//   };

//   const startCall = async () => {
//     isCallerRef.current = true;
//     setCallStarted(true);
//     const newCallId = `call_${Date.now()}_${targetUserId}`;
//     updateCallId(newCallId);
//     startAudioSession();
//     await createAndSendInitialOffer();
//   };

//   const endCall = useCallback(async (notify = true) => {
//   console.log("[VideoCall] Ending call...");
  
//   // ─── 1. IMMEDIATE STOP ───
//   // Stop ringing immediately
//   try { InCallManager.stopRingtone(); } catch (e) {}
  
//   // Mark call as inactive immediately
//   isCallActiveRef.current = false;
//   clearConnectTimeout();
//   clearIceRecoveryTimeout();
//   clearVideoWatchdog();

//   // ─── 2. IMMEDIATE STATE RESET ───
//   // Reset all UI state immediately
//   setWebrtcReady(false);
//   setLocalURL(null);
//   setRemoteURL(null);
//   setCallDuration(0);
//   setCurrentCallId(null);
//   setShowIncomingModal(false);
//   setIncomingSDP(null);

//   // Stop media tracks synchronously, right here — not deferred. This is
//   // what actually releases the camera and the hardware video decoder.
//   // Doing it before navigation (rather than inside the setTimeout(0)
//   // cleanup below) closes the race where a fresh VideoCallScreen could
//   // mount and request a new decoder instance before the old one has been
//   // released, which is what compounds into decoder-exhaustion crashes on
//   // some devices over repeated calls.
//   try {
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//     }
//   } catch (e) {}
//   try {
//     if (remoteStream.current) {
//       remoteStream.current.getTracks().forEach((t) => t.stop());
//     }
//   } catch (e) {}

//   // ─── 3. NAVIGATE INSTANTLY ───
//   // Use setTimeout(0) for immediate navigation in next tick
//   setTimeout(() => {
//     try {
//       if (navigation.canGoBack()) {
//         navigation.goBack();
//       } else {
//         navigation.navigate("PHome");
//       }
//     } catch (e) {
//       navigation.navigate("PHome");
//     }
//   }, 0);

//   // ─── 4. BACKGROUND CLEANUP (non-blocking) ───
//   const cid = currentCallIdRef.current || currentCallId;
  
//   // Use setTimeout with 0 to defer all cleanup
//   setTimeout(() => {
//     // End CallKeep call
//     if (cid) {
//       try { 
//         CallKeepService.endCall(cid).catch(() => {}); 
//       } catch (e) {}
//     }

//     // Stop foreground service
//     try { 
//       NativeModules.CallModule?.stopCallService(); 
//     } catch (e) {}

//     // Notify other party
//     if (notify && ws.current?.readyState === WebSocket.OPEN) {
//       try { 
//         ws.current.send(JSON.stringify({ type: "call-ended" })); 
//       } catch (e) {}
//     }

//     // Close WebSocket
//     try {
//       if (ws.current) {
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//         ws.current = null;
//       }
//     } catch (e) {}

//     // Stop audio
//     try {
//       InCallManager.stop();
//     } catch (e) {}

//     // Cleanup peer connection (tracks were already stopped above; this
//     // closes the RTCPeerConnection itself and clears remaining refs)
//     try {
//       cleanupPeerConnection();
//     } catch (e) {}

//     console.log("[VideoCall] Cleanup complete");
//   }, 0);

//   // ─── 5. SAVE HISTORY (async, no await) ───
//   const callDetails = {
//     contact: {
//       name: name || 'Unknown',
//       profileImage: profile_image || '',
//       userId: targetUserId || 'unknown',
//     },
//     direction: isInitiator ? 'outgoing' : 'incoming',
//     isVideoCall: true,
//     status: webrtcReady ? 'ended' : 'missed',
//     duration: callDuration || 0,
//   };

//   // Fire and forget save
//   saveCallToHistory(callDetails).catch(() => {});

// }, [navigation, isInitiator, name, profile_image, targetUserId, webrtcReady, callDuration, currentCallId]);



//   const rejectCall = async () => {
//     stopRinging();
//     sendMessage({ type: "call-rejected" });
//     await saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: 'incoming',
//       isVideoCall: true,
//       status: 'rejected',
//       duration: 0,
//     });
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
//     navigation.goBack();
//   };

//   const switchCamera = async () => {
//     if (!localStream.current) return;
//     const videoTrack = localStream.current.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack._switchCamera();
//       setIsCameraFront(!isCameraFront);
//     }
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

//   const toggleSpeaker = () => {
//     const newState = !isSpeakerOn;
//     InCallManager.setSpeakerphoneOn(newState);
//     setIsSpeakerOn(newState);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   // Text shown on the pre-video "connecting" screen.
//   const getConnectingStatusText = () => {
//     if (!wsConnected) return "Connecting...";
//     if (callAccepted) return "Please wait, connecting...";
//     if (isInitiator) return "Calling...";
//     if (autoAnswerOnOffer) return "Connecting to video call...";
//     return "Incoming video call...";
//   };

//   // Show a spinner once we're actively negotiating media (either side),
//   // as opposed to just ringing/dialing.
//   const showConnectingSpinner = wsConnected && callAccepted && !webrtcReady;

//   // ─── UI ───────────────────────────────────────────────────────

//   return (
  
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {(webrtcReady && callAccepted) ? (
//         <View style={styles.callScreen}>
//           {/* Video Call Interface */}
//           {remoteURL ? (
//             <View style={styles.videoContainer}>
//               {/* Remote Video - Full Screen */}
//               <>
//                {console.log("RTCView rendering with:", remoteURL)}
//               <RTCView 
//                 streamURL={remoteURL} 
//                 style={styles.remoteVideo} 
//                 objectFit="cover" 
//               />
//               </>

//               {/* Draggable Local Video PiP========= */}
//               {localURL && pipVisible && (
//                 <View
//                   style={[
//                     styles.localVideoWrapper,
//                     {
//                       left: pipPositionState.x,
//                       top: pipPositionState.y,
//                     }
//                   ]}
//                   {...pipPanResponder.panHandlers}
//                 >
//                   <View style={styles.pipContainer}>
//                     <RTCView 
//                       streamURL={localURL} 
//                       style={styles.localVideoStream} 
//                       objectFit="cover" 
//                       mirror={isCameraFront}
//                     />
                    
//                     {/* Close button */}
//                     <TouchableOpacity 
//                       style={styles.pipCloseButton}
//                       onPress={togglePipVisibility}
//                       activeOpacity={0.7}
//                     >
//                       <Icon name="close" size={16} color="white" />
//                     </TouchableOpacity>

//                     {/* Switch camera button on PiP */}
//                     <TouchableOpacity 
//                       style={styles.pipSwitchButton}
//                       onPress={switchCamera}
//                       activeOpacity={0.7}
//                     >
//                       <Icon name="flip-camera-ios" size={16} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}

//               {/* Show PiP again button when hidden */}
//               {!pipVisible && localURL && (
//                 <TouchableOpacity 
//                   style={styles.showPipButton}
//                   onPress={togglePipVisibility}
//                   activeOpacity={0.7}
//                 >
//                   <Icon name="videocam" size={20} color="white" />
//                 </TouchableOpacity>
//               )}

//               {/* Top Bar with Call Info */}
//               <View style={styles.topBar}>
//                 <View style={styles.topBarContent}>
//                   <Text style={styles.callerNameText} numberOfLines={1}>
//                     {name || 'Unknown'}
//                   </Text>
//                   <Text style={styles.callDurationText}>
//                     {formatTime(callDuration)}
//                   </Text>
//                 </View>
//               </View>

//               {/* Bottom Controls  */}
//               <View style={styles.bottomControls}>
//                 <View style={styles.controlsRow}>
//                   {/* Mute Button */}
//                   <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={toggleMute}
//                     activeOpacity={0.6}
//                   >
//                     <Icon 
//                       name={isMuted ? "mic-off" : "mic"} 
//                       size={22} 
//                       color="white" 
//                     />
//                   </TouchableOpacity>

//                   {/* Speaker Button */}
//                   <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={toggleSpeaker}
//                     activeOpacity={0.6}
//                   >
//                     <Icon 
//                       name={isSpeakerOn ? "volume-up" : "volume-off"} 
//                       size={22} 
//                       color="white" 
//                     />
//                   </TouchableOpacity>

//                   {/* Video Toggle */}
//                   <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={togglePipVisibility}
//                     activeOpacity={0.6}
//                   >
//                     <Icon 
//                       name={pipVisible ? "videocam" : "videocam-off"} 
//                       size={22} 
//                       color="white" 
//                     />
//                   </TouchableOpacity>

//                   {/* Switch Camera */}
//                   <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={switchCamera}
//                     activeOpacity={0.6}
//                   >
//                     <Icon name="flip-camera-ios" size={22} color="white" />
//                   </TouchableOpacity>

//                   {/* End Call */}
//                   <TouchableOpacity 
//                     style={styles.endCallBtn} 
//                     onPress={() => endCall(true)}
//                     activeOpacity={0.6}
//                   >
//                     <Icon name="call-end" size={26} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           ) : (
//             /* Loading/Avatar fallback — only hit if webrtcReady got set
//                without remoteURL yet being available (edge case safety net) */
//             <View style={styles.loadingContainer}>
//               <View style={styles.avatarContainer}>
//                 <View style={styles.avatar}>
//                   <Image
//                     source={{ uri: `${profile_image}` }}
//                     style={styles.avatarImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//                 <Text style={styles.callerName}>{name}</Text>
//                 <ActivityIndicator size="small" color="#fff" style={{ marginTop: 10 }} />
//                 <Text style={styles.callTypeText}>
//                   Connecting Video • {formatTime(callDuration)}
//                 </Text>
//               </View>
//             </View>
//           )}
//         </View>
//       ) : (
//         /* Connecting Screen — shown from mount until the remote video
//            track has actually arrived. Once accepted/answered, this shows
//            a spinner + "Please wait, connecting..." instead of the old
//            ambiguous "Incoming video call..." text lingering on screen. */
//         <View style={styles.connectingScreen}>
//           <View style={styles.connectingContent}>
//             {/* Avatar */}
//             <View style={styles.connectingAvatarContainer}>
//               <Image
//                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//                 style={styles.connectingAvatar}
//                 resizeMode="cover"
//               />
//             </View>

//             {/* Name */}
//             <Text style={styles.connectingName}>{name || 'Unknown'}</Text>

//             {/* Status */}
//             <View style={styles.connectingStatusRow}>
//               {showConnectingSpinner && (
//                 <ActivityIndicator
//                   size="small"
//                   color="rgba(255,255,255,0.8)"
//                   style={{ marginBottom: 10 }}
//                 />
//               )}
//               <Text style={styles.connectingStatusText}>
//                 {getConnectingStatusText()}
//               </Text>
//             </View>

//             {/* Cancel / End Button — available any time we're not showing
//                 the Accept/Decline modal, so either side can bail out of a
//                 stuck connection. */}
//             {!showIncomingModal && (
//               <TouchableOpacity 
//                 style={styles.connectingEndBtn} 
//                 onPress={() => endCall(true)}
//                 activeOpacity={0.6}
//               >
//                 <View style={styles.connectingEndIcon}>
//                   <Icon name="call-end" size={26} color="white" />
//                 </View>
//                 <Text style={styles.connectingEndText}>Cancel</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}

//       {/* Incoming call modal */}
//       {!isInitiator && (
//         <Modal
//           visible={showIncomingModal}
//           transparent
//           animationType="fade"
//           onRequestClose={rejectCall}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.incomingCallText}>Incoming Video Call</Text>
//                 <View style={styles.callerInfo}>
//                   <View style={styles.modalAvatar}>
//                     <Image
//                       source={{ uri: `${profile_image}` }}
//                       style={styles.modalAvatarImage}
//                       resizeMode="cover"
//                     />
//                   </View>
//                   <Text style={styles.modalCallerName}>{name}</Text>
//                   <Text style={styles.modalCallType}>Video Call</Text>
//                 </View>
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
//                     <View style={styles.rejectButtonInner}>
//                       <Icon name="call-end" size={30} color="white" />
//                     </View>
//                     <Text style={styles.buttonText}>Decline</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
//                     <View style={styles.acceptButtonInner}>
//                       <Icon name="videocam" size={30} color="white" />
//                     </View>
//                     <Text style={styles.buttonText}>Accept</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   callScreen: { flex: 1, backgroundColor: '#000' },
//   videoContainer: { flex: 1, backgroundColor: '#000' },
//   remoteVideo: { flex: 1, backgroundColor: '#000' },
//   localVideoWrapper: { position: 'absolute', width: 100, height: 140, zIndex: 20 },
//   pipContainer: {
//     width: 100,
//     height: 140,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.8)',
//     backgroundColor: '#111',
//   },
//   localVideoStream: { width: '100%', height: '100%' },
//   pipCloseButton: {
//     position: 'absolute', top: 4, right: 4,
//     width: 22, height: 22, borderRadius: 11,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   pipSwitchButton: {
//     position: 'absolute', bottom: 4, right: 4,
//     width: 22, height: 22, borderRadius: 11,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   showPipButton: {
//     position: 'absolute', top: 70, right: 16,
//     width: 40, height: 40, borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     alignItems: 'center', justifyContent: 'center',
//     zIndex: 20,
//   },
//   topBar: {
//     position: 'absolute', top: 0, left: 0, right: 0,
//     paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   topBarContent: { alignItems: 'center' },
//   callerNameText: { color: '#fff', fontSize: 18, fontWeight: '600' },
//   callDurationText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
//   bottomControls: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     paddingBottom: 40, paddingTop: 20,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   controlsRow: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
//   },
//   controlBtn: {
//     width: 52, height: 52, borderRadius: 26,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   endCallBtn: {
//     width: 60, height: 60, borderRadius: 30,
//     backgroundColor: '#ff3b30',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
//   avatarContainer: { alignItems: 'center' },
//   avatar: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: '#333' },
//   avatarImage: { width: '100%', height: '100%' },
//   callerName: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 16 },
//   callTypeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 8 },
//   connectingScreen: { flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
//   connectingContent: { alignItems: 'center', width: '100%' },
//   connectingAvatarContainer: {
//     width: 140, height: 140, borderRadius: 70, overflow: 'hidden',
//     backgroundColor: '#333', marginBottom: 20,
//   },
//   connectingAvatar: { width: '100%', height: '100%' },
//   connectingName: { color: '#fff', fontSize: 24, fontWeight: '700' },
//   connectingStatusRow: { alignItems: 'center', marginTop: 12, minHeight: 40 },
//   connectingStatusText: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
//   connectingEndBtn: { alignItems: 'center', marginTop: 60 },
//   connectingEndIcon: {
//     width: 64, height: 64, borderRadius: 32,
//     backgroundColor: '#ff3b30',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   connectingEndText: { color: '#fff', fontSize: 13, marginTop: 8 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
//   modalContainer: { width: '85%' },
//   modalContent: { alignItems: 'center' },
//   incomingCallText: { color: '#fff', fontSize: 16, marginBottom: 20 },
//   callerInfo: { alignItems: 'center', marginBottom: 40 },
//   modalAvatar: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', backgroundColor: '#333' },
//   modalAvatarImage: { width: '100%', height: '100%' },
//   modalCallerName: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 16 },
//   modalCallType: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
//   modalButtons: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' },
//   rejectButton: { alignItems: 'center' },
//   rejectButtonInner: {
//     width: 64, height: 64, borderRadius: 32, backgroundColor: '#ff3b30',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   acceptButton: { alignItems: 'center' },
//   acceptButtonInner: {
//     width: 64, height: 64, borderRadius: 32, backgroundColor: '#34c759',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   buttonText: { color: '#fff', fontSize: 13, marginTop: 8 },
// });



// import React, { useEffect, useRef, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   TouchableOpacity,
//   Modal,
//   StatusBar,
//   ImageBackground,
//   NativeModules,
//   DeviceEventEmitter,
//   PanResponder,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   MediaStream,
//   mediaDevices,
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
// import { useBackHandler } from '../src/hooks/useBackHandler';
// import { forceStopAllCallAudio } from '../src/utils/callAudio';

// const SIGNALING_SERVER = "wss://api.showapp.ng";

// // How long we'll wait for the actual remote video track to arrive after a
// // call is accepted / answered before nudging the user that something's wrong.
// const REMOTE_TRACK_TIMEOUT_MS = 20000;

// // How long a "connected then dropped" state is tolerated before we try an
// // automatic ICE restart. Recovers flaky-network calls without ending them.
// const ICE_RECOVERY_GRACE_MS = 4000;

// // How long we allow "ICE connected" to sit with zero ontrack firing at all
// // before assuming negotiation itself is broken (as opposed to a NAT/packet
// // problem, which the frame watchdog below already covers) and escalating.
// const ONTRACK_NEVER_FIRED_GRACE_MS = 5000;

// // How many consecutive stats checks with packets arriving but ZERO frames
// // decoded before we treat it as a hardware decoder failure (the Unisoc
// // C2_NO_MEMORY / initDecode-failed signature: packets flow fine, decode
// // never happens) rather than a transient hiccup.
// const DECODER_STALL_CHECKS_THRESHOLD = 3;

// // Caps automatic recovery escalation so a genuinely broken network/device
// // doesn't loop forever tearing down and rebuilding the peer connection.
// const MAX_RECOVERY_TIERS = 2;

// // Gives the native layer time to actually release a closed decoder/encoder
// // instance before we ask it to create a new one. Recreating too fast is
// // exactly what causes hardware decoder instance counts to climb across
// // repeated reconnects on chipsets with a hard concurrency cap (e.g. Unisoc
// // hit C2_NO_MEMORY at 26 concurrent instances in the field).
// const PC_RECREATE_SETTLE_MS = 400;

// // Persisted per-device: once we've seen this device's hardware H264 decoder
// // fail, we remember it and start every future call in VP8-only mode
// // (software codec, works identically on every device) instead of gambling
// // on H264 again and risking the same crash.
// const CODEC_PREFERENCE_STORAGE_KEY = "videoCall_forceVp8Only_v1";

// export default function VideoCallScreen({ navigation, route }) {
//     useBackHandler(navigation, 'BroadcastHome');
//   const {
//     profile_image,
//     name,
//     incomingOffer,
//     isIncomingCall,
//     targetUserId,
//     isInitiator,
//     autoAnswerOnOffer,
//   } = route.params || {};

//   // ─── Refs ────────────────────────────────────────────────────
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const rtcConfig = useRef({ iceServers: [] }).current;
//   const isCallerRef = useRef(false);
//   const currentCallIdRef = useRef(null);
//   const callTimerRef = useRef(null);
//   const hasInitialOfferRef = useRef(false);
//   const isCleaningUpRef = useRef(false);
//   const isCallActiveRef = useRef(true);
//   const autoAnswerOnOfferRef = useRef(autoAnswerOnOffer || false);

//   const iceServersPromiseRef = useRef(null);
//   const codecPreferencePromiseRef = useRef(null);
//   const forceVp8OnlyRef = useRef(false);

//   const acceptInProgressRef = useRef(false);
//   const connectTimeoutRef = useRef(null);

//   const iceRecoveryTimeoutRef = useRef(null);
//   const iceRestartInFlightRef = useRef(false);

//   const videoStatsWatchdogRef = useRef(null);
//   const zeroPacketChecksRef = useRef(0);
//   const decoderStallChecksRef = useRef(0);

//   const ontrackWatchdogRef = useRef(null);

//   const recoveryTierRef = useRef(0);
//   const recoveryInFlightRef = useRef(false);

//   const endCallRef = useRef(null);
//   const acceptCallWithCallKeepRef = useRef(null);
//   const startCallWithCallKeepRef = useRef(null);

//   // ─── State ───────────────────────────────────────────────────
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);
//   const [showIncomingModal, setShowIncomingModal] = useState(false);
//   const [incomingSDP, setIncomingSDP] = useState(null);
//   const [callDuration, setCallDuration] = useState(0);
//   const [isCameraFront, setIsCameraFront] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
//   const [currentCallId, setCurrentCallId] = useState(null);
//   const [isRinging, setIsRinging] = useState(false);
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callStarted, setCallStarted] = useState(false);

//   const updateCallId = (id) => {
//     currentCallIdRef.current = id;
//     setCurrentCallId(id);
//   };

//   /////// this is only for ui draging the video stream 
//   const pipPosition = useRef({ x: Dimensions.get('window').width - 116, y: Platform.OS === 'ios' ? 100 : 70 });
//   const [pipVisible, setPipVisible] = useState(true);
//   const [pipPositionState, setPipPositionState] = useState({ 
//     x: Dimensions.get('window').width - 116, 
//     y: Platform.OS === 'ios' ? 100 : 70 
//   });

//   const handlePipDrag = (event, gestureState) => {
//     const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
//     const pipWidth = 100;
//     const pipHeight = 140;
    
//     let newX = pipPosition.current.x + gestureState.dx;
//     let newY = pipPosition.current.y + gestureState.dy;
    
//     newX = Math.max(0, Math.min(newX, screenWidth - pipWidth));
//     newY = Math.max(50, Math.min(newY, screenHeight - pipHeight - 150));
    
//     setPipPositionState({ x: newX, y: newY });
//   };

//   const handlePipDragEnd = () => {
//     pipPosition.current = { x: pipPositionState.x, y: pipPositionState.y };
//   };

//   const pipPanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
//       },
//       onPanResponderGrant: () => {},
//       onPanResponderMove: (event, gestureState) => {
//         handlePipDrag(event, gestureState);
//       },
//       onPanResponderRelease: () => {
//         handlePipDragEnd();
//       },
//     })
//   ).current;

//   const togglePipVisibility = () => {
//     setPipVisible(!pipVisible);
//   };

//   //// draging end==========================

//   const startAudioSession = () => {
//     InCallManager.start({ media: 'video' });
//     InCallManager.setSpeakerphoneOn(true);
//   };

//   const startRinging = () => {
//     setIsRinging(true);
//     InCallManager.startRingtone();
//   };

//   const stopRinging = () => {
//     setIsRinging(false);
//     InCallManager.stopRingtone();
//   };

//   const acceptCallWithCallKeep = useCallback(async () => {
//     console.log('[CallKeep] Accepting video call...');
//     if (acceptInProgressRef.current) return;
//     stopRinging();
//     isCallerRef.current = false;
//     const offer = incomingSDP || incomingOffer;
//     if (!offer?.sdp) {
//       console.error('[CallKeep] No valid offer to accept');
//       return;
//     }
//     await handleIncomingCall(offer);
//     if (currentCallIdRef.current) {
//       await CallKeepService.setCallConnected(currentCallIdRef.current);
//     }
//   }, [incomingSDP, incomingOffer]);

//   const startCallWithCallKeep = useCallback(async (phoneNumber, callUUID) => {
//     console.log('[CallKeep] Starting video call with:', phoneNumber, callUUID);
//     isCallerRef.current = true;
//     startAudioSession();
//     await createAndSendInitialOffer();
//     if (callUUID) {
//       await CallKeepService.setCallConnected(callUUID);
//     }
//   }, []);

//   useEffect(() => { endCallRef.current = endCall; });
//   useEffect(() => { acceptCallWithCallKeepRef.current = acceptCallWithCallKeep; }, [acceptCallWithCallKeep]);
//   useEffect(() => { startCallWithCallKeepRef.current = startCallWithCallKeep; }, [startCallWithCallKeep]);

//   useEffect(() => {
//     let mounted = true;

//     const setupCallKeepListeners = async () => {
//       const initialized = await CallKeepService.initialize();
//       if (!mounted || !initialized) return;

//       console.log('[CallKeep] Registering video call listeners...');

//       const onAnswerCall = (payload) => {
//         console.log('[CallKeep] answerCall:', payload);
//         if (!mounted) return;
//         if (typeof acceptCallWithCallKeepRef.current === 'function') {
//           acceptCallWithCallKeepRef.current();
//         }
//       };

//       const onEndCall = (payload) => {
//         console.log('[CallKeep] endCall:', payload);
//         if (!mounted) return;
//         if (typeof endCallRef.current === 'function') {
//           endCallRef.current(true);
//         }
//       };

//       const onStartCall = (payload) => {
//         console.log('[CallKeep] startCall:', payload);
//         if (!mounted) return;
//         const { handle, callUUID } = payload || {};
//         if (!handle) return;
//         if (typeof startCallWithCallKeepRef.current === 'function') {
//           startCallWithCallKeepRef.current(handle, callUUID);
//         }
//       };

//       const onDidActivateAudio = () => {
//         if (!mounted) return;
//         InCallManager.start({ media: 'video' });
//         InCallManager.setSpeakerphoneOn(true);
//       };

//       const onDidDeactivateAudio = () => {
//         if (!mounted) return;
//         InCallManager.stop();
//       };

//       const handlers = { onAnswerCall, onEndCall, onStartCall, onDidActivateAudio, onDidDeactivateAudio };
//       const allValid = Object.entries(handlers).every(([key, fn]) => {
//         if (typeof fn !== 'function') {
//           console.error(`[CallKeep] Handler ${key} is not a function`);
//           return false;
//         }
//         return true;
//       });

//       if (!allValid) return;

//       CallKeepService.addEventListener('answerCall', onAnswerCall);
//       CallKeepService.addEventListener('endCall', onEndCall);
//       CallKeepService.addEventListener('startCall', onStartCall);
//       CallKeepService.addEventListener('didActivateAudioSession', onDidActivateAudio);
//       CallKeepService.addEventListener('didDeactivateAudioSession', onDidDeactivateAudio);

//       console.log('[CallKeep] Video call listeners registered ✅');
//     };

//     const timer = setTimeout(() => setupCallKeepListeners(), 100);

//     return () => {
//       mounted = false;
//       clearTimeout(timer);
//       CallKeepService.removeAllListeners();
//     };
//   }, []);

//   useEffect(() => {
//     const subscription = DeviceEventEmitter.addListener(
//       'incomingCallFromNotification',
//       (callData) => {
//         console.log('[VideoCall] Incoming call from notification:', callData);
//         try { NativeModules.CallModule?.stopCallService(); } catch {}

//         if (callData.autoAccept) {
//           autoAnswerOnOfferRef.current = true;
//         }
//       }
//     );

//     return () => subscription.remove();
//   }, []);

//   useEffect(() => {
//     global.__onCallScreen = true;
//     return () => {
//       global.__onCallScreen = false;
//       InCallManager.stopRingtone();
//       InCallManager.stop({ busytone: '_BUNDLE_' });
//     };
//   }, []);

//   useEffect(() => {
//     InCallManager.stopRingtone();
//     InCallManager.start({ media: 'video' });
//     InCallManager.setSpeakerphoneOn(true);
//     return () => {
//       InCallManager.stop();
//       InCallManager.stopRingtone();
//     };
//   }, []);

//   useEffect(() => {
//     InCallManager.setKeepScreenOn(true);
//     return () => {
//       InCallManager.stop();
//       InCallManager.setKeepScreenOn(false);
//       stopRinging();
//     };
//   }, []);

//   useEffect(() => {
//     if (showIncomingModal) {
//       startRinging();
//     } else {
//       stopRinging();
//     }
//     return () => stopRinging();
//   }, [showIncomingModal]);

//   // Prefetch ICE servers AND this device's codec history the moment the
//   // screen mounts — for an incoming call this happens while the phone is
//   // still ringing, so by the time the user taps Accept both are already
//   // resolved and the handshake proceeds with zero extra latency.
//   useEffect(() => {
//     prefetchIceServers();
//     loadCodecPreference();
//     return () => {
//       clearConnectTimeout();
//       clearIceRecoveryTimeout();
//       clearVideoWatchdog();
//       clearOntrackWatchdog();
//     };
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//         ]);
//         return (
//           grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
//             PermissionsAndroid.RESULTS.GRANTED
//         );
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const getIceServers = async () => {
//     try {
//       console.log("[Xirsys] Fetching ICE servers...");
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
//       if (data?.v?.iceServers) {
//         const server = data.v.iceServers;
//         const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
//         iceServers = [{ urls, username: server.username, credential: server.credential }];
//       }
//       if (!iceServers.length) throw new Error("No ICE servers");
//       iceServers.push({ urls: "stun:stun.l.google.com:19302" });
//       rtcConfig.iceServers = iceServers;
//       console.log("✅ [ICE CONFIG READY]");
//     } catch (err) {
//       console.error("❌ [Xirsys Failed]:", err);
//       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//     }
//     rtcConfig.iceTransportPolicy = "all";
//   };

//   const prefetchIceServers = () => {
//     if (!iceServersPromiseRef.current) {
//       iceServersPromiseRef.current = getIceServers();
//     }
//     return iceServersPromiseRef.current;
//   };

//   // Reads this device's codec history (has hardware H264 decode ever failed
//   // here before?) and, if so, pre-sets forceVp8OnlyRef BEFORE the first
//   // offer/answer of this call is ever built — so a device that's already
//   // known to have a broken hardware decoder never even attempts H264 again.
//   const loadCodecPreference = () => {
//     if (!codecPreferencePromiseRef.current) {
//       codecPreferencePromiseRef.current = (async () => {
//         try {
//           const stored = await AsyncStorage.getItem(CODEC_PREFERENCE_STORAGE_KEY);
//           if (stored === "true") {
//             forceVp8OnlyRef.current = true;
//             console.log("[Codec] This device previously failed hardware H264 decode — starting call in VP8-only mode");
//           }
//         } catch (e) {}
//       })();
//     }
//     return codecPreferencePromiseRef.current;
//   };

//   const clearConnectTimeout = () => {
//     if (connectTimeoutRef.current) {
//       clearTimeout(connectTimeoutRef.current);
//       connectTimeoutRef.current = null;
//     }
//   };

//   const startConnectTimeout = () => {
//     clearConnectTimeout();
//     connectTimeoutRef.current = setTimeout(() => {
//       if (!isCallActiveRef.current) return;
//       if (remoteStream.current) return;

//       Alert.alert(
//         "Connection Problem",
//         "We're having trouble connecting this call. Check your internet connection.",
//         [
//           { text: "Keep Waiting", style: "cancel", onPress: () => startConnectTimeout() },
//           { text: "End Call", style: "destructive", onPress: () => endCall(true) },
//         ]
//       );
//     }, REMOTE_TRACK_TIMEOUT_MS);
//   };

//   const clearIceRecoveryTimeout = () => {
//     if (iceRecoveryTimeoutRef.current) {
//       clearTimeout(iceRecoveryTimeoutRef.current);
//       iceRecoveryTimeoutRef.current = null;
//     }
//   };

//   const scheduleIceRecovery = () => {
//     clearIceRecoveryTimeout();
//     iceRecoveryTimeoutRef.current = setTimeout(() => {
//       if (!isCallActiveRef.current || !pc.current) return;
//       const state = pc.current.connectionState || pc.current.iceConnectionState;
//       if (state === "connected" || state === "completed") return;
//       attemptIceRestart();
//     }, ICE_RECOVERY_GRACE_MS);
//   };

//   const attemptIceRestart = async () => {
//     if (!pc.current || iceRestartInFlightRef.current) return;
//     if (!isCallerRef.current) {
//       console.log("[ICE] Callee cannot restart ICE directly, waiting for caller's renegotiation");
//       return;
//     }
//     iceRestartInFlightRef.current = true;
//     try {
//       console.log("[ICE] Attempting ICE restart...");
//       const rawOffer = await pc.current.createOffer({ iceRestart: true });
//       const sdp = applyCodecForcing(rawOffer.sdp);
//       const finalOffer = new RTCSessionDescription({ type: rawOffer.type, sdp });
//       await pc.current.setLocalDescription(finalOffer);
//       sendMessage({
//         type: "offer",
//         offer: { type: finalOffer.type, sdp: finalOffer.sdp },
//         isVideoCall: true,
//         isRenegotiation: true,
//       });
//       console.log("[ICE] Restart offer sent");
//     } catch (err) {
//       console.warn("[ICE] Restart failed:", err?.message);
//     } finally {
//       iceRestartInFlightRef.current = false;
//     }
//   };

//   // ─── Codec forcing (hard) ───────────────────────────────────────
//   // Unlike preferReliableVideoCodec() below (a soft preference that still
//   // allows H264 if the remote side's negotiation picks it), this physically
//   // removes every video codec except VP8 from the SDP. It's the only real
//   // guarantee against a hardware decoder bug like Unisoc's C2_NO_MEMORY —
//   // a "preference" can still fall back to H264, a stripped SDP cannot.
//   const stripToVp8Only = (sdp) => {
//     const lines = sdp.split("\r\n");
//     const mLineIndex = lines.findIndex((l) => l.startsWith("m=video"));
//     if (mLineIndex === -1) return sdp;

//     const vp8Line = lines.find((l) => /^a=rtpmap:(\d+) VP8\/\d+/i.test(l));
//     if (!vp8Line) {
//       console.warn("[Codec] VP8 not present in this SDP — cannot force it, leaving unchanged");
//       return sdp;
//     }
//     const vp8Payload = vp8Line.match(/^a=rtpmap:(\d+) VP8\/\d+/i)[1];

//     const rtxPayloads = lines
//       .map((l) => l.match(new RegExp(`^a=fmtp:(\\d+) apt=${vp8Payload}\\b`)))
//       .filter(Boolean)
//       .map((m) => m[1]);

//     const keepPayloads = new Set([vp8Payload, ...rtxPayloads]);

//     const mLineParts = lines[mLineIndex].split(" ");
//     const header = mLineParts.slice(0, 3);
//     const originalPayloads = mLineParts.slice(3);
//     const newPayloads = originalPayloads.filter((p) => keepPayloads.has(p));

//     if (newPayloads.length === 0) {
//       console.warn("[Codec] Forced VP8 filter produced an empty payload list — aborting to avoid a broken SDP");
//       return sdp;
//     }

//     lines[mLineIndex] = [...header, ...newPayloads].join(" ");

//     let inVideoSection = false;
//     const filtered = lines.filter((line) => {
//       if (line.startsWith("m=video")) { inVideoSection = true; return true; }
//       if (line.startsWith("m=") && !line.startsWith("m=video")) { inVideoSection = false; return true; }
//       if (!inVideoSection) return true;

//       const pt = (
//         line.match(/^a=rtpmap:(\d+)/) ||
//         line.match(/^a=fmtp:(\d+)/) ||
//         line.match(/^a=rtcp-fb:(\d+)/) ||
//         []
//       )[1];

//       if (pt && !keepPayloads.has(pt)) return false;
//       return true;
//     });

//     return filtered.join("\r\n");
//   };

//   // Single choke point every offer/answer SDP passes through. No-op unless
//   // this device's forceVp8OnlyRef is currently set.
//   const applyCodecForcing = (sdp) => {
//     return forceVp8OnlyRef.current ? stripToVp8Only(sdp) : sdp;
//   };

//   // ─── Inbound-video watchdog + tiered recovery ladder ────────────
//   const clearVideoWatchdog = () => {
//     if (videoStatsWatchdogRef.current) {
//       clearInterval(videoStatsWatchdogRef.current);
//       videoStatsWatchdogRef.current = null;
//     }
//   };

//   const startVideoFrameWatchdog = () => {
//     clearVideoWatchdog();
//     zeroPacketChecksRef.current = 0;
//     decoderStallChecksRef.current = 0;

//     videoStatsWatchdogRef.current = setInterval(async () => {
//       if (!pc.current || !isCallActiveRef.current) return;
//       try {
//         const stats = await pc.current.getStats();
//         let framesDecoded = 0;
//         let packetsReceived = 0;
//         stats.forEach((report) => {
//           if (report.type === "inbound-rtp" && report.kind === "video") {
//             framesDecoded = report.framesDecoded || 0;
//             packetsReceived = report.packetsReceived || 0;
//           }
//         });
//         console.log(`[Watchdog] inbound video framesDecoded=${framesDecoded} packetsReceived=${packetsReceived}`);

//         if (framesDecoded > 0) {
//           clearVideoWatchdog();
//           return;
//         }

//         if (packetsReceived === 0) {
//           zeroPacketChecksRef.current += 1;
//           decoderStallChecksRef.current = 0;
//           console.warn(`[Watchdog] Zero inbound video packets (${zeroPacketChecksRef.current}/3) — possible one-way NAT block`);
//           if (zeroPacketChecksRef.current >= 3) {
//             clearVideoWatchdog();
//             await escalateRecovery(false);
//           }
//         } else {
//           zeroPacketChecksRef.current = 0;
//           decoderStallChecksRef.current += 1;
//           console.warn(`[Watchdog] Packets arriving but 0 frames decoded (${decoderStallChecksRef.current}/${DECODER_STALL_CHECKS_THRESHOLD}) — possible hardware decoder failure`);
//           if (decoderStallChecksRef.current >= DECODER_STALL_CHECKS_THRESHOLD) {
//             clearVideoWatchdog();
//             await escalateRecovery(true);
//           }
//         }
//       } catch (err) {
//         console.warn("[Watchdog] getStats failed:", err?.message);
//       }
//     }, 3000);
//   };

//   const clearOntrackWatchdog = () => {
//     if (ontrackWatchdogRef.current) {
//       clearTimeout(ontrackWatchdogRef.current);
//       ontrackWatchdogRef.current = null;
//     }
//   };

//   const scheduleOntrackWatchdog = () => {
//     clearOntrackWatchdog();
//     ontrackWatchdogRef.current = setTimeout(() => {
//       if (
//         isCallActiveRef.current &&
//         pc.current &&
//         pc.current.connectionState === "connected" &&
//         !remoteStream.current
//       ) {
//         console.warn("[Recovery] connected but ontrack never fired — escalating");
//         escalateRecovery(false);
//       }
//     }, ONTRACK_NEVER_FIRED_GRACE_MS);
//   };

//   // Tears down the current peer connection, optionally forces TURN-relay
//   // and/or VP8-only, waits a settle delay to let the native layer actually
//   // release the old decoder/encoder instances, then rebuilds and
//   // renegotiates over the existing signaling channel. Capped at
//   // MAX_RECOVERY_TIERS attempts so a genuinely broken call doesn't loop.
//   const escalateRecovery = async (forceVp8) => {
//     if (recoveryInFlightRef.current || !isCallActiveRef.current) return;
//     if (recoveryTierRef.current >= MAX_RECOVERY_TIERS) {
//       console.warn("[Recovery] Max automatic recovery attempts reached — leaving it to the connection-problem prompt");
//       return;
//     }

//     recoveryInFlightRef.current = true;
//     recoveryTierRef.current += 1;
//     const tier = recoveryTierRef.current;

//     rtcConfig.iceTransportPolicy = "relay";

//     if (forceVp8) {
//       forceVp8OnlyRef.current = true;
//       try {
//         await AsyncStorage.setItem(CODEC_PREFERENCE_STORAGE_KEY, "true");
//       } catch (e) {}
//       console.warn(`[Recovery] Tier ${tier}: forcing TURN relay + VP8-only (hardware decoder failure suspected)`);
//     } else {
//       console.warn(`[Recovery] Tier ${tier}: forcing TURN relay (possible one-way NAT)`);
//     }

//     try {
//       if (pc.current) {
//         try {
//           pc.current.onicecandidate = null;
//           pc.current.ontrack = null;
//           pc.current.onnegotiationneeded = null;
//           pc.current.onconnectionstatechange = null;
//           pc.current.oniceconnectionstatechange = null;
//           pc.current.close();
//         } catch (e) {}
//         pc.current = null;
//       }
//       remoteStream.current = null;
//       setRemoteURL(null);
//       setWebrtcReady(false);
//       queuedRemoteCandidates.current = [];
//       clearOntrackWatchdog();
//       clearVideoWatchdog();

//       await new Promise((resolve) => setTimeout(resolve, PC_RECREATE_SETTLE_MS));
//       if (!isCallActiveRef.current) return;

//       await ensurePeerConnection();

//       if (isCallerRef.current) {
//         attachLocalTracksToPeer();
//         const rawOffer = await pc.current.createOffer();
//         const sdp = applyCodecForcing(rawOffer.sdp);
//         const finalOffer = new RTCSessionDescription({ type: rawOffer.type, sdp });
//         await pc.current.setLocalDescription(finalOffer);
//         sendMessage({
//           type: "offer",
//           offer: { type: finalOffer.type, sdp: finalOffer.sdp },
//           isVideoCall: true,
//           isRenegotiation: true,
//         });
//         console.log(`[Recovery] Tier ${tier} offer sent (relay-only, vp8Only=${forceVp8OnlyRef.current})`);
//       }

//       startConnectTimeout();
//     } catch (err) {
//       console.error("[Recovery] Escalation failed:", err?.message);
//     } finally {
//       recoveryInFlightRef.current = false;
//     }
//   };

//   const preferReliableVideoCodec = () => {
//     if (!pc.current || typeof pc.current.getTransceivers !== "function") return;
//     try {
//       const transceivers = pc.current.getTransceivers();
//       transceivers.forEach((transceiver) => {
//         const kind = transceiver.receiver?.track?.kind || transceiver.sender?.track?.kind;
//         if (kind !== "video") return;
//         if (typeof transceiver.setCodecPreferences !== "function") return;
//         if (typeof RTCPeerConnection.getCapabilities !== "function") return;

//         const capabilities = RTCPeerConnection.getCapabilities("video");
//         const codecs = capabilities?.codecs || [];
//         if (!codecs.length) return;

//         const vp8 = codecs.filter((c) => /VP8/i.test(c.mimeType));
//         const others = codecs.filter((c) => !/VP8/i.test(c.mimeType));
//         if (!vp8.length) return;

//         transceiver.setCodecPreferences([...vp8, ...others]);
//         console.log("[WebRTC] Preferred VP8 for video transceiver (hardware-decoder-safe)");
//       });
//     } catch (err) {
//       console.log("[WebRTC] Codec preference not available on this build, skipping:", err?.message);
//     }
//   };

//   const ensurePeerConnection = async () => {
//   if (pc.current) return;
//   await prefetchIceServers();

//   pc.current = new RTCPeerConnection(rtcConfig);
//   console.log("[WebRTC] RTCPeerConnection created");

//   pc.current.onnegotiationneeded = () => {
//     console.log("[WebRTC] onnegotiationneeded, signalingState:", pc.current?.signalingState);
//   };

//   pc.current.onicecandidate = (evt) => {
//     if (evt.candidate) {
//       const cand = evt.candidate.candidate;
//       if (cand.includes("typ relay")) console.log("🟢 [TURN WORKING]", cand);
//       else if (cand.includes("typ srflx")) console.log("🟡 [STUN WORKING]", cand);
//       sendMessage({ type: "candidate", candidate: evt.candidate });
//     } else {
//       console.log("[ICE] Gathering finished");
//     }
//   };

//   pc.current.ontrack = (evt) => {
//     console.log("========= TRACK RECEIVED =========");
//     console.log("Track Kind:", evt.track.kind);
//     console.log("Track enabled:", evt.track.enabled);
//     console.log("Track readyState:", evt.track.readyState);

//     try { evt.track.enabled = true; } catch (e) {}

//     let stream = evt.streams && evt.streams[0];

//     if (!stream) {
//       console.warn("[WebRTC] Track received with no stream — constructing one manually");
//       try {
//         stream = remoteStream.current instanceof MediaStream
//           ? remoteStream.current
//           : new MediaStream();
//         if (!stream.getTracks().some((t) => t.id === evt.track.id)) {
//           stream.addTrack(evt.track);
//         }
//       } catch (e) {
//         console.error("[WebRTC] Failed to construct fallback remote stream:", e?.message);
//       }
//     }

//     if (stream) {
//       remoteStream.current = stream;
//       clearOntrackWatchdog();

//       const tracks = stream.getTracks();
//       console.log(`Remote stream now has ${tracks.length} tracks:`,
//         tracks.map((t) => ({ kind: t.kind, enabled: t.enabled }))
//       );

//       try {
//         const url = stream.toURL();
//         setRemoteURL(url);
//         console.log("remote_stream url:", url);
//       } catch (e) {
//         console.error("Error getting remote URL:", e);
//       }

//       setWebrtcReady(true);
//       setCallAccepted(true);
//       clearConnectTimeout();
//       clearIceRecoveryTimeout();
//       InCallManager.start({ media: 'video' });
//       InCallManager.setSpeakerphoneOn(true);

//       startVideoFrameWatchdog();
//     } else {
//       console.warn("[WebRTC] Track received but no stream could be established!");
//     }
//   };

//   pc.current.onconnectionstatechange = async () => {
//     if (!pc.current) return;
//     const state = pc.current.connectionState;
//     console.log("[WebRTC] connectionState =>", state);

//     if (state === "connected") {
//       clearIceRecoveryTimeout();
//       console.log("VIDEO CALL CONNECTED");
//       try {
//         const stats = await pc.current.getStats();
//         let negotiatedVideoCodec = null;
//         stats.forEach((report) => {
//           if (report.type === "candidate-pair" && report.state === "succeeded") {
//             const local = stats.get(report.localCandidateId);
//             const remote = stats.get(report.remoteCandidateId);
//             if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
//               console.log("🟢 USING TURN (Xirsys)");
//             } else if (local?.candidateType === "srflx") {
//               console.log("🟡 USING STUN");
//             } else {
//               console.log("⚪ USING LOCAL");
//             }
//           }
//           if (report.type === "codec" && report.mimeType?.toLowerCase().includes("video")) {
//             negotiatedVideoCodec = report.mimeType;
//           }
//         });
//         if (negotiatedVideoCodec) {
//           console.log("📊 Negotiated video codec:", negotiatedVideoCodec);
//         }
//       } catch (err) {
//         console.warn("[WebRTC] getStats failed:", err);
//       }

//       if (!remoteStream.current) {
//         scheduleOntrackWatchdog();
//       }
//     }

//     if (state === "disconnected") {
//       console.warn("[WebRTC] Connection disconnected — watching for self-recovery");
//       scheduleIceRecovery();
//     }

//     if (state === "failed") {
//       console.warn("VIDEO CONNECTION FAILED");
//       clearIceRecoveryTimeout();
//       attemptIceRestart();
//       saveCallToHistory({
//         contact: { name, profileImage: profile_image, userId: targetUserId },
//         direction: isInitiator ? 'outgoing' : 'incoming',
//         isVideoCall: true,
//         status: 'failed',
//         duration: callDuration,
//       });
//     }
//   };

//   pc.current.oniceconnectionstatechange = () => {
//     if (!pc.current) return;
//     console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
//   };
// };

//   // Resolution is deliberately capped rather than left unconstrained: a
//   // smaller frame size means a smaller decoder memory footprint on the
//   // REMOTE side, which matters directly for chipsets with a hard cap on
//   // concurrent decoder memory (like the Unisoc bug this file works around).
//   // If this device has already been flagged as decoder-troubled, we go
//   // even more conservative (480p) to leave extra headroom.
//   const getLocalStream = async () => {
//     if (localStream.current) {
//       const videoTrack = localStream.current.getVideoTracks()[0];
//       if (videoTrack && !videoTrack.enabled) {
//         videoTrack.enabled = true;
//         console.log("[Local] Re-enabled video track");
//       }
//       return true;
//     }

//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       Alert.alert("Permission denied", "Cannot access camera or microphone.");
//       return false;
//     }

//     const useSaferResolution = forceVp8OnlyRef.current;
//     const targetWidth = useSaferResolution ? 640 : 1280;
//     const targetHeight = useSaferResolution ? 480 : 720;

//     try {
//       const s = await mediaDevices.getUserMedia({
//         audio: true,
//         video: {
//           facingMode: isCameraFront ? "user" : "environment",
//           width: { ideal: targetWidth, max: targetWidth },
//           height: { ideal: targetHeight, max: targetHeight },
//           frameRate: { ideal: 30, max: 30 },
//         },
//       });

//       const videoTrack = s.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = true;
//         console.log("[Local] Video track enabled:", videoTrack.enabled, `target=${targetWidth}x${targetHeight}`);
//       }

//       localStream.current = s;
//       try { setLocalURL(s.toURL()); } catch {}
//       return true;
//     } catch (e) {
//       Alert.alert("Error", "Failed to get camera/mic: " + e.message);
//       return false;
//     }
//   };

//   // CRITICAL ORDERING RULE: for the side making the offer, call this BEFORE
//   // createOffer(). For the side answering an offer, call this AFTER
//   // setRemoteDescription(offer) — never before. Attaching tracks to a fresh
//   // peer connection before it has processed a remote offer creates new
//   // transceivers that don't reliably bind to the offer's m-lines on
//   // react-native-webrtc.
//   const attachLocalTracksToPeer = () => {
//     if (!pc.current || !localStream.current) return;
//     const existingTracks = pc.current.getSenders().map((s) => s.track);
//     localStream.current.getTracks().forEach((track) => {
//       if (!existingTracks.includes(track)) {
//         pc.current.addTrack(track, localStream.current);
//         console.log(`[Local] Attached ${track.kind} track to peer connection`);
//       }
//     });
//     preferReliableVideoCodec();
//   };

//   const prepareConnectionAndMediaOnly = async () => {
//     const [, mediaOk] = await Promise.all([
//       ensurePeerConnection(),
//       getLocalStream(),
//     ]);
//     return !!(mediaOk && pc.current);
//   };

//   const drainQueuedCandidates = async () => {
//     if (!pc.current || !pc.current.remoteDescription) return;
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err?.message);
//       }
//     }
//   };

//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing video peer connection");
//     isCleaningUpRef.current = true;
//     isCallActiveRef.current = false;
//     clearConnectTimeout();
//     clearIceRecoveryTimeout();
//     clearVideoWatchdog();
//     clearOntrackWatchdog();
//     recoveryTierRef.current = 0;
//     recoveryInFlightRef.current = false;
//     zeroPacketChecksRef.current = 0;
//     decoderStallChecksRef.current = 0;
//     setCallAccepted(false);
//     setCallStarted(false);

//     try {
//       if (pc.current) {
//         pc.current.onicecandidate = null;
//         pc.current.ontrack = null;
//         pc.current.onnegotiationneeded = null;
//         pc.current.onconnectionstatechange = null;
//         pc.current.oniceconnectionstatechange = null;
//         pc.current.close();
//       }
//     } catch (e) {}
//     pc.current = null;

//     try {
//       if (localStream.current) {
//         localStream.current.getTracks().forEach((t) => t.stop());
//       }
//     } catch (e) {}
//     localStream.current = null;

//     try {
//       if (remoteStream.current) {
//         remoteStream.current.getTracks().forEach((t) => t.stop());
//       }
//     } catch (e) {}
//     remoteStream.current = null;

//     queuedRemoteCandidates.current = [];
//     hasInitialOfferRef.current = false;
//     acceptInProgressRef.current = false;
//     iceRestartInFlightRef.current = false;

//     try { InCallManager.stop(); } catch {}

//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCameraFront(true);
//     setIsMuted(false);
//     setIsSpeakerOn(false);
//     isCleaningUpRef.current = false;
//   };

//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[WS] Sending:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     } else {
//       console.warn("[WS] Cannot send, state:", ws.current?.readyState);
//     }
//   };

//   const connectSignaling = async () => {
//     const token = await AsyncStorage.getItem("userToken");
//     const userDataRaw = await AsyncStorage.getItem("userData");
//     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
//     const currentUserId = userData?.id;

//     let roomId;
//     if (isInitiator && targetUserId) {
//       roomId = `user-${targetUserId}`;
//     } else if (autoAnswerOnOffer && targetUserId) {
//       roomId = `user-${currentUserId}`;
//       console.log('[AutoAnswer] Connecting to our room:', roomId);
//     } else if (currentUserId) {
//       roomId = `user-${currentUserId}`;
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

//       await loadCodecPreference();

//       await prepareConnectionAndMediaOnly();

//       if (isInitiator && targetUserId) {
//         isCallerRef.current = true;
//         setCallStarted(true);
//         startAudioSession();
//         await createAndSendInitialOffer();
//       }

//       if (!isInitiator && isIncomingCall && incomingOffer && !autoAnswerOnOffer) {
//         await handleIncomingCall(incomingOffer);
//       }
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try { data = JSON.parse(evt.data); } catch { return; }

//       console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation);

//       if (!isCallActiveRef.current && data?.type !== "call-ended") {
//         console.warn("[WS] Ignoring after call ended:", data?.type);
//         return;
//       }

//       if (data.type === 'offer' && !data.isRenegotiation && isCallerRef.current) {
//         console.warn('[WS] Ignoring own offer echo — we are the caller');
//         return;
//       }
//       if (data.type === 'answer' && !isCallerRef.current && !data.isRenegotiation) {
//         console.warn('[WS] Ignoring answer — we are the callee');
//         return;
//       }

//       switch (data.type) {

//         case "offer": {
//           if (data.isRenegotiation) {
//             await handleRenegotiationOffer(data.offer);
//             break;
//           }

//           if (isCallerRef.current) break;

//           const offerData = data.offer;
//           if (!offerData?.sdp) {
//             console.error("[WS] Offer missing SDP");
//             break;
//           }

//           console.log("[WS] Valid video offer, SDP length:", offerData.sdp.length);

//           if (autoAnswerOnOfferRef.current) {
//             console.log('[AutoAnswer] Auto-answering video offer');
//             autoAnswerOnOfferRef.current = false;
//             isCallerRef.current = false;
//             startAudioSession();
//             await handleIncomingCall(offerData);
//             if (currentCallIdRef.current) {
//               await CallKeepService.setCallConnected(currentCallIdRef.current);
//             }
//           } else {
//             const incomingCallId = `call_${Date.now()}`;
//             updateCallId(incomingCallId);
//             setIncomingSDP(offerData);

//             await CallKeepService.displayIncomingCall({
//               callId: incomingCallId,
//               callerName: offerData.callerInfo?.name || name || 'Unknown',
//               callerId: offerData.callerId || targetUserId || '',
//               isVideo: true,
//               roomId: offerData.roomId || '',
//             });

//             setShowIncomingModal(true);
//           }
//           break;
//         }

//         case "answer": {
//           if (!isCallerRef.current || !pc.current) break;
//           setCallAccepted(true);
//           if (pc.current.signalingState === "have-local-offer") {
//             try {
//               await pc.current.setRemoteDescription(
//                 new RTCSessionDescription(data.answer)
//               );
//               await drainQueuedCandidates();
//               startConnectTimeout();
//             } catch (e) {
//               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message);
//             }
//           }
//           break;
//         }

//         case "candidate": {
//           if (!pc.current || !pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//             } catch (e) {
//               console.warn("[WebRTC] addIceCandidate error:", e?.message);
//             }
//           }
//           break;
//         }

//         case "call-ended": {
//           Alert.alert("Call Ended", "Your call partner has disconnected");
//           endCall(false);
//           break;
//         }

//         case "call-rejected": {
//           Alert.alert("Call Rejected", "The recipient declined your call");
//           await saveCallToHistory({
//             contact: { name, profileImage: profile_image, userId: targetUserId },
//             direction: 'outgoing',
//             isVideoCall: true,
//             status: 'rejected',
//             duration: 0,
//           });
//           endCall(false);
//           break;
//         }

//         case "call-missed": {
//           if (!isInitiator) {
//             await saveCallToHistory({
//               contact: { name, profileImage: profile_image, userId: targetUserId },
//               direction: 'incoming',
//               isVideoCall: true,
//               status: 'missed',
//               duration: 0,
//             });
//           }
//           break;
//         }

//         default:
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       setWsConnected(false);
//       if (!isCleaningUpRef.current) cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err?.message);
//     };
//   };

//   const handleRenegotiationOffer = async (offer) => {
//     try {
//       if (!pc.current) {
//         await ensurePeerConnection();
//       }
//       if (!localStream.current) {
//         await getLocalStream();
//       }
//       if (!pc.current || pc.current.signalingState === "closed") return;

//       console.log("[WebRTC] Renegotiation, signalingState:", pc.current.signalingState);
//       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//       await drainQueuedCandidates();

//       attachLocalTracksToPeer();

//       const rawAnswer = await pc.current.createAnswer();
//       const sdp = applyCodecForcing(rawAnswer.sdp);
//       const finalAnswer = new RTCSessionDescription({ type: rawAnswer.type, sdp });
//       await pc.current.setLocalDescription(finalAnswer);

//       sendMessage({ type: "answer", answer: { type: finalAnswer.type, sdp: finalAnswer.sdp }, isVideoCall: true, isRenegotiation: true });
//       console.log("[WebRTC] Renegotiation answer sent");
//     } catch (error) {
//       console.error("[WebRTC] Renegotiation failed:", error);
//     }
//   };

//   const saveCallToHistory = async (callDetails) => {
//     try {
//       const existingHistory = await AsyncStorage.getItem('callHistory');
//       const history = existingHistory ? JSON.parse(existingHistory) : [];
//       const newCall = {
//         id: Date.now().toString(),
//         timestamp: Date.now(),
//         contact: {
//           name: callDetails.contact.name,
//           profileImage: callDetails.contact.profileImage,
//           userId: callDetails.contact.userId,
//         },
//         direction: callDetails.direction,
//         isVideoCall: true,
//         status: callDetails.status,
//         duration: callDetails.duration || 0,
//       };
//       history.unshift(newCall);
//       await AsyncStorage.setItem('callHistory', JSON.stringify(history.slice(0, 100)));
//       console.log('[CallHistory] Saved:', callDetails.status);
//     } catch (error) {
//       console.error('[CallHistory] Error:', error);
//     }
//   };

//   const createAndSendInitialOffer = async () => {
//     if (hasInitialOfferRef.current) return;

//     console.log("[VideoCall] Creating initial offer...");
//     await loadCodecPreference();
//     const ok = await prepareConnectionAndMediaOnly();
//     if (!ok || !pc.current) return;

//     attachLocalTracksToPeer();

//     try {
//       const userDataRaw = await AsyncStorage.getItem("userData");
//       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
//       const currentUserId = userData?.id;

//       if (!currentUserId) {
//         console.error("[VideoCall] No current user ID");
//         return;
//       }

//       const callerInfo = {
//         profileImage: userData.profile_picture || userData.profile_image || "",
//         name: userData.name || "Caller",
//       };

//       const rawOffer = await pc.current.createOffer();
//       const sdp = applyCodecForcing(rawOffer.sdp);
//       const finalOffer = new RTCSessionDescription({ type: rawOffer.type, sdp });
//       await pc.current.setLocalDescription(finalOffer);

//       console.log("[VideoCall] Offer SDP length:", finalOffer.sdp?.length, "vp8Only:", forceVp8OnlyRef.current);

//       sendMessage({
//         type: "new_call",
//         receiver_id: targetUserId,
//         sender_id: currentUserId,
//         caller_name: callerInfo.name,
//         call_type: "video",
//         room_id: `call_${currentUserId}_${targetUserId}`,
//         offer: {
//           type: finalOffer.type,
//           sdp: finalOffer.sdp,
//           targetUserId,
//           callerId: currentUserId,
//           callerInfo,
//           isVideoCall: true,
//         },
//       });

//       hasInitialOfferRef.current = true;
//       console.log("[VideoCall] Initial offer sent ✅");
//     } catch (e) {
//       console.error("[VideoCall] createOffer failed:", e?.message);
//     }
//   };

// const handleIncomingCall = async (offer) => {
//   if (acceptInProgressRef.current) return;
//   acceptInProgressRef.current = true;

//   try {
//     console.log("[Incoming] Starting...");

//     if (!currentCallIdRef.current) {
//       const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
//       updateCallId(newCallId);
//     }

//     if (!offer?.sdp) {
//       console.error("[VideoCall] Missing SDP in offer");
//       Alert.alert("Error", "Invalid video call offer.");
//       acceptInProgressRef.current = false;
//       rejectCall();
//       return;
//     }

//     setShowIncomingModal(false);
//     setIncomingSDP(null);
//     setCallAccepted(true);
//     try { NativeModules.CallModule?.stopCallService(); } catch {}

//     await loadCodecPreference();

//     const ok = await prepareConnectionAndMediaOnly();
//     if (!ok || !pc.current) {
//       acceptInProgressRef.current = false;
//       rejectCall();
//       return;
//     }

//     await pc.current.setRemoteDescription(
//       new RTCSessionDescription({ 
//         type: offer.type || 'offer', 
//         sdp: offer.sdp 
//       })
//     );
    
//     await drainQueuedCandidates();

//     attachLocalTracksToPeer();

//     const rawAnswer = await pc.current.createAnswer({
//       offerToReceiveAudio: true,
//       offerToReceiveVideo: true,
//     });
//     const answerSdp = applyCodecForcing(rawAnswer.sdp);
//     const finalAnswer = new RTCSessionDescription({ type: rawAnswer.type, sdp: answerSdp });

//     await pc.current.setLocalDescription(finalAnswer);

//     console.log("Local video tracks:", localStream.current.getVideoTracks().length);
//     console.log("Local audio tracks:", localStream.current.getAudioTracks().length);
//     console.log("vp8Only:", forceVp8OnlyRef.current);
//     console.log("Peer senders:", pc.current.getSenders().map(sender => ({
//       kind: sender.track?.kind,
//       enabled: sender.track?.enabled,
//       readyState: sender.track?.readyState
//     })));

//     sendMessage({
//       type: "answer",
//       answer: { type: finalAnswer.type, sdp: finalAnswer.sdp },
//       isVideoCall: true,
//     });

//     startConnectTimeout();

//     console.log("[VideoCall] Answer sent, waiting for remote track...");
    
//   } catch (error) {
//     console.error("[VideoCall] handleIncomingCall error:", error?.message);
//     Alert.alert("Error", "Failed to accept video call: " + (error?.message || "Unknown"));
//     rejectCall();
//   } finally {
//     acceptInProgressRef.current = false;
//   }
// };


//   useEffect(() => {
//     connectSignaling();
//     return () => { endCall(false); };
//   }, []);

//   useEffect(() => {
//     if (webrtcReady && callAccepted) {
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
//     return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
//   }, [webrtcReady, callAccepted]);

//   const acceptCall = async () => {
//      forceStopAllCallAudio(currentCallIdRef.current);
//     if (acceptInProgressRef.current) return;
//     stopRinging();
//     isCallerRef.current = false;
//     const offer = incomingSDP;
//     if (!offer?.sdp) {
//       Alert.alert("Error", "Invalid video call offer.");
//       return;
//     }
//     startAudioSession();
//     await handleIncomingCall(offer);
//   };

//   const startCall = async () => {
//     isCallerRef.current = true;
//     setCallStarted(true);
//     const newCallId = `call_${Date.now()}_${targetUserId}`;
//     updateCallId(newCallId);
//     startAudioSession();
//     await createAndSendInitialOffer();
//   };

//   const endCall = useCallback(async (notify = true) => {
//      forceStopAllCallAudio(currentCallIdRef.current);
//   console.log("[VideoCall] Ending call...");
  
//   try { InCallManager.stopRingtone(); } catch (e) {}
  
//   isCallActiveRef.current = false;
//   clearConnectTimeout();
//   clearIceRecoveryTimeout();
//   clearVideoWatchdog();
//   clearOntrackWatchdog();

//   setWebrtcReady(false);
//   setLocalURL(null);
//   setRemoteURL(null);
//   setCallDuration(0);
//   setCurrentCallId(null);
//   setShowIncomingModal(false);
//   setIncomingSDP(null);

//   try {
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//     }
//   } catch (e) {}
//   try {
//     if (remoteStream.current) {
//       remoteStream.current.getTracks().forEach((t) => t.stop());
//     }
//   } catch (e) {}

//   setTimeout(() => {
//     try {
//       if (navigation.canGoBack()) {
//         navigation.goBack();
//       } else {
//         navigation.navigate("PHome");
//       }
//     } catch (e) {
//       navigation.navigate("PHome");
//     }
//   }, 0);

//   const cid = currentCallIdRef.current || currentCallId;
  
//   setTimeout(() => {
//     if (cid) {
//       try { 
//         CallKeepService.endCall(cid).catch(() => {}); 
//       } catch (e) {}
//     }

//     try { 
//       NativeModules.CallModule?.stopCallService(); 
//     } catch (e) {}

//     if (notify && ws.current?.readyState === WebSocket.OPEN) {
//       try { 
//         ws.current.send(JSON.stringify({ type: "call-ended" })); 
//       } catch (e) {}
//     }

//     try {
//       if (ws.current) {
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//         ws.current = null;
//       }
//     } catch (e) {}

//     try {
//       InCallManager.stop();
//     } catch (e) {}

//     try {
//       cleanupPeerConnection();
//     } catch (e) {}

//     console.log("[VideoCall] Cleanup complete");
//   }, 0);

//   const callDetails = {
//     contact: {
//       name: name || 'Unknown',
//       profileImage: profile_image || '',
//       userId: targetUserId || 'unknown',
//     },
//     direction: isInitiator ? 'outgoing' : 'incoming',
//     isVideoCall: true,
//     status: webrtcReady ? 'ended' : 'missed',
//     duration: callDuration || 0,
//   };

//   saveCallToHistory(callDetails).catch(() => {});

// }, [navigation, isInitiator, name, profile_image, targetUserId, webrtcReady, callDuration, currentCallId]);



//   const rejectCall = async () => {
//      forceStopAllCallAudio(currentCallIdRef.current);
//     stopRinging();
//     sendMessage({ type: "call-rejected" });
//     await saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: 'incoming',
//       isVideoCall: true,
//       status: 'rejected',
//       duration: 0,
//     });
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
//     navigation.goBack();
//   };

//   const switchCamera = async () => {
//     if (!localStream.current) return;
//     const videoTrack = localStream.current.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack._switchCamera();
//       setIsCameraFront(!isCameraFront);
//     }
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

//   const toggleSpeaker = () => {
//     const newState = !isSpeakerOn;
//     InCallManager.setSpeakerphoneOn(newState);
//     setIsSpeakerOn(newState);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getConnectingStatusText = () => {
//     if (!wsConnected) return "Connecting...";
//     if (callAccepted) return "Please wait, connecting...";
//     if (isInitiator) return "Calling...";
//     if (autoAnswerOnOffer) return "Connecting to video call...";
//     return "Incoming video call...";
//   };

//   const showConnectingSpinner = wsConnected && callAccepted && !webrtcReady;

//   return (
  
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {(webrtcReady && callAccepted) ? (
//         <View style={styles.callScreen}>
//           {remoteURL ? (
//             <View style={styles.videoContainer}>
//               <>
//                {console.log("RTCView rendering with:", remoteURL)}
//               <RTCView 
//                 streamURL={remoteURL} 
//                 style={styles.remoteVideo} 
//                 objectFit="cover" 
//               />
//               </>

//               {localURL && pipVisible && (
//                 <View
//                   style={[
//                     styles.localVideoWrapper,
//                     {
//                       left: pipPositionState.x,
//                       top: pipPositionState.y,
//                     }
//                   ]}
//                   {...pipPanResponder.panHandlers}
//                 >
//                   <View style={styles.pipContainer}>
//                     <RTCView 
//                       streamURL={localURL} 
//                       style={styles.localVideoStream} 
//                       objectFit="cover" 
//                       mirror={isCameraFront}
//                     />
                    
//                     <TouchableOpacity 
//                       style={styles.pipCloseButton}
//                       onPress={togglePipVisibility}
//                       activeOpacity={0.7}
//                     >
//                       <Icon name="close" size={16} color="white" />
//                     </TouchableOpacity>

//                     <TouchableOpacity 
//                       style={styles.pipSwitchButton}
//                       onPress={switchCamera}
//                       activeOpacity={0.7}
//                     >
//                       <Icon name="flip-camera-ios" size={16} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}

//               {!pipVisible && localURL && (
//                 <TouchableOpacity 
//                   style={styles.showPipButton}
//                   onPress={togglePipVisibility}
//                   activeOpacity={0.7}
//                 >
//                   <Icon name="videocam" size={20} color="white" />
//                 </TouchableOpacity>
//               )}

//               <View style={styles.topBar}>
//                 <View style={styles.topBarContent}>
//                   <Text style={styles.callerNameText} numberOfLines={1}>
//                     {name || 'Unknown'}
//                   </Text>
//                   <Text style={styles.callDurationText}>
//                     {formatTime(callDuration)}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.bottomControls}>
//                 <View style={styles.controlsRow}>
//                   <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={toggleMute}
//                     activeOpacity={0.6}
//                   >
//                     <Icon 
//                       name={isMuted ? "mic-off" : "mic"} 
//                       size={22} 
//                       color="white" 
//                     />
//                   </TouchableOpacity>

//                   <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={toggleSpeaker}
//                     activeOpacity={0.6}
//                   >
//                     <Icon 
//                       name={isSpeakerOn ? "volume-up" : "volume-off"} 
//                       size={22} 
//                       color="white" 
//                     />
//                   </TouchableOpacity>

//                   {/* <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={togglePipVisibility}
//                     activeOpacity={0.6}
//                   >
//                     <Icon 
//                       name={pipVisible ? "videocam" : "videocam-off"} 
//                       size={22} 
//                       color="white" 
//                     />
//                   </TouchableOpacity> */}

//                   <TouchableOpacity 
//                     style={styles.controlBtn} 
//                     onPress={switchCamera}
//                     activeOpacity={0.6}
//                   >
//                     <Icon name="flip-camera-ios" size={22} color="white" />
//                   </TouchableOpacity>

//                   <TouchableOpacity 
//                     style={styles.endCallBtn} 
//                     onPress={() => endCall(true)}
//                     activeOpacity={0.6}
//                   >
//                     <Icon name="call-end" size={26} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           ) : (
//             <View style={styles.loadingContainer}>
//               <View style={styles.avatarContainer}>
//                 <View style={styles.avatar}>
//                   <Image
//                     source={{ uri: `${profile_image}` }}
//                     style={styles.avatarImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//                 <Text style={styles.callerName}>{name}</Text>
//                 <ActivityIndicator size="small" color="#fff" style={{ marginTop: 10 }} />
//                 <Text style={styles.callTypeText}>
//                   Connecting Video • {formatTime(callDuration)}
//                 </Text>
//               </View>
//             </View>
//           )}
//         </View>
//       ) : (
//         <View style={styles.connectingScreen}>
//           <View style={styles.connectingContent}>
//             <View style={styles.connectingAvatarContainer}>
//               <Image
//                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//                 style={styles.connectingAvatar}
//                 resizeMode="cover"
//               />
//             </View>

//             <Text style={styles.connectingName}>{name || 'Unknown'}</Text>

//             <View style={styles.connectingStatusRow}>
//               {showConnectingSpinner && (
//                 <ActivityIndicator
//                   size="small"
//                   color="rgba(255,255,255,0.8)"
//                   style={{ marginBottom: 10 }}
//                 />
//               )}
//               <Text style={styles.connectingStatusText}>
//                 {getConnectingStatusText()}
//               </Text>
//             </View>

//             {!showIncomingModal && (
//               <TouchableOpacity 
//                 style={styles.connectingEndBtn} 
//                 onPress={() => endCall(true)}
//                 activeOpacity={0.6}
//               >
//                 <View style={styles.connectingEndIcon}>
//                   <Icon name="call-end" size={26} color="white" />
//                 </View>
//                 <Text style={styles.connectingEndText}>Cancel</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}

//       {!isInitiator && (
//         <Modal
//           visible={showIncomingModal}
//           transparent
//           animationType="fade"
//           onRequestClose={rejectCall}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.incomingCallText}>Incoming Video Call</Text>
//                 <View style={styles.callerInfo}>
//                   <View style={styles.modalAvatar}>
//                     <Image
//                       source={{ uri: `${profile_image}` }}
//                       style={styles.modalAvatarImage}
//                       resizeMode="cover"
//                     />
//                   </View>
//                   <Text style={styles.modalCallerName}>{name}</Text>
//                   <Text style={styles.modalCallType}>Video Call</Text>
//                 </View>
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
//                     <View style={styles.rejectButtonInner}>
//                       <Icon name="call-end" size={30} color="white" />
//                     </View>
//                     <Text style={styles.buttonText}>Decline</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
//                     <View style={styles.acceptButtonInner}>
//                       <Icon name="videocam" size={30} color="white" />
//                     </View>
//                     <Text style={styles.buttonText}>Accept</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   callScreen: { flex: 1, backgroundColor: '#000' },
//   videoContainer: { flex: 1, backgroundColor: '#000' },
//   remoteVideo: { flex: 1, backgroundColor: '#000' },
//   localVideoWrapper: { position: 'absolute', width: 100, height: 140, zIndex: 20 },
//   pipContainer: {
//     width: 100,
//     height: 140,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.8)',
//     backgroundColor: '#111',
//   },
//   localVideoStream: { width: '100%', height: '100%' },
//   pipCloseButton: {
//     position: 'absolute', top: 4, right: 4,
//     width: 22, height: 22, borderRadius: 11,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   pipSwitchButton: {
//     position: 'absolute', bottom: 4, right: 4,
//     width: 22, height: 22, borderRadius: 11,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   showPipButton: {
//     position: 'absolute', top: 70, right: 16,
//     width: 40, height: 40, borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     alignItems: 'center', justifyContent: 'center',
//     zIndex: 20,
//   },
//   topBar: {
//     position: 'absolute', top: 0, left: 0, right: 0,
//     paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   topBarContent: { alignItems: 'center' },
//   callerNameText: { color: '#fff', fontSize: 18, fontWeight: '600' },
//   callDurationText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
//   bottomControls: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     paddingBottom: 40, paddingTop: 20,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   controlsRow: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
//   },
//   controlBtn: {
//     width: 52, height: 52, borderRadius: 26,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   endCallBtn: {
//     width: 60, height: 60, borderRadius: 30,
//     backgroundColor: '#ff3b30',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
//   avatarContainer: { alignItems: 'center' },
//   avatar: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: '#333' },
//   avatarImage: { width: '100%', height: '100%' },
//   callerName: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 16 },
//   callTypeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 8 },
//   connectingScreen: { flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
//   connectingContent: { alignItems: 'center', width: '100%' },
//   connectingAvatarContainer: {
//     width: 140, height: 140, borderRadius: 70, overflow: 'hidden',
//     backgroundColor: '#333', marginBottom: 20,
//   },
//   connectingAvatar: { width: '100%', height: '100%' },
//   connectingName: { color: '#fff', fontSize: 24, fontWeight: '700' },
//   connectingStatusRow: { alignItems: 'center', marginTop: 12, minHeight: 40 },
//   connectingStatusText: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
//   connectingEndBtn: { alignItems: 'center', marginTop: 60 },
//   connectingEndIcon: {
//     width: 64, height: 64, borderRadius: 32,
//     backgroundColor: '#ff3b30',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   connectingEndText: { color: '#fff', fontSize: 13, marginTop: 8 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
//   modalContainer: { width: '85%' },
//   modalContent: { alignItems: 'center' },
//   incomingCallText: { color: '#fff', fontSize: 16, marginBottom: 20 },
//   callerInfo: { alignItems: 'center', marginBottom: 40 },
//   modalAvatar: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', backgroundColor: '#333' },
//   modalAvatarImage: { width: '100%', height: '100%' },
//   modalCallerName: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 16 },
//   modalCallType: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
//   modalButtons: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' },
//   rejectButton: { alignItems: 'center' },
//   rejectButtonInner: {
//     width: 64, height: 64, borderRadius: 32, backgroundColor: '#ff3b30',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   acceptButton: { alignItems: 'center' },
//   acceptButtonInner: {
//     width: 64, height: 64, borderRadius: 32, backgroundColor: '#34c759',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   buttonText: { color: '#fff', fontSize: 13, marginTop: 8 },
// });


import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Modal,
  StatusBar,
  ImageBackground,
  NativeModules,
  DeviceEventEmitter,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
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
import { forceStopAllCallAudio } from '../src/utils/callAudio';
import NetInfo from '@react-native-community/netinfo';

const SIGNALING_SERVER = "wss://api.showapp.ng";

// How long we'll wait for the actual remote video track to arrive after a
// call is accepted / answered before nudging the user that something's wrong.
const REMOTE_TRACK_TIMEOUT_MS = 20000;

// How long a "connected then dropped" state is tolerated before we try an
// automatic ICE restart. Recovers flaky-network calls without ending them.
const ICE_RECOVERY_GRACE_MS = 4000;

// How long we allow "ICE connected" to sit with zero ontrack firing at all
// before assuming negotiation itself is broken (as opposed to a NAT/packet
// problem, which the frame watchdog below already covers) and escalating.
const ONTRACK_NEVER_FIRED_GRACE_MS = 5000;

// How many consecutive stats checks with packets arriving but ZERO frames
// decoded before we treat it as a hardware decoder failure (the Unisoc
// C2_NO_MEMORY / initDecode-failed signature: packets flow fine, decode
// never happens) rather than a transient hiccup.
const DECODER_STALL_CHECKS_THRESHOLD = 3;

// Caps automatic recovery escalation so a genuinely broken network/device
// doesn't loop forever tearing down and rebuilding the peer connection.
const MAX_RECOVERY_TIERS = 2;

// Gives the native layer time to actually release a closed decoder/encoder
// instance before we ask it to create a new one. Recreating too fast is
// exactly what causes hardware decoder instance counts to climb across
// repeated reconnects on chipsets with a hard concurrency cap (e.g. Unisoc
// hit C2_NO_MEMORY at 26 concurrent instances in the field).
const PC_RECREATE_SETTLE_MS = 400;

// Persisted per-device: once we've seen this device's hardware H264 decoder
// fail, we remember it and start every future call in VP8-only mode
// (software codec, works identically on every device) instead of gambling
// on H264 again and risking the same crash.
const CODEC_PREFERENCE_STORAGE_KEY = "videoCall_forceVp8Only_v1";

export default function VideoCallScreen({ navigation, route }) {
    useBackHandler(navigation, 'BroadcastHome');
  const {
    profile_image,
    name,
    incomingOffer,
    isIncomingCall,
    targetUserId,
    isInitiator,
    autoAnswerOnOffer,
  } = route.params || {};

  // ─── Refs ────────────────────────────────────────────────────
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

  const iceServersPromiseRef = useRef(null);
  const codecPreferencePromiseRef = useRef(null);
  const forceVp8OnlyRef = useRef(false);

  const acceptInProgressRef = useRef(false);
  const connectTimeoutRef = useRef(null);

  const iceRecoveryTimeoutRef = useRef(null);
  const iceRestartInFlightRef = useRef(false);

  const videoStatsWatchdogRef = useRef(null);
  const adaptiveBitrateIntervalRef = useRef(null);
  const currentBitrateTierRef = useRef('good');


  const zeroPacketChecksRef = useRef(0);
  const decoderStallChecksRef = useRef(0);

  const ontrackWatchdogRef = useRef(null);

  const recoveryTierRef = useRef(0);
  const recoveryInFlightRef = useRef(false);

  const endCallRef = useRef(null);
  const acceptCallWithCallKeepRef = useRef(null);
  const startCallWithCallKeepRef = useRef(null);


  const callEndedTimeoutRef = useRef(null);

  const initialBitrateTierRef = useRef('good'); // 'good' | 'medium' | 'low'


  // ─── State ───────────────────────────────────────────────────
  const [wsConnected, setWsConnected] = useState(false);
  const [webrtcReady, setWebrtcReady] = useState(false);
  const [localURL, setLocalURL] = useState(null);
  const [remoteURL, setRemoteURL] = useState(null);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [showCallEndedModal, setShowCallEndedModal] = useState(false);
  const [callEndedReason, setCallEndedReason] = useState('ended'); // 'ended' | 'rejected' | 'busy'
  const [incomingSDP, setIncomingSDP] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCameraFront, setIsCameraFront] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [isRinging, setIsRinging] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  const [networkQuality, setNetworkQuality] = useState('good'); // 'good' | 'poor' | 'bad'

  const updateCallId = (id) => {
    currentCallIdRef.current = id;
    setCurrentCallId(id);
  };

  /////// this is only for ui draging the video stream 
  const pipPosition = useRef({ x: Dimensions.get('window').width - 116, y: Platform.OS === 'ios' ? 100 : 70 });
  const [pipVisible, setPipVisible] = useState(true);
  const [pipPositionState, setPipPositionState] = useState({ 
    x: Dimensions.get('window').width - 116, 
    y: Platform.OS === 'ios' ? 100 : 70 
  });

  const handlePipDrag = (event, gestureState) => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const pipWidth = 100;
    const pipHeight = 140;
    
    let newX = pipPosition.current.x + gestureState.dx;
    let newY = pipPosition.current.y + gestureState.dy;
    
    newX = Math.max(0, Math.min(newX, screenWidth - pipWidth));
    newY = Math.max(50, Math.min(newY, screenHeight - pipHeight - 150));
    
    setPipPositionState({ x: newX, y: newY });
  };

  const handlePipDragEnd = () => {
    pipPosition.current = { x: pipPositionState.x, y: pipPositionState.y };
  };

  const pipPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (event, gestureState) => {
        handlePipDrag(event, gestureState);
      },
      onPanResponderRelease: () => {
        handlePipDragEnd();
      },
    })
  ).current;

  const togglePipVisibility = () => {
    setPipVisible(!pipVisible);
  };

  //// draging end==========================

  const startAudioSession = () => {
    InCallManager.start({ media: 'video' });
    InCallManager.setSpeakerphoneOn(true);
  };

  const startRinging = () => {
    setIsRinging(true);
    InCallManager.startRingtone();
  };

  const stopRinging = () => {
    setIsRinging(false);
    InCallManager.stopRingtone();
  };

  const acceptCallWithCallKeep = useCallback(async () => {
    console.log('[CallKeep] Accepting video call...');
    if (acceptInProgressRef.current) return;
    stopRinging();
    isCallerRef.current = false;
    const offer = incomingSDP || incomingOffer;
    if (!offer?.sdp) {
      console.error('[CallKeep] No valid offer to accept');
      return;
    }
    await handleIncomingCall(offer);
    if (currentCallIdRef.current) {
      await CallKeepService.setCallConnected(currentCallIdRef.current);
    }
  }, [incomingSDP, incomingOffer]);

  const startCallWithCallKeep = useCallback(async (phoneNumber, callUUID) => {
    console.log('[CallKeep] Starting video call with:', phoneNumber, callUUID);
    isCallerRef.current = true;
    startAudioSession();
    await createAndSendInitialOffer();
    if (callUUID) {
      await CallKeepService.setCallConnected(callUUID);
    }
  }, []);

  useEffect(() => { endCallRef.current = endCall; });
  useEffect(() => { acceptCallWithCallKeepRef.current = acceptCallWithCallKeep; }, [acceptCallWithCallKeep]);
  useEffect(() => { startCallWithCallKeepRef.current = startCallWithCallKeep; }, [startCallWithCallKeep]);

  useEffect(() => {
    let mounted = true;

    const setupCallKeepListeners = async () => {
      const initialized = await CallKeepService.initialize();
      if (!mounted || !initialized) return;

      console.log('[CallKeep] Registering video call listeners...');

      const onAnswerCall = (payload) => {
        console.log('[CallKeep] answerCall:', payload);
        if (!mounted) return;
        if (typeof acceptCallWithCallKeepRef.current === 'function') {
          acceptCallWithCallKeepRef.current();
        }
      };

      const onEndCall = (payload) => {
        console.log('[CallKeep] endCall:', payload);
        if (!mounted) return;
        if (typeof endCallRef.current === 'function') {
          endCallRef.current(true);
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
        InCallManager.start({ media: 'video' });
        InCallManager.setSpeakerphoneOn(true);
      };

      const onDidDeactivateAudio = () => {
        if (!mounted) return;
        InCallManager.stop();
      };

      const handlers = { onAnswerCall, onEndCall, onStartCall, onDidActivateAudio, onDidDeactivateAudio };
      const allValid = Object.entries(handlers).every(([key, fn]) => {
        if (typeof fn !== 'function') {
          console.error(`[CallKeep] Handler ${key} is not a function`);
          return false;
        }
        return true;
      });

      if (!allValid) return;

      CallKeepService.addEventListener('answerCall', onAnswerCall);
      CallKeepService.addEventListener('endCall', onEndCall);
      CallKeepService.addEventListener('startCall', onStartCall);
      CallKeepService.addEventListener('didActivateAudioSession', onDidActivateAudio);
      CallKeepService.addEventListener('didDeactivateAudioSession', onDidDeactivateAudio);

      console.log('[CallKeep] Video call listeners registered ✅');
    };

    const timer = setTimeout(() => setupCallKeepListeners(), 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      CallKeepService.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'incomingCallFromNotification',
      (callData) => {
        console.log('[VideoCall] Incoming call from notification:', callData);
        try { NativeModules.CallModule?.stopCallService(); } catch {}

        if (callData.autoAccept) {
          autoAnswerOnOfferRef.current = true;
        }
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    global.__onCallScreen = true;
    return () => {
      global.__onCallScreen = false;
      InCallManager.stopRingtone();
      InCallManager.stop({ busytone: '_BUNDLE_' });
    };
  }, []);

  useEffect(() => {
    InCallManager.stopRingtone();
    InCallManager.start({ media: 'video' });
    InCallManager.setSpeakerphoneOn(true);
    return () => {
      InCallManager.stop();
      InCallManager.stopRingtone();
    };
  }, []);

  useEffect(() => {
    InCallManager.setKeepScreenOn(true);
    return () => {
      InCallManager.stop();
      InCallManager.setKeepScreenOn(false);
      stopRinging();
    };
  }, []);

  useEffect(() => {
    if (showIncomingModal) {
      startRinging();
    } else {
      stopRinging();
    }
    return () => stopRinging();
  }, [showIncomingModal]);

  // Prefetch ICE servers AND this device's codec history the moment the
  // screen mounts — for an incoming call this happens while the phone is
  // still ringing, so by the time the user taps Accept both are already
  // resolved and the handshake proceeds with zero extra latency.
  useEffect(() => {
    prefetchIceServers();
    loadCodecPreference();
    return () => {
      clearConnectTimeout();
      clearIceRecoveryTimeout();
      clearVideoWatchdog();
      clearOntrackWatchdog();
    };
  }, []);

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
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getIceServers = async () => {
    try {
      console.log("[Xirsys] Fetching ICE servers...");
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
      console.log("✅ [ICE CONFIG READY]");
    } catch (err) {
      console.error("❌ [Xirsys Failed]:", err);
      rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
    }
  
    rtcConfig.iceTransportPolicy = "all";
    rtcConfig.iceCandidatePoolSize = 10; 
  };

  const prefetchIceServers = () => {
    if (!iceServersPromiseRef.current) {
      iceServersPromiseRef.current = getIceServers();
    }
    return iceServersPromiseRef.current;
  };

  // Reads this device's codec history (has hardware H264 decode ever failed
  // here before?) and, if so, pre-sets forceVp8OnlyRef BEFORE the first
  // offer/answer of this call is ever built — so a device that's already
  // known to have a broken hardware decoder never even attempts H264 again.
  const loadCodecPreference = () => {
    if (!codecPreferencePromiseRef.current) {
      codecPreferencePromiseRef.current = (async () => {
        try {
          const stored = await AsyncStorage.getItem(CODEC_PREFERENCE_STORAGE_KEY);
          if (stored === "true") {
            forceVp8OnlyRef.current = true;
            console.log("[Codec] This device previously failed hardware H264 decode — starting call in VP8-only mode");
          }
        } catch (e) {}
      })();
    }
    return codecPreferencePromiseRef.current;
  };

  const clearConnectTimeout = () => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
  };

  const clearCallEndedTimeout = () => {
  if (callEndedTimeoutRef.current) {
    clearTimeout(callEndedTimeoutRef.current);
    callEndedTimeoutRef.current = null;
  }
};

  const startConnectTimeout = () => {
    clearConnectTimeout();
    connectTimeoutRef.current = setTimeout(() => {
      if (!isCallActiveRef.current) return;
      if (remoteStream.current) return;

      Alert.alert(
        "Connection Problem",
        "We're having trouble connecting this call. Check your internet connection.",
        [
          { text: "Keep Waiting", style: "cancel", onPress: () => startConnectTimeout() },
          { text: "End Call", style: "destructive", onPress: () => endCall(true) },
        ]
      );
    }, REMOTE_TRACK_TIMEOUT_MS);
  };

  const clearIceRecoveryTimeout = () => {
    if (iceRecoveryTimeoutRef.current) {
      clearTimeout(iceRecoveryTimeoutRef.current);
      iceRecoveryTimeoutRef.current = null;
    }
  };

  const scheduleIceRecovery = () => {
    clearIceRecoveryTimeout();
    iceRecoveryTimeoutRef.current = setTimeout(() => {
      if (!isCallActiveRef.current || !pc.current) return;
      const state = pc.current.connectionState || pc.current.iceConnectionState;
      if (state === "connected" || state === "completed") return;
      attemptIceRestart();
    }, ICE_RECOVERY_GRACE_MS);
  };

  const attemptIceRestart = async () => {
    if (!pc.current || iceRestartInFlightRef.current) return;
    if (!isCallerRef.current) {
      console.log("[ICE] Callee cannot restart ICE directly, waiting for caller's renegotiation");
      return;
    }
    iceRestartInFlightRef.current = true;
    try {
      console.log("[ICE] Attempting ICE restart...");
      const rawOffer = await pc.current.createOffer({ iceRestart: true });
      const sdp = applyCodecForcing(rawOffer.sdp);
      const finalOffer = new RTCSessionDescription({ type: rawOffer.type, sdp });
      await pc.current.setLocalDescription(finalOffer);
      sendMessage({
        type: "offer",
        offer: { type: finalOffer.type, sdp: finalOffer.sdp },
        isVideoCall: true,
        isRenegotiation: true,
      });
      console.log("[ICE] Restart offer sent");
    } catch (err) {
      console.warn("[ICE] Restart failed:", err?.message);
    } finally {
      iceRestartInFlightRef.current = false;
    }
  };

  // Loss-resilient audio: FEC lets lost packets be reconstructed instead of
// causing gaps, DTX saves bandwidth during silence, and the bitrate cap
// keeps audio usable even when video bandwidth is under pressure.
const applyLowBandwidthAudioSDP = (sdp) => {
  return sdp.replace(
    /(m=audio.*\r\n(?:.*\r\n)*?a=rtpmap:(\d+) opus\/48000\/2\r\n)/,
    (match, block, payloadType) => {
      return block + `a=fmtp:${payloadType} minptime=10;useinbandfec=1;usedtx=1;maxaveragebitrate=24000\r\n`;
    }
  );
};

  // ─── Codec forcing (hard) ───────────────────────────────────────
  // Unlike preferReliableVideoCodec() below (a soft preference that still
  // allows H264 if the remote side's negotiation picks it), this physically
  // removes every video codec except VP8 from the SDP. It's the only real
  // guarantee against a hardware decoder bug like Unisoc's C2_NO_MEMORY —
  // a "preference" can still fall back to H264, a stripped SDP cannot.
  const stripToVp8Only = (sdp) => {
    const lines = sdp.split("\r\n");
    const mLineIndex = lines.findIndex((l) => l.startsWith("m=video"));
    if (mLineIndex === -1) return sdp;

    const vp8Line = lines.find((l) => /^a=rtpmap:(\d+) VP8\/\d+/i.test(l));
    if (!vp8Line) {
      console.warn("[Codec] VP8 not present in this SDP — cannot force it, leaving unchanged");
      return sdp;
    }
    const vp8Payload = vp8Line.match(/^a=rtpmap:(\d+) VP8\/\d+/i)[1];

    const rtxPayloads = lines
      .map((l) => l.match(new RegExp(`^a=fmtp:(\\d+) apt=${vp8Payload}\\b`)))
      .filter(Boolean)
      .map((m) => m[1]);

    const keepPayloads = new Set([vp8Payload, ...rtxPayloads]);

    const mLineParts = lines[mLineIndex].split(" ");
    const header = mLineParts.slice(0, 3);
    const originalPayloads = mLineParts.slice(3);
    const newPayloads = originalPayloads.filter((p) => keepPayloads.has(p));

    if (newPayloads.length === 0) {
      console.warn("[Codec] Forced VP8 filter produced an empty payload list — aborting to avoid a broken SDP");
      return sdp;
    }

    lines[mLineIndex] = [...header, ...newPayloads].join(" ");

    let inVideoSection = false;
    const filtered = lines.filter((line) => {
      if (line.startsWith("m=video")) { inVideoSection = true; return true; }
      if (line.startsWith("m=") && !line.startsWith("m=video")) { inVideoSection = false; return true; }
      if (!inVideoSection) return true;

      const pt = (
        line.match(/^a=rtpmap:(\d+)/) ||
        line.match(/^a=fmtp:(\d+)/) ||
        line.match(/^a=rtcp-fb:(\d+)/) ||
        []
      )[1];

      if (pt && !keepPayloads.has(pt)) return false;
      return true;
    });

    return filtered.join("\r\n");
  };

  // Single choke point every offer/answer SDP passes through. No-op unless
  // this device's forceVp8OnlyRef is currently set.
  // const applyCodecForcing = (sdp) => {
  //   return forceVp8OnlyRef.current ? stripToVp8Only(sdp) : sdp;
  // };

const applyCodecForcing = (sdp) => {
  let out = forceVp8OnlyRef.current ? stripToVp8Only(sdp) : sdp;
  out = applyLowBandwidthAudioSDP(out); 
  return out;
};

  // ─── Inbound-video watchdog + tiered recovery ladder ────────────
  const clearVideoWatchdog = () => {
    if (videoStatsWatchdogRef.current) {
      clearInterval(videoStatsWatchdogRef.current);
      videoStatsWatchdogRef.current = null;
    }
  };

  const startVideoFrameWatchdog = () => {
    clearVideoWatchdog();
    zeroPacketChecksRef.current = 0;
    decoderStallChecksRef.current = 0;

    videoStatsWatchdogRef.current = setInterval(async () => {
      if (!pc.current || !isCallActiveRef.current) return;
      try {
        const stats = await pc.current.getStats();
        let framesDecoded = 0;
        let packetsReceived = 0;
        stats.forEach((report) => {
          if (report.type === "inbound-rtp" && report.kind === "video") {
            framesDecoded = report.framesDecoded || 0;
            packetsReceived = report.packetsReceived || 0;
          }
        });
        console.log(`[Watchdog] inbound video framesDecoded=${framesDecoded} packetsReceived=${packetsReceived}`);

        if (framesDecoded > 0) {
          clearVideoWatchdog();
          return;
        }

        if (packetsReceived === 0) {
          zeroPacketChecksRef.current += 1;
          decoderStallChecksRef.current = 0;
          console.warn(`[Watchdog] Zero inbound video packets (${zeroPacketChecksRef.current}/3) — possible one-way NAT block`);
          if (zeroPacketChecksRef.current >= 3) {
            clearVideoWatchdog();
            await escalateRecovery(false);
          }
        } else {
          zeroPacketChecksRef.current = 0;
          decoderStallChecksRef.current += 1;
          console.warn(`[Watchdog] Packets arriving but 0 frames decoded (${decoderStallChecksRef.current}/${DECODER_STALL_CHECKS_THRESHOLD}) — possible hardware decoder failure`);
          if (decoderStallChecksRef.current >= DECODER_STALL_CHECKS_THRESHOLD) {
            clearVideoWatchdog();
            await escalateRecovery(true);
          }
        }
      } catch (err) {
        console.warn("[Watchdog] getStats failed:", err?.message);
      }
    }, 3000);
  };

  const clearAdaptiveBitrateMonitor = () => {
  if (adaptiveBitrateIntervalRef.current) {
    clearInterval(adaptiveBitrateIntervalRef.current);
    adaptiveBitrateIntervalRef.current = null;
  }
};

const startAdaptiveBitrateMonitor = () => {
  clearAdaptiveBitrateMonitor();
  currentBitrateTierRef.current = initialBitrateTierRef.current;

  adaptiveBitrateIntervalRef.current = setInterval(async () => {
    if (!pc.current || !isCallActiveRef.current) return;
    try {
      const stats = await pc.current.getStats();
      let packetsLost = 0, packetsSent = 0, currentRTT = 0;

      stats.forEach((report) => {
        if (report.type === 'outbound-rtp' && report.kind === 'video') {
          packetsSent = report.packetsSent || packetsSent;
        }
        if (report.type === 'remote-inbound-rtp' && report.kind === 'video') {
          packetsLost = report.packetsLost || 0;
          currentRTT = report.roundTripTime || currentRTT;
        }
      });

      const lossRatio = packetsSent > 0 ? Math.max(0, packetsLost) / packetsSent : 0;

      let tier = 'good';
      if (lossRatio > 0.1 || currentRTT > 0.6) tier = 'low';
      else if (lossRatio > 0.04 || currentRTT > 0.3) tier = 'medium';

      if (tier !== currentBitrateTierRef.current) {
        currentBitrateTierRef.current = tier;
        setNetworkQuality(tier === 'good' ? 'good' : tier === 'medium' ? 'poor' : 'bad');
        await applyVideoBitrateConstraint(tier);
      }
    } catch (e) {}
  }, 4000);
};

  const clearOntrackWatchdog = () => {
    if (ontrackWatchdogRef.current) {
      clearTimeout(ontrackWatchdogRef.current);
      ontrackWatchdogRef.current = null;
    }
  };

  const scheduleOntrackWatchdog = () => {
    clearOntrackWatchdog();
    ontrackWatchdogRef.current = setTimeout(() => {
      if (
        isCallActiveRef.current &&
        pc.current &&
        pc.current.connectionState === "connected" &&
        !remoteStream.current
      ) {
        console.warn("[Recovery] connected but ontrack never fired — escalating");
        escalateRecovery(false);
      }
    }, ONTRACK_NEVER_FIRED_GRACE_MS);
  };

  // Tears down the current peer connection, optionally forces TURN-relay
  // and/or VP8-only, waits a settle delay to let the native layer actually
  // release the old decoder/encoder instances, then rebuilds and
  // renegotiates over the existing signaling channel. Capped at
  // MAX_RECOVERY_TIERS attempts so a genuinely broken call doesn't loop.
  const escalateRecovery = async (forceVp8) => {
    if (recoveryInFlightRef.current || !isCallActiveRef.current) return;
    if (recoveryTierRef.current >= MAX_RECOVERY_TIERS) {
      console.warn("[Recovery] Max automatic recovery attempts reached — leaving it to the connection-problem prompt");
      return;
    }

    recoveryInFlightRef.current = true;
    recoveryTierRef.current += 1;
    const tier = recoveryTierRef.current;

    rtcConfig.iceTransportPolicy = "relay";

    if (forceVp8) {
      forceVp8OnlyRef.current = true;
      try {
        await AsyncStorage.setItem(CODEC_PREFERENCE_STORAGE_KEY, "true");
      } catch (e) {}
      console.warn(`[Recovery] Tier ${tier}: forcing TURN relay + VP8-only (hardware decoder failure suspected)`);
    } else {
      console.warn(`[Recovery] Tier ${tier}: forcing TURN relay (possible one-way NAT)`);
    }

    try {
      if (pc.current) {
        try {
          pc.current.onicecandidate = null;
          pc.current.ontrack = null;
          pc.current.onnegotiationneeded = null;
          pc.current.onconnectionstatechange = null;
          pc.current.oniceconnectionstatechange = null;
          pc.current.close();
        } catch (e) {}
        pc.current = null;
      }
      remoteStream.current = null;
      setRemoteURL(null);
      setWebrtcReady(false);
      queuedRemoteCandidates.current = [];
      clearOntrackWatchdog();
      clearVideoWatchdog();

      await new Promise((resolve) => setTimeout(resolve, PC_RECREATE_SETTLE_MS));
      if (!isCallActiveRef.current) return;

      await ensurePeerConnection();

      if (isCallerRef.current) {
        attachLocalTracksToPeer();
        applyVideoBitrateConstraint(initialBitrateTierRef.current);
        const rawOffer = await pc.current.createOffer();
        const sdp = applyCodecForcing(rawOffer.sdp);
        const finalOffer = new RTCSessionDescription({ type: rawOffer.type, sdp });
        await pc.current.setLocalDescription(finalOffer);
        sendMessage({
          type: "offer",
          offer: { type: finalOffer.type, sdp: finalOffer.sdp },
          isVideoCall: true,
          isRenegotiation: true,
        });
        console.log(`[Recovery] Tier ${tier} offer sent (relay-only, vp8Only=${forceVp8OnlyRef.current})`);
      }

      startConnectTimeout();
    } catch (err) {
      console.error("[Recovery] Escalation failed:", err?.message);
    } finally {
      recoveryInFlightRef.current = false;
    }
  };

  const BITRATE_TIERS = { good: 800, medium: 350, low: 150 }; // kbps

const applyVideoBitrateConstraint = async (tier) => {
  if (!pc.current) return;
  try {
    const senders = pc.current.getSenders();
    const videoSender = senders.find((s) => s.track?.kind === 'video');
    if (!videoSender || typeof videoSender.getParameters !== 'function') return;

    const params = videoSender.getParameters();
    if (!params.encodings || params.encodings.length === 0) {
      params.encodings = [{}];
    }
    params.encodings[0].maxBitrate = BITRATE_TIERS[tier] * 1000;
    await videoSender.setParameters(params);
    console.log(`[Bitrate] Video capped to ${BITRATE_TIERS[tier]}kbps (tier=${tier})`);
  } catch (e) {
    console.log('[Bitrate] setParameters not supported/failed:', e?.message);
  }
};

  const preferReliableVideoCodec = () => {
    if (!pc.current || typeof pc.current.getTransceivers !== "function") return;
    try {
      const transceivers = pc.current.getTransceivers();
      transceivers.forEach((transceiver) => {
        const kind = transceiver.receiver?.track?.kind || transceiver.sender?.track?.kind;
        if (kind !== "video") return;
        if (typeof transceiver.setCodecPreferences !== "function") return;
        if (typeof RTCPeerConnection.getCapabilities !== "function") return;

        const capabilities = RTCPeerConnection.getCapabilities("video");
        const codecs = capabilities?.codecs || [];
        if (!codecs.length) return;

        const vp8 = codecs.filter((c) => /VP8/i.test(c.mimeType));
        const others = codecs.filter((c) => !/VP8/i.test(c.mimeType));
        if (!vp8.length) return;

        transceiver.setCodecPreferences([...vp8, ...others]);
        console.log("[WebRTC] Preferred VP8 for video transceiver (hardware-decoder-safe)");
      });
    } catch (err) {
      console.log("[WebRTC] Codec preference not available on this build, skipping:", err?.message);
    }
  };

  const ensurePeerConnection = async () => {
  if (pc.current) return;
  await prefetchIceServers();

  pc.current = new RTCPeerConnection(rtcConfig);
  console.log("[WebRTC] RTCPeerConnection created");

  pc.current.onnegotiationneeded = () => {
    console.log("[WebRTC] onnegotiationneeded, signalingState:", pc.current?.signalingState);
  };

  pc.current.onicecandidate = (evt) => {
    if (evt.candidate) {
      const cand = evt.candidate.candidate;
      if (cand.includes("typ relay")) console.log("🟢 [TURN WORKING]", cand);
      else if (cand.includes("typ srflx")) console.log("🟡 [STUN WORKING]", cand);
      sendMessage({ type: "candidate", candidate: evt.candidate });
    } else {
      console.log("[ICE] Gathering finished");
    }
  };

  pc.current.ontrack = (evt) => {
    console.log("========= TRACK RECEIVED =========");
    console.log("Track Kind:", evt.track.kind);
    console.log("Track enabled:", evt.track.enabled);
    console.log("Track readyState:", evt.track.readyState);

    try { evt.track.enabled = true; } catch (e) {}

    let stream = evt.streams && evt.streams[0];

    if (!stream) {
      console.warn("[WebRTC] Track received with no stream — constructing one manually");
      try {
        stream = remoteStream.current instanceof MediaStream
          ? remoteStream.current
          : new MediaStream();
        if (!stream.getTracks().some((t) => t.id === evt.track.id)) {
          stream.addTrack(evt.track);
        }
      } catch (e) {
        console.error("[WebRTC] Failed to construct fallback remote stream:", e?.message);
      }
    }

    if (stream) {
      remoteStream.current = stream;
      clearOntrackWatchdog();

      const tracks = stream.getTracks();
      console.log(`Remote stream now has ${tracks.length} tracks:`,
        tracks.map((t) => ({ kind: t.kind, enabled: t.enabled }))
      );

      try {
        const url = stream.toURL();
        setRemoteURL(url);
        console.log("remote_stream url:", url);
      } catch (e) {
        console.error("Error getting remote URL:", e);
      }

      setWebrtcReady(true);
      setCallAccepted(true);
      clearConnectTimeout();
      clearIceRecoveryTimeout();
      InCallManager.start({ media: 'video' });
      InCallManager.setSpeakerphoneOn(true);

      startVideoFrameWatchdog();
      startAdaptiveBitrateMonitor();
    } else {
      console.warn("[WebRTC] Track received but no stream could be established!");
    }
  };

  pc.current.onconnectionstatechange = async () => {
    if (!pc.current) return;
    const state = pc.current.connectionState;
    console.log("[WebRTC] connectionState =>", state);

    if (state === "connected") {
      clearIceRecoveryTimeout();
      console.log("VIDEO CALL CONNECTED");
      try {
        const stats = await pc.current.getStats();
        let negotiatedVideoCodec = null;
        stats.forEach((report) => {
          if (report.type === "candidate-pair" && report.state === "succeeded") {
            const local = stats.get(report.localCandidateId);
            const remote = stats.get(report.remoteCandidateId);
            if (local?.candidateType === "relay" || remote?.candidateType === "relay") {
              console.log("🟢 USING TURN (Xirsys)");
            } else if (local?.candidateType === "srflx") {
              console.log("🟡 USING STUN");
            } else {
              console.log("⚪ USING LOCAL");
            }
          }
          if (report.type === "codec" && report.mimeType?.toLowerCase().includes("video")) {
            negotiatedVideoCodec = report.mimeType;
          }
        });
        if (negotiatedVideoCodec) {
          console.log("📊 Negotiated video codec:", negotiatedVideoCodec);
        }
      } catch (err) {
        console.warn("[WebRTC] getStats failed:", err);
      }

      if (!remoteStream.current) {
        scheduleOntrackWatchdog();
      }
    }

    if (state === "disconnected") {
      console.warn("[WebRTC] Connection disconnected — watching for self-recovery");
      scheduleIceRecovery();
    }

    if (state === "failed") {
      console.warn("VIDEO CONNECTION FAILED");
      clearIceRecoveryTimeout();
      attemptIceRestart();
      saveCallToHistory({
        contact: { name, profileImage: profile_image, userId: targetUserId },
        direction: isInitiator ? 'outgoing' : 'incoming',
        isVideoCall: true,
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

  // Resolution is deliberately capped rather than left unconstrained: a
  // smaller frame size means a smaller decoder memory footprint on the
  // REMOTE side, which matters directly for chipsets with a hard cap on
  // concurrent decoder memory (like the Unisoc bug this file works around).
  // If this device has already been flagged as decoder-troubled, we go
  // even more conservative (480p) to leave extra headroom.
  const getLocalStream = async () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack && !videoTrack.enabled) {
        videoTrack.enabled = true;
        console.log("[Local] Re-enabled video track");
      }
      return true;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert("Permission denied", "Cannot access camera or microphone.");
      return false;
    }

    // const useSaferResolution = forceVp8OnlyRef.current;
    // const targetWidth = useSaferResolution ? 640 : 1280;
    // const targetHeight = useSaferResolution ? 480 : 720;

    // 🔴 ADD — check real network conditions before deciding starting quality,
// instead of only reacting to a PAST decoder failure on this device.
let isWeakNetwork = false;
try {
  const netState = await NetInfo.fetch();
  const gen = netState.details?.cellularGeneration;
  isWeakNetwork = netState.type === 'cellular' && (gen === '2g' || gen === '3g');
  if (netState.type === 'cellular' && !gen) {
    // Unknown cellular generation — be cautious rather than assume good
    isWeakNetwork = true;
  }
} catch (e) {
  // NetInfo failure shouldn't block the call — just proceed with defaults
}

const useSaferResolution = forceVp8OnlyRef.current || isWeakNetwork;
const useLowestResolution = forceVp8OnlyRef.current && isWeakNetwork;

const targetWidth = useLowestResolution ? 320 : useSaferResolution ? 640 : 1280;
const targetHeight = useLowestResolution ? 240 : useSaferResolution ? 480 : 720;

initialBitrateTierRef.current = useLowestResolution ? 'low' : useSaferResolution ? 'medium' : 'good';
console.log(`[Network] Starting tier=${initialBitrateTierRef.current} isWeakNetwork=${isWeakNetwork} target=${targetWidth}x${targetHeight}`);

    try {
      const s = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: isCameraFront ? "user" : "environment",
          width: { ideal: targetWidth, max: targetWidth },
          height: { ideal: targetHeight, max: targetHeight },
          frameRate: { ideal: 30, max: 30 },
        },
      });

      const videoTrack = s.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = true;
        console.log("[Local] Video track enabled:", videoTrack.enabled, `target=${targetWidth}x${targetHeight}`);
      }

      localStream.current = s;
      try { setLocalURL(s.toURL()); } catch {}
      return true;
    } catch (e) {
      Alert.alert("Error", "Failed to get camera/mic: " + e.message);
      return false;
    }
  };

  // CRITICAL ORDERING RULE: for the side making the offer, call this BEFORE
  // createOffer(). For the side answering an offer, call this AFTER
  // setRemoteDescription(offer) — never before. Attaching tracks to a fresh
  // peer connection before it has processed a remote offer creates new
  // transceivers that don't reliably bind to the offer's m-lines on
  // react-native-webrtc.
  const attachLocalTracksToPeer = () => {
    if (!pc.current || !localStream.current) return;
    const existingTracks = pc.current.getSenders().map((s) => s.track);
    localStream.current.getTracks().forEach((track) => {
      if (!existingTracks.includes(track)) {
        pc.current.addTrack(track, localStream.current);
        console.log(`[Local] Attached ${track.kind} track to peer connection`);
      }
    });
    preferReliableVideoCodec();
  };

  const prepareConnectionAndMediaOnly = async () => {
    const [, mediaOk] = await Promise.all([
      ensurePeerConnection(),
      getLocalStream(),
    ]);
    return !!(mediaOk && pc.current);
  };

  const drainQueuedCandidates = async () => {
    if (!pc.current || !pc.current.remoteDescription) return;
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
    console.log("[Cleanup] Closing video peer connection");
    isCleaningUpRef.current = true;
    isCallActiveRef.current = false;
    clearConnectTimeout();
    clearIceRecoveryTimeout();
    clearVideoWatchdog();
    clearOntrackWatchdog();
    clearAdaptiveBitrateMonitor();
    clearCallEndedTimeout();
    setShowCallEndedModal(false);
    recoveryTierRef.current = 0;
    recoveryInFlightRef.current = false;
    zeroPacketChecksRef.current = 0;
    decoderStallChecksRef.current = 0;
    setCallAccepted(false);
    setCallStarted(false);

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

    try {
      if (remoteStream.current) {
        remoteStream.current.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {}
    remoteStream.current = null;

    queuedRemoteCandidates.current = [];
    hasInitialOfferRef.current = false;
    acceptInProgressRef.current = false;
    iceRestartInFlightRef.current = false;

    try { InCallManager.stop(); } catch {}

    setLocalURL(null);
    setRemoteURL(null);
    setWebrtcReady(false);
    setIsCameraFront(true);
    setIsMuted(false);
    setIsSpeakerOn(false);
    isCleaningUpRef.current = false;
  };

  const sendMessage = (msg) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("[WS] Sending:", msg.type);
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("[WS] Cannot send, state:", ws.current?.readyState);
    }
  };

  const connectSignaling = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const userDataRaw = await AsyncStorage.getItem("userData");
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    const currentUserId = userData?.id;

    let roomId;
    if (isInitiator && targetUserId) {
      roomId = `user-${targetUserId}`;
    } else if (autoAnswerOnOffer && targetUserId) {
      roomId = `user-${currentUserId}`;
      console.log('[AutoAnswer] Connecting to our room:', roomId);
    } else if (currentUserId) {
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

      await loadCodecPreference();

      await prepareConnectionAndMediaOnly();

      if (isInitiator && targetUserId) {
        isCallerRef.current = true;
        setCallStarted(true);
        startAudioSession();
        await createAndSendInitialOffer();
      }

      if (!isInitiator && isIncomingCall && incomingOffer && !autoAnswerOnOffer) {
        await handleIncomingCall(incomingOffer);
      }
    };

    ws.current.onmessage = async (evt) => {
      let data;
      try { data = JSON.parse(evt.data); } catch { return; }

      console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation);

      if (!isCallActiveRef.current && data?.type !== "call-ended") {
        console.warn("[WS] Ignoring after call ended:", data?.type);
        return;
      }

      if (data.type === 'offer' && !data.isRenegotiation && isCallerRef.current) {
        console.warn('[WS] Ignoring own offer echo — we are the caller');
        return;
      }
      if (data.type === 'answer' && !isCallerRef.current && !data.isRenegotiation) {
        console.warn('[WS] Ignoring answer — we are the callee');
        return;
      }

      switch (data.type) {

        case "offer": {
          if (data.isRenegotiation) {
            await handleRenegotiationOffer(data.offer);
            break;
          }

          if (isCallerRef.current) break;

          const offerData = data.offer;
          if (!offerData?.sdp) {
            console.error("[WS] Offer missing SDP");
            break;
          }

          console.log("[WS] Valid video offer, SDP length:", offerData.sdp.length);

          if (webrtcReady || callAccepted || showIncomingModal) {
                console.log('[WS] Already on a call — sending busy response');
                sendMessage({
                type: 'call-busy',
                receiver_id: offerData.callerId || offerData.targetUserId,
                caller_id: offerData.targetUserId,
                });
                break;
            }

          if (autoAnswerOnOfferRef.current) {
            console.log('[AutoAnswer] Auto-answering video offer');
            autoAnswerOnOfferRef.current = false;
            isCallerRef.current = false;
            startAudioSession();
            await handleIncomingCall(offerData);
            if (currentCallIdRef.current) {
              await CallKeepService.setCallConnected(currentCallIdRef.current);
            }
          } else {
            const incomingCallId = `call_${Date.now()}`;
            updateCallId(incomingCallId);
            setIncomingSDP(offerData);

            await CallKeepService.displayIncomingCall({
              callId: incomingCallId,
              callerName: offerData.callerInfo?.name || name || 'Unknown',
              callerId: offerData.callerId || targetUserId || '',
              isVideo: true,
              roomId: offerData.roomId || '',
            });

            setShowIncomingModal(true);
          }
          break;
        }

        case "answer": {
          if (!isCallerRef.current || !pc.current) break;
          setCallAccepted(true);
          if (pc.current.signalingState === "have-local-offer") {
            try {
              await pc.current.setRemoteDescription(
                new RTCSessionDescription(data.answer)
              );
              await drainQueuedCandidates();
              startConnectTimeout();
            } catch (e) {
              console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message);
            }
          }
          break;
        }

        case "call-busy": {
  console.log('[WS] Recipient is busy on another call');
  await saveCallToHistory({
    contact: { name, profileImage: profile_image, userId: targetUserId },
    direction: 'outgoing',
    isVideoCall: true,
    status: 'busy',
    duration: 0,
  });
  setCallEndedReason('busy');
  setShowCallEndedModal(true);
  clearCallEndedTimeout();
  callEndedTimeoutRef.current = setTimeout(() => {
    endCall(false);
  }, 2200);
  break;
}

        case "candidate": {
          if (!pc.current || !pc.current.remoteDescription) {
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

        // case "call-ended": {
        //   Alert.alert("Call Ended", "Your call partner has disconnected");
        //   endCall(false);
        //   break;
        // }

        // case "call-rejected": {
        //   Alert.alert("Call Rejected", "The recipient declined your call");
        //   await saveCallToHistory({
        //     contact: { name, profileImage: profile_image, userId: targetUserId },
        //     direction: 'outgoing',
        //     isVideoCall: true,
        //     status: 'rejected',
        //     duration: 0,
        //   });
        //   endCall(false);
        //   break;
        // }

        case "call-ended": {
  console.log('[WS] Call ended by other party');
  setCallEndedReason('ended');
  setShowCallEndedModal(true);
  clearCallEndedTimeout();
  callEndedTimeoutRef.current = setTimeout(() => {
    endCall(false);
  }, 1800);
  break;
}

case "call-rejected": {
  console.log('[WS] Call rejected by other party');
  await saveCallToHistory({
    contact: { name, profileImage: profile_image, userId: targetUserId },
    direction: 'outgoing',
    isVideoCall: true,
    status: 'rejected',
    duration: 0,
  });
  setCallEndedReason('rejected');
  setShowCallEndedModal(true);
  clearCallEndedTimeout();
  callEndedTimeoutRef.current = setTimeout(() => {
    endCall(false);
  }, 1800);
  break;
}

        case "call-missed": {
          if (!isInitiator) {
            await saveCallToHistory({
              contact: { name, profileImage: profile_image, userId: targetUserId },
              direction: 'incoming',
              isVideoCall: true,
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

  const handleRenegotiationOffer = async (offer) => {
    try {
      if (!pc.current) {
        await ensurePeerConnection();
      }
      if (!localStream.current) {
        await getLocalStream();
      }
      if (!pc.current || pc.current.signalingState === "closed") return;

      console.log("[WebRTC] Renegotiation, signalingState:", pc.current.signalingState);
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      await drainQueuedCandidates();

      attachLocalTracksToPeer();
      applyVideoBitrateConstraint(initialBitrateTierRef.current);

      const rawAnswer = await pc.current.createAnswer();
      const sdp = applyCodecForcing(rawAnswer.sdp);
      const finalAnswer = new RTCSessionDescription({ type: rawAnswer.type, sdp });
      await pc.current.setLocalDescription(finalAnswer);

      sendMessage({ type: "answer", answer: { type: finalAnswer.type, sdp: finalAnswer.sdp }, isVideoCall: true, isRenegotiation: true });
      console.log("[WebRTC] Renegotiation answer sent");
    } catch (error) {
      console.error("[WebRTC] Renegotiation failed:", error);
    }
  };

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
        isVideoCall: true,
        status: callDetails.status,
        duration: callDetails.duration || 0,
      };
      history.unshift(newCall);
      await AsyncStorage.setItem('callHistory', JSON.stringify(history.slice(0, 100)));
      console.log('[CallHistory] Saved:', callDetails.status);
    } catch (error) {
      console.error('[CallHistory] Error:', error);
    }
  };

  const createAndSendInitialOffer = async () => {
    if (hasInitialOfferRef.current) return;

    console.log("[VideoCall] Creating initial offer...");
    await loadCodecPreference();
    const ok = await prepareConnectionAndMediaOnly();
    if (!ok || !pc.current) return;

    attachLocalTracksToPeer();
    applyVideoBitrateConstraint(initialBitrateTierRef.current);

    try {
      const userDataRaw = await AsyncStorage.getItem("userData");
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      const currentUserId = userData?.id;

      if (!currentUserId) {
        console.error("[VideoCall] No current user ID");
        return;
      }

      const callerInfo = {
        profileImage: userData.profile_picture || userData.profile_image || "",
        name: userData.name || "Caller",
      };

      const rawOffer = await pc.current.createOffer();
      const sdp = applyCodecForcing(rawOffer.sdp);
      const finalOffer = new RTCSessionDescription({ type: rawOffer.type, sdp });
      await pc.current.setLocalDescription(finalOffer);

      console.log("[VideoCall] Offer SDP length:", finalOffer.sdp?.length, "vp8Only:", forceVp8OnlyRef.current);

      sendMessage({
        type: "new_call",
        receiver_id: targetUserId,
        sender_id: currentUserId,
        caller_name: callerInfo.name,
        call_type: "video",
        room_id: `call_${currentUserId}_${targetUserId}`,
        offer: {
          type: finalOffer.type,
          sdp: finalOffer.sdp,
          targetUserId,
          callerId: currentUserId,
          callerInfo,
          isVideoCall: true,
        },
      });

      hasInitialOfferRef.current = true;
      console.log("[VideoCall] Initial offer sent ✅");
    } catch (e) {
      console.error("[VideoCall] createOffer failed:", e?.message);
    }
  };

const handleIncomingCall = async (offer) => {
  if (acceptInProgressRef.current) return;
  acceptInProgressRef.current = true;

  try {
    console.log("[Incoming] Starting...");

    if (!currentCallIdRef.current) {
      const newCallId = `call_${Date.now()}_${offer?.callerId || 'unknown'}`;
      updateCallId(newCallId);
    }

    if (!offer?.sdp) {
      console.error("[VideoCall] Missing SDP in offer");
      Alert.alert("Error", "Invalid video call offer.");
      acceptInProgressRef.current = false;
      rejectCall();
      return;
    }

    setShowIncomingModal(false);
    setIncomingSDP(null);
    setCallAccepted(true);
    try { NativeModules.CallModule?.stopCallService(); } catch {}

    await loadCodecPreference();

    const ok = await prepareConnectionAndMediaOnly();
    if (!ok || !pc.current) {
      acceptInProgressRef.current = false;
      rejectCall();
      return;
    }

    await pc.current.setRemoteDescription(
      new RTCSessionDescription({ 
        type: offer.type || 'offer', 
        sdp: offer.sdp 
      })
    );
    
    await drainQueuedCandidates();

    attachLocalTracksToPeer();
    applyVideoBitrateConstraint(initialBitrateTierRef.current);

    const rawAnswer = await pc.current.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    const answerSdp = applyCodecForcing(rawAnswer.sdp);
    const finalAnswer = new RTCSessionDescription({ type: rawAnswer.type, sdp: answerSdp });

    await pc.current.setLocalDescription(finalAnswer);

    console.log("Local video tracks:", localStream.current.getVideoTracks().length);
    console.log("Local audio tracks:", localStream.current.getAudioTracks().length);
    console.log("vp8Only:", forceVp8OnlyRef.current);
    console.log("Peer senders:", pc.current.getSenders().map(sender => ({
      kind: sender.track?.kind,
      enabled: sender.track?.enabled,
      readyState: sender.track?.readyState
    })));

    sendMessage({
      type: "answer",
      answer: { type: finalAnswer.type, sdp: finalAnswer.sdp },
      isVideoCall: true,
    });

    startConnectTimeout();

    console.log("[VideoCall] Answer sent, waiting for remote track...");
    
  } catch (error) {
    console.error("[VideoCall] handleIncomingCall error:", error?.message);
    Alert.alert("Error", "Failed to accept video call: " + (error?.message || "Unknown"));
    rejectCall();
  } finally {
    acceptInProgressRef.current = false;
  }
};


  useEffect(() => {
    connectSignaling();
    return () => { endCall(false); };
  }, []);

  useEffect(() => {
    if (webrtcReady && callAccepted) {
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
  }, [webrtcReady, callAccepted]);

  const acceptCall = async () => {
     forceStopAllCallAudio(currentCallIdRef.current);
    if (acceptInProgressRef.current) return;
    stopRinging();
    isCallerRef.current = false;
    const offer = incomingSDP;
    if (!offer?.sdp) {
      Alert.alert("Error", "Invalid video call offer.");
      return;
    }
    startAudioSession();
    await handleIncomingCall(offer);
  };

  const startCall = async () => {
    isCallerRef.current = true;
    setCallStarted(true);
    const newCallId = `call_${Date.now()}_${targetUserId}`;
    updateCallId(newCallId);
    startAudioSession();
    await createAndSendInitialOffer();
  };

// const endCall = useCallback(async (notify = true) => {
//      forceStopAllCallAudio(currentCallIdRef.current);
//   console.log("[VideoCall] Ending call...");

const endCall = useCallback(async (notify = true) => {
  // 🔴 Guard against double-invocation — e.g. the call-ended modal's
  // auto-timeout firing while the user simultaneously taps their own
  // "End Call" button. Without this, navigation.goBack() could fire twice.
  if (!isCallActiveRef.current) {
    console.log('[VideoCall] endCall already in progress/done, ignoring');
    return;
  }

  forceStopAllCallAudio(currentCallIdRef.current);
  clearCallEndedTimeout();
  console.log("[VideoCall] Ending call...");
  
  try { InCallManager.stopRingtone(); } catch (e) {}
  
  isCallActiveRef.current = false;
  clearConnectTimeout();
  clearIceRecoveryTimeout();
  clearVideoWatchdog();
  clearOntrackWatchdog();

  setWebrtcReady(false);
  setLocalURL(null);
  setRemoteURL(null);
  setCallDuration(0);
  setCurrentCallId(null);
  setShowIncomingModal(false);
  setIncomingSDP(null);

  try {
    if (localStream.current) {
      localStream.current.getTracks().forEach((t) => t.stop());
    }
  } catch (e) {}
  try {
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((t) => t.stop());
    }
  } catch (e) {}

  setTimeout(() => {
    try {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("PHome");
      }
    } catch (e) {
      navigation.navigate("PHome");
    }
  }, 0);

  const cid = currentCallIdRef.current || currentCallId;
  
  setTimeout(() => {
    if (cid) {
      try { 
        CallKeepService.endCall(cid).catch(() => {}); 
      } catch (e) {}
    }

    try { 
      NativeModules.CallModule?.stopCallService(); 
    } catch (e) {}

    if (notify && ws.current?.readyState === WebSocket.OPEN) {
      try { 
        ws.current.send(JSON.stringify({ type: "call-ended" })); 
      } catch (e) {}
    }

    try {
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
        ws.current = null;
      }
    } catch (e) {}

    try {
      InCallManager.stop();
    } catch (e) {}

    try {
      cleanupPeerConnection();
    } catch (e) {}

    console.log("[VideoCall] Cleanup complete");
  }, 0);

  const callDetails = {
    contact: {
      name: name || 'Unknown',
      profileImage: profile_image || '',
      userId: targetUserId || 'unknown',
    },
    direction: isInitiator ? 'outgoing' : 'incoming',
    isVideoCall: true,
    status: webrtcReady ? 'ended' : 'missed',
    duration: callDuration || 0,
  };

  saveCallToHistory(callDetails).catch(() => {});

}, [navigation, isInitiator, name, profile_image, targetUserId, webrtcReady, callDuration, currentCallId]);



  const rejectCall = async () => {
     forceStopAllCallAudio(currentCallIdRef.current);
    stopRinging();
    sendMessage({ type: "call-rejected" });
    await saveCallToHistory({
      contact: { name, profileImage: profile_image, userId: targetUserId },
      direction: 'incoming',
      isVideoCall: true,
      status: 'rejected',
      duration: 0,
    });
    setShowIncomingModal(false);
    setIncomingSDP(null);
    navigation.goBack();
  };

  const switchCamera = async () => {
    if (!localStream.current) return;
    const videoTrack = localStream.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack._switchCamera();
      setIsCameraFront(!isCameraFront);
    }
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getConnectingStatusText = () => {
    if (!wsConnected) return "Connecting...";
    if (callAccepted) return "Please wait, connecting...";
    if (isInitiator) return "Calling...";
    if (autoAnswerOnOffer) return "Connecting to video call...";
    return "Incoming video call...";
  };

  const showConnectingSpinner = wsConnected && callAccepted && !webrtcReady;

  return (
  
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {(webrtcReady && callAccepted) ? (
        <View style={styles.callScreen}>
          {remoteURL ? (
            <View style={styles.videoContainer}>
              <>
               {console.log("RTCView rendering with:", remoteURL)}
              <RTCView 
                streamURL={remoteURL} 
                style={styles.remoteVideo} 
                objectFit="cover" 
              />
              {networkQuality !== 'good' && (
                  <View style={{
                    position: 'absolute',
                    top: 50,
                    alignSelf: 'center',
                    backgroundColor: networkQuality === 'bad' ? '#E53935' : '#FFA726',
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    zIndex: 100,
                  }}>
                    <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>
                      {networkQuality === 'bad' ? 'Poor connection — video reduced' : 'Unstable connection'}
                    </Text>
                  </View>
                )}
              </>

              {localURL && pipVisible && (
                <View
                  style={[
                    styles.localVideoWrapper,
                    {
                      left: pipPositionState.x,
                      top: pipPositionState.y,
                    }
                  ]}
                  {...pipPanResponder.panHandlers}
                >
                  <View style={styles.pipContainer}>
                    <RTCView 
                      streamURL={localURL} 
                      style={styles.localVideoStream} 
                      objectFit="cover" 
                      mirror={isCameraFront}
                    />
                    
                    <TouchableOpacity 
                      style={styles.pipCloseButton}
                      onPress={togglePipVisibility}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="white" />
                    </TouchableOpacity>

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

              {!pipVisible && localURL && (
                <TouchableOpacity 
                  style={styles.showPipButton}
                  onPress={togglePipVisibility}
                  activeOpacity={0.7}
                >
                  <Icon name="videocam" size={20} color="white" />
                </TouchableOpacity>
              )}

              <View style={styles.topBar}>
                <View style={styles.topBarContent}>
                  <Text style={styles.callerNameText} numberOfLines={1}>
                    {name || 'Unknown'}
                  </Text>
                  <Text style={styles.callDurationText}>
                    {formatTime(callDuration)}
                  </Text>
                </View>
              </View>

              <View style={styles.bottomControls}>
                <View style={styles.controlsRow}>
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
                    onPress={toggleSpeaker}
                    activeOpacity={0.6}
                  >
                    <Icon 
                      name={isSpeakerOn ? "volume-up" : "volume-off"} 
                      size={22} 
                      color="white" 
                    />
                  </TouchableOpacity>

                  {/* <TouchableOpacity 
                    style={styles.controlBtn} 
                    onPress={togglePipVisibility}
                    activeOpacity={0.6}
                  >
                    <Icon 
                      name={pipVisible ? "videocam" : "videocam-off"} 
                      size={22} 
                      color="white" 
                    />
                  </TouchableOpacity> */}

                  <TouchableOpacity 
                    style={styles.controlBtn} 
                    onPress={switchCamera}
                    activeOpacity={0.6}
                  >
                    <Icon name="flip-camera-ios" size={22} color="white" />
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
          ) : (
            <View style={styles.loadingContainer}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Image
                    source={{ uri: `${profile_image}` }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.callerName}>{name}</Text>
                <ActivityIndicator size="small" color="#fff" style={{ marginTop: 10 }} />
                <Text style={styles.callTypeText}>
                  Connecting Video • {formatTime(callDuration)}
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.connectingScreen}>
          <View style={styles.connectingContent}>
            <View style={styles.connectingAvatarContainer}>
              <Image
                source={{ uri: `${profile_image}` }}
                style={styles.connectingAvatar}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.connectingName}>{name || 'Unknown'}</Text>

            <View style={styles.connectingStatusRow}>
              {showConnectingSpinner && (
                <ActivityIndicator
                  size="small"
                  color="rgba(255,255,255,0.8)"
                  style={{ marginBottom: 10 }}
                />
              )}
              <Text style={styles.connectingStatusText}>
                {getConnectingStatusText()}
              </Text>
            </View>

            {!showIncomingModal && (
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

      {!isInitiator && (
        <Modal
          visible={showIncomingModal}
          transparent
          animationType="fade"
          onRequestClose={rejectCall}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.incomingCallText}>Incoming Video Call</Text>
                <View style={styles.callerInfo}>
                  <View style={styles.modalAvatar}>
                    <Image
                      source={{ uri: `${profile_image}` }}
                      style={styles.modalAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.modalCallerName}>{name}</Text>
                  <Text style={styles.modalCallType}>Video Call</Text>
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
                      <Icon name="videocam" size={30} color="white" />
                    </View>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <Modal
        visible={showCallEndedModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.callEndedContainer}>
            <View style={styles.callEndedIconWrap}>
              <Icon name="call-end" size={34} color="white" />
            </View>
            {/* <Text style={styles.callEndedTitle}>
              {callEndedReason === 'rejected' ? 'Call Declined' : 'Call Ended'}
            </Text>
            <Text style={styles.callEndedSubtitle}>
              {callEndedReason === 'rejected'
                ? `${name || 'They'} declined your call`
                : `${name || 'They'} ended the call`}
            </Text> */}
            <Text style={styles.callEndedTitle}>
  {callEndedReason === 'busy'
    ? 'Line Busy'
    : callEndedReason === 'rejected'
    ? 'Call Declined'
    : 'Call Ended'}
</Text>
<Text style={styles.callEndedSubtitle}>
  {callEndedReason === 'busy'
    ? `${name || 'They'} are currently on another call`
    : callEndedReason === 'rejected'
    ? `${name || 'They'} declined your call`
    : `${name || 'They'} ended the call`}
</Text>
            <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" style={{ marginTop: 16 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  callScreen: { flex: 1, backgroundColor: '#000' },
  videoContainer: { flex: 1, backgroundColor: '#000' },
  remoteVideo: { flex: 1, backgroundColor: '#000' },
  localVideoWrapper: { position: 'absolute', width: 100, height: 140, zIndex: 20 },
  pipContainer: {
    width: 100,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: '#111',
  },
  localVideoStream: { width: '100%', height: '100%' },
  pipCloseButton: {
    position: 'absolute', top: 4, right: 4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  pipSwitchButton: {
    position: 'absolute', bottom: 4, right: 4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  showPipButton: {
    position: 'absolute', top: 70, right: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 20,
  },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBarContent: { alignItems: 'center' },
  callerNameText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  callDurationText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  bottomControls: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 40, paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
  },
  controlBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  endCallBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#ff3b30',
    alignItems: 'center', justifyContent: 'center',
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  avatarContainer: { alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: '#333' },
  avatarImage: { width: '100%', height: '100%' },
  callerName: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 16 },
  callTypeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 8 },
  connectingScreen: { flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  connectingContent: { alignItems: 'center', width: '100%' },
  connectingAvatarContainer: {
    width: 140, height: 140, borderRadius: 70, overflow: 'hidden',
    backgroundColor: '#333', marginBottom: 20,
  },
  connectingAvatar: { width: '100%', height: '100%' },
  connectingName: { color: '#fff', fontSize: 24, fontWeight: '700' },
  connectingStatusRow: { alignItems: 'center', marginTop: 12, minHeight: 40 },
  connectingStatusText: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  connectingEndBtn: { alignItems: 'center', marginTop: 60 },
  connectingEndIcon: {
    width: 74, height: 74, borderRadius: 32,
    backgroundColor: '#ff3b30',
    alignItems: 'center', justifyContent: 'center',
  },
  connectingEndText: { color: '#fff', fontSize: 13, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
  modalContainer: { width: '85%' },
  modalContent: { alignItems: 'center' },
  incomingCallText: { color: '#fff', fontSize: 16, marginBottom: 20 },
  callerInfo: { alignItems: 'center', marginBottom: 40 },
  modalAvatar: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', backgroundColor: '#333' },
  modalAvatarImage: { width: '100%', height: '100%' },
  modalCallerName: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 16 },
  modalCallType: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' },
  rejectButton: { alignItems: 'center' },
  rejectButtonInner: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#ff3b30',
    alignItems: 'center', justifyContent: 'center',
  },
  acceptButton: { alignItems: 'center' },
  acceptButtonInner: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#34c759',
    alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 13, marginTop: 8 },
    callEndedContainer: { alignItems: 'center', paddingHorizontal: 30 },
  callEndedIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#ff3b30',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  callEndedTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  callEndedSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 8, textAlign: 'center' },
});