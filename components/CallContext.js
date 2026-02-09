import React, { createContext, useContext, useState } from "react";

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);

  const showIncomingCall = (callData) => setIncomingCall(callData);
  const hideIncomingCall = () => setIncomingCall(null);

  return (
    <CallContext.Provider
      value={{ incomingCall, showIncomingCall, hideIncomingCall }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
