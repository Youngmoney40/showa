// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Button,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { useCall } from "./CallContext";

// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const ROOM_ID = "unique-room-id";

// // export default function VoiceCallScreen({navigation}) {
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [webrtcReady, setWebrtcReady] = useState(false);
// //   const [isCaller, setIsCaller] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);

// //   // NEW: incoming call state
// //   const [incomingCall, setIncomingCall] = useState(null);
// //   const [showIncomingModal, setShowIncomingModal] = useState(false);

// //   const isCallerRef = useRef(false);

// //   const rtcConfig = {
// //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// //   };

// //   // Request microphone permission on Android
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
// //     return true; // iOS handled in Info.plist
// //   };

// //   // Send message via websocket
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       console.log("[Signaling] Sending message:", msg.type);
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   // Cleanup connection
// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     if (pc.current) {
// //       pc.current.onicecandidate = null;
// //       pc.current.ontrack = null;
// //       pc.current.onnegotiationneeded = null;
// //       pc.current.close();
// //       pc.current = null;
// //     }
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((t) => t.stop());
// //       localStream.current = null;
// //     }
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];
// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setWebrtcReady(false);
// //     setIsCaller(false);
// //     //navigation.goBack();
// //   };

// //   // Create RTCPeerConnection
// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] Created RTCPeerConnection");

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         console.log("[WebRTC] ICE candidate generated");
// //         sendMessage({ type: "candidate", candidate: evt.candidate });
// //       }
// //     };

// //     pc.current.onnegotiationneeded = async () => {
// //       if (!isCallerRef.current) return;
// //       if (pc.current.signalingState !== "stable") return;
// //       try {
// //         const offer = await pc.current.createOffer();
// //         await pc.current.setLocalDescription(offer);
// //         sendMessage({ type: "offer", offer });
// //         console.log("[WebRTC] Offer created and sent");
// //       } catch (err) {
// //         console.error("[WebRTC] Negotiation failed:", err);
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         setRemoteURL(remoteStream.current.toURL());
// //         setWebrtcReady(true);
// //       }
// //     };
// //   };

 



// //   // Get local mic stream
// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestMicPermission();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({ audio: true });
// //         localStream.current = s;
// //         setLocalURL(s.toURL());
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }
// //     // Attach to peer
// //     const senders = pc.current.getSenders();
// //     const senderTracks = senders.map((s) => s.track);
// //     localStream.current.getAudioTracks().forEach((track) => {
// //       if (!senderTracks.includes(track)) {
// //         pc.current.addTrack(track, localStream.current);
// //       }
// //     });
// //     return true;
// //   };

// //   // Apply queued candidates
// //   const drainQueuedCandidates = async () => {
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err);
// //       }
// //     }
// //   };

// //   // WebSocket connect
// //   const connectWebSocket = () => {
// //     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected");
// //       setWsConnected(true);
// //       await ensurePeerConnection();
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //       } catch (e) {
// //         return;
// //       }

      
// //       switch (data.type) {
        
// //         case "offer":
// //           if (isCallerRef.current) return;
// //           console.log("[Signaling] Incoming call offer received");
// //           setIncomingCall(data.offer);
// //           setShowIncomingModal(true);
// //           break;

// //         case "answer":
// //           if (!isCallerRef.current) return;
// //           if (pc.current.signalingState === "have-local-offer") {
// //             await pc.current.setRemoteDescription(
// //               new RTCSessionDescription(data.answer)
// //             );
// //             await drainQueuedCandidates();
// //           }
// //           break;

// //         case "candidate":
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(
// //                 new RTCIceCandidate(data.candidate)
// //               );
// //             } catch {}
// //           }
// //           break;

// //         case "call-ended":
// //           Alert.alert("Call ended", "Remote participant left");
// //           cleanupPeerConnection();
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       setWsConnected(false);
// //       cleanupPeerConnection();
// //     };
// //   };

// //   useEffect(() => {
// //     connectWebSocket();
// //     return () => {
// //       cleanupPeerConnection();
// //       if (ws.current) ws.current.close();
// //     };
// //   }, []);

// //   // === Call Controls ===
// //   const startCall = async () => {
// //     setIsCaller(true);
// //     isCallerRef.current = true;
// //     await ensurePeerConnection();
// //     await ensureLocalStreamAndAttach();
// //   };

// //   const acceptCall = async () => {
// //     setIsCaller(false);
// //     isCallerRef.current = false;
// //     await ensurePeerConnection();
// //     const localReady = await ensureLocalStreamAndAttach();
// //     if (!localReady) return;
// //     await pc.current.setRemoteDescription(new RTCSessionDescription(incomingCall));
// //     await drainQueuedCandidates();
// //     const answer = await pc.current.createAnswer();
// //     await pc.current.setLocalDescription(answer);
// //     sendMessage({ type: "answer", answer });
// //     setShowIncomingModal(false);
// //     setIncomingCall(null);
// //   };

// //   const rejectCall = () => {
// //     sendMessage({ type: "call-ended" });
// //     setShowIncomingModal(false);
// //     navigation.goBack();
// //     setIncomingCall(null);
// //   };

// //   const endCall = (manual = true) => {
// //     if (manual) sendMessage({ type: "call-ended" });
// //     cleanupPeerConnection();
// //      navigation.goBack();
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Room: {ROOM_ID}</Text>

// //       <View style={styles.row}>
// //         <Button
// //           title="Start Call"
// //           onPress={startCall}
// //           disabled={!wsConnected || webrtcReady}
// //         />
// //         <View style={{ width: 12 }} />
// //         <Button
// //           title="End Call"
// //           onPress={() => endCall(true)}
// //           disabled={!webrtcReady}
// //         />
// //       </View>

// //       <View style={styles.info}>
// //         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
// //         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
// //         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
// //       </View>

// //       {localURL && (
// //         <RTCView
// //           streamURL={localURL}
// //           style={styles.localView}
// //           objectFit="cover"
// //           mirror={true}
// //         />
// //       )}

// //       {remoteURL && (
// //         <RTCView
// //           streamURL={remoteURL}
// //           style={styles.remoteView}
// //           objectFit="cover"
// //         />
// //       )}

// //       {/* Incoming Call Modal */}
// //       {showIncomingModal && (
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalBox}>
// //             <Text style={styles.modalTitle}>📞 Incoming Call</Text>
// //             <View style={styles.modalButtons}>
// //               <Button title="Reject" color="red" onPress={rejectCall} />
// //               <Button title="Accept" onPress={acceptCall} />
// //             </View>
// //           </View>
// //         </View>
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
// //   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
// //   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
// //   info: { marginBottom: 12 },
// //   localView: {
// //     width: "100%",
// //     height: 150,
// //     backgroundColor: "#000",
// //     marginBottom: 20,
// //   },
// //   remoteView: { width: 0, height: 0 }, // hidden but plays audio
// //   modalOverlay: {
// //     position: "absolute",
// //     top: 0, left: 0, right: 0, bottom: 0,
// //     backgroundColor: "rgba(0,0,0,0.6)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   modalBox: {
// //     backgroundColor: "white",
// //     padding: 20,
// //     borderRadius: 12,
// //     width: "80%",
// //     alignItems: "center",
// //   },
// //   modalTitle: { fontSize: 18, marginBottom: 20, fontWeight: "bold" },
// //   modalButtons: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     width: "100%",
// //   },
// // });

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Button,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// // } from "react-native";
// // import {
// //   RTCPeerConnection,
// //   RTCIceCandidate,
// //   RTCSessionDescription,
// //   mediaDevices,
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64"; // ✅ Needed for Xirsys auth
// // import { useCall } from "./CallContext";
// // import { Image } from "react-native-animatable";

// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const ROOM_ID = "unique-room-id";

// // export default function VoiceCallScreen({ navigation, route }) {

// //   const {profile_picture, name} = route.params;
// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [webrtcReady, setWebrtcReady] = useState(false);
// //   const [isCaller, setIsCaller] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);

// //   // NEW: incoming call state
// //   const [incomingCall, setIncomingCall] = useState(null);
// //   const [showIncomingModal, setShowIncomingModal] = useState(false);

// //   const isCallerRef = useRef(false);

// //   // ✅ Fetch ICE servers from Xirsys once
// //   const getIceServers = async () => {
// //   try {
// //     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //       method: "PUT",
// //       headers: {
// //         Authorization:
// //           "Basic " +
// //           btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ format: "urls" }),
// //     });

// //     const data = await res.json();
// //     console.log("[Xirsys] Raw response:", data);

// //     // Transform the response into proper iceServers array
// //     let iceServers = [];
// //     if (data.v?.iceServers) {
// //       // Some accounts return the ready-to-use array
// //       iceServers = data.v.iceServers;
// //     } else if (data.v?.urls) {
// //       // Others return single object with urls, username, credential
// //       iceServers = data.v.urls.map((url) => ({
// //         urls: url,
// //         username: data.v.username,
// //         credential: data.v.credential,
// //       }));
// //     }

// //     rtcConfig.iceServers = iceServers.length
// //       ? iceServers
// //       : [{ urls: "stun:stun.l.google.com:19302" }]; // fallback

// //     console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //   } catch (err) {
// //     console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //   }
// // };


// //   // Request microphone permission on Android
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

// //   // Send message via websocket
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       console.log("[Signaling] Sending message:", msg.type);
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   // Cleanup connection
// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     if (pc.current) {
// //       pc.current.onicecandidate = null;
// //       pc.current.ontrack = null;
// //       pc.current.onnegotiationneeded = null;
// //       pc.current.close();
// //       pc.current = null;
// //     }
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((t) => t.stop());
// //       localStream.current = null;
// //     }
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];
// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setWebrtcReady(false);
// //     setIsCaller(false);
// //   };

// //   // Create RTCPeerConnection
// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log(
// //       "[WebRTC] Created RTCPeerConnection with ICE servers:",
// //       rtcConfig.iceServers
// //     );

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         console.log("[WebRTC] ICE candidate generated");
// //         sendMessage({ type: "candidate", candidate: evt.candidate });
// //       }
// //     };

// //     pc.current.onnegotiationneeded = async () => {
// //       if (!isCallerRef.current) return;
// //       if (pc.current.signalingState !== "stable") return;
// //       try {
// //         const offer = await pc.current.createOffer();
// //         await pc.current.setLocalDescription(offer);
// //         sendMessage({ type: "offer", offer });
// //         console.log("[WebRTC] Offer created and sent");
// //       } catch (err) {
// //         console.error("[WebRTC] Negotiation failed:", err);
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         setRemoteURL(remoteStream.current.toURL());
// //         setWebrtcReady(true);
// //       }
// //     };
// //   };

// //   // Get local mic stream
// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestMicPermission();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({ audio: true });
// //         localStream.current = s;
// //         setLocalURL(s.toURL());
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }
// //     // Attach to peer
// //     const senders = pc.current.getSenders();
// //     const senderTracks = senders.map((s) => s.track);
// //     localStream.current.getAudioTracks().forEach((track) => {
// //       if (!senderTracks.includes(track)) {
// //         pc.current.addTrack(track, localStream.current);
// //       }
// //     });
// //     return true;
// //   };

