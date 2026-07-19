

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Dimensions, 
//   Platform,
//   ActivityIndicator,
//   Modal,
//   Animated,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../src/context/ThemeContext';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';
// import LottieView from 'lottie-react-native';

// const { width } = Dimensions.get('window');

// // ─── Welcome Modal Component ──────────────────────────────────────────────
// const WelcomeModal = ({ visible, onGetStarted, onClose, isBusiness }) => {
//   const fadeAnim = React.useRef(new Animated.Value(0)).current;
//   const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           tension: 50,
//           friction: 7,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       fadeAnim.setValue(0);
//       scaleAnim.setValue(0.8);
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <Modal
//       transparent={true}
//       visible={visible}
//       animationType="fade"
//       statusBarTranslucent={true}
//     >
//       <View style={styles.welcomeOverlay}>
//         <Animated.View 
//           style={[
//             styles.welcomeContainer,
//             {
//               opacity: fadeAnim,
//               transform: [{ scale: scaleAnim }],
//             }
//           ]}
//         >
//           <TouchableOpacity 
//             style={styles.welcomeClose}
//             onPress={onClose}
//           >
//             <Icon name="close" size={24} color="#666" />
//           </TouchableOpacity>

//           <View style={styles.welcomeIconContainer}>
//             {/* <LinearGradient
//               colors={isBusiness ? ['#FF6B6B', '#EE5A24'] : ['#4A90E2', '#0d64dd']}
//               style={styles.welcomeIconGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//             >
//               <Text style={styles.welcomeEmoji}>
//                 {isBusiness ? '🏢' : '👋'}
//               </Text>
//             </LinearGradient> */}
//             <LottieView
//                           source={require("../assets/animations/Chat.json")}
//                           autoPlay
//                           loop={true}
//                           style={styles.lottie}
//                         />
//           </View>

//           <Text style={styles.welcomeTitle}>
//             Welcome to eChat!
//           </Text>

//           <Text style={styles.welcomeSubtitle}>
//             {isBusiness 
//               ? 'Connect with customers and grow your business'
//               : 'Connect with friends and share your moments'
//             }
//           </Text>

//           <View style={styles.welcomeFeatures}>
//             <View style={styles.welcomeFeature}>
//               <Icon name="chatbubble-ellipses" size={20} color="#0d64dd" />
//               <Text style={styles.welcomeFeatureText}>
//                 {isBusiness 
//                   ? 'Engage with your audience in real-time'
//                   : 'Chat with friends and family'
//                 }
//               </Text>
//             </View>
//             <View style={styles.welcomeFeature}>
//               <Icon name="notifications" size={20} color="#0d64dd" />
//               <Text style={styles.welcomeFeatureText}>
//                 {isBusiness 
//                   ? 'Get instant notifications for leads'
//                   : 'Stay updated with notifications'
//                 }
//               </Text>
//             </View>
//             <View style={styles.welcomeFeature}>
//               <Icon name="shield-checkmark" size={20} color="#0d64dd" />
//               <Text style={styles.welcomeFeatureText}>
//                 {isBusiness 
//                   ? 'Secure business communications'
//                   : 'Secure and private conversations'
//                 }
//               </Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.welcomeButton}
//             onPress={onGetStarted}
//             activeOpacity={0.8}
//           >
//             <LinearGradient
//               colors={isBusiness ? ['#0d64dd', '#0432ff'] : ['#0432ff', '#0d64dd']}
//               style={styles.welcomeButtonGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Text style={styles.welcomeButtonText}>Get Started</Text>
             
//             </LinearGradient>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Main BottomNav Component ────────────────────────────────────────────
// const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
//   const { colors } = useTheme();
//   const insets = useSafeAreaInsets();
  
//   const [userProfile, setUserProfile] = useState(null);
//   const [accountMode, setAccountMode] = useState('personal');
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
//   const [isCheckingProfile, setIsCheckingProfile] = useState(true);
//   const [showWelcomeModal, setShowWelcomeModal] = useState(false);
//   const [isFirstChatVisit, setIsFirstChatVisit] = useState(true);

