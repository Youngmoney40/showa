
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';

// const { width, height } = Dimensions.get('window');

// export default function LoginMethodScreen({ navigation }) {
//   const [loading, setLoading] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      
//       <View style={styles.content}>
//         {/* Logo Section */}
//         <View style={styles.logoContainer}>
//           <LinearGradient
//             colors={['#0d64dd', '#0d64dd']}
//             style={styles.logoCircle}
//           >
//             <Icon name="chatbubbles" size={50} color="#fff" />
//           </LinearGradient>
//           <Text style={styles.appName}>Showa</Text>
//           <Text style={styles.tagline}>Connect with friends & family</Text>
//         </View>

//         {/* Login Options */}
//         <View style={styles.optionsContainer}>
//           <Text style={styles.optionsTitle}>Choose login method</Text>
          
//           {/* Phone OTP Option (Existing) */}
//           <TouchableOpacity
//             style={styles.optionButton}
//             onPress={() => navigation.navigate('Signin')}
//             activeOpacity={0.8}
//           >
//             <LinearGradient
//               colors={['#f8f9fa', '#f8f9fa']}
//               style={styles.optionGradient}
//             >
//               <Icon name="phone-portrait-outline" size={24} color="#0d64dd" />
//               <View style={styles.optionTextContainer}>
//                 <Text style={styles.optionTitle}>Continue with Phone</Text>
//                 <Text style={styles.optionSubtitle}>Receive OTP via SMS</Text>
//               </View>
//               <Icon name="chevron-forward" size={20} color="#adb5bd" />
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Email Password Option (NEW) */}
//           <TouchableOpacity
//             style={styles.optionButton}
//             onPress={() => navigation.navigate('EmailLogin')}
//             activeOpacity={0.8}
//           >
//             <LinearGradient
//               colors={['#f8f9fa', '#f8f9fa']}
//               style={styles.optionGradient}
//             >
//               <Icon name="mail-outline" size={24} color="#0d64dd" />
//               <View style={styles.optionTextContainer}>
//                 <Text style={styles.optionTitle}>Continue with Email</Text>
//                 <Text style={styles.optionSubtitle}>Use email and password</Text>
//               </View>
//               <Icon name="chevron-forward" size={20} color="#adb5bd" />
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Sign Up Link */}
//         <View style={styles.signupContainer}>
//           <Text style={styles.signupText}>Don't have an account? </Text>
//           <TouchableOpacity onPress={() => navigation.navigate('EmailRegister')}>
//             <Text style={styles.signupLink}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0a57c2',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: 'space-between',
//   },
//   appName:{
//     color:'#fff'
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginTop: height * 0.12,
//     marginBottom: height * 0.08,
//   },
//   logoCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   appName: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   tagline: {
//     fontSize: 14,
//     color: '#6c757d',
//   },
//   optionsContainer: {
//     flex: 1,
//   },
//   optionsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#6c757d',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   optionButton: {
//     marginBottom: 16,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   optionGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#e1e5eb',
//     borderRadius: 12,
//   },
//   optionTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   optionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 2,
//   },
//   optionSubtitle: {
//     fontSize: 13,
//     color: '#6c757d',
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 24,
//   },
//   signupText: {
//     fontSize: 14,
//     color: '#6c757d',
//   },
//   signupLink: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0d64dd',
//   },
// });

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';

// const { width, height } = Dimensions.get('window');

// export default function LoginMethodScreen({ navigation }) {
//   const [loading, setLoading] = useState(false);
//   const scaleValue = new Animated.Value(1);

//   const handlePressIn = (animation) => {
//     Animated.spring(animation, {
//       toValue: 0.97,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = (animation, navigateTo) => {
//     Animated.spring(animation, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start(() => {
//       navigation.navigate(navigateTo);
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0a57c2" translucent={false} />
      
//       <View style={styles.content}>
//         {/* Logo Section */}
//         <View style={styles.logoContainer}>
//           <LinearGradient
//             colors={['#4facfe', '#00f2fe']}
//             style={styles.logoCircle}
//           >
//             <Icon name="chatbubbles" size={55} color="#fff" />
//           </LinearGradient>
//           <Text style={styles.appName}>Showa</Text>
//           <Text style={styles.tagline}>Connect with friends & family</Text>
//         </View>

//         {/* Login Options */}
//         <View style={styles.optionsContainer}>
//           <View style={styles.titleSection}>
//             <View style={styles.titleLine} />
//             <Text style={styles.optionsTitle}>Welcome Back!</Text>
//             <View style={styles.titleLine} />
//           </View>
//           <Text style={styles.optionsSubtitle}>Choose how you'd like to sign in</Text>
          
