

// import RNCallKeep from 'react-native-callkeep';
// import { Platform } from 'react-native';

// class CallKeepService {
//   constructor() {
//     this.isAvailable = false;
//     this.initializationPromise = null;
//     this.initialized = false;
//     this._subscriptions = []; // store subscription objects for v4.x
//   }

//   async initialize() {
//     if (this.initialized && this.isAvailable) return true;
//     if (this.initializationPromise) return this.initializationPromise;

//     this.initializationPromise = new Promise((resolve) => {
//       try {
//         const options = {
//           ios: {
//             appName: 'Showa',
//             imageName: 'callkit_icon',
//             maximumCallGroups: 1,
//             maximumCallsPerCallGroup: 1,
//             supportsVideo: true,
//           },
//           android: {
//             alertTitle: 'Permissions required',
//             alertDescription: 'This application needs to access your phone accounts',
//             cancelButton: 'Cancel',
//             okButton: 'OK',
//             imageName: 'ic_launcher',
//             additionalPermissions: [
//               'android.permission.READ_PHONE_STATE',
//               'android.permission.SYSTEM_ALERT_WINDOW',
//               'android.permission.USE_FULL_SCREEN_INTENT',
//             ],
//             selfManaged: true,
//           },
//         };

//         console.log('[CallKeep] Setting up...');
//         RNCallKeep.setup(options);
//         RNCallKeep.setAvailable(true);
//         this.isAvailable = true;
//         this.initialized = true;
//         console.log('[CallKeep] Setup complete');
//         resolve(true);
//       } catch (error) {
//         console.error('[CallKeep] Setup error:', error);
//         this.isAvailable = false;
//         this.initialized = false;
//         this.initializationPromise = null;
//         resolve(false);
//       }
//     });

//     return this.initializationPromise;
//   }

//   addEventListener(event, handler) {
//     if (!this.isAvailable) {
//       console.warn('[CallKeep] Not available, skipping listener for:', event);
//       return;
//     }
//     if (typeof handler !== 'function') {
//       console.error('[CallKeep] Handler must be a function. Got:', typeof handler, 'for event:', event);
//       return;
//     }

//     console.log('[CallKeep] Adding listener for:', event);

//     try {
//       // v4.x — addListener returns a subscription with .remove()
//       if (typeof RNCallKeep.addListener === 'function') {
//         const sub = RNCallKeep.addListener(event, handler);
//         this._subscriptions.push(sub);
//         return;
//       }
//       // v3.x fallbacks
//       if (typeof RNCallKeep.addEventListener === 'function') {
//         RNCallKeep.addEventListener(event, handler);
//         return;
//       }
//       if (typeof RNCallKeep.on === 'function') {
//         RNCallKeep.on(event, handler);
//         return;
//       }
//       console.error('[CallKeep] No valid listener method on RNCallKeep');
//     } catch (error) {
//       console.error('[CallKeep] Error adding listener for', event, ':', error);
//     }
//   }

//   removeAllListeners() {
//     console.log('[CallKeep] Removing all listeners, count:', this._subscriptions.length);
    
//     // v4.x subscription objects
//     this._subscriptions.forEach(sub => {
//       try {
//         if (sub && typeof sub.remove === 'function') {
//           sub.remove();
//         }
//       } catch (e) {
//         console.warn('[CallKeep] Error removing subscription:', e);
//       }
//     });
//     this._subscriptions = [];

//     // v3.x fallback cleanup
//     if (typeof RNCallKeep.removeEventListener === 'function') {
//       ['answerCall', 'endCall', 'startCall', 
//        'didActivateAudioSession', 'didDeactivateAudioSession',
//        'didDisplayIncomingCall'].forEach(event => {
//         try { RNCallKeep.removeEventListener(event); } catch (e) {}
//       });
//     }
//   }

//   async displayIncomingCall(callData) {
//     await this.initialize();
//     if (!this.isAvailable) {
//       console.warn('[CallKeep] Not available, cannot display call');
//       return false;
//     }

