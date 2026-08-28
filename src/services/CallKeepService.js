


import RNCallKeep from 'react-native-callkeep';
import { Platform, PermissionsAndroid, NativeModules } from 'react-native';

class CallKeepService {
  constructor() {
    this.isAvailable = false;
    this.initializationPromise = null;
    this.initialized = false;
    this._subscriptions = [];
    this._manualListeners = []; 
  }

  _getEventName(event) {
    const map = {
      'answerCall':                'answerCall',
      'endCall':                   'endCall',
      'startCall':                 'didReceiveStartCallAction',
      'didDisplayIncomingCall':    'didDisplayIncomingCall',
      'didActivateAudioSession':   'didActivateAudioSession',
      'didDeactivateAudioSession': 'didDeactivateAudioSession',
    };
    return map[event] || event;
  }

  // async requestAndroidPermissions() {
  //   if (Platform.OS !== 'android') return true;
  //   try {
  //     const grants = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     ]);
  //     const granted = grants[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE] ===
  //       PermissionsAndroid.RESULTS.GRANTED;
  //     console.log('[CallKeep] Android permissions granted:', granted);
  //     return granted;
  //   } catch (e) {
  //     console.error('[CallKeep] Permission error:', e);
  //     return false;
  //   }
  // }

  async requestAndroidPermissions(retriesLeft = 5) {
  if (Platform.OS !== 'android') return true;
  try {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    const granted = grants[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE] ===
      PermissionsAndroid.RESULTS.GRANTED;
    console.log('[CallKeep] Android permissions granted:', granted);
    return granted;
  } catch (e) {
    // Cold start from the notification's Accept action can execute JS
    // before MainActivity finishes attaching to the bridge — that's what
    // throws "not attached to an Activity". It's transient, so retry
    // with backoff instead of giving up permanently.
    const notAttached = e?.message?.includes('not attached to an Activity');

    if (notAttached && retriesLeft > 0) {
      console.warn(`[CallKeep] Activity not attached yet, retrying (${retriesLeft} left)...`);
      await new Promise((resolve) => setTimeout(resolve, 400));
      return this.requestAndroidPermissions(retriesLeft - 1);
    }

    console.error('[CallKeep] Permission error............:', e);
    console.log("call-keep error")
    return false;
  }
}

  async initialize() {
    if (this.initialized && this.isAvailable) return true;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = new Promise(async (resolve) => {
      try {
        if (Platform.OS === 'android') {
          await this.requestAndroidPermissions();
        }

        const options = {
          ios: {
            appName: 'Showa',
            imageName: 'callkit_icon',
            maximumCallGroups: 1,
            maximumCallsPerCallGroup: 1,
            supportsVideo: true,
          },
          android: {
            alertTitle: 'Permissions required',
            alertDescription: 'Showa needs phone account access to handle calls',
            cancelButton: 'Cancel',
            okButton: 'OK',
            imageName: 'ic_launcher',
            additionalPermissions: [],
            selfManaged: true,
            foregroundService: {
              channelId: 'com.showa.call',
              channelName: 'Showa Calls',
              notificationTitle: 'Showa call in progress',
              notificationIcon: 'ic_launcher',
            },
          },
        };

        console.log('[CallKeep] Running setup...');
        await RNCallKeep.setup(options);

        if (Platform.OS === 'android') {
          const apiLevel = parseInt(Platform.Version, 10);
          console.log('[CallKeep] Android API level:', apiLevel);
          const hasAccount = await RNCallKeep.hasPhoneAccount();
          console.log('[CallKeep] Phone account enabled:', hasAccount);
          if (!hasAccount) {
            RNCallKeep.openPhoneAccounts();
          }
        }

        RNCallKeep.setAvailable(true);
        this.isAvailable = true;
        this.initialized = true;
        console.log('[CallKeep] Setup complete ✅');
        resolve(true);
      } catch (error) {
        console.error('[CallKeep] Setup error:', error);
        this.isAvailable = false;
        this.initialized = false;
        this.initializationPromise = null;
        resolve(false);
      }
    });

    return this.initializationPromise;
  }