//           {/* Phone OTP Option */}
//           <TouchableOpacity
//             activeOpacity={0.8}
//             onPressIn={() => handlePressIn(new Animated.Value(1))}
//             onPressOut={() => handlePressOut(new Animated.Value(1), 'Signin')}
//           >
//             <Animated.View style={[styles.optionButton, { transform: [{ scale: scaleValue }] }]}>
//               <LinearGradient
//                 colors={['#ffffff', '#f8f9fa']}
//                 style={styles.optionGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <View style={styles.iconContainer}>
//                   <LinearGradient
//                     colors={['#4facfe', '#00f2fe']}
//                     style={styles.iconGradient}
//                   >
//                     <Icon name="phone-portrait-outline" size={24} color="#fff" />
//                   </LinearGradient>
//                 </View>
//                 <View style={styles.optionTextContainer}>
//                   <Text style={styles.optionTitle}>Continue with Phone</Text>
//                   <Text style={styles.optionSubtitle}>Receive OTP via SMS</Text>
//                 </View>
//                 <Icon name="chevron-forward" size={22} color="#4facfe" />
//               </LinearGradient>
//             </Animated.View>
//           </TouchableOpacity>

//           {/* Email Password Option */}
//           <TouchableOpacity
//             activeOpacity={0.8}
//             onPressIn={() => handlePressIn(new Animated.Value(1))}
//             onPressOut={() => handlePressOut(new Animated.Value(1), 'EmailLogin')}
//           >
//             <Animated.View style={[styles.optionButton, { transform: [{ scale: scaleValue }] }]}>
//               <LinearGradient
//                 colors={['#ffffff', '#f8f9fa']}
//                 style={styles.optionGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <View style={styles.iconContainer}>
//                   <LinearGradient
//                     colors={['#fa709a', '#fee140']}
//                     style={styles.iconGradient}
//                   >
//                     <Icon name="mail-outline" size={24} color="#fff" />
//                   </LinearGradient>
//                 </View>
//                 <View style={styles.optionTextContainer}>
//                   <Text style={styles.optionTitle}>Continue with Email</Text>
//                   <Text style={styles.optionSubtitle}>Use email and password</Text>
//                 </View>
//                 <Icon name="chevron-forward" size={22} color="#fa709a" />
//               </LinearGradient>
//             </Animated.View>
//           </TouchableOpacity>
//         </View>

//         {/* Sign Up Link */}
//         <View style={styles.signupContainer}>
//           <Text style={styles.signupText}>New to Showa? </Text>
//           <TouchableOpacity onPress={() => navigation.navigate('EmailRegister')}>
//             <Text style={styles.signupLink}>Create Account</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0a57c2',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginTop: height * 0.08,
//     marginBottom: height * 0.06,
//   },
//   logoCircle: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 10,
//   },
//   appName: {
//     fontSize: 42,
//     fontWeight: '800',
//     color: '#ffffff',
//     marginBottom: 8,
//     letterSpacing: 1,
//     textShadowColor: 'rgba(0, 0, 0, 0.1)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   tagline: {
//     fontSize: 15,
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontWeight: '500',
//   },
//   optionsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   titleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   titleLine: {
//     width: 40,
//     height: 2,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     marginHorizontal: 12,
//   },
//   optionsTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#ffffff',
//     textAlign: 'center',
//   },
//   optionsSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.8)',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   optionButton: {
//     marginBottom: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   optionGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 18,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 16,
//   },
//   iconContainer: {
//     marginRight: 15,
//   },
//   iconGradient: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   optionTextContainer: {
//     flex: 1,
//   },
//   optionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   optionSubtitle: {
//     fontSize: 12,
//     color: '#6c757d',
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 30,
//     paddingBottom: 20,
//   },
//   signupText: {
//     fontSize: 15,
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontWeight: '500',
//   },
//   signupLink: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#fff',
//     textDecorationLine: 'underline',
//   },
// });

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   Dimensions,
//   Animated,
//   Image,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const { width, height } = Dimensions.get('window');

// export default function LoginMethodScreen({ navigation }) {
//   const [loading, setLoading] = useState(false);
//   const [phoneScale] = useState(new Animated.Value(1));
//   const [emailScale] = useState(new Animated.Value(1));

//   const handlePressIn = (animation) => {
//     Animated.spring(animation, {
//       toValue: 0.96,
//       useNativeDriver: true,
//       friction: 5,
//       tension: 200,
//     }).start();
//   };

//   const handlePressOut = (animation, navigateTo) => {
//     Animated.spring(animation, {
//       toValue: 1,
//       useNativeDriver: true,
//       friction: 3,
//       tension: 200,
//     }).start(() => {
//       navigation.navigate(navigateTo);
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" translucent={false} />
      
