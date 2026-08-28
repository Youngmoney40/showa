

// import React, { useEffect, useState, useRef } from "react";
// import {
//   AppState,
//   View,
//   NativeModules,
//   NativeEventEmitter,
//   DeviceEventEmitter,
//   Platform,
//   ActivityIndicator,
//   StatusBar as RNStatusBar,
//   InteractionManager,
//   LogBox,
//   PermissionsAndroid,
//   Alert,
// } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { NavigationContainer, CommonActions } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
// import RNCallKeep from 'react-native-callkeep';
// import {
//   NotificationProvider,
//   useNotification,
// } from "./src/context/NotificationContext";


// const BLOCKED_AUTO_NAVIGATION_SCREENS = [
//   "SocialHome",
//   "Discover", 
//   "SearchShort",
//   "UploadshortVideo",
//   "ShortDetail",
//   "ExplorePostDetails",
//   "OtherUserProfile",
//   "PrivateChat",
//   "BusinessGroupChat",
//   "BPrivateChat",
//   "ChannelDetails",
//   "PostDetails",
//   "VideoCalls",
//   "VoiceCalls",
//   "CallOngoingScreen",
//   "BCallOngoingScreen",
// ];

// // ─── Navigation ref ───────────────────────────────────────────────────────────
// const navigationRef = React.createRef();
// const NAVIGATION_STATE_KEY = "NAVIGATION_STATE";

// // ⚡ CHANGED: Don't save navigation state at all (removes auto-navigation)
// const saveNavigationState = (state) => {
//   // Intentionally disabled - we don't want to save navigation state
//   // This prevents the app from restoring the last screen
//   console.log("🔒 Navigation state saving is disabled");
//   return;
// };

// const loadNavigationState = async () => {
//   // Intentionally disabled - we don't want to restore navigation state
//   console.log("🔒 Navigation state loading is disabled");
//   return undefined;
// };

// // ─── LogBox ───────────────────────────────────────────────────────────────────
// LogBox.ignoreLogs([
//   "new NativeEventEmitter",
//   "Require cycle:",
//   "VirtualizedLists should never be nested",
// ]);

// // ─── All imports ──────────────────────────────────────────────────────────────
// import { checkPinStatus } from "./showa_personal_account_screen/FaceSecuritySetting";
// import PinUnlockModal from "./screens/PinUnlockModal";
// import videoBackgroundfetch from "./src/services/VideoBackgroundFetch";
// import { ThemeProvider } from "./src/context/ThemeContext";
// import { useTheme } from "./src/context/ThemeContext";
// // import { CallProvider } from "./components/CallContext";
// import { GlobalCallProvider } from './components/GlobalCallProvider';
// import CallSignalListener from "./components/CallSignalListener";
// import IncomingCallModal from "./components/IncomingCallModal";
// import NetworkStatusBanner from "./components/Networkstatusbanner";
// import {
//   startBackgroundContactSync,
//   setupContactSyncListener,
// } from "./components/BackgroundSync";
// import backgroundFetchService from "./src/services/BackgroundFetchService";
// import Loginscreen from "./screens/Loginscreen";
// import ExplorePostDetails from "./screens/ExplorePostDetailScreen";
// import SuggestionUser from "./screens/SuggestionUser";
// import Signin from "./screens/onboard/SignIn";
// import Onboard from "./screens/onboard/OnboardingScreen";
// import Signin_two from "./screens/onboard/SignIn2_two";
// import TermsCondition from "./screens/onboard/Terms";
// import PrivacyPolicy from "./screens/onboard/PrivacyPolicy";
// import Register from "./screens/onboard/Register";
// import EmailLogin from "./screens/onboard/EmailLogin";
// import EmailRegister from "./screens/onboard/EmailRegisterScreen";
// import ForgotPassword from "./screens/onboard/ForgotPasswordScreen";
// import LoginMethod from "./screens/onboard/LoginMethod";
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
// import ExplorePost from "./showa_business/ExplorePost";
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
// import MyServicePostsScreen from "./showa_business/MyServicePostsScreen";
// import GroupMembers from "./showa_business/GroupMembers";
// import MonetizationDashboard from "./showa_business/MonetizationDashboard";
// import SocialHome from "./showa_social/Home";
// import ShortDetail from "./showa_social/ShortDetailScreen";
// import Discover from "./showa_social/Discover";
// import UploadshortVideo from "./showa_social/UploadshortVideo";
// import SearchShort from "./showa_social/SearchShort";
// import GroupCreate from "./screens/GroupCreate";
// import EdateProfile from "./screens/EdateProfile";
// import GroupConnect from "./screens/GroupConnect";
// import UserContactListPersonalAccount from "./components/UserContactListPersonalAccount";
// import UpdateModal from "./components/UpdateModal";
// import Music from "./components/Music";
// import UserContactList from "./components/UserContactList";
// import SyncMessagePersonal from "./components/SyncMessagePersonal";
// import SyncContactForBusiness from "./components/SyncContactForBusiness";
// import CameraScreen from "./components/CameraScreen";
// import BlockedUsersList from "./components/BlockedUsersList";

// import SongsList from "./components/SongsListScreen";
// import NewCommunity from "./components/NewCommunityScreen";
// import VideoCalls from "./components/VideoCalls";
// import Search from "./components/SearchScreen";
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
// import CallKeepService from './src/services/CallKeepService';
// import CompleteSignupProfile from "./screens/onboard/CompleteSignupProfile";
// import Channelist from "./screens/Channelist";
// import HangoutPlaces from "./screens/HangoutPlaces";
// import HangoutPlacesExplore from "./screens/HangoutPlacesExplore";
// import HangoutPlaceDetail from "./screens/HangoutPlaceDetail";
// import ShowaPremium from "./screens/ShowaPremium";
// import Games from "./screens/Games";
// import GamesDetail from "./screens/Gamesdetails";
// import ExploreFeaturePersonalAcount from "./components/ExploreFeaturePersonalAcount";
// import MusicPlayer from "./components/MusicPlayer";

// // ─── Linking ──────────────────────────────────────────────────────────────────
// import { Linking } from "react-native";

// const linking = {
//   prefixes: ["showa://", "https://showapp.ng", "http://showapp.ng"],
//   config: {
//     screens: {
//       ShortDetail: {
//         path: "short/:shortId",
//         parse: {
//           shortId: (shortId) => {
//             console.log("Linking - Parsing shortId:", shortId);
//             return shortId;
//           }
//         }
//       },
//       ExplorePostDetails: {
//         path: "post/:postId",
//         parse: {
//           postId: (postId) => {
//             console.log("📱 Linking - Parsing postId:", postId);
//             return postId;
//           }
//         }
//       },
//       OtherUserProfile: {
//         path: "user/:userId",
//         parse: {
//           userId: (userId) => userId
//         }
//       },
//       NotFound: "*",
//     },
//   },
//   getInitialURL: async () => {
//     try {
//       const url = await Linking.getInitialURL();
//       console.log("Linking.getInitialURL:", url);
//       return url;
//     } catch (err) {
//       console.error("Error in getInitialURL:", err);
//       return null;
//     }
//   },
//   subscribe: (listener) => {
//     const onReceiveURL = ({ url }) => {
//       console.log("🔔 Linking.subscribe received:", url);
//       listener(url);
//     };
//     const subscription = Linking.addEventListener("url", onReceiveURL);
//     return () => subscription.remove();
//   },
// };

// const useDeepLinkHandler = () => {
//   useEffect(() => {
//     const handleDeepLinkFromNative = async (url) => {
//       console.log('🔗 Processing native deep link:', url);
      
//       // Don't clear navigation state since we're not saving it
//       if (!navigationRef.current) {
//         console.log('Navigation not ready');
//         return;
//       }
      
//       if (!navigationRef.current.isReady()) {
//         console.log(' Navigation not ready, waiting...');
//         setTimeout(() => {
//           handleDeepLinkFromNative(url);
//         }, 500);
//         return;
//       }
      
//       const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
//       if (postMatch) {
//         const postId = postMatch[1];
//         console.log('📝 Navigating to ExplorePostDetails with ID:', postId);
        
