// import React, { useState, useEffect } from "react";
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   Modal,
//   TouchableWithoutFeedback,
//   Alert
// } from "react-native";
// import Icon from "react-native-vector-icons/Feather";
// import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
// import Colors from "../../globalshared/constants/colors";

// const PricingScreen = ({ navigation, route }) => {
//   const {
//     name, age, language, profileImage, issues, job, customIssue, schedule_date, schedule_time, status
//   } = route.params || {};

//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const pricingPlans = [
//     {
//       type: "chat",
//       title: "Chat Sessions",
//       icon: "message-text",
//       iconType: "material",
//       description: "Ideal for quick advice or written conversations",
//       rate: "₦20",
//       perMinute: "per minute",
//       features: [
//         "10 minutes chat: ₦200",
//         "30 minutes chat: ₦600", 
//         "24/7 availability",
//       ],
//       color: '#FF3366',
//       recommendedDuration: "30 minutes"
//     },
//     {
//       type: "call",
//       title: "Voice Calls",
//       icon: "phone",
//       iconType: "feather", 
//       description: "Perfect for real-time discussions without video",
//       rate: "₦50",
//       perMinute: "per minute",
//       features: [
//         "10 minutes call: ₦500",
//         "30 minutes call: ₦1,500",
//         "Crystal clear audio quality", 
//       ],
//       color: '#FF6F00',
//       recommendedDuration: "30 minutes"
//     },
//     {
//       type: "video",
//       title: "Video Calls", 
//       icon: "video",
//       iconType: "feather",
//       description: "For face-to-face conversations with deeper connection",
//       rate: "₦100",
//       perMinute: "per minute",
//       features: [
//         "15 minutes video: ₦1,500",
//         "30 minutes video: ₦3,000",
//         "HD video quality",
//       ],
//       color: '#FF3366',
//       recommendedDuration: "30 minutes"
//     }
//   ];

//   const handlePlanSelect = (plan) => {
//     setSelectedPlan(plan);
//     setShowModal(true);
//   };

//   const handleContinueToPayment = () => {
//     if (!selectedPlan) return;
//     setShowModal(false);
//     setShowPaymentModal(true);
//   };

//   const calculateAmount = (plan) => {
//     if (!plan) return 0;
    
//     switch(plan.type) {
//       case "chat":
//         return 600;
//       case "call":
//         return 1500;
//       case "video":
//         return 3000;
//       default:
//         return 0;
//     }
//   };

//   const sendDataToAPI = async () => {
//     if (!selectedPlan) return;

//     setIsProcessing(true);
    
//     try {
//       const formData = new FormData();
      
//       if (name) formData.append('name', name);
//       if (age) formData.append('age', age.toString()); 
//       if (language) formData.append('languages', language);
//       if (job) formData.append('occupation', job);
     

//       if (issues) {
//         if(Array.isArray(issues)){
//           formData.append('topic_interested', JSON.stringify(issues))
//         }else{
//           formData.append('topic_interested',JSON.stringify([issues]))
//         }
        
//       } 

//       if (schedule_date && schedule_time) {
//         const formattedDateTime = `${schedule_date} ${schedule_time}`;
//         formData.append('schedule_day_date_time', formattedDateTime);
//       } else if (schedule_date) {
//         formData.append('schedule_day_date_time', schedule_date);
//       }
      
//       if (status) formData.append('status', status);
      
//       if (profileImage) {
//         // Extract file name from URI=====
//         let fileName = 'profile.jpg';
//         if (profileImage.includes('/')) {
//           fileName = profileImage.split('/').pop();
//         }
        
//         formData.append('profile_image', {
//           uri: profileImage,
//           type: 'image/jpeg',
//           name: fileName
//         });
//       }

//       console.log('Sending form data with fields:', {
//         name, age, job, schedule_date, schedule_time, status,
//         selected_plan: selectedPlan.type,
//         amount: calculateAmount(selectedPlan)
//       });

//       const response = await fetch('http://192.168.1.105:8000/api/companion/profiles/', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();

//       if (response.ok) {
//          setShowPaymentModal(false);
//           navigation.navigate('CDashboard');
      
