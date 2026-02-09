// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   RefreshControl,
// // //   FlatList,
// // //   Alert,
// // //   ActivityIndicator,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // //import API_BASE_URL from '../src/app/ai-scanner/screens/components/ApiAiRoute';

// // // const API_BASE_URL = 'http://192.168.1.120:8000/api';

// // // const ForYouScreen = ({ navigation }) => {
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [recommendations, setRecommendations] = useState([]);
// // //   const [userStats, setUserStats] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [communityInsights, setCommunityInsights] = useState({});


// // // const handleSaveRecommendation = async (recommendation) => {
// // //   try {
// // //     const token = await AsyncStorage.getItem('access_token');
    
// // //     const saveData = {
// // //       home_team: recommendation.home_team,
// // //       away_team: recommendation.away_team,
// // //       league: recommendation.league,
// // //       confidence_score: recommendation.confidence,
// // //       risk_level: recommendation.risk_level,
// // //       analysis_data: {
// // //         insights: recommendation.insights || [],
// // //         injury_report: recommendation.injury_report || [],
// // //         form_analysis: recommendation.form_analysis || {},
// // //         potential_odds: recommendation.potential_odds
// // //       },
// // //       notes: `AI Recommended - ${recommendation.confidence}% confidence`
// // //     };

// // //     const response = await fetch(`${API_BASE_URL}/bets/save-match/`, {
// // //       method: 'POST',
// // //       headers: {
// // //         'Authorization': `Bearer ${token}`,
// // //         'Content-Type': 'application/json',
// // //       },
// // //       body: JSON.stringify(saveData),
// // //     });
    
// // //     const result = await response.json();
    
// // //     if (response.ok) {
// // //       Alert.alert('✅ Saved!', 'Match saved to your favorites');
// // //       // Update UI to show saved state
// // //       setRecommendations(prev => prev.map(rec => 
// // //         rec.id === recommendation.id 
// // //           ? { ...rec, is_saved: true, saved_match_id: result.saved_match?.id }
// // //           : rec
// // //       ));
// // //     } else {
// // //       // Check if it's an "already saved" error
// // //       if (result.already_saved) {
// // //         Alert.alert('💾 Already Saved', 'This match is already in your favorites!');
       
// // //         setRecommendations(prev => prev.map(rec => 
// // //           rec.id === recommendation.id 
// // //             ? { ...rec, is_saved: true, saved_match_id: result.saved_match_id }
// // //             : rec
// // //         ));
// // //       } else {
// // //         throw new Error(result.error || 'Save failed');
// // //       }
// // //     }
// // //   } catch (error) {
// // //     console.error('Save recommendation error:', error);
// // //     Alert.alert('Error', error.message || 'Failed to save match');
// // //   }
// // // };
// // //   useEffect(() => {
// // //     loadRecommendations();
// // //     loadUserStats();
// // //   }, []);

// // //   const loadRecommendations = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('access_token');
// // //       const response = await fetch(`${API_BASE_URL}/bets/ai-recommendations/`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //         },
// // //       });
      
// // //       const data = await response.json();
      
// // //       if (response.ok) {
// // //         setRecommendations(data.recommendations || []);
// // //         setCommunityInsights(data.community_insights || {});
// // //       } else {
// // //         throw new Error(data.error || 'Failed to load recommendations');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error loading recommendations:', error);
// // //       Alert.alert('Error', 'Failed to load AI recommendations');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const loadUserStats = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('access_token');
// // //       const response = await fetch(`${API_BASE_URL}/bets/user-scan-stats/`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //         },
// // //       });
      
// // //       const data = await response.json();
      
// // //       if (response.ok) {
// // //         setUserStats(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error loading user stats:', error);
// // //     }
// // //   };

// // //   const onRefresh = async () => {
// // //     setRefreshing(true);
// // //     await Promise.all([loadRecommendations(), loadUserStats()]);
// // //     setRefreshing(false);
// // //   };

// // //   const getConfidenceColor = (confidence) => {
// // //     if (confidence >= 80) return '#24ad0cff';
// // //     if (confidence >= 70) return '#FFA500';
// // //     if (confidence >= 60) return '#FF6B35';
// // //     return '#FF4444';
// // //   };

// // //   const getRiskEmoji = (riskLevel) => {
// // //     switch (riskLevel) {
// // //       case 'LOW_RISK': return '💎';
// // //       case 'MEDIUM_RISK': return '⚠️';
// // //       case 'HIGH_RISK': return '🚨';
// // //       default: return '❓';
// // //     }
// // //   };

// // //   const handleQuickScan = () => {
// // //     navigation.navigate('Analysis');
// // //   };

// // //   const renderInjuryReport = (injuryReport) => {
// // //     if (!injuryReport || injuryReport.length === 0) {
// // //       return (
// // //         <View style={styles.injuryItem}>
// // //           <Icon name="check-circle" size={16} color="#24ad0cff" />
// // //           <Text style={styles.injuryText}>No major injury concerns</Text>
// // //         </View>
// // //       );
// // //     }

// // //     return injuryReport.map((injury, index) => (
// // //       <View key={index} style={styles.injuryItem}>
// // //         <Icon name="warning" size={16} color="#FF4444" />
// // //         <Text style={styles.injuryText}>{injury.message}</Text>
// // //       </View>
// // //     ));
// // //   };

// // //   const renderRecommendation = ({ item }) => (
// // //     <View style={styles.recommendationCard}>
// // //       {/* Header */}
// // //       <View style={styles.cardHeader}>
// // //         <View style={styles.matchInfo}>
// // //           <Text style={styles.league}>{item.league}</Text>
// // //           <Text style={styles.time}>{item.match_time}</Text>
// // //         </View>
// // //         <View style={styles.headerRight}>
// // //           {item.trending && (
// // //             <View style={styles.trendingBadge}>
// // //               <Icon name="trending-up" size={14} color="#FFFFFF" />
// // //               <Text style={styles.trendingText}>Trending</Text>
// // //             </View>
// // //           )}
// // //           <Text style={styles.riskEmoji}>{getRiskEmoji(item.risk_level)}</Text>
// // //         </View>
// // //       </View>

// // //       {/* Teams */}
// // //       <Text style={styles.teams}>{item.home_team} vs {item.away_team}</Text>

// // //       {/* Confidence Meter */}
// // //       <View style={styles.confidenceSection}>
// // //         <View style={styles.confidenceHeader}>
// // //           <Text style={styles.confidenceLabel}>AI CONFIDENCE SCORE</Text>
// // //           <Text style={[styles.confidenceValue, { color: getConfidenceColor(item.confidence) }]}>
// // //             {item.confidence}%
// // //           </Text>
// // //         </View>
// // //         <View style={styles.confidenceBar}>
// // //           <View 
// // //             style={[
// // //               styles.confidenceFill,
// // //               { 
// // //                 width: `${item.confidence}%`,
// // //                 backgroundColor: getConfidenceColor(item.confidence)
// // //               }
// // //             ]} 
// // //           />
// // //         </View>
// // //         <Text style={styles.dataPoints}>Based on {item.data_points} data points</Text>
// // //       </View>

// // //       {/* Injury Report */}
// // //       <View style={styles.injuryReport}>
// // //         <Text style={styles.sectionTitle}>🚑 Injury Report</Text>
// // //         {renderInjuryReport(item.injury_report)}
// // //       </View>

// // //       {/* Form Analysis */}
// // //       {item.form_analysis && (
// // //         <View style={styles.formAnalysis}>
// // //           <Text style={styles.sectionTitle}>📊 Recent Form</Text>
// // //           <View style={styles.formStats}>
// // //             <Text style={styles.formStat}>🏠 {item.form_analysis.home_form}</Text>
// // //             <Text style={styles.formStat}>✈️ {item.form_analysis.away_form}</Text>
// // //             <Text style={styles.formStat}>⚽ {item.form_analysis.goal_trend}</Text>
// // //             <Text style={styles.formStat}>🛡️ {item.form_analysis.clean_sheets}</Text>
// // //           </View>
// // //         </View>
// // //       )}

// // //       {/* Key Insights */}
// // //       <View style={styles.insights}>
// // //         <Text style={styles.sectionTitle}>💡 Key Insights</Text>
// // //         {item.insights.map((insight, index) => (
// // //           <View key={index} style={styles.insightItem}>
// // //             <Icon name="check-circle" size={16} color="#24ad0cff" />
// // //             <Text style={styles.insightText}>{insight}</Text>
// // //           </View>
// // //         ))}
// // //       </View>

// // //       {/* Potential Value */}
// // //       <View style={styles.valueSection}>
// // //         <Text style={styles.valueTitle}>💰 Potential Value</Text>
// // //         <Text style={styles.oddsText}>Estimated Odds: {item.potential_odds}</Text>
// // //         <Text style={styles.valueAdvice}>
// // //           {item.confidence >= 75 ? 'Excellent value bet' : 
// // //            item.confidence >= 65 ? 'Good betting opportunity' : 
// // //            'Consider stake carefully'}
// // //         </Text>
// // //       </View>

// // //       {/* Action Buttons */}
// // //       <View style={styles.actionButtons}>
// // //         <TouchableOpacity 
// // //           style={styles.scanButton}
          
// // //           onPress={() => navigation.navigate('Analysis')}
// // //         >
// // //           <Icon name="search" size={16} color="#FFFFFF" />
// // //           <Text style={styles.scanButtonText}>Analyze This Match</Text>
// // //         </TouchableOpacity>
        
// // //         {/* <TouchableOpacity 
// // //           style={styles.saveButton}
// // //            onPress={() => handleSaveRecommendation(item)}
          
// // //         >
// // //           <Icon name="bookmark" size={16} color="#24ad0cff" />
// // //           <Text style={styles.saveButtonText}>Save</Text>
// // //         </TouchableOpacity> */}
// // //         <TouchableOpacity 
// // //   style={[
// // //     styles.saveButton,
// // //     item.is_saved && styles.savedButton  // Different style when saved
// // //   ]}
// // //   onPress={() => handleSaveRecommendation(item)}
// // //   disabled={item.is_saved}  // Disable if already saved
// // // >
// // //   <Icon 
// // //     name={item.is_saved ? "bookmark" : "bookmark-border"} 
// // //     size={16} 
// // //     color={item.is_saved ? "#24ad0cff" : "#24ad0cff"} 
// // //   />
// // //   <Text style={[
// // //     styles.saveButtonText,
// // //     item.is_saved && styles.savedButtonText
// // //   ]}>
// // //     {item.is_saved ? "Saved" : "Save"}
// // //   </Text>
// // // </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );

// // //   const renderUserStats = () => {
// // //     if (!userStats) return null;

// // //     return (
// // //       <View style={styles.statsCard}>
// // //         <Text style={styles.statsTitle}>Your Scanning Journey</Text>
// // //         <View style={styles.statsGrid}>
// // //           <View style={styles.statItem}>
// // //             <Text style={styles.statNumber}>{userStats.total_scans}</Text>
// // //             <Text style={styles.statLabel}>Total Scans</Text>
// // //           </View>
// // //           <View style={styles.statItem}>
// // //             <Text style={styles.statNumber}>{userStats.monthly_scans}</Text>
// // //             <Text style={styles.statLabel}>This Month</Text>
// // //           </View>
// // //           <View style={styles.statItem}>
// // //             <Text style={styles.statNumber}>{userStats.scan_streak}</Text>
// // //             <Text style={styles.statLabel}>Day Streak</Text>
// // //           </View>
// // //           <View style={styles.statItem}>
// // //             <Text style={styles.statNumber}>₦{userStats.estimated_savings}</Text>
// // //             <Text style={styles.statLabel}>Saved</Text>
// // //           </View>
// // //         </View>
        
// // //         {/* Achievements */}
// // //         <View style={styles.achievements}>
// // //           {userStats.achievements.map((achievement, index) => (
// // //             <Text key={index} style={styles.achievementText}>{achievement}</Text>
// // //           ))}
// // //         </View>

// // //         {userStats.next_milestone && (
// // //           <Text style={styles.milestoneText}>
// // //             🎯 {userStats.next_milestone} scan{userStats.next_milestone > 1 ? 's' : ''} until next achievement!
// // //           </Text>
// // //         )}
// // //       </View>
// // //     );
// // //   };

