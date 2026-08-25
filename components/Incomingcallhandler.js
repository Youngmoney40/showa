import React from 'react';
import IncomingCallModal from '../components/IncomingCallModal';
import { useCallManager } from '../components/Usecallmanager';

/**
 * Drop this on any screen that needs to be able to receive an incoming
 * call (ring, show the modal, accept/reject) — it needs nothing from you
 * except navigation and route.
 *
 *   import IncomingCallHandler from '../components/IncomingCallHandler';
 *   ...
 *   <IncomingCallHandler navigation={navigation} route={route} />
 *
 * If a screen needs to send raw signaling messages too (rare — most
 * screens don't), use the hook directly instead:
 *
 *   import { useCallManager } from '../hooks/useCallManager';
 *   const call = useCallManager(navigation, route);
 *   call.sendMessage({ type: 'something' });
 */
export default function IncomingCallHandler({ navigation, route }) {
  const call = useCallManager(navigation, route);

  return (
    <IncomingCallModal
      visible={call.showIncomingCallModal}
      onAccept={call.handleAcceptCall}
      onReject={call.handleRejectCall}
      profileImage={call.callerInfo.profileImage}
      callerName={call.callerInfo.name}
      isVideoCall={call.isVideoCall}
    />
  );
}