

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   Modal,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Platform
// } from 'react-native';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Feather';
// import LottieView from 'lottie-react-native';
// import { API_ROUTE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width } = Dimensions.get('window');

// const EarningsSlideIn = ({ visible, onClose, onClaimReward, userData }) => {
//   const [timeSpent, setTimeSpent] = useState(0);
//   const [earnedAmount, setEarnedAmount] = useState(0);
//   const [showDetails, setShowDetails] = useState(false);
//   const [streakDays, setStreakDays] = useState(0);
//   const [thresholds, setThresholds] = useState({
//     first: { hours: 1.0, reward: 0.2, can_claim: false, claimed: false },
//     second: { hours: 2.0, reward: 0.3, can_claim: false, claimed: false },
//     bonus: { reward: 0.1, can_claim: false, claimed: false }
//   });
//   const [streakBonus, setStreakBonus] = useState({
//     available: false,
//     reward: 0.5,
//     claimed: false,
//     days_needed: 7
//   });
//   const [dailyMaximum, setDailyMaximum] = useState(0.6);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const slideAnim = useState(new Animated.Value(-500))[0];
  
//   const [displayAmount, setDisplayAmount] = useState('0.00');
//   const amountAnim = useRef(new Animated.Value(0)).current;

//   const [sessionId, setSessionId] = useState(null);
//   const [isSessionActive, setIsSessionActive] = useState(false);
//   const isEndingRef = useRef(false);
//   const hasEndedRef = useRef(false);

//   useEffect(() => {
//   if (!visible || !sessionId) return;
//   const heartbeat = setInterval(async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;
//     try {
//       await axios.post(`${API_ROUTE}/activity/heartbeat/`, { session_id: sessionId }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       await fetchActiveTimeStatus(); // refresh UI + thresholds
//     } catch (e) { console.error('Heartbeat failed', e); }
//   }, 60 * 1000); // every 60s

//   return () => clearInterval(heartbeat);
// }, [visible, sessionId]);

//   // Animate the displayed amount
//   const animateToAmount = useCallback((newAmount) => {
//     Animated.timing(amountAnim, {
//       toValue: newAmount,
//       duration: 800,
//       useNativeDriver: false,
//     }).start();
//   }, [amountAnim]);

//   // Add listener to update display amount
//   useEffect(() => {
//     const listener = amountAnim.addListener(({ value }) => {
//       setDisplayAmount(value.toFixed(2));
//     });
//     return () => amountAnim.removeListener(listener);
//   }, [amountAnim]);

//   const fetchActiveTimeStatus = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.log('No token found');
//         return;
//       }

//       const response = await axios.get(`${API_ROUTE}/activity/status/`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log('=== ACTIVE TIME STATUS ===');
//       console.log('Response:', JSON.stringify(response.data, null, 2));

//       if (response.data) {
//         const data = response.data;
        
//         setTimeSpent(data.active_hours_today || 0);
//         setEarnedAmount(data.earned_today || 0);
//         setStreakDays(data.streak_days || 0);
//         setDailyMaximum(data.daily_maximum || 0.6);
        
//         animateToAmount(data.earned_today || 0);
        
//         // USE THE BACKEND VALUES DIRECTLY
//         setThresholds({
//           first: {
//             hours: data.thresholds?.first?.hours || 1.0,
//             reward: data.thresholds?.first?.reward || 0.2,
//             can_claim: data.thresholds?.first?.can_claim || false,
//             claimed: data.thresholds?.first?.claimed || false
//           },
//           second: {
//             hours: data.thresholds?.second?.hours || 2.0,
//             reward: data.thresholds?.second?.reward || 0.3,
//             can_claim: data.thresholds?.second?.can_claim || false,
//             claimed: data.thresholds?.second?.claimed || false
//           },
//           bonus: {
//             reward: data.thresholds?.bonus?.reward || 0.1,
//             can_claim: data.thresholds?.bonus?.can_claim || false,
//             claimed: data.thresholds?.bonus?.claimed || false
//           }
//         });

//         setStreakBonus({
//           available: data.streak_bonus?.available || false,
//           reward: data.streak_bonus?.reward || 0.5,
//           claimed: data.streak_bonus?.claimed || false,
//           days_needed: data.streak_bonus?.days_needed || 7
//         });
//       }
//     } catch (err) {
//       console.error('Error fetching active time status:', err);
//       setError('Failed to load earnings data');
//     }
//   }, [animateToAmount]);

//   const startActivitySession = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       if (isSessionActive) {
//         console.log('Session already active');
//         return;
//       }

//       const response = await axios.post(`${API_ROUTE}/activity/start/`, {}, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       console.log('Activity session started:', response.data);
      
//       if (response.data && response.data.session_id) {
//         setSessionId(response.data.session_id);
//         setIsSessionActive(true);
//         hasEndedRef.current = false;
//         await AsyncStorage.setItem('activity_session_id', String(response.data.session_id));
//       }
//     } catch (err) {
//       console.error('Error starting activity session:', err);
//     }
//   }, [isSessionActive]);

//   const endActivitySession = useCallback(async () => {
//     if (isEndingRef.current) {
//       console.log('⏳ Session end already in progress, skipping...');
//       return;
//     }

//     if (hasEndedRef.current) {
//       console.log('✅ Session already ended, skipping...');
//       return;
//     }

//     try {
//       isEndingRef.current = true;
      
//       let currentSessionId = sessionId;
      
//       if (!currentSessionId) {
//         currentSessionId = await AsyncStorage.getItem('activity_session_id');
//       }
      
//       if (!currentSessionId) {
//         console.log('No active session to end');
//         return;
//       }

//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       console.log('🔄 Ending session with ID:', currentSessionId);
      
//       const response = await axios.post(`${API_ROUTE}/activity/end/`, 
//         { session_id: currentSessionId },
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('✅ Activity session ended:', response.data);
      
//       hasEndedRef.current = true;
//       setSessionId(null);
//       setIsSessionActive(false);
//       await AsyncStorage.removeItem('activity_session_id');
      
//       await fetchActiveTimeStatus();
      
//     } catch (err) {
//       console.error('❌ Error ending activity session:', err);
//     } finally {
//       isEndingRef.current = false;
//     }
//   }, [sessionId, fetchActiveTimeStatus]);

