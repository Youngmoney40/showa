

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

import RNCallKeep from 'react-native-callkeep';
import { Platform, PermissionsAndroid } from 'react-native';

class CallKeepService {
  constructor() {
    this.isAvailable = false;
    this.initializationPromise = null;
    this.initialized = false;
    this._subscriptions = [];
  }

  async requestAndroidPermissions() {
    if (Platform.OS !== 'android') return true;
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      const allGranted = Object.values(grants).every(
        v => v === PermissionsAndroid.RESULTS.GRANTED
      );
      console.log('[CallKeep] Android permissions granted:', allGranted);
      return allGranted;
    } catch (e) {
      console.error('[CallKeep] Permission request failed:', e);
      return false;
    }
  }

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
//           alertTitle: 'Permissions required',
//           alertDescription: 'This application needs to access your phone accounts',
//           cancelButton: 'Cancel',
//           okButton: 'OK',
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

//       console.log('[CallKeep] Setting up...');
//       await RNCallKeep.setup(options);

//       if (Platform.OS === 'android') {
//         // Check if phone account is enabled in system settings
//         const hasAccount = await RNCallKeep.hasPhoneAccount();
//         console.log('[CallKeep] Has phone account:', hasAccount);

//         if (!hasAccount) {
//           console.warn('[CallKeep] No phone account — prompting user to enable');
//           // This opens Android Telecom settings so user can enable your app
//           RNCallKeep.openPhoneAccounts();
//           // Still mark as initialized so app doesn't loop
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

  // async initialize() {
  //   if (this.initialized && this.isAvailable) return true;
  //   if (this.initializationPromise) return this.initializationPromise;

  //   this.initializationPromise = new Promise(async (resolve) => {
  //     try {
  //       // Request permissions first on Android
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
  //           alertTitle: 'Permissions required',
  //           alertDescription: 'This application needs to access your phone accounts',
  //           cancelButton: 'Cancel',
  //           okButton: 'OK',
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

  //       console.log('[CallKeep] Setting up...');

  //       await RNCallKeep.setup(options);

  //       // Android: check if phone account is enabled
  //       if (Platform.OS === 'android') {
  //         const hasPhoneAccount = await RNCallKeep.hasPhoneAccount();
  //         console.log('[CallKeep] Has phone account:', hasPhoneAccount);

  //         if (!hasPhoneAccount) {
  //           // Open system settings to let user enable the phone account
  //           await RNCallKeep.hasDefaultPhoneAccount();
  //           // Prompt user to enable
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
          alertTitle: 'Phone Account Required',
          alertDescription: 'Enable Showa in phone accounts to receive calls',
          cancelButton: 'Later',
          okButton: 'Enable',
          imageName: 'ic_launcher',
          additionalPermissions: [
            'android.permission.READ_PHONE_STATE',
            'android.permission.SYSTEM_ALERT_WINDOW',
            'android.permission.USE_FULL_SCREEN_INTENT',
          ],
          selfManaged: true,
          foregroundService: {
            channelId: 'com.showa.call',
            channelName: 'Showa Call',
            notificationTitle: 'Showa is active on a call',
            notificationIcon: 'ic_launcher',
          },
        },
      };

      await RNCallKeep.setup(options);

      if (Platform.OS === 'android') {
        const hasAccount = await RNCallKeep.hasPhoneAccount();
        console.log('[CallKeep] Phone account enabled:', hasAccount);

        if (!hasAccount) {
          console.warn('[CallKeep] Phone account NOT enabled — opening settings');
          // This directly opens the telecom account settings page
          RNCallKeep.openPhoneAccounts();
        }
      }

      RNCallKeep.setAvailable(true);
      this.isAvailable = true;
      this.initialized = true;
      console.log('[CallKeep] Setup complete');
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

// Correct v4.x event name map
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
        this._subscriptions.push(sub);
      }
    } else if (typeof RNCallKeep.addEventListener === 'function') {
      RNCallKeep.addEventListener(mappedEvent, handler);
    } else if (typeof RNCallKeep.on === 'function') {
      RNCallKeep.on(mappedEvent, handler);
    } else {
      console.error('[CallKeep] No listener method available');
    }
    console.log('[CallKeep] Listener added for:', mappedEvent, '✅');
  } catch (error) {
    console.error('[CallKeep] Error adding listener for', mappedEvent, ':', error.message);
  }
}

