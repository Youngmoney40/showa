


// import React, { useEffect, useRef, useState, memo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Image,
//   Vibration,
//   Platform,
//   Animated,
//   Easing,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';

// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import InCallManager from 'react-native-incall-manager';

// import { API_ROUTE_IMAGE } from '../api_routing/api';

// const { width } = Dimensions.get('window');

// const IncomingCallModal = ({
//   visible,
//   onAccept,
//   onReject,
//   profileImage,
//   callerName,
//   isVideoCall = false,
// }) => {

//   const [loadingAction, setLoadingAction] = useState(null);

//   // =========================
//   // REFS
//   // =========================

//   const hasStartedRef = useRef(false);
//   const hasHandledActionRef = useRef(false);

//   // =========================
//   // ANIMATIONS
//   // =========================

//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.9)).current;
//   const buttonScaleAccept = useRef(new Animated.Value(1)).current;
//   const buttonScaleReject = useRef(new Animated.Value(1)).current;
//   const ringtoneTimeoutRef = useRef(null);


//   useEffect(() => {
//   if (visible && !hasStartedRef.current) {
//     hasStartedRef.current = true;
//     hasHandledActionRef.current = false;
//     setLoadingAction(null);

//     try {
//       InCallManager.stopRingtone();
//       Vibration.cancel();

//       ringtoneTimeoutRef.current = setTimeout(() => {
//         // Guard: only start if we're still supposed to be visible
//         if (hasStartedRef.current) {
//           InCallManager.startRingtone('_BUNDLE_');
//         }
//         ringtoneTimeoutRef.current = null;
//       }, 200);
//     } catch (e) {
//       console.log('Ringtone error:', e);
//     }

//     Vibration.vibrate([500, 400, 500, 400], true);

//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
//       Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 40, useNativeDriver: true }),
//     ]).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, easing: Easing.linear, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }),
//       ])
//     ).start();
//   }

//   if (!visible) {
//     stopEverything();
//     fadeAnim.setValue(0);
//     scaleAnim.setValue(0.9);
//     pulseAnim.setValue(1);
//     setLoadingAction(null);
//   }

//   return () => {
//     stopEverything();
//   };
// }, [visible]);


// ///


//   const getProfileImageUrl = (imagePath) => {
//   if (!imagePath) return 'https://via.placeholder.com/150';
  
//   // If it's already a full URL, return it as is
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
  
//   // Otherwise, prepend API_ROUTE_IMAGE
//   return `${API_ROUTE_IMAGE}${imagePath}`;
// };

// // Use it everywhere you need the image URL
// // const imageUrl = getProfileImageUrl(profile_image);
// // console.log('Profile image path:', profile_image);
// // console.log('Full URL:', imageUrl);

// //   useEffect(() => {
// //   if (visible && !hasStartedRef.current) {
// //     console.log('[IncomingCallModal] OPENING');
// //     hasStartedRef.current = true;
// //     hasHandledActionRef.current = false;
// //     setLoadingAction(null);

// //     // 🔴 CRITICAL FIX for Android 14+: Stop any existing ringtone first
// //     try {
// //       InCallManager.stopRingtone();
// //       Vibration.cancel();
      
// //       // Small delay to ensure cleanup is complete
// //       setTimeout(() => {
// //         InCallManager.startRingtone('_BUNDLE_');
// //       }, 200);
// //     } catch (e) {
// //       console.log('Ringtone error:', e);
// //     }

// //     // Start vibration pattern (simpler pattern for Android 14+)
// //     Vibration.vibrate([500, 400, 500, 400], true);

// //     // Entrance animation
// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 250,
// //         useNativeDriver: true,
// //       }),
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 7,
// //         tension: 40,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();

// //     // Pulse loop
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.06,
// //           duration: 900,
// //           easing: Easing.linear,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 900,
// //           easing: Easing.linear,
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   }

// //   if (!visible) {
// //     stopEverything();
// //     fadeAnim.setValue(0);
// //     scaleAnim.setValue(0.9);
// //     pulseAnim.setValue(1);
// //     setLoadingAction(null);
    
// //     // 🔴 CRITICAL FIX: Ensure ringtone is fully stopped
// //     try {
// //       InCallManager.stopRingtone();
// //       Vibration.cancel();
// //       InCallManager.stop(); // Force stop audio session
// //     } catch (e) {
// //       console.log('Cleanup error:', e);
// //     }
// //   }

// //   return () => {
// //     stopEverything();
// //   };
// // }, [visible]);

//   // =========================
//   // CLEANUP
//   // =========================

//   // const stopEverything = () => {
//   //   try {