//   // Handle visibility changes
//   useEffect(() => {
//     if (visible) {
//       console.log('EarningsSlideIn opened');
//       hasEndedRef.current = false;
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         useNativeDriver: true,
//         tension: 50,
//         friction: 8
//       }).start();
//       fetchActiveTimeStatus();
//       startActivitySession();
//     } else {
//       console.log('EarningsSlideIn closed - ending session');
//       endActivitySession();
//       Animated.timing(slideAnim, {
//         toValue: -500,
//         duration: 300,
//         useNativeDriver: true
//       }).start();
//     }

//     return () => {
//       if (visible && !hasEndedRef.current) {
//         endActivitySession();
//       }
//     };
//   }, [visible]);

//   // Auto-claim interval - check every 30 seconds for production
//   useEffect(() => {
//     const autoClaimInterval = setInterval(() => {
//       if (visible) {
//         console.log('🔄 Auto-checking claims...');
//         checkAutoClaims();
//       }
//     }, 30 * 1000); // Changed from 10s to 30s for production

//     return () => {
//       clearInterval(autoClaimInterval);
//     };
//   }, [visible]);

//   const checkAutoClaims = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const response = await axios.post(`${API_ROUTE}/activity/check-auto/`, {}, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Auto-claim response:', response.data);

//       if (response.data.claimed && response.data.claimed.length > 0) {
//         console.log('✅ Auto-claimed rewards:', response.data.claimed);
//         await fetchActiveTimeStatus();
//       }
//     } catch (err) {
//       console.error('Error checking auto claims:', err);
//     }
//   }, [fetchActiveTimeStatus]);

//   const handleClaimReward = async (threshold) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         setError('Please log in to claim rewards');
//         return;
//       }

//       console.log('🎯 Claiming reward for threshold:', threshold);
//       const response = await axios.post(`${API_ROUTE}/activity/claim/`, 
//         { threshold },
//         { 
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           } 
//         }
//       );

//       console.log('Claim response:', response.data);

//       if (response.data.success) {
//         const newEarnedAmount = response.data.earned_today || earnedAmount;
//         setEarnedAmount(newEarnedAmount);
        
//         animateToAmount(newEarnedAmount);
        
//         if (onClaimReward) {
//           onClaimReward({
//             amount: response.data.amount_usd || 0,
//             coins: response.data.coins_awarded || 0,
//             threshold: threshold
//           });
//         }

//         await fetchActiveTimeStatus();
        
//         Alert.alert('Success!', `You earned $${(response.data.amount_usd || 0).toFixed(2)}!`);
//       } else {
//         setError(response.data.message || 'Failed to claim reward');
//       }
//     } catch (err) {
//       console.error('Error claiming reward:', err);
//       setError(err.response?.data?.message || 'Failed to claim reward');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextMilestone = useCallback(() => {
//     if (!thresholds.first.claimed && timeSpent < thresholds.first.hours) {
//       const remainingMinutes = Math.round((thresholds.first.hours - timeSpent) * 60);
//       return {
//         target: thresholds.first.hours,
//         reward: thresholds.first.reward,
//         remaining: remainingMinutes > 0 ? `${remainingMinutes}m` : 'Almost there!',
//         label: `${Math.round(thresholds.first.hours)} hour${thresholds.first.hours > 1 ? 's' : ''}`
//       };
//     }
//     if (!thresholds.second.claimed && timeSpent < thresholds.second.hours) {
//       const remainingMinutes = Math.round((thresholds.second.hours - timeSpent) * 60);
//       return {
//         target: thresholds.second.hours,
//         reward: thresholds.second.reward,
//         remaining: remainingMinutes > 0 ? `${remainingMinutes}m` : 'Almost there!',
//         label: `${Math.round(thresholds.second.hours)} hours`
//       };
//     }
//     if (!thresholds.bonus.claimed && earnedAmount >= dailyMaximum - thresholds.bonus.reward && earnedAmount < dailyMaximum) {
//       return {
//         target: 'daily cap',
//         reward: thresholds.bonus.reward,
//         remaining: ((dailyMaximum - earnedAmount) / thresholds.bonus.reward).toFixed(1) + 'x',
//         label: 'Daily cap bonus'
//       };
//     }
//     return { target: 'completed', reward: 0, remaining: 'completed', label: 'Completed!' };
//   }, [timeSpent, earnedAmount, thresholds, dailyMaximum]);

//   const formatTime = (hours) => {
//     if (hours < 1) {
//       const minutes = Math.round(hours * 60);
//       if (minutes < 1) return 'less than a minute';
//       if (minutes === 1) return '1 minute';
//       return `${minutes} minutes`;
//     }
//     if (hours === 1) return '1 hour';
//     if (hours < 2) return `${hours.toFixed(1)} hours`;
//     return `${Math.round(hours)} hours`;
//   };

//   // Format threshold label dynamically
//   const formatThresholdLabel = (hours) => {
//     if (hours < 1) {
//       const minutes = Math.round(hours * 60);
//       return `${minutes} minute${minutes > 1 ? 's' : ''} active`;
//     }
//     if (hours === 1) return '1 hour active';
//     if (hours === 2) return '2 hours active';
//     return `${Math.round(hours)} hours active`;
//   };

//   const nextMilestone = getNextMilestone();

//   if (!visible) return null;

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="none"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <Animated.View 
//           style={[
//             styles.container,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <TouchableOpacity
//             onPress={onClose}
//             style={styles.closeButton}
//           >
//             <Icon name="x" size={16} color="#9CA3AF" />
//           </TouchableOpacity>

//           {error && (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>{error}</Text>
//               <TouchableOpacity onPress={() => setError(null)}>
//                 <Icon name="x" size={12} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//           )}

//           <ScrollView showsVerticalScrollIndicator={false}>
//             <View style={styles.content}>
//               {/* Header */}
//               <View style={styles.headerContainer}>
//                 <LottieView
//                   source={require('../assets/animations/Success.json')}
//                   loop={true}
//                   autoPlay={true}
//                   style={styles.lottieAnimation}
//                 />
//                 <Text style={styles.headerTitle}>🎉 You're Earning!</Text>
//                 <View style={styles.headerSubtitle}>
//                   <Icon name="clock" size={12} color="#9CA3AF" />
//                   <Text style={styles.headerSubtitleText}>
//                     {formatTime(timeSpent)} active
//                   </Text>
//                 </View>
//               </View>

//               {/* Debug Info - Remove in production or keep for monitoring */}
//               {__DEV__ && (
//                 <View style={styles.debugContainer}>
//                   <Text style={styles.debugText}>
//                     Time: {timeSpent.toFixed(3)}h ({Math.round(timeSpent * 60)}m) | 
//                     Earned: ${earnedAmount.toFixed(2)} | 
//                     1h: {thresholds.first.can_claim ? '✅' : '❌'} | 
//                     2h: {thresholds.second.can_claim ? '✅' : '❌'}
//                   </Text>
//                 </View>
//               )}

