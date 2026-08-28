

// import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
// import { NativeModules, Vibration, AppState } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import InCallManager from 'react-native-incall-manager';
// import CallKeepService from '../src/services/CallKeepService';
// import IncomingCallModal from '../components/IncomingCallModal';
// import { forceStopAllCallAudio } from '../src/utils/callAudio';

// const SIGNALING_SERVER = 'wss://api.showapp.ng';

// // How often we ping the server to prove the socket is genuinely alive.
// // Some OEMs (Samsung/Xiaomi/Huawei/Oppo/Vivo) silently kill background
// // sockets without ever firing onclose — readyState still reports OPEN even
// // though the TCP connection is dead. A heartbeat is the only reliable way
// // to detect this.
// const HEARTBEAT_INTERVAL_MS = 20000;

// // If we don't get a pong within this window after sending a ping, the
// // socket is considered dead — force-close and reconnect immediately.
// const HEARTBEAT_TIMEOUT_MS = 8000;

// const CallContext = createContext(null);
// export const useGlobalCall = () => useContext(CallContext);

// /**
// //  * Mounted ONCE at the app root (see App.js). Owns:
// //  * - the single, app-wide call-signaling WebSocket that listens for
// //  *   incoming calls (replaces the PHome-only version)
// //  * - the incoming-call UI state
// //  * - the IncomingCallModal itself, rendered here so it overlays whatever
// //  *   screen the user is currently on
// //  *
// //  * navigationRef is the SAME module-level ref already created in App.js —
// //  * passed in as a prop so accept/reject can navigate regardless of which
// //  * screen is currently focused.
// //  */
// export const CallProvider = ({ children, navigationRef, isAuthenticated }) => {
//   const [callerInfo, setCallerInfo] = useState({ profileImage: '', name: 'Incoming Call', offer: null });
//   const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
//   const [isVideoCall, setIsVideoCall] = useState(false);

//   const ws = useRef(null);
//   const isCallBeingHandledRef = useRef(false);
//   const currentCallIdRef = useRef(null);
//   const wsConnectedRef = useRef(false);
//   const intentionalCloseRef = useRef(false);
//   const reconnectTimeoutRef = useRef(null);

//   // 🔴 NEW — heartbeat state
//   const heartbeatIntervalRef = useRef(null);
//   const heartbeatTimeoutRef = useRef(null);
//   const lastPongAtRef = useRef(0);

//   const clearHeartbeat = () => {
//     if (heartbeatIntervalRef.current) {
//       clearInterval(heartbeatIntervalRef.current);
//       heartbeatIntervalRef.current = null;
//     }
//     if (heartbeatTimeoutRef.current) {
//       clearTimeout(heartbeatTimeoutRef.current);
//       heartbeatTimeoutRef.current = null;
//     }
//   };

//   const forceReconnect = useCallback((reason) => {
//     console.log('[GlobalCall WS] Force reconnect:', reason);
//     clearHeartbeat();
//     if (ws.current) {
//       try {
//         intentionalCloseRef.current = true; // this close is deliberate — don't let onclose double-schedule a reconnect
//         ws.current.onopen = null;
//         ws.current.onmessage = null;
//         ws.current.onclose = null;
//         ws.current.onerror = null;
//         ws.current.close();
//       } catch (e) {}
//       ws.current = null;
//     }
//     wsConnectedRef.current = false;
//     connectCallWebSocket();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const startHeartbeat = () => {
//     clearHeartbeat();
//     lastPongAtRef.current = Date.now();

//     heartbeatIntervalRef.current = setInterval(() => {
//       if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

//       try {
//         ws.current.send(JSON.stringify({ type: 'ping' }));
//       } catch (e) {
//         forceReconnect('ping send failed');
//         return;
//       }

//       // If no pong arrives within the timeout, the socket is dead even
//       // though JS still thinks it's OPEN — this is the actual fix for the
//       // "silently dead in background on non-Techno OEMs" bug.
//       if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
//       heartbeatTimeoutRef.current = setTimeout(() => {
//         const sinceLastPong = Date.now() - lastPongAtRef.current;
//         if (sinceLastPong >= HEARTBEAT_TIMEOUT_MS) {
//           forceReconnect('heartbeat timeout — socket is stale');
//         }
//       }, HEARTBEAT_TIMEOUT_MS);
//     }, HEARTBEAT_INTERVAL_MS);
//   };