// //   // Apply queued candidates
// //   const drainQueuedCandidates = async () => {
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err);
// //       }
// //     }
// //   };

// //   // WebSocket connect
// //   const connectWebSocket = () => {
// //     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected");
// //       setWsConnected(true);
// //       await ensurePeerConnection();
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //       } catch (e) {
// //         return;
// //       }

// //       switch (data.type) {
// //         case "offer":
// //           if (isCallerRef.current) return;
// //           console.log("[Signaling] Incoming call offer received");
// //           setIncomingCall(data.offer);
// //           setShowIncomingModal(true);
// //           break;

// //         case "answer":
// //           if (!isCallerRef.current) return;
// //           if (pc.current.signalingState === "have-local-offer") {
// //             await pc.current.setRemoteDescription(
// //               new RTCSessionDescription(data.answer)
// //             );
// //             await drainQueuedCandidates();
// //           }
// //           break;

// //         case "candidate":
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(
// //                 new RTCIceCandidate(data.candidate)
// //               );
// //             } catch {}
// //           }
// //           break;

// //         case "call-ended":
// //           Alert.alert("Call ended", "Remote participant left");
// //           cleanupPeerConnection();
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       setWsConnected(false);
// //       cleanupPeerConnection();
// //     };
// //   };

// //   useEffect(() => {
// //     connectWebSocket();
// //     return () => {
// //       cleanupPeerConnection();
// //       if (ws.current) ws.current.close();
// //     };
// //   }, []);

// //   // === Call Controls ===
// //   const startCall = async () => {
// //     setIsCaller(true);
// //     isCallerRef.current = true;
// //     await ensurePeerConnection();
// //     await ensureLocalStreamAndAttach();
// //   };

// //   const acceptCall = async () => {
// //     setIsCaller(false);
// //     isCallerRef.current = false;
// //     await ensurePeerConnection();
// //     const localReady = await ensureLocalStreamAndAttach();
// //     if (!localReady) return;
// //     await pc.current.setRemoteDescription(new RTCSessionDescription(incomingCall));
// //     await drainQueuedCandidates();
// //     const answer = await pc.current.createAnswer();
// //     await pc.current.setLocalDescription(answer);
// //     sendMessage({ type: "answer", answer });
// //     setShowIncomingModal(false);
// //     setIncomingCall(null);
// //   };

// //   const rejectCall = () => {
// //     sendMessage({ type: "call-ended" });
// //     setShowIncomingModal(false);
// //     navigation.goBack();
// //     setIncomingCall(null);
// //   };

// //   const endCall = (manual = true) => {
// //     if (manual) sendMessage({ type: "call-ended" });
// //     cleanupPeerConnection();
// //     navigation.goBack();
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Room: {ROOM_ID}</Text>

// //       <View style={styles.row}>
// //         <Button
// //           title="Start Call"
// //           onPress={startCall}
// //           disabled={!wsConnected || webrtcReady}
// //         />
// //         <View style={{ width: 12 }} />
// //         <Button
// //           title="End Call"
// //           onPress={() => endCall(true)}
// //           disabled={!webrtcReady}
// //         />
// //       </View>

// //       <View style={styles.info}>
// //         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
// //         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
// //         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
// //       </View>

// //       {localURL && (
// //         <RTCView
// //           streamURL={localURL}
// //           style={styles.localView}
// //           objectFit="cover"
// //           mirror={true}
// //         />
// //       )}

// //       {remoteURL && (
// //         <RTCView
// //           streamURL={remoteURL}
// //           style={styles.remoteView}
// //           objectFit="cover"
// //         />
// //       )}

// //       {/* Incoming Call Modal */}
// //       {showIncomingModal && (
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalBox}>
// //             <Text style={styles.modalTitle}>📞 Incoming Call</Text>
            
// //             <Text style={styles.modalTitle}>{name}</Text>

// //             <View style={styles.modalButtons}>
// //               <Button title="Reject" color="red" onPress={rejectCall} />
// //               <Button title="Accept" onPress={acceptCall} />
// //             </View>
// //           </View>
// //         </View>
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
// //   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
// //   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
// //   info: { marginBottom: 12 },
// //   localView: {
// //     width: "100%",
// //     height: 150,
// //     backgroundColor: "#000",
// //     marginBottom: 20,
// //   },
// //   remoteView: { width: 0, height: 0 }, // hidden but plays audio
// //   modalOverlay: {
// //     position: "absolute",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: "rgba(0,0,0,0.6)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   modalBox: {
// //     backgroundColor: "white",
// //     padding: 20,
// //     borderRadius: 12,
// //     width: "80%",
// //     alignItems: "center",
// //   },
// //   modalTitle: { fontSize: 18, marginBottom: 20, fontWeight: "bold" },
// //   modalButtons: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     width: "100%",
// //   },
// // });

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Button,
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
// //   RTCView,
// // } from "react-native-webrtc";
// // import { encode as btoa } from "base-64";
// // import { useCall } from "./CallContext";
// // import { Image } from "react-native-animatable";
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { API_ROUTE_IMAGE } from "../api_routing/api";
// // import LottieView from "lottie-react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // const ROOM_ID = "unique-room-id";


// // export default function VoiceCallScreen({ navigation, route }) {
  

// //    const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator} = route.params || {};

// //     //const { profile_image, name, targetUserId, isInitiator } = route.params || {};

// //   const ws = useRef(null);
// //   const pc = useRef(null);
// //   const localStream = useRef(null);
// //   const remoteStream = useRef(null);
// //   const queuedRemoteCandidates = useRef([]);
// //   const rtcConfig = useRef({ iceServers: [] }).current;

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [webrtcReady, setWebrtcReady] = useState(false);
// //   const [isCaller, setIsCaller] = useState(false);
// //   const [localURL, setLocalURL] = useState(null);
// //   const [remoteURL, setRemoteURL] = useState(null);
// //   const [incomingCall, setIncomingCall] = useState(null);
// //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// //   const [callDuration, setCallDuration] = useState(0);
// //   const callTimerRef = useRef(null);

// //   const isCallerRef = useRef(false);

// //   // Start/stop call timer
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
// //       if (callTimerRef.current) {
// //         clearInterval(callTimerRef.current);
// //       }
// //     };
// //   }, [webrtcReady]);

// //   // Format time for display
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   // ✅ Fetch ICE servers from Xirsys once
// //   const getIceServers = async () => {
// //     try {
// //       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
// //         method: "PUT",
// //         headers: {
// //           Authorization:
// //             "Basic " +
// //             btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ format: "urls" }),
// //       });

// //       const data = await res.json();
// //       console.log("[Xirsys] Raw response:", data);

// //       // Transform the response into proper iceServers array
// //       let iceServers = [];
// //       if (data.v?.iceServers) {
// //         // Some accounts return the ready-to-use array
// //         iceServers = data.v.iceServers;
// //       } else if (data.v?.urls) {
// //         // Others return single object with urls, username, credential
// //         iceServers = data.v.urls.map((url) => ({
// //           urls: url,
// //           username: data.v.username,
// //           credential: data.v.credential,
// //         }));
// //       }

// //       rtcConfig.iceServers = iceServers.length
// //         ? iceServers
// //         : [{ urls: "stun:stun.l.google.com:19302" }]; // fallback

// //       console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
// //     } catch (err) {
// //       console.error("[Xirsys] Failed to fetch ICE servers:", err);
// //       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
// //     }
// //   };

// //   // Request microphone permission on Android
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

// //   // Send message via websocket
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       console.log("[Signaling] Sending message:", msg.type);
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   // Cleanup connection
// //   const cleanupPeerConnection = () => {
// //     console.log("[Cleanup] Closing peer connection and streams");
// //     if (pc.current) {
// //       pc.current.onicecandidate = null;
// //       pc.current.ontrack = null;
// //       pc.current.onnegotiationneeded = null;
// //       pc.current.close();
// //       pc.current = null;
// //     }
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((t) => t.stop());
// //       localStream.current = null;
// //     }
// //     remoteStream.current = null;
// //     queuedRemoteCandidates.current = [];
// //     setLocalURL(null);
// //     setRemoteURL(null);
// //     setWebrtcReady(false);
// //     setIsCaller(false);
// //   };

// //   // Create RTCPeerConnection
// //   // const ensurePeerConnection = async () => {
// //   //   if (pc.current) return;

// //   //   if (!rtcConfig.iceServers.length) {
// //   //     await getIceServers();
// //   //   }

// //   //   pc.current = new RTCPeerConnection(rtcConfig);
// //   //   console.log(
// //   //     "[WebRTC] Created RTCPeerConnection with ICE servers:",
// //   //     rtcConfig.iceServers
// //   //   );

// //   //   pc.current.onicecandidate = (evt) => {
// //   //     if (evt.candidate) {
// //   //       console.log("[WebRTC] ICE candidate generated");
// //   //       sendMessage({ type: "candidate", candidate: evt.candidate });
// //   //     }
// //   //   };

// //   //   pc.current.onnegotiationneeded = async () => {
// //   //     if (!isCallerRef.current) return;
// //   //     if (pc.current.signalingState !== "stable") return;
// //   //     try {
// //   //       const offer = await pc.current.createOffer();
// //   //       await pc.current.setLocalDescription(offer);
// //   //       sendMessage({ type: "offer", offer });
// //   //       console.log("[WebRTC] Offer created and sent");
// //   //     } catch (err) {
// //   //       console.error("[WebRTC] Negotiation failed:", err);
// //   //     }
// //   //   };

// //   //   pc.current.ontrack = (evt) => {
// //   //     if (evt.streams && evt.streams[0]) {
// //   //       remoteStream.current = evt.streams[0];
// //   //       setRemoteURL(remoteStream.current.toURL());
// //   //       setWebrtcReady(true);
// //   //     }
// //   //   };
// //   // };

// //   let hasInitialOffer = false;

// // const ensurePeerConnection = async () => {
// //   if (pc.current) return;

// //   if (!rtcConfig.iceServers.length) {
// //     await getIceServers();
// //   }

// //   pc.current = new RTCPeerConnection(rtcConfig);
// //   console.log(
// //     "[WebRTC] Created RTCPeerConnection with ICE servers:",
// //     rtcConfig.iceServers
// //   );

// //   pc.current.onicecandidate = (evt) => {
// //     if (evt.candidate) {
// //       console.log("[WebRTC] ICE candidate generated");
// //       sendMessage({ type: "candidate", candidate: evt.candidate });
// //     }
// //   };

