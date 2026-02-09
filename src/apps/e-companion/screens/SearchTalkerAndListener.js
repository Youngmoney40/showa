// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Animated,
//   Easing,
//   Dimensions,
//   StatusBar,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import Colors from '../../globalshared/constants/colors';
// import LottieView from 'lottie-react-native';

// const { width, height } = Dimensions.get('window');

// const TalkerSearchScreen = ({ navigation }) => { // Added navigation prop for handleConnect
//   const [searchStatus, setSearchStatus] = useState('searching'); 
//   const [searchTextIndex, setSearchTextIndex] = useState(0);
//   const [availableTalkers, setAvailableTalkers] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentPopup, setCurrentPopup] = useState(null);
//   const [popupIndex, setPopupIndex] = useState(0);

//   const rotationAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideUpAnim = useRef(new Animated.Value(100)).current;
//   const progressAnim = useRef(new Animated.Value(0)).current;

//   const searchTexts = [
//     "Searching for talkers in your area...",
//     "Finding available listeners nearby...",
//     "Connecting you with caring companions...",
//     "Looking for the perfect match for you..."
//   ];

//   const mockTalkers = [
//     {
//       id: 1,
//       name: 'Emaka Johnson',
//       rating: 4.9,
//       specialty: 'Relationship Coach',
//       responseTime: '2 min',
//       avatar: '👩‍💼',
//       online: true,
//       distance: '0.8 km away',
//     },
//     {
//       id: 2,
//       name: 'David Chen',
//       rating: 4.8,
//       specialty: 'Career Advisor',
//       responseTime: '5 min',
//       avatar: '👨‍💻',
//       online: true,
//       distance: '1.2 km away',
//     },
//     {
//       id: 3,
//       name: 'Sarah Wilson',
//       rating: 5.0,
//       specialty: 'Mindfulness Expert',
//       responseTime: '3 min',
//       avatar: '👩‍⚕️',
//       online: true,
//       distance: '0.5 km away',
//     },
//     {
//       id: 4,
//       name: 'Mike Rodriguez',
//       rating: 4.7,
//       specialty: 'Stress Management',
//       responseTime: '1 min',
//       avatar: '👨‍🏫',
//       online: true,
//       distance: '0.3 km away',
//     },
//   ];

//   // Optimized search animation - display popup after exactly 2 seconds of searching
//   useEffect(() => {
//     console.log('Starting optimized search animation...');
    
//     // Pre-load talkers immediately
//     setAvailableTalkers(mockTalkers);
    
//     // Dynamic progress bar animation over 2 seconds
//     Animated.timing(progressAnim, {
//       toValue: 1,
//       duration: 2000,
//       easing: Easing.linear,
//       useNativeDriver: false,
//     }).start();
    
//     // Faster rotation animation
//     const rotateAnimation = Animated.loop(
//       Animated.timing(rotationAnim, {
//         toValue: 1,
//         duration: 1500, // Reduced from 2000 to 1200ms
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     );
//     rotateAnimation.start();

//     // Faster text rotation every 2 seconds (reduced from 3 seconds)
//     const textInterval = setInterval(() => {
//       setSearchTextIndex((prev) => (prev + 1) % searchTexts.length);
//     }, 2000);

//     // Show first popup after exactly 2 seconds of search
//     const popupTimer = setTimeout(() => {
//       console.log('2-second search timeout reached - starting popup sequence');
//       startPopupSequence();
//     }, 2000);

//     return () => {
//       rotateAnimation.stop();
//       clearInterval(textInterval);
//       clearTimeout(popupTimer);
//     };
//   }, []);

//   const startPopupSequence = () => {
//     console.log('Starting fast popup sequence with talkers:', mockTalkers.length);
//     showNextPopup();
//   };

//   const showNextPopup = () => {
//     console.log('Showing next popup, available:', availableTalkers.length);
    
//     if (availableTalkers.length === 0) return;

//     // Get the next talker in sequence
//     const nextIndex = popupIndex % availableTalkers.length;
//     const talker = availableTalkers[nextIndex];
//     console.log('Setting current popup:', talker.name);
    
//     setCurrentPopup(talker);
//     setPopupIndex(prev => prev + 1);
    
//     // Reset animations
//     fadeAnim.setValue(0);
//     slideUpAnim.setValue(100);
    
