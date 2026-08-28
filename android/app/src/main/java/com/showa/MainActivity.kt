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

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   *
   * 🔴 VERIFY: this MUST match whatever value your project already used
   * here before this change — check your old MainActivity.kt (or your
   * app.json / index.js AppRegistry.registerComponent call) to confirm
   * the exact string. It is very likely "Showa" based on your other
   * files, but this is the one thing in this file you must personally
   * confirm rather than trust blindly.
   */
  override fun getMainComponentName(): String = "showa"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    handleIncomingCallIntent(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    handleIncomingCallIntent(intent)
  }

  /**
   * 🔴 THE ACTUAL FIX for "Accept call from notification doesn't work".
   *
   * CallForegroundService's ACTION_ACCEPT branch (when the user taps
   * Accept on the call notification) launches THIS activity with
   * action = "ACCEPT_CALL" plus the call's extras. IncomingCallActivity
   * (when the notification BODY is tapped instead) launches this
   * activity with action = "INCOMING_CALL". Previously nothing here ever
   * read either of these — the intent's extras were silently dropped, so
   * JS never learned a call was accepted/incoming, and the user just
   * landed on a normal app launch with the call already lost.
   *
   * This now branches on whether JS is already running:
   * - JS alive (app was backgrounded, not killed) → emit the event
   *   immediately via DeviceEventEmitter, which App.js already listens
   *   for via DeviceEventEmitter.addListener('incomingCallFromNotification', ...).
   * - JS not yet booted (app was fully killed) → stash the data in
   *   IncomingCallHolder, which App.js's checkPendingCall() ->
   *   CallModule.getPendingCall() already reads on startup.
   */
  private fun handleIncomingCallIntent(intent: Intent?) {
    if (intent == null) return

    val action = intent.action
    val isAcceptAction = action == "ACCEPT_CALL"
    val isIncomingAction = action == "INCOMING_CALL"

    if (!isAcceptAction && !isIncomingAction) return

    val callerName = intent.getStringExtra("callerName") ?: "Unknown"
    val callId = intent.getStringExtra("callId") ?: ""
    val roomId = intent.getStringExtra("roomId") ?: ""
    val callType = intent.getStringExtra("callType") ?: "audio"
    val callerId = intent.getStringExtra("callerId") ?: ""

    val reactContext = reactInstanceManager?.currentReactContext

    if (reactContext != null) {
      val params = Arguments.createMap().apply {
        putString("callerName", callerName)
        putString("callId", callId)
        putString("roomId", roomId)
        putString("callType", callType)
        putString("callerId", callerId)
        putBoolean("autoAccept", isAcceptAction)
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
      IncomingCallHolder.pendingAutoAccept = isAcceptAction
    }
  }
}