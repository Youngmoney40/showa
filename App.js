


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
import GroupMembers from "./showa_business/GroupMembers";
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
import Music from "./components/Music";
import UserContactList from "./components/UserContactList";
import SyncMessagePersonal from "./components/SyncMessagePersonal";
import SyncContactForBusiness from "./components/SyncContactForBusiness";
import CameraScreen from "./components/CameraScreen";
import BlockedUsersList from "./components/BlockedUsersList";

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
            return shortId;
          }
        }
      },
      ExplorePostDetails: {
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
// const handleDeepLink = async (event) => {
//   const { url } = event;
//   console.log("🔗 Deep link received:", url);
  
//   if (!url || !navigationRef.current) {
//     console.log("❌ No URL or navigation ref available");
//     return;
//   }

//   // ✅ CRITICAL: Clear saved navigation state FIRST
//   // This prevents the app from restoring the previous screen
//   await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
//   console.log("🗑️ Cleared saved navigation state");

//   // Wait for navigation to be ready
//   if (!navigationRef.current.isReady()) {
//     console.log("⏳ Navigation not ready, waiting...");
//     await new Promise(resolve => {
//       const checkReady = () => {
//         if (navigationRef.current?.isReady()) {
//           resolve();
//         } else {
//           setTimeout(checkReady, 100);
//         }
//       };
//       checkReady();
//     });
//   }
  
//   // Check for post deep link
//   const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
//   if (postMatch) {
//     const postId = postMatch[1];
//     console.log("📝 Navigating to ExplorePostDetails with ID:", postId);
    
//     try {
//       // ✅ Use reset to clear the entire navigation stack
//       // This ensures the deep link screen is the only screen
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'ExplorePostDetails',
//               params: { 
//                 postId: parseInt(postId, 10),
//                 id: parseInt(postId, 10),
//                 post_id: parseInt(postId, 10)
//               }
//             }
//           ],
//         })
//       );
//       console.log("✅ ExplorePostDetails navigation dispatched via reset");
//     } catch (error) {
//       console.error("❌ Failed to navigate to ExplorePostDetails:", error);
//     }
//     return;
//   }
  
//   // Check for short video deep link
//   const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
//   if (shortMatch) {
//     const shortId = shortMatch[1];
//     console.log("🎬 Navigating to ShortDetail with ID:", shortId);
    
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'ShortDetail',
//               params: { 
//                 shortId: parseInt(shortId, 10),
//                 id: parseInt(shortId, 10),
//                 short_id: parseInt(shortId, 10)
//               }
//             }
//           ],
//         })
//       );
//       console.log("✅ ShortDetail navigation dispatched via reset");
//     } catch (error) {
//       console.error("❌ Failed to navigate to ShortDetail:", error);
//     }
//     return;
//   }
  
//   // Check for user profile deep link
//   const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
//   if (userMatch) {
//     const userId = userMatch[1];
//     console.log("👤 Navigating to OtherUserProfile with ID:", userId);
    
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'OtherUserProfile',
//               params: { userId: parseInt(userId, 10) }
//             }
//           ],
//         })
//       );
//       console.log("✅ OtherUserProfile navigation dispatched via reset");
//     } catch (error) {
//       console.error("❌ Failed to navigate to OtherUserProfile:", error);
//     }
//     return;
//   }
  
//   console.log("⚠️ No matching deep link pattern found for URL:", url);
// };

// const handleDeepLink = async (event) => {
//   const { url } = event;
//   console.log("🔗 Deep link received:", url);
  
//   if (!url || !navigationRef.current) {
//     console.log("❌ No URL or navigation ref available");
//     return;
//   }

//   // ✅ CRITICAL: Clear saved navigation state FIRST
//   await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
//   console.log("🗑️ Cleared saved navigation state");

//   // Wait for navigation to be ready
//   if (!navigationRef.current.isReady()) {
//     console.log("⏳ Navigation not ready, waiting...");
//     await new Promise(resolve => {
//       const checkReady = () => {
//         if (navigationRef.current?.isReady()) {
//           resolve();
//         } else {
//           setTimeout(checkReady, 100);
//         }
//       };
//       checkReady();
//     });
//   }
  
//   // ✅ CHECK FOR POST DEEP LINK - Handles both formats:
//   // - showa://post/6
//   // - https://showapp.com/post/6
//   // - http://showapp.com/post/6
//   // - showa://p/6
//   // - https://showapp.com/p/6
  
//   // Try multiple patterns
//   const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
//   if (postMatch) {
//     const postId = postMatch[1];
//     console.log("📝 Navigating to ExplorePostDetails with ID:", postId);
    
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'ExplorePostDetails',
//               params: { 
//                 postId: parseInt(postId, 10),
//                 id: parseInt(postId, 10),
//                 post_id: parseInt(postId, 10)
//               }
//             }
//           ],
//         })
//       );
//       console.log("✅ ExplorePostDetails navigation dispatched via reset");
//     } catch (error) {
//       console.error("❌ Failed to navigate to ExplorePostDetails:", error);
//     }
//     return;
//   }
  
//   // Check for short video deep link
//   const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
//   if (shortMatch) {
//     const shortId = shortMatch[1];
//     console.log("🎬 Navigating to ShortDetail with ID:", shortId);
    
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'ShortDetail',
//               params: { 
//                 shortId: parseInt(shortId, 10),
//                 id: parseInt(shortId, 10),
//                 short_id: parseInt(shortId, 10)
//               }
//             }
//           ],
//         })
//       );
//       console.log("✅ ShortDetail navigation dispatched via reset");
//     } catch (error) {
//       console.error("❌ Failed to navigate to ShortDetail:", error);
//     }
//     return;
//   }
  
//   // Check for user profile deep link
//   const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
//   if (userMatch) {
//     const userId = userMatch[1];
//     console.log("👤 Navigating to OtherUserProfile with ID:", userId);
    
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'OtherUserProfile',
//               params: { userId: parseInt(userId, 10) }
//             }
//           ],
//         })
//       );
//       console.log("✅ OtherUserProfile navigation dispatched via reset");
//     } catch (error) {
//       console.error("❌ Failed to navigate to OtherUserProfile:", error);
//     }
//     return;
//   }
  
//   console.log("⚠️ No matching deep link pattern found for URL:", url);
// };


const handleDeepLinkFromNative = async (url) => {
  console.log('🔗 Processing native deep link:', url);
  
  await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
  console.log('🗑️ Cleared saved navigation state');
  
  if (!navigationRef.current) {
    console.log('❌ Navigation not ready');
    return;
  }
  
  if (!navigationRef.current.isReady()) {
    console.log('⏳ Navigation not ready, waiting...');
    setTimeout(() => {
      handleDeepLinkFromNative(url);
    }, 500);
    return;
  }
  
  // ✅ Extract post ID from URL
  let postId = null;
  const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
  if (postMatch) {
    postId = postMatch[1];
  }
  
  if (postId) {
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
  
  console.log('⚠️ No matching pattern found for URL:', url);
};

const handleDeepLink = async (event) => {
  const { url } = event;
  console.log("🔗 Deep link received:", url);
  
  if (!url || !navigationRef.current) {
    console.log("❌ No URL or navigation ref available");
    return;
  }

  // Clear saved navigation state
  await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
  console.log("🗑️ Cleared saved navigation state");

  // Wait for navigation to be ready
  if (!navigationRef.current.isReady()) {
    console.log("⏳ Navigation not ready, waiting...");
    await new Promise(resolve => {
      const checkReady = () => {
        if (navigationRef.current?.isReady()) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }
  
  // ✅ EXTRACT POST ID - Works for both showa://post/6 and https://showapp.com/post/6
  let postId = null;
  
  // Try to extract from URL
  const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
  if (postMatch) {
    postId = postMatch[1];
  }
  
  // Also try to extract from query params if needed
  if (!postId) {
    const urlObj = new URL(url);
    postId = urlObj.searchParams.get('postId') || urlObj.searchParams.get('id');
  }
  
  if (postId) {
    console.log("📝 Navigating to ExplorePostDetails with ID:", postId);
    
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
      console.log("✅ ExplorePostDetails navigation dispatched");
    } catch (error) {
      console.error("❌ Failed to navigate:", error);
    }
    return;
  }
  
  // Check for short video
  const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
  if (shortMatch) {
    const shortId = shortMatch[1];
    console.log("🎬 Navigating to ShortDetail with ID:", shortId);
    
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
      console.log("✅ ShortDetail navigation dispatched");
    } catch (error) {
      console.error("❌ Failed to navigate:", error);
    }
    return;
  }
  
  // Check for user profile
  const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
  if (userMatch) {
    const userId = userMatch[1];
    console.log("👤 Navigating to OtherUserProfile with ID:", userId);
    
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
      console.log("✅ OtherUserProfile navigation dispatched");
    } catch (error) {
      console.error("❌ Failed to navigate:", error);
    }
    return;
  }
  
  console.log("⚠️ No matching pattern found for URL:", url);
};



    // Check initial URL when app starts
    const checkInitialUrl = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          console.log("📱 Initial deep link detected:", url);
          // Clear saved state immediately
          await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
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
    
    // Listen for subsequent deep links
    const subscription = Linking.addEventListener('url', (event) => {
      console.log("🔔 Deep link event received:", event.url);
      handleDeepLink(event);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
};


// const useDeepLinkHandler = () => {
//   useEffect(() => {
//     const handleDeepLink = async (event) => {
//       const { url } = event;
//       console.log("🔗 Deep link received:", url);
      
//       if (!url || !navigationRef.current) {
//         console.log("❌ No URL or navigation ref available");
//         return;
//       }

//       if (!navigationRef.current.isReady()) {
//         console.log("Navigation not ready, waiting...");
//         await new Promise(resolve => {
//           const checkReady = () => {
//             if (navigationRef.current?.isReady()) {
//               resolve();
//             } else {
//               setTimeout(checkReady, 100);
//             }
//           };
//           checkReady();
//         });
//       }
      
//       // Wait a bit for navigation to be ready
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Check for short video deep link
//       // Supports formats: showa://short/19, showa://s/19, https://showapp.com/short/19
//       const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
//       if (shortMatch) {
//         const shortId = shortMatch[1];
//         console.log("🎬 Navigating to ShortDetail with ID:", shortId);
        
//         try {
//           navigationRef.current.dispatch(
//             CommonActions.navigate({
//               name: 'ShortDetail',
//               params: { 
//                 shortId: parseInt(shortId, 10),
//                 id: parseInt(shortId, 10),
//                 short_id: parseInt(shortId, 10)
//               },
//             })
//           );
//           console.log("✅ ShortDetail navigation dispatched");
//         } catch (error) {
//           console.error("❌ Failed to navigate to ShortDetail:", error);
//         }
//         return;
//       }
      
//       // Check for post deep link
//       // Supports formats: showa://post/97, showa://p/97, https://showapp.com/post/97
//       const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
//       if (postMatch) {
//         const postId = postMatch[1];
//         console.log("📝 Navigating to PostDetail with ID:", postId);
        
//         try {
//           navigationRef.current.dispatch(
//             CommonActions.navigate({
//               name: 'ExplorePostDetails',
//               params: { 
//                 postId: parseInt(postId, 10),
//                 id: parseInt(postId, 10),
//                 post_id: parseInt(postId, 10)
//               },
//             })
//           );
//           console.log("✅ PostDetail navigation dispatched");
//         } catch (error) {
//           console.error("❌ Failed to navigate to PostDetail:", error);
//         }
//         return;
//       }
      
//       // Check for user profile deep link
//       const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
//       if (userMatch) {
//         const userId = userMatch[1];
//         console.log("👤 Navigating to UserProfile with ID:", userId);
        
//         try {
//           navigationRef.current.dispatch(
//             CommonActions.navigate({
//               name: 'OtherUserProfile',
//               params: { userId: parseInt(userId, 10) },
//             })
//           );
//           console.log("✅ UserProfile navigation dispatched");
//         } catch (error) {
//           console.error("❌ Failed to navigate to UserProfile:", error);
//         }
//         return;
//       }
      
//       console.log("⚠️ No matching deep link pattern found for URL:", url);
//     };

// //     useEffect(() => {
// //   // Initialize CallKeep when app starts
// //   const initCallKeep = async () => {
// //     await CallKeepService.initialize();
// //   };
// //   initCallKeep();
// // }, []);


    


//     // Check initial URL when app starts
//     const checkInitialUrl = async () => {
//       try {
//         const url = await Linking.getInitialURL();
//         if (url) {
//           console.log("📱 Initial deep link detected:", url);
//           // Small delay to ensure app is fully initialized
//           setTimeout(() => {
//             handleDeepLink({ url });
//           }, 500);
//         } else {
//           console.log("📱 No initial deep link detected");
//         }
//       } catch (error) {
//         console.error("❌ Error checking initial URL:", error);
//       }
//     };
    
//     checkInitialUrl();
    
//     // Listen for subsequent deep links while app is running
//     const subscription = Linking.addEventListener('url', (event) => {
//       console.log("🔔 Deep link event received:", event.url);
//       handleDeepLink(event);
//     });
    
//     return () => {
//       subscription.remove();
//     };
//   }, []);
// };

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
    // Listen for deep link events from native
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

// useEffect(() => {
//   // Listen for deep link events from native
//   const { DeepLinkModule } = NativeModules;
  
//   if (DeepLinkModule) {
//     console.log('📱 DeepLinkModule found, setting up listener');
//     const eventEmitter = new NativeEventEmitter(DeepLinkModule);
//     const subscription = eventEmitter.addListener('deepLinkReceived', (event) => {
//       console.log('📱 Native deep link received:', event);
//       console.log('📱 URL:', event.url);
//       handleDeepLinkFromNative(event.url);
//     });
    
//     return () => {
//       subscription.remove();
//     };
//   } else {
//     console.log('⚠️ DeepLinkModule not found');
//   }
// }, []);

// const handleDeepLinkFromNative = async (url) => {
//   console.log('🔗 Processing native deep link:', url);
  
//   // ✅ CRITICAL: Clear saved navigation state FIRST
//   await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
//   console.log('🗑️ Cleared saved navigation state from native handler');
  
//   if (!navigationRef.current) {
//     console.log('❌ Navigation not ready');
//     return;
//   }
  
//   // Wait for navigation to be ready
//   if (!navigationRef.current.isReady()) {
//     console.log('⏳ Navigation not ready, waiting...');
//     setTimeout(() => {
//       handleDeepLinkFromNative(url);
//     }, 500);
//     return;
//   }
  
//   const postMatch = url.match(/\/(?:post|p)\/(\d+)/);
//   if (postMatch) {
//     const postId = postMatch[1];
//     console.log('📝 Navigating to ExplorePostDetails with ID:', postId);
    
//     try {
//       // ✅ Use reset to clear the entire navigation stack
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'ExplorePostDetails',
//               params: { 
//                 postId: parseInt(postId, 10),
//                 id: parseInt(postId, 10),
//                 post_id: parseInt(postId, 10)
//               }
//             }
//           ],
//         })
//       );
//       console.log('✅ ExplorePostDetails navigation dispatched via reset');
//     } catch (error) {
//       console.error('❌ Failed to navigate:', error);
//     }
//     return;
//   }
  
//   const shortMatch = url.match(/\/(?:short|s)\/(\d+)/);
//   if (shortMatch) {
//     const shortId = shortMatch[1];
//     console.log('🎬 Navigating to ShortDetail with ID:', shortId);
    
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'ShortDetail',
//               params: { 
//                 shortId: parseInt(shortId, 10),
//                 id: parseInt(shortId, 10),
//                 short_id: parseInt(shortId, 10)
//               }
//             }
//           ],
//         })
//       );
//       console.log('✅ ShortDetail navigation dispatched via reset');
//     } catch (error) {
//       console.error('❌ Failed to navigate:', error);
//     }
//     return;
//   }
  
//   const userMatch = url.match(/\/(?:user|u)\/(\d+)/);
//   if (userMatch) {
//     const userId = userMatch[1];
//     console.log('👤 Navigating to OtherUserProfile with ID:', userId);
    
//     try {
//       navigationRef.current.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [
//             { 
//               name: 'OtherUserProfile',
//               params: { userId: parseInt(userId, 10) }
//             }
//           ],
//         })
//       );
//       console.log('✅ OtherUserProfile navigation dispatched via reset');
//     } catch (error) {
//       console.error('❌ Failed to navigate:', error);
//     }
//     return;
//   }
  
//   console.log('⚠️ No matching pattern found for URL:', url);
// };

const handleDeepLinkFromNative = async (url) => {
  console.log('🔗 Processing native deep link:', url);
  
  // ✅ CRITICAL: Clear saved navigation state FIRST
  await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
  console.log('🗑️ Cleared saved navigation state from native handler');
  
  if (!navigationRef.current) {
    console.log('❌ Navigation not ready');
    return;
  }
  
  // Wait for navigation to be ready
  if (!navigationRef.current.isReady()) {
    console.log('⏳ Navigation not ready, waiting...');
    setTimeout(() => {
      handleDeepLinkFromNative(url);
    }, 500);
    return;
  }
  
  // ✅ CHECK FOR POST - Handles both https:// and showa://
  // Pattern matches: /post/6, /p/6, /post/123
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
      console.log('✅ ExplorePostDetails navigation dispatched via reset');
    } catch (error) {
      console.error('❌ Failed to navigate:', error);
    }
    return;
  }
  
  // Check for short video
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
      console.log('✅ ShortDetail navigation dispatched via reset');
    } catch (error) {
      console.error('❌ Failed to navigate:', error);
    }
    return;
  }
  
  // Check for user profile
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
      console.log('✅ OtherUserProfile navigation dispatched via reset');
    } catch (error) {
      console.error('❌ Failed to navigate:', error);
    }
    return;
  }
  
  console.log('⚠️ No matching pattern found for URL:', url);
};

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
      // ✅ Check for pending deep link using AsyncStorage
      const hasPendingDeepLink = await AsyncStorage.getItem('pending_deep_link');
      
      if (hasPendingDeepLink) {
        console.log('⏭️ Skipping state restore - pending deep link detected');
        setInitialNavigationState(undefined);
        setIsNavigationReady(true);
        await AsyncStorage.removeItem('pending_deep_link');
        return;
      }
      
      const saved = await loadNavigationState();
      if (saved) {
        const currentRoute = saved.routes?.[saved.index];
        const currentRouteName = currentRoute?.name;
        
        if (currentRouteName && BLOCKED_AUTO_NAVIGATION_SCREENS.includes(currentRouteName)) {
          console.log(`Blocked restoring navigation to blocked screen: ${currentRouteName}`);
          setInitialNavigationState(undefined);
          await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
        } else {
          setInitialNavigationState(saved);
        }
      }
    } else {
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

        <Stack.Screen name="EssentialPlatforms">
          {(p) => <ScreenWrapper><EssentialPlatformsScreen {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="LoginMethod">
          {(p) => <ScreenWrapper><LoginMethod {...p} /></ScreenWrapper>}
        </Stack.Screen>

        <Stack.Screen name="EmailLogin">
          {(p) => <ScreenWrapper><EmailLogin {...p} /></ScreenWrapper>}
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

        <Stack.Screen name="HangoutDetail">
          {(p) => <ScreenWrapper><HangoutDetail {...p} /></ScreenWrapper>}
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





