package com.showa

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

class CallForegroundService : Service() {

    private var vibrator: Vibrator? = null

    companion object {
        const val CHANNEL_ID    = "showa_call_channel"
        const val ACTION_START  = "START_CALL"
        const val ACTION_STOP   = "STOP_CALL"
        const val ACTION_ACCEPT = "ACCEPT_CALL"
        const val ACTION_DECLINE = "DECLINE_CALL"
        const val NOTIFICATION_ID = 1001
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent == null) {
            stopSelf()
            return START_NOT_STICKY
        }

        when (intent.action) {
            ACTION_START -> {
                val callerName = intent.getStringExtra("callerName") ?: "Unknown"
                val callId     = intent.getStringExtra("callId") ?: ""
                val roomId     = intent.getStringExtra("roomId") ?: ""
                val callType   = intent.getStringExtra("callType") ?: "audio"
                val callerId   = intent.getStringExtra("callerId") ?: ""

                showCallNotification(callerName, callId, roomId, callType, callerId)
                startVibration()
            }
            ACTION_STOP, ACTION_ACCEPT, ACTION_DECLINE -> {
                stopVibration()
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }
        }

        return START_NOT_STICKY
    }

    private fun showCallNotification(
        callerName: String,
        callId: String,
        roomId: String,
        callType: String,
        callerId: String
    ) {
        createNotificationChannel()

        val isVideo = callType == "video"
        val callLabel = if (isVideo) "Incoming Video Call" else "Incoming Audio Call"

        val pendingFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }

        // Full-screen intent — shows over lock screen
        val fullScreenIntent = Intent(this, IncomingCallActivity::class.java).apply {
            action = ACTION_START
            putExtra("callerName", callerName)
            putExtra("callId", callId)
            putExtra("roomId", roomId)
            putExtra("callType", callType)
            putExtra("callerId", callerId)
            addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_NO_USER_ACTION or
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            )
        }
        val fullScreenPending = PendingIntent.getActivity(
            this, 0, fullScreenIntent, pendingFlags
        )

        // Accept — opens MainActivity directly
        val acceptIntent = Intent(this, MainActivity::class.java).apply {
            action = ACTION_ACCEPT
            putExtra("callerName", callerName)
            putExtra("callId", callId)
            putExtra("roomId", roomId)
            putExtra("callType", callType)
            putExtra("callerId", callerId)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val acceptPending = PendingIntent.getActivity(
            this, 1, acceptIntent, pendingFlags
        )

        // Decline — stops this service
        val declineIntent = Intent(this, CallForegroundService::class.java).apply {
            action = ACTION_DECLINE
            putExtra("callId", callId)
        }
        val declinePending = PendingIntent.getService(
            this, 2, declineIntent, pendingFlags
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(callLabel)
            .setContentText("$callerName is calling...")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setTimeoutAfter(60000) // auto dismiss after 60s
            .setFullScreenIntent(fullScreenPending, true) // KEY: shows over lock screen
            .addAction(android.R.drawable.ic_menu_call, "Accept", acceptPending)
            .addAction(android.R.drawable.ic_delete, "Decline", declinePending)
            .build()

        // FLAG_INSISTENT makes notification sound repeat
        notification.flags = notification.flags or Notification.FLAG_INSISTENT

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun startVibration() {
        val pattern = longArrayOf(0, 1000, 1000)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibrator = vm?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            vibrator = getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }

        vibrator?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                it.vibrate(VibrationEffect.createWaveform(pattern, 0))
            } else {
                @Suppress("DEPRECATION")
                it.vibrate(pattern, 0)
            }
        }
    }

    private fun stopVibration() {
        vibrator?.cancel()
        vibrator = null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Incoming Calls",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Showa incoming call notifications"
                enableVibration(false) // handled manually
                setBypassDnd(true)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setShowBadge(true)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        stopVibration()
        super.onDestroy()
    }
}