// // //   const renderCommunityInsights = () => {
// // //     if (!communityInsights.success_rate) return null;

// // //     return (
// // //       <View style={styles.communityCard}>
// // //         <Text style={styles.communityTitle}>🌍 Community Insights</Text>
// // //         <View style={styles.communityStats}>
// // //           <Text style={styles.communityStat}>
// // //             💪 {communityInsights.success_rate} Success Rate
// // //           </Text>
// // //           <Text style={styles.communityStat}>
// // //             🔥 {communityInsights.total_scans_today}+ Scans Today
// // //           </Text>
// // //           <Text style={styles.communityStat}>
// // //             📈 {communityInsights.trending_leagues?.join(', ')} Trending
// // //           </Text>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <View style={styles.loadingContainer}>
// // //         <ActivityIndicator size="large" color="#24ad0cff" />
// // //         <Text style={styles.loadingText}>Loading AI Recommendations...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <View>
// // //           <Text style={styles.title}>AI Recommendations</Text>
// // //           <Text style={styles.subtitle}>Personalized picks based on your </Text>
// // //           <Text style={styles.subtitle}> scanning history</Text>
// // //         </View>
// // //         {/* <TouchableOpacity 
// // //           style={styles.scanNowButton}
// // //           onPress={handleQuickScan}
// // //         >
// // //           <Icon name="search" size={20} color="#000" />
// // //           <Text style={styles.scanNowText}>Scan Now</Text>
// // //         </TouchableOpacity> */}
// // //       </View>

// // //       <ScrollView
// // //         refreshControl={
// // //           <RefreshControl
// // //             refreshing={refreshing}
// // //             onRefresh={onRefresh}
// // //             colors={['#24ad0cff']}
// // //             tintColor="#24ad0cff"
// // //           />
// // //         }
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {/* User Stats */}
// // //         {renderUserStats()}

// // //         {/* Community Insights */}
// // //         {renderCommunityInsights()}

// // //         {/* Quick Scan Promo */}
// // //         <View style={styles.promoCard}>
// // //           <View style={styles.promoContent}>
// // //             <Text style={styles.promoTitle}>🚀 Boost Your Winning Chances</Text>
// // //             <Text style={styles.promoText}>
// // //               Scan your bet slip now and get AI-powered risk analysis. 
// // //               Join {communityInsights.total_scans_today || '2,000'}+ users who scan daily!
// // //             </Text>
// // //             <TouchableOpacity 
// // //               style={styles.promoButton}
// // //               onPress={handleQuickScan}
// // //             >
// // //               <Icon name="flash-on" size={20} color="#000" />
// // //               <Text style={styles.promoButtonText}>Quick Scan</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>

// // //         {/* Recommendations Header */}
// // //         <View style={styles.recommendationsHeader}>
// // //           <Text style={styles.recommendationsTitle}>
// // //             🎯 AI Recommended Matches
// // //           </Text>
// // //           <Text style={styles.recommendationsSubtitle}>
// // //             Based on current form, injuries, and betting trends
// // //           </Text>
// // //         </View>

// // //         {/* Recommendations List */}
// // //         {recommendations.length > 0 ? (
// // //           <FlatList
// // //             data={recommendations}
// // //             renderItem={renderRecommendation}
// // //             keyExtractor={item => item.id}
// // //             scrollEnabled={false}
// // //             contentContainerStyle={styles.listContent}
// // //           />
// // //         ) : (
// // //           <View style={styles.emptyState}>
// // //             <Icon name="search-off" size={60} color="#666" />
// // //             <Text style={styles.emptyStateTitle}>No Recommendations Available</Text>
// // //             <Text style={styles.emptyStateText}>
// // //               Start scanning bet slips to get personalized AI recommendations!
// // //             </Text>
// // //             <TouchableOpacity 
// // //               style={styles.emptyStateButton}
// // //               onPress={handleQuickScan}
// // //             >
// // //               <Text style={styles.emptyStateButtonText}>Scan Your First Bet</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         )}

// // //         {/* Scan More CTA */}
// // //         <View style={styles.ctaCard}>
// // //           <Text style={styles.ctaTitle}>Ready to Win Smarter?</Text>
// // //           <Text style={styles.ctaText}>
// // //             Every scan improves our AI's recommendations. The more you scan, the smarter your bets become!
// // //           </Text>
// // //           <TouchableOpacity 
// // //             style={styles.ctaButton}
// // //             onPress={handleQuickScan}
// // //           >
// // //             <Icon name="camera-alt" size={20} color="#000" />
// // //             <Text style={styles.ctaButtonText}>Scan Bet Slip Now</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </ScrollView>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#000000',
// // //     paddingHorizontal: 20,
// // //     paddingTop: 60,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     backgroundColor: '#000000',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   loadingText: {
// // //     color: '#24ad0cff',
// // //     fontSize: 16,
// // //     marginTop: 16,
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 24,
// // //     marginTop: -40,
// // //   },
// // //   title: {
// // //     fontSize: 28,
// // //     fontWeight: '700',
// // //     color: '#FFFFFF',
// // //     marginBottom: 4,
// // //   },
// // //   subtitle: {
// // //     fontSize: 14,
// // //     color: '#24ad0cff',
// // //   },
// // //   scanNowButton: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#24ad0cff',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //   },
// // //   scanNowText: {
// // //     color: '#000000',
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //     marginLeft: 6,
// // //   },
// // //   statsCard: {
// // //     backgroundColor: '#111111',
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     marginBottom: 16,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#24ad0cff',
// // //   },
// // //   statsTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#FFFFFF',
// // //     marginBottom: 16,
// // //   },
// // //   statsGrid: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 16,
// // //   },
// // //   statItem: {
// // //     alignItems: 'center',
// // //   },
// // //   statNumber: {
// // //     fontSize: 24,
// // //     fontWeight: '700',
// // //     color: '#24ad0cff',
// // //     marginBottom: 4,
// // //   },
// // //   statLabel: {
// // //     fontSize: 12,
// // //     color: '#CCCCCC',
// // //   },
// // //   achievements: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     gap: 8,
// // //     marginBottom: 12,
// // //   },
// // //   achievementText: {
// // //     color: '#FFD700',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     backgroundColor: 'rgba(255, 215, 0, 0.1)',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //   },
// // //   milestoneText: {
// // //     color: '#24ad0cff',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     textAlign: 'center',
// // //   },
// // //   communityCard: {
// // //     backgroundColor: '#111111',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginBottom: 16,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#24ad0cff',
// // //   },
// // //   communityTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: '#FFFFFF',
// // //     marginBottom: 12,
// // //   },
// // //   communityStats: {
// // //     gap: 8,
// // //   },
// // //   communityStat: {
// // //     color: '#CCCCCC',
// // //     fontSize: 14,
// // //   },
// // //   // Add to AnalysisScreen styles
// // // saveSection: {
// // //   backgroundColor: '#1a1a1a',
// // //   padding: 16,
// // //   borderRadius: 12,
// // //   marginBottom: 15,
// // //   borderLeftWidth: 4,
// // //   borderLeftColor: '#24ad0cff',
// // // },
// // // saveTitle: {
// // //   fontSize: 18,
// // //   fontWeight: 'bold',
// // //   color: '#24ad0cff',
// // //   marginBottom: 8,
// // // },
// // // saveDescription: {
// // //   color: '#ccc',
// // //   fontSize: 14,
// // //   marginBottom: 12,
// // //   lineHeight: 18,
// // // },
// // // saveActions: {
// // //   flexDirection: 'row',
// // //   gap: 12,
// // // },
// // // saveAllButton: {
// // //   flex: 1,
// // //   flexDirection: 'row',
// // //   backgroundColor: '#24ad0cff',
// // //   padding: 12,
// // //   borderRadius: 8,
// // //   alignItems: 'center',
// // //   justifyContent: 'center',
// // // },
// // // saveAllButtonText: {
// // //   color: '#000',
// // //   fontWeight: '600',
// // //   fontSize: 14,
// // //   marginLeft: 8,
// // // },
// // // saveSelectButton: {
// // //   flex: 1,
// // //   flexDirection: 'row',
// // //   backgroundColor: 'transparent',
// // //   padding: 12,
// // //   borderRadius: 8,
// // //   borderWidth: 1,
// // //   borderColor: '#24ad0cff',
// // //   alignItems: 'center',
// // //   justifyContent: 'center',
// // // },
// // // saveSelectButtonText: {
// // //   color: '#24ad0cff',
// // //   fontWeight: '600',
// // //   fontSize: 14,
// // //   marginLeft: 8,
// // // },
// // // matchSaveSection: {
// // //   marginTop: 10,
// // //   paddingTop: 10,
// // //   borderTopWidth: 1,
// // //   borderTopColor: '#333',
// // // },
// // // saveMatchButton: {
// // //   flexDirection: 'row',
// // //   backgroundColor: 'transparent',
// // //   padding: 8,
// // //   borderRadius: 6,
// // //   borderWidth: 1,
// // //   borderColor: '#24ad0cff',
// // //   alignItems: 'center',
// // //   justifyContent: 'center',
// // // },
// // // saveMatchText: {
// // //   color: '#24ad0cff',
// // //   fontSize: 12,
// // //   fontWeight: '600',
// // //   marginLeft: 6,
// // // },
// // //   promoCard: {
// // //     backgroundColor: 'rgba(0, 0, 0, 0.1)',
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     marginBottom: 20,
// // //     borderWidth: 4,
// // //     borderStyle:'dotted',
// // //     borderColor: '#232322ff',
// // //   },
// // //   promoContent: {
// // //     alignItems: 'center',
// // //   },
// // //   promoTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: '#24ad0cff',
// // //     marginBottom: 8,
// // //     textAlign: 'center',
// // //   },
// // //   promoText: {
// // //     fontSize: 14,
// // //     color: '#CCCCCC',
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //     marginBottom: 16,
// // //   },
// // //   promoButton: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#24ad0cff',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //   },
// // //   promoButtonText: {
// // //     color: '#000000',
// // //     fontWeight: '700',
// // //     fontSize: 16,
// // //     marginLeft: 8,
// // //   },
// // //   recommendationsHeader: {
// // //     marginBottom: 16,
// // //   },
// // //   recommendationsTitle: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: '#FFFFFF',
// // //     marginBottom: 4,
// // //   },
// // //   recommendationsSubtitle: {
// // //     fontSize: 14,
// // //     color: '#666666',
// // //   },
// // //   listContent: {
// // //     paddingBottom: 20,
// // //   },
// // //   recommendationCard: {
// // //     backgroundColor: '#111111',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginBottom: 16,
// // //     borderWidth: 1,
// // //     borderColor: '#222222',
// // //   },
// // //   cardHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 12,
// // //   },
// // //   headerRight: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //   },
// // //   matchInfo: {
// // //     flex: 1,
// // //   },
// // //   league: {
// // //     fontSize: 14,
// // //     color: '#24ad0cff',
// // //     fontWeight: '600',
// // //     marginBottom: 2,
// // //   },
// // //   time: {
// // //     fontSize: 12,
// // //     color: '#666666',
// // //   },
// // //   trendingBadge: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#FF4444',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //     alignItems: 'center',
// // //   },
// // //   trendingText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 10,
// // //     fontWeight: '600',
// // //     marginLeft: 4,
// // //   },
// // //   riskEmoji: {
// // //     fontSize: 16,
// // //   },
// // //   teams: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#FFFFFF',
// // //     marginBottom: 16,
// // //     lineHeight: 24,
// // //   },
// // //   confidenceSection: {
// // //     marginBottom: 16,
// // //   },
// // //   confidenceHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   confidenceLabel: {
// // //     fontSize: 14,
// // //     color: '#CCCCCC',
// // //     fontWeight: '600',
// // //   },
// // //   confidenceValue: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //   },
// // //   confidenceBar: {
// // //     height: 6,
// // //     backgroundColor: '#333333',
// // //     borderRadius: 3,
// // //     overflow: 'hidden',
// // //     marginBottom: 4,
// // //   },
// // //   confidenceFill: {
// // //     height: '100%',
// // //     borderRadius: 3,
// // //   },
// // //   dataPoints: {
// // //     fontSize: 11,
// // //     color: '#666666',
// // //     textAlign: 'right',
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#FFFFFF',
// // //     marginBottom: 8,
// // //   },
// // //   injuryReport: {
// // //     marginBottom: 12,
// // //   },
// // //   injuryItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 4,
// // //   },
// // //   injuryText: {
// // //     fontSize: 12,
// // //     color: '#CCCCCC',
// // //     marginLeft: 8,
// // //     flex: 1,
// // //   },
// // //   formAnalysis: {
// // //     marginBottom: 12,
// // //   },
// // //   formStats: {
// // //     gap: 4,
// // //   },
// // //   formStat: {
// // //     fontSize: 12,
// // //     color: '#CCCCCC',
// // //   },
// // //   insights: {
// // //     marginBottom: 12,
// // //   },
// // //   insightItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 6,
// // //   },
// // //   insightText: {
// // //     fontSize: 12,
// // //     color: '#CCCCCC',
// // //     marginLeft: 8,
// // //     flex: 1,
// // //     lineHeight: 16,
// // //   },
// // //   valueSection: {
// // //     backgroundColor: 'rgba(57, 255, 20, 0.1)',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     marginBottom: 16,
// // //   },
// // //   valueTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '700',
// // //     color: '#24ad0cff',
// // //     marginBottom: 4,
// // //   },
// // //   oddsText: {
// // //     fontSize: 12,
// // //     color: '#FFFFFF',
// // //     fontWeight: '600',
// // //     marginBottom: 4,
// // //   },
// // //   // Add to your styles
// // // saveButton: {
// // //   flex: 1,
// // //   flexDirection: 'row',
// // //   backgroundColor: 'transparent',
// // //   padding: 12,
// // //   borderRadius: 8,
// // //   borderWidth: 1,
// // //   borderColor: '#24ad0cff',
// // //   alignItems: 'center',
// // //   justifyContent: 'center',
// // // },
// // // savedButton: {
// // //   backgroundColor: 'rgba(57, 255, 20, 0.1)',
// // //   borderColor: '#24ad0cff',
// // // },
// // // saveButtonText: {
// // //   color: '#24ad0cff',
// // //   fontWeight: '600',
// // //   fontSize: 14,
// // //   marginLeft: 6,
// // // },
// // // savedButtonText: {
// // //   color: '#24ad0cff',
// // //   fontWeight: '700',
// // // },
// // //   valueAdvice: {
// // //     fontSize: 11,
// // //     color: '#CCCCCC',
// // //     fontStyle: 'italic',
// // //   },
// // //   actionButtons: {
// // //     flexDirection: 'row',
// // //     gap: 12,
// // //   },
// // //   scanButton: {
// // //     flex: 2,
// // //     flexDirection: 'row',
// // //     backgroundColor: '#24ad0cff',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   scanButtonText: {
// // //     color: '#000000',
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //     marginLeft: 8,
// // //   },
// // //   saveButton: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     backgroundColor: 'transparent',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     borderWidth: 1,
// // //     borderColor: '#24ad0cff',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   saveButtonText: {
// // //     color: '#24ad0cff',
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //     marginLeft: 6,
// // //   },
// // //   emptyState: {
// // //     alignItems: 'center',
// // //     padding: 40,
// // //     backgroundColor: '#111111',
// // //     borderRadius: 16,
// // //     marginBottom: 20,
// // //   },
// // //   emptyStateTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#FFFFFF',
// // //     marginTop: 16,
// // //     marginBottom: 8,
// // //   },
// // //   emptyStateText: {
// // //     fontSize: 14,
// // //     color: '#666666',
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //     marginBottom: 20,
// // //   },
// // //   emptyStateButton: {
// // //     backgroundColor: '#24ad0cff',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     borderRadius: 12,
// // //   },
// // //   emptyStateButtonText: {
// // //     color: '#000000',
// // //     fontWeight: '600',
// // //     fontSize: 16,
// // //   },
// // //   ctaCard: {
// // //     backgroundColor: '#111111',
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     marginBottom: 30,
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: '#24ad0cff',
// // //   },
// // //   ctaTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: '#24ad0cff',
// // //     marginBottom: 8,
// // //     textAlign: 'center',
// // //   },
// // //   ctaText: {
// // //     fontSize: 14,
// // //     color: '#CCCCCC',
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //     marginBottom: 16,
// // //   },
// // //   ctaButton: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#24ad0cff',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //   },
// // //   ctaButtonText: {
// // //     color: '#000000',
// // //     fontWeight: '700',
// // //     fontSize: 16,
// // //     marginLeft: 8,
// // //   },
// // // });

