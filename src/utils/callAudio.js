// import InCallManager from 'react-native-incall-manager';
// import { Vibration, NativeModules } from 'react-native';

// /**
//  * Force-stops every possible source of ringtone/vibration/call audio.
//  * Safe to call multiple times, from any screen, at any point in a call's
//  * lifecycle (accept, reject, end). Wrap every call-ending action with this
//  * as a final safety net so nothing can ever get orphaned.
//  */
// export const forceStopAllCallAudio = () => {
//   try {
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//     InCallManager.stop();
//     NativeModules.CallModule?.stopCallService();
//   } catch (e) {
//     console.log('forceStopAllCallAudio error:', e);
//   }
// };

import { Platform, Vibration, NativeModules } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import CallKeepService from '../services/CallKeepService';

/**
 * Force-stops EVERY possible source of ringtone/vibration/call audio,
 * on both Android and iOS, across OS versions and OEM skins.
 *
 * Why this is more aggressive than a single stop() call:
 * - Some Android OEMs (Samsung/Xiaomi/Huawei) release the audio session
 *   asynchronously — a single InCallManager.stop() can fire before the
 *   ringtone's native player has actually attached, so the ringtone starts
 *   AFTER the stop call returns. Retrying at staggered delays catches this.
 * - iOS ringtone (if using CallKit via RNCallKeep) is controlled by the
 *   Telecom/CallKit framework, not InCallManager — it needs its own
 *   endCall() with the correct UUID, or it keeps ringing regardless of
 *   what happens on the InCallManager/Vibration side.
 * - The native Android foreground service notification (INSISTENT flag)
 *   is a THIRD, completely independent audio/vibration source from
 *   InCallManager — it must be told to stop separately via CallModule.
 *
 * @param {string|null} callId - the active call's id, if known. Passed to
 *   CallKeepService.endCall() so CallKit/ConnectionService state is torn
 *   down too, not just the RN-level ringtone.
 */
export const forceStopAllCallAudio = (callId = null) => {
  // --- Layer 1: JS-level InCallManager + Vibration -------------------
  const silenceJsLayer = () => {
    try {
      InCallManager.stopRingtone();
    } catch (e) {}
    try {
      Vibration.cancel();
    } catch (e) {}
    try {
      InCallManager.stop();
    } catch (e) {}
  };

  // --- Layer 2: Android native foreground service / notification -----
  const silenceAndroidNativeLayer = () => {
    if (Platform.OS !== 'android') return;
    try {
      NativeModules.CallModule?.stopCallService();
    } catch (e) {}
  };

  // --- Layer 3: CallKeep (Android ConnectionService / iOS CallKit) ---
  const silenceCallKeepLayer = () => {
    try {
      if (callId) {
        CallKeepService.endCall(callId).catch(() => {});
      }
    } catch (e) {}
  };

  // --- Layer 4: Android audio-session hard reset ----------------------
  // Forces the audio focus/session to release and re-acquire in normal
  // (non-ringing) mode — this is the trick that clears stuck ringtones on
  // Android 14/15 devices where stop() alone doesn't fully release focus.
  const resetAndroidAudioSession = () => {
    if (Platform.OS !== 'android') return;
    try {
      InCallManager.start({ media: 'audio' });
      setTimeout(() => {
        try {
          InCallManager.stop();
        } catch (e) {}
      }, 80);
    } catch (e) {}
  };

  // Run everything immediately...
  silenceJsLayer();
  silenceAndroidNativeLayer();
  silenceCallKeepLayer();

  // ...then retry the JS layer at staggered intervals to catch any
  // in-flight native ringtone start that raced ahead of the first call.
  // 0ms already ran above; these cover delayed/async starts.
  [100, 300, 600, 1200].forEach((delay) => {
    setTimeout(silenceJsLayer, delay);
  });

  // Android audio-session reset — only needed once, after the ringtone
  // itself has had a moment to be told to stop.
  if (Platform.OS === 'android') {
    setTimeout(resetAndroidAudioSession, 250);
  }
};

/**
 * Lighter-weight version for very frequent/non-critical calls (e.g. inside
 * render-adjacent effects) where the full retry cascade above would be
 * excessive. Use forceStopAllCallAudio() for actual accept/reject/end
 * actions; use this for defensive cleanup in effects.
 */
export const quickStopCallAudio = () => {
  try {
    InCallManager.stopRingtone();
    Vibration.cancel();
    InCallManager.stop();
  } catch (e) {}
};