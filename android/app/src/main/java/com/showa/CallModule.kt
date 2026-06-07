package com.showa

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule  

@ReactModule(name = CallModule.NAME)  // ← ADD THIS
class CallModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "CallModule"  // ← ADD THIS
    }

    override fun getName(): String = NAME  // ← CHANGE TO USE CONSTANT

    @ReactMethod
    fun startCallService(
        callerName: String,
        callId: String,
        roomId: String,
        callType: String,
        callerId: String
    ) {
        val intent = Intent(reactContext, CallForegroundService::class.java).apply {
            action = CallForegroundService.ACTION_START
            putExtra("callerName", callerName)
            putExtra("callId", callId)
            putExtra("roomId", roomId)
            putExtra("callType", callType)
            putExtra("callerId", callerId)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopCallService() {
        val intent = Intent(reactContext, CallForegroundService::class.java).apply {
            action = CallForegroundService.ACTION_STOP
        }
        reactContext.startService(intent)
    }

    @ReactMethod
    fun getPendingCall(promise: Promise) {
        if (IncomingCallHolder.hasPendingCall()) {
            val map = WritableNativeMap().apply {
                putString("callerName", IncomingCallHolder.pendingCallerName ?: "Unknown")
                putString("callId",     IncomingCallHolder.pendingCallId ?: "")
                putString("roomId",     IncomingCallHolder.pendingRoomId ?: "")
                putString("callType",   IncomingCallHolder.pendingCallType ?: "audio")
                putString("callerId",   IncomingCallHolder.pendingCallerId ?: "")
                putBoolean("autoAccept", IncomingCallHolder.pendingAutoAccept)
            }
            IncomingCallHolder.clear()
            promise.resolve(map)
        } else {
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun hasFullScreenIntentPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT >= 34) {
            val nm = reactContext.getSystemService(Context.NOTIFICATION_SERVICE)
                    as? NotificationManager
            promise.resolve(nm?.canUseFullScreenIntent() ?: false)
        } else {
            promise.resolve(true)
        }
    }
}