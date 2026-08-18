package com.showa;

import android.telecom.Connection;
import android.telecom.ConnectionRequest;
import android.telecom.ConnectionService;
import android.telecom.PhoneAccountHandle;
import android.telecom.TelecomManager;
import android.os.Bundle;
import android.util.Log;

public class ConnectionService extends android.telecom.ConnectionService {

    private static final String TAG = "ShowaConnectionService";

    @Override
    public Connection onCreateIncomingConnection(PhoneAccountHandle connectionManagerPhoneAccount, ConnectionRequest request) {
        Log.d(TAG, "onCreateIncomingConnection: " + request);
        
        // Create and return a new connection
        Connection connection = new Connection() {
            @Override
            public void onAnswer() {
                Log.d(TAG, "onAnswer: Call answered");
                setActive();
            }

            @Override
            public void onReject() {
                Log.d(TAG, "onReject: Call rejected");
                setDisconnected(DisconnectedCause.LOCAL);
                destroy();
            }

            @Override
            public void onAbort() {
                Log.d(TAG, "onAbort: Call aborted");
                setDisconnected(DisconnectedCause.LOCAL);
                destroy();
            }

            @Override
            public void onDisconnect() {
                Log.d(TAG, "onDisconnect: Call disconnected");
                setDisconnected(DisconnectedCause.LOCAL);
                destroy();
            }

            @Override
            public void onHold() {
                Log.d(TAG, "onHold: Call on hold");
                setOnHold();
            }

            @Override
            public void onUnhold() {
                Log.d(TAG, "onUnhold: Call resumed");
                setActive();
            }
        };

        // Set connection properties
        connection.setAddress(request.getAddress(), TelecomManager.PRESENTATION_ALLOWED);
        connection.setCallerDisplayName("Showa Call", TelecomManager.PRESENTATION_ALLOWED);
        connection.setRingbackRequested(true);
        connection.setActive();

        return connection;
    }

    @Override
    public Connection onCreateOutgoingConnection(PhoneAccountHandle connectionManagerPhoneAccount, ConnectionRequest request) {
        Log.d(TAG, "onCreateOutgoingConnection: " + request);
        
        // Create and return a new connection
        Connection connection = new Connection() {
            @Override
            public void onAnswer() {
                Log.d(TAG, "onAnswer: Call answered");
                setActive();
            }

            @Override
            public void onReject() {
                Log.d(TAG, "onReject: Call rejected");
                setDisconnected(DisconnectedCause.LOCAL);
                destroy();
            }

            @Override
            public void onAbort() {
                Log.d(TAG, "onAbort: Call aborted");
                setDisconnected(DisconnectedCause.LOCAL);
                destroy();
            }

            @Override
            public void onDisconnect() {
                Log.d(TAG, "onDisconnect: Call disconnected");
                setDisconnected(DisconnectedCause.LOCAL);
                destroy();
            }

            @Override
            public void onHold() {
                Log.d(TAG, "onHold: Call on hold");
                setOnHold();
            }

            @Override
            public void onUnhold() {
                Log.d(TAG, "onUnhold: Call resumed");
                setActive();
            }
        };

        // Set connection properties
        connection.setAddress(request.getAddress(), TelecomManager.PRESENTATION_ALLOWED);
        connection.setCallerDisplayName("Showa Call", TelecomManager.PRESENTATION_ALLOWED);
        connection.setActive();

        return connection;
    }

    @Override
    public void onCreateIncomingConnectionFailed(PhoneAccountHandle connectionManagerPhoneAccount, ConnectionRequest request) {
        Log.e(TAG, "onCreateIncomingConnectionFailed: " + request);
        super.onCreateIncomingConnectionFailed(connectionManagerPhoneAccount, request);
    }

    @Override
    public void onCreateOutgoingConnectionFailed(PhoneAccountHandle connectionManagerPhoneAccount, ConnectionRequest request) {
        Log.e(TAG, "onCreateOutgoingConnectionFailed: " + request);
        super.onCreateOutgoingConnectionFailed(connectionManagerPhoneAccount, request);
    }
}