//       } else {
//         console.error('API Error Response:', result);
//         throw new Error(result.detail || result.message || JSON.stringify(result) || 'Payment failed');
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       Alert.alert(
//         'Payment Failed',
//         `There was an issue processing your payment: ${error.message}`,
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               setShowPaymentModal(false);
//               setIsProcessing(false);
//             }
//           }
//         ]
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleAcceptPayment = () => {
//     Alert.alert(
//       "Confirm Payment",
//       `When you accept, ₦${calculateAmount(selectedPlan)} will be deducted from your wallet to pay for the ${selectedPlan?.title} session.`,
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//           onPress: () => setShowPaymentModal(false)
//         },
//         {
//           text: "Accept",
//           onPress: sendDataToAPI
//         }
//       ]
//     );
//   };  

//   const PlanDetailsModal = () => (
//     <Modal
//       visible={showModal}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setShowModal(false)}
//     >
//       <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
//         <View style={styles.modalOverlay}>
//           <TouchableWithoutFeedback>
//             <View style={styles.modalContent}>
//               <TouchableOpacity>
//                 <View style={styles.modalHeader}>
//                   <View style={styles.modalIconContainer}>
//                     {selectedPlan?.iconType === "material" ? (
//                       <MaterialIcon 
//                         name={selectedPlan?.icon} 
//                         size={28} 
//                         color={Colors.white} 
//                       />
//                     ) : (
//                       <Icon 
//                         name={selectedPlan?.icon} 
//                         size={28} 
//                         color={Colors.white} 
//                       />
//                     )}
//                   </View>
//                   <View style={styles.modalTitleContainer}>
//                     <Text style={styles.modalTitle}>{selectedPlan?.title || "Plan Details"}</Text>
//                     <Text style={styles.modalSubtitle}>{selectedPlan?.description || ""}</Text>
//                   </View>
//                   <TouchableOpacity 
//                     style={styles.closeButton}
//                     onPress={() => setShowModal(false)}
//                   >
//                     <Icon name="x" size={24} color={Colors.textTertiary} />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.modalPricingSection}>
//                   <View style={styles.priceDisplay}>
//                     <Text style={styles.modalRate}>{selectedPlan?.rate || "₦0"}</Text>
//                     <Text style={styles.modalPerMinute}>{selectedPlan?.perMinute || "per minute"}</Text>
//                   </View>
//                   {selectedPlan?.recommendedDuration && (
//                     <View style={styles.recommendedBadge}>
//                       <Icon name="star" size={16} color={Colors.white} />
//                       <Text style={styles.recommendedText}>Recommended: {selectedPlan.recommendedDuration}</Text>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.featuresList}>
//                   <Text style={styles.featuresTitle}>What's included:</Text>
//                   {selectedPlan?.features?.map((feature, index) => (
//                     <View key={index} style={styles.featureItem}>
//                       <View style={[styles.featureIcon, { backgroundColor: `${selectedPlan?.color || Colors.primary}15` }]}>
//                         <Icon name="check" size={16} color={selectedPlan?.color || Colors.primary} />
//                       </View>
//                       <Text style={styles.featureText}>{feature}</Text>
//                     </View>
//                   )) || (
//                     <Text style={styles.noFeaturesText}>No features available</Text>
//                   )}
//                 </View>

//                 <View style={styles.totalSection}>
//                   <Text style={styles.totalLabel}>Total for {selectedPlan?.recommendedDuration || "session"}:</Text>
//                   <Text style={styles.totalAmount}>₦{calculateAmount(selectedPlan)}</Text>
//                 </View>

//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity 
//                     style={styles.secondaryModalButton}
//                     onPress={() => setShowModal(false)}
//                   >
//                     <Text style={styles.secondaryModalButtonText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity 
//                     style={[
//                       styles.primaryModalButton,
//                       !selectedPlan && styles.primaryModalButtonDisabled
//                     ]}
//                     onPress={handleContinueToPayment}
//                     disabled={!selectedPlan}
//                   >
//                     <Text style={styles.primaryModalButtonText}>Continue to Payment</Text>
//                     <Icon name="credit-card" size={18} color={Colors.white} />
//                   </TouchableOpacity>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );

//   const PaymentConfirmationModal = () => (
//     <Modal
//       visible={showPaymentModal}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setShowPaymentModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.paymentModalContent}>
//           {/* Payment Modal Header */}
//           <View style={styles.paymentModalHeader}>
//             <View style={styles.paymentIconContainer}>
//               <Icon name="credit-card" size={32} color={Colors.white} />
//             </View>
//             <Text style={styles.paymentModalTitle}>Payment Confirmation</Text>
//             <Text style={styles.paymentModalSubtitle}>
//               Confirm your payment details
//             </Text>
//           </View>

//           {/* Payment Details */}
//           <View style={styles.paymentDetails}>
//             <View style={styles.paymentDetailRow}>
//               <Text style={styles.paymentDetailLabel}>Plan Type:</Text>
//               <Text style={styles.paymentDetailValue}>{selectedPlan?.title}</Text>
//             </View>
//             <View style={styles.paymentDetailRow}>
//               <Text style={styles.paymentDetailLabel}>Duration:</Text>
//               <Text style={styles.paymentDetailValue}>{selectedPlan?.recommendedDuration}</Text>
//             </View>
//             <View style={styles.paymentDetailRow}>
//               <Text style={styles.paymentDetailLabel}>Rate:</Text>
//               <Text style={styles.paymentDetailValue}>{selectedPlan?.rate} per minute</Text>
//             </View>
//             <View style={[styles.paymentDetailRow, styles.totalRow]}>
//               <Text style={styles.totalPaymentLabel}>Total Amount:</Text>
//               <Text style={styles.totalPaymentValue}>₦{calculateAmount(selectedPlan)}</Text>
//             </View>
//           </View>

//           {/* Warning Message */}
//           {/* <View style={styles.warningBox}>
//             <Icon name="alert-circle" size={20} color={Colors.warning} />
//             <View style={styles.warningContent}>
//               <Text style={styles.warningTitle}>Important</Text>
//               <Text style={styles.warningText}>
//                 When you click "Accept & Pay", the amount of ₦{calculateAmount(selectedPlan)} will be deducted from your wallet balance.
//               </Text>
//             </View>
//           </View> */}

//           {/* Payment Buttons */}
//           <View style={styles.paymentButtons}>
//             <TouchableOpacity 
//               style={styles.cancelPaymentButton}
//               onPress={() => setShowPaymentModal(false)}
//               disabled={isProcessing}
//             >
//               <Text style={styles.cancelPaymentButtonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[
//                 styles.acceptPaymentButton,
//                 isProcessing && styles.acceptPaymentButtonDisabled
//               ]}
//               onPress={handleAcceptPayment}
//               disabled={isProcessing}
//             >
//               {isProcessing ? (
//                 <Text style={styles.acceptPaymentButtonText}>Processing...</Text>
//               ) : (
//                 <>
//                   <Text style={styles.acceptPaymentButtonText}>Accept & Pay</Text>
//                   <Icon name="check-circle" size={18} color={Colors.white} />
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="chevron-left" size={24} color={Colors.textPrimary} />
//         </TouchableOpacity>
//         <View style={styles.progressContainer}>
//           <Text style={styles.progressText}>Step 7 of 7</Text>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: '100%' }]} />
//           </View>
//         </View>
//       </View>

//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.titleSection}>
//           <View style={styles.titleIconContainer}>
//             <View style={styles.titleIcon}>
//               <Icon name="dollar-sign" size={24} color={Colors.primary} />
//             </View>
//             <View style={[styles.titleIcon, {marginLeft: 20}]}>
//               <Text style={{color: Colors.primary, fontSize: 20}}>₦</Text>
//             </View>
//           </View>
          
//           <Text style={styles.title}>Pricing Plans</Text>
//           <Text style={styles.greeting}>
//             Hello Talker <Text style={styles.emoji}>😊</Text>
//           </Text>
//           <Text style={styles.subtitle}>
//             We believe in fair and transparent pricing. Choose the session type that works best for you.
//           </Text>
//         </View>

//         {/* Pricing Section */}
//         <View style={styles.pricingSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Pay-Per-Minute Pricing</Text>
//             <Text style={styles.sectionSubtitle}>
//               You're only charged for the time you use. No hidden fees, no commitments.
//             </Text>
//           </View>

//           {/* Pricing Cards */}
//           {pricingPlans.map((plan, index) => (
//             <TouchableOpacity 
//               key={plan.type}
//               onPress={() => handlePlanSelect(plan)}
//               activeOpacity={0.7}
//             >
//               <View style={styles.pricingCard}>
//                 {/* Card Header */}
//                 <View style={styles.cardHeader}>
//                   <View style={[styles.iconContainer, { backgroundColor: `${plan.color}15` }]}>
//                     {plan.iconType === "material" ? (
//                       <MaterialIcon name={plan.icon} size={22} color={plan.color} />
//                     ) : (
//                       <Icon name={plan.icon} size={22} color={plan.color} />
//                     )}
//                   </View>
//                   <View style={styles.cardTitleContainer}>
//                     <Text style={styles.cardTitle}>{plan.title}</Text>
//                     <Text style={styles.cardDescription}>{plan.description}</Text>
//                   </View>
//                 </View>

//                 {/* Pricing */}
//                 <View style={styles.pricingContainer}>
//                   <View style={styles.rateContainer}>
//                     <Text style={styles.rate}>{plan.rate}</Text>
//                     <Text style={styles.perMinute}>{plan.perMinute}</Text>
//                   </View>
//                 </View>

//                 {/* Features */}
//                 <View style={styles.featuresContainer}>
//                   {plan.features.slice(0, 3).map((feature, featureIndex) => (
//                     <View key={featureIndex} style={styles.featureRow}>
//                       <View style={[styles.featureIcon, { backgroundColor: `${plan.color}15` }]}>
//                         <Icon name="check" size={14} color={plan.color} />
//                       </View>
//                       <Text style={styles.featureText}>{feature}</Text>
//                     </View>
//                   ))}
//                   {plan.features.length > 3 && (
//                     <View style={styles.moreFeatures}>
//                       <Text style={styles.moreFeaturesText}>
//                         +{plan.features.length - 3} more features
//                       </Text>
//                     </View>
//                   )}
//                 </View>

//                 {/* Popular Badge for Voice Calls */}
//                 {plan.type === "call" && (
//                   <View style={styles.popularBadge}>
//                     <Icon name="award" size={12} color={Colors.white} />
//                     <Text style={styles.popularBadgeText}>Most Popular</Text>
//                   </View>
//                 )}

//                 {/* Select Button */}
//                 <View style={styles.selectButton}>
//                   <Text style={styles.selectButtonText}>Select Plan</Text>
//                   <Icon name="chevron-right" size={16} color={Colors.primary} />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Info Section */}
//         <View style={styles.infoSection}>
//           <View style={styles.infoBox}>
//             <Icon name="shield" size={18} color={Colors.primary} />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoTitle}>Transparent & Secure</Text>
//               <Text style={styles.infoText}>
//                 Your payment information is securely encrypted. You'll only be charged for the actual time spent in session.
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Plan Details Modal */}
//       <PlanDetailsModal />
      
//       {/* Payment Confirmation Modal */}
//       <PaymentConfirmationModal />
//     </View>
//   );
// };

// // ... (keep all your existing styles exactly as they were) ...

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 10,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: Colors.white,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     alignSelf: 'flex-start',
//     marginBottom: 20,
//   },
//   progressContainer: {
//     marginBottom: 10,
//   },
//   progressText: {
//     fontSize: 14,
//     color: Colors.textTertiary,
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: Colors.border,
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: Colors.primary,
//     borderRadius: 3,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//   },
//   titleSection: {
//     marginBottom: 30,
//   },
//   titleIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   titleIconContainer: {
//     flexDirection: 'row',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: 8,
//     lineHeight: 34,
//   },
//   greeting: {
//     fontSize: 18,
//     color: Colors.textSecondary,
//     marginBottom: 12,
//     fontWeight: '500',
//   },
//   emoji: {
//     fontSize: 20,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     lineHeight: 22,
//   },
//   pricingSection: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   sectionSubtitle: {
//     fontSize: 15,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//   },
//   pricingCard: {
//     backgroundColor: Colors.white,
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     position: 'relative',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 16,
//   },
//   iconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   cardTitleContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: 4,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 18,
//   },
//   pricingContainer: {
//     marginBottom: 16,
//   },
//   rateContainer: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//   },
//   rate: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.primary,
//     marginRight: 8,
//   },
//   perMinute: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   featuresContainer: {
//     marginBottom: 8,
//   },
//   featureRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   featureIcon: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   featureText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     flex: 1,
//   },
//   moreFeatures: {
//     marginTop: 8,
//   },
//   moreFeaturesText: {
//     fontSize: 13,
//     color: Colors.primary,
//     fontWeight: '500',
//     fontStyle: 'italic',
//   },
//   popularBadge: {
//     position: 'absolute',
//     top: -10,
//     right: 20,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   popularBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: Colors.white,
//   },
//   selectButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     marginTop: 8,
//   },
//   selectButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.primary,
//     marginRight: 8,
//   },
//   infoSection: {
//     marginBottom: 24,
//   },
//   infoBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: 'rgba(255, 51, 102, 0.05)',
//     padding: 16,
//     borderRadius: 16,
//     borderLeftWidth: 3,
//     borderLeftColor: Colors.primary,
//   },
//   infoContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//     marginBottom: 4,
//   },
//   infoText: {
//     fontSize: 13,
//     color: Colors.textSecondary,
//     lineHeight: 18,
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderRadius: 24,
//     padding: 0,
//     width: '100%',
//     maxHeight: '100%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     padding: 24,
//     backgroundColor: Colors.primary,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },
//   modalIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   modalTitleContainer: {
//     flex: 1,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: Colors.white,
//     marginBottom: 4,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     lineHeight: 18,
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalPricingSection: {
//     padding: 24,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   priceDisplay: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     marginBottom: 12,
//   },
//   modalRate: {
//     fontSize: 36,
//     fontWeight: '800',
//     color: Colors.primary,
//     marginRight: 8,
//   },
//   modalPerMinute: {
//     fontSize: 18,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   recommendedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     gap: 6,
//   },
//   recommendedText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: Colors.primary,
//   },
//   featuresList: {
//     padding: 24,
//     maxHeight: 300,
//   },
//   featuresTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//     marginBottom: 16,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   noFeaturesText: {
//     fontSize: 14,
//     color: Colors.textTertiary,
//     fontStyle: 'italic',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   totalSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 24,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     backgroundColor: 'rgba(255, 51, 102, 0.05)',
//   },
//   totalLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//   },
//   totalAmount: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.primary,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     padding: 24,
//     gap: 12,
//   },
//   secondaryModalButton: {
//     flex: 1,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   secondaryModalButtonText: {
//     color: Colors.textSecondary,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   primaryModalButton: {
//     flex: 2,
//     backgroundColor: Colors.primary,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 8,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   primaryModalButtonDisabled: {
//     backgroundColor: Colors.textTertiary,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.1,
//   },
//   primaryModalButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     fontSize: 16,
//   },

//   paymentModalContent: {
//     backgroundColor: Colors.white,
//     borderRadius: 24,
//     padding: 0,
//     width: '95%',
//     maxHeight: '100%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   paymentModalHeader: {
//     backgroundColor: Colors.primary,
//     padding: 24,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     alignItems: 'center',
//   },
//   paymentIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   paymentModalTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.white,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   paymentModalSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.9)',
//     textAlign: 'center',
//   },
//   paymentDetails: {
//     padding: 24,
//   },
//   paymentDetailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingVertical: 8,
//   },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     marginTop: 8,
//     paddingTop: 16,
//   },
//   paymentDetailLabel: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   paymentDetailValue: {
//     fontSize: 16,
//     color: Colors.textPrimary,
//     fontWeight: '600',
//   },
//   totalPaymentLabel: {
//     fontSize: 18,
//     color: Colors.textPrimary,
//     fontWeight: '700',
//   },
//   totalPaymentValue: {
//     fontSize: 20,
//     color: Colors.primary,
//     fontWeight: '800',
//   },
//   warningBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: 'rgba(255, 193, 7, 0.1)',
//     padding: 16,
//     margin: 24,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: Colors.warning,
//   },
//   warningContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   warningTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: Colors.warning,
//     marginBottom: 4,
//   },
//   warningText: {
//     fontSize: 13,
//     color: Colors.textSecondary,
//     lineHeight: 18,
//   },
//   paymentButtons: {
//     flexDirection: 'row',
//     padding: 24,
//     gap: 12,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   cancelPaymentButton: {
//     flex: 1,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   cancelPaymentButtonText: {
//     color: Colors.textSecondary,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   acceptPaymentButton: {
//     flex: 2,
//     backgroundColor: Colors.primary,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 8,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   acceptPaymentButtonDisabled: {
//     backgroundColor: Colors.textTertiary,
//   },
//   acceptPaymentButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   warning: {
//     color: Colors.warning,
//   },
// });

// export default PricingScreen;
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../globalshared/constants/colors";

const PricingScreen = ({ navigation, route }) => {
  const {
    name, age, language, profileImage, issues, job, customIssue, schedule_date, schedule_time, status
  } = route.params || {};

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pricingPlans = [
    {
      type: "chat",
      title: "Chat Sessions",
      icon: "message-text",
      iconType: "material",
      description: "Ideal for quick advice or written conversations",
      rate: "₦20",
      perMinute: "per minute",
      features: [
        "10 minutes chat: ₦200",
        "30 minutes chat: ₦600", 
        "24/7 availability",
      ],
      color: '#FF3366',
      recommendedDuration: "30 minutes"
    },
    {
      type: "call",
      title: "Voice Calls",
      icon: "phone",
      iconType: "feather", 
      description: "Perfect for real-time discussions without video",
      rate: "₦50",
      perMinute: "per minute",
      features: [
        "10 minutes call: ₦500",
        "30 minutes call: ₦1,500",
        "Crystal clear audio quality", 
      ],
      color: '#FF6F00',
      recommendedDuration: "30 minutes"
    },
    {
      type: "video",
      title: "Video Calls", 
      icon: "video",
      iconType: "feather",
      description: "For face-to-face conversations with deeper connection",
      rate: "₦100",
      perMinute: "per minute",
      features: [
        "15 minutes video: ₦1,500",
        "30 minutes video: ₦3,000",
        "HD video quality",
      ],
      color: '#FF3366',
      recommendedDuration: "30 minutes"
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleContinueToPayment = () => {
    if (!selectedPlan) return;
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const calculateAmount = (plan) => {
    if (!plan) return 0;
    
    switch(plan.type) {
      case "chat":
        return 600;
      case "call":
        return 1500;
      case "video":
        return 3000;
      default:
        return 0;
    }
  };

  const sendDataToAPI = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      
      if (name) formData.append('name', name);
      if (age) formData.append('age', age.toString()); 
      if (language) formData.append('languages', language);
      if (job) formData.append('occupation', job);
     

      if (issues) {
        if(Array.isArray(issues)){
          formData.append('topic_interested', JSON.stringify(issues))
        }else{
          formData.append('topic_interested',JSON.stringify([issues]))
        }
        
      } 

      if (schedule_date && schedule_time) {
        const formattedDateTime = `${schedule_date} ${schedule_time}`;
        formData.append('schedule_day_date_time', formattedDateTime);
      } else if (schedule_date) {
        formData.append('schedule_day_date_time', schedule_date);
      }
      
      if (status) formData.append('status', status);
      
      if (profileImage) {
        let fileName = 'profile.jpg';
        if (profileImage.includes('/')) {
          fileName = profileImage.split('/').pop();
        }
        
        formData.append('profile_image', {
          uri: profileImage,
          type: 'image/jpeg',
          name: fileName
        });
      }

      console.log('Sending form data with fields:', {
        name, age, job, schedule_date, schedule_time, status,
        selected_plan: selectedPlan.type,
        amount: calculateAmount(selectedPlan)
      });

      const response = await fetch('http://192.168.1.105:8000/api/companion/profiles/', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setShowPaymentModal(false);
        navigation.navigate('CDashboard');
      } else {
        console.error('API Error Response:', result);
        throw new Error(result.detail || result.message || JSON.stringify(result) || 'Payment failed');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert(
        'Payment Failed',
        `There was an issue processing your payment: ${error.message}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowPaymentModal(false);
              setIsProcessing(false);
            }
          }
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptPayment = () => {
    sendDataToAPI(); 
  };  

  const PlanDetailsModal = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconContainer}>
                    {selectedPlan?.iconType === "material" ? (
                      <MaterialIcon 
                        name={selectedPlan?.icon} 
                        size={28} 
                        color={Colors.white} 
                      />
                    ) : (
                      <Icon 
                        name={selectedPlan?.icon} 
                        size={28} 
                        color={Colors.white} 
                      />
                    )}
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>{selectedPlan?.title || "Plan Details"}</Text>
                    <Text style={styles.modalSubtitle}>{selectedPlan?.description || ""}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Icon name="x" size={24} color={Colors.textTertiary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalPricingSection}>
                  <View style={styles.priceDisplay}>
                    <Text style={styles.modalRate}>{selectedPlan?.rate || "₦0"}</Text>
                    <Text style={styles.modalPerMinute}>{selectedPlan?.perMinute || "per minute"}</Text>
                  </View>
                  {selectedPlan?.recommendedDuration && (
                    <View style={styles.recommendedBadge}>
                      <Icon name="star" size={16} color={Colors.white} />
                      <Text style={styles.recommendedText}>Recommended: {selectedPlan.recommendedDuration}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.featuresList}>
                  <Text style={styles.featuresTitle}>What's included:</Text>
                  {selectedPlan?.features?.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <View style={[styles.featureIcon, { backgroundColor: `${selectedPlan?.color || Colors.primary}15` }]}>
                        <Icon name="check" size={16} color={selectedPlan?.color || Colors.primary} />
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  )) || (
                    <Text style={styles.noFeaturesText}>No features available</Text>
                  )}
                </View>

                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total for {selectedPlan?.recommendedDuration || "session"}:</Text>
                  <Text style={styles.totalAmount}>₦{calculateAmount(selectedPlan)}</Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.secondaryModalButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.secondaryModalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.primaryModalButton,
                      !selectedPlan && styles.primaryModalButtonDisabled
                    ]}
                    onPress={handleContinueToPayment}
                    disabled={!selectedPlan}
                  >
                    <Text style={styles.primaryModalButtonText}>Continue to Payment</Text>
                    <Icon name="credit-card" size={18} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const PaymentConfirmationModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => !isProcessing && setShowPaymentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.paymentModalContent}>
          {/* Payment Modal Header */}
          <View style={styles.paymentModalHeader}>
            <View style={styles.paymentIconContainer}>
              {isProcessing ? (
                <ActivityIndicator size="large" color={Colors.white} />
              ) : (
                <Icon name="credit-card" size={32} color={Colors.white} />
              )}
            </View>
            <Text style={styles.paymentModalTitle}>
              {isProcessing ? "Processing Payment" : "Payment Confirmation"}
            </Text>
            <Text style={styles.paymentModalSubtitle}>
              {isProcessing ? "Please wait while we process your payment..." : "Confirm your payment details"}
            </Text>
          </View>

          {!isProcessing ? (
            <>
              {/* Payment Details - Only show when not processing */}
              <View style={styles.paymentDetails}>
                <View style={styles.paymentDetailRow}>
                  <Text style={styles.paymentDetailLabel}>Plan Type:</Text>
                  <Text style={styles.paymentDetailValue}>{selectedPlan?.title}</Text>
                </View>
                <View style={styles.paymentDetailRow}>
                  <Text style={styles.paymentDetailLabel}>Duration:</Text>
                  <Text style={styles.paymentDetailValue}>{selectedPlan?.recommendedDuration}</Text>
                </View>
                <View style={styles.paymentDetailRow}>
                  <Text style={styles.paymentDetailLabel}>Rate:</Text>
                  <Text style={styles.paymentDetailValue}>{selectedPlan?.rate} per minute</Text>
                </View>
                <View style={[styles.paymentDetailRow, styles.totalRow]}>
                  <Text style={styles.totalPaymentLabel}>Total Amount:</Text>
                  <Text style={styles.totalPaymentValue}>₦{calculateAmount(selectedPlan)}</Text>
                </View>
              </View>

              

              {/* Payment Buttons */}
              <View style={styles.paymentButtons}>
                <TouchableOpacity 
                  style={styles.cancelPaymentButton}
                  onPress={() => setShowPaymentModal(false)}
                  disabled={isProcessing}
                >
                  <Text style={styles.cancelPaymentButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.acceptPaymentButton}
                  onPress={handleAcceptPayment}
                  disabled={isProcessing}
                >
                  <Text style={styles.acceptPaymentButtonText}>Accept & Pay</Text>
                  <Icon name="check-circle" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* Loading State - Show when processing */
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingTitle}>Processing Your Payment</Text>
              <Text style={styles.loadingSubtitle}>
                Please don't close this window. This may take a few moments...
              </Text>
              
              {/* Progress Steps */}
              <View style={styles.progressSteps}>
                <View style={styles.progressStep}>
                  <View style={[styles.stepIcon, styles.stepCompleted]}>
                    <Icon name="check" size={16} color={Colors.white} />
                  </View>
                  <Text style={styles.stepText}>Payment initiated</Text>
                </View>
                
                <View style={styles.progressStep}>
                  <View style={[styles.stepIcon, styles.stepActive]}>
                    <ActivityIndicator size="small" color={Colors.white} />
                  </View>
                  <Text style={styles.stepText}>Processing transaction</Text>
                </View>
                
                <View style={styles.progressStep}>
                  <View style={[styles.stepIcon, styles.stepPending]}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                  <Text style={styles.stepText}>Completing setup</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 7 of 7</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <View style={styles.titleIconContainer}>
            <View style={styles.titleIcon}>
              <Icon name="dollar-sign" size={24} color={Colors.primary} />
            </View>
            <View style={[styles.titleIcon, {marginLeft: 20}]}>
              <Text style={{color: Colors.primary, fontSize: 20}}>₦</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Pricing Plans</Text>
          <Text style={styles.greeting}>
            Hello Talker <Text style={styles.emoji}>😊</Text>
          </Text>
          <Text style={styles.subtitle}>
            We believe in fair and transparent pricing. Choose the session type that works best for you.
          </Text>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pay-Per-Minute Pricing</Text>
            <Text style={styles.sectionSubtitle}>
              You're only charged for the time you use. No hidden fees, no commitments.
            </Text>
          </View>

          {/* Pricing Cards */}
          {pricingPlans.map((plan, index) => (
            <TouchableOpacity 
              key={plan.type}
              onPress={() => handlePlanSelect(plan)}
              activeOpacity={0.7}
            >
              <View style={styles.pricingCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${plan.color}15` }]}>
                    {plan.iconType === "material" ? (
                      <MaterialIcon name={plan.icon} size={22} color={plan.color} />
                    ) : (
                      <Icon name={plan.icon} size={22} color={plan.color} />
                    )}
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{plan.title}</Text>
                    <Text style={styles.cardDescription}>{plan.description}</Text>
                  </View>
                </View>

                {/* Pricing */}
                <View style={styles.pricingContainer}>
                  <View style={styles.rateContainer}>
                    <Text style={styles.rate}>{plan.rate}</Text>
                    <Text style={styles.perMinute}>{plan.perMinute}</Text>
                  </View>
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {plan.features.slice(0, 3).map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureRow}>
                      <View style={[styles.featureIcon, { backgroundColor: `${plan.color}15` }]}>
                        <Icon name="check" size={14} color={plan.color} />
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                  {plan.features.length > 3 && (
                    <View style={styles.moreFeatures}>
                      <Text style={styles.moreFeaturesText}>
                        +{plan.features.length - 3} more features
                      </Text>
                    </View>
                  )}
                </View>

                {/* Popular Badge for Voice Calls */}
                {plan.type === "call" && (
                  <View style={styles.popularBadge}>
                    <Icon name="award" size={12} color={Colors.white} />
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                )}

                {/* Select Button */}
                <View style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Select Plan</Text>
                  <Icon name="chevron-right" size={16} color={Colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Icon name="shield" size={18} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Transparent & Secure</Text>
              <Text style={styles.infoText}>
                Your payment information is securely encrypted. You'll only be charged for the actual time spent in session.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Plan Details Modal */}
      <PlanDetailsModal />
      
      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 30,
  },
  titleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleIconContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 34,
  },
  greeting: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  pricingSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  pricingCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  pricingContainer: {
    marginBottom: 16,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rate: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 8,
  },
  perMinute: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  moreFeatures: {
    marginTop: 8,
  },
  moreFeaturesText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 0,
    width: '100%',
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 24,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
  modalPricingSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  modalRate: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 8,
  },
  modalPerMinute: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  featuresList: {
    padding: 24,
    maxHeight: 300,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noFeaturesText: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  secondaryModalButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryModalButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  primaryModalButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryModalButtonDisabled: {
    backgroundColor: Colors.textTertiary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
  },
  primaryModalButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  paymentModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 0,
    width: '95%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  paymentModalHeader: {
    backgroundColor: Colors.primary,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
  },
  paymentIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  paymentModalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  paymentDetails: {
    padding: 24,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
    paddingTop: 16,
  },
  paymentDetailLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  paymentDetailValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  totalPaymentLabel: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  totalPaymentValue: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '800',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 16,
    margin: 24,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.warning,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  paymentButtons: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelPaymentButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelPaymentButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  acceptPaymentButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptPaymentButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  // Loading State Styles
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  progressSteps: {
    width: '100%',
    gap: 16,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: Colors.success,
  },
  stepActive: {
    backgroundColor: Colors.primary,
  },
  stepPending: {
    backgroundColor: Colors.textTertiary,
  },
  stepNumber: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});

export default PricingScreen;