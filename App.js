
// import React, { useEffect, useState, useRef } from "react";
// import { AppState,Platform, View, ActivityIndicator, StatusBar as RNStatusBar } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// // Create navigation ref
// const navigationRef = React.createRef();

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

// // ==================== NAVIGATION SETUP ====================

// const Stack = createNativeStackNavigator();

// const linking = {
//   prefixes: ['showa://'],
//   config: {
//     screens: {
//       AiResetPassword: 'reset-password',
//     },
//   },
// };

// // Screen wrapper - This provides the theme background for ALL screens
// const ScreenWrapper = ({ children }) => {
//   const { colors } = useTheme();
  
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {children}
//     </View>
//   );
// };

// // Main App Component
// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <AppContent />
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// // Main App Content
// function AppContent() {
//   const [userId, setUserId] = useState(null);

//   // Initialize video prefetch when user is logged in
//   useEffect(() => {
//     const initVideoPrefetch = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('userData');
//         if (userData) {
//           const user = JSON.parse(userData);
//           setUserId(user.id);
          
//           // Initialize video prefetch service
//           await videoBackgroundfetch.init(user.id);
          
//           // Get cached videos immediately
//           const cachedVideos = await videoBackgroundfetch.getCachedVideos();
//           console.log('📦 Cached videos ready:', cachedVideos?.length || 0);
//         }
//       } catch (error) {
//         console.error('Error initializing video prefetch:', error);
//       }
//     };

//     initVideoPrefetch();
//   }, []);

// //   useEffect(() => {
// //   const subscription = AppState.addEventListener('change', (nextAppState) => {
// //     if (nextAppState === 'background') {
// //       // Clean up heavy resources when app goes to background
// //       if (Platform.OS === 'android') {
// //         // Clear caches, stop animations, etc.
// //         ImageCache.clear();
// //       }
// //     }
// //   });

// //   return () => {
// //     subscription.remove();
// //   };
// // }, []);
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <CallProvider>
//         <ThemedNavigator />
//         <NetworkStatusBanner />
//       </CallProvider>
//     </GestureHandlerRootView>
//   );
// }

// // Main Navigator with Theme Support
// function ThemedNavigator() {
//   const { theme, colors } = useTheme();
//   const [userId, setUserId] = useState(null);
//   const [appState, setAppState] = useState(AppState.currentState);
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Create custom navigation theme
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
//   }, []);
  
//   const checkPinRequirement = async () => {
//     try {
//       const pinEnabled = await AsyncStorage.getItem('pin_enabled');
//       const token = await AsyncStorage.getItem('userToken');
      
//       if (pinEnabled === 'true' && token) {
//         // Optional: Verify with server that PIN is still valid
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

//   // Load user data
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const uid = await AsyncStorage.getItem("userData");
//         if (uid) {
//           const parsed = JSON.parse(uid);
//           setUserId(parsed.id);
//         }
//       } catch (err) {
//         console.error('Error loading user:', err);
//       }
//     };

//     loadUser();
//   }, []);

