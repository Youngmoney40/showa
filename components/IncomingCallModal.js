
// import React, { useEffect, useRef, useState } from 'react';
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
// import { API_ROUTE_IMAGE } from '../api_routing/api';
// import InCallManager from 'react-native-incall-manager';

// const { width } = Dimensions.get('window');

// const IncomingCallModal = ({
//   visible,
//   onAccept,
//   onReject,
//   profileImage,
//   callerName,
//   isVideoCall = false,
// }) => {
//   const [buttonPressed, setButtonPressed] = useState(null);
//   const [isAccepting, setIsAccepting] = useState(false);
//   const [isRejecting, setIsRejecting] = useState(false);
  
  
//   const hasCleanedUp = useRef(false);
  
//   // Animation values
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.9)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const buttonScale1 = useRef(new Animated.Value(1)).current;
//   const buttonScale2 = useRef(new Animated.Value(1)).current;

//   const isCallShowing = useRef(false);

//   // Centralized cleanup function
//   const stopRingingAndVibration = () => {
//     if (hasCleanedUp.current) return;
    
//     console.log('[IncomingCallModal] Stopping ringtone and vibration');
//     InCallManager.stopRingtone();
//     Vibration.cancel();
//     hasCleanedUp.current = true;
//   };

//   // Ringtone handling
//   useEffect(() => {
//     if (visible) {
//       // Reset cleanup flag when becoming
//       hasCleanedUp.current = false;
      
//       // Start ringtone
//       console.log('[IncomingCallModal] Starting ringtone');
//       if (Platform.OS === 'android') {
//         InCallManager.startRingtone('_BUNDLE_');
//       } else {
//         InCallManager.startRingtone('_BUNDLE_');
//       }
      
//       // Vibrate with professional pattern
//       Vibration.vibrate([0, 500, 1000, 500], true);

//       // Start entrance animations
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 20,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           friction: 10,
//           tension: 50,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnim, {
//           toValue: 1,
//           duration: 300,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]).start();

