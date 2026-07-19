package com.showa

object DeepLinkHolder {
    var pendingDeepLink: String? = null
    var pendingDeepLinkScheme: String? = null
    var pendingDeepLinkHost: String? = null
    var pendingDeepLinkPath: String? = null
    
    fun clear() {
        pendingDeepLink = null
        pendingDeepLinkScheme = null
        pendingDeepLinkHost = null
        pendingDeepLinkPath = null
    }
}