// // // export default ForYouScreen;


// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   RefreshControl,
// //   FlatList,
// //   Alert,
// //   ActivityIndicator,
// //   Animated,
// //   Dimensions,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const { width } = Dimensions.get('window');
// // const API_BASE_URL = 'http://192.168.1.110:8000/api';

// // const ForYouScreen = ({ navigation }) => {
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [recommendations, setRecommendations] = useState([]);
// //   const [userStats, setUserStats] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [communityInsights, setCommunityInsights] = useState({});
// //   const [hasScannedBefore, setHasScannedBefore] = useState(false);
// //   const [pulseAnim] = useState(new Animated.Value(1));

// //   // Start pulse animation for scan CTA
// //   useEffect(() => {
// //     const pulse = () => {
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.05,
// //           duration: 1000,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 1000,
// //           useNativeDriver: true,
// //         }),
// //       ]).start(() => pulse());
// //     };
// //     pulse();
// //   }, []);

// //   useEffect(() => {
// //     checkScanHistory();
// //     loadUserStats();
// //   }, []);

// //   const checkScanHistory = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('access_token');
// //       const response = await fetch(`${API_BASE_URL}/bets/history/`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //         },
// //       });
      
// //       const data = await response.json();
// //       const hasScans = data && data.length > 0;
// //       setHasScannedBefore(hasScans);
      
// //       // Load recommendations based on scan history
// //       if (hasScans) {
// //         loadRecommendations();
// //       } else {
// //         setLoading(false);
// //       }
// //     } catch (error) {
// //       console.error('Error checking scan history:', error);
// //       setLoading(false);
// //     }
// //   };

// //   const loadRecommendations = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('access_token');
// //       const response = await fetch(`${API_BASE_URL}/bets/ai-recommendations/`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //         },
// //       });
      
// //       const data = await response.json();
      
// //       if (response.ok) {
// //         setRecommendations(data.recommendations || []);
// //         setCommunityInsights(data.community_insights || {});
// //       } else {
// //         throw new Error(data.error || 'Failed to load recommendations');
// //       }
// //     } catch (error) {
// //       console.error('Error loading recommendations:', error);
// //       // Don't show fallback - let the scan prompt handle it
// //       setRecommendations([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

  
// // const checkScanStatus = async () => {
// //   try {
// //     const token = await AsyncStorage.getItem('access_token');
// //     const response = await fetch(`${API_BASE_URL}/bets/check-scan-status/`, {
// //       headers: {
// //         'Authorization': `Bearer ${token}`,
// //       },
// //     });
    
// //     const data = await response.json();
// //     setHasScannedBefore(data.has_scanned);
    
// //     // Only load recommendations if user has scanned
// //     if (data.has_scanned) {
// //       loadRecommendations();
// //     } else {
// //       setLoading(false);
// //     }
// //   } catch (error) {
// //     console.error('Error checking scan status:', error);
// //     setLoading(false);
// //   }
// // };

// //   const loadUserStats = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('access_token');
// //       const response = await fetch(`${API_BASE_URL}/bets/user-scan-stats/`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //         },
// //       });
      
// //       const data = await response.json();
      
// //       if (response.ok) {
// //         setUserStats(data);
// //       }
// //     } catch (error) {
// //       console.error('Error loading user stats:', error);
// //     }
// //   };

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     await checkScanHistory();
// //     setRefreshing(false);
// //   };

// //   const handleQuickScan = () => {
// //     navigation.navigate('Analysis');
// //   };

// //   const handleSaveRecommendation = async (recommendation) => {
// //     if (!hasScannedBefore) {
// //       Alert.alert(
// //         '🔒 Scan to Unlock',
// //         'Scan your first bet slip to unlock the Save feature and get personalized AI recommendations!',
// //         [
// //           { text: 'Maybe Later', style: 'cancel' },
// //           { text: 'Scan Now', onPress: handleQuickScan }
// //         ]
// //       );
// //       return;
// //     }

// //     try {
// //       const token = await AsyncStorage.getItem('access_token');
      
// //       const saveData = {
// //         home_team: recommendation.home_team,
// //         away_team: recommendation.away_team,
// //         league: recommendation.league,
// //         confidence_score: recommendation.confidence,
// //         risk_level: recommendation.risk_level,
// //         analysis_data: {
// //           insights: recommendation.insights || [],
// //           injury_report: recommendation.injury_report || [],
// //           form_analysis: recommendation.form_analysis || {},
// //           potential_odds: recommendation.potential_odds
// //         },
// //         notes: `AI Recommended - ${recommendation.confidence}% confidence`
// //       };

// //       const response = await fetch(`${API_BASE_URL}/bets/save-match/`, {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(saveData),
// //       });
      
// //       const result = await response.json();
      
// //       if (response.ok) {
// //         Alert.alert('✅ Saved!', 'Match saved to your favorites');
// //         setRecommendations(prev => prev.map(rec => 
// //           rec.id === recommendation.id 
// //             ? { ...rec, is_saved: true, saved_match_id: result.saved_match?.id }
// //             : rec
// //         ));
// //       } else if (result.already_saved) {
// //         Alert.alert(' Already Saved', 'This match is already in your favorites!');
// //         setRecommendations(prev => prev.map(rec => 
// //           rec.id === recommendation.id 
// //             ? { ...rec, is_saved: true, saved_match_id: result.saved_match_id }
// //             : rec
// //         ));
// //       } else {
// //         throw new Error(result.error || 'Save failed');
// //       }
// //     } catch (error) {
// //       console.error('Save recommendation error:', error);
// //       Alert.alert('Error', error.message || 'Failed to save match');
// //     }
// //   };

// //   const getConfidenceColor = (confidence) => {
// //     if (confidence >= 80) return '#24ad0cff';
// //     if (confidence >= 70) return '#FFA500';
// //     if (confidence >= 60) return '#FF6B35';
// //     return '#FF4444';
// //   };

// //   const getRiskEmoji = (riskLevel) => {
// //     switch (riskLevel) {
// //       case 'LOW_RISK': return '💎';
// //       case 'MEDIUM_RISK': return '⚠️';
// //       case 'HIGH_RISK': return '🚨';
// //       default: return '❓';
// //     }
// //   };

// //   const renderScanToUnlock = () => (
// //     <View style={styles.unlockContainer}>
// //       {/* Animated Header */}
// //       <Animated.View 
// //         style={[
// //           styles.unlockHeader,
// //           { transform: [{ scale: pulseAnim }] }
// //         ]}
// //       >
// //         <View style={styles.lockIcon}>
// //           <Icon name="lock" size={40} color="#24ad0cff" />
// //         </View>
// //         <Text style={styles.unlockTitle}> AI Recommendations Locked</Text>
// //         <Text style={styles.unlockSubtitle}>
// //           Scan your first bet slip to unlock personalized AI insights
// //         </Text>
// //       </Animated.View>

// //       {/* Benefits Grid */}
// //       <View style={styles.benefitsGrid}>
// //         <Text style={styles.benefitsTitle}> What You'll Unlock:</Text>
        
// //         <View style={styles.benefitItem}>
// //           <View style={styles.benefitIcon}>
// //             <Icon name="psychology" size={24} color="#24ad0cff" />
// //           </View>
// //           <View style={styles.benefitText}>
// //             <Text style={styles.benefitHeader}>AI-Powered Predictions</Text>
// //             <Text style={styles.benefitDescription}>
// //               Get match analysis with confidence scores and risk assessment
// //             </Text>
// //           </View>
// //         </View>