removeAllListeners() {
  console.log('[CallKeep] Removing all listeners, count:', this._subscriptions.length);

  this._subscriptions.forEach(sub => {
    try {
      if (sub && typeof sub.remove === 'function') sub.remove();
    } catch (e) {}
  });
  this._subscriptions = [];

  // v3 fallback cleanup with correct event names
  const events = [
    'answerCall',
    'endCall',
    'didReceiveStartCallAction',  
    'didDisplayIncomingCall',
    'didActivateAudioSession',
    'didDeactivateAudioSession',
  ];

  events.forEach(event => {
    try {
      if (typeof RNCallKeep.removeEventListener === 'function') {
        RNCallKeep.removeEventListener(event);
      }
    } catch (e) {}
  });
}

  // addEventListener(event, handler) {
  //   if (!this.isAvailable) {
  //     console.warn('[CallKeep] Not available, skipping listener for:', event);
  //     return;
  //   }
  //   if (typeof handler !== 'function') {
  //     console.error('[CallKeep] Handler must be a function for event:', event);
  //     return;
  //   }

  //   console.log('[CallKeep] Adding listener for:', event);

  //   try {
  //     if (typeof RNCallKeep.addListener === 'function') {
  //       const sub = RNCallKeep.addListener(event, handler);
  //       this._subscriptions.push(sub);
  //     } else if (typeof RNCallKeep.addEventListener === 'function') {
  //       RNCallKeep.addEventListener(event, handler);
  //     } else if (typeof RNCallKeep.on === 'function') {
  //       RNCallKeep.on(event, handler);
  //     } else {
  //       console.error('[CallKeep] No valid listener method found');
  //     }
  //   } catch (error) {
  //     console.error('[CallKeep] Error adding listener for', event, ':', error);
  //   }
  // }


  // ─── KEY METHOD: call this when incoming call arrives ──────
  // async displayIncomingCall(callData) {
  //   await this.initialize();
  //   if (!this.isAvailable) {
  //     console.warn('[CallKeep] Not available, cannot display call');
  //     return false;
  //   }

  //   const {
  //     callId,
  //     callerName = 'Unknown',
  //     callerId = '',
  //     isVideo = false,
  //     roomId = '',
  //   } = callData;

  //   console.log('[CallKeep] Displaying incoming call:', callId, callerName);

  //   try {
  //     // This is what shows the native Android incoming call screen
  //     RNCallKeep.displayIncomingCall(
  //       callId,          // uuid
  //       callerId,        // handle (phone number or ID)
  //       callerName,      // localizedCallerName
  //       'generic',       // handleType: 'number' | 'email' | 'generic'
  //       isVideo,         // hasVideo
  //     );

  //     console.log('[CallKeep] displayIncomingCall fired successfully');
  //     return true;
  //   } catch (error) {
  //     console.error('[CallKeep] Error displaying incoming call:', error);
  //     return false;
  //   }
  // }

async displayIncomingCall(callData) {
  await this.initialize();
  if (!this.isAvailable) {
    console.warn('[CallKeep] Not available, cannot display call');
    return false;
  }

  const {
    callId,
    callerName = 'Unknown',
    callerId,
    isVideo = false,
    roomId = '',
  } = callData;

  
  const handle = callerId
    ? String(callerId)
    : callerName || 'unknown';

  console.log('[CallKeep] Displaying incoming call:', { callId, handle, callerName, isVideo });

  try {
    RNCallKeep.displayIncomingCall(
      callId,
      handle,       
      callerName,
      'generic',
      isVideo,
    );

    if (Platform.OS === 'android') {
      setTimeout(() => {
        try {
          RNCallKeep.setCurrentCallActive(callId);
        } catch (e) {
          console.warn('[CallKeep] setCurrentCallActive failed:', e);
        }
      }, 1000);
    }

    console.log('[CallKeep] displayIncomingCall fired successfully');
    return true;
  } catch (error) {
    console.error('[CallKeep] Error displaying incoming call:', error);
    return false;
  }
}

  async endCall(callId) {
    if (!callId) return;
    await this.initialize();
    if (!this.isAvailable) return;
    try {
      RNCallKeep.endCall(callId);
      console.log('[CallKeep] Call ended:', callId);
    } catch (error) {
      console.error('[CallKeep] Error ending call:', error);
    }
  }

  async setCallConnected(callId) {
    if (!callId) return;
    await this.initialize();
    if (!this.isAvailable) return;
    try {
      RNCallKeep.setCurrentCallActive(callId);
      console.log('[CallKeep] Call set as active:', callId);
    } catch (error) {
      console.error('[CallKeep] Error setting call active:', error);
    }
  }

  async reportMissedCall(callData) {
    await this.initialize();
    if (!this.isAvailable) return;
    const { callId, callerName, callerId } = callData;
    try {
      RNCallKeep.reportMissedCall(callId, callerName, callerId);
    } catch (error) {
      console.error('[CallKeep] Error reporting missed call:', error);
    }
  }

  cleanup() {
    this.removeAllListeners();
    if (Platform.OS === 'android') {
      try { RNCallKeep.setAvailable(false); } catch (e) {}
    }
    this.isAvailable = false;
    this.initialized = false;
    this.initializationPromise = null;
  }
}

export default new CallKeepService();