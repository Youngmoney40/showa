import React from 'react';
import { useNavigation } from '@react-navigation/native';
import IncomingCallModal from '../components/IncomingCallModal';
import { useCallManager } from '../components/Usecallmanager';

/**
 * Global incoming-call listener + modal. Mount this ONCE, inside
 * <NavigationContainer>, guarded by isAuthenticated — see ThemedNavigator
 * in App.js. It gets navigation itself via useNavigation(), so it needs
 * no navigation/route props from its parent.
 */
export default function IncomingCallHandler({ route = {} }) {
  const navigation = useNavigation();
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