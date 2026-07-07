// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   StatusBar,
 
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const { width, height } = Dimensions.get('window');

// const PremiumScreen = ({ navigation }) => {
//   const [selectedFeature, setSelectedFeature] = useState(null);
//   const [isPremium, setIsPremium] = useState(false);
//   const [showDetail, setShowDetail] = useState(false);
//   const [selectedDetail, setSelectedDetail] = useState(null);

//   // Premium Features Data
//   const premiumFeatures = [
//     {
//       id: 'badge',
//       icon: 'crown',
//       iconType: 'FontAwesome5',
//       title: 'Premium Badge & Profile',
//       description: 'Stand out with an exclusive gold crown badge and premium profile themes',
//       benefits: [
//         'Gold crown badge next to your name',
//         'Custom profile themes and colors',
//         'Exclusive avatar frames',
//         'Priority in search results',
//       ],
//       comingSoon: false,
//       color: '#FFD700',
//     },
//     {
//       id: 'adfree',
//       icon: 'remove-circle-outline',
//       iconType: 'Ionicons',
//       title: 'Ad-Free Experience',
//       description: 'Enjoy the app without any interruptions from ads',
//       benefits: [
//         'No banner ads anywhere',
//         'No video ads between content',
//         'Faster app performance',
//         'Clean and distraction-free browsing',
//       ],
//       comingSoon: false,
//       color: '#4CAF50',
//     },
//     {
//       id: 'doublecoins',
//       icon: 'coins',
//       iconType: 'FontAwesome5',
//       title: 'Double Coins Rewards',
//       description: 'Earn 2x coins on all your activities and engagement',
//       benefits: [
//         '2x coins for every like',
//         '2x coins for every comment',
//         '2x coins for watching videos',
//         '2x coins for daily login',
//         'Bonus coins for sharing content',
//       ],
//       comingSoon: false,
//       color: '#FF6B35',
//     },
//     {
//       id: 'exclusivecontent',
//       icon: 'lock-open-outline',
//       iconType: 'Ionicons',
//       title: 'Exclusive Content',
//       description: 'Access premium-only posts and live streams',
//       benefits: [
//         'Create premium-only posts',
//         'Join exclusive live streams',
//         'Access to premium groups',
//         'Early access to new features',
//       ],
//       comingSoon: true,
//       color: '#9C27B0',
//     },
//     {
//       id: 'analytics',
//       icon: 'analytics-outline',
//       iconType: 'Ionicons',
//       title: 'Advanced Analytics',
//       description: 'Get deep insights into your audience and content performance',
//       benefits: [
//         'Follower growth charts',
//         'Demographic insights',
//         'Top fans list',
//         'Best time to post recommendations',
//         'Post performance metrics',
//       ],
//       comingSoon: true,
//       color: '#2196F3',
//     },
//     {
//       id: 'readreceipts',
//       icon: 'checkmark-done-circle-outline',
//       iconType: 'Ionicons',
//       title: 'Read Receipts',
//       description: 'See exactly when your messages are read',
//       benefits: [
//         'Blue ticks on read messages',
//         'Message delivery status',
//         'View read time stamps',
//         'Typing indicators',
//       ],
//       comingSoon: true,
//       color: '#00BCD4',
//     },
//     {
//       id: 'promote',
//       icon: 'trending-up-outline',
//       iconType: 'Ionicons',
//       title: 'Post Promotion',
//       description: 'Boost your content to reach more people',
//       benefits: [
//         'Promote any post instantly',
//         'Targeted audience reach',
//         'Boost visibility in feeds',
//         'Get more engagement',
//         'Track promotion performance',
//       ],
//       comingSoon: true,
//       color: '#FF4081',
//     },
//     {
//       id: 'higherearnings',
//       icon: 'cash-outline',
//       iconType: 'Ionicons',
//       title: 'Higher Earning Potential',
//       description: 'Maximize your earnings with premium benefits',
//       benefits: [
//         'Higher coin conversion rates',
//         'Reduced withdrawal fees (only 2%)',
//         'Exclusive earning challenges',
//         'Weekly bonus rewards',
//         'Priority withdrawal processing',
//       ],
//       comingSoon: false,
//       color: '#FF9800',
//     },
//     {
//       id: 'advancedbusiness',
//       icon: 'storefront-outline',
//       iconType: 'Ionicons',
//       title: 'Advanced Business Tools',
//       description: 'Professional tools for business accounts',
//       benefits: [
//         'Premium storefront layout',
//         'Multiple business profiles',
//         'Advanced listing analytics',
//         'Monetization fast-track',
//         'Business insights dashboard',
//       ],
//       comingSoon: true,
//       color: '#795548',
//     },
//     {
//       id: 'loyaltyrewards',
//       icon: 'gift-outline',
//       iconType: 'Ionicons',
//       title: 'Loyalty Rewards',
//       description: 'Get rewarded for staying with us',
//       benefits: [
//         'Monthly bonus coins',
//         'Special anniversary rewards',
//         'Exclusive badges for milestones',
//         'VIP event invitations',
//         'Birthday bonuses',
//       ],
//       comingSoon: true,
//       color: '#E91E63',
//     },
//     {
//       id: 'higherlimits',
//       icon: 'cloud-upload-outline',
//       iconType: 'Ionicons',
//       title: 'Higher Upload Limits',
//       description: 'Upload larger and higher quality content',
//       benefits: [
//         '4K video uploads',
//         'Higher resolution images',
//         'Larger file sizes (up to 500MB)',
//         'Faster upload speeds',
//         'Unlimited media storage',
//       ],
//       comingSoon: false,
//       color: '#607D8B',
//     },
//     {
//       id: 'extendedstories',
//       icon: 'time-outline',
//       iconType: 'Ionicons',
//       title: 'Extended Stories Duration',
//       description: 'Keep your stories visible for longer',
//       benefits: [
//         'Stories last 48 hours (instead of 24)',
//         'Highlight your best stories',
//         'Create story collections',
//         'Pin stories to your profile',
//       ],
//       comingSoon: true,
//       color: '#FF5722',
//     },
//   ];

