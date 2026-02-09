// import React, {useEffect, useState} from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert,
//   ActivityIndicator,
//   ScrollView
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { LinearGradient } from 'react-native-linear-gradient';
// import { COLORS, TEXT } from '../../ai-scanner/screens/components/Colors';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.43.73:8000/api';

// export default function PollDetail({ route, navigation }) {
//   const { pollId } = route.params;
//   const [poll, setPoll] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [voteLoading, setVoteLoading] = useState(null);
//   const [userVote, setUserVote] = useState(null);

//   const fetchPoll = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/polls/${pollId}/stats/`);
//       const data = await res.json();
//       setPoll(data);
//       setUserVote(data.user_vote);
//     } catch (e) { 
//       console.warn('Failed to fetch poll details:', e); 
//     }
//   };

//   useEffect(() => {
//     fetchPoll();
//     const interval = setInterval(fetchPoll, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const vote = async (choice) => {
//     setVoteLoading(choice);
//     setLoading(true);
    
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       const res = await fetch(`${API_BASE_URL}/polls/${pollId}/vote/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json', 
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ choice })
//       });
      
//       const json = await res.json();
//       if (res.ok) {
//         Alert.alert('Success', 'Your vote has been recorded!');
//         fetchPoll();
//       } else {
//         Alert.alert('Error', json.detail || 'Unable to process your vote');
//       }
//     } catch (e) {
//       console.warn('Vote error:', e);
//       Alert.alert('Error', 'Network error. Please try again.');
//     } finally { 
//       setLoading(false);
//       setVoteLoading(null);
//     }
//   };

//   const unvote = async () => {
//     setLoading(true);
    
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       const res = await fetch(`${API_BASE_URL}/polls/${pollId}/unvote/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json', 
//           'Authorization': `Bearer ${token}`
//         },
//       });
      
//       const json = await res.json();
//       if (res.ok) {
//         Alert.alert('Success', 'Your vote has been removed!');
//         setUserVote(null);
//         fetchPoll();
//       } else {
//         Alert.alert('Error', json.detail || 'Unable to remove vote');
//       }
//     } catch (e) {
//       console.warn('Unvote error:', e);
//       Alert.alert('Error', 'Network error. Please try again.');
//     } finally { 
//       setLoading(false);
//     }
//   };

//   const confirmUnvote = () => {
//     Alert.alert(
//       'Remove Vote',
//       'Are you sure you want to remove your vote?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Remove', style: 'destructive', onPress: unvote }
//       ]
//     );
//   };

//   if (!poll) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.neon} />
//         <Text style={styles.loadingText}>Loading match details...</Text>
//       </View>
//     );
//   }

//   const total = poll.total_votes || 1;
//   const pct = n => Math.round((n / total) * 100);

//   const options = [
//     { key: 'home', label: poll.home_team, count: poll.home_count || 0, icon: 'home' },
//     { key: 'draw', label: 'Draw', count: poll.draw_count || 0, icon: 'swap-horizontal' },
//     { key: 'away', label: poll.away_team, count: poll.away_count || 0, icon: 'away' }
//   ];

//   const getUserVoteLabel = () => {
//     const voteMap = {
//       'home': poll.home_team,
//       'draw': 'Draw',
//       'away': poll.away_team
//     };
//     return voteMap[userVote] || '';
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <LinearGradient
//           colors={['rgba(36, 173, 12, 0.15)', 'rgba(36, 173, 12, 0.05)']}
//           style={styles.headerGradient}
//         >
//           <View style={styles.liveBadge}>
//             <View style={styles.liveDot} />
//             <Text style={styles.liveText}>LIVE POLL</Text>
//           </View>
          
//           <Text style={styles.title}>
//             {poll.home_team} <Text style={styles.vsText}>vs</Text> {poll.away_team}
//           </Text>

//           {/* User Vote Status */}
//           {userVote && (
//             <View style={styles.currentVoteContainer}>
//               <Icon name="check-circle" size={16} color={COLORS.neon} />
//               <Text style={styles.currentVoteText}>
//                 Your vote: <Text style={styles.currentVoteHighlight}>{getUserVoteLabel()}</Text>
//               </Text>
//             </View>
//           )}
//         </LinearGradient>
//       </View>

//       {/* Voting Options */}
//       <View style={styles.optionsContainer}>
//         <Text style={styles.sectionTitle}>Cast Your Vote</Text>
        
//         {options.map((option) => (
//           <TouchableOpacity
//             key={option.key}
//             style={[
//               styles.optionCard,
//               userVote === option.key && styles.optionSelected,
//               voteLoading === option.key && styles.optionLoading
//             ]}
//             onPress={() => vote(option.key)}
//             disabled={loading}
//             activeOpacity={0.8}
//           >
//             <View style={styles.optionContent}>
//               <View style={styles.optionIcon}>
//                 <Icon 
//                   name={option.icon} 
//                   size={20} 
//                   color={userVote === option.key ? COLORS.neon : '#666'} 
//                 />
//                 {userVote === option.key && (
//                   <View style={styles.selectedBadge}>
//                     <Icon name="check" size={12} color="#000" />
//                   </View>
//                 )}
//               </View>
              
//               <View style={styles.optionMain}>
//                 <View style={styles.optionHeader}>
//                   <Text style={[
//                     styles.optionLabel,
//                     userVote === option.key && styles.optionLabelSelected
//                   ]}>
//                     {option.label}
//                   </Text>
//                   <View style={styles.percentageBadge}>
//                     <Text style={styles.percentage}>{pct(option.count)}%</Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.progressContainer}>
//                   <View style={styles.progressBar}>
//                     <View 
//                       style={[
//                         styles.progressFill,
//                         { 
//                           width: `${pct(option.count)}%`,
//                           backgroundColor: option.count > 0 ? COLORS.neon : '#333'
//                         }
//                       ]} 
//                     />
//                   </View>
//                   <Text style={styles.voteCount}>{option.count} votes</Text>
//                 </View>
//               </View>
              
//               <TouchableOpacity
//                 style={[
//                   styles.voteButton,
//                   userVote === option.key && styles.voteButtonSelected,
//                   voteLoading === option.key && styles.voteButtonLoading
//                 ]}
//                 onPress={() => vote(option.key)}
//                 disabled={loading || userVote === option.key}
//               >
//                 {voteLoading === option.key ? (
//                   <ActivityIndicator size="small" color={userVote === option.key ? "#000" : "#FFFFFF"} />
//                 ) : (
//                   <>
//                     <Icon 
//                       name={userVote === option.key ? "check" : "vote"} 
//                       size={16} 
//                       color={userVote === option.key ? "#000" : "#FFFFFF"} 
//                     />
//                     <Text style={[
//                       styles.voteButtonText,
//                       userVote === option.key && styles.voteButtonTextSelected
//                     ]}>
//                       {userVote === option.key ? 'Voted' : 'Vote'}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Unvote Button */}
//       {userVote && (
//         <TouchableOpacity 
//           style={styles.unvoteButton}
//           onPress={confirmUnvote}
//           disabled={loading}
//         >
//           <Icon name="close-circle" size={20} color="#ef4444" />
//           <Text style={styles.unvoteText}>Remove My Vote</Text>
//         </TouchableOpacity>
//       )}

//       {/* Scan Section */}
//       <View style={styles.scanSection}>
//         <LinearGradient
//           colors={['rgba(36, 173, 12, 0.1)', 'rgba(36, 173, 12, 0.05)']}
//           style={styles.scanGradient}
//         >
//           <View style={styles.scanContent}>
//             <View style={styles.scanIconContainer}>
//               <Icon name="qrcode-scan" size={32} color={COLORS.neon} />
//             </View>
//             <View style={styles.scanTextContainer}>
//               <Text style={styles.scanTitle}>Verify Your Vote</Text>
//               <Text style={styles.scanDescription}>
//                 Scan QR code to confirm and secure your vote
//               </Text>
//             </View>
//             <TouchableOpacity 
//               style={styles.scanButton}
//               onPress={() => {/* navigate to scan flow */}}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.scanButtonText}>Scan Now</Text>
//               <Icon name="arrow-right" size={16} color={COLORS.neon} />
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.bg,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: COLORS.bg,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: TEXT.white,
//     marginTop: 12,
//     fontSize: 16,
//   },
//   header: {
//     margin: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 3,
//     borderStyle:'dashed',
//     borderColor: 'rgba(191, 195, 190, 0.2)',
//   },
//   headerGradient: {
//     padding: 24,
//     alignItems: 'center',
//   },
//   liveBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(36, 173, 12, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 16,
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.neon,
//     marginRight: 8,
//   },
//   liveText: {
//     color: COLORS.neon,
//     fontSize: 12,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   title: {
//     color: TEXT.white,
//     fontSize: 24,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   vsText: {
//     color: '#9CA3AF',
//     fontWeight: '500',
//   },
//   currentVoteContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(36, 173, 12, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 12,
//     marginTop: 8,
//     gap: 6,
//   },
//   currentVoteText: {
//     color: TEXT.white,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   currentVoteHighlight: {
//     color: COLORS.neon,
//     fontWeight: '700',
//   },
//   optionsContainer: {
//     padding: 16,
//   },
//   sectionTitle: {
//     color: TEXT.white,
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 16,
//     marginLeft: 8,
//   },
//   optionCard: {
//     marginBottom: 12,
//     borderRadius: 16,
//     backgroundColor: '#1A1A1A',
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   optionSelected: {
//     borderColor: COLORS.neon,
//     backgroundColor: 'rgba(36, 173, 12, 0.05)',
//   },
//   optionLoading: {
//     opacity: 0.7,
//   },
//   optionContent: {
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   optionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2A2A2A',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     position: 'relative',
//   },
//   selectedBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: COLORS.neon,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   optionMain: {
//     flex: 1,
//   },
//   optionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   optionLabel: {
//     color: TEXT.white,
//     fontSize: 16,
//     fontWeight: '600',
//     flex: 1,
//   },
//   optionLabelSelected: {
//     color: COLORS.neon,
//   },
//   percentageBadge: {
//     backgroundColor: 'rgba(36, 173, 12, 0.1)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   percentage: {
//     color: COLORS.neon,
//     fontSize: 14,
//     fontWeight: '700',
//     fontVariant: ['tabular-nums'],
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   progressBar: {
//     flex: 1,
//     height: 4,
//     backgroundColor: '#2A2A2A',
//     borderRadius: 2,
//     marginRight: 12,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 2,
//   },
//   voteCount: {
//     color: '#9CA3AF',
//     fontSize: 12,
//     fontWeight: '500',
//     minWidth: 60,
//   },
//   voteButton: {
//     backgroundColor: '#2A2A2A',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     gap: 6,
//     marginLeft: 12,
//   },
//   voteButtonSelected: {
//     backgroundColor: COLORS.neon,
//   },
//   voteButtonLoading: {
//     opacity: 0.7,
//   },
//   voteButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   voteButtonTextSelected: {
//     color: '#000000',
//   },
//   unvoteButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     borderWidth: 1,
//     borderColor: 'rgba(239, 68, 68, 0.3)',
//     padding: 16,
//     borderRadius: 12,
//     margin: 16,
//     gap: 8,
//   },
//   unvoteText: {
//     color: '#ef4444',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   scanSection: {
//     margin: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(36, 173, 12, 0.15)',
//   },
//   scanGradient: {
//     padding: 20,
//   },
//   scanContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scanIconContainer: {
//     marginRight: 16,
//   },
//   scanTextContainer: {
//     flex: 1,
//   },
//   scanTitle: {
//     color: TEXT.white,
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   scanDescription: {
//     color: '#9CA3AF',
//     fontSize: 12,
//     lineHeight: 16,
//   },
//   scanButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: COLORS.neon,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 6,
//   },
//   scanButtonText: {
//     color: COLORS.neon,
//     fontWeight: '600',
//     fontSize: 14,
//   },
// });

import React, {useEffect, useState} from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { COLORS, TEXT } from '../../ai-scanner/screens/components/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.110:8000/api';

export default function PollDetail({ route, navigation }) {
  const { pollId } = route.params;
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [scanHighlight] = useState(new Animated.Value(0));

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => pulseAnimation());
  };

  const scanHighlightAnimation = () => {
    Animated.sequence([
      Animated.timing(scanHighlight, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scanHighlight, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => scanHighlightAnimation());
  };

  useEffect(() => {
    pulseAnimation();
    scanHighlightAnimation();
  }, []);

  const fetchPoll = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/polls/${pollId}/stats/`);
      const data = await res.json();
      setPoll(data);
      setUserVote(data.user_vote);
    } catch (e) { 
      console.warn('Failed to fetch poll details:', e); 
    }
  };

  useEffect(() => {
    fetchPoll();
    const interval = setInterval(fetchPoll, 5000);
    return () => clearInterval(interval);
  }, []);

  const vote = async (choice) => {
    setVoteLoading(choice);
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/polls/${pollId}/vote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ choice })
      });
      
      const json = await res.json();
      if (res.ok) {
        Alert.alert('✅ Prediction Recorded!', 'Ready to add this to your betslip and confirm your wager?', [
          { text: 'Maybe Later', style: 'cancel' },
          { 
            text: 'Add to Betslip', 
            style: 'default',
            onPress: () => handleScanPress()
          }
        ]);
        fetchPoll();
      } else {
        Alert.alert('Error', json.detail || 'Unable to process your prediction');
      }
    } catch (e) {
      console.warn('Vote error:', e);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally { 
      setLoading(false);
      setVoteLoading(null);
    }
  };

  const unvote = async () => {
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/polls/${pollId}/unvote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
      });
      
      const json = await res.json();
      if (res.ok) {
        Alert.alert('Vote Removed', 'Your prediction has been removed');
        setUserVote(null);
        fetchPoll();
      } else {
        Alert.alert('Error', json.detail || 'Unable to remove prediction');
      }
    } catch (e) {
      console.warn('Unvote error:', e);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally { 
      setLoading(false);
    }
  };

  const confirmUnvote = () => {
    Alert.alert(
      'Remove Prediction',
      'Are you sure you want to remove your prediction?',
      [
        { text: 'Keep It', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: unvote }
      ]
    );
  };

  const handleScanPress = () => {
    Alert.alert(
      '🎯 Add to Betslip',
      'Scan the QR code to add this prediction to your betslip and confirm your wager. Your prediction will be locked in!',
      [
        { text: 'Not Now', style: 'cancel' },
        { 
          text: 'Scan to Confirm Bet', 
          style: 'default',
          onPress: () => navigation.navigate('Scanner', { pollId, userVote })
        }
      ]
    );
  };

  if (!poll) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.neon} />
        <Text style={styles.loadingText}>Loading community insights...</Text>
      </View>
    );
  }

  const total = poll.total_votes || 1;
  const pct = n => Math.round((n / total) * 100);

  const options = [
    { key: 'home', label: poll.home_team, count: poll.home_count || 0, icon: 'home' },
    { key: 'draw', label: 'Draw', count: poll.draw_count || 0, icon: 'swap-horizontal' },
    { key: 'away', label: poll.away_team, count: poll.away_count || 0, icon: 'away' }
  ];

  const getCommunityInsight = () => {
    const homePct = pct(poll.home_count || 0);
    const awayPct = pct(poll.away_count || 0);
    const drawPct = pct(poll.draw_count || 0);
    
    if (homePct > 60) return `Community strongly favors ${poll.home_team}`;
    if (awayPct > 60) return `Community strongly favors ${poll.away_team}`;
    if (Math.abs(homePct - awayPct) < 15) return 'Community is split - close match expected';
    if (drawPct > 30) return 'High draw probability according to community';
    return 'Community insights available - make your prediction';
  };

  const getConfidenceLevel = () => {
    const diff = Math.abs(pct(poll.home_count || 0) - pct(poll.away_count || 0));
    if (diff > 30) return 'High Confidence';
    if (diff > 15) return 'Medium Confidence';
    return 'Split Opinion';
  };

  const scanButtonOpacity = scanHighlight.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.7]
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header with Community Data */}
      <Animated.View style={[styles.header, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={['rgba(36, 173, 12, 0.2)', 'rgba(36, 173, 12, 0.05)']}
          style={styles.headerGradient}
        >
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE COMMUNITY PREDICTIONS</Text>
          </View>
          
          <Text style={styles.title}>
            {poll.home_team} <Text style={styles.vsText}>vs</Text> {poll.away_team}
          </Text>

          <View style={styles.communityInsight}>
            <Icon name="lightbulb" size={16} color={COLORS.neon} />
            <Text style={styles.insightText}>{getCommunityInsight()}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{total}</Text>
              <Text style={styles.statLabel}>Total Predictions</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{pct(poll.home_count || 0)}%</Text>
              <Text style={styles.statLabel}>Home Wins</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{pct(poll.away_count || 0)}%</Text>
              <Text style={styles.statLabel}>Away Wins</Text>
            </View>
          </View>

          {userVote && (
            <View style={styles.currentVoteContainer}>
              <Icon name="check-circle" size={18} color={COLORS.neon} />
              <Text style={styles.currentVoteText}>
                Your prediction recorded! Ready to add to betslip?
              </Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Voting Section with Persuasive Copy */}
      <View style={styles.votingSection}>
        <Text style={styles.sectionTitle}>Make Your Prediction</Text>
        <Text style={styles.sectionSubtitle}>
          Join {total} community members who've already voted • {getConfidenceLevel()}
        </Text>
        
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionCard,
              userVote === option.key && styles.optionSelected,
              voteLoading === option.key && styles.optionLoading
            ]}
            onPress={() => vote(option.key)}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Icon 
                  name={option.icon} 
                  size={22} 
                  color={userVote === option.key ? COLORS.neon : '#666'} 
                />
                {userVote === option.key && (
                  <View style={styles.selectedBadge}>
                    <Icon name="check" size={14} color="#000" />
                  </View>
                )}
              </View>
              
              <View style={styles.optionMain}>
                <View style={styles.optionHeader}>
                  <Text style={[
                    styles.optionLabel,
                    userVote === option.key && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <View style={styles.percentageContainer}>
                    <Text style={styles.percentage}>{pct(option.count)}%</Text>
                    <Text style={styles.voteCount}>({option.count} votes)</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${pct(option.count)}%`,
                          backgroundColor: option.count > 0 ? COLORS.neon : '#333'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.voteButton,
                  userVote === option.key && styles.voteButtonSelected,
                  voteLoading === option.key && styles.voteButtonLoading
                ]}
                onPress={() => vote(option.key)}
                disabled={loading || userVote === option.key}
              >
                {voteLoading === option.key ? (
                  <ActivityIndicator size="small" color={userVote === option.key ? "#000" : "#FFFFFF"} />
                ) : (
                  <>
                    <Icon 
                      name={userVote === option.key ? "check-circle" : "target"} 
                      size={18} 
                      color={userVote === option.key ? "#000" : "#FFFFFF"} 
                    />
                    <Text style={[
                      styles.voteButtonText,
                      userVote === option.key && styles.voteButtonTextSelected
                    ]}>
                      {userVote === option.key ? 'Predicted' : 'Predict'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Unvote Button */}
        {userVote && (
          <TouchableOpacity 
            style={styles.unvoteButton}
            onPress={confirmUnvote}
            disabled={loading}
          >
            <Icon name="close-circle" size={20} color="#ef4444" />
            <Text style={styles.unvoteText}>Change My Prediction</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Enhanced Scan CTA Section */}
      <Animated.View style={[styles.scanSection, { opacity: scanButtonOpacity }]}>
        <LinearGradient
          colors={['rgba(36, 173, 12, 0.15)', 'rgba(36, 173, 12, 0.05)']}
          style={styles.scanGradient}
        >
          <View style={styles.scanContent}>
            <View style={styles.scanIconContainer}>
              <Icon name="qrcode-scan" size={40} color={COLORS.neon} />
              <View style={styles.scanPulse} />
            </View>
            <View style={styles.scanTextContainer}>
              <Text style={styles.scanTitle}>Ready to Place Your Bet?</Text>
              <Text style={styles.scanDescription}>
                Scan to add this prediction to your betslip and confirm your wager
              </Text>
              <View style={styles.benefits}>
                <View style={styles.benefit}>
                  <Icon name="shield-check" size={14} color={COLORS.neon} />
                  <Text style={styles.benefitText}>Secure betting</Text>
                </View>
                <View style={styles.benefit}>
                  <Icon name="rocket-launch" size={14} color={COLORS.neon} />
                  <Text style={styles.benefitText}>Instant confirmation</Text>
                </View>
                <View style={styles.benefit}>
                  <Icon name="chart-line" size={14} color={COLORS.neon} />
                  <Text style={styles.benefitText}>Track performance</Text>
                </View>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleScanPress}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[COLORS.neon, '#1a8c0a']}
              style={styles.scanButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="camera" size={20} color="#000" />
              <Text style={styles.scanButtonText}>Scan to Add to Betslip</Text>
              <Icon name="arrow-right" size={18} color="#000" />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Social Proof Section */}
      <View style={styles.socialProof}>
        <Text style={styles.socialProofTitle}>Why Community Predictions Matter</Text>
        <View style={styles.proofPoints}>
          <View style={styles.proofPoint}>
            <Icon name="chart-bar" size={20} color={COLORS.neon} />
            <View style={styles.proofText}>
              <Text style={styles.proofPointTitle}>Data-Driven Insights</Text>
              <Text style={styles.proofPointDesc}>
                See real voting patterns from {total} predictors
              </Text>
            </View>
          </View>
          <View style={styles.proofPoint}>
            <Icon name="trending-up" size={20} color={COLORS.neon} />
            <View style={styles.proofText}>
              <Text style={styles.proofPointTitle}>Informed Decisions</Text>
              <Text style={styles.proofPointDesc}>
                Make smarter bets with community consensus
              </Text>
            </View>
          </View>
          <View style={styles.proofPoint}>
            <Icon name="clock-check" size={20} color={COLORS.neon} />
            <View style={styles.proofText}>

              <Text style={styles.proofPointTitle}>Real-Time Updates</Text>
              <Text style={styles.proofPointDesc}>
                Live voting data updates every 5 seconds
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Final CTA */}
      <View style={styles.finalCta}>
        <Text style={styles.finalCtaText}>
         Join the winning side. Make your prediction and scan to bet!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: TEXT.white,
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(36, 173, 12, 0.3)',
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 173, 12, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.neon,
    marginRight: 8,
  },
  liveText: {
    color: COLORS.neon,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: TEXT.white,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  vsText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  communityInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  insightText: {
    color: TEXT.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: TEXT.white,
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  currentVoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    width: '100%',
  },
  currentVoteText: {
    color: TEXT.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
  },
  votingSection: {
    padding: 16,
  },
  sectionTitle: {
    color: TEXT.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  optionCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  optionSelected: {
    borderColor: COLORS.neon,
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    transform: [{ scale: 1.02 }],
  },
  optionLoading: {
    opacity: 0.7,
  },
  optionContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  selectedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.neon,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  optionMain: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    color: TEXT.white,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  optionLabelSelected: {
    color: COLORS.neon,
    fontWeight: '700',
  },
  percentageContainer: {
    alignItems: 'flex-end',
  },
  percentage: {
    color: COLORS.neon,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  voteCount: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  voteButton: {
    backgroundColor: '#2A2A2A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginLeft: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  voteButtonSelected: {
    backgroundColor: COLORS.neon,
  },
  voteButtonLoading: {
    opacity: 0.7,
  },
  voteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  voteButtonTextSelected: {
    color: '#000000',
    fontWeight: '800',
  },
  unvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  unvoteText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
  },
  scanSection: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(36, 173, 12, 0.3)',
  },
  scanGradient: {
    padding: 24,
  },
  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanIconContainer: {
    marginRight: 16,
    position: 'relative',
  },
  scanPulse: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.neon,
    opacity: 0.6,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    color: TEXT.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  scanDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  benefitText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  scanButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  scanButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
  socialProof: {
    padding: 16,
    marginTop: 8,
  },
  socialProofTitle: {
    color: TEXT.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  proofPoints: {
    gap: 12,
  },
  proofPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  proofText: {
    flex: 1,
    marginLeft: 12,
  },
  proofPointTitle: {
    color: TEXT.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  proofPointDesc: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  finalCta: {
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(36, 173, 12, 0.3)',
  },
  finalCtaText: {
    color: COLORS.neon,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
  },
});