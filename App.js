

// import React, { useEffect, useState, useRef } from "react";
// import { 
//   AppState, 
//   Platform, 
//   View, 
//   ActivityIndicator, 
//   StatusBar as RNStatusBar,
//   InteractionManager,
//   Image,
//   NativeModules,
//   LogBox
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { useOnlineStatus } from './src/hooks/useOnlineStatus';

// // Create navigation ref
// const navigationRef = React.createRef();



// // Ignore specific warnings
// LogBox.ignoreLogs([
//   'new NativeEventEmitter',
//   'Require cycle:',
//   'VirtualizedLists should never be nested',
// ]);

// // Import checkPinStatus from the correct location
// import { checkPinStatus } from './showa_personal_account_screen/FaceSecuritySetting';
// import PinUnlockModal from './screens/PinUnlockModal';
// import videoBackgroundfetch from './src/services/VideoBackgroundFetch';

// // Theme Context
// import { ThemeProvider } from './src/context/ThemeContext';

// // Import useTheme here (BEFORE using it in components)
// import { useTheme } from './src/context/ThemeContext';

// // Components & Context
// import { CallProvider } from './components/CallContext';
// import CallSignalListener from "./components/CallSignalListener";
// import IncomingCallModal from './components/IncomingCallModal';

// import NetworkStatusBanner from "./components/Networkstatusbanner";

// // Services
// import { startBackgroundContactSync, setupContactSyncListener } from "./components/BackgroundSync";
// import backgroundFetchService from "./src/services/BackgroundFetchService";

// // ==================== SCREEN IMPORTS ====================

// // Authentication & Onboarding Screens
// import Loginscreen from './screens/Loginscreen';
// import Signin from './screens/onboard/SignIn';
// import Signin_two from './screens/onboard/SignIn2_two';
// import TermsCondition from './screens/onboard/Terms';
// import PrivacyPolicy from './screens/onboard/PrivacyPolicy';
// import Register from './screens/onboard/Register';
// import Biometric from './screens/onboard/Biometric';
// import LinkingScreen from './screens/onboard/LinkingScreen';
// import VerificationCode from "./screens/onboard/VerifyEmail";
// import ProceedOptions from './screens/ProceedOptions';
// import Terms from './screens/TermsPrivacyScreen';

// // Personal Account Screens
// import PHome from './showa_personal_account_screen/PHome';
// import UserPersonalAccountProfile from './screens/profiles/UserPersonalAccountProfile';
// import PStatusBar from './showa_personal_account_screen/StatusBar';
// import StatusEditorScreen from './showa_personal_account_screen/StatusEditorScreen';
// import JoinChannel from './showa_personal_account_screen/JoinChannel';
// import Calls from './showa_personal_account_screen/Calls';
// import CallOngoingScreen from './showa_personal_account_screen/CallOngoingScreen';
// import Settings from './showa_personal_account_screen/Settings';
// import NotificationSetting from './showa_personal_account_screen/NotificationSetting';
// import WallpaperSetting from './showa_personal_account_screen/WallpaperSetting';
// import FaceSecuritySetting from './showa_personal_account_screen/FaceSecuritySetting';
// import PrivateChat from './showa_personal_account_screen/PrivateChat';

// // Business Account Screens
// import ChannelDetails from './showa_business/ChannelDetails';
// import PostDetails from './showa_business/PostDetailScreen';
// import BusinessHome from './showa_business/Home';
// import ChatAi from './showa_business/ChatAi';
// import MonetizationRequestForm from './showa_business/MonetizationRequestForm';
// import BUserProfile from './showa_business/UserProfile';
// import BStatusBar from './showa_business/StatusBar';
// import BStatusEditorScreen from './showa_business/StatusEditorScreen';
// import BJoinChannel from './showa_business/JoinChannel';
// import BCalls from './showa_business/Calls';
// import BCallOngoingScreen from './showa_business/CallOngoingScreen';
// import BSettings from './showa_business/Settings';
// import BNotificationSetting from './showa_business/NotificationSetting';
// import BWallpaperSetting from './showa_business/WallpaperSetting';
// import BFaceSecuritySetting from './showa_business/FaceSecuritySetting';
// import ToolsScreen from './showa_business/ToolsScreen';
// import QuickReplies from './showa_business/QuickReplies';
// import AddQuickReply from './showa_business/AddQuickReply';
// import EssentialPlatformsScreen from './showa_business/EssentialPlatformsScreen';
// import Advertise from './showa_business/Advertise';
// import ManageProfile from './showa_business/ManageProfile';
// import CreateCatalog from './showa_business/CreateCatalog';
// import AddItemToCatalog from './showa_business/AddItemToCatalog';
// import Explore from './showa_business/Explore';
// import LabelChats from './showa_business/LabelChatsScreen';
// import Labels from './showa_business/LabelsScreen';
// import AddQuickReplyScreen from './showa_business/AddQuickReplyScreen';
// import GreetingMessage from './showa_business/GreetingMessage';
// import AwayMessage from './showa_business/AwayMessageScreen';
// import HelpCenter from './showa_business/HelpCenterScreen';
// import HelpTopic from './showa_business/HelpTopicScreen';
// import BusinessSetup from './showa_business/BusinessSetupScreen';
// import ProductDetails from './showa_business/ProductDetailsScreen';
// import Cart from './showa_business/CartScreen';
// import ChannelAdminManagement from './showa_business/ChannelAdminManagement';
// import EmptyCart from './showa_business/EmptyCartScreen';
// import OoshBusiness from './showa_business/OoshBusinessScreen';
// import Live from './showa_business/LiveScreen';
// import Broadcast from './showa_business/Broadcast';
// import OfficialSearch from './showa_business/OfficialSearchScreen';
// import CreateChannel from './showa_business/CreateChannel';
// import InviteChannelLink from './showa_business/InviteChannelLink';
// import Supplyrequest from './showa_business/SupplyRequest';
// import SupplyRequestForm from './showa_business/SupplyRequestForm';
// import SupplyServices from './showa_business/SupplyServices';
// import SupplyRequestDetail from './showa_business/SupplyRequestDetail';
// import CreateServices from './showa_business/CreateServices';
// import SupplyRequestDetailScreen from './showa_business/SupplyRequestDetailScreen';
// import BroadcastHome from './showa_business/BroadcastHome';
// import CreateBroadcastPost from './showa_business/CreateBroadcastPost';
// import ReportPost from './showa_business/ReportPost';
// import BroadcastUserProfile from './showa_business/BroadcastUserProfile';
// import MarketPlace from './showa_business/MarketPlace';
// import CreateListing from './showa_business/CreateListing';
// import ListingDetails from './showa_business/ListingDetails';
// import SuggestedFollowers from './showa_business/SuggestedFollowers';
// import ManagePost from './showa_business/ManagePost';
// import CreatorDashboard from './showa_business/CreatorDashboardScreen';
// import ContractHome from './showa_business/contracts/ContractHome';
// import CreateAdForm from './showa_business/ads/CreateAdFormScreen';
// import AdReview from './showa_business/ads/AdReview';
// import BroadcastSuccess from './showa_business/BroadcastSuccess';
// import AllProducts from './showa_business/AllProducts';
// import OtherUserCatalog from './showa_business/OthersUserCatalog';
// import OtherUserCatalogDetail from './showa_business/OtherUserCatalogDetail';
// import BPrivateChat from './showa_business/BusinessChat';
// import BusinessGroupChat from './showa_business/BusinessGroupChat';
// import SupplierNotificationScreen from './showa_business/SupplierNotificationScreen';
// import RequesterPostHistory from './showa_business/RequesterPostHistory';
// import GroupMembers from './showa_business/GroupMembers';

// // Social Media Screens
// import SocialHome from './showa_social/Home';
// import Discover from './showa_social/Discover';
// import UploadshortVideo from './showa_social/UploadshortVideo';
// import SearchShort from './showa_social/SearchShort';

// // Feature Components
// import GroupCreate from './screens/GroupCreate';
// import GroupConnect from './screens/GroupConnect';
// import UserContactListPersonalAccount from './components/UserContactListPersonalAccount';
// import Music from './components/Music';
// import UserContactList from './components/UserContactList';
// import SyncMessagePersonal from './components/SyncMessagePersonal';
// import SyncContactForBusiness from './components/SyncContactForBusiness';
// import CameraScreen from './components/CameraScreen';
// import SongsList from './components/SongsListScreen';
// import NewCommunity from './components/NewCommunityScreen';
// import VideoCalls from './components/VideoCalls';
// import VoiceCalls from './components/VoiceCalls';
// import GoLive from './components/GoLive';
// import LiveStream from './components/LiveStream';
// import ContactUs from './components/ContactUs';
// import SuccessStory from './components/SuccessStory';
// import OtherUserProfile from "./screens/profiles/OtherUserProfile";
// import EarningDashbord from "./screens/earning/EarningDashbord";
// import WithdrawEarning from "./screens/earning/WithdrawEarning";
// import PurchaseData from "./screens/earning/PurchaseData";
// import NinRegisterEarning from "./screens/earning/NinRegisterEarning";
// import VideoAds from "./screens/earning/VideoAds";
// import EarningWallet from "./screens/earning/EarningWallet";
// import SynMessage from './components/SynMessage';
// import SyncContactPersonal from './components/UserContactPersonal';
// import LiveStreaming from "./src/LiveStreaming";
// import GlobalIssueReport from "./components/GlobalIssueReport";
// import NewsList from "./components/NewsList";
// import Broadcaster from "./src/Broadcaster";
// import Viewer from "./src/Viewer";

// // ==================== HELPER FUNCTIONS ====================

// // Clear image cache helper function
// const clearImageCache = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Clear React Native's image cache using Image.queryCache
//       Image.queryCache && Image.queryCache([], (cacheResponse) => {
//         if (cacheResponse && Object.keys(cacheResponse).length > 0) {
//           const urls = Object.keys(cacheResponse);
//           console.log(`Found ${urls.length} cached images to clear`);
//         }
//       });
//     }
    
//     // Clear in-memory image cache by setting a flag
//     global.__imageCacheCleared = Date.now();
    
//     console.log('✅ Image cache cleared');
//   } catch (error) {
//     console.error('Error clearing image cache:', error);
//   }
// };

// // Clear WebView cache helper
// const clearWebViewCache = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Clear WebView cache using native module if available
//       const { WebViewManager } = NativeModules;
//       if (WebViewManager && WebViewManager.clearCache) {
//         await WebViewManager.clearCache();
//       }
//     }
//   } catch (error) {
//     console.error('Error clearing WebView cache:', error);
//   }
// };

// // Clear all caches helper
// const clearAllCaches = async () => {
//   try {
//     await clearImageCache();
//     await clearWebViewCache();
    
//     // Clear AsyncStorage temporary data if needed
//     const allKeys = await AsyncStorage.getAllKeys();
//     const keysToClear = allKeys.filter(key => 
//       key.includes('temp_') || 
//       key.includes('cache_') || 
//       key.includes('_preview') ||
//       key.includes('video_cache_')
//     );
    
//     if (keysToClear.length > 0) {
//       await AsyncStorage.multiRemove(keysToClear);
//       console.log(`Cleared ${keysToClear.length} temporary cache items`);
//     }
//   } catch (error) {
//     console.error('Error clearing all caches:', error);
//   }
// };

// // Free up memory helper
// const freeMemory = () => {
//   if (Platform.OS === 'android') {
//     try {
//       // Suggest garbage collection (only works in debug builds)
//       if (global.gc) {
//         global.gc();
//       }
      
//       // Clear any large objects from memory
//       if (global.__largeImageCache) {
//         delete global.__largeImageCache;
//       }
      
//       // Clear video prefetch cache if too large
//       if (global.__videoPrefetchCache) {
//         delete global.__videoPrefetchCache;
//       }
      
//       console.log('✅ Memory cleanup triggered');
//     } catch (error) {
//       console.error('Error freeing memory:', error);
//     }
//   }
// };

// // Stop WebRTC connections helper
// const stopWebRTCConnections = () => {
//   try {
//     // If you have WebRTC connections stored globally, clean them up
//     if (global.__activeWebRTCConnections && global.__activeWebRTCConnections.length > 0) {
//       global.__activeWebRTCConnections.forEach(connection => {
//         if (connection && connection.close) {
//           try {
//             connection.close();
//           } catch (e) {
//             console.error('Error closing WebRTC connection:', e);
//           }
//         }
//       });
//       global.__activeWebRTCConnections = [];
//       console.log('✅ WebRTC connections closed');
//     }
//   } catch (error) {
//     console.error('Error stopping WebRTC connections:', error);
//   }
// };

// // Pause video playback helper
// const pauseAllVideos = () => {
//   try {
//     // If you have video refs stored globally
//     if (global.__activeVideoRefs && global.__activeVideoRefs.length > 0) {
//       global.__activeVideoRefs.forEach(videoRef => {
//         if (videoRef && videoRef.current && typeof videoRef.current.pause === 'function') {
//           videoRef.current.pause();
//         }
//       });
//       console.log(`✅ Paused ${global.__activeVideoRefs.length} videos`);
//     }
//   } catch (error) {
//     console.error('Error pausing videos:', error);
//   }
// };

// // Stop background services
// const stopBackgroundServices = () => {
//   try {
//     if (global.__backgroundSyncInterval) {
//       clearInterval(global.__backgroundSyncInterval);
//       global.__backgroundSyncInterval = null;
//     }
    
//     if (global.__contactSyncListener && global.__contactSyncListener.remove) {
//       global.__contactSyncListener.remove();
//       global.__contactSyncListener = null;
//     }
    
//     backgroundFetchService.stop();
//     console.log('✅ Background services stopped');
//   } catch (error) {
//     console.error('Error stopping background services:', error);
//   }
// };

// // ==================== LINKING CONFIG ====================


// import { Linking } from 'react-native';

// const linking = {
//   prefixes: ['showa://', 'https://showapp.com', 'http://showapp.com'],
//   config: {
//     screens: {
      
//       AiResetPassword: 'reset-password',
      
//       // Post deep linking
//       PostDetail: {
//         path: 'post/:postId',
//         parse: {
//           postId: (id) => id,
//         },
//       },
      
//       // User profile deep linking
//       UserProfile: {
//         path: 'user/:userId',
//         parse: {
//           userId: (id) => id,
//         },
//       },
      
//       // Fallback for any other deep links
//       NotFound: '*',
//     },
//   },
//   // Custom function to get initial URL
//   getInitialURL: async () => {
//     const initialUrl = await Linking.getInitialURL();
//     console.log('Initial URL:', initialUrl);
//     return initialUrl;
//   },
//   // Subscribe to URL changes
//   subscribe: (listener) => {
//     const onReceiveURL = ({ url }) => {
//       console.log('Received URL:', url);
//       listener(url);
//     };
    
//     // Listen to incoming links
//     const subscription = Linking.addEventListener('url', onReceiveURL);
    
//     return () => {
//       subscription.remove();
//     };
//   },
// };

// // const linking = {
// //   prefixes: ['showa://', 'https://showa.app', 'http://showa.app'],
// //   config: {
// //     screens: {
// //       AiResetPassword: 'reset-password',
      
// //       // post deep linking
// //       PostDetail: {
// //         path: 'post/:postId',
// //         parse: {
// //           postId: (id) => id,
// //         },
// //       },
      
// //       // For user profiles - both personal and business (the screen can differentiate based on userId)
// //       UserProfile: {
// //         path: 'user/:userId',
// //         parse: {
// //           userId: (id) => id,
// //         },
// //       },
      
// //       // For channel/business posts
// //       ChannelPost: {
// //         path: 'channel/:channelId/post/:postId',
// //         parse: {
// //           channelId: (id) => id,
// //           postId: (id) => id,
// //         },
// //       },
      
// //       // Fallback for any other deep links
// //       NotFound: '*',
// //     },
// //   },
// //   // Custom function to get initial URL
// //   getInitialURL: async () => {
// //     const initialUrl = await Linking.getInitialURL();
// //     console.log('Initial URL:', initialUrl);
// //     return initialUrl;
// //   },
// //   // Subscribe to URL changes
// //   subscribe: (listener) => {
// //     const onReceiveURL = ({ url }) => {
// //       console.log('Received URL:', url);
// //       listener(url);
// //     };
    
// //     // Listen to incoming links from both Linking and universal links
// //     const subscription = Linking.addEventListener('url', onReceiveURL);
    
// //     return () => {
// //       subscription.remove();
// //     };
// //   },
// // };

// // ==================== NAVIGATION SETUP ====================

// const Stack = createNativeStackNavigator();

// // Screen wrapper - This provides the theme background for ALL screens
// const ScreenWrapper = ({ children }) => {
//   const { colors } = useTheme();
  
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {children}
//     </View>
//   );
// };

// // ==================== MAIN APP COMPONENT ====================

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <AppContent />
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// // ==================== APP CONTENT ====================

// function AppContent() {
//   const [userId, setUserId] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const backgroundTimerRef = useRef(null);
//   const appStateRef = useRef(AppState.currentState);

//   // Check authentication status
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const userData = await AsyncStorage.getItem('userData');
        
//         if (token && userData) {
//           const user = JSON.parse(userData);
//           setUserId(user.id);
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//         }
//       } catch (error) {
//         console.error('Error checking auth:', error);
//         setIsAuthenticated(false);
//       }
//     };
    
//     checkAuth();
//   }, []);

//   // Initialize video prefetch when user is logged in
//   useEffect(() => {
//     const initVideoPrefetch = async () => {
//       try {
//         if (userId) {
//           await videoBackgroundfetch.init(userId);
//           const cachedVideos = await videoBackgroundfetch.getCachedVideos();
//           console.log('📦 Cached videos ready:', cachedVideos?.length || 0);
//         }
//       } catch (error) {
//         console.error('Error initializing video prefetch:', error);
//       }
//     };

//     initVideoPrefetch();
    
//     return () => {
//       if (backgroundTimerRef.current) {
//         clearTimeout(backgroundTimerRef.current);
//       }
//       stopBackgroundServices();
//     };
//   }, [userId]);
  
//   // Enhanced background cleanup
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       const currentState = appStateRef.current;
      
//       if (currentState === 'active' && nextAppState === 'background') {
//         console.log('📱 App going to background - cleaning up resources');
        
//         if (Platform.OS === 'android') {
//           pauseAllVideos();
//           stopWebRTCConnections();
          
//           setTimeout(() => {
//             clearAllCaches();
//             freeMemory();
            
//             if (global.__pendingRequests && global.__pendingRequests.length > 0) {
//               global.__pendingRequests.forEach((request, index) => {
//                 if (request && request.cancel) {
//                   request.cancel();
//                 }
//               });
//               global.__pendingRequests = [];
//             }
//           }, 500);
          
//           if (backgroundTimerRef.current) {
//             clearTimeout(backgroundTimerRef.current);
//           }
          
//           backgroundTimerRef.current = setTimeout(() => {
//             console.log('🕐 30 seconds in background - deep cleanup');
//             freeMemory();
//             if (global.__backgroundServicesRunning) {
//               stopBackgroundServices();
//               global.__backgroundServicesRunning = false;
//             }
//           }, 30000);
//         }
//       } else if (currentState === 'background' && nextAppState === 'active') {
//         console.log('📱 App coming to foreground - restoring resources');
        
//         if (backgroundTimerRef.current) {
//           clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = null;
//         }
        
//         if (!global.__backgroundServicesRunning && userId) {
//           InteractionManager.runAfterInteractions(() => {
//             backgroundFetchService.init();
//             startBackgroundContactSync();
//             setupContactSyncListener();
//             global.__backgroundServicesRunning = true;
//           });
//         }
        
//         InteractionManager.runAfterInteractions(() => {
//           console.log('✅ App resumed');
//         });
//       }
      
//       appStateRef.current = nextAppState;
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       subscription.remove();
//       if (backgroundTimerRef.current) {
//         clearTimeout(backgroundTimerRef.current);
//       }
//     };
//   }, [userId]);
  
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <CallProvider>
//         <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//         <NetworkStatusBanner />
//       </CallProvider>
//     </GestureHandlerRootView>
//   );
// }

// // ==================== ONLINE STATUS MANAGER COMPONENT ====================

// const OnlineStatusManager = ({ userId }) => {
//   // Only run if userId exists
//   if (!userId) {
//     return null;
//   }
  
//   useOnlineStatus(userId);
//   return null;
// };

// // ==================== THEMED NAVIGATOR ====================

// function ThemedNavigator({ isAuthenticated, userId }) {
//   const { theme, colors } = useTheme();
//   const [appState, setAppState] = useState(AppState.currentState);
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const customTheme = {
//     dark: theme === 'dark',
//     colors: {
//       primary: colors.primary,
//       background: colors.background,
//       card: colors.surface || colors.card || colors.background,
//       text: colors.text,
//       border: colors.border,
//       notification: colors.primary,
//     },
//     fonts: {
//       regular: {
//         fontFamily: 'System',
//         fontWeight: '400',
//       },
//       medium: {
//         fontFamily: 'System',
//         fontWeight: '500',
//       },
//       bold: {
//         fontFamily: 'System',
//         fontWeight: '700',
//       },
//       heavy: {
//         fontFamily: 'System',
//         fontWeight: '900',
//       },
//     },
//   };

//   useEffect(() => {
//     checkPinRequirement();
    
//     if (!global.__activeWebRTCConnections) {
//       global.__activeWebRTCConnections = [];
//     }
//     if (!global.__activeVideoRefs) {
//       global.__activeVideoRefs = [];
//     }
//     if (!global.__pendingRequests) {
//       global.__pendingRequests = [];
//     }
//     if (!global.__backgroundServicesRunning) {
//       global.__backgroundServicesRunning = true;
//     }
//   }, []);
  
//   const checkPinRequirement = async () => {
//     try {
//       const pinEnabled = await AsyncStorage.getItem('pin_enabled');
//       const token = await AsyncStorage.getItem('userToken');
      
//       if (pinEnabled === 'true' && token) {
//         const status = await checkPinStatus(token);
//         if (status && status.has_pin) {
//           setShowPinModal(true);
//         }
//       }
//     } catch (error) {
//       console.error('Error checking PIN requirement:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       if (appState.match(/inactive|background/) && nextAppState === 'active') {
//         if (global.__backgroundServicesRunning) {
//           backgroundFetchService.forceFetch();
//         }
//       }
//       setAppState(nextAppState);
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);
    
//     return () => {
//       subscription.remove();
//     };
//   }, [appState]);

//   useEffect(() => {
//     const initializeBackgroundServices = async () => {
//       if (userId && global.__backgroundServicesRunning) {
//         backgroundFetchService.init();
//         startBackgroundContactSync();
//         setupContactSyncListener();
        
//         setTimeout(() => {
//           backgroundFetchService.forceFetch();
//         }, 2000);
//       }
//     };

//     initializeBackgroundServices();

//     return () => {};
//   }, [userId]);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer ref={navigationRef}
//       linking={linking}
//       theme={customTheme}
//     >
//       {/* Only enable OnlineStatusManager when user is authenticated */}
//       {isAuthenticated && (
//         <OnlineStatusManager userId={userId} />
//       )}
      
//       <RNStatusBar 
//         barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background}
//       />

//       <PinUnlockModal 
//         visible={showPinModal}
//         onClose={() => setShowPinModal(false)}
//         navigation={navigationRef.current}
//       />
      
//       <Stack.Navigator
//         initialRouteName="Loginscreen"
//         screenOptions={{ 
//           headerShown: false,
//           contentStyle: { backgroundColor: colors.background }
//         }}
//       >
//         {/* ALL YOUR EXISTING SCREENS - KEEP EXACTLY AS THEY ARE */}
//         {/* ==================== AUTHENTICATION FLOW ==================== */}
//         <Stack.Screen name="Loginscreen">
//           {(props) => (
//             <ScreenWrapper>
//               <Loginscreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Signin">
//           {(props) => (
//             <ScreenWrapper>
//               <Signin {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         <Stack.Screen name="PostDetails">
//           {(props) => (
//             <ScreenWrapper>
//               <PostDetailS {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Signin_two">
//           {(props) => (
//             <ScreenWrapper>
//               <Signin_two {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Register">
//           {(props) => (
//             <ScreenWrapper>
//               <Register {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="OtherUserCatalog">
//           {(props) => (
//             <ScreenWrapper>
//               <OtherUserCatalog {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="OtherUserCatalogDetail">
//           {(props) => (
//             <ScreenWrapper>
//               <OtherUserCatalogDetail {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="VerificationCode">
//           {(props) => (
//             <ScreenWrapper>
//               <VerificationCode {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="LinkingScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <LinkingScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Biometric">
//           {(props) => (
//             <ScreenWrapper>
//               <Biometric {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ProceedOptions">
//           {(props) => (
//             <ScreenWrapper>
//               <ProceedOptions {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="GroupMembers">
//           {(props) => (
//             <ScreenWrapper>
//               <GroupMembers {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Terms">
//           {(props) => (
//             <ScreenWrapper>
//               <Terms {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="TermsCondition">
//           {(props) => (
//             <ScreenWrapper>
//               <TermsCondition {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="PrivacyPolicy">
//           {(props) => (
//             <ScreenWrapper>
//               <PrivacyPolicy {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== PERSONAL ACCOUNT FLOW ==================== */}
//         <Stack.Screen name="PHome">
//           {(props) => (
//             <ScreenWrapper>
//               <PHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="UserPersonalAccountProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <UserPersonalAccountProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SyncContactForBusiness">
//           {(props) => (
//             <ScreenWrapper>
//               <SyncContactForBusiness {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         <Stack.Screen name="PStatusBar">
//           {(props) => (
//             <ScreenWrapper>
//               <PStatusBar {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="StatusEditorScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <StatusEditorScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="JoinChannel">
//           {(props) => (
//             <ScreenWrapper>
//               <JoinChannel {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Calls">
//           {(props) => (
//             <ScreenWrapper>
//               <Calls {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CallOngoingScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <CallOngoingScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Settings">
//           {(props) => (
//             <ScreenWrapper>
//               <Settings {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="NotificationSetting">
//           {(props) => (
//             <ScreenWrapper>
//               <NotificationSetting {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="WallpaperSetting">
//           {(props) => (
//             <ScreenWrapper>
//               <WallpaperSetting {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="FaceSecuritySetting">
//           {(props) => (
//             <ScreenWrapper>
//               <FaceSecuritySetting {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         <Stack.Screen name="PrivateChat">
//           {(props) => (
//             <ScreenWrapper>
//               <PrivateChat {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== BUSINESS ACCOUNT FLOW ==================== */}
//         <Stack.Screen name="BusinessHome">
//           {(props) => (
//             <ScreenWrapper>
//               <BusinessHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ChannelDetails">
//           {(props) => (
//             <ScreenWrapper>
//               <ChannelDetails {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ChannelAdminManagement">
//           {(props) => (
//             <ScreenWrapper>
//               <ChannelAdminManagement {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BUserProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <BUserProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BStatusBar">
//           {(props) => (
//             <ScreenWrapper>
//               <BStatusBar {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BStatusEditorScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <BStatusEditorScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BJoinChannel">
//           {(props) => (
//             <ScreenWrapper>
//               <BJoinChannel {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BCalls">
//           {(props) => (
//             <ScreenWrapper>
//               <BCalls {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BCallOngoingScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <BCallOngoingScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BSettings">
//           {(props) => (
//             <ScreenWrapper>
//               <BSettings {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BNotificationSetting">
//           {(props) => (
//             <ScreenWrapper>
//               <BNotificationSetting {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BWallpaperSetting">
//           {(props) => (
//             <ScreenWrapper>
//               <BWallpaperSetting {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BFaceSecuritySetting">
//           {(props) => (
//             <ScreenWrapper>
//               <BFaceSecuritySetting {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ToolsScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <ToolsScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="QuickReplies">
//           {(props) => (
//             <ScreenWrapper>
//               <QuickReplies {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="AddQuickReply">
//           {(props) => (
//             <ScreenWrapper>
//               <AddQuickReply {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="EssentialPlatforms">
//           {(props) => (
//             <ScreenWrapper>
//               <EssentialPlatformsScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Advertise">
//           {(props) => (
//             <ScreenWrapper>
//               <Advertise {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ManageProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <ManageProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreateCatalog">
//           {(props) => (
//             <ScreenWrapper>
//               <CreateCatalog {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Explore">
//           {(props) => (
//             <ScreenWrapper>
//               <Explore {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="AddItemToCatalog">
//           {(props) => (
//             <ScreenWrapper>
//               <AddItemToCatalog {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="LabelChats">
//           {(props) => (
//             <ScreenWrapper>
//               <LabelChats {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Labels">
//           {(props) => (
//             <ScreenWrapper>
//               <Labels {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="AddQuickReplyScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <AddQuickReplyScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="GreetingMessage">
//           {(props) => (
//             <ScreenWrapper>
//               <GreetingMessage {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="AwayMessage">
//           {(props) => (
//             <ScreenWrapper>
//               <AwayMessage {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="HelpCenter">
//           {(props) => (
//             <ScreenWrapper>
//               <HelpCenter {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="HelpTopic">
//           {(props) => (
//             <ScreenWrapper>
//               <HelpTopic {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BusinessSetup">
//           {(props) => (
//             <ScreenWrapper>
//               <BusinessSetup {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ProductDetails">
//           {(props) => (
//             <ScreenWrapper>
//               <ProductDetails {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Cart">
//           {(props) => (
//             <ScreenWrapper>
//               <Cart {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="EmptyCart">
//           {(props) => (
//             <ScreenWrapper>
//               <EmptyCart {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Broadcast">
//           {(props) => (
//             <ScreenWrapper>
//               <Broadcast {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="OfficialSearch">
//           {(props) => (
//             <ScreenWrapper>
//               <OfficialSearch {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Live">
//           {(props) => (
//             <ScreenWrapper>
//               <Live {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="OoshBusiness">
//           {(props) => (
//             <ScreenWrapper>
//               <OoshBusiness {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreateChannel">
//           {(props) => (
//             <ScreenWrapper>
//               <CreateChannel {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="InviteChannelLink">
//           {(props) => (
//             <ScreenWrapper>
//               <InviteChannelLink {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Supplyrequest">
//           {(props) => (
//             <ScreenWrapper>
//               <Supplyrequest {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SupplyRequestForm">
//           {(props) => (
//             <ScreenWrapper>
//               <SupplyRequestForm {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SupplyServices">
//           {(props) => (
//             <ScreenWrapper>
//               <SupplyServices {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SupplyRequestDetail">
//           {(props) => (
//             <ScreenWrapper>
//               <SupplyRequestDetail {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreateServices">
//           {(props) => (
//             <ScreenWrapper>
//               <CreateServices {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SupplyRequestDetailScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <SupplyRequestDetailScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BroadcastHome">
//           {(props) => (
//             <ScreenWrapper>
//               <BroadcastHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreateBroadcastPost">
//           {(props) => (
//             <ScreenWrapper>
//               <CreateBroadcastPost {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ReportPost">
//           {(props) => (
//             <ScreenWrapper>
//               <ReportPost {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BroadcastUserProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <BroadcastUserProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="MarketPlace">
//           {(props) => (
//             <ScreenWrapper>
//               <MarketPlace {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreateListing">
//           {(props) => (
//             <ScreenWrapper>
//               <CreateListing {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ListingDetails">
//           {(props) => (
//             <ScreenWrapper>
//               <ListingDetails {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SuggestedFollowers">
//           {(props) => (
//             <ScreenWrapper>
//               <SuggestedFollowers {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ManagePost">
//           {(props) => (
//             <ScreenWrapper>
//               <ManagePost {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreatorDashboard">
//           {(props) => (
//             <ScreenWrapper>
//               <CreatorDashboard {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="MonetizationRequestForm">
//           {(props) => (
//             <ScreenWrapper>
//               <MonetizationRequestForm {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ChatAi">
//           {(props) => (
//             <ScreenWrapper>
//               <ChatAi {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ContractHome">
//           {(props) => (
//             <ScreenWrapper>
//               <ContractHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreateAdForm">
//           {(props) => (
//             <ScreenWrapper>
//               <CreateAdForm {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="AdReview">
//           {(props) => (
//             <ScreenWrapper>
//               <AdReview {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BroadcastSuccess">
//           {(props) => (
//             <ScreenWrapper>
//               <BroadcastSuccess {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="AllProducts">
//           {(props) => (
//             <ScreenWrapper>
//               <AllProducts {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         <Stack.Screen name="RequesterPostHistory">
//           {(props) => (
//             <ScreenWrapper>
//               <RequesterPostHistory {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen> 
        
