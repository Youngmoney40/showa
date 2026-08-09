
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import IncomingCallModal from '../components/IncomingCallModal';
import InCallManager from 'react-native-incall-manager';
import { Vibration, NativeModules, Alert } from 'react-native';
import CallKeepService from '../src/services/CallKeepService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CallContext = createContext();

export const useCall = () => useContext(CallContext);

export const GlobalCallProvider = ({ children, navigation }) => {
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [callerInfo, setCallerInfo] = useState({ profileImage: '', name: 'Incoming Call', offer: null });
  const [isVideoCall, setIsVideoCall] = useState(false);
  const isCallBeingHandledRef = useRef(false);
  const currentCallIdRef = useRef(null);
  const ws = useRef(null);

  // WebSocket connection for global call handling
  useEffect(() => {
    const connectCallWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const retrieveUserId = await AsyncStorage.getItem('userData');

        if (!token || !retrieveUserId) {
          return;
        }

        const userDataObj = JSON.parse(retrieveUserId);
        const currentUserId = userDataObj.id;
        const ROOM_ID = `user-${currentUserId}`;
        const SIGNALING_SERVER = 'wss://api.showapp.ng';
        const url = `${SIGNALING_SERVER}/ws/call/${ROOM_ID}/?token=${token}`;

        if (ws.current?.readyState === WebSocket.OPEN) {
          return;
        }

        ws.current = new WebSocket(url);
        ws.current.binaryType = 'arraybuffer';

        ws.current.onopen = () => {
          console.log('[Global Call WS] Connected');
        };

        ws.current.onmessage = (evt) => {
          let data;
          try {
            data = JSON.parse(evt.data);
          } catch {
            return;
          }

          if (data.type === 'incoming_call' && data.offer?.sdp) {
            if (isCallBeingHandledRef.current) {
              console.log('[Global Call WS] Already handling a call');
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
            
            setCallerInfo({
              profileImage: profileImagePath,
              name: callerName,
              offer: data.offer,
            });
            
            setIsVideoCall(data.offer.isVideoCall || false);
            setShowIncomingCallModal(true);
          }
        };

        ws.current.onclose = () => {
          setTimeout(() => {
            if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
              connectCallWebSocket();
            }
          }, 5000);
        };

      } catch (err) {
        console.error('[Global Call WS] Failed to connect', err);
      }
    };

    connectCallWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, []);

  // Global notification handler
  useEffect(() => {
    global.__callNotificationHandler = (callData) => {
      console.log('[Global] Call notification received:', callData);

      if (global.__onCallScreen) {
        console.log('[Global] Already on call screen, ignoring');
        return;
      }

      InCallManager.stopRingtone();
      Vibration.cancel();

      currentCallIdRef.current = callData.callId || currentCallIdRef.current;

      const profileImagePath = 
        callData.profileImage ||
        callData.callerInfo?.profileImage ||
        '';

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
  }, []);

  // Global accept handler
  useEffect(() => {
    global.__callAcceptHandler = async (callData) => {
      console.log('[Global] Call acceptance from notification:', callData);

      setShowIncomingCallModal(false);
      InCallManager.stopRingtone();
      Vibration.cancel();

      setTimeout(() => {
        if (navigation) {
          navigation.navigate('VoiceCalls', {
            profile_image: '',
            name: callData.callerName,
            targetUserId: callData.callerId,
            incomingOffer: null,
            isIncomingCall: true,
            isInitiator: false,
            autoAnswerOnOffer: true,
          });
        }
      }, 100);
    };

    return () => {
      global.__callAcceptHandler = null;
    };
  }, [navigation]);

  const handleAcceptCall = () => {
    console.log('[Global] Accepting call');
    isCallBeingHandledRef.current = false;

    setShowIncomingCallModal(false);
    InCallManager.stopRingtone();
    Vibration.cancel();
    try { NativeModules.CallModule?.stopCallService(); } catch (e) {}

    if (currentCallIdRef.current) {
      CallKeepService.endCall(currentCallIdRef.current);
    }
    currentCallIdRef.current = null;

    if (!callerInfo?.offer?.sdp) {
      Alert.alert('Error', 'Call offer expired. Please ask them to call again.');
      return;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    const targetScreen = callerInfo.offer?.isVideoCall ? 'VideoCalls' : 'VoiceCalls';

    if (navigation) {
      navigation.navigate(targetScreen, {
        profile_image: callerInfo.profileImage || '',
        name: callerInfo.name || 'Unknown',
        targetUserId: callerInfo.offer?.targetUserId || callerInfo.offer?.callerId || '',
        incomingOffer: callerInfo.offer,
        isIncomingCall: true,
        isInitiator: false,
        autoAnswerOnOffer: false,
      });
    }
  };

  const handleRejectCall = () => {
    console.log('[Global] Rejecting call');
    isCallBeingHandledRef.current = false;

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
        room_id: callerInfo.offer?.roomId
      }));
    }

    setShowIncomingCallModal(false);
    setCallerInfo({ profileImage: '', name: 'Unknown', offer: null });
  };

  return (
    <CallContext.Provider value={{ showIncomingCallModal, callerInfo, isVideoCall, setShowIncomingCallModal }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});