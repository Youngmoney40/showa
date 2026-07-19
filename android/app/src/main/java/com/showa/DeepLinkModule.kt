package com.showa

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class DeepLinkModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val TAG = "DeepLinkModule"
        private var reactContext: ReactApplicationContext? = null
        
        fun setReactContext(context: ReactApplicationContext?) {
            reactContext = context
        }

        fun emitDeepLink(url: String) {
            reactContext?.let { context ->
                try {
                    val params = Arguments.createMap().apply {
                        putString("url", url)
                    }
                    
                    context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("deepLinkReceived", params)
                    
                    Log.d(TAG, "✅ Deep link event sent to JS: $url")
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to emit deep link: ${e.message}")
                }
            }
        }
    }

    init {
        DeepLinkModule.setReactContext(reactApplicationContext)
    }

    override fun getName(): String = "DeepLinkModule"
}