//       // Start pulse animation for avatar
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulseAnim, {
//             toValue: 1.1,
//             duration: 1000,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseAnim, {
//             toValue: 1,
//             duration: 1000,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();

//       // Start rotation animation for video badge
//       Animated.loop(
//         Animated.timing(rotateAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         })
//       ).start();

//     } else {
//       // Stop immediately when modal becomes invisible
//       stopRingingAndVibration();
      
//       // Reset states
//       setButtonPressed(null);
//       setIsAccepting(false);
//       setIsRejecting(false);
      
//       // Reset animations
//       pulseAnim.setValue(1);
//       rotateAnim.setValue(0);
//       fadeAnim.setValue(0);
//       scaleAnim.setValue(0.9);
//       slideAnim.setValue(0);
//     }

//     // Cleanup on unmount
//     return () => {
//       stopRingingAndVibration();
//     };
//   }, [visible]);

//   // Button animations
//   const handlePressIn = (button) => {
//     Animated.spring(button === 'accept' ? buttonScale1 : buttonScale2, {
//       toValue: 0.85,
//       friction: 5,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = (button) => {
//     Animated.spring(button === 'accept' ? buttonScale1 : buttonScale2, {
//       toValue: 1,
//       friction: 5,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Optimized accept handler
//   const handleAccept = () => {
//     // Prevent multiple taps
//     if (buttonPressed === 'accept' || isAccepting) return;
    
//     console.log('[IncomingCallModal] Accepting call - stopping ringtone');
    
//     // Set loading state
//     setIsAccepting(true);
//     setButtonPressed('accept');
    
//     // STOP RINGTONE IMMEDIATELY - before any other operations
//     stopRingingAndVibration();
    
//     // INSTANT button press animation
//     Animated.parallel([
//       Animated.timing(buttonScale1, {
//         toValue: 0.7,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Call onAccept (parent will handle navigation)
//     onAccept();
//   };

//   // Optimized reject handler
//   const handleReject = () => {
//     // Prevent multiple taps
//     if (buttonPressed === 'reject' || isRejecting) return;
    
//     console.log('[IncomingCallModal] Rejecting call - stopping ringtone');
    
//     // Set loading state
//     setIsRejecting(true);
//     setButtonPressed('reject');
    
//     // STOP RINGTONE IMMEDIATELY
//     stopRingingAndVibration();
    
//     // INSTANT button press animation
//     Animated.parallel([
//       Animated.timing(buttonScale2, {
//         toValue: 0.7,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Call onReject
//     onReject();
//   };

//   const spin = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   const slideIn = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [50, 0],
//   });

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="none"
//       onRequestClose={handleReject}
//       statusBarTranslucent
//     >
//       <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
//         <Animated.View
//           style={[
//             styles.modalContainer,
//             {
//               transform: [
//                 { scale: scaleAnim },
//                 { translateY: slideIn },
//               ],
//             },
//           ]}
//         >
//           <LinearGradient
//             colors={
//               isVideoCall
//                 ? ['#1a2a3a', '#0d1b2a', '#0a0f1a']
//                 : ['#0f2027', '#203a43', '#2c5364']
//             }
//             style={styles.gradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             {/* Animated background pattern */}
//             <View style={styles.backgroundPattern}>
//               {[...Array(5)].map((_, i) => (
//                 <Animated.View
//                   key={i}
//                   style={[
//                     styles.patternCircle,
//                     {
//                       transform: [{ rotate: spin }],
//                       opacity: 0.1 - i * 0.02,
//                       right: -30 + i * 20,
//                       bottom: -30 + i * 20,
//                     },
//                   ]}
//                 />
//               ))}
//             </View>

//             <View style={styles.modalContent}>
//               <Animated.Text style={[styles.incomingCallText, { opacity: fadeAnim }]}>
//                 {isVideoCall ? '📱 Incoming Video Call' : '📞 Incoming Voice Call'}
//               </Animated.Text>

//               <View style={styles.callerInfo}>
//                 <Animated.View
//                   style={[
//                     styles.avatarContainer,
//                     { transform: [{ scale: pulseAnim }] },
//                   ]}
//                 >
//                   <LinearGradient
//                     colors={
//                       isVideoCall
//                         ? ['#4a90e2', '#357abd', '#2a5f8a']
//                         : ['#38a169', '#2f855a', '#276749']
//                     }
//                     style={styles.avatarBorder}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                   >
//                     <View style={styles.modalAvatar}>
//                       <Image
//                         source={{
//                           uri: profileImage
//                             ? `${API_ROUTE_IMAGE}${profileImage}`
//                             : 'https://via.placeholder.com/100',
//                         }}
//                         style={styles.modalAvatarImage}
//                         resizeMode="cover"
//                       />
//                     </View>
//                   </LinearGradient>
                  
//                   {isVideoCall && (
//                     <Animated.View
//                       style={[
//                         styles.videoBadge,
//                         { transform: [{ rotate: spin }] },
//                       ]}
//                     >
//                       <Icon name="videocam" size={18} color="white" />
//                     </Animated.View>
//                   )}
//                 </Animated.View>

//                 <Animated.Text style={[styles.modalCallerName, { opacity: fadeAnim }]}>
//                   {callerName || 'Caller'}
//                 </Animated.Text>
                
//                 <Animated.View style={[styles.callTypeContainer, { opacity: fadeAnim }]}>
//                   <View style={styles.callTypeIndicator}>
//                     <Icon 
//                       name={isVideoCall ? "videocam" : "call"} 
//                       size={16} 
//                       color={isVideoCall ? "#4a90e2" : "#38a169"} 
//                     />
//                     <Text style={styles.modalCallType}>
//                       {isVideoCall ? 'Video Call' : 'Voice Call'}
//                     </Text>
//                   </View>
//                 </Animated.View>
//               </View>

//               <View style={styles.modalButtons}>
//                 <TouchableOpacity
//                   style={styles.rejectButton}
//                   onPress={handleReject}
//                   onPressIn={() => handlePressIn('reject')}
//                   onPressOut={() => handlePressOut('reject')}
//                   activeOpacity={1}
//                   disabled={buttonPressed !== null}
//                 >
//                   <Animated.View
//                     style={[
//                       styles.rejectButtonInner,
//                       { transform: [{ scale: buttonScale2 }] },
//                     ]}
//                   >
//                     <LinearGradient
//                       colors={['#e53e3e', '#c53030', '#9b2c2c']}
//                       style={styles.buttonGradient}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 1 }}
//                     >
//                       {isRejecting ? (
//                         <ActivityIndicator size="small" color="white" />
//                       ) : (
//                         <Icon name="call-end" size={30} color="white" />
//                       )}
//                     </LinearGradient>
//                   </Animated.View>
//                   <Text style={styles.buttonText}>
//                     {isRejecting ? 'Declining...' : 'Decline'}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.acceptButton}
//                   onPress={handleAccept}
//                   onPressIn={() => handlePressIn('accept')}
//                   onPressOut={() => handlePressOut('accept')}
//                   activeOpacity={1}
//                   disabled={buttonPressed !== null}
//                 >
//                   <Animated.View
//                     style={[
//                       styles.acceptButtonInner,
//                       { transform: [{ scale: buttonScale1 }] },
//                     ]}
//                   >
//                     <LinearGradient
//                       colors={isVideoCall 
//                         ? ['#4a90e2', '#357abd', '#2a5f8a']
//                         : ['#38a169', '#2f855a', '#276749']
//                       }
//                       style={styles.buttonGradient}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 1 }}
//                     >
//                       {isAccepting ? (
//                         <ActivityIndicator size="small" color="white" />
//                       ) : (
//                         <Icon 
//                           name={isVideoCall ? "videocam" : "call"} 
//                           size={30} 
//                           color="white" 
//                         />
//                       )}
//                     </LinearGradient>
//                   </Animated.View>
//                   <Text style={styles.buttonText}>
//                     {isAccepting ? 'Connecting...' : 'Accept'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </LinearGradient>
//         </Animated.View>
//       </Animated.View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: width * 0.9,
//     maxWidth: 400,
//     borderRadius: 28,
//     overflow: 'hidden',
//     elevation: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.44,
//     shadowRadius: 10.32,
//   },
//   gradient: {
//     position: 'relative',
//   },
//   backgroundPattern: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     overflow: 'hidden',
//   },
//   patternCircle: {
//     position: 'absolute',
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: 'white',
//     opacity: 0.05,
//   },
//   modalContent: {
//     padding: 30,
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   incomingCallText: {
//     fontSize: 26,
//     color: 'white',
//     fontWeight: '700',
//     marginBottom: 25,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//     letterSpacing: 0.5,
//   },
//   callerInfo: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   avatarContainer: {
//     marginBottom: 20,
//     position: 'relative',
//   },
//   avatarBorder: {
//     padding: 3,
//     borderRadius: 63,
//   },
//   modalAvatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     backgroundColor: '#4a5568',
//     borderWidth: 3,
//     borderColor: 'rgba(255,255,255,0.3)',
//     overflow: 'hidden',
//   },
//   modalAvatarImage: {
//     width: '100%',
//     height: '100%',
//   },
//   videoBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#4a90e2',
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: 'white',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   modalCallerName: {
//     fontSize: 28,
//     color: 'white',
//     fontWeight: '700',
//     marginBottom: 10,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   callTypeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   callTypeIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   modalCallType: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     marginLeft: 8,
//     fontWeight: '500',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     paddingHorizontal: 10,
//   },
//   rejectButton: {
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   acceptButton: {
//     alignItems: 'center',
//     marginLeft: 20,
//   },
//   rejectButtonInner: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     overflow: 'hidden',
//   },
//   acceptButtonInner: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     overflow: 'hidden',
//   },
//   buttonGradient: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: '600',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
// });

// export default IncomingCallModal;


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

  // =========================
  // ANIMATIONS
  // =========================

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAccept = useRef(new Animated.Value(1)).current;
  const buttonScaleReject = useRef(new Animated.Value(1)).current;

  // =========================
  // CLEANUP
  // =========================

  const stopEverything = () => {
    try {

      Animated.timing(pulseAnim).stop?.();

      Vibration.cancel();

      InCallManager.stopRingtone();

      hasStartedRef.current = false;

    } catch (e) {
      console.log('Cleanup error:', e);
    }
  };

  // =========================
  // EFFECT
  // =========================

  useEffect(() => {

    if (visible && !hasStartedRef.current) {

      console.log('[IncomingCallModal] OPENING');

      hasStartedRef.current = true;

      hasHandledActionRef.current = false;

      setLoadingAction(null);

      // Start ringtone
      try {
        InCallManager.startRingtone('_BUNDLE_');
      } catch (e) {
        console.log('Ringtone error:', e);
      }

      // Start vibration
      Vibration.vibrate([0, 600, 400], true);

      // Entrance animation
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

      // Pulse loop
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
    console.log('========== INCOMING CALL DETAILS from icm_call page ==========');
    console.log('📞 Caller Name:', callerName || 'Unknown Caller');
    console.log('🖼️ Profile Image:', profileImage || 'No profile image');
    console.log('🎥 Call Type:', isVideoCall ? 'Video Call' : 'Voice Call');
    console.log('🔗 Full Image URL:', profileImage 
      ? `${API_ROUTE_IMAGE}${profileImage}` 
      : 'https://via.placeholder.com/150');
    console.log('==========================================');
  }
}, [visible, callerName, profileImage, isVideoCall]);

  // =========================
  // BUTTON ANIMATION
  // =========================

  const animateButton = (button, value) => {

    Animated.spring(
      button === 'accept'
        ? buttonScaleAccept
        : buttonScaleReject,
      {
        toValue: value,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }
    ).start();
  };

  // =========================
  // ACCEPT
  // =========================

  const handleAccept = async () => {

    if (hasHandledActionRef.current) return;

    hasHandledActionRef.current = true;

    setLoadingAction('accept');

    stopEverything();

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

  // =========================
  // REJECT
  // =========================

  const handleReject = async () => {

    if (hasHandledActionRef.current) return;

    hasHandledActionRef.current = true;

    setLoadingAction('reject');

    stopEverything();

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
              transform: [
                { scale: scaleAnim },
              ],
            },
          ]}
        >

          <LinearGradient
            colors={['#101522', '#1A2238', '#0B1020']}
            style={styles.gradient}
          >

            {/* CALL TYPE */}
            <Text style={styles.callText}>
              {isVideoCall
                ? 'Incoming Video Call'
                : 'Incoming Voice Call'}
            </Text>

            {/* PROFILE */}
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
                    ? `${API_ROUTE_IMAGE}${profileImage}`
                    : 'https://via.placeholder.com/150',
                }}
                style={styles.avatar}
              />

            </Animated.View>

            {/* NAME */}
            <Text style={styles.name}>
              {callerName || 'Unknown Caller'}
            </Text>

            {/* BUTTONS */}
            <View style={styles.buttonsRow}>

              {/* REJECT */}
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
                    {
                      transform: [
                        { scale: buttonScaleReject },
                      ],
                    },
                  ]}
                >

                  {loadingAction === 'reject'
                    ? (
                      <ActivityIndicator color="white" />
                    )
                    : (
                      <Icon
                        name="call-end"
                        color="white"
                        size={32}
                      />
                    )}

                </Animated.View>

                <Text style={styles.buttonText}>
                  Decline
                </Text>

              </TouchableOpacity>

              {/* ACCEPT */}
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
                    {
                      transform: [
                        { scale: buttonScaleAccept },
                      ],
                    },
                  ]}
                >

                  {loadingAction === 'accept'
                    ? (
                      <ActivityIndicator color="white" />
                    )
                    : (
                      <Icon
                        name={isVideoCall ? 'videocam' : 'call'}
                        color="white"
                        size={32}
                      />
                    )}

                </Animated.View>

                <Text style={styles.buttonText}>
                  Accept
                </Text>

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