//               {/* Earnings Counter */}
//               <View style={styles.counterContainer}>
//                 <Animated.Text style={styles.counterAmount}>
//                   ${displayAmount}
//                 </Animated.Text>
//                 <Text style={styles.counterLabel}>
//                   earned so far today
//                 </Text>
//               </View>

//               {/* Daily Progress Bar */}
//               <View style={styles.progressContainer}>
//                 <View style={styles.progressHeader}>
//                   <Text style={styles.progressLabel}>Daily progress</Text>
//                   <Text style={styles.progressValue}>
//                     ${earnedAmount.toFixed(2)} / ${dailyMaximum.toFixed(2)}
//                   </Text>
//                 </View>
//                 <View style={styles.progressBar}>
//                   <Animated.View 
//                     style={[
//                       styles.progressFill,
//                       { 
//                         width: `${Math.min((earnedAmount / dailyMaximum) * 100, 100)}%` 
//                       }
//                     ]}
//                   />
//                 </View>
//               </View>

//               {/* Next Milestone Card */}
//               {nextMilestone.target !== 'completed' && (
//                 <View style={styles.milestoneCard}>
//                   <View style={styles.milestoneHeader}>
//                     <View style={styles.milestoneTitleContainer}>
//                       <Icon name="target" size={14} color="#60A5FA" />
//                       <Text style={styles.milestoneTitle}>Next milestone:</Text>
//                     </View>
//                     <Text style={styles.milestoneReward}>
//                       +${nextMilestone.reward.toFixed(2)}
//                     </Text>
//                   </View>
                  
//                   <View style={styles.milestoneProgressHeader}>
//                     <Text style={styles.milestoneProgressLabel}>
//                       {nextMilestone.label}
//                     </Text>
//                     <Text style={styles.milestoneProgressRemaining}>
//                       {nextMilestone.remaining}
//                     </Text>
//                   </View>
//                   <View style={styles.milestoneProgressBar}>
//                     <View 
//                       style={[
//                         styles.milestoneProgressFill,
//                         { 
//                           width: nextMilestone.target === 'daily cap' 
//                             ? `${((dailyMaximum - earnedAmount) / dailyMaximum) * 100}%`
//                             : Math.min((timeSpent / nextMilestone.target) * 100, 100)
//                         }
//                       ]}
//                     />
//                   </View>
//                 </View>
//               )}

//               {/* Earning Tiers Toggle */}
//               {!showDetails ? (
//                 <TouchableOpacity
//                   onPress={() => setShowDetails(true)}
//                   style={styles.viewTiersButton}
//                 >
//                   <View style={styles.viewTiersContent}>
//                     <Icon name="zap" size={14} color="#9CA3AF" />
//                     <Text style={styles.viewTiersText}>View earning tiers</Text>
//                   </View>
//                   <Icon name="chevron-right" size={16} color="#9CA3AF" />
//                 </TouchableOpacity>
//               ) : (
//                 <View style={styles.tiersContainer}>
//                   {/* First Threshold - Dynamic */}
//                   <View style={[
//                     styles.tierItem,
//                     thresholds.first.claimed && styles.tierItemClaimed,
//                     thresholds.first.can_claim && !thresholds.first.claimed && styles.tierItemAvailable
//                   ]}>
//                     <View style={styles.tierInfo}>
//                       <Icon name="star" size={12} color="#FBBF24" />
//                       <Text style={styles.tierText}>
//                         {formatThresholdLabel(thresholds.first.hours)}
//                       </Text>
//                     </View>
//                     <View style={styles.tierAction}>
//                       <Text style={[
//                         styles.tierReward,
//                         thresholds.first.claimed && styles.tierRewardClaimed,
//                         thresholds.first.can_claim && !thresholds.first.claimed && styles.tierRewardAvailable
//                       ]}>
//                         ${thresholds.first.reward.toFixed(2)}
//                       </Text>
//                       {thresholds.first.can_claim && !thresholds.first.claimed && (
//                         <TouchableOpacity
//                           onPress={() => handleClaimReward('first')}
//                           disabled={loading}
//                           style={styles.claimButton}
//                         >
//                           <Text style={styles.claimButtonText}>Claim</Text>
//                         </TouchableOpacity>
//                       )}
//                       {thresholds.first.claimed && (
//                         <Icon name="check-circle" size={12} color="#34D399" />
//                       )}
//                     </View>
//                   </View>

//                   {/* Second Threshold - Dynamic */}
//                   <View style={[
//                     styles.tierItem,
//                     thresholds.second.claimed && styles.tierItemClaimed,
//                     thresholds.second.can_claim && !thresholds.second.claimed && styles.tierItemAvailable
//                   ]}>
//                     <View style={styles.tierInfo}>
//                       <Icon name="star" size={12} color="#FBBF24" />
//                       <Text style={styles.tierText}>
//                         {formatThresholdLabel(thresholds.second.hours)}
//                       </Text>
//                     </View>
//                     <View style={styles.tierAction}>
//                       <Text style={[
//                         styles.tierReward,
//                         thresholds.second.claimed && styles.tierRewardClaimed,
//                         thresholds.second.can_claim && !thresholds.second.claimed && styles.tierRewardAvailable
//                       ]}>
//                         ${thresholds.second.reward.toFixed(2)}
//                       </Text>
//                       {thresholds.second.can_claim && !thresholds.second.claimed && (
//                         <TouchableOpacity
//                           onPress={() => handleClaimReward('second')}
//                           disabled={loading}
//                           style={styles.claimButton}
//                         >
//                           <Text style={styles.claimButtonText}>Claim</Text>
//                         </TouchableOpacity>
//                       )}
//                       {thresholds.second.claimed && (
//                         <Icon name="check-circle" size={12} color="#34D399" />
//                       )}
//                     </View>
//                   </View>

