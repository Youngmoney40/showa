

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ImageBackground } from 'react-native';
// import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// const VoiceCallScreen = ({navigation, route}) => {
//   // Extract parameters with defaults
//   const {
//     receiverId,
//     name,
//     isCaller = true,
//     roomId = 'default-room',
//     callStatus = 'outgoing'
//   } = route.params || {};

//   // Generate unique ID for this client
//   const currentUserId = useRef(`user-${Math.random().toString(36).substring(2, 9)}`);
  
//   // State and refs
//   const [callStarted, setCallStarted] = useState(callStatus === 'active');
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [isMuted, setIsMuted] = useState(false);
//   const [queuedCandidatesCount, setQueuedCandidatesCount] = useState(0);
//   const connectionTimeout = useRef(null);
//   const [callInitiated, setCallInitiated] = useState(false);
//   const pc = useRef(null);
//   const ws = useRef(null);
//   const queuedCandidates = useRef([]);
//   const queuedRemoteCandidates = useRef([]);
//   const isRemoteDescriptionSet = useRef(false);
//   const audioBg = { uri: 'https://images.unsplash.com/photo-1549921296-3a6b5cd0c24b?auto=format&fit=crop&w=800&q=80' };

//   // Get local media stream
//   const getLocalStream = async () => {
//     try {
//       const stream = await mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           channelCount: 1
//         }
//       });
//       setLocalStream(stream);
//       return stream;
//     } catch (error) {
//       console.error('[Media] Error getting local stream:', error);
//       Alert.alert('Microphone Access', 'Please enable microphone permissions in settings');
//       return null;
//     }
//   };

//   // Create peer connection
//   const createPeerConnection = () => {
//     console.log(`[WebRTC] Creating peer connection for room: ${roomId}`);
    