// //         <View style={styles.benefitItem}>
// //           <View style={styles.benefitIcon}>
// //             <Icon name="trending-up" size={24} color="#24ad0cff" />
// //           </View>
// //           <View style={styles.benefitText}>
// //             <Text style={styles.benefitHeader}>Personalized Picks</Text>
// //             <Text style={styles.benefitDescription}>
// //               Recommendations tailored to your betting style and preferences
// //             </Text>
// //           </View>
// //         </View>

// //         <View style={styles.benefitItem}>
// //           <View style={styles.benefitIcon}>
// //             <Icon name="warning" size={24} color="#24ad0cff" />
// //           </View>
// //           <View style={styles.benefitText}>
// //             <Text style={styles.benefitHeader}>Risk Analysis</Text>
// //             <Text style={styles.benefitDescription}>
// //               Advanced risk assessment for every match in your bet slip
// //             </Text>
// //           </View>
// //         </View>

// //         <View style={styles.benefitItem}>
// //           <View style={styles.benefitIcon}>
// //             <Icon name="insights" size={24} color="#24ad0cff" />
// //           </View>
// //           <View style={styles.benefitText}>
// //             <Text style={styles.benefitHeader}>Smart Insights</Text>
// //             <Text style={styles.benefitDescription}>
// //               Injury reports, form analysis, and betting value indicators
// //             </Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Scan CTA */}
// //       <View style={styles.ctaSection}>
// //         <Text style={styles.ctaTitle}>Ready to Win Smarter?</Text>
// //         <Text style={styles.ctaDescription}>
// //           Join thousands of users who use AI Bet Scanner to make informed betting decisions
// //         </Text>
        
// //         <TouchableOpacity 
// //           style={styles.scanNowBigButton}
// //           onPress={handleQuickScan}
// //         >
// //           <View style={styles.scanButtonContent}>
            
// //             <View>
// //               <Text style={styles.scanNowBigText}>SCAN YOUR FIRST BET SLIP</Text>
// //               <Text style={styles.scanNowSubtext}>Unlock AI Recommendations</Text>
// //             </View>
// //           </View>
// //         </TouchableOpacity>

// //         <View style={styles.communitySftats}>
// //           <Text style={[styles.communityStat,{marginBottom:10}]}>🚀 12,000+ Daily Scans</Text>
// //           <Text style={[styles.communityStat,{marginBottom:10}]}>💪 68% Success Rate</Text>
// //           <Text style={styles.communityStat}>⭐ 4.8/5 User Rating</Text>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   const renderRecommendation = ({ item }) => (
// //     <View style={styles.recommendationCard}>
// //       {/* Header */}
// //       <View style={styles.cardHeader}>
// //         <View style={styles.matchInfo}>
// //           <Text style={styles.league}>{item.league}</Text>
// //           <Text style={styles.time}>{item.match_time}</Text>
// //         </View>
// //         <View style={styles.headerRight}>
// //           {item.trending && (
// //             <View style={styles.trendingBadge}>
// //               <Icon name="trending-up" size={14} color="#FFFFFF" />
// //               <Text style={styles.trendingText}>Trending</Text>
// //             </View>
// //           )}
// //           <Text style={styles.riskEmoji}>{getRiskEmoji(item.risk_level)}</Text>
// //         </View>
// //       </View>

// //       {/* Teams */}
// //       <Text style={styles.teams}>{item.home_team} vs {item.away_team}</Text>

// //       {/* Confidence Meter */}
// //       <View style={styles.confidenceSection}>
// //         <View style={styles.confidenceHeader}>
// //           <Text style={styles.confidenceLabel}>AI CONFIDENCE SCORE</Text>
// //           <Text style={[styles.confidenceValue, { color: getConfidenceColor(item.confidence) }]}>
// //             {item.confidence}%
// //           </Text>
// //         </View>
// //         <View style={styles.confidenceBar}>
// //           <View 
// //             style={[
// //               styles.confidenceFill,
// //               { 
// //                 width: `${item.confidence}%`,
// //                 backgroundColor: getConfidenceColor(item.confidence)
// //               }
// //             ]} 
// //           />
// //         </View>
// //         <Text style={styles.dataPoints}>Based on {item.data_points} data points</Text>
// //       </View>

// //       {/* Injury Report */}
// //       <View style={styles.injuryReport}>
// //         <Text style={styles.sectionTitle}>🚑 Injury Report</Text>
// //         {renderInjuryReport(item.injury_report)}
// //       </View>

// //       {/* Form Analysis */}
// //       {item.form_analysis && (
// //         <View style={styles.formAnalysis}>
// //           <Text style={styles.sectionTitle}>📊 Recent Form</Text>
// //           <View style={styles.formStats}>
// //             <Text style={styles.formStat}>🏠 {item.form_analysis.home_form}</Text>
// //             <Text style={styles.formStat}>✈️ {item.form_analysis.away_form}</Text>
// //             <Text style={styles.formStat}>⚽ {item.form_analysis.goal_trend}</Text>
// //             <Text style={styles.formStat}>🛡️ {item.form_analysis.clean_sheets}</Text>
// //           </View>
// //         </View>
// //       )}

// //       {/* Key Insights */}
// //       <View style={styles.insights}>
// //         <Text style={styles.sectionTitle}>💡 Key Insights</Text>
// //         {item.insights.map((insight, index) => (
// //           <View key={index} style={styles.insightItem}>
// //             <Icon name="check-circle" size={16} color="#24ad0cff" />
// //             <Text style={styles.insightText}>{insight}</Text>
// //           </View>
// //         ))}
// //       </View>

// //       {/* Potential Value */}
// //       <View style={styles.valueSection}>
// //         <Text style={styles.valueTitle}>💰 Potential Value</Text>
// //         <Text style={styles.oddsText}>Estimated Odds: {item.potential_odds}</Text>
// //         <Text style={styles.valueAdvice}>
// //           {item.confidence >= 75 ? 'Excellent value bet' : 
// //            item.confidence >= 65 ? 'Good betting opportunity' : 
// //            'Consider stake carefully'}
// //         </Text>
// //       </View>

// //       {/* Action Buttons */}
// //       <View style={styles.actionButtons}>
// //         <TouchableOpacity 
// //           style={styles.scanButton}
// //           onPress={() => navigation.navigate('Analysis')}
// //         >
// //           <Icon name="search" size={16} color="#FFFFFF" />
// //           <Text style={styles.scanButtonText}>Analyze This Match</Text>
// //         </TouchableOpacity>
        
// //         <TouchableOpacity 
// //           style={[
// //             styles.saveButton,
// //             item.is_saved && styles.savedButton
// //           ]}
// //           onPress={() => handleSaveRecommendation(item)}
// //           disabled={item.is_saved}
// //         >
// //           <Icon 
// //             name={item.is_saved ? "bookmark" : "bookmark-border"} 
// //             size={16} 
// //             color={item.is_saved ? "#24ad0cff" : "#24ad0cff"} 
// //           />
// //           <Text style={[
// //             styles.saveButtonText,
// //             item.is_saved && styles.savedButtonText
// //           ]}>
// //             {item.is_saved ? "Saved" : "Save"}
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// //   const renderInjuryReport = (injuryReport) => {
// //     if (!injuryReport || injuryReport.length === 0) {
// //       return (
// //         <View style={styles.injuryItem}>
// //           <Icon name="check-circle" size={16} color="#24ad0cff" />
// //           <Text style={styles.injuryText}>No major injury concerns</Text>
// //         </View>
// //       );
// //     }

// //     return injuryReport.map((injury, index) => (
// //       <View key={index} style={styles.injuryItem}>
// //         <Icon name="warning" size={16} color="#FF4444" />
// //         <Text style={styles.injuryText}>{injury.message}</Text>
// //       </View>
// //     ));
// //   };

// //   const renderUserStats = () => {
// //     if (!userStats) return null;

// //     return (
// //       <View style={styles.statsCard}>
// //         <Text style={styles.statsTitle}>Your Scanning Journey</Text>
// //         <View style={styles.statsGrid}>
// //           <View style={styles.statItem}>
// //             <Text style={styles.statNumber}>{userStats.total_scans}</Text>
// //             <Text style={styles.statLabel}>Total Scans</Text>
// //           </View>
// //           <View style={styles.statItem}>
// //             <Text style={styles.statNumber}>{userStats.monthly_scans}</Text>
// //             <Text style={styles.statLabel}>This Month</Text>
// //           </View>
// //           <View style={styles.statItem}>
// //             <Text style={styles.statNumber}>{userStats.scan_streak}</Text>
// //             <Text style={styles.statLabel}>Day Streak</Text>
// //           </View>
// //           <View style={styles.statItem}>
// //             <Text style={styles.statNumber}>₦{userStats.estimated_savings}</Text>
// //             <Text style={styles.statLabel}>Saved</Text>
// //           </View>
// //         </View>
        
// //         <View style={styles.achievements}>
// //           {userStats.achievements?.map((achievement, index) => (
// //             <Text key={index} style={styles.achievementText}>{achievement}</Text>
// //           ))}
// //         </View>

// //         {userStats.next_milestone && (
// //           <Text style={styles.milestoneText}>
// //              {userStats.next_milestone} scan{userStats.next_milestone > 1 ? 's' : ''} until next achievement!
// //           </Text>
// //         )}
// //       </View>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#24ad0cff" />
// //         <Text style={styles.loadingText}>Loading AI Recommendations...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View>
// //           <Text style={styles.title}>AI Recommendations</Text>
// //           <Text style={styles.subtitle}>
// //             {hasScannedBefore ? 'Personalized picks based on your scanning history' : 'Scan to unlock personalized AI picks'}
// //           </Text>
// //         </View>
// //         {hasScannedBefore && (
// //           <TouchableOpacity 
// //             style={styles.scanNowButton}
// //             onPress={handleQuickScan}
// //           >
// //             <Icon name="search" size={20} color="#000" />
// //             <Text style={styles.scanNowText}>Scan Now</Text>
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       <ScrollView
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={['#24ad0cff']}
// //             tintColor="#24ad0cff"
// //           />
// //         }
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Show unlock screen if no scans */}
// //         {!hasScannedBefore ? (
// //           renderScanToUnlock()
// //         ) : (
// //           <>
// //             {/* User Stats */}
// //             {renderUserStats()}

// //             {/* Quick Scan Promo */}
// //             <View style={styles.promoCard}>
// //               <View style={styles.promoContent}>
// //                 <Text style={styles.promoTitle}>🚀 Keep the Insights Coming!</Text>
// //                 <Text style={styles.promoText}>
// //                   Every new scan improves your AI recommendations. Stay ahead with fresh analysis!
// //                 </Text>
// //                 <TouchableOpacity 
// //                   style={styles.promoButton}
// //                   onPress={handleQuickScan}
// //                 >
// //                   <Icon name="flash-on" size={20} color="#000" />
// //                   <Text style={styles.promoButtonText}>Scan Another Bet</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>

// //             {/* Recommendations Header */}
// //             <View style={styles.recommendationsHeader}>
// //               <Text style={styles.recommendationsTitle}>
// //                 🎯 Your AI Recommended Matches
// //               </Text>
// //               <Text style={styles.recommendationsSubtitle}>
// //                 Personalized based on your {userStats?.total_scans || 0} previous scans
// //               </Text>
// //             </View>

// //             {/* Recommendations List */}
// //             {recommendations.length > 0 ? (
// //               <FlatList
// //                 data={recommendations}
// //                 renderItem={renderRecommendation}
// //                 keyExtractor={item => item.id}
// //                 scrollEnabled={false}
// //                 contentContainerStyle={styles.listContent}
// //               />
// //             ) : (
// //               <View style={styles.emptyState}>
// //                 <Icon name="auto-awesome" size={60} color="#666" />
// //                 <Text style={styles.emptyStateTitle}>Generating Your Recommendations</Text>
// //                 <Text style={styles.emptyStateText}>
// //                   Our AI is analyzing your scan history to create personalized picks...
// //                 </Text>
// //                 <TouchableOpacity 
// //                   style={styles.emptyStateButton}
// //                   onPress={handleQuickScan}
// //                 >
// //                   <Text style={styles.emptyStateButtonText}>Scan More for Better Picks</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}

