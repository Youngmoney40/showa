package com.showa

import android.os.Build
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import android.content.Intent

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val data = remoteMessage.data

        if (data["type"] == "incoming_call") {
            // Handle entirely natively — no JS boot required, so this
            // fires just as fast as a system notification.
            val intent = Intent(this, CallForegroundService::class.java).apply {
                action = CallForegroundService.ACTION_START
                putExtra("callerName", data["caller_name"] ?: "Unknown")
                putExtra("callId", data["call_id"] ?: "call_${System.currentTimeMillis()}_${data["caller_id"] ?: data["room_id"] ?: "unknown"}")
                putExtra("roomId", data["room_id"] ?: "")
                putExtra("callType", data["call_type"] ?: "audio")
                putExtra("callerId", data["caller_id"] ?: "")
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent)
            } else {
                startService(intent)
            }
            return // don't fall through to RN's own handling for this message
        }

        // Not a call — let react-native-firebase's default handling process it
        // (regular notifications, etc.) by calling super, or reimplement here.
        super.onMessageReceived(remoteMessage)
    }
}