//     const configuration = {
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         {
//           urls: [
//             'turn:openrelay.metered.ca:80?transport=udp',
//             'turn:openrelay.metered.ca:443?transport=tcp',
//             'turns:openrelay.metered.ca:443?transport=tcp'
//           ],
//           username: 'openrelayproject',
//           credential: 'openrelayproject'
//         }
//       ],
//       iceTransportPolicy: 'all',
//       iceCandidatePoolSize: 10
//     };

//     pc.current = new RTCPeerConnection(configuration);

//     pc.current.onconnectionstatechange = () => {
//         const state = pc.current.connectionState;
//         console.log(`[WebRTC] Connection state: ${state}`);
//         setConnectionStatus(state);
        
//         if (state === 'connected') {
//           if (connectionTimeout.current) {
//             clearTimeout(connectionTimeout.current);
//           }
//           console.log('[WebRTC] Call connected!');
//           processQueuedRemoteCandidates();
//         } 
//         else if (state === 'failed') {
//           Alert.alert('Connection Failed', 'Unable to establish connection. Please try again.');
//           endCall();
//         }
//       };


//   //   pc.current.onconnectionstatechange = () => {
//   //   const state = pc.current.connectionState;
//   //   console.log('[WebRTC] Connection state changed:', state);
//   //   if (state === 'failed') {
//   //     console.warn('[WebRTC] Connection failed, attempting to recover...');
//   //     pc.current.restartIce();
//   //   }
//   // };

//     // Event handlers
//     pc.current.ontrack = (e) => {
//       console.log(`[WebRTC] Received remote track: ${e.track.kind}`);
//       if (e.streams && e.streams.length > 0) {
//         console.log(`[WebRTC] Setting remote stream with ${e.streams[0].getTracks().length} tracks`);
//         setRemoteStream(e.streams[0]);
//       }
//     };

//     pc.current.onicecandidate = (e) => {
//       if (e.candidate) {
//         console.log(`[WebRTC] Generated ICE candidate: ${e.candidate.candidate.substring(0, 50)}...`);
//         if (ws.current?.readyState === WebSocket.OPEN) {
//           ws.current.send(JSON.stringify({
//             type: 'ice-candidate',
//             candidate: e.candidate,
//             senderId: currentUserId.current
//           }));
//         } else {
//           console.log('[WebRTC] Queuing ICE candidate (WS not open)');
//           queuedCandidates.current.push({
//             type: 'ice-candidate',
//             candidate: e.candidate,
//             senderId: currentUserId.current
//           });
//         }
//       } else {
//         console.log('[WebRTC] ICE gathering complete');
//       }
//     };

//     pc.current.onicecandidateerror = (e) => {
//       console.error('[WebRTC] ICE candidate error:', e.errorCode, e.errorText);
//     };

//     pc.current.onconnectionstatechange = () => {
//       console.log('Connection state changed to:', pc.current.connectionState);
//       const state = pc.current.connectionState;
//       console.log(`[WebRTC] Connection state: ${state}`);
//       setConnectionStatus(state);
      
//       if (state === 'connected') {
//         console.log('[WebRTC] Call successfully connected!');
//         processQueuedRemoteCandidates();
//       } else if (state === 'failed') {
//         Alert.alert('Connection Failed', 'Unable to establish connection. Please try again.');
//       }
//     };

//     pc.current.oniceconnectionstatechange = () => {
//       const iceState = pc.current.iceConnectionState;
//       console.log(`[WebRTC] ICE connection state: ${iceState}`);
      
//       if (iceState === 'connected' || iceState === 'completed') {
//         console.log('[WebRTC] ICE connected, processing queued candidates');
//         processQueuedRemoteCandidates();
//       }
//     };

//     pc.current.onsignalingstatechange = () => {
//       const signalingState = pc.current.signalingState;
//       console.log(`[WebRTC] Signaling state: ${signalingState}`);
      
//       if (signalingState === 'stable') {
//         isRemoteDescriptionSet.current = true;
//         processQueuedRemoteCandidates();
//       }
//     };

//     pc.current.onicegatheringstatechange = () => {
//       console.log(`[WebRTC] ICE gathering state: ${pc.current.iceGatheringState}`);
//     };

//     pc.current.onnegotiationneeded = () => {
//       console.log('[WebRTC] Negotiation needed');
//     };
//   };

//   // Process queued remote ICE candidates
//   const processQueuedRemoteCandidates = async () => {
//     if (queuedRemoteCandidates.current.length === 0) return;
    
//     console.log(`[WebRTC] Processing ${queuedRemoteCandidates.current.length} queued remote candidates`);
//     setQueuedCandidatesCount(queuedRemoteCandidates.current.length);
    
//     while (queuedRemoteCandidates.current.length > 0) {
//       const candidate = queuedRemoteCandidates.current.shift();
//       try {
//         console.log(`[WebRTC] Adding queued ICE candidate: ${candidate.candidate.substring(0, 50)}...`);
//         await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (err) {
//         console.error('[WebRTC] Error adding queued ICE candidate:', err);
//       }
//     }
    
//     setQueuedCandidatesCount(0);
//   };

//   // Setup WebSocket connection with self-message filtering
//   const setupWebSocket = () => {
//     console.log(`[WebSocket] Connecting to room: ${roomId} as ${currentUserId.current}`);
    
//     ws.current = new ReconnectingWebSocket(`ws://showa.essential.com.ng/ws/call/${roomId}/`);
    
//     ws.current.onopen = () => {
//       console.log('[WebSocket] Connection established');
//       setConnectionStatus('connecting');
      
//       // Send join notification
//       const joinMsg = { 
//         type: 'user-joined',
//         userId: currentUserId.current,
//         userName: name,
//         senderId: currentUserId.current
//       };
      
//       if (ws.current.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify(joinMsg));
//       } else {
//         queuedCandidates.current.push(joinMsg);
//       }
      
//       // Process queued messages
//       if (queuedCandidates.current.length > 0) {
//         console.log(`[WebSocket] Sending ${queuedCandidates.current.length} queued messages`);
//         queuedCandidates.current.forEach(msg => {
//           ws.current.send(JSON.stringify(msg));
//         });
//         queuedCandidates.current = [];
//       }
//     };

//     ws.current.onerror = (e) => {
//       console.error('[WebSocket] Error:', e.message);
//     };

//     ws.current.onclose = (e) => {
//       console.log('[WebSocket] Closed:', e.code, e.reason);
//       setConnectionStatus('disconnected');
//     };

//     ws.current.onmessage = async (e) => {
//   try {
//     // 1. First log the raw message for debugging
//     console.log('[WebSocket] Raw message received:', e.data);

//     // 2. Validate message format
//     if (typeof e.data !== 'string' || !e.data.trim()) {
//       console.warn('[WebSocket] Received empty or non-string message');
//       return;
//     }

//     // 3. Handle keep-alive messages
//     if (e.data === 'ping' || e.data === 'pong') {
//       console.log('[WebSocket] Received keep-alive');
//       return;
//     }

//     // 4. Parse JSON data safely
//     let data;
//     try {
//       data = JSON.parse(e.data);
//     } catch (parseError) {
//       console.error('[WebSocket] Failed to parse message:', parseError);
//       return;
//     }

//     // 5. Validate message structure
//     if (!data || typeof data !== 'object' || !data.type) {
//       console.warn('[WebSocket] Invalid message format:', data);
//       return;
//     }


//     console.log(`[WebSocket] Handling ${data.type} message from ${data.senderId || 'unknown'}`);

//     // 6. Handle call offer separately (before self-message check)
//     // if (data.type === 'call-offer') {
//     //   if (data.roomId && data.callerName) {
//     //     console.log('[Call] Received incoming call offer');
//         // navigation.navigate('VoiceCalls', {
//         //   isCaller: false,
//         //   name: data.callerName,
//         //   roomId: data.roomId,
//         //   callStatus: 'active'
//         // });
//     //   } else {
//     //     console.warn('[WebSocket] Invalid call-offer message:', data);
//     //   }
//     //   return;
//     // }

//     if (data.type === 'call-offer') {
//         // Only handle if we're the callee
//         if (!isCaller && !callStarted) {
//           console.log('[Call] Received incoming call offer');
//           // Process the offer
//               navigation.navigate('VoiceCalls', {
//           isCaller: false,
//           name: data.callerName,
//           roomId: data.roomId,
//           callStatus: 'active'
//         });
//         }
//         return;
//       }

//     // 7. Filter out messages from self (after handling call-offer)
//     if (data.senderId === currentUserId.current) {
//       console.log('[WebSocket] Ignoring message from self');
//       return;
//     }

//     // 8. Handle all WebRTC signaling messages
//     switch (data.type) {
//       case 'active_calls':
//         console.log('[WebSocket] Active calls update:', data.calls);
//         break;

//       case 'offer':
//         if (!isCaller && pc.current) {
//           try {
//             console.log('[WebRTC] Received offer, setting remote description');
//             await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//             isRemoteDescriptionSet.current = true;
            
//             console.log('[WebRTC] Creating answer');
//             const answer = await pc.current.createAnswer();
            
//             console.log('[WebRTC] Setting local description (answer)');
//             await pc.current.setLocalDescription(answer);
            
//             const answerMsg = {
//               type: 'answer',
//               sdp: answer.sdp,
//               senderId: currentUserId.current
//             };
            
//             if (ws.current.readyState === WebSocket.OPEN) {
//               ws.current.send(JSON.stringify(answerMsg));
//               console.log('[WebRTC] Answer sent');
//             } else {
//               console.log('[WebRTC] Queuing answer (WS not open)');
//               queuedCandidates.current.push(answerMsg);
//             }
            
//             processQueuedRemoteCandidates();
//           } catch (err) {
//             console.error('[WebRTC] Error handling offer:', err);
//           }
//         }
//         break;

//       case 'answer':
//         if (isCaller && pc.current) {
//           try {
//             console.log('[WebRTC] Received answer');
//             await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//             isRemoteDescriptionSet.current = true;
//             processQueuedRemoteCandidates();
//           } catch (err) {
//             console.error('[WebRTC] Error handling answer:', err);
//           }
//         }
//         break;

//       // FIX 15: Better ICE candidate handling
//       case 'ice-candidate':
//         if (pc.current && pc.current.signalingState !== 'closed') {
//           try {
//             console.log(`[WebRTC] Received ICE candidate`);
//             await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//           } catch (err) {
//             console.error('[WebRTC] Error adding ICE candidate:', err);
//             // Queue candidate if not ready
//             if (!isRemoteDescriptionSet.current) {
//               console.log('[WebRTC] Queuing ICE candidate');
//               queuedRemoteCandidates.current.push(data.candidate);
//               setQueuedCandidatesCount(prev => prev + 1);
//             }
//           }
//         }
//         break;

//       case 'user-joined':
//         case 'user-left':
//           if (data.userName) {
//             const action = data.type === 'user-joined' ? 'joined' : 'left';
//             console.log(`[Call] User ${action}: ${data.userName}`);
//             Alert.alert(`User ${action}`, `${data.userName} has ${action} the call`);
//           }
//           break;

//       case 'call-ended':
//         console.log('[Call] Remote user ended the call');
//         Alert.alert('Call Ended', 'The other participant has left the call');
//         endCall();
//         break;

//       default:
//         console.warn(`[WebSocket] Unhandled message type: ${data.type}`);
//     }
//   } catch (error) {
//     console.error('[WebSocket] Error in message handler:', error);
//   }
// };
//   }
// const rejectCall = () => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({ 
//         type: 'call-rejected',
//         senderId: currentUserId.current
//       }));
//     }
//     endCall();
//   };
//   // Start call process
//   const startCall = async () => {
//     try {

//        connectionTimeout.current = setTimeout(() => {
//         if (pc.current && pc.current.connectionState !== 'connected') {
//           console.warn('[WebRTC] Connection timeout');
//           Alert.alert('Connection Timeout', 'Could not connect to the other user');
//           endCall();
//         }
//       }, 30000);


//     console.log('[WebRTC] Creating offer');
//     const offer = await pc.current.createOffer({
//       offerToReceiveAudio: true
//     });


      
      
//       console.log('[WebRTC] Setting local description (offer)');
//       await pc.current.setLocalDescription(offer);
      
      
//       const offerMsg = {
//         type: 'offer',
//         sdp: offer.sdp,
//         senderId: currentUserId.current,
//         roomId: roomId  // FIX 8: Add roomId to message
//       };
      
     
//        if (ws.current?.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify(offerMsg));
//         console.log('[WebRTC] Offer sent');
//       } else {
//         console.log('[WebRTC] Queuing offer (WS not open)');
//         queuedCandidates.current.push(offerMsg);
//       }
      
//       setCallStarted(true);
//     } catch (error) {
//       console.error('[WebRTC] Error starting call:', error);
//       Alert.alert('Connection Error', 'Failed to start the call');
//     }
//   };

//   // Join existing call
//   const joinCall = () => {
//     console.log('[Call] Joining existing call');
//     startCall();
//   };

//   // Toggle mute state
//   const toggleMute = () => {
//     if (localStream) {
//       const newMuteState = !isMuted;
//       localStream.getAudioTracks().forEach(track => {
//         track.enabled = !newMuteState;
//       });
//       setIsMuted(newMuteState);
//       console.log(`[Audio] ${newMuteState ? 'Muted' : 'Unmuted'} microphone`);
//     }
//   };

//   // Initialize call
//   // const initCall = async () => {
//   //   console.log('[Call] Initializing call', {
//   //     isCaller,
//   //     roomId,
//   //     callStatus
//   //   });
    
//   //   const stream = await getLocalStream();
//   //   if (!stream) {
//   //     Alert.alert('Error', 'Microphone not available');
//   //     navigation.goBack();
//   //     return;
//   //   }
    
//   //   createPeerConnection();
//   //   setupWebSocket();
    
//   //   // Add local tracks to PC
//   //   stream.getAudioTracks().forEach(track => {
//   //     pc.current.addTrack(track, stream);
//   //   });

//   //   // Start call if we're the initiator or joining an active call
//   //   if (isCaller || callStatus === 'active') {
//   //     startCall();
//   //   }
//   // };
//   const initCall = async () => {
//     if (callInitiated) return;
//     setCallInitiated(true);
    
//     console.log('[Call] Initializing call', {
//       isCaller,
//       roomId,
//       callStatus
//     });
    
//     try {
//       const stream = await getLocalStream();
//       if (!stream) {
//         Alert.alert('Error', 'Microphone not available');
//         navigation.goBack();
//         return;
//       }
      
//       createPeerConnection();
//       setupWebSocket();
      
//       // Add local tracks to PC
//       stream.getAudioTracks().forEach(track => {
//         pc.current.addTrack(track, stream);
//       });

//       // FIX 11: Only start call if we're the caller
//       if (isCaller) {
//         startCall();
//       }
//     } catch (error) {
//       console.error('[Call] Initialization error:', error);
//       endCall();
//     }
//   };

//   // End call cleanup
//   const endCall = () => {
//     console.log('[Call] Ending call');
//      if (connectionTimeout) {
//     clearTimeout(connectionTimeout);
//   }
//     // Notify other participants
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({ 
//         type: 'call-ended',
//         senderId: currentUserId.current
//       }));
//     }
    
//     if (pc.current) {
//       pc.current.close();
//       pc.current = null;
//     }
    
//     if (ws.current) {
//       ws.current.close();
//       ws.current = null;
//     }
    
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
    
//     setRemoteStream(null);
//     setCallStarted(false);
//     setConnectionStatus('disconnected');
//     queuedCandidates.current = [];
//     queuedRemoteCandidates.current = [];
//     setQueuedCandidatesCount(0);
//     isRemoteDescriptionSet.current = false;
    
//     navigation.goBack();
//   };

//   useEffect(() => {
//     initCall();
//     return () => {
//       if (pc.current || ws.current) {
//         endCall();
//       }
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground source={audioBg} style={styles.background} resizeMode="cover">
//         <View style={styles.overlay}>
//           <FontAwesome5 
//             name={isMuted ? "microphone-slash" : "microphone-alt"} 
//             size={64} 
//             color={isMuted ? "#ff6b6b" : "#4cd964"} 
//           />
//           <Text style={styles.title}>Voice Call with {name}</Text>
          
//           <View style={styles.statusContainer}>
//             <View style={[
//               styles.statusIndicator, 
//               connectionStatus === 'connected' ? styles.connected : {},
//               connectionStatus === 'connecting' ? styles.connecting : {},
//               connectionStatus === 'disconnected' ? styles.disconnected : {}
//             ]} />
//             <Text style={styles.statusText}>
//               {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
//             </Text>
//           </View>
          
//           <View style={styles.statsContainer}>
//             <Text style={styles.statsText}>
//               {queuedCandidatesCount > 0 
//                 ? `${queuedCandidatesCount} queued ICE candidates` 
//                 : 'Connection stable'}
//             </Text>
//             <Text style={styles.statsText}>
//               Room: {roomId}
//             </Text>
//             <Text style={styles.statsText}>
//               ID: {currentUserId.current.substring(0, 8)}
//             </Text>
//           </View>
          
//           {/* Stream Visualizers */}
//           <View style={styles.visualizers}>
//             <AudioVisualizer stream={localStream} label="Your Microphone" />
//             <AudioVisualizer stream={remoteStream} label="Remote Audio" />
//           </View>
//         </View>
//       </ImageBackground>

//       <View style={styles.controls}>
//         {/* {!callStarted && !isCaller ? (
//           <TouchableOpacity 
//             style={[styles.button, styles.accept]} 
//             onPress={joinCall}
//           >
//             <FontAwesome5 name="phone" size={18} color="#fff" />
//             <Text style={styles.buttonText}>Join Call</Text>
//           </TouchableOpacity>
//         ) : null} */}
//         {!callStarted && !isCaller && (
//           <>
//             <TouchableOpacity 
//               style={[styles.button, styles.accept]} 
//               onPress={startCall} // FIX 17: Use startCall for callee
//             >
//               <FontAwesome5 name="phone" size={18} color="#fff" />
//               <Text style={styles.buttonText}>Answer</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[styles.button, styles.reject]} 
//               onPress={rejectCall}
//             >
//               <FontAwesome5 name="phone-slash" size={18} color="#fff" />
//               <Text style={styles.buttonText}>Decline</Text>
//             </TouchableOpacity>
//           </>
//         )}
        
//         {callStarted ? (
//           <TouchableOpacity 
//             style={[styles.button, isMuted ? styles.muted : styles.unmuted]} 
//             onPress={toggleMute}
//           >
//             <FontAwesome5 
//               name={isMuted ? "microphone-slash" : "microphone"} 
//               size={18} 
//               color="#fff" 
//             />
//             <Text style={styles.buttonText}>
//               {isMuted ? 'Unmute' : 'Mute'}
//             </Text>
//           </TouchableOpacity>
//         ) : null}
        
//         <TouchableOpacity 
//           style={[styles.button, styles.end]} 
//           onPress={endCall}
//         >
//           <FontAwesome5 name="phone-slash" size={18} color="#fff" />
//           <Text style={styles.buttonText}>End Call</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // Audio visualizer component
// const AudioVisualizer = ({ stream, label }) => {
//   if (!stream) return (
//     <View style={styles.visualizer}>
//       <Text style={styles.visualizerText}>{label}: No stream</Text>
//     </View>
//   );
  
//   return (
//     <View style={styles.visualizer}>
//       <Text style={styles.visualizerText}>{label}: {stream.getAudioTracks().length} track(s)</Text>
//       {stream.getAudioTracks().map((track, i) => (
//         <Text key={i} style={styles.visualizerText}>
//           Track {i}: {track.enabled ? '✅' : '❌'} | 
//           {track.muted ? '🔇' : '🔊'} | 
//           Kind: {track.kind} | 
//           State: {track.readyState}
//         </Text>
//       ))}
//     </View>
//   );
// };



// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#111' 
//   },
//   background: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   overlay: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     width: '90%'
//   },
//   title: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: '800',
//     marginTop: 16,
//     letterSpacing: 0.5,
//     textAlign: 'center'
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16
//   },
//   statusIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8
//   },
//   connecting: { 
//     backgroundColor: '#ffcc00' 
//   },
//   connected: { 
//     backgroundColor: '#4cd964' 
//   },
//   disconnected: { 
//     backgroundColor: '#ff3b30' 
//   },
//   statusText: {
//     color: '#ddd',
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   statsContainer: {
//     marginTop: 8,
//     alignItems: 'center'
//   },
//   statsText: {
//     color: '#bbb',
//     fontSize: 14,
//     marginVertical: 2
//   },
//   visualizers: {
//     width: '100%',
//     marginTop: 20
//   },
//   visualizer: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     borderRadius: 8,
//     width: '100%'
//   },
//   visualizerText: {
//     color: '#fff',
//     fontSize: 12,
//     marginVertical: 2
//   },
//   controls: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderColor: '#333',
//     backgroundColor: '#1c1c1c',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center'
//   },
//   button: {
//     flexDirection: 'row',
//     gap: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 40,
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     minWidth: 100
//   },
//   accept: { 
//     backgroundColor: '#25d366',
//   },
//   end: { 
//     backgroundColor: '#e53935' 
//   },
//   muted: {
//     backgroundColor: '#ff9500'
//   },
//   unmuted: {
//     backgroundColor: '#007aff'
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//     marginLeft: 4,
//   },
// });



//  export default VoiceCallScreen;


//////////////////// working ==============================================
// import React, { useEffect, useRef, useState } from "react";
// import { View, Button, Text, StyleSheet } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
//   MediaStream
// } from "react-native-webrtc";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng/ws/call";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(new MediaStream());
//   const [connected, setConnected] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);

//   // Connect WebSocket once
//   useEffect(() => {
//     ws.current = new WebSocket(`${SIGNALING_SERVER}/${ROOM_ID}/`);

//     ws.current.onopen = () => {
//       console.log("[WebSocket] Connected to room:", ROOM_ID);
//     };

//     ws.current.onmessage = async (message) => {
//       const data = JSON.parse(message.data);
//       console.log("[WebSocket] Received:", data);

//       if (data.type === "offer" && !isCaller) {
//         console.log("[Call] Received offer");
//         await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//         const answer = await pc.current.createAnswer();
//         await pc.current.setLocalDescription(answer);
//         sendMessage({ type: "answer", answer });
//       }

//       if (data.type === "answer" && isCaller) {
//         console.log("[Call] Received answer");
//         await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//       }

//       if (data.type === "candidate") {
//         console.log("[Call] Adding ICE candidate");
//         try {
//           await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//         } catch (err) {
//           console.error("Error adding ICE candidate", err);
//         }
//       }
//     };

//     return () => {
//       ws.current?.close();
//       pc.current?.close();
//     };
//   }, []);

//   // Create peer connection
//   const createPeerConnection = async () => {
//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
//     });

//     // Handle ICE candidates
//     pc.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         sendMessage({ type: "candidate", candidate: event.candidate });
//       }
//     };

//     // Handle remote track
//     pc.current.ontrack = (event) => {
//       console.log("Remote track received");
//       event.streams[0].getTracks().forEach((track) => {
//         remoteStream.current.addTrack(track);
//       });
//     };

//     // Get local media
//     localStream.current = await mediaDevices.getUserMedia({ audio: true });
//     localStream.current.getTracks().forEach((track) => {
//       pc.current.addTrack(track, localStream.current);
//     });

//     setConnected(true);
//   };

//   const sendMessage = (msg) => {
//     ws.current.send(JSON.stringify(msg));
//   };

//   const startCall = async () => {
//     setIsCaller(true);
//     await createPeerConnection();
//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);
//     sendMessage({ type: "offer", offer });
//   };

//   const joinCall = async () => {
//     setIsCaller(false);
//     await createPeerConnection();
//     console.log("[Call] Ready to receive offer...");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>
//       {!connected && (
//         <>
//           <Button title="Start Call (User A)" onPress={startCall} />
//           <Button title="Join Call (User B)" onPress={joinCall} />
//         </>
//       )}

//       {/* Local preview */}
//       {localStream.current && (
//         <RTCView
//           streamURL={localStream.current.toURL()}
//           style={styles.video}
//           mirror
//         />
//       )}

//       {/* Remote audio (hidden) */}
//       {remoteStream.current && (
//         <RTCView
//           streamURL={remoteStream.current.toURL()}
//           style={{ width: 0, height: 0 }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 18, textAlign: "center", marginBottom: 20 },
//   video: { width: "100%", height: 100, backgroundColor: "#ccc", marginTop: 20 }
// });

/////////////////////////// end working code========
// VoiceCallScreen.js


// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);

//   const rtcConfig = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   // Request microphone permission for Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   const cleanupPeerConnection = () => {
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//   };

//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection(rtcConfig);

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//     // Caller creates and sends offer on negotiationneeded
//     pc.current.onnegotiationneeded = async () => {
//       if (isCaller) {
//         try {
//           const offer = await pc.current.createOffer();
//           await pc.current.setLocalDescription(offer);
//           sendMessage({ type: "offer", offer });
//         } catch (err) {
//           console.error("Negotiation failed:", err);
//         }
//       }
//     };

//     pc.current.ontrack = (evt) => {
//       console.log("Remote track received:", evt.track.kind);
//       if (evt.streams && evt.streams[0]) {
//         remoteStream.current = evt.streams[0];
//         setRemoteURL(remoteStream.current.toURL());
//         setWebrtcReady(true);
//       }
//     };
//   };

//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return;
//       }

//       try {
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//         setLocalURL(s.toURL());
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return;
//       }
//     }

//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         pc.current.addTrack(track, localStream.current);
//       }
//     });
//   };

//   const drainQueuedCandidates = async () => {
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("addIceCandidate error:", err);
//       }
//     }
//   };

//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         return;
//       }

//       switch (data.type) {
//         case "offer":
//           if (isCaller) return; // ignore own offer

//           await ensurePeerConnection();
//           await ensureLocalStreamAndAttach();

//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(data.offer)
//           );

//           await drainQueuedCandidates();

//           const answer = await pc.current.createAnswer();
//           await pc.current.setLocalDescription(answer);
//           sendMessage({ type: "answer", answer });
//           break;

//         case "answer":
//           if (!isCaller) return;

//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(data.answer)
//           );

//           await drainQueuedCandidates();
//           break;

//         case "candidate":
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//             } catch (err) {
//               console.warn("addIceCandidate error:", err);
//             }
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//     setIsCaller(true);
//     await ensurePeerConnection();
//     await ensureLocalStreamAndAttach();
//     // Offer creation triggered by onnegotiationneeded event
//   };

//   const joinCall = async () => {
//     setIsCaller(false);
//     await ensurePeerConnection();
//     await ensureLocalStreamAndAttach();
//     // Wait for offer from caller
//   };

//   const endCall = (manual = true) => {
//     if (manual) {
//       sendMessage({ type: "call-ended" });
//     }
//     cleanupPeerConnection();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button title="Start Call" onPress={startCall} disabled={!wsConnected || webrtcReady} />
//         <View style={{ width: 12 }} />
//         <Button title="Join Call" onPress={joinCall} disabled={!wsConnected || webrtcReady} />
//         <View style={{ width: 12 }} />
//         <Button title="End Call" onPress={() => endCall(true)} disabled={!webrtcReady} />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {/* Local audio stream preview (optional video preview can be added here) */}
//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {/* Remote audio stream must be rendered (even invisible) to output audio */}
//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={styles.remoteView}
//           objectFit="cover"
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
//   remoteView: {
//     width: 0,
//     height: 0,
//     // Invisible but required for audio playback
//   },
// });

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";
// import InCallManager from "react-native-incall-manager";
// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);


//   const isCallerRef = useRef(false);

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   // Send signaling message via WebSocket
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[Signaling] Sending message:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   // Cleanup WebRTC and media streams
//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing peer connection and streams");
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//     isCallerRef.current = false;

//     InCallManager.stop();
//   };

//   // Create RTCPeerConnection and setup handlers
//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     console.log("[WebRTC] Created RTCPeerConnection");

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         console.log("[WebRTC] ICE candidate generated");
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//     pc.current.onnegotiationneeded = async () => {
//       console.log(
//         "[WebRTC] onnegotiationneeded event triggered. Is caller?",
//         isCallerRef.current
//       );

//       if (!isCallerRef.current) {
//         console.log("[WebRTC] Not caller, skipping offer creation.");
//         return;
//       }

//       if (pc.current.signalingState !== "stable") {
//         console.log(
//           "[WebRTC] signalingState not stable, skipping offer creation. Current state:",
//           pc.current.signalingState
//         );
//         return;
//       }

//       try {
//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);
//         sendMessage({ type: "offer", offer });
//         console.log("[WebRTC] Offer created and sent");
//       } catch (err) {
//         console.error("[WebRTC] Negotiation failed:", err);
//       }
//     };

//     // pc.current.ontrack = (evt) => {
//     //   console.log("[WebRTC] Remote track received:", evt.track.kind);
//     //   if (evt.track.kind === "audio") {
//     //     if (evt.streams && evt.streams[0]) {
//     //       remoteStream.current = evt.streams[0];
//     //       setWebrtcReady(true);

//     //       const audioTracks = evt.streams[0].getAudioTracks();
//     //       audioTracks.forEach((track) => {
//     //         console.log("Remote audio track enabled:", track.enabled);
//     //       });

//     //       // Important: force speakerphone on
//     //       InCallManager.setForceSpeakerphoneOn(true);
//     //       InCallManager.setSpeakerphoneOn(true);
//     //     }
//     //   }
//     // };
//     pc.current.ontrack = (evt) => {
//   console.log("[WebRTC] Remote track received:", evt.track.kind);
//   if (evt.streams && evt.streams[0]) {
//     remoteStream.current = evt.streams[0];
//     setRemoteURL(evt.streams[0].toURL());
//     setWebrtcReady(true);

//     InCallManager.start({ media: "audio" });
//     InCallManager.setForceSpeakerphoneOn(true);

//     console.log("Remote audio tracks:", evt.streams[0].getAudioTracks().length);
//   }
// };

//   };

//   // Get local audio stream and add to PeerConnection
//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return false;
//       }

//       try {
//         console.log("[MediaDevices] Requesting local audio stream");
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//         setLocalURL(s.toURL());

//         console.log("[MediaDevices] Local audio tracks count:", s.getAudioTracks().length);
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     if (!pc.current) {
//       console.warn("[WebRTC] PeerConnection not initialized yet");
//       return false;
//     }

//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         console.log("[WebRTC] Adding local audio track to PeerConnection");
//         pc.current.addTrack(track, localStream.current);
//       }
//     });

//     // Start InCallManager audio with speakerphone ON
//     InCallManager.start({ media: "audio", auto: true, ringback: null, busytone: null });
//     InCallManager.setForceSpeakerphoneOn(true);
//     InCallManager.setSpeakerphoneOn(true);

//     return true;
//   };

//   // Add queued remote ICE candidates after remoteDescription is set
//   const drainQueuedCandidates = async () => {
//     if (!pc.current) {
//       console.warn("[WebRTC] Cannot drain candidates, peer connection is null");
//       return;
//     }
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         console.log("[WebRTC] Adding queued ICE candidate");
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err);
//       }
//     }
//   };

//   // Setup websocket signaling connection
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         console.warn("[WebSocket] Invalid JSON", e);
//         return;
//       }

//       console.log("[Signaling] Message received:", data.type);

//       switch (data.type) {
//         case "offer":
//           if (isCallerRef.current) {
//             console.log("[Signaling] Ignoring own offer");
//             return;
//           }

//           await ensurePeerConnection();

//           const localReady = await ensureLocalStreamAndAttach();
//           if (!localReady) return;

//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when setting remote offer");
//             return;
//           }
//           try {
//             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//           } catch (err) {
//             console.warn("[Signaling] Error setting remote offer:", err);
//             return;
//           }

//           await drainQueuedCandidates();

//           try {
//             const answer = await pc.current.createAnswer();
//             await pc.current.setLocalDescription(answer);
//             sendMessage({ type: "answer", answer });
//             console.log("[Signaling] Answer created and sent");
//           } catch (err) {
//             console.warn("[Signaling] Failed to create/send answer:", err);
//           }
//           break;

//         case "answer":
//           if (!isCallerRef.current) {
//             console.log("[Signaling] Not caller, ignoring answer");
//             return;
//           }
//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when receiving answer");
//             return;
//           }
//           if (pc.current.signalingState === "have-local-offer") {
//             try {
//               await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//               await drainQueuedCandidates();
//               console.log("[Signaling] Remote answer set successfully");
//             } catch (err) {
//               console.warn("[Signaling] Error setting remote answer:", err);
//             }
//           } else {
//             console.warn(
//               "[Signaling] Tried to set remote answer in wrong state",
//               pc.current.signalingState
//             );
//           }
//           break;

//         case "candidate":
//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when receiving candidate");
//             return;
//           }
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//             console.log("[Signaling] Queued ICE candidate");
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log("[Signaling] Added ICE candidate");
//             } catch (err) {
//               console.warn("[Signaling] addIceCandidate error:", err);
//             }
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;

//         default:
//           console.warn("[Signaling] Unknown message type:", data.type);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WebSocket] Connection closed");
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//     console.log("[Call] Starting call as caller");
//     setIsCaller(true);
//     isCallerRef.current = true;

//     const granted = await requestMicPermission();
//     if (!granted) {
//       Alert.alert("Permission denied", "Cannot access microphone.");
//       return;
//     }

//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (localReady) {
//       InCallManager.start({ media: "audio", auto: true });
//       InCallManager.setForceSpeakerphoneOn(true);
//       InCallManager.setSpeakerphoneOn(true);
//     }
//   };

//   const joinCall = async () => {
//     console.log("[Call] Joining call as callee");
//     setIsCaller(false);
//     isCallerRef.current = false;

//     const granted = await requestMicPermission();
//     if (!granted) {
//       Alert.alert("Permission denied", "Cannot access microphone.");
//       return;
//     }

//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (localReady) {
//       InCallManager.start({ media: "audio", auto: true });
//       InCallManager.setForceSpeakerphoneOn(true);
//       InCallManager.setSpeakerphoneOn(true);
//     }
//   };

//   const endCall = (manual = true) => {
//     console.log("[Call] Ending call");
//     if (manual) {
//       sendMessage({ type: "call-ended" });
//     }
//     cleanupPeerConnection();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button
//           title="Start Call"
//           onPress={startCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="Join Call"
//           onPress={joinCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button title="End Call" onPress={() => endCall(true)} disabled={!webrtcReady} />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {/* Local audio stream preview (optional) */}
//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {/* Remote audio stream does NOT need RTCView for audio only */}
//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={{ width: 1, height: 1, opacity: 0 }}
//         />
//       )}

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
// });


// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
  
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);

//   const isCallerRef = useRef(false);

//   const rtcConfig = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   // Send message via websocket with debug log
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[Signaling] Sending message:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   // Cleanup all WebRTC and media
//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing peer connection and streams");
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//   };

//   // Create RTCPeerConnection and setup handlers
//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection(rtcConfig);
//     console.log("[WebRTC] Created RTCPeerConnection");

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         console.log("[WebRTC] ICE candidate generated");
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//    pc.current.onnegotiationneeded = async () => {
//   console.log("[WebRTC] onnegotiationneeded event triggered. Is caller?", isCallerRef.current);
  
//   if (!isCallerRef.current) {
//     console.log("[WebRTC] Not caller, skipping offer creation.");
//     return;
//   }

//   if (pc.current.signalingState !== "stable") {
//     console.log("[WebRTC] signalingState not stable, skipping offer creation to avoid conflicts. Current state:", pc.current.signalingState);
//     return;
//   }

//   try {
//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);
//     sendMessage({ type: "offer", offer });
//     console.log("[WebRTC] Offer created and sent");
//   } catch (err) {
//     console.error("[WebRTC] Negotiation failed:", err);
//   }
// };



//     pc.current.ontrack = (evt) => {
//   console.log("[WebRTC] Remote track received:", evt.track.kind);
//   if (evt.streams && evt.streams[0]) {
//     remoteStream.current = evt.streams[0];
//     setRemoteURL(remoteStream.current.toURL());
//     setWebrtcReady(true);
//   }
// };
//   };

//   // Get local audio stream and add to PeerConnection
//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return false;
//       }

//       try {
//         console.log("[MediaDevices] Requesting local audio stream");
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//          console.log("[MediaDevices] Local stream tracks:", localStream.current.getTracks());
//         setLocalURL(s.toURL());
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     // Attach tracks to peer connection if not already attached
//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         console.log("[WebRTC] Adding local audio track to PeerConnection,,");
//         pc.current.addTrack(track, localStream.current);
//       }
//     });
//     return true;
//   };

//   // Add queued remote ICE candidates after remoteDescription is set
//   const drainQueuedCandidates = async () => {
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         console.log("[WebRTC] Adding queued ICE candidate");
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err);
//       }
//     }
//   };

//   // Setup websocket signaling connection
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         console.warn("[WebSocket] Invalid JSON", e);
//         return;
//       }

//       console.log("[Signaling] Message received:", data.type);

//       switch (data.type) {
//         case "offer":
//           if (isCallerRef.current) {
//             console.log("[Signaling] Ignoring own offer");
//             return;
//           }

//           await ensurePeerConnection();

//           const localReady = await ensureLocalStreamAndAttach();
//           if (!localReady) return;

//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(data.offer)
//           );
//           await drainQueuedCandidates();

//           const answer = await pc.current.createAnswer();
//           await pc.current.setLocalDescription(answer);
//           sendMessage({ type: "answer", answer });
//           console.log("[Signaling] Answer created and sent");
//           break;

//         case "answer":
//           if (!isCallerRef.current) {
//             console.log("[Signaling] Not caller, ignoring answer");
//             return;
//           }
//           if (pc.current.signalingState === "have-local-offer") {
//             await pc.current.setRemoteDescription(
//               new RTCSessionDescription(data.answer)
//             );
//             await drainQueuedCandidates();
//           } else {
//             console.warn("[Signaling] Tried to set remote answernn in wrong state", pc.current.signalingState);
//           }
//           break;


//         case "candidate":
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//             console.log("[Signaling] Queued ICE candidate");
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log("[Signaling] Added ICE candidate");
//             } catch (err) {
//               console.warn("[Signaling] addIceCandidate error:", err);
//             }
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;

//         default:
//           console.warn("[Signaling] Unknown message type:", data.type);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WebSocket] Connection closed");
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   // Component mount: connect WebSocket
//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//   console.log("[Call] Starting call as caller");
//   setIsCaller(true);
//   isCallerRef.current = true;  // Keep ref in sync
//   await ensurePeerConnection();
//   await ensureLocalStreamAndAttach();
// };

//   const joinCall = async () => {
//   console.log("[Call] Joining call as callee");
//   setIsCaller(false);
//   isCallerRef.current = false;
//   await ensurePeerConnection();
//   await ensureLocalStreamAndAttach();
// };

//   const endCall = (manual = true) => {
//     console.log("[Call] Ending call");
//     if (manual) {
//       sendMessage({ type: "call-ended" });
//     }
//     cleanupPeerConnection();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button
//           title="Start Call"
//           onPress={startCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="Join Call"
//           onPress={joinCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="End Call"
//           onPress={() => endCall(true)}
//           disabled={!webrtcReady}
//         />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {/* Local audio stream preview (optional video can be added if needed) */}
//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {/* Remote audio stream must be rendered (even invisible) to play audio */}
//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={styles.remoteView}
//           objectFit="cover"
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
//   remoteView: {
//     width: 0,
//     height: 0,
    
//     // Invisible but required to play audio
//   },
// });


// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);

//   const rtcConfig = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   // Send message via websocket with debug log
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[Signaling] Sending message:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   // Cleanup all WebRTC and media
//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing peer connection and streams");
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//   };

//   // Create RTCPeerConnection and setup handlers
//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection(rtcConfig);
//     console.log("[WebRTC] Created RTCPeerConnection");

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         console.log("[WebRTC] ICE candidate generated");
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//    pc.current.onnegotiationneeded = async () => {
//   console.log("[WebRTC] onnegotiationneeded event triggered. Is caller?", isCaller);
//   if (isCaller) {
//     try {
//       const offer = await pc.current.createOffer();
//       await pc.current.setLocalDescription(offer);
//       sendMessage({ type: "offer", offer });
//       console.log("[WebRTC] Offer created and sent");
//     } catch (err) {
//       console.error("[WebRTC] Negotiation failed:", err);
//     }
//   } else {
//     console.log("[WebRTC] Skipping offer creation since not caller");
//   }
// };


//     pc.current.ontrack = (evt) => {
//       console.log("[WebRTC] Remote track received:", evt.track.kind);
//       if (evt.streams && evt.streams[0]) {
//         remoteStream.current = evt.streams[0];
//         setRemoteURL(remoteStream.current.toURL());
//         setWebrtcReady(true);
//       }
//     };
//   };

//   // Get local audio stream and add to PeerConnection
//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return false;
//       }

//       try {
//         console.log("[MediaDevices] Requesting local audio stream");
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//         setLocalURL(s.toURL());
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     // Attach tracks to peer connection if not already attached
//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         console.log("[WebRTC] Adding local audio track to PeerConnection");
//         pc.current.addTrack(track, localStream.current);
//       }
//     });
//     return true;
//   };

//   // Add queued remote ICE candidates after remoteDescription is set
//   const drainQueuedCandidates = async () => {
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         console.log("[WebRTC] Adding queued ICE candidate");
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err);
//       }
//     }
//   };

//   // Setup websocket signaling connection
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         console.warn("[WebSocket] Invalid JSON", e);
//         return;
//       }

//       console.log("[Signaling] Message received:", data.type);

//       switch (data.type) {
//         case "offer":
//           if (isCaller) {
//             console.log("[Signaling] Ignoring own offer");
//             return;
//           }

//           await ensurePeerConnection();

//           const localReady = await ensureLocalStreamAndAttach();
//           if (!localReady) return;

//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(data.offer)
//           );
//           await drainQueuedCandidates();

//           const answer = await pc.current.createAnswer();
//           await pc.current.setLocalDescription(answer);
//           sendMessage({ type: "answer", answer });
//           console.log("[Signaling] Answer created and sent");
//           break;

//         case "answer":
//           if (!isCaller) {
//             console.log("[Signaling] Not caller, ignoring answer");
//             return;
//           }
//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(data.answer)
//           );
//           await drainQueuedCandidates();
//           break;

//         case "candidate":
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//             console.log("[Signaling] Queued ICE candidate");
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log("[Signaling] Added ICE candidate");
//             } catch (err) {
//               console.warn("[Signaling] addIceCandidate error:", err);
//             }
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;

//         default:
//           console.warn("[Signaling] Unknown message type:", data.type);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WebSocket] Connection closed");
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   // Component mount: connect WebSocket
//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//     console.log("[Call] Starting call as caller");
//     setIsCaller(true);
//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (!localReady) return;
//     // The offer will be created on negotiationneeded event automatically
//   };

//   const joinCall = async () => {
//     console.log("[Call] Joining call as callee");
//     setIsCaller(false);
//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (!localReady) return;
//     // Wait for offer from caller through signaling
//   };

//   const endCall = (manual = true) => {
//     console.log("[Call] Ending call");
//     if (manual) {
//       sendMessage({ type: "call-ended" });
//     }
//     cleanupPeerConnection();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button
//           title="Start Call"
//           onPress={startCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="Join Call"
//           onPress={joinCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="End Call"
//           onPress={() => endCall(true)}
//           disabled={!webrtcReady}
//         />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {/* Local audio stream preview (optional video can be added if needed) */}
//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {/* Remote audio stream must be rendered (even invisible) to play audio */}
//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={styles.remoteView}
//           objectFit="cover"
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
//   remoteView: {
//     width: 0,
//     height: 0,

    
//     // Invisible but required to play audio
//   },
// });







// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, SafeAreaView, Alert, ImageBackground, Modal, StyleSheet } from 'react-native';
// import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native';
// import { useCallContext } from './CallContext';


// const VoiceCallScreen = ({ navigation, route }) => {
//   const { answerCall, declineCall } = useCallContext();
//   const {
//     receiverId,
//     name,
//     isCaller = false,
//     roomId = 'default-room',
//     callStatus = 'incoming'
//   } = route.params || {};

//   // State and refs
//   const [callStarted, setCallStarted] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [isMuted, setIsMuted] = useState(false);
//   const [activeCalls, setActiveCalls] = useState([]);
//   const [showDiscovery, setShowDiscovery] = useState(!isCaller && callStatus !== 'active');

// // Add these new state variables at the top of your component
// const [isSettingRemoteDescription, setIsSettingRemoteDescription] = useState(false);
// const isCreatingOffer = useRef(false);

//   const pc = useRef(null);
//   const ws = useRef(null);
//   const currentUserId = useRef(`user-${Math.random().toString(36).substring(2, 9)}`);
//   const queuedCandidates = useRef([]);
//   const hasAnnouncedCall = useRef(false);
//   const audioBg = { uri: 'https://example.com/audio-bg.jpg' };

//   // Process queued ICE candidates
//  const processQueuedCandidates = async () => {
//   if (!pc.current || queuedCandidates.current.length === 0 || isSettingRemoteDescription) return;
  
//   const processed = [];
//   for (const candidate of queuedCandidates.current) {
//     try {
//       if (pc.current.remoteDescription) {
//         await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//         processed.push(candidate);
//       }
//     } catch (e) {
//       console.warn('Failed to process queued candidate:', e);
//     }
//   }
//   queuedCandidates.current = queuedCandidates.current.filter(
//     c => !processed.includes(c)
//   );
// };

//   const fixSdpFormat = (sdp) => {
//   if (!sdp) return sdp;
  
//   // Normalize line endings
//   let normalized = sdp.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  
//   // Ensure proper audio media line
//   normalized = normalized.replace(/m=audio.*\r\n/, match => {
//     return match + 'a=rtcp-mux\r\n';
//   });
  
//   // Remove potentially problematic attributes
//   normalized = normalized.replace(/a=extmap:.*\r\n/g, '');
  
//   return normalized;
// };
//   // Get local media stream
//   const getLocalStream = async () => {
//     try {
//       const stream = await mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           channelCount: 1
//         }
//       });
//       setLocalStream(stream);
//       return stream;
//     } catch (error) {
//       Alert.alert('Microphone Error', 'Please enable microphone permissions');
//       return null;
//     }
//   };

//   // Create peer connection
//   const createPeerConnection = () => {
//     if (pc.current) {
//       pc.current.close();
//       pc.current = null;
//     }

//     const configuration = {
//   iceServers: [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { 
//       urls: [
//         'turn:openrelay.metered.ca:80?transport=udp',
//         'turn:openrelay.metered.ca:443?transport=tcp',
//         'turns:openrelay.metered.ca:443?transport=tcp'
//       ],
//       username: 'openrelayproject',
//       credential: 'openrelayproject'
//     }
//   ],
//   iceTransportPolicy: 'all',
//   bundlePolicy: 'max-bundle',
//   rtcpMuxPolicy: 'require',
//   iceCandidatePoolSize: 5, // Reduced from 10 to lower overhead
//   sdpSemantics: 'unified-plan'
// };

//     pc.current = new RTCPeerConnection(configuration);
//  pc.current.onicegatheringstatechange = () => {
//     console.log('ICE gathering state:', pc.current.iceGatheringState);
//   };
//     // Event handlers
//     pc.current.ontrack = (e) => {
//       if (e.streams?.length > 0) setRemoteStream(e.streams[0]);
//     };

//  pc.current.onicecandidate = (e) => {
//   if (e.candidate) {
//     // Filter out potentially problematic candidates
//     if (e.candidate.candidate.indexOf('srflx') === -1 && 
//         e.candidate.candidate.indexOf('relay') === -1) {
//       return;
//     }
    
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({
//         type: 'call.message',
//         data: {
//           type: 'ice-candidate',
//           candidate: e.candidate,
//           senderId: currentUserId.current
//         }
//       }));
//     }
//   }
// };
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (connectionStatus === 'disconnected' || connectionStatus === 'connecting') {
//       console.log('Connection timeout - attempting ICE restart');
//       restartIce();
//     }
//   }, 15000); // Reduced timeout to 15 seconds

//   return () => clearTimeout(timer);
// }, [connectionStatus]);
//     pc.current.oniceconnectionstatechange = () => {
//     console.log('ICE connection state:', pc.current.iceConnectionState);
//     if (pc.current.iceConnectionState === 'failed') {
//       console.log('ICE connection failed, attempting restart...');
//       // Consider implementing ICE restart here
//     }
//   };

//     pc.current.onconnectionstatechange = () => {
//   if (!pc.current) return;
//   const state = pc.current.connectionState;
//   console.log('Connection state changed:', state);
//   setConnectionStatus(state);
  
//   if (state === 'connected') {
//     console.log('Call connected successfully');
//   } else if (state === 'failed') {
//     console.log('Connection failed, attempting restart...');
//     restartIce();
//   }
// };

//     pc.current.onicecandidateerror = (e) => console.error('ICE Error:', e);
//     pc.current.onsignalingstatechange = () => {
//       if (pc.current.signalingState === 'stable') processQueuedCandidates();
//     };
//   };

//   // Setup WebSocket connection
//   const setupWebSocket = async () => {
//     const token = await AsyncStorage.getItem('userToken');
    
//     if (ws.current) {
//       ws.current.close();
//       ws.current = null;
//     }

//     ws.current = new ReconnectingWebSocket(
//       `ws://showa.essential.com.ng/ws/call/${roomId}/?token=${token}`
//     );

//     ws.current.onopen = () => {
//       ws.current.send(JSON.stringify({
//         type: 'user-joined',
//         userId: currentUserId.current,
//         userName: name,
//         senderId: currentUserId.current,
//         roomId: roomId
//       }));

//       if (isCaller && !hasAnnouncedCall.current) {
//         setTimeout(() => startCall(), 300);
//         hasAnnouncedCall.current = true;
//       }
//     };
//     ws.current.onerror = (error) => {
//   console.error('WebSocket error:', error);
//   // Attempt to reconnect
//   setTimeout(setupWebSocket, 1000);
// };

//     ws.current.onmessage = async (e) => {
//   try {
//     const data = JSON.parse(e.data);
//     if (data.senderId === currentUserId.current) return;

//     if (!pc.current) {
//       console.warn('Message received but PeerConnection is null');
//       if (data.data?.candidate) {
//         queuedCandidates.current.push(data.data.candidate);
//       }
//       return;
//     }

//     switch(data.type) {
//       case 'call.message':
//         const message = data.data;
//         switch(message.type) {
//           case 'offer':
//             if (!isCaller) {
//               setIsSettingRemoteDescription(true);
//               await handleIncomingOffer(message);
//               setIsSettingRemoteDescription(false);
//               await processQueuedCandidates();
//             }
//             break;
//           case 'answer':
//             if (isCaller) {
//               setIsSettingRemoteDescription(true);
//               const sanitizedAnswer = {
//                 type: message.type,
//                 sdp: fixSdpFormat(message.sdp)
//               };
//               await pc.current.setRemoteDescription(
//                 new RTCSessionDescription(sanitizedAnswer)
//               );
//               setIsSettingRemoteDescription(false);
//               await processQueuedCandidates();
//             }
//             break;
//           case 'ice-candidate':
//             if (pc.current.remoteDescription) {
//               try {
//                 await pc.current.addIceCandidate(new RTCIceCandidate(message.candidate));
//               } catch (err) {
//                 console.error('ICE candidate error:', err);
//                 queuedCandidates.current.push(message.candidate);
//               }
//             } else {
//               queuedCandidates.current.push(message.candidate);
//             }
//             break;
//           case 'call_ended':
//             endCall();
//             break;
//         }
//         break;
//     }
//   } catch (error) {
//     console.error('Message handling error:', error);
//   }
// };
//   }

//   const restartIce = async () => {
//   if (!pc.current) return;
  
//   try {
//     // Create new offer with iceRestart
//     const offer = await pc.current.createOffer({ iceRestart: true });
    
//     // Modify offer
//     const modifiedOffer = {
//       type: offer.type,
//       sdp: fixSdpFormat(offer.sdp)
//     };
    
//     await pc.current.setLocalDescription(modifiedOffer);
    
//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'offer',
//         sdp: modifiedOffer.sdp,
//         senderId: currentUserId.current,
//         isIceRestart: true
//       }
//     }));
//   } catch (error) {
//     console.error('ICE restart failed:', error);
//     // Fallback to full reconnect
//     endCall();
//     setTimeout(() => {
//       createPeerConnection();
//       startCall();
//     }, 1000);
//   }
// };
// useEffect(() => {
//   const timeout = setTimeout(() => {
//     if (connectionStatus !== 'connected') {
//       console.log('Connection timeout - attempting ICE restart');
//       restartIce();
//     }
//   }, 30000); // 30 second timeout

//   return () => clearTimeout(timeout);
// }, [connectionStatus]);

// const logPeerConnectionState = () => {
//   if (!pc.current) {
//     console.log('PeerConnection: null');
//     return;
//   }
//   console.log('PeerConnection state:', {
//     signalingState: pc.current.signalingState,
//     iceGatheringState: pc.current.iceGatheringState,
//     iceConnectionState: pc.current.iceConnectionState,
//     connectionState: pc.current.connectionState
//   });
// };

//   // Handle incoming offer
//   const handleIncomingOffer = async (offer) => {
//   try {
//     if (!pc.current) {
//       throw new Error('PeerConnection not initialized');
//     }

//     // Clean up any existing streams
//     if (remoteStream) {
//       remoteStream.getTracks().forEach(track => track.stop());
//     }

//     // Modify the offer SDP to ensure compatibility
//     const modifiedOffer = {
//       type: offer.type,
//       sdp: offer.sdp.replace(/a=group:BUNDLE\s.*\r\n/g, '')
//                    .replace(/a=mid:.*\r\n/g, '')
//     };

//     await pc.current.setRemoteDescription(new RTCSessionDescription(modifiedOffer));
//     await processQueuedCandidates();
    
//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);
    
//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'answer',
//         sdp: answer.sdp,
//         senderId: currentUserId.current,
//         receiverId: receiverId,
//         roomId: roomId
//       }
//     }));
//   } catch (error) {
//     console.error('Offer handling failed:', error);
//     endCall();
//   }
// };

//   // Start new call
//   const startCall = async () => {
//   if (!pc.current || isCreatingOffer.current) return;
  
//   isCreatingOffer.current = true;
//   try {
//     const offer = await pc.current.createOffer({
//       offerToReceiveAudio: true,
//       iceRestart: false,
//       voiceActivityDetection: false
//     });
    
//     // Modify offer for better compatibility
//     const modifiedOffer = {
//       type: offer.type,
//       sdp: offer.sdp
//         .replace(/a=group:BUNDLE\s.*\r\n/g, '')
//         .replace(/a=mid:.*\r\n/g, '')
//         .replace(/a=extmap:.*\r\n/g, '')
//     };

//     await pc.current.setLocalDescription(modifiedOffer);
    
//     // Wait for ICE gathering to complete
//     await new Promise((resolve) => {
//       if (pc.current.iceGatheringState === 'complete') {
//         resolve();
//       } else {
//         const checkState = () => {
//           if (pc.current.iceGatheringState === 'complete') {
//             pc.current.removeEventListener('icegatheringstatechange', checkState);
//             resolve();
//           }
//         };
//         pc.current.addEventListener('icegatheringstatechange', checkState);
//       }
//     });

//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'offer',
//         sdp: pc.current.localDescription.sdp,
//         senderId: currentUserId.current,
//         receiverId: receiverId,
//         roomId: roomId
//       }
//     }));
//   } catch (error) {
//     console.error('Offer creation failed:', error);
//     restartIce();
//   } finally {
//     isCreatingOffer.current = false;
//   }
// };

//   // End call cleanup
//   const endCall = () => {

//     if (ws.current) {
//     try {
//       ws.current.close();
//     } catch (e) {
//       console.error('Error closing WebSocket:', e);
//     }
//     ws.current = null;
//   }
  
//   // Then close PeerConnection
//   if (pc.current) {
//     try {
//       pc.current.close();
//     } catch (e) {
//       console.error('Error closing peer connection:', e);
//     }
//     pc.current = null;
//   }
//     try {
//       // Send termination messages if possible
//       if (ws.current?.readyState === WebSocket.OPEN) {
//         try {
//           ws.current.send(JSON.stringify({
//             type: 'call.message',
//             data: { type: 'call_ended', senderId: currentUserId.current }
//           }));
//         } catch (e) {
//           console.error('Error sending call ended message:', e);
//         }
//       }

//       // Cleanup peer connection
//       if (pc.current) {
//         try {
//           // Remove all event listeners
//           pc.current.onicecandidate = null;
//           pc.current.oniceconnectionstatechange = null;
//           pc.current.onsignalingstatechange = null;
//           pc.current.onconnectionstatechange = null;
//           pc.current.ontrack = null;
          
//           // Close connection
//           pc.current.close();
//         } catch (e) {
//           console.error('Error closing peer connection:', e);
//         } finally {
//           pc.current = null;
//         }
//       }

//       // Cleanup media stream
//       if (localStream) {
//         try {
//           localStream.getTracks().forEach(track => track.stop());
//         } catch (e) {
//           console.error('Error stopping tracks:', e);
//         }
//         setLocalStream(null);
//       }
//     } catch (error) {
//       console.error('Error during call cleanup:', error);
//     } finally {
//       setCallStarted(false);
//       setConnectionStatus('disconnected');
//     }
//   };

//   // Initialize call
//   useEffect(() => {
//     let mounted = true;
    
//     const init = async () => {
//       const stream = await getLocalStream();
//       if (!stream || !mounted) {
//         if (mounted) navigation.goBack();
//         return;
//       }
      
//       createPeerConnection();
//       await setupWebSocket();
      
//       stream.getAudioTracks().forEach(track => {
//         pc.current?.addTrack(track, stream);
//       });

//       if (isCaller) setTimeout(() => startCall(), 500);
//     };

//     init();
    
//     return () => {
//       mounted = false;
//       endCall();
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground source={audioBg} style={styles.background}>
//         <View style={styles.overlay}>
//           <LottieView
//              source={require("../assets/animations/voice icon lottie animation.json")}
//             autoPlay
//             loop
//             style={styles.image}
//           />
//           <Text style={styles.title}>
//             {callStarted ? `In call with ${name}` : 'Setting up call...'}
//           </Text>
//           <Text style={styles.statusText}>Status: {connectionStatus}</Text>
//         </View>
//       </ImageBackground>

//       <View style={styles.controls}>
//         {callStarted && (
//           <TouchableOpacity 
//             style={[styles.button, isMuted ? styles.muted : styles.unmuted]} 
//             onPress={() => setIsMuted(!isMuted)}
//           >
//             <FontAwesome5 
//               name={isMuted ? "microphone-slash" : "microphone"} 
//               size={18} 
//               color="#fff" 
//             />
//             <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
//           </TouchableOpacity>
//         )}
        
//         <TouchableOpacity 
//           style={[styles.button, styles.end]} 
//           onPress={endCall}
//         >
//           <FontAwesome5 name="phone-slash" size={18} color="#fff" />
//           <Text style={styles.buttonText}>End Call</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111'
//   },
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   overlay: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     width: '90%'
//   },
//   title: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginVertical: 16,
//     textAlign: 'center'
//   },
//   statusText: {
//     color: '#ddd',
//     fontSize: 16,
//     textAlign: 'center'
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 20,
//     backgroundColor: '#1c1c1c',
//     borderTopWidth: 1,
//     borderTopColor: '#333'
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 30,
//     minWidth: 120,
//     justifyContent: 'center'
//   },
//   end: {
//     backgroundColor: '#e53935'
//   },
//   muted: {
//     backgroundColor: '#ff9500'
//   },
//   unmuted: {
//     backgroundColor: '#007aff'
//   },
//   image: {
//     width: '80%',
//     height: 220,
//     marginBottom: 30,
//   },
//   buttonText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)'
//   },
//   modalContent: {
//     backgroundColor: '#2a2a2a',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     maxHeight: '70%'
//   },
//   modalTitle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   noCallsText: {
//     color: '#aaa',
//     textAlign: 'center',
//     marginVertical: 20
//   },
//   callItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#444'
//   },
//   callItemText: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 10
//   },
//   closeButton: {
//     marginTop: 20,
//     padding: 10,
//     alignSelf: 'center'
//   },
//   closeButtonText: {
//     color: '#0a84ff',
//     fontSize: 16,
//     fontWeight: 'bold'
//   }
// });



//////////////////////// new working witout audio=================
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
//   MediaStream,
// } from "react-native-webrtc";
// import InCallManager from "react-native-incall-manager";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// // ----- pcConfig with STUN + public TURN for testing -----
// const pcConfig = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     {
//       urls: [
//         "turn:openrelay.metered.ca:80?transport=udp",
//         "turn:openrelay.metered.ca:443?transport=tcp",
//         "turns:openrelay.metered.ca:443?transport=tcp",
//       ],
//       username: "openrelayproject",
//       credential: "openrelayproject",
//     },
//   ],
//   iceTransportPolicy: "all",
//   bundlePolicy: "max-bundle",
//   rtcpMuxPolicy: "require",
//   iceCandidatePoolSize: 5,
//   sdpSemantics: "unified-plan",
// };

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const userId = useRef(Math.random().toString(36).substr(2, 9));
//   const localStream = useRef(null);
//   const peerConnections = useRef({});
//   const remoteStreams = useRef({});
//   const queuedRemoteCandidates = useRef({});
//   const [wsConnected, setWsConnected] = useState(false);
//   const [inCall, setInCall] = useState(false);
//   const [hasActiveCall, setHasActiveCall] = useState(false);
//   const [otherParticipants, setOtherParticipants] = useState([]);
//   const [remoteStreamUrls, setRemoteStreamUrls] = useState({});
//   const [incallStarted, setIncallStarted] = useState(false);
//   const [callStatus, setCallStatus] = useState(null); // 'ringing', 'connected'
//   const [incomingCallFrom, setIncomingCallFrom] = useState(null);

//   useEffect(() => {
//     setHasActiveCall(otherParticipants.length > 0);
//   }, [otherParticipants]);

//   useEffect(() => {
//     if (incomingCallFrom && !inCall) {
//       Alert.alert(
//         `Incoming call from ${incomingCallFrom}`,
//         "",
//         [
//           {
//             text: "Accept",
//             onPress: () => {
//               acceptIncoming(incomingCallFrom);
//               setIncomingCallFrom(null);
//             },
//           },
//           {
//             text: "Reject",
//             onPress: () => {
//               rejectIncoming(incomingCallFrom);
//               setIncomingCallFrom(null);
//             },
//           },
//         ]
//       );
//     }
//   }, [incomingCallFrom, inCall]);

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   // Send signaling message via WebSocket
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       const fullMsg = { ...msg, from: userId.current };
//       console.log("[Signaling] Sending message:", fullMsg.type);
//       ws.current.send(JSON.stringify(fullMsg));
//     } else {
//       console.warn("[Signaling] WebSocket not open, can't send:", msg.type);
//     }
//   };

  

// const createPeerConnection = (peerId) => {
//   const newPc = new RTCPeerConnection(pcConfig);
//   console.log(`[WebRTC] Created RTCPeerConnection for peer: ${peerId}`);

//   // ✅ Always add local tracks if already available
//   if (localStream.current) {
//     localStream.current.getTracks().forEach(track => {
//       newPc.addTrack(track, localStream.current);
//       console.log(`[WebRTC] Added local ${track.kind} track to ${peerId}`);
//     });
//   }

//   // ✅ Handle incoming remote tracks (audio + video)
//   newPc.ontrack = (evt) => {
//     console.log(`[WebRTC] ontrack from peer: ${peerId}, kind=${evt.track.kind}`);
//     const stream = evt.streams[0];
//     remoteStreams.current[peerId] = stream;

//     // Save stream so RTCView can play it (audio works even if hidden)
//     setRemoteStreamUrls((prev) => ({
//       ...prev,
//       [peerId]: stream.toURL(),
//     }));

//     // Start audio output when first remote track arrives
//     if (!incallStarted && evt.track.kind === "audio") {
//       try {
//         InCallManager.start({ media: "audio", auto: true });
//         InCallManager.setForceSpeakerphoneOn(true); // Speakerphone on
//         setIncallStarted(true);
//         console.log("[InCallManager] Audio routing started");
//       } catch (e) {
//         console.warn("[InCallManager] start failed:", e);
//       }
//     }
//   };

//   // Send ICE candidates
//   newPc.onicecandidate = (evt) => {
//     if (evt.candidate) {
//       sendMessage({
//         type: "candidate",
//         candidate: evt.candidate.toJSON(),
//         to: peerId
//       });
//     }
//   };

//   peerConnections.current[peerId] = newPc;
//   return newPc;
// };




//   // Drain queued candidates for a specific peer
//   const drainQueuedCandidatesForPeer = async (peerId) => {
//     const q = queuedRemoteCandidates.current[peerId] || [];
//     const peerPc = peerConnections.current[peerId];
//     if (peerPc) {
//       for (const c of q) {
//         try {
//           await peerPc.addIceCandidate(new RTCIceCandidate(c));
//           console.log(`[WebRTC] Added queued ICE candidate for ${peerId}`);
//         } catch (err) {
//           console.warn(`[WebRTC] addIceCandidate error for ${peerId}:`, err);
//         }
//       }
//       queuedRemoteCandidates.current[peerId] = [];
//     }
//   };

//   // Remove a peer connection
//   const removePeer = (peerId) => {
//     console.log(`[Cleanup] Removing peer: ${peerId}`);
//     const peerPc = peerConnections.current[peerId];
//     if (peerPc) {
//       try {
//         peerPc.close();
//       } catch (e) {
//         console.warn(`[Cleanup] Error closing pc for ${peerId}:`, e);
//       }
//     }
//     delete peerConnections.current[peerId];
//     delete remoteStreams.current[peerId];
//     delete queuedRemoteCandidates.current[peerId];
//     setRemoteStreamUrls((prev) => {
//       const newPrev = { ...prev };
//       delete newPrev[peerId];
//       return newPrev;
//     });
//     setOtherParticipants((prev) => prev.filter((id) => id !== peerId));
//   };

//   // Cleanup all peer connections and streams
//   const cleanupAll = () => {
//     console.log("[Cleanup] Cleaning up all connections and streams");
//     Object.keys(peerConnections.current).forEach(removePeer);
//     peerConnections.current = {};
//     remoteStreams.current = {};
//     queuedRemoteCandidates.current = {};
//     setRemoteStreamUrls({});
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     setInCall(false);
//     setCallStatus(null);
//     setIncallStarted(false);
//     setIncomingCallFrom(null);
//     try {
//       InCallManager.stop();
//     } catch (e) {
//       console.warn("[InCallManager] stop failed:", e);
//     }
//   };

//   // Setup websocket signaling connection
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       sendMessage({ type: "new-user-joined-room" });
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         console.warn("[WebSocket] Invalid JSON", e);
//         return;
//       }

//       console.log("[Signaling] Message received:", data.type);

//       if (data.to && data.to !== userId.current) {
//         return; // Ignore messages not targeted to us
//       }

//       const from = data.from;
//       let peerPc;

//       switch (data.type) {
//         case "new-user-joined-room":
//           if (from !== userId.current && inCall) {
//             sendMessage({ type: "i-am-in-call", to: from });
//           }
//           break;

//         case "i-am-in-call":
//           if (from !== userId.current) {
//             setOtherParticipants((prev) => [...new Set([...prev, from])]);
//           }
//           break;

//         case "incoming-call":
//           if (from !== userId.current && !inCall) {
//             setIncomingCallFrom(from);
//           }
//           break;

//         case "call-accepted":
//           if (from !== userId.current && callStatus === "ringing") {
//             console.log(`[Signaling] Call accepted by ${from}`);
//             setCallStatus("connected");
//             setOtherParticipants((prev) => [...new Set([...prev, from])]);

//             // Create PC and send offer immediately upon acceptance
//             peerPc = peerConnections.current[from];
//             if (!peerPc) {
//               peerPc = createPeerConnection(from);
//               if (localStream.current) {
//                 localStream.current.getTracks().forEach((track) =>
//                   peerPc.addTrack(track, localStream.current)
//                 );
//               }
//             }
//             try {
//               const offer = await peerPc.createOffer();
//               await peerPc.setLocalDescription(offer);
//               sendMessage({ type: "offer", offer, to: from });
//               console.log(`[WebRTC] Offer sent to acceptor: ${from}`);
//             } catch (err) {
//               console.error(`[WebRTC] Failed to create/send offer to ${from}:`, err);
//             }
//           }
//           break;

//         case "call-rejected":
//           if (callStatus === "ringing") {
//             Alert.alert("Call Rejected", "The other user rejected the call.");
//             endCall(false);
//           }
//           break;

//         case "user-joined-call":
//           if (from !== userId.current) {
//             setOtherParticipants((prev) => [...new Set([...prev, from])]);
//             if (inCall && !peerConnections.current[from]) { // Only if not already connected
//               peerPc = createPeerConnection(from);
//               if (localStream.current) {
//                 localStream.current.getTracks().forEach((track) =>
//                   peerPc.addTrack(track, localStream.current)
//                 );
//               }
//               try {
//                 const offer = await peerPc.createOffer();
//                 await peerPc.setLocalDescription(offer);
//                 sendMessage({ type: "offer", offer, to: from });
//                 console.log(`[WebRTC] Offer sent to new peer: ${from}`);
//               } catch (err) {
//                 console.error(`[WebRTC] Failed to create/send offer to ${from}:`, err);
//               }
//             }
//           }
//           break;

//         case "user-left-call":
//           if (from !== userId.current) {
//             removePeer(from);
//             if (incomingCallFrom === from) {
//               setIncomingCallFrom(null);
//             }
//           }
//           break;

//         case "offer":
//           if (inCall) {
//             peerPc = peerConnections.current[from];
//             if (!peerPc) {
//               peerPc = createPeerConnection(from);
//               if (localStream.current) {
//                 localStream.current.getTracks().forEach((track) =>
//                   peerPc.addTrack(track, localStream.current)
//                 );
//               }
//             }
//             try {
//               await peerPc.setRemoteDescription(new RTCSessionDescription(data.offer));
//               await drainQueuedCandidatesForPeer(from);
//               const answer = await peerPc.createAnswer();
//               await peerPc.setLocalDescription(answer);
//               sendMessage({ type: "answer", answer, to: from });
//               console.log(`[Signaling] Answer sent to ${from}`);
//             } catch (err) {
//               console.warn(`[Signaling] Failed to process offer from ${from}:`, err);
//             }
//           }
//           break;

//         case "answer":
//           peerPc = peerConnections.current[from];
//           if (peerPc) {
//             try {
//               await peerPc.setRemoteDescription(new RTCSessionDescription(data.answer));
//               await drainQueuedCandidatesForPeer(from);
//               console.log(`[Signaling] Remote answer set from ${from}`);
//             } catch (err) {
//               console.warn(`[Signaling] Error setting remote answer from ${from}:`, err);
//             }
//           }
//           break;

//         case "candidate":
//           peerPc = peerConnections.current[from];
//           if (peerPc) {
//             if (peerPc.remoteDescription) {
//               try {
//                 await peerPc.addIceCandidate(new RTCIceCandidate(data.candidate));
//                 console.log(`[Signaling] Added ICE candidate from ${from}`);
//               } catch (err) {
//                 console.warn(`[Signaling] addIceCandidate error from ${from}:`, err);
//               }
//             } else {
//               if (!queuedRemoteCandidates.current[from]) {
//                 queuedRemoteCandidates.current[from] = [];
//               }
//               queuedRemoteCandidates.current[from].push(data.candidate);
//               console.log(`[Signaling] Queued ICE candidate from ${from}`);
//             }
//           }
//           break;

//         default:
//           console.warn("[Signaling] Unknown message type:", data.type);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WebSocket] Connection closed");
//       setWsConnected(false);
//       cleanupAll();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupAll();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

  
//   const handleStartCall = async () => {
//   const hasPermission = await requestMicPermission();
//   if (!hasPermission) return;

//   console.log("[MediaDevices] Requesting local audio stream");
//   const s = await mediaDevices.getUserMedia({ audio: true });
//   localStream.current = s;
//   console.log("[MediaDevices] Local audio tracks count:", s.getAudioTracks().length);

//   // ✅ Pre-add local stream to any existing peer
//   Object.values(peerConnections.current).forEach(pc => {
//     s.getTracks().forEach(track => pc.addTrack(track, s));
//   });

//   InCallManager.start({ media: "audio", auto: true });
//   InCallManager.setForceSpeakerphoneOn(true);

//   setInCall(true);
//   sendMessage({ type: "user-joined-call" });
//   if (otherParticipants.length === 0) {
//     sendMessage({ type: "incoming-call" });
//     setCallStatus("ringing");
//   }
//   console.log("[Call] Started call");
// };


//   const acceptIncoming = async (from) => {
//     const hasPermission = await requestMicPermission();
//     if (!hasPermission) {
//       Alert.alert("Permission denied", "Cannot access microphone.");
//       return;
//     }

//     try {
//       console.log("[MediaDevices] Requesting local audio stream");
//       const s = await mediaDevices.getUserMedia({ audio: true });
//       localStream.current = s;
//       console.log("[MediaDevices] Local audio tracks count:", s.getAudioTracks().length);
//     } catch (e) {
//       Alert.alert("Error", "Failed to get local stream: " + (e.message || e));
//       return;
//     }

//     try {
//       InCallManager.start({ media: "audio", auto: true });
//       InCallManager.setForceSpeakerphoneOn(true); // Adjust to false for earpiece
//       setIncallStarted(true);
//     } catch (e) {
//       console.warn("[InCallManager] start failed:", e);
//     }

//     setInCall(true);
//     sendMessage({ type: "call-accepted", to: from });
//     sendMessage({ type: "user-joined-call" });
//     console.log("[Call] Accepted incoming call for sure");
//   };

//   const rejectIncoming = (from) => {
//     sendMessage({ type: "call-rejected", to: from });
//     console.log("[Call] Rejected incoming call");
//   };

//   const endCall = (sendLeft = true) => {
//     console.log("[Call] Ending call");
//     if (sendLeft) {
//       sendMessage({ type: "user-left-call" });
//     }
//     cleanupAll();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button title="Start Call" onPress={handleStartCall} disabled={!wsConnected || inCall} />
//         <View style={{ width: 12 }} />
//         <Button title="End Call" onPress={() => endCall(true)} disabled={!inCall} />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>In Call: {inCall ? "Yes" : "No"}</Text>
//         <Text>Call Status: {callStatus || "None"}</Text>
//         <Text>Active Call: {hasActiveCall ? "Yes" : "No"}</Text>
//         <Text>Connected Peers: {Object.keys(remoteStreamUrls).length}</Text>
//       </View>

//       {/* Hidden RTCViews for remote audio streams */}
//       {Object.entries(remoteStreamUrls).map(([peerId, url]) => (
//         <RTCView
//           key={peerId}
//           streamURL={url}
//           style={{ width: 1, height: 1, opacity: 0 }}
//         />
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
// });

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
// // import InCallManager from "react-native-incall-manager";

// // const SIGNALING_SERVER = "ws://showa.essential.com.ng"; // <-- set your server
// // const ROOM_ID = "unique-room-id"; // <-- set your room id

// // const pcConfig = {
// //   iceServers: [
// //     { urls: "stun:stun.l.google.com:19302" },
// //     {
// //       urls: [
// //         "turn:openrelay.metered.ca:80?transport=udp",
// //         "turn:openrelay.metered.ca:443?transport=tcp",
// //         "turns:openrelay.metered.ca:443?transport=tcp",
// //       ],
// //       username: "openrelayproject",
// //       credential: "openrelayproject",
// //     },
// //   ],
// //   // removed bundlePolicy to avoid max-bundle errors
// //   sdpSemantics: "unified-plan",
// // };

// // export default function VoiceCallScreen() {
// //   const ws = useRef(null);
// //   const userId = useRef(Math.random().toString(36).substr(2, 9));
// //   const localStream = useRef(null);
// //   const peerConnections = useRef({});
// //   const remoteStreams = useRef({});
// //   const queuedRemoteCandidates = useRef({});

// //   const [wsConnected, setWsConnected] = useState(false);
// //   const [inCall, setInCall] = useState(false);
// //   const [otherParticipants, setOtherParticipants] = useState([]);
// //   const [remoteStreamUrls, setRemoteStreamUrls] = useState({});
// //   const [incallStarted, setIncallStarted] = useState(false);
// //   const [callStatus, setCallStatus] = useState(null); // 'ringing', 'connected'
// //   const [incomingCallFrom, setIncomingCallFrom] = useState(null);

// //   useEffect(() => {
// //     setHasActiveCall();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [otherParticipants]);

// //   const setHasActiveCall = () => {
// //     // Derived state kept minimal
// //   };

// //   useEffect(() => {
// //     if (incomingCallFrom && !inCall) {
// //       Alert.alert(
// //         `Incoming call from ${incomingCallFrom}`,
// //         "",
// //         [
// //           {
// //             text: "Accept",
// //             onPress: () => {
// //               acceptIncoming(incomingCallFrom);
// //               setIncomingCallFrom(null);
// //             },
// //           },
// //           {
// //             text: "Reject",
// //             onPress: () => {
// //               rejectIncoming(incomingCallFrom);
// //               setIncomingCallFrom(null);
// //             },
// //           },
// //         ],
// //         { cancelable: false }
// //       );
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [incomingCallFrom, inCall]);

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
// //     return true; // iOS handled via Info.plist
// //   };

// //   // helper to send message with 'from'
// //   const sendMessage = (msg) => {
// //     if (ws.current?.readyState === WebSocket.OPEN) {
// //       const full = { ...msg, from: userId.current };
// //       console.log("[Signaling] Sending:", full.type, "to:", full.to || "all");
// //       ws.current.send(JSON.stringify(full));
// //     } else {
// //       console.warn("[Signaling] WS not open. Can't send:", msg.type);
// //     }
// //   };

// //   const startLocalAudio = async () => {
// //     if (!localStream.current) {
// //       console.log("[MediaDevices] Requesting local audio...");
// //       const stream = await mediaDevices.getUserMedia({ audio: true });
// //       localStream.current = stream;
// //       console.log("[MediaDevices] Local audio tracks:", stream.getAudioTracks().length);
// //     }
// //   };

// //   const drainQueuedCandidatesForPeer = async (peerId) => {
// //     const q = queuedRemoteCandidates.current[peerId] || [];
// //     const pc = peerConnections.current[peerId];
// //     if (pc) {
// //       for (const c of q) {
// //         try {
// //           await pc.addIceCandidate(new RTCIceCandidate(c));
// //           console.log(`[WebRTC] Added queued ICE candidate for ${peerId}`);
// //         } catch (e) {
// //           console.warn(`[WebRTC] queued addIceCandidate error for ${peerId}:`, e);
// //         }
// //       }
// //       queuedRemoteCandidates.current[peerId] = [];
// //     }
// //   };

// //   const createPeerConnection = (peerId) => {
// //     const pc = new RTCPeerConnection(pcConfig);
// //     console.log(`[WebRTC] createPeerConnection ${peerId}`);

// //     // Add local tracks immediately if available
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((track) => {
// //         try {
// //           pc.addTrack(track, localStream.current);
// //           console.log(`[WebRTC] addTrack ${track.kind} -> ${peerId}`);
// //         } catch (e) {
// //           console.warn(`[WebRTC] addTrack failed for ${peerId}:`, e);
// //         }
// //       });
// //     }

// //     pc.ontrack = (evt) => {
// //       console.log(`[WebRTC] ontrack from ${peerId} kind=${evt.track.kind}`);
// //       const stream = evt.streams && evt.streams[0];
// //       if (!stream) {
// //         console.warn("[WebRTC] ontrack event missing stream");
// //         return;
// //       }
// //       remoteStreams.current[peerId] = stream;
// //       setRemoteStreamUrls((prev) => ({ ...prev, [peerId]: stream.toURL() }));

// //       if (!incallStarted && evt.track.kind === "audio") {
// //         try {
// //           InCallManager.start({ media: "audio", auto: true });
// //           InCallManager.setForceSpeakerphoneOn(true);
// //           setIncallStarted(true);
// //           console.log("[InCallManager] started");
// //         } catch (e) {
// //           console.warn("[InCallManager] start failed:", e);
// //         }
// //       }
// //     };

// //     pc.onicecandidate = (evt) => {
// //       if (evt.candidate) {
// //         sendMessage({
// //           type: "candidate",
// //           candidate: evt.candidate.toJSON(),
// //           to: peerId,
// //         });
// //       }
// //     };

// //     pc.onconnectionstatechange = () => {
// //       console.log(`[PC ${peerId}] state=${pc.connectionState}`);
// //       if (pc.connectionState === "failed" || pc.connectionState === "disconnected" || pc.connectionState === "closed") {
// //         removePeer(peerId);
// //       }
// //     };

// //     peerConnections.current[peerId] = pc;
// //     return pc;
// //   };

// //   const removePeer = (peerId) => {
// //     console.log(`[Cleanup] removePeer ${peerId}`);
// //     const pc = peerConnections.current[peerId];
// //     if (pc) {
// //       try {
// //         pc.close();
// //       } catch (e) {
// //         console.warn(`[Cleanup] close pc ${peerId} error`, e);
// //       }
// //     }
// //     delete peerConnections.current[peerId];
// //     delete remoteStreams.current[peerId];
// //     delete queuedRemoteCandidates.current[peerId];

// //     setRemoteStreamUrls((prev) => {
// //       const copy = { ...prev };
// //       delete copy[peerId];
// //       return copy;
// //     });

// //     setOtherParticipants((prev) => prev.filter((id) => id !== peerId));
// //   };

// //   const cleanupAll = () => {
// //     console.log("[Cleanup] cleanupAll");
// //     Object.keys(peerConnections.current).forEach(removePeer);
// //     peerConnections.current = {};
// //     remoteStreams.current = {};
// //     queuedRemoteCandidates.current = {};
// //     setRemoteStreamUrls({});
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((t) => t.stop());
// //       localStream.current = null;
// //     }
// //     setInCall(false);
// //     setCallStatus(null);
// //     setIncallStarted(false);
// //     setIncomingCallFrom(null);
// //     try {
// //       InCallManager.stop();
// //     } catch (e) {
// //       console.warn("[InCallManager] stop failed:", e);
// //     }
// //   };

// //   const connectWebSocket = () => {
// //     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
// //     console.log("[WebSocket] connecting to", url);
// //     ws.current = new WebSocket(url);

// //     ws.current.onopen = () => {
// //       console.log("[WebSocket] Connected");
// //       setWsConnected(true);
// //       sendMessage({ type: "new-user-joined-room" }); // announce presence
// //     };

// //     ws.current.onmessage = async (evt) => {
// //       let data;
// //       try {
// //         data = JSON.parse(evt.data);
// //       } catch (e) {
// //         console.warn("[WebSocket] invalid JSON", e);
// //         return;
// //       }

// //       console.log("[Signaling] Received:", data.type, "from:", data.from);

// //       // ignore messages for others
// //       if (data.to && data.to !== userId.current) return;

// //       const from = data.from;
// //       let pc = peerConnections.current[from];

// //       switch (data.type) {
// //         case "new-user-joined-room":
// //           // When a new user joins, tell them if we're in call
// //           if (from !== userId.current && inCall) {
// //             sendMessage({ type: "i-am-in-call", to: from });
// //           }
// //           break;

// //         case "i-am-in-call":
// //           if (from !== userId.current) {
// //             setOtherParticipants((prev) => [...new Set([...prev, from])]);
// //           }
// //           break;

// //         case "incoming-call":
// //           if (from !== userId.current && !inCall) {
// //             setIncomingCallFrom(from); // will show alert to accept/reject
// //           }
// //           break;

// //         case "call-accepted":
// //           if (from !== userId.current && callStatus === "ringing") {
// //             console.log(`[Signaling] call-accepted by ${from}`);
// //             setCallStatus("connected");
// //             setOtherParticipants((prev) => [...new Set([...prev, from])]);

// //             // Caller: create pc, add local tracks, createOffer -> send offer
// //             pc = peerConnections.current[from];
// //             if (!pc) {
// //               await startLocalAudio();
// //               pc = createPeerConnection(from);
// //               if (localStream.current) {
// //                 localStream.current.getTracks().forEach((t) => {
// //                   try { pc.addTrack(t, localStream.current); } catch (_) {}
// //                 });
// //               }
// //             }
// //             try {
// //               const offer = await pc.createOffer();
// //               await pc.setLocalDescription(offer);
// //               sendMessage({ type: "offer", offer, to: from });
// //               console.log("[WebRTC] Offer sent to acceptor:", from);
// //             } catch (e) {
// //               console.error("[WebRTC] create/send offer error:", e);
// //             }
// //           }
// //           break;

// //         case "user-joined-call":
// //           if (from !== userId.current) {
// //             setOtherParticipants((prev) => [...new Set([...prev, from])]);
// //             // if we are already inCall, proactively create pc + offer to new peer
// //             if (inCall && !peerConnections.current[from]) {
// //               await startLocalAudio();
// //               pc = createPeerConnection(from);
// //               if (localStream.current) {
// //                 localStream.current.getTracks().forEach((t) => {
// //                   try { pc.addTrack(t, localStream.current); } catch (_) {}
// //                 });
// //               }
// //               try {
// //                 const offer = await pc.createOffer();
// //                 await pc.setLocalDescription(offer);
// //                 sendMessage({ type: "offer", offer, to: from });
// //                 console.log("[WebRTC] Offer sent to new peer:", from);
// //               } catch (e) {
// //                 console.error("[WebRTC] offer to new peer error:", e);
// //               }
// //             }
// //           }
// //           break;

// //         case "user-left-call":
// //           if (from !== userId.current) {
// //             removePeer(from);
// //             if (incomingCallFrom === from) setIncomingCallFrom(null);
// //           }
// //           break;

// //         case "offer":
// //           // Callee: accept offer -> setRemoteDescription -> createAnswer -> send answer
// //           if (!inCall) {
// //             // if we aren't in call, auto-accept incoming offer (or you can prompt user)
// //             setInCall(true);
// //           }
// //           pc = peerConnections.current[from];
// //           if (!pc) {
// //             await startLocalAudio();
// //             pc = createPeerConnection(from);
// //             if (localStream.current) {
// //               localStream.current.getTracks().forEach((t) => {
// //                 try { pc.addTrack(t, localStream.current); } catch (_) {}
// //               });
// //             }
// //           }
// //           try {
// //             await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
// //             await drainQueuedCandidatesForPeer(from);
// //             const answer = await pc.createAnswer();
// //             await pc.setLocalDescription(answer);
// //             sendMessage({ type: "answer", answer, to: from });
// //             console.log("[Signaling] Answer sent to", from);
// //           } catch (e) {
// //             console.warn("[Signaling] Failed to process offer:", e);
// //           }
// //           break;

// //         case "answer":
// //           pc = peerConnections.current[from];
// //           if (pc) {
// //             try {
// //               await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
// //               await drainQueuedCandidatesForPeer(from);
// //               console.log("[Signaling] Remote answer set from", from);
// //             } catch (e) {
// //               console.warn("[Signaling] setRemoteDescription(answer) failed:", e);
// //             }
// //           }
// //           break;

// //         case "candidate":
// //           // Add candidate immediately if pc exists and remoteDescription set; otherwise queue it
// //           pc = peerConnections.current[from];
// //           if (pc) {
// //             if (pc.remoteDescription && pc.remoteDescription.type) {
// //               try {
// //                 await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
// //                 console.log("[Signaling] Added ICE candidate from", from);
// //               } catch (e) {
// //                 console.warn("[Signaling] addIceCandidate failed:", e);
// //               }
// //             } else {
// //               queuedRemoteCandidates.current[from] = queuedRemoteCandidates.current[from] || [];
// //               queuedRemoteCandidates.current[from].push(data.candidate);
// //               console.log("[Signaling] Queued ICE candidate from", from);
// //             }
// //           } else {
// //             queuedRemoteCandidates.current[from] = queuedRemoteCandidates.current[from] || [];
// //             queuedRemoteCandidates.current[from].push(data.candidate);
// //             console.log("[Signaling] Queued ICE candidate (no pc) from", from);
// //           }
// //           break;

// //         default:
// //           console.warn("[Signaling] Unknown type:", data.type);
// //       }
// //     };

// //     ws.current.onclose = () => {
// //       console.log("[WebSocket] closed");
// //       setWsConnected(false);
// //       cleanupAll();
// //     };

// //     ws.current.onerror = (err) => {
// //       console.error("[WebSocket] error", err);
// //       Alert.alert("WebSocket Error", "Check signaling server");
// //     };
// //   };

// //   useEffect(() => {
// //     connectWebSocket();
// //     return () => {
// //       cleanupAll();
// //       if (ws.current) ws.current.close();
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const handleStartCall = async () => {
// //     const ok = await requestMicPermission();
// //     if (!ok) return;

// //     try {
// //       await startLocalAudio();
// //     } catch (e) {
// //       Alert.alert("Error", "Failed to get local stream: " + (e.message || e));
// //       return;
// //     }

// //     // add local tracks to any existing PCs (if any)
// //     Object.values(peerConnections.current).forEach((pc) => {
// //       localStream.current.getTracks().forEach((t) => {
// //         try { pc.addTrack(t, localStream.current); } catch (_) {}
// //       });
// //     });

// //     try {
// //       InCallManager.start({ media: "audio", auto: true });
// //       InCallManager.setForceSpeakerphoneOn(true);
// //     } catch (e) {
// //       console.warn("[InCallManager] start failed:", e);
// //     }

// //     setInCall(true);
// //     sendMessage({ type: "user-joined-call" });

// //     // If nobody else, ring room
// //     if (otherParticipants.length === 0) {
// //       sendMessage({ type: "incoming-call" });
// //       setCallStatus("ringing");
// //     }
// //     console.log("[Call] Started");
// //   };

// //   const acceptIncoming = async (from) => {
// //     const ok = await requestMicPermission();
// //     if (!ok) {
// //       Alert.alert("Permission denied", "Cannot access microphone.");
// //       return;
// //     }

// //     try {
// //       await startLocalAudio();
// //     } catch (e) {
// //       Alert.alert("Error", "Failed to get local stream: " + (e.message || e));
// //       return;
// //     }

// //     try {
// //       InCallManager.start({ media: "audio", auto: true });
// //       InCallManager.setForceSpeakerphoneOn(true);
// //       setIncallStarted(true);
// //     } catch (e) {
// //       console.warn("[InCallManager] start failed:", e);
// //     }

// //     setInCall(true);
// //     sendMessage({ type: "call-accepted", to: from });
// //     sendMessage({ type: "user-joined-call" });
// //     console.log("[Call] Accepted incoming call");
// //   };

// //   const rejectIncoming = (from) => {
// //     sendMessage({ type: "call-rejected", to: from });
// //     console.log("[Call] Rejected incoming call");
// //   };

// //   const endCall = (sendLeft = true) => {
// //     console.log("[Call] Ending call");
// //     if (sendLeft) sendMessage({ type: "user-left-call" });
// //     cleanupAll();
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Room: {ROOM_ID}</Text>

// //       <View style={styles.row}>
// //         <Button title="Start Call" onPress={handleStartCall} disabled={!wsConnected || inCall} />
// //         <View style={{ width: 12 }} />
// //         <Button title="End Call" onPress={() => endCall(true)} disabled={!inCall} />
// //       </View>

// //       <View style={styles.info}>
// //         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
// //         <Text>In Call: {inCall ? "Yes" : "No"}</Text>
// //         <Text>Call Status: {callStatus || "None"}</Text>
// //         <Text>Active Participants: {otherParticipants.length}</Text>
// //         <Text>Connected Peers: {Object.keys(remoteStreamUrls).length}</Text>
// //       </View>

// //       {/* Hidden RTCViews that play remote audio */}
// //       {Object.entries(remoteStreamUrls).map(([peerId, url]) => (
// //         <RTCView
// //           key={peerId}
// //           streamURL={url}
// //           style={{ width: 1, height: 1, opacity: 0 }}
// //         />
// //       ))}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 18,
// //     backgroundColor: "#ffffff",
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     marginBottom: 16,
// //     color: "#111827",
// //   },
// //   row: {
// //     flexDirection: "row",
// //     marginBottom: 12,
// //     alignItems: "center",
// //   },
// //   info: {
// //     marginBottom: 12,
// //     padding: 10,
// //     borderRadius: 10,
// //     backgroundColor: "#f3f4f6",
// //   },
// // });


//=============================== this come with audio mik ==================================
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";
// import InCallManager from "react-native-incall-manager";
// const SIGNALING_SERVER = "ws://showa.essential.com.ng:8001";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);


//   const isCallerRef = useRef(false);

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   // Send signaling message via WebSocket
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[Signaling] Sending message:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   // Cleanup WebRTC and media streams
//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing peer connection and streams");
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//     isCallerRef.current = false;

//     InCallManager.stop();
//   };

//   // Create RTCPeerConnection and setup handlers
//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     console.log("[WebRTC] Created RTCPeerConnection");

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         console.log("[WebRTC] ICE candidate generated");
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//     pc.current.onnegotiationneeded = async () => {
//       console.log(
//         "[WebRTC] onnegotiationneeded event triggered. Is caller?",
//         isCallerRef.current
//       );

//       if (!isCallerRef.current) {
//         console.log("[WebRTC] Not caller, skipping offer creation.");
//         return;
//       }

//       if (pc.current.signalingState !== "stable") {
//         console.log(
//           "[WebRTC] signalingState not stable, skipping offer creation. Current state:",
//           pc.current.signalingState
//         );
//         return;
//       }

//       try {
//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);
//         sendMessage({ type: "offer", offer });
//         console.log("[WebRTC] Offer created and sent");
//       } catch (err) {
//         console.error("[WebRTC] Negotiation failed:", err);
//       }
//     };

//     // pc.current.ontrack = (evt) => {
//     //   console.log("[WebRTC] Remote track received:", evt.track.kind);
//     //   if (evt.track.kind === "audio") {
//     //     if (evt.streams && evt.streams[0]) {
//     //       remoteStream.current = evt.streams[0];
//     //       setWebrtcReady(true);

//     //       const audioTracks = evt.streams[0].getAudioTracks();
//     //       audioTracks.forEach((track) => {
//     //         console.log("Remote audio track enabled:", track.enabled);
//     //       });

//     //       // Important: force speakerphone on
//     //       InCallManager.setForceSpeakerphoneOn(true);
//     //       InCallManager.setSpeakerphoneOn(true);
//     //     }
//     //   }
//     // };
//     pc.current.ontrack = (evt) => {
//   console.log("[WebRTC] Remote track received:", evt.track.kind);
//   if (evt.streams && evt.streams[0]) {
//     remoteStream.current = evt.streams[0];
//     setRemoteURL(evt.streams[0].toURL());
//     setWebrtcReady(true);

//     InCallManager.start({ media: "audio" });
//     InCallManager.setForceSpeakerphoneOn(true);

//     console.log("Remote audio tracks:", evt.streams[0].getAudioTracks().length);
//   }
// };

//   };

//   // Get local audio stream and add to PeerConnection
//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return false;
//       }

//       try {
//         console.log("[MediaDevices] Requesting local audio stream");
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//         setLocalURL(s.toURL());

//         console.log("[MediaDevices] Local audio tracks count:", s.getAudioTracks().length);
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     if (!pc.current) {
//       console.warn("[WebRTC] PeerConnection not initialized yet");
//       return false;
//     }

//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         console.log("[WebRTC] Adding local audio track to PeerConnection");
//         pc.current.addTrack(track, localStream.current);
//       }
//     });

//     // Start InCallManager audio with speakerphone ON
//     InCallManager.start({ media: "audio", auto: true, ringback: null, busytone: null });
//     InCallManager.setForceSpeakerphoneOn(true);
//     InCallManager.setSpeakerphoneOn(true);

//     return true;
//   };

//   // Add queued remote ICE candidates after remoteDescription is set
//   const drainQueuedCandidates = async () => {
//     if (!pc.current) {
//       console.warn("[WebRTC] Cannot drain candidates, peer connection is null");
//       return;
//     }
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         console.log("[WebRTC] Adding queued ICE candidate");
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err);
//       }
//     }
//   };

//   // Setup websocket signaling connection
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         console.warn("[WebSocket] Invalid JSON", e);
//         return;
//       }

//       console.log("[Signaling] Message received:", data.type);

//       switch (data.type) {
//         case "offer":
//           if (isCallerRef.current) {
//             console.log("[Signaling] Ignoring own offer");
//             return;
//           }

//           await ensurePeerConnection();

//           const localReady = await ensureLocalStreamAndAttach();
//           if (!localReady) return;

//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when setting remote offer");
//             return;
//           }
//           try {
//             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//           } catch (err) {
//             console.warn("[Signaling] Error setting remote offer:", err);
//             return;
//           }

//           await drainQueuedCandidates();

//           try {
//             const answer = await pc.current.createAnswer();
//             await pc.current.setLocalDescription(answer);
//             sendMessage({ type: "answer", answer });
//             console.log("[Signaling] Answer created and sent");
//           } catch (err) {
//             console.warn("[Signaling] Failed to create/send answer:", err);
//           }
//           break;

//         case "answer":
//           if (!isCallerRef.current) {
//             console.log("[Signaling] Not caller, ignoring answer");
//             return;
//           }
//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when receiving answer");
//             return;
//           }
//           if (pc.current.signalingState === "have-local-offer") {
//             try {
//               await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//               await drainQueuedCandidates();
//               console.log("[Signaling] Remote answer set successfully");
//             } catch (err) {
//               console.warn("[Signaling] Error setting remote answer:", err);
//             }
//           } else {
//             console.warn(
//               "[Signaling] Tried to set remote answer in wrong state",
//               pc.current.signalingState
//             );
//           }
//           break;

//         case "candidate":
//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when receiving candidate");
//             return;
//           }
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//             console.log("[Signaling] Queued ICE candidate");
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log("[Signaling] Added ICE candidate");
//             } catch (err) {
//               console.warn("[Signaling] addIceCandidate error:", err);
//             }
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;

//         default:
//           console.warn("[Signaling] Unknown message type:", data.type);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WebSocket] Connection closed");
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//     console.log("[Call] Starting call as caller");
//     setIsCaller(true);
//     isCallerRef.current = true;

//     const granted = await requestMicPermission();
//     if (!granted) {
//       Alert.alert("Permission denied", "Cannot access microphone.");
//       return;
//     }

//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (localReady) {
//       InCallManager.start({ media: "audio", auto: true });
//       InCallManager.setForceSpeakerphoneOn(true);
//       InCallManager.setSpeakerphoneOn(true);
//     }
//   };

//   const joinCall = async () => {
//     console.log("[Call] Joining call as callee");
//     setIsCaller(false);
//     isCallerRef.current = false;

//     const granted = await requestMicPermission();
//     if (!granted) {
//       Alert.alert("Permission denied", "Cannot access microphone.");
//       return;
//     }

//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (localReady) {
//       InCallManager.start({ media: "audio", auto: true });
//       InCallManager.setForceSpeakerphoneOn(true);
//       InCallManager.setSpeakerphoneOn(true);
//     }
//   };

//   const endCall = (manual = true) => {
//     console.log("[Call] Ending call");
//     if (manual) {
//       sendMessage({ type: "call-ended" });
//     }
//     cleanupPeerConnection();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button
//           title="Start Call"
//           onPress={startCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="Join Call"
//           onPress={joinCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button title="End Call" onPress={() => endCall(true)} disabled={!webrtcReady} />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {/* Local audio stream preview (optional) */}
//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {/* Remote audio stream does NOT need RTCView for audio only */}
//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={{ width: 1, height: 1, opacity: 0 }}
//         />
//       )}

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
// });

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, SafeAreaView, Alert, ImageBackground, Modal, StyleSheet } from 'react-native';
// import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native';
// import { useCallContext } from './CallContext';


// const VoiceCallScreen = ({ navigation, route }) => {
//   const { answerCall, declineCall } = useCallContext();
//   const {
//     receiverId,
//     name,
//     isCaller = false,
//     roomId = 'default-room',
//     callStatus = 'incoming'
//   } = route.params || {};

//   // State and refs
//   const [callStarted, setCallStarted] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [isMuted, setIsMuted] = useState(false);
//   const [activeCalls, setActiveCalls] = useState([]);
//   const [showDiscovery, setShowDiscovery] = useState(!isCaller && callStatus !== 'active');

// // Add these new state variables at the top of your component
// const [isSettingRemoteDescription, setIsSettingRemoteDescription] = useState(false);
// const isCreatingOffer = useRef(false);

//   const pc = useRef(null);
//   const ws = useRef(null);
//   const currentUserId = useRef(`user-${Math.random().toString(36).substring(2, 9)}`);
//   const queuedCandidates = useRef([]);
//   const hasAnnouncedCall = useRef(false);
//   const audioBg = { uri: 'https://example.com/audio-bg.jpg' };

//   // Process queued ICE candidates
//  const processQueuedCandidates = async () => {
//   if (!pc.current || queuedCandidates.current.length === 0 || isSettingRemoteDescription) return;
  
//   const processed = [];
//   for (const candidate of queuedCandidates.current) {
//     try {
//       if (pc.current.remoteDescription) {
//         await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//         processed.push(candidate);
//       }
//     } catch (e) {
//       console.warn('Failed to process queued candidate:', e);
//     }
//   }
//   queuedCandidates.current = queuedCandidates.current.filter(
//     c => !processed.includes(c)
//   );
// };

//   const fixSdpFormat = (sdp) => {
//   if (!sdp) return sdp;
  
//   // Normalize line endings
//   let normalized = sdp.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  
//   // Ensure proper audio media line
//   normalized = normalized.replace(/m=audio.*\r\n/, match => {
//     return match + 'a=rtcp-mux\r\n';
//   });
  
//   // Remove potentially problematic attributes
//   normalized = normalized.replace(/a=extmap:.*\r\n/g, '');
  
//   return normalized;
// };
//   // Get local media stream
//   const getLocalStream = async () => {
//     try {
//       const stream = await mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           channelCount: 1
//         }
//       });
//       setLocalStream(stream);
//       return stream;
//     } catch (error) {
//       Alert.alert('Microphone Error', 'Please enable microphone permissions');
//       return null;
//     }
//   };

//   // Create peer connection

//   const createPeerConnection = () => {
//     if (pc.current) {
//       pc.current.close();
//       pc.current = null;
//     }

//     const configuration = {
//   iceServers: [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { 
//       urls: [
//         'turn:openrelay.metered.ca:80?transport=udp',
//         'turn:openrelay.metered.ca:443?transport=tcp',
//         'turns:openrelay.metered.ca:443?transport=tcp'
//       ],
//       username: 'openrelayproject',
//       credential: 'openrelayproject'
//     }
//   ],
//   iceTransportPolicy: 'all',
//   bundlePolicy: 'max-bundle',
//   rtcpMuxPolicy: 'require',
//   iceCandidatePoolSize: 5, // Reduced from 10 to lower overhead
//   sdpSemantics: 'unified-plan'
// };

//     pc.current = new RTCPeerConnection(configuration);
//  pc.current.onicegatheringstatechange = () => {
//     console.log('ICE gathering state:', pc.current.iceGatheringState);
//   };
//     // Event handlers
//     pc.current.ontrack = (e) => {
//       if (e.streams?.length > 0) setRemoteStream(e.streams[0]);
//     };

//  pc.current.onicecandidate = (e) => {
//   if (e.candidate) {
//     // Filter out potentially problematic candidates
//     if (e.candidate.candidate.indexOf('srflx') === -1 && 
//         e.candidate.candidate.indexOf('relay') === -1) {
//       return;
//     }
    
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({
//         type: 'call.message',
//         data: {
//           type: 'ice-candidate',
//           candidate: e.candidate,
//           senderId: currentUserId.current
//         }
//       }));
//     }
//   }
// };
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (connectionStatus === 'disconnected' || connectionStatus === 'connecting') {
//       console.log('Connection timeout - attempting ICE restart');
//       restartIce();
//     }
//   }, 15000); // Reduced timeout to 15 seconds

//   return () => clearTimeout(timer);
// }, [connectionStatus]);
//     pc.current.oniceconnectionstatechange = () => {
//     console.log('ICE connection state:', pc.current.iceConnectionState);
//     if (pc.current.iceConnectionState === 'failed') {
//       console.log('ICE connection failed, attempting restart...');
//       // Consider implementing ICE restart here
//     }
//   };

//     pc.current.onconnectionstatechange = () => {
//   if (!pc.current) return;
//   const state = pc.current.connectionState;
//   console.log('Connection state changed:', state);
//   setConnectionStatus(state);
  
//   if (state === 'connected') {
//     console.log('Call connected successfully');
//   } else if (state === 'failed') {
//     console.log('Connection failed, attempting restart...');
//     restartIce();
//   }
// };

//     pc.current.onicecandidateerror = (e) => console.error('ICE Error:', e);
//     pc.current.onsignalingstatechange = () => {
//       if (pc.current.signalingState === 'stable') processQueuedCandidates();
//     };
//   };

//   // Setup WebSocket connection
//   const setupWebSocket = async () => {
//     const token = await AsyncStorage.getItem('userToken');
    
//     if (ws.current) {
//       ws.current.close();
//       ws.current = null;
//     }

//     ws.current = new ReconnectingWebSocket(
//       `ws://showa.essential.com.ng/ws/call/${roomId}/?token=${token}`
//     );

//     ws.current.onopen = () => {
//       ws.current.send(JSON.stringify({
//         type: 'user-joined',
//         userId: currentUserId.current,
//         userName: name,
//         senderId: currentUserId.current,
//         roomId: roomId
//       }));

//       if (isCaller && !hasAnnouncedCall.current) {
//         setTimeout(() => startCall(), 300);
//         hasAnnouncedCall.current = true;
//       }
//     };
//     ws.current.onerror = (error) => {
//   console.error('WebSocket error:', error);
//   // Attempt to reconnect
//   setTimeout(setupWebSocket, 1000);
// };

//     ws.current.onmessage = async (e) => {
//   try {
//     const data = JSON.parse(e.data);
//     if (data.senderId === currentUserId.current) return;

//     if (!pc.current) {
//       console.warn('Message received but PeerConnection is null');
//       if (data.data?.candidate) {
//         queuedCandidates.current.push(data.data.candidate);
//       }
//       return;
//     }

//     switch(data.type) {
//       case 'call.message':
//         const message = data.data;
//         switch(message.type) {
//           case 'offer':
//             if (!isCaller) {
//               setIsSettingRemoteDescription(true);
//               await handleIncomingOffer(message);
//               setIsSettingRemoteDescription(false);
//               await processQueuedCandidates();
//             }
//             break;
//           case 'answer':
//             if (isCaller) {
//               setIsSettingRemoteDescription(true);
//               const sanitizedAnswer = {
//                 type: message.type,
//                 sdp: fixSdpFormat(message.sdp)
//               };
//               await pc.current.setRemoteDescription(
//                 new RTCSessionDescription(sanitizedAnswer)
//               );
//               setIsSettingRemoteDescription(false);
//               await processQueuedCandidates();
//             }
//             break;
//           case 'ice-candidate':
//             if (pc.current.remoteDescription) {
//               try {
//                 await pc.current.addIceCandidate(new RTCIceCandidate(message.candidate));
//               } catch (err) {
//                 console.error('ICE candidate error:', err);
//                 queuedCandidates.current.push(message.candidate);
//               }
//             } else {
//               queuedCandidates.current.push(message.candidate);
//             }
//             break;
//           case 'call_ended':
//             endCall();
//             break;
//         }
//         break;
//     }
//   } catch (error) {
//     console.error('Message handling error:', error);
//   }
// };
//   }

//   const restartIce = async () => {
//   if (!pc.current) return;
  
//   try {
//     // Create new offer with iceRestart
//     const offer = await pc.current.createOffer({ iceRestart: true });
    
//     // Modify offer
//     const modifiedOffer = {
//       type: offer.type,
//       sdp: fixSdpFormat(offer.sdp)
//     };
    
//     await pc.current.setLocalDescription(modifiedOffer);
    
//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'offer',
//         sdp: modifiedOffer.sdp,
//         senderId: currentUserId.current,
//         isIceRestart: true
//       }
//     }));
//   } catch (error) {
//     console.error('ICE restart failed:', error);
//     // Fallback to full reconnect
//     endCall();
//     setTimeout(() => {
//       createPeerConnection();
//       startCall();
//     }, 1000);
//   }
// };
// useEffect(() => {
//   const timeout = setTimeout(() => {
//     if (connectionStatus !== 'connected') {
//       console.log('Connection timeout - attempting ICE restart');
//       restartIce();
//     }
//   }, 30000); // 30 second timeout

//   return () => clearTimeout(timeout);
// }, [connectionStatus]);

// const logPeerConnectionState = () => {
//   if (!pc.current) {
//     console.log('PeerConnection: null');
//     return;
//   }
//   console.log('PeerConnection state:', {
//     signalingState: pc.current.signalingState,
//     iceGatheringState: pc.current.iceGatheringState,
//     iceConnectionState: pc.current.iceConnectionState,
//     connectionState: pc.current.connectionState
//   });
// };

//   // Handle incoming offer
//   const handleIncomingOffer = async (offer) => {
//   try {
//     if (!pc.current) {
//       throw new Error('PeerConnection not initialized');
//     }

//     // Clean up any existing streams
//     if (remoteStream) {
//       remoteStream.getTracks().forEach(track => track.stop());
//     }

//     // Modify the offer SDP to ensure compatibility
//     const modifiedOffer = {
//       type: offer.type,
//       sdp: offer.sdp.replace(/a=group:BUNDLE\s.*\r\n/g, '')
//                    .replace(/a=mid:.*\r\n/g, '')
//     };

//     await pc.current.setRemoteDescription(new RTCSessionDescription(modifiedOffer));
//     await processQueuedCandidates();
    
//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);
    
//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'answer',
//         sdp: answer.sdp,
//         senderId: currentUserId.current,
//         receiverId: receiverId,
//         roomId: roomId
//       }
//     }));
//   } catch (error) {
//     console.error('Offer handling failed:', error);
//     endCall();
//   }
// };

//   // Start new call
//   const startCall = async () => {
//   if (!pc.current || isCreatingOffer.current) return;
  
//   isCreatingOffer.current = true;
//   try {
//     const offer = await pc.current.createOffer({
//       offerToReceiveAudio: true,
//       iceRestart: false,
//       voiceActivityDetection: false
//     });
    
//     // Modify offer for better compatibility
//     const modifiedOffer = {
//       type: offer.type,
//       sdp: offer.sdp
//         .replace(/a=group:BUNDLE\s.*\r\n/g, '')
//         .replace(/a=mid:.*\r\n/g, '')
//         .replace(/a=extmap:.*\r\n/g, '')
//     };

//     await pc.current.setLocalDescription(modifiedOffer);
    
//     // Wait for ICE gathering to complete
//     await new Promise((resolve) => {
//       if (pc.current.iceGatheringState === 'complete') {
//         resolve();
//       } else {
//         const checkState = () => {
//           if (pc.current.iceGatheringState === 'complete') {
//             pc.current.removeEventListener('icegatheringstatechange', checkState);
//             resolve();
//           }
//         };
//         pc.current.addEventListener('icegatheringstatechange', checkState);
//       }
//     });

//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'offer',
//         sdp: pc.current.localDescription.sdp,
//         senderId: currentUserId.current,
//         receiverId: receiverId,
//         roomId: roomId
//       }
//     }));
//   } catch (error) {
//     console.error('Offer creation failed:', error);
//     restartIce();
//   } finally {
//     isCreatingOffer.current = false;
//   }
// };

//   // End call cleanup
//   const endCall = () => {

//     if (ws.current) {
//     try {
//       ws.current.close();
//     } catch (e) {
//       console.error('Error closing WebSocket:', e);
//     }
//     ws.current = null;
//   }
  
//   // Then close PeerConnection
//   if (pc.current) {
//     try {
//       pc.current.close();
//     } catch (e) {
//       console.error('Error closing peer connection:', e);
//     }
//     pc.current = null;
//   }
//     try {
//       // Send termination messages if possible
//       if (ws.current?.readyState === WebSocket.OPEN) {
//         try {
//           ws.current.send(JSON.stringify({
//             type: 'call.message',
//             data: { type: 'call_ended', senderId: currentUserId.current }
//           }));
//         } catch (e) {
//           console.error('Error sending call ended message:', e);
//         }
//       }

//       // Cleanup peer connection
//       if (pc.current) {
//         try {
//           // Remove all event listeners
//           pc.current.onicecandidate = null;
//           pc.current.oniceconnectionstatechange = null;
//           pc.current.onsignalingstatechange = null;
//           pc.current.onconnectionstatechange = null;
//           pc.current.ontrack = null;
          
//           // Close connection
//           pc.current.close();
//         } catch (e) {
//           console.error('Error closing peer connection:', e);
//         } finally {
//           pc.current = null;
//         }
//       }

//       // Cleanup media stream
//       if (localStream) {
//         try {
//           localStream.getTracks().forEach(track => track.stop());
//         } catch (e) {
//           console.error('Error stopping tracks:', e);
//         }
//         setLocalStream(null);
//       }
//     } catch (error) {
//       console.error('Error during call cleanup:', error);
//     } finally {
//       setCallStarted(false);
//       setConnectionStatus('disconnected');
//     }
//   };

//   // Initialize call
//   useEffect(() => {
//     let mounted = true;
    
//     const init = async () => {
//       const stream = await getLocalStream();
//       if (!stream || !mounted) {
//         if (mounted) navigation.goBack();
//         return;
//       }
      
//       createPeerConnection();
//       await setupWebSocket();
      
//       stream.getAudioTracks().forEach(track => {
//         pc.current?.addTrack(track, stream);
//       });

//       if (isCaller) setTimeout(() => startCall(), 500);
//     };

//     init();
    
//     return () => {
//       mounted = false;
//       endCall();
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground source={audioBg} style={styles.background}>
//         <View style={styles.overlay}>
//           <LottieView
//              source={require("../assets/animations/voice icon lottie animation.json")}
//             autoPlay
//             loop
//             style={styles.image}
//           />
//           <Text style={styles.title}>
//             {callStarted ? `In call with ${name}` : 'Setting up call...'}
//           </Text>
//           <Text style={styles.statusText}>Status: Connecting in progress</Text>
//           <Text style={styles.statusText}>Status: {connectionStatus}</Text>
//         </View>
//       </ImageBackground>

//       <View style={styles.controls}>
//         {callStarted && (
//           <TouchableOpacity 
//             style={[styles.button, isMuted ? styles.muted : styles.unmuted]} 
//             onPress={() => setIsMuted(!isMuted)}
//           >
//             <FontAwesome5 
//               name={isMuted ? "microphone-slash" : "microphone"} 
//               size={18} 
//               color="#fff" 
//             />
//             <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
//           </TouchableOpacity>
//         )}
        
//         <TouchableOpacity 
//           style={[styles.button, styles.end]} 
//           onPress={()=>navigation.goBack()}
//           //onPress={endCall}
//         >
//           <FontAwesome5 name="phone-slash" size={18} color="#fff" />
//           <Text style={styles.buttonText}>End Call</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111'
//   },
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   overlay: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     width: '90%'
//   },
//   title: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginVertical: 16,
//     textAlign: 'center'
//   },
//   statusText: {
//     color: '#ddd',
//     fontSize: 16,
//     textAlign: 'center'
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 20,
//     backgroundColor: '#1c1c1c',
//     borderTopWidth: 1,
//     borderTopColor: '#333'
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 30,
//     minWidth: 120,
//     justifyContent: 'center'
//   },
//   end: {
//     backgroundColor: '#e53935'
//   },
//   muted: {
//     backgroundColor: '#ff9500'
//   },
//   unmuted: {
//     backgroundColor: '#007aff'
//   },
//   image: {
//     width: '80%',
//     height: 220,
//     marginBottom: 30,
//   },
//   buttonText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)'
//   },
//   modalContent: {
//     backgroundColor: '#2a2a2a',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     maxHeight: '70%'
//   },
//   modalTitle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   noCallsText: {
//     color: '#aaa',
//     textAlign: 'center',
//     marginVertical: 20
//   },
//   callItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#444'
//   },
//   callItemText: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 10
//   },
//   closeButton: {
//     marginTop: 20,
//     padding: 10,
//     alignSelf: 'center'
//   },
//   closeButtonText: {
//     color: '#0a84ff',
//     fontSize: 16,
//     fontWeight: 'bold'
//   }
// });
// export default VoiceCallScreen


/////================================  this code is working fine users can call and hear each others ==========

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
  
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);

//   const isCallerRef = useRef(false);

//   const rtcConfig = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permissionv",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   // Send message via websocket with debug log
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[Signaling] Sending message:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   // Cleanup all WebRTC and media
//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing peer connection and streams");
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//   };

//   // Create RTCPeerConnection and setup handlers
//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection(rtcConfig);
//     console.log("[WebRTC] Created RTCPeerConnection");

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         console.log("[WebRTC] ICE candidate generated");
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//    pc.current.onnegotiationneeded = async () => {
//   console.log("[WebRTC] onnegotiationneeded event triggered. Is caller?", isCallerRef.current);
  
//   if (!isCallerRef.current) {
//     console.log("[WebRTC] Not caller, skipping offer creation.");
//     return;
//   }

//   if (pc.current.signalingState !== "stable") {
//     console.log("[WebRTC] signalingState not stable, skipping offer creation to avoid conflicts. Current state:", pc.current.signalingState);
//     return;
//   }

//   try {
//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);
//     sendMessage({ type: "offer", offer });
//     console.log("[WebRTC] Offer created and sent");
//   } catch (err) {
//     console.error("[WebRTC] Negotiation failed:", err);
//   }
// };



//     pc.current.ontrack = (evt) => {
//   console.log("[WebRTC] Remote track received:", evt.track.kind);
//   if (evt.streams && evt.streams[0]) {
//     remoteStream.current = evt.streams[0];
//     setRemoteURL(remoteStream.current.toURL());
//     setWebrtcReady(true);
//   }
// };
//   };

//   // Get local audio stream and add to PeerConnection
//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return false;
//       }

//       try {
//         console.log("[MediaDevices] Requesting local audio stream");
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//          console.log("[MediaDevices] Local stream tracks:", localStream.current.getTracks());
//         setLocalURL(s.toURL());
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     // Attach tracks to peer connection if not already attached
//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         console.log("[WebRTC] Adding local audio track to PeerConnection,,");
//         pc.current.addTrack(track, localStream.current);
//       }
//     });
//     return true;
//   };

//   // Add queued remote ICE candidates after remoteDescription is set
//   const drainQueuedCandidates = async () => {
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         console.log("[WebRTC] Adding queued ICE candidate");
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err);
//       }
//     }
//   };

//   // Setup websocket signaling connection
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         console.warn("[WebSocket] Invalid JSON", e);
//         return;
//       }

//       console.log("[Signaling] Message received:", data.type);

//       switch (data.type) {
//         case "offer":
//           if (isCallerRef.current) {
//             console.log("[Signaling] Ignoring own offer");
//             return;
//           }

//           await ensurePeerConnection();

//           const localReady = await ensureLocalStreamAndAttach();
//           if (!localReady) return;

//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(data.offer)
//           );
//           await drainQueuedCandidates();

//           const answer = await pc.current.createAnswer();
//           await pc.current.setLocalDescription(answer);
//           sendMessage({ type: "answer", answer });
//           console.log("[Signaling] Answer created and sent");
//           break;

//         case "answer":
//           if (!isCallerRef.current) {
//             console.log("[Signaling] Not caller, ignoring answer");
//             return;
//           }
//           if (pc.current.signalingState === "have-local-offer") {
//             await pc.current.setRemoteDescription(
//               new RTCSessionDescription(data.answer)
//             );
//             await drainQueuedCandidates();
//           } else {
//             console.warn("[Signaling] Tried to set remote answernn in wrong state", pc.current.signalingState);
//           }
//           break;


//         case "candidate":
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//             console.log("[Signaling] Queued ICE candidate");
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log("[Signaling] Added ICE candidate");
//             } catch (err) {
//               console.warn("[Signaling] addIceCandidate error:", err);
//             }
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;

//         default:
//           console.warn("[Signaling] Unknown message type:", data.type);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WebSocket] Connection closed");
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   // Component mount: connect WebSocket
//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//   console.log("[Call] Starting call as caller");
//   setIsCaller(true);
//   isCallerRef.current = true;  // Keep ref in sync
//   await ensurePeerConnection();
//   await ensureLocalStreamAndAttach();
// };

//   const joinCall = async () => {
//   console.log("[Call] Joining call as callee");
//   setIsCaller(false);
//   isCallerRef.current = false;
//   await ensurePeerConnection();
//   await ensureLocalStreamAndAttach();
// };

//   const endCall = (manual = true) => {
//     console.log("[Call] Ending call");
//     if (manual) {
//       sendMessage({ type: "call-ended" });
//     }
//     cleanupPeerConnection();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button
//           title="Start Call"
//           onPress={startCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="Join Call"
//           onPress={joinCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="End Call"
//           onPress={() => endCall(true)}
//           disabled={!webrtcReady}
//         />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {/* Local audio stream preview (optional video can be added if needed) */}
//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {/* Remote audio stream must be rendered (even invisible) to play audio */}
//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={styles.remoteView}
//           objectFit="cover"
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
//   remoteView: {
//     width: 0,
//     height: 0,
    
//     // Invisible but required to play audio
//   },
// });





//// =================== WORKING PERFECTLY ======================================================

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";
// import { useCall } from "./CallContext";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen({navigation}) {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);

//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);

//   // NEW: incoming call state
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [showIncomingModal, setShowIncomingModal] = useState(false);

//   const isCallerRef = useRef(false);

//   const rtcConfig = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS handled in Info.plist
//   };

//   // Send message via websocket
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[Signaling] Sending message:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   // Cleanup connection
//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing peer connection and streams");
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//     //navigation.goBack();
//   };

//   // Create RTCPeerConnection
//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection(rtcConfig);
//     console.log("[WebRTC] Created RTCPeerConnection");

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         console.log("[WebRTC] ICE candidate generated");
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//     pc.current.onnegotiationneeded = async () => {
//       if (!isCallerRef.current) return;
//       if (pc.current.signalingState !== "stable") return;
//       try {
//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);
//         sendMessage({ type: "offer", offer });
//         console.log("[WebRTC] Offer created and sent");
//       } catch (err) {
//         console.error("[WebRTC] Negotiation failed:", err);
//       }
//     };

//     pc.current.ontrack = (evt) => {
//       if (evt.streams && evt.streams[0]) {
//         remoteStream.current = evt.streams[0];
//         setRemoteURL(remoteStream.current.toURL());
//         setWebrtcReady(true);
//       }
//     };
//   };

 



//   // Get local mic stream
//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return false;
//       }
//       try {
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//         setLocalURL(s.toURL());
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }
//     // Attach to peer
//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         pc.current.addTrack(track, localStream.current);
//       }
//     });
//     return true;
//   };

//   // Apply queued candidates
//   const drainQueuedCandidates = async () => {
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err);
//       }
//     }
//   };

//   // WebSocket connect
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         return;
//       }

      
//       switch (data.type) {
        
//         case "offer":
//           if (isCallerRef.current) return;
//           console.log("[Signaling] Incoming call offer received");
//           setIncomingCall(data.offer);
//           setShowIncomingModal(true);
//           break;

//         case "answer":
//           if (!isCallerRef.current) return;
//           if (pc.current.signalingState === "have-local-offer") {
//             await pc.current.setRemoteDescription(
//               new RTCSessionDescription(data.answer)
//             );
//             await drainQueuedCandidates();
//           }
//           break;

//         case "candidate":
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//           } else {
//             try {
//               await pc.current.addIceCandidate(
//                 new RTCIceCandidate(data.candidate)
//               );
//             } catch {}
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) ws.current.close();
//     };
//   }, []);

//   // === Call Controls ===
//   const startCall = async () => {
//     setIsCaller(true);
//     isCallerRef.current = true;
//     await ensurePeerConnection();
//     await ensureLocalStreamAndAttach();
//   };

//   const acceptCall = async () => {
//     setIsCaller(false);
//     isCallerRef.current = false;
//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (!localReady) return;
//     await pc.current.setRemoteDescription(new RTCSessionDescription(incomingCall));
//     await drainQueuedCandidates();
//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);
//     sendMessage({ type: "answer", answer });
//     setShowIncomingModal(false);
//     setIncomingCall(null);
//   };

//   const rejectCall = () => {
//     sendMessage({ type: "call-ended" });
//     setShowIncomingModal(false);
//     navigation.navigate('BusinessHome');
//     setIncomingCall(null);
//   };

//   const endCall = (manual = true) => {
//     if (manual) sendMessage({ type: "call-ended" });
//     cleanupPeerConnection();
//     navigation.navigate('BusinessHome');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button
//           title="Start Call"
//           onPress={startCall}
//           disabled={!wsConnected || webrtcReady}
//         />
//         <View style={{ width: 12 }} />
//         <Button
//           title="End Call"
//           onPress={() => endCall(true)}
//           disabled={!webrtcReady}
//         />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={styles.remoteView}
//           objectFit="cover"
//         />
//       )}

//       {/* Incoming Call Modal */}
//       {showIncomingModal && (
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>📞 Incoming Call</Text>
//             <View style={styles.modalButtons}>
//               <Button title="Reject" color="red" onPress={rejectCall} />
//               <Button title="Accept" onPress={acceptCall} />
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
//   remoteView: { width: 0, height: 0 }, // hidden but plays audio
//   modalOverlay: {
//     position: "absolute",
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalBox: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 12,
//     width: "80%",
//     alignItems: "center",
//   },
//   modalTitle: { fontSize: 18, marginBottom: 20, fontWeight: "bold" },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
// });



// ======================== WORKING PERFECTLY FOR CALLS =============================

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  RTCView,
} from "react-native-webrtc";
import { encode as btoa } from "base-64";
import { useCall } from "./CallContext";
import { Image } from "react-native-animatable";
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { API_ROUTE_IMAGE } from "../api_routing/api";
import LottieView from "lottie-react-native";

const SIGNALING_SERVER = "ws://showa.essential.com.ng";
const ROOM_ID = "unique-room-id";


export default function VoiceCallScreen({ navigation, route }) {
  

   const { profile_image, name, incomingOffer, isIncomingCall } = route.params || {};

  const ws = useRef(null);
  const pc = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const queuedRemoteCandidates = useRef([]);
  const rtcConfig = useRef({ iceServers: [] }).current;

  const [wsConnected, setWsConnected] = useState(false);
  const [webrtcReady, setWebrtcReady] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [localURL, setLocalURL] = useState(null);
  const [remoteURL, setRemoteURL] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  const isCallerRef = useRef(false);

  // Start/stop call timer
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
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [webrtcReady]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ✅ Fetch ICE servers from Xirsys once
  const getIceServers = async () => {
    try {
      const res = await fetch("https://global.xirsys.net/_turn/Showa", {
        method: "PUT",
        headers: {
          Authorization:
            "Basic " +
            btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format: "urls" }),
      });

      const data = await res.json();
      console.log("[Xirsys] Raw response:", data);

      // Transform the response into proper iceServers array
      let iceServers = [];
      if (data.v?.iceServers) {
        // Some accounts return the ready-to-use array
        iceServers = data.v.iceServers;
      } else if (data.v?.urls) {
        // Others return single object with urls, username, credential
        iceServers = data.v.urls.map((url) => ({
          urls: url,
          username: data.v.username,
          credential: data.v.credential,
        }));
      }

      rtcConfig.iceServers = iceServers.length
        ? iceServers
        : [{ urls: "stun:stun.l.google.com:19302" }]; // fallback

      console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
    } catch (err) {
      console.error("[Xirsys] Failed to fetch ICE servers:", err);
      rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
    }
  };

  // Request microphone permission on Android
  const requestMicPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone for calls",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Send message via websocket
  const sendMessage = (msg) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("[Signaling] Sending message:", msg.type);
      ws.current.send(JSON.stringify(msg));
    }
  };

  // Cleanup connection
  const cleanupPeerConnection = () => {
    console.log("[Cleanup] Closing peer connection and streams");
    if (pc.current) {
      pc.current.onicecandidate = null;
      pc.current.ontrack = null;
      pc.current.onnegotiationneeded = null;
      pc.current.close();
      pc.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((t) => t.stop());
      localStream.current = null;
    }
    remoteStream.current = null;
    queuedRemoteCandidates.current = [];
    setLocalURL(null);
    setRemoteURL(null);
    setWebrtcReady(false);
    setIsCaller(false);
  };

  // Create RTCPeerConnection
  const ensurePeerConnection = async () => {
    if (pc.current) return;

    if (!rtcConfig.iceServers.length) {
      await getIceServers();
    }

    pc.current = new RTCPeerConnection(rtcConfig);
    console.log(
      "[WebRTC] Created RTCPeerConnection with ICE servers:",
      rtcConfig.iceServers
    );

    pc.current.onicecandidate = (evt) => {
      if (evt.candidate) {
        console.log("[WebRTC] ICE candidate generated");
        sendMessage({ type: "candidate", candidate: evt.candidate });
      }
    };

    pc.current.onnegotiationneeded = async () => {
      if (!isCallerRef.current) return;
      if (pc.current.signalingState !== "stable") return;
      try {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        sendMessage({ type: "offer", offer });
        console.log("[WebRTC] Offer created and sent");
      } catch (err) {
        console.error("[WebRTC] Negotiation failed:", err);
      }
    };

    pc.current.ontrack = (evt) => {
      if (evt.streams && evt.streams[0]) {
        remoteStream.current = evt.streams[0];
        setRemoteURL(remoteStream.current.toURL());
        setWebrtcReady(true);
      }
    };
  };

  // Get local mic stream
  const ensureLocalStreamAndAttach = async () => {
    if (!localStream.current) {
      const hasPermission = await requestMicPermission();
      if (!hasPermission) {
        Alert.alert("Permission denied", "Cannot access microphone.");
        return false;
      }
      try {
        const s = await mediaDevices.getUserMedia({ audio: true });
        localStream.current = s;
        setLocalURL(s.toURL());
      } catch (e) {
        Alert.alert("Error", "Failed to get local stream: " + e.message);
        return false;
      }
    }
    // Attach to peer
    const senders = pc.current.getSenders();
    const senderTracks = senders.map((s) => s.track);
    localStream.current.getAudioTracks().forEach((track) => {
      if (!senderTracks.includes(track)) {
        pc.current.addTrack(track, localStream.current);
      }
    });
    return true;
  };

  // Apply queued candidates
  const drainQueuedCandidates = async () => {
    while (queuedRemoteCandidates.current.length > 0) {
      const c = queuedRemoteCandidates.current.shift();
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(c));
      } catch (err) {
        console.warn("[WebRTC] addIceCandidate error:", err);
      }
    }
  };

  // WebSocket connect
  const connectWebSocket = () => {
    const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
    ws.current = new WebSocket(url);

    ws.current.onopen = async () => {
      console.log("[WebSocket] Connected");
      setWsConnected(true);
      await ensurePeerConnection();
    };

    ws.current.onmessage = async (evt) => {
      let data;
      try {
        data = JSON.parse(evt.data);
      } catch (e) {
        return;
      }

      switch (data.type) {
        case "offer":
          if (isCallerRef.current) return;
          console.log("[Signaling] Incoming call offer received");
          setIncomingCall(data.offer);
          setShowIncomingModal(true);
          break;

        case "answer":
          if (!isCallerRef.current) return;
          if (pc.current.signalingState === "have-local-offer") {
            await pc.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            await drainQueuedCandidates();
          }
          break;

        case "candidate":
          if (!pc.current.remoteDescription) {
            queuedRemoteCandidates.current.push(data.candidate);
          } else {
            try {
              await pc.current.addIceCandidate(
                new RTCIceCandidate(data.candidate)
              );
            } catch {}
          }
          break;

        case "call-ended":
          Alert.alert("Call ended", "Remote participant left");
          cleanupPeerConnection();
          break;
      }
    };

    ws.current.onclose = () => {
      setWsConnected(false);
      cleanupPeerConnection();
    };
  };

  useEffect(() => {
    // Handle incoming call if we have an offer
    if (isIncomingCall && incomingOffer) {
      handleIncomingCall(incomingOffer);
    }
  }, [isIncomingCall, incomingOffer]);

  const handleIncomingCall = async (offer) => {
    try {
      await ensurePeerConnection();
      await ensureLocalStreamAndAttach();
      
      // Set the remote description from the offer
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      await drainQueuedCandidates();
      
      // Create and send answer
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      sendMessage({ type: 'answer', answer });
      
      setWebrtcReady(true);
    } catch (error) {
      console.error('Error handling incoming call:', error);
      Alert.alert('Error', 'Failed to accept call');
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      cleanupPeerConnection();
      if (ws.current) ws.current.close();
    };
  }, []);

  // === Call Controls ===
  const startCall = async () => {
    setIsCaller(true);
    isCallerRef.current = true;
    await ensurePeerConnection();
    await ensureLocalStreamAndAttach();
  };

  const acceptCall = async () => {
    setIsCaller(false);
    isCallerRef.current = false;
    await ensurePeerConnection();
    const localReady = await ensureLocalStreamAndAttach();
    if (!localReady) return;
    await pc.current.setRemoteDescription(new RTCSessionDescription(incomingCall));
    await drainQueuedCandidates();
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);
    sendMessage({ type: "answer", answer });
    setShowIncomingModal(false);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    sendMessage({ type: "call-ended" });
    setShowIncomingModal(false);
    navigation.goBack();
    setIncomingCall(null);
  };

  const endCall = (manual = true) => {
    if (manual) sendMessage({ type: "call-ended" });
    cleanupPeerConnection();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Main call screen */}
      {webrtcReady ? (
        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.callScreen}>
          <View style={styles.callHeader}>
            <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
            <Text style={styles.callerName}>{name}</Text>
            <Text style={styles.callStatus}>Connected</Text>
          </View>
          
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image 
                source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} 
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>
          
          <View style={styles.callControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
              <View style={[styles.controlIcon, {backgroundColor: '#4a5568'}]}>
                <Icon name="mic-off" size={24} color="white" />
              </View>
              <Text style={styles.controlText}>Mute</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={() => endCall(true)}>
              <View style={[styles.controlIcon, {backgroundColor: '#e53e3e'}]}>
                <Icon name="call-end" size={24} color="white" />
              </View>
              <Text style={styles.controlText}>End</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
              <View style={[styles.controlIcon, {backgroundColor: '#4a5568'}]}>
                <Icon name="volume-up" size={24} color="white" />
              </View>
              <Text style={styles.controlText}>Speaker</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.preCallScreen}>
          <View style={styles.preCallContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.largeAvatar}>
              
                <Image 
                  source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} 
                  style={styles.largeAvatarImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.contactName}>{name}</Text>
              <Text style={styles.contactStatus}>
                {wsConnected ? "Ready to call" : "Connecting..."}
              </Text>
            </View>
            
            <View style={styles.preCallControls}>
              <TouchableOpacity 
                style={[styles.actionButton, !wsConnected && styles.disabledButton]} 
                onPress={startCall}
                disabled={!wsConnected}
              >
                <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.callButton}>
                  <Icon name="call" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, !webrtcReady && styles.disabledButton]} 
                onPress={() => endCall(true)}
                disabled={!webrtcReady}
              >
                <View style={[styles.callButton, {backgroundColor: '#e53e3e'}]}>
                  <Icon name="call-end" size={24} color="white" />
                </View>
                <Text style={styles.actionButtonText}>End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      )}
      
      {/* Incoming Call Modal */}
      <Modal
        visible={showIncomingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={rejectCall}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.incomingCallText}>Incoming Call</Text>
              
              <View style={styles.callerInfo}>
                <View style={styles.modalAvatar}>
                  <Image 
                    source={{ uri: `${API_ROUTE_IMAGE}${profile_image}` }} 
                    style={styles.modalAvatarImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.modalCallerName}>{name}</Text>
                <Text style={styles.modalCallType}>Voice Call</Text>
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
    justifyContent: 'space-between',
    padding: 20,
  },
  preCallScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  preCallContent: {
    alignItems: 'center',
    width: '100%',
    padding: 20,
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
    fontSize: 28,
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
    //backgroundColor: '#4a5568',
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
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  contactName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 10,
  },
  contactStatus: {
    fontSize: 16,
    color: '#718096',
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
    color: '#2d3748',
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
    alignItems: 'center',
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
});