//   const connectCallWebSocket = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const retrieveUserId = await AsyncStorage.getItem('userData');
//       if (!token || !retrieveUserId) return;
//       if (ws.current?.readyState === WebSocket.OPEN) return;

//       const userDataObj = JSON.parse(retrieveUserId);
//       const currentUserId = userDataObj.id;
//       const ROOM_ID = `user-${currentUserId}`;
//       const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

//       intentionalCloseRef.current = false;

//       ws.current = new WebSocket(url);
//       ws.current.binaryType = 'arraybuffer';

//       ws.current.onopen = () => {
//         console.log('[GlobalCall WS] Connected');
//         wsConnectedRef.current = true;
//         startHeartbeat();
//       };

//       ws.current.onmessage = (evt) => {
//         let data;
//         try { data = JSON.parse(evt.data); } catch { return; }

//         // 🔴 NEW — pong response proves the socket is genuinely alive
//         if (data.type === 'pong') {
//           lastPongAtRef.current = Date.now();
//           if (heartbeatTimeoutRef.current) {
//             clearTimeout(heartbeatTimeoutRef.current);
//             heartbeatTimeoutRef.current = null;
//           }
//           return;
//         }

//         if (data.type === 'incoming_call' && data.offer?.sdp) {
//           if (global.__onCallScreen) {
//             console.log('[GlobalCall WS] Already on call screen — sending busy response');
//             if (ws.current?.readyState === WebSocket.OPEN) {
//               try {
//                 ws.current.send(JSON.stringify({
//                   type: 'call-busy',
//                   receiver_id: data.offer?.callerId || data.offer?.targetUserId,
//                   caller_id: data.offer?.targetUserId,
//                 }));
//               } catch (e) {}
//             }
//             return;
//           }

//           if (isCallBeingHandledRef.current) {
//             console.log('[GlobalCall WS] Already handling a call, ignoring duplicate');
//             return;
//           }

//           const profileImagePath =
//             data.offer?.callerInfo?.profileImage ||
//             data.callerInfo?.profileImage ||
//             data.profileImage ||
//             data.profile_image ||
//             '';

//           const callerName =
//             data.offer?.callerInfo?.name ||
//             data.callerInfo?.name ||
//             data.caller_name ||
//             'Unknown Caller';

//           isCallBeingHandledRef.current = true;
//           currentCallIdRef.current = data.callId || currentCallIdRef.current;

//           setCallerInfo({ profileImage: profileImagePath, name: callerName, offer: data.offer });
//           setIsVideoCall(data.offer.isVideoCall || false);
//           setShowIncomingCallModal(true);
//         }
//       };

//       ws.current.onerror = () => {};

//       ws.current.onclose = () => {
//         wsConnectedRef.current = false;
//         clearHeartbeat();

//         if (intentionalCloseRef.current) {
//           intentionalCloseRef.current = false;
//           return;
//         }

//         reconnectTimeoutRef.current = setTimeout(() => {
//           if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
//             connectCallWebSocket();
//           }
//         }, 5000);
//       };
//     } catch (err) {
//       console.log('[GlobalCall WS] connect error:', err?.message);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!isAuthenticated) return;

//     connectCallWebSocket();

//     // 🔴 CHANGED: previously gated on `!wsConnectedRef.current`, which can
//     // get permanently stuck `true` if onclose never fires (the exact bug
//     // causing this to fail on non-Techno OEMs). Now every foreground
//     // transition unconditionally verifies + rebuilds the connection.
//     const sub = AppState.addEventListener('change', (nextAppState) => {
//       if (nextAppState === 'active') {
//         console.log('[GlobalCall WS] App foregrounded — verifying connection health');
//         if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
//           connectCallWebSocket();
//         } else {
//           // Socket LOOKS open — but might be silently dead (the core bug).
//           // Send an immediate ping; if no pong comes back promptly, the
//           // heartbeat timeout logic will force a reconnect.
//           try {
//             ws.current.send(JSON.stringify({ type: 'ping' }));
//             if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
//             heartbeatTimeoutRef.current = setTimeout(() => {
//               const sinceLastPong = Date.now() - lastPongAtRef.current;
//               if (sinceLastPong >= HEARTBEAT_TIMEOUT_MS) {
//                 forceReconnect('stale after resume');
//               }
//             }, HEARTBEAT_TIMEOUT_MS);
//           } catch (e) {
//             forceReconnect('ping failed on resume');
//           }
//         }
//       }
//     });