//   useEffect(() => {
//     initializeApp();
//   }, []);

//   // ─── Initialize App - Check Cache First ──────────────────────────────────
//   const initializeApp = async () => {
//     setIsCheckingProfile(true);
//     try {
//       // Check if we have cached data
//       const cachedHasBusiness = await AsyncStorage.getItem('hasBusinessProfile');
//       const cachedProfile = await AsyncStorage.getItem('businessProfile');
//       const cachedAccountMode = await AsyncStorage.getItem('accountMode');

//       console.log('📦 Cache Check:', {
//         hasBusiness: cachedHasBusiness,
//         hasProfile: !!cachedProfile,
//         accountMode: cachedAccountMode
//       });

//       // If we have cached data, use it
//       if (cachedHasBusiness !== null && cachedProfile) {
//         const profile = JSON.parse(cachedProfile);
//         const hasBusiness = cachedHasBusiness === 'true';
        
//         setHasBusinessProfile(hasBusiness);
//         setUserProfile(profile);
//         setAccountMode(cachedAccountMode || 'personal');
//         setIsCheckingProfile(false);
        
//         console.log('✅ Using cached data:', { hasBusiness, profile });
//         return;
//       }

//       // No cache, fetch from API
//       await checkBusinessProfile();
      
//     } catch (error) {
//       console.error('❌ Error initializing app:', error);
//       // If error, try to fetch from API
//       await checkBusinessProfile();
//     } finally {
//       setIsCheckingProfile(false);
//     }
//   };

//   // ─── Check Business Profile and Cache ────────────────────────────────────
//   const checkBusinessProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         setIsCheckingProfile(false);
//         return;
//       }

//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         const profile = response.data;
//         console.log('📱 Fetched business profile from API:', profile);
        
//         // Check if profile exists and has required business fields
//         const hasProfile = profile && profile.id && profile.name && profile.name.trim() !== '';
        
//         // Cache the results
//         await AsyncStorage.setItem('businessProfile', JSON.stringify(profile));
//         await AsyncStorage.setItem('hasBusinessProfile', hasProfile ? 'true' : 'false');
        
//         setHasBusinessProfile(hasProfile);
//         setUserProfile(profile);
//         console.log('💾 Cached business profile:', hasProfile);
//       } else {
//         // No profile found
//         await AsyncStorage.setItem('hasBusinessProfile', 'false');
//         await AsyncStorage.setItem('businessProfile', JSON.stringify(null));
//         setHasBusinessProfile(false);
//         setUserProfile(null);
//         console.log('❌ No business profile found');
//       }
//     } catch (err) {
//       console.log('❌ Error fetching business profile:', err);
//       setHasBusinessProfile(false);
//       setUserProfile(null);
//       // Cache the false state
//       await AsyncStorage.setItem('hasBusinessProfile', 'false');
//       await AsyncStorage.setItem('businessProfile', JSON.stringify(null));
//     }
//   };

//   // ─── Check if First Chat Visit ──────────────────────────────────────────
//   const checkIfFirstChatVisit = async () => {
//     try {
//       const hasVisitedChat = await AsyncStorage.getItem('hasVisitedChat');
//       if (!hasVisitedChat) {
//         setShowWelcomeModal(true);
//         await AsyncStorage.setItem('hasVisitedChat', 'true');
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Error checking chat visit:', error);
//       return false;
//     }
//   };

//   // ─── Navigate to Chats ──────────────────────────────────────────────────
//   const navigateToChats = () => {
//     if (hasBusinessProfile && userProfile && userProfile.id) {
//       console.log('🏢 Business account - navigating to BusinessHome');
//       navigation.navigate('BusinessHome');
//     } else {
//       console.log('👤 Personal account - navigating to PHome');
//       navigation.navigate('PHome');
//     }
//   };