/// ============== not working but for testing =================

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";
// import InCallManager from "react-native-incall-manager";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VoiceCallScreen() {
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);

//   const isCallerRef = useRef(false);

//   // Request microphone permission on Android
//   const requestMicPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: "Microphone Permission",
//             message: "App needs access to your microphone for calls",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions handled in Info.plist
//   };

//   // Send signaling message via WebSocket
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       console.log("[Signaling] Sending message:", msg.type);
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   // Cleanup WebRTC and media streams
//   const cleanupPeerConnection = () => {
//     console.log("[Cleanup] Closing peer connection and streams");
//     if (pc.current) {
//       pc.current.onicecandidate = null;
//       pc.current.ontrack = null;
//       pc.current.onnegotiationneeded = null;
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//     setIsCaller(false);
//     isCallerRef.current = false;

//     InCallManager.stop();
//   };

//   // Create RTCPeerConnection and setup handlers
//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     console.log("[WebRTC] Created RTCPeerConnection");

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         console.log("[WebRTC] ICE candidate generated");
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//     pc.current.onnegotiationneeded = async () => {
//       console.log("[WebRTC] onnegotiationneeded event triggered. Is caller?", isCallerRef.current);

//       if (!isCallerRef.current) {
//         console.log("[WebRTC] Not caller, skipping offer creation.");
//         return;
//       }

