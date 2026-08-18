

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Linking,
//   ScrollView,
//   Animated,
//   StatusBar,
//   Dimensions,
//   FlatList,
//   BackHandler,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../src/context/ThemeContext';
// import { useFocusEffect } from '@react-navigation/native';

// const { width } = Dimensions.get('window');
// const BANNER_IMAGE = require('../assets/images/dad.jpg');

// const BrandApp = ({ navigation }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBrand, setSelectedBrand] = useState(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const brandsScrollViewRef = useRef(null);
//   const scrollInterval = useRef(null);
//   const isMountedRef = useRef(true);
  
//   const { colors, isDark } = useTheme();

//   // All brands data - static
//   const allBrands = [
//     { name: 'e-Direct', icon: 'book-open-outline', color: '#2563EB', url: 'https://edirect.ng', description: 'No 1 nigeria largest directory in africa' },
//     { name: 'e-Jobs', icon: 'briefcase-outline', color: '#84CC16', url: 'https://ejobs.com', description: 'Recruitment platform' },
//     { name: 'e-Store', icon: 'store-outline', color: '#64748B', url: 'https://estore.com', description: 'Online marketplace' },
//     { name: 'e-Deal', icon: 'tag-outline', color: '#F59E0B', url: 'https://edeal.com', description: 'Daily deals platform' },
//     { name: 'e-Ride', icon: 'car-outline', color: '#06B6D4', url: 'https://eride.com', description: 'Transportation service' },
//     { name: 'e-Plan', icon: 'calendar-month-outline', color: '#EC4899', url: 'https://eplan.com', description: 'Event planning tool' },
//     { name: 'e-Farm', icon: 'sprout-outline', color: '#10B981', url: 'https://efarm.com', description: 'Agricultural marketplace' },
//     { name: 'eHangout', icon: 'account-group-outline', color: '#8B5CF6', url: 'https://ehangout.com', description: 'Social platform' },
//     { name: 'e-Wallet', icon: 'wallet-outline', color: '#F97316', url: 'https://ewallet.com', description: 'Payment solution' },
//     { name: 'Showa', icon: 'video-outline', color: '#EF4444', url: 'https://showapp.ng', description: 'Live streaming platform' },
//     { name: 'EBNB Hotel', icon: 'bed-outline', color: '#8B5CF6', url: 'https://showa.com', description: 'Hotel management software' },
//     { name: 'Essential News', icon: 'newspaper-variant-outline', color: '#2563EB', url: 'https://showa.com', description: 'News platform and blogging' },
//     { name: 'E-Hotels', icon: 'office-building-outline', color: '#DC2626', url: 'https://showa.com', description: 'Hotels system management' },
//     { name: 'E-apartment', icon: 'home-outline', color: '#059669', url: 'https://showa.com', description: 'Apartment booking website' },
//     { name: 'HRMS', icon: 'account-tie-outline', color: '#7C3AED', url: 'https://showa.com', description: 'HR Management System' },
//     { name: 'E-Medicals', icon: 'hospital-box-outline', color: '#DB2777', url: 'https://showa.com', description: 'Hospital Management System' },
//     { name: 'E-Shortstay', icon: 'clock-time-three-outline', color: '#EA580C', url: 'https://showa.com', description: 'Hourly booking' },
//     { name: 'Oosh-Mail', icon: 'email-outline', color: '#0891B2', url: 'https://ooshmail.com', description: 'An Email platform' },
//   ];

//   const featuredBrands = allBrands;

//   // Handle back button
//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         if (navigation.canGoBack()) {
//           navigation.goBack();
//           return true;
//         }
//         return false;
//       };

//       const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => backHandler.remove();
//     }, [navigation])
//   );

//   // Animation setup - runs once
//   useEffect(() => {
//     isMountedRef.current = true;

//     // Fade animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();

//     // Pulse animation
//     const pulseAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     pulseAnimation.start();

//     // Start auto-scrolling
//     startAutoScroll();

//     // Cleanup
//     return () => {
//       isMountedRef.current = false;
//       pulseAnimation.stop();
//       if (scrollInterval.current) {
//         clearInterval(scrollInterval.current);
//         scrollInterval.current = null;
//       }
//     };
//   }, []); // Empty dependency array - runs once

//   // Auto-scroll function with proper cleanup
//   const startAutoScroll = () => {
//     // Clear existing interval
//     if (scrollInterval.current) {
//       clearInterval(scrollInterval.current);
//       scrollInterval.current = null;
//     }

//     let scrollValue = 0;
//     const brandWidth = 80;
//     const totalBrands = allBrands.length;
//     const totalWidth = brandWidth * totalBrands;

//     scrollInterval.current = setInterval(() => {
//       if (!isMountedRef.current || !brandsScrollViewRef.current) {
//         return;
//       }

//       scrollValue += brandWidth;
      
//       if (scrollValue >= totalWidth) {
//         scrollValue = 0;
//         brandsScrollViewRef.current.scrollToOffset({
//           offset: 0,
//           animated: false
//         });
//       } else {
//         brandsScrollViewRef.current.scrollToOffset({
//           offset: scrollValue,
//           animated: true
//         });
//       }
//     }, 2500);
//   };

//   const handleGoBack = useCallback(() => {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     }
//   }, [navigation]);