//     return () => {
//       sub.remove();
//       clearHeartbeat();
//       if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
//       if (ws.current) {
//         intentionalCloseRef.current = true;
//         ws.current.close(1000, 'provider unmount');
//         ws.current = null;
//       }
//     };
//   }, [isAuthenticated, connectCallWebSocket, forceReconnect]);

//   // ---- Handles calls arriving via native notification tap / CallKeep ----
//   useEffect(() => {
//     global.__callNotificationHandler = (callData) => {
//       console.log('📞 Call notification received (global):', callData);

//       const profileImagePath =
//         callData.profileImage || callData.callerInfo?.profileImage || '';

//       if (global.__onCallScreen) {
//         console.log('Already on call screen, ignoring');
//         return;
//       }

//       InCallManager.stopRingtone();
//       Vibration.cancel();

//       currentCallIdRef.current = callData.callId || currentCallIdRef.current;

//       setCallerInfo((prev) => {
//         if (prev?.offer?.sdp) {
//           return {
//             ...prev,
//             profileImage: profileImagePath || prev.profileImage,
//             name: callData.callerName || callData.callerInfo?.name || prev.name,
//           };
//         }
//         return {
//           profileImage: profileImagePath,
//           name: callData.callerName || callData.callerInfo?.name || 'Unknown Caller',
//           offer: null,
//         };
//       });

//       setIsVideoCall(callData.callType === 'video' || callData.isVideoCall || false);
//     };

//     return () => {
//       global.__callNotificationHandler = null;
//     };
//   }, []);

//   // useEffect(() => {
//   //   global.__callAcceptHandler = async (callData) => {
//   //     console.log('📞 Call acceptance from notification (global):', callData);

//   //     setShowIncomingCallModal(false);
//   //     InCallManager.stopRingtone();
//   //     Vibration.cancel();

//   //     setTimeout(() => {
//   //       navigationRef.current?.navigate('VoiceCalls', {
//   //         profile_image: '',
//   //         name: callData.callerName,
//   //         targetUserId: callData.callerId,
//   //         incomingOffer: null,
//   //         isIncomingCall: true,
//   //         isInitiator: false,
//   //         autoAnswerOnOffer: true,
//   //       });
//   //     }, 100);
//   //   };

//   //   const checkForPendingCallAccept = async () => {
//   //     try {
//   //       const acceptPending = await AsyncStorage.getItem('accept_pending_call');
//   //       if (acceptPending) {
//   //         const callData = JSON.parse(acceptPending);
//   //         await AsyncStorage.removeItem('accept_pending_call');
//   //         if (callData?.roomId) {
//   //           global.__callAcceptHandler(callData);
//   //         }
//   //       }
//   //     } catch (error) {
//   //       console.error('Error checking pending call accept:', error);
//   //     }
//   //   };

//   //   checkForPendingCallAccept();

//   //   return () => {
//   //     global.__callAcceptHandler = null;
//   //   };
//   // }, [navigationRef]);


//   useEffect(() => {
//   global.__callAcceptHandler = async (callData) => {
//     console.log('📞 Call acceptance from notification (global):', callData);

//     setShowIncomingCallModal(false);
//     InCallManager.stopRingtone();
//     Vibration.cancel();

//     // Our persistent socket may already have received the real offer
//     // (this is exactly the path that already works from the in-app modal).
//     if (callerInfo?.offer?.sdp) {
//       handleAcceptCall();
//       return;
//     }

//     // No offer captured yet — app was likely killed when the call arrived,
//     // so CallProvider's socket never existed to receive it. Falling back
//     // to opening VoiceCalls and waiting on a fresh "offer" over a new
//     // socket — this only works if the backend replays pending offers to
//     // new room joiners. Confirm that server-side; otherwise this branch
//     // still hangs like today.
//     setTimeout(() => {
//       navigationRef.current?.navigate('VoiceCalls', {
//         profile_image: '',
//         name: callData.callerName,
//         targetUserId: callData.callerId,
//         incomingOffer: null,
//         isIncomingCall: true,
//         isInitiator: false,
//         autoAnswerOnOffer: true,
//       });
//     }, 100);
//   };