//       <View style={styles.content}>
//         {/* Hero Section with Logo */}
//         <View style={styles.heroSection}>
//           <View style={styles.logoWrapper}>
//             <LinearGradient
//               colors={['#4A90E2', '#357ABD']}
//               style={styles.logoGradient}
//             >
//               <Image
//                 source={require('../../assets/images/showaAppLogo.png')} 
//                 style={styles.logoImage}
//                 resizeMode="contain"
//               />
//             </LinearGradient>
//           </View>
          
//           <Text style={styles.appName}>Showa</Text>
//           <Text style={styles.tagline}>Connect, Share, Engage</Text>
          
//           <View style={styles.decorativeLine}>
//             <View style={styles.line} />
//             <Icon name="heart" size={16} color="rgba(255,255,255,0.5)" />
//             <View style={styles.line} />
//           </View>
//         </View>

//         {/* Welcome Section */}
//         <View style={styles.welcomeSection}>
//           <Text style={styles.welcomeTitle}>Welcome Back</Text>
//           <Text style={styles.welcomeSubtitle}>
//             Choose your preferred way to sign in
//           </Text>
//         </View>

//         {/* Login Options */}
//         <View style={styles.optionsContainer}>
//           {/* Phone OTP Option */}
//           <TouchableOpacity
//             activeOpacity={0.9}
//             onPressIn={() => handlePressIn(phoneScale)}
//             onPressOut={() => handlePressOut(phoneScale, 'Signin')}
//           >
//             <Animated.View style={[styles.optionCard, { transform: [{ scale: phoneScale }] }]}>
//               <LinearGradient
//                 colors={['#ffffff', '#f8f9ff']}
//                 style={styles.cardGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//               >
//                 <View style={styles.cardIconContainer}>
//                   <LinearGradient
//                     colors={['#4A90E2', '#357ABD']}
//                     style={styles.cardIconGradient}
//                   >
//                     <MaterialIcons name="phone-android" size={28} color="#fff" />
//                   </LinearGradient>
//                 </View>
                
//                 <View style={styles.cardContent}>
//                   <Text style={styles.cardTitle}>Phone Number</Text>
//                   <Text style={styles.cardDescription}>
//                     Sign in with OTP via SMS
//                   </Text>
//                 </View>
                
//                 <View style={styles.arrowContainer}>
//                   <Icon name="arrow-forward" size={20} color="#4A90E2" />
//                 </View>
//               </LinearGradient>
//             </Animated.View>
//           </TouchableOpacity>

//           {/* Email Password Option */}
//           <TouchableOpacity
//             activeOpacity={0.9}
//             onPressIn={() => handlePressIn(emailScale)}
//             onPressOut={() => handlePressOut(emailScale, 'EmailLogin')}
//           >
//             <Animated.View style={[styles.optionCard, { transform: [{ scale: emailScale }] }]}>
//               <LinearGradient
//                 colors={['#ffffff', '#fff8f8']}
//                 style={styles.cardGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//               >
//                 <View style={styles.cardIconContainer}>
//                   <LinearGradient
//                     colors={['#E8636F', '#D6454F']}
//                     style={styles.cardIconGradient}
//                   >
//                     <MaterialIcons name="email" size={28} color="#fff" />
//                   </LinearGradient>
//                 </View>
                
//                 <View style={styles.cardContent}>
//                   <Text style={styles.cardTitle}>Email Address</Text>
//                   <Text style={styles.cardDescription}>
//                     Sign in with email & password
//                   </Text>
//                 </View>
                
//                 <View style={styles.arrowContainer}>
//                   <Icon name="arrow-forward" size={20} color="#E8636F" />
//                 </View>
//               </LinearGradient>
//             </Animated.View>
//           </TouchableOpacity>
//         </View>

//         {/* Divider */}
//         <View style={styles.dividerContainer}>
//           <View style={styles.dividerLine} />
//           <Text style={styles.dividerText}>New user?</Text>
//           <View style={styles.dividerLine} />
//         </View>