//   // ─── Handle Chats Press ──────────────────────────────────────────────────
//   const handleChatsPress = async () => {
//     if (isLoading) return;
    
//     setIsLoading(true);
//     try {
//       // Check if first time visiting chats
//       const isFirstVisit = await checkIfFirstChatVisit();
      
//       if (isFirstVisit) {
//         setIsLoading(false);
//         return;
//       }

//       // Always use cached data - no need to fetch again
//       // The data is already in state from initialization
      
//       // Navigate based on cached profile status
//       navigateToChats();
      
//     } catch (error) {
//       console.error('❌ Error navigating to chats:', error);
//       // Fallback navigation - go to personal home
//       navigation.navigate('PHome');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ─── Handle Get Started from Welcome Modal ─────────────────────────────
//   const handleGetStarted = () => {
//     setShowWelcomeModal(false);
//     // Navigate after welcome
//     setTimeout(() => {
//       navigateToChats();
//     }, 300);
//   };

//   // ─── Handle Profile Press ──────────────────────────────────────────────
//   const handleProfilePress = async () => {
//     if (isLoading) return;
    
//     setIsLoading(true);
//     try {
//       // Get account mode from cache
//       const mode = await AsyncStorage.getItem('accountMode');
      
//       if (mode === 'personal' || !mode) {
//         // Personal account
//         navigation.navigate('UserPersonalAccountProfile');
//       } else {
//         // Business account - check cached profile
//         if (hasBusinessProfile && userProfile && userProfile.id) {
//           navigation.navigate('BusinessProfile');
//         } else {
//           navigation.navigate('BusinessSetup');
//         }
//       }
//     } catch (error) {
//       console.error('Error navigating to profile:', error);
//       navigation.navigate('UserPersonalAccountProfile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ─── Render Profile Icon ─────────────────────────────────────────────────
//   const renderProfileIcon = (isActive) => {
//     const iconColor = isActive ? colors.primary : colors.icon;

//     // if (isCheckingProfile) {
//     //   return <ActivityIndicator size="small" color={colors.primary} />;
//     // }

//     return (
//       <Icon 
//         name={isActive ? 'person' : 'person-outline'} 
//         size={24} 
//         color={iconColor} 
//       />
//     );
//   };

//   // ─── Get Profile Label ──────────────────────────────────────────────────
//   const getProfileLabel = () => {
//     if (hasBusinessProfile && userProfile && userProfile.id) {
//       return 'Business';
//     }
//     return 'Profile';
//   };

//   // ─── Get Bottom Padding ─────────────────────────────────────────────────
//   const getBottomPadding = () => {
//     if (Platform.OS === 'ios') {
//       return Math.max(insets.bottom, 8);
//     }
//     return Math.max(insets.bottom, 0);
//   };