//         <Stack.Screen name="BusinessGroupChat">
//           {(props) => (
//             <ScreenWrapper>
//               <BusinessGroupChat {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen> 
        
//         <Stack.Screen name="SupplierNotificationScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <SupplierNotificationScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen> 
        
//         <Stack.Screen name="BPrivateChat">
//           {(props) => (
//             <ScreenWrapper>
//               <BPrivateChat {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen> 
        
//         <Stack.Screen name="EarningWallet">
//           {(props) => (
//             <ScreenWrapper>
//               <EarningWallet {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         <Stack.Screen name="NinRegisterEarning">
//           {(props) => (
//             <ScreenWrapper>
//               <NinRegisterEarning {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         <Stack.Screen name="PurchaseData">
//           {(props) => (
//             <ScreenWrapper>
//               <PurchaseData {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="EarningDashbord">
//           {(props) => (
//             <ScreenWrapper>
//               <EarningDashbord {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="WithdrawEarning">
//           {(props) => (
//             <ScreenWrapper>
//               <WithdrawEarning {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="VideoAds">
//           {(props) => (
//             <ScreenWrapper>
//               <VideoAds {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== SOCIAL MEDIA FLOW ==================== */}
//         <Stack.Screen name="SocialHome">
//           {(props) => (
//             <ScreenWrapper>
//               <SocialHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Discover">
//           {(props) => (
//             <ScreenWrapper>
//               <Discover {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="UploadshortVideo">
//           {(props) => (
//             <ScreenWrapper>
//               <UploadshortVideo {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SearchShort">
//           {(props) => (
//             <ScreenWrapper>
//               <SearchShort {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== FEATURE SCREENS ==================== */}
//         <Stack.Screen name="Music">
//           {(props) => (
//             <ScreenWrapper>
//               <Music {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="GroupCreate">
//           {(props) => (
//             <ScreenWrapper>
//               <GroupCreate {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="GroupConnect">
//           {(props) => (
//             <ScreenWrapper>
//               <GroupConnect {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="UserContactList">
//           {(props) => (
//             <ScreenWrapper>
//               <UserContactList {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SynMessage">
//           {(props) => (
//             <ScreenWrapper>
//               <SynMessage {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SyncContactPersonal">
//           {(props) => (
//             <ScreenWrapper>
//               <SyncContactPersonal {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="UserContactListPersonalAccount">
//           {(props) => (
//             <ScreenWrapper>
//               <UserContactListPersonalAccount {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SyncMessagePersonal">
//           {(props) => (
//             <ScreenWrapper>
//               <SyncMessagePersonal {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CameraScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <CameraScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SongsList">
//           {(props) => (
//             <ScreenWrapper>
//               <SongsList {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="NewCommunity">
//           {(props) => (
//             <ScreenWrapper>
//               <NewCommunity {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="VideoCalls">
//           {(props) => (
//             <ScreenWrapper>
//               <VideoCalls {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="VoiceCalls">
//           {(props) => (
//             <ScreenWrapper>
//               <VoiceCalls {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="GoLive">
//           {(props) => (
//             <ScreenWrapper>
//               <GoLive {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="LiveStream">
//           {(props) => (
//             <ScreenWrapper>
//               <LiveStream {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ContactUs">
//           {(props) => (
//             <ScreenWrapper>
//               <ContactUs {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="SuccessStory">
//           {(props) => (
//             <ScreenWrapper>
//               <SuccessStory {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="OtherUserProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <OtherUserProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="LiveStreaming">
//           {(props) => (
//             <ScreenWrapper>
//               <LiveStreaming {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="GlobalIssueReport">
//           {(props) => (
//             <ScreenWrapper>
//               <GlobalIssueReport {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="NewsList">
//           {(props) => (
//             <ScreenWrapper>
//               <NewsList {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Broadcaster">
//           {(props) => (
//             <ScreenWrapper>
//               <Broadcaster {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Viewer">
//           {(props) => (
//             <ScreenWrapper>
//               <Viewer {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== MODAL SCREENS ==================== */}
//         <Stack.Screen
//           name="CallOverlay"
//           component={IncomingCallModal}
//           options={{
//             presentation: "transparentModal",
//             animation: "fade",
//             contentStyle: { backgroundColor: "transparent" },
//           }}
//         />
//       </Stack.Navigator>
      
//       {userId && <CallSignalListener userId={userId} />}
//     </NavigationContainer>
//   );
// }




// import React, { useEffect, useState, useRef } from "react";
// import { 
//   AppState, 
//   Platform, 
//   View, 
//   ActivityIndicator, 
//   StatusBar as RNStatusBar,
//   InteractionManager,
//   Image,
//   NativeModules,
//   LogBox
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { useOnlineStatus } from './src/hooks/useOnlineStatus';
// import { NotificationProvider, useNotification } from './src/context/NotificationContext';

// // Create navigation ref
// const navigationRef = React.createRef();

// // ==================== NAVIGATION PERSISTENCE KEYS ====================
// const NAVIGATION_STATE_KEY = 'NAVIGATION_STATE';

// // Save navigation state function
// const saveNavigationState = async (state) => {
//   try {
//     if (state) {
//       await AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
//       console.log('✅ Navigation state saved');
//     }
//   } catch (error) {
//     console.error('Failed to save navigation state:', error);
//   }
// };

// // Load navigation state function
// const loadNavigationState = async () => {
//   try {
//     const state = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
//     if (state) {
//       console.log('✅ Navigation state loaded');
//       return JSON.parse(state);
//     }
//   } catch (error) {
//     console.error('Failed to load navigation state:', error);
//   }
//   return undefined;
// };

// // Ignore specific warnings
// LogBox.ignoreLogs([
//   'new NativeEventEmitter',
//   'Require cycle:',
//   'VirtualizedLists should never be nested',
// ]);

// // Import checkPinStatus from the correct location
// import { checkPinStatus } from './showa_personal_account_screen/FaceSecuritySetting';
// import PinUnlockModal from './screens/PinUnlockModal';
// import videoBackgroundfetch from './src/services/VideoBackgroundFetch';

// // Theme Context
// import { ThemeProvider } from './src/context/ThemeContext';

// // Import useTheme here (BEFORE using it in components)
// import { useTheme } from './src/context/ThemeContext';

// // Components & Context
// import { CallProvider } from './components/CallContext';
// import CallSignalListener from "./components/CallSignalListener";
// import IncomingCallModal from './components/IncomingCallModal';

// import NetworkStatusBanner from "./components/Networkstatusbanner";

// // Services
// import { startBackgroundContactSync, setupContactSyncListener } from "./components/BackgroundSync";
// import backgroundFetchService from "./src/services/BackgroundFetchService";

// // ==================== SCREEN IMPORTS ====================

// // Authentication & Onboarding Screens
// import Loginscreen from './screens/Loginscreen';
// import Signin from './screens/onboard/SignIn';
// import Signin_two from './screens/onboard/SignIn2_two';
// import TermsCondition from './screens/onboard/Terms';
// import PrivacyPolicy from './screens/onboard/PrivacyPolicy';
// import Register from './screens/onboard/Register';
// import Biometric from './screens/onboard/Biometric';
// import LinkingScreen from './screens/onboard/LinkingScreen';
// import VerificationCode from "./screens/onboard/VerifyEmail";
// import ProceedOptions from './screens/ProceedOptions';
// import Terms from './screens/TermsPrivacyScreen';

// // Personal Account Screens
// import PHome from './showa_personal_account_screen/PHome';
// import UserPersonalAccountProfile from './screens/profiles/UserPersonalAccountProfile';
// import PStatusBar from './showa_personal_account_screen/StatusBar';
// import StatusEditorScreen from './showa_personal_account_screen/StatusEditorScreen';
// import JoinChannel from './showa_personal_account_screen/JoinChannel';
// import Calls from './showa_personal_account_screen/Calls';
// import CallOngoingScreen from './showa_personal_account_screen/CallOngoingScreen';
// import Settings from './showa_personal_account_screen/Settings';
// import NotificationSetting from './showa_personal_account_screen/NotificationSetting';
// import WallpaperSetting from './showa_personal_account_screen/WallpaperSetting';
// import FaceSecuritySetting from './showa_personal_account_screen/FaceSecuritySetting';
// import PrivateChat from './showa_personal_account_screen/PrivateChat';

// // Business Account Screens
// import ChannelDetails from './showa_business/ChannelDetails';
// import PostDetails from './showa_business/PostDetailScreen';
// import BusinessHome from './showa_business/Home';
// import ChatAi from './showa_business/ChatAi';
// import MonetizationRequestForm from './showa_business/MonetizationRequestForm';
// import BUserProfile from './showa_business/UserProfile';
// import BStatusBar from './showa_business/StatusBar';
// import BStatusEditorScreen from './showa_business/StatusEditorScreen';
// import BJoinChannel from './showa_business/JoinChannel';
// import BCalls from './showa_business/Calls';
// import BCallOngoingScreen from './showa_business/CallOngoingScreen';
// import BSettings from './showa_business/Settings';
// import BNotificationSetting from './showa_business/NotificationSetting';
// import BWallpaperSetting from './showa_business/WallpaperSetting';
// import BFaceSecuritySetting from './showa_business/FaceSecuritySetting';
// import ToolsScreen from './showa_business/ToolsScreen';
// import QuickReplies from './showa_business/QuickReplies';
// import AddQuickReply from './showa_business/AddQuickReply';
// import EssentialPlatformsScreen from './showa_business/EssentialPlatformsScreen';
// import Advertise from './showa_business/Advertise';
// import ManageProfile from './showa_business/ManageProfile';
// import CreateCatalog from './showa_business/CreateCatalog';
// import AddItemToCatalog from './showa_business/AddItemToCatalog';
// import Explore from './showa_business/Explore';
// import LabelChats from './showa_business/LabelChatsScreen';
// import Labels from './showa_business/LabelsScreen';
// import AddQuickReplyScreen from './showa_business/AddQuickReplyScreen';
// import GreetingMessage from './showa_business/GreetingMessage';
// import AwayMessage from './showa_business/AwayMessageScreen';
// import HelpCenter from './showa_business/HelpCenterScreen';
// import HelpTopic from './showa_business/HelpTopicScreen';
// import BusinessSetup from './showa_business/BusinessSetupScreen';
// import ProductDetails from './showa_business/ProductDetailsScreen';
// import Cart from './showa_business/CartScreen';
// import ChannelAdminManagement from './showa_business/ChannelAdminManagement';
// import EmptyCart from './showa_business/EmptyCartScreen';
// import OoshBusiness from './showa_business/OoshBusinessScreen';
// import Live from './showa_business/LiveScreen';
// import Broadcast from './showa_business/Broadcast';
// import OfficialSearch from './showa_business/OfficialSearchScreen';
// import CreateChannel from './showa_business/CreateChannel';
// import InviteChannelLink from './showa_business/InviteChannelLink';
// import Supplyrequest from './showa_business/SupplyRequest';
// import SupplyRequestForm from './showa_business/SupplyRequestForm';
// import SupplyServices from './showa_business/SupplyServices';
// import SupplyRequestDetail from './showa_business/SupplyRequestDetail';
// import CreateServices from './showa_business/CreateServices';
// import SupplyRequestDetailScreen from './showa_business/SupplyRequestDetailScreen';
// import BroadcastHome from './showa_business/BroadcastHome';
// import CreateBroadcastPost from './showa_business/CreateBroadcastPost';
// import ReportPost from './showa_business/ReportPost';
// import BroadcastUserProfile from './showa_business/BroadcastUserProfile';
// import MarketPlace from './showa_business/MarketPlace';
// import CreateListing from './showa_business/CreateListing';
// import ListingDetails from './showa_business/ListingDetails';
// import SuggestedFollowers from './showa_business/SuggestedFollowers';
// import ManagePost from './showa_business/ManagePost';
// import CreatorDashboard from './showa_business/CreatorDashboardScreen';
// import ContractHome from './showa_business/contracts/ContractHome';
// import CreateAdForm from './showa_business/ads/CreateAdFormScreen';
// import AdReview from './showa_business/ads/AdReview';
// import BroadcastSuccess from './showa_business/BroadcastSuccess';
// import AllProducts from './showa_business/AllProducts';
// import OtherUserCatalog from './showa_business/OthersUserCatalog';
// import OtherUserCatalogDetail from './showa_business/OtherUserCatalogDetail';
// import BPrivateChat from './showa_business/BusinessChat';
// import BusinessGroupChat from './showa_business/BusinessGroupChat';
// import SupplierNotificationScreen from './showa_business/SupplierNotificationScreen';
// import RequesterPostHistory from './showa_business/RequesterPostHistory';
// import GroupMembers from './showa_business/GroupMembers';

// // Social Media Screens
// import SocialHome from './showa_social/Home';
// import Discover from './showa_social/Discover';
// import UploadshortVideo from './showa_social/UploadshortVideo';
// import SearchShort from './showa_social/SearchShort';

// // Feature Components
// import GroupCreate from './screens/GroupCreate';
// import GroupConnect from './screens/GroupConnect';
// import UserContactListPersonalAccount from './components/UserContactListPersonalAccount';
// import UpdateModal from './components/UpdateModal';
// import Music from './components/Music';
// import UserContactList from './components/UserContactList';
// import SyncMessagePersonal from './components/SyncMessagePersonal';
// import SyncContactForBusiness from './components/SyncContactForBusiness';
// import CameraScreen from './components/CameraScreen';
// import SongsList from './components/SongsListScreen';
// import NewCommunity from './components/NewCommunityScreen';
// import VideoCalls from './components/VideoCalls';
// import VoiceCalls from './components/VoiceCalls';
// import GoLive from './components/GoLive';
// import LiveStream from './components/LiveStream';
// import ContactUs from './components/ContactUs';
// import SuccessStory from './components/SuccessStory';
// import OtherUserProfile from "./screens/profiles/OtherUserProfile";
// import EarningDashbord from "./screens/earning/EarningDashbord";
// import WithdrawEarning from "./screens/earning/WithdrawEarning";
// import PurchaseData from "./screens/earning/PurchaseData";
// import NinRegisterEarning from "./screens/earning/NinRegisterEarning";
// import VideoAds from "./screens/earning/VideoAds";
// import EarningWallet from "./screens/earning/EarningWallet";
// import SynMessage from './components/SynMessage';
// import SyncContactPersonal from './components/UserContactPersonal';
// import LiveStreaming from "./src/LiveStreaming";
// import useAppUpdate from "./src/hooks/useAppUpdate";
// import NotificationsScreen from "./screens/NotificationsScreen";
// import GlobalIssueReport from "./components/GlobalIssueReport";
// import NewsList from "./components/NewsList";
// import Broadcaster from "./src/Broadcaster";
// import Viewer from "./src/Viewer";

// // ==================== HELPER FUNCTIONS ====================

// // Clear image cache helper function
// const clearImageCache = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Clear React Native's image cache using Image.queryCache
//       Image.queryCache && Image.queryCache([], (cacheResponse) => {
//         if (cacheResponse && Object.keys(cacheResponse).length > 0) {
//           const urls = Object.keys(cacheResponse);
//           console.log(`Found ${urls.length} cached images to clear`);
//         }
//       });
//     }
    
//     // Clear in-memory image cache by setting a flag
//     global.__imageCacheCleared = Date.now();
    
//     console.log('✅ Image cache cleared');
//   } catch (error) {
//     console.error('Error clearing image cache:', error);
//   }
// };

// // Clear WebView cache helper
// const clearWebViewCache = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Clear WebView cache using native module if available
//       const { WebViewManager } = NativeModules;
//       if (WebViewManager && WebViewManager.clearCache) {
//         await WebViewManager.clearCache();
//       }
//     }
//   } catch (error) {
//     console.error('Error clearing WebView cache:', error);
//   }
// };

// // Clear all caches helper
// const clearAllCaches = async () => {
//   try {
//     await clearImageCache();
//     await clearWebViewCache();
    
//     // Clear AsyncStorage temporary data if needed
//     const allKeys = await AsyncStorage.getAllKeys();
//     const keysToClear = allKeys.filter(key => 
//       key.includes('temp_') || 
//       key.includes('cache_') || 
//       key.includes('_preview') ||
//       key.includes('video_cache_')
//     );
    
//     if (keysToClear.length > 0) {
//       await AsyncStorage.multiRemove(keysToClear);
//       console.log(`Cleared ${keysToClear.length} temporary cache items`);
//     }
//   } catch (error) {
//     console.error('Error clearing all caches:', error);
//   }
// };

// // Free up memory helper
// // const freeMemory = () => {
// //   if (Platform.OS === 'android') {
// //     try {
// //       // Suggest garbage collection (only works in debug builds)
// //       if (global.gc) {
// //         global.gc();
// //       }
      
// //       // Clear any large objects from memory
// //       if (global.__largeImageCache) {
// //         delete global.__largeImageCache;
// //       }
      
// //       // Clear video prefetch cache if too large
// //       if (global.__videoPrefetchCache) {
// //         delete global.__videoPrefetchCache;
// //       }
      
// //       console.log('✅ Memory cleanup triggered');
// //     } catch (error) {
// //       console.error('Error freeing memory:', error);
// //     }
// //   }
// // };

// const freeMemory = () => {
//   if (Platform.OS === 'android') {
//     try {
//       // REMOVE: global.gc() - NEVER force GC in production
//       // REMOVE: Deleting global objects
      
//       // Only do safe operations:
//       if (Platform.OS === 'android' && global.__imageCacheCleared) {
//         // Just log, don't force cleanup
//         console.log('Memory management skipped - letting system handle it');
//       }
//     } catch (error) {
//       console.error('Error in memory management:', error);
//     }
//   }
// };

// // Stop WebRTC connections helper
// const stopWebRTCConnections = () => {
//   try {
//     // If you have WebRTC connections stored globally, clean them up
//     if (global.__activeWebRTCConnections && global.__activeWebRTCConnections.length > 0) {
//       global.__activeWebRTCConnections.forEach(connection => {
//         if (connection && connection.close) {
//           try {
//             connection.close();
//           } catch (e) {
//             console.error('Error closing WebRTC connection:', e);
//           }
//         }
//       });
//       global.__activeWebRTCConnections = [];
//       console.log('✅ WebRTC connections closed');
//     }
//   } catch (error) {
//     console.error('Error stopping WebRTC connections:', error);
//   }
// };

// // Pause video playback helper
// const pauseAllVideos = () => {
//   try {
//     // If you have video refs stored globally
//     if (global.__activeVideoRefs && global.__activeVideoRefs.length > 0) {
//       global.__activeVideoRefs.forEach(videoRef => {
//         if (videoRef && videoRef.current && typeof videoRef.current.pause === 'function') {
//           videoRef.current.pause();
//         }
//       });
//       console.log(`✅ Paused ${global.__activeVideoRefs.length} videos`);
//     }
//   } catch (error) {
//     console.error('Error pausing videos:', error);
//   }
// };

// // Stop background services
// const stopBackgroundServices = () => {
//   try {
//     if (global.__backgroundSyncInterval) {
//       clearInterval(global.__backgroundSyncInterval);
//       global.__backgroundSyncInterval = null;
//     }
    
//     if (global.__contactSyncListener && global.__contactSyncListener.remove) {
//       global.__contactSyncListener.remove();
//       global.__contactSyncListener = null;
//     }
    
//     backgroundFetchService.stop();
//     console.log('✅ Background services stopped');
//   } catch (error) {
//     console.error('Error stopping background services:', error);
//   }
// };

// // ==================== LINKING CONFIG ====================


// import { Linking } from 'react-native';

// const linking = {
//   prefixes: ['showa://', 'https://showapp.com', 'http://showapp.com'],
//   config: {
//     screens: {
//       // Your existing deep link
//       AiResetPassword: 'reset-password',
      
//       // Post deep linking
//       PostDetail: {
//         path: 'post/:postId',
//         parse: {
//           postId: (id) => id,
//         },
//       },
      
//       // User profile deep linking
//       UserProfile: {
//         path: 'user/:userId',
//         parse: {
//           userId: (id) => id,
//         },
//       },
      
//       // Fallback for any other deep links
//       NotFound: '*',
//     },
//   },
//   // Custom function to get initial URL
//   getInitialURL: async () => {
//     const initialUrl = await Linking.getInitialURL();
//     console.log('Initial URL:', initialUrl);
//     return initialUrl;
//   },
//   // Subscribe to URL changes
//   subscribe: (listener) => {
//     const onReceiveURL = ({ url }) => {
//       console.log('Received URL:', url);
//       listener(url);
//     };
    
//     // Listen to incoming links
//     const subscription = Linking.addEventListener('url', onReceiveURL);
    
//     return () => {
//       subscription.remove();
//     };
//   },
// };

// // ==================== NAVIGATION SETUP ====================

// const Stack = createNativeStackNavigator();

// // Screen wrapper - This provides the theme background for ALL screens
// const ScreenWrapper = ({ children }) => {
//   const { colors } = useTheme();
  
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {children}
//     </View>
//   );
// };

// // ==================== MAIN APP COMPONENT ====================

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <NotificationProvider>
//           <AppContent />
//         </NotificationProvider>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// // ==================== APP CONTENT ====================

// function AppContent() {
//   const [userId, setUserId] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const backgroundTimerRef = useRef(null);
//   const appStateRef = useRef(AppState.currentState);

//   const updateCheckTimerRef = useRef(null);

//   const { initializeNotifications } = useNotification();

//   useEffect(() => {
//     const setup = async () => {
//       await initializeNotifications();
//     };
//     setup();
//   }, []);

//   const {
//     updateInfo,
//     showModal: showUpdateModal,
//     dismissModal: dismissUpdateModal,
//     checkForUpdate,
//   } = useAppUpdate(true);

//   // Check authentication status

//   useEffect(() => {
//   const checkAuth = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userData = await AsyncStorage.getItem('userData');
      
//       if (token && userData) {
//         const user = JSON.parse(userData);
//         setUserId(user.id);
//         setIsAuthenticated(true);
        
//         // ADD THIS - Check for updates when user is authenticated
//         setTimeout(() => {
//           checkForUpdate(true);
//         }, 2000);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Error checking auth:', error);
//       setIsAuthenticated(false);
//     }
//   };
  
//   checkAuth();
// }, []);
//   // useEffect(() => {
//   //   const checkAuth = async () => {
//   //     try {
//   //       const token = await AsyncStorage.getItem('userToken');
//   //       const userData = await AsyncStorage.getItem('userData');
        
//   //       if (token && userData) {
//   //         const user = JSON.parse(userData);
//   //         setUserId(user.id);
//   //         setIsAuthenticated(true);
//   //       } else {
//   //         setIsAuthenticated(false);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error checking auth:', error);
//   //       setIsAuthenticated(false);
//   //     }
//   //   };
    
//   //   checkAuth();
//   // }, []);

//   // Initialize video prefetch when user is logged in
//   useEffect(() => {
//     const initVideoPrefetch = async () => {
//       try {
//         if (userId) {
//           await videoBackgroundfetch.init(userId);
//           const cachedVideos = await videoBackgroundfetch.getCachedVideos();
//           console.log('📦 Cached videos ready:', cachedVideos?.length || 0);
//         }
//       } catch (error) {
//         console.error('Error initializing video prefetch:', error);
//       }
//     };

//     initVideoPrefetch();
    
//     return () => {
//       if (backgroundTimerRef.current) {
//         clearTimeout(backgroundTimerRef.current);
//       }
//       stopBackgroundServices();
//     };
//   }, [userId]);
  
//   // Enhanced background cleanup - MODIFIED to preserve state
//   // useEffect(() => {
//   //   const handleAppStateChange = (nextAppState) => {
//   //     const currentState = appStateRef.current;
      
//   //     if (currentState === 'active' && nextAppState === 'background') {
//   //       console.log('📱 App going to background - preserving state');
        
//   //       if (Platform.OS === 'android') {
//   //         pauseAllVideos();
//   //         stopWebRTCConnections();
          
//   //         // REMOVED: clearAllCaches() and freeMemory() - these were causing screen refreshes
//   //         // Only pause activities, don't clear caches aggressively
          
//   //         if (backgroundTimerRef.current) {
//   //           clearTimeout(backgroundTimerRef.current);
//   //         }
          
//   //         backgroundTimerRef.current = setTimeout(() => {
//   //           console.log('🕐 30 seconds in background - light cleanup only');
//   //           // Only free memory if needed, but preserve navigation state
//   //           freeMemory();
//   //         }, 30000);
//   //       }
//   //     } else if (currentState === 'background' && nextAppState === 'active') {
//   //       console.log('📱 App coming to foreground - restoring from saved state');
        
//   //       if (backgroundTimerRef.current) {
//   //         clearTimeout(backgroundTimerRef.current);
//   //         backgroundTimerRef.current = null;
//   //       }
        
//   //       // Restore background services if needed
//   //       if (!global.__backgroundServicesRunning && userId) {
//   //         InteractionManager.runAfterInteractions(() => {
//   //           backgroundFetchService.init();
//   //           startBackgroundContactSync();
//   //           setupContactSyncListener();
//   //           global.__backgroundServicesRunning = true;
//   //         });
//   //       }
        
//   //       InteractionManager.runAfterInteractions(() => {
//   //         console.log('✅ App resumed - screen state preserved');
//   //       });
//   //     }
      
//   //     appStateRef.current = nextAppState;
//   //   };

//   //   const subscription = AppState.addEventListener('change', handleAppStateChange);

