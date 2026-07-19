package com.showa

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

    companion object {
        private const val TAG = "MainActivity"
    }

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
            handleDeepLink(it)
            handleCallIntent(it)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        
        handleDeepLink(intent)
        handleCallIntent(intent)
    }

    private fun handleDeepLink(intent: Intent) {
        val data: Uri? = intent.data
        val action = intent.action
        
        // ✅ Handle both VIEW actions and any intent with data
        if (data == null) {
            return
        }

        val url = data.toString()
        Log.d(TAG, "🔗 Deep link received: $url")
        Log.d(TAG, "🔗 Scheme: ${data.scheme}")
        Log.d(TAG, "🔗 Host: ${data.host}")
        Log.d(TAG, "🔗 Path: ${data.path}")

        // ✅ Send to React Native regardless of action type
        val reactContext = reactInstanceManager?.currentReactContext

        if (reactContext != null) {
            val params = Arguments.createMap().apply {
                putString("url", url)
                putString("scheme", data.scheme ?: "")
                putString("host", data.host ?: "")
                putString("path", data.path ?: "")
            }

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("deepLinkReceived", params)
            
            Log.d(TAG, "✅ Deep link sent to React Native")
        } else {
            Log.d(TAG, "⏳ React context not ready, storing deep link")
            DeepLinkHolder.pendingDeepLink = url
        }
    }

    // ============================================================
    // YOUR EXISTING CALL CODE - COMPLETELY UNCHANGED
    // ============================================================
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