// //   pc.current.onnegotiationneeded = async () => {
// //     // 👇 prevent duplicate renegotiations
// //     if (!isCallerRef.current || hasInitialOffer) return;
// //     if (pc.current.signalingState !== "stable") return;
// //     try {
// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);
// //       sendMessage({ type: "offer", offer });
// //       hasInitialOffer = true; // ✅ ensure only one initial offer
// //       console.log("[WebRTC] Offer created and sent");
// //     } catch (err) {
// //       console.error("[WebRTC] Negotiation failed:", err);
// //     }
// //   };

// //   pc.current.ontrack = (evt) => {
// //     if (evt.streams && evt.streams[0]) {
// //       remoteStream.current = evt.streams[0];
// //       setRemoteURL(remoteStream.current.toURL());
// //       setWebrtcReady(true);
// //     }
// //   };
// // };


// //   // Get local mic stream
// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestMicPermission();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({ audio: true });
// //         localStream.current = s;
// //         setLocalURL(s.toURL());
// //       } catch (e) {
// //         Alert.alert("Error", "Failed to get local stream: " + e.message);
// //         return false;
// //       }
// //     }
// //     // Attach to peer
// //     const senders = pc.current.getSenders();
// //     const senderTracks = senders.map((s) => s.track);
// //     localStream.current.getAudioTracks().forEach((track) => {
// //       if (!senderTracks.includes(track)) {
// //         pc.current.addTrack(track, localStream.current);
// //       }
// //     });
// //     return true;
// //   };

// //   // Apply queued candidates
// //   const drainQueuedCandidates = async () => {
// //     while (queuedRemoteCandidates.current.length > 0) {
// //       const c = queuedRemoteCandidates.current.shift();
// //       try {
// //         await pc.current.addIceCandidate(new RTCIceCandidate(c));
// //       } catch (err) {
// //         console.warn("[WebRTC] addIceCandidate error:", err);
// //       }
// //     }
// //   };

// //   // WebSocket connect
// //   const connectWebSocket = () => {
// //     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = async () => {
// //       console.log("[WebSocket] Connected");
// //       setWsConnected(true);
// //       await ensurePeerConnection();
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //       } catch (e) {
// //         return;
// //       }

// //       switch (data.type) {
// //         case "offer":
// //           if (isCallerRef.current) return;
// //           console.log("[Signaling] Incoming call offer received");
// //           setIncomingCall(data.offer);
// //           setShowIncomingModal(true);
// //           break;

// //         case "answer":
// //           if (!isCallerRef.current) return;
// //           if (pc.current.signalingState === "have-local-offer") {
// //             await pc.current.setRemoteDescription(
// //               new RTCSessionDescription(data.answer)
// //             );
// //             await drainQueuedCandidates();
// //           }
// //           break;

// //         case "candidate":
// //           if (!pc.current.remoteDescription) {
// //             queuedRemoteCandidates.current.push(data.candidate);
// //           } else {
// //             try {
// //               await pc.current.addIceCandidate(
// //                 new RTCIceCandidate(data.candidate)
// //               );
// //             } catch {}
// //           }
// //           break;

// //         case "call-ended":
// //           Alert.alert("Call ended", "Remote participant left");
// //           cleanupPeerConnection();
// //           break;
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       setWsConnected(false);
// //       cleanupPeerConnection();
// //     };
// //   };

// //   useEffect(() => {
// //     // Handle incoming call if we have an offer
// //     if (isIncomingCall && incomingOffer) {
// //       handleIncomingCall(incomingOffer);
// //     }
// //   }, [isIncomingCall, incomingOffer]);

// //   const handleIncomingCall = async (offer) => {
// //     try {
// //       await ensurePeerConnection();
// //       await ensureLocalStreamAndAttach();
      
// //       // Set the remote description from the offer
// //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //       await drainQueuedCandidates();
      
// //       // Create and send answer
// //       const answer = await pc.current.createAnswer();
// //       await pc.current.setLocalDescription(answer);
// //       sendMessage({ type: 'answer', answer });
      
// //       setWebrtcReady(true);
// //     } catch (error) {
// //       console.error('Error handling incoming call:', error);
// //       Alert.alert('Error', 'Failed to accept call');
// //     }
// //   };

// //   useEffect(() => {
// //     connectWebSocket();
// //     return () => {
// //       cleanupPeerConnection();
// //       if (ws.current) ws.current.close();
// //     };
// //   }, []);

// //   // === Call Controls ===
// //   // const startCall = async () => {
// //   //   setIsCaller(true);
// //   //   isCallerRef.current = true;
// //   //   await ensurePeerConnection();
// //   //   await ensureLocalStreamAndAttach();
// //   // };

// //  // In VoiceCallScreen.js
// // // const startCall = async (targetUserId) => {
// // //   setIsCaller(true);
// // //   isCallerRef.current = true;
// // //   await ensurePeerConnection();
// // //   await ensureLocalStreamAndAttach();
  
// // //   // Create offer with target user ID
// // //   const offer = await pc.current.createOffer();
// // //   await pc.current.setLocalDescription(offer);
  
// // //   // Include targetUserId in the offer
// // //   sendMessage({ 
// // //     type: "offer", 
// // //     offer: {
// // //       ...offer,
// // //       targetUserId: targetUserId // Add target user ID
// // //     } 
// // //   });
// // // };

// // const startCall = async () => {
// //   try {
// //     setIsCaller(true);
// //     isCallerRef.current = true;

// //     // Cleanup before starting a new call
// //     cleanupPeerConnection();
// //     hasInitialOffer = false; // reset flag

// //     // Ensure peer connection + mic stream
// //     await ensurePeerConnection();
// //     await ensureLocalStreamAndAttach();

// //     // Explicitly create and send the initial offer here
// //     const offer = await pc.current.createOffer();
// //     await pc.current.setLocalDescription(offer);

// //     sendMessage({ 
// //       type: "offer", 
// //       offer: {
// //         ...offer,
// //         targetUserId: targetUserId
// //       } 
// //     });

// //     hasInitialOffer = true; // mark as done
// //     console.log("[WebRTC] Manual offer created and sent");
// //   } catch (error) {
// //     console.error("Error starting call:", error);
// //     Alert.alert("Error", "Failed to start call");
// //   }
// // };
// //  useEffect(() => {
// //    console.log('target___userid',targetUserId)
// //     if (isInitiator && targetUserId) {
// //       // This user is initiating the call
// //       startCall(targetUserId);
// //       console.log('target_userid',targetUserId)
      
// //     }
// //     // Handle incoming calls logic remains the same
// //   }, [isInitiator, targetUserId]);
  

// // // const targetRoomId = `user-${targetUserId}`;

// //   const acceptCall = async () => {
// //     setIsCaller(false);
// //     isCallerRef.current = false;
// //     await ensurePeerConnection();
// //     const localReady = await ensureLocalStreamAndAttach();
// //     if (!localReady) return;
// //     await pc.current.setRemoteDescription(new RTCSessionDescription(incomingCall));
// //     await drainQueuedCandidates();
// //     const answer = await pc.current.createAnswer();
// //     await pc.current.setLocalDescription(answer);
// //     sendMessage({ type: "answer", answer });
// //     setShowIncomingModal(false);
// //     setIncomingCall(null);
// //   };

// //   const rejectCall = () => {
// //     sendMessage({ type: "call-ended" });
// //     setShowIncomingModal(false);
// //     navigation.goBack();
// //     setIncomingCall(null);
// //   };

// //   const endCall = (manual = true) => {
// //     if (manual) sendMessage({ type: "call-ended" });
// //     cleanupPeerConnection();
// //     navigation.goBack();
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />
      
// //       {/* Main call screen */}
// //       {webrtcReady ? (
// //         <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.callScreen}>
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
// //               <View style={[styles.controlIcon, {backgroundColor: '#4a5568'}]}>
// //                 <Icon name="mic-off" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>Mute</Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// //               <View style={[styles.controlIcon, {backgroundColor: '#e53e3e'}]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>End</Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
// //               <View style={[styles.controlIcon, {backgroundColor: '#4a5568'}]}>
// //                 <Icon name="volume-up" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>Speaker</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </LinearGradient>
// //       ) : (
// //         <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.preCallScreen}>
// //           <View style={styles.preCallContent}>
// //             <View style={styles.avatarContainer}>
// //               <View style={styles.largeAvatar}>
              
// //                 <Image 
// //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} 
// //                   style={styles.largeAvatarImage}
// //                   resizeMode="cover"
// //                 />
// //               </View>
// //               <Text style={styles.contactName}>{name}</Text>
// //               <Text style={styles.contactStatus}>
// //                 {wsConnected ? "Ready to call" : "Connecting..."}
// //               </Text>
// //             </View>
            
// //             <View style={styles.preCallControls}>
// //               <TouchableOpacity 
// //                 style={[styles.actionButton, !wsConnected && styles.disabledButton]} 
// //                 onPress={startCall}
// //                 disabled={!wsConnected}
// //               >
// //                 <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.callButton}>
// //                   <Icon name="call" size={24} color="white" />
// //                 </LinearGradient>
// //                 <Text style={styles.actionButtonText}>Call</Text>
// //               </TouchableOpacity>
              
// //               <TouchableOpacity 
// //                 style={[styles.actionButton, !webrtcReady && styles.disabledButton]} 
// //                 onPress={() => endCall(true)}
// //                 disabled={!webrtcReady}
// //               >
// //                 <View style={[styles.callButton, {backgroundColor: '#e53e3e'}]}>
// //                   <Icon name="call-end" size={24} color="white" />
// //                 </View>
// //                 <Text style={styles.actionButtonText}>End</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </LinearGradient>
// //       )}
      
// //       {/* Incoming Call Modal */}
// //       <Modal
// //         visible={showIncomingModal}
// //         transparent={true}
// //         animationType="fade"
// //         onRequestClose={rejectCall}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.modalContainer}>
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
// //   largeAvatarImage: {
// //     width: '100%',
// //     height: '100%',
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
// // });
// // VoiceCallScreen.js

// //////////////////////////  WORKING CODE FOR CALL ====================


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

// //     pc.current.ontrack = (evt) => {
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           setRemoteURL(remoteStream.current.toURL());
// //         } catch {
          
// //         }
// //         setWebrtcReady(true);
// //       }
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async () => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestMicPermission();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone.");
// //         return false;
// //       }
// //       try {
// //         // AUDIO ONLY to keep m-line order stable
// //         const s = await mediaDevices.getUserMedia({ audio: true, video: false });
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

// //     // Add tracks BEFORE any offer is created
// //     if (pc.current) {
// //       const existingTracks = pc.current.getSenders().map((s) => s.track);
// //       localStream.current.getTracks().forEach((track) => {
// //         if (!existingTracks.includes(track)) {
// //           pc.current.addTrack(track, localStream.current);
// //         }
// //       });
// //     }
// //     return true;
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

// //         <ImageBackground source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} style={[styles.preCallScreen,{width:'100%'}]}> 