// //             {/* Scan More CTA */}
// //             <View style={styles.ctaCard}>
// //               <Text style={styles.ctaTitle}>Want Even Better Recommendations?</Text>
// //               <Text style={styles.ctaText}>
// //                 The more you scan, the smarter your AI gets! Each new bet slip improves your personalized insights.
// //               </Text>
// //               <TouchableOpacity 
// //                 style={styles.ctaButton}
// //                 onPress={handleQuickScan}
// //               >
// //                 <Icon name="camera-alt" size={20} color="#000" />
// //                 <Text style={styles.ctaButtonText}>Scan Another Bet Slip</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </>
// //         )}
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#000000',
// //     paddingHorizontal: 20,
// //     paddingTop: 60,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     backgroundColor: '#000000',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingText: {
// //     color: '#24ad0cff',
// //     fontSize: 16,
// //     marginTop: 16,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 24,
// //     marginTop: -40,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: '700',
// //     color: '#FFFFFF',
// //     marginBottom: 4,
// //   },
// //   subtitle: {
// //     fontSize: 14,
// //     color: '#24ad0cff',
// //   },
// //   scanNowButton: {
// //     flexDirection: 'row',
// //     backgroundColor: '#24ad0cff',
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //   },
// //   scanNowText: {
// //     color: '#000000',
// //     fontWeight: '600',
// //     fontSize: 14,
// //     marginLeft: 6,
// //   },
// //   // Unlock Screen Styles
// //   unlockContainer: {
// //     flex: 1,
// //     paddingVertical: 20,
// //   },
// //   unlockHeader: {
// //     alignItems: 'center',
// //     backgroundColor: '#111111',
// //     padding: 30,
// //     borderRadius: 20,
// //     marginBottom: 20,
// //     borderWidth: 2,
// //     borderColor: '#24ad0cff',
// //     borderStyle: 'dashed',
// //   },
// //   lockIcon: {
// //     backgroundColor: 'rgba(36, 173, 12, 0.1)',
// //     padding: 20,
// //     borderRadius: 50,
// //     marginBottom: 16,
// //   },
// //   unlockTitle: {
// //     fontSize: 24,
// //     fontWeight: '700',
// //     color: '#24ad0cff',
// //     textAlign: 'center',
// //     marginBottom: 8,
// //   },
// //   unlockSubtitle: {
// //     fontSize: 16,
// //     color: '#CCCCCC',
// //     textAlign: 'center',
// //     lineHeight: 22,
// //   },
// //   benefitsGrid: {
// //     backgroundColor: '#111111',
// //     padding: 20,
// //     borderRadius: 16,
// //     marginBottom: 20,
// //   },
// //   benefitsTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#FFFFFF',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   benefitItem: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     marginBottom: 20,
// //     padding: 12,
// //     backgroundColor: 'rgba(36, 173, 12, 0.05)',
// //     borderRadius: 12,
// //   },
// //   benefitIcon: {
// //     marginRight: 12,
// //     marginTop: 2,
// //   },
// //   benefitText: {
// //     flex: 1,
// //   },
// //   benefitHeader: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#FFFFFF',
// //     marginBottom: 4,
// //   },
// //   benefitDescription: {
// //     fontSize: 14,
// //     color: '#CCCCCC',
// //     lineHeight: 18,
// //   },
// //   ctaSection: {
// //     backgroundColor: '#111111',
// //     padding: 24,
// //     borderRadius: 20,
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: '#24ad0cff',
// //   },
// //   ctaTitle: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: '#24ad0cff',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   ctaDescription: {
// //     fontSize: 14,
// //     color: '#CCCCCC',
// //     textAlign: 'center',
// //     lineHeight: 20,
// //     marginBottom: 24,
// //   },
// //   scanNowBigButton: {
// //     backgroundColor: '#24ad0cff',
// //     padding: 20,
// //     borderRadius: 16,
// //     width: '100%',
// //     marginBottom: 20,
// //   },
// //   scanButtonContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   scanNowBigText: {
// //     color: '#000000',
// //     fontWeight: '700',
// //     fontSize: 18,
// //     marginLeft: 12,
// //     textAlign: 'center',
// //   },
// //   scanNowSubtext: {
// //     color: '#000000',
// //     fontSize: 12,
// //     marginLeft: 12,
// //     textAlign: 'center',
// //     opacity: 0.8,
// //   },
// //   communityStats: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     width: '100%',
// //   },
// //   communityStat: {
// //     color: '#24ad0cff',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   // Existing styles remain the same...
// //   statsCard: {
// //     backgroundColor: '#111111',
// //     padding: 20,
// //     borderRadius: 16,
// //     marginBottom: 16,
// //     borderLeftWidth: 4,
// //     borderLeftColor: '#24ad0cff',
// //   },
// //   statsTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#FFFFFF',
// //     marginBottom: 16,
// //   },
// //   statsGrid: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 16,
// //   },
// //   statItem: {
// //     alignItems: 'center',
// //   },
// //   statNumber: {
// //     fontSize: 24,
// //     fontWeight: '700',
// //     color: '#24ad0cff',
// //     marginBottom: 4,
// //   },
// //   statLabel: {
// //     fontSize: 12,
// //     color: '#CCCCCC',
// //   },
// //   achievements: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 8,
// //     marginBottom: 12,
// //   },
// //   achievementText: {
// //     color: '#FFD700',
// //     fontSize: 12,
// //     fontWeight: '600',
// //     backgroundColor: 'rgba(255, 215, 0, 0.1)',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //   },
// //   milestoneText: {
// //     color: '#24ad0cff',
// //     fontSize: 12,
// //     fontWeight: '600',
// //     textAlign: 'center',
// //   },
// //   promoCard: {
// //     backgroundColor: 'rgba(36, 173, 12, 0.1)',
// //     padding: 20,
// //     borderRadius: 16,
// //     marginBottom: 20,
// //     borderWidth: 2,
// //     borderColor: '#24ad0cff',
// //     borderStyle: 'dashed',
// //   },
// //   promoContent: {
// //     alignItems: 'center',
// //   },
// //   promoTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#24ad0cff',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   promoText: {
// //     fontSize: 14,
// //     color: '#CCCCCC',
// //     textAlign: 'center',
// //     lineHeight: 20,
// //     marginBottom: 16,
// //   },
// //   promoButton: {
// //     flexDirection: 'row',
// //     backgroundColor: '#24ad0cff',
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //   },
// //   promoButtonText: {
// //     color: '#000000',
// //     fontWeight: '700',
// //     fontSize: 16,
// //     marginLeft: 8,
// //   },
// //   recommendationsHeader: {
// //     marginBottom: 16,
// //   },
// //   recommendationsTitle: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: '#FFFFFF',
// //     marginBottom: 4,
// //   },
// //   recommendationsSubtitle: {
// //     fontSize: 14,
// //     color: '#666666',
// //   },
// //   listContent: {
// //     paddingBottom: 20,
// //   },
// //   recommendationCard: {
// //     backgroundColor: '#111111',
// //     padding: 16,
// //     borderRadius: 12,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: '#222222',
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     marginBottom: 12,
// //   },
// //   headerRight: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   matchInfo: {
// //     flex: 1,
// //   },
// //   league: {
// //     fontSize: 14,
// //     color: '#24ad0cff',
// //     fontWeight: '600',
// //     marginBottom: 2,
// //   },
// //   time: {
// //     fontSize: 12,
// //     color: '#666666',
// //   },
// //   trendingBadge: {
// //     flexDirection: 'row',
// //     backgroundColor: '#FF4444',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //     alignItems: 'center',
// //   },
// //   trendingText: {
// //     color: '#FFFFFF',
// //     fontSize: 10,
// //     fontWeight: '600',
// //     marginLeft: 4,
// //   },
// //   riskEmoji: {
// //     fontSize: 16,
// //   },
// //   teams: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#FFFFFF',
// //     marginBottom: 16,
// //     lineHeight: 24,
// //   },
// //   confidenceSection: {
// //     marginBottom: 16,
// //   },
// //   confidenceHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   confidenceLabel: {
// //     fontSize: 14,
// //     color: '#CCCCCC',
// //     fontWeight: '600',
// //   },
// //   confidenceValue: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //   },
// //   confidenceBar: {
// //     height: 6,
// //     backgroundColor: '#333333',
// //     borderRadius: 3,
// //     overflow: 'hidden',
// //     marginBottom: 4,
// //   },
// //   confidenceFill: {
// //     height: '100%',
// //     borderRadius: 3,
// //   },
// //   dataPoints: {
// //     fontSize: 11,
// //     color: '#666666',
// //     textAlign: 'right',
// //   },
// //   sectionTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#FFFFFF',
// //     marginBottom: 8,
// //   },
// //   injuryReport: {
// //     marginBottom: 12,
// //   },
// //   injuryItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 4,
// //   },
// //   injuryText: {
// //     fontSize: 12,
// //     color: '#CCCCCC',
// //     marginLeft: 8,
// //     flex: 1,
// //   },
// //   formAnalysis: {
// //     marginBottom: 12,
// //   },
// //   formStats: {
// //     gap: 4,
// //   },
// //   formStat: {
// //     fontSize: 12,
// //     color: '#CCCCCC',
// //   },
// //   insights: {
// //     marginBottom: 12,
// //   },
// //   insightItem: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     marginBottom: 6,
// //   },
// //   insightText: {
// //     fontSize: 12,
// //     color: '#CCCCCC',
// //     marginLeft: 8,
// //     flex: 1,
// //     lineHeight: 16,
// //   },
// //   valueSection: {
// //     backgroundColor: 'rgba(57, 255, 20, 0.1)',
// //     padding: 12,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },
// //   valueTitle: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: '#24ad0cff',
// //     marginBottom: 4,
// //   },
// //   oddsText: {
// //     fontSize: 12,
// //     color: '#FFFFFF',
// //     fontWeight: '600',
// //     marginBottom: 4,
// //   },
// //   valueAdvice: {
// //     fontSize: 11,
// //     color: '#CCCCCC',
// //     fontStyle: 'italic',
// //   },
// //   actionButtons: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
// //   scanButton: {
// //     flex: 2,
// //     flexDirection: 'row',
// //     backgroundColor: '#24ad0cff',
// //     padding: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   scanButtonText: {
// //     color: '#000000',
// //     fontWeight: '600',
// //     fontSize: 14,
// //     marginLeft: 8,
// //   },
// //   saveButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     backgroundColor: 'transparent',
// //     padding: 12,
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#24ad0cff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   savedButton: {
// //     backgroundColor: 'rgba(57, 255, 20, 0.1)',
// //     borderColor: '#24ad0cff',
// //   },
// //   saveButtonText: {
// //     color: '#24ad0cff',
// //     fontWeight: '600',
// //     fontSize: 14,
// //     marginLeft: 6,
// //   },
// //   savedButtonText: {
// //     color: '#24ad0cff',
// //     fontWeight: '700',
// //   },
// //   emptyState: {
// //     alignItems: 'center',
// //     padding: 40,
// //     backgroundColor: '#111111',
// //     borderRadius: 16,
// //     marginBottom: 20,
// //   },
// //   emptyStateTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#FFFFFF',
// //     marginTop: 16,
// //     marginBottom: 8,
// //   },
// //   emptyStateText: {
// //     fontSize: 14,
// //     color: '#666666',
// //     textAlign: 'center',
// //     lineHeight: 20,
// //     marginBottom: 20,
// //   },
// //   emptyStateButton: {
// //     backgroundColor: '#24ad0cff',
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     borderRadius: 12,
// //   },
// //   emptyStateButtonText: {
// //     color: '#000000',
// //     fontWeight: '600',
// //     fontSize: 16,
// //   },
// //   ctaCard: {
// //     backgroundColor: '#111111',
// //     padding: 20,
// //     borderRadius: 16,
// //     marginBottom: 30,
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: '#24ad0cff',
// //   },
// //   ctaTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#24ad0cff',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   ctaText: {
// //     fontSize: 14,
// //     color: '#CCCCCC',
// //     textAlign: 'center',
// //     lineHeight: 20,
// //     marginBottom: 16,
// //   },
// //   ctaButton: {
// //     flexDirection: 'row',
// //     backgroundColor: '#24ad0cff',
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //   },
// //   ctaButtonText: {
// //     color: '#000000',
// //     fontWeight: '700',
// //     fontSize: 16,
// //     marginLeft: 8,
// //   },
// // });