  addEventListener(event, handler) {
    if (!this.isAvailable) {
      console.warn('[CallKeep] Not available, skipping:', event);
      return;
    }
    if (typeof handler !== 'function') {
      console.error('[CallKeep] Invalid handler for:', event, typeof handler);
      return;
    }

    const mappedEvent = this._getEventName(event);
    console.log('[CallKeep] Registering:', event, '→', mappedEvent);

    try {
      if (typeof RNCallKeep.addListener === 'function') {
        const sub = RNCallKeep.addListener(mappedEvent, handler);

        if (sub && typeof sub.remove === 'function') {
          // v4.x proper subscription object returned
          this._subscriptions.push(sub);
          console.log('[CallKeep] Listener added (subscription) for:', mappedEvent, '✅');
        } else {
          // addListener returned null/undefined — track manually
          this._manualListeners.push({ event: mappedEvent, handler });
          console.log('[CallKeep] Listener added (manual) for:', mappedEvent, '✅');
        }
      } else if (typeof RNCallKeep.addEventListener === 'function') {
        RNCallKeep.addEventListener(mappedEvent, handler);
        this._manualListeners.push({ event: mappedEvent, handler });
        console.log('[CallKeep] Listener added (addEventListener) for:', mappedEvent, '✅');
      } else if (typeof RNCallKeep.on === 'function') {
        RNCallKeep.on(mappedEvent, handler);
        this._manualListeners.push({ event: mappedEvent, handler });
        console.log('[CallKeep] Listener added (on) for:', mappedEvent, '✅');
      } else {
        console.error('[CallKeep] No listener method available on RNCallKeep');
      }
    } catch (error) {
      console.error('[CallKeep] Error adding listener for', mappedEvent, ':', error.message);
    }
  }

  removeAllListeners() {
    console.log('[CallKeep] Removing all listeners');
    console.log('[CallKeep] Subscriptions:', this._subscriptions.length);
    console.log('[CallKeep] Manual listeners:', this._manualListeners.length);

    // Remove subscription-style (v4.x)
    this._subscriptions.forEach(sub => {
      try {
        if (sub && typeof sub.remove === 'function') sub.remove();
      } catch (e) {}
    });
    this._subscriptions = [];

    // Remove manually tracked listeners
    this._manualListeners.forEach(({ event, handler }) => {
      try {
        if (typeof RNCallKeep.removeEventListener === 'function') {
          RNCallKeep.removeEventListener(event, handler);
        } else if (typeof RNCallKeep.off === 'function') {
          RNCallKeep.off(event, handler);
        }
      } catch (e) {}
    });
    this._manualListeners = [];

    console.log('[CallKeep] All listeners removed ✅');
  }

  async displayIncomingCall(callData) {
    const {
      callId,
      callerName = 'Unknown',
      callerId,
      isVideo = false,
      roomId = '',
    } = callData;

    const handle = callerId ? String(callerId) : callerName || 'unknown';
    const apiLevel = Platform.OS === 'android' ? parseInt(Platform.Version, 10) : 0;

    console.log('[CallKeep] displayIncomingCall:', { callId, callerName, handle, isVideo, apiLevel });

    // if (Platform.OS === 'android') {
    //   // Always start foreground service on Android (works all API levels)
    //   this._startForegroundService({
    //     callerName, callId, roomId,
    //     callType: isVideo ? 'video' : 'audio',
    //     callerId: handle,
    //   });

    //   // Also try ConnectionService (required for API 34+)
    //   await this.initialize();
    //   if (this.isAvailable) {
    //     try {
    //       RNCallKeep.displayIncomingCall(callId, handle, callerName, 'generic', isVideo);
    //       console.log('[CallKeep] ConnectionService displayIncomingCall called ✅');
    //     } catch (e) {
    //       console.warn('[CallKeep] ConnectionService failed, foreground service is fallback:', e.message);
    //     }
    //   }
    //   return true;
    // }

        if (Platform.OS === 'android') {
      // Always start foreground service on Android (works all API levels)
      this._startForegroundService({
        callerName, callId, roomId,
        callType: isVideo ? 'video' : 'audio',
        callerId: handle,
      });

      // Only engage Telecom ConnectionService on API 34+, where it's
      // required to satisfy full-screen-intent restrictions. Below that,
      // skip it entirely — RNCallKeep's self-managed Connection was fighting
      // InCallManager for audio-route ownership on every Android device,
      // which is why earpiece/speaker toggling wasn't working.
      if (apiLevel >= 34) {
        await this.initialize();
        if (this.isAvailable) {
          try {
            RNCallKeep.displayIncomingCall(callId, handle, callerName, 'generic', isVideo);
            console.log('[CallKeep] ConnectionService displayIncomingCall called ✅');
          } catch (e) {
            console.warn('[CallKeep] ConnectionService failed, foreground service is fallback:', e.message);
          }
        }
      } else {
        console.log('[CallKeep] Skipping ConnectionService below API 34 — foreground service only');
      }
      return true;
    }

    // iOS — CallKit
    await this.initialize();
    if (!this.isAvailable) return false;
    try {
      RNCallKeep.displayIncomingCall(callId, handle, callerName, 'generic', isVideo);
      console.log('[CallKeep] iOS CallKit fired ✅');
      return true;
    } catch (e) {
      console.error('[CallKeep] iOS error:', e);
      return false;
    }
  }