//       if (pc.current.signalingState !== "stable") {
//         console.log(
//           "[WebRTC] signalingState not stable, skipping offer creation. Current state:",
//           pc.current.signalingState
//         );
//         return;
//       }

//       try {
//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);
//         sendMessage({ type: "offer", offer });
//         console.log("[WebRTC] Offer created and sent");
//       } catch (err) {
//         console.error("[WebRTC] Negotiation failed:", err);
//       }
//     };

//     pc.current.ontrack = (evt) => {
//       console.log("[WebRTC] Remote track received:", evt.track.kind);
//       if (evt.streams && evt.streams[0]) {
//         remoteStream.current = evt.streams[0];
//         setRemoteURL(remoteStream.current.toURL());
//         setWebrtcReady(true);

//         // Debug remote audio tracks
//         const remoteAudioTracks = remoteStream.current.getAudioTracks();
//         console.log("[WebRTC] Remote audio tracks count:", remoteAudioTracks.length);

//         // Make sure InCallManager speakerphone is ON here
//         InCallManager.setSpeakerphoneOn(true);
//       }
//     };
//   };

//   // Get local audio stream and add to PeerConnection
//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Cannot access microphone.");
//         return false;
//       }

//       try {
//         console.log("[MediaDevices] Requesting local audio stream");
//         const s = await mediaDevices.getUserMedia({ audio: true });
//         localStream.current = s;
//         setLocalURL(s.toURL());