// // export default ForYouScreen;



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   RefreshControl,
//   FlatList,
//   Alert,
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width } = Dimensions.get('window');
// const API_BASE_URL = 'http://192.168.1.104:8000/api';

// const ForYouScreen = ({ navigation }) => {
//   const [refreshing, setRefreshing] = useState(false);
//   const [recommendations, setRecommendations] = useState([]);
//   const [userStats, setUserStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [communityInsights, setCommunityInsights] = useState({});
//   const [hasScannedBefore, setHasScannedBefore] = useState(false);
//   const [pulseAnim] = useState(new Animated.Value(1));
//   const [fadeAnim] = useState(new Animated.Value(0));

//   // Animations
//   useEffect(() => {
//     const pulse = () => {
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ]).start(() => pulse());
//     };
//     pulse();

//     // Fade in animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   useEffect(() => {
//     checkScanStatus();
//   }, []);

//   const checkScanStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       const response = await fetch(`${API_BASE_URL}/check-scan-status/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       const data = await response.json();
//       setHasScannedBefore(data.has_scanned);
      
//       if (data.has_scanned) {
//         await loadRecommendations();
//         await loadUserStats();
//       } else {
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error('Error checking scan status:', error);
//       setLoading(false);
//     }
//   };

//   const loadRecommendations = async () => {
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       const response = await fetch(`${API_BASE_URL}/bets/ai-recommendations/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         setRecommendations(data.recommendations || []);
//         setCommunityInsights(data.community_insights || {});
//       }
//     } catch (error) {
//       console.error('Error loading recommendations:', error);
//       setRecommendations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUserStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       const response = await fetch(`${API_BASE_URL}/bets/user-scan-stats/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       const data = await response.json();
//       setUserStats(data);
//     } catch (error) {
//       console.error('Error loading user stats:', error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await checkScanStatus();
//     setRefreshing(false);
//   };

//   const handleQuickScan = () => {
//     navigation.navigate('Analysis');
//   };

//   const handleSaveRecommendation = async (recommendation) => {
//     if (!hasScannedBefore) {
//       showScanPrompt();
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('access_token');
      
//       const saveData = {
//         home_team: recommendation.home_team,
//         away_team: recommendation.away_team,
//         league: recommendation.league,
//         confidence_score: recommendation.confidence,
//         risk_level: recommendation.risk_level,
//         analysis_data: {
//           insights: recommendation.insights || [],
//           injury_report: recommendation.injury_report || [],
//           form_analysis: recommendation.form_analysis || {},
//           potential_odds: recommendation.potential_odds
//         },
//         notes: `AI Recommended - ${recommendation.confidence}% confidence`
//       };

//       const response = await fetch(`${API_BASE_URL}/bets/save-match/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(saveData),
//       });
      
//       const result = await response.json();
      
//       if (response.ok) {
//         Alert.alert('✅ Saved!', 'Match saved to your favorites');
//         setRecommendations(prev => prev.map(rec => 
//           rec.id === recommendation.id 
//             ? { ...rec, is_saved: true, saved_match_id: result.saved_match?.id }
//             : rec
//         ));
//       } else if (result.already_saved) {
//         Alert.alert('💾 Already Saved', 'This match is already in your favorites!');
//       } else {
//         throw new Error(result.error || 'Save failed');
//       }
//     } catch (error) {
//       console.error('Save recommendation error:', error);
//       Alert.alert('Error', error.message || 'Failed to save match');
//     }
//   };

//   const showScanPrompt = () => {
//     Alert.alert(
//       '🔒 Premium Features Locked',
//       'Scan your bet slip to unlock AI predictions, risk analysis, and save features!',
//       [
//         { text: 'Maybe Later', style: 'cancel' },
//         { 
//           text: '🔓 Scan Now', 
//           onPress: handleQuickScan,
//           style: 'default'
//         }
//       ]
//     );
//   };

//   const renderLockedPreview = () => (
//     <Animated.View style={[styles.unlockContainer, { opacity: fadeAnim }]}>
      
//       {/* Hero Section with Animated Lock */}
//       <Animated.View 
//         style={[
//           styles.heroSection,
//           { transform: [{ scale: pulseAnim }] }
//         ]}
//       >
//         <View style={styles.heroContent}>
//           <View style={styles.lockContainer}>
//             <Icon name="lock" size={50} color="#24ad0cff" />
//             <View style={styles.sparkle}>
//               <Text style={styles.sparkleText}>✨</Text>
//             </View>
//           </View>
//           <Text style={styles.heroTitle}>Unlock AI Bet Intelligence</Text>
//           <Text style={styles.heroSubtitle}>
//             Scan your first bet slip to reveal powerful insights and predictions
//           </Text>
//         </View>
//       </Animated.View>

//       {/* Teaser Cards - Show what they're missing */}
//       <View style={styles.teaserSection}>
//         <Text style={styles.teaserTitle}>🚀 What's Waiting For You:</Text>
        
//         {/* Teaser Card 1 */}
//         <View style={styles.teaserCard}>
//           <View style={styles.teaserHeader}>
//             <View style={styles.teaserIcon}>
//               <Icon name="psychology" size={28} color="#24ad0cff" />
//             </View>
//             <View>
//               <Text style={styles.teaserCardTitle}>AI Predictions</Text>
//               <Text style={styles.teaserCardSubtitle}>Confidence scores & risk analysis</Text>
//             </View>
//           </View>
//           <View style={styles.lockedPreview}>
//             <Text style={styles.lockedText}>🔒 92% Confidence Score</Text>
//             <Text style={styles.lockedText}>🔒 Low Risk Match</Text>
//             <Text style={styles.lockedText}>🔒 15+ Data Points Analyzed</Text>
//           </View>
//         </View>

//         {/* Teaser Card 2 */}
//         <View style={styles.teaserCard}>
//           <View style={styles.teaserHeader}>
//             <View style={styles.teaserIcon}>
//               <Icon name="insights" size={28} color="#24ad0cff" />
//             </View>
//             <View>
//               <Text style={styles.teaserCardTitle}>Smart Insights</Text>
//               <Text style={styles.teaserCardSubtitle}>Injury reports & form analysis</Text>
//             </View>
//           </View>
//           <View style={styles.lockedPreview}>
//             <Text style={styles.lockedText}>🔒 Injury Reports</Text>
//             <Text style={styles.lockedText}>🔒 Team Form Analysis</Text>
//             <Text style={styles.lockedText}>🔒 Betting Value Indicators</Text>
//           </View>
//         </View>

//         {/* Teaser Card 3 */}
//         <View style={styles.teaserCard}>
//           <View style={styles.teaserHeader}>
//             <View style={styles.teaserIcon}>
//               <Icon name="trending-up" size={28} color="#24ad0cff" />
//             </View>
//             <View>
//               <Text style={styles.teaserCardTitle}>Personalized Picks</Text>
//               <Text style={styles.teaserCardSubtitle}>Tailored to your betting style</Text>
//             </View>
//           </View>
//           <View style={styles.lockedPreview}>
//             <Text style={styles.lockedText}>🔒 Custom Recommendations</Text>
//             <Text style={styles.lockedText}>🔒 Risk Profile Analysis</Text>
//             <Text style={styles.lockedText}>🔒 Success Rate Tracking</Text>
//           </View>
//         </View>
//       </View>

      

//       {/* Community Proof */}
//       <View style={styles.communitySection}>
//         <Text style={styles.communityTitle}>Join Thousands of Winning Bettors</Text>
//         <View style={styles.statsGrid}>
//           <View style={styles.statBox}>
//             <Text style={styles.statNumber}>12K+</Text>
//             <Text style={styles.statLabel}>Daily Scans</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statNumber}>68%</Text>
//             <Text style={styles.statLabel}>Success Rate</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statNumber}>4.8★</Text>
//             <Text style={styles.statLabel}>Rating</Text>
//           </View>
//         </View>
//       </View>

//       {/* Big Scan CTA */}
//       <Animated.View 
//         style={[
//           styles.ctaSection,
//           { transform: [{ scale: pulseAnim }] }
//         ]}
//       >
//         <View style={styles.ctaContent}>
//           <Text style={styles.ctaTitle}>Ready to See Your Winning Edge?</Text>
//           <Text style={styles.ctaDescription}>
//             Discover hidden opportunities and make smarter bets with AI-powered analysis
//           </Text>
          
//           <TouchableOpacity 
//             style={styles.scanCtaButton}
//             onPress={handleQuickScan}
//           >
//             <View style={styles.scanButtonInner}>
//               <Icon name="camera-alt" size={32} color="#000" />
//               <View style={styles.scanTextContainer}>
//                 <Text style={styles.scanCtaMainText}>SCAN BET SLIP</Text>
//                 <Text style={styles.scanCtaSubText}>Unlock AI Predictions</Text>
//               </View>
//               <Icon name="chevron-right" size={24} color="#000" />
//             </View>
//           </TouchableOpacity>

//           <View style={styles.guaranteeBadge}>
//             <Icon name="verified" size={16} color="#24ad0cff" />
//             <Text style={styles.guaranteeText}>First scan reveals immediate insights</Text>
//           </View>
//         </View>
//       </Animated.View>

//       {/* Floating Quick Actions */}
//       <View style={styles.floatingActions}>
//         <TouchableOpacity style={styles.floatingButton} onPress={handleQuickScan}>
//           <Icon name="flash-on" size={20} color="#000" />
//           <Text style={styles.floatingButtonText}>Quick Scan</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.floatingButton} onPress={handleQuickScan}>
//           <Icon name="search" size={20} color="#000" />
//           <Text style={styles.floatingButtonText}>Analyze</Text>
//         </TouchableOpacity>
//       </View>
//     </Animated.View>
//   );

//   const renderRecommendation = ({ item }) => (
//     <View style={styles.recommendationCard}>
//       {/* Header with Lock Status */}
//       <View style={styles.cardHeader}>
//         <View style={styles.matchInfo}>
//           <Text style={[styles.league,{color:'#666666'}]}>{item.league}</Text>
//           <Text style={[styles.time,{color:'#666666'}]}>{item.match_time}</Text>
//         </View>
//         <View style={styles.premiumBadge}>
//           <Icon name="workspace-premium" size={16} color="#FFD700" />
//           <Text style={styles.premiumText}>AI SCANNED</Text>
//         </View>
//       </View>

//       <Text style={styles.teams}>{item.home_team} vs {item.away_team}</Text>

//       {/* Confidence Meter - Always visible to show value */}
//       <View style={styles.confidenceSection}>
//         <View style={styles.confidenceHeader}>
//           <Text style={styles.confidenceLabel}>AI CONFIDENCE</Text>
//           <Text style={[styles.confidenceValue, { color: getConfidenceColor(item.confidence) }]}>
//             <Icon name="lock" size={20} color='#fff' />
//             %
//           </Text>
//         </View>
//         <View style={styles.confidenceBar}>
//           <View 
//             style={[
//               styles.confidenceFill,
//               { 
//                 width: `${item.confidence}%`,
//                 backgroundColor: getConfidenceColor(item.confidence)
//               }
//             ]} 
//           />
//         </View>
//       </View>

//       {/* Locked Insights Preview */}
//       <View style={styles.insightsPreview}>
//         <Text style={styles.previewTitle}>🔍 AI Insights Available:</Text>
//         <View style={styles.previewGrid}>
//           <View style={styles.previewItem}>
//             <Icon name="warning" size={14} color="#24ad0cff" />
//             <Text style={styles.previewText}>Risk Analysis</Text>
//           </View>
//           <View style={styles.previewItem}>
//             <Icon name="local-hospital" size={14} color="#24ad0cff" />
//             <Text style={styles.previewText}>Injury Report</Text>
//           </View>
//           <View style={styles.previewItem}>
//             <Icon name="trending-up" size={14} color="#24ad0cff" />
//             <Text style={styles.previewText}>Form Analysis</Text>
//           </View>
//           <View style={styles.previewItem}>
//             <Icon name="attach-money" size={14} color="#24ad0cff" />
//             <Text style={styles.previewText}>Value Rating</Text>
//           </View>
//         </View>
//       </View>

//       {/* Scan to Unlock CTA */}
//       <TouchableOpacity 
//         style={styles.unlockCta}
//         onPress={handleQuickScan}
//       >
//         <View style={styles.unlockCtaContent}>
          
//           <Text style={styles.unlockCtaText}>SCAN TO SEE WINNING</Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );

//   const getConfidenceColor = (confidence) => {
//     if (confidence >= 80) return '#24ad0cff';
//     if (confidence >= 70) return '#FFA500';
//     if (confidence >= 60) return '#FF6B35';
//     return '#FF4444';
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#24ad0cff" />
//         <Text style={styles.loadingText}>Unlocking AI Insights...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.title}>AI Bet Scanner</Text>
//           <Text style={styles.subtitle}>
//             {hasScannedBefore ? 'Your AI-Powered Insights' : 'Scan to Unlock Winning Edge'}
//           </Text>
//         </View>
//         <TouchableOpacity 
//           style={styles.scanHeaderButton}
//           onPress={handleQuickScan}
//         >
//           <Icon name="camera-alt" size={20} color="#000" />
//           <Text style={styles.scanHeaderText}>Scan</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#24ad0cff']}
//             tintColor="#24ad0cff"
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {!hasScannedBefore ? (
//           renderLockedPreview()
//         ) : (
//           <>
//             {/* User Stats */}
//             {userStats && (
//               <View style={styles.statsCard}>
//                 <Text style={styles.statsTitle}>Your AI Journey</Text>
//                 <View style={styles.statsGrid}>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statNumber}>{userStats.total_scans}</Text>
//                     <Text style={styles.statLabel}>Scans</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statNumber}>{userStats.scan_streak}</Text>
//                     <Text style={styles.statLabel}>Day Streak</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statNumber}>₦{userStats.estimated_savings}</Text>
//                     <Text style={styles.statLabel}>Value</Text>
//                   </View>
//                 </View>
//               </View>
//             )}

//             {/* Scan More CTA */}
//             <TouchableOpacity style={styles.scanMoreCard} onPress={handleQuickScan}>
//               <Icon name="add-circle" size={24} color="#24ad0cff" />
//               <Text style={styles.scanMoreText}>Scan Another Bet for Fresh Insights</Text>
//               <Icon name="chevron-right" size={20} color="#24ad0cff" />
//             </TouchableOpacity>

//             {/* Recommendations */}
//             <View style={styles.recommendationsHeader}>
//               <Text style={styles.recommendationsTitle}>🎯 AI Recommended Matches</Text>
//               <Text style={styles.recommendationsSubtitle}>
//                 Based on your {userStats?.total_scans || 0} scans
//               </Text>
//             </View>

//             {recommendations.length > 0 ? (
//               <FlatList
//                 data={recommendations}
//                 renderItem={renderRecommendation}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//                 contentContainerStyle={styles.listContent}
//               />
//             ) : (
//               <View style={styles.emptyState}>
//                 <Icon name="auto-awesome" size={60} color="#666" />
//                 <Text style={styles.emptyStateTitle}>Scan More for Better Picks</Text>
//                 <Text style={styles.emptyStateText}>
//                   The more you scan, the smarter your AI recommendations become
//                 </Text>
//                 <TouchableOpacity 
//                   style={styles.emptyStateButton}
//                   onPress={handleQuickScan}
//                 >
//                   <Text style={styles.emptyStateButtonText}>Scan Now</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//     paddingHorizontal: 16,
//     paddingTop: 60,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: '#000000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#24ad0cff',
//     fontSize: 16,
//     marginTop: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//     marginTop: -40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#24ad0cff',
//   },
//   scanHeaderButton: {
//     flexDirection: 'row',
//     backgroundColor: '#24ad0cff',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   scanHeaderText: {
//     color: '#000000',
//     fontWeight: '600',
//     fontSize: 14,
//     marginLeft: 6,
//   },
//   // Locked Preview Styles
//   unlockContainer: {
//     flex: 1,
//     paddingVertical: 10,
//   },
//   heroSection: {
//     backgroundColor: '#111111',
//     padding: 30,
//     borderRadius: 20,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: '#24ad0cff',
//     alignItems: 'center',
//   },
//   heroContent: {
//     alignItems: 'center',
//   },
//   lockContainer: {
//     position: 'relative',
//     marginBottom: 20,
//   },
//   sparkle: {
//     position: 'absolute',
//     top: -10,
//     right: -10,
//   },
//   sparkleText: {
//     fontSize: 20,
//   },
//   heroTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#24ad0cff',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: '#CCCCCC',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   teaserSection: {
//     marginBottom: 20,
//   },
//   teaserTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   teaserCard: {
//     backgroundColor: '#111111',
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#24ad0cff',
//   },
//   teaserHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   teaserIcon: {
//     marginRight: 12,
//   },
//   teaserCardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   teaserCardSubtitle: {
//     fontSize: 14,
//     color: '#24ad0cff',
//   },
//   lockedPreview: {
//     backgroundColor: 'rgba(36, 173, 12, 0.05)',
//     padding: 12,
//     borderRadius: 8,
//   },
//   lockedText: {
//     color: '#24ad0cff',
//     fontSize: 12,
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   communitySection: {
//     backgroundColor: '#111111',
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   communityTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   statBox: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#24ad0cff',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#CCCCCC',
//   },
//   ctaSection: {
//     backgroundColor: '#111111',
//     padding: 24,
//     borderRadius: 20,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: '#24ad0cff',
//   },
//   ctaContent: {
//     alignItems: 'center',
//   },
//   ctaTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#24ad0cff',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   ctaDescription: {
//     fontSize: 14,
//     color: '#CCCCCC',
//     textAlign: 'center',
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   scanCtaButton: {
//     backgroundColor: '#24ad0cff',
//     padding: 20,
//     borderRadius: 16,
//     width: '100%',
//     marginBottom: 16,
//   },
//   scanButtonInner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   scanTextContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   scanCtaMainText: {
//     color: '#000000',
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   scanCtaSubText: {
//     color: '#000000',
//     fontSize: 12,
//     opacity: 0.8,
//   },
//   guaranteeBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   guaranteeText: {
//     color: '#24ad0cff',
//     fontSize: 12,
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   floatingActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   floatingButton: {
//     flexDirection: 'row',
//     backgroundColor: '#24ad0cff',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 6,
//     justifyContent: 'center',
//   },
//   floatingButtonText: {
//     color: '#000000',
//     fontWeight: '600',
//     fontSize: 14,
//     marginLeft: 6,
//   },
//   // Recommendation Card Styles
//   recommendationCard: {
//     backgroundColor: '#111111',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   premiumBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 215, 0, 0.1)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   premiumText: {
//     color: '#FFD700',
//     fontSize: 10,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   teams: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   confidenceSection: {
//     marginBottom: 16,
//   },
//   confidenceHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   confidenceLabel: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     fontWeight: '600',
//   },
//   confidenceValue: {
//     fontSize: 22,
//     fontWeight: '700',
//   },
//   confidenceBar: {
//     height: 6,
//     backgroundColor: '#333333',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   confidenceFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   insightsPreview: {
//     marginBottom: 16,
//   },
//   previewTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   previewGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   previewItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(36, 173, 12, 0.1)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     flex: 1,
//     minWidth: '48%',
//     justifyContent: 'center',
//   },
//   previewText: {
//     color: '#24ad0cff',
//     fontSize: 10,
//     fontWeight: '500',
//     marginLeft: 4,
//   },
//   unlockCta: {
//     backgroundColor: '#24ad0cff',
//     padding: 12,
//     borderRadius: 8,
//   },
//   unlockCtaContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   unlockCtaText: {
//     color: '#000000',
//     fontWeight: '700',
//     fontSize: 14,
//     marginLeft: 8,
//   },
//   // Existing styles for scanned users
//   statsCard: {
//     backgroundColor: '#111111',
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#24ad0cff',
//   },
//   statsTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 16,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#24ad0cff',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#CCCCCC',
//   },
//   scanMoreCard: {
//     flexDirection: 'row',
//     backgroundColor: 'rgba(36, 173, 12, 0.1)',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#24ad0cff',
//   },
//   scanMoreText: {
//     color: '#24ad0cff',
//     fontWeight: '600',
//     fontSize: 14,
//     marginLeft: 8,
//     flex: 1,
//   },
//   recommendationsHeader: {
//     marginBottom: 16,
//   },
//   recommendationsTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   recommendationsSubtitle: {
//     fontSize: 14,
//     color: '#666666',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 40,
//     backgroundColor: '#111111',
//     borderRadius: 16,
//     marginBottom: 20,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: '#666666',
//     textAlign: 'center',
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   emptyStateButton: {
//     backgroundColor: '#24ad0cff',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   emptyStateButtonText: {
//     color: '#000000',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default ForYouScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.43.73:8000/api';

const ForYouScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [communityInsights, setCommunityInsights] = useState({});
  const [hasScannedBefore, setHasScannedBefore] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Animations
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    checkScanStatus();
  }, []);

  const checkScanStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/check-scan-status/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      setHasScannedBefore(data.has_scanned);
      
      if (data.has_scanned) {
        await loadSuggestions();
        await loadUserStats();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking scan status:', error);
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/bets/ai-recommendations/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuggestions(data.suggestions || []);
        setCommunityInsights(data.community_insights || {});
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/bets/user-scan-stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkScanStatus();
    setRefreshing(false);
  };

  const handleQuickScan = () => {
    navigation.navigate('Analysis');
  };

  const handleSaveMatch = async (match) => {
    if (!hasScannedBefore) {
      showScanPrompt();
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      
      const saveData = {
        home_team: match.home_team,
        away_team: match.away_team,
        league: match.league,
        notes: 'Saved from featured matches'
      };

      const response = await fetch(`${API_BASE_URL}/bets/save-match/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('✅ Saved!', 'Match saved to your favorites');
        setSuggestions(prev => prev.map(item => 
          item.id === match.id 
            ? { ...item, is_saved: true }
            : item
        ));
      } else if (result.already_saved) {
        Alert.alert('💾 Already Saved', 'This match is already in your favorites!');
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save match error:', error);
      Alert.alert('Error', error.message || 'Failed to save match');
    }
  };

  const showScanPrompt = () => {
    Alert.alert(
      '🔒 Premium Features Locked',
      'Scan your bet slip to unlock AI analysis and save features!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { 
          text: '🔓 Scan Now', 
          onPress: handleQuickScan,
          style: 'default'
        }
      ]
    );
  };

  const renderLockedPreview = () => (
    <Animated.View style={[styles.unlockContainer, { opacity: fadeAnim }]}>
      
      {/* Hero Section with Animated Lock */}
      <Animated.View 
        style={[
          styles.heroSection,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <View style={styles.heroContent}>
          <View style={styles.lockContainer}>
            <Icon name="lock" size={50} color="#24ad0cff" />
            <View style={styles.sparkle}>
              <Text style={styles.sparkleText}>✨</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Unlock AI Bet Intelligence</Text>
          <Text style={styles.heroSubtitle}>
            Scan your first bet slip to reveal powerful insights and predictions
          </Text>
        </View>
      </Animated.View>

      {/* Teaser Cards - Show what they're missing */}
      <View style={styles.teaserSection}>
        <Text style={styles.teaserTitle}>🚀 What's Waiting For You:</Text>
        
        {/* Teaser Card 1 */}
        <View style={styles.teaserCard}>
          <View style={styles.teaserHeader}>
            <View style={styles.teaserIcon}>
              <Icon name="psychology" size={28} color="#24ad0cff" />
            </View>
            <View>
              <Text style={styles.teaserCardTitle}>AI Risk Analysis</Text>
              <Text style={styles.teaserCardSubtitle}>Identify risky bets before you place them</Text>
            </View>
          </View>
          <View style={styles.lockedPreview}>
            <Text style={styles.lockedText}>🔒 Confidence Scoring</Text>
            <Text style={styles.lockedText}>🔒 Risk Level Assessment</Text>
            <Text style={styles.lockedText}>🔒 Value Bet Identification</Text>
          </View>
        </View>

        {/* Teaser Card 2 */}
        <View style={styles.teaserCard}>
          <View style={styles.teaserHeader}>
            <View style={styles.teaserIcon}>
              <Icon name="insights" size={28} color="#24ad0cff" />
            </View>
            <View>
              <Text style={styles.teaserCardTitle}>Smart Insights</Text>
              <Text style={styles.teaserCardSubtitle}>Injury reports & form analysis</Text>
            </View>
          </View>
          <View style={styles.lockedPreview}>
            <Text style={styles.lockedText}>🔒 Injury Reports</Text>
            <Text style={styles.lockedText}>🔒 Team Form Analysis</Text>
            <Text style={styles.lockedText}>🔒 Head-to-Head Statistics</Text>
          </View>
        </View>

        {/* Teaser Card 3 */}
        <View style={styles.teaserCard}>
          <View style={styles.teaserHeader}>
            <View style={styles.teaserIcon}>
              <Icon name="trending-up" size={28} color="#24ad0cff" />
            </View>
            <View>
              <Text style={styles.teaserCardTitle}>Personalized Picks</Text>
              <Text style={styles.teaserCardSubtitle}>Tailored to your betting style</Text>
            </View>
          </View>
          <View style={styles.lockedPreview}>
            <Text style={styles.lockedText}>🔒 Custom Recommendations</Text>
            <Text style={styles.lockedText}>🔒 Risk Profile Analysis</Text>
            <Text style={styles.lockedText}>🔒 Success Rate Tracking</Text>
          </View>
        </View>
      </View>

      {/* Community Proof */}
      <View style={styles.communitySection}>
        <Text style={styles.communityTitle}>Join Thousands of Winning Bettors</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12K+</Text>
            <Text style={styles.statLabel}>Daily Scans</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>68%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.8★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Big Scan CTA */}
      <Animated.View 
        style={[
          styles.ctaSection,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <View style={styles.ctaContent}>
          <Text style={styles.ctaTitle}>Ready to See Your Winning Edge?</Text>
          <Text style={styles.ctaDescription}>
            Discover hidden opportunities and make smarter bets with AI-powered analysis
          </Text>
          
          <TouchableOpacity 
            style={styles.scanCtaButton}
            onPress={handleQuickScan}
          >
            <View style={styles.scanButtonInner}>
              <Icon name="camera-alt" size={32} color="#000" />
              <View style={styles.scanTextContainer}>
                <Text style={styles.scanCtaMainText}>SCAN BET SLIP</Text>
                <Text style={styles.scanCtaSubText}>Unlock AI Analysis</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#000" />
            </View>
          </TouchableOpacity>

          <View style={styles.guaranteeBadge}>
            <Icon name="verified" size={16} color="#24ad0cff" />
            <Text style={styles.guaranteeText}>First scan reveals immediate insights</Text>
          </View>
        </View>
      </Animated.View>

      {/* Floating Quick Actions */}
      <View style={styles.floatingActions}>
        <TouchableOpacity style={styles.floatingButton} onPress={handleQuickScan}>
          <Icon name="flash-on" size={20} color="#000" />
          <Text style={styles.floatingButtonText}>Quick Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton} onPress={handleQuickScan}>
          <Icon name="search" size={20} color="#000" />
          <Text style={styles.floatingButtonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderMatchSuggestion = ({ item }) => (
    <View style={styles.matchCard}>
      {/* Header with Premium Badge */}
      <View style={styles.cardHeader}>
        <View style={styles.matchInfo}>
          <Text style={styles.league}>{item.league}</Text>
          <Text style={styles.time}>{item.match_time}</Text>
        </View>
        <View style={styles.premiumBadge}>
          <Icon name="workspace-premium" size={14} color="#FFD700" />
          <Text style={styles.premiumText}>AI CURATED</Text>
        </View>
      </View>

      {/* Teams */}
      <Text style={styles.teams}>{item.home_team} vs {item.away_team}</Text>

      {/* Venue */}
      {item.venue && item.venue !== 'TBD' && (
        <View style={styles.venueRow}>
          <Icon name="stadium" size={14} color="#666" />
          <Text style={styles.venue}>{item.venue}</Text>
        </View>
      )}

      {/* Mystery Confidence Indicator */}
      <View style={styles.mysterySection}>
        <View style={styles.mysteryHeader}>
          <Text style={styles.mysteryLabel}>AI ASSESSMENT</Text>
          <View style={styles.lockedIcon}>
            <Icon name="lock" size={16} color="#24ad0cff" />
          </View>
        </View>
        
        <View style={styles.mysteryGrid}>
          <View style={styles.mysteryItem}>
            <Icon name="psychology" size={16} color="#24ad0cff" />
            <Text style={styles.mysteryText}>Confidence Score</Text>
            <Text style={styles.mysteryValue}>???</Text>
          </View>
          <View style={styles.mysteryItem}>
            <Icon name="warning" size={16} color="#24ad0cff" />
            <Text style={styles.mysteryText}>Risk Level</Text>
            <Text style={styles.mysteryValue}>???</Text>
          </View>
          <View style={styles.mysteryItem}>
            <Icon name="insights" size={16} color="#24ad0cff" />
            <Text style={styles.mysteryText}>AI Insights</Text>
            <Text style={styles.mysteryValue}>???</Text>
          </View>
        </View>
      </View>

      {/* Scan to Reveal CTA */}
      <TouchableOpacity 
        style={styles.revealCta}
        onPress={handleQuickScan}
      >
        <View style={styles.revealContent}>
          <Icon name="visibility" size={20} color="#000" />
          <View style={styles.revealTextContainer}>
            <Text style={styles.revealMainText}>SCAN TO REVEAL AI ANALYSIS</Text>
            <Text style={styles.revealSubText}>See confidence scores & risk levels</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#000" />
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => handleSaveMatch(item)}
        >
          <Icon name="bookmark-border" size={18} color="#24ad0cff" />
          <Text style={styles.saveText}>Save Match</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.analyzeButton}
          onPress={handleQuickScan}
        >
          <Icon name="analytics" size={18} color="#000" />
          <Text style={styles.analyzeText}>Analyze Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#24ad0cff" />
        <Text style={styles.loadingText}>Loading featured matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Bet Scanner</Text>
          <Text style={styles.subtitle}>
            {hasScannedBefore ? 'Featured Matches' : 'Scan to Unlock AI Analysis'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.scanHeaderButton}
          onPress={handleQuickScan}
        >
          <Icon name="camera-alt" size={20} color="#000" />
          <Text style={styles.scanHeaderText}>Scan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#24ad0cff']}
            tintColor="#24ad0cff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {!hasScannedBefore ? (
          renderLockedPreview()
        ) : (
          <>
            {/* User Stats */}
            {userStats && (
              <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Your Scanning Journey</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userStats.total_scans}</Text>
                    <Text style={styles.statLabel}>Total Scans</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userStats.scan_streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userStats.user_level}</Text>
                    <Text style={styles.statLabel}>Level</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Scan More CTA */}
            <TouchableOpacity style={styles.scanMoreCard} onPress={handleQuickScan}>
              <Icon name="add-circle" size={24} color="#24ad0cff" />
              <Text style={styles.scanMoreText}>Scan Bet Slip for AI Analysis</Text>
              <Icon name="chevron-right" size={20} color="#24ad0cff" />
            </TouchableOpacity>

            {/* Featured Matches */}
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>🔥 Featured Matches</Text>
              <Text style={styles.suggestionsSubtitle}>
                Curated by AI for strong potential
              </Text>
            </View>

            {suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                renderItem={renderMatchSuggestion}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyState}>
                <Icon name="auto-awesome" size={60} color="#666" />
                <Text style={styles.emptyStateTitle}>Finding Your Best Matches</Text>
                <Text style={styles.emptyStateText}>
                  Our AI is analyzing current fixtures to find high-potential matches for you
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={handleQuickScan}
                >
                  <Text style={styles.emptyStateButtonText}>Scan for Immediate Analysis</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Community Insights */}
            {communityInsights && Object.keys(communityInsights).length > 0 && (
              <View style={styles.communityCard}>
                <Text style={styles.communityCardTitle}>Community Activity</Text>
                <View style={styles.communityStats}>
                  <View style={styles.communityStat}>
                    <Text style={styles.communityStatNumber}>
                      {communityInsights.total_scans_today || '2,000+'}
                    </Text>
                    <Text style={styles.communityStatLabel}>Scans Today</Text>
                  </View>
                  <View style={styles.communityStat}>
                    <Text style={styles.communityStatNumber}>
                      {communityInsights.success_rate || '68%'}
                    </Text>
                    <Text style={styles.communityStatLabel}>Success Rate</Text>
                  </View>
                </View>
                <Text style={styles.communityTip}>
                  💡 {communityInsights.user_tip || 'Scan regularly for better insights'}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#24ad0cff',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#24ad0cff',
  },
  scanHeaderButton: {
    flexDirection: 'row',
    backgroundColor: '#24ad0cff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanHeaderText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  // Locked Preview Styles
  unlockContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  heroSection: {
    backgroundColor: '#111111',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#24ad0cff',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  lockContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  sparkle: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkleText: {
    fontSize: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24ad0cff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
  },
  teaserSection: {
    marginBottom: 20,
  },
  teaserTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  teaserCard: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#24ad0cff',
  },
  teaserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teaserIcon: {
    marginRight: 12,
  },
  teaserCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  teaserCardSubtitle: {
    fontSize: 14,
    color: '#24ad0cff',
  },
  lockedPreview: {
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  lockedText: {
    color: '#24ad0cff',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  communitySection: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24ad0cff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  ctaSection: {
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#24ad0cff',
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#24ad0cff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  scanCtaButton: {
    backgroundColor: '#24ad0cff',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
  },
  scanButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scanCtaMainText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 18,
  },
  scanCtaSubText: {
    color: '#000000',
    fontSize: 12,
    opacity: 0.8,
  },
  guaranteeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guaranteeText: {
    color: '#24ad0cff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  floatingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  floatingButton: {
    flexDirection: 'row',
    backgroundColor: '#24ad0cff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    justifyContent: 'center',
  },
  floatingButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  // Match Card Styles
  matchCard: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matchInfo: {
    flex: 1,
  },
  league: {
    fontSize: 12,
    color: '#24ad0cff',
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#666666',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  teams: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  venue: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  // Mystery Section Styles
  mysterySection: {
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(36, 173, 12, 0.2)',
    borderStyle: 'dashed',
  },
  mysteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mysteryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#24ad0cff',
  },
  lockedIcon: {
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    padding: 4,
    borderRadius: 4,
  },
  mysteryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mysteryItem: {
    alignItems: 'center',
    flex: 1,
  },
  mysteryText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  mysteryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#24ad0cff',
    marginTop: 2,
  },
  revealCta: {
    backgroundColor: '#24ad0cff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  revealContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  revealTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  revealMainText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  revealSubText: {
    color: '#000',
    fontSize: 10,
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#24ad0cff',
  },
  saveText: {
    color: '#24ad0cff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
  analyzeButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#24ad0cff',
    paddingVertical: 12,
    borderRadius: 8,
  },
  analyzeText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
  // Stats and Community Styles
  statsCard: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#24ad0cff',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24ad0cff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  scanMoreCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#24ad0cff',
  },
  scanMoreText: {
    color: '#24ad0cff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  suggestionsHeader: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  suggestionsSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#111111',
    borderRadius: 16,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#24ad0cff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  communityCard: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  communityCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  communityStat: {
    alignItems: 'center',
  },
  communityStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#24ad0cff',
    marginBottom: 4,
  },
  communityStatLabel: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  communityTip: {
    fontSize: 14,
    color: '#24ad0cff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ForYouScreen;