//   const handleFeaturePress = (feature) => {
//     setSelectedDetail(feature);
//     setShowDetail(true);
//   };

//   const renderFeatureDetail = () => {
//     if (!selectedDetail) return null;

//     return (
//       <View style={styles.detailModalOverlay}>
//         <TouchableOpacity
//           style={styles.detailModalBackdrop}
//           activeOpacity={1}
//           onPress={() => setShowDetail(false)}
//         />
//         <View style={styles.detailModal}>
//           <View style={styles.detailModalHeader}>
//             <View style={[styles.detailIconContainer, { backgroundColor: selectedDetail.color }]}>
//               {selectedDetail.iconType === 'FontAwesome5' && (
//                 <FontAwesome5 name={selectedDetail.icon} size={30} color="#fff" />
//               )}
//               {selectedDetail.iconType === 'Ionicons' && (
//                 <Ionicons name={selectedDetail.icon} size={30} color="#fff" />
//               )}
//             </View>
//             <TouchableOpacity
//               style={styles.closeDetailButton}
//               onPress={() => setShowDetail(false)}
//             >
//               <Ionicons name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.detailTitle}>{selectedDetail.title}</Text>
          
//           {selectedDetail.comingSoon ? (
//             <View style={styles.comingSoonContainer}>
//               <Text style={styles.comingSoonText}>🚀 COMING SOON</Text>
//               <Text style={styles.comingSoonSubtext}>
//                 We're working hard to bring this feature to you!
//               </Text>
//               <View style={styles.comingSoonProgress}>
//                 <View style={[styles.comingSoonProgressBar, { width: '60%' }]} />
//               </View>
//               <Text style={styles.comingSoonProgressText}>60% complete</Text>
//             </View>
//           ) : (
//             <View>
//               <Text style={styles.detailDescription}>{selectedDetail.description}</Text>
//               <Text style={styles.detailBenefitsTitle}>✨ What you get:</Text>
//               {selectedDetail.benefits.map((benefit, index) => (
//                 <View key={index} style={styles.benefitItem}>
//                   <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//                   <Text style={styles.benefitText}>{benefit}</Text>
//                 </View>
//               ))}
//               <TouchableOpacity style={styles.subscribeButton}>
//                 <LinearGradient
//                   colors={['#FF6B35', '#FF3D00']}
//                   style={styles.subscribeButtonGradient}
//                 >
//                   <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
//                   <Icon name="arrow-forward" size={20} color="#fff" />
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header Section */}
//         <LinearGradient
//           colors={['#1a1a2e', '#16213e', '#0f3460']}
//           style={styles.headerContainer}
//         >
//           <View style={styles.headerContent}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Ionicons name="arrow-back" size={24} color="#fff" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>Premium</Text>
//             <View style={styles.headerRight} />
//           </View>
          