//         console.log("[MediaDevices] Local audio tracks count:", s.getAudioTracks().length);
//       } catch (e) {
//         Alert.alert("Error", "Failed to get local stream: " + e.message);
//         return false;
//       }
//     }

//     if (!pc.current) {
//       console.warn("[WebRTC] PeerConnection not initialized yet");
//       return false;
//     }

//     const senders = pc.current.getSenders();
//     const senderTracks = senders.map((s) => s.track);
//     localStream.current.getAudioTracks().forEach((track) => {
//       if (!senderTracks.includes(track)) {
//         console.log("[WebRTC] Adding local audio track to PeerConnection");
//         pc.current.addTrack(track, localStream.current);
//       }
//     });

//     // Start InCallManager audio with speakerphone ON
//     InCallManager.start({ media: "audio", auto: true, ringback: null, busytone: null });
    
//     InCallManager.setSpeakerphoneOn(true);

//     return true;
//   };

//   // Add queued remote ICE candidates after remoteDescription is set
//   const drainQueuedCandidates = async () => {
//     if (!pc.current) {
//       console.warn("[WebRTC] Cannot drain candidates, peer connection is null");
//       return;
//     }
//     while (queuedRemoteCandidates.current.length > 0) {
//       const c = queuedRemoteCandidates.current.shift();
//       try {
//         console.log("[WebRTC] Adding queued ICE candidate");
//         await pc.current.addIceCandidate(new RTCIceCandidate(c));
//       } catch (err) {
//         console.warn("[WebRTC] addIceCandidate error:", err);
//       }
//     }
//   };

