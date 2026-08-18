package com.showa;

import android.telecom.Connection;
import android.telecom.ConnectionService;
import android.telecom.DisconnectCause;
import android.telecom.PhoneAccountHandle;
import android.telecom.TelecomManager;

public class ConnectionService extends ConnectionService {

    @Override
    public Connection onCreateIncomingConnection(PhoneAccountHandle connectionManagerPhoneAccount, ConnectionRequest request) {
        // Delegate to CallKeep's VoiceConnectionService
        return super.onCreateIncomingConnection(connectionManagerPhoneAccount, request);
    }

    @Override
    public Connection onCreateOutgoingConnection(PhoneAccountHandle connectionManagerPhoneAccount, ConnectionRequest request) {
        // Delegate to CallKeep's VoiceConnectionService
        return super.onCreateOutgoingConnection(connectionManagerPhoneAccount, request);
    }
}