//         try {
//           navigationRef.current.dispatch(
//             CommonActions.reset({
//               index: 0,
//               routes: [
//                 { 
//                   name: 'ExplorePostDetails',
//                   params: { 
//                     postId: parseInt(postId, 10),
//                     id: parseInt(postId, 10),
//                     post_id: parseInt(postId, 10)
//                   }
//                 }
//               ],
//             })
//           );
//           console.log('ExplorePostDetails navigation dispatched');
//         } catch (error) {
//           console.error(' Failed to navigate:', error);
//         }
//         return;
//       }
      
//       const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
//       if (shortMatch) {
//         const shortId = shortMatch[1];
//         console.log('🎬 Navigating to ShortDetail with ID:', shortId);
        
//         try {
//           navigationRef.current.dispatch(
//             CommonActions.reset({
//               index: 0,
//               routes: [
//                 { 
//                   name: 'ShortDetail',
//                   params: { 
//                     shortId: parseInt(shortId, 10),
//                     id: parseInt(shortId, 10),
//                     short_id: parseInt(shortId, 10)
//                   }
//                 }
//               ],
//             })
//           );
//           console.log('✅ ShortDetail navigation dispatched');
//         } catch (error) {
//           console.error('Failed to navigate:', error);
//         }
//         return;
//       }
      
//       const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
//       if (userMatch) {
//         const userId = userMatch[1];
//         console.log('👤 Navigating to OtherUserProfile with ID:', userId);
        
//         try {
//           navigationRef.current.dispatch(
//             CommonActions.reset({
//               index: 0,
//               routes: [
//                 { 
//                   name: 'OtherUserProfile',
//                   params: { userId: parseInt(userId, 10) }
//                 }
//               ],
//             })
//           );
//           console.log('✅ OtherUserProfile navigation dispatched');
//         } catch (error) {
//           console.error('❌ Failed to navigate:', error);
//         }
//         return;
//       }
      
//       console.log('⚠️ No matching pattern found for URL:', url);
//     };

//     // Check initial URL when app starts
//     const checkInitialUrl = async () => {
//       try {
//         const url = await Linking.getInitialURL();
//         if (url) {
//           console.log("Initial deep link detected:", url);
//           setTimeout(() => {
//             handleDeepLinkFromNative(url);
//           }, 500);
//         } else {
//           console.log("No initial deep link detected");
//         }
//       } catch (error) {
//         console.error("Error checking initial URL:", error);
//       }
//     };
    
//     checkInitialUrl();
    
//     // Listen for subsequent deep links
//     const subscription = Linking.addEventListener('url', (event) => {
//       console.log("🔔 Deep link event received:", event.url);
//       handleDeepLinkFromNative(event.url);
//     });
    
//     return () => {
//       subscription.remove();
//     };
//   }, []);
// };

// // ─── Android permission helper ───────────────────────────────────────────────
// const requestRuntimePermissions = async () => {
//   if (Platform.OS !== "android") return;

//   try {
//     const api = Platform.Version;
//     console.log(`📱 Android API level: ${api}`);

//     const toRequest = [];

//     if (api >= 33) {
//       toRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//       toRequest.push(
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
//       );
//     }

//     if (api >= 35) {
//       if (PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED) {
//         toRequest.push(
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED
//         );
//       }
//     }

//     if (toRequest.length === 0) return;

//     const results = await PermissionsAndroid.requestMultiple(toRequest);