//   // Setup websocket signaling connection
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       console.log("[WebSocket] Connected");
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch (e) {
//         console.warn("[WebSocket] Invalid JSON", e);
//         return;
//       }

//       console.log("[Signaling] Message received:", data.type);

//       switch (data.type) {
//         case "offer":
//           if (isCallerRef.current) {
//             console.log("[Signaling] Ignoring own offer");
//             return;
//           }

//           await ensurePeerConnection();

//           const localReady = await ensureLocalStreamAndAttach();
//           if (!localReady) return;

//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when setting remote offer");
//             return;
//           }
//           try {
//             await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//           } catch (err) {
//             console.warn("[Signaling] Error setting remote offer:", err);
//             return;
//           }

//           await drainQueuedCandidates();

//           try {
//             const answer = await pc.current.createAnswer();
//             await pc.current.setLocalDescription(answer);
//             sendMessage({ type: "answer", answer });
//             console.log("[Signaling] Answer created and sent");
//           } catch (err) {
//             console.warn("[Signaling] Failed to create/send answer:", err);
//           }
//           break;

//         case "answer":
//           if (!isCallerRef.current) {
//             console.log("[Signaling] Not caller, ignoring answer");
//             return;
//           }
//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when receiving answer");
//             return;
//           }
//           if (pc.current.signalingState === "have-local-offer") {
//             try {
//               await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//               await drainQueuedCandidates();
//               console.log("[Signaling] Remote answer set successfully");
//             } catch (err) {
//               console.warn("[Signaling] Error setting remote answer:", err);
//             }
//           } else {
//             console.warn(
//               "[Signaling] Tried to set remote answer in wrong state",
//               pc.current.signalingState
//             );
//           }
//           break;

//         case "candidate":
//           if (!pc.current) {
//             console.warn("[Signaling] PeerConnection null when receiving candidate");
//             return;
//           }
//           if (!pc.current.remoteDescription) {
//             queuedRemoteCandidates.current.push(data.candidate);
//             console.log("[Signaling] Queued ICE candidate");
//           } else {
//             try {
//               await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//               console.log("[Signaling] Added ICE candidate");
//             } catch (err) {
//               console.warn("[Signaling] addIceCandidate error:", err);
//             }
//           }
//           break;

//         case "call-ended":
//           Alert.alert("Call ended", "Remote participant left");
//           cleanupPeerConnection();
//           break;

//         default:
//           console.warn("[Signaling] Unknown message type:", data.type);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log("[WebSocket] Connection closed");
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };

//     ws.current.onerror = (err) => {
//       console.error("[WebSocket] Error:", err);
//       Alert.alert("WebSocket Error", "Connection error occurred");
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//     console.log("[Call] Starting call as caller");
//     setIsCaller(true);
//     isCallerRef.current = true;

//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (localReady) {
//       InCallManager.start({ media: "audio" });
     
//       InCallManager.setSpeakerphoneOn(true);
//     }
//   };

//   const joinCall = async () => {
//     console.log("[Call] Joining call as callee");
//     setIsCaller(false);
//     isCallerRef.current = false;

//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (localReady) {
//       InCallManager.start({ media: "audio" });
      
//       InCallManager.setSpeakerphoneOn(true);
//     }
//   };

//   const endCall = (manual = true) => {
//     console.log("[Call] Ending call");
//     if (manual) {
//       sendMessage({ type: "call-ended" });
//     }
//     cleanupPeerConnection();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room: {ROOM_ID}</Text>

//       <View style={styles.row}>
//         <Button title="Start Call" onPress={startCall} disabled={!wsConnected || webrtcReady} />
//         <View style={{ width: 12 }} />
//         <Button title="Join Call" onPress={joinCall} disabled={!wsConnected || webrtcReady} />
//         <View style={{ width: 12 }} />
//         <Button title="End Call" onPress={() => endCall(true)} disabled={!webrtcReady} />
//       </View>

//       <View style={styles.info}>
//         <Text>WebSocket: {wsConnected ? "Connected" : "Disconnected"}</Text>
//         <Text>Role: {isCaller ? "Caller" : "Callee"}</Text>
//         <Text>Call Active: {webrtcReady ? "Yes" : "No"}</Text>
//       </View>

//       {/* Local audio stream preview (optional) */}
//       {localURL && (
//         <RTCView
//           streamURL={localURL}
//           style={styles.localView}
//           objectFit="cover"
//           mirror={true}
//         />
//       )}

//       {/* Remote audio stream must be rendered (even invisible) to play audio */}
//       {remoteURL && (
//         <RTCView
//           streamURL={remoteURL}
//           style={styles.remoteView}
//           objectFit="cover"
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//   info: { marginBottom: 12 },
//   localView: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
//   remoteView: {
//     width: 1,
//     height: 1,
//     opacity: 0,
//   },
// });

// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert
// } from 'react-native';
// import {
//   RTCView, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices
// } from 'react-native-webrtc';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// const room = 'video-room';

// const VideoCallScreen = () => {
//   const [callStarted, setCallStarted] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [isCaller, setIsCaller] = useState(false);

//   const pc = useRef(null);
//   const ws = useRef(null);
//   const sessionId = useRef(Date.now().toString());

//   useEffect(() => {
//     setupWebSocket();
//     return () => {
//       if (ws.current) {
//         ws.current.close();
//         ws.current = null;
//       }
//     };
//   }, []);

//   const setupWebSocket = () => {
//     ws.current = new ReconnectingWebSocket(`ws://showa.essential.com.ng/ws/call/${room}/`);

//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     ws.current.onmessage = async (e) => {
//       const data = JSON.parse(e.data);
//       console.log('Received from WS:', data);

//       if (!pc.current) return;

//       if (data.type === 'offer') {
//         await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//         const answer = await pc.current.createAnswer();
//         await pc.current.setLocalDescription(answer);
//         ws.current.send(JSON.stringify({ type: 'answer', sdp: answer.sdp }));
//       }

//       if (data.type === 'answer') {
//         await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//       }

//       if (data.type === 'ice-candidate' && data.candidate) {
//         try {
//           await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//         } catch (err) {
//           console.error('Error adding ICE candidate', err);
//         }
//       }
//     };

//     ws.current.onerror = (e) => {
//       console.error('WebSocket error', e.message);
//     };
//   };

//   const startCall = async (caller) => {
//     setIsCaller(caller);
//     try {
//       const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
//       setLocalStream(stream);

//       pc.current = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

//       stream.getTracks().forEach(track => pc.current.addTrack(track, stream));

//       pc.current.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };

//       pc.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           ws.current.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
//         }
//       };

//       if (caller) {
//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);
//         ws.current.send(JSON.stringify({ type: 'offer', sdp: offer.sdp }));
//       }

//       setCallStarted(true);
//     } catch (err) {
//       console.error('startCall error:', err);
//       Alert.alert('Error', err.message);
//     }
//   };

//   const endCall = () => {
//     if (pc.current) {
//       pc.current.close();
//       pc.current = null;
//     }
//     localStream?.getTracks().forEach(t => t.stop());
//     remoteStream?.getTracks().forEach(t => t.stop());
//     setLocalStream(null);
//     setRemoteStream(null);
//     setCallStarted(false);
//     if (ws.current) {
//       ws.current.close();
//       setupWebSocket();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.videoContainer}>
//         {remoteStream ? (
//           <RTCView
//             streamURL={remoteStream.toURL()}
//             style={styles.remoteVideo}
//             objectFit="cover"
//           />
//         ) : (
//           <View style={styles.placeholder}>
//             <FontAwesome5 name="video" size={64} color="#555" />
//             <Text style={styles.placeholderText}>Waiting for user to join...</Text>
//           </View>
//         )}
//         {localStream && (
//           <RTCView
//             streamURL={localStream.toURL()}
//             style={styles.localVideo}
//             objectFit="cover"
//             mirror
//           />
//         )}
//       </View>

//       <View style={styles.controls}>
//         {!callStarted ? (
//           <>
//             <TouchableOpacity style={[styles.button, styles.start]} onPress={() => startCall(true)}>
//               <FontAwesome5 name="video" size={18} color="#fff" />
//               <Text style={styles.buttonText}>Start as Caller</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.button, styles.start]} onPress={() => startCall(false)}>
//               <FontAwesome5 name="video" size={18} color="#fff" />
//               <Text style={styles.buttonText}>Join as Callee</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <TouchableOpacity style={[styles.button, styles.end]} onPress={endCall}>
//             <FontAwesome5 name="phone-slash" size={18} color="#fff" />
//             <Text style={styles.buttonText}>End Call</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };


// const videoStyles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   videoContainer: { flex: 1, position: 'relative' },
//   remoteVideo: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   localVideo: {
//     width: 120,
//     height: 160,
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   placeholder: {
//     flex: 1,
//     backgroundColor: '#111',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     color: '#777',
//     marginTop: 12,
//     fontSize: 16,
//   },
//   controls: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderColor: '#333',
//     backgroundColor: '#1c1c1c',
//   },
//   button: {
//     flexDirection: 'row',
//     gap: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 40,
//     paddingVertical: 14,
//     marginVertical: 5,
//   },
//   start: {
//     backgroundColor: '#007AFF',
//   },
//   end: {
//     backgroundColor: '#e53935',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//     marginLeft: 8,
//   },
// });

// export default VideoCallScreen;


//////// working voice call ==========================================

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ImageBackground } from 'react-native';
// import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// const VoiceCallScreen = ({navigation, route}) => {
//   // Extract parameters with defaults
//   const {
//     receiverId,
//     name = 'Unknown',
//     isCaller = true,
//     roomId = 'default-room',
//     callStatus = 'outgoing'
//   } = route.params || {};