//   // Brand Card Component
//   const BrandCard = ({ brand }) => (
//     <TouchableOpacity 
//       style={[styles.brandCard, { 
//         borderLeftColor: brand.color,
//         backgroundColor: colors.surface,
//         shadowColor: isDark ? '#000' : '#000'
//       }]}
//       onPress={() => {
//         Linking.openURL(brand.url);
//         setSelectedBrand(brand);
//       }}
//       activeOpacity={0.9}
//     >
//       <View style={styles.brandIconContainer}>
//         <Icon name={brand.icon} size={28} color={brand.color} />
//       </View>
//       <Text style={[styles.brandName, { color: colors.text }]}>{brand.name}</Text>
//       <Text style={[styles.brandDescription, { color: colors.textSecondary }]}>{brand.description}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Animated.View style={[styles.container, { 
//         opacity: fadeAnim,
//         backgroundColor: colors.background 
//       }]}>
//         <StatusBar 
//           backgroundColor={isDark ? colors.background : '#F8FAFC'} 
//           barStyle={isDark ? 'light-content' : 'dark-content'} 
//         />

//         {/* Header */}
//         <View style={[styles.headerContainer, { 
//           backgroundColor: colors.surface,
//           borderBottomColor: isDark ? '#333' : '#E2E8F0'
//         }]}>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={handleGoBack}
//           >
//             <Icon name="arrow-left" size={24} color={colors.text} />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, { color: colors.text }]}>
//             Brand Ecosystem
//           </Text>
//           <View style={styles.headerRightPlaceholder} />
//         </View>

//         <ScrollView 
//           showsVerticalScrollIndicator={false} 
//           style={styles.mainContent}
//         >
//           {/* Hero Section */}
//           <View style={styles.heroContainer}>
//             <Image
//               source={BANNER_IMAGE}
//               style={styles.heroImage}
//               resizeMode="cover"
//             />
//             <View style={[styles.heroOverlay, { 
//               backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' 
//             }]} />
            
//             <View style={styles.heroContent}>
//               <Text style={styles.heroTitle}>Digital Ecosystem</Text>
//               <Text style={styles.heroSubtitle}>
//                 Integrated solutions for modern living
//               </Text>
              
//               <TouchableOpacity
//                 style={[styles.ctaButton, { backgroundColor: colors.primary }]}
//                 onPress={() => setModalVisible(true)}
//               >
//                 <Text style={styles.ctaButtonText}>Explore Ecosystem</Text>
//                 <Icon name="arrow-right" size={20} color="#fff" style={styles.ctaIcon} />
//               </TouchableOpacity>
//             </View>
//           </View>
          
//           {/* Brands Grid */}
//           <View style={styles.brandsSection}>
//             <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Brands</Text>
//             <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
//               Comprehensive solutions for your needs
//             </Text>
            
//             <View style={styles.brandsGrid}>
//               {featuredBrands.map((brand, index) => (
//                 <BrandCard key={index} brand={brand} />
//               ))}
//             </View>
//           </View>

//           {/* Value Proposition */}
//           <View style={styles.valueSection}>
//             <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose Our Platform?</Text>
            
//             <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
//               <View style={[styles.valueIconContainer, { 
//                 backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
//               }]}>
//                 <Icon name="sync" size={24} color={colors.primary} />
//               </View>
//               <View style={styles.valueTextContainer}>
//                 <Text style={[styles.valueTitle, { color: colors.text }]}>Seamless Integration</Text>
//                 <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
//                   All services work together for a unified experience
//                 </Text>
//               </View>
//             </View>
            
//             <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
//               <View style={[styles.valueIconContainer, { 
//                 backgroundColor: isDark ? `${colors.secondary || '#0EA5E9'}30` : `${colors.secondary || '#0EA5E9'}15` 
//               }]}>
//                 <Icon name="shield-check" size={24} color={colors.secondary || '#0EA5E9'} />
//               </View>
//               <View style={styles.valueTextContainer}>
//                 <Text style={[styles.valueTitle, { color: colors.text }]}>Enterprise Security</Text>
//                 <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
//                   Your data is protected with industry-standard security
//                 </Text>
//               </View>
//             </View>
            
//             <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
//               <View style={[styles.valueIconContainer, { 
//                 backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
//               }]}>
//                 <Icon name="star-circle" size={24} color={colors.primary} />
//               </View>
//               <View style={styles.valueTextContainer}>
//                 <Text style={[styles.valueTitle, { color: colors.text }]}>Premium Experience</Text>
//                 <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
//                   Consistent quality and design across all services
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </ScrollView>

//         {/* Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//             <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
//               <TouchableOpacity 
//                 style={styles.modalCloseButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Icon name="close" size={24} color={colors.text} />
//               </TouchableOpacity>
              
//               <ScrollView style={styles.ecosystemScroll} showsVerticalScrollIndicator={false}>
//                 <View style={styles.modalHeader}>
//                   <View style={[styles.modalIconContainer, { 
//                     backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
//                   }]}>
//                     <Icon name="atom" size={32} color={colors.primary} />
//                   </View>
//                   <Text style={[styles.modalTitle, { color: colors.text }]}>Our Digital Ecosystem</Text>
//                   <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
//                     Integrated services designed to work seamlessly together
//                   </Text>
//                 </View>
                
//                 <View style={styles.ecosystemSection}>
//                   <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>
//                     Comprehensive Solutions
//                   </Text>
//                   <Text style={[styles.ecosystemText, { color: colors.textSecondary }]}>
//                     Our ecosystem brings together a carefully curated collection of digital services 
//                     that provide comprehensive solutions for modern living.
//                   </Text>
//                 </View>
                
//                 <View style={styles.ecosystemSection}>
//                   <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>Key Advantages</Text>
                  