//     const { callId, callerName, callerId, isVideo = false, roomId } = callData;
//     console.log('[CallKeep] Displaying incoming call:', callId, callerName);

//     try {
//       RNCallKeep.displayIncomingCall(
//         callId,
//         callerName,
//         callerName,
//         'generic',
//         isVideo,
//         null,
//         JSON.stringify({ roomId, callerId, callId })
//       );

//       if (Platform.OS === 'android') {
//         setTimeout(() => {
//           try {
//             RNCallKeep.setCurrentCallActive(callId);
//           } catch (e) {
//             console.warn('[CallKeep] Could not set call active:', e);
//           }
//         }, 500);
//       }
//       return true;
//     } catch (error) {
//       console.error('[CallKeep] Error displaying call:', error);
//       return false;
//     }
//   }

//   async endCall(callId) {
//     await this.initialize();
//     if (!this.isAvailable) return;
//     try {
//       RNCallKeep.endCall(callId);
//       console.log('[CallKeep] Call ended:', callId);
//     } catch (error) {
//       console.error('[CallKeep] Error ending call:', error);
//     }
//   }

//   async startCall(callData) {
//     await this.initialize();
//     if (!this.isAvailable) return false;
//     const { callId, phoneNumber, callerName } = callData;
//     try {
//       RNCallKeep.startCall(callId, phoneNumber, callerName);
//       return true;
//     } catch (error) {
//       console.error('[CallKeep] Error starting call:', error);
//       return false;
//     }
//   }

//   async setCallConnected(callId) {
//     await this.initialize();
//     if (!this.isAvailable) return;
//     try {
//       RNCallKeep.setCurrentCallActive(callId);
//       console.log('[CallKeep] Call set as active:', callId);
//     } catch (error) {
//       console.error('[CallKeep] Error setting call active:', error);
//     }
//   }

//   async reportMissedCall(callData) {
//     await this.initialize();
//     if (!this.isAvailable) return;
//     const { callId, callerName, callerId } = callData;
//     try {
//       RNCallKeep.reportMissedCall(callId, callerName, callerId);
//     } catch (error) {
//       console.error('[CallKeep] Error reporting missed call:', error);
//     }
//   }

//   cleanup() {
//     this.removeAllListeners();
//     if (Platform.OS === 'android') {
//       try { RNCallKeep.setAvailable(false); } catch (e) {}
//     }
//     this.isAvailable = false;
//     this.initialized = false;
//     this.initializationPromise = null;
//   }
// }

// export default new CallKeepService();


// import RNCallKeep from 'react-native-callkeep';
// import { Platform, PermissionsAndroid } from 'react-native';

// class CallKeepService {
//   constructor() {
//     this.isAvailable = false;
//     this.initializationPromise = null;
//     this.initialized = false;
//     this._subscriptions = [];
//   }

//   async requestAndroidPermissions() {
//     if (Platform.OS !== 'android') return true;
//     try {
//       const grants = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
//         PermissionsAndroid.PERMISSIONS.CALL_PHONE,
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//       ]);
//       const allGranted = Object.values(grants).every(
//         v => v === PermissionsAndroid.RESULTS.GRANTED
//       );
//       console.log('[CallKeep] Android permissions granted:', allGranted);
//       return allGranted;
//     } catch (e) {
//       console.error('[CallKeep] Permission request failed:', e);
//       return false;
//     }
//   }


//   async initialize() {
//   if (this.initialized && this.isAvailable) return true;
//   if (this.initializationPromise) return this.initializationPromise;

//   this.initializationPromise = new Promise(async (resolve) => {
//     try {
//       if (Platform.OS === 'android') {
//         await this.requestAndroidPermissions();
//       }