//   //   return () => {
//   //     subscription.remove();
//   //     if (backgroundTimerRef.current) {
//   //       clearTimeout(backgroundTimerRef.current);
//   //     }
//   //   };
//   // }, [userId]);
//   useEffect(() => {
//   const handleAppStateChange = (nextAppState) => {
//     const currentState = appStateRef.current;
    
//     if (currentState === 'active' && nextAppState === 'background') {
//       console.log('📱 App going to background - preserving state');

//       if (navigationRef.current) {
//         const currentNavState = navigationRef.current.getRootState();
//         saveNavigationState(currentNavState); // fire-and-forget, no await
//       }
      
//       if (Platform.OS === 'android') {
//         pauseAllVideos();
//         stopWebRTCConnections();
        
//         if (backgroundTimerRef.current) {
//           clearTimeout(backgroundTimerRef.current);
//         }
        
//         backgroundTimerRef.current = setTimeout(() => {
//           console.log('🕐 30 seconds in background - light cleanup only');
//           freeMemory();
//         }, 30000);
//       }
//     } else if (currentState === 'background' && nextAppState === 'active') {
//       console.log('📱 App coming to foreground - restoring from saved state');
      
//       if (backgroundTimerRef.current) {
//         clearTimeout(backgroundTimerRef.current);
//         backgroundTimerRef.current = null;
//       }
      
//       // ADD THIS - Check for updates when app comes to foreground
//       if (isAuthenticated) {
//         setTimeout(() => {
//           checkForUpdate(true);
//         }, 1000);
//       }
      
//       // Restore background services if needed
//       if (!global.__backgroundServicesRunning && userId) {
//         InteractionManager.runAfterInteractions(() => {
//           backgroundFetchService.init();
//           startBackgroundContactSync();
//           setupContactSyncListener();
//           global.__backgroundServicesRunning = true;
//         });
//       }
      
//       InteractionManager.runAfterInteractions(() => {
//         console.log('✅ App resumed - screen state preserved');
//       });
//     }
    
//     appStateRef.current = nextAppState;
//   };

//   const subscription = AppState.addEventListener('change', handleAppStateChange);

//   return () => {
//     subscription.remove();
//     if (backgroundTimerRef.current) {
//       clearTimeout(backgroundTimerRef.current);
//     }
//   };
// }, [userId, isAuthenticated]);
//   return (
//     // <GestureHandlerRootView style={{ flex: 1 }}>
//     //   <CallProvider>
//     //     <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//     //     <NetworkStatusBanner />
//     //   </CallProvider>
//     // </GestureHandlerRootView>
//     <GestureHandlerRootView style={{ flex: 1 }}>
//     <CallProvider>
//       <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//       <NetworkStatusBanner />
      
     
//       {updateInfo && updateInfo.update_available && (
//         <UpdateModal
//           visible={showUpdateModal}
//           updateInfo={updateInfo}
//           onClose={dismissUpdateModal}
//         />
//       )}
//     </CallProvider>
//   </GestureHandlerRootView>
//   );
// }

// // ==================== ONLINE STATUS MANAGER COMPONENT ====================

// const OnlineStatusManager = ({ userId }) => {
//   // Only run if userId exists
//   if (!userId) {
//     return null;
//   }
  
//   useOnlineStatus(userId);
//   return null;
// };

// // ==================== THEMED NAVIGATOR ====================

// function ThemedNavigator({ isAuthenticated, userId }) {
//   const { theme, colors } = useTheme();
//   const [appState, setAppState] = useState(AppState.currentState);
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNavigationReady, setIsNavigationReady] = useState(false);
//   const [initialNavigationState, setInitialNavigationState] = useState(undefined);
  
//   // Navigation persistence ref
//   const navigationStateSaveTimer = useRef(null);

//   const customTheme = {
//     dark: theme === 'dark',
//     colors: {
//       primary: colors.primary,
//       background: colors.background,
//       card: colors.surface || colors.card || colors.background,
//       text: colors.text,
//       border: colors.border,
//       notification: colors.primary,
//     },
//     fonts: {
//       regular: {
//         fontFamily: 'System',
//         fontWeight: '400',
//       },
//       medium: {
//         fontFamily: 'System',
//         fontWeight: '500',
//       },
//       bold: {
//         fontFamily: 'System',
//         fontWeight: '700',
//       },
//       heavy: {
//         fontFamily: 'System',
//         fontWeight: '900',
//       },
//     },
//   };

//   // Load saved navigation state on startup
//   useEffect(() => {
//     const restoreNavigationState = async () => {
//       try {
//         const savedState = await loadNavigationState();
//         if (savedState) {
//           setInitialNavigationState(savedState);
//           console.log('📱 Navigation state restored successfully');
//         }
//       } catch (error) {
//         console.error('Error restoring navigation state:', error);
//       } finally {
//         setIsNavigationReady(true);
//       }
//     };

//     restoreNavigationState();
//   }, []);

//   // Save navigation state when it changes
//   const handleNavigationStateChange = async (state) => {
//     if (state && navigationRef.current) {
//       // Debounce save to avoid too many writes
//       if (navigationStateSaveTimer.current) {
//         clearTimeout(navigationStateSaveTimer.current);
//       }
      
//       navigationStateSaveTimer.current = setTimeout(async () => {
//         await saveNavigationState(state);
//       }, 1000);
//     }
//   };

//   useEffect(() => {
//     checkPinRequirement();
    
//     if (!global.__activeWebRTCConnections) {
//       global.__activeWebRTCConnections = [];
//     }
//     if (!global.__activeVideoRefs) {
//       global.__activeVideoRefs = [];
//     }
//     if (!global.__pendingRequests) {
//       global.__pendingRequests = [];
//     }
//     if (!global.__backgroundServicesRunning) {
//       global.__backgroundServicesRunning = true;
//     }

//     // Cleanup timer on unmount
//     return () => {
//       if (navigationStateSaveTimer.current) {
//         clearTimeout(navigationStateSaveTimer.current);
//       }
//     };
//   }, []);
  
//   const checkPinRequirement = async () => {
//     try {
//       const pinEnabled = await AsyncStorage.getItem('pin_enabled');
//       const token = await AsyncStorage.getItem('userToken');
      
//       if (pinEnabled === 'true' && token) {
//         const status = await checkPinStatus(token);
//         if (status && status.has_pin) {
//           setShowPinModal(true);
//         }
//       }
//     } catch (error) {
//       console.error('Error checking PIN requirement:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle app state changes - preserve navigation, don't reset
//   // useEffect(() => {
//   //   const handleAppStateChange = async (nextAppState) => {
//   //     console.log('Navigation app state:', appState, '->', nextAppState);
      
//   //     if (appState === 'active' && nextAppState === 'background') {
//   //       // Save navigation state when going to background
//   //       console.log('💾 Saving navigation state before background');
//   //       if (navigationRef.current) {
//   //         const currentState = navigationRef.current.getRootState();
//   //         await saveNavigationState(currentState);
//   //       }
//   //     } else if (appState === 'background' && nextAppState === 'active') {
//   //       // App coming to foreground - no need to restore, just continue
//   //       console.log('🔄 App foreground - navigation state preserved');
//   //     }
      
//   //     setAppState(nextAppState);
//   //   };

//   //   const subscription = AppState.addEventListener('change', handleAppStateChange);
    
//   //   return () => {
//   //     subscription.remove();
//   //   };
//   // }, [appState]);

//   useEffect(() => {
//     const initializeBackgroundServices = async () => {
//       if (userId && global.__backgroundServicesRunning) {
//         backgroundFetchService.init();
//         startBackgroundContactSync();
//         setupContactSyncListener();
        
//         setTimeout(() => {
//           backgroundFetchService.forceFetch();
//         }, 2000);
//       }
//     };

//     initializeBackgroundServices();

//     return () => {};
//   }, [userId]);

//   if (isLoading || !isNavigationReady) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//       <NavigationContainer 
//         ref={navigationRef}
//         linking={linking}
//         theme={customTheme}
//         initialState={initialNavigationState}
//         onStateChange={handleNavigationStateChange}
//       >
//         {/* Only enable OnlineStatusManager when user is authenticated */}
//         {isAuthenticated && (
//           <OnlineStatusManager userId={userId} />
//         )}
        
//         <RNStatusBar 
//           barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
//           backgroundColor={colors.background}
//         />

//         <PinUnlockModal 
//           visible={showPinModal}
//           onClose={() => setShowPinModal(false)}
//           navigation={navigationRef.current}
//         />
        
//         <Stack.Navigator
//           initialRouteName="Loginscreen"
//           screenOptions={{ 
//             headerShown: false,
//             contentStyle: { backgroundColor: colors.background },
//             // Keep screens mounted when navigating away
//             detachPreviousScreen: false,
//           }}
//         >
//           {/* ALL YOUR EXISTING SCREENS - KEEP EXACTLY AS THEY ARE */}
//           {/* ==================== AUTHENTICATION FLOW ==================== */}
//           <Stack.Screen name="Loginscreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <Loginscreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Signin">
//             {(props) => (
//               <ScreenWrapper>
//                 <Signin {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="PostDetails">
//             {(props) => (
//               <ScreenWrapper>
//                 <PostDetails {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Signin_two">
//             {(props) => (
//               <ScreenWrapper>
//                 <Signin_two {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Register">
//             {(props) => (
//               <ScreenWrapper>
//                 <Register {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="OtherUserCatalog">
//             {(props) => (
//               <ScreenWrapper>
//                 <OtherUserCatalog {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="OtherUserCatalogDetail">
//             {(props) => (
//               <ScreenWrapper>
//                 <OtherUserCatalogDetail {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="VerificationCode">
//             {(props) => (
//               <ScreenWrapper>
//                 <VerificationCode {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="LinkingScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <LinkingScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Biometric">
//             {(props) => (
//               <ScreenWrapper>
//                 <Biometric {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ProceedOptions">
//             {(props) => (
//               <ScreenWrapper>
//                 <ProceedOptions {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="GroupMembers">
//             {(props) => (
//               <ScreenWrapper>
//                 <GroupMembers {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Terms">
//             {(props) => (
//               <ScreenWrapper>
//                 <Terms {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="TermsCondition">
//             {(props) => (
//               <ScreenWrapper>
//                 <TermsCondition {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="PrivacyPolicy">
//             {(props) => (
//               <ScreenWrapper>
//                 <PrivacyPolicy {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           {/* ==================== PERSONAL ACCOUNT FLOW ==================== */}
//           <Stack.Screen name="PHome">
//             {(props) => (
//               <ScreenWrapper>
//                 <PHome {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="UserPersonalAccountProfile">
//             {(props) => (
//               <ScreenWrapper>
//                 <UserPersonalAccountProfile {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SyncContactForBusiness">
//             {(props) => (
//               <ScreenWrapper>
//                 <SyncContactForBusiness {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="PStatusBar">
//             {(props) => (
//               <ScreenWrapper>
//                 <PStatusBar {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="StatusEditorScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <StatusEditorScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="JoinChannel">
//             {(props) => (
//               <ScreenWrapper>
//                 <JoinChannel {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Calls">
//             {(props) => (
//               <ScreenWrapper>
//                 <Calls {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CallOngoingScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <CallOngoingScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Settings">
//             {(props) => (
//               <ScreenWrapper>
//                 <Settings {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="NotificationsScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <NotificationsScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
//           <Stack.Screen name="NotificationSetting">
//             {(props) => (
//               <ScreenWrapper>
//                 <NotificationSetting {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="WallpaperSetting">
//             {(props) => (
//               <ScreenWrapper>
//                 <WallpaperSetting {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="FaceSecuritySetting">
//             {(props) => (
//               <ScreenWrapper>
//                 <FaceSecuritySetting {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="PrivateChat">
//             {(props) => (
//               <ScreenWrapper>
//                 <PrivateChat {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           {/* ==================== BUSINESS ACCOUNT FLOW ==================== */}
//           <Stack.Screen name="BusinessHome">
//             {(props) => (
//               <ScreenWrapper>
//                 <BusinessHome {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ChannelDetails">
//             {(props) => (
//               <ScreenWrapper>
//                 <ChannelDetails {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ChannelAdminManagement">
//             {(props) => (
//               <ScreenWrapper>
//                 <ChannelAdminManagement {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BUserProfile">
//             {(props) => (
//               <ScreenWrapper>
//                 <BUserProfile {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BStatusBar">
//             {(props) => (
//               <ScreenWrapper>
//                 <BStatusBar {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BStatusEditorScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <BStatusEditorScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BJoinChannel">
//             {(props) => (
//               <ScreenWrapper>
//                 <BJoinChannel {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BCalls">
//             {(props) => (
//               <ScreenWrapper>
//                 <BCalls {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BCallOngoingScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <BCallOngoingScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BSettings">
//             {(props) => (
//               <ScreenWrapper>
//                 <BSettings {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BNotificationSetting">
//             {(props) => (
//               <ScreenWrapper>
//                 <BNotificationSetting {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BWallpaperSetting">
//             {(props) => (
//               <ScreenWrapper>
//                 <BWallpaperSetting {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BFaceSecuritySetting">
//             {(props) => (
//               <ScreenWrapper>
//                 <BFaceSecuritySetting {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ToolsScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <ToolsScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="QuickReplies">
//             {(props) => (
//               <ScreenWrapper>
//                 <QuickReplies {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="AddQuickReply">
//             {(props) => (
//               <ScreenWrapper>
//                 <AddQuickReply {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="EssentialPlatforms">
//             {(props) => (
//               <ScreenWrapper>
//                 <EssentialPlatformsScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Advertise">
//             {(props) => (
//               <ScreenWrapper>
//                 <Advertise {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ManageProfile">
//             {(props) => (
//               <ScreenWrapper>
//                 <ManageProfile {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CreateCatalog">
//             {(props) => (
//               <ScreenWrapper>
//                 <CreateCatalog {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Explore">
//             {(props) => (
//               <ScreenWrapper>
//                 <Explore {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="AddItemToCatalog">
//             {(props) => (
//               <ScreenWrapper>
//                 <AddItemToCatalog {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="LabelChats">
//             {(props) => (
//               <ScreenWrapper>
//                 <LabelChats {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Labels">
//             {(props) => (
//               <ScreenWrapper>
//                 <Labels {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="AddQuickReplyScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <AddQuickReplyScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="GreetingMessage">
//             {(props) => (
//               <ScreenWrapper>
//                 <GreetingMessage {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="AwayMessage">
//             {(props) => (
//               <ScreenWrapper>
//                 <AwayMessage {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="HelpCenter">
//             {(props) => (
//               <ScreenWrapper>
//                 <HelpCenter {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="HelpTopic">
//             {(props) => (
//               <ScreenWrapper>
//                 <HelpTopic {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BusinessSetup">
//             {(props) => (
//               <ScreenWrapper>
//                 <BusinessSetup {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ProductDetails">
//             {(props) => (
//               <ScreenWrapper>
//                 <ProductDetails {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Cart">
//             {(props) => (
//               <ScreenWrapper>
//                 <Cart {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="EmptyCart">
//             {(props) => (
//               <ScreenWrapper>
//                 <EmptyCart {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Broadcast">
//             {(props) => (
//               <ScreenWrapper>
//                 <Broadcast {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="OfficialSearch">
//             {(props) => (
//               <ScreenWrapper>
//                 <OfficialSearch {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Live">
//             {(props) => (
//               <ScreenWrapper>
//                 <Live {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="OoshBusiness">
//             {(props) => (
//               <ScreenWrapper>
//                 <OoshBusiness {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CreateChannel">
//             {(props) => (
//               <ScreenWrapper>
//                 <CreateChannel {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="InviteChannelLink">
//             {(props) => (
//               <ScreenWrapper>
//                 <InviteChannelLink {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Supplyrequest">
//             {(props) => (
//               <ScreenWrapper>
//                 <Supplyrequest {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SupplyRequestForm">
//             {(props) => (
//               <ScreenWrapper>
//                 <SupplyRequestForm {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SupplyServices">
//             {(props) => (
//               <ScreenWrapper>
//                 <SupplyServices {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SupplyRequestDetail">
//             {(props) => (
//               <ScreenWrapper>
//                 <SupplyRequestDetail {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CreateServices">
//             {(props) => (
//               <ScreenWrapper>
//                 <CreateServices {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SupplyRequestDetailScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <SupplyRequestDetailScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BroadcastHome">
//             {(props) => (
//               <ScreenWrapper>
//                 <BroadcastHome {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CreateBroadcastPost">
//             {(props) => (
//               <ScreenWrapper>
//                 <CreateBroadcastPost {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ReportPost">
//             {(props) => (
//               <ScreenWrapper>
//                 <ReportPost {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BroadcastUserProfile">
//             {(props) => (
//               <ScreenWrapper>
//                 <BroadcastUserProfile {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="MarketPlace">
//             {(props) => (
//               <ScreenWrapper>
//                 <MarketPlace {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CreateListing">
//             {(props) => (
//               <ScreenWrapper>
//                 <CreateListing {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ListingDetails">
//             {(props) => (
//               <ScreenWrapper>
//                 <ListingDetails {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SuggestedFollowers">
//             {(props) => (
//               <ScreenWrapper>
//                 <SuggestedFollowers {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ManagePost">
//             {(props) => (
//               <ScreenWrapper>
//                 <ManagePost {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CreatorDashboard">
//             {(props) => (
//               <ScreenWrapper>
//                 <CreatorDashboard {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="MonetizationRequestForm">
//             {(props) => (
//               <ScreenWrapper>
//                 <MonetizationRequestForm {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ChatAi">
//             {(props) => (
//               <ScreenWrapper>
//                 <ChatAi {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ContractHome">
//             {(props) => (
//               <ScreenWrapper>
//                 <ContractHome {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CreateAdForm">
//             {(props) => (
//               <ScreenWrapper>
//                 <CreateAdForm {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="AdReview">
//             {(props) => (
//               <ScreenWrapper>
//                 <AdReview {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="BroadcastSuccess">
//             {(props) => (
//               <ScreenWrapper>
//                 <BroadcastSuccess {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="AllProducts">
//             {(props) => (
//               <ScreenWrapper>
//                 <AllProducts {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="RequesterPostHistory">
//             {(props) => (
//               <ScreenWrapper>
//                 <RequesterPostHistory {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen> 
          
//           <Stack.Screen name="BusinessGroupChat">
//             {(props) => (
//               <ScreenWrapper>
//                 <BusinessGroupChat {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen> 
          
//           <Stack.Screen name="SupplierNotificationScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <SupplierNotificationScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen> 
          
//           <Stack.Screen name="BPrivateChat">
//             {(props) => (
//               <ScreenWrapper>
//                 <BPrivateChat {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen> 
          
//           <Stack.Screen name="EarningWallet">
//             {(props) => (
//               <ScreenWrapper>
//                 <EarningWallet {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="NinRegisterEarning">
//             {(props) => (
//               <ScreenWrapper>
//                 <NinRegisterEarning {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="PurchaseData">
//             {(props) => (
//               <ScreenWrapper>
//                 <PurchaseData {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="EarningDashbord">
//             {(props) => (
//               <ScreenWrapper>
//                 <EarningDashbord {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="WithdrawEarning">
//             {(props) => (
//               <ScreenWrapper>
//                 <WithdrawEarning {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="VideoAds">
//             {(props) => (
//               <ScreenWrapper>
//                 <VideoAds {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           {/* ==================== SOCIAL MEDIA FLOW ==================== */}
//           <Stack.Screen name="SocialHome">
//             {(props) => (
//               <ScreenWrapper>
//                 <SocialHome {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Discover">
//             {(props) => (
//               <ScreenWrapper>
//                 <Discover {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="UploadshortVideo">
//             {(props) => (
//               <ScreenWrapper>
//                 <UploadshortVideo {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SearchShort">
//             {(props) => (
//               <ScreenWrapper>
//                 <SearchShort {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           {/* ==================== FEATURE SCREENS ==================== */}
//           <Stack.Screen name="Music">
//             {(props) => (
//               <ScreenWrapper>
//                 <Music {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="GroupCreate">
//             {(props) => (
//               <ScreenWrapper>
//                 <GroupCreate {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="GroupConnect">
//             {(props) => (
//               <ScreenWrapper>
//                 <GroupConnect {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="UserContactList">
//             {(props) => (
//               <ScreenWrapper>
//                 <UserContactList {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SynMessage">
//             {(props) => (
//               <ScreenWrapper>
//                 <SynMessage {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SyncContactPersonal">
//             {(props) => (
//               <ScreenWrapper>
//                 <SyncContactPersonal {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="UserContactListPersonalAccount">
//             {(props) => (
//               <ScreenWrapper>
//                 <UserContactListPersonalAccount {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SyncMessagePersonal">
//             {(props) => (
//               <ScreenWrapper>
//                 <SyncMessagePersonal {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="CameraScreen">
//             {(props) => (
//               <ScreenWrapper>
//                 <CameraScreen {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SongsList">
//             {(props) => (
//               <ScreenWrapper>
//                 <SongsList {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="NewCommunity">
//             {(props) => (
//               <ScreenWrapper>
//                 <NewCommunity {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="VideoCalls">
//             {(props) => (
//               <ScreenWrapper>
//                 <VideoCalls {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="VoiceCalls">
//             {(props) => (
//               <ScreenWrapper>
//                 <VoiceCalls {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="GoLive">
//             {(props) => (
//               <ScreenWrapper>
//                 <GoLive {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="LiveStream">
//             {(props) => (
//               <ScreenWrapper>
//                 <LiveStream {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="ContactUs">
//             {(props) => (
//               <ScreenWrapper>
//                 <ContactUs {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="SuccessStory">
//             {(props) => (
//               <ScreenWrapper>
//                 <SuccessStory {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="OtherUserProfile">
//             {(props) => (
//               <ScreenWrapper>
//                 <OtherUserProfile {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="LiveStreaming">
//             {(props) => (
//               <ScreenWrapper>
//                 <LiveStreaming {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="GlobalIssueReport">
//             {(props) => (
//               <ScreenWrapper>
//                 <GlobalIssueReport {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="NewsList">
//             {(props) => (
//               <ScreenWrapper>
//                 <NewsList {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Broadcaster">
//             {(props) => (
//               <ScreenWrapper>
//                 <Broadcaster {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>
          
//           <Stack.Screen name="Viewer">
//             {(props) => (
//               <ScreenWrapper>
//                 <Viewer {...props} />
//               </ScreenWrapper>
//             )}
//           </Stack.Screen>

//           {/* ==================== MODAL SCREENS ==================== */}
//           <Stack.Screen
//             name="CallOverlay"
//             component={IncomingCallModal}
//             options={{
//               presentation: "transparentModal",
//               animation: "fade",
//               contentStyle: { backgroundColor: "transparent" },
//             }}
//           />
//         </Stack.Navigator>
        
//         {userId && <CallSignalListener userId={userId} />}
//       </NavigationContainer>
//   );
// }


// import React, { useEffect, useState, useRef } from "react";
// import {
//   AppState,
//   Platform,
//   View,
//   ActivityIndicator,
//   StatusBar as RNStatusBar,
//   InteractionManager,
//   Image,
//   NativeModules,
//   LogBox,
// } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
// import {
//   NotificationProvider,
//   useNotification,
// } from "./src/context/NotificationContext";

// // ─── Navigation ref ───────────────────────────────────────────────────────────
// const navigationRef = React.createRef();

// // ─── Navigation persistence ───────────────────────────────────────────────────
// const NAVIGATION_STATE_KEY = "NAVIGATION_STATE";

// // Fire-and-forget — never awaited inside event handlers (Fix 4)
// const saveNavigationState = (state) => {
//   if (!state) return;
//   AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state)).catch(
//     (err) => console.error("Failed to save navigation state:", err)
//   );
// };

// const loadNavigationState = async () => {
//   try {
//     const raw = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
//     return raw ? JSON.parse(raw) : undefined;
//   } catch (err) {
//     console.error("Failed to load navigation state:", err);
//     return undefined;
//   }
// };

// // ─── LogBox ───────────────────────────────────────────────────────────────────
// LogBox.ignoreLogs([
//   "new NativeEventEmitter",
//   "Require cycle:",
//   "VirtualizedLists should never be nested",
// ]);

// // ─── Imports ──────────────────────────────────────────────────────────────────
// import { checkPinStatus } from "./showa_personal_account_screen/FaceSecuritySetting";
// import PinUnlockModal from "./screens/PinUnlockModal";
// import videoBackgroundfetch from "./src/services/VideoBackgroundFetch";
// import { ThemeProvider } from "./src/context/ThemeContext";
// import { useTheme } from "./src/context/ThemeContext";
// import { CallProvider } from "./components/CallContext";
// import CallSignalListener from "./components/CallSignalListener";
// import IncomingCallModal from "./components/IncomingCallModal";
// import NetworkStatusBanner from "./components/Networkstatusbanner";
// import {
//   startBackgroundContactSync,
//   setupContactSyncListener,
// } from "./components/BackgroundSync";
// import backgroundFetchService from "./src/services/BackgroundFetchService";

// // ─── Screen imports ───────────────────────────────────────────────────────────
// import Loginscreen from "./screens/Loginscreen";
// import Signin from "./screens/onboard/SignIn";
// import Signin_two from "./screens/onboard/SignIn2_two";
// import TermsCondition from "./screens/onboard/Terms";
// import PrivacyPolicy from "./screens/onboard/PrivacyPolicy";
// import Register from "./screens/onboard/Register";
// import Biometric from "./screens/onboard/Biometric";
// import LinkingScreen from "./screens/onboard/LinkingScreen";
// import VerificationCode from "./screens/onboard/VerifyEmail";
// import ProceedOptions from "./screens/ProceedOptions";
// import Terms from "./screens/TermsPrivacyScreen";
// import PHome from "./showa_personal_account_screen/PHome";
// import UserPersonalAccountProfile from "./screens/profiles/UserPersonalAccountProfile";
// import PStatusBar from "./showa_personal_account_screen/StatusBar";
// import StatusEditorScreen from "./showa_personal_account_screen/StatusEditorScreen";
// import JoinChannel from "./showa_personal_account_screen/JoinChannel";
// import Calls from "./showa_personal_account_screen/Calls";
// import CallOngoingScreen from "./showa_personal_account_screen/CallOngoingScreen";
// import Settings from "./showa_personal_account_screen/Settings";
// import NotificationSetting from "./showa_personal_account_screen/NotificationSetting";
// import WallpaperSetting from "./showa_personal_account_screen/WallpaperSetting";
// import FaceSecuritySetting from "./showa_personal_account_screen/FaceSecuritySetting";
// import PrivateChat from "./showa_personal_account_screen/PrivateChat";
// import ChannelDetails from "./showa_business/ChannelDetails";
// import PostDetails from "./showa_business/PostDetailScreen";
// import BusinessHome from "./showa_business/Home";
// import ChatAi from "./showa_business/ChatAi";
// import MonetizationRequestForm from "./showa_business/MonetizationRequestForm";
// import BUserProfile from "./showa_business/UserProfile";
// import BStatusBar from "./showa_business/StatusBar";
// import BStatusEditorScreen from "./showa_business/StatusEditorScreen";
// import BJoinChannel from "./showa_business/JoinChannel";
// import BCalls from "./showa_business/Calls";
// import BCallOngoingScreen from "./showa_business/CallOngoingScreen";
// import BSettings from "./showa_business/Settings";
// import BNotificationSetting from "./showa_business/NotificationSetting";
// import BWallpaperSetting from "./showa_business/WallpaperSetting";
// import BFaceSecuritySetting from "./showa_business/FaceSecuritySetting";
// import ToolsScreen from "./showa_business/ToolsScreen";
// import QuickReplies from "./showa_business/QuickReplies";
// import AddQuickReply from "./showa_business/AddQuickReply";
// import EssentialPlatformsScreen from "./showa_business/EssentialPlatformsScreen";
// import Advertise from "./showa_business/Advertise";
// import ManageProfile from "./showa_business/ManageProfile";
// import CreateCatalog from "./showa_business/CreateCatalog";
// import AddItemToCatalog from "./showa_business/AddItemToCatalog";
// import Explore from "./showa_business/Explore";
// import LabelChats from "./showa_business/LabelChatsScreen";
// import Labels from "./showa_business/LabelsScreen";
// import AddQuickReplyScreen from "./showa_business/AddQuickReplyScreen";
// import GreetingMessage from "./showa_business/GreetingMessage";
// import AwayMessage from "./showa_business/AwayMessageScreen";
// import HelpCenter from "./showa_business/HelpCenterScreen";
// import HelpTopic from "./showa_business/HelpTopicScreen";
// import BusinessSetup from "./showa_business/BusinessSetupScreen";
// import ProductDetails from "./showa_business/ProductDetailsScreen";
// import Cart from "./showa_business/CartScreen";
// import ChannelAdminManagement from "./showa_business/ChannelAdminManagement";
// import EmptyCart from "./showa_business/EmptyCartScreen";
// import OoshBusiness from "./showa_business/OoshBusinessScreen";
// import Live from "./showa_business/LiveScreen";
// import Broadcast from "./showa_business/Broadcast";
// import OfficialSearch from "./showa_business/OfficialSearchScreen";
// import CreateChannel from "./showa_business/CreateChannel";
// import InviteChannelLink from "./showa_business/InviteChannelLink";
// import Supplyrequest from "./showa_business/SupplyRequest";
// import SupplyRequestForm from "./showa_business/SupplyRequestForm";
// import SupplyServices from "./showa_business/SupplyServices";
// import SupplyRequestDetail from "./showa_business/SupplyRequestDetail";
// import CreateServices from "./showa_business/CreateServices";
// import SupplyRequestDetailScreen from "./showa_business/SupplyRequestDetailScreen";
// import BroadcastHome from "./showa_business/BroadcastHome";
// import CreateBroadcastPost from "./showa_business/CreateBroadcastPost";
// import ReportPost from "./showa_business/ReportPost";
// import BroadcastUserProfile from "./showa_business/BroadcastUserProfile";
// import MarketPlace from "./showa_business/MarketPlace";
// import CreateListing from "./showa_business/CreateListing";
// import ListingDetails from "./showa_business/ListingDetails";
// import SuggestedFollowers from "./showa_business/SuggestedFollowers";
// import ManagePost from "./showa_business/ManagePost";
// import CreatorDashboard from "./showa_business/CreatorDashboardScreen";
// import ContractHome from "./showa_business/contracts/ContractHome";
// import CreateAdForm from "./showa_business/ads/CreateAdFormScreen";
// import AdReview from "./showa_business/ads/AdReview";
// import BroadcastSuccess from "./showa_business/BroadcastSuccess";
// import AllProducts from "./showa_business/AllProducts";
// import OtherUserCatalog from "./showa_business/OthersUserCatalog";
// import OtherUserCatalogDetail from "./showa_business/OtherUserCatalogDetail";
// import BPrivateChat from "./showa_business/BusinessChat";
// import BusinessGroupChat from "./showa_business/BusinessGroupChat";
// import SupplierNotificationScreen from "./showa_business/SupplierNotificationScreen";
// import RequesterPostHistory from "./showa_business/RequesterPostHistory";
// import GroupMembers from "./showa_business/GroupMembers";
// import SocialHome from "./showa_social/Home";
// import Discover from "./showa_social/Discover";
// import UploadshortVideo from "./showa_social/UploadshortVideo";
// import SearchShort from "./showa_social/SearchShort";
// import GroupCreate from "./screens/GroupCreate";
// import GroupConnect from "./screens/GroupConnect";
// import UserContactListPersonalAccount from "./components/UserContactListPersonalAccount";
// import UpdateModal from "./components/UpdateModal";
// import Music from "./components/Music";
// import UserContactList from "./components/UserContactList";
// import SyncMessagePersonal from "./components/SyncMessagePersonal";
// import SyncContactForBusiness from "./components/SyncContactForBusiness";
// import CameraScreen from "./components/CameraScreen";
// import SongsList from "./components/SongsListScreen";
// import NewCommunity from "./components/NewCommunityScreen";
// import VideoCalls from "./components/VideoCalls";
// import VoiceCalls from "./components/VoiceCalls";
// import GoLive from "./components/GoLive";
// import LiveStream from "./components/LiveStream";
// import ContactUs from "./components/ContactUs";
// import SuccessStory from "./components/SuccessStory";
// import OtherUserProfile from "./screens/profiles/OtherUserProfile";
// import EarningDashbord from "./screens/earning/EarningDashbord";
// import WithdrawEarning from "./screens/earning/WithdrawEarning";
// import PurchaseData from "./screens/earning/PurchaseData";
// import NinRegisterEarning from "./screens/earning/NinRegisterEarning";
// import VideoAds from "./screens/earning/VideoAds";
// import EarningWallet from "./screens/earning/EarningWallet";
// import SynMessage from "./components/SynMessage";
// import SyncContactPersonal from "./components/UserContactPersonal";
// import LiveStreaming from "./src/LiveStreaming";
// import useAppUpdate from "./src/hooks/useAppUpdate";
// import NotificationsScreen from "./screens/NotificationsScreen";
// import GlobalIssueReport from "./components/GlobalIssueReport";
// import NewsList from "./components/NewsList";
// import Broadcaster from "./src/Broadcaster";
// import Viewer from "./src/Viewer";