//     toRequest.forEach((perm) => {
//       const name = perm.split(".").pop();
//       const result = results[perm];
//       console.log(
//         `  ${result === PermissionsAndroid.RESULTS.GRANTED ? "✅" : "⚠️"} ${name}: ${result}`
//       );
//     });
//   } catch (err) {
//     console.error("Permission request error (non-fatal):", err);
//   }
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const stopWebRTCConnections = () => {
//   try {
//     (global.__activeWebRTCConnections || []).forEach((conn) => {
//       try { conn && conn.close && conn.close(); } catch (_) {}
//     });
//     global.__activeWebRTCConnections = [];
//   } catch (err) {
//     console.error("stopWebRTCConnections:", err);
//   }
// };

// const pauseAllVideos = () => {
//   try {
//     (global.__activeVideoRefs || []).forEach((ref) => {
//       try {
//         if (ref && ref.current && typeof ref.current.pause === "function")
//           ref.current.pause();
//       } catch (_) {}
//     });
//   } catch (err) {
//     console.error("pauseAllVideos:", err);
//   }
// };

// const freeMemory = () => {
//   if (Platform.OS !== "android") return;
//   try {
//     if (global.gc) global.gc();
//     delete global.__largeImageCache;
//     delete global.__videoPrefetchCache;
//   } catch (err) {
//     console.error("freeMemory:", err);
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
//     console.error("stopBackgroundServices:", err);
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
// function AppContent() {
//   const [userId, setUserId] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const backgroundTimerRef = useRef(null);
//   const updateTimerRef = useRef(null);
//   const appStateRef = useRef(AppState.currentState);
//   const isMountedRef = useRef(true);

//   const { initializeNotifications } = useNotification();
//   const {
//     updateInfo,
//     showModal: showUpdateModal,
//     dismissModal: dismissUpdateModal,
//     checkForUpdate,
//   } = useAppUpdate(false);

//   // ── Deep link handler ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const { DeepLinkModule } = NativeModules;
    
//     if (DeepLinkModule) {
//       console.log('📱 DeepLinkModule found, setting up listener');
//       const eventEmitter = new NativeEventEmitter(DeepLinkModule);
//       const subscription = eventEmitter.addListener('deepLinkReceived', (event) => {
//         console.log('📱 Native deep link received:', event);
//         console.log('📱 URL:', event.url);
//         handleDeepLinkFromNative(event.url);
//       });
      
//       return () => {
//         subscription.remove();
//       };
//     } else {
//       console.log('⚠️ DeepLinkModule not found');
//     }
//   }, []);

//   const handleDeepLinkFromNative = async (url) => {
//     console.log('🔗 Processing native deep link:', url);
    
//     if (!navigationRef.current) {
//       console.log('❌ Navigation not ready');
//       return;
//     }
    
//     if (!navigationRef.current.isReady()) {
//       console.log('⏳ Navigation not ready, waiting...');
//       setTimeout(() => {
//         handleDeepLinkFromNative(url);
//       }, 500);
//       return;
//     }
    
//     const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
//     if (postMatch) {
//       const postId = postMatch[1];
//       console.log('📝 Navigating to ExplorePostDetails with ID:', postId);
      
//       try {
//         navigationRef.current.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [
//               { 
//                 name: 'ExplorePostDetails',
//                 params: { 
//                   postId: parseInt(postId, 10),
//                   id: parseInt(postId, 10),
//                   post_id: parseInt(postId, 10)
//                 }
//               }
//             ],
//           })
//         );
//         console.log('✅ ExplorePostDetails navigation dispatched');
//       } catch (error) {
//         console.error('❌ Failed to navigate:', error);
//       }
//       return;
//     }
    
//     const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
//     if (shortMatch) {
//       const shortId = shortMatch[1];
//       console.log('🎬 Navigating to ShortDetail with ID:', shortId);
      
//       try {
//         navigationRef.current.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [
//               { 
//                 name: 'ShortDetail',
//                 params: { 
//                   shortId: parseInt(shortId, 10),
//                   id: parseInt(shortId, 10),
//                   short_id: parseInt(shortId, 10)
//                 }
//               }
//             ],
//           })
//         );
//         console.log('✅ ShortDetail navigation dispatched');
//       } catch (error) {
//         console.error('❌ Failed to navigate:', error);
//       }
//       return;
//     }
    
//     const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
//     if (userMatch) {
//       const userId = userMatch[1];
//       console.log('👤 Navigating to OtherUserProfile with ID:', userId);
      
//       try {
//         navigationRef.current.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [
//               { 
//                 name: 'OtherUserProfile',
//                 params: { userId: parseInt(userId, 10) }
//               }
//             ],
//           })
//         );
//         console.log('✅ OtherUserProfile navigation dispatched');
//       } catch (error) {
//         console.error('❌ Failed to navigate:', error);
//       }
//       return;
//     }
    
//     console.log('⚠️ No matching pattern found for URL:', url);
//   };

//   // ── Call handler ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     const callSubscription = DeviceEventEmitter.addListener(
//       'incomingCallFromNotification',
//       (callData) => {
//         console.log('[App] Incoming call from notification:', callData);
//         handleIncomingCallNavigation(callData);
//       }
//     );

//     const checkPendingCall = async () => {
//       try {
//         if (NativeModules.CallModule) {
//           const pending = await NativeModules.CallModule.getPendingCall();
//           if (pending) {
//             console.log('[App] Pending call on startup:', pending);
//             setTimeout(() => handleIncomingCallNavigation(pending), 1000);
//           }
//         }
//       } catch (e) {
//         console.warn('[App] getPendingCall error:', e);
//       }
//     };

//     const setupCalling = async () => {
//       if (Platform.OS !== 'android') return;

//       await CallKeepService.initialize();

//       try {
//         const hasAccount = await RNCallKeep.hasPhoneAccount();
//         console.log('[App] Phone account enabled:', hasAccount);

//         if (!hasAccount) {
//           Alert.alert(
//             'One-time Setup Required',
//             'To receive calls, please enable Showa in your phone calling accounts. This only needs to be done once.',
//             [
//               { text: 'Later', style: 'cancel' },
//               { text: 'Enable Now', onPress: () => RNCallKeep.openPhoneAccounts() },
//             ]
//           );
//         }
//       } catch (e) {
//         console.warn('[App] Phone account check error:', e);
//       }
//     };

//     setupCalling();
//     checkPendingCall();

//     return () => {
//       callSubscription.remove();
//     };
//   }, []);

//   const handleIncomingCallNavigation = (callData) => {
//     console.log("========== APP.JS NAVIGATION ==========");
//     console.log("callData:", JSON.stringify(callData, null, 2));

//     try {
//       NativeModules.CallModule?.stopCallService();
//     } catch (e) {}

//     if (callData.autoAccept && navigationRef.current) {
//       try {
//         const fullOffer = callData.offer || {
//           type: 'offer',
//           sdp: callData.sdp,
//           callerInfo: {
//             name: callData.callerName,
//             profileImage: callData.profileImage || ''
//           },
//           isVideoCall: callData.callType === 'video',
//           targetUserId: callData.callerId,
//           roomId: callData.roomId
//         };

//         navigationRef.current.dispatch(
//           CommonActions.navigate('PHome', {
//             name: callData.callerName,
//             profile_image: callData.profileImage || '',
//             targetUserId: callData.callerId,
//             isIncomingCall: true,
//             isInitiator: false,
//             incomingOffer: fullOffer,
//             isVideoCall: callData.callType === 'video',
//             callType: callData.callType,
//             roomId: callData.roomId,
//             callId: callData.callId,
//             autoAnswerOnOffer: false, 
//           }));
//       } catch (error) {
//         console.error('Failed to navigate to VoiceCalls:', error);
//         if (global.__callNotificationHandler) {
//           global.__callNotificationHandler(callData);
//         }
//       }
//     } else if (global.__callNotificationHandler) {
//       global.__callNotificationHandler(callData);
//     }
//   };

//   // ── Sequenced boot ────────────────────────────────────────────────────────
//   useEffect(() => {
//     isMountedRef.current = true;

//     const boot = async () => {
//       await requestRuntimePermissions();

//       try {
//         await initializeNotifications();
//       } catch (err) {
//         console.error("initializeNotifications (non-fatal):", err);
//       }

//       await checkAuth();
//     };

//     boot();

//     return () => {
//       isMountedRef.current = false;
//       if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//     };
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const [token, userData] = await Promise.all([
//         AsyncStorage.getItem("userToken"),
//         AsyncStorage.getItem("userData"),
//       ]);

//       if (!isMountedRef.current) return;

//       if (token && userData) {
//         const user = JSON.parse(userData);
//         setUserId(user.id);
//         setIsAuthenticated(true);

//         if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//         updateTimerRef.current = setTimeout(() => {
//           if (isMountedRef.current) checkForUpdate(true);
//         }, 3000);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (err) {
//       console.error("checkAuth error:", err);
//       if (isMountedRef.current) setIsAuthenticated(false);
//     }
//   };

//   useEffect(() => {
//     CallKeepService.initialize();
//   }, []);

//   // ── Video prefetch ────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!userId) return;
//     let cancelled = false;

//     (async () => {
//       try {
//         await videoBackgroundfetch.init(userId);
//         if (!cancelled) {
//           const cached = await videoBackgroundfetch.getCachedVideos();
//           console.log("Cached videos:", cached?.length || 0);
//         }
//       } catch (err) {
//         console.error("videoBackgroundfetch init (non-fatal):", err);
//       }
//     })();

//     return () => {
//       cancelled = true;
//       if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
//       stopBackgroundServices();
//     };
//   }, [userId]);

//   useDeepLinkHandler();

 
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       const prev = appStateRef.current;

//       if (prev === "active" && nextAppState === "background") {
//         console.log("📱 → background");

       

//         if (Platform.OS === "android") {
//           pauseAllVideos();
//           stopWebRTCConnections();

//           if (backgroundTimerRef.current)
//             clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = setTimeout(freeMemory, 30_000);
//         }
//       } else if (prev === "background" && nextAppState === "active") {
//         console.log("→ foreground");

//         if (backgroundTimerRef.current) {
//           clearTimeout(backgroundTimerRef.current);
//           backgroundTimerRef.current = null;
//         }

//         if (isAuthenticated && isMountedRef.current) {
//           if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//           updateTimerRef.current = setTimeout(() => {
//             if (isMountedRef.current) checkForUpdate(true);
//           }, 1500);
//         }

//         InteractionManager.runAfterInteractions(() =>
//           console.log("✅ App resumed")
//         );
//       }

//       appStateRef.current = nextAppState;
//     };

//     const sub = AppState.addEventListener("change", handleAppStateChange);

//     return () => {
//       sub.remove();
//       if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
//       if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
//     };
//   }, [userId, isAuthenticated]);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       {/* <CallProvider> */}
//       {/* <GlobalCallProvider navigation={navigationRef.current}>   */}
//         <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//         <NetworkStatusBanner />

//         {updateInfo?.update_available && (
//           <UpdateModal
//             visible={showUpdateModal}
//             updateInfo={updateInfo}
//             onClose={dismissUpdateModal}
//           />
//         )}
//       {/* </CallProvider> */}
//       {/* </GlobalCallProvider> */}
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
// function ThemedNavigator({ isAuthenticated, userId }) {
//   const { theme, colors } = useTheme();
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNavigationReady, setIsNavigationReady] = useState(true); // ⚡ CHANGED: Always ready
//   const [initialNavigationState, setInitialNavigationState] = useState(undefined); // ⚡ CHANGED: Always undefined

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

//   // ⚡ CHANGED: No navigation state restoration
//   useEffect(() => {
//     // Init globals once on mount
//     global.__activeWebRTCConnections = global.__activeWebRTCConnections || [];
//     global.__activeVideoRefs         = global.__activeVideoRefs || [];
//     global.__pendingRequests         = global.__pendingRequests || [];

//     // ⚡ REMOVED: Navigation state restoration
//     console.log("🔒 Navigation state restoration is disabled");
//     setIsNavigationReady(true);

//     return () => {
//       if (navSaveTimerRef.current)    clearTimeout(navSaveTimerRef.current);
//       if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
//     };
//   }, []);

//   // ── PIN check ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     checkPinRequirement();
//   }, [isAuthenticated]);

//   const checkPinRequirement = async () => {
//     try {
//       const [pinEnabled, token] = await Promise.all([
//         AsyncStorage.getItem("pin_enabled"),
//         AsyncStorage.getItem("userToken"),
//       ]);
//       if (pinEnabled === "true" && token) {
//         const status = await checkPinStatus(token);
//         if (status?.has_pin) setShowPinModal(true);
//       }
//     } catch (err) {
//       console.error("checkPinRequirement error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ── Background services ────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!userId || global.__backgroundServicesRunning) return;

//     const startServices = async () => {
//       try {
//         await backgroundFetchService.init();
//       } catch (err) {
//         console.error("backgroundFetchService.init (non-fatal):", err);
//       }

//       try {
//         startBackgroundContactSync();
//       } catch (err) {
//         console.error("startBackgroundContactSync (non-fatal):", err);
//       }

//       try {
//         setupContactSyncListener();
//       } catch (err) {
//         console.error("setupContactSyncListener (non-fatal):", err);
//       }

//       global.__backgroundServicesRunning = true;

//       forceFetchTimerRef.current = setTimeout(() => {
//         try { backgroundFetchService.forceFetch(); } catch (_) {}
//       }, 2000);
//     };

//     startServices();

//     return () => {
//       if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
//     };
//   }, [userId]);

//   // ⚡ CHANGED: No navigation state saving
//   const handleNavigationStateChange = (state) => {
//     if (!state) return;
    
//     // ⚡ REMOVED: Navigation state saving
//     // We intentionally don't save navigation state
//     console.log("🔒 Navigation state saving is disabled");
    
//     // Don't do anything with the state
//     return;
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
//         backgroundColor={Platform.Version >= 35 ? "transparent" : colors.background}
//         translucent={Platform.Version >= 35}
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
//         }}
//       >
//         {/* ── Authentication ─────────────────────────────────────────────── */}
//         <Stack.Screen name="Loginscreen">
//           {(p) => <ScreenWrapper><Loginscreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Signin">
//           {(p) => <ScreenWrapper><Signin {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Signin_two">
//           {(p) => <ScreenWrapper><Signin_two {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Register">
//           {(p) => <ScreenWrapper><Register {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VerificationCode">
//           {(p) => <ScreenWrapper><VerificationCode {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LinkingScreen">
//           {(p) => <ScreenWrapper><LinkingScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Biometric">
//           {(p) => <ScreenWrapper><Biometric {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ProceedOptions">
//           {(p) => <ScreenWrapper><ProceedOptions {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Terms">
//           {(p) => <ScreenWrapper><Terms {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="TermsCondition">
//           {(p) => <ScreenWrapper><TermsCondition {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PrivacyPolicy">
//           {(p) => <ScreenWrapper><PrivacyPolicy {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Personal account ───────────────────────────────────────────── */}
//         <Stack.Screen name="PHome">
//           {(p) => <ScreenWrapper><PHome {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UserPersonalAccountProfile">
//           {(p) => <ScreenWrapper><UserPersonalAccountProfile {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SyncContactForBusiness">
//           {(p) => <ScreenWrapper><SyncContactForBusiness {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PStatusBar">
//           {(p) => <ScreenWrapper><PStatusBar {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="StatusEditorScreen">
//           {(p) => <ScreenWrapper><StatusEditorScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="JoinChannel">
//           {(p) => <ScreenWrapper><JoinChannel {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Calls">
//           {(p) => <ScreenWrapper><Calls {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CallOngoingScreen">
//           {(p) => <ScreenWrapper><CallOngoingScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Settings">
//           {(p) => <ScreenWrapper><Settings {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NotificationsScreen">
//           {(p) => <ScreenWrapper><NotificationsScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NotificationSetting">
//           {(p) => <ScreenWrapper><NotificationSetting {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="WallpaperSetting">
//           {(p) => <ScreenWrapper><WallpaperSetting {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="FaceSecuritySetting">
//           {(p) => <ScreenWrapper><FaceSecuritySetting {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="MusicPlayer">
//           {(p) => <ScreenWrapper><MusicPlayer {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PrivateChat">
//           {(p) => <ScreenWrapper><PrivateChat {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Business account ───────────────────────────────────────────── */}
//         <Stack.Screen name="BusinessHome">
//           {(p) => <ScreenWrapper><BusinessHome {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PostDetails">
//           {(p) => <ScreenWrapper><PostDetails {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ChannelDetails">
//           {(p) => <ScreenWrapper><ChannelDetails {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ChannelAdminManagement">
//           {(p) => <ScreenWrapper><ChannelAdminManagement {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BUserProfile">
//           {(p) => <ScreenWrapper><BUserProfile {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BStatusBar">
//           {(p) => <ScreenWrapper><BStatusBar {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BStatusEditorScreen">
//           {(p) => <ScreenWrapper><BStatusEditorScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BJoinChannel">
//           {(p) => <ScreenWrapper><BJoinChannel {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BCalls">
//           {(p) => <ScreenWrapper><BCalls {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BCallOngoingScreen">
//           {(p) => <ScreenWrapper><BCallOngoingScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BSettings">
//           {(p) => <ScreenWrapper><BSettings {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BNotificationSetting">
//           {(p) => <ScreenWrapper><BNotificationSetting {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BWallpaperSetting">
//           {(p) => <ScreenWrapper><BWallpaperSetting {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BFaceSecuritySetting">
//           {(p) => <ScreenWrapper><BFaceSecuritySetting {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ToolsScreen">
//           {(p) => <ScreenWrapper><ToolsScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="QuickReplies">
//           {(p) => <ScreenWrapper><QuickReplies {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ShortDetail">
//           {(p) => <ScreenWrapper><ShortDetail {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AddQuickReply">
//           {(p) => <ScreenWrapper><AddQuickReply {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EssentialPlatforms">
//           {(p) => <ScreenWrapper><EssentialPlatformsScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LoginMethod">
//           {(p) => <ScreenWrapper><LoginMethod {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="EmailLogin">
//           {(p) => <ScreenWrapper><EmailLogin {...p} /></ScreenWrapper>}
//         </Stack.Screen>
        
//         <Stack.Screen name="Search">
//           {(p) => <ScreenWrapper><Search {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="BlockedUsersList">
//           {(p) => <ScreenWrapper><BlockedUsersList {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EmailRegister">
//           {(p) => <ScreenWrapper><EmailRegister {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ForgotPassword">
//           {(p) => <ScreenWrapper><ForgotPassword {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Advertise">
//           {(p) => <ScreenWrapper><Advertise {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ManageProfile">
//           {(p) => <ScreenWrapper><ManageProfile {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateCatalog">
//           {(p) => <ScreenWrapper><CreateCatalog {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EdateProfile">
//           {(p) => <ScreenWrapper><EdateProfile {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Explore">
//           {(p) => <ScreenWrapper><Explore {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HangoutPlaceDetail">
//           {(p) => <ScreenWrapper><HangoutPlaceDetail {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="AddItemToCatalog">
//           {(p) => <ScreenWrapper><AddItemToCatalog {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="MyServicePostsScreen">
//           {(p) => <ScreenWrapper><MyServicePostsScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="MonetizationDashboard">
//           {(p) => <ScreenWrapper><MonetizationDashboard {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         <Stack.Screen name="LabelChats">
//           {(p) => <ScreenWrapper><LabelChats {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Labels">
//           {(p) => <ScreenWrapper><Labels {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AddQuickReplyScreen">
//           {(p) => <ScreenWrapper><AddQuickReplyScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GreetingMessage">
//           {(p) => <ScreenWrapper><GreetingMessage {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AwayMessage">
//           {(p) => <ScreenWrapper><AwayMessage {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HelpCenter">
//           {(p) => <ScreenWrapper><HelpCenter {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HelpTopic">
//           {(p) => <ScreenWrapper><HelpTopic {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BusinessSetup">
//           {(p) => <ScreenWrapper><BusinessSetup {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ProductDetails">
//           {(p) => <ScreenWrapper><ProductDetails {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ExplorePost">
//           {(p) => <ScreenWrapper><ExplorePost {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Cart">
//           {(p) => <ScreenWrapper><Cart {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EmptyCart">
//           {(p) => <ScreenWrapper><EmptyCart {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Broadcast">
//           {(p) => <ScreenWrapper><Broadcast {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OfficialSearch">
//           {(p) => <ScreenWrapper><OfficialSearch {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Onboard">
//           {(p) => <ScreenWrapper><Onboard {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CompleteSignupProfile">
//           {(p) => <ScreenWrapper><CompleteSignupProfile {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SuggestionUser">
//           {(p) => <ScreenWrapper><SuggestionUser {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ExplorePostDetails">
//           {(p) => <ScreenWrapper><ExplorePostDetails {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Channelist">
//           {(p) => <ScreenWrapper><Channelist {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Live">
//           {(p) => <ScreenWrapper><Live {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OoshBusiness">
//           {(p) => <ScreenWrapper><OoshBusiness {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateChannel">
//           {(p) => <ScreenWrapper><CreateChannel {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="InviteChannelLink">
//           {(p) => <ScreenWrapper><InviteChannelLink {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Supplyrequest">
//           {(p) => <ScreenWrapper><Supplyrequest {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyRequestForm">
//           {(p) => <ScreenWrapper><SupplyRequestForm {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyServices">
//           {(p) => <ScreenWrapper><SupplyServices {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyRequestDetail">
//           {(p) => <ScreenWrapper><SupplyRequestDetail {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateServices">
//           {(p) => <ScreenWrapper><CreateServices {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplyRequestDetailScreen">
//           {(p) => <ScreenWrapper><SupplyRequestDetailScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BroadcastHome">
//           {(p) => <ScreenWrapper><BroadcastHome {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Games">
//           {(p) => <ScreenWrapper><Games {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GamesDetail">
//           {(p) => <ScreenWrapper><GamesDetail {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ShowaPremium">
//           {(p) => <ScreenWrapper><ShowaPremium {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateBroadcastPost">
//           {(p) => <ScreenWrapper><CreateBroadcastPost {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ReportPost">
//           {(p) => <ScreenWrapper><ReportPost {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BroadcastUserProfile">
//           {(p) => <ScreenWrapper><BroadcastUserProfile {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="MarketPlace">
//           {(p) => <ScreenWrapper><MarketPlace {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateListing">
//           {(p) => <ScreenWrapper><CreateListing {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ListingDetails">
//           {(p) => <ScreenWrapper><ListingDetails {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SuggestedFollowers">
//           {(p) => <ScreenWrapper><SuggestedFollowers {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ManagePost">
//           {(p) => <ScreenWrapper><ManagePost {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreatorDashboard">
//           {(p) => <ScreenWrapper><CreatorDashboard {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="MonetizationRequestForm">
//           {(p) => <ScreenWrapper><MonetizationRequestForm {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ChatAi">
//           {(p) => <ScreenWrapper><ChatAi {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ContractHome">
//           {(p) => <ScreenWrapper><ContractHome {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CreateAdForm">
//           {(p) => <ScreenWrapper><CreateAdForm {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AdReview">
//           {(p) => <ScreenWrapper><AdReview {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BroadcastSuccess">
//           {(p) => <ScreenWrapper><BroadcastSuccess {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="AllProducts">
//           {(p) => <ScreenWrapper><AllProducts {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OtherUserCatalog">
//           {(p) => <ScreenWrapper><OtherUserCatalog {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OtherUserCatalogDetail">
//           {(p) => <ScreenWrapper><OtherUserCatalogDetail {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BPrivateChat">
//           {(p) => <ScreenWrapper><BPrivateChat {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="BusinessGroupChat">
//           {(p) => <ScreenWrapper><BusinessGroupChat {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SupplierNotificationScreen">
//           {(p) => <ScreenWrapper><SupplierNotificationScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="RequesterPostHistory">
//           {(p) => <ScreenWrapper><RequesterPostHistory {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GroupMembers">
//           {(p) => <ScreenWrapper><GroupMembers {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Social ─────────────────────────────────────────────────────── */}
//         <Stack.Screen name="SocialHome">
//           {(p) => <ScreenWrapper><SocialHome {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Discover">
//           {(p) => <ScreenWrapper><Discover {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UploadshortVideo">
//           {(p) => <ScreenWrapper><UploadshortVideo {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SearchShort">
//           {(p) => <ScreenWrapper><SearchShort {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HangoutPlaces">
//           {(p) => <ScreenWrapper><HangoutPlaces {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HangoutPlacesExplore">
//           {(p) => <ScreenWrapper><HangoutPlacesExplore {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="HangoutDetail">
//           {(p) => <ScreenWrapper><HangoutDetail {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Features ───────────────────────────────────────────────────── */}
//         <Stack.Screen name="Music">
//           {(p) => <ScreenWrapper><Music {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GroupCreate">
//           {(p) => <ScreenWrapper><GroupCreate {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GroupConnect">
//           {(p) => <ScreenWrapper><GroupConnect {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UserContactList">
//           {(p) => <ScreenWrapper><UserContactList {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ExploreFeaturePersonalAcount">
//           {(p) => <ScreenWrapper><ExploreFeaturePersonalAcount {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SynMessage">
//           {(p) => <ScreenWrapper><SynMessage {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SyncContactPersonal">
//           {(p) => <ScreenWrapper><SyncContactPersonal {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="UserContactListPersonalAccount">
//           {(p) => <ScreenWrapper><UserContactListPersonalAccount {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SyncMessagePersonal">
//           {(p) => <ScreenWrapper><SyncMessagePersonal {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="CameraScreen">
//           {(p) => <ScreenWrapper><CameraScreen {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SongsList">
//           {(p) => <ScreenWrapper><SongsList {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NewCommunity">
//           {(p) => <ScreenWrapper><NewCommunity {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VideoCalls">
//           {(p) => <ScreenWrapper><VideoCalls {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VoiceCalls">
//           {(p) => <ScreenWrapper><VoiceCalls {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GoLive">
//           {(p) => <ScreenWrapper><GoLive {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LiveStream">
//           {(p) => <ScreenWrapper><LiveStream {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="ContactUs">
//           {(p) => <ScreenWrapper><ContactUs {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="SuccessStory">
//           {(p) => <ScreenWrapper><SuccessStory {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="OtherUserProfile">
//           {(p) => <ScreenWrapper><OtherUserProfile {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="LiveStreaming">
//           {(p) => <ScreenWrapper><LiveStreaming {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="GlobalIssueReport">
//           {(p) => <ScreenWrapper><GlobalIssueReport {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NewsList">
//           {(p) => <ScreenWrapper><NewsList {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Broadcaster">
//           {(p) => <ScreenWrapper><Broadcaster {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="Viewer">
//           {(p) => <ScreenWrapper><Viewer {...p} /></ScreenWrapper>}
//         </Stack.Screen>

//         {/* ── Earning ────────────────────────────────────────────────────── */}
//         <Stack.Screen name="EarningDashbord">
//           {(p) => <ScreenWrapper><EarningDashbord {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="WithdrawEarning">
//           {(p) => <ScreenWrapper><WithdrawEarning {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="PurchaseData">
//           {(p) => <ScreenWrapper><PurchaseData {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="NinRegisterEarning">
//           {(p) => <ScreenWrapper><NinRegisterEarning {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="VideoAds">
//           {(p) => <ScreenWrapper><VideoAds {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//         <Stack.Screen name="EarningWallet">
//           {(p) => <ScreenWrapper><EarningWallet {...p} /></ScreenWrapper>}
//         </Stack.Screen>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// // ─── Logout helper ────────────────────────────────────────────────────────────
// export const handleAppLogout = async (clearTokenFn) => {
//   try {
//     global.__backgroundServicesRunning = false;
//     global.__activeWebRTCConnections   = [];
//     global.__activeVideoRefs           = [];
//     stopBackgroundServices();
//     await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
//     if (typeof clearTokenFn === "function") await clearTokenFn();
//   } catch (err) {
//     console.error("handleAppLogout error:", err);
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
  Alert,
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

const BLOCKED_AUTO_NAVIGATION_SCREENS = [
  "SocialHome",
  "Discover", 
  "SearchShort",
  "UploadshortVideo",
  "ShortDetail",
  "ExplorePostDetails",
  "OtherUserProfile",
  "PrivateChat",
  "BusinessGroupChat",
  "BPrivateChat",
  "ChannelDetails",
  "PostDetails",
  "VideoCalls",
  "VoiceCalls",
  "CallOngoingScreen",
  "BCallOngoingScreen",
];

// ─── Navigation ref ───────────────────────────────────────────────────────────
const navigationRef = React.createRef();
const NAVIGATION_STATE_KEY = "NAVIGATION_STATE";



const loadNavigationState = async () => {
  // Intentionally disabled - we don't want to restore navigation state
  console.log("🔒 Navigation state loading is disabled");
  return undefined;
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
import { CallProvider } from './components/CallProvider';
import NetworkStatusBanner from "./components/Networkstatusbanner";
import {
  startBackgroundContactSync,
  setupContactSyncListener,
} from "./components/BackgroundSync";
import IncomingCallHandler from './components/Incomingcallhandler';
import backgroundFetchService from "./src/services/BackgroundFetchService";
import Loginscreen from "./screens/Loginscreen";
import ExplorePostDetails from "./screens/ExplorePostDetailScreen";
import SuggestionUser from "./screens/SuggestionUser";
import Signin from "./screens/onboard/SignIn";
import Onboard from "./screens/onboard/OnboardingScreen";
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
import ExplorePost from "./showa_business/ExplorePost";
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
import MyServicePostsScreen from "./showa_business/MyServicePostsScreen";
import GroupMembers from "./showa_business/GroupMembers";
import MonetizationDashboard from "./showa_business/MonetizationDashboard";
import SocialHome from "./showa_social/Home";
import ShortDetail from "./showa_social/ShortDetailScreen";
import Discover from "./showa_social/Discover";
import UploadshortVideo from "./showa_social/UploadshortVideo";
import SearchShort from "./showa_social/SearchShort";
import GroupCreate from "./screens/GroupCreate";
import EdateProfile from "./screens/EdateProfile";
import GroupConnect from "./screens/GroupConnect";
import UserContactListPersonalAccount from "./components/UserContactListPersonalAccount";
import UpdateModal from "./components/UpdateModal";
import SwipeBackWrapper from "./components/SwipeBackWrapper";
import Music from "./components/Music";
import UserContactList from "./components/UserContactList";
import SyncMessagePersonal from "./components/SyncMessagePersonal";
import SyncContactForBusiness from "./components/SyncContactForBusiness";
import CameraScreen from "./components/CameraScreen";
import BlockedUsersList from "./components/BlockedUsersList";
import SongsList from "./components/SongsListScreen";
import NewCommunity from "./components/NewCommunityScreen";
import VideoCalls from "./components/VideoCalls";
import Search from "./components/SearchScreen";
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
import Channelist from "./screens/Channelist";
import HangoutPlaces from "./screens/HangoutPlaces";
import HangoutPlacesExplore from "./screens/HangoutPlacesExplore";
import HangoutPlaceDetail from "./screens/HangoutPlaceDetail";
import ShowaPremium from "./screens/ShowaPremium";
import Games from "./screens/Games";
import GamesDetail from "./screens/Gamesdetails";
import ExploreFeaturePersonalAcount from "./components/ExploreFeaturePersonalAcount";
import MusicPlayer from "./components/MusicPlayer";


// ─── Linking ──────────────────────────────────────────────────────────────────
import { Linking } from "react-native";

const linking = {
  prefixes: ["showa://", "https://showapp.ng", "http://showapp.ng"],
  config: {
    screens: {
      ShortDetail: {
        path: "short/:shortId",
        parse: {
          shortId: (shortId) => {
            console.log("Linking - Parsing shortId:", shortId);
            return parseInt(shortId, 10);
          }
        }
      },
      ExplorePostDetails: {
        path: "post/:postId",
        parse: {
          postId: (postId) => {
            console.log("📱 Linking - Parsing postId:", postId);
            return parseInt(postId, 10);
          }
        }
      },
      OtherUserProfile: {
        path: "user/:userId",
        parse: {
          userId: (userId) => parseInt(userId, 10)
        }
      },
      
      ShortDetailAlt: {
        path: "s/:shortId",
        parse: {
          shortId: (shortId) => parseInt(shortId, 10)
        }
      },
      ExplorePostDetailsAlt: {
        path: "p/:postId",
        parse: {
          postId: (postId) => parseInt(postId, 10)
        }
      },
      OtherUserProfileAlt: {
        path: "u/:userId",
        parse: {
          userId: (userId) => parseInt(userId, 10)
        }
      },
      NotFound: "*",
    },
  },
  getInitialURL: async () => {
    try {
      // Check for pending deep link first
      const pendingLink = await AsyncStorage.getItem('pendingDeepLink');
      if (pendingLink) {
        console.log('📨 Pending deep link found:', pendingLink);
        await AsyncStorage.removeItem('pendingDeepLink');
        return pendingLink;
      }

      const url = await Linking.getInitialURL();
      console.log("🔗 getInitialURL:", url);
      
      if (url) {
        // Check if it's a deep link we should handle
        if (url.startsWith('showa://') || url.includes('showapp.ng')) {
          console.log("✅ Deep link detected:", url);
          return url;
        }
      }
      return null;
    } catch (err) {
      console.error("❌ Error in getInitialURL:", err);
      return null;
    }
  },
  subscribe: (listener) => {
    console.log("🔔 Setting up deep link subscription");
    
    const onReceiveURL = ({ url }) => {
      console.log("🔔 Linking.subscribe received:", url);
      
      // Process all deep links
      if (url) {
        listener(url);
      }
    };
    
    const subscription = Linking.addEventListener("url", onReceiveURL);
    
    return () => {
      console.log("Removing deep link subscription");
      subscription.remove();
    };
  },
};




const useDeepLinkHandler = () => {
  const [initialDeepLink, setInitialDeepLink] = useState(null);
  const isProcessingRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    const handleDeepLink = async (url) => {
      // Prevent duplicate processing
      if (isProcessingRef.current) {
        console.log('⏳ Already processing a deep link, skipping...');
        return;
      }

      console.log('🔗 Processing deep link:', url);
      
      if (!url) {
        console.log('⚠️ No URL provided');
        return;
      }

      // Check if navigation is ready
      if (!navigationRef.current || !navigationRef.current.isReady()) {
        console.log('⏳ Navigation not ready, waiting...');
        setTimeout(() => {
          handleDeepLink(url);
        }, 500);
        return;
      }

      try {
        isProcessingRef.current = true;

        // Check if user is authenticated
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('🔒 User not authenticated, storing deep link for later');
          await AsyncStorage.setItem('pendingDeepLink', url);
          navigationRef.current.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Loginscreen' }],
            })
          );
          isProcessingRef.current = false;
          return;
        }

        // Parse URL to extract ID - support multiple formats
        let match;
        let postId, shortId, userId;

        // Check for post ID (supports /post/123, /p/123)
        match = url.match(/\/(?:post|p)\/(\d+)/);
        if (match) {
          postId = parseInt(match[1], 10);
          console.log('📝 Navigating to ExplorePostDetails with ID:', postId);
          
          // Navigate directly without resetting the entire stack
          navigationRef.current.dispatch(
            CommonActions.navigate('ExplorePostDetails', { 
              postId: postId,
              id: postId,
              post_id: postId
            })
          );
          console.log('✅ ExplorePostDetails navigation dispatched');
          hasNavigatedRef.current = true;
          isProcessingRef.current = false;
          return;
        }
        
        // Check for short ID
        match = url.match(/\/(?:short|s)\/(\d+)/);
        if (match) {
          shortId = parseInt(match[1], 10);
          console.log('🎬 Navigating to ShortDetail with ID:', shortId);
          
          navigationRef.current.dispatch(
            CommonActions.navigate('ShortDetail', { 
              shortId: shortId,
              id: shortId,
              short_id: shortId
            })
          );
          console.log('✅ ShortDetail navigation dispatched');
          hasNavigatedRef.current = true;
          isProcessingRef.current = false;
          return;
        }
        
        // Check for user ID
        match = url.match(/\/(?:user|u)\/(\d+)/);
        if (match) {
          userId = parseInt(match[1], 10);
          console.log('👤 Navigating to OtherUserProfile with ID:', userId);
          
          navigationRef.current.dispatch(
            CommonActions.navigate('OtherUserProfile', { 
              userId: userId,
              id: userId,
              user_id: userId
            })
          );
          console.log('✅ OtherUserProfile navigation dispatched');
          hasNavigatedRef.current = true;
          isProcessingRef.current = false;
          return;
        }
        
        console.log('⚠️ No matching pattern found for URL:', url);
        // Only navigate to home if NO match was found and we haven't navigated yet
        if (!hasNavigatedRef.current) {
          console.log('🏠 No match found, staying on current screen');
          // Don't navigate to home automatically - let the user stay where they are
        }
      } catch (error) {
        console.error('❌ Navigation error:', error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    // Check for initial URL
    const checkInitialUrl = async () => {
      try {
        // Check if there's a pending deep link from a previous session
        const pendingLink = await AsyncStorage.getItem('pendingDeepLink');
        if (pendingLink) {
          console.log('📨 Pending deep link found:', pendingLink);
          // Don't remove it immediately - process it first
          setTimeout(() => {
            handleDeepLink(pendingLink);
            // Remove after processing
            AsyncStorage.removeItem('pendingDeepLink');
          }, 1000);
          return;
        }
        
        // Check for initial URL
        const url = await Linking.getInitialURL();
        if (url) {
          console.log("📨 Initial deep link detected:", url);
          setInitialDeepLink(url);
          setTimeout(() => {
            handleDeepLink(url);
          }, 500);
        } else {
          console.log("ℹ️ No initial deep link detected");
        }
      } catch (error) {
        console.error("❌ Error checking initial URL:", error);
      }
    };
    
    // Run initial check after a small delay to ensure navigation is ready
    setTimeout(checkInitialUrl, 300);
    
    // Set up event listener for deep links
    const subscription = Linking.addEventListener('url', (event) => {
      console.log("🔔 Deep link event received:", event.url);
      hasNavigatedRef.current = false; // Reset for new navigation
      handleDeepLink(event.url);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);

  return { initialDeepLink };
};

// ─── Android permission helper ───────────────────────────────────────────────
const requestRuntimePermissions = async () => {
  if (Platform.OS !== "android") return;

  try {
    const api = Platform.Version;
    console.log(`📱 Android API level: ${api}`);

    const toRequest = [];

    if (api >= 33) {
      toRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      toRequest.push(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
      );
    }

    if (api >= 35) {
      if (PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED) {
        toRequest.push(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED
        );
      }
    }

    if (toRequest.length === 0) return;

    const results = await PermissionsAndroid.requestMultiple(toRequest);

    toRequest.forEach((perm) => {
      const name = perm.split(".").pop();
      const result = results[perm];
      console.log(
        `  ${result === PermissionsAndroid.RESULTS.GRANTED ? "✅" : "⚠️"} ${name}: ${result}`
      );
    });
  } catch (err) {
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
// const ScreenWrapper = ({ children }) => {
//   const { colors } = useTheme();
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {children}
//     </View>
//   );
// };

const ScreenWrapper = ({ children, swipeEnabled = true }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SwipeBackWrapper enabled={swipeEnabled}>
        {children}
      </SwipeBackWrapper>
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
function AppContent() {
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const backgroundTimerRef = useRef(null);
  const updateTimerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const isMountedRef = useRef(true);

  const { initializeNotifications } = useNotification();
  const {
    updateInfo,
    showModal: showUpdateModal,
    dismissModal: dismissUpdateModal,
    checkForUpdate,
  } = useAppUpdate(false);

  useEffect(() => {
  // Listen for initial deep link from native
  const subscription = DeviceEventEmitter.addListener('initialDeepLink', (event) => {
    console.log('📱 Initial deep link from native:', event.url);
    if (event.url) {
      // Process the deep link
      setTimeout(() => {
        const handleDeepLink = async () => {
          // Check authentication
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            await AsyncStorage.setItem('pendingDeepLink', event.url);
            return;
          }
          
          // Navigate to the post
          const match = event.url.match(/\/(?:post|p)\/(\d+)/);
          if (match) {
            const postId = parseInt(match[1], 10);
            if (navigationRef.current?.isReady()) {
              navigationRef.current.dispatch(
                CommonActions.navigate('ExplorePostDetails', { 
                  postId: postId,
                  id: postId,
                  post_id: postId
                })
              );
            }
          }
        };
        handleDeepLink();
      }, 1000);
    }
  });

  return () => {
    subscription.remove();
  };
}, []);

  // ── Deep link handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const { DeepLinkModule } = NativeModules;
    
    if (DeepLinkModule) {
      console.log('📱 DeepLinkModule found, setting up listener');
      const eventEmitter = new NativeEventEmitter(DeepLinkModule);
      const subscription = eventEmitter.addListener('deepLinkReceived', (event) => {
        console.log('📱 Native deep link received:', event);
        console.log('📱 URL:', event.url);
        handleDeepLinkFromNative(event.url);
      });
      
      return () => {
        subscription.remove();
      };
    } else {
      console.log('⚠️ DeepLinkModule not found');
    }
  }, []);

  const handleDeepLinkFromNative = async (url) => {
    console.log('🔗 Processing native deep link:', url);
    
    if (!navigationRef.current) {
      console.log('❌ Navigation not ready');
      return;
    }
    
    if (!navigationRef.current.isReady()) {
      console.log('Navigation not ready, waiting...');
      setTimeout(() => {
        handleDeepLinkFromNative(url);
      }, 500);
      return;
    }
    
    const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
    if (postMatch) {
      const postId = postMatch[1];
      console.log('📝 Navigating to ExplorePostDetails with ID:', postId);
      
      try {
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { 
                name: 'ExplorePostDetails',
                params: { 
                  postId: parseInt(postId, 10),
                  id: parseInt(postId, 10),
                  post_id: parseInt(postId, 10)
                }
              }
            ],
          })
        );
        console.log('✅ ExplorePostDetails navigation dispatched');
      } catch (error) {
        console.error('❌ Failed to navigate:', error);
      }
      return;
    }
    
    const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
    if (shortMatch) {
      const shortId = shortMatch[1];
      console.log('🎬 Navigating to ShortDetail with ID:', shortId);
      
      try {
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { 
                name: 'ShortDetail',
                params: { 
                  shortId: parseInt(shortId, 10),
                  id: parseInt(shortId, 10),
                  short_id: parseInt(shortId, 10)
                }
              }
            ],
          })
        );
        console.log('✅ ShortDetail navigation dispatched');
      } catch (error) {
        console.error('❌ Failed to navigate:', error);
      }
      return;
    }
    
    const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
    if (userMatch) {
      const userId = userMatch[1];
      console.log('👤 Navigating to OtherUserProfile with ID:', userId);
      
      try {
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { 
                name: 'OtherUserProfile',
                params: { userId: parseInt(userId, 10) }
              }
            ],
          })
        );
        console.log('✅ OtherUserProfile navigation dispatched');
      } catch (error) {
        console.error('Failed to navigate:', error);
      }
      return;
    }
    
    console.log('⚠️ No matching pattern found for URL:', url);
  };

  // ── Call handler ───────────────────────────────────────────────────────────
  useEffect(() => {
    const callSubscription = DeviceEventEmitter.addListener(
      'incomingCallFromNotification',
      (callData) => {
        console.log('[App] Incoming call from notification:', callData);
        handleIncomingCallNavigation(callData);
      }
    );

    const checkPendingCall = async () => {
      try {
        if (NativeModules.CallModule) {
          const pending = await NativeModules.CallModule.getPendingCall();
          if (pending) {
            console.log('[App] Pending call on startup:', pending);
            setTimeout(() => handleIncomingCallNavigation(pending), 1000);
          }
        }
      } catch (e) {
        console.warn('[App] getPendingCall error:', e);
      }
    };

    const setupCalling = async () => {
      if (Platform.OS !== 'android') return;

      await CallKeepService.initialize();

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
    };

    setupCalling();
    checkPendingCall();

    return () => {
      callSubscription.remove();
    };
  }, []);