//   //     Animated.timing(pulseAnim).stop?.();

//   //     Vibration.cancel();

//   //     InCallManager.stopRingtone();

//   //     hasStartedRef.current = false;

//   //   } catch (e) {
//   //     console.log('Cleanup error:', e);
//   //   }
//   // };

//   // =========================
//   // EFFECT
//   // =========================

//   // useEffect(() => {

//   //   if (visible && !hasStartedRef.current) {

//   //     console.log('[IncomingCallModal] OPENING');

//   //     hasStartedRef.current = true;

//   //     hasHandledActionRef.current = false;

//   //     setLoadingAction(null);

//   //     // Start ringtone
//   //     try {
//   //       InCallManager.startRingtone('_BUNDLE_');
//   //     } catch (e) {
//   //       console.log('Ringtone error:', e);
//   //     }

//   //     // Start vibration
//   //     Vibration.vibrate([0, 600, 400], true);

//   //     // Entrance animation
//   //     Animated.parallel([
//   //       Animated.timing(fadeAnim, {
//   //         toValue: 1,
//   //         duration: 250,
//   //         useNativeDriver: true,
//   //       }),

//   //       Animated.spring(scaleAnim, {
//   //         toValue: 1,
//   //         friction: 7,
//   //         tension: 40,
//   //         useNativeDriver: true,
//   //       }),
//   //     ]).start();

//   //     // Pulse loop
//   //     Animated.loop(
//   //       Animated.sequence([
//   //         Animated.timing(pulseAnim, {
//   //           toValue: 1.06,
//   //           duration: 900,
//   //           easing: Easing.linear,
//   //           useNativeDriver: true,
//   //         }),

//   //         Animated.timing(pulseAnim, {
//   //           toValue: 1,
//   //           duration: 900,
//   //           easing: Easing.linear,
//   //           useNativeDriver: true,
//   //         }),
//   //       ])
//   //     ).start();
//   //   }

//   //   if (!visible) {

//   //     stopEverything();

//   //     fadeAnim.setValue(0);

//   //     scaleAnim.setValue(0.9);

//   //     pulseAnim.setValue(1);

//   //     setLoadingAction(null);
//   //   }

//   //   return () => {
//   //     stopEverything();
//   //   };

//   // }, [visible]);

// useEffect(() => {
//   if (visible) {
//     console.log('========== INCOMING CALL DETAILS from icm_call page ==========');
//     console.log('📞 Caller Name:', callerName || 'Unknown Caller');
//     console.log('🖼️ Profile Image:', profileImage || 'No profile image');
//     console.log('🎥 Call Type:', isVideoCall ? 'Video Call' : 'Voice Call');
//     console.log('🔗 Full Image URL:', profileImage 
//       ? `${API_ROUTE_IMAGE}${profileImage}` 
//       : 'https://via.placeholder.com/150');
//     console.log('==========================================');
//   }
// }, [visible, callerName, profileImage, isVideoCall]);

//   // =========================
//   // BUTTON ANIMATION
//   // =========================

//   const animateButton = (button, value) => {

//     Animated.spring(
//       button === 'accept'
//         ? buttonScaleAccept
//         : buttonScaleReject,
//       {
//         toValue: value,
//         friction: 5,
//         tension: 50,
//         useNativeDriver: true,
//       }
//     ).start();
//   };

  
//   const handleAccept = async () => {
//   if (hasHandledActionRef.current) return;
//   hasHandledActionRef.current = true;
//   setLoadingAction('accept');

//   // 🔴 CRITICAL FIX: Stop ringtone FIRST
//   try {
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//     InCallManager.stop(); // Force stop audio session
//   } catch (e) {
//     console.log('Stop ringtone error:', e);
//   }

//   Animated.parallel([
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 150,
//       useNativeDriver: true,
//     }),
//     Animated.timing(scaleAnim, {
//       toValue: 0.92,
//       duration: 150,
//       useNativeDriver: true,
//     }),
//   ]).start();

//   setTimeout(() => {
//     onAccept?.();
//   }, 150);
// };

// // Update handleReject
// const handleReject = async () => {
//   if (hasHandledActionRef.current) return;
//   hasHandledActionRef.current = true;
//   setLoadingAction('reject');

//   // 🔴 CRITICAL FIX: Stop ringtone FIRST
//   try {
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//     InCallManager.stop(); // Force stop audio session
//   } catch (e) {
//     console.log('Stop ringtone error:', e);
//   }

//   Animated.parallel([
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 150,
//       useNativeDriver: true,
//     }),
//     Animated.timing(scaleAnim, {
//       toValue: 0.92,
//       duration: 150,
//       useNativeDriver: true,
//     }),
//   ]).start();