//   return (
//     <>
//       <View 
//         style={[
//           styles.container,
//           { paddingBottom: getBottomPadding() }
//         ]}
//       >
//         <View style={[
//           styles.navContainer,
//           { 
//             backgroundColor: colors.surface,
//             borderTopColor: colors.border,
//             shadowColor: colors.shadow,
//           }
//         ]}>
//           {/* Left Items - Home & Explore */}
//           <View style={styles.leftItems}>
//             <TouchableOpacity
//               style={styles.navItem}
//               onPress={() => navigation.navigate('BroadcastHome')}
//               activeOpacity={0.7}
//             >
//               <View style={styles.iconContainer}>
//                 <Icon 
//                   name={activeRoute === 'Home' ? 'home' : 'home-outline'} 
//                   size={24} 
//                   color={activeRoute === 'Home' ? colors.primary : colors.icon} 
//                 />
//                 {activeRoute === 'Home' && (
//                   <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
//                 )}
//               </View>
//               <Text style={[
//                 styles.navLabel,
//                 { color: activeRoute === 'Home' ? colors.primary : colors.icon },
//                 activeRoute === 'Home' && styles.activeNavLabel
//               ]}>
//                 Home
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.navItem}
//               onPress={() => navigation.navigate('ExplorePost')}
//               activeOpacity={0.7}
//             >
//               <View style={styles.iconContainer}>
//                 <Icon 
//                   name={activeRoute === 'Explore' ? 'compass' : 'compass-outline'} 
//                   size={24} 
//                   color={activeRoute === 'Explore' ? colors.primary : colors.icon} 
//                 />
//                 {activeRoute === 'Explore' && (
//                   <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
//                 )}
//               </View>
//               <Text style={[
//                 styles.navLabel,
//                 { color: activeRoute === 'Explore' ? colors.primary : colors.icon },
//                 activeRoute === 'Explore' && styles.activeNavLabel
//               ]}>
//                 Explore
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Center Button */}
//           <TouchableOpacity
//             style={styles.centerButton}
//             onPress={() => setShowAccountModal(true)}
//             activeOpacity={0.9}
//           >
//             <LinearGradient
//               colors={[colors.primary, colors.primaryDark || colors.primary]}
//               style={styles.centerButtonGradient}
//             >
//               <MaterialCommunityIcons 
//                 name="swap-horizontal-circle" 
//                 size={28} 
//                 color="#FFF" 
//               />
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Right Items - Chats & Profile */}
//           <View style={styles.rightItems}>
//             <TouchableOpacity
//               style={styles.navItem}
//               onPress={handleChatsPress}
//               activeOpacity={0.7}
//               disabled={isLoading}
//             >
//               <View style={styles.iconContainer}>
//                 {isLoading ? (
//                   <ActivityIndicator size="small" color={colors.primary} />
//                 ) : (
//                   <Icon 
//                     name={activeRoute === 'Chats' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} 
//                     size={24} 
//                     color={activeRoute === 'Chats' ? colors.primary : colors.icon} 
//                   />
//                 )}
//                 {activeRoute === 'Chats' && (
//                   <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
//                 )}
//               </View>
//               <Text style={[
//                 styles.navLabel,
//                 { color: activeRoute === 'Chats' ? colors.primary : colors.icon },
//                 activeRoute === 'Chats' && styles.activeNavLabel
//               ]}>
//                 Chats
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.navItem}
//               onPress={()=>navigation.navigate('UserPersonalAccountProfile')}
//               activeOpacity={0.7}
//             >
//               <View style={styles.iconContainer}>
//                 {renderProfileIcon(activeRoute === 'Profile')}
//                 {activeRoute === 'Profile' && (
//                   <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
//                 )}
//               </View>
//               <Text style={[
//                 styles.navLabel,
//                 { color: activeRoute === 'Profile' ? colors.primary : colors.icon },
//                 activeRoute === 'Profile' && styles.activeNavLabel
//               ]}>
//                 {/* {getProfileLabel()} */}
//                 Profile
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Welcome Modal */}
//       <WelcomeModal
//         visible={showWelcomeModal}
//         onGetStarted={handleGetStarted}
//         onClose={() => setShowWelcomeModal(false)}
//         isBusiness={hasBusinessProfile}
//       />
      
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'transparent',
//     zIndex: 999,
  
//   },
//    lottie: {
//     width: 150,
//     height: 150,
//     alignSelf: 'center',
//     marginBottom: 0,
//   },
//   navContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 56,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 50,
//     borderTopWidth: 0.3,
//     paddingHorizontal: 16,
//   },
//   leftItems: {
//     flexDirection: 'row',
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     gap: 4,
//   },
//   rightItems: {
//     flexDirection: 'row',
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     gap: 4,
//   },
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     minWidth: 60,
//   },
//   iconContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   navLabel: {
//     fontSize: 10,
//     fontFamily: 'SourceSansPro-Medium',
//     marginTop: 2,
//     letterSpacing: 0.2,
//     textAlign: 'center',
//   },
//   activeNavLabel: {
//     fontWeight: '600',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     top: -1,
//     right: -1,
//     width: 5,
//     height: 5,
//     borderRadius: 2.5,
//   },
//   centerButton: {
//     position: 'absolute',
//     top: -20,
//     left: width / 2 - 28,
//     zIndex: 100,
//   },
//   centerButtonGradient: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 8,
//     borderWidth: 2,
//     borderColor: '#FFF',
//   },