const handleIncomingCallNavigation = (callData) => {
  console.log("========== APP.JS NAVIGATION ==========");
  console.log("callData:", JSON.stringify(callData, null, 2));

  try {
    NativeModules.CallModule?.stopCallService();
  } catch (e) {}

  // Delegate to CallProvider's accept handler — it owns the persistent
  // socket and may already have the real offer captured for this call.
  if (callData.autoAccept && global.__callAcceptHandler) {
    global.__callAcceptHandler(callData);
    return;
  }

  // Notification body tapped (not Accept) — just open the app to the call,
  // don't auto-answer.
  if (global.__callNotificationHandler) {
    global.__callNotificationHandler(callData);
  }
};

// const handleIncomingCallNavigation = (callData) => {
//   try {
//     NativeModules.CallModule?.stopCallService();

    

//   } catch (e) {}

//   // Prefer the real offer CallProvider's persistent socket may already have
//   if (callData.autoAccept && global.__callAcceptHandler) {
    
//     global.__callAcceptHandler(callData);
//     return;
//   }

//   if (!navigationRef.current) return;

//   const fullOffer = callData.offer || {
//     type: 'offer',
//     sdp: callData.sdp,
//     callerInfo: {
//       name: callData.callerName,
//       profileImage: callData.profileImage || ''
//     },
//     isVideoCall: callData.callType === 'video',
//     targetUserId: callData.callerId,
//     roomId: callData.roomId
//   };