//         {/* Sign Up Button */}
//         <TouchableOpacity
//           style={styles.signupButton}
//           onPress={() => navigation.navigate('EmailRegister')}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
//             style={styles.signupGradient}
//           >
//             <Text style={styles.signupButtonText}>Create New Account</Text>
//             <Icon name="person-add-outline" size={20} color="#fff" style={styles.signupIcon} />
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <TouchableOpacity>
//             <Text style={styles.footerLink}>Need help?</Text>
//           </TouchableOpacity>
//           <View style={styles.footerDot} />
//           <TouchableOpacity>
//             <Text style={styles.footerLink}>Privacy Policy</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1313f0',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   heroSection: {
//     alignItems: 'center',
//     marginTop: Platform.OS === 'ios' ? 20 : 30,
//     marginBottom: 30,
//   },
//   logoWrapper: {
//     marginBottom: 16,
//     shadowColor: '#4A90E2',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   logoGradient: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   logoImage: {
//     width: 60,
//     height: 60,
//     tintColor: '#fff',
//   },
//   appName: {
//     fontSize: 36,
//     fontWeight: '800',
//     color: '#ffffff',
//     marginBottom: 8,
//     letterSpacing: 1,
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   tagline: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.7)',
//     fontWeight: '500',
//     letterSpacing: 0.5,
//   },
//   decorativeLine: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16,
//     gap: 12,
//   },
//   line: {
//     width: 40,
//     height: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   welcomeSection: {
//     marginBottom: 32,
//   },
//   welcomeTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#ffffff',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   welcomeSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.6)',
//     textAlign: 'center',
//   },
//   optionsContainer: {
//     gap: 16,
//     marginBottom: 32,
//   },
//   optionCard: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   cardGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//   },
//   cardIconContainer: {
//     marginRight: 16,
//   },
//   cardIconGradient: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#1a1a2e',
//     marginBottom: 4,
//   },
//   cardDescription: {
//     fontSize: 13,
//     color: '#666',
//   },
//   arrowContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//   },
//   dividerText: {
//     fontSize: 13,
//     color: 'rgba(255, 255, 255, 0.5)',
//     marginHorizontal: 16,
//     fontWeight: '500',
//   },
//   signupButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     marginBottom: 24,
//   },
//   signupGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     gap: 12,
//   },
//   signupButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#ffffff',
//   },
//   signupIcon: {
//     marginLeft: 4,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 20,
//     gap: 12,
//   },
//   footerLink: {
//     fontSize: 13,
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '500',
//   },
//   footerDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export default function LoginMethodScreen({ navigation }) {
  const [phoneScale] = useState(new Animated.Value(1));
  const [emailScale] = useState(new Animated.Value(1));

  const handlePressIn = (animation) => {
    Animated.spring(animation, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 200,
    }).start();
  };

  const handlePressOut = (animation, navigateTo) => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 200,
    }).start(() => {
      navigation.navigate(navigateTo);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      
      <View style={styles.content}>
        {/* Hero Section with Logo */}
        <View style={styles.heroSection}>
          <View style={styles.logoWrapper}>
            <LinearGradient
              colors={['#0066FF', '#0052CC']}
              style={styles.logoGradient}
            >
              <Image
                source={require('../../assets/images/showaAppLogo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>
          
          
          
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Log in to Showa</Text>
          <Text style={styles.welcomeSubtitle}>
            Choose your preferred way to Log in
          </Text>
        </View>

        {/* Login Options */}
        <View style={styles.optionsContainer}>
          {/* Phone OTP Option */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={() => handlePressIn(phoneScale)}
            onPressOut={() => handlePressOut(phoneScale, 'Signin_two')}
          >
            <Animated.View style={[styles.optionCard, { transform: [{ scale: phoneScale }] }]}>
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  {/* <LinearGradient
                    colors={['#0066FF', '#0052CC']}
                    style={styles.cardIconGradient}
                  >
                    <MaterialIcons name="phone-android" size={28} color="#fff" />
                  </LinearGradient> */}
                </View>
                
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Phone Number</Text>
                  <Text style={styles.cardDescription}>
                    Sign in with OTP via SMS
                  </Text>
                </View>
                
                <View style={styles.arrowContainer}>
                  <Icon name="arrow-forward" size={20} color="#0066FF" />
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* Email Password Option */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={() => handlePressIn(emailScale)}
            onPressOut={() => handlePressOut(emailScale, 'EmailLogin')}
          >
            <Animated.View style={[styles.optionCard, { transform: [{ scale: emailScale }] }]}>
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  {/* <LinearGradient
                    colors={['#dbdbdb', '#d8d7d7']}
                    style={styles.cardIconGradient}
                  >
                    <MaterialIcons name="email" size={22} color="#b6b4b4" />
                  </LinearGradient> */}
                </View>
                
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Email Address</Text>
                  <Text style={styles.cardDescription}>
                    Sign in with email & password
                  </Text>
                </View>
                
                <View style={styles.arrowContainer}>
                  <Icon name="arrow-forward" size={20} color="#0066FF" />
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>New user?</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signupButton,{borderRadius:50}]}
          onPress={() => navigation.navigate('EmailRegister')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#0066FF', '#0052CC']}
            style={styles.signupGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.signupButtonText}>Create New Account</Text>
           
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  heroSection: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 40,
    marginBottom: 20,
  },
  logoWrapper: {
    marginBottom: 20,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    tintColor: '#fff',
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  line: {
    width: 50,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom:10
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  cardIconContainer: {
    marginRight: 16,
  },
  cardIconGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#888888',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    fontSize: 13,
    color: '#999999',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  signupButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signupGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  signupIcon: {
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 20,
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: '#0066FF',
    fontWeight: '500',
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
  },
});