// //             {/* <LinearGradient colors={["#1e1e1fff", "#080808ff"]} style={styles.preCallScreen}> */}
// //           <View style={{
// //             flex: 1,
// //             backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //             justifyContent: 'center',
// //             alignItems: 'center',
// //             padding: 20
// //           }}>
// //             <View style={{
// //               alignItems: 'center',
// //               backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //               borderRadius: 20,
// //               padding: 30,
// //               width: '100%',
// //               maxWidth: 350,
// //               shadowColor: '#000',
// //               shadowOffset: { width: 0, height: 10 },
// //               shadowOpacity: 0.2,
// //               shadowRadius: 20,
// //               elevation: 10
// //             }}>
// //               <View style={{
// //                 width: 150,
// //                 height: 150,
// //                 borderRadius: 75,
// //                 marginBottom: 25,
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //                 borderWidth: 3,
// //                 borderColor: 'rgba(255, 255, 255, 0.3)',
// //                 position: 'relative',
// //                 overflow: 'hidden'
// //               }}>
// //                 {/* <LottieView
// //                   source={require("../assets/animations/voice icon lottie animation.json")}
// //                   autoPlay
// //                   loop
// //                   style={{
// //                     width: 120,
// //                     height: 120,
// //                     position: 'absolute',
// //                     zIndex: 1
// //                   }}
// //                 /> */}
// //                 <Image
// //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                   style={{
// //                     width: 180,
// //                     height: 180,
// //                     borderRadius: 70,
// //                     position: 'absolute',
// //                     //opacity: 0.7
// //                   }}
// //                   resizeMode="cover"
// //                 />
// //               </View>
              
// //               <Text style={{
// //                 fontSize: 28,
// //                 fontWeight: '700',
// //                 color: '#fff',
// //                 marginBottom: 8,
// //                 textShadowColor: 'rgba(0, 0, 0, 0.3)',
// //                 textShadowOffset: { width: 1, height: 1 },
// //                 textShadowRadius: 5
// //               }}> {name}</Text>
              
// //               <Text style={{
// //                 fontSize: 16,
// //                 color: 'rgba(255, 255, 255, 0.9)',
// //                 textAlign: 'center',
// //                 lineHeight: 22,
// //                 marginTop: 5
// //               }}>
// //                 {wsConnected 
// //                   ? (isInitiator 
// //                       ? "Please wait while call is connecting..." 
// //                       : "Waiting for call") 
// //                   : "Connecting..."
// //                 }
// //               </Text>
              
              
// //             </View>
// //           </View>
// //         {/* </LinearGradient> */}
// //         </ImageBackground>
        
// //       )}

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
// //   Modal,
// //   SafeAreaView,
// //   StatusBar,
// //   ImageBackground,
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
// // import { Image } from "react-native-animatable";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // // ============================================

// // export default function VoiceVideoCallScreen({ navigation, route }) {
// //   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } = route.params || {};

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
// //   const [isVideoCall, setIsVideoCall] = useState(false);
// //   const [isCameraFront, setIsCameraFront] = useState(true);

// //   const isCallerRef = useRef(false);
// //   const callTimerRef = useRef(null);
// //   const hasInitialOfferRef = useRef(false);
// //   const isCleaningUpRef = useRef(false);

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

// //   // ============ PEER CONNECTION =============
// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = null;

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           setRemoteURL(remoteStream.current.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //         setWebrtcReady(true);
// //       }
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async (videoEnabled = isVideoCall) => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: videoEnabled ? { facingMode: isCameraFront ? "user" : "environment" } : false,
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
// //     return true;
// //   };

// //   const switchToVideoCall = async () => {
// //     if (!webrtcReady) return;
    
// //     // Stop existing tracks
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((track) => track.stop());
// //       localStream.current = null;
// //     }

// //     setIsVideoCall(true);
// //     await ensureLocalStreamAndAttach(true);
    
// //     // Trigger renegotiation
// //     try {
// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);
// //       sendMessage({
// //         type: "offer",
// //         offer,
// //         isVideoCall: true,
// //       });
// //     } catch (e) {
// //       console.error("[WebRTC] Switch to video offer failed:", e?.message || e);
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!isVideoCall || !localStream.current) return;
    
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
// //     setIsVideoCall(false);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   const connectSignaling = async () => {
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

// //       await ensurePeerConnection();
// //       await ensureLocalStreamAndAttach(isVideoCall);

// //       if (isInitiator && targetUserId) {
// //         isCallerRef.current = true;
// //         await createAndSendInitialOffer();
// //       }
// //       if (!isInitiator && isIncomingCall && incomingOffer) {
// //         setIsVideoCall(incomingOffer.isVideoCall || false);
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
// //           if (isCallerRef.current) return;
// //           setIncomingSDP(data.offer);
// //           setIsVideoCall(data.isVideoCall || false);
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
// //     if (hasInitialOfferRef.current) return;
// //     await ensurePeerConnection();
// //     const ok = await ensureLocalStreamAndAttach(isVideoCall);
// //     if (!ok || !pc.current) return;

// //     try {
// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //       const callerInfo = {
// //         profileImage: userData.profile_picture || "",
// //         name: userData.name || "Unknown Caller",
// //       };

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "offer",
// //         offer: {
// //           ...offer,
// //           targetUserId: targetUserId,
// //           callerInfo,
// //           isVideoCall,
// //         },
// //       });
// //       hasInitialOfferRef.current = true;
// //       console.log("[WebRTC] Initial offer created & sent");
// //     } catch (e) {
// //       console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// //     }
// //   };

// //   const handleIncomingCall = async (offer) => {
// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach(offer.isVideoCall || false);
// //       if (!ok || !pc.current) return;

// //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //       await drainQueuedCandidates();

// //       const answer = await pc.current.createAnswer();
// //       await pc.current.setLocalDescription(answer);
      
// //       sendMessage({ 
// //         type: "answer", 
// //         answer,
// //         isVideoCall: offer.isVideoCall || false,
// //       });