//       const options = {
//         ios: {
//           appName: 'Showa',
//           imageName: 'callkit_icon',
//           maximumCallGroups: 1,
//           maximumCallsPerCallGroup: 1,
//           supportsVideo: true,
//         },
//         android: {
//           alertTitle: 'Phone Account Required',
//           alertDescription: 'Enable Showa in phone accounts to receive calls',
//           cancelButton: 'Later',
//           okButton: 'Enable',
//           imageName: 'ic_launcher',
//           additionalPermissions: [
//             'android.permission.READ_PHONE_STATE',
//             'android.permission.SYSTEM_ALERT_WINDOW',
//             'android.permission.USE_FULL_SCREEN_INTENT',
//           ],
//           selfManaged: true,
//           foregroundService: {
//             channelId: 'com.showa.call',
//             channelName: 'Showa Call',
//             notificationTitle: 'Showa is active on a call',
//             notificationIcon: 'ic_launcher',
//           },
//         },
//       };

//       await RNCallKeep.setup(options);

//       if (Platform.OS === 'android') {
//         const hasAccount = await RNCallKeep.hasPhoneAccount();
//         console.log('[CallKeep] Phone account enabled:', hasAccount);

//         if (!hasAccount) {
//           console.warn('[CallKeep] Phone account NOT enabled — opening settings');
//           // This directly opens the telecom account settings page
//           RNCallKeep.openPhoneAccounts();
//         }
//       }

//       RNCallKeep.setAvailable(true);
//       this.isAvailable = true;
//       this.initialized = true;
//       console.log('[CallKeep] Setup complete');
//       resolve(true);
//     } catch (error) {
//       console.error('[CallKeep] Setup error:', error);
//       this.isAvailable = false;
//       this.initialized = false;
//       this.initializationPromise = null;
//       resolve(false);
//     }
//   });

//   return this.initializationPromise;
// }

// // Correct v4.x event name map
// _getEventName(event) {
//   const map = {
//     'answerCall':                'answerCall',
//     'endCall':                   'endCall',
//     'startCall':                 'didReceiveStartCallAction',
//     'didDisplayIncomingCall':    'didDisplayIncomingCall',
//     'didActivateAudioSession':   'didActivateAudioSession',
//     'didDeactivateAudioSession': 'didDeactivateAudioSession',
//   };
//   return map[event] || event;
// }

// addEventListener(event, handler) {
//   if (!this.isAvailable) {
//     console.warn('[CallKeep] Not available, skipping:', event);
//     return;
//   }
//   if (typeof handler !== 'function') {
//     console.error('[CallKeep] Invalid handler for:', event, typeof handler);
//     return;
//   }

//   const mappedEvent = this._getEventName(event);
//   console.log('[CallKeep] Registering:', event, '→', mappedEvent);

//   try {
//     if (typeof RNCallKeep.addListener === 'function') {
//       const sub = RNCallKeep.addListener(mappedEvent, handler);
//       if (sub && typeof sub.remove === 'function') {
//         this._subscriptions.push(sub);
//       }
//     } else if (typeof RNCallKeep.addEventListener === 'function') {
//       RNCallKeep.addEventListener(mappedEvent, handler);
//     } else if (typeof RNCallKeep.on === 'function') {
//       RNCallKeep.on(mappedEvent, handler);
//     } else {
//       console.error('[CallKeep] No listener method available');
//     }
//     console.log('[CallKeep] Listener added for:', mappedEvent, '✅');
//   } catch (error) {
//     console.error('[CallKeep] Error adding listener for', mappedEvent, ':', error.message);
//   }
// }

// removeAllListeners() {
//   console.log('[CallKeep] Removing all listeners, count:', this._subscriptions.length);

//   this._subscriptions.forEach(sub => {
//     try {
//       if (sub && typeof sub.remove === 'function') sub.remove();
//     } catch (e) {}
//   });
//   this._subscriptions = [];

//   // v3 fallback cleanup with correct event names
//   const events = [
//     'answerCall',
//     'endCall',
//     'didReceiveStartCallAction',  
//     'didDisplayIncomingCall',
//     'didActivateAudioSession',
//     'didDeactivateAudioSession',
//   ];

//   events.forEach(event => {
//     try {
//       if (typeof RNCallKeep.removeEventListener === 'function') {
//         RNCallKeep.removeEventListener(event);
//       }
//     } catch (e) {}
//   });
// }