//   // Generate unique ID for this client
//   const currentUserId = useRef(`user-${Math.random().toString(36).substring(2, 9)}`);
  
//   // State and refs
//   const [callStarted, setCallStarted] = useState(callStatus === 'active');
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [isMuted, setIsMuted] = useState(false);
//   const [queuedCandidatesCount, setQueuedCandidatesCount] = useState(0);
  
//   const pc = useRef(null);
//   const ws = useRef(null);
//   const queuedCandidates = useRef([]);
//   const queuedRemoteCandidates = useRef([]);
//   const isRemoteDescriptionSet = useRef(false);
//   const audioBg = { uri: 'https://images.unsplash.com/photo-1549921296-3a6b5cd0c24b?auto=format&fit=crop&w=800&q=80' };

//   // Get local media stream
//   const getLocalStream = async () => {
//     try {
//       const stream = await mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           channelCount: 1
//         }
//       });
//       setLocalStream(stream);
//       return stream;
//     } catch (error) {
//       console.error('[Media] Error getting local stream:', error);
//       Alert.alert('Microphone Access', 'Please enable microphone permissions in settings');
//       return null;
//     }
//   };

//   // Create peer connection
//   const createPeerConnection = () => {
//     console.log(`[WebRTC] Creating peer connection for room: ${roomId}`);
    