//   setTimeout(() => {
//     onReject?.();
//   }, 150);
// };

// // Add this helper function at the top of IncomingCallModal
// // const stopEverything = () => {
// //   try {
// //     Animated.timing(pulseAnim).stop?.();
// //     Vibration.cancel();
    
// //     // 🔴 CRITICAL FIX for Android 14+:
// //     // Stop ringtone AND stop audio session
// //     InCallManager.stopRingtone();
// //     InCallManager.stop({ busytone: '_BUNDLE_' }); // Force stop
    
// //     // For Android 14+, sometimes need to reset the audio session
// //     if (Platform.OS === 'android') {
// //       setTimeout(() => {
// //         // Re-initialize audio session if needed
// //         InCallManager.start({ media: 'audio' });
// //         setTimeout(() => {
// //           InCallManager.stop();
// //         }, 100);
// //       }, 100);
// //     }
    
// //     hasStartedRef.current = false;
// //   } catch (e) {
// //     console.log('Cleanup error:', e);
// //   }
// // };

// const stopEverything = () => {
//   try {
//     hasStartedRef.current = false; // set FIRST so the timeout guard sees it

//     if (ringtoneTimeoutRef.current) {
//       clearTimeout(ringtoneTimeoutRef.current);
//       ringtoneTimeoutRef.current = null;
//     }

//     Animated.timing(pulseAnim).stop?.();
//     Vibration.cancel();
//     InCallManager.stopRingtone();
//     InCallManager.stop({ busytone: '_BUNDLE_' });

//     if (Platform.OS === 'android') {
//       setTimeout(() => {
//         InCallManager.start({ media: 'audio' });
//         setTimeout(() => InCallManager.stop(), 100);
//       }, 100);
//     }
//   } catch (e) {
//     console.log('Cleanup error:', e);
//   }
// };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="none"
//       statusBarTranslucent
//       hardwareAccelerated
//       onRequestClose={handleReject}
//     >

//       <Animated.View
//         style={[
//           styles.overlay,
//           {
//             opacity: fadeAnim,
//           },
//         ]}
//       >

//         <Animated.View
//           style={[
//             styles.container,
//             {
//               transform: [
//                 { scale: scaleAnim },
//               ],
//             },
//           ]}
//         >

//           <LinearGradient
//             colors={['#101522', '#1A2238', '#0B1020']}
//             style={styles.gradient}
//           >

//             {/* CALL TYPE */}
//             <Text style={styles.callText}>
//               {isVideoCall
//                 ? 'Incoming Video Call'
//                 : 'Incoming Voice Call'}
//             </Text>

//             {/* PROFILE */}
//             <Animated.View
//               style={[
//                 styles.avatarWrapper,
//                 {
//                   transform: [{ scale: pulseAnim }],
//                 },
//               ]}
//             >

//               <Image
//                 source={{
//                   uri: profileImage
//                     ? `${profileImage}`
//                     : 'https://via.placeholder.com/150',
//                 }}
//                 style={styles.avatar}
//               />

//             </Animated.View>

//             {/* NAME */}
//             <Text style={styles.name}>
//               {callerName || 'Unknown Caller'}
//             </Text>

//             {/* BUTTONS */}
//             <View style={styles.buttonsRow}>

//               {/* REJECT */}
//               <TouchableOpacity
//                 activeOpacity={1}
//                 disabled={loadingAction !== null}
//                 onPress={handleReject}
//                 onPressIn={() => animateButton('reject', 0.85)}
//                 onPressOut={() => animateButton('reject', 1)}
//               >

//                 <Animated.View
//                   style={[
//                     styles.rejectButton,
//                     {
//                       transform: [
//                         { scale: buttonScaleReject },
//                       ],
//                     },
//                   ]}
//                 >

//                   {loadingAction === 'reject'
//                     ? (
//                       <ActivityIndicator color="white" />
//                     )
//                     : (
//                       <Icon
//                         name="call-end"
//                         color="white"
//                         size={32}
//                       />
//                     )}

//                 </Animated.View>

//                 <Text style={styles.buttonText}>
//                   Decline
//                 </Text>

//               </TouchableOpacity>

//               {/* ACCEPT */}
//               <TouchableOpacity
//                 activeOpacity={1}
//                 disabled={loadingAction !== null}
//                 onPress={handleAccept}
//                 onPressIn={() => animateButton('accept', 0.85)}
//                 onPressOut={() => animateButton('accept', 1)}
//               >

