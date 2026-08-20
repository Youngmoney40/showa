import React, { createContext, useContext, useState } from "react";
import InCallManager from 'react-native-incall-manager';
import { NativeModules, Vibration } from 'react-native';

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);

  const showIncomingCall = (callData) => setIncomingCall(callData);
  

  const hideIncomingCall = () => {
  try {
    InCallManager.stopRingtone();
    Vibration.cancel();
    NativeModules.CallModule?.stopCallService(); 
  } catch (e) {}
  setIncomingCall(null);
};

  return (
    <CallContext.Provider
      value={{ incomingCall, showIncomingCall, hideIncomingCall }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