//     const configuration = {
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         {
//           urls: [
//             'turn:openrelay.metered.ca:80?transport=udp',
//             'turn:openrelay.metered.ca:443?transport=tcp',
//             'turns:openrelay.metered.ca:443?transport=tcp'
//           ],
//           username: 'openrelayproject',
//           credential: 'openrelayproject'
//         }
//       ],
//       iceTransportPolicy: 'all',
//       iceCandidatePoolSize: 10
//     };

//     pc.current = new RTCPeerConnection(configuration);

//     // Event handlers
//     pc.current.ontrack = (e) => {
//       console.log(`[WebRTC] Received remote track: ${e.track.kind}`);
//       if (e.streams && e.streams.length > 0) {
//         console.log(`[WebRTC] Setting remote stream with ${e.streams[0].getTracks().length} tracks`);
//         setRemoteStream(e.streams[0]);
//       }
//     };

//     pc.current.onicecandidate = (e) => {
//       if (e.candidate) {
//         console.log(`[WebRTC] Generated ICE candidate: ${e.candidate.candidate.substring(0, 50)}...`);
//         if (ws.current?.readyState === WebSocket.OPEN) {
//           ws.current.send(JSON.stringify({
//             type: 'ice-candidate',
//             candidate: e.candidate,
//             senderId: currentUserId.current
//           }));
//         } else {
//           console.log('[WebRTC] Queuing ICE candidate (WS not open)');
//           queuedCandidates.current.push({
//             type: 'ice-candidate',
//             candidate: e.candidate,
//             senderId: currentUserId.current
//           });
//         }
//       } else {
//         console.log('[WebRTC] ICE gathering complete');
//       }
//     };

//     pc.current.onicecandidateerror = (e) => {
//       console.error('[WebRTC] ICE candidate error:', e.errorCode, e.errorText);
//     };

//     pc.current.onconnectionstatechange = () => {
//       const state = pc.current.connectionState;
//       console.log(`[WebRTC] Connection state: ${state}`);
//       setConnectionStatus(state);
      
//       if (state === 'connected') {
//         console.log('[WebRTC] Call successfully connected!');
//         processQueuedRemoteCandidates();
//       } else if (state === 'failed') {
//         Alert.alert('Connection Failed', 'Unable to establish connection. Please try again.');
//       }
//     };

//     pc.current.oniceconnectionstatechange = () => {
//       const iceState = pc.current.iceConnectionState;
//       console.log(`[WebRTC] ICE connection state: ${iceState}`);
      
//       if (iceState === 'connected' || iceState === 'completed') {
//         console.log('[WebRTC] ICE connected, processing queued candidates');
//         processQueuedRemoteCandidates();
//       }
//     };

//     pc.current.onsignalingstatechange = () => {
//       const signalingState = pc.current.signalingState;
//       console.log(`[WebRTC] Signaling state: ${signalingState}`);
      
//       if (signalingState === 'stable') {
//         isRemoteDescriptionSet.current = true;
//         processQueuedRemoteCandidates();
//       }
//     };

//     pc.current.onicegatheringstatechange = () => {
//       console.log(`[WebRTC] ICE gathering state: ${pc.current.iceGatheringState}`);
//     };

//     pc.current.onnegotiationneeded = () => {
//       console.log('[WebRTC] Negotiation needed');
//     };
//   };

//   // Process queued remote ICE candidates
//   const processQueuedRemoteCandidates = async () => {
//     if (queuedRemoteCandidates.current.length === 0) return;
    
//     console.log(`[WebRTC] Processing ${queuedRemoteCandidates.current.length} queued remote candidates`);
//     setQueuedCandidatesCount(queuedRemoteCandidates.current.length);
    
//     while (queuedRemoteCandidates.current.length > 0) {
//       const candidate = queuedRemoteCandidates.current.shift();
//       try {
//         console.log(`[WebRTC] Adding queued ICE candidate: ${candidate.candidate.substring(0, 50)}...`);
//         await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (err) {
//         console.error('[WebRTC] Error adding queued ICE candidate:', err);
//       }
//     }
    
//     setQueuedCandidatesCount(0);
//   };

//   // Setup WebSocket connection with self-message filtering
//   const setupWebSocket = () => {
//     console.log(`[WebSocket] Connecting to room: ${roomId} as ${currentUserId.current}`);
    
//     ws.current = new ReconnectingWebSocket(`ws://showa.essential.com.ng/ws/call/${roomId}/`);
    
//     ws.current.onopen = () => {
//       console.log('[WebSocket] Connection established');
//       setConnectionStatus('connecting');
      
//       // Send join notification
//       const joinMsg = { 
//         type: 'user-joined',
//         userId: currentUserId.current,
//         userName: name,
//         senderId: currentUserId.current
//       };
      
//       if (ws.current.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify(joinMsg));
//       } else {
//         queuedCandidates.current.push(joinMsg);
//       }
      
//       // Process queued messages
//       if (queuedCandidates.current.length > 0) {
//         console.log(`[WebSocket] Sending ${queuedCandidates.current.length} queued messages`);
//         queuedCandidates.current.forEach(msg => {
//           ws.current.send(JSON.stringify(msg));
//         });
//         queuedCandidates.current = [];
//       }
//     };

//     ws.current.onerror = (e) => {
//       console.error('[WebSocket] Error:', e.message);
//     };

//     ws.current.onclose = (e) => {
//       console.log('[WebSocket] Closed:', e.code, e.reason);
//       setConnectionStatus('disconnected');
//     };

//     ws.current.onmessage = async (e) => {
//       try {
//         console.log('[WebSocket] Message received:', e.data.substring(0, 100) + '...');
//         const data = JSON.parse(e.data);
        
//         // Filter out messages from self
//         if (data.senderId === currentUserId.current) {
//           console.log('[WebSocket] Ignoring message from self');
//           return;
//         }
        
//         if (data.type === 'offer' && !isCaller) {
//           console.log('[WebRTC] Received offer, setting remote description');
//           await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//           isRemoteDescriptionSet.current = true;
          
//           console.log('[WebRTC] Creating answer');
//           const answer = await pc.current.createAnswer();
          
//           console.log('[WebRTC] Setting local description (answer)');
//           await pc.current.setLocalDescription(answer);
          
//           const answerMsg = {
//             type: 'answer',
//             sdp: answer.sdp,
//             senderId: currentUserId.current
//           };
          
//           if (ws.current.readyState === WebSocket.OPEN) {
//             ws.current.send(JSON.stringify(answerMsg));
//             console.log('[WebRTC] Answer sent');
//           } else {
//             console.log('[WebRTC] Queuing answer (WS not open)');
//             queuedCandidates.current.push(answerMsg);
//           }
          
//           processQueuedRemoteCandidates();
//         } 
//         else if (data.type === 'answer' && isCaller) {
//           console.log('[WebRTC] Received answer, setting remote description');
//           await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//           isRemoteDescriptionSet.current = true;
          
//           processQueuedRemoteCandidates();
//         } 
//         else if (data.type === 'ice-candidate') {
//           console.log('[WebRTC] Received ICE candidate');
          
//           if (pc.current && pc.current.signalingState !== 'closed') {
//             if (isRemoteDescriptionSet.current) {
//               try {
//                 console.log(`[WebRTC] Adding ICE candidate: ${data.candidate.candidate.substring(0, 50)}...`);
//                 await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//               } catch (err) {
//                 console.error('[WebRTC] Error adding ICE candidate:', err);
//               }
//             } else {
//               console.log('[WebRTC] Queuing ICE candidate (remote desc not set)');
//               queuedRemoteCandidates.current.push(data.candidate);
//               setQueuedCandidatesCount(queuedRemoteCandidates.current.length);
//             }
//           }
//         }
//         else if (data.type === 'user-joined') {
//           console.log(`[Call] User joined: ${data.userId}`);
//           Alert.alert('User Joined', `${data.userName} has joined the call`);
//         }
//         else if (data.type === 'call-ended') {
//           console.log('[Call] Remote user ended the call');
//           Alert.alert('Call Ended', 'The other participant has left the call');
//           endCall();
//         }
//       } catch (error) {
//         console.error('[WebSocket] Error handling message:', error);
//       }
//     };
//   };

//   // Start call process
//   const startCall = async () => {
//     try {
//       console.log('[WebRTC] Creating offer');
//       const offer = await pc.current.createOffer({
//         offerToReceiveAudio: true
//       });
      
//       console.log('[WebRTC] Setting local description (offer)');
//       await pc.current.setLocalDescription(offer);
      
//       const offerMsg = {
//         type: 'offer',
//         sdp: offer.sdp,
//         senderId: currentUserId.current
//       };
      
//       if (ws.current.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify(offerMsg));
//         console.log('[WebRTC] Offer sent');
//       } else {
//         console.log('[WebRTC] Queuing offer (WS not open)');
//         queuedCandidates.current.push(offerMsg);
//       }
      
//       setCallStarted(true);
//     } catch (error) {
//       console.error('[WebRTC] Error starting call:', error);
//       Alert.alert('Connection Error', 'Failed to start the call');
//     }
//   };

//   // Join existing call
//   const joinCall = () => {
//     console.log('[Call] Joining existing call');
//     startCall();
//   };

//   // Toggle mute state
//   const toggleMute = () => {
//     if (localStream) {
//       const newMuteState = !isMuted;
//       localStream.getAudioTracks().forEach(track => {
//         track.enabled = !newMuteState;
//       });
//       setIsMuted(newMuteState);
//       console.log(`[Audio] ${newMuteState ? 'Muted' : 'Unmuted'} microphone`);
//     }
//   };

//   // Initialize call
//   const initCall = async () => {
//     console.log('[Call] Initializing call', {
//       isCaller,
//       roomId,
//       callStatus
//     });
    
//     const stream = await getLocalStream();
//     if (!stream) {
//       Alert.alert('Error', 'Microphone not available');
//       navigation.goBack();
//       return;
//     }
    
//     createPeerConnection();
//     setupWebSocket();
    
//     // Add local tracks to PC
//     stream.getAudioTracks().forEach(track => {
//       pc.current.addTrack(track, stream);
//     });

//     // Start call if we're the initiator or joining an active call
//     if (isCaller || callStatus === 'active') {
//       startCall();
//     }
//   };

//   // End call cleanup
//   const endCall = () => {
//     console.log('[Call] Ending call');
    
//     // Notify other participants
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({ 
//         type: 'call-ended',
//         senderId: currentUserId.current
//       }));
//     }
    
//     if (pc.current) {
//       pc.current.close();
//       pc.current = null;
//     }
    
//     if (ws.current) {
//       ws.current.close();
//       ws.current = null;
//     }
    
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
    
//     setRemoteStream(null);
//     setCallStarted(false);
//     setConnectionStatus('disconnected');
//     queuedCandidates.current = [];
//     queuedRemoteCandidates.current = [];
//     setQueuedCandidatesCount(0);
//     isRemoteDescriptionSet.current = false;
    
//     navigation.goBack();
//   };

//   useEffect(() => {
//     initCall();
//     return () => {
//       if (pc.current || ws.current) {
//         endCall();
//       }
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground source={audioBg} style={styles.background} resizeMode="cover">
//         <View style={styles.overlay}>
//           <FontAwesome5 
//             name={isMuted ? "microphone-slash" : "microphone-alt"} 
//             size={64} 
//             color={isMuted ? "#ff6b6b" : "#4cd964"} 
//           />
//           <Text style={styles.title}>Voice Call with {name}</Text>
          
//           <View style={styles.statusContainer}>
//             <View style={[
//               styles.statusIndicator, 
//               connectionStatus === 'connected' ? styles.connected : {},
//               connectionStatus === 'connecting' ? styles.connecting : {},
//               connectionStatus === 'disconnected' ? styles.disconnected : {}
//             ]} />
//             <Text style={styles.statusText}>
//               {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
//             </Text>
//           </View>
          
//           <View style={styles.statsContainer}>
//             <Text style={styles.statsText}>
//               {queuedCandidatesCount > 0 
//                 ? `${queuedCandidatesCount} queued ICE candidates` 
//                 : 'Connection stable'}
//             </Text>
//             <Text style={styles.statsText}>
//               Room: {roomId}
//             </Text>
//             <Text style={styles.statsText}>
//               ID: {currentUserId.current.substring(0, 8)}
//             </Text>
//           </View>
          
//           {/* Stream Visualizers */}
//           <View style={styles.visualizers}>
//             <AudioVisualizer stream={localStream} label="Your Microphone" />
//             <AudioVisualizer stream={remoteStream} label="Remote Audio" />
//           </View>
//         </View>
//       </ImageBackground>

//       <View style={styles.controls}>
//         {!callStarted && !isCaller ? (
//           <TouchableOpacity 
//             style={[styles.button, styles.accept]} 
//             onPress={joinCall}
//           >
//             <FontAwesome5 name="phone" size={18} color="#fff" />
//             <Text style={styles.buttonText}>Join Call</Text>
//           </TouchableOpacity>
//         ) : null}
        
//         {callStarted ? (
//           <TouchableOpacity 
//             style={[styles.button, isMuted ? styles.muted : styles.unmuted]} 
//             onPress={toggleMute}
//           >
//             <FontAwesome5 
//               name={isMuted ? "microphone-slash" : "microphone"} 
//               size={18} 
//               color="#fff" 
//             />
//             <Text style={styles.buttonText}>
//               {isMuted ? 'Unmute' : 'Mute'}
//             </Text>
//           </TouchableOpacity>
//         ) : null}
        
//         <TouchableOpacity 
//           style={[styles.button, styles.end]} 
//           onPress={endCall}
//         >
//           <FontAwesome5 name="phone-slash" size={18} color="#fff" />
//           <Text style={styles.buttonText}>End Call</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // Audio visualizer component
// const AudioVisualizer = ({ stream, label }) => {
//   if (!stream) return (
//     <View style={styles.visualizer}>
//       <Text style={styles.visualizerText}>{label}: No stream</Text>
//     </View>
//   );
  
//   return (
//     <View style={styles.visualizer}>
//       <Text style={styles.visualizerText}>{label}: {stream.getAudioTracks().length} track(s)</Text>
//       {stream.getAudioTracks().map((track, i) => (
//         <Text key={i} style={styles.visualizerText}>
//           Track {i}: {track.enabled ? '✅' : '❌'} | 
//           {track.muted ? '🔇' : '🔊'} | 
//           Kind: {track.kind} | 
//           State: {track.readyState}
//         </Text>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#111' 
//   },
//   background: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   overlay: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     width: '90%'
//   },
//   title: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: '800',
//     marginTop: 16,
//     letterSpacing: 0.5,
//     textAlign: 'center'
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16
//   },
//   statusIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8
//   },
//   connecting: { 
//     backgroundColor: '#ffcc00' 
//   },
//   connected: { 
//     backgroundColor: '#4cd964' 
//   },
//   disconnected: { 
//     backgroundColor: '#ff3b30' 
//   },
//   statusText: {
//     color: '#ddd',
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   statsContainer: {
//     marginTop: 8,
//     alignItems: 'center'
//   },
//   statsText: {
//     color: '#bbb',
//     fontSize: 14,
//     marginVertical: 2
//   },
//   visualizers: {
//     width: '100%',
//     marginTop: 20
//   },
//   visualizer: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     borderRadius: 8,
//     width: '100%'
//   },
//   visualizerText: {
//     color: '#fff',
//     fontSize: 12,
//     marginVertical: 2
//   },
//   controls: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderColor: '#333',
//     backgroundColor: '#1c1c1c',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center'
//   },
//   button: {
//     flexDirection: 'row',
//     gap: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 40,
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     minWidth: 100
//   },
//   accept: { 
//     backgroundColor: '#25d366',
//   },
//   end: { 
//     backgroundColor: '#e53935' 
//   },
//   muted: {
//     backgroundColor: '#ff9500'
//   },
//   unmuted: {
//     backgroundColor: '#007aff'
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//     marginLeft: 4,
//   },
// });

// export default VoiceCallScreen;

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ImageBackground, Modal } from 'react-native';
// import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native';
// import { CallProvider } from './components/CallContext';
// import { useCallContext } from './CallContext';


// const VoiceCallScreen = ({ navigation, route }) => {

//   const { answerCall } = useCallContext();
//   const {
//     receiverId,
//     name,
//     isCaller = false,
//     roomId = 'default-room',
//     callStatus = 'incoming'
//   } = route.params || {};

//   // State management
//   const [callStarted, setCallStarted] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [isMuted, setIsMuted] = useState(false);
//   const [activeCalls, setActiveCalls] = useState([]);
//   const [showDiscovery, setShowDiscovery] = useState(!isCaller && callStatus !== 'active');

//   // Refs
//   const pc = useRef(null);
//   const ws = useRef(null);
//   const currentUserId = useRef(`user-${Math.random().toString(36).substring(2, 9)}`);
//   const queuedCandidates = useRef([]);
//   const hasAnnouncedCall = useRef(false);
//   const audioBg = { uri: 'https://images.unsplash.com/photo-1549921296-3a6b5cd0c24b?auto=format&fit=crop&w=800&q=80' };

//   // Get local media stream
//   const getLocalStream = async () => {
//     try {
//       const stream = await mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           channelCount: 1
//         }
//       });
//       setLocalStream(stream);
//       return stream;
//     } catch (error) {
//       console.error('Error getting local stream:', error);
//       Alert.alert('Microphone Error', 'Please enable microphone permissions');
//       return null;
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       // ... existing initialization

//       // Handle incoming call from global context
//       if (!isCaller && callStatus === 'incoming') {
//         const callData = answerCall();
//         if (callData) {
//           navigation.setParams({
//             receiverId: callData.caller_id,
//             name: callData.caller_name,
//             roomId: callData.room_id
//           });
//           startCall();
//         }
//       }
//     };

//     init();
//   }, [answerCall]);
//   // Create peer connection
//   const createPeerConnection = () => {
//     const configuration = {
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         {
//           urls: [
//             'turn:openrelay.metered.ca:80?transport=udp',
//             'turn:openrelay.metered.ca:443?transport=tcp',
//             'turns:openrelay.metered.ca:443?transport=tcp'
//           ],
//           username: 'openrelayproject',
//           credential: 'openrelayproject'
//         }
//       ]
//     };

//     pc.current = new RTCPeerConnection(configuration);

//     // Event handlers
//     pc.current.ontrack = (e) => {
//       if (e.streams && e.streams.length > 0) {
//         setRemoteStream(e.streams[0]);
//       }
//     };

//     pc.current.onicecandidate = (e) => {
//       if (e.candidate && ws.current?.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify({
//           type: 'call.message',
//           data: {
//             type: 'ice-candidate',
//             candidate: e.candidate,
//             senderId: currentUserId.current
//           }
//         }));
//       }
//     };

//     pc.current.onconnectionstatechange = () => {
//       const state = pc.current.connectionState;
//       setConnectionStatus(state);
      
//       if (state === 'connected') {
//         Alert.alert('Call Connected', 'You are now connected to the call');
//       } else if (state === 'failed') {
//         Alert.alert('Call Failed', 'Connection failed. Please try again.');
//       }
//     };
//   };

//   // Setup WebSocket connection
//   const setupWebSocket = async () => {
//     //const token = AsyncStorage.getItem('userToken');
//     //ws.current = new ReconnectingWebSocket(`ws://showa.essential.com.ng/ws/call/${roomId}/?token=${token}`);
    
    
//     const token = await AsyncStorage.getItem('userToken');
  
//   ws.current = new ReconnectingWebSocket(
//     `ws://showa.essential.com.ng/ws/call/${roomId}/?token=${token}`
//   );
    
//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//       setConnectionStatus('connecting');
      
//       // Announce user presence
//       ws.current.send(JSON.stringify({
//         type: 'user-joined',
//         userId: currentUserId.current,
//         userName: name,
//         senderId: currentUserId.current
//       }));

//       // If caller, announce new call
//       if (isCaller && !hasAnnouncedCall.current) {
//         ws.current.send(JSON.stringify({
//           type: 'new_call',
//           caller_name: name,
//           senderId: currentUserId.current
//         }));
//         hasAnnouncedCall.current = true;
//       }
//     };

//     ws.current.onmessage = async (e) => {
//       try {
//         const data = JSON.parse(e.data);
//         console.log('Received message:', data.type);
        
//         // Ignore self messages
//         if (data.senderId === currentUserId.current) return;

//         switch(data.type) {
//           case 'active_calls':
//             setActiveCalls(data.calls);
//             break;
            
//           case 'call_available':
//             Alert.alert(
//               'Incoming Call',
//               `${data.caller_name} is calling`,
//               [
//                 {
//                   text: 'Join',
//                   onPress: () => joinCall(data)
//                 },
//                 {
//                   text: 'Decline',
//                   style: 'cancel'
//                 }
//               ]
//             );
//             break;
            
//           case 'call.message':
//             // Handle WebRTC signaling messages
//             const message = data.data;
//             if (message.senderId === currentUserId.current) return;
            
//             switch(message.type) {
//               case 'offer':
//                 if (!isCaller) {
//                   await handleIncomingOffer(message);
//                 }
//                 break;
//               case 'answer':
//                 if (isCaller) {
//                   await pc.current.setRemoteDescription(new RTCSessionDescription(message));
//                 }
//                 break;
//               case 'ice-candidate':
//                 try {
//                   await pc.current.addIceCandidate(new RTCIceCandidate(message.candidate));
//                 } catch (err) {
//                   console.error('ICE candidate error:', err);
//                 }
//                 break;
//               case 'call_ended':
//                 Alert.alert('Call Ended', 'The other participant has left');
//                 endCall();
//                 break;
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Error handling message:', error);
//       }
//     };
//   };

//   // Handle incoming offer
//   const handleIncomingOffer = async (offer) => {
//     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);
    
//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'answer',
//         sdp: answer.sdp,
//         senderId: currentUserId.current
//       }
//     }));
//   };

//   // Start new call
//   const startCall = async () => {
//     try {
//       const offer = await pc.current.createOffer();
//       await pc.current.setLocalDescription(offer);
      
//       ws.current.send(JSON.stringify({
//         type: 'call.message',
//         data: {
//           type: 'offer',
//           sdp: offer.sdp,
//           senderId: currentUserId.current
//         }
//       }));
      
//       setCallStarted(true);
//       setShowDiscovery(false);
//     } catch (error) {
//       console.error('Error starting call:', error);
//       Alert.alert('Error', 'Failed to start call');
//     }
//   };

//   // Join existing call
//   const joinCall = (callData) => {
//     navigation.replace('VoiceCalls', {
//       receiverId: callData.caller_id,
//       name: callData.caller_name,
//       isCaller: false,
//       roomId: callData.room_id,
//       callStatus: 'active'
//     });
//   };

//   // End call cleanup
//   const endCall = () => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       // Notify others that call ended
//       ws.current.send(JSON.stringify({
//         type: 'call.message',
//         data: {
//           type: 'call_ended',
//           senderId: currentUserId.current
//         }
//       }));
      
//       // Remove active call
//       ws.current.send(JSON.stringify({
//         type: 'end_call',
//         senderId: currentUserId.current
//       }));
//     }
    
//     if (pc.current) pc.current.close();
//     if (ws.current) ws.current.close();
//     if (localStream) localStream.getTracks().forEach(track => track.stop());
    
//     navigation.goBack();
//   };

//   // Initialize call
//   useEffect(() => {
//     const init = async () => {
//       const stream = await getLocalStream();
//       if (!stream) {
//         navigation.goBack();
//         return;
//       }
      
//       createPeerConnection();
//       setupWebSocket();
      
//       stream.getAudioTracks().forEach(track => {
//         pc.current.addTrack(track, stream);
//       });

//       if (isCaller || callStatus === 'active') {
//         startCall();
//       }
//     };

//     init();
    
//     return () => {
//       if (pc.current || ws.current || localStream) {
//         endCall();
//       }
//     };
//   }, []);

//   // Call Discovery Modal
//   const CallDiscoveryModal = () => (
//     <Modal transparent={true} visible={showDiscovery}>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Available Calls</Text>
          
//           {activeCalls.length === 0 ? (
//             <Text style={styles.noCallsText}>No active calls in this room</Text>
//           ) : (
//             activeCalls.map((call, index) => (
//               <TouchableOpacity 
//                 key={`${call.caller_id}-${index}`}
//                 style={styles.callItem}
//                 onPress={() => joinCall(call)}
//               >
//                 <FontAwesome5 name="phone" size={20} color="#4cd964" />
//                 <Text style={styles.callItemText}>{call.caller_name}'s Call</Text>
//               </TouchableOpacity>
//             ))
//           )}
          
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={() => setShowDiscovery(false)}
//           >
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ImageBackground, Modal } from 'react-native';
// import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native';
// import { useCallContext } from './CallContext'; // Ensure this path is correct

// const VoiceCallScreen = ({ navigation, route }) => {
//   const { answerCall, declineCall } = useCallContext(); // Add declineCall from context
//   const {
//     receiverId,
//     name,
//     isCaller = false,
//     roomId = 'default-room',
//     callStatus = 'incoming'
//   } = route.params || {};

//   // State management
//   const [callStarted, setCallStarted] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [isMuted, setIsMuted] = useState(false);
//   const [activeCalls, setActiveCalls] = useState([]);
//   const [showDiscovery, setShowDiscovery] = useState(!isCaller && callStatus !== 'active');


// const [peerConnectionInitialized, setPeerConnectionInitialized] = useState(false);

//   // Refs
//   const pc = useRef(null);
//   const ws = useRef(null);
//   const currentUserId = useRef(`user-${Math.random().toString(36).substring(2, 9)}`);
//   const queuedCandidates = useRef([]);
//   const hasAnnouncedCall = useRef(false);
//   const audioBg = { uri: 'https://images.unsplash.com/photo-1549921296-3a6b5cd0c24b?auto=format&fit=crop&w=800&q=80' };

//   // Get local media stream
//   const getLocalStream = async () => {
//     try {
//       const stream = await mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           channelCount: 1
//         }
//       });
//       setLocalStream(stream);
//       return stream;
//     } catch (error) {
//       console.error('Error getting local stream:', error);
//       Alert.alert('Microphone Error', 'Please enable microphone permissions');
//       return null;
//     }
//   };

//   // Create peer connection
//   const createPeerConnection = () => {
//   // Clean up existing connection first
//   if (pc.current) {
//     pc.current.close();
//     pc.current = null;
//   }

//   const configuration = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       {
//         urls: [
//           'turn:openrelay.metered.ca:80?transport=udp',
//           'turn:openrelay.metered.ca:443?transport=tcp',
//           'turns:openrelay.metered.ca:443?transport=tcp'
//         ],
//         username: 'openrelayproject',
//         credential: 'openrelayproject'
//       }
//     ]
//   };

//   pc.current = new RTCPeerConnection(configuration);
  
//   // Add this critical error handler
//   pc.current.onicecandidateerror = (e) => {
//     console.error('ICE Candidate Error:', e.errorCode, e.errorText);
//   };

//   // Add to your peer connection setup:
// pc.current.onicegatheringstatechange = () => {
//   console.log('ICE gathering state:', pc.current.iceGatheringState);
// };

// pc.current.oniceconnectionstatechange = () => {
//   console.log('ICE connection state:', pc.current.iceConnectionState);
// };

//     pc.current = new RTCPeerConnection(configuration);

//     // Event handlers
//     pc.current.ontrack = (e) => {
//       if (e.streams && e.streams.length > 0) {
//         setRemoteStream(e.streams[0]);
//       }
//     };

//     pc.current.onicecandidate = (e) => {
//       if (e.candidate && ws.current?.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify({
//           type: 'call.message',
//           data: {
//             type: 'ice-candidate',
//             candidate: e.candidate,
//             senderId: currentUserId.current
//           }
//         }));
//       }
//     };

//     pc.current.onconnectionstatechange = () => {
//       const state = pc.current.connectionState;
//       setConnectionStatus(state);
      
//       if (state === 'connected') {
//         Alert.alert('Call Connected', 'You are now connected to the call');
//       } else if (state === 'failed') {
//         Alert.alert('Call Failed', 'Connection failed. Please try again.');
//       }
//     };
//   };

//     const CallDiscoveryModal = () => (
//     <Modal transparent={true} visible={showDiscovery}>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Available Calls</Text>
          
//           {activeCalls.length === 0 ? (
//             <Text style={styles.noCallsText}>No active calls in this room</Text>
//           ) : (
//             activeCalls.map((call, index) => (
//               <TouchableOpacity 
//                 key={`${call.caller_id}-${index}`}
//                 style={styles.callItem}
//                 onPress={() => joinCall(call)}
//               >
//                 <FontAwesome5 name="phone" size={20} color="#4cd964" />
//                 <Text style={styles.callItemText}>{call.caller_name}'s Call</Text>
//               </TouchableOpacity>
//             ))
//           )}
          
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={() => setShowDiscovery(false)}
//           >
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   // Setup WebSocket connection
//   const setupWebSocket = async () => {
//     const token = await AsyncStorage.getItem('userToken');

//     if (ws.current) {
//     ws.current.close();
//     ws.current = null;
//   }

  
//     ws.current = new ReconnectingWebSocket(
//       `ws://showa.essential.com.ng/ws/call/${roomId}/?token=${token}`
//     );
//     pc.current.onsignalingstatechange = () => {
//   console.log('Signaling state changed:', pc.current.signalingState);
  
//   if (pc.current.signalingState === 'stable') {
//     console.log('Signaling is stable - processing queued candidates');
//     processQueuedCandidates();
//   }
// };

// const processQueuedCandidates = async () => {
//   if (!pc.current || queuedCandidates.current.length === 0) return;
  
//   console.log('Processing', queuedCandidates.current.length, 'queued candidates');
  
//   const successes = [];
//   const failures = [];
  
//   for (const candidate of queuedCandidates.current) {
//     try {
//       await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//       successes.push(candidate);
//     } catch (e) {
//       failures.push({ candidate, error: e });
//     }
//   }
  
//   console.log(`Processed candidates: ${successes.length} success, ${failures.length} failures`);
//   queuedCandidates.current = [];
  
//   if (failures.length > 0) {
//     console.error('Failed candidates:', failures);
//   }
// };
// const connectionCheckInterval = setInterval(() => {
//     if (!ws.current) return;
    
//     switch(ws.current.readyState) {
//       case WebSocket.CONNECTING:
//         setConnectionStatus('connecting');
//         break;
//       case WebSocket.OPEN:
//         setConnectionStatus('connected');
//         break;
//       case WebSocket.CLOSING:
//       case WebSocket.CLOSED:
//         setConnectionStatus('disconnected');
//         break;
//     }
//   }, 1000);
    
    
//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//       setConnectionStatus('connecting');

//      if (!navigation.isFocused()) return;
  
//   setTimeout(() => {
//     if (ws.current?.readyState !== WebSocket.OPEN) {
//       setupWebSocket();
//     }
//   }, 2000);
//        // Send user-joined only once
//     ws.current.send(JSON.stringify({
//       type: 'user-joined',
//       userId: currentUserId.current,
//       userName: name,
//       senderId: currentUserId.current,
//       roomId: roomId
//     }));

//        if (isCaller && !hasAnnouncedCall.current) {
//       // Delay call start to ensure WS is fully ready
//       setTimeout(() => startCall(), 300);
//       hasAnnouncedCall.current = true;
//     }
    
    

//     ws.current.onerror = (error) => {
//     console.log('WebSocket error:', error);
//     setConnectionStatus('error');
//   };

//   ws.current.onclose = () => {
//     console.log('WebSocket disconnected');
//     setConnectionStatus('disconnected');
//   };
//   pc.current.oniceconnectionstatechange = () => {
//   console.log('ICE connection state:', pc.current.iceConnectionState);
// };
      
//       // Announce user presence
//       ws.current.send(JSON.stringify({
//         type: 'user-joined',
//         userId: currentUserId.current,
//         userName: name,
//         senderId: currentUserId.current
//       }));

//       // If caller, announce new call
//       if (isCaller && !hasAnnouncedCall.current) {
//         ws.current.send(JSON.stringify({
//           type: 'new_call',
//           caller_name: name,
//           senderId: currentUserId.current
//         }));
//         hasAnnouncedCall.current = true;
//       }
//     };

//     ws.current.onmessage = async (e) => {
//       try {
//         const data = JSON.parse(e.data);
//         console.log('Received message:', data.type);
        
//         // Ignore self messages
//         if (data.senderId === currentUserId.current) return;

//         switch(data.type) {
//           case 'active_calls':
//             setActiveCalls(data.calls);
//             break;
            
//           // REMOVE THIS CASE - HANDLED BY GLOBAL CONTEXT
//           // case 'call_available':
//           //   Alert.alert(...);
//           //   break;
            
//           case 'call.message':
//             // Handle WebRTC signaling messages
//             const message = data.data;
//             if (message.senderId === currentUserId.current) return;
            
//             switch(message.type) {
//               case 'offer':
//                 if (!isCaller) {
//                   await handleIncomingOffer(message);
//                 }
//                 break;
//               case 'answer':
//                 if (isCaller) {
//                   await pc.current.setRemoteDescription(new RTCSessionDescription(message));
//                 }
//                 break;
//               // In your WebSocket message handler:
// case 'ice-candidate':
//   if (!pc.current) {
//     console.warn('Received ICE candidate but PC is null');
//     return;
//   }

//   try {
//     if (pc.current.remoteDescription) {
//       console.log('Adding ICE candidate immediately');
//       await pc.current.addIceCandidate(new RTCIceCandidate(message.candidate));
//     } else {
//       console.log('Queueing ICE candidate - signaling state:', pc.current.signalingState);
//       queuedCandidates.current.push(message.candidate);
      
//       // If we're stuck in have-local-offer, try to process candidates anyway
//       if (pc.current.signalingState === 'have-local-offer') {
//         try {
//           await pc.current.addIceCandidate(new RTCIceCandidate(message.candidate));
//           console.log('Successfully added candidate in have-local-offer state');
//         } catch (e) {
//           console.error('Failed to add candidate in have-local-offer state:', e);
//         }
//       }
//     }
//   } catch (err) {
//     console.error('ICE candidate error:', err);
//   }
//   break;
//               case 'call_ended':
//                 Alert.alert('Call Ended', 'The other participant has left');
//                 endCall();
//                 break;
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Error handling message:', error);
//       }
//     };
//   };

//   useEffect(() => {
//   let mounted = true;
  
//   const init = async () => {
//     try {
//       const stream = await getLocalStream();
//       if (!stream || !mounted) return;
      
//       createPeerConnection();
//       await setupWebSocket();
      
//       // Add tracks only after PC is created
//       stream.getAudioTracks().forEach(track => {
//         if (pc.current) {
//           pc.current.addTrack(track, stream);
//         }
//       });

//       if (isCaller) {
//         // Small delay to ensure everything is ready
//         setTimeout(() => startCall(), 500);
//       }
//     } catch (error) {
//       console.error('Initialization error:', error);
//       if (mounted) navigation.goBack();
//     }
//   };

//   init();
  
//   return () => {
//     mounted = false;
//     endCall();
//   };
// }, []);

//   // Handle incoming offer
//   // In your VoiceCallScreen component
// const handleIncomingOffer = async (offer) => {
//   try {
//     if (!pc.current) {
//       console.error('No peer connection to handle offer');
//       return;
//     }

//     console.log('Setting remote description');
//     await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
    
//     // Process queued candidates
//     console.log('Processing queued candidates:', queuedCandidates.current.length);
//     await Promise.all(queuedCandidates.current.map(async (candidate) => {
//       try {
//         await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (e) {
//         console.error('Error adding queued candidate:', e);
//       }
//     }));
//     queuedCandidates.current = [];
    
//     console.log('Creating answer');
//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);
    
//     console.log('Sending answer');
//     ws.current.send(JSON.stringify({
//       type: 'call.message',
//       data: {
//         type: 'answer',
//         sdp: answer.sdp,
//         senderId: currentUserId.current,
//         receiverId: receiverId,
//         roomId: roomId
//       }
//     }));
//   } catch (error) {
//     console.error('Offer handling failed:', error);
//   }
// };




//   const startCall = async () => {
//   try {
//     // Ensure WS is fully ready
//     await new Promise(resolve => {
//       const check = () => {
//         if (ws.current?.readyState === WebSocket.OPEN) resolve();
//         else setTimeout(check, 100);
//       };
//       check();
//     });

//     // Announce call first
//     ws.current.send(JSON.stringify({
//       type: 'new_call',
//       caller_name: name,
//       receiverId: receiverId,
//       roomId: roomId,
//       senderId: currentUserId.current
//     }));

//     // Small delay before creating offer
//     await new Promise(resolve => setTimeout(resolve, 300));
    
//     const offer = await pc.current.createOffer({
//       offerToReceiveAudio: true,
//       voiceActivityDetection: false
//     });
    
//     console.log('Created offer, setting local description');
//     await pc.current.setLocalDescription(offer);
    
//     // Send offer with retry logic
//     const sendOffer = () => {
//       if (ws.current?.readyState === WebSocket.OPEN) {
//         ws.current.send(JSON.stringify({
//           type: 'call.message',
//           data: {
//             type: 'offer',
//             sdp: offer.sdp,
//             senderId: currentUserId.current,
//             receiverId: receiverId,
//             roomId: roomId
//           }
//         }));
//       } else {
//         console.warn('WebSocket not ready, retrying in 500ms');
//         setTimeout(sendOffer, 500);
//       }
//     };
    
//     sendOffer();
    
//     setCallStarted(true);
//   } catch (error) {
//     console.error('Call start failed:', error);
//     endCall();
//   }
// };
// useEffect(() => {
//   const timer = setInterval(() => {
//     if (pc.current) {
//       console.log(
//         'PC State:',
//         `Connection: ${pc.current.connectionState}`,
//         `ICE: ${pc.current.iceConnectionState}`,
//         `Signaling: ${pc.current.signalingState}`
//       );
//     }
//   }, 5000);
  
//   return () => clearInterval(timer);
// }, []);
//   // Join existing call
//   const joinCall = (callData) => {
//     navigation.replace('VoiceCalls', {
//       receiverId: callData.caller_id,
//       name: callData.caller_name,
//       isCaller: false,
//       roomId: callData.room_id,
//       callStatus: 'active'
//     });
//   };

//   // End call cleanup
//   const endCall = () => {
//   console.log('Ending call and cleaning up');
  
//   // Send end call messages if possible
//   try {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({
//         type: 'call.message',
//         data: {
//           type: 'call_ended',
//           senderId: currentUserId.current
//         }
//       }));
      
//       ws.current.send(JSON.stringify({
//         type: 'end_call',
//         senderId: currentUserId.current
//       }));
//     }
//   } catch (e) {
//     console.error('Error sending end call messages:', e);
//   }
  
//   // Clean up resources
//   if (pc.current) {
//     pc.current.close();
//     pc.current = null;
//   }
  
//   if (localStream) {
//     localStream.getTracks().forEach(track => track.stop());
//     setLocalStream(null);
//   }
  
//   setCallStarted(false);
//   setConnectionStatus('disconnected');
// };

//   // Initialize call
//   useEffect(() => {
//     const init = async () => {
//       const stream = await getLocalStream();
//       if (!stream) {
//         navigation.goBack();
//         return;
//       }
      
//       createPeerConnection();
//       await setupWebSocket();
      
//       stream.getAudioTracks().forEach(track => {
//         pc.current.addTrack(track, stream);
//       });

//       // Only start call if we're the caller
//       if (isCaller) {
//         startCall();
//       }
//     };

//     init();
    
//     return () => {
//       if (pc.current || ws.current || localStream) {
//         endCall();
//       }
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground source={audioBg} style={styles.background} resizeMode="cover">
//         <View style={styles.overlay}>
          
//            <LottieView
//                     source={require("../assets/animations/voice icon lottie animation.json")}
//                     autoPlay
//                     loop={true}
//                     style={styles.image}
//                   />
//           <Text style={styles.title}>
//             {callStarted ? `In call with ${name}` : 'Setting up call...'}
//           </Text>
          
//           <Text style={styles.statusText}>
//             Status: {connectionStatus}
//           </Text>
//         </View>
//       </ImageBackground>

//       <View style={styles.controls}>
//         {callStarted && (
          
//           <TouchableOpacity 
//             style={[styles.button, isMuted ? styles.muted : styles.unmuted]} 
//             onPress={() => setIsMuted(!isMuted)}
//           >
//             <FontAwesome5 
//               name={isMuted ? "microphone-slash" : "microphone"} 
//               size={18} 
//               color="#fff" 
//             />
           
//             <Text style={styles.buttonText}>
//               {isMuted ? 'Unmute' : 'Mute'}
//             </Text>
//           </TouchableOpacity>
//         )}
        
//         <TouchableOpacity 
//           style={[styles.button, styles.end]} 
//           onPress={endCall}
//         >
//           <FontAwesome5 name="phone-slash" size={18} color="#fff" />
//           <Text style={styles.buttonText}>End Call</Text>
//         </TouchableOpacity>
//       </View>
      
//       <CallDiscoveryModal />
//     </SafeAreaView>
//   );
// };

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
// } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
//   RTCView,
// } from "react-native-webrtc";
// import { encode as btoa } from "base-64";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import LinearGradient from "react-native-linear-gradient";

// const SIGNALING_SERVER = "ws://showa.essential.com.ng";
// const ROOM_ID = "unique-room-id";

// export default function VideoCallScreen({ navigation, route }) {
//   const { name, incomingOffer, isIncomingCall } = route.params || {};

//   const ws = useRef(null);
//   const pc = useRef(null);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const queuedRemoteCandidates = useRef([]);
//   const rtcConfig = useRef({ iceServers: [] }).current;

//   const [wsConnected, setWsConnected] = useState(false);
//   const [webrtcReady, setWebrtcReady] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [localURL, setLocalURL] = useState(null);
//   const [remoteURL, setRemoteURL] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [showIncomingModal, setShowIncomingModal] = useState(false);

//   const isCallerRef = useRef(false);

//   // === Permissions ===
//   const requestAVPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const mic = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//         );
//         const cam = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         return (
//           mic === PermissionsAndroid.RESULTS.GRANTED &&
//           cam === PermissionsAndroid.RESULTS.GRANTED
//         );
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   // === ICE Servers ===
//   const getIceServers = async () => {
//     try {
//       const res = await fetch("https://global.xirsys.net/_turn/Showa", {
//         method: "PUT",
//         headers: {
//           Authorization:
//             "Basic " +
//             btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
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
//     } catch (err) {
//       console.error("[Xirsys] Failed ICE:", err);
//       rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//     }
//   };

//   // === WebRTC ===
//   const sendMessage = (msg) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg));
//     }
//   };

//   const cleanupPeerConnection = () => {
//     if (pc.current) {
//       pc.current.close();
//       pc.current = null;
//     }
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((t) => t.stop());
//       localStream.current = null;
//     }
//     remoteStream.current = null;
//     queuedRemoteCandidates.current = [];
//     setLocalURL(null);
//     setRemoteURL(null);
//     setWebrtcReady(false);
//   };

//   const ensurePeerConnection = async () => {
//     if (pc.current) return;

//     if (!rtcConfig.iceServers.length) {
//       await getIceServers();
//     }

//     pc.current = new RTCPeerConnection(rtcConfig);

//     pc.current.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         sendMessage({ type: "candidate", candidate: evt.candidate });
//       }
//     };

//     pc.current.ontrack = (evt) => {
//       if (evt.streams && evt.streams[0]) {
//         remoteStream.current = evt.streams[0];
//         setRemoteURL(remoteStream.current.toURL());
//         setWebrtcReady(true);
//       }
//     };
//   };

//   const ensureLocalStreamAndAttach = async () => {
//     if (!localStream.current) {
//       const hasPermission = await requestAVPermissions();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Camera/Microphone required");
//         return false;
//       }
//       const s = await mediaDevices.getUserMedia({ audio: true, video: true });
//       localStream.current = s;
//       setLocalURL(s.toURL());
//     }

//     localStream.current.getTracks().forEach((track) => {
//       pc.current.addTrack(track, localStream.current);
//     });
//     return true;
//   };

//   // === WebSocket ===
//   const connectWebSocket = () => {
//     const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/`;
//     ws.current = new WebSocket(url);

//     ws.current.onopen = async () => {
//       setWsConnected(true);
//       await ensurePeerConnection();
//     };

//     ws.current.onmessage = async (evt) => {
//       let data;
//       try {
//         data = JSON.parse(evt.data);
//       } catch {
//         return;
//       }

//       switch (data.type) {
//         case "offer":
//           if (isCallerRef.current) return;
//           setIncomingCall(data.offer);
//           setShowIncomingModal(true);
//           break;

//         case "answer":
//           if (isCallerRef.current) {
//             await pc.current.setRemoteDescription(
//               new RTCSessionDescription(data.answer)
//             );
//           }
//           break;

//         case "candidate":
//           try {
//             await pc.current.addIceCandidate(
//               new RTCIceCandidate(data.candidate)
//             );
//           } catch {}
//           break;

//         case "call-ended":
//           cleanupPeerConnection();
//           navigation.goBack();
//           break;
//       }
//     };

//     ws.current.onclose = () => {
//       setWsConnected(false);
//       cleanupPeerConnection();
//     };
//   };

//   // === Call Flow ===
//   const startCall = async () => {
//     setIsCaller(true);
//     isCallerRef.current = true;
//     await ensurePeerConnection();
//     await ensureLocalStreamAndAttach();
//   };

//   const acceptCall = async () => {
//     setIsCaller(false);
//     isCallerRef.current = false;
//     await ensurePeerConnection();
//     const localReady = await ensureLocalStreamAndAttach();
//     if (!localReady) return;

//     await pc.current.setRemoteDescription(
//       new RTCSessionDescription(incomingCall)
//     );
//     const answer = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answer);
//     sendMessage({ type: "answer", answer });
//     setShowIncomingModal(false);
//     setIncomingCall(null);
//   };

//   const rejectCall = () => {
//     sendMessage({ type: "call-ended" });
//     setShowIncomingModal(false);
//     navigation.goBack();
//     setIncomingCall(null);
//   };

//   const endCall = () => {
//     sendMessage({ type: "call-ended" });
//     cleanupPeerConnection();
//     navigation.goBack();
//   };

//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       cleanupPeerConnection();
//       if (ws.current) ws.current.close();
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {webrtcReady ? (
//         <View style={styles.videoContainer}>
//           {remoteURL && (
//             <RTCView streamURL={remoteURL} style={styles.remoteVideo} />
//           )}
//           {localURL && (
//             <RTCView streamURL={localURL} style={styles.localVideo} />
//           )}

//           <View style={styles.callControls}>
//             <TouchableOpacity style={styles.controlButton} onPress={endCall}>
//               <View style={[styles.controlIcon, { backgroundColor: "#e53e3e" }]}>
//                 <Icon name="call-end" size={28} color="white" />
//               </View>
//               <Text style={styles.controlText}>End</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : (
//         <LinearGradient
//           colors={["#f5f7fa", "#c3cfe2"]}
//           style={styles.preCallScreen}
//         >
//           <Text style={{ fontSize: 22, fontWeight: "600", color: "#2d3748" }}>
//             {wsConnected ? "Ready for video call" : "Connecting..."}
//           </Text>
//           <TouchableOpacity
//             style={[
//               styles.actionButton,
//               !wsConnected && styles.disabledButton,
//             ]}
//             onPress={startCall}
//             disabled={!wsConnected}
//           >
//             <LinearGradient
//               colors={["#4facfe", "#00f2fe"]}
//               style={styles.callButton}
//             >
//               <Icon name="videocam" size={24} color="white" />
//             </LinearGradient>
//             <Text style={styles.actionButtonText}>Video Call</Text>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}

//       {/* Incoming Call Modal */}
//       <Modal
//         visible={showIncomingModal}
//         transparent
//         animationType="fade"
//         onRequestClose={rejectCall}
//       >
//         <View style={styles.modalOverlay}>
//           <LinearGradient
//             colors={["#0f2027", "#203a43", "#2c5364"]}
//             style={styles.modalContainer}
//           >
//             <Text style={styles.incomingCallText}>
//               Incoming Video Call from {name}
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
//                 <Icon name="call-end" size={36} color="white" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
//                 <Icon name="videocam" size={36} color="white" />
//               </TouchableOpacity>
//             </View>
//           </LinearGradient>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },
//   videoContainer: { flex: 1, backgroundColor: "black" },
//   remoteVideo: { flex: 1 },
//   localVideo: {
//     width: 120,
//     height: 160,
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     backgroundColor: "#000",
//   },
//   callControls: {
//     position: "absolute",
//     bottom: 40,
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   controlButton: { alignItems: "center", marginHorizontal: 20 },
//   controlIcon: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   controlText: { color: "white", marginTop: 8 },
//   preCallScreen: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   actionButton: { alignItems: "center", marginTop: 20 },
//   actionButtonText: {
//     color: "#2d3748",
//     fontSize: 16,
//     fontWeight: "600",
//     marginTop: 8,
//   },
//   disabledButton: { opacity: 0.5 },
//   callButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "90%",
//     padding: 30,
//     borderRadius: 20,
//     alignItems: "center",
//   },
//   incomingCallText: { fontSize: 22, color: "white", marginBottom: 30 },
//   modalButtons: { flexDirection: "row", gap: 50 },
//   rejectButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "#e53e3e",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   acceptButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "#38a169",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });



