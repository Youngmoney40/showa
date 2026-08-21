

// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, ScrollView, 
//   TouchableOpacity, RefreshControl, ActivityIndicator,
//   Image, Animated, Dimensions, Modal, Alert,
//   Platform, StatusBar
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon2 from 'react-native-vector-icons/FontAwesome5';
// import LinearGradient from 'react-native-linear-gradient';
// import { API_ROUTE } from '../../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTheme } from '../../src/context/ThemeContext';

// const { width } = Dimensions.get('window');

// const createApiService = () => {
//   const baseURL = `${API_ROUTE}`;
  
//   const api = {
//     interceptors: {
//       request: { use: () => {} },
//       response: { use: () => {} }
//     },
//     defaults: {
//       timeout: 10000,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     },
//   };

//   api.request = async (config) => {
//     try {
//       const mergedConfig = {
//         ...api.defaults,
//         ...config,
//         headers: {
//           ...api.defaults.headers,
//           ...config.headers,
//         },
//       };

//       const token = await AsyncStorage.getItem('userToken');
//       if (token) {
//         mergedConfig.headers.Authorization = `Bearer ${token}`;
//       }
      
//       const response = await fetch(
//         `${baseURL}${mergedConfig.url}`.replace(/([^:]\/)\/+/g, "$1"),
//         {
//           method: mergedConfig.method || 'GET',
//           headers: mergedConfig.headers,
//           body: mergedConfig.data ? JSON.stringify(mergedConfig.data) : null,
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           await AsyncStorage.removeItem('userToken');
//           throw new Error('Unauthorized');
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return { data, status: response.status, headers: response.headers };
//     } catch (error) {
//       console.error('API request error:', error);
//       throw error;
//     }
//   };

//   api.get = (url, config) => api.request({ ...config, url, method: 'GET' });
//   api.post = (url, data, config) => api.request({ ...config, url, data, method: 'POST' });

//   return api;
// };

// const api = createApiService();

// const WalletDashboard = ({ navigation }) => {
//   const { colors, isDark } = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [wallet, setWallet] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [recentTransactions, setRecentTransactions] = useState([]);
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [slideAnim] = useState(new Animated.Value(50));
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);

//   useEffect(() => {
//     fetchWalletData();
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch enhanced wallet data
//       const walletResponse = await api.get('/wallet/enhanced/');
//       setWallet(walletResponse.data);
      
//       // Fetch analytics
//       const analyticsResponse = await api.get('/analytics/');
//       setAnalytics(analyticsResponse.data);
      
//       // Fetch recent transactions
//       const transactionsResponse = await api.get('/rewards/history/?limit=5');
//       setRecentTransactions(transactionsResponse.data.results || transactionsResponse.data);
      
//     } catch (error) {
//       console.error('Error fetching wallet data:', error);
//       Alert.alert('Error', 'Failed to load wallet data. Please try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchWalletData();
//   };

//   const formatCurrency = (amount) => {
//     if (amount === undefined || amount === null) return '$0.00';
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   const formatCoins = (coins) => {
//     if (coins === undefined || coins === null) return '0';
//     return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(coins);
//   };

//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return '0';
//     return new Intl.NumberFormat('en-US').format(num);
//   };

//   const getTransactionIcon = (actionType) => {
//     switch(actionType) {
//       case 'daily_login': return 'alarm';
//       case 'like': return 'thumb-up';
//       case 'comment': return 'comment';
//       case 'follow': return 'person-add';
//       case 'create_post': return 'post-add';
//       case 'watch_video_10s': return 'ondemand-video';
//       case 'watch_full_video': return 'play-circle';
//       case 'first_message': return 'message';
//       case 'reply_message': return 'reply';
//       case 'business_reply': return 'business';
//       case 'referral_signup': return 'group-add';
//       case 'referred_signup': return 'person-add';
//       case 'milestone_achieved': return 'emoji-events';
//       case 'profile_completed': return 'person';
//       case 'phone_verified': return 'phone';
//       case 'email_verified': return 'email';
//       case 'create_catalog': return 'store';
//       case 'withdrawal_fee': return 'attach-money';
//       default: return 'monetization-on';
//     }
//   };

//   const getTransactionColor = (coins, isDark) => {
//     return coins > 0 ? '#4CAF50' : isDark ? '#EF5350' : '#F44336';
//   };

//   const getTransactionTitle = (actionType) => {
//     const titles = {
//       'daily_login': 'Daily Login Reward',
//       'like': 'Liked a Post',
//       'comment': 'Commented on Post',
//       'follow': 'Followed User',
//       'create_post': 'Created Post',
//       'watch_video_10s': 'Watched Video (10s)',
//       'watch_full_video': 'Watched Full Video',
//       'first_message': 'First Message',
//       'reply_message': 'Message Reply',
//       'business_reply': 'Business Reply',
//       'referral_signup': 'Referral Reward',
//       'referred_signup': 'Welcome Bonus',
//       'milestone_achieved': 'Milestone Achieved',
//       'profile_completed': 'Profile Completed',
//       'phone_verified': 'Phone Verified',
//       'email_verified': 'Email Verified',
//       'create_catalog': 'Business Catalog Created',
//       'withdrawal_fee': 'Withdrawal Fee',
//     };
//     return titles[actionType] || actionType?.replace(/_/g, ' ') || 'Transaction';
//   };

//   const getTransactionDescription = (actionType, metadata) => {
//     const descriptions = {
//       'daily_login': 'Daily login streak reward',
//       'like': 'Earned for liking content',
//       'comment': 'Earned for engaging with community',
//       'follow': 'Earned for following users',
//       'create_post': 'Earned for creating content',
//       'watch_video_10s': 'Earned for watching videos',
//       'watch_full_video': 'Earned for watching full videos',
//       'first_message': 'Earned for starting conversations',
//       'reply_message': 'Earned for replying to messages',
//       'business_reply': 'Business mode bonus',
//       'referral_signup': 'Referral program reward',
//       'referred_signup': 'Welcome to Showa!',
//       'milestone_achieved': 'Achievement unlocked',
//       'profile_completed': 'Profile setup complete',
//       'phone_verified': 'Account security bonus',
//       'email_verified': 'Account verification bonus',
//       'create_catalog': 'Business feature bonus',
//       'withdrawal_fee': 'Withdrawal processing fee',
//     };
//     return descriptions[actionType] || 'Activity reward';
//   };

//   const CustomProgressBar = ({ progress, color, height = 6, style, isDark, colors }) => {
//     return (
//       <View style={[
//         styles.customProgressBarContainer, 
//         { height, backgroundColor: isDark ? colors.backgroundSecondary : '#e0e0e0' }, 
//         style
//       ]}>
//         <View 
//           style={[
//             styles.customProgressBarFill, 
//             { 
//               width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
//               backgroundColor: color || colors.primary
//             }
//           ]} 
//         />
//       </View>
//     );
//   };

//   const handleTransactionPress = (transaction) => {
//     setSelectedTransaction(transaction);
//     setModalVisible(true);
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={[styles.loadingText, { color: colors.text }]}>Loading wallet...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'dark-content'}
//         translucent={Platform.OS === 'android'}
//         backgroundColor={Platform.OS === 'android' ? colors.primaryDark || colors.primary : undefined}
//       />
//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//             style={{ backgroundColor: colors.background }}
//           />
//         }
//       >
//         {/* Header */}
//         <LinearGradient
//           colors={[colors.card, colors.card]}
//           style={[styles.header, { 
//             shadowColor: isDark ? '#000' : '#000',
//             shadowOpacity: isDark ? 0.3 : 0.25,
//           }]}
//         >
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={24} color={colors.text} />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, { color: colors.text }]}>My Wallet</Text>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => navigation.navigate('EarningDashbord')}
//           >
//             <Icon name="trending-up" size={24} color={colors.text} />
//           </TouchableOpacity>
//         </LinearGradient>

//         {/* Balance Overview */}
//         <Animated.View 
//           style={[
//             styles.balanceCard,
//             { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <LinearGradient
//             colors={isDark ? [colors.primaryDark || colors.primary, colors.primary] : ['#104ce4ff', '#0d48ddff']}
//             style={styles.gradientCard}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             <View style={styles.balanceHeader}>
//               <Icon2 name="wallet" size={28} color="#fff" />
//               <Text style={styles.balanceTitle}>Total Balance</Text>
//             </View>
            
//             <Text style={styles.balanceAmount}>
//               {formatCurrency(wallet?.usd_total)}
//             </Text>
            
//             <Text style={styles.coinBalance}>
//               {formatCoins(wallet?.coins_total)} coins
//             </Text>
            
//             <View style={styles.balanceBreakdown}>
//               <View style={styles.balanceItem}>
//                 <Text style={styles.balanceLabel}>Available</Text>
//                 <Text style={styles.balanceValue}>
//                   {formatCurrency(wallet?.usd_available)}
//                 </Text>
//               </View>
              
//               <View style={[styles.balanceDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
              
//               <View style={styles.balanceItem}>
//                 <Text style={styles.balanceLabel}>Pending</Text>
//                 <Text style={styles.balanceValue}>
//                   {formatCurrency((wallet?.coins_pending || 0) * (wallet?.exchange_rate || 0.01))}
//                 </Text>
//               </View>
              
//               <View style={[styles.balanceDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
              
//               <View style={styles.balanceItem}>
//                 <Text style={styles.balanceLabel}>Exchange Rate</Text>
//                 <Text style={styles.balanceValue}>
//                   1 coin = {formatCurrency(wallet?.exchange_rate || 0.01)}
//                 </Text>
//               </View>
//             </View>
            
//             <View style={styles.balanceActions}>
//               <TouchableOpacity 
//                 style={[styles.actionButton, styles.withdrawButton, { borderColor: 'rgba(255,255,255,0.3)' }]}
//                 onPress={() => navigation.navigate('WithdrawEarning')}
//               >
//                 <Icon name="arrow-upward" size={20} color="#fff" />
//                 <Text style={[styles.actionButtonText, {color:'#fff'}]}>
//                   Withdraw
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.actionButton, styles.earnButton, { backgroundColor: isDark ? colors.card : '#fffffdff' }]}
//                 onPress={() => navigation.navigate('EarningDashbord')}
//               >
//                 <Icon name="trending-up" size={20} color={isDark ? colors.text : '#000'} />
//                 <Text style={[styles.actionButtonText, { color: isDark ? colors.text : '#000', fontWeight: '900' }]}>
//                   Earn
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </LinearGradient>
//         </Animated.View>

//         {/* Quick Stats */}
//         <View style={styles.statsContainer}>
//           <View style={[styles.statCard, { backgroundColor: colors.card }]}>
//             <View style={[styles.statIcon, { backgroundColor: isDark ? '#4CAF5030' : '#4CAF5020' }]}>
//               <Icon name="today" size={24} color="#4CAF50" />
//             </View>
//             <Text style={[styles.statValue, { color: colors.text }]}>
//               {formatCurrency(analytics?.current_month?.usd_earned || 0)}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Month</Text>
//           </View>
          
//           <View style={[styles.statCard, { backgroundColor: colors.card }]}>
//             <View style={[styles.statIcon, { backgroundColor: isDark ? '#FF980030' : '#FF980020' }]}>
//               <Icon2 name="fire" size={24} color="#FF9800" />
//             </View>
//             <Text style={[styles.statValue, { color: colors.text }]}>{wallet?.streak_count || 0}</Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
//           </View>
          
//           <View style={[styles.statCard, { backgroundColor: colors.card }]}>
//             <View style={[styles.statIcon, { backgroundColor: isDark ? '#2196F330' : '#2196F320' }]}>
//               <Icon name="people" size={24} color="#2196F3" />
//             </View>
//             <Text style={[styles.statValue, { color: colors.text }]}>{wallet?.total_referrals || 0}</Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Referrals</Text>
//           </View>
          
//           <View style={[styles.statCard, { backgroundColor: colors.card }]}>
//             <View style={[styles.statIcon, { backgroundColor: isDark ? '#9C27B030' : '#9C27B020' }]}>
//               <Icon name="star" size={24} color="#9C27B0" />
//             </View>
//             <Text style={[styles.statValue, { color: colors.text }]}>
//               {formatNumber(analytics?.lifetime_stats?.total_tasks_completed || 0)}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tasks Done</Text>
//           </View>
//         </View>

//         {/* Recent Transactions */}
//         <View style={[styles.transactionsContainer, { backgroundColor: colors.card }]}>
//           <View style={styles.transactionsHeader}>
//             <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Earnings</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
//               <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
//             </TouchableOpacity>
//           </View>
          
//           {recentTransactions.length === 0 ? (
//             <View style={styles.emptyTransactions}>
//               <Icon2 name="receipt" size={50} color={colors.textSecondary} />
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>
//               <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Start earning to see transactions here</Text>
//               <TouchableOpacity 
//                 style={[styles.earnNowButton, { backgroundColor: colors.primary }]}
//                 onPress={() => navigation.navigate('EarningDashbord')}
//               >
//                 <Text style={styles.earnNowText}>Start Earning</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             recentTransactions.map((transaction, index) => (
//               <TouchableOpacity 
//                 key={transaction.id || index}
//                 style={[styles.transactionItem, { borderBottomColor: colors.border }]}
//                 onPress={() => handleTransactionPress(transaction)}
//               >
//                 <View style={styles.transactionIconContainer}>
//                   <View style={[
//                     styles.transactionIcon,
//                     { backgroundColor: getTransactionColor(transaction.coins, isDark) + (isDark ? '30' : '20') }
//                   ]}>
//                     <Icon 
//                       name={getTransactionIcon(transaction.action_type)} 
//                       size={20} 
//                       color={getTransactionColor(transaction.coins, isDark)} 
//                     />
//                   </View>
//                 </View>
                
//                 <View style={styles.transactionInfo}>
//                   <Text style={[styles.transactionTitle, { color: colors.text }]}>
//                     {getTransactionTitle(transaction.action_type)}
//                   </Text>
//                   <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>
//                     {new Date(transaction.created_at).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </Text>
//                 </View>
                
//                 <View style={styles.transactionAmount}>
//                   <Text style={[
//                     styles.amountText,
//                     { color: getTransactionColor(transaction.coins, isDark) }
//                   ]}>
//                     {transaction.coins > 0 ? '+' : ''}{transaction.coins}
//                   </Text>
//                   <Text style={[styles.usdAmount, { color: colors.textSecondary }]}>
//                     {formatCurrency(Math.abs(transaction.coins) * (wallet?.exchange_rate || 0.01))}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             ))
//           )}
//         </View>

//         {/* Milestones Progress */}
//         {analytics?.milestones?.length > 0 && (
//           <View style={[styles.milestonesContainer, { backgroundColor: colors.card }]}>
//             <View style={styles.milestonesHeader}>
//               <Text style={[styles.sectionTitle, { color: colors.text }]}>Milestones Progress</Text>
//               <TouchableOpacity onPress={() => navigation.navigate('Milestones')}>
//                 <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
//               </TouchableOpacity>
//             </View>
            
//             {analytics.milestones.slice(0, 3).map((milestone, index) => (
//               <View key={index} style={[styles.milestoneItem, { backgroundColor: colors.backgroundSecondary }]}>
//                 <View style={styles.milestoneHeader}>
//                   <Icon name="star" size={18} color="#FFD700" />
//                   <Text style={[styles.milestoneTitle, { color: colors.text }]}>
//                     {milestone.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                   </Text>
//                   <Text style={[styles.milestoneTarget, { color: colors.textSecondary }]}>
//                     ${formatNumber(milestone.target_value)}
//                   </Text>
//                 </View>
                
//                 <View style={styles.progressContainer}>
//                   <CustomProgressBar 
//                     progress={milestone.progress_percentage / 100}
//                     color={colors.primary}
//                     height={6}
//                     isDark={isDark}
//                     colors={colors}
//                   />
//                   <Text style={[styles.progressText, { color: colors.textSecondary }]}>
//                     ${formatNumber(milestone.current_value)} / ${formatNumber(milestone.target_value)}
//                   </Text>
//                 </View>
                
//                 <View style={[styles.milestoneReward, { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 215, 0, 0.1)' }]}>
//                   <Icon name="monetization-on" size={16} color="#FFD700" />
//                   <Text style={[styles.rewardText, { color: isDark ? '#FFD700' : '#FF9800' }]}>
//                     Reward: +{formatNumber(milestone.reward_coins)} coins
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* FAQ/Help Section */}
//         <View style={[styles.faqContainer, { backgroundColor: colors.card }]}>
//           <Text style={[styles.sectionTitle, { color: colors.text }]}>How It Works</Text>
          
//           <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
//             <Icon name="help" size={18} color={colors.primary} />
//             <Text style={[styles.faqQuestion, { color: colors.text }]}>How do I withdraw money?</Text>
//             <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
//               Go to Withdraw section, enter amount, choose payment method. Minimum ${(wallet?.withdrawal_info?.minimum_usd || 1).toFixed(2)}.
//             </Text>
//           </View>
          
//           <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
//             <Icon name="help" size={18} color={colors.primary} />
//             <Text style={[styles.faqQuestion, { color: colors.text }]}>Are there any fees?</Text>
//             <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
//               Withdrawal fee: {wallet?.withdrawal_info?.fee_percent || 5}%. No fees for earning coins.
//             </Text>
//           </View>
          
//           <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
//             <Icon name="help" size={18} color={colors.primary} />
//             <Text style={[styles.faqQuestion, { color: colors.text }]}>When will I get paid?</Text>
//             <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
//               Withdrawals processed within 24-48 hours. You'll be notified when completed.
//             </Text>
//           </View>
//         </View>