//   const targetScreen = callData.callType === 'video' ? 'VideoCalls' : 'VoiceCalls';

//   navigationRef.current.dispatch(
//     CommonActions.navigate(targetScreen, {
//       name: callData.callerName,
//       profile_image: callData.profileImage || '',
//       targetUserId: callData.callerId,
//       isIncomingCall: true,
//       isInitiator: false,
//       incomingOffer: fullOffer,
//       isVideoCall: callData.callType === 'video',
//       callType: callData.callType,
//       roomId: callData.roomId,
//       callId: callData.callId,
//       autoAnswerOnOffer: !!callData.autoAccept,   
//     })
//   );
// };

  // ── Sequenced boot ────────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;

    const boot = async () => {
      await requestRuntimePermissions();

      try {
        await initializeNotifications();
      } catch (err) {
        console.error("initializeNotifications (non-fatal):", err);
      }

      await checkAuth();
    };

    boot();

    return () => {
      isMountedRef.current = false;
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, []);

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

  // useEffect(() => {
  //   CallKeepService.initialize();
  // }, []);

  // ── Video prefetch ────────────────────────────────────────────────────────
  // useEffect(() => {
  //   if (!userId) return;
  //   let cancelled = false;

  //   (async () => {
  //     try {
  //       await videoBackgroundfetch.init(userId);
  //       if (!cancelled) {
  //         const cached = await videoBackgroundfetch.getCachedVideos();
  //         console.log("Cached videos:", cached?.length || 0);
  //       }
  //     } catch (err) {
  //       console.error("videoBackgroundfetch init (non-fatal):", err);
  //     }
  //   })();

  //   return () => {
  //     cancelled = true;
  //     if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
  //     stopBackgroundServices();
  //   };fff
  // }, [userId]);

  useDeepLinkHandler();

 
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      const prev = appStateRef.current;

      if (prev === "active" && nextAppState === "background") {
        console.log("📱 → background");

        if (Platform.OS === "android") {
          pauseAllVideos();
          stopWebRTCConnections();

          if (backgroundTimerRef.current)
            clearTimeout(backgroundTimerRef.current);
          backgroundTimerRef.current = setTimeout(freeMemory, 30_000);
        }

        // if (Platform.OS === "android") {
        //   pauseAllVideos();
        //   stopWebRTCConnections();
        //   freeMemory(); // ⬅️ immediate, not setTimeout — this is exactly the moment it matters
        // }
      } else if (prev === "background" && nextAppState === "active") {
        console.log("→ foreground");

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
  }, [userId, isAuthenticated]);


  // return (
  //   <GestureHandlerRootView style={{ flex: 1 }}>
  //     <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
  //     <NetworkStatusBanner />
  //     {isAuthenticated && (
  //       <IncomingCallHandler navigation={navigationRef.current} route={{}} />
  //     )}
      

  //     {updateInfo?.update_available && (
  //       <UpdateModal
  //         visible={showUpdateModal}
  //         updateInfo={updateInfo}
  //         onClose={dismissUpdateModal}
  //       />
  //     )}
  //   </GestureHandlerRootView>
  // );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
      <NetworkStatusBanner />

      {updateInfo?.update_available && (
        <UpdateModal
          visible={showUpdateModal}
          updateInfo={updateInfo}
          onClose={dismissUpdateModal}
        />
      )}
    </GestureHandlerRootView>
  );