//   // Background services
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       if (appState.match(/inactive|background/) && nextAppState === 'active') {
//         backgroundFetchService.forceFetch();
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
//       if (userId) {
//         backgroundFetchService.init();
//         startBackgroundContactSync();
//         setupContactSyncListener();
        
//         setTimeout(() => {
//           backgroundFetchService.forceFetch();
//         }, 2000);
//       }
//     };

//     initializeBackgroundServices();

//     return () => {
//       backgroundFetchService.stop();
//     };
//   }, [userId]);

//   useEffect(() => {
//     startBackgroundContactSync();
//     setupContactSyncListener();
//   }, []);

//   // Don't render navigation until we've checked PIN
//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer 
//       ref={navigationRef}
//       linking={linking}
//       theme={customTheme}
//     >
//       <RNStatusBar 
//         barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background}
//       />

//       {/* PIN Unlock Modal - Placed outside Stack.Navigator to overlay everything */}
//       <PinUnlockModal 
//         visible={showPinModal}
//         onClose={() => setShowPinModal(false)}
//         navigation={navigationRef.current} // Pass navigation ref's current value
//       />
      
//       <Stack.Navigator
//         initialRouteName="Loginscreen"
//         screenOptions={{ 
//           headerShown: false,
//           contentStyle: { backgroundColor: colors.background }
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
      
//       {/* CallSignalListener needs to be inside NavigationContainer */}
//       {userId && <CallSignalListener userId={userId} />}
//     </NavigationContainer>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import { 
  AppState, 
  Platform, 
  View, 
  ActivityIndicator, 
  StatusBar as RNStatusBar,
  InteractionManager,
  Image,
  NativeModules,
  LogBox
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create navigation ref
const navigationRef = React.createRef();

// Ignore specific warnings
LogBox.ignoreLogs([
  'new NativeEventEmitter',
  'Require cycle:',
  'VirtualizedLists should never be nested',
]);

// Import checkPinStatus from the correct location
import { checkPinStatus } from './showa_personal_account_screen/FaceSecuritySetting';
import PinUnlockModal from './screens/PinUnlockModal';
import videoBackgroundfetch from './src/services/VideoBackgroundFetch';

// Theme Context
import { ThemeProvider } from './src/context/ThemeContext';

// Import useTheme here (BEFORE using it in components)
import { useTheme } from './src/context/ThemeContext';

// Components & Context
import { CallProvider } from './components/CallContext';
import CallSignalListener from "./components/CallSignalListener";
import IncomingCallModal from './components/IncomingCallModal';

import NetworkStatusBanner from "./components/Networkstatusbanner";

// Services
import { startBackgroundContactSync, setupContactSyncListener } from "./components/BackgroundSync";
import backgroundFetchService from "./src/services/BackgroundFetchService";

// ==================== SCREEN IMPORTS ====================

// Authentication & Onboarding Screens
import Loginscreen from './screens/Loginscreen';
import Signin from './screens/onboard/SignIn';
import Signin_two from './screens/onboard/SignIn2_two';
import TermsCondition from './screens/onboard/Terms';
import PrivacyPolicy from './screens/onboard/PrivacyPolicy';
import Register from './screens/onboard/Register';
import Biometric from './screens/onboard/Biometric';
import LinkingScreen from './screens/onboard/LinkingScreen';
import VerificationCode from "./screens/onboard/VerifyEmail";
import ProceedOptions from './screens/ProceedOptions';
import Terms from './screens/TermsPrivacyScreen';

// Personal Account Screens
import PHome from './showa_personal_account_screen/PHome';
import UserPersonalAccountProfile from './screens/profiles/UserPersonalAccountProfile';
import PStatusBar from './showa_personal_account_screen/StatusBar';
import StatusEditorScreen from './showa_personal_account_screen/StatusEditorScreen';
import JoinChannel from './showa_personal_account_screen/JoinChannel';
import Calls from './showa_personal_account_screen/Calls';
import CallOngoingScreen from './showa_personal_account_screen/CallOngoingScreen';
import Settings from './showa_personal_account_screen/Settings';
import NotificationSetting from './showa_personal_account_screen/NotificationSetting';
import WallpaperSetting from './showa_personal_account_screen/WallpaperSetting';
import FaceSecuritySetting from './showa_personal_account_screen/FaceSecuritySetting';
import PrivateChat from './showa_personal_account_screen/PrivateChat';

// Business Account Screens
import ChannelDetails from './showa_business/ChannelDetails';
import BusinessHome from './showa_business/Home';
import ChatAi from './showa_business/ChatAi';
import MonetizationRequestForm from './showa_business/MonetizationRequestForm';
import BUserProfile from './showa_business/UserProfile';
import BStatusBar from './showa_business/StatusBar';
import BStatusEditorScreen from './showa_business/StatusEditorScreen';
import BJoinChannel from './showa_business/JoinChannel';
import BCalls from './showa_business/Calls';
import BCallOngoingScreen from './showa_business/CallOngoingScreen';
import BSettings from './showa_business/Settings';
import BNotificationSetting from './showa_business/NotificationSetting';
import BWallpaperSetting from './showa_business/WallpaperSetting';
import BFaceSecuritySetting from './showa_business/FaceSecuritySetting';
import ToolsScreen from './showa_business/ToolsScreen';
import QuickReplies from './showa_business/QuickReplies';
import AddQuickReply from './showa_business/AddQuickReply';
import EssentialPlatformsScreen from './showa_business/EssentialPlatformsScreen';
import Advertise from './showa_business/Advertise';
import ManageProfile from './showa_business/ManageProfile';
import CreateCatalog from './showa_business/CreateCatalog';
import AddItemToCatalog from './showa_business/AddItemToCatalog';
import Explore from './showa_business/Explore';
import LabelChats from './showa_business/LabelChatsScreen';
import Labels from './showa_business/LabelsScreen';
import AddQuickReplyScreen from './showa_business/AddQuickReplyScreen';
import GreetingMessage from './showa_business/GreetingMessage';
import AwayMessage from './showa_business/AwayMessageScreen';
import HelpCenter from './showa_business/HelpCenterScreen';
import HelpTopic from './showa_business/HelpTopicScreen';
import BusinessSetup from './showa_business/BusinessSetupScreen';
import ProductDetails from './showa_business/ProductDetailsScreen';
import Cart from './showa_business/CartScreen';
import ChannelAdminManagement from './showa_business/ChannelAdminManagement';
import EmptyCart from './showa_business/EmptyCartScreen';
import OoshBusiness from './showa_business/OoshBusinessScreen';
import Live from './showa_business/LiveScreen';
import Broadcast from './showa_business/Broadcast';
import OfficialSearch from './showa_business/OfficialSearchScreen';
import CreateChannel from './showa_business/CreateChannel';
import InviteChannelLink from './showa_business/InviteChannelLink';
import Supplyrequest from './showa_business/SupplyRequest';
import SupplyRequestForm from './showa_business/SupplyRequestForm';
import SupplyServices from './showa_business/SupplyServices';
import SupplyRequestDetail from './showa_business/SupplyRequestDetail';
import CreateServices from './showa_business/CreateServices';
import SupplyRequestDetailScreen from './showa_business/SupplyRequestDetailScreen';
import BroadcastHome from './showa_business/BroadcastHome';
import CreateBroadcastPost from './showa_business/CreateBroadcastPost';
import ReportPost from './showa_business/ReportPost';
import BroadcastUserProfile from './showa_business/BroadcastUserProfile';
import MarketPlace from './showa_business/MarketPlace';
import CreateListing from './showa_business/CreateListing';
import ListingDetails from './showa_business/ListingDetails';
import SuggestedFollowers from './showa_business/SuggestedFollowers';
import ManagePost from './showa_business/ManagePost';
import CreatorDashboard from './showa_business/CreatorDashboardScreen';
import ContractHome from './showa_business/contracts/ContractHome';
import CreateAdForm from './showa_business/ads/CreateAdFormScreen';
import AdReview from './showa_business/ads/AdReview';
import BroadcastSuccess from './showa_business/BroadcastSuccess';
import AllProducts from './showa_business/AllProducts';
import OtherUserCatalog from './showa_business/OthersUserCatalog';
import OtherUserCatalogDetail from './showa_business/OtherUserCatalogDetail';
import BPrivateChat from './showa_business/BusinessChat';
import BusinessGroupChat from './showa_business/BusinessGroupChat';
import SupplierNotificationScreen from './showa_business/SupplierNotificationScreen';
import RequesterPostHistory from './showa_business/RequesterPostHistory';
import GroupMembers from './showa_business/GroupMembers';

// Social Media Screens
import SocialHome from './showa_social/Home';
import Discover from './showa_social/Discover';
import UploadshortVideo from './showa_social/UploadshortVideo';
import SearchShort from './showa_social/SearchShort';

// Feature Components
import GroupCreate from './screens/GroupCreate';
import GroupConnect from './screens/GroupConnect';
import UserContactListPersonalAccount from './components/UserContactListPersonalAccount';
import Music from './components/Music';
import UserContactList from './components/UserContactList';
import SyncMessagePersonal from './components/SyncMessagePersonal';
import SyncContactForBusiness from './components/SyncContactForBusiness';
import CameraScreen from './components/CameraScreen';
import SongsList from './components/SongsListScreen';
import NewCommunity from './components/NewCommunityScreen';
import VideoCalls from './components/VideoCalls';
import VoiceCalls from './components/VoiceCalls';
import GoLive from './components/GoLive';
import LiveStream from './components/LiveStream';
import ContactUs from './components/ContactUs';
import SuccessStory from './components/SuccessStory';
import OtherUserProfile from "./screens/profiles/OtherUserProfile";
import EarningDashbord from "./screens/earning/EarningDashbord";
import WithdrawEarning from "./screens/earning/WithdrawEarning";
import PurchaseData from "./screens/earning/PurchaseData";
import NinRegisterEarning from "./screens/earning/NinRegisterEarning";
import VideoAds from "./screens/earning/VideoAds";
import EarningWallet from "./screens/earning/EarningWallet";
import SynMessage from './components/SynMessage';
import SyncContactPersonal from './components/UserContactPersonal';
import LiveStreaming from "./src/LiveStreaming";
import GlobalIssueReport from "./components/GlobalIssueReport";
import NewsList from "./components/NewsList";
import Broadcaster from "./src/Broadcaster";
import Viewer from "./src/Viewer";

// ==================== HELPER FUNCTIONS ====================

// Clear image cache helper function
const clearImageCache = async () => {
  try {
    if (Platform.OS === 'android') {
      // Clear React Native's image cache using Image.queryCache
      Image.queryCache && Image.queryCache([], (cacheResponse) => {
        if (cacheResponse && Object.keys(cacheResponse).length > 0) {
          const urls = Object.keys(cacheResponse);
          console.log(`Found ${urls.length} cached images to clear`);
        }
      });
    }
    
    // Clear in-memory image cache by setting a flag
    global.__imageCacheCleared = Date.now();
    
    console.log('✅ Image cache cleared');
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
};

// Clear WebView cache helper
const clearWebViewCache = async () => {
  try {
    if (Platform.OS === 'android') {
      // Clear WebView cache using native module if available
      const { WebViewManager } = NativeModules;
      if (WebViewManager && WebViewManager.clearCache) {
        await WebViewManager.clearCache();
      }
    }
  } catch (error) {
    console.error('Error clearing WebView cache:', error);
  }
};

// Clear all caches helper
const clearAllCaches = async () => {
  try {
    await clearImageCache();
    await clearWebViewCache();
    
    // Clear AsyncStorage temporary data if needed
    const allKeys = await AsyncStorage.getAllKeys();
    const keysToClear = allKeys.filter(key => 
      key.includes('temp_') || 
      key.includes('cache_') || 
      key.includes('_preview') ||
      key.includes('video_cache_')
    );
    
    if (keysToClear.length > 0) {
      await AsyncStorage.multiRemove(keysToClear);
      console.log(`Cleared ${keysToClear.length} temporary cache items`);
    }
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
};

// Free up memory helper
const freeMemory = () => {
  if (Platform.OS === 'android') {
    try {
      // Suggest garbage collection (only works in debug builds)
      if (global.gc) {
        global.gc();
      }
      
      // Clear any large objects from memory
      if (global.__largeImageCache) {
        delete global.__largeImageCache;
      }
      
      // Clear video prefetch cache if too large
      if (global.__videoPrefetchCache) {
        delete global.__videoPrefetchCache;
      }
      
      console.log('✅ Memory cleanup triggered');
    } catch (error) {
      console.error('Error freeing memory:', error);
    }
  }
};

// Stop WebRTC connections helper
const stopWebRTCConnections = () => {
  try {
    // If you have WebRTC connections stored globally, clean them up
    if (global.__activeWebRTCConnections && global.__activeWebRTCConnections.length > 0) {
      global.__activeWebRTCConnections.forEach(connection => {
        if (connection && connection.close) {
          try {
            connection.close();
          } catch (e) {
            console.error('Error closing WebRTC connection:', e);
          }
        }
      });
      global.__activeWebRTCConnections = [];
      console.log('✅ WebRTC connections closed');
    }
  } catch (error) {
    console.error('Error stopping WebRTC connections:', error);
  }
};

// Pause video playback helper
const pauseAllVideos = () => {
  try {
    // If you have video refs stored globally
    if (global.__activeVideoRefs && global.__activeVideoRefs.length > 0) {
      global.__activeVideoRefs.forEach(videoRef => {
        if (videoRef && videoRef.current && typeof videoRef.current.pause === 'function') {
          videoRef.current.pause();
        }
      });
      console.log(`✅ Paused ${global.__activeVideoRefs.length} videos`);
    }
  } catch (error) {
    console.error('Error pausing videos:', error);
  }
};

// Stop background services
const stopBackgroundServices = () => {
  try {
    if (global.__backgroundSyncInterval) {
      clearInterval(global.__backgroundSyncInterval);
      global.__backgroundSyncInterval = null;
    }
    
    if (global.__contactSyncListener && global.__contactSyncListener.remove) {
      global.__contactSyncListener.remove();
      global.__contactSyncListener = null;
    }
    
    backgroundFetchService.stop();
    console.log('✅ Background services stopped');
  } catch (error) {
    console.error('Error stopping background services:', error);
  }
};

// ==================== LINKING CONFIG ====================

const linking = {
  prefixes: ['showa://'],
  config: {
    screens: {
      AiResetPassword: 'reset-password',
    },
  },
};

// ==================== NAVIGATION SETUP ====================

const Stack = createNativeStackNavigator();

// Screen wrapper - This provides the theme background for ALL screens
const ScreenWrapper = ({ children }) => {
  const { colors } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </View>
  );
};

// ==================== MAIN APP COMPONENT ====================

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// ==================== APP CONTENT ====================

function AppContent() {
  const [userId, setUserId] = useState(null);
  const backgroundTimerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // Initialize video prefetch when user is logged in
  useEffect(() => {
    const initVideoPrefetch = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
          
          // Initialize video prefetch service
          await videoBackgroundfetch.init(user.id);
          
          // Get cached videos immediately
          const cachedVideos = await videoBackgroundfetch.getCachedVideos();
          console.log('📦 Cached videos ready:', cachedVideos?.length || 0);
        }
      } catch (error) {
        console.error('Error initializing video prefetch:', error);
      }
    };

    initVideoPrefetch();
    
    // Cleanup on unmount
    return () => {
      if (backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
      }
      stopBackgroundServices();
    };
  }, []);
  
  // Enhanced background cleanup for Android 15 and Xiaomi devices
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      const currentState = appStateRef.current;
      
      if (currentState === 'active' && nextAppState === 'background') {
        console.log('📱 App going to background - cleaning up resources');
        
        // Clean up heavy resources when app goes to background
        if (Platform.OS === 'android') {
          // Immediate cleanup for critical resources
          pauseAllVideos();
          stopWebRTCConnections();
          
          // Delay cache cleanup to not block app state change
          setTimeout(() => {
            clearAllCaches();
            freeMemory();
            
            // Cancel any pending network requests
            if (global.__pendingRequests && global.__pendingRequests.length > 0) {
              global.__pendingRequests.forEach((request, index) => {
                if (request && request.cancel) {
                  request.cancel();
                }
              });
              global.__pendingRequests = [];
            }
          }, 500);
          
          // Set a timer to clear more resources after 30 seconds in background
          if (backgroundTimerRef.current) {
            clearTimeout(backgroundTimerRef.current);
          }
          
          backgroundTimerRef.current = setTimeout(() => {
            console.log('🕐 30 seconds in background - deep cleanup');
            freeMemory();
            // Stop background services to save battery
            if (global.__backgroundServicesRunning) {
              stopBackgroundServices();
              global.__backgroundServicesRunning = false;
            }
          }, 30000);
        }
      } else if (currentState === 'background' && nextAppState === 'active') {
        console.log('📱 App coming to foreground - restoring resources');
        
        // Clear the background timer
        if (backgroundTimerRef.current) {
          clearTimeout(backgroundTimerRef.current);
          backgroundTimerRef.current = null;
        }
        
        // Restart background services if needed
        if (!global.__backgroundServicesRunning && userId) {
          InteractionManager.runAfterInteractions(() => {
            backgroundFetchService.init();
            startBackgroundContactSync();
            setupContactSyncListener();
            global.__backgroundServicesRunning = true;
          });
        }
        
        // Optionally reload some data
        InteractionManager.runAfterInteractions(() => {
          console.log('✅ App resumed');
        });
      }
      
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
      }
    };
  }, [userId]);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CallProvider>
        <ThemedNavigator />
        <NetworkStatusBanner />
      </CallProvider>
    </GestureHandlerRootView>
  );
}