// async displayIncomingCall(callData) {
//   await this.initialize();
//   if (!this.isAvailable) {
//     console.warn('[CallKeep] Not available, cannot display call');
//     return false;
//   }

//   const {
//     callId,
//     callerName = 'Unknown',
//     callerId,
//     isVideo = false,
//     roomId = '',
//   } = callData;

  
//   const handle = callerId
//     ? String(callerId)
//     : callerName || 'unknown';

//   console.log('[CallKeep] Displaying incoming call:', { callId, handle, callerName, isVideo });

//   try {
//     RNCallKeep.displayIncomingCall(
//       callId,
//       handle,       
//       callerName,
//       'generic',
//       isVideo,
//     );

//     if (Platform.OS === 'android') {
//       setTimeout(() => {
//         try {
//           //RNCallKeep.setCurrentCallActive(callId);
//         } catch (e) {
//           console.warn('[CallKeep] setCurrentCallActive failed:', e);
//         }
//       }, 1000);
//     }

//     console.log('[CallKeep] displayIncomingCall fired successfully');
//     return true;
//   } catch (error) {
//     console.error('[CallKeep] Error displaying incoming call:', error);
//     return false;
//   }
// }

//   async endCall(callId) {
//     if (!callId) return;
//     await this.initialize();
//     if (!this.isAvailable) return;
//     try {
//       RNCallKeep.endCall(callId);
//       console.log('[CallKeep] Call ended:', callId);
//     } catch (error) {
//       console.error('[CallKeep] Error ending call:', error);
//     }
//   }

//   async setCallConnected(callId) {
//     if (!callId) return;
//     await this.initialize();
//     if (!this.isAvailable) return;
//     try {
//       RNCallKeep.setCurrentCallActive(callId);
//       console.log('[CallKeep] Call set as active:', callId);
//     } catch (error) {
//       console.error('[CallKeep] Error setting call active:', error);
//     }
//   }

//   async reportMissedCall(callData) {
//     await this.initialize();
//     if (!this.isAvailable) return;
//     const { callId, callerName, callerId } = callData;
//     try {
//       RNCallKeep.reportMissedCall(callId, callerName, callerId);
//     } catch (error) {
//       console.error('[CallKeep] Error reporting missed call:', error);
//     }
//   }

//   cleanup() {
//     this.removeAllListeners();
//     if (Platform.OS === 'android') {
//       try { RNCallKeep.setAvailable(false); } catch (e) {}
//     }
//     this.isAvailable = false;
//     this.initialized = false;
//     this.initializationPromise = null;
//   }
// }

// export default new CallKeepService();

import RNCallKeep from 'react-native-callkeep';
import { Platform, PermissionsAndroid, NativeModules } from 'react-native';

class CallKeepService {
  constructor() {
    this.isAvailable = false;
    this.initializationPromise = null;
    this.initialized = false;
    this._subscriptions = [];
    this._manualListeners = []; // ← tracks handlers when addListener returns null
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

  async requestAndroidPermissions() {
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
      console.error('[CallKeep] Permission error:', e);
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

    if (Platform.OS === 'android') {
      // Always start foreground service on Android (works all API levels)
      this._startForegroundService({
        callerName, callId, roomId,
        callType: isVideo ? 'video' : 'audio',
        callerId: handle,
      });

      // Also try ConnectionService (required for API 34+)
      await this.initialize();
      if (this.isAvailable) {
        try {
          RNCallKeep.displayIncomingCall(callId, handle, callerName, 'generic', isVideo);
          console.log('[CallKeep] ConnectionService displayIncomingCall called ✅');
        } catch (e) {
          console.warn('[CallKeep] ConnectionService failed, foreground service is fallback:', e.message);
        }
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

  async endCall(callId) {
    if (!callId) return;

    if (Platform.OS === 'android') {
      try { NativeModules.CallModule?.stopCallService(); } catch {}
    }

    await this.initialize();
    if (!this.isAvailable) return;
    try {
      RNCallKeep.endCall(callId);
      console.log('[CallKeep] Call ended:', callId);
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