// // ─── Linking ──────────────────────────────────────────────────────────────────
// import { Linking } from "react-native";

// const linking = {
//   prefixes: ["showa://", "https://showapp.com", "http://showapp.com"],
//   config: {
//     screens: {
//       AiResetPassword: "reset-password",
//       PostDetail: {
//         path: "post/:postId",
//         parse: { postId: (id) => id },
//       },
//       UserProfile: {
//         path: "user/:userId",
//         parse: { userId: (id) => id },
//       },
//       NotFound: "*",
//     },
//   },
//   getInitialURL: async () => {
//     const url = await Linking.getInitialURL();
//     console.log("Initial URL:", url);
//     return url;
//   },
//   subscribe: (listener) => {
//     const onReceiveURL = ({ url }) => {
//       console.log("Received URL:", url);
//       listener(url);
//     };
//     const subscription = Linking.addEventListener("url", onReceiveURL);
//     return () => subscription.remove();
//   },
// };

// // ─── Helper: stop WebRTC ──────────────────────────────────────────────────────
// const stopWebRTCConnections = () => {
//   try {
//     if (
//       global.__activeWebRTCConnections &&
//       global.__activeWebRTCConnections.length > 0
//     ) {
//       global.__activeWebRTCConnections.forEach((conn) => {
//         try {
//           conn && conn.close && conn.close();
//         } catch (e) {}
//       });
//       global.__activeWebRTCConnections = [];
//     }
//   } catch (err) {
//     console.error("Error stopping WebRTC:", err);
//   }
// };

// // ─── Helper: pause videos ─────────────────────────────────────────────────────
// const pauseAllVideos = () => {
//   try {
//     if (global.__activeVideoRefs && global.__activeVideoRefs.length > 0) {
//       global.__activeVideoRefs.forEach((ref) => {
//         try {
//           ref &&
//             ref.current &&
//             typeof ref.current.pause === "function" &&
//             ref.current.pause();
//         } catch (e) {}
//       });
//     }
//   } catch (err) {
//     console.error("Error pausing videos:", err);
//   }
// };

// // ─── Helper: free memory ──────────────────────────────────────────────────────
// const freeMemory = () => {
//   if (Platform.OS === "android") {
//     try {
//       if (global.gc) global.gc();
//       if (global.__largeImageCache) delete global.__largeImageCache;
//       if (global.__videoPrefetchCache) delete global.__videoPrefetchCache;
//     } catch (err) {
//       console.error("Error freeing memory:", err);
//     }
//   }
// };

// // ─── Helper: stop background services ────────────────────────────────────────
// const stopBackgroundServices = () => {
//   try {
//     if (global.__backgroundSyncInterval) {
//       clearInterval(global.__backgroundSyncInterval);
//       global.__backgroundSyncInterval = null;
//     }
//     if (
//       global.__contactSyncListener &&
//       global.__contactSyncListener.remove
//     ) {
//       global.__contactSyncListener.remove();
//       global.__contactSyncListener = null;
//     }
//     backgroundFetchService.stop();
//   } catch (err) {
//     console.error("Error stopping background services:", err);
//   }
// };

// // ─── Navigation stack ─────────────────────────────────────────────────────────
// const Stack = createNativeStackNavigator();

// // ─── Screen wrapper ───────────────────────────────────────────────────────────
// const ScreenWrapper = ({ children }) => {
//   const { colors } = useTheme();
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {children}
//     </View>
//   );
// };

// // ─── Root ─────────────────────────────────────────────────────────────────────
// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <NotificationProvider>
//           <AppContent />
//         </NotificationProvider>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// // ─── AppContent ───────────────────────────────────────────────────────────────
// // Owns: auth state, AppState listener, all timers.
// // FIX 1: Single AppState listener lives here only — ThemedNavigator has none.
// // FIX 2: Every setTimeout is tracked in a ref and cleared on unmount.
// // FIX 3: Background services are started only in ThemedNavigator, not here.
// // FIX 7: init(), checkAuth(), and initNotifications run sequenced, not raced.
// // FIX 8: useAppUpdate(false) — auto-check disabled; we call checkForUpdate manually.

// function AppContent() {
//   const [userId, setUserId] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const backgroundTimerRef = useRef(null);   // 30-second background cleanup
//   const updateTimerRef = useRef(null);        // checkForUpdate delay timer
//   const appStateRef = useRef(AppState.currentState);

//   const { initializeNotifications } = useNotification();

//   // FIX 8: pass false so the hook does NOT auto-check on mount
//   const { updateInfo, showModal: showUpdateModal, dismissModal: dismissUpdateModal, checkForUpdate } =
//     useAppUpdate(false);

//   // FIX 7: sequenced init — notifications → auth, no parallel AsyncStorage races
//   useEffect(() => {
//     const init = async () => {
//       try {
//         await initializeNotifications();
//         await checkAuth();
//       } catch (err) {
//         console.error("Init error:", err);
//       }
//     };
//     init();

//     // cleanup
//     return () => {
//       if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//     };
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const checkAuth = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       const userData = await AsyncStorage.getItem("userData");

//       if (token && userData) {
//         const user = JSON.parse(userData);
//         setUserId(user.id);
//         setIsAuthenticated(true);

//         // FIX 2: tracked timer — clears if component unmounts before it fires
//         if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//         updateTimerRef.current = setTimeout(() => {
//           checkForUpdate(true);
//         }, 2000);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (err) {
//       console.error("Error checking auth:", err);
//       setIsAuthenticated(false);
//     }
//   };

//   // Video prefetch init — runs only when userId is set
//   useEffect(() => {
//     if (!userId) return;

//     let cancelled = false;
//     const initVideoPrefetch = async () => {
//       try {
//         await videoBackgroundfetch.init(userId);
//         if (!cancelled) {
//           const cached = await videoBackgroundfetch.getCachedVideos();
//           console.log("📦 Cached videos ready:", cached?.length || 0);
//         }
//       } catch (err) {
//         console.error("Error initializing video prefetch:", err);
//       }
//     };

//     initVideoPrefetch();

//     return () => {
//       cancelled = true;
//       if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
//       stopBackgroundServices();
//     };
//   }, [userId]);

//   // FIX 1: Single, authoritative AppState listener — removed from ThemedNavigator.
//   // FIX 2: updateTimerRef cleared in cleanup.
//   // FIX 4: navigation save is fire-and-forget (no await).
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       const currentState = appStateRef.current;

//       if (currentState === "active" && nextAppState === "background") {
//         console.log("📱 App going to background");

//         // FIX 4: save navigation state without awaiting (non-blocking)
//         if (navigationRef.current) {
//           saveNavigationState(navigationRef.current.getRootState());
//         }

//         if (Platform.OS === "android") {
//           pauseAllVideos();
//           stopWebRTCConnections();

//           if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = setTimeout(() => {
//             console.log("🕐 30 s in background — light cleanup");
//             freeMemory();
//           }, 30000);
//         }
//       } else if (currentState === "background" && nextAppState === "active") {
//         console.log("📱 App coming to foreground");

//         if (backgroundTimerRef.current) {
//           clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = null;
//         }

//         // FIX 2: tracked timer for update check
//         if (isAuthenticated) {
//           if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//           updateTimerRef.current = setTimeout(() => {
//             checkForUpdate(true);
//           }, 1000);
//         }

//         InteractionManager.runAfterInteractions(() => {
//           console.log("✅ App resumed — screen state preserved");
//         });
//       }

//       appStateRef.current = nextAppState;
//     };

//     const subscription = AppState.addEventListener("change", handleAppStateChange);

//     return () => {
//       subscription.remove();
//       if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
//       if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//     };
//   }, [userId, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <CallProvider>
//         <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//         <NetworkStatusBanner />

//         {updateInfo && updateInfo.update_available && (
//           <UpdateModal
//             visible={showUpdateModal}
//             updateInfo={updateInfo}
//             onClose={dismissUpdateModal}
//           />
//         )}
//       </CallProvider>
//     </GestureHandlerRootView>
//   );
// }

// // ─── OnlineStatusManager ──────────────────────────────────────────────────────
// const OnlineStatusManager = ({ userId }) => {
//   if (!userId) return null;
//   useOnlineStatus(userId);
//   return null;
// };

// // ─── ThemedNavigator ──────────────────────────────────────────────────────────
// // FIX 1: NO AppState listener here — AppContent owns the single listener.
// // FIX 3: Background services started here only, in one useEffect.
// // FIX 5: Navigation state only restored when a valid token exists.
// // FIX 6: detachPreviousScreen removed (default RN behavior saves RAM).
// // FIX 9: global.__backgroundServicesRunning reset path documented below.

// function ThemedNavigator({ isAuthenticated, userId }) {
//   const { theme, colors } = useTheme();
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNavigationReady, setIsNavigationReady] = useState(false);
//   const [initialNavigationState, setInitialNavigationState] = useState(undefined);

//   const navSaveTimerRef = useRef(null);
//   const forceFetchTimerRef = useRef(null);

//   const customTheme = {
//     dark: theme === "dark",
//     colors: {
//       primary: colors.primary,
//       background: colors.background,
//       card: colors.surface || colors.card || colors.background,
//       text: colors.text,
//       border: colors.border,
//       notification: colors.primary,
//     },
//     fonts: {
//       regular: { fontFamily: "System", fontWeight: "400" },
//       medium:  { fontFamily: "System", fontWeight: "500" },
//       bold:    { fontFamily: "System", fontWeight: "700" },
//       heavy:   { fontFamily: "System", fontWeight: "900" },
//     },
//   };

//   // FIX 5: restore navigation state only when the user is still logged in
//   useEffect(() => {
//     const restoreState = async () => {
//       try {
//         const token = await AsyncStorage.getItem("userToken");
//         if (token) {
//           const saved = await loadNavigationState();
//           if (saved) setInitialNavigationState(saved);
//         } else {
//           // Clear stale state so a logged-out user always lands on Login
//           await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
//         }
//       } catch (err) {
//         console.error("Error restoring navigation state:", err);
//       } finally {
//         setIsNavigationReady(true);
//       }
//     };

//     restoreState();

//     // Init globals once
//     if (!global.__activeWebRTCConnections) global.__activeWebRTCConnections = [];
//     if (!global.__activeVideoRefs)         global.__activeVideoRefs = [];
//     if (!global.__pendingRequests)         global.__pendingRequests = [];

//     return () => {
//       if (navSaveTimerRef.current)   clearTimeout(navSaveTimerRef.current);
//       if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
//     };
//   }, []);

//   // Check PIN on mount (runs AFTER auth state is known via isAuthenticated prop)
//   useEffect(() => {
//     checkPinRequirement();
//   }, [isAuthenticated]);

//   const checkPinRequirement = async () => {
//     try {
//       const pinEnabled = await AsyncStorage.getItem("pin_enabled");
//       const token      = await AsyncStorage.getItem("userToken");

//       if (pinEnabled === "true" && token) {
//         const status = await checkPinStatus(token);
//         if (status && status.has_pin) setShowPinModal(true);
//       }
//     } catch (err) {
//       console.error("Error checking PIN:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // FIX 3: Background services started here, once, when userId is available.
//   //         NOT duplicated in AppContent's AppState handler.
//   // FIX 2: forceFetch timer tracked in a ref and cleared on unmount.
//   // FIX 9: global.__backgroundServicesRunning must be reset to false on logout
//   //         (add `global.__backgroundServicesRunning = false` in your logout handler).
//   useEffect(() => {
//     if (!userId) return;

//     if (!global.__backgroundServicesRunning) {
//       backgroundFetchService.init();
//       startBackgroundContactSync();
//       setupContactSyncListener();
//       global.__backgroundServicesRunning = true;

//       // FIX 2: tracked timer
//       forceFetchTimerRef.current = setTimeout(() => {
//         backgroundFetchService.forceFetch();
//       }, 2000);
//     }

//     return () => {
//       if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
//     };
//   }, [userId]);

//   // Debounced navigation state save on route change
//   const handleNavigationStateChange = (state) => {
//     if (!state) return;
//     if (navSaveTimerRef.current) clearTimeout(navSaveTimerRef.current);
//     // FIX 4: fire-and-forget save
//     navSaveTimerRef.current = setTimeout(() => {
//       saveNavigationState(state);
//     }, 1000);
//   };

//   if (isLoading || !isNavigationReady) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: colors.background,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer
//       ref={navigationRef}
//       linking={linking}
//       theme={customTheme}
//       initialState={initialNavigationState}
//       onStateChange={handleNavigationStateChange}
//     >
//       {isAuthenticated && <OnlineStatusManager userId={userId} />}

//       <RNStatusBar
//         barStyle={theme === "dark" ? "light-content" : "dark-content"}
//         backgroundColor={colors.background}
//       />

//       <PinUnlockModal
//         visible={showPinModal}
//         onClose={() => setShowPinModal(false)}
//         navigation={navigationRef.current}
//       />

//       {/* FIX 6: detachPreviousScreen: false REMOVED — default behaviour keeps
//           only the active screen mounted, dramatically reducing RAM usage.
//           If a specific screen must stay mounted (e.g. an active chat), add
//           options={{ detachPreviousScreen: false }} to THAT screen only.       */}
//       <Stack.Navigator
//         initialRouteName="Loginscreen"
//         screenOptions={{
//           headerShown: false,
//           contentStyle: { backgroundColor: colors.background },
//         }}
//       >
//         {/* ── Authentication ─────────────────────────────────────────────── */}
//         <Stack.Screen name="Loginscreen">
//           {(props) => <ScreenWrapper><Loginscreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Signin">
//           {(props) => <ScreenWrapper><Signin {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Signin_two">
//           {(props) => <ScreenWrapper><Signin_two {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Register">
//           {(props) => <ScreenWrapper><Register {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="VerificationCode">
//           {(props) => <ScreenWrapper><VerificationCode {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="LinkingScreen">
//           {(props) => <ScreenWrapper><LinkingScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Biometric">
//           {(props) => <ScreenWrapper><Biometric {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ProceedOptions">
//           {(props) => <ScreenWrapper><ProceedOptions {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Terms">
//           {(props) => <ScreenWrapper><Terms {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="TermsCondition">
//           {(props) => <ScreenWrapper><TermsCondition {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="PrivacyPolicy">
//           {(props) => <ScreenWrapper><PrivacyPolicy {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Personal account ───────────────────────────────────────────── */}
//         <Stack.Screen name="PHome">
//           {(props) => <ScreenWrapper><PHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="UserPersonalAccountProfile">
//           {(props) => <ScreenWrapper><UserPersonalAccountProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SyncContactForBusiness">
//           {(props) => <ScreenWrapper><SyncContactForBusiness {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="PStatusBar">
//           {(props) => <ScreenWrapper><PStatusBar {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="StatusEditorScreen">
//           {(props) => <ScreenWrapper><StatusEditorScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="JoinChannel">
//           {(props) => <ScreenWrapper><JoinChannel {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Calls">
//           {(props) => <ScreenWrapper><Calls {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CallOngoingScreen">
//           {(props) => <ScreenWrapper><CallOngoingScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Settings">
//           {(props) => <ScreenWrapper><Settings {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="NotificationsScreen">
//           {(props) => <ScreenWrapper><NotificationsScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="NotificationSetting">
//           {(props) => <ScreenWrapper><NotificationSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="WallpaperSetting">
//           {(props) => <ScreenWrapper><WallpaperSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="FaceSecuritySetting">
//           {(props) => <ScreenWrapper><FaceSecuritySetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="PrivateChat">
//           {(props) => <ScreenWrapper><PrivateChat {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Business account ───────────────────────────────────────────── */}
//         <Stack.Screen name="BusinessHome">
//           {(props) => <ScreenWrapper><BusinessHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="PostDetails">
//           {(props) => <ScreenWrapper><PostDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ChannelDetails">
//           {(props) => <ScreenWrapper><ChannelDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ChannelAdminManagement">
//           {(props) => <ScreenWrapper><ChannelAdminManagement {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BUserProfile">
//           {(props) => <ScreenWrapper><BUserProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BStatusBar">
//           {(props) => <ScreenWrapper><BStatusBar {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BStatusEditorScreen">
//           {(props) => <ScreenWrapper><BStatusEditorScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BJoinChannel">
//           {(props) => <ScreenWrapper><BJoinChannel {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BCalls">
//           {(props) => <ScreenWrapper><BCalls {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BCallOngoingScreen">
//           {(props) => <ScreenWrapper><BCallOngoingScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BSettings">
//           {(props) => <ScreenWrapper><BSettings {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BNotificationSetting">
//           {(props) => <ScreenWrapper><BNotificationSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BWallpaperSetting">
//           {(props) => <ScreenWrapper><BWallpaperSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BFaceSecuritySetting">
//           {(props) => <ScreenWrapper><BFaceSecuritySetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ToolsScreen">
//           {(props) => <ScreenWrapper><ToolsScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="QuickReplies">
//           {(props) => <ScreenWrapper><QuickReplies {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="AddQuickReply">
//           {(props) => <ScreenWrapper><AddQuickReply {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="EssentialPlatforms">
//           {(props) => <ScreenWrapper><EssentialPlatformsScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Advertise">
//           {(props) => <ScreenWrapper><Advertise {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ManageProfile">
//           {(props) => <ScreenWrapper><ManageProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CreateCatalog">
//           {(props) => <ScreenWrapper><CreateCatalog {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Explore">
//           {(props) => <ScreenWrapper><Explore {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="AddItemToCatalog">
//           {(props) => <ScreenWrapper><AddItemToCatalog {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="LabelChats">
//           {(props) => <ScreenWrapper><LabelChats {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Labels">
//           {(props) => <ScreenWrapper><Labels {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="AddQuickReplyScreen">
//           {(props) => <ScreenWrapper><AddQuickReplyScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="GreetingMessage">
//           {(props) => <ScreenWrapper><GreetingMessage {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="AwayMessage">
//           {(props) => <ScreenWrapper><AwayMessage {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="HelpCenter">
//           {(props) => <ScreenWrapper><HelpCenter {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="HelpTopic">
//           {(props) => <ScreenWrapper><HelpTopic {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BusinessSetup">
//           {(props) => <ScreenWrapper><BusinessSetup {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ProductDetails">
//           {(props) => <ScreenWrapper><ProductDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Cart">
//           {(props) => <ScreenWrapper><Cart {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="EmptyCart">
//           {(props) => <ScreenWrapper><EmptyCart {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Broadcast">
//           {(props) => <ScreenWrapper><Broadcast {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="OfficialSearch">
//           {(props) => <ScreenWrapper><OfficialSearch {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Live">
//           {(props) => <ScreenWrapper><Live {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="OoshBusiness">
//           {(props) => <ScreenWrapper><OoshBusiness {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CreateChannel">
//           {(props) => <ScreenWrapper><CreateChannel {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="InviteChannelLink">
//           {(props) => <ScreenWrapper><InviteChannelLink {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Supplyrequest">
//           {(props) => <ScreenWrapper><Supplyrequest {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SupplyRequestForm">
//           {(props) => <ScreenWrapper><SupplyRequestForm {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SupplyServices">
//           {(props) => <ScreenWrapper><SupplyServices {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SupplyRequestDetail">
//           {(props) => <ScreenWrapper><SupplyRequestDetail {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CreateServices">
//           {(props) => <ScreenWrapper><CreateServices {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SupplyRequestDetailScreen">
//           {(props) => <ScreenWrapper><SupplyRequestDetailScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BroadcastHome">
//           {(props) => <ScreenWrapper><BroadcastHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CreateBroadcastPost">
//           {(props) => <ScreenWrapper><CreateBroadcastPost {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ReportPost">
//           {(props) => <ScreenWrapper><ReportPost {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BroadcastUserProfile">
//           {(props) => <ScreenWrapper><BroadcastUserProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="MarketPlace">
//           {(props) => <ScreenWrapper><MarketPlace {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CreateListing">
//           {(props) => <ScreenWrapper><CreateListing {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ListingDetails">
//           {(props) => <ScreenWrapper><ListingDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SuggestedFollowers">
//           {(props) => <ScreenWrapper><SuggestedFollowers {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ManagePost">
//           {(props) => <ScreenWrapper><ManagePost {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CreatorDashboard">
//           {(props) => <ScreenWrapper><CreatorDashboard {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="MonetizationRequestForm">
//           {(props) => <ScreenWrapper><MonetizationRequestForm {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ChatAi">
//           {(props) => <ScreenWrapper><ChatAi {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ContractHome">
//           {(props) => <ScreenWrapper><ContractHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CreateAdForm">
//           {(props) => <ScreenWrapper><CreateAdForm {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="AdReview">
//           {(props) => <ScreenWrapper><AdReview {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BroadcastSuccess">
//           {(props) => <ScreenWrapper><BroadcastSuccess {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="AllProducts">
//           {(props) => <ScreenWrapper><AllProducts {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="OtherUserCatalog">
//           {(props) => <ScreenWrapper><OtherUserCatalog {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="OtherUserCatalogDetail">
//           {(props) => <ScreenWrapper><OtherUserCatalogDetail {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BPrivateChat">
//           {(props) => <ScreenWrapper><BPrivateChat {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BusinessGroupChat">
//           {(props) => <ScreenWrapper><BusinessGroupChat {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SupplierNotificationScreen">
//           {(props) => <ScreenWrapper><SupplierNotificationScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="RequesterPostHistory">
//           {(props) => <ScreenWrapper><RequesterPostHistory {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="GroupMembers">
//           {(props) => <ScreenWrapper><GroupMembers {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Social ─────────────────────────────────────────────────────── */}
//         <Stack.Screen name="SocialHome">
//           {(props) => <ScreenWrapper><SocialHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Discover">
//           {(props) => <ScreenWrapper><Discover {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="UploadshortVideo">
//           {(props) => <ScreenWrapper><UploadshortVideo {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SearchShort">
//           {(props) => <ScreenWrapper><SearchShort {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Features ───────────────────────────────────────────────────── */}
//         <Stack.Screen name="Music">
//           {(props) => <ScreenWrapper><Music {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="GroupCreate">
//           {(props) => <ScreenWrapper><GroupCreate {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="GroupConnect">
//           {(props) => <ScreenWrapper><GroupConnect {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="UserContactList">
//           {(props) => <ScreenWrapper><UserContactList {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SynMessage">
//           {(props) => <ScreenWrapper><SynMessage {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SyncContactPersonal">
//           {(props) => <ScreenWrapper><SyncContactPersonal {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="UserContactListPersonalAccount">
//           {(props) => <ScreenWrapper><UserContactListPersonalAccount {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SyncMessagePersonal">
//           {(props) => <ScreenWrapper><SyncMessagePersonal {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="CameraScreen">
//           {(props) => <ScreenWrapper><CameraScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SongsList">
//           {(props) => <ScreenWrapper><SongsList {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="NewCommunity">
//           {(props) => <ScreenWrapper><NewCommunity {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="VideoCalls">
//           {(props) => <ScreenWrapper><VideoCalls {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="VoiceCalls">
//           {(props) => <ScreenWrapper><VoiceCalls {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="GoLive">
//           {(props) => <ScreenWrapper><GoLive {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="LiveStream">
//           {(props) => <ScreenWrapper><LiveStream {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="ContactUs">
//           {(props) => <ScreenWrapper><ContactUs {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="SuccessStory">
//           {(props) => <ScreenWrapper><SuccessStory {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="OtherUserProfile">
//           {(props) => <ScreenWrapper><OtherUserProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="LiveStreaming">
//           {(props) => <ScreenWrapper><LiveStreaming {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="GlobalIssueReport">
//           {(props) => <ScreenWrapper><GlobalIssueReport {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="NewsList">
//           {(props) => <ScreenWrapper><NewsList {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Broadcaster">
//           {(props) => <ScreenWrapper><Broadcaster {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="Viewer">
//           {(props) => <ScreenWrapper><Viewer {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Earning ────────────────────────────────────────────────────── */}
//         <Stack.Screen name="EarningDashbord">
//           {(props) => <ScreenWrapper><EarningDashbord {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="WithdrawEarning">
//           {(props) => <ScreenWrapper><WithdrawEarning {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="PurchaseData">
//           {(props) => <ScreenWrapper><PurchaseData {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="NinRegisterEarning">
//           {(props) => <ScreenWrapper><NinRegisterEarning {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="VideoAds">
//           {(props) => <ScreenWrapper><VideoAds {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="EarningWallet">
//           {(props) => <ScreenWrapper><EarningWallet {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Modal ──────────────────────────────────────────────────────── */}
//         <Stack.Screen
//           name="CallOverlay"
//           component={IncomingCallModal}
//           options={{
//             presentation: "transparentModal",
//             animation: "fade",
//             contentStyle: { backgroundColor: "transparent" },
//           }}
//         />
//       </Stack.Navigator>

//       {userId && <CallSignalListener userId={userId} />}
//     </NavigationContainer>
//   );
// }

// // ─── LOGOUT HELPER (export and call this wherever you handle logout) ───────────
// // FIX 9: resets the background-services flag so services restart on next login,
// //         and clears navigation state so the user always lands on the Login screen.
// export const handleAppLogout = async (clearTokenFn) => {
//   try {
//     // Reset background-service flag
//     global.__backgroundServicesRunning = false;
//     global.__activeWebRTCConnections   = [];
//     global.__activeVideoRefs           = [];

