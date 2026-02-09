

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
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import LinearGradient from "react-native-linear-gradient";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import { Image } from "react-native-animatable";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";
// // import LottieView from 'lottie-react-native';
// // import { RTCView } from "react-native-webrtc";


// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // // ============================================

// // export default function VoiceCallScreen({ navigation, route }) {
// //   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } =
// //     route.params || {};

// //   // --- refs/state
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
// //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// //   const [incomingSDP, setIncomingSDP] = useState(null);
// //   const [callDuration, setCallDuration] = useState(0);

// //   const isCallerRef = useRef(false);
// //   const callTimerRef = useRef(null);
// //   const hasInitialOfferRef = useRef(false);
// //   const isCleaningUpRef = useRef(false);

// //   // =============== PERMISSIONS ===============
// //   const requestMicPermission = async () => {
// //     if (Platform.OS === "android") {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// //           {
// //             title: "Microphone Permission",
// //             message: "App needs access to your microphone for calls",
// //             buttonNeutral: "Ask Me Later",
// //             buttonNegative: "Cancel",
// //             buttonPositive: "OK",
// //           }
// //         );
// //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   //========VIDEO PERMISSION =============
// //   const requestCameraPermission = async () => {
// //   if (Platform.OS === "android") {
// //     try {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.CAMERA,
// //         {
// //           title: "Camera Permission",
// //           message: "App needs access to your camera for video calls",
// //           buttonNeutral: "Ask Me Later",
// //           buttonNegative: "Cancel",
// //           buttonPositive: "OK",
// //         }
// //       );
// //       return granted === PermissionsAndroid.RESULTS.GRANTED;
// //     } catch (err) {
// //       console.warn(err);
// //       return false;
// //     }
// //   }
// //   return true;
// // };

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

// //   // ============ PEER CONNECTION =============
// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     // IMPORTANT: we do NOT auto-create offers here (avoid duplicate offers)
// //     pc.current.onnegotiationneeded = null;

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate });
// //       }
// //     };

// //     // pc.current.ontrack = (evt) => {
// //     //   if (evt.streams && evt.streams[0]) {
// //     //     remoteStream.current = evt.streams[0];
// //     //     try {
// //     //       setRemoteURL(remoteStream.current.toURL());
// //     //       // setRemote2Video(remoteStream)
// //     //     } catch {
          
// //     //       // RN-webrtc newer versions: toURL may be removed; you can render tracks via RTCView with streamURL prop
// //     //     }
// //     //     setWebrtcReady(true);
// //     //   }
// //     // };
// // //     pc.current.ontrack = (evt) => {
// // //   if (evt.streams && evt.streams[0]) {
// // //     remoteStream.current = evt.streams[0];
// // //     try {
// // //       // Use the stream directly with RTCView
// // //       setRemoteURL(remoteStream.current.toURL());
// // //     } catch (error) {
// // //       console.error("Error setting remote URL:", error);
// // //       // Fallback: use the stream object directly
// // //       setRemoteURL(remoteStream.current);
// // //     }
// // //     setWebrtcReady(true);
// // //   }
// // // };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //   if (!localStream.current) {
// //     const hasMic = await requestMicPermission();
// //     const hasCam = await requestCameraPermission();
// //     if (!hasMic || !hasCam) {
// //       Alert.alert("Permission denied", "Cannot access camera or microphone.");
// //       return false;
// //     }

// //     try {
// //       const s = await mediaDevices.getUserMedia({
// //         audio: true,
// //         video: {
// //           facingMode: "user", // "user" = front camera, "environment" = back
// //         },
// //       });
// //       localStream.current = s;
// //       setLocalURL(s.toURL());
// //     } catch (e) {
// //       Alert.alert("Error", "Failed to get local stream: " + e.message);
// //       return false;
// //     }
// //   }

// //   if (pc.current) {
// //     const existingTracks = pc.current.getSenders().map((s) => s.track);
// //     localStream.current.getTracks().forEach((track) => {
// //       if (!existingTracks.includes(track)) {
// //         pc.current.addTrack(track, localStream.current);
// //       }
// //     });
// //   }
// //   return true;
// // };

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
// //     isCleaningUpRef.current = true;
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     try {
// //       if (pc.current) {
// //         pc.current.onicecandidate = null;
// //         pc.current.ontrack = null;
// //         pc.current.onnegotiationneeded = null;
// //         pc.current.close();
// //       }
// //     } catch {}
// //     pc.current = null;

// //     try {
// //       if (localStream.current) {
// //         localStream.current.getTracks().forEach((t) => t.stop());
// //       }
// //     } catch {}
// //     localStream.current = null;
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];
// //     hasInitialOfferRef.current = false;
// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setWebrtcReady(false);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   const connectSignaling = async () => {
// //     // Decide which room to connect:
// //     // - Initiator connects to callee room: user-<targetUserId>
// //     // - Receiver connects to own room: user-<currentUserId>
// //     let roomId = "unknown";
// //     const token = await AsyncStorage.getItem("userToken");
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
// //     const currentUserId = userData?.id;