// return (
//   <GestureHandlerRootView style={{ flex: 1 }}>
//     <CallProvider navigationRef={navigationRef} isAuthenticated={isAuthenticated}>
//       <ThemedNavigator isAuthenticated={isAuthenticated} userId={userId} />
//       <NetworkStatusBanner />

//       {updateInfo?.update_available && (
//         <UpdateModal
//           visible={showUpdateModal}
//           updateInfo={updateInfo}
//           onClose={dismissUpdateModal}
//         />
//       )}
//     </CallProvider>
//   </GestureHandlerRootView>
// );
}

// ─── OnlineStatusManager ──────────────────────────────────────────────────────
const OnlineStatusManager = ({ userId }) => {
  if (!userId) return null;
  useOnlineStatus(userId);
  return null;
};

// ─── ThemedNavigator ──────────────────────────────────────────────────────────
function ThemedNavigator({ isAuthenticated, userId }) {
  const { theme, colors } = useTheme();
  const [showPinModal, setShowPinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(true);
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

  // ⚡ UPDATED: Gesture configuration for all screens
  const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: colors.background },
    // --- GESTURE CONFIGURATION ---
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    // Don't use fullScreenGestureEnabled for better compatibility
    fullScreenGestureEnabled: false,
    // Allow gesture from anywhere on screen (more responsive)
    gestureResponseDistance: {
      horizontal: 200,
    },
    // Prevent gesture from interfering with scroll views
    gestureVelocityImpact: 0.3,
    // Animation for gesture
    animation: 'slide_from_right',
    presentation: 'card',
  };

  useEffect(() => {
    global.__activeWebRTCConnections = global.__activeWebRTCConnections || [];
    global.__activeVideoRefs         = global.__activeVideoRefs || [];
    global.__pendingRequests         = global.__pendingRequests || [];

    console.log("🔒 Navigation state restoration is disabled");
    setIsNavigationReady(true);

    return () => {
      if (navSaveTimerRef.current)    clearTimeout(navSaveTimerRef.current);
      if (forceFetchTimerRef.current) clearTimeout(forceFetchTimerRef.current);
    };
  }, []);

  // ── PIN check ──────────────────────────────────────────────────────────────
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

  // ── Background services ────────────────────────────────────────────────────
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

  const handleNavigationStateChange = (state) => {
    if (!state) return;
    console.log("🔒 Navigation state saving is disabled");
    return;
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

      <Stack.Navigator
        initialRouteName="Loginscreen"
        screenOptions={screenOptions}
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
        <Stack.Screen name="MusicPlayer">
          {(p) => <ScreenWrapper><MusicPlayer {...p} /></ScreenWrapper>}
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
        <Stack.Screen name="EssentialPlatformsScreen">
          {(p) => <ScreenWrapper><EssentialPlatformsScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>

        

        {/* <Stack.Screen
          options={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: false,
            gestureResponseDistance: {
              horizontal: 200,
            },
            // Prevent the app from closing on back gesture
            gestureVelocityImpact: 0.3,
          }}
         name="EssentialPlatforms">
          {(p) => <ScreenWrapper><EssentialPlatformsScreen {...p} /></ScreenWrapper>}
        </Stack.Screen> */}


        <Stack.Screen name="LoginMethod">
          {(p) => <ScreenWrapper><LoginMethod {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="EmailLogin">
          {(p) => <ScreenWrapper><EmailLogin {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Search">
          {(p) => <ScreenWrapper><Search {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="BlockedUsersList">
          {(p) => <ScreenWrapper><BlockedUsersList {...p} /></ScreenWrapper>}
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
        <Stack.Screen name="EdateProfile">
          {(p) => <ScreenWrapper><EdateProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Explore">
          {(p) => <ScreenWrapper><Explore {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="HangoutPlaceDetail">
          {(p) => <ScreenWrapper><HangoutPlaceDetail {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="AddItemToCatalog">
          {(p) => <ScreenWrapper><AddItemToCatalog {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="MyServicePostsScreen">
          {(p) => <ScreenWrapper><MyServicePostsScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="MonetizationDashboard">
          {(p) => <ScreenWrapper><MonetizationDashboard {...p} /></ScreenWrapper>}
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
        <Stack.Screen name="ExplorePost">
          {(p) => <ScreenWrapper><ExplorePost {...p} /></ScreenWrapper>}
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
        <Stack.Screen name="Onboard">
          {(p) => <ScreenWrapper><Onboard {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="CompleteSignupProfile">
          {(p) => <ScreenWrapper><CompleteSignupProfile {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="SuggestionUser">
          {(p) => <ScreenWrapper><SuggestionUser {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ExplorePostDetails">
          {(p) => <ScreenWrapper><ExplorePostDetails {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Channelist">
          {(p) => <ScreenWrapper><Channelist {...p} /></ScreenWrapper>}
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
        <Stack.Screen name="Games">
          {(p) => <ScreenWrapper><Games {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="GamesDetail">
          {(p) => <ScreenWrapper><GamesDetail {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="ShowaPremium">
          {(p) => <ScreenWrapper><ShowaPremium {...p} /></ScreenWrapper>}
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
        <Stack.Screen name="HangoutPlaces">
          {(p) => <ScreenWrapper><HangoutPlaces {...p} /></ScreenWrapper>}
        </Stack.Screen>
        <Stack.Screen name="HangoutPlacesExplore">
          {(p) => <ScreenWrapper><HangoutPlacesExplore {...p} /></ScreenWrapper>}
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
        <Stack.Screen name="ExploreFeaturePersonalAcount">
          {(p) => <ScreenWrapper><ExploreFeaturePersonalAcount {...p} /></ScreenWrapper>}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Logout helper ────────────────────────────────────────────────────────────
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