//     // Stop running services
//     stopBackgroundServices();

//     // Clear navigation state
//     await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);

//     // Call whatever token-clearing / API logout logic you already have
//     if (typeof clearTokenFn === "function") await clearTokenFn();
//   } catch (err) {
//     console.error("Error during logout cleanup:", err);
//   }
// };

// import React, { useEffect, useState, useRef } from "react";
// import {
//   AppState,
//   Platform,
//   View,
//   ActivityIndicator,
//   StatusBar as RNStatusBar,
//   InteractionManager,
//   Image,
//   NativeModules,
//   LogBox,
//   PermissionsAndroid, // ← ANDROID 13+ FIX
// } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
// import {
//   NotificationProvider,
//   useNotification,
// } from "./src/context/NotificationContext";

// // ─── Navigation ref ───────────────────────────────────────────────────────────
// const navigationRef = React.createRef();

// // ─── Navigation persistence ───────────────────────────────────────────────────
// const NAVIGATION_STATE_KEY = "NAVIGATION_STATE";

// const saveNavigationState = (state) => {
//   if (!state) return;
//   AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state)).catch(
//     (err) => console.error("Failed to save navigation state:", err)
//   );
// };

// const loadNavigationState = async () => {
//   try {
//     const raw = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
//     return raw ? JSON.parse(raw) : undefined;
//   } catch (err) {
//     console.error("Failed to load navigation state:", err);
//     return undefined;
//   }
// };

// // ─── LogBox ───────────────────────────────────────────────────────────────────
// LogBox.ignoreLogs([
//   "new NativeEventEmitter",
//   "Require cycle:",
//   "VirtualizedLists should never be nested",
// ]);

// // ─── Imports ──────────────────────────────────────────────────────────────────
// import { checkPinStatus } from "./showa_personal_account_screen/FaceSecuritySetting";
// import PinUnlockModal from "./screens/PinUnlockModal";
// import videoBackgroundfetch from "./src/services/VideoBackgroundFetch";
// import { ThemeProvider } from "./src/context/ThemeContext";
// import { useTheme } from "./src/context/ThemeContext";
// import { CallProvider } from "./components/CallContext";
// import CallSignalListener from "./components/CallSignalListener";
// import IncomingCallModal from "./components/IncomingCallModal";
// import NetworkStatusBanner from "./components/Networkstatusbanner";
// import {
//   startBackgroundContactSync,
//   setupContactSyncListener,
// } from "./components/BackgroundSync";
// import backgroundFetchService from "./src/services/BackgroundFetchService";

// // ─── Screen imports ───────────────────────────────────────────────────────────
// import Loginscreen from "./screens/Loginscreen";
// import Signin from "./screens/onboard/SignIn";
// import Signin_two from "./screens/onboard/SignIn2_two";
// import TermsCondition from "./screens/onboard/Terms";
// import PrivacyPolicy from "./screens/onboard/PrivacyPolicy";
// import Register from "./screens/onboard/Register";
// import Biometric from "./screens/onboard/Biometric";
// import LinkingScreen from "./screens/onboard/LinkingScreen";
// import VerificationCode from "./screens/onboard/VerifyEmail";
// import ProceedOptions from "./screens/ProceedOptions";
// import Terms from "./screens/TermsPrivacyScreen";
// import PHome from "./showa_personal_account_screen/PHome";
// import UserPersonalAccountProfile from "./screens/profiles/UserPersonalAccountProfile";
// import PStatusBar from "./showa_personal_account_screen/StatusBar";
// import StatusEditorScreen from "./showa_personal_account_screen/StatusEditorScreen";
// import JoinChannel from "./showa_personal_account_screen/JoinChannel";
// import Calls from "./showa_personal_account_screen/Calls";
// import CallOngoingScreen from "./showa_personal_account_screen/CallOngoingScreen";
// import Settings from "./showa_personal_account_screen/Settings";
// import NotificationSetting from "./showa_personal_account_screen/NotificationSetting";
// import WallpaperSetting from "./showa_personal_account_screen/WallpaperSetting";
// import FaceSecuritySetting from "./showa_personal_account_screen/FaceSecuritySetting";
// import PrivateChat from "./showa_personal_account_screen/PrivateChat";
// import ChannelDetails from "./showa_business/ChannelDetails";
// import PostDetails from "./showa_business/PostDetailScreen";
// import BusinessHome from "./showa_business/Home";
// import ChatAi from "./showa_business/ChatAi";
// import MonetizationRequestForm from "./showa_business/MonetizationRequestForm";
// import BUserProfile from "./showa_business/UserProfile";
// import BStatusBar from "./showa_business/StatusBar";
// import BStatusEditorScreen from "./showa_business/StatusEditorScreen";
// import BJoinChannel from "./showa_business/JoinChannel";
// import BCalls from "./showa_business/Calls";
// import BCallOngoingScreen from "./showa_business/CallOngoingScreen";
// import BSettings from "./showa_business/Settings";
// import BNotificationSetting from "./showa_business/NotificationSetting";
// import BWallpaperSetting from "./showa_business/WallpaperSetting";
// import BFaceSecuritySetting from "./showa_business/FaceSecuritySetting";
// import ToolsScreen from "./showa_business/ToolsScreen";
// import QuickReplies from "./showa_business/QuickReplies";
// import AddQuickReply from "./showa_business/AddQuickReply";
// import EssentialPlatformsScreen from "./showa_business/EssentialPlatformsScreen";
// import Advertise from "./showa_business/Advertise";
// import ManageProfile from "./showa_business/ManageProfile";
// import CreateCatalog from "./showa_business/CreateCatalog";
// import AddItemToCatalog from "./showa_business/AddItemToCatalog";
// import Explore from "./showa_business/Explore";
// import LabelChats from "./showa_business/LabelChatsScreen";
// import Labels from "./showa_business/LabelsScreen";
// import AddQuickReplyScreen from "./showa_business/AddQuickReplyScreen";
// import GreetingMessage from "./showa_business/GreetingMessage";
// import AwayMessage from "./showa_business/AwayMessageScreen";
// import HelpCenter from "./showa_business/HelpCenterScreen";
// import HelpTopic from "./showa_business/HelpTopicScreen";
// import BusinessSetup from "./showa_business/BusinessSetupScreen";
// import ProductDetails from "./showa_business/ProductDetailsScreen";
// import Cart from "./showa_business/CartScreen";
// import ChannelAdminManagement from "./showa_business/ChannelAdminManagement";
// import EmptyCart from "./showa_business/EmptyCartScreen";
// import OoshBusiness from "./showa_business/OoshBusinessScreen";
// import Live from "./showa_business/LiveScreen";
// import Broadcast from "./showa_business/Broadcast";
// import OfficialSearch from "./showa_business/OfficialSearchScreen";
// import CreateChannel from "./showa_business/CreateChannel";
// import InviteChannelLink from "./showa_business/InviteChannelLink";
// import Supplyrequest from "./showa_business/SupplyRequest";
// import SupplyRequestForm from "./showa_business/SupplyRequestForm";
// import SupplyServices from "./showa_business/SupplyServices";
// import SupplyRequestDetail from "./showa_business/SupplyRequestDetail";
// import CreateServices from "./showa_business/CreateServices";
// import SupplyRequestDetailScreen from "./showa_business/SupplyRequestDetailScreen";
// import BroadcastHome from "./showa_business/BroadcastHome";
// import CreateBroadcastPost from "./showa_business/CreateBroadcastPost";
// import ReportPost from "./showa_business/ReportPost";
// import BroadcastUserProfile from "./showa_business/BroadcastUserProfile";
// import MarketPlace from "./showa_business/MarketPlace";
// import CreateListing from "./showa_business/CreateListing";
// import ListingDetails from "./showa_business/ListingDetails";
// import SuggestedFollowers from "./showa_business/SuggestedFollowers";
// import ManagePost from "./showa_business/ManagePost";
// import CreatorDashboard from "./showa_business/CreatorDashboardScreen";
// import ContractHome from "./showa_business/contracts/ContractHome";
// import CreateAdForm from "./showa_business/ads/CreateAdFormScreen";
// import AdReview from "./showa_business/ads/AdReview";
// import BroadcastSuccess from "./showa_business/BroadcastSuccess";
// import AllProducts from "./showa_business/AllProducts";
// import OtherUserCatalog from "./showa_business/OthersUserCatalog";
// import OtherUserCatalogDetail from "./showa_business/OtherUserCatalogDetail";
// import BPrivateChat from "./showa_business/BusinessChat";
// import BusinessGroupChat from "./showa_business/BusinessGroupChat";
// import SupplierNotificationScreen from "./showa_business/SupplierNotificationScreen";
// import RequesterPostHistory from "./showa_business/RequesterPostHistory";
// import GroupMembers from "./showa_business/GroupMembers";
// import SocialHome from "./showa_social/Home";
// import Discover from "./showa_social/Discover";
// import UploadshortVideo from "./showa_social/UploadshortVideo";
// import SearchShort from "./showa_social/SearchShort";
// import GroupCreate from "./screens/GroupCreate";
// import GroupConnect from "./screens/GroupConnect";
// import UserContactListPersonalAccount from "./components/UserContactListPersonalAccount";
// import UpdateModal from "./components/UpdateModal";
// import Music from "./components/Music";
// import UserContactList from "./components/UserContactList";
// import SyncMessagePersonal from "./components/SyncMessagePersonal";
// import SyncContactForBusiness from "./components/SyncContactForBusiness";
// import CameraScreen from "./components/CameraScreen";
// import SongsList from "./components/SongsListScreen";
// import NewCommunity from "./components/NewCommunityScreen";
// import VideoCalls from "./components/VideoCalls";
// import VoiceCalls from "./components/VoiceCalls";
// import GoLive from "./components/GoLive";
// import LiveStream from "./components/LiveStream";
// import ContactUs from "./components/ContactUs";
// import SuccessStory from "./components/SuccessStory";
// import OtherUserProfile from "./screens/profiles/OtherUserProfile";
// import EarningDashbord from "./screens/earning/EarningDashbord";
// import WithdrawEarning from "./screens/earning/WithdrawEarning";
// import PurchaseData from "./screens/earning/PurchaseData";
// import NinRegisterEarning from "./screens/earning/NinRegisterEarning";
// import VideoAds from "./screens/earning/VideoAds";
// import EarningWallet from "./screens/earning/EarningWallet";
// import SynMessage from "./components/SynMessage";
// import SyncContactPersonal from "./components/UserContactPersonal";
// import LiveStreaming from "./src/LiveStreaming";
// import useAppUpdate from "./src/hooks/useAppUpdate";
// import NotificationsScreen from "./screens/NotificationsScreen";
// import GlobalIssueReport from "./components/GlobalIssueReport";
// import NewsList from "./components/NewsList";
// import Broadcaster from "./src/Broadcaster";
// import Viewer from "./src/Viewer";

// // ─── Linking ──────────────────────────────────────────────────────────────────
// import { Linking } from "react-native";

// const linking = {
//   prefixes: ["showa://", "https://showapp.com", "http://showapp.com"],
//   config: {
//     screens: {
//       AiResetPassword: "reset-password",
//       PostDetail: {
//         path: "post/:postId",
//         parse: { postId: (id) => id },
//       },
//       UserProfile: {
//         path: "user/:userId",
//         parse: { userId: (id) => id },
//       },
//       NotFound: "*",
//     },
//   },
//   getInitialURL: async () => {
//     const url = await Linking.getInitialURL();
//     console.log("Initial URL:", url);
//     return url;
//   },
//   subscribe: (listener) => {
//     const onReceiveURL = ({ url }) => {
//       console.log("Received URL:", url);
//       listener(url);
//     };
//     const subscription = Linking.addEventListener("url", onReceiveURL);
//     return () => subscription.remove();
//   },
// };

// // ─── Android 13+ permission helper ───────────────────────────────────────────
// // CRITICAL FIX for silent launch crash on Android 13+:
// // Android 13 (API 33) requires POST_NOTIFICATIONS at runtime. On many OEM
// // builds (Samsung One UI 5+, Xiaomi MIUI 14, Oppo ColorOS 13, Tecno HiOS),
// // Firebase Messaging throws a SecurityException during app init if this
// // permission has never been requested, killing the app before JS loads.
// // We request it as the VERY FIRST thing before any service starts.
// const requestAndroid13Permissions = async () => {
//   if (Platform.OS !== "android") return;

//   try {
//     const apiLevel = Platform.Version; // integer: 33, 34, 35...

//     if (apiLevel >= 33) {
//       // POST_NOTIFICATIONS — mandatory on Android 13+ for FCM / push alerts
//       const notifGranted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//         {
//           title: "Allow Notifications",
//           message:
//             "Showa needs permission to send you messages and call alerts.",
//           buttonPositive: "Allow",
//           buttonNegative: "Not now",
//         }
//       );
//       console.log("POST_NOTIFICATIONS permission:", notifGranted);
//     }

