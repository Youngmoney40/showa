import { useState, useRef, useEffect, useCallback } from 'react';
import { Alert, NativeModules, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import InCallManager from 'react-native-incall-manager';
import CallKeepService from '../src/services/CallKeepService';
import { forceStopAllCallAudio } from '../src/utils/callAudio';

const SIGNALING_SERVER = 'wss://api.showapp.ng';

// 🔴 NEW — MODULE-LEVEL (shared across every mounted instance of this
// hook, one per screen), NOT per-component. This is the actual fix.
//
// Previously `isCallBeingHandledRef` was a per-instance useRef, so when
// multiple screens each had their own <IncomingCallHandler>, each one had
// its OWN separate ref. When an incoming_call broadcast arrived, every
// mounted instance's independent WebSocket received it and independently
// thought "I'm first" — so every instance rang and showed its own modal.
// Accepting on the visible one never touched the others', which kept
// ringing invisibly on whatever screen was mounted underneath.
//
// By moving the lock here (module scope), only the FIRST instance to see
// a given incoming call sets it and shows its own UI/ringtone — every
// other simultaneously-mounted instance sees the lock is already held and
// ignores the message entirely, so it never starts ringing in the first
// place.
let globalCallLock = false;
let globalLockCallId = null;

export function useCallManager(navigation, route) {
  const [callerInfo, setCallerInfo] = useState({ profileImage: '', name: 'Incoming Call' });
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const currentCallIdRef = useRef(null);
  const ws = useRef(null);
  const intentionalCloseRef = useRef(false);
  const wsConnectedRef = useRef(false);

  // Tracks whether THIS specific instance is the one currently holding
  // the global lock — needed so we know whether to release it on
  // unmount/accept/reject (we must never release a lock some OTHER
  // instance is holding).
  const holdsLockRef = useRef(false);

  const releaseGlobalLock = () => {
    if (holdsLockRef.current) {
      globalCallLock = false;
      globalLockCallId = null;
      holdsLockRef.current = false;
    }
  };

  // ---- Handle incoming call passed via navigation route params ----
  useEffect(() => {
    const p = route?.params;
    if (!p?.isIncomingCall) return;

    console.log('[CallManager] Incoming call via route params:', p);

    currentCallIdRef.current = p.callId || currentCallIdRef.current;

    setCallerInfo({
      profileImage: p.profile_image || '',
      name: p.name || 'Unknown Caller',
      offer: p.incomingOffer || null,
    });
    setIsVideoCall(p.isVideoCall || false);

    if (p.incomingOffer?.sdp) {
      setShowIncomingCallModal(true);
    }

    // Clear the params so re-focusing this screen later doesn't re-trigger this
    navigation.setParams({
      isIncomingCall: undefined,
      incomingOffer: undefined,
      callId: undefined,
    });
  }, [route?.params?.callId]);

  // ---- Global call notification handler (called from push notification code) ----
  useEffect(() => {
    global.__callNotificationHandler = (callData) => {
      console.log('📞 Call notification received:', callData);

      const profileImagePath =
        callData.profileImage ||
        callData.callerInfo?.profileImage ||
        '';

      if (global.__onCallScreen) {
        console.log('Already on call screen, ignoring');
        return;
      }

      // 🔴 Same shared-lock guard here too — a call could arrive via FCM
      // notification tap on one instance while WS already claimed it on
      // another. Only the winner should react.
      if (globalCallLock && globalLockCallId !== callData.callId) {
        console.log('[CallManager] Another instance already handling a call, ignoring');
        return;
      }
      globalCallLock = true;
      globalLockCallId = callData.callId || null;
      holdsLockRef.current = true;

      InCallManager.stopRingtone();
      Vibration.cancel();

      currentCallIdRef.current = callData.callId || currentCallIdRef.current;

      setCallerInfo(prev => {
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
  }, [navigation]);

  // ---- Global call accept handler (called from push notification / CallKeep) ----
  useEffect(() => {
    global.__callAcceptHandler = async (callData) => {
      console.log('📞 Call acceptance from notification:', callData);

      setShowIncomingCallModal(false);
      InCallManager.stopRingtone();
      Vibration.cancel();
      releaseGlobalLock();

      setTimeout(() => {
        navigation.navigate('VoiceCalls', {
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
  }, [navigation]);

  // ---- Call signaling WebSocket (separate from the chat WebSocket) ----
  const connectCallWebSocket = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const retrieveUserId = await AsyncStorage.getItem('userData');

      if (!token || !retrieveUserId) {
        console.warn('[Call WS] Missing auth data, websocket not started');
        return;
      }

      const userDataObj = JSON.parse(retrieveUserId);
      const currentUserId = userDataObj.id;
      const ROOM_ID = `user-${currentUserId}`;
      const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

      if (ws.current?.readyState === WebSocket.OPEN) {
        console.log('[Call WS] Already connected');
        return;
      }

      intentionalCloseRef.current = false;

      ws.current = new WebSocket(url);
      ws.current.binaryType = 'arraybuffer';

      ws.current.onopen = () => {
        console.log('[Call WS] Connected');
        wsConnectedRef.current = true;
      };

    //   ws.current.onmessage = (evt) => {
    //     let data;
    //     try {
    //       data = JSON.parse(evt.data);
    //     } catch {
    //       return;
    //     }

    //     if (data.type === 'incoming_call' && data.offer?.sdp) {
    //       // If a call screen is already mounted and handling its own
    //       // signaling socket, don't also react here — avoids two
    //       // independent ringtone/UI flows for the same call room.
    //       if (global.__onCallScreen) {
    //         console.log('[Call WS] Ignoring incoming_call — already on call screen');
    //         return;
    //       }

    //       // 🔴 THE FIX — module-level lock shared across EVERY mounted
    //       // instance of this hook, not a per-instance ref. Only the first
    //       // instance to reach this line for a given call wins; every
    //       // other instance (on other screens) sees the lock already held
    //       // and returns immediately, WITHOUT ever setting its own
    //       // showIncomingCallModal — so it never starts ringing at all.
    //       if (globalCallLock) {
    //         console.log('[Call WS] Another instance already handling a call, ignoring duplicate');
    //         return;
    //       }
    //       globalCallLock = true;
    //       globalLockCallId = data.callId || null;
    //       holdsLockRef.current = true;

    //       const profileImagePath =
    //         data.offer?.callerInfo?.profileImage ||
    //         data.callerInfo?.profileImage ||
    //         data.profileImage ||
    //         data.profile_image ||
    //         '';

    //       const callerName =
    //         data.offer?.callerInfo?.name ||
    //         data.callerInfo?.name ||
    //         data.caller_name ||
    //         'Unknown Caller';

    //       currentCallIdRef.current = data.callId || currentCallIdRef.current;

    //       setCallerInfo({
    //         profileImage: profileImagePath,
    //         name: callerName,
    //         offer: data.offer,
    //       });

    //       setIsVideoCall(data.offer.isVideoCall || false);
    //       setShowIncomingCallModal(true);
    //     }
    //   };

    ws.current.onmessage = (evt) => {
        let data;
        try {
            data = JSON.parse(evt.data);
        } catch {
            return;
        }

        
        if (data.type === 'call-ended' || data.type === 'call_ended') {
            
            if (holdsLockRef.current) {
            console.log('[Call WS] Caller ended the call before it was answered');
            InCallManager.stopRingtone();
            Vibration.cancel();
            try { NativeModules.CallModule?.stopCallService(); } catch (e) {}
            releaseGlobalLock();
            setShowIncomingCallModal(false);
            setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
            currentCallIdRef.current = null;
            }
            return;
        }

        if (data.type === 'incoming_call' && data.offer?.sdp) {
           
            if (global.__onCallScreen) {
            console.log('[Call WS] Ignoring incoming_call — already on call screen');
            return;
            }

            if (globalCallLock) {
            console.log('[Call WS] Another instance already handling a call, ignoring duplicate');
            return;
            }
            globalCallLock = true;
            globalLockCallId = data.callId || null;
            holdsLockRef.current = true;

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

            currentCallIdRef.current = data.callId || currentCallIdRef.current;

            setCallerInfo({
            profileImage: profileImagePath,
            name: callerName,
            offer: data.offer,
            });

            setIsVideoCall(data.offer.isVideoCall || false);
            setShowIncomingCallModal(true);
        }
        };
      ws.current.onerror = () => {};

      ws.current.onclose = () => {
        wsConnectedRef.current = false;

        // Don't auto-reconnect if WE deliberately closed this socket
        // (e.g. navigated into the call screen, which opens its own
        // socket for the same room).
        if (intentionalCloseRef.current) {
          console.log('[Call WS] Closed intentionally, not reconnecting');
          intentionalCloseRef.current = false;
          return;
        }

        setTimeout(() => {
          if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            connectCallWebSocket();
          }
        }, 5000);
      };
    } catch (err) {
      console.error('[Call WS] Failed to connect:', err);
    }
  }, []);

  useEffect(() => {
    connectCallWebSocket();

    return () => {
      if (ws.current) {
        intentionalCloseRef.current = true;
        ws.current.close(1000, 'component unmount');
        ws.current = null;
      }

      // 🔴 NEW: if THIS instance is unmounting while it still holds the
      // lock (e.g. user navigated away before answering/rejecting), we
      // must release it — otherwise the lock stays stuck forever and no
      // future call could ever be picked up by any instance.
      releaseGlobalLock();
    };
  }, [navigation, connectCallWebSocket]);

  useEffect(() => {
    global.__isCallBeingHandled = () => globalCallLock;
    return () => {
      global.__isCallBeingHandled = null;
    };
  }, []);

  // Pause the socket whenever this screen loses focus (user navigated into
  // a call screen which opens its own signaling socket for the same room),
  // and resume it when this screen regains focus.
  useFocusEffect(
    useCallback(() => {
      if (!wsConnectedRef.current && (!ws.current || ws.current.readyState === WebSocket.CLOSED)) {
        connectCallWebSocket();
      }

      return () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          console.log('[Call WS] Closing on blur (navigating to call screen)');
          intentionalCloseRef.current = true;
          ws.current.close(1000, 'navigating away');
        }
      };
    }, [connectCallWebSocket])
  );

  const sendMessage = useCallback((msg) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  const handleAcceptCall = useCallback(() => {
    forceStopAllCallAudio(currentCallIdRef.current);
    releaseGlobalLock();

    setShowIncomingCallModal(false);
    InCallManager.stopRingtone();
    Vibration.cancel();
    try { NativeModules.CallModule?.stopCallService(); } catch (e) {}

    if (currentCallIdRef.current) {
      CallKeepService.endCall(currentCallIdRef.current);
    }
    currentCallIdRef.current = null;

    if (!callerInfo?.offer?.sdp) {
      console.error('[Accept] Offer has no SDP!');
      Alert.alert('Error', 'Call offer expired. Please ask them to call again.');
      return;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    const targetScreen = callerInfo.offer?.isVideoCall ? 'VideoCalls' : 'VoiceCalls';

    navigation.navigate(targetScreen, {
      profile_image: callerInfo.profileImage || '',
      name: callerInfo.name || 'Unknown',
      targetUserId: callerInfo.offer?.targetUserId || callerInfo.offer?.callerId || '',
      incomingOffer: callerInfo.offer,
      isIncomingCall: true,
      isInitiator: false,
      autoAnswerOnOffer: false,
    });
  }, [callerInfo, navigation]);

  const handleRejectCall = useCallback(() => {
    forceStopAllCallAudio(currentCallIdRef.current);
    releaseGlobalLock();

    InCallManager.stopRingtone();
    Vibration.cancel();
    try { NativeModules.CallModule?.stopCallService(); } catch (e) {}

    if (currentCallIdRef.current) {
      CallKeepService.endCall(currentCallIdRef.current);
    }
    currentCallIdRef.current = null;

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'reject_call',
        caller_id: callerInfo.offer?.targetUserId,
        room_id: callerInfo.offer?.roomId,
      }));
    }

    setShowIncomingCallModal(false);
    setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
  }, [callerInfo]);

  return {
    callerInfo,
    showIncomingCallModal,
    isVideoCall,
    handleAcceptCall,
    handleRejectCall,
    sendMessage,
  };
}