  _startForegroundService({ callerName, callId, roomId, callType, callerId }) {
    try {
      if (NativeModules.CallModule) {
        NativeModules.CallModule.startCallService(
          callerName, callId, roomId, callType, callerId
        );
        console.log('[CallKeep] Foreground service started ✅');
      } else {
        console.warn('[CallKeep] CallModule not found');
      }
    } catch (e) {
      console.error('[CallKeep] Foreground service error:', e);
    }
  }


  // async endCall(callId) {
  //   // ✅ Always stop the native foreground service, regardless of whether we have a callId
  //   if (Platform.OS === 'android') {
  //     try { NativeModules.CallModule?.stopCallService(); } catch {}
  //   }

  //   if (!callId) return;   // only the CallKeep-specific part needs a real id

  //   await this.initialize();
  //   if (!this.isAvailable) return;
  //   try {
  //     RNCallKeep.endCall(callId);
  //     console.log('[CallKeep] Call ended:', callId);
  //   } catch (e) {
  //     console.error('[CallKeep] endCall error:', e);
  //   }
  // }


  async endCall(callId) {
  console.log('[CallKeep] endCall called with callId:', callId);
  
  // ✅ Always stop the native foreground service (priority #1)
  if (Platform.OS === 'android') {
    try { 
      NativeModules.CallModule?.stopCallService(); 
      console.log('[CallKeep] Foreground service stopped ✅');
    } catch (e) {
      console.warn('[CallKeep] Failed to stop foreground service:', e);
    }
  }

  // Even if no callId, still try to clean up CallKeep state
  try {
    // Try to end any active call
    if (callId) {
      await this.initialize();
      if (this.isAvailable) {
        RNCallKeep.endCall(callId);
        console.log('[CallKeep] Call ended:', callId);
      }
    } else {
      // No callId, but still ensure CallKeep is cleaned up
      console.log('[CallKeep] No callId provided, skipping RNCallKeep.endCall');
      
      // On Android, we might want to clear any pending notifications
      if (Platform.OS === 'android') {
        try {
          // Some versions of CallKeep might have a way to clear notifications
          RNCallKeep.setAvailable(false);
          setTimeout(() => RNCallKeep.setAvailable(true), 100);
        } catch (e) {}
      }
    }
  } catch (e) {
    console.error('[CallKeep] endCall error:', e);
  }
}

  async setCallConnected(callId) {
    if (!callId) return;
    await this.initialize();
    if (!this.isAvailable) return;
    try {
      RNCallKeep.setCurrentCallActive(callId);
      console.log('[CallKeep] Call set as active:', callId);
    } catch (e) {
      console.error('[CallKeep] setCallConnected error:', e);
    }
  }

  async reportMissedCall(callData) {
    await this.initialize();
    if (!this.isAvailable) return;
    const { callId, callerName, callerId } = callData;
    try {
      RNCallKeep.reportMissedCall(callId, callerName, callerId);
    } catch (e) {
      console.error('[CallKeep] reportMissedCall error:', e);
    }
  }

  cleanup() {
    this.removeAllListeners();
    if (Platform.OS === 'android') {
      try { RNCallKeep.setAvailable(false); } catch {}
      try { NativeModules.CallModule?.stopCallService(); } catch {}
    }
    this.isAvailable = false;
    this.initialized = false;
    this.initializationPromise = null;
  }
}

export default new CallKeepService();