//     // Show popup with faster animation
//     setShowPopup(true);
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 200, // Reduced from 500 to 300ms
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideUpAnim, {
//         toValue: 0,
//         duration: 300, // Reduced from 500 to 300ms
//         easing: Easing.out(Easing.cubic),
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Auto hide after 6 seconds (reduced from 8 seconds) and show next
//     const nextPopupTimer = setTimeout(() => {
//       console.log('Auto-hiding popup and showing next');
//       hidePopup();
//     }, 6000);

//     return () => clearTimeout(nextPopupTimer);
//   };

//   const hidePopup = () => {
//     console.log('Hiding current popup');
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 100, // Reduced from 300 to 200ms
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideUpAnim, {
//         toValue: 100,
//         duration: 100, // Reduced from 300 to 200ms
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setShowPopup(false);
//       // Show next popup after shorter delay
//       setTimeout(() => {
//         showNextPopup();
//       }, 1000); // Reduced from 2000 to 1000ms
//     });
//   };

//   const handleConnect = (talker) => {
//     console.log('Connecting to:', talker.name);
//     navigation.navigate('CListenerProfile');
//     setSearchStatus('connecting');
//     // Handle connection logic here
//   };

//   const handleSkip = () => {
//     console.log('Skipping current talker');
//     hidePopup();
//   };

//   const rotateInterpolate = rotationAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   const progressWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor='#000' />
      
//       {/* Header */}
//       <LinearGradient
//         colors={Colors.primaryGradient}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <Text style={styles.headerTitle}>Finding a Talker </Text>
//         <Text style={styles.headerSubtitle}>Connect you with someone who cares</Text>
//       </LinearGradient>

//       {/* Main Search Area */}
//       <View style={styles.searchContainer}>
//         {/* Animated Search Icon */}
//         <View style={styles.searchIconContainer}>
//           <Animated.View 
//             style={[
//               styles.rotatingCircle,
//               { transform: [{ rotate: rotateInterpolate }] }
//             ]}
//           >
//             <View style={styles.circleDot} />
//           </Animated.View>
//           <View style={styles.searchIcon}>
//             <Icon name="person" size={40} color={Colors.primary} />
//           </View>
//         </View>

//         {/* Searching Text */}
//         <Text style={styles.searchingText}>
//           {searchTexts[searchTextIndex]}
//         </Text>

//         {/* Progress Bar */}
//         <View style={styles.progressContainer}>
//           <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
//         </View>

//         <Text style={styles.estimatedTime}>
//           Usually takes less than 30 seconds
//         </Text>
//       </View>

//       {/* Popup Notifications */}
//       {showPopup && currentPopup && (
//         <Animated.View 
//           style={[
//             styles.popupContainer,
//             {
//               opacity: fadeAnim,
//               transform: [{ translateY: slideUpAnim }],
//             }
//           ]}
//         >
//           <View style={styles.popup}>
//             <View style={styles.popupHeader}>
//               <Text style={styles.popupBadge}>🟢 ONLINE NOW</Text>
//               <Text style={styles.popupDistance}>{currentPopup.distance}</Text>
//             </View>
            
//             <View style={styles.popupContent}>
//               <Text style={styles.popupAvatar}>{currentPopup.avatar}</Text>
//               <View style={styles.popupInfo}>
//                 <Text style={styles.popupName}>{currentPopup.name}</Text>
//                 <Text style={styles.popupSpecialty}>{currentPopup.specialty}</Text>
//                 <View style={styles.popupRating}>
//                   <Icon name="star" size={14} color="#FFD700" />
//                   <Text style={styles.popupRatingText}>{currentPopup.rating}</Text>
//                   <Text style={styles.popupResponse}>• {currentPopup.responseTime} response</Text>
//                 </View>
//               </View>
//             </View>

//             <TouchableOpacity 
//               style={styles.connectButton}
//               onPress={() => handleConnect(currentPopup)}
//             >
//               <LinearGradient
//                 colors={Colors.primaryGradient}
//                 style={styles.connectButtonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Icon name="chatbubble-ellipses" size={20} color={Colors.white} />
//                 <Text style={styles.connectButtonText}>Connect to Talk</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity 
//             style={styles.skipButton}
//             onPress={handleSkip}
//           >
//             <Text style={styles.skipText}>Skip • Show other talkers</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       )}

      
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   header: {
//     padding: 24,
//     paddingTop: 40,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     marginTop:20,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: Colors.white,
//     marginBottom: 8,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: Colors.white,
//     opacity: 0.9,
//   },
//   searchContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 50,
//     marginTop:-100
    
//   },
//   searchIconContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 40,
//   },
//   rotatingCircle: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: 'rgba(255, 51, 102, 0.2)',
//     borderTopColor: Colors.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   circleDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: Colors.primary,
//     position: 'absolute',
//     top: -4,
//   },
//   searchIcon: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   searchingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.white,
//     textAlign: 'center',
//     marginBottom: 30,
//     lineHeight: 24,
//   },
//   progressContainer: {
//     width: '100%',
//     height: 6,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     borderRadius: 3,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: Colors.primary,
//     borderRadius: 3,
//   },
//   estimatedTime: {
//     fontSize: 14,
//     color: Colors.textTertiary,
//     textAlign: 'center',
//   },
//   popupContainer: {
//     position: 'absolute',
//     bottom: 100,
//     left: 20,
//     right: 20,
//     zIndex: 1000,
//   },
//   popup: {
//     backgroundColor: Colors.card,
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 51, 102, 0.1)',
//   },
//   popupHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   popupBadge: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#4CAF50',
//   },
//   popupDistance: {
//     fontSize: 12,
//     color: Colors.textTertiary,
//     fontWeight: '500',
//   },
//   popupContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   popupAvatar: {
//     fontSize: 40,
//     width: 60,
//     height: 60,
//     textAlign: 'center',
//     lineHeight: 60,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     borderRadius: 30,
//     marginRight: 16,
//   },
//   popupInfo: {
//     flex: 1,
//   },
//   popupName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: 4,
//   },
//   popupSpecialty: {
//     fontSize: 14,
//     color: Colors.primary,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   popupRating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   popupRatingText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//     marginLeft: 4,
//     marginRight: 8,
//   },
//   popupResponse: {
//     fontSize: 12,
//     color: Colors.textTertiary,
//   },
//   connectButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   connectButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//   },
//   connectButtonText: {
//     color: Colors.white,
//     fontSize: 16,
//     fontWeight: '700',
//     marginLeft: 8,
//   },
//   skipButton: {
//     alignItems: 'center',
//     marginTop: 12,
//     padding: 8,
//   },
//   skipText: {
//     fontSize: 14,
//     color: Colors.textTertiary,
//     fontWeight: '500',
//   },
//   bottomInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 20,
//     paddingBottom: 30,
//     backgroundColor: Colors.card,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   infoItem: {
//     alignItems: 'center',
//   },
//   infoText: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 4,
//     fontWeight: '500',
//   },
// });

// export default TalkerSearchScreen;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../globalshared/constants/colors';

const { width, height } = Dimensions.get('window');

const TalkerSearchScreen = ({navigation}) => {
  const [searchStatus, setSearchStatus] = useState('searching');
  const [searchTextIndex, setSearchTextIndex] = useState(0);
  const [availableTalkers, setAvailableTalkers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [popupIndex, setPopupIndex] = useState(0);

  const rotationAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const searchTexts = [
    "Searching for talkers in your areaj...",
    "Finding available listeners nearby...",
    "Connecting you with caring companions...",
    "Looking for the perfect match for you..."
  ];

  const mockTalkers = [
    {
      id: 1,
      name: 'Emaka Johnson',
      rating: 4.9,
      specialty: 'Relationship Coach',
      responseTime: '2 min',
      avatar: '👩‍💼',
      online: true,
      distance: '0.8 km away',
    },
    {
      id: 2,
      name: 'David Chen',
      rating: 4.8,
      specialty: 'Career Advisor',
      responseTime: '5 min',
      avatar: '👨‍💻',
      online: true,
      distance: '1.2 km away',
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      rating: 5.0,
      specialty: 'Mindfulness Expert',
      responseTime: '3 min',
      avatar: '👩‍⚕️',
      online: true,
      distance: '0.5 km away',
    },
    {
      id: 4,
      name: 'Mike Rodriguez',
      rating: 4.7,
      specialty: 'Stress Management',
      responseTime: '1 min',
      avatar: '👨‍🏫',
      online: true,
      distance: '0.3 km away',
    },
  ];

  // Progress bar animation
  useEffect(() => {
    console.log('Starting progress bar animation...');
    
    // Pre-load talkers immediately
    setAvailableTalkers(mockTalkers);
    
    // Start rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // Rotate search texts every 2 seconds
    const textInterval = setInterval(() => {
      setSearchTextIndex((prev) => (prev + 1) % searchTexts.length);
    }, 2000);

    // Start progress bar animation - 3 seconds total
    Animated.timing(progressAnim, {
      toValue: 1, // 0 to 1 for interpolation
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        console.log('Progress bar completed');
      }
    });

    // Check progress and show popup at 90% (2.7 seconds)
    const popupTimer = setTimeout(() => {
      console.log('90% progress reached - showing popup');
      startPopupSequence();
    }, 2700); // 90% of 3000ms = 2700ms

    return () => {
      rotateAnimation.stop();
      clearInterval(textInterval);
      clearTimeout(popupTimer);
      progressAnim.stopAnimation();
    };
  }, []);

  const startPopupSequence = () => {
    console.log('Starting popup sequence with talkers:', mockTalkers.length);
    showNextPopup();
  };

  const showNextPopup = () => {
    console.log('Showing next popup, available:', availableTalkers.length);
    
    if (availableTalkers.length === 0) return;

    // Get the next talker in sequence
    const nextIndex = popupIndex % availableTalkers.length;
    const talker = availableTalkers[nextIndex];
    console.log('Setting current popup:', talker.name);
    
    setCurrentPopup(talker);
    setPopupIndex(prev => prev + 1);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideUpAnim.setValue(100);
    
    // Show popup with animation
    setShowPopup(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after 6 seconds and show next
    const nextPopupTimer = setTimeout(() => {
      console.log('Auto-hiding popup and showing next');
      hidePopup();
    }, 6000);

    return () => clearTimeout(nextPopupTimer);
  };

  const hidePopup = () => {
    console.log('Hiding current popup');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPopup(false);
      // Show next popup after shorter delay
      setTimeout(() => {
        showNextPopup();
      }, 1000);
    });
  };

  const handleConnect = (talker) => {
    console.log('Connecting to:', talker.name);
    setSearchStatus('connecting');
    navigation.navigate('CListenerProfile')
    // Handle connection logic here
  };

  const handleSkip = () => {
    console.log('Skipping current talker');
    hidePopup();
  };

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Interpolate progress width for animation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#000' />
      
      {/* Header */}
      <LinearGradient
        colors={Colors.primaryGradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Finding a Talker</Text>
        <Text style={styles.headerSubtitle}>Connect you with someone who cares</Text>
      </LinearGradient>

      {/* Main Search Area */}
      <View style={styles.searchContainer}>
        {/* Animated Search Icon */}
        <View style={styles.searchIconContainer}>
          <Animated.View 
            style={[
              styles.rotatingCircle,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}
          >
            <View style={styles.circleDot} />
          </Animated.View>
          <View style={styles.searchIcon}>
            <Icon name="person" size={40} color={Colors.primary} />
          </View>
        </View>

        {/* Searching Text */}
        <Text style={styles.searchingText}>
          {searchTexts[searchTextIndex]}
        </Text>

        {/* Progress Bar Container */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { 
                  width: progressWidth,
                }
              ]} 
            />
          </View>
          <Text style={styles.estimatedTime}>
            Connecting you quickly...
          </Text>
        </View>
      </View>

      {/* Popup Notifications */}
      {showPopup && currentPopup && (
        <Animated.View 
          style={[
            styles.popupContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.popup}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupBadge}>🟢 ONLINE NOW</Text>
              <Text style={styles.popupDistance}>{currentPopup.distance}</Text>
            </View>
            
            <View style={styles.popupContent}>
              <Text style={styles.popupAvatar}>{currentPopup.avatar}</Text>
              <View style={styles.popupInfo}>
                <Text style={styles.popupName}>{currentPopup.name}</Text>
                <Text style={styles.popupSpecialty}>{currentPopup.specialty}</Text>
                <View style={styles.popupRating}>
                  <Icon name="star" size={14} color="#FFD700" />
                  <Text style={styles.popupRatingText}>{currentPopup.rating}</Text>
                  <Text style={styles.popupResponse}>• {currentPopup.responseTime} response</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => handleConnect(currentPopup)}
            >
              <LinearGradient
                colors={Colors.primaryGradient}
                style={styles.connectButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="chatbubble-ellipses" size={20} color={Colors.white} />
                <Text style={styles.connectButtonText}>Connect to Talk</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip • Show other talkers</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  searchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
    marginTop: -100,
  },
  searchIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  rotatingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255, 51, 102, 0.2)',
    borderTopColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: -4,
  },
  searchIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  progressWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  popup: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 51, 102, 0.1)',
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  popupDistance: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  popupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  popupAvatar: {
    fontSize: 40,
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 60,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderRadius: 30,
    marginRight: 16,
  },
  popupInfo: {
    flex: 1,
  },
  popupName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  popupSpecialty: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  popupRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 4,
    marginRight: 8,
  },
  popupResponse: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  connectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  connectButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
});

export default TalkerSearchScreen;