//   const checkForPendingCallAccept = async () => {
//     try {
//       const acceptPending = await AsyncStorage.getItem('accept_pending_call');
//       if (acceptPending) {
//         const callData = JSON.parse(acceptPending);
//         await AsyncStorage.removeItem('accept_pending_call');
//         if (callData?.roomId) {
//           global.__callAcceptHandler(callData);
//         }
//       }
//     } catch (error) {
//       console.error('Error checking pending call accept occur:', error);
//     }
//   };

//   checkForPendingCallAccept();

//   return () => {
//     global.__callAcceptHandler = null;
//   };
// }, [navigationRef, callerInfo, handleAcceptCall]);

//   const handleAcceptCall = useCallback(() => {
//     forceStopAllCallAudio(currentCallIdRef.current);
//     isCallBeingHandledRef.current = false;

//     setShowIncomingCallModal(false);
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//     try { NativeModules.CallModule?.stopCallService(); } catch (e) {}

//     if (currentCallIdRef.current) {
//       CallKeepService.endCall(currentCallIdRef.current);
//     }
//     currentCallIdRef.current = null;

//     if (!callerInfo?.offer?.sdp) {
//       console.error('[GlobalCall Accept] Offer has no SDP!');
//       return;
//     }

//     const targetScreen = callerInfo.offer?.isVideoCall ? 'VideoCalls' : 'VoiceCalls';

//     navigationRef.current?.navigate(targetScreen, {
//       profile_image: callerInfo.profileImage || '',
//       name: callerInfo.name || 'Unknown',
//       targetUserId: callerInfo.offer?.targetUserId || callerInfo.offer?.callerId || '',
//       incomingOffer: callerInfo.offer,
//       isIncomingCall: true,
//       isInitiator: false,
//       autoAnswerOnOffer: false,
//     });
//   }, [callerInfo, navigationRef]);

//   const handleRejectCall = useCallback(() => {
//     forceStopAllCallAudio(currentCallIdRef.current);
//     isCallBeingHandledRef.current = false;

//     InCallManager.stopRingtone();
//     Vibration.cancel();
//     try { NativeModules.CallModule?.stopCallService(); } catch (e) {}

//     if (currentCallIdRef.current) {
//       CallKeepService.endCall(currentCallIdRef.current);
//     }
//     currentCallIdRef.current = null;

//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({
//         type: 'reject_call',
//         caller_id: callerInfo.offer?.targetUserId,
//         room_id: callerInfo.offer?.roomId,
//       }));
//     }

//     setShowIncomingCallModal(false);
//     setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
//   }, [callerInfo]);

//   return (
//     <CallContext.Provider value={{ currentCallIdRef, isCallBeingHandledRef }}>
//       {children}
//       <IncomingCallModal
//         visible={showIncomingCallModal}
//         onAccept={handleAcceptCall}
//         onReject={handleRejectCall}
//         profileImage={callerInfo.profileImage}
//         callerName={callerInfo.name}
//         isVideoCall={isVideoCall}
//       />
//     </CallContext.Provider>
//   );
// };