// //     if (isInitiator && targetUserId) {
// //       roomId = `user-${targetUserId}`;
// //     } else if (currentUserId) {
// //       roomId = `user-${currentUserId}`;
// //     } else {
// //       // fallback (shared room) — not recommended for production
// //       roomId = "unique-room-id";
// //     }

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

// //       // Prepare PC & local audio immediately
// //       await ensurePeerConnection();
// //       await ensureLocalStreamAndAttach();

// //       // If we navigated here as the initiator, start the call once connected
// //       if (isInitiator && targetUserId) {
// //         isCallerRef.current = true;
// //         await createAndSendInitialOffer();
// //       }
// //       // If we came with an incoming offer via route, handle it now
// //       if (!isInitiator && isIncomingCall && incomingOffer) {
// //         await handleIncomingCall(incomingOffer);
// //       }
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //       } catch {
// //         return;
// //       }

// //       switch (data.type) {
// //         case "offer": {
// //           // ignore offers if we are the caller of this session
// //           if (isCallerRef.current) return;

// //           setIncomingSDP(data.offer);
// //           setShowIncomingModal(true);
// //           break;
// //         }
// //         case "answer": {
// //           if (!isCallerRef.current) return;
// //           if (!pc.current) return;
// //           if (pc.current.signalingState === "have-local-offer") {
// //             try {
// //               await pc.current.setRemoteDescription(
// //                 new RTCSessionDescription(data.answer)
// //               );
// //               await drainQueuedCandidates();
// //             } catch (e) {
// //               console.error("[WebRTC] setRemoteDescription(answer) failed:", e?.message || e);
// //             }
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
// //         case "call-ended": {
// //           Alert.alert("Call ended", "Remote participant left");
// //           endCall(false);
// //           break;
// //         }
// //         default:
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       setWsConnected(false);
// //       // Don’t auto-clean here if we are navigating away via endCall
// //       if (!isCleaningUpRef.current) {
// //         cleanupPeerConnection();
// //       }
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] Error:", err?.message || err);
// //     };
// //   };

// //   // ============ OFFER/ANSWER FLOW ===========
// //   const createAndSendInitialOffer = async () => {
// //   if (hasInitialOfferRef.current) return;
// //   await ensurePeerConnection();
// //   const ok = await ensureLocalStreamAndAttach();
// //   if (!ok || !pc.current) return;

// //   try {
// //     const userDataRaw = await AsyncStorage.getItem("userData");
// //     const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //     console.log('user_raw_data',userData);
// //     const callerInfo = {
// //       profileImage: userData.profile_picture || "",
// //       name: userData.name || "Unknown Caller",
// //     };

// //     const offer = await pc.current.createOffer();
// //     await pc.current.setLocalDescription(offer);

// //     sendMessage({
// //       type: "offer",
// //       offer: {
// //         ...offer,
// //         targetUserId: targetUserId,
// //         callerInfo, //passing caller info
// //       },
// //     });
// //     hasInitialOfferRef.current = true;
// //     console.log("[WebRTC] Initial offer created & sent");
// //   } catch (e) {
// //     console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// //   }
// // };


// //   // const handleIncomingCall = async (offer) => {
// //   //   try {
// //   //     await ensurePeerConnection();
// //   //     const ok = await ensureLocalStreamAndAttach();
// //   //     if (!ok || !pc.current) return;

// //   //     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //   //     await drainQueuedCandidates();

// //   //     const answer = await pc.current.createAnswer();
// //   //     await pc.current.setLocalDescription(answer);
// //   //     sendMessage({ type: "answer", answer });

// //   //     setWebrtcReady(true);
// //   //     setShowIncomingModal(false);
// //   //     setIncomingSDP(null);
// //   //   } catch (error) {
// //   //     console.error("Error handling incoming call:", error?.message || error);
// //   //     Alert.alert("Error", "Failed to accept call");
// //   //   }
// //   // };

// //   const handleIncomingCall = async (offer) => {
// //   try {
// //     await ensurePeerConnection();
// //     const ok = await ensureLocalStreamAndAttach();
// //     if (!ok || !pc.current) return;

// //     // Make sure offer is a proper RTCSessionDescription
// //     const sessionDescription = new RTCSessionDescription(offer);
// //     await pc.current.setRemoteDescription(sessionDescription);
// //     await drainQueuedCandidates();

// //     const answer = await pc.current.createAnswer();
// //     await pc.current.setLocalDescription(answer);
    
// //     // Send the answer back through the signaling server
// //     sendMessage({ 
// //       type: "answer", 
// //       answer: answer 
// //     });

// //     setWebrtcReady(true);
// //     setShowIncomingModal(false);
// //     setIncomingSDP(null);
// //   } catch (error) {
// //     console.error("Error handling incoming call:", error?.message || error);
// //     Alert.alert("Error", "Failed to accept call");
// //   }
// // };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
// //     return () => {
// //       endCall(false);
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // Call timer
// //   useEffect(() => {
// //     if (webrtcReady) {
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
// //     return () => {
// //       if (callTimerRef.current) clearInterval(callTimerRef.current);
// //     };
// //   }, [webrtcReady]);

// //   // ================ CONTROLS =================
// //   const startCall = async () => {
// //     isCallerRef.current = true;
// //     await createAndSendInitialOffer();
// //   };

// //   const acceptCall = async () => {
// //     isCallerRef.current = false;
// //     const offer = incomingSDP || incomingOffer;
// //     if (!offer) {
// //       Alert.alert("No offer", "No incoming offer to accept.");
// //       return;
// //     }
// //     await handleIncomingCall(offer);
// //   };

// //   const rejectCall = () => {
// //     sendMessage({ type: "call-ended" });
// //     setShowIncomingModal(false);
// //     setIncomingSDP(null);
// //     // no PC changes needed yet
// //   };

// //   const endCall = (notify = true) => {
// //     try {
// //       if (notify) sendMessage({ type: "call-ended" });
// //     } catch {}
// //     try {
// //       if (ws.current) {
// //         ws.current.onopen = null;
// //         ws.current.onmessage = null;
// //         ws.current.onclose = null;
// //         ws.current.onerror = null;
// //         ws.current.close();
// //       }
// //     } catch {}
// //     ws.current = null;
// //     cleanupPeerConnection();
// //      navigation.navigate('PHome');
// //   };

// //   // ================ UI ================
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       {webrtcReady ? (
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>

// //     {/* Remote Video (Main View) ========================================*/}
// //     {remoteURL && (
// //       <RTCView
// //         streamURL={remoteURL}
// //         style={StyleSheet.absoluteFill}
// //         objectFit="cover"
// //         mirror={false}
// //         zOrder={0}
// //       />
// //     )}
    
// //     {/* Local Video (Picture-in-Picture) */}
// //     {localURL && (
// //       <RTCView
// //         streamURL={localURL}
// //         style={styles.localVideo}
// //         objectFit="cover"
// //         mirror={true}
// //         zOrder={1}
// //       />
// //     )}
    
// //     {/* Overlay UI Elements */}
// //     <View style={styles.callHeader}>
// //       <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
// //       <Text style={styles.callerName}>{name}</Text>
// //       <Text style={styles.callStatus}>Connected</Text>
// //     </View>

// //     <View style={styles.avatarContainer}>
// //       {/* Only show avatar if video is not available */}
// //       {!remoteURL && (
// //         <View style={styles.avatar}>
// //           <Image
// //             source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //             style={styles.avatarImage}
// //             resizeMode="cover"
// //           />
// //         </View>
// //       )}
// //     </View>
// //           <View style={styles.callHeader}>
// //             <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
// //             <Text style={styles.callerName}>{name}</Text>
// //             <Text style={styles.callStatus}>Connected</Text>
// //           </View>

// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Image
// //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                 style={styles.avatarImage}
// //                 resizeMode="cover"
// //               />
// //             </View>
// //           </View>

// //           <View style={styles.callControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="mic-off" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>Mute</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>End</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="volume-up" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>Speaker</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </LinearGradient>
// //       ) : (
// //         <LinearGradient colors={["#1e1e1fff", "#080808ff"]} style={styles.preCallScreen}>
// //           <View style={{
// //               flex: 1,
// //               backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //               justifyContent: 'center',
// //               alignItems: 'center',
// //               padding: 20
// //             }}>
// //               <View style={{
// //                 alignItems: 'center',
// //                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //                 borderRadius: 20,
// //                 padding: 30,
// //                 width: '100%',
// //                 maxWidth: 350,
// //                 shadowColor: '#000',
// //                 shadowOffset: { width: 0, height: 10 },
// //                 shadowOpacity: 0.2,
// //                 shadowRadius: 20,
// //                 elevation: 10
// //               }}>
// //                 <View style={{
// //                   width: 150,
// //                   height: 150,
// //                   borderRadius: 75,
// //                   marginBottom: 25,
// //                   justifyContent: 'center',
// //                   alignItems: 'center',
// //                   backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //                   borderWidth: 3,
// //                   borderColor: 'rgba(255, 255, 255, 0.3)',
// //                   position: 'relative',
// //                   overflow: 'hidden'
// //                 }}>
                  
// //                   <Image
// //                     source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                     style={{
// //                       width: 180,
// //                       height: 180,
// //                       borderRadius: 70,
// //                       position: 'absolute',
                      
// //                     }}
// //                     resizeMode="cover"
// //                   />
// //                 </View>
                
// //                 <Text style={{
// //                   fontSize: 28,
// //                   fontWeight: '700',
// //                   color: '#fff',
// //                   marginBottom: 8,
// //                   textShadowColor: 'rgba(0, 0, 0, 0.3)',
// //                   textShadowOffset: { width: 1, height: 1 },
// //                   textShadowRadius: 5
// //                 }}>Calling {name}</Text>
                
// //                 <Text style={{
// //                   fontSize: 16,
// //                   color: 'rgba(255, 255, 255, 0.9)',
// //                   textAlign: 'center',
// //                   lineHeight: 22,
// //                   marginTop: 5
// //                 }}>
// //                   {wsConnected 
// //                     ? (isInitiator 
// //                         ? "Please wait while call is connecting..." 
// //                         : "Waiting for call") 
// //                     : "Connecting..."
// //                   }
// //                 </Text>
                
                
// //               </View>
// //             </View>
// //         </LinearGradient>

        


// //       )}

// //       <View style={{ flex: 1, backgroundColor: "black" }}>
// //   {remoteURL && (
// //     <RTCView
// //       streamURL={remoteURL}
// //       style={{ flex: 1 }}
// //       objectFit="cover"
// //       mirror={true}
// //     />
// //   )}
// //   {localURL && (
// //     <RTCView
// //       streamURL={localURL}
// //       style={{
// //         position: "absolute",
// //         bottom: 20,
// //         right: 20,
// //         width: 120,
// //         height: 160,
// //         backgroundColor: "#000",
// //       }}
// //       objectFit="cover"
// //       mirror={true}
// //     />
// //   )}
// // </View>


// //       {/* Incoming Call Modal */}
// //       <Modal
// //         visible={showIncomingModal}
// //         transparent={true}
// //         animationType="fade"
// //         onRequestClose={rejectCall}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.modalContainer}>
// //             <View style={styles.modalContent}>
// //               <Text style={styles.incomingCallText}>Incoming Call</Text>

// //               <View style={styles.callerInfo}>
// //                 <View style={styles.modalAvatar}>
// //                   <Image
// //                     source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                     style={styles.modalAvatarImage}
// //                     resizeMode="cover"
// //                   />
// //                 </View>
// //                 <Text style={styles.modalCallerName}>{name}</Text>
// //                 <Text style={styles.modalCallType}>Voice Call</Text>
// //               </View>

// //               <View style={styles.modalButtons}>
// //                 <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
// //                   <View style={styles.rejectButtonInner}>
// //                     <Icon name="call-end" size={30} color="white" />
// //                   </View>
// //                   <Text style={styles.buttonText}>Decline</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
// //                   <View style={styles.acceptButtonInner}>
// //                     <Icon name="call" size={30} color="white" />
// //                   </View>
// //                   <Text style={styles.buttonText}>Accept</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </LinearGradient>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // }


// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   callScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //     padding: 20,
// //   },
// //   preCallScreen: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
  
// //   preCallContent: {
// //     alignItems: 'center',
// //     width: '100%',
// //     padding: 20,
// //   },
// //   callHeader: {
// //     alignItems: 'center',
// //     marginTop: 40,
// //   },
// //   callDuration: {
// //     fontSize: 16,
// //     color: 'white',
// //     opacity: 0.8,
// //   },
// //   callerName: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: 'white',
// //     marginTop: 10,
// //   },
// //   callStatus: {
// //     fontSize: 16,
// //     color: '#a0aec0',
// //     marginTop: 5,
// //   },
// //   avatarContainer: {
// //     alignItems: 'center',
// //     marginVertical: 30,
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
// //   largeAvatar: {
// //     width: 200,
// //     height: 200,
// //     borderRadius: 100,
// //     //backgroundColor: '#4a5568',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderWidth: 5,
// //     borderColor: 'rgba(255,255,255,0.8)',
// //   },
// //   avatarImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 75,
// //   },
// //     Callimage: {
// //     width: '100%',
// //     height: '100%',
// //     marginBottom: 30,
// //   },
// //   largeAvatarImage: {
// //     width: '80%',
// //     height: '80%',
// //     borderRadius: 100,
// //   },
// //   contactName: {
// //     fontSize: 32,
// //     fontWeight: 'bold',
// //     color: '#2d3748',
// //     marginTop: 10,
// //   },
// //   contactStatus: {
// //     fontSize: 16,
// //     color: '#718096',
// //     marginTop: 5,
// //   },
// //   callControls: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     marginBottom: 40,
// //   },
// //   preCallControls: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     width: '100%',
// //     marginTop: 50,
// //   },
// //   controlButton: {
// //     alignItems: 'center',
// //   },
// //   actionButton: {
// //     alignItems: 'center',
// //   },
// //   controlIcon: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   callButton: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   controlText: {
// //     color: 'white',
// //     fontSize: 14,
// //   },
// //   actionButtonText: {
// //     color: '#2d3748',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   disabledButton: {
// //     opacity: 0.5,
// //   },
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
// //   },
// //   modalContent: {
// //     padding: 30,
// //     alignItems: 'center',
// //   },
// //   incomingCallText: {
// //     fontSize: 24,
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
// //   localVideo: {
// //     position: "absolute",
// //     bottom: 20,
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     backgroundColor: "#000",
// //     borderRadius: 10,
// //     overflow: "hidden",
// //     borderWidth: 1,
// //     borderColor: "rgba(255,255,255,0.3)",
// //     zIndex: 10,
// //   },
  
// //   callScreen: {
// //     flex: 1,
// //     justifyContent: 'space-between',
// //     padding: 20,
// //     overflow: "hidden", // Important for RTCView positioning
// //   },
// // });


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

// // ================== CONFIG ==================
// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // ============================================

// export default function VideoCallScreen({ navigation, route }) {
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
//   const [isCameraFront, setIsCameraFront] = useState(true);

//   const isCallerRef = useRef(false);
//   const callTimerRef = useRef(null);
//   const hasInitialOfferRef = useRef(false);
//   const isCleaningUpRef = useRef(false);
//   const isCallActiveRef = useRef(true);

//   // =============== PERMISSIONS ===============
//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const grant = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         return grant === PermissionsAndroid.RESULTS.GRANTED;
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

//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     if (!rtcConfig.iceServers.length) {
//       await getIceServers();
//     }

//     pc.current = new RTCPeerConnection(rtcConfig);
//     console.log("[WebRTC] RTCPeerConnection created");

//     pc.current.onnegotiationneeded = () => {
//       console.log("[WebRTC] onnegotiationneeded fired. signalingState:", pc.current?.signalingState);
//     };

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//     pc.current.ontrack = (evt) => {
//       console.log("[WebRTC] Track received:", evt.track?.kind);
//       if (evt.streams && evt.streams[0]) {
//         remoteStream.current = evt.streams[0];
//         try { setRemoteURL(remoteStream.current.toURL()); } catch {}
//         setWebrtcReady(true);
//       }
//     };

//     pc.current.onconnectionstatechange = () => {
//       if (!pc.current) {
//         console.warn("[WebRTC] onconnectionstatechange called with no pc");
//         return;
//       }
//       console.log("[WebRTC] connectionState =>", pc.current.connectionState);
//       if (pc.current.connectionState === "failed") {
//         console.warn("[WebRTC] Connection failed");
//         saveCallToHistory({
//           contact: { name, profileImage: profile_image, userId: targetUserId },
//           direction: isInitiator ? 'outgoing' : 'incoming',
//           isVideoCall: true,
//           status: 'failed',
//           duration: callDuration
//         });
//       }
//     };

//     pc.current.oniceconnectionstatechange = () => {
//       if (!pc.current) return;
//       console.log("[WebRTC] iceConnectionState =>", pc.current.iceConnectionState);
//     };
//   };

//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestPermissions();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access camera.");
//         return false;
//       }
//       try {
//         const s = await mediaDevices.getUserMedia({
//           video: { facingMode: isCameraFront ? "user" : "environment" },
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
//     return true;
//   };

//   const switchCamera = async () => {
//     if (!localStream.current) return;
    
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
//     console.log("[Cleanup] Closing peer connection and streams");
//     isCleaningUpRef.current = true;
//     isCallActiveRef.current = false;

//     try {
//       if (pc.current) {
//         pc.current.onicecandidate = null;
//         pc.current.ontrack = null;
//         pc.current.onnegotiationneeded = null;
//         pc.current.onconnectionstatechange = null;
//         pc.current.oniceconnectionstatechange = null;
//         pc.current.close();
//       }
//     } catch (e) {
//       console.warn("[Cleanup] pc close error", e);
//     }
//     pc.current = null;

//     try {
//       if (localStream.current) {
//         localStream.current.getTracks().forEach((t) => t.stop());
//       }
//     } catch (e) {
//       console.warn("[Cleanup] localStream stop error", e);
//     }
//     localStream.current = null;
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     hasInitialOfferRef.current = false;

//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCameraFront(true);
//     isCleaningUpRef.current = false;
//   };

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
//       //console.log("[WebSocket] Connected to", roomId);
//       setWsConnected(true);

//       await ensurePeerConnection();
//       await ensureLocalStreamAndAttach();

//       if (isInitiator && targetUserId) {
//         isCallerRef.current = true;
//         await createAndSendInitialOffer();
//       }
//       if (!isInitiator && isIncomingCall && incomingOffer) {
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

//       console.log("[WS] Received:", data?.type, "isRenegotiation:", data?.isRenegotiation,
//                   "pcExists:", !!pc.current, "isCallActive:", isCallActiveRef.current);

//       if (!isCallActiveRef.current && data?.type !== "call-ended") {
//         console.warn("[WS] Ignoring message after call ended:", data?.type);
//         return;
//       }

//       switch (data.type) {
//         case "offer": {
//           if (data.isRenegotiation) {
//             console.log("[WebRTC] Renegotiation offer received");
//             try {
//               await ensurePeerConnection();
//               await ensureLocalStreamAndAttach();
//             } catch (err) {
//               console.error("[WebRTC] Failed to prepare pc/local for renegotiation:", err);
//               return;
//             }
//             await handleRenegotiationOffer(data.offer);
//           } else {
//             if (isCallerRef.current) return;
//             setIncomingSDP(data.offer);
//             setShowIncomingModal(true);
//           }
//           break;
//         }
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
//             duration: 0
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
//               duration: 0
//             });
//           }
//           break;
//         }
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

//   const handleRenegotiationOffer = async (offer) => {
//     try {
//       if (!pc.current) {
//         console.warn("[WebRTC] No pc available, trying to recreate for renegotiation");
//         await ensurePeerConnection();
//         await ensureLocalStreamAndAttach();
//       }

//       if (!pc.current) {
//         console.error("[WebRTC] Still no pc after attempting recreate — abort renegotiation");
//         return;
//       }

//       if (pc.current.signalingState === "closed") {
//         console.warn("[WebRTC] pc already closed — ignoring renegotiation");
//         return;
//       }

//       console.log("[WebRTC] setting remote description for renegotiation. signalingState:", pc.current.signalingState);
//       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//       await drainQueuedCandidates();

//       const answer = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answer);

//       sendMessage({
//         type: "answer",
//         answer,
//         isVideoCall: true
//       });

//       console.log("[WebRTC] Renegotiation answer sent");
//     } catch (error) {
//       console.error("[WebRTC] Renegotiation failed:", error);
//     }
//   };

//   const saveCallToHistory = async (callDetails) => {
//     try {
//       console.log('[CallHistory] Saving call:', callDetails);
//       const existingHistory = await AsyncStorage.getItem('callHistory');
//       console.log('[CallHistory] Existing history:', existingHistory);
      
//       const history = existingHistory ? JSON.parse(existingHistory) : [];
      
//       const newCall = {
//         id: Date.now().toString(),
//         timestamp: Date.now(),
//         contact: {
//           name: callDetails.contact.name,
//           profileImage: callDetails.contact.profileImage,
//           userId: callDetails.contact.userId
//         },
//         direction: callDetails.direction,
//         isVideoCall: true,
//         status: callDetails.status,
//         duration: callDetails.duration || 0
//       };
      
//       history.unshift(newCall);
//       const limitedHistory = history.slice(0, 100);
      
//       await AsyncStorage.setItem('callHistory', JSON.stringify(limitedHistory));
//       console.log('[CallHistory] Call saved successfully');
//     } catch (error) {
//       console.error('[CallHistory] Error saving call:', error);
//     }
//   };

//   // ============ OFFER/ANSWER FLOW ===========
//   const createAndSendInitialOffer = async () => {
//     if (hasInitialOfferRef.current) return;
//     await ensurePeerConnection();
//     const ok = await ensureLocalStreamAndAttach();
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
//           isVideoCall: true,
//         },
//       });
//       hasInitialOfferRef.current = true;
//       console.log("[WebRTC] Initial offer created & sent");
//     } catch (e) {
//       console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
//     }
//   };

//   const handleIncomingCall = async (offer) => {
//     try {
//       await ensurePeerConnection();
//       const ok = await ensureLocalStreamAndAttach();
//       if (!ok || !pc.current) return;

//       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//       await drainQueuedCandidates();

//       const answer = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answer);
      
//       sendMessage({ 
//         type: "answer", 
//         answer,
//         isVideoCall: true,
//       });

//       setWebrtcReady(true);
//       setShowIncomingModal(false);
//       setIncomingSDP(null);

//       setTimeout(() => {
//         if (pc.current && localStream.current) {
//           localStream.current.getVideoTracks().forEach(track => {
//             track.enabled = true;
//           });
//         }
//       }, 500);
//     } catch (error) {
//       console.error("Error handling incoming call:", error?.message || error);
//       Alert.alert("Error", "Failed to accept call");
//     }
//   };

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

//   const acceptCall = async () => {
//     isCallerRef.current = false;
//     const offer = incomingSDP || incomingOffer;
//     if (!offer) {
//       Alert.alert("No offer", "No incoming offer to accept.");
//       return;
//     }
    
//     await handleIncomingCall(offer);
//   };

//   const startCall = async () => {
//     isCallerRef.current = true;
//     await ensureLocalStreamAndAttach();
//     await createAndSendInitialOffer();
//   };

//   const endCall = async (notify = true) => {
//     isCallActiveRef.current = false;
    
//     const callDetails = {
//       contact: {
//         name: name || 'Unknown',
//         profileImage: profile_image || '',
//         userId: targetUserId || 'unknown'
//       },
//       direction: isInitiator ? 'outgoing' : 'incoming',
//       isVideoCall: true,
//       status: webrtcReady ? 'ended' : 'missed',
//       duration: callDuration || 0
//     };
    
//     try { 
//       if (notify) sendMessage({ type: "call-ended" }); 
//     } catch(e){}
    
//     try {
//       if (ws.current) {
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//       }
//     } catch (e) { console.warn("[endCall] error closing ws", e); }
//     ws.current = null;

//     cleanupPeerConnection();
    
//     await saveCallToHistory(callDetails);
    
//     navigation.navigate("PHome");
//   };

//   const rejectCall = async () => {
//     sendMessage({ type: "call-rejected" });
    
//     await saveCallToHistory({
//       contact: { name, profileImage: profile_image, userId: targetUserId },
//       direction: 'incoming',
//       isVideoCall: true,
//       status: 'rejected',
//       duration: 0
//     });
    
//     setShowIncomingModal(false);
//     setIncomingSDP(null);
//     navigation.navigate("PHome");
//   };

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
//         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
//           {remoteURL ? (
//             <View style={styles.videoContainer}>
//               <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
              
//               <View style={styles.callInfoOverlay}>
//                 <Text style={styles.callTypeText}>
//                   Video Call • {formatTime(callDuration)}
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
              
//               <View style={styles.voiceCallInfo}>
//                 <Text style={styles.callerName}>{name}</Text>
//                 <Text style={styles.callTypeText}>
//                   Video Call • {formatTime(callDuration)}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {localURL && (
//             <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
//           )}

//           <View style={styles.callControls}>
//             <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
//               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
//                 <Icon name="flip-camera-ios" size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>Switch</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
//               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
//                 <Icon name="call-end" size={24} color="white" />
//               </View>
//               <Text style={styles.controlText}>End</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       ) : (
//         <ImageBackground 
//           source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` || require("../assets/images/avatar/blank-profile-picture-973460_1280.png")}} 
//           style={{
//             flex: 1,
//             backgroundColor: '#1a202c',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//           blurRadius={10}
//         >
//           <View style={{
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             width: '100%',
//             height: '100%',
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: 20
//           }}>
//             <View style={{
//               width: 180,
//               height: 180,
//               borderRadius: 90,
//               backgroundColor: 'rgba(255, 255, 255, 0.1)',
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginBottom: 30,
//               borderWidth: 4,
//               borderColor: 'rgba(255, 255, 255, 0.2)'
//             }}>
//               <Image
//                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//                 style={{
//                   width: 160,
//                   height: 160,
//                   borderRadius: 80,
//                 }}
//                 resizeMode="cover"
//               />
//             </View>
            
//             <Text style={{
//               color: 'white',
//               fontSize: 28,
//               fontWeight: 'bold',
//               marginBottom: 10
//             }}>{name}</Text>
            
//             <Text style={{
//               color: 'rgba(255, 255, 255, 0.8)',
//               fontSize: 16,
//               marginBottom: 40
//             }}>
//               {wsConnected 
//                 ? (isInitiator 
//                     ? "Please wait while call is connecting..." 
//                     : "Waiting for call...") 
//                 : "Connecting..."
//               }
//             </Text>

//             {isInitiator && (
//               <View style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-around',
//                 width: '100%',
//                 maxWidth: 350
//               }}>
//                 <TouchableOpacity 
//                   style={{
//                     alignItems: 'center'
//                   }} 
//                   onPress={startCall}
//                   disabled={wsConnected ? false : true}
//                 >
//                   <View style={{
//                     width: 70,
//                     height: 70,
//                     borderRadius: 35,
//                     backgroundColor: wsConnected ? "#38a169" : "#718096",
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     marginBottom: 10
//                   }}>
//                     <Icon name="videocam" size={30} color="white" />
//                   </View>
//                   <Text style={{
//                     color: 'white',
//                     fontSize: 14
//                   }}>Video Call</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   style={{
//                     alignItems: 'center'
//                   }} 
//                   onPress={() => endCall(true)}
//                   disabled={wsConnected ? false : true}
//                 >
//                   <View style={{
//                     width: 70,
//                     height: 70,
//                     borderRadius: 35,
//                     backgroundColor: wsConnected ? "#ef0505ff" : "#718096",
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     marginBottom: 10
//                   }}>
//                     <Icon name="call-end" size={30} color="white" />
//                   </View>
//                   <Text style={{
//                     color: 'white',
//                     fontSize: 14
//                   }}>End Call</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </ImageBackground>
//       )}

//       <Modal
//         visible={showIncomingModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={rejectCall}
//       >
//         <View style={styles.modalOverlay}>
//           <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.incomingCallText}>Incoming Video Call</Text>

//               <View style={styles.callerInfo}>
//                 <View style={styles.modalAvatar}>
//                   <Image
//                     source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
//                     style={styles.modalAvatarImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//                 <Text style={styles.modalCallerName}>{name}</Text>
//                 <Text style={styles.modalCallType}>Video Call</Text>
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
//                     <Icon name="videocam" size={30} color="white" />
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
//   videoContainer: {
//     flex: 1,
//     width: '100%',
//     position: 'relative',
//   },
//   callInfoOverlay: {
//     position: 'absolute',
//     top: 10,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 15,
//     zIndex: 100,
//     borderBottomLeftRadius: 5,
//     borderBottomRightRadius: 5,
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
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 75,
//   },
//   remoteVideo: {
//     flex: 1,
//     width: '100%',
//     backgroundColor: '#000',
//     zIndex: 1,
//   },
//   localVideo: {
//     position: 'absolute',
//     bottom: 120,
//     right: 20,
//     width: 120,
//     height: 160,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: 'white',
//     backgroundColor: '#000',
//     zIndex: 50,
//   },
//   voiceCallInfo: {
//     alignItems: 'center',
//     marginTop: 1,
//     padding: 20,
//     borderRadius: 15,
//   },
//   callerName: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 8,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   callTypeText: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.9)',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   callControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 40,
//     zIndex: 100,
//   },
//   controlButton: {
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
//   controlText: {
//     color: 'white',
//     fontSize: 14,
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
//     alignItems: 'center',
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