//                 <Animated.View
//                   style={[
//                     styles.acceptButton,
//                     {
//                       transform: [
//                         { scale: buttonScaleAccept },
//                       ],
//                     },
//                   ]}
//                 >

//                   {loadingAction === 'accept'
//                     ? (
//                       <ActivityIndicator color="white" />
//                     )
//                     : (
//                       <Icon
//                         name={isVideoCall ? 'videocam' : 'call'}
//                         color="white"
//                         size={32}
//                       />
//                     )}

//                 </Animated.View>

//                 <Text style={styles.buttonText}>
//                   Accept
//                 </Text>

//               </TouchableOpacity>

//             </View>

//           </LinearGradient>

//         </Animated.View>

//       </Animated.View>

//     </Modal>
//   );
// };

// export default memo(IncomingCallModal);

// const styles = StyleSheet.create({

//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.82)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },

//   container: {
//     width: width * 0.88,
//     borderRadius: 30,
//     overflow: 'hidden',
//   },

//   gradient: {
//     paddingVertical: 40,
//     paddingHorizontal: 25,
//     alignItems: 'center',
//   },

//   callText: {
//     color: '#B8C5D6',
//     fontSize: 18,
//     marginBottom: 30,
//     fontWeight: '600',
//   },

//   avatarWrapper: {
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#ffffff22',
//   },

//   name: {
//     color: 'white',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 40,
//     textAlign: 'center',
//   },

//   buttonsRow: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-evenly',
//   },

//   rejectButton: {
//     width: 78,
//     height: 78,
//     borderRadius: 39,
//     backgroundColor: '#E53935',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   acceptButton: {
//     width: 78,
//     height: 78,
//     borderRadius: 39,
//     backgroundColor: '#43A047',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   buttonText: {
//     color: 'white',
//     marginTop: 10,
//     fontSize: 15,
//     fontWeight: '600',
//     textAlign: 'center',
//   },

// });