//                   <View style={styles.benefitItem}>
//                     <Icon name="check-circle" size={20} color={colors.primary} />
//                     <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
//                       Unified account across all platforms
//                     </Text>
//                   </View>
                  
//                   <View style={styles.benefitItem}>
//                     <Icon name="check-circle" size={20} color={colors.primary} />
//                     <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
//                       Integrated payment and wallet system
//                     </Text>
//                   </View>
                  
//                   <View style={styles.benefitItem}>
//                     <Icon name="check-circle" size={20} color={colors.primary} />
//                     <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
//                       Centralized notification management
//                     </Text>
//                   </View>
                  
//                   <View style={styles.benefitItem}>
//                     <Icon name="check-circle" size={20} color={colors.primary} />
//                     <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
//                       Cross-service rewards program
//                     </Text>
//                   </View>
//                 </View>
//               </ScrollView>
//             </View>
//           </View>
//         </Modal>
//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'center',
//   },
//   headerRightPlaceholder: {
//     width: 32,
//   },
//   mainContent: {
//     flex: 1,
//   },
//   heroContainer: {
//     height: 400,
//     width: '100%',
//     position: 'relative',
//     marginBottom: 24,
//   },
//   heroImage: {
//     width: '100%',
//     height: '100%',
//   },
//   heroOverlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   heroContent: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//   },
//   heroTitle: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 32,
//     maxWidth: '80%',
//     opacity: 0.9,
//   },
//   ctaButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 28,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   ctaButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 8,
//   },
//   ctaIcon: {
//     marginLeft: 4,
//   },
//   brandsSection: {
//     paddingHorizontal: 20,
//     marginBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   sectionSubtitle: {
//     fontSize: 15,
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   brandsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   brandCard: {
//     width: (width - 60) / 3,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   brandIconContainer: {
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   brandName: {
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   brandDescription: {
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   valueSection: {
//     paddingHorizontal: 20,
//     marginBottom: 40,
//   },
//   valueItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   valueIconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   valueTextContainer: {
//     flex: 1,
//   },
//   valueTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   valueDescription: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     borderRadius: 16,
//     padding: 24,
//     maxHeight: '80%',
//   },
//   ecosystemScroll: {
//     width: '100%',
//   },
//   modalCloseButton: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     zIndex: 10,
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//     width: '100%',
//     marginTop: 10,
//   },
//   modalIconContainer: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   modalSubtitle: {
//     fontSize: 15,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   ecosystemSection: {
//     marginBottom: 24,
//   },
//   ecosystemSectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   ecosystemText: {
//     fontSize: 15,
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   benefitItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   benefitText: {
//     fontSize: 15,
//     marginLeft: 10,
//   },
// });

// export default BrandApp;

// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   Image,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Modal,
// //   Linking,
// //   ScrollView,
// //   Animated,
// //   StatusBar,
// //   Dimensions,
// //   FlatList,
// //   BackHandler,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { useTheme } from '../src/context/ThemeContext';
// // import { useFocusEffect, useNavigation } from '@react-navigation/native';
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';

// // const { width } = Dimensions.get('window');
// // const BANNER_IMAGE = require('../assets/images/dad.jpg');

// // const BrandApp = () => {
// //   const navigation = useNavigation();
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [selectedBrand, setSelectedBrand] = useState(null);
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const brandsScrollViewRef = useRef(null);
// //   const scrollInterval = useRef(null);
// //   const isMountedRef = useRef(true);
// //   const isBackHandlerActive = useRef(true);
  
// //   const { colors, isDark } = useTheme();

// //   // All brands data - static
// //   const allBrands = [
// //     { name: 'e-Direct', icon: 'book-open-outline', color: '#2563EB', url: 'https://edirect.ng', description: 'No 1 nigeria largest directory in africa' },
// //     { name: 'e-Jobs', icon: 'briefcase-outline', color: '#84CC16', url: 'https://ejobs.com', description: 'Recruitment platform' },
// //     { name: 'e-Store', icon: 'store-outline', color: '#64748B', url: 'https://estore.com', description: 'Online marketplace' },
// //     { name: 'e-Deal', icon: 'tag-outline', color: '#F59E0B', url: 'https://edeal.com', description: 'Daily deals platform' },
// //     { name: 'e-Ride', icon: 'car-outline', color: '#06B6D4', url: 'https://eride.com', description: 'Transportation service' },
// //     { name: 'e-Plan', icon: 'calendar-month-outline', color: '#EC4899', url: 'https://eplan.com', description: 'Event planning tool' },
// //     { name: 'e-Farm', icon: 'sprout-outline', color: '#10B981', url: 'https://efarm.com', description: 'Agricultural marketplace' },
// //     { name: 'eHangout', icon: 'account-group-outline', color: '#8B5CF6', url: 'https://ehangout.com', description: 'Social platform' },
// //     { name: 'e-Wallet', icon: 'wallet-outline', color: '#F97316', url: 'https://ewallet.com', description: 'Payment solution' },
// //     { name: 'Showa', icon: 'video-outline', color: '#EF4444', url: 'https://showapp.ng', description: 'Live streaming platform' },
// //     { name: 'EBNB Hotel', icon: 'bed-outline', color: '#8B5CF6', url: 'https://showa.com', description: 'Hotel management software' },
// //     { name: 'Essential News', icon: 'newspaper-variant-outline', color: '#2563EB', url: 'https://showa.com', description: 'News platform and blogging' },
// //     { name: 'E-Hotels', icon: 'office-building-outline', color: '#DC2626', url: 'https://showa.com', description: 'Hotels system management' },
// //     { name: 'E-apartment', icon: 'home-outline', color: '#059669', url: 'https://showa.com', description: 'Apartment booking website' },
// //     { name: 'HRMS', icon: 'account-tie-outline', color: '#7C3AED', url: 'https://showa.com', description: 'HR Management System' },
// //     { name: 'E-Medicals', icon: 'hospital-box-outline', color: '#DB2777', url: 'https://showa.com', description: 'Hospital Management System' },
// //     { name: 'E-Shortstay', icon: 'clock-time-three-outline', color: '#EA580C', url: 'https://showa.com', description: 'Hourly booking' },
// //     { name: 'Oosh-Mail', icon: 'email-outline', color: '#0891B2', url: 'https://ooshmail.com', description: 'An Email platform' },
// //   ];

// //   const featuredBrands = allBrands;

// //   // Handle back button with proper navigation checking
// //   const handleBackPress = useCallback(() => {
// //     if (!isBackHandlerActive.current) return false;
    
// //     // Check if we can go back
// //     if (navigation.canGoBack()) {
// //       navigation.goBack();
// //       return true;
// //     }
    
// //     // If we can't go back, check if we should close the app
// //     // On Android, this would close the app, but we want to prevent that
// //     // So we navigate to a safe screen instead
// //     try {
// //       // Try to navigate to BusinessHome if it exists in the stack
// //       navigation.navigate('BusinessHome');
// //       return true;
// //     } catch (error) {
// //       // If navigation fails, we return false to allow default back behavior
// //       return false;
// //     }
// //   }, [navigation]);

// //   // Handle swipe back gesture
// //   useFocusEffect(
// //     useCallback(() => {
// //       // Reset the flag when screen is focused
// //       isBackHandlerActive.current = true;

// //       // Hardware back button handler
// //       const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

// //       // Navigation beforeRemove listener for swipe back
// //       const unsubscribe = navigation.addListener('beforeRemove', (e) => {
// //         // Only intercept if we can go back
// //         if (navigation.canGoBack()) {
// //           e.preventDefault();
// //           navigation.goBack();
// //         }
// //         // If we can't go back, allow the default behavior
// //         // but we don't want the app to close, so we navigate to a safe screen
// //         else {
// //           e.preventDefault();
// //           try {
// //             navigation.navigate('BusinessHome');
// //           } catch (error) {
// //             // If navigation fails, just let the default happen
// //           }
// //         }
// //       });

// //       return () => {
// //         isBackHandlerActive.current = false;
// //         backHandler.remove();
// //         unsubscribe();
// //       };
// //     }, [navigation, handleBackPress])
// //   );

// //   // Animation setup - runs once
// //   useEffect(() => {
// //     isMountedRef.current = true;

// //     // Fade animation
// //     Animated.timing(fadeAnim, {
// //       toValue: 1,
// //       duration: 800,
// //       useNativeDriver: true,
// //     }).start();

// //     // Pulse animation
// //     const pulseAnimation = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.1,
// //           duration: 1000,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 1000,
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     );
// //     pulseAnimation.start();

// //     // Start auto-scrolling
// //     startAutoScroll();

// //     // Cleanup
// //     return () => {
// //       isMountedRef.current = false;
// //       pulseAnimation.stop();
// //       if (scrollInterval.current) {
// //         clearInterval(scrollInterval.current);
// //         scrollInterval.current = null;
// //       }
// //     };
// //   }, []);

// //   // Auto-scroll function with proper cleanup
// //   const startAutoScroll = () => {
// //     // Clear existing interval
// //     if (scrollInterval.current) {
// //       clearInterval(scrollInterval.current);
// //       scrollInterval.current = null;
// //     }

// //     let scrollValue = 0;
// //     const brandWidth = 80;
// //     const totalBrands = allBrands.length;
// //     const totalWidth = brandWidth * totalBrands;

// //     scrollInterval.current = setInterval(() => {
// //       if (!isMountedRef.current || !brandsScrollViewRef.current) {
// //         return;
// //       }

// //       scrollValue += brandWidth;
      
// //       if (scrollValue >= totalWidth) {
// //         scrollValue = 0;
// //         brandsScrollViewRef.current.scrollToOffset({
// //           offset: 0,
// //           animated: false
// //         });
// //       } else {
// //         brandsScrollViewRef.current.scrollToOffset({
// //           offset: scrollValue,
// //           animated: true
// //         });
// //       }
// //     }, 2500);
// //   };

// //   const handleGoBack = useCallback(() => {
// //     handleBackPress();
// //   }, [handleBackPress]);

// //   // Brand Card Component
// //   const BrandCard = ({ brand }) => (
// //     <TouchableOpacity 
// //       style={[styles.brandCard, { 
// //         borderLeftColor: brand.color,
// //         backgroundColor: colors.surface,
// //         shadowColor: isDark ? '#000' : '#000'
// //       }]}
// //       onPress={() => {
// //         Linking.openURL(brand.url);
// //         setSelectedBrand(brand);
// //       }}
// //       activeOpacity={0.9}
// //     >
// //       <View style={styles.brandIconContainer}>
// //         <Icon name={brand.icon} size={28} color={brand.color} />
// //       </View>
// //       <Text style={[styles.brandName, { color: colors.text }]}>{brand.name}</Text>
// //       <Text style={[styles.brandDescription, { color: colors.textSecondary }]}>{brand.description}</Text>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <SafeAreaView style={{ flex: 1 }}>
// //         <Animated.View style={[styles.container, { 
// //           opacity: fadeAnim,
// //           backgroundColor: colors.background 
// //         }]}>
// //           <StatusBar 
// //             backgroundColor={isDark ? colors.background : '#F8FAFC'} 
// //             barStyle={isDark ? 'light-content' : 'dark-content'} 
// //           />

// //           {/* Header */}
// //           <View style={[styles.headerContainer, { 
// //             backgroundColor: colors.surface,
// //             borderBottomColor: isDark ? '#333' : '#E2E8F0'
// //           }]}>
// //             <TouchableOpacity 
// //               style={styles.backButton}
// //               onPress={handleGoBack}
// //             >
// //               <Icon name="arrow-left" size={24} color={colors.text} />
// //             </TouchableOpacity>
// //             <Text style={[styles.headerTitle, { color: colors.text }]}>
// //               Brand Ecosystem
// //             </Text>
// //             <View style={styles.headerRightPlaceholder} />
// //           </View>

// //           <ScrollView 
// //             showsVerticalScrollIndicator={false} 
// //             style={styles.mainContent}
// //           >
// //             {/* Hero Section */}
// //             <View style={styles.heroContainer}>
// //               <Image
// //                 source={BANNER_IMAGE}
// //                 style={styles.heroImage}
// //                 resizeMode="cover"
// //               />
// //               <View style={[styles.heroOverlay, { 
// //                 backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' 
// //               }]} />
              
// //               <View style={styles.heroContent}>
// //                 <Text style={styles.heroTitle}>Digital Ecosystem</Text>
// //                 <Text style={styles.heroSubtitle}>
// //                   Integrated solutions for modern living
// //                 </Text>
                
// //                 <TouchableOpacity
// //                   style={[styles.ctaButton, { backgroundColor: colors.primary }]}
// //                   onPress={() => setModalVisible(true)}
// //                 >
// //                   <Text style={styles.ctaButtonText}>Explore Ecosystem</Text>
// //                   <Icon name="arrow-right" size={20} color="#fff" style={styles.ctaIcon} />
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
            
// //             {/* Brands Grid */}
// //             <View style={styles.brandsSection}>
// //               <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Brands</Text>
// //               <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
// //                 Comprehensive solutions for your needs
// //               </Text>
              
// //               <View style={styles.brandsGrid}>
// //                 {featuredBrands.map((brand, index) => (
// //                   <BrandCard key={index} brand={brand} />
// //                 ))}
// //               </View>
// //             </View>

// //             {/* Value Proposition */}
// //             <View style={styles.valueSection}>
// //               <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose Our Platform?</Text>
              
// //               <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
// //                 <View style={[styles.valueIconContainer, { 
// //                   backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
// //                 }]}>
// //                   <Icon name="sync" size={24} color={colors.primary} />
// //                 </View>
// //                 <View style={styles.valueTextContainer}>
// //                   <Text style={[styles.valueTitle, { color: colors.text }]}>Seamless Integration</Text>
// //                   <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
// //                     All services work together for a unified experience
// //                   </Text>
// //                 </View>
// //               </View>
              
// //               <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
// //                 <View style={[styles.valueIconContainer, { 
// //                   backgroundColor: isDark ? `${colors.secondary || '#0EA5E9'}30` : `${colors.secondary || '#0EA5E9'}15` 
// //                 }]}>
// //                   <Icon name="shield-check" size={24} color={colors.secondary || '#0EA5E9'} />
// //                 </View>
// //                 <View style={styles.valueTextContainer}>
// //                   <Text style={[styles.valueTitle, { color: colors.text }]}>Enterprise Security</Text>
// //                   <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
// //                     Your data is protected with industry-standard security
// //                   </Text>
// //                 </View>
// //               </View>
              
// //               <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
// //                 <View style={[styles.valueIconContainer, { 
// //                   backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
// //                 }]}>
// //                   <Icon name="star-circle" size={24} color={colors.primary} />
// //                 </View>
// //                 <View style={styles.valueTextContainer}>
// //                   <Text style={[styles.valueTitle, { color: colors.text }]}>Premium Experience</Text>
// //                   <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
// //                     Consistent quality and design across all services
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </ScrollView>

// //           {/* Modal */}
// //           <Modal
// //             animationType="slide"
// //             transparent={true}
// //             visible={modalVisible}
// //             onRequestClose={() => setModalVisible(false)}
// //           >
// //             <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
// //               <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
// //                 <TouchableOpacity 
// //                   style={styles.modalCloseButton}
// //                   onPress={() => setModalVisible(false)}
// //                 >
// //                   <Icon name="close" size={24} color={colors.text} />
// //                 </TouchableOpacity>
                
// //                 <ScrollView style={styles.ecosystemScroll} showsVerticalScrollIndicator={false}>
// //                   <View style={styles.modalHeader}>
// //                     <View style={[styles.modalIconContainer, { 
// //                       backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
// //                     }]}>
// //                       <Icon name="atom" size={32} color={colors.primary} />
// //                     </View>
// //                     <Text style={[styles.modalTitle, { color: colors.text }]}>Our Digital Ecosystem</Text>
// //                     <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
// //                       Integrated services designed to work seamlessly together
// //                     </Text>
// //                   </View>
                  
// //                   <View style={styles.ecosystemSection}>
// //                     <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>
// //                       Comprehensive Solutions
// //                     </Text>
// //                     <Text style={[styles.ecosystemText, { color: colors.textSecondary }]}>
// //                       Our ecosystem brings together a carefully curated collection of digital services 
// //                       that provide comprehensive solutions for modern living.
// //                     </Text>
// //                   </View>
                  
// //                   <View style={styles.ecosystemSection}>
// //                     <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>Key Advantages</Text>
                    
// //                     <View style={styles.benefitItem}>
// //                       <Icon name="check-circle" size={20} color={colors.primary} />
// //                       <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
// //                         Unified account across all platforms
// //                       </Text>
// //                     </View>
                    
// //                     <View style={styles.benefitItem}>
// //                       <Icon name="check-circle" size={20} color={colors.primary} />
// //                       <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
// //                         Integrated payment and wallet system
// //                       </Text>
// //                     </View>
                    
// //                     <View style={styles.benefitItem}>
// //                       <Icon name="check-circle" size={20} color={colors.primary} />
// //                       <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
// //                         Centralized notification management
// //                       </Text>
// //                     </View>
                    
// //                     <View style={styles.benefitItem}>
// //                       <Icon name="check-circle" size={20} color={colors.primary} />
// //                       <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
// //                         Cross-service rewards program
// //                       </Text>
// //                     </View>
// //                   </View>
// //                 </ScrollView>
// //               </View>
// //             </View>
// //           </Modal>
// //         </Animated.View>
// //       </SafeAreaView>
// //     </GestureHandlerRootView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   headerContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   backButton: {
// //     padding: 4,
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     flex: 1,
// //     textAlign: 'center',
// //   },
// //   headerRightPlaceholder: {
// //     width: 32,
// //   },
// //   mainContent: {
// //     flex: 1,
// //   },
// //   heroContainer: {
// //     height: 400,
// //     width: '100%',
// //     position: 'relative',
// //     marginBottom: 24,
// //   },
// //   heroImage: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   heroOverlay: {
// //     ...StyleSheet.absoluteFillObject,
// //   },
// //   heroContent: {
// //     position: 'absolute',
// //     bottom: 40,
// //     left: 0,
// //     right: 0,
// //     paddingHorizontal: 24,
// //     alignItems: 'center',
// //   },
// //   heroTitle: {
// //     fontSize: 32,
// //     fontWeight: '700',
// //     color: 'white',
// //     textAlign: 'center',
// //     marginBottom: 12,
// //   },
// //   heroSubtitle: {
// //     fontSize: 16,
// //     color: 'white',
// //     textAlign: 'center',
// //     marginBottom: 32,
// //     maxWidth: '80%',
// //     opacity: 0.9,
// //   },
// //   ctaButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 14,
// //     paddingHorizontal: 28,
// //     borderRadius: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   ctaButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginRight: 8,
// //   },
// //   ctaIcon: {
// //     marginLeft: 4,
// //   },
// //   brandsSection: {
// //     paddingHorizontal: 20,
// //     marginBottom: 40,
// //   },
// //   sectionTitle: {
// //     fontSize: 22,
// //     fontWeight: '600',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   sectionSubtitle: {
// //     fontSize: 15,
// //     textAlign: 'center',
// //     marginBottom: 24,
// //   },
// //   brandsGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //   },
// //   brandCard: {
// //     width: (width - 60) / 3,
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 3,
// //     elevation: 2,
// //   },
// //   brandIconContainer: {
// //     marginBottom: 12,
// //     alignItems: 'center',
// //   },
// //   brandName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     textAlign: 'center',
// //     marginBottom: 4,
// //   },
// //   brandDescription: {
// //     fontSize: 12,
// //     textAlign: 'center',
// //   },
// //   valueSection: {
// //     paddingHorizontal: 20,
// //     marginBottom: 40,
// //   },
// //   valueItem: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 3,
// //     elevation: 2,
// //   },
// //   valueIconContainer: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 16,
// //   },
// //   valueTextContainer: {
// //     flex: 1,
// //   },
// //   valueTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginBottom: 4,
// //   },
// //   valueDescription: {
// //     fontSize: 14,
// //     lineHeight: 20,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContent: {
// //     width: '90%',
// //     borderRadius: 16,
// //     padding: 24,
// //     maxHeight: '80%',
// //   },
// //   ecosystemScroll: {
// //     width: '100%',
// //   },
// //   modalCloseButton: {
// //     position: 'absolute',
// //     top: 16,
// //     right: 16,
// //     zIndex: 10,
// //   },
// //   modalHeader: {
// //     alignItems: 'center',
// //     marginBottom: 24,
// //     width: '100%',
// //     marginTop: 10,
// //   },
// //   modalIconContainer: {
// //     width: 64,
// //     height: 64,
// //     borderRadius: 32,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   modalTitle: {
// //     fontSize: 22,
// //     fontWeight: '600',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   modalSubtitle: {
// //     fontSize: 15,
// //     textAlign: 'center',
// //     lineHeight: 22,
// //   },
// //   ecosystemSection: {
// //     marginBottom: 24,
// //   },
// //   ecosystemSectionTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 12,
// //   },
// //   ecosystemText: {
// //     fontSize: 15,
// //     lineHeight: 22,
// //     marginBottom: 16,
// //   },
// //   benefitItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   benefitText: {
// //     fontSize: 15,
// //     marginLeft: 10,
// //   },
// // });

// // export default BrandApp;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { useFocusEffect, useNavigation, CommonActions } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const BANNER_IMAGE = require('../assets/images/dad.jpg');

const BrandApp = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const brandsScrollViewRef = useRef(null);
  const scrollInterval = useRef(null);
  const isMountedRef = useRef(true);
  const isBackHandlerActive = useRef(true);
  const hasNavigatedBack = useRef(false);
  
  const { colors, isDark } = useTheme();

  // All brands data - static (removed color property)
  const allBrands = [
    { name: 'e-Direct', icon: 'book-open-outline', url: 'https://edirect.ng', description: 'No 1 nigeria largest directory in africa' },
    { name: 'e-Jobs', icon: 'briefcase-outline', url: 'https://ejobs.com', description: 'Recruitment platform' },
    { name: 'e-Store', icon: 'store-outline', url: 'https://estore.com', description: 'Online marketplace' },
    { name: 'e-Deal', icon: 'tag-outline', url: 'https://edeal.com', description: 'Daily deals platform' },
    { name: 'e-Ride', icon: 'car-outline', url: 'https://eride.com', description: 'Transportation service' },
    { name: 'e-Plan', icon: 'calendar-month-outline', url: 'https://eplan.com', description: 'Event planning tool' },
    { name: 'e-Farm', icon: 'sprout-outline', url: 'https://efarm.com', description: 'Agricultural marketplace' },
    { name: 'eHangout', icon: 'account-group-outline', url: 'https://ehangout.com', description: 'Social platform' },
    { name: 'e-Wallet', icon: 'wallet-outline', url: 'https://ewallet.com', description: 'Payment solution' },
    { name: 'Showa', icon: 'video-outline', url: 'https://showapp.ng', description: 'Live streaming platform' },
    { name: 'EBNB Hotel', icon: 'bed-outline', url: 'https://showa.com', description: 'Hotel management software' },
    { name: 'Essential News', icon: 'newspaper-variant-outline', url: 'https://showa.com', description: 'News platform and blogging' },
    { name: 'E-Hotels', icon: 'office-building-outline', url: 'https://showa.com', description: 'Hotels system management' },
    { name: 'E-apartment', icon: 'home-outline', url: 'https://showa.com', description: 'Apartment booking website' },
    { name: 'HRMS', icon: 'account-tie-outline', url: 'https://showa.com', description: 'HR Management System' },
    { name: 'E-Medicals', icon: 'hospital-box-outline', url: 'https://showa.com', description: 'Hospital Management System' },
    { name: 'E-Shortstay', icon: 'clock-time-three-outline', url: 'https://showa.com', description: 'Hourly booking' },
    { name: 'Oosh-Mail', icon: 'email-outline', url: 'https://ooshmail.com', description: 'An Email platform' },
  ];

  const featuredBrands = allBrands;

  // CRITICAL FIX: Handle back button to prevent app closing
  const handleBackPress = useCallback(() => {
    if (!isBackHandlerActive.current) return false;
    
    // Prevent multiple back navigations
    if (hasNavigatedBack.current) {
      return true;
    }

    // Check if we can go back
    if (navigation.canGoBack()) {
      hasNavigatedBack.current = true;
      navigation.goBack();
      // Reset after navigation
      setTimeout(() => {
        hasNavigatedBack.current = false;
      }, 500);
      return true;
    }
    
    // If we can't go back, navigate to BusinessHome using reset
    try {
      hasNavigatedBack.current = true;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'BusinessHome' }
          ],
        })
      );
      setTimeout(() => {
        hasNavigatedBack.current = false;
      }, 500);
      return true;
    } catch (error) {
      console.log('Navigation error:', error);
      hasNavigatedBack.current = false;
      return false;
    }
  }, [navigation]);

  // Handle swipe back gesture
  useFocusEffect(
    useCallback(() => {
      // Reset flags when screen is focused
      isBackHandlerActive.current = true;
      hasNavigatedBack.current = false;

      // Hardware back button handler
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Navigation beforeRemove listener for swipe back
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        // Prevent duplicate navigation
        if (hasNavigatedBack.current) {
          e.preventDefault();
          return;
        }

        // Check if we can go back
        if (navigation.canGoBack()) {
          e.preventDefault();
          hasNavigatedBack.current = true;
          navigation.goBack();
          setTimeout(() => {
            hasNavigatedBack.current = false;
          }, 500);
        } else {
          // If we can't go back, navigate to BusinessHome
          e.preventDefault();
          hasNavigatedBack.current = true;
          try {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  { name: 'BusinessHome' }
                ],
              })
            );
          } catch (error) {
            console.log('Navigation error during swipe:', error);
          }
          setTimeout(() => {
            hasNavigatedBack.current = false;
          }, 500);
        }
      });

      return () => {
        isBackHandlerActive.current = false;
        backHandler.remove();
        unsubscribe();
      };
    }, [navigation, handleBackPress])
  );

  // Animation setup - runs once
  useEffect(() => {
    isMountedRef.current = true;

    // Fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Start auto-scrolling
    startAutoScroll();

    // Cleanup
    return () => {
      isMountedRef.current = false;
      pulseAnimation.stop();
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
        scrollInterval.current = null;
      }
    };
  }, []);

  // Auto-scroll function with proper cleanup
  const startAutoScroll = () => {
    // Clear existing interval
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }

    let scrollValue = 0;
    const brandWidth = 80;
    const totalBrands = allBrands.length;
    const totalWidth = brandWidth * totalBrands;

    scrollInterval.current = setInterval(() => {
      if (!isMountedRef.current || !brandsScrollViewRef.current) {
        return;
      }

      scrollValue += brandWidth;
      
      if (scrollValue >= totalWidth) {
        scrollValue = 0;
        brandsScrollViewRef.current.scrollToOffset({
          offset: 0,
          animated: false
        });
      } else {
        brandsScrollViewRef.current.scrollToOffset({
          offset: scrollValue,
          animated: true
        });
      }
    }, 2500);
  };

  const handleGoBack = useCallback(() => {
    handleBackPress();
  }, [handleBackPress]);

  // Brand Card Component
  const BrandCard = ({ brand }) => (
    <TouchableOpacity 
      style={[styles.brandCard, { 
        backgroundColor: colors.surface,
        shadowColor: isDark ? '#000' : '#000'
      }]}
      onPress={() => {
        Linking.openURL(brand.url);
        setSelectedBrand(brand);
      }}
      activeOpacity={0.9}
    >
      <View style={[styles.brandIconContainer, { backgroundColor: colors.primary + '20' }]}>
        <Icon name={brand.icon} size={28} color={colors.primary} />
      </View>
      <Text style={[styles.brandName, { color: colors.text }]}>{brand.name}</Text>
      <Text style={[styles.brandDescription, { color: colors.textSecondary }]}>{brand.description}</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.container, { 
          opacity: fadeAnim,
          backgroundColor: colors.background 
        }]}>
          <StatusBar 
            backgroundColor={isDark ? colors.background : '#F8FAFC'} 
            barStyle={isDark ? 'light-content' : 'dark-content'} 
          />

          {/* Header */}
          <View style={[styles.headerContainer, { 
            backgroundColor: colors.surface,
            borderBottomColor: isDark ? '#333' : '#E2E8F0'
          }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleGoBack}
            >
              <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Brand Ecosystem
            </Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            style={styles.mainContent}
          >
            {/* Hero Section */}
            <View style={styles.heroContainer}>
              <Image
                source={BANNER_IMAGE}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={[styles.heroOverlay, { 
                backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' 
              }]} />
              
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Digital Ecosystem</Text>
                <Text style={styles.heroSubtitle}>
                  Integrated solutions for modern living
                </Text>
                
                <TouchableOpacity
                  style={[styles.ctaButton, { backgroundColor: colors.primary }]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.ctaButtonText}>Explore Ecosystem</Text>
                  <Icon name="arrow-right" size={20} color="#fff" style={styles.ctaIcon} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Brands Grid */}
            <View style={styles.brandsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Brands</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Comprehensive solutions for your needs
              </Text>
              
              <View style={styles.brandsGrid}>
                {featuredBrands.map((brand, index) => (
                  <BrandCard key={index} brand={brand} />
                ))}
              </View>
            </View>

            {/* Value Proposition */}
            <View style={styles.valueSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose Our Platform?</Text>
              
              <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.valueIconContainer, { 
                  backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
                }]}>
                  <Icon name="sync" size={24} color={colors.primary} />
                </View>
                <View style={styles.valueTextContainer}>
                  <Text style={[styles.valueTitle, { color: colors.text }]}>Seamless Integration</Text>
                  <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                    All services work together for a unified experience
                  </Text>
                </View>
              </View>
              
              <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.valueIconContainer, { 
                  backgroundColor: isDark ? `${colors.secondary || '#0EA5E9'}30` : `${colors.secondary || '#0EA5E9'}15` 
                }]}>
                  <Icon name="shield-check" size={24} color={colors.secondary || '#0EA5E9'} />
                </View>
                <View style={styles.valueTextContainer}>
                  <Text style={[styles.valueTitle, { color: colors.text }]}>Enterprise Security</Text>
                  <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                    Your data is protected with industry-standard security
                  </Text>
                </View>
              </View>
              
              <View style={[styles.valueItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.valueIconContainer, { 
                  backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
                }]}>
                  <Icon name="star-circle" size={24} color={colors.primary} />
                </View>
                <View style={styles.valueTextContainer}>
                  <Text style={[styles.valueTitle, { color: colors.text }]}>Premium Experience</Text>
                  <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                    Consistent quality and design across all services
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                
                <ScrollView style={styles.ecosystemScroll} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalHeader}>
                    <View style={[styles.modalIconContainer, { 
                      backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` 
                    }]}>
                      <Icon name="atom" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Our Digital Ecosystem</Text>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                      Integrated services designed to work seamlessly together
                    </Text>
                  </View>
                  
                  <View style={styles.ecosystemSection}>
                    <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>
                      Comprehensive Solutions
                    </Text>
                    <Text style={[styles.ecosystemText, { color: colors.textSecondary }]}>
                      Our ecosystem brings together a carefully curated collection of digital services 
                      that provide comprehensive solutions for modern living.
                    </Text>
                  </View>
                  
                  <View style={styles.ecosystemSection}>
                    <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>Key Advantages</Text>
                    
                    <View style={styles.benefitItem}>
                      <Icon name="check-circle" size={20} color={colors.primary} />
                      <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                        Unified account across all platforms
                      </Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Icon name="check-circle" size={20} color={colors.primary} />
                      <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                        Integrated payment and wallet system
                      </Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Icon name="check-circle" size={20} color={colors.primary} />
                      <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                        Centralized notification management
                      </Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Icon name="check-circle" size={20} color={colors.primary} />
                      <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                        Cross-service rewards program
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  mainContent: {
    flex: 1,
  },
  heroContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '80%',
    opacity: 0.9,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  ctaIcon: {
    marginLeft: 4,
  },
  brandsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandCard: {
    width: (width - 60) / 3,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  brandIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  brandDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  valueSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  valueIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueTextContainer: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  ecosystemScroll: {
    width: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    marginTop: 10,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  ecosystemSection: {
    marginBottom: 24,
  },
  ecosystemSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  ecosystemText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    marginLeft: 10,
  },
});

export default BrandApp;