//                   {/* Daily Cap Bonus */}
//                   <View style={[
//                     styles.tierItem,
//                     thresholds.bonus.claimed && styles.tierItemClaimed,
//                     thresholds.bonus.can_claim && !thresholds.bonus.claimed && styles.tierItemBonus
//                   ]}>
//                     <View style={styles.tierInfo}>
//                       <Icon name="gift" size={12} color="#F472B6" />
//                       <Text style={styles.tierText}>Daily cap bonus</Text>
//                     </View>
//                     <View style={styles.tierAction}>
//                       <Text style={[
//                         styles.tierReward,
//                         thresholds.bonus.claimed && styles.tierRewardClaimed,
//                         thresholds.bonus.can_claim && !thresholds.bonus.claimed && styles.tierRewardBonus
//                       ]}>
//                         ${thresholds.bonus.reward.toFixed(2)}
//                       </Text>
//                       {thresholds.bonus.can_claim && !thresholds.bonus.claimed && (
//                         <TouchableOpacity
//                           onPress={() => handleClaimReward('bonus')}
//                           disabled={loading}
//                           style={[styles.claimButton, styles.claimButtonBonus]}
//                         >
//                           <Text style={styles.claimButtonText}>Claim</Text>
//                         </TouchableOpacity>
//                       )}
//                       {thresholds.bonus.claimed && (
//                         <Icon name="check-circle" size={12} color="#34D399" />
//                       )}
//                     </View>
//                   </View>

//                   <TouchableOpacity
//                     onPress={() => setShowDetails(false)}
//                     style={styles.showLessButton}
//                   >
//                     <Text style={styles.showLessText}>Show less</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               {/* Claim All Button */}
//               {(thresholds.first.can_claim || thresholds.second.can_claim || thresholds.bonus.can_claim) && (
//                 <TouchableOpacity 
//                   onPress={() => {
//                     if (thresholds.first.can_claim) handleClaimReward('first');
//                     if (thresholds.second.can_claim) handleClaimReward('second');
//                     if (thresholds.bonus.can_claim) handleClaimReward('bonus');
//                   }}
//                   disabled={loading}
//                   style={styles.claimAllButton}
//                 >
//                   <Text style={styles.claimAllText}>Claim Available Rewards</Text>
//                   <Icon name="gift" size={16} color="#FFFFFF" />
//                 </TouchableOpacity>
//               )}

//               {/* Footer Note */}
//               <Text style={styles.footerNote}>
//                 Keep going to reach ${dailyMaximum.toFixed(2)} today! ✨
//               </Text>
//             </View>
//           </ScrollView>

//           {loading && (
//             <View style={styles.loadingOverlay}>
//               <ActivityIndicator size="large" color="#10B981" />
//             </View>
//           )}
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// // Manager component
// const EarningsSlideInManager = () => {
//   const [showEarnings, setShowEarnings] = useState(false);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const initializeEarnings = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         console.log('Token exists:', !!token);
        
//         if (!token) {
//           console.log('No token found, user not logged in');
//           return;
//         }
        
//         try {
//           const response = await axios.get(`${API_ROUTE}/user/profile/`, {
//             headers: { 
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });
//           setUserData(response.data);
//           console.log('User data fetched successfully');
//         } catch (err) {
//           console.error('Error fetching user data:', err);
//           if (err.response?.status === 401) {
//             await AsyncStorage.removeItem('userToken');
//           }
//           return;
//         }

//         // Show after 3 seconds for testing, change to 60 seconds for production
//         //const timerDuration = 3000; // 3 seconds for testing
//         //const timerDuration = 60000; // 1 minute for production
//          const timerDuration = 3600000;
//         console.log(`Will show earnings in ${timerDuration/1000} seconds...`);
        
//         const timer = setTimeout(() => {
//           console.log('Showing earnings slide-in');
//           setShowEarnings(true);
//         }, timerDuration);

//         return () => {
//           console.log('Cleaning up timer');
//           clearTimeout(timer);
//         };
//       } catch (error) {
//         console.error('Error in initializeEarnings:', error);
//       }
//     };

//     initializeEarnings();
//   }, []);

//   const handleClose = () => {
//     console.log('Closing earnings slide-in');
//     setShowEarnings(false);
//   };

//   const handleClaimReward = (rewardData) => {
//     console.log('Reward claimed:', rewardData);
//   };

//   if (!showEarnings || !userData) return null;

//   return (
//     <EarningsSlideIn 
//       visible={showEarnings}
//       onClose={handleClose} 
//       onClaimReward={handleClaimReward}
//       userData={userData}
//     />
//   );
// };



// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-start',
//     alignItems: Platform.OS === 'web' ? 'flex-end' : 'center',
//     paddingTop: Platform.OS === 'web' ? 16 : 40,
//     paddingRight: Platform.OS === 'web' ? 16 : 0,
//   },
//   container: {
//     width: Platform.OS === 'web' ? 384 : width - 32,
//     backgroundColor: '#1F2937',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(55, 65, 81, 0.5)',
//     overflow: 'hidden',
//     maxHeight: Platform.OS === 'web' ? '90%' : '80%',
//     position: 'relative',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     zIndex: 10,
//     padding: 6,
//     borderRadius: 20,
//     backgroundColor: 'rgba(31, 41, 55, 0.8)',
//   },
//   errorContainer: {
//     position: 'absolute',
//     top: 48,
//     left: 12,
//     right: 12,
//     zIndex: 20,
//     backgroundColor: '#EF4444',
//     borderRadius: 8,
//     padding: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//   },
//   debugContainer: {
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   debugText: {
//     color: '#FBBF24',
//     fontSize: 10,
//     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   lottieAnimation: {
//     width: 120,
//     height: 120,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginTop: -10,
//   },
//   headerSubtitle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   headerSubtitleText: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginLeft: 4,
//   },
//   counterContainer: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   counterAmount: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#10B981',
//   },
//   counterLabel: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginTop: 4,
//   },
//   progressContainer: {
//     marginBottom: 16,
//   },
//   progressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   progressLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   progressValue: {
//     fontSize: 12,
//     color: '#10B981',
//   },
//   progressBar: {
//     height: 8,
//     backgroundColor: '#374151',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#10B981',
//     borderRadius: 4,
//   },
//   milestoneCard: {
//     backgroundColor: 'rgba(31, 41, 55, 0.5)',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(55, 65, 81, 0.5)',
//   },
//   milestoneHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   milestoneTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   milestoneTitle: {
//     fontSize: 14,
//     color: '#D1D5DB',
//     marginLeft: 4,
//   },
//   milestoneReward: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FBBF24',
//   },
//   milestoneProgressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   milestoneProgressLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   milestoneProgressRemaining: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   milestoneProgressBar: {
//     height: 6,
//     backgroundColor: '#374151',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   milestoneProgressFill: {
//     height: '100%',
//     backgroundColor: '#F59E0B',
//     borderRadius: 3,
//   },
//   completedContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   completedText: {
//     fontSize: 12,
//     color: '#10B981',
//     marginLeft: 4,
//   },
//   streakCard: {
//     backgroundColor: 'rgba(139, 92, 246, 0.3)',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(139, 92, 246, 0.5)',
//   },
//   streakHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   streakTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   streakTitle: {
//     fontSize: 14,
//     color: '#E5E7EB',
//     marginLeft: 4,
//   },
//   streakReward: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#C084FC',
//   },
//   streakProgress: {
//     flexDirection: 'row',
//     marginTop: 8,
//     gap: 2,
//   },
//   streakBar: {
//     flex: 1,
//     height: 4,
//     backgroundColor: '#374151',
//     borderRadius: 2,
//   },
//   streakBarActive: {
//     backgroundColor: '#A855F7',
//   },
//   streakButton: {
//     marginTop: 8,
//     backgroundColor: '#9333EA',
//     borderRadius: 8,
//     paddingVertical: 6,
//     alignItems: 'center',
//   },
//   streakButtonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   viewTiersButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   viewTiersContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   viewTiersText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginLeft: 4,
//   },
//   tiersContainer: {
//     marginBottom: 12,
//     gap: 8,
//   },
//   tierItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: 'rgba(31, 41, 55, 0.5)',
//   },
//   tierItemClaimed: {
//     backgroundColor: 'rgba(16, 185, 129, 0.2)',
//     borderWidth: 1,
//     borderColor: 'rgba(16, 185, 129, 0.3)',
//   },
//   tierItemAvailable: {
//     backgroundColor: 'rgba(245, 158, 11, 0.2)',
//     borderWidth: 1,
//     borderColor: 'rgba(245, 158, 11, 0.3)',
//   },
//   tierItemBonus: {
//     backgroundColor: 'rgba(236, 72, 153, 0.2)',
//     borderWidth: 1,
//     borderColor: 'rgba(236, 72, 153, 0.3)',
//   },
//   tierInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tierText: {
//     fontSize: 12,
//     color: '#D1D5DB',
//     marginLeft: 4,
//   },
//   tierAction: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   tierReward: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#9CA3AF',
//   },
//   tierRewardClaimed: {
//     color: '#34D399',
//   },
//   tierRewardAvailable: {
//     color: '#FBBF24',
//   },
//   tierRewardBonus: {
//     color: '#F472B6',
//   },
//   claimButton: {
//     backgroundColor: '#059669',
//     borderRadius: 4,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   claimButtonBonus: {
//     backgroundColor: '#DB2777',
//   },
//   claimButtonText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   showLessButton: {
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   showLessText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   claimAllButton: {
//     flexDirection: 'row',
//     backgroundColor: '#10B981',
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     shadowColor: '#10B981',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   claimAllText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   footerNote: {
//     textAlign: 'center',
//     fontSize: 10,
//     color: '#6B7280',
//     marginTop: 8,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default EarningsSlideInManager;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const EarningsSlideIn = ({ visible, onClose, onClaimReward, userData }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [thresholds, setThresholds] = useState({
    first: { hours: 1.0, reward: 0.2, can_claim: false, claimed: false },
    second: { hours: 2.0, reward: 0.3, can_claim: false, claimed: false },
    bonus: { reward: 0.1, can_claim: false, claimed: false }
  });
  const [streakBonus, setStreakBonus] = useState({
    available: false,
    reward: 0.5,
    claimed: false,
    days_needed: 7
  });
  const [dailyMaximum, setDailyMaximum] = useState(0.6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const slideAnim = useState(new Animated.Value(-500))[0];

  const [displayAmount, setDisplayAmount] = useState('0.00');
  const amountAnim = useRef(new Animated.Value(0)).current;

  const [sessionId, setSessionId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const isEndingRef = useRef(false);
  const hasEndedRef = useRef(false);

  // ==========================================================
  // Animate the displayed amount
  // ==========================================================
  const animateToAmount = useCallback((newAmount) => {
    Animated.timing(amountAnim, {
      toValue: newAmount,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [amountAnim]);

  useEffect(() => {
    const listener = amountAnim.addListener(({ value }) => {
      setDisplayAmount(value.toFixed(2));
    });
    return () => amountAnim.removeListener(listener);
  }, [amountAnim]);

  // ==========================================================
  // Fetch live status from backend (defined BEFORE anything
  // that references it, so no "used before initialization")
  // ==========================================================
  const fetchActiveTimeStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await axios.get(`${API_ROUTE}/activity/status/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('=== ACTIVE TIME STATUS ===');
      console.log('Response:', JSON.stringify(response.data, null, 2));

      if (response.data) {
        const data = response.data;

        setTimeSpent(data.active_hours_today || 0);
        setEarnedAmount(data.earned_today || 0);
        setStreakDays(data.streak_days || 0);
        setDailyMaximum(data.daily_maximum || 0.6);

        animateToAmount(data.earned_today || 0);

        setThresholds({
          first: {
            hours: data.thresholds?.first?.hours || 1.0,
            reward: data.thresholds?.first?.reward || 0.2,
            can_claim: data.thresholds?.first?.can_claim || false,
            claimed: data.thresholds?.first?.claimed || false
          },
          second: {
            hours: data.thresholds?.second?.hours || 2.0,
            reward: data.thresholds?.second?.reward || 0.3,
            can_claim: data.thresholds?.second?.can_claim || false,
            claimed: data.thresholds?.second?.claimed || false
          },
          bonus: {
            reward: data.thresholds?.bonus?.reward || 0.1,
            can_claim: data.thresholds?.bonus?.can_claim || false,
            claimed: data.thresholds?.bonus?.claimed || false
          }
        });

        setStreakBonus({
          available: data.streak_bonus?.available || false,
          reward: data.streak_bonus?.reward || 0.5,
          claimed: data.streak_bonus?.claimed || false,
          days_needed: data.streak_bonus?.days_needed || 7
        });
      }
    } catch (err) {
      console.error('Error fetching active time status:', err);
      setError('Failed to load earnings data');
    }
  }, [animateToAmount]);

  // ==========================================================
  // Start an activity session
  // ==========================================================
  const startActivitySession = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      if (isSessionActive) {
        console.log('Session already active');
        return;
      }

      const response = await axios.post(`${API_ROUTE}/activity/start/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Activity session started:', response.data);

      if (response.data && response.data.session_id) {
        setSessionId(response.data.session_id);
        setIsSessionActive(true);
        hasEndedRef.current = false;
        await AsyncStorage.setItem('activity_session_id', String(response.data.session_id));
      }
    } catch (err) {
      console.error('Error starting activity session:', err);
    }
  }, [isSessionActive]);

  // ==========================================================
  // Send a heartbeat to flush elapsed time into the backend.
  // Returns true/false so callers (like endActivitySession)
  // know whether it succeeded.
  // ==========================================================
  const sendHeartbeat = useCallback(async (targetSessionId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !targetSessionId) return false;

      await axios.post(`${API_ROUTE}/activity/heartbeat/`,
        { session_id: targetSessionId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return true;
    } catch (err) {
      console.error('Heartbeat failed:', err);
      return false;
    }
  }, []);

  // ==========================================================
  // End the activity session (flush final time first)
  // ==========================================================
  const endActivitySession = useCallback(async () => {
    if (isEndingRef.current) {
      console.log('⏳ Session end already in progress, skipping...');
      return;
    }

    if (hasEndedRef.current) {
      console.log('✅ Session already ended, skipping...');
      return;
    }

    try {
      isEndingRef.current = true;

      let currentSessionId = sessionId;

      if (!currentSessionId) {
        currentSessionId = await AsyncStorage.getItem('activity_session_id');
      }

      if (!currentSessionId) {
        console.log('No active session to end');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      // Flush any remaining unflushed minutes before ending,
      // so the last partial minute isn't lost
      console.log('📡 Sending final heartbeat before ending session...');
      await sendHeartbeat(currentSessionId);

      console.log('🔄 Ending session with ID:', currentSessionId);

      const response = await axios.post(`${API_ROUTE}/activity/end/`,
        { session_id: currentSessionId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Activity session ended:', response.data);

      hasEndedRef.current = true;
      setSessionId(null);
      setIsSessionActive(false);
      await AsyncStorage.removeItem('activity_session_id');

      await fetchActiveTimeStatus();

    } catch (err) {
      console.error('❌ Error ending activity session:', err);
    } finally {
      isEndingRef.current = false;
    }
  }, [sessionId, sendHeartbeat, fetchActiveTimeStatus]);

  // ==========================================================
  // Heartbeat interval — every 60s while modal is open and a
  // session is active, flush elapsed time and refresh the UI
  // ==========================================================
  useEffect(() => {
    if (!visible || !sessionId) return;

    const heartbeatInterval = setInterval(async () => {
      console.log('💓 Sending heartbeat for session:', sessionId);
      const ok = await sendHeartbeat(sessionId);
      if (ok) {
        await fetchActiveTimeStatus();
      }
    }, 60 * 1000); // every 60 seconds

    return () => clearInterval(heartbeatInterval);
  }, [visible, sessionId, sendHeartbeat, fetchActiveTimeStatus]);

  // ==========================================================
  // Handle visibility changes (open/close modal)
  // ==========================================================
  useEffect(() => {
    if (visible) {
      console.log('EarningsSlideIn opened');
      hasEndedRef.current = false;
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
      fetchActiveTimeStatus();
      startActivitySession();
    } else {
      console.log('EarningsSlideIn closed - ending session');
      endActivitySession();
      Animated.timing(slideAnim, {
        toValue: -500,
        duration: 300,
        useNativeDriver: true
      }).start();
    }

    return () => {
      if (visible && !hasEndedRef.current) {
        endActivitySession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // ==========================================================
  // Auto-claim interval - check every 30 seconds
  // ==========================================================
  const checkAutoClaims = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.post(`${API_ROUTE}/activity/check-auto/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Auto-claim response:', response.data);

      if (response.data.claimed && response.data.claimed.length > 0) {
        console.log('✅ Auto-claimed rewards:', response.data.claimed);
        await fetchActiveTimeStatus();
      }
    } catch (err) {
      console.error('Error checking auto claims:', err);
    }
  }, [fetchActiveTimeStatus]);

  useEffect(() => {
    const autoClaimInterval = setInterval(() => {
      if (visible) {
        console.log('🔄 Auto-checking claims...');
        checkAutoClaims();
      }
    }, 30 * 1000);

    return () => {
      clearInterval(autoClaimInterval);
    };
  }, [visible, checkAutoClaims]);

  // ==========================================================
  // Manual claim handler
  // ==========================================================
  const handleClaimReward = async (threshold) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Please log in to claim rewards');
        return;
      }

      console.log('🎯 Claiming reward for threshold:', threshold);
      const response = await axios.post(`${API_ROUTE}/activity/claim/`,
        { threshold },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Claim response:', response.data);

      if (response.data.success) {
        const newEarnedAmount = response.data.earned_today || earnedAmount;
        setEarnedAmount(newEarnedAmount);

        animateToAmount(newEarnedAmount);

        if (onClaimReward) {
          onClaimReward({
            amount: response.data.amount_usd || 0,
            coins: response.data.coins_awarded || 0,
            threshold: threshold
          });
        }

        await fetchActiveTimeStatus();

        Alert.alert('Success!', `You earned $${(response.data.amount_usd || 0).toFixed(2)}!`);
      } else {
        setError(response.data.message || 'Failed to claim reward');
      }
    } catch (err) {
      console.error('Error claiming reward:', err);
      setError(err.response?.data?.message || 'Failed to claim reward');
    } finally {
      setLoading(false);
    }
  };

  const getNextMilestone = useCallback(() => {
    if (!thresholds.first.claimed && timeSpent < thresholds.first.hours) {
      const remainingMinutes = Math.round((thresholds.first.hours - timeSpent) * 60);
      return {
        target: thresholds.first.hours,
        reward: thresholds.first.reward,
        remaining: remainingMinutes > 0 ? `${remainingMinutes}m` : 'Almost there!',
        label: `${Math.round(thresholds.first.hours)} hour${thresholds.first.hours > 1 ? 's' : ''}`
      };
    }
    if (!thresholds.second.claimed && timeSpent < thresholds.second.hours) {
      const remainingMinutes = Math.round((thresholds.second.hours - timeSpent) * 60);
      return {
        target: thresholds.second.hours,
        reward: thresholds.second.reward,
        remaining: remainingMinutes > 0 ? `${remainingMinutes}m` : 'Almost there!',
        label: `${Math.round(thresholds.second.hours)} hours`
      };
    }
    if (!thresholds.bonus.claimed && earnedAmount >= dailyMaximum - thresholds.bonus.reward && earnedAmount < dailyMaximum) {
      return {
        target: 'daily cap',
        reward: thresholds.bonus.reward,
        remaining: ((dailyMaximum - earnedAmount) / thresholds.bonus.reward).toFixed(1) + 'x',
        label: 'Daily cap bonus'
      };
    }
    return { target: 'completed', reward: 0, remaining: 'completed', label: 'Completed!' };
  }, [timeSpent, earnedAmount, thresholds, dailyMaximum]);

  const formatTime = (hours) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      if (minutes < 1) return 'less than a minute';
      if (minutes === 1) return '1 minute';
      return `${minutes} minutes`;
    }
    if (hours === 1) return '1 hour';
    if (hours < 2) return `${hours.toFixed(1)} hours`;
    return `${Math.round(hours)} hours`;
  };

  const formatThresholdLabel = (hours) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} active`;
    }
    if (hours === 1) return '1 hour active';
    if (hours === 2) return '2 hours active';
    return `${Math.round(hours)} hours active`;
  };

  const nextMilestone = getNextMilestone();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
          >
            <Icon name="x" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError(null)}>
                <Icon name="x" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <LottieView
                  source={require('../assets/animations/Success.json')}
                  loop={true}
                  autoPlay={true}
                  style={styles.lottieAnimation}
                />
                <Text style={styles.headerTitle}>🎉 You're Earning!</Text>
                <View style={styles.headerSubtitle}>
                  <Icon name="clock" size={12} color="#9CA3AF" />
                  <Text style={styles.headerSubtitleText}>
                    {formatTime(timeSpent)} active
                  </Text>
                </View>
              </View>

              {/* Debug Info */}
              {__DEV__ && (
                <View style={styles.debugContainer}>
                  <Text style={styles.debugText}>
                    Time: {timeSpent.toFixed(3)}h ({Math.round(timeSpent * 60)}m) |
                    Earned: ${earnedAmount.toFixed(2)} |
                    1h: {thresholds.first.can_claim ? '✅' : '❌'} |
                    2h: {thresholds.second.can_claim ? '✅' : '❌'} |
                    Session: {sessionId ? '🟢' : '🔴'}
                  </Text>
                </View>
              )}

              {/* Earnings Counter */}
              <View style={styles.counterContainer}>
                <Animated.Text style={styles.counterAmount}>
                  ${displayAmount}
                </Animated.Text>
                <Text style={styles.counterLabel}>
                  earned so far today
                </Text>
              </View>

              {/* Daily Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Daily progress</Text>
                  <Text style={styles.progressValue}>
                    ${earnedAmount.toFixed(2)} / ${dailyMaximum.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((earnedAmount / dailyMaximum) * 100, 100)}%`
                      }
                    ]}
                  />
                </View>
              </View>

              {/* Next Milestone Card */}
              {nextMilestone.target !== 'completed' && (
                <View style={styles.milestoneCard}>
                  <View style={styles.milestoneHeader}>
                    <View style={styles.milestoneTitleContainer}>
                      <Icon name="target" size={14} color="#60A5FA" />
                      <Text style={styles.milestoneTitle}>Next milestone:</Text>
                    </View>
                    <Text style={styles.milestoneReward}>
                      +${nextMilestone.reward.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.milestoneProgressHeader}>
                    <Text style={styles.milestoneProgressLabel}>
                      {nextMilestone.label}
                    </Text>
                    <Text style={styles.milestoneProgressRemaining}>
                      {nextMilestone.remaining}
                    </Text>
                  </View>
                  <View style={styles.milestoneProgressBar}>
                    <View
                      style={[
                        styles.milestoneProgressFill,
                        {
                          width: nextMilestone.target === 'daily cap'
                            ? `${((dailyMaximum - earnedAmount) / dailyMaximum) * 100}%`
                            : `${Math.min((timeSpent / nextMilestone.target) * 100, 100)}%`
                        }
                      ]}
                    />
                  </View>
                </View>
              )}

              {/* Earning Tiers Toggle */}
              {!showDetails ? (
                <TouchableOpacity
                  onPress={() => setShowDetails(true)}
                  style={styles.viewTiersButton}
                >
                  <View style={styles.viewTiersContent}>
                    <Icon name="zap" size={14} color="#9CA3AF" />
                    <Text style={styles.viewTiersText}>View earning tiers</Text>
                  </View>
                  <Icon name="chevron-right" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <View style={styles.tiersContainer}>
                  {/* First Threshold */}
                  <View style={[
                    styles.tierItem,
                    thresholds.first.claimed && styles.tierItemClaimed,
                    thresholds.first.can_claim && !thresholds.first.claimed && styles.tierItemAvailable
                  ]}>
                    <View style={styles.tierInfo}>
                      <Icon name="star" size={12} color="#FBBF24" />
                      <Text style={styles.tierText}>
                        {formatThresholdLabel(thresholds.first.hours)}
                      </Text>
                    </View>
                    <View style={styles.tierAction}>
                      <Text style={[
                        styles.tierReward,
                        thresholds.first.claimed && styles.tierRewardClaimed,
                        thresholds.first.can_claim && !thresholds.first.claimed && styles.tierRewardAvailable
                      ]}>
                        ${thresholds.first.reward.toFixed(2)}
                      </Text>
                      {thresholds.first.can_claim && !thresholds.first.claimed && (
                        <TouchableOpacity
                          onPress={() => handleClaimReward('first')}
                          disabled={loading}
                          style={styles.claimButton}
                        >
                          <Text style={styles.claimButtonText}>Claim</Text>
                        </TouchableOpacity>
                      )}
                      {thresholds.first.claimed && (
                        <Icon name="check-circle" size={12} color="#34D399" />
                      )}
                    </View>
                  </View>

                  {/* Second Threshold */}
                  <View style={[
                    styles.tierItem,
                    thresholds.second.claimed && styles.tierItemClaimed,
                    thresholds.second.can_claim && !thresholds.second.claimed && styles.tierItemAvailable
                  ]}>
                    <View style={styles.tierInfo}>
                      <Icon name="star" size={12} color="#FBBF24" />
                      <Text style={styles.tierText}>
                        {formatThresholdLabel(thresholds.second.hours)}
                      </Text>
                    </View>
                    <View style={styles.tierAction}>
                      <Text style={[
                        styles.tierReward,
                        thresholds.second.claimed && styles.tierRewardClaimed,
                        thresholds.second.can_claim && !thresholds.second.claimed && styles.tierRewardAvailable
                      ]}>
                        ${thresholds.second.reward.toFixed(2)}
                      </Text>
                      {thresholds.second.can_claim && !thresholds.second.claimed && (
                        <TouchableOpacity
                          onPress={() => handleClaimReward('second')}
                          disabled={loading}
                          style={styles.claimButton}
                        >
                          <Text style={styles.claimButtonText}>Claim</Text>
                        </TouchableOpacity>
                      )}
                      {thresholds.second.claimed && (
                        <Icon name="check-circle" size={12} color="#34D399" />
                      )}
                    </View>
                  </View>

                  {/* Daily Cap Bonus */}
                  <View style={[
                    styles.tierItem,
                    thresholds.bonus.claimed && styles.tierItemClaimed,
                    thresholds.bonus.can_claim && !thresholds.bonus.claimed && styles.tierItemBonus
                  ]}>
                    <View style={styles.tierInfo}>
                      <Icon name="gift" size={12} color="#F472B6" />
                      <Text style={styles.tierText}>Daily cap bonus</Text>
                    </View>
                    <View style={styles.tierAction}>
                      <Text style={[
                        styles.tierReward,
                        thresholds.bonus.claimed && styles.tierRewardClaimed,
                        thresholds.bonus.can_claim && !thresholds.bonus.claimed && styles.tierRewardBonus
                      ]}>
                        ${thresholds.bonus.reward.toFixed(2)}
                      </Text>
                      {thresholds.bonus.can_claim && !thresholds.bonus.claimed && (
                        <TouchableOpacity
                          onPress={() => handleClaimReward('bonus')}
                          disabled={loading}
                          style={[styles.claimButton, styles.claimButtonBonus]}
                        >
                          <Text style={styles.claimButtonText}>Claim</Text>
                        </TouchableOpacity>
                      )}
                      {thresholds.bonus.claimed && (
                        <Icon name="check-circle" size={12} color="#34D399" />
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowDetails(false)}
                    style={styles.showLessButton}
                  >
                    <Text style={styles.showLessText}>Show less</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Claim All Button */}
              {(thresholds.first.can_claim || thresholds.second.can_claim || thresholds.bonus.can_claim) && (
                <TouchableOpacity
                  onPress={() => {
                    if (thresholds.first.can_claim) handleClaimReward('first');
                    if (thresholds.second.can_claim) handleClaimReward('second');
                    if (thresholds.bonus.can_claim) handleClaimReward('bonus');
                  }}
                  disabled={loading}
                  style={styles.claimAllButton}
                >
                  <Text style={styles.claimAllText}>Claim Available Rewards</Text>
                  <Icon name="gift" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              {/* Footer Note */}
              <Text style={styles.footerNote}>
                Keep going to reach ${dailyMaximum.toFixed(2)} today! ✨
              </Text>
            </View>
          </ScrollView>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#10B981" />
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

// ==========================================================
// Manager component
// ==========================================================
const EarningsSlideInManager = () => {
  const [showEarnings, setShowEarnings] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initializeEarnings = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token exists:', !!token);

        if (!token) {
          console.log('No token found, user not logged in');
          return;
        }

        try {
          const response = await axios.get(`${API_ROUTE}/user/profile/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setUserData(response.data);
          console.log('User data fetched successfully');
        } catch (err) {
          console.error('Error fetching user data:', err);
          if (err.response?.status === 401) {
            await AsyncStorage.removeItem('userToken');
          }
          return;
        }

        // Production: show after 1 hour of app usage
        const timerDuration = 3600000;
        console.log(`Will show earnings in ${timerDuration / 1000} seconds...`);

        const timer = setTimeout(() => {
          console.log('Showing earnings slide-in');
          setShowEarnings(true);
        }, timerDuration);

        return () => {
          console.log('Cleaning up timer');
          clearTimeout(timer);
        };
      } catch (error) {
        console.error('Error in initializeEarnings:', error);
      }
    };

    initializeEarnings();
  }, []);

  const handleClose = () => {
    console.log('Closing earnings slide-in');
    setShowEarnings(false);
  };

  const handleClaimReward = (rewardData) => {
    console.log('Reward claimed:', rewardData);
  };

  if (!showEarnings || !userData) return null;

  return (
    <EarningsSlideIn
      visible={showEarnings}
      onClose={handleClose}
      onClaimReward={handleClaimReward}
      userData={userData}
    />
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: Platform.OS === 'web' ? 'flex-end' : 'center',
    paddingTop: Platform.OS === 'web' ? 16 : 40,
    paddingRight: Platform.OS === 'web' ? 16 : 0,
  },
  container: {
    width: Platform.OS === 'web' ? 384 : width - 32,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.5)',
    overflow: 'hidden',
    maxHeight: Platform.OS === 'web' ? '90%' : '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
  },
  errorContainer: {
    position: 'absolute',
    top: 48,
    left: 12,
    right: 12,
    zIndex: 20,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  debugContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  debugText: {
    color: '#FBBF24',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  lottieAnimation: {
    width: 120,
    height: 120,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: -10,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerSubtitleText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  counterAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },
  counterLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  progressValue: {
    fontSize: 12,
    color: '#10B981',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  milestoneCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.5)',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneTitle: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 4,
  },
  milestoneReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FBBF24',
  },
  milestoneProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  milestoneProgressLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  milestoneProgressRemaining: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  milestoneProgressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  milestoneProgressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
  },
  streakCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginLeft: 4,
  },
  streakReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C084FC',
  },
  streakProgress: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 2,
  },
  streakBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  streakBarActive: {
    backgroundColor: '#A855F7',
  },
  streakButton: {
    marginTop: 8,
    backgroundColor: '#9333EA',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  streakButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  viewTiersButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewTiersContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTiersText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  tiersContainer: {
    marginBottom: 12,
    gap: 8,
  },
  tierItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
  },
  tierItemClaimed: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tierItemAvailable: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  tierItemBonus: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  tierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierText: {
    fontSize: 12,
    color: '#D1D5DB',
    marginLeft: 4,
  },
  tierAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierReward: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tierRewardClaimed: {
    color: '#34D399',
  },
  tierRewardAvailable: {
    color: '#FBBF24',
  },
  tierRewardBonus: {
    color: '#F472B6',
  },
  claimButton: {
    backgroundColor: '#059669',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  claimButtonBonus: {
    backgroundColor: '#DB2777',
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  showLessButton: {
    alignItems: 'center',
    marginTop: 4,
  },
  showLessText: {
    fontSize: 12,
    color: '#6B7280',
  },
  claimAllButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  claimAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
    marginTop: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EarningsSlideInManager;