import React, { useEffect, useRef, useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Vibration,
  Platform,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InCallManager from 'react-native-incall-manager';

import { API_ROUTE_IMAGE } from '../api_routing/api';

const { width } = Dimensions.get('window');

const IncomingCallModal = ({
  visible,
  onAccept,
  onReject,
  profileImage,
  callerName,
  isVideoCall = false,
}) => {

  const [loadingAction, setLoadingAction] = useState(null);

  // =========================
  // REFS
  // =========================

  const hasStartedRef = useRef(false);
  const hasHandledActionRef = useRef(false);
  const ringtoneTimeoutRef = useRef(null); // 🔴 NEW: lets us cancel the delayed startRingtone call

  // =========================
  // ANIMATIONS
  // =========================

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAccept = useRef(new Animated.Value(1)).current;
  const buttonScaleReject = useRef(new Animated.Value(1)).current;

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${API_ROUTE_IMAGE}${imagePath}`;
  };

  // =========================
  // CLEANUP (declared before the effect that references it is *run*,
  // which is safe since effects fire after the whole render commits —
  // but we still define it above the effect for clarity)
  // =========================

  const stopEverything = () => {
    try {
      // 🔴 CRITICAL: flip this FIRST. The delayed startRingtone timeout
      // below checks this flag before it fires, so setting it here — even
      // if the timeout is somehow still pending — guarantees it becomes a
      // no-op.
      hasStartedRef.current = false;

      if (ringtoneTimeoutRef.current) {
        clearTimeout(ringtoneTimeoutRef.current);
        ringtoneTimeoutRef.current = null;
      }

      // 🔴 FIX: Animated.timing(pulseAnim).stop?.() was wrong — it built a
      // brand-new, never-started animation and called .stop() on THAT,
      // which throws "Cannot read property 'getValue' of null" because it
      // never had a valid internal config. stopAnimation() is the correct
      // API for halting whatever animation (the Animated.loop) is actually
      // running on this Value.
      try {
        pulseAnim.stopAnimation();
      } catch (e) {
        console.log('pulseAnim stop error:', e);
      }
      Vibration.cancel();

      InCallManager.stopRingtone();
      InCallManager.stop({ busytone: '_BUNDLE_' });

      if (Platform.OS === 'android') {
        setTimeout(() => {
          InCallManager.start({ media: 'audio' });
          setTimeout(() => {
            InCallManager.stop();
          }, 100);
        }, 100);
      }
    } catch (e) {
      console.log('Cleanup error:', e);
    }
  };

  // =========================
  // SINGLE consolidated visible-effect (previously duplicated twice)
  // =========================

  useEffect(() => {
    if (visible && !hasStartedRef.current) {
      console.log('[IncomingCallModal] OPENING');
      hasStartedRef.current = true;
      hasHandledActionRef.current = false;
      setLoadingAction(null);

      try {
        InCallManager.stopRingtone();
        Vibration.cancel();

        // 🔴 FIX: store the timeout id so it can be cancelled, and guard
        // the callback itself against firing after accept/reject/unmount.
        ringtoneTimeoutRef.current = setTimeout(() => {
          if (hasStartedRef.current) {
            InCallManager.startRingtone('_BUNDLE_');
          }
          ringtoneTimeoutRef.current = null;
        }, 200);
      } catch (e) {
        console.log('Ringtone error:', e);
      }

      Vibration.vibrate([500, 400, 500, 400], true);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    if (!visible) {
      stopEverything();
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      pulseAnim.setValue(1);
      setLoadingAction(null);
    }

    return () => {
      stopEverything();
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      console.log('========== INCOMING CALL DETAILS ==========');
      console.log('📞 Caller Name:', callerName || 'Unknown Caller');
      console.log('🖼️ Profile Image:', profileImage || 'No profile image');
      console.log('🎥 Call Type:', isVideoCall ? 'Video Call' : 'Voice Call');
      console.log('==========================================');
    }
  }, [visible, callerName, profileImage, isVideoCall]);

  // =========================
  // BUTTON ANIMATION
  // =========================

  const animateButton = (button, value) => {
    Animated.spring(
      button === 'accept' ? buttonScaleAccept : buttonScaleReject,
      {
        toValue: value,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }
    ).start();
  };

  const handleAccept = async () => {
    if (hasHandledActionRef.current) return;
    hasHandledActionRef.current = true;
    setLoadingAction('accept');

    // Stop ringtone FIRST, and also cancel any pending delayed start.
    hasStartedRef.current = false;
    if (ringtoneTimeoutRef.current) {
      clearTimeout(ringtoneTimeoutRef.current);
      ringtoneTimeoutRef.current = null;
    }
    try {
      InCallManager.stopRingtone();
      Vibration.cancel();
      InCallManager.stop();
    } catch (e) {
      console.log('Stop ringtone error:', e);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      onAccept?.();
    }, 150);
  };

  const handleReject = async () => {
    if (hasHandledActionRef.current) return;
    hasHandledActionRef.current = true;
    setLoadingAction('reject');

    hasStartedRef.current = false;
    if (ringtoneTimeoutRef.current) {
      clearTimeout(ringtoneTimeoutRef.current);
      ringtoneTimeoutRef.current = null;
    }
    try {
      InCallManager.stopRingtone();
      Vibration.cancel();
      InCallManager.stop();
    } catch (e) {
      console.log('Stop ringtone error:', e);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      onReject?.();
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={handleReject}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#101522', '#1A2238', '#0B1020']}
            style={styles.gradient}
          >
            <Text style={styles.callText}>
              {isVideoCall ? 'Incoming Video Call' : 'Incoming Voice Call'}
            </Text>

            <Animated.View
              style={[
                styles.avatarWrapper,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Image
                source={{
                  uri: profileImage
                    ? `${profileImage}`
                    : 'https://via.placeholder.com/150',
                }}
                style={styles.avatar}
              />
            </Animated.View>

            <Text style={styles.name}>
              {callerName || 'Unknown Caller'}
            </Text>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                activeOpacity={1}
                disabled={loadingAction !== null}
                onPress={handleReject}
                onPressIn={() => animateButton('reject', 0.85)}
                onPressOut={() => animateButton('reject', 1)}
              >
                <Animated.View
                  style={[
                    styles.rejectButton,
                    { transform: [{ scale: buttonScaleReject }] },
                  ]}
                >
                  {loadingAction === 'reject' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Icon name="call-end" color="white" size={32} />
                  )}
                </Animated.View>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                disabled={loadingAction !== null}
                onPress={handleAccept}
                onPressIn={() => animateButton('accept', 0.85)}
                onPressOut={() => animateButton('accept', 1)}
              >
                <Animated.View
                  style={[
                    styles.acceptButton,
                    { transform: [{ scale: buttonScaleAccept }] },
                  ]}
                >
                  {loadingAction === 'accept' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Icon
                      name={isVideoCall ? 'videocam' : 'call'}
                      color="white"
                      size={32}
                    />
                  )}
                </Animated.View>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default memo(IncomingCallModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: width * 0.88,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  callText: {
    color: '#B8C5D6',
    fontSize: 18,
    marginBottom: 30,
    fontWeight: '600',
  },
  avatarWrapper: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff22',
  },
  name: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  rejectButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#43A047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});