//         {/* Footer */}
//         <View style={[styles.footer, { backgroundColor: colors.card }]}>
//           <View style={styles.footerInfo}>
//             <Icon name="security" size={18} color="#4CAF50" />
//             <Text style={[styles.footerText, { color: colors.textSecondary }]}>Secure & Encrypted Transactions</Text>
//           </View>
//           <View style={styles.footerInfo}>
//             <Icon name="autorenew" size={18} color={colors.primary} />
//             <Text style={[styles.footerText, { color: colors.textSecondary }]}>Real-time Balance Updates</Text>
//           </View>
//           <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
//             Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Transaction Detail Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//           <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
//             {selectedTransaction && (
//               <>
//                 <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
//                   <View style={[
//                     styles.modalIcon,
//                     { backgroundColor: getTransactionColor(selectedTransaction.coins, isDark) + (isDark ? '30' : '20') }
//                   ]}>
//                     <Icon 
//                       name={getTransactionIcon(selectedTransaction.action_type)} 
//                       size={30} 
//                       color={getTransactionColor(selectedTransaction.coins, isDark)} 
//                     />
//                   </View>
//                   <View style={styles.modalTitleContainer}>
//                     <Text style={[styles.modalTitle, { color: colors.text }]}>
//                       {getTransactionTitle(selectedTransaction.action_type)}
//                     </Text>
//                     <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
//                       {new Date(selectedTransaction.created_at).toLocaleString()}
//                     </Text>
//                   </View>
//                   <TouchableOpacity 
//                     style={styles.closeButton}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Icon name="close" size={24} color={colors.textSecondary} />
//                   </TouchableOpacity>
//                 </View>
                
//                 <ScrollView style={styles.modalBody}>
//                   <View style={[styles.modalRewardCard, { backgroundColor: colors.backgroundSecondary }]}>
//                     <Text style={[styles.modalRewardTitle, { color: colors.textSecondary }]}>Amount Earned</Text>
//                     <Text style={[
//                       styles.modalRewardAmount,
//                       { color: getTransactionColor(selectedTransaction.coins, isDark) }
//                     ]}>
//                       {selectedTransaction.coins > 0 ? '+' : ''}{selectedTransaction.coins} coins
//                     </Text>
//                     <Text style={[styles.modalRewardValue, { color: colors.textSecondary }]}>
//                       ≈ {formatCurrency(Math.abs(selectedTransaction.coins) * (wallet?.exchange_rate || 0.01))}
//                     </Text>
//                   </View>
                  
//                   <View style={[styles.modalInfoCard, { borderColor: colors.border }]}>
//                     <Text style={[styles.modalInfoTitle, { color: colors.text }]}>Transaction Details</Text>
//                     <View style={styles.infoRow}>
//                       <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type:</Text>
//                       <Text style={[styles.infoValue, { color: colors.text }]}>
//                         {selectedTransaction.action_type?.replace(/_/g, ' ')}
//                       </Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                       <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Date:</Text>
//                       <Text style={[styles.infoValue, { color: colors.text }]}>
//                         {new Date(selectedTransaction.created_at).toLocaleString()}
//                       </Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                       <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Description:</Text>
//                       <Text style={[styles.infoValue, { color: colors.text }]}>
//                         {getTransactionDescription(selectedTransaction.action_type, selectedTransaction.metadata)}
//                       </Text>
//                     </View>
//                     {selectedTransaction.reference_id && (
//                       <View style={styles.infoRow}>
//                         <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Reference ID:</Text>
//                         <Text style={[styles.infoValue, { color: colors.text }]}>
//                           {selectedTransaction.reference_id}
//                         </Text>
//                       </View>
//                     )}
//                   </View>
                  
//                   {selectedTransaction.metadata && Object.keys(selectedTransaction.metadata).length > 0 && (
//                     <View style={[styles.modalMetadataCard, { backgroundColor: colors.backgroundSecondary }]}>
//                       <Text style={[styles.modalInfoTitle, { color: colors.text }]}>Additional Information</Text>
//                       {Object.entries(selectedTransaction.metadata).map(([key, value], index) => (
//                         <View key={index} style={styles.infoRow}>
//                           <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{key.replace(/_/g, ' ')}:</Text>
//                           <Text style={[styles.infoValue, { color: colors.text }]}>{String(value)}</Text>
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                 </ScrollView>
                