import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { NativeModules, Vibration, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InCallManager from 'react-native-incall-manager';
import CallKeepService from '../src/services/CallKeepService';
import IncomingCallModal from '../components/IncomingCallModal';
import { forceStopAllCallAudio } from '../src/utils/callAudio';

const SIGNALING_SERVER = 'wss://api.showapp.ng';

// Faster dead-socket detection — was 20s/8s (28s worst case before a
// reconnect even starts). Aggressive OEMs (Samsung/Xiaomi/Huawei/Oppo/Vivo)
// silently kill background sockets without firing onclose, so the sooner we
// catch a stale connection, the sooner an incoming call can actually reach
// the device instead of landing on a half-dead socket.
const HEARTBEAT_INTERVAL_MS = 12000;
const HEARTBEAT_TIMEOUT_MS = 4000;

// Reconnect backoff — starts fast (1s) instead of a flat 5s, and backs off
// only if failures repeat, capped at 8s. Most drops are transient network
// blips that resolve in under a second, so waiting a flat 5s before every
// retry was needlessly slow on every device, not just problem OEMs.
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 8000;

const CallContext = createContext(null);
export const useGlobalCall = () => useContext(CallContext);

/**
 * Mounted ONCE at the app root (see App.js). Owns:
 * - the single, app-wide call-signaling WebSocket that listens for
 *   incoming calls
 * - the incoming-call UI state
 * - the IncomingCallModal itself, rendered here so it overlays whatever
 *   screen the user is currently on
 *
 * navigationRef is the SAME module-level ref already created in App.js —
 * passed in as a prop so accept/reject can navigate regardless of which
 * screen is currently focused.
 */
export const CallProvider = ({ children, navigationRef, isAuthenticated }) => {
  const [callerInfo, setCallerInfo] = useState({ profileImage: '', name: 'Incoming Call', offer: null });
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const ws = useRef(null);
  const isCallBeingHandledRef = useRef(false);
  const currentCallIdRef = useRef(null);
  const wsConnectedRef = useRef(false);
  const intentionalCloseRef = useRef(false);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  // Mirrors `callerInfo` state so callbacks that don't need to re-render can
  // read the latest value via a ref instead of closing over stale state —
  // this lets us keep effects/callbacks from re-running every time a call
  // comes in, which was previously re-registering global handlers and
  // re-reading AsyncStorage on every single incoming call.
  const callerInfoRef = useRef(callerInfo);
  useEffect(() => { callerInfoRef.current = callerInfo; }, [callerInfo]);

  const heartbeatIntervalRef = useRef(null);
  const heartbeatTimeoutRef = useRef(null);
  const lastPongAtRef = useRef(0);

  const clearHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  };

  const clearReconnectTimer = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const scheduleReconnect = useCallback(() => {
    clearReconnectTimer();
    const attempt = reconnectAttemptRef.current;
    const delay = Math.min(RECONNECT_BASE_MS * Math.pow(2, attempt), RECONNECT_MAX_MS);
    reconnectAttemptRef.current = attempt + 1;

    console.log(`[GlobalCall WS] Reconnecting in ${delay}ms (attempt ${attempt + 1})`);
    reconnectTimeoutRef.current = setTimeout(() => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        connectCallWebSocket();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, delay);
  }, []);

  const forceReconnect = useCallback((reason) => {
    console.log('[GlobalCall WS] Force reconnect:', reason);
    clearHeartbeat();
    if (ws.current) {
      try {
        intentionalCloseRef.current = true; // this close is deliberate — don't let onclose double-schedule a reconnect
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
      } catch (e) {}
      ws.current = null;
    }
    wsConnectedRef.current = false;
    connectCallWebSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startHeartbeat = () => {
    clearHeartbeat();
    lastPongAtRef.current = Date.now();

    heartbeatIntervalRef.current = setInterval(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      try {
        ws.current.send(JSON.stringify({ type: 'ping' }));
      } catch (e) {
        forceReconnect('ping send failed');
        return;
      }

      if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = setTimeout(() => {
        const sinceLastPong = Date.now() - lastPongAtRef.current;
        if (sinceLastPong >= HEARTBEAT_TIMEOUT_MS) {
          forceReconnect('heartbeat timeout — socket is stale');
        }
      }, HEARTBEAT_TIMEOUT_MS);
    }, HEARTBEAT_INTERVAL_MS);
  };

  const connectCallWebSocket = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const retrieveUserId = await AsyncStorage.getItem('userData');
      if (!token || !retrieveUserId) return;
      if (ws.current?.readyState === WebSocket.OPEN) return;

      const userDataObj = JSON.parse(retrieveUserId);
      const currentUserId = userDataObj.id;
      const ROOM_ID = `user-${currentUserId}`;
      const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

      intentionalCloseRef.current = false;

      ws.current = new WebSocket(url);
      ws.current.binaryType = 'arraybuffer';

      ws.current.onopen = () => {
        console.log('[GlobalCall WS] Connected');
        wsConnectedRef.current = true;
        reconnectAttemptRef.current = 0; // reset backoff on a successful connect
        startHeartbeat();
      };

      ws.current.onmessage = (evt) => {
        let data;
        try { data = JSON.parse(evt.data); } catch { return; }

        if (data.type === 'pong') {
          lastPongAtRef.current = Date.now();
          if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
          }
          return;
        }

        if (data.type === 'incoming_call' && data.offer?.sdp) {
          if (global.__onCallScreen) {
            console.log('[GlobalCall WS] Already on call screen — sending busy response');
            if (ws.current?.readyState === WebSocket.OPEN) {
              try {
                ws.current.send(JSON.stringify({
                  type: 'call-busy',
                  receiver_id: data.offer?.callerId || data.offer?.targetUserId,
                  caller_id: data.offer?.targetUserId,
                }));
              } catch (e) {}
            }
            return;
          }

          if (isCallBeingHandledRef.current) {
            console.log('[GlobalCall WS] Already handling a call, ignoring duplicate');
            return;
          }

          const profileImagePath =
            data.offer?.callerInfo?.profileImage ||
            data.callerInfo?.profileImage ||
            data.profileImage ||
            data.profile_image ||
            '';

          const callerName =
            data.offer?.callerInfo?.name ||
            data.callerInfo?.name ||
            data.caller_name ||
            'Unknown Caller';

          isCallBeingHandledRef.current = true;
          currentCallIdRef.current = data.callId || currentCallIdRef.current;

          setCallerInfo({ profileImage: profileImagePath, name: callerName, offer: data.offer });
          setIsVideoCall(data.offer.isVideoCall || false);
          setShowIncomingCallModal(true);
        }
      };

      ws.current.onerror = () => {};

      ws.current.onclose = () => {
        wsConnectedRef.current = false;
        clearHeartbeat();

        if (intentionalCloseRef.current) {
          intentionalCloseRef.current = false;
          return;
        }

        scheduleReconnect();
      };
    } catch (err) {
      console.log('[GlobalCall WS] connect error:', err?.message);
      scheduleReconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    connectCallWebSocket();

    const sub = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('[GlobalCall WS] App foregrounded — verifying connection health');
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
          reconnectAttemptRef.current = 0; // coming back to foreground — don't inherit background backoff
          connectCallWebSocket();
        } else {
          try {
            ws.current.send(JSON.stringify({ type: 'ping' }));
            if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = setTimeout(() => {
              const sinceLastPong = Date.now() - lastPongAtRef.current;
              if (sinceLastPong >= HEARTBEAT_TIMEOUT_MS) {
                forceReconnect('stale after resume');
              }
            }, HEARTBEAT_TIMEOUT_MS);
          } catch (e) {
            forceReconnect('ping failed on resume');
          }
        }
      }
    });

    return () => {
      sub.remove();
      clearHeartbeat();
      clearReconnectTimer();
      if (ws.current) {
        intentionalCloseRef.current = true;
        ws.current.close(1000, 'provider unmount');
        ws.current = null;
      }
    };
  }, [isAuthenticated, connectCallWebSocket, forceReconnect]);

  // ---- Handles calls arriving via native notification tap / CallKeep ----
  useEffect(() => {
    global.__callNotificationHandler = (callData) => {
      console.log('📞 Call notification received (global):', callData);

      const profileImagePath =
        callData.profileImage || callData.callerInfo?.profileImage || '';

      if (global.__onCallScreen) {
        console.log('Already on call screen, ignoring');
        return;
      }

      InCallManager.stopRingtone();
      Vibration.cancel();

      currentCallIdRef.current = callData.callId || currentCallIdRef.current;

      setCallerInfo((prev) => {
        if (prev?.offer?.sdp) {
          return {
            ...prev,
            profileImage: profileImagePath || prev.profileImage,
            name: callData.callerName || callData.callerInfo?.name || prev.name,
          };
        }
        return {
          profileImage: profileImagePath,
          name: callData.callerName || callData.callerInfo?.name || 'Unknown Caller',
          offer: null,
        };
      });

      setIsVideoCall(callData.callType === 'video' || callData.isVideoCall || false);
    };

    return () => {
      global.__callNotificationHandler = null;
    };
  }, []);

  // Defined BEFORE the effect below that references them — this fixes a
  // real crash (ReferenceError: Cannot access 'handleAcceptCall' before
  // initialization) that existed when this useCallback was declared AFTER
  // the effect whose dependency array referenced it.
  const handleAcceptCall = useCallback(() => {
    forceStopAllCallAudio(currentCallIdRef.current);
    isCallBeingHandledRef.current = false;

    setShowIncomingCallModal(false);
    InCallManager.stopRingtone();
    Vibration.cancel();
    try { NativeModules.CallModule?.stopCallService(); } catch (e) {}

    if (currentCallIdRef.current) {
      CallKeepService.endCall(currentCallIdRef.current);
    }
    currentCallIdRef.current = null;

    const offer = callerInfoRef.current?.offer;
    if (!offer?.sdp) {
      console.error('[GlobalCall Accept] Offer has no SDP!');
      return;
    }

    const targetScreen = offer?.isVideoCall ? 'VideoCalls' : 'VoiceCalls';

    navigationRef.current?.navigate(targetScreen, {
      profile_image: callerInfoRef.current.profileImage || '',
      name: callerInfoRef.current.name || 'Unknown',
      targetUserId: offer?.targetUserId || offer?.callerId || '',
      incomingOffer: offer,
      isIncomingCall: true,
      isInitiator: false,
      autoAnswerOnOffer: false,
    });
  }, [navigationRef]);

  const handleRejectCall = useCallback(() => {
    forceStopAllCallAudio(currentCallIdRef.current);
    isCallBeingHandledRef.current = false;

    InCallManager.stopRingtone();
    Vibration.cancel();
    try { NativeModules.CallModule?.stopCallService(); } catch (e) {}

    if (currentCallIdRef.current) {
      CallKeepService.endCall(currentCallIdRef.current);
    }
    currentCallIdRef.current = null;

    const offer = callerInfoRef.current?.offer;
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'reject_call',
        caller_id: offer?.targetUserId,
        room_id: offer?.roomId,
      }));
    }

    setShowIncomingCallModal(false);
    setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
  }, []);

  // ---- Handles accept from the native call notification / killed-app path ----
  // Depends only on `navigationRef` (stable) now, not `callerInfo`/`handleAcceptCall`
  // state — reads the latest offer via `callerInfoRef` instead. This means the
  // effect registers the global handler exactly once instead of re-running (and
  // re-reading AsyncStorage) every single time a call comes in.
  useEffect(() => {
    global.__callAcceptHandler = async (callData) => {
      console.log('📞 Call acceptance from notification (global):', callData);

      setShowIncomingCallModal(false);
      InCallManager.stopRingtone();
      Vibration.cancel();

      // Our persistent socket may already have received the real offer
      // (this is exactly the path that already works from the in-app modal).
      if (callerInfoRef.current?.offer?.sdp) {
        handleAcceptCall();
        return;
      }

      // No offer captured yet — app was likely killed when the call arrived,
      // so CallProvider's socket never existed to receive it. Falls back to
      // opening VoiceCalls and waiting on a fresh "offer" over a new socket —
      // only works if the backend replays pending offers to new room joiners.
      setTimeout(() => {
        navigationRef.current?.navigate('VoiceCalls', {
          profile_image: '',
          name: callData.callerName,
          targetUserId: callData.callerId,
          incomingOffer: null,
          isIncomingCall: true,
          isInitiator: false,
          autoAnswerOnOffer: true,
        });
      }, 100);
    };

    const checkForPendingCallAccept = async () => {
      try {
        const acceptPending = await AsyncStorage.getItem('accept_pending_call');
        if (acceptPending) {
          const callData = JSON.parse(acceptPending);
          await AsyncStorage.removeItem('accept_pending_call');
          if (callData?.roomId) {
            global.__callAcceptHandler(callData);
          }
        }
      } catch (error) {
        console.error('Error checking pending call accept:', error);
      }
    };

    checkForPendingCallAccept();

    return () => {
      global.__callAcceptHandler = null;
    };
  }, [navigationRef, handleAcceptCall]);

  return (
    <CallContext.Provider value={{ currentCallIdRef, isCallBeingHandledRef }}>
      {children}
      <IncomingCallModal
        visible={showIncomingCallModal}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        profileImage={callerInfo.profileImage}
        callerName={callerInfo.name}
        isVideoCall={isVideoCall}
      />
    </CallContext.Provider>
  );
};