// //       setWebrtcReady(true);
// //       setShowIncomingModal(false);
// //       setIncomingSDP(null);
// //     } catch (error) {
// //       console.error("Error handling incoming call:", error?.message || error);
// //       Alert.alert("Error", "Failed to accept call");
// //     }
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
// //     return () => {
// //       endCall(false);
// //     };
// //   }, []);

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
// //   const startCall = async (video = false) => {
// //     setIsVideoCall(video);
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
// //     navigation.navigate('PHome');
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
// //           {isVideoCall && remoteURL ? (
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           ) : (
// //             <View style={styles.avatarContainer}>
// //               <View style={styles.avatar}>
// //                 <Image
// //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                   style={styles.avatarImage}
// //                   resizeMode="cover"
// //                 />
// //               </View>
// //             </View>
// //           )}

// //           {isVideoCall && localURL && (
// //             <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
// //           )}

// //           <View style={styles.callHeader}>
// //             <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
// //             <Text style={styles.callerName}>{name}</Text>
// //             <Text style={styles.callStatus}>{isVideoCall ? "Video Call" : "Voice Call"}</Text>
// //           </View>

// //           <View style={styles.callControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="mic-off" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>Mute</Text>
// //             </TouchableOpacity>

// //             {isVideoCall && (
// //               <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //                 <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                   <Icon name="flip-camera-ios" size={24} color="white" />
// //                 </View>
// //                 <Text style={styles.controlText}>Switch</Text>
// //               </TouchableOpacity>
// //             )}

// //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>End</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={styles.controlButton} 
// //               onPress={isVideoCall ? () => setIsVideoCall(false) : switchToVideoCall}
// //             >
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video On"}</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </LinearGradient>
// //       ) : (
// //         <ImageBackground source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} style={styles.preCallScreen}>
// //           <View style={styles.preCallContent}>
// //             <View style={styles.largeAvatar}>
// //               <Image
// //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                 style={styles.largeAvatarImage}
// //                 resizeMode="cover"
// //               />
// //             </View>
            
// //             <Text style={styles.contactName}>{name}</Text>
// //             <Text style={styles.contactStatus}>
// //               {wsConnected 
// //                 ? (isInitiator 
// //                     ? "Please wait while call is connecting..." 
// //                     : "Waiting for call") 
// //                 : "Connecting..."
// //               }
// //             </Text>

// //             {isInitiator && (
// //               <View style={styles.preCallControls}>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton} 
// //                   onPress={() => startCall(false)}
// //                   disabled={wsConnected ? false : true}
// //                 >
// //                   <View style={[styles.callButton, { backgroundColor: wsConnected ? "#38a169" : "#718096" }]}>
// //                     <Icon name="call" size={30} color="white" />
// //                   </View>
// //                   <Text style={styles.actionButtonText}>Voice Call</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity 
// //                   style={styles.actionButton} 
// //                   onPress={() => startCall(true)}
// //                   disabled={wsConnected ? false : true}
// //                 >
// //                   <View style={[styles.callButton, { backgroundColor: wsConnected ? "#3182ce" : "#718096" }]}>
// //                     <Icon name="videocam" size={30} color="white" />
// //                   </View>
// //                   <Text style={styles.actionButtonText}>Video Call</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}
// //           </View>
// //         </ImageBackground>
// //       )}

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
// //                 <Text style={styles.modalCallType}>{isVideoCall ? "Video Call" : "Voice Call"}</Text>
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
// //     backgroundColor: 'rgba(0,0,0,0.5)',
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
// //     flex: 1,
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
// //   largeAvatarImage: {
// //     width: '80%',
// //     height: '80%',
// //     borderRadius: 100,
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   localVideo: {
// //     position: 'absolute',
// //     bottom: 100,
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: 'white',
// //     backgroundColor: '#000',
// //   },
// //   contactName: {
// //     fontSize: 32,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     marginTop: 10,
// //   },
// //   contactStatus: {
// //     fontSize: 16,
// //     color: '#fff',
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
// //     color: '#fff',
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

//   // ============ PEER CONNECTION =============
// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

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
// //     //     } catch {
// //     //       // ignore if toURL not available
// //     //     }
// //     //     setWebrtcReady(true);
// //     //   }
// //     // };
// //     pc.current.ontrack = (evt) => {
// //   if (evt.streams && evt.streams[0]) {
// //     remoteStream.current = evt.streams[0];
// //     try {
// //       setRemoteURL(remoteStream.current.toURL());
// //     } catch {
// //       // ignore if toURL not available
// //     }
// //     setWebrtcReady(true);
    
// //     // 🔥 CRITICAL: Play the remote audio stream
// //     playRemoteAudio(remoteStream.current);
// //   }
// // };

// //   };
// // ============ PEER CONNECTION =============
// const ensurePeerConnection = async () => {
//   if (pc.current) return;

//   if (!rtcConfig.iceServers.length) {
//     await getIceServers();
//   }

//   pc.current = new RTCPeerConnection(rtcConfig);
//   console.log("[WebRTC] RTCPeerConnection created");

//   pc.current.onnegotiationneeded = () => {
//     console.log("[WebRTC] Negotiation needed");
//   };

//   pc.current.onicecandidate = (evt) => {
//     if (evt.candidate) {
//       sendMessage({ type: "candidate", candidate: evt.candidate });
//     }
//   };

//   // FIXED: Better track handling
//   pc.current.ontrack = (evt) => {
//     console.log("[WebRTC] Track received:", evt.track.kind);
    
//     if (evt.streams && evt.streams[0]) {
//       remoteStream.current = evt.streams[0];
      
//       // Check if this is a video track
//       const videoTracks = remoteStream.current.getVideoTracks();
//       if (videoTracks.length > 0) {
//         console.log("[WebRTC] Video track detected");
//         setIsVideoCall(true);
//       }
      
//       try {
//         setRemoteURL(remoteStream.current.toURL());
//       } catch {
//         // ignore if toURL not available
//       }
//       setWebrtcReady(true);
      
//       // Play the remote audio stream
//       playRemoteAudio(remoteStream.current);
//     }
//   };

//   // Handle connection state changes
//   pc.current.onconnectionstatechange = () => {
//     console.log("[WebRTC] Connection state:", pc.current.connectionState);
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


//   // const ensureLocalStreamAndAttach = async (videoEnabled = isVideoCall) => {
//   //   if (!localStream.current) {
//   //     const hasPermission = await requestPermissions();
//   //     if (!hasPermission) {
//   //       Alert.alert("Permission denied", "Cannot access microphone or camera.");
//   //       return false;
//   //     }
//   //     try {
//   //       const s = await mediaDevices.getUserMedia({
//   //         audio: true,
//   //         video: videoEnabled ? { facingMode: isCameraFront ? "user" : "environment" } : false,
//   //       });
//   //       localStream.current = s;
//   //       try {
//   //         setLocalURL(s.toURL());
//   //       } catch {
//   //         // ignore if toURL not available
//   //       }
//   //     } catch (e) {
//   //       Alert.alert("Error", "Failed to get local stream: " + e.message);
//   //       return false;
//   //     }
//   //   }

//   //   if (pc.current) {
//   //     const existingTracks = pc.current.getSenders().map((s) => s.track);
//   //     localStream.current.getTracks().forEach((track) => {
//   //       if (!existingTracks.includes(track)) {
//   //         pc.current.addTrack(track, localStream.current);
//   //       }
//   //     });
//   //   }
//   //   // Apply initial mute state
//   //   if (isMuted) {
//   //     localStream.current.getAudioTracks().forEach((track) => {
//   //       track.enabled = false;
//   //     });
//   //   }
//   //   return true;
//   // };
//   const ensureLocalStreamAndAttach = async (videoEnabled = isVideoCall) => {
//   if (!localStream.current) {
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       Alert.alert("Permission denied", "Cannot access microphone or camera.");
//       return false;
//     }
//     try {
//       const s = await mediaDevices.getUserMedia({
//         audio: true,
//         video: videoEnabled ? { facingMode: isCameraFront ? "user" : "environment" } : false,
//       });
//       localStream.current = s;
//       try {
//         setLocalURL(s.toURL());
//       } catch {
//         // ignore if toURL not available
//       }
//     } catch (e) {
//       Alert.alert("Error", "Failed to get local stream: " + e.message);
//       return false;
//     }
//   }

//   if (pc.current) {
//     // Remove existing tracks first to avoid duplicates
//     const senders = pc.current.getSenders();
//     senders.forEach(sender => {
//       if (sender.track) {
//         pc.current.removeTrack(sender);
//       }
//     });

//     // Add all tracks from current stream
//     localStream.current.getTracks().forEach((track) => {
//       pc.current.addTrack(track, localStream.current);
//     });
//   }
  
//   // Apply initial mute state
//   if (isMuted) {
//     localStream.current.getAudioTracks().forEach((track) => {
//       track.enabled = false;
//     });
//   }
//   return true;
// };


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

//   // const switchToVideoCall = async () => {
//   //   if (!webrtcReady) return;
    
//   //   if (localStream.current) {
//   //     localStream.current.getTracks().forEach((track) => track.stop());
//   //     localStream.current = null;
//   //   }

//   //   setIsVideoCall(true);
//   //   await ensureLocalStreamAndAttach(true);
    
//   //   try {
//   //     const offer = await pc.current.createOffer();
//   //     await pc.current.setLocalDescription(offer);
//   //     sendMessage({
//   //       type: "offer",
//   //       offer,
//   //       isVideoCall: true,
//   //     });
//   //   } catch (e) {
//   //     console.error("[WebRTC] Switch to video offer failed:", e?.message || e);
//   //   }
//   // };
//   const switchToVideoCall = async () => {
//   if (!webrtcReady || !pc.current) return;
  
//   console.log("[WebRTC] Switching to video call");
  
//   try {
//     // First, ensure we have video permissions
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

//     // Add video track if not present
//     const videoTrack = newStream.getVideoTracks()[0];
//     const videoSender = senders.find(s => s.track && s.track.kind === 'video');
    
//     if (videoTrack) {
//       if (videoSender) {
//         await videoSender.replaceTrack(videoTrack);
//       } else {
//         // Add new video track
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
//       isRenegotiation: true // Add flag for renegotiation
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
//     isCleaningUpRef.current = true;
//     console.log("[Cleanup] Closing peer connection and streams");
//     try {
//       if (pc.current) {
//         pc.current.onicecandidate = null;
//         pc.current.ontrack = null;
//         pc.current.onnegotiationneeded = null;
//         pc.current.close();
//       }
//     } catch {}
//     pc.current = null;

//     try {
//       if (localStream.current) {
//         localStream.current.getTracks().forEach((t) => t.stop());
//       }
//     } catch {}
//     localStream.current = null;
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     hasInitialOfferRef.current = false;
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsVideoCall(false);
//     setIsMuted(false);
//     setIsSpeakerOn(false);
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

//       switch (data.type) {
//         case "offer": {
//           if (isCallerRef.current) return;
//           setIncomingSDP(data.offer);
//           setIsVideoCall(data.isVideoCall || false);
//           setShowIncomingModal(true);
//           break;
//         }
//         // case "offer": {
//         //         if (data.isRenegotiation) {
//         //         // This is a renegotiation for video
//         //         console.log("[WebRTC] Received video renegotiation offer");
//         //         await handleRenegotiationOffer(data.offer, data.isVideoCall);
//         //         } else {
//         //         // Original offer handling
//         //         if (isCallerRef.current) return;
//         //         setIncomingSDP(data.offer);
//         //         setIsVideoCall(data.isVideoCall || false);
//         //         setShowIncomingModal(true);
//         //         }
//         //         break;
//         //     }

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
// const handleRenegotiationOffer = async (offer, isVideo) => {
//   try {
//     if (!pc.current) {
//       console.error("[WebRTC] No peer connection for renegotiation");
//       return;
//     }

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
//     console.error("[WebRTC] Renegotiation failed:", error?.message || error);
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

//   const handleIncomingCall = async (offer) => {
//     try {
//       await ensurePeerConnection();
//       const ok = await ensureLocalStreamAndAttach(offer.isVideoCall || false);
//       if (!ok || !pc.current) return;

//       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//       await drainQueuedCandidates();

//       const answer = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answer);
      
//       sendMessage({ 
//         type: "answer", 
//         answer,
//         isVideoCall: offer.isVideoCall || false,
//       });

//       setWebrtcReady(true);
//       setShowIncomingModal(false);
//       setIncomingSDP(null);
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

//   const acceptCall = async () => {
//   isCallerRef.current = false;
//   const offer = incomingSDP || incomingOffer;
//   if (!offer) {
//     Alert.alert("No offer", "No incoming offer to accept.");
//     return;
//   }
  
//   // Start audio session before handling the call
//   startAudioSession();
  
//   await handleIncomingCall(offer);
// };
// const startCall = async (video = false) => {
//   setIsVideoCall(video);
//   isCallerRef.current = true;
  
//   // Start audio session before creating offer
//   startAudioSession();
  
//   await createAndSendInitialOffer();
// };

// // Update endCall to properly stop audio
// const endCall = (notify = true) => {
//   try {
//     if (notify) sendMessage({ type: "call-ended" });
//   } catch (e) {
//     console.warn("Error notifying call end:", e);
//   }

//   // Stop audio session
//   stopAudioSession();
  
//   // Rest of your cleanup code...
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
//   <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// ) : isVideoCall ? (
//   <View style={styles.videoPlaceholder}>
//     <Icon name="videocam-off" size={50} color="rgba(255,255,255,0.5)" />
//     <Text style={styles.placeholderText}>Waiting for video...</Text>
//   </View>
// ) : (
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
//                   Voice Call • {formatTime(callDuration)}
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
//                       : "Waiting for call") 
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
//     top: 50, // Increased top margin for better visibility
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better contrast
//     padding: 15,
//     zIndex: 100, // Higher z-index to ensure it's above video
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
  
//   voiceCallInfo: {
//     alignItems: 'center',
//     marginTop: 30, // More space above the info
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
// // import { Image } from "react-native-animatable";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE_IMAGE } from "../api_routing/api";

// // // ================== CONFIG ==================
// // const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// // // ============================================

// // export default function VoiceVideoCallScreen({ navigation, route }) {
// //   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } = route.params || {};

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
// //   const [isVideoCall, setIsVideoCall] = useState(false);
// //   const [isCameraFront, setIsCameraFront] = useState(true);

// //   const isCallerRef = useRef(false);
// //   const callTimerRef = useRef(null);
// //   const hasInitialOfferRef = useRef(false);
// //   const isCleaningUpRef = useRef(false);

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

// //   // ============ PEER CONNECTION =============
// //   const ensurePeerConnection = async () => {
// //     if (pc.current) return;

// //     if (!rtcConfig.iceServers.length) {
// //       await getIceServers();
// //     }

// //     pc.current = new RTCPeerConnection(rtcConfig);
// //     console.log("[WebRTC] RTCPeerConnection created");

// //     pc.current.onnegotiationneeded = null;

// //     pc.current.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({ type: "candidate", candidate: evt.candidate });
// //       }
// //     };

// //     pc.current.ontrack = (evt) => {
// //       if (evt.streams && evt.streams[0]) {
// //         remoteStream.current = evt.streams[0];
// //         try {
// //           setRemoteURL(remoteStream.current.toURL());
// //         } catch {
// //           // ignore if toURL not available
// //         }
// //         setWebrtcReady(true);
// //       }
// //     };
// //   };

// //   const ensureLocalStreamAndAttach = async (videoEnabled = isVideoCall) => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: videoEnabled ? { facingMode: isCameraFront ? "user" : "environment" } : false,
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
// //     return true;
// //   };

// //   const switchToVideoCall = async () => {
// //     if (!webrtcReady) return;
    
// //     // Stop existing tracks
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((track) => track.stop());
// //       localStream.current = null;
// //     }

// //     setIsVideoCall(true);
// //     await ensureLocalStreamAndAttach(true);
    
// //     // Trigger renegotiation
// //     try {
// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);
// //       sendMessage({
// //         type: "offer",
// //         offer,
// //         isVideoCall: true,
// //       });
// //     } catch (e) {
// //       console.error("[WebRTC] Switch to video offer failed:", e?.message || e);
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (!isVideoCall || !localStream.current) return;
    
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
// //     setIsVideoCall(false);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   const connectSignaling = async () => {
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

// //       await ensurePeerConnection();
// //       await ensureLocalStreamAndAttach(isVideoCall);

// //       if (isInitiator && targetUserId) {
// //         isCallerRef.current = true;
// //         await createAndSendInitialOffer();
// //       }
// //       if (!isInitiator && isIncomingCall && incomingOffer) {
// //         setIsVideoCall(incomingOffer.isVideoCall || false);
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
// //           if (isCallerRef.current) return;
// //           setIncomingSDP(data.offer);
// //           setIsVideoCall(data.isVideoCall || false);
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
// //     if (hasInitialOfferRef.current) return;
// //     await ensurePeerConnection();
// //     const ok = await ensureLocalStreamAndAttach(isVideoCall);
// //     if (!ok || !pc.current) return;

// //     try {
// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //       const callerInfo = {
// //         profileImage: userData.profile_picture || "",
// //         name: userData.name || "Unknown Caller",
// //       };

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "offer",
// //         offer: {
// //           ...offer,
// //           targetUserId: targetUserId,
// //           callerInfo,
// //           isVideoCall,
// //         },
// //       });
// //       hasInitialOfferRef.current = true;
// //       console.log("[WebRTC] Initial offer created & sent");
// //     } catch (e) {
// //       console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// //     }
// //   };

// //   const handleIncomingCall = async (offer) => {
// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach(offer.isVideoCall || false);
// //       if (!ok || !pc.current) return;

// //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //       await drainQueuedCandidates();

// //       const answer = await pc.current.createAnswer();
// //       await pc.current.setLocalDescription(answer);
      
// //       sendMessage({ 
// //         type: "answer", 
// //         answer,
// //         isVideoCall: offer.isVideoCall || false,
// //       });

// //       setWebrtcReady(true);
// //       setShowIncomingModal(false);
// //       setIncomingSDP(null);
// //     } catch (error) {
// //       console.error("Error handling incoming call:", error?.message || error);
// //       Alert.alert("Error", "Failed to accept call");
// //     }
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
// //     return () => {
// //       endCall(false);
// //     };
// //   }, []);

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
// //   const startCall = async (video = false) => {
// //     setIsVideoCall(video);
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
// //     navigation.navigate('PHome');
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
// //           {isVideoCall && remoteURL ? (
// //             <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //           ) : (
// //             <View style={styles.avatarContainer}>
// //               <View style={styles.avatar}>
// //                 <Image
// //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                   style={styles.avatarImage}
// //                   resizeMode="cover"
// //                 />
// //               </View>
// //             </View>
// //           )}

// //           {isVideoCall && localURL && (
// //             <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
// //           )}

// //           <View style={styles.callHeader}>
// //             <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
// //             <Text style={styles.callerName}>{name}</Text>
// //             <Text style={styles.callStatus}>{isVideoCall ? "Video Call" : "Voice Call"}</Text>
// //           </View>

// //           <View style={styles.callControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name="mic-off" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>Mute</Text>
// //             </TouchableOpacity>

// //             {isVideoCall && (
// //               <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //                 <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                   <Icon name="flip-camera-ios" size={24} color="white" />
// //                 </View>
// //                 <Text style={styles.controlText}>Switch</Text>
// //               </TouchableOpacity>
// //             )}

// //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>End</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={styles.controlButton} 
// //               onPress={isVideoCall ? () => setIsVideoCall(false) : switchToVideoCall}
// //             >
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video On"}</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </LinearGradient>
// //       ) : (
// //         <ImageBackground source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} style={styles.preCallScreen}>
// //           <View style={styles.preCallContent}>
// //             <View style={styles.largeAvatar}>
// //               <Image
// //                 source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                 style={styles.largeAvatarImage}
// //                 resizeMode="cover"
// //               />
// //             </View>
            
// //             <Text style={styles.contactName}>{name}</Text>
// //             <Text style={styles.contactStatus}>
// //               {wsConnected 
// //                 ? (isInitiator 
// //                     ? "Please wait while call is connecting..." 
// //                     : "Waiting for call") 
// //                 : "Connecting..."
// //               }
// //             </Text>

// //             {isInitiator && (
// //               <View style={styles.preCallControls}>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton} 
// //                   onPress={() => startCall(false)}
// //                   disabled={wsConnected ? false : true}
// //                 >
// //                   <View style={[styles.callButton, { backgroundColor: wsConnected ? "#38a169" : "#718096" }]}>
// //                     <Icon name="call" size={30} color="white" />
// //                   </View>
// //                   <Text style={styles.actionButtonText}>Voice Call</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity 
// //                   style={styles.actionButton} 
// //                   onPress={() => startCall(true)}
// //                   disabled={wsConnected ? false : true}
// //                 >
// //                   <View style={[styles.callButton, { backgroundColor: wsConnected ? "#3182ce" : "#718096" }]}>
// //                     <Icon name="videocam" size={30} color="white" />
// //                   </View>
// //                   <Text style={styles.actionButtonText}>Video Call</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}
// //           </View>
// //         </ImageBackground>
// //       )}

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
// //                 <Text style={styles.modalCallType}>{isVideoCall ? "Video Call" : "Voice Call"}</Text>
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
// //     backgroundColor: 'rgba(0,0,0,0.5)',
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
// //     flex: 1,
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
// //   largeAvatarImage: {
// //     width: '80%',
// //     height: '80%',
// //     borderRadius: 100,
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   localVideo: {
// //     position: 'absolute',
// //     bottom: 100,
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: 'white',
// //     backgroundColor: '#000',
// //   },
// //   contactName: {
// //     fontSize: 32,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     marginTop: 10,
// //   },
// //   contactStatus: {
// //     fontSize: 16,
// //     color: '#fff',
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
// //     color: '#fff',
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
// // });







// /////////////////////////////////////// working ==========================================================

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
// // // ============================================

// // export default function VoiceVideoCallScreen({ navigation, route }) {
// //   const { profile_image, name, incomingOffer, isIncomingCall, targetUserId, isInitiator } = route.params || {};

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
// //   const [showIncomingModal, setShowIncomingModal] = useState(false);
// //   const [incomingSDP, setIncomingSDP] = useState(null);
// //   const [callDuration, setCallDuration] = useState(0);
// //   const [isVideoCall, setIsVideoCall] = useState(false);
// //   const [isCameraFront, setIsCameraFront] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isSpeakerOn, setIsSpeakerOn] = useState(false);

// //   const isCallerRef = useRef(false);
// //   const callTimerRef = useRef(null);
// //   const hasInitialOfferRef = useRef(false);
// //   const isCleaningUpRef = useRef(false);


  

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

// //   // ============ PEER CONNECTION =============
// // //   const ensurePeerConnection = async () => {
// // //     if (pc.current) return;

// // //     if (!rtcConfig.iceServers.length) {
// // //       await getIceServers();
// // //     }

// // //     pc.current = new RTCPeerConnection(rtcConfig);
// // //     console.log("[WebRTC] RTCPeerConnection created");

// // //     pc.current.onnegotiationneeded = null;

// // //     pc.current.onicecandidate = (evt) => {
// // //       if (evt.candidate) {
// // //         sendMessage({ type: "candidate", candidate: evt.candidate });
// // //       }
// // //     };

// // //     // pc.current.ontrack = (evt) => {
// // //     //   if (evt.streams && evt.streams[0]) {
// // //     //     remoteStream.current = evt.streams[0];
// // //     //     try {
// // //     //       setRemoteURL(remoteStream.current.toURL());
// // //     //     } catch {
// // //     //       // ignore if toURL not available
// // //     //     }
// // //     //     setWebrtcReady(true);
// // //     //   }
// // //     // };
// // //     pc.current.ontrack = (evt) => {
// // //   if (evt.streams && evt.streams[0]) {
// // //     remoteStream.current = evt.streams[0];
// // //     try {
// // //       setRemoteURL(remoteStream.current.toURL());
// // //     } catch {
// // //       // ignore if toURL not available
// // //     }
// // //     setWebrtcReady(true);
    
// // //     // 🔥 CRITICAL: Play the remote audio stream
// // //     playRemoteAudio(remoteStream.current);
// // //   }
// // // };

// // //   };
// // // ============ PEER CONNECTION =============
// // const ensurePeerConnection = async () => {
// //   if (pc.current) return;

// //   if (!rtcConfig.iceServers.length) {
// //     await getIceServers();
// //   }

// //   pc.current = new RTCPeerConnection(rtcConfig);
// //   console.log("[WebRTC] RTCPeerConnection created");

// //   pc.current.onnegotiationneeded = () => {
// //     console.log("[WebRTC] Negotiation needed");
// //   };

// //   pc.current.onicecandidate = (evt) => {
// //     if (evt.candidate) {
// //       sendMessage({ type: "candidate", candidate: evt.candidate });
// //     }
// //   };

// //   // FIXED: Better track handling
// //   pc.current.ontrack = (evt) => {
// //     console.log("[WebRTC] Track received:", evt.track.kind);
    
// //     if (evt.streams && evt.streams[0]) {
// //       remoteStream.current = evt.streams[0];
      
// //       // Check if this is a video track
// //       const videoTracks = remoteStream.current.getVideoTracks();
// //       if (videoTracks.length > 0) {
// //         console.log("[WebRTC] Video track detected");
// //         setIsVideoCall(true);
// //       }
      
// //       try {
// //         setRemoteURL(remoteStream.current.toURL());
// //       } catch {
// //         // ignore if toURL not available
// //       }
// //       setWebrtcReady(true);
      
// //       // Play the remote audio stream
// //       playRemoteAudio(remoteStream.current);
// //     }
// //   };

// //   // Handle connection state changes
// //   pc.current.onconnectionstatechange = () => {
// //     console.log("[WebRTC] Connection state:", pc.current.connectionState);
// //   };
// // };

// //   const playRemoteAudio = async (stream) => {
// //   try {
// //     // For React Native, we need to use InCallManager to handle audio routing
// //     InCallManager.start({ media: 'audio' });
// //     InCallManager.setSpeakerphoneOn(isSpeakerOn);
    
// //     console.log('[Audio] Remote audio stream received and playing');
// //   } catch (error) {
// //     console.error('[Audio] Failed to play remote audio:', error);
// //   }
// // };
// // useEffect(() => {
// //   // Setup InCallManager when component mounts
// //   InCallManager.setKeepScreenOn(true);
// //   InCallManager.setForceSpeakerphoneOn(false);
  
// //   return () => {
// //     // Cleanup when component unmounts
// //     InCallManager.stop();
// //     InCallManager.setKeepScreenOn(false);
// //   };
// // }, []);

// // // Improved toggleSpeaker function


// //   const ensureLocalStreamAndAttach = async (videoEnabled = isVideoCall) => {
// //     if (!localStream.current) {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) {
// //         Alert.alert("Permission denied", "Cannot access microphone or camera.");
// //         return false;
// //       }
// //       try {
// //         const s = await mediaDevices.getUserMedia({
// //           audio: true,
// //           video: videoEnabled ? { facingMode: isCameraFront ? "user" : "environment" } : false,
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
// //     // Apply initial mute state
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

// //   // const toggleSpeaker = async () => {
// //   //   try {
// //   //     if (localStream.current) {
// //   //       const audioTrack = localStream.current.getAudioTracks()[0];
// //   //       if (audioTrack) {
// //   //         // Note: react-native-webrtc doesn't directly support speakerphone control
// //   //         // This is a placeholder for platform-specific implementation
// //   //         // For Android, you might need native module integration
// //   //         setIsSpeakerOn(!isSpeakerOn);
// //   //         // For actual implementation, you may need to:
// //   //         // 1. Use react-native-sound or similar for Android
// //   //         // 2. Use AVAudioSession for iOS
// //   //         // Currently setting state for UI feedback
// //   //         console.log("[Audio] Speakerphone", !isSpeakerOn ? "enabled" : "disabled");
// //   //       }
// //   //     }
// //   //   } catch (e) {
// //   //     console.error("[Audio] Failed to toggle speaker:", e?.message || e);
// //   //   }
// //   // };
// // //   const toggleSpeaker = () => {
// // //   const newState = !isSpeakerOn;
// // //   InCallManager.setSpeakerphoneOn(newState); // 🔊 control loudspeaker
// // //   setIsSpeakerOn(newState);
// // //   console.log("[Audio] Speakerphone", newState ? "enabled" : "disabled");
// // // };
// // const toggleSpeaker = () => {
// //   const newState = !isSpeakerOn;
// //   InCallManager.setSpeakerphoneOn(newState);
// //   setIsSpeakerOn(newState);
// //   console.log("[Audio] Speakerphone", newState ? "enabled" : "disabled");
// // };

// // const startAudioSession = () => {
// //   InCallManager.start({ media: 'audio' });
// //   InCallManager.setSpeakerphoneOn(isSpeakerOn);
// // };

// // const stopAudioSession = () => {
// //   InCallManager.stop();
// // };

// //   // const switchToVideoCall = async () => {
// //   //   if (!webrtcReady) return;
    
// //   //   if (localStream.current) {
// //   //     localStream.current.getTracks().forEach((track) => track.stop());
// //   //     localStream.current = null;
// //   //   }

// //   //   setIsVideoCall(true);
// //   //   await ensureLocalStreamAndAttach(true);
    
// //   //   try {
// //   //     const offer = await pc.current.createOffer();
// //   //     await pc.current.setLocalDescription(offer);
// //   //     sendMessage({
// //   //       type: "offer",
// //   //       offer,
// //   //       isVideoCall: true,
// //   //     });
// //   //   } catch (e) {
// //   //     console.error("[WebRTC] Switch to video offer failed:", e?.message || e);
// //   //   }
// //   // };
// //   const switchToVideoCall = async () => {
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

// //   const switchCamera = async () => {
// //     if (!isVideoCall || !localStream.current) return;
    
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
// //     setIsVideoCall(false);
// //     setIsMuted(false);
// //     setIsSpeakerOn(false);
// //     isCleaningUpRef.current = false;
// //   };

// //   // =============== SIGNALING ================
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       ws.current.send(JSON.stringify(msg));
// //     }
// //   };

// //   const connectSignaling = async () => {
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

// //       await ensurePeerConnection();
// //       await ensureLocalStreamAndAttach(isVideoCall);

// //       if (isInitiator && targetUserId) {
// //         isCallerRef.current = true;
// //         await createAndSendInitialOffer();
// //       }
// //       if (!isInitiator && isIncomingCall && incomingOffer) {
// //         setIsVideoCall(incomingOffer.isVideoCall || false);
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
// //         // case "offer": {
// //         //   if (isCallerRef.current) return;
// //         //   setIncomingSDP(data.offer);
// //         //   setIsVideoCall(data.isVideoCall || false);
// //         //   setShowIncomingModal(true);
// //         //   break;
// //         // }
// //         case "offer": {
// //     if (data.isRenegotiation) {
// //       // This is a renegotiation for video
// //       console.log("[WebRTC] Received video renegotiation offer");
// //       await handleRenegotiationOffer(data.offer, data.isVideoCall);
// //     } else {
// //       // Original offer handling
// //       if (isCallerRef.current) return;
// //       setIncomingSDP(data.offer);
// //       setIsVideoCall(data.isVideoCall || false);
// //       setShowIncomingModal(true);
// //     }
// //     break;
// //   }

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
// //          Alert.alert(
// //             "Call Ended", 
// //             "Your call partner has disconnected"
// //           );
// //           endCall(false);
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

// //   // ============ OFFER/ANSWER FLOW ===========
// //   const createAndSendInitialOffer = async () => {
// //     if (hasInitialOfferRef.current) return;
// //     await ensurePeerConnection();
// //     const ok = await ensureLocalStreamAndAttach(isVideoCall);
// //     if (!ok || !pc.current) return;

// //     try {
// //       const userDataRaw = await AsyncStorage.getItem("userData");
// //       const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
// //       const callerInfo = {
// //         profileImage: userData.profile_picture || "",
// //         name: userData.name || "Caller",
// //       };

// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);

// //       sendMessage({
// //         type: "offer",
// //         offer: {
// //           ...offer,
// //           targetUserId: targetUserId,
// //           callerInfo,
// //           isVideoCall,
// //         },
// //       });
// //       hasInitialOfferRef.current = true;
// //       console.log("[WebRTC] Initial offer created & sent");
// //     } catch (e) {
// //       console.error("[WebRTC] createOffer/setLocalDescription failed:", e?.message || e);
// //     }
// //   };

// //   const handleIncomingCall = async (offer) => {
// //     try {
// //       await ensurePeerConnection();
// //       const ok = await ensureLocalStreamAndAttach(offer.isVideoCall || false);
// //       if (!ok || !pc.current) return;

// //       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
// //       await drainQueuedCandidates();

// //       const answer = await pc.current.createAnswer();
// //       await pc.current.setLocalDescription(answer);
      
// //       sendMessage({ 
// //         type: "answer", 
// //         answer,
// //         isVideoCall: offer.isVideoCall || false,
// //       });

// //       setWebrtcReady(true);
// //       setShowIncomingModal(false);
// //       setIncomingSDP(null);
// //     } catch (error) {
// //       console.error("Error handling incoming call:", error?.message || error);
// //       Alert.alert("Error", "Failed to accept call");
// //     }
// //   };

// //   // ================ LIFECYCLE ================
// //   useEffect(() => {
// //     connectSignaling();
// //     return () => {
// //       endCall(false);
// //     };
// //   }, []);

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
// //   // const startCall = async (video = false) => {
// //   //   setIsVideoCall(video);
// //   //   isCallerRef.current = true;
// //   //   await createAndSendInitialOffer();
// //   //   InCallManager.start({ media: 'audio' });
// //   //   InCallManager.setForceSpeakerphoneOn(false);
// //   // };

// //   // const acceptCall = async () => {
// //   //   isCallerRef.current = false;
// //   //   const offer = incomingSDP || incomingOffer;
// //   //   if (!offer) {
// //   //     Alert.alert("No offer", "No incoming offer to accept.");
// //   //     return;
// //   //   }
// //   //   await handleIncomingCall(offer);
// //   // };

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
// // const startCall = async (video = false) => {
// //   setIsVideoCall(video);
// //   isCallerRef.current = true;
  
// //   // Start audio session before creating offer
// //   startAudioSession();
  
// //   await createAndSendInitialOffer();
// // };

// // // Update endCall to properly stop audio
// // const endCall = (notify = true) => {
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

// //   const rejectCall = () => {
// //     sendMessage({ type: "call-ended" });
// //     setShowIncomingModal(false);
// //     setIncomingSDP(null);
// //   };

// //   // const endCall = (notify = true) => {
// //   //   try {
// //   //     if (notify) sendMessage({ type: "call-ended" });
// //   //   } catch {}
// //   //   try {
// //   //     if (ws.current) {
// //   //       ws.current.onopen = null;
// //   //       ws.current.onmessage = null;
// //   //       ws.current.onclose = null;
// //   //       ws.current.onerror = null;
// //   //       ws.current.close();
// //   //     }
// //   //     InCallManager.stop();
// //   //   } catch {}
// //   //   ws.current = null;
// //   //   cleanupPeerConnection();
// //   //   navigation.navigate('PHome');
// //   // };
// // // const endCall = (notify = true) => {
// // //   try {
// // //     if (notify) sendMessage({ type: "call-ended" });
// // //   } catch (e) {
// // //     console.warn("Error notifying call end:", e);
// // //   }

// // //   try {
// // //     if (ws.current) {
// // //       ws.current.onopen = null;
// // //       ws.current.onmessage = null;
// // //       ws.current.onclose = null;
// // //       ws.current.onerror = null;
// // //       ws.current.close();
// // //     }
// // //   } catch (e) {
// // //     console.warn("Error closing WebSocket:", e);
// // //   }

// // //   // Always stop InCallManager (audio session + speaker)
// // //   try {
// // //     InCallManager.stop();
// // //     InCallManager.stopRingtone();
// // //     InCallManager.stopRingback();
// // //     console.log("[Call] Audio session stopped");
// // //   } catch (e) {
// // //     console.warn("Error stopping InCallManager:", e);
// // //   }

// // //   ws.current = null;
// // //   cleanupPeerConnection();

// // //   navigation.navigate("PHome");
// // // };

// // // Add this to monitor audio state
// // useEffect(() => {
// //   if (webrtcReady && remoteStream.current) {
// //     // Check if remote audio is actually playing
// //     const audioTracks = remoteStream.current.getAudioTracks();
// //     if (audioTracks.length > 0) {
// //       console.log('[Audio] Remote audio track status:', {
// //         enabled: audioTracks[0].enabled,
// //         readyState: audioTracks[0].readyState,
// //         muted: audioTracks[0].muted
// //       });
// //     }
// //   }
// // }, [webrtcReady]);

// // // Add audio session error handling
// // // useEffect(() => {
// // //   const subscription = InCallManager.addListener('Proximity', (data) => {
// // //     console.log('[Audio] Proximity evehhnt:', data);
// // //   });
  
// // //   return () => subscription.remove();
// // // }, []);


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
// //         // <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
// //         //   {isVideoCall && remoteURL ? (
// //         //     <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
// //         //   ) : (
// //         //     <View style={styles.avatarContainer}>
// //         //       <View style={styles.avatar}>
// //         //         <Image
// //         //           source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //         //           style={styles.avatarImage}
// //         //           resizeMode="cover"
// //         //         />
// //         //       </View>
// //         //     </View>
// //         //   )}

// //         //   {isVideoCall && localURL && (
// //         //     <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
// //         //   )}

// //         //   <View style={styles.callHeader}>
// //         //     <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
// //         //     <Text style={styles.callerName}>{name}</Text>
// //         //     <Text style={styles.callStatus}>{isVideoCall ? "Video Call" : "Audio Call"}</Text>
// //         //   </View>

// //         //   <View style={styles.callControls}>
// //         //     <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //         //       <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //         //         <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //         //       </View>
// //         //       <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
// //         //     </TouchableOpacity>

// //         //     <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
// //         //       <View style={[styles.controlIcon, { backgroundColor: isSpeakerOn ? "#38a169" : "#4a5568" }]}>
// //         //         <Icon name={isSpeakerOn ? "volume-up" : "volume-off"} size={24} color="white" />
// //         //       </View>
// //         //       <Text style={styles.controlText}>{isSpeakerOn ? "Speaker Off" : "Speaker On"}</Text>
// //         //     </TouchableOpacity>

// //         //     {isVideoCall && (
// //         //       <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //         //         <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //         //           <Icon name="flip-camera-ios" size={24} color="white" />
// //         //         </View>
// //         //         <Text style={styles.controlText}>Switch</Text>
// //         //       </TouchableOpacity>
// //         //     )}

// //         //     <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// //         //       <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //         //         <Icon name="call-end" size={24} color="white" />
// //         //       </View>
// //         //       <Text style={styles.controlText}>End</Text>
// //         //     </TouchableOpacity>

// //         //     <TouchableOpacity 
// //         //       style={styles.controlButton} 
// //         //       onPress={isVideoCall ? () => setIsVideoCall(false) : switchToVideoCall}
// //         //     >
// //         //       <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //         //         <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
// //         //       </View>
// //         //       <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video On"}</Text>
// //         //     </TouchableOpacity>
// //         //   </View>
// //         // </LinearGradient>
       
// //         <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.callScreen}>
// //           {isVideoCall && remoteURL ? (
// //             <View style={styles.videoContainer}>
// //               <RTCView streamURL={remoteURL} style={styles.remoteVideo} objectFit="cover" />
              
// //               {/* Call info overlay */}
// //               <View style={styles.callInfoOverlay}>
// //                 <Text style={styles.callerName}>{name}</Text>
// //                 <Text style={styles.callTypeText}>
// //                   {isVideoCall ? "Video Call" : "Voice Call"} • {formatTime(callDuration)}
// //                 </Text>
// //               </View>
// //             </View>
// //           ) : (
// //             <View style={styles.avatarContainer}>
// //               <View style={styles.avatar}>
// //                 <Image
// //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                   style={styles.avatarImage}
// //                   resizeMode="cover"
// //                 />
// //               </View>
              
// //               {/* Call info for voice calls */}
// //               <View style={styles.voiceCallInfo}>
// //                 <Text style={styles.callerName}>{name}</Text>
// //                 <Text style={styles.callTypeText}>
// //                   Voice Call • {formatTime(callDuration)}
// //                 </Text>
// //               </View>
// //             </View>
// //           )}

// //           {isVideoCall && localURL && (
// //             <RTCView streamURL={localURL} style={styles.localVideo} objectFit="cover" />
// //           )}

// //           {/* Remove the duplicate call header since we've moved the info to overlays */}
// //             <View style={styles.callControls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
// //               <View style={[styles.controlIcon, { backgroundColor: isMuted ? "#e53e3e" : "#4a5568" }]}>
// //                 <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
// //               <View style={[styles.controlIcon, { backgroundColor: isSpeakerOn ? "#38a169" : "#4a5568" }]}>
// //                 <Icon name={isSpeakerOn ? "volume-up" : "volume-off"} size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>{isSpeakerOn ? "Speaker Off" : "Speaker On"}</Text>
// //             </TouchableOpacity>

// //             {isVideoCall && (
// //               <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
// //                 <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                   <Icon name="flip-camera-ios" size={24} color="white" />
// //                 </View>
// //                 <Text style={styles.controlText}>Switch</Text>
// //               </TouchableOpacity>
// //             )}

// //             <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
// //               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
// //                 <Icon name="call-end" size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>End</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={styles.controlButton} 
// //               onPress={isVideoCall ? () => setIsVideoCall(false) : switchToVideoCall}
// //             >
// //               <View style={[styles.controlIcon, { backgroundColor: "#4a5568" }]}>
// //                 <Icon name={isVideoCall ? "videocam-off" : "videocam"} size={24} color="white" />
// //               </View>
// //               <Text style={styles.controlText}>{isVideoCall ? "Video Off" : "Video"}</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </LinearGradient>
// //       ) : (
        
// //         <ImageBackground 
// //             source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} 
// //             style={{
// //               flex: 1,
// //               backgroundColor: '#1a202c',
// //               justifyContent: 'center',
// //               alignItems: 'center'
// //             }}
// //             blurRadius={10}
// //           >
// //             <View style={{
// //               backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //               width: '100%',
// //               height: '100%',
// //               justifyContent: 'center',
// //               alignItems: 'center',
// //               padding: 20
// //             }}>
// //               <View style={{
// //                 width: 180,
// //                 height: 180,
// //                 borderRadius: 90,
// //                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //                 marginBottom: 30,
// //                 borderWidth: 4,
// //                 borderColor: 'rgba(255, 255, 255, 0.2)'
// //               }}>
// //                 <Image
// //                   source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }}
// //                   style={{
// //                     width: 160,
// //                     height: 160,
// //                     borderRadius: 80,
// //                   }}
// //                   resizeMode="cover"
// //                 />
// //               </View>
              
// //               <Text style={{
// //                 color: 'white',
// //                 fontSize: 28,
// //                 fontWeight: 'bold',
// //                 marginBottom: 10
// //               }}>{name}</Text>
              
// //               <Text style={{
// //                 color: 'rgba(255, 255, 255, 0.8)',
// //                 fontSize: 16,
// //                 marginBottom: 40
// //               }}>
// //                 {wsConnected 
// //                   ? (isInitiator 
// //                       ? "Please wait while call is connecting..." 
// //                       : "Waiting for call") 
// //                   : "Connecting..."
// //                 }
// //               </Text>

// //               {isInitiator && (
// //                 <View style={{
// //                   flexDirection: 'row',
// //                   justifyContent: 'space-around',
// //                   width: '100%',
// //                   maxWidth: 350
// //                 }}>
// //                   <TouchableOpacity 
// //                     style={{
// //                       alignItems: 'center'
// //                     }} 
// //                     onPress={() => startCall(false)}
// //                     disabled={wsConnected ? false : true}
// //                   >
// //                     <View style={{
// //                       width: 70,
// //                       height: 70,
// //                       borderRadius: 35,
// //                       backgroundColor: wsConnected ? "#38a169" : "#718096",
// //                       justifyContent: 'center',
// //                       alignItems: 'center',
// //                       marginBottom: 10
// //                     }}>
// //                       <Icon name="call" size={30} color="white" />
// //                     </View>
// //                     <Text style={{
// //                       color: 'white',
// //                       fontSize: 14
// //                     }}>Voice Call</Text>
// //                   </TouchableOpacity>

// //                   <TouchableOpacity 
// //                     style={{
// //                       alignItems: 'center'
// //                     }} 
// //                     onPress={() => startCall(true)}
// //                     disabled={wsConnected ? false : true}
// //                   >
// //                     <View style={{
// //                       width: 70,
// //                       height: 70,
// //                       borderRadius: 35,
// //                       backgroundColor: wsConnected ? "#3182ce" : "#718096",
// //                       justifyContent: 'center',
// //                       alignItems: 'center',
// //                       marginBottom: 10
// //                     }}>
// //                       <Icon name="videocam" size={30} color="white" />
// //                     </View>
// //                     <Text style={{
// //                       color: 'white',
// //                       fontSize: 14
// //                     }}>Video Call</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               )}
// //             </View>
// //           </ImageBackground>
// //       )}

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
// //                 <Text style={styles.modalCallType}>{isVideoCall ? "Video Call" : "Voice Call"}</Text>
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
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     alignItems: 'center',
// //     width: '100%',
   
// //     opacity: 0.9,
// //     backgroundColor: '#000',
// //     position: 'relative',

// //   },
// //   preCallContent: {
// //     alignItems: 'center',
// //     width: '100%',
// //     padding: 20,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
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
// //     flex: 1,
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
// //   largeAvatarImage: {
// //     width: '80%',
// //     height: '80%',
// //     borderRadius: 100,
// //   },
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //   },
// //   localVideo: {
// //     position: 'absolute',
// //     bottom: 100,
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: 'white',
// //     backgroundColor: '#000',
// //   },
// //   contactName: {
// //     fontSize: 32,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     marginTop: 10,
// //   },
// //   contactStatus: {
// //     fontSize: 16,
// //     color: '#fff',
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
// //     color: '#fff',
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
// //     alignziehItems: 'center',
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
// //    videoContainer: {
// //     flex: 1,
// //     width: '100%',
// //     position: 'relative',
// //   },
  
// //   callInfoOverlay: {
// //     position: 'absolute',
// //     top: 50, // Increased top margin for better visibility
// //     left: 0,
// //     right: 0,
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better contrast
// //     padding: 15,
// //     zIndex: 100, // Higher z-index to ensure it's above video
// //     borderBottomLeftRadius: 15,
// //     borderBottomRightRadius: 15,
// //   },
  
// //   voiceCallInfo: {
// //     alignItems: 'center',
// //     marginTop: 30, // More space above the info
// //     padding: 20,
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     borderRadius: 15,
// //   },
  
// //   callerName: {
// //     fontSize: 26, // Slightly larger font
// //     fontWeight: 'bold',
// //     color: 'white',
// //     marginBottom: 8,
// //     textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for better readability
// //     textShadowOffset: { width: 1, height: 1 },
// //     textShadowRadius: 3,
// //   },
  
// //   callTypeText: {
// //     fontSize: 16,
// //     color: 'rgba(255, 255, 255, 0.9)', // Brighter text
// //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
// //     textShadowOffset: { width: 1, height: 1 },
// //     textShadowRadius: 2,
// //   },
  
// //   localVideo: {
// //     position: 'absolute',
// //     bottom: 120, // Adjusted to not overlap with controls
// //     right: 20,
// //     width: 120,
// //     height: 160,
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: 'white',
// //     backgroundColor: '#000',
// //     zIndex: 50, // Lower than overlay but higher than remote video
// //   },
  
// //   remoteVideo: {
// //     flex: 1,
// //     width: '100%',
// //     backgroundColor: '#000',
// //     zIndex: 1, // Lowest z-index
// //   },
  
// //   callControls: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     marginBottom: 40,
// //     zIndex: 100, // High z-index to stay above everything
// //   },
// // });
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