// ==================== THEMED NAVIGATOR ====================

function ThemedNavigator() {
  const { theme, colors } = useTheme();
  const [userId, setUserId] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create custom navigation theme
  const customTheme = {
    dark: theme === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface || colors.card || colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900',
      },
    },
  };

  useEffect(() => {
    checkPinRequirement();
    
    // Initialize global tracking objects
    if (!global.__activeWebRTCConnections) {
      global.__activeWebRTCConnections = [];
    }
    if (!global.__activeVideoRefs) {
      global.__activeVideoRefs = [];
    }
    if (!global.__pendingRequests) {
      global.__pendingRequests = [];
    }
    if (!global.__backgroundServicesRunning) {
      global.__backgroundServicesRunning = true;
    }
  }, []);
  
  const checkPinRequirement = async () => {
    try {
      const pinEnabled = await AsyncStorage.getItem('pin_enabled');
      const token = await AsyncStorage.getItem('userToken');
      
      if (pinEnabled === 'true' && token) {
        // Optional: Verify with server that PIN is still valid
        const status = await checkPinStatus(token);
        if (status && status.has_pin) {
          setShowPinModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking PIN requirement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = await AsyncStorage.getItem("userData");
        if (uid) {
          const parsed = JSON.parse(uid);
          setUserId(parsed.id);
        }
      } catch (err) {
        console.error('Error loading user:', err);
      }
    };

    loadUser();
  }, []);

  // Background services with proper cleanup
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        if (global.__backgroundServicesRunning) {
          backgroundFetchService.forceFetch();
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const initializeBackgroundServices = async () => {
      if (userId && global.__backgroundServicesRunning) {
        backgroundFetchService.init();
        startBackgroundContactSync();
        setupContactSyncListener();
        
        setTimeout(() => {
          backgroundFetchService.forceFetch();
        }, 2000);
      }
    };

    initializeBackgroundServices();

    return () => {
      // Don't stop services here to allow them to run in background
      // They will be stopped by AppContent when needed
    };
  }, [userId]);

  // Don't render navigation until we've checked PIN
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer 
      ref={navigationRef}
      linking={linking}
      theme={customTheme}
    >
      <RNStatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* PIN Unlock Modal - Placed outside Stack.Navigator to overlay everything */}
      <PinUnlockModal 
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        navigation={navigationRef.current}
      />
      
      <Stack.Navigator
        initialRouteName="Loginscreen"
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {/* ==================== AUTHENTICATION FLOW ==================== */}
        <Stack.Screen name="Loginscreen">
          {(props) => (
            <ScreenWrapper>
              <Loginscreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Signin">
          {(props) => (
            <ScreenWrapper>
              <Signin {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Signin_two">
          {(props) => (
            <ScreenWrapper>
              <Signin_two {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Register">
          {(props) => (
            <ScreenWrapper>
              <Register {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="OtherUserCatalog">
          {(props) => (
            <ScreenWrapper>
              <OtherUserCatalog {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="OtherUserCatalogDetail">
          {(props) => (
            <ScreenWrapper>
              <OtherUserCatalogDetail {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="VerificationCode">
          {(props) => (
            <ScreenWrapper>
              <VerificationCode {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="LinkingScreen">
          {(props) => (
            <ScreenWrapper>
              <LinkingScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Biometric">
          {(props) => (
            <ScreenWrapper>
              <Biometric {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ProceedOptions">
          {(props) => (
            <ScreenWrapper>
              <ProceedOptions {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="GroupMembers">
          {(props) => (
            <ScreenWrapper>
              <GroupMembers {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Terms">
          {(props) => (
            <ScreenWrapper>
              <Terms {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="TermsCondition">
          {(props) => (
            <ScreenWrapper>
              <TermsCondition {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="PrivacyPolicy">
          {(props) => (
            <ScreenWrapper>
              <PrivacyPolicy {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        {/* ==================== PERSONAL ACCOUNT FLOW ==================== */}
        <Stack.Screen name="PHome">
          {(props) => (
            <ScreenWrapper>
              <PHome {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="UserPersonalAccountProfile">
          {(props) => (
            <ScreenWrapper>
              <UserPersonalAccountProfile {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="SyncContactForBusiness">
          {(props) => (
            <ScreenWrapper>
              <SyncContactForBusiness {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        <Stack.Screen name="PStatusBar">
          {(props) => (
            <ScreenWrapper>
              <PStatusBar {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="StatusEditorScreen">
          {(props) => (
            <ScreenWrapper>
              <StatusEditorScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="JoinChannel">
          {(props) => (
            <ScreenWrapper>
              <JoinChannel {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Calls">
          {(props) => (
            <ScreenWrapper>
              <Calls {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CallOngoingScreen">
          {(props) => (
            <ScreenWrapper>
              <CallOngoingScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Settings">
          {(props) => (
            <ScreenWrapper>
              <Settings {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="NotificationSetting">
          {(props) => (
            <ScreenWrapper>
              <NotificationSetting {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="WallpaperSetting">
          {(props) => (
            <ScreenWrapper>
              <WallpaperSetting {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="FaceSecuritySetting">
          {(props) => (
            <ScreenWrapper>
              <FaceSecuritySetting {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        <Stack.Screen name="PrivateChat">
          {(props) => (
            <ScreenWrapper>
              <PrivateChat {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        {/* ==================== BUSINESS ACCOUNT FLOW ==================== */}
        <Stack.Screen name="BusinessHome">
          {(props) => (
            <ScreenWrapper>
              <BusinessHome {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ChannelDetails">
          {(props) => (
            <ScreenWrapper>
              <ChannelDetails {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ChannelAdminManagement">
          {(props) => (
            <ScreenWrapper>
              <ChannelAdminManagement {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BUserProfile">
          {(props) => (
            <ScreenWrapper>
              <BUserProfile {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BStatusBar">
          {(props) => (
            <ScreenWrapper>
              <BStatusBar {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BStatusEditorScreen">
          {(props) => (
            <ScreenWrapper>
              <BStatusEditorScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BJoinChannel">
          {(props) => (
            <ScreenWrapper>
              <BJoinChannel {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BCalls">
          {(props) => (
            <ScreenWrapper>
              <BCalls {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BCallOngoingScreen">
          {(props) => (
            <ScreenWrapper>
              <BCallOngoingScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BSettings">
          {(props) => (
            <ScreenWrapper>
              <BSettings {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BNotificationSetting">
          {(props) => (
            <ScreenWrapper>
              <BNotificationSetting {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BWallpaperSetting">
          {(props) => (
            <ScreenWrapper>
              <BWallpaperSetting {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BFaceSecuritySetting">
          {(props) => (
            <ScreenWrapper>
              <BFaceSecuritySetting {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ToolsScreen">
          {(props) => (
            <ScreenWrapper>
              <ToolsScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="QuickReplies">
          {(props) => (
            <ScreenWrapper>
              <QuickReplies {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="AddQuickReply">
          {(props) => (
            <ScreenWrapper>
              <AddQuickReply {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="EssentialPlatforms">
          {(props) => (
            <ScreenWrapper>
              <EssentialPlatformsScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Advertise">
          {(props) => (
            <ScreenWrapper>
              <Advertise {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ManageProfile">
          {(props) => (
            <ScreenWrapper>
              <ManageProfile {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CreateCatalog">
          {(props) => (
            <ScreenWrapper>
              <CreateCatalog {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Explore">
          {(props) => (
            <ScreenWrapper>
              <Explore {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="AddItemToCatalog">
          {(props) => (
            <ScreenWrapper>
              <AddItemToCatalog {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="LabelChats">
          {(props) => (
            <ScreenWrapper>
              <LabelChats {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Labels">
          {(props) => (
            <ScreenWrapper>
              <Labels {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="AddQuickReplyScreen">
          {(props) => (
            <ScreenWrapper>
              <AddQuickReplyScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="GreetingMessage">
          {(props) => (
            <ScreenWrapper>
              <GreetingMessage {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="AwayMessage">
          {(props) => (
            <ScreenWrapper>
              <AwayMessage {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="HelpCenter">
          {(props) => (
            <ScreenWrapper>
              <HelpCenter {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="HelpTopic">
          {(props) => (
            <ScreenWrapper>
              <HelpTopic {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BusinessSetup">
          {(props) => (
            <ScreenWrapper>
              <BusinessSetup {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ProductDetails">
          {(props) => (
            <ScreenWrapper>
              <ProductDetails {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Cart">
          {(props) => (
            <ScreenWrapper>
              <Cart {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="EmptyCart">
          {(props) => (
            <ScreenWrapper>
              <EmptyCart {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Broadcast">
          {(props) => (
            <ScreenWrapper>
              <Broadcast {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="OfficialSearch">
          {(props) => (
            <ScreenWrapper>
              <OfficialSearch {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Live">
          {(props) => (
            <ScreenWrapper>
              <Live {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="OoshBusiness">
          {(props) => (
            <ScreenWrapper>
              <OoshBusiness {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CreateChannel">
          {(props) => (
            <ScreenWrapper>
              <CreateChannel {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="InviteChannelLink">
          {(props) => (
            <ScreenWrapper>
              <InviteChannelLink {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Supplyrequest">
          {(props) => (
            <ScreenWrapper>
              <Supplyrequest {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SupplyRequestForm">
          {(props) => (
            <ScreenWrapper>
              <SupplyRequestForm {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SupplyServices">
          {(props) => (
            <ScreenWrapper>
              <SupplyServices {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SupplyRequestDetail">
          {(props) => (
            <ScreenWrapper>
              <SupplyRequestDetail {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CreateServices">
          {(props) => (
            <ScreenWrapper>
              <CreateServices {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SupplyRequestDetailScreen">
          {(props) => (
            <ScreenWrapper>
              <SupplyRequestDetailScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BroadcastHome">
          {(props) => (
            <ScreenWrapper>
              <BroadcastHome {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CreateBroadcastPost">
          {(props) => (
            <ScreenWrapper>
              <CreateBroadcastPost {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ReportPost">
          {(props) => (
            <ScreenWrapper>
              <ReportPost {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BroadcastUserProfile">
          {(props) => (
            <ScreenWrapper>
              <BroadcastUserProfile {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="MarketPlace">
          {(props) => (
            <ScreenWrapper>
              <MarketPlace {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CreateListing">
          {(props) => (
            <ScreenWrapper>
              <CreateListing {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ListingDetails">
          {(props) => (
            <ScreenWrapper>
              <ListingDetails {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SuggestedFollowers">
          {(props) => (
            <ScreenWrapper>
              <SuggestedFollowers {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ManagePost">
          {(props) => (
            <ScreenWrapper>
              <ManagePost {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CreatorDashboard">
          {(props) => (
            <ScreenWrapper>
              <CreatorDashboard {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="MonetizationRequestForm">
          {(props) => (
            <ScreenWrapper>
              <MonetizationRequestForm {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ChatAi">
          {(props) => (
            <ScreenWrapper>
              <ChatAi {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ContractHome">
          {(props) => (
            <ScreenWrapper>
              <ContractHome {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CreateAdForm">
          {(props) => (
            <ScreenWrapper>
              <CreateAdForm {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="AdReview">
          {(props) => (
            <ScreenWrapper>
              <AdReview {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="BroadcastSuccess">
          {(props) => (
            <ScreenWrapper>
              <BroadcastSuccess {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="AllProducts">
          {(props) => (
            <ScreenWrapper>
              <AllProducts {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        <Stack.Screen name="RequesterPostHistory">
          {(props) => (
            <ScreenWrapper>
              <RequesterPostHistory {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen> 
        
        <Stack.Screen name="BusinessGroupChat">
          {(props) => (
            <ScreenWrapper>
              <BusinessGroupChat {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen> 
        
        <Stack.Screen name="SupplierNotificationScreen">
          {(props) => (
            <ScreenWrapper>
              <SupplierNotificationScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen> 
        
        <Stack.Screen name="BPrivateChat">
          {(props) => (
            <ScreenWrapper>
              <BPrivateChat {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen> 
        
        <Stack.Screen name="EarningWallet">
          {(props) => (
            <ScreenWrapper>
              <EarningWallet {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        <Stack.Screen name="NinRegisterEarning">
          {(props) => (
            <ScreenWrapper>
              <NinRegisterEarning {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        <Stack.Screen name="PurchaseData">
          {(props) => (
            <ScreenWrapper>
              <PurchaseData {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="EarningDashbord">
          {(props) => (
            <ScreenWrapper>
              <EarningDashbord {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="WithdrawEarning">
          {(props) => (
            <ScreenWrapper>
              <WithdrawEarning {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="VideoAds">
          {(props) => (
            <ScreenWrapper>
              <VideoAds {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        {/* ==================== SOCIAL MEDIA FLOW ==================== */}
        <Stack.Screen name="SocialHome">
          {(props) => (
            <ScreenWrapper>
              <SocialHome {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Discover">
          {(props) => (
            <ScreenWrapper>
              <Discover {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="UploadshortVideo">
          {(props) => (
            <ScreenWrapper>
              <UploadshortVideo {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SearchShort">
          {(props) => (
            <ScreenWrapper>
              <SearchShort {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        {/* ==================== FEATURE SCREENS ==================== */}
        <Stack.Screen name="Music">
          {(props) => (
            <ScreenWrapper>
              <Music {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="GroupCreate">
          {(props) => (
            <ScreenWrapper>
              <GroupCreate {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="GroupConnect">
          {(props) => (
            <ScreenWrapper>
              <GroupConnect {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="UserContactList">
          {(props) => (
            <ScreenWrapper>
              <UserContactList {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SynMessage">
          {(props) => (
            <ScreenWrapper>
              <SynMessage {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SyncContactPersonal">
          {(props) => (
            <ScreenWrapper>
              <SyncContactPersonal {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="UserContactListPersonalAccount">
          {(props) => (
            <ScreenWrapper>
              <UserContactListPersonalAccount {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SyncMessagePersonal">
          {(props) => (
            <ScreenWrapper>
              <SyncMessagePersonal {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="CameraScreen">
          {(props) => (
            <ScreenWrapper>
              <CameraScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SongsList">
          {(props) => (
            <ScreenWrapper>
              <SongsList {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="NewCommunity">
          {(props) => (
            <ScreenWrapper>
              <NewCommunity {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="VideoCalls">
          {(props) => (
            <ScreenWrapper>
              <VideoCalls {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="VoiceCalls">
          {(props) => (
            <ScreenWrapper>
              <VoiceCalls {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="GoLive">
          {(props) => (
            <ScreenWrapper>
              <GoLive {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="LiveStream">
          {(props) => (
            <ScreenWrapper>
              <LiveStream {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="ContactUs">
          {(props) => (
            <ScreenWrapper>
              <ContactUs {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="SuccessStory">
          {(props) => (
            <ScreenWrapper>
              <SuccessStory {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="OtherUserProfile">
          {(props) => (
            <ScreenWrapper>
              <OtherUserProfile {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="LiveStreaming">
          {(props) => (
            <ScreenWrapper>
              <LiveStreaming {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="GlobalIssueReport">
          {(props) => (
            <ScreenWrapper>
              <GlobalIssueReport {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="NewsList">
          {(props) => (
            <ScreenWrapper>
              <NewsList {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Broadcaster">
          {(props) => (
            <ScreenWrapper>
              <Broadcaster {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Viewer">
          {(props) => (
            <ScreenWrapper>
              <Viewer {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        {/* ==================== MODAL SCREENS ==================== */}
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
      
      {/* CallSignalListener needs to be inside NavigationContainer */}
      {userId && <CallSignalListener userId={userId} />}
    </NavigationContainer>
  );
}