//                 <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
//                   <TouchableOpacity 
//                     style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Text style={styles.modalCloseButtonText}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   errorSubtext: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   header: {
//     ...Platform.select({
//       ios: {
//         shadowOffset: { width: 0, height: 3 },
//         shadowRadius: 3.84,
//         marginBottom: 10,
//       },
//       android: {
//         elevation: 5
//       }
//     }),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//   },
//   backButton: {
//     padding: 2,
//     paddingHorizontal: 20
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     paddingVertical: 25
//   },
//   notificationButton: {
//     padding: 5,
//   },
//   balanceCard: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   gradientCard: {
//     padding: Platform.OS === 'android' ? 25 : 0,
//     borderRadius: 20,
//   },
//   balanceHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     padding: 20
//   },
//   balanceTitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     marginLeft: 10,
//   },
//   balanceAmount: {
//     fontSize: 42,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
//     paddingHorizontal: 20
//   },
//   coinBalance: {
//     fontSize: 18,
//     color: 'rgba(255,255,255,0.8)',
//     marginBottom: 25,
//     paddingHorizontal: 20
//   },
//   balanceBreakdown: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 25,
//     paddingHorizontal: 5,
//   },
//   balanceItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   balanceDivider: {
//     width: 1,
//     height: 40,
//   },
//   balanceLabel: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.7)',
//     marginBottom: 5,
//   },
//   balanceValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   balanceActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     flex: 1,
//   },
//   withdrawButton: {
//     borderWidth: 1,
//   },
//   earnButton: {
//     // backgroundColor is set inline
//   },
//   actionButtonText: {
//     fontWeight: '600',
//     marginLeft: 8,
//     fontSize: 14,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 20,
//     marginTop: 20,
//     gap: 10,
//   },
//   statCard: {
//     width: (width - 60) / 2,
//     borderRadius: 15,
//     padding: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   statIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   statLabel: {
//     fontSize: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   viewAllText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   transactionsContainer: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   transactionsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   emptyTransactions: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   earnNowButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   earnNowText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   transactionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   transactionIconContainer: {
//     marginRight: 15,
//   },
//   transactionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   transactionInfo: {
//     flex: 1,
//   },
//   transactionTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 3,
//   },
//   transactionTime: {
//     fontSize: 12,
//   },
//   transactionAmount: {
//     alignItems: 'flex-end',
//   },
//   amountText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 2,
//   },
//   usdAmount: {
//     fontSize: 12,
//   },
//   milestonesContainer: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   milestonesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   milestoneItem: {
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//   },
//   milestoneHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   milestoneTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     flex: 1,
//     marginLeft: 8,
//   },
//   milestoneTarget: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   progressContainer: {
//     marginBottom: 10,
//   },
//   progressText: {
//     fontSize: 12,
//     marginTop: 5,
//     textAlign: 'right',
//   },
//   milestoneReward: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 15,
//     alignSelf: 'flex-start',
//   },
//   rewardText: {
//     fontSize: 11,
//     fontWeight: '600',
//     marginLeft: 5,
//   },
//   faqContainer: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   faqItem: {
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//   },
//   faqQuestion: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 5,
//     marginBottom: 5,
//   },
//   faqAnswer: {
//     fontSize: 13,
//     lineHeight: 20,
//   },
//   footer: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 40,
//     padding: 20,
//     borderRadius: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   footerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   footerText: {
//     fontSize: 14,
//     marginLeft: 10,
//   },
//   footerNote: {
//     fontSize: 12,
//     marginTop: 10,
//     fontStyle: 'italic',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//   },
//   modalIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   modalTitleContainer: {
//     flex: 1,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   modalSubtitle: {
//     fontSize: 13,
//     marginTop: 3,
//   },
//   closeButton: {
//     padding: 5,
//   },
//   modalBody: {
//     padding: 20,
//   },
//   modalRewardCard: {
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalRewardTitle: {
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   modalRewardAmount: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   modalRewardValue: {
//     fontSize: 16,
//   },
//   modalInfoCard: {
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//   },
//   modalInfoTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 15,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   infoLabel: {
//     fontSize: 14,
//     width: 100,
//   },
//   infoValue: {
//     fontSize: 14,
//     flex: 1,
//     fontWeight: '500',
//   },
//   modalMetadataCard: {
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//   },
//   modalFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//   },
//   modalCloseButton: {
//     paddingVertical: 15,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   modalCloseButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   customProgressBarContainer: {
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   customProgressBarFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
// });

// export default WalletDashboard;

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, RefreshControl, ActivityIndicator,
  Image, Animated, Dimensions, Modal, Alert,
  Platform, StatusBar, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { API_ROUTE } from '../../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const createApiService = () => {
  const baseURL = `${API_ROUTE}`;
  
  const api = {
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} }
    },
    defaults: {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  api.request = async (config) => {
    try {
      const mergedConfig = {
        ...api.defaults,
        ...config,
        headers: {
          ...api.defaults.headers,
          ...config.headers,
        },
      };

      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        mergedConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(
        `${baseURL}${mergedConfig.url}`.replace(/([^:]\/)\/+/g, "$1"),
        {
          method: mergedConfig.method || 'GET',
          headers: mergedConfig.headers,
          body: mergedConfig.data ? JSON.stringify(mergedConfig.data) : null,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  api.get = (url, config) => api.request({ ...config, url, method: 'GET' });
  api.post = (url, data, config) => api.request({ ...config, url, data, method: 'POST' });

  return api;
};

const api = createApiService();

const WalletDashboard = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetAnim] = useState(new Animated.Value(0));
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchWalletData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch enhanced wallet data
      const walletResponse = await api.get('/wallet/enhanced/');
      setWallet(walletResponse.data);
      
      // Fetch analytics
      const analyticsResponse = await api.get('/analytics/');
      setAnalytics(analyticsResponse.data);
      
      // Fetch recent transactions (max 10)
      const transactionsResponse = await api.get('/rewards/history/?limit=50');
      const transactions = transactionsResponse.data.results || transactionsResponse.data || [];
      setRecentTransactions(transactions.slice(0, 5));
      setAllTransactions(transactions);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      setLoadingMore(true);
      const response = await api.get('/rewards/history/?limit=50');
      const transactions = response.data.results || response.data || [];
      setAllTransactions(transactions);
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      Alert.alert('Error', 'Failed to load transaction history.');
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatCoins = (coins) => {
    if (coins === undefined || coins === null) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(coins);
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTransactionIcon = (actionType) => {
    switch(actionType) {
      case 'daily_login': return 'alarm';
      case 'like': return 'thumb-up';
      case 'comment': return 'comment';
      case 'follow': return 'person-add';
      case 'create_post': return 'post-add';
      case 'watch_video_10s': return 'ondemand-video';
      case 'watch_full_video': return 'play-circle';
      case 'first_message': return 'message';
      case 'reply_message': return 'reply';
      case 'business_reply': return 'business';
      case 'referral_signup': return 'group-add';
      case 'referred_signup': return 'person-add';
      case 'milestone_achieved': return 'emoji-events';
      case 'profile_completed': return 'person';
      case 'phone_verified': return 'phone';
      case 'email_verified': return 'email';
      case 'create_catalog': return 'store';
      case 'withdrawal_fee': return 'attach-money';
      default: return 'monetization-on';
    }
  };

  const getTransactionColor = (coins, isDark) => {
    return coins > 0 ? '#4CAF50' : isDark ? '#EF5350' : '#F44336';
  };

  const getTransactionTitle = (actionType) => {
    const titles = {
      'daily_login': 'Daily Login Reward',
      'like': 'Liked a Post',
      'comment': 'Commented on Post',
      'follow': 'Followed User',
      'create_post': 'Created Post',
      'watch_video_10s': 'Watched Video (10s)',
      'watch_full_video': 'Watched Full Video',
      'first_message': 'First Message',
      'reply_message': 'Message Reply',
      'business_reply': 'Business Reply',
      'referral_signup': 'Referral Reward',
      'referred_signup': 'Welcome Bonus',
      'milestone_achieved': 'Milestone Achieved',
      'profile_completed': 'Profile Completed',
      'phone_verified': 'Phone Verified',
      'email_verified': 'Email Verified',
      'create_catalog': 'Business Catalog Created',
      'withdrawal_fee': 'Withdrawal Fee',
    };
    return titles[actionType] || actionType?.replace(/_/g, ' ') || 'Transaction';
  };

  const getTransactionDescription = (actionType, metadata) => {
    const descriptions = {
      'daily_login': 'Daily login streak reward',
      'like': 'Earned for liking content',
      'comment': 'Earned for engaging with community',
      'follow': 'Earned for following users',
      'create_post': 'Earned for creating content',
      'watch_video_10s': 'Earned for watching videos',
      'watch_full_video': 'Earned for watching full videos',
      'first_message': 'Earned for starting conversations',
      'reply_message': 'Earned for replying to messages',
      'business_reply': 'Business mode bonus',
      'referral_signup': 'Referral program reward',
      'referred_signup': 'Welcome to Showa!',
      'milestone_achieved': 'Achievement unlocked',
      'profile_completed': 'Profile setup complete',
      'phone_verified': 'Account security bonus',
      'email_verified': 'Account verification bonus',
      'create_catalog': 'Business feature bonus',
      'withdrawal_fee': 'Withdrawal processing fee',
    };
    return descriptions[actionType] || 'Activity reward';
  };

  const CustomProgressBar = ({ progress, color, height = 6, style, isDark, colors }) => {
    return (
      <View style={[
        styles.customProgressBarContainer, 
        { height, backgroundColor: isDark ? colors.backgroundSecondary : '#e0e0e0' }, 
        style
      ]}>
        <View 
          style={[
            styles.customProgressBarFill, 
            { 
              width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
              backgroundColor: color || colors.primary
            }
          ]} 
        />
      </View>
    );
  };

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const openBottomSheet = async () => {
    if (allTransactions.length === 0) {
      await fetchAllTransactions();
    }
    setBottomSheetVisible(true);
    Animated.spring(bottomSheetAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setBottomSheetVisible(false);
    });
  };

  const renderTransactionItem = ({ item, index }) => (
    <TouchableOpacity 
      key={item.id || index}
      style={[styles.transactionItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        closeBottomSheet();
        setTimeout(() => handleTransactionPress(item), 300);
      }}
    >
      <View style={styles.transactionIconContainer}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: getTransactionColor(item.coins, isDark) + (isDark ? '30' : '20') }
        ]}>
          <Icon 
            name={getTransactionIcon(item.action_type)} 
            size={20} 
            color={getTransactionColor(item.coins, isDark)} 
          />
        </View>
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionTitle, { color: colors.text }]}>
          {getTransactionTitle(item.action_type)}
        </Text>
        <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: getTransactionColor(item.coins, isDark) }
        ]}>
          {item.coins > 0 ? '+' : ''}{item.coins}
        </Text>
        <Text style={[styles.usdAmount, { color: colors.textSecondary }]}>
          {formatCurrency(Math.abs(item.coins) * (wallet?.exchange_rate || 0.01))}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading wallet...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primaryDark || colors.primary : undefined}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            style={{ backgroundColor: colors.background }}
          />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.card, colors.card]}
          style={[styles.header, { 
            shadowColor: isDark ? '#000' : '#000',
            shadowOpacity: isDark ? 0.3 : 0.25,
          }]}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Wallet</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('EarningDashbord')}
          >
            <Icon name="trending-up" size={24} color={colors.text} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Balance Overview */}
        <Animated.View 
          style={[
            styles.balanceCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={isDark ? [colors.primaryDark || colors.primary, colors.primary] : ['#104ce4ff', '#0d48ddff']}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.balanceHeader}>
              <Icon2 name="wallet" size={28} color="#fff" />
              <Text style={styles.balanceTitle}>Total Balance</Text>
            </View>
            
            <Text style={styles.balanceAmount}>
              {formatCurrency(wallet?.usd_total)}
            </Text>
            
            <Text style={styles.coinBalance}>
              {formatCoins(wallet?.coins_total)} coins
            </Text>
            
            <View style={styles.balanceBreakdown}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Available</Text>
                <Text style={styles.balanceValue}>
                  {formatCurrency(wallet?.usd_available)}
                </Text>
              </View>
              
              <View style={[styles.balanceDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
              
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Pending</Text>
                <Text style={styles.balanceValue}>
                  {formatCurrency((wallet?.coins_pending || 0) * (wallet?.exchange_rate || 0.01))}
                </Text>
              </View>
              
              <View style={[styles.balanceDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
              
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Exchange Rate</Text>
                <Text style={styles.balanceValue}>
                  1 coin = {formatCurrency(wallet?.exchange_rate || 0.01)}
                </Text>
              </View>
            </View>
            
            <View style={styles.balanceActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.withdrawButton, { borderColor: 'rgba(255,255,255,0.3)' }]}
                onPress={() => navigation.navigate('WithdrawEarning')}
              >
                <Icon name="arrow-upward" size={20} color="#fff" />
                <Text style={[styles.actionButtonText, {color:'#fff'}]}>
                  Withdraw
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.earnButton, { backgroundColor: isDark ? colors.card : '#fffffdff' }]}
                onPress={() => navigation.navigate('EarningDashbord')}
              >
                <Icon name="trending-up" size={20} color={isDark ? colors.text : '#000'} />
                <Text style={[styles.actionButtonText, { color: isDark ? colors.text : '#000', fontWeight: '900' }]}>
                  Earn
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? '#4CAF5030' : '#4CAF5020' }]}>
              <Icon name="today" size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatCurrency(analytics?.current_month?.usd_earned || 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Month</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? '#FF980030' : '#FF980020' }]}>
              <Icon2 name="fire" size={24} color="#FF9800" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{wallet?.streak_count || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? '#2196F330' : '#2196F320' }]}>
              <Icon name="people" size={24} color="#2196F3" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{wallet?.total_referrals || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Referrals</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? '#9C27B030' : '#9C27B020' }]}>
              <Icon name="star" size={24} color="#9C27B0" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatNumber(analytics?.lifetime_stats?.total_tasks_completed || 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tasks Done</Text>
          </View>
        </View>

        {/* Recent Transactions - UPDATED */}
        <View style={[styles.transactionsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Earnings</Text>
            {recentTransactions.length > 0 && (
              <TouchableOpacity onPress={openBottomSheet}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Icon2 name="receipt" size={50} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Start earning to see transactions here</Text>
              <TouchableOpacity 
                style={[styles.earnNowButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('EarningDashbord')}
              >
                <Text style={styles.earnNowText}>Start Earning</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {recentTransactions.map((transaction, index) => (
                <TouchableOpacity 
                  key={transaction.id || index}
                  style={[styles.transactionItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleTransactionPress(transaction)}
                >
                  <View style={styles.transactionIconContainer}>
                    <View style={[
                      styles.transactionIcon,
                      { backgroundColor: getTransactionColor(transaction.coins, isDark) + (isDark ? '30' : '20') }
                    ]}>
                      <Icon 
                        name={getTransactionIcon(transaction.action_type)} 
                        size={20} 
                        color={getTransactionColor(transaction.coins, isDark)} 
                      />
                    </View>
                  </View>
                  
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionTitle, { color: colors.text }]}>
                      {getTransactionTitle(transaction.action_type)}
                    </Text>
                    <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>
                      {new Date(transaction.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionAmount}>
                    <Text style={[
                      styles.amountText,
                      { color: getTransactionColor(transaction.coins, isDark) }
                    ]}>
                      {transaction.coins > 0 ? '+' : ''}{transaction.coins}
                    </Text>
                    <Text style={[styles.usdAmount, { color: colors.textSecondary }]}>
                      {formatCurrency(Math.abs(transaction.coins) * (wallet?.exchange_rate || 0.01))}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              {recentTransactions.length === 5 && (
                <TouchableOpacity 
                  style={[styles.viewAllButton, { borderTopColor: colors.border }]}
                  onPress={openBottomSheet}
                >
                  <Text style={[styles.viewAllButtonText, { color: colors.primary }]}>
                    View All Transactions
                  </Text>
                  <Icon name="arrow-forward" size={18} color={colors.primary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Milestones Progress */}
        {analytics?.milestones?.length > 0 && (
          <View style={[styles.milestonesContainer, { backgroundColor: colors.card }]}>
            <View style={styles.milestonesHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Milestones Progress</Text>
              {/* <TouchableOpacity onPress={() => navigation.navigate('Milestones')}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity> */}
            </View>
            
            {analytics.milestones.slice(0, 3).map((milestone, index) => (
              <View key={index} style={[styles.milestoneItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.milestoneHeader}>
                  {/* <Icon name="star" size={18} color="#FFD700" /> */}
                  <Text style={[styles.milestoneTitle, { color: colors.text }]}>
                    {milestone.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                  <Text style={[styles.milestoneTarget, { color: colors.textSecondary }]}>
                    ${formatNumber(milestone.target_value)}
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <CustomProgressBar 
                    progress={milestone.progress_percentage / 100}
                    color={colors.primary}
                    height={6}
                    isDark={isDark}
                    colors={colors}
                  />
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    ${formatNumber(milestone.current_value)} / ${formatNumber(milestone.target_value)}
                  </Text>
                </View>
                
                <View style={[styles.milestoneReward, { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 215, 0, 0.1)' }]}>
                  <Icon name="monetization-on" size={16} color="#FFD700" />
                  <Text style={[styles.rewardText, { color: isDark ? '#FFD700' : '#FF9800' }]}>
                    Reward: +{formatNumber(milestone.reward_coins)} coins
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* FAQ/Help Section */}
        <View style={[styles.faqContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>How It Works</Text>
          
          <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
            <Icon name="help" size={18} color={colors.primary} />
            <Text style={[styles.faqQuestion, { color: colors.text }]}>How do I withdraw money?</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              Go to Withdraw section, enter amount, choose payment method. Minimum ${(wallet?.withdrawal_info?.minimum_usd || 1).toFixed(2)}.
            </Text>
          </View>
          
          <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
            <Icon name="help" size={18} color={colors.primary} />
            <Text style={[styles.faqQuestion, { color: colors.text }]}>Are there any fees?</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              Withdrawal fee: {wallet?.withdrawal_info?.fee_percent || 5}%. No fees for earning coins.
            </Text>
          </View>
          
          <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
            <Icon name="help" size={18} color={colors.primary} />
            <Text style={[styles.faqQuestion, { color: colors.text }]}>When will I get paid?</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              Withdrawals processed within 24-48 hours. You'll be notified when completed.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.card }]}>
          <View style={styles.footerInfo}>
            <Icon name="security" size={18} color="#4CAF50" />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Secure & Encrypted Transactions</Text>
          </View>
          <View style={styles.footerInfo}>
            <Icon name="autorenew" size={18} color={colors.primary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Real-time Balance Updates</Text>
          </View>
          <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </ScrollView>

      {/* Transaction Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {selectedTransaction && (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <View style={[
                    styles.modalIcon,
                    { backgroundColor: getTransactionColor(selectedTransaction.coins, isDark) + (isDark ? '30' : '20') }
                  ]}>
                    <Icon 
                      name={getTransactionIcon(selectedTransaction.action_type)} 
                      size={30} 
                      color={getTransactionColor(selectedTransaction.coins, isDark)} 
                    />
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {getTransactionTitle(selectedTransaction.action_type)}
                    </Text>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                      {new Date(selectedTransaction.created_at).toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Icon name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  <View style={[styles.modalRewardCard, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.modalRewardTitle, { color: colors.textSecondary }]}>Amount Earned</Text>
                    <Text style={[
                      styles.modalRewardAmount,
                      { color: getTransactionColor(selectedTransaction.coins, isDark) }
                    ]}>
                      {selectedTransaction.coins > 0 ? '+' : ''}{selectedTransaction.coins} coins
                    </Text>
                    <Text style={[styles.modalRewardValue, { color: colors.textSecondary }]}>
                      ≈ {formatCurrency(Math.abs(selectedTransaction.coins) * (wallet?.exchange_rate || 0.01))}
                    </Text>
                  </View>
                  
                  <View style={[styles.modalInfoCard, { borderColor: colors.border }]}>
                    <Text style={[styles.modalInfoTitle, { color: colors.text }]}>Transaction Details</Text>
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type:</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {selectedTransaction.action_type?.replace(/_/g, ' ')}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Date:</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {new Date(selectedTransaction.created_at).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Description:</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {getTransactionDescription(selectedTransaction.action_type, selectedTransaction.metadata)}
                      </Text>
                    </View>
                    {selectedTransaction.reference_id && (
                      <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Reference ID:</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                          {selectedTransaction.reference_id}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {selectedTransaction.metadata && Object.keys(selectedTransaction.metadata).length > 0 && (
                    <View style={[styles.modalMetadataCard, { backgroundColor: colors.backgroundSecondary }]}>
                      <Text style={[styles.modalInfoTitle, { color: colors.text }]}>Additional Information</Text>
                      {Object.entries(selectedTransaction.metadata).map(([key, value], index) => (
                        <View key={index} style={styles.infoRow}>
                          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{key.replace(/_/g, ' ')}:</Text>
                          <Text style={[styles.infoValue, { color: colors.text }]}>{String(value)}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
                
                <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                  <TouchableOpacity 
                    style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Sheet for All Transactions */}
      <Modal
        visible={bottomSheetVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity 
            style={styles.bottomSheetBackdrop} 
            activeOpacity={1}
            onPress={closeBottomSheet}
          />
          <Animated.View 
            style={[
              styles.bottomSheetContainer,
              {
                backgroundColor: colors.card,
                transform: [{
                  translateY: bottomSheetAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  })
                }]
              }
            ]}
          >
            {/* Drag Handle */}
            <View style={styles.bottomSheetHandle}>
              <View style={[styles.bottomSheetHandleBar, { backgroundColor: colors.border }]} />
            </View>

            {/* Header */}
            <View style={[styles.bottomSheetHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>
                All Transactions
              </Text>
              <Text style={[styles.bottomSheetSubtitle, { color: colors.textSecondary }]}>
                {allTransactions.length} transactions
              </Text>
              <TouchableOpacity 
                style={styles.bottomSheetClose}
                onPress={closeBottomSheet}
              >
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            {/* <View style={styles.bottomSheetSummary}>
              <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Earned</Text>
                <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                  {formatCurrency(allTransactions.reduce((sum, t) => sum + (t.coins > 0 ? t.coins * (wallet?.exchange_rate || 0.01) : 0), 0))}
                </Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Coins</Text>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>
                  {formatCoins(allTransactions.reduce((sum, t) => sum + (t.coins > 0 ? t.coins : 0), 0))}
                </Text>
              </View>
            </View> */}

            {/* Transaction List */}
            {loadingMore ? (
              <View style={styles.bottomSheetLoading}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading transactions...</Text>
              </View>
            ) : (
              <FlatList
                data={allTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                contentContainerStyle={styles.bottomSheetList}
                showsVerticalScrollIndicator={false}
                initialNumToRender={15}
                maxToRenderPerBatch={20}
                ListEmptyComponent={() => (
                  <View style={styles.emptyTransactions}>
                    <Icon2 name="receipt" size={40} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions found</Text>
                  </View>
                )}
              />
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3.84,
        marginBottom: 10,
      },
      android: {
        elevation: 5
      }
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  backButton: {
    padding: 2,
    paddingHorizontal: 20
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 25
  },
  notificationButton: {
    padding: 5,
  },
  balanceCard: {
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientCard: {
    padding: Platform.OS === 'android' ? 25 : 0,
    borderRadius: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10
  },
  balanceTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 10,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    paddingHorizontal: 20
  },
  coinBalance: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 25,
    paddingHorizontal: 20
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceDivider: {
    width: 1,
    height: 40,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
  },
  withdrawButton: {
    borderWidth: 1,
  },
  earnButton: {
    // backgroundColor is set inline
  },
  actionButtonText: {
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  earnNowButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  earnNowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  transactionIconContainer: {
    marginRight: 15,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  transactionTime: {
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  usdAmount: {
    fontSize: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    marginTop: 5,
    borderTopWidth: 1,
  },
  viewAllButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 5,
  },
  milestonesContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  milestonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  milestoneItem: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  milestoneTarget: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  milestoneReward: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },
  faqContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  faqItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    marginLeft: 10,
  },
  footerNote: {
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalRewardCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  modalRewardTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalRewardAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalRewardValue: {
    fontSize: 16,
  },
  modalInfoCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  modalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  modalMetadataCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
  },
  modalCloseButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customProgressBarContainer: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  customProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  // Bottom Sheet Styles
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
  },
  bottomSheetHandle: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  bottomSheetHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    marginRight: 10,
  },
  bottomSheetClose: {
    padding: 5,
  },
  bottomSheetSummary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSheetList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bottomSheetLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});

export default WalletDashboard;