package com.showa

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "showa"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(
            this,
            mainComponentName,
            fabricEnabled
        )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        intent?.let {
            handleCallIntent(it)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleCallIntent(intent)
    }

    private fun handleCallIntent(intent: Intent) {

        val action = intent.action
        if (action != "INCOMING_CALL" && action != "ACCEPT_CALL") {
            return
        }

        val callerName = intent.getStringExtra("callerName") ?: "Unknown"
        val callId = intent.getStringExtra("callId") ?: ""
        val roomId = intent.getStringExtra("roomId") ?: ""
        val callType = intent.getStringExtra("callType") ?: "audio"
        val callerId = intent.getStringExtra("callerId") ?: ""
        val autoAccept = action == "ACCEPT_CALL"

        // Stop foreground service notification
        val stopIntent = Intent(this, CallForegroundService::class.java).apply {
            this.action = CallForegroundService.ACTION_STOP
        }

        startService(stopIntent)

        val reactContext = reactInstanceManager?.currentReactContext

        if (reactContext != null) {
            val params = Arguments.createMap().apply {
                putString("callerName", callerName)
                putString("callId", callId)
                putString("roomId", roomId)
                putString("callType", callType)
                putString("callerId", callerId)
                putBoolean("autoAccept", autoAccept)
            }

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("incomingCallFromNotification", params)

        } else {

            IncomingCallHolder.pendingCallerName = callerName
            IncomingCallHolder.pendingCallId = callId
            IncomingCallHolder.pendingRoomId = roomId
            IncomingCallHolder.pendingCallType = callType
            IncomingCallHolder.pendingCallerId = callerId
            IncomingCallHolder.pendingAutoAccept = autoAccept
        }
    }
}