//   // ── Welcome Modal Styles ──────────────────────────────────────────────
//   welcomeOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   welcomeContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: 24,
//     padding: 24,
//     width: '100%',
//     maxWidth: 400,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.25,
//     shadowRadius: 20,
//     elevation: 15,
//   },
//   welcomeClose: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     padding: 8,
//     zIndex: 1,
//   },
//   welcomeIconContainer: {
//     marginBottom: 16,
//     marginTop: 8,
//   },
//   welcomeIconGradient: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   welcomeEmoji: {
//     fontSize: 48,
//   },
//   welcomeTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 8,
//     textAlign: 'center',
//     marginTop: -30,
//   },
//   welcomeSubtitle: {
//     fontSize: 15,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   welcomeFeatures: {
//     width: '100%',
//     marginBottom: 24,
//   },
//   welcomeFeature: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   welcomeFeatureText: {
//     fontSize: 14,
//     color: '#333',
//     marginLeft: 12,
//     flex: 1,
//   },
//   welcomeButton: {
//     width: '100%',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//     marginBottom:15
//   },
//   welcomeButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     gap: 8,
//   },
//   welcomeButtonText: {
//     color: '#FFF',
//     fontSize: 17,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
// });

// export default BottomNav;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Platform,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

// ─── Welcome Modal Component ──────────────────────────────────────────────
const WelcomeModal = ({ visible, onGetStarted, onClose, isBusiness }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.welcomeOverlay}>
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.welcomeClose}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.welcomeIconContainer}>
            <LottieView
              source={require("../assets/animations/Chat.json")}
              autoPlay
              loop={true}
              style={styles.lottie}
            />
          </View>

          <Text style={styles.welcomeTitle}>
            Welcome to eChat!
          </Text>

          <Text style={styles.welcomeSubtitle}>
            {isBusiness 
              ? 'Connect with customers and grow your business'
              : 'Connect with friends and share your moments'
            }
          </Text>

          <View style={styles.welcomeFeatures}>
            <View style={styles.welcomeFeature}>
              <Icon name="chatbubble-ellipses" size={20} color="#0d64dd" />
              <Text style={styles.welcomeFeatureText}>
                {isBusiness 
                  ? 'Engage with your audience in real-time'
                  : 'Chat with friends and family'
                }
              </Text>
            </View>
            <View style={styles.welcomeFeature}>
              <Icon name="notifications" size={20} color="#0d64dd" />
              <Text style={styles.welcomeFeatureText}>
                {isBusiness 
                  ? 'Get instant notifications for leads'
                  : 'Stay updated with notifications'
                }
              </Text>
            </View>
            <View style={styles.welcomeFeature}>
              <Icon name="shield-checkmark" size={20} color="#0d64dd" />
              <Text style={styles.welcomeFeatureText}>
                {isBusiness 
                  ? 'Secure business communications'
                  : 'Secure and private conversations'
                }
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isBusiness ? ['#0d64dd', '#0432ff'] : ['#0432ff', '#0d64dd']}
              style={styles.welcomeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.welcomeButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Main BottomNav Component ────────────────────────────────────────────
const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [userProfile, setUserProfile] = useState(null);
  const [accountMode, setAccountMode] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isFirstChatVisit, setIsFirstChatVisit] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  // ─── Initialize App - Check Cache First ──────────────────────────────────
  const initializeApp = async () => {
    setIsCheckingProfile(true);
    try {
      const cachedHasBusiness = await AsyncStorage.getItem('hasBusinessProfile');
      const cachedProfile = await AsyncStorage.getItem('businessProfile');
      const cachedAccountMode = await AsyncStorage.getItem('accountMode');

      if (cachedHasBusiness !== null && cachedProfile) {
        const profile = JSON.parse(cachedProfile);
        const hasBusiness = cachedHasBusiness === 'true';
        
        setHasBusinessProfile(hasBusiness);
        setUserProfile(profile);
        setAccountMode(cachedAccountMode || 'personal');
        setIsCheckingProfile(false);
        return;
      }

      await checkBusinessProfile();
      
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      await checkBusinessProfile();
    } finally {
      setIsCheckingProfile(false);
    }
  };

  // ─── Check Business Profile and Cache ────────────────────────────────────
  const checkBusinessProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setIsCheckingProfile(false);
        return;
      }

      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = response.data;
        const hasProfile = profile && profile.id && profile.name && profile.name.trim() !== '';
        
        await AsyncStorage.setItem('businessProfile', JSON.stringify(profile));
        await AsyncStorage.setItem('hasBusinessProfile', hasProfile ? 'true' : 'false');
        
        setHasBusinessProfile(hasProfile);
        setUserProfile(profile);
      } else {
        await AsyncStorage.setItem('hasBusinessProfile', 'false');
        await AsyncStorage.setItem('businessProfile', JSON.stringify(null));
        setHasBusinessProfile(false);
        setUserProfile(null);
      }
    } catch (err) {
      console.log('❌ Error fetching business profile:', err);
      setHasBusinessProfile(false);
      setUserProfile(null);
      await AsyncStorage.setItem('hasBusinessProfile', 'false');
      await AsyncStorage.setItem('businessProfile', JSON.stringify(null));
    }
  };

  // ─── Check if First Chat Visit ──────────────────────────────────────────
  const checkIfFirstChatVisit = async () => {
    try {
      const hasVisitedChat = await AsyncStorage.getItem('hasVisitedChat');
      if (!hasVisitedChat) {
        setShowWelcomeModal(true);
        await AsyncStorage.setItem('hasVisitedChat', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking chat visit:', error);
      return false;
    }
  };

  // ─── Navigate to Chats ──────────────────────────────────────────────────
  const navigateToChats = () => {
    if (hasBusinessProfile && userProfile && userProfile.id) {
      navigation.navigate('BusinessHome');
    } else {
      navigation.navigate('PHome');
    }
  };

  // ─── Handle Chats Press ──────────────────────────────────────────────────
  const handleChatsPress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const isFirstVisit = await checkIfFirstChatVisit();
      
      if (isFirstVisit) {
        setIsLoading(false);
        return;
      }

      navigateToChats();
      
    } catch (error) {
      console.error('❌ Error navigating to chats:', error);
      navigation.navigate('PHome');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handle Get Started from Welcome Modal ─────────────────────────────
  const handleGetStarted = () => {
    setShowWelcomeModal(false);
    setTimeout(() => {
      navigateToChats();
    }, 300);
  };

  // ─── Handle Profile Press ──────────────────────────────────────────────
  const handleProfilePress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const mode = await AsyncStorage.getItem('accountMode');
      
      if (mode === 'personal' || !mode) {
        navigation.navigate('UserPersonalAccountProfile');
      } else {
        if (hasBusinessProfile && userProfile && userProfile.id) {
          navigation.navigate('UserPersonalAccountProfile');
        } else {
          navigation.navigate('BusinessSetup');
        }
      }
    } catch (error) {
      console.error('Error navigating to profile:', error);
      navigation.navigate('UserPersonalAccountProfile');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render Profile Icon ─────────────────────────────────────────────────
  const renderProfileIcon = (isActive) => {
    const iconColor = isActive ? colors.primary : colors.icon;
    return (
      <Icon 
        name={isActive ? 'person' : 'person-outline'} 
        size={24} 
        color={iconColor} 
      />
    );
  };

  // ─── Get Bottom Padding ─────────────────────────────────────────────────
  const getBottomPadding = () => {
    if (Platform.OS === 'ios') {
      return Math.max(insets.bottom, 8);
    }
    return Math.max(insets.bottom, 0);
  };

  return (
    <>
      <View 
        style={[
          styles.container,
          { paddingBottom: getBottomPadding() }
        ]}
      >
        <View style={[
          styles.navContainer,
          { 
            backgroundColor: colors.surface || '#FFFFFF',
            borderTopColor: colors.border || 'rgba(0,0,0,0.05)',
          }
        ]}>
          {/* Enhanced Shadow Layer */}
          <View style={styles.shadowLayer} />
          
          {/* Left Items - Home & Explore */}
          <View style={styles.leftItems}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('BroadcastHome')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon 
                  name={activeRoute === 'Home' ? 'home-outline' : 'home-outline'} 
                  size={24} 
                  color={activeRoute === 'Home' ? colors.icon : colors.icon} 
                />
                {activeRoute === 'Home' && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.icon }]} />
                )}
              </View>
              <Text style={[
                styles.navLabel,
                { color: activeRoute === 'Home' ? colors.icon : colors.icon },
                activeRoute === 'Home' && styles.activeNavLabel
              ]}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('ExplorePost')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon 
                  name={activeRoute === 'Explore' ? 'compass' : 'compass-outline'} 
                  size={24} 
                  color={activeRoute === 'Explore' ? colors.primary : colors.icon} 
                />
                {activeRoute === 'Explore' && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={[
                styles.navLabel,
                { color: activeRoute === 'Explore' ? colors.primary : colors.icon },
                activeRoute === 'Explore' && styles.activeNavLabel
              ]}>
                Explore
              </Text>
            </TouchableOpacity>
          </View>

          {/* Center Button */}
          <TouchableOpacity
            style={styles.centerButton}
            onPress={() => setShowAccountModal(true)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark || colors.primary]}
              style={styles.centerButtonGradient}
            >
              <MaterialCommunityIcons 
                name="swap-horizontal-circle" 
                size={28} 
                color="#FFF" 
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Right Items - Chats & Profile */}
          <View style={styles.rightItems}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={handleChatsPress}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <View style={styles.iconContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Icon 
                    name={activeRoute === 'Chats' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} 
                    size={24} 
                    color={activeRoute === 'Chats' ? colors.primary : colors.icon} 
                  />
                )}
                {activeRoute === 'Chats' && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={[
                styles.navLabel,
                { color: activeRoute === 'Chats' ? colors.primary : colors.icon },
                activeRoute === 'Chats' && styles.activeNavLabel
              ]}>
                Chats
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {renderProfileIcon(activeRoute === 'Profile')}
                {activeRoute === 'Profile' && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={[
                styles.navLabel,
                { color: activeRoute === 'Profile' ? colors.primary : colors.icon },
                activeRoute === 'Profile' && styles.activeNavLabel
              ]}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Welcome Modal */}
      <WelcomeModal
        visible={showWelcomeModal}
        onGetStarted={handleGetStarted}
        onClose={() => setShowWelcomeModal(false)}
        isBusiness={hasBusinessProfile}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 0,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    position: 'relative',
    // Enhanced Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: -4 
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Enhanced Shadow for Android
    elevation: 20,
    borderTopWidth: 0.5,
  },
  shadowLayer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  leftItems: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  rightItems: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontFamily: 'SourceSansPro-Medium',
    marginTop: 2,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  activeNavLabel: {
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  centerButton: {
    position: 'absolute',
    top: -24,
    left: width / 2 - 30,
    zIndex: 100,
  },
  centerButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced shadow for center button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },

  // ── Welcome Modal Styles ──────────────────────────────────────────────
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  welcomeClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  welcomeIconContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  welcomeIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeEmoji: {
    fontSize: 48,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: -30,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  welcomeFeatures: {
    width: '100%',
    marginBottom: 24,
  },
  welcomeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  welcomeFeatureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  welcomeButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  welcomeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  welcomeButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default BottomNav;