//     if (apiLevel >= 31) {
//       // BLUETOOTH_CONNECT — mandatory on Android 12+ for BT audio during calls
//       const btGranted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
//       );
//       console.log("BLUETOOTH_CONNECT permission:", btGranted);
//     }
//   } catch (err) {
//     // Never let a permission error crash the app — log and continue
//     console.error("Android permission request error:", err);
//   }
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const stopWebRTCConnections = () => {
//   try {
//     if (global.__activeWebRTCConnections?.length > 0) {
//       global.__activeWebRTCConnections.forEach((conn) => {
//         try { conn?.close?.(); } catch (e) {}
//       });
//       global.__activeWebRTCConnections = [];
//     }
//   } catch (err) {
//     console.error("Error stopping WebRTC:", err);
//   }
// };

// const pauseAllVideos = () => {
//   try {
//     if (global.__activeVideoRefs?.length > 0) {
//       global.__activeVideoRefs.forEach((ref) => {
//         try {
//           if (ref?.current && typeof ref.current.pause === "function") {
//             ref.current.pause();
//           }
//         } catch (e) {}
//       });
//     }
//   } catch (err) {
//     console.error("Error pausing videos:", err);
//   }
// };

// const freeMemory = () => {
//   if (Platform.OS === "android") {
//     try {
//       if (global.gc) global.gc();
//       if (global.__largeImageCache) delete global.__largeImageCache;
//       if (global.__videoPrefetchCache) delete global.__videoPrefetchCache;
//     } catch (err) {
//       console.error("Error freeing memory:", err);
//     }
//   }
// };

// const stopBackgroundServices = () => {
//   try {
//     if (global.__backgroundSyncInterval) {
//       clearInterval(global.__backgroundSyncInterval);
//       global.__backgroundSyncInterval = null;
//     }
//     if (global.__contactSyncListener?.remove) {
//       global.__contactSyncListener.remove();
//       global.__contactSyncListener = null;
//     }
//     backgroundFetchService.stop();
//   } catch (err) {
//     console.error("Error stopping background services:", err);
//   }
// };

// // ─── Stack ────────────────────────────────────────────────────────────────────
// const Stack = createNativeStackNavigator();

// // ─── ScreenWrapper ────────────────────────────────────────────────────────────
// const ScreenWrapper = ({ children }) => {
//   const { colors } = useTheme();
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {children}
//     </View>
//   );
// };

// // ─── Root ─────────────────────────────────────────────────────────────────────
// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <NotificationProvider>
//           <AppContent />
//         </NotificationProvider>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// // ─── AppContent ───────────────────────────────────────────────────────────────
// // • Owns the ONE AppState listener (FIX 1 — ThemedNavigator has none)
// // • All timers are in refs and cleared on unmount (FIX 2)
// // • Startup is sequenced, not parallel (FIX 7)
// // • useAppUpdate(false) — no auto-check race (FIX 8)
// function AppContent() {
//   const [userId, setUserId] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const backgroundTimerRef = useRef(null);
//   const updateTimerRef = useRef(null);
//   const appStateRef = useRef(AppState.currentState);

//   const { initializeNotifications } = useNotification();

//   // FIX 8: false = hook does NOT auto-check; we call checkForUpdate ourselves
//   const {
//     updateInfo,
//     showModal: showUpdateModal,
//     dismissModal: dismissUpdateModal,
//     checkForUpdate,
//   } = useAppUpdate(false);

//   // ── Sequenced startup (FIX 7 + Android 13 FIX) ────────────────────────────
//   useEffect(() => {
//     const init = async () => {
//       try {
//         // 1. Android 13+ permissions FIRST — before Firebase/FCM touches anything
//         await requestAndroid13Permissions();
//         // 2. Register FCM token, set up notification listeners
//         await initializeNotifications();
//         // 3. Read auth token from AsyncStorage
//         await checkAuth();
//       } catch (err) {
//         console.error("Startup init error:", err);
//       }
//     };

//     init();

//     return () => {
//       if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//     };
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const checkAuth = async () => {
//     try {
//       const token    = await AsyncStorage.getItem("userToken");
//       const userData = await AsyncStorage.getItem("userData");

//       if (token && userData) {
//         const user = JSON.parse(userData);
//         setUserId(user.id);
//         setIsAuthenticated(true);

//         // FIX 2: tracked, cancellable timer
//         if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//         updateTimerRef.current = setTimeout(() => {
//           checkForUpdate(true);
//         }, 2000);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (err) {
//       console.error("Error checking auth:", err);
//       setIsAuthenticated(false);
//     }
//   };

//   // ── Video prefetch ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!userId) return;

//     let cancelled = false;
//     const initVideoPrefetch = async () => {
//       try {
//         await videoBackgroundfetch.init(userId);
//         if (!cancelled) {
//           const cached = await videoBackgroundfetch.getCachedVideos();
//           console.log("📦 Cached videos ready:", cached?.length || 0);
//         }
//       } catch (err) {
//         console.error("Error initializing video prefetch:", err);
//       }
//     };

//     initVideoPrefetch();

//     return () => {
//       cancelled = true;
//       if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
//       stopBackgroundServices();
//     };
//   }, [userId]);

//   // ── Single AppState listener (FIX 1) ──────────────────────────────────────
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       const currentState = appStateRef.current;

//       if (currentState === "active" && nextAppState === "background") {
//         console.log("📱 App → background");

//         // FIX 4: fire-and-forget — never await inside an event handler
//         if (navigationRef.current) {
//           saveNavigationState(navigationRef.current.getRootState());
//         }

//         if (Platform.OS === "android") {
//           pauseAllVideos();
//           stopWebRTCConnections();

//           if (backgroundTimerRef.current)
//             clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = setTimeout(() => {
//             console.log("🕐 30 s background — light cleanup");
//             freeMemory();
//           }, 30000);
//         }
//       } else if (currentState === "background" && nextAppState === "active") {
//         console.log("📱 App → foreground");

//         if (backgroundTimerRef.current) {
//           clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = null;
//         }

//         // FIX 2: tracked timer
//         if (isAuthenticated) {
//           if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//           updateTimerRef.current = setTimeout(() => {
//             checkForUpdate(true);
//           }, 1000);
//         }

//         InteractionManager.runAfterInteractions(() => {
//           console.log("✅ App resumed — screen state preserved");
//         });
//       }

//       appStateRef.current = nextAppState;
//     };

//     const subscription = AppState.addEventListener("change", handleAppStateChange);

//     return () => {
//       subscription.remove();
//       if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
//       if (updateTimerRef.current)     clearTimeout(updateTimerRef.current);
//     };
//   }, [userId, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <CallProvider>
//         <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//         <NetworkStatusBanner />

//         {updateInfo?.update_available && (
//           <UpdateModal
//             visible={showUpdateModal}
//             updateInfo={updateInfo}
//             onClose={dismissUpdateModal}
//           />
//         )}
//       </CallProvider>
//     </GestureHandlerRootView>
//   );
// }

// // ─── OnlineStatusManager ──────────────────────────────────────────────────────
// const OnlineStatusManager = ({ userId }) => {
//   if (!userId) return null;
//   useOnlineStatus(userId);
//   return null;
// };

// // ─── ThemedNavigator ──────────────────────────────────────────────────────────
// // • NO AppState listener here (FIX 1)
// // • Background services started once, here only (FIX 3)
// // • Navigation state restored only when token exists (FIX 5)
// // • detachPreviousScreen: false REMOVED — saves RAM on all devices (FIX 6)
// // • PIN check runs after isAuthenticated is known (FIX 7)
// function ThemedNavigator({ isAuthenticated, userId }) {
//   const { theme, colors } = useTheme();
//   const [showPinModal,            setShowPinModal]            = useState(false);
//   const [isLoading,               setIsLoading]               = useState(true);
//   const [isNavigationReady,       setIsNavigationReady]       = useState(false);
//   const [initialNavigationState,  setInitialNavigationState]  = useState(undefined);

//   const navSaveTimerRef   = useRef(null);
//   const forceFetchTimerRef = useRef(null);

//   const customTheme = {
//     dark: theme === "dark",
//     colors: {
//       primary:      colors.primary,
//       background:   colors.background,
//       card:         colors.surface || colors.card || colors.background,
//       text:         colors.text,
//       border:       colors.border,
//       notification: colors.primary,
//     },
//     fonts: {
//       regular: { fontFamily: "System", fontWeight: "400" },
//       medium:  { fontFamily: "System", fontWeight: "500" },
//       bold:    { fontFamily: "System", fontWeight: "700" },
//       heavy:   { fontFamily: "System", fontWeight: "900" },
//     },
//   };

//   // FIX 5: restore nav state only when token exists; clear it if not
//   useEffect(() => {
//     const restoreState = async () => {
//       try {
//         const token = await AsyncStorage.getItem("userToken");
//         if (token) {
//           const saved = await loadNavigationState();
//           if (saved) setInitialNavigationState(saved);
//         } else {
//           await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
//         }
//       } catch (err) {
//         console.error("Error restoring navigation state:", err);
//       } finally {
//         setIsNavigationReady(true);
//       }
//     };

//     restoreState();

//     if (!global.__activeWebRTCConnections) global.__activeWebRTCConnections = [];
//     if (!global.__activeVideoRefs)         global.__activeVideoRefs = [];
//     if (!global.__pendingRequests)         global.__pendingRequests = [];

//     return () => {
//       if (navSaveTimerRef.current)    clearTimeout(navSaveTimerRef.current);
//       if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
//     };
//   }, []);

//   // FIX 7: PIN check runs after auth state is set by AppContent
//   useEffect(() => {
//     checkPinRequirement();
//   }, [isAuthenticated]);

//   const checkPinRequirement = async () => {
//     try {
//       const pinEnabled = await AsyncStorage.getItem("pin_enabled");
//       const token      = await AsyncStorage.getItem("userToken");
//       if (pinEnabled === "true" && token) {
//         const status = await checkPinStatus(token);
//         if (status?.has_pin) setShowPinModal(true);
//       }
//     } catch (err) {
//       console.error("Error checking PIN:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // FIX 3: background services started here only — not in AppContent
//   // FIX 9: reset global.__backgroundServicesRunning = false in your logout handler
//   useEffect(() => {
//     if (!userId) return;

//     if (!global.__backgroundServicesRunning) {
//       backgroundFetchService.init();
//       startBackgroundContactSync();
//       setupContactSyncListener();
//       global.__backgroundServicesRunning = true;

//       // FIX 2: tracked timer
//       forceFetchTimerRef.current = setTimeout(() => {
//         backgroundFetchService.forceFetch();
//       }, 2000);
//     }

//     return () => {
//       if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
//     };
//   }, [userId]);

//   // Debounced nav state save — fire-and-forget (FIX 4)
//   const handleNavigationStateChange = (state) => {
//     if (!state) return;
//     if (navSaveTimerRef.current) clearTimeout(navSaveTimerRef.current);
//     navSaveTimerRef.current = setTimeout(() => {
//       saveNavigationState(state);
//     }, 1000);
//   };

//   if (isLoading || !isNavigationReady) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer
//       ref={navigationRef}
//       linking={linking}
//       theme={customTheme}
//       initialState={initialNavigationState}
//       onStateChange={handleNavigationStateChange}
//     >
//       {isAuthenticated && <OnlineStatusManager userId={userId} />}

//       <RNStatusBar
//         barStyle={theme === "dark" ? "light-content" : "dark-content"}
//         backgroundColor={colors.background}
//       />

//       <PinUnlockModal
//         visible={showPinModal}
//         onClose={() => setShowPinModal(false)}
//         navigation={navigationRef.current}
//       />

//       {/* FIX 6: detachPreviousScreen: false removed.
//           Default RN behaviour only mounts the ACTIVE screen — this alone
//           can cut RAM usage by 60-70% on a 80-screen app.
//           If you need one specific screen to stay mounted (e.g. active chat),
//           add options={{ detachPreviousScreen: false }} to that screen ONLY. */}
//       <Stack.Navigator
//         initialRouteName="Loginscreen"
//         screenOptions={{
//           headerShown: false,
//           contentStyle: { backgroundColor: colors.background },
//         }}
//       >
//         {/* ── Authentication ─────────────────────────────────────────────── */}
//         <Stack.Screen name="Loginscreen">
//           {(props) => <ScreenWrapper><Loginscreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Signin">
//           {(props) => <ScreenWrapper><Signin {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Signin_two">
//           {(props) => <ScreenWrapper><Signin_two {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Register">
//           {(props) => <ScreenWrapper><Register {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VerificationCode">
//           {(props) => <ScreenWrapper><VerificationCode {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LinkingScreen">
//           {(props) => <ScreenWrapper><LinkingScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Biometric">
//           {(props) => <ScreenWrapper><Biometric {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ProceedOptions">
//           {(props) => <ScreenWrapper><ProceedOptions {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Terms">
//           {(props) => <ScreenWrapper><Terms {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="TermsCondition">
//           {(props) => <ScreenWrapper><TermsCondition {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PrivacyPolicy">
//           {(props) => <ScreenWrapper><PrivacyPolicy {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Personal account ───────────────────────────────────────────── */}
//         <Stack.Screen name="PHome">
//           {(props) => <ScreenWrapper><PHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UserPersonalAccountProfile">
//           {(props) => <ScreenWrapper><UserPersonalAccountProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SyncContactForBusiness">
//           {(props) => <ScreenWrapper><SyncContactForBusiness {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PStatusBar">
//           {(props) => <ScreenWrapper><PStatusBar {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="StatusEditorScreen">
//           {(props) => <ScreenWrapper><StatusEditorScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="JoinChannel">
//           {(props) => <ScreenWrapper><JoinChannel {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Calls">
//           {(props) => <ScreenWrapper><Calls {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CallOngoingScreen">
//           {(props) => <ScreenWrapper><CallOngoingScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Settings">
//           {(props) => <ScreenWrapper><Settings {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NotificationsScreen">
//           {(props) => <ScreenWrapper><NotificationsScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NotificationSetting">
//           {(props) => <ScreenWrapper><NotificationSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="WallpaperSetting">
//           {(props) => <ScreenWrapper><WallpaperSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="FaceSecuritySetting">
//           {(props) => <ScreenWrapper><FaceSecuritySetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PrivateChat">
//           {(props) => <ScreenWrapper><PrivateChat {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Business account ───────────────────────────────────────────── */}
//         <Stack.Screen name="BusinessHome">
//           {(props) => <ScreenWrapper><BusinessHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PostDetails">
//           {(props) => <ScreenWrapper><PostDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ChannelDetails">
//           {(props) => <ScreenWrapper><ChannelDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ChannelAdminManagement">
//           {(props) => <ScreenWrapper><ChannelAdminManagement {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BUserProfile">
//           {(props) => <ScreenWrapper><BUserProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BStatusBar">
//           {(props) => <ScreenWrapper><BStatusBar {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BStatusEditorScreen">
//           {(props) => <ScreenWrapper><BStatusEditorScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BJoinChannel">
//           {(props) => <ScreenWrapper><BJoinChannel {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BCalls">
//           {(props) => <ScreenWrapper><BCalls {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BCallOngoingScreen">
//           {(props) => <ScreenWrapper><BCallOngoingScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BSettings">
//           {(props) => <ScreenWrapper><BSettings {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BNotificationSetting">
//           {(props) => <ScreenWrapper><BNotificationSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BWallpaperSetting">
//           {(props) => <ScreenWrapper><BWallpaperSetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BFaceSecuritySetting">
//           {(props) => <ScreenWrapper><BFaceSecuritySetting {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ToolsScreen">
//           {(props) => <ScreenWrapper><ToolsScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="QuickReplies">
//           {(props) => <ScreenWrapper><QuickReplies {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AddQuickReply">
//           {(props) => <ScreenWrapper><AddQuickReply {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EssentialPlatforms">
//           {(props) => <ScreenWrapper><EssentialPlatformsScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Advertise">
//           {(props) => <ScreenWrapper><Advertise {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ManageProfile">
//           {(props) => <ScreenWrapper><ManageProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateCatalog">
//           {(props) => <ScreenWrapper><CreateCatalog {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Explore">
//           {(props) => <ScreenWrapper><Explore {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AddItemToCatalog">
//           {(props) => <ScreenWrapper><AddItemToCatalog {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LabelChats">
//           {(props) => <ScreenWrapper><LabelChats {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Labels">
//           {(props) => <ScreenWrapper><Labels {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AddQuickReplyScreen">
//           {(props) => <ScreenWrapper><AddQuickReplyScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GreetingMessage">
//           {(props) => <ScreenWrapper><GreetingMessage {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AwayMessage">
//           {(props) => <ScreenWrapper><AwayMessage {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HelpCenter">
//           {(props) => <ScreenWrapper><HelpCenter {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HelpTopic">
//           {(props) => <ScreenWrapper><HelpTopic {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BusinessSetup">
//           {(props) => <ScreenWrapper><BusinessSetup {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ProductDetails">
//           {(props) => <ScreenWrapper><ProductDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Cart">
//           {(props) => <ScreenWrapper><Cart {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EmptyCart">
//           {(props) => <ScreenWrapper><EmptyCart {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Broadcast">
//           {(props) => <ScreenWrapper><Broadcast {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OfficialSearch">
//           {(props) => <ScreenWrapper><OfficialSearch {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Live">
//           {(props) => <ScreenWrapper><Live {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OoshBusiness">
//           {(props) => <ScreenWrapper><OoshBusiness {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateChannel">
//           {(props) => <ScreenWrapper><CreateChannel {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="InviteChannelLink">
//           {(props) => <ScreenWrapper><InviteChannelLink {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Supplyrequest">
//           {(props) => <ScreenWrapper><Supplyrequest {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyRequestForm">
//           {(props) => <ScreenWrapper><SupplyRequestForm {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyServices">
//           {(props) => <ScreenWrapper><SupplyServices {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyRequestDetail">
//           {(props) => <ScreenWrapper><SupplyRequestDetail {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateServices">
//           {(props) => <ScreenWrapper><CreateServices {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyRequestDetailScreen">
//           {(props) => <ScreenWrapper><SupplyRequestDetailScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BroadcastHome">
//           {(props) => <ScreenWrapper><BroadcastHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateBroadcastPost">
//           {(props) => <ScreenWrapper><CreateBroadcastPost {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ReportPost">
//           {(props) => <ScreenWrapper><ReportPost {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BroadcastUserProfile">
//           {(props) => <ScreenWrapper><BroadcastUserProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="MarketPlace">
//           {(props) => <ScreenWrapper><MarketPlace {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateListing">
//           {(props) => <ScreenWrapper><CreateListing {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ListingDetails">
//           {(props) => <ScreenWrapper><ListingDetails {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SuggestedFollowers">
//           {(props) => <ScreenWrapper><SuggestedFollowers {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ManagePost">
//           {(props) => <ScreenWrapper><ManagePost {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreatorDashboard">
//           {(props) => <ScreenWrapper><CreatorDashboard {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="MonetizationRequestForm">
//           {(props) => <ScreenWrapper><MonetizationRequestForm {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ChatAi">
//           {(props) => <ScreenWrapper><ChatAi {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ContractHome">
//           {(props) => <ScreenWrapper><ContractHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateAdForm">
//           {(props) => <ScreenWrapper><CreateAdForm {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AdReview">
//           {(props) => <ScreenWrapper><AdReview {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BroadcastSuccess">
//           {(props) => <ScreenWrapper><BroadcastSuccess {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AllProducts">
//           {(props) => <ScreenWrapper><AllProducts {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OtherUserCatalog">
//           {(props) => <ScreenWrapper><OtherUserCatalog {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OtherUserCatalogDetail">
//           {(props) => <ScreenWrapper><OtherUserCatalogDetail {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BPrivateChat">
//           {(props) => <ScreenWrapper><BPrivateChat {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BusinessGroupChat">
//           {(props) => <ScreenWrapper><BusinessGroupChat {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplierNotificationScreen">
//           {(props) => <ScreenWrapper><SupplierNotificationScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="RequesterPostHistory">
//           {(props) => <ScreenWrapper><RequesterPostHistory {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GroupMembers">
//           {(props) => <ScreenWrapper><GroupMembers {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Social ─────────────────────────────────────────────────────── */}
//         <Stack.Screen name="SocialHome">
//           {(props) => <ScreenWrapper><SocialHome {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Discover">
//           {(props) => <ScreenWrapper><Discover {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UploadshortVideo">
//           {(props) => <ScreenWrapper><UploadshortVideo {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SearchShort">
//           {(props) => <ScreenWrapper><SearchShort {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Features ───────────────────────────────────────────────────── */}
//         <Stack.Screen name="Music">
//           {(props) => <ScreenWrapper><Music {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GroupCreate">
//           {(props) => <ScreenWrapper><GroupCreate {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GroupConnect">
//           {(props) => <ScreenWrapper><GroupConnect {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UserContactList">
//           {(props) => <ScreenWrapper><UserContactList {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SynMessage">
//           {(props) => <ScreenWrapper><SynMessage {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SyncContactPersonal">
//           {(props) => <ScreenWrapper><SyncContactPersonal {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UserContactListPersonalAccount">
//           {(props) => <ScreenWrapper><UserContactListPersonalAccount {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SyncMessagePersonal">
//           {(props) => <ScreenWrapper><SyncMessagePersonal {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CameraScreen">
//           {(props) => <ScreenWrapper><CameraScreen {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SongsList">
//           {(props) => <ScreenWrapper><SongsList {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NewCommunity">
//           {(props) => <ScreenWrapper><NewCommunity {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VideoCalls">
//           {(props) => <ScreenWrapper><VideoCalls {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VoiceCalls">
//           {(props) => <ScreenWrapper><VoiceCalls {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GoLive">
//           {(props) => <ScreenWrapper><GoLive {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LiveStream">
//           {(props) => <ScreenWrapper><LiveStream {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ContactUs">
//           {(props) => <ScreenWrapper><ContactUs {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SuccessStory">
//           {(props) => <ScreenWrapper><SuccessStory {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OtherUserProfile">
//           {(props) => <ScreenWrapper><OtherUserProfile {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LiveStreaming">
//           {(props) => <ScreenWrapper><LiveStreaming {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GlobalIssueReport">
//           {(props) => <ScreenWrapper><GlobalIssueReport {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NewsList">
//           {(props) => <ScreenWrapper><NewsList {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Broadcaster">
//           {(props) => <ScreenWrapper><Broadcaster {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Viewer">
//           {(props) => <ScreenWrapper><Viewer {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Earning ────────────────────────────────────────────────────── */}
//         <Stack.Screen name="EarningDashbord">
//           {(props) => <ScreenWrapper><EarningDashbord {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="WithdrawEarning">
//           {(props) => <ScreenWrapper><WithdrawEarning {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PurchaseData">
//           {(props) => <ScreenWrapper><PurchaseData {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NinRegisterEarning">
//           {(props) => <ScreenWrapper><NinRegisterEarning {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VideoAds">
//           {(props) => <ScreenWrapper><VideoAds {...props} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EarningWallet">
//           {(props) => <ScreenWrapper><EarningWallet {...props} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Modal ──────────────────────────────────────────────────────── */}
//         <Stack.Screen
//           name="CallOverlay"
//           component={IncomingCallModal}
//           options={{
//             presentation: "transparentModal",
//             animation: "fade",
//             contentStyle: { backgroundColor: "transparent" },
//           }}
//         />
//       </Stack.Navigator>

//       {userId && <CallSignalListener userId={userId} />}
//     </NavigationContainer>
//   );
// }

// // ─── Logout helper ────────────────────────────────────────────────────────────
// // Import and call this from your logout button.
// // FIX 9: resets service flag so they restart on next login.
// // FIX 5: clears stale navigation state so user lands on Login.
// export const handleAppLogout = async (clearTokenFn) => {
//   try {
//     global.__backgroundServicesRunning = false;
//     global.__activeWebRTCConnections   = [];
//     global.__activeVideoRefs           = [];

//     stopBackgroundServices();

//     await AsyncStorage.multiRemove([
//       NAVIGATION_STATE_KEY,
//       "userToken",
//       "userData",
//     ]);

//     if (typeof clearTokenFn === "function") await clearTokenFn();
//   } catch (err) {
//     console.error("Error during logout cleanup:", err);
//   }
// };


import React, { useEffect, useState, useRef } from "react";
import {
  AppState,
  View,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
  Platform,
  ActivityIndicator,
  StatusBar as RNStatusBar,
  InteractionManager,
  LogBox,
  PermissionsAndroid, 
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
import RNCallKeep from 'react-native-callkeep';
import {
  NotificationProvider,
  useNotification,
} from "./src/context/NotificationContext";

const BLOCKED_AUTO_NAVIGATION_SCREENS  = [
  "SocialHome",
  "Discover", 
  "SearchShort", 
];

// ─── Navigation ref ───────────────────────────────────────────────────────────
const navigationRef = React.createRef();
const NAVIGATION_STATE_KEY = "NAVIGATION_STATE";



// Fire-and-forget — never awaited inside event handlersgggg
const saveNavigationState = (state) => {
  if (!state) return;
  AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state)).catch(
    (err) => console.error("Failed to save navigation state:", err)
  );
};


const loadNavigationState = async () => {
  try {
    const raw = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch (err) {
    console.error("Failed to load navigation state:", err);
    return undefined;
  }
};

// ─── LogBox ───────────────────────────────────────────────────────────────────
LogBox.ignoreLogs([
  "new NativeEventEmitter",
  "Require cycle:",
  "VirtualizedLists should never be nested",
]);

// ─── All imports ──────────────────────────────────────────────────────────────
import { checkPinStatus } from "./showa_personal_account_screen/FaceSecuritySetting";
import PinUnlockModal from "./screens/PinUnlockModal";
import videoBackgroundfetch from "./src/services/VideoBackgroundFetch";
import { ThemeProvider } from "./src/context/ThemeContext";
import { useTheme } from "./src/context/ThemeContext";
import { CallProvider } from "./components/CallContext";
import CallSignalListener from "./components/CallSignalListener";
import IncomingCallModal from "./components/IncomingCallModal";
import NetworkStatusBanner from "./components/Networkstatusbanner";
import {
  startBackgroundContactSync,
  setupContactSyncListener,
} from "./components/BackgroundSync";
import backgroundFetchService from "./src/services/BackgroundFetchService";
import Loginscreen from "./screens/Loginscreen";
import Signin from "./screens/onboard/SignIn";
import Signin_two from "./screens/onboard/SignIn2_two";
import TermsCondition from "./screens/onboard/Terms";
import PrivacyPolicy from "./screens/onboard/PrivacyPolicy";
import Register from "./screens/onboard/Register";
import EmailLogin from "./screens/onboard/EmailLogin";
import EmailRegister from "./screens/onboard/EmailRegisterScreen";
import ForgotPassword from "./screens/onboard/ForgotPasswordScreen";
import LoginMethod from "./screens/onboard/LoginMethod";
import Biometric from "./screens/onboard/Biometric";
import LinkingScreen from "./screens/onboard/LinkingScreen";
import VerificationCode from "./screens/onboard/VerifyEmail";
import ProceedOptions from "./screens/ProceedOptions";
import Terms from "./screens/TermsPrivacyScreen";
import PHome from "./showa_personal_account_screen/PHome";
import UserPersonalAccountProfile from "./screens/profiles/UserPersonalAccountProfile";
import PStatusBar from "./showa_personal_account_screen/StatusBar";
import StatusEditorScreen from "./showa_personal_account_screen/StatusEditorScreen";
import JoinChannel from "./showa_personal_account_screen/JoinChannel";
import Calls from "./showa_personal_account_screen/Calls";
import CallOngoingScreen from "./showa_personal_account_screen/CallOngoingScreen";
import Settings from "./showa_personal_account_screen/Settings";
import NotificationSetting from "./showa_personal_account_screen/NotificationSetting";
import WallpaperSetting from "./showa_personal_account_screen/WallpaperSetting";
import FaceSecuritySetting from "./showa_personal_account_screen/FaceSecuritySetting";
import PrivateChat from "./showa_personal_account_screen/PrivateChat";
import ChannelDetails from "./showa_business/ChannelDetails";
import PostDetails from "./showa_business/PostDetailScreen";
import BusinessHome from "./showa_business/Home";
import ChatAi from "./showa_business/ChatAi";
import MonetizationRequestForm from "./showa_business/MonetizationRequestForm";
import BUserProfile from "./showa_business/UserProfile";
import BStatusBar from "./showa_business/StatusBar";
import BStatusEditorScreen from "./showa_business/StatusEditorScreen";
import BJoinChannel from "./showa_business/JoinChannel";
import BCalls from "./showa_business/Calls";
import BCallOngoingScreen from "./showa_business/CallOngoingScreen";
import BSettings from "./showa_business/Settings";
import BNotificationSetting from "./showa_business/NotificationSetting";
import BWallpaperSetting from "./showa_business/WallpaperSetting";
import BFaceSecuritySetting from "./showa_business/FaceSecuritySetting";
import ToolsScreen from "./showa_business/ToolsScreen";
import QuickReplies from "./showa_business/QuickReplies";
import AddQuickReply from "./showa_business/AddQuickReply";
import EssentialPlatformsScreen from "./showa_business/EssentialPlatformsScreen";
import Advertise from "./showa_business/Advertise";
import ManageProfile from "./showa_business/ManageProfile";
import CreateCatalog from "./showa_business/CreateCatalog";
import AddItemToCatalog from "./showa_business/AddItemToCatalog";
import Explore from "./showa_business/Explore";
import LabelChats from "./showa_business/LabelChatsScreen";
import Labels from "./showa_business/LabelsScreen";
import AddQuickReplyScreen from "./showa_business/AddQuickReplyScreen";
import GreetingMessage from "./showa_business/GreetingMessage";
import AwayMessage from "./showa_business/AwayMessageScreen";
import HelpCenter from "./showa_business/HelpCenterScreen";
import HelpTopic from "./showa_business/HelpTopicScreen";
import BusinessSetup from "./showa_business/BusinessSetupScreen";
import ProductDetails from "./showa_business/ProductDetailsScreen";
import Cart from "./showa_business/CartScreen";
import ChannelAdminManagement from "./showa_business/ChannelAdminManagement";
import EmptyCart from "./showa_business/EmptyCartScreen";
import OoshBusiness from "./showa_business/OoshBusinessScreen";
import Live from "./showa_business/LiveScreen";
import Broadcast from "./showa_business/Broadcast";
import OfficialSearch from "./showa_business/OfficialSearchScreen";
import CreateChannel from "./showa_business/CreateChannel";
import InviteChannelLink from "./showa_business/InviteChannelLink";
import Supplyrequest from "./showa_business/SupplyRequest";
import SupplyRequestForm from "./showa_business/SupplyRequestForm";
import SupplyServices from "./showa_business/SupplyServices";
import SupplyRequestDetail from "./showa_business/SupplyRequestDetail";
import CreateServices from "./showa_business/CreateServices";
import SupplyRequestDetailScreen from "./showa_business/SupplyRequestDetailScreen";
import BroadcastHome from "./showa_business/BroadcastHome";
import CreateBroadcastPost from "./showa_business/CreateBroadcastPost";
import ReportPost from "./showa_business/ReportPost";
import BroadcastUserProfile from "./showa_business/BroadcastUserProfile";
import MarketPlace from "./showa_business/MarketPlace";
import CreateListing from "./showa_business/CreateListing";
import ListingDetails from "./showa_business/ListingDetails";
import SuggestedFollowers from "./showa_business/SuggestedFollowers";
import ManagePost from "./showa_business/ManagePost";
import CreatorDashboard from "./showa_business/CreatorDashboardScreen";
import ContractHome from "./showa_business/contracts/ContractHome";
import CreateAdForm from "./showa_business/ads/CreateAdFormScreen";
import AdReview from "./showa_business/ads/AdReview";
import BroadcastSuccess from "./showa_business/BroadcastSuccess";
import AllProducts from "./showa_business/AllProducts";
import OtherUserCatalog from "./showa_business/OthersUserCatalog";
import OtherUserCatalogDetail from "./showa_business/OtherUserCatalogDetail";
import BPrivateChat from "./showa_business/BusinessChat";
import BusinessGroupChat from "./showa_business/BusinessGroupChat";
import SupplierNotificationScreen from "./showa_business/SupplierNotificationScreen";
import RequesterPostHistory from "./showa_business/RequesterPostHistory";
import GroupMembers from "./showa_business/GroupMembers";
import SocialHome from "./showa_social/Home";
import ShortDetail from "./showa_social/ShortDetailScreen";
import Discover from "./showa_social/Discover";
import UploadshortVideo from "./showa_social/UploadshortVideo";
import SearchShort from "./showa_social/SearchShort";
import GroupCreate from "./screens/GroupCreate";
import GroupConnect from "./screens/GroupConnect";
import UserContactListPersonalAccount from "./components/UserContactListPersonalAccount";
import UpdateModal from "./components/UpdateModal";
import Music from "./components/Music";
import UserContactList from "./components/UserContactList";
import SyncMessagePersonal from "./components/SyncMessagePersonal";
import SyncContactForBusiness from "./components/SyncContactForBusiness";
import CameraScreen from "./components/CameraScreen";
import SongsList from "./components/SongsListScreen";
import NewCommunity from "./components/NewCommunityScreen";
import VideoCalls from "./components/VideoCalls";
import VoiceCalls from "./components/VoiceCalls";
import GoLive from "./components/GoLive";
import LiveStream from "./components/LiveStream";
import ContactUs from "./components/ContactUs";
import SuccessStory from "./components/SuccessStory";
import OtherUserProfile from "./screens/profiles/OtherUserProfile";
import EarningDashbord from "./screens/earning/EarningDashbord";
import WithdrawEarning from "./screens/earning/WithdrawEarning";
import PurchaseData from "./screens/earning/PurchaseData";
import NinRegisterEarning from "./screens/earning/NinRegisterEarning";
import VideoAds from "./screens/earning/VideoAds";
import EarningWallet from "./screens/earning/EarningWallet";
import SynMessage from "./components/SynMessage";
import SyncContactPersonal from "./components/UserContactPersonal";
import LiveStreaming from "./src/LiveStreaming";
import useAppUpdate from "./src/hooks/useAppUpdate";
import NotificationsScreen from "./screens/NotificationsScreen";
import GlobalIssueReport from "./components/GlobalIssueReport";
import NewsList from "./components/NewsList";
import Broadcaster from "./src/Broadcaster";
import Viewer from "./src/Viewer";
import CallKeepService from './src/services/CallKeepService';
import CompleteSignupProfile from "./screens/onboard/CompleteSignupProfile";



// ─── Linking ──────────────────────────────────────────────────────────────────
import { Linking } from "react-native";


const linking = {
  prefixes: ["showa://", "https://showapp.com", "http://showapp.com"],
  config: {
    screens: {
      ShortDetail: {
        path: "short/:shortId",
        parse: {
          shortId: (shortId) => {
            console.log("📱 Linking - Parsing shortId:", shortId);
            return shortId;
          }
        }
      },
      PostDetail: {
        path: "post/:postId",
        parse: {
          postId: (postId) => {
            console.log("📱 Linking - Parsing postId:", postId);
            return postId;
          }
        }
      },
      OtherUserProfile: {
        path: "user/:userId",
        parse: {
          userId: (userId) => userId
        }
      },
      NotFound: "*",
    },
  },
  getInitialURL: async () => {
    try {
      const url = await Linking.getInitialURL();
      console.log("🔗 Linking.getInitialURL:", url);
      return url;
    } catch (err) {
      console.error("Error in getInitialURL:", err);
      return null;
    }
  },
  subscribe: (listener) => {
    const onReceiveURL = ({ url }) => {
      console.log("🔔 Linking.subscribe received:", url);
      listener(url);
    };
    const subscription = Linking.addEventListener("url", onReceiveURL);
    return () => subscription.remove();
  },
};

const useDeepLinkHandler = () => {
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { url } = event;
      console.log("🔗 Deep link received:", url);
      
      if (!url || !navigationRef.current) {
        console.log("❌ No URL or navigation ref available");
        return;
      }
      
      // Wait a bit for navigation to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check for short video deep link
      // Supports formats: showa://short/19, showa://s/19, https://showapp.com/short/19
      const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
      if (shortMatch) {
        const shortId = shortMatch[1];
        console.log("🎬 Navigating to ShortDetail with ID:", shortId);
        
        try {
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'ShortDetail',
              params: { 
                shortId: parseInt(shortId, 10),
                id: parseInt(shortId, 10),
                short_id: parseInt(shortId, 10)
              },
            })
          );
          console.log("✅ ShortDetail navigation dispatched");
        } catch (error) {
          console.error("❌ Failed to navigate to ShortDetail:", error);
        }
        return;
      }
      
      // Check for post deep link
      // Supports formats: showa://post/97, showa://p/97, https://showapp.com/post/97
      const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
      if (postMatch) {
        const postId = postMatch[1];
        console.log("📝 Navigating to PostDetail with ID:", postId);
        
        try {
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'PostDetails',
              params: { 
                postId: parseInt(postId, 10),
                id: parseInt(postId, 10),
                post_id: parseInt(postId, 10)
              },
            })
          );
          console.log("✅ PostDetail navigation dispatched");
        } catch (error) {
          console.error("❌ Failed to navigate to PostDetail:", error);
        }
        return;
      }
      
      // Check for user profile deep link
      const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
      if (userMatch) {
        const userId = userMatch[1];
        console.log("👤 Navigating to UserProfile with ID:", userId);
        
        try {
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'OtherUserProfile',
              params: { userId: parseInt(userId, 10) },
            })
          );
          console.log("✅ UserProfile navigation dispatched");
        } catch (error) {
          console.error("❌ Failed to navigate to UserProfile:", error);
        }
        return;
      }
      
      console.log("⚠️ No matching deep link pattern found for URL:", url);
    };

//     useEffect(() => {
//   // Initialize CallKeep when app starts
//   const initCallKeep = async () => {
//     await CallKeepService.initialize();
//   };
//   initCallKeep();
// }, []);


    


    // Check initial URL when app starts
    const checkInitialUrl = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          console.log("📱 Initial deep link detected:", url);
          // Small delay to ensure app is fully initialized
          setTimeout(() => {
            handleDeepLink({ url });
          }, 500);
        } else {
          console.log("📱 No initial deep link detected");
        }
      } catch (error) {
        console.error("❌ Error checking initial URL:", error);
      }
    };
    
    checkInitialUrl();
    
    // Listen for subsequent deep links while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      console.log("🔔 Deep link event received:", event.url);
      handleDeepLink(event);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
};

// const linking = {
//   prefixes: ["showa://", "https://showapp.com", "http://showapp.com"],
//   config: {
//     screens: {
//       AiResetPassword: "reset-password",
//       PostDetail: {
//         path: "post/:postId",
//         parse: { postId: (id) => id },
//       },
//       UserProfile: {
//         path: "user/:userId",
//         parse: { userId: (id) => id },
//       },
//       NotFound: "*",
//     },
//   },
//   getInitialURL: async () => {
//     const url = await Linking.getInitialURL();
//     console.log("Initial URL:", url);
//     return url;
//   },
//   subscribe: (listener) => {
//     const sub = Linking.addEventListener("url", ({ url }) => listener(url));
//     return () => sub.remove();
//   },
// };