//           {!isPremium ? (
//             <View style={styles.premiumCtaContainer}>
//               <View style={styles.crownIconContainer}>
//                 <FontAwesome5 name="crown" size={50} color="#FFD700" />
//               </View>
//               <Text style={styles.premiumTitle}>Go Premium</Text>
//               <Text style={styles.premiumSubtitle}>
//                 Unlock exclusive features and take your experience to the next level
//               </Text>
              
//               <TouchableOpacity style={styles.subscribeMainButton}>
//                 <LinearGradient
//                   colors={['#FFD700', '#FFA500']}
//                   style={styles.subscribeMainButtonGradient}
//                 >
//                   <Text style={styles.subscribeMainButtonText}>Subscribe Now</Text>
//                   <FontAwesome5 name="crown" size={20} color="#fff" />
//                 </LinearGradient>
//               </TouchableOpacity>
              
//               <View style={styles.pricingContainer}>
//                 <View style={styles.pricingCard}>
//                   <Text style={styles.pricingPeriod}>Monthly</Text>
//                   <Text style={styles.pricingPrice}>$9.99</Text>
//                   <Text style={styles.pricingPer}>per month</Text>
//                   <View style={styles.pricingDivider} />
//                   <TouchableOpacity style={styles.pricingButton}>
//                     <Text style={styles.pricingButtonText}>Subscribe</Text>
//                   </TouchableOpacity>
//                 </View>
                
//                 <View style={[styles.pricingCard, styles.pricingCardPopular]}>
//                   <View style={styles.popularBadge}>
//                     <Text style={styles.popularBadgeText}>Best Value</Text>
//                   </View>
//                   <Text style={styles.pricingPeriod}>Yearly</Text>
//                   <Text style={[styles.pricingPrice, { color: '#FFD700' }]}>$79.99</Text>
//                   <Text style={styles.pricingPer}>$6.67 per month</Text>
//                   <View style={styles.pricingDivider} />
//                   <TouchableOpacity style={[styles.pricingButton, styles.pricingButtonPopular]}>
//                     <Text style={[styles.pricingButtonText, { color: '#fff' }]}>Subscribe</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           ) : (
//             <View style={styles.premiumActiveContainer}>
//               <FontAwesome5 name="crown" size={60} color="#FFD700" />
//               <Text style={styles.premiumActiveTitle}>You're a Premium Member!</Text>
//               <Text style={styles.premiumActiveSubtitle}>
//                 Thank you for supporting us. Enjoy all the exclusive features!
//               </Text>
//               <View style={styles.premiumActiveStats}>
//                 <View style={styles.premiumStat}>
//                   <Text style={styles.premiumStatValue}>12</Text>
//                   <Text style={styles.premiumStatLabel}>Days Active</Text>
//                 </View>
//                 <View style={styles.premiumDivider} />
//                 <View style={styles.premiumStat}>
//                   <Text style={styles.premiumStatValue}>1,234</Text>
//                   <Text style={styles.premiumStatLabel}>Coins Earned</Text>
//                 </View>
//                 <View style={styles.premiumDivider} />
//                 <View style={styles.premiumStat}>
//                   <Text style={styles.premiumStatValue}>45</Text>
//                   <Text style={styles.premiumStatLabel}>Posts Boosted</Text>
//                 </View>
//               </View>
//             </View>
//           )}
//         </LinearGradient>

//         {/* Features Grid Section */}
//         <View style={styles.featuresContainer}>
//           <Text style={styles.sectionTitle}>Exclusive Features</Text>
//           <Text style={styles.sectionSubtitle}>
//             Choose any feature to learn more
//           </Text>

//           <View style={styles.featuresGrid}>
//             {premiumFeatures.map((feature) => (
//               <TouchableOpacity
//                 key={feature.id}
//                 style={styles.featureCard}
//                 onPress={() => handleFeaturePress(feature)}
//                 activeOpacity={0.7}
//               >
//                 <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
//                   {feature.iconType === 'FontAwesome5' && (
//                     <FontAwesome5 name={feature.icon} size={24} color="#fff" />
//                   )}
//                   {feature.iconType === 'Ionicons' && (
//                     <Ionicons name={feature.icon} size={24} color="#fff" />
//                   )}
//                   {feature.iconType === 'MaterialIcons' && (
//                     <MaterialIcons name={feature.icon} size={24} color="#fff" />
//                   )}
//                   {feature.iconType === 'MaterialCommunityIcons' && (
//                     <MaterialCommunityIcons name={feature.icon} size={24} color="#fff" />
//                   )}
//                 </View>
//                 <Text style={styles.featureTitle} numberOfLines={2}>
//                   {feature.title}
//                 </Text>
//                 <Text style={styles.featureDescription} numberOfLines={2}>
//                   {feature.description}
//                 </Text>
                
