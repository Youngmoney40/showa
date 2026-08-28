package com.showa

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class CallForegroundService : Service() {

    private var vibrator: Vibrator? = null
    private val timeoutHandler = Handler(Looper.getMainLooper())
    private var timeoutRunnable: Runnable? = null

    companion object {
        const val CHANNEL_ID      = "showa_call_channel"
        const val ACTION_START    = "START_CALL"
        const val ACTION_STOP     = "STOP_CALL"
        const val ACTION_ACCEPT   = "ACCEPT_CALL"
        const val ACTION_DECLINE  = "DECLINE_CALL"
        const val NOTIFICATION_ID = 1001

        // 🔴 NEW: real, independent timeout that guarantees ringing stops.
        // setTimeoutAfter() on the notification only hides the notification
        // visually — it never stops the foreground service or the looping
        // vibration. Without this, an unanswered call (caller's cancel
        // message lost, caller's app killed, etc.) rings forever with no
        // way to stop it short of force-closing the app.
        const val RING_TIMEOUT_MS = 45000L
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
                scheduleRingTimeout() // 🔴 NEW
            }

            // 🔴 NEW: Accept is now handled by the service FIRST, so the
            // ringtone/vibration die instantly — before we ever hand off
            // to MainActivity / the RN bridge.
            ACTION_ACCEPT -> {
                cancelRingTimeout() // 🔴 NEW
                silenceCall()

                val callerName = intent.getStringExtra("callerName") ?: "Unknown"
                val callId     = intent.getStringExtra("callId") ?: ""
                val roomId     = intent.getStringExtra("roomId") ?: ""
                val callType   = intent.getStringExtra("callType") ?: "audio"
                val callerId   = intent.getStringExtra("callerId") ?: ""

                try {
                    val launchIntent = Intent(this, MainActivity::class.java).apply {
                        action = ACTION_ACCEPT
                        putExtra("callerName", callerName)
                        putExtra("callId", callId)
                        putExtra("roomId", roomId)
                        putExtra("callType", callType)
                        putExtra("callerId", callerId)
                        addFlags(
                            Intent.FLAG_ACTIVITY_NEW_TASK or
                            Intent.FLAG_ACTIVITY_SINGLE_TOP or
                            Intent.FLAG_ACTIVITY_CLEAR_TOP
                        )
                    }
                    startActivity(launchIntent)
                } catch (e: Exception) {
                    // Call is already silenced above even if this fails.
                }

                stopSelf()
            }

            ACTION_STOP, ACTION_DECLINE -> {
                cancelRingTimeout() // 🔴 NEW
                silenceCall()
                stopSelf()
            }
        }

        return START_NOT_STICKY
    }

    // 🔴 NEW: schedules the hard stop. If nothing else (accept/decline/stop)
    // has cancelled it by RING_TIMEOUT_MS, this fires and forcibly silences
    // + stops the service — guaranteeing the phone can never ring forever.
    private fun scheduleRingTimeout() {
        cancelRingTimeout()
        timeoutRunnable = Runnable {
            silenceCall()
            stopSelf()
        }
        timeoutHandler.postDelayed(timeoutRunnable!!, RING_TIMEOUT_MS)
    }

    // 🔴 NEW
    private fun cancelRingTimeout() {
        timeoutRunnable?.let { timeoutHandler.removeCallbacks(it) }
        timeoutRunnable = null
    }

    /**
     * Stops vibration AND force-removes the notification (including its
     * looping FLAG_INSISTENT sound). Idempotent — safe to call repeatedly
     * from any of the accept/decline/stop paths.
     */
    private fun silenceCall() {
        cancelRingTimeout() // 🔴 NEW — belt-and-braces if silenceCall() is ever called directly elsewhere
        try { stopVibration() } catch (e: Exception) {}
        try { stopForeground(STOP_FOREGROUND_REMOVE) } catch (e: Exception) {}

        // Belt-and-braces: some OEM battery managers don't reliably clear an
        // INSISTENT notification via stopForeground() alone.
        try {
            NotificationManagerCompat.from(this).cancel(NOTIFICATION_ID)
        } catch (e: Exception) {}
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

        // 🔧 CHANGED: was PendingIntent.getActivity(MainActivity) — now
        // targets the service so we can silence audio before launching UI.
        val acceptIntent = Intent(this, CallForegroundService::class.java).apply {
            action = ACTION_ACCEPT
            putExtra("callerName", callerName)
            putExtra("callId", callId)
            putExtra("roomId", roomId)
            putExtra("callType", callType)
            putExtra("callerId", callerId)
        }
        val acceptPending = PendingIntent.getService(
            this, 1, acceptIntent, pendingFlags
        )

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
            .setTimeoutAfter(60000)
            .setFullScreenIntent(fullScreenPending, true)
            .addAction(android.R.drawable.ic_menu_call, "Accept", acceptPending)
            .addAction(android.R.drawable.ic_delete, "Decline", declinePending)
            .build()

        notification.flags = notification.flags or Notification.FLAG_INSISTENT

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun startVibration() {
        val pattern = longArrayOf(0, 1000, 1000)

        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vm?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
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
                enableVibration(false)
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
        cancelRingTimeout() // 🔴 NEW
        silenceCall()
        super.onDestroy()
    }
}