// ─── Android permission helper (API 13 / 14 / 15+) ───────────────────────────
//
// WHY THIS ORDER MATTERS:
//   Android 13 (API 33): POST_NOTIFICATIONS + READ_MEDIA_* required at runtime
//   Android 14 (API 34): Stricter foreground service type checks (manifest fix)
//   Android 15 (API 35): READ_MEDIA_VISUAL_USER_SELECTED required for media picker
//                         Edge-to-edge enforced system-wide
//                         MissingForegroundServiceTypeException kills app silently
//
// This function must complete BEFORE initializeNotifications() is called,
// otherwise Firebase Messaging throws SecurityException on API 33+ (silent kill).
//
const requestRuntimePermissions = async () => {
  if (Platform.OS !== "android") return;

  try {
    const api = Platform.Version; // e.g. 33, 34, 35
    console.log(`📱 Android API level: ${api}`);

    const toRequest = [];

    // ── API 33+ (Android 13+) ─────────────────────────────────────────────
    if (api >= 33) {
      // Required BEFORE Firebase Messaging initialises — without this the
      // app throws SecurityException and silently crashes on launch.
      toRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

      // Granular media permissions replace READ_EXTERNAL_STORAGE on API 33+
      toRequest.push(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
      );
    }

    // ── API 35+ (Android 15+) ─────────────────────────────────────────────
    // READ_MEDIA_VISUAL_USER_SELECTED enables the new partial photo picker.
    // Without it the system photo picker crashes the app on Android 15 devices
    // (Pixel 9, Samsung S25, etc.) when the user selects media.
    if (api >= 35) {
      // Only add if the permission constant exists in this version of RN
      if (PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED) {
        toRequest.push(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED
        );
      }
    }

    if (toRequest.length === 0) return;

    const results = await PermissionsAndroid.requestMultiple(toRequest);

    // Log results — never crash the app because of a denied permission
    toRequest.forEach((perm) => {
      const name = perm.split(".").pop();
      const result = results[perm];
      console.log(
        `  ${result === PermissionsAndroid.RESULTS.GRANTED ? "✅" : "⚠️"} ${name}: ${result}`
      );
    });
  } catch (err) {
    // Never let permission errors kill the app
    console.error("Permission request error (non-fatal):", err);
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const stopWebRTCConnections = () => {
  try {
    (global.__activeWebRTCConnections || []).forEach((conn) => {
      try { conn && conn.close && conn.close(); } catch (_) {}
    });
    global.__activeWebRTCConnections = [];
  } catch (err) {
    console.error("stopWebRTCConnections:", err);
  }
};

const pauseAllVideos = () => {
  try {
    (global.__activeVideoRefs || []).forEach((ref) => {
      try {
        if (ref && ref.current && typeof ref.current.pause === "function")
          ref.current.pause();
      } catch (_) {}
    });
  } catch (err) {
    console.error("pauseAllVideos:", err);
  }
};

const freeMemory = () => {
  if (Platform.OS !== "android") return;
  try {
    if (global.gc) global.gc();
    delete global.__largeImageCache;
    delete global.__videoPrefetchCache;
  } catch (err) {
    console.error("freeMemory:", err);
  }
};

const stopBackgroundServices = () => {
  try {
    if (global.__backgroundSyncInterval) {
      clearInterval(global.__backgroundSyncInterval);
      global.__backgroundSyncInterval = null;
    }
    if (global.__contactSyncListener?.remove) {
      global.__contactSyncListener.remove();
      global.__contactSyncListener = null;
    }
    backgroundFetchService.stop();
  } catch (err) {
    console.error("stopBackgroundServices:", err);
  }
};

// ─── Stack ────────────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();

// ─── ScreenWrapper ────────────────────────────────────────────────────────────
const ScreenWrapper = ({ children }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </View>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// ─── AppContent ───────────────────────────────────────────────────────────────
// Launch sequence (all Android versions):
//   1. requestRuntimePermissions()  ← MUST be first — before any service init
//   2. initializeNotifications()    ← safe after permission granted
//   3. checkAuth()                  ← reads user state
//
// Single AppState listener — ThemedNavigator has none.
// Every timer stored in a ref and cleared on unmount.
// isMountedRef guards against setState on unmounted component.

function AppContent() {
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const backgroundTimerRef = useRef(null);
  const updateTimerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const isMountedRef = useRef(true);

  const { initializeNotifications } = useNotification();
  // false = we call checkForUpdate manually at safe moments only
  const {
    updateInfo,
    showModal: showUpdateModal,
    dismissModal: dismissUpdateModal,
    checkForUpdate,
  } = useAppUpdate(false);


  // App.js — inside your root component
// useEffect(() => {
//   const initCallKeep = async () => {
//     const initialized = await CallKeepService.initialize();
//     console.log('[App] CallKeep initialized:', initialized);

//     // On Android, log phone account status for debugging
//     if (Platform.OS === 'android') {
//       try {
//         const hasAccount = await RNCallKeep.hasPhoneAccount();
//         console.log('[App] Phone account active:', hasAccount);
//         if (!hasAccount) {
//           // Show user a one-time prompt explaining they need to enable it
//           Alert.alert(
//             'Enable Call Features',
//             'To receive calls, please enable Showa in your phone accounts settings.',
//             [
//               { text: 'Later', style: 'cancel' },
//               { text: 'Enable Now', onPress: () => RNCallKeep.openPhoneAccounts() },
//             ]
//           );
//         }
//       } catch (e) {
//         console.warn('[App] Could not check phone account:', e);
//       }
//     }
//   };

//   initCallKeep();
// }, []);

// useEffect(() => {
//   const ensurePhoneAccount = async () => {
//     if (Platform.OS !== 'android') return;
//     try {
//       await CallKeepService.initialize(); // setup first
//       const hasAccount = await RNCallKeep.hasPhoneAccount();
//       console.log('[App] Phone account enabled:', hasAccount);

//       if (!hasAccount) {
//         Alert.alert(
//           'Enable Incoming Calls',
//           'Showa needs to be enabled as a calling account so you can receive calls. This is a one-time setup.',
//           [
//             { text: 'Later', style: 'cancel' },
//             {
//               text: 'Enable Now',
//               onPress: () => RNCallKeep.openPhoneAccounts(),
//             },
//           ]
//         );
//       }
//     } catch (e) {
//       console.warn('[App] Phone account check failed:', e);
//     }
//   };

//   ensurePhoneAccount();
// }, []);

useEffect(() => {
  // Listen for incoming calls from notification (app in foreground/background)
  const callSubscription = DeviceEventEmitter.addListener(
    'incomingCallFromNotification',
    (callData) => {
      console.log('[App] Incoming call from notification:', callData);
      handleIncomingCallNavigation(callData);
    }
  );

  // Check for pending call if app was opened from killed state
  const checkPendingCall = async () => {
    try {
      if (NativeModules.CallModule) {
        const pending = await NativeModules.CallModule.getPendingCall();
        if (pending) {
          console.log('[App] Pending call on startup:', pending);
          // Small delay to let navigation stack initialize
          setTimeout(() => handleIncomingCallNavigation(pending), 1000);
        }
      }
    } catch (e) {
      console.warn('[App] getPendingCall error:', e);
    }
  };

  // Setup calling + check phone account
  const setupCalling = async () => {
    if (Platform.OS !== 'android') return;

    await CallKeepService.initialize();

    const apiLevel = parseInt(Platform.Version, 10);

    // Check phone account (required for CallKeep on Android)
    try {
      const hasAccount = await RNCallKeep.hasPhoneAccount();
      console.log('[App] Phone account enabled:', hasAccount);

      if (!hasAccount) {
        Alert.alert(
          'One-time Setup Required',
          'To receive calls, please enable Showa in your phone calling accounts. This only needs to be done once.',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Enable Now', onPress: () => RNCallKeep.openPhoneAccounts() },
          ]
        );
      }
    } catch (e) {
      console.warn('[App] Phone account check error:', e);
    }

    // Android 14+ needs explicit full-screen intent permission
    if (apiLevel >= 34) {
      try {
        const hasPermission =
          await NativeModules.CallModule?.hasFullScreenIntentPermission();
        console.log('[App] Full screen intent permission:', hasPermission);

        if (!hasPermission) {
          Alert.alert(
            'Enable Call Screen',
            'To show incoming calls on your lock screen, please grant the display permission.',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      } catch (e) {
        console.warn('[App] Full screen intent check error:', e);
      }
    }
  };

  setupCalling();
  checkPendingCall();

  return () => {
    callSubscription.remove();
  };
}, []);

// const handleIncomingCallNavigation = (callData) => {
//   try {
//     NativeModules.CallModule?.stopCallService();
//   } catch (e) {}

//   if (callData.autoAccept && navigationRef.current) {
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.navigate('VoiceCalls', {
//           name: callData.callerName,
//           targetUserId: callData.callerId,
//           isIncomingCall: true,
//           isInitiator: false,
//           incomingOffer: null,
//           callType: callData.callType,
//           roomId: callData.roomId,
//           callId: callData.callId,
//         })
//       );
//     } catch (error) {
//       console.error('Failed to navigate to VoiceCalls:', error);
//       // Fallback: Show in-app modal instead
//       if (global.__callNotificationHandler) {
//         global.__callNotificationHandler(callData);
//       }
//     }
//   } else if (global.__callNotificationHandler) {
//     global.__callNotificationHandler(callData);
//   }
// };

const handleIncomingCallNavigation = (callData) => {
  console.log("========== APP.JS NAVIGATION ==========");
console.log("callData:", JSON.stringify(callData, null, 2));
console.log("callData.offer:", JSON.stringify(callData.offer, null, 2));
console.log("callData.sdp exists:", !!callData.sdp);
console.log("callData.offer.sdp exists:", !!callData.offer?.sdp);
console.log("=======================================");

  try {
    NativeModules.CallModule?.stopCallService();
  } catch (e) {}

  if (callData.autoAccept && navigationRef.current) {
    try {
      // ✅ Build the complete offer object
      const fullOffer = callData.offer || {
        type: 'offer',
        sdp: callData.sdp,
        callerInfo: {
          name: callData.callerName,
          profileImage: callData.profileImage || ''
        },
        isVideoCall: callData.callType === 'video',
        targetUserId: callData.callerId,
        roomId: callData.roomId
      };
      console.log("FULL OFFER:");
console.log(JSON.stringify(fullOffer, null, 2));
console.log("FULL OFFER SDP:", !!fullOffer?.sdp);

      navigationRef.current.dispatch(
        CommonActions.navigate('PHome', {
          name: callData.callerName,
          profile_image: callData.profileImage || '',
          targetUserId: callData.callerId,
          isIncomingCall: true,
          isInitiator: false,
          incomingOffer: fullOffer,  // ✅ Pass the actual offer, NOT null!
          isVideoCall: callData.callType === 'video',
          callType: callData.callType,
          roomId: callData.roomId,
          callId: callData.callId,
          autoAnswerOnOffer: false, 
        }));

       
    } catch (error) {
      console.error('Failed to navigate to VoiceCalls:', error);
      if (global.__callNotificationHandler) {
        global.__callNotificationHandler(callData);
      }
    }
  } else if (global.__callNotificationHandler) {
    global.__callNotificationHandler(callData);
  }
};

  // ── Sequenced boot ────────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;

    const boot = async () => {
    
      await requestRuntimePermissions();

      // STEP 2 — Notifications (safe now that POST_NOTIFICATIONS was requested)
      try {
        await initializeNotifications();
      } catch (err) {
        console.error("initializeNotifications (non-fatal):", err);
      }

      // STEP 3 — Auth
      await checkAuth();
    };

    boot();

    return () => {
      isMountedRef.current = false;
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem("userToken"),
        AsyncStorage.getItem("userData"),
      ]);

      if (!isMountedRef.current) return;

      if (token && userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
        setIsAuthenticated(true);

        // Delayed update check — give services time to settle first
        if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
        updateTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) checkForUpdate(true);
        }, 3000);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("checkAuth error:", err);
      if (isMountedRef.current) setIsAuthenticated(false);
    }
  };

  useEffect(() => {
  CallKeepService.initialize();
}, []);

  // ── Video prefetch ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        await videoBackgroundfetch.init(userId);
        if (!cancelled) {
          const cached = await videoBackgroundfetch.getCachedVideos();
          console.log("📦 Cached videos:", cached?.length || 0);
        }
      } catch (err) {
        console.error("videoBackgroundfetch init (non-fatal):", err);
      }
    })();

    return () => {
      cancelled = true;
      if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
      stopBackgroundServices();
    };
  }, [userId]);


    useDeepLinkHandler();

  // ── Single AppState listener (lives here only — not in ThemedNavigator) ──
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      const prev = appStateRef.current;

      if (prev === "active" && nextAppState === "background") {
        console.log("📱 → background");

        // Save navigation state (fire-and-forget, never await in handler)
        if (navigationRef.current) {
          saveNavigationState(navigationRef.current.getRootState());
        }

        if (Platform.OS === "android") {
          pauseAllVideos();
          stopWebRTCConnections();

          if (backgroundTimerRef.current)
            clearTimeout(backgroundTimerRef.current);
          backgroundTimerRef.current = setTimeout(freeMemory, 30_000);
        }
      } else if (prev === "background" && nextAppState === "active") {
        console.log("📱 → foreground");

        if (backgroundTimerRef.current) {
          clearTimeout(backgroundTimerRef.current);
          backgroundTimerRef.current = null;
        }

        if (isAuthenticated && isMountedRef.current) {
          if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
          updateTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) checkForUpdate(true);
          }, 1500);
        }

        InteractionManager.runAfterInteractions(() =>
          console.log("✅ App resumed")
        );
      }

      appStateRef.current = nextAppState;
    };



    const sub = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      sub.remove();
      if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, [userId, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CallProvider>
        <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
        <NetworkStatusBanner />

        {updateInfo?.update_available && (
          <UpdateModal
            visible={showUpdateModal}
            updateInfo={updateInfo}
            onClose={dismissUpdateModal}
          />
        )}
      </CallProvider>
    </GestureHandlerRootView>
  );
}

// ─── OnlineStatusManager ──────────────────────────────────────────────────────
const OnlineStatusManager = ({ userId }) => {
  if (!userId) return null;
  useOnlineStatus(userId);
  return null;
};

// ─── ThemedNavigator ──────────────────────────────────────────────────────────
// No AppState listener — AppContent owns the only one.
// Background services start here, once, each wrapped in its own try/catch.
// Navigation state only restored when a valid token exists.
// detachPreviousScreen removed — saves RAM on all device tiers.
// Android 15 edge-to-edge: StatusBar uses translucent mode to avoid layout crash.

