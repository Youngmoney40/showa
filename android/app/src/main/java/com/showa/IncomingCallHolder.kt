package com.showa

object IncomingCallHolder {
    var pendingCallerName: String? = null
    var pendingCallId: String? = null
    var pendingRoomId: String? = null
    var pendingCallType: String? = null
    var pendingCallerId: String? = null
    var pendingAutoAccept: Boolean = false

    fun clear() {
        pendingCallerName = null
        pendingCallId = null
        pendingRoomId = null
        pendingCallType = null
        pendingCallerId = null
        pendingAutoAccept = false
    }

    fun hasPendingCall(): Boolean = pendingCallId != null
}