//                 <TouchableOpacity style={styles.learnMoreButton}>
//                   <Text style={styles.learnMoreText}>Learn More</Text>
//                   <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
//                 </TouchableOpacity>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Footer Section */}
//         <View style={styles.footerContainer}>
//           <Text style={styles.footerText}>✨ More features coming every month</Text>
//           <View style={styles.footerIcons}>
//             <FontAwesome5 name="crown" size={20} color="#FFD700" />
//             <FontAwesome5 name="star" size={20} color="#FFD700" style={styles.footerIcon} />
//             <FontAwesome5 name="gem" size={20} color="#FFD700" style={styles.footerIcon} />
//           </View>
//         </View>
//       </ScrollView>

//       {/* Feature Detail Modal */}
//       {showDetail && renderFeatureDetail()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   headerContainer: {
//     paddingBottom: 30,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 20,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   headerRight: {
//     width: 40,
//   },
//   premiumCtaContainer: {
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   crownIconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 215, 0, 0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   premiumTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 8,
//   },
//   premiumSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.8)',
//     textAlign: 'center',
//     marginBottom: 25,
//     paddingHorizontal: 20,
//   },
//   subscribeMainButton: {
//     width: '100%',
//     maxWidth: 300,
//     marginBottom: 30,
//   },
//   subscribeMainButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 30,
//     gap: 12,
//   },
//   subscribeMainButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a2e',
//   },
//   pricingContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 15,
//     width: '100%',
//     maxWidth: 500,
//   },
//   pricingCard: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   pricingCardPopular: {
//     backgroundColor: 'rgba(255, 215, 0, 0.15)',
//     borderColor: '#FFD700',
//   },
//   popularBadge: {
//     backgroundColor: '#FFD700',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginBottom: 10,
//   },
//   popularBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#1a1a2e',
//   },
//   pricingPeriod: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.7)',
//     marginBottom: 5,
//   },
//   pricingPrice: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 2,
//   },
//   pricingPer: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.6)',
//     marginBottom: 15,
//   },
//   pricingDivider: {
//     width: '100%',
//     height: 1,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     marginBottom: 15,
//   },
//   pricingButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   pricingButtonPopular: {
//     backgroundColor: '#FFD700',
//   },
//   pricingButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   premiumActiveContainer: {
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   premiumActiveTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFD700',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   premiumActiveSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   premiumActiveStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     borderRadius: 15,
//     paddingVertical: 15,
//   },
//   premiumStat: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   premiumStatValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   premiumStatLabel: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.6)',
//     marginTop: 2,
//   },
//   premiumDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   featuresContainer: {
//     paddingHorizontal: 15,
//     paddingVertical: 20,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1a1a2e',
//     marginBottom: 5,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//   },
//   featuresGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   featureCard: {
//     width: (width - 45) / 2,
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   featureIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   featureTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1a1a2e',
//     marginBottom: 4,
//     minHeight: 40,
//   },
//   featureDescription: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 10,
//     minHeight: 36,
//   },
//   comingSoonBadge: {
//     backgroundColor: '#FF6B35',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     marginBottom: 8,
//   },
//   comingSoonBadgeText: {
//     fontSize: 10,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   learnMoreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   learnMoreText: {
//     fontSize: 12,
//     color: '#FF6B35',
//     fontWeight: '600',
//     marginRight: 2,
//   },
//   footerContainer: {
//     paddingVertical: 30,
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   footerIcons: {
//     flexDirection: 'row',
//     gap: 15,
//   },
//   footerIcon: {
//     marginLeft: 15,
//   },
//   detailModalOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   detailModalBackdrop: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   detailModal: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     width: width - 40,
//     maxHeight: height - 100,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   detailModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   detailIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeDetailButton: {
//     padding: 5,
//   },
//   detailTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1a1a2e',
//     marginBottom: 10,
//   },
//   detailDescription: {
//     fontSize: 15,
//     color: '#555',
//     marginBottom: 15,
//     lineHeight: 22,
//   },
//   detailBenefitsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1a1a2e',
//     marginBottom: 10,
//   },
//   benefitItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   benefitText: {
//     fontSize: 14,
//     color: '#444',
//     marginLeft: 10,
//     flex: 1,
//   },
//   subscribeButton: {
//     marginTop: 20,
//   },
//   subscribeButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     borderRadius: 12,
//     gap: 10,
//   },
//   subscribeButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   comingSoonContainer: {
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   comingSoonText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FF6B35',
//     marginBottom: 8,
//   },
//   comingSoonSubtext: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   comingSoonProgress: {
//     width: '100%',
//     height: 8,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 4,
//     overflow: 'hidden',
//     marginBottom: 8,
//   },
//   comingSoonProgressBar: {
//     height: '100%',
//     backgroundColor: '#FF6B35',
//     borderRadius: 4,
//   },
//   comingSoonProgressText: {
//     fontSize: 12,
//     color: '#666',
//   },
// });

// export default PremiumScreen;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const PremiumScreen = ({ navigation }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Premium Features Data
  const premiumFeatures = [
    {
      id: 'badge',
      icon: 'crown',
      iconType: 'FontAwesome5',
      title: 'Premium Badge & Profile',
      description: 'Stand out with an exclusive gold crown badge and premium profile themes',
      benefits: [
        'Gold crown badge next to your name',
        'Custom profile themes and colors',
        'Exclusive avatar frames',
        'Priority in search results',
      ],
      comingSoon: false,
      color: '#FFD700',
    },
    {
      id: 'adfree',
      icon: 'remove-circle-outline',
      iconType: 'Ionicons',
      title: 'Ad-Free Experience',
      description: 'Enjoy the app without any interruptions from ads',
      benefits: [
        'No banner ads anywhere',
        'No video ads between content',
        'Faster app performance',
        'Clean and distraction-free browsing',
      ],
      comingSoon: false,
      color: '#4CAF50',
    },
    {
      id: 'doublecoins',
      icon: 'coins',
      iconType: 'FontAwesome5',
      title: 'Double Coins Rewards',
      description: 'Earn 2x coins on all your activities and engagement',
      benefits: [
        '2x coins for every like',
        '2x coins for every comment',
        '2x coins for watching videos',
        '2x coins for daily login',
        'Bonus coins for sharing content',
      ],
      comingSoon: false,
      color: '#FF6B35',
    },
    {
      id: 'exclusivecontent',
      icon: 'lock-open-outline',
      iconType: 'Ionicons',
      title: 'Exclusive Content',
      description: 'Access premium-only posts and live streams',
      benefits: [
        'Create premium-only posts',
        'Join exclusive live streams',
        'Access to premium groups',
        'Early access to new features',
      ],
      comingSoon: true,
      color: '#9C27B0',
    },
    {
      id: 'analytics',
      icon: 'analytics-outline',
      iconType: 'Ionicons',
      title: 'Advanced Analytics',
      description: 'Get deep insights into your audience and content performance',
      benefits: [
        'Follower growth charts',
        'Demographic insights',
        'Top fans list',
        'Best time to post recommendations',
        'Post performance metrics',
      ],
      comingSoon: true,
      color: '#2196F3',
    },
    {
      id: 'readreceipts',
      icon: 'checkmark-done-circle-outline',
      iconType: 'Ionicons',
      title: 'Read Receipts',
      description: 'See exactly when your messages are read',
      benefits: [
        'Blue ticks on read messages',
        'Message delivery status',
        'View read time stamps',
        'Typing indicators',
      ],
      comingSoon: true,
      color: '#00BCD4',
    },
    {
      id: 'promote',
      icon: 'trending-up-outline',
      iconType: 'Ionicons',
      title: 'Post Promotion',
      description: 'Boost your content to reach more people',
      benefits: [
        'Promote any post instantly',
        'Targeted audience reach',
        'Boost visibility in feeds',
        'Get more engagement',
        'Track promotion performance',
      ],
      comingSoon: true,
      color: '#FF4081',
    },
    {
      id: 'higherearnings',
      icon: 'cash-outline',
      iconType: 'Ionicons',
      title: 'Higher Earning Potential',
      description: 'Maximize your earnings with premium benefits',
      benefits: [
        'Higher coin conversion rates',
        'Reduced withdrawal fees (only 2%)',
        'Exclusive earning challenges',
        'Weekly bonus rewards',
        'Priority withdrawal processing',
      ],
      comingSoon: false,
      color: '#FF9800',
    },
    {
      id: 'advancedbusiness',
      icon: 'storefront-outline',
      iconType: 'Ionicons',
      title: 'Advanced Business Tools',
      description: 'Professional tools for business accounts',
      benefits: [
        'Premium storefront layout',
        'Multiple business profiles',
        'Advanced listing analytics',
        'Monetization fast-track',
        'Business insights dashboard',
      ],
      comingSoon: true,
      color: '#795548',
    },
    {
      id: 'loyaltyrewards',
      icon: 'gift-outline',
      iconType: 'Ionicons',
      title: 'Loyalty Rewards',
      description: 'Get rewarded for staying with us',
      benefits: [
        'Monthly bonus coins',
        'Special anniversary rewards',
        'Exclusive badges for milestones',
        'VIP event invitations',
        'Birthday bonuses',
      ],
      comingSoon: true,
      color: '#E91E63',
    },
    {
      id: 'higherlimits',
      icon: 'cloud-upload-outline',
      iconType: 'Ionicons',
      title: 'Higher Upload Limits',
      description: 'Upload larger and higher quality content',
      benefits: [
        '4K video uploads',
        'Higher resolution images',
        'Larger file sizes (up to 500MB)',
        'Faster upload speeds',
        'Unlimited media storage',
      ],
      comingSoon: false,
      color: '#607D8B',
    },
    {
      id: 'extendedstories',
      icon: 'time-outline',
      iconType: 'Ionicons',
      title: 'Extended Stories Duration',
      description: 'Keep your stories visible for longer',
      benefits: [
        'Stories last 48 hours (instead of 24)',
        'Highlight your best stories',
        'Create story collections',
        'Pin stories to your profile',
      ],
      comingSoon: true,
      color: '#FF5722',
    },
  ];

  // Free Games Data
  const freeGames = [
    {
      id: '1',
      title: 'Solitaire',
      icon: 'cards-outline',
      iconType: 'Ionicons',
      color: '#4CAF50',
      plays: '12.5K',
      rating: 4.7,
    },
    {
      id: '2',
      title: 'Chess',
      icon: 'chess-king',
      iconType: 'FontAwesome5',
      color: '#2196F3',
      plays: '8.2K',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Tic Tac Toe',
      icon: 'grid-outline',
      iconType: 'Ionicons',
      color: '#FF6B35',
      plays: '15.8K',
      rating: 4.5,
    },
    {
      id: '4',
      title: 'Memory Match',
      icon: 'brain-outline',
      iconType: 'Ionicons',
      color: '#9C27B0',
      plays: '6.3K',
      rating: 4.6,
    },
    {
      id: '5',
      title: 'Snake',
      icon: 'snake',
      iconType: 'FontAwesome5',
      color: '#FF5722',
      plays: '9.1K',
      rating: 4.4,
    },
    {
      id: '6',
      title: 'Puzzle',
      icon: 'puzzle-outline',
      iconType: 'Ionicons',
      color: '#00BCD4',
      plays: '11.7K',
      rating: 4.8,
    },
  ];

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back()),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation (continuous)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Spinning animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleFeaturePress = (feature) => {
    setSelectedDetail(feature);
    setShowDetail(true);
  };

  const handleGamePress = (game) => {
    navigation.navigate('GameDetail', { game });
  };

  const renderFeatureDetail = () => {
    if (!selectedDetail) return null;

    return (
      <Animated.View 
        style={[
          styles.detailModalOverlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.detailModalBackdrop}
          activeOpacity={1}
          onPress={() => setShowDetail(false)}
        />
        <Animated.View 
          style={[
            styles.detailModal,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <View style={styles.detailModalHeader}>
            <Animated.View 
              style={[
                styles.detailIconContainer, 
                { 
                  backgroundColor: selectedDetail.color,
                  transform: [{ rotate: spin }],
                }
              ]}
            >
              {selectedDetail.iconType === 'FontAwesome5' && (
                <FontAwesome5 name={selectedDetail.icon} size={30} color="#fff" />
              )}
              {selectedDetail.iconType === 'Ionicons' && (
                <Ionicons name={selectedDetail.icon} size={30} color="#fff" />
              )}
            </Animated.View>
            <TouchableOpacity
              style={styles.closeDetailButton}
              onPress={() => setShowDetail(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.detailTitle}>{selectedDetail.title}</Text>
          
          {selectedDetail.comingSoon ? (
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>🚀 COMING SOON</Text>
              <Text style={styles.comingSoonSubtext}>
                We're working hard to bring this feature to you!
              </Text>
              <View style={styles.comingSoonProgress}>
                <Animated.View 
                  style={[
                    styles.comingSoonProgressBar, 
                    { 
                      width: '60%',
                    }
                  ]} 
                />
              </View>
              <Text style={styles.comingSoonProgressText}>60% complete</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.detailDescription}>{selectedDetail.description}</Text>
              <Text style={styles.detailBenefitsTitle}>✨ What you get:</Text>
              {selectedDetail.benefits.map((benefit, index) => (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.benefitItem,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateX: slideAnim }],
                    }
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </Animated.View>
              ))}
              <TouchableOpacity style={styles.subscribeButton}>
                <LinearGradient
                  colors={['#FF6B35', '#FF3D00']}
                  style={styles.subscribeButtonGradient}
                >
                  <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                  <Icon name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    );
  };

  const renderGameItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.gameCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <TouchableOpacity
        style={styles.gameCardTouchable}
        // onPress={() => handleGamePress(item)}
        onPress={() => navigation.navigate('Games')}
        activeOpacity={0.7}
      >
        <View style={[styles.gameIconContainer, { backgroundColor: item.color }]}>
          {item.iconType === 'FontAwesome5' && (
            <FontAwesome5 name={item.icon} size={28} color="#fff" />
          )}
          {item.iconType === 'Ionicons' && (
            <Ionicons name={item.icon} size={28} color="#fff" />
          )}
        </View>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <View style={styles.gameStats}>
          <View style={styles.gameStat}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.gameStatText}>{item.plays}</Text>
          </View>
          <View style={styles.gameStat}>
            <Ionicons name="star-outline" size={14} color="#666" />
            <Text style={styles.gameStatText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.playButton}>
          <Text style={styles.playButtonText}>Play Now</Text>
          <Ionicons name="play" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.headerContainer}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Premium</Text>
            <View style={styles.headerRight} />
          </View>
          
          {!isPremium ? (
            <Animated.View 
              style={[
                styles.premiumCtaContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <Animated.View 
                style={[
                  styles.crownIconContainer,
                  {
                    transform: [{ scale: pulseAnim }],
                  }
                ]}
              >
                <FontAwesome5 name="crown" size={50} color="#FFD700" />
              </Animated.View>
              <Text style={styles.premiumTitle}>Go Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Unlock exclusive features and take your experience to the next level
              </Text>
              
              <TouchableOpacity style={styles.subscribeMainButton}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.subscribeMainButtonGradient}
                >
                  <Text style={styles.subscribeMainButtonText}>Subscribe Now</Text>
                  <FontAwesome5 name="crown" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.pricingContainer}>
                <Animated.View 
                  style={[
                    styles.pricingCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateX: slideAnim }],
                    }
                  ]}
                >
                  <Text style={styles.pricingPeriod}>Monthly</Text>
                  <Text style={styles.pricingPrice}>$9.99</Text>
                  <Text style={styles.pricingPer}>per month</Text>
                  <View style={styles.pricingDivider} />
                  <TouchableOpacity style={styles.pricingButton}>
                    <Text style={styles.pricingButtonText}>Subscribe</Text>
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View 
                  style={[
                    styles.pricingCard, 
                    styles.pricingCardPopular,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateX: Animated.multiply(slideAnim, -1) }],
                    }
                  ]}
                >
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Best Value</Text>
                  </View>
                  <Text style={styles.pricingPeriod}>Yearly</Text>
                  <Text style={[styles.pricingPrice, { color: '#FFD700' }]}>$79.99</Text>
                  <Text style={styles.pricingPer}>$6.67 per month</Text>
                  <View style={styles.pricingDivider} />
                  <TouchableOpacity style={[styles.pricingButton, styles.pricingButtonPopular]}>
                    <Text style={[styles.pricingButtonText, { color: '#fff' }]}>Subscribe</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Animated.View>
          ) : (
            <Animated.View 
              style={[
                styles.premiumActiveContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <FontAwesome5 name="crown" size={60} color="#FFD700" />
              </Animated.View>
              <Text style={styles.premiumActiveTitle}>You're a Premium Member!</Text>
              <Text style={styles.premiumActiveSubtitle}>
                Thank you for supporting us. Enjoy all the exclusive features!
              </Text>
              <View style={styles.premiumActiveStats}>
                <View style={styles.premiumStat}>
                  <Text style={styles.premiumStatValue}>12</Text>
                  <Text style={styles.premiumStatLabel}>Days Active</Text>
                </View>
                <View style={styles.premiumDivider} />
                <View style={styles.premiumStat}>
                  <Text style={styles.premiumStatValue}>1,234</Text>
                  <Text style={styles.premiumStatLabel}>Coins Earned</Text>
                </View>
                <View style={styles.premiumDivider} />
                <View style={styles.premiumStat}>
                  <Text style={styles.premiumStatValue}>45</Text>
                  <Text style={styles.premiumStatLabel}>Posts Boosted</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </LinearGradient>

        {/* Features Grid Section */}
        <Animated.View 
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Exclusive Features</Text>
          <Text style={styles.sectionSubtitle}>
            Choose any feature to learn more
          </Text>

          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature, index) => (
              <Animated.View
                key={feature.id}
                style={[
                  styles.featureCardWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.featureCard}
                  onPress={() => handleFeaturePress(feature)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                    {feature.iconType === 'FontAwesome5' && (
                      <FontAwesome5 name={feature.icon} size={24} color="#fff" />
                    )}
                    {feature.iconType === 'Ionicons' && (
                      <Ionicons name={feature.icon} size={24} color="#fff" />
                    )}
                    {feature.iconType === 'MaterialIcons' && (
                      <MaterialIcons name={feature.icon} size={24} color="#fff" />
                    )}
                    {feature.iconType === 'MaterialCommunityIcons' && (
                      <MaterialCommunityIcons name={feature.icon} size={24} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.featureTitle} numberOfLines={2}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription} numberOfLines={2}>
                    {feature.description}
                  </Text>
                  
                  {feature.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonBadgeText}>Soon</Text>
                    </View>
                  )}
                  
                  <TouchableOpacity style={styles.learnMoreButton}>
                    <Text style={styles.learnMoreText}>Learn More</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Free Games Section */}
        <Animated.View 
          style={[
            styles.gamesSection,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <View style={styles.gamesHeader}>
            <View>
              <Text style={styles.sectionTitle}>🎮 Free Games</Text>
              <Text style={styles.sectionSubtitle}>
               free games for you
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Games')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color="#FF6B35" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={freeGames}
            renderItem={renderGameItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gamesList}
          />
        </Animated.View>

        {/* Footer Section */}
        <Animated.View 
          style={[
            styles.footerContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.footerText}>More features coming every month</Text>
          <View style={styles.footerIcons}>
            <FontAwesome5 name="crown" size={20} color="#FFD700" />
            <FontAwesome5 name="star" size={20} color="#FFD700" style={styles.footerIcon} />
            <FontAwesome5 name="gem" size={20} color="#FFD700" style={styles.footerIcon} />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Feature Detail Modal */}
      {showDetail && renderFeatureDetail()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  premiumCtaContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  crownIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  premiumTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  subscribeMainButton: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  subscribeMainButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
  },
  subscribeMainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
    maxWidth: 500,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pricingCardPopular: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
  },
  popularBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  pricingPeriod: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 5,
  },
  pricingPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  pricingPer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 15,
  },
  pricingDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 15,
  },
  pricingButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  pricingButtonPopular: {
    backgroundColor: '#FFD700',
  },
  pricingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  premiumActiveContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  premiumActiveTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
    marginBottom: 5,
  },
  premiumActiveSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  premiumActiveStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    paddingVertical: 15,
  },
  premiumStat: {
    alignItems: 'center',
    flex: 1,
  },
  premiumStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  premiumDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  featuresContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCardWrapper: {
    width: (width - 45) / 2,
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
    minHeight: 40,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    minHeight: 36,
  },
  comingSoonBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  comingSoonBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  learnMoreText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 2,
  },
  gamesSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  gamesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  gamesList: {
    paddingBottom: 10,
  },
  gameCard: {
    width: 140,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginRight: 12,
    alignItems: 'center',
  },
  gameCardTouchable: {
    alignItems: 'center',
    width: '100%',
  },
  gameIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
  },
  gameStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gameStatText: {
    fontSize: 11,
    color: '#666',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  playButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  footerContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  footerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  footerIcon: {
    marginLeft: 15,
  },
  detailModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  detailModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  detailModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: height - 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeDetailButton: {
    padding: 5,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
    lineHeight: 22,
  },
  detailBenefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  subscribeButton: {
    marginTop: 20,
  },
  subscribeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  comingSoonProgress: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  comingSoonProgressBar: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  comingSoonProgressText: {
    fontSize: 12,
    color: '#666',
  },
});

export default PremiumScreen;