function ThemedNavigator({ isAuthenticated, userId }) {
  const { theme, colors } = useTheme();
  const [showPinModal, setShowPinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState(undefined);

  const navSaveTimerRef = useRef(null);
  const forceFetchTimerRef = useRef(null);

  const customTheme = {
    dark: theme === "dark",
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface || colors.card || colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: { fontFamily: "System", fontWeight: "400" },
      medium:  { fontFamily: "System", fontWeight: "500" },
      bold:    { fontFamily: "System", fontWeight: "700" },
      heavy:   { fontFamily: "System", fontWeight: "900" },
    },
  };

  // ── Restore navigation state (only when token is valid) ───────────────────
  useEffect(() => {
    // const restoreState = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem("userToken");
    //     if (token) {
    //       const saved = await loadNavigationState();
    //       if (saved) setInitialNavigationState(saved);
    //     } else {
    //       // Wipe stale state — logged-out user must land on Login
    //       await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
    //     }
    //   } catch (err) {
    //     console.error("restoreState error:", err);
    //   } finally {
    //     setIsNavigationReady(true);
    //   }
    // };
    const restoreState = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      const saved = await loadNavigationState();
      if (saved) {
        // Check if saved state is on a blocked screen
        const currentRoute = saved.routes?.[saved.index];
        const currentRouteName = currentRoute?.name;
        
        if (currentRouteName && BLOCKED_AUTO_NAVIGATION_SCREENS.includes(currentRouteName)) {
          console.log(`Blocked restoring navigation to blocked screen: ${currentRouteName}, going to default screen`);
          // Don't restore - will go to default route (PHome or SocialHome)
          setInitialNavigationState(undefined);
          // Clear the bad state from storage
          await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
        } else {
          setInitialNavigationState(saved);
        }
      }
    } else {
      // Wipe stale state — logged-out user must land on Login
      await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
    }
  } catch (err) {
    console.error("restoreState error:", err);
  } finally {
    setIsNavigationReady(true);
  }
};

    restoreState();

    // Init globals once on mount
    global.__activeWebRTCConnections = global.__activeWebRTCConnections || [];
    global.__activeVideoRefs         = global.__activeVideoRefs || [];
    global.__pendingRequests         = global.__pendingRequests || [];

    return () => {
      if (navSaveTimerRef.current)    clearTimeout(navSaveTimerRef.current);
      if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
    };
  }, []);

  // ── PIN check — runs after auth state is known ────────────────────────────
  useEffect(() => {
    checkPinRequirement();
  }, [isAuthenticated]);

  const checkPinRequirement = async () => {
    try {
      const [pinEnabled, token] = await Promise.all([
        AsyncStorage.getItem("pin_enabled"),
        AsyncStorage.getItem("userToken"),
      ]);
      if (pinEnabled === "true" && token) {
        const status = await checkPinStatus(token);
        if (status?.has_pin) setShowPinModal(true);
      }
    } catch (err) {
      console.error("checkPinRequirement error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Background services — started once, each guarded individually ─────────
  // Each service gets its own try/catch so one failure never blocks the others.
  // Android 14/15: backgroundFetchService.init() may throw if the foreground
  // service type is missing from the manifest — the guard here prevents a crash
  // while you fix the manifest, but the manifest fix is still required.
  useEffect(() => {
    if (!userId || global.__backgroundServicesRunning) return;

    const startServices = async () => {
      try {
        await backgroundFetchService.init();
      } catch (err) {
        console.error("backgroundFetchService.init (non-fatal):", err);
      }

      try {
        startBackgroundContactSync();
      } catch (err) {
        console.error("startBackgroundContactSync (non-fatal):", err);
      }

      try {
        setupContactSyncListener();
      } catch (err) {
        console.error("setupContactSyncListener (non-fatal):", err);
      }

      global.__backgroundServicesRunning = true;

      forceFetchTimerRef.current = setTimeout(() => {
        try { backgroundFetchService.forceFetch(); } catch (_) {}
      }, 2000);
    };

    startServices();

    return () => {
      if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
    };
  }, [userId]);

  // ── Debounced navigation state save ───────────────────────────────────────
  // const handleNavigationStateChange = (state) => {
  //   if (!state) return;
  //   if (navSaveTimerRef.current) clearTimeout(navSaveTimerRef.current);
  //   navSaveTimerRef.current = setTimeout(() => saveNavigationState(state), 1000);
  // };

  const handleNavigationStateChange = (state) => {
  if (!state) return;
  
  // Check if current screen is blocked from being saved
  const currentRoute = state.routes?.[state.index];
  const currentRouteName = currentRoute?.name;
  
  if (currentRouteName && BLOCKED_AUTO_NAVIGATION_SCREENS.includes(currentRouteName)) {
    console.log(`Not saving navigation state for blocked screen: ${currentRouteName}`);
    return; // Don't save state for blocked screens
  }
  
  if (navSaveTimerRef.current) clearTimeout(navSaveTimerRef.current);
  navSaveTimerRef.current = setTimeout(() => saveNavigationState(state), 1000);
};

  if (isLoading || !isNavigationReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={customTheme}
      initialState={initialNavigationState}
      onStateChange={handleNavigationStateChange}
    >
      {isAuthenticated && <OnlineStatusManager userId={userId} />}

      {/*
        Android 15 edge-to-edge fix:
        - translucent={true} prevents the layout crash that happens when Android 15
          forces edge-to-edge and a non-translucent StatusBar fights over insets.
        - backgroundColor kept for older Android versions that need it.
      */}
      <RNStatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={Platform.Version >= 35 ? "transparent" : colors.background}
        translucent={Platform.Version >= 35}
      />

      <PinUnlockModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        navigation={navigationRef.current}
      />

      {/*
        detachPreviousScreen intentionally omitted (default = true).
        Keeping all 80+ screens mounted simultaneously caused OOM crashes on
        low-RAM and mid-range Android devices.
      */}
      <Stack.Navigator
        initialRouteName="Loginscreen"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* ── Authentication ─────────────────────────────────────────────── */}
        <Stack.Screen name="Loginscreen">
          {(p) => <ScreenWrapper><Loginscreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Signin">
          {(p) => <ScreenWrapper><Signin {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Signin_two">
          {(p) => <ScreenWrapper><Signin_two {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {(p) => <ScreenWrapper><Register {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="VerificationCode">
          {(p) => <ScreenWrapper><VerificationCode {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="LinkingScreen">
          {(p) => <ScreenWrapper><LinkingScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Biometric">
          {(p) => <ScreenWrapper><Biometric {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ProceedOptions">
          {(p) => <ScreenWrapper><ProceedOptions {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Terms">
          {(p) => <ScreenWrapper><Terms {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="TermsCondition">
          {(p) => <ScreenWrapper><TermsCondition {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="PrivacyPolicy">
          {(p) => <ScreenWrapper><PrivacyPolicy {...p} /></ScreenWrapper>}
        </Stack.Screen>

        {/* ── Personal account ───────────────────────────────────────────── */}
        <Stack.Screen name="PHome">
          {(p) => <ScreenWrapper><PHome {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="UserPersonalAccountProfile">
          {(p) => <ScreenWrapper><UserPersonalAccountProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SyncContactForBusiness">
          {(p) => <ScreenWrapper><SyncContactForBusiness {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="PStatusBar">
          {(p) => <ScreenWrapper><PStatusBar {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="StatusEditorScreen">
          {(p) => <ScreenWrapper><StatusEditorScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="JoinChannel">
          {(p) => <ScreenWrapper><JoinChannel {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Calls">
          {(p) => <ScreenWrapper><Calls {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CallOngoingScreen">
          {(p) => <ScreenWrapper><CallOngoingScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {(p) => <ScreenWrapper><Settings {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="NotificationsScreen">
          {(p) => <ScreenWrapper><NotificationsScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="NotificationSetting">
          {(p) => <ScreenWrapper><NotificationSetting {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="WallpaperSetting">
          {(p) => <ScreenWrapper><WallpaperSetting {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="FaceSecuritySetting">
          {(p) => <ScreenWrapper><FaceSecuritySetting {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="PrivateChat">
          {(p) => <ScreenWrapper><PrivateChat {...p} /></ScreenWrapper>}
        </Stack.Screen>

        {/* ── Business account ───────────────────────────────────────────── */}
        <Stack.Screen name="BusinessHome">
          {(p) => <ScreenWrapper><BusinessHome {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="PostDetails">
          {(p) => <ScreenWrapper><PostDetails {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ChannelDetails">
          {(p) => <ScreenWrapper><ChannelDetails {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ChannelAdminManagement">
          {(p) => <ScreenWrapper><ChannelAdminManagement {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BUserProfile">
          {(p) => <ScreenWrapper><BUserProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BStatusBar">
          {(p) => <ScreenWrapper><BStatusBar {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BStatusEditorScreen">
          {(p) => <ScreenWrapper><BStatusEditorScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BJoinChannel">
          {(p) => <ScreenWrapper><BJoinChannel {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BCalls">
          {(p) => <ScreenWrapper><BCalls {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BCallOngoingScreen">
          {(p) => <ScreenWrapper><BCallOngoingScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BSettings">
          {(p) => <ScreenWrapper><BSettings {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BNotificationSetting">
          {(p) => <ScreenWrapper><BNotificationSetting {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BWallpaperSetting">
          {(p) => <ScreenWrapper><BWallpaperSetting {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BFaceSecuritySetting">
          {(p) => <ScreenWrapper><BFaceSecuritySetting {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ToolsScreen">
          {(p) => <ScreenWrapper><ToolsScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="QuickReplies">
          {(p) => <ScreenWrapper><QuickReplies {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ShortDetail">
          {(p) => <ScreenWrapper><ShortDetail {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="AddQuickReply">
          {(p) => <ScreenWrapper><AddQuickReply {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="EssentialPlatforms">
          {(p) => <ScreenWrapper><EssentialPlatformsScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="LoginMethod">
          {(p) => <ScreenWrapper><LoginMethod {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="EmailLogin">
          {(p) => <ScreenWrapper><EmailLogin {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="EmailRegister">
          {(p) => <ScreenWrapper><EmailRegister {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="ForgotPassword">
          {(p) => <ScreenWrapper><ForgotPassword {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="Advertise">
          {(p) => <ScreenWrapper><Advertise {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ManageProfile">
          {(p) => <ScreenWrapper><ManageProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CreateCatalog">
          {(p) => <ScreenWrapper><CreateCatalog {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Explore">
          {(p) => <ScreenWrapper><Explore {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="AddItemToCatalog">
          {(p) => <ScreenWrapper><AddItemToCatalog {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="LabelChats">
          {(p) => <ScreenWrapper><LabelChats {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Labels">
          {(p) => <ScreenWrapper><Labels {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="AddQuickReplyScreen">
          {(p) => <ScreenWrapper><AddQuickReplyScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="GreetingMessage">
          {(p) => <ScreenWrapper><GreetingMessage {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="AwayMessage">
          {(p) => <ScreenWrapper><AwayMessage {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="HelpCenter">
          {(p) => <ScreenWrapper><HelpCenter {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="HelpTopic">
          {(p) => <ScreenWrapper><HelpTopic {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BusinessSetup">
          {(p) => <ScreenWrapper><BusinessSetup {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ProductDetails">
          {(p) => <ScreenWrapper><ProductDetails {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Cart">
          {(p) => <ScreenWrapper><Cart {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="EmptyCart">
          {(p) => <ScreenWrapper><EmptyCart {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Broadcast">
          {(p) => <ScreenWrapper><Broadcast {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="OfficialSearch">
          {(p) => <ScreenWrapper><OfficialSearch {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CompleteSignupProfile">
          {(p) => <ScreenWrapper><CompleteSignupProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="Live">
          {(p) => <ScreenWrapper><Live {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="OoshBusiness">
          {(p) => <ScreenWrapper><OoshBusiness {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CreateChannel">
          {(p) => <ScreenWrapper><CreateChannel {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="InviteChannelLink">
          {(p) => <ScreenWrapper><InviteChannelLink {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Supplyrequest">
          {(p) => <ScreenWrapper><Supplyrequest {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SupplyRequestForm">
          {(p) => <ScreenWrapper><SupplyRequestForm {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SupplyServices">
          {(p) => <ScreenWrapper><SupplyServices {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SupplyRequestDetail">
          {(p) => <ScreenWrapper><SupplyRequestDetail {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CreateServices">
          {(p) => <ScreenWrapper><CreateServices {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SupplyRequestDetailScreen">
          {(p) => <ScreenWrapper><SupplyRequestDetailScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BroadcastHome">
          {(p) => <ScreenWrapper><BroadcastHome {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CreateBroadcastPost">
          {(p) => <ScreenWrapper><CreateBroadcastPost {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ReportPost">
          {(p) => <ScreenWrapper><ReportPost {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BroadcastUserProfile">
          {(p) => <ScreenWrapper><BroadcastUserProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="MarketPlace">
          {(p) => <ScreenWrapper><MarketPlace {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CreateListing">
          {(p) => <ScreenWrapper><CreateListing {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ListingDetails">
          {(p) => <ScreenWrapper><ListingDetails {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SuggestedFollowers">
          {(p) => <ScreenWrapper><SuggestedFollowers {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ManagePost">
          {(p) => <ScreenWrapper><ManagePost {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CreatorDashboard">
          {(p) => <ScreenWrapper><CreatorDashboard {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="MonetizationRequestForm">
          {(p) => <ScreenWrapper><MonetizationRequestForm {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ChatAi">
          {(p) => <ScreenWrapper><ChatAi {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ContractHome">
          {(p) => <ScreenWrapper><ContractHome {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CreateAdForm">
          {(p) => <ScreenWrapper><CreateAdForm {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="AdReview">
          {(p) => <ScreenWrapper><AdReview {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BroadcastSuccess">
          {(p) => <ScreenWrapper><BroadcastSuccess {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="AllProducts">
          {(p) => <ScreenWrapper><AllProducts {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="OtherUserCatalog">
          {(p) => <ScreenWrapper><OtherUserCatalog {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="OtherUserCatalogDetail">
          {(p) => <ScreenWrapper><OtherUserCatalogDetail {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BPrivateChat">
          {(p) => <ScreenWrapper><BPrivateChat {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BusinessGroupChat">
          {(p) => <ScreenWrapper><BusinessGroupChat {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SupplierNotificationScreen">
          {(p) => <ScreenWrapper><SupplierNotificationScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="RequesterPostHistory">
          {(p) => <ScreenWrapper><RequesterPostHistory {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="GroupMembers">
          {(p) => <ScreenWrapper><GroupMembers {...p} /></ScreenWrapper>}
        </Stack.Screen>

        {/* ── Social ─────────────────────────────────────────────────────── */}
        <Stack.Screen name="SocialHome">
          {(p) => <ScreenWrapper><SocialHome {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Discover">
          {(p) => <ScreenWrapper><Discover {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="UploadshortVideo">
          {(p) => <ScreenWrapper><UploadshortVideo {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SearchShort">
          {(p) => <ScreenWrapper><SearchShort {...p} /></ScreenWrapper>}
        </Stack.Screen>

        {/* ── Features ───────────────────────────────────────────────────── */}
        <Stack.Screen name="Music">
          {(p) => <ScreenWrapper><Music {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="GroupCreate">
          {(p) => <ScreenWrapper><GroupCreate {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="GroupConnect">
          {(p) => <ScreenWrapper><GroupConnect {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="UserContactList">
          {(p) => <ScreenWrapper><UserContactList {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SynMessage">
          {(p) => <ScreenWrapper><SynMessage {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SyncContactPersonal">
          {(p) => <ScreenWrapper><SyncContactPersonal {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="UserContactListPersonalAccount">
          {(p) => <ScreenWrapper><UserContactListPersonalAccount {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SyncMessagePersonal">
          {(p) => <ScreenWrapper><SyncMessagePersonal {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CameraScreen">
          {(p) => <ScreenWrapper><CameraScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SongsList">
          {(p) => <ScreenWrapper><SongsList {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="NewCommunity">
          {(p) => <ScreenWrapper><NewCommunity {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="VideoCalls">
          {(p) => <ScreenWrapper><VideoCalls {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="VoiceCalls">
          {(p) => <ScreenWrapper><VoiceCalls {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="GoLive">
          {(p) => <ScreenWrapper><GoLive {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="LiveStream">
          {(p) => <ScreenWrapper><LiveStream {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ContactUs">
          {(p) => <ScreenWrapper><ContactUs {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SuccessStory">
          {(p) => <ScreenWrapper><SuccessStory {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="OtherUserProfile">
          {(p) => <ScreenWrapper><OtherUserProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="LiveStreaming">
          {(p) => <ScreenWrapper><LiveStreaming {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="GlobalIssueReport">
          {(p) => <ScreenWrapper><GlobalIssueReport {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="NewsList">
          {(p) => <ScreenWrapper><NewsList {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Broadcaster">
          {(p) => <ScreenWrapper><Broadcaster {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Viewer">
          {(p) => <ScreenWrapper><Viewer {...p} /></ScreenWrapper>}
        </Stack.Screen>

        {/* ── Earning ────────────────────────────────────────────────────── */}
        <Stack.Screen name="EarningDashbord">
          {(p) => <ScreenWrapper><EarningDashbord {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="WithdrawEarning">
          {(p) => <ScreenWrapper><WithdrawEarning {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="PurchaseData">
          {(p) => <ScreenWrapper><PurchaseData {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="NinRegisterEarning">
          {(p) => <ScreenWrapper><NinRegisterEarning {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="VideoAds">
          {(p) => <ScreenWrapper><VideoAds {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="EarningWallet">
          {(p) => <ScreenWrapper><EarningWallet {...p} /></ScreenWrapper>}
        </Stack.Screen>

        {/* ── Modal ──────────────────────────────────────────────────────── */}
        <Stack.Screen
          name="CallOverlay"
          component={IncomingCallModal}
          options={{
            presentation: "transparentModal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack.Navigator>

      {userId && <CallSignalListener userId={userId} />}
    </NavigationContainer>
  );
}

// ─── Logout helper ────────────────────────────────────────────────────────────
// Import and call this in your logout handler — wherever you clear the token.
// This resets all service flags so they restart cleanly on the next login and
// clears saved navigation state so the user always lands on the Login screen.
export const handleAppLogout = async (clearTokenFn) => {
  try {
    global.__backgroundServicesRunning = false;
    global.__activeWebRTCConnections   = [];
    global.__activeVideoRefs           = [];
    stopBackgroundServices();
    await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
    if (typeof clearTokenFn === "function") await clearTokenFn();
  } catch (err) {
    console.error("handleAppLogout error:", err);
  }
};


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { 
//   AppState, 
//   Platform, 
//   View, 
//   ActivityIndicator, 
//   StatusBar as RNStatusBar,
//   InteractionManager,
//   Image,
//   NativeModules,
//   LogBox
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { useOnlineStatus } from './src/hooks/useOnlineStatus';

// // Create navigation ref
// const navigationRef = React.createRef();

// // ==================== NAVIGATION PERSISTENCE KEYS ====================
// const NAVIGATION_STATE_KEY = 'NAVIGATION_STATE';

// // Save navigation state function
// const saveNavigationState = async (state) => {
//   try {
//     if (state) {
//       await AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
//       console.log('✅ Navigation state saved');
//     }
//   } catch (error) {
//     console.error('Failed to save navigation state:', error);
//   }
// };

// // Load navigation state function
// const loadNavigationState = async () => {
//   try {
//     const state = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
//     if (state) {
//       console.log('✅ Navigation state loaded');
//       return JSON.parse(state);
//     }
//   } catch (error) {
//     console.error('Failed to load navigation state:', error);
//   }
//   return undefined;
// };

// // Ignore specific warnings
// LogBox.ignoreLogs([
//   'new NativeEventEmitter',
//   'Require cycle:',
//   'VirtualizedLists should never be nested',
// ]);

// // Import checkPinStatus from the correct location
// import { checkPinStatus } from './showa_personal_account_screen/FaceSecuritySetting';
// import PinUnlockModal from './screens/PinUnlockModal';
// import videoBackgroundfetch from './src/services/VideoBackgroundFetch';

// // Theme Context
// import { ThemeProvider } from './src/context/ThemeContext';

// // Import useTheme here (BEFORE using it in components)
// import { useTheme } from './src/context/ThemeContext';

// // Components & Context
// import { CallProvider } from './components/CallContext';
// import CallSignalListener from "./components/CallSignalListener";
// import IncomingCallModal from './components/IncomingCallModal';

// import NetworkStatusBanner from "./components/Networkstatusbanner";

// // Services
// import { startBackgroundContactSync, setupContactSyncListener } from "./components/BackgroundSync";
// import backgroundFetchService from "./src/services/BackgroundFetchService";

// // ==================== SCREEN IMPORTS ====================

// // Authentication & Onboarding Screens
// import Loginscreen from './screens/Loginscreen';
// import Signin from './screens/onboard/SignIn';
// import Signin_two from './screens/onboard/SignIn2_two';
// import TermsCondition from './screens/onboard/Terms';
// import PrivacyPolicy from './screens/onboard/PrivacyPolicy';
// import Register from './screens/onboard/Register';
// import Biometric from './screens/onboard/Biometric';
// import LinkingScreen from './screens/onboard/LinkingScreen';
// import VerificationCode from "./screens/onboard/VerifyEmail";
// import ProceedOptions from './screens/ProceedOptions';
// import Terms from './screens/TermsPrivacyScreen';

// // Personal Account Screens
// import PHome from './showa_personal_account_screen/PHome';
// import UserPersonalAccountProfile from './screens/profiles/UserPersonalAccountProfile';
// import PStatusBar from './showa_personal_account_screen/StatusBar';
// import StatusEditorScreen from './showa_personal_account_screen/StatusEditorScreen';
// import JoinChannel from './showa_personal_account_screen/JoinChannel';
// import Calls from './showa_personal_account_screen/Calls';
// import CallOngoingScreen from './showa_personal_account_screen/CallOngoingScreen';
// import Settings from './showa_personal_account_screen/Settings';
// import NotificationSetting from './showa_personal_account_screen/NotificationSetting';
// import WallpaperSetting from './showa_personal_account_screen/WallpaperSetting';
// import FaceSecuritySetting from './showa_personal_account_screen/FaceSecuritySetting';
// import PrivateChat from './showa_personal_account_screen/PrivateChat';

// // Business Account Screens
// import ChannelDetails from './showa_business/ChannelDetails';
// import PostDetails from './showa_business/PostDetailScreen';
// import BusinessHome from './showa_business/Home';
// import ChatAi from './showa_business/ChatAi';
// import MonetizationRequestForm from './showa_business/MonetizationRequestForm';
// import BUserProfile from './showa_business/UserProfile';
// import BStatusBar from './showa_business/StatusBar';
// import BStatusEditorScreen from './showa_business/StatusEditorScreen';
// import BJoinChannel from './showa_business/JoinChannel';
// import BCalls from './showa_business/Calls';
// import BCallOngoingScreen from './showa_business/CallOngoingScreen';
// import BSettings from './showa_business/Settings';
// import BNotificationSetting from './showa_business/NotificationSetting';
// import BWallpaperSetting from './showa_business/WallpaperSetting';
// import BFaceSecuritySetting from './showa_business/FaceSecuritySetting';
// import ToolsScreen from './showa_business/ToolsScreen';
// import QuickReplies from './showa_business/QuickReplies';
// import AddQuickReply from './showa_business/AddQuickReply';
// import EssentialPlatformsScreen from './showa_business/EssentialPlatformsScreen';
// import Advertise from './showa_business/Advertise';
// import ManageProfile from './showa_business/ManageProfile';
// import CreateCatalog from './showa_business/CreateCatalog';
// import AddItemToCatalog from './showa_business/AddItemToCatalog';
// import Explore from './showa_business/Explore';
// import LabelChats from './showa_business/LabelChatsScreen';
// import Labels from './showa_business/LabelsScreen';
// import AddQuickReplyScreen from './showa_business/AddQuickReplyScreen';
// import GreetingMessage from './showa_business/GreetingMessage';
// import AwayMessage from './showa_business/AwayMessageScreen';
// import HelpCenter from './showa_business/HelpCenterScreen';
// import HelpTopic from './showa_business/HelpTopicScreen';
// import BusinessSetup from './showa_business/BusinessSetupScreen';
// import ProductDetails from './showa_business/ProductDetailsScreen';
// import Cart from './showa_business/CartScreen';
// import ChannelAdminManagement from './showa_business/ChannelAdminManagement';
// import EmptyCart from './showa_business/EmptyCartScreen';
// import OoshBusiness from './showa_business/OoshBusinessScreen';
// import Live from './showa_business/LiveScreen';
// import Broadcast from './showa_business/Broadcast';
// import OfficialSearch from './showa_business/OfficialSearchScreen';
// import CreateChannel from './showa_business/CreateChannel';
// import InviteChannelLink from './showa_business/InviteChannelLink';
// import Supplyrequest from './showa_business/SupplyRequest';
// import SupplyRequestForm from './showa_business/SupplyRequestForm';
// import SupplyServices from './showa_business/SupplyServices';
// import SupplyRequestDetail from './showa_business/SupplyRequestDetail';
// import CreateServices from './showa_business/CreateServices';
// import SupplyRequestDetailScreen from './showa_business/SupplyRequestDetailScreen';
// import BroadcastHome from './showa_business/BroadcastHome';
// import CreateBroadcastPost from './showa_business/CreateBroadcastPost';
// import ReportPost from './showa_business/ReportPost';
// import BroadcastUserProfile from './showa_business/BroadcastUserProfile';
// import MarketPlace from './showa_business/MarketPlace';
// import CreateListing from './showa_business/CreateListing';
// import ListingDetails from './showa_business/ListingDetails';
// import SuggestedFollowers from './showa_business/SuggestedFollowers';
// import ManagePost from './showa_business/ManagePost';
// import CreatorDashboard from './showa_business/CreatorDashboardScreen';
// import ContractHome from './showa_business/contracts/ContractHome';
// import CreateAdForm from './showa_business/ads/CreateAdFormScreen';
// import AdReview from './showa_business/ads/AdReview';
// import BroadcastSuccess from './showa_business/BroadcastSuccess';
// import AllProducts from './showa_business/AllProducts';
// import OtherUserCatalog from './showa_business/OthersUserCatalog';
// import OtherUserCatalogDetail from './showa_business/OtherUserCatalogDetail';
// import BPrivateChat from './showa_business/BusinessChat';
// import BusinessGroupChat from './showa_business/BusinessGroupChat';
// import SupplierNotificationScreen from './showa_business/SupplierNotificationScreen';
// import RequesterPostHistory from './showa_business/RequesterPostHistory';
// import GroupMembers from './showa_business/GroupMembers';


// // Social Media Screens
// import SocialHome from './showa_social/Home';
// import Discover from './showa_social/Discover';
// import UploadshortVideo from './showa_social/UploadshortVideo';
// import SearchShort from './showa_social/SearchShort';

// // Feature Components
// import GroupCreate from './screens/GroupCreate';
// import GroupConnect from './screens/GroupConnect';
// import UserContactListPersonalAccount from './components/UserContactListPersonalAccount';
// import Music from './components/Music';
// import UserContactList from './components/UserContactList';
// import SyncMessagePersonal from './components/SyncMessagePersonal';
// import SyncContactForBusiness from './components/SyncContactForBusiness';
// import CameraScreen from './components/CameraScreen';
// import SongsList from './components/SongsListScreen';
// import NewCommunity from './components/NewCommunityScreen';
// import VideoCalls from './components/VideoCalls';
// import VoiceCalls from './components/VoiceCalls';
// import GoLive from './components/GoLive';
// import LiveStream from './components/LiveStream';
// import ContactUs from './components/ContactUs';
// import SuccessStory from './components/SuccessStory';
// import OtherUserProfile from "./screens/profiles/OtherUserProfile";
// import EarningDashbord from "./screens/earning/EarningDashbord";
// import WithdrawEarning from "./screens/earning/WithdrawEarning";
// import PurchaseData from "./screens/earning/PurchaseData";
// import NinRegisterEarning from "./screens/earning/NinRegisterEarning";
// import VideoAds from "./screens/earning/VideoAds";
// import EarningWallet from "./screens/earning/EarningWallet";
// import SynMessage from './components/SynMessage';
// import SyncContactPersonal from './components/UserContactPersonal';
// import LiveStreaming from "./src/LiveStreaming";
// import GlobalIssueReport from "./components/GlobalIssueReport";
// import NewsList from "./components/NewsList";
// import Broadcaster from "./src/Broadcaster";
// import Viewer from "./src/Viewer";

// // ==================== HELPER FUNCTIONS ====================

// // Clear image cache helper function
// const clearImageCache = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Clear React Native's image cache using Image.queryCache
//       Image.queryCache && Image.queryCache([], (cacheResponse) => {
//         if (cacheResponse && Object.keys(cacheResponse).length > 0) {
//           const urls = Object.keys(cacheResponse);
//           console.log(`Found ${urls.length} cached images to clear`);
//         }
//       });
//     }
    
//     // Clear in-memory image cache by setting a flag
//     global.__imageCacheCleared = Date.now();
    
//     console.log('✅ Image cache cleared');
//   } catch (error) {
//     console.error('Error clearing image cache:', error);
//   }
// };

// // Clear WebView cache helper
// const clearWebViewCache = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Clear WebView cache using native module if available
//       const { WebViewManager } = NativeModules;
//       if (WebViewManager && WebViewManager.clearCache) {
//         await WebViewManager.clearCache();
//       }
//     }
//   } catch (error) {
//     console.error('Error clearing WebView cache:', error);
//   }
// };

// // Clear all caches helper
// const clearAllCaches = async () => {
//   try {
//     await clearImageCache();
//     await clearWebViewCache();
    
//     // Clear AsyncStorage temporary data if needed
//     const allKeys = await AsyncStorage.getAllKeys();
//     const keysToClear = allKeys.filter(key => 
//       key.includes('temp_') || 
//       key.includes('cache_') || 
//       key.includes('_preview') ||
//       key.includes('video_cache_')
//     );
    
//     if (keysToClear.length > 0) {
//       await AsyncStorage.multiRemove(keysToClear);
//       console.log(`Cleared ${keysToClear.length} temporary cache items`);
//     }
//   } catch (error) {
//     console.error('Error clearing all caches:', error);
//   }
// };

// // Free up memory helper
// const freeMemory = () => {
//   if (Platform.OS === 'android') {
//     try {
//       // Suggest garbage collection (only works in debug builds)
//       if (global.gc) {
//         global.gc();
//       }
      
//       // Clear any large objects from memory
//       if (global.__largeImageCache) {
//         delete global.__largeImageCache;
//       }
      
//       // Clear video prefetch cache if too large
//       if (global.__videoPrefetchCache) {
//         delete global.__videoPrefetchCache;
//       }
      
//       console.log('✅ Memory cleanup triggered');
//     } catch (error) {
//       console.error('Error freeing memory:', error);
//     }
//   }
// };

// // Stop WebRTC connections helper
// const stopWebRTCConnections = () => {
//   try {
//     // If you have WebRTC connections stored globally, clean them up
//     if (global.__activeWebRTCConnections && global.__activeWebRTCConnections.length > 0) {
//       global.__activeWebRTCConnections.forEach(connection => {
//         if (connection && connection.close) {
//           try {
//             connection.close();
//           } catch (e) {
//             console.error('Error closing WebRTC connection:', e);
//           }
//         }
//       });
//       global.__activeWebRTCConnections = [];
//       console.log('✅ WebRTC connections closed');
//     }
//   } catch (error) {
//     console.error('Error stopping WebRTC connections:', error);
//   }
// };

// // Pause video playback helper
// const pauseAllVideos = () => {
//   try {
//     // If you have video refs stored globally
//     if (global.__activeVideoRefs && global.__activeVideoRefs.length > 0) {
//       global.__activeVideoRefs.forEach(videoRef => {
//         if (videoRef && videoRef.current && typeof videoRef.current.pause === 'function') {
//           videoRef.current.pause();
//         }
//       });
//       console.log(`✅ Paused ${global.__activeVideoRefs.length} videos`);
//     }
//   } catch (error) {
//     console.error('Error pausing videos:', error);
//   }
// };

// // Stop background services
// const stopBackgroundServices = () => {
//   try {
//     if (global.__backgroundSyncInterval) {
//       clearInterval(global.__backgroundSyncInterval);
//       global.__backgroundSyncInterval = null;
//     }
    
//     if (global.__contactSyncListener && global.__contactSyncListener.remove) {
//       global.__contactSyncListener.remove();
//       global.__contactSyncListener = null;
//     }
    
//     backgroundFetchService.stop();
//     console.log('✅ Background services stopped');
//   } catch (error) {
//     console.error('Error stopping background services:', error);
//   }
// };

// // ==================== LINKING CONFIG ====================


// import { Linking } from 'react-native';

// const linking = {
//   prefixes: ['showa://', 'https://showapp.com', 'http://showapp.com'],
//   config: {
//     screens: {
//       AiResetPassword: 'reset-password',
      
//       PostDetails: {
//         path: 'post/:postId',
//         exact: true,
//         parse: {
//           postId: (postId) => {
//             console.log('🔍 Linking parse - postId:', postId);
//             return postId;
//           },
//         },
//       },
      
//       UserProfile: {
//         path: 'user/:userId',
//         parse: {
//           userId: (userId) => userId,
//         },
//       },
      
//       // Fallback
//       NotFound: '*',
//     },
//   },
//   getInitialURL: async () => {
//     const initialUrl = await Linking.getInitialURL();
//     console.log('🔗 getInitialURL returned:', initialUrl);
//     return initialUrl;
//   },
//   subscribe: (listener) => {
//     const onReceiveURL = ({ url }) => {
//       console.log('🔗 subscribe received URL:', url);
//       listener(url);
//     };
    
//     const subscription = Linking.addEventListener('url', onReceiveURL);
    
//     return () => {
//       subscription.remove();
//     };
//   },
// };

// // ==================== NAVIGATION SETUP ====================

// const Stack = createNativeStackNavigator();

// // Screen wrapper - This provides the theme background for ALL screens
// const ScreenWrapper = ({ children }) => {
//   const { colors } = useTheme();
  
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {children}
//     </View>
//   );
// };

// // ==================== MAIN APP COMPONENT ====================

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <AppContent />
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// // ==================== APP CONTENT ====================

// function AppContent() {
//   const [userId, setUserId] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const backgroundTimerRef = useRef(null);
//   const appStateRef = useRef(AppState.currentState);

//   // Check authentication status
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const userData = await AsyncStorage.getItem('userData');
        
//         if (token && userData) {
//           const user = JSON.parse(userData);
//           setUserId(user.id);
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//         }
//       } catch (error) {
//         console.error('Error checking auth:', error);
//         setIsAuthenticated(false);
//       }
//     };
    
//     checkAuth();
//   }, []);

//   // Initialize video prefetch when user is logged in
//   useEffect(() => {
//     const initVideoPrefetch = async () => {
//       try {
//         if (userId) {
//           await videoBackgroundfetch.init(userId);
//           const cachedVideos = await videoBackgroundfetch.getCachedVideos();
//           console.log('📦 Cached videos ready:', cachedVideos?.length || 0);
//         }
//       } catch (error) {
//         console.error('Error initializing video prefetch:', error);
//       }
//     };

//     initVideoPrefetch();
    
//     return () => {
//       if (backgroundTimerRef.current) {
//         clearTimeout(backgroundTimerRef.current);
//       }
//       stopBackgroundServices();
//     };
//   }, [userId]);
  
//   // Enhanced background cleanup - MODIFIED to preserve state
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       const currentState = appStateRef.current;
      
//       if (currentState === 'active' && nextAppState === 'background') {
//         console.log('📱 App going to background - preserving state');
        
//         if (Platform.OS === 'android') {
//           pauseAllVideos();
//           stopWebRTCConnections();
          
//           // REMOVED: clearAllCaches() and freeMemory() - these were causing screen refreshes
//           // Only pause activities, don't clear caches aggressively
          
//           if (backgroundTimerRef.current) {
//             clearTimeout(backgroundTimerRef.current);
//           }
          
//           backgroundTimerRef.current = setTimeout(() => {
//             console.log('🕐 30 seconds in background - light cleanup only');
//             // Only free memory if needed, but preserve navigation state
//             freeMemory();
//           }, 30000);
//         }
//       } else if (currentState === 'background' && nextAppState === 'active') {
//         console.log('📱 App coming to foreground - restoring from saved state');
        
//         if (backgroundTimerRef.current) {
//           clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = null;
//         }
        
//         // Restore background services if needed
//         if (!global.__backgroundServicesRunning && userId) {
//           InteractionManager.runAfterInteractions(() => {
//             backgroundFetchService.init();
//             startBackgroundContactSync();
//             setupContactSyncListener();
//             global.__backgroundServicesRunning = true;
//           });
//         }
        
//         InteractionManager.runAfterInteractions(() => {
//           console.log('✅ App resumed - screen state preserved');
//         });
//       }
      
//       appStateRef.current = nextAppState;
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       subscription.remove();
//       if (backgroundTimerRef.current) {
//         clearTimeout(backgroundTimerRef.current);
//       }
//     };
//   }, [userId]);
  
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <CallProvider>
//         <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//         <NetworkStatusBanner />
//       </CallProvider>
//     </GestureHandlerRootView>
//   );
// }

// // ==================== ONLINE STATUS MANAGER COMPONENT ====================

// const OnlineStatusManager = ({ userId }) => {
//   // Only run if userId exists
//   if (!userId) {
//     return null;
//   }
  
//   useOnlineStatus(userId);
//   return null;
// };
// function ThemedNavigator({ isAuthenticated, userId }) {
//   const { theme, colors } = useTheme();
//   const [appState, setAppState] = useState(AppState.currentState);
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNavigationReady, setIsNavigationReady] = useState(false);
//   const [initialNavigationState, setInitialNavigationState] = useState(undefined);
//   const [pendingDeepLink, setPendingDeepLink] = useState(null);
  
//   // Refs for cleanup
//   const navigationStateSaveTimer = useRef(null);
//   const deepLinkTimeoutRef = useRef(null);
//   const navigationReadyRef = useRef(false);

//   // ========== DEEP LINK HANDLER ==========
//   const processDeepLink = useCallback(async (url) => {
//     console.log('🔗 Processing deep link:', url);
    
//     if (!url) return;
    
//     try {
//       let postId = null;
      
//       // Parse different URL formats
//       if (url.includes('showa://')) {
//         const match = url.match(/showa:\/\/post\/(\d+)/);
//         if (match) postId = match[1];
//       } else if (url.includes('showapp.com/post/')) {
//         const match = url.match(/\/post\/(\d+)/);
//         if (match) postId = match[1];
//       }
      
//       if (postId) {
//         console.log('📱 Extracted postId:', postId);
        
//         // Wait for navigation to be ready
//         if (!navigationReadyRef.current && !isNavigationReady) {
//           await new Promise((resolve) => {
//             const checkInterval = setInterval(() => {
//               if (navigationReadyRef.current || isNavigationReady) {
//                 clearInterval(checkInterval);
//                 resolve();
//               }
//             }, 100);
//             setTimeout(() => {
//               clearInterval(checkInterval);
//               resolve();
//             }, 3000);
//           });
//         }
        
//         // Check authentication
//         if (!isAuthenticated) {
//           console.log('🔐 Saving deep link for after login');
//           setPendingDeepLink({ postId });
//           navigationRef.current?.navigate('Loginscreen');
//           return;
//         }
        
//         // Navigate to post
//         console.log('🚀 Navigating to PostDetails');
//         setTimeout(() => {
//           navigationRef.current?.navigate('PostDetails', { postId: postId.toString() });
//         }, 100);
//       }
//     } catch (error) {
//       console.error('Error processing deep link:', error);
//     }
//   }, [isAuthenticated, isNavigationReady]);
  
//   // Handle pending deep link after auth
//   useEffect(() => {
//     if (isAuthenticated && pendingDeepLink) {
//       console.log('🔐 Processing pending deep link');
//       setTimeout(() => {
//         processDeepLink(`showa://post/${pendingDeepLink.postId}`);
//         setPendingDeepLink(null);
//       }, 500);
//     }
//   }, [isAuthenticated, pendingDeepLink, processDeepLink]);
  
//   // Deep link listeners
//   useEffect(() => {
//     const handleDeepLink = (event) => {
//       console.log('🔗 Deep link received:', event.url);
//       processDeepLink(event.url);
//     };
    
//     const subscription = Linking.addEventListener('url', handleDeepLink);
    
//     const checkInitialUrl = async () => {
//       await new Promise(resolve => setTimeout(resolve, 500));
//       const initialUrl = await Linking.getInitialURL();
//       if (initialUrl) {
//         console.log('🔗 Initial URL:', initialUrl);
//         processDeepLink(initialUrl);
//       }
//     };
    
//     checkInitialUrl();
    
//     return () => {
//       subscription.remove();
//       if (deepLinkTimeoutRef.current) clearTimeout(deepLinkTimeoutRef.current);
//     };
//   }, [processDeepLink]);


//   // Restore navigation state
//   useEffect(() => {
//     const restoreNavigationState = async () => {
//       try {
//         const savedState = await loadNavigationState();
//         if (savedState) setInitialNavigationState(savedState);
//       } catch (error) {
//         console.error('Error restoring navigation state:', error);
//       }
//     };
//     restoreNavigationState();
//   }, []);

//   // Save navigation state
//   const handleNavigationStateChange = async (state) => {
//     if (state && navigationRef.current) {
//       if (navigationStateSaveTimer.current) clearTimeout(navigationStateSaveTimer.current);
//       navigationStateSaveTimer.current = setTimeout(async () => {
//         await saveNavigationState(state);
//       }, 1000);
//     }
//   };

//   // Check PIN requirement
//   const checkPinRequirement = async () => {
//     try {
//       const pinEnabled = await AsyncStorage.getItem('pin_enabled');
//       const token = await AsyncStorage.getItem('userToken');
//       if (pinEnabled === 'true' && token) {
//         const status = await checkPinStatus(token);
//         if (status && status.has_pin) setShowPinModal(true);
//       }
//     } catch (error) {
//       console.error('Error checking PIN:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize
//   useEffect(() => {
//     checkPinRequirement();
    
//     // Global refs
//     if (!global.__activeWebRTCConnections) global.__activeWebRTCConnections = [];
//     if (!global.__activeVideoRefs) global.__activeVideoRefs = [];
//     if (!global.__pendingRequests) global.__pendingRequests = [];
//     if (!global.__backgroundServicesRunning) global.__backgroundServicesRunning = true;
    
//     return () => {
//       if (navigationStateSaveTimer.current) clearTimeout(navigationStateSaveTimer.current);
//       if (deepLinkTimeoutRef.current) clearTimeout(deepLinkTimeoutRef.current);
//     };
//   }, []);

//   // App state changes
//   useEffect(() => {
//     const handleAppStateChange = async (nextAppState) => {
//       if (appState === 'active' && nextAppState === 'background') {
//         if (navigationRef.current) {
//           const currentState = navigationRef.current.getRootState();
//           await saveNavigationState(currentState);
//         }
//       }
//       setAppState(nextAppState);
//     };
    
//     const subscription = AppState.addEventListener('change', handleAppStateChange);
//     return () => subscription.remove();
//   }, [appState]);

//   // Background services
//   useEffect(() => {
//     const initializeBackgroundServices = async () => {
//       if (userId && global.__backgroundServicesRunning) {
//         backgroundFetchService.init();
//         startBackgroundContactSync();
//         setupContactSyncListener();
//         setTimeout(() => backgroundFetchService.forceFetch(), 2000);
//       }
//     };
//     initializeBackgroundServices();
//   }, [userId]);

//   // Loading state
//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   // Main render
//   return (
//     <NavigationContainer 
//       ref={navigationRef}
//       linking={linking}
//       theme={customTheme}
//       initialState={initialNavigationState}
//       onStateChange={handleNavigationStateChange}
//       onReady={() => {
//         console.log('✅ Navigation ready');
//         navigationReadyRef.current = true;
//         setIsNavigationReady(true);
//       }}
//     >
//       {isAuthenticated && <OnlineStatusManager userId={userId} />}
      
//       <RNStatusBar 
//         barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background}
//       />

//       <PinUnlockModal 
//         visible={showPinModal}
//         onClose={() => setShowPinModal(false)}
//         navigation={navigationRef.current}
//       />
      
//       <Stack.Navigator
//         initialRouteName="Loginscreen"
//         screenOptions={{ 
//           headerShown: false,
//           contentStyle: { backgroundColor: colors.background },
//           detachPreviousScreen: false,
//         }}
//       >
//         {/* ==================== AUTHENTICATION FLOW ==================== */}
//         <Stack.Screen name="Loginscreen">
//           {(props) => (
//             <ScreenWrapper>
//               <Loginscreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Signin">
//           {(props) => (
//             <ScreenWrapper>
//               <Signin {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* IMPORTANT: PostDetails must be registered before it can be navigated to */}
//         <Stack.Screen name="PostDetails">
//           {(props) => {
//             console.log('🎬 PostDetails rendered with params:', props.route?.params);
//             return (
//               <ScreenWrapper>
//                 <PostDetails {...props} />
//               </ScreenWrapper>
//             );
//           }}
//         </Stack.Screen>
        
//         <Stack.Screen name="Signin_two">
//           {(props) => (
//             <ScreenWrapper>
//               <Signin_two {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Register">
//           {(props) => (
//             <ScreenWrapper>
//               <Register {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="VerificationCode">
//           {(props) => (
//             <ScreenWrapper>
//               <VerificationCode {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="LinkingScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <LinkingScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Biometric">
//           {(props) => (
//             <ScreenWrapper>
//               <Biometric {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ProceedOptions">
//           {(props) => (
//             <ScreenWrapper>
//               <ProceedOptions {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="TermsCondition">
//           {(props) => (
//             <ScreenWrapper>
//               <TermsCondition {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="PrivacyPolicy">
//           {(props) => (
//             <ScreenWrapper>
//               <PrivacyPolicy {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== PERSONAL ACCOUNT FLOW ==================== */}
//         <Stack.Screen name="PHome">
//           {(props) => (
//             <ScreenWrapper>
//               <PHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="UserPersonalAccountProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <UserPersonalAccountProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="PStatusBar">
//           {(props) => (
//             <ScreenWrapper>
//               <PStatusBar {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="StatusEditorScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <StatusEditorScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="JoinChannel">
//           {(props) => (
//             <ScreenWrapper>
//               <JoinChannel {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Calls">
//           {(props) => (
//             <ScreenWrapper>
//               <Calls {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CallOngoingScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <CallOngoingScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Settings">
//           {(props) => (
//             <ScreenWrapper>
//               <Settings {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="PrivateChat">
//           {(props) => (
//             <ScreenWrapper>
//               <PrivateChat {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== BUSINESS ACCOUNT FLOW ==================== */}
//         <Stack.Screen name="BusinessHome">
//           {(props) => (
//             <ScreenWrapper>
//               <BusinessHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ChannelDetails">
//           {(props) => (
//             <ScreenWrapper>
//               <ChannelDetails {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BUserProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <BUserProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CreateBroadcastPost">
//           {(props) => (
//             <ScreenWrapper>
//               <CreateBroadcastPost {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="OtherUserProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <OtherUserProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="BroadcastUserProfile">
//           {(props) => (
//             <ScreenWrapper>
//               <BroadcastUserProfile {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="ReportPost">
//           {(props) => (
//             <ScreenWrapper>
//               <ReportPost {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== SOCIAL MEDIA FLOW ==================== */}
//         <Stack.Screen name="SocialHome">
//           {(props) => (
//             <ScreenWrapper>
//               <SocialHome {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== FEATURE SCREENS ==================== */}
//         <Stack.Screen name="GroupCreate">
//           {(props) => (
//             <ScreenWrapper>
//               <GroupCreate {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="UserContactList">
//           {(props) => (
//             <ScreenWrapper>
//               <UserContactList {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="CameraScreen">
//           {(props) => (
//             <ScreenWrapper>
//               <CameraScreen {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="VideoCalls">
//           {(props) => (
//             <ScreenWrapper>
//               <VideoCalls {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="VoiceCalls">
//           {(props) => (
//             <ScreenWrapper>
//               <VoiceCalls {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="LiveStream">
//           {(props) => (
//             <ScreenWrapper>
//               <LiveStream {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="EarningDashbord">
//           {(props) => (
//             <ScreenWrapper>
//               <EarningDashbord {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Viewer">
//           {(props) => (
//             <ScreenWrapper>
//               <Viewer {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>
        
//         <Stack.Screen name="Broadcaster">
//           {(props) => (
//             <ScreenWrapper>
//               <Broadcaster {...props} />
//             </ScreenWrapper>
//           )}
//         </Stack.Screen>

//         {/* ==================== MODAL SCREENS ==================== */}
//         <Stack.Screen
//           name="CallOverlay"
//           component={IncomingCallModal}
//           options={{
//             presentation: "transparentModal",
//             animation: "fade",
//             contentStyle: { backgroundColor: "transparent" },
//           }}
//         />
//       </Stack.Navigator>
      
//       {userId && <CallSignalListener userId={userId} />}
//     </NavigationContainer>
//   );
// }





